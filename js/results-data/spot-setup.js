// results-data/spot-setup.js — the SPOT "Setup" dataset for the Results ENGINE, rendered
// inside Earnings ▸ Setup. Same engine and same underlying data as spotResults, but with the
// two Setup-specific rules (EARNINGS_CONVENTIONS §6a-viii-bis): ONE merged section and a
// NARROW ROLLING window — the last 8 reported quarters plus the ONE next (forecast) quarter,
// so it advances by itself as prints land. Same pattern as amzn-setup.js / lyft-setup.js.
//
// ⚠ This file did not exist until Aug 2026. `ceAnnualBody()` in js/overviews/spot.js has always
// called `resultsHtml('SPOT_SETUP')`, but SPOT_SETUP was never registered in RESULTS_DATA — so
// the engine returned '' and the whole "Setup picture" chart silently rendered nothing.
//
// ⚠ CURRENCY: Spotify reports in euros. `currency`/`currencyName` MUST be carried across from
// spotResults or the engine falls back to '$'/'US$' and labels a euro chart in dollars.
//
// SPOT has no annual view in its Results dataset (the quarterly record is the whole tab), so
// this exposes the quarterly view only.
import { spotResults } from './spot.js';

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

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = quarterlyIdx(spotResults.views.q);

export var spotSetup = {
  updated: spotResults.updated,
  currency: spotResults.currency,
  currencyName: spotResults.currencyName,
  intro: 'The Setup chart — the same actuals-vs-estimates chart and table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, the Summit line, and the guidance line on the two monetary lines Spotify actually guides (total revenue and operating income). Spotify guides a single POINT rather than a range, so the guidance band renders as a line. The window is rolling: the last 8 reported quarters plus the one next forecast quarter, so it advances by itself as new prints land. Sources and every caveat per the dataset header (js/results-data/spot.js) — including the Premium/Ad-Supported basis break at 1Q26, which applies here too.',
  source: spotResults.source,
  views: {
    q: { label: 'Quarterly',
         note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter. ' + spotResults.views.q.note,
         metrics: sliceMetrics(spotResults.views.q, qIdx), sections: mergedSection(spotResults.views.q) }
  }
};
