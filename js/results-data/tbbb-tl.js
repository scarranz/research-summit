// results-data/tbbb-tl.js — the "Top Line ▸ General" dataset for the Results ENGINE: where Tiendas 3B's growth comes from.
// Same engine and numbers as tbbbResults (actuals from the earnings releases and the 20-F, Bloomberg consensus), re-cut into two sections:
//   tlrev — total revenue
//   tlkpi — the operating drivers: stores at period end, net new stores, same-store sales and distribution centers
// 3B has one reportable segment (grocery hard discount; recyclables are under 0.2% of revenue), so growth is a store-count
// times same-store-sales story. The unique section keys keep this instance's canvases apart from the Results tab's.
import { tbbbResults } from './tbbb.js';

var KEEP = ['rev', 'stores', 'adds', 'sss', 'dcs'];
function pick(view){
  var out = {};
  KEEP.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; });
  return out;
}
function sections(){
  return [
    { key: 'tlrev', label: 'Revenue', defaultMetric: 'rev', groups: [
      { label: 'Totals', keys: ['rev'] } ] },
    { key: 'tlkpi', label: 'Operating drivers', defaultMetric: 'stores', groups: [
      { label: 'Stores', keys: ['stores', 'adds', 'dcs'] },
      { label: 'Same-store sales', keys: ['sss'] } ] }
  ];
}
export var tbbbTl = {
  forwardQuarters: 2,
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
