// segments-data/uber.js — the Top Line dataset for Uber Technologies (NYSE: UBER), read by js/segments.js.
// Rescued from DOAA351's branch feat/uber-deep-dive (Aug 2026, PR #100 closed) and brought to the playbook on 2026-11-03:
// Freight revenue now points at the Results dataset (results:frrev); fr_rev 2022 corrected 6,952 (that was gross
// bookings) → 6,947; `company`, `sells`, `products`, `kpiNote` added; the fields the engine no longer reads
// (overview.interactions, adjacencies, segment lede) dropped. 10-K quotes marked verbatim were re-read against the
// FY2025 10-K text only where stated below.
// Authored to the same contract as segments-data/amzn.js. Segment revenue and gross bookings are
// POINTERS into js/results-data/uber.js (results:<key>) and keep one home; segment Adjusted EBITDA,
// Freight revenue and the geographic cut are carried here because the model does not project them by
// segment — they come straight from the FY2025 10-K, Note 13.
//
// A BRIDGE is a target plus terms whose product equals it — for Uber: gross bookings = trips ×
// gross bookings per trip, and revenue = gross bookings × Revenue Margin (Uber's own term for take
// rate, defined in MD&A as "revenue as a percentage of Gross Bookings").

var UBER_CITE = { form: '10-K', period: '2025-12-31', accession: '0001543151-26-000015',
  url: 'https://www.sec.gov/Archives/edgar/data/1543151/000154315126000015/uber-20251231.htm' };

export var uberSegments = {
  updated: 'Nov 3, 2026',
  company: 'Uber',
  streetForward: true,   // the quarterly axis reaches two quarters past the last print with the Bloomberg consensus
  source: 'Segment revenue and gross bookings are read from the Results dataset (Summit model actuals + projection). Segment Adjusted EBITDA, Freight revenue and the geographic cut are from Uber’s FY2025 Form 10-K, Note 13 — Segment Information and Geographic Information. Gross Bookings, Revenue Margin, Trips and MAPCs are the Key Metrics defined in MD&A. Uber does not project Adjusted EBITDA by segment, so those series stop at the last reported year.',
  axis: { q: ['3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27'],
          y: ['2022','2023','2024','2025','2026','2027','2028','2029','2030'] },
  shared: {
    fr_rev: { label: 'Freight revenue', short: 'Freight revenue', unit: 'usdM', src: '10-K Note 13', scope: 'segment',
      y: { act: { '2022': 6947, '2023': 5245, '2024': 5141, '2025': 5099 }, summit: {} } },
    mob_ebitda: { label: 'Mobility Adjusted EBITDA', short: 'Mobility Adj. EBITDA', unit: 'usdM', src: '10-K Note 13', scope: 'segment',
      y: { act: { '2023': 4963, '2024': 6497, '2025': 7899 }, summit: {} } },
    del_ebitda: { label: 'Delivery Adjusted EBITDA', short: 'Delivery Adj. EBITDA', unit: 'usdM', src: '10-K Note 13', scope: 'segment',
      y: { act: { '2023': 1506, '2024': 2471, '2025': 3572 }, summit: {} } },
    fr_ebitda: { label: 'Freight Adjusted EBITDA', short: 'Freight Adj. EBITDA', unit: 'usdM', src: '10-K Note 13', scope: 'segment',
      y: { act: { '2023': -64, '2024': -74, '2025': -33 }, summit: {} } },
    geo_uscan: { label: 'United States & Canada', short: 'US & Canada', unit: 'usdM', src: '10-K Note 13 (revenue by region)', scope: 'company',
      y: { act: { '2023': 20436, '2024': 23618, '2025': 26469 }, summit: {} } },
    geo_latam: { label: 'Latin America', short: 'Latin America', unit: 'usdM', src: '10-K Note 13 (revenue by region)', scope: 'company',
      y: { act: { '2023': 2512, '2024': 2795, '2025': 3327 }, summit: {} } },
    geo_emea: { label: 'EMEA', short: 'EMEA', unit: 'usdM', src: '10-K Note 13 (revenue by region)', scope: 'company',
      y: { act: { '2023': 9904, '2024': 12529, '2025': 16364 }, summit: {} } },
    geo_apac: { label: 'Asia-Pacific', short: 'APAC', unit: 'usdM', src: '10-K Note 13 (revenue by region)', scope: 'company',
      y: { act: { '2023': 4429, '2024': 5036, '2025': 5857 }, summit: {} } },
    geo_us: { label: 'United States', short: 'United States', unit: 'usdM', src: '10-K Note 13 (revenue by country)', scope: 'company',
      y: { act: { '2023': 18620, '2024': 21429, '2025': 23771 }, summit: {} } },
    geo_uk: { label: 'United Kingdom', short: 'United Kingdom', unit: 'usdM', src: '10-K Note 13 (revenue by country)', scope: 'company',
      y: { act: { '2023': 6522, '2024': 8373, '2025': 10609 }, summit: {} } },
    geo_other: { label: 'All other countries', short: 'All other', unit: 'usdM', src: '10-K Note 13 (revenue by country)', scope: 'company',
      y: { act: { '2023': 12139, '2024': 14176, '2025': 17637 }, summit: {} } },
  },
  derived: {
    revMargin: { label: 'Revenue Margin (revenue ÷ gross bookings)', short: 'Revenue Margin', unit: 'pct', num: 'rev', den: 'gb' },
    ebitdaMargin: { label: 'Segment Adj. EBITDA margin (% of revenue)', short: 'Adj. EBITDA %', unit: 'pct', num: 'ebitda', den: 'rev' },
    gbPerTrip: { label: 'Gross bookings per trip', short: '$ / trip', unit: 'x', num: 'gb', den: 'trips' },
  },
  overview: {
    lede: '',
    tenK: { text: 'As of December 31, 2025, we had three operating and reportable segments: Mobility, Delivery and Freight. Mobility, Delivery and Freight platform offerings each address large, fragmented markets.', where: 'Item 1 — Business' },
  },
  customers: {
    classes: [
      { key: 'consumers', label: 'Consumers', text: 'We connect consumers with providers of ride services, merchants as well as delivery service providers for meal preparation, grocery and other delivery services. Uber also connects consumers with public transportation networks.', where: 'Item 1 — Business' },
      { key: 'drivers', label: 'Drivers', text: 'Mobility products connect consumers with Drivers who provide rides in a variety of vehicles, such as cars, auto rickshaws, motorbikes, minibuses, or taxis. Drivers are independent contractors who use our platform to find and complete trips and deliveries.', where: 'Item 1 — Business / Note 13' },
      { key: 'merchants', label: 'Merchants', text: 'Our Delivery offering allows consumers to search for and discover the best of local commerce — from restaurants to grocery, alcohol, convenience and other retailers. Merchants list on the platform and, through Uber Direct, use it as a white-label Delivery-as-a-Service.', where: 'Item 1 — Business' },
      { key: 'shippers', label: 'Shippers', text: 'Freight serves Shippers ranging from small- and medium-sized businesses to global enterprises, connecting them with Carriers in a digital marketplace to move shipments.', where: 'Item 1 — Business' },
      { key: 'carriers', label: 'Carriers', text: 'Freight connects Carriers with Shippers’ shipments available on our platform, and gives Carriers upfront, transparent pricing and the ability to book a shipment with the touch of a button.', where: 'Item 1 — Business' },
    ],
    concentration: { disclosed: false, note: 'Uber discloses NO numeric customer-concentration figure — there is no “no single customer accounted for more than 10%” sentence anywhere in the filing, and the Concentration of Credit Risk note covers only bank-deposit exposure. The only concentration language is a qualitative risk factor: “A significant amount of our Delivery Gross Bookings come from a limited number of large restaurant groups and other merchants, and this concentration increases the risk of fluctuations in our operating results.” Uber also notes it generated 15% of Mobility Gross Bookings from airport trips in 2025.' },
    cite: UBER_CITE,
    splc: null,
  },
  other: [
    {
      key: 'gb_seg', label: 'Gross Bookings', sub: 'gross bookings by segment',
      lede: 'Gross Bookings is the dollar value of every ride, order and shipment on the platform, before what Uber pays drivers, couriers and merchants — the scale of the marketplace and the line Uber guides every quarter. Revenue is the share Uber keeps of it.',
      caveat: 'Gross Bookings is a key metric, not a GAAP line: it is defined in MD&A and reported in each earnings release. Freight is booked gross, so its revenue is close to its bookings.',
      note: 'Total = Mobility + Delivery + Freight, as each release reports it. Forecast quarters: the Summit DCF submit of 2026-08-05 (frozen); the Bloomberg consensus (2026-09-10) only where Summit has no quarter.',
      tenK: { text: 'We define Gross Bookings as the total dollar value, including any applicable taxes, tolls, and fees, of: Mobility rides, Delivery orders (in each case without any adjustment for consumer discounts and refunds, Driver and Merchant earnings, and Driver incentives) and Freight revenue. Gross Bookings do not include tips earned by Drivers.', where: 'Item 7 — MD&A, Key Metrics', verbatim: true },
      cite: UBER_CITE,
      series: [
        { key: 'gb_mob', ref: 'results:mobgb', label: 'Mobility' },
        { key: 'gb_del', ref: 'results:delgb', label: 'Delivery' },
        { key: 'gb_fr',  ref: 'results:frgb',  label: 'Freight' },
      ],
    },
    {
      key: 'geo_region', label: 'Geography (region)', sub: 'revenue by geographic region',
      lede: 'The same total revenue cut by WHERE it is earned. US & Canada is the anchor, but EMEA is the fastest-growing region — revenue there rose from $9.9B (2023) to $16.4B (2025), driven by Delivery and the UK. This cut cross-cuts the segments: every region carries Mobility, Delivery and Freight.',
      caveat: 'Revenue only. Uber reports Adjusted EBITDA by SEGMENT, not by region — there is no regional profitability anywhere in the filing.',
      note: 'Regions are Uber’s own reporting buckets: US & Canada, Latin America, EMEA, Asia-Pacific.',
      tenK: { text: 'The following tables set forth revenue and long-lived assets, net by geographic area as of and for the years ended December 31, 2023, 2024, and 2025 (in millions)', where: 'Note 13 — Segment Information and Geographic Information' },
      cite: UBER_CITE,
      axis: { y: ['2023','2024','2025'] }, views: ['y'],
      series: [
        { key: 'geo_uscan', ref: 'shared:geo_uscan', label: 'US & Canada' },
        { key: 'geo_latam', ref: 'shared:geo_latam', label: 'Latin America' },
        { key: 'geo_emea', ref: 'shared:geo_emea', label: 'EMEA' },
        { key: 'geo_apac', ref: 'shared:geo_apac', label: 'APAC' },
      ],
    },
    {
      key: 'geo_country', label: 'Geography (country)', sub: 'revenue by country',
      lede: 'The country cut Uber discloses: the United States, the United Kingdom, and everything else. The UK is the only non-US country broken out — and the fastest grower of the three, from $6.5B (2023) to $10.6B (2025).',
      caveat: 'Only two countries are ever named; “all other countries” is a single bucket, so nothing below the UK can be sized from the filing.',
      note: 'Long-lived assets are $2.6B in the US and $0.4B elsewhere (2025) — an asset-light, US-weighted footprint.',
      tenK: { text: 'Revenue by geography is based on where the trip or shipment was completed or meal delivered.', where: 'Note 13 — Geographic Information' },
      cite: UBER_CITE,
      axis: { y: ['2023','2024','2025'] }, views: ['y'],
      series: [
        { key: 'geo_us', ref: 'shared:geo_us', label: 'United States' },
        { key: 'geo_uk', ref: 'shared:geo_uk', label: 'United Kingdom' },
        { key: 'geo_other', ref: 'shared:geo_other', label: 'All other countries' },
      ],
    },
  ],
  segments: [
    {
      key: 'mobility', label: 'Mobility', short: 'Mobility',
      sells: [
        { name: 'Rides', what: 'On-demand and reserved trips in cars, taxis, two- and three-wheelers and partner autonomous vehicles; Uber keeps a service fee on each fare.' },
        { name: 'Business travel', what: 'Managed ride programs for companies (Uber for Business) and healthcare providers (Uber Health).' },
        { name: 'In-app advertising', what: 'Placements inside the rider app, reported inside the segment.' },
      ],
      products: [ { name: 'UberX · Share · Comfort' }, { name: 'Uber Black · Reserve' }, { name: 'Moto · Auto · Taxi' }, { name: 'Uber for Business · Uber Health' }, { name: 'Autonomous (partners)' } ],
      kpiNote: 'Uber reports Mobility gross bookings, revenue and segment profit (Adjusted EBITDA through 4Q25, segment operating income from 1Q26). Trips and MAPCs are reported only for the whole platform, so there is no Mobility trip count or price per trip.',
      summary: 'Mobility connects consumers with rides across cars, taxis, two-wheelers, transit and more, plus financial-partnership and advertising activity. It is the largest and most profitable segment: ~$29.7B revenue and $7.9B Adjusted EBITDA in 2025.',
      brief: 'Uber’s original business: match a rider with a nearby driver, take a cut of the fare. It earns more per dollar of bookings than Delivery and throws off most of the company’s profit, which pays for everything else.',
      tenK: { text: 'Our Mobility offering connects consumers with a wide range of transportation modalities, such as ridesharing, carsharing, micromobility, rentals, public transit, taxis, and more — helping customers go almost anywhere they need. … Mobility also includes activity related to our financial partnerships products and advertising.', verbatim: true, cite: 'UBER TECHNOLOGIES INC, 10-K (period 2025-12-31, accession 0001543151-26-000015)', url: UBER_CITE.url, where: 'Item 1 — Business', needs: null },
      drivers: { rev: { from: 'results:mobrev' }, gb: { from: 'results:mobgb' }, ebitda: { from: 'shared:mob_ebitda' } },
      kpis: [
        { name: 'Segment revenue', definition: 'Mobility revenue as reported in Note 13 — the platform fee Uber keeps on a ride, after Driver earnings and incentives.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:mobrev', needs: null },
        { name: 'Gross Bookings', definition: 'The total fare value of Mobility rides including taxes, tolls and fees, before Driver earnings and incentives. The scale of the marketplace.', unit: 'usdM', periodicity: 'Quarterly and annual', source: 'MD&A Key Metrics', series: 'results:mobgb', needs: null },
        { name: 'Segment Adjusted EBITDA', definition: 'Mobility revenue less the segment’s directly-attributable costs, before Corporate G&A and Platform R&D. Not projected by segment.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 13', series: 'shared:mob_ebitda', needs: null },
      ],
      interactions: [
        { name: 'Gross Bookings × Revenue Margin', relation: 'revenue = gross bookings × Revenue Margin', bridge: 'take',
          lines: [], why: 'Uber keeps a percentage of every ride’s bookings. Revenue Margin is the yield; Gross Bookings is the volume. Mobility’s margin (~30%) is structurally higher than Delivery’s because there is no merchant to pay.',
          data: 'Both terms reported; margin = revenue ÷ bookings.' },
        { name: 'Trips × price', relation: 'gross bookings = trips × gross bookings per trip', bridge: 'trips',
          lines: [], why: 'Volume splits into how many rides happen and what each is worth. Trips are driven by MAPCs × frequency; price per trip moves with mix (premium vs low-cost) and geography.',
          data: 'Trips reported for the platform; per-trip value derived.' },
      ],
    },
    {
      key: 'delivery', label: 'Delivery', short: 'Delivery',
      sells: [
        { name: 'Delivery orders', what: 'Restaurant, grocery, alcohol, convenience and retail orders, delivered or picked up; fees from merchants and consumers.' },
        { name: 'Uber Direct', what: 'Uber\u2019s courier network powering merchants\u2019 own sites and apps.' },
        { name: 'Advertising', what: 'Sponsored listings and ads sold to merchants and brands, reported inside the segment.' },
      ],
      products: [ { name: 'Uber Eats' }, { name: 'Grocery & retail' }, { name: 'Uber Direct' }, { name: 'Advertising' } ],
      kpiNote: 'Uber reports Delivery gross bookings, revenue and segment profit. It does not report Delivery orders, average order value or advertising revenue separately (advertising is given only as a run-rate on the calls).',
      summary: 'Delivery lets consumers order from restaurants, grocery, alcohol, convenience and retail, for pickup or delivery. ~$17.2B revenue and $3.6B Adjusted EBITDA in 2025 — the fastest EBITDA grower of the three as advertising and scale lift the margin.',
      brief: 'Order food or groceries, a courier brings it, Uber takes a cut. A lower take and lower margin than a ride — there’s a restaurant and a courier to pay — but the margin is climbing as advertising and density improve.',
      tenK: { text: 'Our Delivery offering allows consumers to search for and discover the best of local commerce — from restaurants to grocery, alcohol, convenience and other retailers — order a meal or other items, and either pick-up at the restaurant or have it delivered. We refer to the grocery, alcohol, convenience, and retail categories collectively as Grocery & Retail.', verbatim: true, cite: 'UBER TECHNOLOGIES INC, 10-K (period 2025-12-31, accession 0001543151-26-000015)', url: UBER_CITE.url, where: 'Item 1 — Business', needs: null },
      drivers: { rev: { from: 'results:delrev' }, gb: { from: 'results:delgb' }, ebitda: { from: 'shared:del_ebitda' } },
      kpis: [
        { name: 'Segment revenue', definition: 'Delivery revenue per Note 13 — the fee Uber keeps after Merchant and courier payouts.', unit: 'usdM', periodicity: 'Quarterly and annual', source: '10-Q / 10-K segment note', series: 'results:delrev', needs: null },
        { name: 'Gross Bookings', definition: 'The total order value including fees, before Merchant and Driver earnings. Delivery is the largest marketplace by bookings.', unit: 'usdM', periodicity: 'Quarterly and annual', source: 'MD&A Key Metrics', series: 'results:delgb', needs: null },
        { name: 'Segment Adjusted EBITDA', definition: 'Delivery revenue less directly-attributable costs, before corporate. Not projected by segment.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 13', series: 'shared:del_ebitda', needs: null },
      ],
      interactions: [
        { name: 'Gross Bookings × Revenue Margin', relation: 'revenue = gross bookings × Revenue Margin', bridge: 'take',
          lines: [], why: 'A three-sided split — consumer pays, restaurant and courier are paid, Uber keeps the rest — so Revenue Margin (~19%) is below Mobility. Advertising is the lever that lifts it without touching the split.',
          data: 'Both terms reported; margin = revenue ÷ bookings.' },
        { name: 'Margin convergence', relation: 'Adj. EBITDA margin (% of GB) rising toward Mobility', bridge: null,
          lines: [], why: 'Delivery Adjusted EBITDA nearly tripled 2023’25 while revenue grew ~40% — scale, density and ~100%-margin advertising closing the gap to Mobility without cutting merchant or courier pay.',
          data: 'Segment Adj. EBITDA reported annually (Note 13).' },
      ],
    },
    {
      key: 'freight', label: 'Freight', short: 'Freight',
      sells: [
        { name: 'Freight brokerage', what: 'Shipments matched with truck carriers on a digital marketplace; revenue recognized gross.' },
        { name: 'Managed transportation', what: 'Logistics management for shippers (from the 2021 Transplace acquisition).' },
      ],
      products: [ { name: 'Uber Freight brokerage' }, { name: 'Managed transportation' } ],
      kpiNote: 'Uber reports Freight gross bookings, revenue and segment profit only; no load, lane or price figures.',
      summary: 'Freight connects Shippers with Carriers in a digital marketplace, principally in North America and Europe. ~$5.1B revenue in 2025 at roughly breakeven Adjusted EBITDA (–$33M) — the smallest segment, run for optionality.',
      brief: 'A digital load board: a company needs a shipment moved, a trucker takes it, Uber runs the marketplace. Barely profitable, a small logistics option kept for the long game.',
      tenK: { text: 'Freight powers a managed transportation and logistics network and connects Shippers and Carriers in a digital marketplace to move shipments … Freight connects Carriers with Shippers’ shipments available on our platform, and gives Carriers upfront, transparent pricing and the ability to book a shipment with the touch of a button. Freight serves Shippers ranging from small- and medium-sized businesses to global enterprises. … Freight operations are principally based in North America and Europe.', verbatim: true, cite: 'UBER TECHNOLOGIES INC, 10-K (period 2025-12-31, accession 0001543151-26-000015)', url: UBER_CITE.url, where: 'Item 1 — Business', needs: null },
      drivers: { rev: { from: 'results:frrev' }, gb: { from: 'results:frgb' }, ebitda: { from: 'shared:fr_ebitda' } },
      kpis: [
        { name: 'Gross Bookings', definition: 'The total value of Freight shipments; Freight is booked gross, so it sits close to the segment’s revenue.', unit: 'usdM', periodicity: 'Quarterly and annual', source: 'MD&A Key Metrics', series: 'results:frgb', needs: null },
        { name: 'Segment revenue', definition: 'Freight revenue per Note 13. Unlike Mobility and Delivery, Freight books close to the full shipment value, so revenue ≈ gross bookings.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 13', series: 'shared:fr_rev', needs: null },
        { name: 'Segment Adjusted EBITDA', definition: 'Freight revenue less directly-attributable costs. Near breakeven — held for optionality, not margin.', unit: 'usdM', periodicity: 'Annual', source: '10-K Note 13', series: 'shared:fr_ebitda', needs: null },
      ],
      interactions: [
        { name: 'Revenue ≈ Gross Bookings', relation: 'Freight books gross, so Revenue Margin is ~100%', bridge: null,
          lines: [], why: 'Freight is a managed-transportation model — Uber recognises close to the full shipment value as revenue, so the take-rate framing that drives Mobility and Delivery does not apply here.',
          data: 'Revenue reported annually (Note 13).' },
      ],
    },
  ],
};
