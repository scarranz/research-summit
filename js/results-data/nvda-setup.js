// results-data/nvda-setup.js — the NVDA "Setup" dataset for the Results ENGINE, rendered
// inside Earnings ▸ Setup. Same engine and same underlying data as nvdaResults, but with the
// two Setup-specific rules (EARNINGS_CONVENTIONS §6a-viii-bis): ONE merged section and a
// NARROW ROLLING window — the last 8 reported quarters plus the TWO next (forecast) quarters (analyst rule),
// so it advances by itself as prints land. Same pattern as amzn-setup.js / meta-setup.js.
//
// Setup is quarterly by design (a rolling window of quarters); the annual view lives in Evolution ▸ Results.
import { nvdaResults } from './nvda.js';

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

var Q_BACK = 8;   // reported quarters shown; +2 forecast quarters => 10 columns
var Q_FWD = 2;
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= Math.min(fc + Q_FWD - 1, rev.periods.length - 1); i++) idx.push(i);
  return idx;
}

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = quarterlyIdx(nvdaResults.views.q);

export var nvdaSetup = {
  updated: nvdaResults.updated,
  anchorForecast: true,
  forwardQuarters: 2,
  intro: 'The Setup chart — the same actuals-vs-estimates chart and table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, the Summit line, and the guidance band on the line NVIDIA guides by quarter (revenue). Periods are NVIDIA fiscal quarters (the fiscal year ends in late January).',
  source: nvdaResults.source,
  views: {
    q: { label: 'Quarterly',
         note: 'Rolling — the last 8 reported quarters plus the next two (forecast) quarters. ' + nvdaResults.views.q.note,
         metrics: sliceMetrics(nvdaResults.views.q, qIdx), sections: mergedSection(nvdaResults.views.q) }
  }
};
