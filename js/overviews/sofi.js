// overviews/sofi.js — custom Overview for SoFi Technologies, Inc. (Nasdaq: SOFI)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// This module renders two internal sub-tabs inside the Overview pane:
//   1. Overview — company profile (one-stop digital bank: three segments on a national charter)
//   2. Growth   — the member/product flywheel, operating leverage, and path to profitability
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
  '<b>Technology Platform</b> (<b>$450M</b>) provides the rails — card issuing, payments and core-banking software (Galileo + Technisys) — that power other fintechs and banks.',
  'The flywheel is the <b>Financial Services Productivity Loop</b>: a strong member experience drives existing members to add more products (<b>43% cross-buy</b> in Q1 2026), lowering acquisition cost and lifting lifetime value.',
  'SoFi is ~<b>96% deposit-funded</b>, giving it a low cost of capital and a ~<b>5.9% net interest margin</b>.',
];

// Three reportable segments — FY2025 net revenue (vs FY2024) and contribution profit.
var SEGMENTS = [
  ['Lending — $1.85B net revenue', 'Personal, student and home loans. Earns net interest income on loans held for investment, gains on loan sales/securitizations, and capital-light origination fees from the Loan Platform Business. FY2025 contribution profit $1.02B (~55% margin). Up from $1.49B revenue in FY2024.'],
  ['Financial Services — $1.54B net revenue', 'SoFi Money (checking & savings), SoFi Invest, Credit Card, Relay, Crypto, At Work and Protect. Monetized through deposit-driven net interest income, interchange and fees. FY2025 contribution profit $793M — nearly doubled from $821M revenue in FY2024 (+88%).'],
  ['Technology Platform — $450M net revenue', 'Galileo (card issuing & payments APIs) and Technisys (cloud-native core banking) — the infrastructure behind other fintechs and banks. FY2025 contribution profit $144M. Revenue pressured by a large client transitioning off the platform.'],
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

// ─── Growth tab: time series ──────────────────────────────────────────────────
// Members & Products by quarter (millions). Source: Q1 2026 investor deck, Company Metrics.
var GQ_LABELS  = ['Q1·24','Q2·24','Q3·24','Q4·24','Q1·25','Q2·25','Q3·25','Q4·25','Q1·26'];
var GQ_MEMBERS = [ 8.13,  8.77,  9.37, 10.13, 10.92, 11.75, 12.64, 13.65, 14.71 ];
var GQ_PRODUCTS= [11.83, 12.78, 13.65, 14.75, 15.92, 17.14, 18.55, 20.17, 22.16 ];
var GQ_NOTE = 'Total members and total products at quarter-end (millions). Members have grown at a ~38% CAGR since 2022 and products at ~37%; products grow faster than members because existing members keep adding products (43% of new products in Q1 2026 came from existing members). Source: SoFi Q1 2026 investor presentation.';
var _chartMP = null;

// Adjusted net revenue (annual, $B) with EBITDA margin overlay. 2026E = company guidance.
var REV_YEARS   = ['2022','2023','2024','2025','2026E'];
var REV_ADJ     = [ 1.54,  2.07,  2.61,  3.59,  4.66 ];   // adjusted net revenue, $B
var REV_MARGIN  = [    9,    21,    26,    29,    34 ];    // adjusted EBITDA margin, %
var REV_FIRST_EST = 4;                                     // index of first estimated year (2026E)
var REV_NOTE = 'Adjusted net revenue (bars, $B, left) and adjusted EBITDA margin (line, %, right), fiscal years. 2022–2025 are actuals; 2026E is company guidance (~$4.66B revenue at a ~34% margin). SoFi also targets ~$7.9B of adjusted net revenue by 2028 (~30% CAGR). Revenue has compounded while margin expanded every year — the operating-leverage story. Source: SoFi Q1 2026 investor presentation.';
var _chartRev = null;

// Path to profitability — adjusted net income (annual, $M). 2026E = guidance.
var NI_YEARS    = ['2022','2023','2024','2025','2026E'];
var NI_ADJ      = [ -320,  -54,   227,   481,   825 ];     // adjusted net income, $M
var NI_FIRST_EST = 4;
var NI_NOTE = 'Adjusted net income by fiscal year ($M). SoFi crossed from losses to durable profit in 2024 and roughly doubled adjusted net income in 2025; 2026E is company guidance of ~$825M. (Adjusted basis is used so the 2024 one-time tax benefit does not distort the trend.) Source: SoFi Q1 2026 investor presentation.';
var _chartNI = null;

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

// "Growth" sub-tab body — the three story charts.
function growthBody(c){
  var h = '';

  // 1 — Members & Products (the flywheel).
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Members & Products <span>(quarter-end, millions)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiChartMP"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(GQ_NOTE)+'</div>';

  // 2 — Adjusted net revenue + EBITDA margin (operating leverage).
  h += '<div class="ov-sec-h ovs-h">Revenue & Operating Leverage</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Adjusted Net Revenue & EBITDA Margin <span>($B bars · light = guidance · line = adj. EBITDA margin %)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiChartRev"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(REV_NOTE)+'</div>';

  // 3 — Path to profitability.
  h += '<div class="ov-sec-h ovs-h">Path to Profitability</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Adjusted Net Income <span>($M · light = guidance)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="sofiChartNI"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(NI_NOTE)+'</div>';

  return h;
}

function html(c){
  var h = '<div class="ov ov-sofi" data-brand="SOFI">';
  // Sub-tab bar
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="growth">Growth</button>'+
  '</div>';
  // Panes
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="growth" hidden>'+growthBody(c)+'</div>';
  h += '</div>';
  return h;
}

// ─── Charts ──────────────────────────────────────────────────────────────────
var BRAND = '#0E7CC0';   // SoFi blue
var BRAND2 = '#16C2A3';  // teal accent (products / margin)

// Value labels above the last point of each line in the Members/Products chart.
var mpEndLabels = {
  id: 'mpEndLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      if (meta.hidden || !meta.data.length) return;
      var i = meta.data.length - 1;
      var pt = meta.data[i];
      ctx.save();
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = ds.borderColor;
      ctx.textAlign = 'right';
      ctx.fillText(Number(ds.data[i]).toFixed(1) + 'M', pt.x - 6, pt.y - 8);
      ctx.restore();
    });
  }
};

function buildMPChart(){
  var cv = document.getElementById('sofiChartMP');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartMP) { _chartMP.destroy(); _chartMP = null; }
  _chartMP = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels: GQ_LABELS, datasets: [
      { label:'Products', data:GQ_PRODUCTS, borderColor:BRAND2, backgroundColor:'rgba(22,194,163,0.08)',
        borderWidth:2.5, pointRadius:3, pointHoverRadius:5, tension:.3, fill:true },
      { label:'Members', data:GQ_MEMBERS, borderColor:BRAND, backgroundColor:'rgba(14,124,192,0.08)',
        borderWidth:2.5, pointRadius:3, pointHoverRadius:5, tension:.3, fill:true },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false,
      layout:{ padding:{ top:20, right:30 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{size:12} } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+Number(ctx.parsed.y).toFixed(2)+'M'; } } }
      },
      scales:{
        y:{ beginAtZero:true, grid:{ color:'#EEF1F5' }, ticks:{ color:'#8A93A0', font:{size:11}, callback:function(v){ return v+'M'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:11} } }
      }
    },
    plugins: [mpEndLabels]
  });
}

// Labels above each revenue bar.
var revLabels = {
  id: 'revLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    meta.data.forEach(function(bar, i){
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#1E2733';
      ctx.fillText('$' + Number(REV_ADJ[i]).toFixed(2) + 'B', bar.x, bar.y - 8);
      ctx.restore();
    });
  }
};

function buildRevChart(){
  var cv = document.getElementById('sofiChartRev');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartRev) { _chartRev.destroy(); _chartRev = null; }
  var barColors = REV_ADJ.map(function(_, i){ return i >= REV_FIRST_EST ? 'rgba(14,124,192,0.40)' : BRAND; });
  _chartRev = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: REV_YEARS, datasets: [
      { type:'bar', label:'Adjusted net revenue ($B)', data:REV_ADJ, backgroundColor:barColors,
        borderRadius:4, maxBarThickness:64, yAxisID:'y', order:2 },
      { type:'line', label:'Adjusted EBITDA margin (%)', data:REV_MARGIN, borderColor:'#E8932A',
        backgroundColor:'#E8932A', borderWidth:2.5, pointRadius:3, pointHoverRadius:5, tension:.3,
        fill:false, yAxisID:'y1', order:1 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:26 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{size:12} } },
        tooltip:{ callbacks:{ label:function(ctx){
          return ctx.dataset.yAxisID === 'y1'
            ? 'Adj. EBITDA margin: ' + ctx.parsed.y + '%'
            : 'Adj. net revenue: $' + Number(ctx.parsed.y).toFixed(2) + 'B'; } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, grace:'16%' },
        y1:{ position:'right', beginAtZero:true, max:50, grid:{ display:false },
             ticks:{ color:'#E8932A', font:{size:11}, callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:12} } }
      }
    },
    plugins: [revLabels]
  });
}

// Labels above/below each net-income bar (handles negatives).
var niLabels = {
  id: 'niLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    meta.data.forEach(function(bar, i){
      var v = NI_ADJ[i];
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = v < 0 ? '#C0392B' : '#1E7A4B';
      var txt = (v < 0 ? '–$' + Math.abs(v) : '$' + v) + 'M';
      ctx.fillText(txt, bar.x, v < 0 ? bar.y + 16 : bar.y - 8);
      ctx.restore();
    });
  }
};

function buildNIChart(){
  var cv = document.getElementById('sofiChartNI');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartNI) { _chartNI.destroy(); _chartNI = null; }
  var colors = NI_ADJ.map(function(v, i){
    if (v < 0) return '#E2B4AE';                                  // loss years
    return i >= NI_FIRST_EST ? 'rgba(30,122,75,0.40)' : '#1E7A4B'; // profit (light = guidance)
  });
  _chartNI = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: NI_YEARS, datasets: [{ data: NI_ADJ, backgroundColor: colors, borderRadius:4, maxBarThickness:64 }] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:24, bottom:8 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; return 'Adjusted net income: ' + (v<0?'–$'+Math.abs(v):'$'+v) + 'M'; } } }
      },
      scales:{
        y:{ display:false, grace:'18%', grid:{ display:false } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:12} } }
      }
    },
    plugins: [niLabels]
  });
}

function buildGrowthTab(){
  buildMPChart();
  buildRevChart();
  buildNIChart();
}

// Switch sub-tab. Builds the tab's charts lazily the first time it becomes visible.
function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'growth') requestAnimationFrame(buildGrowthTab);
}

function init(c){
  var root = document.querySelector('.ov-sofi');
  if (!root) return;
  // Idempotent wiring (init may run again when the Overview pane is re-activated).
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  var active = root.querySelector('.ovt-tab.active');
  var activeKey = active ? active.getAttribute('data-ovt') : '';
  if (activeKey === 'growth') requestAnimationFrame(buildGrowthTab);
}

export var sofiOverview = { html: html, init: init };
