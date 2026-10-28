// overviews/tsm-fabs.js — TSMC Deep Dive ▸ Miscellaneous ▸ Fabs & Capacity (MISC-fabs, playbook §15b).
//
// Ported from SAB's standalone TSMC dashboard (v7, Oct 16 2026: views "Map" and "Capacity"), rebuilt on portal
// pieces: KPIs (.ov-kpis), a static world map (./world-map-data.js — the dashboard fetched the atlas from a CDN at
// runtime, which the portal CSP blocks), the fab directory as a portal table (.twrap/.rt), and two Chart.js charts
// with their tables. Reported figures and estimates are tagged per row (see ./tsm-fabs-data.js). Only history and
// disclosed targets are ported (SAB: forward assumptions wait for the dashboard's open decisions).
import { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, fade } from '../viz-palette.js';
import { WORLD_LAND, worldXY } from './world-map-data.js';
import { TSM_FABS, TSM_CAPACITY_2025, TSM_WAFERS_Q, TSM_COWOS, TSM_FABS_SRC } from './tsm-fabs-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var ST = {
  op:   { l:'In operation',          c:SUMMIT_INK },
  ramp: { l:'Ramping',               c:SUMMIT_CAT[0] },
  pkg:  { l:'Advanced packaging',    c:SUMMIT_CAT[6] },
  build:{ l:'Under construction',    c:SUMMIT_CAT[3] },
  plan: { l:'Planned',               c:SUMMIT_MUTE }
};
var RANK = { ramp:0, build:1, op:2, pkg:3, plan:4 };   // a site takes the colour of its most "in-motion" fab
var FABS = TSM_FABS.map(function(r){ return { k:r[0], n:r[1], loc:r[2], cc:r[3], lat:r[4], lon:r[5], start:r[6], wafer:r[7], node:r[8], st:r[9], cap:r[10], note:r[11] }; });
// One marker per site (fabs a few hundred metres apart would overprint at any zoom).
var SITES = (function(){
  var m = {}, out = [];
  FABS.forEach(function(f){ var key = f.loc;
    if(!m[key]){ m[key] = { key:'s'+out.length, loc:f.loc, cc:f.cc, lat:f.lat, lon:f.lon, fabs:[] }; out.push(m[key]); }
    m[key].fabs.push(f); });
  out.forEach(function(s){ s.st = s.fabs.slice().sort(function(a,b){ return RANK[a.st]-RANK[b.st]; })[0].st; });
  return out;
})();
var VIEWS = {   // viewBoxes in the 960x480 equirectangular frame
  world: [0, 40, 960, 320], asia: [756, 122, 90, 64], taiwan: [797.6, 171.4, 10, 12.4],
  usa: [128, 100, 84, 70], europe: [480, 84, 64, 42]
};
var MAP = { view:'world' };

function siteMarkers(){
  var vb = VIEWS[MAP.view], svg = document.getElementById('tsmFabMap');
  var px = svg ? svg.getBoundingClientRect().width : 900, u = vb[2] / (px || 900);   // map units per screen pixel
  return SITES.map(function(s){
    var p = worldXY(s.lon, s.lat), n = s.fabs.length, r = (n > 1 ? 7.5 : 5.5) * u;
    return '<g class="fab-site" data-detail="fab:'+s.key+'" transform="translate('+p[0].toFixed(3)+','+p[1].toFixed(3)+')">'+
      '<circle r="'+r.toFixed(3)+'" fill="'+ST[s.st].c+'" stroke="#fff" stroke-width="'+(1.5*u).toFixed(3)+'"></circle>'+
      (n > 1 ? '<text text-anchor="middle" dy="'+(3.6*u).toFixed(3)+'" font-size="'+(9.5*u).toFixed(3)+'" font-weight="800" fill="#fff">'+n+'</text>' : '')+
      '<title>'+esc(s.loc)+' — '+n+' site'+(n>1?'s':'')+'</title></g>';
  }).join('');
}
function legend(){
  return Object.keys(ST).map(function(k){ return '<span class="fab-leg"><span class="fab-dot" style="background:'+ST[k].c+'"></span>'+ST[k].l+'</span>'; }).join('');
}
function capCell(f){ return f.cap == null ? '<span class="own-nil">—</span>' : f.cap + 'K <span class="fab-est">estimate</span>'; }
function directory(){
  var rows = FABS.map(function(f){
    return '<tr><td><b>'+esc(f.n)+'</b>'+(f.note?'<span class="own-note">'+esc(f.note)+'</span>':'')+'</td><td>'+esc(f.loc)+'</td><td>'+esc(f.start)+'</td><td>'+esc(f.wafer)+'</td>'+
      '<td>'+esc(f.node)+'</td><td><span class="fab-dot" style="background:'+ST[f.st].c+'"></span>'+ST[f.st].l+'</td><td>'+capCell(f)+'</td></tr>'; }).join('');
  return '<div class="twrap own-wrap"><table class="rt own-tbl fab-tbl"><thead><tr><th>Fab</th><th>Location</th><th>Production since</th><th>Wafer</th><th>Most advanced node (nm)</th><th>Status</th><th>Capacity, K wafers / month</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function collap(title, inner){
  return '<div class="rs-collap fab-collap"><button type="button" class="rs-collap-h"><span class="rs-collap-ic">▸</span> '+title+'</button><div class="rs-collap-b" hidden>'+inner+'</div></div>';
}
function wafersTable(){
  var q = TSM_WAFERS_Q, rows = '';
  for(var i = q.q.length-1; i >= 0; i--){ var yoy = i >= 4 ? (q.v[i]/q.v[i-4]-1)*100 : null;
    rows += '<tr><td><b>'+q.q[i]+'</b></td><td>'+q.v[i].toFixed(3)+'</td><td>'+(yoy==null?'—':(yoy>=0?'+':'−')+Math.abs(yoy).toFixed(1)+'%')+'</td></tr>'; }
  return '<div class="twrap own-wrap"><table class="rt own-tbl fab-num"><thead><tr><th>Quarter</th><th>Wafers (M, 12-inch eq.)</th><th>YoY</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function cowosTable(){
  var c = TSM_COWOS;
  return '<div class="twrap own-wrap"><table class="rt own-tbl fab-num"><thead><tr><th>Year-end</th><th>CoWoS capacity (K wafers / month)</th><th>Basis</th></tr></thead><tbody>'+
    c.y.map(function(y,i){ return '<tr><td><b>'+y+'</b></td><td>'+c.v[i]+'</td><td>'+(/E$/.test(y)?'target (estimate)':'estimate')+'</td></tr>'; }).join('')+'</tbody></table></div>';
}

export function tsmFabsBody(){
  var nOp = FABS.filter(function(f){ return f.st==='op' || f.st==='ramp'; }).length;
  var ctry = {}; FABS.forEach(function(f){ ctry[f.cc]=1; });
  var q = TSM_WAFERS_Q, last = q.v.length-1;
  var h = '<p class="ov-lede"><b>Where TSMC makes its chips.</b> The fabs the 20-F lists, the sites still being built outside Taiwan, and how many wafers go out the door each quarter. Capacity by fab is <b>not disclosed</b> by TSMC; where it appears it is a third-party estimate and is tagged as such.</p>';
  h += '<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+nOp+'</div><div class="ov-kpi-d muted">wafer fabs in operation (20-F, Feb 28 2026)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+Object.keys(ctry).length+'</div><div class="ov-kpi-d muted">countries — Taiwan, U.S., Japan, China, plus Germany under construction</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+TSM_CAPACITY_2025+'</div><div class="ov-kpi-d muted">annual capacity 2025, 12-inch-equivalent wafers (20-F)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">'+q.v[last].toFixed(2)+'M</div><div class="ov-kpi-d muted">wafers shipped in '+q.q[last]+' — a record</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-v">~'+TSM_COWOS.v[TSM_COWOS.v.length-1]+'K</div><div class="ov-kpi-d muted">CoWoS wafers / month, 2026 target <span class="fab-est">estimate</span></div></div></div>';
  h += '<div class="ov-sec-h mg-sec-gap">The fab network</div>';
  h += '<div class="mg-tog-row fab-ctl"><span class="mg-tog">Zoom: <span class="mg-seg">'+
    [['world','World'],['asia','East Asia'],['taiwan','Taiwan'],['usa','U.S.'],['europe','Europe']].map(function(v){ return '<button type="button" class="mg-pill'+(MAP.view===v[0]?' active':'')+'" data-fabview="'+v[0]+'">'+v[1]+'</button>'; }).join('')+
    '</span></span><span class="fab-legs">'+legend()+'</span></div>';
  h += '<div class="fab-map-wrap"><svg id="tsmFabMap" class="fab-map" viewBox="'+VIEWS.world.join(' ')+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="TSMC fab locations">'+
    '<path class="fab-land" d="'+WORLD_LAND+'"></path><g id="tsmFabSites">'+siteMarkers()+'</g></svg></div>';
  h += '<div class="ov-fynote">One marker per site; the number is how many fabs share it. Tap a marker for its fabs.</div>';
  h += '<div class="ov-sec-h mg-sec-gap">Fab directory</div>'+directory();
  h += '<div class="ov-sec-h mg-sec-gap">Wafer shipments by quarter (million 12-inch-equivalent wafers)</div>';
  h += '<div class="fab-chart"><canvas id="tsmFabWafers"></canvas></div>'+collap('Data — what the chart draws', wafersTable());
  h += '<div class="ov-sec-h mg-sec-gap">CoWoS advanced-packaging capacity <span class="fab-est">estimate</span></div>';
  h += '<div class="fab-chart fab-chart-sm"><canvas id="tsmFabCowos"></canvas></div>'+collap('Data — what the chart draws', cowosTable());
  h += '<div class="ov-foot">'+TSM_FABS_SRC+'</div>';
  return h;
}
export function tsmFabsPop(id){
  var s = SITES.filter(function(x){ return x.key===id; })[0]; if(!s) return null;
  var rows = s.fabs.map(function(f){ return '<tr><td><b>'+esc(f.n)+'</b></td><td>'+esc(f.start)+'</td><td>'+esc(f.node)+'</td><td>'+ST[f.st].l+'</td><td>'+(f.cap==null?'—':f.cap+'K (est.)')+'</td></tr>'+(f.note?'<tr><td colspan="5" class="fab-pop-note">'+esc(f.note)+'</td></tr>':''); }).join('');
  return { t: esc(s.loc), h: '<table class="rt"><thead><tr><th>Fab</th><th>Since</th><th>Node (nm)</th><th>Status</th><th>Capacity</th></tr></thead><tbody>'+rows+'</tbody></table>' };
}

var _ch = {};
function ready(id){ var c=document.getElementById(id); return (c && typeof Chart!=='undefined' && c.offsetParent) ? c : null; }
export function tsmFabsBuild(root){
  var pane = root.querySelector('.ov-tsm-dd .ovt-subpane[data-ovst="fabs"]'); if(!pane) return;
  if(!pane._fabWired){ pane._fabWired = true;
    pane.addEventListener('click', function(e){ var b = e.target.closest && e.target.closest('[data-fabview]'); if(!b) return;
      MAP.view = b.getAttribute('data-fabview');
      pane.querySelectorAll('[data-fabview]').forEach(function(x){ x.classList.toggle('active', x===b); });
      var svg = document.getElementById('tsmFabMap'); svg.setAttribute('viewBox', VIEWS[MAP.view].join(' '));
      document.getElementById('tsmFabSites').innerHTML = siteMarkers(); });
  }
  document.getElementById('tsmFabSites').innerHTML = siteMarkers();   // re-size markers to the rendered width
  var c1 = ready('tsmFabWafers');
  if(c1){ if(_ch.w) _ch.w.destroy(); var q = TSM_WAFERS_Q, last = q.v.length-1;
    _ch.w = new Chart(c1.getContext('2d'), { type:'bar',
      data:{ labels:q.q, datasets:[{ label:'Wafer shipments (M)', data:q.v, backgroundColor:q.v.map(function(_,i){ return i===last ? SUMMIT_CAT[0] : fade(SUMMIT_INK,0.82); }), borderRadius:3, maxBarThickness:22 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ return c.parsed.y.toFixed(3)+'M wafers (12-inch eq.)'; } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:9 }, maxRotation:0, autoSkip:true } },
                 y:{ position:'right', grid:{ color:'#EEF2F7' }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, callback:function(v){ return v+'M'; } } } } } }); }
  var c2 = ready('tsmFabCowos');
  if(c2){ if(_ch.c) _ch.c.destroy(); var cw = TSM_COWOS;
    _ch.c = new Chart(c2.getContext('2d'), { type:'bar',
      data:{ labels:cw.y, datasets:[{ label:'CoWoS capacity (K wafers / month, estimate)', data:cw.v, backgroundColor:cw.y.map(function(y){ return /E$/.test(y) ? fade(SUMMIT_CAT[6],0.45) : SUMMIT_CAT[6]; }), borderRadius:3, maxBarThickness:34 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ return c.parsed.y+'K wafers / month (estimate)'; } } } },
        scales:{ x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 } } },
                 y:{ position:'right', grid:{ color:'#EEF2F7' }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, callback:function(v){ return v+'K'; } } } } } }); }
}
