// segments-data/spot.js — the Top Line dataset for Spotify Technology S.A. (NYSE: SPOT).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-CUS; TL-OTH omitted) · log docs/profiles/SPOT.md.
//
// SHAPE OF THIS COMPANY: two reportable segments, Premium and Ad-Supported (FY2025 Form 20-F, Item 5 and Note 23). Spotify
// reports revenue and GROSS PROFIT by segment — not operating income — so the segment "profit" line here is gross profit
// (Dani, Oct 20 2026) and every label says so. Everything is in EUR.
//
// Every revenue / profit series is a POINTER into js/results-data/spot.js (`results:<key>`), so each number has one home. The
// engine reads `act` and falls back to `summit`, never `cons` — Street figures live in Evolution ▸ Results. Summit (rule 10,
// frozen, snapshot 2026-08-05) therefore runs the annual axis into FY2026–FY2028.
//
// BASIS BREAK: from 1 Jan 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023–25; the actuals
// here are as originally reported, the Summit years are on the new basis. The Results notes say so; the segment charts do not
// hide it.
//
// TEXT CHIPS: `tenK` = FILING, verbatim from the FY2025 Form 20-F (accession 0001628280-26-006874, filed 2026-02-10); the
// location is in `where`. `summary` / `brief` / `sells` = OURS. CALL quotes are from the Q2 2026 call (4 Aug 2026).
// NOT READ: the 20-F's Note 23 text and revenue-by-geography table (the fetch tool stops before the financial statements), so
// no segment definition from the notes is quoted and no geography cut is built (TL-OTH omitted).

var Q = ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'];   // 2023 from `history` below, reported quarters, then two forecast quarters (3Q26, 4Q26). Summit has no 2027 quarterly forecast yet.

var FIL = 'FY2025 Form 20-F';
var PREM_Q = { text: 'We generate revenue for our Premium segment through the sale of subscriptions to the Subscription Offerings. The Subscription Offerings are primarily sold directly to end users. The Premium Service is also sold through partners who are generally telecommunications companies that bundle the subscription with their own services or collect payment for the stand-alone subscriptions from their end customers. Premium partner subscription revenue is based on a per-subscriber rate in a negotiated partner agreement.',
                where: FIL + ', Item 4.B — Our Business Model (p. 35)' };
var PRICE_Q = { text: 'Revenue from our Premium segment is a function of the price of our Subscription Offerings and the number of subscribers who subscribe to our Subscription Offerings.',
                where: FIL + ', Item 4.B (p. 36)' };
var PRICING_Q = { text: 'Our pricing varies by plan and is adapted to each local market to align with consumer purchasing power, general cost levels, and willingness to pay for an audio service.',
                  where: FIL + ', Item 4.B (p. 35)' };
var AD_Q = { text: 'We generate revenue for our Ad-Supported segment primarily from the sale of display, audio, and video advertising delivered through advertising impressions. We enter into arrangements with advertising agencies that purchase advertising on behalf of their clients and we also enter into arrangements directly with some large advertisers.',
             where: FIL + ', Item 4.B (p. 36) and Item 5 (p. 44)' };
var ARPU_Q = { text: 'Premium ARPU is a monthly measure defined as Premium subscription revenue recognized in the quarter indicated divided by the average daily Premium Subscribers in such quarter, which is then divided by three months. Annual figures are calculated by averaging Premium ARPU for the four quarters in such fiscal year.',
               where: FIL + ', Item 5 — Key Performance Indicators (p. 47)' };
var SUBS_Q = { text: 'We define Premium Subscribers as users that have completed registration with Spotify and have activated a payment method for the Subscription Offerings.',
               where: FIL + ', Item 5 — Key Performance Indicators (p. 46)' };
var MAU_Q = { text: 'We define MAUs as the total count of Ad-Supported Users and Premium Subscribers that have consumed content for greater than zero milliseconds in the last thirty days from the period-end indicated.',
              where: FIL + ', Item 5 — Key Performance Indicators (p. 46)' };
var ADMAU_Q = { text: 'We define Ad-Supported MAUs as the total count of Ad-Supported Users that have consumed content for greater than zero milliseconds in the last thirty days from the period-end indicated.',
                where: FIL + ', Item 5 — Key Performance Indicators (p. 46)' };
var INCR_Q = { text: 'These decreases were largely offset by an increase in Premium ARPU of €0.25 as a result of price increases.',
               where: FIL + ', Item 5 — Premium ARPU (p. 47)' };

var NO_CONC = 'The Business and Operating sections of the FY2025 Form 20-F (Items 4 and 5) state no customer or advertiser concentration and give no revenue share for any partner or advertiser. The financial-statement notes were not reviewed for one.';

export var spotSegments = {
  company: 'Spotify',
  updated: 'Oct 2026',
  source: 'Segment revenue and gross profit: the Results dataset (js/results-data/spot.js) — Spotify quarterly shareholder decks and 6-Ks (1Q24–3Q26; 3Q26 segment gross profit derived from the deck’s segment margins until the interim 6-K is filed), the FY2025 Form 20-F (SEC EDGAR, CIK 1639920, accession 0001628280-26-006874) for the annual totals, and the Bloomberg export for 2023 and segment gross profit by quarter (3Q25 derived from the 20-F segment totals). Subscribers, MAU, ad-supported MAU and ARPU: shareholder decks and the Bloomberg export; definitions verbatim from the 20-F. Quarterly 1Q23–4Q23: the Bloomberg export (reported columns of the oldest snapshot, 2024-04-28). Summit forecast 4Q26 (the model has no 2027 quarterly forecast yet) and FY2026–FY2028 annual: DCF model snapshot of 2026-08-05, frozen. Subscribers, Ad-Supported MAU and ARPU for 3Q24–4Q26 are the estimates of the Summit model supplied by the analyst (the model rows are empty); the total MAU forecast is Street (Bloomberg, 2026-10-21) because the model does not carry it. Everything in EUR.',

  axis: {
    q: Q,
    y: ['2023', '2024', '2025', '2026', '2027', '2028'],
  },

  shared: {},

  // Reported 2023 quarters, ahead of where the Results dataset starts (1Q24). Source: Bloomberg's reported columns in the oldest SPOT
  // snapshot (BBG_CONSENSUS.txt, 2024-04-28, which carries 1Q23-1Q24). Same as-originally-reported basis as 2024-25 (the Jan 2026
  // reclassification is not applied to either). Checks: Premium + Ad-Supported = total revenue in every quarter; the 1Q24 column
  // equals the Results dataset. EUR millions; users in millions; ARPU in euros.
  history: {
    rev:     { q: { '1Q23': 3042, '2Q23': 3177, '3Q23': 3357, '4Q23': 3671 } },
    premrev: { q: { '1Q23': 2713, '2Q23': 2773, '3Q23': 2910, '4Q23': 3170 } },
    adrev:   { q: { '1Q23': 329,  '2Q23': 404,  '3Q23': 447,  '4Q23': 501 } },
    premgp:  { q: { '1Q23': 776,  '2Q23': 789,  '3Q23': 847,  '4Q23': 922 } },
    adgp:    { q: { '1Q23': -10,  '2Q23': -23,  '3Q23': 37,   '4Q23': 58 } },
    subs:    { q: { '1Q23': 210,  '2Q23': 220,  '3Q23': 226,  '4Q23': 236 } },
    mau:     { q: { '1Q23': 515,  '2Q23': 551,  '3Q23': 574,  '4Q23': 602 } },
    admau:   { q: { '1Q23': 317,  '2Q23': 343,  '3Q23': 361,  '4Q23': 379 } },
    arpu:    { q: { '1Q23': 4.32, '2Q23': 4.27, '3Q23': 4.34, '4Q23': 4.6 } },
  },

  // Common size for counts: subscribers and ad-supported users over total MAU (the two add to MAU less the overlap). ARPU and total MAU have none.
  shareBase: { 'results:subs': 'results:mau', 'results:admau': 'results:mau' },
  shareLabel: '% of MAU',
  defaultHidden: ['margin'],   // Summit and Consensus chips open ON in the Top Line charts; the margin lines (three, on a second axis) open OFF
  bridgeLines: true,           // the Revenue interactions chart is drawn as lines, each over its own first quarter (= 100), so users, revenue per user and revenue share one axis
  ramp: ['#475569', '#94a3b8', '#0f172a', '#cbd5e1'],   // the series colours of this profile: slate greys, no categorical palette (CIO)

  derived: {
    revPerSub:   { label: 'Premium ARPU (revenue per subscriber, per month)', short: 'ARPU', unit: 'eps', num: 'rev', den: 'subs', div: 3 },
    costPerSub:  { label: 'Premium cost per subscriber (per month)', short: 'Cost / subscriber', unit: 'eps', num: 'cogs', den: 'subs', div: 3 },
    gpMgn:       { label: 'Segment gross margin', short: 'Gross margin', unit: 'pct', num: 'opinc', den: 'rev' },
    revPerAdMau: { label: 'Ad-Supported ARPU (revenue per ad MAU, per month)', short: 'ARPU', unit: 'eps', num: 'rev', den: 'admau', div: 3 },
  },


  overview: {
    tenK: {
      text: 'We operate and manage our business in two reportable segments—Premium and Ad-Supported. We identify our reportable segments based on the organizational units used by the chief operating decision maker to monitor performance and make operating decisions.',
      where: FIL + ', Item 5 — How We Generate Revenue (p. 43)',
    },
  },

  segments: [
    {
      key: 'prem', label: 'Premium', short: 'Premium',
      tenK: Object.assign({ verbatim: true }, PREM_Q),
      summary: '89% of FY2025 revenue and about 94% of gross profit: the subscription business, where revenue is price × subscribers and growth has exactly those two levers.',
      brief: 'The paid tier: unlimited, ad-free, on-demand listening, online and offline. Listeners pay a monthly fee per account, mostly direct and partly through telecom partners that bundle it. Plans differ by country and by shape (Individual, Duo, Family, Student), and audiobook hours and add-ons are layered on top.',
      sells: [
        { name: 'Individual · Duo · Family · Student', what: 'The core plan shapes. Family covers a primary account plus up to five sub-accounts; Duo covers two. Ad-free, offline, fully on-demand.' },
        { name: 'Basic', what: 'A cheaper Premium variant in select markets that strips out extras, notably the monthly audiobook listening hours.' },
        { name: 'Audiobook Access Tier (US only)', what: 'Audiobook hours without the rest of Premium: a way in for listeners who want books, not music.' },
        { name: 'Audiobooks+', what: 'A paid add-on that buys extra audiobook hours beyond the monthly allowance. Launched July 2025.' },
        { name: 'Lossless', what: '24-bit/44.1 kHz FLAC streaming for Premium subscribers, launched September 2025 across 50+ markets.' },
      ],
      products: [
        { name: 'Premium plans (Individual · Duo · Family · Student)',
          what: 'The subscription itself, sold direct to listeners at a price that varies by plan and by market.',
          tenK: PRICING_Q,
          customers: { archetype: { text: PREM_Q.text.split('. ')[1] + '.', where: PREM_Q.where },
                       named: [], concentration: NO_CONC },
          management: [{ q: 'Q2 2026', text: 'Alex Norström: “crossing 300 million subs for the first time”. Christian Luiga: Premium revenue rose approximately 16% year over year, on subscriber growth of 9% and ARPU expansion of 7.4%.' }] },
        { name: 'Premium through telecom partners',
          what: 'The same subscription sold by telecom partners that bundle it into their own plans or collect payment for the stand-alone subscription.',
          customers: { archetype: { text: 'The Premium Service is also sold through partners who are generally telecommunications companies that bundle the subscription with their own services or collect payment for the stand-alone subscriptions from their end customers. Premium partner subscription revenue is based on a per-subscriber rate in a negotiated partner agreement.', where: PREM_Q.where },
                       named: [], concentration: NO_CONC + ' No partner is named in those sections.' } },
        { name: 'Audiobooks+ add-on',
          what: 'Extra audiobook hours on top of the Premium plan; the first add-on that raises ARPU by quantity rather than by list price.',
          customers: { archetype: { text: 'Premium subscribers who want more audiobook listening than the plan includes.', where: 'OURS' },
                       named: [], concentration: 'Not disclosed as a customer count; the call gives only the annual recurring revenue.' },
          management: [{ q: 'Q2 2026', text: 'Alex Norström: Audiobooks+ “has passed EUR 100 million in annual recurring revenue”; audiobooks penetration among Premium “more than doubled this year”.' }] },
      ],
      kpis: [
        { name: 'Premium Subscribers', definition: 'Users with a registered account and an activated payment method for the subscription offerings, at period end (millions).',
          filing: SUBS_Q.text, filingWhere: SUBS_Q.where, unit: 'count', periodicity: 'Quarterly',
          source: 'Spotify shareholder decks (1Q24–3Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:subs' },
        { name: 'Premium ARPU', definition: 'Average monthly revenue per Premium subscriber, in euros: Premium revenue in the quarter ÷ average daily subscribers ÷ three months.',
          filing: ARPU_Q.text, filingWhere: ARPU_Q.where, unit: 'eps', periodicity: 'Quarterly (annual = average of the four quarters)',
          source: 'Spotify shareholder decks (1Q24–3Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:arpu' },
      ],
      kpiNote: 'Spotify publishes two operating KPIs for Premium: subscribers at period end and monthly ARPU. It does not publish revenue by plan, by region or by partner, and no price list. Total MAU, which adds both tiers, is the base of the “% of MAU” view.',
      interactions: [
        { name: 'Subscribers × revenue per subscriber', relation: 'Premium revenue = subscribers × revenue per subscriber', bridge: 'pricevol',
          lines: ['Premium plans (Individual · Duo · Family · Student)', 'Premium through telecom partners'],
          why: 'The 20-F states the identity itself: “Revenue from our Premium segment is a function of the price of our Subscription Offerings and the number of subscribers who subscribe to our Subscription Offerings.” Revenue grows either because there are more subscribers or because each one yields more.',
          data: 'Subscribers at quarter end and Premium revenue are published; revenue per subscriber is their quotient, per quarter (divide by three for a monthly figure; the reported Premium ARPU is the monthly one, on average subscribers).' },
      ],
      drivers: {
        rev: { from: 'results:premrev' },
        opinc: { from: 'results:premgp' },
        subs: { from: 'results:subs' },
        cogs: { label: 'Premium cost of revenue', short: 'Premium cost of revenue', unit: 'usdM', src: 'Bloomberg export (ties to the 6-K segment note: Premium revenue − Premium gross profit)',
          q: { act: { '1Q24': 2268, '2Q24': 2300, '3Q24': 2338, '4Q24': 2418, '1Q25': 2509, '2Q25': 2503, '3Q25': 2557, '4Q25': 2615, '1Q26': 2703, '2Q26': 2820 }, summit: {} } },
      },
      bridges: [
        { key: 'pricevol', label: 'Subscribers × revenue per subscriber', view: 'q', target: 'rev', kind: 'decomposition',
          terms: ['subs', 'revPerSub'],
          identity: 'Premium revenue = subscribers × revenue per subscriber',
          note: 'A decomposition, not an independent build: revenue per subscriber is Premium revenue divided by subscribers, so the terms multiply back to revenue by construction. What it shows is how much of the Premium line comes from more subscribers and how much from more revenue per subscriber.' },
      ],
      highlights: ['revPerSub', 'costPerSub', 'gpMgn'],
    },
    {
      key: 'ads', label: 'Ad-Supported', short: 'Ad-Supported',
      tenK: Object.assign({ verbatim: true }, AD_Q),
      summary: '11% of FY2025 revenue and about 6% of gross profit, but also the funnel into Premium. Growth has been +3% in constant currency twice running while margin roughly doubled; management has committed to double-digit growth in H2 2026.',
      brief: 'The free tier: limited on-demand music and unlimited podcasts, paid for by advertisers instead of listeners. Advertising is sold by display, audio and video impressions, through agencies and directly, and increasingly through an automated exchange.',
      sells: [
        { name: 'Ad-Supported service', what: 'The free tier: limited on-demand music, unlimited podcasts. Both a business and the main source of new Premium subscribers.' },
        { name: 'Spotify Ad Exchange (SAX)', what: 'A programmatic marketplace letting advertisers buy inventory through real-time biddable auctions. Launched April 2025; the centre of the ad rebuild.' },
        { name: 'Spotify Audience Network (SPAN)', what: 'An audio-ad marketplace spanning Spotify\'s own podcasts, enterprise publishers on Megaphone and independent creators, including inventory off Spotify itself.' },
        { name: 'Megaphone', what: 'Podcast hosting and ad-insertion for enterprise publishers, acquired in 2020; the plumbing under a large share of SPAN inventory.' },
      ],
      products: [
        { name: 'Display, audio and video advertising',
          what: 'Advertising impressions delivered in the free tier and in podcasts, bought by agencies on behalf of their clients and directly by some large advertisers.',
          customers: { archetype: { text: AD_Q.text.split('. ')[1] + '.', where: AD_Q.where },
                       named: [], concentration: NO_CONC },
          management: [{ q: 'Q2 2026', text: 'Alex Norström: “33,000 active advertisers. This is 60% up from last year”; 7,000 of them use the AI audio-asset creation tool. Christian Luiga: ad-supported revenue grew 3% year over year, “consistent with Quarter 1”.' }] },
        { name: 'Spotify Ad Exchange (programmatic)',
          what: 'Automated and self-serve buying through real-time auctions, replacing insertion-order selling.',
          customers: { archetype: { text: 'Advertisers that “automate the buying” instead of writing emails, signing insertion orders and making calls.', where: 'Q2 2026 call, Alex Norström (paraphrased from his answer)' },
                       named: [], concentration: NO_CONC },
          management: [{ q: 'Q2 2026', text: 'Alex Norström: automated channels “represent nearly 40% of ad-supported revenue in Q2, up from just over 30% in Q1”; “99% of all the impressions that we serve are now on our own ad stack”. Christian Luiga: “we continue to expect our ads business to inflect towards double-digit growth in the second half of 2026”.' }] },
      ],
      kpis: [
        { name: 'Ad-Supported MAUs', definition: 'Users of the free tier who consumed any content in the last thirty days, at period end (millions): the audience the advertising business sells.',
          filing: ADMAU_Q.text, filingWhere: ADMAU_Q.where, unit: 'count', periodicity: 'Quarterly',
          source: 'Spotify shareholder decks (1Q24–3Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:admau' },
        { name: 'Total MAUs', definition: 'Ad-Supported users plus Premium subscribers active in the last thirty days, at period end (millions); the headline user count.',
          filing: MAU_Q.text, filingWhere: MAU_Q.where, unit: 'count', periodicity: 'Quarterly',
          source: 'Spotify shareholder decks (1Q24–3Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:mau' },
      ],
      kpiNote: 'Spotify publishes the audience, not the advertising: no impressions, no price per impression, no advertiser count in the filings (the call gives 33,000 active advertisers once). Revenue per ad-supported MAU and the costs per user are derived: they sit in Revenue interactions and its table, not here.',
      interactions: [
        { name: 'Ad-supported MAUs × revenue per ad MAU', relation: 'Ad-Supported revenue = ad-supported MAUs × revenue per ad MAU', bridge: 'audience',
          lines: ['Display, audio and video advertising'],
          why: 'The audience is the supply of advertising; revenue per ad MAU is how hard it is monetized. Emerging markets drive most MAU growth and monetize least, so the audience can grow while revenue per ad MAU falls.',
          data: 'Ad-supported MAUs at quarter end and Ad-Supported revenue are published; revenue per ad MAU is their quotient, per quarter. As-reported revenue: the 1 Jan 2026 reclassification moved revenue out of this segment, so 1Q26 onward is not comparable with earlier quarters.' },
      ],
      drivers: {
        rev: { from: 'results:adrev' },
        opinc: { from: 'results:adgp' },
        admau: { from: 'results:admau' },
      },
      bridges: [
        { key: 'audience', label: 'Ad-supported MAUs × revenue per ad MAU', view: 'q', target: 'rev', kind: 'decomposition',
          terms: ['admau', 'revPerAdMau'],
          identity: 'Ad-Supported revenue = ad-supported MAUs × revenue per ad MAU',
          note: 'A decomposition, not an independent build: revenue per ad MAU is Ad-Supported revenue divided by ad-supported MAUs. What it shows is how much of the Ad-Supported line comes from a bigger audience and how much from monetizing it better.' },
      ],
      highlights: ['revPerAdMau', 'gpMgn'],
    },
  ],

  // ── Other: omitted. Spotify publishes no revenue cut beyond its two segments except a three-bucket geography
  // (United States, Luxembourg, other countries; annual), and only FY2025 is on file here. ──
  other: [],

  // ── Customers ────────────────────────────────────────────────────────────────────────────
  customers: {
    splc: {
      revBaseM: null, revBaseLabel: 'revenue',
      coverageWhy: 'none of the 25 named customers carries a relationship size in Bloomberg, so this is a census of who has disclosed a relationship with Spotify, not a measure of how much they buy. The “what” column is the customer’s Bloomberg industry; the screen does not say what the relationship is.',
      named: 25, sized: 0, sizedSumM: null,
      source: 'Bloomberg Supply Chain Analysis (SPLC), SPOT US Equity, Customers tab, as of 21 Oct 2026, currency EUR — counterparty disclosures, not Spotify filings',
      file: 'G:\\My Drive\\Summit\\Docs\\Extras\\Team\\DAA\\Ad hoc info search\\SPOT UPDATE (screenshots; customer side)',
      customers: [
        { name: 'WW International', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025Q1 filing', what: 'Consumer Services' },
        { name: 'Danal', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026C2 filing', what: 'Specialty Finance' },
        { name: 'Flutter Entertainment', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025 annual filing', what: 'Leisure Facilities & Services' },
        { name: 'Episode', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026C2 filing', what: 'Entertainment Content' },
        { name: 'Bank of Innovation', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024C3 filing', what: 'Entertainment Content' },
        { name: 'Orient Electric', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026Q1 filing', what: 'Electrical Equipment' },
        { name: 'Kunlun Tech', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2023 annual filing', what: 'Internet Media & Services' },
        { name: 'The Trade Desk', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026Q2 filing', what: 'Advertising & Marketing' },
        { name: 'Partner Communications', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2022 annual filing', what: 'Telecommunications' },
        { name: 'Audacy', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024Q1 filing', what: 'Publishing & Broadcasting' },
        { name: 'Universal Entertainment', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025 annual filing', what: 'Leisure Facilities & Services' },
        { name: 'Telefonica Brasil', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2023 annual filing', what: 'Telecommunications' },
        { name: 'PC Connection', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025Q1 filing', what: 'Wholesale - Discretionary' },
        { name: 'Sonos', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025 annual filing', what: 'Technology Hardware' },
        { name: 'Emirates Airline', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026 annual filing', what: 'Transportation & Logistics' },
        { name: 'Kansai Nerolac Paints', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2026Q4 filing', what: 'Chemicals' },
        { name: 'Innity', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024 annual filing', what: 'Advertising & Marketing' },
        { name: 'KPN', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2023Q3 filing', what: 'Telecommunications' },
        { name: 'Bollore', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025 annual filing', what: 'Oil & Gas Supply Chain' },
        { name: 'Globe Telecom', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2025 annual filing', what: 'Telecommunications' },
        { name: 'Tapestry', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company news', what: 'Apparel & Textile Products' },
        { name: 'Bertelsmann', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2023 annual filing', what: 'Publishing & Broadcasting' },
        { name: 'Lagardere', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024 annual filing', what: 'Retail - Discretionary' },
        { name: 'Air Canada', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024 annual filing', what: 'Transportation & Logistics' },
        { name: 'Cliq Digital', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer’s 2024 annual filing', what: 'Entertainment Content' },
      ]
    },
    classes: [
      { key: 'listeners', label: 'Listeners — subscribers and free users', where: FIL + ', Item 4.B (p. 35)',
        text: 'We offer both Premium and Ad-Supported Services to our customers. Our Premium and Ad-Supported Services live independently, but thrive together.' },
      { key: 'partners', label: 'Telecom partners', where: FIL + ', Item 4.B (p. 35)',
        text: 'The Premium Service is also sold through partners who are generally telecommunications companies that bundle the subscription with their own services or collect payment for the stand-alone subscriptions from their end customers. Premium partner subscription revenue is based on a per-subscriber rate in a negotiated partner agreement.' },
      { key: 'advertisers', label: 'Advertising agencies and advertisers', where: FIL + ', Item 4.B (p. 36)',
        text: 'We enter into arrangements with advertising agencies that purchase advertising on behalf of their clients and we also enter into arrangements directly with some large advertisers.' },
    ],
    concentration: { disclosed: false,
      note: NO_CONC + ' The only concentration the 20-F states is on the supplier side: “The music industry has a high level of concentration, which means that one or a small number of entities may, on their own, take actions that adversely affect our business” (Item 3.D, p. 13), and “For the year ended December 31, 2025, this content accounted for approximately 72% of streams of audio content delivered by record labels” (Item 3.D, p. 13).' },
  },
};
