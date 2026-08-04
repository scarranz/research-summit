// results-data/tbbb-setup.js — the TBBB "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as tbbbResults, with the Setup rules (EARNINGS_CONVENTIONS
// §6a-viii-bis): ONE merged section (key 'setup') and a rolling window — annual = last 4 fiscal
// years + the next 2 forward. TBBB is ANNUAL only (no quarterly view). Mirrors amzn-setup.js.
import { tbbbResults } from './tbbb.js';

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

var yIdx = annualIdx(tbbbResults.views.y);

export var tbbbSetup = {
  updated: tbbbResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever and legend chips. Actual vs the Summit model projection and, on Revenue, Bloomberg Street consensus. The window is rolling: annual shows the last 4 fiscal years plus the next 2 forward. Sources per the dataset header (js/results-data/tbbb.js).',
  source: tbbbResults.source,
  views: {
    y: { label: 'Annual', note: 'Rolling — the last 4 fiscal years plus the next 2 forward years. ' + tbbbResults.views.y.note,
         metrics: sliceMetrics(tbbbResults.views.y, yIdx), sections: mergedSection(tbbbResults.views.y) }
  }
};
