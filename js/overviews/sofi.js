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

// "Valuation" pane — split into two nested sub-tabs: Actuals vs. Estimates
// (our Summit DCF model vs reported) and Actuals vs. Guidance (SoFi's own
// published guidance vs reported).
function valuationBody(c){
  var h = '';
  h += '<div class="ovv-tabs">'+
    '<button type="button" class="ovv-tab active" data-ovv="estimates">Actuals vs Estimates</button>'+
    '<button type="button" class="ovv-tab" data-ovv="guidance">Actuals vs Guidance</button>'+
  '</div>';
  h += '<div class="ovv-pane" data-ovv="estimates">'+aveBody(c)+'</div>';
  h += '<div class="ovv-pane" data-ovv="guidance" hidden>'+guidanceBody(c)+'</div>';
  return h;
}

// Actuals vs. Estimates view — our Summit DCF model's estimate vs SoFi's reported actual.
function aveBody(c){
  var def = AVE_METRICS.rev;
  var maxI = def.quarters.length - 1;
  var h = '';

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

  // ── Estimate revisions across snapshots (vintage chart) ──
  h += '<div class="ov-sec-h evo-sec-h">How our estimates have evolved across snapshots</div>';
  h += '<p class="ov-lede">'+esc(EVO_INTRO)+'</p>';
  h += '<div class="evo-pills">'+['rev','ebitda','ani'].map(function(k){
    return '<button type="button" class="evo-pill'+(k===_evoMetric?' active':'')+'" data-evo="'+k+'">'+esc(EVO_METRICS[k].short)+'</button>';
  }).join('')+'</div>';
  h += '<div class="ov-chart-card"><div class="ov-chart-t" id="evoChartT"></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiEvoChart"></canvas></div></div>';
  h += '<div class="ov-subh">Net revision since first snapshot <span class="ave-subh-note" id="evoScope"></span></div>';
  h += '<div class="ov-kpis" id="evoStats"></div>';
  h += '<div class="ov-foot" id="evoNote"></div>';
  h += '<div class="ov-foot">'+esc(EVO_SOURCE)+'</div>';

  return h;
}

// ─── Valuation → Actuals vs. Guidance ────────────────────────────────────────
// SoFi's own published guidance (full-year, revised each quarter; plus next-quarter)
// vs what it actually reported. Sourced from SoFi quarterly earnings releases
// (SEC EDGAR Form 8-K, Exhibit 99.1), FY2021–FY2026. Revenue / EBITDA / Net income
// in US$ millions; EPS in US$. Guidance ranges stored as {lo, hi} (lo===hi means
// SoFi gave a single point). Midpoint drives the line and the raise/cut math; the
// full range shows on hover.
var GUID_SOURCE = 'Source: SoFi quarterly earnings releases (SEC EDGAR Form 8-K, Exhibit 99.1), FY2021–FY2026 — full-year guidance as issued at each earnings date, and next-quarter guidance, vs reported actuals. Guidance ranges are SoFi\'s stated low–high; the chart uses the midpoint. Net Income / EPS were guided on a GAAP basis through mid-2025 and on an Adjusted basis thereafter; the FY2024 actual Net Income / EPS shown is the adjusted figure (it excludes a one-time ~$271M deferred-tax benefit) for a like-for-like comparison with the guide. Quarters where SoFi gave no discrete quarterly guide (full-year-only or half-year-block periods, and near-zero early EBITDA guides) are omitted from the Quarterly view.';

// Annual full-year guidance evolution. g = guidance points in chronological order
// (Initial = issued at the prior-year Q4 release; then revised at Q1/Q2/Q3). a = the
// reported full-year actual (null while the year is still in progress).
var GUID_ANNUAL = {
  rev: {
    short:'Adj. Revenue', label:'Adjusted Net Revenue', unit:'usd',
    years:[
      { fy:'FY21', g:[ {s:'Initial',lo:980,hi:980}, {s:'Q3',lo:1002,hi:1012} ], a:1010.3 },
      { fy:'FY22', g:[ {s:'Initial',lo:1570,hi:1570}, {s:'Q1',lo:1505,hi:1510}, {s:'Q2',lo:1508,hi:1513}, {s:'Q3',lo:1517,hi:1522} ], a:1540.5 },
      { fy:'FY23', g:[ {s:'Initial',lo:1925,hi:2000}, {s:'Q1',lo:1955,hi:2020}, {s:'Q2',lo:1974,hi:2034}, {s:'Q3',lo:2045,hi:2065} ], a:2073.9 },
      { fy:'FY24', g:[ {s:'Initial',lo:2365,hi:2405}, {s:'Q1',lo:2390,hi:2430}, {s:'Q2',lo:2425,hi:2465}, {s:'Q3',lo:2535,hi:2550} ], a:2606.2 },
      { fy:'FY25', g:[ {s:'Initial',lo:3200,hi:3275}, {s:'Q1',lo:3235,hi:3310}, {s:'Q2',lo:3375,hi:3375}, {s:'Q3',lo:3540,hi:3540} ], a:3591.4 },
      { fy:'FY26', g:[ {s:'Initial',lo:4655,hi:4655}, {s:'Q1',lo:4655,hi:4655} ], a:null }
    ],
    note:'Full-year Adjusted Net Revenue guidance ($M) at each update vs the reported actual. SoFi guides a range; the line is the midpoint and the band/hover shows the range. The dashed green line marks the actual. FY21 only has an initial point and a Q3 raise (SoFi went public mid-2021). SoFi has beaten its own full-year revenue guide every single year.'
  },
  ebitda: {
    short:'Adj. EBITDA', label:'Adjusted EBITDA', unit:'usd',
    years:[
      { fy:'FY21', g:[ {s:'Initial',lo:27,hi:27}, {s:'Q3',lo:28,hi:31} ], a:30.2 },
      { fy:'FY22', g:[ {s:'Initial',lo:180,hi:180}, {s:'Q1',lo:100,hi:105}, {s:'Q2',lo:104,hi:109}, {s:'Q3',lo:115,hi:120} ], a:143.3 },
      { fy:'FY23', g:[ {s:'Initial',lo:260,hi:280}, {s:'Q1',lo:268,hi:288}, {s:'Q2',lo:333,hi:343}, {s:'Q3',lo:386,hi:396} ], a:431.7 },
      { fy:'FY24', g:[ {s:'Initial',lo:580,hi:590}, {s:'Q1',lo:590,hi:600}, {s:'Q2',lo:605,hi:615}, {s:'Q3',lo:640,hi:645} ], a:666.5 },
      { fy:'FY25', g:[ {s:'Initial',lo:845,hi:865}, {s:'Q1',lo:875,hi:895}, {s:'Q2',lo:960,hi:960}, {s:'Q3',lo:1035,hi:1035} ], a:1053.9 },
      { fy:'FY26', g:[ {s:'Initial',lo:1600,hi:1600}, {s:'Q1',lo:1600,hi:1600} ], a:null }
    ],
    note:'Full-year Adjusted EBITDA guidance ($M) at each update vs the reported actual. Note FY22: SoFi CUT the initial $180M guide to ~$100M at Q1 (federal student-loan moratorium hit lending), then raised it twice — the actual ($143M) still beat the final guide. Every other year, guidance only went up.'
  },
  ni: {
    short:'Net Income', label:'Net Income', unit:'usd',
    years:[
      { fy:'FY24', g:[ {s:'Initial',lo:95,hi:105}, {s:'Q1',lo:165,hi:175}, {s:'Q2',lo:175,hi:185}, {s:'Q3',lo:204,hi:206} ], a:227.2 },
      { fy:'FY25', g:[ {s:'Initial',lo:285,hi:305}, {s:'Q1',lo:320,hi:330}, {s:'Q2',lo:370,hi:370}, {s:'Q3',lo:455,hi:455} ], a:481.3 },
      { fy:'FY26', g:[ {s:'Initial',lo:825,hi:825}, {s:'Q1',lo:825,hi:825} ], a:null }
    ],
    note:'Full-year net income guidance ($M). SoFi did not guide net income before FY2024. It guided GAAP net income through mid-2025, then switched to ADJUSTED net income (Q3 2025 on). The FY24 actual shown is the $227M ADJUSTED figure — the headline GAAP $499M was inflated by a one-time ~$271M deferred-tax benefit, so adjusted is the apples-to-apples comparison vs the $204–206M guide.'
  },
  eps: {
    short:'EPS', label:'Diluted EPS', unit:'eps',
    years:[
      { fy:'FY24', g:[ {s:'Initial',lo:0.07,hi:0.08}, {s:'Q1',lo:0.08,hi:0.09}, {s:'Q2',lo:0.09,hi:0.10}, {s:'Q3',lo:0.11,hi:0.12} ], a:0.15 },
      { fy:'FY25', g:[ {s:'Initial',lo:0.25,hi:0.27}, {s:'Q1',lo:0.27,hi:0.28}, {s:'Q2',lo:0.31,hi:0.31}, {s:'Q3',lo:0.37,hi:0.37} ], a:0.39 },
      { fy:'FY26', g:[ {s:'Initial',lo:0.60,hi:0.60}, {s:'Q1',lo:0.60,hi:0.60} ], a:null }
    ],
    note:'Full-year diluted EPS guidance ($). Not guided before FY2024. GAAP through mid-2025, then ADJUSTED (Q3 2025 on). The FY24 actual shown is the $0.15 ADJUSTED EPS (GAAP $0.39 included the one-time deferred-tax benefit) — the like-for-like comparison vs the $0.11–0.12 guide.'
  }
};

// Quarterly next-quarter guidance vs reported actual. g = {lo, hi} guide, or null when
// SoFi gave no discrete quarterly guide that period (full-year-only / half-year block /
// near-zero early EBITDA). a = reported actual. Only quarters with a guide are charted.
var GUID_QTR = {
  rev: {
    short:'Adj. Revenue', label:'Adjusted Net Revenue', unit:'usd',
    note:'Next-quarter Adjusted Net Revenue guidance vs the actual SoFi reported, expressed as the surprise (actual vs guide midpoint). SoFi has beaten its quarterly revenue guide every single quarter it gave one. Periods with no discrete quarterly guide (it guided only the full year, or an H2 block) are omitted.',
    q:[ {q:'3Q21',g:{lo:245,hi:255},a:277.2}, {q:'4Q21',g:{lo:272,hi:282},a:279.9},
        {q:'1Q22',g:{lo:280,hi:285},a:321.7}, {q:'2Q22',g:{lo:330,hi:340},a:356.1}, {q:'3Q22',g:null,a:419.3}, {q:'4Q22',g:null,a:443.4},
        {q:'1Q23',g:{lo:430,hi:440},a:460.2}, {q:'2Q23',g:{lo:470,hi:480},a:488.8}, {q:'3Q23',g:null,a:530.7}, {q:'4Q23',g:null,a:594.2},
        {q:'1Q24',g:{lo:550,hi:560},a:580.6}, {q:'2Q24',g:{lo:555,hi:565},a:597.0}, {q:'3Q24',g:{lo:625,hi:645},a:689.4}, {q:'4Q24',g:null,a:739.1},
        {q:'1Q25',g:{lo:725,hi:745},a:770.7}, {q:'2Q25',g:{lo:785,hi:805},a:858.2}, {q:'3Q25',g:null,a:949.6}, {q:'4Q25',g:null,a:1012.8},
        {q:'1Q26',g:{lo:1040,hi:1040},a:1087.2} ]
  },
  ebitda: {
    short:'Adj. EBITDA', label:'Adjusted EBITDA', unit:'usd',
    note:'Next-quarter Adjusted EBITDA guidance vs actual (surprise = actual vs guide midpoint). 2021–2022 quarterly EBITDA guides were near zero (single-digit $M), which makes a percentage surprise meaningless, so the series starts in 1Q23. Periods with no discrete quarterly guide are omitted.',
    q:[ {q:'1Q23',g:{lo:40,hi:45},a:75.7}, {q:'2Q23',g:{lo:50,hi:60},a:76.8}, {q:'3Q23',g:null,a:98.0}, {q:'4Q23',g:null,a:181.2},
        {q:'1Q24',g:{lo:110,hi:120},a:144.4}, {q:'2Q24',g:{lo:115,hi:125},a:137.9}, {q:'3Q24',g:{lo:160,hi:165},a:186.2}, {q:'4Q24',g:null,a:198.0},
        {q:'1Q25',g:{lo:175,hi:185},a:210.3}, {q:'2Q25',g:{lo:200,hi:210},a:249.1}, {q:'3Q25',g:null,a:276.9}, {q:'4Q25',g:null,a:317.6},
        {q:'1Q26',g:{lo:300,hi:300},a:339.9} ]
  },
  ni: {
    short:'Net Income', label:'Net Income', unit:'usd',
    note:'Next-quarter net income guidance vs actual (surprise = actual vs guide midpoint). SoFi began giving quarterly net-income guides in FY2024. Guide levels are small in $ terms, so percentage surprises are large and volatile. Periods with no discrete quarterly guide are omitted.',
    q:[ {q:'1Q24',g:{lo:10,hi:20},a:88.0}, {q:'2Q24',g:{lo:5,hi:10},a:17.4}, {q:'3Q24',g:{lo:40,hi:45},a:60.7}, {q:'4Q24',g:null,a:332.5},
        {q:'1Q25',g:{lo:30,hi:40},a:71.1}, {q:'2Q25',g:{lo:60,hi:70},a:97.3}, {q:'3Q25',g:null,a:139.4}, {q:'4Q25',g:null,a:173.5},
        {q:'1Q26',g:{lo:160,hi:160},a:166.7} ]
  },
  eps: {
    short:'EPS', label:'Diluted EPS', unit:'eps',
    note:'Next-quarter diluted EPS guidance vs actual (surprise = actual vs guide midpoint). SoFi only gave a quarterly EPS point in select quarters from 3Q24 on, so this series is sparse. Periods with no quarterly EPS guide are omitted.',
    q:[ {q:'3Q24',g:{lo:0.04,hi:0.04},a:0.05}, {q:'1Q25',g:{lo:0.03,hi:0.03},a:0.06}, {q:'2Q25',g:{lo:0.05,hi:0.06},a:0.08}, {q:'1Q26',g:{lo:0.12,hi:0.12},a:0.12} ]
  }
};

// "Actuals vs. Guidance" view — Annual / Quarterly toggle, metric selector, chart,
// raise/cut analytics and a per-year table. The engine lives further down.
function guidanceBody(c){
  var h = '';
  // Mode toggle (Annual / Quarterly).
  h += '<div class="guid-modes">'+
    '<button type="button" class="guid-mode active" data-guidmode="annual">Annual</button>'+
    '<button type="button" class="guid-mode" data-guidmode="quarterly">Quarterly</button>'+
  '</div>';
  // Metric selector.
  h += '<div class="guid-pills">'+['rev','ebitda','ni','eps'].map(function(k){
    return '<button type="button" class="guid-pill'+(k===_guidMetric?' active':'')+'" data-guidm="'+k+'">'+esc(GUID_ANNUAL[k].short)+'</button>';
  }).join('')+'</div>';
  // Annual controls — fiscal-year selector (filled by JS per metric).
  h += '<div id="guidAnnualControls"><div class="guid-sub">Fiscal year</div><div class="guid-years" id="guidYearPills"></div></div>';
  // Quarterly controls — dual-handle quarter-window slider.
  h += '<div id="guidQtrControls" hidden>'+
    '<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" id="guidFill"></div></div>'+
      '<input type="range" id="guidMin" min="0" max="1" value="0" step="1" aria-label="Start quarter">'+
      '<input type="range" id="guidMax" min="0" max="1" value="1" step="1" aria-label="End quarter"></div>'+
    '<div class="sg-ends"><span id="guidEnd0"></span><span id="guidEnd1"></span></div>'+
    '<div class="sg-readout" id="guidReadout"></div></div>'+
  '</div>';
  // Legend (set per mode by JS).
  h += '<div class="ave-leg" id="guidLeg"></div>';
  // Chart.
  h += '<div class="ov-chart-card"><div class="ov-chart-t" id="guidChartT"></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiGuidChart"></canvas></div></div>';
  // Analytics tiles.
  h += '<div class="ov-subh">Track record <span class="ave-subh-note" id="guidStatScope"></span></div>';
  h += '<div class="ov-kpis" id="guidStats"></div>';
  // Per-fiscal-year table (Annual mode only).
  h += '<div id="guidTableWrap"><div class="ov-subh">By fiscal year</div><div class="guid-tbl-wrap" id="guidTable"></div></div>';
  // Footnotes.
  h += '<div class="ov-foot" id="guidNote"></div>';
  h += '<div class="ov-foot">'+esc(GUID_SOURCE)+'</div>';
  return h;
}

// ─── Sensitivity — multi-driver framework ────────────────────────────────────
// Pick a driver (LPB, Interest Income, …); its variables become sliders. Every
// other line in the model is held at its FY2026E base, so the change flows
// straight through to revenue → net income → EPS → the multiple. Each scenario
// defines its variables, a revenue function, and a flow-through-to-pre-tax rate.
var SENS_BASE = {
  totalRevB: 4.66,  // FY2026E total net revenue, $B
  niM:       828.7, // FY2026E net income, $M (model earnings)
  shares:    1378.0,// diluted shares, M (Q1 2026 actual)
  price:     17.57, // share price for the P/E line ($) — replaced by the live quote when available
  taxRate:   0.25   // tax applied to incremental pre-tax income
};
SENS_BASE.baseEps = SENS_BASE.niM / SENS_BASE.shares;     // base EPS
SENS_BASE.basePe  = SENS_BASE.price / SENS_BASE.baseEps;  // base fwd P/E (reference multiple, fixed at $17.57)

// Each scenario: vars (sliders), rev(v) → driver revenue $M, flow = fraction of
// incremental driver revenue that reaches pre-tax income, eq(v,rev) → equation line.
var SENS_SCEN = {
  lpb: {
    label:'LPB', title:'LPB Sensitivity — origination × take rate', driver:'LPB revenue', flow:1.0,
    intro:'The two levers behind SoFi\'s Loan Platform Business: annual origination volume and the take rate (the fee SoFi earns per dollar originated). LPB revenue = origination × take rate. LPB is capital-light, so incremental revenue flows straight to pre-tax income.',
    vars:[
      { id:'origB',   label:'LPB origination (annual)',      min:2,   max:50,  step:0.5, base:16.5, unit:'$B', dec:1 },
      { id:'takePct', label:'Take rate (origination fee)',    min:1.0, max:9.0, step:0.1, base:5.0,  unit:'%',  dec:1 }
    ],
    rev:function(v){ return v.origB * 1000 * v.takePct / 100; },
    eq:function(v, rev){ return '$'+v.origB.toFixed(1)+'B origination &nbsp;×&nbsp; '+v.takePct.toFixed(1)+'% take rate &nbsp;=&nbsp; <b>$'+Math.round(rev).toLocaleString()+'M</b> LPB revenue'; },
    note:'Base case (FY2026E, Summit model): $16.5B origination × 5.0% take = ~$825M LPB revenue, inside $4.66B total net revenue. LPB is capital-light, so incremental LPB revenue flows 100% to pre-tax and is taxed at 25%.'
  },
  ii: {
    label:'Interest Income', title:'Net interest income — NIM × earning assets', driver:'Net interest income', flow:1.0,
    intro:'The two levers behind net interest income: the average rate SoFi nets on its balance sheet (net interest margin) and the size of its interest-earning assets (the loan book plus cash and investments). Net interest income = earning assets × NIM. It is already net of funding cost, so it flows to pre-tax income.',
    vars:[
      { id:'nimPct', label:'Net interest margin (avg rate kept on earning assets)', min:3.0, max:9.0, step:0.05, base:5.88, unit:'%',  dec:2 },
      { id:'ieaB',   label:'Interest-earning assets (loan book + cash & investments)', min:25, max:90, step:0.5,  base:49.3, unit:'$B', dec:1 }
    ],
    rev:function(v){ return v.ieaB * 1000 * v.nimPct / 100; },
    eq:function(v, rev){ return '$'+v.ieaB.toFixed(1)+'B earning assets &nbsp;×&nbsp; '+v.nimPct.toFixed(2)+'% NIM &nbsp;=&nbsp; <b>$'+Math.round(rev).toLocaleString()+'M</b> net interest income'; },
    note:'Base case (FY2026E, Summit DCF): $49.3B interest-earning assets × 5.88% net interest margin ≈ $2.9B net interest income, inside $4.66B total net revenue. The NIM already nets out funding cost, so incremental net interest income flows to pre-tax and is taxed at 25% (credit provisions on a bigger book are not separately modeled).'
  }
};
var SENS_ORDER = ['lpb','ii'];
var _sensScen = 'lpb';
var SENS_FOOT = 'Single-driver sensitivity: the selected variables move while every other line in the model is held at its FY2026E base (total net revenue $4.66B, net income $829M, 1,378M diluted shares, 25% tax). Incremental driver revenue flows to pre-tax income at the stated rate and is taxed; share count is held fixed and forward P/E uses the live price when available, else $17.57 (last close). The "implied price" holds the base ~29x multiple constant. This is a back-of-envelope sensitivity, not a re-solved model. Base values from the Summit DCF (snapshot 2026-05-13).';

function sensVarsBase(scen){ var v = {}; scen.vars.forEach(function(x){ v[x.id] = x.base; }); return v; }

function sensRowG(x){
  return '<div class="sens-ctrl">'+
    '<div class="sens-ctrl-l">'+esc(x.label)+'</div>'+
    '<input type="range" id="sensV_'+x.id+'" min="'+x.min+'" max="'+x.max+'" step="'+x.step+'" value="'+x.base+'">'+
    '<div class="sens-ctrl-v" id="sensV_'+x.id+'V"></div>'+
    '<div class="sens-ctrl-u">'+esc(x.unit)+'</div>'+
  '</div>';
}

function sensBody(c){
  var scen = SENS_SCEN[_sensScen];
  var h = '';
  h += '<div class="ov-sec-h" id="sensTitle">'+esc(scen.title)+'</div>';

  // Driver selector (category buttons).
  h += '<div class="senscat-bar">'+SENS_ORDER.map(function(k){
    return '<button type="button" class="senscat'+(k===_sensScen?' active':'')+'" data-senscat="'+k+'">'+esc(SENS_SCEN[k].label)+'</button>';
  }).join('')+'</div>';

  h += '<p class="ov-lede" id="sensIntro">'+esc(scen.intro)+'</p>';

  // Live price banner — feeds the Fwd P/E line. Falls back to the fixed price.
  h += '<div class="sens-live">'+
    '<span class="sens-live-tk">SOFI</span>'+
    '<span class="sens-live-px" id="sensLivePx">$'+SENS_BASE.price.toFixed(2)+'</span>'+
    '<span class="sens-live-ch" id="sensLiveCh"></span>'+
    '<span class="sens-live-ts" id="sensLiveTs">price held fixed</span>'+
    '<button type="button" class="sens-live-rf" id="sensLiveRf">↻ Live</button>'+
  '</div>';

  // Variable sliders for the active driver (rebuilt on switch).
  h += '<div class="sens-controls" id="sensCtrls">'+scen.vars.map(sensRowG).join('')+'</div>';

  // The live equation line.
  h += '<div class="sens-eq" id="sensEq"></div>';

  // Output tiles (recomputed live).
  h += '<div class="ov-kpis" id="sensOut"></div>';

  h += '<div class="ov-foot" id="sensNote"></div>';
  h += '<div class="ov-foot">'+esc(SENS_FOOT)+'</div>';

  // ── Sum-of-the-Parts: forward-earnings valuation ──
  h += '<div class="ov-sec-h evo-sec-h">Sum-of-the-Parts — forward-earnings valuation</div>';
  h += '<p class="ov-lede">'+esc(SOTP_INTRO)+'</p>';
  // Typed inputs: valuation date, fee/interest mix of earnings, and the two P/E multiples.
  h += '<div class="sotp-fields">'+
    sotpField('sotpDate', 'Valuation date', 'date', 'min="2026-01-01" max="2028-12-31"', '2026-12-31', '') +
    sotpField('sotpFee', 'Fee % of earnings', 'number', 'min="0" max="100" step="1"', '50', '%') +
    sotpField('sotpInt', 'Interest % of earnings', 'number', 'min="0" max="100" step="1"', '50', '%') +
    sotpField('sotpFeePE', 'Fee multiple', 'number', 'min="1" step="0.5"', '30', 'x P/E') +
    sotpField('sotpIntPE', 'Interest multiple', 'number', 'min="1" step="0.5"', '12', 'x P/E') +
  '</div>';
  h += '<div class="sotp-fwd" id="sotpFwd"></div>';
  h += '<div class="sens-eq" id="sotpEq"></div>';
  h += '<div class="ov-chart-card" id="sotpChartCard"><div class="ov-chart-t" id="sotpChartT"></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiSotpChart"></canvas></div></div>';
  h += '<div class="ov-kpis" id="sotpOut"></div>';
  h += '<div class="ov-foot">'+esc(SOTP_NOTE)+'</div>';

  return h;
}

// Compute fundamentals + multiples for a scenario at variable values v.
function sensCompute(scen, v){
  var baseRev = scen.rev(sensVarsBase(scen));
  var newRev  = scen.rev(v);
  var dRev    = newRev - baseRev;
  var totalM  = (SENS_BASE.totalRevB * 1000 - baseRev) + newRev; // non-driver revenue held fixed
  var dNi     = dRev * scen.flow * (1 - SENS_BASE.taxRate);
  var niM     = SENS_BASE.niM + dNi;
  var eps     = niM / SENS_BASE.shares;
  var pe      = SENS_BASE.price / eps;
  var implied = SENS_BASE.basePe * eps; // price if the base multiple were held
  return { baseRev:baseRev, newRev:newRev, dRev:dRev, totalM:totalM, niM:niM, dNi:dNi, eps:eps, pe:pe, implied:implied };
}

function sensSigned(v, money){
  var s = v >= 0 ? '+' : '−';
  return s + (money ? '$' : '') + Math.abs(v).toLocaleString(undefined, {maximumFractionDigits: money ? 0 : 2});
}

function renderSens(){
  var scen = SENS_SCEN[_sensScen];
  var v = {}, ok = true;
  scen.vars.forEach(function(x){
    var el = document.getElementById('sensV_'+x.id);
    if (!el) { ok = false; return; }
    v[x.id] = +el.value;
    var lab = document.getElementById('sensV_'+x.id+'V');
    if (lab) lab.textContent = v[x.id].toFixed(x.dec);
  });
  if (!ok) return;

  var r = sensCompute(scen, v);
  var eq = document.getElementById('sensEq');
  if (eq) eq.innerHTML = scen.eq(v, r.newRev);
  var note = document.getElementById('sensNote');
  if (note) note.textContent = scen.note;

  var box = document.getElementById('sensOut');
  if (!box) return;
  function tile(l, val, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+val+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  var revPct = (r.totalM / (SENS_BASE.totalRevB*1000) - 1) * 100;
  var prcPct = (r.implied / SENS_BASE.price - 1) * 100;
  box.innerHTML =
    tile(scen.driver, '$'+Math.round(r.newRev).toLocaleString()+'M', sensSigned(r.dRev, true)+'M vs base', r.dRev>=0?'up':'down') +
    tile('Total net revenue', '$'+(r.totalM/1000).toFixed(2)+'B', sensSigned(revPct)+'% vs base', revPct>=0?'up':'down') +
    tile('Net income', '$'+Math.round(r.niM).toLocaleString()+'M', sensSigned(r.dNi, true)+'M vs base', r.dNi>=0?'up':'down') +
    tile('EPS (FY2026E)', '$'+r.eps.toFixed(2), sensSigned(r.eps-SENS_BASE.baseEps)+' vs $'+SENS_BASE.baseEps.toFixed(2), (r.eps-SENS_BASE.baseEps)>=0?'up':'down') +
    tile('Fwd P/E @ $'+SENS_BASE.price.toFixed(2), r.pe.toFixed(1)+'x', 'base '+SENS_BASE.basePe.toFixed(1)+'x', 'muted') +
    tile('Implied price @ '+SENS_BASE.basePe.toFixed(1)+'x', '$'+r.implied.toFixed(2), sensSigned(prcPct)+'% vs $'+SENS_BASE.price.toFixed(2), prcPct>=0?'up':'down');
}

function setupSensSliders(){
  var scen = SENS_SCEN[_sensScen];
  scen.vars.forEach(function(x){
    var el = document.getElementById('sensV_'+x.id);
    if (el) el.oninput = renderSens;
  });
  renderSens();
}

// Switch the active driver: rebuild its sliders, intro and title, recompute.
function switchSensScen(root, k){
  if (!SENS_SCEN[k]) return;
  _sensScen = k;
  var scen = SENS_SCEN[k];
  root.querySelectorAll('.senscat').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-senscat') === k); });
  var ctrls = document.getElementById('sensCtrls');
  if (ctrls) ctrls.innerHTML = scen.vars.map(sensRowG).join('');
  var title = document.getElementById('sensTitle'); if (title) title.textContent = scen.title;
  var intro = document.getElementById('sensIntro'); if (intro) intro.textContent = scen.intro;
  setupSensSliders();
}

// ── Live price (via the get-quote edge function; falls back to the fixed price) ──
var _liveQuote = null;
function fetchSofiQuote(){
  var env = window.ENV;
  if (!env || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return Promise.reject(new Error('no-env'));
  var base = String(env.SUPABASE_URL).replace(/\/+$/, '');
  return fetch(base + '/functions/v1/get-quote?ticker=SOFI', {
    headers: { 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + env.SUPABASE_ANON_KEY }
  }).then(function(r){ if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then(function(j){ if (j && typeof j.price === 'number') return j; throw new Error('bad payload'); });
}

function renderLiveBanner(){
  var px = document.getElementById('sensLivePx');
  var ch = document.getElementById('sensLiveCh');
  if (px) px.textContent = '$' + SENS_BASE.price.toFixed(2);
  if (ch && _liveQuote && typeof _liveQuote.changePct === 'number'){
    var p = _liveQuote.changePct;
    ch.textContent = (p >= 0 ? '▲ +' : '▼ −') + Math.abs(p).toFixed(2) + '%';
    ch.className = 'sens-live-ch ' + (p >= 0 ? 'up' : 'down');
  }
}

function applyLiveQuote(q){
  _liveQuote = q;
  if (typeof q.price === 'number') SENS_BASE.price = q.price;
  renderLiveBanner();
  renderSens(); // recompute P/E and implied price off the live price
  renderSotp(); // SOTP upside is vs the live price too
  var ts = document.getElementById('sensLiveTs');
  if (ts){
    var t = q.time ? new Date(q.time * 1000) : null;
    var hhmm = t ? (('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)) : '';
    var state = (q.marketState && q.marketState !== 'REGULAR') ? (' · ' + q.marketState.toLowerCase()) : '';
    ts.textContent = 'live · ' + (q.exchange || 'NASDAQ') + (hhmm ? (' · ' + hhmm) : '') + state;
  }
}

function refreshLiveQuote(){
  var ts = document.getElementById('sensLiveTs');
  if (ts) ts.textContent = 'fetching live price…';
  fetchSofiQuote().then(applyLiveQuote).catch(function(){
    if (ts) ts.textContent = 'live price unavailable here — using $' + SENS_BASE.price.toFixed(2) + ' (last close)';
  });
}

function buildSensTab(){
  setupSensSliders();
  renderLiveBanner();
  var rf = document.getElementById('sensLiveRf');
  if (rf) rf.onclick = refreshLiveQuote;
  refreshLiveQuote(); // try to pull a live price when the tab opens
  requestAnimationFrame(function(){ buildSotpChart(); setupSotpInputs(); });
}

// ─── Sensitivity → Sum-of-the-Parts (forward-earnings valuation) ─────────────
// A forward-earnings SOTP. You stand on a valuation date and capitalise the NEXT
// twelve months of net income (e.g. standing at 31-Dec-2026 values FY2027). You
// split those forward earnings into a fee share and an interest share, give each
// its own P/E, and read off the implied share price. All inputs are typed.
// Net income by fiscal year ($M), Summit DCF (snapshot 2026-05-13, adj. net income).
var SOTP_NI = { '2026':1160, '2027':1292, '2028':1865, '2029':2160 };
var SOTP_FYEARS = [2026, 2027, 2028, 2029]; // forward earnings years available to capitalise
var SOTP_INTRO = 'A forward-earnings sum-of-the-parts. Pick a valuation date — you capitalise the next twelve months of earnings (standing at 31-Dec-2026 values FY2027). Split those forward earnings into a fee share and an interest share, then give each part its own P/E: fee income is capital-light and recurring, so it earns a richer multiple than net interest income. The implied price is the sum of the parts ÷ shares. Type any value — date, the two mix shares (they stay complementary), and the two P/E multiples.';
var SOTP_NOTE = 'Method: forward net income = next-twelve-months net income from the valuation date (linear blend of the two straddling fiscal years; standing at a year-end gives the next full year). Equity value = (forward NI × fee%) × fee P/E + (forward NI × interest%) × interest P/E; implied price = value ÷ 1,378M shares; blended P/E = fee% × fee P/E + interest% × interest P/E. Net income by year from the Summit DCF (snapshot 2026-05-13, adjusted net income): FY2026 $1.16B, FY2027 $1.29B, FY2028 $1.87B, FY2029 $2.16B. The fee/interest split of EARNINGS is your assumption (the model does not report segment net income). Illustrative, not a target price.';
var _sotpChart = null;

function sotpField(id, label, type, attrs, val, unit){
  return '<label class="sotp-field" for="'+id+'"><span class="sotp-field-l">'+esc(label)+'</span>'+
    '<span class="sotp-field-in"><input type="'+type+'" id="'+id+'" '+attrs+' value="'+val+'">'+
    (unit ? '<span class="sotp-field-u">'+esc(unit)+'</span>' : '')+'</span></label>';
}
function sotpNum(id, fallback){ var el = document.getElementById(id); var v = el ? parseFloat(el.value) : NaN; return isNaN(v) ? fallback : v; }

// Forward (next-twelve-months) net income for a valuation date, blending the two
// straddling fiscal years. Returns { ni, label } or null.
function sotpForwardNI(dateStr){
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  var y = d.getFullYear();
  var start = new Date(y, 0, 1).getTime(), end = new Date(y + 1, 0, 1).getTime();
  var f = (d.getTime() - start) / (end - start);          // fraction of the year elapsed
  var a = SOTP_NI[y], b = SOTP_NI[y + 1];
  if (a == null) a = b; if (b == null) b = a;
  if (a == null) return null;
  var ni = (1 - f) * a + f * b;
  var label;
  if (f < 0.02) label = 'FY' + y + 'E';
  else if (f > 0.98) label = 'FY' + (y + 1) + 'E';
  else label = Math.round((1 - f) * 100) + '% FY' + y + 'E + ' + Math.round(f * 100) + '% FY' + (y + 1) + 'E';
  return { ni: ni, label: label };
}

function buildSotpChart(){
  var cv = document.getElementById('sofiSotpChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_sotpChart){ _sotpChart.destroy(); _sotpChart = null; }
  _sotpChart = new Chart(cv.getContext('2d'), {
    data: { labels: SOTP_FYEARS.map(function(y){ return 'FY' + y + 'E'; }), datasets: [
      { type:'bar', label:'Interest earnings', data:[], backgroundColor:'#9DB4C4', stack:'e', yAxisID:'y', borderRadius:3, maxBarThickness:70 },
      { type:'bar', label:'Fee earnings', data:[], backgroundColor:BRAND, stack:'e', yAxisID:'y', borderRadius:3, maxBarThickness:70 },
      { type:'line', label:'Implied price', data:[], borderColor:'#E8833A', backgroundColor:'#E8833A', yAxisID:'y1', borderWidth:2.5, pointRadius:4, pointBackgroundColor:'#fff', pointBorderColor:'#E8833A', tension:0 }
    ] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:10 } },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ boxWidth:12, usePointStyle:true, font:{ size:11 }, color:'#5A6473' } },
        tooltip:{ callbacks:{ label:function(ctx){
          if (ctx.dataset.yAxisID === 'y1') return 'Implied price: $' + ctx.parsed.y.toFixed(2);
          return ctx.dataset.label + ': $' + ctx.parsed.y.toFixed(2) + 'B';
        } } }
      },
      scales:{
        y:{ stacked:true, position:'left', beginAtZero:true, grid:{ color:'rgba(0,0,0,0.04)' },
          ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } },
        y1:{ position:'right', grid:{ drawOnChartArea:false }, grace:'25%', beginAtZero:true,
          ticks:{ color:'#E8833A', font:{ size:10 }, callback:function(v){ return '$'+v.toFixed(0); } } },
        x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    }
  });
}

function renderSotp(){
  var dateEl = document.getElementById('sotpDate'); if (!dateEl) return;
  var feePct = Math.max(0, Math.min(100, sotpNum('sotpFee', 50)));
  var intPct = 100 - feePct;
  var feePE = sotpNum('sotpFeePE', 30), intPE = sotpNum('sotpIntPE', 12);
  var blendedPE = feePct/100 * feePE + intPct/100 * intPE;
  var cur = SENS_BASE.price;

  // Chart: implied price by forward year, given the current mix & multiples.
  if (_sotpChart){
    _sotpChart.data.datasets[0].data = SOTP_FYEARS.map(function(y){ return +((SOTP_NI[y]*intPct/100)/1000).toFixed(2); });
    _sotpChart.data.datasets[1].data = SOTP_FYEARS.map(function(y){ return +((SOTP_NI[y]*feePct/100)/1000).toFixed(2); });
    _sotpChart.data.datasets[2].data = SOTP_FYEARS.map(function(y){ return +((SOTP_NI[y]*blendedPE)/SENS_BASE.shares).toFixed(2); });
    _sotpChart.update('none');
  }
  var ct = document.getElementById('sotpChartT');
  if (ct) ct.innerHTML = 'Implied price by forward earnings year <span>(bars = earnings split · line = implied price at '+blendedPE.toFixed(1)+'x blended P/E)</span>';

  // Single-point valuation for the typed date.
  var fwd = sotpForwardNI(dateEl.value);
  var fwdEl = document.getElementById('sotpFwd');
  var eq = document.getElementById('sotpEq');
  var box = document.getElementById('sotpOut');
  if (!fwd){ if (fwdEl) fwdEl.textContent = 'Enter a valuation date between 2026 and 2028.'; if (box) box.innerHTML = ''; return; }

  var E = fwd.ni, feeE = E*feePct/100, intE = E*intPct/100;
  var value = feeE*feePE + intE*intPE, price = value/SENS_BASE.shares, up = (price/cur - 1) * 100;

  if (fwdEl) fwdEl.innerHTML = 'Standing at <b>'+esc(dateEl.value)+'</b> → forward earnings ≈ <b>'+esc(fwd.label)+'</b> · forward net income <b>$'+Math.round(E).toLocaleString()+'M</b>';
  if (eq) eq.innerHTML = feePct.toFixed(0)+'% fee × '+feePE.toFixed(1)+'x &nbsp;+&nbsp; '+intPct.toFixed(0)+'% interest × '+intPE.toFixed(1)+'x &nbsp;=&nbsp; <b>'+blendedPE.toFixed(1)+'x</b> blended P/E on forward earnings';

  function tile(l, v, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  if (box) box.innerHTML =
    tile('Implied price', '$'+price.toFixed(2), sensSigned(up)+'% vs $'+cur.toFixed(2), up>=0?'up':'down') +
    tile('Blended P/E', blendedPE.toFixed(1)+'x', feePct.toFixed(0)+'% fee / '+intPct.toFixed(0)+'% interest', 'muted') +
    tile('Equity value', '$'+(value/1000).toFixed(1)+'B', 'on $'+(E/1000).toFixed(2)+'B fwd earnings', 'muted') +
    tile('Fee earnings', '$'+Math.round(feeE).toLocaleString()+'M', feePct.toFixed(0)+'% × '+feePE.toFixed(1)+'x', 'muted') +
    tile('Interest earnings', '$'+Math.round(intE).toLocaleString()+'M', intPct.toFixed(0)+'% × '+intPE.toFixed(1)+'x', 'muted');
}

function setupSotpInputs(){
  var fee = document.getElementById('sotpFee'), intp = document.getElementById('sotpInt');
  if (fee) fee.oninput = function(){ var v = Math.max(0, Math.min(100, parseFloat(fee.value)||0)); if (intp) intp.value = (100 - v); renderSotp(); };
  if (intp) intp.oninput = function(){ var v = Math.max(0, Math.min(100, parseFloat(intp.value)||0)); if (fee) fee.value = (100 - v); renderSotp(); };
  ['sotpDate','sotpFeePE','sotpIntPE'].forEach(function(id){ var el = document.getElementById(id); if (el) el.oninput = renderSotp; });
  renderSotp();
}

// ─── Peers — SoFi vs other fintechs ──────────────────────────────────────────
// FY2025 (latest full fiscal year) comparison across scale (users), revenue model
// (fee vs interest), growth and valuation. Sourced from each company's SEC filings.
// pe = FORWARD P/E (price on 25-Jun-2026 ÷ FY2026E consensus EPS). epsG = FY2025→FY2026E
// consensus EPS growth (%). peg = forward P/E ÷ epsG (null = not meaningful when EPS declines).
var PEERS = [
  { id:'SOFI', name:'SoFi',                sofi:true, domain:'sofi.com',               usersLabel:'Members',           users:13.7, rev:3613,  growth:35.1, ni:481,  niG:-3.5, pe:29.3, epsG:59.5, peg:0.49, interestPct:61.4, feePct:38.6 },
  { id:'HOOD', name:'Robinhood',                      domain:'robinhood.com',          usersLabel:'Funded customers',  users:27.0, rev:4473,  growth:52.0, ni:1883, niG:33.5, pe:42.6, epsG:-6.0, peg:null, interestPct:33.8, feePct:66.2 },
  { id:'IBKR', name:'Interactive Brokers',            domain:'interactivebrokers.com', usersLabel:'Customer accounts', users:4.4,  rev:6205,  growth:19.7, ni:984,  niG:30.3, pe:36.7, epsG:14.6, peg:2.51, interestPct:57.4, feePct:42.6 },
  { id:'NU',   name:'Nu Holdings',                    domain:'nubank.com.br',          usersLabel:'Customers',         users:131.0,rev:15775, growth:37.0, ni:2872, niG:45.6, pe:14.2, epsG:38.1, peg:0.37, interestPct:85.2, feePct:14.8 }
];
// Series by fiscal year-end, 2020–2028, per company. 2020–2025 are actuals; 2026–2028
// are estimates (SoFi from our Summit DCF; peers from market consensus) — drawn dashed.
// Users in millions; revenue & net income in US$ BILLIONS (net income can be negative).
// null = no value available (e.g. peers have no published forward user estimate).
var PEER_YEARS = ['2020','2021','2022','2023','2024','2025','2026','2027','2028'];
var PEER_FIRST_EST = 6;  // index of first estimate year (2026)
var PEER_COLORS = { SOFI:'#0E7CC0', HOOD:'#1E9E62', IBKR:'#E8833A', NU:'#8E6FD0' };
var PEER_SERIES = {
  users: { label:'Users', log:true, fmt:function(v){ return v.toFixed(1)+'M'; }, data:{
    SOFI:[1.85,3.46,5.22,7.54,10.13,13.70,17.75,23.07,29.99], HOOD:[12.5,22.7,23.0,23.4,25.2,27.0,null,null,null], IBKR:[1.07,1.68,2.09,2.56,3.34,4.40,null,null,null], NU:[33.3,53.9,74.6,93.9,114.2,131.0,null,null,null] } },
  rev: { label:'Revenue', log:false, fmt:function(v){ return '$'+v.toFixed(1)+'B'; }, data:{
    SOFI:[0.57,0.98,1.57,2.12,2.67,3.61,4.67,6.29,8.13], HOOD:[0.96,1.82,1.36,1.87,2.95,4.47,5.0,5.9,6.7], IBKR:[2.22,2.71,3.07,4.34,5.19,6.21,7.0,7.6,8.3], NU:[0.74,1.70,4.79,8.03,11.52,15.77,21.0,23.0,28.0] } },
  ni: { label:'Net income', log:false, fmt:function(v){ return (v<0?'−$':'$')+Math.abs(v).toFixed(2)+'B'; }, data:{
    SOFI:[-0.22,-0.48,-0.32,-0.30,0.50,0.48,1.16,1.29,1.87], HOOD:[0.01,-3.69,-1.03,-0.54,1.41,1.88,2.20,2.67,3.17], IBKR:[0.20,0.31,0.38,0.60,0.76,0.98,1.13,1.25,1.47], NU:[-0.17,-0.17,-0.36,1.03,1.97,2.87,4.3,5.6,6.85] } },
  // Derived metrics (computed from the base series above).
  arpu: { label:'ARPU', log:false, fmt:function(v){ return '$'+Math.round(v); }, derive:function(id){
    var r=PEER_SERIES.rev.data[id], u=PEER_SERIES.users.data[id];
    return r.map(function(rv,i){ return (rv!=null && u[i]!=null && u[i]>0) ? rv*1000/u[i] : null; }); } },
  niu: { label:'NI / user', log:false, fmt:function(v){ return (v<0?'−$':'$')+Math.abs(Math.round(v)); }, derive:function(id){
    var n=PEER_SERIES.ni.data[id], u=PEER_SERIES.users.data[id];
    return n.map(function(nv,i){ return (nv!=null && u[i]!=null && u[i]>0) ? nv*1000/u[i] : null; }); } },
  margin: { label:'Net margin', log:false, fmt:function(v){ return v.toFixed(0)+'%'; }, derive:function(id){
    var n=PEER_SERIES.ni.data[id], r=PEER_SERIES.rev.data[id];
    return n.map(function(nv,i){ return (nv!=null && r[i]!=null && r[i]>0) ? nv/r[i]*100 : null; }); } },
  rule40: { label:'Rule of 40', log:false, fmt:function(v){ return v.toFixed(0); }, derive:function(id){
    var r=PEER_SERIES.rev.data[id], n=PEER_SERIES.ni.data[id];
    return r.map(function(rv,i){ if (i===0 || rv==null || r[i-1]==null || r[i-1]<=0 || n[i]==null) return null; return (rv/r[i-1]-1)*100 + n[i]/rv*100; }); } },
  // ROE on average equity (Nu's basis; matches its reported 28%/30%). IBKR on total-company
  // equity (its public-stock ROE is ~18%). 2020 (and HOOD 2021) omitted — pre/at-IPO equity
  // made the ratio meaningless. Historical only (no forward).
  roe: { label:'ROE', log:false, fmt:function(v){ return v.toFixed(0)+'%'; }, data:{
    SOFI:[null,-22.7,-6.7,-5.8,8.5,5.7,null,null,null], HOOD:[null,null,-14.4,-7.9,19.2,22.0,null,null,null], IBKR:[null,17.0,16.9,21.9,22.2,23.5,null,null,null], NU:[null,-6.8,-7.8,18.2,28.1,30.3,null,null,null] } },
  // Client assets ($B, year-end) — a brokerage metric: IBKR customer equity, Robinhood AUC
  // (2025 = Total Platform Assets). SoFi & Nu are banks/lenders, not custodians → N/A.
  auc: { label:'Client assets', log:true, fmt:function(v){ return '$'+Math.round(v)+'B'; }, data:{
    SOFI:[null,null,null,null,null,null,null,null,null], HOOD:[63,98,62,102.6,193,324,null,null,null], IBKR:[288,373,306,426,568,779.9,null,null,null], NU:[null,null,null,null,null,null,null,null,null] } }
};
var PEER_SERIES_KEYS = ['users','rev','ni','arpu','niu','margin','rule40','roe','auc'];
// Resolve a company's series array for a metric (stored data or derived).
function peerArr(metric, id){ return metric.derive ? metric.derive(id) : metric.data[id]; }
// Fee income as % of total revenue, by year 2020–2028 (interest% = 100 − fee%).
// 2026–2028 estimate: SoFi from DCF; peers null (forward mix not separately forecast).
var PEER_FEE = {
  SOFI:[68.5,74.4,62.9,40.6,35.8,38.6,37.9,40.1,42.8], HOOD:[81.5,85.8,68.8,50.2,62.4,66.2,null,null,null], IBKR:[60.7,57.7,45.6,35.6,39.3,42.6,null,null,null], NU:[48.1,38.4,25.8,19.8,16.4,14.8,null,null,null]
};
var PEERS_INTRO = 'How SoFi stacks up against other consumer-finance and fintech platforms on what matters: scale (users), the revenue model (fee vs interest), growth, and what the market pays for it (P/E). Figures are each company\'s latest full fiscal year (FY2025). User metrics are each company\'s own headline (members, funded customers, accounts, customers) — compare scale, not definitions. Use the trends-over-time chart to see how users, revenue or net income have grown — switch between level, year-over-year and CAGR over any year range; the mix and valuation charts add context.';
var PEERS_SOURCE = 'Sources: company FY2025 results (SEC 10-K / 20-F / 8-K / 6-K) for users, revenue, mix, growth and net income; analyst consensus EPS for the multiples. Revenue mix is fee/noninterest vs net interest income as a share of total revenue. FORWARD P/E = share price on 25-Jun-2026 ÷ FY2026E consensus EPS (SoFi $17.31/$0.59, Robinhood $93.62/$2.20, IBKR $92.12/$2.51, Nu $12.39/$0.87). PEG = forward P/E ÷ FY2025→FY2026E consensus EPS growth (SoFi +60%, IBKR +15%, Nu +38%); Robinhood is "n/m" because its FY2026E EPS is below FY2025 (2025 was a peak year). Interactive Brokers EPS is the public Class-A company, which owns ~26% of IBG LLC — the whole group\'s economic earnings are larger. Nu: IFRS revenue in USD, +37% YoY (+45% FX-neutral; BRL depreciation weighs on USD). SoFi\'s FY2024 GAAP net income included a one-time ~$265M deferred-tax benefit, so its 2024→2025 net income looks flat even though underlying earnings grew strongly. Trends-over-time series (users, total revenue, net income): 2020–2025 actuals from each company\'s filings; 2026–2028 estimates (dashed) — SoFi from our Summit DCF, peers from market consensus (stockanalysis / Yahoo / MarketBeat). Peer forward revenue is lower-confidence for 2027–2028 (thin coverage; Nu\'s feeds mix BRL/USD), while net income / EPS consensus is firmer. No analyst publishes forward user/customer counts for the peers, so their user lines stop at 2025. Fee % of revenue over time is from the income statements (SoFi forward from the DCF). ROE is net income ÷ average shareholders\' equity (matches Nu\'s reported ~28%/30%); IBKR is shown on total-company equity (its public-stock ROE is ~18%); 2020 and Robinhood\'s 2021 are omitted because pre/at-IPO equity made the ratio meaningless, and SoFi\'s 2024 was lifted by a one-time tax benefit. Client assets is a brokerage metric (IBKR customer equity; Robinhood AUC / 2025 Total Platform Assets) — SoFi and Nu are banks/lenders, not custodians, so N/A. ROE and client assets are historical only (no forward). User definitions differ by company. Illustrative, not investment advice.';
var PEER_GRAY = '#9DB4C4';
var _peerMetric = 'users';
var _peerView = 'level';    // 'level' | 'yoy' | 'cagr'
var _peerMix = null, _peerScatter = null, _peerTS = null;

function peerLogo(domain){
  return '<img class="peer-logo" src="https://logo.clearbit.com/'+domain+'" '+
    'onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+domain+'&sz=64\'" alt="" loading="lazy">';
}
function peersTable(){
  var rows = PEERS.map(function(p){
    return '<tr'+(p.sofi?' class="peer-row-sofi"':'')+'>'+
      '<td class="peer-co">'+peerLogo(p.domain)+'<span class="peer-co-t"><b>'+esc(p.name)+'</b><span class="peer-ulab">'+esc(p.usersLabel)+'</span></span></td>'+
      '<td>'+p.users.toFixed(1)+'M</td>'+
      '<td>$'+(p.rev/1000).toFixed(1)+'B</td>'+
      '<td>'+p.feePct.toFixed(0)+'% / '+p.interestPct.toFixed(0)+'%</td>'+
      '<td>$'+Math.round(p.ni).toLocaleString()+'M</td>'+
      '<td>'+p.pe.toFixed(0)+'x</td>'+
      '<td>'+(p.peg == null ? '<span class="guid-mut">n/m</span>' : p.peg.toFixed(2))+'</td></tr>';
  }).join('');
  return '<table class="peer-tbl"><thead><tr><th>Company</th><th>Users</th><th>FY25 revenue</th><th>Fee / Int</th><th>Net income</th><th>Fwd P/E</th><th>PEG</th></tr></thead><tbody>'+rows+'</tbody></table>';
}

function peersBody(c){
  var h = '';
  h += '<div class="peer-tbl-wrap">'+peersTable()+'</div>';

  // Interactive trends-over-time widget: metric + view (level / YoY / CAGR) + year window.
  h += '<div class="ov-subh">Trends over time</div>';
  h += '<div class="peer-ctl-row">';
  h += '<div class="peer-pills">'+PEER_SERIES_KEYS.map(function(k){
    return '<button type="button" class="peer-pill'+(k===_peerMetric?' active':'')+'" data-peer="'+k+'">'+esc(PEER_SERIES[k].label)+'</button>';
  }).join('')+'</div>';
  h += '<div class="peer-views">'+[['level','Level'],['yoy','YoY growth'],['cagr','CAGR']].map(function(v){
    return '<button type="button" class="peer-view'+(v[0]===_peerView?' active':'')+'" data-peerview="'+v[0]+'">'+esc(v[1])+'</button>';
  }).join('')+'</div>';
  h += '</div>';
  // Year-window slider.
  h += '<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" id="peerFill"></div></div>'+
    '<input type="range" id="peerMin" min="0" max="'+(PEER_YEARS.length-1)+'" value="0" step="1" aria-label="Start year">'+
    '<input type="range" id="peerMax" min="0" max="'+(PEER_YEARS.length-1)+'" value="'+(PEER_YEARS.length-1)+'" step="1" aria-label="End year"></div>'+
    '<div class="sg-ends"><span id="peerEnd0">'+PEER_YEARS[0]+'</span><span id="peerEnd1">'+PEER_YEARS[PEER_YEARS.length-1]+'</span></div></div>';
  h += '<div class="ov-chart-card"><div class="ov-chart-t" id="peerTST"></div><div class="ov-chart-wrap ovs-tall"><canvas id="sofiPeerTS"></canvas></div></div>';

  h += '<div class="ov-subh">Revenue model — fee % of revenue over time</div>';
  h += '<div class="ov-chart-card"><div class="ov-chart-t">Fee income as a share of revenue, 2020–2028E <span>(higher = more fee-based; the rest is net interest · dashed = estimate · SoFi forward from our DCF)</span></div><div class="ov-chart-wrap ovs-tall"><canvas id="sofiPeerMix"></canvas></div></div>';
  h += '<div class="ov-subh">Valuation vs growth</div>';
  h += '<div class="ov-chart-card"><div class="ov-chart-t">Forward P/E vs revenue growth <span>(bubble size = users · SoFi in blue · lower-right = cheaper for the growth)</span></div><div class="ov-chart-wrap ovs-tall"><canvas id="sofiPeerScatter"></canvas></div></div>';
  h += '<div class="ov-foot">'+esc(PEERS_SOURCE)+'</div>';
  return h;
}

// ── Interactive trends-over-time engine (metric × view × year window) ──
function peerWin(){
  var mn = document.getElementById('peerMin'), mx = document.getElementById('peerMax');
  if (!mn || !mx) return [0, PEER_YEARS.length - 1];
  return [Math.min(+mn.value, +mx.value), Math.max(+mn.value, +mx.value)];
}
function peerHasNeg(metric, a, b){
  for (var ci=0; ci<PEERS.length; ci++){ var s = peerArr(metric, PEERS[ci].id); for (var i=a; i<=b; i++){ if (s[i] != null && s[i] < 0) return true; } }
  return false;
}
function peerLineDatasets(metric, view, a, b){
  var off = (view === 'yoy') ? a+1 : a; // absolute year index of the first plotted point
  return PEERS.map(function(p){
    var s = peerArr(metric, p.id), col = PEER_COLORS[p.id] || PEER_GRAY, arr = [];
    if (view === 'yoy'){ for (var i=a+1; i<=b; i++){ var pr=s[i-1], cu=s[i]; arr.push((pr!=null && cu!=null && pr>0) ? +(((cu/pr)-1)*100).toFixed(1) : null); } }
    else { for (var j=a; j<=b; j++) arr.push(s[j]); }
    return { label:p.name, data:arr, borderColor:col, backgroundColor:col, borderWidth:p.sofi?3.5:2,
      pointRadius:p.sofi?4:3, pointBackgroundColor:'#fff', pointBorderColor:col, pointBorderWidth:1.5, tension:0, fill:false, spanGaps:false,
      segment:{ borderDash:function(ctx){ return (off + ctx.p1DataIndex) >= PEER_FIRST_EST ? [6,5] : undefined; } } };
  });
}
function peerCagrData(metric, a, b){
  var n = b - a;
  return PEERS.map(function(p){ var s = peerArr(metric, p.id); if (n <= 0) return null; var v0=s[a], v1=s[b]; if (v0==null || v1==null || v0<=0 || v1<=0) return null; return +((Math.pow(v1/v0, 1/n) - 1) * 100).toFixed(1); });
}
// End-of-line value label (Level view only).
var peerTSEndLabels = {
  id:'peerTSEndLabels',
  afterDatasetsDraw:function(chart){
    if (!chart.$endfmt) return;
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di); if (meta.hidden) return;
      var pt = meta.data[meta.data.length - 1]; if (!pt) return;
      var v = ds.data[ds.data.length - 1]; if (v == null) return;
      ctx.save(); ctx.textAlign='left'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle = ds.borderColor;
      ctx.fillText(chart.$endfmt(v), pt.x + 7, pt.y); ctx.restore();
    });
  }
};
// CAGR bar value labels (n/m where a sign change makes CAGR meaningless).
var peerTSBarLabels = {
  id:'peerTSBarLabels',
  afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, meta = chart.getDatasetMeta(0), area = chart.chartArea;
    meta.data.forEach(function(bar, i){
      var v = chart.data.datasets[0].data[i];
      var txt = (v == null) ? 'n/m' : ((v>=0?'+':'')+v.toFixed(1)+'%');
      var y = (v == null || isNaN(bar.y)) ? (area ? area.bottom - 6 : 0) : (v>=0 ? bar.y - 7 : bar.y + 15);
      ctx.save(); ctx.textAlign='center'; ctx.font='700 12px Inter, sans-serif'; ctx.fillStyle = (v == null) ? '#8A93A0' : '#1E2733';
      ctx.fillText(txt, bar.x, y); ctx.restore();
    });
  }
};
function buildPeerTS(){
  var cv = document.getElementById('sofiPeerTS'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_peerTS){ _peerTS.destroy(); _peerTS = null; }
  var metric = PEER_SERIES[_peerMetric], w = peerWin(), a = w[0], b = w[1];
  var t = document.getElementById('peerTST');

  if (_peerView === 'cagr'){
    if (t) t.innerHTML = metric.label + ' — CAGR ' + PEER_YEARS[a] + '–' + PEER_YEARS[b] + ' <span>(compound annual growth · SoFi in blue)</span>';
    _peerTS = new Chart(cv.getContext('2d'), {
      type:'bar',
      data:{ labels:PEERS.map(function(p){ return p.name; }), datasets:[{ data:peerCagrData(metric, a, b), backgroundColor:PEERS.map(function(p){ return p.sofi ? BRAND : PEER_GRAY; }), borderRadius:4, maxBarThickness:72 }] },
      options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:26, bottom:18 } },
        plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; return v==null?'n/m (sign change)':((v>=0?'+':'')+v.toFixed(1)+'% CAGR'); } } } },
        scales:{ y:{ display:false, grace:'20%' }, x:{ grid:{ display:false }, ticks:{ color:'#5A6473', font:{ size:12 } } } } },
      plugins:[peerTSBarLabels]
    });
    return;
  }

  var isYoY = _peerView === 'yoy';
  var yrs = isYoY ? PEER_YEARS.slice(a+1, b+1) : PEER_YEARS.slice(a, b+1);
  if (t) t.innerHTML = metric.label + (isYoY ? ' — year-over-year growth ' : ' — by year ') + PEER_YEARS[a] + '–' + PEER_YEARS[b] +
    ' <span>(' + (isYoY ? '% YoY' : (metric.log ? 'log scale' : 'level')) + ' · 2026–28 dashed = est. · SoFi in blue)</span>';
  var yScale = isYoY
    ? { grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return (v>=0?'+':'')+v+'%'; } } }
    : (metric.log
        ? { type:'logarithmic', grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return ([0.5,1,2,5,10,20,50,100,200].indexOf(v)>=0) ? metric.fmt(v) : ''; } } }
        : { grid:{ color:'rgba(0,0,0,0.04)' }, beginAtZero:!peerHasNeg(metric, a, b), ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return metric.fmt(v); } } });
  _peerTS = new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:yrs, datasets:peerLineDatasets(metric, _peerView, a, b) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ right:isYoY?14:46, top:8 } },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ boxWidth:12, usePointStyle:true, font:{ size:11 }, color:'#5A6473' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label + ': ' + (isYoY ? ((ctx.parsed.y>=0?'+':'')+ctx.parsed.y.toFixed(1)+'%') : metric.fmt(ctx.parsed.y)); } } }
      },
      scales:{ y:yScale, x:{ grid:{ display:false }, ticks:{ color:'#5A6473', font:{ size:12 } } } } },
    plugins: isYoY ? [] : [peerTSEndLabels]
  });
  _peerTS.$endfmt = isYoY ? null : metric.fmt;
}

// Label the last available point of each fee% line.
var peerMixEndLabels = {
  id:'peerMixEndLabels',
  afterDatasetsDraw:function(chart){
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di); if (meta.hidden) return;
      var li = -1; for (var i=ds.data.length-1; i>=0; i--){ if (ds.data[i] != null){ li = i; break; } }
      if (li < 0) return; var pt = meta.data[li]; if (!pt) return;
      ctx.save(); ctx.textAlign='left'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle = ds.borderColor;
      ctx.fillText(Math.round(ds.data[li])+'%', pt.x + 6, pt.y); ctx.restore();
    });
  }
};
function buildPeerMix(){
  var cv = document.getElementById('sofiPeerMix'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_peerMix){ _peerMix.destroy(); _peerMix = null; }
  _peerMix = new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:PEER_YEARS, datasets:PEERS.map(function(p){
      var col = PEER_COLORS[p.id] || PEER_GRAY;
      return { label:p.name, data:PEER_FEE[p.id], borderColor:col, backgroundColor:col, borderWidth:p.sofi?3.5:2,
        pointRadius:p.sofi?4:3, pointBackgroundColor:'#fff', pointBorderColor:col, pointBorderWidth:1.5, tension:0, fill:false, spanGaps:false,
        segment:{ borderDash:function(ctx){ return ctx.p1DataIndex >= PEER_FIRST_EST ? [6,5] : undefined; } } };
    }) },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ right:42, top:8 } },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ boxWidth:12, usePointStyle:true, font:{ size:11 }, color:'#5A6473' } },
        tooltip:{ callbacks:{ label:function(ctx){ if (ctx.parsed.y == null) return null; return ctx.dataset.label+': '+ctx.parsed.y.toFixed(0)+'% fee / '+(100-ctx.parsed.y).toFixed(0)+'% interest'; } } }
      },
      scales:{ y:{ min:0, max:100, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#5A6473', font:{ size:12 } } } },
    plugins:[peerMixEndLabels] }
  });
}

// Company labels above each bubble.
var peerScatterLabels = {
  id:'peerScatterLabels',
  afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, meta = chart.getDatasetMeta(0);
    meta.data.forEach(function(pt, i){
      ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle='#1E2733';
      ctx.fillText(PEERS[i].name, pt.x, pt.y - (pt.options.radius || 8) - 5); ctx.restore();
    });
  }
};
function buildPeerScatter(){
  var cv = document.getElementById('sofiPeerScatter'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_peerScatter){ _peerScatter.destroy(); _peerScatter = null; }
  _peerScatter = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{
      data:PEERS.map(function(p){ return { x:p.growth, y:p.pe, r:6 + Math.sqrt(p.users)*2 }; }),
      backgroundColor:PEERS.map(function(p){ return p.sofi ? 'rgba(14,124,192,0.85)' : 'rgba(157,180,196,0.65)'; }),
      borderColor:PEERS.map(function(p){ return p.sofi ? BRAND : '#7E8C9A'; }), borderWidth:1.5
    }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:18, right:16, left:6 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var p=PEERS[ctx.dataIndex]; return [p.name, 'Rev growth: +'+p.growth.toFixed(0)+'%', 'Fwd P/E: '+p.pe.toFixed(0)+'x', 'PEG: '+(p.peg==null?'n/m':p.peg.toFixed(2)), 'Users: '+p.users.toFixed(1)+'M']; } } } },
      scales:{
        x:{ title:{ display:true, text:'FY2025 revenue growth (YoY %)', color:'#5A6473', font:{ size:11 } }, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } },
        y:{ title:{ display:true, text:'Forward P/E (x)', color:'#5A6473', font:{ size:11 } }, beginAtZero:true, grace:'14%', grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'x'; } } }
      } },
    plugins:[peerScatterLabels]
  });
}
// Wire the year-window slider (rebuilds the trends chart on every change).
function setupPeerSlider(){
  var mn = document.getElementById('peerMin'), mx = document.getElementById('peerMax'), fill = document.getElementById('peerFill');
  if (!mn || !mx || !fill) return;
  var maxI = PEER_YEARS.length - 1;
  var e0 = document.getElementById('peerEnd0'), e1 = document.getElementById('peerEnd1');
  function apply(){
    var a = Math.min(+mn.value, +mx.value), b = Math.max(+mn.value, +mx.value);
    fill.style.left = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    if (e0) e0.textContent = PEER_YEARS[a];
    if (e1) e1.textContent = PEER_YEARS[b];
    buildPeerTS();
  }
  mn.oninput = apply; mx.oninput = apply; apply();
}
function buildPeersTab(){
  setupPeerSlider(); // also builds the trends chart
  buildPeerMix();
  buildPeerScatter();
}
function switchPeerMetric(root, k){
  if (!PEER_SERIES[k]) return;
  _peerMetric = k;
  root.querySelectorAll('.peer-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-peer') === k); });
  buildPeerTS();
}
function switchPeerView(root, v){
  if (['level','yoy','cagr'].indexOf(v) < 0) return;
  _peerView = v;
  root.querySelectorAll('.peer-view').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-peerview') === v); });
  buildPeerTS();
}

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
    '<button type="button" class="ovt-tab" data-ovt="peers">Peers</button>'+
  '</div>';
  // Panes
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="members" hidden>'+membersBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="interest" hidden>'+interestBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="fees" hidden>'+feeBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="valuation" hidden>'+valuationBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="sensitivity" hidden>'+sensBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="peers" hidden>'+peersBody(c)+'</div>';
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
  requestAnimationFrame(buildEvoTab);
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

// ─── Valuation → Estimate revisions across snapshots (vintage chart) ─────────
// For each projected fiscal year, how the Summit DCF estimate changed across the
// model's stored snapshots. Values in US$ millions, from projection_history.
// SoFi has 3 snapshots: 2026-02-03, 2026-04-29, 2026-05-13 (the last carried the
// same projections as 2026-04-29 — no change).
var EVO_INTRO = 'Our Summit DCF model is re-snapshotted over time. This shows, for each projected fiscal year, how the model\'s estimate has moved from one snapshot to the next — e.g. how the 2027 revenue projection changed between February and April 2026. Pick a metric; each line is a future year.';
var EVO_SOURCE = 'Source: Summit DCF model for SOFI — projection_history across the three stored snapshots (3 Feb 2026, 29 Apr 2026, 13 May 2026). Values in US$ millions. The 13 May 2026 snapshot carried forward the same projections as 29 Apr 2026 (no change). Data sourced from Summit DCF models.';
var EVO_SNAPS  = [ { d:'2026-02-03', l:'Feb 2026' }, { d:'2026-04-29', l:'Apr 2026' }, { d:'2026-05-13', l:'May 2026' } ];
var EVO_YEARS  = ['2026','2027','2028','2029'];
var EVO_COLORS = ['#0E7CC0','#1E9E62','#E8833A','#8E6FD0'];
// proj[year] = [value at snapshot0, snapshot1, snapshot2] in US$ millions.
var EVO_METRICS = {
  rev: { short:'Revenue', label:'Total Net Revenue', unit:'usd',
    proj:{ '2026':[4613,4670,4670], '2027':[6105,6288,6288], '2028':[7986,8133,8133], '2029':[8839,9408,9408] },
    note:'Total net revenue projection by fiscal year, at each model snapshot. All four out-years were nudged up between the Feb and Apr 2026 snapshots; the May 2026 snapshot left them unchanged.' },
  ebitda: { short:'Adj. EBITDA', label:'Adjusted EBITDA', unit:'usd',
    proj:{ '2026':[1716,1852,1852], '2027':[2204,2293,2293], '2028':[3086,3112,3112], '2029':[2850,3268,3268] },
    note:'Adjusted EBITDA projection by fiscal year. Note FY2029: the Feb snapshot modeled it below FY2028, then the Apr snapshot revised it back above — the model smoothed the out-year curve.' },
  ani: { short:'Adj. Net Income', label:'Adjusted Net Income', unit:'usd',
    proj:{ '2026':[939,1160,1160], '2027':[1244,1292,1292], '2028':[1874,1865,1865], '2029':[1816,2160,2160] },
    note:'Adjusted net income projection by fiscal year. FY2026 saw the largest upward revision (+24% Feb→Apr); FY2028 ticked slightly down while FY2029 was raised sharply.' }
};
var _evoChart = null;
var _evoMetric = 'rev';

function buildEvoChart(){
  var cv = document.getElementById('sofiEvoChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_evoChart){ _evoChart.destroy(); _evoChart = null; }
  _evoChart = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels: EVO_SNAPS.map(function(s){ return s.l; }), datasets: [] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:10, right:14 } },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#5A6473', usePointStyle:true } },
        tooltip:{ callbacks:{ label:function(ctx){
          var ds = EVO_METRICS[_evoMetric], arr = ds.proj[EVO_YEARS[ctx.datasetIndex]];
          var base = arr[0], v = ctx.parsed.y, pc = base ? (v - base) / base * 100 : 0;
          return 'FY'+EVO_YEARS[ctx.datasetIndex]+': '+guidFmt(ds.unit, v)+'  ('+(pc>=0?'+':'−')+Math.abs(pc).toFixed(1)+'% vs first)';
        } } }
      },
      scales:{
        y:{ display:true, grace:'8%', grid:{ color:'rgba(0,0,0,0.04)' },
          ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return guidFmt(EVO_METRICS[_evoMetric].unit, v); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }
      }
    }
  });
}

function renderEvo(){
  var ds = EVO_METRICS[_evoMetric];
  if (_evoChart){
    _evoChart.data.datasets = EVO_YEARS.map(function(y, i){
      return { label:'FY'+y, data:ds.proj[y], borderColor:EVO_COLORS[i], backgroundColor:EVO_COLORS[i],
        borderWidth:2.5, pointRadius:3.5, pointBackgroundColor:'#fff', pointBorderColor:EVO_COLORS[i], pointBorderWidth:1.5, fill:false, tension:0 };
    });
    _evoChart.update('none');
  }
  var t = document.getElementById('evoChartT');
  if (t) t.innerHTML = esc(ds.label) + ' estimate by projection year <span>(across snapshots · hover for % vs first)</span>';
  var note = document.getElementById('evoNote'); if (note) note.textContent = ds.note;
  var box = document.getElementById('evoStats'), scope = document.getElementById('evoScope');
  if (scope) scope.textContent = '· ' + ds.label + ' · ' + EVO_SNAPS[0].l + ' → ' + EVO_SNAPS[EVO_SNAPS.length - 1].l;
  if (box){
    box.innerHTML = EVO_YEARS.map(function(y){
      var arr = ds.proj[y], base = arr[0], last = arr[arr.length - 1];
      var pc = base ? (last - base) / base * 100 : 0;
      var dir = pc > 0.05 ? 'up' : (pc < -0.05 ? 'down' : 'muted');
      var sub = (pc >= 0 ? '+' : '−') + Math.abs(pc).toFixed(1) + '% since ' + EVO_SNAPS[0].l;
      return '<div class="ov-kpi"><div class="ov-kpi-l">FY'+y+'</div><div class="ov-kpi-v">'+guidFmt(ds.unit, last)+
        '</div><div class="ov-kpi-d '+dir+'">'+esc(sub)+'</div></div>';
    }).join('');
  }
}

function buildEvoTab(){ buildEvoChart(); renderEvo(); }

function switchEvoMetric(root, k){
  if (!EVO_METRICS[k]) return;
  _evoMetric = k;
  root.querySelectorAll('.evo-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-evo') === k); });
  renderEvo();
}

// ─── Valuation: Actuals vs. Guidance engine ──────────────────────────────────
var _guidChart  = null;
var _guidMode   = 'annual';     // 'annual' | 'quarterly'
var _guidMetric = 'rev';        // rev | ebitda | ni | eps
var _guidYear   = 'FY25';

function guidMid(g){ return (g.lo + g.hi) / 2; }
function guidPct(v){ return (v < 0 ? '−' : '+') + Math.abs(v).toFixed(1) + '%'; }
function guidFmt(unit, v){
  if (v == null) return '—';
  if (unit === 'eps') return '$' + v.toFixed(2);
  return '$' + Math.round(v).toLocaleString() + 'M';
}

// ── Annual mode ──
// Inline plugin: dashed "actual" reference line + value & %-vs-prior on each guide point.
var guidAnnLabels = {
  id: 'guidAnnLabels',
  afterDatasetsDraw: function(chart){
    var area = chart.chartArea; if (!area) return;
    var ctx = chart.ctx;
    var actual = chart.$gactual, unit = chart.$unit, info = chart.$ginfo || [];
    if (actual != null && chart.scales.y){
      var ya = chart.scales.y.getPixelForValue(actual);
      ctx.save();
      ctx.strokeStyle = AVE_GREEN; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(area.left, ya); ctx.lineTo(area.right, ya); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = AVE_GREEN; ctx.font = '700 10px Inter, sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('Actual ' + guidFmt(unit, actual), area.right - 2, ya - 5);
      ctx.restore();
    }
    var meta = chart.getDatasetMeta(2); if (!meta) return;
    meta.data.forEach(function(pt, i){
      var d = info[i]; if (!d) return;
      ctx.save(); ctx.textAlign = 'center';
      ctx.fillStyle = '#1E2733'; ctx.font = '700 11px Inter, sans-serif';
      ctx.fillText(guidFmt(unit, d.mid), pt.x, pt.y - 22);
      if (d.pct != null){
        ctx.font = '600 10px Inter, sans-serif';
        ctx.fillStyle = d.pct >= 0 ? AVE_GREEN : AVE_RED;
        ctx.fillText((d.pct >= 0 ? '▲' : '▼') + guidPct(d.pct), pt.x, pt.y - 9);
      }
      ctx.restore();
    });
  }
};

// Raise/cut analytics across every fiscal year for a metric.
function computeGuidRaises(metricKey){
  var ds = GUID_ANNUAL[metricKey];
  var raises = 0, cuts = 0, rSum = 0, cSum = 0, beat = 0, beatN = 0, perYear = [];
  // Accuracy of the FINAL guide vs the actual, across years that have reported.
  var aLow = 0, aMid = 0, aHigh = 0, upSum = 0, upN = 0, dnSum = 0, dnN = 0;
  ds.years.forEach(function(yr){
    var r = 0, c = 0, prev = null;
    yr.g.forEach(function(g){
      var m = guidMid(g);
      if (prev != null){
        var pc = (m - prev) / prev * 100;
        if (pc > 0.05) { raises++; r++; rSum += pc; }
        else if (pc < -0.05) { cuts++; c++; cSum += pc; }
      }
      prev = m;
    });
    var last = yr.g[yr.g.length - 1];
    var initMid = guidMid(yr.g[0]), finalMid = guidMid(last);
    var bF = null, bI = null;
    if (yr.a != null){
      beatN++; if (yr.a >= finalMid) beat++;
      bF = (yr.a - finalMid) / finalMid * 100; bI = (yr.a - initMid) / initMid * 100;
      if (yr.a >= last.lo) aLow++;
      if (yr.a >= finalMid) aMid++;
      if (yr.a >= last.hi) aHigh++;
      if (bF >= 0) { upSum += bF; upN++; } else { dnSum += bF; dnN++; }
    }
    perYear.push({ fy:yr.fy, raises:r, cuts:c, init:initMid, final:finalMid, actual:yr.a, beatFinal:bF, beatInit:bI });
  });
  return { raises:raises, cuts:cuts, avgRaise: raises ? rSum / raises : 0, avgCut: cuts ? cSum / cuts : 0,
    beat:beat, beatN:beatN, perYear:perYear,
    accN:beatN, aboveLow:aLow, aboveMid:aMid, aboveHigh:aHigh,
    avgAbove: upN ? upSum / upN : null, avgBelow: dnN ? dnSum / dnN : null };
}

function renderGuidYearPills(){
  var box = document.getElementById('guidYearPills'); if (!box) return;
  var ds = GUID_ANNUAL[_guidMetric];
  if (!ds.years.some(function(y){ return y.fy === _guidYear; })) _guidYear = ds.years[ds.years.length - 1].fy;
  box.innerHTML = ds.years.map(function(y){
    return '<button type="button" class="guid-year'+(y.fy === _guidYear ? ' active' : '')+'" data-guidy="'+y.fy+'">'+esc(y.fy)+'</button>';
  }).join('');
}

function renderGuidStatsAnnual(){
  var box = document.getElementById('guidStats'), scope = document.getElementById('guidStatScope');
  if (!box) return;
  var ds = GUID_ANNUAL[_guidMetric], st = computeGuidRaises(_guidMetric);
  if (scope) scope.textContent = '· ' + ds.label + ' · all fiscal years · "above" = vs final guide';
  function tile(l, v, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  function rate(c){ return st.accN ? Math.round(c / st.accN * 100) + '%' : '—'; }
  box.innerHTML =
    tile('Guidance raises', String(st.raises), 'times SoFi raised the full-year guide', 'up') +
    tile('Avg raise', st.raises ? guidPct(st.avgRaise) : '—', 'per upward revision', 'up') +
    tile('Guidance cuts', String(st.cuts), st.cuts ? 'times SoFi cut the guide' : 'never cut the guide', st.cuts ? 'down' : 'up') +
    tile('Avg cut', st.cuts ? guidPct(st.avgCut) : '—', st.cuts ? 'per downward revision' : 'no cuts on record', st.cuts ? 'down' : 'muted') +
    tile('Above low', rate(st.aboveLow), st.aboveLow + ' of ' + st.accN + ' yrs ≥ final low', 'up') +
    tile('Above mid', rate(st.aboveMid), st.aboveMid + ' of ' + st.accN + ' yrs ≥ final mid', 'up') +
    tile('Above high', rate(st.aboveHigh), st.aboveHigh + ' of ' + st.accN + ' yrs ≥ final high', 'up') +
    tile('Avg above guide', st.avgAbove != null ? guidPct(st.avgAbove) : '—', 'when actual beat (vs final mid)', 'up') +
    tile('Avg below guide', st.avgBelow != null ? guidPct(st.avgBelow) : '—', st.avgBelow != null ? 'when actual missed' : 'never missed final guide', st.avgBelow != null ? 'down' : 'muted');
}

function renderGuidTable(){
  var box = document.getElementById('guidTable'); if (!box) return;
  var ds = GUID_ANNUAL[_guidMetric], st = computeGuidRaises(_guidMetric);
  var rows = st.perYear.map(function(p){
    var act = p.actual != null ? guidFmt(ds.unit, p.actual) : '<span class="guid-mut">in progress</span>';
    var bf = p.beatFinal != null ? '<span class="'+(p.beatFinal >= 0 ? 'guid-up' : 'guid-dn')+'">'+guidPct(p.beatFinal)+'</span>' : '—';
    var bi = p.beatInit != null ? '<span class="'+(p.beatInit >= 0 ? 'guid-up' : 'guid-dn')+'">'+guidPct(p.beatInit)+'</span>' : '—';
    return '<tr data-fy="'+p.fy+'"'+(p.fy === _guidYear ? ' class="guid-row-on"' : '')+'><td>'+esc(p.fy)+'</td><td>'+guidFmt(ds.unit, p.init)+
      '</td><td>'+guidFmt(ds.unit, p.final)+'</td><td>'+act+'</td><td>'+p.raises+'↑ / '+p.cuts+'↓</td><td>'+bf+'</td><td>'+bi+'</td></tr>';
  }).join('');
  box.innerHTML = '<table class="guid-tbl"><thead><tr><th>FY</th><th>Initial</th><th>Final guide</th><th>Actual</th><th>Revisions</th><th>vs final</th><th>vs initial</th></tr></thead><tbody>'+rows+'</tbody></table>';
}

function renderGuidAnnual(){
  renderGuidYearPills();
  var ds = GUID_ANNUAL[_guidMetric], years = ds.years, yr = null;
  for (var k = 0; k < years.length; k++){ if (years[k].fy === _guidYear){ yr = years[k]; break; } }
  if (!yr){ yr = years[years.length - 1]; _guidYear = yr.fy; }
  var labels = [], mid = [], lo = [], hi = [], info = [], prev = null;
  yr.g.forEach(function(g){
    labels.push(g.s === 'Initial' ? 'Initial guide' : g.s + ' revision');
    var m = guidMid(g); mid.push(m); lo.push(g.lo); hi.push(g.hi);
    info.push({ mid:m, lo:g.lo, hi:g.hi, pct: prev != null ? (m - prev) / prev * 100 : null });
    prev = m;
  });
  // Y-axis bounds must include the actual line (it can sit above/below the guide band).
  var yMax = Math.max.apply(null, hi), yMin = Math.min.apply(null, lo);
  if (yr.a != null){ yMax = Math.max(yMax, yr.a); yMin = Math.min(yMin, yr.a); }
  var cv = document.getElementById('sofiGuidChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_guidChart){ _guidChart.destroy(); _guidChart = null; }
  _guidChart = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels: labels, datasets: [
      { label:'hi', data:hi, borderColor:'transparent', pointRadius:0, fill:false, tension:0 },
      { label:'lo', data:lo, borderColor:'transparent', pointRadius:0, fill:'-1', backgroundColor:'rgba(14,124,192,0.10)', tension:0 },
      { label:'Guide', data:mid, borderColor:BRAND, backgroundColor:BRAND, borderWidth:2.5, pointRadius:4, pointBackgroundColor:'#fff', pointBorderColor:BRAND, pointBorderWidth:2, fill:false, tension:0 }
    ] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:42, bottom:6, right:10 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ filter:function(it){ return it.datasetIndex === 2; }, callbacks:{
          label:function(ctx){
            var d = info[ctx.dataIndex], o = ['Guide: ' + guidFmt(ds.unit, d.mid)];
            if (d.hi > d.lo) o.push('Range: ' + guidFmt(ds.unit, d.lo) + ' – ' + guidFmt(ds.unit, d.hi));
            if (d.pct != null) o.push('vs prior guide: ' + guidPct(d.pct));
            if (yr.a != null) o.push('vs actual: ' + guidPct((d.mid - yr.a) / yr.a * 100));
            return o;
          }
        } }
      },
      scales:{
        y:{ display:true, grace:'12%', suggestedMin:yMin, suggestedMax:yMax, grid:{ color:'rgba(0,0,0,0.04)' },
          ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return guidFmt(ds.unit, v); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }
      }
    },
    plugins: [guidAnnLabels]
  });
  _guidChart.$ginfo = info; _guidChart.$gactual = yr.a; _guidChart.$unit = ds.unit;
  _guidChart.update('none');
  var t = document.getElementById('guidChartT');
  if (t) t.innerHTML = esc(ds.label) + ' — ' + esc(yr.fy) + ' guidance vs actual <span>(line = guide midpoint · band = range · dashed = actual)</span>';
  var note = document.getElementById('guidNote'); if (note) note.textContent = ds.note;
  renderGuidStatsAnnual();
}

// ── Quarterly mode ──
// Build the metric series, filtered to quarters that actually had a guide.
function guidQtrSeries(metricKey){
  var ds = GUID_QTR[metricKey];
  var quarters = [], est = [], act = [], lo = [], hi = [];
  ds.q.forEach(function(x){ if (x.g){ quarters.push(x.q); est.push(guidMid(x.g)); act.push(x.a); lo.push(x.g.lo); hi.push(x.g.hi); } });
  return { quarters:quarters, est:est, act:act, lo:lo, hi:hi, unit:ds.unit, label:ds.label, note:ds.note, exp:false };
}

function buildGuidQtrChart(){
  var cv = document.getElementById('sofiGuidChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_guidChart){ _guidChart.destroy(); _guidChart = null; }
  _guidChart = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [ { label:'Surprise', data:[], backgroundColor:[], borderRadius:3, maxBarThickness:48 } ] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:24, bottom:22 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ return (_guidChart.$q || [])[items[0].dataIndex] || ''; },
          label:function(ctx){
            var i = ctx.dataIndex, u = _guidChart.$unit;
            return [ 'Guide: ' + guidFmt(u, (_guidChart.$est || [])[i]),
                     'Actual: ' + guidFmt(u, (_guidChart.$act || [])[i]),
                     'Surprise: ' + guidPct((_guidChart.$surp || [])[i]) ];
          }
        } }
      },
      scales:{ y:{ display:false, grace:'22%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } }
    },
    plugins: [aveLabels]
  });
}

function renderGuidQtr(a, b){
  var s = guidQtrSeries(_guidMetric);
  if (_guidChart){
    var labels = [], est = [], act = [], surp = [], colors = [];
    for (var i = a; i <= b; i++){
      var sp = (s.act[i] - s.est[i]) / Math.abs(s.est[i]) * 100;
      labels.push(s.quarters[i]); est.push(s.est[i]); act.push(s.act[i]);
      surp.push(+sp.toFixed(1)); colors.push(sp >= 0 ? AVE_GREEN : AVE_RED);
    }
    _guidChart.data.labels = labels;
    _guidChart.data.datasets[0].data = surp;
    _guidChart.data.datasets[0].backgroundColor = colors;
    _guidChart.$surp = surp; _guidChart.$est = est; _guidChart.$act = act; _guidChart.$q = labels; _guidChart.$exp = false; _guidChart.$unit = s.unit;
    _guidChart.update('none');
  }
  var read = document.getElementById('guidReadout');
  if (read){
    var sb = (s.act[b] - s.est[b]) / Math.abs(s.est[b]) * 100;
    read.innerHTML =
      '<span class="sg-range">'+s.quarters[a]+' → '+s.quarters[b]+'</span>'+
      '<span class="sg-stat">guide <b>'+guidFmt(s.unit, s.est[b])+'</b> vs act <b>'+guidFmt(s.unit, s.act[b])+'</b></span>'+
      '<span class="sg-stat '+(sb >= 0 ? 'sg-cagr' : '')+'">'+s.quarters[b]+' surprise <b>'+guidPct(sb)+'</b></span>';
  }
  var t = document.getElementById('guidChartT');
  if (t) t.innerHTML = esc(s.label) + ' — quarterly guide vs actual <span>(surprise %, per quarter · hover for $)</span>';
  var note = document.getElementById('guidNote'); if (note) note.textContent = s.note;
  renderGuidStatsQtr(a, b);
}

function renderGuidStatsQtr(a, b){
  var box = document.getElementById('guidStats'), scope = document.getElementById('guidStatScope');
  if (!box) return;
  var s = guidQtrSeries(_guidMetric), st = computeAveStats(s, a, b);
  if (scope) scope.textContent = '· ' + s.quarters[a] + '–' + s.quarters[b] + ' · ' + st.n + ' guided quarters';
  // Accuracy vs each quarter's guide range (low / mid / high) over the window.
  var aLow = 0, aMid = 0, aHigh = 0, upSum = 0, upN = 0, dnSum = 0, dnN = 0, nn = 0;
  for (var i = a; i <= b; i++){
    nn++;
    var av = s.act[i], mid = s.est[i];
    if (av >= s.lo[i]) aLow++;
    if (av >= mid)     aMid++;
    if (av >= s.hi[i]) aHigh++;
    var sp = (av - mid) / Math.abs(mid) * 100;
    if (sp >= 0) { upSum += sp; upN++; } else { dnSum += sp; dnN++; }
  }
  function rate(c){ return nn ? Math.round(c / nn * 100) + '%' : '—'; }
  function tile(l, v, sub, dir){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+
      '</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>';
  }
  box.innerHTML =
    tile('Above low', rate(aLow), aLow+' of '+nn+' ≥ guide low', 'up') +
    tile('Above mid', rate(aMid), aMid+' of '+nn+' ≥ guide mid', 'up') +
    tile('Above high', rate(aHigh), aHigh+' of '+nn+' ≥ guide high', 'up') +
    tile('Avg above guide', upN ? guidPct(upSum / upN) : '—', 'avg beat (vs mid) when above', 'up') +
    tile('Avg below guide', dnN ? guidPct(dnSum / dnN) : '—', dnN ? 'avg miss (vs mid) when below' : 'never below mid', dnN ? 'down' : 'muted') +
    tile('Avg surprise', guidPct(st.avg), 'overall vs guide midpoint', st.avg >= 0 ? 'up' : 'down') +
    tile('Biggest beat', guidPct(st.best.s), st.best.q, 'up') +
    tile('Latest ('+st.last.q+')', guidPct(st.last.s), st.last.f >= 0 ? 'beat guide' : 'missed guide', st.last.f >= 0 ? 'up' : 'down');
}

function setupGuidQtrSlider(){
  var mn = document.getElementById('guidMin'), mx = document.getElementById('guidMax');
  var fill = document.getElementById('guidFill');
  if (!mn || !mx || !fill) return;
  var s = guidQtrSeries(_guidMetric), maxI = s.quarters.length - 1;
  mn.max = maxI; mx.max = maxI; mn.value = 0; mx.value = maxI;
  var e0 = document.getElementById('guidEnd0'), e1 = document.getElementById('guidEnd1');
  if (e0) e0.textContent = s.quarters[0];
  if (e1) e1.textContent = s.quarters[maxI];
  function apply(){
    var a = Math.min(+mn.value, +mx.value), b = Math.max(+mn.value, +mx.value);
    fill.style.left  = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    renderGuidQtr(a, b);
  }
  mn.oninput = apply; mx.oninput = apply; apply();
}

// Apply the current Annual/Quarterly mode: toggle controls, set legend, (re)build chart.
function applyGuidMode(){
  var ann = _guidMode === 'annual';
  var ac = document.getElementById('guidAnnualControls'); if (ac) ac.hidden = !ann;
  var qc = document.getElementById('guidQtrControls');    if (qc) qc.hidden = ann;
  var tw = document.getElementById('guidTableWrap');      if (tw) tw.hidden = !ann;
  var leg = document.getElementById('guidLeg');
  if (leg){
    leg.innerHTML = ann
      ? '<span class="tech-leg-i"><span class="ave-leg-act" style="background:'+BRAND+'"></span>Guide (midpoint)</span>'+
        '<span class="tech-leg-i"><span class="ave-leg-act" style="background:rgba(14,124,192,0.20)"></span>Guided range</span>'+
        '<span class="tech-leg-i"><span class="guid-leg-line"></span>Actual</span>'
      : '<span class="tech-leg-i"><span class="ave-leg-act" style="background:'+AVE_GREEN+'"></span>Beat guide</span>'+
        '<span class="tech-leg-i"><span class="ave-leg-act" style="background:'+AVE_RED+'"></span>Missed guide</span>'+
        '<span class="tech-leg-i">▲ above · ▼ below guide</span>';
  }
  if (ann) requestAnimationFrame(function(){ renderGuidAnnual(); renderGuidTable(); });
  else     requestAnimationFrame(function(){ buildGuidQtrChart(); setupGuidQtrSlider(); });
}

function buildGuidanceTab(){ applyGuidMode(); }

// Switch a nested Fee Income sub-tab.
function showOvf(root, key){
  root.querySelectorAll('.ovf-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovf') === key); });
  root.querySelectorAll('.ovf-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovf') !== key); });
  buildFeeTab();
}

// Switch a nested Valuation sub-tab.
function showOvv(root, key){
  root.querySelectorAll('.ovv-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovv') === key); });
  root.querySelectorAll('.ovv-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovv') !== key); });
  if (key === 'estimates') requestAnimationFrame(buildAveTab);
  if (key === 'guidance')  requestAnimationFrame(buildGuidanceTab);
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
  if (key === 'peers') requestAnimationFrame(buildPeersTab);
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
  root.querySelectorAll('.ovv-tab').forEach(function(btn){
    btn.onclick = function(){ showOvv(root, btn.getAttribute('data-ovv')); };
  });
  // Valuation → Actuals vs. Estimates: metric selector pills.
  root.querySelectorAll('.ave-pill').forEach(function(btn){
    btn.onclick = function(){ switchAveMetric(root, btn.getAttribute('data-ave')); };
  });
  // Valuation → Estimate revisions across snapshots: metric pills.
  root.querySelectorAll('.evo-pill').forEach(function(btn){
    btn.onclick = function(){ switchEvoMetric(root, btn.getAttribute('data-evo')); };
  });
  // Sensitivity: driver category buttons.
  root.querySelectorAll('.senscat').forEach(function(btn){
    btn.onclick = function(){ switchSensScen(root, btn.getAttribute('data-senscat')); };
  });
  // Peers: trends metric pills + view (level/YoY/CAGR) toggles.
  root.querySelectorAll('.peer-pill').forEach(function(btn){
    btn.onclick = function(){ switchPeerMetric(root, btn.getAttribute('data-peer')); };
  });
  root.querySelectorAll('.peer-view').forEach(function(btn){
    btn.onclick = function(){ switchPeerView(root, btn.getAttribute('data-peerview')); };
  });
  // Valuation → Actuals vs. Guidance: mode toggle, metric pills, year pills, table.
  root.querySelectorAll('.guid-mode').forEach(function(btn){
    btn.onclick = function(){
      var m = btn.getAttribute('data-guidmode');
      if (m === _guidMode) return;
      _guidMode = m;
      root.querySelectorAll('.guid-mode').forEach(function(x){ x.classList.toggle('active', x === btn); });
      applyGuidMode();
    };
  });
  root.querySelectorAll('.guid-pill').forEach(function(btn){
    btn.onclick = function(){
      var k = btn.getAttribute('data-guidm');
      if (!GUID_ANNUAL[k]) return;
      _guidMetric = k;
      root.querySelectorAll('.guid-pill').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-guidm') === k); });
      applyGuidMode();
    };
  });
  var gyp = document.getElementById('guidYearPills');
  if (gyp) gyp.addEventListener('click', function(e){
    var b = e.target.closest('.guid-year'); if (!b) return;
    _guidYear = b.getAttribute('data-guidy');
    renderGuidAnnual(); renderGuidTable();
  });
  var gtbl = document.getElementById('guidTable');
  if (gtbl) gtbl.addEventListener('click', function(e){
    var tr = e.target.closest('tr[data-fy]'); if (!tr) return;
    _guidYear = tr.getAttribute('data-fy');
    renderGuidAnnual(); renderGuidTable();
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
