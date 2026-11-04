// results-data/tpl-setup.js — the TPL "Setup" dataset for the Results ENGINE, rendered inside Evolution ▸ Earnings ▸ Setup
// (playbook §12 EV-SET). Same engine and same data as tplResults, with the two Setup rules: ONE merged section (key
// 'setup', so its canvases and tables never collide with the Results tab), and a narrow rolling window — the last 8
// reported quarters plus the next one, the last 4 fiscal years plus the next 2 — so it advances by itself as prints land.
//
// DERIVED: it slices tplResults and invents nothing. Windows are cut by PERIOD LABEL, not by index, because TPL's metrics
// carry different period axes (the consensus lines run to 3Q27, the segment and KPI lines stop at the last print). The
// Bloomberg consensus rides along as tplResults.estMatrix (period-keyed, so it survives the slice). No Summit model for
// TPL, so the engine draws actual vs Street only; TPL gives no guidance, so no guidance band.
import { tplResults } from './tpl.js';

function windowLabels(view, back, fwd){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - back), end = Math.min(lastA + fwd, rev.periods.length - 1), out = [];
  for (var i = start; i <= end; i++) out.push(rev.periods[i]);
  return out;
}
function sliceMetrics(view, labels){
  var out = {};
  Object.keys(view.metrics).forEach(function(k){
    var m = view.metrics[k], o = {};
    Object.keys(m).forEach(function(f){
      if (f === 'periods') { o[f] = labels.slice(); return; }
      if (Array.isArray(m[f]) && m[f].length === m.periods.length)
        o[f] = labels.map(function(p){ var i = m.periods.indexOf(p); return i < 0 ? null : m[f][i]; });
      else o[f] = m[f];
    });
    out[k] = o;
  });
  return out;
}
function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}
var qL = windowLabels(tplResults.views.q, 8, 1);
var yL = windowLabels(tplResults.views.y, 3, 2);

export var tplSetup = {
  updated: tplResults.updated,
  intro: '',
  source: tplResults.source,
  surprise: false,
  estMatrix: tplResults.estMatrix,
  views: {
    q: { label: 'Quarterly', note: 'Rolling — the last 8 reported quarters plus the next one. ' + tplResults.views.q.note,
         metrics: sliceMetrics(tplResults.views.q, qL), sections: mergedSection(tplResults.views.q) },
    y: { label: 'Annual', note: 'Rolling — the last 4 fiscal years plus the next 2. ' + tplResults.views.y.note,
         metrics: sliceMetrics(tplResults.views.y, yL), sections: mergedSection(tplResults.views.y) }
  }
};
