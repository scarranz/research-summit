// overviews/bbb-logistics.js — TBBB "Logistics" sub-tab.
//
// Three visual/interactive blocks, grounded verbatim in the FY2025 Form 20-F:
//   A. DC expansion logic — an interactive "region builder": drag stores onto a DC;
//      at the disclosed 150-store trigger a new DC opens nearby and stores redistribute.
//   B. Standardized store layout — why one identical planogram makes restocking fast.
//   C. Restock cycle for a single store — next-day fulfillment timeline + volume-based
//      delivery cadence (2×/week to daily).
//
// All graphics are inline SVG/HTML (no chart library), CSP-safe.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var DC1 = '#E1251B';   // primary DC (3B red)
var DC2 = '#F59E0B';   // second DC (amber)

// ─── Top stat band ────────────────────────────────────────────────────────────
var STATS = [
  ['20',          'distribution centers'],
  ['≤ 200',       'stores per DC'],
  ['150 km',      'typical radius (up to 200)'],
  ['450',         'same-model trucks'],
  ['next-day',    'order fulfillment'],
  ['13,050 m²',   'avg. DC size'],
];

// ─── Block A — interactive region builder ─────────────────────────────────────
var HUB1 = { x:250, y:195 };
var HUB2 = { x:495, y:150 };
var R_RING = 150;          // visual radius (≈150 km)
var STORE_POS = [];        // up to 200 deterministic positions around HUB1 (phyllotaxis)
(function(){
  var n = 200, maxr = 138, ga = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < n; i++){
    var r = maxr * Math.sqrt((i + 0.5) / n);
    var a = i * ga;
    STORE_POS.push({ x: HUB1.x + r * Math.cos(a), y: HUB1.y + r * Math.sin(a) });
  }
})();
function dist(p, h){ var dx = p.x - h.x, dy = p.y - h.y; return Math.sqrt(dx*dx + dy*dy); }

function hubSVG(cls, h, color, label){
  return '<g class="'+cls+'">'+
    '<rect x="'+(h.x-19)+'" y="'+(h.y-14)+'" width="38" height="28" rx="5" fill="'+color+'"/>'+
    '<text x="'+h.x+'" y="'+(h.y+4)+'" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">DC</text>'+
    '<text x="'+h.x+'" y="'+(h.y+30)+'" text-anchor="middle" fill="#3A434F" font-size="11" font-weight="600">'+esc(label)+'</text>'+
  '</g>';
}

function regionBuilderSVG(){
  return '<svg class="lg-svg" viewBox="0 0 700 360" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Distribution-center region builder">'+
    '<circle cx="'+HUB1.x+'" cy="'+HUB1.y+'" r="'+R_RING+'" fill="rgba(225,37,27,0.05)" stroke="rgba(225,37,27,0.35)" stroke-dasharray="4 4"/>'+
    '<text x="'+HUB1.x+'" y="'+(HUB1.y - R_RING + 16)+'" text-anchor="middle" fill="#9AA3AE" font-size="11">≤ 150 km radius</text>'+
    '<g class="lg-ring2" hidden><circle cx="'+HUB2.x+'" cy="'+HUB2.y+'" r="'+R_RING+'" fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.45)" stroke-dasharray="4 4"/></g>'+
    '<g class="lg-stores"></g>'+
    hubSVG('lg-hub1', HUB1, DC1, 'DC 1')+
    '<g class="lg-hub2" hidden>'+hubSVG('_', HUB2, DC2, 'DC 2')+'</g>'+
  '</svg>';
}

function blockA(){
  var h = '';
  h += '<div class="ov-sec-h ovt-store-h">How a new distribution center is decided</div>';
  h += '<p class="ov-lede">3B grows by <b>density</b>: stores cluster around a distribution center within a ~150 km radius. '+
    'Per the 20-F, <b>“when the number of total stores served by any given distribution center approaches the 150-store mark, '+
    'we proceed to open a new distribution center nearby and redistribute the stores to optimize distances and routing.”</b> '+
    'Drag the slider (or press Auto) to fill a region and watch the rule fire.</p>';

  h += '<div class="lg-builder">'+
    '<div class="lg-readout">'+
      '<div class="lg-rd-main"><span class="lg-count">90</span> <span class="lg-rd-lbl">stores served by this DC</span></div>'+
      '<div class="lg-rd-split" hidden>DC 1: <b class="lg-c1">0</b> &nbsp;·&nbsp; DC 2: <b class="lg-c2" style="color:'+DC2+'">0</b></div>'+
    '</div>'+
    '<div class="lg-bar"><div class="lg-bar-fill"></div>'+
      '<div class="lg-bar-mark" style="left:75%"><span>150 · trigger</span></div>'+
      '<div class="lg-bar-mark lg-bar-cap" style="left:100%"><span>200 · capacity</span></div>'+
    '</div>'+
    regionBuilderSVG()+
    '<div class="lg-controls">'+
      '<button type="button" class="lg-play" data-act="play">▶ Auto</button>'+
      '<input type="range" class="lg-range" min="0" max="200" value="90" step="1" aria-label="Stores served">'+
    '</div>'+
    '<div class="lg-trigger" hidden>⚠ <b>150-store trigger reached.</b> A new DC opens nearby and stores are redistributed to the closest DC — keeping every route short and each region under its ~200-store capacity.</div>'+
  '</div>';
  h += '<div class="ov-foot">Each DC can serve up to 200 stores (typically within 150 km, stretchable to 200 km) and averages 13,050 m². 3B runs 20 DCs today and sees white space for <b>at least 11,000 additional</b> stores — which, at ~200 stores per DC, implies a long runway of new regions. Source: FY2025 Form 20-F (Item 4.B/4.D).</div>';
  return h;
}

// ─── Block B — standardized layout ────────────────────────────────────────────
var ACCEL = [
  ['Identical planogram', '“The order of the display of products is identical in each store,” so staff always know exactly where every item goes.'],
  ['Original boxes', 'Products are shelved in the original supplier boxes — no unpacking, no building displays.'],
  ['Pallet stocking', 'Goods arrive and are restocked by the pallet, “quickly and easily.”'],
  ['Low shelving', 'Reduced shelf height lets staff see the whole store — faster restocking and less shrinkage.'],
];

// Simple top-down store floorplan (same for every store).
function floorplanSVG(){
  var aisles = ['Grocery','Beverages','Dairy & cold','Cleaning','Personal care','Snacks'];
  var rows = aisles.map(function(name, i){
    var y = 28 + i*30;
    return '<rect x="60" y="'+y+'" width="300" height="18" rx="3" fill="#EDF1F4" stroke="#D7DDE3"/>'+
      '<text x="64" y="'+(y+13)+'" font-size="10.5" fill="#3A434F" font-weight="600">'+esc(name)+'</text>';
  }).join('');
  return '<svg class="lg-floor" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Standardized store layout">'+
    '<rect x="8" y="8" width="384" height="214" rx="8" fill="#fff" stroke="#C9CFD6"/>'+
    rows +
    '<rect x="60" y="196" width="120" height="20" rx="3" fill="#FCEBE9" stroke="#E1251B"/>'+
    '<text x="120" y="210" text-anchor="middle" font-size="10.5" fill="#E1251B" font-weight="700">Checkout</text>'+
    '<rect x="300" y="190" width="60" height="28" rx="3" fill="#F4F6F8" stroke="#D7DDE3"/>'+
    '<text x="330" y="207" text-anchor="middle" font-size="9.5" fill="#3A434F">Receiving</text>'+
    '<text x="200" y="20" text-anchor="middle" font-size="10" fill="#9AA3AE">~300–450 m² · ~850–900 SKUs · same in every store</text>'+
  '</svg>';
}

function blockB(){
  var h = '';
  h += '<div class="ov-sec-h ovt-store-h">One layout, ~3,469 times — why restocking is so fast</div>';
  h += '<p class="ov-lede">Every Tiendas 3B store “follows a <b>standardized format in terms of layout, size, assortment, and personnel</b>.” '+
    'Because all stores are essentially identical, picking, truck-loading and in-store replenishment are templated and repeatable — the single biggest reason restocking is quick and cheap.</p>';
  h += '<div class="lg-layout">'+
    '<div class="lg-floor-wrap">'+ floorplanSVG() +'</div>'+
    '<div class="lg-accel">' + ACCEL.map(function(a){
      return '<div class="lg-accel-card"><div class="lg-accel-h">'+esc(a[0])+'</div><div class="lg-accel-b">'+esc(a[1])+'</div></div>';
    }).join('') + '</div>'+
  '</div>';
  h += '<div class="ov-foot">~850–900 SKUs per store (vs ~3,000 at a convenience store and 10,000+ at a supermarket), of which 113 private-label brands span 525+ SKUs; regions layer on up to 10 local SKUs. Source: FY2025 Form 20-F (Item 4.B).</div>';
  return h;
}

// ─── Block C — restock cycle for one store ────────────────────────────────────
var CYCLE = [
  ['Store places order', 'A store sends its order based on demand; deliveries run from twice a week to daily.'],
  ['Processed overnight', 'Orders are processed overnight at the region’s DC and ready to pick in the morning.'],
  ['Picked & palletized', 'Picked, checked and palletized — cross-docking is used whenever possible.'],
  ['Loaded & delivered', 'Loaded onto an own-fleet truck and delivered the same day; one truck visits up to 4 stores/day.'],
  ['Shelves restocked', 'Restocked by the pallet, in original boxes, into an identical planogram.'],
];
var VOLUMES = {
  low:  { label:'Low-volume store',  freq:'2× per week',     wk:'2', note:'Disclosed minimum cadence.' },
  mid:  { label:'Typical store',     freq:'3–4× per week',   wk:'3–4', note:'Illustrative midpoint.' },
  high: { label:'High-volume store', freq:'Daily (up to 7×)', wk:'7', note:'Disclosed maximum cadence.' },
};

function blockC(){
  var h = '';
  h += '<div class="ov-sec-h ovt-store-h">Restocking a single store — the cycle</div>';
  h += '<p class="ov-lede">There is no warehouse behind the shelf — the region’s DC <b>is</b> the backroom. An order placed today is '+
    '<b>fulfilled the next day</b>: processed overnight, picked in the morning, and delivered the same day by 3B’s own trucks.</p>';

  h += '<div class="lg-timeline">' + CYCLE.map(function(s, i){
    return '<div class="lg-step">'+
      '<div class="lg-step-n">'+(i+1)+'</div>'+
      '<div class="lg-step-t">'+esc(s[0])+'</div>'+
      '<div class="lg-step-b">'+esc(s[1])+'</div>'+
    '</div>';
  }).join('<div class="lg-step-arrow">→</div>') + '</div>';

  h += '<div class="lg-volwrap">'+
    '<div class="lg-vol-q">Delivery cadence flexes with a store’s sales volume:</div>'+
    '<div class="lg-vol-btns">'+
      '<button type="button" class="lg-vol active" data-vol="low">Low</button>'+
      '<button type="button" class="lg-vol" data-vol="mid">Medium</button>'+
      '<button type="button" class="lg-vol" data-vol="high">High</button>'+
    '</div>'+
    '<div class="lg-vol-out">'+
      '<div class="lg-vol-freq"><span class="lg-vol-f">2× per week</span><span class="lg-vol-l">Low-volume store</span></div>'+
      '<div class="lg-vol-week" aria-hidden="true"></div>'+
      '<div class="lg-vol-note">Disclosed minimum cadence.</div>'+
    '</div>'+
  '</div>';
  h += '<div class="ov-foot">3B fulfills store orders one day after they are placed; restocking frequency “ranges from twice a week to daily and depends on sales volumes.” The fleet is 450 same-model trucks plus 1,303 utility vehicles; 5,638 of 29,202 employees work in warehouses and DCs. The 20-F does not disclose a single “hours-to-restock-a-store” figure — the cycle above is the disclosed order-to-shelf flow. Source: FY2025 Form 20-F (Item 4.D).</div>';
  return h;
}

// ─── Body ─────────────────────────────────────────────────────────────────────
function logisticsBody(c){
  var h = '';
  h += '<div class="lg-stats">' + STATS.map(function(s){
    return '<div class="lg-stat"><div class="lg-stat-v">'+esc(s[0])+'</div><div class="lg-stat-l">'+esc(s[1])+'</div></div>';
  }).join('') + '</div>';
  h += blockA();
  h += blockB();
  h += blockC();
  return h;
}

// ─── Interactions ─────────────────────────────────────────────────────────────
var _lgAnim = null;

function dcUpdate(scope, n){
  n = Math.max(0, Math.min(200, Math.round(n)));
  var dc2 = n >= 150;
  var pts = '', c1 = 0, c2 = 0;
  for (var i = 0; i < n; i++){
    var p = STORE_POS[i];
    var toDc2 = dc2 && (dist(p, HUB2) < dist(p, HUB1));
    if (toDc2) c2++; else c1++;
    pts += '<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3.2" fill="'+(toDc2?DC2:DC1)+'" opacity="0.92"/>';
  }
  scope.querySelector('.lg-stores').innerHTML = pts;
  scope.querySelector('.lg-hub2').hidden = !dc2;
  scope.querySelector('.lg-ring2').hidden = !dc2;
  scope.querySelector('.lg-count').textContent = n;
  scope.querySelector('.lg-trigger').hidden = !dc2;
  var split = scope.querySelector('.lg-rd-split');
  split.hidden = !dc2;
  if (dc2){ scope.querySelector('.lg-c1').textContent = c1; scope.querySelector('.lg-c2').textContent = c2; }
  scope.querySelector('.lg-bar-fill').style.width = (n / 200 * 100) + '%';
  scope.querySelector('.lg-bar-fill').style.background = dc2 ? DC2 : DC1;
}

function volUpdate(scope, key){
  var v = VOLUMES[key]; if (!v) return;
  scope.querySelector('.lg-vol-f').textContent = v.freq;
  scope.querySelector('.lg-vol-l').textContent = v.label;
  scope.querySelector('.lg-vol-note').textContent = v.note;
  var dots = parseInt(v.wk, 10) || 4;
  var wk = '';
  for (var i = 0; i < 7; i++){ wk += '<span class="lg-day'+(i < dots ? ' on' : '')+'"></span>'; }
  scope.querySelector('.lg-vol-week').innerHTML = wk;
}

function initLogistics(root){
  var scope = root.querySelector('.ovt-pane[data-ovt="logistics"]') || root;

  // Block A — region builder.
  var range = scope.querySelector('.lg-range');
  if (range){
    dcUpdate(scope, +range.value);
    range.oninput = function(){ stopAnim(); dcUpdate(scope, +range.value); };
    var playBtn = scope.querySelector('.lg-play');
    function stopAnim(){ if (_lgAnim){ clearInterval(_lgAnim); _lgAnim = null; if (playBtn) playBtn.textContent = '▶ Auto'; } }
    if (playBtn){
      playBtn.onclick = function(){
        if (_lgAnim){ stopAnim(); return; }
        if (+range.value >= 200) range.value = 0;
        playBtn.textContent = '❚❚ Pause';
        _lgAnim = setInterval(function(){
          var v = +range.value + 2;
          if (v >= 200){ v = 200; }
          range.value = v;
          dcUpdate(scope, v);
          if (v >= 200) stopAnim();
        }, 28);
      };
    }
  }

  // Block C — volume toggle.
  volUpdate(scope, 'low');
  scope.querySelectorAll('.lg-vol').forEach(function(btn){
    btn.onclick = function(){
      scope.querySelectorAll('.lg-vol').forEach(function(b){ b.classList.toggle('active', b === btn); });
      volUpdate(scope, btn.getAttribute('data-vol'));
    };
  });
}

export var bbbLogistics = { body: logisticsBody, init: initLogistics };
