// overviews/hyperscalers-industry.js — "Hyperscalers" industry analysis.
//
// The question: HOW HAS AI CAPEX AND ITS GUIDANCE MOVED, call by call, across
// AMZN / GOOGL / META / MSFT since 2024 — and how much of the reported number is
// real investment versus accounting.
//
// Five tabs. Structure follows payments-industry.js exactly: every pane is
// rendered up front and shown/hidden by the tab bar (so charts survive tab
// switches instead of being torn down), a .hs-head title block, .hs-sec section
// rules, .hs-card blocks, and `export var … = { html, init }`.
//
// Pure presentation + Chart.js. Data and its sourcing rules live in
// hyperscalers-data.js. Rendered in-document inside Industry Analysis.
//
// CHART RULES followed here (data-viz method): one y-axis per chart — never dual;
// validated categorical palette in fixed order, colour follows the company and
// never its rank; 2px lines, 8px markers; a legend is always present for ≥2 series
// AND lines carry end-of-line direct labels (mandatory relief — Meta's aqua is
// 2.82:1 on white); a table view accompanies every chart; recessive grid; hover
// crosshair + tooltip.

import {
  HS_COMPANIES, HS_VINTAGES, HS_GUIDE, HS_QUARTERLY, HS_BASIS,
  HS_BACKLOG, HS_BACKLOG_NOTES, HS_ACCOUNTING, HS_BOTTLENECK,
} from './hyperscalers-data.js';

function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function co(id){ return HS_COMPANIES.filter(function(c){ return c.id === id; })[0]; }
function dot(id){ return '<span class="hs-dot" style="background:' + co(id).color + '"></span>'; }
var LABELS = HS_VINTAGES.map(function(v){ return v.label; });

var INK_MUTED = '#8A93A0', GRID = '#EEF1F5', AXIS = '#D7DDE4';

// View state that the panes own (which target year, which backlog view).
var _view = { guideYear: '2026', backView: 'abs' };
var _charts = {};

// ─── Direct end-of-line labels ────────────────────────────────────────────────
// The legend carries identity, but the relief rule (aqua under 3:1 on white)
// requires identity not to rest on colour alone — so each line is also named at
// its last real point. Labels only, never a value on every point.
var endLabels = {
  id: 'hsEndLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    ctx.save();
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    var placed = [];
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      var last = -1;
      ds.data.forEach(function(v, i){ if (v != null) last = i; });
      if (last < 0 || !meta.data[last]) return;
      var pt = meta.data[last], y = pt.y;
      placed.forEach(function(py){ if (Math.abs(y - py) < 12) y = py + 12; });
      placed.push(y);
      ctx.fillStyle = ds.borderColor;
      ctx.textAlign = 'left';
      ctx.fillText(ds.label, Math.min(pt.x + 8, chart.chartArea.right + 4), y);
    });
    ctx.restore();
  },
};

// Crop the x-axis to the stretch that carries data, keeping ONE empty column of
// run-up so "nobody had said anything yet" stays visible. Without this the CY2026
// guide chart spends two-thirds of its width on empty quarters.
function windowOf(series){
  var lo = Infinity, hi = -Infinity;
  series.forEach(function(s){
    (s.data || []).forEach(function(v, i){ if (v != null){ if (i < lo) lo = i; if (i > hi) hi = i; } });
  });
  if (lo === Infinity) return { lo: 0, hi: HS_VINTAGES.length - 1 };
  return { lo: Math.max(0, lo - 1), hi: Math.min(HS_VINTAGES.length - 1, hi + 1) };
}

// ─── Shared line chart ────────────────────────────────────────────────────────
function lineChart(canvasId, series, unit, yTitle){
  var el = document.getElementById(canvasId);
  if (!el || !el.offsetParent) return;
  if (_charts[canvasId]) { _charts[canvasId].destroy(); delete _charts[canvasId]; }

  // A series with nothing to plot gets no legend entry — an entry with no line
  // reads as "missing data" when the real reason is that the company never guides
  // on this basis (Microsoft, on a calendar year). The prose says why.
  series = series.filter(function(s){ return (s.data || []).some(function(v){ return v != null; }); });
  if (!series.length) return;

  var win = windowOf(series);
  var labels = LABELS.slice(win.lo, win.hi + 1);
  var vints = HS_VINTAGES.slice(win.lo, win.hi + 1);
  series = series.map(function(s){ return { id: s.id, data: s.data.slice(win.lo, win.hi + 1) }; });

  var fmt = function(v){
    if (v == null) return '—';
    return unit === 'x' ? (Math.round(v * 100) / 100) + '×' : '$' + (Math.round(v * 10) / 10) + 'B';
  };
  var datasets = series.map(function(s){
    var c = co(s.id);
    return {
      label: c.ticker, data: s.data,
      borderColor: c.color, backgroundColor: c.color,
      borderWidth: 2, spanGaps: true, tension: 0.25,
      pointRadius: function(ctx){ return ctx.raw == null ? 0 : 4.5; },
      pointHoverRadius: 6.5, pointBorderColor: '#fff', pointBorderWidth: 2,
    };
  });

  _charts[canvasId] = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      // Reference charts, not marketing: render final-state immediately. Also
      // deterministic — a throttled rAF in a background tab can otherwise leave
      // the entry animation frozen part-way.
      animation: false,
      layout: { padding: { right: 54, top: 6 } },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle',
                    color: '#1E2733', font: { size: 11, family: 'Inter', weight: '600' }, padding: 14 } },
        tooltip: {
          backgroundColor: '#1E2733', padding: 10, cornerRadius: 6,
          displayColors: true, boxWidth: 8, boxHeight: 8, usePointStyle: true,
          titleFont: { size: 11, family: 'Inter' }, bodyFont: { size: 11.5, family: 'Inter' },
          callbacks: {
            title: function(items){
              var v = vints[items[0].dataIndex];
              return v.label + ' — ' + v.calls + ' calls (MSFT ' + v.msft + ')';
            },
            label: function(c){ return c.dataset.label + ': ' + fmt(c.raw); },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: AXIS },
             ticks: { color: INK_MUTED, font: { size: 10.5, family: 'Inter' } } },
        y: { title: { display: !!yTitle, text: yTitle, color: INK_MUTED, font: { size: 10.5, family: 'Inter' } },
             grid: { color: GRID, drawTicks: false }, border: { display: false },
             ticks: { color: INK_MUTED, font: { size: 10.5, family: 'Inter' }, padding: 8,
                      callback: function(v){ return unit === 'x' ? v + '×' : '$' + v + 'B'; } } },
      },
    },
    plugins: [endLabels],
  });
}

// A table view accompanies every chart — required, not decorative: it is the
// fallback that makes the sub-3:1 series legible and the gaps explicit.
function table(rows, head, cls){
  return '<div class="hs-tw"><table class="hs-table' + (cls ? ' ' + cls : '') + '"><thead><tr>' +
    head.map(function(h, i){ return '<th' + (i ? ' class="num"' : '') + '>' + esc(h) + '</th>'; }).join('') +
    '</tr></thead><tbody>' + rows.map(function(r){
      return '<tr>' + r.map(function(c, i){
        return '<td' + (i ? ' class="num"' : '') + '>' + (c == null ? '<span class="hs-na">—</span>' : c) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
}

function sec(t){ return '<div class="hs-sec">' + esc(t) + '</div>'; }

// ─── Tab 1 · Guidance Ladder ──────────────────────────────────────────────────
function ladderBody(){
  var g = HS_GUIDE.filter(function(x){ return x.year === _view.guideYear; })[0];
  var segs = HS_GUIDE.map(function(x){
    return '<button type="button" class="hs-seg-b' + (x.year === _view.guideYear ? ' active' : '') +
      '" data-year="' + x.year + '">' + esc(x.label) + '</button>';
  }).join('');

  var rows = HS_COMPANIES.map(function(c){
    var r = g.resolve[c.id] || {};
    var chg = (r.first != null && r.last != null && r.first !== 0) ? ((r.last - r.first) / r.first * 100) : null;
    return [
      dot(c.id) + c.ticker,
      r.first != null ? '$' + r.first + 'B' : null,
      r.last  != null ? '$' + r.last  + 'B' : null,
      chg == null ? null : '<span class="' + (chg > 0 ? 'hs-up' : chg < 0 ? 'hs-dn' : '') + '">' +
        (chg > 0 ? '+' : '') + chg.toFixed(0) + '%</span>',
      r.actual != null ? '$' + r.actual + 'B' + (r.d ? ' <span class="hs-badge hs-b-mut">derived</span>' : '') : null,
    ];
  });

  var srcs = HS_COMPANIES.map(function(c){
    var r = g.resolve[c.id];
    return (!r || !r.src) ? '' : '<li>' + dot(c.id) + '<b>' + c.ticker + '</b> · ' + r.src + '</li>';
  }).join('');

  return '<p class="hs-lede">' + esc(g.blurb) + '</p>' +
    '<div class="hs-seg">' + segs + '</div>' +
    '<div class="hs-card">' +
      '<div class="hs-chart-head"><span class="hs-chart-t">' + esc(g.year) + ' CapEx guide, revision by revision</span>' +
        '<span class="hs-chart-u">US$B · midpoint of guided range</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-ladder"></canvas></div>' +
      '<p class="hs-cap">Each marker is a guide actually stated on that call. The line crosses quarters where no annual number was given — that is visual continuity, not interpolation.' +
      (_view.guideYear === '2025' ? ' <b>Microsoft is absent</b> because it does not guide on a calendar year; its first calendar figure is CY2026.' : '') +
      '</p>' +
    '</div>' +
    sec('From first guide to outcome') +
    '<div class="hs-card">' +
      table(rows, ['', 'First guide', 'Last guide', 'Δ', 'Actual / latest']) +
      '<ul class="hs-src">' + srcs + '</ul>' +
    '</div>';
}

// ─── Tab 2 · Quarterly CapEx ──────────────────────────────────────────────────
function quarterlyBody(){
  var rows = HS_COMPANIES.map(function(c){
    return [dot(c.id) + c.ticker].concat(HS_QUARTERLY[c.id].map(function(v){ return v == null ? null : '$' + v + 'B'; }));
  });
  var basis = HS_BASIS.map(function(b){
    return '<li>' + dot(b.id) + '<b>' + co(b.id).ticker + '</b> — <b>' + esc(b.basis) + '.</b> ' + esc(b.note) + '</li>';
  }).join('');

  return '<p class="hs-lede">What was actually spent. The break is visible: through mid-2025 the four run together and low; after that they fan out.</p>' +
    '<div class="hs-card">' +
      '<div class="hs-chart-head"><span class="hs-chart-t">Reported CapEx by quarter</span>' +
        '<span class="hs-chart-u">US$B · calendar axis</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-qtr"></canvas></div>' +
      '<p class="hs-cap">Gaps are gaps: the call gave no figure (Alphabet 2Q24 is not in the corpus). Nothing is interpolated.</p>' +
    '</div>' +
    sec('Why these four series cannot be stacked') +
    '<div class="hs-card hs-card--warn"><ul class="hs-src">' + basis + '</ul></div>' +
    sec('Table') +
    '<div class="hs-card">' + table(rows, [''].concat(LABELS)) + '</div>';
}

// ─── Tab 3 · Backlog & Coverage ───────────────────────────────────────────────
// Deliberately NOT a dual-axis "backlog vs CapEx" chart. Two measures on two
// scales in one frame is the single most misleading chart form there is, so the
// relationship is expressed as a ratio on ONE axis instead: how many years of
// current spend the contracted book already covers.
function coverage(id){
  return HS_BACKLOG[id].map(function(b, i){
    var q = HS_QUARTERLY[id][i];
    return (b == null || q == null || !q) ? null : b / (q * 4);
  });
}
function backlogBody(){
  var abs = _view.backView === 'abs';
  var ids = ['googl', 'amzn', 'msft'];
  var rows = ids.map(function(id){
    var src = abs ? HS_BACKLOG[id] : coverage(id);
    return [dot(id) + co(id).ticker].concat(src.map(function(v){
      return v == null ? null : (abs ? '$' + v + 'B' : (Math.round(v * 100) / 100) + '×');
    }));
  });

  return '<p class="hs-lede">The only external proof that the spend is sold. Meta is absent: it sells no contracted capacity, and that absence is the finding.</p>' +
    '<div class="hs-seg">' +
      '<button type="button" class="hs-seg-b' + (abs ? ' active' : '') + '" data-back="abs">Contracted backlog</button>' +
      '<button type="button" class="hs-seg-b' + (!abs ? ' active' : '') + '" data-back="cov">Coverage of spend</button>' +
    '</div>' +
    '<div class="hs-card">' +
      '<div class="hs-chart-head"><span class="hs-chart-t">' +
        (abs ? 'Contracted backlog / RPO' : 'Years of CapEx covered by backlog') + '</span>' +
        '<span class="hs-chart-u">' + (abs ? 'US$B' : 'backlog ÷ annualised quarterly CapEx') + '</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-back"></canvas></div>' +
      '<p class="hs-cap">' + (abs
        ? 'Alphabet "Cloud backlog", Amazon "backlog", Microsoft "commercial RPO". These are not identical definitions.'
        : 'Derived ratio: backlog ÷ (quarterly CapEx × 4). One axis, rather than overlaying two different scales.') +
      '</p>' +
    '</div>' +
    sec('What the number does not say') +
    '<div class="hs-card hs-card--warn"><ul class="hs-src">' +
      HS_BACKLOG_NOTES.map(function(n){ return '<li>' + n + '</li>'; }).join('') + '</ul></div>' +
    sec('Table') +
    '<div class="hs-card">' + table(rows, [''].concat(LABELS)) + '</div>';
}

// ─── Tab 4 · Accounting ───────────────────────────────────────────────────────
function accountingBody(){
  var rows = HS_ACCOUNTING.map(function(a){
    return '<tr>' +
      '<td class="hs-w-date">' + esc(a.when) + '</td>' +
      '<td class="hs-w-co">' + dot(a.who) + '<b>' + co(a.who).ticker + '</b></td>' +
      '<td>' + esc(a.what) + '</td>' +
      '<td><span class="hs-badge ' + (a.effect === '+' ? 'hs-b-green' : 'hs-b-red') + '">' +
        (a.effect === '+' ? 'favourable' : 'adverse') + '</span></td>' +
      '<td class="hs-w-imp">' + esc(a.impact) + '</td></tr>';
  }).join('');

  return '<p class="hs-lede">Seven changes in two and a half years. Six move the reported number in the favourable direction. None is irregular — which is exactly why they should be read together.</p>' +
    '<div class="hs-card"><div class="hs-tw"><table class="hs-table hs-table--wrap"><thead><tr>' +
      '<th>Date</th><th></th><th>Change</th><th>Effect</th><th>Stated impact</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
    sec('What follows from it') +
    '<div class="hs-card hs-card--warn">' +
      '<p class="hs-body">Reported CapEx has stopped being comparable across the four, and across time within each of them. ' +
      'The clearest case: Microsoft\'s CY2026 CapEx falls from ~$190B to ~$175B <b>without a dollar of investment changing</b> — ' +
      'that is the finance-to-operating lease reclassification that the useful-life extension drags with it. ' +
      'Any chart stacking the four series as published is measuring, in part, accounting decisions.</p>' +
    '</div>';
}

// ─── Tab 5 · Bottleneck ───────────────────────────────────────────────────────
function bottleneckBody(){
  var items = HS_BOTTLENECK.map(function(b, i){
    return '<li class="hs-step"><span class="hs-step-n">' + (i + 1) + '</span>' +
      '<div><div class="hs-step-h"><span class="hs-step-t">' + esc(b.label) + '</span>' +
      '<span class="hs-step-p">' + esc(b.period) + '</span></div>' +
      '<p class="hs-body">' + esc(b.quote) + '</p></div></li>';
  }).join('');
  return '<p class="hs-lede">The binding constraint moved three times. It matters because each move changes who captures the margin — and in 2026 the one raising the bill is the memory supplier, not the compute vendor.</p>' +
    '<div class="hs-card"><ol class="hs-steps">' + items + '</ol></div>';
}

// ─── Tab registry + shell ─────────────────────────────────────────────────────
var TABS = [
  { key: 'ladder',  label: 'Guidance Ladder',    body: ladderBody },
  { key: 'qtr',     label: 'Quarterly CapEx',    body: quarterlyBody },
  { key: 'backlog', label: 'Backlog & Coverage', body: backlogBody },
  { key: 'acct',    label: 'Accounting',         body: accountingBody },
  { key: 'neck',    label: 'The Bottleneck',     body: bottleneckBody },
];

function html(){
  var h = '<div class="hs">';
  h += '<div class="hs-head"><div class="hs-h-title">Hyperscaler AI CapEx &amp; Guidance</div>' +
    '<div class="hs-h-sub">Amazon · Alphabet · Meta · Microsoft — every revision dated to the call that made it, 2024–2026</div></div>';
  h += '<div class="hs-tabs">' + TABS.map(function(t, i){
    return '<button type="button" class="hs-tab' + (i === 0 ? ' active' : '') + '" data-ht="' + t.key + '">' +
      '<span class="hs-tab-n">' + (i + 1) + '</span>' + esc(t.label) + '</button>';
  }).join('') + '</div>';
  h += '<p class="hs-note"><b>Calendar axis.</b> Sourced entirely from the companies\' own earnings calls; derived figures are labelled. ' +
    'Microsoft\'s fiscal year ends in June, so its "FY26Q2" sits in the January 2026 column — every tooltip states the equivalence.</p>';
  h += TABS.map(function(t, i){
    return '<div class="hs-pane" data-ht="' + t.key + '"' + (i === 0 ? '' : ' hidden') + ' style="margin-top:16px">' + t.body() + '</div>';
  }).join('');
  h += '</div>';
  return h;
}

// Charts build when their pane becomes visible (Chart.js needs a non-null
// offsetParent). Built synchronously rather than on rAF, which is throttled to
// never in a background tab and would leave the pane chart-less.
function buildFor(key){
  if (typeof Chart === 'undefined') return;
  if (key === 'ladder'){
    var g = HS_GUIDE.filter(function(x){ return x.year === _view.guideYear; })[0];
    lineChart('hs-ladder', HS_COMPANIES.map(function(c){ return { id: c.id, data: g.series[c.id] }; }), 'usd', 'Guided CapEx');
  } else if (key === 'qtr'){
    lineChart('hs-qtr', HS_COMPANIES.map(function(c){ return { id: c.id, data: HS_QUARTERLY[c.id] }; }), 'usd', 'CapEx in quarter');
  } else if (key === 'backlog'){
    var abs = _view.backView === 'abs';
    lineChart('hs-back', ['googl', 'amzn', 'msft'].map(function(id){
      return { id: id, data: abs ? HS_BACKLOG[id] : coverage(id) };
    }), abs ? 'usd' : 'x', abs ? 'Contracted backlog' : 'Coverage');
  }
}

function show(root, key){
  root.querySelectorAll('.hs-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ht') === key); });
  root.querySelectorAll('.hs-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ht') !== key); });
  buildFor(key);
}

// Re-render a single pane in place after a view toggle, then rebuild its chart.
function repaint(root, key, bodyFn){
  var pane = root.querySelector('.hs-pane[data-ht="' + key + '"]');
  if (!pane) return;
  pane.innerHTML = bodyFn();
  buildFor(key);
}

function init(){
  var root = document.querySelector('.hs');
  if (!root) return;
  if (!root._wired){
    root._wired = true;
    root.addEventListener('click', function(e){
      var tb = e.target.closest('.hs-tab');
      if (tb){ show(root, tb.getAttribute('data-ht')); return; }
      var yr = e.target.closest('[data-year]');
      if (yr){ _view.guideYear = yr.getAttribute('data-year'); repaint(root, 'ladder', ladderBody); return; }
      var bk = e.target.closest('[data-back]');
      if (bk){ _view.backView = bk.getAttribute('data-back'); repaint(root, 'backlog', backlogBody); return; }
    });
  }
  var active = root.querySelector('.hs-tab.active');
  show(root, active ? active.getAttribute('data-ht') : 'ladder');
}

export var hyperscalersIndustry = { html: html, init: init };
