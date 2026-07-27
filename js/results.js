// results.js — standardized "Results" tab: reported actuals vs Summit model,
// Street consensus and company guidance, per metric and period.
//
// Every company gets this tab as soon as it has a dataset in js/results-data/.
// Datasets are hand-built per company (see results-data/amzn.js for the shape);
// the rendering engine here is fully generic.
//
// Wire-up (companies.js): renderResultsTab(c) fills the pane and toggles the tab
// button; initResults() (re)builds the chart when the pane becomes visible.

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
var RS_GREEN  = '#1E9E62', RS_RED = '#C0392B';

var _rs = { data: null, view: 'q', metric: null, chart: null };

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

function rsFmt(m, v){
  if (v == null) return '—';
  if (m.unit === 'eps') return '$' + Number(v).toFixed(2);
  var a = Math.abs(v);
  if (a >= 10000) return '$' + (v/1000).toFixed(1) + 'B';
  return '$' + Math.round(v).toLocaleString() + 'M';
}
function rsSurp(act, ref){
  if (act == null || ref == null || !ref) return null;
  return (act - ref) / Math.abs(ref) * 100;
}
function rsSurpHtml(s, dec){
  if (s == null) return '<span style="color:var(--mu)">—</span>';
  var up = s >= 0;
  return '<span style="color:' + (up ? RS_GREEN : RS_RED) + ';font-weight:600">' + (up ? '▲ +' : '▼ −') + Math.abs(s).toFixed(dec == null ? 1 : dec) + '%</span>';
}

// ─── Pane HTML ────────────────────────────────────────────────────────────────

export function renderResultsTab(c){
  var pane = document.querySelector('.copane[data-pane="results"]');
  var tabBtn = document.getElementById('co-tab-results');
  var data = getResultsData(c.ticker);
  _rs.data = data;
  if (tabBtn) tabBtn.style.display = data ? '' : 'none';
  if (!pane) return;
  if (!data){ pane.innerHTML = ''; return; }
  _rs.view = 'q';
  _rs.metric = data.views.q.defaultMetric;
  pane.innerHTML = rsBody();
  wireResults(pane);
}

function rsBody(){
  var d = _rs.data, view = d.views[_rs.view];
  var h = '<div class="rs-wrap">';
  h += '<p class="ov-lede">' + esc(d.intro) + '</p>';

  // Period-view toggle (Quarterly / Annual) + metric pills.
  h += '<div class="rs-toprow">';
  h += '<div class="rs-views">' + Object.keys(d.views).map(function(k){
    return '<button type="button" class="rs-view' + (k === _rs.view ? ' active' : '') + '" data-rsview="' + k + '">' + esc(d.views[k].label) + '</button>';
  }).join('') + '</div>';
  h += '</div>';

  h += '<div class="ave-groups" id="rsGroups">' + rsGroupsHtml(view) + '</div>';

  // Legend — which references exist for the selected metric is handled per-chart.
  h += '<div class="ave-leg" id="rsLegend">' + rsLegendHtml(view.metrics[_rs.metric]) + '</div>';

  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsChart"></canvas></div>' +
  '</div>';

  h += '<div class="ov-subh">Track record <span class="ave-subh-note" id="rsScope"></span></div>';
  h += '<div class="ov-kpis" id="rsStats"></div>';

  h += '<div class="rs-tablewrap" id="rsTable"></div>';

  h += '<div class="ov-foot" id="rsNote"></div>';
  h += '<div class="ov-foot" id="rsViewNote"></div>';
  h += '<div class="ov-foot">' + esc(d.source) + '</div>';
  h += '</div>';
  return h;
}

function rsGroupsHtml(view){
  return view.groups.map(function(g){
    return '<div class="ave-group"><div class="ave-group-l">' + esc(g.label) + '</div>' +
      '<div class="ave-pills">' + g.keys.map(function(k){
        return '<button type="button" class="ave-pill' + (k === _rs.metric ? ' active' : '') + '" data-rsmetric="' + k + '">' + esc(view.metrics[k].short) + '</button>';
      }).join('') + '</div></div>';
  }).join('');
}

function rsLegendHtml(m){
  var has = rsRefsFor(m);
  var h = '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_ACT + '"></span>Actual</span>';
  if (has.summit) h += '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_SUMMIT + '"></span>Summit model</span>';
  if (has.cons)   h += '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_CONS + '"></span>Consensus</span>';
  if (has.guide)  h += '<span class="tech-leg-i"><span class="ave-leg-act" style="background:rgba(62,90,130,0.3)"></span>Guidance range</span>';
  h += '<span class="tech-leg-i">▲ beat · ▼ miss</span>';
  return h;
}

function rsRefsFor(m){
  function any(a){ return !!a && a.some(function(v){ return v != null; }); }
  return { summit: any(m.summit), cons: any(m.cons), guide: any(m.guideLo) };
}

// ─── Chart ────────────────────────────────────────────────────────────────────

function rsBuildChart(){
  var m = _rs.data.views[_rs.view].metrics[_rs.metric];
  var el = document.getElementById('rsChart');
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (_rs.chart){ _rs.chart.destroy(); _rs.chart = null; }

  var has = rsRefsFor(m);
  var dec = m.unit === 'eps' ? 2 : 1;
  var scale = function(v){ return v == null ? null : (m.unit === 'eps' ? v : v/1000); }; // $M → $B
  var unitLbl = m.unit === 'eps' ? '$' : '$B';

  var datasets = [];
  if (has.guide){
    datasets.push({ label: 'Guidance range', type: 'bar',
      data: m.periods.map(function(_, i){ return (m.guideLo[i] == null || m.guideHi[i] == null) ? null : [scale(m.guideLo[i]), scale(m.guideHi[i])]; }),
      backgroundColor: RS_GUIDE, borderColor: 'rgba(62,90,130,0.45)', borderWidth: 1, borderSkipped: false,
      barPercentage: 0.98, categoryPercentage: 0.98, grouped: false, order: 10 });
  }
  datasets.push({ label: 'Actual', data: m.act.map(scale), backgroundColor: RS_ACT, borderRadius: 3, maxBarThickness: 26, order: 1 });
  if (has.summit) datasets.push({ label: 'Summit model', data: m.summit.map(scale), backgroundColor: RS_SUMMIT, borderRadius: 3, maxBarThickness: 26, order: 2 });
  if (has.cons)   datasets.push({ label: 'Consensus', data: m.cons.map(scale), backgroundColor: RS_CONS, borderRadius: 3, maxBarThickness: 26, order: 3 });

  var tEl = document.getElementById('rsChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' — actual vs expectations <span>(' + unitLbl + ' per period · hover for detail)</span>';

  _rs.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: m.periods, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx){
              var i = ctx.dataIndex;
              if (ctx.dataset.label === 'Guidance range'){
                return 'Guidance: ' + rsFmt(m, m.guideLo[i]) + ' – ' + rsFmt(m, m.guideHi[i]);
              }
              var raw = { 'Actual': m.act, 'Summit model': m.summit, 'Consensus': m.cons }[ctx.dataset.label];
              var line = ctx.dataset.label + ': ' + rsFmt(m, raw ? raw[i] : null);
              if (ctx.dataset.label !== 'Actual' && raw && raw[i] != null && m.act[i] != null){
                var s = rsSurp(m.act[i], raw[i]);
                line += '  (actual ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(dec) + '%)';
              }
              return line;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v){ return m.unit === 'eps' ? '$' + v : '$' + v + 'B'; } } }
      }
    }
  });

  rsRenderStats(m);
  rsRenderTable(m);
  var n1 = document.getElementById('rsNote'); if (n1) n1.textContent = m.note || '';
  var n2 = document.getElementById('rsViewNote'); if (n2) n2.textContent = _rs.data.views[_rs.view].note || '';
  var leg = document.getElementById('rsLegend'); if (leg) leg.innerHTML = rsLegendHtml(m);
}

// ─── Stats tiles ──────────────────────────────────────────────────────────────

function rsRenderStats(m){
  var el = document.getElementById('rsStats');
  if (!el) return;
  var refs = [
    { key: 'summit', label: 'vs Summit', arr: m.summit },
    { key: 'cons',   label: 'vs Consensus', arr: m.cons },
    { key: 'guide',  label: 'vs Guidance mid', arr: m.periods.map(function(_, i){ return (m.guideLo[i] == null || m.guideHi[i] == null) ? null : (m.guideLo[i] + m.guideHi[i]) / 2; }) }
  ];
  var tiles = '', covered = 0;
  refs.forEach(function(r){
    var surps = [];
    m.periods.forEach(function(_, i){
      var s = rsSurp(m.act[i], r.arr ? r.arr[i] : null);
      if (s != null) surps.push(s);
    });
    if (!surps.length) return;
    covered = Math.max(covered, surps.length);
    var beats = surps.filter(function(s){ return s >= 0; }).length;
    var avg = surps.reduce(function(a, b){ return a + b; }, 0) / surps.length;
    tiles += '<div class="ov-kpi"><div class="ov-kpi-l">' + esc(r.label) + '</div>' +
      '<div class="ov-kpi-v">' + beats + '/' + surps.length + ' beats</div>' +
      '<div class="ov-kpi-d ' + (avg >= 0 ? 'up' : 'down') + '">avg surprise ' + (avg >= 0 ? '+' : '−') + Math.abs(avg).toFixed(1) + '%</div></div>';
  });
  if (!tiles) tiles = '<div class="ov-kpi"><div class="ov-kpi-l">No reference data yet</div><div class="ov-kpi-d muted">Comparisons appear as estimates are compiled</div></div>';
  el.innerHTML = tiles;
  var scope = document.getElementById('rsScope');
  if (scope) scope.textContent = covered ? '(' + covered + ' periods with estimates)' : '';
}

// ─── Detail table ─────────────────────────────────────────────────────────────

function rsRenderTable(m){
  var el = document.getElementById('rsTable');
  if (!el) return;
  var has = rsRefsFor(m);
  var dec = m.unit === 'eps' ? 2 : 1;
  var h = '<table class="rs-table"><thead><tr><th>Period</th><th>Actual</th>';
  if (has.summit) h += '<th>Summit</th><th></th>';
  if (has.cons)   h += '<th>Consensus</th><th></th>';
  if (has.guide)  h += '<th>Guidance</th><th></th>';
  h += '</tr></thead><tbody>';
  for (var i = m.periods.length - 1; i >= 0; i--){
    if (m.act[i] == null && (!m.summit || m.summit[i] == null) && (!m.cons || m.cons[i] == null) && (!m.guideLo || m.guideLo[i] == null)) continue;
    h += '<tr><td>' + esc(m.periods[i]) + '</td><td class="rs-num rs-act">' + rsFmt(m, m.act[i]) + '</td>';
    if (has.summit) h += '<td class="rs-num">' + rsFmt(m, m.summit[i]) + '</td><td class="rs-num">' + rsSurpHtml(rsSurp(m.act[i], m.summit[i]), dec) + '</td>';
    if (has.cons)   h += '<td class="rs-num">' + rsFmt(m, m.cons[i]) + '</td><td class="rs-num">' + rsSurpHtml(rsSurp(m.act[i], m.cons[i]), dec) + '</td>';
    if (has.guide){
      var g = (m.guideLo[i] == null) ? '—' : rsFmt(m, m.guideLo[i]) + ' – ' + rsFmt(m, m.guideHi[i]);
      var pos = '';
      if (m.guideLo[i] != null && m.act[i] != null){
        if (m.act[i] > m.guideHi[i]) pos = '<span style="color:' + RS_GREEN + ';font-weight:600">above</span>';
        else if (m.act[i] < m.guideLo[i]) pos = '<span style="color:' + RS_RED + ';font-weight:600">below</span>';
        else pos = '<span style="color:var(--mu);font-weight:600">within</span>';
      }
      h += '<td class="rs-num">' + g + '</td><td class="rs-num">' + pos + '</td>';
    }
    h += '</tr>';
  }
  h += '</tbody></table>';
  el.innerHTML = h;
}

// ─── Wiring ───────────────────────────────────────────────────────────────────

function wireResults(pane){
  // .onclick (not addEventListener) so re-opening a company replaces the handler
  // instead of stacking a new one on the same pane element.
  pane.onclick = (function(e){
    var v = e.target.closest('[data-rsview]');
    if (v){
      _rs.view = v.getAttribute('data-rsview');
      var view = _rs.data.views[_rs.view];
      _rs.metric = view.metrics[_rs.metric] ? _rs.metric : view.defaultMetric;
      pane.querySelectorAll('.rs-view').forEach(function(b){ b.classList.toggle('active', b === v); });
      var g = document.getElementById('rsGroups'); if (g) g.innerHTML = rsGroupsHtml(view);
      rsBuildChart();
      return;
    }
    var p = e.target.closest('[data-rsmetric]');
    if (p){
      _rs.metric = p.getAttribute('data-rsmetric');
      pane.querySelectorAll('.ave-pill[data-rsmetric]').forEach(function(b){ b.classList.toggle('active', b === p); });
      rsBuildChart();
    }
  });
}


// Called from coTab when the Results pane becomes visible (Chart.js needs layout).
export function initResults(){
  if (!_rs.data) return;
  rsBuildChart();
}
