// overviews/sharkninja-deck-data.js — FROZEN numbers read off SharkNinja's own investor decks, for the
// visual Miscellaneous panes (Capex · M&A · Other Analysis · Marketing Strategy · TAM).
//
// Four decks carry the same slides a year apart, so the same figure can be read as a series:
//   D23 · Investor presentation, Jul 2023 (IPO / spin-off free-writing prospectus) — figures "as of Dec 31, 2022"
//   D24 · Investor presentation, Mar 2024 — "as of Dec 31, 2023"
//   D25 · Investor presentation, Mar 2025 — "as of Dec 31, 2024"
//   D26 · Investor presentation, Aug 2026 (Q2 2026 roadshow) — "as of Dec 31, 2025" (capital structure Jun 30, 2026)
// Read from the rendered slides (the PDFs via Quartr), Sep 16 2026, and frozen. Nothing is fetched at
// runtime. Every block carries its slide links. Figures are the decks' own rounding ($3.7bn, 3,000+).
//
// Caveats kept on purpose:
//  • Markets: D26 slide 4 says 38 markets, while the footnote on D26 slide 18 says 35 as of Dec 31 2025.
//    38 is used (it matches the 10-K); the conflict is noted in the pane.
//  • Net sales: the Dec 2022 figure ($3.7bn) includes APAC; adjusted net sales ex-APAC were $3.6bn.
//  • US market share: D24/D25/D26 are all Circana dollar sales on a 2020 base, so they chain. D23 is NPD on
//    a 2019 base and is kept as its own view, not spliced in.
//  • UK market share: GfK VOLUME in D24/D25, GfK VALUE (GBP) in D26, and the 2020 base differs between
//    D24 and D25 (Fryers 20% vs 26%). Each vintage is therefore its own view — never chained.

var QB = 'https://web.quartr.com/companies/15145?companyId=15145&documentId=';
function sl(doc, ev, p){ return QB + doc + '&documentType=slide&eventId=' + ev + '&sp=' + p; }
var D23 = [196264, 86191], D24 = [2530185, 534596], D25 = [2530163, 534580], D26 = [3966451, 661459];
function s23(p){ return sl(D23[0], D23[1], p); }
function s24(p){ return sl(D24[0], D24[1], p); }
function s25(p){ return sl(D25[0], D25[1], p); }
function s26(p){ return sl(D26[0], D26[1], p); }

export var SN_DECK = {

  // ── "Who We Are" — the same eight tiles in every deck ─────────────────────────────────────────
  scale: {
    labels: ['Dec 2022', 'Dec 2023', 'Dec 2024', 'Dec 2025'],
    decks: ['Jul 2023 deck', 'Mar 2024 deck', 'Mar 2025 deck', 'Aug 2026 deck'],
    links: [s23(6), s24(4), s25(4), s26(4)],
    tiles: [
      { k: 'sales',     label: 'Net sales',         unit: '$B', v: [3.7, 4.3, 5.5, 6.4], fmt: function(x){ return '$' + x.toFixed(1) + 'B'; } },
      { k: 'markets',   label: 'Markets',           unit: 'n',  v: [26, 32, 35, 38] },
      { k: 'subcats',   label: 'Sub-categories',    unit: 'n',  v: [27, 31, 36, 38] },
      { k: 'patents',   label: 'Patents',           unit: 'n',  v: [3000, 4500, 5200, 5500], plus: true },
      { k: 'retailers', label: 'Retailers globally', unit: 'n', v: [150, 150, 170, 180], plus: true },
      { k: 'employees', label: 'Employees',         unit: 'n',  v: [2800, 3000, 3600, 4000], plus: true },
    ],
    note: 'Each deck\'s "Who We Are" slide. Net sales CAGR since the fiscal year ended Mar 2008 read 20% (to 2022 and 2023) and 21% (to 2024 and 2025); innovation centres went 5 → 6 in 2024. Dec 2022 net sales include APAC (ex-APAC $3.6B). Markets: the Aug 2026 deck says 38 on slide 4 but 35 in the slide 18 footnote.',
  },

  // ── "Two Scaled, Diverse and Growing Brands" ──────────────────────────────────────────────────
  brands: {
    labels: ['2022', '2023', '2024', '2025'],
    shark: [2.0, 2.2, 2.6, 3.0],
    ninja: [1.7, 2.1, 2.9, 3.4],
    links: [s23(8), s24(6), s25(5), s26(5)],
    newSubcats: {
      Shark: ['Carpet Extractors', 'Workshop Vacs', 'Fans', 'Skincare'],
      Ninja: ['Outdoor Ovens', 'Carbonation Drink System', 'Drinkware', 'Coolers', 'Frozen Drink System', 'Propane Grills', 'Fire Pits'],
      note: 'The sub-categories the Aug 2026 deck (slide 5) names as entered in the last three years — 4 Shark, 7 Ninja.',
    },
    note: 'Net sales by brand, $B, as printed on each deck. 2022–2023 from the "Highly Diversified Business" pie (2022 ex-APAC); 2024–2025 from the "Two Scaled Brands" slide. Ninja overtook Shark in 2024.',
  },

  // ── "Growing Share in Our Existing Categories" ────────────────────────────────────────────────
  shareUS: {
    views: [
      { id: 'circana', label: '2020 → 2025 (Circana)',
        cats: ['Upright vacuum', 'Stick vacuum', 'Robot vacuum', 'Bare floor', 'Blender', 'Multi-cooker', 'Toaster oven', 'Air fryer', 'Coffee'],
        years: ['2020', '2023', '2024', '2025'],
        data: [
          [39, 27, 20, 29, 35, 28, 14, 15, 5],
          [45, 31, 32, 38, 42, 35, 23, 33, 9],
          [47, 33, 37, 36, 50, 31, 22, 35, 9],
          [50, 35, 34, 39, 51, null, 23, 45, 14],
        ],
        links: [s24(13), s24(13), s25(14), s26(14)],
        note: 'Circana Retail Tracking Service, US dollar sales, 52 weeks ended early January of the following year, against the 52 weeks ended Jan 2 2021. The 2020 base is identical in all three decks, so the years chain. Multi-cooker was dropped from the Aug 2026 slide.' },
      { id: 'npd', label: '2019 → 2022 (NPD, IPO deck)',
        cats: ['Upright vacuum', 'Stick vacuum', 'Robot vacuum', 'Bare floor', 'Blender', 'Multi-cooker', 'Toaster oven', 'Electric grill', 'Air fryer', 'Coffee'],
        years: ['2019', '2022'],
        data: [
          [38, 24, 15, 30, 32, 22, 4, 28, 12, 5],
          [43, 34, 25, 32, 41, 27, 23, 43, 27, 8],
        ],
        links: [s23(15), s23(15)],
        note: 'NPD Group Retail Tracking Service, as printed in the Jul 2023 IPO deck. A different provider and base year from the Circana view — not chained to it.' },
    ],
  },
  shareUK: {
    views: [
      { id: 'v25', label: '2020 → 2025 (value)', cats: ['Vacuum cleaners', 'Food preparation', 'Fryers', 'Multi-cooker'], years: ['2020', '2025'],
        data: [[29, 8, 26, 64], [31, 25, 59, 66]], links: [s26(14), s26(14)],
        note: 'GfK MI Sales Tracking, Great Britain, sales value in GBP, Jan–Dec 2020 vs Jan–Dec 2025.' },
      { id: 'v24', label: '2020 → 2024 (volume)', cats: ['Vacuum cleaners', 'Food preparation', 'Fryers', 'Multi-cooker'], years: ['2020', '2024'],
        data: [[29, 8, 26, 64], [32, 27, 63, 70]], links: [s25(14), s25(14)],
        note: 'GfK Market Intelligence Panelmarket, volume sales, Great Britain, Jan–Dec 2020 vs Jan–Dec 2024.' },
      { id: 'v23', label: '2020 → 2023 (volume)', cats: ['Vacuum cleaners', 'Food preparation', 'Fryers', 'Electrical cooking pots'], years: ['2020', '2023'],
        data: [[29, 8, 20, 39], [30, 21, 60, 53]], links: [s24(13), s24(13)],
        note: 'GfK Panelmarket, volume sales, Great Britain, Jan–Dec 2020 vs Jan–Dec 2023. Note the 2020 base here differs from the 2024 deck\'s (Fryers 20% vs 26%) — each vintage stands alone.' },
      { id: 'v22', label: '2019 → 2022 (IPO deck)', cats: ['Vacuum cleaners', 'Food preparation', 'Fryers', 'Electrical cooking pots'], years: ['2019', '2022'],
        data: [[22, 5, 2, 11], [32, 17, 43, 60]], links: [s23(15), s23(15)],
        note: 'GfK volume and value sales, Great Britain and/or the United Kingdom, as printed in the Jul 2023 IPO deck.' },
    ],
    read: 'Every category shown sits above its 2020 share in both countries — "taking share from competitors priced both above and below" — though not in a straight line (US robot vacuums 37% in 2024, 34% in 2025). The biggest gains are in cooking: US air fryers 15% → 45%, UK fryers 26% → 59%.',
  },

  // ── "Entering New Geographies" ────────────────────────────────────────────────────────────────
  intl: {
    labels: ['2022', '2023', '2024', '2025'],
    sales: [795, 1200, 1700, 2100],
    cagr: ['21% CAGR 2020–22', '32% CAGR 2020–23', '34% CAGR 2020–24', '31% CAGR 2020–25'],
    markets: [26, 32, 35, 38],
    links: [s23(18), s24(16), s25(18), s26(18)],
    direct: [
      { c: 'United States', y: 'home' }, { c: 'Canada', y: 'home' },
      { c: 'United Kingdom', y: '2014' }, { c: 'Germany', y: '2020' }, { c: 'France', y: '2020' },
      { c: 'Italy', y: '2021' }, { c: 'Spain', y: '2021' }, { c: 'Mexico', y: '2025' },
    ],
    note: 'International = net sales outside North America, as each deck printed it ($795MM, $1.2Bn, $1.7Bn, $2.1Bn); in the IPO deck it also "contributed 26% of growth from 2020–2022". Years are the decks\' entry dates. Mexico first appears on the Aug 2026 map (converted to direct about a year before the Q2 2026 call); Italy and Spain finished moving off distributors only in 2Q26.',
  },

  // ── "Highly Diversified Business" — the region pie ────────────────────────────────────────────
  regions: {
    labels: ['2022', '2023'],
    series: [
      { k: 'na', label: 'North America', v: [78.6, 71.0] },
      { k: 'uk', label: 'United Kingdom', v: [13.3, 19.7] },
      { k: 'eu', label: 'Other Europe', v: [3.6, 5.5] },
      { k: 'row', label: 'Rest of world', v: [4.5, 3.8] },
    ],
    links: [s23(8), s24(6)],
    note: 'Share of net sales, %. 2022 excludes APAC ($3.7B adjusted base); 2023 includes it ($4.3B). The decks stopped printing this pie after Mar 2024.',
  },

  // ── Net sales growth contribution (D26 slides 20–21) ──────────────────────────────────────────
  pillars: [
    { k: 'existing', label: 'Existing categories', v: 40, def: 'Categories launched at least 2 years earlier, Domestic segment' },
    { k: 'newcats', label: 'New & adjacent', v: 20, def: 'Any category launched in any geography in the last 2 years' },
    { k: 'intl', label: 'International', v: 40, def: 'Categories launched at least 2 years earlier, International segment' },
  ],
  pillarsLink: s26(20), launchYearLink: s26(21),

  // ── Supply chain map (D23 slide 42 → D26 slide 10) ────────────────────────────────────────────
  supply: {
    then: { label: 'Jul 2023', countries: ['China', 'Vietnam', 'Thailand', 'Malaysia', 'Indonesia', 'Singapore'], link: s23(42) },
    now:  { label: 'Aug 2026', countries: ['China', 'Vietnam', 'Thailand', 'Malaysia', 'Indonesia', 'Cambodia'], link: s26(10) },
    facts: [
      { v: '100%', l: 'of products made by third-party suppliers', s: 'every deck' },
      { v: '~50%', l: 'of volume from suppliers of 10+ years', s: 'Jul 2023 deck' },
      { v: '6', l: 'sourcing countries', s: 'dual-sourcing on key products' },
    ],
  },

  // ── Capital structure (the same table in every deck) ──────────────────────────────────────────
  capital: {
    labels: ['Mar 2023 pro forma', 'Dec 2023', 'Dec 2024', 'Jun 2026'],
    cash: [147, 154, 364, 780],
    debt: [810, 805, 780, 719],
    netDebt: [663, 651, 416, -61],
    ebitda: [538, 720, 951, 1212],
    lev: ['1.2x', '0.9x', '0.4x', '(0.05x)'],
    links: [s23(54), s24(24), s25(27), s26(27)],
    note: '$M, each deck\'s "Capital Structure Overview". Mar 2023 pro forma = after the $810M term loan that funded the separation (the pre-spin actual was $400M debt, 0.4x). Leverage = net debt / LTM adjusted EBITDA, as the company defines both.',
  },

  // ── JS Global — the agreements that replaced the parent (D23 slide 52, D24 slide 25) ───────────
  jsGlobal: {
    cards: [
      { t: 'Supply chain services', items: ['Sourcing and procurement', 'Supplier management and supply chain strategy'], end: 'Fee ended Jul 31, 2025' },
      { t: 'Product development agreement', items: ['R&D services'], end: '' },
      { t: 'Brand licence agreement', items: ['Non-exclusive rights for JS Global to obtain, produce and source', 'Exclusive rights for JS Global to distribute and sell in APAC'], end: 'APAC stays with JS Global' },
    ],
    links: [s23(52), s24(25)],
  },

  // ── FY2026 outlook as of Aug 5 2026 (D26 slide 26) ────────────────────────────────────────────
  outlook: {
    rows: [
      { k: 'eps', label: 'Adjusted EPS', unit: '$', prior: [6.00, 6.10], now: [6.45, 6.55], tariff: 0.15, fmt: function(x){ return '$' + x.toFixed(2); } },
      { k: 'ebitda', label: 'Adjusted EBITDA', unit: '$M', prior: [1290, 1300], now: [1357, 1369], tariff: 30, fmt: function(x){ return '$' + Math.round(x).toLocaleString('en-US') + 'M'; } },
    ],
    sales: { prior: '+11.5% to +12.5%', now: '+16.0% to +17.0%' },
    link: s26(26),
    note: 'Midpoints of the ranges. Of the raise, the company attributes ~$0.15 of the $0.45 EPS increase and ~$30M of the $67–69M EBITDA increase to the expected net tariff refund; the net sales raise carries none.',
  },

  // ── Marketing — how the decks describe it ─────────────────────────────────────────────────────
  funnel: {
    link: s26(11),
    lede: 'The story is developed alongside the product, not after it.',
    steps: [
      { stage: 'Product development', t: 'Command attention', d: 'Marketing-first products: cultural moments built into the design.' },
      { stage: 'Product validation', t: 'Connect with culture', d: 'Influencers, celebrities, press and editors use and review the product.' },
      { stage: 'Reviews & seeding', t: 'Convert relentlessly', d: 'Fast content from reviews and comments, pushed into full-funnel media.' },
    ],
  },
  demand: {
    link: s26(12),
    create: ['National TV & infomercial', 'Digital & streaming TV', 'Paid social & search', 'Press & influencer', 'Affiliates & promos'],
    fulfil: ['Brick-and-mortar retail', 'Online retail / .com', 'Direct to consumer', 'International'],
    rule: 'No retailer exclusivity, ever',
  },
  storytelling: {
    link: s25(11),
    long: ['Infomercials every year since 2009', 'Stories built around a consumer pain point', 'Demonstrates the technology'],
    short: ['15- and 30-second commercials', 'Social, display and search', 'YouTube · Pinterest · Instagram · Facebook · TikTok', 'Data-driven media planning'],
    base: 'In-house marketing and data team, and a production studio in Irvine, California.',
  },
  engagement: {
    link: s23(35),
    tiles: [
      { v: '+120%', l: 'Ninja social followers', s: '2020 → 2022' },
      { v: '+2,000%', l: 'Ninja "likes"', s: '2020 → 2022' },
      { v: '250MM+', l: 'SharkBeauty TikTok views', s: 'since Aug 2022' },
      { v: '94%', l: 'Aided brand awareness', s: 'US survey, Q4 2022' },
    ],
  },
};
