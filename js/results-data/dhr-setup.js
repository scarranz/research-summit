// results-data/dhr-setup.js — the DHR "Setup" dataset for the Results ENGINE, rendered inside
// Evolution ▸ Earnings ▸ Setup. Same engine and same data as dhrResults, with the one Setup-specific
// rule that matters (EARNINGS_CONVENTIONS §6a-viii-bis): the two Results blocks — Top line and
// Margins & profitability — are CLUBBED INTO ONE merged section, key `setup`, so every tracked line
// lives in a single chart + table instead of two. Same pattern as amzn-setup.js / googl-setup.js.
//
// WHY THE SECTION KEY MATTERS. The engine derives its element ids from the section key
// (rsChart-<key>, rsTable-<key>, the slider, the collapsible) and looks the canvas up with
// getElementById, NOT scoped to a pane. Setup and Results are two engine instances alive on the
// same page, so a key of 'top' here would collide with the Results tab's own Top line block and
// the engine would draw into whichever node came first in the document. 'setup' keeps them apart.
//
// MARGINS COME ALONG FOR FREE and are already correct: the engine draws a right-axis margin line
// exactly where a metric declares `marginOf`, and in dhrResults only the profit lines do —
// revenue, the three segment revenue lines and core growth carry none. That is the
// "disabled where it does not apply" rule of §6a-viii-bis, satisfied by the data rather than by a
// control. Do not add `marginOf` to a revenue line to make the toggle light up.
import { dhrResults } from './dhr.js';

function sliceMetrics(view, idx){
  var out = {};
  Object.keys(view.metrics).forEach(function(k){
    var m = view.metrics[k], o = {};
    Object.keys(m).forEach(function(f){
      o[f] = Array.isArray(m[f]) ? idx.map(function(i){ return m[f][i]; }) : m[f];
    });
    delete o.note;   // Setup drops the per-metric methodology notes — they clutter the pre-print
                     // view. The full notes still render on the Results sub-tab, which is where a
                     // reader goes to ask how a number was built.
    out[k] = o;
  });
  return out;
}

// The narrow rolling windows §6a-viii-bis specifies. They are NOT applied — see the note below —
// but they are kept because they are the spec, and because reinstating them is a one-line change
// if the desk decides the lever is not enough.
var Q_BACK = 8;                       // reported quarters + the ONE next forecast quarter = 9 columns
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}
var Y_BACK = 3, Y_FWD = 2;            // last 4 fiscal years + the next 2 forward = 6 columns
function annualIdx(view){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - Y_BACK), end = Math.min(lastA + Y_FWD, rev.periods.length - 1), idx = [];
  for (var i = start; i <= end; i++) idx.push(i);
  return idx;
}

// ONE merged section. Every group from both Results sections, in order, under a single picker.
function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

// FULL RANGE, following Amazon (Dani, Aug 2026). The Setup chart carries every period so the
// engine's own range controls — the preset pills (Last 4Q · Last 8Q · Reported · Forward · All)
// plus the dual-handle slider and drag-to-zoom — become the period LEVER, which is a better tool
// than a window baked into the data. The pre-slice helpers above are kept for reference.
var qIdx = dhrResults.views.q.metrics.rev.periods.map(function(_, i){ return i; });
var yIdx = dhrResults.views.y.metrics.rev.periods.map(function(_, i){ return i; });

export var dhrSetup = {
  updated: dhrResults.updated,
  intro: '',
  source: dhrResults.source,
  views: {
    q: { label: 'Quarterly', note: '',
         metrics: sliceMetrics(dhrResults.views.q, qIdx), sections: mergedSection(dhrResults.views.q) },
    y: { label: 'Annual', note: '',
         metrics: sliceMetrics(dhrResults.views.y, yIdx), sections: mergedSection(dhrResults.views.y) }
  }
};
