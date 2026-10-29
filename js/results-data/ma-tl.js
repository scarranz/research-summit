// results-data/ma-tl.js — Mastercard "Top Line ▸ General" dataset for the Results ENGINE (PROFILE_PLAYBOOK §10 TL-GEN): net revenue,
// the two net-revenue segments (Payment Network and Value-Added Services), the gross-to-net revenue build and the volume and transaction
// drivers, re-cut from maResults (Bloomberg actuals and consensus, Summit annual, frozen). Unique section keys keep this engine instance
// apart from the Results tab's canvases. Segment-level Summit lines do not exist (the DCF model carries total revenue only).
import { maResults } from './ma.js';

var KEEP = ['rev', 'pnr', 'vas', 'gross', 'dom', 'xb', 'card', 'tp', 'oth', 'cinc', 'pvol', 'ptx', 'netyld', 'grossyld', 'incyld'];
function pick(view){
  var out = {};
  KEEP.forEach(function(k){ if (view.metrics[k]) out[k] = view.metrics[k]; });
  return out;
}
function sections(){
  return [
    { key: 'tlrev', label: 'Net revenue and its build', defaultMetric: 'rev', groups: [
      { label: 'Totals', keys: ['rev'] },
      { label: 'Net revenue by segment', keys: ['pnr', 'vas'] },
      { label: 'Revenue build (gross to net)', keys: ['gross', 'dom', 'xb', 'card', 'tp', 'oth', 'cinc'] } ] },
    { key: 'tlvol', label: 'Volumes and transactions', defaultMetric: 'pvol', groups: [
      { label: 'Network drivers', keys: ['pvol', 'ptx'] },
      { label: 'Yield (% of purchase volume)', keys: ['netyld', 'grossyld', 'incyld'] } ] }
  ];
}
export var maTlGeneral = {
  defaultRange: maResults.defaultRange,
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT and SoFi
  updated: maResults.updated,
  source: maResults.source,
  views: {
    q: { label: 'Quarterly', note: maResults.views.q.note, metrics: pick(maResults.views.q), sections: sections() },
    y: { label: 'Annual', note: maResults.views.y.note, metrics: pick(maResults.views.y), sections: sections() }
  }
};
