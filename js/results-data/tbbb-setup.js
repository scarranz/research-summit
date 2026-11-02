// results-data/tbbb-setup.js — the TBBB "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as tbbbResults, with the Setup rules (EARNINGS_CONVENTIONS
// §6a-viii-bis): ONE merged section (key 'setup'), no per-metric methodology notes (they live on
// the Results sub-tab), and the full period range so the engine's own range controls are the lever.
// Quarterly AND annual, as in amzn-setup.js / spot-setup.js. The Street comes from the Bloomberg
// vintages (estMatrix.cons), so the matrix is carried across.
import { tbbbResults } from './tbbb.js';

function sliceMetrics(view, idx){
  var out = {};
  Object.keys(view.metrics).forEach(function(k){
    var m = view.metrics[k], o = {};
    Object.keys(m).forEach(function(f){
      o[f] = Array.isArray(m[f]) ? idx.map(function(i){ return m[f][i]; }) : m[f];
    });
    delete o.note;
    out[k] = o;
  });
  return out;
}

function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

var qIdx = tbbbResults.views.q.metrics.rev.periods.map(function(_, i){ return i; });
var yIdx = tbbbResults.views.y.metrics.rev.periods.map(function(_, i){ return i; });

export var tbbbSetup = {
  updated: tbbbResults.updated,
  currency: tbbbResults.currency,
  currencyName: tbbbResults.currencyName,
  intro: '',
  source: tbbbResults.source,
  estMatrix: tbbbResults.estMatrix,
  conv: false,   // no "Road to the print" in Setup: it lives in Evolution ▸ Results
  views: {
    q: { label: 'Quarterly', note: '',
         metrics: sliceMetrics(tbbbResults.views.q, qIdx), sections: mergedSection(tbbbResults.views.q) },
    y: { label: 'Annual', note: '',
         metrics: sliceMetrics(tbbbResults.views.y, yIdx), sections: mergedSection(tbbbResults.views.y) }
  }
};
