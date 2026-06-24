// overviews/sofi.js — custom Overview for SoFi Technologies, Inc. (Nasdaq: SOFI)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// This module renders the company profile (one-stop digital bank: three segments on a
// national charter). Additional sub-tabs will be added later; for now there is a single
// Overview view, rendered directly without a sub-tab bar.
//
// Figures are in US dollars. Headline KPIs are for the most recent quarter (Q1 2026,
// ended March 31, 2026); annual figures are fiscal years ended December 31. Sourced from
// SoFi's FY2025 Form 10-K, Q1 2026 Form 10-Q, and Q1 2026 investor presentation / earnings call.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'Nasdaq: SOFI'],
  ['HQ', 'San Francisco, CA'],
  ['Founded', '2011 · Stanford'],
  ['Public', 'Jun 2021 · SPAC (SCH V)'],
  ['Bank charter', 'National bank since 2022'],
  ['Chairman & CEO', 'Anthony Noto (since 2018)'],
];

var DESC = 'SoFi is a member-centric, one-stop digital financial services company. Members borrow, save, spend, invest and protect their money inside a single app, with no physical branches. SoFi operates its own national bank (SoFi Bank, N.A.) and runs three businesses: Lending (personal, student and home loans), Financial Services (SoFi Money, Invest, Credit Card and more), and a B2B Technology Platform (Galileo and Technisys) that powers other fintechs and banks. Its mission is to help members "achieve financial independence to realize their ambitions."';

// Headline KPIs — most recent quarter (Q1 2026, ended Mar 31, 2026).
var KPIS = [
  { l:'Total Members',   v:'14.7M',  d:'+35% YoY',                dir:'up' },
  { l:'Total Products',  v:'22.2M',  d:'+39% YoY',                dir:'up' },
  { l:'Net Revenue',     v:'$1.10B', d:'Q1 2026 · +43% YoY',      dir:'up' },
  { l:'GAAP Net Income', v:'$167M',  d:'10th straight profit qtr',dir:'up' },
];
var AS_OF = 'Figures are in US dollars. Headline KPIs are for the most recent quarter (Q1 2026, ended March 31, 2026); annual figures are for fiscal years ended December 31. Sourced from SoFi\'s FY2025 Form 10-K, Q1 2026 Form 10-Q, and Q1 2026 investor materials.';
var FY_NOTE = 'FY2025: total net revenue $3.61B (+35%) · GAAP net income $481M · adjusted EBITDA $1.05B (29% margin) · members +35% to 13.65M · total deposits +44% to $37.5B. GAAP net income looks roughly flat versus FY2024 ($499M), but FY2024 included a one-time ~$266M deferred-tax benefit; on a comparable basis underlying (adjusted) net income more than doubled — from $227M in FY2024 to $481M in FY2025.';

var HOW_MONEY = [
  'Three businesses sit on one <b>national-bank</b> platform: <b>Lending</b>, <b>Financial Services</b> and a B2B <b>Technology Platform</b>.',
  '<b>Lending</b> (FY2025 net revenue <b>$1.85B</b>) earns net interest income on personal, student and home loans, gains on loan sales and securitizations, and capital-light fees from its <b>Loan Platform Business</b> (originating loans for third parties).',
  '<b>Financial Services</b> (<b>$1.54B</b>, +88% YoY) monetizes SoFi Money, Invest, Credit Card, Relay and Crypto through net interest income on <b>deposits</b>, interchange and fees.',
  '<b>Technology Platform</b> (<b>$361M</b>) provides the rails — card issuing, payments and core-banking software (Galileo + Technisys) — that power other fintechs and banks.',
  'The flywheel is the <b>Financial Services Productivity Loop</b>: a strong member experience drives existing members to add more products (<b>43% cross-buy</b> in Q1 2026), lowering acquisition cost and lifting lifetime value.',
  'SoFi is ~<b>96% deposit-funded</b>, giving it a low cost of capital and a ~<b>5.9% net interest margin</b>.',
];

// Three reportable segments — FY2025 net revenue (vs FY2024) and contribution profit.
var SEGMENTS = [
  ['Lending — $1.85B net revenue', 'Personal, student and home loans. Earns net interest income on loans held for investment, gains on loan sales/securitizations, and capital-light origination fees from the Loan Platform Business. FY2025 contribution profit $1.02B (~55% margin). Up from $1.49B revenue in FY2024.'],
  ['Financial Services — $1.54B net revenue', 'SoFi Money (checking & savings), SoFi Invest, Credit Card, Relay, Crypto, At Work and Protect. Monetized through deposit-driven net interest income, interchange and fees. FY2025 contribution profit $793M — nearly doubled from $821M revenue in FY2024 (+88%).'],
  ['Technology Platform — $361M net revenue', 'Galileo (card issuing & payments APIs) and Technisys (cloud-native core banking) — the infrastructure behind other fintechs and banks. FY2025 contribution profit $144M. Up modestly from $352M in FY2024 — revenue growth was muted as a large client transitioned off the platform (enabled accounts fell while revenue still edged up).'],
];

var TIMELINE = [
  ['2011', 'Founded at <b>Stanford</b> as Social Finance ("SoFi"), pioneering low-cost <b>student-loan refinancing</b> funded by alumni.'],
  ['2018', '<b>Anthony Noto</b> — former COO of Twitter and TMT banker / CFO at Goldman Sachs — becomes CEO.'],
  ['2019–20', 'Expands beyond lending: launches <b>SoFi Money</b> and <b>SoFi Invest</b>; acquires payments platform <b>Galileo</b> (2020) to build the Technology Platform.'],
  ['Jun 2021', 'Goes <b>public on Nasdaq</b> via a SPAC merger with Social Capital Hedosophia Holdings V (ticker <b>SOFI</b>).'],
  ['2022', 'Acquires Golden Pacific Bank to obtain a <b>national bank charter</b> (SoFi Bank, N.A.); acquires core-banking platform <b>Technisys</b>.'],
  ['2024', 'Reaches <b>full-year GAAP profitability for the first time</b>.'],
  ['2025', 'Ends the year with <b>13.65M members</b> and <b>$37.5B of deposits</b>; launches SoFi Crypto and becomes the <b>first national bank to issue a stablecoin</b> (SoFiUSD) on a public blockchain.'],
  ['Q1 2026', '<b>14.7M members</b> · record <b>$12.2B</b> loan originations · <b>10th consecutive profitable quarter</b> · 18th straight quarter above the "Rule of 40" (score 72).'],
];

// Financial performance — FY2024 vs FY2025 (consolidated), from the 10-K.
var FINANCIALS = [
  ['Total net revenue',     '$2.67B',        '$3.61B (+35%)'],
  ['Net interest income',   '$1.72B',        '$2.22B (+29%)'],
  ['Noninterest income',    '$0.96B',        '$1.39B (+46%)'],
  ['Adjusted EBITDA',       '$666M (26%)',   '$1,054M (29%)'],
  ['GAAP net income',       '$499M',         '$481M'],
  ['Adjusted net income',   '$227M',         '$481M (+112%)'],
  ['Diluted EPS (GAAP)',    '$0.39',         '$0.39'],
  ['Total deposits',        '$26.0B',        '$37.5B (+44%)'],
];
var FIN_NOTE = 'GAAP net income was essentially flat year-over-year ($499M → $481M), but FY2024 benefited from a one-time ~$266M deferred-tax benefit (release of a valuation allowance). Stripping that out, underlying profitability more than doubled: adjusted net income rose from $227M to $481M and adjusted EBITDA grew 58% to $1.05B as the model scaled.';

// The member / product flywheel (Financial Services Productivity Loop).
var ENGINE = [
  'A new member is acquired once, then adds more products over time — <b>43% of new products</b> in Q1 2026 were opened by <b>existing members</b> (up 7 points YoY).',
  'Each additional product <b>lowers blended acquisition cost</b> and <b>raises lifetime value</b>, because the most expensive step — winning the member — is already paid for.',
  'Deposits from SoFi Money fund the loan book at ~<b>96% deposit funding</b>, cutting cost of capital versus warehouse and securitization markets and lifting net interest margin to ~<b>5.9%</b>.',
  'More members and deposits → more lending and fee revenue → reinvestment in product and brand → more members. SoFi calls this the <b>Financial Services Productivity Loop</b>.',
];

var PEERS = [
  ['Traditional banks (JPMorgan, BofA, Wells Fargo)', 'Full-service national banks with large branch networks and deposit bases.', 'SoFi is digital-native with no branches — structurally lower cost to serve, one integrated app, and faster product velocity.'],
  ['Chime', 'Digital banking / neobank focused on spending and checking for everyday consumers.', 'SoFi offers a far broader suite — lending, investing, credit card — plus its own national bank charter and deposit base.'],
  ['Robinhood', 'Investing-first app expanding into cash management and lending.', 'SoFi leads in lending and deposits and holds a bank charter; investing is one of many products inside its loop.'],
  ['Block (Cash App) · PayPal', 'Payments-led ecosystems with large user bases and money movement.', 'SoFi differentiates with a bank charter, balance-sheet lending and insured deposits rather than payments alone.'],
  ['Upstart · LendingClub', 'Consumer-lending specialists / marketplaces.', 'SoFi funds with low-cost deposits and a multi-product relationship, versus single-product lenders dependent on capital markets.'],
];

var TAILWINDS = [
  'Structural shift of banking to <b>digital-first</b>, branchless models — SoFi has no branch cost to defend.',
  'The <b>cross-buy flywheel</b> (43% of new products from existing members) keeps acquisition cost falling as the base compounds.',
  '~<b>96% deposit funding</b> and a ~5.9% NIM give a low, stable cost of capital at scale.',
  'Fast-growing <b>fee-based, capital-light revenue</b> — Loan Platform Business, interchange and Technology Platform — reached <b>$1.5B</b> in FY2025 (+59%).',
  'Clear <b>operating leverage</b>: adjusted EBITDA margin expanded 26% → 29% → 31% (Q1 2026), guided toward ~34% in 2026.',
  'A young, <b>high-quality member base</b> (avg FICO ~745–767, incomes ~$150K+) with a long runway to adopt more products.',
];

var HEADWINDS = [
  '<b>Interest-rate sensitivity</b>: NIM, loan demand and fair-value marks on the loan book all move with rates.',
  '<b>Consumer credit risk</b>: personal-loan charge-offs run ~4.4% (ex-delinquency sales); a downturn would pressure losses.',
  'Reliance on <b>loan sales and capital-markets partners</b> (incl. the Loan Platform Business) — losing a large buyer or Tech Platform client hurts revenue.',
  'Heavy <b>regulation</b> as a bank holding company; new crypto and stablecoin lines add regulatory uncertainty.',
  'Intense <b>competition</b> from incumbent banks, neobanks (Chime), brokers (Robinhood) and payment apps (Cash App).',
  'Technology Platform growth was <b>dented by the loss of a large client</b> that transitioned off in 2025.',
];

// Guidance / targets (FY2026 guide and 2028 long-term targets).
var TARGETS = [
  { v:'~$4.66B', l:'FY2026 adj. revenue',  s:'Guidance: +30% YoY (vs $3.59B in 2025).' },
  { v:'~$1.6B',  l:'FY2026 adj. EBITDA',   s:'Guidance: +52% YoY · ~34% margin.' },
  { v:'~$0.60',  l:'FY2026 diluted EPS',   s:'Guidance: +54% YoY (vs $0.39 in 2025).' },
  { v:'~$7.9B',  l:'2028 adj. revenue tgt',s:'Long-term: ~30% revenue CAGR 2025–2028.' },
];

var DRIVERS = [
  ['Member growth', 'Keep adding members at a ~35% pace through brand-building and the "everything app" value proposition.'],
  ['Cross-buy (FSPL)', 'Deepen relationships so existing members adopt more products — the core of the productivity loop.'],
  ['Deposits & lending', 'Grow low-cost deposits to fund a record loan book ($12.2B originated in Q1 2026).'],
  ['Fee-based & capital-light', 'Scale the Loan Platform Business, interchange and Tech Platform to diversify toward fee revenue.'],
  ['Technology Platform', 'Relaunch as "SoFi Technology Solutions" across processing, core banking, payments and fraud.'],
  ['Crypto & new bets', 'SoFiUSD stablecoin, SoFi Pay remittance and Big Business Banking extend the platform.'],
];

var LEADERSHIP = [
  ['Anthony Noto', 'Chairman & CEO (since 2018) — former Chief Operating Officer of Twitter, and former CFO and co-head of TMT investment banking at Goldman Sachs (and former CFO of the NFL).'],
  ['Christopher Lapointe', 'Chief Financial Officer — leads finance, capital and investor relations through SoFi\'s scale-up to consistent GAAP profitability.'],
];

var SOURCES = 'Sources: SoFi Technologies, Inc. (Nasdaq: SOFI) FY2025 Annual Report on Form 10-K (year ended December 31, 2025), Q1 2026 Form 10-Q (quarter ended March 31, 2026), and the Q1 2026 investor presentation and earnings call. All figures in US dollars. Adjusted measures (adjusted net revenue, adjusted EBITDA, adjusted net income) are non-GAAP and are labeled as such; "2026E" and long-term figures are company guidance/targets, not results. Peer descriptions summarize public information.';

// ─── Members tab — total members at year-end (in thousands) ───────────────────
// 2020–2025 are actuals; 2026E–2027E are estimates and 2028E is a stated target.
var MEM_YEARS     = ['2020','2021','2022','2023','2024','2025','2026E','2027E','2028E'];
var MEM_K         = [ 1800,  3460,  5223,  7542, 10127, 13651, 17750, 23050, 30000 ]; // thousands
var MEM_FIRST_EST = 6; // index of the first estimated year (2026E) — lighter bars
var MEM_NOTE      = 'Total members at year-end, in millions (members shown in thousands in the underlying data). 2020–2025 are actuals; 2026E–2027E are estimates and 2028E is a stated target. Drag the two handles to choose a window — the bars, the year-over-year growth on each bar, and the CAGR update to that range. Source: SoFi company disclosures and investor presentations; forward years are estimates/targets.';
var _chartMem = null;

function memYoY(i){ return i <= 0 ? null : (MEM_K[i] / MEM_K[i-1] - 1) * 100; }
function memCAGR(a, b){ return b <= a ? null : (Math.pow(MEM_K[b] / MEM_K[a], 1 / (b - a)) - 1) * 100; }
function memM(vK){ return (vK / 1000).toFixed(vK >= 10000 ? 1 : 2); } // millions, trimmed precision

// ─── Interest Income tab — loan origination volume by product ─────────────────
// Annual loan ORIGINATION VOLUME (dollars of loans funded), in US$ millions. This is
// origination volume, not interest revenue. 2020–2025 actuals; 2026E–2027E estimates;
// 2028E is a target. Each product renders as its own ranged bar chart (slider + YoY + CAGR).
var LOAN_YEARS   = ['2020','2021','2022','2023','2024','2025','2026E','2027E','2028E'];
var LOAN_FIRST_EST = 6; // first estimated year (2026E)

var INT_INTRO = 'Interest income is driven by SoFi\'s three lending products. The charts below show annual origination volume — the dollar value of loans funded each year — split into Personal, Student and Home loans. This is origination volume, not interest revenue (revenue is covered separately). 2020–2025 are actuals; 2026E–2027E are estimates and 2028E is a target. Drag the handles on each chart to choose a year window — the bars, the per-bar YoY growth and the CAGR update to that range.';

var LOAN_PL = {
  key:'pl', title:'Personal Loans', years:LOAN_YEARS, firstEst:LOAN_FIRST_EST,
  dataM:[ 613.8, 5386.9, 9773.7, 13801.1, 17615.0, 27495.5, 35140.4, 42168, 50602 ],
  chartTitle:'Personal Loan Originations',
  note:'Personal loan origination volume by year ($B). Personal loans are SoFi\'s largest lending product and have compounded rapidly off a small 2020 base. Figures are origination volume (loans funded), not revenue. Source: SoFi company disclosures and investor presentations; 2026E–2027E are estimates, 2028E is a target.'
};
var LOAN_SL = {
  key:'sl', title:'Student Loans', years:LOAN_YEARS, firstEst:LOAN_FIRST_EST,
  dataM:[ 971, 4294, 2245, 2630, 3781, 5538, 8885, 12439, 17415 ],
  chartTitle:'Student Loan Originations',
  note:'Student loan origination volume by year ($B). Volume fell sharply in 2022 when the federal student-loan payment pause removed most refinancing demand, then recovered as rates and the policy backdrop normalized. Figures are origination volume, not revenue. Source: SoFi company disclosures and investor presentations; 2026E–2027E are estimates, 2028E is a target.'
};
var LOAN_HL = {
  key:'hl', title:'Home Loans', years:LOAN_YEARS, firstEst:LOAN_FIRST_EST,
  dataM:[ 673, 2978, 966, 997, 1820, 3389, 5970, 7462, 9328 ],
  chartTitle:'Home Loan Originations',
  note:'Home loan origination volume by year ($B). Volume dropped sharply in 2022 as rising mortgage rates cut refinancing, then resumed strong growth (SoFi has posted record home-loan quarters recently). Figures are origination volume, not revenue. Source: SoFi company disclosures and investor presentations; 2026E–2027E are estimates, 2028E is a target.'
};
var LOANS = [LOAN_PL, LOAN_SL, LOAN_HL];

function loanYoY(cfg, i){ return i <= 0 ? null : (cfg.dataM[i] / cfg.dataM[i-1] - 1) * 100; }
function loanCAGR(cfg, a, b){ return b <= a ? null : (Math.pow(cfg.dataM[b] / cfg.dataM[a], 1 / (b - a)) - 1) * 100; }
function loanB(vM){ return (vM / 1000).toFixed(vM >= 10000 ? 1 : 2); } // $ billions, trimmed precision

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }

// Overview sub-tab body (the company profile).
function overviewBody(c){
  var h = '';

  // 1 — Snapshot + lede
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';

  // 2 — KPI tiles + notes
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';

  // 3 — How it makes money
  h += sec('How SoFi Makes Money', bullets(HOW_MONEY));

  // 4 — Segments
  h += sec('Three Segments', SEGMENTS.map(function(s){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+esc(s[1])+'</div></div>';
  }).join(''));

  // 5 — Financial performance (FY2024 vs FY2025)
  h += sec('Financial Performance (FY2024 → FY2025)',
    '<table class="ov-table"><thead><tr><th>Metric</th><th>FY2024</th><th>FY2025</th></tr></thead><tbody>'+
    FINANCIALS.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>'+
    '<div class="ov-callout">'+esc(FIN_NOTE)+'</div>'
  );

  // 6 — The member / product flywheel
  h += sec('The Member & Product Flywheel', '<div class="ov-callout">'+bullets(ENGINE)+'</div>');

  // 7 — Timeline
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 8 — Peers
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How SoFi differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table>'
  );

  // 9 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 10 — Strategic focus: guidance/targets + growth drivers
  function statBox(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }
  h += sec('Strategic Focus',
    '<div class="ov-subh">Guidance & Targets</div>'+
    '<div class="ov-targets">'+TARGETS.map(statBox).join('')+'</div>'+
    '<div class="ov-subh">Growth Drivers</div>'+
    '<div class="ov-drivers">'+DRIVERS.map(function(d){
      return '<div class="ov-driver"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div></div>';
    }).join('')+'</div>'
  );

  // 11 — Leadership
  h += sec('Leadership', LEADERSHIP.map(function(l){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(l[0])+'</div><div class="ov-row-v">'+esc(l[1])+'</div></div>';
  }).join(''));

  // 12 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  return h;
}

// "Members" sub-tab body — interactive member-growth bar chart with a year-window slider.
function membersBody(c){
  var maxI = MEM_YEARS.length - 1;
  var h = '';

  h += '<div class="ov-sec-h">Member Growth</div>';

  // Dual-handle year-window slider + live readout.
  h += '<div class="sg-controls">'+
    '<div class="sg-slider">'+
      '<div class="sg-track"><div class="sg-fill" id="memFill"></div></div>'+
      '<input type="range" id="memMin" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start year">'+
      '<input type="range" id="memMax" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End year">'+
    '</div>'+
    '<div class="sg-ends"><span>'+esc(MEM_YEARS[0])+'</span><span>'+esc(MEM_YEARS[maxI])+'</span></div>'+
    '<div class="sg-readout" id="memReadout"></div>'+
  '</div>';

  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Total Members <span>(year-end, millions · light bars = estimate/target · blue = YoY growth)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiChartMem"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(MEM_NOTE)+'</div>';

  return h;
}

// One ranged loan-origination block (heading + slider + chart + footnote).
function loanBlock(cfg){
  var maxI = cfg.years.length - 1;
  var k = cfg.key;
  var h = '<div class="ovs-loan">';
  h += '<div class="ov-sec-h">'+esc(cfg.title)+'</div>';
  h += '<div class="sg-controls">'+
    '<div class="sg-slider">'+
      '<div class="sg-track"><div class="sg-fill" id="'+k+'Fill"></div></div>'+
      '<input type="range" id="'+k+'Min" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start year">'+
      '<input type="range" id="'+k+'Max" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End year">'+
    '</div>'+
    '<div class="sg-ends"><span>'+esc(cfg.years[0])+'</span><span>'+esc(cfg.years[maxI])+'</span></div>'+
    '<div class="sg-readout" id="'+k+'Readout"></div>'+
  '</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">'+esc(cfg.chartTitle)+' <span>(annual volume, $B · light bars = estimate/target · red = YoY decline)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiChart_'+k+'"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(cfg.note)+'</div>';
  h += '</div>';
  return h;
}

// "Interest Income" sub-tab body — three loan-origination charts (volume, not revenue).
function interestBody(c){
  var h = '<p class="ov-lede">'+esc(INT_INTRO)+'</p>';
  h += LOANS.map(loanBlock).join('');
  return h;
}

// "Fee Income" sub-tab body — itself split into three nested sub-tabs.
var FEE_INTRO = 'Fee-based (capital-light) income is one of SoFi\'s fastest-growing revenue streams — it carries no balance-sheet credit risk. It comes from three sources: the Loan Platform Business, the Technology Platform, and Financial Services. Use the sub-tabs below to explore each.';

function feeBody(c){
  var h = '<p class="ov-lede">'+esc(FEE_INTRO)+'</p>';
  // Nested (second-level) sub-tab bar.
  h += '<div class="ovf-tabs">'+
    '<button type="button" class="ovf-tab active" data-ovf="lpb">Loan Platform Business</button>'+
    '<button type="button" class="ovf-tab" data-ovf="tech">Technology Platform</button>'+
    '<button type="button" class="ovf-tab" data-ovf="fs">Financial Services</button>'+
  '</div>';
  // Nested panes (LPB is built; the other two are placeholders for now).
  h += '<div class="ovf-pane" data-ovf="lpb">'+lpbBody(c)+'</div>';
  h += '<div class="ovf-pane" data-ovf="tech" hidden>'+techBody(c)+'</div>';
  h += '<div class="ovf-pane" data-ovf="fs" hidden>'+fsBody(c)+'</div>';
  return h;
}

// ─── Loan Platform Business (LPB) — visual explainer data ─────────────────────
var LPB_HERO_T  = 'SoFi makes the loan — but <b>someone else\'s money funds it.</b>';
var LPB_HERO_D  = 'The Loan Platform Business lets SoFi originate loans for third-party partners who put up the capital. SoFi earns fees and keeps the member — without using its own balance sheet or taking the credit risk.';
var LPB_BADGES  = ['Capital-light — no SoFi capital used', 'No retained credit risk', 'Cash paid up front'];

// The "escape valve": LPB monetizes the ~$100B of annual loan demand SoFi can't fund itself.
var LPB_VALVE_QUOTE = '"…effectively monetizing more of the roughly $100 billion of loan applications that we are not able to meet each year."';
var LPB_VALVE_CITE  = '— Anthony Noto, CEO · SoFi Q2 2025 earnings call (reiterated Q3 2025)';

// The three-node flow + the "what flows back to SoFi" band.
var LPB_FLOW = [
  { ic:'1',    t:'A member borrows',          d:'A member applies for a personal, student or home loan inside the SoFi app.' },
  { ic:'SoFi', t:'SoFi originates & services', d:'SoFi underwrites the loan to the partner\'s credit rules, funds it for only a few days, then transfers it off its books — and keeps servicing the member.' },
  { ic:'$',    t:'A partner funds & holds it', d:'A private-credit fund, bank or insurer provides the capital, buys the loan, and earns the interest over its life.' },
];
var LPB_CONN = ['application', 'loan transferred in days'];
var LPB_BACK = [
  ['Fees flow back to SoFi', 'An origination fee (mostly cash up front) plus ongoing servicing fees.'],
  ['No capital, no credit risk', 'The loan never stays on SoFi\'s balance sheet — the partner owns the asset and the risk.'],
  ['SoFi keeps the member', 'Same relationship and servicing, ready for cross-sell across the app.'],
];

var LPB_CMP_COLS = ['Hold on balance sheet', 'Loan Platform Business'];
var LPB_CMP_ROWS = [
  ['Who funds the loan',        'SoFi\'s own deposits',                'The capital partner'],
  ['Capital SoFi must hold',    'Yes — ties up equity',               'None — capital-light'],
  ['Who takes the credit risk', 'SoFi',                               'The partner — no loss-share'],
  ['How SoFi earns',            'Net interest income over 2–3 years', 'Origination + servicing fees'],
  ['When SoFi gets the cash',   'A spread, over the life of the loan','The majority up front'],
  ['Best when…',                'SoFi has capital and wants the most lifetime return', 'SoFi wants growth, fees and zero risk'],
];

var LPB_FEES = [
  ['Origination fee', 'A fee for every loan SoFi originates and transfers to a partner — the majority paid in cash up front.'],
  ['Servicing fee',   'Ongoing fees to service the transferred loan, which keep SoFi connected to the member for the life of the loan.'],
  ['Referral fee',    'For borrowers outside SoFi\'s own credit box, SoFi refers them to a partner (via its Lantern marketplace) and earns a referral fee.'],
];

// Publicly announced LPB capital commitments, by partner — pie chart + logo legend.
var LPB_PIE = [
  { name:'Blue Owl Capital',          v:5.0, clr:'#0E7CC0', domain:'blueowl.com',           sub:'Mar 2025 · largest agreement to date' },
  { name:'3 new partners (Q1 2026)',  v:3.6, clr:'#AEB8C4', domain:null, mark:'+3',         sub:'A global bank · an insurer · a top-5 asset manager' },
  { name:'Fortress Investment Group', v:2.0, clr:'#0A4E78', domain:'fortress.com',          sub:'Oct 2024 · first LPB partner' },
  { name:'Fortress × Edge Focus JV',  v:1.2, clr:'#5BB0E3', domain:'edgefocuspartners.com', sub:'Apr 2025' },
];
var LPB_PIE_TOTAL = LPB_PIE.reduce(function(s, p){ return s + p.v; }, 0);

// LPB loan origination volume by year ($ millions). Reuses the generic ranged bar
// chart (slider + YoY + CAGR) from the Interest Income tab. 2026E–2027E estimates, 2028E target.
var LPB_ORIG = {
  key:'lpborig', title:'How fast LPB is scaling', years:['2024','2025','2026E','2027E','2028E'], firstEst:2,
  dataM:[ 2115, 11106, 16463, 24000, 35000 ],
  chartTitle:'LPB Loan Originations',
  note:'Annual LPB loan origination volume ($B) — the dollar value of loans SoFi originates for third-party partners. From a $2.1B standing start in 2024 it has scaled rapidly. 2024–2025 are actuals; 2026E–2027E are estimates and 2028E is a target. This is origination volume, not fee revenue. Drag the handles to choose a window — the bars, YoY and CAGR update.'
};

var LPB_FUNDERS = [
  ['Private-credit asset managers', 'Blue Owl, Fortress and others manage huge pools of capital hunting for yield. They want diversified consumer-credit assets but have no consumer-origination engine of their own.'],
  ['Banks & investment banks',      'Deploy capital into prime consumer credit and gain access to SoFi\'s high-quality, high-volume loan flow — without building a direct-to-consumer brand.'],
  ['Insurers',                      'Have long-duration capital that pairs naturally with the steady, predictable cash flows of amortizing consumer loans.'],
];

var LPB_FORWARD = 'A forward-flow agreement is a commitment to buy loans before they exist: a partner pre-commits to purchase a set volume of loans over time, as long as each one meets agreed credit criteria. SoFi then originates against that commitment — so the funding is lined up in advance and SoFi can scale lending without scaling its own balance sheet.';
var LPB_SOURCES = 'Sources: SoFi FY2025 Form 10-K and Q2 2025–Q1 2026 earnings calls; SoFi press releases on the Blue Owl ($5B, Mar 2025) and Fortress (Oct 2024, expanded Apr 2025) agreements. LPB is fee-based and capital-light: after transfer, SoFi has no funding obligation and no retained credit risk. Named partners are publicly announced; the Q1 2026 additions are described by type, not named.';

// "Loan Platform Business" nested-pane body — a visual explainer of how LPB works.
function lpbBody(c){
  var h = '';

  // 0 — LPB origination volume chart (the first thing shown in this tab).
  h += loanBlock(LPB_ORIG);

  // 1 — Hero / one-line definition + badges.
  h += '<div class="lpb-hero">'+
    '<div class="lpb-hero-t">'+LPB_HERO_T+'</div>'+
    '<div class="lpb-hero-d">'+esc(LPB_HERO_D)+'</div>'+
    '<div class="lpb-badges">'+LPB_BADGES.map(function(b){ return '<span class="lpb-badge">'+esc(b)+'</span>'; }).join('')+'</div>'+
  '</div>';

  // 1b — The "escape valve": LPB monetizes the ~$100B of demand SoFi can't fund itself.
  h += '<div class="lpb-valve">'+
    '<div class="lpb-valve-in">'+
      '<div class="lpb-valve-num">~$100B</div>'+
      '<div class="lpb-valve-lbl">in loan applications SoFi turns away every year — demand it can\'t fund on its own balance sheet</div>'+
    '</div>'+
    '<div class="lpb-valve-mid"><div class="lpb-valve-arrow">→</div><div class="lpb-valve-tag">escape valve</div></div>'+
    '<div class="lpb-valve-out">'+
      '<div class="lpb-valve-out-t">LPB turns it into fee revenue</div>'+
      '<div class="lpb-valve-out-d">Instead of simply declining that demand, SoFi originates these loans with a partner\'s capital (earning a fee) or refers the borrower out — monetizing applications it would otherwise reject.</div>'+
    '</div>'+
  '</div>';
  h += '<div class="lpb-valve-q">'+esc(LPB_VALVE_QUOTE)+'<cite>'+esc(LPB_VALVE_CITE)+'</cite></div>';

  // 2 — The flow diagram (the always-visible core).
  h += '<div class="ov-sec-h">How a loan flows through LPB</div>';
  var flow = '';
  flow += '<div class="lpb-node">'+nodeInner(LPB_FLOW[0])+'</div>';
  flow += '<div class="lpb-conn"><span class="lpb-conn-arrow">→</span><span class="lpb-conn-l">'+esc(LPB_CONN[0])+'</span></div>';
  flow += '<div class="lpb-node lpb-node-hl">'+nodeInner(LPB_FLOW[1])+'</div>';
  flow += '<div class="lpb-conn"><span class="lpb-conn-arrow">→</span><span class="lpb-conn-l">'+esc(LPB_CONN[1])+'</span></div>';
  flow += '<div class="lpb-node">'+nodeInner(LPB_FLOW[2])+'</div>';
  h += '<div class="lpb-flow">'+flow+'</div>';
  h += '<div class="lpb-back">'+LPB_BACK.map(function(b){
    return '<div class="lpb-back-item"><b>'+esc(b[0])+'</b>'+esc(b[1])+'</div>';
  }).join('')+'</div>';

  // 3 — Expand-to-learn-more (progressive disclosure: nothing else shown until clicked).
  // (a) How SoFi gets paid
  var feesHtml = '<div class="lpb-fees">'+LPB_FEES.map(function(f){
    return '<div class="lpb-fee"><div class="lpb-fee-t">'+esc(f[0])+'</div><div class="lpb-fee-d">'+esc(f[1])+'</div></div>';
  }).join('')+'</div>'+
  '<div class="ov-callout" style="margin-top:12px"><b>What SoFi does <i>not</i> get:</b> interest income or credit risk — those stay with the partner. SoFi trades a smaller, capital-light fee today for a loan it would not have put on its own balance sheet anyway.</div>';

  // (b) Why not just lend off its own balance sheet?
  var cmp = '<div class="lpb-cmp-h lpb-cmp-dim"></div>'+
    '<div class="lpb-cmp-h">'+esc(LPB_CMP_COLS[0])+'</div>'+
    '<div class="lpb-cmp-h lpb-cmp-hl">'+esc(LPB_CMP_COLS[1])+'</div>';
  cmp += LPB_CMP_ROWS.map(function(r){
    return '<div class="lpb-cmp-dim">'+esc(r[0])+'</div>'+
      '<div>'+esc(r[1])+'</div>'+
      '<div class="lpb-cmp-hl">'+esc(r[2])+'</div>';
  }).join('');
  var cmpHtml = '<div class="lpb-cmp">'+cmp+'</div>';

  // (c) Who funds the loans — and how it's committed
  var fundHtml = '<div class="lpb-funders">'+LPB_FUNDERS.map(function(f){
    return '<div class="lpb-funder"><div class="lpb-funder-t">'+esc(f[0])+'</div><div class="lpb-funder-d">'+esc(f[1])+'</div></div>';
  }).join('')+'</div>'+
  '<p class="ov-lede" style="margin-top:14px">'+esc(LPB_FORWARD)+'</p>'+
  '<div class="lpb-pie">'+
    '<div class="lpb-pie-chart"><canvas id="sofiLpbPie"></canvas></div>'+
    '<div class="lpb-pie-leg">'+LPB_PIE.map(function(p){
      var pct = Math.round(p.v / LPB_PIE_TOTAL * 100);
      var mark = p.domain ? logoImg(p.domain) : '<span class="lpb-pie-txt">'+esc(p.mark || '')+'</span>';
      return '<div class="lpb-pie-leg-row">'+
        '<span class="lpb-pie-mark" style="border-color:'+p.clr+'">'+mark+'</span>'+
        '<span class="lpb-pie-info"><span class="lpb-pie-name">'+esc(p.name)+'</span><span class="lpb-pie-sub">'+esc(p.sub)+'</span></span>'+
        '<span class="lpb-pie-val">$'+p.v.toFixed(1)+'B<small>'+pct+'%</small></span>'+
      '</div>';
    }).join('')+'</div>'+
  '</div>'+
  '<div class="ov-foot" style="border:none;padding-top:8px">Share of publicly announced LPB capital commitments (~$'+LPB_PIE_TOTAL.toFixed(1)+'B total). The Q1 2026 additions are described by type, not named.</div>';

  h += '<div class="lpb-acc">'+
    accItem('How does SoFi get paid?', true, feesHtml)+
    accItem('Why not just lend off its own balance sheet?', false, cmpHtml)+
    accItem('Who funds the loans?', false, fundHtml)+
  '</div>';

  // 4 — Sources.
  h += '<div class="ov-foot">'+esc(LPB_SOURCES)+'</div>';

  return h;
}

// ─── Technology Platform (nested Fee Income sub-tab) ──────────────────────────
// A B2B explainer: what the platform is, how it was built (Galileo + Technisys
// acquisitions), and who the main clients are.
var TECH_INTRO = 'The Technology Platform is SoFi\'s B2B business: instead of selling products to the end consumer, it sells the underlying technology to other banks and fintechs. If SoFi\'s apps are the "product," this platform is the "engine" running behind the scenes — the rails other companies rent to launch their own cards, accounts and financial experiences. SoFi built it by acquiring two companies: Galileo and Technisys.';

var TECH_HERO_T = 'SoFi isn\'t just a bank — it also sells the <b>rails</b> that other fintechs run on.';
var TECH_HERO_D = 'When a fintech wants to issue a card, open accounts or move money without building that technology from scratch, it can plug into SoFi\'s platform through APIs. SoFi charges for usage — a capital-light, fee-based revenue stream with no credit risk.';
var TECH_BADGES = ['B2B · capital-light', 'Galileo + Technisys', 'APIs + cloud core banking'];

// The two acquired pieces that make up the platform.
var TECH_PRODUCTS = [
  ['Galileo', '2020', 'The payments processing and card-issuing engine, delivered via API. It lets a fintech issue debit or credit cards, authorize transactions in real time and move money — the layer that "talks" to the card networks. It was already powering many of the largest U.S. fintechs when SoFi bought it.'],
  ['Technisys', '2022', 'The cloud-native core banking system — the bank\'s "operating system": accounts, deposits, loans and products. It lets a bank build and configure financial products fast, without the rigid legacy systems of traditional banks. It also brings a strong base of clients across Latin America.'],
];
var TECH_COMBINED = 'Together they form an <b>end-to-end</b> stack: Technisys is the core (the accounts and products) and Galileo is the processing (the cards and payments). SoFi is one of the few players to offer <b>both layers integrated</b>, so a client can stand up a complete digital bank on a single platform.';

// Timeline of how the platform was assembled (the two acquisitions + integration).
var TECH_TIMELINE = [
  ['Apr 2020', 'SoFi acquires <b>Galileo</b> for <b>~$1.2B</b> (cash and stock). Its entry into the B2B business: Galileo was already processing payments for many of the leading U.S. fintechs.'],
  ['Feb–Mar 2022', 'SoFi announces (Feb 22) and closes (Mar 3) the acquisition of <b>Technisys</b> for <b>~$1.1B</b> in stock (~84M shares). It adds cloud core banking and completes the technology stack.'],
  ['2023–2024', 'Integration of the two: Galileo (processing) and Technisys (core) come together into a <b>single end-to-end offering</b> capable of powering fintechs and banks alike.'],
  ['2025', 'Rebranded and relaunched as <b>"SoFi Technology Solutions,"</b> expanding into processing, core banking, payments and fraud. Segment revenue was pressured by the <b>departure of a large client</b> that migrated off the platform.'],
];

// Publicly known clients of Galileo / SoFi's Technology Platform (logos via Clearbit).
var TECH_CLIENTS = [
  { name:'Chime',     domain:'chime.com',     d:'U.S. neobank — historically Galileo\'s largest client.' },
  { name:'Robinhood', domain:'robinhood.com', d:'Debit card and cash management for the investing app.' },
  { name:'MoneyLion', domain:'moneylion.com', d:'All-in-one financial app.' },
  { name:'Dave',      domain:'dave.com',      d:'Everyday-banking neobank with paycheck advances.' },
  { name:'Toast',     domain:'toasttab.com',  d:'Payments and financial services for restaurants.' },
  { name:'DailyPay',  domain:'dailypay.com',  d:'Earned-wage access (early access to pay).' },
  { name:'Varo',      domain:'varomoney.com', d:'Digital bank with its own banking charter.' },
  { name:'HSBC',      domain:'hsbc.com',      d:'Global bank — client for digital initiatives.' },
];
var TECH_CLIENTS_NOTE = 'Clients shown are publicly disclosed; many contracts are confidential. Together, Galileo and Technisys enable ~158M end-customer accounts (Q3 2025) for neobanks, fintechs and banks across the U.S. and Latin America.';
var TECH_SOURCES = 'Sources: SoFi press releases on the Galileo (Apr 2020, ~$1.2B) and Technisys (announced Feb 22, 2022; closed Mar 3, 2022; ~$1.1B in stock) acquisitions; SoFi FY2025 Form 10-K and investor presentations (segment revenue and contribution profit, enabled accounts); Galileo press pages. All figures in US dollars.';

// ── Scale chart: enabled accounts (bars) vs. segment net revenue (line) ──
// Year-end "enabled accounts" (total accounts powered by Galileo + Technisys), in
// millions, and Technology Platform reportable-segment net revenue, in US$ millions.
// Both series are FY actuals from the Summit financial model (SoFi 10-K segment data).
var TECH_CHART_YEARS = ['2021', '2022', '2023', '2024', '2025', '2026E', '2027E', '2028E'];
var TECH_ACCTS_M     = [ 99.7, 130.7, 145.4, 167.7, 128.5, 141.3, 155.4, 171.0 ]; // enabled accounts, millions (year-end)
var TECH_REV_M       = [ 193.5, 306.0, 324.0, 351.7, 360.9, 231.5, 260.4, 291.2 ]; // segment net revenue, $M
var TECH_FIRST_EST   = 5; // index of the first estimated year (2026E) — light bars + dashed line
var TECH_CHART_NOTE  = 'In 2025, enabled accounts fell from 167.7M to 128.5M as a large client transitioned off the platform — yet segment net revenue still rose to $360.9M, lifting revenue per account. The Summit model then expects revenue to step down in 2026E (to ~$231M) as that client\'s remaining revenue fully rolls off, before the now-ex-client account base resumes organic growth and revenue re-accelerates toward ~$291M by 2028E.';
var TECH_CHART_SRC   = 'Bars: total enabled accounts at year-end (millions). Line: Technology Platform reportable-segment net revenue ($M). 2021–2025 are actuals; 2026E–2028E are Summit model estimates (lighter bars / dashed line). Source: Summit financial model, from SoFi 10-K segment disclosures. All figures in US dollars.';

// "Technology Platform" nested-pane body.
function techBody(c){
  var h = '';

  // 1 — Simple explanation: lede + hero + KPIs.
  h += '<p class="ov-lede">'+esc(TECH_INTRO)+'</p>';
  h += '<div class="lpb-hero">'+
    '<div class="lpb-hero-t">'+TECH_HERO_T+'</div>'+
    '<div class="lpb-hero-d">'+esc(TECH_HERO_D)+'</div>'+
    '<div class="lpb-badges">'+TECH_BADGES.map(function(b){ return '<span class="lpb-badge">'+esc(b)+'</span>'; }).join('')+'</div>'+
  '</div>';

  // Scale chart — enabled accounts (bars) vs. segment net revenue (line).
  h += sec('Scale — accounts & revenue',
    '<div class="tech-leg">'+
      '<span class="tech-leg-i"><span class="tech-leg-bar"></span>Enabled accounts (left · millions)</span>'+
      '<span class="tech-leg-i"><span class="tech-leg-ln"></span>Net revenue (right · $M)</span>'+
    '</div>'+
    '<div class="ov-chart-card">'+
      '<div class="ov-chart-t">Technology Platform — accounts vs. net revenue <span>(accounts year-end · light bars / dashed = estimate)</span></div>'+
      '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiTechChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-callout" style="margin-top:12px">'+esc(TECH_CHART_NOTE)+'</div>'+
    '<div class="ov-foot" style="border:none;padding-top:8px">'+esc(TECH_CHART_SRC)+'</div>'
  );

  // The two pieces that make up the platform.
  h += sec('The two pieces that make it up',
    '<div class="tech-prods">'+TECH_PRODUCTS.map(function(p){
      return '<div class="lpb-fee"><div class="lpb-fee-t">'+esc(p[0])+'<span class="tech-prod-yr">Acquired '+esc(p[1])+'</span></div><div class="lpb-fee-d">'+esc(p[2])+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:12px">'+TECH_COMBINED+'</div>'
  );

  // 2 — Timeline of the acquisitions.
  h += sec('How it was built — acquisitions', '<div class="ov-timeline">'+TECH_TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 3 — Main clients.
  h += sec('Main clients',
    '<div class="tech-clients">'+TECH_CLIENTS.map(function(cl){
      return '<div class="tech-client">'+
        '<img class="tech-client-logo" src="https://logo.clearbit.com/'+cl.domain+'" '+
          'onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+cl.domain+'&sz=64\'" '+
          'alt="'+esc(cl.name)+'" loading="lazy">'+
        '<div class="tech-client-name">'+esc(cl.name)+'</div>'+
        '<div class="tech-client-d">'+esc(cl.d)+'</div>'+
      '</div>';
    }).join('')+'</div>'+
    '<div class="ov-foot" style="border:none;padding-top:8px">'+esc(TECH_CLIENTS_NOTE)+'</div>'
  );

  // 4 — Sources.
  h += '<div class="ov-foot">'+esc(TECH_SOURCES)+'</div>';

  return h;
}

// ─── Financial Services (nested Fee Income sub-tab) ──────────────────────────
// An explainer of SoFi's everyday-money segment: what it is, the products that
// make it up, how it earns, and why it is structured this way.
var FS_INTRO = 'Financial Services is SoFi\'s everyday-money business — the suite of daily-use products members touch all the time: checking and savings (SoFi Money), investing (SoFi Invest), a credit card, crypto and more. Where Lending earns interest on loans, Financial Services gathers low-cost deposits and earns interchange and fees. It has been SoFi\'s fastest-growing segment, and it is the engine behind the cross-buy flywheel.';

var FS_HERO_T = 'Financial Services is SoFi\'s <b>everyday-money</b> layer — and its <b>deposit engine.</b>';
var FS_HERO_D = 'These are the high-frequency products members use daily — a place to bank, spend, save and invest inside one app. They keep members engaged, gather low-cost deposits that fund the loan book, and generate fee and interchange income with little capital and no credit risk.';
var FS_BADGES = ['Everyday-money products', 'Deposit-funded', 'Interchange + fees + NII'];

// Headline KPIs for the segment (FY2025).
var FS_KPIS = [
  { l:'FY2025 net revenue', v:'$1.54B', d:'+88% YoY · fastest-growing segment', dir:'up' },
  { l:'Contribution profit', v:'$793M',  d:'~51% contribution margin',          dir:'up' },
  { l:'Total deposits',      v:'$37.5B', d:'+44% YoY · mostly SoFi Money',       dir:'up' },
  { l:'Share of net revenue',v:'~43%',   d:'of SoFi\'s $3.61B FY2025 total',     dir:'muted' },
];

// The "everything app" product suite, recreated from SoFi's Q1 2026 investor
// presentation slide "Everything App for Digital Financial Services" — one phone
// screenshot per product, with the slide's own copy. Images live in /img/sofi/.
var FS_APP_INTRO = 'SoFi has developed a suite of financial products that offers the speed, selection, content and convenience that only an integrated digital platform can provide.';
var FS_APP = [
  { k:'Member',      img:'member',      d:'SoFi\'s dedicated member team leverages an AI-driven Coach to provide a personalized experience across the entire SoFi platform.' },
  { k:'Banking',     img:'banking',     d:'SoFi Money provides members with a high APY, $3M of FDIC insurance, early paychecks, no account fees, and easy money-movement features.' },
  { k:'Credit Card', img:'credit-card', d:'SoFi offers a suite of credit cards with unique cashback rewards, zero fraud liability, no surprise fees and automatic credit-line reviews.' },
  { k:'Invest',      img:'invest',      d:'SoFi Invest empowers members with the same tailored insights and high-tier investment options traditionally reserved for the ultra-wealthy.' },
  { k:'Loans',       img:'loans',       d:'SoFi supports members through life\'s biggest moments, offering seamless borrowing for education, home buying, debt consolidation and more.' },
  { k:'Crypto',      img:'crypto',      d:'SoFi is the first nationally licensed bank providing members with the ability to buy, sell and hold dozens of tokens.' },
];

// The three ways Financial Services makes money.
var FS_MONEY = [
  ['Net interest income on deposits', 'SoFi Money gathers low-cost, FDIC-insured deposits that earn a spread and fund the loan book at ~96% deposit funding. This is the largest FS revenue driver and the strategic core of the segment.'],
  ['Interchange', 'Every swipe on a SoFi debit or credit card pays SoFi a small fee from the merchant. It scales directly with spending and engagement — fee income with no credit risk on debit.'],
  ['Product & subscription fees', 'Brokerage and options activity, crypto, the SoFi Plus membership, insurance referrals and At Work contracts — a widening base of recurring, capital-light fees.'],
];

// Why SoFi composes the segment this way (strategic rationale).
var FS_WHY = [
  'These are the <b>high-frequency, daily-use</b> products that keep members in the app — which is what powers cross-buy: <b>43%</b> of new products in Q1 2026 came from existing members.',
  'SoFi Money turns that engagement into <b>low-cost deposits</b>, funding the loan book at ~<b>96% deposit funding</b> and cutting cost of capital versus warehouse and securitization markets.',
  'Most FS revenue is <b>capital-light</b> — interchange and fees carry no credit risk, and deposit NII needs far less capital than balance-sheet lending.',
  'It diversifies SoFi away from <b>lending-only</b> earnings toward durable, recurring deposit and fee income that is steadier across the rate and credit cycle.',
];

var FS_SOURCES = 'Sources: SoFi FY2025 Form 10-K and Q1 2026 investor materials — Financial Services segment net revenue $1.54B (+88% YoY), contribution profit $793M, total deposits $37.5B (+44%). Product descriptions summarize public SoFi disclosures. All figures in US dollars.';

// "Financial Services" nested-pane body — first version: explainer of the segment.
function fsBody(c){
  var h = '';

  // 1 — Lede + hero + KPIs.
  h += '<p class="ov-lede">'+esc(FS_INTRO)+'</p>';
  h += '<div class="lpb-hero">'+
    '<div class="lpb-hero-t">'+FS_HERO_T+'</div>'+
    '<div class="lpb-hero-d">'+esc(FS_HERO_D)+'</div>'+
    '<div class="lpb-badges">'+FS_BADGES.map(function(b){ return '<span class="lpb-badge">'+esc(b)+'</span>'; }).join('')+'</div>'+
  '</div>';
  h += '<div class="ov-kpis">'+FS_KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('')+'</div>';

  // 2 — What's inside: the "everything app" (recreated from the Q1 2026 slide).
  h += sec('What\'s inside — the SoFi app',
    '<div class="fs-slide-band">'+
      '<div class="fs-slide-band-t">Get Your Money Right</div>'+
      '<div class="fs-slide-band-d">'+esc(FS_APP_INTRO)+'</div>'+
    '</div>'+
    '<div class="fs-app">'+FS_APP.map(function(p){
      return '<div class="fs-app-card">'+
        '<img class="fs-app-img" src="img/sofi/'+p.img+'.png" alt="SoFi '+esc(p.k)+' app screen" loading="lazy">'+
        '<div class="fs-app-k">'+esc(p.k)+'</div>'+
        '<div class="fs-app-d">'+esc(p.d)+'</div>'+
      '</div>';
    }).join('')+'</div>'+
    '<div class="ov-foot" style="border:none;padding-top:8px">Recreated from SoFi\'s Q1 2026 investor presentation, slide "Everything App for Digital Financial Services." Loans is part of the Lending segment; shown here as part of the full app suite.</div>'
  );

  // 3 — How it makes money.
  h += sec('How it makes money',
    '<div class="tech-prods">'+FS_MONEY.map(function(m){
      return '<div class="lpb-fee"><div class="lpb-fee-t">'+esc(m[0])+'</div><div class="lpb-fee-d">'+esc(m[1])+'</div></div>';
    }).join('')+'</div>'
  );

  // 4 — Why it's composed this way.
  h += sec('Why SoFi builds it this way', '<div class="ov-callout">'+bullets(FS_WHY)+'</div>');

  // 5 — Sources.
  h += '<div class="ov-foot">'+esc(FS_SOURCES)+'</div>';

  return h;
}

// ─── Valuation → Actuals vs. Estimates ───────────────────────────────────────
// Compares Summit's DCF quarterly ESTIMATE (projection) against SoFi's REPORTED
// actual, quarter by quarter, and derives a beat/miss track record. Data pulled
// from the Summit DCF (latest snapshot 2026-05-13): projection_history vs
// actuals_history. Values in US$ millions.
//
// Data-quality note: the model carries a clean quarterly estimate series for
// total net revenue back to 2Q22 (16 quarters). For Adj. EBITDA and Adj. Net
// Income the model's quarterly estimates only become meaningful from 2Q25, so
// those start there (GAAP net income has no stored estimates and is omitted).
var AVE_INTRO = 'How our Summit DCF estimates have stacked up against what SoFi actually reported, quarter by quarter — across operating KPIs and every revenue line. Each quarter shows the model\'s estimate vs the reported actual, and the surprise (how far above or below we were). Pick a metric, then drag the handles to window the quarters — the chart and every statistic below recompute for the range you select.';

// Each metric: quarters / est (DCF projection) / act (reported). fmt drives the
// tooltip units — 'usd' = $M, 'cnt' = count in millions (stored in thousands),
// 'vol' = origination volume ($M stored, shown $B). Windows start where the
// model's quarterly estimate becomes meaningful (some lines only from 2Q25).
var AVE_METRICS = {
  // ── KPIs ──
  memb: { label:'Members', short:'Members', fmt:'cnt',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[3573,4072,4766,5319,6029,6576,7195,7777,8710,9646,10389,11182,11669,12185,13671,14191],
    act:[4319,4743,5223,5656,6240,6957,7542,8132,8774,9373,10127,10916,11746,12642,13651,14706],
    note:'Total members (end of quarter). 16-quarter estimate history — tracked closely, with small misses either way; recently the model has slightly under-forecast member adds.' },
  plpbo: { label:'LPB Loan Originations', short:'LPB orig.', fmt:'vol',
    quarters:['2Q25','3Q25','4Q25','1Q26'],
    est:[1800,2450,4000,4000],
    act:[2450,3400,3656,2963],
    note:'Loan Platform Business origination volume. Short 4-quarter estimate history (from 2Q25); 1Q26 came in well below the model.' },
  tpa: { label:'Tech Platform Accounts', short:'TP accounts', fmt:'cnt',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[94683,106573,119593,131624,139884,149199,156845,151592,155227,164087,174510,181259,177473,171392,176100,190119],
    act:[116570,124333,130704,126327,129356,136739,145425,151049,158458,160179,167714,158432,160046,157860,128462,132874],
    note:'Total enabled accounts on the Technology Platform. The model stayed too optimistic through 2025 as a large client offboarded — a clear miss streak.' },
  // ── Revenue ──
  rev: { label:'Total Net Revenue', short:'Overall', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[327.6,362.7,452.9,490.6,575.8,588.0,628.7,646.2,700.9,657.3,735.3,707.7,779.5,831.0,1009.8,1020.9],
    act:[359.3,420.1,506.1,472.3,499.8,537.1,615.4,645.0,599.8,697.1,734.1,771.8,854.9,961.6,1025.1,1100.4],
    note:'Total net revenue (consolidated). Optimistic through 2023 (a miss streak) and conservative through 2025–26 (a beat streak).' },
  nim: { label:'Net Interest Margin Revenue', short:'NIM', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[121.1,150.4,203.7,200.0,331.2,370.0,429.6,422.0,456.8,471.7,503.9,488.3,497.6,498.4,566.7,572.6],
    act:[122.7,158.2,210.4,236.2,292.9,345.0,389.6,402.7,413.6,431.0,470.2,498.7,517.8,585.1,617.3,693.0],
    note:'Net interest margin revenue. Overshot through 2023–24, then under-forecast in 2025–26 as NIM expanded.' },
  ii: { label:'Interest Income', short:'Interest income', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[173.8,197.1,243.5,254.7,413.7,481.8,529.2,592.9,649.1,687.1,765.4,782.7,816.5,832.0,903.8,876.4],
    act:[149.3,197.4,307.9,371.5,470.8,564.3,645.2,665.9,675.6,723.4,743.9,763.8,792.4,891.6,927.4,1001.0],
    note:'Total interest income. Mostly under-forecast — the loan book and yields outran the model.' },
  lii: { label:'Loans Interest Income', short:'Loans int. inc.', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[156.7,180.3,225.3,229.5,392.1,459.9,506.6,564.1,618.4,651.5,722.0,732.3,756.3,770.9,836.4,807.5],
    act:[145.3,191.5,297.8,357.3,443.0,537.9,597.2,618.4,619.9,670.1,687.3,711.5,737.4,828.7,862.8,930.5],
    note:'Interest income from loans. Similar pattern to total interest income — broadly under-forecast.' },
  ie: { label:'Interest Expense', short:'Interest expense', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[-52.7,-46.7,-39.9,-54.7,-82.6,-111.8,-99.6,-170.9,-192.3,-215.5,-261.5,-294.4,-318.9,-333.6,-337.1,-303.8],
    act:[-26.6,-39.2,-97.4,-135.3,-177.9,-219.3,-255.6,-263.2,-262.0,-292.4,-273.8,-265.1,-274.6,-306.4,-310.1,-308.0],
    note:'Interest expense — a NEGATIVE line (a cost). Green here means the actual landed above (less negative than) the estimate, i.e. lower expense; red means higher expense than modeled.' },
  lpb: { label:'Loan Platform Business Revenue', short:'LPB', fmt:'usd',
    quarters:['2Q25','3Q25','4Q25','1Q26'],
    est:[85.5,115.9,208.0,208.0],
    act:[127.4,164.9,190.9,138.3],
    note:'Total LPB revenue. Short 4-quarter estimate history (from 2Q25); strong beats early, then a 1Q26 miss as LPB volume cooled.' },
  lpbo: { label:'LPB Loan-Origination Revenue', short:'Loan origination', fmt:'usd',
    quarters:['2Q25','3Q25','4Q25','1Q26'],
    est:[81.0,110.2,180.0,180.0],
    act:[104.9,146.9,171.1,119.0],
    note:'The loan-origination-fee component of LPB. Short history (from 2Q25). Mapping note: best fit for "Loan origination" — tell me if you meant a different line.' },
  loss: { label:'Loan Origination, Sales & Securitizations', short:'Sales & securit.', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[145.7,136.2,164.5,142.1,134.8,95.0,78.0,85.5,61.1,60.3,77.7,81.6,46.5,58.7,68.6,50.4],
    act:[144.4,163.7,139.6,126.5,90.2,75.4,82.9,57.0,54.9,70.1,73.9,48.4,62.9,65.4,53.9,142.2],
    note:'Gains on loan origination, sales and securitizations. Volatile and hard to call — note the large 1Q26 beat.' },
  other: { label:'Other Revenue', short:'Other FS', fmt:'usd',
    quarters:['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[52.6,15.0,18.1,19.0,40.1,87.5,29.2,43.7,43.6,46.1,50.3,67.2,71.8],
    act:[14.0,17.2,18.3,38.9,81.7,26.5,39.5,39.4,41.0,48.1,56.5,69.1,76.7],
    note:'Other revenue (the best available proxy for "other financial services" — there is no standalone FS-segment revenue line). Starts 1Q23; 2022 is excluded because near-zero estimates produce meaningless percentages.' },
  tp: { label:'Technology Platform Revenue', short:'Tech Platform', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[51.7,75.1,78.9,82.1,81.2,95.3,93.9,90.8,88.1,88.8,99.0,95.7,99.1,99.4,99.3,118.1],
    act:[82.2,82.2,81.5,73.2,82.2,81.5,87.1,85.9,86.1,91.0,88.7,86.4,90.8,89.7,94.0,49.4],
    note:'Technology Platform revenue. Roughly in line for years, then a sharp 1Q26 miss as a large client rolled off.' },
  // ── Operating Expenses (costs — green/▼ = actual UNDER estimate) ──
  tpd: { exp:true, label:'Technology & Product Development', short:'Tech & product', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[88.8,95.3,84.9,104.8,127.2,141.7,145.0,149.8,162.4,160.9,181.5,167.6,158.6,160.7,171.3,203.1],
    act:[99.4,110.7,113.3,117.1,126.8,125.7,141.8,130.9,132.2,139.7,149.0,156.2,152.1,167.1,172.8,187.7],
    note:'Technology & product development expense. A cost line — green/▼ = actual came in BELOW estimate (under budget). Broadly in line; the model over-projected 1Q26.' },
  sme: { exp:true, label:'Sales & Marketing', short:'Sales & mktg', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[147.2,178.2,201.0,214.1,223.0,251.3,269.2,271.5,283.4,289.4,270.8,259.4,249.4,268.6,298.0,285.8],
    act:[143.9,162.1,173.7,175.2,182.8,186.7,174.7,167.4,184.8,214.9,229.3,238.2,264.7,286.9,305.6,335.5],
    note:'Sales & marketing expense. The model ran high in 2022–24 (we over-budgeted; actuals came well under), then SoFi out-spent the estimate through 2025–26.' },
  coo: { exp:true, label:'Cost of Operations', short:'Cost of ops', fmt:'usd',
    quarters:['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[95.8,110.0,109.3,111.3,125.0,131.3,127.4,132.6,148.3,155.2,164.2,158.1,153.6,160.8,166.6,168.0],
    act:[79.1,83.1,80.6,83.9,93.9,98.3,103.9,100.1,109.7,123.7,128.2,135.5,150.4,161.4,161.6,171.1],
    note:'Cost of operations. Persistently over-projected — actuals have come in under estimate almost every quarter.' },
  gae: { exp:true, label:'General & Administrative', short:'G&A', fmt:'usd',
    quarters:['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[208.9,192.5,193.1,173.0,189.2,200.7,190.4,201.5,222.2,159.5,163.8,185.1,187.7],
    act:[123.7,131.2,124.5,131.7,145.2,145.0,148.9,160.9,156.4,165.4,188.4,194.2,197.6],
    note:'General & administrative expense. Starts 1Q23 (2022 estimates were erratic). The model over-projected G&A for years; actuals have since converged.' },
  pcl: { exp:true, label:'Provision for Credit Losses', short:'Provision (PCL)', fmt:'usd',
    quarters:['4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[5.9,6.0,7.7,7.9,8.2,9.0],
    act:[6.9,5.7,10.0,9.2,5.4,8.9],
    note:'Provision for credit losses. Short window from 4Q24 — earlier estimates were near-zero and meaningless. Volatile and hard to forecast.' },
  // ── Profitability ──
  ebitda: { label:'Adj. EBITDA', short:'Adj. EBITDA', fmt:'usd',
    quarters:['2Q25','3Q25','4Q25','1Q26'],
    est:[188.4,208.5,316.6,289.0],
    act:[249.1,276.9,317.6,339.9],
    note:'Adjusted EBITDA. The model\'s quarterly estimate series is only meaningful from 2Q25 — a short 4-quarter window.' },
  ani: { label:'Adj. Net Income', short:'Adj. Net Inc.', fmt:'usd',
    quarters:['2Q25','3Q25','4Q25','1Q26'],
    est:[45.6,63.7,162.5,142.2],
    act:[97.3,139.4,173.5,166.7],
    note:'Adjusted net income. Short 4-quarter estimate history (from 2Q25). GAAP net income is omitted — the model carries no stored estimate for it.' }
};
var AVE_GROUPS = [
  { label:'KPIs',          keys:['memb','plpbo','tpa'] },
  { label:'Revenue',       keys:['rev','nim','ii','lii','ie','lpb','lpbo','loss','other','tp'] },
  { label:'Operating Exp.', keys:['tpd','sme','coo','gae','pcl'] },
  { label:'Profitability', keys:['ebitda','ani'] }
];
var AVE_SOURCE = 'Source: Summit DCF model for SOFI (latest snapshot 2026-05-13) — projection_history (estimate) vs actuals_history (reported). Revenue and profitability in US$ millions; Members and Tech Platform accounts in millions; LPB originations in $B. "Surprise" = (actual − estimate) ÷ |estimate|. Estimates are the model\'s stored quarterly projections, not a frozen pre-announcement consensus. Some lines (LPB, originations, Adj. EBITDA/Net Income) only have a meaningful quarterly estimate from 2Q25; GAAP net income has none and is omitted.';

function aveSurprise(m, i){ return (m.act[i] - m.est[i]) / Math.abs(m.est[i]) * 100; }
function aveFmt(m, v){
  if (m.fmt === 'cnt') return (v / 1000).toFixed(1) + 'M';
  if (m.fmt === 'vol') return '$' + (v / 1000).toFixed(2) + 'B';
  return '$' + Math.round(v).toLocaleString() + 'M';
}

// "Valuation" pane — first (and so far only) view: Actuals vs. Estimates.
function valuationBody(c){
  var def = AVE_METRICS.rev;
  var maxI = def.quarters.length - 1;
  var h = '';

  h += '<div class="ov-sec-h">Actuals vs. Estimates</div>';
  h += '<p class="ov-lede">'+esc(AVE_INTRO)+'</p>';

  // Grouped metric selector (KPIs · Revenue · Profitability).
  h += '<div class="ave-groups">'+AVE_GROUPS.map(function(g){
    return '<div class="ave-group"><div class="ave-group-l">'+esc(g.label)+'</div>'+
      '<div class="ave-pills">'+g.keys.map(function(k){
        return '<button type="button" class="ave-pill'+(k===_aveMetric?' active':'')+'" data-ave="'+k+'">'+esc(AVE_METRICS[k].short)+'</button>';
      }).join('')+'</div></div>';
  }).join('')+'</div>';

  // Dual-handle quarter-window slider (rebuilt when the metric changes).
  h += '<div class="sg-controls">'+
    '<div class="sg-slider">'+
      '<div class="sg-track"><div class="sg-fill" id="aveFill"></div></div>'+
      '<input type="range" id="aveMin" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start quarter">'+
      '<input type="range" id="aveMax" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End quarter">'+
    '</div>'+
    '<div class="sg-ends"><span id="aveEnd0">'+esc(def.quarters[0])+'</span><span id="aveEnd1">'+esc(def.quarters[maxI])+'</span></div>'+
    '<div class="sg-readout" id="aveReadout"></div>'+
  '</div>';

  // Chart (grouped bars: estimate vs actual, surprise % above each pair).
  h += '<div class="ave-leg">'+
    '<span class="tech-leg-i"><span class="ave-leg-act" style="background:#1E9E62"></span>Favorable (beat / under-budget)</span>'+
    '<span class="tech-leg-i"><span class="ave-leg-act" style="background:#C0392B"></span>Unfavorable (miss / over-budget)</span>'+
    '<span class="tech-leg-i">▲ above · ▼ below estimate</span>'+
  '</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t" id="aveChartT">Net Revenue — surprise vs estimate <span>(%, per quarter · hover for $)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiAveChart"></canvas></div>'+
  '</div>';

  // Analytics tiles — recomputed live for the selected window.
  h += '<div class="ov-subh">Track record <span class="ave-subh-note" id="aveStatScope"></span></div>';
  h += '<div class="ov-kpis" id="aveStats"></div>';

  h += '<div class="ov-foot" id="aveNote">'+esc(def.note)+'</div>';
  h += '<div class="ov-foot">'+esc(AVE_SOURCE)+'</div>';

  return h;
}

// ─── Sensitivity: LPB origination × take rate ────────────────────────────────
// Interactive single-point sensitivity. Two inputs are "live": LPB origination
// volume and the take rate (origination fee). Everything else in the model is
// held at its FY2026E base. The incremental LPB revenue flows 100% to pre-tax
// (LPB is capital-light — no funding or credit cost), is taxed at the model
// rate, and drops to net income / EPS / P/E.
var SENS = {
  origB:   16.5,   // base LPB origination, $B (FY2026E, Summit model)
  takePct: 5.0,    // base take rate, % (origination fee on volume)
  totalRevB: 4.66, // base FY2026E total net revenue, $B
  niM:     828.7,  // base FY2026E net income, $M (model earnings)
  shares:  1378.0, // diluted shares, M (Q1 2026 actual)
  price:   17.57,  // share price held fixed for the P/E line ($, intraday 24-Jun-2026)
  taxRate: 0.25    // tax applied to incremental LPB pre-tax income
};
SENS.baseLpbM   = SENS.origB * 1000 * SENS.takePct / 100;     // base LPB revenue, $M
SENS.nonLpbM    = SENS.totalRevB * 1000 - SENS.baseLpbM;       // all other revenue, held fixed
SENS.baseEps    = SENS.niM / SENS.shares;                      // base EPS
SENS.basePe     = SENS.price / SENS.baseEps;                   // base fwd P/E

var SENS_INTRO = 'A single-point sensitivity on the two levers behind SoFi\'s Loan Platform Business: the annual origination volume and the take rate (the fee SoFi earns per dollar originated). LPB revenue = origination × take rate. Everything else in the model is held at its FY2026E base, so the change you make flows straight through to revenue, net income, EPS and the multiple. Drag the two sliders.';
var SENS_NOTE = 'Base case (FY2026E, Summit model): LPB origination $16.5B × 5.0% take = $825M LPB revenue, inside $4.66B total net revenue; net income $829M; 1,378M shares → EPS $0.60; at $17.57 that is ~29x forward earnings. Assumptions when you move the sliders: all non-LPB lines are held constant, incremental LPB revenue flows 100% to pre-tax (capital-light) and is taxed at 25%; share price and share count are held fixed. This is a back-of-envelope sensitivity, not a re-solved model.';

function sensRow(id, label, min, max, step, val, suffix){
  return '<div class="sens-ctrl">'+
    '<div class="sens-ctrl-l">'+esc(label)+'</div>'+
    '<input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'">'+
    '<div class="sens-ctrl-v" id="'+id+'V"></div>'+
    '<div class="sens-ctrl-u">'+esc(suffix)+'</div>'+
  '</div>';
}

function sensBody(c){
  var h = '';
  h += '<div class="ov-sec-h">LPB Sensitivity — origination × take rate</div>';
  h += '<p class="ov-lede">'+esc(SENS_INTRO)+'</p>';

  h += '<div class="sens-controls">'+
    sensRow('sensOrig', 'LPB origination (annual)', 2, 50, 0.5, SENS.origB, '$B') +
    sensRow('sensTake', 'Take rate (origination fee)', 1.0, 9.0, 0.1, SENS.takePct, '%') +
  '</div>';

  // The live equation line.
  h += '<div class="sens-eq" id="sensEq"></div>';

  // Output tiles (recomputed live).
  h += '<div class="ov-kpis" id="sensOut"></div>';

  h += '<div class="ov-foot">'+esc(SENS_NOTE)+'</div>';
  return h;
}

function sensCompute(origB, takePct){
  var lpbM    = origB * 1000 * takePct / 100;
  var dLpb    = lpbM - SENS.baseLpbM;
  var totalM  = SENS.nonLpbM + lpbM;
  var dNi     = dLpb * (1 - SENS.taxRate);
  var niM     = SENS.niM + dNi;
  var eps     = niM / SENS.shares;
  var pe      = SENS.price / eps;
  var implied = SENS.basePe * eps; // price if the base multiple were held
  return { lpbM:lpbM, dLpb:dLpb, totalM:totalM, niM:niM, dNi:dNi, eps:eps, pe:pe, implied:implied };
}

function sensSigned(v, money){
  var s = v >= 0 ? '+' : '−';
  return s + (money ? '$' : '') + Math.abs(v).toLocaleString(undefined, {maximumFractionDigits: money ? 0 : 2});
}

function renderSens(){
  var so = document.getElementById('sensOrig'), st = document.getElementById('sensTake');
  if (!so || !st) return;
  var origB = +so.value, takePct = +st.value;
  var ov = document.getElementById('sensOrigV'), tv = document.getElementById('sensTakeV');
  if (ov) ov.textContent = origB.toFixed(1);
  if (tv) tv.textContent = takePct.toFixed(1);

  var r = sensCompute(origB, takePct);
  var eq = document.getElementById('sensEq');
  if (eq) eq.innerHTML = '$'+origB.toFixed(1)+'B origination &nbsp;×&nbsp; '+takePct.toFixed(1)+'% take rate &nbsp;=&nbsp; <b>$'+Math.round(r.lpbM).toLocaleString()+'M</b> LPB revenue';

  var box = document.getElementById('sensOut');
  if (!box) return;
  function tile(l, v, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  var revPct = (r.totalM / (SENS.totalRevB*1000) - 1) * 100;
  var prcPct = (r.implied / SENS.price - 1) * 100;
  box.innerHTML =
    tile('LPB revenue', '$'+Math.round(r.lpbM).toLocaleString()+'M', sensSigned(r.dLpb, true)+'M vs base', r.dLpb>=0?'up':'down') +
    tile('Total net revenue', '$'+(r.totalM/1000).toFixed(2)+'B', sensSigned(revPct)+'% vs base', revPct>=0?'up':'down') +
    tile('Net income', '$'+Math.round(r.niM).toLocaleString()+'M', sensSigned(r.dNi, true)+'M vs base', r.dNi>=0?'up':'down') +
    tile('EPS (FY2026E)', '$'+r.eps.toFixed(2), sensSigned(r.eps-SENS.baseEps)+' vs $'+SENS.baseEps.toFixed(2), (r.eps-SENS.baseEps)>=0?'up':'down') +
    tile('Fwd P/E @ $'+SENS.price.toFixed(2), r.pe.toFixed(1)+'x', 'base '+SENS.basePe.toFixed(1)+'x', 'muted') +
    tile('Implied price @ '+SENS.basePe.toFixed(1)+'x', '$'+r.implied.toFixed(2), sensSigned(prcPct)+'% vs $'+SENS.price.toFixed(2), prcPct>=0?'up':'down');
}

function setupSensSliders(){
  var so = document.getElementById('sensOrig'), st = document.getElementById('sensTake');
  if (!so || !st) return;
  so.oninput = renderSens;
  st.oninput = renderSens;
  renderSens();
}

function buildSensTab(){ setupSensSliders(); }

// One expand/collapse accordion item.
function accItem(title, open, bodyHtml){
  return '<div class="lpb-acc-item'+(open ? ' open' : '')+'">'+
    '<button type="button" class="lpb-acc-h"><span>'+esc(title)+'</span><span class="lpb-acc-ic">'+(open ? '–' : '+')+'</span></button>'+
    '<div class="lpb-acc-body">'+bodyHtml+'</div>'+
  '</div>';
}

// Company logo via Clearbit, falling back to a Google favicon if Clearbit has no logo.
function logoImg(domain){
  return '<img class="lpb-pie-logo" src="https://logo.clearbit.com/'+domain+'" '+
    'onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+domain+'&sz=64\'" '+
    'alt="" loading="lazy">';
}

function nodeInner(n){
  return '<div class="lpb-node-ic">'+esc(n.ic)+'</div>'+
    '<div class="lpb-node-t">'+esc(n.t)+'</div>'+
    '<div class="lpb-node-d">'+esc(n.d)+'</div>';
}

// Placeholder body for tabs that are not built yet.
function soonBody(label){
  return '<div class="ovs-soon"><div class="ovs-soon-t">'+esc(label)+'</div>'+
    '<div class="ovs-soon-d">In development — building this next.</div></div>';
}

function html(c){
  var h = '<div class="ov ov-sofi" data-brand="SOFI">';
  // Sub-tab bar
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="members">Members</button>'+
    '<button type="button" class="ovt-tab" data-ovt="interest">Interest Income</button>'+
    '<button type="button" class="ovt-tab" data-ovt="fees">Fee Income</button>'+
    '<button type="button" class="ovt-tab" data-ovt="valuation">Valuation</button>'+
    '<button type="button" class="ovt-tab" data-ovt="sensitivity">Sensitivity</button>'+
  '</div>';
  // Panes
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="members" hidden>'+membersBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="interest" hidden>'+interestBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="fees" hidden>'+feeBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="valuation" hidden>'+valuationBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="sensitivity" hidden>'+sensBody(c)+'</div>';
  h += '</div>';
  return h;
}

// ─── Members chart ────────────────────────────────────────────────────────────
var BRAND = '#0E7CC0';   // SoFi blue

// Inline plugin: draw the member count (millions) and YoY growth above each bar.
var memLabels = {
  id: 'memLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    var yoy = chart.$yoy || [];
    meta.data.forEach(function(bar, i){
      var vK = chart.data.datasets[0].data[i];
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#1E2733';
      ctx.fillText(memM(vK) + 'M', bar.x, bar.y - 22);
      if (yoy[i] != null) {
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = BRAND;
        ctx.fillText('+' + yoy[i].toFixed(1) + '%', bar.x, bar.y - 7);
      }
      ctx.restore();
    });
  }
};

function buildMemChart(){
  var cv = document.getElementById('sofiChartMem');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartMem) { _chartMem.destroy(); _chartMem = null; }
  _chartMem = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderRadius: 4, maxBarThickness: 64 }] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:34, bottom:4 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){
          var yy = (_chartMem && _chartMem.$yoy) ? _chartMem.$yoy[ctx.dataIndex] : null;
          return Number(ctx.parsed.y * 1000).toLocaleString() + ' members' + (yy != null ? '  (+' + yy.toFixed(1) + '% YoY)' : '');
        } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, grace:'14%' },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    },
    plugins: [memLabels]
  });
}

// Update the member chart + readout for the selected [a, b] year window.
function renderMem(a, b){
  if (!_chartMem) return;
  var labels = [], data = [], colors = [], yoy = [];
  for (var i = a; i <= b; i++){
    labels.push(MEM_YEARS[i]);
    data.push(MEM_K[i]);
    colors.push(i >= MEM_FIRST_EST ? 'rgba(14,124,192,0.40)' : BRAND);
    yoy.push(memYoY(i)); // YoY vs. the true prior year (null for 2020)
  }
  _chartMem.data.labels = labels;
  _chartMem.data.datasets[0].data = data;
  _chartMem.data.datasets[0].backgroundColor = colors;
  _chartMem.$yoy = yoy;
  _chartMem.update('none');
}

// Wire the dual-handle year slider. Idempotent (uses oninput assignment).
function setupMemSlider(){
  var mn = document.getElementById('memMin'), mx = document.getElementById('memMax');
  var fill = document.getElementById('memFill'), read = document.getElementById('memReadout');
  if (!mn || !mx || !fill || !read) return;
  var maxI = MEM_YEARS.length - 1;
  function apply(){
    var a = +mn.value, b = +mx.value;
    fill.style.left  = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    renderMem(a, b);
    var cg = memCAGR(a, b);
    read.innerHTML =
      '<span class="sg-range">' + MEM_YEARS[a] + ' → ' + MEM_YEARS[b] + '</span>' +
      '<span class="sg-stat"><b>' + memM(MEM_K[a]) + 'M</b> → <b>' + memM(MEM_K[b]) + 'M</b> members</span>' +
      (cg != null ? '<span class="sg-stat sg-cagr">CAGR <b>' + cg.toFixed(1) + '%</b></span>' : '<span class="sg-stat">CAGR —</span>');
  }
  // Keep the two handles from crossing (min stays at least one year below max).
  mn.oninput = function(){ if (+mn.value >= +mx.value) mn.value = +mx.value - 1; apply(); };
  mx.oninput = function(){ if (+mx.value <= +mn.value) mx.value = +mn.value + 1; apply(); };
  apply();
}

function buildMembersTab(){
  buildMemChart();
  setupMemSlider();
}

// ─── Interest Income charts (generic ranged loan-origination bar chart) ───────
var _loanCharts = {}; // cfg.key -> Chart instance

// Inline plugin: draw the volume ($B) and YoY (signed; red when negative) above each bar.
var loanLabels = {
  id: 'loanLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    var yoy = chart.$yoy || [];
    meta.data.forEach(function(bar, i){
      var vM = chart.data.datasets[0].data[i];
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#1E2733';
      ctx.fillText('$' + loanB(vM) + 'B', bar.x, bar.y - 22);
      if (yoy[i] != null) {
        var g = yoy[i];
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = g < 0 ? '#C0392B' : BRAND;
        ctx.fillText((g < 0 ? '−' : '+') + Math.abs(g).toFixed(1) + '%', bar.x, bar.y - 7);
      }
      ctx.restore();
    });
  }
};

function buildLoanChart(cfg){
  var cv = document.getElementById('sofiChart_' + cfg.key);
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_loanCharts[cfg.key]) { _loanCharts[cfg.key].destroy(); _loanCharts[cfg.key] = null; }
  _loanCharts[cfg.key] = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderRadius: 4, maxBarThickness: 64 }] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:34, bottom:4 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){
          var ch = _loanCharts[cfg.key];
          var yy = (ch && ch.$yoy) ? ch.$yoy[ctx.dataIndex] : null;
          var sign = yy == null ? '' : '  (' + (yy < 0 ? '−' : '+') + Math.abs(yy).toFixed(1) + '% YoY)';
          return '$' + loanB(ctx.parsed.y) + 'B originated' + sign;
        } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, grace:'14%' },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    },
    plugins: [loanLabels]
  });
}

// Update one loan chart + its readout for the selected [a, b] year window.
function renderLoan(cfg, a, b){
  var ch = _loanCharts[cfg.key];
  if (!ch) return;
  var labels = [], data = [], colors = [], yoy = [];
  for (var i = a; i <= b; i++){
    labels.push(cfg.years[i]);
    data.push(cfg.dataM[i]);
    colors.push(i >= cfg.firstEst ? 'rgba(14,124,192,0.40)' : BRAND);
    yoy.push(loanYoY(cfg, i)); // YoY vs. the true prior year
  }
  ch.data.labels = labels;
  ch.data.datasets[0].data = data;
  ch.data.datasets[0].backgroundColor = colors;
  ch.$yoy = yoy;
  ch.update('none');
}

// Wire one loan chart's dual-handle slider. Idempotent (oninput assignment).
function setupLoanSlider(cfg){
  var mn = document.getElementById(cfg.key + 'Min'), mx = document.getElementById(cfg.key + 'Max');
  var fill = document.getElementById(cfg.key + 'Fill'), read = document.getElementById(cfg.key + 'Readout');
  if (!mn || !mx || !fill || !read) return;
  var maxI = cfg.years.length - 1;
  function apply(){
    var a = +mn.value, b = +mx.value;
    fill.style.left  = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    renderLoan(cfg, a, b);
    var cg = loanCAGR(cfg, a, b);
    read.innerHTML =
      '<span class="sg-range">' + cfg.years[a] + ' → ' + cfg.years[b] + '</span>' +
      '<span class="sg-stat"><b>$' + loanB(cfg.dataM[a]) + 'B</b> → <b>$' + loanB(cfg.dataM[b]) + 'B</b> originated</span>' +
      (cg != null ? '<span class="sg-stat sg-cagr">CAGR <b>' + cg.toFixed(1) + '%</b></span>' : '<span class="sg-stat">CAGR —</span>');
  }
  mn.oninput = function(){ if (+mn.value >= +mx.value) mn.value = +mx.value - 1; apply(); };
  mx.oninput = function(){ if (+mx.value <= +mn.value) mx.value = +mn.value + 1; apply(); };
  apply();
}

function buildInterestTab(){
  LOANS.forEach(function(cfg){ buildLoanChart(cfg); setupLoanSlider(cfg); });
}

// ─── Fee Income — nested (second-level) sub-tabs ──────────────────────────────
// Builds whichever nested Fee Income sub-tab is active. Chart builders for each
// nested pane will be dispatched here as they are developed (LPB first).
var _lpbPie = null;
// Inline plugin: total committed capital in the center of the doughnut.
var lpbPieCenter = {
  id: 'lpbPieCenter',
  afterDatasetsDraw: function(chart){
    var a = chart.chartArea; if (!a) return;
    var cx = (a.left + a.right) / 2, cy = (a.top + a.bottom) / 2;
    var ctx = chart.ctx;
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1E2733';
    ctx.font = '800 23px Inter, sans-serif';
    ctx.fillText('$' + LPB_PIE_TOTAL.toFixed(1) + 'B', cx, cy - 8);
    ctx.fillStyle = '#8A93A0';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText('committed', cx, cy + 13);
    ctx.restore();
  }
};
// Doughnut of LPB capital commitments by partner (total shown in the center). Lives inside
// a collapsed accordion, so it is built when its section first becomes visible.
function buildLpbPie(){
  var cv = document.getElementById('sofiLpbPie');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return; // not visible yet
  if (_lpbPie) return;                                                 // already built
  _lpbPie = new Chart(cv.getContext('2d'), {
    type: 'doughnut',
    data: { labels: LPB_PIE.map(function(p){ return p.name; }),
      datasets: [{ data: LPB_PIE.map(function(p){ return p.v; }),
        backgroundColor: LPB_PIE.map(function(p){ return p.clr; }),
        borderColor: '#fff', borderWidth: 2 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(ctx){
          return ' ' + ctx.label + ': $' + Number(ctx.parsed).toFixed(1) + 'B (' + Math.round(ctx.parsed / LPB_PIE_TOTAL * 100) + '%)';
        } } }
      }
    },
    plugins: [lpbPieCenter]
  });
}

// ── Technology Platform combo chart — accounts (bars) + revenue (line) ──
var _techChart = null;
// Inline plugin: account count above each bar, revenue $ above each line point.
var techChartLabels = {
  id: 'techChartLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var bars = chart.getDatasetMeta(0).data;
    bars.forEach(function(bar, i){                              // bars = accounts
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = i >= TECH_FIRST_EST ? 'rgba(14,124,192,0.65)' : BRAND;
      ctx.fillText(chart.data.datasets[0].data[i].toFixed(1) + 'M', bar.x, bar.y - 8);
      ctx.restore();
    });
    chart.getDatasetMeta(1).data.forEach(function(pt, i){       // line = revenue
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 11.5px Inter, sans-serif';
      ctx.fillStyle = '#1E2733';
      // Put the label below the point when the revenue line sits at/below the bar top,
      // so the account label (above the bar) and the revenue label never collide.
      var bar = bars[i];
      var y = (bar && pt.y > bar.y - 20) ? pt.y + 16 : pt.y - 11;
      ctx.fillText('$' + Math.round(chart.data.datasets[1].data[i]) + 'M', pt.x, y);
      ctx.restore();
    });
  }
};
function buildTechChart(){
  var cv = document.getElementById('sofiTechChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return; // not visible yet
  if (_techChart) { _techChart.destroy(); _techChart = null; }
  var barColors  = TECH_ACCTS_M.map(function(_, i){ return i >= TECH_FIRST_EST ? 'rgba(14,124,192,0.38)' : 'rgba(14,124,192,0.85)'; });
  var ptBorders  = TECH_REV_M.map(function(_, i){ return i >= TECH_FIRST_EST ? '#8A93A0' : '#1E2733'; });
  _techChart = new Chart(cv.getContext('2d'), {
    data: {
      labels: TECH_CHART_YEARS,
      datasets: [
        { type:'bar', label:'Enabled accounts', data:TECH_ACCTS_M, yAxisID:'yA',
          backgroundColor:barColors, borderRadius:4, maxBarThickness:62, order:2 },
        { type:'line', label:'Net revenue', data:TECH_REV_M, yAxisID:'yR',
          borderColor:'#1E2733', borderWidth:2.5, tension:0.3, order:1,
          // Dash the line once it enters the estimate years.
          segment:{ borderDash:function(ctx){ return ctx.p1DataIndex >= TECH_FIRST_EST ? [5,4] : undefined; } },
          pointBackgroundColor:'#fff', pointBorderColor:ptBorders, pointBorderWidth:2, pointRadius:4 }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:30, bottom:4 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){
          return ctx.datasetIndex === 0
            ? ' ' + ctx.parsed.y.toFixed(1) + 'M enabled accounts'
            : ' $' + ctx.parsed.y.toFixed(1) + 'M net revenue';
        } } }
      },
      scales:{
        yA:{ position:'left',  display:false, beginAtZero:true, suggestedMax:240 },
        yR:{ position:'right', beginAtZero:true, suggestedMax:420,
             grid:{ display:false },
             ticks:{ color:'#8A93A0', font:{ size:11 }, callback:function(v){ return '$' + v + 'M'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    },
    plugins: [techChartLabels]
  });
}

function buildFeeTab(){
  var root = document.querySelector('.ov-sofi');
  if (!root) return;
  var act = root.querySelector('.ovf-tab.active');
  var k = act ? act.getAttribute('data-ovf') : '';
  if (k === 'lpb') requestAnimationFrame(function(){
    buildLoanChart(LPB_ORIG); setupLoanSlider(LPB_ORIG); // origination chart (visible)
    buildLpbPie();                                       // commitments pie (inside accordion)
  });
  if (k === 'tech') requestAnimationFrame(buildTechChart);
  // if (k === 'fs')   requestAnimationFrame(buildFeeFS);
}

// ─── Valuation: Actuals vs. Estimates engine ─────────────────────────────────
var _aveChart = null;
var _aveMetric = 'rev';
var AVE_GREEN = '#1E9E62', AVE_RED = '#C0392B', AVE_GRAY = '#C7CED6';

function avePct(v){ return (v < 0 ? '−' : '+') + Math.abs(v).toFixed(1) + '%'; }

// Inline plugin: zero baseline + the surprise % on each diverging bar.
var aveLabels = {
  id: 'aveLabels',
  afterDatasetsDraw: function(chart){
    var surp = chart.$surp || [];
    var bars = chart.getDatasetMeta(0).data;
    var ctx = chart.ctx, area = chart.chartArea;
    if (area){ // zero baseline
      var y0 = chart.scales.y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = '#D7DDE4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(area.left, y0); ctx.lineTo(area.right, y0); ctx.stroke();
      ctx.restore();
    }
    for (var i = 0; i < surp.length; i++){
      var bar = bars[i]; if (!bar) continue;
      var above = surp[i] >= 0;                          // actual vs estimate (direction)
      var fav = (chart.$exp ? -surp[i] : surp[i]) >= 0;  // favorable outcome? (expenses flip)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = fav ? AVE_GREEN : AVE_RED;
      ctx.fillText((above ? '▲ ' : '▼ ') + avePct(surp[i]), bar.x, above ? bar.y - 7 : bar.y + 15);
      ctx.restore();
    }
  }
};

// Single diverging-bar chart: surprise % per quarter (green = beat, red = miss).
function buildAveChart(){
  var cv = document.getElementById('sofiAveChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_aveChart) { _aveChart.destroy(); _aveChart = null; }
  _aveChart = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [
      { label:'Surprise', data:[], backgroundColor:[], borderRadius:3, maxBarThickness:56 }
    ] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:24, bottom:22 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ return (_aveChart.$q || [])[items[0].dataIndex] || ''; },
          label:function(ctx){
            var i = ctx.dataIndex, m = AVE_METRICS[_aveMetric];
            return [ 'Estimate: ' + aveFmt(m, (_aveChart.$est || [])[i]),
                     'Actual: '   + aveFmt(m, (_aveChart.$act || [])[i]),
                     'Surprise: ' + avePct((_aveChart.$surp || [])[i]) ];
          }
        } }
      },
      scales:{
        y:{ display:false, grace:'22%' },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }
      }
    },
    plugins: [aveLabels]
  });
}

// Compute the beat/miss analytics for metric m over the window [a, b].
function computeAveStats(m, a, b){
  var surp = [], beats = 0;
  // "Beat"/best/worst are judged by FAVORABILITY: for expenses (m.exp) coming in
  // below estimate is favorable, so the favorable-signed value flips.
  var best = { f:-Infinity, s:0, q:'' }, worst = { f:Infinity, s:0, q:'' };
  for (var i = a; i <= b; i++){
    var s = aveSurprise(m, i);
    var f = m.exp ? -s : s;
    surp.push(s);
    if (f >= 0) beats++;
    if (f > best.f) { best = { f:f, s:s, q:m.quarters[i] }; }
    if (f < worst.f) { worst = { f:f, s:s, q:m.quarters[i] }; }
  }
  var n = surp.length;
  var sum = surp.reduce(function(t, v){ return t + v; }, 0);
  var sumAbs = surp.reduce(function(t, v){ return t + Math.abs(v); }, 0);
  var sorted = surp.slice().sort(function(x, y){ return x - y; });
  var mid = Math.floor(n / 2);
  var median = n === 0 ? 0 : (n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2);
  var avg = n ? sum / n : 0;
  return {
    n: n, beats: beats, misses: n - beats, exp: !!m.exp,
    beatRate: n ? beats / n * 100 : 0, missRate: n ? (n - beats) / n * 100 : 0,
    avg: avg, avgFav: m.exp ? -avg : avg, avgAbs: n ? sumAbs / n : 0,
    median: median, medFav: m.exp ? -median : median,
    best: best, worst: worst,
    last: { s: surp[n - 1], f: m.exp ? -surp[n - 1] : surp[n - 1], q: m.quarters[b] }
  };
}

function renderAveStats(m, a, b){
  var box = document.getElementById('aveStats');
  var scope = document.getElementById('aveStatScope');
  if (!box) return;
  var s = computeAveStats(m, a, b);
  if (scope) scope.textContent = '· ' + m.quarters[a] + '–' + m.quarters[b] + ' · ' + s.n + ' quarters';
  function tile(l, v, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  var beatDir = s.beatRate >= s.missRate ? 'up' : 'down';
  // Expense lines: "beat" = came in under estimate; bias wording flips.
  var beatSub = s.beats + ' of ' + s.n + (s.exp ? ' under estimate' : ' above estimate');
  var missSub = s.misses + ' of ' + s.n + (s.exp ? ' over estimate' : ' below estimate');
  var avgSub  = s.exp ? (s.avg>=0 ? 'we under-budgeted (spent more)' : 'we over-budgeted (spent less)')
                      : (s.avg>=0 ? 'we ran conservative' : 'we ran optimistic');
  var lastSub = s.exp ? (s.last.f>=0 ? 'under estimate' : 'over estimate')
                      : (s.last.f>=0 ? 'beat estimate' : 'missed estimate');
  box.innerHTML =
    tile('Beat rate', s.beatRate.toFixed(0)+'%', beatSub, beatDir) +
    tile('Miss rate', s.missRate.toFixed(0)+'%', missSub, s.missRate>s.beatRate?'down':'muted') +
    tile('Avg surprise', avePct(s.avg), avgSub, s.avgFav>=0?'up':'down') +
    tile('Median surprise', avePct(s.median), 'middle quarter', s.medFav>=0?'up':'down') +
    tile('Avg gap (abs)', s.avgAbs.toFixed(1)+'%', 'typical distance from estimate', 'muted') +
    tile('Biggest beat', avePct(s.best.s), s.best.q, 'up') +
    tile('Biggest miss', avePct(s.worst.s), s.worst.q, 'down') +
    tile('Latest ('+s.last.q+')', avePct(s.last.s), lastSub, s.last.f>=0?'up':'down');
}

// Update chart + readout + stats for the selected window.
function renderAve(a, b){
  var m = AVE_METRICS[_aveMetric];
  if (_aveChart){
    var labels = [], est = [], act = [], surp = [], colors = [];
    for (var i = a; i <= b; i++){
      var s = aveSurprise(m, i);
      labels.push(m.quarters[i]); est.push(m.est[i]); act.push(m.act[i]);
      surp.push(+s.toFixed(1)); colors.push((m.exp ? -s : s) >= 0 ? AVE_GREEN : AVE_RED);
    }
    _aveChart.data.labels = labels;
    _aveChart.data.datasets[0].data = surp;
    _aveChart.data.datasets[0].backgroundColor = colors;
    _aveChart.$surp = surp; _aveChart.$est = est; _aveChart.$act = act; _aveChart.$q = labels; _aveChart.$exp = !!m.exp;
    _aveChart.update('none');
  }
  var read = document.getElementById('aveReadout');
  if (read){
    var sa = aveSurprise(m, a), sb = aveSurprise(m, b);
    read.innerHTML =
      '<span class="sg-range">'+m.quarters[a]+' → '+m.quarters[b]+'</span>'+
      '<span class="sg-stat">est <b>'+aveFmt(m, m.est[b])+'</b> vs act <b>'+aveFmt(m, m.act[b])+'</b></span>'+
      '<span class="sg-stat '+(sb>=0?'sg-cagr':'')+'">'+m.quarters[b]+' surprise <b>'+avePct(sb)+'</b></span>';
  }
  renderAveStats(m, a, b);
}

// (Re)wire the quarter-window slider for the active metric. Resets to the full range.
function setupAveSlider(){
  var mn = document.getElementById('aveMin'), mx = document.getElementById('aveMax');
  var fill = document.getElementById('aveFill'), read = document.getElementById('aveReadout');
  if (!mn || !mx || !fill || !read) return;
  var m = AVE_METRICS[_aveMetric];
  var maxI = m.quarters.length - 1;
  mn.max = maxI; mx.max = maxI; mn.value = 0; mx.value = maxI;
  var e0 = document.getElementById('aveEnd0'), e1 = document.getElementById('aveEnd1');
  if (e0) e0.textContent = m.quarters[0];
  if (e1) e1.textContent = m.quarters[maxI];
  function apply(){
    var a = +mn.value, b = +mx.value;
    fill.style.left  = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    renderAve(a, b);
  }
  mn.oninput = function(){ if (+mn.value >= +mx.value) mn.value = +mx.value - 1; apply(); };
  mx.oninput = function(){ if (+mx.value <= +mn.value) mx.value = +mn.value + 1; apply(); };
  apply();
}

function buildAveTab(){
  buildAveChart();
  setupAveSlider();
}

// Switch the metric (Revenue / Adj. EBITDA / Adj. Net Income).
function switchAveMetric(root, k){
  if (!AVE_METRICS[k]) return;
  _aveMetric = k;
  root.querySelectorAll('.ave-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ave') === k); });
  var m = AVE_METRICS[k];
  var t = document.getElementById('aveChartT');
  if (t) t.innerHTML = esc(m.label) + ' — surprise vs estimate <span>(%, per quarter · hover for $)</span>';
  var note = document.getElementById('aveNote');
  if (note) note.textContent = m.note;
  setupAveSlider(); // resets window to full range and re-renders chart + stats
}

// Switch a nested Fee Income sub-tab.
function showOvf(root, key){
  root.querySelectorAll('.ovf-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovf') === key); });
  root.querySelectorAll('.ovf-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovf') !== key); });
  buildFeeTab();
}

// Switch top-level sub-tab. Builds the tab's chart(s) lazily the first time it becomes visible.
function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'members') requestAnimationFrame(buildMembersTab);
  if (key === 'interest') requestAnimationFrame(buildInterestTab);
  if (key === 'fees') requestAnimationFrame(buildFeeTab);
  if (key === 'valuation') requestAnimationFrame(buildAveTab);
  if (key === 'sensitivity') requestAnimationFrame(buildSensTab);
}

function init(c){
  var root = document.querySelector('.ov-sofi');
  if (!root) return;
  // Idempotent wiring (init may run again when the Overview pane is re-activated).
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  root.querySelectorAll('.ovf-tab').forEach(function(btn){
    btn.onclick = function(){ showOvf(root, btn.getAttribute('data-ovf')); };
  });
  // Valuation → Actuals vs. Estimates: metric selector pills.
  root.querySelectorAll('.ave-pill').forEach(function(btn){
    btn.onclick = function(){ switchAveMetric(root, btn.getAttribute('data-ave')); };
  });
  // LPB accordion (progressive disclosure). Build the pie when its section first opens.
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){
    btn.onclick = function(){
      var item = btn.parentElement;
      var open = item.classList.toggle('open');
      var ic = btn.querySelector('.lpb-acc-ic');
      if (ic) ic.textContent = open ? '–' : '+';
      if (open) requestAnimationFrame(buildLpbPie);
    };
  });
  var active = root.querySelector('.ovt-tab.active');
  var activeKey = active ? active.getAttribute('data-ovt') : '';
  if (activeKey === 'members') requestAnimationFrame(buildMembersTab);
  if (activeKey === 'interest') requestAnimationFrame(buildInterestTab);
  if (activeKey === 'fees') requestAnimationFrame(buildFeeTab);
}

export var sofiOverview = { html: html, init: init };
