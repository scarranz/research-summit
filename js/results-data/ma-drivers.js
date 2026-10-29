// results-data/ma-drivers.js — Mastercard "Top Line ▸ Drivers" dataset for the Results ENGINE: the volume and transaction drivers and the price per unit
// that the Summit model and the Street both carry, re-cut from maResults (nothing typed, one home for every number):
//   volume and transactions   purchase volume and switched transactions (Bloomberg NTWK_SPENDNG_VOL_PURCHSE and PAYMENT_PROCESSING_TRANS; Summit annual and 2026 quarters)
//   price per unit            transaction processing revenue per 100 switched transactions, card related revenue as % of purchase volume, client incentives as % of gross
//                             revenue; each a quotient of two lines of the same source, so the actual, the Street and the Summit model are all measured the same way
// The cards in market and the headcount that this tab used to chart are archived in ma-drivers-model.js: the Street does not model them and the Summit model's
// revenue build does not run on them.
import { maResults } from './ma.js';

function quot(num, den, mult){
  var out = { periods: num.periods };
  ['act', 'summit', 'cons'].forEach(function(f){
    out[f] = num.periods.map(function(p, i){
      var a = num[f] && num[f][i], b = den[f] && den[f][i];
      return (a == null || b == null || !b) ? null : Math.round(a / b * mult * 10000) / 10000;
    });
  });
  return out;
}
function build(view){
  var M = maResults.views[view].metrics, out = {}, nul = M.rev.periods.map(function(){ return null; });
  function copy(k, group){
    var m = M[k], o = {}; Object.keys(m).forEach(function(f){ o[f] = m[f]; });
    o.group = group; out[k] = o;
  }
  function derived(k, label, short, group, unit, q, note){
    var o = { label: label, short: short, group: group, unit: unit, guideLo: nul, guideHi: nul, note: note }, v = q;
    o.periods = v.periods; o.act = v.act; o.summit = v.summit; o.cons = v.cons;
    out[k] = o;
  }
  copy('pvol', 'Volume and transactions'); copy('ptx', 'Volume and transactions');
  derived('tpfee', 'Transaction processing revenue per 100 switched transactions', 'Fee per 100 transactions', 'Price per unit', 'eps', quot(M.tp, M.ptx, 100),
    'Transaction processing revenue (US$ M) divided by switched transactions (M), times 100, so the fee reads in dollars per 100 transactions. The same quotient for the actual, the Street and the Summit model.');
  derived('cardyld', 'Card related revenue as % of purchase volume', 'Card related yield', 'Price per unit', 'pct', quot(M.card, M.pvol, 100),
    'Domestic plus cross-border assessments (taken together, as the Summit model carries them) as a percentage of purchase volume.');
  var inc = { periods: M.cinc.periods };
  ['act', 'summit', 'cons'].forEach(function(f){ inc[f] = M.cinc[f]; });
  var incShare = { periods: inc.periods };
  ['act', 'summit', 'cons'].forEach(function(f){
    incShare[f] = inc.periods.map(function(p, i){ var a = M.cinc[f] && M.cinc[f][i], g = M.gross[f] && M.gross[f][i]; return (a == null || g == null || !g) ? null : Math.round(-a / g * 1000000) / 10000; });
  });
  derived('incshare', 'Client incentives as % of gross revenue', 'Incentives % of gross', 'Price per unit', 'pct', incShare,
    'Client incentives (contra-revenue) over gross revenue: the share of the gross fee handed back to customers.');
  return out;
}
function sections(){
  return [
    { key: 'drvol', label: 'Volume and transactions', defaultMetric: 'pvol', groups: [ { label: 'Volume and transactions', keys: ['pvol', 'ptx'] } ] },
    { key: 'drprice', label: 'Price per unit', defaultMetric: 'tpfee', groups: [ { label: 'Price per unit', keys: ['tpfee', 'cardyld', 'incshare'] } ] }
  ];
}
export var maDrivers = {
  defaultRange: maResults.defaultRange,
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026)
  updated: maResults.updated,
  source: maResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Purchase volume and switched transactions are Mastercard’s supplemental data as recorded by Bloomberg; the price per unit lines are quotients of two reported lines. Street = Bloomberg consensus; Summit = the DCF model’s 2026 quarters.', metrics: build('q'), sections: sections() },
    y: { label: 'Annual', note: 'Annual actuals from the 10-K and the supplemental data; the Street and the Summit model carry the next years.', metrics: build('y'), sections: sections() }
  }
};
