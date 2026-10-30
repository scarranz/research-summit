// meta-misc-data.js — data for Meta Deep Dive ▸ Miscellaneous (MISC-capex, MISC-strategy, MISC-manda,
// MISC-capacity; playbook §15b). Reported figures and filing / call text only, plus the Summit model's D&A,
// FROZEN from snapshot 2026-10-22 (rule 10; refreshed 2026-10-30, was 2026-08-04). Capex and revenue are read from js/results-data/meta.js, not here.

// Depreciation and amortization, US$ M — reported: 10-K cash-flow statements (XBRL
// DepreciationDepletionAndAmortization); forecast: Summit DNA, snapshot 2026-10-22 (frozen, not live).
export var META_DNA = {
  act: { '2021': 7967, '2022': 8686, '2023': 11178, '2024': 15498, '2025': 18616 },
  summit: { '2026': 28886, '2027': 44941, '2028': 63971 },
  src: 'Meta Form 10-K (cash-flow statements, SEC EDGAR XBRL); Summit DCF model, snapshot 2026-10-22 (frozen, not live)'
};

// Capex guidance as Meta gave it, every revision — CFO remarks in docs/calls/META.md (verbatim); 2Q26 from
// docs/calls/META-latest.md, which is reconstructed from press.
export var META_CAPEX_GUIDE = [
  ['Feb 2024 (4Q23 call)', 'FY2024', '$30–37B', 'High end raised by $2B.'],
  ['Apr 2024 (1Q24 call)', 'FY2024', '$35–40B', 'Raised, to accelerate infrastructure investment.'],
  ['Jul 2024 (2Q24 call)', 'FY2024', '$37–40B', 'Low end raised; significant capex growth expected in 2025.'],
  ['Oct 2024 (3Q24 call)', 'FY2024', '$38–40B', 'Narrowed. FY2024 landed at $39.2B.'],
  ['Jan 2025 (4Q24 call)', 'FY2025', '$60–65B', 'First FY2025 range: generative AI and the core business.'],
  ['Apr 2025 (1Q25 call)', 'FY2025', '$64–72B', 'Raised: more data centers for AI and higher infrastructure hardware costs.'],
  ['Jul 2025 (2Q25 call)', 'FY2025', '$66–72B', 'Narrowed; about $30B more than 2024 at the midpoint.'],
  ['Oct 2025 (3Q25 call)', 'FY2025', '$70–72B', 'Raised. FY2025 landed at $72.2B.'],
  ['Jan 2026 (4Q25 call)', 'FY2026', '$115–135B', 'First FY2026 range: Meta Superintelligence Labs and the core business.'],
  ['Apr 2026 (1Q26 call)', 'FY2026', '$125–145B', 'Raised: higher component pricing and, to a lesser extent, data-center costs for future years.'],
  ['Jul 2026 (2Q26 print)', 'FY2026', '$130–145B', 'Low end raised; 1H26 capex was $50.9B (transcript reconstructed from press).']
];

// The Summit analytical split of 2026 cloud commitments (an estimate, not a company disclosure — kept from the
// earlier profile and labelled as such).
export var META_CLOUD_SPLIT = [
  ['Cost of revenue — inference serving', '42%', '~$17.8B'],
  ['Research and development — model training', '29%', '~$12.1B'],
  ['Capex-adjacent — servers and data centers', '29%', '~$12.3B']
];

// Efficiency levers — what management has said (calls) or reported elsewhere (labelled).
export var META_EFFIC = [
  ['Custom silicon', 'More than 1 GW of Meta’s own custom silicon, developed with Broadcom, rolling out alongside AMD and Nvidia systems; Meta Compute aims to lead the industry in efficiency of building compute.', 'Q1 2026 call (Zuckerberg)'],
  ['Several chip vendors', 'Inference spread across Nvidia, AMD and in-house MTIA chips to lower cost per inference.', 'Earlier profile; press reports'],
  ['Headcount', 'A headcount reduction in May 2026, with about $1.2B of severance charged in 2Q26.', '2Q26 earnings release'],
  ['Operating leverage', 'Family of Apps earns a 52% segment margin (FY2025), so incremental ad revenue largely drops through.', 'Form 10-K FY2025, Note 15']
];

// Strategy — the loop and the bets (Meta 10-K Item 1, calls). No emoji, no scoring.
export var META_LOOP = [
  ['Engage', 'Reels, AI-recommended content and Threads increase time spent, which creates more ad inventory.'],
  ['Rank', 'AI ranking and ads models (GEM, Advantage+) turn that inventory into revenue: more relevant ads at a higher price.'],
  ['Earn', 'The Family of Apps keeps nearly the whole ad dollar at a 52% segment margin (FY2025).'],
  ['Build', 'The cash funds AI infrastructure, frontier models and AI glasses — the bid for the next platform.']
];
export var META_BETS = [
  ['Agentic advertising', 'Advantage+ moving from AI-assisted to automated campaigns: the business sets a goal and budget, Meta’s AI handles targeting, bidding and creative.', 'The clearest path from AI spend to ad revenue.'],
  ['Business messaging', 'Click-to-message ads and paid messaging on WhatsApp and Messenger; business AIs answering customers.', 'Part of other revenue, which grew 50% in FY2025.'],
  ['Superintelligence', 'Meta Superintelligence Labs, frontier models and the AI infrastructure build (Scale AI investment, June 2025).', 'The largest spend and the least proven return.'],
  ['AI glasses', 'Ray-Ban Meta, Oakley Meta and Meta Ray-Ban Display; about 70% of 2026 Reality Labs operating expenses go to wearables (10-K).', 'Glasses sales more than tripled in 2025 (Q4 2025 call); daily users tripled year over year (Q1 2026 call).']
];

// M&A — deal values are widely reported approximations unless the filing gives one.
export var META_DEALS = [
  ['2012', 'Instagram', '~$1B', 'Franchise', 'Now one of Meta’s two main ad surfaces (Feed, Stories, Reels).'],
  ['2014', 'WhatsApp', '~$19B', 'Franchise', 'Global messaging; the base for business messaging and click-to-message ads.'],
  ['2014', 'Oculus', '~$2B', 'Platform bet', 'The origin of Reality Labs.'],
  ['2019', 'CTRL-labs', '~$0.5–1B', 'Platform bet', 'Neural-interface wristband technology — the input for AI and AR glasses (Neural Band).'],
  ['2021', 'Kustomer', '~$1B', 'Tuck-in, later spun out', 'Customer-service software for business messaging; spun back out in 2023.'],
  ['2022', 'Within (Supernatural)', '~$400M', 'Platform bet', 'VR fitness; the FTC sued to block the deal and lost (2023).'],
  ['2025', 'Scale AI (49% stake)', '~$14.3B', 'Platform bet', 'Brought founder Alexandr Wang in to lead Meta Superintelligence Labs; not a full acquisition.']
];

// Capacity → revenue — the chain, link by link (playbook §15b MISC-capacity). Values with their source; a link
// with no published series says so — that is where the chain breaks.
export var META_CHAIN = [
  ['1 · Capex', 'Capital expenditure (incl. finance-lease principal)', '$72.2B FY2025; $130–145B guided for FY2026', 'Form 10-K FY2025; 2Q26 release', 'Reported'],
  ['2 · Capacity', 'Data-center and compute capacity (gigawatts)', 'More than 1 GW of in-house silicon rolling out (Q1 2026); “tens of gigawatts” this decade (Meta Compute)', 'Q1 2026 call; Q4 2025 call (analyst question)', 'Qualitative — no annual series; the chain breaks here'],
  ['3 · Ad performance', 'Conversion lift from ranking models', 'Adaptive Ranking for offsite conversions: +1.6% conversion rates on the major Facebook surfaces (Q1 2026); latest incremental-attribution model: +24% incremental conversions vs standard attribution (Q4 2025)', 'Q1 2026 and Q4 2025 calls', 'Reported, point figures — no series'],
  ['4 · Price and volume', 'Average price per ad and ad impressions, YoY', 'Price per ad +12% and impressions +14% (2Q26)', 'Meta 8-K (via Bloomberg)', 'Reported, quarterly'],
  ['5 · Revenue', 'Advertising revenue', '$59.4B in 2Q26, +27% YoY', 'Meta 8-K', 'Reported']
];

// Data-center directory — Meta’s own site list (datacenters.atmeta.com/all-locations, read 2026-10-20). Meta states
// the year it broke ground and the investment, never the capacity (MW) or operating status, so neither is shown.
// [country, location, year broke ground, investment as stated (local currency), USD bn if stated in USD else null]
export var META_DC_SRC = 'Meta data centers, all locations (datacenters.atmeta.com), read Oct 20 2026';
export var META_DC = [
  ['United States', 'Prineville, Oregon', '2010', '$2B+', 2],
  ['United States', 'Forest City, North Carolina', '2010', '$750M+', 0.75],
  ['United States', 'Altoona, Iowa', '2013', '$2.5B+', 2.5],
  ['United States', 'Fort Worth, Texas', '2015', '$1.5B+', 1.5],
  ['United States', 'Los Lunas, New Mexico', '2016', '$2.5B+', 2.5],
  ['United States', 'Sarpy, Nebraska', '2017', '$2.5B+', 2.5],
  ['United States', 'New Albany, Ohio', '2017', '$1.5B+', 1.5],
  ['United States', 'Henrico, Virginia', '2017', '$1B+', 1],
  ['United States', 'Huntsville, Alabama', '2018', '$1.5B+', 1.5],
  ['United States', 'Stanton Springs, Georgia', '2018', '$2B+', 2],
  ['United States', 'Eagle Mountain, Utah', '2018', '$3B+', 3],
  ['United States', 'DeKalb, Illinois', '2020', '$1B+', 1],
  ['United States', 'Gallatin, Tennessee', '2020', '$1.5B+', 1.5],
  ['United States', 'Mesa, Arizona', '2021', '$1B+', 1],
  ['United States', 'Kuna, Idaho', '2022', '$1.2B+', 1.2],
  ['United States', 'Kansas City, Missouri', '2022', '$1.2B+', 1.2],
  ['United States', 'Temple, Texas', '2022', '$1.2B', 1.2],
  ['United States', 'Montgomery, Alabama', '2024', '$1.5B+', 1.5],
  ['United States', 'Jeffersonville, Indiana', '2024', '$800M+', 0.8],
  ['United States', 'Richland Parish, Louisiana', '2024', '$50B+', 50],
  ['United States', 'Rosemount, Minnesota', '2024', '$800M+', 0.8],
  ['United States', 'Aiken, South Carolina', '2024', '$800M+', 0.8],
  ['United States', 'Cheyenne, Wyoming', '2024', '$1.2B', 1.2],
  ['United States', 'Bowling Green, Ohio', '2025', '$800M+', 0.8],
  ['United States', 'El Paso, Texas', '2025', '$10B+', 10],
  ['United States', 'Beaver Dam, Wisconsin', '2025', '$1B+', 1],
  ['United States', 'Lebanon, Indiana', '2026', '$10B+', 10],
  ['United States', 'Tulsa, Oklahoma', '2026 (breaking ground)', '$1B+', 1],
  ['Canada', 'Sturgeon County, Alberta', '2026 (breaking ground)', 'CA$13B+', null],
  ['Ireland', 'Clonee', '2016', '€1.4B', null],
  ['Denmark', 'Odense', '2017', 'DKK 10B+', null],
  ['Sweden', 'Luleå', '2011', 'SEK 8.7B+', null],
  ['Singapore', 'Singapore', '2018', 'S$1.4B+', null]
];

// ── Capex & Depreciation, expanded (SAB, Oct 20 2026: the earlier Spend Engine was a deep piece of work) ──────
// Every figure below is copied from Meta’s filings on SEC EDGAR (read 2026-10-20): Form 10-K FY2024 (filed Jan 30
// 2025), Form 10-K FY2025 (filed Jan 29 2026), Form 10-Q 1Q26 (filed Apr 30 2026), Form 10-Q 2Q26 (filed Jul 30 2026).
// US$ billions unless stated.

// Off-balance-sheet commitments over time — notes "Commitments and Contingencies" and "Leases".
export var META_COMMIT = {
  dates: ['Dec 31 2024', 'Dec 31 2025', 'Mar 31 2026', 'Jun 30 2026'],
  src:   ['10-K FY2024', '10-K FY2025', '10-Q 1Q26', '10-Q 2Q26'],
  contractual: [32.82, 131.05, 237.67, 349.31],          // non-cancelable contractual commitments
  leasesNotCommenced: [34.12, 103.77, 182.88, 278.99],   // leases signed, not yet commenced
  contingentCloud: [null, null, 14.72, 14.72],           // contingent obligation to buy cloud capacity over five years
  escrow: [null, null, 5.00, 10.80]                      // money-market funds reclassified as restricted cash
};
export var META_COMMIT_AFTER = [
  ['April 2026', 'Additional multi-year infrastructure contracts: non-cancelable commitments up about $24B', '10-Q 1Q26, subsequent event'],
  ['July 2026', 'Additional data-center leases with obligations of about $68B, commencing 2027–2028, 18–20-year terms', '10-Q 2Q26, subsequent event']
];
// What the commitments were for, in Meta’s words, at each date.
export var META_COMMIT_WHAT = [
  ['Dec 31 2024', '“primarily related to our investments in servers and network infrastructure, and content costs”', '10-K FY2024'],
  ['Dec 31 2025', '“mostly related to third-party cloud capacity arrangements and our continued investments in servers and network infrastructure, data centers, and consumer hardware products in Reality Labs”', '10-K FY2025'],
  ['Jun 30 2026', '“mostly relate to third-party cloud capacity arrangements and investments in servers and network infrastructure, data centers, and consumer hardware products in Reality Labs”', '10-Q 2Q26']
];
// When the contractual commitments fall due (US$ M). Dec 2025 has the full schedule; the 10-Qs give the next two years.
export var META_COMMIT_SCHED = { years: ['2026','2027','2028','2029','2030','Thereafter','Total'],
  dec25: [30634, 22166, 21221, 19761, 19407, 17857, 131046] };
export var META_COMMIT_NEAR = [ ['Mar 31 2026', 42.25, 47.65], ['Jun 30 2026', 53.52, 81.65] ];   // due in 2026, 2027 (US$ B)

// Property and equipment (Note 6), US$ M.
export var META_PPE = {
  cols: ['Dec 31 2024', 'Dec 31 2025', 'Jun 30 2026'],
  rows: [
    ['Servers and network assets', 68397, 98040, 119683],
    ['Buildings', 47076, 55568, 61037],
    ['Construction in progress', 26802, 50521, 80345],
    ['Equipment and other', 7150, 9377, 10209],
    ['Leasehold improvements', 7293, 8346, 8464],
    ['Finance-lease right-of-use assets', 5384, 8187, 9467],
    ['Land', 2561, 3687, 3667]
  ],
  gross: [164663, 233726, 292872], accum: [-43317, -57326, -67148], net: [121346, 176400, 225724],
  capInt: 'Interest capitalized on construction in progress: $384M (2024), $535M (2025).'
};
// Depreciation of property and equipment (Note 6), US$ B: [period, total, of which servers and network assets]
export var META_DEPR = [
  ['FY2023', 11.02, 7.32], ['FY2024', 15.29, 11.34], ['FY2025', 18.00, 13.36],
  ['1Q25', 3.84, 2.63], ['2Q25', 4.28, 3.12], ['1Q26', 5.68, 4.38], ['2Q26', 6.00, 4.62]
];
export var META_DEPR_NOTE = 'Useful lives of most servers and network assets were extended to 5.5 years from January 1 2025, which lowered 2025 depreciation by $2.92B (10-K FY2025, Note 1). Impairments of property and equipment: $738M (2023), $288M (2024), $237M (2025). In March 2026 Meta classified $1.48B of data-center assets, mostly construction in progress and land, as held for sale (10-Q 1Q26).';

// Leases already on the balance sheet (Note 7, 10-K FY2025), US$ M.
export var META_LEASE_COST = { years: ['2023','2024','2025'], rows: [
  ['Finance lease — amortization of right-of-use assets', 349, 387, 549],
  ['Finance lease — interest', 20, 23, 31],
  ['Operating lease cost', 2091, 2359, 2798],
  ['Variable lease cost and other', 580, 844, 1147] ],
  total: [3040, 3613, 4525] };
export var META_LEASE_TERMS = [
  ['Weighted-average remaining term — finance leases', '13.7 years', '15.1 years'],
  ['Weighted-average remaining term — operating leases', '11.5 years', '12.3 years'],
  ['Weighted-average discount rate — finance leases', '3.6%', '4.1%'],
  ['Weighted-average discount rate — operating leases', '3.9%', '4.3%']
];
export var META_LEASE_MAT = { years: ['2026','2027','2028','2029','2030','Thereafter','Total undiscounted','Less: imputed interest','Present value'],
  op: [3211, 3237, 3057, 2985, 2621, 18397, 33508, -8355, 25153], fin: [344, 97, 97, 88, 86, 792, 1504, -320, 1184] };

// The Louisiana data-center Venture — 10-K FY2025 Note 5; 10-Q 1Q26 and 2Q26.
export var META_VENTURE = [
  ['Formed', 'October 2025, to co-develop a data-center campus in Louisiana. Meta holds 20% and does not consolidate it: it is not the primary beneficiary.'],
  ['Development cost', 'About $27B in total, funded pro rata by the partners.'],
  ['At formation', 'Meta contributed $4.30B of held-for-sale assets, net of liabilities, and received a one-time $2.55B distribution.'],
  ['Leases', 'Meta leases the campus from 2029: about $12.31B initial commitment, four-year initial terms, renewable up to 20 years.'],
  ['Residual value guarantee', 'Up to about $28B, decreasing over time. Payable only if Meta does not renew and the property is worth less than the threshold; not probable, so no liability is recorded.'],
  ['Maximum exposure to loss', '$45.95B (Dec 31 2025) → $46.03B (Jun 30 2026): the equity investment, the lease commitments, future funding and the guarantee.'],
  ['Equity carrying value', '$1.83B (Dec 31 2025) → $2.92B (Jun 30 2026).']
];

// Senior notes — the debt raised alongside the build (note "Long-term Debt"), US$ M face amount.
export var META_NOTES = [
  ['August 2022', '2027–2062', '3.50%–4.65%', 10000],
  ['May 2023', '2028–2063', '4.60%–5.75%', 8500],
  ['August 2024', '2029–2064', '4.30%–5.55%', 10500],
  ['November 2025', '2030–2065', '4.20%–5.75%', 30000],
  ['May 2026', '2031–2066', '4.55%–6.45%', 25000]
];
export var META_NOTES_NOTE = 'Face amount $29.0B (Dec 2024) → $59.0B (Dec 2025) → $84.0B (Jun 2026); no financial covenants. Interest expense on the notes, net of capitalized interest: $1.09B in 2025 and $1.29B in 1H26.';

// Third-party cloud deals as reported outside Meta’s filings (vendor filings and press, carried over from the
// earlier profile; Meta does not name its cloud providers or the size of each deal).
export var META_CLOUD_DEALS = [
  ['Google Cloud', '~$10B'], ['Oracle (OCI)', '~$20B'], ['CoreWeave', '~$14B, then ~$21B'], ['Nebius', '~$12B, then ~$9B']
];
