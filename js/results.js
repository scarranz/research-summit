// results.js — the "Results" engine: reported actuals vs Summit model, Street
// consensus and company guidance, per metric and period.
//
// EMBEDDABLE, not a standalone profile tab: renders INSIDE Deep Dive ▸ Evolution
// as the "Results" sub-tab (beside Call Prep). Datasets are hand-built per
// company (see results-data/amzn.js); the engine is fully generic. Periods can
// extend beyond the last reported quarter — forward periods carry the model's
// live projection and BBG consensus with no actual yet.
//
// LAYOUT (per SAB, Jul 2026): the sections are STACKED, not toggled — the
// reader scrolls from Top Line (revenue + every segment/revenue line with data,
// YoY-growth emphasis in % and $) straight into Margins & Profitability
// (op income / EBITDA / capex with margin % lines). Each section block carries
// its OWN metric pills, legend chips, chart, period slider, range analytics and
// Fiscal.ai-style transposed table. Fiscal UI refs: docs/references/fiscal-ai/.
//
// Wire-up (from a company's deep-dive module):
//   import { resultsHtml, initResults } from '../results.js';
//   ... pane html: resultsHtml('AMZN')          // '' when no dataset exists
//   ... when the pane becomes visible: requestAnimationFrame(initResults)

import { amznResults } from './results-data/amzn.js';
import { googlResults } from './results-data/googl.js';
import { googlSetup } from './results-data/googl-setup.js';

var RESULTS_DATA = {
  AMZN: amznResults,
  GOOGL: googlResults,
  GOOGL_SETUP: googlSetup
};

export function getResultsData(ticker){
  return RESULTS_DATA[ticker] || null;
}

// ─── Colors (match the portal/AVE conventions) ────────────────────────────────
var RS_ACT    = 'rgba(30,39,51,0.92)';    // navy — actual
var RS_SUMMIT = 'rgba(37,99,235,0.85)';   // accent blue — Summit model
var RS_CONS   = 'rgba(124,134,148,0.85)'; // mid gray — Street consensus
var RS_GUIDE  = 'rgba(62,90,130,0.18)';   // steel, translucent — guidance range
var RS_GREEN  = '#1E9E62', RS_RED = '#C0392B';
// Evolution block: one line per fiscal year — an ordered (ordinal) ramp of the
// portal blue, darkest = nearest year. Validated with the dataviz palette
// checker (monotone L, visible step gaps, light end ≥2:1 on white).
var EVO_RAMP = ['#1B3F94', '#2563EB', '#5E8BEC', '#93B1F0'];

// Global: dataset + view. Per-section (keyed by section key): metric, window,
// hidden series, chart instance. `evo` is the vintage-evolution block's state.
// `growth` (quarterly only): 'yoy' = vs the same quarter last year; 'qoq' = vs
// the previous reported quarter.
var _rs = { data: null, view: 'q', growth: 'yoy', sec: {}, evo: null, surp: null };

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

function rsView(){ return _rs.data.views[_rs.view]; }
function rsSecCfg(k){ return rsView().sections.filter(function(s){ return s.key === k; })[0]; }
// Sections declare their metrics in labeled groups (Totals / Segments / …);
// flatten for validation and default handling.
function rsSecGroups(cfg){ return cfg.groups || [{ label: '', keys: cfg.keys || [] }]; }
function rsSecKeys(cfg){ return rsSecGroups(cfg).reduce(function(a, g){ return a.concat(g.keys); }, []); }
function rsSt(k){
  if (!_rs.sec[k]) _rs.sec[k] = { metric: null, win: null, yr: null, chart: null,
    hidden: { act:false, summit:false, cons:false, guide:false, margin:false } };
  return _rs.sec[k];
}
function rsMetric(k){
  var st = rsSt(k), cfg = rsSecCfg(k);
  if (!st.metric || rsSecKeys(cfg).indexOf(st.metric) < 0) st.metric = cfg.defaultMetric;
  return rsView().metrics[st.metric];
}

function rsFmt(m, v){
  if (v == null) return '—';
  var neg = v < 0 ? '−' : '', a = Math.abs(v);
  if (m.unit === 'eps') return neg + '$' + a.toFixed(2);
  if (a >= 10000) return neg + '$' + (a/1000).toFixed(1) + 'B';
  return neg + '$' + Math.round(a).toLocaleString() + 'M';
}
function rsFmtD(m, v, dec){
  if (v == null) return '—';
  var sign = v >= 0 ? '+' : '−', a = Math.abs(v);
  if (m.unit === 'eps') return sign + '$' + a.toFixed(2);
  if (a >= 10000) return sign + '$' + (a/1000).toFixed(dec == null ? 1 : dec) + 'B';
  return sign + '$' + Math.round(a).toLocaleString() + 'M';
}
// Display scale for a metric: $B for AMZN-sized series, $M for SoFi-sized ones.
// Decided per metric (max |value| across every series) so a metric is always
// consistent with itself.
function rsScaleOf(m){
  var mx = 0;
  ['act', 'summit', 'cons', 'guideLo', 'guideHi'].forEach(function(k){
    (m[k] || []).forEach(function(v){ if (v != null) mx = Math.max(mx, Math.abs(v)); });
  });
  return mx >= 10000 ? 1000 : 1;
}
function rsSurp(act, ref){
  if (act == null || ref == null || !ref) return null;
  return (act - ref) / Math.abs(ref) * 100;
}
function rsPctHtml(s, dec){
  if (s == null) return '<span class="rs-ft-nil">—</span>';
  var up = s >= 0;
  return '<span style="color:' + (up ? RS_GREEN : RS_RED) + '">' + (up ? '+' : '−') + Math.abs(s).toFixed(dec == null ? 1 : dec) + '%</span>';
}
function rsGuideMid(m, i){ return (m.guideLo[i] == null || m.guideHi[i] == null) ? null : (m.guideLo[i] + m.guideHi[i]) / 2; }
// Axis tick: negatives as −$50B, not $-50B; whole dollars only (zoomed bounds
// arrive fractional — $135.13111B would eat the chart's left margin). `div` is
// the metric's display scale from rsScaleOf (1000 → $B axis, 1 → $M axis).
function rsTick(v, unit, div){
  var s = v < 0 ? '−' : '', a = Math.abs(v);
  if (unit === 'eps') return s + '$' + (+a.toFixed(2));
  return s + '$' + Math.round(a) + (div === 1000 ? 'B' : 'M');
}
function rsWin(k, m){
  var st = rsSt(k), n = m.periods.length;
  if (!st.win || st.win[1] >= n || st.win[0] < 0){ st.win = [0, n - 1]; }
  return st.win;
}
function rsRefsFor(m){
  function any(a){ return !!a && a.some(function(v){ return v != null; }); }
  return { summit: any(m.summit), cons: any(m.cons), guide: any(m.guideLo) };
}
// Quick-range presets: windows anchored to the LAST REPORTED period (lr) —
// "Last 4Q" = the four most recent prints, "Forward" = last print + estimates.
function rsPresetWin(m, key){
  var n = m.periods.length, lr = -1;
  for (var i = 0; i < n; i++) if (m.act[i] != null) lr = i;
  if (lr < 0) lr = n - 1;
  switch (key){
    case 'l4':  return [Math.max(0, lr - 3), lr];
    case 'l8':  return [Math.max(0, lr - 7), lr];
    case 'l3':  return [Math.max(0, lr - 2), lr];
    case 'l5':  return [Math.max(0, lr - 4), lr];
    case 'rep': return [0, lr];
    case 'fwd': return [Math.max(0, lr), n - 1];
    default:    return [0, n - 1];                     // 'all'
  }
}

// ─── Growth & margin series ───────────────────────────────────────────────────
// Lag for growth math: quarterly YoY = 4 quarters back, quarterly QoQ = 1 back,
// annual always 1 year back.
function rsLook(){ return _rs.view === 'q' ? (_rs.growth === 'qoq' ? 1 : 4) : 1; }
function rsGrowLabel(){ return (_rs.view === 'q' && _rs.growth === 'qoq') ? 'QoQ growth' : 'YoY growth'; }
// Actual-only growth: both endpoints must be REPORTED. The Actual row never
// shows growth into estimate periods — there is no observation there.
function rsActGrowthPct(m, i){
  var k = rsLook(); if (i - k < 0) return null;
  if (m.act[i] == null || m.act[i - k] == null || !m.act[i - k]) return null;
  return (m.act[i] - m.act[i - k]) / Math.abs(m.act[i - k]) * 100;
}
function rsActGrowthDollar(m, i){
  var k = rsLook(); if (i - k < 0) return null;
  if (m.act[i] == null || m.act[i - k] == null) return null;
  return m.act[i] - m.act[i - k];
}
function rsMarginArr(m, series){
  if (!m.marginOf || m.unit === 'eps') return null;
  var d = rsView().metrics[m.marginOf]; if (!d) return null;
  var dmap = {};
  d.periods.forEach(function(p, j){ dmap[p] = d.act[j] != null ? d.act[j] : d.summit[j]; });
  return m.periods.map(function(p, i){
    var num = m[series][i], den = dmap[p];
    if (num == null || den == null || !den) return null;
    return num / den * 100;
  });
}
// YoY growth of a REFERENCE series (summit/cons): what growth that estimate
// implies — measured against the reported base when it exists (else the same
// series a year back), so a forward estimate reads as "growth vs last year's
// actual", the way an analyst quotes it.
function rsRefGrowthPct(m, series, i){
  var k = rsLook(); if (i - k < 0) return null;
  var a = m[series][i];
  var b = m.act[i - k] != null ? m.act[i - k] : m[series][i - k];
  if (a == null || b == null || !b) return null;
  return (a - b) / Math.abs(b) * 100;
}
function rsRefGrowthDollar(m, series, i){
  var k = rsLook(); if (i - k < 0) return null;
  var a = m[series][i];
  var b = m.act[i - k] != null ? m.act[i - k] : m[series][i - k];
  if (a == null || b == null) return null;
  return a - b;
}

// ─── Embeddable HTML ──────────────────────────────────────────────────────────

export function resultsHtml(ticker){
  var data = getResultsData(ticker);
  _rs.data = data;
  if (!data) return '';
  _rs.view = 'q';
  _rs.growth = 'yoy';
  _rs.sec = {};
  _rs.evo = null;
  return rsBody();
}

function rsBody(){
  var d = _rs.data;
  var h = '<div class="rs-wrap">';
  h += '<p class="ov-lede">' + esc(d.intro) + '</p>';
  h += '<div class="rs-toprow"><div class="rs-views">' + Object.keys(d.views).map(function(k){
    return '<button type="button" class="rs-view' + (k === _rs.view ? ' active' : '') + '" data-rsview="' + k + '">' + esc(d.views[k].label) + '</button>';
  }).join('') + '</div>' +
  // Growth-basis toggle — quarterly only (annual growth is always year over year).
  '<div class="rs-views" id="rsGrowMode"' + (_rs.view === 'q' ? '' : ' hidden') + '>' +
    '<button type="button" class="rs-view' + (_rs.growth === 'yoy' ? ' active' : '') + '" data-rsgrow="yoy" title="vs the same quarter last year">YoY</button>' +
    '<button type="button" class="rs-view' + (_rs.growth === 'qoq' ? ' active' : '') + '" data-rsgrow="qoq" title="vs the previous reported quarter">QoQ</button>' +
  '</div></div>';
  h += '<div id="rsBlocks">' + rsBlocksHtml() + '</div>';
  h += '<div class="ov-foot" id="rsViewNote">' + esc(rsView().note || '') + '</div>';
  h += '<div class="ov-foot">' + esc(d.source) + '</div>';
  h += '</div>';
  return h;
}

// All section blocks, stacked. Each block owns its pills/legend/chart/slider/
// analytics/table, suffixed by the section key.
function rsBlocksHtml(){
  return rsView().sections.map(function(cfg){
    var k = cfg.key, m = rsMetric(k);
    var pres = _rs.view === 'q'
      ? [['l4', 'Last 4Q'], ['l8', 'Last 8Q'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']]
      : [['l3', 'Last 3Y'], ['l5', 'Last 5Y'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']];
    var h = '<div class="rs-block" data-rsblock="' + k + '">';
    h += '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.label) + '</div>' +
      '<select class="rs-msel" aria-label="Metric">' + rsSelectHtml(k) + '</select>' +
      '<div class="rs-quick"><span class="rs-quick-l">Range</span>' +
        pres.map(function(p){ return '<button type="button" class="rs-preset" data-rsrange="' + p[0] + '">' + p[1] + '</button>'; }).join('') +
      '</div></div>';
    h += '<div class="ave-leg" id="rsLegend-' + k + '">' + rsLegendHtml(k, m) + '</div>';
    h += '<div class="ov-chart-card">' +
      '<div class="ov-chart-t" id="rsChartT-' + k + '"></div>' +
      '<div class="ov-chart-wrap ovs-tall"><canvas id="rsChart-' + k + '"></canvas></div>' +
    '</div>';
    h += '<div class="sg-controls">' +
      '<div class="sg-slider">' +
        '<div class="sg-track"><div class="sg-fill" id="rsFill-' + k + '"></div></div>' +
        '<div class="rs-ticks" id="rsTicks-' + k + '"></div>' +
        '<input type="range" id="rsMin-' + k + '" min="0" max="1" value="0" step="1" aria-label="Start period">' +
        '<input type="range" id="rsMax-' + k + '" min="0" max="1" value="1" step="1" aria-label="End period">' +
      '</div>' +
      '<div class="sg-ends"><span id="rsEnd0-' + k + '"></span><span id="rsEnd1-' + k + '"></span></div>' +
    '</div>';
    h += '<div class="rs-tablewrap" id="rsTable-' + k + '"></div>';
    h += '<div class="ov-foot" id="rsNote-' + k + '"></div>';
    h += '</div>';
    return h;
  }).join('');
}

// Structured metric picker — a dropdown grouped by the section's groups
// (Totals / Segments / Revenue lines / …) instead of a wall of pills.
function rsSelectHtml(k){
  var view = rsView(), cfg = rsSecCfg(k), st = rsSt(k);
  rsMetric(k);                                        // ensure st.metric is valid
  return rsSecGroups(cfg).map(function(g){
    var opts = g.keys.map(function(mk){
      return '<option value="' + mk + '"' + (mk === st.metric ? ' selected' : '') + '>' + esc(view.metrics[mk].label) + '</option>';
    }).join('');
    return g.label ? '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>' : opts;
  }).join('');
}

function rsLegendHtml(k, m){
  var has = rsRefsFor(m), st = rsSt(k);
  var isTop = k === 'top';
  function chip(key, color, label, line){
    var off = st.hidden[key];
    var sw = line ? '<span class="rs-leg-line" style="background:' + color + '"></span>' : '<span class="ave-leg-act" style="background:' + color + '"></span>';
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsleg="' + key + '" title="Show / hide">' + sw + esc(label) + '</button>';
  }
  var h = chip('act', RS_ACT, 'Actual');
  if (has.summit) h += chip('summit', RS_SUMMIT, 'Summit model');
  if (has.cons)   h += chip('cons', RS_CONS, 'Consensus');
  if (has.guide)  h += chip('guide', 'rgba(62,90,130,0.3)', 'Guidance range');
  if (!isTop && m.marginOf && m.unit !== 'eps') h += chip('margin', RS_ACT, esc(m.marginLabel || 'margin') + ' %', true);
  h += '<span class="tech-leg-i" style="margin-left:auto">▲ beat · ▼ miss · click a chip to hide it</span>';
  return h;
}

// ─── Chart (per section) ──────────────────────────────────────────────────────

function rsBuildChart(k){
  var m = rsMetric(k), st = rsSt(k);
  var el = document.getElementById('rsChart-' + k);
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var has = rsRefsFor(m);
  var isTop = k === 'top';
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var dec = m.unit === 'eps' ? 2 : 1;
  var div = rsScaleOf(m);
  var scale = function(v){ return v == null ? null : (m.unit === 'eps' ? v : v/div); };
  var unitLbl = m.unit === 'eps' ? '$' : (div === 1000 ? '$B' : '$M');
  function sl(a){ return a.slice(lo, hi + 1); }

  var datasets = [], needY2 = false;
  if (has.guide && !st.hidden.guide){
    datasets.push({ label: 'Guidance range', type: 'bar',
      data: sl(m.periods.map(function(_, i){ return (m.guideLo[i] == null || m.guideHi[i] == null) ? null : [scale(m.guideLo[i]), scale(m.guideHi[i])]; })),
      backgroundColor: RS_GUIDE, borderColor: 'rgba(62,90,130,0.45)', borderWidth: 1, borderSkipped: false,
      barPercentage: 0.98, categoryPercentage: 0.98, grouped: false, order: 10 });
  }
  if (!st.hidden.act) datasets.push({ label: 'Actual', data: sl(m.act.map(scale)), backgroundColor: RS_ACT, borderRadius: 3, maxBarThickness: 26, order: 3 });
  if (has.summit && !st.hidden.summit) datasets.push({ label: 'Summit model', data: sl(m.summit.map(scale)), backgroundColor: RS_SUMMIT, borderRadius: 3, maxBarThickness: 26, order: 4 });
  if (has.cons && !st.hidden.cons)     datasets.push({ label: 'Consensus', data: sl(m.cons.map(scale)), backgroundColor: RS_CONS, borderRadius: 3, maxBarThickness: 26, order: 5 });

  if (!isTop && !st.hidden.margin && m.marginOf && m.unit !== 'eps'){
    var ma = rsMarginArr(m, 'act'), ms = rsMarginArr(m, 'summit'), mc = rsMarginArr(m, 'cons');
    if (ma && ma.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (actual)', type: 'line', yAxisID: 'y2', data: sl(ma),
        borderColor: 'rgba(30,39,51,0.9)', backgroundColor: 'rgba(30,39,51,0.9)', borderWidth: 2,
        pointRadius: 2.5, tension: 0.25, spanGaps: true, order: 1 });
    }
    if (ms && ms.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (Summit)', type: 'line', yAxisID: 'y2', data: sl(ms),
        borderColor: RS_SUMMIT, backgroundColor: RS_SUMMIT, borderWidth: 2, borderDash: [5, 4],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
    if (mc && mc.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (consensus)', type: 'line', yAxisID: 'y2', data: sl(mc),
        borderColor: 'rgba(124,134,148,0.9)', backgroundColor: 'rgba(124,134,148,0.9)', borderWidth: 2, borderDash: [2, 3],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
  }

  var tEl = document.getElementById('rsChartT-' + k);
  if (tEl) tEl.innerHTML = esc(m.label) + ' — actual vs expectations <span>(' + unitLbl + ' per period · ' + (isTop ? '' : 'margin lines on the right axis · ') + 'hover a period for every series)</span>';

  var scales = {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
      callback: function(v){ return rsTick(v, m.unit, div); } } }
  };
  if (st.yr){ scales.y.min = st.yr[0]; scales.y.max = st.yr[1]; }
  if (needY2) scales.y2 = { position: 'right', grid: { display: false },
    ticks: { font: { size: 11 }, callback: function(v){ return v + '%'; } } };

  st.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: sl(m.periods), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      // Period-wise hover: one tooltip listing EVERY series at that period
      // (guidance range, actual, both estimates with their surprise, margins).
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx){
              var i = ctx.dataIndex + lo;
              if (ctx.dataset.label === 'Guidance range'){
                return 'Guidance: ' + rsFmt(m, m.guideLo[i]) + ' – ' + rsFmt(m, m.guideHi[i]);
              }
              if (ctx.dataset.yAxisID === 'y2'){
                return ctx.dataset.label + ': ' + (ctx.parsed.y == null ? '—' : ctx.parsed.y.toFixed(1) + '%');
              }
              var raw = { 'Actual': m.act, 'Summit model': m.summit, 'Consensus': m.cons }[ctx.dataset.label];
              var line = ctx.dataset.label + ': ' + rsFmt(m, raw ? raw[i] : null);
              if (ctx.dataset.label !== 'Actual' && raw && raw[i] != null && m.act[i] != null){
                var s = rsSurp(m.act[i], raw[i]);
                line += '  (actual ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(dec) + '% · ' + rsFmtD(m, m.act[i] - raw[i]) + ')';
              }
              return line;
            }
          }
        }
      },
      scales: scales
    }
  });

  rsSyncSlider(k, m);
  rsRenderTable(k, m);
  rsWireBrush(k, el, st.chart, lo);
  var n1 = document.getElementById('rsNote-' + k); if (n1) n1.textContent = m.note || '';
  var leg = document.getElementById('rsLegend-' + k); if (leg) leg.innerHTML = rsLegendHtml(k, m);
}

// ─── Drag-to-zoom brush (both axes) ───────────────────────────────────────────
// Drag horizontally across the chart area to window that stretch of periods;
// drag vertically starting ON THE Y-AXIS STRIP (left of the plot) to set the
// y-axis range — a translucent selection box tracks either drag. Double-click
// resets both. `onX(i1, i2)` receives chart-relative period indexes; `onY(lo,
// hi)` receives axis values; pass onX = null for charts with no x-windowing.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var vertical = (ev.clientX - r0.left) < area.left || !onX;
    var startX = ev.clientX, startY = ev.clientY;
    var box = document.createElement('div');
    box.className = 'rs-brush';
    if (vertical){
      box.style.left = (r0.left - w0.left + area.left) + 'px';
      box.style.width = (area.right - area.left) + 'px';
    } else {
      box.style.top = (r0.top - w0.top) + 'px';
      box.style.height = r0.height + 'px';
    }
    wrap.appendChild(box);
    function place(cx, cy){
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
    function onMove(e2){ place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      box.remove();
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;   // a click, not a drag
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(clientX){
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        }
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

function rsWireBrush(k, el, chart, lo){
  rsAttachBrush(el, chart,
    function(a, b){ rsSt(k).win = [lo + a, lo + b]; rsBuildChart(k); },
    function(v1, v2){ rsSt(k).yr = [v1, v2]; rsBuildChart(k); },
    function(){ var st = rsSt(k); st.win = null; st.yr = null; rsBuildChart(k); });
}

// ─── Period-window slider ─────────────────────────────────────────────────────

function rsSyncSlider(k, m){
  var mn = document.getElementById('rsMin-' + k), mx = document.getElementById('rsMax-' + k);
  var fill = document.getElementById('rsFill-' + k), e0 = document.getElementById('rsEnd0-' + k), e1 = document.getElementById('rsEnd1-' + k);
  if (!mn || !mx) return;
  var n = m.periods.length, w = rsWin(k, m);
  mn.max = n - 1; mx.max = n - 1;
  mn.value = w[0]; mx.value = w[1];
  if (fill){ fill.style.left = (w[0] / (n - 1) * 100) + '%'; fill.style.width = ((w[1] - w[0]) / (n - 1) * 100) + '%'; }
  if (e0) e0.textContent = m.periods[w[0]];
  if (e1) e1.textContent = m.periods[w[1]];
  // One dot per available period along the track — filled when inside the
  // selected window, hollow-ish for forward (estimate) periods.
  var ticks = document.getElementById('rsTicks-' + k);
  if (ticks){
    var h = '';
    for (var i = 0; i < n; i++){
      var cls = 'rs-tick' + (i >= w[0] && i <= w[1] ? ' on' : '') + (m.act[i] == null ? ' est' : '');
      h += '<span class="' + cls + '" style="left:' + (i / (n - 1) * 100) + '%" title="' + esc(m.periods[i]) + '"></span>';
    }
    ticks.innerHTML = h;
  }
}

// ─── Detail table — TRANSPOSED, Fiscal.ai-style spreadsheet ───────────────────
// (The "Range analytics" KPI tiles that used to sit above the table were
// removed Jul 28 per SAB — the table's sticky "Range record" column carries
// the same read.)

function rsRenderTable(k, m){
  var el = document.getElementById('rsTable-' + k);
  if (!el) return;
  var has = rsRefsFor(m);
  var isTop = k === 'top';
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var dec = m.unit === 'eps' ? 2 : 1;
  var div = rsScaleOf(m);
  var idx = [], est = [];
  for (var i = lo; i <= hi; i++){ idx.push(i); est.push(m.act[i] == null); }

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    return (v/div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  function pctDollar(p, d){
    if (p == null) return '<span class="rs-ft-nil">—</span>';
    return rsPctHtml(p, dec) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }

  // ── Range-summary helpers: the right-hand "how close are we over time"
  //    column, computed over the selected window. ──
  function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0) / a.length; }
  function sgn(v, dec, suf){ return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(dec == null ? 1 : dec) + (suf || '%'); }
  function sumGrowth(fn){
    var g = []; idx.forEach(function(i){ var v = fn(i); if (v != null) g.push(v); });
    return g.length ? 'avg ' + sgn(avg(g)) : '';
  }
  // Actual-centric: how the ACTUAL came in vs this reference — ▲ = the actual
  // beat the estimate (matches the surprise cells and the beat/miss legend).
  function sumSurprise(arr){
    var pcts = [], dols = [], above = 0, below = 0;
    idx.forEach(function(i){
      if (arr[i] == null || m.act[i] == null || !arr[i]) return;
      var dv = m.act[i] - arr[i];
      pcts.push(dv / Math.abs(arr[i]) * 100); dols.push(dv);
      if (dv >= 0) above++; else below++;
    });
    if (!pcts.length) return '';
    var ap = avg(pcts);
    return above + '▲ · ' + below + '▼<br><span class="rs-ft-dim">actual avg <span style="color:' + (ap >= 0 ? RS_GREEN : RS_RED) + '">' + sgn(ap) + '</span> · ' + rsFmtD(m, avg(dols)) + '</span>';
  }
  function sumMargin(arr){
    var v = []; idx.forEach(function(i){ if (arr && arr[i] != null) v.push(arr[i]); });
    return v.length ? 'avg ' + avg(v).toFixed(1) + '%' : '';
  }
  // CAGR of the REPORTED series only — an estimate is not an observation.
  // Annualization depends on the VIEW (4 periods/yr in quarterly), never on the
  // YoY/QoQ growth lag.
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / (_rs.view === 'q' ? 4 : 1);
    return years > 0 ? 'CAGR ' + sgn((Math.pow(last / first, 1 / years) - 1) * 100) : '';
  }
  function sumGuide(){
    var ab = 0, wi = 0, be = 0, mids = [];
    idx.forEach(function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return;
      if (m.act[i] > m.guideHi[i]) ab++; else if (m.act[i] < m.guideLo[i]) be++; else wi++;
      var mid = rsGuideMid(m, i); if (mid) mids.push((m.act[i] - mid) / Math.abs(mid) * 100);
    });
    if (!(ab + wi + be)) return '';
    return ab + '▲ · ' + wi + '⊙ · ' + be + '▼<br><span class="rs-ft-dim">avg vs mid ' + sgn(avg(mids)) + '</span>';
  }

  var h = '<div class="rs-ft-cap">' + (m.unit === 'eps' ? 'US$ per share' : (div === 1000 ? 'US$ billions' : 'US$ millions')) + ' · <span class="rs-ft-e">E</span> = estimate, no actual reported yet · the right column summarizes the selected range: how the actual has come in vs each estimate (▲ = beat)</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  idx.forEach(function(i, c){
    h += '<th class="' + (est[c] ? 'rs-ft-este' : '') + '">' + esc(m.periods[i]) + (est[c] ? ' <span class="rs-ft-e">E</span>' : '') + '</th>';
  });
  h += '<th class="rs-ft-s">Range record</th>';
  h += '</tr></thead><tbody>';

  function row(label, cellFn, cls, sum){
    var classes = cls.split(' ').map(function(c){ return 'rs-ft-' + c; }).join(' ');
    var r = '<tr class="' + classes + '"><td class="rs-ft-h">' + label + '</td>';
    idx.forEach(function(i, c){ r += '<td class="' + (est[c] ? 'rs-ft-este' : '') + '">' + cellFn(i) + '</td>'; });
    r += '<td class="rs-ft-s">' + (sum || '') + '</td>';
    return r + '</tr>';
  }

  var showMargin = m.marginOf && m.unit !== 'eps' && !isTop;

  // Actual: value → YoY/QoQ growth (→ margin).
  var growLbl = rsGrowLabel();
  var maA = showMargin ? rsMarginArr(m, 'act') : null;
  h += row('Actual', function(i){ return m.act[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(m.act[i]) + '</b>'; }, 'main nb', sumCagr());
  h += row(growLbl, function(i){ return pctDollar(rsActGrowthPct(m, i), rsActGrowthDollar(m, i)); }, showMargin ? 'sub nb' : 'sub', sumGrowth(rsActGrowthPct.bind(null, m)));
  if (showMargin) h += row(esc(m.marginLabel || 'margin'), function(i){ return maA && maA[i] != null ? maA[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(maA));

  // Reference series (Summit / Consensus): value → YoY growth → surprise (→ margin).
  [{ on: has.summit, series: 'summit', label: 'Summit model' },
   { on: has.cons,   series: 'cons',   label: 'Consensus' }].forEach(function(r){
    if (!r.on) return;
    var s = r.series;
    var mm = showMargin ? rsMarginArr(m, s) : null;
    h += row(r.label, function(i){ return num(m[s][i]); }, 'main nb', '');
    h += row(growLbl, function(i){ return pctDollar(rsRefGrowthPct(m, s, i), rsRefGrowthDollar(m, s, i)); }, 'sub nb',
      sumGrowth(function(i){ return rsRefGrowthPct(m, s, i); }));
    h += row('surprise', function(i){ return (m.act[i] == null || m[s][i] == null) ? '<span class="rs-ft-nil">—</span>' : pctDollar(rsSurp(m.act[i], m[s][i]), m.act[i] - m[s][i]); },
      mm ? 'sub nb' : 'sub', sumSurprise(m[s]));
    if (mm) h += row(esc(m.marginLabel || 'margin'), function(i){ return mm[i] != null ? mm[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(mm));
  });

  if (has.guide){
    h += row('Guidance', function(i){ return m.guideLo[i] == null ? '<span class="rs-ft-nil">—</span>' : num(m.guideLo[i]) + '–' + num(m.guideHi[i]); }, 'main nb', '');
    h += row('actual vs range', function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return '<span class="rs-ft-nil">—</span>';
      var mid = rsGuideMid(m, i), d = mid == null ? null : m.act[i] - mid;
      var word;
      if (m.act[i] > m.guideHi[i]) word = '<span style="color:' + RS_GREEN + '">above</span>';
      else if (m.act[i] < m.guideLo[i]) word = '<span style="color:' + RS_RED + '">below</span>';
      else word = '<span style="color:var(--mu)">within</span>';
      return word + (d == null ? '' : ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + ' vs mid</span>');
    }, 'sub', sumGuide());
  }

  h += '</tbody></table></div>';
  el.innerHTML = h;

  var tb = el.querySelector('table'), lastCol = -1;
  function colCells(ci){ return tb.querySelectorAll('tr > *:nth-child(' + (ci + 1) + ')'); }
  tb.onmouseover = function(e){
    var c = e.target.closest('td,th'); if (!c || c.cellIndex === lastCol) return;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = c.cellIndex;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.add('colhl'); });
  };
  tb.onmouseleave = function(){
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = -1;
  };
}

// ─── Estimate evolution — the annual forecast ACROSS model snapshots ──────────
// Its OWN sub-tab beside Results (same row: Call Prep · Results · Estimate
// Evolution · …), embedded via resultsEvoHtml(ticker) + initResultsEvo().
// One line per fiscal year across the saved snapshots: solid = Summit, dashed =
// the BBG consensus stored inside the model at the same date. Annual by nature
// (no Quarterly/Annual toggle). Dataset shape: `evolution` in
// results-data/<ticker>.js.

function rsEvo(){ return _rs.data ? _rs.data.evolution : null; }
function rsEvoSecCfg(k){ return rsEvo().sections.filter(function(s){ return s.key === k; })[0]; }
function rsEvoKeys(cfg){ return (cfg.groups || []).reduce(function(a, g){ return a.concat(g.keys); }, []); }
function rsEvoSt(k){
  if (!_rs.evo) _rs.evo = { sec: {} };
  if (!_rs.evo.sec[k]) _rs.evo.sec[k] = { metric: null, mode: 'usd', yr: null, chart: null, hidden: {} };
  return _rs.evo.sec[k];
}
function rsEvoMetric(k){
  var cfg = rsEvoSecCfg(k), st = rsEvoSt(k);
  if (!st.metric || rsEvoKeys(cfg).indexOf(st.metric) < 0) st.metric = cfg.defaultMetric;
  return rsEvo().metrics[st.metric];
}
// The % view of a metric for one source & fiscal year, across vintages.
// Top Line → IMPLIED YoY GROWTH: what growth each snapshot's estimate implies
// vs the prior fiscal year AS KNOWN AT THAT SNAPSHOT (chained within the
// vintage; the first year chains to `prior` — the vintage's own estimate while
// the year was open, the reported actual once closed). Profitability → MARGIN
// over the `marginOf` metric, same source and same vintage (a margin built
// from one snapshot's numerator and another's denominator would be fiction).
function rsEvoPct(k, m, src, yi){
  var arr = m[src] ? m[src][yi] : null;
  if (!arr) return null;
  if (k === 'top'){
    return arr.map(function(cur, vi){
      var base = yi === 0
        ? (m.prior && m.prior[src] ? m.prior[src][vi] : null)
        : (m[src][yi - 1] ? m[src][yi - 1][vi] : null);
      if (cur == null || base == null || !base) return null;
      return (cur - base) / Math.abs(base) * 100;
    });
  }
  if (!m.marginOf) return null;
  var d = rsEvo().metrics[m.marginOf];
  var den = d && d[src] ? d[src][yi] : null;
  if (!den) return null;
  return arr.map(function(v, vi){
    if (v == null || den[vi] == null || !den[vi]) return null;
    return v / den[vi] * 100;
  });
}
function rsEvoPctLabel(k, m){ return k === 'top' ? 'implied YoY growth' : (m.marginLabel || 'margin'); }
// Display scale for an evolution metric (nested per-year arrays): $B or $M.
function rsEvoScaleOf(m){
  var mx = 0;
  ['summit', 'cons'].forEach(function(k){
    (m[k] || []).forEach(function(row){ (row || []).forEach(function(v){ if (v != null) mx = Math.max(mx, Math.abs(v)); }); });
  });
  return mx >= 10000 ? 1000 : 1;
}
// Revision between two snapshot values, read left → right. Dollars always;
// percent only when the base is non-zero and the sign holds (an FCF forecast
// flipping negative has no meaningful percent change).
function rsRevHtml(m, prev, cur){
  if (prev == null || cur == null) return '<span class="rs-ft-nil">—</span>';
  var d = cur - prev;
  var h = '<span style="color:' + (d >= 0 ? RS_GREEN : RS_RED) + '">' + rsFmtD(m, d) + '</span>';
  if (prev !== 0 && (prev > 0) === (cur > 0)){
    h += ' <span class="rs-ft-dim">· ' + (d >= 0 ? '+' : '−') + Math.abs(d / Math.abs(prev) * 100).toFixed(1) + '%</span>';
  }
  return h;
}
// Revision of a % series, in percentage points.
function rsRevPp(prev, cur){
  if (prev == null || cur == null) return '<span class="rs-ft-nil">—</span>';
  var d = cur - prev;
  return '<span style="color:' + (d >= 0 ? RS_GREEN : RS_RED) + '">' + (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' pp</span>';
}

// Embeddable pane html for the Estimate Evolution sub-tab ('' if the ticker's
// dataset has no `evolution` block). Mirrors the Results layout: stacked
// section blocks (Top Line — growth-focused · Profitability — with margins),
// each with its own metric select, US$/% display toggle, legend, chart, table.
export function resultsEvoHtml(ticker){
  var data = getResultsData(ticker);
  if (!data || !data.evolution) return '';
  _rs.data = data;
  _rs.evo = null;
  _rs.surp = null;
  var ev = data.evolution;
  var h = '<div class="rs-wrap" id="rsEvoWrap">';
  h += '<p class="ov-lede">' + esc(ev.intro || '') + '</p>';
  h += ev.sections.map(function(cfg){ return rsEvoBlockHtml(cfg.key); }).join('');
  h += '<div class="ov-foot">' + esc(ev.note || '') + '</div>';
  // Generic Actuals-vs-Estimates surprise history at the bottom (opt-out via
  // dataset `surprise: false` — SoFi keeps its richer bespoke block).
  if (data.surprise !== false && rsSurpGroups().length) h += rsSurpBlockHtml();
  h += '</div>';
  return h;
}

function rsEvoBlockHtml(k){
  var cfg = rsEvoSecCfg(k), m = rsEvoMetric(k);
  var h = '<div class="rs-block" data-rsevo="' + k + '">';
  h += '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.label) + '</div>' +
    '<select class="rs-msel rs-esel" aria-label="Metric">' + rsEvoSelectHtml(k) + '</select>' +
    '<div class="rs-views" id="rsEvoMode-' + k + '">' + rsEvoModeHtml(k, m) + '</div></div>';
  h += '<div class="ave-leg" id="rsEvoLegend-' + k + '">' + rsEvoLegendHtml(k, m) + '</div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsEvoChartT-' + k + '"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsEvoChart-' + k + '"></canvas></div>' +
  '</div>';
  h += '<div class="rs-tablewrap" id="rsEvoTable-' + k + '"></div>';
  h += '<div class="ov-foot" id="rsEvoNote-' + k + '"></div>';
  h += '</div>';
  return h;
}

// US$ / % display toggle (reuses the .rs-views pill styling). Top Line's %
// is the implied-YoY-growth view; Profitability's is the margin view (hidden
// when the metric declares no marginOf).
function rsEvoModeHtml(k, m){
  var st = rsEvoSt(k);
  if (k !== 'top' && !m.marginOf){ st.mode = 'usd'; return ''; }
  return '<button type="button" class="rs-view' + (st.mode === 'usd' ? ' active' : '') + '" data-rsevmode="usd">US$B</button>' +
    '<button type="button" class="rs-view' + (st.mode === 'pct' ? ' active' : '') + '" data-rsevmode="pct">' +
    (k === 'top' ? 'YoY growth %' : 'Margin %') + '</button>';
}

function rsEvoSelectHtml(k){
  var ev = rsEvo(), cfg = rsEvoSecCfg(k), st = rsEvoSt(k);
  rsEvoMetric(k);                                      // ensure st.metric is valid
  return cfg.groups.map(function(g){
    var opts = g.keys.map(function(mk){
      return '<option value="' + mk + '"' + (mk === st.metric ? ' selected' : '') + '>' + esc(ev.metrics[mk].label) + '</option>';
    }).join('');
    return '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>';
  }).join('');
}

function rsEvoLegendHtml(k, m){
  var ev = rsEvo(), st = rsEvoSt(k);
  var h = ev.years.map(function(y, i){
    var off = st.hidden['y' + y];
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsevleg="y' + y + '" title="Show / hide">' +
      '<span class="ave-leg-act" style="background:' + EVO_RAMP[i % EVO_RAMP.length] + '"></span>FY' + esc(y) + '</button>';
  }).join('');
  h += '<button type="button" class="rs-leg' + (st.hidden.summit ? ' off' : '') + '" data-rsevleg="summit" title="Show / hide">' +
    '<span class="rs-leg-line" style="background:var(--navy)"></span>Summit (solid)</button>';
  if (m.cons){
    h += '<button type="button" class="rs-leg' + (st.hidden.cons ? ' off' : '') + '" data-rsevleg="cons" title="Show / hide">' +
      '<span class="rs-leg-dash" style="color:var(--navy)"></span>Consensus (dashed)</button>';
  }
  h += '<span class="tech-leg-i" style="margin-left:auto">one line per fiscal year · click a chip to hide it</span>';
  return h;
}

function rsBuildEvo(k){
  var ev = rsEvo();
  if (!ev) return;
  var st = rsEvoSt(k), m = rsEvoMetric(k);
  var el = document.getElementById('rsEvoChart-' + k);
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var pct = st.mode === 'pct';
  var div = rsEvoScaleOf(m);
  var scale = function(v){ return v == null ? null : v / div; };
  function series(src, yi){
    if (pct) return rsEvoPct(k, m, src, yi);
    var a = m[src] ? m[src][yi] : null;
    return a ? a.map(scale) : null;
  }

  var datasets = [];
  ev.years.forEach(function(y, yi){
    if (st.hidden['y' + y]) return;
    var color = EVO_RAMP[yi % EVO_RAMP.length];
    var s = !st.hidden.summit ? series('summit', yi) : null;
    if (s && s.some(function(v){ return v != null; })){
      datasets.push({ label: 'FY' + y + ' · Summit', data: s,
        borderColor: color, backgroundColor: color, borderWidth: 2.5,
        pointRadius: 3.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'summit', _yi: yi });
    }
    var c = !st.hidden.cons ? series('cons', yi) : null;
    if (c && c.some(function(v){ return v != null; })){
      datasets.push({ label: 'FY' + y + ' · Consensus', data: c,
        borderColor: color, backgroundColor: color, borderWidth: 2, borderDash: [6, 4],
        pointRadius: 2.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'cons', _yi: yi });
    }
  });

  var tEl = document.getElementById('rsEvoChartT-' + k);
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' +
    (pct ? esc(rsEvoPctLabel(k, m)) + ' by model snapshot <span>(% per fiscal year, each snapshot against its own numbers · solid = Summit model, dashed = stored BBG consensus)</span>'
         : 'forecast by model snapshot <span>($' + (div === 1000 ? 'B' : 'M') + ' per fiscal year · solid = Summit model, dashed = stored BBG consensus · hover for the revision)</span>');

  st.chart = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: ev.vintages.map(function(v){ return [v.label, v.event]; }), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(items){
              var v = ev.vintages[items[0].dataIndex];
              return v.label + ' · ' + v.event;
            },
            label: function(ctx){
              var i = ctx.dataIndex;
              if (pct){
                var p = rsEvoPct(k, m, ctx.dataset._src, ctx.dataset._yi) || [];
                var line = ctx.dataset.label + ': ' + (p[i] == null ? '—' : p[i].toFixed(1) + '%');
                if (i > 0 && p[i] != null && p[i - 1] != null){
                  var d = p[i] - p[i - 1];
                  line += '  (' + (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' pp vs prior snapshot)';
                }
                return line;
              }
              var arr = m[ctx.dataset._src][ctx.dataset._yi];
              var cur = arr[i];
              var line2 = ctx.dataset.label + ': ' + rsFmt(m, cur);
              if (i > 0 && arr[i - 1] != null && cur != null){
                line2 += '  (' + rsFmtD(m, cur - arr[i - 1]) + ' vs prior snapshot)';
              }
              return line2;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v){ return pct ? (+v.toFixed(1)) + '%' : rsTick(v, m.unit, div); } },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined }
      }
    }
  });

  // Vertical-only brush: only 3 x-points, so any drag adjusts the y-range.
  rsAttachBrush(el, st.chart, null,
    function(v1, v2){ rsEvoSt(k).yr = [v1, v2]; rsBuildEvo(k); },
    function(){ rsEvoSt(k).yr = null; rsBuildEvo(k); });

  rsRenderEvoTable(k, m);
  var n1 = document.getElementById('rsEvoNote-' + k); if (n1) n1.textContent = m.note || '';
  var leg = document.getElementById('rsEvoLegend-' + k); if (leg) leg.innerHTML = rsEvoLegendHtml(k, m);
  var md = document.getElementById('rsEvoMode-' + k); if (md) md.innerHTML = rsEvoModeHtml(k, m);
}

function rsRenderEvoTable(k, m){
  var ev = rsEvo();
  var el = document.getElementById('rsEvoTable-' + k);
  if (!el) return;
  var nv = ev.vintages.length;
  var div = rsEvoScaleOf(m);

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  var pctCap = k === 'top'
    ? ' · “implied YoY growth” = the growth that snapshot’s estimate implies vs the prior fiscal year as known at that date'
    : ' · margins are computed within each snapshot (numerator and denominator from the same vintage)';
  var h = '<div class="rs-ft-cap">US$ ' + (div === 1000 ? 'billions' : 'millions') + ' · columns are the model’s saved snapshots · “revision” = change vs the prior snapshot · the right column is the cumulative move from the first snapshot to the latest' + pctCap + '</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  ev.vintages.forEach(function(v){
    h += '<th>' + esc(v.label) + '<br><span class="rs-ft-dim">' + esc(v.event) + '</span></th>';
  });
  h += '<th class="rs-ft-s">Cumulative revision</th></tr></thead><tbody>';

  function rows(label, arr, pcts){
    if (!arr) return '';
    var hasPct = pcts && pcts.some(function(v){ return v != null; });
    var r = '<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">' + label + '</td>';
    arr.forEach(function(v){ r += '<td><b>' + num(v) + '</b></td>'; });
    r += '<td class="rs-ft-s">' + rsRevHtml(m, arr[0], arr[nv - 1]) + '</td></tr>';
    r += '<tr class="rs-ft-sub' + (hasPct ? ' rs-ft-nb' : '') + '"><td class="rs-ft-h">revision</td>';
    arr.forEach(function(v, i){ r += '<td>' + (i === 0 ? '<span class="rs-ft-nil">—</span>' : rsRevHtml(m, arr[i - 1], v)) + '</td>'; });
    r += '<td class="rs-ft-s"></td></tr>';
    if (hasPct){
      r += '<tr class="rs-ft-sub"><td class="rs-ft-h">' + esc(rsEvoPctLabel(k, m)) + '</td>';
      pcts.forEach(function(v){ r += '<td>' + (v == null ? '<span class="rs-ft-nil">—</span>' : v.toFixed(1) + '%') + '</td>'; });
      r += '<td class="rs-ft-s">' + rsRevPp(pcts[0], pcts[nv - 1]) + '</td></tr>';
    }
    return r;
  }

  ev.years.forEach(function(y, yi){
    h += rows('FY' + esc(y) + ' · Summit', m.summit ? m.summit[yi] : null, rsEvoPct(k, m, 'summit', yi));
    if (m.cons) h += rows('FY' + esc(y) + ' · Consensus', m.cons[yi], rsEvoPct(k, m, 'cons', yi));
  });

  h += '</tbody></table></div>';
  el.innerHTML = h;
}

// ─── Actuals vs Estimates — generic surprise history (bottom of the Estimates
// pane, any ticker). Fed ONLY from the Results dataset: every quarterly metric
// that has at least one reported actual + frozen Summit-estimate pair. Diverging
// surprise bars (green = beat, red = miss — Results datasets carry no expense
// lines), a Surprise % ⇄ $ toggle, the tick-dot slider, and the transposed
// table. A dataset opts out with `surprise: false` (SoFi keeps its richer
// bespoke block instead). ─────────────────────────────────────────────────────
function rsSurpGroups(){
  var v = _rs.data.views.q, out = [];
  v.sections.forEach(function(cfg){
    rsSecGroups(cfg).forEach(function(g){
      var keys = g.keys.filter(function(k){
        var m = v.metrics[k];
        return m && m.act && m.summit && m.periods.some(function(_, i){ return m.act[i] != null && m.summit[i] != null; });
      });
      if (keys.length) out.push({ label: g.label, keys: keys });
    });
  });
  return out;
}
function rsSurpSt(){
  if (!_rs.surp) _rs.surp = { metric: null, win: null, mode: 'pct', chart: null };
  return _rs.surp;
}
function rsSurpM(){
  var st = rsSurpSt();
  var all = rsSurpGroups().reduce(function(a, g){ return a.concat(g.keys); }, []);
  if (!st.metric || all.indexOf(st.metric) < 0) st.metric = all[0];
  return _rs.data.views.q.metrics[st.metric];
}
// Last period with a reported actual — the surprise story ends there.
function rsSurpLr(m){
  var lr = 0;
  for (var i = 0; i < m.periods.length; i++) if (m.act[i] != null) lr = i;
  return lr;
}
function rsSurpWin(m){
  var st = rsSurpSt(), lr = rsSurpLr(m);
  if (!st.win || st.win[1] > lr || st.win[0] < 0) st.win = [0, lr];
  return st.win;
}
// Bar-label plugin: zero baseline + the surprise printed on each diverging bar.
var rsSurpLabels = {
  id: 'rsSurpLabels',
  afterDatasetsDraw: function(chart){
    var surp = chart.$surp || [];
    var bars = chart.getDatasetMeta(0).data;
    var ctx = chart.ctx, area = chart.chartArea;
    if (area){
      var y0 = chart.scales.y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = '#D7DDE4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(area.left, y0); ctx.lineTo(area.right, y0); ctx.stroke();
      ctx.restore();
    }
    for (var i = 0; i < surp.length; i++){
      var bar = bars[i]; if (!bar || surp[i] == null) continue;
      var up = surp[i] >= 0;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = up ? RS_GREEN : RS_RED;
      ctx.fillText((up ? '▲ ' : '▼ ') + (chart.$fmt ? chart.$fmt(surp[i]) : ((up ? '+' : '−') + Math.abs(surp[i]).toFixed(1) + '%')), bar.x, up ? bar.y - 7 : bar.y + 15);
      ctx.restore();
    }
  }
};
function rsSurpBlockHtml(){
  var m = rsSurpM(), st = rsSurpSt();
  var h = '<div class="rs-block" data-rssurp>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Actuals vs Estimates</div>' +
    '<select class="rs-msel rs-ssel" aria-label="Metric">' + rsSurpGroups().map(function(g){
      return '<optgroup label="' + esc(g.label) + '">' + g.keys.map(function(k){
        return '<option value="' + k + '"' + (k === st.metric ? ' selected' : '') + '>' + esc(_rs.data.views.q.metrics[k].label) + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '</select>' +
    '<div class="rs-views" id="rsSurpMode"></div></div>';
  h += '<div class="ave-leg"><span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_GREEN + '"></span>Beat (actual above estimate)</span>' +
    '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_RED + '"></span>Miss (actual below)</span>' +
    '<span class="tech-leg-i" style="margin-left:auto">the model’s frozen pre-print estimate vs what was reported</span></div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsSurpChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsSurpChart"></canvas></div>' +
  '</div>';
  h += '<div class="sg-controls">' +
    '<div class="sg-slider">' +
      '<div class="sg-track"><div class="sg-fill" id="rsSurpFill"></div></div>' +
      '<div class="rs-ticks" id="rsSurpTicks"></div>' +
      '<input type="range" id="rsSurpMin" min="0" max="1" value="0" step="1" aria-label="Start period">' +
      '<input type="range" id="rsSurpMax" min="0" max="1" value="1" step="1" aria-label="End period">' +
    '</div>' +
    '<div class="sg-ends"><span id="rsSurpEnd0"></span><span id="rsSurpEnd1"></span></div>' +
  '</div>';
  h += '<div class="rs-tablewrap" id="rsSurpTable"></div>';
  h += '<div class="ov-foot" id="rsSurpNote"></div>';
  h += '</div>';
  return h;
}
function rsBuildSurp(){
  if (!_rs.data || _rs.data.surprise === false) return;
  var st = rsSurpSt(), m = rsSurpM();
  if (!m) return;
  var el = document.getElementById('rsSurpChart');
  if (!el || !el.offsetParent) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var w = rsSurpWin(m), lo = w[0], hi = w[1];
  var div = rsScaleOf(m);
  var pctMode = st.mode !== 'usd';
  var pcts = [], dols = [];
  for (var i = lo; i <= hi; i++){
    var ok = (m.act[i] != null && m.summit[i] != null && m.summit[i]);
    pcts.push(ok ? rsSurp(m.act[i], m.summit[i]) : null);
    dols.push(ok ? (m.act[i] - m.summit[i]) : null);
  }
  var bars = pctMode ? pcts : dols.map(function(v){ return v == null ? null : (m.unit === 'eps' ? v : v / div); });

  var md = document.getElementById('rsSurpMode');
  if (md) md.innerHTML = '<button type="button" class="rs-view' + (pctMode ? ' active' : '') + '" data-rssurpmode="pct">Surprise %</button>' +
    '<button type="button" class="rs-view' + (!pctMode ? ' active' : '') + '" data-rssurpmode="usd">$ amount</button>';
  var unitLbl = m.unit === 'eps' ? '$' : (div === 1000 ? 'US$ billions' : 'US$ millions');
  var tEl = document.getElementById('rsSurpChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' — surprise vs the Summit estimate <span>(' + (pctMode ? '%' : esc(unitLbl)) + ' per period · hover for both values)</span>';

  st.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: m.periods.slice(lo, hi + 1), datasets: [
      { label: 'Surprise', data: bars,
        backgroundColor: pcts.map(function(s){ return s == null ? '#C7CED6' : (s >= 0 ? RS_GREEN : RS_RED); }),
        borderRadius: 3, maxBarThickness: 56 }
    ] },
    plugins: [rsSurpLabels],
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: function(ctx){
            var i = ctx.dataIndex + lo;
            var s = pcts[ctx.dataIndex], d = dols[ctx.dataIndex];
            return [
              'Actual: ' + rsFmt(m, m.act[i]),
              'Summit estimate: ' + rsFmt(m, m.summit[i]),
              s == null ? 'Surprise: —' : 'Surprise: ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(1) + '% · ' + rsFmtD(m, d)
            ];
          }
        } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v){
            if (pctMode) return (v < 0 ? '−' : '') + Math.abs(v).toFixed(0) + '%';
            return rsTick(v, m.unit, div);
          } } }
      }
    }
  });
  st.chart.$surp = pctMode ? pcts : dols;
  st.chart.$fmt = pctMode ? null : function(v){ return rsFmtD(m, v); };
  st.chart.update();

  // Slider + tick dots over the reported range.
  var lr = rsSurpLr(m), n = lr + 1;
  var mn = document.getElementById('rsSurpMin'), mx = document.getElementById('rsSurpMax');
  var fill = document.getElementById('rsSurpFill'), e0 = document.getElementById('rsSurpEnd0'), e1 = document.getElementById('rsSurpEnd1');
  if (mn && mx){ mn.max = n - 1; mx.max = n - 1; mn.value = lo; mx.value = hi; }
  if (fill){ fill.style.left = (lo / (n - 1) * 100) + '%'; fill.style.width = ((hi - lo) / (n - 1) * 100) + '%'; }
  if (e0) e0.textContent = m.periods[lo];
  if (e1) e1.textContent = m.periods[hi];
  var ticks = document.getElementById('rsSurpTicks');
  if (ticks){
    var th = '';
    for (var t = 0; t < n; t++){
      th += '<span class="rs-tick' + (t >= lo && t <= hi ? ' on' : '') + '" style="left:' + (t / (n - 1) * 100) + '%" title="' + esc(m.periods[t]) + '"></span>';
    }
    ticks.innerHTML = th;
  }

  rsSurpTableRender(m, lo, hi, div);
  var note = document.getElementById('rsSurpNote'); if (note) note.textContent = m.note || '';
}
function rsSurpTableRender(m, lo, hi, div){
  var el = document.getElementById('rsSurpTable');
  if (!el) return;
  var idx = []; for (var i = lo; i <= hi; i++) idx.push(i);
  var dec = m.unit === 'eps' ? 2 : 1;
  function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0) / a.length; }
  function sgn(v){ return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; }
  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  // Growth is always YoY here (lag 4, quarterly data) — independent of the
  // Results pane's YoY/QoQ toggle, which belongs to that pane's state.
  function g(arr, base, i){ if (i - 4 < 0) return null; var a = arr[i], b = base[i - 4]; if (a == null || b == null || !b) return null; return (a - b) / Math.abs(b) * 100; }
  function gd(arr, base, i){ if (i - 4 < 0) return null; var a = arr[i], b = base[i - 4]; if (a == null || b == null) return null; return a - b; }
  function pctDollar(p, d){
    if (p == null) return '<span class="rs-ft-nil">—</span>';
    return rsPctHtml(p, dec) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }
  function sumGrowth(fn){ var a = []; idx.forEach(function(i){ var v = fn(i); if (v != null) a.push(v); }); return a.length ? 'avg ' + sgn(avg(a)) : ''; }
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / 4;
    return years > 0 ? 'CAGR ' + sgn((Math.pow(last / first, 1 / years) - 1) * 100) : '';
  }
  function sumSurprise(){
    var pcts = [], dols2 = [], above = 0, below = 0;
    idx.forEach(function(i){
      if (m.summit[i] == null || m.act[i] == null || !m.summit[i]) return;
      var dv = m.act[i] - m.summit[i];
      pcts.push(dv / Math.abs(m.summit[i]) * 100); dols2.push(dv);
      if (dv >= 0) above++; else below++;
    });
    if (!pcts.length) return '';
    var ap = avg(pcts);
    return above + '▲ · ' + below + '▼<br><span class="rs-ft-dim">actual avg <span style="color:' + (ap >= 0 ? RS_GREEN : RS_RED) + '">' + sgn(ap) + '</span> · ' + rsFmtD(m, avg(dols2)) + '</span>';
  }

  var h = '<div class="rs-ft-cap">' + (m.unit === 'eps' ? 'US$ per share' : (div === 1000 ? 'US$ billions' : 'US$ millions')) + ' · surprise = (actual − estimate) ÷ |estimate| · ▲/green = the actual beat the frozen estimate · the right column summarizes the selected range</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  idx.forEach(function(i){ h += '<th>' + esc(m.periods[i]) + '</th>'; });
  h += '<th class="rs-ft-s">Range record</th></tr></thead><tbody>';

  function row(label, cellFn, cls, sum){
    var classes = cls.split(' ').map(function(c){ return 'rs-ft-' + c; }).join(' ');
    var r = '<tr class="' + classes + '"><td class="rs-ft-h">' + label + '</td>';
    idx.forEach(function(i){ r += '<td>' + cellFn(i) + '</td>'; });
    r += '<td class="rs-ft-s">' + (sum || '') + '</td>';
    return r + '</tr>';
  }

  h += row('Actual', function(i){ return m.act[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(m.act[i]) + '</b>'; }, 'main nb', sumCagr());
  h += row('YoY growth', function(i){ return pctDollar(g(m.act, m.act, i), gd(m.act, m.act, i)); }, 'sub',
    sumGrowth(function(i){ return g(m.act, m.act, i); }));
  h += row('Summit estimate', function(i){ return num(m.summit[i]); }, 'main nb', '');
  h += row('YoY growth', function(i){ return pctDollar(g(m.summit, m.act, i), gd(m.summit, m.act, i)); }, 'sub nb',
    sumGrowth(function(i){ return g(m.summit, m.act, i); }));
  h += row('surprise', function(i){
    if (m.act[i] == null || m.summit[i] == null || !m.summit[i]) return '<span class="rs-ft-nil">—</span>';
    return pctDollar(rsSurp(m.act[i], m.summit[i]), m.act[i] - m.summit[i]);
  }, 'sub', sumSurprise());

  h += '</tbody></table></div>';
  el.innerHTML = h;

  var tb = el.querySelector('table'), lastCol = -1;
  function colCells(ci){ return tb.querySelectorAll('tr > *:nth-child(' + (ci + 1) + ')'); }
  tb.onmouseover = function(e){
    var c = e.target.closest('td,th'); if (!c || c.cellIndex === lastCol) return;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = c.cellIndex;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.add('colhl'); });
  };
  tb.onmouseleave = function(){
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = -1;
  };
}

// ─── Wiring ───────────────────────────────────────────────────────────────────

function rsBuildAll(){ rsView().sections.forEach(function(s){ rsBuildChart(s.key); }); }

function wireResults(pane){
  pane.onclick = (function(e){
    var v = e.target.closest('[data-rsview]');
    if (v){
      _rs.view = v.getAttribute('data-rsview');
      _rs.sec = {};                                    // reset per-section state
      pane.querySelectorAll('.rs-views [data-rsview]').forEach(function(b){ b.classList.toggle('active', b === v); });
      // Scope these to the wrap (`pane`) so a SECOND engine instance on the page (e.g. the Setup
      // chart alongside the Results tab) updates its OWN blocks, not the first #rsBlocks in the DOM.
      var gm = pane.querySelector('#rsGrowMode'); if (gm) gm.hidden = (_rs.view !== 'q');
      var blocks = pane.querySelector('#rsBlocks');
      if (blocks) blocks.innerHTML = rsBlocksHtml();
      var vn = pane.querySelector('#rsViewNote'); if (vn) vn.textContent = rsView().note || '';
      wireSliders(pane);
      rsBuildAll();
      return;
    }
    var gw = e.target.closest('[data-rsgrow]');
    if (gw){
      _rs.growth = gw.getAttribute('data-rsgrow');
      pane.querySelectorAll('[data-rsgrow]').forEach(function(b){ b.classList.toggle('active', b === gw); });
      rsBuildAll();                                    // growth rows + summaries recompute
      return;
    }
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var pr = e.target.closest('[data-rsrange]');
    if (pr){
      rsSt(k).win = rsPresetWin(rsMetric(k), pr.getAttribute('data-rsrange'));
      rsBuildChart(k);
      return;
    }
    var l = e.target.closest('[data-rsleg]');
    if (l){
      var st2 = rsSt(k);
      var key = l.getAttribute('data-rsleg');
      st2.hidden[key] = !st2.hidden[key];
      rsBuildChart(k);
    }
  });
  // Metric dropdown (grouped select) per section block.
  pane.onchange = (function(e){
    if (!e.target.classList.contains('rs-msel')) return;
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var st = rsSt(k);
    st.metric = e.target.value;
    st.win = null;
    st.yr = null;
    rsBuildChart(k);
  });
  wireSliders(pane);
}

function wireSliders(pane){
  rsView().sections.forEach(function(s){
    var k = s.key;
    var mn = document.getElementById('rsMin-' + k), mx = document.getElementById('rsMax-' + k);
    function onSlide(){
      var a = +mn.value, b = +mx.value;
      rsSt(k).win = [Math.min(a, b), Math.max(a, b)];
      rsBuildChart(k);
    }
    if (mn) mn.oninput = onSlide;
    if (mx) mx.oninput = onSlide;
  });
}

// Called when the embedding pane becomes visible (Chart.js needs layout).
// Optional args enable a SECOND instance on the same page (the Setup chart beside the Results tab):
//   wrap   — the specific .rs-wrap element to wire (defaults to the first one, Amazon's behaviour);
//   ticker — re-establish _rs.data for this instance before building (each instance uses a dataset
//            whose section keys are unique, so their canvases/tables/sliders never collide).
export function initResults(wrap, ticker){
  if (ticker){
    var d = getResultsData(ticker); if (!d) return;
    if (_rs._active !== ticker){ _rs.view = 'q'; _rs.growth = 'yoy'; _rs.sec = {}; }
    _rs.data = d; _rs._active = ticker;
  }
  if (!_rs.data) return;
  wrap = wrap || document.querySelector('.rs-wrap:not(#rsEvoWrap)');
  if (wrap) wireResults(wrap);
  rsBuildAll();
}

// Called when the Estimate Evolution pane becomes visible.
export function initResultsEvo(){
  if (!_rs.data || !_rs.data.evolution) return;
  var wrap = document.getElementById('rsEvoWrap');
  if (!wrap) return;
  function secOf(el){
    var block = el.closest('[data-rsevo]');
    return block ? block.getAttribute('data-rsevo') : null;
  }
  wrap.onclick = function(e){
    var k;
    var sm = e.target.closest('[data-rssurpmode]');
    if (sm){
      rsSurpSt().mode = sm.getAttribute('data-rssurpmode');
      rsBuildSurp();
      return;
    }
    var md = e.target.closest('[data-rsevmode]');
    if (md && (k = secOf(md))){
      var mst = rsEvoSt(k);
      mst.mode = md.getAttribute('data-rsevmode');
      mst.yr = null;                                   // units change $B ↔ %
      rsBuildEvo(k);
      return;
    }
    var evl = e.target.closest('[data-rsevleg]');
    if (evl && (k = secOf(evl))){
      var st = rsEvoSt(k);
      var key = evl.getAttribute('data-rsevleg');
      st.hidden[key] = !st.hidden[key];
      rsBuildEvo(k);
    }
  };
  wrap.onchange = function(e){
    if (e.target.classList.contains('rs-ssel')){
      var sst = rsSurpSt();
      sst.metric = e.target.value;
      sst.win = null;
      rsBuildSurp();
      return;
    }
    if (!e.target.classList.contains('rs-esel')) return;
    var k = secOf(e.target);
    if (!k) return;
    var st = rsEvoSt(k);
    st.metric = e.target.value;
    st.mode = 'usd';                                   // reset — % meaning may change per metric
    st.yr = null;
    rsBuildEvo(k);
  };
  // Surprise-block slider (ids are unique; wire once).
  var smn = document.getElementById('rsSurpMin'), smx = document.getElementById('rsSurpMax');
  function onSurpSlide(){
    var a = +smn.value, b = +smx.value;
    rsSurpSt().win = [Math.min(a, b), Math.max(a, b)];
    rsBuildSurp();
  }
  if (smn) smn.oninput = onSurpSlide;
  if (smx) smx.oninput = onSurpSlide;
  rsEvo().sections.forEach(function(s){ rsBuildEvo(s.key); });
  rsBuildSurp();
}
