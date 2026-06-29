// overviews/bbb-logistics.js — TBBB "Logistics" sub-tab.
//
// A polished, interactive logistics story grounded verbatim in the FY2025 Form 20-F:
//   1. The supply chain   — supplier → distribution center → store, with the numbers.
//   2. DC expansion logic  — a phased, interactive network simulator that shows WHY/WHEN
//                            a new DC is opened (the disclosed "near 150 stores → split
//                            and redistribute" rule), with route lines that reset on split.
//   3. Standardized layout — why one identical store template makes restocking fast.
//   4. Restock cycle       — next-day order-to-shelf flow + volume-based cadence.
//   5. Why it matters      — how logistics powers negative working capital, low cost
//                            and self-funded, replicable growth.
//
// All graphics are inline SVG/HTML (no chart library), CSP-safe.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var DC1 = '#E1251B';   // primary DC (3B red)
var DC2 = '#F59E0B';   // second DC (amber)
var INK = '#3A434F', MUT = '#8A93A0', BDR = '#D7DDE3';

// ─── Inline icons ─────────────────────────────────────────────────────────────
function icoSupplier(){
  return '<svg viewBox="0 0 52 52" class="lg-ico" aria-hidden="true">'+
    '<rect x="6" y="26" width="40" height="20" rx="2" fill="#C2C9D1"/>'+
    '<path d="M6 26 L18 18 L18 26 Z M18 26 L30 18 L30 26 Z M30 26 L42 18 L42 26 Z" fill="#A7B0BA"/>'+
    '<rect x="11" y="12" width="5" height="14" fill="#A7B0BA"/><rect x="20" y="9" width="5" height="17" fill="#A7B0BA"/>'+
    '<rect x="13" y="33" width="7" height="13" fill="#fff"/><rect x="24" y="33" width="7" height="13" fill="#fff" opacity=".75"/><rect x="35" y="33" width="6" height="6" fill="#fff" opacity=".75"/>'+
  '</svg>';
}
function icoDC(color){
  color = color || DC1;
  return '<svg viewBox="0 0 52 52" class="lg-ico" aria-hidden="true">'+
    '<polygon points="6,24 26,12 46,24" fill="'+color+'"/>'+
    '<rect x="9" y="24" width="34" height="22" rx="2" fill="'+color+'"/>'+
    '<rect x="20" y="32" width="12" height="14" fill="#fff"/>'+
    '<rect x="13" y="28" width="6" height="5" fill="#fff" opacity=".7"/><rect x="33" y="28" width="6" height="5" fill="#fff" opacity=".7"/>'+
  '</svg>';
}
function icoStore(){
  return '<svg viewBox="0 0 52 52" class="lg-ico" aria-hidden="true">'+
    '<rect x="9" y="22" width="34" height="24" rx="2" fill="#E1251B"/>'+
    '<path d="M7 22 L10 13 H42 L45 22 Z" fill="#9fd585"/>'+
    '<path d="M10 13 h6 l-1.5 9 h-6 z M22 13 h6 l-0.5 9 h-6 z M34 13 h6 l1 9 h-6 z" fill="#7cc15f"/>'+
    '<rect x="22" y="31" width="9" height="15" fill="#fff"/>'+
    '<rect x="13" y="28" width="6" height="6" fill="#fff" opacity=".85"/>'+
  '</svg>';
}

// ─── Hero stat band ───────────────────────────────────────────────────────────
var STATS = [
  ['20',        'distribution centers'],
  ['≤ 200',     'stores per DC (capacity)'],
  ['150',       'store trigger to split'],
  ['150 km',    'typical radius'],
  ['450',       'same-model trucks'],
  ['next-day',  'order → shelf'],
];

// ─── 1. Supply chain flow ─────────────────────────────────────────────────────
function flowStage(ico, tag, name, rows){
  return '<div class="lg-stage">'+
    '<div class="lg-stage-ico">'+ico+'</div>'+
    '<div class="lg-stage-tag">'+esc(tag)+'</div>'+
    '<div class="lg-stage-name">'+esc(name)+'</div>'+
    '<ul class="lg-stage-rows">'+rows.map(function(r){ return '<li>'+r+'</li>'; }).join('')+'</ul>'+
  '</div>';
}
function blockFlow(){
  var h = '<div class="ov-sec-h ovt-store-h">The supply chain, end to end</div>';
  h += '<div class="lg-flow">'+
    flowStage(icoSupplier(), 'Suppliers', '327 suppliers', [
      'No single supplier is more than <b>3.6%</b> of purchases; top 5 = <b>16.5%</b>',
      'Assortment bought centrally; each region adds up to <b>10 local SKUs</b>']) +
    '<div class="lg-flow-arrow"><span>inbound</span>→</div>'+
    flowStage(icoDC(DC1), 'Distribution center', '20 DCs · 13,050 m²', [
      'Orders processed <b>overnight</b>, picked at dawn',
      '<b>Cross-docking</b> + floor storage for fast-movers — minimal holding']) +
    '<div class="lg-flow-arrow"><span>next-day · own fleet</span>→</div>'+
    flowStage(icoStore(), 'Store', '3,469 stores', [
      '<b>~850–900 SKUs</b>, identical planogram',
      'Restocked <b>2×/week to daily</b> by 3B’s own trucks']) +
  '</div>';
  h += '<div class="ov-foot">Source: FY2025 Form 20-F (Item 4.B Sourcing/Logistics, Item 4.D Distribution Centers).</div>';
  return h;
}

// ─── 2. DC expansion logic — interactive multi-DC network simulator ───────────
var W = 760, H = 430;
var MAXN = 480;
var FIELD = { x:385, y:235 };
var HUBS = [
  { x:300, y:170, color:DC1,       at:0,   label:'DC 1' },
  { x:470, y:170, color:DC2,       at:150, label:'DC 2' },
  { x:470, y:300, color:'#0E8F8F', at:300, label:'DC 3' },
  { x:300, y:300, color:'#4F46E5', at:450, label:'DC 4' },
];
var STORE_POS = [];
(function(){
  var maxr = 178, ga = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < MAXN; i++){
    var r = maxr * Math.sqrt((i + 0.5) / MAXN);
    var a = i * ga;
    STORE_POS.push({ x: FIELD.x + r * Math.cos(a), y: FIELD.y + r * Math.sin(a) });
  }
})();
function dist(p, h){ var dx = p.x - h.x, dy = p.y - h.y; return Math.sqrt(dx*dx + dy*dy); }
function activeCount(n){ return 1 + (n>=150?1:0) + (n>=300?1:0) + (n>=450?1:0); }

var PHASES = [
  { label:'1 DC',  at:90,
    cap:'<b>One DC anchors the region.</b> Stores cluster around it with short routes. As it nears ~150 stores, the newest ones sit farther out and routes stretch.' },
  { label:'2 DCs', at:220,
    cap:'<b>The 150-store trigger fires.</b> A second DC opens nearby and every store is reassigned to its <b>closest</b> DC — long routes snap back to short.' },
  { label:'3 DCs', at:360,
    cap:'<b>The territory keeps subdividing.</b> As each DC again approaches ~150 stores, another is added — here a third — so deliveries always start from a nearby hub.' },
  { label:'4 DCs', at:470,
    cap:'<b>A four-DC network.</b> Tight, short-route regions blanket the area. The same copy-paste pattern scales toward roughly 70 DCs nationwide.' },
];

// Warehouse glyph drawn directly (no nested <svg>) centered at (cx, cy).
function dcGlyph(cx, cy, color){
  return '<polygon points="'+(cx-23)+','+(cy-3)+' '+cx+','+(cy-17)+' '+(cx+23)+','+(cy-3)+'" fill="'+color+'"/>'+
    '<rect x="'+(cx-19)+'" y="'+(cy-3)+'" width="38" height="23" rx="3" fill="'+color+'"/>'+
    '<rect x="'+(cx-6)+'" y="'+(cy+8)+'" width="12" height="12" fill="#fff"/>'+
    '<rect x="'+(cx-15)+'" y="'+(cy+1)+'" width="6" height="5" fill="#fff" opacity="0.7"/>'+
    '<rect x="'+(cx+9)+'" y="'+(cy+1)+'" width="6" height="5" fill="#fff" opacity="0.7"/>';
}
function hubMarker(h, idx, hidden){
  return '<g class="lg-hub lg-hub-'+idx+'"'+(hidden ? ' hidden' : '')+'>'+
    '<circle cx="'+h.x+'" cy="'+h.y+'" r="28" fill="#fff" opacity="0.92"/>'+
    dcGlyph(h.x, h.y, h.color)+
    '<text x="'+h.x+'" y="'+(h.y+35)+'" text-anchor="middle" fill="'+INK+'" font-size="12" font-weight="700">'+esc(h.label)+'</text>'+
  '</g>';
}
function builderSVG(){
  return '<svg class="lg-sim" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Distribution-network expansion simulator">'+
    '<g class="lg-rings"></g>'+
    '<g class="lg-routes"></g>'+
    '<g class="lg-dots"></g>'+
    HUBS.map(function(h, i){ return hubMarker(h, i, i > 0); }).join('')+
  '</svg>';
}

function blockSim(){
  var h = '<div class="ov-sec-h ovt-store-h">Why — and when — 3B opens a new distribution center</div>';
  h += '<p class="ov-lede">The whole expansion model rests on one disclosed rule: <b>“when the number of total stores served by any given '+
    'distribution center approaches the 150-store mark, we proceed to open a new distribution center nearby and redistribute the stores '+
    'to optimize distances and routing.”</b> Step through the phases — or press Auto — to watch one region subdivide into a network of DCs.</p>';

  h += '<div class="lg-sim-card">'+
    '<div class="lg-phases">'+ PHASES.map(function(p, i){
      return '<button type="button" class="lg-phase'+(i===2?' active':'')+'" data-n="'+p.at+'" data-i="'+i+'">'+esc(p.label)+'</button>';
    }).join('') + '</div>'+

    '<div class="lg-sim-head">'+
      '<div class="lg-rd"><span class="lg-count">360</span><span class="lg-rd-l"> stores across </span><span class="lg-dccount">3</span><span class="lg-rd-l"> DCs</span></div>'+
    '</div>'+
    '<div class="lg-split" hidden></div>'+
    '<div class="lg-bar"><div class="lg-bar-fill"></div>'+
      '<div class="lg-bar-mark" style="left:31.25%"><span>+DC 2</span></div>'+
      '<div class="lg-bar-mark" style="left:62.5%"><span>+DC 3</span></div>'+
      '<div class="lg-bar-mark" style="left:93.75%"><span>+DC 4</span></div>'+
    '</div>'+

    builderSVG()+

    '<div class="lg-cap"></div>'+

    '<div class="lg-controls">'+
      '<button type="button" class="lg-play" data-act="play">▶ Auto</button>'+
      '<input type="range" class="lg-range" min="0" max="'+MAXN+'" value="360" step="1" aria-label="Total stores in the territory">'+
      '<div class="lg-legend">'+ HUBS.map(function(h){ return '<span><i style="background:'+h.color+'"></i>'+esc(h.label)+'</span>'; }).join('') +'</div>'+
    '</div>'+
  '</div>';

  h += '<div class="ov-foot">Each DC can serve up to 200 stores (typically within 150 km, stretchable to 200 km) and averages 13,050 m². The model is illustrative — each store is assigned to its nearest active DC. Source: FY2025 Form 20-F (Item 4.B/4.D).</div>';
  return h;
}

// ─── 3. Standardized layout ───────────────────────────────────────────────────
var ACCEL = [
  ['Identical planogram', '“The order of the display of products is identical in each store,” so staff always know exactly where every item goes.'],
  ['Original boxes', 'Products are shelved in the original supplier boxes — no unpacking, no building displays.'],
  ['Pallet stocking', 'Goods arrive and are restocked by the pallet — “quickly and easily.”'],
  ['Low shelving', 'Reduced shelf height lets staff see the whole store: faster restocking, less shrinkage.'],
];
function blockLayout(){
  var TOUR = 'https://my.matterport.com/show/?m=GrLPC14ZZjJ';
  var h = '<div class="ov-sec-h ovt-store-h">Step inside a 3B store — 3D virtual tour</div>';
  h += '<p class="ov-lede">This is 3B’s own <b>Matterport 3D walkthrough of a real store</b>, embedded right here. Click to enter, then look '+
    'around and move through the aisles — you can see the standardized layout first-hand: low shelving, products in their original boxes '+
    'on pallets, an identical planogram. The features that make restocking fast are summarized below.</p>';
  h += '<div class="lg3d-tour">'+
    '<iframe class="lg3d-frame" src="'+TOUR+'" title="Tiendas 3B — recorrido virtual de una tienda" '+
      'allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; web-share" allowfullscreen loading="lazy"></iframe>'+
  '</div>';
  h += '<div class="lg3d-tourlink">Virtual tour by Tiendas 3B · <a href="'+TOUR+'" target="_blank" rel="noopener">open full screen ↗</a></div>';
  h += '<div class="lg-accel lg-accel-row">' + ACCEL.map(function(a){
    return '<div class="lg-accel-card"><div class="lg-accel-h">'+esc(a[0])+'</div><div class="lg-accel-b">'+a[1]+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-foot">~850–900 SKUs per store (vs ~3,000 at a convenience store, 10,000+ at a supermarket), incl. 113 private-label brands across 525+ SKUs. Tour: 3B’s official “Recorrido Virtual” (Matterport). Source: FY2025 Form 20-F (Item 4.B).</div>';
  return h;
}

// ─── Body ─────────────────────────────────────────────────────────────────────
function logisticsBody(c){
  var h = '';
  h += '<div class="lg-stats">' + STATS.map(function(s){
    return '<div class="lg-stat"><div class="lg-stat-v">'+esc(s[0])+'</div><div class="lg-stat-l">'+esc(s[1])+'</div></div>';
  }).join('') + '</div>';
  h += blockFlow();
  h += blockSim();
  return h;
}

// ─── Interactions ─────────────────────────────────────────────────────────────
var _lgAnim = null;

function dcUpdate(scope, n){
  n = Math.max(0, Math.min(MAXN, Math.round(n)));
  // Active DCs and per-DC store counts.
  var active = [];
  for (var hi = 0; hi < HUBS.length; hi++){ if (n >= HUBS[hi].at) active.push(hi); }
  var counts = {}, maxR = {}; active.forEach(function(i){ counts[i] = 0; maxR[i] = 0; });
  var routes = '', dots = '';
  for (var i = 0; i < n; i++){
    var p = STORE_POS[i];
    var best = active[0], bd = Infinity;
    for (var a = 0; a < active.length; a++){ var d = dist(p, HUBS[active[a]]); if (d < bd){ bd = d; best = active[a]; } }
    counts[best]++;
    if (bd > maxR[best]) maxR[best] = bd;   // farthest store served by this DC
    var col = HUBS[best].color, hb = HUBS[best];
    routes += '<line x1="'+p.x.toFixed(1)+'" y1="'+p.y.toFixed(1)+'" x2="'+hb.x+'" y2="'+hb.y+'" stroke="'+col+'" stroke-width="0.8" opacity="0.18"/>';
    dots   += '<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3.3" fill="'+col+'" stroke="#fff" stroke-width="0.7"/>';
  }
  // Coverage circle around each active DC, hugging the stores it serves.
  var rings = active.map(function(hi){
    var r = (counts[hi] > 0 ? maxR[hi] + 11 : 26);
    var c = HUBS[hi].color;
    return '<circle cx="'+HUBS[hi].x+'" cy="'+HUBS[hi].y+'" r="'+r.toFixed(1)+'" fill="'+c+'" fill-opacity="0.05" '+
      'stroke="'+c+'" stroke-opacity="0.45" stroke-width="1.4" stroke-dasharray="5 5"/>';
  }).join('');
  scope.querySelector('.lg-rings').innerHTML = rings;
  scope.querySelector('.lg-routes').innerHTML = routes;
  scope.querySelector('.lg-dots').innerHTML = dots;
  for (var j = 0; j < HUBS.length; j++){
    var m = scope.querySelector('.lg-hub-' + j); if (m) m.hidden = (n < HUBS[j].at);
  }
  scope.querySelector('.lg-count').textContent = n;
  scope.querySelector('.lg-dccount').textContent = active.length;
  // Per-DC split breakdown (shown once there's more than one DC).
  var split = scope.querySelector('.lg-split');
  if (active.length > 1){
    split.hidden = false;
    split.innerHTML = active.map(function(hi){
      return '<span class="lg-split-i"><i style="background:'+HUBS[hi].color+'"></i>'+esc(HUBS[hi].label)+' <b>'+counts[hi]+'</b></span>';
    }).join('');
  } else { split.hidden = true; }
  scope.querySelector('.lg-bar-fill').style.width = (n / MAXN * 100) + '%';
  // phase chip + caption (by number of active DCs)
  var pi = active.length - 1;
  scope.querySelectorAll('.lg-phase').forEach(function(b){ b.classList.toggle('active', +b.getAttribute('data-i') === pi); });
  scope.querySelector('.lg-cap').innerHTML = PHASES[pi].cap;
}

function initLogistics(root){
  var scope = root.querySelector('.ovt-pane[data-ovt="logistics"]') ||
              root.querySelector('.ovt-subpane[data-ovst="logistics"]') || root;

  var range = scope.querySelector('.lg-range');
  if (range){
    var playBtn = scope.querySelector('.lg-play');
    function stopAnim(){ if (_lgAnim){ clearInterval(_lgAnim); _lgAnim = null; if (playBtn) playBtn.textContent = '▶ Auto'; } }
    function setN(v){ range.value = v; dcUpdate(scope, v); }
    dcUpdate(scope, +range.value);
    range.oninput = function(){ stopAnim(); dcUpdate(scope, +range.value); };
    scope.querySelectorAll('.lg-phase').forEach(function(btn){
      btn.onclick = function(){ stopAnim(); setN(+btn.getAttribute('data-n')); };
    });
    if (playBtn){
      playBtn.onclick = function(){
        if (_lgAnim){ stopAnim(); return; }
        if (+range.value >= 200) setN(0);
        playBtn.textContent = '❚❚ Pause';
        _lgAnim = setInterval(function(){
          var v = +range.value + 2;
          if (v >= 200) v = 200;
          setN(v);
          if (v >= 200) stopAnim();
        }, 26);
      };
    }
  }
}

export var bbbLogistics = { body: logisticsBody, init: initLogistics, tourBody: blockLayout };
