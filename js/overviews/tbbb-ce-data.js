// overviews/tbbb-ce-data.js — the DATA behind Tiendas 3B's Evolution ▸ Earnings (the rendering is ./tbbb-ce.js).
//
//   TBBB_CE_CONS — the estimate grid and "The print" cards, rebuilt at load from js/results-data/tbbb.js (reported actuals from the
//     releases, Bloomberg consensus and the estMatrix vintages: BBG_CONSENSUS.txt, 11 TBBB snapshots May 2024 → Nov 3 2026). Nothing is typed.
//   TBBB_CALL_EARNINGS — per quarter, newest first: setup (notes per line), results (notes per line) and the call (prepared remarks, analyst
//     Q&A in management's own words, "also on the call" colour, new questions). Transcripts: TBBB Calls.txt (verbatim; Q2 2026 loaded here, the
//     earlier calls are in docs/calls/TBBB.md and load into this file as they are distilled). The Q3 2026 call (Nov 3 2026) is loaded from the transcript the analyst pasted.
//
// Money lines are Ps. billions above Ps.1B and Ps. millions below it; counts (stores, DCs) are units; same-store sales is a % (a rate, no growth chip).
// Capex is positive spend. Summit: the DCF model's quarterly estimates (the Aug 13 2026 submit, js/results-data/tbbb.js) are read into `setup.us`;
// a line the model does not project by quarter on a comparable basis reads "—". TBBB guides stores, revenue growth and same-store sales for the year
// (not quarterly levels), so there is no guide row in the grid (TBBB_GUIDED is empty) and each guide sits in the notes of its line.

import { tbbbResults } from '../results-data/tbbb.js';
import { TBBB_HIST } from './tbbb-ce-hist.js';

// [name, unit, results key, divisor from the results file]. HEADLINE first (the fixed nHead block), then the company's own lines.
var TBBB_LINES = [
  ['Revenue', 'Ps.B', 'rev', 1000], ['Gross profit', 'Ps.B', 'gp', 1000], ['Operating profit', 'Ps.M', 'opinc', 1], ['EBITDA (reported)', 'Ps.B', 'ebitda', 1000],
  ['EBITDA ex-SBC', 'Ps.B', 'adj', 1000], ['Net income', 'Ps.M', 'netinc', 1], ['Operating cash flow', 'Ps.B', 'ocf', 1000], ['Capex', 'Ps.B', 'capex', 1000],
  ['Stock-based comp', 'Ps.M', 'sbc', 1],
  ['Same-store sales', '%', 'sss', 1], ['Stores', 'n', 'stores', 1], ['Net new stores', 'n', 'adds', 1], ['Distribution centers', 'n', 'dcs', 1],
  ['Sales expenses', 'Ps.B', 'sales', 1000], ['Administrative expenses', 'Ps.B', 'admin', 1000], ['Admin ex-SBC', 'Ps.M', 'adminx', 1],
  ['Building lease payments', 'Ps.M', 'rent', 1], ['EBITDA after leases', 'Ps.B', 'ebitdaal', 1000],
  ['Financial income', 'Ps.M', 'fin', 1], ['Financial costs', 'Ps.M', 'fcost', 1], ['FX gain / (loss)', 'Ps.M', 'fx', 1], ['Income tax', 'Ps.M', 'tax', 1],
  ['Free cash flow', 'Ps.B', 'fcf', 1000]
];
export var TBBB_GUIDED = [];

export var TBBB_CE_CONS = {
  src: 'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf: [],
  q: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: TBBB_LINES.map(function(L){ return { k: L[0], u: L[1], t: 'ok' }; })
};

(function(){
  var M = tbbbResults.views.q.metrics, MX = tbbbResults.estMatrix && tbbbResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q = TBBB_CE_CONS.q, QP = Q.map(pOf);
  function rnd(v,u){ if(v==null) return null; var d=((u==='Ps.B'&&Math.abs(v)>=10)||u==='%'||u==='Ps.M')?10:100; if(u==='n') return Math.round(v); return Math.round(v*d)/d; }
  function growth(m){
    m.qa=m.qa.map(function(v){ return rnd(v,m.u); }); m.qr=m.qr.map(function(r){ return r.map(function(v){ return rnd(v,m.u); }); });
    m.qy=Q.map(function(q,i){ return i>=4?m.qa[i-4]:null; }); m.qq=Q.map(function(q,i){ return i>=1?m.qa[i-1]:null; }); }
  function fromResults(m, key, scale){
    var r=M[key]; if(!r) return m;
    function at(arr,p){ var i=r.periods.indexOf(p); return (i<0||!arr||arr[i]==null)?null:arr[i]/scale; }
    m.qa=QP.map(function(p){ return at(r.act,p); });
    m.qr=QP.map(function(p){
      var row=[null,null,null,at(r.cons,p)], op=ord(p), rows=MX&&MX.q&&MX.q[key];
      if(rows) MX.vintages.forEach(function(v){   // oldest → newest, so the latest vintage at each horizon wins
        var h=op-ord(v.lastActual.q); if(h<1||h>4) return;
        var x=rows[v.id]&&rows[v.id][p]; if(x!=null) row[4-h]=x/scale; });
      if(row[3]==null && rows && MX.vintages.length){   // a quarter more than one out: show the newest snapshot's value (the upcoming second quarter)
        var lv=MX.vintages[MX.vintages.length-1], lx=rows[lv.id]&&rows[lv.id][p]; if(lx!=null && op-ord(lv.lastActual.q)>=1) row[3]=lx/scale; }
      return row; });
    growth(m);
    var anyA=m.qa.some(function(v){ return v!=null; }), anyC=m.qr.some(function(r){ return r.some(function(v){ return v!=null; }); });
    m.t = (anyA&&!anyC)?'nocons':((anyC&&!anyA)?'noact':'ok');
    return m; }
  var RS = {}; TBBB_LINES.forEach(function(L){ RS[L[0]] = [L[2], L[3]]; });
  TBBB_CE_CONS.m.forEach(function(m){ var s=RS[m.k]; if(s) fromResults(m, s[0], s[1]); });
  var nv = MX && MX.vintages[MX.vintages.length-1];
  TBBB_CE_CONS.asOf = MX ? MX.vintages.map(function(v){ return v.id; }) : [];
  TBBB_CE_CONS.src = 'Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/tbbb.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+')';
})();

// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its dated save (rule 10), never typed.
function ceSummitUs(p){
  var M = tbbbResults.views.q.metrics, out = {};
  TBBB_LINES.forEach(function(x){
    var r = M[x[2]], i = r ? r.periods.indexOf(p) : -1, v = (i >= 0 && r.summit) ? r.summit[i] : null;
    if (v != null){ v = v / x[3]; out[x[0]] = { v: Math.abs(v) >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100 }; } });
  return out;
}

var FY26_GUIDE = '<p>The 2026 guide (Q4 2025 call): <b>590 to 630 net new stores</b>, <b>same-store sales +13% to +16%</b> and <b>revenue growth +29% to +32%</b>, with total capex of about Ps.5.2B.</p>';

export var TBBB_CALL_EARNINGS = { ticker:'TBBB', quarters:[
  // ── UPCOMING: Q1 2027 (quarter ending Mar 31 2027). The second quarter out: the portal always shows two quarters ahead.
  { q:'Q1 2027', status:'upcoming', date:'quarter ending Mar 31 2027',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-11-03 (newest on file, after the Q3 2026 print) · Summit DCF model: Aug 13 2026 submit, quarterly · guidance: none yet for 2027',
      asOf:'2026-11-03',
      notes:{
        'Revenue':{ t:'No 2027 guide yet', h:'<p>The company guides one year at a time and gives the 2027 ranges with the fourth-quarter results. The first quarter of 2027 laps a first quarter of 2026 that grew +33% on same-store sales of +16.0%.</p>' },
        'Same-store sales':{ t:'Comparison base steps up to 16.0%, then 20.0% and 20.5%', h:'<p>2026 quarters printed 16.0%, 20.0% and 20.5%. Management attributes about two-thirds of the growth to volume and one-third to price, mostly mix, with very low internal inflation.</p>' }
      },
      us:ceSummitUs('1Q27'),
      debate:{ rows:null, synth:'' }
    },
    results:null, call:null },

  // ── UPCOMING: Q4 2026 (quarter ending Dec 31 2026; reports in the first quarter of 2027).
  { q:'Q4 2026', status:'upcoming', date:'quarter ending Dec 31 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-11-03 (newest on file, after the Q3 2026 print) · Summit DCF model: Aug 13 2026 submit, quarterly · guidance: the FY2026 guide (Q4 2025 call)',
      asOf:'2026-11-03',
      notes:{
        'Revenue':{ t:'+29% to +32% for the year implies Ps.23.5B to Ps.25.8B in Q4', h:FY26_GUIDE+'<p>Nine-month revenue is Ps.77.3B (+37.7%). Landing in the guide range would need only Ps.23.5B to Ps.25.8B in the fourth quarter (derived, against Ps.22.0B in 4Q25), so the revenue guide is already exceeded on the current run-rate.</p>' },
        'Stores':{ t:'171 to 211 net new stores needed to land in 590 to 630; no change in guidance', h:FY26_GUIDE+'<p>Nine-month net openings are 419 (123, 155 and 141). Reaching 590 needs 171 in the fourth quarter and 630 needs 211, against 184 in 4Q25. On the Nov 3 call Hatoum said the company is still well within guidance: the fourth quarter tends to be heavier on store openings and the pipeline looks very healthy, so there is no change in guidance.</p>' },
        'Same-store sales':{ t:'Guide +13% to +16%; 2026 prints at or above the top', h:FY26_GUIDE+'<p>2026 same-store sales were 16.0%, 20.0% and 20.5%. The fourth quarter laps 16.6%.</p>' },
        'Gross profit':{ t:'Fourth quarter business as normal; transportation is a 2027 theme', h:'<p>On the Nov 3 call Hatoum said to expect business as normal in the fourth quarter and that margins go up and down quarter to quarter on a healthy upward trend. Rebates on December sales are booked in January, as every year; December is expected to be much better than last year’s.</p>' },
        'Income tax':{ t:'Mexico’s new tax law on deductions: a temporary cash-flow effect', h:'<p>Pizzuto on the Nov 3 call: the law would mainly have a temporary effect on cash flows; with today’s information there is no change to next year’s plans and guidance comes on the Q4 call.</p>' },
        'Admin ex-SBC':{ t:'About 3% of revenue for the second half (Q2 call); Q3 printed 2.6%', h:'<p>On the Aug 13 call the CFO called about 3% of revenue ex-SBC a fair short-term assumption for the second half, describing the spend as talent densification in purchasing, logistics, systems and specialty roles. Q3 printed 2.6%.</p>' },
        'Stock-based comp':{ t:'Company schedule: Ps.489M in Q4, Ps.2,376M for 2026', h:'<p>The 3Q26 release projects non-cash share-based payment expense of Ps.489M for 4Q26, Ps.2,376M for 2026, Ps.879M for 2027 and Ps.215M for 2028, on a graded-vesting schedule that is higher early and decreasing over time.</p>' },
        'Distribution centers':{ t:'25 at Sep 30; no new quarterly count given', h:'<p>Four distribution centers opened in Q3, taking the network from 21 to 25. Management said more could open in the second half if opportunities appear.</p>' }
      },
      us:ceSummitUs('4Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:null, call:null },

  // ── REPORTED: Q3 2026 (quarter ended Sep 30 2026; release Nov 2 2026; call Nov 3 2026, transcript pasted by the analyst).
  // Street = the Bloomberg snapshot of Aug 17 2026, the last before the print. Guidance: the Q2 call (Aug 13 2026) and the FY2026 guide.
  { q:'Q3 2026', status:'reported', date:'November 2, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-08-17 (the last before the print) · Summit DCF model: Aug 13 2026 submit, quarterly · guidance: Q2 2026 call (Aug 13 2026) and the FY2026 guide',
      asOf:'2026-08-17',
      notes:{
        'Revenue':{ t:'FY2026 guide +29% to +32%', h:FY26_GUIDE },
        'Same-store sales':{ t:'FY2026 guide +13% to +16%; Q2 printed 20.0%', h:FY26_GUIDE+'<p>The Q2 call put about two-thirds of the growth on volume and one-third on price, mostly mix.</p>' },
        'Distribution centers':{ t:'Three DCs in Q3 per the Q2 call', h:'<p>On the Q2 call the CFO said two more DCs had opened in the weeks after quarter end and a third was planned within Q3, and warned of possible pressure on logistics expense.</p>' },
        'Admin ex-SBC':{ t:'About 3% of revenue for the second half', h:'<p>The Q2 call: about 3% of revenue ex-SBC is a fair short-term assumption, driven by talent densification.</p>' },
        'Gross profit':{ t:'No margin guide; dollar margin is the measure', h:'<p>Management gives no gross-margin target. On the Q2 call it said the percent margin can plateau as more of the scale benefit is passed into price, and that the metric that matters is dollar gross margin; it sees volatility from the SKU-level pricing mechanism, not seasonality.</p>' },
        'Stock-based comp':{ t:'Company schedule: about Ps.553M for Q3', h:'<p>The 2Q26 release schedule implied about Ps.553M for 3Q26 (FY2026E Ps.2,379M less the first-half Ps.1,337M and the Ps.489M for Q4).</p>' }
      },
      us:ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'Same-store sales rose to 20.5% and revenue grew 40.3%, with gross margin up 52bps despite four new DCs; adjusted EBITDA margin reached 6.6% and reported profit turned positive as the SBC charge faded.',
      notes:{
        'Revenue':{ t:'+40.3% to Ps.28,445M; nine months +37.7%', h:'<p>Revenue grew 40.3%, driven mostly by stores open more than a year and, to a lesser extent, by 603 net new stores opened in the last twelve months (+19.1% store base). Nine-month revenue of Ps.77.3B compares with the +29% to +32% guide for the year.</p>' },
        'Same-store sales':{ t:'+20.5% on a 17.9% comparison', h:'<p>Same-store sales grew 20.5% against 17.9% in 3Q25, above the 20.0% of the second quarter and above the top of the +13% to +16% guide for 2026.</p>' },
        'Stores':{ t:'+141 net new, 3,765 stores; LTM +603', h:'<p>141 net openings against 131 a year earlier. Nine-month net openings are 419, against a 590 to 630 guide.</p>' },
        'Net new stores':{ t:'141 against 131 in 3Q25', h:'<p>Net openings were 141 (+7.6%). In the last twelve months the company opened 603 against 528 a year earlier.</p>' },
        'Distribution centers':{ t:'Four opened in the quarter, 25 in total', h:'<p>The network went from 21 to 25 distribution centers (18 a year earlier). The release says gross margin improved on lower transportation cost as a share of revenue despite the four openings.</p>' },
        'Gross profit':{ t:'16.7% margin, +52bps', h:'<p>Gross profit grew 44.8% to Ps.4,743M. The margin improvement reflects a stronger commercial margin and lower transportation costs as a percentage of revenue, despite the opening of four DCs.</p>' },
        'Sales expenses':{ t:'9.8% of revenue, −36bps', h:'<p>Sales expenses rose 35.4% to Ps.2,796M, growth driven by the store count and wage inflation, with operating leverage across most components including labor.</p>' },
        'Administrative expenses':{ t:'−39.2%: the SBC charge is fading', h:'<p>Administrative expenses fell to Ps.1,283M (4.5% of revenue, from 10.4%). The decrease is entirely the lower non-cash share-based payment expense: the Liquidity Event Plan is recognized on a graded-vesting basis, higher at the start and decreasing over time.</p>' },
        'Admin ex-SBC':{ t:'2.6% of revenue, Ps.733M (+37%)', h:'<p>Excluding share-based payment, administrative expenses were Ps.733M, up 37.0% as the company invests in talent and new regions, and 6bps lower as a share of revenue. The Q2 call pointed to about 3% for the second half.</p>' },
        'Stock-based comp':{ t:'Ps.550M against Ps.1,574M', h:'<p>Non-cash share-based payment expense was Ps.550M. The company projects Ps.489M for 4Q26 and Ps.2,376M for 2026 (Ps.879M in 2027).</p>' },
        'Operating profit':{ t:'Ps.682M against a Ps.880M loss', h:'<p>Operating profit was Ps.682M (2.4% margin) against a loss of Ps.880M in 3Q25, which carried the first Liquidity Event Plan charge.</p>' },
        'EBITDA (reported)':{ t:'Ps.1,327M against a Ps.404M loss', h:'<p>Reported EBITDA is after share-based payment and before rent: IFRS 16 capitalizes lease cost, so total D&amp;A (Ps.645M) is added back to net profit.</p>' },
        'EBITDA ex-SBC':{ t:'Ps.1,877M, +60.5%, 6.6% margin (+83bps)', h:'<p>The measure management leads with. It does not manage to a margin target and expects margin to expand over time from store and network discipline.</p>' },
        'Building lease payments':{ t:'Ps.638M against Ps.463M', h:'<p>Capitalized lease payments for buildings (all stores but one and all distribution centers are leased). Under IFRS 16 they are not operating expenses, so reported EBITDA is before rent.</p>' },
        'EBITDA after leases':{ t:'About Ps.1.24B, 4.4% of revenue (derived)', h:'<p>Derived, not reported: EBITDA ex-SBC less the building lease payments, which puts rent back as an operating cost. It is the like-for-like figure against retailers that report rent in opex.</p>' },
        'Financial costs':{ t:'Ps.528M, +45.7% on lease interest', h:'<p>Higher interest expense on lease liabilities as stores, distribution centers and equipment grow.</p>' },
        'Financial income':{ t:'Ps.63M against Ps.42M', h:'<p>Higher average cash position.</p>' },
        'FX gain / (loss)':{ t:'Ps.97M gain on the dollar cash position', h:'<p>The appreciation of the US dollar against the peso lifted the peso value of the company’s US dollar deposits (US$237M of short-term deposits at Sep 30).</p>' },
        'Income tax':{ t:'Ps.290M against Ps.137M', h:'<p>Income tax expense more than doubled while pre-tax profit turned positive (Ps.313M).</p>' },
        'Net income':{ t:'Ps.23M against a Ps.1,424M loss', h:'<p>Net profit after Ps.290M of income tax; diluted EPS Ps.0.14 on 162.5M diluted shares.</p>' },
        'Operating cash flow':{ t:'Ps.2,765M in Q3; Ps.7,051M for nine months (+128%)', h:'<p>Driven by the structurally negative working capital: suppliers added Ps.1.5B in the quarter, helped by supplier-finance arrangements. The release says operating cash flow fully funds the expansion.</p>' },
        'Capex':{ t:'Ps.1,099M of property and equipment purchases', h:'<p>Purchases of property, furniture, equipment and leasehold improvements; Ps.2,740M for nine months against a Ps.5.2B full-year capex guide.</p>' },
        'Free cash flow':{ t:'Ps.1,666M (derived), before lease payments', h:'<p>Operating cash flow less purchases of property and equipment. It is before lease payments (about Ps.0.78B in the quarter, principal and interest), which are financing flows under IFRS 16.</p>' }
      },
      watch:{ 'Same-store sales':1, 'Gross profit':2, 'Admin ex-SBC':3 }
    },
    call:{
      prepared:[
        { topic:'Operations and growth', body:'Anthony Hatoum: <b>141</b> net new stores, <b>3,765</b> in total, <b>419</b> year to date and <b>603</b> over twelve months; four new distribution centers took the network to <b>25 regions</b>. Same-store sales <b>+20.5%</b>, revenue <b>+40% to MXN 28 billion</b>. Reported EBITDA MXN 1.3 billion; EBITDA ex-SBC <b>+60% to MXN 1.9 billion</b>. Nine-month operating cash flow <b>MXN 7.1 billion (+128%)</b>. The real-estate strategy is unchanged: new markets and density in existing ones. The gap to ANTAD was more than <b>21 percentage points</b>, with very low internal inflation.' },
        { topic:'Costs and EBITDA', body:'Eduardo Pizzuto: sales expenses <b>−36bps to 9.8%</b> of revenue with operating leverage in most lines, including labor. Admin ex-SBC <b>−6bps</b>: strong top-line performance generated operating leverage while investing in talent and new regions. EBITDA ex-SBC <b>+60% to MXN 1.9 billion</b>, margin <b>+83bps</b>, on sales growth, improved gross margin and operational efficiencies. The company does not manage the business to an EBITDA target.' },
        { topic:'Working capital', body:'Adjusted negative working capital <b>MXN 10.8 billion</b> against 7.8 billion in 2025, about <b>10.9%</b> of LTM revenue, excluding IPO and follow-on proceeds. Operating cash flow fully funds organic expansion.' },
        { topic:'Closing', body:'Hatoum: growth comes from two engines, the continued expansion of the store network and sustained same-store sales growth. Newer store vintages are performing better than earlier ones: they start with higher initial sales and their sales grow faster, and the momentum continues into the fourth quarter.' }
      ],
      qanda:[
        { q:'Openings pace against the 590 to 630 guide, and a heavier fourth quarter', analyst:'Andrew Ruben · Morgan Stanley', theme:'FY2026 guide: 590-630 openings, SSS +13% to +16%, revenue +29% to +32%',
          qFull:'The pace so far looks to be annualizing a bit below the guide, but the fourth quarter tends to be heavier. How do you feel about 590 to 630, and is there a structural reason for more openings in Q4?',
          a:'<b>Anthony Hatoum:</b> “We’re still well within guidance, and you’re absolutely right. The fourth quarter tends to be a little bit heavier on store openings, and our pipeline looks very healthy at this stage. So no change in guidance.”' },
        { q:'Competition and the start of the fourth quarter', analyst:'Alejandro Fuchs · Itaú BBA', theme:'Hard-discount competition (Neto, FEMSA)',
          qFull:'Have you seen anything different in competition in the last couple of months, and how are the trends starting in the fourth quarter?',
          a:'<b>Anthony Hatoum:</b> “We haven’t seen anything notable. From our own perspective, nothing has changed. Still are gaining new customers, and we still see a healthy trend in ticket size. But we read what you read, and we see people moving, and I think overall this is healthy for the market and for the consumer.”' },
        { q:'Commercial margin and the Mexican corporate tax change', analyst:'Héctor Maya · Scotiabank', theme:'Gross margin: dollar margin over percent',
          qFull:'How much did commercial margin help third-quarter margins and how should we think about it going forward? And how should we think about Mexico’s corporate tax?',
          a:'<b>Anthony Hatoum:</b> “There is an expansion in commercial margin in this quarter. As we’ve said many times, margins go up a little bit, come down a little bit, but overall, the trend over a longer period of time is a healthy upward trend… we’ve seen a lot of operating leverage this quarter too… in the fourth quarter, just expect business as normal.” <b>Eduardo Pizzuto:</b> on the new law that limits deductions, “with the information that we have today, this is a law that would mainly affect temporarily cash flows. As of today, we do not expect any changes for our plans for next year… we will give you guidance on our next call.”' },
        { q:'Commercial terms, rebates and the drivers of lower transportation cost', analyst:'Bob Ford · Bank of America', theme:'Regions and distribution centers (the "stretching" model)',
          qFull:'Were the commercial-term improvements strictly price-volume optimization or did volume-based rebates play a role? What drives lower transportation cost and how should we think about network capacity use? And what is different about seasonality into year end?',
          a:'<b>Anthony Hatoum:</b> on transportation, “we have barely scratched the surface in what we can do to further optimize transportation costs… you will see a lot more happening in 2027 on that front.” On commercial margin, “it is a little bit of everything you mentioned… the main driver of improvement has always been scale, and as we continue to scale, everything improves, including rebates.” On seasonality: “Big differences, we see none… There might be some timings in payments of rebates for sales that are done in December, you see the rebates in January. That’s nothing new.” December: “probably going to be much better than what we showed you last year.”' },
        { q:'Gross margin against the four new DCs', analyst:'Irma Sgarz · Goldman Sachs', theme:'Gross margin: dollar margin over percent',
          qFull:'Analysts expected less gross-margin expansion with four DCs being built. What is the breakdown of the commercial margin between supplier terms, mix, pricing intelligence and shrinkage, and is it sustainable?',
          a:'<b>Eduardo Pizzuto:</b> “If you look at it sequentially, it did have some pressure on margin, but versus a year ago, there’s no doubt that the overall margin has expanded.” Of the four DCs, “two of them opened in the early part of the quarter, in July. Most of the pre-opening expenses happened in Q2… We continue to get smarter on how we do the opening of distribution centers… The older distribution centers that we opened last year are doing their job, and they’re becoming more efficient. Everything is accretive.”' },
        { q:'Frozen rollout, and convenience versus grocery identity', analyst:'Álvaro García · BTG Pactual', theme:'Assortment: new categories, fresh and Irrepetibles',
          qFull:'Where are we in the rollout of freezer capacity across the store base, and do you see the store as a convenience or a grocery format?',
          a:'<b>Anthony Hatoum:</b> “We firmly believe that we’re still a grocery store where the client comes mainly to fill up their pantry… a lot of value for your money grocery store.” On frozen: “We were the pioneers in Mexico in bringing high value for money frozen to the market… the Frozen is more visible because you see a capex in the freezers, and I remind everybody that we look at the ROIC of this capex very carefully.” “Refrigeration strategy is very dynamic. You’ll see changes in our refrigeration approach in the next years… we try to reduce refrigeration costs while offering you refrigerated goods.”' },
        { q:'Price gap, ramp-up and terminal sales of new stores', analyst:'Joseph Giordano · JPMorgan', theme:'Vintages: new stores open higher and ramp faster',
          qFull:'Is the price gap versus peers widening, do new stores show higher terminal sales and returns, and how are new categories such as frozen helping growth?',
          a:'<b>Anthony Hatoum:</b> “The price gap remains, and it’s steady. In this quarter, we haven’t seen anything that jumps.” On ramp-ups: “the store sales curve becoming steeper, and for all our stores, the maximum sales going up over time. In the next quarter or thereafter, we will update our spaghetti chart, which will clearly show that graphically… It’s driven by two things: our brand is much better recognized today, but most important is the value proposition to customers.”' },
        { q:'Traffic versus ticket, items per basket and category mix', analyst:'Vinicius Strano · UBS', theme:'Same-store sales: volume and mix, not price',
          qFull:'Can you break same-store sales into traffic and ticket, how are items per basket evolving, which categories lead and how does mix help gross margin?',
          a:'<b>Eduardo Pizzuto:</b> “Two-thirds is coming from volume, which is the number of tickets and items per ticket, and the balance is price. And within price, the vast majority comes from mix, not from inflation, because internal inflation is very, very low, actually close to zero.” Items per basket: “at IPO we were talking about two to three items. Today, we’re talking about a range of four to five items per transaction.” <b>Anthony Hatoum:</b> “Everything is contributing to growth. Frozen or cosmetics are having an outstanding performance… Dairy continues to have a very solid growth.” “Our focus is on getting existing customers to buy more from us.”' },
        { q:'Pilots under way', analyst:'Antonio Hernández · Actinver', theme:'Assortment: new categories, fresh and Irrepetibles',
          qFull:'Any new pilot across the stores worth highlighting?',
          a:'<b>Anthony Hatoum:</b> “At any point in time, there is about 60 to 80 pilots… Some you pick on because they’re very visible, like fruits and vegetables or meats… a whole bunch of them you won’t necessarily pick on because they look like any other product.” “Our SKU count today remains very conservative at around 900 products… we have the ability to increase this without changing anything in our operations or in our logistics, but we will maintain our very strict discipline: very high value for money, very high rotation.”' },
        { q:'Efficiency of the new DCs, and shifts from big box to proximity', analyst:'Federico Galassi · The Rohatyn Group', theme:'Regions and distribution centers (the "stretching" model)',
          qFull:'How much more efficient are the new distribution centers, with almost ten opened in a year? And with about 20% sales growth against ANTAD near zero, are customers shifting from big box to proximity?',
          a:'<b>Anthony Hatoum:</b> a DC “still serves roughly the same number of stores… the optimization happens at two levels. One, internal operations, shaving minutes of work and moving boxes. The other is compacting distances: every time we open a new distribution center, we’re also reshuffling the stores, so that the truck distances from warehouse to store become smaller.” On share: “It’s a very hard question to answer because we don’t see the full picture… if the customer did not see more value in our offer, we wouldn’t be seeing the numbers we’re seeing.”' },
        { q:'Yema and talent below the executive level', analyst:'Alberto Vadia · Fruit Tree Capital', theme:'ERP, AI and talent build-out',
          qFull:'Where is Yema today and in ten years? And how do you develop talent at the entry level, such as the cashier or the distribution-center stocker?',
          a:'<b>Anthony Hatoum:</b> “We’re firm believers that investing in talent is a high return on investment effort… it’s the team that makes the difference, and we’re investing in the team at all levels, all the way from the cashier to the most senior person in the company.” On Yema: “It’s only four stores… it will continue to grow, and it will grow at its own pace. It is hitting a niche of the market that nobody seems to have been looking at… we haven’t guided, and we’re unlikely to guide anytime soon.”' },
        { q:'Scaling private-label suppliers, and the distinctive competence', analyst:'Guli Arshad · private investor', theme:'Private-label penetration',
          qFull:'How do you manage the scaling of private-label providers, and do you use different providers by region for the same product? What is your distinctive competence?',
          a:'<b>Anthony Hatoum:</b> “We very proactively manage the procurement side… in 2026, we are not talking about 2026, we are talking about 2028 and 2029 with all our suppliers. That also explains why this business has been able to grow at 30% plus per annum now for the last 12-plus years without experiencing any hiccups.” On two suppliers per product: “There is no right or wrong answer here… sometimes for geographical reasons, sometimes to protect your supply base… on a product-by-product basis.” On the differentiator: “I really think that it is the team. With a better team, you can do great things.”' },
        { q:'Tax reform: accounting and cash effect, and capital structure', analyst:'Vanessa Quiroga · Eternal Capital Group', theme:'Mexico tax law on deductions',
          qFull:'What is the potential impact of the tax reform on the effective tax rate, accounting and cash, and would it change your capital structure toward more debt?',
          a:'<b>Eduardo Pizzuto:</b> “With the information that we have today, this is a law that will temporarily affect, or mainly will temporarily affect, our cash flows. As of today, we have no plans to change our plans for next year… we need to see the final draft, and then we will give you our guidance in our Q4 call.” On capital structure: “We don’t think it has that kind of impact. It might shift the cash flows on a temporary basis. Let’s hold off till Q4.”' }
      ],
      highlights:[
        { tag:'thesis', band:'logged', head:'Gross margin expanded year on year despite four new DCs; the pre-opening cost fell mostly in Q2.',
          detail:'<p>Pizzuto to Sgarz: two of the four DCs opened in July and most pre-opening expense was already booked in Q2; the company is getting better at DC openings, and the DCs opened last year are becoming more efficient. Sequentially there was some margin pressure.</p>' },
        { tag:'dots', band:'logged', head:'Mexico’s new tax law on deductions: a temporary cash-flow effect, no change to 2027 plans, guidance on the Q4 call.',
          detail:'<p>Pizzuto to Maya and Quiroga: the law would mainly have a temporary effect on cash flows; the final draft is still awaited; no change to the capital structure is expected.</p>' },
        { tag:'curious', band:'logged', head:'Items per basket now four to five against two to three at the IPO.',
          detail:'<p>Pizzuto to Strano. Same-store sales remain two-thirds volume and one-third price, mostly mix, with internal inflation close to zero.</p>' },
        { tag:'tone', band:'logged', head:'Transportation is a 2027 theme; the cohort chart gets updated in the next quarter or thereafter.',
          detail:'<p>Hatoum to Ford and Giordano: the company has barely scratched the surface on transportation cost; the spaghetti chart will show the steeper and higher sales curve of newer vintages.</p>' }
      ],
      newQuestions:[
        {n:'Do fourth-quarter openings land inside 590 to 630, with the usual heavier quarter?', landed:{q:'Q4 2026', rank:1}},
        {n:'What is the 2027 guide on openings, same-store sales and revenue?', landed:{q:'Q4 2026', rank:2}},
        {n:'What does the final tax law mean for cash flow and the effective rate?', landed:{q:'Q4 2026', rank:3}},
        {n:'What does the updated cohort chart show on sales curves and unit economics?', landed:{q:'Q4 2026', rank:4}},
        {n:'Where does transportation cost go as the 2027 optimization starts?', landed:{q:'Q4 2026', rank:5}}
      ]
    } },

  // ── REPORTED: Q2 2026 (quarter ended Jun 30 2026; release Aug 12 2026; call Aug 13 2026). Transcript: TBBB Calls.txt (verbatim).
  // Street = the Bloomberg snapshot of May 11 2026, the last before the print.
  { q:'Q2 2026', status:'reported', date:'August 13, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-05-11 (the last before the print) · Summit DCF model: Aug 13 2026 submit, quarterly (frozen pre-print estimate) · guidance: the FY2026 guide (Q4 2025 call)',
      asOf:'2026-05-11',
      notes:{
        'Revenue':{ t:'FY2026 guide +29% to +32%', h:FY26_GUIDE },
        'Same-store sales':{ t:'FY2026 guide +13% to +16%; Q1 printed 16.0%', h:FY26_GUIDE }
      },
      us:ceSummitUs('2Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'Same-store sales accelerated to 20.0%, gross margin expanded 54bps and the lock-up closed on Aug 6; reported EBITDA stayed burdened by the SBC charge.',
      notes:{
        'Revenue':{ t:'+38.7% to Ps.26,037M', h:'<p>Revenue grew 38.7% with 155 net new stores. First-half revenue grew 36.2%.</p>' },
        'Same-store sales':{ t:'+20.0% on a 17.7% comparison', h:'<p>The highest reading in the series. Management put about two-thirds of the growth on volume and one-third on price, mostly mix, with internal inflation very low, and a gap above 20 points to ANTAD.</p>' },
        'Stores':{ t:'+155 net new, 3,624 stores; LTM +593', h:'<p>The base grew 20% from June 2025. One DC opened in the quarter (21 in total), two more in the following weeks.</p>' },
        'Gross profit':{ t:'16.8% margin, +54bps', h:'<p>Stronger commercial margin and lower transportation cost despite the DC build-out; management frames dollar gross margin as the measure that matters.</p>' },
        'Sales expenses':{ t:'10.0% of revenue, −56bps', h:'<p>Operating leverage across most expense lines, including labor.</p>' },
        'Admin ex-SBC':{ t:'3.1% of revenue, +57bps, with a Ps.37M follow-on cost', h:'<p>Talent and new regions; the quarter carries a one-time Ps.37M cash expense from the May equity follow-on. Management guided about 3% for the second half.</p>' },
        'Stock-based comp':{ t:'Ps.615M, non-cash', h:'<p>Already reflected in the fully diluted share count; the release appendix projects it by program.</p>' },
        'EBITDA (reported)':{ t:'Ps.960M after SBC and before rent', h:'<p>The adjusted figure adds back the non-cash share-based payment expense.</p>' },
        'EBITDA ex-SBC':{ t:'Ps.1,575M, +43.8%; 6.2% before the follow-on cost', h:'<p>Adjusted margin +21bps year on year; 6.1% as reported and 6.2% excluding the Ps.37M. Management does not drive to an EBITDA margin.</p>' },
        'Net income':{ t:'Loss of Ps.386M', h:'<p>The loss reflects SBC, lease interest and a Ps.85M FX loss on the dollar cash position.</p>' },
        'Operating cash flow':{ t:'Ps.2,325M; first half Ps.4.3B (+119%)', h:'<p>Adjusted negative working capital reached Ps.10.2B (about 11.2% of last-twelve-months revenue, excluding IPO and follow-on proceeds).</p>' },
        'Building lease payments':{ t:'Ps.593M against Ps.439M', h:'<p>Capitalized lease payments for buildings; EBITDA is before them.</p>' }
      },
      watch:{ 'Gross profit':1, 'Admin ex-SBC':2, 'Distribution centers':3 }
    },
    call:{
      prepared:[
        { topic:'Operations and growth', body:'Anthony Hatoum: <b>155</b> net new stores, <b>3,624</b> in total, <b>593</b> over twelve months (+20% on June 2025). One new distribution center, <b>21 regions</b>. Same-store sales <b>+20%</b>, revenue <b>+39% to MXN 26 billion</b>. Expansion strategy “remains unchanged”: densify existing regions while selectively entering others. The gap to ANTAD stayed above <b>20 points</b> with very low internal inflation.' },
        { topic:'Costs and EBITDA', body:'Eduardo Pizzuto: sales expenses <b>−56bps to 10%</b> with operating leverage in most lines, including labor. Admin ex-SBC <b>+57bps</b> on talent and new regions, including a one-time <b>MXN 37 million</b> follow-on cost. EBITDA ex-SBC <b>+44% to MXN 1.6 billion</b>, margin <b>+21bps</b> (<b>6.2%</b> excluding the one-time item). “As you know, we don’t drive to an EBITDA.”' },
        { topic:'Cash flow and working capital', body:'First-half operating cash flow <b>MXN 4.3 billion (+119%)</b>. Adjusted negative working capital <b>MXN 10.2 billion</b> against 7.1 billion in 2025, about <b>11.2%</b> of LTM revenue, excluding IPO and follow-on proceeds. “Our operating cash flow fully funds our organic expansion.”' },
        { topic:'Closing', body:'Hatoum: a strong first half “with consistent and solid execution”; the model “delivers attractive unit economics, generates strong cash flow, and becomes even more competitive as we scale.”' }
      ],
      qanda:[
        { q:'Gross margin drivers and lower transportation cost', analyst:'Andrew Ruben · Morgan Stanley', theme:'Gross margin: dollar margin over percent',
          qFull:'What changed in commercial margins quarter on quarter, and why did transportation cost fall despite the DC build-out? How much did each contribute and what does it mean for the gross-margin outlook?',
          a:'<b>Anthony Hatoum:</b> “What you are seeing here is a sum of the gross margins of all the SKUs we currently carry.” As the company scales it buys and manufactures more efficiently, “a bigger pie” that is split with the producer on private label and then priced to “optimize volumes and dollar margin.” “Will the trend continue? Very likely… There comes a point where in terms of percent margin, you’re basically passing more into price than necessarily retaining it. But end result, the most important thing is to look at is the dollar margin generated.” <b>Eduardo Pizzuto:</b> transportation helped by ongoing optimization in every region and by “a better job in managing the pre-operating expenses” of the DC opened in Q2. Two more DCs opened in recent weeks and a third is expected in Q3, “three DCs in Q3… we might see some pressure probably in logistics expense.”' },
        { q:'Ticket versus traffic, new SKUs and the ERP rewrite', analyst:'Bob Ford · Bank of America', theme:'Same-store sales: volume and mix, not price',
          qFull:'How much of same-store sales growth is ticket versus traffic and items per transaction? How much comes from new SKUs? What is the progress on the ERP rewrite, how is AI changing development, and what follows in logistics and point of sale?',
          a:'<b>Anthony Hatoum:</b> “About 2/3 of the growth is explained by volume. One-third is explained by price, and within price, the large impact is coming from better mix.” All categories are growing; new categories from a low base grow fastest. “We like to keep our SKU count on the low side… every time we put in an SKU, we have to make sure that it does rotate.” On the ERP: “I am very pleased with the progress… We are testing phase one… AI tools have definitely accelerated our ability to program… we have just brought forward a lot of stuff that we had planned to do a little bit later… net-net, we are on track.” The new point of sale “has the ability to deliver more than just ringing up a product… optionality to offer more services to the client down the road.” On logistics: “we don’t do much on the backside of logistics, and that’s quite an interesting opportunity.”' },
        { q:'Upgraded store format and ramp-up', analyst:'Joseph Giordano · JPMorgan', theme:'Vintages: new stores open higher and ramp faster',
          qFull:'What share of new stores open in the upgraded format, what is the typical sales uplift, and how should we think about the ramp-up, which looks faster than prior vintages?',
          a:'<b>Anthony Hatoum:</b> “100% of our new stores open under the new format. We’d like to try and keep as much format discipline as we can… our older stores are still performing extremely well.” <b>Eduardo Pizzuto:</b> “We updated our unit economics analysis in Q4, so it’s pretty much trending against what we had projected… the ramp-ups continue to be very consistent and we’re very happy with the evolution of our 2026 vintage.”' },
        { q:'280 openings with one new DC in the first half', analyst:'Ulises Argote · Santander', theme:'Regions and distribution centers (the "stretching" model)',
          qFull:'Close to 280 stores opened in the first half with only one additional DC. Is that timing, and are you finding efficiencies serving a broader store base from each DC?',
          a:'<b>Eduardo Pizzuto:</b> “We are on track in terms of our openings as what we had planned in the beginning of the year.” Each new DC increases the footprint and makes transportation more efficient. “For the back half of the year, yes, we’re opening three additional ones in Q3. If we see opportunities to open more in the back half of the year, we might do so.” “Just a heads-up… might be some pressure on logistics expense in Q3… in the longer run, eventually these will become even more efficient.”' },
        { q:'World Cup and the second-half G&A run-rate', analyst:'Héctor Maya · Scotiabank', theme:'Expense leverage against the opening pace',
          qFull:'Was there a World Cup tailwind to same-store sales, and is the Q2 level a good run-rate for G&A in the second half?',
          a:'<b>Anthony Hatoum:</b> “World Cup did not have a relevant impact on our sales. It was even hard to tease out anything, if at all.” <b>Eduardo Pizzuto:</b> “We don’t guide on these metrics, but I think it’s fair to assume that we will continue to invest in talent… something very similar to what happened in Q2. So let’s say <b>3ish% of revenue</b>. I think in the short term, that would be a fair assumption.”' },
        { q:'Where the G&A talent goes, and the cardless test', analyst:'Irma Sgarz · Goldman Sachs', theme:'Expense leverage against the opening pace',
          qFull:'Which areas of the organization are you adding talent to, or is it retention and incentives? What did the cardless store test show, and is operating leverage still to come through selling expense?',
          a:'<b>Anthony Hatoum:</b> the cardless test removed credit and debit cards: “non-material impact. It’s a test, and it doesn’t mean we’re going to expand it.” On G&A: “much, much less to do with improving salaries and benefits to employees and much, much more to do … in adding talent and densifying talent in across the board critical areas. You’ll see it in purchasing, you’ll see it in logistics, you’ll see it in systems, you’ll see it in specialty areas.” On 2027: “Talent is an ongoing process… there is no limit to adding talent” as long as each hire contributes “significantly more than what they’re going to cost.” Asked whether the leverage comes through the selling-expense line: “Exactly.”' },
        { q:'Store size and parking as basket grows', analyst:'Jorge Izquierdo · BTG Pactual', theme:'Vintages: new stores open higher and ramp faster',
          qFull:'As basket size increases, how are you thinking about store size and the need for parking?',
          a:'<b>Anthony Hatoum:</b> “We’re extremely comfortable with the current store size that you’re seeing in the new generation of stores. The addition of parking or not boils down very simply to how suburban or urban are you… as soon as there is a need for parking and you’ve opened a store where there is parking, then absolutely, we’re putting parking.”' },
        { q:'Working capital as new categories arrive', analyst:'Antonio Hernández · Actinver', theme:'Negative working capital funds the growth',
          qFull:'As new categories are introduced or piloted, how should we think about working capital?',
          a:'<b>Eduardo Pizzuto:</b> “We only carry items that have very high rotation… there should be no impact on working capital… no material impact on working capital. In fact… we’ve been slightly improving our inventory days. So it’s below 20 days. That’s what we should expect going forward.”' },
        { q:'Two-year same-store-sales stack and FEMSA', analyst:'Jo Thomas · HSBC', theme:'Hard-discount competition (Neto, FEMSA)',
          qFull:'Same-store sales of +20% on a +17% comparison is a meaningful two-year acceleration; is the two-year momentum the way to model it? And what is the competitive intensity in hard discount, including FEMSA’s rollout?',
          a:'<b>Anthony Hatoum:</b> “Regarding FEMSA, we do not see anything more than what we have already seen… there is room for several players to thrive in the sector that we call discount… nothing that will change what we are doing at all.” On same-store sales: “All we need to do is sell one more item per customer, and you can see that number significantly increasing… The day that stops is probably the day you do not see any more expansion in same store sales. I would be conservative, but I would still remain positive that that is going to happen.”' },
        { q:'New customers versus wallet share, real estate and a faster pace', analyst:'Isabella Lamas · UBS', theme:'Runway: how many stores Mexico can hold',
          qFull:'How much growth is new customers versus share of wallet, and what initiatives raise items per transaction? Is real estate availability still solid and are you considering accelerating expansion?',
          a:'<b>Anthony Hatoum:</b> “There is no constraints on real estate. The runway’s tremendous in Mexico for us.” Growth has been “a mix of both”; older vintages capture new clients more slowly, newer vintages “much more rapidly.” “Even without adding any new SKUs… the existing portfolio is still not by any metric, fully penetrated. There’s still tremendous potential for existing customers with the existing portfolio to still see an increase in same store sales.”' },
        { q:'Gross-margin giveback and the option-sale mechanism', analyst:'Froylan Méndez · JPMorgan', theme:'Capital structure: IPO, follow-ons, lock-up',
          qFull:'Could the extra Q3 openings give back some gross margin, and is anything seasonal or one-off? And with the option restriction lifting 48 hours after the release, is there a mechanism to avoid disorderly sales?',
          a:'<b>Anthony Hatoum:</b> “You would think that people will rush to the doors to sell their options, and I don’t have a feeling that that’s going to be the case. In any event, we do already have in place mechanisms to ensure that when naturally people want to sell some of their options, it’s done in a very orderly and timely way.” On gross margin: “We don’t see seasonality in our gross margins, really. We do see volatility quarter-to-quarter… if you look at it longer term, the trend is always positive… what’s most important is your dollar gross margin increasing healthily over time.”' }
      ],
      highlights:[
        { tag:'thesis', band:'logged', head:'Dollar gross margin, not the percent, is the measure management wants to be judged on.',
          detail:'<p>Hatoum to Ruben and Méndez: the percent margin can plateau because more of the scale benefit is passed into price, which “detonates more sales” and more dollar margin. There is no seasonality, only quarter-to-quarter volatility from SKU-level pricing.</p>' },
        { tag:'dots', band:'logged', head:'Three DCs in Q3, with a warning on logistics expense.',
          detail:'<p>Pizzuto, twice: two DCs opened in the weeks after quarter end, a third within Q3, “some pressure probably in logistics expense”; more in the second half if opportunities appear. The release for Q3 later reported four opened.</p>' },
        { tag:'tone', band:'logged', head:'G&A about 3% of revenue for the second half, and no limit on talent.',
          detail:'<p>Pizzuto: “3ish% of revenue” is a fair short-term assumption; Hatoum: talent adds to G&A but with “very high return,” and the operating leverage still comes through selling expense.</p>' },
        { tag:'curious', band:'logged', head:'Tests on the side: cardless stores had a non-material effect; the new POS is built for services.',
          detail:'<p>Hatoum on Sgarz and Ford: the cardless test “doesn’t mean we’re going to expand it”; the new ERP and point of sale give “optionality to offer more services to the client down the road.”</p>' }
      ],
      newQuestions:[
        {n:'Does transportation cost build as the Q3 distribution centers open?', landed:{q:'Q3 2026', rank:1}},
        {n:'Is the gross-margin gain held, or given back as price absorbs more of the scale benefit?', landed:{q:'Q3 2026', rank:2}},
        {n:'Does admin ex-SBC settle near 3% of revenue in the second half?', landed:{q:'Q3 2026', rank:3}},
        {n:'Any orderly option selling after the Aug 6 lock-up expiry, and what is the float effect?', landed:{q:'Q3 2026', rank:4}},
        {n:'How durable is the two-year same-store-sales stack after +20%?', landed:{q:'Q3 2026', rank:5}}
      ]
    } }
] };

// ── Earlier reported quarters (./tbbb-ce-hist.js): the print notes are built here from the Results dataset (reported figure against the same quarter a
// year earlier, margins on revenue), so no number is typed; the call comes from the transcript entry. ──
function hFmt(u, v){
  if (v == null) return '—';
  var a = Math.abs(v), sg = v < 0 ? '−' : '';
  if (u === 'Ps.B') return sg + 'Ps.' + (+a.toFixed(2)) + 'B';
  if (u === 'Ps.M') return sg + 'Ps.' + Math.round(a).toLocaleString('en-US') + 'M';
  if (u === '%') return sg + a.toFixed(1) + '%';
  return sg + Math.round(a).toLocaleString('en-US');
}
function hMetric(k){ for (var i = 0; i < TBBB_CE_CONS.m.length; i++) if (TBBB_CE_CONS.m[i].k === k) return TBBB_CE_CONS.m[i]; return null; }
function hRaw(k, idx){   // unrounded reported value in the line's own unit (the grid values are rounded for display)
  var L = TBBB_LINES.filter(function(x){ return x[0] === k; })[0]; if (!L || idx < 0) return null;
  var r = tbbbResults.views.q.metrics[L[2]]; if (!r || r.act[idx] == null) return null; return r.act[idx] / L[3];
}
function hMul(m){ return m && m.u === 'Ps.B' ? 1000 : 1; }
function hAutoNotes(q){
  var Q = TBBB_CE_CONS.q, i = Q.indexOf(q), out = {};
  if (i < 0) return out;
  var revA = hRaw('Revenue', i) * 1000, revY = hRaw('Revenue', i - 4) != null ? hRaw('Revenue', i - 4) * 1000 : null;
  function add(k, kind){
    var m = hMetric(k); if (!m || m.qa[i] == null) return;
    var a = hRaw(k, i), y = i >= 4 ? hRaw(k, i - 4) : null, t, h;
    if (kind === 'growth'){
      var g = (y != null && y > 0) ? Math.round((a / y - 1) * 1000) / 10 : null;
      t = (g == null ? '' : (g >= 0 ? '+' : '−') + Math.abs(g).toFixed(1) + '% to ') + hFmt(m.u, a);
      h = '<p>' + k + ' was ' + hFmt(m.u, a) + (y != null ? ' against ' + hFmt(m.u, y) + ' in the same quarter a year earlier' : '') + '.</p>';
    } else if (kind === 'rate'){
      t = hFmt(m.u, a) + (y != null ? ' on ' + hFmt(m.u, y) + ' a year earlier' : '');
      h = '<p>Same-store sales growth was ' + hFmt(m.u, a) + (y != null ? ', against ' + hFmt(m.u, y) + ' in the same quarter a year earlier' : '') + '.</p>';
    } else if (kind === 'abs'){
      t = hFmt(m.u, a) + (y != null ? ' against ' + hFmt(m.u, y) : '');
      h = '<p>' + k + ': ' + hFmt(m.u, a) + (y != null ? ' against ' + hFmt(m.u, y) + ' a year earlier' : '') + '.</p>';
    } else if (kind === 'margin'){
      var mg = revA ? a * hMul(m) / revA * 100 : null, mgY = (y != null && revY) ? y * hMul(m) / revY * 100 : null;
      t = hFmt(m.u, a) + (mg != null ? ', ' + mg.toFixed(1) + '% of revenue' : '');
      h = '<p>' + k + ' was ' + hFmt(m.u, a) + (mg != null ? ', ' + mg.toFixed(1) + '% of revenue' : '') + (mgY != null ? ', against ' + mgY.toFixed(1) + '% a year earlier (' + ((mg - mgY) >= 0 ? '+' : '−') + Math.abs(Math.round((mg - mgY) * 100)) + 'bps)' : '') + '.</p>';
    } else {
      t = hFmt(m.u, a) + (y != null ? ' against ' + hFmt(m.u, y) : '');
      h = '<p>' + k + ' was ' + hFmt(m.u, a) + (y != null ? ' against ' + hFmt(m.u, y) + ' in the same quarter a year earlier' : '') + '.</p>';
    }
    out[k] = { t: t, h: h };
  }
  [['Revenue','growth'],['Same-store sales','rate'],['Stores','abs'],['Net new stores','abs'],['Gross profit','margin'],['Sales expenses','margin'],['Admin ex-SBC','margin'],
   ['Stock-based comp','margin'],['EBITDA ex-SBC','margin'],['EBITDA (reported)','level'],['Net income','level'],['Operating cash flow','level']].forEach(function(x){ add(x[0], x[1]); });
  return out;
}
// The guide each earlier quarter was reported against (the annual guide of its fiscal year, given on the call that closed the year before).
var GUIDE_NOTES = {
  '2024': { 'Revenue':{ t:'FY2024 guide: sales +28% to +32%', h:'<p>Given with the Q4 2023 results and maintained on the Q1 and Q2 2024 calls: <b>380 to 420</b> net new stores and sales growth of <b>+28% to +32%</b>. FY2024 closed with 484 openings and revenue +30.3%.</p>' },
            'Stores':{ t:'FY2024 guide: 380 to 420 net new stores', h:'<p>Maintained through the year; on the Q3 call the company said it would “solidly meet” it. FY2024 closed at 484.</p>' } },
  '2025': { 'Revenue':{ t:'FY2025 guide: revenue +26% to +29%', h:'<p>Given on the Q4 2024 call: same-store sales <b>+11% to +14%</b>, revenue growth <b>+26% to +29%</b> and <b>500 to 550</b> net new stores. FY2025 closed at +36.1%, 574 and +18.3%.</p>' },
            'Same-store sales':{ t:'FY2025 guide: +11% to +14%', h:'<p>Given on the Q4 2024 call. The year closed at +18.3%; management called that “stratospheric” against the guide.</p>' },
            'Stores':{ t:'FY2025 guide: 500 to 550 net new stores', h:'<p>On the Q2 2025 call the company did not revise the guide and said it was confident of meeting it; the year closed at 574.</p>' } },
  '2026': { 'Revenue':{ t:'FY2026 guide +29% to +32%', h:FY26_GUIDE },
            'Same-store sales':{ t:'FY2026 guide +13% to +16%', h:FY26_GUIDE },
            'Stores':{ t:'FY2026 guide 590 to 630 net new stores', h:FY26_GUIDE } }
};
TBBB_HIST.forEach(function(H){
  var p = H.q.charAt(1) + 'Q' + H.q.slice(-2);
  TBBB_CALL_EARNINGS.quarters.push({ q:H.q, status:'reported', date:H.date,
    setup:{ source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot ' + H.snap + ' · Summit DCF model: the frozen pre-print estimate where the model carried the quarter', asOf:H.asOf, notes:(GUIDE_NOTES[H.q.slice(-4)]||{}), us:ceSummitUs(p), debate:{ rows:null, synth:'' } },
    results:{ headline:H.headline, notes:hAutoNotes(H.q), watch:{} }, call:H.call });
});
