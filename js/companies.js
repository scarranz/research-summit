// companies.js — grid, detail view, add-company modal
import { COMPANIES, COMPANY_NAMES, IMGS, FRAMEWORK } from './portal-data.js';
import { supabase } from './supabase-client.js';

let coEstChart = null;
let _dbCompanies = []; // companies loaded from Supabase

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
  var tk = (c.tk || '').toUpperCase();
  var nm = (c.nm || '').toLowerCase();
  for (var key in RELEVANT_LINKS) {
    var m = RELEVANT_LINKS[key].match;
    if ((m.tickers && m.tickers.indexOf(tk) >= 0) || (m.name && nm.indexOf(m.name) >= 0)) {
      return RELEVANT_LINKS[key];
    }
  }
  return null;
}

function coComposite(c){var p=c.pillars;return (p.qb+p.qg+p.qm+p.qv)/4;}

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
  var domain = c.logo || c.logo_domain || '';
  var mono = c.mono || (c.tk || '??').slice(0,2).toUpperCase();
  var brand = c.brand || c.brand_color || '';
  return '<div class="cologo'+(cls?' '+cls:'')+'" data-mono="'+mono+'" data-brand="'+brand+'">'+
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
  if(!L){box.innerHTML='';return false;}
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

function coFmtYtd(v){return (v>=0?'+':'')+v.toFixed(2)+'% YTD';}

function getAllCompanies() {
  // Merge hardcoded + DB companies; DB takes precedence on duplicate tickers
  var dbTickers = new Set(_dbCompanies.map(function(c){ return c.tk; }));
  var hardcoded = COMPANIES.filter(function(c){ return !dbTickers.has(c.tk); });
  return hardcoded.concat(_dbCompanies);
}

function coGroups(){var s={};getAllCompanies().forEach(function(c){s[c.grp]=1;});return Object.keys(s).sort();}

function initCoControls(){
  var sel=document.getElementById('co-groupfilter');if(!sel)return;
  sel.innerHTML='<option value="All">All groups</option>'+coGroups().map(function(g){return '<option value="'+g+'">'+g+'</option>';}).join('');
}

function renderCoGrid(){
  var grid=document.getElementById('co-grid');if(!grid)return;
  var si=document.getElementById('co-search'),gf=document.getElementById('co-groupfilter');
  var q=(si&&si.value||'').trim().toLowerCase(),g=(gf&&gf.value)||'All';
  var all=getAllCompanies();
  var list=all.filter(function(c){
    var grp = c.grp || '';
    var okg=(g==='All'||grp===g);
    var okq=(!q||c.tk.toLowerCase().indexOf(q)>=0||c.nm.toLowerCase().indexOf(q)>=0);
    return okg&&okq;
  });
  if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--mu);padding:34px;font-size:13px">No companies match that search.</div>';return;}
  grid.innerHTML=list.map(function(c){
    return '<div class="cotile" onclick="openCo(\''+c.tk+'\')">'+coLogo(c,'circ')+
      '<div class="cotile-nm">'+c.nm+'</div>'+
      '<div class="cotile-meta">'+c.tk+' &middot; '+(c.grp||'—')+'</div></div>';
  }).join('');
}

function openCo(tk){
  var all=getAllCompanies();
  var c=all.find(function(x){return x.tk===tk;});if(!c)return;
  document.getElementById('co-logo').innerHTML=coLogo(c,'lg');
  document.getElementById('co-name').textContent=c.nm;
  document.getElementById('co-sub').innerHTML=(c.ex||'—')+': '+c.tk+' &middot; '+(c.grp||'—');
  var px = c.px != null ? '$'+c.px.toFixed(2) : '—';
  document.getElementById('co-px').textContent=px;
  renderCoAnalysis(c);
  var hasLinks=renderCoLinks(c);
  var linksTab=document.getElementById('co-links-tab');
  if(linksTab) linksTab.style.display=hasLinks?'':'none';
  document.getElementById('co-gridview').style.display='none';
  document.getElementById('co-detailview').style.display='block';
  coTab('analysis');
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
  if(pane==='est') drawCoEst();
}

function drawCoEst(){
  if(coEstChart) return;
  var cv=document.getElementById('co-estchart');if(!cv)return;
  coEstChart=new Chart(cv,{type:'bar',
    data:{labels:['FY23','FY24','FY25E','FY26E','FY27E'],
      datasets:[
        {label:'Revenue ($B)',data:[37.3,43.9,50.6,58.1,66.0],backgroundColor:'#1E2733',borderRadius:4},
        {label:'EBITDA ($B)',data:[4.1,6.5,8.4,10.6,13.1],backgroundColor:'#C9CFD7',borderRadius:4}
      ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{boxWidth:10,color:'#5A6E83',font:{family:'Inter',size:11}}}},
      scales:{x:{grid:{display:false},ticks:{color:'#5A6E83',font:{size:10}}},
              y:{grid:{color:'#E8EFF7'},ticks:{color:'#5A6E83',font:{size:10}}}}}});
}

// ─── Add Company Modal ───────────────────────────────────────

function openAddModal() {
  document.getElementById('addCoModal').classList.add('open');
  document.getElementById('addCo-ticker').focus();
}

function closeAddModal() {
  document.getElementById('addCoModal').classList.remove('open');
  document.getElementById('addCoForm').reset();
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
  var name = document.getElementById('addCo-name').value.trim();

  if (!name) { showModalMsg('Company name is required.', 'error'); return; }

  // Check for duplicates by name
  var all = getAllCompanies();
  if (all.find(function(c){ return c.nm.toLowerCase() === name.toLowerCase(); })) {
    showModalMsg(name + ' already exists.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  var mono = name.split(/\s+/).map(function(w){ return w[0]; }).join('').slice(0, 2).toUpperCase();

  var row = {
    ticker: name.split(/\s+/)[0].toUpperCase().slice(0, 5),
    name: name,
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

  // Add to local cache and re-render
  _dbCompanies.push(mapDbCompany(data));
  initCoControls();
  renderCoGrid();
  closeAddModal();
}

function mapDbCompany(row) {
  return {
    tk: row.ticker,
    nm: row.name,
    px: row.price || null,
    ex: row.exchange || '',
    sec: row.sector || '',
    grp: row.group_name || '',
    logo: row.logo_domain || '',
    logo_domain: row.logo_domain || '',
    mono: row.mono || row.ticker.slice(0, 2),
    brand: row.brand_color || '',
    brand_color: row.brand_color || '',
    pillars: null,
    _fromDb: true,
  };
}

async function loadDbCompanies() {
  var { data, error } = await supabase.from('companies').select('*').eq('status', 'active');
  if (error) { console.warn('Could not load companies from DB:', error.message); return; }
  _dbCompanies = (data || []).map(mapDbCompany);
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
  await loadDbCompanies();
  initCoControls();
  renderCoGrid();
  initAddModal();
}
