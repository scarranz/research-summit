// results-data/googl-setup.js — the GOOGL "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as googlResults, but with TWO Setup-specific rules
// (EARNINGS_CONVENTIONS §6a-viii-bis):
//
//   1. CLUBBED into ONE merged section (key 'setup') so every tracked line lives in a single
//      chart + table + picker (the Results tab splits Top Line vs Margins; Setup keeps one). The
//      unique section key means its engine canvases/tables/sliders never collide with the Results
//      tab's. Margin lines come from each metric's own `marginOf` — only PROFIT lines carry a
//      margin; revenue / segment-revenue / a plain KPI have none, so the engine draws none.
//
//   2. NARROW, ROLLING period windows — NOT the full timeline:
//        • Quarterly: the last 8 reported quarters + the ONE next (forecast) quarter.
//        • Annual: the last 4 fiscal years + the next 2 forward years.
//      Enforced HERE by slicing every metric's parallel arrays to the chosen indices, anchored on
//      the forecast quarter / last reported FY — so the window advances by itself as prints land.
import { googlResults } from './googl.js';

// Slice every metric's parallel arrays (periods/act/summit/cons/guide…) to the chosen indices.
function sliceMetrics(view, idx){
  var out = {};
  Object.keys(view.metrics).forEach(function(k){
    var m = view.metrics[k], o = {};
    Object.keys(m).forEach(function(f){
      o[f] = Array.isArray(m[f]) ? idx.map(function(i){ return m[f][i]; }) : m[f];
    });
    out[k] = o;
  });
  return out;
}

// Quarterly ROLLING window: the last 8 reported quarters + the ONE next (forecast) quarter.
// Forecast quarter = the first quarter with no reported actual (on the revenue line).
var Q_BACK = 8;   // reported quarters shown; +1 forecast quarter => 9 columns
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;                 // no forecast column? anchor on the last
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);               // 8 back + the one forecast
  return idx;
}

// Annual ROLLING window: the last 4 fiscal years + the next 2 forward years. Rolls with each new FY.
var Y_BACK = 3, Y_FWD = 2;   // last 4 years (lastActual-3 … lastActual) + 2 forward
function annualIdx(view){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - Y_BACK), end = Math.min(lastA + Y_FWD, rev.periods.length - 1), idx = [];
  for (var i = start; i <= end; i++) idx.push(i);
  return idx;
}

function mergedSection(view){
  // One section, keeping the original groups as the <select> optgroups (Revenue / Profitability).
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = quarterlyIdx(googlResults.views.q);
var yIdx = annualIdx(googlResults.views.y);

export var googlSetup = {
  updated: googlResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, the guidance band where Alphabet guides the line (capex only), and margin lines for the profit lines (only profit lines carry a margin — a revenue line or a KPI does not). The window is rolling: quarterly shows the last 8 reported quarters + the one next (forecast) quarter; annual shows the last 4 fiscal years + the next 2. Summit = the model’s frozen per-quarter projections; consensus and guidance per the dataset’s own sources (js/results-data/googl.js header).',
  source: googlResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter; it advances by itself as new prints land. ' + googlResults.views.q.note,
         metrics: sliceMetrics(googlResults.views.q, qIdx), sections: mergedSection(googlResults.views.q) },
    y: { label: 'Annual', note: 'Rolling — the last 4 fiscal years plus the next 2 forward years. ' + googlResults.views.y.note,
         metrics: sliceMetrics(googlResults.views.y, yIdx), sections: mergedSection(googlResults.views.y) }
  }
};
