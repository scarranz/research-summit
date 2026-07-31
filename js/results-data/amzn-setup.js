// results-data/amzn-setup.js — the AMZN "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as amznResults, but with the two Setup-specific rules
// (EARNINGS_CONVENTIONS §6a-viii-bis): ONE merged section (key 'setup') and NARROW rolling
// windows — quarterly = last 8 reported quarters + the ONE next (forecast) quarter; annual =
// last 4 fiscal years + the next 2 forward. See meta-setup.js / googl-setup.js (same pattern).
import { amznResults } from './amzn.js';

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

var Q_BACK = 8;   // reported quarters shown; +1 forecast quarter => 9 columns
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}

var Y_BACK = 3, Y_FWD = 2;
function annualIdx(view){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - Y_BACK), end = Math.min(lastA + Y_FWD, rev.periods.length - 1), idx = [];
  for (var i = start; i <= end; i++) idx.push(i);
  return idx;
}

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = quarterlyIdx(amznResults.views.q);
var yIdx = annualIdx(amznResults.views.y);

export var amznSetup = {
  updated: amznResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, the guidance band where Amazon guides the line (net sales + GAAP operating income only), and margin lines for the profit lines. The window is rolling: quarterly shows the last 8 reported quarters + the one next (forecast) quarter; annual shows the last 4 fiscal years + the next 2. Sources per the dataset header (js/results-data/amzn.js).',
  source: amznResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter; it advances by itself as new prints land. ' + amznResults.views.q.note,
         metrics: sliceMetrics(amznResults.views.q, qIdx), sections: mergedSection(amznResults.views.q) },
    y: { label: 'Annual', note: 'Rolling — the last 4 fiscal years plus the next 2 forward years. ' + amznResults.views.y.note,
         metrics: sliceMetrics(amznResults.views.y, yIdx), sections: mergedSection(amznResults.views.y) }
  }
};
