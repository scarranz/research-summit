// results-data/sofi-bl.js — the "Bottom Line ▸ General" dataset for the Results ENGINE: where SoFi's net revenue stops being
// revenue. Same engine and numbers as sofiResults (actuals, Summit frozen, Bloomberg consensus), re-cut into two sections:
//   blprof — adjusted EBITDA (which SoFi guides and the Summit model projects), operating income, adjusted net income (the measure the
//            model projects; GAAP net income is not drawn) and income tax with its effective rate, each with its margin on net revenue
//   blexp  — the functional expense lines of the income statement and the provision, each as a % of net revenue
// SoFi is a bank: there is no cost of revenue and no gross profit, so the bridge starts from total net revenue (net interest
// income plus noninterest income). The unique section keys keep this instance's canvases apart from the Results tab's.
import { sofiResults } from './sofi.js';

var KEEP = ['rev', 'ebitda', 'opinc', 'earnings', 'tax', 'etr', 'nie', 'tdev', 'sm', 'coo', 'ga', 'pcl', 'sbc'];
function pick(view){
  var out = {};
  KEEP.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; });
  return out;
}
function sections(){
  return [
    { key: 'blprof', label: 'Profitability & margins', defaultMetric: 'ebitda', groups: [
      { label: 'Profit', keys: ['ebitda', 'opinc', 'earnings', 'tax', 'etr'] } ] },
    { key: 'blexp', label: 'Expense lines', defaultMetric: 'nie', groups: [
      { label: 'Noninterest expense', keys: ['nie', 'tdev', 'sm', 'coo', 'ga'] },
      { label: 'Credit and equity', keys: ['pcl', 'sbc'] } ] }
  ];
}
export var sofiBl = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT
  updated: sofiResults.updated,
  source: sofiResults.source,
  views: {
    q: { label: 'Quarterly', note: sofiResults.views.q.note, metrics: pick(sofiResults.views.q), sections: sections() },
    y: { label: 'Annual', note: sofiResults.views.y.note, metrics: pick(sofiResults.views.y), sections: sections() }
  }
};
