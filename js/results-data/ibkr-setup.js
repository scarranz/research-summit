// results-data/ibkr-setup.js — the IBKR "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same engine + data as ibkrResults, sliced to a rolling window: the last 8
// reported quarters + the one next (forecast) quarter, so column-to-column reads year-over-year as
// new prints land. Quarterly only (IBKR has no annual view yet). Street from the Bloomberg export;
// Summit empty (no Summit DCF for IBKR).
import { ibkrResults } from './ibkr.js';

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

// Rolling window: the last 8 reported quarters + the ONE next (forecast) quarter. Forecast quarter =
// the first with no reported actual on the anchor line; the window rolls forward on its own.
var Q_BACK = 8;
function quarterlyIdx(view){
  var anchor = view.metrics.nii, fc = -1, i;
  for (i = 0; i < anchor.periods.length; i++){ if (anchor.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = anchor.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}

// Annual ROLLING window: the last 4 fiscal years + the next 2 forward years.
function annualIdx(view){
  var anchor = view.metrics.nii, lastA = -1;
  anchor.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - 3), end = Math.min(lastA + 2, anchor.periods.length - 1), idx = [];
  for (var i = start; i <= end; i++) idx.push(i);
  return idx;
}

var qIdx = quarterlyIdx(ibkrResults.views.q);
var yIdx = annualIdx(ibkrResults.views.y);

export var ibkrSetup = {
  updated: ibkrResults.updated,
  intro: '',
  source: ibkrResults.source,
  views: {
    q: { label: 'Quarterly',
         note: 'Rolling — the last 8 reported quarters plus the one next (forecast) quarter; advances by itself as new prints land. ' + ibkrResults.views.q.note,
         metrics: sliceMetrics(ibkrResults.views.q, qIdx),
         sections: ibkrResults.views.q.sections },
    y: { label: 'Annual',
         note: 'Rolling — the last 4 fiscal years plus the next 2 forward years. ' + ibkrResults.views.y.note,
         metrics: sliceMetrics(ibkrResults.views.y, yIdx),
         sections: ibkrResults.views.y.sections }
  }
};
