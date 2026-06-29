// overviews/nvidia.js — custom Overview for NVIDIA Corporation (Nasdaq: NVDA)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Sub-tabs (same pattern as SoFi): Overview + Industry Analysis. The Industry Analysis
// tab embeds the shared, interactive semiconductor supply-chain map (js/overviews/semi-map.js)
// with NVIDIA highlighted. That map is reusable across every semiconductor company — the
// only per-company difference is which ticker is highlighted.

import { semiIndustry } from './semi-industry.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Company snapshot (lightweight — the focus of this build is the industry map) ──
var SNAPSHOT = [
  ['Listing', 'Nasdaq: NVDA'],
  ['HQ', 'Santa Clara, CA'],
  ['Founded', '1993'],
  ['Model', 'Fabless chip designer'],
  ['Founder & CEO', 'Jensen Huang'],
  ['Made by', 'TSMC (foundry)'],
];
var DESC = 'NVIDIA is a fabless designer of accelerated-computing platforms. It designs the GPUs and full systems at the center of the AI build-out, then outsources manufacturing to TSMC, sources HBM memory from SK hynix, and assembles systems through partners such as Foxconn. Beyond the GPU, NVIDIA owns a full networking stack (NVLink, InfiniBand, Spectrum) acquired via Mellanox. Because the semiconductor industry is not vertically integrated, NVIDIA sits inside a deep web of suppliers and partners — mapped in the Industry Analysis tab.';

var KPIS = [
  { l:'Model',        v:'Fabless',  d:'Designs · TSMC manufactures', dir:'muted' },
  { l:'Foundry',      v:'TSMC',     d:'Leading-edge nodes',          dir:'muted' },
  { l:'HBM supplier', v:'SK hynix', d:'HBM3e for AI systems',        dir:'muted' },
  { l:'Networking',   v:'Mellanox', d:'NVLink · InfiniBand',         dir:'muted' },
];
var NOTE = 'This Overview is a work in progress — the company financial profile is being built. The Industry Analysis tab below is ready: an interactive map of the semiconductor supply chain with NVIDIA highlighted.';

function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }

function overviewBody(c){
  var h = '';
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(NOTE)+'</div>';
  return h;
}

// Industry Analysis sub-tab — intro + the shared map (Flow + Network), NVIDIA highlighted.
function industryBody(c){
  return '<div class="ov-sec-h" style="margin-bottom:10px">Semiconductor Supply-Chain Map</div>'+
    // focus:true → the Flow view opens pre-drilled to NVIDIA's place in the chain.
    // Drop the focus flag (or call with no opts) to get the standalone, industry-wide map.
    semiIndustry.html({ highlight: 'NVDA', focus: true });
}

function html(c){
  var h = '<div class="ov ov-nvda" data-brand="NVDA">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="industry">Industry Analysis</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="industry" hidden>'+industryBody(c)+'</div>';
  h += '</div>';
  return h;
}

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

function init(c){
  var root = document.querySelector('.ov-nvda');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  // If Industry Analysis is the active tab on load, build the map.
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

export var nvidiaOverview = { html: html, init: init };
