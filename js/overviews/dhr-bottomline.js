// dhr-bottomline.js — Danaher, Deep Dive ▸ Bottom Line ▸ General.
//
// Three blocks: a ten-year P&L / margin / cash trend, the GAAP → adjusted EPS bridge, and the
// balance sheet through the Masimo close.
//
// Built to docs/CHART_ENGINE_REFERENCE.md §0.7 (path 3 — our own canvas). Copied verbatim from
// js/results.js: `esc` (:209) and `rsAttachBrush` (:1217–1295); the palette follows :141–145. The
// `rs-*` classes come from css/results.css, which index.html loads unconditionally, so the only
// CSS written here is the handful of `dhr-bl-*` text classes injected below.
//
// ── The basis trap, and why it is a control rather than a footnote ────────────────────────────
// Danaher separated Fortive (2016), Envista (2019) and Veralto (2023). Each separation restated
// only the two prior years, so the as-filed decade sits on THREE different companies:
//   2016            — includes dental (Envista) and Veralto
//   2017–2020       — ex-dental, still includes Veralto
//   2021–2025       — continuing operations as reported today
// A revenue line drawn straight across those years shows a 2016→2017 "decline" that is entirely
// the restatement. So the basis is a legend chip: hide a basis and it leaves the chart, the table
// and the median together, and year-over-year growth is suppressed across every break rather than
// printing a number that compares two different companies.
//
// Sources: SEC XBRL company concepts (data.sec.gov, CIK 0000313616), newest filing per period so
// restatements are picked up. Q2/1H 2026 and every adjusted figure: Danaher's Q2 2026 press
// release and earnings presentation, 21-Jul-2026. FY25/FY24 total debt, equity and total assets:
// the FY2025 annual-report highlights.

function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var C_ACT  = 'rgba(30,39,51,0.92)';    // navy  — reported / actual, the portal convention
var C_ADJ  = 'rgba(37,99,235,0.85)';   // blue  — the adjusted (non-GAAP) read
var C_REF  = 'rgba(124,134,148,0.85)'; // gray  — reference lines
var C_UP   = '#1E9E62';
var C_DOWN = '#C0392B';

// ── Annual series, $M except where noted. As-filed; newest restatement wins. ──────────────────
// `b` is the reporting basis (see the header note). `epsC` is diluted EPS from CONTINUING
// operations — the one bottom-line series that is clean across all ten years, because Danaher
// tags it separately from total-company net income. Consolidated net income is deliberately NOT
// carried here: `NetIncomeLoss` includes discontinued operations in the separation years while
// revenue does not, so a net margin built on it would divide two different companies.
var A = [
  { y:2016, b:'a', rev:16882.4, cogs:7547.8, gp:9334.6, sga:5624.3, rnd: 975.1, op:2735.2, cfo:3521.8, capex: 589.6, dep:545,   amort: 583, sbc:129.8, div:399.8, bb:null, acq: 4880.1, epsC:3.08 },
  { y:2017, b:'b', rev:15518.8, cogs:6947.5, gp:8571.3, sga:5042.6, rnd: 956.4, op:2572.3, cfo:3477.8, capex: 570.7, dep:538.1, amort: 579, sbc:127.1, div:378.3, bb:null, acq:  385.8, epsC:3.08 },
  { y:2018, b:'b', rev:17049,   cogs:7544,   gp:9505,   sga:5391,   rnd:1059,   op:3055,   cfo:4022,   capex: 584,   dep:562,   amort: 616, sbc:138,   div:433,   bb:null, acq: 2173,   epsC:3.39 },
  { y:2019, b:'b', rev:17911,   cogs:7927,   gp:9984,   sga:5589,   rnd:1126,   op:3269,   cfo:3952,   capex: 636,   dep:564,   amort: 625, sbc:159,   div:527,   bb:null, acq:  331,   epsC:3.26 },
  { y:2020, b:'b', rev:22284,   cogs:9809,   gp:12475,  sga:6896,   rnd:1348,   op:4231,   cfo:6208,   capex: 791,   dep:637,   amort:1138, sbc:187,   div:615,   bb:null, acq:20971,   epsC:4.89 },
  { y:2021, b:'c', rev:24802,   cogs:9563,   gp:15239,  sga:6817,   rnd:1498,   op:6377,   cfo:8358,   capex:1240,   dep:674,   amort:1388, sbc:184,   div:742,   bb:null, acq:10901,   epsC:7.28 },
  { y:2022, b:'c', rev:26643,   cogs:10455,  gp:16188,  sga:7124,   rnd:1528,   op:7536,   cfo:8519,   capex:1118,   dep:698,   amort:1434, sbc:295,   div:818,   bb:0,    acq:  582,   epsC:8.47 },
  { y:2023, b:'c', rev:23890,   cogs:9856,   gp:14034,  sga:7329,   rnd:1503,   op:5202,   cfo:7164,   capex:1383,   dep:675,   amort:1491, sbc:306,   div:821,   bb:0,    acq: 5610,   epsC:5.65 },
  { y:2024, b:'c', rev:23875,   cogs:9669,   gp:14206,  sga:7759,   rnd:1584,   op:4863,   cfo:6688,   capex:1392,   dep:721,   amort:1631, sbc:288,   div:768,   bb:5979, acq:  558,   epsC:5.29 },
  { y:2025, b:'c', rev:24568,   cogs:10045,  gp:14523,  sga:8235,   rnd:1598,   op:4690,   cfo:6416,   capex:1156,   dep:750,   amort:1697, sbc:298,   div:878,   bb:3088, acq:    0,   epsC:5.03 }
];

var BASES = [
  { k:'a', label:'2016 · incl. dental + Veralto', short:'incl. dental + Veralto', color:'rgba(154,164,176,0.60)' },
  { k:'b', label:'2017–20 · incl. Veralto',       short:'incl. Veralto',          color:'rgba(62,90,130,0.70)'   },
  { k:'c', label:'2021–25 · continuing ops',      short:'continuing ops',         color:C_ACT                    }
];
function baseOf(k){ for (var i=0;i<BASES.length;i++) if (BASES[i].k===k) return BASES[i]; return BASES[0]; }

// ── The metric catalogue. `f(r)` reads one year; `u` is the unit; `d` the decimals. ───────────
var MET = [
  { g:'Income statement', items:[
    { k:'rev',   n:'Revenue',                      u:'$M', d:0, f:function(r){ return r.rev; } },
    { k:'gp',    n:'Gross profit',                 u:'$M', d:0, f:function(r){ return r.gp;  } },
    { k:'op',    n:'Operating profit',             u:'$M', d:0, f:function(r){ return r.op;  } },
    { k:'epsC',  n:'Diluted EPS, continuing ops',  u:'$',  d:2, f:function(r){ return r.epsC; } }
  ]},
  { g:'Margins', items:[
    { k:'gm',    n:'Gross margin',                 u:'%',  d:1, f:function(r){ return 100*r.gp/r.rev; } },
    { k:'om',    n:'Operating margin',             u:'%',  d:1, f:function(r){ return 100*r.op/r.rev; } },
    { k:'sgap',  n:'SG&A as % of sales',           u:'%',  d:1, f:function(r){ return 100*r.sga/r.rev; } },
    { k:'rndp',  n:'R&D as % of sales',            u:'%',  d:1, f:function(r){ return 100*r.rnd/r.rev; } }
  ]},
  { g:'Cash', items:[
    { k:'cfo',   n:'Operating cash flow',          u:'$M', d:0, f:function(r){ return r.cfo; } },
    { k:'capex', n:'Capital expenditure',          u:'$M', d:0, f:function(r){ return r.capex; } },
    { k:'fcf',   n:'Free cash flow',               u:'$M', d:0, f:function(r){ return r.cfo - r.capex; } },
    { k:'fcfm',  n:'FCF margin',                   u:'%',  d:1, f:function(r){ return 100*(r.cfo-r.capex)/r.rev; } },
    { k:'capexp',n:'Capex as % of sales',          u:'%',  d:1, f:function(r){ return 100*r.capex/r.rev; } }
  ]},
  { g:'Capital deployed', items:[
    { k:'acq',   n:'Acquisitions, net of cash',    u:'$M', d:0, f:function(r){ return r.acq; } },
    { k:'div',   n:'Dividends paid',               u:'$M', d:0, f:function(r){ return r.div; } },
    { k:'bb',    n:'Share repurchases',            u:'$M', d:0, f:function(r){ return r.bb;  } }
  ]},
  { g:'Non-cash charges', items:[
    { k:'amort', n:'Amortisation of intangibles',  u:'$M', d:0, f:function(r){ return r.amort; } },
    { k:'dep',   n:'Depreciation',                 u:'$M', d:0, f:function(r){ return r.dep; } },
    { k:'sbc',   n:'Stock-based compensation',     u:'$M', d:0, f:function(r){ return r.sbc; } }
  ]}
];
function metOf(k){
  for (var i=0;i<MET.length;i++) for (var j=0;j<MET[i].items.length;j++)
    if (MET[i].items[j].k === k) return MET[i].items[j];
  return MET[1].items[1];
}

// ── Q2 / 1H 2026, GAAP and adjusted [Q2'26 press release + IR deck] ───────────────────────────
var P = [
  { k:'q226', n:"Q2'26", sales:6265,  gaap:{ op:1127, ni:870,  eps:1.23 }, adj:{ op:1698, ni:1375, eps:1.94 } },
  { k:'q225', n:"Q2'25", sales:5936,  gaap:{ op:760,  ni:555,  eps:0.77 }, adj:{ op:1618, ni:1292, eps:1.80 } },
  { k:'h126', n:"1H'26", sales:12216, gaap:{ op:2471, ni:1899, eps:2.68 }, adj:{ op:3493, ni:2838, eps:4.00 } },
  { k:'h125', n:"1H'25", sales:11677, gaap:{ op:2034, ni:1509, eps:2.10 }, adj:{ op:3317, ni:2648, eps:3.68 } }
];
function perOf(k){ for (var i=0;i<P.length;i++) if (P[i].k===k) return P[i]; return P[0]; }

// ── The EPS bridge, $/share [press release]. Order is the order the release prints. ───────────
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
var BR = {
  q226:{ gaap:1.23, amort:0.65, fv:0.01, masimo:0.15, imp:0,    disp:0,     tax:-0.13, disc:0.03, round:0,     adj:1.94 },
  q225:{ gaap:0.77, amort:0.59, fv:0.06, masimo:0,    imp:0.60, disp:0,     tax:-0.26, disc:0.03, round:0.01,  adj:1.80 },
  h126:{ gaap:2.68, amort:1.26, fv:0.12, masimo:0.18, imp:0,    disp:0,     tax:-0.27, disc:0.03, round:0,     adj:4.00 },
  h125:{ gaap:2.10, amort:1.16, fv:0.19, masimo:0,    imp:0.62, disp:-0.01, tax:-0.39, disc:0.02, round:-0.01, adj:3.68 }
};

// ── Balance sheet, $M. FY-ends from the annual report; Q2'26 from the 10-Q (post-Masimo). ─────
// `ebitda` is GAAP operating profit plus depreciation and amortisation — stated, not Danaher's
// adjusted EBITDA, which the company does not publish for a full year. Null at Q2'26 on purpose:
// no trailing figure that includes Masimo exists yet.
var BS = [
  { k:'fy24', n:'FY2024', dt:'31-Dec-2024', cash:2078, debtL:15500, debtC:505,  equity:49550, assets:77542, gw:40497, ebitda:7215 },
  { k:'fy25', n:'FY2025', dt:'31-Dec-2025', cash:4615, debtL:18416, debtC:2,    equity:52541, assets:83464, gw:43151, ebitda:7137 },
  { k:'q226', n:"Q2'26",  dt:'26-Jun-2026', cash:4348, debtL:25147, debtC:1411, equity:52581, assets:92367, gw:47414, ebitda:null }
];

// ═══ The drag-to-zoom brush — copied verbatim from js/results.js:1217–1295 ════════════════════
// Drag across the chart to zoom: the axis follows the direction of the drag. Starting on an axis
// strip always means a y-drag, as does any drag on a chart with no x-windowing. Double-click
// resets. Pass onX = null when the x-axis is not windowable.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;   // null = direction not decided yet
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical){
        box.style.left = (r0.left - w0.left + area.left) + 'px';
        box.style.width = (area.right - area.left) + 'px';
      } else {
        box.style.top = (r0.top - w0.top) + 'px';
        box.style.height = r0.height + 'px';
      }
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
      if (vertical){
        var a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx);
        box.style.left = (a2 - w0.left) + 'px';
        box.style.width = (b2 - a2) + 'px';
      }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;                      // a click, not a drag
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        var idxAt = function(clientX){
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
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

// ═══ Block 1 — the ten-year trend ═════════════════════════════════════════════════════════════
var st1 = { metric:'om', hidden:{}, med:true, yr:null, tbl:false, chart:null };

function vis1(basis){ return !st1.hidden[basis]; }                    // rule 2 — the ONE predicate
function rows1(){ return A.filter(function(r){ return vis1(r.b); }); }
function fmt1(v, m){
  if (v == null || isNaN(v)) return '—';
  if (m.u === '%') return v.toFixed(m.d) + '%';
  if (m.u === '$') return '$' + v.toFixed(m.d);
  return '$' + Math.round(v).toLocaleString('en-US');
}
// Growth is suppressed across a basis change — the two years are different companies.
function grow1(i, rs, m){
  if (i === 0) return null;
  if (rs[i].b !== rs[i-1].b) return 'break';
  var a = m.f(rs[i-1]), b = m.f(rs[i]);
  if (a == null || b == null || isNaN(a) || isNaN(b) || a === 0) return null;
  return m.u === '%' ? (b - a) : (100*(b - a)/Math.abs(a));
}
function fmtGrow1(g, m){
  if (g === 'break') return '<span class="rs-ft-dim" title="Reporting basis changed — the two years are not comparable">n/c</span>';
  if (g == null || isNaN(g)) return '<span class="rs-ft-nil">—</span>';
  var s = (g >= 0 ? '+' : '−') + Math.abs(g).toFixed(1) + (m.u === '%' ? 'pp' : '%');
  if (Math.abs(g) < 0.05) return '<span class="rs-ft-dim">' + s + '</span>';
  return '<span style="color:' + (g >= 0 ? C_UP : C_DOWN) + '">' + s + '</span>';
}
function median1(vals){
  var s = vals.filter(function(v){ return v != null && !isNaN(v); }).sort(function(x, y){ return x - y; });
  if (!s.length) return null;
  var h = Math.floor(s.length/2);
  return s.length % 2 ? s[h] : (s[h-1] + s[h])/2;
}

function selHtml1(){
  var h = '<select class="rs-msel" data-blsel="1" aria-label="Metric">';
  MET.forEach(function(g){
    h += '<optgroup label="' + esc(g.g) + '">';
    g.items.forEach(function(it){
      h += '<option value="' + esc(it.k) + '"' + (st1.metric === it.k ? ' selected' : '') + '>' +
           esc(it.n) + ' (' + esc(it.u) + ')</option>';
    });
    h += '</optgroup>';
  });
  return h + '</select>';
}
function chips1(){
  var h = BASES.map(function(b){
    return '<button type="button" class="rs-leg' + (vis1(b.k) ? '' : ' off') + '" data-blleg="' + esc(b.k) + '" ' +
      'title="Show / hide this reporting basis">' +
      '<span class="ave-leg-act" style="background:' + b.color + '"></span>' + esc(b.label) + '</button>';
  }).join('');
  h += '<button type="button" class="rs-leg' + (st1.med ? '' : ' off') + '" data-blleg="__med" title="Show / hide the median line">' +
       '<span class="rs-leg-line" style="background:' + C_REF + '"></span>Median of shown</button>';
  return h;
}
function head1(){
  var m = metOf(st1.metric), rs = rows1();
  return '<span class="rs-collap-ic">' + (st1.tbl ? '▾' : '▸') + '</span>Year detail' +
    '<span class="rs-collap-sub">' + (st1.tbl ? 'hide' : 'show') + ' · ' +
    esc(m.n) + ', ' + rs.length + ' of ' + A.length + ' years shown</span>';
}
function table1(){
  var m = metOf(st1.metric), rs = rows1();
  if (!rs.length) return '<div class="rs-ft-cap">Every basis is hidden — click a legend chip to bring one back.</div>';
  var med = median1(rs.map(m.f));
  var h = '<div class="rs-ft-cap">' + esc(m.n) + ' · ' + esc(m.u) +
    ' · <b>n/c</b> = not comparable, the reporting basis changed that year' +
    ' · median of the years shown: <b>' + fmt1(med, m) + '</b></div>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">FY</th>';
  rs.forEach(function(r){ h += '<th>' + r.y + '</th>'; });
  h += '</tr></thead><tbody><tr class="rs-ft-main"><td class="rs-ft-h">' + esc(m.n) + '</td>';
  rs.forEach(function(r){
    var v = m.f(r);
    h += '<td' + (v == null || isNaN(v) ? ' class="rs-ft-nil"' : '') + '>' + fmt1(v, m) + '</td>';
  });
  h += '</tr><tr class="rs-ft-sub"><td class="rs-ft-h">Year over year</td>';
  rs.forEach(function(r, i){ h += '<td>' + fmtGrow1(grow1(i, rs, m), m) + '</td>'; });
  h += '</tr><tr class="rs-ft-nb"><td class="rs-ft-h">Basis</td>';
  rs.forEach(function(r){ h += '<td class="rs-ft-dim">' + esc(baseOf(r.b).short) + '</td>'; });
  return h + '</tr></tbody></table></div>';
}

function render1(root){
  var cv = root.querySelector('#dhrBlTrendCv'); if (!cv) return;
  var m = metOf(st1.metric), rs = rows1();
  var leg = root.querySelector('#dhrBlTrendLeg'); if (leg) leg.innerHTML = chips1();
  if (st1.chart){ st1.chart.destroy(); st1.chart = null; }

  if (rs.length){
    var vals = rs.map(m.f), med = median1(vals);
    var ds = [{
      type:'bar', label:m.n, data:vals, order:2, borderRadius:3, maxBarThickness:46,
      backgroundColor: rs.map(function(r){ return baseOf(r.b).color; })
    }];
    if (st1.med && med != null) ds.push({
      type:'line', label:'Median of shown', data:rs.map(function(){ return med; }), order:1,
      borderColor:C_REF, borderDash:[6,4], borderWidth:1.5, pointRadius:0, fill:false
    });
    st1.chart = new Chart(cv.getContext('2d'), {
      type:'bar',
      data:{ labels: rs.map(function(r){ return String(r.y); }), datasets: ds },
      options:{
        responsive:true, maintainAspectRatio:false, animation:{ duration:200 },
        interaction:{ mode:'index', intersect:false },
        plugins:{
          legend:{ display:false },                                  // the chips ARE the legend
          tooltip:{ callbacks:{
            label:function(c){ return c.dataset.label + ': ' + fmt1(c.parsed.y, m); },
            afterBody:function(items){
              var r = rs[items[0].dataIndex];
              return r ? 'Basis: ' + baseOf(r.b).short : '';
            }
          } }
        },
        scales:{
          x:{ grid:{ display:false }, ticks:{ font:{ size:11 } } },
          y:{ position:'right', grid:{ color:'rgba(0,0,0,0.05)' },   // §0.4 — axes on the right
              min: st1.yr ? st1.yr[0] : undefined,                   // rule 1 — honour the drag
              max: st1.yr ? st1.yr[1] : undefined,
              ticks:{ font:{ size:11 }, callback:function(v){ return fmt1(v, m); } } }
        }
      }
    });
    rsAttachBrush(cv, st1.chart, null,                               // x is not windowable here
      function(v1, v2){ st1.yr = [v1, v2]; render1(root); },
      function(){ st1.yr = null; render1(root); });
  }
  var tb = root.querySelector('#dhrBlTrendTbl'); if (tb) tb.innerHTML = table1();
  var hd = root.querySelector('[data-bltblb="trend"]'); if (hd) hd.innerHTML = head1();
}

function trendHtml(){
  if (!A.length) return '';                                     // rule 6 — nothing, never broken
  return '<div class="rs-block" id="dhrBlTrend">' +
    '<div class="rs-block-modes">' +
      '<div class="rs-modes"><b class="dhr-bl-h">Ten years, one metric at a time</b>' + selHtml1() + '</div>' +
      '<div class="rs-quick dhr-bl-hint">Drag to zoom · double-click resets</div></div>' +
    '<div id="dhrBlTrendLeg" class="dhr-bl-leg">' + chips1() + '</div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="dhrBlTrendCv"></canvas></div>' +
    '<div class="rs-collap">' +
      '<button type="button" class="rs-collap-h" data-selfwired data-bltblb="trend">' + head1() + '</button>' +
      '<div class="rs-collap-b" id="dhrBlTrendBody"' + (st1.tbl ? '' : ' hidden') + '>' +
        '<div class="rs-tablewrap" id="dhrBlTrendTbl"></div>' +
      '</div></div>' +
    '<p class="dhr-bl-note">Every figure is as-filed, taken from Danaher\'s own filings through SEC XBRL with the ' +
      'newest filing per period, so restatements are picked up. Three separations mean three reporting bases — ' +
      'hide one with its chip, and year-over-year growth is left blank across each break rather than comparing ' +
      'two different companies. Consolidated net income is not offered: in the separation years it includes ' +
      'discontinued operations while revenue does not. Diluted EPS from continuing operations is carried ' +
      'instead, which Danaher tags cleanly for all ten years.</p>' +
    '</div>';
}

// ═══ Block 2 — the GAAP → adjusted EPS bridge ═════════════════════════════════════════════════
var st2 = { per:'q226', hidden:{}, yr:null, tbl:false, chart:null };

function vis2(k){ return !st2.hidden[k]; }                            // rule 2 — the ONE predicate
function live2(){ var d = BR[st2.per]; return BR_STEPS.filter(function(s){ return d[s.k] !== 0; }); }
function steps2(){ return live2().filter(function(s){ return vis2(s.k); }); }
function isFull2(){ return steps2().length === live2().length; }
function fmtEps(v){ if (v == null || isNaN(v)) return '—'; return (v < 0 ? '−$' : '$') + Math.abs(v).toFixed(2); }
function fmtStep(v){ if (v == null || isNaN(v)) return '—'; return (v >= 0 ? '+' : '−') + '$' + Math.abs(v).toFixed(2); }

function pills2(){
  return P.map(function(p){
    return '<button type="button" class="rs-view' + (st2.per === p.k ? ' active' : '') + '" data-blper="' + esc(p.k) + '">' +
      esc(p.n) + '</button>';
  }).join('');
}
function chips2(){
  var d = BR[st2.per];
  return live2().map(function(s){
    return '<button type="button" class="rs-leg' + (vis2(s.k) ? '' : ' off') + '" data-blbleg="' + esc(s.k) + '" ' +
      'title="Show / hide this adjustment">' +
      '<span class="ave-leg-act" style="background:' + (d[s.k] >= 0 ? C_ADJ : C_DOWN) + '"></span>' +
      esc(s.n) + ' ' + fmtStep(d[s.k]) + '</button>';
  }).join('');
}
function head2(){
  return '<span class="rs-collap-ic">' + (st2.tbl ? '▾' : '▸') + '</span>Bridge detail' +
    '<span class="rs-collap-sub">' + (st2.tbl ? 'hide' : 'show') + ' · ' + esc(perOf(st2.per).n) +
    ', ' + steps2().length + ' of ' + live2().length + ' adjustments shown</span>';
}
function table2(){
  var d = BR[st2.per], p = perOf(st2.per), run = d.gaap, full = isFull2();
  var h = '<div class="rs-ft-cap">$ per diluted share · the reconciliation as the press release prints it · ' +
    'hidden adjustments drop out of the running total, so the foot is what is on screen, not the published figure</div>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr>' +
      '<th class="rs-ft-h">Line</th><th>Per share</th><th>Running</th><th>Net earnings, $M</th>' +
    '</tr></thead><tbody>';
  h += '<tr class="rs-ft-main"><td class="rs-ft-h">Diluted EPS (GAAP)</td><td>' + fmtEps(d.gaap) +
       '</td><td>' + fmtEps(run) + '</td><td>' + Math.round(p.gaap.ni).toLocaleString('en-US') + '</td></tr>';
  steps2().forEach(function(s){
    run += d[s.k];
    h += '<tr class="rs-ft-sub"><td class="rs-ft-h">' + esc(s.n) + '</td>' +
         '<td style="color:' + (d[s.k] >= 0 ? C_UP : C_DOWN) + '">' + fmtStep(d[s.k]) + '</td>' +
         '<td>' + fmtEps(run) + '</td><td class="rs-ft-nil">—</td></tr>';
  });
  h += '<tr class="rs-ft-main"><td class="rs-ft-h">' +
       (full ? 'Adjusted diluted EPS (non-GAAP)' : 'Subtotal of the adjustments shown') + '</td>' +
       '<td>' + fmtEps(full ? d.adj : run) + '</td><td>' + fmtEps(full ? d.adj : run) + '</td>' +
       '<td>' + (full ? Math.round(p.adj.ni).toLocaleString('en-US') : '<span class="rs-ft-nil">—</span>') + '</td></tr>';
  return h + '</tbody></table></div>';
}
function render2(root){
  var cv = root.querySelector('#dhrBlBrCv'); if (!cv) return;
  var d = BR[st2.per], ss = steps2();
  var lg = root.querySelector('#dhrBlBrLeg'); if (lg) lg.innerHTML = chips2();
  var pl = root.querySelector('#dhrBlBrPills'); if (pl) pl.innerHTML = pills2();
  if (st2.chart){ st2.chart.destroy(); st2.chart = null; }

  // A waterfall drawn as a floating bar: each bar spans [running before, running after].
  var labels = ['GAAP EPS'], floats = [[0, d.gaap]], colors = [C_ACT], run = d.gaap;
  ss.forEach(function(s){
    labels.push(s.n);
    floats.push([run, run + d[s.k]]);
    colors.push(d[s.k] >= 0 ? C_ADJ : C_DOWN);
    run += d[s.k];
  });
  labels.push(isFull2() ? 'Adjusted EPS' : 'Subtotal');
  floats.push([0, run]); colors.push(C_ADJ);

  st2.chart = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels: labels, datasets:[{ label:'EPS', data: floats, backgroundColor: colors, borderRadius:3, maxBarThickness:52 }] },
    options:{
      responsive:true, maintainAspectRatio:false, animation:{ duration:200 },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ return labels[items[0].dataIndex]; },
          label:function(c){ var v = c.raw; return fmtEps(v[0]) + ' → ' + fmtEps(v[1]) + '  (' + fmtStep(v[1] - v[0]) + ')'; }
        } }
      },
      scales:{
        x:{ grid:{ display:false }, ticks:{ font:{ size:10 }, maxRotation:40, autoSkip:false,
            callback:function(v, i){ var l = labels[i] || ''; return l.length > 20 ? l.slice(0, 19) + '…' : l; } } },
        y:{ position:'right', grid:{ color:'rgba(0,0,0,0.05)' },
            min: st2.yr ? st2.yr[0] : undefined,
            max: st2.yr ? st2.yr[1] : undefined,
            ticks:{ font:{ size:11 }, callback:function(v){ return fmtEps(v); } } }
      }
    }
  });
  rsAttachBrush(cv, st2.chart, null,
    function(v1, v2){ st2.yr = [v1, v2]; render2(root); },
    function(){ st2.yr = null; render2(root); });

  var tb = root.querySelector('#dhrBlBrTbl'); if (tb) tb.innerHTML = table2();
  var hd = root.querySelector('[data-bltblb="bridge"]'); if (hd) hd.innerHTML = head2();
  var sub = root.querySelector('#dhrBlBrSub');
  if (sub){
    var p = perOf(st2.per);
    sub.innerHTML = 'In ' + esc(p.n) + ' the adjusted operating margin was <b>' + (100*p.adj.op/p.sales).toFixed(1) +
      '%</b> against a GAAP <b>' + (100*p.gaap.op/p.sales).toFixed(1) + '%</b>. The gap is <b>' +
      fmtEps(d.adj - d.gaap) + '</b> a share, of which amortisation of acquisition intangibles alone is <b>' +
      fmtEps(d.amort) + '</b>.';
  }
}
function bridgeHtml(){
  if (!BR[st2.per]) return '';                                  // rule 6 — nothing, never broken
  return '<div class="rs-block" id="dhrBlBr">' +
    '<div class="rs-block-modes">' +
      '<div class="rs-modes"><b class="dhr-bl-h">GAAP → adjusted EPS</b>' +
        '<span class="rs-views" id="dhrBlBrPills">' + pills2() + '</span></div>' +
      '<div class="rs-quick dhr-bl-hint">Drag to zoom · double-click resets</div></div>' +
    '<p class="dhr-bl-sub" id="dhrBlBrSub"></p>' +
    '<div id="dhrBlBrLeg" class="dhr-bl-leg">' + chips2() + '</div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="dhrBlBrCv"></canvas></div>' +
    '<div class="rs-collap">' +
      '<button type="button" class="rs-collap-h" data-selfwired data-bltblb="bridge">' + head2() + '</button>' +
      '<div class="rs-collap-b" id="dhrBlBrBody"' + (st2.tbl ? '' : ' hidden') + '>' +
        '<div class="rs-tablewrap" id="dhrBlBrTbl"></div>' +
      '</div></div>' +
    '<p class="dhr-bl-note">Amortisation of acquisition intangibles is the adjustment that matters, and it is not ' +
      'a one-off: Danaher guides it to roughly <b>$1,900M for FY2026</b>, and it has risen every year since 2019. ' +
      'It is the accounting cost of a strategy built on buying companies, so a reader who takes the adjusted ' +
      'number is accepting that the price paid for those businesses never runs through the P&amp;L. Both bases ' +
      'are on screen together for that reason.</p>' +
    '</div>';
}

// ═══ Block 3 — the balance sheet through the Masimo close ═════════════════════════════════════
function bsDebt(r){ return r.debtL + r.debtC; }
function bsNet(r){ return bsDebt(r) - r.cash; }
function money(v){ return v == null || isNaN(v) ? '—' : '$' + Math.round(v).toLocaleString('en-US'); }
function bsTable(){
  var fy25 = BS[1];
  var h = '<div class="rs-ft-cap">$ in millions · fiscal year-ends from the annual report; ' +
    'Q2\'26 from the 10-Q, the first balance sheet that carries Masimo</div>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Line</th>';
  BS.forEach(function(r){
    h += '<th' + (r.k === 'q226' ? ' class="rs-ft-este"' : '') + '>' + esc(r.n) +
         '<br><span class="rs-ft-dim" style="font-weight:400">' + esc(r.dt) + '</span></th>';
  });
  h += '</tr></thead><tbody>';
  function row(label, get, main){
    var t = '<tr class="' + (main ? 'rs-ft-main' : 'rs-ft-sub') + '"><td class="rs-ft-h">' + esc(label) + '</td>';
    BS.forEach(function(r){
      var v = get(r);
      t += '<td class="' + (r.k === 'q226' ? 'rs-ft-este ' : '') + (v == null ? 'rs-ft-nil' : '') + '">' + money(v) + '</td>';
    });
    return t + '</tr>';
  }
  h += row('Cash and equivalents',      function(r){ return r.cash; },  false);
  h += row('Long-term debt',            function(r){ return r.debtL; }, false);
  h += row('Current portion and notes', function(r){ return r.debtC; }, false);
  h += row('Total debt',                bsDebt,                         true);
  h += row('Net debt',                  bsNet,                          true);
  h += row("Stockholders' equity",      function(r){ return r.equity; }, false);
  h += row('Total assets',              function(r){ return r.assets; }, false);
  h += row('Goodwill',                  function(r){ return r.gw; },     false);
  h += '<tr class="rs-ft-nb"><td class="rs-ft-h">Net debt / EBITDA</td>';
  BS.forEach(function(r){
    if (r.ebitda == null){
      h += '<td class="rs-ft-este rs-ft-dim" title="Post-Masimo net debt against FY2025 EBITDA — Masimo adds to the debt but to none of the earnings in that denominator">' +
           (bsNet(r)/fy25.ebitda).toFixed(2) + 'x <span class="rs-ft-e">&dagger;</span></td>';
    } else {
      h += '<td>' + (bsNet(r)/r.ebitda).toFixed(2) + 'x</td>';
    }
  });
  return h + '</tr></tbody></table></div>';
}
function bsHtml(){
  if (BS.length < 3) return '';                                 // rule 6 — nothing, never broken
  var q = BS[2], f = BS[1];
  return '<div class="rs-block" id="dhrBlBs">' +
    '<div class="rs-block-modes"><div class="rs-modes"><b class="dhr-bl-h">The balance sheet through Masimo</b></div></div>' +
    '<p class="dhr-bl-sub">Masimo took gross debt from ' + money(bsDebt(f)) + 'M to ' + money(bsDebt(q)) +
      'M in a single quarter, and net debt from ' + money(bsNet(f)) + 'M to ' + money(bsNet(q)) + 'M. Goodwill rose ' +
      money(q.gw - f.gw) + 'M. Danaher spent the years after Cytiva paying debt down; this puts a good part of it back on.</p>' +
    bsTable() +
    '<p class="dhr-bl-note"><span class="rs-ft-e">&dagger;</span> Leverage at Q2\'26 is post-Masimo net debt measured ' +
      'against <b>FY2025</b> EBITDA. Masimo adds to the debt but to none of the earnings in that denominator, and no ' +
      'trailing figure including it exists yet — so read it as the ceiling, not the run-rate. EBITDA here is GAAP ' +
      'operating profit plus depreciation and amortisation, stated rather than Danaher\'s adjusted EBITDA, which the ' +
      'company does not publish for a full year.</p>' +
    '</div>';
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
var BL_CSS = '<style>' +
  '.dhr-bl{max-width:980px}' +
  '.dhr-bl-h{font-size:13px;font-weight:800;color:var(--navy);letter-spacing:.01em}' +
  '.dhr-bl-hint{font-size:11px;color:var(--mu)}' +
  '.dhr-bl-leg{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 10px}' +
  '.dhr-bl-lede{font-size:14px;line-height:1.62;color:var(--tx);margin:2px 0 22px;max-width:78ch}' +
  '.dhr-bl-sub{font-size:12.5px;line-height:1.6;color:var(--tx);margin:8px 0 2px;max-width:82ch}' +
  '.dhr-bl-note{font-size:11.5px;line-height:1.6;color:var(--mu);margin:14px 0 0;max-width:82ch}' +
  '@media(max-width:640px){.dhr-bl-leg{gap:5px}.dhr-bl-h{font-size:12px}}' +
  '</style>';

export function dhrBottomLineHtml(){
  return BL_CSS + '<div class="dhr-bl">' +
    '<p class="dhr-bl-lede">Danaher earns a 59% gross margin and turns more than all of its net income into cash — ' +
      'FY2025 was the 34th consecutive year of free cash flow exceeding net earnings. Two things are worth holding ' +
      'in view against that. The operating margin has fallen in every year since 2022. And the gap between GAAP and ' +
      'adjusted earnings is not a one-off but a recurring ~$1.9B of acquisition amortisation — the cost of the ' +
      'strategy itself.</p>' +
    trendHtml() + bridgeHtml() + bsHtml() +
    '</div>';
}

export function dhrBottomLineInit(root){
  if (!root || typeof Chart === 'undefined') return;
  // Delegated on the pane root, never on document (§12, invariant 2).
  root.addEventListener('change', function(e){
    var sel = e.target.closest('[data-blsel]');
    if (sel){ st1.metric = sel.value; st1.yr = null; render1(root); }   // units changed — drop the zoom
  });
  root.addEventListener('click', function(e){
    var lg = e.target.closest('[data-blleg]');
    if (lg){
      var k = lg.getAttribute('data-blleg');
      if (k === '__med') st1.med = !st1.med; else st1.hidden[k] = !st1.hidden[k];
      render1(root); return;
    }
    var bl = e.target.closest('[data-blbleg]');
    if (bl){ st2.hidden[bl.getAttribute('data-blbleg')] = !st2.hidden[bl.getAttribute('data-blbleg')]; render2(root); return; }
    var pr = e.target.closest('[data-blper]');
    if (pr){ st2.per = pr.getAttribute('data-blper'); st2.hidden = {}; st2.yr = null; render2(root); return; }
    var tb = e.target.closest('[data-bltblb]');
    if (tb){
      if (tb.getAttribute('data-bltblb') === 'trend'){
        st1.tbl = !st1.tbl;
        var b1 = root.querySelector('#dhrBlTrendBody'); if (b1) b1.hidden = !st1.tbl;
        tb.innerHTML = head1();
      } else {
        st2.tbl = !st2.tbl;
        var b2 = root.querySelector('#dhrBlBrBody'); if (b2) b2.hidden = !st2.tbl;
        tb.innerHTML = head2();
      }
    }
  });
  render1(root);
  render2(root);
}
