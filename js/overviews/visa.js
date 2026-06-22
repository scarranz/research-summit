// overviews/visa.js — custom Overview for Visa Inc. (NYSE: V)
// Sourced from Visa IR / SEC filings / Investor Day 2025 (see SOURCES).
// Schematic + interactive diagrams; bullet-first. Time-series charts are placeholders (data pending).

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
var DESC = 'Visa operates VisaNet — the rails that authorize, clear and settle electronic payments in 200+ countries. It is a network/technology company: it does not issue cards, lend, or set interchange (those belong to the banks). For most of its life it was a cooperative owned by its member banks; it became Visa Inc. in 2007 and went public in 2008.';

var KPIS = [
  { l:'Net Revenue',           v:'$40.0B', d:'+11% YoY', dir:'up' },
  { l:'Payments Volume',       v:'$14T',   d:'+8% cc',   dir:'up' },
  { l:'Processed Transactions',v:'258B',   d:'+10% YoY', dir:'up' },
  { l:'Value-Added Services',  v:'$10.9B', d:'+24% YoY', dir:'up' },
];
var AS_OF = 'Figures are fiscal year 2025 (ended September 30, 2025). "cc" = constant-dollar.';
var FY_NOTE = 'FY2025: GAAP net income $20.1B ($10.20/sh) · EPS +14% · ~4.9B credentials · cross-border +13% cc · $22.8B returned to shareholders; dividend +14%; new $30B buyback.';

// ─── Volume taxonomy (settles "purchase vs payments vs total volume") ─────────
var VOLGLOSSARY = [
  ['Payments Volume', 'The $ value of <b>goods &amp; services purchased</b> on Visa products (a.k.a. "purchase volume").', 'Service revenue (current-Q pricing × prior-Q payments volume).', 'Core spend metric.'],
  ['Cash Volume', 'ATM withdrawals, balance transfers, convenience checks.', 'Barely monetized.', 'Context only.'],
  ['Total Volume', '<b>Payments + Cash</b> volume.', '"Scale of the business."', 'Headline scale — not a revenue base.'],
  ['Processed Transactions', 'Count of transactions Visa actually <b>routes through VisaNet</b> (any brand).', 'Data-processing revenue.', 'Network activity.'],
];
var VOL_VERDICT = '<b>What to keep:</b> anchor on <b>Payments Volume</b> (the spend that drives service revenue) and <b>Processed Transactions</b> (network activity that drives data-processing revenue). Use <b>Total Volume</b> only as a scale headline — it includes low-monetization cash. Note: <b>processed transactions ≠ Visa-branded transactions</b> (Visa doesn\'t process every Visa-branded transaction, and processes some non-Visa ones), so they won\'t tie out.';

var PLACEHOLDERS = [
  ['Payments Volume', 'quarterly trend'],
  ['Credit vs Debit mix', 'share over time'],
  ['Geographic split', 'US vs International'],
];

// ─── How it makes money + interactive four-party model ───────────────────────
var HOW_MONEY = [
  '<b>Not a bank:</b> Visa does not issue cards, lend, or earn interchange — those belong to the issuing banks.',
  '<b>Four-party model</b> (click each box below): cardholder, issuer, merchant, acquirer — with VisaNet in the middle.',
  'Earns <b>Service</b> (on volume), <b>Data Processing</b> (per transaction) and <b>International / FX</b> (cross-border); client incentives (~$15.8B FY25) net against it.',
];
var FOURPARTY_SVG =
'<svg viewBox="0 0 680 360" role="img" aria-label="Visa four-party model — click a box">' +
  '<defs><marker id="ovar" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker></defs>' +
  '<line x1="200" y1="56" x2="470" y2="56" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#ovar)"/>' +
  '<text x="335" y="44" text-anchor="middle" font-size="10" fill="#8A93A0">buys goods / services</text>' +
  '<line x1="115" y1="86" x2="115" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="565" y1="86" x2="565" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="196" y1="280" x2="262" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="484" y1="280" x2="418" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<g class="ov-fpm-node" data-role="cardholder"><rect x="30" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="61" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Cardholder</text></g>' +
  '<g class="ov-fpm-node" data-role="merchant"><rect x="480" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="61" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Merchant</text></g>' +
  '<g class="ov-fpm-node" data-role="issuer"><rect x="30" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Issuer</text><text x="115" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">cardholder&#8217;s bank</text></g>' +
  '<g class="ov-fpm-node" data-role="acquirer"><rect x="480" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Acquirer</text><text x="565" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">merchant&#8217;s bank</text></g>' +
  '<g class="ov-fpm-node" data-role="visa"><rect x="255" y="150" width="170" height="64" rx="11" fill="var(--brand)" stroke="var(--brand-2)" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">VISA</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#cfd5f0">VisaNet · clearing &amp; settlement</text></g>' +
'</svg>';
var ROLE_LABEL = { cardholder:'Cardholder', issuer:'Issuer (cardholder\'s bank)', merchant:'Merchant', acquirer:'Acquirer (merchant\'s bank)', visa:'Visa / VisaNet' };
var ROLE_INFO = {
  cardholder: 'The consumer who pays with a Visa credential. They are the <b>issuer\'s</b> customer — Visa has no direct relationship with them.',
  issuer: 'The cardholder\'s bank. Issues the card, extends credit, <b>sets and earns interchange</b>, takes the credit risk, and bills the cardholder. A Visa client that pays Visa fees.',
  merchant: 'The business accepting the card — the <b>acquirer\'s</b> customer. Pays a merchant discount = interchange (to issuer) + network fees (to Visa) + acquirer markup.',
  acquirer: 'The merchant\'s bank/processor. Onboards merchants, routes their transactions into the network, and settles funds to them. A Visa client that pays Visa fees.',
  visa: 'The network. <b>VisaNet authorizes, clears and settles</b> between issuer and acquirer. Earns a <b>data-processing fee per transaction</b> + a <b>service fee on volume</b> + cross-border/FX. Does <b>not</b> issue, lend, or earn interchange.',
};

// ─── Origins (the cooperative angle) ─────────────────────────────────────────
var ORIGINS = 'For most of its life Visa was <b>owned by its own customers — the banks</b>, not outside investors. In 1970 Dee Hock turned BankAmericard into <b>National BankAmericard Inc.</b>, a non-stock <b>cooperative owned and governed by member banks</b>. The paradox: after "duality" (mid-1970s) a bank could issue both Visa and Mastercard and route either way — yet because the banks <b>collectively owned Visa and shared its economics</b>, they stayed aligned with it even when they could have favored Mastercard. That member-ownership is the <b>direct origin of today\'s Class A/B/C shares</b>: the 2007 restructuring converted membership interests into stock, and the 2008 IPO floated Class A while banks kept B/C.';

var TIMELINE = [
  ['1958', 'Bank of America launches <b>BankAmericard</b> in Fresno (the "Fresno Drop" — ~65,000 unsolicited cards). Near-fails on fraud and 22% delinquency, then scales.'],
  ['1970', 'Under <b>Dee Hock</b>, banks form <b>National BankAmericard Inc. (NBI)</b> — a bank-owned cooperative; BofA gives up control.'],
  ['1971–75', '"Anti-duality" fight: courts and the DOJ force Visa to let banks issue both brands ("<b>duality</b>").'],
  ['1974–76', 'IBANCO runs the international program; global rebrand to <b>VISA</b> (NBI → Visa U.S.A., IBANCO → Visa International).'],
  ['1977–83', 'Builds electronic authorization + clearing/settlement (BASE I/II) as a member-owned utility.'],
  ['1980s–2000s', 'Operates ~30 years as an association of <b>13,000+ member banks</b>, governed regionally.'],
  ['Oct 2007', '<b>Restructuring:</b> Visa U.S.A./International/Canada combine into <b>Visa Inc.</b>, a Delaware stock company (Visa Europe stays an association). Membership becomes stock.'],
  ['Mar 2008', '<b>IPO:</b> 406M Class A shares at $44 → <b>$17.9B</b>, the largest U.S. IPO at the time; >$10B of proceeds buy back member-bank shares.'],
  ['2008', 'Litigation escrow seeded with <b>$3.0B</b> from IPO proceeds (the Retrospective Responsibility Plan).'],
  ['2016', 'Acquires <b>Visa Europe</b> (up to €21.2B) — reunifies the franchise globally.'],
  ['2019–24', 'Builds the "network of networks": Earthport, Verifi, Currencycloud, Tink, Pismo, Featurespace (after the DOJ-blocked Plaid deal).'],
  ['Feb 2025', '<b>Investor Day 2025</b> — three-pillar strategy + the ~$41T / ~$200T / ~$520B opportunity stack.'],
];

// ─── The opportunity (Investor Day 2025) ─────────────────────────────────────
var TAM = [
  { v:'~$41T', l:'Consumer Payments', s:'~$23T still in cash / check / ACH / A2A — the un-digitized core to convert.' },
  { v:'~$200T', l:'New Flows', s:'B2B, P2P, B2C, G2C money movement; only ~$1.7T penetrated today.' },
  { v:'~$520B', l:'Value-Added Services', s:'Annual revenue opportunity vs. ~$10.9B captured (~2%).' },
];
var OPPORTUNITY = [
  ['Consumer Payments', 'Convert the ~$23T still off-network via <b>Tap to Pay</b>, network <b>tokens</b>, the <b>Flexible Credential</b> (one credential toggling debit/credit/BNPL/A2A), and emerging-market acceptance.'],
  ['New Flows', '<b>Visa Direct</b> pushes funds to cards, accounts and wallets via the OCT primitive (now one API via Visa Direct Connect); <b>B2B Connect</b> settles high-value cross-border bank-to-bank, bypassing correspondent banking.'],
  ['Value-Added Services', 'Sell network, risk, issuing and advisory solutions to a far broader customer set ("unbundling the Visa stack") — see the VAS section.'],
];
var FRAMEWORK_NOTE = 'Financial framework: lift <b>New Flows + VAS to ~50% of revenue</b> (from ~30%), sustaining durable double-digit revenue and high-teens EPS growth.';

// ─── VAS vs competitors ──────────────────────────────────────────────────────
var VAS_CMP = [
  ['Issuing (largest)', 'Card-program processing via <b>DPS</b> (major U.S. debit processor) + <b>Pismo</b> (cloud core-banking).', 'More vertically integrated than Mastercard; real rivals are FIS / Fiserv / TSYS — Visa pushing up-stack.'],
  ['Acceptance (smallest)', '<b>Cybersource</b> gateway (160+ countries, brand-agnostic) + Authorize.net (SMB).', 'Most exposed to fintechs — competes with Stripe / Adyen / Braintree more than Mastercard.'],
  ['Risk &amp; Identity (Visa Protect)', 'AI authorization scoring, 3-DS, <b>Featurespace</b>/ARIC; network-agnostic.', 'Mastercard\'s security stack is broader (Ekata, RiskRecon, <b>Recorded Future</b>) — a cyber ambition beyond the rail; Visa is focused on "approve more, lose less".'],
  ['Open Banking', '<b>Tink</b> (Europe-centric).', 'Visa <b>shut its U.S. open-banking business in 2025</b>; Mastercard\'s Finicity (US) + Aiia (EU) has aged better.'],
  ['Advisory', '<b>Visa Consulting &amp; Analytics</b> (1,000+ consultants) + new AI practice.', 'Closely matched with Mastercard Advisors / Data &amp; Services.'],
];
var VAS_SCALE = 'VAS is ~$10.9B (FY25, +24%, ~27% of revenue). Mastercard\'s "Value-Added Services &amp; Solutions" is ~$13.3B (~41% of its revenue) — it pivoted earlier and harder; Visa is growing faster off a slightly smaller base.';

// ─── M&A (condensed) ─────────────────────────────────────────────────────────
var MNA = [
  { n:'CyberSource', y:'2010', deal:'~$2.0B · cash', own:'Public', adds:'<b>Acceptance:</b> online gateway — moved Visa into merchant acceptance/processing.' },
  { n:'Visa Europe', y:'2016', deal:'up to €21.2B · cash + stock', own:'Member co-op', adds:'<b>Transformational:</b> reunified the global franchise; full ownership of European economics.' },
  { n:'Earthport', y:'2019', deal:'~£247M · cash', own:'Public', adds:'<b>Cross-border:</b> independent ACH network (200+ countries) — core of Visa Direct.' },
  { n:'Plaid', y:'2020', deal:'~$5.3B · cash', own:'Private', term:true, adds:'<b>Open banking:</b> pay-by-bank data rails — blocked by DOJ, abandoned (no break fee).' },
  { n:'Currencycloud', y:'2021', deal:'£700M · cash', own:'Private', adds:'<b>Cross-border FX:</b> embedded multi-currency APIs for New Flows.' },
  { n:'Tink', y:'2022', deal:'€1.8B · cash', own:'Private', adds:'<b>Open banking:</b> European platform (3,400+ banks) — the post-Plaid pivot.' },
  { n:'Pismo', y:'2024', deal:'~$1.0B · cash', own:'Private', adds:'<b>Core banking:</b> cloud issuer-processing; supports non-Visa rails too.' },
  { n:'Featurespace', y:'2024', deal:'undisclosed', own:'Private', adds:'<b>AI fraud:</b> real-time behavioral detection (ARIC) for Risk &amp; Identity.' },
];

// ─── Share classes + litigation escrow ───────────────────────────────────────
var SHARECLASS = [
  ['Class A', 'Public investors (NYSE: V)', 'Full voting; freely traded; bears <b>no</b> bank-specific liability. The clean public security.'],
  ['Class B', 'Former <b>U.S.</b> member banks', 'Non-traded, restricted, ~no vote. As-converted ratio <b>falls as Visa funds the litigation escrow</b> — it is the backstop for U.S. interchange litigation.'],
  ['Class C', 'Former <b>international</b> member banks', 'Restricted with lockups, then converts to Class A. <b>No escrow dilution</b> (no U.S. covered-litigation liability).'],
];
var SHARECLASS_WHY = 'The letters map onto <b>who you were in the old cooperative</b>: U.S. banks → Class B, international banks → Class C, the public → Class A. The U.S. banks got a <b>separate</b> class specifically so U.S. antitrust liability could be quarantined onto them (next).';
var SHARECLASS_SVG =
'<svg viewBox="0 0 680 250" role="img" aria-label="Visa share-class structure">' +
  '<defs><marker id="ovar2" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker>' +
  '<marker id="ovar3" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#C79100"/></marker></defs>' +
  '<line x1="150" y1="176" x2="272" y2="82" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#ovar2)"/>' +
  '<text x="183" y="122" text-anchor="middle" font-size="9.5" fill="#8A93A0" transform="rotate(-38 183 122)">converts</text>' +
  '<line x1="530" y1="176" x2="408" y2="82" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#ovar2)"/>' +
  '<text x="497" y="122" text-anchor="middle" font-size="9.5" fill="#8A93A0" transform="rotate(38 497 122)">converts</text>' +
  '<line x1="318" y1="180" x2="246" y2="146" stroke="#C79100" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ovar3)"/>' +
  '<rect x="240" y="22" width="200" height="58" rx="11" fill="var(--brand)" stroke="var(--brand-2)" stroke-width="2.5"/>' +
  '<text x="340" y="46" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">Class A</text>' +
  '<text x="340" y="64" text-anchor="middle" font-size="9.5" fill="#cfd5f0">public · NYSE: V</text>' +
  '<rect x="34" y="176" width="186" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/>' +
  '<text x="127" y="200" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Class B</text>' +
  '<text x="127" y="217" text-anchor="middle" font-size="9.5" fill="#8A93A0">U.S. banks</text>' +
  '<rect x="460" y="176" width="186" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/>' +
  '<text x="553" y="200" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Class C</text>' +
  '<text x="553" y="217" text-anchor="middle" font-size="9.5" fill="#8A93A0">intl banks</text>' +
  '<rect x="280" y="176" width="120" height="56" rx="10" fill="#FEF6E0" stroke="var(--brand-2)"/>' +
  '<text x="340" y="199" text-anchor="middle" font-size="11" font-weight="600" fill="#8A6A00">Litigation</text>' +
  '<text x="340" y="215" text-anchor="middle" font-size="11" font-weight="600" fill="#8A6A00">escrow</text>' +
'</svg>';
var SHARECLASS_CAP = 'Class B (U.S. banks) and Class C (intl banks) convert into public <b>Class A</b>. Funding the <b>litigation escrow</b> (gold) lowers the Class B conversion rate — diluting Class B, not Class A.';
var ESCROW = [
  '<b>What it is:</b> the <b>Retrospective Responsibility Plan</b> ring-fences pre-IPO U.S. antitrust liability ("U.S. Covered Litigation") onto the former member banks. Seeded with $3.0B from IPO proceeds (2008); topped up over time (e.g. $500M Sep 2025, $500M Dec 2025, $125M Feb 2026).',
  '<b>The litigation:</b> the merchant interchange antitrust case (MDL 1720) — a ~$5.5B damages-class settlement (final 2019, upheld 2023), plus ongoing rules-relief and opt-out claims.',
  '<b>The mechanic:</b> each escrow deposit <b>automatically lowers the Class B → Class A conversion rate</b> (each Class B share converts into fewer Class A shares). Class C is untouched.',
  '<b>The EPS link:</b> Visa\'s diluted EPS uses an <b>as-converted</b> share count that includes Class B (+C). A lower Class B rate → fewer as-converted shares → <b>lower diluted share count → higher EPS</b>. Visa states each deposit has "<b>the same economic effect on EPS as repurchasing Class A stock</b>."',
  '<b>The punchline:</b> the banks (Class B) bear the U.S. litigation cost via permanent dilution — it acts like a <b>bank-funded buyback</b> that shields <b>Class A (the IPO/public shareholders)</b> and Class C. <i>Caveat:</i> only U.S. Covered Litigation is shielded; non-U.S. claims can hit Class A directly.',
];

// ─── Peers (vivid side-by-side) ──────────────────────────────────────────────
var PEER_COLS = ['Visa', 'Mastercard', 'American Express'];
var PEER_ROWS = [
  ['Network model', 'Open-loop four-party', 'Open-loop four-party', '<b>Closed-loop</b> (issuer + acquirer + network)'],
  ['FY net revenue', '$40.0B', '$32.8B', '$72.2B (incl. lending)'],
  ['Payments volume', '~$14T (~$17T w/ cash)', '~$10.6T', '~$1.7T'],
  ['Transactions', '~258B processed', '~175B+ switched', 'spend-per-card model'],
  ['Credentials', '~4.9B', '~3.7B', '~153M (fewer, higher-spend)'],
  ['VAS revenue', '~$10.9B (~27%)', '~$13.3B (~41%)', 'no standalone VAS'],
  ['Credit risk', 'None', 'None', '<b>Yes</b> — owns the loan book (~$17B net interest income)'],
];
var PEER_NOTE = 'Visa & Mastercard are asset-light "toll roads" (a small fee per transaction, no credit risk) — Visa is larger, Mastercard is more international and more services-heavy as a %. <b>Amex is not comparable line-for-line</b>: it owns the customer and the loan book and monetizes affluent spenders, so ~a quarter of its revenue is net interest income. FY ends differ (V: Sep; MA/AXP: Dec) — figures approximate.';

var TAILWINDS = [
  'Cash → digital still early: ~$23T of consumer spend off-network.',
  'Cross-border travel & e-commerce — high-margin international revenue (+13% cc).',
  'New Flows + VAS expand the TAM far beyond consumer cards.',
];
var HEADWINDS = [
  'Interchange / regulatory pressure and merchant antitrust litigation.',
  'DOJ scrutiny of debit & network practices.',
  'Real-time / A2A rails (UPI, Pix, FedNow) and vertical integration (Capital One + Discover).',
];

var SOURCES = 'Sources: Visa Investor Day 2025 (Feb 20, 2025), FY2025 results, IR, SEC filings (10-K, RRP/Class B-C exchange prospectuses, escrow 8-Ks), and reputable history sources. FY2025 unless noted; some TAM/peer figures are management framing or cross-FY approximations; undisclosed deal terms marked.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function diagram(svg, cap){ return '<div class="ov-diagram">'+svg+'<div class="ov-diagram-cap">'+cap+'</div></div>'; }
function statBox(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }
function rows(arr){ return arr.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+s[0]+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join(''); }

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

  // 4 — Time-series placeholders
  h += sec('Operating Trends (time series — data pending)',
    '<div class="ov-phs">'+PLACEHOLDERS.map(function(p){
      return '<div class="ov-ph"><div class="ov-ph-ic">📈</div><div class="ov-ph-t">'+esc(p[0])+'</div><div class="ov-ph-s">'+esc(p[1])+' · chart placeholder</div></div>';
    }).join('')+'</div>'
  );

  // 5 — How Visa makes money + interactive diagram
  h += sec('How Visa Makes Money',
    bullets(HOW_MONEY) +
    '<div class="ov-diagram">'+FOURPARTY_SVG+'<div class="ov-fpm-detail" id="ovFpmDetail">Click a box above to see each party\'s role and where Visa earns.</div></div>'
  );

  // 6 — Origins
  h += sec('Origins — A Bank-Owned Cooperative', '<div class="ov-callout">'+ORIGINS+'</div>');

  // 7 — History
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 8 — The opportunity (Investor Day 2025)
  h += sec('The Opportunity — Investor Day 2025',
    '<div class="ov-targets ov-targets-3">'+TAM.map(statBox).join('')+'</div>'+
    '<div class="ov-subh" style="margin-top:16px">How Visa captures it</div>'+rows(OPPORTUNITY)+
    '<div class="ov-callout" style="margin-top:12px">'+FRAMEWORK_NOTE+'</div>'
  );

  // 9 — VAS vs competitors
  h += sec('Value-Added Services vs Competitors',
    '<div class="ov-fynote" style="margin-bottom:14px">'+VAS_SCALE+'</div>'+
    '<table class="ov-table"><thead><tr><th>VAS line</th><th>What Visa offers</th><th>vs Mastercard / rivals</th></tr></thead><tbody>'+
    VAS_CMP.map(function(r){ return '<tr><td class="ov-td-name">'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'; }).join('')+
    '</tbody></table>'
  );

  // 10 — M&A
  h += sec('M&A Activity',
    '<table class="ov-table"><thead><tr><th>Target</th><th>Year</th><th>Deal</th><th>Status</th><th>What it added</th></tr></thead><tbody>'+
    MNA.map(function(m){ var st = m.term ? '<span style="color:var(--neg);font-weight:600">Terminated</span>' : esc(m.own);
      return '<tr><td class="ov-td-name">'+esc(m.n)+'</td><td>'+esc(m.y)+'</td><td>'+esc(m.deal)+'</td><td>'+st+'</td><td>'+m.adds+'</td></tr>'; }).join('')+
    '</tbody></table>'
  );

  // 11 — Share classes + escrow
  h += sec('Shareholder Structure, Litigation Escrow & EPS',
    '<table class="ov-table"><thead><tr><th>Class</th><th>Held by</th><th>Key features</th></tr></thead><tbody>'+
    SHARECLASS.map(function(s){ return '<tr><td class="ov-td-name">'+esc(s[0])+'</td><td>'+s[1]+'</td><td>'+s[2]+'</td></tr>'; }).join('')+
    '</tbody></table>'+
    '<div class="ov-row" style="border-bottom:none;grid-template-columns:1fr"><div class="ov-row-v" style="padding-top:10px">'+SHARECLASS_WHY+'</div></div>'+
    diagram(SHARECLASS_SVG, SHARECLASS_CAP)+
    '<div class="ov-subh">The litigation escrow & its EPS effect</div>'+
    '<div class="ov-callout">'+bullets(ESCROW)+'</div>'
  );

  // 12 — Peers (side-by-side)
  h += sec('Peers — Side by Side',
    '<table class="ov-table ov-cmp"><thead><tr><th>Dimension</th><th>'+PEER_COLS.map(esc).join('</th><th>')+'</th></tr></thead><tbody>'+
    PEER_ROWS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>'; }).join('')+
    '</tbody></table><div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>'
  );

  // 13 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 14 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  h += '</div>';
  return h;
}

// Interactive four-party diagram: clicking a box shows that party's role.
function init(c){
  var detail = document.getElementById('ovFpmDetail');
  var nodes = document.querySelectorAll('.ov-visa .ov-fpm-node');
  if (!detail || !nodes.length) return;
  nodes.forEach(function(n){
    n.onclick = function(){
      var role = n.getAttribute('data-role');
      nodes.forEach(function(x){ x.classList.remove('on'); });
      n.classList.add('on');
      detail.innerHTML = '<b>'+esc(ROLE_LABEL[role])+'</b> — '+ROLE_INFO[role];
    };
  });
}

export var visaOverview = { html: html, init: init };
