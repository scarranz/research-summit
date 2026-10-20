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

var Q = ['1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'];   // reported quarters only: 3Q26 is a single estimated quarter and the General cards read the last period

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
  source: 'Segment revenue and gross profit: the Results dataset (js/results-data/spot.js) — Spotify quarterly shareholder decks and 6-Ks (1Q24–2Q26), the FY2025 Form 20-F (SEC EDGAR, CIK 1639920, accession 0001628280-26-006874) for the annual totals, and the Bloomberg export for 2023 and segment gross profit by quarter (3Q25 derived from the 20-F segment totals). Subscribers, MAU, ad-supported MAU and ARPU: shareholder decks and the Bloomberg export; definitions verbatim from the 20-F. Summit FY2026–FY2028: DCF model snapshot of 2026-08-05, frozen. Everything in EUR.',

  axis: {
    q: Q,
    y: ['2023', '2024', '2025', '2026', '2027', '2028'],
  },

  shared: {},

  derived: {
    revPerSubMonth:   { label: 'Revenue per subscriber-month', short: '€ / sub-month', unit: 'eps', num: 'rev', den: 'subMonths' },
    costPerSubMonth:  { label: 'Cost of revenue per subscriber-month', short: 'Cost / sub-month', unit: 'eps', num: 'cogs', den: 'subMonths' },
    gpPerSubMonth:    { label: 'Gross profit per subscriber-month', short: 'GP / sub-month', unit: 'eps', num: 'opinc', den: 'subMonths' },
    gpMgn:            { label: 'Segment gross margin', short: 'Gross margin', unit: 'pct', num: 'opinc', den: 'rev' },
    revPerAdMau:      { label: 'Revenue per ad-supported MAU (per quarter)', short: '€ / ad MAU', unit: 'eps', num: 'rev', den: 'avgAdMau' },
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
          source: 'Spotify shareholder decks (1Q24–2Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:subs' },
        { name: 'Premium ARPU', definition: 'Average monthly revenue per Premium subscriber, in euros: Premium revenue in the quarter ÷ average daily subscribers ÷ three months.',
          filing: ARPU_Q.text, filingWhere: ARPU_Q.where, unit: 'eps', periodicity: 'Quarterly (annual = average of the four quarters)',
          source: 'Spotify shareholder decks (1Q24–2Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:arpu' },
        { name: 'Revenue per subscriber-month (ours)', definition: 'Premium revenue ÷ (average of the opening and closing subscribers × 3). The same quantity as ARPU on a simpler average; it lands within about 1% of the reported ARPU in every quarter.',
          filing: null, unit: 'eps', periodicity: 'Quarterly', source: 'Derived here from the two published lines above.', series: null,
          needs: 'Not a published KPI; shown as a table row, not a series.' },
      ],
      kpiNote: 'Spotify publishes two operating KPIs for Premium: subscribers at period end and monthly ARPU. It does not publish revenue by plan, by region or by partner, and no price list. Total MAU is on the Ad-Supported tab, because its definition adds both tiers.',
      interactions: [
        { name: 'Subscribers × price', relation: 'Premium revenue = subscriber-months × revenue per subscriber-month', bridge: 'pricevol',
          lines: ['Premium plans (Individual · Duo · Family · Student)', 'Premium through telecom partners'],
          why: 'The 20-F states the identity itself: “Revenue from our Premium segment is a function of the price of our Subscription Offerings and the number of subscribers who subscribe to our Subscription Offerings.” Volume is subscriber-months (average subscribers × 3); price is what each of them yields per month, which is ARPU. Price durability: (1) the price per unit, the series in the chart below — about €4.55 a month in 1Q24, €4.89 in 2Q26; (2) the increases the company announced — the 20-F credits “an increase in Premium ARPU of €0.25 as a result of price increases” for FY2025, and the portal’s theme record dates the broad rises (Q3 2023, Aug 2025, and the US individual plan to $12.99 in Jan 2026); (3) the cost per unit it is measured against — cost of revenue per subscriber-month, in the table rows, which has moved from about €3.18 in 1Q24 to €3.17 in 2Q26 while price rose, so the gross profit per subscriber-month is what widened.',
          data: 'Both terms are derived from published lines (subscribers at period end, Premium revenue) for 1Q24–2Q26; ARPU as Spotify reports it sits within about 1% of the derived price in every quarter. Cost per unit is Premium cost of revenue ÷ subscriber-months (Bloomberg export, tied to the 6-K segment note).' },
      ],
      drivers: {
        rev: { from: 'results:premrev' },
        opinc: { from: 'results:premgp' },
        subMonths: { label: 'Subscriber-months (average subscribers × 3, millions)', short: 'Sub-months', unit: 'count', src: 'Average of the opening and closing Premium subscribers (decks), × 3',
          q: { act: { '1Q24': 712.5, '2Q24': 727.5, '3Q24': 747, '4Q24': 772.5, '1Q25': 796.5, '2Q25': 816, '3Q25': 835.5, '4Q25': 856.5, '1Q26': 874.5, '2Q26': 889.5 }, summit: {} } },
        cogs: { label: 'Premium cost of revenue', short: 'Premium cost of revenue', unit: 'usdM', src: 'Bloomberg export (ties to the 6-K segment note: Premium revenue − Premium gross profit)',
          q: { act: { '1Q24': 2268, '2Q24': 2300, '3Q24': 2338, '4Q24': 2418, '1Q25': 2509, '2Q25': 2503, '3Q25': 2557, '4Q25': 2615, '1Q26': 2703, '2Q26': 2820 }, summit: {} } },
      },
      bridges: [
        { key: 'pricevol', label: 'Subscribers × price', view: 'q', target: 'rev', kind: 'decomposition',
          terms: ['subMonths', 'revPerSubMonth'],
          identity: 'Premium revenue = subscriber-months × revenue per subscriber-month',
          note: 'A decomposition, not an independent build: revenue per subscriber-month IS revenue divided by subscriber-months, so the terms multiply back to revenue by construction. What it buys is the split — how much of the Premium line is more subscribers versus more yield from each. The reported ARPU is the same thing measured on average daily subscribers; it is within about 1% of the derived term in every quarter shown.' },
      ],
      highlights: ['revPerSubMonth', 'costPerSubMonth', 'gpPerSubMonth', 'gpMgn'],
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
          source: 'Spotify shareholder decks (1Q24–2Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:admau' },
        { name: 'Total MAUs', definition: 'Ad-Supported users plus Premium subscribers active in the last thirty days, at period end (millions); the headline user count.',
          filing: MAU_Q.text, filingWhere: MAU_Q.where, unit: 'count', periodicity: 'Quarterly',
          source: 'Spotify shareholder decks (1Q24–2Q26); Bloomberg export; definition verbatim from the 20-F.', series: 'results:mau' },
      ],
      kpiNote: 'Spotify publishes the audience, not the advertising: no impressions, no price per impression, no advertiser count in the filings (the call gives 33,000 active advertisers once). Revenue per ad-supported MAU below is derived, and says so.',
      interactions: [
        { name: 'Audience × monetization per user', relation: 'Ad-Supported revenue = average ad-supported MAUs × revenue per MAU', bridge: 'audience',
          lines: ['Display, audio and video advertising'],
          why: 'The audience is the supply of advertising; revenue per user is how hard it is monetized, mixing impressions sold, price and the mix of markets. Emerging markets drive most MAU growth and monetize least, so audience can grow while revenue per user falls — the pattern Spotify’s own Q3 2026 MAU guide is meant to change.',
          data: 'Both terms from published lines for 1Q24–2Q26. As-reported revenue: the 1 Jan 2026 reclassification moved revenue out of this segment, so 1Q26 onward is not comparable with earlier quarters.' },
        { name: 'Impressions × price', relation: 'Ad-Supported revenue = impressions sold × price per impression', bridge: null,
          lines: ['Display, audio and video advertising', 'Spotify Ad Exchange (programmatic)'],
          why: 'The identity advertising is actually sold on. Management says Q2 2026 growth came from impressions sold, partly offset by softness in pricing, and expects automated channels to lift both.',
          data: 'NOT CHARTED — Spotify discloses neither impressions nor price per impression.' },
      ],
      drivers: {
        rev: { from: 'results:adrev' },
        opinc: { from: 'results:adgp' },
        avgAdMau: { label: 'Average ad-supported MAUs (millions)', short: 'Avg ad MAU', unit: 'count', src: 'Average of the opening and closing ad-supported MAUs (decks)',
          q: { act: { '1Q24': 383.5, '2Q24': 390.5, '3Q24': 397.5, '4Q24': 413.5, '1Q25': 424, '2Q25': 428, '3Q25': 439.5, '4Q25': 461, '1Q26': 479.5, '2Q26': 488.5 }, summit: {} } },
      },
      bridges: [
        { key: 'audience', label: 'Audience × monetization', view: 'q', target: 'rev', kind: 'decomposition',
          terms: ['avgAdMau', 'revPerAdMau'],
          identity: 'Ad-Supported revenue = average ad-supported MAUs × revenue per MAU',
          note: 'A decomposition, not an independent build: revenue per MAU IS revenue divided by the audience. What it buys is the split between a bigger audience and a better-monetized one.' },
      ],
      highlights: ['revPerAdMau', 'gpMgn'],
    },
  ],

  // ── Other: omitted. Spotify publishes no revenue cut beyond its two segments except a three-bucket geography
  // (United States, Luxembourg, other countries; annual), and only FY2025 is on file here. ──
  other: [],

  // ── Customers ────────────────────────────────────────────────────────────────────────────
  customers: {
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
