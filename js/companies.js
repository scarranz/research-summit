// companies.js — grid, detail view, add-company modal
// All companies are loaded from Supabase. No hardcoded data.
import { FRAMEWORK } from './portal-data.js';
import { fetchCompanies, insertCompany, lookupTicker, fetchResources, insertResource, updateResource, deleteResource, uploadFile, getFileUrl } from './api.js';

let _companies = []; // companies loaded from Supabase
let _pendingLookup = null; // data from ticker lookup

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

function coSegs(score,max){var h='';for(var i=1;i<=max;i++)h+='<i class="'+(i<=score?'on':'')+'"></i>';return h;}

function coSubScore(comp,i){var off=[0,-1,1,0][i%4],v=comp+off;return v<1?1:(v>5?5:v);}

function logoFallback(img){
  var s=img.getAttribute('data-step')||'0',d=img.getAttribute('data-domain');
  if(s==='0'){img.setAttribute('data-step','1');img.src='https://www.google.com/s2/favicons?sz=128&domain='+d;return;}
  var w=img.parentNode;w.classList.add('mono');
  var b=w.getAttribute('data-brand');
  if(b){w.style.background=b;w.style.color='#fff';w.style.borderColor='transparent';}
  w.textContent=w.getAttribute('data-mono');
}

function coLogo(c,cls){
  var domain = c.logo_domain || '';
  var mono = c.mono || (c.ticker || '??').slice(0,2).toUpperCase();
  return '<div class="cologo'+(cls?' '+cls:'')+'" data-mono="'+mono+'">'+
    (domain ? '<img src="https://logo.clearbit.com/'+domain+'" alt="" data-domain="'+domain+'" data-step="0" onerror="logoFallback(this)">' : mono) +'</div>';
}

function renderCoAnalysis(c){
  var box=document.getElementById('co-analysis');if(!box)return;
  if (!c.pillars) { box.innerHTML='<p style="color:var(--mu);font-size:13px">No analysis yet. Work with Claude to build this company\'s profile.</p>'; return; }
  box.innerHTML=FRAMEWORK.map(function(f){
    var sc=c.pillars[f.key];
    var subs=f.subs.map(function(s,i){
      return '<div class="fp-sub"><span class="sname">'+s+'</span><span class="sseg">'+coSegs(coSubScore(sc,i),5)+'</span></div>';
    }).join('');
    return '<div class="fp-block">'+
      '<div class="fp-head"><span class="fp-name">'+f.name+'</span>'+
        '<span class="fp-meter">'+coSegs(sc,5)+'</span><span class="fp-score">'+sc+'/5</span></div>'+
      '<div class="fp-subs">'+subs+'</div>'+
      '<div class="fp-note">'+f.desc+'</div></div>';
  }).join('');
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
  renderCoAnalysis(c);
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
}

// ─── Ticker Lookup ───────────────────────────────────────────

async function handleLookup() {
  var tickerInput = document.getElementById('addCo-ticker');
  var lookupBtn = document.getElementById('addCoLookup');
  var saveBtn = document.getElementById('addCoSave');
  var autofillSection = document.getElementById('addCo-autofill');
  var ticker = tickerInput.value.trim().toUpperCase();

  if (!ticker) { showModalMsg('Enter a ticker first.', 'error'); return; }

  // Check if already exists
  if (_companies.find(function(c){ return c.ticker === ticker; })) {
    showModalMsg(ticker + ' already exists.', 'error');
    return;
  }

  lookupBtn.disabled = true;
  lookupBtn.textContent = 'Looking up...';
  showModalMsg('', '');

  try {
    var result = await lookupTicker(ticker);
    if (!result.success) throw new Error(result.error.message);
    var info = result.data;

    _pendingLookup = {
      ticker: ticker,
      name: info.name || ticker,
      sector: info.sector || '',
      industry: info.industry || '',
      logo_domain: info.logo_domain || '',
    };

    document.getElementById('addCo-name').value = _pendingLookup.name;
    document.getElementById('addCo-sector').value = _pendingLookup.sector;
    document.getElementById('addCo-industry').value = _pendingLookup.industry;
    autofillSection.style.display = '';
    saveBtn.disabled = false;
    showModalMsg('Company found. Review and click Add Company.', 'success');
  } catch (err) {
    // If lookup fails, let user add manually
    _pendingLookup = { ticker: ticker, name: '', sector: '', industry: '', logo_domain: '' };
    document.getElementById('addCo-name').value = '';
    document.getElementById('addCo-name').readOnly = false;
    document.getElementById('addCo-name').placeholder = 'Type company name manually';
    document.getElementById('addCo-sector').value = '';
    document.getElementById('addCo-industry').value = '';
    autofillSection.style.display = '';
    saveBtn.disabled = false;
    showModalMsg('Could not find ' + ticker + '. You can enter details manually.', 'error');
  }

  lookupBtn.disabled = false;
  lookupBtn.textContent = 'Look up';
}

// ─── Add Company Modal ───────────────────────────────────────

function openAddModal() {
  document.getElementById('addCoModal').classList.add('open');
  document.getElementById('addCo-ticker').focus();
}

function closeAddModal() {
  document.getElementById('addCoModal').classList.remove('open');
  document.getElementById('addCoForm').reset();
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
  var ticker = document.getElementById('addCo-ticker').value.trim().toUpperCase();
  var name = document.getElementById('addCo-name').value.trim();

  if (!ticker) { showModalMsg('Ticker is required.', 'error'); return; }
  if (!name) { showModalMsg('Company name is required.', 'error'); return; }

  if (_companies.find(function(c){ return c.ticker === ticker; })) {
    showModalMsg(ticker + ' already exists.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

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

  var lookupBtn = document.getElementById('addCoLookup');
  if (lookupBtn) lookupBtn.addEventListener('click', handleLookup);

  // Also trigger lookup on Enter in ticker field
  var tickerInput = document.getElementById('addCo-ticker');
  if (tickerInput) tickerInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); handleLookup(); }
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
