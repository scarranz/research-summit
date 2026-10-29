// results-data/ma-setup.js — the MA "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as maResults, but with TWO Setup-specific rules
// (EARNINGS_CONVENTIONS §6a-viii-bis):
//
//   1. CLUBBED into ONE merged section (key 'setup') so every tracked line lives in a single
//      chart + table + picker (the Results tab splits Top Line vs Margins; Setup keeps one). The
//      unique section key means its engine canvases/tables/sliders never collide with the Results
//      tab's. Margin lines come from each metric's own `marginOf` — only PROFIT lines carry a
//      margin; revenue / segment-revenue / a plain KPI have none, so the engine draws none.
//
//   2. NARROW, ROLLING period windows — NOT the full timeline:
//        • Quarterly: the last 8 reported quarters + the TWO next (forecast) quarters (analyst rule Oct 22 2026: two quarters ahead, always).
//        • Annual: the last 4 fiscal years + the next 2 forward years.
//      Enforced HERE by slicing every metric's parallel arrays to the chosen indices, anchored on
//      the forecast quarter / last reported FY — so the window advances by itself as prints land.
import { maResults } from './ma.js';

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

// Quarterly ROLLING window: the last 8 reported quarters + the TWO next (forecast) quarters.
// Forecast quarter = the first quarter with no reported actual (on the revenue line).
var Q_BACK = 8, Q_FWD = 2;   // reported quarters shown; +2 forecast quarters => 10 columns
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;                 // no forecast column? anchor on the last
  var start = Math.max(0, fc - Q_BACK), idx = [];
  var end = Math.min(fc + Q_FWD - 1, rev.periods.length - 1);
  for (i = start; i <= end; i++) idx.push(i);             // 8 back + the two forecasts
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
  // One section holding EVERY tracked line, grouped by each metric's own `group` (Totals, Revenue lines, Operating metrics, Company,
  // Expense lines). Setup keeps every line so the grid and the picture agree.
  var groups = [], byLabel = {};
  Object.keys(view.metrics).forEach(function(k){
    var g = view.metrics[k].group || 'Other';
    if (!byLabel[g]){ byLabel[g] = { label: g, keys: [] }; groups.push(byLabel[g]); }
    byLabel[g].keys.push(k);
  });
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = quarterlyIdx(maResults.views.q);
var yIdx = annualIdx(maResults.views.y);

export var maSetup = {
  updated: maResults.updated,
  forwardQuarters: 2,   // two quarters past the last print: without it the engine falls back to the current-fiscal-year cut and drops 1Q27
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, and margin lines for the profit lines (only profit lines carry a margin — a revenue line or a KPI does not). The window is rolling: quarterly shows the last 8 reported quarters + the two next (forecast) quarters; annual shows the last 4 fiscal years + the next 2. Summit = the DCF model’s frozen line (annual, and quarterly through 4Q26); Street consensus from the Bloomberg archive; no guidance band (Mastercard guides growth rates, not dollar levels).',
  source: maResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Rolling — the last 8 reported quarters plus the two next (forecast) quarters; it advances by itself as new prints land. ' + maResults.views.q.note,
         metrics: sliceMetrics(maResults.views.q, qIdx), sections: mergedSection(maResults.views.q) },
    y: { label: 'Annual', note: 'Rolling — the last 4 fiscal years plus the next 2 forward years. ' + maResults.views.y.note,
         metrics: sliceMetrics(maResults.views.y, yIdx), sections: mergedSection(maResults.views.y) }
  }
};
