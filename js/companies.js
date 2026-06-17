// companies.js — grid, detail view, add-company modal
// All companies are loaded from Supabase. No hardcoded data.
import { FRAMEWORK } from './portal-data.js';
import { supabase } from './supabase-client.js';

let coEstChart = null;
let _companies = []; // companies loaded from Supabase
let _pendingLookup = null; // data from ticker lookup

// Pillar scores by ticker for the Analysis tab (the companies table has no
// pillars column). Each pillar is 1–5: qb, qg, qm, qv.
var CO_PILLARS = {
  RELY: { qb: 4, qg: 5, qm: 4, qv: 2 }, // Remitly
};

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
  _companies.forEach(function(c){ if (CO_PILLARS[c.ticker]) c.pillars = CO_PILLARS[c.ticker]; });
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
