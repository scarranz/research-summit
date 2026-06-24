// overviews/visa.js — custom Overview for Visa Inc. (NYSE: V)
// Sourced from Visa IR / SEC filings / Investor Day 2025 (Feb 20, 2025; transcript on file).
// Built for a naive analyst: every name carries context, every diagram is explained.
// Interactive elements (4-party flow, strategy, VAS, M&A, share classes) open a centered modal.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NYSE: V'],
  ['Founded', '1958 — BankAmericard'],
  ['IPO', 'Mar 2008 · $44.00'],
  ['HQ', 'San Francisco, CA'],
  ['CEO', 'Ryan McInerney'],
  ['Employees', '~34,000'],
];
var DESC = 'Visa runs VisaNet — the rails that authorize, clear and settle electronic payments in 200+ countries. It is a network / technology company, not a bank: it does not issue cards, lend, or set the interchange "swipe fee" (those belong to the banks). It earns a thin slice of every transaction that flows over its network, plus a fast-growing book of software-and-data services. For most of its life it was a cooperative owned by its member banks; it became Visa Inc. in 2007 and went public in 2008.';

var KPIS = [
  { l:'Net Revenue',           v:'$40.0B', d:'+11% YoY', dir:'up' },
  { l:'Payments Volume',       v:'$14T',   d:'+8% cc',   dir:'up' },
  { l:'Processed Transactions',v:'258B',   d:'+10% YoY', dir:'up' },
  { l:'Value-Added Services',  v:'$10.9B', d:'+24% YoY', dir:'up' },
];
var AS_OF = 'Headline figures are fiscal year 2025 (ended September 30, 2025). "cc" = constant-dollar (strips FX moves). Strategy / TAM figures below are management\'s Investor Day 2025 framing (FY2024 baseline).';
var FY_NOTE = 'FY2025: GAAP net income $20.1B ($10.20/sh) · EPS +14% · ~4.9B credentials · cross-border volume +13% cc · $22.8B returned to shareholders; dividend +14%; new $30B buyback.';

// ─── Volume taxonomy ─────────────────────────────────────────────────────────
var VOLGLOSSARY = [
  ['Payments Volume', 'The $ value of <b>goods &amp; services purchased</b> on Visa credentials (a.k.a. "purchase volume").', 'Service revenue', 'The core spend metric.'],
  ['Cash Volume', 'ATM withdrawals, balance transfers, convenience checks.', 'Barely monetized', 'Context only.'],
  ['Total Volume', '<b>Payments + Cash</b> volume.', 'Scale headline', 'Size of the franchise — not a revenue base.'],
  ['Processed Transactions', 'Count of transactions Visa actually <b>routes through VisaNet</b> (any brand).', 'Data-processing revenue', 'Network activity.'],
];
var VOL_VERDICT = 'These four are easy to confuse, and they don\'t tie out — so it matters which one you model. <b>Payments Volume</b> is the dollar of spend that <b>Service revenue</b> is billed on (Visa charges clients a few basis points of the volume they put on the network). <b>Processed Transactions</b> is the count that <b>Data-processing revenue</b> is billed on (a near-fixed fee per transaction routed). So those two map directly onto Visa\'s two biggest revenue lines — they are the numbers to track. <b>Total Volume</b> is bigger and louder but it folds in low-monetization <b>Cash Volume</b>, so it overstates the revenue base. And note the gap: <b>processed transactions ≠ Visa-branded transactions</b> — Visa doesn\'t route every Visa-branded transaction (some are processed by others), and it routes some non-Visa-branded ones, so the count and the brand never reconcile.';

// ─── Operating-trends time series (HARDCODED) ────────────────────────────────
// Fiscal.AI can't retrieve the full history, so these are hardcoded (not wired live).
// Stored NEWEST-FIRST and reversed to chronological at render. Values: volume in $M,
// transactions in millions, cards in millions. A 0 = NOT YET DISCLOSED (reporting lag),
// not an actual zero — mapped to null so it isn't plotted. Cash is excluded on purpose.
var TS_LABELS = ['Q2-26','Q1-26','Q4-25','Q3-25','Q2-25','Q1-25','Q4-24','Q3-24','Q2-24','Q1-24','Q4-23','Q3-23','Q2-23','Q1-23','Q4-22','Q3-22','Q2-22','Q1-22','Q4-21','Q3-21','Q2-21','Q1-21','Q4-20','Q3-20','Q2-20','Q1-20','Q4-19','Q3-19','Q2-19','Q1-19','Q4-18','Q3-18','Q2-18','Q1-18'];
var TS_VOL_US   = [1788000,1835000,1775000,1766000,1654000,1720000,1650000,1653000,1561000,1603000,1568000,1572000,1471000,1523000,1479000,1488000,1337000,1395000,1325000,1331000,1157000,1140000,1096000,949000,983000,1056000,1023000,1022000,930000,980000,945000,938000,863000,886000];
var TS_VOL_INTL = [1942000,2034000,1956000,1853000,1687000,1804000,1759000,1672000,1612000,1674000,1627000,1594000,1484000,1491000,1450000,1450000,1437000,1569000,1461000,1389000,1266000,1336000,1253000,1004000,1147000,1304000,1247000,1209000,1154000,1215000,1166000,1187000,1155000,1165000];
var TS_TX_US    = [27257,28595,28217,27726,25859,27309,26774,26327,24715,25659,25333,25028,23203,24107,23601,23257,21036,22465,21920,21398,19119,19467,18862,16095,17624,18990,18788,18611,16969,17891,17501,17276,15939,16518];
var TS_TX_INTL  = [52574,55312,53880,51528,47736,50194,48491,46328,43208,44609,43107,41082,37738,39190,38267,36353,36086,39681,37061,34175,31532,32094,30842,24584,28070,30337,29050,27608,25238,26433,24973,23951,22551,22787];
var TS_CRD_USC  = [0,531,532,521,508,494,451,435,433,423,399,389,380,376,381,370,368,363,361,349,351,353,343,340,340,340,340,334,336,337,336,333,335,340];
var TS_CRD_USD  = [0,1047,1017,1001,1047,1047,1012,994,974,957,917,899,900,889,909,897,812,782,779,742,719,687,650,653,637,629,599,589,581,577,561,522,539,542];
var TS_CRD_INC  = [0,1039,1011,990,972,945,919,909,903,902,892,884,882,872,868,865,848,845,820,806,806,804,798,797,802,797,800,793,786,781,771,764,754,744];
var TS_CRD_IND  = [0,2495,2459,2411,2371,2355,2318,2270,2239,2199,2112,2077,2044,2025,1963,1924,1905,1945,1875,1816,1768,1742,1714,1701,1684,1691,1647,1688,1675,1660,1679,1657,1638,1624];
var TS_GEO = { labels:['Europe','Asia Pacific','Latin America','CEMEA','Canada'], data:[797,521,274,245,106] }; // $B, latest disclosed quarter
var TS_NOTE = '<b>⚠ Hardcoded from Visa\'s disclosures.</b> The Fiscal.AI feed can\'t retrieve the full history yet, so these charts are <b>not wired live</b> and won\'t auto-update. A <b>blank at the most recent quarter means the figure isn\'t disclosed yet</b> (normal reporting lag) — <b>not zero</b>. <b>Cash volume is excluded</b> (immaterial to the thesis). Visa\'s fiscal Q1 = Oct–Dec (holiday quarter), so expect seasonality.';

// ─── Revenue engine (how the money is actually earned) ───────────────────────
var REVENUE = [
  ['Service revenue', 'Charged to clients as a few <b>basis points of Payments Volume</b>. Billed in arrears (this quarter\'s rate on last quarter\'s volume). Grows with how much people spend.'],
  ['Data processing', 'A near-fixed <b>fee per transaction</b> Visa routes through VisaNet (authorize / clear / settle). Grows with transaction <i>count</i>, not ticket size — so it\'s resilient even in a downturn.'],
  ['International transaction', '<b>Cross-border + FX</b> fees when the card country ≠ merchant country. The <b>highest-yield</b> line — cross-border volumes grew ~20%/yr 2022–24, well ahead of total volume.'],
  ['Value-added services', '~$10.9B (~27% of net revenue, FY25). Software, risk, issuing and advisory sold <b>on top of</b> the rails — and often <b>network-agnostic</b> (earns even on non-Visa volume). See the VAS section.'],
  ['(−) Client incentives', '~$15.8B paid <b>to issuers and partners</b> to win and keep their volume. A <b>contra-revenue</b> — it nets against the gross lines above to get to the $40.0B headline. This is the real competitive battleground (see "dilution").'],
];
var HOW_MONEY = [
  '<b>Not a bank:</b> Visa does not issue cards, lend, or earn interchange — those belong to the issuing banks. It never touches the purchase amount and takes <b>no credit risk</b>.',
  '<b>Three fee engines + services:</b> it earns <b>Service</b> (on volume), <b>Data Processing</b> (per transaction) and <b>International / FX</b> (cross-border) — then a fourth leg, <b>Value-Added Services</b>, sold on top.',
  '<b>Volume alone is too simple:</b> VAS is now ~27% of revenue and growing ~2× the rails, so "Visa = a toll on spend" undersells it. Click the diagram below to walk a single transaction and see exactly <b>who earns at each step</b>.',
];

// ─── Client incentives (the gross-to-net bridge) ─────────────────────────────
var CI_INTRO = 'This is the single biggest swing factor in Visa\'s revenue — and the most misunderstood line. <b>Client incentives</b> are payments Visa makes to <b>issuers, acquirers, merchants and partners</b> to win and keep their volume and acceptance. Because they are "consideration paid to a customer," accounting rules make Visa book them <b>mostly as a reduction of revenue (contra-revenue)</b>, not an operating expense. They are the bridge from <b>gross revenue → the $40.0B net</b>: <b>$15.8B in FY25</b> — about <b>28% of gross</b> (~$55.8B gross nets to the $40.0B headline), or ~39% of net. The ratio has <b>risen every year</b> (FY24 $13.8B → FY25 $15.8B, +14%, faster than revenue) — the competitive price of keeping banks loyal now that they no longer own Visa (see Origins → dilution).';
var CI_CHAIN = [
  { t:'Win or renew a deal', d:'Visa signs a multi-year contract with a big issuer, co-brand or merchant — usually a mix of an <b>upfront payment</b> <i>plus</i> volume-tiered rebates.' },
  { t:'Upfront payment → capitalized as an ASSET', d:'The <b>fixed / upfront</b> portion is <b>not</b> expensed immediately. It goes on the balance sheet as a <b>client-incentive asset</b> — incentives paid but not yet earned through.' },
  { t:'Amortized over the contract → reduces revenue', d:'That asset is <b>drawn down over the deal\'s life</b> (straight-line or by volume) as a <b>reduction of net revenue</b> each period. One big signing quietly drags net revenue for <i>years</i>.' },
  { t:'Variable incentives accrue with volume', d:'The <b>volume / performance-based</b> portion is <b>accrued as the client delivers volume</b>, estimated against forecasts and trued-up over time.' },
];
var CI_BS = 'Two sides of the same coin on the balance sheet: the <b>asset</b> = incentives <b>paid but not yet amortized</b> (capitalized upfront payments); the accrued <b>liability</b> = incentives <b>earned but not yet paid</b>. The income statement only ever sees the period\'s <b>amortization + accrual</b>, netted against gross revenue — which is why a quarter\'s reported incentives can move without any cash changing hands that quarter.';
var CI_EXCEPTION = '<b>One subtlety the 10-K spells out:</b> incentives are <i>mostly</i> contra-revenue — <b>but</b> when Visa receives a <b>separately identifiable benefit at fair value</b> from the client (genuine marketing or services it would otherwise pay for), <b>that portion is booked as an operating expense instead</b>. So "client incentives" and "the reduction to revenue" aren\'t exactly the same number — a sliver lands in opex.';
var CI_TYPES = [
  { k:'fixed', n:'Fixed / upfront', sub:'Signing & renewal payments',
    detail:'<b>What it is:</b> upfront or signing/renewal payments made to lock in a multi-year deal.<br><br><b>Accounting (per the 10-K):</b> Visa <b>capitalizes</b> the upfront/fixed payment and <b>amortizes it as a reduction to revenue ratably over the contractual term</b>.<br><br><b>Why it matters:</b> this is the part that creates the "<b>asset → amortization</b>" dynamic — a big win <i>today</i> depresses net revenue for years, smoothing the hit but also baking in a drag you can\'t un-sign.' },
  { k:'variable', n:'Variable / performance-based', sub:'Rebates tied to volume & targets',
    detail:'<b>What it is:</b> rebates and incentives tied to a client hitting <b>volume, spend or growth targets</b> (e.g. tiered rebates that step up as an issuer puts more spend on Visa).<br><br><b>Accounting (per the 10-K):</b> <b>recorded as a reduction to revenue when earned</b>, recognized "systematically and rationally" based on <b>management\'s estimate of each client\'s performance</b> against the targets — then trued-up.<br><br><b>Why it matters:</b> the most macro-sensitive piece, and the source of <b>true-up noise</b> — if a client over/under-performs the forecast, Visa adjusts the accrual.' },
  { k:'support', n:'Marketing / brand support', sub:'Co-brand & client marketing funds',
    detail:'<b>What it is:</b> funds and support for client and co-brand <b>marketing</b>, portfolio conversions and product launches.<br><br><b>The accounting fork:</b> usually grouped with incentives (contra-revenue) — <b>but</b> if Visa gets a <b>separately identifiable benefit at fair value</b>, that portion is booked as an <b>operating expense</b> instead. So this is the bucket most likely to sit <i>outside</i> the revenue reduction.<br><br><b>On "in-kind":</b> a formal <b>"in-kind"</b> incentive line is something you\'ll more often see in <b>Mastercard\'s</b> "rebates &amp; incentives" disclosure than in Visa\'s — treat it as a <i>cross-network concept</i>, not a named Visa line item.' },
];
var CI_WHY = [
  ['Gross-to-net is the #1 swing', 'Visa guides "<b>client incentives as a % of gross revenue</b>" every quarter. A 1-point move in that ratio swings net revenue by hundreds of millions — model the incentive ratio <i>before</i> you model anything else.'],
  ['Rising ratio = competitive intensity', 'Incentives as a % of <b>net</b> revenue climbed from ~38% (FY24) to ~39% (FY25), growing <b>faster than revenue</b>. It is the <b>post-co-op cost of retaining issuers</b> who no longer own Visa — a rising ratio can mean Visa is <b>paying up to defend share</b>. Read it together with the dilution section.'],
  ['Estimation / true-up risk', 'Variable incentives depend on <b>forecasting client volumes</b>. Mis-estimates force true-ups that add noise to any single quarter\'s net revenue — a reason reported net revenue can wobble around the trend.'],
  ['Renewal-cycle lumpiness', 'A heavy <b>renewal year</b> (re-signing big portfolios) can step up incentives and <b>optically slow net-revenue growth</b> even when gross revenue and payments volume are perfectly healthy.'],
];

// ─── Four-party model — interactive ──────────────────────────────────────────
var FOURPARTY_SVG =
'<svg viewBox="0 0 680 360" role="img" aria-label="Visa four-party model — click a box for its role">' +
  '<defs><marker id="ovar" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker></defs>' +
  '<line x1="200" y1="56" x2="470" y2="56" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#ovar)"/>' +
  '<text x="335" y="44" text-anchor="middle" font-size="10" fill="#8A93A0">buys goods / services</text>' +
  '<line x1="115" y1="86" x2="115" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="565" y1="86" x2="565" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="196" y1="280" x2="262" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="484" y1="280" x2="418" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<g class="ov-fpm-node" data-detail="role:cardholder"><rect x="30" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Cardholder</text><text x="115" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:merchant"><rect x="480" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Merchant</text><text x="565" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:issuer"><rect x="30" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Issuer</text><text x="115" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">cardholder&#8217;s bank ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:acquirer"><rect x="480" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Acquirer</text><text x="565" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">merchant&#8217;s bank ›</text></g>' +
  '<g class="ov-fpm-node" data-detail="role:visa"><rect x="255" y="150" width="170" height="64" rx="11" fill="var(--brand)" stroke="var(--brand-2)" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">VISA</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#cfd5f0">VisaNet · clearing &amp; settlement ›</text></g>' +
'</svg>';

// Transaction-flow animation: 5 nodes, stepped through auth → clearing → settlement.
var FLOW_NODES = [
  { k:'card', ic:'💳', l:'Cardholder' },
  { k:'merch', ic:'🏪', l:'Merchant' },
  { k:'acq', ic:'🏛️', l:'Acquirer' },
  { k:'visa', ic:'🟦', l:'VisaNet' },
  { k:'iss', ic:'🏦', l:'Issuer' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A $100 purchase on a Visa card. Press <b>Play</b> to follow the money — and watch where each party earns (or doesn\'t).', earn:'', earnType:'none' },
  { t:'1 · Authorization', on:['card','merch','acq','visa','iss'], cap:'Tap. The request hops <b>merchant → acquirer → VisaNet → issuer</b>, which checks the balance and runs fraud in ~1–2 seconds, then approves.', earn:'No fee booked yet — authorization is part of the service, not a charge.', earnType:'none' },
  { t:'2 · Approval returns', on:['iss','visa','acq','merch','card'], cap:'The "approved" travels back the same path. The cardholder walks out with the goods — but <b>no real money has moved</b>, only a promise to pay.', earn:'Still nothing settled. This is why a stolen-card fraud loss lands on the issuer, not Visa.', earnType:'none' },
  { t:'3 · Clearing', on:['acq','visa','iss'], cap:'Later, in a batch, the acquirer submits the transaction. <b>VisaNet</b> computes the amounts and the interchange the issuer is owed.', earn:'VisaNet books its <b>data-processing fee</b> — a near-fixed fee for routing this one transaction.', earnType:'visa' },
  { t:'4 · Settlement', on:['iss','visa','acq','merch'], cap:'The issuer pays <b>$100 minus interchange</b>; VisaNet moves funds to the acquirer, which pays the merchant the net. The $ finally moves.', earn:'Fees split now: <b>~$1.50–2.50 interchange → ISSUER</b> · <b>Visa service + data fees (a few ¢) → VISA</b> · acquirer markup → ACQUIRER.', earnType:'split' },
  { t:'5 · Who got what', on:['card','merch','acq','visa','iss'], cap:'The merchant nets ~<b>$97.50</b>. Visa never touched the $100 and never lent it.', earn:'<b>Interchange — the biggest slice — went to the ISSUER, not Visa.</b> Visa earned only a few cents (data processing) + a few basis points of the $100 (service). That thinness × billions of transactions = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Key takeaway: Visa earns on a transaction <b>only when it runs over a Visa rail</b> (or when a Visa value-added service is attached). A <b>Mastercard- or Amex-branded</b> swipe runs over <b>their</b> network — Visa earns <b>$0</b> on it. That is exactly why Visa buys network-agnostic services (fraud, tokens, gateway) it can sell on <b>any</b> network — see "What is VisaNet" and "VAS" below.';

// ─── What is VisaNet ─────────────────────────────────────────────────────────
var VISANET = [
  '<b>VisaNet is software + data centers, not the card and not the terminal.</b> It is Visa\'s global processing platform that does three jobs on every transaction: <b>authorize</b> (can this go through?), <b>clear</b> (what is owed to whom?) and <b>settle</b> (move the funds), at 99.9999% uptime and ~630M+ transactions a day. The little terminal on the counter is owned by the <b>merchant / acquirer</b> — it is not "a Visa machine."',
  '<b>There is no such thing as a "Visa terminal" vs a "Mastercard terminal."</b> A modern terminal accepts many networks. What decides which network a payment travels over is the <b>card and the routing rules</b>, not the hardware.',
  '<b>How the network gets "chosen":</b> for <b>credit</b>, the card\'s brand decides — a Visa-branded credit card always runs over Visa. For <b>U.S. debit</b>, the <b>Durbin Amendment</b> forces every debit card to carry <b>at least two unaffiliated networks</b>, and the <b>merchant/acquirer picks</b> which to route over to save cost ("debit routing"). That is where Visa fights transaction-by-transaction — and why the <b>DOJ</b> is suing Visa over alleged exclusionary debit deals.',
  '<b>Does Visa earn when a Mastercard/Amex card is used? Generally no</b> — that transaction runs over the other network. Visa monetizes <b>beyond its own brand</b> only through assets that are deliberately network-agnostic: its <b>Cybersource gateway</b>, its <b>token / fraud / identity (Visa Protect)</b> services, and owned <b>processing</b> (DPS, Pismo).',
  '<b>This is the "network of networks."</b> Since 2020 Visa has linked VisaNet to <b>15 card networks, 75+ domestic schemes, 15 RTP networks and 5 gateways</b> — 11B+ endpoints. Combined with "unbundling the Visa stack" into APIs (Visa as a Service), it lets Visa <b>power and monetize payments that never touch a Visa card</b> (Visa Direct, Visa A2A, Risk-as-a-Service). That theme runs through the whole strategy section below.',
];

// ─── Origins + dilution trend ────────────────────────────────────────────────
var ORIGINS = 'For most of its life Visa was <b>owned by its own customers — the banks</b>, not outside investors. In the 1960s Bank of America took what had been a <b>closed-loop</b> card and made it <b>open-loop by licensing it to other banks</b>; in 1970 those banks formed <b>National BankAmericard Inc. (NBI)</b>, a non-stock <b>cooperative owned and governed by its member banks</b>. The paradox: after "duality" (mid-1970s) a bank could issue <b>both</b> Visa and Mastercard — yet because the banks <b>collectively owned Visa and shared its profits</b>, they stayed loyal even when they could have favored the rival. That member-ownership is the <b>direct origin of today\'s Class A/B/C shares</b>: the 2007 restructuring converted membership interests into stock, and the 2008 IPO floated Class A while the banks kept B (U.S.) and C (international).';
var DIL_SEQ = [
  { t:'2008 — IPO', d:'Banks receive <b>Class B</b> (U.S.) &amp; <b>Class C</b> (international); the public gets <b>Class A</b>.' },
  { t:'~2009–11 — Class C frees up', d:'Class C lock-ups expire → international banks convert to Class A and <b>largely sell out</b>.' },
  { t:'2008 → today — Class B stays locked', d:'Class B backstops the U.S. interchange litigation, so U.S. banks <b>can\'t freely sell</b> ~17 yrs later (a 2024 B-1/B-2 exchange gave only <i>partial</i> liquidity).' },
  { t:'Now — purely commercial', d:'No longer owners, issuers route to whoever pays most → Visa spends <b>~$15.8B/yr in incentives</b> to keep them (vs ~$0 as a co-op).' },
];
var DIL_VS = {
  claim: 'Once banks stopped owning Visa, the loyalty that survived "duality" is gone — issuers drift toward Mastercard and <b>Visa\'s share erodes</b>.',
  real: 'Hasn\'t clearly happened. Co-brands are sticky, Visa has the largest acceptance, ~2:1 brand preference, and its advisory arm has <b>migrated ~150M cards TO Visa</b>. Dilution raised Visa\'s <b>cost</b> to retain banks (incentives) more than it cost <b>volume</b> — watch incentives % of gross revenue as the real tell.',
};

// ─── History (interactive timeline — short headline, full story in modal) ─────
var TIMELINE = [
  { y:'1958', head:'<b>The "Fresno Drop"</b> — BofA mass-mails ~60,000 live credit cards, the first scaled card launch.',
    detail:'Bank of America mailed ~60,000 <b>live, ready-to-use</b> credit cards, unsolicited, to residents of Fresno, CA — the first mass credit-card launch. Early fraud and ~22% delinquency nearly killed it (mass unsolicited mailing was banned in 1970), but it proved <b>revolving credit could scale</b>.' },
  { y:'1966', head:'<b>Going open-loop</b> — BofA licenses the card to other banks, creating a network of "member banks."',
    detail:'BofA began <b>licensing</b> BankAmericard to other banks — <b>turning a closed-loop card into an open-loop network</b>. The licensees (the "<b>member banks</b>," eventually thousands of U.S. banks) needed a shared body to run the network between them. This licensing decision is the root of Visa\'s whole open-loop model.' },
  { y:'1970', head:'<b>The bank co-op (NBI)</b> — member banks form National BankAmericard Inc.; BofA gives up control.',
    detail:'Under <b>Dee Hock</b>, the banks formed <b>National BankAmericard Inc. (NBI)</b> — a bank-owned <b>cooperative</b>; BofA gave up unilateral control. This is the co-op that becomes Visa — and the direct origin of today\'s Class A/B/C share structure.' },
  { y:'1975–76', head:'<b>DOJ forces "duality"</b> — banks may now issue both Visa and Mastercard.',
    detail:'Originally a BankAmericard member couldn\'t also issue the rival "Master Charge." Antitrust pressure (the DOJ + the <i>Worthen Bank</i> case) <b>forced "duality"</b> — banks could belong to both networks. <i>This is why your bank can offer both a Visa and a Mastercard today</i> — and why the banks\' co-ownership of Visa later mattered so much for loyalty.' },
  { y:'1976', head:'<b>Becomes "VISA"</b> — a name chosen to read the same in every language.',
    detail:'Global rebrand to <b>VISA</b>: NBI → Visa U.S.A., the international arm (IBANCO) → Visa International. Over the following years Visa builds its electronic backbone — the BASE I (authorization) and BASE II (clearing/settlement) systems.' },
  { y:'1970s–2000s', head:'<b>A member-owned utility</b> — ~30 years run not-for-profit by 13,000+ banks.',
    detail:'For roughly three decades Visa ran as an <b>association of 13,000+ member banks</b>, governed regionally — operating the rails as a shared, near-break-even utility rather than a profit-seeking company. The banks owned it and shared its economics.' },
  { y:'Oct 2007', head:'<b>Restructures into a company</b> — Visa Inc. is formed; Europe stays a separate co-op.',
    detail:'Visa U.S.A./International/Canada combined into <b>Visa Inc.</b>, a Delaware <b>stock</b> company; membership interests became shares. <b>Visa Europe stayed a separate bank-owned association</b> (Europe\'s banks chose to remain a co-op) — with a contractual <b>put option</b> to sell itself to Visa Inc. later.' },
  { y:'Mar 2008', head:'<b>The IPO</b> — $17.9B, the largest U.S. IPO at the time; seeds the $3B litigation escrow.',
    detail:'406M Class A shares at $44 → <b>$17.9B</b>, the largest U.S. IPO at the time. >$10B of proceeds bought back member-bank shares; <b>$3.0B seeded the litigation escrow</b> (see the Shareholder Structure section for why that matters today).' },
  { y:'2016', head:'<b>Buys back Visa Europe</b> (€21.2B) — reunifies the franchise, inherits EU interchange caps.',
    detail:'Europe\'s banks exercised their put; Visa <b>reacquired Visa Europe</b> for up to €21.2B, <b>reunifying the global franchise</b> — gaining Europe\'s economics, but also inheriting Europe\'s strict <b>interchange-cap regulation</b> that structurally lowers European yields.' },
  { y:'2020', head:'<b>"Network of networks"</b> — pivots to move money any way; buys Earthport, Tink, Pismo, Featurespace…',
    detail:'Visa moved from a single network to linking <b>15 card networks, 75+ domestic schemes, 15 RTP networks &amp; 5 gateways</b> (11B+ endpoints), buying rails to move money <i>any</i> way: Earthport (accounts), Currencycloud (FX), Tink (open banking), Pismo (core banking), Featurespace (AI fraud) — after the DOJ <b>blocked</b> its Plaid deal. See the M&A section for what each one actually added.' },
  { y:'Feb 2025', head:'<b>Investor Day 2025</b> — reorg into 3 businesses; "Visa as a Service"; $41T / $200T / $520B.',
    detail:'Visa reorganized around three businesses (Consumer Payments / Commercial &amp; Money Movement / Value-Added Services), pushed "<b>Visa as a Service</b>" (unbundling the stack into APIs anyone can buy), and framed the ~$41T / ~$200T / ~$520B opportunity — detailed in the Strategy section above.' },
];

// ─── Investor Day 2025 — the three-pillar strategy ───────────────────────────
var STRATEGY_INTRO = 'At Investor Day (Feb 20, 2025) Visa reorganized the whole company into <b>three growth businesses</b> and told investors where the next decade comes from. The big numbers are <b>TAMs — total addressable opportunity, not revenue</b>. The strategy: keep mining the mature first bucket while shifting mix toward the two larger, barely-penetrated ones. Tap each pillar for exactly what it is and how management plans to capture it.';
var PILLARS = [
  { tam:'~$41T', l:'1 · Consumer Payments', s:'The classic card business. Visa captures ~25%; ~$23T is still cash / check / ACH / A2A — the underserved core.',
    detail:'<b>What it is:</b> consumers paying merchants with Visa credentials — the business everyone knows.<br><br><b>The opportunity:</b> ~$41T of annual consumer spend (ex-Russia/China). Visa captures <b>~25%</b>, its global card rivals ~20%. The prize is the <b>~$23T (just over half) still underserved</b>: ~$11T cash &amp; check, ~$8T legacy ACH/electronic, ~$2T+ on domestic card schemes, &lt;$2T consumer A2A. Every dollar pulled onto the network is almost pure margin — the rails already exist.<br><br><b>How management captures it (Actions 1 &amp; 2 — strengthen card <i>and</i> expand into non-card):</b> <b>Tap to Pay / Tap to Everything</b> (now 74% of face-to-face transactions), network <b>tokens</b> (12.6B; +4.7pp approval, −34% fraud), <b>cross-border</b> (premium yield), <b>affluent</b> (a U.S. affluent cardholder = ~30× the revenue of an average one), <b>consumer credit</b> ($5.4T FY24 volume), the <b>Flexible Credential</b> (one credential toggling debit/credit/BNPL/A2A — 3M+ accounts at SMBC Japan, now Affirm in the U.S.), plus <b>A2A/open banking</b> (Tink, Visa A2A, Visa Pay).' },
  { tam:'~$200T', l:'2 · New Flows (CMS)', s:'Money movement beyond consumer cards — B2B + payouts. ~$1.7T penetrated of a $200T pool.',
    detail:'<b>What it is:</b> Visa\'s name for <b>all money movement that isn\'t a consumer buying from a merchant</b> — reported as <b>Commercial &amp; Money Movement Solutions (CMS)</b>: B2B invoices, payroll/gig payouts, P2P, government disbursements, remittances.<br><br><b>The opportunity:</b> ~<b>$200T/yr</b> = ~$145T B2B + ~$55T other money movement. Visa has ~$1.7T commercial volume + ~10B Visa Direct transactions today — a sliver. Of the B2B, ~$60T is addressable now ($25T cross-border via Visa Direct + $35T via cards/virtual — that $35T ≈ 80% of B2B revenue pools); ~$85T is longer-term R&D.<br><br><b>How management captures it — two engines:</b> <b>Visa Commercial Solutions</b> (the #1 commercial card network, ~40% share — corporate/purchasing/virtual cards, SMB, verticals like travel, fleet &amp; fuel, agriculture, government); and <b>Visa Direct</b> (push funds <i>to</i> a card/account/wallet — 65+ use cases, 11B+ endpoints, 195+ countries; powers gig pay, payouts, remittances). Yields: commercial ~17–19 bps; Visa Direct ~$0.09–0.10/transaction.' },
  { tam:'~$520B', l:'3 · Value-Added Services', s:'Software, risk, issuing, advisory sold on top of the rails — $8.8B captured (~2%), often network-agnostic.',
    detail:'<b>What it is:</b> everything Visa sells <i>on top of</i> moving the payment — and crucially, much of it is <b>network-agnostic</b>, so Visa earns even on non-Visa transactions.<br><br><b>The opportunity:</b> management sizes the annual VAS revenue opportunity at ~<b>$520B</b> vs the <b>$8.8B</b> captured in FY24 — i.e. ~2% penetrated, with no single portfolio above ~3%.<br><br><b>How management captures it (3 lanes):</b> <b>enhance Visa payments</b> (tokens, benefits, fraud), <b>enable all payments</b> (sell risk/acceptance into non-Visa &amp; A2A flows), and <b>go beyond payments</b> (consulting, marketing, data, core banking). Delivered through four portfolios — see the VAS section. This is the heart of "<b>Visa as a Service</b>": unbundling the VisaNet stack into APIs anyone can buy.' },
];
var ACTIONS = [
  ['1 · Strengthen card-based consumer payments', 'Win the ~$23T still off-network with tap-to-everything, tokens, premium/affluent products and consumer credit.'],
  ['2 · Expand reach into non-card payments', 'Compete with and ride A2A/RTP rails — open banking (Tink), Visa A2A, Visa Pay, flexible credential — so Visa grows even where it doesn\'t own the rail.'],
  ['3 · Penetrate commercial payments &amp; money movement', 'Scale Visa Commercial Solutions + Visa Direct into the $200T CMS pool — largely reusing VisaNet, so it lands at attractive margins.'],
  ['4 · Deliver value-added services', 'Sell the unbundled Visa stack (risk, issuing, acceptance, advisory) to a far broader, increasingly non-Visa customer set.'],
];
var VAAS_NOTE = 'The connective theme management hammered all day: <b>"Visa as a Service."</b> Visa is <b>unbundling VisaNet into independently consumable APIs</b> (2,900+ endpoints, 40B+ calls/month) and selling each capability — risk, tokens, disputes, processing — to anyone, on any network. It started by going <b>open-loop in the 1960s</b> (licensing the network to all banks), became a <b>network of networks in 2020</b> (15 card networks, 75+ domestic schemes, 15 RTP networks, 11B+ endpoints), and now sells the stack piece by piece. <b>That is how Visa earns beyond its own rails.</b>';
var FRAMEWORK_NOTE = 'Management\'s long-term framework (explicitly "<b>not a forecast</b>"): if <b>CMS + VAS grow 16–18%</b> and <b>consumer payments volume grows 5–7%</b>, total net revenue compounds <b>9–12%</b>. The mechanism is <b>mix shift</b> — CMS + VAS rising from ~30% of revenue today to <b>&gt;50%</b> over time — which sustains durable double-digit revenue and <b>high-teens EPS</b> even as consumer cards mature. Capital return amplifies it: <b>&gt;$140B returned to shareholders since the 2008 IPO.</b>';

// ─── VAS — four portfolios, each opens a modal ───────────────────────────────
var VAS_SCALE = 'VAS is ~$10.9B (FY25, +24% YoY, ~27% of net revenue) and growing roughly <b>2× the rails</b> — up from <b>$8.8B at Investor Day\'s FY24 baseline</b>, against a <b>$520B</b> opportunity (~2% penetrated). Mastercard\'s comparable services line is ~$13.3B (~41% of its revenue) — it pivoted earlier; Visa is growing faster off a slightly smaller base. Visa reports VAS as <b>four portfolios</b> — <b>tap any</b> for what it is, who buys it, and how it competes.';
var VAS = [
  { k:'issuing', n:'Issuing Solutions', tag:'$3.5B · largest', sub:'Help banks/fintechs run & engage card programs',
    detail:'<b>FY24 revenue ~$3.5B, mid-teens growth — the largest portfolio.</b><br><br><b>What it is:</b> the stack a bank or fintech needs to run a card program and keep cardholders engaged.<br>• <b>Cardholder engagement</b> (the biggest piece): benefits, airport lounges, dining, offers — drives <b>premium/affluent card fees</b> (e.g. Infinite cards in Brazil grew ~6× faster than other tiers).<br>• <b>Cardholder experiences:</b> e.g. <b>Smarter Stand-in Processing</b> — if an issuer\'s system goes down, Visa\'s AI approves transactions on its behalf (1,500+ issuers, 95%+ match rate).<br>• <b>Issuer processing &amp; core banking:</b> <b>DPS</b> (debit processing for most of the largest U.S. issuers) + <b>Pismo</b> (cloud core banking — ~130M accounts; can run <i>non-Visa</i> rails too).<br><br><b>vs rivals:</b> more vertically integrated than Mastercard; competes with <b>FIS / Fiserv / TSYS</b>.' },
  { k:'accept', n:'Acceptance Solutions', tag:'$2.5B · network-agnostic', sub:'Help sellers & acquirers take payments',
    detail:'<b>FY24 revenue ~$2.5B, low-20s growth.</b><br><br><b>What it is:</b> the merchant side — the <b>Visa Acceptance Platform</b> that lets a business accept payments across many brands, plus fraud/token tools and dispute resolution.<br>• <b>CyberSource</b> — enterprise gateway, 500k+ customers, 160+ countries, 250+ acquirer processors, 800+ tech partners.<br>• <b>Authorize.net</b> — leading SMB gateway (~$200B annual volume).<br>• <b>Verifi</b> — post-purchase dispute/chargeback resolution.<br><br><b>Why it matters:</b> much of it is <b>network-agnostic</b>, so Visa earns here <b>even on Mastercard/Amex transactions</b>; >50% of platform revenue now comes via third parties (Visa as a Service).<br><br><b>vs rivals:</b> the most fintech-exposed line — competes with <b>Stripe / Adyen / Braintree</b>.' },
  { k:'risk', n:'Risk & Security Solutions', tag:'$1.5B · across networks', sub:'Approve more, lose less',
    detail:'<b>FY24 revenue ~$1.5B, high-teens growth.</b><br><br><b>What it is:</b> real-time AI that scores transactions for fraud, plus authentication and cybersecurity — increasingly <b>card- and network-agnostic</b>.<br>• <b>Visa Advanced Authorization</b> + <b>Visa Risk Manager</b> (transaction scoring); <b>Visa Deep Authorization</b> (card-not-present, +20% fraud detection).<br>• <b>Authentication:</b> 3-DS / CardinalCommerce, passkeys, biometrics.<br>• <b>Cybersecurity:</b> enumeration-attack defense / Account Attack Intelligence — blocked 150M+ fraudulent transactions in FY24.<br>• <b>Visa Protect for A2A</b> — fraud scoring on non-card real-time payments (73% capture in Argentina, 54% in the U.K.).<br>• <b>Featurespace (ARIC)</b> — adaptive behavioral fraud, extends fraud coverage upstream (account-opening, scams).<br><br><b>vs rivals:</b> Mastercard\'s security stack is broader (Ekata, RiskRecon, Recorded Future); Visa stays focused on the payments use case.' },
  { k:'advisory', n:'Advisory & Other Services', tag:'$1.3B · fastest', sub:'Sell Visa\'s data, expertise, marketing & open banking',
    detail:'<b>FY24 revenue ~$1.3B, mid-30s growth — the fastest portfolio.</b><br><br><b>What it is:</b> Visa\'s expertise and data sold as a service.<br>• <b>Marketing Services</b> (largest sub): 300+ pros, 900+ client campaigns/yr, powered by sponsorship assets — <b>FIFA World Cup, Olympics/Paralympics, NFL, two Red Bull F1 teams</b>.<br>• <b>Consulting (VCA) + Managed Services:</b> 3,000+ projects/yr generating an estimated ~$5B of incremental client revenue; a specialist team has <b>migrated ~150M cards from other networks to Visa</b> over 10 years.<br>• <b>Data Solutions</b> (benchmarking, scoring) and <b>Open Banking (Tink)</b> — 13,000+ bank connections across 20 countries incl. the U.S.<br><br><b>Why it matters:</b> it\'s a <b>revenue multiplier</b> — advisory work drives more Visa volume and pulls through the other three portfolios.' },
];

// ─── M&A — each deal opens a modal ───────────────────────────────────────────
var MNA = [
  { n:'CyberSource', y:'2010', deal:'~$2.0B · cash', own:'Public', cat:'Acceptance',
    detail:'<b>What it added:</b> an online <b>payment gateway</b> — the software a website uses to accept cards. Visa had the rails but not the merchant-facing checkout layer.<br><br><b>How it shows up today:</b> the heart of <b>Visa Acceptance Solutions</b> (500k+ customers, 160+ countries), a brand-agnostic gateway — so Visa earns gateway fees <b>even on non-Visa transactions.</b>' },
  { n:'CardinalCommerce', y:'2016', deal:'undisclosed', own:'Private', cat:'Authentication',
    detail:'<b>What it added:</b> <b>3-D Secure</b> authentication — the "verify it\'s really you" step on e-commerce checkouts that cuts fraud and chargebacks.<br><br><b>How it shows up today:</b> part of Visa\'s Risk &amp; Security stack; the technology behind smoother, lower-fraud online approvals.' },
  { n:'Visa Europe', y:'2016', deal:'up to €21.2B · cash + stock', own:'Member co-op', cat:'Franchise', big:true,
    detail:'<b>What it added:</b> the one piece of Visa that wasn\'t Visa Inc. — Europe\'s banks had kept their own co-op at the 2008 IPO. This bought it back.<br><br><b>How it shows up today:</b> <b>transformational</b> — Visa now owns the global franchise and Europe\'s full economics. The catch: it also inherited Europe\'s strict <b>interchange caps</b>, which structurally lower European yields.' },
  { n:'Verifi', y:'2019', deal:'undisclosed', own:'Private', cat:'Disputes',
    detail:'<b>What it added:</b> <b>dispute / chargeback resolution</b> — tools that resolve transaction disputes <i>before</i> they become formal chargebacks; also network-agnostic.<br><br><b>How it shows up today:</b> the "post-purchase" piece of Acceptance Solutions; distributed by partners like <b>Stripe</b> to their merchants.' },
  { n:'Earthport', y:'2019', deal:'~£247M · cash', own:'Public', cat:'Cross-border',
    detail:'<b>What it added:</b> a global <b>ACH network</b> reaching bank accounts in 200+ countries — i.e. the ability to pay an <b>account</b>, not just a card.<br><br><b>How it shows up today:</b> the backbone of <b>Visa Direct</b> account payouts — gig pay, insurance disbursements, cross-border remittances. Core to the "New Flows" story.' },
  { n:'YellowPepper', y:'2020', deal:'undisclosed', own:'Private', cat:'Real-time payments',
    detail:'<b>What it added:</b> a Latin-American <b>real-time payments / aliasing</b> platform — letting users send money via a phone number or alias across rails.<br><br><b>How it shows up today:</b> folded into Visa Direct\'s money-movement capabilities, strengthening interoperability in LatAm.' },
  { n:'Plaid', y:'2020', deal:'~$5.3B · cash', own:'Private', cat:'Open banking', term:true,
    detail:'<b>What it would have added:</b> the dominant U.S. <b>open-banking / pay-by-bank data</b> network connecting apps to bank accounts.<br><br><b>What happened:</b> the <b>DOJ sued to block it</b>, arguing Plaid was a nascent competitor to Visa\'s debit business (pay-by-bank threatens card volume). Visa <b>abandoned</b> the deal in 2021 (no break fee) and bought <b>Tink</b> instead.' },
  { n:'Currencycloud', y:'2021', deal:'£700M · cash', own:'Private', cat:'Cross-border FX',
    detail:'<b>What it added:</b> embedded <b>multi-currency / FX</b> APIs — hold, convert and pay out in many currencies, which Visa Direct/B2B needed.<br><br><b>How it shows up today:</b> powers the FX layer of Visa\'s cross-border money-movement products (e.g. multi-currency wallets for SMBs).' },
  { n:'Tink', y:'2022', deal:'€1.8B · cash', own:'Private', cat:'Open banking',
    detail:'<b>What it added:</b> a European <b>open-banking</b> platform — account data + account-to-account payments (13,000+ bank connections, 20 countries).<br><br><b>How it shows up today:</b> Visa\'s open-banking business and the way it offers <b>Visa-branded A2A</b> — the post-Plaid pivot. (Visa later shut the equivalent <i>U.S.</i> open-banking business in 2025.)' },
  { n:'Pismo', y:'2024', deal:'~$1.0B · cash', own:'Private', cat:'Core banking',
    detail:'<b>What it added:</b> a <b>cloud-native core-banking / issuer-processing</b> platform (~130M accounts) — and one that can process <b>non-Visa</b> networks too.<br><br><b>How it shows up today:</b> lets Visa offer modern issuer processing &amp; core banking as a service (VAS), moving up-stack against FIS/Fiserv and expanding geographically.' },
  { n:'Featurespace', y:'2024', deal:'undisclosed', own:'Private', cat:'AI fraud',
    detail:'<b>What it added:</b> <b>ARIC</b> — adaptive, real-time <b>behavioral fraud detection</b> (the model learns each user\'s normal pattern), incl. fraud <i>beyond cards</i> and <i>upstream</i> (account-opening, scams).<br><br><b>How it shows up today:</b> being integrated into <b>Visa Protect</b> as a single decisioning platform across the payments value chain — sold network-agnostically.' },
];

// ─── Open vs closed loop + share classes + litigation/escrow ─────────────────
var OPENCLOSED = [
  { k:'open', l:'Open-loop (Visa, Mastercard)', pts:[
    'The network sits <b>between many banks</b> — it connects thousands of issuers to thousands of acquirers but has <b>no direct relationship with the cardholder or merchant.</b>',
    'It <b>doesn\'t lend and takes no credit risk</b>; it earns a thin fee per transaction.',
    '<b>Why it\'s powerful:</b> asset-light and infinitely scalable — add a bank, not a customer. The whole banking system distributes the cards for you.',
    '<b>The cost:</b> Visa doesn\'t own the customer or the data depth, and it must <b>pay issuers incentives</b> to choose its rail.' ] },
  { k:'closed', l:'Closed-loop (American Express, Discover)', pts:[
    'The network <b>is</b> the issuer <b>and</b> the acquirer — Amex issues the card to you <i>and</i> signs the merchant directly. It owns <b>both ends + the data.</b>',
    'It <b>lends</b> (earns interest) and can charge merchants <b>higher fees</b> — but takes <b>credit risk.</b>',
    '<b>Why it can be better:</b> richer data, full customer relationship, higher spend per card, and it keeps the interest income a four-party network hands to issuers.',
    '<b>The cost:</b> it must <b>recruit every merchant itself</b> → smaller acceptance footprint, and credit losses hit in a downturn.' ] },
];
var OPENCLOSED_NOTE = 'So it\'s a <b>scale-vs-ownership</b> trade. Visa/MA chose <b>maximum reach with zero credit risk</b> (let the banks own customers and lending). Amex chose to <b>own the affluent customer and the loan book</b> and accept smaller scale. Neither is strictly "better" — they monetize different things, which is why Amex\'s revenue (~$72B incl. lending) dwarfs Visa\'s even though Visa moves ~8× the volume.';

var SHARECLASS = [
  ['Class A', 'Public investors (NYSE: V)', 'Full voting; freely traded; bears <b>no</b> bank-specific liability. The clean public security you actually buy.'],
  ['Class B', 'Former <b>U.S.</b> member banks', 'Non-traded, restricted, ~no vote. Its conversion rate into Class A <b>falls every time Visa funds the litigation escrow</b> — it is the designated backstop for U.S. interchange litigation.'],
  ['Class C', 'Former <b>international</b> member banks', 'Restricted with lock-ups (now expired), then converts 1:1 to Class A. <b>No escrow dilution</b> — no U.S. covered-litigation liability.'],
];
var SHARECLASS_WHY = 'The letters simply map <b>who you were in the old cooperative</b>: U.S. banks → Class B, international banks → Class C, the public → Class A. The U.S. banks were given a <b>separate</b> class on purpose, so that U.S. antitrust liability could be quarantined onto them — which is exactly what the escrow does.';
var ESCROW_INTRO = 'A 20-year-old antitrust lawsuit still moves Visa\'s EPS today. Here is the mechanism, in five links:';
var ESCROW_CHAIN = [
  { t:'The lawsuit — MDL 1720', d:'Since 2005, U.S. merchants have sued Visa, Mastercard &amp; banks for allegedly <b>fixing interchange ("swipe") fees</b> and anti-steering rules. Consolidated as one giant case in Brooklyn federal court.' },
  { t:'Visa books a provision + funds an escrow', d:'It records a litigation <b>provision (a GAAP expense)</b> and deposits <b>cash</b> into a segregated <b>escrow</b> — the Retrospective Responsibility Plan, seeded with $3.0B at the 2008 IPO.' },
  { t:'Class B conversion rate falls', d:'Each deposit <b>automatically lowers the Class B → Class A conversion rate</b> — so the cost lands on the <b>former U.S. member banks (Class B)</b>, not the public.' },
  { t:'Fewer "as-converted" shares', d:'Visa\'s diluted share count includes Class B as-converted. A lower rate → <b>fewer total shares outstanding.</b>' },
  { t:'EPS rises — a bank-funded buyback', d:'Fewer shares → <b>higher EPS.</b> Visa says each deposit has "the same economic effect on EPS as <b>repurchasing Class A stock</b>" — but the <i>banks</i> pay for it.', payoff:true },
];
var ESCROW_WHO = [
  { k:'Class A', v:'Protected', s:'The public. Shielded from U.S. covered litigation.', cls:'safe' },
  { k:'Class B', v:'Pays', s:'Former U.S. banks — bear the cost via permanent dilution.', cls:'pays' },
  { k:'Class C', v:'Protected', s:'Former intl banks — U.S. interchange isn\'t their liability.', cls:'safe' },
];
var ESCROW_MORE = '<b>Why a 2005 case still bites in 2026:</b> the <b>damages</b> class settled for ~$5.5B (approved 2019, upheld 2023) — but the <b>rules/injunctive</b> class is still live: a 2024 deal to cap and cut interchange for ~5 years was <b>rejected by the judge</b> as too weak, and the biggest retailers keep <b>opting out to sue individually.</b> Interchange is the core of how value is shared in the network, so merchants never stop pushing.<br><br><b>Provision vs cash:</b> you see it on both statements — a <b>provision/expense</b> on the income statement, and <b>cash</b> moving into the escrow on the balance sheet (topped up periodically, e.g. several hundred million dollars at a time).<br><br><b>Do the banks ever get out?</b> Class B can only <b>fully convert to Class A and trade once the U.S. covered litigation is finally resolved</b> and the rate is locked — which is why it has dragged ~17 years.<br><br><b>The caveat:</b> only <i>U.S. Covered</i> Litigation is shielded — <b>non-U.S. claims can still hit Class A directly.</b>';

// ─── Peers ───────────────────────────────────────────────────────────────────
var PEER_COLS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'UnionPay'];
var PEER_ROWS = [
  ['Model', 'Open-loop four-party', 'Open-loop four-party', '<b>Closed-loop</b> (lends)', 'Closed-loop* (lends)', 'Domestic near-monopoly'],
  ['FY net revenue', '$40.0B', '$32.8B', '~$72B† (incl. lending)', '~$16B† (incl. lending)', '~$2–3B fees‡ (est.)'],
  ['Payments volume', '~$14T', '~$10.6T', '~$1.7T', '~$0.5T', '~$25T+ (mostly China)'],
  ['Credentials', '~4.9B', '~3.7B', '~145M (affluent)', '~70M', '~9B+ (most in world)'],
  ['Credit risk', 'None', 'None', '<b>Yes</b> — owns loan book', '<b>Yes</b> — owns loan book', 'Borne by member banks'],
  ['Footprint', 'Global (200+ ctys)', 'Global', 'Global · affluent skew', 'U.S.-centric', 'China + acceptance abroad'],
];
var PEER_NOTE = 'The only true global four-party "toll roads" are <b>Visa &amp; Mastercard</b> (thin fee per transaction, no credit risk). <b>* Discover</b> runs its own network <i>and</i> issues/lends — and is being <b>acquired by Capital One</b> (a top-5 U.S. issuer), creating a vertically integrated #4 network (a real competitive shift — see Headwinds). <b>† Amex &amp; Discover revenue includes lending</b> (net interest income), so it isn\'t comparable line-for-line to the networks. <b>‡ UnionPay</b> is the largest network by cards (China; state-linked) but volume is overwhelmingly domestic. <b>Not shown:</b> digital / A2A players — <b>PayPal</b> and government real-time rails (UPI, Pix, FedNow) — that compete for the same flows without being card networks. FY ends differ; figures approximate.';

// ─── Tailwinds / Headwinds (with rationale) ──────────────────────────────────
var TAILWINDS = [
  '<b>Cash → digital still early.</b> ~$23T of consumer spend is still cash/check/ACH. <i>Why it matters:</i> the network is already built, so each converted dollar is near-pure margin — years of high-margin volume growth baked in.',
  '<b>Cross-border travel &amp; e-commerce.</b> International transactions (+13% cc) carry FX + the <b>highest fees</b> of any line, and grew ~20%/yr 2022–24. <i>Why it matters:</i> travel recovery and global online shopping lift Visa\'s <b>most profitable</b> revenue faster than overall volume.',
  '<b>New Flows + VAS expand the TAM.</b> Visa Direct/CMS (~$200T of money movement) and VAS (~$520B, often network-agnostic). <i>Why it matters:</i> growth decouples from mature consumer cards <b>and</b> from Visa\'s own brand share — via "Visa as a Service" Visa can grow even where it doesn\'t own the rail.',
];
var HEADWINDS = [
  '<b>Interchange / regulatory pressure.</b> MDL 1720 rules fights + interchange caps (EU, and proposed U.S. rules). <i>Why it\'s a risk:</i> it compresses the fee pool merchants will accept and can <b>mandate routing</b> — directly capping Visa\'s pricing power.',
  '<b>Real-time A2A rails (UPI, Pix, FedNow).</b> Government-built instant <b>bank-to-bank</b> rails move money with <b>no card and near-zero fee</b>. <i>Why it\'s a risk:</i> they attack Visa\'s best tailwind <b>at the source</b> — in India/Brazil the un-digitized cash is converting to A2A, <b>not</b> to Visa cards, bypassing the network. (Visa\'s answer: ride them via Tink/Visa A2A and sell VAS on top — but the core-rail economics are lower.)',
  '<b>Vertical integration: Capital One + Discover.</b> A top-5 U.S. issuer buying a <b>network</b>. <i>Why it\'s a risk:</i> Cap One can move its own debit (and some credit) volume <b>off Visa onto Discover</b> — Visa loses both the volume <b>and</b> a paying client. (Visa\'s own CEO concedes it makes Discover "a more viable, strong, and competitive platform.")',
  '<b>DOJ debit scrutiny.</b> The DOJ\'s 2024 suit alleges Visa illegally monopolizes U.S. debit via exclusionary deals. <i>Why it\'s a risk:</i> a loss could force more debit-routing competition and structurally lower U.S. debit economics.',
];

var SOURCES = 'Sources: Visa Investor Day 2025 (Feb 20, 2025) transcript &amp; slides, FY2025 results, IR, SEC filings (10-K, RRP / Class B-C exchange prospectuses, escrow 8-Ks), DOJ filings (Plaid, debit), and reputable history sources. Headline KPIs FY2025; strategy/TAM figures are management\'s Investor Day framing (FY2024 baseline); some peer figures are cross-FY approximations; undisclosed deal terms marked.';

// ─── Modal content registry ──────────────────────────────────────────────────
var ROLE_DETAIL = {
  cardholder: { t:'Cardholder', h:'The consumer who pays with a Visa credential. They are the <b>issuer\'s</b> customer — <b>Visa has no direct relationship with them</b> (that\'s the open-loop model). They pay no fee to Visa; the merchant does.' },
  issuer:     { t:'Issuer — the cardholder\'s bank', h:'Issues the card, extends the credit, <b>sets and earns the interchange</b>, takes the <b>credit &amp; fraud risk</b>, and bills the cardholder. It is a Visa <b>client</b> that pays Visa fees — and the party Visa pays <b>incentives</b> to, to keep its volume.' },
  merchant:   { t:'Merchant', h:'The business accepting the card — the <b>acquirer\'s</b> customer. Pays a "merchant discount" = <b>interchange</b> (to the issuer) + <b>network fees</b> (to Visa) + <b>acquirer markup</b>. This is the only party in the chain that pays Visa <i>and</i> the issuer.' },
  acquirer:   { t:'Acquirer — the merchant\'s bank/processor', h:'Onboards merchants, routes their transactions into the network, and settles funds to them. A Visa <b>client</b> that pays Visa fees. (Examples: Chase Merchant Services, Fiserv, Adyen.)' },
  visa:       { t:'Visa / VisaNet — the network', h:'<b>Authorizes, clears and settles</b> between issuer and acquirer. Earns a <b>data-processing fee per transaction</b> + a <b>service fee on volume</b> + cross-border/FX. <b>Does not</b> issue, lend, or earn interchange — and takes no credit risk.' },
};

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+s[0]+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join(''); }
function chartCard(id, title, sub){ return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div><div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div></div>'; }

function html(c){
  var h = '<div class="ov ov-visa" data-brand="V">';

  // 1 — Snapshot + lede
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';

  // 2 — KPIs
  h += '<div class="ov-kpis">' + KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';

  // 3 — Volume taxonomy
  h += sec('Volume Metrics — What\'s What',
    '<table class="ov-table"><thead><tr><th>Metric</th><th>What it is</th><th>Drives</th><th>Use it for</th></tr></thead><tbody>'+
    VOLGLOSSARY.map(function(r){ return '<tr><td class="ov-td-name">'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>'; }).join('')+
    '</tbody></table><div class="ov-callout" style="margin-top:12px">'+VOL_VERDICT+'</div>'
  );

  // 3b — Operating trends (hardcoded charts)
  h += sec('Operating Trends — The Metrics That Drive Revenue',
    '<div class="ov-fynote" style="margin-bottom:14px">'+TS_NOTE+'</div>'+
    '<div class="ov-charts-2">'+
      chartCard('ovcVol', 'Payments (Purchase) Volume', 'US vs International · $/qtr · drives Service revenue') +
      chartCard('ovcTx', 'Processed Transactions', 'US vs International, purchase · billions/qtr · drives Data-processing revenue') +
      chartCard('ovcCred', 'Credentials in Force', 'Credit vs Debit, US vs International · billions') +
      chartCard('ovcGeo', 'International Volume by Region', 'Latest disclosed quarter · $B · where cross-border yield lives') +
    '</div>'
  );

  // 4 — How Visa makes money + revenue engine + interactive flow
  h += sec('How Visa Makes Money',
    bullets(HOW_MONEY) +
    '<div class="ov-subh" style="margin-top:18px">The revenue engine</div>'+ rows(REVENUE) +
    '<div class="ov-diagram" style="margin-top:16px">'+FOURPARTY_SVG+'<div class="ov-diagram-cap">The <b>four-party (open-loop) model</b>. Tap any box for its role. Then press <b>Play</b> below to follow a single $100 purchase and see who earns at each step.</div></div>'+
    flowHtml()
  );

  // 4b — Client incentives (the gross-to-net bridge)
  h += sec('Client Incentives — The Gross-to-Net Bridge',
    '<p class="ov-lede" style="margin-bottom:14px">'+CI_INTRO+'</p>'+
    '<div class="ov-subh">The lifecycle — how one deal becomes a multi-year revenue drag</div>'+
    '<div class="ov-chain">'+CI_CHAIN.map(function(s,i){ return '<div class="ov-chain-step'+(i===CI_CHAIN.length-1?' is-payoff':'')+'"><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+'</div><div class="ov-chain-d">'+s.d+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-bottom:12px">'+CI_BS+'</div>'+
    '<div class="ov-callout" style="margin-bottom:16px">'+CI_EXCEPTION+'</div>'+
    '<div class="ov-subh">The three flavors</div>'+
    '<div class="ov-cards">'+CI_TYPES.map(function(v){
      return '<div class="ov-card ov-clickable" data-detail="ci:'+esc(v.k)+'"><div class="ov-card-h"><span class="ov-card-n">'+esc(v.n)+'</span></div><div class="ov-card-s">'+esc(v.sub)+'</div><div class="ov-more">How it\'s booked ›</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-subh" style="margin-top:18px">Why an analyst should care</div>'+ rows(CI_WHY)
  );

  // 5 — What is VisaNet
  h += sec('What Exactly Is VisaNet?', '<div class="ov-callout">'+bullets(VISANET)+'</div>');

  // 6 — Origins + dilution (sequence + thesis/reality)
  h += sec('Origins — A Bank-Owned Cooperative',
    '<div class="ov-callout">'+ORIGINS+'</div>'+
    '<div class="ov-subh" style="margin-top:16px">What happened to the banks\' ownership — in sequence</div>'+
    '<div class="ov-seq">'+DIL_SEQ.map(function(s,i){ return '<div class="ov-seq-step"><div class="ov-seq-n">'+(i+1)+'</div><div class="ov-seq-t">'+esc(s.t)+'</div><div class="ov-seq-d">'+s.d+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-vs">'+
      '<div class="ov-vs-box is-claim"><div class="ov-vs-h">The bear thesis</div><p>'+DIL_VS.claim+'</p></div>'+
      '<div class="ov-vs-box is-real"><div class="ov-vs-h">What actually happened</div><p>'+DIL_VS.real+'</p></div>'+
    '</div>'
  );

  // 7 — History (interactive timeline — tap a milestone for the full story)
  h += sec('History & Milestones',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">A 67-year arc from a bank co-op to a public network — <b>tap any milestone</b> for the full story.</div>'+
    '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
      return '<div class="ov-tl-item is-click" data-detail="hist:'+i+'"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body"><div class="ov-tl-head">'+t.head+'</div><div class="ov-tl-more">Full story ›</div></div></div>';
    }).join('')+'</div>');

  // 8 — Investor Day 2025 strategy
  h += sec('The Strategy — Investor Day 2025',
    '<p class="ov-lede" style="margin-bottom:14px">'+STRATEGY_INTRO+'</p>'+
    '<div class="ov-targets ov-targets-3">'+PILLARS.map(function(p){
      return '<div class="ov-target ov-clickable" data-detail="pillar:'+esc(p.l)+'"><div class="ov-target-v">'+esc(p.tam)+'</div><div class="ov-target-l">'+p.l+'</div><div class="ov-target-s">'+p.s+'</div><div class="ov-more">Tap for the strategy ›</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-subh" style="margin-top:18px">The four strategic actions</div>'+ rows(ACTIONS) +
    '<div class="ov-callout" style="margin-top:14px">'+VAAS_NOTE+'</div>'+
    '<div class="ov-subh" style="margin-top:16px">The financial framework</div>'+
    '<div class="ov-callout">'+FRAMEWORK_NOTE+'</div>'
  );

  // 9 — VAS (clickable cards)
  h += sec('Value-Added Services — The Four Portfolios',
    '<div class="ov-fynote" style="margin-bottom:14px">'+VAS_SCALE+'</div>'+
    '<div class="ov-cards">'+VAS.map(function(v){
      return '<div class="ov-card ov-clickable" data-detail="vas:'+esc(v.k)+'">'+
        '<div class="ov-card-h"><span class="ov-card-n">'+esc(v.n)+'</span>'+(v.tag?'<span class="ov-chip">'+esc(v.tag)+'</span>':'')+'</div>'+
        '<div class="ov-card-s">'+esc(v.sub)+'</div><div class="ov-more">What is it? ›</div></div>';
    }).join('')+'</div>'
  );

  // 10 — M&A (clickable cards)
  h += sec('M&A — What Each Deal Actually Added',
    '<div class="ov-cards ov-cards-mna">'+MNA.map(function(m){
      var status = m.term ? '<span class="ov-chip ov-chip-neg">Terminated</span>' : '<span class="ov-chip">'+esc(m.cat)+'</span>';
      return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
        '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span>'+status+'</div>'+
        '<div class="ov-card-s">'+esc(m.y)+' · '+esc(m.deal)+'</div><div class="ov-more">What it added ›</div></div>';
    }).join('')+'</div>'
  );

  // 11 — Open vs closed loop
  h += sec('Open-Loop vs Closed-Loop — Why Amex Is Different',
    '<div class="ov-grid2">'+OPENCLOSED.map(function(o){
      return '<div class="ov-loop ov-loop-'+o.k+'"><div class="ov-loop-h">'+esc(o.l)+'</div>'+bullets(o.pts)+'</div>';
    }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:14px">'+OPENCLOSED_NOTE+'</div>'
  );

  // 12 — Share classes + litigation/escrow
  h += sec('Shareholder Structure, Litigation Escrow & EPS',
    '<table class="ov-table"><thead><tr><th>Class</th><th>Held by</th><th>Key features</th></tr></thead><tbody>'+
    SHARECLASS.map(function(s){ return '<tr><td class="ov-td-name">'+esc(s[0])+'</td><td>'+s[1]+'</td><td>'+s[2]+'</td></tr>'; }).join('')+
    '</tbody></table>'+
    '<div class="ov-row" style="border-bottom:none;grid-template-columns:1fr"><div class="ov-row-v" style="padding-top:10px">'+SHARECLASS_WHY+'</div></div>'+
    '<div class="ov-subh">The litigation escrow — how it works</div>'+
    '<p class="ov-lede" style="margin-bottom:12px">'+ESCROW_INTRO+'</p>'+
    '<div class="ov-chain">'+ESCROW_CHAIN.map(function(s,i){ return '<div class="ov-chain-step'+(s.payoff?' is-payoff':'')+'"><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+'</div><div class="ov-chain-d">'+s.d+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-subh">Who pays, who\'s protected</div>'+
    '<div class="ov-who">'+ESCROW_WHO.map(function(w){ return '<div class="ov-who-box '+w.cls+'"><div class="ov-who-k">'+esc(w.k)+'</div><div class="ov-who-v">'+esc(w.v)+'</div><div class="ov-who-s">'+w.s+'</div></div>'; }).join('')+'</div>'+
    '<div style="margin-top:12px"><span class="ov-more" data-detail="escrow:more" style="display:inline-block">Why it persists &amp; the fine print ›</span></div>'
  );

  // 13 — Peers
  h += sec('Peers — Side by Side',
    '<table class="ov-table ov-cmp"><thead><tr><th>Dimension</th><th>'+PEER_COLS.map(esc).join('</th><th>')+'</th></tr></thead><tbody>'+
    PEER_ROWS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td>'+r.slice(1).map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table><div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>'
  );

  // 14 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds — And Why',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 15 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  // Modal scaffold (hidden until a trigger is tapped)
  h += '<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';

  h += '</div>';
  return h;
}

// Transaction-flow animation markup
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

// ─── Interactivity ───────────────────────────────────────────────────────────
function init(c){
  var root = document.querySelector('.ov-visa');
  if (!root) return;

  // Modal -------------------------------------------------------------------
  var back = root.querySelector('#ovModalBack');
  var mT = root.querySelector('#ovModalT');
  var mB = root.querySelector('#ovModalB');
  function openModal(title, bodyHtml){
    mT.innerHTML = title; mB.innerHTML = bodyHtml;
    back.hidden = false; requestAnimationFrame(function(){ back.classList.add('on'); });
    document.addEventListener('keydown', onEsc);
  }
  function closeModal(){
    back.classList.remove('on');
    document.removeEventListener('keydown', onEsc);
    setTimeout(function(){ back.hidden = true; }, 180);
  }
  function onEsc(e){ if (e.key === 'Escape') closeModal(); }
  root.querySelector('#ovModalX').onclick = closeModal;
  back.onclick = function(e){ if (e.target === back) closeModal(); };

  // Resolve a data-detail key into {t, h}
  function resolve(key){
    var parts = key.split(':'); var kind = parts[0], id = parts.slice(1).join(':');
    if (kind === 'role'){ var r = ROLE_DETAIL[id]; return r && { t:r.t, h:r.h }; }
    if (kind === 'mna'){ var m = MNA.filter(function(x){return x.n===id;})[0]; return m && { t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>', h:m.detail }; }
    if (kind === 'vas'){ var v = VAS.filter(function(x){return x.k===id;})[0]; return v && { t:v.n, h:v.detail }; }
    if (kind === 'ci'){ var ci = CI_TYPES.filter(function(x){return x.k===id;})[0]; return ci && { t:ci.n+' <span class="ov-modal-sub">client incentive</span>', h:ci.detail }; }
    if (kind === 'pillar'){ var p = PILLARS.filter(function(x){return x.l===id;})[0]; return p && { t:p.l+' <span class="ov-modal-sub">'+esc(p.tam)+' opportunity</span>', h:p.detail }; }
    if (kind === 'hist'){ var t = TIMELINE[parseInt(id,10)]; return t && { t:t.y, h:t.detail }; }
    if (kind === 'escrow'){ return { t:'Litigation escrow — the fine print', h:ESCROW_MORE }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(){
      var d = resolve(el.getAttribute('data-detail'));
      if (d) openModal(d.t, d.h);
    });
  });

  // Flow animation ----------------------------------------------------------
  var flow = root.querySelector('#ovFlow');
  if (flow){
    var idx = 0, timer = null;
    var nodes = flow.querySelectorAll('.ov-flow-node');
    var stepEl = flow.querySelector('#ovFlowStep');
    var capEl = flow.querySelector('#ovFlowCap');
    var earnEl = flow.querySelector('#ovFlowEarn');
    var dots = flow.querySelectorAll('.ov-flow-dot');
    var playBtn = flow.querySelector('#ovFlowPlay');

    function apply(i){
      idx = i;
      var s = FLOW_STEPS[i];
      nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node')) !== -1); });
      stepEl.textContent = s.t;
      capEl.innerHTML = s.cap;
      if (s.earn){ earnEl.hidden = false; earnEl.className = 'ov-flow-earn earn-'+s.earnType; earnEl.innerHTML = s.earn; }
      else { earnEl.hidden = true; }
      dots.forEach(function(d, di){ d.classList.toggle('on', di === i); });
    }
    function stop(){ if (timer){ clearInterval(timer); timer = null; } playBtn.textContent = '▶ Play'; }
    function play(){
      if (timer){ stop(); return; }
      if (idx >= FLOW_STEPS.length - 1) apply(0);
      playBtn.textContent = '❚❚ Pause';
      timer = setInterval(function(){
        if (idx >= FLOW_STEPS.length - 1){ stop(); return; }
        apply(idx + 1);
      }, 2600);
    }
    playBtn.onclick = play;
    flow.querySelector('#ovFlowPrev').onclick = function(){ stop(); apply(Math.max(0, idx - 1)); };
    flow.querySelector('#ovFlowNext').onclick = function(){ stop(); apply(Math.min(FLOW_STEPS.length - 1, idx + 1)); };
    dots.forEach(function(d){ d.onclick = function(){ stop(); apply(parseInt(d.getAttribute('data-i'), 10)); }; });
    apply(0);
  }

  // Operating-trends charts (Chart.js, loaded globally from CDN) -------------
  if (typeof window !== 'undefined' && window.Chart){
    var L = TS_LABELS.slice().reverse();
    var rev = function(a){ return a.slice().reverse(); };
    var toB  = function(a){ return rev(a).map(function(v){ return v/1000; }); };           // $M→$B or M→B
    var toBN = function(a){ return rev(a).map(function(v){ return v ? v/1000 : null; }); }; // 0 → null (not disclosed)
    function mk(id, cfg){ var cv = root.querySelector('#'+id); if (!cv) return; var ex = window.Chart.getChart && window.Chart.getChart(cv); if (ex) ex.destroy(); new window.Chart(cv, cfg); }
    var fmtDollar = function(v){ return v >= 1000 ? '$'+(v/1000).toFixed(2)+'T' : '$'+Math.round(v)+'B'; };
    var fmtTx = function(v){ return (Math.round(v*10)/10)+'B'; };
    var fmtCrd = function(v){ return (v==null?'n/d':(Math.round(v*100)/100)+'B'); };
    function lineCfg(datasets, yfmt, stacked){
      return { type:'line', data:{ labels:L, datasets:datasets },
        options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
          plugins:{ legend:{position:'bottom', labels:{boxWidth:9, font:{size:9.5}, padding:8}},
            tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+yfmt(c.parsed.y); } } } },
          scales:{ x:{ stacked:!!stacked, ticks:{autoSkip:true, maxTicksLimit:8, font:{size:8.5}}, grid:{display:false} },
            y:{ stacked:!!stacked, ticks:{font:{size:8.5}, callback:function(v){ return yfmt(v); }}, grid:{color:'#EEF0F4'} } } } };
    }
    var navy='#1A1F71', gold='#F7B600';
    mk('ovcVol', lineCfg([
      {label:'International', data:toB(TS_VOL_INTL), borderColor:gold, backgroundColor:'rgba(247,182,0,.08)', borderWidth:2, fill:true, pointRadius:0, tension:.25},
      {label:'United States', data:toB(TS_VOL_US), borderColor:navy, backgroundColor:'rgba(26,31,113,.06)', borderWidth:2, fill:true, pointRadius:0, tension:.25},
    ], fmtDollar, false));
    mk('ovcTx', lineCfg([
      {label:'International', data:toB(TS_TX_INTL), borderColor:gold, backgroundColor:'rgba(247,182,0,.08)', borderWidth:2, fill:true, pointRadius:0, tension:.25},
      {label:'United States', data:toB(TS_TX_US), borderColor:navy, backgroundColor:'rgba(26,31,113,.06)', borderWidth:2, fill:true, pointRadius:0, tension:.25},
    ], fmtTx, false));
    mk('ovcCred', lineCfg([
      {label:'Intl debit', data:toBN(TS_CRD_IND), borderColor:gold, backgroundColor:'rgba(247,182,0,.45)', borderWidth:1, fill:true, pointRadius:0, tension:.2},
      {label:'Intl credit', data:toBN(TS_CRD_INC), borderColor:'#B8860B', backgroundColor:'rgba(184,134,11,.5)', borderWidth:1, fill:true, pointRadius:0, tension:.2},
      {label:'US debit', data:toBN(TS_CRD_USD), borderColor:'#5B63B0', backgroundColor:'rgba(91,99,176,.5)', borderWidth:1, fill:true, pointRadius:0, tension:.2},
      {label:'US credit', data:toBN(TS_CRD_USC), borderColor:navy, backgroundColor:'rgba(26,31,113,.55)', borderWidth:1, fill:true, pointRadius:0, tension:.2},
    ], fmtCrd, true));
    mk('ovcGeo', { type:'doughnut',
      data:{ labels:TS_GEO.labels, datasets:[{ data:TS_GEO.data, backgroundColor:[navy,'#2E6BD6','#19A06B',gold,'#8A93A0'], borderColor:'#fff', borderWidth:1 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'56%',
        plugins:{ legend:{position:'right', labels:{boxWidth:10, font:{size:10}, padding:7}},
          tooltip:{ callbacks:{ label:function(c){ var t=c.dataset.data.reduce(function(a,b){return a+b;},0); return c.label+': $'+c.parsed+'B ('+Math.round(c.parsed/t*100)+'%)'; } } } } } });
  }
}

export var visaOverview = { html: html, init: init };
