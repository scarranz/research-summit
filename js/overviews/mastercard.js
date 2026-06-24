// overviews/mastercard.js — custom Overview for Mastercard Inc. (NYSE: MA)
// Neutral, factual, business-structure first. Standalone. The four-party network is the
// open-loop model the card industry shares, so that diagram is reused; everything else is
// Mastercard-specific. Anchored on the latest reported period (Q1 2026). Charts are
// placeholders pending the team's KPI series.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Chart palette / formatters ──────────────────────────────────────────────
var C_AXIS='#8A93A0', C_GRID='#EEF2F7';
var GEO_COLORS  = { 'US':'#CF0A2C', 'Europe':'#FF9F00', 'Canada':'#6366F1', 'LATAM':'#16A34A', 'APAC-EMEA':'#0EA5E9' };
var TYPE_COLORS = { 'Credit':'#CF0A2C', 'Debit':'#FF9F00' };
var fT  = function(v){ return '$'+(Math.round(v*100)/100)+'T'; };       // trillions
var fBn = function(v){ return (Math.round(v*10)/10)+'B'; };             // billions (txns / cards)

// ─── Network volumes — METRIC × DIMENSION (PLACEHOLDER DATA) ─────────────────
// Each of these metrics is reported on the same two cuts the DCF carries:
//   · by geography  → US + International broken into Europe / Canada / LATAM / APAC-EMEA
//   · by product    → Credit vs Debit
// One chart renders any metric in either cut (metric selector + dimension toggle).
//
// ⚠️ The numbers below are ILLUSTRATIVE placeholders so the toggle is visible NOW.
//    They are generated from round totals × fixed shares — NOT real Mastercard data.
//    To wire real figures: replace VOL_DATA[metric] with explicit per-series arrays
//    from Bloomberg, e.g.
//      VOL_DATA.pv = { geo:{ 'US':[...], 'Europe':[...], ... }, type:{ 'Credit':[...], 'Debit':[...] } };
//    Keep each array aligned to VOL_YEARS and flag projection years in VOL_EST.
var VOL_YEARS = [2021, 2022, 2023, 2024, 2025];
var VOL_EST   = [false, false, false, false, false]; // set true on years that are estimates
var VOL_METRICS = {
  pv:    { label:'Purchase Volume',       unit:'$T', fmt:fT  },
  gdv:   { label:'Gross Dollar Volume',   unit:'$T', fmt:fT  },
  txns:  { label:'Purchase Transactions', unit:'B',  fmt:fBn },
  cards: { label:'Cards',                 unit:'B',  fmt:fBn },
};
function splitArr(tot, frac){ return tot.map(function(x){ return Math.round(x*frac*100)/100; }); }
var _GEO_SHARE  = { 'US':0.35, 'Europe':0.22, 'Canada':0.05, 'LATAM':0.10, 'APAC-EMEA':0.28 };
var _TYPE_SHARE = { 'Credit':0.58, 'Debit':0.42 };
function _mkVol(tot){
  var geo={}, type={};
  Object.keys(_GEO_SHARE).forEach(function(k){ geo[k]=splitArr(tot,_GEO_SHARE[k]); });
  Object.keys(_TYPE_SHARE).forEach(function(k){ type[k]=splitArr(tot,_TYPE_SHARE[k]); });
  return { geo:geo, type:type };
}
var _VOL_TOTALS = { // PLACEHOLDER totals per year (geo split and type split each sum to these)
  pv:    [5.0, 6.0, 7.0, 8.0, 9.0],       // $T
  gdv:   [7.0, 8.2, 9.4, 10.6, 11.8],     // $T
  txns:  [100, 115, 132, 150, 170],       // B transactions
  cards: [2.9, 3.0, 3.1, 3.3, 3.5],       // B cards
};
var VOL_DATA = {};
Object.keys(_VOL_TOTALS).forEach(function(k){ VOL_DATA[k]=_mkVol(_VOL_TOTALS[k]); });

var _volMetric='pv', _volDim='geo', _volChart=null;

var PN_INTRO = 'The payment network is the core switching business — ~58% of net revenue. It earns on the dollar <b>volume</b> and the <b>number of transactions</b> that flow over Mastercard rails: <b>domestic assessments</b> (basis points of volume), <b>cross-border</b> fees (the highest-yield line) and <b>transaction processing</b> (per transaction). The volume metrics below are the drivers of this pillar.';
var VOL_NOTE = '<b>How to read this.</b> One chart, two cuts: switch the <b>metric</b> (Purchase Volume, GDV, Purchase Transactions, Cards) and the <b>breakdown</b> (by geography, or Credit vs Debit) — both cuts sum to the same yearly total. <b>GDV = Purchase Volume + Cash Volume</b>; cash is largely excluded as a driver (minimal monetization, same criterion as Visa). <b>Numbers shown are illustrative placeholders</b> pending the team\'s Bloomberg series.';
var XBORDER_NOTE = '<b>Cross-border is a different cut from the volumes above.</b> "International" here means volume on cards <i>issued outside the U.S.</i>; <b>cross-border</b> means the <i>card country ≠ merchant country</i> (travel + cross-border e-commerce). Cross-border earns a premium rate + FX — the <b>highest-yield</b> line and a key growth driver (+13% lc in Q1 26) — and is tracked separately from the issuance-geography split.';

// ─── Financials (from the Summit DCF model) ──────────────────────────────────
// Annual, USD millions. Actuals 2021–2025; 2026–2029 are the model's projection.
// SOURCE: Summit DCF for MA (REV / OP_INCOME / EBITDA / FCF), pulled from the
// model — NOT hand-invented. These are seeded here for now; the next step is to
// feed them from a remote source that refreshes on its own (see the team note).
// Operating income isn't carried as an annual projection in the model, so its
// forecast years are null (no bar) rather than fabricated.
var FIN_YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
var FIN_EST   = [false, false, false, false, false, true, true, true, true];
var FIN_FMT   = function(v){ return v==null ? '—' : '$'+(v/1000).toFixed(1)+'B'; };
var FIN_SERIES = {
  finRev:    { label:'Revenue',          type:'bar',  color:'#CF0A2C', data:[18884, 22237, 25098, 28167, 32791, 38162, 41902, 46640, 52166] },
  finOpInc:  { label:'Operating Income', type:'bar',  color:'#7A8699', data:[10079, 12127, 13824, 15278, 18554, null, null, null, null] },
  finEbitda: { label:'EBITDA',           type:'bar',  color:'#FF9F00', data:[11461, 12816, 14829, 16493, 20100, 23505, 26302, 29249, 32770] },
  finFcf:    { label:'Free Cash Flow',   type:'line', color:'#16A34A', data:[9056, 10753, 11705, 14306, 17159, 18024, 19455, 21654, 24318] },
};
var FIN_INTRO = 'Mastercard\'s financials, pulled from the <b>Summit DCF model</b> — <b>actuals through FY2025</b> and the model\'s <b>projection to FY2029</b> (faded / dashed). Drag the timeline handles to mold the window; each chart\'s CAGR updates to your selection.';
var FIN_NOTE  = 'Annual, USD billions. <b>2021–2025 actuals · 2026–2029 = DCF projection.</b> Source: Summit DCF model for Mastercard. Operating-income forecast isn\'t carried annually in the model, so its projection years are blank (not estimated). This section reads from the model, not hand-typed figures — the next step is wiring it to refresh automatically.';
var _finStart=2021, _finEnd=2029, _finCharts={};
function _hexRgba(hex, a){ var h=hex.replace('#',''); return 'rgba('+parseInt(h.substr(0,2),16)+','+parseInt(h.substr(2,2),16)+','+parseInt(h.substr(4,2),16)+','+a+')'; }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NYSE: MA'],
  ['Founded', '1966 — Interbank'],
  ['IPO', 'May 2006 · $39.00'],
  ['HQ', 'Purchase, NY'],
  ['CEO', 'Michael Miebach'],
  ['Employees', '~35,000'],
];
var DESC = 'Mastercard is a global payments-technology company. At its core it runs the world\'s <b>second-largest open-loop card network</b> — the rails that authorize, clear and settle electronic payments between banks in 210+ countries — connecting ~3.5B credentials, 150M+ acceptance locations and ~14,000 financial-institution customers. On top of those rails it has built a large and faster-growing <b>value-added services</b> business (security, identity, data &amp; analytics, consulting, open banking and real-time payments) that is now ~42% of net revenue and the main growth driver. Like its network peers, Mastercard does not issue cards, lend or set interchange — it earns a thin fee on the volume and transactions that flow over its network, net of incentives, plus the services sold alongside.';

var KPIS = [
  { l:'Net Revenue (Q1 26)', v:'$8.4B',  d:'+16% YoY · +12% cn', dir:'up' },
  { l:'Gross Dollar Volume', v:'$2.7T',  d:'+7% lc',             dir:'up' },
  { l:'Cross-Border Volume', v:'+13% lc',d:'highest-yield line', dir:'up' },
  { l:'Value-Added Services', v:'$3.5B', d:'+22% YoY · ~42% of net rev', dir:'up' },
];
var AS_OF = 'Headline figures are Q1 2026 (quarter ended March 31, 2026; reported April 30, 2026) — the latest reported period. Mastercard\'s fiscal year = calendar year. "lc" / "cn" = local-currency / currency-neutral growth (strips FX). Switched transactions grew ~9% and ~40% of transactions are tokenized. <b>Quantitative time-series charts below are placeholders</b> pending the team\'s KPI data.';
var FY_NOTE = 'Mastercard reports <b>net revenue</b> = gross revenue <b>minus rebates &amp; incentives</b> paid to customers (a contra-revenue, like the broader network industry). It is presented in two pillars: <b>Payment Network</b> (the core switching rails — domestic assessments, cross-border and transaction-processing fees) and <b>Value-Added Services &amp; Solutions</b> (security, data &amp; services, open banking, real-time payments). The services pillar (~42% of net revenue, +22% in Q1 26) grows faster than the network and is the larger differentiator versus a pure card network. Single class of public common stock; the Mastercard Foundation, created at the 2006 IPO, remains a large long-term holder.';

// ─── How Mastercard makes money + the four-party model ───────────────────────
var HOW_MONEY = [
  '<b>Not a bank:</b> Mastercard does not issue cards, lend, or earn interchange — those belong to the issuing banks. It never touches the purchase amount and takes <b>no credit risk</b>.',
  '<b>Network fees (the core):</b> <b>Domestic assessments</b> (a few basis points of domestic purchase volume), <b>cross-border volume fees</b> (the highest-yield line, on transactions where card country ≠ merchant country), and <b>transaction processing/switching</b> (a fee per transaction). <b>Rebates &amp; incentives</b> net against these to reach net revenue (see the dedicated section).',
  '<b>Value-added services (the differentiator &amp; growth engine):</b> security, identity, data &amp; analytics, consulting, loyalty, open banking and real-time-payment infrastructure — sold on top of the rails, often <b>network-agnostic</b> (earning on non-Mastercard volume too).',
  '<b>Walk a transaction:</b> tap the diagram below to see each party\'s role, then press Play to see who earns at each step.',
];
var FOURPARTY_SVG =
'<svg viewBox="0 0 680 360" role="img" aria-label="Mastercard four-party model — click a box for its role">' +
  '<defs><marker id="maar" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker></defs>' +
  '<line x1="200" y1="56" x2="470" y2="56" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#maar)"/>' +
  '<text x="335" y="44" text-anchor="middle" font-size="10" fill="#8A93A0">buys goods / services</text>' +
  '<line x1="115" y1="86" x2="115" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="565" y1="86" x2="565" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="196" y1="280" x2="262" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="484" y1="280" x2="418" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<g class="ov-fpm-node" data-detail="role:cardholder"><rect x="30" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Cardholder</text><text x="115" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:merchant"><rect x="480" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Merchant</text><text x="565" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:issuer"><rect x="30" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Issuer</text><text x="115" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">cardholder&#8217;s bank ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:acquirer"><rect x="480" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Acquirer</text><text x="565" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">merchant&#8217;s bank ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:network"><rect x="250" y="150" width="180" height="64" rx="11" fill="var(--brand)" stroke="var(--brand-2)" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">MASTERCARD</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#ffe1e1">network · clearing &amp; settlement ›</text></g>' +
'</svg>';
var ROLE_DETAIL = {
  cardholder: { t:'Cardholder', h:'The consumer who pays with a Mastercard credential. They are the <b>issuer\'s</b> customer — Mastercard has no direct relationship with them and charges them nothing; the merchant pays.' },
  issuer:     { t:'Issuer — the cardholder\'s bank', h:'Issues the card, extends the credit, <b>sets and earns the interchange</b>, takes the credit &amp; fraud risk, and bills the cardholder. A Mastercard <b>customer</b> that pays network fees — and the party Mastercard pays <b>incentives</b> to, to keep its volume.' },
  merchant:   { t:'Merchant', h:'The business accepting the card — the <b>acquirer\'s</b> customer. Pays a merchant discount = <b>interchange</b> (to the issuer) + <b>network fees</b> (to Mastercard) + <b>acquirer markup</b>.' },
  acquirer:   { t:'Acquirer — the merchant\'s bank/processor', h:'Onboards merchants, routes their transactions into the network, and settles funds to them. A Mastercard <b>customer</b> that pays network fees.' },
  network:    { t:'Mastercard — the network', h:'<b>Authorizes, clears and settles</b> between issuer and acquirer. Earns <b>domestic assessments</b> (on volume), <b>transaction-processing</b> fees (per transaction) and <b>cross-border</b> fees — net of incentives — plus value-added services. <b>Does not</b> issue, lend, or earn interchange, and takes no credit risk.' },
};
var FLOW_NODES = [
  { k:'card', ic:'💳', l:'Cardholder' }, { k:'merch', ic:'🏪', l:'Merchant' }, { k:'acq', ic:'🏛️', l:'Acquirer' }, { k:'net', ic:'🔴', l:'Mastercard' }, { k:'iss', ic:'🏦', l:'Issuer' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A $100 purchase on a Mastercard card. Press <b>Play</b> to follow the money — and see where each party earns (or doesn\'t).', earn:'', earnType:'none' },
  { t:'1 · Authorization', on:['card','merch','acq','net','iss'], cap:'Tap. The request hops <b>merchant → acquirer → Mastercard → issuer</b>, which checks the balance and runs fraud in ~1–2 seconds, then approves.', earn:'No fee booked yet — authorization is part of the service, not a charge.', earnType:'none' },
  { t:'2 · Approval returns', on:['iss','net','acq','merch','card'], cap:'The "approved" travels back the same path. The cardholder walks out with the goods — but <b>no real money has moved</b>, only a promise to pay.', earn:'Still nothing settled; a stolen-card loss would land on the issuer, not Mastercard.', earnType:'none' },
  { t:'3 · Clearing', on:['acq','net','iss'], cap:'Later, in a batch, the acquirer submits the transaction. <b>Mastercard</b> computes the amounts and the interchange owed.', earn:'Mastercard books its <b>transaction-processing fee</b> — a near-fixed fee for switching this transaction.', earnType:'net' },
  { t:'4 · Settlement', on:['iss','net','acq','merch'], cap:'The issuer pays <b>$100 minus interchange</b>; Mastercard moves funds to the acquirer, which pays the merchant the net.', earn:'Fees split: <b>~$1.50–2.50 interchange → ISSUER</b> · <b>Mastercard assessment + processing fees (a few ¢) → MASTERCARD</b> · acquirer markup → ACQUIRER.', earnType:'split' },
  { t:'5 · Who got what', on:['card','merch','acq','net','iss'], cap:'The merchant nets ~<b>$97.50</b>. Mastercard never touched the $100 and never lent it.', earn:'<b>Interchange — the biggest slice — went to the ISSUER, not Mastercard.</b> Mastercard earned a few cents (processing) + a few basis points of the $100 (assessment). That thinness × billions of transactions = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Mastercard earns on a transaction <b>only when it runs over a Mastercard rail</b> (or when a Mastercard value-added service is attached). A Visa- or Amex-branded swipe runs over <b>their</b> network — Mastercard earns nothing on it. That is exactly why its value-added services are deliberately <b>network-agnostic</b>, so they earn on volume regardless of the card brand.';

// ─── Revenue structure: the two reporting pillars (interactive map) ──────────
var SEGMENTS = [
  { k:'pn', n:'Payment Network', accent:'#CF0A2C', rev:'~58% of net rev', margin:'the core rails',
    subs:[
      { k:'domestic', n:'Domestic assessments', rev:'on domestic GDV',
        what:'A fee charged to customers as a few <b>basis points of the domestic purchase volume</b> on Mastercard credentials.',
        monetizes:'Scales with domestic Gross Dollar Volume; the steadiest, most volume-linked line.',
        products:[{n:'What drives it', d:'Cards in force × spend per card × the assessment rate; benefits from cash-to-digital conversion.'},{n:'Where it\'s strongest', d:'Growing digital-payment markets, especially internationally.'}],
        competition:'Visa (the larger network), domestic card schemes, account-to-account rails.' },
      { k:'crossborder', n:'Cross-border volume fees', rev:'highest yield',
        what:'Fees where the <b>card country differs from the merchant country</b> — travel and cross-border e-commerce.',
        monetizes:'A premium rate plus FX; a single overseas transaction can earn multiples of a domestic one. The <b>highest-yield</b> line and a key growth driver (+13% lc in Q1 26).',
        products:[{n:'Travel', d:'Tourism & business travel; recovers/grows with global mobility — and softens first in a downturn.'},{n:'Cross-border e-commerce', d:'Buying from foreign merchants online; structurally growing.'}],
        competition:'Visa; money-movement specialists (Wise, etc.) on certain flows.' },
      { k:'processing', n:'Transaction processing', rev:'per transaction',
        what:'A near-fixed fee for each transaction Mastercard <b>switches</b> (authorize / clear / settle).',
        monetizes:'Grows with the <i>count</i> of switched transactions (~+9% in Q1 26), not ticket size — resilient even in a downturn.',
        products:[{n:'Switching', d:'Routing the transaction message between issuer and acquirer.'},{n:'Connectivity / other', d:'Network access, licensing and related fees.'}],
        competition:'Visa; domestic switches; U.S. debit-routing networks.' },
    ] },
  { k:'vas', n:'Value-Added Services & Solutions', accent:'#FF9F00', rev:'~42% of net rev', margin:'+22% · the growth engine',
    subs:[
      { k:'security', n:'Security Solutions', rev:'fraud · identity · cyber',
        what:'Tools that keep payments safe and verify who is transacting — the largest and one of the fastest-growing VAS families, increasingly sold <b>across networks</b>, not just Mastercard\'s.',
        monetizes:'Per-transaction scoring + subscriptions; recurring and high-margin. Now widening from payment fraud into <b>enterprise cybersecurity</b>.',
        products:[{n:'Decision Intelligence', d:'Real-time AI fraud scoring on transactions.'},{n:'Ekata', d:'Digital identity verification ($850M, 2021).'},{n:'RiskRecon', d:'Third-party cyber-risk ratings (2020).'},{n:'Recorded Future', d:'Threat intelligence — Mastercard\'s largest deal ($2.65B, 2024); a step into enterprise cyber.'},{n:'Tokenization', d:'Replaces card numbers with tokens; ~40% of transactions tokenized.'}],
        competition:'Visa\'s risk stack (focused on payments); pure-play fraud/identity/cyber vendors.' },
      { k:'data', n:'Data & Services / Consulting', rev:'analytics · loyalty · marketing',
        what:'Selling Mastercard\'s data, analytics, expertise and personalization/loyalty tools to issuers, merchants and governments.',
        monetizes:'Consulting engagements + subscriptions + managed services; also a <i>pull-through</i> — advisory work drives more network volume.',
        products:[{n:'Mastercard Advisors', d:'Consulting + analytics across the client base.'},{n:'Test & Learn (APT)', d:'Business-experimentation analytics (~$600M, 2015).'},{n:'Dynamic Yield', d:'AI personalization (acquired from McDonald\'s, 2022).'},{n:'Loyalty & marketing', d:'Rewards programs and campaign tools.'}],
        competition:'Visa Consulting & Analytics; data/loyalty specialists.' },
      { k:'openbanking', n:'Open Banking', rev:'account data · pay-by-bank',
        what:'Consent-based connectivity to bank accounts — reading account data and enabling account-to-account payments; positions Mastercard in pay-by-bank as well as cards.',
        monetizes:'API / usage fees.',
        products:[{n:'Finicity', d:'U.S. open-banking / financial-data APIs ($825M, 2020).'},{n:'Aiia', d:'European open-banking platform (2021).'}],
        competition:'Visa (Tink); Plaid; bank-direct APIs.' },
      { k:'rtp', n:'Real-time & A2A payments', rev:'RTP infrastructure',
        what:'Infrastructure for instant <b>account-to-account</b> and real-time payments — a different rail from cards, and partly a hedge against card disintermediation.',
        monetizes:'Processing/infrastructure fees; participates in flows that bypass card rails (at lower economics than cards).',
        products:[{n:'Vocalink', d:'Runs the UK\'s Faster Payments & BACS (~£700M+, 2017).'},{n:'Nets A2A', d:'European account-to-account / clearing assets (~€2.85B, 2021).'}],
        competition:'Government RTP schemes (UPI, Pix, FedNow); Visa\'s A2A efforts.' },
      { k:'digital', n:'Digital & Tokenization', rev:'tokens · Click to Pay',
        what:'Digital-enablement products that make payments safer and smoother online and in wallets — embedded into the network.',
        monetizes:'Network economics + service fees; lifts approval rates and reduces fraud.',
        products:[{n:'Mastercard Token Service', d:'Network tokens for cards-on-file and wallets (~40% of transactions tokenized).'},{n:'Click to Pay', d:'Streamlined, standardized online checkout.'}],
        competition:'Visa\'s token / Click-to-Pay equivalents; wallet providers.' },
    ] },
];

// ─── Rebates & Incentives (the gross-to-net bridge) ──────────────────────────
var REBATES_INTRO = 'Mastercard reports <b>net revenue</b> — gross revenue minus the rebates &amp; incentives it pays customers. That contra-revenue is large (well over a third of gross) and rising, so the gross-to-net bridge is one of the most important things to model. The same concept exists at the other big network.';
var REBATES_BRIDGE = [
  { v:'Gross revenue', l:'all network + services fees' },
  { v:'(−) Rebates & incentives', l:'paid to issuers, acquirers & merchants' },
  { v:'= Net revenue', l:'$8.4B · Q1 2026' },
];
var REBATES = [
  '<b>What they are:</b> payments and incentives to <b>issuers, acquirers and merchants</b> to grow and retain volume and to win new portfolios. Because they are consideration paid to customers, they are booked as a <b>reduction of gross revenue (contra-revenue)</b>, not an operating expense.',
  '<b>Two flavors:</b> <b>volume / performance-based</b> incentives (accrued as the customer delivers volume) and <b>upfront / fixed</b> deal payments (capitalized and amortized over the contract life). So a big signing depresses net revenue for years, smoothing the hit.',
  '<b>Why they exist:</b> issuers can route to <b>either</b> network, so incentives are how Mastercard wins and keeps issuer and co-brand deals. As the #2 network this is the core competitive battleground — the same dollars Visa is also spending for the same portfolios.',
  '<b>Why it matters for the model:</b> the <b>rebate ratio (rebates &amp; incentives ÷ gross revenue)</b> is a key swing factor. A rising ratio can signal intensifying competition; a heavy <b>renewal year</b> steps it up and can optically slow net-revenue growth even when gross volume is perfectly healthy. Watch the ratio, not just net revenue.',
];

// ─── Value-Added Services — why it's the growth engine ───────────────────────
var VAS_DEEP = [
  '<b>Scale &amp; growth:</b> VAS net revenue was <b>$3.5B in Q1 2026 (+22% YoY)</b>, ~<b>42% of net revenue</b> — growing well faster than the payment network and increasingly the swing factor in the whole company\'s growth rate.',
  '<b>Network-agnostic:</b> much of it is sold on <b>non-Mastercard</b> volume too (fraud scoring, identity, cyber, open banking). That partially <b>decouples growth from card-share battles</b> — Mastercard can earn even where it doesn\'t win the rail.',
  '<b>Higher-quality revenue:</b> subscriptions, per-transaction scoring and managed services are more <b>recurring</b> and less tied to the consumer-spend cycle than network fees — a diversifier against macro/travel softness.',
  '<b>Deepens the moat:</b> selling security, data and consulting into the same issuers and merchants raises switching costs <i>and</i> pulls through more network volume — services and the network reinforce each other.',
  '<b>A widening ambition:</b> the strategy has moved from payment fraud toward <b>enterprise cybersecurity</b> (the $2.65B Recorded Future deal), identity, open banking and real-time payments — extending the addressable market well beyond card swipes. <i>Tap any service in the map above for what\'s inside it.</i>',
];

// ─── Who uses Mastercard — the demand mix (relative tilts) ────────────────────
var USERMIX_INTRO = 'All the global networks serve broad consumer bases, but the <i>mix</i> tilts differently — and the tilt matters for yield and cyclicality. Mastercard\'s relative leanings (these are tilts at the margin, not absolutes):';
var USERMIX = [
  '<b>More international, less U.S.-debit-heavy.</b> The larger peer dominates U.S. debit, where routing rules (Durbin) shape economics. Mastercard\'s mix leans relatively more <b>international</b> and more toward <b>credit and cross-border</b> — so its revenue is more exposed to high-yield cross-border and to international cash-to-digital conversion.',
  '<b>Higher cross-border intensity.</b> Cross-border (travel + cross-border e-commerce) is a larger growth driver and grew <b>faster than the leader\'s in 2025</b> (~15% vs ~12%). Cross-border earns a premium rate + FX, so a unit of Mastercard volume carries relatively more high-yield spend → <b>structurally higher blended yield</b>, but more sensitivity to the travel/discretionary cycle (visible as "cross-border softness" in soft months — flagged in April 2026).',
  '<b>A premium / travel-skewed product ladder.</b> Standard → <b>World</b> → <b>World Elite</b> → the new <b>World Legend</b> (ultra-high-net-worth). Affluent cardholders spend more, travel more and generate disproportionate cross-border and discretionary volume — the segment Mastercard markets hardest toward.',
  '<b>A bigger services mix.</b> ~42% VAS vs ~27% at the leader, so a larger share of revenue is <b>recurring services</b> rather than pure consumer-spend fees — a somewhat more diversified, less spend-cyclical profile.',
  '<b>Net read:</b> Mastercard\'s revenue is relatively more geared to <b>discretionary, cross-border and affluent</b> spend (higher yield, more travel-cyclical) and to <b>recurring services</b>, versus a peer mix that is heavier in domestic U.S. debit. The trade-off: a richer yield profile, but more exposure to the travel/discretionary cycle on the network side.',
];

// ─── History — origin, the #2 dynamic, IPO, and how it gained share ──────────
var TIMELINE = [
  { y:'1966', head:'<b>Born as a bank alliance to challenge BankAmericard.</b>',
    detail:'A group of U.S. banks forms the <b>Interbank Card Association (ICA)</b> to compete with Bank of America\'s BankAmericard (the future Visa). From the start Mastercard is the <b>#2 challenger</b> in an industry the incumbent defined — a position that shapes a more aggressive, partnership-driven culture.' },
  { y:'1968–69', head:'<b>"Master Charge" + the Eurocard alliance</b> — going international early.',
    detail:'The network is branded <b>"Master Charge: The Interbank Card" (1969)</b>, and a 1968 alliance with Europe\'s <b>Eurocard</b> gives it early international reach. International breadth becomes a lasting structural feature — and a relative advantage over a more U.S.-centric rival.' },
  { y:'1979', head:'<b>Renamed Mastercard.</b>',
    detail:'"Master Charge" becomes <b>MasterCard</b>, with the interlocking-circles mark. Through the 1980s–90s it operates as a bank-owned association, building global acceptance and the Maestro debit brand.' },
  { y:'2002', head:'<b>Merges with Europay International</b> — one global franchise.',
    detail:'MasterCard International merges with <b>Europay International</b> (which included Eurocard) to form <b>MasterCard Incorporated</b>, consolidating the franchise globally ahead of going public.' },
  { y:'May 2006', head:'<b>IPO at $39</b> — two years before Visa, and a cleaner structure.',
    detail:'Mastercard goes public on May 25, 2006 (95.5M shares at $39 — the largest U.S. IPO since 2004), <b>two years before Visa</b>. Going public earlier gave it a head start as an independent, growth-minded company. The IPO reduced the member banks\' control (an independent board) — partly to address antitrust exposure — and created the independent <b>Mastercard Foundation</b>, endowed with ~10% of the company. Unlike Visa\'s later IPO, there is <b>no multi-class / litigation-escrow share structure</b> (see Litigation).' },
  { y:'2010–20', head:'<b>The Ajay Banga decade</b> — the pivot to services.',
    detail:'Under CEO <b>Ajay Banga</b>, revenue roughly <b>triples</b> and market value rises ~10×. The defining choice: build a large <b>value-added services</b> business (cybersecurity, identity, data &amp; analytics) on top of the rails, diversifying beyond pure transaction fees. This services tilt, plus a strong international and cross-border mix, is the main reason a structural #2 kept gaining share and economics.' },
  { y:'2017–24', head:'<b>A services-and-rails buying spree.</b>',
    detail:'Mastercard acquires real-time-payment and open-banking infrastructure (<b>Vocalink, Nets A2A, Finicity, Aiia</b>) and a deep security/identity/cyber stack (<b>RiskRecon, Ekata, CipherTrace, Recorded Future</b>) — building optionality beyond card swipes into account-to-account, identity and enterprise cyber. See M&A.' },
  { y:'2021', head:'<b>Michael Miebach becomes CEO.</b>',
    detail:'Miebach (previously Chief Product Officer) takes over as Banga moves on (later to lead the World Bank). The strategy continues: grow the network, scale services, and extend into new flows (B2B, disbursements, real-time).' },
  { y:'Today', head:'<b>A network + a services company.</b>',
    detail:'~$8.4B net revenue per quarter (Q1 26), ~$2.7T GDV, ~3.5B credentials — with value-added services ~42% of revenue and growing faster than the network. The open question the model raises: how durable is card-network growth as account-to-account and real-time rails expand — which is precisely why Mastercard has bought into those rails.' },
];

// ─── M&A (chronological; terms + what it added) ──────────────────────────────
var MNA = [
  { n:'Europay International', y:'2002', deal:'merger', terms:'association merger', own:'Member co-op', cat:'Franchise',
    detail:'<b>Terms:</b> an association merger that formed MasterCard Incorporated.<br><br><b>What it added:</b> Europe\'s Eurocard/Europay franchise — consolidating Mastercard into a single global company ahead of the 2006 IPO.' },
  { n:'Applied Predictive Technologies (Test & Learn)', y:'2015', deal:'~$600M', terms:'all cash', own:'Private', cat:'Data & analytics',
    detail:'<b>Terms:</b> ~$600M, all cash.<br><br><b>What it added:</b> the <b>Test &amp; Learn</b> business-experimentation analytics platform.<br><br><b>How it shows up today:</b> a flagship of the <b>Data &amp; Services</b> consulting business.' },
  { n:'VocaLink', y:'2017', deal:'~£700M + £169M earn-out', terms:'all cash', own:'Bank-owned', cat:'Real-time payments',
    detail:'<b>Terms:</b> ~£700M + up to £169M earn-out, all cash (UK bank-owned RTP operator).<br><br><b>What it added:</b> <b>real-time payments &amp; ACH infrastructure</b> — it runs the UK\'s Faster Payments and BACS.<br><br><b>How it shows up today:</b> the backbone of Mastercard\'s account-to-account / RTP push — a hedge against card rails.' },
  { n:'RiskRecon', y:'2020', deal:'undisclosed', terms:'all cash', own:'Private', cat:'Cyber security',
    detail:'<b>Terms:</b> undisclosed, all cash.<br><br><b>What it added:</b> third-party <b>cyber-risk ratings</b>.<br><br><b>How it shows up today:</b> part of the Security Solutions stack.' },
  { n:'Finicity', y:'2020', deal:'$825M + earn-out', terms:'all cash', own:'Private', cat:'Open banking',
    detail:'<b>Terms:</b> $825M + up to $160M earn-out, all cash.<br><br><b>What it added:</b> U.S. <b>open-banking</b> / financial-data APIs (account data, pay-by-bank).<br><br><b>How it shows up today:</b> Mastercard\'s open-banking business in North America.' },
  { n:'Nets (A2A / clearing assets)', y:'2021', deal:'~€2.85B', terms:'cash', own:'Private (PE-owned)', cat:'Real-time payments', big:true,
    detail:'<b>Terms:</b> ~€2.85B (~$3.2B).<br><br><b>What it added:</b> the European <b>account-to-account</b> and clearing technology of Nets.<br><br><b>How it shows up today:</b> scales the real-time / A2A capability across Europe — its second big bet (with Vocalink) beyond cards.' },
  { n:'Ekata', y:'2021', deal:'$850M', terms:'all cash', own:'Private', cat:'Identity',
    detail:'<b>Terms:</b> $850M, all cash.<br><br><b>What it added:</b> global <b>digital identity verification</b> for onboarding and fraud prevention.<br><br><b>How it shows up today:</b> a core part of Security Solutions / identity.' },
  { n:'CipherTrace', y:'2021', deal:'~$250M (est.)', terms:'cash', own:'Private', cat:'Crypto / blockchain',
    detail:'<b>Terms:</b> undisclosed (estimated ~$250M).<br><br><b>What it added:</b> <b>blockchain / crypto-transaction analytics</b> and compliance.<br><br><b>How it shows up today:</b> crypto-risk tooling within the security business.' },
  { n:'Dynamic Yield', y:'2022', deal:'~$325M (est.)', terms:'cash', own:'Corporate (McDonald\'s)', cat:'Personalization',
    detail:'<b>Terms:</b> acquired from McDonald\'s (reported ~$325M).<br><br><b>What it added:</b> AI-driven <b>personalization</b> and recommendation technology.<br><br><b>How it shows up today:</b> loyalty/marketing personalization inside Data &amp; Services.' },
  { n:'Recorded Future', y:'2024', deal:'$2.65B', terms:'all cash', own:'Private (PE-owned)', cat:'Threat intelligence', big:true,
    detail:'<b>Terms:</b> $2.65B, all cash — <b>Mastercard\'s largest acquisition to date</b>.<br><br><b>What it added:</b> a leading <b>threat-intelligence</b> platform — a major step up in cybersecurity.<br><br><b>How it shows up today:</b> anchors a broader security ambition extending beyond payment fraud into enterprise cyber.' },
];

// ─── Litigation & legal ──────────────────────────────────────────────────────
var LIT_INTRO = 'Like the other card networks, Mastercard set default interchange as a bank association, which has drawn decades of antitrust litigation. The point worth understanding for Mastercard specifically is <b>how it bears that risk</b>.';
var LIT = [
  '<b>United States — MDL 1720.</b> Mastercard is a <b>co-defendant with Visa</b> in the long-running U.S. merchant interchange antitrust case. The <b>damages</b> class settled (a multi-billion settlement shared with Visa, approved 2019 and upheld 2023); the <b>rules / injunctive</b> class is still live (a 2024 proposed settlement was <b>rejected by the court</b>), and large merchants keep opting out to sue separately.',
  '<b>United Kingdom — Merricks.</b> A landmark <b>opt-out consumer class action</b> (filed 2016) over EEA cross-border interchange the EU Commission ruled unlawful in 2007. Originally valued at ~<b>£14B</b>, it <b>settled for £200M</b> (Dec 2024; approved by the Competition Appeal Tribunal in Feb 2025) — a striking reminder that these mega-claims often resolve for a small fraction of the headline.',
  '<b>EU &amp; elsewhere:</b> ongoing interchange cases and behavioral commitments across jurisdictions; interchange caps (e.g. in the EU) also structurally lower yields.',
  '<b>The key structural difference:</b> unlike <b>Visa</b> — which quarantines its U.S. "covered litigation" onto former member banks through a special <b>Class B share / litigation-escrow</b> mechanism — <b>Mastercard has no such shield</b>. With a single class of common stock, interchange and other litigation is borne <b>directly by Mastercard and its shareholders</b>, recognized as <b>litigation provisions / charges on the income statement</b> when probable. The amounts have so far been manageable, but the exposure is a more <b>direct P&amp;L / shareholder risk</b> than at Visa.',
];

// ─── Peers ───────────────────────────────────────────────────────────────────
var PEER_COLS = ['Mastercard', 'Visa', 'Amex', 'Discover', 'UnionPay'];
var PEER_ROWS = [
  ['Model', 'Open-loop four-party', 'Open-loop four-party', '<b>Closed-loop</b> (lends)', 'Closed-loop* (lends)', 'Domestic near-monopoly'],
  ['FY net revenue', '$32.8B', '$40.0B', '~$72B† (incl. lending)', '~$16B† (incl. lending)', '~$2–3B fees‡ (est.)'],
  ['Payments volume', '~$10.6T GDV', '~$14T', '~$1.7T', '~$0.5T', '~$25T+ (mostly China)'],
  ['Credentials', '~3.5B', '~4.9B', '~145M (affluent)', '~70M', '~9B+ (most in world)'],
  ['Services mix', '<b>~42% of revenue</b>', '~27% of revenue', 'no standalone VAS', 'limited', 'limited'],
  ['Litigation shield', 'None (direct to P&L)', 'Class B escrow', 'n/a (closed-loop)', 'n/a', 'state-linked'],
  ['Credit risk', 'None', 'None', '<b>Yes</b> — owns loan book', '<b>Yes</b>', 'Borne by member banks'],
];
var PEER_NOTE = 'Mastercard and Visa are the two global open-loop "toll roads" — a thin fee per transaction, no credit risk. Mastercard is the <b>smaller of the two by volume</b> but is <b>more international</b>, carries a <b>larger value-added-services mix</b> (~42% vs ~27%), and — unlike Visa — bears interchange litigation <b>directly</b> (no escrow shield). <b>Amex &amp; Discover</b> are closed-loop (they issue and lend, so revenue includes net interest income and isn\'t comparable line-for-line; Discover is being acquired by Capital One). <b>UnionPay</b> is the largest network by cards (China; state-linked) but overwhelmingly domestic. Not shown: digital/A2A players (PayPal) and government real-time rails (UPI, Pix, FedNow). † incl. lending; ‡ limited disclosure / estimate; figures approximate, FY ends differ.';

// ─── Tailwinds / Headwinds ───────────────────────────────────────────────────
var TAILWINDS = [
  '<b>International cash-to-digital tilt.</b> A larger share of revenue is outside the U.S., where cash is still a big share of spend — <i>mechanism:</i> every dollar converted to digital adds network volume at near-zero incremental cost, and the international runway is longer than in mature markets.',
  '<b>Cross-border &amp; affluent/travel skew.</b> Cross-border (+13% lc) carries the highest yield, and the premium product ladder concentrates travel/discretionary spenders — <i>mechanism:</i> a richer blended yield as cross-border grows faster than overall volume.',
  '<b>Value-added services compounding.</b> Security, identity, data and open banking (~42% of revenue, +22%) grow faster than the network and are often <b>network-agnostic</b> — <i>mechanism:</i> diversifies revenue, earns on non-Mastercard volume, and adds recurring, less-cyclical revenue.',
];
var HEADWINDS = [
  '<b>Interchange / regulatory pressure &amp; litigation borne directly.</b> Interchange caps and antitrust cases (MDL 1720, UK/EU) — <i>mechanism:</i> compress the fee pool and, unlike Visa\'s escrow-shielded structure, hit Mastercard\'s own P&L and shareholders via provisions.',
  '<b>Account-to-account &amp; real-time rails.</b> Government-built instant systems (UPI, Pix, FedNow) move money with no card and near-zero fee — <i>mechanism:</i> they convert the un-digitized spend Mastercard wants, bypassing card rails (its answer: own RTP/A2A via Vocalink &amp; Nets, but at lower economics).',
  '<b>Being the #2 network.</b> Smaller scale and acceptance than the leader — <i>mechanism:</i> Mastercard must compete hard (rebates &amp; incentives) for issuer/co-brand portfolios, and a large issuer\'s network choice can move volume materially.',
  '<b>Travel / discretionary cyclicality.</b> The cross-border and affluent tilt that lifts yield also raises sensitivity to travel and discretionary spend — <i>mechanism:</i> a slowdown hits the high-yield cross-border line first (partly cushioned by the larger services mix).',
];

var SOURCES = 'Sources: Mastercard Q1 2026 results &amp; earnings release (Apr 30, 2026), FY2025 results / 10-K and prior filings; Mastercard investor materials and company history; acquisition press releases &amp; SEC filings for M&A terms; UK Competition Appeal Tribunal &amp; reporting on the Merricks settlement; and public reporting on MDL 1720 and the 2006 IPO / Mastercard Foundation. Headline figures are Q1 2026; some M&A values are estimates where terms were undisclosed; "lc"/"cn" = local-currency/currency-neutral. Quantitative time-series charts are placeholders pending the team\'s KPI data.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function subDetailHtml(s){
  return '<div class="ov-sub-line"><b>What it is.</b> '+s.what+'</div>'+
    '<div class="ov-sub-mon"><b>How it monetizes:</b> '+s.monetizes+'</div>'+
    (s.products && s.products.length ? '<div class="ov-subh" style="margin-top:14px">Inside it</div><div class="ov-prod">'+s.products.map(function(p){ return '<div class="ov-prod-tile"><div class="ov-prod-n">'+esc(p.n)+'</div><div class="ov-prod-d">'+p.d+'</div></div>'; }).join('')+'</div>' : '')+
    (s.competition ? '<div class="ov-sub-comp"><b>Competition:</b> '+s.competition+'</div>' : '');
}
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }
function snap(arr){ return '<div class="ov-snap">'+arr.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'; }
// A pillar's sub-lines as clickable cards (full detail opens in the modal).
function pillarCards(segKey){
  var seg = SEGMENTS.filter(function(s){ return s.k===segKey; })[0]; if(!seg) return '';
  return '<div class="ov-cards">'+seg.subs.map(function(s){
    return '<div class="ov-card ov-clickable" data-detail="sub:'+esc(s.k)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(s.n)+'</span><span class="ov-chip">'+esc(s.rev)+'</span></div>'+
      '<div class="ov-card-s">'+s.what+'</div>'+
      '<div class="ov-more">How it monetizes ›</div></div>';
  }).join('')+'</div>';
}
// The metric × dimension volume explorer (one chart, two controls).
function volSection(){
  return '<section class="ov-sec"><div class="ov-sec-h">Network Volumes <span class="ov-ph-badge">datos ilustrativos · pendiente Bloomberg</span></div>'+
    '<div class="ov-volctrl">'+
      '<div class="ov-volpills" id="ovVolMetric">'+Object.keys(VOL_METRICS).map(function(k){
        return '<button class="ov-volpill'+(k===_volMetric?' on':'')+'" data-metric="'+k+'">'+esc(VOL_METRICS[k].label)+'</button>'; }).join('')+'</div>'+
      '<div class="ov-volpills ov-volpills-dim" id="ovVolDim">'+
        '<button class="ov-volpill'+(_volDim==='geo'?' on':'')+'" data-dim="geo">Por geografía</button>'+
        '<button class="ov-volpill'+(_volDim==='type'?' on':'')+'" data-dim="type">Credit vs Debit</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t" id="ovVolTitle"></div>'+
      '<div class="ov-chart-wrap" style="height:300px"><canvas id="ovVolChart"></canvas></div>'+
      '<div class="ov-statline" id="ovVolStat"></div></div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">'+VOL_NOTE+'</div>'+
  '</section>';
}
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div>'+
    '<div class="ov-statline" id="stat-'+id+'"></div></div>';
}

function html(c){
  var h = '<div class="ov ov-mastercard" data-brand="MA">';

  // ── Sub-tab bar (chapters) ──
  h += '<div class="ov-subtabs">'+
    '<button class="ov-subtab active" data-matab="overview">Overview</button>'+
    '<button class="ov-subtab" data-matab="network">Payment Network</button>'+
    '<button class="ov-subtab" data-matab="vas">Value-Added Services</button>'+
    '<button class="ov-subtab" data-matab="fin">Financials</button>'+
  '</div>';

  // ══ PANE 1 — Overview (what it is + how it earns + company context) ══
  h += '<div class="ov-pane active" data-mapane="overview">';
  h += snap(SNAPSHOT);
  h += '<p class="ov-lede">'+DESC+'</p>';
  h += kpis(KPIS);
  h += '<div class="ov-asof">'+AS_OF+'</div>';
  h += '<div class="ov-fynote">'+FY_NOTE+'</div>';

  h += sec('How Mastercard Makes Money',
    bullets(HOW_MONEY) +
    '<div class="ov-diagram" style="margin-top:14px">'+FOURPARTY_SVG+'<div class="ov-diagram-cap">The <b>four-party (open-loop) model</b>. Tap any box for its role; then press <b>Play</b> to follow a single $100 purchase and see who earns at each step.</div></div>'+
    flowHtml()
  );

  h += sec('Revenue Structure — Two Pillars',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Mastercard reports net revenue in two pillars — explored in depth in the <b>Payment Network</b> and <b>Value-Added Services</b> tabs. <b>Tap any component</b> for a quick read.</div>'+
    '<div class="ov-segmap ov-segmap-2">'+SEGMENTS.map(function(seg){
      return '<div class="ov-segpanel" style="border-top-color:'+seg.accent+'">'+
        '<div class="ov-segpanel-h"><div class="ov-segpanel-n">'+esc(seg.n)+'</div><div class="ov-segpanel-m">'+esc(seg.rev)+' · '+esc(seg.margin)+'</div></div>'+
        '<div class="ov-segnodes">'+seg.subs.map(function(s){
          return '<div class="ov-segnode ov-clickable" data-detail="sub:'+esc(s.k)+'"><span class="ov-segnode-n">'+esc(s.n)+'</span><span class="ov-segnode-r">'+esc(s.rev)+'</span></div>';
        }).join('')+'</div>'+
      '</div>';
    }).join('')+'</div>'
  );

  h += sec('History — From #2 Challenger to Network + Services',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How a bank alliance built to challenge the leader became a global network-plus-services company — <b>tap any milestone</b>.</div>'+
    '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
      return '<div class="ov-tl-item is-click" data-detail="hist:'+i+'"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body"><div class="ov-tl-head">'+t.head+'</div><div class="ov-tl-more">Full story ›</div></div></div>';
    }).join('')+'</div>');

  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table ov-cmp"><thead><tr><th>Dimension</th><th>'+PEER_COLS.map(esc).join('</th><th>')+'</th></tr></thead><tbody>'+
    PEER_ROWS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td>'+r.slice(1).map(function(cell){ return '<td>'+cell+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table><div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>'
  );

  h += sec('Litigation & Legal — Borne Directly', '<p class="ov-lede" style="margin-bottom:12px">'+LIT_INTRO+'</p><div class="ov-callout">'+bullets(LIT)+'</div>');

  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );
  h += '</div>'; // end overview pane

  // ══ PANE 2 — Payment Network (the rails: volume drivers, ~58%) ══
  h += '<div class="ov-pane" data-mapane="network">';
  h += '<p class="ov-lede">'+PN_INTRO+'</p>';
  h += volSection();
  h += '<div class="ov-callout" style="margin-bottom:18px">'+XBORDER_NOTE+'</div>';
  h += sec('Fee Structure — The Three Network Lines',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How the rails monetize. <b>Tap any line</b> for what it is, how it\'s billed, and what drives it.</div>'+
    pillarCards('pn')
  );
  h += sec('Rebates & Incentives — The Gross-to-Net Bridge',
    '<p class="ov-lede" style="margin-bottom:14px">'+REBATES_INTRO+'</p>'+
    '<div class="ov-corr-stats">'+REBATES_BRIDGE.map(function(b){ return '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(b.v)+'</div><div class="ov-corr-l">'+esc(b.l)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:14px">'+bullets(REBATES)+'</div>'
  );
  h += sec('Who Uses Mastercard — The Demand Mix',
    '<p class="ov-lede" style="margin-bottom:12px">'+USERMIX_INTRO+'</p>'+ bullets(USERMIX));
  h += '</div>'; // end network pane

  // ══ PANE 3 — Value-Added Services (the growth engine, ~42%) ══
  h += '<div class="ov-pane" data-mapane="vas">';
  h += sec('Value-Added Services — The Growth Engine', '<div class="ov-callout">'+bullets(VAS_DEEP)+'</div>');
  h += sec('The Service Families',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">The five VAS families — most sold <b>across networks</b>, not just Mastercard\'s. <b>Tap any</b> for detail.</div>'+
    pillarCards('vas')
  );
  h += sec('M&A — Terms & What Each Deal Added',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">The acquisitions that built the services and real-time-payment pillars — <b>tap any deal</b>.</div>'+
    '<div class="ov-cards ov-cards-mna">'+MNA.map(function(m){
      return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
        '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span><span class="ov-chip">'+esc(m.cat)+'</span></div>'+
        '<div class="ov-card-kpis"><span>'+esc(m.y)+'</span><span>'+esc(m.deal)+'</span><span>'+esc(m.terms)+'</span><span>'+esc(m.own)+'</span></div>'+
        '<div class="ov-more">What it added ›</div></div>';
    }).join('')+'</div>'
  );
  h += '</div>'; // end vas pane

  // ══ PANE 4 — Financials (from the Summit DCF; actuals + projection) ══
  h += '<div class="ov-pane" data-mapane="fin">';
  h += '<p class="ov-lede">'+FIN_INTRO+'</p>';
  h += '<div class="ov-rangebar">'+
    '<div class="ov-range-head"><span class="ov-range-title">Timeline</span><span class="ov-range-val" id="ovFinVal">2021 – 2029E</span></div>'+
    '<div class="ov-range-slider"><div class="ov-range-track"></div><div class="ov-range-fill" id="ovFinFill"></div>'+
      '<input type="range" id="ovFinMin" min="2021" max="2029" step="1" value="2021">'+
      '<input type="range" id="ovFinMax" min="2021" max="2029" step="1" value="2029">'+
      '<div class="ov-range-ticks" id="ovFinTicks"></div></div>'+
  '</div>';
  h += '<div class="ov-charts ov-charts-2">'+
    finCard('finRev','Revenue','FY21 – FY29E')+
    finCard('finOpInc','Operating Income','FY21 – FY25 · actuals')+
    finCard('finEbitda','EBITDA','FY21 – FY29E')+
    finCard('finFcf','Free Cash Flow','FY21 – FY29E')+
  '</div>';
  h += '<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  h += '</div>'; // end fin pane

  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  h += '<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';
  h += '</div>';
  return h;
}

// ─── Volume chart (metric × dimension) ───────────────────────────────────────
function renderVol(){
  if (typeof Chart === 'undefined') return;
  var cv = document.getElementById('ovVolChart'); if(!cv) return;
  if(_volChart){ try{ _volChart.destroy(); }catch(e){} _volChart=null; }
  var m = VOL_METRICS[_volMetric];
  var series = VOL_DATA[_volMetric][_volDim];
  var colors = _volDim==='geo' ? GEO_COLORS : TYPE_COLORS;
  var labels = VOL_YEARS.map(function(y,i){ return String(y)+(VOL_EST[i]?'E':''); });
  var datasets = Object.keys(series).map(function(name){
    return { label:name, data:series[name], backgroundColor:colors[name]||'#94A3B8', borderRadius:4, stack:'s', maxBarThickness:54 };
  });
  var titleEl = document.getElementById('ovVolTitle');
  if(titleEl) titleEl.innerHTML = esc(m.label)+' <span>'+(_volDim==='geo'?'por región':'crédito vs débito')+' · '+m.unit+' · ilustrativo</span>';
  _volChart = new Chart(cv.getContext('2d'), { type:'bar',
    data:{ labels:labels, datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:10}, color:C_AXIS } },
        tooltip:{ callbacks:{
          label:function(ctx){ return ' '+ctx.dataset.label+': '+m.fmt(ctx.parsed.y); },
          footer:function(items){ var t=0; items.forEach(function(i){ t+=i.parsed.y; }); return 'Total: '+m.fmt(t); } } } },
      scales:{ x:{ stacked:true, grid:{display:false}, ticks:{ color:C_AXIS, font:{size:10} } },
               y:{ stacked:true, grid:{ color:C_GRID }, ticks:{ color:C_AXIS, font:{size:10}, callback:m.fmt } } } }
  });
  var st = document.getElementById('ovVolStat');
  if(st){
    var n=VOL_YEARS.length, tot=function(i){ var s=0; Object.keys(series).forEach(function(k){ s+=series[k][i]; }); return s; };
    var a=tot(0), z=tot(n-1), cagr=(Math.pow(z/a, 1/(VOL_YEARS[n-1]-VOL_YEARS[0]))-1)*100;
    st.innerHTML='<b>'+labels[0]+'</b> '+m.fmt(a)+' → <b>'+labels[n-1]+'</b> '+m.fmt(z)+' · CAGR <span class="'+(cagr>=0?'pos':'neg')+'">'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</span> <span class="ov-stat-mut">(ilustrativo)</span>';
  }
}

// ─── Financials charts (DCF actuals + projection, timeline-moldable) ─────────
function finSlice(s){
  var o={years:[],labels:[],data:[],est:[]};
  for(var i=0;i<FIN_YEARS.length;i++){ var y=FIN_YEARS[i];
    if(y>=_finStart && y<=_finEnd){ o.years.push(y); o.data.push(s.data[i]); o.est.push(FIN_EST[i]); o.labels.push(String(y)+(FIN_EST[i]?'E':'')); } }
  return o;
}
function makeFin(id){
  var s=FIN_SERIES[id]; var cv=document.getElementById(id); if(!cv) return;
  var sl=finSlice(s);
  var ds;
  if(s.type==='bar'){
    ds={ data:sl.data, backgroundColor:sl.est.map(function(e){ return e?_hexRgba(s.color,0.4):s.color; }), borderRadius:5, maxBarThickness:46 };
  } else {
    ds={ data:sl.data, borderColor:s.color, backgroundColor:_hexRgba(s.color,0.08), fill:true, tension:0.3, borderWidth:2.5, pointRadius:3, pointHoverRadius:5, spanGaps:true,
      pointBackgroundColor: sl.est.map(function(e){ return e?_hexRgba(s.color,0.4):s.color; }),
      segment:{ borderDash:function(ctx){ return sl.est[ctx.p1DataIndex]?[6,4]:undefined; } } };
  }
  _finCharts[id]=new Chart(cv.getContext('2d'), { type:s.type, data:{labels:sl.labels, datasets:[ds]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+FIN_FMT(ctx.parsed.y); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:C_AXIS,font:{size:10}} },
               y:{ grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:FIN_FMT} } } }
  });
  var el=document.getElementById('stat-'+id); if(!el) return;
  var idxs=[]; for(var j=0;j<sl.data.length;j++) if(sl.data[j]!=null) idxs.push(j);
  if(idxs.length>=2){ var fi=idxs[0], li=idxs[idxs.length-1], a=sl.data[fi], z=sl.data[li], yrs=sl.years[li]-sl.years[fi];
    var cagr=(Math.pow(z/a, 1/(yrs||1))-1)*100;
    el.innerHTML='<b>'+sl.labels[fi]+'</b> '+FIN_FMT(a)+' → <b>'+sl.labels[li]+'</b> '+FIN_FMT(z)+' · CAGR <span class="'+(cagr>=0?'pos':'neg')+'">'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</span>';
  } else { el.innerHTML='<span class="ov-stat-mut">Pick a wider range</span>'; }
}
function renderFin(){
  if (typeof Chart === 'undefined') return;
  Object.keys(_finCharts).forEach(function(id){ try{ _finCharts[id].destroy(); }catch(e){} }); _finCharts={};
  Object.keys(FIN_SERIES).forEach(makeFin);
}

function flowHtml(){
  return '<div class="ov-flow" id="ovFlow">'+
    '<div class="ov-flow-nodes">'+
      FLOW_NODES.map(function(n){ return '<div class="ov-flow-node" data-node="'+n.k+'"><div class="ov-flow-ic">'+n.ic+'</div><div class="ov-flow-l">'+esc(n.l)+'</div></div>'; }).join('<span class="ov-flow-link">→</span>')+
    '</div>'+
    '<div class="ov-flow-stage"><span class="ov-flow-step" id="ovFlowStep">Setup</span><div class="ov-flow-cap" id="ovFlowCap">'+FLOW_STEPS[0].cap+'</div>'+
      '<div class="ov-flow-earn" id="ovFlowEarn" hidden></div></div>'+
    '<div class="ov-flow-ctrl">'+
      '<button class="ov-flow-btn" id="ovFlowPlay">▶ Play</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowPrev">‹ Prev</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowNext">Next ›</button>'+
      '<div class="ov-flow-dots" id="ovFlowDots">'+FLOW_STEPS.map(function(s,i){ return '<span class="ov-flow-dot'+(i===0?' on':'')+'" data-i="'+i+'"></span>'; }).join('')+'</div>'+
    '</div>'+
    '<div class="ov-flow-note">'+FLOW_NOTE+'</div>'+
  '</div>';
}

function init(c){
  var root = document.querySelector('.ov-mastercard');
  if (!root) return;

  // ── Sub-tab (chapter) switching ──
  root.querySelectorAll('.ov-subtab').forEach(function(b){
    b.onclick = function(){
      root.querySelectorAll('.ov-subtab').forEach(function(x){ x.classList.toggle('active', x===b); });
      var tab = b.getAttribute('data-matab');
      root.querySelectorAll('.ov-pane').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-mapane')===tab); });
      if (tab==='network') requestAnimationFrame(renderVol); // charts need a visible (sized) canvas
      if (tab==='fin') requestAnimationFrame(renderFin);
    };
  });

  // ── Financials timeline slider ──
  var fmn = root.querySelector('#ovFinMin'), fmx = root.querySelector('#ovFinMax');
  var ffill = root.querySelector('#ovFinFill'), fval = root.querySelector('#ovFinVal'), ftk = root.querySelector('#ovFinTicks');
  if (fmn){
    var FY0=2021, FY1=2029, th='';
    for (var y=FY0; y<=FY1; y++) th += '<span>' + "'" + String(y).slice(2) + (y>=2026?'E':'') + '</span>';
    ftk.innerHTML = th;
    var paintFin = function(){
      var lo=Math.min(+fmn.value,+fmx.value), hi=Math.max(+fmn.value,+fmx.value);
      _finStart=lo; _finEnd=hi;
      var pa=(lo-FY0)/(FY1-FY0)*100, pb=(hi-FY0)/(FY1-FY0)*100;
      ffill.style.left=pa+'%'; ffill.style.width=(pb-pa)+'%';
      fval.textContent = lo + ' – ' + hi + (hi>=2026?'E':'');
    };
    fmn.oninput = function(){ paintFin(); renderFin(); };
    fmx.oninput = function(){ paintFin(); renderFin(); };
    paintFin();
  }

  // ── Volume explorer: metric selector + dimension toggle ──
  var mPills = root.querySelector('#ovVolMetric'), dPills = root.querySelector('#ovVolDim');
  if (mPills) mPills.querySelectorAll('.ov-volpill').forEach(function(b){
    b.onclick = function(){ _volMetric=b.getAttribute('data-metric');
      mPills.querySelectorAll('.ov-volpill').forEach(function(x){ x.classList.toggle('on', x===b); }); renderVol(); };
  });
  if (dPills) dPills.querySelectorAll('.ov-volpill').forEach(function(b){
    b.onclick = function(){ _volDim=b.getAttribute('data-dim');
      dPills.querySelectorAll('.ov-volpill').forEach(function(x){ x.classList.toggle('on', x===b); }); renderVol(); };
  });

  var back = root.querySelector('#ovModalBack');
  var mT = root.querySelector('#ovModalT');
  var mB = root.querySelector('#ovModalB');
  function openModal(title, bodyHtml){ mT.innerHTML = title; mB.innerHTML = bodyHtml; back.hidden = false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeModal(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden = true; }, 180); }
  function onEsc(e){ if (e.key === 'Escape') closeModal(); }
  root.querySelector('#ovModalX').onclick = closeModal;
  back.onclick = function(e){ if (e.target === back) closeModal(); };

  function findSub(id){ var hit=null; SEGMENTS.forEach(function(seg){ seg.subs.forEach(function(s){ if(s.k===id) hit=s; }); }); return hit; }
  function resolve(key){
    var parts = key.split(':'); var kind = parts[0], id = parts.slice(1).join(':');
    if (kind === 'role'){ var r = ROLE_DETAIL[id]; return r && { t:r.t, h:r.h }; }
    if (kind === 'sub'){ var s = findSub(id); return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:subDetailHtml(s) }; }
    if (kind === 'mna'){ var m = MNA.filter(function(x){return x.n===id;})[0]; return m && { t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>', h:m.detail }; }
    if (kind === 'hist'){ var t = TIMELINE[parseInt(id,10)]; return t && { t:t.y, h:t.detail }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(){ var d = resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });

  var flow = root.querySelector('#ovFlow');
  if (flow){
    var idx = 0, timer = null;
    var nodes = flow.querySelectorAll('.ov-flow-node');
    var stepEl = flow.querySelector('#ovFlowStep'), capEl = flow.querySelector('#ovFlowCap'), earnEl = flow.querySelector('#ovFlowEarn');
    var dots = flow.querySelectorAll('.ov-flow-dot'), playBtn = flow.querySelector('#ovFlowPlay');
    function apply(i){
      idx = i; var s = FLOW_STEPS[i];
      nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node')) !== -1); });
      stepEl.textContent = s.t; capEl.innerHTML = s.cap;
      if (s.earn){ earnEl.hidden = false; earnEl.className = 'ov-flow-earn earn-'+s.earnType; earnEl.innerHTML = s.earn; } else { earnEl.hidden = true; }
      dots.forEach(function(d, di){ d.classList.toggle('on', di === i); });
    }
    function stop(){ if (timer){ clearInterval(timer); timer = null; } playBtn.textContent = '▶ Play'; }
    function play(){ if (timer){ stop(); return; } if (idx >= FLOW_STEPS.length - 1) apply(0); playBtn.textContent = '❚❚ Pause'; timer = setInterval(function(){ if (idx >= FLOW_STEPS.length - 1){ stop(); return; } apply(idx + 1); }, 2600); }
    playBtn.onclick = play;
    flow.querySelector('#ovFlowPrev').onclick = function(){ stop(); apply(Math.max(0, idx - 1)); };
    flow.querySelector('#ovFlowNext').onclick = function(){ stop(); apply(Math.min(FLOW_STEPS.length - 1, idx + 1)); };
    dots.forEach(function(d){ d.onclick = function(){ stop(); apply(parseInt(d.getAttribute('data-i'), 10)); }; });
    apply(0);
  }
}

export var mastercardOverview = { html: html, init: init };
