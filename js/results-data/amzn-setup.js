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
    delete o.note;   // Setup drops the per-metric methodology notes (Dani, Aug 2026) — they clutter
                     // the pre-print view; the full notes still live on the Results sub-tab.
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

// Full range (Dani, Aug 2026) — the Setup chart now carries every period so the Results engine's own
// range controls (preset pills Last 4Q · Last 8Q · Reported · Forward · All + the dual-handle slider)
// become the period LEVER. The narrow pre-slice below (quarterlyIdx/annualIdx) is kept for reference
// but no longer applied; the engine still trims the forward horizon per its own rule.
var qIdx = amznResults.views.q.metrics.rev.periods.map(function(_, i){ return i; });
var yIdx = amznResults.views.y.metrics.rev.periods.map(function(_, i){ return i; });

export var amznSetup = {
  updated: amznResults.updated,
  intro: '',
  source: amznResults.source,
  views: {
    // Setup view notes removed (Dani, Aug 2026) — the "Rolling …" + methodology/source blurb was
    // clutter here; the full note still lives on the Results sub-tab.
    q: { label: 'Quarterly', note: '',
         metrics: sliceMetrics(amznResults.views.q, qIdx), sections: mergedSection(amznResults.views.q) },
    y: { label: 'Annual', note: '',
         metrics: sliceMetrics(amznResults.views.y, yIdx), sections: mergedSection(amznResults.views.y) }
  }
};
