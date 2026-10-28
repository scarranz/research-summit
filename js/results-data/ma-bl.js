// results-data/ma-bl.js — Mastercard "Bottom Line ▸ General" dataset for the Results ENGINE (PROFILE_PLAYBOOK §13 BL-GEN): where net revenue
// stops being revenue. Same engine and numbers as maResults, re-cut into three sections:
//   blprof — operating income, EBITDA, net income, pre-tax income and EPS, each profit line with its margin on net revenue
//   blcost — operating costs (total, G&A, advertising and marketing, D&A, stock-based comp, litigation), interest and below-the-line lines
//            and income tax, the cost lines each as a % of net revenue
//   blcash — operating cash flow, free cash flow, capex and share repurchases, with their % of net revenue
// Mastercard has no cost of revenue and so no gross profit: the bridge starts from net revenue (client incentives are already netted in it).
// The unique section keys keep this instance's canvases apart from the Results tab's.
import { maResults } from './ma.js';

var KEEP = ['rev', 'opinc', 'ebitda', 'ni', 'pti', 'eps', 'opex', 'ga', 'am', 'dna', 'sbc', 'lit', 'intexp', 'netint', 'intnet', 'invinc', 'oie', 'tax', 'cfo', 'fcf', 'capex', 'buyback'];
var PCT = { opex: 'opex % of net revenue', ga: 'G&A % of net revenue', am: 'advertising & marketing % of net revenue', dna: 'D&A % of net revenue',
            sbc: 'stock-based comp % of net revenue', capex: 'capex % of net revenue', cfo: 'operating cash flow % of net revenue', fcf: 'free cash flow % of net revenue',
            buyback: 'repurchases % of net revenue' };
function pick(view){
  var out = {};
  KEEP.forEach(function(k){
    var m = view.metrics[k]; if (!m) return;
    var o = {}; Object.keys(m).forEach(function(f){ o[f] = m[f]; });
    if (PCT[k]){ o.marginOf = 'rev'; o.marginLabel = PCT[k]; }
    out[k] = o; });
  return out;
}
function sections(){
  return [
    { key: 'blprof', label: 'Profitability & margins', defaultMetric: 'opinc', groups: [
      { label: 'Profit', keys: ['opinc', 'ebitda', 'ni', 'pti', 'eps'] } ] },
    { key: 'blcost', label: 'Costs and below the line', defaultMetric: 'opex', groups: [
      { label: 'Operating costs', keys: ['opex', 'ga', 'am', 'dna', 'sbc', 'lit'] },
      { label: 'Below the line', keys: ['intexp', 'netint', 'intnet', 'invinc', 'oie', 'tax'] } ] },
    { key: 'blcash', label: 'Cash flow and capital', defaultMetric: 'cfo', groups: [
      { label: 'Cash flow and capital', keys: ['cfo', 'fcf', 'capex', 'buyback'] } ] }
  ];
}
export var maBl = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT and SoFi
  updated: maResults.updated,
  source: maResults.source,
  views: {
    q: { label: 'Quarterly', note: maResults.views.q.note, metrics: pick(maResults.views.q), sections: sections() },
    y: { label: 'Annual', note: maResults.views.y.note, metrics: pick(maResults.views.y), sections: sections() }
  }
};
