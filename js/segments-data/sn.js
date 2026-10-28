// segments-data/sn.js — the Top Line dataset for SharkNinja (NYSE: SN).
// Contract: docs/PANE_CATALOG.md §1. Second adopter of js/segments.js after AMZN.
//
// SHAPE OF THIS COMPANY, and why the tabs land where they do:
// SharkNinja aggregates its two operating segments (Domestic and International) into ONE
// reportable segment. So `segments` legitimately has a single entry — the Segments sub-tab
// carries the consolidated company, its KPIs and its growth decomposition, not a segment
// comparison. The interesting work is in `other`: three alternative CUTS of the same total
// (product category, brand, geography), which is exactly what `other` is for.
//
// Every series here is a POINTER into js/results-data/sn.js — nothing is copied, so each
// number keeps one home. NOTE: the engine reads `act` and falls back to `summit`, never
// `cons`. SN has no Summit DCF model, so its forward values live in `cons` and do NOT render
// here by design — the Street lines are in Evolution ▸ Results. The axis is actuals only.
//
// PROVENANCE: the product-category and brand cuts are COMPANY-DISCLOSED — the 10-K carries no
// dollar split, but every quarterly earnings release does, and the brand split is on p.5 of
// the Aug 2026 investor deck. Verified release-by-release for 1Q24-2Q26 and FY2024-FY2025;
// 3Q23-4Q23 and FY2022-FY2023 remain Bloomberg-sourced and unverified. See
// js/overviews/sharkninja-quartr.js for the retrieval pass and its sources.

export var snSegments = {
  company: 'SharkNinja',
  updated: 'Sep 2026',
  source: 'Product-category and brand net sales are company disclosures — categories from each quarterly earnings release (8-K), the brand split from p.5 of the August 2026 investor presentation; both verified to reconcile to reported total net sales for 1Q24-2Q26 and FY2024-FY2025, with 3Q23-4Q23 and FY2022-FY2023 carried from the Bloomberg (BST) export and unverified against a primary release. Geography (Domestic / International) is the one split the 10-K itself discloses. Customer concentration is from the FY2025 Form 10-K. All series are read through from js/results-data/sn.js; Street consensus for forward periods is not shown on this tab — it lives in Evolution ▸ Results.',

  axis: {
    q: ['3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'],
    y: ['2022', '2023', '2024', '2025'],
  },

  shared: {},
  derived: {},

  overview: {
    tenK: {
      text: 'The Company has identified two operating segments, Domestic and International, which are aggregated into one reportable segment.',
      where: 'FY2025 Form 10-K, segment reporting note',
    },
  },

  // ── The one reportable segment ───────────────────────────────────────────────────────────
  segments: [
    {
      key: 'sn',
      label: 'SharkNinja (consolidated)',
      short: 'SharkNinja',
      lede: 'One reportable segment, two brands, 38 sub-categories. Because Domestic and International are aggregated, there is no segment margin to compare — what the company does disclose is the same total cut three ways (see Other) and a decomposition of where its growth comes from.',
      summary: 'A single reportable segment: small household appliances sold under Shark (home cleaning, air treatment, beauty) and Ninja (cooking, food preparation, beverages) across 38 markets.',
      brief: 'SharkNinja designs and markets small household appliances under two brands and sells them through big-box and specialty retail, e-commerce marketplaces, its own direct-to-consumer sites and social commerce. It owns no factories — third-party suppliers across six Southeast Asian countries manufacture 100% of its products.',

      sells: [
        { name: 'Shark', what: 'Floor care, air treatment, hair styling and skincare — $3.0Bn of FY2025 net sales across 15 sub-categories.' },
        { name: 'Ninja', what: 'Cooking, food preparation, beverages and outdoor living — $3.4Bn of FY2025 net sales across 23 sub-categories.' },
      ],

      products: [
        {
          name: 'Shark',
          what: 'The home and personal-care side: vacuums (upright, cordless, robot, canister, wet/dry, 2-in-1), mops, carpet extractors, air purifiers, fans, hair dryers, hair stylers and skincare. 15 sub-categories as of Dec 31, 2025, four of them entered in the last three years (Carpet Extractors, Workshop Vacs, Fans, Skincare).',
          customers: {
            archetype: { text: 'Consumer households, reached through big-box and mass retail, specialty retail, e-commerce marketplaces and a growing direct-to-consumer channel.', where: 'FY2025 Form 10-K, Item 1' },
            named: [
              { name: 'Ulta', q: 'Q2 2026', what: 'Took the Shark ChillPill — the first SharkNinja product there outside hair and skin care. Management used it as the example of products earning placement at retailers that did not carry the category before.' },
              { name: 'Walmart', q: 'Q2 2026', what: 'Large curated end caps rolled out across a large number of stores.' },
            ],
            concentration: 'Amazon, Costco and Walmart were each individually over 10% of FY2025 net sales; together 45.7%, with the largest single customer at 23.8%.',
          },
          management: [
            { q: 'Q2 2026', text: 'Cleaning is a great proof point this quarter, with multiple product launches... That is three meaningful innovations in a single quarter inside a category we have sold for decades.' },
          ],
        },
        {
          name: 'Ninja',
          what: 'Everything that sits near food: blenders, food processors, air fryers, multi-cookers, indoor and outdoor grills, ovens, coffee and espresso, frozen drink and carbonation systems, ice cream makers, juicers — plus non-motorized extensions into cookware, bakeware, cutlery, drinkware and coolers. 23 sub-categories as of Dec 31, 2025, seven entered in the last three years.',
          customers: {
            archetype: { text: 'The same household buyer and the same omni-channel route to market; the company states it never practises retailer exclusivity.', where: 'August 2026 investor presentation, p.12' },
            named: [
              { name: 'Target', q: 'Q2 2026', what: 'Promotions built around the colorways, in store on end caps and on target.com.' },
              { name: 'Mercado Libre', q: 'Q2 2026', what: 'Named as the deepening Latin America partner alongside Amazon globally.' },
            ],
            concentration: 'Same company-level concentration: three customers each above 10% of net sales, 45.7% combined.',
          },
          management: [
            { q: 'Q2 2026', text: 'Our espresso and coffee business has seen very significant growth globally... expansion in our Crispi business, expansion in our espresso business, solid results in items like our oven business, our multi-cooker business.' },
          ],
        },
      ],

      tenK: {
        text: 'Although we do not manufacture any of our own products, we have relationships with various third-party suppliers... primarily based in China... Vietnam, Malaysia, Thailand, Indonesia and Cambodia.',
        where: 'FY2025 Form 10-K, Item 1 — Manufacturing',
        verbatim: true,
      },

      kpis: [
        { name: 'Net sales', definition: 'Total reported net sales.', filing: 'FY2025 Form 10-K', unit: 'usdM',
          periodicity: 'Quarterly and annual', source: 'Results dataset', series: 'results:rev' },
        { name: 'Sub-categories', definition: 'Distinct product sub-categories the company sells.', filing: 'Investor presentation', unit: 'count',
          periodicity: 'Annual', source: 'Aug 2026 deck p.4/p.17 — 38 at Dec 31 2025, 40 after the Ninja Crispi Microwave (Jul 2026), a 41st flagged for late 3Q26.', series: null },
        { name: 'Markets served', definition: 'Countries the products are distributed in.', filing: 'FY2025 Form 10-K', unit: 'count',
          periodicity: 'Annual', source: '38 as of Dec 31, 2025. The deck contradicts itself here — p.4 says 38, the p.18 footnote says 35; the 10-K figure is used.', series: null,
          needs: 'The deck\'s own 35-vs-38 discrepancy is unresolved.' },
        { name: 'Addressable market (TAM)', definition: 'Management\'s own estimate of the market it can sell into.', filing: null, unit: 'usdB',
          periodicity: 'Management commentary', source: '~$120B entering 2Q26, expected to reach $125-130B by end-2026 as sub-categories are added. Management\'s definition, not a third party\'s — roughly 5% penetrated against FY2025 net sales.', series: null },
        { name: 'New product introductions', definition: 'Annual target for new products launched.', filing: null, unit: 'count',
          periodicity: 'Annual target', source: '25 a year, of which 20 go into categories already sold. Minimum public commitment is only two NEW sub-categories a year.', series: null },
        { name: 'Patents in force', definition: 'Issued patents held globally.', filing: 'Investor presentation', unit: 'count',
          periodicity: 'Annual', source: '5,500+ as of Dec 31, 2025, supported by 1,000+ cross-functional engineers and designers across the US, UK and China.', series: null },
        { name: 'Retail partners', definition: 'Retailers carrying the products.', filing: 'FY2025 Form 10-K', unit: 'count',
          periodicity: 'Annual', source: '180+ globally, 36 of them in the US, as of Dec 31, 2025.', series: null },
      ],

      kpiNote: 'The KPI set is deliberately weighted to breadth rather than depth: with one reportable segment and no disclosed channel mix, the count of sub-categories, markets and retail partners is most of what the company gives you to track the three-pillar strategy against. The interaction below is the closest thing to a growth bridge SharkNinja publishes.',

      interactions: [
        {
          name: 'Where growth comes from — the three pillars',
          relation: 'net sales growth ≈ existing categories (~40%) + new & adjacent (~20%) + international (~40%)',
          bridge: null,
          lines: ['Shark', 'Ninja'],
          why: 'SharkNinja added two slides to its deck in Aug 2026 specifically to answer whether double-digit growth is durable. The decomposition is the answer: roughly 80% of growth comes from categories sold for at least two years — split evenly between selling them again domestically and selling them abroad for the first time. The viral launches that define the brand publicly (SLUSHi, CryoGlow, Crispi) sit in the ~20% bucket. A second slide sharpens it: of growth within any launch year, about 90% comes from existing categories and only ~10% from the ones launched that year. Definitions: "existing" = launched at least 2 years prior in Domestic; "new & adjacent" = any category launched anywhere in the last 2 years; "international" = launched at least 2 years prior in International.',
          data: 'NOT CHARTED — the company publishes approximate three-year-average contributions (FY2023-FY2025) with no per-year series behind them. Charting three round numbers would imply a precision the disclosure does not carry. Source: August 2026 investor presentation, p.20-21.',
        },
        {
          name: 'The long arc',
          relation: '$250MM (FY Mar 2008) → $1.5Bn (2018) → $6.4Bn (2025)',
          bridge: null,
          lines: ['Shark', 'Ninja'],
          why: 'A 21% CAGR across the whole arc and 23% in the recent leg — the company has compounded FASTER as it got bigger, which is unusual at this size and is the reason the durability question gets asked at all. The 2008 figure is a fiscal year ended March 2008, under the predecessor Euro-Pro.',
          data: 'NOT CHARTED — three disclosed points seventeen years apart, not a series. Source: August 2026 investor presentation, p.19.',
        },
        {
          name: 'Share gains in existing categories',
          relation: 'more retailers + more doors + more products at existing retailers → category share',
          bridge: null,
          lines: ['Shark', 'Ninja'],
          why: 'The evidence behind pillar two. US shares come from Circana Retail Tracking Service (US dollar sales, 52 weeks ended Jan 3 2026 vs Jan 2 2021) across upright, stick and robotic vacuums, bare-floor cleaners, traditional and single-serve blending, kitchen systems, toaster ovens, air fryers, coffeemakers, single-serve brewing and espresso makers. UK shares come from GfK MI Sales Tracking (Great Britain, sales value GBP, Jan-Dec 2020 vs Jan-Dec 2025) for vacuum cleaners, food preparation and hot air fryers & multi-cookers.',
          data: 'NOT CHARTED — deliberately. The per-category bar values on p.14 of the deck did not extract reliably from the PDF, and pinning a number to the wrong category would be worse than omitting it. Open the slide before quoting any single share figure.',
        },
      ],

      adjacencies: [
        { name: 'New & adjacent categories', why: 'The ~20% growth pillar. Entries are chosen by consumer problem rather than by existing technology: the Ninja Crispi Microwave (Jul 2026) added a multi-billion-dollar TAM the company had never touched and took the sub-category count to 40. Management has publicly committed only to a minimum of two new sub-categories a year.', series: null },
        { name: 'Social commerce', why: 'A new acquisition channel for the OLDEST categories, not just the viral ones — the Ninja NeverDull cutlery line, a five-year-old category, became a top-three seller on TikTok Shop in the US and reached a younger buyer. Live in seven countries at the end of 2Q26 against zero a year earlier, with a stated goal of more than doubling by holiday 2026.', series: null },
        { name: 'Direct-to-consumer', why: 'Structurally higher gross margin than retail, per the CFO, with far more control over assortment, colorways, pricing and promotion. The re-platforming finished rolling out across the major international markets during 2Q26; management expects DTC and affiliates to grow faster than the rest of the business through the end of 2027. The company does not disclose what share of net sales it represents.', series: null },
        { name: 'Non-motorized brand extensions', why: 'Ninja now sells drinkware, coolers, cutlery, cookware and bakeware — none of which plug in. A brand-licence extension the 10-K\'s "small household appliances" description does not capture, and a category of growth that leans on brand rather than engineering.', series: null },
      ],

      drivers: {
        rev: { from: 'results:rev' },
        opinc: { from: 'results:opIncome' },
      },

      bridges: [],
      highlights: [],
    },
  ],

  // ── Alternative cuts of the SAME total ───────────────────────────────────────────────────
  other: [
    {
      key: 'category',
      label: 'Product category',
      sub: 'four groups',
      lede: 'The breakdown the 10-K does not carry. SharkNinja reports one segment, so there is no segment table — but every quarterly earnings release states net sales for each of the four product categories in dollars, with the prior-year comparable. Assembled from six releases, the four categories sum to reported total net sales in every quarter.',
      note: 'The mix is moving fast. Cleaning — the original Shark franchise — fell from 37.3% of net sales in FY2024 to 34.5% in FY2025, not because it shrank (it grew +6.9%) but because the others grew faster. Beauty & Home Environment grew +45.3% to 12.9% of the company, and +65.3% in 2Q26 alone. Food Preparation grew +31.6% on frozen drinks and ice-cream makers. At the category level the quarters are lumpy — Food Preparation swung from +52.8% in 2Q25 to −3.3% in 1Q26 and back to +13.3% in 2Q26 — which is the point management makes about diversification: no single category has to work in any given quarter.',
      caveat: 'One reportable segment, so no margin exists for this cut — these are net sales only. 3Q23-4Q23 are Bloomberg-sourced and were not verified against a primary release.',
      spans: 'assembled from six quarterly earnings releases',
      views: ['q', 'y'],
      series: [
        { key: 'cleaning', ref: 'results:segCleaning', label: 'Cleaning' },
        { key: 'cookbev', ref: 'results:segCookBev', label: 'Cooking & Beverage' },
        { key: 'foodprep', ref: 'results:segFoodPrep', label: 'Food Preparation' },
        { key: 'beautyhome', ref: 'results:segBeautyHome', label: 'Beauty & Home Environment' },
      ],
    },
    {
      key: 'brand',
      label: 'Brand',
      sub: 'Shark vs Ninja',
      lede: 'The 10-K describes two brands but never sizes them; the investor presentation does. Ninja is now the larger of the two — a reversal from the company\'s own origin, where Shark (2007) predates Ninja (2009) and floorcare was the entire business.',
      note: 'FY2025: Shark $3.0Bn across 15 sub-categories, Ninja $3.4Bn across 23. Ninja has also entered nearly twice as many new sub-categories in the last three years (seven vs four). The annual split sums exactly to reported net sales and rounds to the deck\'s figures, which is what establishes it as a company disclosure rather than third-party tracking.',
      caveat: 'The ANNUAL split is company-disclosed; the quarterly split and the pre-FY2025 years are Bloomberg\'s own allocation and were not verified.',
      views: ['q', 'y'],
      series: [
        { key: 'shark', ref: 'results:brandShark', label: 'Shark' },
        { key: 'ninja', ref: 'results:brandNinja', label: 'Ninja' },
      ],
    },
    {
      key: 'geography',
      label: 'Geography',
      sub: 'Domestic vs International',
      lede: 'The one split the 10-K itself discloses, and the pillar contributing roughly 40% of growth. International reached $2.1Bn in FY2025 on a 31% CAGR since FY2020, and grew 36.6% in 2Q26 — the fastest of any cut on this tab.',
      note: 'International is two stories stacked. The first is going DIRECT: the UK went direct in 2014 and became the template, Germany and France followed in 2020, Spain and Italy in 2021; management said on the 2Q26 call it is "now done for the foreseeable future with these distributor conversions," and the new DTC platform finished rolling out across the major international markets in the same quarter. Mexico converted a year earlier, which is why 1Q25 international growth reads artificially low. The second story is taking the EXISTING catalogue abroad: a year ago SharkNinja sold a "low double-digit number of categories" in each of France and Germany, and by 2Q26 that was up over 50%, almost entirely from established core products — with management estimating it is still under 10% penetrated on an overall category basis across EMEA.',
      caveat: 'No margin exists for this cut either — Domestic and International are operating segments but are aggregated for reporting, so no segment profit is disclosed.',
      views: ['q', 'y'],
      series: [
        { key: 'domestic', ref: 'results:regionNA', label: 'Domestic' },
        { key: 'international', ref: 'results:regionIntl', label: 'International' },
      ],
    },
  ],

  // ── Customers ────────────────────────────────────────────────────────────────────────────
  customers: {
    classes: [
      { key: 'bigbox', label: 'Big-box & mass retail', where: 'FY2025 Form 10-K, Item 1',
        text: 'Mass merchants and warehouse clubs — Amazon, Costco and Walmart are each individually over 10% of net sales. 36 US retail partners and 180+ globally as of Dec 31, 2025.' },
      { key: 'specialty', label: 'Specialty retail', where: 'FY2025 Form 10-K, Item 1',
        text: 'Category retailers, increasingly including doors that did not previously carry the category at all — Ulta took the Shark ChillPill in 2Q26, the first SharkNinja product there outside hair and skin care.' },
      { key: 'ecom', label: 'E-commerce marketplaces / pure players', where: 'Q2 2026 earnings call',
        text: 'Amazon globally, Mercado Libre in Latin America, Allegro in Poland. Management states the brands are the most searched on the pure-player sites.' },
      { key: 'dtc', label: 'Direct-to-consumer & social commerce', where: 'Q2 2026 earnings call',
        text: 'Own sites, re-platformed onto Salesforce and live across the major international markets by 2Q26, plus TikTok Shop in seven countries at quarter-end against zero a year earlier. Structurally higher gross margin than retail, per the CFO.' },
    ],
    concentration: {
      disclosed: true,
      note: 'Unlike many consumer-products companies, SharkNinja discloses real concentration numbers rather than staying silent. The largest single customer was 23.8% of FY2025 net sales; Amazon, Costco and Walmart were each individually above 10% and 45.7% combined. What is NOT disclosed is channel mix: the CEO said plainly on the 2Q26 call, "We don\'t break out the percentage of our D2C business." The company also states it never practises retailer exclusivity.',
    },
  },
};
