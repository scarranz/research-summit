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

var RESULTS_DATA = {
  AMZN: amznResults
};

export function getResultsData(ticker){
  return RESULTS_DATA[ticker] || null;
}

// ─── Colors (match the portal/AVE conventions) ────────────────────────────────
var RS_ACT    = 'rgba(30,39,51,0.92)';    // navy — actual
var RS_SUMMIT = 'rgba(37,99,235,0.85)';   // accent blue — Summit model
var RS_CONS   = 'rgba(124,134,148,0.85)'; // mid gray — Street consensus
var RS_GUIDE  = 'rgba(62,90,130,0.18)';   // steel, translucent — guidance range
var RS_GROWTH = '#B7791F';                // amber — YoY growth line
var RS_GREEN  = '#1E9E62', RS_RED = '#C0392B';
// Evolution block: one line per fiscal year — an ordered (ordinal) ramp of the
// portal blue, darkest = nearest year. Validated with the dataviz palette
// checker (monotone L, visible step gaps, light end ≥2:1 on white).
var EVO_RAMP = ['#1B3F94', '#2563EB', '#5E8BEC', '#93B1F0'];

// Global: dataset + view. Per-section (keyed by section key): metric, window,
// hidden series, chart instance. `evo` is the vintage-evolution block's state.
var _rs = { data: null, view: 'q', sec: {}, evo: null };

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

function rsView(){ return _rs.data.views[_rs.view]; }
function rsSecCfg(k){ return rsView().sections.filter(function(s){ return s.key === k; })[0]; }
// Sections declare their metrics in labeled groups (Totals / Segments / …);
// flatten for validation and default handling.
function rsSecGroups(cfg){ return cfg.groups || [{ label: '', keys: cfg.keys || [] }]; }
function rsSecKeys(cfg){ return rsSecGroups(cfg).reduce(function(a, g){ return a.concat(g.keys); }, []); }
function rsSt(k){
  if (!_rs.sec[k]) _rs.sec[k] = { metric: null, win: null, chart: null,
    hidden: { act:false, summit:false, cons:false, guide:false, growth:false, margin:false } };
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
  return sign + '$' + (a/1000).toFixed(dec == null ? 1 : dec) + 'B';
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
// Axis tick: negatives as −$50B, not $-50B.
function rsTick(v, unit){ var s = v < 0 ? '−' : '', a = Math.abs(v); return unit === 'eps' ? s + '$' + a : s + '$' + a + 'B'; }
function rsWin(k, m){
  var st = rsSt(k), n = m.periods.length;
  if (!st.win || st.win[1] >= n || st.win[0] < 0){ st.win = [0, n - 1]; }
  return st.win;
}
function rsRefsFor(m){
  function any(a){ return !!a && a.some(function(v){ return v != null; }); }
  return { summit: any(m.summit), cons: any(m.cons), guide: any(m.guideLo) };
}

// ─── Growth & margin series ───────────────────────────────────────────────────
// "Best available" per period: the actual when reported, else Summit, else
// consensus — so growth chains cleanly from history into the forward estimates.
function rsBest(m, i){ return m.act[i] != null ? m.act[i] : (m.summit[i] != null ? m.summit[i] : m.cons[i]); }
function rsLook(){ return _rs.view === 'q' ? 4 : 1; }
function rsGrowthPct(m, i){
  var k = rsLook(); if (i - k < 0) return null;
  var a = rsBest(m, i), b = rsBest(m, i - k);
  if (a == null || b == null || !b) return null;
  return (a - b) / Math.abs(b) * 100;
}
function rsGrowthDollar(m, i){
  var k = rsLook(); if (i - k < 0) return null;
  var a = rsBest(m, i), b = rsBest(m, i - k);
  if (a == null || b == null) return null;
  return a - b;
}
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
  }).join('') + '</div></div>';
  h += '<div id="rsBlocks">' + rsBlocksHtml() + '</div>';
  if (d.evolution) h += rsEvoBlockHtml();
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
    var h = '<div class="rs-block" data-rsblock="' + k + '">';
    h += '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.label) + '</div>' +
      '<select class="rs-msel" aria-label="Metric">' + rsSelectHtml(k) + '</select></div>';
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
    h += '<div class="ov-subh">Range analytics <span class="ave-subh-note" id="rsScope-' + k + '"></span></div>';
    h += '<div class="ov-kpis" id="rsStats-' + k + '"></div>';
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
  if (isTop)      h += chip('growth', RS_GROWTH, 'YoY growth %', true);
  else if (m.marginOf && m.unit !== 'eps') h += chip('margin', RS_ACT, esc(m.marginLabel || 'margin') + ' %', true);
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
  var scale = function(v){ return v == null ? null : (m.unit === 'eps' ? v : v/1000); };
  var unitLbl = m.unit === 'eps' ? '$' : '$B';
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

  if (isTop && !st.hidden.growth){
    var g = m.periods.map(function(_, i){ return rsGrowthPct(m, i); });
    if (g.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'YoY growth %', type: 'line', yAxisID: 'y2', data: sl(g),
        borderColor: RS_GROWTH, backgroundColor: RS_GROWTH, borderWidth: 2, pointRadius: 2.5,
        pointBackgroundColor: RS_GROWTH, tension: 0.25, spanGaps: true, order: 1 });
    }
  }
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
  if (tEl) tEl.innerHTML = esc(m.label) + ' — actual vs expectations <span>(' + unitLbl + ' per period · ' + (isTop ? 'growth' : 'margin') + ' lines on the right axis · hover for detail)</span>';

  var scales = {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
      callback: function(v){ return rsTick(v, m.unit); } } }
  };
  if (needY2) scales.y2 = { position: 'right', grid: { display: false },
    ticks: { font: { size: 11 }, callback: function(v){ return v + '%'; } } };

  st.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: sl(m.periods), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
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
  rsRenderStats(k, m);
  rsRenderTable(k, m);
  var n1 = document.getElementById('rsNote-' + k); if (n1) n1.textContent = m.note || '';
  var leg = document.getElementById('rsLegend-' + k); if (leg) leg.innerHTML = rsLegendHtml(k, m);
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

// ─── Range analytics — avg deviation in % AND dollars, per reference ──────────

function rsRenderStats(k, m){
  var el = document.getElementById('rsStats-' + k);
  if (!el) return;
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var tiles = '', covered = 0;
  function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0) / a.length; }

  // Read from the ACTUAL's point of view: the actual came in X above/below what
  // each reference had estimated (▲ = beat the estimate, green).
  [{ key:'summit', label:'Actual vs Summit', arr:m.summit },
   { key:'cons',   label:'Actual vs consensus', arr:m.cons }].forEach(function(r){
    var pcts = [], dols = [], above = 0, below = 0;
    for (var i = lo; i <= hi; i++){
      if (!r.arr || r.arr[i] == null || m.act[i] == null || !r.arr[i]) continue;
      var dv = m.act[i] - r.arr[i];
      pcts.push(dv / Math.abs(r.arr[i]) * 100); dols.push(dv);
      if (dv >= 0) above++; else below++;
    }
    if (!pcts.length) return;
    covered = Math.max(covered, pcts.length);
    var ap = avg(pcts), ad = avg(dols);
    var aap = avg(pcts.map(Math.abs)), aad = avg(dols.map(Math.abs));
    tiles += '<div class="ov-kpi"><div class="ov-kpi-l">' + esc(r.label) + '</div>' +
      '<div class="ov-kpi-v">' + above + ' above · ' + below + ' below</div>' +
      '<div class="ov-kpi-d ' + (ap >= 0 ? 'up' : 'down') + '">actual avg ' + (ap >= 0 ? '+' : '−') + Math.abs(ap).toFixed(1) + '% · ' + rsFmtD(m, ad) + ' vs estimate</div>' +
      '<div class="ov-kpi-d muted">avg magnitude ±' + aap.toFixed(1) + '% · ±' + rsFmtD(m, aad).replace('+','').replace('−','') + '</div></div>';
  });

  var ab = 0, wi = 0, be = 0, midsP = [], midsD = [];
  for (var i = lo; i <= hi; i++){
    if (m.guideLo[i] == null || m.act[i] == null) continue;
    if (m.act[i] > m.guideHi[i]) ab++; else if (m.act[i] < m.guideLo[i]) be++; else wi++;
    var mid = rsGuideMid(m, i);
    if (mid){ midsP.push((m.act[i] - mid) / Math.abs(mid) * 100); midsD.push(m.act[i] - mid); }
  }
  if (ab + wi + be > 0){
    covered = Math.max(covered, ab + wi + be);
    var amp = avg(midsP), amd = avg(midsD);
    tiles += '<div class="ov-kpi"><div class="ov-kpi-l">Actual vs guidance range</div>' +
      '<div class="ov-kpi-v">' + ab + ' above · ' + wi + ' within · ' + be + ' below</div>' +
      '<div class="ov-kpi-d ' + (amp >= 0 ? 'up' : 'down') + '">avg vs midpoint ' + (amp >= 0 ? '+' : '−') + Math.abs(amp).toFixed(1) + '% · ' + rsFmtD(m, amd) + '</div></div>';
  }

  // Growth tile (Top Line): avg YoY, avg $ added, plus the Fiscal-style range
  // headline — REPORTED observations only (estimates never count as growth).
  if (k === 'top'){
    var gp = [], gd = [];
    for (var i = lo; i <= hi; i++){
      var g1 = rsActGrowthPct(m, i), g2 = rsActGrowthDollar(m, i);
      if (g1 != null){ gp.push(g1); gd.push(g2); }
    }
    var first = null, last = null, fi = null, li = null;
    for (var i = lo; i <= hi; i++){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } }
    if (gp.length || (first != null && li > fi)){
      var extra = '';
      if (first != null && li > fi && first > 0){
        var tot = (last - first) / Math.abs(first) * 100;
        var years = (li - fi) / rsLook() / (_rs.view === 'q' ? 1 : 1);
        years = (li - fi) / (rsLook() === 4 ? 4 : 1);
        var cagr = years > 0 ? (Math.pow(last / first, 1 / years) - 1) * 100 : null;
        extra = '<div class="ov-kpi-d muted">range: total change ' + (tot >= 0 ? '+' : '−') + Math.abs(tot).toFixed(1) + '%' + (cagr != null ? ' · CAGR ' + (cagr >= 0 ? '+' : '−') + Math.abs(cagr).toFixed(1) + '%' : '') + '</div>';
      }
      tiles += '<div class="ov-kpi"><div class="ov-kpi-l">Growth in range</div>' +
        '<div class="ov-kpi-v">' + (gp.length ? ((avg(gp) >= 0 ? '+' : '−') + Math.abs(avg(gp)).toFixed(1) + '% YoY avg') : '—') + '</div>' +
        (gp.length ? '<div class="ov-kpi-d muted">avg ' + rsFmtD(m, avg(gd)) + ' added per period YoY</div>' : '') +
        extra + '</div>';
    }
  } else if (m.marginOf && m.unit !== 'eps'){
    var ma = rsMarginArr(m, 'act') || [], ms = rsMarginArr(m, 'summit') || [], mc = rsMarginArr(m, 'cons') || [];
    var mma = [], mms = [], mmc = [];
    for (var i = lo; i <= hi; i++){
      if (ma[i] != null) mma.push(ma[i]);
      if (ms[i] != null) mms.push(ms[i]);
      if (mc[i] != null) mmc.push(mc[i]);
    }
    if (mma.length || mms.length || mmc.length){
      var bits = [];
      if (mms.length) bits.push(avg(mms).toFixed(1) + '% Summit');
      if (mmc.length) bits.push(avg(mmc).toFixed(1) + '% consensus');
      tiles += '<div class="ov-kpi"><div class="ov-kpi-l">' + esc(m.marginLabel || 'Margin') + ' in range</div>' +
        '<div class="ov-kpi-v">' + (mma.length ? avg(mma).toFixed(1) + '% actual' : '—') + '</div>' +
        (bits.length ? '<div class="ov-kpi-d muted">' + bits.join(' · ') + '</div>' : '') + '</div>';
    }
  }

  if (!tiles) tiles = '<div class="ov-kpi"><div class="ov-kpi-l">No comparable periods in this window</div><div class="ov-kpi-d muted">Widen the range or pick another metric</div></div>';
  el.innerHTML = tiles;
  var scope = document.getElementById('rsScope-' + k);
  if (scope) scope.textContent = covered ? '(' + covered + ' reported periods in the selected range)' : '';
}

// ─── Detail table — TRANSPOSED, Fiscal.ai-style spreadsheet ───────────────────

function rsRenderTable(k, m){
  var el = document.getElementById('rsTable-' + k);
  if (!el) return;
  var has = rsRefsFor(m);
  var isTop = k === 'top';
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var dec = m.unit === 'eps' ? 2 : 1;
  var idx = [], est = [];
  for (var i = lo; i <= hi; i++){ idx.push(i); est.push(m.act[i] == null); }

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    return (v/1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / (rsLook() === 4 ? 4 : 1);
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

  var h = '<div class="rs-ft-cap">' + (m.unit === 'eps' ? 'US$ per share' : 'US$ billions') + ' · <span class="rs-ft-e">E</span> = estimate, no actual reported yet · the right column summarizes the selected range: how the actual has come in vs each estimate (▲ = beat)</div>';
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

  // Actual: value → YoY growth (→ margin).
  var maA = showMargin ? rsMarginArr(m, 'act') : null;
  h += row('Actual', function(i){ return m.act[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(m.act[i]) + '</b>'; }, 'main nb', sumCagr());
  h += row('YoY growth', function(i){ return pctDollar(rsActGrowthPct(m, i), rsActGrowthDollar(m, i)); }, showMargin ? 'sub nb' : 'sub', sumGrowth(rsActGrowthPct.bind(null, m)));
  if (showMargin) h += row(esc(m.marginLabel || 'margin'), function(i){ return maA && maA[i] != null ? maA[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(maA));

  // Reference series (Summit / Consensus): value → YoY growth → surprise (→ margin).
  [{ on: has.summit, series: 'summit', label: 'Summit model' },
   { on: has.cons,   series: 'cons',   label: 'Consensus' }].forEach(function(r){
    if (!r.on) return;
    var s = r.series;
    var mm = showMargin ? rsMarginArr(m, s) : null;
    h += row(r.label, function(i){ return num(m[s][i]); }, 'main nb', '');
    h += row('YoY growth', function(i){ return pctDollar(rsRefGrowthPct(m, s, i), rsRefGrowthDollar(m, s, i)); }, 'sub nb',
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
// A separate stacked block below the per-period sections, independent of the
// Quarterly/Annual toggle (the vintage data is annual by nature). One line per
// fiscal year across the saved snapshots: solid = Summit, dashed = the BBG
// consensus stored inside the model at the same date. Dataset shape: see
// `evolution` in results-data/<ticker>.js.

function rsEvo(){ return _rs.data ? _rs.data.evolution : null; }
function rsEvoSt(){
  if (!_rs.evo) _rs.evo = { metric: null, chart: null, hidden: {} };
  return _rs.evo;
}
function rsEvoMetric(){
  var ev = rsEvo(), st = rsEvoSt();
  if (!st.metric || !ev.metrics[st.metric]) st.metric = ev.defaultMetric;
  return ev.metrics[st.metric];
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

function rsEvoBlockHtml(){
  var ev = rsEvo();
  var h = '<div class="rs-block" data-rsevo>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Estimate evolution</div>' +
    '<select class="rs-msel rs-esel" aria-label="Evolution metric">' + rsEvoSelectHtml() + '</select></div>';
  h += '<p class="ov-lede">' + esc(ev.intro || '') + '</p>';
  h += '<div class="ave-leg" id="rsEvoLegend">' + rsEvoLegendHtml() + '</div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsEvoChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsEvoChart"></canvas></div>' +
  '</div>';
  h += '<div class="rs-tablewrap" id="rsEvoTable"></div>';
  h += '<div class="ov-foot" id="rsEvoNote"></div>';
  h += '<div class="ov-foot">' + esc(ev.note || '') + '</div>';
  h += '</div>';
  return h;
}

function rsEvoSelectHtml(){
  var ev = rsEvo(), st = rsEvoSt();
  rsEvoMetric();                                       // ensure st.metric is valid
  return ev.groups.map(function(g){
    var opts = g.keys.map(function(mk){
      return '<option value="' + mk + '"' + (mk === st.metric ? ' selected' : '') + '>' + esc(ev.metrics[mk].label) + '</option>';
    }).join('');
    return '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>';
  }).join('');
}

function rsEvoLegendHtml(){
  var ev = rsEvo(), st = rsEvoSt(), m = rsEvoMetric();
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

function rsBuildEvo(){
  var ev = rsEvo();
  if (!ev) return;
  var st = rsEvoSt(), m = rsEvoMetric();
  var el = document.getElementById('rsEvoChart');
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var scale = function(v){ return v == null ? null : v / 1000; };
  var datasets = [];
  ev.years.forEach(function(y, yi){
    if (st.hidden['y' + y]) return;
    var color = EVO_RAMP[yi % EVO_RAMP.length];
    if (!st.hidden.summit && m.summit && m.summit[yi]){
      datasets.push({ label: 'FY' + y + ' · Summit', data: m.summit[yi].map(scale),
        borderColor: color, backgroundColor: color, borderWidth: 2.5,
        pointRadius: 3.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'summit', _yi: yi });
    }
    if (!st.hidden.cons && m.cons && m.cons[yi]){
      datasets.push({ label: 'FY' + y + ' · Consensus', data: m.cons[yi].map(scale),
        borderColor: color, backgroundColor: color, borderWidth: 2, borderDash: [6, 4],
        pointRadius: 2.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'cons', _yi: yi });
    }
  });

  var tEl = document.getElementById('rsEvoChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' — forecast by model snapshot <span>($B per fiscal year · solid = Summit model, dashed = stored BBG consensus · hover for the revision)</span>';

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
              var arr = m[ctx.dataset._src][ctx.dataset._yi];
              var i = ctx.dataIndex, cur = arr[i];
              var line = ctx.dataset.label + ': ' + rsFmt(m, cur);
              if (i > 0 && arr[i - 1] != null && cur != null){
                line += '  (' + rsFmtD(m, cur - arr[i - 1]) + ' vs prior snapshot)';
              }
              return line;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v){ return rsTick(v, m.unit); } } }
      }
    }
  });

  rsRenderEvoTable();
  var n1 = document.getElementById('rsEvoNote'); if (n1) n1.textContent = m.note || '';
  var leg = document.getElementById('rsEvoLegend'); if (leg) leg.innerHTML = rsEvoLegendHtml();
}

function rsRenderEvoTable(){
  var ev = rsEvo(), m = rsEvoMetric();
  var el = document.getElementById('rsEvoTable');
  if (!el) return;
  var nv = ev.vintages.length;

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    return (v / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  var h = '<div class="rs-ft-cap">US$ billions · columns are the model’s saved snapshots · “revision” = change vs the prior snapshot · the right column is the cumulative move from the first snapshot to the latest</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  ev.vintages.forEach(function(v){
    h += '<th>' + esc(v.label) + '<br><span class="rs-ft-dim">' + esc(v.event) + '</span></th>';
  });
  h += '<th class="rs-ft-s">Cumulative revision</th></tr></thead><tbody>';

  function rows(label, arr){
    if (!arr) return '';
    var r = '<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">' + label + '</td>';
    arr.forEach(function(v){ r += '<td><b>' + num(v) + '</b></td>'; });
    r += '<td class="rs-ft-s">' + rsRevHtml(m, arr[0], arr[nv - 1]) + '</td></tr>';
    r += '<tr class="rs-ft-sub"><td class="rs-ft-h">revision</td>';
    arr.forEach(function(v, i){ r += '<td>' + (i === 0 ? '<span class="rs-ft-nil">—</span>' : rsRevHtml(m, arr[i - 1], v)) + '</td>'; });
    r += '<td class="rs-ft-s"></td></tr>';
    return r;
  }

  ev.years.forEach(function(y, yi){
    h += rows('FY' + esc(y) + ' · Summit', m.summit ? m.summit[yi] : null);
    if (m.cons) h += rows('FY' + esc(y) + ' · Consensus', m.cons[yi]);
  });

  h += '</tbody></table></div>';
  el.innerHTML = h;
}

// ─── Wiring ───────────────────────────────────────────────────────────────────

function rsBuildAll(){ rsView().sections.forEach(function(s){ rsBuildChart(s.key); }); }

function wireResults(pane){
  pane.onclick = (function(e){
    var v = e.target.closest('[data-rsview]');
    if (v){
      _rs.view = v.getAttribute('data-rsview');
      _rs.sec = {};                                    // reset per-section state
      pane.querySelectorAll('.rs-view').forEach(function(b){ b.classList.toggle('active', b === v); });
      var blocks = document.getElementById('rsBlocks');
      if (blocks) blocks.innerHTML = rsBlocksHtml();
      var vn = document.getElementById('rsViewNote'); if (vn) vn.textContent = rsView().note || '';
      wireSliders(pane);
      rsBuildAll();
      return;
    }
    var evl = e.target.closest('[data-rsevleg]');
    if (evl){
      var est = rsEvoSt();
      var ekey = evl.getAttribute('data-rsevleg');
      est.hidden[ekey] = !est.hidden[ekey];
      rsBuildEvo();
      return;
    }
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var l = e.target.closest('[data-rsleg]');
    if (l){
      var st2 = rsSt(k);
      var key = l.getAttribute('data-rsleg');
      st2.hidden[key] = !st2.hidden[key];
      rsBuildChart(k);
    }
  });
  // Metric dropdown (grouped select) per section block. The evolution block's
  // select carries rs-esel (rs-msel is styling only there) — handle it first.
  pane.onchange = (function(e){
    if (!e.target.classList.contains('rs-msel')) return;
    if (e.target.classList.contains('rs-esel')){
      rsEvoSt().metric = e.target.value;
      rsBuildEvo();
      return;
    }
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var st = rsSt(k);
    st.metric = e.target.value;
    st.win = null;
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
export function initResults(){
  if (!_rs.data) return;
  var wrap = document.querySelector('.rs-wrap');
  if (wrap) wireResults(wrap);
  rsBuildAll();
  rsBuildEvo();
}
