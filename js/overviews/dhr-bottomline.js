// dhr-bottomline.js — Danaher, Deep Dive ▸ Bottom Line ▸ General.
//
// STRUCTURE: this follows `js/overviews/amzn.js` — the template ([[earnings-rollout]]). A master
// "Chart" picker swaps one section at a time (`.gen-sec[data-gsec]`, all hidden but the chosen
// one), each section is an `.ov-sec` with the §0.4 control row (`.mch-ctl` + `.acx-tog` pills),
// and the two time-series sections use the same scaffold Amazon's Profitability chart uses:
// title + `rs-msel` metric dropdown · mode pills · Range presets · source legend chips ·
// `ov-chart-card` · two-handle period slider with `rs-ticks` · a collapsible data table.
//
// Amazon's sections are margins / bridge / net / SBC. Danaher's are the same three plus the one
// reconciliation that dominates its P&L (GAAP → adjusted EPS) and the balance sheet, because
// Masimo closed inside the current quarter. SBC is not its own section here: Danaher's SBC is
// $298M on $24.6B of sales, an order of magnitude less interesting than its $1.9B of acquisition
// amortisation — which the EPS section is entirely about.
//
// The engine is module-private in both `results.js` and `amzn.js`, so per
// docs/CHART_ENGINE_REFERENCE.md §0.7 the scaffold is COPIED, not imported:
//   esc                       ← results.js:209
//   rsAttachBrush             ← results.js:1217–1295
//   dStd* (scaffold family)   ← amzn.js:3015–3160 (aStdScaffold/aStdRender/aStdSyncSlider/aStdWire)
//   dBrPlugin / dWaterfall    ← amzn.js:3151–3184 (aBrPlugin/aBuildBrWaterfall)
//   dTbl                      ← amzn.js:3125
// Every `rs-*`, `ave-leg`, `sg-*` and `ov-chart-*` class is global (css/results.css, css/
// overview.css), so the only CSS written here is the `.acx-tog` / `.mch-ctl` control pills, which
// amzn.js also injects inline.
//
// ── The basis trap, the thing most likely to be re-broken ─────────────────────────────────────
// Danaher separated Fortive (2016), Envista (2019) and Veralto (2023). Each separation restated
// only the two prior years, so the as-filed decade sits on THREE different companies:
//   2016         — includes dental (Envista) and Veralto
//   2017–2020    — ex-dental, still includes Veralto
//   2021–2025    — continuing operations as reported today
// A revenue line drawn straight across shows a 2016→2017 "decline" that is entirely the
// restatement. Every annual chart here carries a **Comparable** range preset that snaps to
// FY2021–FY2025, the tooltip names the basis of the year under the cursor, and the data sheet
// carries a Basis row.
//
// Sources: SEC XBRL company concepts (data.sec.gov, CIK 0000313616), newest filing per period so
// restatements are picked up. Q2/1H 2026 and every adjusted figure: Danaher's Q2 2026 press
// release and earnings presentation, 21-Jul-2026. FY25/FY24 total debt, equity and total assets:
// the FY2025 annual-report highlights.

function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Palette — semantic, matching results.js:141–145. Navy is what happened, blue is the adjusted
// read, gray is a reference. Green/red are up/down only.
var D_ACT = 'rgba(30,39,51,0.92)', D_ADJ = 'rgba(37,99,235,0.85)', D_REF = 'rgba(124,134,148,0.85)';
var D_UP = '#2E8B57', D_DOWN = '#C0504D', D_TOTAL = '#1E2733', D_NEUT = '#6B7683';

// ═══ Data ═════════════════════════════════════════════════════════════════════════════════════

// Annual, $M except EPS. As-filed; newest restatement wins. `b` is the reporting basis.
// `epsC` is diluted EPS from CONTINUING operations — the one bottom-line series clean across all
// ten years. Balance-sheet fields are the fiscal-year-end instants from the same filings.
var A = [
  { y:2016, b:'a', rev:16882.4, cogs:7547.8, gp:9334.6, sga:5624.3, rnd: 975.1, op:2735.2, pretax:2611.3, tax:457.9, ni:2553.7, epsC:3.08,
    cfo:3521.8, capex:589.6, dep:545,   amort: 583, sbc:129.8, div:399.8, bb:null, acq: 4880.1,
    cash: 963.7, debtL: 9674.2, debtC:2594.8, equity:23002.8, assets:45295.3, gw:23826.9, intang:11818 },
  { y:2017, b:'b', rev:15518.8, cogs:6947.5, gp:8571.3, sga:5042.6, rnd: 956.4, op:2572.3, pretax:2543.2, tax:371,   ni:2492.1, epsC:3.08,
    cfo:3477.8, capex:570.7, dep:538.1, amort: 579, sbc:127.1, div:378.3, bb:null, acq:  385.8,
    cash: 630.3, debtL:10327.4, debtC: 194.7, equity:26358.2, assets:46648.6, gw:21768.6, intang:11667.1 },
  { y:2018, b:'b', rev:17049,   cogs:7544,   gp:9505,   sga:5391,   rnd:1059,   op:3055,   pretax:2962,   tax:556,   ni:2651,   epsC:3.39,
    cfo:4022,   capex:584,   dep:562,   amort: 616, sbc:138,   div:433,   bb:null, acq: 2173,
    cash: 787.8, debtL: 9688.5, debtC:  51.8, equity:28214.4, assets:47833,   gw:22581,   intang:10282.8 },
  { y:2019, b:'b', rev:17911,   cogs:7927,   gp:9984,   sga:5589,   rnd:1126,   op:3269,   pretax:3305,   tax:873,   ni:3008,   epsC:3.26,
    cfo:3952,   capex:636,   dep:564,   amort: 625, sbc:159,   div:527,   bb:null, acq:  331,
    cash:19912,  debtL:21517,   debtC: 212,   equity:30271,   assets:62082,   gw:22713,   intang: 9750 },
  { y:2020, b:'b', rev:22284,   cogs:9809,   gp:12475,  sga:6896,   rnd:1348,   op:4231,   pretax:4495,   tax:849,   ni:3646,   epsC:4.89,
    cfo:6208,   capex:791,   dep:637,   amort:1138, sbc:187,   div:615,   bb:null, acq:20971,
    cash: 6035,  debtL:21193,   debtC:  11,   equity:39766,   assets:76161,   gw:35420,   intang:21282 },
  { y:2021, b:'c', rev:24802,   cogs:9563,   gp:15239,  sga:6817,   rnd:1498,   op:6377,   pretax:6511,   tax:1064,  ni:6433,   epsC:7.28,
    cfo:8358,   capex:1240,  dep:674,   amort:1388, sbc:184,   div:742,   bb:null, acq:10901,
    cash: 2586,  debtL:22168,   debtC:   8,   equity:45167,   assets:83184,   gw:38682,   intang:22843 },
  { y:2022, b:'c', rev:26643,   cogs:10455,  gp:16188,  sga:7124,   rnd:1528,   op:7536,   pretax:7146,   tax:818,   ni:7209,   epsC:8.47,
    cfo:8519,   capex:1118,  dep:698,   amort:1434, sbc:295,   div:818,   bb:0,    acq:  582,
    cash: 5995,  debtL:19086,   debtC: 591,   equity:50082,   assets:84350,   gw:37276,   intang:19821 },
  { y:2023, b:'c', rev:23890,   cogs:9856,   gp:14034,  sga:7329,   rnd:1503,   op:5202,   pretax:5044,   tax:823,   ni:4764,   epsC:5.65,
    cfo:7164,   capex:1383,  dep:675,   amort:1491, sbc:306,   div:821,   bb:0,    acq: 5610,
    cash: 5864,  debtL:16707,   debtC:1695,   equity:53486,   assets:84488,   gw:41608,   intang:20746 },
  { y:2024, b:'c', rev:23875,   cogs:9669,   gp:14206,  sga:7759,   rnd:1584,   op:4863,   pretax:4646,   tax:747,   ni:3899,   epsC:5.29,
    cfo:6688,   capex:1392,  dep:721,   amort:1631, sbc:288,   div:768,   bb:5979, acq:  558,
    cash: 2078,  debtL:15500,   debtC: 505,   equity:49550,   assets:77542,   gw:40497,   intang:18568 },
  { y:2025, b:'c', rev:24568,   cogs:10045,  gp:14523,  sga:8235,   rnd:1598,   op:4690,   pretax:4233,   tax:633,   ni:3614,   epsC:5.03,
    cfo:6416,   capex:1156,  dep:750,   amort:1697, sbc:298,   div:878,   bb:3088, acq:    0,
    cash: 4615,  debtL:18416,   debtC:   2,   equity:52541,   assets:83464,   gw:43151,   intang:null }
];
var BASES = { a:'incl. dental + Veralto', b:'incl. Veralto', c:'continuing ops' };
var A_CMP_FROM = 5;                       // FY2021 — the first year on today's basis

// Quarterly, $M. 1Q23 onward only: that is as far back as the Veralto restatement reaches, so the
// whole series is on one basis. Q4 is never tagged as its own window — it is the fiscal year less
// the three published quarters, which reconciles exactly against the two Q4s Danaher did tag
// (4Q23 revenue 6,405 and gross profit 3,779 both check out). Net earnings starts at 1Q24: the
// 2023 quarters still carry Veralto as a discontinued operation.
var Q = [
  { p:'1Q23', rev:5949, gp:3662, sga:1772, rnd:373, op:1517, ni:null, d:false },
  { p:'2Q23', rev:5912, gp:3318, sga:1794, rnd:361, op:1163, ni:null, d:false },
  { p:'3Q23', rev:5624, gp:3275, sga:1728, rnd:362, op:1185, ni:null, d:false },
  { p:'4Q23', rev:6405, gp:3779, sga:2035, rnd:407, op:1337, ni:null, d:true  },
  { p:'1Q24', rev:5796, gp:3487, sga:1807, rnd:368, op:1312, ni:1088, d:false },
  { p:'2Q24', rev:5743, gp:3428, sga:1869, rnd:391, op:1168, ni: 907, d:false },
  { p:'3Q24', rev:5798, gp:3401, sga:2060, rnd:383, op: 958, ni: 818, d:false },
  { p:'4Q24', rev:6538, gp:3890, sga:2023, rnd:442, op:1425, ni:1086, d:true  },
  { p:'1Q25', rev:5741, gp:3511, sga:1858, rnd:379, op:1274, ni: 954, d:false },
  { p:'2Q25', rev:5936, gp:3523, sga:2360, rnd:403, op: 760, ni: 555, d:false },
  { p:'3Q25', rev:6053, gp:3523, sga:1991, rnd:378, op:1154, ni: 908, d:false },
  { p:'4Q25', rev:6838, gp:3966, sga:2026, rnd:438, op:1502, ni:1197, d:true  },
  { p:'1Q26', rev:5951, gp:3591, sga:1860, rnd:387, op:1344, ni:1029, d:false },
  { p:'2Q26', rev:6265, gp:3611, sga:2072, rnd:412, op:1127, ni: 870, d:false }
];

// The adjusted (non-GAAP) overlay. Danaher publishes it only where a release covers the period:
// the two second quarters and the two first halves. FY2025's adjusted operating margin comes from
// the CEO letter; there is no adjusted full-year gross profit or EBITDA anywhere, and none is
// invented here.
var QADJ = { '2Q25':{ cogs:2413, sga:1502, rnd:403, op:1618, ni:1292, eps:1.80 },
             '2Q26':{ cogs:2608, sga:1547, rnd:412, op:1698, ni:1375, eps:1.94 } };
var AADJ = { 2024:{ opm:28.4, eps:7.48 }, 2025:{ opm:28.2, eps:7.80 } };

// Half-years, GAAP and adjusted, with the non-operating detail the release prints line by line.
var H = [
  { p:'1H25', rev:11677, cogs:4643, gp:7034, sga:4218, rnd:782, op:2034, other:-121, intExp:143, intInc:14, pretax:1784, tax:275, ni:1509,
    adj:{ cogs:4628, sga:2950, rnd:782, op:3317, ni:2648, eps:3.68 } },
  { p:'1H26', rev:12216, cogs:5014, gp:7202, sga:3932, rnd:799, op:2471, other: -76, intExp:170, intInc:88, pretax:2313, tax:414, ni:1899,
    adj:{ cogs:4968, sga:2956, rnd:799, op:3493, ni:2838, eps:4.00 } }
];
var QDET = {
  '2Q25':{ p:'2Q25', rev:5936, cogs:2413, gp:3523, sga:2360, rnd:403, op:760,  other:-42, intExp:71,  intInc:8,  pretax:655,  tax:100, ni:555 },
  '2Q26':{ p:'2Q26', rev:6265, cogs:2654, gp:3611, sga:2072, rnd:412, op:1127, other:-3,  intExp:107, intInc:61, pretax:1078, tax:208, ni:870 }
};

// The GAAP → adjusted EPS bridge, $/share [press release]. Order is the order the release prints.
var BR_STEPS = [
  { k:'amort',  n:'Amortisation of acquisition intangibles' },
  { k:'fv',     n:'Fair-value net (gains) losses on investments' },
  { k:'masimo', n:'Acquisition-related items (Masimo)' },
  { k:'imp',    n:'Impairments' },
  { k:'disp',   n:'Gain on product-line disposition' },
  { k:'tax',    n:'Tax effect of the above' },
  { k:'disc',   n:'Discrete tax adjustments' },
  { k:'round',  n:'Rounding' }
];
var EPSBR = {
  '2Q26':{ gaap:1.23, amort:0.65, fv:0.01, masimo:0.15, imp:0,    disp:0,     tax:-0.13, disc:0.03, round:0,     adj:1.94 },
  '2Q25':{ gaap:0.77, amort:0.59, fv:0.06, masimo:0,    imp:0.60, disp:0,     tax:-0.26, disc:0.03, round:0.01,  adj:1.80 },
  '1H26':{ gaap:2.68, amort:1.26, fv:0.12, masimo:0.18, imp:0,    disp:0,     tax:-0.27, disc:0.03, round:0,     adj:4.00 },
  '1H25':{ gaap:2.10, amort:1.16, fv:0.19, masimo:0,    imp:0.62, disp:-0.01, tax:-0.39, disc:0.02, round:-0.01, adj:3.68 }
};

// The post-Masimo balance sheet — Q2'26 10-Q, appended to the annual series as its own point.
var BSQ = { p:"Q2'26", cash:4348, debtL:25147, debtC:1411, equity:52581, assets:92367, gw:47414, intang:null };

// ═══ Copied engine — see the header note ══════════════════════════════════════════════════════

var _dCharts = {};
function dDestroy(id){ if (_dCharts[id]){ _dCharts[id].destroy(); _dCharts[id] = null; } }
function dChartReady(id, root){
  var cv = (root || document).querySelector('#' + id);
  return (cv && typeof Chart !== 'undefined' && cv.offsetParent) ? cv : null;
}
// Fade a colour for a forward period. Accepts hex or rgba(), because the palette is rgba().
function dFade(c, a){
  if (c.indexOf('rgba') === 0) return c.replace(/[\d.]+\)$/, a + ')');
  if (c.indexOf('rgb(') === 0) return c.replace('rgb(', 'rgba(').replace(')', ',' + a + ')');
  var h = c.replace('#', '');
  return 'rgba(' + parseInt(h.slice(0,2),16) + ',' + parseInt(h.slice(2,4),16) + ',' + parseInt(h.slice(4,6),16) + ',' + a + ')';
}

// rsAttachBrush — copied verbatim from js/results.js:1217–1295. Drag to zoom; the axis follows the
// direction of the drag; a drag on an axis strip is always a y-drag; double-click resets.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var vertical = (onAxis || !onX) ? true : null;
    var startX = ev.clientX, startY = ev.clientY, box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div'); box.className = 'rs-brush';
      if (vertical){ box.style.left = (r0.left - w0.left + area.left) + 'px'; box.style.width = (area.right - area.left) + 'px'; }
      else { box.style.top = (r0.top - w0.top) + 'px'; box.style.height = r0.height + 'px'; }
      wrap.appendChild(box);
    }
    function decide(cx, cy){
      if (vertical != null) return;
      var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy){
      if (vertical == null) return;
      ensureBox();
      if (vertical){ var a = Math.min(startY, cy), b = Math.max(startY, cy); box.style.top = (a - w0.top) + 'px'; box.style.height = (b - a) + 'px'; }
      else { var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx); box.style.left = (a2 - w0.left) + 'px'; box.style.width = (b2 - a2) + 'px'; }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        var idxAt = function(cx){
          var v = chart.scales.x.getValueForPixel(cx - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        };
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

// dTbl — copied from amzn.js:3125. The collapsible data table under a chart (rule 3).
function dTbl(id, title, headers, rows){
  var head = '<span class="rs-collap-ic">▸</span> ' + esc(title) + '<span class="rs-collap-sub">' + rows.length + ' rows</span>';
  var thead = '<tr>' + headers.map(function(h, i){ return '<th' + (i === 0 ? ' class="rs-ft-h"' : '') + '>' + esc(String(h)) + '</th>'; }).join('') + '</tr>';
  var tb = rows.map(function(r){
    return '<tr>' + r.map(function(c, i){
      return i === 0 ? ('<td class="rs-ft-h">' + esc(String(c)) + '</td>')
                     : ('<td>' + (c == null || c === '' ? '<span class="rs-ft-nil">—</span>' : esc(String(c))) + '</td>');
    }).join('') + '</tr>';
  }).join('');
  return '<div class="rs-collap" data-dtbl="' + esc(id) + '"><button type="button" class="rs-collap-h" data-selfwired data-dtblb="' + esc(id) + '">' + head + '</button>' +
    '<div class="rs-collap-b" id="dTB-' + esc(id) + '" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead>' + thead + '</thead><tbody>' + tb + '</tbody></table></div></div></div>';
}

// dBrPlugin / dWaterfall — copied from amzn.js:3151–3184. Connector lines between steps and a
// value label over every bar, so a waterfall never needs a legend to be read.
var dBrPlugin = { id:'dBrLbl', afterDatasetsDraw:function(chart){
  var steps = chart._steps; if (!steps) return;
  var ctx = chart.ctx, meta = chart.getDatasetMeta(0), y = chart.scales.y, fmt = chart._fmt || {};
  ctx.save();
  ctx.strokeStyle = 'rgba(120,130,145,.55)'; ctx.setLineDash([3,3]); ctx.lineWidth = 1;
  for (var i = 0; i < steps.length - 1; i++){
    if (steps[i].runAfter == null) continue;
    var b0 = meta.data[i], b1 = meta.data[i+1]; if (!b0 || !b1) continue;
    var yy = y.getPixelForValue(steps[i].runAfter);
    ctx.beginPath(); ctx.moveTo(b0.x + b0.width/2, yy); ctx.lineTo(b1.x - b1.width/2, yy); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.textAlign = 'center';
  for (var j = 0; j < steps.length; j++){
    var s = steps[j], bar = meta.data[j]; if (!bar) continue;
    var topPix = y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if (s.kind === 'base' || s.kind === 'total'){ txt = (fmt.base || String)(s.val); ctx.fillStyle = D_TOTAL; ctx.font = '800 11px Inter, system-ui, sans-serif'; }
    else { txt = (fmt.delta || String)(s.val); ctx.fillStyle = s.dc || (s.val >= 0 ? D_UP : D_DOWN); ctx.font = '700 10.5px Inter, system-ui, sans-serif'; }
    ctx.fillText(txt, bar.x, topPix - 6);
  }
  ctx.restore();
} };
function dWaterfall(root, id, steps, fmt, tblTitle){
  var cv = dChartReady(id, root); if (!cv) return;
  dDestroy(id);
  var ch = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels: steps.map(function(s){ return s.label; }),
           datasets:[{ data: steps.map(function(s){ return s.range; }), backgroundColor: steps.map(function(s){ return s.color; }),
                       borderRadius:4, borderSkipped:false, maxBarThickness:56, categoryPercentage:0.74, barPercentage:0.9 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:24 } },
      plugins:{ legend:{ display:false }, tooltip:{ displayColors:false, callbacks:{
        title:function(it){ return it[0].label; },
        label:function(ctx){
          var s = ctx.chart._steps[ctx.dataIndex];
          if (s.kind === 'base' || s.kind === 'total') return (fmt.base || String)(s.val);
          return (fmt.delta || String)(s.val) + (s.runAfter != null ? '   ·   running ' + (fmt.base || String)(s.runAfter) : '');
        } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 }, autoSkip:false, maxRotation:45, minRotation:0,
                   callback:function(v, i){ var l = steps[i] ? steps[i].label : ''; return l.length > 24 ? l.slice(0,23) + '…' : l; } } },
               y:{ position:'right', beginAtZero:true, grid:{ color:'#EEF2F7' },
                   ticks:{ color:'#8A93A0', font:{ size:11 }, callback:function(v){ return (fmt.axis || String)(v); } } } } },
    plugins:[ dBrPlugin ] });
  ch._steps = steps; ch._fmt = fmt; _dCharts[id] = ch; ch.update('none');
  // rule 1 — a waterfall's x-axis is not windowable, so every drag is a y-drag; double-click resets.
  rsAttachBrush(cv, ch, null,
    function(v1, v2){ ch.options.scales.y.min = v1; ch.options.scales.y.max = v2; ch.update('none'); },
    function(){ ch.options.scales.y.min = undefined; ch.options.scales.y.max = undefined; ch.update('none'); });
  var tw = root.querySelector('#' + id + '-tbl');
  if (tw){
    var f = fmt.base || String, fd = fmt.delta || String;
    tw.innerHTML = dTbl(id, tblTitle || 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind === 'base' || s.kind === 'total') ? f(s.val) : fd(s.val), s.runAfter == null ? f(s.val) : f(s.runAfter)];
    }));
  }
}

// dStd* — the SAB-parity scaffold, copied from amzn.js:3015–3160. Row 1 title + metric dropdown;
// row 2 mode pills (left) · Range presets (right); source legend; chart card; period slider with
// tick dots; collapsible table. A chart registers derive(state) → {labels, series, yFmt, …}.
var _dStd = {}, _dStdDerive = {}, _dStdRoot = null;
function dStdScaffold(cfg){
  var id = cfg.id;
  var st = _dStd[id] || (_dStd[id] = { win:null, hidden:{}, sel:null, modes:{} });
  if (cfg.metricSel && st.sel == null){ var on = cfg.metricSel.filter(function(o){ return o.on; })[0] || cfg.metricSel[0]; st.sel = on.v; }
  (cfg.modes || []).forEach(function(g){ if (st.modes[g.cls] == null){ var d = g.opts.filter(function(o){ return o.on; })[0] || g.opts[0]; st.modes[g.cls] = d.v; } });
  var sel = cfg.metricSel ? '<select class="rs-msel" data-dstdsel="' + id + '">' + cfg.metricSel.map(function(o){
        return '<option value="' + esc(o.v) + '"' + (o.v === st.sel ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select>' : '';
  var modes = (cfg.modes || []).map(function(g){
    return '<div class="dstd-modeg" data-dstdmodeg="' + id + '|' + g.cls + '">' + (g.label ? '<span class="rs-quick-l">' + esc(g.label) + '</span>' : '') +
      '<div class="rs-views">' + g.opts.map(function(o){
        return '<button type="button" class="rs-view' + (o.v === st.modes[g.cls] ? ' active' : '') + '" data-dstdmode="' + id + '|' + g.cls + '|' + o.v + '">' + esc(o.label) + '</button>';
      }).join('') + '</div></div>';
  }).join('');
  var presets = cfg.presets || [['all','All']];
  var quick = '<div class="rs-quick"><span class="rs-quick-l">Range</span>' + presets.map(function(p){
    return '<button type="button" class="rs-preset" data-dstdrange="' + id + '|' + p[0] + '">' + esc(p[1]) + '</button>'; }).join('') + '</div>';
  return '<div class="ov-sec" data-dstdblock="' + id + '">' +
    '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.title) + '</div>' + sel + '</div>' +
    '<div class="rs-block-modes"><div class="rs-modes">' + modes + '</div>' + quick + '</div>' +
    '<div class="ave-leg" data-dstdleg="' + id + '"></div>' +
    '<div class="rs-noguide" data-dstdempty="' + id + '" hidden></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:' + (cfg.height || 340) + 'px"><canvas id="dstd-' + id + '"></canvas></div></div>' +
    '<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" data-dstdfill="' + id + '"></div></div>' +
      '<div class="rs-ticks" data-dstdticks="' + id + '"></div>' +
      '<input type="range" class="dstd-r0" min="0" max="1" value="0" step="1" aria-label="Start period">' +
      '<input type="range" class="dstd-r1" min="0" max="1" value="1" step="1" aria-label="End period"></div>' +
      '<div class="sg-ends"><span data-dstdend0="' + id + '"></span><span data-dstdend1="' + id + '"></span></div></div>' +
    '<div data-dstdtbl="' + id + '"></div>' +
    (cfg.note ? '<div class="dbl-note">' + cfg.note + '</div>' : '') +
    '</div>';
}
function dStdBlk(id){ return _dStdRoot ? _dStdRoot.querySelector('[data-dstdblock="' + id + '"]') : null; }
function dStdApplyHideModes(blk, hm){
  blk.querySelectorAll('[data-dstdmodeg]').forEach(function(g){
    var cls = g.getAttribute('data-dstdmodeg').split('|')[1];
    g.style.display = hm.indexOf(cls) >= 0 ? 'none' : 'inline-flex';
  });
}
function dStdRender(id, derive){
  if (derive) _dStdDerive[id] = derive;
  derive = _dStdDerive[id]; if (!derive || !_dStdRoot) return;
  var st = _dStd[id] || (_dStd[id] = { win:null, hidden:{}, sel:null, modes:{} });
  var blk = dStdBlk(id); if (!blk) return;
  var spec = derive(st);
  var emptyBox = blk.querySelector('[data-dstdempty="' + id + '"]');
  var card = blk.querySelector('.ov-chart-card'), sg = blk.querySelector('.sg-controls');
  dStdWire(id);
  // rule 6 — a combination with no data renders an amber badge, not a broken chart.
  if (!spec || spec.empty){
    dDestroy('dstd-' + id);
    if (emptyBox){ emptyBox.hidden = false; emptyBox.innerHTML = esc((spec && spec.empty) || 'No data for this view.'); }
    if (card) card.hidden = true;
    if (sg) sg.hidden = true;
    var tb0 = blk.querySelector('[data-dstdtbl="' + id + '"]'); if (tb0) tb0.innerHTML = '';
    var lg0 = blk.querySelector('[data-dstdleg="' + id + '"]'); if (lg0) lg0.innerHTML = '';
    dStdApplyHideModes(blk, (spec && spec.hideModes) || []);
    return;
  }
  if (emptyBox) emptyBox.hidden = true;
  if (card) card.hidden = false;
  if (sg) sg.hidden = false;
  var cv = dChartReady('dstd-' + id, _dStdRoot); if (!cv) return;
  var n = spec.labels.length;
  if (!st.win || st.win[1] > n - 1 || st.win[0] > st.win[1]) st.win = [0, n - 1];
  var lo = st.win[0], hi = st.win[1], la = spec.lastAct == null ? n - 1 : spec.lastAct;
  var labels = spec.labels.slice(lo, hi + 1);
  var yFmt = spec.yFmt || function(v){ return v; }, y2f = spec.y2Fmt || function(v){ return v; };
  dDestroy('dstd-' + id);
  var needY2 = false;
  var vis = spec.series.filter(function(s){ return !st.hidden[s.k]; });          // rule 2 — the ONE predicate
  var ds = vis.map(function(s){
    var t = s.type || 'bar'; if (s.yAxisID === 'y2') needY2 = true;
    if (t === 'bar') return { type:'bar', label:s.label, data:s.data.slice(lo, hi+1),
      backgroundColor: s.data.slice(lo, hi+1).map(function(_, i){ return (lo + i) > la ? dFade(s.color, 0.5) : s.color; }),
      borderColor:'#fff', borderWidth:1, maxBarThickness:34, yAxisID:s.yAxisID || 'y', order:s.order || 3 };
    return { type:'line', label:s.label, data:s.data.slice(lo, hi+1), borderColor:s.color, backgroundColor:s.color,
      borderWidth:2.2, pointRadius:2, tension:0.2, spanGaps:false, yAxisID:s.yAxisID || 'y', order:s.order || 2,
      borderDash: s.dash ? [5,4] : undefined };
  });
  var anyBar = spec.series.some(function(s){ return (s.type || 'bar') === 'bar'; });
  var scales = { x:{ grid:{ display:false }, ticks:{ font:{ size:11 } } },
    y:{ position:'right', grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:11 }, callback:function(v){ return yFmt(v); } } } };
  if (needY2) scales.y2 = { position:'right', weight:1, grid:{ display:false }, ticks:{ font:{ size:11 }, callback:function(v){ return y2f(v); } } };
  _dCharts['dstd-' + id] = new Chart(cv.getContext('2d'), {
    type: anyBar ? 'bar' : 'line',
    data:{ labels: labels, datasets: ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{
          label:function(c){ var f = c.dataset.yAxisID === 'y2' ? y2f : yFmt; return c.dataset.label + ': ' + (c.parsed.y == null ? '—' : f(c.parsed.y)); },
          afterBody:function(items){ return spec.note ? spec.note(lo + items[0].dataIndex) : ''; } } } },
      scales: scales } });
  dStdApplyHideModes(blk, spec.hideModes || []);
  // Legend — one chip per source group; toggling hides its bar AND its margin line together.
  var leg = blk.querySelector('[data-dstdleg="' + id + '"]');
  if (leg){
    var seen = {}, chips = [];
    spec.series.forEach(function(s){
      var g = s.grp || s.k; if (seen[g]) return; seen[g] = 1;
      chips.push('<button type="button" class="rs-leg' + (st.hidden[s.k] ? ' off' : '') + '" data-dstdleggrp="' + id + '|' + g + '">' +
        '<span class="ave-leg-act" style="background:' + s.color + '"></span>' + esc(s.src || s.label) + '</button>');
    });
    leg.innerHTML = chips.join('') + (spec.legNote ? '<span class="dbl-legnote">' + spec.legNote + '</span>' : '');
  }
  // rule 3 — the table carries everything drawn, windowed and honouring the hidden series.
  var tblc = blk.querySelector('[data-dstdtbl="' + id + '"]');
  if (tblc){
    var rows = vis.map(function(s){
      return [s.label].concat(s.data.slice(lo, hi+1).map(function(v){ return v == null ? null : ((s.yAxisID === 'y2' ? y2f : yFmt)(v)); }));
    });
    if (spec.extraRows) rows = rows.concat(spec.extraRows(lo, hi));
    tblc.innerHTML = dTbl(id, spec.tblTitle || 'Data — what the chart draws', ['Series'].concat(labels), rows);
  }
  dStdSyncSlider(id, spec.labels, la);
  var chh = _dCharts['dstd-' + id];
  if (chh) rsAttachBrush(cv, chh,
    function(i1, i2){ var w = _dStd[id].win; _dStd[id].win = [w[0] + i1, w[0] + i2]; dStdRender(id); },
    function(v1, v2){ chh.options.scales.y.min = v1; chh.options.scales.y.max = v2; chh.update('none'); },
    function(){ _dStd[id].win = null; dStdRender(id); });
}
function dStdSyncSlider(id, labels, la){
  var blk = dStdBlk(id); if (!blk) return;
  var n = labels.length, w = _dStd[id].win;
  var r0 = blk.querySelector('.dstd-r0'), r1 = blk.querySelector('.dstd-r1');
  var fill = blk.querySelector('[data-dstdfill]'), ticks = blk.querySelector('[data-dstdticks]');
  var e0 = blk.querySelector('[data-dstdend0]'), e1 = blk.querySelector('[data-dstdend1]');
  if (r0){ r0.max = n - 1; r0.value = w[0]; }
  if (r1){ r1.max = n - 1; r1.value = w[1]; }
  if (fill){ fill.style.left = (w[0]/(n-1)*100) + '%'; fill.style.width = ((w[1]-w[0])/(n-1)*100) + '%'; }
  if (e0) e0.textContent = labels[w[0]] || '';
  if (e1) e1.textContent = labels[w[1]] || '';
  if (ticks){ var h = ''; for (var i = 0; i < n; i++){ h += '<span class="rs-tick' + (i >= w[0] && i <= w[1] ? ' on' : '') + (i > la ? ' est' : '') + '" style="left:' + (i/(n-1)*100) + '%"></span>'; } ticks.innerHTML = h; }
}
function dStdPresetWin(code, n, cmpFrom){
  switch (code){
    case 'cmp': return [Math.max(0, cmpFrom == null ? 0 : cmpFrom), n - 1];
    case 'l5':  return [Math.max(0, n - 5), n - 1];
    case 'l8':  return [Math.max(0, n - 8), n - 1];
    default:    return [0, n - 1];
  }
}
function dStdWire(id){
  var blk = dStdBlk(id); if (!blk || blk._dstdWired) return;
  blk._dstdWired = true;
  var st = _dStd[id];
  blk.addEventListener('click', function(e){
    var mode = e.target.closest && e.target.closest('[data-dstdmode]');
    if (mode){
      var p = mode.getAttribute('data-dstdmode').split('|');
      st.modes[p[1]] = p[2];
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active', x === mode); });
      st.win = null;                                        // the axis changes with the period — drop the window
      dStdRender(id); return;
    }
    var lgg = e.target.closest && e.target.closest('[data-dstdleggrp]');
    if (lgg){
      var g = lgg.getAttribute('data-dstdleggrp').split('|')[1], spc = _dStdDerive[id] && _dStdDerive[id](st);
      if (spc && spc.series){
        var mem = spc.series.filter(function(s){ return (s.grp || s.k) === g; });
        var off = mem.every(function(s){ return st.hidden[s.k]; });
        mem.forEach(function(s){ st.hidden[s.k] = !off; });
      }
      dStdRender(id); return;
    }
    var rp = e.target.closest && e.target.closest('[data-dstdrange]');
    if (rp){
      var spec = _dStdDerive[id] && _dStdDerive[id](st);
      var n = (spec && spec.labels) ? spec.labels.length : 2;
      st.win = dStdPresetWin(rp.getAttribute('data-dstdrange').split('|')[1], n, spec && spec.cmpFrom);
      dStdRender(id); return;
    }
  });
  var sel = blk.querySelector('[data-dstdsel]');
  if (sel) sel.onchange = function(){ st.sel = sel.value; st.win = null; dStdRender(id); };
  var r0 = blk.querySelector('.dstd-r0'), r1 = blk.querySelector('.dstd-r1');
  function onSlide(){ var a = +r0.value, b = +r1.value; st.win = [Math.min(a,b), Math.max(a,b)]; dStdRender(id); }
  if (r0) r0.oninput = onSlide;
  if (r1) r1.oninput = onSlide;
}

// ═══ Formatters — rule 5, no bare numbers ═════════════════════════════════════════════════════
function fMs(v){ return v == null ? '—' : '$' + Math.round(v).toLocaleString('en-US'); }
function fPct(v){ return (v == null || isNaN(v)) ? '—' : v.toFixed(1) + '%'; }
function fX(v){ return v == null ? '—' : v.toFixed(2) + 'x'; }
function fEps(v){ return v == null ? '—' : (v < 0 ? '−$' : '$') + Math.abs(v).toFixed(2); }
function fEpsD(v){ return v == null ? '—' : (v >= 0 ? '+$' : '−$') + Math.abs(v).toFixed(2); }
var FMT_M   = { axis:function(v){ return '$' + Math.round(v/1000) + 'B'; }, base:fMs,
                delta:function(v){ return (v >= 0 ? '+$' : '−$') + Math.round(Math.abs(v)).toLocaleString('en-US'); } };
var FMT_EPS = { axis:function(v){ return '$' + v.toFixed(2); }, base:fEps, delta:fEpsD };
var FMT_BPS = { axis:function(v){ return v.toFixed(0) + '%'; }, base:function(v){ return v.toFixed(1) + '%'; },
                delta:function(v){ var b = Math.round(v*100); return (b >= 0 ? '+' : '−') + Math.abs(b) + ' bps'; } };

// ═══ Section 1 — Profitability & margins ══════════════════════════════════════════════════════
// Bars are the $ amount, lines are the margin on the right axis. The chips are the two BASES
// Danaher reports on — GAAP and adjusted — and hiding one drops its bar and its line together.
var MARG = {
  gp:     { lab:'Gross profit',      num:function(r){ return r.gp; },            adjQ:function(a, r){ return r.rev - a.cogs; }, adjA:null },
  op:     { lab:'Operating profit',  num:function(r){ return r.op; },            adjQ:function(a){ return a.op; }, adjA:function(r, a){ return r.rev * a.opm/100; } },
  ebitda: { lab:'EBITDA',            num:function(r){ return r.op + r.dep + r.amort; }, annualOnly:true },
  ni:     { lab:'Net earnings',      num:function(r){ return r.ni; },            adjQ:function(a){ return a.ni; }, adjA:null },
  fcf:    { lab:'Free cash flow',    num:function(r){ return r.cfo - r.capex; }, annualOnly:true }
};
function margDerive(st){
  var key = st.sel || 'op', m = MARG[key], gran = st.modes.gran || 'y';
  if (gran === 'q' && m.annualOnly)
    return { empty: m.lab + ' is built annually only — Danaher publishes no quarterly depreciation or capital expenditure, so a quarterly figure would have to be invented. Switch the Period pill back to Annual.' };
  var rows = gran === 'y' ? A : Q;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  var gaapN = rows.map(function(r){ var v = m.num(r); return (v == null || isNaN(v)) ? null : v; });
  var adjN = rows.map(function(r){
    if (gran === 'q'){ var a = QADJ[r.p]; return (a && m.adjQ) ? m.adjQ(a, r) : null; }
    var aa = AADJ[r.y]; return (aa && m.adjA) ? m.adjA(r, aa) : null;
  });
  var hasAdj = adjN.some(function(v){ return v != null; });
  function marg(arr){ return arr.map(function(v, i){ return (v == null || !rows[i].rev) ? null : Math.round(v/rows[i].rev*1000)/10; }); }
  var series = [{ k:'g$', grp:'gaap', src:'GAAP', label:m.lab + ' — GAAP', color:D_ACT, type:'bar', data:gaapN }];
  if (hasAdj) series.push({ k:'a$', grp:'adj', src:'Adjusted', label:m.lab + ' — adjusted', color:D_ADJ, type:'bar', data:adjN });
  series.push({ k:'gM', grp:'gaap', src:'GAAP', label:'Margin — GAAP', color:D_ACT, type:'line', yAxisID:'y2', data:marg(gaapN) });
  if (hasAdj) series.push({ k:'aM', grp:'adj', src:'Adjusted', label:'Margin — adjusted', color:D_ADJ, type:'line', yAxisID:'y2', dash:true, data:marg(adjN) });
  return {
    labels: labels, series: series, yFmt: fMs, y2Fmt: fPct,
    cmpFrom: gran === 'y' ? A_CMP_FROM : 0,
    legNote: 'Bars = $M &nbsp;·&nbsp; lines = margin (right axis)' +
      (hasAdj ? '' : ' &nbsp;·&nbsp; Danaher publishes no adjusted ' + m.lab.toLowerCase() + ' for these periods'),
    tblTitle: m.lab + ' — ' + (gran === 'y' ? 'annual' : 'quarterly') + ', $M and margin',
    note: gran === 'y'
      ? function(i){ return 'Reporting basis: ' + BASES[A[i].b]; }
      : function(i){ return Q[i].d ? 'Fourth quarter — derived as the fiscal year less the three published quarters' : ''; },
    extraRows: gran === 'y'
      ? function(lo, hi){ return [['Reporting basis'].concat(A.slice(lo, hi+1).map(function(r){ return BASES[r.b]; }))]; }
      : function(lo, hi){ return [['Source'].concat(Q.slice(lo, hi+1).map(function(r){ return r.d ? 'derived (FY − 9M)' : 'as filed'; }))]; }
  };
}

// ═══ Section 2 — the bridge, revenue → operating profit ═══════════════════════════════════════
var brSt = { mode:'buildup', gran:'y', per:2025, perQ:'1H26', from:2022, to:2025, basis:'gaap' };
var BR_LINES = [{ k:'cogs', lab:'Cost of sales', c:'#8DA2B8' }, { k:'sga', lab:'SG&A', c:'#6B7683' }, { k:'rnd', lab:'R&D', c:'#A9B4C0' }];
function brRow(gran, per){
  if (gran === 'y'){
    var r = A.filter(function(x){ return x.y === per; })[0];
    return r ? { lab:'FY' + String(r.y).slice(2), rev:r.rev, cogs:r.cogs, sga:r.sga, rnd:r.rnd, op:r.op, adj:null, basis:r.b } : null;
  }
  var h = H.filter(function(x){ return x.p === per; })[0];
  if (h) return { lab:h.p, rev:h.rev, cogs:h.cogs, sga:h.sga, rnd:h.rnd, op:h.op, adj:h.adj };
  var q = Q.filter(function(x){ return x.p === per; })[0];
  if (!q) return null;
  return { lab:q.p, rev:q.rev, cogs:q.rev - q.gp, sga:q.sga, rnd:q.rnd, op:q.op, adj:QADJ[q.p] || null };
}
function brBuildupSteps(r, useAdj){
  var src = (useAdj && r.adj) ? r.adj : r;
  var run = r.rev;
  var steps = [{ label:'Revenue', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:r.rev }];
  BR_LINES.forEach(function(l){
    var c = src[l.k] || 0, hi = run; run = hi - c;
    steps.push({ label:l.lab, kind:'down', color:l.c, dc:D_NEUT, range:[Math.min(run,hi), Math.max(run,hi)], runAfter:run, val:-c });
  });
  steps.push({ label:'Operating profit', kind:'total', color:D_UP, range:[0, run], runAfter:null, val:run });
  return steps;
}
// Operating-margin change between two years, decomposed by expense line (percentage points → bps).
function brBpsSteps(p0, p1){
  var m0 = p0.op/p0.rev*100, run = m0;
  var steps = [{ label:p0.lab, kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:m0 }];
  BR_LINES.forEach(function(l){
    var contrib = (p0[l.k]/p0.rev - p1[l.k]/p1.rev) * 100, lo = run; run = lo + contrib;
    steps.push({ label:l.lab, kind:contrib >= 0 ? 'up' : 'down', color:contrib >= 0 ? D_UP : D_DOWN,
                 range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:contrib });
  });
  steps.push({ label:p1.lab, kind:'total', color:D_TOTAL, range:[0, run], runAfter:null, val:run });
  return steps;
}
function brBody(){
  var yBtns = function(attr, sel){ return A.map(function(r){
    return '<button type="button" data-' + attr + '="' + r.y + '"' + (r.y === sel ? ' class="active"' : '') + '>FY' + String(r.y).slice(2) + '</button>'; }).join(''); };
  var pBtns = ['1H26','1H25','2Q26','2Q25','1Q26','4Q25','3Q25'].map(function(p){
    return '<button type="button" data-brp="' + p + '"' + (p === brSt.perQ ? ' class="active"' : '') + '>' + p + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating profit</div>' +
    '<div class="mch-ctl">' +
      '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($M)</button>' +
        '<button type="button" data-brm="bps">Margin change (bps)</button></span><span></span></div>' +
    '<div class="mch-ctl br-ctl-bu" style="margin:0 0 8px"><span></span>' +
      '<span style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        '<span class="acx-tog br-basis"><button type="button" data-brb="gaap" class="active">GAAP</button><button type="button" data-brb="adj">Adjusted</button></span>' +
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Interim</button></span>' +
        '<span class="acx-tog br-yr">' + yBtns('bry', brSt.per) + '</span>' +
        '<span class="acx-tog br-per" style="display:none">' + pBtns + '</span></span></div>' +
    '<div class="mch-ctl br-ctl-bps" style="display:none;margin:0 0 8px"><span></span>' +
      '<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        '<span class="dbl-lbl">From</span><span class="acx-tog br-from">' + yBtns('brf', brSt.from) + '</span>' +
        '<span class="dbl-lbl">to</span><span class="acx-tog br-to">' + yBtns('brt', brSt.to) + '</span></span></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrBr"></canvas></div></div>' +
    '<div id="dhrBr-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrBrCap"></div></div>';
}
function brBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="bridge"]'); if (!pane) return;
  var cap = pane.querySelector('#dhrBrCap');
  if (brSt.mode === 'bps'){
    var p0 = brRow('y', brSt.from), p1 = brRow('y', brSt.to);
    if (!p0 || !p1) return;
    dWaterfall(root, 'dhrBr', brBpsSteps(p0, p1), FMT_BPS, 'The margin walk — every expense line');
    if (cap) cap.innerHTML = 'Operating margin went from <b>' + fPct(p0.op/p0.rev*100) + '</b> in ' + esc(p0.lab) +
      ' to <b>' + fPct(p1.op/p1.rev*100) + '</b> in ' + esc(p1.lab) + '. A bar down means that line <b>took</b> margin; ' +
      'up means it gave margin back. Each line is read as a share of sales, so a cost can compress the margin while its ' +
      'absolute dollars fall.' +
      (p0.basis !== p1.basis
        ? ' <b>These two years are on different reporting bases</b> (' + esc(BASES[p0.basis]) + ' vs ' + esc(BASES[p1.basis]) +
          '). The walk still adds up, but part of the move is the separation, not the business.'
        : '');
    return;
  }
  var r = brRow(brSt.gran, brSt.gran === 'y' ? brSt.per : brSt.perQ);
  if (!r) return;
  var wantAdj = brSt.basis === 'adj', useAdj = wantAdj && !!r.adj;
  dWaterfall(root, 'dhrBr', brBuildupSteps(r, useAdj), FMT_M, 'The build-up — every line');
  if (cap) cap.innerHTML = esc(r.lab) + ' — ' + (useAdj ? 'adjusted' : 'GAAP') + ' operating margin <b>' +
    fPct(((useAdj ? r.adj.op : r.op)/r.rev)*100) + '</b> on <b>' + fMs(r.rev) + 'M</b> of sales. ' +
    (wantAdj && !r.adj ? '<b>Danaher publishes no adjusted P&amp;L for this period</b>, so the GAAP build-up is drawn. ' +
       'Adjusted lines exist only for the periods a press release reconciles — the second quarters and the first halves. ' : '') +
    'Three lines is the whole income statement: Danaher reports no other operating expense.';
}

// ═══ Section 3 — operating profit → net earnings ══════════════════════════════════════════════
var nbSt = { per:'FY25' };
function nbRow(key){
  if (key.indexOf('FY') === 0){
    var y = 2000 + (+key.slice(2)), r = A.filter(function(x){ return x.y === y; })[0];
    if (!r) return null;
    // The annual filings do not split non-operating into interest and other, so the full-year walk
    // carries one reconciling step: pretax less operating profit. It ties to reported pretax exactly.
    return { lab:key, y:y, op:r.op, nonop:r.pretax - r.op, pretax:r.pretax, tax:r.tax, ni:r.ni, rev:r.rev, split:false, basis:r.b };
  }
  var h = H.filter(function(x){ return x.p === key; })[0] || QDET[key];
  if (!h) return null;
  return { lab:h.p, op:h.op, other:h.other, intExp:h.intExp, intInc:h.intInc, pretax:h.pretax, tax:h.tax, ni:h.ni, rev:h.rev, split:true };
}
function nbSteps(r){
  var run = r.op;
  var steps = [{ label:'Operating profit', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:r.op }];
  function step(lab, d){ var lo = run; run = lo + d;
    steps.push({ label:lab, kind:d >= 0 ? 'up' : 'down', color:D_NEUT, dc:D_NEUT, range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:d }); }
  if (r.split){ step('Other income (expense)', r.other); step('Interest expense', -r.intExp); step('Interest income', r.intInc); }
  else { step('Non-operating, net', r.nonop); }
  step('Income taxes', -r.tax);
  var plug = r.ni - run;
  if (Math.abs(plug) >= 5) step('Discontinued ops, NCI & other', plug);
  steps.push({ label:'Net earnings', kind:'total', color:D_UP, range:[0, r.ni], runAfter:null, val:r.ni });
  return steps;
}
function nbBody(){
  var keys = A.map(function(r){ return 'FY' + String(r.y).slice(2); }).concat(['1H26','1H25','2Q26','2Q25']);
  var btns = keys.map(function(k){ return '<button type="button" data-nbp="' + k + '"' + (k === nbSt.per ? ' class="active"' : '') + '>' + k + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating profit → net earnings</div>' +
    '<div class="mch-ctl"><span></span><span class="acx-tog nb-per" style="flex-wrap:wrap">' + btns + '</span></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrNb"></canvas></div></div>' +
    '<div id="dhrNb-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrNbCap"></div></div>';
}
function nbBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="net"]'); if (!pane) return;
  var r = nbRow(nbSt.per); if (!r) return;
  dWaterfall(root, 'dhrNb', nbSteps(r), FMT_M, 'The walk — every step');
  var cap = pane.querySelector('#dhrNbCap');
  var mixed = !r.split && r.y >= 2021 && r.y <= 2023;
  if (cap) cap.innerHTML = esc(r.lab) + ' — operating margin <b>' + fPct(r.op/r.rev*100) + '</b>, net margin <b>' +
    fPct(r.ni/r.rev*100) + '</b>, effective tax rate <b>' + fPct(r.tax/r.pretax*100) + '</b>. ' +
    (r.split
      ? 'The release splits non-operating into other income, interest expense and interest income. Interest income has ' +
        'gone from immaterial to a real line as the post-Cytiva cash balance rebuilt.'
      : 'The annual filings do not split non-operating income, so this is one reconciling step — it ties to reported ' +
        'pretax earnings exactly. Pick an interim period to see it split into other income, interest expense and interest income.') +
    (mixed ? ' <b>Careful with this year:</b> revenue and operating profit are restated to continuing operations, but ' +
             'net earnings still carry Veralto as a discontinued operation — that is the reconciling step near the end. ' +
             'The walk adds up; the net margin does not compare like with like.' : '');
}

// ═══ Section 4 — GAAP → adjusted EPS ══════════════════════════════════════════════════════════
var epsSt = { per:'2Q26', hidden:{} };
function epsLive(){ var d = EPSBR[epsSt.per]; return BR_STEPS.filter(function(s){ return d[s.k] !== 0; }); }
function epsShown(){ return epsLive().filter(function(s){ return !epsSt.hidden[s.k]; }); }   // rule 2 — the ONE predicate
function epsSteps(){
  var d = EPSBR[epsSt.per], run = d.gaap;
  var steps = [{ label:'Diluted EPS (GAAP)', kind:'base', color:D_ACT, range:[0, run], runAfter:run, val:d.gaap }];
  epsShown().forEach(function(s){
    var lo = run; run = lo + d[s.k];
    steps.push({ label:s.n, kind:d[s.k] >= 0 ? 'up' : 'down', color:d[s.k] >= 0 ? D_ADJ : D_DOWN, dc:D_NEUT,
                 range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:d[s.k] });
  });
  var full = epsShown().length === epsLive().length;
  steps.push({ label: full ? 'Adjusted diluted EPS' : 'Subtotal of what is shown', kind:'total', color:D_ADJ,
               range:[0, full ? d.adj : run], runAfter:null, val: full ? d.adj : run });
  return steps;
}
function epsBody(){
  var btns = ['2Q26','2Q25','1H26','1H25'].map(function(p){
    return '<button type="button" data-epsp="' + p + '"' + (p === epsSt.per ? ' class="active"' : '') + '>' + p + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">GAAP → adjusted EPS — what the adjustment actually is</div>' +
    '<div class="mch-ctl"><span></span><span class="acx-tog eps-per">' + btns + '</span></div>' +
    '<div class="ave-leg" id="dhrEpsLeg"></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrEps"></canvas></div></div>' +
    '<div id="dhrEps-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrEpsCap"></div></div>';
}
function epsBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="eps"]'); if (!pane) return;
  var d = EPSBR[epsSt.per];
  var leg = pane.querySelector('#dhrEpsLeg');
  if (leg) leg.innerHTML = epsLive().map(function(s){
    return '<button type="button" class="rs-leg' + (epsSt.hidden[s.k] ? ' off' : '') + '" data-epsleg="' + esc(s.k) + '">' +
      '<span class="ave-leg-act" style="background:' + (d[s.k] >= 0 ? D_ADJ : D_DOWN) + '"></span>' + esc(s.n) + ' ' + fEpsD(d[s.k]) + '</button>';
  }).join('') + '<span class="dbl-legnote">Hide an adjustment and the foot becomes a subtotal, not the published figure</span>';
  dWaterfall(root, 'dhrEps', epsSteps(), FMT_EPS, 'The reconciliation — every line the release prints');
  var pr = QDET[epsSt.per] || H.filter(function(x){ return x.p === epsSt.per; })[0];
  var adjOp = pr ? (pr.adj ? pr.adj.op : (QADJ[epsSt.per] ? QADJ[epsSt.per].op : null)) : null;
  var cap = pane.querySelector('#dhrEpsCap');
  if (cap) cap.innerHTML = (pr && adjOp != null
      ? 'In ' + esc(epsSt.per) + ' the adjusted operating margin was <b>' + fPct(adjOp/pr.rev*100) +
        '</b> against a GAAP <b>' + fPct(pr.op/pr.rev*100) + '</b>. ' : '') +
    'The gap is <b>' + fEps(d.adj - d.gaap) + '</b> a share, of which <b>' + fEps(d.amort) + '</b> is amortisation of ' +
    'acquisition intangibles. That is not a one-off: Danaher guides it to roughly <b>$1,900M for FY2026</b>, and it has ' +
    'risen every year since 2019 — $625M in FY2019, $1,697M in FY2025. It is the accounting cost of a strategy built on ' +
    'buying companies, so a reader who takes the adjusted number is accepting that the price paid for those businesses ' +
    'never runs through the P&amp;L.';
}

// ═══ Section 5 — the balance sheet & leverage ═════════════════════════════════════════════════
// EBITDA here is GAAP operating profit plus depreciation and amortisation — stated, not Danaher's
// adjusted EBITDA, which it does not publish for a full year. Q2'26 has no trailing EBITDA that
// includes Masimo, so its leverage is measured against FY2025 and flagged as a ceiling.
var BS_MET = {
  net:    { lab:'Net debt',             f:function(r){ return r.debtL + r.debtC - r.cash; } },
  debt:   { lab:'Total debt',           f:function(r){ return r.debtL + r.debtC; } },
  cash:   { lab:'Cash and equivalents', f:function(r){ return r.cash; } },
  equity: { lab:"Stockholders' equity", f:function(r){ return r.equity; } },
  gw:     { lab:'Goodwill',             f:function(r){ return r.gw; } },
  assets: { lab:'Total assets',         f:function(r){ return r.assets; } }
};
function bsRows(){
  return A.map(function(r){ return { p:'FY' + String(r.y).slice(2), r:r, ebitda:r.op + r.dep + r.amort, pf:false }; })
          .concat([{ p:BSQ.p, r:BSQ, ebitda:null, pf:true }]);
}
function bsDerive(st){
  var m = BS_MET[st.sel || 'net'], rows = bsRows();
  var fy25 = A[A.length - 1], fy25Ebitda = fy25.op + fy25.dep + fy25.amort;
  var amounts = rows.map(function(x){ var v = m.f(x.r); return (v == null || isNaN(v)) ? null : v; });
  var lev = rows.map(function(x){
    var nd = x.r.debtL + x.r.debtC - x.r.cash, eb = x.ebitda == null ? fy25Ebitda : x.ebitda;
    return (nd == null || !eb) ? null : Math.round(nd/eb*100)/100;
  });
  return {
    labels: rows.map(function(x){ return x.p; }),
    series:[{ k:'amt', grp:'amt', src:m.lab, label:m.lab, color:D_ACT, type:'bar', data:amounts },
            { k:'lev', grp:'lev', src:'Net debt / EBITDA', label:'Net debt / EBITDA', color:D_REF, type:'line', yAxisID:'y2', data:lev }],
    yFmt:fMs, y2Fmt:fX, cmpFrom:A_CMP_FROM,
    legNote:'Bars = $M &nbsp;·&nbsp; line = leverage (right axis) &nbsp;·&nbsp; the last point is the post-Masimo quarter, not a year-end',
    tblTitle:m.lab + ' — fiscal year-ends plus the post-Masimo quarter',
    note:function(i){ return rows[i].pf ? 'Post-Masimo. Leverage measured against FY2025 EBITDA — the ceiling, not a run-rate.' : ''; },
    extraRows:function(lo, hi){
      return [['EBITDA (op. profit + D&A)'].concat(rows.slice(lo, hi+1).map(function(x){ return x.ebitda == null ? 'n/a — see note' : fMs(x.ebitda); }))];
    }
  };
}

// ═══ The data sheet — the trailing collapsible (Amazon's aCollap slot) ════════════════════════
var SHEET = [
  ['Revenue',                     function(r){ return fMs(r.rev); }],
  ['Gross profit',                function(r){ return fMs(r.gp); }],
  ['Gross margin',                function(r){ return fPct(r.gp/r.rev*100); }],
  ['SG&A',                        function(r){ return fMs(r.sga); }],
  ['R&D',                         function(r){ return fMs(r.rnd); }],
  ['Operating profit',            function(r){ return fMs(r.op); }],
  ['Operating margin',            function(r){ return fPct(r.op/r.rev*100); }],
  ['Income taxes',                function(r){ return fMs(r.tax); }],
  ['Diluted EPS, continuing ops', function(r){ return fEps(r.epsC); }],
  ['Operating cash flow',         function(r){ return fMs(r.cfo); }],
  ['Capital expenditure',         function(r){ return fMs(r.capex); }],
  ['Free cash flow',              function(r){ return fMs(r.cfo - r.capex); }],
  ['Depreciation',                function(r){ return fMs(r.dep); }],
  ['Amortisation of intangibles', function(r){ return fMs(r.amort); }],
  ['Stock-based compensation',    function(r){ return fMs(r.sbc); }],
  ['Dividends paid',              function(r){ return fMs(r.div); }],
  ['Share repurchases',           function(r){ return r.bb == null ? null : fMs(r.bb); }],
  ['Acquisitions, net of cash',   function(r){ return fMs(r.acq); }],
  ['Cash and equivalents',        function(r){ return fMs(r.cash); }],
  ['Total debt',                  function(r){ return fMs(r.debtL + r.debtC); }],
  ['Net debt',                    function(r){ return fMs(r.debtL + r.debtC - r.cash); }],
  ["Stockholders' equity",        function(r){ return fMs(r.equity); }],
  ['Total assets',                function(r){ return fMs(r.assets); }],
  ['Goodwill',                    function(r){ return fMs(r.gw); }],
  ['Intangibles, net',            function(r){ return r.intang == null ? null : fMs(r.intang); }],
  ['Reporting basis',             function(r){ return BASES[r.b]; }]
];
function sheetHtml(){
  return dTbl('dhrSheet', 'The data sheet — every annual line, as filed ($M)',
    ['Line'].concat(A.map(function(r){ return 'FY' + String(r.y).slice(2); })),
    SHEET.map(function(s){ return [s[0]].concat(A.map(function(r){ return s[1](r); })); }));
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
var SECTIONS = [
  ['margins', 'Profitability & margins'],
  ['bridge',  'The bridge — revenue → operating profit'],
  ['net',     'Operating profit → net earnings'],
  ['eps',     'GAAP → adjusted EPS'],
  ['bs',      'Balance sheet & leverage']
];
function picker(){
  return '<div class="ov-sec" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
    '<span class="dbl-pick-l">Chart</span><select class="gen-chart">' +
    SECTIONS.map(function(o){ return '<option value="' + esc(o[0]) + '"' + (o[0] === 'margins' ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') +
    '</select><span class="dbl-pick-h">Pick one — the rest stay tucked away.</span></div></div>';
}

var BL_CSS = '<style>' +
  '.dhr-bl{max-width:1000px}' +
  '.acx-tog{display:inline-flex;border:1px solid var(--bdr);border-radius:8px;overflow:hidden;flex-wrap:wrap}' +
  '.acx-tog button{appearance:none;border:0;border-right:1px solid var(--bdr);background:#fff;font:600 12px Inter,sans-serif;color:var(--mu);padding:7px 14px;cursor:pointer}' +
  '.acx-tog button:last-child{border-right:0}.acx-tog button:hover{color:var(--navy)}.acx-tog button.active{background:var(--navy);color:#fff}' +
  '.mch-ctl{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:8px 0 4px}' +
  '.dstd-modeg{display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0}' +
  '.gen-chart{font-size:13px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;background:#fff}' +
  '.dbl-pick-l{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}' +
  '.dbl-pick-h,.dbl-lbl{font-size:11px;color:var(--mu)}' +
  '.dbl-legnote{font-size:11px;color:var(--mu);font-weight:600;margin-left:2px}' +
  '.dbl-note{font-size:11.5px;line-height:1.6;color:var(--mu);margin:12px 0 0;max-width:88ch}' +
  '.dbl-lede{font-size:14px;line-height:1.62;color:var(--tx);margin:2px 0 6px;max-width:80ch}' +
  '@media(max-width:640px){.acx-tog button{padding:6px 10px;font-size:11px}}' +
  '</style>';

export function dhrBottomLineHtml(){
  if (!A.length) return '';                                   // rule 6 — nothing, never broken
  return BL_CSS + '<div class="dhr-bl">' +
    '<p class="dbl-lede">Danaher earns a 59% gross margin and turns more than all of its net income into cash — ' +
      'FY2025 was the 34th consecutive year of free cash flow exceeding net earnings. Two things sit against that: ' +
      'the operating margin has fallen in every year since 2022, and the gap between GAAP and adjusted earnings is a ' +
      'recurring ~$1.9B of acquisition amortisation rather than a one-off.</p>' +
    picker() +
    '<div class="gen-sec" data-gsec="margins">' + dStdScaffold({
      id:'dmarg', title:'Profitability & margins', height:360,
      metricSel:[{ v:'gp', label:'Gross profit' }, { v:'op', label:'Operating profit', on:true },
                 { v:'ebitda', label:'EBITDA (op. profit + D&A)' }, { v:'ni', label:'Net earnings' },
                 { v:'fcf', label:'Free cash flow' }],
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['cmp','Comparable'],['l5','Last 5'],['l8','Last 8']],
      note:'Every figure is as-filed, from Danaher\'s own filings through SEC XBRL, newest filing per period so ' +
        'restatements are picked up. <b>Comparable</b> snaps the annual window to FY2021–FY2025, the years on today\'s ' +
        'reporting basis; before that the series carries Veralto, and before FY2017 the dental business too — the ' +
        'tooltip names the basis of whichever year is under the cursor. The quarterly view starts at 1Q23 for the same ' +
        'reason, and its fourth quarters are the fiscal year less the three published quarters, which is how Danaher ' +
        'leaves them: it never tags Q4 on its own.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="bridge" hidden>' + brBody() + '</div>' +
    '<div class="gen-sec" data-gsec="net" hidden>' + nbBody() + '</div>' +
    '<div class="gen-sec" data-gsec="eps" hidden>' + epsBody() + '</div>' +
    '<div class="gen-sec" data-gsec="bs" hidden>' + dStdScaffold({
      id:'dbs', title:'Balance sheet & leverage', height:360,
      metricSel:[{ v:'net', label:'Net debt', on:true }, { v:'debt', label:'Total debt' },
                 { v:'cash', label:'Cash and equivalents' }, { v:'equity', label:"Stockholders' equity" },
                 { v:'gw', label:'Goodwill' }, { v:'assets', label:'Total assets' }],
      modes:[], presets:[['all','All'],['cmp','Comparable'],['l5','Last 5']],
      note:'Masimo closed inside the second quarter of 2026, so the last point is not a year-end — it is the first ' +
        'balance sheet that carries the acquisition. Gross debt went from $18,418M to $26,558M and net debt from ' +
        '$13,803M to $22,210M in a single quarter; goodwill rose $4,263M. Leverage at that point is post-Masimo net ' +
        'debt against <b>FY2025</b> EBITDA — Masimo adds to the debt but to none of the earnings in the denominator, ' +
        'and no trailing figure including it exists yet, so read it as the ceiling. The FY2019 cash spike is the ' +
        'Cytiva pre-funding: Danaher raised the money months before the deal closed in March 2020.'
    }) + '</div>' +
    sheetHtml() +
    '</div>';
}

export function dhrBottomLineInit(root){
  if (!root || typeof Chart === 'undefined') return;
  _dStdRoot = root;

  // Each section builds the first time it is shown — Chart.js measures a canvas whose
  // offsetParent is null as zero and never recovers.
  function showSection(v){
    root.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden = (s.getAttribute('data-gsec') !== v); });
    if (v === 'margins') dStdRender('dmarg', margDerive);
    if (v === 'bridge')  brBuild(root);
    if (v === 'net')     nbBuild(root);
    if (v === 'eps')     epsBuild(root);
    if (v === 'bs')      dStdRender('dbs', bsDerive);
  }
  var gsel = root.querySelector('.gen-chart');
  if (gsel) gsel.onchange = function(){ showSection(gsel.value); };

  // One delegated handler on the pane root, never on document (§12, invariant 2).
  root.addEventListener('click', function(e){
    var t = e.target; if (!t.closest) return;
    function hit(attr){ return t.closest('[data-' + attr + ']'); }
    function activate(btn){ if (btn && btn.parentNode) btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b === btn); }); }
    var b, pane;

    if ((b = hit('brm'))){
      brSt.mode = b.getAttribute('data-brm'); activate(b);
      pane = root.querySelector('.gen-sec[data-gsec="bridge"]');
      pane.querySelector('.br-ctl-bu').style.display = brSt.mode === 'buildup' ? '' : 'none';
      pane.querySelector('.br-ctl-bps').style.display = brSt.mode === 'bps' ? '' : 'none';
      brBuild(root); return;
    }
    if ((b = hit('brb'))){ brSt.basis = b.getAttribute('data-brb'); activate(b); brBuild(root); return; }
    if ((b = hit('brg'))){
      brSt.gran = b.getAttribute('data-brg'); activate(b);
      pane = root.querySelector('.gen-sec[data-gsec="bridge"]');
      pane.querySelector('.br-yr').style.display = brSt.gran === 'y' ? '' : 'none';
      pane.querySelector('.br-per').style.display = brSt.gran === 'q' ? '' : 'none';
      brBuild(root); return;
    }
    if ((b = hit('bry'))){ brSt.per = +b.getAttribute('data-bry'); activate(b); brBuild(root); return; }
    if ((b = hit('brp'))){ brSt.perQ = b.getAttribute('data-brp'); activate(b); brBuild(root); return; }
    if ((b = hit('brf'))){ brSt.from = +b.getAttribute('data-brf'); activate(b); brBuild(root); return; }
    if ((b = hit('brt'))){ brSt.to = +b.getAttribute('data-brt'); activate(b); brBuild(root); return; }
    if ((b = hit('nbp'))){ nbSt.per = b.getAttribute('data-nbp'); activate(b); nbBuild(root); return; }
    if ((b = hit('epsp'))){ epsSt.per = b.getAttribute('data-epsp'); epsSt.hidden = {}; activate(b); epsBuild(root); return; }
    if ((b = hit('epsleg'))){ var k = b.getAttribute('data-epsleg'); epsSt.hidden[k] = !epsSt.hidden[k]; epsBuild(root); return; }
    // Tables generated by dTbl regenerate their own header, so they opt out of the generic
    // dhr.js collapsible handler with data-selfwired and are toggled here instead.
    if ((b = hit('dtblb'))){
      var body = root.querySelector('#dTB-' + b.getAttribute('data-dtblb'));
      if (body){
        body.hidden = !body.hidden;
        var ic = b.querySelector('.rs-collap-ic'); if (ic) ic.textContent = body.hidden ? '▸' : '▾';
      }
      return;
    }
  });

  showSection('margins');
}
