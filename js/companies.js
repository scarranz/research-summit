// companies.js — grid, detail view, add-company modal
// All companies are loaded from Supabase. No hardcoded data.
import { FRAMEWORK, ALL_STOCKS } from './portal-data.js';
import { fetchCompanies, insertCompany, lookupTicker, fetchResources, insertResource, updateResource, deleteResource, uploadFile, getFileUrl, fetchExecutives, fetchInsiderTransactions, syncManagement, fetchAnalystRatings, syncRatings } from './api.js';
import { getOverview } from './overviews/index.js';

let _companies = []; // companies loaded from Supabase
let _pendingLookup = null; // data from ticker lookup
let _pendingLookupPromise = null;

// Escape HTML entities in user-sourced strings to prevent XSS
function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function showConfirmModal(title, detail, message, onConfirm) {
  var id = 'confirmModal_' + Date.now();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card" style="width:340px;text-align:center;padding:28px 32px;" onclick="event.stopPropagation()">' +
      '<div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--mu);font-weight:500;margin-bottom:14px">' + title + '</div>' +
      '<div style="font-size:14px;color:var(--text);margin-bottom:6px;font-weight:500">' + detail + '</div>' +
      '<div style="font-size:11px;color:var(--mu);margin-bottom:22px">' + message + '</div>' +
      '<div style="display:flex;gap:8px;justify-content:center">' +
        '<button class="modal-btn modal-btn--cancel" id="' + id + '_cancel">Cancel</button>' +
        '<button class="modal-btn" style="background:var(--neg);color:#fff" id="' + id + '_confirm">Delete</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.getElementById(id + '_cancel').addEventListener('click', function() { overlay.remove(); });
  document.getElementById(id + '_confirm').addEventListener('click', function() { overlay.remove(); onConfirm(); });
}

// Category display labels and order
var CATEGORY_META = {
  filing:     'Company Filings',
  financial:  'Reports',
  transcript: 'Transcripts & IR',
  media:      'Media & Podcasts',
  other:      'Other Resources',
};
var CATEGORY_ORDER = ['filing', 'financial', 'transcript', 'media', 'other'];

function logoFallback(img){
  var step = img.getAttribute('data-step') || '0';
  var domain = img.getAttribute('data-domain') || '';
  // Step 0: Parqet failed → try Google favicon
  if (step === '0' && domain) {
    img.setAttribute('data-step', '1');
    img.src = 'https://www.google.com/s2/favicons?sz=128&domain=' + domain;
    return;
  }
  // Step 1 (or no domain): show monogram
  var w = img.parentNode; w.classList.add('mono');
  var b = w.getAttribute('data-brand');
  if (b) { w.style.background = b; w.style.color = '#fff'; w.style.borderColor = 'transparent'; }
  w.textContent = w.getAttribute('data-mono');
}

function coLogo(c,cls){
  var ticker = c.ticker || '';
  var domain = c.logo_domain || '';
  var mono = c.mono || ticker.slice(0,2).toUpperCase();
  return '<div class="cologo'+(cls?' '+cls:'')+'" data-mono="'+mono+'">'+
    (ticker ? '<img src="https://assets.parqet.com/logos/symbol/'+ticker+'" alt="" data-step="0" data-domain="'+domain+'" onerror="logoFallback(this)">' : mono) +'</div>';
}

var _currentPillar = 'all';
var _currentCompanyId = null;
var _currentTicker = null;

// Cache threshold — don't re-sync if data is younger than this (in hours)
var SYNC_CACHE_HOURS = 24;

function isFresh(records) {
  if (!records || !records.length) return false;
  var newest = records[0].created_at || '';
  if (!newest) return false;
  var age = Date.now() - new Date(newest).getTime();
  return age < SYNC_CACHE_HOURS * 60 * 60 * 1000;
}

function formatShares(n) {
  if (n == null) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function renderPillarFilter() {
  var filterBox = document.getElementById('pillar-filter');
  if (!filterBox) return;

  var pillars = [
    { key: 'all', label: 'All' },
    { key: 'qb', label: 'Business' },
    { key: 'qg', label: 'Growth' },
    { key: 'qm', label: 'Management' },
    { key: 'qv', label: 'Valuation' },
  ];

  var html = '';
  pillars.forEach(function(p) {
    html += '<button type="button" class="res-filter-btn' + (_currentPillar === p.key ? ' active' : '') + '" data-pillar="' + p.key + '">' + p.label + '</button>';
  });
  filterBox.innerHTML = html;

  filterBox.querySelectorAll('.res-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _currentPillar = btn.getAttribute('data-pillar');
      renderPillarFilter();
      renderPillarContent();
    });
  });
}

// Per-company highlighted sub-characteristics inside each pillar. Endemic per ticker:
// companies NOT listed here render no highlights and look exactly as before. Tiny inline
// store on purpose — no extra files, DB or fallbacks.
var PILLAR_HIGHLIGHTS = {
  RELY: {
    qb: ['Market structure', 'Unit economics'],
    qg: ['Market runway / TAM', 'Organic durability', 'Mix shift'],
    qm: ['Capital allocation', 'Insider alignment', 'Operating record'],
    qv: ['FCF yield'],
  },
};

async function renderPillarContent() {
  var box = document.getElementById('co-analysis');
  if (!box) return;

  var items = _currentPillar === 'all' ? FRAMEWORK : FRAMEWORK.filter(function(f) { return f.key === _currentPillar; });
  var hlSet = PILLAR_HIGHLIGHTS[_currentTicker] || null;

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var f = items[i];
    var hl = (hlSet && hlSet[f.key]) ? hlSet[f.key].map(function(x) { return x.toLowerCase(); }) : [];
    html += '<div class="pillar-card">' +
      '<div class="pillar-card-header">' +
        '<span class="pillar-card-name">' + esc(f.name) + '</span>' +
      '</div>' +
      '<div class="pillar-card-subs">' +
        f.subs.map(function(s) {
          var on = hl.indexOf(s.toLowerCase()) >= 0;
          return '<span class="pillar-sub' + (on ? ' on' : '') + '">' + esc(s) + '</span>';
        }).join('') +
      '</div>' +
      '<div class="pillar-card-desc">' + esc(f.desc) + '</div>';

    // Management pillar: show key people + insider transactions
    if (f.key === 'qm' && _currentCompanyId) {
      html += '<div id="mgmt-data-slot"></div>';
    }

    // Valuation pillar: show analyst ratings
    if (f.key === 'qv' && _currentCompanyId) {
      html += '<div id="valuation-data-slot"></div>';
    }

    html += '</div>';
  }

  box.innerHTML = html;

  // Load management data if the management pillar is visible
  var showMgmt = items.some(function(f) { return f.key === 'qm'; });
  if (showMgmt && _currentCompanyId) {
    loadManagementData(_currentCompanyId);
  }

  // Load valuation data if the valuation pillar is visible
  var showVal = items.some(function(f) { return f.key === 'qv'; });
  if (showVal && _currentCompanyId) {
    loadValuationData(_currentCompanyId);
  }
}

async function loadManagementData(companyId) {
  var slot = document.getElementById('mgmt-data-slot');
  if (!slot) return;
  if (companyId !== _currentCompanyId) return;

  slot.innerHTML = '<div style="padding:16px 0 4px;color:var(--mu);font-size:12px">Loading management data...</div>';

  var execResult = await fetchExecutives(companyId);
  var txResult = await fetchInsiderTransactions(companyId);

  if (companyId !== _currentCompanyId) return;
  var execs = execResult.success ? execResult.data : [];
  var txns = txResult.success ? txResult.data : [];

  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-top:16px;border-top:1px solid var(--bdr)">' +
    '<div class="mgmt-section-title" style="margin:0">Management</div>' +
    '<button class="ii-btn-sm" id="mgmt-sync-btn" title="Sync from Fiscal.ai">Sync ↻</button>' +
  '</div>';

  if (!execs.length && !txns.length) {
    // No data — auto-sync from Fiscal.ai
    html += '<div style="color:var(--mu);font-size:12px">Pulling management data from Fiscal.ai...</div>';
    slot.innerHTML = html;
    var autoResult = await syncManagement(_currentTicker, companyId);
    if (autoResult.success && autoResult.data && !autoResult.data.unavailable && (autoResult.data.executives > 0 || autoResult.data.transactions > 0)) {
      loadManagementData(companyId);
    } else {
      var msg = (autoResult.success && autoResult.data && autoResult.data.unavailable)
        ? 'This company is not available on the current Fiscal.ai plan.'
        : 'No management data found.';
      slot.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-top:16px;border-top:1px solid var(--bdr)">' +
        '<div class="mgmt-section-title" style="margin:0">Management</div>' +
        '<button class="ii-btn-sm" id="mgmt-sync-btn" title="Sync from Fiscal.ai">Sync ↻</button></div>' +
        '<div class="mgmt-empty">' + esc(msg) + '</div>';
      document.getElementById('mgmt-sync-btn').addEventListener('click', handleMgmtSync);
    }
    return;
  }

  // Data exists but is stale — re-sync in background (don't block UI)
  if (!isFresh(execs) && !isFresh(txns)) {
    syncManagement(_currentTicker, companyId).catch(function() {});
  }

  // Key People
  if (execs.length) {
    html += '<div class="mgmt-section">' +
      '<div class="mgmt-section-title">Key People</div>' +
      '<table class="mgmt-table"><thead><tr>' +
        '<th>Name</th><th>Role</th><th style="text-align:right">Shares</th><th style="text-align:right">Ownership</th>' +
      '</tr></thead><tbody>';
    execs.forEach(function(e) {
      var pct = e.ownership_pct != null ? e.ownership_pct + '%' : (e.ownership || '—');
      html += '<tr>' +
        '<td class="mgmt-name">' + esc(e.name) + '</td>' +
        '<td class="mgmt-role">' + esc(e.role) + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + formatShares(e.shares) + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + esc(pct) + '</td>' +
      '</tr>';
    });
    html += '</tbody></table></div>';
  }

  // Insider Transactions
  if (txns.length) {
    html += '<div class="mgmt-section">' +
      '<div class="mgmt-section-title">Recent Insider Activity</div>' +
      '<div class="mgmt-tx-list">';
    txns.forEach(function(tx) {
      var isBuy = tx.transaction_type === 'buy';
      var date = tx.transaction_date || '';
      var price = tx.price_per_share != null ? '$' + Number(tx.price_per_share).toFixed(2) : '';
      html += '<div class="mgmt-tx-row">' +
        '<span class="mgmt-tx-date">' + esc(date) + '</span>' +
        '<span class="mgmt-tx-name">' + esc(tx.person_name) + '</span>' +
        '<span class="mgmt-tx-type ' + (isBuy ? 'buy' : 'sell') + '">' + (isBuy ? 'Bought' : 'Sold') + '</span>' +
        '<span class="mgmt-tx-detail">' + formatShares(tx.shares) + ' shares' + (price ? ' @ ' + price : '') + '</span>' +
      '</div>';
    });
    html += '</div></div>';
  }

  slot.innerHTML = html;
  document.getElementById('mgmt-sync-btn').addEventListener('click', handleMgmtSync);
}

async function handleMgmtSync() {
  var btn = document.getElementById('mgmt-sync-btn');
  if (!btn || !_currentTicker || !_currentCompanyId) return;
  btn.disabled = true;
  btn.textContent = 'Syncing...';

  var result = await syncManagement(_currentTicker, _currentCompanyId);

  btn.disabled = false;
  btn.textContent = 'Sync ↻';

  if (!result.success) {
    alert('Sync failed: ' + result.error.message);
    return;
  }

  // Reload management data
  loadManagementData(_currentCompanyId);
}

// ─── Valuation Pillar: Analyst Ratings ────────────────────────

async function loadValuationData(companyId) {
  var slot = document.getElementById('valuation-data-slot');
  if (!slot) return;
  if (companyId !== _currentCompanyId) return;

  slot.innerHTML = '<div style="padding:16px 0 4px;color:var(--mu);font-size:12px">Loading analyst ratings...</div>';

  // Read from DB first
  var result = await fetchAnalystRatings(companyId);
  if (companyId !== _currentCompanyId) return;
  var ratings = result.success ? result.data : [];

  // If no data or stale — sync from Massive
  if (!ratings.length) {
    slot.innerHTML = '<div style="padding:16px 0 4px;color:var(--mu);font-size:12px">Pulling analyst ratings...</div>';
    await syncRatings(_currentTicker, companyId);
    result = await fetchAnalystRatings(companyId);
    ratings = result.success ? result.data : [];
  } else if (!isFresh(ratings)) {
    // Stale data — re-sync in background, show cached data now
    syncRatings(_currentTicker, companyId).catch(function() {});
  }

  // Determine last updated time from the most recent created_at
  var updatedStr = 'Unknown';
  if (ratings.length && ratings[0].created_at) {
    var lastSync = new Date(ratings[0].created_at);
    updatedStr = lastSync.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
      lastSync.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;padding-top:16px;border-top:1px solid var(--bdr)">' +
    '<div class="mgmt-section-title" style="margin:0">Analyst Ratings</div>' +
    '<button class="ii-btn-sm" id="ratings-sync-btn" title="Refresh ratings">Refresh ↻</button>' +
  '</div>' +
  '<div style="font-size:10px;color:var(--mu);margin-bottom:14px">Updated ' + esc(updatedStr) + '</div>';

  if (!ratings.length) {
    html += '<div class="mgmt-empty">No analyst ratings available for this company.</div>';
    slot.innerHTML = html;
    document.getElementById('ratings-sync-btn').addEventListener('click', handleRatingsSync);
    return;
  }

  // Compute consensus summary
  var buyCount = 0, holdCount = 0, sellCount = 0;
  var ptSum = 0, ptCount = 0;
  ratings.forEach(function(r) {
    var rat = (r.rating || '').toLowerCase();
    if (rat.includes('buy') || rat.includes('overweight') || rat.includes('outperform')) buyCount++;
    else if (rat.includes('sell') || rat.includes('underweight') || rat.includes('underperform')) sellCount++;
    else holdCount++;
    if (r.price_target) { ptSum += Number(r.price_target); ptCount++; }
  });
  var avgPt = ptCount > 0 ? (ptSum / ptCount).toFixed(2) : null;

  // Consensus bar
  var total = buyCount + holdCount + sellCount;
  html += '<div class="ratings-consensus">' +
    '<div class="ratings-summary">' +
      '<div class="ratings-stat"><span class="ratings-stat-num buy">' + buyCount + '</span><span class="ratings-stat-label">Buy</span></div>' +
      '<div class="ratings-stat"><span class="ratings-stat-num hold">' + holdCount + '</span><span class="ratings-stat-label">Hold</span></div>' +
      '<div class="ratings-stat"><span class="ratings-stat-num sell">' + sellCount + '</span><span class="ratings-stat-label">Sell</span></div>' +
      (avgPt ? '<div class="ratings-stat"><span class="ratings-stat-num pt">$' + avgPt + '</span><span class="ratings-stat-label">Avg PT</span></div>' : '') +
    '</div>' +
    '<div class="ratings-bar">' +
      '<div class="ratings-bar-seg buy" style="width:' + (buyCount / total * 100) + '%"></div>' +
      '<div class="ratings-bar-seg hold" style="width:' + (holdCount / total * 100) + '%"></div>' +
      '<div class="ratings-bar-seg sell" style="width:' + (sellCount / total * 100) + '%"></div>' +
    '</div>' +
  '</div>';

  // Ratings table
  html += '<table class="ratings-table"><thead><tr>' +
    '<th>Bank</th><th>Date</th><th>Rating</th><th style="text-align:right">Price</th><th style="text-align:right">Previous</th>' +
  '</tr></thead><tbody>';
  ratings.slice(0, 20).forEach(function(r) {
    var rat = (r.rating || '').toLowerCase();
    var ratingClass = 'neutral';
    if (rat.includes('buy') || rat.includes('overweight') || rat.includes('outperform')) ratingClass = 'bullish';
    else if (rat.includes('sell') || rat.includes('underweight') || rat.includes('underperform')) ratingClass = 'bearish';

    var ptChange = '';
    if (r.price_target_action === 'raises') ptChange = ' <span style="color:#065F46">↑</span>';
    else if (r.price_target_action === 'lowers') ptChange = ' <span style="color:#991B1B">↓</span>';

    html += '<tr>' +
      '<td class="ratings-firm">' + esc(r.firm) + '</td>' +
      '<td class="ratings-date">' + esc(r.date || '') + '</td>' +
      '<td><span class="ratings-rating ' + ratingClass + '">' + esc(r.rating) + '</span></td>' +
      '<td style="text-align:right;font-variant-numeric:tabular-nums">' + (r.price_target ? '$' + Number(r.price_target).toFixed(0) + ptChange : '—') + '</td>' +
      '<td style="text-align:right;font-variant-numeric:tabular-nums;color:var(--mu)">' + (r.previous_price_target ? '$' + Number(r.previous_price_target).toFixed(0) : '—') + '</td>' +
    '</tr>';
  });
  html += '</tbody></table>';

  slot.innerHTML = html;
  document.getElementById('ratings-sync-btn').addEventListener('click', handleRatingsSync);
}

async function handleRatingsSync() {
  var btn = document.getElementById('ratings-sync-btn');
  if (!btn || !_currentTicker || !_currentCompanyId) return;
  btn.disabled = true;
  btn.textContent = 'Refreshing...';

  await syncRatings(_currentTicker, _currentCompanyId);
  await loadValuationData(_currentCompanyId);
}

function renderCoAnalysis(companyId, ticker) {
  _currentPillar = 'all';
  _currentCompanyId = companyId;
  _currentTicker = ticker;
  renderPillarFilter();
  renderPillarContent();
}


// ─── Add Resource Modal ─────────────────────────────────────

var _currentCompanyForResource = null;
var _resMode = 'url'; // 'url' or 'file'
var _resSelectedFile = null;

function openAddResourceModal(companyId) {
  _currentCompanyForResource = companyId;
  document.getElementById('addResModal').classList.add('open');
  document.getElementById('addRes-name').focus();
  setResMode('url');
}

function closeAddResourceModal() {
  document.getElementById('addResModal').classList.remove('open');
  document.getElementById('addResForm').reset();
  _currentCompanyForResource = null;
  _resSelectedFile = null;
  document.getElementById('addRes-preview').style.display = 'none';
  document.getElementById('addRes-dropzone').style.display = '';
  var msg = document.getElementById('addRes-msg');
  msg.textContent = '';
  msg.className = 'modal-msg';
}

function setResMode(mode) {
  _resMode = mode;
  _resSelectedFile = null;
  document.querySelectorAll('.res-toggle-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });
  document.getElementById('addRes-url-row').style.display = mode === 'url' ? '' : 'none';
  document.getElementById('addRes-file-row').style.display = mode === 'file' ? '' : 'none';
  document.getElementById('addRes-preview').style.display = 'none';
  document.getElementById('addRes-dropzone').style.display = '';
}

function showResFile(file) {
  _resSelectedFile = file;
  document.getElementById('addRes-fileName').textContent = file.name;
  document.getElementById('addRes-dropzone').style.display = 'none';
  document.getElementById('addRes-preview').style.display = '';
}

function removeResFile() {
  _resSelectedFile = null;
  document.getElementById('addRes-file').value = '';
  document.getElementById('addRes-preview').style.display = 'none';
  document.getElementById('addRes-dropzone').style.display = '';
}

function showResMsg(text, type) {
  var msg = document.getElementById('addRes-msg');
  msg.textContent = text;
  msg.className = 'modal-msg ' + type;
}

async function handleAddResource(e) {
  e.preventDefault();
  var btn = document.getElementById('addResSave');
  var name = document.getElementById('addRes-name').value.trim();
  var category = document.getElementById('addRes-category').value;
  var date = new Date().toISOString().slice(0, 10);

  if (!name) { showResMsg('Name is required.', 'error'); return; }
  if (!_currentCompanyForResource) { showResMsg('No company selected.', 'error'); return; }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  var row = {
    company_id: _currentCompanyForResource,
    name: name,
    date: date,
    category: category,
  };

  if (_resMode === 'url') {
    var url = document.getElementById('addRes-url').value.trim();
    if (!url) { showResMsg('URL is required.', 'error'); btn.disabled = false; btn.textContent = 'Add Resource'; return; }
    row.type = 'link';
    row.url = url;
  } else {
    if (!_resSelectedFile) { showResMsg('Please select a file.', 'error'); btn.disabled = false; btn.textContent = 'Add Resource'; return; }
    var filePath = _currentCompanyForResource + '/' + Date.now() + '-' + _resSelectedFile.name;
    var uploadResult = await uploadFile(filePath, _resSelectedFile);
    if (!uploadResult.success) {
      showResMsg('Upload failed: ' + uploadResult.error.message, 'error');
      btn.disabled = false; btn.textContent = 'Add Resource';
      return;
    }
    row.type = 'file';
    row.url = filePath;
  }

  var result = await insertResource(row);

  btn.disabled = false;
  btn.textContent = 'Add Resource';

  if (!result.success) {
    showResMsg('Error: ' + result.error.message, 'error');
    return;
  }

  closeAddResourceModal();
  var tk = document.getElementById('co-name').textContent;
  var c = _companies.find(function(x) { return x.name === tk; });
  if (c) renderCoLinks(c);
}

var _currentResources = [];
var _currentResFilter = 'all';

function renderResFilter() {
  var filterBox = document.getElementById('res-filter');
  if (!filterBox) return;

  // Find which categories have resources
  var cats = [];
  CATEGORY_ORDER.forEach(function(cat) {
    if (_currentResources.some(function(r) { return r.category === cat; })) cats.push(cat);
  });

  if (cats.length <= 1) { filterBox.innerHTML = ''; return; }

  var html = '<button type="button" class="res-filter-btn' + (_currentResFilter === 'all' ? ' active' : '') + '" data-cat="all">All</button>';
  cats.forEach(function(cat) {
    html += '<button type="button" class="res-filter-btn' + (_currentResFilter === cat ? ' active' : '') + '" data-cat="' + cat + '">' + esc(CATEGORY_META[cat] || cat) + '</button>';
  });
  filterBox.innerHTML = html;

  filterBox.querySelectorAll('.res-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _currentResFilter = btn.getAttribute('data-cat');
      renderResFilter();
      renderResLinks();
    });
  });
}

function renderResLinks() {
  var box = document.getElementById('co-links'); if (!box) return;

  var filtered = _currentResFilter === 'all'
    ? _currentResources
    : _currentResources.filter(function(r) { return r.category === _currentResFilter; });

  if (!filtered.length) {
    box.innerHTML = '<div class="coplace">No resources in this category.</div>';
    return;
  }

  // Group by category
  var groups = {};
  filtered.forEach(function(r) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  });

  var html = '';
  CATEGORY_ORDER.forEach(function(cat) {
    var items = groups[cat];
    if (!items || !items.length) return;
    var label = CATEGORY_META[cat] || cat;
    html += '<div style="margin-bottom:20px">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);padding:0 14px;margin-bottom:6px">' + esc(label) + '</div>' +
      '<div class="lnk-list">';
    items.forEach(function(r) {
      html += '<div class="lnk-row" data-res-id="' + esc(r.id) + '">' +
        '<div class="lnk">' +
        '<span class="lnk-body"><span class="lnk-title">' + esc(r.name) + '</span>' +
        (r.date ? '<span class="lnk-meta">' + esc(r.date) + '</span>' : '') + '</span>' +
        '<span class="lnk-go">↗</span></div>' +
        '</div>';
    });
    html += '</div></div>';
  });

  box.innerHTML = html;

  box.querySelectorAll('.lnk-row').forEach(function(row) {
    row.addEventListener('click', function() {
      var resId = row.getAttribute('data-res-id');
      var res = _currentResources.find(function(r) { return r.id === resId; });
      if (res) openResDetailModal(res);
    });
  });
}

// ─── Resource Detail Modal ────────────────────────────────────

function openResDetailModal(res) {
  var id = 'resDetail_' + Date.now();
  var isFile = res.type === 'file';
  var catLabel = CATEGORY_META[res.category] || res.category;
  var fileName = isFile && res.url ? res.url.split('/').pop().replace(/^\d+-/, '') : '';

  var sourceHtml = '';
  if (isFile) {
    sourceHtml = '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:8px 12px;background:var(--surface);border-radius:8px">' +
      '<span style="font-size:18px">&#x1F4C4;</span>' +
      '<span style="font-size:12px;color:var(--text);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(fileName) + '</span>' +
      '</div>';
  } else if (res.url) {
    sourceHtml = '<div style="font-size:12px;color:var(--steel);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:8px">' + esc(res.url) + '</div>';
  }

  var openAction = '';
  if (isFile) {
    openAction = '<button style="font-size:12px;color:var(--steel);background:none;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:500" id="' + id + '_download">Download</button>';
  } else if (res.url) {
    openAction = '<a href="' + esc(res.url) + '" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:var(--steel);text-decoration:none;font-weight:500">Open ↗</a>';
  }

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card" style="width:400px;padding:0" onclick="event.stopPropagation()">' +
      '<div style="padding:24px 28px 20px">' +
        '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);font-weight:500;margin-bottom:12px">' + esc(catLabel) + '</div>' +
        '<div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px">' + esc(res.name) + '</div>' +
        (res.date ? '<div style="font-size:12px;color:var(--mu);margin-bottom:4px">' + esc(res.date) + '</div>' : '') +
        sourceHtml +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;padding:14px 28px 18px;border-top:1px solid var(--bdr)">' +
        openAction +
        '<button style="font-size:12px;color:var(--mu);background:none;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:500" id="' + id + '_edit">Edit</button>' +
        '<div style="flex:1"></div>' +
        '<button style="font-size:11px;color:var(--neg);background:none;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:500;opacity:.7" id="' + id + '_delete">Delete</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', handler); }
  });

  // Download handler for files
  if (isFile) {
    document.getElementById(id + '_download').addEventListener('click', async function() {
      var result = await getFileUrl(res.url);
      if (result.success && result.data && result.data.signedUrl) {
        window.open(result.data.signedUrl, '_blank');
      } else {
        alert('Could not generate download link.');
      }
    });
  }

  document.getElementById(id + '_delete').addEventListener('click', function() {
    overlay.remove();
    showConfirmModal('Delete Resource', esc(res.name), 'This action cannot be undone.', async function() {
      var result = await deleteResource(res.id);
      if (result.success) {
        _currentResources = _currentResources.filter(function(r) { return r.id !== res.id; });
        renderResFilter();
        renderResLinks();
      }
    });
  });

  document.getElementById(id + '_edit').addEventListener('click', function() {
    overlay.remove();
    openResEditModal(res);
  });
}

// ─── Resource Edit Modal ─────────────────────────────────────

function openResEditModal(res) {
  var id = 'resEdit_' + Date.now();
  var isFile = res.type === 'file';
  var fileName = isFile && res.url ? res.url.split('/').pop().replace(/^\d+-/, '') : '';
  var _editFile = null; // replacement file
  var _fileRemoved = false;

  var sourceField = '';
  if (isFile) {
    sourceField =
      '<div class="modal-field" id="' + id + '_fileField">' +
        '<label class="modal-label">File <span class="modal-req">*</span></label>' +
        '<div id="' + id + '_filePreview" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface);border-radius:8px;border:1px solid var(--bdr)">' +
          '<span style="font-size:16px">&#x1F4C4;</span>' +
          '<span style="font-size:13px;color:var(--text);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1" id="' + id + '_fileName">' + esc(fileName) + '</span>' +
          '<button type="button" class="res-file-remove" id="' + id + '_fileRemove" title="Remove file">&times;</button>' +
        '</div>' +
        '<div id="' + id + '_fileDrop" style="display:none">' +
          '<div class="res-dropzone" id="' + id + '_dropzone">' +
            '<div class="res-dropzone-text">Drop file here or <span class="res-browse">browse</span></div>' +
            '<input type="file" id="' + id + '_fileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.ppt,.pptx" style="display:none">' +
          '</div>' +
        '</div>' +
      '</div>';
  } else {
    sourceField =
      '<div class="modal-field">' +
        '<label class="modal-label">URL <span class="modal-req">*</span></label>' +
        '<input class="modal-input" id="' + id + '_url" value="' + esc(res.url || '') + '" type="text" placeholder="https://...">' +
      '</div>';
  }

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = id;
  overlay.innerHTML =
    '<div class="modal-card" style="width:440px;padding:0" onclick="event.stopPropagation()">' +
      '<div class="modal-header"><h2 class="modal-title">Edit Resource</h2>' +
        '<button class="modal-close" id="' + id + '_close">&times;</button></div>' +
      '<div style="padding:20px 26px 24px">' +
        '<div class="modal-field">' +
          '<label class="modal-label">Name <span class="modal-req">*</span></label>' +
          '<input class="modal-input" id="' + id + '_name" value="' + esc(res.name) + '">' +
        '</div>' +
        sourceField +
        '<div class="modal-field">' +
          '<label class="modal-label">Category</label>' +
          '<select class="modal-input" id="' + id + '_cat">' +
            '<option value="filing"' + (res.category === 'filing' ? ' selected' : '') + '>Filing</option>' +
            '<option value="financial"' + (res.category === 'financial' ? ' selected' : '') + '>Report</option>' +
            '<option value="transcript"' + (res.category === 'transcript' ? ' selected' : '') + '>Transcript</option>' +
            '<option value="media"' + (res.category === 'media' ? ' selected' : '') + '>Media</option>' +
            '<option value="other"' + (res.category === 'other' ? ' selected' : '') + '>Other</option>' +
          '</select>' +
        '</div>' +
        '<div class="modal-msg" id="' + id + '_msg"></div>' +
        '<div class="modal-actions">' +
          '<button class="modal-btn modal-btn--cancel" id="' + id + '_cancel">Cancel</button>' +
          '<button class="modal-btn modal-btn--save" id="' + id + '_save">Save</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function validateEdit() {
    var nameVal = document.getElementById(id + '_name').value.trim();
    var saveBtn = document.getElementById(id + '_save');
    var valid = true;

    if (!nameVal) valid = false;

    if (isFile) {
      // Must have existing file or a replacement
      if (_fileRemoved && !_editFile) valid = false;
    } else {
      var urlEl = document.getElementById(id + '_url');
      if (urlEl && !urlEl.value.trim()) valid = false;
    }

    saveBtn.disabled = !valid;
    saveBtn.style.opacity = valid ? '' : '.4';
  }

  // Run initial validation
  validateEdit();

  // Live validation on inputs
  document.getElementById(id + '_name').addEventListener('input', validateEdit);
  if (!isFile) {
    document.getElementById(id + '_url').addEventListener('input', validateEdit);
  }

  // File replace logic
  if (isFile) {
    var showFile = function(file) {
      _editFile = file;
      _fileRemoved = false;
      document.getElementById(id + '_fileName').textContent = file.name;
      document.getElementById(id + '_filePreview').style.display = '';
      document.getElementById(id + '_fileDrop').style.display = 'none';
      validateEdit();
    };

    document.getElementById(id + '_fileRemove').addEventListener('click', function() {
      _editFile = null;
      _fileRemoved = true;
      document.getElementById(id + '_filePreview').style.display = 'none';
      document.getElementById(id + '_fileDrop').style.display = '';
      validateEdit();
    });

    var dropzone = document.getElementById(id + '_dropzone');
    var fileInput = document.getElementById(id + '_fileInput');

    dropzone.addEventListener('click', function() { fileInput.click(); });
    fileInput.addEventListener('change', function() {
      if (fileInput.files && fileInput.files[0]) showFile(fileInput.files[0]);
    });
    dropzone.addEventListener('dragover', function(e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', function() { dropzone.classList.remove('drag-over'); });
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) showFile(e.dataTransfer.files[0]);
    });
  }

  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.getElementById(id + '_close').addEventListener('click', function() { overlay.remove(); });
  document.getElementById(id + '_cancel').addEventListener('click', function() { overlay.remove(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', handler); }
  });

  document.getElementById(id + '_save').addEventListener('click', async function() {
    var nameVal = document.getElementById(id + '_name').value.trim();
    var catVal = document.getElementById(id + '_cat').value;
    var msgEl = document.getElementById(id + '_msg');

    if (!nameVal) { msgEl.textContent = 'Name is required.'; msgEl.className = 'modal-msg error'; return; }

    var saveBtn = document.getElementById(id + '_save');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    var updates = { name: nameVal, category: catVal };

    if (isFile) {
      if (_editFile) {
        // Upload replacement file
        var companyId = res.company_id;
        var filePath = companyId + '/' + Date.now() + '-' + _editFile.name;
        var uploadResult = await uploadFile(filePath, _editFile);
        if (!uploadResult.success) {
          msgEl.textContent = 'Upload failed: ' + uploadResult.error.message;
          msgEl.className = 'modal-msg error';
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save';
          return;
        }
        updates.url = filePath;
      } else if (_fileRemoved) {
        msgEl.textContent = 'A file is required.';
        msgEl.className = 'modal-msg error';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
        return;
      }
    } else {
      var urlEl = document.getElementById(id + '_url');
      var urlVal = urlEl ? urlEl.value.trim() : '';
      if (!urlVal) { msgEl.textContent = 'URL is required.'; msgEl.className = 'modal-msg error'; saveBtn.disabled = false; saveBtn.textContent = 'Save'; return; }
      updates.url = urlVal;
    }

    var result = await updateResource(res.id, updates);

    if (!result.success) {
      msgEl.textContent = 'Error: ' + result.error.message;
      msgEl.className = 'modal-msg error';
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
      return;
    }

    var idx = _currentResources.findIndex(function(r) { return r.id === res.id; });
    if (idx >= 0) _currentResources[idx] = result.data;

    overlay.remove();
    renderResFilter();
    renderResLinks();
  });
}

async function renderCoLinks(c) {
  var box = document.getElementById('co-links'); if (!box) return;
  box.innerHTML = '<div style="text-align:center;padding:20px;color:var(--mu);font-size:13px">Loading resources...</div>';

  var result = await fetchResources(c.id);
  _currentResources = result.success ? result.data : [];
  _currentResFilter = 'all';

  if (!_currentResources.length) {
    document.getElementById('res-filter').innerHTML = '';
    box.innerHTML = '<div class="coplace">No resources yet. Use the + button to add filings, links, and documents.</div>';
    return;
  }

  renderResFilter();
  renderResLinks();
}

function coGroups(){var s={};_companies.forEach(function(c){if(c.group_name)s[c.group_name]=1;});return Object.keys(s).sort();}

function initCoControls(){
  var sel=document.getElementById('co-groupfilter');if(!sel)return;
  sel.innerHTML='<option value="All">All groups</option>'+coGroups().map(function(g){return '<option value="'+g+'">'+g+'</option>';}).join('');
}

function renderCoGrid(){
  var grid=document.getElementById('co-grid');if(!grid)return;
  var si=document.getElementById('co-search'),gf=document.getElementById('co-groupfilter');
  var q=(si&&si.value||'').trim().toLowerCase(),g=(gf&&gf.value)||'All';
  var list=_companies.filter(function(c){
    var grp = c.group_name || '';
    var okg=(g==='All'||grp===g);
    var okq=(!q||c.ticker.toLowerCase().indexOf(q)>=0||c.name.toLowerCase().indexOf(q)>=0);
    return okg&&okq;
  });
  if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--mu);padding:34px;font-size:13px">No companies match that search.</div>';return;}
  grid.innerHTML=list.map(function(c){
    return '<div class="cotile" onclick="openCo(\''+esc(c.ticker)+'\')">'+coLogo(c,'circ')+
      '<div class="cotile-nm">'+esc(c.name)+'</div>'+
      '<div class="cotile-meta">'+esc(c.ticker)+' &middot; '+(esc(c.group_name)||'—')+'</div></div>';
  }).join('');
}

function openCo(tk){
  var c=_companies.find(function(x){return x.ticker===tk;});if(!c)return;
  document.getElementById('co-logo').innerHTML=coLogo(c,'lg');
  document.getElementById('co-name').textContent=c.name;
  document.getElementById('co-sub').innerHTML=esc(c.ticker)+' &middot; '+(esc(c.group_name)||'—');
  var px = c.price != null ? '$'+Number(c.price).toFixed(2) : '—';
  document.getElementById('co-px').textContent=px;
  renderOverview(c);
  renderCoAnalysis(c.id, c.ticker);
  renderCoLinks(c);
  // Wire up add-resource button for this company
  var addResBtn = document.getElementById('co-add-resource');
  if (addResBtn) addResBtn.onclick = function() { openAddResourceModal(c.id); };
  document.getElementById('co-gridview').style.display='none';
  document.getElementById('co-detailview').style.display='block';
  coTab('overview');
  window.scrollTo(0,0);
}

function closeCo(){
  document.getElementById('co-detailview').style.display='none';
  document.getElementById('co-gridview').style.display='block';
  window.scrollTo(0,0);
}

function coTab(pane){
  document.querySelectorAll('.cotab').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-pane')===pane);});
  document.querySelectorAll('.copane').forEach(function(p){p.classList.toggle('active',p.getAttribute('data-pane')===pane);});
  // Charts need a laid-out (visible) canvas to size correctly — (re)init when Overview becomes active.
  if (pane === 'overview' && _currentOverview && _currentOverview.init) {
    requestAnimationFrame(function(){ _currentOverview.init(); });
  }
}

var _currentOverview = null;

// Renders the per-company Overview pane. Each company can look different (see overviews/).
function renderOverview(c){
  var pane = document.querySelector('.copane[data-pane="overview"]');
  if (!pane) return;
  _currentOverview = getOverview(c.ticker);
  if (!_currentOverview) {
    pane.innerHTML = '<div class="coplace">No overview yet for this company. Work with the team to build one.</div>';
    return;
  }
  pane.innerHTML = _currentOverview.html(c);
  // openCo() opens on the Overview tab, so the pane is visible — init charts now.
  if (_currentOverview.init) requestAnimationFrame(function(){ _currentOverview.init(); });
}

// ─── Ticker Lookup ───────────────────────────────────────────

var _searchTimer = null;

function selectCompanyResult(item) {
  var autofillSection = document.getElementById('addCo-autofill');
  var saveBtn = document.getElementById('addCoSave');
  var searchInput = document.getElementById('addCo-search');
  var resultsBox = document.getElementById('addCo-results');

  // Check if already exists
  if (_companies.find(function(c){ return c.ticker === item.ticker; })) {
    showModalMsg(item.ticker + ' already exists.', 'error');
    return;
  }

  // Guess domain immediately from company name
  var guessedDomain = (item.name || '').replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|plc|PLC|Co\.?|Company|Group|Holdings?|Technologies|Platforms?)$/gi, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  _pendingLookup = {
    ticker: item.ticker,
    name: item.name || item.ticker,
    sector: item.sector || '',
    industry: item.industry || '',
    logo_domain: guessedDomain,
  };

  searchInput.value = item.ticker + ' — ' + item.name;
  resultsBox.classList.remove('open');
  document.getElementById('addCo-name').value = _pendingLookup.name;
  document.getElementById('addCo-sector').value = _pendingLookup.sector;
  document.getElementById('addCo-industry').value = _pendingLookup.industry;
  autofillSection.style.display = '';
  saveBtn.disabled = false;
  showModalMsg('', '');

  // Fetch proper domain via lookup-ticker (has domain overrides for MSFT, META, etc.)
  _pendingLookupPromise = lookupTicker(item.ticker).then(function(result) {
    if (result.success && result.data && result.data.logo_domain && _pendingLookup && _pendingLookup.ticker === item.ticker) {
      _pendingLookup.logo_domain = result.data.logo_domain;
    }
  });
}

function handleCompanySearch() {
  var searchInput = document.getElementById('addCo-search');
  var resultsBox = document.getElementById('addCo-results');
  var q = searchInput.value.trim().toLowerCase();

  if (q.length < 1) {
    resultsBox.classList.remove('open');
    return;
  }

  var items = ALL_STOCKS
    .map(function(s) {
      var ticker = (s.t || '').toLowerCase();
      var name = (s.n || '').toLowerCase();
      var score = 0;
      if (ticker === q) score = 100;
      else if (ticker.startsWith(q)) score = 80;
      else if (ticker.includes(q)) score = 60;
      else if (name.startsWith(q)) score = 50;
      else if (name.includes(q)) score = 30;
      if (!score) return null;
      return { ticker: s.t, name: s.n, sector: s.s, industry: s.i, _score: score };
    })
    .filter(function(x) { return x !== null; })
    .sort(function(a, b) { return b._score - a._score; })
    .slice(0, 8);

  if (!items.length) {
    resultsBox.innerHTML = '<div class="co-search-loading">No results found</div>';
    resultsBox.classList.add('open');
    return;
  }

  resultsBox.innerHTML = items.map(function(item) {
    return '<div class="co-search-item">' +
      '<span class="co-search-ticker">' + esc(item.ticker) + '</span>' +
      '<span class="co-search-name">' + esc(item.name) + '</span>' +
      '<span class="co-search-meta">' + esc(item.sector || '') + '</span>' +
    '</div>';
  }).join('');
  resultsBox.classList.add('open');

  resultsBox.querySelectorAll('.co-search-item').forEach(function(el, i) {
    el.addEventListener('mousedown', function(e) {
      e.preventDefault();
      selectCompanyResult(items[i]);
    });
  });
}

// ─── Add Company Modal ───────────────────────────────────────

function openAddModal() {
  document.getElementById('addCoModal').classList.add('open');
  document.getElementById('addCo-search').focus();
}

function closeAddModal() {
  document.getElementById('addCoModal').classList.remove('open');
  document.getElementById('addCoForm').reset();
  document.getElementById('addCo-results').classList.remove('open');
  document.getElementById('addCo-results').innerHTML = '';
  document.getElementById('addCo-autofill').style.display = 'none';
  document.getElementById('addCoSave').disabled = true;
  document.getElementById('addCo-name').readOnly = true;
  _pendingLookup = null;
  var msg = document.getElementById('addCo-msg');
  msg.textContent = '';
  msg.className = 'modal-msg';
}

function showModalMsg(text, type) {
  var msg = document.getElementById('addCo-msg');
  msg.textContent = text;
  msg.className = 'modal-msg ' + type;
}

async function handleAddCompany(e) {
  e.preventDefault();
  var btn = document.getElementById('addCoSave');
  var lookup = _pendingLookup || {};
  var ticker = (lookup.ticker || '').toUpperCase();
  var name = document.getElementById('addCo-name').value.trim() || lookup.name;

  if (!ticker) { showModalMsg('Select a company from the search first.', 'error'); return; }
  if (!name) { showModalMsg('Company name is required.', 'error'); return; }

  if (_companies.find(function(c){ return c.ticker === ticker; })) {
    showModalMsg(ticker + ' already exists.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  // Wait for logo domain lookup to finish
  if (_pendingLookupPromise) await _pendingLookupPromise;

  var mono = ticker.slice(0, 2).toUpperCase();
  var lookup = _pendingLookup || {};

  var row = {
    ticker: ticker,
    name: name,
    sector: lookup.sector || null,
    group_name: lookup.industry || null,
    logo_domain: lookup.logo_domain || null,
    mono: mono,
    status: 'active',
  };

  var result = await insertCompany(row);

  btn.disabled = false;
  btn.textContent = 'Add Company';

  if (!result.success) {
    showModalMsg('Error: ' + result.error.message, 'error');
    return;
  }

  _companies.push(result.data);
  initCoControls();
  renderCoGrid();
  closeAddModal();
}

async function loadCompaniesFromDb() {
  var result = await fetchCompanies();
  if (!result.success) { console.warn('Could not load companies:', result.error.message); return; }
  _companies = result.data;
}

function initAddModal() {
  var addBtn = document.getElementById('co-add-btn');
  if (addBtn) addBtn.addEventListener('click', openAddModal);

  var closeBtn = document.getElementById('addCoClose');
  if (closeBtn) closeBtn.addEventListener('click', closeAddModal);

  var cancelBtn = document.getElementById('addCoCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', closeAddModal);

  var form = document.getElementById('addCoForm');
  if (form) form.addEventListener('submit', handleAddCompany);

  // Typeahead search with debounce
  var searchInput = document.getElementById('addCo-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(handleCompanySearch, 300);
    });
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') document.getElementById('addCo-results').classList.remove('open');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    var results = document.getElementById('addCo-results');
    var wrap = document.querySelector('.co-search-wrap');
    if (results && wrap && !wrap.contains(e.target)) results.classList.remove('open');
  });

  var overlay = document.getElementById('addCoModal');
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeAddModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('addCoModal').classList.contains('open')) closeAddModal();
  });
}

function initResourceModal() {
  var closeBtn = document.getElementById('addResClose');
  if (closeBtn) closeBtn.addEventListener('click', closeAddResourceModal);

  var cancelBtn = document.getElementById('addResCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', closeAddResourceModal);

  var form = document.getElementById('addResForm');
  if (form) form.addEventListener('submit', handleAddResource);

  // Toggle buttons
  document.querySelectorAll('.res-toggle-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { setResMode(btn.getAttribute('data-mode')); });
  });

  // Dropzone click → open file picker
  var dropzone = document.getElementById('addRes-dropzone');
  var fileInput = document.getElementById('addRes-file');
  if (dropzone) dropzone.addEventListener('click', function() { fileInput.click(); });

  // File input change
  if (fileInput) fileInput.addEventListener('change', function() {
    if (fileInput.files && fileInput.files[0]) showResFile(fileInput.files[0]);
  });

  // Drag and drop
  if (dropzone) {
    dropzone.addEventListener('dragover', function(e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', function() { dropzone.classList.remove('drag-over'); });
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) showResFile(e.dataTransfer.files[0]);
    });
  }

  // Remove file
  var removeBtn = document.getElementById('addRes-fileRemove');
  if (removeBtn) removeBtn.addEventListener('click', removeResFile);

  var overlay = document.getElementById('addResModal');
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeAddResourceModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('addResModal').classList.contains('open')) closeAddResourceModal();
  });
}

// Expose to window for inline onclick handlers
window.openCo = openCo;
window.closeCo = closeCo;
window.coTab = coTab;
window.renderCoGrid = renderCoGrid;
window.logoFallback = logoFallback;

export async function loadCompaniesPage() {
  var grid = document.getElementById('co-grid');
  if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px"><div class="loading-spinner" style="margin:0 auto 12px;width:28px;height:28px"></div><div style="color:var(--mu);font-size:13px">Loading companies...</div></div>';
  try {
    await loadCompaniesFromDb();
    initCoControls();
    renderCoGrid();
    initAddModal();
    initResourceModal();
  } catch (err) {
    console.error('Failed to load Companies tab:', err);
    var grid = document.getElementById('co-grid');
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--neg);padding:34px;font-size:13px">Something went wrong loading companies. Please refresh the page.</div>';
  }
}
