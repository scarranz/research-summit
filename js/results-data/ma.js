// results-data/ma.js — Mastercard (MA) dataset for the standardized "Results" engine (js/results.js).
// STATUS: ALL-NULL STUB. Every act/cons/guideLo/guideHi array is null-filled — fill from the Q2 2026
// BBG export (BBG_CONSENSUS.txt) + Mastercard 8-K guidance. Rules for this ticker:
//   · summit = null EVERYWHERE — Mastercard is NOT in the Summit DCF universe.
//   · guideLo / guideHi are REAL future fills — Mastercard DOES issue numeric guidance (net-revenue
//     growth ranges, opex, etc.), so the guidance band is meaningful once populated.
//   · no `evolution` key — the Estimates sub-tab shows a pending note until an evolution block is built.
// Monetary values US$ millions; EPS in dollars. null = not available. Do not hand-fabricate a series.

// Null-array helpers keep the all-stub state honest and compact (fill by replacing the arrays).
function nA(p){ return p.map(function(){ return null; }); }
function mStub(o){
  return { label:o.label, short:o.short, group:o.group, unit:o.unit,
    marginOf:o.marginOf, marginLabel:o.marginLabel,
    periods:o.periods,
    act:nA(o.periods), summit:nA(o.periods), cons:nA(o.periods),
    guideLo:nA(o.periods), guideHi:nA(o.periods) };   // STUB — fill from BBG export + MA 8-K guidance
}

var Q=['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'];
var Y=['2023','2024','2025','2026','2027'];

function maMetrics(P){
  return {
    rev:      mStub({ label:'Net revenue', short:'Net revenue', group:'Totals', unit:'usdM', periods:P }),
    pmt:      mStub({ label:'Payment Network net revenue', short:'Payment network', group:'Segments', unit:'usdM', periods:P }),
    vas:      mStub({ label:'Value-Added Services & Solutions', short:'VAS', group:'Segments', unit:'usdM', periods:P }),
    gdv:      mStub({ label:'Gross Dollar Volume', short:'GDV', group:'Volumes', unit:'usdM', periods:P }),
    xbvol:    mStub({ label:'Cross-border volume (growth %)', short:'Cross-border', group:'Volumes', unit:'usdM', periods:P }),
    switched: mStub({ label:'Switched transactions', short:'Switched txns', group:'Volumes', unit:'usdM', periods:P }),
    opinc:    mStub({ label:'Operating income', short:'Op. income', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'operating margin', periods:P }),
    ebitda:   mStub({ label:'EBITDA', short:'EBITDA', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'EBITDA margin', periods:P }),
    eps:      mStub({ label:'EPS (adjusted, diluted)', short:'EPS', group:'Company', unit:'eps', periods:P })
  };
}
var maSections=[
  { key:'top', label:'Top Line', defaultMetric:'rev', groups:[
    { label:'Totals', keys:['rev'] },
    { label:'Segments', keys:['pmt','vas'] },
    { label:'Volumes', keys:['gdv','xbvol','switched'] }
  ] },
  { key:'margins', label:'Margins & Profitability', defaultMetric:'opinc', groups:[
    { label:'Company', keys:['opinc','ebitda','eps'] }
  ] }
];

export var maResults = {
  updated: 'STUB',
  intro: 'STUB — Mastercard reported results vs Street consensus and company guidance, per metric. All numbers are placeholders: fill act/cons/guideLo/guideHi from the Q2 2026 BBG export + Mastercard 8-K guidance. Summit is empty (Mastercard is not in the Summit DCF universe).',
  source: 'STUB — Street consensus (Bloomberg BEst) + reported actuals + Mastercard 8-K guidance. To fill.',
  views: {
    q: { label:'Quarterly', note:'STUB — quarterly actuals + the Street consensus + Mastercard guidance. To fill.',
         metrics: maMetrics(Q), sections: maSections },
    y: { label:'Annual', note:'STUB — fiscal-year actuals + consensus + guidance. To fill.',
         metrics: maMetrics(Y), sections: maSections }
  }
  // no `evolution` key — Estimates sub-tab shows a pending note until built.
};
