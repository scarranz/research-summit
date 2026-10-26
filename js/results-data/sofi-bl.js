// results-data/sofi-bl.js — the "Bottom Line ▸ General" dataset for the Results ENGINE: where SoFi's net revenue stops being
// revenue. Same engine and numbers as sofiResults (actuals, Summit frozen, Bloomberg consensus), re-cut into two sections:
//   blprof — pre-tax income, income tax and its effective rate, GAAP net income (each with its margin). Adjusted EBITDA, adjusted net
//            income and EPS, the lines SoFi guides, live in Evolution ▸ Results and are not drawn a second time here.
//   blexp  — the functional expense lines of the income statement and the provision, each as a % of net revenue
// SoFi is a bank: there is no cost of revenue and no gross profit, so the bridge starts from total net revenue (net interest
// income plus noninterest income). The unique section keys keep this instance's canvases apart from the Results tab's.
import { sofiResults } from './sofi.js';

var KEEP = ['rev', 'opinc', 'tax', 'ni', 'nie', 'tdev', 'sm', 'coo', 'ga', 'pcl', 'sbc'];
function pick(view){
  var out = {};
  KEEP.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; });
  return out;
}
function sections(){
  return [
    { key: 'blprof', label: 'Profitability & margins', defaultMetric: 'opinc', groups: [
      { label: 'Pre-tax income to net income', keys: ['opinc', 'tax', 'ni'] } ] },
    { key: 'blexp', label: 'Expense lines', defaultMetric: 'nie', groups: [
      { label: 'Noninterest expense', keys: ['nie', 'tdev', 'sm', 'coo', 'ga'] },
      { label: 'Credit and equity', keys: ['pcl', 'sbc'] } ] }
  ];
}
export var sofiBl = {
  updated: sofiResults.updated,
  source: sofiResults.source,
  views: {
    q: { label: 'Quarterly', note: sofiResults.views.q.note, metrics: pick(sofiResults.views.q), sections: sections() },
    y: { label: 'Annual', note: sofiResults.views.y.note, metrics: pick(sofiResults.views.y), sections: sections() }
  }
};
