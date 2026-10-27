// overviews/sofi-ce-data.js — the DATA behind SoFi's Evolution ▸ Earnings (the rendering is ./sofi-ce.js).
//
//   SOFI_CE_CONS — the estimate grid and "The print" cards, rebuilt at load from js/results-data/sofi.js (actuals,
//     Bloomberg consensus and the estMatrix vintages; BBG_CONSENSUS.txt snapshots May 2022 → Aug 3 2026).
//   SOFI_CALL_EARNINGS — per quarter, newest first: setup (notes per line), results and the call. Transcripts:
//     docs/calls/SOFI.md (verbatim, Q4 2023 → Q2 2026, supplied by the analyst; Quartr is not used).
//
// Values are $B (the file is $M), members in millions, EPS in $. Guidance is SoFi's own (8-K Ex. 99.1 and the calls).

import { sofiResults } from '../results-data/sofi.js';

// The lines SoFi guides (adjusted basis; discrete quarterly guidance from the prior quarter's 8-K, plus the full year). The Revenue
// line is GAAP total net revenue in the Bloomberg and Summit series while SoFi guides ADJUSTED net revenue; the gap is small
// (2Q26 $1,205.6M adjusted vs $1,218.7M GAAP) and accepted (analyst, Oct 26 2026), so the guide sits under the GAAP line.
// Every line that the Summit model and the Street (or the company) track, in the order the print reads down the income statement:
// [name, unit, results key, divisor from the results file]. HEADLINE first (the fixed nHead block), then the company's own lines.
// Money is $M in the results file: lines big enough to read in billions are '$B' (divisor 1000), the rest '$M'; members and shares in millions.
var SOFI_LINES = [
  ['Revenue', '$B', 'rev', 1000], ['Operating income', '$M', 'opinc', 1], ['Adjusted EBITDA', '$M', 'ebitda', 1], ['EPS (diluted)', '$', 'eps', 1],
  ['Depreciation and amortization', '$M', 'dna', 1], ['Diluted shares', 'Mn', 'shares', 1],
  ['Adjusted net revenue', '$M', 'adjrev', 1],
  ['Net interest income', '$M', 'nii', 1], ['Noninterest income', '$M', 'nonint', 1], ['Loan platform fees', '$M', 'lpb', 1],
  ['Technology products and solutions', '$M', 'tp', 1], ['Loan origination, sales and servicing', '$M', 'loss', 1], ['Other noninterest income', '$M', 'other', 1],
  ['Total members', 'M', 'members', 1000], ['Personal loan originations', '$B', 'plov', 1000], ['Student loan originations', '$B', 'slov', 1000], ['Home loan originations', '$B', 'hlov', 1000],
  ['Noninterest expense', '$M', 'nie', 1], ['Technology and product development', '$M', 'tdev', 1], ['Sales and marketing', '$M', 'sm', 1],
  ['Cost of operations', '$M', 'coo', 1], ['General and administrative', '$M', 'ga', 1], ['Provision for credit losses', '$M', 'pcl', 1], ['Stock-based compensation', '$M', 'sbc', 1],
  ['Adjusted net income', '$M', 'earnings', 1], ['Income tax expense', '$M', 'tax', 1], ['Effective tax rate', '%', 'etr', 1],
  ['Personal loan balance', '$B', 'plb', 1000], ['Student loan balance', '$B', 'slb', 1000], ['Home loan balance', '$B', 'hlb', 1000],
  ['Credit card balance', '$M', 'ccb', 1], ['Commercial and consumer banking balance', '$M', 'ccbb', 1],
  ['Interest-bearing deposits', '$B', 'ibd', 1000], ['Deposits with banks', '$B', 'ibdb', 1000], ['Total debt', '$B', 'tdb', 1000]
];

export var SOFI_GUIDED = ['Adjusted net revenue', 'Adjusted EBITDA', 'Adjusted net income', 'EPS (diluted)', 'Effective tax rate'];

export var SOFI_CE_CONS = {
  src: 'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf: [],
  q: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 6,
  m: SOFI_LINES.map(function(L){ return { k: L[0], u: L[1], t: 'ok' }; })
};

(function(){
  var M = sofiResults.views.q.metrics, MX = sofiResults.estMatrix && sofiResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q = SOFI_CE_CONS.q, QP = Q.map(pOf);
  // Round the way the archive prints: $B to 0.01 (0.1 from $10B up), EPS and members to 0.01.
  function rnd(v,u){ if(v==null) return null; var d=((u==='$B'&&Math.abs(v)>=10)||u==='%'||u==='$M'||u==='Mn')?10:100; return Math.round(v*d)/d; }
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
        var h=op-ord(v.lastActual.q); if(h<2||h>4) return;
        var x=rows[v.id]&&rows[v.id][p]; if(x!=null) row[4-h]=x/scale; });
      return row; });
    growth(m); return m; }
  var RS = {}; SOFI_LINES.forEach(function(L){ RS[L[0]] = [L[2], L[3]]; });
  SOFI_CE_CONS.m.forEach(function(m){ var s=RS[m.k]; if(s) fromResults(m, s[0], s[1]); });
  var GK = { 'Adjusted net revenue':['adjrev',1], 'Adjusted EBITDA':['ebitda',1], 'Adjusted net income':['earnings',1], 'EPS (diluted)':['eps',1], 'Effective tax rate':['etr',1] };
  SOFI_CE_CONS.m.forEach(function(m){ var g=GK[m.k]; if(!g) return; var r=M[g[0]];
    m.qg=QP.map(function(p){ var i=r.periods.indexOf(p); if(i<0||r.guideLo[i]==null||r.guideHi[i]==null) return null;
      return rnd((r.guideLo[i]+r.guideHi[i])/2/g[1], m.u); }); });
  var nv = MX && MX.vintages[MX.vintages.length-1];
  SOFI_CE_CONS.asOf = MX ? MX.vintages.map(function(v){ return v.id; }) : [];
  SOFI_CE_CONS.src = 'Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/sofi.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+')';
})();

// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its dated snapshot
// (rule 10), never typed. Only the lines the model projects by quarter; the rest stay "—". Summit EPS is the model's EARNINGS / SHARES.
function ceSummitUs(p){
  var M = sofiResults.views.q.metrics, out = {};
  SOFI_LINES.forEach(function(x){
    var r = M[x[2]], i = r ? r.periods.indexOf(p) : -1, v = (i >= 0 && r.summit) ? r.summit[i] : null;
    if (v != null){ v = v / x[3]; out[x[0]] = { v: Math.abs(v) >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100 }; } });
  return out;
}

export var SOFI_CALL_EARNINGS = { ticker:'SOFI', quarters:[
  // ── UPCOMING: Q4 2026 (quarter ending Dec 31 2026). Consensus = the newest Bloomberg snapshot on file, Aug 3 2026, which sits
  // BEFORE the 3Q26 print (2Q26 was the last reported quarter then, so this quarter was its fq+2): the Street bar below does not yet
  // reflect the Oct 27 2026 guidance raise. Summit = the 2026-08-05 snapshot, frozen in js/results-data/sofi.js. Guidance: the Oct 27
  // 2026 release raised FY2026 (adjusted net revenue about $5.04B, adjusted EBITDA about $1.66B, adjusted net income about $840M,
  // EPS about $0.61) and introduced FY2027 (about $6.4B, $2.24B, $1.28B, $0.90). The release has no discrete 4Q26 guide; on the
  // Oct 27 call management stated the implied quarter: adjusted net revenue about $1.375B (+36%), adjusted EBITDA $492M, adjusted net
  // income $276M (20% margin), adjusted EPS $0.19; segments lending $785M, financial services $550M, technology platform $90M,
  // corporate in line with 3Q26. That is the full-year guide less the nine-month adjusted actuals (revenue $3,663.9M, EBITDA $1,167.5M,
  // net income $570.1M, EPS $0.43).
  { q:'Q4 2026', status:'upcoming', date:'quarter ending Dec 31 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-08-03 (newest on file, before the 3Q26 print) · Summit DCF model — snapshot 2026-08-05, frozen · guidance: 3Q26 release, presentation and call (Oct 27 2026), full year and 4Q26',
      asOf:'2026-08-03',
      notes:{
        'Adjusted net revenue':{ t:'Guided about $1.375B adjusted, up 36%', h:'<p>On the Oct 27 call management said the raised full-year guide (adjusted net revenue about <b>$5.04 billion</b>, from $4.75 billion to $4.85 billion) implies about <b>$1.375 billion</b> for the fourth quarter, up 36%. By segment: lending about <b>$785M</b>, financial services about <b>$550M</b>, technology platform about <b>$90M</b>, and corporate in line with the third quarter. The Street bar on file (<b>$1.31B</b>, GAAP total net revenue) is the Aug 3 Bloomberg snapshot, taken before the raise, so it is stale.</p>' },
        'Adjusted EBITDA':{ t:'Guided about $492M', h:'<p>Full-year adjusted EBITDA guidance moved to about <b>$1.66 billion</b> (about 33% margin) from about $1.6 billion. The call put the fourth quarter at about <b>$492M</b>, a margin near 36%. The Street bar on file is about $0.48B.</p>' },
        'Adjusted net income':{ t:'Guided about $276M, a 20% margin', h:'<p>Adjusted net income guidance of about <b>$840 million</b> (about 17% margin), from about $825 million; the fourth quarter implied by the CEO is about <b>$276M</b>. The CFO later cited about $270M when sizing organic capital creation. The tax rate assumption for the year stays at 22%.</p>' },
        'EPS (diluted)':{ t:'Guided about $0.19', h:'<p>Full-year adjusted EPS of about <b>$0.61</b> (from about $0.60) less <b>$0.43</b> reported through nine months leaves about <b>$0.18</b>; management stated <b>$0.19</b> on the call. The Street bar on file is about $0.19.</p>' }
      },
      us: ceSummitUs('4Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:null, call:null },

  // ── REPORTED: Q3 2026 (quarter ended Sep 30 2026; reported Oct 27 2026). Figures: 3Q26 earnings release and investor presentation.
  // Call transcript: docs/calls/SOFI-latest.md (verbatim, supplied by the analyst Oct 27 2026).
  // Street = the Bloomberg snapshot of Aug 3 2026 (the last before the print), read through CE_CONS above. Summit = the 2026-08-05
  // model file, frozen in js/results-data/sofi.js (its stored 3Q26 projection). SoFi gave no discrete 3Q26 guide (full year only, Jul 29 2026).
  { q:'Q3 2026', status:'reported', date:'October 27, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-08-03 · Summit DCF model — snapshot 2026-08-05, frozen · guidance: Q2 2026 call (Jul 29 2026), full year only',
      asOf:'2026-08-03',
      notes:{
        'Adjusted net revenue':{ t:'No discrete 3Q26 guide; FY26 adjusted revenue guided $4.75–4.85B', h:'<p>Full-year 2026 guidance on the Jul 29 call: adjusted net revenue of $4.75 billion to $4.85 billion, about 32% to 35% growth, raised from about 30%. Revenue on this grid is GAAP total net revenue, which differs from the adjusted measure SoFi guides (2Q26: GAAP $1,218.7M, adjusted $1,205.6M).</p>' },
        'Adjusted EBITDA':{ t:'FY26 guided at about $1.6B', h:'<p>The call kept adjusted EBITDA at about $1.6 billion for 2026, a margin of about 33% to 34%. Through 2Q26 the company had reported $697.7M, so the second half implies about $0.9B.</p>' },
        'Adjusted net income':{ t:'FY26 about $825M; EPS about $0.60 on a 22% tax rate', h:'<p>Adjusted net income of about $825 million (margin about 17%) and EPS of about $0.60. The EPS guide now carries a 22% tax rate, about 700 basis points above the original guide; at the original mid-teens rate it would have been $0.65.</p>' },
        'EPS (diluted)':{ t:'FY26 EPS about $0.60', h:'<p>EPS guidance of about $0.60 for 2026 includes a 22% tax rate (original guide: mid-teens).</p>' }
      },
      us: ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'Revenue, profit and volumes all cleared the Street, the full-year guide was raised and a 2027 outlook arrived well above the bar.',
      summary:{ paras:[
        { p:'<b>The quarter validates the balance-sheet model that the Street was still discounting.</b> Net interest income carried most of the upside, and personal loan volume cleared the bar by a wide margin while home loans and loan platform fees fell short of it. The mix leans further toward earning assets held on the balance sheet and away from fee income that depends on partner demand.' },
        { p:'<b>Profit followed revenue this time.</b> Adjusted EBITDA, adjusted net income and EPS all landed above the Street, with operating expense rising mainly through sales and marketing. The contrast with the second quarter, when management held the profit guide to fund new products, suggests the investment phase now has operating leverage behind it.' },
        { p:'<b>The 2027 outlook resets the forward debate.</b> Management introduced revenue, EBITDA, net income and EPS guidance for 2027 that it describes as well ahead of analyst estimates, with the tax rate assumption stepping up to 24%. The Street bar on file predates the guide, so the revisions that follow will be the first read on how much of it the market accepts.' },
        { p:'<b>Capital is no longer the constraint on the plan.</b> Management says the 2027 outlook is funded from excess capital and retained earnings with no raise, and sizes about $29B of unused risk-weighted asset capacity, which moves the debate from whether SoFi needs to raise to how fast it deploys.' },
        { p:'<b>Technology Platform is the weak segment in the mix.</b> Segment revenue declined year over year on the departure of a large client, and the 2030 targets of 100 million products and five businesses above $1 billion put the weight of the story on Financial Services and Lending.' },
        { p:'<b>Data note.</b> Credit card and commercial and consumer banking balances are not in the release; they stay blank until a post-print Bloomberg snapshot is on file. The Street series is the Aug 3 snapshot, before the print and before the guide.' }
      ] },
      notes:{
        'Revenue':{ t:'About 10% above the Street on the GAAP line', h:'<p>GAAP total net revenue of <b>$1,385.1M</b> (+44%) against a Street bar near <b>$1.26B</b> and a Summit projection of <b>$1,207M</b>. Adjusted net revenue was <b>$1,371.1M</b>. Fee-based revenue was $570.6M, 42% of the total. Lending adjusted net revenue was $807.4M, Financial Services $525.1M and Technology Platform $87.4M. SoFi gave no discrete third-quarter guide.</p>' },
        'Adjusted net revenue':{ t:'Up 44%, the basis SoFi guides on', h:'<p>Adjusted net revenue of <b>$1,371.1M</b> (+44%), which excludes $14.0M of fair-value gains on servicing rights and residual interests from the $1,385.1M GAAP figure. The fourth-quarter guide of about <b>$1.375B</b> (+36%) is on this basis. The Street and Summit series are the GAAP lines carried over.</p>' },
        'Net interest income':{ t:'The largest source of upside', h:'<p><b>$929.5M</b> (+59%) against a Street bar near $0.84B and Summit at $763M. Net interest margin was 6.14%, up 16 basis points on the quarter. Year over year, average interest-earning assets rose 51% and the cost of funds fell 38 basis points. Deposits grew $5.8B to $51.3B.</p>' },
        'Loan platform fees':{ t:'Below the Street', h:'<p><b>$151.2M</b> against a Street bar near $174M, down 8% year over year, on $3.8B of loans originated for third parties.</p>' },
        'Adjusted EBITDA':{ t:'About 5% above the Street, margin 34%', h:'<p><b>$469.8M</b>, up 70%, against a Street bar near $445M. The adjusted EBITDA margin was 34%, from 30% in the second quarter.</p>' },
        'Adjusted net income':{ t:'Above the Street', h:'<p><b>$243.0M</b> at an 18% margin against a Street bar near $231M. GAAP net income was $241.0M. It was the twelfth consecutive profitable quarter; return on tangible common equity was about 10%.</p>' },
        'EPS (diluted)':{ t:'A penny above the Street bar', h:'<p>Adjusted EPS of <b>$0.18</b> against a Street bar near $0.17. The effective tax rate was 24.2%, above the 19.9% in the Street series.</p>' },
        'Total members':{ t:'Record net additions of 1.2M', h:'<p>Members rose 35% to <b>17.1 million</b>, 1.3% above the Street bar, with a record 1.2 million added. Products rose 44% to 26.7 million with a record 2.2 million added; products per member reached about 1.56 and 51% of new products came from existing members.</p>' },
        'Personal loan originations':{ t:'Another record, 30% above the Street', h:'<p><b>$12.6B</b> against a Street bar near $9.7B. Total originations reached a record $16.9B, including about $3.8B for Loan Platform Business partners.</p>' },
        'Student loan originations':{ t:'Above the Street', h:'<p><b>$2.9B</b> against a Street bar near $2.7B, nearly double the year-ago quarter.</p>' },
        'Home loan originations':{ t:'Below the Street', h:'<p><b>$1.4B</b> against a Street bar near $1.5B, slightly below the second quarter.</p>' },
        'Sales and marketing':{ t:'Main driver of the expense overshoot', h:'<p><b>$444.0M</b> against a Street bar near $359M, up 55% year over year and from $392M in the second quarter.</p>' },
        'Noninterest expense':{ t:'Above the Street on marketing', h:'<p>Total noninterest expense of about <b>$1.05B</b> (provision excluded) against a Street bar near $0.95B. Sales and marketing explains most of the gap.</p>' },
        'Effective tax rate':{ t:'24.2% against a Street near 20%', h:'<p>Income tax expense of <b>$76.8M</b> on income before taxes of $317.8M. The full-year guide keeps a 22% rate for 2026 and assumes 24% for 2027.</p>' }
      },
      watch:{ 'Revenue':1, 'Net interest income':2, 'Personal loan originations':3, 'Adjusted EBITDA':4, 'Sales and marketing':5 },
      thesisCheck:[],
      intoCall:[],
      priceReaction:'Not on file: no price series for the post-print session was loaded into this build.'
    },
    call:{
      prepared:[
        { topic:'A new reporting lens: members, products per member, revenue per product', theme:'Members and products', body:'Anthony Noto says that at about $5B of revenue the business can be assessed from three drivers and that SoFi will report on them every quarter. Members rose to <b>17.1M (+35%)</b> with a record <b>1.2M</b> added; products to <b>26.7M (+44%)</b> with a record <b>2.2M</b> added; products per member to <b>1.56</b> from 1.54 and 1.47 a year ago. <b>51%</b> of new products came from existing members and <b>37%</b> of members use two or more products, from 33%. Revenue per product rose to about <b>$942</b> in lending (from $920) and <b>$90</b> in financial services (from $88). The Rule of 40 score was 79, the 20th consecutive quarter above it.' },
        { topic:'Results', theme:'Results', body:'Adjusted net revenue <b>$1.4B (+44%)</b>, adjusted EBITDA a record <b>$470M (34% margin)</b>, adjusted net income <b>$243M (18%)</b> and adjusted EPS <b>$0.18</b>, up 64% year over year and 50% sequentially. Fee-based revenue was <b>$571M, 42%</b> of the total, from 39% in the second quarter. Cash revenue was <b>$1.4B</b>, of which $927M net interest income, the fourth straight quarter above $1B. Tangible book value reached <b>$9.7B</b>, or $7.48 per share (+25%); return on tangible common equity was about 10%.' },
        { topic:'Guidance: 2026 raised, 2027 introduced a quarter early', theme:'Outlook', body:'FY2026: adjusted net revenue <b>$5.04B</b> (+40%, from $4.75B to $4.85B), adjusted EBITDA <b>$1.66B</b> (from $1.6B), adjusted net income <b>$840M</b> (from $825M), adjusted EPS <b>$0.61</b> (from $0.60). Implied 4Q26: revenue about <b>$1.375B (+36%)</b>, EBITDA <b>$492M</b>, net income <b>$276M</b>, EPS <b>$0.19</b>; by segment lending $785M, financial services $550M, technology platform $90M, corporate flat on the third quarter. FY2027: revenue <b>$6.4B (+27%)</b>, EBITDA <b>$2.24B (35%)</b>, net income <b>$1.28B (20%)</b>, EPS <b>$0.90</b>, on two assumed rate hikes and a 24% tax rate. Segment growth for 2027: lending +25%, financial services +35%, technology platform +25%, margins near today\u2019s. The original 2026 plan assumed two rate cuts; the year has had one hike and management is positioned for two more.' },
        { topic:'Capital and rate risk', theme:'Capital', body:'The total capital ratio was <b>17%</b>, down 180 basis points sequentially, against a 10.5% minimum, with management normalizing toward the low to mid-teens. Chris Lapointe says no capital raise is assumed or needed for 2027. Rate moves cost over <b>$800M</b> of fair value marks, offset by about <b>$734M</b> of hedge gains; marks closed at 103.3% on personal loans (down 140 basis points), 101.9% on student loans (down 240) and 101.5% on home loans (down 330), mostly a higher discount rate.' },
        { topic:'Lending and credit', theme:'Lending', body:'Lending adjusted net revenue <b>$807M</b>; net interest income <b>$670M (+57%)</b>; origination fees <b>$271M</b>, 2.6 times a year ago. Record originations of <b>$16.9B</b>: personal loans <b>$12.6B</b> (of which $9B for the balance sheet), student loans <b>$2.9B (+96%)</b>, home loans <b>$1.4B (+44%)</b>. The core personal loan product earned a risk-adjusted margin of about <b>7.6%</b> (coupon 12.8%, origination fee yield 1.4%, funding cost 3.1%, annualized losses 3.4%). All-in personal loan net charge-offs were <b>3.4%</b>, down 80 basis points year over year; 90-day delinquency 42 basis points. Student loan charge-offs were 63 basis points and delinquency 13 basis points.' },
        { topic:'Financial Services', theme:'Financial Services', body:'Segment net revenue <b>$525M (+25%)</b>; net interest income $281M (+38%) on member deposits, noninterest income $244M (+13%). Record interchange revenue of <b>$52M (+77%)</b> on $31B of annualized spend, brokerage revenue <b>$18M (+47%)</b>, and credit card revenue almost doubled from the second quarter. Deposits grew $5.8B to <b>$51.3B</b>; net interest margin was <b>6.14%</b>, up 16 basis points. Money and Relay each passed 8M products, Invest 4M, credit card about 656,000, Crypto over 500,000 and SoFi Plus about 275,000.' },
        { topic:'Loan Platform Business', theme:'Loan Platform Business', body:'LPB originations were <b>$3.8B</b>, up $704M on the quarter, and LPB revenue <b>$153M</b>, from $143M. SoFi transferred its first small business and home equity loans through the platform. Lapointe cautions that monetization depends on asset mix, supply and demand and the timing of new partnerships, and will fluctuate.' },
        { topic:'Technology Platform and the 2030 ambition', theme:'Technology Platform', body:'Technology Platform revenue was <b>$87M</b>, down 24% on the release basis (the CFO said 20%) on the departure of a large client, and up <b>18%</b> excluding it; nine clients were added this year and management sees a return to 25% growth. Noto sets a goal of <b>100M products by the end of 2030</b>, with five businesses above $1B of revenue, five above $500M and five above $100M, and says SoFi already has eight businesses above $100M of annualized revenue.' }
      ],
      qanda:[
        { q:'Target market and priority of SMB lending', analyst:'John Hecht · Jefferies', theme:'Small business', qFull:'SMB lending is a relatively new category with momentum and strategic focus. What is the target market and borrower profile, and how should we think about its priority into 2027?', a:'<b>Anthony Noto:</b> It is a nascent business that grew from five years of lead referrals, started with PPP demand from members who owned small businesses. It reached the scale in 2025 for SoFi to become a principal in 2026, with checking and savings to follow. It is not one of the eight businesses above $100M of revenue. Borrowers are high-repeat customers, so the focus is relationships and unit economics first, then expansion on a steady line.' },
        { q:'Segment contributions to the 2027 outlook', analyst:'Kyle Joseph · Stephens', theme:'Guidance', qFull:'Can you walk through the high-level assumptions for each segment in the 2027 outlook?', a:'<b>Anthony Noto:</b> Guiding a year ahead reflects visibility, not a change in confidence. SoFi accelerated investment in the startup businesses outside the Great Eight at the end of 2025 and needed revenue to cover it; $1.4B of cash revenue in the quarter funds both investment and profit. 2027 net income margin of 20% sits at the low end of the long-term range and EBITDA margin in the middle.<br><b>Chris Lapointe:</b> Lending grows 25%, technology platform returns to 25% and financial services grows 35%, with segment margins generally in line with today.' },
        { q:'Revenue per product and the size of the opportunity', analyst:'Andrew Jeffrey · William Blair', theme:'Members and products', qFull:'Where does revenue per user go over the next several years, and is this a roughly $30B opportunity?', a:'<b>Anthony Noto:</b> The metric is revenue per product, not per user. Upside is largest in Invest (revenue is well below benchmarks relative to assets), credit card (effective interest rate rising as balances grow without costly zero-balance-transfer offers), SoFi Money (deposits per account) and SMB. LPB monetization will be range bound and lending revenue per product is stable. Blended revenue per product will probably fall from 2026 to 2030 because lower-revenue financial services products grow faster, which total revenue more than offsets; products go to 100M and members toward two products each.' },
        { q:'Funding 2027 growth organically', analyst:'Dan Dolev · Mizuho', theme:'Capital', qFull:'Can you expand on the ability to fund 2027 growth organically?', a:'<b>Chris Lapointe:</b> Two levers. About $9.6B of equity capital supports about $71B of risk-weighted assets at a 13.5% ratio, $15B above today\u2019s $56B. Earnings of about $270M in the fourth quarter and $1.28B in 2027, plus stock-based compensation, add roughly $14B more. Together about $29B of capacity is neither planned nor required for the 2027 guidance.' },
        { q:'Sensitivity of the model to lower rates', analyst:'Devin Ryan · Citizens', theme:'Interest rates', qFull:'If rates shift lower, is that still a tailwind to the model, or are there offsets?', a:'<b>Anthony Noto:</b> In the last rise SoFi slowed growth; this year, with more capital and a more diversified business, it tested growth in a higher-rate environment, raised the coupon to hold unit economics and hedged. Revenue growth of 44% through volatile rates is the evidence. Lower rates favor home loans, a low-capital agency business, though they add less earnings visibility than personal and student loans. The outlook holds if rates stay, rise or fall.' },
        { q:'Reconciling segment growth with the 2027 guide', analyst:'Patrick Moley · Piper Sandler', theme:'Guidance', qFull:'Applying the 2027 segment growth rates to the 4Q26 segment guide gives about $6.7B, roughly $300M above the guide. Is the gap the corporate line or conservatism?', a:'<b>Chris Lapointe:</b> A slight uptick in the corporate line is the direct answer.' },
        { q:'Loan Platform demand from existing and new partners', analyst:'Kyle Peterson · Needham', theme:'Loan Platform Business', qFull:'What does demand look like for the Loan Platform Business from existing and potential new partners?', a:'<b>Chris Lapointe:</b> Demand is robust across all asset types. Two new partners signed in the quarter with others in discussion; BasePoint ($3B of SMB loans over three years) is in place and the first closed-end seconds were issued through the platform. Fourth-quarter originations are pacing ahead of the $3.8B of the third and take rates are strong.' },
        { q:'Third-party versus internal growth in Technology Platform', analyst:'Lance Jessurun · Scotiabank', theme:'Technology Platform', qFull:'How much of the 25% Technology Platform growth next year comes from third-party clients versus SoFi\u2019s own products, and how do the nine new clients ramp?', a:'<b>Anthony Noto:</b> He does not manage the business that way and cannot quote the internal SoFi revenue figure. The platform (issuer processing, a cloud core, payments and fraud and risk) is built for SoFi and sold to others, and the bank must negotiate arm\u2019s-length rates with SoFi Tech Solutions as a regulated entity. Management has an obligation to quantify that value.' },
        { q:'Personal loan origination growth in 2027', analyst:'Moshe Orenbuch · TD Cowen', theme:'Lending', qFull:'Investors push back on the pace of personal loan origination growth. What is the 2027 forecast?', a:'<b>Chris Lapointe:</b> Momentum continues, but 2027 growth comes more from home loans and student loan refinancing, so personal loan originations will not grow at the same magnitude. The risk-adjusted margin on personal loans is above 7.5%, up over 100 basis points year over year on origination fees (up 2.5 times) and lower losses.' },
        { q:'Personal loan pricing and origination fees', analyst:'Will Nance · Goldman Sachs', theme:'Lending', qFull:'Weighted average coupons have ticked down. How has pricing evolved, and how much is made up by origination fees?', a:'<b>Chris Lapointe:</b> Origination fees are now a core pricing lever: more than 50% of new personal loan originations carry one and fee revenue was about $270M (2.5 times a year ago, up 36% sequentially). Coupon plus fee yield was flat on the quarter. Borrowers paying a fee prepay 600 to 700 basis points faster and default 40 to 50 basis points less, worth 200 to 300 basis points of ROE.' },
        { q:'Deposit mix and funding cost', analyst:'Don Fandetti · Wells Fargo', theme:'Deposits and net interest margin', qFull:'How confident are you in growing checking relative to online savings and lowering funding costs?', a:'<b>Anthony Noto:</b> Deposit rates are a member acquisition tool that replaces branches and outbound calls; SoFi Money leads to cross-buy and data on members. Brokered deposits are actually cheaper than SoFi Money deposits and will be used in a mix, managed to overall return. He sees AI agents that compare rates as a tailwind because SoFi\u2019s lifetime value allows the best rates.<br><b>Chris Lapointe:</b> Funding tools include member deposits, brokered CDs, warehouses, securitizations and whole loan sales; wholesale use rises in volatile rate periods, with member deposits remaining 80% to 90% of funding.' },
        { q:'SoFi Plus growth and the 1M target', analyst:'Reggie Smith · Loop Capital', theme:'SoFi Plus', qFull:'SoFi Plus added fewer members this quarter. What happened, and is the 1M target by the end of next year still on?', a:'<b>Anthony Noto:</b> The target stands and he is pushing the team to reach it earlier. Third-quarter growth fell short because offers had to be changed after bad actors signed up; that is fixed and growth is re-accelerating in the fourth quarter. SoFi Plus will keep adding value (higher APY, transfer matches, card rewards, free subscription cancellation, Composer portfolios). 85% of members are existing members and 25% add another product.' },
        { q:'Mix between the Loan Platform and the balance sheet', analyst:'Craig Maurer · FT Partners', theme:'Loan Platform Business', qFull:'How do you intend to shape the mix between LPB and the balance sheet?', a:'<b>Chris Lapointe:</b> There is no predetermined split. Originations go where risk-adjusted returns and revenue durability are best, and the strong capital position allows retaining more loans. Both the balance sheet and LPB should grow, with the mix set by capital allocation, market conditions and partner demand.' },
        { q:'Durability of the moat and where 2030 lands on mix and returns', analyst:'Gus Gala · MCH', theme:'Strategy', qFull:'How has the moat changed as more banks and fintechs add products, and does 2030 reach the 50% fee mix and 20% to 30% returns?', a:'<b>Anthony Noto:</b> The moat is the highest lifetime value, built from superior unit economics on every product plus more products per member than anyone else, which funds better rates and services. SoFi is indifferent to the first product a member uses.<br><b>Chris Lapointe:</b> ROTCE is about 10%; 2027 net income margin is 20% with a 32% incremental margin, heading to 30% or more. Revenue to equity is about 57%, from 55% and 50% in the prior quarters, and rises with fee-based revenue.' }
      ],
      take:'The quarter turned the investment year into a funded plan: a raised 2026 guide, a 2027 outlook issued early, and a statement that no capital is needed, with management asking the market to track members, products per member and revenue per product.',
      highlights:[],
      dots:'Three threads ran through the call: the <b>new lens</b> (members, products per member, revenue per product, reported every quarter), the <b>funded plan</b> (2027 guide with no raise, $29B of unused risk-weighted asset capacity, 17% capital ratio) and <b>rates as a non-issue</b> (hedges offset the move in marks; guide assumes two hikes).',
      threeMinutes:[
        '<b>Guidance moved on every line.</b> 2026 raised, 2027 introduced a quarter early at $6.4B revenue and $0.90 EPS, 4Q26 implied at about $1.375B.',
        '<b>Capital stopped being the question.</b> No raise needed, about $29B of risk-weighted asset capacity unused.',
        '<b>The mix is shifting.</b> 2027 growth comes from home and student loans and financial services, not personal loans, and revenue per product is expected to drift down as mix changes.'
      ],
      notBringing:[
        { item:'The Street series for 4Q26 and 1Q27', why:'The newest Bloomberg snapshot on file is Aug 3 2026, before the raise and the 2027 guide, so a comparison would measure the age of the data.' },
        { item:'Technology Platform decline rate', why:'The release shows down 24% year over year while the CFO said 20% on the call; the release figure is used.' }
      ],
      newQuestions:[
        { n:'Does 4Q26 land at the guided $1.375B of revenue and $492M of EBITDA, and how much of it is segment mix?', landed:{ q:'Q4 2026', rank:1 }, tripped:false },
        { n:'Does SoFi Plus re-accelerate toward 1M subscribers after the third-quarter shortfall?', landed:{ q:'Q4 2026', rank:2 }, tripped:false },
        { n:'Do the first SMB and home equity loans move through the Loan Platform at scale, and does LPB revenue hold near $150M?', landed:{ q:'Q4 2026', rank:3 }, tripped:false },
        { n:'How fast does the total capital ratio move from 17% toward the low to mid-teens?', landed:{ q:'Q4 2026', rank:4 }, tripped:false }
      ]
    } },

  // ── REPORTED: Q2 2026 (quarter ended Jun 30 2026; reported Jul 29 2026). Call transcript: docs/calls/SOFI.md (verbatim).
  // Street = the Bloomberg snapshot of May 4 2026 (the last before the print), read through CE_CONS above. Summit = the 2026-08-05
  // model file, frozen in js/results-data/sofi.js (its stored 2Q26 projection). Guidance = the Q1 2026 call (Apr 29 2026).
  // The reported figures are the 10-Q / call figures; the Summit model carries $1,197M of 2Q26 revenue, $21.7M below the filing.
  { q:'Q2 2026', status:'reported', date:'July 29, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-05-04 (the last before the print) · Summit DCF model — snapshot 2026-08-05, frozen (its stored 2Q26 projection) · guidance: Q1 2026 call (Apr 29 2026)',
      asOf:'2026-05-04',
      notes:{
        'Adjusted net revenue':{ t:'Guided about $1.115B adjusted; the Street sat above it', h:'<p>For the second quarter management guided adjusted net revenue growth of about 30%, roughly <b>$1.115 billion</b>. The Street on file was near <b>$1.13B</b> on the GAAP total net revenue line, which differs from the adjusted measure SoFi guides.</p>' },
        'Adjusted EBITDA':{ t:'Guided about $330M, a 30% margin', h:'<p>Guide: an adjusted EBITDA margin of about 30%, roughly <b>$330 million</b>. The Street on file was near $0.35B.</p>' },
        'Adjusted net income':{ t:'Guided a 12% to 13% margin', h:'<p>Guide: adjusted net income margin of about 12% to 13%, which management tied to roughly $0.10 to $0.11 of EPS. The company said payroll taxes and accelerated marketing in the first half would weigh on profit before the second half.</p>' },
        'EPS (diluted)':{ t:'Guided $0.10 to $0.11; the Street was at $0.12', h:'<p>The guided EPS range sat below the Street bar of about $0.12, so a result at the Street figure already needed a beat against the company guide.</p>' }
      },
      us:ceSummitUs('2Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'Revenue and originations beat by a wide margin, profit per share landed on the bar, and management chose to spend the upside rather than raise the EBITDA guide.',
      summary:{ paras:[
        { p:'<b>The beat came from balance-sheet lending, and it is the kind of revenue management describes as visible.</b> Total net revenue and personal and student loan originations came in far above what the Street modeled, driven by loans held on the balance sheet and by record origination fees.' },
        { p:'<b>Profit did not follow revenue by design.</b> Adjusted EBITDA landed slightly above the Street while adjusted net income and EPS matched or trailed it, and management declined to raise the EBITDA guide, saying incremental revenue is being put into new growth areas such as small business loans, crypto, SoFiUSD and SoFi Plus.' },
        { p:'<b>The full-year guide moved on revenue and on the tax rate only.</b> Adjusted net revenue guidance rose to a range that implies faster growth than the earlier guide, while the EPS guide now carries a 22% tax rate that lowers it relative to the original rate.' },
        { p:'<b>Capital is the variable to watch.</b> The total risk-based capital ratio fell as the balance sheet grew, and management says the plan is funded without a raise, with the ratio settling in the low to mid-teens over time.' },
        { p:'<b>Data note.</b> The Summit model carries $1,197M of 2Q26 revenue, $21.7M below the filing; the figures above are the reported ones.' }
      ] },
      notes:{
        'Revenue':{ t:'About 8% above the Street on the GAAP line', h:'<p>GAAP total net revenue of <b>$1,218.7M</b> against a Street bar near <b>$1.13B</b>. Adjusted net revenue was <b>$1,205.6M</b> against the guide of about $1.115B. Fee-based revenue was $472M, 39% of the total. Lending segment adjusted net revenue was $712M, Financial Services $466M and Technology Platform $85M. The Summit model had <b>$1,123M</b>.</p>' },
        'Adjusted EBITDA':{ t:'Above the guide, margin 30%', h:'<p><b>$357.8M</b>, up 44% year over year, against a guide of about $330M and a Street bar near $0.35B. The incremental adjusted EBITDA margin was 31%.</p>' },
        'Adjusted net income':{ t:'Below the Street on a higher tax rate', h:'<p><b>$160.4M</b> at a 13% margin against a Street bar near $0.17B. Management attributes roughly half a cent of EPS to a higher-than-expected tax rate. GAAP net income was $156.6M.</p>' },
        'EPS (diluted)':{ t:'In line with the Street, above the guide', h:'<p>Adjusted EPS of <b>$0.12</b>, the Street figure and above the $0.10 to $0.11 guide. It was the eleventh consecutive profitable quarter.</p>' },
        'Total members':{ t:'Record net additions of 1.1M', h:'<p>Members rose 35% to <b>15.8 million</b> and products 42% to 24.4 million, with record net product additions of 2.2 million. Cross-buy reached 51% of new products from existing members, from 43% in the prior quarter and 35% a year earlier. Non-lending products are 87% of the total.</p>' },
        'Personal loan originations':{ t:'First $10B quarter', h:'<p>Record <b>$10.7B</b> against a Street bar near $8.5B, of which $7.6B went on SoFi’s balance sheet and $3.1B was originated for Loan Platform Business partners. The core personal loan product earned a risk-adjusted margin of about 6.1% (coupon 12.9%, funding cost 3.1%, annualized losses 3.7%).</p>' },
        'Student loan originations':{ t:'Record, 2.7 times a year ago', h:'<p><b>$2.7B</b> against a Street bar near $1.7B, a record.</p>' },
        'Home loan originations':{ t:'Record, a third from home equity', h:'<p><b>$1.4B</b>, up 74%, against a Street bar near $1.3B. Home equity lines and home equity loans were about a third of the total while purchase and refinance activity stayed muted.</p>' },
        'Noninterest expense':{ t:'Above the Street as marketing and new products ramp', h:'<p>Total noninterest expense of about <b>$1.0B</b> (provision excluded) against a Street bar near $0.91B. The first quarter call had flagged accelerated marketing and product investment in the first half of the year.</p>' }
      },
      watch:{ 'Revenue':1, 'Total members':2, 'Personal loan originations':3, 'Adjusted EBITDA':4, 'EPS (diluted)':5 },
      thesisCheck:[],
      intoCall:[
        'Capital: does the total risk-based capital ratio, 18.8% at quarter end, keep falling toward the low to mid-teens, and does the plan still avoid a raise?',
        'Loan Platform Business: do the new SMB and home equity partners (BasePoint $3B over three years, Sixth Street up to $1B in personal loans) add volume in the third quarter?',
        'Operating leverage: when does the EBITDA margin, held near 30%, start to widen as the business matures?',
        'Rates: the guide now assumes one to two rate hikes in 2026. What does the third quarter show for net interest margin, 5.98% in the second?'
      ],
      priceReaction:'Not on file: no price series for the post-print session was loaded into this build.'
    },
    call:{
      prepared:[
        { topic:'Members and products reach an inflection point', theme:'Members and products', body:'Record <b>1.1M</b> new members took the base to <b>15.8M (+35%)</b>; record <b>2.2M</b> new products took the total to <b>24.4M (+42%)</b>, the first time products added were twice members added. Cross-buy reached <b>51%</b> of new products from existing members. Anthony Noto describes products per member as accelerating over the last two quarters.' },
        { topic:'SoFi Plus relaunch and SoFi Coach', theme:'Members and products', body:'SoFi Plus moved to a paid subscription at the start of the quarter and passed <b>200,000</b> paid subscribers, 85% of them existing members, 25% of whom added another product. Noto says he would be disappointed if there were not one million subscribers and $120M of annual revenue a year from now. SoFi Coach launched in June with nearly half a million conversations and over 90% positive feedback.' },
        { topic:'Revenue, EBITDA and tangible book value', theme:'Results', body:'Adjusted net revenue grew <b>40%</b> to <b>$1.2B</b>, with cash revenue above $1B for the third straight quarter. Adjusted EBITDA was <b>$358M (30% margin)</b>, adjusted net income <b>$160M (13%)</b> and adjusted EPS <b>$0.12</b>, with a tax rate that cost about half a cent. Tangible book value reached <b>$9.5B</b>, or $7.34 per share.' },
        { topic:'Financial Services', theme:'Financial Services', body:'Segment net revenue <b>$466M (+29%)</b>, contribution profit <b>$213M</b> (46% margin). Record interchange revenue (+67%) on more than $28B of annualized spend, and brokerage revenue up 2.4 times. Credit card revenue more than doubled and the back book reached profitability.' },
        { topic:'Loan Platform Business widens its menu', theme:'Loan Platform Business', body:'LPB revenue was <b>$143M</b> on $3.1B of personal loans originated for partners. New agreements: Sixth Street for up to $1B of personal loans, BasePoint Capital for $3B of small business loans over three years, and home equity loans to a global bank. Two securitizations of LPB loans totaled $1.37B at spreads of 91 and 86 basis points, the best ever.' },
        { topic:'Lending and credit', theme:'Lending', body:'Lending adjusted net revenue <b>$712M (+59%)</b> with a 55% contribution margin; net interest income <b>$573M (+54%)</b>. Personal loan net charge-offs excluding delinquent-loan sales were <b>3.7%</b>, down 70 basis points; the 90-day delinquency rate was 40 basis points. Net interest margin was <b>5.98%</b> and deposits <b>$45.5B</b>.' },
        { topic:'Technology Platform and new businesses', theme:'Technology Platform', body:'Technology Platform net revenue <b>$85M</b>, contribution profit $12M (14% margin). SoFi began moving SoFi Money to its own cloud-native banking core, closed the Peach Finance acquisition, and launched big business banking on the SoFi Exchange Network with SoFiUSD settlement. Small business loans and a home equity line of credit were launched.' },
        { topic:'Outlook and capital', theme:'Outlook', body:'Full-year adjusted net revenue guide raised to <b>$4.75B to $4.85B</b> (about 32% to 35% growth); adjusted EBITDA about <b>$1.6B</b> and adjusted net income about <b>$825M</b> held; EPS about <b>$0.60</b> on a 22% tax rate (about $0.65 at the original rate). The plan assumes one to two rate hikes in 2026. Total capital ratio <b>18.8%</b> against a 10.5% minimum; management expects the low to mid-teens over time.' }
      ],
      qanda:[
        { q:'Capacity and economics of the new Loan Platform asset types', analyst:'Devin Ryan · Citizens', theme:'Loan Platform Business', qFull:'How much capacity do the new SMB and home equity categories have, how fast can SoFi build volume into them, and how should the fee economics compare with personal loans?', a:'<b>Chris Lapointe:</b> The SMB partnerships are BasePoint ($3B over three years) and a second undisclosed party for several hundred million dollars; home equity lines follow within days. The partnerships are in the range of $100M to $200M a month, with economics similar to or slightly better than today.<br><b>Anthony Noto:</b> The goal is a menu of asset types so investors can pick their risk and return, and most SMB lenders charge rates above 30% that SoFi can undercut.' },
        { q:'Members versus monetization after the cross-buy inflection', analyst:'Andrew Jeffrey · William Blair', theme:'Members and products', qFull:'Is it time to focus on monetization at the margin instead of member growth, or do both metrics keep rising?', a:'<b>Anthony Noto:</b> Both. Products per member improved in the first and second quarters and should keep improving, with more than 7 million Money members and 6 million Relay members feeding Invest, Credit Card, SMB and loans at near-zero acquisition cost. Growth will come from members, products per member and revenue per product.' },
        { q:'Competition and customer acquisition cost', analyst:'John Hecht · Jefferies', theme:'Competition', qFull:'What is the competitive environment, and how are customer acquisition costs and channels trending?', a:'<b>Anthony Noto:</b> Competition outside lending is benign and acquisition costs are stable while members grow 35%. Big banks do not offer personal loans, student loan refinancing has no real competitor, and a large share of home and personal loans are cross-bought without acquisition cost.' },
        { q:'Why the EBITDA guide was not raised', analyst:'Dan Dolev · Mizuho', theme:'Guidance', qFull:'The results were strong. Why did the company not raise EBITDA guidance?', a:'<b>Chris Lapointe:</b> Revenue guidance rose $100M to $200M; the company leans into attractive growth areas instead of adding profit. <b>Anthony Noto:</b> The company does not want to over-optimize EPS or EBITDA against bigger opportunities, and the investment is going to new products (SMB, SoFiUSD, Crypto, SoFi Plus) rather than higher costs of existing ones. With no rate hikes there would probably be upside to the bottom line.' },
        { q:'Personal loan volume SoFi chooses not to fill', analyst:'Kyle Peterson · Needham', theme:'Loan Platform Business', qFull:'Partner demand exceeds what SoFi fills on personal loans. Should that continue, and do HELOC and SMB affect the decision?', a:'<b>Chris Lapointe:</b> SoFi meets all contractual commitments and is happy with personal loan volume in the program; the growth comes from the other asset types. The company is self-funded through the guidance period and the medium-term plan and expects to stay within its target capital range without raising capital.' },
        { q:'Cross-buy with the new commercial products', analyst:'Peter Christensen · Citi', theme:'Members and products', qFull:'How do the more commercial products fit the cross-buy flywheel?', a:'<b>Anthony Noto:</b> Members typically enter through Relay or Money and then add Invest, Credit Card or loans; SMB comes from the many members who run small businesses. Big business banking was built because crypto marketplaces asked SoFi to be their bank, and it creates demand for SoFiUSD (settlement of the crypto business now, Mastercard settlement in coming weeks).' },
        { q:'Who adopts SoFi Plus and what it does to engagement', analyst:'Will Nance · Goldman Sachs', theme:'SoFi Plus', qFull:'What is the profile of SoFi Plus adopters and what has changed in wallet share and engagement?', a:'<b>Anthony Noto:</b> Of 206,000 subscribers, 85% were existing members; a quarter added another product, mostly Invest. Existing Money members who took Plus showed higher deposits, assets under management and spending, and the Q1 2021 Money cohort added about one product per member in the quarter.' },
        { q:'Pace of spending down excess capital', analyst:'Matt Cote · Truist', theme:'Capital', qFull:'How fast will the excess capital be spent down as the balance sheet grows?', a:'<b>Anthony Noto:</b> Growing the balance sheet in the first half gives strong visibility into 2027 net interest income, with loans on balance sheet as the stable base and the Loan Platform Business layered on top.<br><b>Chris Lapointe:</b> The total capital ratio, the binding constraint, ended at 18.8% against a 10.5% limit; low to mid-teens is the long-term level, and the plan does not require a raise.' }
      ],
      take:'The quarter showed balance-sheet lending and cross-buy compounding together, with management choosing reinvestment over a higher profit guide and capital as the next constraint.',
      highlights:[],
      dots:'Three threads ran through the call: the <b>flywheel</b> (cross-buy at 51% of new products, SoFi Plus and Coach), the <b>balance sheet</b> (net interest income as the visible base, capital falling toward the low to mid-teens) and the <b>choice to invest</b> (EBITDA guide held, revenue guide raised).',
      threeMinutes:[
        '<b>Revenue and volumes beat widely; profit did not.</b> GAAP revenue about 8% above the Street, record originations, EPS on the bar.',
        '<b>Management reinvests the upside.</b> Revenue guide raised, EBITDA guide held, EPS guide cut by the tax rate.',
        '<b>Capital is the next question.</b> 18.8% total capital ratio against a low to mid-teens target, no raise planned.'
      ],
      notBringing:[
        { item:'The Summit model’s 2Q26 revenue', why:'The model carries $1,197M for the quarter, $21.7M below the filing; scoring a surprise against it would mix a data gap with a forecast miss.' }
      ],
      newQuestions:[
        { n:'Does the total capital ratio keep falling toward the low to mid-teens without a raise?', landed:{ q:'Q3 2026', rank:1 }, tripped:false },
        { n:'Do the new Loan Platform asset types (SMB, home equity) add measurable volume?', landed:{ q:'Q3 2026', rank:2 }, tripped:false },
        { n:'When does the EBITDA margin start to widen from about 30%?', landed:{ q:'Q3 2026', rank:3 }, tripped:false }
      ]
    } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 31 2026; reported Apr 29 2026). Call transcript: docs/calls/SOFI.md (verbatim).
  // Street = the Bloomberg snapshot of Feb 4 2026 (the last before the print). Summit = the 2026-08-05 model file, frozen in
  // js/results-data/sofi.js. Guidance = the Q4 2025 call (Jan 30 2026), as captured in the earlier profile.
  { q:'Q1 2026', status:'reported', date:'April 29, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-02-04 (the last before the print) · Summit DCF model — snapshot 2026-08-05, frozen (its stored 1Q26 projection) · guidance: Q4 2025 call (Jan 30 2026)',
      asOf:'2026-02-04',
      notes:{
        'Adjusted net revenue':{ t:'Guided about $1.04B adjusted; the Street sat above it', h:'<p>The first-quarter guide was adjusted net revenue of about <b>$1.04 billion</b>. The Street on file was near <b>$1.06B</b> on the GAAP total net revenue line, which differs from the adjusted measure SoFi guides.</p>' },
        'Adjusted EBITDA':{ t:'Guided about $300M', h:'<p>Guide: adjusted EBITDA of about <b>$300 million</b>. The Street on file was near $0.32B.</p>' },
        'Adjusted net income':{ t:'Guided about $160M', h:'<p>Guide: adjusted net income of about <b>$160 million</b>. The Street on file was near $0.16B.</p>' },
        'EPS (diluted)':{ t:'Guided $0.12, the Street at $0.12', h:'<p>Guide and Street were both at about <b>$0.12</b>, so any beat had to come from revenue and costs rather than from the bar.</p>' }
      },
      us:ceSummitUs('1Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'Every loan product set a record, revenue and profit beat the Street, and management introduced cash revenue as the lens on quality.',
      summary:{ paras:[
        { p:'<b>Lending volume and fee revenue grew together.</b> Personal, student and home loan originations all set records and revenue came in above the Street, with management choosing how much to put on the balance sheet and how much to route through the Loan Platform Business.' },
        { p:'<b>Profit beat at the EBITDA and net income lines while EPS matched the bar.</b> A lower discrete tax benefit cost about a cent of EPS.' },
        { p:'<b>Management disclosed cash revenue for the first time.</b> It reported that cash revenue exceeded adjusted net revenue in 2024 and 2025, to answer questions about non-cash premiums on loans held at fair value.' },
        { p:'<b>The next-quarter guide carried lower margins by design.</b> Management cited first-half payroll taxes and accelerated marketing, with the spend aimed at the second half and beyond.' },
        { p:'<b>Two accounting questions took analyst time.</b> Capitalized member-acquisition commissions and a loan sale to a vehicle held by JPMorgan; management stated that the amortized marketing cost is expensed against revenue and lowers EBITDA.' }
      ] },
      notes:{
        'Revenue':{ t:'About 4% above the Street on the GAAP line', h:'<p>GAAP total net revenue of <b>$1,100.4M</b> against a Street bar near <b>$1.06B</b>; adjusted net revenue was <b>$1,087.2M</b> against the guide of about $1.04B. Lending adjusted net revenue was $629M, Financial Services $429M (+41%) and Technology Platform $75M, which fell because a large client exited before year end.</p>' },
        'Adjusted EBITDA':{ t:'About 6% above the Street, margin 31%', h:'<p><b>$339.9M</b>, up 62%, against a guide of about $300M and a Street bar near $0.32B. The incremental margin was 41%.</p>' },
        'Adjusted net income':{ t:'Above the Street and the guide', h:'<p><b>$166.7M</b> at a 15% margin against a guide of about $160M. It was the tenth consecutive profitable quarter.</p>' },
        'EPS (diluted)':{ t:'In line with the Street', h:'<p>EPS of <b>$0.12</b>, or $0.13 on a constant stock price basis, with a decrease in discrete tax benefits costing about one cent.</p>' },
        'Total members':{ t:'Record 1.1M net adds', h:'<p>Members reached <b>14.7 million</b> (+35%), up more than twenty times from 650,000 in 2018. A record 1.8 million products were added for a total of 22.2 million (+39%), with 43% of new products opened by existing members.</p>' },
        'Personal loan originations':{ t:'Record $8.3B', h:'<p><b>$8.3B</b> against a Street bar near $7.6B: about $5.4B for the balance sheet and about $3B through the Loan Platform Business. Management chose to channel more to the balance sheet because of strong capital ratios, so platform volume fell from the fourth quarter, although it was up 90% year over year.</p>' },
        'Student loan originations':{ t:'Record, 2.2 times a year ago', h:'<p><b>$2.6B</b> against a Street bar near $1.6B, the highest in the company history.</p>' },
        'Home loan originations':{ t:'Record, more than double', h:'<p><b>$1.2B</b>, more than double a year earlier, against a Street bar near $1.0B. Origination records were set for four straight quarters.</p>' },
        'Noninterest expense':{ t:'Slightly above the Street', h:'<p>Total noninterest expense of about <b>$0.89B</b> against a Street bar near $0.85B. Accelerated first-half marketing was flagged in the guide.</p>' }
      },
      watch:{ 'Revenue':1, 'Personal loan originations':2, 'Total members':3, 'Adjusted EBITDA':4, 'EPS (diluted)':5 },
      thesisCheck:[],
      intoCall:[
        'Balance sheet versus platform: how much of personal loan volume does SoFi keep, given a 21% total capital ratio?',
        'Loan Platform demand: do partners keep buying above their contractual levels, and what new asset types come on?',
        'Operating leverage: do margins widen in the second half after the guided first-half investment?',
        'Technology Platform: how does revenue stabilize after the exit of a large client?'
      ],
      priceReaction:'Not on file: no price series for the post-print session was loaded into this build.'
    },
    call:{
      prepared:[
        { topic:'Rule of 40 and the first cash revenue disclosure', theme:'Results', body:'The 18th consecutive quarter above the Rule of 40, with a score of <b>72</b> (41% revenue growth plus a 31% EBITDA margin). Cash revenue exceeded <b>$1B</b> for the second straight quarter (about $690M from net interest income and $390M from fees) and was more than 100% of adjusted net revenue in both 2024 and 2025.' },
        { topic:'Members and products', theme:'Members and products', body:'Members reached <b>14.7M</b>, up more than twenty times since 2018, with a record <b>1.8M</b> products added for <b>22.2M (+39%)</b>. Cross-buy reached <b>43%</b> of new products from existing members, from 40% the prior quarter and 36% a year earlier.' },
        { topic:'Lending and the balance sheet versus platform choice', theme:'Lending', body:'Lending adjusted net revenue <b>$629M</b>; record originations of <b>$12.2B</b> ($9.2B for the lending segment, $3B through the Loan Platform Business). Personal loans <b>$8.3B</b>, student <b>$2.6B</b>, home <b>$1.2B</b>. Noto frames platform volume as the volume SoFi would not otherwise keep because of capital ratios, balance sheet growth and borrower credit profile.' },
        { topic:'Financial Services and Technology Platform', theme:'Segments', body:'Financial Services net revenue <b>$429M (+41%)</b>, contribution margin 46%. Technology Platform net revenue <b>$75M</b>, reduced by the exit of a large client before year end, with a 16% contribution margin. The company plans a unified brand, SoFi Technology Solutions, across four platform businesses: processing, banking core, payment hub and fraud and identity.' },
        { topic:'Profit and tangible book value', theme:'Results', body:'Adjusted EBITDA <b>$340M (+62%)</b> at a 31% margin and a 41% incremental margin; net income <b>$167M</b> at a 15% margin; EPS <b>$0.12</b>. Tangible book value reached <b>$9.2B</b>, or <b>$7.21</b> per share (+57%).' },
        { topic:'Crypto, SoFiUSD and SoFi Plus', theme:'New products', body:'SoFiUSD, the first stablecoin from a national bank on a public blockchain, began minting, with a Mastercard settlement partnership; big business banking for crypto and fiat clients is in build. SoFi Plus relaunched on April 1 as a paid subscription ($10 a month, a 4.5% APY on up to $20,000, a 1% investing match).' },
        { topic:'Credit, capital and the second-quarter guide', theme:'Outlook', body:'Personal loan net charge-offs excluding delinquent-loan sales were <b>4.4%</b>, flat on the quarter; the 90-day delinquency rate was 47 basis points. Net interest margin <b>5.94%</b>, deposits <b>$40.2B</b>, total capital ratio <b>21%</b>. Second-quarter guide: adjusted net revenue about <b>$1.115B</b>, adjusted EBITDA margin about 30% (<b>$330M</b>), adjusted net income margin 12% to 13% (EPS $0.10 to $0.11); the full-year guide of about 30% growth and $0.60 of EPS stands.' }
      ],
      qanda:[
        { q:'How much to keep on the balance sheet versus the Loan Platform', analyst:'Andrew Jeffrey · William Blair', theme:'Loan Platform Business', qFull:'How does SoFi decide how much personal loan volume to hold versus sell through the platform, when platform sales would add fee income?', a:'<b>Anthony Noto:</b> Held loans require capital and carry credit risk but produce a revenue stream that lasts; platform loans pay cash up front and remove credit risk. Platform volume is the volume the company would not otherwise do for its balance sheet because of capital ratios, growth or borrower credit. He sees no private-credit concerns in demand, which exceeds contractual obligations.' },
        { q:'Segment-level guidance', analyst:'Dan Dolev · Mizuho', theme:'Guidance', qFull:'Can you give color on segment-level guidance?', a:'<b>Chris Lapointe:</b> The company expects about 30% top-line growth and $0.60 of EPS in 2026. Financial Services adjusted net revenue growth of at least 40% is still expected, and corporate revenue should match 2025; segments may run faster or slower in any period as capital shifts to the best opportunities.' },
        { q:'Capitalized marketing costs and the JPMorgan loan sale', analyst:'Kyle Joseph · Stephens', theme:'Accounting', qFull:'What is the accounting and rationale for capitalizing marketing expenses and the effect on EPS and EBITDA, and how should the JPMorgan facility be read as a loan sale versus a borrowing?', a:'<b>Chris Lapointe:</b> Success-based commissions paid to third parties for acquiring Money and Invest members are treated as contract acquisition costs under ASC 340-40 and amortized over expected member life; lending and credit card acquisition is not included. In September 2024 a senior secured loan was sold through a special purpose entity in which JPMorgan held the controlling interest.<br><b>Anthony Noto:</b> The amortized marketing cost is subtracted from revenue and lowers EBITDA; it is not excluded.' },
        { q:'Depth of third-party demand for platform loans', analyst:'Devin Ryan · Citizens JMP', theme:'Loan Platform Business', qFull:'How deep is demand from third-party capital providers and where is the interest, and how did it evolve through the quarter?', a:'<b>Chris Lapointe:</b> Demand remains very robust and broad across asset managers, insurance funds and investment banks; partners including Blue Owl and Fortress buy at their contractual levels and in several quarters above. Partners cite a flight to quality, especially on re-securitizations.<br><b>Anthony Noto:</b> Personal, student refinancing and home loan originations all set records, with home and student loans more than doubling.' },
        { q:'Member channels and characteristics', analyst:'John Hecht · Jefferies', theme:'Members and products', qFull:'Which channels are the record member additions coming from, and have new-member characteristics changed?', a:'<b>Anthony Noto:</b> Characteristics are in line with history. Lending leans on direct mail and affiliates, Money on broad digital marketing, and debit interchange and crypto launches are adding to the non-interest cash revenue base.' }
      ],
      take:'The quarter paired record volumes across all three loan products with a new cash-revenue disclosure, while management kept margins lower in the guide to fund growth.',
      highlights:[],
      dots:'Three threads ran through the call: the <b>mix choice</b> between balance sheet and platform, <b>revenue quality</b> (cash revenue disclosed for the first time) and the <b>investment plan</b> (first-half marketing and product spend).',
      threeMinutes:[
        '<b>Volumes and revenue beat the Street.</b> Records in personal, student and home loans; EBITDA and net income above the bar, EPS in line.',
        '<b>Cash revenue is the quality argument.</b> More than 100% of adjusted net revenue was cash in 2024 and 2025.',
        '<b>Guide margins dip for investment.</b> Second-quarter EBITDA margin about 30%, the year held at 30% growth and $0.60.'
      ],
      notBringing:[
        { item:'The Technology Platform decline', why:'The segment fell because one large client exited before year end, so a read on platform demand needs the base without that client.' }
      ],
      newQuestions:[
        { n:'Do margins widen in the second half after the first-half investment?', landed:{ q:'Q2 2026', rank:3 }, tripped:true },
        { n:'Does the capital ratio stay on a path to the low to mid-teens?', landed:{ q:'Q2 2026', rank:1 }, tripped:true }
      ]
    } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 31 2025; reported Jan 30 2026). Call transcript: docs/calls/SOFI.md (verbatim).
  // Street = the Bloomberg snapshot of Nov 2 2025 (the last before the print). Summit = the 2026-08-05 model file, frozen in
  // js/results-data/sofi.js. SoFi gave no discrete 4Q25 guide; the implied Q4 below is derived from the last full-year guide.
  { q:'Q4 2025', status:'reported', date:'January 30, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2025-11-02 (the last before the print) · Summit DCF model — snapshot 2026-08-05, frozen (its stored 4Q25 projection) · guidance: Q3 2025 call full-year update (no discrete 4Q25 guide)',
      asOf:'2025-11-02',
      notes:{
        'Adjusted net revenue':{ t:'No discrete guide; the full-year guide implied about $0.96B adjusted', h:'<p>The last full-year guide for 2025 was adjusted net revenue of about <b>$3.54 billion</b>. Against the first three quarters reported (about $2.58B adjusted) that implies roughly <b>$0.96B</b> for the fourth quarter (derived here). The Street on file was near <b>$0.99B</b> on the GAAP total net revenue line.</p>' },
        'Adjusted EBITDA':{ t:'Full-year guide implied about $0.30B', h:'<p>The full-year guide of about <b>$1.035 billion</b> against about $736M reported through three quarters implies roughly <b>$0.30B</b> for the fourth (derived here). The Street on file was near $0.31B.</p>' },
        'Adjusted net income':{ t:'Full-year guide implied about $0.15B', h:'<p>The full-year guide of about <b>$455 million</b> against about $308M through three quarters implies roughly <b>$0.15B</b> (derived here). The Street on file was near $0.14B.</p>' },
        'EPS (diluted)':{ t:'Street at $0.12', h:'<p>The Street bar was about <b>$0.12</b>; SoFi gave no quarterly EPS guide for the fourth quarter.</p>' }
      },
      us:ceSummitUs('4Q25'),
      debate:{ rows:null, synth:'' }
    },
    results:{
      headline:'A record year closed with the first billion-dollar revenue quarter, and management paired it with a 2026 and medium-term outlook that set the next set of bars.',
      summary:{ paras:[
        { p:'<b>The year ended with scale in revenue and in profit.</b> Fourth-quarter revenue and adjusted net income came in above the Street, and total originations passed $10B in a quarter for the first time.' },
        { p:'<b>The outlook carried the weight of the print.</b> Management guided 2026 growth of about 30%, a medium-term plan of at least 30% annual revenue growth and 38% to 42% annual EPS growth through 2028, and segment targets for Financial Services, Lending and Technology Platform.' },
        { p:'<b>The Technology Platform fall is a contract event rather than demand.</b> Revenue from a large client ended with its contract in the fourth quarter, and the 2026 outlook assumes none from that client.' },
        { p:'<b>Capital had room.</b> The total risk-based capital ratio was about 23% against a 10.5% minimum, which supports growing the balance sheet.' },
        { p:'<b>The Loan Platform Business is now a structural part of the model.</b> Fourth-quarter platform originations of $3.7B ran at about $14.5B annualized, and partners had extended their contracts.' }
      ] },
      notes:{
        'Revenue':{ t:'About 4% above the Street on the GAAP line', h:'<p>GAAP total net revenue of <b>$1,025.1M</b> against a Street bar near <b>$0.99B</b>; adjusted net revenue was <b>$1,012.8M</b>, the first quarter above $1B. Financial Services net revenue was $457M (+78%), Lending $486M (+15%) and Technology Platform $122M (+19%). The Summit model had <b>$1,010M</b>.</p>' },
        'Adjusted EBITDA':{ t:'Slightly above the Street, margin 31%', h:'<p><b>$317.6M</b>, up 60%, against a Street bar near $0.31B and the implied full-year guide of about $0.30B.</p>' },
        'Adjusted net income':{ t:'About 21% above the Street', h:'<p><b>$173.5M</b> at a 17% margin against a Street bar near $0.14B. It was the ninth consecutive profitable quarter; net income for 2025 was $481M.</p>' },
        'EPS (diluted)':{ t:'A cent above the Street', h:'<p>EPS of <b>$0.13</b> against a Street bar near $0.12.</p>' },
        'Total members':{ t:'First quarter above 1M net adds', h:'<p>Members rose 35% to <b>13.7 million</b> after a record 1.0 million additions. Rule of 40 score was 68.</p>' },
        'Personal loan originations':{ t:'In line with the Street, at a record', h:'<p><b>$7.5B</b> against a Street bar near $7.6B, with platform originations of $3.7B alongside, for total originations of a record $10.5B and over $36B for 2025.</p>' },
        'Student loan originations':{ t:'Above the Street', h:'<p><b>$1.9B</b>, up 38%, against a Street bar near $1.5B.</p>' },
        'Home loan originations':{ t:'Near double a year ago, above the Street', h:'<p><b>$1.1B</b>, nearly double the prior year and a record, against a Street bar near $0.9B.</p>' },
        'Noninterest expense':{ t:'Slightly above the Street', h:'<p>Total noninterest expense of about <b>$0.83B</b> against a Street bar near $0.80B.</p>' }
      },
      watch:{ 'Revenue':1, 'Adjusted net income':2, 'Total members':3, 'Personal loan originations':4, 'Adjusted EBITDA':5 },
      thesisCheck:[],
      intoCall:[
        'Guide delivery: does first-quarter revenue come in above the guided $1.04B adjusted?',
        'Balance sheet mix: how much of personal loan volume stays on the balance sheet as capital ratios stay above 20%?',
        'Technology Platform: what is the run-rate after the large client exit?',
        'Cash revenue: how do net interest income and fees split in the next quarter?'
      ],
      priceReaction:'Not on file: no price series for the post-print session was loaded into this build.'
    },
    call:{
      prepared:[
        { topic:'A record year and quarter', theme:'Results', body:'Fourth-quarter adjusted net revenue passed <b>$1B</b> for the first time (+37%); adjusted EBITDA was <b>$318M</b> (+60%, 31% margin), net income <b>$174M</b> (17% margin) and EPS <b>$0.13</b>. For 2025: adjusted net revenue <b>$3.6B (+38%)</b>, adjusted EBITDA <b>$1.1B (+58%, 29% margin)</b>, net income <b>$481M</b>. Rule of 40 score of 68 for the quarter.' },
        { topic:'Members, products and fee revenue', theme:'Members and products', body:'A record <b>1.0M</b> members were added, the first time above one million in a quarter, for <b>13.7M (+35%)</b>, more than twenty times the 650,000 of 2018. Unaided brand awareness reached a record 9.6%. Fee-based revenue ran at about <b>$1.8B</b> annualized, from under $1.2B a year earlier.' },
        { topic:'Originations and the Loan Platform Business', theme:'Loan Platform Business', body:'Total originations reached a record <b>$10.5B</b>, the first quarter above $10B, including <b>$3.7B</b> from the Loan Platform Business; over $36B for the year. Student loans <b>$1.9B (+38%)</b> and home loans a record <b>$1.1B</b>, nearly double. A securitization priced at a spread of 101 basis points.' },
        { topic:'Financial Services, Lending and Technology Platform', theme:'Segments', body:'Financial Services net revenue <b>$457M (+78%)</b>, contribution margin 51%, with platform revenue of $194M in the quarter. Lending adjusted net revenue <b>$486M (+15%)</b>, margin 54%. Technology Platform net revenue <b>$122M (+19%)</b>, over $450M for the year. Interchange rose 66% on close to $22B of annualized spend.' },
        { topic:'Crypto, SoFiUSD and new products', theme:'New products', body:'SoFi Pay (international payments on blockchain rails) was launched in October in over 30 countries; SoFiUSD launched in December as the first stablecoin issued by a national bank on a public permissionless blockchain. Business banking for crypto and fiat clients starts in 2026, and a Smart Card was built in four and a half months on the technology platform.' },
        { topic:'Credit and capital', theme:'Credit and capital', body:'The rise in the balance sheet personal loan charge-off rate was driven by mix, as more loans went through the platform and the held book aged; management calls underlying credit strong. Total capital ratio <b>22.9%</b> against a 10.5% minimum; tangible book value <b>$8.9B</b>, or <b>$7.01</b> per share (+57%).' },
        { topic:'2026 and medium-term outlook', theme:'Outlook', body:'2026: revenue growth of about <b>30%</b>, adjusted EBITDA about <b>$1.6B</b>, adjusted net income about <b>$825M</b> (18% margin) and EPS about <b>$0.60</b> on a mid-teens tax rate. First quarter: adjusted net revenue about <b>$1.04B</b>, EBITDA about <b>$300M</b>, net income about <b>$160M</b>. Medium term: at least 30% revenue CAGR and 38% to 42% EPS CAGR from 2025 to 2028.' }
      ],
      qanda:[
        { q:'Segment detail behind the consolidated guide', analyst:'First question of the Q&A', theme:'Guidance', qFull:'Can the consolidated guidance be broken out by segment?', a:'<b>Chris Lapointe:</b> Revenue growth of roughly 30% in 2026; Financial Services 40% or more; Lending about 23%; Technology Platform about 20% normalized for the large client exit; corporate revenue in line with 2025 in dollars. Medium term: at least 30% annual growth and 38% to 42% EPS growth through 2028, with acceleration in 2027 and 2028 in crypto, brokerage, home and student loans.' },
        { q:'Loan Platform Business allocation', analyst:'Dan Dolev · Mizuho', theme:'Loan Platform Business', qFull:'How should originations be allocated to the Loan Platform Business versus the balance sheet?', a:'<b>Chris Lapointe:</b> Demand was robust in every asset class in 2025 and remains so, and the company has more flexibility than ever. SoFi is not guiding to platform volumes; the fourth quarter ran at $3.65B, about $14.5B annualized, a level the company is comfortable with, and existing partners have extended their contracts.' },
        { q:'Crypto, stablecoin and demand for the technology platform', analyst:'Analyst question', theme:'Technology Platform', qFull:'Could the crypto, stablecoin and Smart Card innovation lift interest and adoption among technology platform clients?', a:'<b>Anthony Noto:</b> A year ago there was no interest in blockchain, stablecoins or wallets among platform partners; since the OCC permitted crypto activity at banks, interest has risen meaningfully, with nothing to announce yet. He expects activity in Latin America first, spilling over to the U.S. and to international companies, and sees the CLARITY Act as important.' },
        { q:'Baseline and termination fee for the large client', analyst:'Analyst question', theme:'Technology Platform', qFull:'What baseline should be used for the pro forma Technology Platform growth, and was the termination fee recognized this quarter?', a:'<b>Anthony Noto:</b> The 20% growth is apples to apples without the large client in both years and the outlook assumes no 2026 revenue from it. The contract ended and its revenue ended in the fourth quarter, recognized at a level equal to the average of the previous six quarters.' },
        { q:'Return on equity and investment', analyst:'Analyst question', theme:'Returns', qFull:'Has the long-term return-on-equity ambition of 20% to 30% changed, given the progress on ROTCE?', a:'<b>Anthony Noto:</b> The target stays at 20% to 30%; the company will not under-invest while growing above 30%. It will keep running at about a 30% incremental EBITDA margin and keeps at least thirty cents of each incremental dollar for the bottom line.' },
        { q:'Capital allocation and M&A', analyst:'Analyst question', theme:'Capital', qFull:'How is capital allocation being thought of, including M&A?', a:'<b>Chris Lapointe:</b> The total capital ratio of about 23% is more than 1,000 basis points above the minimum, so the company can grow the balance sheet with good-returning assets and platform partnerships.<br><b>Anthony Noto:</b> So far it is all organic; an acquisition would come only if it appeared at the right price versus building it.' }
      ],
      take:'The quarter closed a record year and set a medium-term plan that pairs 30% revenue growth with 38% to 42% EPS growth, with the Loan Platform Business and capital cushion as the support.',
      highlights:[],
      dots:'Three threads ran through the call: the <b>outlook</b> (2026 and medium term set the bars), the <b>mix</b> (balance sheet versus platform, with capital room) and the <b>platform reset</b> (a large client exit and a crypto-driven demand story).',
      threeMinutes:[
        '<b>Record year, first billion-dollar quarter.</b> Revenue and adjusted net income above the Street; originations above $10B.',
        '<b>A multi-year plan was set.</b> At least 30% revenue CAGR and 38% to 42% EPS CAGR through 2028.',
        '<b>Technology Platform resets lower.</b> A large client exited; guidance assumes about 20% growth without it.'
      ],
      notBringing:[
        { item:'The Technology Platform quarterly revenue', why:'Fourth-quarter revenue included the recognition tied to the ended contract, so it is not a run-rate for 2026.' }
      ],
      newQuestions:[
        { n:'Does first-quarter revenue come in above the guided $1.04B?', landed:{ q:'Q1 2026', rank:1 }, tripped:true },
        { n:'How much of personal loan volume is kept on the balance sheet?', landed:{ q:'Q1 2026', rank:2 }, tripped:true }
      ]
    } }
] };
