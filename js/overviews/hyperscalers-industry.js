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
  HS_BACKLOG, HS_BACKLOG_NOTES, HS_ACCOUNTING,
  HS_DEP_GOOGL, HS_MSFT_CLOUD_GM, HS_DEP_NOTES,
  HS_YEARS, HS_YEAR_QTRS, HS_YEAR_DERIVED, HS_YEAR_PARTIAL, HS_YEAR_GUIDE, HS_QTR_RAMP,
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
    if (unit === 'x') return (Math.round(v * 100) / 100) + '×';
    if (unit === 'pct') return (Math.round(v * 10) / 10) + '%';
    return '$' + (Math.round(v * 10) / 10) + 'B';
  };
  var tick = function(v){ return unit === 'x' ? v + '×' : unit === 'pct' ? v + '%' : '$' + v + 'B'; };
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
        // A single series needs no legend box — the chart title names it.
        legend: { display: datasets.length > 1, position: 'top', align: 'start',
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
             ticks: { color: INK_MUTED, font: { size: 10.5, family: 'Inter' }, padding: 8, callback: tick } },
      },
    },
    plugins: [endLabels],
  });
}

// ─── Guidance band + forward-year wash ────────────────────────────────────────
// The equivalent of the Results tab's forward-zone shading: the in-progress year
// gets a light wash so a part-built bar is never read as a full one, and the
// company's own full-year guide is drawn as a translucent band across the
// column. Neutral grey on purpose — a guidance band must never wear a series
// colour, or it starts impersonating data.
var guideBand = {
  id: 'hsGuideBand',
  beforeDatasetsDraw: function(chart, args, opts){
    if (!opts || opts.fwdFrom == null) return;
    var x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
    var left = x.getPixelForTick(opts.fwdFrom) - (x.width / x.ticks.length) / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(124,134,148,0.06)';
    ctx.fillRect(left, a.top, a.right - left, a.bottom - a.top);
    ctx.restore();
  },
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || !opts.bands || !opts.bands.length) return;
    var x = chart.scales.x, y = chart.scales.y, ctx = chart.ctx;
    var slot = x.width / x.ticks.length;
    ctx.save();
    opts.bands.forEach(function(b){
      var cx = x.getPixelForTick(b.i);
      var w = slot * 0.74;
      var yHi = y.getPixelForValue(b.hi), yLo = y.getPixelForValue(b.lo);
      if (b.hi === b.lo){ yHi -= 1; yLo += 1; }   // point guide → a visible rule
      ctx.fillStyle = 'rgba(30,39,51,0.10)';
      ctx.fillRect(cx - w / 2, yHi, w, Math.max(2, yLo - yHi));
      ctx.strokeStyle = 'rgba(30,39,51,0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, yHi + 0.5); ctx.lineTo(cx + w / 2, yHi + 0.5);
      ctx.moveTo(cx - w / 2, yLo - 0.5); ctx.lineTo(cx + w / 2, yLo - 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();
  },
};

// ─── Small multiples: calendar-year CapEx, stacked by quarter ─────────────────
// One panel per company. Faceted rather than grouped because company×quarter in
// one frame cannot be coloured safely — see HS_QTR_RAMP for the tested result.
function yearChart(id, cid){
  var el = document.getElementById(id);
  if (!el || !el.offsetParent) return;
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }

  var ramp = HS_QTR_RAMP[cid];
  var datasets = [0, 1, 2, 3].map(function(q){
    return {
      label: 'Q' + (q + 1),
      data: HS_YEARS.map(function(y){ return HS_YEAR_QTRS[cid][y][q]; }),
      backgroundColor: ramp[q],
      borderColor: '#fff', borderWidth: { top: 2, right: 0, bottom: 0, left: 0 },
      borderRadius: q === 3 ? { topLeft: 3, topRight: 3 } : 0,
      stack: 'y',
    };
  });

  var bands = HS_YEARS.map(function(y, i){
    var g = HS_YEAR_GUIDE[cid][y];
    return g ? { i: i, lo: g[0], hi: g[1] } : null;
  }).filter(Boolean);

  // The axis must clear the GUIDE, not just the bars. In 2026 the bar is two
  // quarters tall while the guide is a full year — left to auto-scale, the band
  // lands off-canvas and the one comparison the chart exists to make disappears.
  var maxBar = Math.max.apply(null, HS_YEARS.map(function(y){
    return HS_YEAR_QTRS[cid][y].reduce(function(a, v){ return a + (v || 0); }, 0);
  }));
  var maxGuide = bands.reduce(function(m, b){ return Math.max(m, b.hi); }, 0);
  var headroom = Math.max(maxBar, maxGuide) * 1.08;

  _charts[id] = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: HS_YEARS, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      layout: { padding: { top: 4 } },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        hsGuideBand: { bands: bands, fwdFrom: HS_YEARS.indexOf('2026') },
        legend: { position: 'top', align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, color: '#7C8694',
                    font: { size: 10, family: 'Inter', weight: '600' }, padding: 9 } },
        tooltip: {
          backgroundColor: '#1E2733', padding: 9, cornerRadius: 6,
          boxWidth: 8, boxHeight: 8,
          titleFont: { size: 11, family: 'Inter' }, bodyFont: { size: 11, family: 'Inter' },
          callbacks: {
            title: function(items){ return co(cid).ticker + ' · ' + items[0].label; },
            label: function(c){
              if (c.raw == null) return null;
              var der = HS_YEAR_DERIVED[cid][c.label][c.datasetIndex];
              return c.dataset.label + ': $' + c.raw.toFixed(1) + 'B' + (der ? '  (derived)' : '');
            },
            footer: function(items){
              var y = items[0].label;
              var tot = HS_YEAR_QTRS[cid][y].reduce(function(a, v){ return a + (v || 0); }, 0);
              var g = HS_YEAR_GUIDE[cid][y];
              var s = 'Reported to date: $' + tot.toFixed(1) + 'B';
              if (g) s += '\nGuide: ' + (g[0] === g[1] ? '~$' + g[0] + 'B' : '$' + g[0] + '–' + g[1] + 'B');
              return s;
            },
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, border: { color: AXIS },
             ticks: { color: INK_MUTED, font: { size: 10.5, family: 'Inter' } } },
        y: { stacked: true, beginAtZero: true, suggestedMax: headroom,
             grid: { color: GRID, drawTicks: false }, border: { display: false },
             ticks: { color: INK_MUTED, font: { size: 10, family: 'Inter' }, padding: 6, maxTicksLimit: 5,
                      callback: function(v){ return '$' + v + 'B'; } } },
      },
    },
    plugins: [guideBand],
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

  var panels = HS_COMPANIES.map(function(c){
    var part = (HS_YEAR_PARTIAL[c.id] || {});
    var warn = Object.keys(part).length
      ? '<div class="hs-panel-warn">◍ ' + esc(part[Object.keys(part)[0]]) + '</div>' : '';
    return '<div class="hs-panel">' +
      '<div class="hs-panel-h">' + dot(c.id) + '<b>' + c.ticker + '</b>' +
        '<span class="hs-panel-s">' + esc(c.name) + '</span></div>' +
      '<div class="hs-panel-c"><canvas id="hs-yr-' + c.id + '"></canvas></div>' + warn +
    '</div>';
  }).join('');

  var yrRows = HS_COMPANIES.map(function(c){
    return [dot(c.id) + c.ticker].concat(HS_YEARS.map(function(y){
      var qs = HS_YEAR_QTRS[c.id][y];
      var tot = qs.reduce(function(a, v){ return a + (v || 0); }, 0);
      var g = HS_YEAR_GUIDE[c.id][y];
      var gs = g ? (g[0] === g[1] ? '~$' + g[0] + 'B' : '$' + g[0] + '–' + g[1] + 'B') : '—';
      return '$' + tot.toFixed(1) + 'B <span class="hs-sub">vs ' + gs + '</span>';
    }));
  });

  return '<p class="hs-lede">What was actually spent. The break is visible: through mid-2025 the four run together and low; after that they fan out.</p>' +
    sec('Calendar year, split by quarter') +
    '<div class="hs-card">' +
      '<div class="hs-chart-head"><span class="hs-chart-t">CapEx per calendar year, stacked by quarter</span>' +
        '<span class="hs-chart-u">US$B · shaded band = full-year guide</span></div>' +
      '<div class="hs-panels">' + panels + '</div>' +
      '<p class="hs-cap"><b>2026 is two quarters in</b> — the washed column holds only 1Q and 2Q actuals, with the guidance range drawn as the dashed band above them. ' +
      'For closed years the band shows where the final guide sat, so you can see the bar land inside it. ' +
      '<b>2023 is not shown:</b> no Amazon, Alphabet or Meta call in the corpus predates April 2024, so three of the four would be empty columns. ' +
      'Four quarters are derived rather than stated (Amazon 2Q24/3Q24/4Q25, Meta 1Q25) — marked in the tooltip and listed in the data file.</p>' +
      table(yrRows, [''].concat(HS_YEARS)) +
    '</div>' +
    sec('Every reported quarter') +
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

// ─── Tab 5 · Depreciation ─────────────────────────────────────────────────────
// Alphabet's numbers are shown as tiles + a table rather than forced into a
// chart: two annual points and three quarterly growth rates is not a series, and
// drawing it as one would imply a resolution the disclosure doesn't have. The
// one thing that IS a series — Microsoft's cloud gross margin — gets the chart.
function depreciationBody(){
  var tiles = HS_DEP_GOOGL.fy.map(function(y){
    return '<div class="hs-stat"><div class="hs-stat-v">$' + y.usd + 'B</div>' +
      '<div class="hs-stat-l">FY' + y.year + ' depreciation · <b>+' + y.growth + '%</b> YoY</div></div>';
  }).join('');

  var qrows = HS_DEP_GOOGL.qtr.map(function(q){
    return [q.q, q.usd == null ? null : '$' + q.usd.toFixed(1) + 'B', '<span class="hs-up">+' + q.growth + '%</span>'];
  });
  qrows.unshift(['FY2024', '$15.3B', '<span class="hs-up">+28%</span>']);
  qrows.push(['FY2025', '$21.1B', '<span class="hs-up">+38%</span>']);

  var srcs = HS_DEP_GOOGL.qtr.map(function(q){ return '<li><b>' + q.q + '</b> · ' + esc(q.src) + '</li>'; }).join('') +
    HS_DEP_GOOGL.fy.map(function(y){ return '<li><b>FY' + y.year + '</b> · ' + esc(y.src) + '</li>'; }).join('');

  var notes = HS_DEP_NOTES.map(function(n){
    return '<li>' + dot(n.id) + '<b>' + co(n.id).ticker + ' — ' + esc(n.head) + '.</b> ' + esc(n.body) + '</li>';
  }).join('');

  return '<p class="hs-lede">The bill for the build-out arrives as depreciation, and it is already landing. Only one of the four puts a number on it — which is itself worth knowing.</p>' +
    sec('Alphabet — the only quantified series') +
    '<div class="hs-card">' +
      '<div class="hs-stats">' + tiles + '</div>' +
      '<p class="hs-body" style="margin-top:12px">The growth rate accelerated every quarter it was disclosed — 31% → 35% → 41% — so the line is not just growing, it is growing faster. ' + esc(HS_DEP_GOOGL.forward) + '</p>' +
      table(qrows, ['Period', 'Depreciation', 'YoY growth']) +
      '<ul class="hs-src">' + srcs + '</ul>' +
    '</div>' +
    sec('Where it shows up — Microsoft Cloud gross margin') +
    '<div class="hs-card">' +
      '<div class="hs-chart-head"><span class="hs-chart-t">Microsoft Cloud gross margin</span>' +
        '<span class="hs-chart-u">% · reported actuals only</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-dep"></canvas></div>' +
      '<p class="hs-cap">Seven points of margin in nine quarters, attributed by management to "scaling our AI infrastructure" each time. Guides are excluded so the series is one kind of number; gaps are quarters where no absolute figure was stated. Axis does not start at zero — this is a compression, not a magnitude, chart.</p>' +
    '</div>' +
    sec('What the other two disclose instead') +
    '<div class="hs-card hs-card--warn"><ul class="hs-src">' + notes + '</ul></div>';
}

// ─── Tab registry + shell ─────────────────────────────────────────────────────
var TABS = [
  { key: 'ladder',  label: 'Guidance Ladder',    body: ladderBody },
  { key: 'qtr',     label: 'Quarterly CapEx',    body: quarterlyBody },
  { key: 'backlog', label: 'Backlog & Coverage', body: backlogBody },
  { key: 'acct',    label: 'Accounting',         body: accountingBody },
  { key: 'dep',     label: 'Depreciation',       body: depreciationBody },
];

function html(){
  var h = '<div class="hs">';
  h += '<div class="hs-head"><div class="hs-h-title">Hyperscaler AI CapEx &amp; Guidance</div>' +
    '<div class="hs-h-sub">Amazon · Alphabet · Meta · Microsoft — every revision dated to the call that made it, 2024–2026</div></div>';
  h += '<div class="hs-tabs">' + TABS.map(function(t, i){
    return '<button type="button" class="hs-tab' + (i === 0 ? ' active' : '') + '" data-ht="' + t.key + '">' +
      esc(t.label) + '</button>';
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
  } else if (key === 'dep'){
    lineChart('hs-dep', [{ id: 'msft', data: HS_MSFT_CLOUD_GM }], 'pct', 'Gross margin');
  }
  if (key === 'qtr'){
    HS_COMPANIES.forEach(function(c){ yearChart('hs-yr-' + c.id, c.id); });
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
