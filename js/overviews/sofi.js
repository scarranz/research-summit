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

// Placeholder body for tabs that are not built yet.
function soonBody(label){
  return '<div class="ovs-soon"><div class="ovs-soon-t">'+esc(label)+'</div>'+
    '<div class="ovs-soon-d">En desarrollo — lo construimos a continuación.</div></div>';
}

function html(c){
  var h = '<div class="ov ov-sofi" data-brand="SOFI">';
  // Sub-tab bar
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="members">Members</button>'+
    '<button type="button" class="ovt-tab" data-ovt="interest">Interest Income</button>'+
    '<button type="button" class="ovt-tab" data-ovt="fees">Fee Income</button>'+
  '</div>';
  // Panes
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="members" hidden>'+membersBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="interest" hidden>'+soonBody('Interest Income')+'</div>';
  h += '<div class="ovt-pane" data-ovt="fees" hidden>'+soonBody('Fee Income')+'</div>';
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

// Switch sub-tab. Builds the tab's chart lazily the first time it becomes visible.
function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'members') requestAnimationFrame(buildMembersTab);
}

function init(c){
  var root = document.querySelector('.ov-sofi');
  if (!root) return;
  // Idempotent wiring (init may run again when the Overview pane is re-activated).
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'members') requestAnimationFrame(buildMembersTab);
}

export var sofiOverview = { html: html, init: init };
