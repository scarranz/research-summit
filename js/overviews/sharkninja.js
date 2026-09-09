// overviews/sharkninja.js — standardized Overview for SharkNinja, Inc. (NYSE: SN).
//
// Follows docs/OVERVIEW_CONVENTIONS.md exactly: a hooked Overview (Key Facts + lede + 2x2
// quadrant always visible, everything below it collapsed). No Deep Dive yet — neither a
// Summit DCF model nor a Bloomberg income-statement export exists for this ticker (see
// docs/COMPANY_PROFILE_BLUEPRINT.md §6 step 1), so `deepDive` is intentionally omitted and
// the tab stays hidden until that data lands.
//
// Uses only the canonical stylesheet components in css/overview.css (.stdkf, .q2,
// .ov-collap, .dmm-*, .acc, .famd/.subrow/.sr, .stdp, .pr-*, .tl, .dd-chart/.dd-note/
// .dd-callout) — no inline <style> per docs/COMPANY_PROFILE_BLUEPRINT.md §3.3.
//
// Data lives in sharkninja-data.js. No data here.

import { liveQuote } from '../api.js';
import { resultsHtml, initResults } from '../results.js';
import {
  SN_BRAND, SN_BRAND_SOFT, C_MU2,
  SN_FACTS, SN_LEDE, SN_QUAD,
  SN_ONE_SEGMENT, SN_GEO, SN_GEO_CAPTION, SN_PROD_DEFS,
  SN_PRODUCTS, SN_PEERS, SN_PEERS_NOTE, SN_PEERS_QUAL, SN_TIMELINE,
  SN_OV_SOURCES,
  SN_DD_INTRO, SN_TL_KPIS, SN_TL_GEO_TREND, SN_TL_GEO_NOTE, SN_TL_CATEGORY_GROWTH,
  SN_TL_RD, SN_TL_INTL, SN_TL_CUSTOMERS_LEDE, SN_TL_CUSTOMERS_KPIS, SN_TL_CUSTOMERS_NOTE,
  SN_DD_SOURCES,
  SN_BL_MARGIN_KPIS, SN_BL_MARGIN_STORY, SN_BL_COST_TABLE, SN_BL_COST_NOTE,
  SN_BL_BS_KPIS, SN_BL_BS_TABLE, SN_BL_BS_NOTE, SN_BL_DEBT_FLAG, SN_BL_SOURCES,
  SN_MGMT_EXECS, SN_MGMT_EXECS_NOTE, SN_MGMT_BOARD, SN_MGMT_BOARD_NOTE, SN_MGMT_OWNERSHIP,
  SN_MGMT_SBC, SN_MGMT_GOV_NOTE, SN_MGMT_RELATED_PARTY, SN_MGMT_TRACK, SN_MGMT_TRACK_NOTE,
  SN_MISC_CAPEX_KPIS, SN_MISC_CAPEX_TREND, SN_MISC_CAPEX_NOTE, SN_MISC_CAPEX_CALLOUT,
  SN_MISC_MNA, SN_MISC_TAX_NOTE, SN_MISC_MARKETING_NOTE, SN_MISC_DEBT, SN_MISC_SOURCES,
} from './sharkninja-data.js';

// esc: escapes <>" but leaves & literal (per contract — never double-encode).
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var _charts = {};
function destroy(id){ if(_charts[id]){ try{ _charts[id].destroy(); }catch(e){} _charts[id]=null; } }
function canBuild(cv){ return cv && typeof Chart !== 'undefined' && cv.offsetParent !== null; }
function hexA(hex, a){ var h=hex.replace('#',''); var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16); return 'rgba('+r+','+g+','+b+','+a+')'; }

function collapsible(title, inner){
  return '<div class="ov-collap">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">▸</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b" hidden>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW BLOCKS
// ═══════════════════════════════════════════════════════════════════════════════
function keyFacts(){
  return '<div class="stdkf">'+SN_FACTS.map(function(f){
    var v = f[1]==='live' ? '<span data-mcap>fetching…</span>' : esc(f[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(f[0])+'</div><div class="stdkf-v">'+v+'</div></div>';
  }).join('')+'</div>';
}
function fourQuad(){
  return '<div class="q2">'+SN_QUAD.map(function(q){
    return '<div class="q2-cell"><div class="q2-k">'+esc(q[0])+'</div><div class="q2-v">'+q[1]+'</div></div>';
  }).join('')+'</div>';
}
// How it makes money — GEOGRAPHY ONLY (single reportable segment; no one-bar chart).
function moneyMap(){
  var bars = SN_GEO.map(function(r){
    return '<div class="geo-bar"><div class="geo-bar-h"><span class="geo-bar-n">'+esc(r[0])+'</span>'+
      '<span class="geo-bar-v">'+esc(r[2])+' · '+esc(r[3])+'</span></div>'+
      '<div class="geo-bar-t"><div style="width:'+r[1]+'%;background:'+r[4]+'"></div></div></div>';
  }).join('');
  var defs = '<div class="dmm-defs">'+SN_PROD_DEFS.map(function(d){
    var subs = d.subs.map(function(s){ return '<div class="sr"><div class="sr-t">'+esc(s[0])+'</div><div class="sr-d">'+esc(s[1])+'</div></div>'; }).join('');
    return '<div class="acc"><button type="button" class="acc-h">What is '+esc(d.seg)+'?<span class="acc-x">+</span></button>'+
      '<div class="acc-b" hidden><div class="famd">'+d.desc+'</div><div class="subrow">'+subs+'</div></div></div>';
  }).join('')+'</div>';
  return '<div class="dd-callout" style="margin-top:0">'+SN_ONE_SEGMENT+'</div>'+
    '<div class="dmm-row"><div class="dmm-chart-wrap">'+bars+
      '<div class="dd-note">'+esc(SN_GEO_CAPTION)+'</div></div>'+defs+'</div>';
}
function products(){
  return '<div class="stdp">'+SN_PRODUCTS.map(function(f,i){
    return '<div class="stdp-card ov-clickable" data-prod="'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
      '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
  }).join('')+'</div>';
}
function peerScatter(){
  return '<div>'+
    '<div class="dmm-tog" data-sctog>'+
      '<button type="button" class="active" data-sc="ev">EV/EBITDA</button><button type="button" data-sc="pe">P/E</button>'+
      '<span style="width:8px"></span>'+
      '<button type="button" class="active" data-scb="fwd">Forward</button><button type="button" data-scb="ttm">Trailing</button>'+
    '</div>'+
    '<div class="pr-row" data-prchips></div>'+
    '<div class="pr-row"><input class="pr-in" data-prin placeholder="Ticker" maxlength="6">'+
      '<button type="button" class="pr-add" data-pradd>Add peer</button>'+
      '<span style="font-size:10.5px;color:var(--mu)">Dot: <b style="color:'+SN_BRAND+'">named in the 10-K</b> · <b style="color:'+C_MU2+'">analyst-selected</b></span></div>'+
    '<div class="dd-chart" style="height:320px"><canvas id="snScatter"></canvas></div>'+
    '<div class="dd-note" data-prnote>'+SN_PEERS_NOTE+'</div>'+
    '<div class="dd-note">'+SN_PEERS_QUAL+'</div></div>';
}
function timeline(){
  return '<div class="tl">'+SN_TIMELINE.map(function(t,i){
    var rm = t[2] ? '<button type="button" class="tl-more" data-tlrm="'+i+'">Read more ›</button><ul class="tl-rm" data-tlbody="'+i+'" hidden>'+t[2].map(function(b){ return '<li>'+esc(b)+'</li>'; }).join('')+'</ul>' : '';
    return '<div class="tl-i"><div class="tl-y">'+esc(t[0])+'</div><div class="tl-t">'+t[1]+'</div>'+rm+'</div>';
  }).join('')+'</div>';
}

function html(c){
  var h = '<div class="ov ov-sn" data-brand="SN" style="--brand:'+SN_BRAND+';--brand-soft:'+SN_BRAND_SOFT+'">';
  h += keyFacts();
  h += '<p class="ov-lede">'+esc(SN_LEDE)+'</p>';
  h += fourQuad();
  h += collapsible('How SharkNinja makes money — one segment, two geographies, four product groups', moneyMap());
  h += collapsible('Products', products());
  h += collapsible('Competitors — the peer map', peerScatter());
  h += collapsible('Timeline — how it became today’s SharkNinja', timeline());
  h += '<div class="ov-foot">'+esc(SN_OV_SOURCES)+'</div>';
  h += modalMarkup();
  h += '</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PEER SCATTER (live market-cap bubbles, editable peer set)
// ═══════════════════════════════════════════════════════════════════════════════
var _peers = null;      // working set (clone of the seeds, mutated by add/remove)
var _mcaps = {};        // ticker -> market cap (USD), filled asynchronously

function peerSeed(tk){
  for(var i=0;i<SN_PEERS.length;i++){ if(SN_PEERS[i].tk===tk) return SN_PEERS[i]; }
  return null;
}
function ensurePeers(){ if(!_peers) _peers = SN_PEERS.map(function(p){ return Object.assign({}, p); }); return _peers; }

function renderPeerChips(root){
  var wrap = root.querySelector('[data-prchips]'); if(!wrap) return;
  wrap.innerHTML = ensurePeers().map(function(p){
    if(p.self) return '<span class="pr-chip" style="border-color:'+SN_BRAND+'"><span class="pr-dot"></span>'+esc(p.tk)+'</span>';
    return '<span class="pr-chip'+(p.named?'':' analyst')+'"><span class="pr-dot"></span>'+esc(p.tk)+
      '<button type="button" class="pr-x" data-prdel="'+esc(p.tk)+'" title="Remove">×</button></span>';
  }).join('');
}
function fetchMcaps(root){
  ensurePeers().forEach(function(p){
    if(_mcaps[p.tk]!==undefined) return;
    _mcaps[p.tk] = null;
    try{
      var r = liveQuote(p.tk);
      if(r && typeof r.then==='function'){
        r.then(function(res){
          var q = res && (res.data||res); if(!q) return;
          if(q.marketCap!=null){ _mcaps[p.tk]=q.marketCap; buildScatter(root); }
        }).catch(function(){});
      }
    }catch(e){}
  });
}
function buildScatter(root){
  var cv = root.querySelector('#snScatter'); if(!canBuild(cv)) return; destroy('snScatter');
  var ma = root.querySelector('[data-sctog] button[data-sc].active');
  var mb = root.querySelector('[data-sctog] button[data-scb].active');
  var mMode = (ma && ma.getAttribute('data-sc')) || 'ev';
  var bMode = (mb && mb.getAttribute('data-scb')) || 'fwd';
  var caps = ensurePeers().map(function(p){ return _mcaps[p.tk]; }).filter(function(v){ return v!=null; });
  var maxCap = caps.length ? Math.max.apply(null, caps) : null;
  var dropped = [];
  var pts = ensurePeers().map(function(p){
    var mult = mMode==='pe' ? (bMode==='fwd'?p.peF:p.pe) : (bMode==='fwd'?p.evF:p.ev);
    var g = bMode==='fwd'?p.gF:p.g;
    if(mult==null || g==null){ dropped.push(p.tk); return null; }
    var cap = _mcaps[p.tk];
    var r = (cap!=null && maxCap) ? (7 + 15*Math.sqrt(cap/maxCap)) : (p.self?12:8);
    return { x:mult, y:g, r:r, tk:p.tk, name:p.name, self:!!p.self, named:!!p.named, cap:cap };
  }).filter(Boolean);
  var note = root.querySelector('[data-prnote]');
  if(note){
    var extra = dropped.length ? ' <b>Dropped from this view (no meaningful multiple): '+esc(dropped.join(', '))+'.</b>' : '';
    var capNote = maxCap ? '' : ' <b>Live market cap unavailable right now — bubbles are drawn at a fixed size.</b>';
    note.innerHTML = SN_PEERS_NOTE + extra + capNote;
  }
  _charts['snScatter'] = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{ data:pts,
      backgroundColor:pts.map(function(p){ return p.self?SN_BRAND:(p.named?hexA(SN_BRAND,.32):hexA(C_MU2,.32)); }),
      borderColor:pts.map(function(p){ return p.self?SN_BRAND:(p.named?SN_BRAND:C_MU2); }), borderWidth:1.5 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var d=ctx.raw;
          return d.name+' ('+d.tk+'): '+d.x.toFixed(1)+'x · '+d.y+'% growth'+(d.cap!=null?(' · $'+(d.cap/1e9).toFixed(1)+'B cap'):' · cap n/a'); } } } },
      scales:{
        x:{ title:{ display:true, text:'cheaper ←   '+(mMode==='pe'?'P/E':'EV/EBITDA')+'   → more expensive', color:'#8A93A0', font:{ size:10.5 } },
            grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'x'; } } },
        y:{ title:{ display:true, text:'slow ←   revenue growth   → fast', color:'#8A93A0', font:{ size:10.5 } },
            grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } } } },
    plugins:[{ id:'snScatterLabels', afterDatasetsDraw:function(ch){
      var ctx=ch.ctx; ctx.save(); ctx.font='700 10px Inter, sans-serif'; ctx.fillStyle='#334155'; ctx.textAlign='center';
      ch.getDatasetMeta(0).data.forEach(function(el,i){ var d=pts[i]; if(d) ctx.fillText(d.tk, el.x, el.y-el.options.radius-3); });
      ctx.restore(); } }]
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL — reuses the portal's generic modal chrome, hoisted to #co-detailview so it
// stays visible from either the Overview or Deep Dive tab (an inactive .copane is
// display:none, which would otherwise hide a modal nested inside the pane the reader
// isn't currently on — docs/COMPANY_PROFILE_BLUEPRINT.md §5.3).
// ═══════════════════════════════════════════════════════════════════════════════
function modalMarkup(){
  return '<div class="modal-overlay" data-sn-modal>'+
    '<div class="modal-card">'+
      '<div class="modal-header"><h2 class="modal-title" data-sn-modal-t></h2><button type="button" class="modal-close" data-sn-modal-x>&times;</button></div>'+
      '<div class="modal-body" data-sn-modal-b></div>'+
    '</div></div>';
}
function openModal(title, body){
  var back = document.querySelector('[data-sn-modal]'); if(!back) return;
  back.querySelector('[data-sn-modal-t]').textContent = title;
  back.querySelector('[data-sn-modal-b]').innerHTML = body;
  back.classList.add('open');
}
function closeModal(){ var back=document.querySelector('[data-sn-modal]'); if(back) back.classList.remove('open'); }
function wireModal(root){
  var back = root.querySelector('[data-sn-modal]'); if(!back) return;
  var host = document.getElementById('co-detailview');
  if(host){
    host.querySelectorAll(':scope > [data-sn-modal]').forEach(function(el){ if(el!==back) el.remove(); });
    if(back.parentNode !== host){ host.appendChild(back); }
  }
  back.addEventListener('click', function(e){ if(e.target===back || e.target.closest('[data-sn-modal-x]')) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
}
function productModal(i){
  var f = SN_PRODUCTS[i]; if(!f) return;
  var body = '<div class="famd" style="margin-bottom:8px">'+esc(f.d)+'</div><div class="subrow">'+f.items.map(function(it){
    return '<div class="sr"><div class="sr-t">'+esc(it[0])+'</div><div class="sr-d">'+esc(it[1])+'</div></div>';
  }).join('')+'</div>';
  openModal(f.ic+' '+f.fam, body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING
// ═══════════════════════════════════════════════════════════════════════════════
function wireToggle(root, sel, cb){
  var grp = root.querySelector(sel); if(!grp) return;
  grp.addEventListener('click', function(e){
    var btn = e.target.closest('button'); if(!btn || btn.disabled || !grp.contains(btn)) return;
    var keys = Object.keys(btn.dataset); var famAttr = keys[0]; if(!famAttr) return;
    grp.querySelectorAll('button[data-'+famAttr+']').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    cb();
  });
}
function wireCollapsibles(root){
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var box=btn.parentElement, body=btn.nextElementSibling; if(!body) return;
      var open = body.hidden; body.hidden = !open;
      box.classList.toggle('open', open);
      var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent = open?'▾':'▸';
      if(open && box.querySelector('#snScatter')) requestAnimationFrame(function(){ buildScatter(root); });
    });
  });
}
function wireAccordions(root){
  root.querySelectorAll('.acc-h').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var b=btn.nextElementSibling; if(!b) return; var hid=b.hidden; b.hidden=!hid;
      var x=btn.querySelector('.acc-x'); if(x) x.textContent=hid?'−':'+';
    });
  });
}

function init(c){
  var root = document.querySelector('.copane[data-pane="overview"] .ov-sn') || document.querySelector('.ov-sn');
  if(!root) return;
  if(root._wired) return;
  root._wired = true;
  wireCollapsibles(root);
  wireAccordions(root);
  wireModal(root);
  wireToggle(root, '[data-sctog]', function(){ buildScatter(root); });
  root.querySelectorAll('[data-prod]').forEach(function(card){
    if(card._wired) return; card._wired=true;
    card.addEventListener('click', function(){ productModal(parseInt(card.getAttribute('data-prod'),10)); });
  });
  root.querySelectorAll('[data-tlrm]').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var i=btn.getAttribute('data-tlrm'); var body=root.querySelector('[data-tlbody="'+i+'"]');
      if(body){ var hid=body.hidden; body.hidden=!hid; btn.textContent=hid?'Read less ›':'Read more ›'; }
    });
  });
  // peer set: remove on chip x, add by ticker
  var chips = root.querySelector('[data-prchips]');
  if(chips) chips.addEventListener('click', function(e){
    var b = e.target.closest('[data-prdel]'); if(!b) return;
    var tk = b.getAttribute('data-prdel');
    _peers = ensurePeers().filter(function(p){ return p.tk!==tk; });
    renderPeerChips(root); buildScatter(root);
  });
  var addBtn = root.querySelector('[data-pradd]'), inp = root.querySelector('[data-prin]');
  function addPeer(){
    if(!inp) return;
    var tk = (inp.value||'').trim().toUpperCase(); if(!tk) return;
    inp.value='';
    if(ensurePeers().some(function(p){ return p.tk===tk; })) return;
    var seed = peerSeed(tk);
    // Re-adding a known peer restores its seeded multiples (conventions §4.6).
    _peers.push(seed ? Object.assign({}, seed) : { tk:tk, name:tk, named:false, ev:null, evF:null, pe:null, peF:null, g:null, gF:null });
    renderPeerChips(root); fetchMcaps(root); buildScatter(root);
  }
  if(addBtn) addBtn.addEventListener('click', addPeer);
  if(inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); addPeer(); } });
  renderPeerChips(root);
  fetchMcaps(root);
  fillMarketCap(root);
}

function fillMarketCap(root){
  var cell = root.querySelector('[data-mcap]'); if(!cell) return;
  try{
    var r = liveQuote('SN');
    if(r && typeof r.then==='function'){
      r.then(function(res){
        var q = res && (res.data||res); if(!q || q.marketCap==null){ cell.textContent='n/a'; return; }
        var d = new Date();
        var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
        cell.textContent = '$'+(q.marketCap/1e9).toFixed(1)+'B · live '+mon+' '+d.getFullYear();
      }).catch(function(){ cell.textContent='n/a'; });
    } else cell.textContent='n/a';
  }catch(e){ cell.textContent='n/a'; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — Top Line + Evolution▸Results only (see sharkninja-data.js SN_DD_INTRO
// for why the other four sections aren't built yet). Sibling profile tab, hoisted
// under the same #co-detailview ancestor — docs/OVERVIEW_CONVENTIONS.md §1.
// ═══════════════════════════════════════════════════════════════════════════════
function ddKpis(items){
  return '<div class="dd-kpis">'+items.map(function(k){
    return '<div class="dd-kpi"><div class="dd-kpi-v">'+esc(k.v)+'</div><div class="dd-kpi-k">'+esc(k.l)+'</div><div class="dd-kpi-s">'+esc(k.s)+'</div></div>';
  }).join('')+'</div>';
}

function toplineGeneral(){
  var geoRows = SN_TL_GEO_TREND.map(function(r){
    return '<div class="geo-bar"><div class="geo-bar-h"><span class="geo-bar-n">FY'+esc(r[0])+'</span>'+
      '<span class="geo-bar-v">Domestic '+esc(r[2])+' ('+r[1]+'%) · International '+esc(r[4])+' ('+r[3]+'%)</span></div>'+
      '<div class="geo-bar-t" style="display:flex"><div style="width:'+r[1]+'%;background:'+SN_BRAND+'"></div><div style="width:'+r[3]+'%;background:'+C_MU2+'"></div></div></div>';
  }).join('');
  return '<div class="dd-h">Top Line</div>'+
    '<div class="dd-sub">Where SharkNinja’s revenue comes from and what moved it — hand-authored from the 10-K and quarterly earnings releases (no Summit model or Bloomberg feed for this ticker).</div>'+
    ddKpis(SN_TL_KPIS)+
    '<div class="dd-callout">'+SN_TL_CATEGORY_GROWTH+'</div>'+
    geoRows+
    '<div class="dd-note">'+esc(SN_TL_GEO_NOTE)+'</div>'+
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">R&amp;D — the product-refresh engine</div>'+
    '<p style="font-size:12px;line-height:1.6;color:var(--navy);margin:0">'+SN_TL_RD+'</p>'+
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">International footprint</div>'+
    '<div class="dd-note">Named markets: '+esc(SN_TL_INTL.countries.join(', '))+' (inside the wider "38 markets" the 10-K cites). Offices: '+esc(SN_TL_INTL.offices.join(', '))+'. Manufacturing/supplier base: '+esc(SN_TL_INTL.manufacturing.join(', '))+'. '+esc(SN_TL_INTL.note)+'</div>';
}

function toplineCustomers(){
  return '<div class="dd-h">Customers</div>'+
    '<div class="dd-sub">'+esc(SN_TL_CUSTOMERS_LEDE)+'</div>'+
    ddKpis(SN_TL_CUSTOMERS_KPIS)+
    '<div class="dd-note">'+esc(SN_TL_CUSTOMERS_NOTE)+'</div>';
}

function bottomLineGeneral(){
  var rows = SN_BL_COST_TABLE.map(function(r){
    return '<tr><td class="ov-td-name">FY'+esc(r[0])+'</td><td>'+r[1]+'%</td><td>'+r[2]+'%</td><td>'+r[3]+'%</td><td>'+r[4]+'%</td><td>'+r[5]+'%</td></tr>';
  }).join('');
  return '<div class="dd-h">Bottom Line</div>'+
    '<div class="dd-sub">Where SharkNinja’s revenue stops being revenue — the annual cost-structure walk. The full quarterly trend, with Street consensus, is under Evolution ▸ Results ▸ Margins &amp; Profitability.</div>'+
    ddKpis(SN_BL_MARGIN_KPIS)+
    '<div class="dd-callout">'+esc(SN_BL_MARGIN_STORY)+'</div>'+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Fiscal year</th><th>Gross margin</th><th>S&amp;M % of sales</th><th>G&amp;A % of sales</th><th>R&amp;D % of sales</th><th>Operating margin</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_BL_COST_NOTE)+'</div>';
}

function bottomLineBS(){
  var rows = SN_BL_BS_TABLE.map(function(r){
    return '<tr><td class="ov-td-name">FY'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td><td>'+esc(r[4])+'</td><td>'+esc(r[5])+'</td></tr>';
  }).join('');
  return '<div class="dd-h">Balance Sheet &amp; Cash Flow</div>'+
    ddKpis(SN_BL_BS_KPIS)+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Fiscal year</th><th>Cash</th><th>Inventories</th><th>Capex</th><th>FCF</th><th>Net debt (BBG)</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_BL_BS_NOTE)+'</div>'+
    '<div class="dd-callout">'+esc(SN_BL_DEBT_FLAG)+'</div>';
}

function mgmtExecsBoard(){
  var execRows = SN_MGMT_EXECS.map(function(e){
    return '<tr><td class="ov-td-name">'+esc(e[0])+'</td><td>'+esc(e[1])+'</td><td>'+esc(e[2])+'</td></tr>';
  }).join('');
  var boardRows = SN_MGMT_BOARD.map(function(b){
    return '<tr><td class="ov-td-name">'+esc(b[0])+'</td><td>'+esc(b[1])+'</td><td>'+esc(b[2])+'</td><td>'+esc(b[3])+'</td></tr>';
  }).join('');
  return '<div class="dd-h">Executives</div>'+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Name</th><th>Title</th><th>Background</th></tr></thead><tbody>'+execRows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_MGMT_EXECS_NOTE)+'</div>'+
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">Board of Directors</div>'+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Name</th><th>Independent</th><th>Role / committees</th><th>Background</th></tr></thead><tbody>'+boardRows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_MGMT_BOARD_NOTE)+'</div>';
}

function mgmtOwnership(){
  var o = SN_MGMT_OWNERSHIP;
  var rows = o.rows.map(function(r){
    return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>';
  }).join('');
  return '<div class="dd-h">Ownership</div>'+
    '<div class="dd-sub">'+esc(o.structure)+' '+esc(o.totalShares)+'</div>'+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Holder</th><th>Shares</th><th>% of shares</th><th>Detail</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(o.note)+'</div>'+
    '<div class="dd-callout">'+esc(o.reconcileFlag)+'</div>';
}

function mgmtGovSbc(){
  return '<div class="dd-h">Governance &amp; Stock-Based Compensation</div>'+
    ddKpis(SN_MGMT_SBC)+
    '<div class="dd-note">'+esc(SN_MGMT_GOV_NOTE)+'</div>'+
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">Related-party transactions with JS Global</div>'+
    '<div class="dd-callout">'+esc(SN_MGMT_RELATED_PARTY)+'</div>';
}

function mgmtTrack(){
  return '<div class="dd-h">Track Record</div>'+
    '<div class="tl">'+SN_MGMT_TRACK.map(function(t,i){
      var rm = t[2] ? '<button type="button" class="tl-more" data-mtlrm="'+i+'">Read more ›</button><ul class="tl-rm" data-mtlbody="'+i+'" hidden>'+t[2].map(function(b){ return '<li>'+esc(b)+'</li>'; }).join('')+'</ul>' : '';
      return '<div class="tl-i"><div class="tl-y">'+esc(t[0])+'</div><div class="tl-t">'+esc(t[1])+'</div>'+rm+'</div>';
    }).join('')+'</div>'+
    '<div class="dd-note">'+esc(SN_MGMT_TRACK_NOTE)+'</div>';
}

function miscCapex(){
  var rows = SN_MISC_CAPEX_TREND.map(function(r){
    return '<tr><td class="ov-td-name">FY'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';
  }).join('');
  return '<div class="dd-h">Capex &amp; Depreciation</div>'+
    ddKpis(SN_MISC_CAPEX_KPIS)+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Fiscal year</th><th>Capex</th><th>D&amp;A</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_MISC_CAPEX_NOTE)+'</div>'+
    '<div class="dd-callout">'+SN_MISC_CAPEX_CALLOUT+'</div>';
}

function miscMna(){
  return '<div class="dd-h">M&amp;A</div>'+
    '<div class="dd-callout">'+esc(SN_MISC_MNA)+'</div>';
}

function miscOther(){
  var debtRows = SN_MISC_DEBT.rows.map(function(r){
    return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>';
  }).join('');
  return '<div class="dd-h">Other Analysis</div>'+
    '<div class="dd-callout">'+SN_MISC_TAX_NOTE+'</div>'+
    '<div class="dd-callout">'+SN_MISC_MARKETING_NOTE+'</div>'+
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">'+esc(SN_MISC_DEBT.lede)+'</div>'+
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Period</th><th>Total debt</th></tr></thead><tbody>'+debtRows+'</tbody></table></div>'+
    '<div class="dd-note">'+esc(SN_MISC_DEBT.note)+'</div>';
}

function deepDiveHtml(c){
  var h = '<div class="ov ov-sn ov-sn-dd" data-brand="SN" style="--brand:'+SN_BRAND+';--brand-soft:'+SN_BRAND_SOFT+'">';
  h += '<div class="dd-callout" style="margin-top:0">'+esc(SN_DD_INTRO)+'</div>';
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="management">Management</button>'+
    '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="general">General</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="customers">Customers</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="general">'+toplineGeneral()+'</div>'+
    '<div class="ovt-subpane" data-ovst="customers" hidden>'+toplineCustomers()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="blgeneral">General</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="blbs">Balance Sheet &amp; Cash Flow</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="blgeneral">'+bottomLineGeneral()+'</div>'+
    '<div class="ovt-subpane" data-ovst="blbs" hidden>'+bottomLineBS()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="evolution" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="results">Results</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="results">'+resultsHtml('SN')+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="management" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="execboard">Executives &amp; Board</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="govsbc">Governance &amp; SBC</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="execboard">'+mgmtExecsBoard()+'</div>'+
    '<div class="ovt-subpane" data-ovst="ownership" hidden>'+mgmtOwnership()+'</div>'+
    '<div class="ovt-subpane" data-ovst="govsbc" hidden>'+mgmtGovSbc()+'</div>'+
    '<div class="ovt-subpane" data-ovst="track" hidden>'+mgmtTrack()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="misc" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="capex">Capex &amp; Depreciation</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="mna">M&amp;A</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="other">Other Analysis</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="capex">'+miscCapex()+'</div>'+
    '<div class="ovt-subpane" data-ovst="mna" hidden>'+miscMna()+'</div>'+
    '<div class="ovt-subpane" data-ovst="other" hidden>'+miscOther()+'</div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(SN_DD_SOURCES)+' '+esc(SN_BL_SOURCES)+' '+esc(SN_MISC_SOURCES)+'</div>';
  h += '</div>';
  return h;
}

function ddBuildVisible(root){
  var pane = root.querySelector('.dd-pane:not([hidden])'); if(!pane) return;
  var sub = pane.querySelector('.ovt-subpane:not([hidden])'); if(!sub) return;
  var key = sub.getAttribute('data-ovst');
  if(key==='results') requestAnimationFrame(function(){ initResults(null, 'SN'); });
}

function deepDiveInit(c){
  var root = document.querySelector('.copane[data-pane="deepdive"] .ov-sn-dd') || document.querySelector('.ov-sn-dd');
  if(!root) return;
  if(root._wired){ ddBuildVisible(root); return; }
  root._wired = true;

  root.querySelectorAll('.dd-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      var k = btn.getAttribute('data-dd');
      root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = p.getAttribute('data-dd')!==k; });
      ddBuildVisible(root);
    });
  });
  root.querySelectorAll('[data-mtlrm]').forEach(function(btn){
    if(btn._wired) return; btn._wired=true;
    btn.addEventListener('click', function(){
      var i=btn.getAttribute('data-mtlrm'); var body=root.querySelector('[data-mtlbody="'+i+'"]');
      if(body){ var hid=body.hidden; body.hidden=!hid; btn.textContent=hid?'Read less ›':'Read more ›'; }
    });
  });
  root.querySelectorAll('.dd-pane').forEach(function(pane){
    pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.getAttribute('data-ovst');
        pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden = p.getAttribute('data-ovst')!==key; });
        ddBuildVisible(root);
      });
    });
  });
  ddBuildVisible(root);
}

export var sharkninjaOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
