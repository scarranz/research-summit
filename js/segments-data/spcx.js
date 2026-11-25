// segments-data/spcx.js — the Top Line dataset for SpaceX (NASDAQ: SPCX).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS). Reference shapes:
// js/segments-data/googl.js (text chips, cites) and amzn.js (customers.buys).
//
// SOURCES (SEC EDGAR, CIK 1181412):
//   424B4 prospectus, Jun 12 2026, acc. 0001628280-26-042639 — Business, MD&A (key business metrics, description of the
//     segments), Note 2 (revenue recognition by segment), Note 3 (revenue disaggregation, concentration of risk),
//     Note 19 (segments, revenue by geography).
//   Q2 2026 Form 10-Q, acc. 0001628280-26-052535 · Q3 2026 Form 10-Q, acc. 0001628280-26-066880 — Note 3 (revenue,
//     concentration of risk), MD&A (key business metrics). The AI segment is called SI (Super Intelligence) from the
//     Q3 2026 10-Q.
//   Q2 2026 call (Aug 4 2026) and Q3 2026 call (Oct 20 2026) — SAB’s transcript file "SPACEX CALLS AND CONFERENCES.txt".
//     CALL chips quote them verbatim; customers.named holds only names said on those two calls.
// Segment revenue, operating income, EBITDA and the KPIs that live in js/results-data/spcx.js are POINTERS
// (`from: 'results:<key>'`), never copied. Segment capex (quarterly) and D&A (annual) are inline, from the segment note
// (4Q25 = fiscal year less three quarters). `shared` holds what Results does not carry: customer launches and mass to
// orbit (10-Q / 424B4 key business metrics; 2Q and 4Q derived from the nine-month and full-year totals), revenue by
// geography and by products vs services (424B4), and the FY2023–FY2025 revenue lines again as annual series, because
// customers.buys computes its weights from `shared` only (the AMZN pattern).
//
// TEXT CHIPS: `tenK` / `filing` with `filingWhere` = FILING, verbatim; `management[].text` = CALL, verbatim;
// `summary` / `brief` / `sells` / `what` / `note` = OURS. No Summit model exists for SPCX, so every `summit` block is empty.

var EDGAR = 'https://www.sec.gov/Archives/edgar/data/1181412/';
var URL_P  = EDGAR + '000162828026042639/spaceexplorationtechnologi.htm';
var URL_Q2 = EDGAR + '000162828026052535/spcx-20260630.htm';
var URL_Q3 = EDGAR + '000162828026066880/spcx-20260930.htm';
var P  = '424B4 prospectus (Jun 12 2026)';
var Q2 = 'Q2 2026 Form 10-Q';
var Q3 = 'Q3 2026 Form 10-Q';
var KBM = Q3 + ', Item 2 (MD&A) — Key Business Metrics';
var CONC = 'Two customers cross 10% of revenue, neither named: Customer A (all three segments) was 16.6% of 3Q26 revenue and Customer B (SI only) 34.5% (Q3 2026 10-Q, Note 3). See Customers.';
var Q = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'];
function qmap(vals){ var o = {}; Q.forEach(function(p, i){ if (vals[i] != null) o[p] = vals[i]; }); return o; }
function ymap(a, b, c){ return { '2023': a, '2024': b, '2025': c }; }
var LINES_SRC = P + ', Note 3 (revenue disaggregated by type and segment)';

export var spcxSegments = {
  company: 'SpaceX',
  updated: 'Nov 2026',
  source: 'Segment revenue, operating income, adjusted EBITDA and KPIs are read from the Results dataset (js/results-data/spcx.js): 424B4 prospectus, Q2 and Q3 2026 10-Q and the Q3 2026 earnings release via SEC EDGAR, 4Q25 derived. Segment capex and D&A from the segment note. Customer launches and mass to orbit from the key business metrics of the 424B4 and the 10-Qs. Revenue by geography and by products vs services from the 424B4. Customer concentration from the 424B4 and the 10-Qs; customer classes from the 424B4; named customers and management quotes from the Q2 and Q3 2026 earnings calls. No Summit model.',

  axis: {
    q: ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
    y: ['2023','2024','2025']
  },

  shared: {
    custLaunches: { label: 'Customer launches (Falcon)', short: 'Customer launches', unit: 'idx', scope: 'segment',
      src: '424B4 and 10-Q key business metrics; 2Q and 4Q derived from the nine-month and full-year totals',
      q: { act: qmap([12, 9, 15, 7, 7, 10, 12]), summit: {} },
      y: { act: ymap(33, 45, 43), summit: {} } },
    mto: { label: 'Mass to orbit (metric tons)', short: 'Mass to orbit', unit: 'idx', scope: 'segment',
      src: '424B4 and 10-Q key business metrics; 4Q25 = FY2025 less the nine months',
      q: { act: qmap([450, 652, 525, 586, 556, 485, 476]), summit: {} },
      y: { act: ymap(1210, 1699, 2213), summit: {} } },
    geo_us: { label: 'United States', short: 'United States', unit: 'usdM', scope: 'company', src: P + ', Note 19 — revenue by geography',
      y: { act: ymap(7473, 10008, 12966), summit: {} } },
    geo_ie: { label: 'Ireland', short: 'Ireland', unit: 'usdM', scope: 'company', src: P + ', Note 19 — revenue by geography',
      y: { act: ymap(1047, 1371, 1827), summit: {} } },
    geo_ca: { label: 'Canada', short: 'Canada', unit: 'usdM', scope: 'company', src: P + ', Note 19 — revenue by geography',
      y: { act: ymap(447, 582, 764), summit: {} } },
    geo_oth: { label: 'All other countries', short: 'All other', unit: 'usdM', scope: 'company', src: P + ', Note 19 — revenue by geography',
      y: { act: ymap(1420, 2054, 3117), summit: {} } },
    products: { label: 'Products (Starlink kits)', short: 'Products', unit: 'usdM', scope: 'company', src: P + ', Note 3 — revenue by products and services',
      y: { act: ymap(1093, 1470, 1510), summit: {} } },
    services: { label: 'Services', short: 'Services', unit: 'usdM', scope: 'company', src: P + ', Note 3 — revenue by products and services',
      y: { act: ymap(9294, 12545, 17164), summit: {} } },
    // The six revenue lines, annual, for customers.buys (it reads `shared` only). Same numbers as the Results dataset.
    launchsvc_y: { label: 'Launch services', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(1964, 2584, 2576), summit: {} } },
    launchdev_y: { label: 'Launch & development', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(1593, 1212, 1510), summit: {} } },
    consumer_y: { label: 'Starlink consumer', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(2817, 4830, 7208), summit: {} } },
    entgov_y: { label: 'Starlink enterprise & government', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(1052, 2769, 4179), summit: {} } },
    ads_y: { label: 'Advertising (X)', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(2323, 1728, 1844), summit: {} } },
    aiinfra_y: { label: 'SI solutions & infrastructure', unit: 'usdM', scope: 'company', src: LINES_SRC, y: { act: ymap(638, 892, 1357), summit: {} } }
  },

  derived: {
    opMgn:    { label: 'Segment operating margin', short: 'Op. margin', unit: 'pct', num: 'opinc', den: 'rev' },
    ebMgn:    { label: 'Segment adjusted EBITDA margin', short: 'EBITDA margin', unit: 'pct', num: 'ebitda', den: 'rev' },
    capexInt: { label: 'Capital expenditure as % of revenue', short: 'Capex %', unit: 'pct', num: 'capex', den: 'rev' },
    daInt:    { label: 'Depreciation & amortisation as % of revenue', short: 'D&A %', unit: 'pct', num: 'da', den: 'rev' },
    // `eps` is the engine’s per-unit dollar format ($x.xx); here the unit is $ MILLIONS per launch / per MW, as the labels say.
    revPerLaunch: { label: 'Launch services revenue per customer launch ($M)', short: '$M per customer launch', unit: 'eps', num: 'launchsvc', den: 'custLaunches' },
    revPerMW: { label: 'SI solutions revenue per MW of nameplate compute ($M, quarter)', short: '$M per MW', unit: 'eps', num: 'aiinfra', den: 'gw' },
    entShare: { label: 'Enterprise & government share of Starlink revenue', short: 'Ent. share', unit: 'pct', num: 'entgov', den: 'rev' }
  },

  overview: {
    tenK: { text: 'We have three reportable segments in our vertically integrated innovation engine: Space, Connectivity, and AI. In our Space segment, we design, manufacture, and launch reusable rockets to provide high cadence, reliable, and affordable access to space at unprecedented scale. In our Connectivity segment, we operate a worldwide high-speed, low-latency broadband data and communications network powered by over 9,600 Starlink broadband and mobile satellites in Low-Earth Orbit, delivering connectivity to millions of consumer, enterprise, and government customers across 164 countries, territories, and other markets. In our AI segment, we operate a highly vertically integrated AI platform spanning our truth-seeking frontier model Grok, AI solutions for consumer and enterprise customers, X—our real-time information, entertainment, and free speech platform—and AI computational infrastructure.',
      where: P + ', Prospectus Summary — Business (the AI segment is called SI, Super Intelligence, from the Q3 2026 10-Q)' }
  },

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'the six lines the company discloses',
      lede: 'The same total cut into the six lines SpaceX reports under its three segments. Starlink consumer was the largest line through 2025; SI solutions & infrastructure — mostly compute rented to AI labs — went from $0.3B a quarter to $7.0B in five quarters and is now larger than everything else combined.',
      caveat: 'Advertising is X. SI solutions & infrastructure mixes rented compute, Grok, Cursor and X subscriptions, data licensing and the Grok API; the company does not split them.',
      note: 'Quarterly from 1Q25 (4Q25 derived) and annual from FY2023.',
      tenK: { text: 'Revenue disaggregated by type and segment is as follows: […] (1) Enterprise & Government revenue includes revenue from Starlink Mobile service offerings.',
              where: Q3 + ', Note 3 — Revenue (the same table and footnote are in the 424B4, Note 3)' },
      cite: { form: '10-Q', period: '2026-09-30', accession: '0001628280-26-066880', url: URL_Q3 },
      views: ['q','y'],
      series: [
        { key: 'consumer', ref: 'results:consumer', label: 'Starlink consumer',
          tenK: { text: 'We generate revenue in our Connectivity segment primarily through subscription fees from consumer subscribers. We drive consumer revenue through monthly subscription fees based on geographic market and download speed, recognizing revenue ratably over the service period, plus typically a one-time sale of a kit.', where: P + ', Business — Connectivity' } },
        { key: 'entgov', ref: 'results:entgov', label: 'Starlink enterprise & government',
          tenK: { text: 'In addition, we generate revenue from enterprises through contracts structured as a combination of subscriptions, data consumption, and capacity, or on a percentage-of-completion basis, depending on each customer’s particular needs. We generate government revenue via long term contracts for Starshield, a secure satellite network designed specifically for government customers and national security applications. We also earn Starlink Mobile revenue through revenue-sharing arrangements with MNO partners, based on connectivity services included in their plans.', where: P + ', Business — Connectivity' } },
        { key: 'launchsvc', ref: 'results:launchsvc', label: 'Launch services',
          tenK: { text: '(i) Launch Services for the deployment of payloads to their intended orbits for both commercial and government customers utilizing Falcon 9 and Falcon Heavy […] Launch Services revenue is derived from fixed-price contracts that range from one to five years.', where: P + ', MD&A — Description of Our Segments (Space)' } },
        { key: 'launchdev', ref: 'results:launchdev', label: 'Launch & development',
          tenK: { text: '(ii) Launch and Development for the development of spacecraft and provision of launch and mission services for government agency space programs utilizing Falcon 9, Falcon Heavy, Starship, and Dragon. […] Launch and Development revenue is derived from fixed-price contracts that can range from one to fourteen years.', where: P + ', MD&A — Description of Our Segments (Space)' } },
        { key: 'ads', ref: 'results:ads', label: 'Advertising (X)',
          tenK: { text: 'Revenue for advertising services is recognized in the period when advertising is delivered as evidenced by a person engaging with an ad on the Company’s platforms in a manner satisfying the types of engagement selected by the advertisers. The Company’s contract terms for advertising services are typically cancellable short-term arrangements.', where: Q3 + ', MD&A — Description of Our Segments (SI)' } },
        { key: 'aiinfra', ref: 'results:aiinfra', label: 'SI solutions & infrastructure',
          tenK: { text: 'providing SI solutions and infrastructure, which includes subscription-related offerings for Grok, Cursor, and X products, data licensing arrangements, and API access to Grok models, as well as the sale of cloud services.', where: Q3 + ', MD&A — Description of Our Segments (SI)' } }
      ]
    },
    {
      key: 'geo', label: 'Geography', sub: 'revenue by country where the sale originated',
      lede: 'About seven-tenths of revenue originates in the United States. The cut is by the selling entity’s country, not the customer’s, so Ireland’s share most likely reflects where international sales are booked rather than a market that size (our reading; the filing does not say).',
      caveat: 'By country of domicile in which the transaction originated — the selling entity, not where the customer is. Annual only.',
      note: 'FY2023–FY2025 from the 424B4.',
      tenK: { text: 'The following tables provide revenue by geography based on the country of domicile in which the transaction originated: […] As of December 31, 2025 and 2024, substantially all of the Company’s long-lived assets were located within the United States.',
              where: P + ', Note 19 — Segments' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '424B4', period: '2025-12-31', accession: '0001628280-26-042639', url: URL_P },
      series: [
        { key: 'geo_us', ref: 'shared:geo_us', label: 'United States' },
        { key: 'geo_ie', ref: 'shared:geo_ie', label: 'Ireland' },
        { key: 'geo_ca', ref: 'shared:geo_ca', label: 'Canada' },
        { key: 'geo_oth', ref: 'shared:geo_oth', label: 'All other countries' }
      ]
    },
    {
      key: 'type', label: 'Products vs services', sub: 'hardware sold vs everything recurring',
      lede: 'Almost everything is a service — launches, subscriptions, compute rental, ads. Products are the Starlink kits sold up front, all in Connectivity, and stayed near $1.5B while services nearly doubled.',
      note: 'Annual only, FY2023–FY2025.',
      tenK: { text: 'Revenue disaggregated by products and services is as follows: […] All of products revenue is attributable to the Connectivity segment.', where: P + ', Note 3 — Revenue' },
      axis: { y: ['2023','2024','2025'] },
      views: ['y'],
      cite: { form: '424B4', period: '2025-12-31', accession: '0001628280-26-042639', url: URL_P },
      series: [
        { key: 'products', ref: 'shared:products', label: 'Products (Starlink kits)',
          tenK: { text: 'The Company’s performance obligation to provide the Starlink Kit and other related hardware is satisfied at the point in time when control is transferred to the customer.', where: P + ', Note 2 — Revenue Recognition (Connectivity Segment)' } },
        { key: 'services', ref: 'shared:services', label: 'Services' }
      ]
    }
  ],

  customers: {
    classes: [
      { key: 'launch', label: 'Launch customers — commercial, civil and government', text: 'We offer launch services to commercial, civil, and government customers through our reusable Falcon 9 and Falcon Heavy rockets for satellite, cargo, and crew missions. […] We serve commercial and government customers—including NASA, the National Reconnaissance Office (“NRO”), Axiom Space, SES, Eutelsat, and Oneweb. We charge our customers based on the type of rocket, mass to orbit, size of payload, and type of service, such as whether the launch is dedicated to a single customer or part of a “rideshare” with other customers.', where: P + ', Business — Our Leading Capabilities (Space)' },
      { key: 'consumer', label: 'Starlink subscribers', text: 'As of March 31, 2026, we had approximately 10.3 million Starlink Subscribers, up approximately 105% from 5.0 million subscribers a year prior. We charge our Starlink Subscribers a monthly subscription fee, which varies based on geographic market and download speed, plus typically a one-time upfront terminal cost.', where: P + ', Business — Starlink Consumer Broadband' },
      { key: 'enterprise', label: 'Enterprises', text: 'We offer Starlink’s high-speed, low-latency, reliable internet services to enterprise customers across industries including construction, agriculture, retail, telecom, hospitality, aviation, maritime, and land mobility. […] Our enterprise customers include companies such as United Airlines, Carnival, Maersk, and John Deere, among others. […] Our enterprise contracts are based on a combination of subscriptions, data consumption, capacity, or other pricing models depending on each customer’s particular needs.', where: P + ', Business — Enterprise Solutions' },
      { key: 'government', label: 'Governments', text: 'For our government customers, we provide high-speed, resilient connectivity for public services, social impact, humanitarian efforts, and disaster response in even the most remote and challenging environments. […] Separately with Starshield, we have leveraged our commercial LEO satellite constellation engineering learnings and operational experiences to develop a secure, dedicated satellite network designed specifically for United States Government customers and national security applications.', where: P + ', Business — Government Solutions' },
      { key: 'mno', label: 'Mobile network operators', text: 'We partner with MNOs including major wireless carriers like T-Mobile in the United States, and other international operators including One NZ, Optus, Telstra, Rogers, KDDI, Salt, Entel, Kyivstar, and VMO2. […] We charge MNOs either a fixed fee or a per-mobile user fee-based amount, which is typically passed through to the customer via the carrier as an “add-on” feature.', where: P + ', Business — Starlink Mobile' },
      { key: 'compute', label: 'AI developers renting compute', text: 'We have the ability to use compute resources to support our proprietary AI applications (such as Grok-5, which is currently being trained at COLOSSUS II), while also providing access to select compute capacity to third-party customers. For example, in May 2026, we entered into Cloud Services Agreements with Anthropic PBC (“Anthropic”), an AI research and development public benefit corporation, with respect to access to compute capacity across COLOSSUS and COLOSSUS II. […] Pursuant to these agreements, the customer has agreed to pay us $1.25 billion per month through May 2029, with capacity ramping in May and June 2026 at a reduced fee. After the initial three-month period, the agreements may be terminated by either party upon 90 days’ notice.', where: P + ', Business — Compute Services Agreements with Third Parties' },
      { key: 'ads', label: 'Advertisers and enterprise AI buyers', text: 'We also monetize user activity through high-impact advertising inventory on X. […] For enterprises that advertise on X, we offer large-scale user engagement, real-time content, and advanced AI-driven performance marketing tools. For enterprises, we offer tailored deployments of Grok customized to specific workflows and security needs through Grok Business and Grok Enterprise, sold on license-, consumption-, or outcome-based pricing models.', where: P + ', Business — AI' }
    ],
    concentration: {
      disclosed: true,
      note: 'Consolidated revenue from significant customers is as follows: [three months ended September 30, 2026 · 2025 · nine months ended September 30, 2026 · 2025] Customer A 16.6 % 23.9 % 17.3 % 21.6 % · Customer B 34.5 % * 24.2 % * — * Customer did not represent more than 10% of consolidated revenue for the period. Revenue from Customer A relates to all three segments and revenue from Customer B relates to the SI segment. No other customers represented more than 10% of consolidated revenue during the three and nine months ended September 30, 2026 and 2025. As of September 30, 2026, one customer represented 27.7% of Accounts receivable, net. No customer represented 10% or more of Accounts receivable, net as of December 31, 2025.'
    },
    cite: { form: '10-Q (Note 3 — Concentration of risk)', period: '2026-09-30', accession: '0001628280-26-066880', url: URL_Q3 },
    splc: false,   // no Bloomberg SPLC export loaded for SPCX — no empty section
    // Section 5 — "What each top customer buys". Two unnamed customers the filings size, then the named compute
    // customers, then the customer classes weighed by the FY2025 revenue lines they pay for (424B4 Note 3; the six lines
    // add to $18,674M). Who Customer A and Customer B are is OUR inference, marked estimate; their shares are the filing’s.
    buysBase: { keys: ['launchsvc_y', 'launchdev_y', 'consumer_y', 'entgov_y', 'ads_y', 'aiinfra_y'], y: '2025', label: 'FY2025' },
    buysLede: 'SpaceX names its large customers only as A and B. Below them, the compute customers named in the prospectus or on a call, and then the customer classes weighed by the revenue lines they pay for.',
    buys: [
      { name: 'Customer A — profile fits the U.S. government (estimate)', what: 'Buys from all three segments (launches, Starlink and Starshield, SI). 25.2% of revenue in 2023, 24.2% in 2024, 20.9% in 2025; 16.6% in 3Q26 and 17.3% in the nine months', seg: 'Space · Connectivity · SI', share: 20.9, shareBasis: 'filing', src: '424B4 Note 3 (FY2025); Q3 2026 10-Q Note 3 (3Q26). Identity: our inference' },
      { name: 'Customer B — by size, the Anthropic compute contract (estimate)', what: 'SI only. 19.5% of 2Q26 revenue, 34.5% of 3Q26, 24.2% of the nine months. Anthropic’s Cloud Services Agreements: ~325,000 NVIDIA GPUs at Colossus and Colossus II, $1.25B a month through May 2029, terminable on 90 days’ notice after the first three months (424B4)', seg: 'SI', share: 34.5, shareBasis: 'filing', src: 'Q2 and Q3 2026 10-Q Note 3 (3Q26 share); 424B4 Business (contract). Identity: our inference' },
      { name: 'Google', tk: 'GOOGL', what: 'Compute capacity at Colossus (named on the Q2 2026 call). Contract size and term are not in any SpaceX filing', seg: 'SI', shareNote: 'not disclosed', src: 'Q2 2026 call' },
      { name: 'Reflection AI', what: 'Compute capacity (press reports, Jun 2026; not in a SpaceX filing or on a call)', seg: 'SI', shareNote: 'commitment, not a revenue share — estimate', src: 'Press reports — estimate' },
      { name: 'Starlink consumers', what: 'Residential and Roam plans and the kit', seg: 'Connectivity', shareOf: ['consumer_y'], src: '424B4 Note 3: Consumer' },
      { name: 'Enterprises, airlines, ships, governments and mobile carriers', what: 'Aviation, maritime, fixed-site and Starshield contracts, other government, and Starlink Mobile', seg: 'Connectivity', shareOf: ['entgov_y'], src: '424B4 Note 3: Enterprise & Government' },
      { name: 'Launch customers', what: 'Falcon 9, Falcon Heavy and rideshare launches; Dragon missions and development contracts', seg: 'Space', shareOf: ['launchsvc_y', 'launchdev_y'], src: '424B4 Note 3: Launch Services + Launch & Development' },
      { name: 'X advertisers', what: 'Advertising on X', seg: 'SI', shareOf: ['ads_y'], src: '424B4 Note 3: Advertising' },
      { name: 'Grok, X and API subscribers', what: 'Premium subscriptions on X and Grok, data licensing and API access (before the 2026 compute contracts)', seg: 'SI', shareOf: ['aiinfra_y'], src: '424B4 Note 3: AI Solutions & Infrastructure' }
    ],
    buysNote: 'Customer A and B shares are the filing’s, for the period stated in each row (the column shows FY2025 for A and 3Q26 for B); who they are is our inference. Class shares are each FY2025 revenue line over total FY2025 revenue (424B4 Note 3) — before the compute contracts, which is why compute customers are listed by contract rather than weighted. Classes overlap with A and B: Customer A buys inside the launch, enterprise & government and SI lines.'
  },

  segments: [
    {
      key: 'space', label: 'Space', short: 'Space',
      lede: 'Rockets and spacecraft. SpaceX launches commercial, NASA and military payloads on Falcon 9 and Falcon Heavy, flies crew and cargo on Dragon, and is building Starship. Most launches carry its own Starlink satellites, which earn this segment nothing — their cost is capitalised into the satellites instead.',
      summary: 'Launch services and launch & development contracts. The segment that made everything else possible, and the one that now spends most on development.',
      brief: 'Sells rides to orbit and missions in space. Reusable Falcon boosters made SpaceX the highest-cadence launcher in the world, and most launches now carry its own Starlink satellites, which earn this segment nothing. Paying customers are satellite operators, NASA and U.S. national-security agencies. Starship, still in development and expensed here, is why the segment loses money in most quarters.',
      sells: [
        { name: 'Falcon 9', what: 'The reusable workhorse rocket: dedicated launches for satellite operators, NASA and national security.' },
        { name: 'Falcon Heavy', what: 'Three Falcon 9 cores for the heaviest and deep-space payloads.' },
        { name: 'Rideshare', what: 'Shared Falcon 9 flights that carry dozens of small satellites at once.' },
        { name: 'Dragon', what: 'Crew and cargo missions to the Space Station for NASA and private astronauts.' },
        { name: 'Starship contracts', what: 'Development contracts such as NASA’s lunar lander for Artemis; the vehicle itself is still in testing.' }
      ],
      tenK: { text: 'The Company’s Space segment generates revenue primarily through (i) Launch Services for the deployment of payloads to their intended orbits for both commercial and government customers utilizing Falcon 9 and Falcon Heavy, and (ii) Launch and Development for the development of spacecraft and provision of launch and mission services for government agency space programs utilizing Falcon 9, Falcon Heavy, Starship, and Dragon.',
              where: P + ', Notes to the financial statements — Note 2, Revenue Recognition (Space Segment); Note 19 (Segments) gives no segment description', verbatim: true, url: URL_P },
      products: [
        { name: 'Falcon 9', what: 'Reusable medium-lift rocket: ~620 orbital launches by Mar 31 2026 with an over 99% mission success rate (424B4); 33 Falcon launches in 3Q26, 12 of them for customers (10-Q).',
          tenK: { text: 'Falcon 9 is the most active orbital launch vehicle today, with approximately 620 orbital space launches as of March 31, 2026, and an over 99% mission success rate.', where: P + ', MD&A — Key Business Metrics (Launches)' },
          customers: { archetype: { text: 'We offer launch services to commercial, civil, and government customers through our reusable Falcon 9 and Falcon Heavy rockets for satellite, cargo, and crew missions.', where: P + ', Business — Space' },
            named: [],
            note: 'Customer launches were 33, 45 and 43 in 2023–2025 while internal Starlink launches rose from 63 to 122 (424B4): the growth in launch count is internal.',
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'During the third quarter, our 35 launches included 21 flights of Starlink on Falcon 9, 2 flights of Starship, a Falcon Heavy, […] and 12 high-profile customer missions […]. We also flew 6 national security space launch missions.' },
                        { q: 'Q3 2026', text: 'In addition, we signed 18 new national security space launch missions […].' },
                        { q: 'Q2 2026', text: 'We’re currently launching at our highest Falcon cadence and are on the precipice of operationalizing Starship.' } ] },
        { name: 'Falcon Heavy', what: 'Heavy-lift configuration of three Falcon 9 cores, for the largest national-security and deep-space payloads.',
          customers: { archetype: { text: 'We fly to LEO, MEO, GEO, lunar, and interplanetary trajectories, as well as the International Space Station. We are the primary launch provider for the U.S. government.', where: P + ', Business — Space' },
            named: [ { name: 'NASA', q: 'Q3 2026', what: 'Falcon Heavy launch of NASA’s Roman Space Telescope into deep space.' },
                     { name: 'National Reconnaissance Office (NRO)', q: 'Q3 2026', what: 'A Falcon Heavy NRO mission, flown on Oct 1 in a three-launch day.' } ],
            concentration: CONC },
          management: [] },
        { name: 'Rideshare', what: 'Shared Falcon 9 missions carrying many small satellites, each paying for its slot.',
          tenK: { text: 'We charge our customers based on the type of rocket, mass to orbit, size of payload, and type of service, such as whether the launch is dedicated to a single customer or part of a “rideshare” with other customers.', where: P + ', Business — Space' },
          customers: { archetype: { text: 'We serve commercial and government customers—including NASA, the National Reconnaissance Office (“NRO”), Axiom Space, SES, Eutelsat, and Oneweb.', where: P + ', Business — Space' }, named: [], concentration: CONC },
          management: [ { q: 'Q3 2026', text: '[…] and a rideshare mission flying 130 payloads.' } ] },
        { name: 'Dragon (crew and cargo)', what: 'Reusable capsule flying NASA crew and cargo to the Space Station, and private astronaut missions; booked in Launch & Development.',
          tenK: { text: 'Dragon is comprised of a fully reusable capsule that is classified as Property, plant, and equipment, net and is depreciated to cost of revenue.', where: P + ', MD&A — Expenses (Space)' },
          customers: { archetype: { text: 'In 2025, we launched 11 of 12 National Security Space Launch (“NSSL”) medium and heavy lift missions and all five U.S. crew and cargo missions to the International Space Station for NASA.', where: P + ', Business — Space' },
            named: [ { name: 'NASA', q: 'Q3 2026', what: 'Three additional human spaceflight missions on Dragon, through 2028; Crew 13 flown to the Space Station.' } ],
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'We’ve also secured important new business, winning 3 additional human spaceflight missions on Dragon, which will take us through 2028, along with the Starlink communications contract on NASA’s Artemis III mission.' } ] },
        { name: 'Starship (lunar lander and development contracts)', what: 'Fully reusable heavy launcher in flight testing; NASA’s Human Landing System for Artemis is a Launch & Development contract. Every Starship launch so far is internal and earns no launch revenue.',
          tenK: { text: 'As NASA’s Human Landing System for Artemis, Starship is built to deliver astronauts and cargo to the lunar surface […]', where: P + ', Business' },
          customers: { archetype: { text: 'To date, all Starship launches have been classified as internal.', where: Q3 + ', MD&A — Key Business Metrics (Launches)' }, named: [],
            note: 'The Q3 2026 call mentions a contract to deliver payload to the lunar surface and three Starfall missions on Starship, without naming the customer.',
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'We remain on track with our goals to bring back both the first and second stages to the tower this year, refly the second stage by early next year, and ramp our launch cadence as we make progress towards rapid reusability.' },
                        { q: 'Q2 2026', text: 'Starship aims to quadruple payload capacity and reduce launch costs by 10x compared to our Falcon 9 rocket, unlocking significant capabilities across all of our business segments.' } ] }
      ],
      kpis: [
        { name: 'Rocket launches', definition: 'All successful SpaceX launches in the period, Falcon and Starship, internal and for customers.', unit: 'idx', periodicity: 'Quarterly', source: 'Q3 2026 10-Q; 424B4', series: 'results:launches',
          filing: 'Launches in a period represent the sum of all successful orbital and flight tests across our rockets, including internal Starlink deployments, development tests, and launches for our third-party customers, and excluding any cancellations or scrubs that occurred in that period.', filingWhere: KBM },
        { name: 'Customer launches', definition: 'Falcon launches whose primary payload is an external customer’s — the launches that earn Space revenue. 2Q and 4Q derived from the nine-month and full-year totals.', unit: 'idx', periodicity: 'Quarterly', source: 'Q2 and Q3 2026 10-Q; 424B4', series: 'shared:custLaunches',
          filing: 'We designate a launch as a “customer launch” if an external customer payload constitutes the primary payload (i.e., where the principal objective is to deliver the customer payload) and the mission parameters (e.g., launch window, orbital parameters, mission profile) are designed around the primary payload’s requirements. To date, all Starship launches have been classified as internal.', filingWhere: KBM },
        { name: 'Mass to orbit', definition: 'Metric tons delivered to orbit, internal and customer. 476 t in 3Q26, of which 119 t customer payloads. 4Q25 derived.', unit: 'idx', periodicity: 'Quarterly', source: 'Q2 and Q3 2026 10-Q; 424B4', series: 'shared:mto',
          filing: 'Mass to orbit is the total kilograms of payload that we deploy to orbit in a given period, and is a key indicator of SpaceX’s capacity and scalability that supports Space revenue and drives expansion across our Connectivity and SI segments. We calculate this metric by summing verified mass, including Starlink satellites, customer payloads, and development cargo, from all successful orbital and flight tests. This measure excludes failed or scrubbed attempts.', filingWhere: KBM },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations — the measure the chief operating decision maker uses.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q / 424B4 segment note', series: 'results:spaceopinc',
          filing: 'The Company’s CODM assesses performance and allocates resources to operating segments based on segment income (loss) from operations by comparing actual income (loss) from operations to historical results and previously forecasted financial information.', filingWhere: P + ', Note 19 — Segments' },
        { name: 'Segment adjusted EBITDA', definition: 'Company-defined; excludes D&A and stock-based pay.', filing: null, unit: 'usdM', periodicity: 'Quarterly', source: 'Earnings release', series: 'results:spaceebitda' }
      ],
      kpiNote: 'SpaceX publishes launches, customer launches and mass to orbit. The volume that grows — internal Starlink launches — earns no revenue here, so launch count and segment revenue do not move together. It publishes no price per launch; the revenue per customer launch below is our division. Starship flights are tracked in Miscellaneous ▸ Starship & Launch.',
      interactions: [
        { name: 'Customer launches × revenue per customer launch', relation: 'launch services revenue = customer launches × revenue per customer launch', bridge: 'launchPrice',
          lines: ['Falcon 9', 'Falcon Heavy', 'Rideshare'],
          why: 'The price × volume split of the launch line. Volume: 33, 45 and 43 customer launches in 2023–2025 and 7–15 a quarter since. Price: launch services revenue per customer launch was $59.5M, $57.4M and $59.9M in 2023–2025 and swings from $47M to $94M a quarter with the mix of Falcon Heavy, national-security and rideshare missions. Is the price durable? SpaceX has announced no launch price change in the filings or on the Q2–Q3 2026 calls; it says it charges by rocket, mass to orbit, payload size and type of service (424B4). Cost per launch is not disclosed — the 424B4 says reusability lowers it, with no figure — so sustainability cannot be measured here and is not estimated. Starship’s stated aim is a 10× lower launch cost than Falcon 9 (Q2 2026 call).',
          data: 'Customer launches from the key business metrics (2Q and 4Q derived); revenue per launch is launch services revenue ÷ customer launches, so this is a decomposition. Caveat: some customer launches (NASA, national security) can be billed in Launch & Development, so the ratio is an indicator, not a price list.' },
        { name: 'Development spend vs segment profit', relation: 'segment operating income = revenue − cost of launches − Starship R&D', bridge: null,
          lines: ['Falcon 9', 'Starship (lunar lander and development contracts)'],
          why: 'Most Starship cost is expensed to Space R&D until it is commercialised, which is why adjusted EBITDA was negative in 2Q25, 4Q25, 1Q26 and 2Q26 while revenue grew.',
          data: 'NOT CHARTED — segment R&D is disclosed annually only.' }
      ],
      drivers: {
        rev: { from: 'results:space' },
        opinc: { from: 'results:spaceopinc' },
        ebitda: { from: 'results:spaceebitda' },
        launchsvc: { from: 'results:launchsvc' },
        launchdev: { from: 'results:launchdev' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: qmap([759, 946, 1113, 1014, 1052, 1174, 1606]), summit: {} },
          y: { act: ymap(1497, 2032, 3832), summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: ymap(571, 637, 757), summit: {} } }
      },
      bridges: [
        { key: 'launchPrice', label: 'Customer launches × revenue per launch', view: 'q', target: 'launchsvc', kind: 'decomposition',
          terms: ['custLaunches', 'revPerLaunch'],
          identity: 'launch services revenue = customer launches × revenue per customer launch',
          note: 'Revenue per customer launch is launch services revenue divided by customer launches, so the terms multiply back by construction. Customer launches in 2Q and 4Q are derived from the nine-month and full-year totals.' }
      ],
      highlights: ['opMgn', 'ebMgn', 'capexInt', 'revPerLaunch']
    },
    {
      key: 'conn', label: 'Connectivity (Starlink)', short: 'Starlink',
      lede: 'Starlink: broadband from thousands of low-orbit satellites, sold as monthly subscriptions to homes and roaming users, as contracts to airlines, ships, enterprises and governments, and as the kit up front. Starlink Mobile (direct-to-cell) and Starshield (a separate network for U.S. national security) sit here too. It is the company’s profit engine.',
      summary: 'Starlink subscriptions, kits, enterprise and government contracts and Starlink Mobile. 38.8% operating margin in 2025.',
      brief: 'Sells internet from low-orbit satellites. Households and small businesses pay a monthly plan plus a one-off kit; airlines, ships, enterprises and governments sign negotiated contracts, and mobile carriers resell direct-to-cell service. Subscribers more than doubled in a year, but revenue per subscriber falls as growth comes from cheaper markets. It is the company’s profit engine.',
      sells: [
        { name: 'Residential & Roam', what: 'Monthly broadband plans for homes, travellers and small businesses, plus the kit.' },
        { name: 'Aviation', what: 'In-flight connectivity contracted with airlines — about 12,000 planes signed.' },
        { name: 'Maritime & enterprise', what: 'Connectivity for ships, remote work sites and fixed business locations.' },
        { name: 'Starshield & government', what: 'A dedicated secure network and services for the U.S. government and other states.' },
        { name: 'Starlink Mobile', what: 'Direct-to-cell service resold by mobile carriers, 22 million monthly users.' }
      ],
      tenK: { text: 'The Company’s Connectivity segment generates revenue primarily through broadband and Starlink Mobile services to consumers, and enterprise and government customers throughout 156 markets.',
              where: P + ', Notes to the financial statements — Note 2, Revenue Recognition (Connectivity Segment), p. F-17', verbatim: true, url: URL_P },
      products: [
        { name: 'Residential & Roam (consumer broadband)', what: 'Personal and business subscription plans sold on Starlink.com, plus the kit: 13.6M subscribers and $69 a month ARPU in 3Q26.',
          tenK: { text: 'Starlink consumer subscribers includes both personal (e.g., residential and roam) and business (e.g., local priority and global priority) subscription plans, but does not include managed enterprise and government customers with contracts in domains including aviation, maritime, land mobility, fixed sites, and government entities.', where: KBM },
          customers: { archetype: { text: 'We charge our Starlink Subscribers a monthly subscription fee, which varies based on geographic market and download speed, plus typically a one-time upfront terminal cost.', where: P + ', Business — Starlink Consumer Broadband' }, named: [],
            concentration: 'No single consumer matters. ' + CONC },
          management: [ { q: 'Q3 2026', text: 'We reached 13.6 million Starlink consumer subscribers, adding 1.6 million subscribers just in Q3 alone, driven by growth in more developed markets.' },
                        { q: 'Q3 2026', text: 'Starlink consumer average revenue per user or ARPU, monthly average revenue per user, increased 5% sequentially to $69 per month, benefiting from a favorable customer mix dynamic in the quarter.' },
                        { q: 'Q2 2026', text: 'While our geographic expansion may drive down blended ARPU over time, we anticipate continued subscriber momentum to deliver strong revenue growth.' } ] },
        { name: 'Aviation', what: 'In-flight connectivity under airline contracts — about 12,000 planes contracted, almost a quarter of the available aircraft (Q3 call).',
          customers: { archetype: { text: 'Our enterprise customers include companies such as United Airlines, Carnival, Maersk, and John Deere, among others.', where: P + ', Business — Enterprise Solutions' },
            named: [ { name: 'Lufthansa, Swiss, Copa Airlines, Korean Air, Austrian Airlines, Asiana Airlines', q: 'Q3 2026', what: 'Flew their first Starlink-equipped aircraft during the quarter.' },
                     { name: 'American Airlines', q: 'Q2 2026', what: 'Signed a major agreement in the quarter.' },
                     { name: 'Southwest, Virgin Atlantic, Iberia, Aer Lingus', q: 'Q2 2026', what: 'Service activated with these new partners.' } ],
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'Starlink is now contracted for roughly 12,000 planes, almost a quarter of the available aircraft, and we are expanding quickly with both new and existing customers. We have signed agreements with three of the four major U.S. carriers, along with a growing list of leading international airlines.' },
                        { q: 'Q3 2026', text: 'To keep pace with this demand, we have quadrupled aviation production rates since the beginning of the year, and we expect to double before the end of the year.' } ] },
        { name: 'Maritime & enterprise (fixed site)', what: 'Starlink for ships, field offices, drilling rigs, retail and bank branches — often as backup first, then primary.',
          customers: { archetype: { text: 'We offer Starlink’s high-speed, low-latency, reliable internet services to enterprise customers across industries including construction, agriculture, retail, telecom, hospitality, aviation, maritime, and land mobility.', where: P + ', Business — Enterprise Solutions' }, named: [],
            note: 'The 424B4 says no Starlink Enterprise customer with more than $750,000 of annual revenue has voluntarily discontinued service since 2023.',
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'As we mentioned last quarter, we continue to see significant growth opportunities on the enterprise and government side of the business, with aviation a continuing major focus and fixed site gaining momentum.' } ] },
        { name: 'Starshield & government', what: 'A dedicated, secure satellite network for U.S. national security, plus Starlink service to governments (disaster response, remote public services).',
          tenK: { text: 'Separately with Starshield, we have leveraged our commercial LEO satellite constellation engineering learnings and operational experiences to develop a secure, dedicated satellite network designed specifically for United States Government customers and national security applications.', where: P + ', Business — Government Solutions' },
          customers: { archetype: { text: 'Examples include support for the FEMA in coordinating disaster recovery after hurricanes and wildfires, the NOAA for at-sea testing and environmental monitoring, the Government of the Philippines for linking remote islands, schools, and public institutions, the Government of Jamaica for improving digital access in remote and maritime areas, and the Government of Ecuador for supporting education and healthcare connectivity in isolated communities.', where: P + ', Business — Government Solutions' },
            named: [ { name: 'U.S. government (Starshield)', q: 'Q3 2026', what: 'Enterprise and government revenue growth highlighted by growth in the Starshield program with the U.S. government.' },
                     { name: 'U.S. Space Force', q: 'Q2 2026', what: 'More than $6 billion of U.S. contracts won in Q2, supporting major Space Force programs.' } ],
            concentration: 'Customer A (all three segments) buys here. ' + CONC },
          management: [ { q: 'Q3 2026', text: 'On the government side, Starshield continues to deliver unique mission-critical capabilities, and we see further room for growth. We remain on pace for enterprise and government revenues to exceed consumer connectivity revenues in the future, each.' },
                        { q: 'Q2 2026', text: 'On the government side, we won more than $6 billion in U.S. contracts in Q2, supporting major Space Force programs that offer our nation mission-critical communications and sensing capabilities […].' } ] },
        { name: 'Starlink Mobile (direct-to-cell)', what: 'Texting, light data and voice apps straight to ordinary phones through partner carriers in about 30 countries; revenue booked in Enterprise & Government.',
          tenK: { text: '(1) Enterprise & Government revenue includes revenue from Starlink Mobile service offerings.', where: Q3 + ', Note 3 — Revenue' },
          customers: { archetype: { text: 'We partner with MNOs including major wireless carriers like T-Mobile in the United States, and other international operators including One NZ, Optus, Telstra, Rogers, KDDI, Salt, Entel, Kyivstar, and VMO2.', where: P + ', Business — Starlink Mobile' },
            named: [ { name: 'SoftBank, NTT Docomo, Spark New Zealand', q: 'Q2 2026', what: 'New Starlink Mobile partnerships with international carriers launched in Q2.' } ],
            concentration: CONC },
          management: [ { q: 'Q3 2026', text: 'We surpassed 22 million monthly users on Starlink Mobile as of the end of the quarter, up 37% quarter-over-quarter. Our near-term priority remains flying the mobile V2 constellation through next year and integrating our spectrum purchases to turn on service in early 2028.' } ] }
      ],
      kpis: [
        { name: 'Starlink consumer subscribers', definition: 'Consumer service lines at period end, millions. Excludes managed enterprise and government contracts (aviation, maritime, fixed sites, government).', unit: 'count', periodicity: 'Quarterly', source: 'Q3 2026 10-Q; 424B4', series: 'results:subs',
          filing: 'We define a Starlink consumer subscriber as a unique service line that is directly assigned to a Starlink.com account registered to a person or entity that does not have a direct, negotiated agreement with the Starlink sales team. […] We calculate Starlink consumer subscribers for a period as the number of unique service lines at the end of the period.', filingWhere: KBM },
        { name: 'Starlink consumer ARPU', definition: 'Average monthly consumer service revenue per subscriber, US$.', unit: 'eps', periodicity: 'Quarterly', source: 'Q3 2026 10-Q', series: 'results:arpu',
          filing: 'We calculate consumer ARPU as service revenue generated from Starlink consumer subscribers during the period divided by (i) the average number of Starlink consumer subscribers during the period and by (ii) the number of months in the period.', filingWhere: KBM },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q / 424B4 segment note', series: 'results:connopinc',
          filing: 'The Company’s CODM assesses performance and allocates resources to operating segments based on segment income (loss) from operations by comparing actual income (loss) from operations to historical results and previously forecasted financial information.', filingWhere: P + ', Note 19 — Segments' },
        { name: 'Satellites in orbit', definition: 'Starlink broadband and mobile satellites in low-Earth orbit: ~9,600 at Mar 31 2026 (424B4), ~10,200 at Jun 30 2026 (Q2 call).', filing: null, unit: 'idx', periodicity: 'Irregular', source: '424B4; Q2 2026 call', series: null, needs: 'Not a key business metric in the 10-Q; no quarterly series.' }
      ],
      kpiNote: 'The 10-Q publishes two Connectivity metrics: consumer subscribers and consumer ARPU. Enterprise & government — aviation, maritime, Starshield, Starlink Mobile — has no published volume or price. 3Q26 gross margin included a one-time benefit of roughly 3%, mostly tariff refunds (Q3 call).',
      interactions: [
        { name: 'Subscribers × ARPU', relation: 'consumer revenue ≈ average subscribers × ARPU × 3 months', bridge: 'subsArpu',
          lines: ['Residential & Roam (consumer broadband)'],
          why: 'The volume-price split of the consumer line. Subscribers rose 2.7× from 1Q25 to 3Q26 while ARPU fell from $86 to $69. Is the price durable? The company expects it not to be: “We generally expect Starlink Subscriber ARPU to continue to decline over the next few years as the portion of our subscriber base outside North America continues to grow, as we add lower priced service plans, and as we adjust the monthly service plan fees we charge for broadband offerings” (424B4, MD&A). ARPU rose 5% in 3Q26 on customer mix (Q3 call); no dated plan-price change is disclosed in the filings or on the Q2–Q3 2026 calls. Cost per subscriber is not disclosed, so sustainability against cost cannot be measured here and is not estimated.',
          data: 'Both terms are disclosed each quarter (4Q25 ARPU not disclosed). ARPU is itself consumer service revenue ÷ average subscribers ÷ months, so this is a decomposition; it holds up to kit sales inside consumer revenue.' },
        { name: 'Satellites × capacity per satellite', relation: 'sellable capacity = satellites in orbit × capacity per satellite', bridge: null,
          lines: ['Residential & Roam (consumer broadband)', 'Aviation', 'Maritime & enterprise (fixed site)'],
          why: 'Capacity limits sales in high-demand areas. V3 satellites are designed for one Tbps of downlink each, and one Starship launch can deploy up to 60 of them — about twenty times the downlink of a Falcon 9 launch (424B4).',
          data: 'NOT CHARTED — capacity is not disclosed as a series.' }
      ],
      drivers: {
        rev: { from: 'results:conn' },
        opinc: { from: 'results:connopinc' },
        ebitda: { from: 'results:connebitda' },
        consumer: { from: 'results:consumer' },
        entgov: { from: 'results:entgov' },
        subs: { from: 'results:subs' },
        arpu: { from: 'results:arpu' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: qmap([814, 1130, 1007, 1227, 1332, 1367, 1543]), summit: {} },
          y: { act: ymap(2455, 3498, 4178), summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: ymap(884, 1508, 2376), summit: {} } }
      },
      bridges: [
        { key: 'subsArpu', label: 'Subscribers × ARPU', view: 'q', target: 'consumer', kind: 'decomposition',
          terms: ['subs', 'arpu'],
          identity: 'consumer revenue ≈ average subscribers × ARPU × 3',
          note: 'ARPU is derived by the company from consumer service revenue and the subscriber count, so the terms reconcile by construction (up to kit sales). Units differ (millions, $/month, $M): read the shapes, not the levels.' }
      ],
      highlights: ['opMgn', 'ebMgn', 'entShare', 'capexInt']
    },
    {
      key: 'si', label: 'SI (Super Intelligence)', short: 'SI',
      lede: 'What came with xAI: compute capacity in the Colossus data centers rented to AI labs, the Grok models and apps, the X social platform (advertising and subscriptions) and, from August 2026, Cursor. Called "AI" until the Q3 2026 10-Q. In five quarters it went from a fifth of revenue to more than half.',
      summary: 'Rented AI compute, Grok, X and Cursor. 52% of 3Q26 revenue.',
      brief: 'What came with xAI. Mostly a landlord for AI computing today: it rents capacity in its Colossus data centers to AI labs for fixed monthly fees, on contracts either side can end with 90 days’ notice after a ramp period. It also sells Grok to consumers and enterprises, Cursor to software developers, and subscriptions and advertising on X. In 3Q26 it was 52% of revenue.',
      sells: [
        { name: 'Colossus compute rental', what: 'Reserved GPU capacity rented to AI labs for a fixed monthly fee.' },
        { name: 'Grok', what: 'The AI model and apps — consumer subscriptions, Grok Business and Enterprise, the API and Grok Bot.' },
        { name: 'Cursor', what: 'The AI coding environment acquired in 2026, sold per seat to developers and enterprises.' },
        { name: 'X Premium and data licensing', what: 'Paid tiers on X and licensed access to X data.' },
        { name: 'X advertising', what: 'Ads on the X platform.' }
      ],
      tenK: { text: 'The AI segment generates revenue from the sale of advertising and from AI solutions and infrastructure services, which include (i) subscription offerings, (ii) data licensing arrangements, and (iii) API access to Grok models.',
              where: P + ', Notes to the financial statements — Note 2, Revenue Recognition (AI Segment), p. F-17. The Q3 2026 10-Q renames it SI and adds the sale of cloud services', verbatim: true, url: URL_P },
      products: [
        { name: 'Colossus compute rental (cloud services)', what: 'Reserved access to GPU clusters at Colossus and Colossus II (Memphis) and Southaven, for fixed monthly fees; 1.7 GW of nameplate compute at Sep 30 2026.',
          tenK: { text: 'During 2026, the Company’s SI segment entered into revenue arrangements to provide cloud services to customers. The Company accounts for its cloud services arrangements as service contracts with a single performance obligation consisting of a stand-ready promise to provide continuous access to reserved compute capacity, with the transaction price consisting of fixed monthly fees.', where: Q3 + ', Note 2 — Cloud Services Arrangements' },
          customers: { archetype: { text: 'In addition, a significant portion of our AI infrastructure revenue is concentrated in a small number of customers. Our cloud services agreements generally provide for monthly fees and, after an initial period inclusive of capacity ramp (generally, a number of months), may be terminated by either party upon 90 days’ notice.', where: Q2 + ', Part II, Item 1A — Risk Factors' },
            named: [ { name: 'Anthropic', q: 'Q2 2026', what: 'Named as a compute customer: “as well as those for other leading companies such as Google and Anthropic.” The 424B4 gives the contract: ~325,000 NVIDIA GPUs, $1.25B a month through May 2029.' },
                     { name: 'Google', q: 'Q2 2026', what: 'Named as a compute customer alongside Anthropic. No contract terms are in a SpaceX filing.' } ],
            note: 'Reflection AI is reported as a third compute customer in the press (Jun 2026); it is not in a SpaceX filing or on a call (estimate).',
            concentration: 'Customer B (SI only) was 34.5% of group revenue in 3Q26 (Q3 2026 10-Q, Note 3).' },
          management: [ { q: 'Q3 2026', text: 'At current pricing, new compute deployments are generating a payback of less than a year. Pricing is currently tracking slightly above the high end of the $30 to $50 per watt range we were discussing just last quarter […].' },
                        { q: 'Q3 2026', text: 'Also if you look at, say, how are our short-term contracts renewing? Are they renewing at higher dollars per watt or lower? We see them renewing at higher dollars per watt, not lower dollars per watt.' },
                        { q: 'Q3 2026', text: 'We are on track to reach nearly 2 gigawatts of nameplate compute at the end of this month alone in October and have a clear line of sight […] to nameplate compute in the range of 2.5 to 3 gigawatts just by the end of this quarter.' },
                        { q: 'Q2 2026', text: 'For example, in the first few weeks of the third quarter, we’ve already contracted an additional $6.7 billion of cloud services revenue over a six-month period that begins ramping starting in October of this year.' } ] },
        { name: 'Grok (consumer, Business, Enterprise, API, Grok Bot)', what: 'xAI’s frontier model sold as consumer subscriptions, Grok Business and Grok Enterprise deployments, pay-per-token API access and the Grok Bot agent (launched Aug 2026).',
          tenK: { text: 'For enterprises, we offer tailored deployments of Grok customized to specific workflows and security needs through Grok Business and Grok Enterprise, sold on license-, consumption-, or outcome-based pricing models.', where: P + ', Business — AI' },
          customers: { archetype: { text: 'Both services are offered to consumer and enterprise customers.', where: P + ', MD&A — Description of Our Segments (AI)' }, named: [],
            concentration: 'Not disclosed by product. ' + CONC },
          management: [ { q: 'Q3 2026', text: 'Grok Bot, our agentic assistant, launched in August, and we already had paid weekly users of 800,000 earlier this month, more than doubling over the last month.' },
                        { q: 'Q3 2026', text: 'Grok enterprise customers with more than $1 million in run rate revenue, including Cursor, were up 50% quarter-over-quarter on a pro forma basis.' } ] },
        { name: 'Cursor', what: 'AI-native coding environment, consolidated from mid-3Q26; $608M of 3Q26 SI solutions revenue.',
          tenK: { text: 'Cursor develops and operates an AI-native integrated development environment that enables professional software developers and engineering teams to write, edit, review, and refactor code using LLM-powered agents and workflows integrated via its proprietary model harness.', where: P + ', Business — AI' },
          customers: { archetype: { text: 'revenue from consumer subscriptions and enterprise plans for Grok, Cursor, and X, which is recognized ratably over the period of the subscription term (ranging from month-to-month to one year) or as services are consumed for usage based arrangements', where: Q3 + ', MD&A — Description of Our Segments (SI)' }, named: [],
            concentration: 'Not disclosed by product. ' + CONC },
          management: [ { q: 'Q3 2026', text: 'For SI solutions and infrastructure, revenues were $7 billion, of which $608 million came from the Cursor acquisition closed roughly mid-quarter.' },
                        { q: 'Q3 2026', text: 'Last week, we further integrated the portfolio by announcing a new scheme that brings together Grok Bot, Cursor, and X Premium on a single plan.' } ] },
        { name: 'X Premium and data licensing', what: 'Paid subscription tiers on X, and licensed access to historical and real-time X data for developers.',
          tenK: { text: 'Data licensing arrangements grant customers a right to access, search, and analyze the Company’s historical and real-time intellectual property (“IP”) on the X platform through the developer channel for a defined period.', where: P + ', Note 2 — Revenue Recognition (AI Segment)' },
          customers: { archetype: { text: 'Our integrated AI platforms across Grok and X had approximately 1.3 billion supported accounts active in the last twelve months ended March 31, 2026 and December 31, 2025, including approximately 550 million and 520 million MAUs as of March 31, 2026 and December 31, 2025, respectively.', where: P + ', Business — AI' }, named: [],
            concentration: 'Not disclosed by product. ' + CONC },
          management: [ { q: 'Q2 2026', text: 'The increase was driven primarily by new cloud services agreements, as well as growth in Grok and X subscription revenue.' } ] },
        { name: 'X advertising', what: 'Self-serve and managed advertising on X, rebuilt on a new ad-tech platform in Q2 2026.',
          tenK: { text: 'Revenue for advertising services is recognized in the period when advertising is delivered as evidenced by a person engaging with an ad on the Company’s platforms in a manner satisfying the types of engagement selected by the advertisers.', where: Q3 + ', MD&A — Description of Our Segments (SI)' },
          customers: { archetype: { text: 'For enterprises that advertise on X, we offer large-scale user engagement, real-time content, and advanced AI-driven performance marketing tools.', where: P + ', Business — AI' }, named: [],
            concentration: 'Not disclosed. ' + CONC },
          management: [ { q: 'Q3 2026', text: 'Advertising revenues grew 19% year-over-year as we build more momentum on the new advertising tech platform that we rolled out just last quarter in Q2.' },
                        { q: 'Q2 2026', text: 'Advertising revenue grew 7% sequentially as we overhauled our advertising platform technology to enable AI functionality and enhance self-service for all customer types.' } ] }
      ],
      kpis: [
        { name: 'Nameplate compute', definition: 'Megawatts of installed GPU power at period end (1,700 MW = 1.7 GW at Sep 30 2026; 600 MW a year earlier).', unit: 'idx', periodicity: 'Quarterly', source: 'Q3 2026 10-Q; 424B4; Q2 2026 call', series: 'results:gw',
          filing: 'We calculate nameplate compute for a period as the number of GPUs installed in our data centers at the end of the period multiplied by their respective all-in power. Nameplate compute reflects installed capacity and does not represent actual power consumption or utilization. It does not include power we install and use for our supporting infrastructure such as cooling systems, power distribution losses, lighting, security systems, or facility-level overhead.', filingWhere: KBM },
        { name: 'Segment operating income', definition: 'GAAP segment income from operations.', unit: 'usdM', periodicity: 'Quarterly', source: '10-Q segment note', series: 'results:siopinc',
          filing: 'The Company’s CODM assesses performance and allocates resources to operating segments based on segment income (loss) from operations by comparing actual income (loss) from operations to historical results and previously forecasted financial information.', filingWhere: P + ', Note 19 — Segments' },
        { name: 'Segment adjusted EBITDA', definition: 'Company-defined; excludes D&A and stock-based pay.', filing: null, unit: 'usdM', periodicity: 'Quarterly', source: 'Earnings release', series: 'results:siebitda' },
        { name: 'Backlog (company-wide)', definition: 'Remaining performance obligations for the whole company, mostly compute contracts since 2Q26: $28.4B at Dec 31 2025, $47.5B at Jun 30 2026, $63.0B at Sep 30 2026 ($17.5B already deferred revenue; ~67% within a year).', unit: 'usdM', periodicity: 'Quarterly', source: '424B4; Q2 and Q3 2026 10-Q, Note 3', series: null,
          filing: 'The Company’s backlog represents the transaction price of performance obligations to customers for which work remains to be performed.', filingWhere: Q3 + ', Note 3 — Revenue (Backlog)', needs: 'Three points so far; not split by segment.' }
      ],
      kpiNote: 'The 10-Q publishes one SI metric: nameplate compute. It publishes no price per megawatt and no utilisation; the revenue per MW below is our division. Pricing is given on calls in dollars per watt.',
      interactions: [
        { name: 'Megawatts × revenue per megawatt', relation: 'SI solutions revenue = nameplate MW × revenue per MW', bridge: 'mwPrice',
          lines: ['Colossus compute rental (cloud services)', 'Grok (consumer, Business, Enterprise, API, Grok Bot)'],
          why: 'Capacity grew from 0.3 to 1.7 GW in six quarters; revenue per MW jumped when the rental contracts began in 2Q26. Is the price durable? On the Q2 call Musk guessed monetisation of $30–50 per watt for Rubin; on the Q3 call the CFO said pricing was tracking slightly above the high end of that range and Musk said short-term contracts were renewing at higher dollars per watt. No price list or dated price change is disclosed. Cost per MW is not disclosed — the 424B4 says Colossus II cost “considerably lower than industry benchmarks on a per megawatt basis” with no figure, and the Q3 call gives a payback of less than a year — so sustainability against cost is not estimated here.',
          data: 'Both terms are disclosed (MW in the 10-Q key metrics, revenue in Note 3). Revenue per MW is the derived ratio, so this is a decomposition. The line also holds Grok, Cursor and X subscriptions, so it overstates compute rental per MW.' }
      ],
      drivers: {
        rev: { from: 'results:si' },
        opinc: { from: 'results:siopinc' },
        ebitda: { from: 'results:siebitda' },
        aiinfra: { from: 'results:aiinfra' },
        ads: { from: 'results:ads' },
        gw: { from: 'results:gw' },
        capex: { label: 'Capital expenditure', short: 'Capex', unit: 'usdM', src: '10-Q / 424B4 segment note',
          q: { act: qmap([2567, 749, 4760, 4651, 7723, 15828, 16444]), summit: {} },
          y: { act: ymap(463, 5633, 12727), summit: {} } },
        da: { label: 'Depreciation & amortisation', short: 'D&A', unit: 'usdM', src: '424B4 segment note',
          y: { act: ymap(1180, 1679, 3568), summit: {} } }
      },
      bridges: [
        { key: 'mwPrice', label: 'MW × revenue per MW', view: 'q', target: 'aiinfra', kind: 'decomposition',
          terms: ['gw', 'revPerMW'],
          identity: 'SI solutions revenue = MW × revenue per MW',
          note: 'Revenue per MW is SI solutions revenue divided by quarter-end MW, so the terms multiply back by construction.' }
      ],
      highlights: ['opMgn', 'ebMgn', 'capexInt', 'revPerMW']
    }
  ]
};
