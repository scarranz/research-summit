// overviews/remitly.js — custom Overview for Remitly Global (NASDAQ: RELY)
// Built individually per the portal's per-company Overview model.
// Quantitative series (Active Customers, Send Volume) provided by the research team.
// Qualitative content sourced from Remitly IR / public filings (see SOURCES).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Quantitative data ───────────────────────────────────────────────────────
// Quarterly, chronological (oldest → newest): Q1 2021 … Q1 2026 (21 quarters)
var QLABELS = ['Q1 21','Q2 21','Q3 21','Q4 21','Q1 22','Q2 22','Q3 22','Q4 22','Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26'];
var ACTIVE  = [2.1,2.4,2.6,2.8,3.0,3.4,3.8,4.2,4.6,5.0,5.4,5.9,6.2,6.9,7.3,7.8,8.0,8.5,8.9,9.3,9.6];          // avg active customers (millions)
var SENDVOL = [4273,4976,5200,6000,6094,6964,7521,8052,8544,9580,10227,11108,11464,13241,14490,15400,16158,18477,19519,20800,22100]; // send volume (USD millions)
var TAKERATE = [2.13,2.23,2.33,2.25,2.23,2.26,2.25,2.37,2.39,2.44,2.36,2.38,2.35,2.31,2.32,2.29,2.24,2.23,2.15,2.13,2.05]; // take rate (% of send volume)

var _chartActive = null, _chartVol = null, _chartTake = null;

function fmtUSD_M(m){ if (m >= 1000) return '$' + (m/1000).toFixed(1).replace(/\.0$/,'') + 'B'; return '$' + m.toFixed(0) + 'M'; }
function yoyPct(arr){ var n=arr.length; if(n<5) return null; return ((arr[n-1]/arr[n-5]-1)*100); }
function pctStr(p){ return (p>=0?'+':'') + p.toFixed(0) + '%'; }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: RELY'],
  ['Founded', '2011 — Seattle, WA'],
  ['IPO', 'Sep 2021 · $43.00'],
  ['CEO', 'Sebastian Gunningham'],
  ['Founder / Chairman', 'Matt Oppenheimer'],
  ['Employees', '~3,200'],
];

var DESC = 'Remitly is a digital, mobile-first cross-border money-transfer and financial-services company built for immigrants and their families. Senders — mostly in the US and Europe — move money via the app to recipients in 170+ countries, who receive it to bank accounts, mobile wallets, or cash pickup, often within minutes.';

// Headline KPIs (Q1 2026 unless noted). Active/Send YoY are computed from the series.
var KPIS = [
  { l:'Active Customers', v:'9.6M',    d:pctStr(yoyPct(ACTIVE))+' YoY', dir:'up' },
  { l:'Send Volume',      v:'$22.1B',  d:pctStr(yoyPct(SENDVOL))+' YoY', dir:'up' },
  { l:'Revenue',          v:'$452.8M', d:'+25% YoY', dir:'up' },
  { l:'Adj. EBITDA',      v:'$101.6M', d:'+74% YoY', dir:'up' },
];
var AS_OF = 'Headline metrics are for the quarter ended March 31, 2026 (Q1 2026). Charts cover Q1 2021–Q1 2026.';
var FY_NOTE = 'FY2025: ~$1.6B revenue (+29%) · $74.9B send volume · ~2.05% take rate · first full year of GAAP profitability (net income $67.9M, Adj. EBITDA $272.2M, FCF $283M).';

var HOW_MONEY = [
  'Charges a <b>transaction fee</b> plus an <b>FX spread</b> on each transfer — together the effective <b>take rate</b> (revenue ÷ send volume), ~<b>2.05%</b> in Q1 2026.',
  'Revenue compounds with <b>active customers</b> and <b>send volume</b> — more senders moving more money each quarter.',
  'Take rate has trended down from a ~<b>2.44%</b> peak (Q4 2022) to ~<b>2.05%</b> (Q1 2026) even as send volume more than doubled.',
  'Digital, app-based delivery rather than legacy cash/agent networks.',
];

var SEGMENTS = [
  ['Consumer remittance (core)', 'App/web cross-border transfers to bank accounts, mobile wallets, cash pickup and home delivery. The vast majority of revenue. Managed as a single reportable segment.'],
  ['Remitly One', 'All-in-one financial membership (launched Sep 2025, $9.99/mo for eligible US customers) — move, manage and grow money across borders.'],
  ['Remitly Business', 'Newer category aimed at micro / small-business cross-border payments (highlighted at the 2025 Investor Day).'],
  ['Remitly for Developers', 'Remittance-as-a-service / API letting third parties embed Remitly\'s cross-border network.'],
];

var TIMELINE = [
  ['2011', 'Founded in Seattle as <b>BeamIt Mobile</b> by Matt Oppenheimer, Josh Hug and Shivaas Gulati; goes through Techstars Seattle.'],
  ['2012', 'Rebrands to <b>Remitly</b>; first corridors go live (e.g. US → Philippines, US → India).'],
  ['2014–19', 'Scales with Series A→E funding (QED, PayU/Naspers); 2019 round at ~$900M valuation, expands send-from markets beyond the US.'],
  ['2020', 'Reaches <b>~$1.5B</b> valuation (unicorn); launches Passbook neobank.'],
  ['Sep 2021', '<b>IPO</b> on Nasdaq at $43.00/share (ticker RELY), raising ~$523M.'],
  ['Jan 2023', 'Completes acquisition of <b>Rewire</b> (Israel); winds down Passbook in May 2023.'],
  ['2024', 'Customers send <b>$54B+</b> across <b>5,100+ corridors</b>.'],
  ['2025', 'Launches <b>Remitly One</b> (Sep); <b>Investor Day</b> (Dec) sets 2028 targets; <b>first full year of GAAP profitability</b>.'],
  ['Feb 2026', '<b>Sebastian Gunningham</b> becomes CEO; founder Matt Oppenheimer moves to Chairman.'],
];

var MNA = [
  {
    name: 'Rewire (R2C Ltd.)', date: 'Closed Jan 2023', value: '~$80M (≈$77M aggregate)', status: 'Private',
    did: 'Account-based digital financial platform for migrant workers — multi-currency accounts, stored-balance wallet, transfers and bill pay.',
    geo: 'Headquartered in Israel; served migrant communities across Europe.',
    product: 'Migrant neobank: accounts + cards + cross-border transfers.',
    adds: 'Expands into complementary geographies (Israel/Europe) and adds an account-based product that deepens customer relationships beyond one-off transfers.',
  },
];

var CORRIDORS = {
  sendFrom: 'Tens of send markets',
  receiveTo: '170+ receive countries',
  corridors: '5,100+ active corridors',
  payout: 'Payout to 3.5B+ bank accounts, 630M+ mobile wallets and ~470k cash-pickup locations.',
  topReceive: ['India', 'Mexico', 'Philippines'],
  concentration: 'The United States is the largest send market (~70% of send volume). Revenue from outside the top three receive markets (India/Mexico/Philippines) is now >50% of total — a sign of growing diversification.',
};

var PREFUNDING = [
  'To pay recipients <b>in minutes</b>, Remitly keeps its own cash <b>pre-positioned in local-currency accounts</b> in each disbursement market <i>before</i> the sender\'s funds have settled.',
  'It pre-funds disbursement partners <b>~1–2 business days in advance</b>, sized to <b>forecasted send volume</b> per corridor.',
  'This creates a <b>working-capital requirement</b>: cash is deployed into payout markets ahead of collecting from senders — too little starves the customer experience, too much leaves idle cash.',
  'Efficient prefunding (right amount, right place, right time) is central to free-cash-flow generation.',
];

var PEERS = [
  ['Wise (ex-TransferWise)', 'Multi-currency accounts + low-cost mid-market FX; consumers and businesses.', 'More "borderless banking" / higher-value & SMB transfers; Remitly is immigrant-remittance-first with deeper cash-out and mobile-wallet payout.'],
  ['Western Union', 'Legacy giant, 200+ countries, vast physical agent/cash network.', 'Remitly is digital-first, typically cheaper and faster; WU keeps unmatched physical payout reach.'],
  ['MoneyGram', 'Agent network + digital transfers, 200+ countries.', 'Similar cash/retail heritage; Remitly competes on app experience and price.'],
  ['Xoom (PayPal)', 'Digital remittance bundled inside PayPal.', 'Tied to the PayPal ecosystem; Remitly is a standalone immigrant-focused brand with broader corridor depth.'],
  ['Zepz (WorldRemit / Sendwave)', 'Mobile-first remittance apps; Sendwave strong in Africa/Asia.', 'Closest digital-native peer; competes corridor-by-corridor on price and payout options.'],
  ['dLocal', 'Cross-border payments infrastructure for enterprises in emerging markets.', 'A B2B merchant rail, not consumer remittance — adjacent rather than head-to-head.'],
];

var TAILWINDS = [
  'Large remittance market still shifting from cash/agent to digital — structural share gain for digital players.',
  'Smartphone penetration in send and receive markets expands the addressable base.',
  'Recurring, non-discretionary flows: senders support family regularly → durable volume.',
  '<b>US remittance tax (OBBBA §4475, 2026):</b> the 1% excise hits cash/money-order transfers but <b>exempts card- and bank-funded transfers</b> — favoring Remitly\'s digital model while taxing cash-based rivals.',
  'Scale advantages compound (corridor density, payout network, brand trust).',
];

var HEADWINDS = [
  'Price/competition pressure from well-funded digital rivals can compress take rate.',
  'FX volatility affects the spread and the value of pre-positioned local-currency balances.',
  'Heavy regulatory/compliance burden (money-transmitter licensing, AML/KYC, sanctions) across 170+ countries.',
  'Immigration-policy crackdowns could dampen overall flows even where Remitly\'s funding mix is favored.',
  'Working-capital / prefunding intensity scales with volume and is sensitive to funding costs.',
];

// TAM opportunity the company guides into (Investor Day, Dec 2025).
var TAM = [
  { v:'~$2T',    l:'Consumer (C2C) TAM',       s:'Remitly\'s core addressable remittance pool.' },
  { v:'<4%',     l:'Remitly share of TAM',     s:'Long runway — management\'s "headroom" for growth.' },
  { v:'24 / 50', l:'Top send markets live',    s:'The top 50 send countries are ~92% of global C2C TAM.' },
  { v:'>$22T',   l:'Total cross-border flows', s:'New products (Business, Receivers) expand the TAM by orders of magnitude.' },
];

// 2028 medium-term targets (Investor Day, Dec 2025).
var TARGETS = [
  { v:'$2.6–3.0B',  l:'Revenue',     s:'Medium-term target by 2028.' },
  { v:'$575–600M',  l:'Adj. EBITDA', s:'20–22% margin.' },
  { v:'Rule of 40', l:'Framework',   s:'3-yr revenue CAGR + Adj. EBITDA margin ≥ 40%.' },
];

// The drivers management points to for getting there.
var DRIVERS = [
  ['Remitly Business', 'Cross-border payments for micro and small businesses — a new category.'],
  ['Receivers', 'Recipient-side products that monetize the other end of the transfer.'],
  ['Remitly One & financial services', 'Scale the membership and value-added products beyond pure send-money.'],
  ['Geographic expansion', 'Enter the remaining high-opportunity send markets (24 → top 50).'],
  ['Unit economics & marketing efficiency', 'AI-driven cost leverage to widen margins as the base scales.'],
  ['High-value senders & stablecoins', 'Move up to high-amount senders; explore stablecoin rails.'],
];

var SOURCES = 'Sources: Remitly investor relations (Q1 2026 & FY2025 earnings releases, Dec 2025 Investor Day, Rewire acquisition & CEO-appointment releases), FY2024 10-K, and public reporting. Active-customer and send-volume series per internal research. Brand color is an estimate pending the official press-kit value.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }

function html(c){
  var h = '<div class="ov ov-rely" data-brand="RELY">';

  // 1 — Snapshot
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';

  // 2 — KPI tiles + FY note
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';

  // Charts
  h += '<div class="ov-charts">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Average Active Customers <span>(millions)</span></div><div class="ov-chart-wrap"><canvas id="ovChartActive"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Send Volume <span>(USD millions, quarterly)</span></div><div class="ov-chart-wrap"><canvas id="ovChartVolume"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Take Rate <span>(% of send volume)</span></div><div class="ov-chart-wrap"><canvas id="ovChartTake"></canvas></div></div>'+
  '</div>';

  // 3 — How it makes money
  h += sec('How Remitly Makes Money', bullets(HOW_MONEY));

  // 4 — Products & segments
  h += sec('Products & Segments', SEGMENTS.map(function(s){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+esc(s[1])+'</div></div>';
  }).join(''));

  // 5 — Timeline
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 6 — M&A
  h += sec('M&A Activity', MNA.map(function(m){
    return '<div class="ov-mna">'+
      '<div class="ov-mna-head"><span class="ov-mna-name">'+esc(m.name)+'</span>'+
        '<span class="ov-tag">'+esc(m.date)+'</span><span class="ov-tag">'+esc(m.value)+'</span><span class="ov-tag">'+esc(m.status)+'</span></div>'+
      '<div class="ov-mna-grid">'+
        '<div><span class="ov-mna-k">What it did</span>'+esc(m.did)+'</div>'+
        '<div><span class="ov-mna-k">Where</span>'+esc(m.geo)+'</div>'+
        '<div><span class="ov-mna-k">Product</span>'+esc(m.product)+'</div>'+
        '<div><span class="ov-mna-k">Adds to Remitly</span>'+esc(m.adds)+'</div>'+
      '</div></div>';
  }).join(''));

  // 7 — Corridors
  h += sec('Corridors & Geographic Presence',
    '<div class="ov-corr-stats">'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.sendFrom)+'</div><div class="ov-corr-l">Send from</div></div>'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.receiveTo)+'</div><div class="ov-corr-l">Receive in</div></div>'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.corridors)+'</div><div class="ov-corr-l">Active corridors</div></div>'+
    '</div>'+
    '<div class="ov-row"><div class="ov-row-k">Payout reach</div><div class="ov-row-v">'+esc(CORRIDORS.payout)+'</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Top receive markets</div><div class="ov-row-v">'+CORRIDORS.topReceive.map(function(x){return '<span class="ov-tag">'+esc(x)+'</span>';}).join('')+'</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Concentration</div><div class="ov-row-v">'+esc(CORRIDORS.concentration)+'</div></div>'
  );

  // 8 — Prefunding
  h += sec('The Prefunding Mechanism', '<div class="ov-callout">'+bullets(PREFUNDING)+'</div>');

  // 9 — Peers
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How Remitly differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table>'
  );

  // 10 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 11 — Strategic Focus: TAM boxes + 2028 target boxes + driver cards
  function statBox(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }
  h += sec('Strategic Focus',
    '<div class="ov-subh">TAM Opportunity</div>'+
    '<div class="ov-targets">'+TAM.map(statBox).join('')+'</div>'+
    '<div class="ov-subh">2028 Medium-Term Targets</div>'+
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(statBox).join('')+'</div>'+
    '<div class="ov-subh">Growth Drivers</div>'+
    '<div class="ov-drivers">'+DRIVERS.map(function(d){
      return '<div class="ov-driver"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div></div>';
    }).join('')+'</div>'
  );

  // 12 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  h += '</div>';
  return h;
}

// ─── Charts ──────────────────────────────────────────────────────────────────
function lineChart(canvasId, labels, data, color, fill, valueFmt){
  var cv = document.getElementById(canvasId);
  if (!cv || typeof Chart === 'undefined') return null;
  return new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:labels, datasets:[{ data:data, borderColor:color, backgroundColor:fill, borderWidth:2.5,
      pointRadius:0, pointHoverRadius:5, tension:.3, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return valueFmt(ctx.parsed.y); } } } },
      scales:{
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{size:10}, callback:function(v){return valueFmt(v);} } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:9}, maxRotation:0, autoSkip:true, maxTicksLimit:8 } }
      } }
  });
}

function init(c){
  if (typeof Chart === 'undefined') return;
  if (_chartActive) { _chartActive.destroy(); _chartActive = null; }
  if (_chartVol) { _chartVol.destroy(); _chartVol = null; }
  if (_chartTake) { _chartTake.destroy(); _chartTake = null; }
  // Brand color read from the .ov-rely CSS variable so it lives in one place (overview.css).
  var probe = document.querySelector('.ov-rely');
  var brand = (probe && getComputedStyle(probe).getPropertyValue('--brand').trim()) || '#1F4DD8';
  _chartActive = lineChart('ovChartActive', QLABELS, ACTIVE, brand, 'rgba(31,77,216,0.10)', function(v){ return Number(v).toFixed(1)+'M'; });
  _chartVol    = lineChart('ovChartVolume', QLABELS, SENDVOL, '#3E5A82', 'rgba(62,90,130,0.10)', function(v){ return fmtUSD_M(v); });
  _chartTake   = lineChart('ovChartTake', QLABELS, TAKERATE, '#64748B', 'rgba(100,116,139,0.10)', function(v){ return Number(v).toFixed(2)+'%'; });
}

export var remitlyOverview = { html: html, init: init };
