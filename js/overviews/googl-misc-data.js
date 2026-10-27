// googl-misc-data.js — data for Alphabet Deep Dive ▸ Miscellaneous ▸ Capex & Depreciation (MISC-capex; playbook §15b).
// Reported figures and filing / call text only, plus the Summit model's depreciation, FROZEN from snapshot 2026-08-06
// (rule 10 — the same snapshot Results draws). Capex and revenue are read from js/results-data/googl.js, not here.
// Filings read on SEC EDGAR Oct 27 2026: Form 10-K FY2023 (filed Jan 31 2024), FY2024 (Feb 5 2025), FY2025 (Feb 5 2026);
// Form 10-Q 1Q26 (Apr 30 2026) and 2Q26 (Jul 23 2026). US$ billions unless stated.

// Depreciation of property and equipment, US$ M — the cash-flow line (XBRL Depreciation; Alphabet reports no separate
// amortization line in operating cash flow). Quarters = differences of the year-to-date 10-Q figures.
// Forecast: Summit DNA, snapshot 2026-08-06 (frozen, not live); 2026 = reported 1Q–2Q + the model's 3Q–4Q.
export var GOOGL_DEPR = {
  act: { '2021': 10273, '2022': 13475, '2023': 11946, '2024': 15311, '2025': 21136 },
  summit: { '2026': 31635, '2027': 51816, '2028': 79597 },
  q: { '1Q23': 2635, '2Q23': 2824, '3Q23': 3171, '4Q23': 3316, '1Q24': 3413, '2Q24': 3708, '3Q24': 3985, '4Q24': 4205,
       '1Q25': 4487, '2Q25': 4998, '3Q25': 5611, '4Q25': 6040, '1Q26': 6482, '2Q26': 7104 }
};
// Why 2023 dips — 10-K FY2023, "Change in Accounting Estimate".
export var GOOGL_LIFE_NOTE = 'In January 2023 Alphabet lengthened the useful life of its servers from four to six years (certain network equipment from five to six), which cut 2023 depreciation by $3.9B and raised net income by $3.0B (10-K FY2023) — the dip in the line.';

// Capex guidance as Alphabet gave it, every revision — CFO remarks in docs/calls/GOOGL.md and GOOGL-latest.md
// (verbatim for 4Q24 onward; FY2024 from the structured call records).
export var GOOGL_CAPEX_GUIDE = [
  ['Jan 2024 (4Q23 call)', 'FY2024', '“notably larger than 2023”', 'No number. FY2023 capex was $32.3B.'],
  ['Jul 2024 (2Q24 call)', 'FY2024', 'At or above ~$12B a quarter', 'A quarterly floor, not a full-year range.'],
  ['Oct 2024 (3Q24 call)', 'FY2024', 'Q4 similar to Q3 ($13B)', 'FY2024 landed at $52.5B.'],
  ['Feb 2025 (4Q24 call)', 'FY2025', '~$75B', 'First full-year number; $16–18B in the first quarter.'],
  ['Apr 2025 (1Q25 call)', 'FY2025', '~$75B', 'Reaffirmed; may fluctuate with delivery and construction timing.'],
  ['Jul 2025 (2Q25 call)', 'FY2025', '~$85B', 'Raised: Cloud demand, more servers, server delivery timing and a faster data-center pace.'],
  ['Oct 2025 (3Q25 call)', 'FY2025', '$91–93B', 'Raised; “a significant increase” flagged for 2026. FY2025 landed at $91.4B.'],
  ['Feb 2026 (4Q25 call)', 'FY2026', '$175–185B', 'First FY2026 range, ramping through the year: compute for Google DeepMind, Cloud demand, the core business.'],
  ['Apr 2026 (1Q26 call)', 'FY2026', '$180–190B', 'Raised to include the Intersect acquisition; 2027 capex to “significantly increase” vs 2026.'],
  ['Jul 2026 (2Q26 call)', 'FY2026', '$195–205B', 'Raised: “an acceleration in the delivery of capacity to meet growing demand”. 2027 still to increase significantly, details later.']
];

// Commitments outside the capex line, at each balance-sheet date (MD&A "Purchase Commitments and Other Contractual
// Obligations", Note 4 Leases, Note 3 Derivatives, Note 10 Commitments and Contingencies).
export var GOOGL_COMMIT = {
  dates: ['Dec 31 2024', 'Dec 31 2025', 'Mar 31 2026', 'Jun 30 2026'],
  src:   ['10-K FY2024', '10-K FY2025', '10-Q 1Q26', '10-Q 2Q26'],
  purchase:      [55.4, 149.1, 332.4, 811.0],     // purchase commitments and other contractual obligations
  purchaseShort: [32.5, 113.0, 138.0, 200.7],     // of which short-term
  leasesNotCommenced: [7.27, 58.5, 75.6, 85.2],   // leases signed, not yet commenced (Dec 2024 = $0.773B + $6.5B; Dec 2025 = $5.8B + $52.7B)
  creditBackstops: [0, 16.94, 28.44, 43.79],      // credit-derivative notional: backstops of third-party data-center leases
  guarantees: [null, 5.7, 9.0, 7.6],              // financial guarantees: backstops for energy-equipment procurement
  backstopsAgreed: [null, null, 33.3, 24.1]       // further backstops agreed, terms not final ("up to" at Mar 2026; "estimated" at Jun 2026)
};
// What the purchase commitments are, in Alphabet's words, at each date.
export var GOOGL_COMMIT_WHAT = [
  ['Dec 31 2024', '“primarily consist of purchase orders for certain technical infrastructure as well as the non-cancelable portion or the minimum cancellation fee in certain agreements related to commitments to purchase licenses, including content licenses, inventory, and network capacity”', '10-K FY2024'],
  ['Dec 31 2025', '“primarily related to energy take-or-pay contracts, licenses (including content licenses), and technical infrastructure and inventory orders” — $113.0B short-term, “mostly related to technical infrastructure and inventory orders”', '10-K FY2025'],
  ['Jun 30 2026', '“primarily relate to costs for technical infrastructure and inventory through long-term supply agreements and open purchase orders”. Note 10: $707.0B of fixed or guaranteed commitments, “the significant majority of which related to long-term supply agreements”, generally fulfilled through 2030; energy agreements run to 2054.', '10-Q 2Q26']
];
// Signed at or after the balance-sheet date, outside the figures above.
export var GOOGL_COMMIT_AFTER = [
  ['January 2026', 'A power purchase agreement expected to be accounted for as a lease: $9.9B of payments between 2027 and 2047 (or a one-time ~$3.5B payment and ownership of the generating assets if conditions are not met)', '10-K FY2025'],
  ['April 2026', 'A backstop of about $15.3B for a data-center provider, drawn against the $33.3B agreed in 1Q26', '10-Q 1Q26'],
  ['June 2026', 'A short-term lease with a non-cancelable commitment of about $5.8B, commencing in the third quarter of 2026', '10-Q 2Q26']
];
// How the backstops work — 10-Q 2Q26, Note 3 and MD&A.
export var GOOGL_BACKSTOP_NOTE = 'A backstop is Alphabet promising to pay a third party’s data-center lease (or energy-equipment order) if that party defaults. The notional is the maximum it could pay; terms run up to 15 years and shrink as the underlying parties pay. On a default Alphabet can take over the leases for its own use or sublease them, and after a set period it can end a backstop with a termination payment (10-Q 2Q26, Note 3).';

// Property and equipment, net (Note 7), US$ M.
export var GOOGL_PPE = {
  cols: ['Dec 31 2024', 'Dec 31 2025', 'Mar 31 2026', 'Jun 30 2026'],
  rows: [
    ['Technical infrastructure', 141852, 203679, 217886, 247177],
    ['Office space', 45403, 48348, 48772, 50635],
    ['Corporate and other assets', 12574, 14463, 5945, 6498]
  ],
  inService: [199829, 266490, 272603, 304310],
  accum: [-79390, -98485, -100180, -105912],
  notInService: [50597, 78592, 108597, 122814],
  net: [171036, 246597, 281020, 321212],
  note: 'About 60% of technical infrastructure is servers and network equipment; the rest is data-center land, buildings and related assets (10-K FY2025, 10-Q 2Q26). Servers and network equipment depreciate over generally six years, data-center and office buildings over seven to 40 years, land not at all. “Assets not yet in service” — data-center buildings and servers still being built or assembled — do not depreciate until they are ready for use.'
};

// Leases already on the balance sheet (Note 4), US$ M.
export var GOOGL_LEASES = {
  cols: ['Dec 31 2024', 'Dec 31 2025', 'Jun 30 2026'],
  opLiab: [14578, 15954, 18037], finLiab: [1677, 2500, 2590],
  opPay: [17038, 18251, 21333], finPay: [1888, 2869, 2920],
  mat: { years: ['Rest of 2026', '2027', '2028', '2029', '2030', 'Thereafter', 'Total'],
         op: [1836, 3498, 2979, 2576, 2046, 8398, 21333], fin: [206, 387, 377, 356, 285, 1309, 2920] }
};

// Intersect — 10-K FY2025 (pending acquisitions) and 10-Q 2Q26 (Note 8). SAB, Oct 26 2026: it lives here, not in the Timeline.
export var GOOGL_INTERSECT = [
  ['Agreed', 'December 2025: $4.8B in cash plus the assumption of debt.'],
  ['Closed', 'March 10 2026, for $5.9B after purchase-price adjustments.'],
  ['What it is', 'A developer of renewable energy (the 10-K: “data center and energy infrastructure solutions”). The acquisition “enables acceleration of data center capacity and energy development”.'],
  ['What was bought (US$ M)', 'Property and equipment 5,129 · goodwill 2,174 (split between Google Services and Google Cloud) · debt (1,214) · net liabilities (221) = 5,868.'],
  ['Where it shows up', 'Consolidated from close, allocated to the segments. The FY2026 capex guide was raised from $175–185B to $180–190B “to now include investment related to the acquisition of Intersect” (1Q26 call).']
];

// How the build is being funded (balance sheets, cash-flow and equity statements; Note 6 Debt).
export var GOOGL_FUNDING = {
  cols: ['Dec 31 2024', 'Dec 31 2025', 'Mar 31 2026', 'Jun 30 2026'],
  ltDebt: [10.88, 46.55, 77.50, 98.17],
  cash: [95.66, 126.84, 126.84, 242.47]   // cash, cash equivalents and marketable securities
};
export var GOOGL_FUNDING_ROWS = [
  ['1Q26 notes', '$20.0B of US-dollar notes (weighted coupon 4.80%, ~15-year average maturity), £5.5B (5.31%, ~31 years) and CHF3.1B (1.06%, ~10 years).', '10-Q 1Q26, Note 6'],
  ['1H26 notes, total', '$20.0B US-dollar and $31.8B foreign-currency fixed-rate senior notes, “for general corporate purposes”.', '10-Q 2Q26, MD&A'],
  ['2Q26 equity', 'Common stock issued $30.4B; 6.25% mandatory convertible preferred stock (Series A and B) $19.0B, less $1.0B of capped calls bought alongside.', '10-Q 2Q26, statement of stockholders’ equity'],
  ['Buybacks', '$62.2B in 2024 and $45.7B in 2025; none in the first half of 2026.', '10-K FY2025; 10-Q 2Q26 (cash-flow statement)']
];

// ── Capacity → revenue (MISC-capacity; playbook §15b) ───────────────────────
// The chain, link by link: [link, measure, latest value, source, status]. Alphabet publishes capex, backlog and Cloud
// revenue; it publishes no capacity figure (MW, GW, TPU count), so the chain breaks at link 2. Quotes checked against
// Alphabet's official IR transcripts (4Q25, 1Q26, 2Q26) and the 10-K/10-Q.
export var GOOGL_CHAIN = [
  ['1 · Capex', 'Purchases of property and equipment', '$91.4B in FY2025; $195–205B guided for FY2026. About 60% of technical-infrastructure capex goes to servers and 40% to data centers and networking; for 2026 “just over half of our ML compute is expected to go towards the Cloud business”', '10-K FY2025; 4Q25 and 2Q26 calls', 'Reported'],
  ['2 · Capacity', 'Data-center and compute capacity (MW, GW, TPUs)', 'Not published. Closest proxy: assets not yet in service, $50.6B (Dec 2024) → $122.8B (Jun 2026). Supply-constrained in every call since 4Q24 (“we exited the year with more demand than we had available capacity”); third-party capacity added in 3Q26 “as a bridging strategy”', '10-Q 2Q26 (Note 7); 4Q24 and 2Q26 calls', 'Not disclosed — the chain breaks here'],
  ['3 · Usage', 'Tokens processed by the model APIs', '7B tokens a minute (3Q25) → 10B (4Q25) → 16B (1Q26) → about 22B (2Q26). Across all surfaces: 480 trillion a month (May 2025) → 980 trillion (Jul 2025) → over 1.3 quadrillion (Oct 2025)', '2Q25–2Q26 calls', 'Reported, point figures — no formal series'],
  ['4 · Contracted demand', 'Revenue backlog (remaining performance obligations)', '$519.5B at Jun 30 2026, of which $513.9B Google Cloud; “just over 50%” to be recognized in the next 24 months. Includes TPU system sales, the vast majority of which will be revenue in 2027', '10-Q 2Q26 (Note 2); 2Q26 call', 'Reported, quarterly'],
  ['5 · Revenue', 'Google Cloud revenue', '$24.8B in 2Q26, +82% year on year; TPU system sales recognized for the first time', '10-Q 2Q26; 2Q26 call', 'Reported, quarterly']
];
export var GOOGL_BACKLOG_NOTE = 'Backlog is company-wide (Note 2); Google Cloud’s share is disclosed only in recent quarters ($513.9B of $519.5B at Jun 30 2026). Alphabet gives the conversion only as “just over 50%” within 24 months, not year by year, and the backlog grows each quarter with new contracts — so the figure below is a floor from contracts already signed, not a forecast.';

// Data-center directory — Google’s own list (datacenters.google/locations), read Oct 27 2026. Google states the
// location and whether it is in development; it publishes no capacity (MW), investment or opening year per site, and
// “locations listed below may have more than one data center site in the region”. [country, location, status]
export var GOOGL_DC_SRC = 'Google data centers, all locations (datacenters.google/locations), read Oct 27 2026';
export var GOOGL_DC = (function(){
  var D = 'In development', O = 'Operating', out = [];
  function add(country, list){ list.forEach(function(r){ out.push([country, r[0], r[1] ? D : O]); }); }
  add('United States', [['Armstrong County, Texas',1],['Berkeley County, South Carolina'],['Cedar Rapids, Iowa',1],['Chesterfield County, Virginia',1],
    ['Columbia County, Georgia',1],['Columbus, Ohio'],['Council Bluffs, Iowa'],['The Dalles, Oregon'],['Dorchester County, South Carolina',1],['Douglas County, Georgia'],
    ['Fort Wayne, Indiana'],['Haskell County, Texas',1],['Henderson, Nevada'],['Hermantown, Minnesota',1],['Jackson County, Alabama'],['Kansas City, Missouri',1],
    ['LaGrange, Georgia',1],['Lancaster, Ohio'],['Lenoir, North Carolina'],['Lincoln, Nebraska'],['Loudoun County, Virginia'],['The Lowcountry, South Carolina'],
    ['Mesa, Arizona'],['Michigan City, Indiana',1],['Midlothian, Texas'],['Montgomery County, Tennessee'],['Morgan County, Indiana',1],['Muskogee County, Oklahoma',1],
    ['New Albany, Ohio'],['New Florence, Missouri',1],['Omaha, Nebraska'],['Pampa, Texas',1],['Papillion, Nebraska'],['Pine Island, Minnesota',1],
    ['Prince William County, Virginia'],['Pryor, Mayes County, Oklahoma'],['Red Oak, Texas'],['Stillwater, Oklahoma',1],['Storey County, Nevada'],['Tulsa, Oklahoma',1],
    ['Van Buren Township, Michigan',1],['West Memphis, Arkansas',1],['Wilbarger County, Texas',1]]);
  add('Netherlands', [['Eemshaven'],['Groningen',1],['Middenmeer'],['Winschoten']]);
  add('Finland', [['Hamina'],['Muhos',1],['Vaala',1]]);
  add('Belgium', [['Farciennes',1],['St. Ghislain']]);
  add('Germany', [['Dietzenbach',1],['Hanau']]);
  add('Austria', [['Kronstorf',1]]);
  add('Denmark', [['Fredericia']]);
  add('Ireland', [['Dublin']]);
  add('Norway', [['Skien',1]]);
  add('Sweden', [['Horndal',1]]);
  add('United Kingdom', [['Waltham Cross']]);
  add('India', [['Andhra Pradesh',1]]);
  add('Japan', [['Inzai']]);
  add('Malaysia', [['Selangor',1]]);
  add('Singapore', [['Singapore']]);
  add('Taiwan', [['Changhua County']]);
  add('Thailand', [['Chonburi',1]]);
  add('Chile', [['Quilicura']]);
  add('Uruguay', [['Canelones']]);
  return out;
})();

// ── Strategy (MISC-strategy; Dani #40, formal layout as META) ────────────────
// The loop Alphabet calls its "full stack" approach, every figure from the official IR transcripts (4Q25, 1Q26, 2Q26)
// or the 10-K/10-Q. Dropped from Dani's version for lack of a primary source: "three Nobels in two years", "15 products
// with 500M+ users", "funded ~2/3 by cash, ~1/3 by debt". No emoji, no scoring.
export var GOOGL_LOOP = [
  ['Own the silicon', 'Its own TPUs — the eighth generation (TPU 8t for training, 8i for inference) introduced at Cloud Next 2026 — alongside the latest NVIDIA GPUs: “the industry’s widest variety of compute options”. Since 2Q26 the TPUs are also sold outright.'],
  ['Lead the research', 'Google DeepMind builds the Gemini models: Gemini 3.5 Pro in testing and “our most ambitious pre-training run yet for Gemini 4” (2Q26 call).'],
  ['Ship to billions', 'The models go into products already at scale: AI Mode in Search passed one billion monthly users, and the Gemini app has 950 million (2Q26 call).'],
  ['Earn four ways', 'Advertising (Search, YouTube), Cloud consumption and seats, 350 million paid subscriptions (1Q26 call), and now TPU system sales.'],
  ['Reinvest', '$195–205B of capex guided for FY2026, up from $91.4B in FY2025; “just over half” of the ML compute goes to Cloud in 2026 (4Q25 call).']
];
// What Dani called "broaden the box": revenue lines that did not exist two years ago, plus Waymo. [bet, what it is, why it matters]
export var GOOGL_BETS = [
  ['Consumer AI subscriptions', 'Paid Gemini plans sold through Google One, alongside YouTube Premium and Music. Paid subscriptions went from over 325 million (4Q25) to 350 million (1Q26); 1Q26 was “our strongest quarter ever for our consumer AI plans”.', 'Revenue from the consumer that does not depend on an ad auction.'],
  ['TPU system sales', 'TPU systems delivered to customers’ own data centers for the first time in 2Q26; the agreements sit in the Cloud backlog and “the vast majority” of their revenue is expected in 2027.', 'Turns the in-house chip into a product, at a hardware margin (inventory costs rose in other cost of revenues, 2Q26).'],
  ['Agentic commerce', 'The Universal Commerce Protocol (UCP), an open standard launched in January 2026 for AI agents to shop and check out. Amazon, Meta, Microsoft, Salesforce and Stripe joined its Tech Council (1Q26); Target and Steve Madden are live (2Q26).', 'Keeps Google in the purchase when the search becomes an agent.'],
  ['Waymo', 'Raised its largest investment round to date in February 2026 (a $2.1B stock-based compensation charge on the higher valuation, 4Q25 call); more than 500,000 fully autonomous rides a week across 11 US cities (1Q26 call); Ojai, the first vehicle on the sixth-generation Waymo Driver, open to riders (2Q26).', 'Grows on outside capital; reported in Other Bets, which lost $3.6B in 4Q25 including that charge.']
];

// ── TAM (MISC-tam; Dani #15–16) ──────────────────────────────────────────────
// SAB, Oct 27 2026: third-party sizes only with a named source and date; the new frontiers carry no size (no primary
// third-party estimate found); no Gartner; Dani's unsourced "~$700B digital" / "$700B+ cloud" and the "one-line TAM
// thesis" callout dropped. Read Oct 27 2026. [measure, size, source]
export var GOOGL_TAM_ADS_SRC = 'WPP Media, This Year Next Year — Global Midyear Forecast, June 16 2026';
export var GOOGL_TAM_ADS = [
  ['Global advertising revenue, 2026', '$1.3T, +8.9% (excluding US political; raised from +7.1% in December 2025)', GOOGL_TAM_ADS_SRC],
  ['Search — traditional and generative, 2026', '21.8% of the total, about $283B (derived: 21.8% × $1.3T)', GOOGL_TAM_ADS_SRC],
  ['Generative search, 2026 → 2030', '$5.1B in 2026, over $100B by 2030', GOOGL_TAM_ADS_SRC],
  ['Alphabet, Meta and Amazon together', '57.6% of the market excluding China', GOOGL_TAM_ADS_SRC]
];
export var GOOGL_TAM_CLOUD_SRC = 'Synergy Research Group, “Q2 Cloud Market Passes $143 Billion; Highest Growth Rate in Eight Years”, July 30 2026';
export var GOOGL_TAM_CLOUD = [
  ['Cloud infrastructure services, 2Q26', '$143.4B, +43% year on year (the highest growth in eight years)', GOOGL_TAM_CLOUD_SRC],
  ['Trailing twelve months', '$500B', GOOGL_TAM_CLOUD_SRC],
  ['Market share, 2Q26', 'Amazon 28% · Microsoft 20% · Google 15%', GOOGL_TAM_CLOUD_SRC],
  ['GenAI-specific cloud services', '+165% year on year', GOOGL_TAM_CLOUD_SRC]
];
// The new frontiers — what Alphabet reports, no market size. [line, what Alphabet reports, source]
export var GOOGL_TAM_FRONTIER = [
  ['Consumer AI subscriptions', '350 million paid subscriptions across consumer services (YouTube and Google One the key drivers)', '1Q26 call'],
  ['TPU system sales', 'First delivered to customers’ data centers in 2Q26; the agreements sit in the $513.9B Cloud backlog, “the vast majority” of their revenue in 2027', '10-Q 2Q26; 2Q26 call'],
  ['Autonomous mobility (Waymo)', 'More than 500,000 fully autonomous rides a week, 11 US cities', '1Q26 call']
];
export var GOOGL_TAM_DEF = 'The sizes are not on Alphabet’s basis. WPP Media counts advertising revenue earned by media owners, excluding US political, and includes every other media owner; Alphabet reports advertising revenue gross of traffic-acquisition costs. Synergy’s cloud market is IaaS, PaaS and hosted private cloud; Google Cloud also includes Workspace and, since 2026, TPU system sales. Read the rows side by side, not as a share.';
