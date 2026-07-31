// results-data/lyft-setup.js — the LYFT "Setup" dataset for the Results ENGINE, rendered
// inside Earnings ▸ Setup. Same engine and same underlying data as lyftResults, but with the
// two Setup-specific rules (EARNINGS_CONVENTIONS §6a-viii-bis): ONE merged section and a
// NARROW ROLLING window — the last 8 reported quarters plus the ONE next (forecast) quarter,
// so it advances by itself as prints land. Same pattern as amzn-setup.js / meta-setup.js.
//
// LYFT has no annual view in its Results dataset (the quarterly record is the whole tab), so
// this exposes the quarterly view only.
import { lyftResults } from './lyft.js';

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
  var rev = view.metrics.gb, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'gb', groups: groups }];
}

var qIdx = quarterlyIdx(lyftResults.views.q);

export var lyftSetup = {
  updated: lyftResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart and table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, the Summit line, and the guidance band on the two lines Lyft actually guides (Gross Bookings and Adjusted EBITDA). The window is rolling: the last 8 reported quarters plus the one next forecast quarter, so it advances by itself as new prints land. Sources per the dataset header (js/results-data/lyft.js) — including the FREENOW and 4Q25 caveats, which apply here too.',
  source: lyftResults.source,
  views: {
    q: { label: 'Quarterly',
         note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter. ' + lyftResults.views.q.note,
         metrics: sliceMetrics(lyftResults.views.q, qIdx), sections: mergedSection(lyftResults.views.q) }
  }
};
