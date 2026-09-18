// overviews/sharkninja-ce-data.js — the DATA behind SN's Evolution ▸ Earnings.
//
// The rendering is Amazon's, copied verbatim into ./sharkninja-ce.js; this file is the only part
// that is SharkNinja's. Two objects, the same shape amzn.js inlines:
//
//   SN_CE_CONS — the estimate grid and "The print" cards. Built at load from
//     js/results-data/sn.js rather than hand-typed, so the Earnings tab and the Results tab can
//     never disagree. `qr[i][3]` is the Street number for quarter i, `qa` the reported actual,
//     `qy`/`qq` the year-ago and prior-quarter actuals the growth chips divide by.
//     Only the 1q-out column exists: when this was built SN was not in BBG_CONSENSUS.txt, so the
//     4q/3q/2q columns stay null. ⚠ SN joined the archive on Sep 17 2026 (estMatrix.cons in sn.js,
//     10 snapshots) — those revision columns can now be filled from it; not done yet.
//
//   SN_CALL_EARNINGS — per quarter: setup notes, results notes, and the call (prepared remarks,
//     every analyst question, highlights, proposed notes). From SharkNinja's releases and call
//     transcripts, retrieved through Quartr and frozen.
//
// Summit (`setup.us`) is EMPTY everywhere, by construction: there is no Summit DCF model for SN.

import { snResults } from '../results-data/sn.js';

var M = snResults.views.q.metrics;

// Pre-print Street consensus for REPORTED quarters. The Bloomberg snapshot in results-data/sn.js
// postdates every print, so its `cons` is forward-only. Amazon's precedent for the same gap is the
// consensus quoted in earnings-day coverage; each value carries its outlet and source below.
// Keyed by quarter label → metric label → $M (EPS in $).
export var SN_PREPRINT = {
  'Q4 2025': { 'Revenue':2070, 'Adj. EPS (diluted)':1.78,
               'Cleaning':711.86, 'Cooking & Beverage':638.20, 'Food Preparation':408.12, 'Beauty & Home Environment':321.58,
               'Domestic net sales':1350, 'International net sales':722.05 },
  'Q1 2026': { 'Revenue':1370, 'Adj. EPS (diluted)':1.01,
               'Cleaning':463.5, 'Cooking & Beverage':373.6, 'Food Preparation':345.0, 'Beauty & Home Environment':179.3 },
  'Q2 2026': { 'Revenue':1639, 'Adj. EPS (diluted)':1.10,
               'Cleaning':551.26, 'Cooking & Beverage':406.41, 'Food Preparation':445.56, 'Beauty & Home Environment':218.06,
               'Domestic net sales':1080, 'International net sales':545.79 },
};
// One outlet for all three prints (Zacks Consensus Estimate, as carried by Yahoo Finance / Finviz /
// Nasdaq on earnings day) so the three scorecards are scored on the same basis. The category and
// geography lines are Zacks' key-metric consensus (two-analyst averages). No outlet quoted an
// Adjusted EBITDA consensus for any of the three, so that line stays unscored. Other outlets that
// published different numbers (Quiver, MarketBeat/Fiscal.ai, FactSet $1.11 EPS for Q2, and
// Investing.com figures on the wrong basis) are recorded here and deliberately not used.
export var SN_PREPRINT_SRC = {
  'Q4 2025': 'Zacks Consensus Estimate — https://ca.finance.yahoo.com/news/sharkninja-inc-sn-q4-earnings-124002286.html · https://finance.yahoo.com/news/compared-estimates-sharkninja-inc-sn-143007127.html · https://finviz.com/news/302825/unveiling-sharkninja-inc-sn-q4-outlook-wall-street-estimates-for-key-metrics',
  'Q1 2026': 'Zacks Consensus Estimate — https://sg.finance.yahoo.com/news/sn-q1-earnings-beat-broad-141700413.html (MarketBeat/Fiscal.ai matched: $1.38B, $1.01; no Domestic/International split published)',
  'Q2 2026': 'Zacks Consensus Estimate — https://finance.yahoo.com/markets/stocks/articles/sn-stock-8-q2-earnings-153600559.html · https://finance.yahoo.com/markets/stocks/articles/sharkninja-inc-sn-q2-earnings-133006753.html (FactSet via MT Newswires had Adj. EPS $1.11)',
};

// The grid's lines — labels are what the cards print and what `setup.notes` / `results.notes` key
// on. `key` addresses results-data/sn.js; `key:null` is a headline line SN's dataset does not carry
// quarterly (it renders as "—", never as an invented number).
var LINES = [
  { k:'Revenue',                   key:'rev',           u:'$M' },
  { k:'Gross profit',              key:'grossProfit',   u:'$M' },
  { k:'Operating income',          key:'opIncome',      u:'$M' },
  { k:'Adj. EBITDA',               key:'ebitdaAdj',     u:'$M' },
  { k:'Adj. EPS (diluted)',        key:'epsAdj',        u:'$'  },
  { k:'Operating cash flow',       key:null,            u:'$M' },
  { k:'Capex',                     key:null,            u:'$M' },
  { k:'D&A',                       key:'da',            u:'$M' },
  { k:'Diluted shares',            key:null,            u:'M'  },
  // ── custom KPIs ──
  { k:'Cleaning',                  key:'segCleaning',   u:'$M' },
  { k:'Cooking & Beverage',        key:'segCookBev',    u:'$M' },
  { k:'Food Preparation',          key:'segFoodPrep',   u:'$M' },
  { k:'Beauty & Home Environment', key:'segBeautyHome', u:'$M' },
  { k:'Domestic net sales',        key:'regionNA',      u:'$M' },
  { k:'International net sales',   key:'regionIntl',    u:'$M' },
];

function qLabel(p){ return 'Q'+p.charAt(0)+' 20'+p.slice(2); }   // '3Q23' → 'Q3 2023'

var PERIODS = M.rev.periods;
var QS = PERIODS.map(qLabel);

function series(key, field){
  var m = key ? M[key] : null;
  return PERIODS.map(function(p){
    if(!m) return null;
    var i = m.periods.indexOf(p);
    var v = (i < 0 || !m[field]) ? null : m[field][i];
    return (v == null) ? null : v;
  });
}

export var SN_CE_CONS = {
  src: 'Bloomberg (BST) company-financials export for SN, Sep 2026 snapshot (via js/results-data/sn.js) · pre-print Street from earnings-day coverage',
  q: QS,
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: LINES.map(function(L){
    var act = series(L.key, 'act'), cons = series(L.key, 'cons');
    return {
      k: L.k, u: L.u, t: 'ok',
      qr: QS.map(function(q, i){
        var pre = SN_PREPRINT[q] && SN_PREPRINT[q][L.k];
        var c = (pre != null) ? pre : cons[i];
        return [null, null, null, (c == null ? null : c)];
      }),
      qa: act,
      qy: act.map(function(_, i){ return i >= 4 ? act[i-4] : null; }),
      qq: act.map(function(_, i){ return i >= 1 ? act[i-1] : null; }),
    };
  }),
};

export var SN_CALL_EARNINGS = { ticker:'SN', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ends Sep 2026; reports Nov 5, 2026) ──
  //
  // CONSENSUS PROVENANCE: the Street cells behind these notes are the Bloomberg (BST) FA_SN export,
  // Sep 2026 snapshot, read through js/results-data/sn.js. That snapshot is POST-2Q26-print, so it
  // already knows the raised FY2026 guide and (at least partly) the $247.1M tariff refund. There is
  // no Summit model for SN: `us` stays {} by construction.
  { q:'Q3 2026', status:'upcoming', date:'reports Nov 5, 2026',
    setup:{
      source:'Bloomberg (BST) FA_SN company-financials export, Sep 2026 snapshot (via js/results-data/sn.js; POST-2Q26-print vintage) · company FY2026 outlook, Q2 2026 release (Aug 5, 2026) · no Summit model for SN', asOf:'Sep 2026',
      notes:{
        'Revenue':{ t:'No quarterly guide, and the Street sits above the implied second half', h:'<p>SharkNinja guides the <b>year, never the quarter</b>. The FY2026 guide was raised on Aug 5 to <b>+16.0-17.0%</b> (from +11.5-12.5%), which is <b>$7,423-7,487M</b> on the FY2025 base. With 1H26 at $3,178.3M, the guide implies <b>$4,245-4,309M for 2H26 (+13.8-15.5%)</b>. The Street has Q3 at <b>$1,867.4M (+14.5%)</b> and Q4 at $2,463.6M, a 2H of $4,330.9M, already above the top of the implied range.</p><p>Worth knowing about the guide itself: across FY2025 and FY2026 it has been revised seven times, all upward, and the top-line raise at 2Q26 carried <b>no tariff-refund component</b>.</p>' },
        'Gross profit':{ t:'The basis trap: the refund lands in cost of sales', h:'<p>The company expects to recognize about <b>$247.1M as a reduction of cost of sales</b> in Q3. Roughly half relates to duties expensed in FY2025 and is <b>excluded</b> from the adjusted metrics; the half tied to 1H26 duties flows through them. So GAAP gross profit carries the full amount and adjusted carries about half.</p><p>The Street cell (<b>$1,073.4M, a 57.5% margin</b> against 48.7% in 2Q26 and 50.1% in 3Q25) only works with a large part of the refund inside it, and strip out all $247.1M and it implies 44.3%, below any recent quarter. The contributors are not on one basis. Read the cell as a warning, not a bar.</p>' },
        'Operating income':{ t:'A GAAP blowout that is not one', h:'<p>The Street has GAAP operating income at <b>$419.2M (+59% on 3Q25\'s $262.9M)</b>. Most of that step is the refund, not the business. The other GAAP-only drag to remember is share-based compensation: G&A SBC rose <b>$22.6M</b> year on year in 2Q26 alone, which is why 2Q26 GAAP operating income grew just +6.4% while adjusted operating income grew +19.6%.</p>' },
        'Adj. EBITDA':{ t:'The red line that has to reverse, now with ~$30M of refund help', h:'<p>The stated goal is <b>full-year Adj. EBITDA growing faster than net sales</b>. 2Q26 broke it at the quarter level (+18.6% vs +22.2%) and management reaffirmed the full year. The FY guide of <b>$1,357-1,369M</b> implies <b>$857-869M for 2H26 (+20.4-22.1%)</b>, ahead of the implied 2H sales growth, so the reversal is built into the guide.</p><p>Of the $67-69M raise, <b>about $30M is the net tariff refund</b> after the reinvestment management promised (retail activation, media, technology and AI, cost mitigation). The Street has Q3 at <b>$394.1M (+24.5%)</b> and Q3+Q4 at $872.9M, at or above the top of the implied range.</p>' },
        'Adj. EPS (diluted)':{ t:'The Street is above the company\'s own range', h:'<p>The FY guide is <b>$6.45-6.55</b>, of which about <b>$0.15 of the $0.45 raise</b> is the net refund. With 1H26 at $2.35, that implies <b>$4.10-4.20 for 2H26</b>. The Street has Q3 at <b>$1.87 (+24.7%)</b>, Q4 at $2.40, and the full year at <b>$6.59, above the top of the guide</b>. This is ADJUSTED EPS; GAAP EPS will carry the excluded half of the refund and diverge further than usual.</p>' },
        'Capex':{ t:'Tracking to the high end, after FY2025 undershot its floor', h:'<p>FY2026 is guided <b>$190-210M</b> and "tracking toward the high end". 1H26 purchases of property and equipment were <b>$83.1M</b> (plus $8.3M of intangible assets), so the high end implies a heavy second half. The contrast to hold: FY2025 guided $180-200M and the cash-flow line showed <b>$146.1M</b>. Either the definitions differ or the guide is loose; the company has not reconciled the two. No quarterly Street cell on file.</p>' },
        'Cleaning':{ t:'The Street models +7.6% for the core that grew +4.1%', h:'<p>Street <b>$637.8M (+7.6%)</b> against a 3Q25 base that grew +12.4%. The largest category grew <b>+4.1% in 2Q26</b> and +3.4% in 4Q25, but +17% in 1Q26. Management\'s own framing is the core "growing, not flat", with the three Q2 cleaning launches (Luxe Home Collection, CarpetForce, PowerDetect Transformer) and upright and cordless refreshes in the second half as the support.</p>' },
        'Beauty & Home Environment':{ t:'Seasonality: the Street models a step DOWN from Q2', h:'<p>Street <b>$249.4M (+31.7%)</b>, below 2Q26\'s $285.8M. Fans peak in Q2/Q3, and on the Q2 call management said fans "sold out and couldn\'t capture all the demand", so some of the Q2 strength was weather-led. The skincare side (CryoGlow, ChillPill into Ulta) is the less seasonal part of the line. Four straight quarters as the fastest-growing category.</p>' },
        'International net sales':{ t:'The first quarter with no conversion drag in the base', h:'<p>Street <b>$640.6M (+21.0%)</b>, only +2.7% sequentially from 2Q26\'s $623.6M. The distributor-to-direct conversions finished with Italy and Spain in Q2 ("now done for the foreseeable future"), the Salesforce DTC rollout is complete across the major markets, and TikTok Shop goes from seven countries toward 13. The Street is sitting on the "low 20s%" run-rate Quigley floated on the Q1 call, after +31.6% and +36.6% actual prints.</p>' },
        'Domestic net sales':{ t:'Double-digit is the stated bar, and Canada is inside it', h:'<p>Street <b>$1,217.3M (+10.5%)</b>. Barrocas on the Q2 call: "I feel very, very good about a double-digit second half number for the domestic business." Domestic includes Canada, which fell 17% in 2Q26 while the US grew 18%; management expects Canada to grow in the back half. POS ran ahead of shipments in Q2 on Prime Day timing, expected to normalize.</p>' }
      },
      us:{},
      debate:{ rows:null, synth:'The one thing Q3 has to resolve: <b>whether the tariff refund is read as the quarter, or the quarter is read without it.</b> About $247.1M lands in cost of sales, but only about half flows through the adjusted metrics, so GAAP will carry roughly twice the benefit the adjusted numbers do: a GAAP print that looks like a blowout and an adjusted print that looks ordinary are the same quarter. Underneath that sit two real tests: <b>Adj. EBITDA back ahead of net sales</b> (the 2Q26 break the guide says reverses), and <b>Cleaning</b>, the largest category, where the Street models +7.6% after +4.1%.' }
    },
    results:null, call:null },

  // ── REPORTED: Q2 2026 (quarter ended Jun 30, 2026; reported Aug 5, 2026 BMO, call 8:00am ET) ──
  // Built from the Q2 2026 release (8-K Ex. 99.1) and the full call transcript, both via Quartr
  // (eventId 661459), plus the desk material in js/overviews/sharkninja-earnings.js,
  // js/themes-data/sn.js and js/overviews/sharkninja-quartr.js. Pre-print consensus from
  // earnings-day coverage; see the CONSENSUS block at the end of this file.
  { q:'Q2 2026', status:'reported', date:'August 5, 2026',
    setup:{
      source:'Zacks consensus via earnings-day coverage (Yahoo Finance, Aug 5, 2026) · FactSet via MT Newswires/MarketScreener (EPS only) · company FY2026 outlook, Q1 2026 release (May 6, 2026) · no Summit model for SN', asOf:'Aug 2026',
      notes:{
        'Revenue':{ t:'Street +13.4% against a raised +11.5-12.5% FY guide', h:'<p>Zacks consensus <b>$1,639M (+13.4%)</b>. SharkNinja does not guide the quarter; the FY2026 guide going in was <b>+11.5-12.5%</b>, raised at the Q1 print from +10.0-11.0%. Q1 had printed <b>+15.6%</b>, with domestic +8.4% and international +31.6%.</p><p>The pattern to price: FY2025 was raised at every print and still finished above the final guide (+15.7%). Other outlets carried a different bar (an unattributed $1,703.7M), so the beat size depends on whose number you use.</p>' },
        'Adj. EBITDA':{ t:'The quarter to test "EBITDA ahead of sales" against annualizing tariffs', h:'<p>No quarterly Street figure was found in earnings-day coverage. The going-in frame: FY guide <b>$1,290-1,300M (+13.5-14.5%)</b>, ahead of the sales guide by design. Q1 delivered it (+17.5%, margin +30bp) while carrying "a full quarter of impact" from tariffs against a minimal-tariff base. The 2Q25 base was $223.4M (15.5% margin).</p>' },
        'Adj. EPS (diluted)':{ t:'Street ~$1.10, and read the basis', h:'<p>Zacks <b>$1.10</b>, FactSet <b>$1.11</b> (+13-14% on $0.97). Q1 printed $1.09 (+25%). This is ADJUSTED EPS, the line SharkNinja guides ($6.00-6.10 going in). GAAP EPS diverges on share-based compensation (Q1 SBC $30.3M vs $11.6M a year earlier) and FX in other income, so any headline that scores GAAP against this bar is scoring the wrong line.</p>' },
        'Operating income':{ t:'GAAP, and the SBC step-up sits inside it', h:'<p>No Street figure found. The 2Q25 GAAP base was $168.6M (11.6% margin). The GAAP-adjusted gap has been widening on share-based compensation since the start of 2026, so GAAP operating income should be expected to grow well below adjusted.</p>' },
        'Cleaning':{ t:'Street +9.9% after a +17% Q1', h:'<p>Zacks key-metric consensus <b>$551.3M (+9.9%)</b>. Q1 grew +17% on corded uprights ("the largest subcategory in the company") and carpet extraction. The line tests whether the core is really "growing, not flat" once Q1\'s strength is not repeated.</p>' },
        'Cooking & Beverage':{ t:'An easy comp: 2Q25 fell 3.6%', h:'<p>Zacks <b>$406.4M (+11.1%)</b>. The 2Q25 base declined as Luxe Café was offset by air fryers and outdoor grills lapping a strong 2Q24. Q1 grew +19.8% on espresso and the Crispi franchise, so the Street bar sat below the run-rate.</p>' },
        'Food Preparation':{ t:'The hardest comp on the card: 2Q25 was +52.8%', h:'<p>Zacks <b>$445.6M (+10.1%)</b>. The lumpiest line in the business: +52.8% in 2Q25 on SLUSHi and CREAMi sell-in, then -3.3% in 1Q26 lapping frozen-treat sell-in. Management had named a <b>blender reinvention</b> for the year as the offset.</p>' },
        'Beauty & Home Environment':{ t:'Street +26% after +40.8%, in the seasonal peak', h:'<p>Zacks <b>$218.1M (+26.1%)</b>. Q1 grew +40.8% on CryoGlow skincare; fans peak in Q2/Q3. The fastest-growing category for three straight quarters going in, and the Street modelled a sharp deceleration.</p>' },
        'International net sales':{ t:'Street +19.6%, below management\'s own "low 20s%"', h:'<p>Zacks <b>$545.8M (+19.6%)</b>. Q1 printed +31.6% while absorbing the Italy and Spain conversions ("we took a bit of a hit in that in Q1… that will get rectified as we close out Q2"). Quigley\'s unofficial frame on the Q1 call: international "will remain in the low 20s%".</p>' },
        'Domestic net sales':{ t:'Street +9.3%, with Canada still in transition', h:'<p>Zacks <b>$1,080M (+9.3%)</b>. Q1 domestic grew +8.4%, with US shipments +10% and POS higher, and Canada down on structural changes. Domestic = US + Canada.</p>' }
      },
      us:{},
      debate:{ rows:null, synth:'The one thing to resolve: can the <b>international acceleration</b> (+31.6% in Q1, with the last conversions still in flight) hold while <b>2025 tariffs annualize</b> against the margin, and does Adj. EBITDA keep growing ahead of sales at the quarter level, the company\'s own stated profitability goal?' },
      pricedIn:'Zacks had the quarter at $1,639M (+13.4%) and $1.10 adjusted EPS (FactSet $1.11): growth decelerating from Q1\'s +15.6%, close to the company\'s own FY guide of +11.5-12.5%, with international modelled at +19.6% after +31.6%. The company\'s record going in was adjusted EPS growth above 23% in 10 of the prior 11 quarters and a guide never once cut. SN closed at $168.19 the day before the print.',
      oneLiner:'The bar was "decelerate gracefully" and SharkNinja accelerated instead: +22.2% (fastest since 4Q24), all four categories up, international +36.6%, and the FY guide raised ~4.5pp with no refund in the top line. The one miss was its own: Adj. EBITDA grew slower than sales.' },
    results:{
      summary:{
        paras:[
          { p:'<b>The growth-durability bear case lost its best quarter to argue from.</b> The skeptic\'s version of SharkNinja is a hit-product company whose double digits depend on a few viral launches in a flat market. This print is the counter-example in the data: all four categories grew, the US grew 18% on shipments with POS higher, and international accelerated again even as the go-to-market transition closed. Management offered the arithmetic to test it: existing categories mid-to-high single digits, plus international, plus new categories. The category table is where that claim now gets audited quarter by quarter.',
            more:'The soft spot inside that argument is Cleaning, the largest category, at +4.1%. If the core is really low-single-digit, the three-pillar arithmetic still reaches double digits only if international and new categories keep carrying more than their share.' },
          { p:'<b>The margin story is a tariff-timing story, and the guide says it reverses.</b> Adj. EBITDA grew +18.6% against +22.2% sales, the first quarter-level break of the company\'s stated goal, and adjusted gross margin fell 70bp on annualizing 2025 tariffs, FX and retailer activations. Opex levered for a fifth straight quarter, so the break sits in cost of goods, not in spending discipline. The FY guide implies 2H Adj. EBITDA growth of +20-22%, ahead of implied sales, which makes Q3 the check.' },
          { p:'<b>The guide raise is mostly operating, and the refund is an accounting event to read carefully.</b> Of the $0.45 EPS raise about $0.15 is the net tariff refund, and of the $67-69M EBITDA raise about $30M; the sales raise carries none. The $247.1M refund lands in Q3 cost of sales, but only the 2026 half flows through the adjusted metrics. The analytical consequence is that Q3 GAAP will overstate the business by roughly twice what adjusted does, and some of the adjusted half is earmarked for reinvestment.' },
          { p:'<b>The GAAP line is not the read this quarter.</b> GAAP net income fell 7.0% and GAAP EPS fell to $0.92 because share-based compensation stepped up ($22.6M more in G&A) and other income swung from +$26.0M to -$7.8M (FX). At least one earnings-day headline scored that GAAP $0.92 against an adjusted consensus and called it a miss; the adjusted $1.26 against the $1.10-1.11 bar was a clear beat.' }
        ]
      },
      notes:{
        'Revenue':{ t:'+22.2%, the fastest since 4Q24, against a +13.4% bar', h:'<p><b>$1,765.5M (+22.2%; +21.6% constant currency)</b> vs Zacks $1,639M. The 13th consecutive quarter of double-digit growth. Domestic +15.5%, International +36.6%; all four categories grew. The FY guide went to <b>+16.0-17.0%</b> from +11.5-12.5%, with no tariff-refund component in the top-line raise.</p>' },
        'Gross profit':{ t:'$860.3M, 48.7%: tariffs, FX and activations, partly offset', h:'<p>GAAP gross margin <b>48.7% (-30bp)</b>; adjusted <b>48.7% (-70bp)</b> as the Product Procurement Adjustment rolled off. Drivers named: US tariff cost (mostly the annualization of 2025), unfavourable FX, increased retailer activations; offsets: cost optimization, category and channel mix, and the end of the JS Global sourcing fee (Jul 31, 2025). Quigley: gross profit "exceeded our internal expectations".</p>' },
        'Operating income':{ t:'GAAP +6.4% vs adjusted +19.6%: the SBC gap', h:'<p>GAAP <b>$179.4M (+6.4%, 10.1% margin vs 11.6%)</b>. Adjusted operating income $231.5M (+19.6%, 13.1%). G&A rose 40.8% to $130.1M, with <b>$22.6M more share-based compensation</b>. Adjusted opex 35.6% of sales vs 36.0%, the fifth consecutive quarter of leverage.</p>' },
        'Adj. EBITDA':{ t:'⚑ +18.6%, slower than sales', h:'<p><b>$264.9M (+18.6%, 15.0% margin, -50bp)</b>. No quarterly Street figure found. The company\'s goal is full-year Adj. EBITDA ahead of net sales; Quigley: "Due to the annualization of 2025 tariffs, our adjusted EBITDA growth slightly trailed our sales growth in Q2." FY guide raised to <b>$1,357-1,369M</b> (~$30M of the raise is the net refund), which still implies EBITDA ahead of sales for the year.</p>' },
        'Adj. EPS (diluted)':{ t:'$1.26 vs $1.10-1.11, and GAAP $0.92', h:'<p><b>$1.26 (+29.9%)</b> vs Zacks $1.10 and FactSet $1.11. Growth above 23% in 11 of the last 12 quarters. GAAP diluted EPS <b>$0.92 (-6.1%)</b> on the SBC step-up and an FX swing in other income (-$7.8M vs +$26.0M). Adjusted tax rate 19.7%, GAAP 20.7%. FY guide $6.45-6.55 (of the $0.45 raise, ~$0.15 is the net refund).</p>' },
        'Operating cash flow':{ t:'~$432M in the quarter; 1H26 $275.5M vs -$63.9M', h:'<p>The release gives six-month figures only: 1H26 operating cash flow <b>$275.5M</b> vs <b>-$63.9M</b> in 1H25. Q2 alone is derived at <b>~$431.8M</b> (1H less Q1\'s -$156.3M), against ~-$9.1M in 2Q25 on the same derivation. The swing is working capital: receivables and payables moved in the company\'s favour while inventories rose $141.3M in the half.</p>' },
        'Capex':{ t:'~$49M in the quarter; FY tracking to the high end', h:'<p>Purchases of property and equipment <b>$83.1M in 1H26</b> vs $60.1M, so ~$49.1M in Q2 (derived), plus $8.3M of intangible asset purchases in the half. FY guide unchanged at <b>$190-210M</b>, "tracking toward the high end". FY2025 guided $180-200M and reported $146.1M on the cash-flow line.</p>' },
        'D&A':{ t:'~$40M, low for the revenue base', h:'<p>1H26 D&A <b>$78.4M</b> vs $67.0M, so ~$40.0M in Q2 (derived) vs ~$35.1M. Low relative to revenue because the company owns no factories; third-party suppliers make 100% of product.</p>' },
        'Diluted shares':{ t:'141.5M, down on the buyback', h:'<p>Weighted diluted shares <b>141.5M</b> vs 141.9M. The company bought back <b>815,233 shares for $99.7M</b> in Q2 (average $122.29); 1,008,368 shares for $119.7M year to date. FY guide stepped down to ~142.5M.</p>' },
        'Cleaning':{ t:'+4.1%: the slowest of the four, again', h:'<p><b>$522.0M (+4.1%)</b> vs Zacks $551.3M, the one category under the Street bar. Cordless vacuums and carpet extraction carried it. 1H26 Cleaning is +10.1%, so the weak quarter follows a strong one; the diversification argument depends on it being "growing, not flat".</p>' },
        'Cooking & Beverage':{ t:'+36.5%: the strongest in at least two years', h:'<p><b>$499.0M (+36.5%)</b> vs Zacks $406.4M. Luxe Café espresso (plus the $949 AutoBarista) and the Crispi franchise (Crispi Pro, DualZone Crispi in the US), with heated cooking penetrating more countries. Helped by an easy comp (2Q25 -3.6%).</p>' },
        'Food Preparation':{ t:'+13.3% on the hardest comp', h:'<p><b>$458.6M (+13.3%)</b> vs Zacks $445.6M, against a +52.8% 2Q25. Blending was the standout (Ninja BlendBoss); frozen treats grew too. Back to growth after 1Q26\'s -3.3%.</p>' },
        'Beauty & Home Environment':{ t:'+65.3%: the fastest line for a fourth straight quarter', h:'<p><b>$285.8M (+65.3%)</b> vs Zacks $218.1M. Skincare and fans; fans sold out in a hot summer, especially in EMEA, so part of the beat is seasonal and weather-led. The UK saw particular strength in this category.</p>' },
        'Domestic net sales':{ t:'+15.5%, and the US alone +18%', h:'<p><b>$1,141.9M (+15.5%)</b> vs Zacks $1,080M. US shipments +18% with POS higher (partly Prime Day timing); Canada <b>-17%</b> on the remaining transition, expected to grow in 2H. The segment total understates the US. 1H26 domestic above +12%.</p>' },
        'International net sales':{ t:'+36.6%: accelerating as the transition closed', h:'<p><b>$623.6M (+36.6%)</b> vs Zacks $545.8M. UK <b>+18.7% to $255M</b>; France, Germany and Latin America strong; Italy and Spain converted to direct. Management: conversions "now done for the foreseeable future", EMEA still under 10% penetrated on a category basis.</p>' }
      },
      watch:{ 'Adj. EBITDA':1, 'Cleaning':2, 'International net sales':3, 'Beauty & Home Environment':4 },
      thesisCheck:[
        { line:'Every one of the four categories grows', tripped:false, note:'All four grew. Cleaning +4.1%, Cooking & Beverage +36.5%, Food Preparation +13.3%, Beauty & Home Environment +65.3%.' },
        { line:'Adjusted EBITDA grows faster than net sales', tripped:true, note:'⚑ BROKE. Adj. EBITDA +18.6% against net sales +22.2%. Management attributed it to the annualization of 2025 tariffs and reaffirmed EBITDA ahead of sales for the FULL year, so this is a quarter-level break on a year-level commitment, and Q3 is where it has to start reversing.' },
        { line:'Adjusted opex levers as a share of sales', tripped:false, note:'Held: 35.6% vs 36.0%, the fifth consecutive quarter of leverage.' },
        { line:'International keeps compounding above 25%', tripped:false, note:'Held comfortably at +36.6%, an acceleration from 1Q26\'s +31.6%.' },
        { line:'No customer-concentration deterioration', tripped:false, note:'Not re-disclosed quarterly; the FY2025 10-K figure (three customers, 45.7%) stands. Flagged as unverified this quarter rather than assumed good.' }
      ],
      intoCall:[
        '<b>The guide raise</b>: up ~4.5pp with NO tariff-refund component in the top line, so the raise is an operating statement, not an accounting one. How much of 2H is already visible?',
        '<b>EBITDA trailing sales</b>: the one line management has to walk back to plan, and it said it would for the full year.',
        '<b>International with no excuses left</b>: the transition is declared finished, which removes a drag and an explanation at the same time.',
        '<b>Channel mix</b>: DTC and TikTok Shop carry a higher gross margin. Will management size them? (The CEO declined: "We don\'t break out the percentage of our D2C business.")'
      ],
      priceReaction:'SN had closed at $168.19 before the print. Intraday coverage on Aug 5 had it +4.88% to $176.41 (Investing.com, live), later +5.88% to $178.09 near its 52-week high of $179.03, and Zacks reported "up approximately 8.3%". The settled Aug 5 close was not verified in this pass; confirm before quoting a single number.' },
    call:{
      take:'Barrocas came to argue durability, not the quarter: the core is large and growing, new categories mature into it, and international is now fully owned. The numbers backed him on the top line. The margin line is the part still owed, and management put a date on most of what it owes (Q4 for the DTC benefit, 2027 for flat headcount).',
      highlights:[
        { tag:'thesis', band:'lead', open:'Does Adj. EBITDA get back ahead of net sales in Q3, as the full-year guide implies?',
          head:'Adj. EBITDA +18.6% trailed sales +22.2% on tariff annualization, and management reaffirmed EBITDA ahead of sales for the full year',
          detail:'<p>Quigley: "Due to the annualization of 2025 tariffs, our adjusted EBITDA growth slightly trailed our sales growth in Q2." Opex levered for a fifth straight quarter, so the break is in cost of goods. Routed to the Watch List as the top hook.</p>' },
        { tag:'curious', band:'context',
          head:'TikTok Shop live in seven countries, from zero a year ago, heading to 13',
          detail:'<p>Germany reached in weeks the volume that took months in the US and UK. The stated goal is more than doubling the country count by holiday, and 13 was referenced for Q4. The counter-intuitive detail: Ninja NeverDull cutlery, a category sold for almost five years, became a top-three seller in the channel in the US, with a younger buyer than usual.</p>' },
        { tag:'thesis', band:'context',
          head:'The distributor-to-direct conversions are finished, and EMEA is still under 10% penetrated on a category basis',
          detail:'<p>Italy and Spain were the last; the Salesforce DTC platform also finished rolling out across the major international markets. Management\'s own estimate of runway: France and Germany went from a "low double-digit number of categories" to over 50% more in a year, and EMEA overall is "less than 10% penetrated".</p>' },
        { tag:'thesis', band:'context',
          head:'TAM put at ~$120bn, heading to $125-130bn by year-end',
          detail:'<p>The Crispi Microwave alone added a TAM management sized at over $3bn and took the sub-category count to 40. A 41st, also multi-billion, was flagged for late Q3, which makes three new sub-categories in 2026 against a stated minimum of two.</p>' },
        { tag:'watch', band:'logged', open:'Palantir benefits in Q4 promotions and media; AWS media optimization live end-September; "roughly flat headcount" into 2027.',
          head:'AI with dates attached: Palantir phase two, AWS media optimization, and "roughly flat headcount" into 2027',
          detail:'<p>Palantir phase two is a four-month build, with benefits expected in Q4 for the US, UK, Germany and France. The AWS media system goes live end-September and scales in 2027. The specific opex claim: "leverage compensation in a big way in 2027… Not to the extent of seeing any type of large reductions."</p>' },
        { tag:'watch', band:'logged', open:'A sell-in tailwind into Q4 if retailers do take more inventory.',
          head:'Retailer inventory called too LOW, not too high, and new doors earned (Ulta took the ChillPill)',
          detail:'<p>"If anything, I think retailers could take a bit more inventory… there\'s a lot of demand to capture." POS outpaced shipments on Prime Day timing. Ulta, which had only ever bought hair and skin care, took the Shark ChillPill; Walmart end caps and Target colorway promotions were cited alongside.</p>' },
        { tag:'curious', band:'logged',
          head:'Fans sold out: demand left uncaptured in a hot summer',
          detail:'<p>Barrocas: "we sold out and couldn\'t capture all the demand we saw." Framed as an opportunity to scale next year across more European countries, and a reason not to extrapolate Beauty & Home Environment\'s Q2 into Q3.</p>' },
        { tag:'logged', band:'logged',
          head:'$99.7M of stock repurchased in the quarter',
          detail:'<p>815,233 shares at an average $122.29; 1,008,368 shares for $119.7M year to date at an average $118.71, against a $750M authorization.</p>' }
      ],
      prepared:[
        { topic:'Durability of double-digit growth', theme:'Durability',
          body:'Barrocas named the skepticism directly: it is "hard to believe that double-digit growth in a business our size in a market that isn\'t growing much can be durable." His answer was arithmetic: existing categories have grown mid-to-high single digits on average over three years, and international expansion plus new categories add the rest. It matters because the claim is testable every quarter against the category table, not just asserted.' },
        { topic:'The core is the misunderstood part', theme:'Core',
          body:'Roughly 20 of the 25 new products launched each year go into existing categories, and Cleaning got three launches in the quarter (Luxe Home Collection, CarpetForce, PowerDetect Transformer). Barrocas framed core and new categories as "the same story told at different stages", with CREAMi as the worked example of a 2021 launch now selling in over 30 countries. The why: if viral products were most of the growth, the durability case would be fragile; management is arguing the opposite.' },
        { topic:'International transition complete', theme:'International',
          body:'International grew 36.6%, with the UK up 18.7% to $255M. Italy and Spain finished converting to direct, and management said it is "now done for the foreseeable future with these distributor conversions", with the DTC platform also rolled out across the major markets. That removes the drag that had been cited in prior quarters, so from Q3 international growth has no transition to explain it.' },
        { topic:'Social commerce as a front door', theme:'Channel',
          body:'TikTok Shop was live in seven countries at quarter-end, from zero a year earlier, with a goal of more than doubling by holiday. Management positioned it as an acquisition channel for old categories, not just viral launches. Quigley said DTC and social commerce carry a structurally higher gross margin, which is why the channel mix is a margin lever even though it is not sized.' },
        { topic:'AI: Jailbreak SharkNinja', theme:'AI',
          body:'Eight big-bet and 20 quick-win projects run on two-week review cycles; "The concept of a six to nine-month project no longer exists at SharkNinja." AI is compressing product concepting and lifted organic social-content capture from under 20% to 60%+. The financial claim came in Q&A: roughly flat headcount into 2027.' },
        { topic:'Margins: tariffs in COGS, leverage in opex', theme:'Margins',
          body:'Adjusted gross margin fell about 70bp to 48.7%, mostly on the annualization of 2025 tariffs, although gross profit beat internal expectations. Adjusted opex was 35.6% of sales vs 36.0%, a fifth straight quarter of leverage. Adj. EBITDA still grew slower than sales (+18.6% vs +22.2%), and management reaffirmed the full-year goal of EBITDA ahead of sales.' },
        { topic:'Guide raised; $247.1M tariff refund', theme:'Guidance',
          body:'FY2026 net sales guide went to +16.0-17.0% (from +11.5-12.5%), adjusted EPS to $6.45-6.55 and Adj. EBITDA to $1,357-1,369M, with capex tracking to the high end of $190-210M. CBP accepted $247.1M of refund claims, to be recognized in Q3 cost of sales; the half tied to 2025 duties is excluded from adjusted metrics. Only ~$0.15 of the EPS raise and ~$30M of the EBITDA raise are the net refund, so most of the raise is operating.' }
      ],
      qanda:[
        { q:'How big is the TAM now, given the pace of new categories?', analyst:'Randal Konik · Jefferies', theme:'Categories',
          qFull:'You laid out the durability of growth through new categories, core innovation and geographic expansion. Three years ago you framed a TAM of over $100 billion and a SAM of about $40 billion. How do you size that opportunity today, and how does product innovation layer into it?',
          a:'<b>Barrocas:</b> "when we started the second quarter, I think we viewed the available TAM at roughly about <b>$120 billion</b>. Now, that TAM continues to keep growing… we just launched the Ninja Crispi Microwave. That now enters us into a category that we never participated in that is a multi-billion dollar TAM. <b>Over a $3 billion TAM.</b>… In Q3, as we get toward the end of Q3, we\'ll be entering into our <b>41st subcategory</b> that is also a multi-billion dollar subcategory. I think by coming out of the year, Randal, we\'ll be participating in <b>$125 billion-$130 billion</b> available TAM against the overall revenue that we have." On the US: "Our business, our shipments grew <b>18% in the United States</b>. Our POS was even higher than that in the U.S."' },
        { q:'Long-term DTC penetration, the margin differential, and marketing leverage', analyst:'Randal Konik · Jefferies', theme:'Channel',
          qFull:'With TikTok Shop and the merged website, how do you think about long-term direct penetration versus wholesale, what is the margin differential, and is there marketing leverage as brand awareness builds in each country?',
          a:'<b>Barrocas:</b> "The results that you are seeing in the second quarter, with the exception of the United States and Canada, really do not have any impact. In fact, they may even have a little bit of hurt as a result of the DTC transition… There is no doubt that <b>TikTok affiliates DTC in 2027 is going to grow as a faster percentage of our sales</b> than the rest of the business." <b>Quigley:</b> "Obviously, DTC, TikTok Shop, overall social commerce <b>does come at a higher structural gross margin</b>… And then as we scale that business, we start to see overall benefits across our distribution network, across customer service, et cetera." (The marketing-leverage half was not answered directly.)' },
        { q:'How large is domestic DTC, and can domestic grow double digits in the back half?', analyst:'Brooke Roach · Goldman Sachs', theme:'Domestic',
          qFull:'How large is your DTC business domestically, how much will DTC and TikTok Shop contribute to domestic growth this year and into 2027, and can the domestic business grow at a double-digit rate in the back half?',
          a:'<b>Barrocas:</b> "the U.S. business grew <b>18%</b>, the Canada business was <b>down 17%</b> as we flow through all of the remaining changes in Canada… I feel very, very good about a <b>double-digit second half number</b> for the domestic business. <b>We don\'t break out the percentage of our D2C business.</b>… By the fourth quarter, we\'ll be live in Europe in <b>14 different countries</b> with Salesforce. I don\'t think you\'re seeing in the numbers the benefits today of what is going to come from Salesforce and from our D2C side. I think you\'ll start to see that in <b>Q4 of this year</b>, and you\'ll really see it accelerate as we get into 2027."' },
        { q:'POS ahead of shipments: where does channel inventory sit?', analyst:'Brooke Roach · Goldman Sachs', theme:'Inventory',
          qFull:'You spoke to POS running stronger than shipments. Where do inventory levels sit in the channel, and how do you think about sell-in and sell-through realigning?',
          a:'<b>Quigley:</b> "we do see that normalizing as you get into the back half of the year. The Q2 difference is largely driven by the <b>timing of Prime Day</b>. POS certainly outpaced shifts at that point. Overall, the retailer inventory is <b>extremely healthy</b>. We\'re not seeing any pullback on that front." <b>Barrocas:</b> "Look, I would say if anything, I think <b>retailers could take a bit more inventory</b>. Not that they\'re consciously working down their inventory, but I think there\'s a lot of demand to capture… We will at least push for inventory levels to grow as we head into Q4."' },
        { q:'Holiday 2026 planograms, in the US and with new international retailers', analyst:'Steven Forbes · Guggenheim', theme:'Retail',
          qFull:'Beyond the Walmart end caps, what changes with other retail partners and planograms into holiday 2026 after last year\'s missed planogram dates, and are you having earlier planogram conversations with new international partners?',
          a:'<b>Barrocas:</b> "If we were sitting here last year at this time, SharkNinja did not have a lot of ways to get to the end consumer in some of these European markets that it does today. We didn\'t have D2C sites set up. TikTok Shop was not set up in these countries a year ago at this time… We\'ll be up on TikTok Shop platforms in <b>13 countries</b>… yes, we are having lots of conversations with the European retailers. <b>Some are willing to move or for their annual planogram changes, some are simply not.</b>" On the US: "We\'ve got some great promotions that are coming up with <b>Target</b>… We never sold any products other than hair care and skin care to <b>Ulta</b>, and we showed them our Shark ChillPill, and they said this would be an amazing product for them to add to their assortment."' },
        { q:'AI on promotions and media: where is ROAS optimization today?', analyst:'Steven Forbes · Guggenheim', theme:'AI',
          qFull:'On the AI agenda, what is the status of the efficiency work on promotion and media spending, and how would you size the opportunity in better ROAS and promotional optimization?',
          a:'<b>Barrocas:</b> "We went live a couple of weeks ago with a phase one initiative on promotions and optimization management with <b>Palantir</b>… we actually have now moved ahead with a phase two initiative with Palantir that\'ll take about four months to implement. I think you\'ll see the benefits of the Palantir work come through in <b>Q4 promotions and Q4 media planning</b>, primarily in the United States, U.K., Germany, and France." On the AWS media system: "but really for the most part, that won\'t scale until 2027." And: "I think you\'re going to see us be able to really <b>leverage compensation in a big way in 2027</b>. Not to the extent of seeing any type of large reductions, but I think we\'re going to continue to be able to keep growing the business on <b>roughly flat headcount</b> as we get into 2027."' },
        { q:'What drove Cooking & Beverage to its strongest growth in two years?', analyst:'Peter Keith · Piper Sandler', theme:'Categories',
          qFull:'Cooking and beverage was the strongest category, the best in at least two years. What is driving such strong growth there?',
          a:'<b>Barrocas:</b> "our espresso and coffee business has seen very significant growth globally. During the quarter, we launched a fully automatic coffee maker, the <b>Ninja AutoBarista</b>, that launched at <b>$949</b> and was off to a great start… Our Ninja Crispi business has done great in the quarter. We\'ve really built that into a <b>whole franchise of products</b>… You kind of put all of those things together and you just look at kind of <b>further penetration of our heated cooking products into more new countries</b>, and that\'s what drove really nice growth in the quarter."' },
        { q:'Three new sub-categories this year: is that the Jailbreak AI effect?', analyst:'Peter Keith · Piper Sandler', theme:'AI',
          qFull:'It sounds like you will launch three sub-categories this year, an accelerated pace. Is that related to the Jailbreak initiative?',
          a:'<b>Barrocas:</b> "<b>Not really.</b> Peter, we launched the Ninja BlendBoss earlier in the year. We launched the Ninja Crispi Microwave a couple of weeks ago. We have a new subcategory that\'s going to launch in Q3. I think we\'ve publicly said that we would launch in a <b>minimum of two subcategories a year</b>… we have a great pipeline of new categories for 2027, and I think that\'s where you\'re really going to see the <b>impact of AI and the Jailbreak work</b> on our product development."' }
      ],
      dots:'Q4 2025 opened FY2026 conservatively (+10-11%) with tariffs "now fully manifesting in the P&L"; Q1 2026 raised the guide, delivered EBITDA ahead of sales, and flagged the last conversions as a temporary international hit; Q2 2026 closed the transition, accelerated growth to +22.2%, and raised the guide again, but broke EBITDA-ahead-of-sales at the quarter level. The threads now converge on the second half: whether the margin reverses as the guide implies, whether the core (Cleaning) grows fast enough without international and new categories carrying it, and whether the dated promises (DTC benefit in Q4, 13 TikTok Shop countries, flat headcount into 2027) arrive on time.',
      threeMinutes:[
        '<b>Growth accelerated when the Street modelled deceleration.</b> +22.2% against a +13.4% bar, all four categories up, US shipments +18%, international +36.6%, and the FY guide raised ~4.5pp with no refund inside the top-line raise.',
        '<b>The margin miss is the company\'s own red line, not the Street\'s.</b> Adj. EBITDA +18.6% trailed sales on annualizing tariffs while opex levered for a fifth quarter. The guide implies it reverses in 2H; Q3 is the test.',
        '<b>Read Q3 on the adjusted line.</b> The $247.1M refund hits Q3 cost of sales, but only the 2026 half is in adjusted metrics, and only ~$30M of it survives reinvestment into the EBITDA guide. A GAAP blowout will not be a business blowout.'
      ],
      notBringing:[
        { item:'"EPS miss" headlines ($0.92 vs $1.20)', why:'That compared GAAP EPS against an adjusted consensus. Adjusted EPS was $1.26 against $1.10-1.11.' },
        { item:'TAM of $125-130bn', why:'A management sizing, useful for runway framing but not a number to model against; the category growth rates are the evidence.' },
        { item:'Fans selling out', why:'Real, but weather-led and seasonal. Not a reason to extrapolate Beauty & Home Environment\'s +65.3% into Q3.' }
      ],
      newQuestions:[
        { n:'Adjusted EBITDA back ahead of net sales: does the 2Q26 break actually reverse in Q3, as the FY guide implies?', landed:{ q:'Q3 2026', rank:1 }, tripped:true },
        { n:'Cleaning "growing, not flat": does the largest category get back toward the Street\'s +7.6% after +4.1%?', landed:{ q:'Q3 2026', rank:2 } },
        { n:'The DTC re-platform benefit: management said it is not in the numbers yet and should show in Q4 2026. Is there any early evidence?', landed:{ q:'Q3 2026', rank:3 } },
        { n:'Is the $247.1M refund read correctly (GAAP carries about twice the adjusted benefit), and is the promised reinvestment visible in opex?', landed:{ q:'Q3 2026', rank:4 } },
        { n:'Capex tracking to the high end of $190-210M: does it land inside the range, after FY2025 undershot its floor?', landed:{ q:'Q3 2026', rank:5 } },
        { n:'"Roughly flat headcount" into 2027: does the language survive the 2027 planning cycle?', landed:{ q:'Q3 2026', rank:6 } },
        { n:'Will DTC and social-commerce share ever be disclosed, given the claimed structurally higher gross margin?', landed:{ q:'Q3 2026', rank:7 } },
        { n:'SN enters the Bloomberg consensus archive, so a frozen pre-print column exists to score Q3 against (ours, not the company\'s).', landed:{ q:'Q3 2026', rank:8 } }
      ]
    } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 31, 2026; reported May 6, 2026 BMO, call 8:30am ET) ──
  // Sources: Q1 2026 earnings release (8-K Ex. 99.1, Quartr documentId 3289577) and the full call
  // transcript (Quartr eventId 555079, documentId 3776135). Going-in context from the Q4 2025
  // release and call (Feb 11, 2026; eventId 399981) via js/themes-data/sn.js and
  // js/overviews/sharkninja-quartr.js. No Summit model exists for SN, so setup.us is empty.
  { q:'Q1 2026', status:'reported', date:'May 6, 2026',
    setup:{
      source:'Company FY2026 outlook (Feb 11, 2026 release) · pre-print consensus from earnings-day coverage (Zacks via Yahoo Finance; see CONSENSUS block) · no Summit model for SN', asOf:'May 2026',
      notes:{
        'Revenue':{ t:'No quarterly guide: the only company number is FY2026 at +10.0–11.0%', h:'<p>SharkNinja guides the fiscal year, never the quarter. The Feb 11 opener was <b>+10.0–11.0%</b> on FY2025 net sales of $6,399.2M, i.e. roughly <b>$7.04–7.10B</b>. FY2025 opened at +10–12% and finished at <b>+15.7%</b> after four raises, so the opener is a floor-setting exercise, not a forecast.</p><p>Q1 is the smallest quarter of the year (1Q25 $1,222.6M). Pre-print consensus compiled by Zacks sat at <b>$1.37B</b> (about +12%); another aggregator showed $1.42B. The outlets disagree, so treat the bar as a range.</p>' },
        'Gross profit':{ t:'The first full quarter of tariffs against an almost tariff-free comp', h:'<p>Quigley set the shape on the Q4 call: "the first half, we expect a <b>decent gross margin headwind driven by tariffs</b>, with slight offsets driven by all the cost optimization efforts". The comp is 1Q25 at <b>49.3% GAAP / 50.2% adjusted</b>.</p><p>Basis note: the JS Global sourcing fee ended Jul 31, 2025, so the Product Procurement Adjustment ($6.5M in 1Q25) is gone and the GAAP-to-adjusted gap collapses. The adjusted margin decline will look larger than the GAAP one for that reason alone.</p>' },
        'Adj. EBITDA':{ t:'Guided $1,270–1,280M: the expansion has to come from opex', h:'<p>FY2026 guide <b>$1,270–1,280M (+11.8–12.7%)</b>, against the stated goal of Adjusted EBITDA growing faster than net sales. With gross margin guided down in 1H on tariffs, the margin has to come from adjusted opex leverage, which had levered three quarters running into this print. 1Q25 comp $200.4M (16.4% margin).</p>' },
        'Adj. EPS (diluted)':{ t:'Guided $5.90–6.00 for the year; the Street had about $1.01 for the quarter', h:'<p>FY2026 guide <b>$5.90–6.00</b> on ~143.5M diluted shares. 1Q25 printed $0.87. Pre-print consensus per Zacks was <b>$1.01</b>; one aggregator showed $1.06 and another $0.84, so the bar is not clean.</p><p>Basis trap: adjusted EPS excludes realized and unrealized FX, which sits in GAAP other income. 1Q25 GAAP carried <b>+$13.2M of other income</b>, so the GAAP line has a flattering comp the adjusted line does not.</p>' },
        'Operating cash flow':{ t:'Q1 is seasonally a cash outflow: do not read the sign', h:'<p>Q1 collects holiday receivables but pays down the accrued retailer programmes and payables built in Q4. 1Q25 operating cash flow was <b>−$54.9M</b>. The size of the outflow is the signal to read, not the fact that it is negative.</p>' },
        'Capex':{ t:'Guided $190–210M, after FY2025 undershot its own range', h:'<p>FY2026 capex guide <b>$190–210M</b>, primarily new product launches and technology. FY2025 guided $180–200M all year and reported <b>$146.1M</b> on the cash-flow line. The company has not reconciled guided capex to the cash-flow definition, so a light Q1 is not yet evidence either way. 1Q25 property and equipment purchases were $32.7M.</p>' },
        'Cleaning':{ t:'The core came in slow: +3.4% in 4Q25', h:'<p>The largest category grew only <b>+3.4% in 4Q25</b>. Management said 2026 brings "breakthrough innovations across several legacy categories, including corded uprights", but those land later in the year. This is the line that tests whether the core is still compounding under the new categories.</p>' },
        'Beauty & Home Environment':{ t:'Coming off +63.2%, the fastest line in the company', h:'<p>4Q25 printed <b>+63.2% to $326M</b>, the category\'s highest growth rate of the year, led by skincare. Barrocas sized the market-making: the US LED mask market was $35M in 2024 and SharkNinja did more than 2x that in 2025 alone. Q1 is seasonally light for fans, so the skincare mix does the work here.</p>' },
        'International net sales':{ t:'Accelerating into the print, with a pre-announced Q1 disruption', h:'<p>International grew <b>+23.2% in 2H25</b> versus +17.3% in 1H25. Management flagged in February that the <b>Italy and Spain</b> distributor-to-direct conversions would disrupt Q1, with a normalized business "by the end of Q2". Read Q1 international growth net of that drag.</p>' }
      },
      us:{},
      debate:{ rows:null, synth:'The one thing to resolve: can SharkNinja absorb the <b>first full quarter of tariffs</b> in gross margin and still grow Adjusted EBITDA faster than sales through <b>opex leverage</b>, while international carries the Italy/Spain conversion drag and the core Cleaning category proves it is growing again after +3.4% in 4Q25?' },
      pricedIn:'The company had opened FY2026 at +10.0–11.0% net sales, $5.90–6.00 adjusted EPS and $1,270–1,280M Adjusted EBITDA, the same conservative posture as FY2025, which it raised four times. Zacks-compiled consensus for the quarter was $1.37B of revenue and $1.01 of adjusted EPS, both implying growth above the annual guide pace. The known costs were pre-announced: tariffs fully in gross margin for 1H, and Italy/Spain disruption in Q1.',
      oneLiner:'The bar was "absorb the tariff quarter and start the raise cycle". SharkNinja did both: +15.6% sales, Adjusted EBITDA +17.5% ahead of sales, and a guide raise on all three headline lines. The one crack was Food Preparation, down 3.3% against its SLUSHi sell-in comp.' },
    results:{
      summary:{
        paras:[
          { p:'<b>The quarter confirms the FY2026 guide is running the FY2025 playbook: a conservative opener, raised at the first print.</b> Net sales grew 15.6% against a +10.0–11.0% annual guide, and the raise to +11.5–12.5% is roughly the size of the Q1 over-delivery plus a little. The implied rest-of-year pace is about +10.5% to +11.8% on FY2025 net sales, so management has banked Q1 and left the remaining three quarters near the original pace. For the analysis, the guide should be read as a floor that has now moved once, not as a forecast.' },
          { p:'<b>The margin story is working as designed: gross margin gives, opex takes.</b> Adjusted gross margin fell 100bps on a full quarter of tariffs, and adjusted opex fell about 100bps as a share of sales, the fourth straight quarter of leverage. Adjusted EBITDA grew 17.5% against 15.6% sales growth, so the stated goal held. The caveat is basis: GAAP operating income grew only 13.5% because share-based compensation nearly tripled to $30.3M, and GAAP net income rose 3.1% on an FX swing in other income. The adjusted lines are the ones management guides, but the gap is widening.' },
          { p:'<b>Diversification did the job the thesis assigns to it, and it also exposed the lumpiest line.</b> Market categories declined low-to-mid single digits in the US per Circana while the US business grew about 10%, and Beauty & Home Environment grew 40.8%. Food Preparation fell 3.3% against the frozen-drinks sell-in of 1Q25, the only category down. That is a comp effect management explained, but it breaks the every-category-grows line for one quarter and makes the second-half blender relaunch a dated test.' }
        ]
      },
      notes:{
        'Revenue':{ t:'+15.6% against a +10–11% annual guide', h:'<p><b>$1,412.8M (+15.6%; +12.7% constant currency)</b> versus Zacks-compiled consensus of $1.37B. The 12th consecutive quarter of double-digit organic growth, delivered while the US categories SharkNinja competes in declined low-to-mid single digits ex-SharkNinja (Circana). FX added roughly 3pp.</p>' },
        'Gross profit':{ t:'GAAP margin down 10bps, adjusted down 100bps: the tariff quarter', h:'<p>GAAP gross profit <b>$695.0M (+15.2%, 49.2%)</b>; adjusted <b>$695.5M (49.2%, −100bps)</b>. Tariffs were the driver, partly offset by cost optimization, favorable category and channel mix, and the end of the JS Global sourcing fee. Quigley said results "came in at the high end of our expectations". On the call he gave the GAAP margin as 49.3%; the release table shows 49.2%.</p>' },
        'Operating income':{ t:'GAAP +13.5%, slower than sales, on share-based comp', h:'<p><b>$164.5M (+13.5%, 11.7% margin, −20bps)</b>. Adjusted operating income $200.9M (+16.1%, 14.2%, flat). The gap is share-based compensation at <b>$30.3M vs $11.6M</b>; G&A grew 22.4%, "The bulk of this increase came from taxes related to share-based compensation" per Quigley, and 11% on an adjusted basis.</p>' },
        'Adj. EBITDA':{ t:'+17.5%, ahead of sales: the stated goal held', h:'<p><b>$235.4M (+17.5%, 16.7% margin, +30bps)</b>. Adjusted opex was $494.7M, 35.0% of sales versus 36.0%, the fourth consecutive quarter of leverage. R&D and sales and marketing each levered about 20bps; the FY guide went to $1,290–1,300M.</p>' },
        'Adj. EPS (diluted)':{ t:'$1.09, +25.3%: the fourth straight quarter above 23%', h:'<p><b>$1.09 vs $0.87</b>, above the $1.01 Zacks consensus. Non-GAAP tax rate 20.7%. GAAP diluted EPS was <b>$0.85 (+2.4%)</b>: other income swung from +$13.2M to −$10.3M (FX) and share-based comp rose, both excluded from the adjusted line.</p>' },
        'Operating cash flow':{ t:'−$156.3M, a larger seasonal outflow than last year', h:'<p><b>−$156.3M vs −$54.9M</b>. The swing is accrued expenses and other liabilities (−$335.8M vs −$204.5M) and a smaller receivables release ($182.2M vs $237.4M). Cash fell to $511.8M from $777.3M at year-end; total debt $729.0M. Seasonal, but about $100M worse than the comp.</p>' },
        'Capex':{ t:'$33.9M, light against a $190–210M guide', h:'<p>Purchases of property and equipment <b>$33.9M</b> ($32.7M in 1Q25), plus $4.4M of intangible purchases. About 17% of the guide midpoint in the first quarter; the guide was reiterated at $190–210M.</p>' },
        'D&A':{ t:'$38.4M, +20%', h:'<p><b>$38.4M vs $31.9M</b>. Still under 3% of sales: the company owns no factories, so D&A is tooling, technology and acquired intangibles ($4.9M of acquired-intangible amortization is excluded from adjusted opex).</p>' },
        'Diluted shares':{ t:'142.4M, and the FY guide stepped down to ~143.0M', h:'<p>Weighted diluted shares <b>142.36M vs 142.18M</b>. The FY guide moved to ~143.0M from ~143.5M. The first buyback purchases: 193,135 shares held in treasury at a cost of $20.0M (about $104 per share, derived), of the $750M authorization.</p>' },
        'Cleaning':{ t:'+17.0%: the core re-accelerated from +3.4%', h:'<p><b>$516.6M (+17.0%)</b>, driven by carpet extractors and corded vacuums, with the Shark StainForce spot cleaner called out. Well above the Zacks-compiled category estimate of $463.5M. Barrocas: "Our base business isn\'t just healthy, it\'s thriving".</p>' },
        'Cooking & Beverage':{ t:'+19.8% on Luxe Café and Crispi', h:'<p><b>$414.6M (+19.8%)</b>, driven by the Ninja Luxe Café espresso machine and Ninja Crispi, above the Zacks-compiled estimate of $373.6M.</p>' },
        'Food Preparation':{ t:'−3.3%: the only category down, on the SLUSHi comp', h:'<p><b>$287.5M (−3.3%)</b>, versus a Zacks-compiled estimate of $345.0M. Frozen drinks declined against "a particularly large quarter of sell-in of our frozen treats business in Q1 2025" (Quigley), partly offset by strong blending growth. Management promised more frozen-treats innovation and a reinvented blender line in 2H26.</p>' },
        'Beauty & Home Environment':{ t:'+40.8%, led by skincare', h:'<p><b>$194.1M (+40.8%)</b>, primarily skincare led by Shark CryoGlow, above the Zacks-compiled estimate of $179.3M. The fastest-growing category again, though decelerating from +63.2% in 4Q25 on a seasonally smaller quarter.</p>' },
        'Domestic net sales':{ t:'+8.4%, with the US near +10% and Canada down', h:'<p><b>$916.0M (+8.4%)</b>. US net sales were 60.8% of the total, about $859M and roughly +10% (derived), matching Barrocas\'s "up 10% on shipments", with POS growth higher. Canada fell on a structural move from direct import to domestic; derived Canada sales are about $57M versus $67M. The segment total understates the US.</p>' },
        'International net sales':{ t:'+31.6%, through the Italy/Spain disruption', h:'<p><b>$496.8M (+31.6%)</b>, an acceleration from +23.2% in 2H25. UK net sales about <b>$220M (+18%)</b>, 15.5% of the total. Mexico strong after the move to direct. Growth was reported despite "a bit of a hit" from the Italy and Spain conversions. Constant-currency growth for the segment was not disclosed.</p>' }
      },
      watch:{ 'Food Preparation':1, 'International net sales':2, 'Gross profit':3, 'Adj. EBITDA':4 },
      thesisCheck:[
        { line:'Every one of the four categories grows', tripped:true, note:'BROKE for the quarter. Food Preparation −3.3% against the 1Q25 frozen-drinks sell-in, with blending growing. Management framed it as a comp effect and pointed to a 2H26 blender reinvention; the other three grew 17.0% to 40.8%.' },
        { line:'Adjusted EBITDA grows faster than net sales', tripped:false, note:'Held: +17.5% versus +15.6%, with adjusted gross margin down 100bps offset by about 100bps of adjusted opex leverage.' },
        { line:'Adjusted opex levers as a share of sales', tripped:false, note:'Held: 35.0% versus 36.0%, the fourth consecutive quarter.' },
        { line:'International keeps compounding above 25%', tripped:false, note:'Held at +31.6%, an acceleration from +23.2% in 2H25, through the Italy/Spain transition. Note Quigley then framed the business at "low 20s%" going forward.' },
        { line:'The FY guide is never cut', tripped:false, note:'Raised on all three headline lines at the first print: net sales to +11.5–12.5%, adjusted EPS to $6.00–6.10, Adjusted EBITDA to $1,290–1,300M.' },
        { line:'No customer-concentration deterioration', tripped:false, note:'Not re-disclosed in the quarterly release; the FY2025 10-K figure stands. Unverified this quarter rather than assumed good.' }
      ],
      intoCall:[
        '📈 <b>The raise</b>: +1.5pp on the top line is roughly the Q1 over-delivery. Does management signal conservatism for the remaining three quarters?',
        '🧾 <b>Gross margin inputs</b>: tariff rates came down after the Supreme Court ruling while oil and resin moved up with the Middle East conflict. Which wins in 2H?',
        '🌍 <b>International pace</b>: +31.6% with Italy/Spain still converting. What is the run-rate once the conversions finish in Q2?',
        '🥤 <b>Food Preparation</b>: how much of the decline is the SLUSHi comp, and when does the category grow again?'
      ],
      priceReaction:'Reports conflict and no settled close is frozen here. Investing.com coverage described a pre-market decline of about 2–3% and a move from a $117.41 prior close to about $114; other earnings-day coverage described shares down roughly 5.5% by midmorning after an early gain; Simply Wall St later described the stock as down 7.7% after the print (window not stated). Confirm against a price history before quoting a number.' },
    call:{
      take:'A beat-and-raise that looked like FY2025 repeating: the tariff quarter was absorbed through opex, the guide went up, and the only real miss was a frozen-drinks comp. The call spent its time on culture and AI rather than numbers, and the most useful disclosures came in Q&A: tariffs at parity on about 66% of the business, no price increases in the guide, and international framed at "low 20s%".',
      highlights:[
        { tag:'thesis', band:'lead', open:'Is the raise only Q1 banked, or does the rest-of-year pace move too?',
          head:'The FY2026 guide went up on all three headline lines at the first print, and the top-line raise is roughly the size of the Q1 over-delivery',
          detail:'<p>Net sales to +11.5–12.5% from +10.0–11.0%, adjusted EPS to $6.00–6.10 from $5.90–6.00, Adjusted EBITDA to $1,290–1,300M from $1,270–1,280M. The guide assumes current tariff levels persist, including minimum rates cut from 20% to 10% for China, Vietnam, Indonesia, Thailand, Malaysia and Cambodia, and includes <b>no tariff refund</b>. The implied rest-of-year growth is about +10.5% to +11.8%.</p>' },
        { tag:'thesis', band:'context',
          head:'Share gains in a shrinking market: US categories fell low-to-mid single digits ex-SharkNinja per Circana, while the US business grew about 10% on shipments with POS higher',
          detail:'<p>Barrocas used it to argue the outperformance is structural. Konik (Jefferies) asked how industry trends play out for the balance of the year and did not get a forecast; the answer went to SharkNinja\'s own POS, "double-digit increases", as the setup for Q2. Canada was down on a structural shift from direct import to domestic, recovering in 2H.</p>' },
        { tag:'watch', band:'context',
          head:'Gross margin now has offsetting inputs: tariffs down since the last call and at parity inside and outside China on about 66% of the business, against resin and freight from the Middle East conflict',
          detail:'<p>Quigley said the guide plans tariffs "straight up" at current rates, with "some conservatism on that front", and that the raw-material impact is "manageable" and included. Barrocas said no demand impact from the war was visible in daily Q2 POS and that orders are now placed "at an individual order by order basis" between factories inside and outside China.</p>' },
        { tag:'curious', band:'context',
          head:'International framed at "low 20s%" going forward, explicitly not guidance, just after printing +31.6%',
          detail:'<p>Quigley to Parikh (Oppenheimer). Barrocas said the company "will completely have right-sized our international sales model" by the end of Q2, with new DTC sites live in the UK, Germany and France, TikTok Shop heading to seven countries, and a launch in South Africa built on "spillover" of English-language media. The framing sets a bar below the Q1 run-rate.</p>' },
        { tag:'tone', band:'logged',
          head:'Media leverage is not a long-term expectation: Barrocas told Forbes (Guggenheim) to expect efficiency, not leverage, as Europe and Latin America keep absorbing brand spend',
          detail:'<p>Q1 was the first quarter of advertising leverage per the question. The answer caps the opex-leverage argument on the sales and marketing line and puts the burden on AI tooling for media efficiency, with measurement of TikTok Shop spillover singled out for Q4.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: Jailbreak SharkNinja AI programme (150+ submissions, $1M prize fund, a company-wide Hack Week with 20 cross-functional projects) · subcategory 39 (Shark BlastBoss) · ChillPill at $149',
          detail:'<p>The prepared remarks gave most of their time to culture and AI with no quantified financial target attached. Barrocas said beauty should help SharkNinja "ultimately expand into wellness in 2027". No price increases are planned in the guide; new launches are priced "a little bit higher" and adjusted.</p>' },
        { tag:'watch', band:'logged', open:'Buyback pace: roughly $20M of $750M in the first quarter of the authorization.',
          head:'Capital return started slowly: about $20M repurchased through March, with reinvestment stated as the priority',
          detail:'<p>Quigley: the authorization will be used "opportunistically when we feel it is appropriate while steadfastly reinvesting into the business as our priority". Share-based compensation was $30.3M in the quarter, so the purchases did not yet offset issuance; the diluted share guide still stepped down to ~143.0M.</p>' }
      ],
      prepared:[
        { topic:'Q1: +15.6% in a declining market', theme:'Growth',
          body:'Net sales rose 15.6% to $1,412.8M, the 12th consecutive quarter of double-digit organic growth. Barrocas cited Circana data showing the US categories SharkNinja competes in declined low to mid single digits excluding SharkNinja. It matters because it separates share gains from category tailwinds: the growth came against the market.' },
        { topic:'Categories: three grow, Food Preparation laps SLUSHi', theme:'Categories',
          body:'Cleaning grew 17.0% to $516.6M on corded uprights and carpet extraction; Cooking & Beverage 19.8% to $414.6M on Luxe Café and Crispi; Beauty & Home Environment 40.8% to $194.1M on skincare led by CryoGlow. Food Preparation fell 3.3% to $287.5M against a very large frozen-treats sell-in in 1Q25, with blending growing. Management used the quarter to argue that diversification absorbs a single-category comp.' },
        { topic:'International +31.6% through the conversions', theme:'International',
          body:'International net sales rose 31.6% to $496.8M, with the UK up 18% to $220M and Mexico strong after its move to a direct model. Barrocas said growth held even while Italy and Spain were converting from distributors. New DTC sites and TikTok Shop are rolling across EMEA in the first half, which positions the second half as the first with the full omni-channel set in place.' },
        { topic:'Margins: tariffs in gross margin, leverage in opex', theme:'Margins',
          body:'Adjusted gross margin fell about 100bps to 49.2% on a full quarter of tariffs, partly offset by cost optimization, pricing and mix. Adjusted opex was $495M, 35% of sales versus 36%, the fourth straight quarter of leverage. Adjusted EBITDA grew 17.5% to $235M at a 16.7% margin, so the goal of EBITDA growing faster than sales held.' },
        { topic:'FY2026 guide raised on every headline line', theme:'Guidance',
          body:'Net sales now +11.5–12.5% (from +10.0–11.0%), adjusted EPS $6.00–6.10 (from $5.90–6.00), Adjusted EBITDA $1,290–1,300M (from $1,270–1,280M); capex $190–210M and the 22–23% GAAP tax rate unchanged. The guide assumes current tariffs persist, including minimum rates cut from 20% to 10% for six Asian sourcing countries, excludes any tariff refund, and includes a manageable resin impact from the Middle East conflict.' },
        { topic:'Jailbreak SharkNinja: AI through the culture', theme:'AI',
          body:'Barrocas launched a company-wide AI programme with a $1M prize fund and more than 150 employee submissions, followed by a Hack Week with 20 cross-functional and over 400 departmental projects. He named consumer insights, product development, media efficiency and supply chain as the areas of impact. No financial target was attached, so it reads as an operating-model claim to track rather than a number to model.' },
        { topic:'Balance sheet and the first buyback', theme:'Capital allocation',
          body:'Cash ended at about $512M and total debt at $729M, with $489M of revolver capacity. Inventory was $1.03B, up 6.3% year over year as the tariff pre-build of late 2024 and early 2025 laps. About $20M of stock was repurchased against the $750M authorization, with reinvestment stated as the priority.' }
      ],
      qanda:[
        { q:'US industry trends for the year, and how much more bullish on international', analyst:'Randal Konik · Jefferies', theme:'International',
          qFull:'You gave US industry trends for the quarter; how do they play out for the rest of the year? And with international holiday orders strong, brand awareness still low, TikTok Shop about to start and the UK accelerating, are you more bullish on how big international can get, including the prior 50% of the business idea, and how fast?',
          a:'<b>Barrocas:</b> "…the industry was down, you know, low-to-mid single. Our <b>U.S. business was up 10% on shipments</b>. It was up more than that in POS." On Canada: "Our Canada business had some structural changes… that had the Canada business down year-over-year." On international: "we actually just went live with our <b>new DTC platform in the U.K., two weeks ago, in Germany and France this week</b>… When we come out of Q2, Randal, I mean, we\'re now gonna have the entire world on our new Salesforce platform. We\'re gonna have <b>TikTok Shop operating in seven countries</b>." And: "we\'re in the midst right now of <b>transitioning Italy and Spain</b> from a distributor market to a direct market, so we took a bit of a hit in that in Q1." No size or timing was given for the 50% idea.' },
        { q:'How big Beauty can become, and what categories come next', analyst:'Randal Konik · Jefferies', theme:'Categories',
          qFull:'Beauty was essentially zero four years ago and is now around 15% of sales, focused on skincare and haircare. How do you frame adding more areas to it, and how big can the category be?',
          a:'<b>Barrocas:</b> "I\'ve been <b>historically bad at answering how big a business could be</b>, \'cause whatever number I give you, I think we\'re gonna undershoot…" He pointed to hair categories not yet entered, a strong 2H skincare roadmap, and: "I think that, you know, our beauty business is gonna help us <b>ultimately expand into wellness in 2027</b>." On the ChillPill: "It\'s not just what we\'re doing in beauty, it\'s how is what we\'re doing from one category <b>helping us translate to product innovation in another category</b>."' },
        { q:'The Iran war and oil: demand by geography, freight and raw materials', analyst:'Brooke Roach · Goldman Sachs', theme:'Margins',
          qFull:'What are the implications of the Iran war and higher oil prices for SharkNinja this year and into 2027? Have you seen any change in demand quarter to date in any geography, and how are you thinking about fuel, freight and raw material costs?',
          a:'<b>Barrocas:</b> "…we\'re looking at daily POS around the world, and we have <b>not seen any impacts right now in the second quarter</b> as it relates to demand from the war." And: "tariffs have come down, you know, since our last call… I think there will be <b>some impact on resin prices that are gonna partially offset</b> some of those tariff benefits." <b>Quigley:</b> "The raw materials are gonna be an impact to everybody in our industry. Our goal is how do we face that challenge better than others?" On tariffs: "We\'ve planned that very much straight up in terms of, you know, what the rate is at that moment in time. I think there\'s <b>some conservatism on that front</b>."' },
        { q:'Pricing for new innovation and for existing categories', analyst:'Brooke Roach · Goldman Sachs', theme:'Pricing',
          qFull:'How are you thinking about pricing, both for new launches and in existing categories, for the rest of the year?',
          a:'<b>Barrocas:</b> "…there\'s <b>nothing at this point planned from a price increase standpoint</b>, in our guide through the end of the year." On launches: "we\'re probably <b>erring on the side of going a little bit higher as we launch</b>, and then seeing how it plays out in the numbers, and we can always adjust accordingly. We launched our Shark ChillPill at $149."' },
        { q:'International growth rates for the balance of the year', analyst:'Rupesh Parikh · Oppenheimer', theme:'International',
          qFull:'International had very strong momentum in Q1. How should we think about its growth rate for the rest of the year?',
          a:'<b>Barrocas:</b> "…by the end of Q2, I mean, we will <b>completely have right-sized our international sales model</b>, in a year and a half, and I think it sets us up really well as we get into the second half of this year and into next year." On media: "We call this concept <b>spillover</b>." <b>Quigley:</b> "I think we feel, you know, very strong that <b>international growth will remain in the low 20s%</b>, right? Not official guidance, but certainly, you know, where we think that business is heading."' },
        { q:'DTC and TikTok Shop contribution, retailer inventory, and domestic building blocks', analyst:'Jonna Kim · TD Cowen', theme:'Channel',
          qFull:'How much did TikTok Shop and DTC contribute to domestic sales this quarter? Are you hearing of any inventory pullback from domestic retailers? And what are the key building blocks for domestic growth going forward?',
          a:'<b>Barrocas:</b> "…the key building blocks for domestic growth are <b>a strong base business and layering on new innovation</b> on top of that." On inventory: "Kind of structurally <b>we\'re not hearing from any of our retailers that they\'re pulling back on weeks of supply</b>…" And: "We\'re <b>reinventing our whole blender category in the second half</b> of this year that\'s gonna be launching." <b>Quigley:</b> "Jonna, <b>we don\'t break out specifically, DTC and TikTok Shop</b> overall… those channels are growing at a faster rate, you know, than the overall domestic business…"' },
        { q:'Supply chain: the factory-partner initiative and where it is optimizing', analyst:'Steven Forbes · Guggenheim Securities', theme:'Supply chain',
          qFull:'Given the supply chain complexity, can you update us on the One SharkNinja Voice initiative with factory partners: how many have you met, what optimization areas have you found, and what are they asking of you?',
          a:'<b>Barrocas:</b> "…supply chain challenges are, you know, have been a thing now for years… <b>tariffs are parity in China right now and outside of China in about 66% of our business</b>. It allows us now the flexibility of moving production back and forth very easily." And: "<b>all of our top SKUs are sourced at more than one factory</b>. Most of our SKUs are sourced inside of China and outside of China." On placement: "Literally, Steve, we\'re doing it at an <b>individual order by order basis</b>."' },
        { q:'Brand affiliate plans and whether advertising leverage continues', analyst:'Steven Forbes · Guggenheim Securities', theme:'Margins',
          qFull:'Social engagement is surging and this looked like the first quarter of advertising leverage. Can you update the brand affiliate plans, refining partners and finding leverage while still stimulating demand?',
          a:'<b>Barrocas:</b> "…the work that we\'re doing with AI and technology on our media and marketing space is gonna be <b>transformational</b> to the business. I mean, particularly as we get into Q4." But: "I don\'t think, Steve, that we should think of it as that <b>we\'re gonna get media leverage, you know, on a long-term basis</b>. I think there\'s a lot of countries for us to continue to keep investing into." And: "I wouldn\'t expect, you know, lots of leverage moving forward, but I would expect that, you know, <b>we\'re gonna drive efficiency in our media</b>…"' }
      ],
      dots:'Q4 2025 set the FY2026 posture: a +10–11% opener, a pre-announced 1H tariff hit to gross margin, and the Italy/Spain conversions as a named Q1 drag. Q1 2026 cleared all three: sales +15.6%, EBITDA ahead of sales through opex leverage, international +31.6% through the conversions, and the guide raised. What it added is a new set of tensions for Q2: management framed international at "low 20s%" and ruled out long-term media leverage, both of which lower the bar for the two engines that carried Q1, while Food Preparation turned negative and share-based comp nearly tripled below the adjusted line.',
      threeMinutes:[
        '<b>The raise cycle has started, on schedule.</b> +15.6% against a +10–11% guide, raised to +11.5–12.5% with EPS and EBITDA up too. The implied rest-of-year pace barely moved, which is the FY2025 pattern: bank the quarter, keep the floor.',
        '<b>The margin mechanism held.</b> Adjusted gross margin −100bps on tariffs, adjusted opex −100bps as a share of sales, EBITDA +17.5% ahead of sales. But GAAP operating income grew only 13.5% as share-based comp went to $30.3M from $11.6M.',
        '<b>One category broke, on a comp.</b> Food Preparation −3.3% against the 1Q25 SLUSHi sell-in while Cleaning re-accelerated to +17.0%. Diversification absorbed it; the blender relaunch in 2H is the dated test.'
      ],
      notBringing:[
        { item:'The Jailbreak SharkNinja programme details', why:'Most of the prepared remarks, but no financial target attached. Logged as an operating claim, not a thesis line.' },
        { item:'GAAP net income +3.1%', why:'Driven by an FX swing in other income ($13.2M gain to a $10.3M loss). Share-based comp is the GAAP point worth raising; the FX is noise.' },
        { item:'The negative Q1 operating cash flow as a headline', why:'Q1 is seasonally an outflow. The size of the swing versus 1Q25 (about $100M worse) is worth a line; the sign is not.' }
      ],
      newQuestions:[
        { n:'Food Preparation back to growth once the SLUSHi comp laps, ahead of the 2H blender relaunch?', landed:{ q:'Q2 2026', rank:1 }, tripped:true },
        { n:'International after the conversions finish: does it hold above management\'s "low 20s%" framing?', landed:{ q:'Q2 2026', rank:2 } },
        { n:'Gross margin: does tariff relief outrun resin and freight, narrowing the −100bps adjusted decline?', landed:{ q:'Q2 2026', rank:3 } },
        { n:'Adjusted EBITDA ahead of sales without media leverage: where does the opex leverage come from?', landed:{ q:'Q2 2026', rank:4 } },
        { n:'DTC and TikTok Shop in seven countries: any sizing, or does the channel stay undisclosed?', landed:{ q:'Q2 2026', rank:5 } },
        { n:'Buyback pace versus share-based comp: does repurchasing start to offset $30M a quarter of issuance?', landed:{ q:'Q2 2026', rank:6 } }
      ]
    } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 31, 2025; reported Feb 11, 2026 BMO, call 8:30am ET) ──
  // Sources: Q4/FY2025 earnings release (Quartr documentId 2802766, eventId 399981), the Q4 2025
  // call transcript (Quartr eventId 399981, read in full), the Q3 2025 call (eventId 372004) for the
  // Q4 guide that stood going in, js/overviews/sharkninja-quartr.js (guidance walk) and
  // js/themes-data/sn.js (Q4 2025 theme quotes). No Summit model exists for SN: setup.us is {}.
  // Transcript note: the first Q&A answer (Brooke Roach) and her follow-up were garbled by an audio
  // failure on the line; nothing is quoted from the garbled paragraphs. The second analyst is
  // rendered in the transcript as "Steve Force with Goldman Sachs" (said during the audio recovery);
  // he is Steve Forbes of Guggenheim, who covers SN.
  { q:'Q4 2025', status:'reported', date:'February 11, 2026',
    setup:{
      source:'Company outlook: FY2025 guide + explicit Q4 frame from the Q3 2025 release and call (Nov 6, 2025) · Street: Zacks consensus via earnings-day coverage (Nasdaq / Yahoo Finance / Finviz) · no Summit model for SN', asOf:'Feb 2026',
      notes:{
        'Revenue':{ t:'Guided "around 16%" — the holiday quarter carries the whole FY raise', h:'<p>At the Q3 print Quigley framed Q4 directly: net sales growth <b>"around 16%"</b> (~$2,073M on the $1,787.2M comp). The final FY2025 guide of <b>+15.0–15.5%</b> implies Q4 at <b>$2,060–2,088M</b> (+15.3–16.8%) once the reported 9M ($4,297.8M) is subtracted. Zacks consensus <b>$2.07B</b> sits mid-range.</p><p>The frame is an acceleration from Q3\'s +14.3% into a U.S. market management itself called declining, with some Q3 shipments already moved into Q4. SharkNinja has raised the FY guide at every print this year; the pattern says the top of the implied range is the real bar.</p>' },
        'Gross profit':{ t:'Guided DOWN ~50bps — the tariff timing bill arrives', h:'<p>Quigley guided adjusted gross margin <b>~50bps lower YoY</b> in Q4 (from 47.8% to roughly 47.3%). The reason is a basis trap in Q3: of that quarter\'s ~90bps of adjusted margin expansion, he said <b>"two-thirds was the result of favorability related to the timing of tariffs"</b>. Q4 is where the timing reverses and the tariffed cost reaches the P&L, with most of the pre-built inventory already worked through.</p><p>GAAP and adjusted gross profit now differ only by the small Product Procurement Adjustment (the JS Global sourcing agreement ended Jul 31, 2025).</p>' },
        'Operating income':{ t:'No guide on the GAAP line — watch the SBC comp', h:'<p>SharkNinja guides adjusted EBITDA, not GAAP operating income. The comp matters: 4Q24 GAAP operating income ($205.1M, 11.5%) carried <b>$37.2M of share-based compensation</b> and a $25.6M FX loss below the line. Any step-down in SBC flows straight into GAAP growth while the adjusted line ignores it, so the two can print very different growth rates.</p>' },
        'Adj. EBITDA':{ t:'Guided +~200bps of margin — implies ~$375–385M', h:'<p>The Q4 frame: adjusted opex leverage of <b>nearly 250bps</b> against the ~50bps gross-margin headwind, for adjusted EBITDA margin <b>+~200bps YoY</b> (16.3% to ~18.3%). The FY guide of <b>$1,115–1,125M</b> minus the 9M actual ($740.3M) implies Q4 at <b>$375–385M</b>, +29–32% YoY. The whole leverage story rests on seasonally strong sales, so a revenue shortfall would hit this line twice.</p>' },
        'Adj. EPS (diluted)':{ t:'Zacks $1.78 — inside the implied $1.71–1.81', h:'<p>The FY guide of <b>$5.05–5.15</b> less the 9M adjusted EPS ($3.34) implies roughly <b>$1.71–1.81</b> for Q4 (approximate: quarterly share counts differ). Zacks consensus <b>$1.78</b> (+27% YoY on $1.40) sat in the upper half, unchanged over the prior 30 days. The guided GAAP tax rate had just been cut to ~23–24%, a small EPS helper.</p>' },
        'Capex':{ t:'Guided $180–200M, "tracking toward the lower end"', h:'<p>The FY2025 capex range never moved all year, but at Q3 Quigley said the company was tracking toward the <b>lower end</b> "due to more efficient deployment of capital". SharkNinja does not guide capex by quarter; the check is the full-year cash-flow line against the range.</p>' },
        'Cleaning':{ t:'The Street models a ~10% core — after +12.4% in Q3', h:'<p>Two-analyst average (Zacks-compiled) <b>$711.9M (+9.9%)</b>, extrapolating Q3\'s +12.4% on robotics, extraction and corded uprights. The largest category is the one the diversification argument needs to be "growing, not flat", and the holiday comp ($648.0M) is the toughest of the year.</p>' },
        'Beauty & Home Environment':{ t:'First U.S. holiday for CryoGlow', h:'<p>Two-analyst average <b>$321.6M (+60.9%)</b> after +56.7% in Q3. Barrocas had flagged this as the first holiday season for CryoGlow in the U.S. and most of Europe, with Facial Pro Glow launched but "won\'t have broad distribution in Q4". The line still blends fans and air purifiers with beauty.</p>' },
        'International net sales':{ t:'Acceleration promised — with direct conversions inside the quarter', h:'<p>Two-analyst average <b>$722.1M (+20.2%)</b>. Q3 printed +25.8% reported (+21.6% constant currency) and management reiterated that 2H25 international growth would accelerate over 1H25. Q4 also carries the conversions to direct operations in the Nordics, Poland and Benelux, a known source of noise.</p>' }
      },
      us:{},
      debate:{ rows:null, synth:'The one thing to resolve: does the holiday quarter deliver the <b>~16% acceleration AND the ~200bps EBITDA-margin step</b> with the tariff timing benefit reversing out of gross margin, and what does management open FY2026 at, knowing FY2025 started at +10–12% and was raised at every print?' },
      pricedIn:'The Street sat on the company\'s own Q4 frame: revenue $2.07B (Zacks) against "around 16%" growth, adjusted EPS $1.78 inside the $1.71–1.81 the FY guide implied. The known worry was margin: Q3\'s gross-margin expansion was two-thirds tariff timing, and Q4 was guided down ~50bps as that reversed. The tape went in soft, down about 6% over the month before the print (Zacks), and the open question was the FY2026 opening guide.',
      oneLiner:'The bar was "accelerate to ~16% and absorb the tariff reversal". SharkNinja did +17.6% with adjusted gross margin UP 40bps against a guided ~50bps decline, beat every FY2025 guide top, and opened FY2026 at the same conservative +10–11% it opened FY2025 at. The one soft line was the core: Cleaning +3.4%.' },
    results:{
      summary:{
        paras:[
          { p:'<b>The margin beat is the real print, and it came from the line that was supposed to get worse.</b> Adjusted gross margin was guided down about 50bps as the tariff timing benefit reversed; it rose 40bps instead, a roughly 90bp swing against the company\'s own frame. Quigley named two drivers, international gross margin (cost optimisation and channel mix) and a more favourable overall sales mix, and said tariffs did start to hit domestic gross margin in the quarter. The analytical consequence is that the mitigation toolkit is doing more than timing. Q3\'s expansion was mostly timing by management\'s own account; Q4\'s was not, which makes it the first clean read on structural gross margin under full tariff cost.',
            more:'The caveat sits in the mix: Food Preparation (+28.1%) and Beauty & Home Environment (+63.2%) grew far faster than Cleaning (+3.4%), so part of the margin gain is category mix that may not repeat in a quarter where the viral launches cool.' },
          { p:'<b>Growth was broad but the core was not, and that is the tension to carry into 2026.</b> Revenue of $2,101.4M (+17.6%, +16.2% constant currency) beat the "around 16%" frame and the Street, with domestic +15.7% and international +21.4%. But the split is uneven: three categories beat their two-analyst estimates while Cleaning, the largest at $669.9M, grew only +3.4% against a +9.9% estimate. The diversification argument absorbed it this quarter. Whether it keeps absorbing it depends on the launches holding their rate, which is exactly what the Street cannot model from one holiday.' },
          { p:'<b>The +36% adjusted EBITDA is operating, but the +67.6% GAAP operating income is flattered by a share-based compensation step-down.</b> Adjusted EBITDA of $395.3M (18.8%, +250bps) beat the ~200bps margin frame, with adjusted opex leverage of ~280bps against ~250bps guided. SBC fell to $12.3M from $37.2M, which drove most of the G&A decline; it is added back in the adjusted line, so it inflates GAAP operating income and GAAP EPS ($1.80, nearly double) rather than the adjusted figures. Read growth off the adjusted line; the GAAP rate will not repeat.',
            moreLabel:'＋ more — where the sales & marketing leverage came from',
            more:{ body:'Sales and marketing grew 8.0% on sales +17.6%, about 200bps of leverage. The release splits the dollars, and the split matters for how durable the leverage is.',
              nodes:[
                { t:'Advertising was cut, not just optimised', body:'Advertising-related expense fell $7.4M YoY while delivery and distribution rose $23.0M and personnel $14.4M. Management attributes the efficiency to internally built social-media optimisation tools; the dollars show a lower ad line in the biggest selling quarter.' },
                { t:'Why it matters for 2026', body:'If the leverage is optimisation, it compounds. If part is a quarter of lighter ad spend, it reverses when launches need support. Quigley framed it as "not about, you know, harvesting any sort of, you know, forced leverage"; the next quarters test that.' } ] } },
          { p:'<b>The balance sheet crossed to net cash, and capital allocation became a lever for the first time.</b> Cash ended at $777.3M against $739.1M of debt, FY operating cash flow was a record $634.1M, and the board authorised an inaugural $750M buyback, funded without new debt and aimed at least at offsetting SBC dilution. Paired with the move to domestic-filer status (the stated last step toward broader index eligibility), the equity story now has a shareholder-base catalyst independent of the P&L.' },
          { p:'<b>The FY2026 guide should be read against the pattern, not at face value.</b> Net sales +10–11%, adjusted EPS $5.90–6.00, adjusted EBITDA $1,270–1,280M, with a first-half gross-margin headwind from tariffs now fully in the P&L. FY2025 opened at +10–12% and finished at +15.7%, above the final raised guide on all three headline lines. The opening guide is a floor that assumes a flat consumer and current tariff rates; the variable to watch is whether EBITDA-margin expansion shows "right out of the gate" as Quigley said, despite the gross-margin headwind.' }
        ]
      },
      notes:{
        'Revenue':{ t:'+17.6% — above the "around 16%" frame and the Street', h:'<p><b>$2,101.4M (+17.6%; +16.2% constant currency)</b> vs Zacks $2.07B (+1.3% surprise) and the implied $2,060–2,088M. The fastest growth of 2025 (quarters ran +15%, +16%, +14%, +18%) and the eleventh straight double-digit quarter, in a U.S. market Circana put down mid-single digits in Q4 excluding SharkNinja. FY2025 <b>$6,399.2M (+15.7%)</b>, above the final +15.0–15.5% guide.</p>' },
        'Gross profit':{ t:'Adjusted margin +40bps against a guided ~50bps decline', h:'<p>GAAP <b>$1,007.6M (47.9%, +90bps)</b>; adjusted <b>$1,012.0M (48.2%, +40bps)</b> vs the ~50bps decline guided. Drivers per the release: domestic cost optimisation partly offset by tariffs, plus international cost optimisation and favourable channel mix. Quigley: results "exceeded our internal expectations". FY adjusted gross margin 49.4% (+30bps).</p>' },
        'Operating income':{ t:'GAAP +67.6% — with an SBC tailwind inside it', h:'<p>GAAP <b>$343.8M (16.4%, +490bps)</b> vs $205.1M; adjusted operating income $367.3M (17.5%, +43.2%). SBC fell to <b>$12.3M from $37.2M</b> and G&A dropped 13.0% to $106.9M (personnel -$26.5M, partly offset by +$10.4M of legal fees). That SBC step-down flatters the GAAP growth rate and does not touch the adjusted line.</p>' },
        'Adj. EBITDA':{ t:'$395.3M, +250bps — above the ~200bps frame', h:'<p><b>$395.3M (18.8% margin, +36.0%)</b> vs the ~$375–385M implied by the FY guide; roughly double the rate of sales growth. Adjusted opex <b>$645M (30.7% of sales vs 33.5%)</b>, ~280bps of leverage vs ~250bps guided, the third straight quarter of opex leverage. FY2025 <b>$1,135.5M (17.7%)</b>, $10.5M above the top of the final $1,115–1,125M range.</p>' },
        'Adj. EPS (diluted)':{ t:'$1.93 vs $1.78 — and FY $0.13 above the guide top', h:'<p><b>$1.93 (+37.9%)</b> vs Zacks $1.78 (+8.2% surprise) and ~$0.12 above the implied top. Non-GAAP tax rate 21.9% vs 18.3% a year ago, so the beat is operating, not tax. GAAP diluted EPS $1.80 vs $0.91, helped by the SBC step-down and an FX swing (-$1.6M gain vs a $25.6M loss). FY2025 adjusted EPS <b>$5.28</b> vs the $5.05–5.15 final guide.</p>' },
        'Operating cash flow':{ t:'Record $634.1M for the year', h:'<p>FY2025 operating cash flow <b>$634.1M</b> vs $446.6M in 2024. The release gives only the full-year figure; the Q4 standalone amount is not disclosed in it. Inventory ended at $1,002.2M (+11.4%), with the tariff pre-build now sold through, and receivables rose to $1,667.1M on the holiday quarter.</p>' },
        'Capex':{ t:'FY $146.1M — well below the $180–200M range', h:'<p>The release does not break out capex; the FY2025 10-K cash-flow statement shows <b>$146.1M</b> against a guide of $180–200M ("tracking toward the lower end" at Q3), roughly $34M under the bottom. The guided definition may be broader than the cash line (capitalised software), and the company did not reconcile the two. FY2026 capex guided <b>$190–210M</b>.</p>' },
        'D&A':{ t:'$38.9M, +7.5%', h:'<p>Depreciation and amortization <b>$38.9M</b> vs $36.2M (FY $139.6M vs $123.1M). Of that, $4.9M per quarter is amortization of intangibles from JS Global\'s acquisition of the business, excluded from adjusted operating income and adjusted net income.</p>' },
        'Diluted shares':{ t:'142.1M — and a buyback now authorised', h:'<p>Diluted weighted average <b>142.13M</b> vs 141.52M a year ago (FY 142.09M, against a ~142.5M guide). FY2026 is guided at ~143.5M before the new $750M repurchase programme, which management intends to use at least to offset SBC dilution.</p>' },
        'Cleaning':{ t:'+3.4% — the one category well under the Street', h:'<p><b>$669.9M (+3.4%)</b> vs a two-analyst average of $711.9M (+9.9%), a ~$42M miss, after +12.4% in Q3. The release credits carpet extractors and robotics; management reported share gains in corded and cordless vacuums. FY Cleaning $2,205.8M (+6.9%), the slowest-growing group, with corded uprights named for "breakthrough" innovation in 2026.</p>' },
        'Cooking & Beverage':{ t:'+11.7% on Luxe Café', h:'<p><b>$667.3M (+11.7%)</b> vs a two-analyst $638.2M. Ninja Luxe Café, now "the best-selling espresso SKU in the United States in under one year", offset declines in outdoor grills and kitchenware. Overall air fryer sales grew in 2025 despite the U.K. decline.</p>' },
        'Food Preparation':{ t:'+28.1% on frozen drinks', h:'<p><b>$438.0M (+28.1%)</b> vs a two-analyst $408.1M, driven by the frozen drinks sub-category. FY $1,550.7M (+31.6%). The concentration in one viral sub-category is the durability question for 2026 comps.</p>' },
        'Beauty & Home Environment':{ t:'+63.2% — the fastest rate of the year', h:'<p><b>$326.2M (+63.2%)</b> vs a two-analyst $321.6M. Fans and air purifiers plus the 2025 face-mask launches; Shark Beauty called the number one skincare facial device brand in the U.S. FY $826.3M (+45.3%).</p>' },
        'Domestic net sales':{ t:'+15.7% — an acceleration from +9.5% in Q3', h:'<p><b>$1,372.4M (+15.7%)</b> vs a two-analyst $1.35B, against a U.S. category Circana put down mid-single digits in Q4 excluding SharkNinja. Management attributes it to retailer holiday support, DTC growth and TikTok Shop, and restated on the call that the U.S. "should continue to grow at double digits".</p>' },
        'International net sales':{ t:'+21.4%, and the 2H acceleration delivered', h:'<p><b>$729.1M (+21.4%)</b> vs a two-analyst $722.1M. 2H25 international +23.2% vs +17.3% in 1H25, as promised. U.K. +9.2% to $326M despite air fryer declines; Mexico triple-digit. Constant currency total growth was 16.2% vs 17.6% reported, so FX added ~140bps at the group level.</p>' }
      },
      watch:{ 'Adj. EBITDA':1, 'Gross profit':2, 'Cleaning':3, 'International net sales':4 },
      thesisCheck:[
        { line:'Growth falls short of the ~16% Q4 frame in a declining market', tripped:false, note:'+17.6% (+16.2% constant currency), the fastest of 2025, with domestic accelerating to +15.7% from +9.5% while the U.S. category fell mid-single digits ex-SharkNinja (Circana).' },
        { line:'The tariff reversal breaks gross margin', tripped:false, note:'Guided ~50bps down; adjusted gross margin rose 40bps to 48.2% with tariffs visibly hitting domestic gross margin for the first time. Not tripped, but the full-year headwind moves into 1H26, where management guided "a decent gross margin headwind".' },
        { line:'Operating leverage proves a one-quarter effect', tripped:false, note:'Third consecutive quarter of adjusted opex leverage (~280bps). Caveat logged: SBC fell $24.9M YoY (a GAAP-only benefit) and advertising dollars fell $7.4M inside a +8% sales and marketing line.' },
        { line:'The core stalls: Cleaning growth drops to low single digits', tripped:true, note:'⚑ Cleaning +3.4% against a +9.9% Street estimate, one quarter after +12.4%. The largest category ($669.9M) is the one the diversification story needs to keep growing; the launches carried the quarter.' },
        { line:'The FY opening guide signals a real slowdown rather than conservatism', tripped:false, note:'FY2026 opens at +10–11%, the same posture as FY2025 (+10–12% opening, +15.7% delivered, raised at every print). Consensus FY2026 EPS moved to $5.95 (Zacks), the guide midpoint.' },
        { line:'Cash generation fails to fund both growth and returns', tripped:false, note:'Record $634.1M operating cash flow, net cash at year end, and an inaugural $750M buyback the company does not expect to fund with debt.' }
      ],
      intoCall:[
        '📉 <b>The 1H26 gross-margin shape</b> — with tariffs now fully in the P&L, how big is the first-half headwind and does EBITDA margin still expand? (On the list.)',
        '🧹 <b>Cleaning at +3.4%</b> — is the core slowing, or is it a comp and timing effect behind the extractor and robotics strength?',
        '🌍 <b>International conversions</b> — Nordics, Poland and Benelux done, Italy and Spain queued: how much Q1 disruption, and when is it clean? (On the list.)',
        '💰 <b>The $750M buyback</b> — pace, and whether it moves the ~143.5M guided share count.'
      ],
      priceReaction:'Not settled in the sources found. Investing.com reported a <b>pre-market decline of 3.53% to $114.45</b> on Feb 11 despite the beat; TipRanks reported shares <b>"rose more than 5%"</b> during trading hours. Zacks noted the stock was down about 6% over the month into the print. The opening dip reads as the market weighing the +10–11% FY2026 opening guide against the beat; confirm the Feb 11 close before quoting a number.' },
    call:{
      take:'The holiday quarter beat on the line it was guided to lose on (gross margin), and FY2026 opened exactly as conservatively as FY2025 did. What the call did not settle is the core: Cleaning grew +3.4%, and the first half now carries the full tariff bill.',
      highlights:[
        { tag:'thesis', band:'lead', open:'Is Q4\'s gross-margin gain structural, or holiday mix that fades when the first-half tariff headwind lands?',
          head:'Adjusted gross margin rose 40bps to 48.2% against a guided ~50bps decline, with tariffs hitting domestic gross margin for the first time',
          detail:'<p>Quigley: results "exceeded our internal expectations, driven by two primary factors": international gross margins (cost optimisation, channel mix) and a sales mix "more favorable than anticipated". He also said "We did start to see the increased impact of tariffs on our domestic gross margins in Q4". The opex leverage then ran ~280bps, taking adjusted EBITDA margin up 250bps to 18.8%.</p>' },
        { tag:'thesis', band:'context',
          head:'FY2026 opens at +10–11% net sales, $5.90–6.00 adjusted EPS and $1,270–1,280M adjusted EBITDA, with a first-half gross-margin headwind from tariffs',
          detail:'<p>The guide assumes current tariff rates persist (minimum 20% China, 20% Vietnam, 19% Indonesia, Thailand, Malaysia and Cambodia). Quigley to Didora: "the first half, we expect a decent gross margin headwind driven by tariffs, with slight offsets driven by all the cost optimization efforts", with EBITDA-margin expansion visible "in the first half, right out of the gate". Barrocas to Parikh: the consumer is expected to be "flat to where we were last year". Same opening posture as FY2025, which started at +10–12% and delivered +15.7%.</p>' },
        { tag:'watch', band:'context', open:'Does Cleaning re-accelerate, or is +3.4% the new run-rate for the largest category?',
          head:'Cleaning grew +3.4% to $669.9M, against a +9.9% Street estimate and +12.4% in Q3, while the three other categories grew 11.7% to 63.2%',
          detail:'<p>Management pointed to carpet extraction (Shark Stain Force) and share gains in corded and cordless vacuums, and named corded uprights among the legacy categories getting "breakthrough innovations" in 2026. No analyst asked about Cleaning directly; the diversification argument absorbed it this quarter.</p>' },
        { tag:'thesis', band:'context',
          head:'Net cash at year end, an inaugural $750M buyback, and domestic-filer status as "the final step" toward broader index inclusion',
          detail:'<p>Barrocas: repurchases will be opportunistic "while also planning to offset the natural dilution from stock-based compensation". Quigley framed the shift: "In 2024 and 2025, we prioritized flexibility around elements like inventory and working capital. In 2026 and beyond … prioritizing capital allocation in a more meaningful way." The release adds that the company does not expect to incur debt to fund it.</p>' },
        { tag:'curious', band:'context',
          head:'Beauty is being built as a category-maker: the U.S. LED mask market was $35M in 2024, and SharkNinja alone did more than 2x that in 2025',
          detail:'<p>Barrocas to Kim: the goal is to be "the number one beauty tech company in the world", starting in hair, extending to skin, with scalp, nails and wellness named as next. The customer is younger, including young men in skincare. Beauty & Home Environment grew +63.2% in the quarter, still blended with fans and air purifiers in the reporting.</p>' },
        { tag:'watch', band:'logged', open:'A dated marker: Italy and Spain convert to direct in 1H26, with "normalized" international by the end of Q2.',
          head:'International conversions: Nordics, Poland and Benelux went direct in Q4; Italy and Spain follow in 1H26, with Q1 disruption flagged',
          detail:'<p>Barrocas to Forbes: "In Q1, you know, there\'s some disruption as it relates to the movement of Spain and Italy" and "By the end of Q2, we\'re still on track to kind of have a normalized business moving forward." Mexico grew triple-digit; a Mercado Libre partnership ramps in 2026, and the Middle East was named for 2H26.</p>' },
        { tag:'tone', band:'logged',
          head:'An audio failure garbled the first answer on the call, including the units-versus-price split for the U.S.; the double-digit U.S. target was restated later',
          detail:'<p>Brooke Roach\'s question on the medium-term U.S. growth algorithm and units versus price was answered but lost to the line; the transcript is unusable for most of it and her follow-up. Phillip Blee asked for confirmation, and Barrocas restated: "I think the U.S. should continue to grow at double digits." The price-versus-units split was never recovered on the call.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: 100 software engineers being hired for AI, AI-enabled products from 2H26 (coffee, air purification, robotics), 2 new categories and 25 new products in 2026',
          detail:'<p>Barrocas also cited AI scoring of "nearly 100%" of contact-centre interactions (from under 5% sampled), nearly 100% of U.S. volume manufacturable outside China, and 2026 as the "first full year of optimization" of the supply chain. Social followers across Instagram and TikTok reached 3.9M (+119%), cited from a sell-side note.</p>' }
      ],
      prepared:[
        { topic:'Holiday growth against a shrinking market', theme:'Double-digit growth',
          body:'Net sales rose 17.6% to $2.1B, the fastest rate of 2025 and the eleventh consecutive double-digit quarter, with domestic +15.7% and international +21.4%. Barrocas cited Circana: the U.S. market SharkNinja participates in declined low single digits in 2025 and mid-single digits in Q4, excluding SharkNinja. The gap matters because all of the growth is share, new categories and new countries, not market.' },
        { topic:'Gross margin up against a guided decline', theme:'Tariffs',
          body:'Adjusted gross margin rose ~40bps to 48.2%, versus the ~50bps decline guided at the Q3 print. Quigley named international gross margin and favourable sales mix as the two drivers, and said tariffs began hitting domestic gross margin in Q4. It is the first quarter where the expansion is not mostly tariff timing, which is why it is the more informative margin print of the year.' },
        { topic:'Third straight quarter of opex leverage', theme:'Operating leverage',
          body:'Adjusted opex was $645M, 30.7% of sales versus 33.5%, taking adjusted EBITDA up 36% to $395M at an 18.8% margin (+250bps). Sales and marketing leveraged almost 200bps on social-media optimisation tools, and G&A fell 13% mainly on personnel costs including lower share-based compensation. The SBC piece helps GAAP operating income rather than the adjusted line, so the adjusted +36% is the figure to carry forward.' },
        { topic:'FY2026 outlook: double digits, tariffs fully in the P&L', theme:'Double-digit growth',
          body:'Quigley guided FY2026 net sales +10–11%, adjusted EPS $5.90–6.00 (+12–14%) and adjusted EBITDA $1,270–1,280M (+12–13%), with capex $190–210M and ~143.5M diluted shares. The outlook assumes current tariff rates persist, with the headwinds "now fully manifesting in the P&L". Barrocas committed to EBITDA growing faster than sales; the opening posture mirrors FY2025, which was raised at every print.' },
        { topic:'Net cash, $750M buyback, domestic filer', theme:'Capital allocation',
          body:'SharkNinja exited 2025 in a net cash position ($777M cash, $739M debt) after record operating cash flow of $634M, and announced an inaugural $750M share repurchase authorisation. Barrocas said buybacks will be opportunistic while planning to offset SBC dilution, and that becoming a U.S. domestic filer is the final step for broader index consideration. It adds a capital-return and shareholder-base lever that did not exist a year ago.' },
        { topic:'International goes direct in more markets', theme:'International',
          body:'The Nordics, Poland and Benelux moved to direct operations in Q4, with Italy and Spain converting in 1H26 on a hybrid distributor-plus-direct model. International grew 23.2% in 2H25 versus 17.3% in 1H25, the U.K. grew 9.2% despite air fryer declines, and Mexico grew triple-digit. The conversions trade short-term disruption for margin and control, the playbook that worked in Mexico.' },
        { topic:'Pipeline and AI', theme:'AI',
          body:'SharkNinja finished 2025 at 38 sub-categories and plans two more in 2026, alongside a Luxe Café extension and new corded uprights and traditional blenders. Barrocas said AI capabilities will debut in products from 2H26 (coffee, air purification, robotics), backed by 100 new software engineers. It matters because the growth algorithm depends on the launch cadence, and the company is now tying that cadence to software.' }
      ],
      qanda:[
        { q:'Medium-term U.S. growth algorithm, and units versus price in 2026', analyst:'Brooke Roach · Goldman Sachs', theme:'Double-digit growth',
          qFull:'Given the momentum, what is the appropriate medium-term growth algorithm for the U.S. business, what does that mean for U.S. growth in 2026, and what contribution should come from units versus price?',
          a:'<b>Barrocas:</b> "we came out of Q4 and delivered great growth in the U.S. You know, our D2C business is growing nicely. Our <b>retailer partners gave us tremendous support in the holiday season</b>, and they\'re continuing to do that into 2026. You know, new channels are emerging, you know, like <b>TikTok Shop</b>…" The rest of the answer, including the units-versus-price split, was lost to an audio failure and is not quoted. Restated later to Phillip Blee: "I think the U.S. should continue to grow at <b>double digits</b>."' },
        { q:'Follow-up on first-half phasing, gross margin and expense control', analyst:'Brooke Roach · Goldman Sachs', theme:'Tariffs',
          qFull:'A follow-up on how the year phases: what should we expect in the first half, and where does that fall on gross margin and expense control? (Question partly inaudible in the transcript.)',
          a:'The answer was lost to the audio failure on the line and is not quoted. The first-half shape was restated to Andrew Didora later in the call: <b>Quigley:</b> "the first half, we expect a <b>decent gross margin headwind driven by tariffs</b>, with slight offsets driven by all the cost optimization efforts that we have talked about before"' },
        { q:'International growth profile in 1Q26, given the Mexico comp and the direct conversions', analyst:'Steve Forbes · Guggenheim', theme:'International',
          qFull:'With triple-digit growth in Mexico, excitement in LatAm and recent transitions to a direct model in several countries, how should we think about the international growth profile through 2026, and Q1 in particular as you cycle last year\'s Mexico disruption?',
          a:'<b>Quigley:</b> "we do continue to see <b>international growing at a faster rate than the domestic business</b>. We\'re seeing incredible momentum out of the Lat Am business, specifically in Mexico… We do expect that to continue into the first half of 2026" <b>Barrocas:</b> "In Q1, you know, there\'s some <b>disruption as it relates to the movement of Spain and Italy</b>. So yes, you know, we are comping the Mexico transition. There will be some kinda transition impacts that are gonna happen in Q1. <b>By the end of Q2, we\'re still on track to kind of have a normalized business</b> moving forward."' },
        { q:'Visibility into the converted markets, and the path to a 50/50 mix', analyst:'Steve Forbes · Guggenheim', theme:'International',
          qFull:'Post-transition, how much visibility do you have into the countries you converted as you look to 2H26, 2027 and 2028, given you have talked about the mix eventually reaching 50/50 domestic and international?',
          a:'<b>Barrocas:</b> "Let\'s start off with, do consumers love the products?… I think we\'ve got really good visibility as it relates to that." On demand generation: "<b>all of that Spanish language media is spilling over into the rest of Latin America</b> as well." And on channels: "it\'s always <b>slower to get into brick-and-mortar retailer placements</b>, but our pure player business is growing quite a bit. Our D2C business is growing quite a bit." No timing was given for the 50/50 mix.' },
        { q:'Who the beauty customer is, and the distribution white space', analyst:'Jonna Kim · TD Cowen', theme:'Beauty',
          qFull:'What characterises the customers Shark is acquiring through beauty versus your other products, and where is the distribution white space in beauty, domestically and internationally?',
          a:'<b>Barrocas:</b> "we\'re obviously attracting a <b>younger demographic</b>. I mean, we\'re attracting, you know, a young female demographic in particular." On sizing: "the total LED mask market in the United States was <b>$35 million in 2024</b>. We did, you know, <b>more than 2x that</b>, you know, just in 2025 ourselves." And the ambition: "our goal is we wanna be the <b>number one beauty tech company in the world</b>, and we think it starts with hair, and we think it extends into skin… scalp, I think, is an interesting place. You know, I think nails is an interesting place."' },
        { q:'How to judge the celebrity campaigns, and what comes next for engagement', analyst:'Andrew Didora · Bank of America', theme:'Social commerce',
          qFull:'You launched celebrity campaigns with Tom Brady and Kevin Hart in 2025. How do you define their success, and what new initiatives will keep engaging the customer this year?',
          a:'<b>Barrocas:</b> "our social media followers, you know, <b>grew over 100%</b>. You know, our engagement with consumers grew over 100%." The celebrities "are kind of the <b>tip of the pyramid</b>". On what is new: "this social media has <b>no borders</b> to it… we\'re now <b>tracking influencer content based on what countries view their content</b> and engage with their content."' },
        { q:'Gross margin headwinds and tailwinds, and the ability to grow gross margin in 2026', analyst:'Andrew Didora · Bank of America', theme:'Tariffs',
          qFull:'What gross margin headwinds and tailwinds do you see this year, and how would you characterise your ability to grow gross margins in 2026?',
          a:'<b>Quigley:</b> "as we look at the first half of 2026, we will be <b>normalizing tariffs</b> as we go into the year… the first half, we expect a <b>decent gross margin headwind driven by tariffs</b>, with slight offsets driven by all the cost optimization efforts." On the offset: "you will continue to see the <b>operating expense leverage</b> from us in the first half and into the second half as well… our goal is to <b>expand EBITDA rate as a percentage of sales</b>." He did not commit to full-year gross margin expansion.' },
        { q:'Domestic momentum into 1H26, and lapping retailer tariff stockpiling', analyst:'Phillip Blee · William Blair', theme:'Retail & inventory',
          qFull:'How does the ~16% domestic growth carry into Q1 and the first half, how should we think about lapping retailer stockpiling ahead of tariffs or sales lost to inventory constraints, and can you confirm U.S. growth should be sustainable at double digits?',
          a:'<b>Barrocas:</b> "I think the U.S. should continue to grow at <b>double digits</b>." On lapping: "there\'s always inventory issues that you\'re lapping or constraints or <b>one-offs or one-times</b>… it\'s hard for us to comment on, like, any one specific thing at a quarterly level." Instead: "we\'re gonna enter into <b>two new product categories</b> this year in 2026. We\'ve got a really great pipeline of innovation in 2026 that we\'re gonna be bringing to market with <b>25 new products</b>."' },
        { q:'Sales and marketing leverage: effectiveness and where the ratio goes', analyst:'Phillip Blee · William Blair', theme:'Operating leverage',
          qFull:'Sales and marketing leveraged sharply in Q4 as you got smarter on social spend and affiliates. What is the impact on marketing effectiveness and financially, and should the line stay roughly flat as a percentage of sales?',
          a:'<b>Quigley:</b> "It\'s the <b>media optimization</b> type efforts that Mark talked about earlier. It\'s <b>allocations between media spend and, you know, price and promo</b>, depending on the category, depending on the region." Looking ahead: "while it is a competitive advantage and will remain one… it\'s also a <b>massive area of leverage</b>. So it\'s not about, you know, harvesting any sort of, you know, <b>forced leverage</b> there. It\'s really about optimizing what is a very large and healthy base of investment." No ratio target was given.' },
        { q:'The 2026 consumer backdrop, and whether U.S. stimulus helps the categories', analyst:'Rupesh Parikh · Oppenheimer', theme:'Double-digit growth',
          qFull:'Do you expect the consumer and category backdrop in 2026 to be the same or better than last year, and could your categories benefit from stimulus in the U.S.?',
          a:'<b>Barrocas:</b> "other than the 18 months during COVID, you know, I don\'t remember kind of a <b>frothy consumer</b> time for us. So, you know, I would say the consumer is gonna be kind of expected to be <b>flat to where we were last year</b> in general." On stimulus: "it does seem like that stimulus does <b>flow through the economy quite fast</b>". And the frame: "I don\'t think we\'re competing against our industry per se. I mean, I think we\'re competing against a <b>pool of consumer discretionary dollars</b>"' }
      ],
      dots:'Q3 2025 set the test: accelerate to ~16% in a declining market while the tariff timing benefit reversed out of gross margin. Q4 passed it on both counts, with gross margin moving the wrong way for the bears, and closed FY2025 above every final guide top. It also opened the two threads 2026 has to answer: whether the first-half tariff headwind lets EBITDA margin keep expanding "right out of the gate", and whether a +3.4% Cleaning core can sit under a double-digit company once the viral launches lap. The capital-return lever (net cash, $750M) is new and independent of both.',
      threeMinutes:[
        '<b>Margin moved the wrong way for the bears.</b> Adjusted gross margin was guided down ~50bps and rose 40bps; adjusted EBITDA margin was guided +200bps and did +250bps. It is the first quarter where the expansion was not mostly tariff timing.',
        '<b>Read the opening FY2026 guide as a floor.</b> +10–11% sales and $5.90–6.00 EPS assume a flat consumer and current tariffs. FY2025 opened at +10–12%, was raised at every print and finished at +15.7%.',
        '<b>The core is the soft spot.</b> Cleaning grew +3.4% against a +9.9% estimate while Beauty (+63%) and Food Prep (+28%) carried the quarter; that mix both flattered margin and raised the durability question for 2026 comps.'
      ],
      notBringing:[
        { item:'GAAP operating income +67.6% and GAAP EPS nearly doubling', why:'Most of the gap to the adjusted rates is a $24.9M SBC step-down and a $27M FX swing below the line. The adjusted +36% EBITDA is the operating read.' },
        { item:'The garbled first answer on units versus price', why:'Lost to an audio failure; nothing usable in the transcript. Only the restated "double digits" U.S. claim is on record.' },
        { item:'The 3.9M social followers (+119%)', why:'Cited from a sell-side note and not tied to sales; colour, not a thesis line.' }
      ],
      newQuestions:[
        { n:'The 1H26 tariff gross-margin headwind: does adjusted EBITDA margin still expand "right out of the gate"?', landed:{ q:'Q1 2026', rank:1 } },
        { n:'Italy and Spain go direct: how large is the Q1 disruption, and does international still outgrow domestic?', landed:{ q:'Q1 2026', rank:2 } },
        { n:'Cleaning at +3.4%: does the largest category re-accelerate, or is low single digits the new core rate?', landed:{ q:'Q1 2026', rank:3 } },
        { n:'The U.S. "double digits" claim against a flat consumer and lapped tariff-era retailer orders: does domestic hold 10%+?', landed:{ q:'Q1 2026', rank:4 } },
        { n:'Sales and marketing leverage: optimisation that compounds, or lighter advertising that reverses when launches need support?', landed:{ q:'Q1 2026', rank:5 } },
        { n:'The $750M buyback: first-quarter pace, and whether the ~143.5M guided share count moves', landed:{ q:'Q1 2026', rank:6 } }
      ]
    } }
]};
