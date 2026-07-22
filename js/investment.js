// investment.js — Investment tab: sectors → companies → Overview/Opportunity dossier
// All data is loaded from Supabase (investment_sectors, investment_companies).
import { fetchInvestmentSectors, fetchInvestmentCompanies, insertInvestmentSector, insertInvestmentCompany, updateInvestmentCompany } from './api.js';

let _sectors = [];      // investment_sectors rows
let _investments = [];  // investment_companies rows
let _openSectorId = null;
let _openTicker = null;
let _editingId = null;  // set when the Add/Edit modal is in edit mode

function esc(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Logo (mirrors companies.js coLogo — same parqet → favicon → monogram chain) ───

function ivLogo(c, cls) {
  var ticker = c.ticker || '';
  var domain = c.logo_domain || '';
  var mono = c.mono || ticker.slice(0, 2).toUpperCase();
  return '<div class="ivlogo' + (cls ? ' ' + cls : '') + '" data-mono="' + esc(mono) + '">' +
    (ticker ? '<img src="https://assets.parqet.com/logos/symbol/' + esc(ticker) + '" alt="" data-step="0" data-domain="' + esc(domain) + '" onerror="logoFallback(this)">' : esc(mono)) +
    '</div>';
}

function companiesInSector(sectorId) {
  return _investments.filter(function(c) { return c.sector_id === sectorId; });
}

// ─── Sector grid ─────────────────────────────────────────────

function renderSectorGrid() {
  var grid = document.getElementById('iv-secgrid');
  if (!grid) return;
  if (!_sectors.length) {
    grid.innerHTML = '<div class="iv-empty">No sectors yet — click "+" to add your first investment.</div>';
    return;
  }
  grid.innerHTML = _sectors.map(function(s) {
    var companies = companiesInSector(s.id);
    var logos = companies.slice(0, 6).map(function(c) { return ivLogo(c, ''); }).join('');
    var count = companies.length + (companies.length === 1 ? ' company' : ' companies');
    return '<div class="ivsec-card" onclick="ivOpenSector(\'' + s.id + '\')">' +
      '<div class="ivsec-name">' + esc(s.name) + '</div>' +
      '<div class="ivsec-count">' + count + '</div>' +
      '<div class="ivsec-logos">' + logos + '</div>' +
    '</div>';
  }).join('');
}

// ─── Sector detail: company tiles ───────────────────────────────

function ivOpenSector(sectorId) {
  var s = _sectors.find(function(x) { return x.id === sectorId; });
  if (!s) return;
  _openSectorId = sectorId;
  document.getElementById('iv-sector-name').textContent = s.name;
  var companies = companiesInSector(sectorId);
  document.getElementById('iv-sector-count').textContent = companies.length + (companies.length === 1 ? ' company' : ' companies') + ' in this sector';
  renderSectorTiles(companies);
  document.getElementById('invt-sectorview').style.display = 'none';
  document.getElementById('invt-sectordetail').style.display = 'block';
  window.scrollTo(0, 0);
}

function renderSectorTiles(companies) {
  var grid = document.getElementById('iv-tilegrid');
  if (!grid) return;
  if (!companies.length) {
    grid.innerHTML = '<div class="iv-empty">No companies in this sector yet.</div>';
    return;
  }
  grid.innerHTML = companies.map(function(c) {
    return '<div class="ivtile" onclick="ivOpenCompany(\'' + esc(c.ticker) + '\')">' + ivLogo(c, 'circ') +
      '<div class="ivtile-nm">' + esc(c.name) + '</div>' +
      '<div class="ivtile-meta">' + esc(c.ticker) + '</div></div>';
  }).join('');
}

function ivCloseSector() {
  document.getElementById('invt-sectordetail').style.display = 'none';
  document.getElementById('invt-sectorview').style.display = 'block';
  window.scrollTo(0, 0);
}

// ─── Company detail: Overview / Opportunity ─────────────────────

function renderProse(text) {
  if (!text) return '<div class="iv-prose-empty">Not written up yet.</div>';
  return text.trim().split(/\n\s*\n/).map(function(p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
}

function ivOpenCompany(ticker) {
  var c = _investments.find(function(x) { return x.ticker === ticker; });
  if (!c) return;
  _openTicker = ticker;
  var s = _sectors.find(function(x) { return x.id === c.sector_id; });
  document.getElementById('iv-logo').innerHTML = ivLogo(c, 'lg');
  document.getElementById('iv-name').textContent = c.name;
  document.getElementById('iv-sub').innerHTML = esc(c.ticker) + ' &middot; ' + esc(s ? s.name : '—');
  document.getElementById('iv-back-sector').textContent = s ? s.name : 'sector';
  document.getElementById('iv-overview-body').innerHTML = renderProse(c.overview);
  document.getElementById('iv-opportunity-body').innerHTML = renderProse(c.opportunity);
  ivTab('overview');
  document.getElementById('invt-sectordetail').style.display = 'none';
  document.getElementById('invt-companydetail').style.display = 'block';
  window.scrollTo(0, 0);
}

function ivCloseCompany() {
  document.getElementById('invt-companydetail').style.display = 'none';
  document.getElementById('invt-sectordetail').style.display = 'block';
  window.scrollTo(0, 0);
}

function ivTab(pane) {
  document.querySelectorAll('.ivtab').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-pane') === pane); });
  document.querySelectorAll('.ivpane').forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-pane') === pane); });
}

// ─── Add / Edit modal ────────────────────────────────────────

var NEW_SECTOR_VALUE = '__new__';

function populateSectorSelect(selectedId) {
  var sel = document.getElementById('addInv-sector');
  if (!sel) return;
  var options = _sectors.map(function(s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; });
  options.push('<option value="' + NEW_SECTOR_VALUE + '">+ Add new sector…</option>');
  sel.innerHTML = options.join('');
  sel.value = selectedId || (_sectors[0] && _sectors[0].id) || NEW_SECTOR_VALUE;
  handleSectorSelectChange();
}

function handleSectorSelectChange() {
  var sel = document.getElementById('addInv-sector');
  var wrap = document.getElementById('addInv-newsector-wrap');
  if (!sel || !wrap) return;
  wrap.style.display = sel.value === NEW_SECTOR_VALUE ? '' : 'none';
}

function guessDomain(name) {
  return (name || '').replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|plc|PLC|Co\.?|Company|Group|Holdings?|Technologies|Platforms?|S\.A\.?)$/gi, '')
    .trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
}

function showModalMsg(text, type) {
  var msg = document.getElementById('addInv-msg');
  if (!msg) return;
  msg.textContent = text;
  msg.className = 'modal-msg ' + (type || '');
}

function openAddModal() {
  _editingId = null;
  document.getElementById('addInv-title').textContent = 'Add Investment';
  document.getElementById('addInvSave').textContent = 'Add Investment';
  document.getElementById('addInvForm').reset();
  document.getElementById('addInv-ticker').readOnly = false;
  populateSectorSelect(_openSectorId);
  showModalMsg('', '');
  document.getElementById('addInvModal').classList.add('open');
}

function openEditModal(ticker) {
  var c = _investments.find(function(x) { return x.ticker === ticker; });
  if (!c) return;
  _editingId = c.id;
  document.getElementById('addInv-title').textContent = 'Edit Investment';
  document.getElementById('addInvSave').textContent = 'Save Changes';
  document.getElementById('addInv-ticker').value = c.ticker;
  document.getElementById('addInv-ticker').readOnly = true;
  document.getElementById('addInv-name').value = c.name;
  document.getElementById('addInv-overview').value = c.overview || '';
  document.getElementById('addInv-opportunity').value = c.opportunity || '';
  populateSectorSelect(c.sector_id);
  showModalMsg('', '');
  document.getElementById('addInvModal').classList.add('open');
}

function closeAddModal() {
  document.getElementById('addInvModal').classList.remove('open');
  document.getElementById('addInvForm').reset();
  _editingId = null;
}

async function handleAddSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('addInvSave');
  var ticker = document.getElementById('addInv-ticker').value.trim().toUpperCase();
  var name = document.getElementById('addInv-name').value.trim();
  var overview = document.getElementById('addInv-overview').value.trim();
  var opportunity = document.getElementById('addInv-opportunity').value.trim();
  var sel = document.getElementById('addInv-sector');
  var sectorId = sel.value;
  var newSectorName = document.getElementById('addInv-newsector').value.trim();

  if (!ticker) { showModalMsg('Ticker is required.', 'error'); return; }
  if (!name) { showModalMsg('Company name is required.', 'error'); return; }
  if (sectorId === NEW_SECTOR_VALUE && !newSectorName) { showModalMsg('Enter a name for the new sector.', 'error'); return; }
  if (!_editingId && _investments.find(function(c) { return c.ticker === ticker; })) {
    showModalMsg(ticker + ' already exists.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = _editingId ? 'Saving…' : 'Adding…';

  if (sectorId === NEW_SECTOR_VALUE) {
    var sortOrder = _sectors.reduce(function(max, s) { return Math.max(max, s.sort_order || 0); }, 0) + 1;
    var secResult = await insertInvestmentSector({ name: newSectorName, sort_order: sortOrder });
    if (!secResult.success) {
      showModalMsg('Error creating sector: ' + secResult.error.message, 'error');
      btn.disabled = false; btn.textContent = _editingId ? 'Save Changes' : 'Add Investment';
      return;
    }
    _sectors.push(secResult.data);
    _sectors.sort(function(a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });
    sectorId = secResult.data.id;
  }

  var result;
  if (_editingId) {
    result = await updateInvestmentCompany(_editingId, { name: name, sector_id: sectorId, overview: overview || null, opportunity: opportunity || null });
  } else {
    var mono = ticker.slice(0, 2).toUpperCase();
    result = await insertInvestmentCompany({
      ticker: ticker, name: name, sector_id: sectorId,
      logo_domain: guessDomain(name), mono: mono,
      overview: overview || null, opportunity: opportunity || null,
      sort_order: companiesInSector(sectorId).length,
      status: 'active',
    });
  }

  btn.disabled = false;
  btn.textContent = _editingId ? 'Save Changes' : 'Add Investment';

  if (!result.success) {
    showModalMsg('Error: ' + result.error.message, 'error');
    return;
  }

  if (_editingId) {
    var idx = _investments.findIndex(function(c) { return c.id === _editingId; });
    if (idx >= 0) _investments[idx] = result.data;
  } else {
    _investments.push(result.data);
  }

  renderSectorGrid();
  if (_openSectorId) renderSectorTiles(companiesInSector(_openSectorId));
  if (_editingId && _openTicker) ivOpenCompany(_openTicker);
  closeAddModal();
}

function initAddModal() {
  var addBtn = document.getElementById('invt-add-btn');
  if (addBtn) addBtn.addEventListener('click', openAddModal);

  var editBtn = document.getElementById('iv-edit-btn');
  if (editBtn) editBtn.addEventListener('click', function() { if (_openTicker) openEditModal(_openTicker); });

  var closeBtn = document.getElementById('addInvClose');
  if (closeBtn) closeBtn.addEventListener('click', closeAddModal);

  var cancelBtn = document.getElementById('addInvCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', closeAddModal);

  var form = document.getElementById('addInvForm');
  if (form) form.addEventListener('submit', handleAddSubmit);

  var sel = document.getElementById('addInv-sector');
  if (sel) sel.addEventListener('change', handleSectorSelectChange);

  var overlay = document.getElementById('addInvModal');
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeAddModal(); });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeAddModal();
  });
}

// ─── Load ────────────────────────────────────────────────────

async function loadInvestmentFromDb() {
  var [sectorsResult, companiesResult] = await Promise.all([fetchInvestmentSectors(), fetchInvestmentCompanies()]);
  if (!sectorsResult.success) { console.warn('Could not load investment sectors:', sectorsResult.error.message); return; }
  if (!companiesResult.success) { console.warn('Could not load investment companies:', companiesResult.error.message); return; }
  _sectors = sectorsResult.data;
  _investments = companiesResult.data;
}

// Expose for inline onclick handlers
window.ivOpenSector = ivOpenSector;
window.ivCloseSector = ivCloseSector;
window.ivOpenCompany = ivOpenCompany;
window.ivCloseCompany = ivCloseCompany;
window.ivTab = ivTab;

export async function loadInvestmentPage() {
  var grid = document.getElementById('iv-secgrid');
  if (grid) grid.innerHTML = '<div class="iv-empty"><div class="loading-spinner" style="margin:0 auto 12px;width:28px;height:28px"></div>Loading investments…</div>';
  try {
    await loadInvestmentFromDb();
    renderSectorGrid();
    initAddModal();
  } catch (err) {
    console.error('Failed to load Investment tab:', err);
    if (grid) grid.innerHTML = '<div class="iv-empty" style="color:var(--neg)">Something went wrong loading investments. Please refresh the page.</div>';
  }
}
