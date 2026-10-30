// segments-data/googl.js — the Top Line dataset for Alphabet (NASDAQ: GOOGL).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/GOOGL.md.
//
// SHAPE OF THIS COMPANY: Google reported in two segments — Google Services (advertising on Search, YouTube and
// partner sites, plus subscriptions, Play and devices) and Google Cloud — and every non-Google business together as
// Other Bets. Costs Alphabet does not allocate (mostly Google DeepMind's frontier-model research) sit in
// "Alphabet-level activities", which is not a revenue segment.
//
// Every segment series is a POINTER into js/results-data/googl.js (`results:<key>`), so each number has one home.
// The engine reads `act` and falls back to `summit` (frozen: 2026-10-29 snapshot; 3Q26 keeps the 2026-08-06 pre-print figure), never `cons`.
// KPI series (paid clicks, cost-per-click, impressions, cost-per-impression — year-on-year change — and the revenue
// backlog) are held in `shared`, from Bloomberg's record of the reported values (BBG_CONSENSUS.txt, reported columns
// of each snapshot); every 2Q26 value matches the 2Q26 10-Q. 3Q26 (Oct 29 2026): typed from the 3Q26 10-Q (acc.
// 0001652044-26-000084, Monetization Metrics and Note 2), before Bloomberg records it. Bloomberg has no 4Q23 value for the four rates, so that
// quarter is empty (playbook rule 7). TAC rate is derived (TAC ÷ Google advertising revenue, both from Results).
//
// TEXT CHIPS: `tenK` = FILING, verbatim from the FY2025 10-K (SEC EDGAR, acc. 0001652044-26-000018) or the 2Q26 10-Q
// (acc. 0001652044-26-000071), with the location; `summary` / `brief` / `sells` / `what` = OURS.

var TENK = 'FY2025 Form 10-K';
var TENQ = 'Q2 2026 Form 10-Q';
var URL_K = 'https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/goog-20251231.htm';
var NO10 = { disclosed: true,
  note: 'No individual customer or groups of affiliated customers represented more than 10% of our revenues in 2023, 2024, or 2025.',
  where: TENK + ', Note 2 (Revenues)' };
var ADS = { text: 'Our advertising solutions help millions of companies grow their businesses through our wide range of products across devices and formats, and we aim to ensure positive user experiences by serving the right ads at the right time and by building deep partnerships with brands and agencies.',
            where: TENK + ', Item 1 — How We Make Money' };
var CLOUDC = { text: 'Google Cloud generates revenues primarily from consumption-based fees and subscriptions for infrastructure, platform, applications, and other cloud services.',
               where: TENK + ', Item 1 — Google Cloud' };
var SUBS = { text: 'consumer subscriptions, which primarily include revenues from YouTube services, such as YouTube TV, YouTube Music and Premium, and NFL Sunday Ticket, as well as Google One, which offers access to our most capable Gemini models',
             where: TENK + ', Item 7 — Google subscriptions, platforms, and devices' };
var Q = ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26'];
function qmap(vals){ var o = {}; Q.forEach(function(p, i){ if (vals[i] != null) o[p] = vals[i]; }); return o; }
var KPI_SRC = 'Alphabet 10-Q / 10-K (Monetization Metrics), as recorded by Bloomberg';

export var googlSegments = {
  company: 'Alphabet',
  updated: 'Oct 2026',
  source: 'Segment revenue and operating income: Alphabet 10-K and 10-Q filings (SEC EDGAR), through the Results dataset; Summit DCF model, snapshot 2026-10-29 (frozen, not live) for forecast periods. KPIs: Alphabet\'s reported monetization metrics and revenue backlog as recorded by Bloomberg (BBG_CONSENSUS.txt), checked against the 2Q26 10-Q. Revenue by geography: FY2025 10-K, Note 2. Customers: FY2025 10-K.',

  axis: {
    q: ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'],
    y: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
  },

  shared: {
    clicks: { label: 'Paid clicks change (YoY)', short: 'Paid clicks YoY', unit: 'pct', scope: 'segment', src: KPI_SRC,
      q: { act: qmap([0.08, 0.08, 0.07, null, 0.05, 0.06, 0.04, 0.05, 0.02, 0.04, 0.07, 0.11, 0.13, 0.13, 0.08]) } },
    cpc: { label: 'Cost-per-click change (YoY)', short: 'CPC YoY', unit: 'pct', scope: 'segment', src: KPI_SRC,
      q: { act: qmap([-0.07, -0.03, 0.04, null, 0.08, 0.07, 0.08, 0.05, 0.07, 0.08, 0.07, 0.06, 0.05, 0.03, 0.04]) } },
    impr: { label: 'Impressions change (YoY)', short: 'Impressions YoY', unit: 'pct', scope: 'segment', src: KPI_SRC,
      q: { act: qmap([-0.05, 0.00, -0.03, null, -0.13, -0.17, -0.14, 0.00, -0.05, -0.06, -0.05, -0.12, -0.09, -0.12, -0.14]) } },
    cpi: { label: 'Cost-per-impression change (YoY)', short: 'CPI YoY', unit: 'pct', scope: 'segment', src: KPI_SRC,
      q: { act: qmap([-0.05, -0.05, 0.01, null, 0.14, 0.13, 0.15, -0.02, 0.04, 0.06, 0.06, 0.12, 0.06, 0.13, 0.14]) } },
    rpo: { label: 'Revenue backlog (remaining performance obligations)', short: 'Revenue backlog', unit: 'usdM', scope: 'company',
      src: 'Alphabet 10-Q / 10-K (Note 2), as recorded by Bloomberg (BS_REMAINING_PERFORMANCE_OBLIG)',
      q: { act: qmap([61700, 60600, 64900, 74100, 72500, 78800, 86800, 93200, 92400, 108200, 157700, 242800, 467600, 519500, 567700]) } },
    g_us: { label: 'United States', short: 'United States', unit: 'usdM', scope: 'company', src: TENK + ' Note 2, by customer address',
      y: { act: { '2023': 146286, '2024': 170447, '2025': 194229 } } },
    g_emea: { label: 'EMEA', short: 'EMEA', unit: 'usdM', scope: 'company', src: TENK + ' Note 2, by customer address',
      y: { act: { '2023': 91038, '2024': 102127, '2025': 117152 } } },
    g_apac: { label: 'APAC', short: 'APAC', unit: 'usdM', scope: 'company', src: TENK + ' Note 2, by customer address',
      y: { act: { '2023': 51514, '2024': 56815, '2025': 67680 } } },
    g_oam: { label: 'Other Americas', short: 'Other Americas', unit: 'usdM', scope: 'company', src: TENK + ' Note 2, by customer address',
      y: { act: { '2023': 18320, '2024': 20418, '2025': 23902 } } },
  },
  derived: {
    tacRate: { num: 'results:tac', den: 'results:ads', unit: 'pct', label: 'TAC rate (TAC ÷ Google advertising revenue)', short: 'TAC rate' },
    svcMargin: { num: 'results:svcop', den: 'results:svc', unit: 'pct', label: 'Google Services operating margin', short: 'Services margin' },
    cloudMargin: { num: 'results:cloudop', den: 'results:cloud', unit: 'pct', label: 'Google Cloud operating margin', short: 'Cloud margin' },
  },

  overview: {
    tenK: { text: 'Alphabet is a collection of businesses — the largest of which is Google. We report Google in two segments, Google Services and Google Cloud, and all non-Google businesses collectively as Other Bets.',
            where: TENK + ', Item 1 — Overview' },
  },

  segments: [
    {
      key: 'svc', label: 'Google Services', short: 'Services',
      tenK: { text: 'Google Services includes products and services such as ads, Android, Chrome, devices, Google Maps, Google Play, Search, and YouTube.',
              where: TENK + ', Note 15 (Information about Segments and Geographic Areas)', verbatim: true },
      summary: 'Where the money is made today: about 85% of FY2025 revenue and about 91% of the operating income the two Google segments earn, mostly from ads sold by auction on Search and YouTube.',
      brief: 'Everything consumer-facing. Advertisers pay to show ads against searches, in YouTube videos and on partner sites and apps, priced largely through real-time auctions. On top of the ads sit paid services — YouTube Premium and TV, Google One — plus the Play store\'s cut of app sales and Pixel devices.',
      sells: [
        { name: 'Search ads', what: 'Ads shown against searches on Google, Maps, Gmail and Play, including in AI Overviews and AI Mode.' },
        { name: 'YouTube ads', what: 'Ads in YouTube videos and in Shorts.' },
        { name: 'Network ads', what: 'Ads Alphabet places on partner sites and apps through AdSense, AdMob and Google Ad Manager.' },
        { name: 'Subscriptions, Play and devices', what: 'YouTube Premium, Music and TV, NFL Sunday Ticket, Google One, Play store fees and Pixel hardware.' },
      ],
      products: [
        { name: 'Google Search & other', what: 'Search ads — including in AI Overviews and AI Mode — plus ads on Gmail, Maps and Play. About 56% of Alphabet\'s revenue.',
          tenK: { text: 'Google Search & other, which includes revenues generated on Google search properties (including revenues from traffic generated by search distribution partners who use Google.com as their default search in browsers, toolbars, etc.), and other Google owned and operated properties like Gmail, Google Maps, and Google Play',
                  where: TENK + ', Item 7 — Google Advertising' },
          customers: { archetype: ADS, named: [], concentration: NO10.note } },
        { name: 'YouTube ads', what: 'In-stream, Shorts and connected-TV ads on YouTube — direct-response and brand campaigns.',
          tenK: { text: 'YouTube ads, which includes revenues generated on YouTube properties', where: TENK + ', Item 7 — Google Advertising' },
          customers: { archetype: ADS, named: [], concentration: NO10.note } },
        { name: 'Google Network', what: 'Ads on third-party sites and apps (AdSense, AdMob, Google Ad Manager), booked gross of the share paid to those partners.',
          tenK: { text: 'Google Network, which includes revenues generated on Google Network properties participating in AdMob, AdSense, and Google Ad Manager',
                  where: TENK + ', Item 7 — Google Advertising' },
          customers: { archetype: ADS, named: [], concentration: NO10.note } },
        { name: 'Subscriptions, platforms & devices', what: 'YouTube Premium, Music and TV, NFL Sunday Ticket and Google One (with Gemini models); Play app sales; Pixel phones and watches.',
          tenK: SUBS,
          customers: { archetype: SUBS, named: [], concentration: 'Consumers; no customer concentration is disclosed.' } },
      ],
      kpis: [
        { name: 'Paid clicks change', definition: 'Year-on-year change in clicks on ads on Google Search & other properties — the volume half of Search revenue.',
          source: KPI_SRC, periodicity: 'Quarterly', series: 'shared:clicks', unit: 'pct',
          filing: 'Paid clicks represent engagement by users and include clicks on advertisements by end-users on Google search properties and other Google owned and operated properties including Gmail, Google Maps, and Google Play.',
          filingWhere: TENK + ', Item 7 — Monetization Metrics' },
        { name: 'Cost-per-click change', definition: 'Year-on-year change in what advertisers pay per click — the price half of Search revenue, set by the auction.',
          source: KPI_SRC, periodicity: 'Quarterly', series: 'shared:cpc', unit: 'pct',
          filing: 'Cost-per-click is defined as click-driven revenues divided by our total number of paid clicks and represents the average amount we charge advertisers for each engagement by users.',
          filingWhere: TENK + ', Item 7 — Monetization Metrics' },
        { name: 'Impressions change', definition: 'Year-on-year change in ads displayed on Google Network partner sites and apps — Network volume.',
          source: KPI_SRC, periodicity: 'Quarterly', series: 'shared:impr', unit: 'pct',
          filing: 'Impressions include impressions displayed to users on Google Network properties participating primarily in AdMob, AdSense, and Google Ad Manager.',
          filingWhere: TENK + ', Item 7 — Monetization Metrics' },
        { name: 'Cost-per-impression change', definition: 'Year-on-year change in what advertisers pay per Network impression — Network price.',
          source: KPI_SRC, periodicity: 'Quarterly', series: 'shared:cpi', unit: 'pct',
          filing: 'Cost-per-impression is defined as impression-based and click-based revenues divided by our total number of impressions, and represents the average amount we charge advertisers for each impression displayed to users.',
          filingWhere: TENK + ', Item 7 — Monetization Metrics' },
        { name: 'TAC rate', definition: 'Traffic acquisition costs as a share of Google advertising revenue — what Alphabet pays distribution partners (Apple and others) and Network partners for the traffic. Derived here from the reported TAC and advertising revenue.',
          source: 'Derived from the Results dataset (10-K / 10-Q)', periodicity: 'Quarterly', series: 'tacRate', unit: 'pct',
          filing: 'Our overall TAC as a percentage of our advertising revenues ("TAC rate") has been decreasing primarily due to a revenue mix shift from Google Network properties to Google Search & other properties.',
          filingWhere: TENK + ', Item 7 — Trends in Our Business' },
      ],
      kpiNote: 'Alphabet publishes four monetization metrics each quarter, as year-on-year changes only: paid clicks and cost-per-click for Search & other, impressions and cost-per-impression for Network. It publishes no absolute number of clicks or searches, no absolute price, and no YouTube volume or price metric. Bloomberg has no 4Q23 value for the four rates.',
      interactions: [
        { name: 'Paid clicks × cost-per-click', relation: 'Search & other revenue growth ≈ (1 + paid clicks change) × (1 + cost-per-click change) − 1', bridge: null,
          lines: ['Search ads'],
          why: 'The price × volume identity of Search. Volume (paid clicks) comes from more queries and more commercial queries; price (cost-per-click) comes from the auction. Is the price increase durable? Cost-per-click fell in 1Q–2Q23 (−7%, −3%), rose 4–8% a year through 2024–25 and slowed to +3% in 2Q26 as clicks accelerated to +13%. Alphabet does not set or announce prices — the auction does — and discloses no cost per click; the cost that moves with Search revenue is TAC, whose rate fell from 21.5% of ad revenue (1Q23) to 19.8% (2Q26).',
          data: 'Both rates are charted in the KPIs above. NOT CHARTED as a bridge: Alphabet publishes rates, not levels. Check: 2Q26 (1.13 × 1.03) − 1 = 16.4% vs Search & other revenue +16.8%.' },
        { name: 'Impressions × cost-per-impression', relation: 'Google Network revenue growth ≈ (1 + impressions change) × (1 + cost-per-impression change) − 1', bridge: null,
          lines: ['Network ads'],
          why: 'The same identity for partner sites and apps: impressions have shrunk in most quarters since 2024 while the price per impression rose, leaving Network revenue roughly flat.',
          data: 'Both rates are charted in the KPIs above. NOT CHARTED as a bridge. Check: 2Q26 (0.88 × 1.13) − 1 = −0.6% vs Network revenue −0.7%.' },
      ],
      bridges: [], highlights: [],
      drivers: { rev: { from: 'results:svc' }, opinc: { from: 'results:svcop' } },
    },
    {
      key: 'cloud', label: 'Google Cloud', short: 'Cloud',
      tenK: { text: 'Google Cloud includes infrastructure and platform services, applications, and other services for enterprise customers.',
              where: TENK + ', Note 15 (Information about Segments and Geographic Areas)', verbatim: true },
      summary: 'The growth engine: about 15% of FY2025 revenue, +82% year on year in 2Q26, with a revenue backlog of $513.9B at Jun 30, 2026.',
      brief: 'Computing sold to businesses and governments. Customers rent infrastructure (including Google\'s own TPU chips and NVIDIA GPUs) to train and run AI models, use platform services such as Vertex AI and Gemini Enterprise, and pay per seat for Workspace. Since 2026 Alphabet also sells TPU systems outright, and Wiz (acquired March 2026) adds cloud security.',
      sells: [
        { name: 'AI infrastructure', what: 'Compute, storage and networking on Google Cloud, including TPU and GPU capacity, paid mostly by consumption.' },
        { name: 'TPU systems', what: 'Alphabet\'s own AI chips sold as systems — recorded as Cloud product sales since 2026.' },
        { name: 'AI platform and applications', what: 'Vertex AI, Gemini Enterprise, Workspace seats and Wiz security.' },
      ],
      products: [
        { name: 'Google Cloud Platform', what: 'Infrastructure, data and AI platform services (Vertex AI, Gemini models via API), paid by consumption.',
          tenK: CLOUDC, customers: { archetype: CLOUDC, named: [], concentration: NO10.note } },
        { name: 'TPU systems', what: 'Sales of Alphabet\'s own Tensor Processing Unit systems to customers.',
          tenK: { text: 'Product sales, primarily the sale of TPU systems.', where: TENQ + ', Note 2 (Revenues)' },
          customers: { archetype: CLOUDC, named: [], concentration: NO10.note } },
        { name: 'Google Workspace', what: 'Gmail, Docs, Drive and Meet for organizations, with Gemini built in — sold as subscription seats.',
          tenK: { text: 'communication and collaboration tools for enterprises, such as Gmail, Docs, Calendar, Drive, and Meet, with integrated features like Gemini for Google Workspace.', where: TENQ + ', Note 2 (Revenues)' },
          customers: { archetype: CLOUDC, named: [], concentration: NO10.note } },
        { name: 'Security (Wiz, Mandiant)', what: 'Cloud security: Wiz, acquired on Mar 11, 2026 for $29.5B, and Mandiant threat intelligence.',
          tenK: { text: 'This acquisition represents an investment by Google Cloud to accelerate our capabilities in multicloud and AI-driven security.', where: TENQ + ', Note 8 (Acquisitions and Divestitures)' },
          customers: { archetype: CLOUDC, named: [], concentration: NO10.note } },
      ],
      kpis: [
        { name: 'Revenue backlog', definition: 'Remaining performance obligations: contracted revenue not yet recognized. $519.5B at Jun 30, 2026, of which $513.9B related to Google Cloud; Alphabet expects to recognize just over 50% within 24 months. Charted for the company (Cloud is almost all of it).',
          source: 'Alphabet 10-Q / 10-K (Note 2), as recorded by Bloomberg', periodicity: 'Quarterly', series: 'shared:rpo', unit: 'usdM',
          filing: 'Revenue backlog represents commitments in customer contracts that have not yet been recognized as revenue.',
          filingWhere: TENQ + ', Note 2 (Revenues)' },
        { name: 'Operating margin', definition: 'Google Cloud operating income ÷ Google Cloud revenue.',
          source: 'Derived from the Results dataset (10-K / 10-Q)', periodicity: 'Quarterly', series: 'cloudMargin', unit: 'pct' },
      ],
      kpiNote: 'Alphabet publishes Cloud revenue, operating income and the revenue backlog (with the share expected within 24 months). It publishes no customer count, no capacity figure and no split between infrastructure, TPU sales, platform and Workspace.',
      interactions: [
        { name: 'Backlog × conversion', relation: 'Cloud revenue over the next 24 months ≥ backlog × the share recognized in 24 months', bridge: null,
          lines: ['AI infrastructure', 'TPU systems'],
          why: 'The backlog went from $92.4B (1Q25) to $519.5B (2Q26). Alphabet expects to recognize just over half of it within 24 months — roughly $130B a year from contracts already signed, against $24.8B of Cloud revenue in 2Q26 (about $99B annualized).',
          data: 'The backlog is charted in the KPIs above. NOT CHARTED as a bridge: Alphabet gives the conversion only as "just over 50% over the next 24 months", not by year.' },
      ],
      bridges: [], highlights: [],
      drivers: { rev: { from: 'results:cloud' }, opinc: { from: 'results:cloudop' } },
    },
    {
      key: 'bets', label: 'Other Bets', short: 'Other Bets',
      tenK: { text: 'Revenues from Other Bets are generated primarily from the sale of autonomous transportation services and internet services.',
              where: TENK + ', Note 15 (Information about Segments and Geographic Areas)', verbatim: true },
      summary: 'Under 1% of revenue and a $7.5B operating loss in FY2025; Waymo is the largest of the ventures.',
      brief: 'Every business outside Google, reported together because none is individually material. The largest is Waymo, which sells fully autonomous rides; the others (Verily, Wing and the X incubator) are earlier-stage.',
      sells: [
        { name: 'Waymo', what: 'Paid fully autonomous ride-hailing.' },
        { name: 'Other ventures', what: 'Health data (Verily), drone delivery (Wing) and internet services.' },
      ],
      products: [
        { name: 'Waymo', what: 'Fully autonomous ride-hailing in US cities.',
          tenK: { text: 'Revenues from Other Bets are generated primarily from the sale of autonomous transportation services and internet services.', where: TENK + ', Note 15' },
          customers: { archetype: { text: 'Revenues from Other Bets are generated primarily from the sale of autonomous transportation services and internet services.', where: TENK + ', Note 15' }, named: [], concentration: 'Riders; no customer concentration is disclosed.' } },
      ],
      kpis: [],
      kpiNote: 'Alphabet publishes no unit, ride or price figures for Other Bets in its filings — only the combined revenue and operating loss.',
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:bets' }, opinc: { from: 'results:betsop' } },
    },
  ],

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'Search, YouTube, Network, subscriptions, Cloud, Other Bets',
      lede: 'The same revenue by line, as the 10-K reports it. Search & other is just over half of the total; Cloud is the fastest-growing line.',
      note: 'Quarterly from Alphabet\'s 10-Q filings and 8-K releases; annual from the 10-K. Summit forecast from the 2026-10-29 snapshot. Hedging gains (losses), a few hundred million dollars either way, are left out, so the lines add up to total revenue within that amount.',
      tenK: { text: 'The following table presents revenues by type (in millions)', where: TENK + ', Item 7 — Financial Results' },
      cite: { form: '10-K', period: '2025', accession: '0001652044-26-000018', url: URL_K },
      spans: 'Quarterly 1Q23–2Q26 (10-Q / 8-K); annual from the 10-K.',
      views: ['q', 'y'],
      series: [
        { key: 'search', ref: 'results:search', label: 'Search & other' },
        { key: 'yt', ref: 'results:yt', label: 'YouTube ads' },
        { key: 'net', ref: 'results:net', label: 'Google Network' },
        { key: 'subs', ref: 'results:subs', label: 'Subscriptions, platforms & devices' },
        { key: 'cloud', ref: 'results:cloud', label: 'Google Cloud' },
        { key: 'bets', ref: 'results:bets', label: 'Other Bets' },
      ],
    },
    {
      key: 'geo', label: 'Geography', sub: 'by customer address',
      lede: 'The same revenue by where Alphabet\'s customers are based. The United States is just under half; EMEA is the second region.',
      note: 'Annual only, from the FY2025 10-K (Note 2). Hedging gains (losses) are left out.',
      caveat: 'By customer address, not by where the ads are seen or the cloud is used: a US advertiser reaching users in Asia counts as United States.',
      tenK: { text: 'The following table presents revenues disaggregated by geography, based on the addresses of our customers (in millions)', where: TENK + ', Note 2 (Revenues)' },
      cite: { form: '10-K', period: '2025', accession: '0001652044-26-000018', url: URL_K },
      spans: 'FY2023–FY2025, from the FY2025 10-K.',
      axis: { y: ['2023', '2024', '2025'] },
      views: ['y'],
      series: [
        { key: 'g_us', ref: 'shared:g_us', label: 'United States' },
        { key: 'g_emea', ref: 'shared:g_emea', label: 'EMEA',
          tenK: { text: 'Regions represent Europe, the Middle East, and Africa (EMEA); Asia-Pacific (APAC); and Canada and Latin America ("Other Americas").', where: TENK + ', Note 2 (footnote 1)' } },
        { key: 'g_apac', ref: 'shared:g_apac', label: 'APAC' },
        { key: 'g_oam', ref: 'shared:g_oam', label: 'Other Americas' },
      ],
    },
  ],

  customers: {
    classes: [
      { key: 'advertisers', label: 'Advertisers', where: ADS.where, text: ADS.text },
      { key: 'enterprise', label: 'Enterprises (Google Cloud)', where: CLOUDC.where, text: CLOUDC.text },
      { key: 'consumers', label: 'Consumers (subscriptions, apps, devices)', where: TENK + ', Item 7 — Revenues and Monetization Metrics',
        text: 'We generate revenues by delivering relevant, cost-effective online advertising; cloud-based solutions that provide enterprise customers of all sizes with infrastructure, platform services, and applications; and sales of other products and services, such as fees received for subscription-based products, apps and in-app purchases, and devices.' },
    ],
    concentration: NO10,
  },
};
