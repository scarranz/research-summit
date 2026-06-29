// overviews/bbb-landscape.js — TBBB "Competitive Landscape" sub-tab.
//
// The Mexican hard-discount race: Tiendas 3B (TBBB) vs. Neto (Grupo Salinas)
// vs. BARA (FEMSA). Renders:
//   1. An interactive choropleth of Mexico (competitive intensity / per-chain footprint)
//   2. A scale comparison (total store count)
//   3. Profile cards (owner, format, edge) for each chain
//   4. A "Bajío is the battleground" insight + sourced footnote
//
// Data integrity note: exact store-by-state counts are NOT publicly disclosed for
// 3B or Neto, so the map shows *reported states of operation* (company disclosures
// + press, 2024–2025), not precise per-state counts. Totals, ownership and BARA's
// Guanajuato concentration are company/press-reported. See FOOT below.

import { MX_STATES, MX_VIEWBOX } from './mx-map-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Chains ───────────────────────────────────────────────────────────────────
var CHAINS = [
  { key:'tbbb', name:'Tiendas 3B', short:'3B', color:'#E1251B',
    total:3346, totalLabel:'~3,346', states:'~19', parent:'Independent — listed on NYSE (TBBB)',
    since:'2005', format:'Hard discount · ~850–900 SKUs · 300–450 m² stores',
    edge:'Pioneer and leader of hard discount in Mexico. Largest scale and the most aggressive opening pace (~1 store every 15 hours).' },
  { key:'neto', name:'Tiendas Neto', short:'Neto', color:'#1F4DD8',
    total:1700, totalLabel:'~1,700', states:'~21', parent:'Grupo Salinas (Ricardo Salinas Pliego)',
    since:'2009', format:'Hard discount · backed by the Grupo Salinas ecosystem (Elektra, Banco Azteca)',
    edge:'The widest geographic spread of the three. Leverages Grupo Salinas’ network and infrastructure.' },
  { key:'bara', name:'Tiendas BARA', short:'BARA', color:'#F59E0B',
    total:636, totalLabel:'~636', states:'7', parent:'FEMSA (Fomento Económico Mexicano)',
    since:'~2017', format:'Hard discount · backed by FEMSA logistics (OXXO)',
    edge:'The youngest and most concentrated: roughly 50% of its stores are in Guanajuato. Rapid expansion backed by FEMSA.' },
];
var CHAIN_BY = {}; CHAINS.forEach(function(c){ CHAIN_BY[c.key] = c; });

// ─── States of operation (ISO 3166-2:MX → chains present) ───────────────────────
// Verified Jun 2026 from company disclosures, press and store directories.
//   3B   — 16 states with credibly sourced stores (company reports ~19).
//   Neto — 20 states with credibly sourced stores (company reports ~21).
//   BARA —  7 states (exact; the full reported footprint).
// Announced-but-not-yet-open entries are excluded: 3B → Tamaulipas, Oaxaca (2026);
// BARA → Michoacán/Morelia (2026).
var PRESENCE = {
  // Triple overlap — all three compete head-to-head (the Bajío).
  'MX-GUA': ['tbbb','neto','bara'],
  'MX-QUE': ['tbbb','neto','bara'],
  'MX-JAL': ['tbbb','neto','bara'],
  'MX-HID': ['tbbb','neto','bara'],
  'MX-SLP': ['tbbb','neto','bara'],
  'MX-AGU': ['tbbb','neto','bara'],
  // 3B + Neto (central Mexico).
  'MX-CMX': ['tbbb','neto'],
  'MX-MEX': ['tbbb','neto'],
  'MX-MOR': ['tbbb','neto'],
  'MX-PUE': ['tbbb','neto'],
  'MX-TLA': ['tbbb','neto'],
  'MX-MIC': ['tbbb','neto'],
  'MX-VER': ['tbbb','neto'],
  'MX-GRO': ['tbbb','neto'],
  'MX-ZAC': ['tbbb','neto'],
  // 3B only.
  'MX-COA': ['tbbb'], // Torreón / Laguna region
  // Neto only.
  'MX-OAX': ['neto'],
  'MX-CHP': ['neto'],
  'MX-TAB': ['neto'],
  'MX-TAM': ['neto'], // Tampico, Reynosa/Altamira
  'MX-YUC': ['neto'], // entered 2025 (Maxcanú, Ticul, Mérida; 60-store + CEDIS plan)
  // BARA only.
  'MX-NLE': ['bara'], // first store Oct 2025 (Monterrey metro)
};

// States where all three compete head-to-head (intensity = 3).
var TRIPLE = Object.keys(PRESENCE).filter(function(id){ return PRESENCE[id].length === 3; });

var ABSENT = '#EDF1F4';
var INTENSITY = ['#EDF1F4', '#F7C9BE', '#E97A63', '#C81E10']; // 0,1,2,3 chains

var FOOT = 'The map plots <b>states with credibly sourced stores</b> (verified Jun 2026), not exact per-state counts — the store-by-state breakdown for 3B and Neto is not public. Mapped: 3B 16 states, Neto 20, BARA 7. The companies report 3B in ~19 states and Neto in ~21; a few states each claims could not be independently sourced and are left off. Announced-but-not-yet-open entries are excluded (3B → Tamaulipas & Oaxaca, 2026; BARA → Michoacán/Morelia, 2026). Store totals, ownership and BARA’s Guanajuato concentration (~50%) are company/press figures. Sources: BBB Foods (FY2025 Form 20-F, 6-K filings); Grupo Salinas / Tiendas Neto; FEMSA / Tiendas BARA; El Financiero, Expansión, La Silla Rota, SIPSE, Tiendeo, Sucursales24, Indeed. Base geometry: public Mexico states GeoJSON.';

// ─── Map SVG ────────────────────────────────────────────────────────────────────
function mapSVG(){
  var paths = MX_STATES.map(function(s){
    return '<path class="clz-st" data-id="'+esc(s.id)+'" d="'+s.d+'"></path>';
  }).join('');
  return '<svg class="clz-map" viewBox="'+esc(MX_VIEWBOX)+'" preserveAspectRatio="xMidYMid meet" '+
    'role="img" aria-label="Map of Mexico: hard-discount competitive footprint">'+paths+'</svg>';
}

// ─── Hard-discount (direct peers) — the original map + cards ──────────────────────
function hardDiscountBody(){
  var h = '';

  h += '<p class="ov-lede">Mexico’s <b>hard-discount</b> race is led by three chains, each with a very different owner: '+
    '<b style="color:#E1251B">Tiendas 3B</b> (independent, public), '+
    '<b style="color:#1F4DD8">Neto</b> (Grupo Salinas) and '+
    '<b style="color:#F59E0B">BARA</b> (FEMSA). Below: where each one operates and where they compete head-to-head.</p>';

  // 1 — Footprint map.
  h += '<div class="ov-sec-h ovt-store-h">Geographic footprint — where are they?</div>';
  h += '<div class="clz-modes">'+
    '<button type="button" class="clz-mode active" data-mode="intensity">Competitive intensity</button>'+
    '<button type="button" class="clz-mode" data-mode="tbbb">Tiendas 3B</button>'+
    '<button type="button" class="clz-mode" data-mode="neto">Neto</button>'+
    '<button type="button" class="clz-mode" data-mode="bara">BARA</button>'+
  '</div>';
  h += '<div class="clz-mapwrap">'+ mapSVG() +'<div class="clz-tip" hidden></div></div>';
  h += '<div class="clz-legend" id="clzLegend"></div>';
  h += '<div class="ov-foot">'+FOOT+'</div>';

  // 2 — Scale comparison (total stores).
  h += '<div class="ov-sec-h ovt-store-h">Scale — total store count</div>';
  var maxT = Math.max.apply(null, CHAINS.map(function(c){ return c.total; }));
  h += '<div class="clz-bars">' + CHAINS.map(function(c){
    var pct = (c.total / maxT * 100).toFixed(1);
    return '<div class="clz-bar-row">'+
      '<div class="clz-bar-lab"><i style="background:'+c.color+'"></i>'+esc(c.short)+'</div>'+
      '<div class="clz-bar-track"><div class="clz-bar-fill" style="width:'+pct+'%;background:'+c.color+'"></div></div>'+
      '<div class="clz-bar-val">'+esc(c.totalLabel)+'</div>'+
    '</div>';
  }).join('') + '</div>';

  // 3 — Profile cards.
  h += '<div class="ov-sec-h ovt-store-h">Each chain at a glance</div>';
  h += '<div class="clz-cards">' + CHAINS.map(function(c){
    return '<div class="clz-card" style="border-top-color:'+c.color+'">'+
      '<div class="clz-card-h"><span class="clz-dot" style="background:'+c.color+'"></span>'+esc(c.name)+'</div>'+
      '<div class="clz-card-parent">'+esc(c.parent)+'</div>'+
      '<div class="clz-kv"><span>Stores</span><b>'+esc(c.totalLabel)+'</b></div>'+
      '<div class="clz-kv"><span>States</span><b>'+esc(c.states)+'</b></div>'+
      '<div class="clz-kv"><span>Since</span><b>'+esc(c.since)+'</b></div>'+
      '<div class="clz-card-fmt">'+esc(c.format)+'</div>'+
      '<div class="clz-card-edge">'+esc(c.edge)+'</div>'+
    '</div>';
  }).join('') + '</div>';

  // 4 — Insight: the Bajío battleground.
  h += '<div class="milk-takeaway">The <b>Bajío</b> is the epicenter of the fight: all <b>three chains compete head-to-head</b> in '+
    '<b>Guanajuato, Querétaro, Jalisco, Hidalgo, San Luis Potosí and Aguascalientes</b>. '+
    'BARA (FEMSA) is the most concentrated challenger there (~50% of its stores in Guanajuato), while 3B and Neto '+
    'also overlap across central Mexico (Mexico City, State of Mexico, Puebla, Morelos, Tlaxcala, Michoacán, Veracruz).</div>';

  return h;
}

// ─── Comparison tables (other business models) ────────────────────────────────
// Each row: [metric, Tiendas 3B, …competitors]. The 3B column (index 1) is highlighted.
var CLASSIC_ROWS = [
  ['Main banners','Tiendas 3B','Bodega Aurrerá · Walmart · Sam’s · Express','Chedraui · Súper Che · Supercito','La Comer · City Market · Fresko'],
  ['Stores (Mexico)','~3,469','3,316','683','92'],
  ['Revenue (FY2025)','Ps.78B','Ps.1,012B','~Ps.295B','~Ps.48B'],
  ['Avg. store size','~300 m²','1,200–11,000 m²','~6,500 m²','~6,800 m²'],
  ['SKUs','~850–900','tens of thousands','~101,300','broad / gourmet'],
  ['Model','Hard discount · EDLP','Multi-format: discount → club','Hypermarket · hi-lo','Premium supermarket'],
  ['Target shopper','Low-income (C/D) staples','Mass · all segments','Mid-market full basket','Affluent (A/B)'],
];
var OTHER_ROWS = [
  ['Type','Hard-discount grocery','Convenience / proximity','Traditional mom-and-pop'],
  ['Stores (Mexico)','~3,469','~23,200','~1.0–1.1 million'],
  ['Scale','Ps.78B revenue','~Ps.307B (proximity)','~36–55% of FMCG sales'],
  ['Store size','~300 m²','~100 m²','very small · informal'],
  ['Pricing','Lowest price (EDLP)','Premium / impulse','Higher than 3B'],
  ['Shopping mission','Weekly value stock-up','Impulse / immediate','Daily top-up'],
  ['Relation to 3B','—','Different mission; OXXO’s discount answer is its BARA format','3B’s primary share donor — same proximity, lower prices'],
];
var PENETRATION = [['Poland',36.8],['Turkey',24.6],['Germany',24.2],['Mexico',3.0]];

function cmpTable(cols, rows){
  var h = '<div class="clz-cmp-wrap"><table class="clz-cmp"><thead><tr>';
  cols.forEach(function(c, i){ h += '<th'+(i===1?' class="clz-cmp-hi"':'')+'>'+esc(c)+'</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(function(r){
    h += '<tr>';
    r.forEach(function(v, i){
      var cls = i===0 ? 'clz-cmp-k' : (i===1 ? 'clz-cmp-hi' : '');
      h += '<td'+(cls?' class="'+cls+'"':'')+'>'+esc(v)+'</td>';
    });
    h += '</tr>';
  });
  return h + '</tbody></table></div>';
}

// ─── Classic channel (Walmex, Chedraui, La Comer) ─────────────────────────────
function classicBody(){
  var h = '';
  h += '<p class="ov-lede">3B barely overlaps with Mexico’s big organized supermarkets — it competes <i>against</i> them with a different model entirely. '+
    'The classic channel sells huge assortments in large stores to the whole market; 3B sells ~850 staples in ~300 m² stores at the lowest price to low-income households.</p>';
  h += cmpTable(['', 'Tiendas 3B', 'Walmex', 'Chedraui', 'La Comer'], CLASSIC_ROWS);
  h += '<div class="milk-takeaway">3B is roughly <b>13× smaller than Walmex</b> by revenue, yet grows several times faster. It doesn’t fight on assortment or store size — it wins on '+
    '<b>price + proximity</b> for low-income staples. Tellingly, Walmex has publicly named <b>Bodega Aurrerá</b> as its hard-discount answer to 3B.</div>';
  h += '<div class="ov-foot">Stores and revenue from company filings (Walmex 4Q25, Chedraui 4Q25, La Comer FY2025), latest available; Chedraui FY2025 revenue and the SKU/size figures are disclosed (Chedraui ~101,300 SKUs) or directional. Sources: Walmex, Chedraui and La Comer investor relations; Expansión; El Financiero.</div>';
  return h;
}

// ─── Other competitors (OXXO, tienditas) ──────────────────────────────────────
function otherBody(){
  var h = '';
  h += '<p class="ov-lede">3B’s real fight isn’t with OXXO or the supermarkets — it’s with the <b>~1 million “tienditas”</b> it converts, store by store. '+
    'OXXO plays a different mission (convenience and impulse); the fragmented traditional channel is the share donor.</p>';
  h += cmpTable(['', 'Tiendas 3B', 'OXXO', 'Tienditas'], OTHER_ROWS);

  h += '<div class="ov-sec-h ovt-store-h">The runway — hard-discount penetration</div>';
  var penMax = 40;
  h += '<div class="clz-pen">' + PENETRATION.map(function(p){
    var hi = (p[0] === 'Mexico');
    return '<div class="clz-pen-row"><span class="clz-pen-l">'+esc(p[0])+'</span>'+
      '<div class="clz-pen-track"><div class="clz-pen-f'+(hi?' clz-pen-hi':'')+'" style="width:'+(p[1]/penMax*100).toFixed(1)+'%"></div></div>'+
      '<span class="clz-pen-v">'+p[1].toFixed(1)+'%</span></div>';
  }).join('') + '</div>';
  h += '<div class="milk-takeaway">Hard discount is only ~<b>3% of Mexican grocery</b> — a fraction of Germany (24%), Turkey (25%, BİM’s home) or Poland (37%). '+
    'That gap is 3B’s runway: management sees room for <b>≥14,000</b> stores (vs ~3,469 today).</div>';
  h += '<div class="ov-foot">OXXO ~23,200 Mexico stores (FEMSA, YE2024); tiendita estimates ~1.0–1.1M (ANPEC/Nielsen) and ~36–55% of FMCG sales (methodology-dependent). Hard-discount penetration: Mexico ~3.0% (2023) vs Germany/Turkey/Poland (Euromonitor/NielsenIQ via the company’s investor materials). Sources: FEMSA; ANPEC; BBB Foods company-overview deck.</div>';
  return h;
}

// ─── Body — category toggle over the three business models ────────────────────────
function landscapeBody(){
  var h = '';
  h += '<div class="clz-cats">'+
    '<button type="button" class="clz-cat active" data-cat="hd">Hard discount<small>direct peers</small></button>'+
    '<button type="button" class="clz-cat" data-cat="classic">Classic channel<small>Walmex · Chedraui · La Comer</small></button>'+
    '<button type="button" class="clz-cat" data-cat="other">Other<small>OXXO · tienditas</small></button>'+
  '</div>';
  h += '<div class="clz-cat-pane" data-cat="hd">'+hardDiscountBody()+'</div>';
  h += '<div class="clz-cat-pane" data-cat="classic" hidden>'+classicBody()+'</div>';
  h += '<div class="clz-cat-pane" data-cat="other" hidden>'+otherBody()+'</div>';
  return h;
}

// ─── Interactions ──────────────────────────────────────────────────────────────
function fillFor(mode, id){
  var present = PRESENCE[id] || [];
  if (mode === 'intensity') return INTENSITY[present.length];
  return present.indexOf(mode) >= 0 ? CHAIN_BY[mode].color : ABSENT;
}

function legendHTML(mode){
  if (mode === 'intensity'){
    var labs = ['No presence','1 chain','2 chains','3 chains'];
    return labs.map(function(l, i){
      return '<span class="clz-lg"><i style="background:'+INTENSITY[i]+'"></i>'+esc(l)+'</span>';
    }).join('');
  }
  var c = CHAIN_BY[mode];
  return '<span class="clz-lg"><i style="background:'+c.color+'"></i>'+esc(c.name)+' — present</span>'+
         '<span class="clz-lg"><i style="background:'+ABSENT+'"></i>No reported presence</span>';
}

function recolor(root, mode){
  root.querySelectorAll('.clz-st').forEach(function(p){
    p.style.fill = fillFor(mode, p.getAttribute('data-id'));
  });
  var lg = root.querySelector('#clzLegend');
  if (lg) lg.innerHTML = legendHTML(mode);
}

function tipHTML(id, nameById){
  var present = PRESENCE[id] || [];
  var chains = present.length
    ? present.map(function(k){ var c = CHAIN_BY[k]; return '<span class="clz-tip-ch"><i style="background:'+c.color+'"></i>'+esc(c.short)+'</span>'; }).join('')
    : '<span class="clz-tip-none">No reported presence</span>';
  return '<div class="clz-tip-st">'+esc(nameById[id] || id)+'</div><div class="clz-tip-chs">'+chains+'</div>';
}

function initLandscape(root){
  var scope = root.querySelector('.ovt-pane[data-ovt="landscape"]') ||
              root.querySelector('.ovt-subpane[data-ovst="landscape"]') || root;

  // Category toggle (Hard discount / Classic channel / Other competitors).
  scope.querySelectorAll('.clz-cat').forEach(function(btn){
    btn.onclick = function(){
      var k = btn.getAttribute('data-cat');
      scope.querySelectorAll('.clz-cat').forEach(function(b){ b.classList.toggle('active', b === btn); });
      scope.querySelectorAll('.clz-cat-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-cat') !== k); });
    };
  });

  var svg = scope.querySelector('.clz-map');
  if (!svg) return;

  // State id → name (for tooltip).
  var nameById = {}; MX_STATES.forEach(function(s){ nameById[s.id] = s.name; });

  // Default mode.
  var mode = 'intensity';
  recolor(scope, mode);

  // Mode toggle (idempotent via onclick).
  scope.querySelectorAll('.clz-mode').forEach(function(btn){
    btn.onclick = function(){
      mode = btn.getAttribute('data-mode');
      scope.querySelectorAll('.clz-mode').forEach(function(b){ b.classList.toggle('active', b === btn); });
      recolor(scope, mode);
    };
  });

  // Hover tooltip (event-delegated on the SVG).
  var wrap = scope.querySelector('.clz-mapwrap');
  var tip = scope.querySelector('.clz-tip');
  function moveTip(e, st){
    var r = wrap.getBoundingClientRect();
    tip.innerHTML = tipHTML(st.getAttribute('data-id'), nameById);
    tip.hidden = false;
    var x = e.clientX - r.left, y = e.clientY - r.top;
    // Keep the tip inside the wrap.
    tip.style.left = Math.min(x + 14, r.width - tip.offsetWidth - 6) + 'px';
    tip.style.top  = Math.max(y - 10, 4) + 'px';
  }
  svg.onmousemove = function(e){
    var st = e.target.closest ? e.target.closest('.clz-st') : null;
    if (st){ st.classList.add('hot'); moveTip(e, st); }
  };
  svg.onmouseover = function(e){
    var st = e.target.closest ? e.target.closest('.clz-st') : null;
    if (st) st.classList.add('hot');
  };
  svg.onmouseout = function(e){
    var st = e.target.closest ? e.target.closest('.clz-st') : null;
    if (st) st.classList.remove('hot');
  };
  svg.onmouseleave = function(){
    tip.hidden = true;
    scope.querySelectorAll('.clz-st.hot').forEach(function(p){ p.classList.remove('hot'); });
  };
}

export var bbbLandscape = { body: landscapeBody, init: initLandscape };
