// companies.js — grid, detail view, add-company modal
// All companies are loaded from Supabase. No hardcoded data.
import { FRAMEWORK } from './portal-data.js';
import { supabase } from './supabase-client.js';

let _companies = []; // companies loaded from Supabase
let _pendingLookup = null; // data from ticker lookup

// ─── Relevant Links (per-company profile content) ────────────
// Keyed by a normalized key. Resolved against ticker or name so it
// attaches to a company regardless of how it was added (code or DB).
const RELEVANT_LINKS = {
  symbotic: {
    match: { tickers: ['SYM', 'SYMBO', 'SYMBOTIC'], name: 'symbotic' },
    filings: [
      { period: 'Q2 FY2026', form: '10-Q', date: '2026-05-06', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724026000024/sym-20260328.htm' },
      { period: 'Q1 FY2026', form: '10-Q', date: '2026-02-04', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724026000009/sym-20251227.htm' },
      { period: 'FY2025', form: '10-K', date: '2025-11-24', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm' },
      { period: 'Q3 FY2025', form: '10-Q', date: '2025-08-06', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000263/sym-20250628.htm' },
      { period: 'Q2 FY2025', form: '10-Q', date: '2025-05-07', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000152/sym-20250329.htm' },
      { period: 'Q1 FY2025', form: '10-Q', date: '2025-02-05', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000044/sym-20241228.htm' },
      { period: 'FY2024', form: '10-K', date: '2024-12-04', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724024000232/sym-20240928.htm' },
      { period: 'Q3 FY2024', form: '10-Q', date: '2024-07-31', url: 'https://www.sec.gov/Archives/edgar/data/1837240/000183724024000168/sym-20240629.htm' },
    ],
    financials: [
      { label: 'Income Statement — Annual', sub: 'Fiscal.ai financial model', kind: 'fiscal', url: 'https://fiscal.ai/company/NasdaqGM-SYM/financials/income-statement/annual/' },
    ],
    transcripts: [
      { label: 'Investor Relations & Transcripts', sub: 'Fiscal.ai', kind: 'fiscal', url: 'https://fiscal.ai/company/NasdaqGM-SYM/investor-relations/' },
    ],
    media: [
      { label: 'Symbotic — podcast episode', sub: 'Spotify', kind: 'spotify', url: 'https://open.spotify.com/episode/2vPskyHUYQaWHM7Pn9AtE3' },
      { label: 'Symbotic — feature video', sub: 'YouTube', kind: 'youtube', url: 'https://youtu.be/EAAV9JxdjF0?si=sTsicnzUbpo_BphH' },
      { label: 'Symbotic review', sub: 'YouTube', kind: 'youtube', url: 'https://www.youtube.com/watch?v=_-KZzL1mPCQ&pp=ygUQc3ltYm90aWMgcmV2aWV3IA%3D%3D' },
      { label: '"symbotic review" — search results', sub: 'YouTube', kind: 'youtube', url: 'https://www.youtube.com/results?search_query=symbotic+review+' },
    ],
  },
};

function getCompanyLinks(c) {
  if (!c) return null;
  var tk = (c.ticker || '').toUpperCase();
  var nm = (c.name || '').toLowerCase();
  for (var key in RELEVANT_LINKS) {
    var m = RELEVANT_LINKS[key].match;
    if ((m.tickers && m.tickers.indexOf(tk) >= 0) || (m.name && nm.indexOf(m.name) >= 0)) {
      return RELEVANT_LINKS[key];
    }
  }
  return null;
}

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

function lnkIcon(kind){
  var m={
    sec:'▤', fiscal:'∑', spotify:'▶', youtube:'▷', web:'↗'
  };
  return m[kind]||m.web;
}

function lnkRow(href, icon, title, meta, badge){
  return '<a class="lnk lnk-'+icon+'" href="'+href+'" target="_blank" rel="noopener noreferrer">'+
    '<span class="lnk-ic">'+lnkIcon(icon)+'</span>'+
    (badge?'<span class="lnk-badge">'+badge+'</span>':'')+
    '<span class="lnk-body"><span class="lnk-title">'+title+'</span>'+
    (meta?'<span class="lnk-meta">'+meta+'</span>':'')+'</span>'+
    '<span class="lnk-go">↗</span></a>';
}

function renderCoLinks(c){
  var box=document.getElementById('co-links');if(!box)return false;
  var L=getCompanyLinks(c);
  if(!L){box.innerHTML='<div class="coplace">No resources yet. Work with Claude to add filings, models, transcripts and media for this company.</div>';return false;}
  var html='';

  if(L.filings&&L.filings.length){
    html+='<div class="card" style="margin-bottom:16px"><div class="sect" style="margin-bottom:12px">Company filings &middot; SEC EDGAR</div><div class="lnk-list">'+
      L.filings.map(function(f){return lnkRow(f.url,'sec',f.period,'Filed '+f.date,f.form);}).join('')+
      '</div><div class="est-note">Direct links to official filings on SEC EDGAR &middot; most recent 8 quarters.</div></div>';
  }

  var two='';
  if(L.financials&&L.financials.length){
    two+='<div class="card"><div class="sect" style="margin-bottom:12px">Financials</div><div class="lnk-list">'+
      L.financials.map(function(x){return lnkRow(x.url,x.kind||'fiscal',x.label,x.sub,'');}).join('')+'</div></div>';
  }
  if(L.transcripts&&L.transcripts.length){
    two+='<div class="card"><div class="sect" style="margin-bottom:12px">Transcripts &amp; IR</div><div class="lnk-list">'+
      L.transcripts.map(function(x){return lnkRow(x.url,x.kind||'fiscal',x.label,x.sub,'');}).join('')+'</div></div>';
  }
  if(two) html+='<div class="cotwo" style="margin-bottom:16px">'+two+'</div>';

  if(L.media&&L.media.length){
    html+='<div class="card"><div class="sect" style="margin-bottom:12px">Media &amp; podcasts</div><div class="lnk-list">'+
      L.media.map(function(x){return lnkRow(x.url,x.kind||'web',x.label,x.sub,'');}).join('')+'</div></div>';
  }

  box.innerHTML=html;
  return true;
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
    return '<div class="cotile" onclick="openCo(\''+c.ticker+'\')">'+coLogo(c,'circ')+
      '<div class="cotile-nm">'+c.name+'</div>'+
      '<div class="cotile-meta">'+c.ticker+' &middot; '+(c.group_name||'—')+'</div></div>';
  }).join('');
}

function openCo(tk){
  var c=_companies.find(function(x){return x.ticker===tk;});if(!c)return;
  document.getElementById('co-logo').innerHTML=coLogo(c,'lg');
  document.getElementById('co-name').textContent=c.name;
  document.getElementById('co-sub').innerHTML=c.ticker+' &middot; '+(c.group_name||'—');
  var px = c.price != null ? '$'+Number(c.price).toFixed(2) : '—';
  document.getElementById('co-px').textContent=px;
  renderCoAnalysis(c);
  renderCoLinks(c);
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

async function lookupTicker(ticker) {
  // Use Supabase Edge Function to look up company info
  var { data, error } = await supabase.functions.invoke('lookup-ticker', {
    body: { ticker: ticker },
  });

  if (error) throw new Error(error.message);
  return data;
}

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
    var info = await lookupTicker(ticker);

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

  var { data, error } = await supabase.from('companies').insert([row]).select().single();

  btn.disabled = false;
  btn.textContent = 'Add Company';

  if (error) {
    showModalMsg('Error: ' + error.message, 'error');
    return;
  }

  _companies.push(data);
  initCoControls();
  renderCoGrid();
  closeAddModal();
}

async function loadCompaniesFromDb() {
  var { data, error } = await supabase.from('companies').select('*').eq('status', 'active').order('name');
  if (error) { console.warn('Could not load companies from DB:', error.message); return; }
  _companies = data || [];
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
}

// Expose to window for inline onclick handlers
window.openCo = openCo;
window.closeCo = closeCo;
window.coTab = coTab;
window.renderCoGrid = renderCoGrid;
window.logoFallback = logoFallback;

export async function loadCompaniesPage() {
  await loadCompaniesFromDb();
  initCoControls();
  renderCoGrid();
  initAddModal();
}
