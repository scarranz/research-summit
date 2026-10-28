// results-data/sn-setup.js — the SN "Setup" dataset for the Results ENGINE, rendered inside
// Evolution ▸ Earnings ▸ Setup. Same engine and same underlying data as snResults, with the two
// Setup-specific rules (EARNINGS_CONVENTIONS §6a-viii-bis): ONE merged section, and a NARROW
// ROLLING window — the last 8 reported quarters plus the ONE next (forecast) quarter — so it
// advances by itself as prints land. Same pattern as amzn-setup.js / lyft-setup.js / spot-setup.js.
//
// ⚠ WHAT IS REAL HERE AND WHAT IS NOT. This file is DERIVED — it slices snResults and invents
// nothing. So the chart it feeds is real today: reported actuals through 2Q26, and Bloomberg
// Street consensus on 3Q26/4Q26 from the FA_SN company-financials export.
//
// ⚠ THE KPI SET IS GATED (Sep 17 2026). EARNINGS_CONVENTIONS §5 rule 6 says the metrics allowed in the
// Setup grid and charts are EXACTLY the ones BBG_CONSENSUS.txt authorizes for the ticker —
// "a metric existing in the Summit DCF, in the company's disclosure, or already drawn in the
// Overview does NOT make it a valid Setup/chart KPI." SN landed in that file on Sep 17 2026; the
// AUTHORIZED list below is its code set. If the workbook adds a line, add its key here too.
//
// ⚠ NO SUMMIT LINE. There is no Summit DCF model for SN, so `summit` is null throughout and the
// engine draws actual vs Street only. That is a real gap, not a rendering bug.
//
// The full refresh path is in scripts/consensus/README.md and map_sn.json.
import { snResults } from './sn.js';

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

// Annual: the reported years plus the one next forecast year — the §6a-viii "annual picture".
var Y_BACK = 4;
function annualIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Y_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}

// EARNINGS_CONVENTIONS §5 rule 6 — the Setup grid and charts carry EXACTLY the lines
// BBG_CONSENSUS.txt authorizes for SN (verified Sep 17 2026, see scripts/consensus/map_sn.json).
// The txt has no adjusted EPS, adjusted net income, GAAP EBITDA, region split, D&A or tax rate,
// so those stay on Results but never enter the Setup.
var AUTHORIZED = ['rev','segCleaning','segCookBev','segFoodPrep','segBeautyHome','brandShark','brandNinja',
  'grossProfit','opIncome','ebitdaAdj','niGaap','epsGaap','sm','ga','rd'];

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, [])
    .map(function(g){ return { label: g.label, keys: g.keys.filter(function(k){ return AUTHORIZED.indexOf(k) >= 0; }) }; })
    .filter(function(g){ return g.keys.length; });
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}
function authorizedOnly(metrics){
  var out = {};
  AUTHORIZED.forEach(function(k){ if (metrics[k]) out[k] = metrics[k]; });
  return out;
}

var qIdx = quarterlyIdx(snResults.views.q);
var yIdx = annualIdx(snResults.views.y);

export var snSetup = {
  updated: snResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart and table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips and the guidance band on the annual lines SharkNinja actually guides. Two things to hold onto. There is <b>no Summit line</b> — no DCF model exists for SN — so the comparison is reported vs. Street only. And SharkNinja <b>guides the fiscal year, never the quarter</b>, so the guidance band appears on the annual view and not the quarterly one; the full guidance walk is under Management ▸ Track Record. The quarterly window is rolling — the last 8 reported quarters plus the one next forecast quarter — so it advances by itself as prints land.',
  source: snResults.source,
  surprise: false,
  views: {
    q: { label: 'Quarterly',
         note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter. SharkNinja does not guide by quarter, so no guidance band renders here. ' + snResults.views.q.note,
         metrics: authorizedOnly(sliceMetrics(snResults.views.q, qIdx)), sections: mergedSection(snResults.views.q) },
    y: { label: 'Annual',
         note: 'Reported years plus the one next forecast year. The guidance band on this view is the company\'s own FY outlook — see Management ▸ Track Record for how it moved print by print. ' + snResults.views.y.note,
         metrics: authorizedOnly(sliceMetrics(snResults.views.y, yIdx)), sections: mergedSection(snResults.views.y) }
  }
};
