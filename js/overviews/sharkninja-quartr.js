// overviews/sharkninja-quartr.js — SharkNinja (NYSE: SN), the Quartr pass (Sep 2026).
//
// Everything in this file was sourced through the Quartr MCP and then FROZEN. Nothing
// here is fetched at runtime: the MCP connection may not stay active, so the portal
// must never depend on it. Refreshing this file is a deliberate, manual pass.
//
// PROVENANCE RULE: Quartr is the *retrieval* path, not the authority. Every figure is
// attributed to the underlying primary document — a quarterly earnings release (8-K
// exhibit), the investor presentation on ir.sharkninja.com, or the earnings-call
// transcript — so the citation survives even if Quartr access ends. The `q`/`src`
// fields are Quartr deep links, a convenience that may require a Quartr seat; the
// `doc` text names the primary document a reader can always reach.
//
// WHAT THIS PASS ADDED that the 10-K does not carry:
//   1. Quarterly net sales BY PRODUCT CATEGORY in dollars (every earnings release
//      discloses it; the 10-K does not). 1Q24–2Q26, reconciled to reported totals.
//   2. The Shark / Ninja brand split and full sub-category rosters (investor deck).
//   3. The company's own growth decomposition — the three-pillar contribution.
//   4. The FY2026 guidance walk, separating tariff refund from operating performance.
//   5. The Jun-30-2026 capital structure, which settles the net debt / net cash flag.
//   6. Verbatim management commentary from the 2Q26 call.
//
// Data only — no rendering. Consumed by sharkninja.js.

export var SN_Q_INTRO = 'This pass added the two things SharkNinja discloses <b>outside</b> the 10-K: the quarterly <b>net sales split by product category</b>, which every earnings release reports in dollars, and the strategic framing carried in the investor deck and on the earnings calls. Both were pulled through Quartr and frozen into the codebase — the portal makes no live call to Quartr.';

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY NET SALES — the disclosure the 10-K does NOT carry
// Each quarterly earnings release states the category's net sales AND the prior-year
// comparable, so four releases cover eight quarters. Verified: every quarter's four
// categories sum to that quarter's reported total net sales (see SN_CAT_RECON).
// ═══════════════════════════════════════════════════════════════════════════════

// [period, cleaning, cookBev, foodPrep, beautyHome, total,
//  yoyCleaning, yoyCookBev, yoyFoodPrep, yoyBeautyHome, yoyTotal] — $MM; yoy null
// where the release did not state it for that quarter.
export var SN_CAT_QTR = [
  ['1Q24', 421.9, 329.6, 205.0, 109.6, 1066.2, null, null, null, null, null],
  ['2Q24', 466.1, 379.3, 264.9, 138.4, 1248.7, null, null, null, null, null],
  ['3Q24', 527.5, 411.5, 366.8, 120.8, 1426.6, null, null, null, null, null],
  ['4Q24', 648.0, 597.3, 342.0, 199.9, 1787.2, null, null, null, null, null],
  ['1Q25', 441.4, 345.9, 297.4, 137.9, 1222.6, 4.6, 4.9, 45.0, 25.8, 14.7],
  ['2Q25', 501.5, 365.7, 404.8, 172.9, 1444.9, 7.6, -3.6, 52.8, 25.0, 15.7],
  ['3Q25', 592.9, 437.4, 410.5, 189.3, 1630.2, 12.4, 6.3, 11.9, 56.7, 14.3],
  ['4Q25', 669.9, 667.3, 438.0, 326.2, 2101.4, 3.4, 11.7, 28.1, 63.2, 17.6],
  ['1Q26', 516.6, 414.6, 287.5, 194.1, 1412.8, 17.0, 19.8, -3.3, 40.8, 15.6],
  ['2Q26', 522.0, 499.0, 458.6, 285.8, 1765.5, 4.1, 36.5, 13.3, 65.3, 22.2],
];

// [category, fy24mix%, fy25mix%, fy25yoy%] — summed from the quarterly disclosures.
export var SN_CAT_FY_MIX = [
  ['Cleaning', 37.3, 34.5, 6.9],
  ['Cooking &amp; Beverage', 31.1, 28.4, 5.7],
  ['Food Preparation', 21.3, 24.2, 31.6],
  ['Beauty &amp; Home Environment', 10.3, 12.9, 45.3],
];
// [fiscalYear, cleaning$, cookBev$, foodPrep$, beautyHome$, total$] — $MM.
export var SN_CAT_FY = [
  ['2024', 2063.5, 1717.7, 1178.7, 568.7, 5528.6],
  ['2025', 2205.7, 1816.3, 1550.7, 826.3, 6399.2],
];

export var SN_CAT_STORY = 'The mix is moving, and fast. <b>Cleaning</b> — the original Shark franchise — was <b>37.3%</b> of net sales in FY2024 and <b>34.5%</b> in FY2025, not because it shrank (it grew <b>+6.9%</b>) but because the other three grew faster. <b>Beauty &amp; Home Environment</b>, the newest and smallest group, grew <b>+45.3%</b> and went from a tenth of the company to <b>12.9%</b>; in 2Q26 alone it grew <b>+65.3%</b>. <b>Food Preparation</b> grew <b>+31.6%</b> on frozen drinks (SLUSHi) and ice-cream makers. The quarterly series shows how lumpy this is at the category level — Food Preparation swung from <b>+52.8%</b> in 2Q25 to <b>&minus;3.3%</b> in 1Q26 and back to <b>+13.3%</b> in 2Q26 — which is exactly the point management makes about diversification: no single category has to work in any given quarter.';

export var SN_CAT_RECON = 'Every quarter above reconciles: the four categories sum to that quarter\'s reported total net sales, to the rounding (2Q26: 522.0 + 499.0 + 458.6 + 285.8 = $1,765.4M vs. $1,765.5M reported). That matters for provenance — these are <b>company-disclosed figures from the quarterly earnings releases</b>, not a third-party estimate.';

export var SN_CAT_CORRECTION = '<b>Correction made this pass.</b> The same category series in <code>js/results-data/sn.js</code> was labeled "Bloomberg\'s own category tracking, not a company-disclosed dollar breakdown." It matches these releases to the cent across 1Q24&ndash;2Q26 and FY2024&ndash;FY2025, so those notes were corrected — the figures can be quoted as reported, not hedged as an estimate. FY2022&ndash;FY2023 and 3Q23&ndash;4Q23 in that file remain Bloomberg-sourced and were <b>not</b> verified against a primary release in this pass: the FY2024 release\'s category paragraphs did not extract cleanly from the PDF.';

export var SN_CAT_SOURCES = [
  { doc: 'Q2 2026 earnings release (8-K), Aug 5, 2026 — covers 2Q26 and 2Q25', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3667127&documentType=report&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&rp=1' },
  { doc: 'Q1 2026 earnings release (8-K), May 6, 2026 — covers 1Q26 and 1Q25', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3289577&documentType=report&eventId=555079&navigation=external&utm_medium=referral&utm_source=mcp&rp=1' },
  { doc: 'Q4/FY2025 earnings release (8-K), Feb 11, 2026 — covers 4Q25 and 4Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2802766&documentType=report&eventId=399981&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q3 2025 earnings release (8-K), Nov 6, 2025 — covers 3Q25 and 3Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2242166&documentType=report&eventId=372004&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q2 2025 earnings release (8-K), Aug 7, 2025 — covers 2Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2062205&documentType=report&eventId=344012&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q1 2025 earnings release (8-K), May 8, 2025 — covers 1Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=1930552&documentType=report&eventId=315494&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BRANDS — the Shark / Ninja split, disclosed in the investor deck
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_BRAND_SPLIT = {
  lede: 'The 10-K describes two brands but never sizes them. The investor presentation does.',
  // [brand, fy25NetSales, subCategories, newInLast3Years, newNames]
  rows: [
    ['Shark', '$3.0Bn', 15, 4, 'Carpet Extractors, Workshop Vacs, Fans, Skincare'],
    ['Ninja', '$3.4Bn', 23, 7, 'Outdoor Ovens, Carbonation Drink System, Drinkware, Coolers, Frozen Drink Systems, Propane Grills, Fire Pits'],
  ],
  punch: '<b>Ninja is now the larger brand</b> — a reversal from the company\'s own origin, where Shark (2007) predates Ninja (2009) and floorcare was the entire business. Ninja also carries half again as many sub-categories and has entered nearly twice as many new ones in the last three years.',
  note: 'FY2025 net sales by brand per the Aug 2026 investor presentation (p.5); sub-category counts as of Dec 31, 2025. Cross-check: the Bloomberg export behind js/results-data/sn.js carries FY2025 brand revenue of $3,032.1M (Shark) and $3,367.1M (Ninja), which sums exactly to reported net sales and rounds to the deck\'s $3.0Bn / $3.4Bn — so the brand split is a company disclosure too, not third-party tracking.',
  src: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3966451&documentType=slide&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&sp=5',
};

// Full rosters as of Dec 31, 2025 (deck p.17). Shark 15 + Ninja 23 = 38 sub-categories,
// the deck's headline count; 40 with the Ninja Crispi Microwave (Jul 2026) and a 41st
// flagged by management for late 3Q26.
export var SN_SUBCATS = {
  Shark: ['Mops', 'Handheld Vacuums', 'Upright Vacuums', 'Corded Stick Vacuums', 'Cordless Stick Vacuums', 'Robot Vacuums', 'Canister Vacuums', '2-in-1 Vacuums', 'Wet/Dry Vacuums', 'Carpet Extractors', 'Hair Dryers', 'Hair Stylers', 'Skincare', 'Air Purifiers', 'Fans'],
  Ninja: ['Blenders', 'Food Processors', 'Coffee Makers', 'Air Fryers', 'Multi-Cookers', 'Indoor Grills', 'Outdoor Grills', 'Propane Grills', 'Outdoor Ovens', 'Countertop Ovens', 'Toasters', 'Waffle Makers', 'Electric Kettles', 'Cookware', 'Bakeware', 'Cutlery', 'Drinkware', 'Coolers', 'Juicers', 'Ice Cream Makers', 'Frozen Drink System', 'Carbonation Drink System', 'Fire Pits'],
};
export var SN_SUBCATS_NOTE = 'As of Dec 31, 2025, per the investor presentation (p.17). The rosters show how little the two brands overlap — Shark is the home and personal-care side, Ninja is everything that sits near food. Note the drift beyond appliances: Ninja now sells Drinkware, Coolers, Cutlery, Cookware and Bakeware, none of which are motorized. That is a brand-licence extension of a kind the "small household appliances" description in the 10-K does not capture.';

// ═══════════════════════════════════════════════════════════════════════════════
// THE GROWTH ALGEBRA — the company's own decomposition
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_GROWTH_PILLARS = {
  lede: 'SharkNinja added two slides to its investor presentation in Aug 2026 specifically to answer the "is double-digit growth durable?" question. They decompose where growth actually comes from.',
  // [pillar, pctOfGrowth, definition]
  rows: [
    ['Existing categories', 40, 'Categories launched at least 2 years prior, Domestic segment'],
    ['New &amp; adjacent', 20, 'Any category launched in any geography in the last 2 years'],
    ['International', 40, 'Categories launched at least 2 years prior, International segment'],
  ],
  punch: 'The surprise is how <b>small</b> the viral-product contribution is. The launches that make SharkNinja famous — SLUSHi, CryoGlow, Crispi — sit in the <b>~20%</b> bucket. Roughly <b>80%</b> of growth comes from categories the company has sold for at least two years, split evenly between selling them again domestically and selling them abroad for the first time. A second slide sharpens it further: of growth <b>within any launch year</b>, about <b>90%</b> comes from existing categories and only <b>~10%</b> from the categories launched that year.',
  note: 'Approximate average contribution to net sales growth over FY2023&ndash;FY2025; individual years vary. Source: investor presentation, Aug 2026 (p.20&ndash;21).',
  src: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3966451&documentType=slide&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&sp=20',
};

export var SN_GROWTH_MATH = 'Management states the arithmetic plainly on the 2Q26 call: <b>"On average, over the last three years, our existing categories typically grow mid-to-high single digits. Layer on international expansion, layer on new category launches, add those three together. You can get a double-digit growth profile."</b> That is the whole thesis in one sentence — and it is testable against the category table above rather than taken on faith.';

export var SN_SCALE_ARC = {
  points: [
    ['FY Mar 2008', '$250MM', 'Under the predecessor Euro-Pro'],
    ['2018', '$1.5Bn', 'Under JS Global ownership, pre-spin'],
    ['2025', '$6.4Bn', 'Second full year as an independent NYSE company'],
  ],
  cagrs: ['21% CAGR across the whole arc, 2008&ndash;2025', '23% CAGR in the recent leg, 2018&ndash;2025'],
  note: 'Investor presentation p.19. The 2008 figure is a fiscal year ended March 2008. The company has compounded <b>faster</b> in the recent leg than across its whole history — unusual at this size, and the reason the durability question gets asked at all.',
};

export var SN_TAM = 'Management sizes the addressable market at roughly <b>$120 billion</b> entering 2Q26, expected to reach <b>$125&ndash;130 billion</b> by the end of 2026 as new sub-categories are entered. The Ninja Crispi Microwave (launched Jul 2026) alone added a TAM management put at <b>over $3 billion</b>, taking the sub-category count to <b>40</b>; a 41st, also described as multi-billion-dollar, was flagged for late 3Q26. Against $6.4Bn of FY2025 net sales that is roughly <b>5%</b> penetration of the TAM the company claims — worth holding at arm\'s length, since this is management\'s own definition of the market, not a third party\'s.';

export var SN_INNOV_CADENCE = 'The innovation cadence is explicitly weighted toward the core: the company targets <b>25 new product introductions a year</b>, of which <b>20 go into categories it already sells</b> (deck p.9, restated by the CEO on the 2Q26 call). It reports <b>1,000+ cross-functional engineers and designers</b> across the US, UK and China, and <b>5,500+ issued patents</b> in force globally as of Dec 31, 2025. That sits alongside a minimum public commitment of only <b>two new sub-categories a year</b> — so the roadmap is far more about deepening existing categories than entering new ones, which is close to the opposite of how the company is usually described.';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNATIONAL — the direct-market build-out
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_INTL_KPIS = [
  { v: '$2.1Bn', l: 'International net sales, FY2025', s: 'markets outside North America' },
  { v: '31%', l: 'International net sales CAGR', s: 'FY2020–FY2025' },
  { v: '38', l: 'Markets served', s: 'as of Dec 31, 2025' },
  { v: '<10%', l: 'EMEA category penetration', s: 'management estimate, 2Q26' },
];

// [market, yearWentDirect, detail]
export var SN_INTL_DIRECT = [
  ['United Kingdom', '2014', 'The largest single international market — $964M net sales in FY2025, $255M in 2Q26 alone (+18.7% YoY). The template for every later direct entry.'],
  ['Germany', '2020', 'One of the two clearest core-expansion examples: categories sold in-market up over 50% year-on-year as of 2Q26.'],
  ['France', '2020', 'The other — same pattern, incremental launches drawn largely from the established core.'],
  ['Spain', '2021', 'Converted from distributor-led to direct; transition completed during 2Q26.'],
  ['Italy', '2021', 'Converted from distributor-led to direct; transition completed during 2Q26.'],
];

export var SN_INTL_STORY = 'International is not one story but two stacked on top of each other. The first is <b>going direct</b>: SharkNinja has been converting distributor-led markets to its own operation, and management said on the 2Q26 call that it is <b>"now done for the foreseeable future with these distributor conversions"</b> — Italy and Spain were the last, and the new direct-to-consumer platform finished rolling out across the major international markets in the same quarter. Mexico went through the same conversion a year earlier, which is why 1Q25 international growth read artificially low. The second story is <b>taking the existing catalogue abroad</b>: a year ago SharkNinja sold a "low double-digit number of categories" in each of France and Germany; by 2Q26 that was up over 50%, almost entirely from established core products. Management estimates it is still <b>under 10% penetrated on an overall category basis across EMEA</b>.';

export var SN_INTL_NOTE = 'Direct-entry years and the $2.1Bn / 31% CAGR figures are from the investor presentation (p.18); the conversion-complete, category-count and penetration statements are from the 2Q26 earnings call (Aug 5, 2026). One discrepancy left unresolved rather than picked: the deck\'s p.18 footnote says 35 markets while its own p.4 headline says 38, both as of Dec 31, 2025. The 38 figure is used here because it matches the 10-K.';

export var SN_CHANNEL = 'SharkNinja does not disclose a channel-mix percentage — the CEO said so directly on the 2Q26 call (<b>"We don\'t break out the percentage of our D2C business"</b>) — but it does disclose direction and structure. It states it <b>never practises retailer exclusivity</b>. Social commerce is the fastest-moving piece: live with <b>TikTok Shop in seven countries</b> at the end of 2Q26 against <b>zero</b> a year earlier, with a stated goal of more than doubling that by holiday 2026 (management separately referenced 13 countries for Q4). The CFO confirmed the margin consequence: DTC, TikTok Shop and social commerce <b>"come at a higher structural gross margin"</b> than retail, and management expects D2C and affiliates to grow faster than the rest of the business through the end of 2027. That is a structural gross-margin tailwind that has not yet shown up in the reported numbers.';

// ═══════════════════════════════════════════════════════════════════════════════
// FY2026 GUIDANCE WALK — separating the tariff refund from operating performance
// ═══════════════════════════════════════════════════════════════════════════════

// [metric, priorGuide, updatedGuide, note]
export var SN_GUIDE_WALK_2026 = [
  ['Net sales growth', '+11.5% to +12.5%', '+16.0% to +17.0%', 'Raised ~4.5pp — no tariff-refund component at all; this is operating performance.'],
  ['Adjusted EPS', '$6.00 – $6.10', '$6.45 – $6.55', 'Of the $0.45 increase, ~$0.15 is the expected net tariff-refund benefit — so ~$0.30 is operational.'],
  ['Adjusted EBITDA', '$1,290M – $1,300M', '$1,357M – $1,369M', 'Of the $67–69M increase, ~$30M is the tariff refund — so roughly half to two-thirds is operational.'],
  ['GAAP effective tax rate', '~22.0% to ~23.0%', '~22.0% to ~23.0%', 'Unchanged.'],
  ['Diluted weighted avg. shares', '~143.0M', '~142.5M', 'Slightly lower on buyback activity.'],
  ['Capital expenditures', '$190M – $210M', '$190M – $210M', 'Range unchanged, but now "tracking toward the high end."'],
];

export var SN_GUIDE_WALK_READ = 'Read the top line first: the <b>net sales</b> raise carries <b>no</b> refund component, so the ~4.5pp increase is pure operating momentum. On the earnings lines the refund does real work — roughly a third of the EPS raise and around 45% of the EBITDA raise — and management said it intends to <b>reinvest a portion</b> of the benefit into retail activation, media, AI capability and tariff/input-cost mitigation rather than let it all drop through. 2Q26 itself was the <b>13th consecutive quarter</b> of double-digit net sales growth and the fastest since 4Q24.';

export var SN_GUIDE_WALK_NOTE = 'FY2026 outlook as of the Q2 2026 release (Aug 5, 2026), against the outlook it replaced. The company separates the tariff-refund benefit from underlying performance in its own disclosure — worth crediting, since that is the difference between a guidance raise and a one-off.';

// ═══════════════════════════════════════════════════════════════════════════════
// TARIFFS — the exposure, and the refund
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_TARIFF_KPIS = [
  { v: '$247.1M', l: 'Refund claims submitted', s: 'accepted by US CBP, Jul 2026' },
  { v: '10%', l: 'Assumed minimum tariff rate', s: 'Indonesia, Malaysia, Cambodia' },
  { v: '12.5%', l: 'Assumed tariff rate', s: 'China, Vietnam, Thailand — up from 10%' },
];

export var SN_TARIFF_LEDE = 'Tariffs are the single largest identified pressure on SharkNinja\'s gross margin — and in 2026 they also produced its largest one-off benefit.';

export var SN_TARIFF_REFUND = 'In July 2026 SharkNinja submitted refund claims of approximately <b>$247.1M</b> through the US Customs and Border Protection refund process, and CBP accepted them. The company expects to recognize the full amount as a <b>reduction of cost of sales</b>, with a corresponding receivable, in <b>3Q26</b>. The underlying duties split roughly evenly between amounts expensed in FY2025 and in 1H26.';

export var SN_TARIFF_TREATMENT = 'The accounting treatment is the part worth reading carefully, because it decides what appears where. Refunds tied to tariffs <b>expensed in 2025</b> benefit GAAP results and cash flow but are <b>excluded</b> from Adjusted Net Income, Adjusted EBITDA and Adjusted EPS in the FY2026 outlook. Refunds tied to tariffs <b>incurred in 2026</b> flow through those same adjusted metrics. So GAAP 3Q26 will carry roughly twice the benefit the adjusted numbers do — which will look like a blowout GAAP quarter and should not be read as one.';

export var SN_TARIFF_MARGIN = 'The pressure itself is visible in the reported margin. Adjusted gross margin fell <b>70bp</b> YoY in 2Q26 to 48.7%, which the company attributes primarily to US tariff cost, unfavourable FX and increased retailer activations, partly offset by cost optimization, favourable category and channel mix, and the end of the JS Global sourcing service fee (which terminated Jul 31, 2025). Management framed the 2Q26 drag as mostly the <b>annualization</b> of 2025 tariffs rather than new cost.';

export var SN_TARIFF_NOTE = 'Source: Q2 2026 earnings release and earnings call, Aug 5, 2026. The assumed rates are the company\'s own outlook assumptions, held constant for the remainder of 2026 — not a forecast of policy, and not the portal\'s view.';

// ═══════════════════════════════════════════════════════════════════════════════
// CAPITAL STRUCTURE — resolves the net debt / net cash conflict flagged on Bottom Line
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_CAPSTRUCT = {
  lede: 'The company publishes its own capital-structure summary, which settles a reconciliation this profile previously left open.',
  rows: [
    ['Cash and cash equivalents', '$780M'],
    ['Total debt', '$719M'],
    ['Net debt', '($61M) — i.e. net cash'],
    ['LTM Adjusted EBITDA (2Q26)', '$1,212M'],
    ['LTM net leverage', '(0.05x)'],
  ],
  note: 'As of June 30, 2026, per the investor presentation (p.27). Total debt consists of $729.0M outstanding under the term loan; the release states $718.9M excluding unamortized deferred financing costs. Roughly $489.8M remained available on the $500M revolving credit facility.',
  resolves: 'This resolves the flag carried on <b>Bottom Line &#9656; Balance Sheet &amp; Cash Flow</b>. Bloomberg\'s "Net Debt (Cash)" line showed net <b>debt</b> of $124.2M at FY2025 despite $777.3M of cash on hand, while the company\'s own figures implied a small net <b>cash</b> position. The company\'s Jun-30-2026 slide uses its own definition — cash less term-loan borrowings — and reports <b>net cash of $61M at (0.05x) leverage</b>. The likely explanation for Bloomberg\'s figure is still that it includes operating lease liabilities under ASC 842, and that is still <b>not confirmed</b>. But the practical question is settled either way: on the company\'s own definition SharkNinja carries no net debt, and the gap between the two figures is definitional, not a disputed fact.',
  src: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3966451&documentType=slide&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&sp=27',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET SHARE — recorded, deliberately not tabulated
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_MKTSHARE = 'The investor presentation (p.14) carries the evidence behind the "grow share in existing categories" pillar — US and UK category market share, 2020 vs. 2025. US shares are sourced from <b>Circana</b> Retail Tracking Service (US dollar sales, 52 weeks ended Jan 3, 2026 vs. Jan 2, 2021) across upright, stick and robotic vacuums, bare-floor cleaners, traditional and single-serve blending, kitchen systems, toaster ovens, air fryers, coffeemakers, single-serve brewing and espresso makers. UK shares come from <b>GfK</b> MI Sales Tracking (Great Britain, sales value GBP, Jan&ndash;Dec 2020 vs. Jan&ndash;Dec 2025) for vacuum cleaners, food preparation, and hot air fryers &amp; multi-cookers. <b>The per-category bar values are deliberately not reproduced here</b> — the chart\'s labels and values did not extract reliably from the deck PDF, and pinning a number to the wrong category would be worse than omitting it. Open the slide before quoting any single share figure.';
export var SN_MKTSHARE_SRC = 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3966451&documentType=slide&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&sp=14';

// ═══════════════════════════════════════════════════════════════════════════════
// IN THEIR OWN WORDS — verbatim management commentary, 2Q26 call
// ═══════════════════════════════════════════════════════════════════════════════

var TR = 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3968466&documentType=transcript&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&targetTime=';

// [theme, quote, speaker, role, link]
export var SN_QUOTES = [
  ['On the skepticism itself', 'When some investors ask me about SharkNinja\'s growth, I can sense some skepticism. It\'s hard to believe that double-digit growth in a business our size in a market that isn\'t growing much can be durable.', 'Mark Barrocas', 'CEO', TR + '194'],
  ['The growth arithmetic', 'On average, over the last three years, our existing categories typically grow mid-to-high single digits. Layer on international expansion, layer on new category launches, add those three together. You can get a double-digit growth profile.', 'Mark Barrocas', 'CEO', TR + '318'],
  ['How they define the company', 'SharkNinja is not a cleaning company or a kitchen appliances company. We\'re a consumer problem-solving company… Every category we\'ve ever entered started the same way. Not with a product we wanted to create, but with a problem we noticed.', 'Mark Barrocas', 'CEO', TR + '444'],
  ['Where the R&D actually goes', 'Roughly 20 of the 25 new products we launch each year go into existing categories. That\'s deliberate. A vibrant, healthy base business is what powers everything else we do at SharkNinja.', 'Mark Barrocas', 'CEO', TR + '498'],
  ['New categories become the core', 'I don\'t think about our core and our new categories as two separate stories. They\'re the same story told at different stages… our newest categories will eventually mature into core, the same way things like Ninja CREAMi have.', 'Mark Barrocas', 'CEO', TR + '498'],
  ['International — the transition is done', 'Importantly, we\'re now done for the foreseeable future with these distributor conversions, laying the groundwork for future growth. We\'ve also finished the rollout of our new direct-to-consumer platform across our major international markets.', 'Mark Barrocas', 'CEO', TR + '1050'],
  ['How much EMEA runway is left', 'A year ago, SharkNinja participated in a low double-digit number of categories in each market [France and Germany]. Today, that number is up over 50%… Even with the expansion, we estimate that we\'re still less than 10% penetrated on an overall category basis across EMEA today.', 'Mark Barrocas', 'CEO', TR + '1122'],
  ['Social commerce as a new front door', 'At the end of the quarter, we were live with TikTok Shop in seven countries, compared to zero in the year ago period… In the case of Germany, within weeks, our sales volume in this channel started to reach levels that took us months to achieve in the U.S. and U.K.', 'Mark Barrocas', 'CEO', TR + '556'],
  ['Why channel mix matters to margin', 'DTC, TikTok Shop, overall social commerce does come at a higher structural gross margin… certainly higher gross margin opportunity overall. And then as we scale that business, we start to see overall benefits across our distribution network, across customer service.', 'Adam Quigley', 'CFO', TR + '2636'],
  ['Operating leverage', 'SharkNinja has now driven leverage on adjusted operating expense as a percentage of net sales for five quarters in a row.', 'Adam Quigley', 'CFO', TR + '1523'],
  ['How AI is being run internally', 'The concept of a six to nine-month project no longer exists at SharkNinja. If we don\'t see tangible progress on an initiative every two weeks, resources are reallocated elsewhere.', 'Mark Barrocas', 'CEO', TR + '754'],
  ['What AI is expected to do to costs', 'I think you\'re going to see us be able to really leverage compensation in a big way in 2027. Not to the extent of seeing any type of large reductions, but I think we\'re going to continue to be able to keep growing the business on roughly flat headcount as we get into 2027.', 'Mark Barrocas', 'CEO', TR + '3292'],
  ['On channel inventory', 'Look, I would say if anything, I think retailers could take a bit more inventory. Not that they\'re consciously working down their inventory, but I think there\'s a lot of demand to capture.', 'Mark Barrocas', 'CEO', TR + '2909'],
  ['How new doors open', 'We never sold any products other than hair care and skin care to Ulta, and we showed them our Shark ChillPill, and they said this would be an amazing product for them to add to their assortment.', 'Mark Barrocas', 'CEO', TR + '3115'],
];

export var SN_QUOTES_NOTE = 'Verbatim from the Q2 2026 earnings call (Aug 5, 2026), retrieved via Quartr and frozen here. The links point at the exact paragraph in Quartr\'s transcript and need a Quartr seat; the same remarks are in the company\'s own webcast replay and transcript at ir.sharkninja.com. This is management\'s framing of its own business — recorded so it can be tested against the numbers, not endorsed.';

export var SN_QUARTR_SOURCES = 'Sources for this section: SharkNinja quarterly earnings releases (8-K exhibits) for 1Q25, 2Q25, 3Q25, Q4/FY2025, 1Q26 and 2Q26; the SharkNinja investor presentations of August 2026 (34pp) and February 2026; and the Q2 2026 earnings-call transcript (Aug 5, 2026). All retrieved through Quartr in Sep 2026 and frozen into js/overviews/sharkninja-quartr.js — the portal makes no runtime call to Quartr. Flagged for review: the deck\'s p.14 market-share bars (values not reliably extractable from the PDF — read the slide); the deck\'s own 35-vs-38 markets discrepancy; and FY2022–FY2023 / 3Q23–4Q23 category revenue, which remain Bloomberg-sourced and unverified against a primary release.';
