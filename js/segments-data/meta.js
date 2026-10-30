// segments-data/meta.js — the Top Line dataset for Meta Platforms (NASDAQ: META).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/META.md.
//
// SHAPE OF THIS COMPANY: two reportable segments (10-K Note 15) — Family of Apps, which earns essentially all
// the money from advertising, and Reality Labs, which sells hardware and runs at a large loss.
//
// Every segment series is a POINTER into js/results-data/meta.js (`results:<key>`), so each number has one
// home. The engine reads `act` and falls back to `summit` (frozen; forward periods from snapshot 2026-10-22,
// refreshed 2026-10-30), never `cons`.
// The KPI series Meta publishes each quarter (ARPP, ad impressions and price per ad growth) are held in
// `shared`, from Bloomberg's record of the reported values (BBG_CONSENSUS.txt, fq0 of each snapshot), which
// matches Meta's 8-K figures.
//
// TEXT CHIPS: `tenK` = FILING, verbatim from the FY2025 10-K (SEC EDGAR, acc. 0001628280-26-003942);
// `summary` / `brief` / `sells` = OURS.
// Known gap (engine, not data): segments.js has no "people" unit, so daily active people (DAP) is quoted in the
// KPI note instead of as its own card — logged in META.md as a request for a shared-engine PR.

var TENK = 'FY2025 Form 10-K';
var NO10 = { disclosed: true,
  note: 'No customer represented 10% or more of total revenue or accounts receivable for the years ended December 31, 2025, 2024, and 2023.',
  where: TENK + ', Note 1 (Summary of Significant Accounting Policies)' };
var MKT = { text: 'Currently, we generate substantially all of our revenue from selling advertising placements on our family of apps to marketers, which is reflected in FoA.',
            where: TENK + ', Item 7 — Revenue and Investments' };
var HW = { text: 'RL generates revenue from sales of consumer hardware products, software, and content.',
           where: TENK + ', Item 7 — Revenue and Investments' };
var Q = ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'];
function qmap(vals){ var o = {}; Q.forEach(function(p, i){ if (vals[i] != null) o[p] = vals[i]; }); return o; }

export var metaSegments = {
  company: 'Meta',
  updated: 'Oct 2026',
  source: 'Segment revenue and operating income: Meta 8-K earnings releases and the FY2025 10-K (Note 15), through the Results dataset; Summit DCF model, snapshot 2026-10-22 (frozen, not live) for forecast periods. KPIs: Meta\'s reported ARPP and ad impressions / price-per-ad growth as recorded by Bloomberg (BBG_CONSENSUS.txt). Revenue by geography: 10-K Note 2. Customers: 10-K and Bloomberg Supply Chain Analysis (SPLC, as of Jun 26 2026).',

  axis: {
    q: ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'],
    y: ['2021', '2022', '2023', '2024', '2025', '2026', '2027'],
  },

  shared: {
    arpp: { label: 'Average revenue per person (ARPP)', short: 'ARPP', unit: 'eps', scope: 'company',
      src: 'Meta 8-K, as recorded by Bloomberg (AVERAGE_REVENUE_PER_USER, fq0 of each snapshot)',
      q: { act: qmap([9.47, 10.42, 10.93, null, 11.20, 11.89, 12.29, 14.25, 12.36, 13.65, 14.46, 16.56, 15.66, 16.86]) } },
    impg: { label: 'Ad impressions growth (YoY)', short: 'Impressions YoY', unit: 'pct', scope: 'company',
      src: 'Meta 8-K, as recorded by Bloomberg (NUMBER_OF_ADS_DELIVERED_YOY_PCT)',
      q: { act: qmap([0.26, 0.34, 0.31, 0.21, 0.20, 0.10, 0.07, 0.06, 0.05, 0.11, 0.14, 0.18, 0.19, 0.14]) } },
    priceg: { label: 'Average price per ad growth (YoY)', short: 'Price per ad YoY', unit: 'pct', scope: 'company',
      src: 'Meta 8-K, as recorded by Bloomberg (PRICE_PER_AD_YOY_PERCENTAGE)',
      q: { act: qmap([-0.17, -0.16, -0.06, 0.02, 0.06, 0.10, 0.11, 0.14, 0.10, 0.09, 0.10, 0.06, 0.12, 0.12]) } },
    g_usc: { label: 'US & Canada', short: 'US & Canada', unit: 'usdM', scope: 'company', src: '10-K Note 2, by customer address',
      y: { act: { '2023': 52888, '2024': 63207, '2025': 78866 } } },
    g_eu: { label: 'Europe', short: 'Europe', unit: 'usdM', scope: 'company', src: '10-K Note 2, by customer address',
      y: { act: { '2023': 31210, '2024': 38361, '2025': 46569 } } },
    g_apac: { label: 'Asia-Pacific', short: 'Asia-Pacific', unit: 'usdM', scope: 'company', src: '10-K Note 2, by customer address',
      y: { act: { '2023': 36154, '2024': 45009, '2025': 53817 } } },
    g_row: { label: 'Rest of world', short: 'Rest of world', unit: 'usdM', scope: 'company', src: '10-K Note 2, by customer address',
      y: { act: { '2023': 14650, '2024': 17924, '2025': 21714 } } },
  },
  derived: {
    foaMargin: { num: 'results:foaop', den: 'results:foa', unit: 'pct', label: 'Family of Apps operating margin', short: 'FoA margin' },
  },

  overview: {
    tenK: { text: 'We report our financial results for our two reportable segments: Family of Apps (FoA) and Reality Labs (RL).',
            where: TENK + ', Note 15 (Segment and Geographical Information)' },
  },

  segments: [
    {
      key: 'foa', label: 'Family of Apps', short: 'FoA',
      tenK: { text: 'FoA includes Facebook, Instagram, Messenger, WhatsApp, and other services.',
              where: TENK + ', Note 15 (Segment and Geographical Information)', verbatim: true },
      summary: 'The whole business in money terms: about 99% of revenue and every dollar of operating profit, from ads sold by auction across five apps.',
      brief: 'Facebook, Instagram, Messenger, WhatsApp and Threads, free to use. Businesses pay to show ads in feeds, Stories and Reels; Meta\'s AI decides which ad each person sees and the auction sets the price. A small, fast-growing part comes from businesses paying to message customers on WhatsApp and from Meta Verified subscriptions.',
      sells: [
        { name: 'Ads', what: 'Placements in Facebook, Instagram, Messenger, Threads and WhatsApp, and in third-party apps and websites, bought by auction.' },
        { name: 'Business messaging', what: 'Paid conversations between businesses and their customers on WhatsApp.' },
        { name: 'Meta Verified and payments', what: 'Paid verification subscriptions and net fees from developers using Meta\'s payments infrastructure.' },
      ],
      products: [
        { name: 'Advertising', what: 'Ads in feeds, Stories and Reels across the apps — about 98% of Meta\'s revenue.',
          tenK: { text: 'Marketers purchase ads that can appear in multiple places including on Facebook, Instagram, Messenger, Threads, and WhatsApp, as well as third-party applications and websites.',
                  where: TENK + ', Item 7 — Revenue and Investments' },
          customers: { archetype: MKT, named: [], concentration: NO10.note },
          management: [
            { q: 'Q1 2026', text: 'Enhancements to Lattice’s modeling and learning techniques, along with advances in the GEM model architecture, drove a more than 6% increase in conversion rate for landing page view ads.' },
            { q: 'Q4 2025', text: 'Meta doubled the number of GPUs used to train its GEM model for ads ranking, and a new run-time model across Instagram Feed, Stories and Reels lifted conversion rates 3% in the quarter.' },
          ] },
        { name: 'Other revenue (messaging, Meta Verified, payments)', what: 'WhatsApp paid messaging, Meta Verified subscriptions and developer payment fees — about 1% of revenue, growing about 50% a year.',
          tenK: { text: 'FoA Other revenue, which consists of revenue from paid messaging from WhatsApp, Meta Verified subscriptions, net fees we receive from developers using our Payments infrastructure, and revenue from various other sources.',
                  where: TENK + ', Item 7 — Trends in Our Revenue by User Geography (note)' },
          customers: { archetype: MKT, named: [], concentration: NO10.note } },
      ],
      kpis: [
        { name: 'Average revenue per person (ARPP)', definition: 'Meta\'s quarterly revenue divided by the average number of daily active people in the quarter. Daily active people (DAP) reached 3.60 billion in 2Q26 (3.58B in Dec 2025, +7% YoY per the 10-K); the engine has no unit for a head-count, so DAP is quoted here rather than charted.',
          source: 'Meta 8-K (as recorded by Bloomberg)', periodicity: 'Quarterly', series: 'shared:arpp', unit: 'eps' },
        { name: 'Ad impressions growth', definition: 'Year-on-year change in ads delivered across the Family of Apps — the volume half of advertising revenue.',
          source: 'Meta 8-K (as recorded by Bloomberg)', periodicity: 'Quarterly', series: 'shared:impg', unit: 'pct' },
        { name: 'Average price per ad growth', definition: 'Year-on-year change in the average price advertisers paid per ad — the price half of advertising revenue, set by the auction.',
          source: 'Meta 8-K (as recorded by Bloomberg)', periodicity: 'Quarterly', series: 'shared:priceg', unit: 'pct' },
      ],
      kpiNote: 'Meta publishes four Family of Apps metrics each quarter: daily active people (DAP), average revenue per person (ARPP), and the year-on-year growth of ad impressions and of the average price per ad. It publishes no absolute number of impressions and no absolute price, and no per-app user counts.',
      interactions: [
        { name: 'Impressions × price per ad', relation: 'advertising revenue growth ≈ (1 + impressions growth) × (1 + price-per-ad growth) − 1', bridge: null,
          lines: ['Ads'],
          why: 'The price × volume identity of the ad business. Volume (impressions) comes from more people and more time in feeds and Reels; price comes from the auction, and rises when ads convert better. Is the price increase durable? Price per ad went from −17% (1Q23, after Apple\'s tracking change) to +14% (4Q24) and has held +6–12% since — Meta does not set or announce prices, the auction does, so it rises only while advertisers earn more per dollar. There is no published cost per impression to compare it with; the cost that grows with it is infrastructure (2026 capex guided at $130–145B), which shows in Bottom Line.',
          data: 'Both growth rates are charted in the KPIs above. NOT CHARTED as a bridge: Meta publishes rates, not levels. Check: 2Q26 (1.14 × 1.12) − 1 = 27.7% vs advertising revenue +27.5%.' },
        { name: 'People × revenue per person', relation: 'revenue = average daily active people (DAP) × average revenue per person (ARPP)', bridge: null,
          lines: ['Ads', 'Business messaging'],
          why: 'The audience is close to everyone online outside China, so growth now comes from earning more per person rather than adding people: DAP grew about 3% a year to 2Q26 while ARPP grew about 24%.',
          data: 'ARPP is charted in the KPIs above; DAP is quoted (the engine has no head-count unit). NOT CHARTED as a bridge.' },
      ],
      bridges: [], highlights: [],
      drivers: { rev: { from: 'results:foa' }, opinc: { from: 'results:foaop' } },
    },
    {
      key: 'rl', label: 'Reality Labs', short: 'RL',
      tenK: { text: 'RL includes our virtual and augmented reality related consumer hardware, software, and content.',
              where: TENK + ', Note 15 (Segment and Geographical Information)', verbatim: true },
      summary: 'The long bet: about 1% of revenue and a $19.2B operating loss in FY2025, which Meta expects to peak in 2026.',
      brief: 'Meta\'s hardware for what it sees as the next computing platform: Quest headsets, AI glasses made with EssilorLuxottica (Ray-Ban Meta, Oakley Meta, Meta Ray-Ban Display) and the Horizon software and store. Most of the spend is research for products that are not on sale yet; in 2026 about 70% of it goes to wearables.',
      sells: [
        { name: 'Meta Quest', what: 'Virtual-reality headsets and their content store.' },
        { name: 'AI glasses', what: 'Ray-Ban Meta and Oakley Meta glasses with Meta AI, and Meta Ray-Ban Display with the Neural Band wristband.' },
        { name: 'Horizon', what: 'Meta\'s software and store for VR and mobile.' },
      ],
      products: [
        { name: 'Meta Quest headsets', what: 'VR headsets with passthrough to the real world, and content from the Meta Horizon Store.',
          tenK: HW, customers: { archetype: HW, named: [], concentration: 'Sold to consumers directly and through retailers; Bloomberg SPLC lists distributors such as TD SYNNEX and CDW (Customers tab).' } },
        { name: 'AI glasses', what: 'Ray-Ban Meta, Oakley Meta and Meta Ray-Ban Display, made with EssilorLuxottica.',
          tenK: HW, customers: { archetype: HW, named: [], concentration: 'Sold to consumers directly and through retailers.' },
          management: [
            { q: 'Q1 2026', text: 'Reality Labs revenue was $402 million, down 2% year-over-year on lower Quest headset sales, partly offset by continued strong growth in AI glasses revenue.' },
            { q: 'Q4 2025', text: 'Zuckerberg: Reality Labs losses in 2026 should be similar to 2025, "and this will likely be the peak," with investment directed mostly to glasses and wearables.' },
          ] },
      ],
      kpis: [],
      kpiNote: 'Meta publishes no unit or price figures for Reality Labs — only the segment\'s revenue and operating loss.',
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:rl' }, opinc: { from: 'results:rlop' } },
    },
  ],

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'advertising, other revenue, Reality Labs',
      lede: 'The same revenue by line: advertising and other revenue inside the Family of Apps, and Reality Labs. Advertising is about 98% of the total.',
      note: 'Quarterly from Meta\'s 8-K releases; annual from the 10-K (Note 2). Summit forecast from the 2026-10-22 snapshot.',
      tenK: { text: 'Revenue disaggregated by revenue source and by segment consists of the following', where: TENK + ', Note 2 (Revenue)' },
      cite: { form: '10-K', period: '2025', accession: '0001628280-26-003942', url: 'https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm' },
      spans: 'Quarterly 1Q23–2Q26 (8-K); annual from the 10-K.',
      views: ['q', 'y'],
      series: [
        { key: 'adv', ref: 'results:adv', label: 'Advertising' },
        { key: 'oth', ref: 'results:oth', label: 'Other revenue' },
        { key: 'rl', ref: 'results:rl', label: 'Reality Labs' },
      ],
    },
    {
      key: 'geo', label: 'Geography', sub: 'by customer address',
      lede: 'The same revenue by where Meta\'s customers are based. The US and Canada are about two-fifths; Asia-Pacific is the second region.',
      note: 'Annual only, from the 10-K (Note 2). Meta also charts revenue by user location in its MD&A; that is a different split and is not mixed in here.',
      caveat: 'By customer address, not by where the ads are seen: a US advertiser reaching users in Asia counts as US & Canada.',
      tenK: { text: 'Revenue disaggregated by geography, based on the addresses of our customers, consists of the following', where: TENK + ', Note 2 (Revenue)' },
      cite: { form: '10-K', period: '2025', accession: '0001628280-26-003942', url: 'https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm' },
      spans: 'FY2023–FY2025, from the FY2025 10-K.',
      axis: { y: ['2023', '2024', '2025'] },
      views: ['y'],
      series: [
        { key: 'g_usc', ref: 'shared:g_usc', label: 'US & Canada' },
        { key: 'g_apac', ref: 'shared:g_apac', label: 'Asia-Pacific' },
        { key: 'g_eu', ref: 'shared:g_eu', label: 'Europe',
          tenK: { text: 'Europe includes Russia and Turkey, and Rest of World includes Africa, Latin America, and the Middle East.', where: TENK + ', Note 2 (footnote 2)' } },
        { key: 'g_row', ref: 'shared:g_row', label: 'Rest of world' },
      ],
    },
  ],

  customers: {
    classes: [
      { key: 'marketers', label: 'Marketers (advertisers)', where: MKT.where, text: MKT.text },
      { key: 'consumers', label: 'Consumers (hardware)', where: HW.where, text: HW.text },
      { key: 'developers', label: 'Developers', where: TENK + ', Item 1 — Competition',
        text: 'We compete to attract, engage, and retain people who use our products, to attract and retain businesses that use our free or paid business and advertising services, and to attract and retain developers who build compelling applications that integrate with our products.' },
    ],
    concentration: NO10,
    splc: {
      revBaseM: 200966, revBaseLabel: 'FY2025 revenue',
      coverageWhy: 'Meta\'s advertisers do not report what they spend on Meta, so the companies Bloomberg links to Meta as customers are mostly distributors and retailers of Reality Labs hardware. Together they are a tiny fraction of revenue; the advertiser base itself is not visible from this side.',
      named: 5, sized: 5, sizedSumM: 95.55,
      source: 'Bloomberg Supply Chain Analysis (SPLC), META US Equity, as of Jun 26 2026 — Bloomberg estimates, not Meta filings',
      file: 'Bloomberg SPLC export (META US Equity, customer side, 244 relationships)',
      customers: [
        { name: 'TD SYNNEX', ticker: 'SNX', amtM: 41.01, period: 'Jun 2026', theirPct: null, basis: 'estimate', what: 'IT distributor — Reality Labs hardware' },
        { name: 'Casino Guichard-Perrachon', ticker: 'CO FP', amtM: 35.99, period: 'Jun 2026', theirPct: null, basis: 'estimate', what: 'French retailer' },
        { name: 'CDW', ticker: 'CDW', amtM: 11.55, period: 'Jun 2026', theirPct: null, basis: 'estimate', what: 'IT reseller — Quest for business' },
        { name: 'Insight Enterprises', ticker: 'NSIT', amtM: 4.54, period: 'Jun 2026', theirPct: null, basis: 'estimate', what: 'IT reseller' },
        { name: 'El Puerto de Liverpool', ticker: 'LIVEPOLC MM', amtM: 2.46, period: 'Jun 2026', theirPct: null, basis: 'estimate', what: 'Mexican department store' },
      ],
    },
  },
};
