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
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo, registerResultsData } from '../results.js';
import {
  SN_BRAND, SN_BRAND_SOFT, C_MU2,
  SN_FACTS, SN_LEDE, SN_QUAD,
  SN_ONE_SEGMENT, SN_GEO, SN_GEO_CAPTION, SN_PROD_DEFS,
  SN_PRODUCTS, SN_PEERS, SN_PEERS_NOTE, SN_PEERS_QUAL, SN_TIMELINE,
  SN_OV_SOURCES,
  SN_TL_RD, SN_TL_INTL, SN_DD_SOURCES,
  // The old flat cost-structure and balance-sheet TABLES are gone — their numbers are now read
  // through from js/results-data/sn.js and sharkninja-bottomline.js so Bottom Line cannot drift
  // from Results. Only the KPI strips and the debt flag survive from the first pass.
  SN_BL_MARGIN_KPIS, SN_BL_BS_KPIS, SN_BL_DEBT_FLAG, SN_BL_SOURCES,
  SN_MISC_CAPEX_KPIS, SN_MISC_CAPEX_TREND, SN_MISC_CAPEX_NOTE, SN_MISC_CAPEX_CALLOUT,
  SN_MISC_MNA, SN_MISC_TAX_NOTE, SN_MISC_MARKETING_NOTE, SN_MISC_DEBT, SN_MISC_SOURCES,
} from './sharkninja-data.js';
// Top Line is ENGINE-DRIVEN (blueprint §1/§2): General · Segments · Other · Customers all come
// from js/segments.js, fed by js/segments-data/sn.js. No pane code here for those four.
import { segmentsHtml, initSegments, segmentsOverviewHtml, initSegmentsOverview,
         segmentsOtherHtml, initSegmentsOther,
         segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';
// The Quartr pass (Sep 2026) — static, frozen data. Only what has no home in the datasets;
// see sharkninja-quartr.js for where the rest went and why nothing is fetched at runtime.
import {
  SN_Q_INTRO, SN_CAT_CORRECTION, SN_CAT_CORRECTION_LIMIT, SN_CAT_SOURCES,
  SN_SUBCATS, SN_SUBCATS_NOTE,
  SN_GUIDE_LEDE, SN_GUIDE_YEARS, SN_GUIDE_PATTERN, SN_GUIDE_SOURCES_NOTE,
  // SN_IR_URL / SN_EDGAR_URL feed the profile-header source buttons (snHeaderSources, as amzn.js ceHeaderSources).
  SN_IR_URL, SN_EDGAR_URL, SN_EST_PENDING,
  SN_STRAT_LEDE, SN_STRAT_MOAT, SN_STRAT_PROMISE, SN_STRAT_PROMISE_NOTE, SN_STRAT_GM,
  SN_STRAT_DIVERSIFY, SN_STRAT_INITIATIVES, SN_STRAT_AUDIT, SN_STRAT_SOURCES,
  SN_TL_LEDE, SN_EXEC_TIMELINE, SN_TL_TAGS, SN_IR_CADENCE, SN_TL_SOURCES,
  SN_TARIFF_KPIS, SN_TARIFF_LEDE, SN_TARIFF_REFUND, SN_TARIFF_TREATMENT,
  SN_TARIFF_MARGIN, SN_TARIFF_NOTE, SN_CAPSTRUCT, SN_QUARTR_SOURCES,
} from './sharkninja-quartr.js';

// Bottom Line (docs/PANE_CATALOG.md §2). No snBBG exists — SN is not in BBG_CONSENSUS.txt, so
// bbg_extract.py cannot run; every P&L series is read through from js/results-data/sn.js instead.
import {
  SN_BL_YEARS, blSeries, SN_BL_EXTRA, SN_BL_VIEWS, SN_BL_LEDE, SN_BL_MARGIN_STORY_V2,
  SN_BL_BRIDGE_NOTE, SN_BL_BRIDGE_READ, SN_BL_NET_NOTE, SN_BL_NET_READ, SN_BL_SBC_NOTE,
  SN_BL_EXPENSE_LINES, SN_BL_EXPENSE_NOTE, SN_SC_DIVERGENCE, SN_SC_KPIS, SN_SC_TENK,
  SN_SC_TENK_WHERE, SN_SC_TARIFFS, SN_SC_TARIFF_NOTE, SN_SC_MARGIN_LINK, SN_BL_SOURCES_V2,
} from './sharkninja-bottomline.js';
// The Valuation source line for the Deep Dive footer (the panes themselves are Amazon's modules, above).
import { SN_VAL_SOURCES } from './sharkninja-valuation.js';
import { snResults } from '../results-data/sn.js';
// Evolution ▸ Earnings runs on AMAZON'S machinery, copied verbatim — see sharkninja-ce.js for why.
import { snCeHtml, snCeWire, snCeBuild, snCePop } from './sharkninja-ce.js';
// Valuation runs on Amazon's four modules, copied — see each file's header.
import { snHistMult } from './sharkninja-histmult.js';
import { snPeersBody, snPeersInit } from './sharkninja-peers.js';
import { snTargetMult } from './sharkninja-target-multiple.js';
import { snSens } from './sharkninja-sensitivity.js';
// Miscellaneous ▸ Marketing Strategy · TAM (frozen data in sharkninja-mkt-data.js / sharkninja-tam-data.js).
import { snMktBody, snTamBody, snMktInit, snTamInit } from './sharkninja-mkt-tam.js';
// Management runs on Amazon's four bodies (shared makeManagement mold) — see sharkninja-mgmt.js.
import { SN_MGMT, snOwnBody, snGovBody, snTrackBody, snTrackPop } from './sharkninja-mgmt.js';
// Bottom Line ▸ General runs on Amazon's code (picker · margins · bridge · net walk · SBC · expense explorer) — see sharkninja-bl.js.
import { snBlGeneralBody, snBlGeneralBuild } from './sharkninja-bl.js';

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

// NOTE: the old hand-written toplineGeneral()/toplineCustomers() are gone. Their content now
// lives in js/segments-data/sn.js and is drawn by the Top Line engine — the geography trend as
// the `geography` cut, the customer concentration as the `customers` block. What the engine has
// no slot for (R&D narrative, footprint, sub-category roster) is in toplineGeneralExtras().

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM LINE — docs/PANE_CATALOG.md §2.
//
// Sub-tabs: General · Supply Chain. **Segments is deliberately absent**: SharkNinja
// aggregates Domestic and International into ONE reportable segment, so there is no
// segment operating income, margin, capex or D&A to compare. The blueprint is explicit
// that sub-tabs are EARNED — shipping one whose body apologises for being empty is the
// thing it warns against.
//
// General is AMAZON'S code (sharkninja-bl.js, extracted from amzn.js): the chart picker, the
// profitability dual-axis chart, the revenue → operating-income waterfall, the net-income walk,
// SBC & dilution and the expense explorer. The balance-sheet view SN used to carry as a fifth
// option now sits on Supply Chain, which is where AMZN keeps its balance sheet.
// ═══════════════════════════════════════════════════════════════════════════════

function blFmtM(v){
  if (v == null) return '—';
  var s = Math.abs(v) >= 1000 ? (v / 1000).toFixed(2) + 'B' : v.toFixed(1) + 'M';
  return (v < 0 ? '−$' : '$') + s.replace('-', '');
}

// ── balance sheet & cash flow ──────────────────────────────────────────────────────
function blBsView(){
  var keys = ['cash', 'inventories', 'totalDebt', 'cfo', 'capex', 'fcf'];
  var rows = SN_BL_YEARS.map(function(fy, i){
    return '<tr><td class="ov-td-name">FY' + esc(fy) + '</td>' + keys.map(function(k){
      var e = SN_BL_EXTRA[k], d = e.derived && e.derived[i];
      return '<td>' + blFmtM(e.v[i]) + (d ? '<br><span class="ov-stat-mut">derived</span>' : '') + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<div class="dd-sub">The balance sheet and the cash it throws off. It sits on Supply Chain, where AMZN keeps its balance sheet.</div>' +
    ddKpis(SN_BL_BS_KPIS) +
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Fiscal year</th>' +
      keys.map(function(k){ return '<th>' + esc(SN_BL_EXTRA[k].label) + '</th>'; }).join('') +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="dd-note">' + keys.map(function(k){ return '<b>' + esc(SN_BL_EXTRA[k].label) + '</b> — ' + SN_BL_EXTRA[k].src; }).join('<br>') + '</div>' +
    '<div class="dd-callout">' + SN_BL_DEBT_FLAG + '</div>';
}

// ── Supply Chain ───────────────────────────────────────────────────────────────────
function bottomLineSupplyChain(){
  var rows = SN_SC_TARIFFS.map(function(t){
    return '<tr><td class="ov-td-name">' + esc(t[0]) + '</td><td style="font-weight:700">' + esc(t[1]) + '</td><td>' + esc(t[2]) + '</td></tr>';
  }).join('');
  return '<div class="dd-h">Supply Chain</div>' +
    '<div class="sg-needs">⚑ <b>This is not AMZN\'s Supply Chain pane, and that is deliberate.</b><br><br>' + SN_SC_DIVERGENCE + '</div>' +
    ddKpis(SN_SC_KPIS) +
    '<div class="dd-callout">&ldquo;' + esc(SN_SC_TENK) + '&rdquo;<div class="dd-note" style="margin-top:6px">— ' + esc(SN_SC_TENK_WHERE) + '</div></div>' +
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">Tariff exposure by manufacturing country</div>' +
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
      '<th>Country</th><th>Assumed 2026 rate</th><th>Note</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="dd-note">' + SN_SC_TARIFF_NOTE + '</div>' +
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">Why it lands on this tab</div>' +
    '<div class="dd-callout">' + SN_SC_MARGIN_LINK + '</div>';
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


// ═══════════════════════════════════════════════════════════════════════════════
// QUARTR-PASS PANES — the remainder only.
//
// Top Line's four sub-tabs (General · Segments · Other · Customers) are drawn by
// js/segments.js from js/segments-data/sn.js — there is no pane code for them here,
// per blueprint §2(a). What is left below is the content the engine has no slot for:
// the sub-category roster and R&D narrative appended under General, the FY2026
// guidance walk (Management ▸ Track Record), and the tariff / capital-structure /
// provenance analysis (Miscellaneous ▸ Other Analysis).
//
// All static. Nothing here makes a runtime call.
// ═══════════════════════════════════════════════════════════════════════════════

function srcList(items){
  return '<ul class="ov-bullets">' + items.map(function(s){
    return '<li>' + esc(s.doc) + ' · <a href="' + esc(s.q) + '" target="_blank" rel="noopener">open in Quartr ↗</a></li>';
  }).join('') + '</ul>';
}

// Appended BELOW the engine's General pane. The engine owns #sgOvWrap and replaces it
// wholesale on re-render, so sibling content after it survives untouched.
function toplineGeneralExtras(){
  var subShark = SN_SUBCATS.Shark.map(function(s){ return '<span class="ov-chip">' + esc(s) + '</span>'; }).join('');
  var subNinja = SN_SUBCATS.Ninja.map(function(s){ return '<span class="ov-chip">' + esc(s) + '</span>'; }).join('');
  return '<div class="dd-h" style="margin-top:26px;font-size:12.5px">R&amp;D — the product-refresh engine</div>' +
    '<p style="font-size:12px;line-height:1.6;color:var(--navy);margin:0">' + SN_TL_RD + '</p>' +
    '<div class="dd-h" style="margin-top:22px;font-size:12.5px">Footprint</div>' +
    '<div class="dd-note">Named markets: ' + esc(SN_TL_INTL.countries.join(', ')) +
      ' (inside the wider "38 markets" the 10-K cites). Offices: ' + esc(SN_TL_INTL.offices.join(', ')) +
      '. Manufacturing/supplier base: ' + esc(SN_TL_INTL.manufacturing.join(', ')) + '. ' + esc(SN_TL_INTL.note) + '</div>' +
    collapsible('The full sub-category roster — 38 as of Dec 31, 2025',
      '<div class="dd-h" style="font-size:12px;margin-top:4px">Shark — ' + SN_SUBCATS.Shark.length + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' + subShark + '</div>' +
      '<div class="dd-h" style="font-size:12px">Ninja — ' + SN_SUBCATS.Ninja.length + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px">' + subNinja + '</div>' +
      '<div class="dd-note">' + SN_SUBCATS_NOTE + '</div>');
}

// ── Management ▸ Track Record ▸ Guidance (was Evolution ▸ Guidance) ──────────────────────────────────────────────────────
// SN guides the FISCAL YEAR, never the quarter, so this is a ratchet table — one column
// per issue date — not a per-quarter beat/miss chart. Deliberately NO canvas: with three
// to four issue dates of RANGES per year, a table states it exactly and a chart would
// only approximate it (CHART_ENGINE_REFERENCE §0.1 — a chart is not owed here, and a
// bespoke canvas would owe the full §0.2 contract for no gain). Reuses the .guid-* CSS
// the LYFT guidance pane already established.

var GUIDE_VERDICT = {
  above:  ['guid-up', '▲ above the final guide'],
  below:  ['guid-dn', '▼ below the final guide'],
  inside: ['guid-mut', '● inside the guided range'],
};

function guideCell(v){
  if (v === 'n/r') return '<td class="guid-mut" title="Not recoverable — the source PDF has no extractable text layer">n/r</td>';
  if (v === 'n/c') return '<td class="guid-mut" title="Not compiled in this pass">n/c</td>';
  return '<td>' + esc(v) + '</td>';
}

function guideYearTable(y){
  var head = '<tr><th>Metric</th>' + y.issues.map(function(i){
    return '<th>' + esc(i[0]) + '<br><span style="font-weight:400;font-size:10.5px">' + esc(i[1]) + '</span></th>';
  }).join('') + (y.hasActual ? '<th>Reported</th><th>vs. final guide</th>' : '') + '</tr>';

  var body = y.metrics.map(function(m){
    var cells = m.vals.map(guideCell).join('');
    var tail = '';
    if (y.hasActual){
      var isNum = m.act && m.act !== 'n/c';
      tail = (isNum ? '<td style="font-weight:700">' + esc(m.act) + '</td>' : guideCell(m.act || 'n/c'));
      var vd = GUIDE_VERDICT[m.verdict];
      tail += vd ? '<td class="' + vd[0] + '">' + vd[1] + '</td>' : '<td class="guid-mut">—</td>';
    }
    return '<tr><td>' + esc(m.m) + '</td>' + cells + tail + '</tr>' +
      '<tr><td colspan="' + (1 + m.vals.length + (y.hasActual ? 2 : 0)) + '" ' +
        'style="padding-top:0;border-bottom:1px solid var(--bdr);font-size:11.5px;color:var(--mu);text-align:left;white-space:normal;line-height:1.5">' +
        m.note + '</td></tr>';
  }).join('');

  var issueNote = y.issues.map(function(i){ return '<b>' + esc(i[0]) + '</b> (' + esc(i[1]) + ') — ' + esc(i[2]); }).join(' · ');

  return '<div class="guid-sub">' + esc(y.fy) + ' · ' + esc(y.status) + '</div>' +
    '<div class="dd-callout">' + y.story + '</div>' +
    '<div class="guid-tbl-wrap"><table class="guid-tbl"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="dd-note">' + issueNote + '</div>';
}

function qGuidance(){
  var pills = SN_GUIDE_YEARS.map(function(y, i){
    return '<button type="button" class="guid-year' + (i === 0 ? ' active' : '') + '" data-snguide="' + esc(y.fy) + '">' +
      esc(y.fy) + '</button>';
  }).join('');
  var panes = SN_GUIDE_YEARS.map(function(y, i){
    return '<div data-snguidepane="' + esc(y.fy) + '"' + (i === 0 ? '' : ' hidden') + '>' + guideYearTable(y) + '</div>';
  }).join('');
  return '<div class="dd-h" style="margin-top:28px">Guidance — what management promised, print by print</div>' +
    '<div class="dd-sub">' + SN_GUIDE_LEDE + '</div>' +
    '<div class="guid-years">' + pills + '</div>' +
    panes +
    '<div class="dd-callout" style="margin-top:18px">' + SN_GUIDE_PATTERN + '</div>' +
    '<div class="dd-note">' + SN_GUIDE_SOURCES_NOTE + '</div>';
}

// A pending notice, rendered with the engine's own amber "needs" badge so an absence reads as an
// absence and never as a blank frame (CHART_ENGINE_REFERENCE §0.2 rule 6).
function pendingBlock(p){
  return '<div class="sg-needs">⚑ <b>' + esc(p.title) + '</b><br><br>' + p.body + '</div>';
}

function qEstimates(){
  return '<div class="dd-h">Estimates</div>' +
    (resultsEvoHtml('SN') || pendingBlock(SN_EST_PENDING));
}

// ── Top Line ▸ Segments ▸ Strategy (was Evolution ▸ Strategy) ──────────────────────────────────────────────────────
// Canonical components only — no inline <style> (blueprint §3.3). The grid override
// below is a style ATTRIBUTE on one element, the precedented way to get four columns
// out of .ov-drivers' fixed three.
function qStrategy(){
  var moat = '<div class="ov-drivers" style="grid-template-columns:repeat(2,1fr)">' +
    SN_STRAT_MOAT.map(function(m){
      return '<div class="ov-driver"><div class="ov-driver-t">' + esc(m[0]) + '</div>' +
        '<div class="ov-driver-d">' + m[1] + '</div>' +
        '<div class="ov-driver-d" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--bdr)">' +
          '<b style="color:var(--brand)">Shows up as</b> — ' + m[2] + '</div></div>';
    }).join('') + '</div>';

  var promise = '<div class="dd-kpis">' + SN_STRAT_PROMISE.map(function(p){
    return '<div class="dd-kpi"><div class="dd-kpi-v" style="font-size:15px">' + esc(p[0]) + '</div>' +
      '<div class="dd-kpi-k">' + esc(p[1]) + '</div><div class="dd-kpi-s"></div></div>';
  }).join('') + '</div>';

  var inits = SN_STRAT_INITIATIVES.map(function(i){
    return '<tr><td class="ov-td-name">' + esc(i[0]) + '</td><td>' + i[1] + '</td>' +
      '<td><span class="ov-tag">' + esc(i[2]) + '</span></td><td>' + i[3] + '</td></tr>';
  }).join('');

  return '<div class="dd-h" style="margin-top:28px">Strategy — the operating model behind the growth</div>' +
    '<div class="dd-sub">' + SN_STRAT_LEDE + '</div>' +

    '<div class="ov-sec"><div class="ov-sec-h">The operating model — four capabilities, and what each should show up as</div>' +
      moat + '</div>' +

    '<div class="ov-sec"><div class="ov-sec-h">What it promises the consumer</div>' +
      promise + '<div class="dd-note">' + SN_STRAT_PROMISE_NOTE + '</div></div>' +

    '<div class="ov-sec"><div class="ov-sec-h">The two principles that carry the financials</div>' +
      '<div class="dd-callout">' + SN_STRAT_GM + '</div>' +
      '<div class="dd-callout">' + SN_STRAT_DIVERSIFY + '</div></div>' +

    '<div class="ov-sec"><div class="ov-sec-h">Initiatives in flight — and how to check each one</div>' +
      '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
        '<th>Initiative</th><th>What it is</th><th>Status</th><th>What to check</th>' +
      '</tr></thead><tbody>' + inits + '</tbody></table></div></div>' +

    '<div class="dd-callout">' + SN_STRAT_AUDIT + '</div>' +
    '<div class="dd-note">' + esc(SN_STRAT_SOURCES) + '</div>';
}

// ── Management ▸ Track Record ▸ the public-company record (was Evolution ▸ Timeline) ──────────────────────────────────────────────────────
// The PUBLIC-COMPANY record only. The 1994–2023 corporate genesis stays in the Overview
// so there is one home for it. Tag filter chips narrow the list.
function qTimeline(){
  var chips = '<div class="guid-years"><button type="button" class="guid-year active" data-sntl="all">All</button>' +
    SN_TL_TAGS.map(function(t){
      return '<button type="button" class="guid-year" data-sntl="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('') + '</div>';

  var items = '<div class="ov-timeline">' + SN_EXEC_TIMELINE.map(function(e){
    return '<div class="ov-tl-item" data-sntlitem="' + esc(e[1]) + '"><div class="ov-tl-dot"></div>' +
      '<div class="ov-tl-yr">' + esc(e[0]) + '</div>' +
      '<div class="ov-tl-body"><span class="ov-tag">' + esc(e[1]) + '</span><br>' +
        '<b>' + e[2] + '</b><br>' + e[3] + '</div></div>';
  }).join('') + '</div>';

  var cadence = SN_IR_CADENCE.rows.map(function(r){
    return '<tr><td class="ov-td-name">' + r[0] + '</td><td style="font-weight:600">' + esc(r[1]) + '</td><td>' + r[2] + '</td></tr>';
  }).join('');

  return '<div class="dd-h" style="margin-top:28px">The public-company record, since Jul 2023</div>' +
    '<div class="dd-sub">' + SN_TL_LEDE + '</div>' +
    chips + items +
    '<div class="ov-sec" style="margin-top:26px"><div class="ov-sec-h">Where management speaks — the IR cadence</div>' +
      '<div class="dd-sub">' + esc(SN_IR_CADENCE.lede) + '</div>' +
      '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
        '<th>Venue</th><th>Appearances</th><th>Detail</th></tr></thead><tbody>' + cadence + '</tbody></table></div>' +
      '<div class="dd-note">' + SN_IR_CADENCE.note + '</div></div>' +
    '<div class="dd-note">' + SN_TL_SOURCES + '</div>';
}

// Miscellaneous ▸ Other Analysis — appended under the existing tax / marketing / debt content.
// Genre match: each of these changes what a reported number MEANS without anything changing
// in the business.
function qOtherAnalysisExtras(){
  var capRows = SN_CAPSTRUCT.rows.map(function(r){
    return '<tr><td class="ov-td-name">' + esc(r[0]) + '</td><td style="font-weight:600">' + esc(r[1]) + '</td></tr>';
  }).join('');
  return '<div class="dd-h" style="margin-top:26px;font-size:12.5px">Tariffs — the pressure, and the refund</div>' +
    '<div class="dd-sub">' + esc(SN_TARIFF_LEDE) + '</div>' +
    ddKpis(SN_TARIFF_KPIS) +
    '<div class="dd-callout">' + SN_TARIFF_REFUND + '</div>' +
    '<div class="dd-callout">' + SN_TARIFF_TREATMENT + '</div>' +
    '<p style="font-size:12px;line-height:1.6;color:var(--navy);margin:10px 0 0">' + SN_TARIFF_MARGIN + '</p>' +
    '<div class="dd-note">' + esc(SN_TARIFF_NOTE) + '</div>' +

    '<div class="dd-h" style="margin-top:26px;font-size:12.5px">Capital structure at Jun 30, 2026 — and the net debt flag, resolved</div>' +
    '<div class="dd-sub">' + esc(SN_CAPSTRUCT.lede) + '</div>' +
    '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
      '<th>Line</th><th>Amount</th></tr></thead><tbody>' + capRows + '</tbody></table></div>' +
    '<div class="dd-note">' + SN_CAPSTRUCT.note + ' <a href="' + esc(SN_CAPSTRUCT.src) + '" target="_blank" rel="noopener">open the slide ↗</a></div>' +
    '<div class="dd-callout">' + SN_CAPSTRUCT.resolves + '</div>' +

    '<div class="dd-h" style="margin-top:26px;font-size:12.5px">Provenance — a series that was mislabelled as an estimate</div>' +
    '<div class="dd-callout">' + SN_CAT_CORRECTION + '</div>' +
    '<div class="dd-note">' + SN_CAT_CORRECTION_LIMIT + '</div>' +
    collapsible('The six earnings releases behind the category series', srcList(SN_CAT_SOURCES));
}


function deepDiveHtml(c){
  // Same root as amzn.js deepDiveHtml: portal tokens, not the company's brand (the brand lives in
  // the logo — COMPANY_PROFILE_BLUEPRINT palette rule), so the tabs and toggles read like Amazon's.
  var h = '<div class="ov ov-sn ov-sn-dd" data-brand="SN" style="--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '<button type="button" class="dd-tab" data-dd="management">Management</button>'+
    '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
  '</div>';
  // Top Line — the canonical four, drawn by js/segments.js (blueprint §1). SN has ONE
  // reportable segment, so Segments carries the consolidated company and its growth
  // decomposition; the three revenue CUTS (category · brand · geography) live in Other.
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="segov">General</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="segdrv">Segments</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="segoth">Other</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="segcus">Customers</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="segov">'+(segmentsOverviewHtml('SN')||'')+toplineGeneralExtras()+'</div>'+
    // Strategy sits under the engine (Sep 2026): the engine is the GROWTH layer, Strategy the OPERATING
    // layer behind it. It renders outside #sgWrap, so the engine's rebuilds never touch it.
    '<div class="ovt-subpane" data-ovst="segdrv" hidden>'+(segmentsHtml('SN')||'')+qStrategy()+'</div>'+
    '<div class="ovt-subpane" data-ovst="segoth" hidden>'+(segmentsOtherHtml('SN')||'')+'</div>'+
    '<div class="ovt-subpane" data-ovst="segcus" hidden>'+(segmentsCustomersHtml('SN')||'')+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="blgeneral">General</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="blsupply">Supply Chain</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="blgeneral">'+snBlGeneralBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="blsupply" hidden>'+bottomLineSupplyChain()+'<div class="dd-h" style="margin-top:26px">Balance sheet &amp; cash flow</div>'+blBsView()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="evolution" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="earnings">'+snCeHtml(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('SN')+'</div>'+
    '<div class="ovt-subpane" data-ovst="estevo" hidden>'+qEstimates()+'</div>'+
  '</div>';
  // Valuation — Amazon's four sub-tabs on Amazon's own code (sharkninja-histmult / -peers /
  // -target-multiple / -sensitivity), fed Bloomberg Street consensus because SN has no Summit DCF.
  h += '<div class="dd-pane" data-dd="valuation" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="histmult">Historic Multiple</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="targetmult">Target Multiple / PEG</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="sensitivity">Sensitivity Analysis</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="histmult">'+snHistMult.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="peers" hidden>'+snPeersBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="targetmult" hidden>'+snTargetMult.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="sensitivity" hidden>'+snSens.body()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="management" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="execboard">Executives &amp; Board</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="govsbc">Governance &amp; SBC</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="execboard">'+SN_MGMT.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="ownership" hidden>'+snOwnBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="govsbc" hidden>'+snGovBody()+'</div>'+
    // Evolution is Amazon's three (Earnings · Results · Estimates); SN's Guidance walk and the print-by-print
    // record moved here in Sep 2026 — both are a record of what management promised and did.
    '<div class="ovt-subpane" data-ovst="track" hidden>'+snTrackBody()+qGuidance()+qTimeline()+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="misc" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="capex">Capex &amp; Depreciation</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="mna">M&amp;A</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="other">Other Analysis</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="snmkt">Marketing Strategy</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="sntam">TAM</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="capex">'+miscCapex()+'</div>'+
    '<div class="ovt-subpane" data-ovst="mna" hidden>'+miscMna()+'</div>'+
    '<div class="ovt-subpane" data-ovst="other" hidden>'+miscOther()+qOtherAnalysisExtras()+'</div>'+
    // Marketing Strategy + TAM (Sep 2026, SAB) — an explicit addition to the Misc spine; see sharkninja-mkt-tam.js.
    '<div class="ovt-subpane" data-ovst="snmkt" hidden>'+snMktBody()+'</div>'+
    '<div class="ovt-subpane" data-ovst="sntam" hidden>'+snTamBody()+'</div>'+
  '</div>';
  // The two intro callouts that sat above the tabs are gone (Amazon's Deep Dive opens straight on its tabs). The
  // Quartr note is still true, so it moves down here with the sources; the data-status callout (SN_DD_INTRO) was out of date.
  h += '<div class="ov-foot">'+esc(SN_DD_SOURCES)+' '+esc(SN_BL_SOURCES)+' '+esc(SN_MISC_SOURCES)+' '+esc(SN_VAL_SOURCES)+' '+esc(SN_QUARTR_SOURCES)+' '+SN_Q_INTRO+'</div>';
  h += '</div>';
  return h;
}

// Each engine-driven pane is wired only once it is actually visible — Chart.js needs a
// non-null offsetParent, so the rAF defers to after the pane is unhidden.
var SEG_INIT = {
  segov: initSegmentsOverview,
  segdrv: initSegments,
  segoth: initSegmentsOther,
  segcus: initSegmentsCustomers,
};

function ddBuildVisible(root){
  var pane = root.querySelector('.dd-pane:not([hidden])'); if(!pane) return;
  var sub = pane.querySelector('.ovt-subpane:not([hidden])'); if(!sub) return;
  var key = sub.getAttribute('data-ovst');
  if(key==='results'){ requestAnimationFrame(function(){ initResults(null, 'SN'); }); return; }
  // amzn.js aBuildSub('valuation', …), verbatim.
  if(key==='histmult'){ requestAnimationFrame(function(){ snHistMult.init(root); }); return; }
  if(key==='sensitivity'){ requestAnimationFrame(function(){ snSens.init(root); }); return; }
  if(key==='targetmult'){ requestAnimationFrame(function(){ snTargetMult.init(root); }); return; }
  if(key==='peers'){ requestAnimationFrame(function(){ snPeersInit(root); }); return; }
  if(key==='blgeneral'){ requestAnimationFrame(snBlGeneralBuild); return; }   // amzn.js aBuildSub('bottomline'): aBuildMargins + aBuildExpenses
  // Earnings ▸ Setup hosts the Results engine on the SN_SETUP dataset — only build it when
  // the Setup phase is the visible one (Chart.js needs a non-null offsetParent).
  if(key==='earnings'){ snCeBuild(root); return; }
  if(key==='snmkt'){ requestAnimationFrame(function(){ snMktInit(sub); }); return; }
  if(key==='sntam'){ requestAnimationFrame(function(){ snTamInit(sub); }); return; }
  // Estimates fills itself once the dataset carries `evolution`; until then the pane is the
  // pending notice and there is nothing to wire.
  if(key==='estevo'){ requestAnimationFrame(function(){ try{ initResultsEvo('SN'); }catch(e){} }); return; }
  var fn = SEG_INIT[key];
  if(fn) requestAnimationFrame(function(){ fn(sub, 'SN'); });
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
  // Bottom Line ▸ General — the section collapsibles (aCollap) and the chart tables, as amzn.js
  // deepDiveInit's rs-collap handler. Scoped to that pane so the Results-engine tables elsewhere,
  // which wire themselves, are never toggled twice.
  var blPane = root.querySelector('.ovt-subpane[data-ovst="blgeneral"]');
  if(blPane && !blPane._rsCollapWired){ blPane._rsCollapWired = true;
    blPane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h'):null; if(!h||!blPane.contains(h)) return;
      var b=h.nextElementSibling; if(!b||!b.classList.contains('rs-collap-b')) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  // Management ▸ Track Record ▸ Guidance — fiscal-year pills.
  root.querySelectorAll('[data-snguide]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var fy = btn.getAttribute('data-snguide');
      root.querySelectorAll('[data-snguide]').forEach(function(b){ b.classList.toggle('active', b===btn); });
      root.querySelectorAll('[data-snguidepane]').forEach(function(p){ p.hidden = p.getAttribute('data-snguidepane')!==fy; });
    });
  });
  // ── Evolution ▸ Earnings — Amazon's wiring, verbatim (sharkninja-ce.js): phase tabs · quarter
  // pills · estimate / growth / margin toggles · The print's filters · Call Summary · Propose Notes ·
  // the theme record with its ✎ editor. The "?" caveats open in the profile modal.
  snCeWire(root);
  SN_MGMT.init(root);   // the Executives & Board CV modal (makeManagement), as amzn.js deepDiveInit does
  if(!root._cePopWired){
    root._cePopWired = true;
    root.addEventListener('click', function(e){
      var el = e.target.closest ? e.target.closest('[data-detail^="ce:"], [data-detail^="exec:"]') : null;
      if(!el || !root.contains(el)) return;
      var key = el.getAttribute('data-detail');
      var d = key.indexOf('exec:') === 0 ? snTrackPop(key.slice(5)) : snCePop(key.slice(3));
      if(d) openModal(String(d.t||'').replace(/<[^>]+>/g,''), d.h||'');
    });
  }  // Management ▸ Track Record ▸ the public-company record — tag filter chips.
  root.querySelectorAll('[data-sntl]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var tag = btn.getAttribute('data-sntl');
      root.querySelectorAll('[data-sntl]').forEach(function(b){ b.classList.toggle('active', b===btn); });
      root.querySelectorAll('[data-sntlitem]').forEach(function(it){
        it.hidden = (tag !== 'all' && it.getAttribute('data-sntlitem') !== tag);
      });
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

// Source buttons in the Company Profile header — amzn.js ceHeaderSources(), verbatim markup and tile
// styling (dark square, logo-only, hover lift); the glow uses SN's colour where Amazon's used orange.
// Rendered by companies.js openCo() into #co-srcbtns via overview.headerSources().
function snHeaderSources(){
  var CE_LOGO_URL = 'https://assets.parqet.com/logos/symbol/SN', CE_SEC_SEAL = 'img/sec-seal.png';
  return '<style>'+
    '.cohd-src{display:inline-flex;gap:8px;align-items:center}'+
    '.cohd-src a{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;'+
      'text-decoration:none;position:relative;overflow:hidden;transition:.16s;'+
      'background:linear-gradient(135deg,#0B0703 0%,#1C1206 60%,#0B0703 100%);border:1px solid rgba(14,124,134,.40);box-shadow:0 3px 12px rgba(0,0,0,.32)}'+
    '.cohd-src a:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(14,124,134,.30);border-color:rgba(14,124,134,.80)}'+
    '.cohd-src a img{width:26px;height:26px;object-fit:contain;display:block;border-radius:6px}'+
    '.cohd-src a.edgar{background:linear-gradient(135deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cohd-src a.edgar:hover{box-shadow:0 8px 20px rgba(197,164,90,.30);border-color:rgba(227,200,120,.78)}'+
    '.cohd-src a.edgar img{border-radius:0}'+
  '</style>'+
  '<div class="cohd-src">'+
  '<a href="'+SN_IR_URL+'" target="_blank" rel="noopener" title="SharkNinja Investor Relations" aria-label="SharkNinja Investor Relations">'+
    '<img src="'+CE_LOGO_URL+'" alt="SharkNinja logo" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '<a class="edgar" href="'+esc(SN_EDGAR_URL)+'" target="_blank" rel="noopener" title="SharkNinja on SEC EDGAR" aria-label="SharkNinja on SEC EDGAR">'+
    '<img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '</div>';
}

export var sharkninjaOverview = { html: html, init: init, headerSources: snHeaderSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
