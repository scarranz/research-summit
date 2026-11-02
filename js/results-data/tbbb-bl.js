// results-data/tbbb-bl.js — the "Bottom Line ▸ General" dataset for the Results ENGINE: where Tiendas 3B's revenue turns into profit.
// Same engine and numbers as tbbbResults (actuals from the earnings releases and the 20-F, Bloomberg consensus), re-cut into three sections:
//   blprof  — gross profit, operating profit, reported EBITDA, EBITDA ex-SBC and net income, each with its margin on revenue
//   blexp   — the expense lines (sales, administrative, administrative ex-SBC) and the non-cash SBC, each as a % of revenue
//   blbelow — what sits between operating profit and net income: financial income, financial costs (lease interest), FX and income tax
// The unique section keys keep this instance's canvases apart from the Results tab's.
import { tbbbResults } from './tbbb.js';

var KEEP = ['gp', 'opinc', 'ebitda', 'adj', 'ebitdaal', 'netinc', 'sales', 'admin', 'adminx', 'sbc', 'rent', 'fin', 'fcost', 'fx', 'tax', 'rev'];
function pick(view){
  var out = {};
  KEEP.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; });
  return out;
}
function sections(){
  return [
    { key: 'blprof', label: 'Profitability & margins', defaultMetric: 'adj', groups: [
      { label: 'Profit', keys: ['gp', 'opinc', 'ebitda', 'adj', 'ebitdaal', 'netinc'] } ] },
    { key: 'blexp', label: 'Expense lines', defaultMetric: 'sales', groups: [
      { label: 'Operating expenses', keys: ['sales', 'admin', 'adminx'] },
      { label: 'Non-cash', keys: ['sbc'] },
      { label: 'Leases (IFRS 16)', keys: ['rent'] } ] },
    { key: 'blbelow', label: 'Operating profit to net income', defaultMetric: 'fcost', groups: [
      { label: 'Below operating profit', keys: ['fin', 'fcost', 'fx', 'tax'] } ] }
  ];
}
export var tbbbBl = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT and SOFI
  updated: tbbbResults.updated,
  currency: tbbbResults.currency,
  currencyName: tbbbResults.currencyName,
  source: tbbbResults.source,
  estMatrix: tbbbResults.estMatrix,
  views: {
    q: { label: 'Quarterly', note: tbbbResults.views.q.note, metrics: pick(tbbbResults.views.q), sections: sections() },
    y: { label: 'Annual', note: tbbbResults.views.y.note, metrics: pick(tbbbResults.views.y), sections: sections() }
  }
};
