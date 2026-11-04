// overviews/tpl-ce-data.js — the DATA behind Texas Pacific Land's Evolution ▸ Earnings (the rendering is ./tpl-ce.js).
//
//   TPL_CE_CONS — the estimate list and "The print" cards, BUILT AT LOAD from js/results-data/tpl.js (actuals from TPL's
//     releases; Bloomberg consensus from its estMatrix, Consensus_Portal.xlsm, 23 snapshots May 2021 → Nov 3 2026). Nothing is
//     typed: each line is [name, unit, results key, divisor] in TPL_LINES, and its revision matrix qr = [4q, 3q, 2q, 1q out]
//     is read from the snapshot whose last reported quarter sits that many quarters before (the newest such snapshot wins).
//     Bloomberg carries quarterly consensus for total revenues, operating income, Adjusted EBITDA, net income, diluted EPS,
//     DD&A and free cash flow only; the segment and revenue lines, the volumes and capex are actuals with "no est.".
//   TPL_CALL_EARNINGS — per quarter, newest first: setup (one note per line: what TPL said about it for that quarter, named
//     source), results (one note per line from the release) and the call.
//
// No Summit model exists for TPL, so there is no `setup.us` anywhere and the Earnings pane offers the Street only.
// TPL gives no guidance (TPL_GUIDED is empty), so every Setup note says what the last release said, not a guide.
// Calls: Q2 2026, Q1 2026 and Q4 2025 carry `call` (prepared remarks, analyst Q&A, proposed notes, also on the call) from
// the call transcripts on stockanalysis.com ("Texas Pacific Land (TPL) Qn YYYY Earnings Call Transcript", data source Quartr),
// read in the analyst's browser on Nov 4 2026 and copied in docs/calls/TPL-latest.md (Q2 2026) and docs/calls/TPL.md (Q1 2026,
// Q4 2025). TPL posts no transcript on its IR site. Quotes word for word, script-checked against that text. Q3 2026 (call
// Nov 5 2026) and older quarters: `call` is null; never reconstructed.
//
// Money in US$ millions; EPS and $/Boe in dollars; royalty production in thousand Boe per day; water volumes in thousand
// barrels per day. Capex is positive spend.

import { tplResults } from '../results-data/tpl.js';

// Every line, in the order the print reads down the income statement is set in tpl-ce.js (CE_STMT_ORDER). HEADLINE first.
var TPL_LINES = [
  ['Total revenues', '$M', 'rev', 1], ['Operating income', '$M', 'opinc', 1], ['Adjusted EBITDA', '$M', 'adjebitda', 1],
  ['EPS (diluted)', '$', 'eps', 1], ['Capex', '$M', 'capex', 1], ['DD&A', '$M', 'da', 1],
  ['Royalty production', 'MBoe/d', 'boed', 1000], ['Realized price per Boe', '$', 'pboe', 1],
  ['Water sales volume', 'MBbl/d', 'wsd', 1], ['Produced water volume', 'MBbl/d', 'pwrd', 1],
  ['Land & Resource Mgmt revenue', '$M', 'rev_lrm', 1], ['Water Services & Ops revenue', '$M', 'rev_wso', 1],
  ['Oil & gas royalties', '$M', 'og', 1], ['Water sales', '$M', 'ws', 1], ['Produced water royalties', '$M', 'pwr', 1],
  ['Easements & surface', '$M', 'ease', 1], ['Land sales', '$M', 'land', 1],
  ['LRM op. income', '$M', 'lrmop', 1], ['WSO op. income', '$M', 'wsoop', 1],
  ['Net income', '$M', 'netinc', 1], ['Free cash flow', '$M', 'fcf', 1]
];
var NHEAD = 6;

// TPL guides no line.
export var TPL_GUIDED = [];

export var TPL_CE_CONS = {
  src: 'Bloomberg (BST) · Consensus_Portal.xlsm snapshot archive',
  asOf: [],
  q: ['Q1 2022','Q2 2022','Q3 2022','Q4 2022','Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024',
      'Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027','Q3 2027'],
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: NHEAD,
  m: TPL_LINES.map(function(L){ return { k: L[0], u: L[1], t: 'ok' }; })
};

(function(){
  var M = tplResults.views.q.metrics, MX = tplResults.estMatrix && tplResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q = TPL_CE_CONS.q, QP = Q.map(pOf);
  // Round the way the release prints: $M and thousand-Boe/d to 0.1, $ to 0.01, water volumes to whole thousand barrels.
  function rnd(v,u){ if(v==null) return null; var d=(u==='$')?100:((u==='MBbl/d')?1:10); return Math.round(v*d)/d; }
  function fromResults(m, key, scale){
    var r=M[key]; if(!r) return m;
    function at(arr,p){ var i=r.periods.indexOf(p); return (i<0||!arr||arr[i]==null)?null:arr[i]/scale; }
    m.qa=QP.map(function(p){ return rnd(at(r.act,p), m.u); });
    var rows=MX&&MX.q&&MX.q[key];
    m.qr=QP.map(function(p){
      var row=[null,null,null,null], op=ord(p);
      if(rows) MX.vintages.forEach(function(v){   // oldest → newest, so the newest snapshot at each horizon wins
        var h=op-ord(v.lastActual.q); if(h<1||h>4) return;
        var x=rows[v.id]&&rows[v.id][p]; if(x!=null) row[4-h]=rnd(x/scale, m.u); });
      return row; });
    // No 1q-out value (the second quarter out, or a snapshot that skipped the line): the newest earlier file stands in, as the
    // Results engine's pre-print read does (the latest snapshot before the print that carries the line).
    m.qr.forEach(function(row,i){ if(row[3]!=null) return;
      for(var h=2; h>=0; h--){ if(row[h]!=null){ row[3]=row[h]; break; } } });
    m.qy=Q.map(function(q,i){ return i>=4?m.qa[i-4]:null; }); m.qq=Q.map(function(q,i){ return i>=1?m.qa[i-1]:null; });
    var anyA=m.qa.some(function(v){ return v!=null; }), anyC=m.qr.some(function(r){ return r.some(function(v){ return v!=null; }); });
    m.t = (anyA&&!anyC)?'nocons':((anyC&&!anyA)?'noact':'ok');
    return m; }
  var RS = {}; TPL_LINES.forEach(function(L){ RS[L[0]] = [L[2], L[3]]; });
  TPL_CE_CONS.m.forEach(function(m){ var s=RS[m.k]; if(s) fromResults(m, s[0], s[1]); });
  var nv = MX && MX.vintages[MX.vintages.length-1];
  TPL_CE_CONS.asOf = MX ? MX.vintages.map(function(v){ return v.id; }) : [];
  TPL_CE_CONS.src = 'Bloomberg (BST) · Consensus_Portal.xlsm — via js/results-data/tpl.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+')';
})();

var NO_GUIDE = 'TPL gives no guidance';
var CALL_PENDING = 'call transcript not on file (no verbatim source could be read)';

// ── Q4 2026 — UPCOMING. Street = the newest snapshot on file (Nov 3 2026, taken before the 3Q26 print: its 4Q26 value is
// the two-quarters-out estimate). Notes: what TPL said for the quarter in its 3Q26 release (Nov 4 2026); the call is Nov 5.
var Q4_NOTES = {
  'Total revenues':{ t:NO_GUIDE+'; 3Q26 was a record $273.4M', h:'<p>TPL does not guide revenue. 3Q26 release: record revenue of $273.4M, and royalty revenue is “directly impacted by commodity prices and development and operating decisions made by its customers”. The Street figure is from the Nov 3 2026 snapshot, taken before the 3Q26 print.</p>' },
  'Royalty production':{ t:'16.8 net wells in the pipeline at Sep 30', h:'<p>At Sep 30 2026 TPL’s royalty acreage had 5.7 net permits, 8.6 net DUCs and 2.5 net CUPs (16.8 net wells, from 18.4 at Jun 30) and 132.5 net producing wells (3Q26 release). '+NO_GUIDE+'.</p>' },
  'Realized price per Boe':{ t:'Unhedged; $44.97 in 3Q26', h:'<p>TPL does not hedge, so the quarter’s oil, gas and NGL prices pass straight through. 3Q26 realized $44.97/Boe against $42.17 in 2Q26 (3Q26 release).</p>' },
  'Water sales':{ t:'3Q26 fell on lower pricing', h:'<p>3Q26 water sales fell $11.3M QoQ to $28.4M on lower realized pricing, partly offset by higher volumes (3Q26 release). '+NO_GUIDE+'.</p>' },
  'Easements & surface':{ t:'Lumpy; 3Q26 lifted by pipeline easements', h:'<p>3Q26 easements and other surface income rose $12.5M QoQ to $36.2M as “operators expanded development of midstream infrastructure” (3Q26 release).</p>' },
  'DD&A':{ t:'Up $6.2M QoQ in 3Q26', h:'<p>DD&amp;A was $22.8M in 3Q26 against $16.6M in 2Q26 (3Q26 release); depletion follows the royalty interests TPL has bought.</p>' },
  'EPS (diluted)':{ t:NO_GUIDE, h:'<p>3Q26 diluted EPS $2.42 (3Q26 release). Quarterly dividend held at $0.60, payable Dec 15 2026.</p>' }
};
var Q4_SRC = 'Bloomberg (BST) — Consensus_Portal.xlsm, snapshot 2026-11-03 (newest on file, the day before the 3Q26 print) · no Summit model for TPL · notes: TPL 3Q26 release (8-K of Nov 4 2026, acc. 0001811074-26-000075); TPL gives no guidance';

// ── Q3 2026 — REPORTED Nov 4 2026 after close (release 4:15pm ET); call Thu Nov 5 2026, 9:30am CT.
// Setup = the Nov 3 2026 snapshot (the last before the print) and what TPL had said in its 2Q26 release and 10-Q.
var Q3_NOTES = {
  'Total revenues':{ t:NO_GUIDE+'; 2Q26 was a record $246.1M', h:'<p>TPL does not guide. 2Q26 release: record revenue of $246.1M, up on oil and gas royalties (+$27.4M QoQ), easements (+$6.3M) and produced water royalties (+$3.5M).</p>' },
  'Royalty production':{ t:'18.4 net wells in the pipeline at Jun 30', h:'<p>At Jun 30 2026: 5.6 net permits, 9.5 net DUCs and 3.4 net CUPs (18.4 net wells) and 131.9 net producing wells; 2Q26 production a record 39.7K Boe/d (2Q26 release).</p>' },
  'Realized price per Boe':{ t:'Unhedged; oil above $90 Mar–Jun', h:'<p>The 2Q26 10-Q: global oil prices rose to over $90/bbl from March through early June on the conflict in Iran, “with continued volatility in July”; TPL’s unhedged position “allowed us to capture the full upside” (2Q26 release). 2Q26 realized $42.17/Boe.</p>' },
  'Water sales':{ t:'2Q26 volumes fell to 663K bbl/d', h:'<p>2Q26 water sales fell $7.1M QoQ on lower volumes, partly offset by higher pricing (2Q26 release). '+NO_GUIDE+'.</p>' },
  'Produced water royalties':{ t:'Record 4.9M bbl/d in 2Q26', h:'<p>Record produced water royalties of $37.1M on 4.9M bbl/d in 2Q26 (2Q26 release).</p>' },
  'Land sales':{ t:'None in 2Q26; 1Q26 held a $20.9M sale', h:'<p>Land sales are one-off. 1Q26 recognized $20.9M of a $42.5M seller-financed sale to a power-plant developer; 2Q26 had none (releases).</p>' },
  'Capex':{ t:'Desalination plant built; commissioning', h:'<p>Phase 2B in Orla complete and commissioning; $55.8M spent on desalination to Jun 30 ($48.1M capitalized) and $18.2M on water sourcing assets in 1H26 (2Q26 10-Q).</p>' },
  'DD&A':{ t:'+$2.6M QoQ in 2Q26', h:'<p>DD&amp;A rose $2.6M QoQ in 2Q26 to $16.6M (2Q26 release).</p>' }
};
var Q3_SRC = 'Bloomberg (BST) — Consensus_Portal.xlsm, snapshot 2026-11-03 (the day before the print) · no Summit model for TPL · notes: TPL 2Q26 release (Aug 5 2026) and 2Q26 10-Q; TPL gives no guidance';
// One note per line from the 3Q26 release (8-K Ex. 99.1, Nov 4 2026, acc. 0001811074-26-000075): the figure, its growth and
// the reason TPL gives. Growth is against the dataset's 3Q25 / 2Q26.
var Q3_RES_NOTES = {
  'Total revenues':{ t:'Record $273.4M, +35% YoY', h:'<p>$273.4M against $203.1M in 3Q25 and $246.1M in 2Q26: oil and gas royalties +$21.7M QoQ, easements +$12.5M and produced water royalties +$4.3M, partly offset by water sales −$11.3M.</p>' },
  'Oil & gas royalties':{ t:'Record $167.3M on price and volume', h:'<p>Record royalty revenue “benefited from robust development activity, elevated oil prices, and improved gas realizations”; +54% YoY.</p>' },
  'Royalty production':{ t:'Record 42.3K Boe/d', h:'<p>42.3K Boe/d against 39.7K in 2Q26 and 36.3K in 3Q25.</p>' },
  'Realized price per Boe':{ t:'$44.97/Boe', h:'<p>$44.97 against $42.17 in 2Q26 and $34.10 in 3Q25.</p>' },
  'Easements & surface':{ t:'$36.2M on pipeline easements', h:'<p>“Pipeline easement revenue was strong as operators expanded development of midstream infrastructure.”</p>' },
  'Water sales':{ t:'$28.4M, lower pricing', h:'<p>Down $11.3M QoQ on lower average realized pricing, partly offset by higher volumes (672K bbl/d against 663K).</p>' },
  'Produced water royalties':{ t:'Record $41.4M on 5.5M bbl/d', h:'<p>Record produced water royalty volumes and revenue on “the continued trend of growing Permian produced water”.</p>' },
  'Water Services & Ops revenue':{ t:'$71.8M, down on water sales', h:'<p>$71.8M against $82.2M in 2Q26: lower water sales and lower water-segment easements ($2.0M against $5.4M).</p>' },
  'Operating income':{ t:'$207.8M; opex $65.6M', h:'<p>Total operating expenses $65.6M against $54.2M in 2Q26: DD&amp;A +$6.2M, G&amp;A +$2.6M and water service costs +$2.2M.</p>' },
  'DD&A':{ t:'$22.8M, +$6.2M QoQ', h:'<p>$22.8M against $16.6M in 2Q26.</p>' },
  'Net income':{ t:'Record $167.4M', h:'<p>$167.4M against $153.9M in 2Q26 and $121.2M in 3Q25.</p>' },
  'Free cash flow':{ t:'Record $170.3M', h:'<p>TPL’s definition: Adjusted EBITDA less current income tax and fixed-asset purchases (net of the change in related payables).</p>' }
};

// ── Q2 2026 — reported Aug 5 2026 after close; call Aug 6 2026. Setup = the May 11 2026 snapshot (last before the print).
var Q2_SET_NOTES = { 'Total revenues':{ t:NO_GUIDE, h:'<p>1Q26 release (May 6 2026): record revenue of $236.8M, with $20.9M from a land sale.</p>' } };
var Q2_RES_NOTES = {
  'Total revenues':{ t:'Record $246.1M, +31% YoY', h:'<p>$246.1M against $236.8M in 1Q26: oil and gas royalties +$27.4M, easements +$6.3M and produced water royalties +$3.5M, offset by land sales −$20.9M and water sales −$7.1M.</p>' },
  'Oil & gas royalties':{ t:'$145.6M, +23% QoQ', h:'<p>“Our unhedged commodity position allowed us to capture the full upside of this quarter’s elevated oil prices.”</p>' },
  'Royalty production':{ t:'Record 39.7K Boe/d', h:'<p>39.7K Boe/d against 37.1K in 1Q26; 131.9 net producing wells at Jun 30.</p>' },
  'Realized price per Boe':{ t:'$42.17/Boe', h:'<p>$42.17 against $37.06 in 1Q26.</p>' },
  'Water sales':{ t:'$39.7M, lower volumes', h:'<p>Down $7.1M QoQ on lower water sales volumes (663K bbl/d against 819K), partly offset by higher pricing.</p>' },
  'Produced water royalties':{ t:'Record $37.1M on 4.9M bbl/d', h:'<p>Record produced water royalty revenue and volumes.</p>' },
  'Land sales':{ t:'None, after $20.9M in 1Q26', h:'<p>No land sale revenue in the quarter.</p>' },
  'Operating income':{ t:'$191.8M; opex flat at $54.2M', h:'<p>Total operating expenses $54.2M against $54.5M: water service costs −$2.7M, DD&amp;A +$2.6M.</p>' },
  'Net income':{ t:'Record $153.9M', h:'<p>$153.9M against $142.9M in 1Q26.</p>' },
  'Free cash flow':{ t:'Record $155.5M', h:'<p>$155.5M against $136.4M in 1Q26.</p>' }
};

// ── Q1 2026 — reported May 6 2026 after close; call May 7 2026. Setup = the Feb 23 2026 snapshot.
var Q1_SET_NOTES = { 'Total revenues':{ t:NO_GUIDE, h:'<p>4Q25 release (Feb 18 2026): record FY2025 revenue of $798.2M; 4Q25 $211.6M.</p>' } };
var Q1_RES_NOTES = {
  'Total revenues':{ t:'Record $236.8M with a $20.9M land sale', h:'<p>$236.8M against $211.6M in 4Q25: oil and gas royalties +$21.4M and land sales +$20.9M, partly offset by water sales −$13.9M.</p>' },
  'Land sales':{ t:'$20.9M of a $42.5M seller-financed sale', h:'<p>Land sold to a developer of a power plant supporting data center operations for $42.5M under a financing arrangement: $20.9M recognized at once, the rest a financing receivable; a separate agreement supplies water to the project.</p>' },
  'Oil & gas royalties':{ t:'$118.2M, +22% QoQ on price', h:'<p>Realized $37.06/Boe against $29.33 in 4Q25; production 37.1K Boe/d against 37.5K.</p>' },
  'Water sales':{ t:'$46.9M, lower volumes and pricing', h:'<p>Down $13.9M QoQ on lower water sales volumes and pricing.</p>' },
  'Adjusted EBITDA':{ t:'$181.4M, land sale taken out', h:'<p>TPL’s Adjusted EBITDA excludes the $20.9M seller-financed land sale.</p>' },
  'DD&A':{ t:'$14.0M, −$7.9M QoQ', h:'<p>DD&amp;A fell $7.9M against 4Q25.</p>' },
  'Net income':{ t:'Record $142.9M', h:'<p>$142.9M against $123.3M in 4Q25.</p>' }
};

// ── Q4 2025 — reported Feb 18 2026 after close; call Feb 19 2026. Setup = the Nov 10 2025 snapshot.
var Q4_25_SET_NOTES = { 'Total revenues':{ t:NO_GUIDE, h:'<p>3Q25 release (Nov 5 2025): record water segment revenue of $80.8M; the Midland royalty acquisition (17,306 net royalty acres) closed Nov 3 2025.</p>' } };
var Q4_25_RES_NOTES = {
  'Total revenues':{ t:'$211.6M, +14% YoY', h:'<p>$211.6M against $203.1M in 3Q25: water sales +$16.2M and easements +$3.9M, offset by oil and gas royalties −$12.0M.</p>' },
  'Royalty production':{ t:'Record 37.5K Boe/d', h:'<p>37.5K Boe/d against 36.3K in 3Q25; FY2025 34.6K Boe/d.</p>' },
  'Realized price per Boe':{ t:'$29.33/Boe', h:'<p>$29.33 against $34.10 in 3Q25.</p>' },
  'Water sales':{ t:'Record $60.7M on 1.0M bbl/d', h:'<p>Record water sales revenue and volumes.</p>' },
  'DD&A':{ t:'$21.9M, +$7.0M QoQ', h:'<p>Depletion on the royalty interests acquired in 2H24 and 2025.</p>' },
  'Net income':{ t:'$123.3M', h:'<p>$123.3M against $121.2M in 3Q25; FY2025 a record $481.4M.</p>' }
};

// ── Calls (Q2 2026, Q1 2026, Q4 2025). Source: the call transcripts on stockanalysis.com (data source Quartr), read Nov 4 2026;
// copied in docs/calls/TPL-latest.md (Q2 2026) and docs/calls/TPL.md (Q1 2026, Q4 2025). Management's words are quoted
// word for word ("…" marks a cut; checked by script against the transcript text); the question lines are paraphrases.
var Q2_CALL = {
  prepared:[
    { topic:'Record revenue, net income and free cash flow; royalty production 39.7K Boe/d, unhedged', theme:'Royalty production & operator activity',
      body:'<b>Ty Glover:</b> “TPL generated <b>record quarterly total revenue, net income, and free cash flow</b>.” … “Oil and gas royalty production averaged approximately <b>39,700 barrels of oil equivalent per day</b>, up 7% sequentially and 20% year-over-year. In addition, our <b>unhedged royalty position allowed us to benefit fully from the strong oil price environment</b>.”<br><b>Chris Steddum:</b> “Consolidated adjusted EBITDA was $216 million, which was up 19% sequentially and 30% year-over-year. Our adjusted EBITDA margin for the quarter was <b>88%</b>. Free cash flow was $156 million” … “That amounts to <b>18.4 net line of sight wells</b>.”' },
    { topic:'Water: produced water a record 4.9M bbl/d; water sales −19% QoQ on weak in-basin gas prices', theme:'Water sales',
      body:'<b>Ty Glover:</b> “Produced water royalty volumes were <b>4.9 million barrels per day</b> during the quarter, which represents growth of 6% sequentially and 15% year-over-year” … “Water sales volumes of 663,000 barrels per day represent a <b>19% decline sequentially</b> and a 38% increase year-over-year. Second quarter water sales volumes have been impacted by <b>weak in-basin natural gas prices</b> as operators have shifted some development away from the Delaware Basin. Substantial new gas pipeline capacity enters service over the next few quarters, and we would expect some mix shift towards the Delaware as local in-basin gas price differentials improve.”' },
    { topic:'SLEM $24M, +37% QoQ on pipeline and wellbore easements', theme:'Easements & surface (SLEM)',
      body:'<b>Ty Glover:</b> “For SLEM, revenues of <b>$24 million</b>, which represents a 37% sequential increase, were driven by strong performance for <b>pipeline and wellbore easements</b>.”' },
    { topic:'Data centers: the 1Q land sale is Chevron’s Project Kilby; ~10,000 acres bought in Shackelford and Jones counties for ~$100M', theme:'Data centers & power generation',
      body:'<b>Ty Glover:</b> “we disclosed that a previously announced land sale and water supply agreement was related to <b>Project Kilby</b>, which is a large-scale power generation facility <b>Chevron</b> is developing to support a customer data center in Reeves County, Texas.” … “during the quarter, we acquired <b>over 10,000 acres of land in Shackelford and Jones County, Texas, for approximately $100 million</b>.” … “this acquisition further expands our strategic data center and power generation efforts <b>beyond the immediate Permian Basin</b>.” … “We are also progressing on a number of projects with various high-quality hyperscalers and AI labs, which also includes our joint effort alongside Bolt Data and Energy.”' },
    { topic:'Desalination: Orla Phase 2B built and commissioning; co-location studies inside the $65–75M capex guide', theme:'Produced water desalination',
      body:'<b>Ty Glover:</b> “we have <b>completed construction and commenced commissioning</b> on our desalination facility located in Orla, Texas, which we refer to as Phase 2B. Eventually ramping the facility to its 10,000-barrel-a-day capacity will allow us to demonstrate that produced water desalination can work at scale.” … “Our freeze desalination process will generate large volumes of ice and chilled water, which then could potentially be used by data centers for <b>chip cooling</b>.”<br><b>Chris Steddum:</b> “This spend was embedded in our original CapEx guidance at the beginning of the year, and we <b>reaffirm the fiscal year guide of $65 million-$75 million</b>.”' }
  ],
  qanda:[
    { q:'The Shackelford and Jones acreage: the opportunity and the revenue streams', analyst:'Derrick Whitfield · Texas Capital', theme:'Data centers & power generation',
      qFull:'The surface bought in Shackelford and Jones counties is a step out of the Permian; how does TPL frame the opportunity, the build-out and the number of revenue streams it could carry?',
      a:'<b>Ty Glover:</b> “we think the power and compute opportunity in West Texas is enormous and <b>broader than just the Permian</b> and our legacy footprint. We’ve been doing diligence on that property <b>for over a year</b> now to make sure that it specs out. That area was interesting to <b>a compute user that we’ve been working with</b> for a while now.” … “We think we can replicate it.” … “We want to be as involved in the project as we can while still being <b>really capital-light</b>. Land use, water, aggregates, just clipping coupons through the kind of the entire life cycle of that project”' },
    { q:'Desalinated water for chip cooling: how deep is the interest', analyst:'Derrick Whitfield · Texas Capital', theme:'Produced water desalination',
      qFull:'How deep is the interest from hyperscalers and AI labs in desalinated produced water for chip cooling, given that it adds water to the hydrologic cycle?',
      a:'<b>Robert Crain:</b> “The interest in produced water in data center use is huge.” … “There still is some evaporative cooling and adiabatic assist that is water consumptive that goes into the data center, not just chip cooling but building cooling.” … “we’re in a lot of discussions with <b>a couple hyperscalers and AI labs</b> on, and that’s using our <b>freeze technology for direct chip cooling</b>.” … “All of it goes toward a water positivity or water neutrality goal.”' },
    { q:'More acquisitions like this, or the existing footprint?', analyst:'Tim Rezvan · KeyBanc Capital Markets', theme:'Royalty & land acquisitions',
      qFull:'With almost a million surface acres already, should we expect more sizable acquisitions like this one, and how much of the opportunity can TPL serve from its existing footprint?',
      a:'<b>Ty Glover:</b> “The primary objective is to develop the existing resource that we already have, but we’re simultaneously looking for other opportunities.” … “Why let someone else capture that value?” … “we’re in <b>advanced conversations with multiple hyperscalers, AI labs, and power generators on 25GW of projects</b> right now. <b>I would be disappointed if we don’t announce at least one or more major definitive agreements in the near term.</b>” … “we feel like we owe it to our shareholders to look outside of our existing footprint.”' },
    { q:'Produced water revenue per barrel (~$0.8): keeps ramping?', analyst:'Tim Rezvan · KeyBanc Capital Markets', theme:'Produced water royalties',
      qFull:'Produced water royalty revenue per barrel was at the high end, a little over $0.8; should it keep ramping over the next year or two?',
      a:'<b>Ty Glover:</b> “we’ve got <b>price escalators</b> built in our existing contracts; I think pore space will become more valuable over time. I would say the one caveat is <b>transportation royalties are typically a little less</b> than an actual pore space injection royalty. As that mix changes, you should see that royalty kind of <b>stay steady to increasing</b> over time.”' },
    { q:'Why the oil share of production fell, and where it goes', analyst:'Tim Rezvan · KeyBanc Capital Markets', theme:'Royalty production & operator activity',
      qFull:'Oil ticked down about 5% in the quarter, against operators’ talk of pulling volumes forward into higher prices; what happened, and how will oil volumes trend with the Permian rig ramp?',
      a:'<b>Chris Steddum:</b> “I don’t think the lower oil percentage is a near-term trend for us.” … “There’s probably some <b>accounting noise</b> as some of our new acquisitions come online. We also just had a lot of heavy development that was occurring late last year, really throughout 2025, in areas that are <b>pretty gas rich</b>” … “I think our expectation is we were kind of <b>mid-30% oil cuts</b>. I do think that’s going to trend back up.” … “it should get back up <b>+40% over time</b>.”' },
    { q:'No buybacks for several quarters: a view on valuation, or building cash?', analyst:'Oliver Huang · Tudor, Pickering', theme:'Cash target, dividends & buybacks',
      qFull:'There has been no meaningful buyback for several quarters; does that reflect TPL’s view of the share price, or is it building capital for royalty, land, power and desalination deals?',
      a:'<b>Chris Steddum:</b> “one of our big thoughts when it comes to capital allocation is kind of turning those dollars toward best and highest use. We just continue to see a lot of great opportunities out there where we feel like we want to be kind of in that <b>cash build mode for now</b>.” … “<b>Buybacks are always on the table</b> and something we’re constantly looking at.”' },
    { q:'Desalination: early takeaways and conviction', analyst:'Oliver Huang · Tudor, Pickering', theme:'Produced water desalination',
      qFull:'What are the initial takeaways from the desalination plant, how have they changed TPL’s conviction on next steps, and what should investors watch?',
      a:'<b>Robert Crain:</b> “our belief that beneficial reuse and produced water desal will take hold as part of that mix <b>only grows stronger</b>.” … “What helps even strengthen that further is the interest we’re seeing from the hyperscalers and the AI labs” … “To note, <b>we’re done in build</b>. We’re commissioning. Actually, on Monday, we will be hosting our grand opening and ribbon cutting at the facility.” … “but also <b>multiple hyperscalers</b> that will be on site with us on Monday”' },
    { q:'How fast the Shackelford project turns into revenue', analyst:'Oliver Huang · Tudor, Pickering', theme:'Bolt Data & Energy',
      qFull:'How quickly could the opportunity with the compute user in Shackelford and Jones counties start to show up as revenue in the financial statements?',
      a:'<b>Ty Glover:</b> “We’re a year into diligence. <b>We’re working with Bolt to develop that project.</b> We’ve already started working with the local communities there on tax abatements and other things that are kind of like the tail end of the diligence process. That’s one that I would be <b>very disappointed if we don’t have a definitive agreement to announce in the very near term</b>.”<br><b>Robert Crain:</b> “Near term, we know we have to build out a team and build out systems for the non-potable construction water usage, the potable water that goes into the man camps” … “we know we’ve got to build a <b>new division</b>, a new team around that.”' }
  ],
  newQuestions:[
    { n:'Q2 2026: TPL is in advanced talks with hyperscalers, AI labs and power generators on 25GW of projects; Ty would be disappointed without one or more major definitive agreements in the near term.', theme:'Data centers & power generation' },
    { n:'Q2 2026: The 1Q26 land sale and water agreement is Project Kilby, a Chevron power plant for a customer data center in Reeves County.', theme:'Data centers & power generation' },
    { n:'Q2 2026: Over 10,000 acres bought in Shackelford and Jones counties for ~$100M, outside the Permian; developed with Bolt for a compute user, a year into diligence.', theme:'Royalty & land acquisitions' },
    { n:'Q2 2026: Oil cut in the mid-30s% after gas-rich development and acquisitions; management expects it back to 40%+ over time.', theme:'Royalty production & operator activity' },
    { n:'Q2 2026: Water sales volumes fell 19% QoQ as weak in-basin gas prices moved development away from the Delaware; new gas pipelines should reverse the mix.', theme:'Water sales' },
    { n:'Q2 2026: No buybacks; TPL is in cash-build mode for land, data center and desalination opportunities.', theme:'Cash target, dividends & buybacks' }
  ],
  highlights:[
    { tag:'curious', band:'logged',
      head:'Freeze desalination outputs: chilled water for chip cooling, brine for minerals',
      detail:'<p>Ty: the process “will generate large volumes of ice and chilled water, which then could potentially be used by data centers for chip cooling.” … “The concentrated brine may also enhance the economics of produced water valorization by extracting valuable minerals such as <b>lithium</b>.”</p>' },
    { tag:'watch', band:'logged',
      head:'Water sales hinge on gas takeaway out of the Delaware',
      detail:'<p>Ty: “Substantial new gas pipeline capacity enters service over the next few quarters, and we would expect some <b>mix shift towards the Delaware</b> as local in-basin gas price differentials improve.”</p>' }
  ]
};

var Q1_CALL = {
  prepared:[
    { topic:'Record revenue, net income and free cash flow; only a marginal uptick in activity despite the oil spike', theme:'Commodity prices & realizations',
      body:'<b>Tyler Glover:</b> “TPL generated <b>record quarterly total revenue, net income, and free cash flow</b>. Oil and gas royalty production averaged approximately <b>37,100 bbl of oil equivalent per day</b>, roughly flat sequentially and up roughly 19% year over year.” … “we’ve only seen a <b>marginal uptick in recent operator activity</b>.” … “If so, we would expect the industry to ramp rig and frack spread activity over the coming quarters.” … “Today, with our <b>unhedged commodity position</b>, we are fully capturing the direct upside from elevated oil prices.”' },
    { topic:'Price sensitivity: $10/bbl oil ≈ $50M a year; $5/bbl NGL ≈ $17M', theme:'Commodity prices & realizations',
      body:'<b>Chris Steddum:</b> “TPL remains fully unhedged.” … “the roughly 5 million bbl of annual oil production means that <b>every $10 per bbl increase in oil realizations would equate to approximately $50 million</b>. Our oil price realization last year averaged $65 per bbl.” … “every $5 per bbl increase to our NGL realization would equate to an additional <b>$17 million</b> of annual revenue.”' },
    { topic:'Well inventory 20.7 net wells, +11% QoQ adjusted for longer laterals', theme:'Royalty production & operator activity',
      body:'<b>Chris Steddum:</b> “The continued strong performance of our royalties position was primarily driven by strong completion activity in the Delaware Basin by Occidental, BP, and Devon in Loving and Northern Reeves counties and in the Midland Basin by Exxon in Martin County.” … “That amounts to <b>20.7 net line-of-sight wells</b>, which represents a 6% sequential increase.” … “On a net normalized basis, after factoring in longer lateral lengths, our line-of-sight inventory is <b>up 11% sequentially</b>.”' },
    { topic:'Data centers: a $43M land sale paid over 20 years plus a water supply agreement', theme:'Data centers & power generation',
      body:'<b>Tyler Glover:</b> “we entered into an agreement to <b>sell a small section of land for $43 million</b>, which is structured into <b>annual payments over a 20-year period</b>. We have entered into a separate commercial agreement to supply water for this same development.” … “Virtually every major hyperscaler and AI lab are evaluating large-scale plans in Texas, and our sense is that <b>urgency to lock up power and compute continues to rise</b>. I would add that it is important to <b>not overextrapolate deal structure and terms from any one deal</b>.” … “For some deals, the land piece will be the primary value driver. For other deals, it may be water or aggregates.”' },
    { topic:'Desalination: Phase 2B nearly complete, inlet water in the coming weeks', theme:'Produced water desalination',
      body:'<b>Tyler Glover:</b> “our phase II-B 10,000 bbl per day facility is <b>nearly complete</b>. The refrigeration inspection is planned for later this month. We expect to begin flowing inlet water bbl in the coming weeks.” … “This test facility will allow us to evaluate whether produced water desalination can work economically at scale”' },
    { topic:'Murray Stahl’s passing; the relationship with Horizon Kinetics', theme:'Board & largest shareholder',
      body:'<b>Tyler Glover:</b> “I wanted to comment on Murray Stahl’s passing.” … “Murray’s firm, Horizon Kinetics, along with its predecessors, has been <b>TPL’s largest shareholder for many decades</b>.” … “We continue to maintain a <b>close relationship with Horizon Kinetics</b>, and we believe that our combined ongoing stewardship will allow TPL to attain the full potential Murray envisioned.”' }
  ],
  qanda:[
    { q:'The land and water deal: counterparty, scale, Bolt, desalinated water', analyst:'Derrick Whitfield · Texas Capital', theme:'Data centers & power generation',
      qFull:'What can TPL say about the counterparty and scale of the land and water agreement with a gas power project (presumably not Bolt, given the timeline), and could desalinated produced water be part of it?',
      a:'<b>Tyler Glover:</b> “this project is <b>not Bolt related</b>. We’ve got several projects that we are working with Bolt on, but we also have several that are not Bolt related. Can’t comment on the size or the counterparty. This is one that will likely be <b>brackish water to start</b>, but we are in talks around produced water and using desalinated water at some point on this project and others.”' },
    { q:'How the hyperscalers’ urgency has changed the opportunity', analyst:'Derrick Whitfield · Texas Capital', theme:'Data centers & power generation',
      qFull:'TPL’s messaging suggests heightened urgency among hyperscalers versus a year ago; how has the opportunity changed and what could it mean beyond this announcement?',
      a:'<b>Tyler Glover:</b> “I think <b>speed to power</b> has been the key to these projects all along. I think, you know, <b>substantially all of the grid power has been taken</b> at this point. I think a lot of these hyperscalers and developers are now, you know, focusing on <b>behind the meter gas-fired generation</b>. That makes a lot of our acreage more viable. I think, you know, the water usage when you’re talking about, you know, a gas-fired power plant co-located with a data center will be <b>much higher</b>.”' },
    { q:'Desalination: what the first plant must prove, and who pays for scale', analyst:'Tim Rezvan · KeyBanc Capital Markets', theme:'Produced water desalination',
      qFull:'What is TPL looking for from the first facility before moving forward, and how would it fund a ~$100M, 100,000 bbl/d plant; is a partner being discussed?',
      a:'<b>Robert Crain:</b> “We call this <b>research development at scale</b>.” … “we wanna see how this operates, you know, 24/7, day in, day out at scale. That is really gonna prove the <b>economic viability strictly from an upstream market</b>.” … “To be determined on what commercial looks like, there’s a lot of structures that we’re chasing and looking at, some that focus just on that upstream and then getting the benefit of co-location as well.”' },
    { q:'SLEM and water stepped down: was 4Q25 the outlier?', analyst:'Tim Rezvan · KeyBanc Capital Markets', theme:'Easements & surface (SLEM)',
      qFull:'SLEM and water revenues fell from record levels (flat QoQ without the land sale); was 4Q25 an upside aberration or 1Q26 low, and how should the legacy segments trend this year?',
      a:'<b>Robert Crain:</b> “You’ve got some <b>accrual noise</b> in there in Q4. Really when you look at produced, how you have to look at it is more of a, let’s call it a <b>three-quarter trend look</b>.” … “We are still very bullish on the produced water space.”<br><b>Tyler Glover:</b> “on the SLM front, I <b>wouldn’t read too much into any single quarter</b>. SLM can get pretty lumpy.”' },
    { q:'Bolt power: combined cycle or modular?', analyst:'Oliver Huang · TPH & Co', theme:'Bolt Data & Energy',
      qFull:'Which way is the Bolt partnership heading on power generation: CCGT-type infrastructure for the first phase, or something more modular?',
      a:'<b>Tyler Glover:</b> “I think <b>still a little early to tell</b>. Looking at both options on a couple of different projects, kind of depending on end user design. I wouldn’t, I wouldn’t rule either out.”' },
    { q:'Permian data center gigawatts in five years, and TPL’s share', analyst:'Oliver Huang · TPH & Co', theme:'Data centers & power generation',
      qFull:'How many gigawatts of data centers could the Permian have in five years, and what share could TPL capture with its land and water footprint?',
      a:'<b>Tyler Glover:</b> “Hard to say on total Permian outlook. I think for us, you know, we feel like <b>multiple multi-gig energy campuses on our acreage are viable</b>, and that’s definitely the goal.”' }
  ],
  newQuestions:[
    { n:'Q1 2026: $43M land sale to a gas-power / data center development, paid annually over 20 years, plus a separate water agreement; not Bolt; brackish water to start.', theme:'Data centers & power generation' },
    { n:'Q1 2026: Price sensitivity on FY2025 volumes: each $10/bbl of oil ≈ $50M of annual revenue; each $5/bbl of NGL ≈ $17M.', theme:'Commodity prices & realizations' },
    { n:'Q1 2026: Line-of-sight inventory 20.7 net wells (+6% QoQ; +11% adjusted for laterals over 13,000 ft).', theme:'Royalty production & operator activity' },
    { n:'Q1 2026: The Orla plant is “research development at scale”: it must first prove economics on the upstream market; funding structures still open.', theme:'Produced water desalination' },
    { n:'Q1 2026: Murray Stahl (Horizon Kinetics) died; management keeps a close relationship with Horizon Kinetics.', theme:'Board & largest shareholder' }
  ],
  highlights:[
    { tag:'watch', band:'logged',
      head:'Oil spike, but operators have barely responded yet',
      detail:'<p>Tyler: “from our vantage point, we’ve only seen a <b>marginal uptick in recent operator activity</b>.” … “there’s still a lot of industry uncertainty around the duration of this oil supply shock.”</p>' },
    { tag:'thesis', band:'logged',
      head:'Each data center deal is different: land, water or aggregates may lead',
      detail:'<p>Tyler: “Every developer needs something different, and depending on where in the region a development is planned for, TPL has varying capabilities for capturing commercial opportunities. For some deals, the land piece will be the primary value driver. For other deals, it may be water or aggregates.”</p>' }
  ]
};

var Q4_25_CALL = {
  prepared:[
    { topic:'Records in royalty production, water sales and produced water; three-year growth while oil fell from $95 to $65', theme:'Royalty production & operator activity',
      body:'<b>Tyler Glover:</b> “Excluding the contribution from our previously announced royalties acquisition from last November, our fourth quarter oil and gas royalty production grew <b>23% year-over-year</b>. Water sales volumes this quarter <b>exceeded 1 million barrels per day</b> for the first time in our history” … “Despite oil prices declining from $95 per barrel in 2022 to $65 per barrel in 2025, during the same span, TPL delivered three-year compounded annual growth rate for oil and gas royalty production of <b>17%</b>, water sales volumes of <b>18%</b>, and produced water royalty volumes of <b>30%</b>.”' },
    { topic:'Bolt Data & Energy: strategic investment and a water right of first refusal', theme:'Bolt Data & Energy',
      body:'<b>Tyler Glover:</b> “we announced a strategic investment into <b>Bolt Data &amp; Energy</b>, a new AI infrastructure platform chaired by former Google CEO Eric Schmidt.” … “As part of our agreement, TPL retains a <b>right of first refusal to provide water</b> to Bolt-affiliated projects.”' },
    { topic:'Data centers beyond Bolt: urgency has clearly increased; some talks in advanced planning', theme:'Data centers & power generation',
      body:'<b>Tyler Glover:</b> “We’re working on projects across the full extent of our acreage, both in basin and out of basin.” … “That said, versus even a few quarters ago, <b>urgency from developers and customers has clearly increased</b>. Some of these conversations have progressed beyond just conceptual ideas and are in <b>advanced stages of planning</b>.” … “we are hopeful to have multiple new updates to share before the end of the year.”' },
    { topic:'Desalination: start moved from end-2025 to the coming months; new process; ~$20M for co-location equipment', theme:'Produced water desalination',
      body:'<b>Tyler Glover:</b> “We had originally expected this facility to commence operations by the end of 2025, and we now expect the facility to begin taking produced water <b>in the coming months</b>.” … “we implemented the new process into our freeze desalination design” … “We believe this will substantially reduce the amount of time and cycles produced water need to pass through the system” … “we plan to invest approximately <b>$20 million</b> on installing co-location equipment at the Orla facility to evaluate the feasibility of waste heat capture and data center cooling.”' },
    { topic:'Dividend +12.5% to $0.60; $145M cash, zero debt, $500M undrawn facility; 2026 capex $65–75M', theme:'Cash target, dividends & buybacks',
      body:'<b>Chris Steddum:</b> “we announced a regular dividend of <b>$0.60 per share</b>, which represents a 12.5% increase versus the prior quarter dividend.” … “we exited the year with <b>$145 million of cash</b> on the balance sheet and zero debt. During the quarter, we closed on TPL’s inaugural credit facility with <b>$500 million of commitments</b>. That facility remains fully undrawn today. For fiscal year 2026, we anticipate capital expenditures to be approximately <b>$65 million-$75 million</b>”' },
    { topic:'Permian DUC drawdown: a year or more of runway before rigs must be added', theme:'Royalty production & operator activity',
      body:'<b>Chris Steddum:</b> “The decline in our line-of-sight wells, and this is true basin-wide, is primarily due to this <b>DUC drawdown</b>.” … “leaving roughly <b>1,500-2,000 discretionary DUCs</b>.” … “with at least <b>a year or more of runway</b> before the industry would need to begin adding rigs” … “we do not anticipate basin-wide production declines given the current oil strip.”' }
  ],
  qanda:[
    { q:'How the power and data center opportunity has evolved beyond Bolt', analyst:'Derrick Whitfield · Texas Capital', theme:'Data centers & power generation',
      qFull:'After six months of power and AI announcements across West Texas, how has TPL’s power and data center opportunity evolved, and does it go beyond Bolt?',
      a:'<b>Tyler Glover:</b> “I think the further we dig into it, the bigger we think the opportunity is. You know, we’ve got a few projects we’re working on, <b>some Bolt related, some not</b>.” … “at the end of the day, <b>scale is what really matters</b>.” … “We’re not trying to hodgepodge, you know, 200 meg facilities over the acreage footprint. The long-term goal is to build, you know, <b>multiple multi-gig energy campuses</b>”' },
    { q:'An investor’s Bolt math (10GW, $125M of water revenue per GW): reasonable?', analyst:'Derrick Whitfield · Texas Capital', theme:'Bolt Data & Energy',
      qFull:'A prominent investor says Bolt aims for a 10-gigawatt West Texas campus and each gigawatt could bring over $125M of water revenue to TPL; are those numbers reasonable?',
      a:'<b>Tyler Glover:</b> “with certain designs, yes, <b>those numbers are very reasonable</b>, and you know, we’ve talked to some power generators that the water usage numbers seem <b>substantially higher than that</b>.” … “But the usage actually depends, you know, varies pretty widely depending on design of the facility.”<br><b>Robert Crain:</b> “we’re confident in the amount of compute and associated gen that’s gonna be coming to the Permian, that, you know, the effect on our water business is gonna be <b>significant</b>.”' },
    { q:'Record water volumes while basin activity contracts: why?', analyst:'Derrick Whitfield · Texas Capital', theme:'Produced water royalties',
      qFull:'Disposal and source water volumes were records despite lower basin activity; what is TPL doing to drive that, and what is the outlook for each business?',
      a:'<b>Robert Crain:</b> “I think it’s twofold. One, you go back to our <b>legacy contracts</b>” … “But the second is the strategy that we implemented, you know, four or five years ago.” … “two things: <b>out-of-basin pore space</b> for short-term solutions and desal.” … “we can bolt on and build onto that system to capture more, where even if we see a, you know, a slight contraction in overall activity level, <b>we’re able to touch so much more</b>”' },
    { q:'Will TPL publish its own data center narrative?', analyst:'Tim Rezvan · KeyBanc', theme:'Data centers & power generation',
      qFull:'A shareholder’s comments on the data center opportunity created quite a stir; will TPL put out its own view of the opportunity, and when?',
      a:'<b>Tyler Glover:</b> “I think <b>eventually we’ll put more information out</b>. You know, we’ve got pretty <b>strict confidentiality agreements</b> in place with all of our counterparties, and, you know, kind of like when we started the water business, keeping most of the commercial terms, private, at least in the near term, we think is a competitive advantage for us.”' },
    { q:'Desalination: the process change and power intensity', analyst:'Tim Rezvan · KeyBanc', theme:'Produced water desalination',
      qFull:'What efficiencies does the process change and waste heat capture bring, and how power-intensive is desalination in a region short of electricity?',
      a:'<b>Robert Crain:</b> “the overall goal in water desal is to <b>reduce energy consumption</b>, to overall reduce your price per barrel.” … “it’s really in your <b>kWh per barrel</b> of water treated.” … “all thermal technologies, you’re right, they do require power. So that’s where we go when you look at waste heat capture.” … “waste heat is <b>almost free energy</b>.”' },
    { q:'Rare earths in Hudspeth County', analyst:'Tim Rezvan · KeyBanc', theme:'Royalty & land acquisitions',
      qFull:'Companies are exploring for rare earths near TPL’s Hudspeth County acreage; what is TPL’s exposure, through exploration or right of way?',
      a:'<b>Tyler Glover:</b> “we do have a couple of <b>exploration projects</b> going on currently out there on some properties that we’ve actually purchased or traded for in the last seven or eight years. Early stages, but <b>findings seem promising so far</b>.”' },
    { q:'Water for Bolt: source water network or desalinated?', analyst:'Oliver Huang · Tudor, Pickering, Holt', theme:'Bolt Data & Energy',
      qFull:'Under the right of first refusal to supply water to Bolt, will the water come from the source water network, treated desalinated water or a mix, and does desalinated water meet CCGT and data center specs?',
      a:'<b>Robert Crain:</b> “I would say both.” … “eventually it’s going to be a <b>combination of both of the water sources</b>.” … “we love the produced water component, that could be used in power gen, and, you know, combining desal with power gen and data center usage.”' },
    { q:'Capacity to scale treated water to gigawatt needs, and its capital', analyst:'Oliver Huang · Tudor, Pickering, Holt', theme:'Produced water desalination',
      qFull:'Can TPL ramp treated water to multi-gigawatt volumes or would it cap out, and what capital would an incremental 250,000 bbl/d of capacity take?',
      a:'<b>Robert Crain:</b> “We’re <b>never gonna have a feedstock shortage</b> of water usage for power gen or compute.” … “any capital offset that we can get for power gen and compute to help offset the capital needs of a desal facility are going to help bring it to market. I think <b>it’s too early to say</b>”' },
    { q:'Bolt: anchor customers and when revenue starts', analyst:'Oliver Huang · Tudor, Pickering, Holt', theme:'Bolt Data & Energy',
      qFull:'Any update on Bolt securing commercial partners and anchor customers, the facility size, and when revenue from the first data center project could start?',
      a:'<b>Tyler Glover:</b> “his goal is to get to <b>1 gig pretty swiftly</b>, with, you know, kind of a <b>10-gig campus</b> being the ultimate goal.” … “hopefully, we’re announcing some stuff, you know, at least this year, if not first half of the year.” … “there’s a land use component. Obviously, we’ve got the <b>right of first refusal on the water</b>, which we think could be substantial. And then, you know, <b>the equity return on Bolt could be very material</b> for our business.”' }
  ],
  newQuestions:[
    { n:'Q4 2025: Bolt aims for 1GW swiftly and a 10GW campus ultimately; TPL earns land use, a water right of first refusal and the equity return on its stake.', theme:'Bolt Data & Energy' },
    { n:'Q4 2025: Management called an investor’s $125M of water revenue per GW “very reasonable” for certain designs; usage varies with facility design.', theme:'Bolt Data & Energy' },
    { n:'Q4 2025: Orla start slipped from end-2025 to the coming months after a process change; ~$20M of 2026 capex for waste heat capture and co-location equipment.', theme:'Produced water desalination' },
    { n:'Q4 2025: Dividend +12.5% to $0.60; $145M cash, zero debt and a $500M undrawn facility; 2026 capex $65–75M.', theme:'Cash target, dividends & buybacks' },
    { n:'Q4 2025: Permian in DUC drawdown: ~1,500–2,000 discretionary DUCs left, a year or more before rigs must be added; no basin-wide decline expected at the strip.', theme:'Royalty production & operator activity' },
    { n:'Q4 2025: Early-stage rare earth exploration on properties TPL bought or traded for in Hudspeth County; findings promising so far.', theme:'Royalty & land acquisitions' }
  ],
  highlights:[
    { tag:'curious', band:'logged',
      head:'Laterals keep getting longer on TPL acreage',
      detail:'<p>Chris: “For new permitted wells this past quarter, the average lateral length is <b>35% longer</b> than the average permitted well in 2024. We also had over 100 new permitted wells with lateral lengths over 15,000 feet and 34 wells over 20,000 feet.”</p>' },
    { tag:'thesis', band:'logged',
      head:'Permian produced water keeps growing even if oil plateaus',
      detail:'<p>Tyler: “Permian already generates nearly <b>25 million barrels of produced water a day</b>, with volumes expected to grow through the end of the decade, even if oil production were to plateau.”</p>' }
  ]
};

function setup(src, asOf, notes){ return { source:src, asOf:asOf, notes:notes }; }
export var TPL_CALL_EARNINGS = { ticker:'TPL', quarters:[
  { q:'Q4 2026', status:'upcoming', date:'February 2027 (date TBC)',
    setup:setup(Q4_SRC, '2026-11-03', Q4_NOTES), results:null, call:null },
  { q:'Q3 2026', status:'reported', date:'Wed Nov 4, 2026 · after close (call Thu Nov 5, 9:30am CT)',
    setup:setup(Q3_SRC, '2026-11-03', Q3_NOTES),
    results:{ notes:Q3_RES_NOTES, source:'TPL 3Q26 release, 8-K Ex. 99.1 of Nov 4 2026 (acc. 0001811074-26-000075) · '+CALL_PENDING+': the call is on Nov 5 2026' },
    call:null },
  { q:'Q2 2026', status:'reported', date:'Wed Aug 5, 2026 · after close (call Thu Aug 6)',
    setup:setup('Bloomberg (BST) — Consensus_Portal.xlsm, snapshot 2026-05-11 (the last before the print) · notes: TPL 1Q26 release', '2026-05-11', Q2_SET_NOTES),
    results:{ notes:Q2_RES_NOTES, source:'TPL 2Q26 release, 8-K Ex. 99.1 of Aug 5 2026 (acc. 0001811074-26-000056) · Q&A: the Aug 6 2026 call transcript (stockanalysis.com, data source Quartr)' },
    call:Q2_CALL },
  { q:'Q1 2026', status:'reported', date:'Wed May 6, 2026 · after close (call Thu May 7)',
    setup:setup('Bloomberg (BST) — Consensus_Portal.xlsm, snapshot 2026-02-23 (the last before the print) · notes: TPL 4Q25 release', '2026-02-23', Q1_SET_NOTES),
    results:{ notes:Q1_RES_NOTES, source:'TPL 1Q26 release, 8-K Ex. 99.1 of May 6 2026 · Q&A: the May 7 2026 call transcript (stockanalysis.com, data source Quartr)' },
    call:Q1_CALL },
  { q:'Q4 2025', status:'reported', date:'Wed Feb 18, 2026 · after close (call Thu Feb 19)',
    setup:setup('Bloomberg (BST) — Consensus_Portal.xlsm, snapshot 2025-11-10 (the last before the print) · notes: TPL 3Q25 release', '2025-11-10', Q4_25_SET_NOTES),
    results:{ notes:Q4_25_RES_NOTES, source:'TPL 4Q25 release, 8-K Ex. 99.1 of Feb 18 2026 · Q&A: the Feb 19 2026 call transcript (stockanalysis.com, data source Quartr)' },
    call:Q4_25_CALL }
] };
