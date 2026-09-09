// overviews/sharkninja-data.js — narrative & reference data for SharkNinja, Inc. (NYSE: SN).
// Sourced from the FY2025 10-K (filed for FY ended Dec 31, 2025), SharkNinja IR press
// releases, and public reporting on the Jul 2023 spin-off from JS Global Lifestyle. See
// SN_OV_SOURCES for the full citation list. No data here is Fiscal.ai/Summit-DCF derived —
// neither exists yet for this ticker (see docs/COMPANY_PROFILE_BLUEPRINT.md §6 step 1).

// Brand accent — an estimate (SharkNinja's teal) pending the official press-kit hex.
export var SN_BRAND = '#0E7C86';
export var SN_BRAND_SOFT = '#E7F3F4';

// Semantic colors reused from the shared palette conventions (not company-specific).
export var C_POS = '#16A34A';
export var C_NEG = '#DC2626';
export var C_MU2 = '#64748B'; // "analyst-seeded" peer dot

// ─── Key Facts — exactly 10, 5x2 ───────────────────────────────────────────────
export var SN_FACTS = [
  ['Listing', 'NYSE: SN'],
  ['HQ', 'Needham, Massachusetts, USA'],
  ['Country of incorporation', 'Cayman Islands'],
  ['SEC filer', 'Domestic (10-K / 10-Q / 8-K)'],
  ['Founded', '1994 (as Euro-Pro, by Mark Rosenzweig)'],
  ['Listed', 'Jul 31, 2023 — spin-off from JS Global Lifestyle'],
  ['CEO', 'Mark Barrocas · since 2023 (joined 2008)'],
  ['Employees', '~4,143 · as of Dec 2025'],
  ['Dividend', 'Non-payer (runs a share-repurchase program instead)'],
  ['Market cap', 'live'],
];

export var SN_LEDE = 'SharkNinja is a global product design and technology company that designs, manufactures and markets small household appliances under two brands — Shark, focused on home cleaning, and Ninja, focused on cooking, food preparation and beverages. Products are sold through big-box and specialty retail, e-commerce and direct-to-consumer channels across roughly 40 countries.';

// ─── 4-quadrant ─────────────────────────────────────────────────────────────────
export var SN_QUAD = [
  ['What it sells', 'Small household appliances across <b>36 sub-categories</b> in four groups — Cleaning, Cooking &amp; Beverage, Food Preparation, and Other (Home Environment &amp; Beauty) — under the <b>Shark</b> and <b>Ninja</b> brands.'],
  ['Who buys it', 'Consumer households, reached through <b>big-box &amp; mass retail</b> (Walmart, Target, Amazon), specialty retail, and a growing <b>direct-to-consumer</b> channel (own site + app).'],
  ['How it earns', 'One-time hardware sale of appliances at retail/DTC, plus recurring accessory &amp; consumable revenue in some categories (filters, vacuum bags).'],
  ['The edge', 'Fast product-refresh <b>R&amp;D velocity</b> spanning two complementary brands (floorcare/beauty vs. kitchen); claimed <b>#1 US floorcare</b> and <b>#1 US blending/food-processing</b> category positions; hybrid retail + DTC distribution.'],
];

// ─── How it makes money — ONE reportable segment; Geography is the only qualifying view ──
// Per the FY2025 10-K: "The Company has identified two operating segments, Domestic and
// International, which are aggregated into one reportable segment." The ≥2-slice rule
// (OVERVIEW_CONVENTIONS.md §4.4) therefore rules out a Segments view — same situation as
// AppLovin (js/overviews/app.js) in this codebase.
export var SN_ONE_SEGMENT = 'SharkNinja reports as <b>one reportable segment</b> (Domestic and International are operating segments aggregated together) — so there is no segment-mix view to show. The one breakdown the 10-K does disclose is geography.';

// Geography, FY2025 vs FY2024 (10-K / Q4-FY2025 press release, exact reported dollars).
// Domestic 4,306.6 + International 2,092.6 = 6,399.2, reconciling to total net sales.
export var SN_GEO = [
  ['Domestic', 67.3, '$4,306.6M', '+13.5% YoY', SN_BRAND],
  ['International', 32.7, '$2,092.6M', '+20.8% YoY', '#64748B'],
];
export var SN_GEO_CAPTION = 'FY2025 net sales, $6,399.2M total (+15.7% YoY). FY2024 comparable: Domestic $3,795.7M, International $1,732.9M.';

export var SN_PROD_DEFS = [
  {
    seg: 'Cleaning',
    desc: 'The <b>Shark</b> floor-care line — upright, cordless and canister vacuums, robot vacuums, and steam mops. SharkNinja frames Shark as the <b>#1 vacuum brand in the US</b> by units.',
    subs: [
      ['Robot vacuums', 'Shark AI / Matrix / Stratos / PowerDetect lines — LiDAR + 3D structured-light navigation, self-empty base, self-cleaning brushroll, app-scheduled no-go zones.'],
      ['Upright & cordless vacuums', '"No-Loss-of-Suction" cyclonic technology, the brand\'s original 2007 launch category.'],
      ['Steam mops & multi-surface cleaners', 'Hard-floor steam cleaning, sold alongside the vacuum line.'],
    ],
  },
  {
    seg: 'Cooking & Beverage',
    desc: 'The <b>Ninja</b> line for hot cooking and drinks — air fryers, multi-cookers, outdoor grills and frozen-drink/beverage systems.',
    subs: [
      ['Air fryers & multi-cookers', 'Ninja Foodi and Speedi lines — pressure-cook, air-fry and grill functions combined in one appliance.'],
      ['Outdoor grills', 'Ninja Woodfire outdoor electric grill/smoker line.'],
      ['Frozen drink & beverage systems', 'Ninja Slushi and coffee/espresso systems.'],
    ],
  },
  {
    seg: 'Food Preparation',
    desc: 'The <b>Ninja</b> line for cold prep — blenders, food processors and ice-cream makers, the category the Ninja brand launched with in 2009.',
    subs: [
      ['Blenders', 'Countertop and personal blenders, including the Ninja Foodi Power line.'],
      ['Food processors', 'Prep, chop and dough-mixing systems.'],
      ['Ninja Creami', 'Ice-cream / frozen-treat maker — one of the brand\'s fastest-adopted recent launches.'],
    ],
  },
  {
    seg: 'Other — Home Environment & Beauty',
    desc: 'A smaller, newer <b>Shark</b> category grouping air treatment and hair styling, plus outdoor living items — the newest growth vector beyond the two core brands\' original categories.',
    subs: [
      ['Air purifiers & fans', 'Home air-treatment devices, cross-sold with the cleaning line.'],
      ['Hair styling', 'Shark Beauty — FlexStyle and similar multi-styler tools; the 10-K calls out beauty as a top-growing category.'],
      ['Outdoor ovens & coolers', 'A newer adjacent-category push into outdoor living.'],
    ],
  },
];

// ─── Products — Tier 1 family cards (mirrors SN_PROD_DEFS groupings) ──────────────
export var SN_PRODUCTS = [
  {
    ic: '🧹', fam: 'Cleaning', d: 'Shark vacuums, robot vacuums and steam mops.',
    items: [
      ['Shark AI / Matrix / Stratos robot vacuums', 'LiDAR-navigated robot vacuums with self-empty bases and app scheduling.'],
      ['Shark upright & cordless vacuums', 'The brand\'s original "No-Loss-of-Suction" category.'],
      ['Shark steam mops', 'Hard-floor steam cleaning.'],
    ],
  },
  {
    ic: '🍳', fam: 'Cooking & Beverage', d: 'Ninja air fryers, grills and drink systems.',
    items: [
      ['Ninja Foodi / Speedi', 'Multi-function pressure-cook, air-fry and grill appliances.'],
      ['Ninja Woodfire outdoor grill', 'Electric outdoor grill & smoker line.'],
      ['Ninja Slushi & coffee systems', 'Frozen-drink and coffee/espresso appliances.'],
    ],
  },
  {
    ic: '🥤', fam: 'Food Preparation', d: 'Ninja blenders, food processors and the Creami.',
    items: [
      ['Ninja blenders', 'Countertop and personal blending systems.'],
      ['Ninja food processors', 'Chopping, prep and dough tools.'],
      ['Ninja Creami', 'Ice-cream / frozen-treat maker.'],
    ],
  },
  {
    ic: '🌬️', fam: 'Home Environment & Beauty', d: 'Shark air purifiers, hair styling and outdoor living.',
    items: [
      ['Shark air purifiers & fans', 'Home air-treatment devices.'],
      ['Shark Beauty (FlexStyle)', 'Multi-function hair styling tools — a top-growing category per the 10-K.'],
      ['Outdoor ovens & coolers', 'Newer adjacent-category products.'],
    ],
  },
];

// ─── Competitors — peer scatter seed set ───────────────────────────────────────
// tk/name/self/named per the add-by-ticker contract (OVERVIEW_CONVENTIONS.md §4.6).
// Multiples are SEEDED & LABELED (Sep 2026, approximate) — never presented as live.
// evF/peF = forward EV/EBITDA & P/E; ev/pe = trailing; g/gF = trailing/forward revenue growth %.
export var SN_PEERS = [
  { tk: 'SN',    name: 'SharkNinja',        self: true,  named: true,  ev: 14.3, evF: 12.8, pe: 21.8, peF: 17.2, g: 15.7, gF: 16.5 },
  { tk: 'NWL',   name: 'Newell Brands',     self: false, named: true,  ev: 17.5, evF: 16.0, pe: null, peF: null, g: 2.0,  gF: 2.5 },
  { tk: 'HELE',  name: 'Helen of Troy',     self: false, named: true,  ev: 8.5,  evF: 7.8,  pe: 9.0,  peF: 8.2,  g: -2.0, gF: 1.5 },
  { tk: 'WHR',   name: 'Whirlpool',         self: false, named: true,  ev: 8.0,  evF: 7.3,  pe: 12.5, peF: 10.8, g: -1.0, gF: 2.0 },
  { tk: 'TTNDY', name: 'Techtronic Industries', self: false, named: true, ev: 14.4, evF: 12.0, pe: 22.0, peF: 20.8, g: 8.0, gF: 9.0 },
];
export var SN_PEERS_NOTE = 'Bubble size = live market cap where available (Massive covers US-listed tickers; TTNDY is Techtronic\'s US OTC line for the HKEX-listed 0669 and may not resolve). Trailing/forward multiples and growth are seeded approximations (Sep 2026) pending a live feed — directional, not live quotes.';
export var SN_PEERS_QUAL = 'Not plotted (no public multiple): <b>iRobot</b> (delisted from Nasdaq, trades OTC as IRBTQ amid Chapter 11 and a pending take-private by Shenzhen PICEA Robotics), <b>Dyson</b>, <b>Bissell</b>, <b>Conair</b> and <b>Vitamix</b> (all privately held). <b>Roborock</b> (Shanghai STAR Market: 688169) and <b>De\'Longhi</b> (Borsa Italiana: DLG) are direct category rivals on separate exchanges — add them by ticker if you have current multiples for them.';

// ─── Timeline — corporate genesis & lineage ────────────────────────────────────
// Genesis: an organic-brand roll-up (Euro-Pro → Shark + Ninja launched in-house under the
// same company, NOT a merger of two separate firms), acquired into JS Global Lifestyle
// (HKEX) in 2017, then spun off as an independent NYSE company in 2023.
export var SN_TIMELINE = [
  ['1994', 'Founded in Montreal as <b>Euro-Pro Operating LLC</b> by Mark Rosenzweig.', null],
  ['2003', 'Relocates headquarters to Needham, Massachusetts — still HQ today.', null],
  ['2007', '<b>Shark</b> brand launches — "No-Loss-of-Suction" vacuums, the start of the floorcare business.', null],
  ['2009', '<b>Ninja</b> brand launches — motorized kitchen appliances, starting with blenders.', ['Both Shark and Ninja were organic in-house launches under Euro-Pro, not an acquisition of two separate companies merged together.', 'This is the origin of the dual-brand structure the company still runs today.']],
  ['2015', 'Euro-Pro is renamed <b>SharkNinja</b>, formalizing the dual-brand identity.', null],
  ['2017', 'SharkNinja is acquired by <b>CJ Xuning Wang</b> — founder of the Chinese small-kitchen-appliance maker Joyoung — and folded into <b>JS Global Lifestyle Company Limited</b> (HKEX-listed), which combined Joyoung and SharkNinja under one holding company. Wang is styled the company\'s "Refounder" in later materials.', ['SharkNinja operated as a JS Global subsidiary for six years, run day-to-day by Barrocas (President since 2008) while Wang controlled the parent.', 'Founder Mark Rosenzweig is not on the current board and was not found among 5%+ shareholders as of the FY2026 proxy — his post-2017 role is not confirmed from a primary source in this draft; flag for review.', 'Exact 2017 deal terms (price, stake) are not confirmed from a primary source in this draft — flag for review.']],
  ['Feb 2023', 'JS Global\'s board announces plans to spin off SharkNinja as an independent company.', null],
  ['Jul 31, 2023', '<b>Spin-off completes.</b> SharkNinja, Inc. (incorporated in the Cayman Islands that May, purpose-built for the listing) begins independent trading on the NYSE under ticker SN, via a pro-rata share distribution to JS Global shareholders. JS Global retains the Joyoung brand and SharkNinja\'s APAC operations.', ['Structured as a Hong Kong Listing Rules spin-off distribution, not a cash sale or traditional IPO.', 'Mark Barrocas — President since 2008 — becomes CEO concurrent with independence.', 'SharkNinja Inc. explicitly excludes Asia-Pacific, which stayed with JS Global.']],
  ['2026', 'Board authorizes a <b>$750M share-repurchase program</b> — the company\'s first capital-return program as an independent entity.', null],
];

export var SN_OV_SOURCES = 'Sources: SharkNinja FY2025 Form 10-K (SEC EDGAR, filed 2026), Q4/FY2025 earnings press release (8-K), SharkNinja IR (ir.sharkninja.com) spin-off announcement (Jul 2023), FY2026 DEF 14A proxy statement, and public reporting. Peer multiples are seeded approximations, Sep 2026 — see the Competitors caption. Brand color is an estimate pending the official press-kit hex. Flagged for review: exact month of Mark Barrocas\'s CEO appointment, exact 2017 acquisition deal terms, founder Mark Rosenzweig\'s status after 2017 (not on the current board or among 5%+ holders per the FY2026 proxy — not otherwise confirmed), and full Ninja product taxonomy beyond the 10-K\'s category-level disclosure — none of these are load-bearing for the facts shown above.';

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — Top Line (only Top Line + Evolution▸Results ship this pass; no Summit
// DCF model and no confirmed Bloomberg consensus coverage exist for SN yet, so Bottom
// Line, Estimates, Earnings Setup, Valuation, Management and Miscellaneous are not
// built — see docs/COMPANY_PROFILE_BLUEPRINT.md §6 step 1 for the same gap noted on
// the Overview).
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_DD_INTRO = 'SharkNinja still has no Summit DCF model, but a Bloomberg (BST) company-financials export landed Sep 2026 — Evolution ▸ Results now carries real Street consensus (not just company guidance), and Bottom Line is fully built from it. Top Line, Management and Miscellaneous are hand-authored from the 10-K, proxy statement and earnings releases. Estimates (the vintage/snapshot view) and Earnings Setup are still blocked — this file is a single current snapshot, not an archive of how consensus moved over time — and Valuation is not built yet.';

export var SN_TL_KPIS = [
  { v: '$6,399.2M', l: 'FY2025 net sales', s: '+15.7% YoY' },
  { v: '$368.1M', l: 'R&D spend, FY2025', s: '5.8% of net sales' },
  { v: '23.8%', l: 'Largest customer', s: '% of FY2025 net sales' },
  { v: '180+', l: 'Global retail partners', s: '36 of them in the US' },
];

// [fiscalYear, domesticPct, domestic$, intlPct, intl$] — annual only; no quarterly
// geography split was found disclosed.
export var SN_TL_GEO_TREND = [
  ['2023', 65.4, '$2,781.9M', 34.6, '$1,471.8M'],
  ['2024', 68.6, '$3,795.7M', 31.4, '$1,732.9M'],
  ['2025', 67.3, '$4,306.6M', 32.7, '$2,092.6M'],
];
export var SN_TL_GEO_NOTE = 'Domestic/International net sales, FY2023–FY2025 (FY2023 reported as "United States" specifically, treated here as equivalent to Domestic). Only disclosed annually in the sources checked — no quarterly geography split was found. FY2022 not found disclosed on this basis.';

export var SN_TL_CATEGORY_GROWTH = 'FY2025 net sales grew across all four product categories. <b>Beauty and Home Environment</b> led, growing more than <b>45%</b>, driven by fans/air purifiers and a new face-mask category launched in 2025. <b>Cooking and Beverage</b> grew on the <b>Ninja Luxe Café</b> espresso machine. <b>Food Preparation</b>\'s frozen-drinks sub-category grew <b>+31.6%</b>. The 10-K does not break out category revenue in dollars or percent — growth rates are the only category-level figures disclosed.';

export var SN_TL_RD = 'R&amp;D spend was <b>$368.1M</b> in FY2025 (<b>5.8%</b> of net sales) — up in dollars but down as a share of sales from FY2024\'s <b>$341.3M</b> (<b>6.2%</b>), since net sales outgrew R&amp;D spend. The company reports <b>700+</b> cross-functional engineering and design associates.';

export var SN_TL_INTL = {
  countries: ['United Kingdom', 'Germany', 'France'],
  offices: ['Bentonville', 'Minneapolis', 'Toronto', 'Leeds', 'London', 'Munich', 'Paris'],
  manufacturing: ['China', 'Vietnam', 'Malaysia', 'Thailand', 'Indonesia', 'Cambodia'],
  note: 'The UK is the largest single international market ($964M net sales, FY2025), inside a wider "38 markets" the 10-K cites. The manufacturing/supplier base spans six countries, limiting single-country tariff exposure.',
};

export var SN_TL_CUSTOMERS_LEDE = 'Unlike many consumer-products companies, SharkNinja\'s 10-K discloses real customer-concentration numbers rather than staying silent on the question.';

export var SN_TL_CUSTOMERS_KPIS = [
  { v: '23.8%', l: 'Largest single customer', s: '% of FY2025 net sales' },
  { v: '45.7%', l: 'Amazon + Costco + Walmart combined', s: 'each individually >10% of net sales' },
  { v: '36', l: 'US retail partners', s: 'as of Dec 31, 2025' },
  { v: '180+', l: 'Global retail partners', s: 'as of Dec 31, 2025' },
];

export var SN_TL_CUSTOMERS_NOTE = 'The 10-K names Amazon, Costco and Walmart as the retailers each individually over 10% of net sales. Channel mix (big-box/mass retail vs. e-commerce vs. direct-to-consumer) is described only qualitatively in the filing — no percentage split is disclosed.';

export var SN_DD_SOURCES = 'Sources: SharkNinja FY2025 Form 10-K (SEC EDGAR); quarterly 8-K earnings press releases, 3Q23–2Q26 (SEC EDGAR); FY2026 DEF 14A proxy statement; F-1/424B3 spin-off registration statement (2023); FY2026 outlook per the Q2 2026 release (Aug 5, 2026). Flagged for review: Domestic/International split not found for FY2022 or on a quarterly basis; Item 7 MD&A\'s full narrative text was not directly retrieved (growth-driver language drawn from the earnings press releases, which closely mirror it); Rosenzweig\'s post-2017 status; exact 2017 acquisition deal terms; the July 2026 Schedule 13G/A\'s share count does not cleanly reconcile against the proxy\'s ownership table — both are shown with their own as-of date rather than forced to tie out.';

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — Bottom Line (General · Balance Sheet & Cash Flow). Unlocked by a
// Bloomberg (BST) company-financials export the team dropped at
// G:\My Drive\Summit\Docs\Research\DCF\Consumer - PV\SN\FA_SN_US_0fels5uk.xlsx
// (Sep 2026 snapshot) — the same file backs the richer results-data/sn.js. Numbers
// here are annual (FY2022-FY2025 actual); the full quarterly trend with Street
// consensus for forward periods lives in Evolution ▸ Results ▸ Margins & Profitability
// — this pane doesn't repeat that chart, it walks the structure and the balance sheet.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_BL_MARGIN_KPIS = [
  { v: '49.0%', l: 'Gross margin, FY2025', s: 'up from 37.9% in FY2022' },
  { v: '14.4%', l: 'Operating margin, FY2025', s: 'up from 8.7% in FY2022' },
  { v: '17.7%', l: 'Adj. EBITDA margin, FY2025', s: 'up from 14.0% in FY2022' },
  { v: '11.0%', l: 'Net margin (GAAP), FY2025', s: 'up from 6.3% in FY2022' },
];
export var SN_BL_MARGIN_STORY = 'Every margin line has expanded every year since FY2022 — gross margin +11.1pp, operating margin +5.7pp, over three years. The company does not break out exactly what drove the gross-margin gain (mix shift toward higher-margin categories like Beauty & Home Environment, input-cost easing, and pricing are the likely levers per the MD&A language already cited on Top Line), but the direction and size of the move show up cleanly across every year in the data.';
export var SN_BL_COST_TABLE = [
  // [FY, grossMarginPct, smPctRev, gaPctRev, rdPctRev, opMarginPct]
  ['2022', 37.9, 16.7, 6.8, 5.8, 8.7],
  ['2023', 44.9, 21.1, 9.1, 5.9, 8.8],
  ['2024', 48.1, 22.5, 7.8, 6.2, 11.7],
  ['2025', 49.0, 22.8, 6.1, 5.8, 14.4],
];
export var SN_BL_COST_NOTE = 'S&M as a % of net sales grew fastest (16.7%→22.8%) — the company is spending more to drive category expansion (see the Beauty & Home Environment growth story on Top Line) — while G&A leveraged down (6.8%→6.1%) as revenue scaled ahead of fixed overhead. R&D held roughly flat as a % of sales even as the dollar amount grew (see Top Line). Source: Bloomberg company-financials export, cross-checked against the FY2025 10-K and press releases.';

export var SN_BL_BS_KPIS = [
  { v: '$777.3M', l: 'Cash & equivalents, FY2025', s: 'more than doubled from $363.7M in FY2024' },
  { v: '$634.1M', l: 'Cash flow from operations, FY2025', s: 'up from $446.6M in FY2024' },
  { v: '$488.1M', l: 'Free cash flow, FY2025', s: 'up from $308.9M in FY2024' },
];
export var SN_BL_BS_TABLE = [
  // [FY, cash, inventories, capex, fcf, netDebtBBG]
  ['2022', '$192.9M', '$548.6M', '$80.3M', '$124.7M', '$305.0M'],
  ['2023', '$154.1M', '$699.7M', '$122.7M', '$157.9M', '$708.6M'],
  ['2024', '$363.7M', '$900.0M', '$137.7M', '$308.9M', '$575.3M'],
  ['2025', '$777.3M', '$1,002.2M', '$146.1M', '$488.1M', '$124.2M'],
];
export var SN_BL_BS_NOTE = 'Cash, inventories, capex and FCF are from the Bloomberg company-financials export and tie to the FY2025 10-K/press releases (cash, capex and FCF all cross-check exactly). The last column is Bloomberg\'s own "Net Debt (Cash)" line, which reads as net DEBT of $124.2M even in FY2025 despite $777.3M of cash on hand.';
export var SN_BL_DEBT_FLAG = 'This does not cleanly reconcile with Miscellaneous ▸ Other Analysis, which cites the company\'s own FY2025 press release showing Total Debt of $736.1M against $777.3M cash — implying a small NET CASH position (~$41M), not net debt. Bloomberg\'s Net Debt figure likely includes items the company\'s own "total debt" line excludes (operating lease liabilities are the most likely candidate under ASC 842) — this is a plausible explanation, not a confirmed one. Both figures are shown, in their own sections, rather than forced to agree.';
export var SN_BL_SOURCES = 'Sources: Bloomberg (BST) company-financials export, Sep 2026 snapshot; SharkNinja FY2025 Form 10-K (SEC EDGAR); quarterly 8-K earnings press releases. The full quarterly margin trend, with Street consensus for 3Q26 onward, is in Evolution ▸ Results ▸ Margins & Profitability — not repeated here.';

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — Management (Executives & Board · Ownership · Governance & SBC ·
// Track Record). Sourced from the FY2026 DEF 14A proxy (SEC EDGAR) and a Jul 2026
// Schedule 13G/A. Key correction vs. the Overview's original draft: founder Mark
// Rosenzweig is NOT on the current board or among 5%+ holders — the controlling
// shareholder and Chairperson is CJ Xuning Wang (Joyoung's founder, who acquired
// SharkNinja in 2017), styled "Refounder"; Barrocas is "Co-Refounder."
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_MGMT_EXECS = [
  ['Mark Barrocas', 'Chief Executive Officer, "Co-Refounder"', 'Joined 2008 as President; CEO since the Jul 2023 spin-off.'],
  ['Adam Quigley', 'Chief Financial Officer', 'Permanent CFO since Nov 6, 2025 — the second CFO transition in about a year (see Track Record).'],
  ['Pedro J. Lopez-Baldrich', 'Chief Legal Officer, EVP', 'With the company since 2018.'],
  ['Neil Shah', 'Chief Commercial Officer, EVP', 'With the company since 2018.'],
  ['Elizabeth Norberg', 'Chief People Officer', 'Tenure not found in the sources checked.'],
  ['James Lamb', 'SVP, Investor Relations & Treasury', 'Tenure not found in the sources checked.'],
];
export var SN_MGMT_EXECS_NOTE = 'Roles beyond these six (e.g. a named Chief Operating/Product/Marketing Officer) were not found in the sources checked — the proxy and IR site may name more; flagged for a follow-up pass.';

export var SN_MGMT_BOARD = [
  ['CJ Xuning Wang', 'No', 'Chairperson', 'Founder of Joyoung; acquired SharkNinja in 2017; styled "Refounder." Holds a contractual right to appoint a director while owning ≥30% of shares.'],
  ['Mark Barrocas', 'No', 'CEO', '"Co-Refounder"; joined 2008.'],
  ['Barney Tianhao Wang', 'No', 'Director, Global Robot Commercialization', 'CJ Xuning Wang\'s son.'],
  ['Kathryn J. Barton', 'Yes', 'Audit (Chair)', 'Global CEO, Dentons; formerly EY.'],
  ['Peter Feld', 'Yes', 'Lead Independent Director · Nominating & Governance · Compensation', 'Formerly CEO, Barry Callebaut.'],
  ['Chi Kin Max Hui', 'Yes', 'Nominating & Governance (Chair) · Audit', 'Managing Director, CDH Investments, since 2012.'],
  ['Timothy R. Warner', 'Yes', 'Compensation (Chair)', 'Stanford VP, Budget & Auxiliary Services; formerly on the JS Global board.'],
  ['Jason M. Wortendyke', 'Yes', 'Compensation', 'Joined Jan 2026; Managing Director, Cantor Fitzgerald.'],
  ['Dennis Paul', '—', 'Audit · Nominating (retiring)', 'Not standing for re-election at the 2026 AGM.'],
];
export var SN_MGMT_BOARD_NOTE = 'Per the DEF 14A proxy for the June 18, 2026 annual meeting (record date Apr 22, 2026). Directors are elected annually — the board is not staggered/classified. Auditor: Ernst & Young LLP.';

export var SN_MGMT_OWNERSHIP = {
  structure: 'One class of ordinary shares, $0.0001 par value, one vote each — no dual-class structure.',
  totalShares: '141,568,925 shares outstanding (Apr 22, 2026 record date).',
  rows: [
    ['CJ Xuning Wang & affiliates', '55,018,093', '39.1%', 'Via JS&W Group Holdings LP (53,307,760), JS&W Asset Holdings LP (326,333) and 1,384,000 held directly.'],
  ],
  note: 'Per a Schedule 13G/A, as of Jul 30, 2026. No other holder above 5% was identified in the sources checked — this was not an exhaustive 13G/13F screen. Wang\'s contractual right to appoint a director lasts while this stake stays at or above 30%.',
  reconcileFlag: 'This 13G/A total does not cleanly reconcile against the Jul 10, 2026 insider-sale reporting (see Track Record), which describes JS&W Group Holdings LP alone retaining 50,639,560 shares post-sale — the two sources carry different as-of dates and are shown separately rather than forced to tie out.',
};

export var SN_MGMT_SBC = [
  { v: '$43.9M', l: 'Stock-based comp, FY2025', s: 'down from $84.5M in FY2024 (-48%)' },
  { v: '100%', l: 'FY2025 performance-RSU payout', s: 'of target, for Barrocas/Lopez-Baldrich/Shah' },
];
export var SN_MGMT_GOV_NOTE = 'No shareholder rights plan ("poison pill") was found disclosed in the sources checked. Equity awards follow a standard annual RSU grant plus performance-based RSUs on a 3-year cycle.';

export var SN_MGMT_RELATED_PARTY = 'The proxy discloses three active agreements with JS Global, flagged as related-party because Chairperson Wang also chairs JS Global: a Transition Services Agreement, a Brand License Agreement, and a Sourcing Services Agreement (terms running Jul 2023–Jun 2024, Jul–Dec 2024, and from Jan 2025). Exact dollar amounts were not reached in the sources checked. The proxy states plainly: "Conflicts of interest may arise because the Chairperson of our Board holds a management and board position with JS Global."';

export var SN_MGMT_TRACK = [
  ['Nov 6, 2025', 'Adam Quigley becomes permanent CFO — the second CFO transition in about a year.', ['Paul Carbone was CFO from 2022.', 'Patraic Reagan resigned as CFO on Sept 5, 2025.', 'Quigley was named permanent CFO Nov 6, 2025 — worth watching as a churn signal for a company two years into independent public life.']],
  ['Jul 10, 2026', 'JS&W Group Holdings LP (Wang-controlled) sells 2,668,200 shares at $150.36 — about $401.2M — near the stock\'s 52-week high.', ['The stock was up roughly 36% year-to-date around the time of the sale.', 'JS&W Group Holdings LP retained 50,639,560 shares afterward, per the same reporting.', 'This figure does not cleanly reconcile against the Jul 30, 2026 Schedule 13G/A total — see the Ownership note.']],
];
export var SN_MGMT_TRACK_NOTE = 'Guidance hit-rate against the company\'s own outlook is covered by the Evolution ▸ Results dataset elsewhere in this Deep Dive, not repeated here.';

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — Miscellaneous (Capex & Depreciation · M&A · Other Analysis)
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_MISC_CAPEX_KPIS = [
  { v: '$146.1M', l: 'Capex, FY2025', s: '2.3% of net sales' },
  { v: '$139.6M', l: 'D&A, FY2025', s: '10-K cash-flow figure' },
  { v: '$190–210M', l: 'FY2026 capex guide', s: 'per the Q4/FY2025 release' },
];
export var SN_MISC_CAPEX_TREND = [
  ['2022', '$80.3M', '$86.7M'],
  ['2023', '$122.7M', '$103.8M'],
  ['2024', '$137.7M', '$123.1M'],
  ['2025', '$146.1M', '$139.6M'],
];
export var SN_MISC_CAPEX_NOTE = 'FY2022 figures are from a secondary source (stockanalysis.com) cross-checked against the primary D&A trend; FY2023–FY2025 are from the FY2025 10-K\'s cash flow statement. Quarterly capex was not compiled in this pass.';
export var SN_MISC_CAPEX_CALLOUT = 'SharkNinja owns no factories. The 10-K states it plainly: <b>"Although we do not manufacture any of our own products, we have relationships with various third-party suppliers... primarily based in China... Vietnam, Malaysia, Thailand, Indonesia and Cambodia."</b> That is why capex stays low relative to sales (2.3% in FY2025) even as the company scales — the FY2026 jump to $190–210M is a step up but still modest for a $7B+-revenue company, consistent with an asset-light, outsourced-manufacturing model.';

export var SN_MISC_MNA = 'No acquisitions were found — as an independent public company since Jul 2023, or as the predecessor Euro-Pro/SharkNinja before it. The 10-K\'s intangible-assets note carries standard business-combination accounting-policy language, but does not identify any specific recent transaction; it reads as boilerplate, likely inherited from older intangibles. Per the portal\'s own convention, "it never started buying companies" is the finding here, not a gap.';

export var SN_MISC_TAX_NOTE = 'Effective tax rate fell to <b>22.1%</b> in FY2025 from <b>23.4%</b> in FY2024, which the company attributes to "one-time benefits recorded in the fourth quarter of 2025" (Q4/FY2025 release) — the exact dollar amount and nature of that benefit were not found in the sources checked.';
export var SN_MISC_MARKETING_NOTE = 'The 10-K\'s commitments note discloses <b>$109.0M</b> of remaining marketing/endorsement obligations through 2030, payable in a mix of cash and ordinary shares.';

export var SN_MISC_DEBT = {
  lede: 'SharkNinja\'s Jul 2023 spin-off was debt-funded — a leveraged separation, not a clean-balance-sheet spin-off.',
  rows: [
    ['2022 (pre-spin)', '$437.5M'],
    ['2023 (at spin-off)', '$810.0M'],
    ['2024', '$775.5M'],
    ['2025', '$736.1M'],
  ],
  note: 'Total debt roughly doubled to fund the separation from JS Global, then has been paying down gradually since. Cash was $777.3M at Dec 2025 (vs. $363.7M at Dec 2024) with $489.1M available on the revolving credit facility. Sources: F-1/424B3 registration statement (2022/2023 figures); Q4/FY2025 press release balance sheet (2024/2025 figures).',
};

export var SN_MISC_SOURCES = 'Sources: SharkNinja FY2025 Form 10-K (SEC EDGAR) — Item 1 Business, cash flow statement, commitments note; Q4/FY2025 earnings press release (8-K); F-1/424B3 spin-off registration statement (2023). Flagged for review: quarterly capex breakdown; Property & Equipment note detail (useful lives); exact dollar amount of the Q4 2025 tax benefit; whether "spin-off related" costs are still being added back to Adjusted EBITDA/Net Income two years post-spin.';
