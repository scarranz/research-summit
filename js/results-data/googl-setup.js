// results-data/googl-setup.js — the GOOGL "Setup" dataset for the Results ENGINE, rendered inside
// Earnings ▸ Setup. Same data as googlResults, but CLUBBED into ONE merged section (§6a-viii-bis):
// every tracked line lives in a single chart + table + picker (Amazon splits Top Line vs Margins;
// Setup keeps one). The section key is 'setup' — unique, so its engine canvases/tables/sliders never
// collide with the Results tab's 'top'/'margins' when both instances are on the page.
//
// Margin controls come from each metric's own `marginOf` (revenue/segment lines have none, so the
// engine simply shows no margin line for them — "disabled where it does not apply").
import { googlResults } from './googl.js';

function mergedSection(view){
  // One section, but keep the original groups as the <select> optgroups (Top Line / Margins / …).
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
}

export var googlSetup = {
  updated: googlResults.updated,
  intro: 'The Setup chart — the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked line in a single grouped picker, with the period lever, the legend chips, and margin lines for the profit lines. Street from the Bloomberg archive; Summit is empty for now (pending the estimate-visibility work).',
  source: googlResults.source,
  views: {
    q: { label: 'Quarterly', note: googlResults.views.q.note,
         metrics: googlResults.views.q.metrics, sections: mergedSection(googlResults.views.q) },
    y: { label: 'Annual', note: googlResults.views.y.note,
         metrics: googlResults.views.y.metrics, sections: mergedSection(googlResults.views.y) }
  }
};
