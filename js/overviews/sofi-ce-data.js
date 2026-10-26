// overviews/sofi-ce-data.js — the DATA behind SoFi's Evolution ▸ Earnings (the rendering is ./sofi-ce.js).
//
//   SOFI_CE_CONS — the estimate grid and "The print" cards, rebuilt at load from js/results-data/sofi.js (actuals,
//     Bloomberg consensus and the estMatrix vintages; BBG_CONSENSUS.txt snapshots May 2022 → Oct 26 2026).
//   SOFI_CALL_EARNINGS — per quarter, newest first: setup (notes per line), results and the call. Transcripts:
//     docs/calls/SOFI.md (verbatim, Q4 2023 → Q2 2026, supplied by the analyst; Quartr is not used).
//
// Values are $B (the file is $M), members in millions, EPS in $. Guidance is SoFi's own (8-K Ex. 99.1 and the calls).

import { sofiResults } from '../results-data/sofi.js';

export var SOFI_CE_CONS = {
  src: 'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf: [],
  q: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: [
    { k:'Revenue',                    u:'$B', t:'ok', code:'CB_IS_NET_REVENUE' },
    { k:'Total members',              u:'M',  t:'ok', code:'NUM_ACTIVE_ACCOUNTS' },
    { k:'Personal loan originations', u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Student loan originations',  u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Home loan originations',     u:'$B', t:'ok', code:'LOAN_PRODUCTION_ORIGINAL' },
    { k:'Noninterest expense',        u:'$B', t:'ok', code:'IS_OPERATING_EXPN' },
    { k:'Stock-based compensation',   u:'$B', t:'ok', code:'CF_STOCK_BASED_COMPENSATION' },
    { k:'Adjusted EBITDA',            u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA' },
    { k:'Adjusted net income',        u:'$B', t:'ok', code:'IS_COMP_NET_INCOME_ADJUST_OLD' },
    { k:'EPS (diluted)',              u:'$',  t:'ok', code:'IS_COMP_EPS_ADJUSTED_OLD' }
  ]
};

(function(){
  var M = sofiResults.views.q.metrics, MX = sofiResults.estMatrix && sofiResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q = SOFI_CE_CONS.q, QP = Q.map(pOf);
  // Round the way the archive prints: $B to 0.01 (0.1 from $10B up), EPS and members to 0.01.
  function rnd(v,u){ if(v==null) return null; var d=((u==='$B'&&Math.abs(v)>=10)||u==='%')?10:100; return Math.round(v*d)/d; }
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
  var RS = { 'Revenue':['rev',1000], 'Total members':['members',1000], 'Personal loan originations':['plov',1000],
             'Student loan originations':['slov',1000], 'Home loan originations':['hlov',1000], 'Noninterest expense':['nie',1000],
             'Stock-based compensation':['sbc',1000], 'Adjusted EBITDA':['ebitda',1000], 'Adjusted net income':['earnings',1000], 'EPS (diluted)':['eps',1] };
  SOFI_CE_CONS.m.forEach(function(m){ var s=RS[m.k]; if(s) fromResults(m, s[0], s[1]); });
  var nv = MX && MX.vintages[MX.vintages.length-1];
  SOFI_CE_CONS.asOf = MX ? MX.vintages.map(function(v){ return v.id; }) : [];
  SOFI_CE_CONS.src = 'Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/sofi.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+')';
})();

// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset, where the model is frozen at its dated snapshot
// (rule 10), never typed. Only the lines the model projects by quarter; the rest stay "—". The model has no EPS row.
function ceSummitUs(p){
  var M = sofiResults.views.q.metrics, out = {};
  [['Revenue','rev',1000],['Total members','members',1000],['Personal loan originations','plov',1000],['Student loan originations','slov',1000],
   ['Home loan originations','hlov',1000],['Noninterest expense','nie',1000],['Stock-based compensation','sbc',1000],
   ['Adjusted EBITDA','ebitda',1000],['Adjusted net income','earnings',1000]].forEach(function(x){
    var r=M[x[1]], i=r?r.periods.indexOf(p):-1, v=(i>=0&&r.summit)?r.summit[i]:null;
    if(v!=null){ v=v/x[2]; out[x[0]]={ v:Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*100)/100 }; } });
  return out;
}

export var SOFI_CALL_EARNINGS = { ticker:'SOFI', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ended Sep 30 2026). Consensus = the Bloomberg snapshot of Oct 26 2026 (last reported quarter
  // 2Q26, so its fq+1 is this quarter). Summit = the 2026-08-05 snapshot, frozen in js/results-data/sofi.js. Guidance: SoFi
  // gave full-year 2026 guidance on the Jul 29 2026 call (adjusted net revenue $4.75–4.85B, adjusted EBITDA about $1.6B,
  // adjusted net income about $825M, EPS about $0.60) and no discrete 3Q26 guide.
  { q:'Q3 2026', status:'upcoming', date:'quarter ended Sep 30 2026 (not yet reported in the call file)',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-10-26 · Summit DCF model — snapshot 2026-08-05, frozen · guidance: Q2 2026 call (Jul 29 2026), full year only',
      asOf:'2026-10-26',
      notes:{
        'Revenue':{ t:'No discrete 3Q26 guide; FY26 adjusted revenue guided $4.75–4.85B', h:'<p>Full-year 2026 guidance on the Jul 29 call: adjusted net revenue of $4.75 billion to $4.85 billion, about 32% to 35% growth, raised from about 30%. Revenue on this grid is GAAP total net revenue, which differs from the adjusted measure SoFi guides (2Q26: GAAP $1,218.7M, adjusted $1,205.6M).</p>' },
        'Adjusted EBITDA':{ t:'FY26 guided at about $1.6B', h:'<p>The call kept adjusted EBITDA at about $1.6 billion for 2026, a margin of about 33% to 34%. Through 2Q26 the company had reported $697.7M, so the second half implies about $0.9B.</p>' },
        'Adjusted net income':{ t:'FY26 about $825M; EPS about $0.60 on a 22% tax rate', h:'<p>Adjusted net income of about $825 million (margin about 17%) and EPS of about $0.60. The EPS guide now carries a 22% tax rate, about 700 basis points above the original guide; at the original mid-teens rate it would have been $0.65.</p>' },
        'EPS (diluted)':{ t:'FY26 EPS about $0.60', h:'<p>EPS guidance of about $0.60 for 2026 includes a 22% tax rate (original guide: mid-teens).</p>' }
      },
      us: ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'' }
    },
    results:null, call:null },

  // ── REPORTED: Q2 2026 (quarter ended Jun 30 2026; reported Jul 29 2026). Call transcript: docs/calls/SOFI.md (verbatim).
  // Street = the Bloomberg snapshot of May 4 2026 (the last before the print), read through CE_CONS above. Summit = the 2026-08-05
  // model file, frozen in js/results-data/sofi.js (its stored 2Q26 projection). Guidance = the Q1 2026 call (Apr 29 2026).
  // The reported figures are the 10-Q / call figures; the Summit model carries $1,197M of 2Q26 revenue, $21.7M below the filing.
  { q:'Q2 2026', status:'reported', date:'July 29, 2026',
    setup:{
      source:'Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-05-04 (the last before the print) · Summit DCF model — snapshot 2026-08-05, frozen (its stored 2Q26 projection) · guidance: Q1 2026 call (Apr 29 2026)',
      asOf:'2026-05-04',
      notes:{
        'Revenue':{ t:'Guided about $1.115B adjusted; the Street sat above it', h:'<p>For the second quarter management guided adjusted net revenue growth of about 30%, roughly <b>$1.115 billion</b>. The Street on file was near <b>$1.13B</b> on the GAAP total net revenue line, which differs from the adjusted measure SoFi guides.</p>' },
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
    } }
] };
