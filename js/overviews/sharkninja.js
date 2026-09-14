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
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import {
  SN_BRAND, SN_BRAND_SOFT, C_MU2,
  SN_FACTS, SN_LEDE, SN_QUAD,
  SN_ONE_SEGMENT, SN_GEO, SN_GEO_CAPTION, SN_PROD_DEFS,
  SN_PRODUCTS, SN_PEERS, SN_PEERS_NOTE, SN_PEERS_QUAL, SN_TIMELINE,
  SN_OV_SOURCES,
  SN_DD_INTRO, SN_TL_RD, SN_TL_INTL, SN_DD_SOURCES,
  SN_BL_MARGIN_KPIS, SN_BL_MARGIN_STORY, SN_BL_COST_TABLE, SN_BL_COST_NOTE,
  SN_BL_BS_KPIS, SN_BL_BS_TABLE, SN_BL_BS_NOTE, SN_BL_DEBT_FLAG, SN_BL_SOURCES,
  SN_MGMT_EXECS, SN_MGMT_EXECS_NOTE, SN_MGMT_BOARD, SN_MGMT_BOARD_NOTE, SN_MGMT_OWNERSHIP,
  SN_MGMT_SBC, SN_MGMT_GOV_NOTE, SN_MGMT_RELATED_PARTY, SN_MGMT_TRACK, SN_MGMT_TRACK_NOTE,
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
  SN_IR_URL, SN_EDGAR_URL, SN_EARN_LEDE, SN_EARN_PENDING, SN_NEXT_PRINT, SN_LAST_PRINT,
  SN_EST_PENDING,
  SN_STRAT_LEDE, SN_STRAT_MOAT, SN_STRAT_PROMISE, SN_STRAT_PROMISE_NOTE, SN_STRAT_GM,
  SN_STRAT_DIVERSIFY, SN_STRAT_INITIATIVES, SN_STRAT_AUDIT, SN_STRAT_SOURCES,
  SN_TL_LEDE, SN_EXEC_TIMELINE, SN_TL_TAGS, SN_IR_CADENCE, SN_TL_SOURCES,
  SN_TARIFF_KPIS, SN_TARIFF_LEDE, SN_TARIFF_REFUND, SN_TARIFF_TREATMENT,
  SN_TARIFF_MARGIN, SN_TARIFF_NOTE, SN_CAPSTRUCT, SN_QUARTR_SOURCES,
} from './sharkninja-quartr.js';
// The Earnings record (docs/EARNINGS_CONVENTIONS.md §7). Street values are DERIVED from
// js/results-data/sn.js at render time via snCell(), never copied.
import {
  snCell, SN_CE_SOURCE, SN_CE_ASOF, SN_CE_QUARTERS,
  SN_SETUP_HEADLINE, SN_SETUP_CUSTOM, SN_SETUP_SYNTH, SN_SETUP_DEBATE_NOTE,
  SN_FROZEN, SN_RESULTS, SN_CALL, SN_WL_ROWS, SN_WL_NOTE, SN_EARN_SOURCES,
} from './sharkninja-earnings.js';

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

// ── Evolution ▸ Guidance ──────────────────────────────────────────────────────
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
  return '<div class="dd-h">Guidance</div>' +
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

// ── Evolution ▸ Earnings ──────────────────────────────────────────────────────
// Structure per EARNINGS_CONVENTIONS §6, matching AMZN/GOOGL exactly:
//   the IR + EDGAR banner cards (mandatory, FIRST element)
//   → the quarter selector (.ce-qpills, newest/upcoming first)
//   → three phase tabs (.ce-phtabs): Setup · Watch List · Post-Results
//   → per-quarter blocks (.ce-qblock[data-ceq]) inside each phase, one visible at a time.
// The quarter pills are hidden on the Watch List phase (it is a flat cross-quarter table, §6f).
//
// CSS comes from css/earnings.css — the .ce-* machinery extracted from amzn.js and scoped to
// .ov-sn. No inline <style> here (blueprint §3.3).

var SN_CE_LOGO = 'https://assets.parqet.com/logos/symbol/SN';
var SN_CE_SEAL = 'img/sec-seal.png';

// The two loud source cards. Identity, not decoration: the company's real mark and the SEC seal,
// no emoji — the CSS gives each the glowing ring and the corner watermark.
function ceHeaderSources(){
  return '<div class="cohd-src">' +
    '<a href="' + esc(SN_IR_URL) + '" target="_blank" rel="noopener" ' +
      'title="SharkNinja Investor Relations" aria-label="SharkNinja Investor Relations">' +
      '<img src="' + SN_CE_LOGO + '" alt="SharkNinja logo" onerror="this.style.display=\'none\'">' +
    '</a>' +
    '<a class="edgar" href="' + esc(SN_EDGAR_URL) + '" target="_blank" rel="noopener" ' +
      'title="SharkNinja on SEC EDGAR" aria-label="SharkNinja on SEC EDGAR">' +
      '<img src="' + SN_CE_SEAL + '" alt="SEC seal" onerror="this.style.display=\'none\'">' +
    '</a></div>';
}

function ceQkey(q){ return String(q).replace(/\s+/g, '-').toLowerCase(); }
function ceQPhases(q){
  var ph = ['setup'];
  if (SN_RESULTS[q.q]) ph.push('results');
  return ph;
}
function ceQPills(){
  return '<div class="ce-qpills">' + SN_CE_QUARTERS.map(function(q, i){
    return '<button type="button" class="ce-qpill' + (i === 0 ? ' active' : '') + '" ' +
      'data-ceqsel="' + esc(ceQkey(q.q)) + '" data-ceqhas="' + ceQPhases(q).join(' ') + '">' +
      esc(q.q) + (q.status === 'upcoming' ? '<span class="ce-qtag">upcoming</span>' : '') + '</button>';
  }).join('') + '</div>';
}

// ── Setup ────────────────────────────────────────────────────────────────────
function ceFmt(v, unit){
  if (v == null) return '—';
  if (unit === 'eps') return '$' + (+v).toFixed(2);
  return '$' + (+v).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'M';
}
function ceYoY(y){
  if (y == null) return '';
  var p = (y * 100).toFixed(1);
  return '<span class="ce-val-lab" style="color:' + (y < 0 ? '#EA4335' : '#2E8B57') + '">' +
    (y > 0 ? '+' : '') + p + '% YoY</span>';
}
// One Setup cell: Street on top, Summit below. Summit is EMPTY for SN and says so — never a
// fabricated second opinion (§5 rule 3).
function ceCell(spec, period, prior, custom){
  var c = snCell(spec.key, period, prior, spec.unit);
  return '<div class="ce-cell' + (custom ? ' ce-cell-custom' : '') + '">' +
    '<div class="ce-cell-k">' + esc(spec.k) +
      (spec.note ? ' <button type="button" class="ce-q" data-snq="' + esc(spec.k) + '" ' +
        'aria-label="Caveat">?</button>' : '') + '</div>' +
    '<div class="ce-val ce-val-cons" data-snest="cons">' +
      '<span class="ce-cell-v">' + (c ? ceFmt(c.v, spec.unit) : '—') + '</span> ' +
      (c ? ceYoY(c.yoy) : '') +
      '<div class="ce-val-lab">Street · Bloomberg</div></div>' +
    '<div class="ce-val ce-val-us" data-snest="us" hidden>' +
      '<span class="ce-cell-v">—</span>' +
      '<div class="ce-val-lab">Summit · no model for SN</div></div>' +
    (spec.note ? '<div class="ce-note-row" data-snqbody="' + esc(spec.k) + '" hidden>' + spec.note + '</div>' : '') +
    '</div>';
}

function ceSetupUpcoming(q){
  var head = SN_SETUP_HEADLINE.map(function(s){ return ceCell(s, q.period, q.prior, false); }).join('');
  var cust = SN_SETUP_CUSTOM.map(function(s){ return ceCell(s, q.period, q.prior, true); }).join('');
  return '<div class="ce-phase">' + esc(q.q) + ' · ' + esc(q.date) + '</div>' +
    '<div class="ce-pill" style="margin-bottom:12px">Consensus ⇄ Summit</div>' +
    '<div class="ce-legend">' +
      '<span class="ce-legend-i"><b>Street</b> — Bloomberg consensus, ' + esc(SN_CE_ASOF) + ' snapshot</span>' +
      '<span class="ce-legend-i"><b>Summit</b> — empty: no DCF model exists for SN</span>' +
      '<span class="ce-legend-i">? — a caveat worth reading before quoting the cell</span>' +
    '</div>' +
    '<div class="ce-pill" data-snestbar style="display:inline-flex;gap:4px;margin:10px 0 14px">' +
      '<button type="button" class="ce-phtab active" data-snest-sel="cons">Consensus</button>' +
      '<button type="button" class="ce-phtab" data-snest-sel="us">Summit</button>' +
      '<button type="button" class="ce-phtab" data-snest-sel="both">Both</button>' +
    '</div>' +
    '<div class="ce-grid4">' + head + '</div>' +
    '<div class="ce-phase" style="margin-top:18px">The four that decide the quarter</div>' +
    '<div class="ce-grid4">' + cust + '</div>' +
    '<div class="ce-phase" style="margin-top:20px">The debate — what it establishes going in</div>' +
    '<div class="ce-note">' + SN_SETUP_DEBATE_NOTE + '</div>' +
    '<div class="ce-synth">' + SN_SETUP_SYNTH + '</div>' +
    '<div class="ce-note">Street figures derived at render time from js/results-data/sn.js — ' +
      esc(SN_CE_SOURCE) + '.</div>' +
    '<div class="ce-phase" style="margin-top:22px">The setup picture — reported actuals vs. Street</div>' +
    '<div data-snsetupchart>' + (resultsHtml('SN_SETUP') || '') + '</div>';
}

function ceSetupFrozen(q){
  var f = SN_FROZEN[q.q];
  if (!f) return '<div class="ce-empty">No frozen pre-call view was recorded for this quarter.</div>';
  return '<div class="ce-phase">' + esc(q.q) + ' · the frozen pre-call view</div>' +
    '<div class="ce-frozen">' +
      '<div class="ce-band-t">What was priced in</div>' +
      '<div class="ce-band-i">' + f.pricedIn + '</div>' +
      '<div class="ce-band-t" style="margin-top:11px">The one-liner going in</div>' +
      '<div class="ce-band-i">' + f.oneLiner + '</div>' +
    '</div>';
}

function ceSetupBody(){
  return SN_CE_QUARTERS.map(function(q, i){
    return '<div class="ce-qblock" data-ceq="' + esc(ceQkey(q.q)) + '"' + (i === 0 ? '' : ' hidden') + '>' +
      (q.status === 'upcoming' ? ceSetupUpcoming(q) : ceSetupFrozen(q)) + '</div>';
  }).join('');
}

// ── Watch List (§6f) — ours, flat, cross-quarter ─────────────────────────────
function ceWatchBody(){
  var tags = [];
  SN_WL_ROWS.forEach(function(r){ r.tags.forEach(function(t){ if (tags.indexOf(t) < 0) tags.push(t); }); });

  var tagbar = '<div class="ce-wl-tagbar">' +
    '<button type="button" class="ce-wl-tag active" data-snwltag="all">All</button>' +
    tags.map(function(t){
      return '<button type="button" class="ce-wl-tag" data-snwltag="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('') + '</div>';

  var win = '<div class="ce-wl-win">' +
    ['all', 'open', 'closed'].map(function(k, i){
      var lab = k === 'all' ? 'All' : (k === 'open' ? 'Open hooks' : 'Closed');
      return '<button type="button" class="ce-phtab' + (i === 0 ? ' active' : '') + '" data-snwlwin="' + k + '">' + lab + '</button>';
    }).join('') + '</div>';

  var cards = SN_WL_ROWS.slice().sort(function(a, b){ return a.rank - b.rank; }).map(function(r){
    var open = !r.trackUntil;
    return '<div class="ce-wl-frow" data-snwlrow="' + esc(r.id) + '" data-snwltags="' + esc(r.tags.join(' ')) +
        '" data-snwlopen="' + (open ? '1' : '0') + '">' +
      '<div class="ce-wl-fh">' +
        '<span class="ce-wl-fh-t">' + esc(r.theme) + '</span>' +
        '<span class="ce-wl-fh-s">' + esc(r.q) + '</span>' +
      '</div>' +
      '<div class="ce-wl-lb">' + r.definition + '</div>' +
      '<div class="ce-wl-hint">' +
        r.tags.map(function(t){ return '<span class="ce-hl-tag">' + esc(t) + '</span>'; }).join(' ') +
        ' · <b>' + (open ? 'open' : 'closed ' + esc(r.trackUntil)) + '</b>' +
        (r.trackSince ? ' · since ' + esc(r.trackSince) : '') +
        (r.seededBy ? ' · <span class="ce-seed">' + (r.seededBy.tripped
            ? '⚑ thesis line broke in ' + esc(r.seededBy.q)
            : 'left open by ' + esc(r.seededBy.q)) + '</span>' : '') +
      '</div>' +
      (r.src ? '<div class="ce-note-row">' + r.src + '</div>' : '') +
    '</div>';
  }).join('');

  // The storage view — the table, with a live counter and the copy actions (§6f).
  var tbl = '<div class="ce-wl-tbl-wrap"><table class="ce-wl-tbl"><thead><tr>' +
    '<th>theme</th><th>tags</th><th>trackSince</th><th>trackUntil</th></tr></thead><tbody>' +
    SN_WL_ROWS.map(function(r){
      return '<tr><td class="ce-wl-tbl-t">' + esc(r.theme) + '</td><td>' + esc(r.tags.join(' ')) +
        '</td><td>' + esc(r.trackSince || '') + '</td><td>' + esc(r.trackUntil || '—') + '</td></tr>';
    }).join('') + '</tbody></table></div>';

  return '<div class="ce-phase">The hunt list — ' + SN_WL_ROWS.length + ' themes, ' +
      SN_WL_ROWS.filter(function(r){ return !r.trackUntil; }).length + ' open</div>' +
    '<div class="ce-note">' + SN_WL_NOTE + '</div>' +
    tagbar + win +
    '<div class="ce-wl-all">' + cards + '</div>' +
    '<div class="ce-phase" style="margin-top:20px">The table — the storage view</div>' + tbl +
    '<div class="ce-note">Rows live in <code>SN_WL_ROWS</code> (js/overviews/sharkninja-earnings.js). ' +
      'The add / edit / delete composer that AMZN ships is not wired here — SN\'s list is edited in the ' +
      'file, and pretending otherwise would put a control on screen that writes nowhere.</div>' +
    '<div class="ce-phase" style="margin-top:24px">The theme record</div>' +
    '<div class="ce-note">The full commentary compendium — themes, status and age — is rendered by the ' +
      'shared engine under <b>Top Line &#9656; Segments &#9656; What management has said</b>, which is where ' +
      '<code>SN_THEMES</code> already lives. One home, not two.</div>';
}

// ── Post-Results — the red-line check FIRST, then the scorecard ──────────────
var CE_RES = {
  beat:   ['beat', '#2E8B57'],
  miss:   ['miss', '#EA4335'],
  inline: ['in line', '#9AA4B0'],
  nodisc: ['not disclosed', '#B7791F'],
  nocons: ['no Street estimate', '#9AA4B0'],
};
function ceSurpWord(n){
  if (n >= 70) return ['big surprise', 'hi'];
  if (n >= 40) return ['some surprise', 'md'];
  return ['as expected', 'lo'];
}

function ceResultsQ(q){
  var r = SN_RESULTS[q.q];
  if (!r) return '<div class="ce-empty">This quarter has not reported.</div>';

  var tripped = r.thesisCheck.filter(function(t){ return t.tripped; }).length;
  var lines = r.thesisCheck.slice().sort(function(a, b){ return (b.tripped ? 1 : 0) - (a.tripped ? 1 : 0); });
  var thesis = '<div class="ce-thesis">' +
    '<div class="ce-thesis-h"><span class="ce-thesis-t">The red lines — what would change the thesis</span>' +
      '<span class="ce-thesis-c ' + (tripped ? 'trip' : 'ok') + '">' +
        (tripped ? '⚑ ' + tripped + ' tripped' : '✓ all held') + '</span></div>' +
    lines.map(function(t){
      return '<div class="ce-thesis-r' + (t.tripped ? ' trip' : '') + '">' +
        '<div class="ce-thesis-ic">' + (t.tripped ? '⚑' : '✓') + '</div>' +
        '<div><div class="ce-thesis-l">' + esc(t.line) + '</div>' +
        '<div class="ce-thesis-n">' + t.note + '</div></div></div>';
    }).join('') + '</div>';

  var rows = r.scorecard.slice().sort(function(a, b){ return b.surprise - a.surprise; }).map(function(s){
    var v = CE_RES[s.result] || CE_RES.nocons, w = ceSurpWord(s.surprise);
    return '<div class="ce-sc-row">' +
      '<div class="ce-sc-m">' + esc(s.metric) + '</div>' +
      '<div class="ce-sc-a">' + esc(s.actual) + '</div>' +
      '<div class="ce-sc-v">' + esc(s.yoy) + '</div>' +
      '<div class="ce-sc-c" style="color:' + v[1] + '">' + v[0] + '</div>' +
      '<div class="ce-sc-surp ' + w[1] + '">' + w[0] + '</div>' +
      '<div class="ce-sc-bw">' + s.note + '</div></div>';
  }).join('');

  var hl = SN_CALL[q.q];
  var bands = ['context', 'logged'].map(function(b){
    var items = hl ? hl.highlights.filter(function(x){ return x.band === b; }) : [];
    if (!items.length) return '';
    return '<div class="ce-suppl-band"><div class="ce-suppl-band-h">' +
      (b === 'context' ? 'Context' : 'Logged') + '</div>' +
      items.map(function(x){
        return '<div class="ce-suppl-i"><b>' + x.t + '</b>' +
          (x.open ? '<span class="ce-suppl-open">open</span>' : '') + ' — ' + x.d + '</div>';
      }).join('') + '</div>';
  }).join('');

  return '<div class="ce-phase">' + esc(q.q) + ' · reported ' + esc(r.date) + '</div>' +
    thesis +
    '<div class="ce-legend">' +
      '<span class="ce-legend-i"><b>Ordered by surprise</b>, never by release order</span>' +
      '<span class="ce-legend-i">Surprise is <b>editorial</b> — it renders as a word, never a bar or a percentage</span>' +
      '<span class="ce-legend-i"><b>no Street estimate</b> — §7b <code>nocons</code>: an unmodelled line, not a failure</span>' +
    '</div>' +
    '<div class="ce-sc">' + rows + '</div>' +
    '<div class="ce-note"><b>Why every row says "no Street estimate":</b> our only Bloomberg file for SN is a ' +
      'Sep-2026 snapshot taken <i>after</i> this print, so there is no frozen pre-print column to score ' +
      'against. Scoring beat/miss off a post-print snapshot would be look-ahead. §7b exists for exactly ' +
      'this case, and is explicit that it is never a comment on our coverage.</div>' +
    '<div class="ce-phase" style="margin-top:18px">What the numbers tee up for the call</div>' +
    '<ul class="ce-diverge">' + r.intoCall.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' +
    '<div class="ce-suppl"><div class="ce-suppl-h">' +
      '<span class="ce-suppl-t">Also on the call</span>' +
      '<span class="ce-suppl-pill">supplemental</span></div>' +
      '<div class="ce-note-row">Call colour that would never earn a Watch slot but is still worth saying. ' +
        'Thesis-movers are deliberately NOT here — they are routed to the Watch List, which is the ' +
        'tracking layer.</div>' + bands + '</div>' +
    '<div class="ce-note">Price reaction: ' + esc(r.priceReaction) + '</div>';
}

function ceResultsBody(){
  return SN_CE_QUARTERS.map(function(q, i){
    return '<div class="ce-qblock" data-ceq="' + esc(ceQkey(q.q)) + '"' + (i === 0 ? '' : ' hidden') + '>' +
      ceResultsQ(q) + '</div>';
  }).join('');
}

function qEarnings(){
  return ceHeaderSources() +
    '<div class="dd-sub">' + SN_EARN_LEDE + '</div>' +
    ceQPills() +
    '<div class="ce-phtabs">' +
      '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>' +
      '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>' +
      '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>' +
    '</div>' +
    '<div class="ce-phpane" data-cep="setup">' + ceSetupBody() + '</div>' +
    '<div class="ce-phpane" data-cep="watch" hidden>' + ceWatchBody() + '</div>' +
    '<div class="ce-phpane" data-cep="results" hidden>' + ceResultsBody() + '</div>' +
    '<div class="ce-note">' + esc(SN_EARN_SOURCES) + '</div>' +
    pendingBlock(SN_EARN_PENDING);
}

function qEstimates(){
  return '<div class="dd-h">Estimates</div>' +
    (resultsEvoHtml('SN') || pendingBlock(SN_EST_PENDING));
}

// ── Evolution ▸ Strategy ──────────────────────────────────────────────────────
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

  return '<div class="dd-h">Strategy</div>' +
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

// ── Evolution ▸ Timeline ──────────────────────────────────────────────────────
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

  return '<div class="dd-h">Timeline</div>' +
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
  var h = '<div class="ov ov-sn ov-sn-dd" data-brand="SN" style="--brand:'+SN_BRAND+';--brand-soft:'+SN_BRAND_SOFT+'">';
  h += '<div class="dd-callout" style="margin-top:0">'+esc(SN_DD_INTRO)+'</div>';
  h += '<div class="dd-callout">'+SN_Q_INTRO+'</div>';
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
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
    '<div class="ovt-subpane" data-ovst="segdrv" hidden>'+(segmentsHtml('SN')||'')+'</div>'+
    '<div class="ovt-subpane" data-ovst="segoth" hidden>'+(segmentsOtherHtml('SN')||'')+'</div>'+
    '<div class="ovt-subpane" data-ovst="segcus" hidden>'+(segmentsCustomersHtml('SN')||'')+'</div>'+
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
      '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="earnings">'+qEarnings()+'</div>'+
    '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('SN')+'</div>'+
    '<div class="ovt-subpane" data-ovst="estevo" hidden>'+qEstimates()+'</div>'+
    '<div class="ovt-subpane" data-ovst="guidance" hidden>'+qGuidance()+'</div>'+
    '<div class="ovt-subpane" data-ovst="strategy" hidden>'+qStrategy()+'</div>'+
    '<div class="ovt-subpane" data-ovst="timeline" hidden>'+qTimeline()+'</div>'+
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
    '<div class="ovt-subpane" data-ovst="other" hidden>'+miscOther()+qOtherAnalysisExtras()+'</div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(SN_DD_SOURCES)+' '+esc(SN_BL_SOURCES)+' '+esc(SN_MISC_SOURCES)+' '+esc(SN_QUARTR_SOURCES)+'</div>';
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
  // Earnings ▸ Setup hosts the Results engine on the SN_SETUP dataset — only build it when
  // the Setup phase is the visible one (Chart.js needs a non-null offsetParent).
  if(key==='earnings'){
    var ph = sub.querySelector('.ce-phpane[data-cep="setup"]');
    var host = ph && ph.querySelector('.ce-qblock:not([hidden]) [data-snsetupchart]');
    if(ph && !ph.hidden && host) requestAnimationFrame(function(){ initResults(host, 'SN_SETUP'); });
    return;
  }
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
  // Evolution ▸ Guidance — fiscal-year pills.
  root.querySelectorAll('[data-snguide]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var fy = btn.getAttribute('data-snguide');
      root.querySelectorAll('[data-snguide]').forEach(function(b){ b.classList.toggle('active', b===btn); });
      root.querySelectorAll('[data-snguidepane]').forEach(function(p){ p.hidden = p.getAttribute('data-snguidepane')!==fy; });
    });
  });
  // ── Evolution ▸ Earnings — the §6 machinery: phase tabs · quarter pills · estimate
  // toggle · caveat pop-ups. Scoped to the earnings subpane so it cannot drive the
  // Deep Dive's other .ovt-subtab rows.
  var earnPane = root.querySelector('.ovt-subpane[data-ovst="earnings"]');
  if(earnPane){
    // The quarter selector drives the per-quarter blocks in Setup and Post-Results. The
    // Watch List is a flat cross-quarter table (§6f), so the pills are hidden there rather
    // than left on screen as a dead control.
    function ceSelectQuarter(qk){
      earnPane.querySelectorAll('.ce-qpill').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-ceqsel')===qk); });
      earnPane.querySelectorAll('.ce-qblock').forEach(function(blk){
        blk.hidden = blk.getAttribute('data-ceq')!==qk; });
    }
    // Chart.js needs a non-null offsetParent, so the chart is only built for the block that is
    // actually visible — and rebuilt whenever the phase or the quarter changes.
    function ceBuildSetupChart(){
      var ph = earnPane.querySelector('.ce-phpane[data-cep="setup"]');
      if(!ph || ph.hidden) return;
      var host = ph.querySelector('.ce-qblock:not([hidden]) [data-snsetupchart]');
      if(host) requestAnimationFrame(function(){ initResults(host, 'SN_SETUP'); });
    }
    function ceApplyPhase(phase){
      var bar = earnPane.querySelector('.ce-qpills');
      if(bar) bar.hidden = (phase==='watch');
      var pills = [].slice.call(earnPane.querySelectorAll('.ce-qpill'));
      var lastVisible = null, activeVisible = false;
      pills.forEach(function(b){
        var ok = (b.getAttribute('data-ceqhas')||'').split(' ').indexOf(phase) >= 0;
        b.hidden = !ok;
        if(ok){ lastVisible = b; if(b.classList.contains('active')) activeVisible = true; }
      });
      // If the active quarter has no block in this phase, fall back to the most recent that does.
      if(!activeVisible && lastVisible) ceSelectQuarter(lastVisible.getAttribute('data-ceqsel'));
    }
    earnPane.querySelectorAll('.ce-phtab[data-cep]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-cep');
        earnPane.querySelectorAll('.ce-phtab[data-cep]').forEach(function(b){ b.classList.toggle('active', b===btn); });
        earnPane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden = p.getAttribute('data-cep')!==k; });
        ceApplyPhase(k);
        if(k==='setup') ceBuildSetupChart();
      });
    });
    earnPane.querySelectorAll('.ce-qpill').forEach(function(btn){
      btn.addEventListener('click', function(){
        ceSelectQuarter(btn.getAttribute('data-ceqsel'));
        ceBuildSetupChart();
      });
    });
    // Consensus ⇄ Summit ⇄ Both. Summit is empty for SN, so "Summit" and "Both" are honest
    // about that rather than hiding the control.
    earnPane.querySelectorAll('[data-snest-sel]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-snest-sel');
        earnPane.querySelectorAll('[data-snest-sel]').forEach(function(b){ b.classList.toggle('active', b===btn); });
        earnPane.querySelectorAll('[data-snest]').forEach(function(v){
          var kind = v.getAttribute('data-snest');
          v.hidden = (k==='both') ? false : (kind !== k);
        });
      });
    });
    // ceQ caveat pop-ups on the cells that carry a trap.
    earnPane.querySelectorAll('[data-snq]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-snq');
        var body = earnPane.querySelector('[data-snqbody="'+k.replace(/"/g,'\\"')+'"]');
        if(body) body.hidden = !body.hidden;
      });
    });
    // Watch List — tag bar and the tracking-window segment, both filtering the same cards.
    var wlTag = 'all', wlWin = 'all';
    function wlApply(){
      earnPane.querySelectorAll('[data-snwlrow]').forEach(function(c){
        var tags = (c.getAttribute('data-snwltags')||'').split(' ');
        var open = c.getAttribute('data-snwlopen')==='1';
        var okTag = (wlTag==='all') || tags.indexOf(wlTag)>=0;
        var okWin = (wlWin==='all') || (wlWin==='open' ? open : !open);
        c.hidden = !(okTag && okWin);
      });
    }
    earnPane.querySelectorAll('[data-snwltag]').forEach(function(btn){
      btn.addEventListener('click', function(){
        wlTag = btn.getAttribute('data-snwltag');
        earnPane.querySelectorAll('[data-snwltag]').forEach(function(b){ b.classList.toggle('active', b===btn); });
        wlApply();
      });
    });
    earnPane.querySelectorAll('[data-snwlwin]').forEach(function(btn){
      btn.addEventListener('click', function(){
        wlWin = btn.getAttribute('data-snwlwin');
        earnPane.querySelectorAll('[data-snwlwin]').forEach(function(b){ b.classList.toggle('active', b===btn); });
        wlApply();
      });
    });
    ceApplyPhase('setup');
  }
  // Evolution ▸ Timeline — tag filter chips.
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

export var sharkninjaOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
