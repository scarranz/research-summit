// segments-data/ma.js — the Top Line dataset for Mastercard (NYSE: MA).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/MA.md.
//
// SHAPE OF THIS COMPANY: Mastercard has ONE reportable operating segment, "Payment Solutions" (10-K Note 22). What it discloses
// is net revenue in two CATEGORIES, payment network and value-added services and solutions (10-K Note 3). Like SharkNinja and TSM,
// the two categories stand in as the "segments" here so the pane can show what each one sells and to whom; the General tab quotes
// Note 22 so they are not read as reportable segments. There is no segment operating income, so no profit line is drawn per category.
//
// Every series is a POINTER into js/results-data/ma.js (`results:<key>`) or is read through it at load (volumes), so each number has
// one home. The engine reads `act` and falls back to `summit` (frozen DCF model, DCF MA - New.xlsm, read Oct 2026), never `cons`;
// `streetForward` adds the two Street quarters beyond the last print from the Bloomberg estimate matrix.
//
// TEXT CHIPS: `tenK` = FILING, verbatim from the FY2025 Form 10-K (SEC EDGAR); `management` = CALL, verbatim from the earnings-call
// transcript with its quarter; `summary` / `brief` / `sells` / `what` = OURS.
import { maResults } from '../results-data/ma.js';

var TENK = 'FY2025 Form 10-K';
var CONC = { disclosed: true,
  note: 'A significant portion of our net revenue is concentrated among our five largest customers. In 2025, the net revenue from these customers was approximately $6.9 billion, or 21%, of total net revenue. Mastercard did not have any individual customer that generated greater than 10% of net revenue in 2025, 2024 or 2023.',
  where: TENK + ', Item 7 (Revenue) and Note 22 (Segment Reporting)' };
var NET = { text: 'Our payment network links issuers and acquirers around the globe to facilitate the switching of transactions, permitting account holders to use our products at hundreds of millions of acceptance locations and digital access points worldwide.',
            where: TENK + ', Item 1 — Our Business (Payment Network)' };
var FI = { text: 'We enable a wide variety of payments capabilities (including products, services and solutions) over our network among account holders, merchants, financial institutions, businesses, governments and others, offering our customers one partner for their payment needs.',
           where: TENK + ', Item 1 — Our Payments Capabilities' };
var NOCARD = { text: 'We do not issue cards, extend credit, determine or receive revenue from interest rates or other fees charged to account holders by issuers, nor do we establish the rates charged by acquirers in connection with merchants’ acceptance of our products. In most cases, account holder relationships belong to, and are managed by, our customers.',
               where: TENK + ', Item 1 — Payment Network Transactions' };

// the volumes Mastercard's own supplemental data gives, read through the Results dataset (one home)
function readThrough(key, view, scale){
  var m = maResults.views[view].metrics[key], o = {};
  m.periods.forEach(function(p, i){ if (m.act && m.act[i] != null) o[p] = m.act[i] / (scale || 1); });
  return o;
}

export var maSegments = {
  company: 'Mastercard',
  updated: 'Oct 2026',
  source: 'Net revenue by category and revenue lines: Mastercard earnings releases (as recorded by Bloomberg) and the FY2025 Form 10-K (Item 7; Note 3), through the Results dataset; Summit DCF model (DCF MA - New.xlsm, read Oct 2026, frozen, not live) for forecast periods; Street quarters from Bloomberg consensus. Purchase volume and switched transactions: Mastercard supplemental data as recorded by Bloomberg. Region: 10-K Note 3. Customers: 10-K and the earnings calls.',
  streetForward: true,

  axis: {
    q: ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'],
    y: ['2023', '2024', '2025', '2026', '2027', '2028', '2029'],
  },

  shared: {
    pv: { label: 'Purchase volume', short: 'Purchase volume', unit: 'usdM', scope: 'company',
      src: 'Mastercard supplemental data, as recorded by Bloomberg (network purchase volume, US$ M)',
      q: { act: readThrough('pvol', 'q') }, y: { act: readThrough('pvol', 'y') } },
    ptx: { label: 'Switched transactions (billions)', short: 'Switched transactions', unit: 'idx', scope: 'company',
      src: 'Mastercard supplemental data, as recorded by Bloomberg (processed transactions, billions)',
      q: { act: readThrough('ptx', 'q', 1000) }, y: { act: readThrough('ptx', 'y', 1000) } },
    g_am: { label: 'Americas', short: 'Americas', unit: 'usdM', scope: 'company', src: '10-K Note 3, by region (Americas = United States, Canada and Latin America)',
      y: { act: { '2023': 11135, '2024': 12375, '2025': 14044 } } },
    g_ap: { label: 'Asia Pacific, Europe, Middle East and Africa', short: 'APEMEA', unit: 'usdM', scope: 'company', src: '10-K Note 3, by region',
      y: { act: { '2023': 13963, '2024': 15792, '2025': 18747 } } },
  },
  derived: {
    netYield: { num: 'results:pnr', den: 'results:pvol', unit: 'pct', label: 'Payment network net revenue as % of purchase volume', short: 'Net yield' },
    tpFee: { num: 'results:tp', den: 'results:ptx', unit: 'eps', label: 'Transaction processing revenue per switched transaction (US$)', short: 'Fee per transaction' },
  },

  overview: {
    tenK: { text: 'Mastercard has concluded it has one reportable operating segment, “Payment Solutions.”',
            where: TENK + ', Note 22 (Segment Reporting)' },
  },

  segments: [
    {
      key: 'pn', label: 'Payment network', short: 'Network',
      tenK: { text: 'The Company disaggregates its net revenue from contracts with customers into two categories: (i) payment network and (ii) value-added services and solutions.',
              where: TENK + ', Note 3 (Revenue)', verbatim: true },
      summary: 'The core business and the larger share of net revenue: it earns a fee on the volume and the number of transactions that run over Mastercard rails, net of what it pays customers in rebates and incentives.',
      brief: 'The switching network that links the cardholder’s bank and the merchant’s bank. Mastercard does not issue cards or lend; it charges the banks that do. Fees follow the dollar volume of activity (domestic and cross-border priced separately) and the number of transactions switched. More than half of the gross fee is then handed back to customers as rebates and incentives.',
      sells: [
        { name: 'Domestic and cross-border volume', what: 'A fee on the dollar volume of activity on cards carrying Mastercard brands; cross-border, where card and merchant countries differ, is priced higher.' },
        { name: 'Transaction switching', what: 'A fee on each transaction authorized, cleared and settled over the network.' },
        { name: 'Account-based payments', what: 'Batch and real-time payments between bank accounts, run on the same franchise.' },
      ],
      products: [
        { name: 'Consumer credit and debit', what: 'Mastercard-branded credit, debit and prepaid cards issued by banks. Consumer credit was 37% of FY2025 gross dollar volume and consumer debit and prepaid 50%.',
          tenK: NET, customers: { archetype: FI, named: [
            { name: 'Capital One', q: 'Q2 2026', what: 'The migration of its debit portfolio to Mastercard was basically complete in Q1 2026.' },
            { name: 'Citizens', q: 'Q2 2025', what: 'Its debit portfolio migration to Mastercard began in Q1 2024 and was lapped in 2025.' },
            { name: 'Wells Fargo', q: 'Q4 2024', what: 'Named with Citizens and UniCredit among the significant wins of 2024.' },
            { name: 'UniCredit', q: 'Q4 2024', what: 'Named with Citizens and Wells Fargo among the significant wins of 2024.' },
            { name: 'HSBC', q: 'Q4 2024', what: 'Renewed its global premier credit card agreement in over 20 countries.' },
            { name: 'JPMorgan Chase', q: 'Q4 2025', what: 'Mastercard stays the exclusive network for Apple Card as the issuer moves to JPMorgan Chase in about 24 months; a Chase Freedom Flex renewal followed in Q2 2026.' },
          ], concentration: CONC.note },
          management: [
            { q: 'Q2 2026', text: 'As a reminder, the Capital One debit portfolio migration was basically complete in Q1.' },
            { q: 'Q4 2024', text: 'We’ve had several significant wins in 2024, the likes of Citizens, the likes of Wells Fargo, and UniCredit.' },
          ] },
        { name: 'Cross-border', what: 'Fees where the card country differs from the merchant country: travel and cross-border e-commerce. The 10-K reports it as its own assessment line and the fastest-growing one.',
          tenK: { text: 'Cross-border assessments are charges based on activity related to cards that carry the Company’s brands where the merchant country and the country of issuance are different.', where: TENK + ', Item 7 — Key Metrics related to the Payment Network' },
          customers: { archetype: FI, named: [], concentration: CONC.note } },
        { name: 'Transaction processing', what: 'Fees on each switched transaction: authorization, clearing and settlement, and related services.',
          tenK: { text: 'Transaction processing assessments are charges primarily driven by the number of switched transactions on our payment network.', where: TENK + ', Item 7 — Key Metrics related to the Payment Network' },
          customers: { archetype: FI, named: [], concentration: CONC.note } },
        { name: 'Commercial and new payment flows', what: 'Commercial credit and debit cards (13% of FY2025 gross dollar volume), plus disbursements and account-based payments.',
          tenK: FI, customers: { archetype: FI, named: [], concentration: CONC.note } },
      ],
      kpis: [
        { name: 'Purchase volume', definition: 'Dollar volume of purchases made on Mastercard-branded cards, in US$ (Bloomberg’s record of the supplemental data). Mastercard’s headline measure is gross dollar volume, which also counts cash (FY2025: $10.6T, +9% in local currency); purchase volume is the part the network earns its yield on.',
          source: 'Mastercard supplemental data (as recorded by Bloomberg)', periodicity: 'Quarterly', series: 'shared:pv', unit: 'usdM' },
        { name: 'Switched transactions', definition: 'Transactions authorized, cleared or settled over the network, in billions (FY2025: 175.5B, +10%).',
          source: 'Mastercard supplemental data (as recorded by Bloomberg)', periodicity: 'Quarterly', series: 'shared:ptx', unit: 'idx' },
        { name: 'Net yield', definition: 'Payment network net revenue divided by purchase volume: what the network keeps, after rebates and incentives, per dollar of purchases. Computed here from the two reported series.',
          source: 'Derived: payment network net revenue ÷ purchase volume', periodicity: 'Quarterly', series: 'netYield', unit: 'pct' },
      ],
      kpiNote: 'Mastercard publishes gross dollar volume, cross-border volume growth and switched transaction growth each quarter, and the amounts of its four network assessments each year. It publishes no card count by quarter and no price list: fees are negotiated by customer and the rebates and incentives that come off them are reported only in total.',
      interactions: [
        { name: 'Purchase volume × net yield', relation: 'payment network net revenue = purchase volume × net yield', bridge: null,
          lines: ['Domestic and cross-border volume', 'Transaction switching'],
          why: 'The price × volume identity of the network. Volume grows with spending; yield is what the network keeps per dollar. Is the yield durable? Net revenue per dollar of purchases held at 21.5, 21.6 and 22.1 basis points in 2023, 2024 and 2025 even though rebates and incentives rose from 49.0% to 51.3% of gross network revenue: gross revenue per dollar rose from 42.2 to 45.5 basis points (cross-border and processing grew faster than volume) and paid for the higher incentives. Mastercard does not announce network price rises; the 10-K names pricing only among the drivers of value-added services growth. The cost that sits against the yield is the incentive itself, shown in Bottom Line.',
          data: 'Net yield is charted in the KPIs above. NOT CHARTED as a bridge: both inputs are reported, but the 2023 presentation change (other revenue moved out of the network lines) breaks the comparison before 2023.' },
        { name: 'Switched transactions × fee per transaction', relation: 'transaction processing revenue = switched transactions × revenue per transaction', bridge: null,
          lines: ['Transaction processing'],
          why: 'The second price × volume identity: transaction processing assessments divided by switched transactions. Revenue per transaction was about 8.4 cents in 2023, 8.5 in 2024 and 9.1 in 2025, so the line grew faster than the transaction count in 2025 (+17% against +10%).',
          data: 'The per-transaction fee is derived from the two reported series. NOT CHARTED as a bridge.' },
      ],
      bridges: [], highlights: [],
      drivers: { rev: { from: 'results:pnr' } },
    },
    {
      key: 'vas', label: 'Value-added services and solutions', short: 'VAS',
      tenK: { text: 'Within our value-added services and solutions, we generate revenue primarily related to the following: security solutions; consumer acquisition and engagement services; business and market insights; digital and authentication solutions; processing and gateway; other solutions (including ACH batch and real-time account-based payments and solutions, bill payments, cross-border services and open finance).',
              where: TENK + ', Item 1 — Revenue Sources', verbatim: true },
      summary: 'The faster-growing share of net revenue: services sold on top of the network and in part beyond it, priced per use or as fixed fees.',
      brief: 'Security and fraud tools, digital identity and authentication, data and analytics, consulting, loyalty and consumer acquisition, processing and gateway services, and account-based payments such as bill pay and open finance. Revenue comes from fixed or transaction-based fees. The 10-K credits the growth to the underlying key drivers, security and digital and authentication solutions, consumer acquisition and engagement, pricing, and business and market insights.',
      sells: [
        { name: 'Security solutions', what: 'Fraud scoring, cyber and threat-intelligence tools sold to banks, merchants and governments.' },
        { name: 'Digital and authentication solutions', what: 'Tokenization, identity verification and authentication for digital checkout.' },
        { name: 'Business and market insights', what: 'Data, analytics and consulting built on network activity.' },
        { name: 'Consumer acquisition and engagement', what: 'Marketing, loyalty and personalization services for issuers and merchants.' },
        { name: 'Processing, gateway and other solutions', what: 'Processing and gateway services, ACH batch and real-time account-based payments, bill payments, cross-border services and open finance.' },
      ],
      products: [
        { name: 'Security and fraud', what: 'Real-time fraud scoring, cyber-risk ratings and threat intelligence.',
          tenK: { text: 'We discuss specific security solutions that we offer to our customers below under “Services and Other Solutions”.', where: TENK + ', Item 1 — Security' },
          customers: { archetype: FI, named: [], concentration: CONC.note } },
        { name: 'Digital identity and authentication', what: 'Identity verification, tokenization and authentication that make online and in-app payments safer.',
          tenK: FI, customers: { archetype: FI, named: [], concentration: CONC.note } },
        { name: 'Insights, consulting and engagement', what: 'Analytics, advisory work, loyalty and personalization sold to banks and merchants.',
          tenK: FI, customers: { archetype: FI, named: [], concentration: CONC.note } },
        { name: 'Account-based payments and open finance', what: 'Batch and real-time account-to-account payments, bill payments and open banking data.',
          tenK: FI, customers: { archetype: FI, named: [], concentration: CONC.note } },
      ],
      kpis: [],
      kpiNote: 'Mastercard publishes no unit or price figures for value-added services and solutions: only the net revenue of the category, its growth in as-reported and currency-neutral terms, and the share that comes from acquisitions (3 points of the 23% growth in 2025).',
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:vas' } },
    },
  ],

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'the four network assessments, before rebates',
      lede: 'The payment network’s gross revenue by line: domestic, cross-border and transaction processing assessments, and other network assessments. Rebates and incentives then come off the total to give the net revenue the rest of the pane uses.',
      note: 'Quarterly from Mastercard’s releases as recorded by Bloomberg; annual from the 10-K. Before 2023 Mastercard classified part of its other revenue inside these lines, so the 2020–2022 values are not comparable with 2023 onward.',
      caveat: 'The rebates and incentives that come off these four lines ($20.5B in FY2025) are not drawn here; they are in Bottom Line.',
      tenK: { text: 'Assessments represent agreed upon standard pricing provided to our customers based on various forms of payment-related activity. Assessments are used internally by management to monitor operating performance as it allows for comparability and provides visibility into cardholder trends. Assessments do not represent our net revenue.', where: TENK + ', Item 7 — Key Metrics related to the Payment Network' },
      spans: 'Quarterly 2Q20–2Q26; annual 2020–2025.',
      views: ['q', 'y'],
      series: [
        { key: 'dom', ref: 'results:dom', label: 'Domestic assessments' },
        { key: 'xb', ref: 'results:xb', label: 'Cross-border assessments' },
        { key: 'tp', ref: 'results:tp', label: 'Transaction processing assessments' },
        { key: 'oth', ref: 'results:oth', label: 'Other network assessments' },
      ],
    },
    {
      key: 'geo', label: 'Region', sub: 'Americas and the rest of the world',
      lede: 'The same net revenue by region. Mastercard reports two: the Americas (the United States, Canada and Latin America) and Asia Pacific, Europe, the Middle East and Africa. The United States alone is about 29% of net revenue.',
      note: 'Annual only, from the 10-K (Note 3). The 10-K adds that revenue by geographic market follows the location of the issuing customer, the acquirer where the card is used or the customer receiving services.',
      caveat: 'Net revenue by region is not by cardholder residence: it follows where the customer that issued or acquired the activity is located.',
      tenK: { text: 'Americas includes the United States, Canada and Latin America.', where: TENK + ', Note 3 (Revenue)' },
      spans: 'FY2023–FY2025, from the FY2025 Form 10-K.',
      axis: { y: ['2023', '2024', '2025'] },
      views: ['y'],
      series: [
        { key: 'g_ap', ref: 'shared:g_ap', label: 'Asia Pacific, Europe, Middle East and Africa' },
        { key: 'g_am', ref: 'shared:g_am', label: 'Americas' },
      ],
    },
  ],

  customers: {
    classes: [
      { key: 'fi', label: 'Financial institutions (issuers and acquirers)', where: NET.where, text: NET.text },
      { key: 'eco', label: 'Merchants, businesses, governments and others', where: FI.where, text: FI.text },
      { key: 'noissue', label: 'Who holds the cardholder', where: NOCARD.where, text: NOCARD.text },
    ],
    concentration: CONC,
  },
};
