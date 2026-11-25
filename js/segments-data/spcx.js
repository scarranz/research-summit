// segments-data/spcx.js — the Segments dataset for SpaceX. Same contract as js/segments-data/dhr.js (docs/PANE_CATALOG.md §1);
// rendered by js/segments.js into Deep Dive ▸ Top Line (General · Segments · Other · Customers).
//
// HAND-BUILT. Sources: 424B4 prospectus (Jun 12 2026) — segment note, revenue disaggregation, revenue by geography,
// concentration of risk; Q2 2026 10-Q and Q3 2026 10-Q (Note: concentration of risk); Q3 2026 earnings release and call
// (Oct 20 2026). Segment revenue, operating income, EBITDA and the KPIs that live in js/results-data/spcx.js are POINTERS
// (`from: 'results:<key>'`), never copied. Quarterly segment capex and annual segment D&A are inline below, from the
// same filings (4Q25 = fiscal year less three quarters).
//
// No Summit model exists for SPCX, so every `summit` block is empty on purpose.

export var spcxSegments = {
  company: 'SpaceX',
  updated: 'Nov 2026',
  source: 'Segment revenue, operating income, adjusted EBITDA and KPIs are read from the Results dataset (js/results-data/spcx.js): 424B4 prospectus, Q2 and Q3 2026 10-Q and the Q3 2026 earnings release via SEC EDGAR, 4Q25 derived. Segment capex and D&A from the same filings. Revenue by geography and by type from the 424B4. Customer concentration from the 424B4 and the 10-Qs; named compute contracts from the 424B4 and the 10-Qs. No Summit model.',

  axis: {
    q: ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
    y: ['2023','2024','2025']
  },

  shared: {
    geo_us: { label: 'United States', short: 'United States', unit: 'usdM', src: '424B4 — revenue by geography',
      y: { act: { '2023': 7473, '2024': 10008, '2025': 12966 }, summit: {} } },
    geo_ie: { label: 'Ireland', short: 'Ireland', unit: 'usdM', src: '424B4 — revenue by geography',
      y: { act: { '2023': 1047, '2024': 1371, '2025': 1827 }, summit: {} } },
    geo_ca: { label: 'Canada', short: 'Canada', unit: 'usdM', src: '424B4 — revenue by geography',
      y: { act: { '2023': 447, '2024': 582, '2025': 764 }, summit: {} } },
    geo_oth: { label: 'All other countries', short: 'All other', unit: 'usdM', src: '424B4 — revenue by geography',
      y: { act: { '2023': 1420, '2024': 2054, '2025': 3117 }, summit: {} } },
    products: { label: 'Products (Starlink kits)', short: 'Products', unit: 'usdM', src: '424B4 — revenue by products and services',
      y: { act: { '2023': 1093, '2024': 1470, '2025': 1510 }, summit: {} } },
    services: { label: 'Services', short: 'Services', unit: 'usdM', src: '424B4 — revenue by products and services',
      y: { act: { '2023': 9294, '2024': 12545, '2025': 17164 }, summit: {} } }
  },

  derived: {
    opMgn:    { label: 'Segment operating margin', short: 'Op. margin', unit: 'pct', num: 'opinc', den: 'rev' },
    ebMgn:    { label: 'Segment adjusted EBITDA margin', short: 'EBITDA margin', unit: 'pct', num: 'ebitda', den: 'rev' },
    capexInt: { label: 'Capital expenditure as % of revenue', short: 'Capex %', unit: 'pct', num: 'capex', den: 'rev' },
    daInt:    { label: 'Depreciation & amortisation as % of revenue', short: 'D&A %', unit: 'pct', num: 'da', den: 'rev' },
    revPerMW: { label: 'AI solutions revenue per MW of compute (quarter)', short: '$M per MW', unit: 'x', num: 'aiinfra', den: 'gw' },
    entShare: { label: 'Enterprise & government share of Starlink revenue', short: 'Ent. share', unit: 'pct', num: 'entgov', den: 'rev' }
  },

  overview: {
    tenK: { text: 'We have three reportable segments in our vertically integrated innovation engine: Space, Connectivity, and AI. In our Space segment, we design, manufacture, and launch reusable rockets to provide high cadence, reliable, and affordable access to space at unprecedented scale. In our Connectivity segment, we operate a worldwide high-speed, low-latency broadband data and communications network powered by over 9,600 Starlink broadband and mobile satellites in Low-Earth Orbit, delivering connectivity to millions of consumer, enterprise, and government customers across 164 countries, territories, and other markets. In our AI segment, we operate a highly vertically integrated AI platform spanning our truth-seeking frontier model Grok, AI solutions for consumer and enterprise customers, X—our real-time information, entertainment, and free speech platform—and AI computational infrastructure.',
      where: '424B4 prospectus — Business (the AI segment is called SI, Super Intelligence, from the Q3 2026 release)' }
  },

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'the six lines the company discloses',
      lede: 'The same total cut into the six lines SpaceX reports under its three segments. Two lines carry the story: <b>Starlink consumer</b> was the largest line through 2025, and <b>AI solutions & infrastructure</b> — compute rented to AI labs — went from $0.3B a quarter to $7.0B in five quarters and is now larger than everything else combined.',
      caveat: 'Advertising is X. "AI solutions & infrastructure" mixes rented compute, Grok subscriptions and API, and Cursor (from Aug 2026); the company does not split them.',
      note: 'Quarterly from 1Q25 (4Q25 derived) and annual from FY2023.',
      cite: { form: '10-Q', period: '2026-09-30', accession: '', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=space+exploration+technologies&type=10-Q' },
      views: ['q','y'],
      series: [
        { key: 'consumer', ref: 'results:consumer', label: 'Starlink consumer' },
        { key: 'entgov', ref: 'results:entgov', label: 'Starlink enterprise & government' },
        { key: 'launchsvc', ref: 'results:launchsvc', label: 'Launch services' },
        { key: 'launchdev', ref: 'results:launchdev', label: 'Launch & development' },
        { key: 'ads', ref: 'results:ads', label: 'Advertising (X)' },
        { key: 'aiinfra', ref: 'results:aiinfra', label: 'AI solutions & infrastructure' }
      ]
    },
    {
      key: 'geo', label: 'Geography', sub: 'revenue by country where the sale originated',
      lede: 'Seven-tenths of revenue originates in the United States. <b>Ireland</b> is the booking entity for much of Starlink\'s international business rather than a market of that size, so this is a legal-entity cut, not a map of where subscribers live.',
      caveat: 'By "country of domicile in which the transaction originated" — the selling entity, not the customer\'s location. Annual only.',
      note: 'FY2023–FY2025 from the 424B4. Substantially all long-lived assets are in the United States.',
      tenK: { text: 'The following tables provide revenue by geography based on the country of domicile in which the transaction originated.', where: '424B4 — Notes, segment information' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '424B4', period: '2025-12-31', accession: '', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=space+exploration+technologies&type=424B4' },
      series: [
        { key: 'geo_us', ref: 'shared:geo_us', label: 'United States' },
        { key: 'geo_ie', ref: 'shared:geo_ie', label: 'Ireland' },
        { key: 'geo_ca', ref: 'shared:geo_ca', label: 'Canada' },
        { key: 'geo_oth', ref: 'shared:geo_oth', label: 'All other countries' }
      ]
    },
    {
      key: 'type', label: 'Products vs services', sub: 'hardware sold vs everything recurring',
      lede: 'Almost everything is a service — launches, subscriptions, compute rental, ads. <b>Products</b> are the Starlink dishes sold up front, all in the Connectivity segment, and have been flat at ~$1.5B while services nearly doubled.',
      note: 'Annual only, FY2023–FY2025.',
      tenK: { text: 'All of products revenue is attributable to the Connectivity segment.', where: '424B4 — Notes, revenue disaggregated by products and services' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '424B4', period: '2025-12-31', accession: '', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=space+exploration+technologies&type=424B4' },
      series: [
        { key: 'products', ref: 'shared:products', label: 'Products (Starlink kits)' },
        { key: 'services', ref: 'shared:services', label: 'Services' }
      ]
    }
  ],

  customers: {
    classes: [
      { key: 'consumer', label: 'Consumers and small businesses', text: 'Starlink residential, roaming and small-business subscribers in 174 countries, territories and other markets (13.6M at Sep 30 2026), plus Grok and X subscribers.', where: '424B4 — Business; Q3 2026 release' },
      { key: 'enterprise', label: 'Enterprises, airlines and shipping', text: 'Fixed-site enterprise, aviation (3,800+ aircraft equipped) and maritime Starlink customers, and enterprise buyers of Grok and Cursor.', where: '424B4 — Business; Q3 2026 release' },
      { key: 'government', label: 'Governments and national security', text: 'NASA (cargo and crew, Artemis), the U.S. Department of War and Space Force (national-security launch, Starshield), the National Reconnaissance Office and foreign governments.', where: '424B4 — Business' },
      { key: 'ai', label: 'AI developers renting compute', text: 'Cloud service agreements for capacity at Colossus: Anthropic (~$1.25B a month, 325k GPUs), Google (~$920M a month, ~110k GB300) and Reflection AI (~$150M a month). Either party may end them on 90 days\' notice after an initial period.', where: '424B4 and Q2 2026 10-Q — cloud services agreements' },
      { key: 'ads', label: 'Advertisers', text: 'Brands buying advertising on X.', where: '424B4 — Business' }
    ],
    concentration: {
      disclosed: true,
      note: 'Two customers cross 10% of revenue and neither is named. Customer A buys from all three segments — 25.2% of revenue in 2023, 24.2% in 2024, 20.9% in 2025, 16.6% in 3Q26; its profile fits the U.S. government. Customer B buys only from SI — 19.5% of revenue in 2Q26 and 34.5% in 3Q26 (24.2% of the nine months), which by size matches the Anthropic contract. One AI lab is now a third of the company\'s revenue, on a contract either side can end with 90 days\' notice; one customer was also 27.7% of receivables at Sep 30 2026.'
    },
    cite: { form: '10-Q', period: '2026-09-30', accession: '', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=space+exploration+technologies&type=10-Q' },
    splc: null
  },

  segments: [
    {
      key: 'space', label: 'Space', short: 'Space',
      lede: 'Rockets and spacecraft. SpaceX launches commercial, NASA and military payloads on Falcon 9 and Falcon Heavy, flies crew and cargo on Dragon, and is building Starship. Most launches carry its own Starlink satellites, which earn this segment nothing — their cost is capitalised into the satellites instead.',
      summary: 'Launch services and launch & development contracts. The segment that made everything else possible, and the one that now spends most on development.',
      brief: 'Sells rides to orbit. Reusable boosters made Falcon 9 the cheapest way to space; Starship is meant to cut that cost again by an order of magnitude. Today the segment barely breaks even because Starship R&D is expensed here.',
      sells: [
        { name: 'Launch services', what: 'Falcon 9 and Falcon Heavy launches for commercial, government and rideshare customers.' },
        { name: 'Launch & development', what: 'Dragon crew and cargo missions to the Space Station and development contracts such as Starship for NASA\'s Moon landing.' }
      ],
      tenK: { text: 'In our Space segment, we design, manufacture, and launch reusable rockets to provide high cadence, reliable, and affordable access to space at unprecedented scale.', where: '424B4 — Business', verbatim: true },
      products: [
        { name: 'Launch services', what: 'Falcon 9 (~620 orbital launches by Mar 2026) and Falcon Heavy, plus rideshare missions for small satellites.',
          customers: { archetype: { text: 'Commercial satellite operators, NASA, the U.S. Department of War and Space Force, the NRO, and international customers.', where: '424B4 — Business' },
            named: [ { name: 'U.S. Space Force', q: 'Q4 2026', what: 'Two NSSL Phase 3 Lane 1 task orders, $1.6B for 18 Falcon 9 launches (Bloomberg, Nov 2026).' } ],
            note: 'Customer launches and price per launch were roughly flat in 2025 (424B4); the growth in launch count was internal Starlink launches.',
            concentration: 'Customer A (all three segments, 20.9% of 2025 revenue) is the largest buyer across the company.' },
          management: [ { q: 'Q3 2026', text: 'Starship to fly weekly in 1H27 and twice weekly or more in 2H27; re-fly the second stage by early 2027.' } ] },
        { name: 'Launch & development', what: 'Dragon cargo and crew missions and development contracts (Starship Human Landing System for Artemis).',
          customers: { archetype: { text: 'NASA and other government agencies; private astronaut missions.', where: '424B4 — Business' }, named: [], concentration: 'See company-wide concentration.' },
          management: [] }
      ],
      kpis: [
        { name: 'Rocket launches', definition: 'All SpaceX launches in the period, Falcon and Starship, internal and external.', filing: 'Disclosed in releases and the prospectus.', unit: 'count', periodicity: 'Quarterly', source: 'Q3 2026 release; 424B4', series: 'results:launches' },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations — the measure the CODM uses.', filing: 'Segment note.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q / 424B4', series: 'results:spaceopinc' },
        { name: 'Segment adjusted EBITDA', definition: 'Company-defined; excludes D&A and stock-based pay.', filing: 'Release and segment note.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q / 424B4', series: 'results:spaceebitda' },
        { name: 'Mass to orbit', definition: 'Metric tons delivered to orbit, internal and external.', filing: null, unit: 'tons', periodicity: 'Annual', source: 'Bloomberg (company-sourced)', series: null, needs: 'Not in the filings; Bloomberg carries ~2,200 t for 2025.' }
      ],
      kpiNote: 'The interesting volume — internal Starlink launches — earns no revenue here, so launch count and segment revenue do not move together. Starship flights are tracked in Miscellaneous ▸ Starship & Launch.',
      interactions: [
        { name: 'Customer launches × price', relation: 'launch services revenue = customer launches × average price per launch', bridge: null,
          lines: ['Launch services'],
          why: 'The textbook relation, and the company says both terms were roughly flat in 2025. The growth in total launches (134 → 165 Falcon) was internal.',
          data: 'NOT CHARTED — customer launches and price per launch are given only in words in the 424B4, not as a series.' },
        { name: 'Development spend vs segment profit', relation: 'segment operating income = revenue − cost of launches − Starship R&D', bridge: null,
          lines: ['Launch services', 'Launch & development'],
          why: 'Starship R&D rose from $2.1B to $3.2B in 9M 2026, which is why adjusted EBITDA went from +$803M to −$199M while revenue was flat.',
          data: 'NOT CHARTED — segment R&D is disclosed annually only.' }
      ],
      adjacencies: [],
      drivers: {
        rev: { from: 'results:space' },
        opinc: { from: 'results:spaceopinc' },
        ebitda: { from: 'results:spaceebitda' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: { '1Q25': 759, '2Q25': 946, '3Q25': 1113, '4Q25': 1014, '1Q26': 1052, '2Q26': 1174, '3Q26': 1606 }, summit: {} },
          y: { act: { '2023': 1497, '2024': 2032, '2025': 3832 }, summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: { '2023': 571, '2024': 637, '2025': 757 }, summit: {} } }
      },
      bridges: [],
      highlights: ['opMgn', 'ebMgn', 'capexInt']
    },
    {
      key: 'conn', label: 'Connectivity (Starlink)', short: 'Starlink',
      lede: 'Starlink: broadband from thousands of low-orbit satellites, sold as monthly subscriptions to homes and roaming users, as plans to airlines, ships, enterprises and governments, and as the dish up front. Starlink Mobile (direct-to-phone) and Starshield (a separate network for U.S. national security) sit here too. It is the company\'s profit engine.',
      summary: 'Starlink subscriptions, kits, enterprise and government plans. 38.8% operating margin in 2025.',
      brief: 'Sells internet from space. Subscribers nearly doubled in a year, but ARPU falls as growth comes from cheaper markets — revenue grows slower than the subscriber count.',
      sells: [
        { name: 'Consumer broadband', what: 'Residential and Roam subscriptions plus the kit.' },
        { name: 'Enterprise & government', what: 'Aviation, maritime, enterprise, Starshield and other government plans.' },
        { name: 'Starlink Mobile', what: 'Direct-to-cell service sold through partner carriers.' }
      ],
      tenK: { text: 'In our Connectivity segment, we operate a worldwide high-speed, low-latency broadband data and communications network powered by over 9,600 Starlink broadband and mobile satellites in Low-Earth Orbit, delivering connectivity to millions of consumer, enterprise, and government customers across 164 countries, territories, and other markets.', where: '424B4 — Business', verbatim: true },
      products: [
        { name: 'Consumer broadband', what: 'Residential and Roam plans; the V5 user terminal; ARPU $69 a month in 3Q26.',
          customers: { archetype: { text: 'Households and small businesses, increasingly in emerging markets.', where: '424B4 — Business' }, named: [],
            note: 'Developed markets are expected to fall from 65% to 40% of subscribers by 2031 (company, via sell-side).', concentration: 'No single consumer matters; see company-wide concentration.' },
          management: [ { q: 'Q3 2026', text: 'Net adds softened in 3Q on V5 kit constraints; higher activations expected in 4Q. A few hundred V3 satellites are needed before users see the capacity benefit (mid-2027).' } ] },
        { name: 'Enterprise & government', what: 'Aviation (3,800+ aircraft equipped, ~12,000 under contract), maritime, enterprise and Starshield.',
          customers: { archetype: { text: 'Airlines, shipping companies, enterprises, and U.S. and foreign governments.', where: '424B4 — Business' }, named: [],
            note: 'Enterprise plus government backlog of ~$24B for 2026–28 (company, via sell-side).', concentration: 'Customer A (20.9% of 2025 revenue) buys from this segment.' },
          management: [ { q: 'Q3 2026', text: 'Enterprise and government revenue grew 91% year on year and 18% quarter on quarter.' } ] },
        { name: 'Starlink Mobile', what: 'Direct-to-cell through ~30 carrier partners; EchoStar and 800 MHz spectrum to build a U.S. carrier.',
          customers: { archetype: { text: 'Mobile network operators (wholesale) and, from 2028, consumers directly.', where: 'Q3 2026 call' }, named: [], concentration: 'Not disclosed.' },
          management: [ { q: 'Q3 2026', text: 'Mobile V2 satellites fly through 2027; U.S. service targeted for early 2028.' } ] }
      ],
      kpis: [
        { name: 'Starlink subscribers', definition: 'Consumer broadband subscribers at period end.', filing: 'Releases and prospectus.', unit: 'thousands', periodicity: 'Quarterly', source: 'Q3 2026 release; 424B4', series: 'results:subs' },
        { name: 'Consumer ARPU', definition: 'Average monthly revenue per consumer subscriber.', filing: 'Releases.', unit: '$/month', periodicity: 'Quarterly', source: 'Q3 2026 release', series: 'results:arpu' },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations.', filing: 'Segment note.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q / 424B4', series: 'results:connopinc' },
        { name: 'Satellites in orbit', definition: 'Starlink broadband and mobile satellites in low-Earth orbit.', filing: 'Prospectus (~9,600 at Mar 2026); 11,100+ in Q3 2026.', unit: 'count', periodicity: 'Irregular', source: '424B4; Q3 2026 release', series: null, needs: 'No quarterly series in the filings.' }
      ],
      kpiNote: 'Subscribers × ARPU explains the consumer line; enterprise & government has no published volume. 3Q26 gross margin included ~3 points of one-off tariff refunds (call).',
      interactions: [
        { name: 'Subscribers × ARPU', relation: 'consumer revenue ≈ average subscribers × ARPU × 3 months', bridge: 'subsArpu',
          lines: ['Consumer broadband'],
          why: 'The volume-price split of the consumer line. Subscribers rose 2.7× from 1Q25 to 3Q26 while ARPU fell from $86 to $69 — growth is coming from cheaper markets, so revenue grows slower than the base.',
          data: 'Both terms are disclosed each quarter (4Q25 ARPU not disclosed). The chart draws the two terms and the consumer revenue line together; the identity holds up to the timing of kit sales inside consumer revenue.' },
        { name: 'Satellites × capacity per satellite', relation: 'sellable capacity = satellites in orbit × capacity per satellite (V3 ≈ 10× V2)', bridge: null,
          lines: ['Consumer broadband', 'Enterprise & government'],
          why: 'Management says capacity, not demand, limits sales in some areas; V3 on Starship is the step change.',
          data: 'NOT CHARTED — capacity is not disclosed.' }
      ],
      adjacencies: [],
      drivers: {
        rev: { from: 'results:conn' },
        opinc: { from: 'results:connopinc' },
        ebitda: { from: 'results:connebitda' },
        consumer: { from: 'results:consumer' },
        entgov: { from: 'results:entgov' },
        subs: { from: 'results:subs' },
        arpu: { from: 'results:arpu' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: { '1Q25': 814, '2Q25': 1130, '3Q25': 1007, '4Q25': 1227, '1Q26': 1332, '2Q26': 1367, '3Q26': 1543 }, summit: {} },
          y: { act: { '2023': 2455, '2024': 3498, '2025': 4178 }, summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: { '2023': 884, '2024': 1508, '2025': 2376 }, summit: {} } }
      },
      bridges: [
        { key: 'subsArpu', label: 'Subscribers × ARPU', view: 'q', target: 'consumer', kind: 'independent',
          terms: ['subs', 'arpu'],
          identity: 'consumer revenue ≈ average subscribers × ARPU × 3',
          note: 'Two separately disclosed series against the reported consumer line. Units differ (thousands, $/month, $M), so read the shapes, not the levels.' }
      ],
      highlights: ['opMgn', 'ebMgn', 'entShare', 'capexInt']
    },
    {
      key: 'si', label: 'SI (Super Intelligence)', short: 'SI',
      lede: 'What came with xAI: compute capacity in the Colossus data centers rented to AI labs on short contracts, the Grok models and apps, the X social platform (advertising and subscriptions) and, from August 2026, Cursor. Called "AI" until 2026. In five quarters it went from a fifth of revenue to more than half.',
      summary: 'Rented AI compute, Grok, X and Cursor. 52% of 3Q26 revenue.',
      brief: 'Mostly a landlord for AI computing today: it builds data centers fast and rents them at premium prices on contracts either side can end on 90 days\' notice. The bet is that it also becomes a major AI model company.',
      sells: [
        { name: 'AI solutions & infrastructure', what: 'Compute rented to AI labs; Grok subscriptions and API; Cursor.' },
        { name: 'Advertising (X)', what: 'Ads on the X platform.' }
      ],
      tenK: { text: 'In our AI segment, we operate a highly vertically integrated AI platform spanning our truth-seeking frontier model Grok, AI solutions for consumer and enterprise customers, X—our real-time information, entertainment, and free speech platform—and AI computational infrastructure.', where: '424B4 — Business', verbatim: true },
      products: [
        { name: 'AI solutions & infrastructure', what: 'Cloud service agreements for Colossus capacity; Grok and Grok Bot; Cursor.',
          customers: { archetype: { text: 'AI developers renting compute; consumers and enterprises using Grok and Cursor.', where: '424B4 — Business' },
            named: [ { name: 'Anthropic', q: 'Q2 2026', what: '~$1.25B a month for ~325k GPUs across Colossus 1 and 2; three-year term, 90-day termination after an initial period.' },
                     { name: 'Google', q: 'Q2 2026', what: '~$920M a month for ~110k GB300 GPUs, Oct 2026–Jun 2029.' },
                     { name: 'Reflection AI', q: 'Q2 2026', what: '~$150M a month for ~18k GB300 GPUs.' } ],
            note: 'Customer B — SI only — was 34.5% of group revenue in 3Q26.', concentration: 'Customer B: 19.5% of 2Q26 and 34.5% of 3Q26 revenue (10-Q).' },
          management: [ { q: 'Q3 2026', text: '2.5–3 GW at end-2026 and +10 GW during 2027; new deals priced slightly above $50 per watt; renewals repricing higher; payback under a year at current prices.' } ] },
        { name: 'Advertising (X)', what: 'Advertising on X.',
          customers: { archetype: { text: 'Brands and advertisers.', where: '424B4 — Business' }, named: [], concentration: 'Not disclosed.' },
          management: [] }
      ],
      kpis: [
        { name: 'Nameplate compute', definition: 'Megawatts of compute capacity installed.', filing: 'Q3 2026 release (1.7 GW at Sep 30).', unit: 'MW', periodicity: 'Quarterly', source: 'Q3 2026 release; Bloomberg', series: 'results:gw' },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations.', filing: 'Segment note.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q', series: 'results:siopinc' },
        { name: 'Segment adjusted EBITDA', definition: 'Company-defined.', filing: 'Release and segment note.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q', series: 'results:siebitda' },
        { name: 'Backlog', definition: 'Remaining performance obligations, mostly compute contracts.', filing: 'Q3 2026: $63B including $17.5B deferred revenue; ~$42B within 12 months.', unit: 'usdM', periodicity: 'Quarterly', source: 'Q3 2026 10-Q', series: null, needs: 'Only two data points so far (Jun $47.5B, Sep $63B).' }
      ],
      kpiNote: 'The relation that matters is megawatts × price per megawatt; the price is set contract by contract and is not disclosed as a series. The Miscellaneous ▸ Financial Model tab turns it into a driver.',
      interactions: [
        { name: 'Megawatts × revenue per megawatt', relation: 'AI solutions revenue = installed MW × revenue per MW', bridge: 'mwPrice',
          lines: ['AI solutions & infrastructure'],
          why: 'Capacity grew from 0.3 to 1.7 GW in six quarters; revenue per MW jumped when the rental contracts began in 2Q26. Whether the price per MW holds as supply catches up decides the segment.',
          data: 'Both terms are disclosed (MW in releases, revenue in the segment note). Revenue per MW is the derived ratio, so this is a decomposition: it shows the split, not an independent check.' }
      ],
      adjacencies: [],
      drivers: {
        rev: { from: 'results:si' },
        opinc: { from: 'results:siopinc' },
        ebitda: { from: 'results:siebitda' },
        aiinfra: { from: 'results:aiinfra' },
        ads: { from: 'results:ads' },
        gw: { from: 'results:gw' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: { '1Q25': 2567, '2Q25': 749, '3Q25': 4760, '4Q25': 4651, '1Q26': 7723, '2Q26': 15828, '3Q26': 16444 }, summit: {} },
          y: { act: { '2023': 463, '2024': 5633, '2025': 12727 }, summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: { '2023': 1180, '2024': 1679, '2025': 3568 }, summit: {} } }
      },
      bridges: [
        { key: 'mwPrice', label: 'MW × revenue per MW', view: 'q', target: 'aiinfra', kind: 'decomposition',
          terms: ['gw', 'revPerMW'],
          identity: 'AI solutions revenue = MW × revenue per MW',
          note: 'Revenue per MW is AI solutions revenue divided by quarter-end MW, so the terms multiply back by construction. 3Q25 has no MW figure.' }
      ],
      highlights: ['opMgn', 'ebMgn', 'capexInt', 'revPerMW']
    }
  ]
};
