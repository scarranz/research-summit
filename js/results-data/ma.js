// results-data/ma.js — Mastercard (MA) dataset for the standardized "Results" engine (js/results.js).
// Reconstructed from the rolling BBG_CONSENSUS.txt archive (G:\My Drive\Summit\Docs\0\), 12 MA
// snapshots (data_as_of 2023-10-26 → 2026-07-30). Spec + every parse trap: docs/EARNINGS_CONVENTIONS.md §6a.
//   act    = reported actuals — the archive's fq0 walked down the snapshot rows (freshest print per
//            quarter), extended back with fq-3; annual = fy0 walked down.
//   cons   = the Street number that stood going in — a reported quarter takes the prior snapshot's
//            fq+1 (1q out); forward quarters take the latest snapshot's fq+1..fq+4. Annual analogous.
//   summit = the Summit DCF model's own annual line (instrument MA, snapshot 2026-07-30,
//            projection_history), in USD millions; capex stored as positive magnitude. The MA model
//            is ANNUAL-only — it has no quarterly projections — so quarterly summit stays null, and
//            annual summit runs 2022–2029 (2030 not yet modelled). Summit's op-income/EBITDA defs can
//            differ from the BBG actuals; that is expected (its own line, not a restatement).
//   customs = the file's OWN kpi1–kpi4 for MA (EARNINGS_CONVENTIONS §6a "the metric set is the
//            file's, not ours"): VAS revenue (kpi1), purchase_volume (kpi2, USD/M), client_incentives
//            (kpi3, negative), processed_transactions (kpi4 — a COUNT: unit empty + scale M, rendered
//            with unit:'cnt', never a $). NOT GDV, NOT cross-border volume (cross-border is not in the file).
//   guideLo/guideHi = null — MA's numeric guidance (net-revenue-growth ranges, opex) is not a BBG
//            line; it lives separately in MA_GUIDE, not here.
// Monetary values US$ millions; EPS in dollars. null = not available (Bloomberg "Error ####", an
// Excel date-serial string, a near-zero placeholder, or blank are all parsed to null — never carried
// as a number). EPS is the BBG GAAP-comparable line (IS_COMP_EPS_GAAP): eps_fq0 = 4.97 for Q2 2026,
// vs the company-reported ADJUSTED $5.04 — the BBG value is used for internal consistency with the
// BBG consensus series. Generated, do not hand-edit.

// Builder: act/cons are the reconstructed series; summit is the Summit DCF model's own line where
// available (annual only — the MA model has no quarterly projections, so quarterly summit stays null);
// guideLo/guideHi are null (MA guidance is authored separately in MA_GUIDE, not a BBG line).
function nA(p){ return p.map(function(){ return null; }); }
function mM(o){
  return { label:o.label, short:o.short, group:o.group, unit:o.unit,
    marginOf:o.marginOf, marginLabel:o.marginLabel,
    periods:o.periods, act:o.act, cons:o.cons,
    summit:o.summit || nA(o.periods), guideLo:nA(o.periods), guideHi:nA(o.periods) };
}

var Q=['4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27'];
var Y=['2022','2023','2024','2025','2026','2027','2028','2029','2030'];

var MA_Q = {
  rev: { label:'Net revenue', short:'Net revenue', group:'Totals', unit:'usdM',
    act:  [5817,5748,6269,6533,6548,6348,6961,7369,7489,7250,8133,8602,8806,8398,9277,null,null,null,null],
    cons: [null,null,null,null,6545,6346,6877,7259,7409,7121,7893,8401,8750,8282,9092,9645,9997,9443,10252] },
  vas: { label:'Value-Added Services & Solutions (net revenue)', short:'VAS', group:'Segments', unit:'usdM',
    act:  [null,2098,2196,2323,2657,2428,2586,2740,3078,2818,3188,3423,3886,3450,3826,null,null,null,null],
    cons: [null,null,null,null,2544,2411,2557,2719,3094,2839,3032,3273,3748,3396,3778,4014,4529,4022,4420] },
  cinc: { label:'Client incentives (contra-revenue)', short:'Client incentives', group:'Drivers', unit:'usdM',
    act:  [-3608,-3417,-3694,-3963,-4108,-4100,-4222,-4630,null,-4579,-4923,-5389,-5631,null,-5997,null,null,null,null],
    cons: [null,null,null,null,-3638,-3561,-3889,-4179,-4278,-4593,-4872,-5277,-5402,-5309,-5724,-6177,-6371,-6258,-6518] },
  pvol: { label:'Purchase volume (network spend)', short:'Purchase vol', group:'Volumes', unit:'usdM',
    act:  [1728000,1707000,1839000,1879000,1920000,1871000,1975000,2058000,2114000,1993000,2182000,2280000,2344000,2251000,2417000,null,null,null,null],
    cons: [null,null,null,null,1928402,1882904,2021319,2055981,2107449,2040127,2159080,2259378,2338640,2189351,2392837,2495214,2575348,2465415,2620447] },
  ptx: { label:'Processed (switched) transactions', short:'Processed txns', group:'Transactions', unit:'cnt',
    act:  [34000,32500,35519,37155,38058,36700,39445,41102,42226,40096,43538,45373,46457,43797,47350,null,null,null,null],
    cons: [null,null,null,null,38211,36267,39545,41265,42148,40504,43569,45270,46426,44244,47724,49642,50872,48180,52371] },
  opinc: { label:'Operating income', short:'Op. income', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'operating margin',
    act:  [3200,3347,3677,3844,3680,3731,4133,4370,4200,4300,4873,5144,5084,5109,5669,null,null,null,null],
    cons: [null,null,null,null,3675,3715,4037,4268,4212,4188,4679,4918,4927,4955,5473,5781,5841,5683,6190] },
  ebitda: { label:'EBITDA', short:'EBITDA', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'EBITDA margin',
    act:  [3384,3538,3869,4055,3885,3947,4358,4595,4431,4424,5154,5434,5381,5408,5978,null,null,null,null],
    cons: [null,null,null,null,3904,3931,4287,4483,4435,4446,4943,5210,5246,5211,5766,6107,6176,6045,6530] },
  eps: { label:'EPS (GAAP-comparable, diluted)', short:'EPS', group:'Company', unit:'eps',
    act:  [2.62,2.47,3.00,3.39,2.97,3.22,3.50,3.53,3.64,3.59,4.07,4.34,4.52,4.35,4.97,null,null,null,null],
    cons: [null,null,null,null,3.13,3.23,3.52,3.69,3.71,3.62,4.00,4.25,4.24,4.31,4.79,5.09,5.19,5.09,5.59] },
  cfo: { label:'Operating cash flow', short:'Op. cash flow', group:'Cash flow & capital', unit:'usdM',
    act:  [3100,1919,2698,3233,4130,1672,3138,5136,4834,2380,4603,5663,5002,2999,3773,null,null,null,null],
    cons: [null,null,null,null,3773,3223,3940,3793,3949,3293,3985,5033,4862,3380,4699,5764,5717,4223,5342] },
  capex: { label:'Capex (purchase of PP&E)', short:'Capex', group:'Cash flow & capital', unit:'usdM',   // file carries it negative; stored as positive magnitude
    act:  [130,110,80,104,77,157,115,107,95,159,40,178,112,154,291,null,null,null,null],
    cons: [null,null,null,null,104,99,106,120,100,120,129,128,122,147,138,180,169,163,168] },
  dna: { label:'Depreciation & amortization', short:'D&A', group:'Cash flow & capital', unit:'usdM',
    act:  [184,191,192,211,205,216,225,225,231,275,281,290,297,299,309,null,null,null,null],
    cons: [null,null,null,null,203,206,213,230,229,235,267,277,292,295,303,315,324,323,339] },
  shares: { label:'Diluted shares outstanding', short:'Diluted shares', group:'Cash flow & capital', unit:'cnt',   // a COUNT (millions), never a $
    act:  [null,null,null,943,939,935,930,925,919,914,909,905,898,893,883,null,null,null,null],
    cons: [null,null,null,null,939,934,931,926,921,915,909,903,899,894,887,880,875,869,864] }
};

var MA_Y = {
  rev: { label:'Net revenue', short:'Net revenue', group:'Totals', unit:'usdM',
    act:  [22237,25098,28167,32791,null,null,null,null,null],
    cons: [null,25147,28046,32697,37111,41779,46760,52941,58267],
    summit:[22237,25097,28167,32791,38058,41680,46386,51874,null] },
  vas: { label:'Value-Added Services & Solutions (net revenue)', short:'VAS', group:'Segments', unit:'usdM',
    act:  [7879,9274,10832,13315,null,null,null,null,null],
    cons: [null,9159,10841,13117,15776,18414,21163,25138,28096] },
  cinc: { label:'Client incentives (contra-revenue)', short:'Client incentives', group:'Drivers', unit:'usdM',
    act:  [-13084,-15182,-17629,-20522,null,null,null,null,null],
    cons: [null,-10627,-16130,-20213,-24013,-26972,null,null,-39564] },   // fy+3/fy+4 (2028/2029) date-corrupt → null
  pvol: { label:'Purchase volume (network spend)', short:'Purchase vol', group:'Volumes', unit:'usdM',
    act:  [6570000,7346000,8018000,8799000,null,null,null,null,null],
    cons: [null,7353299,8007164,8792112,9727288,10633110,11621576,12653805,13760098] },
  ptx: { label:'Processed (switched) transactions', short:'Processed txns', group:'Transactions', unit:'cnt',
    act:  [125700,143200,159424,175464,null,null,null,null,null],
    cons: [null,143082,159464,175324,191899,211085,231415,257779,272107] },
  opinc: { label:'Operating income', short:'Op. income', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'operating margin',
    act:  [12687,14547,16500,19401,null,null,null,null,null],
    cons: [null,14483,16341,19125,22142,24589,28292,32278,37055],
    summit:[12127,13824,15278,18554,22281,24048,26737,29984,null] },      // Summit op-income def < BBG IS_COMPARABLE_EBIT — legitimately its own line
  ebitda: { label:'EBITDA', short:'EBITDA', group:'Company', unit:'usdM', marginOf:'rev', marginLabel:'EBITDA margin',
    act:  [13401,15347,17397,20544,null,null,null,null,null],
    cons: [null,15319,17267,20316,23431,26462,29857,33946,null],          // fy+5 (2030) Error 2042 → null
    summit:[12816,14829,16493,20100,23962,26905,29856,33380,null] },
  eps: { label:'EPS (GAAP-comparable, diluted)', short:'EPS', group:'Company', unit:'eps',
    act:  [10.22,11.83,13.89,16.52,null,null,null,null,null],
    cons: [null,12.03,14.20,16.30,19.37,null,null,31.05,null] },          // fy+2/fy+3 (2027/2028) date-corrupt, fy+5 (2030) Error → null
  cfo: { label:'Operating cash flow', short:'Op. cash flow', group:'Cash flow & capital', unit:'usdM',
    act:  [11195,11980,14780,17648,null,null,null,null,null],
    cons: [null,11876,13668,16925,19032,22046,25099,31441,34110],
    summit:[10919,12076,14282,15610,18867,20415,22681,25431,null] },
  capex: { label:'Capex (purchase of PP&E)', short:'Capex', group:'Cash flow & capital', unit:'usdM',   // positive magnitude (file carries it negative)
    act:  [442,371,474,489,null,null,null,null,null],
    cons: [null,393,418,458,642,694,783,924,942],
    summit:[442,371,474,489,590,646,719,804,null] },
  dna: { label:'Depreciation & amortization', short:'D&A', group:'Cash flow & capital', unit:'usdM',
    act:  [750,799,897,1143,null,null,null,null,null],
    cons: [null,795,901,1132,1242,1360,1481,1635,2086],
    summit:[750,799,897,1143,1248,1410,1579,1753,null] },
  shares: { label:'Diluted shares outstanding', short:'Diluted shares', group:'Cash flow & capital', unit:'cnt',   // a COUNT (millions), never a $
    act:  [971,946,927,906,null,null,null,null,null],
    cons: [null,948,928,906,883,861,840,823,811],
    summit:[971,946,927,906,885,863,842,821,null] }
};

function maMetrics(P, src){
  var m = {};
  Object.keys(src).forEach(function(k){
    var o = src[k];
    m[k] = mM({ label:o.label, short:o.short, group:o.group, unit:o.unit,
      marginOf:o.marginOf, marginLabel:o.marginLabel, periods:P, act:o.act, cons:o.cons, summit:o.summit });
  });
  return m;
}
var maSections=[
  { key:'top', label:'Top Line', defaultMetric:'rev', groups:[
    { label:'Totals', keys:['rev'] },
    { label:'Segments', keys:['vas'] },
    { label:'Volumes', keys:['pvol'] },
    { label:'Transactions', keys:['ptx'] },
    { label:'Drivers', keys:['cinc'] }
  ] },
  { key:'margins', label:'Margins & Profitability', defaultMetric:'opinc', groups:[
    { label:'Company', keys:['opinc','ebitda','eps'] },
    { label:'Cash flow & capital', keys:['cfo','capex','dna','shares'] }
  ] }
];

export var maResults = {
  updated: 'Jul 2026',
  intro: 'How Mastercard\u2019s reported results have stacked up against Street consensus, per metric \u2014 quarterly and annual, with growth and margins. Each print shows the actual against the Street number we had going in, with the surprise in percent; periods marked \u201cest.\u201d are forward (no actual yet). The Summit column shows the Summit DCF model\u2019s own line on the annual view (the model is annual-only, so it is blank on the quarterly view); MA\u2019s numeric guidance is shown separately (it is not a Bloomberg line). EPS is the BBG GAAP-comparable line ($4.97 for Q2 2026, vs the company-reported adjusted $5.04) for consistency with the BBG consensus.',
  source: 'Street consensus (Bloomberg) via BBG_CONSENSUS.txt snapshot archive; actuals reported through 2026 Q2 (as-of 2026-07-30, close_fq0 6/30/2026). Summit column = Summit DCF model (MA, snapshot 2026-07-30), annual only.',
  views: {
    q: { label:'Quarterly', note:'Reported actuals and the Street consensus that stood one quarter out, reconstructed from the rolling Bloomberg archive. The Summit model is annual-only, so its column is not shown here.',
         metrics: maMetrics(Q, MA_Q), sections: maSections },
    y: { label:'Annual', note:'Fiscal-year actuals, the Street consensus stored in the archive, and the Summit DCF model\u2019s own annual line (2022\u20132029).',
         metrics: maMetrics(Y, MA_Y), sections: maSections }
  }
  // no `evolution` key — Estimates sub-tab shows a pending note (matches googl.js).
};
