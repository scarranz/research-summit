// results-data/googl-setup.js — the GOOGL "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as googlResults, but with TWO Setup-specific rules
// (§6a-viii-bis):
//
//   1. CLUBBED into ONE merged section (key 'setup') so every tracked line lives in a single
//      chart + table + picker (Amazon splits Top Line vs Margins; Setup keeps one). The unique
//      section key means its engine canvases/tables/sliders never collide with the Results tab's.
//      Margin lines come from each metric's own `marginOf` — only PROFIT lines carry a margin;
//      revenue / segment-revenue / a backlog / a plain KPI have none, so the engine draws none.
//
//   2. NARROW period windows — NOT the full timeline:
//        • Quarterly is SEASONAL: only the forecast quarter across prior years (Q3 → Q3 25/24/23…)
//          plus the ONE next quarter. Column-to-column is therefore year-over-year.
//        • Annual: the reported history plus only the NEXT 2 fiscal years (not the whole forward run).
//      This is enforced HERE by slicing every metric's parallel arrays to the chosen period indices,
//      so the engine (which just plots what the dataset holds) shows exactly those periods.
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

// Quarterly SEASONAL indices: the same fiscal quarter across years, up to the forecast quarter.
// Forecast quarter = the first quarter with no reported actual (on the revenue line).
function seasonalIdx(view){
  var rev = view.metrics.rev, qn = null, i;
  for (i = 0; i < rev.periods.length; i++){
    if (rev.act[i] == null){ var mm = /^(\d)Q/.exec(rev.periods[i]); qn = mm ? mm[1] : null; break; }
  }
  if (qn == null){ var lm = /^(\d)Q/.exec(rev.periods[rev.periods.length - 1]); qn = lm ? lm[1] : '3'; }
  var re = new RegExp('^' + qn + 'Q'), idx = [];
  rev.periods.forEach(function(p, j){ if (re.test(p)) idx.push(j); });
  return idx;
}

// Annual indices: the reported history + only the NEXT 2 fiscal years (drop the far-forward run).
function annualIdx(view){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var end = Math.min(lastA + 2, rev.periods.length - 1), idx = [];
  for (var i = 0; i <= end; i++) idx.push(i);
  return idx;
}

function mergedSection(view){
  // One section, keeping the original groups as the <select> optgroups (Top Line / Margins / …).
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = seasonalIdx(googlResults.views.q);
var yIdx = annualIdx(googlResults.views.y);

export var googlSetup = {
  updated: googlResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, and margin lines for the profit lines (only profit lines carry a margin — a backlog, a KPI or a revenue line does not). Quarterly is SEASONAL (the forecast quarter across prior years + the next quarter); annual shows the history + next 2 fiscal years. Street from the Bloomberg archive; Summit is empty for now (pending the estimate-visibility work).',
  source: googlResults.source,
  views: {
    q: { label: 'Quarterly (seasonal)', note: 'Seasonal — the same fiscal quarter across years (forecast quarter + prior years) plus the one next quarter, so column-to-column is year-over-year. ' + googlResults.views.q.note,
         metrics: sliceMetrics(googlResults.views.q, qIdx), sections: mergedSection(googlResults.views.q) },
    y: { label: 'Annual', note: 'Reported history + the next 2 fiscal years only. ' + googlResults.views.y.note,
         metrics: sliceMetrics(googlResults.views.y, yIdx), sections: mergedSection(googlResults.views.y) }
  }
};
