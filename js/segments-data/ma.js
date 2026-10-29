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
// the estimate for the periods not yet reported: the Summit model where it has the line, the Street otherwise
function readEst(key, view, scale){
  var m = maResults.views[view].metrics[key], o = {};
  m.periods.forEach(function(p, i){
    if (m.act && m.act[i] != null) return;
    var v = (m.summit && m.summit[i] != null) ? m.summit[i] : ((m.cons && m.cons[i] != null) ? m.cons[i] : null);
    if (v != null) o[p] = v / (scale || 1);
  });
  return o;
}

export var maSegments = {
  company: 'Mastercard',
  updated: 'Oct 2026',
  source: 'Net revenue by category and revenue lines: Mastercard earnings releases (as recorded by Bloomberg) and the FY2025 Form 10-K (Item 7; Note 3), through the Results dataset; Summit DCF model (DCF MA - New.xlsm, read Oct 2026, frozen, not live) for forecast periods; Street quarters from Bloomberg consensus. Purchase volume and switched transactions: Mastercard supplemental data as recorded by Bloomberg. Region: 10-K Note 3. Customers: 10-K and the earnings calls.',
  streetForward: true,
  defaultHidden: ['margin'],   // Summit and the Street open ON in the Top Line charts; the margin line opens OFF
  ramp: ['#475569', '#94a3b8', '#0f172a', '#cbd5e1', '#64748b'],   // the series colours of this profile: slate greys, no categorical palette (CIO)

  axis: {
    q: ['1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'],
    y: ['2023', '2024', '2025', '2026', '2027', '2028', '2029'],
  },

  shared: {
    pv: { label: 'Purchase volume', short: 'Purchase volume', unit: 'usdM', scope: 'company',
      src: 'Mastercard supplemental data, as recorded by Bloomberg (network purchase volume, US$ M)',
      q: { act: readThrough('pvol', 'q'), summit: readEst('pvol', 'q') }, y: { act: readThrough('pvol', 'y'), summit: readEst('pvol', 'y') } },
    ptx: { label: 'Switched transactions (billions)', short: 'Switched transactions', unit: 'idx', scope: 'company',
      src: 'Mastercard supplemental data, as recorded by Bloomberg (processed transactions, billions)',
      q: { act: readThrough('ptx', 'q', 1000), summit: readEst('ptx', 'q', 1000) }, y: { act: readThrough('ptx', 'y', 1000), summit: readEst('ptx', 'y', 1000) } },
    g_am: { label: 'Americas', short: 'Americas', unit: 'usdM', scope: 'company', src: '10-K Note 3, by region (Americas = United States, Canada and Latin America)',
      y: { act: { '2023': 11135, '2024': 12375, '2025': 14044 } } },
    gv_us: { label: 'United States', short: 'United States', unit: 'usdM', scope: 'company', src: 'Mastercard earnings releases, Operating Performance table, all Mastercard credit, charge and debit programs (gross dollar volume, US$ B, three months ended)',
      q: { act: { '1Q23': 673000, '2Q23': 717000, '3Q23': 720000, '4Q23': 727000, '1Q24': 712000, '2Q24': 764000, '3Q24': 768000, '4Q24': 793000, '1Q25': 764000, '2Q25': 813000, '3Q25': 819000, '4Q25': 825000, '1Q26': 795000, '2Q26': 858000 } },
      y: { act: { '2023': 2837000, '2024': 3037000, '2025': 3221000 } } },
    gv_ca: { label: 'Canada', short: 'Canada', unit: 'usdM', scope: 'company', src: 'Mastercard earnings releases, Operating Performance table, all Mastercard credit, charge and debit programs (gross dollar volume, US$ B, three months ended)',
      q: { act: { '1Q23': 57000, '2Q23': 66000, '3Q23': 66000, '4Q23': 68000, '1Q24': 62000, '2Q24': 68000, '3Q24': 68000, '4Q24': 70000, '1Q25': 60000, '2Q25': 70000, '3Q25': 71000, '4Q25': 74000, '1Q26': 68000, '2Q26': 76000 } },
      y: { act: { '2023': 257000, '2024': 268000, '2025': 275000 } } },
    gv_la: { label: 'Latin America', short: 'Latin America', unit: 'usdM', scope: 'company', src: 'Mastercard earnings releases, Operating Performance table, all Mastercard credit, charge and debit programs (gross dollar volume, US$ B, three months ended)',
      q: { act: { '1Q23': 166000, '2Q23': 181000, '3Q23': 192000, '4Q23': 208000, '1Q24': 205000, '2Q24': 201000, '3Q24': 202000, '4Q24': 212000, '1Q25': 202000, '2Q25': 215000, '3Q25': 229000, '4Q25': 257000, '1Q26': 252000, '2Q26': 269000 } },
      y: { act: { '2023': 747000, '2024': 820000, '2025': 903000 } } },
    gv_eu: { label: 'Europe', short: 'Europe', unit: 'usdM', scope: 'company', src: 'Mastercard earnings releases, Operating Performance table, all Mastercard credit, charge and debit programs (gross dollar volume, US$ B, three months ended)',
      q: { act: { '1Q23': 652000, '2Q23': 731000, '3Q23': 758000, '4Q23': 761000, '1Q24': 740000, '2Q24': 799000, '3Q24': 867000, '4Q24': 870000, '1Q25': 805000, '2Q25': 933000, '3Q25': 996000, '4Q25': 1006000, '1Q26': 943000, '2Q26': 1025000 } },
      y: { act: { '2023': 2902000, '2024': 3276000, '2025': 3740000 } } },
    gv_ap: { label: 'Asia Pacific, Middle East and Africa', short: 'APMEA', unit: 'usdM', scope: 'company', src: 'Mastercard earnings releases, Operating Performance table, all Mastercard credit, charge and debit programs (gross dollar volume, US$ B, three months ended)',
      q: { act: { '1Q23': 559000, '2Q23': 572000, '3Q23': 569000, '4Q23': 587000, '1Q24': 570000, '2Q24': 571000, '3Q24': 597000, '4Q24': 615000, '1Q25': 587000, '2Q25': 599000, '3Q25': 632000, '4Q25': 657000, '1Q26': 645000, '2Q26': 654000 } },
      y: { act: { '2023': 2287000, '2024': 2353000, '2025': 2475000 } } },
    g_ap: { label: 'Asia Pacific, Europe, Middle East and Africa', short: 'APEMEA', unit: 'usdM', scope: 'company', src: '10-K Note 3, by region',
      y: { act: { '2023': 13963, '2024': 15792, '2025': 18747 } } },
  },
  derived: {
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
        { name: 'Net yield', definition: 'Net revenue divided by purchase volume: what the network and its services keep, after rebates and incentives, per dollar of purchases. Derived from the two series, for the actual, the Street and the Summit model alike.',
          source: 'Derived: net revenue ÷ purchase volume', periodicity: 'Quarterly', series: 'results:netyld', unit: 'pct' },
        { name: 'Gross yield', definition: 'Net revenue plus client incentives, divided by purchase volume: everything before rebates and incentives come off.',
          source: 'Derived: (net revenue + client incentives) ÷ purchase volume', periodicity: 'Quarterly', series: 'results:grossyld', unit: 'pct' },
        { name: 'Incentive yield', definition: 'Client incentives divided by purchase volume: the part of the gross yield Mastercard gives back to its customers.',
          source: 'Derived: client incentives ÷ purchase volume', periodicity: 'Quarterly', series: 'results:incyld', unit: 'pct' },
      ],
      kpiNote: 'Mastercard publishes gross dollar volume, cross-border volume growth and switched transaction growth each quarter, and the amounts of its four network assessments each year. It publishes no card count by quarter and no price list: fees are negotiated by customer and the rebates and incentives that come off them are reported only in total.',
      interactions: [
        { name: 'Purchase volume × net yield', relation: 'payment network net revenue = purchase volume × net yield', bridge: null,
          lines: ['Domestic and cross-border volume', 'Transaction switching'],
          why: 'The price × volume identity of the network. Volume grows with spending; yield is what the network keeps per dollar. Is the yield durable? Net revenue per dollar of purchases held at 21.5, 21.6 and 22.1 basis points in 2023, 2024 and 2025 even though rebates and incentives rose from 49.0% to 51.3% of gross network revenue: gross revenue per dollar rose from 42.2 to 45.5 basis points (cross-border and processing grew faster than volume) and paid for the higher incentives. Mastercard does not announce network price rises; the 10-K names pricing only among the drivers of value-added services growth. The cost that sits against the yield is the incentive itself, shown in Bottom Line.',
          data: 'Net, gross and incentive yield are charted in the KPIs above. NOT CHARTED as a bridge: both inputs are reported, but the 2023 presentation change (other revenue moved out of the network lines) breaks the comparison before 2023.' },
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
      key: 'geo', label: 'Revenue by region', sub: 'the two regions Mastercard reports',
      lede: 'The same net revenue by region. In dollars Mastercard reports only two: the Americas (the United States, Canada and Latin America) and Asia Pacific, Europe, the Middle East and Africa. The United States alone is about 29% of net revenue.',
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
    {
      key: 'gdv', label: 'Volume by region', sub: 'gross dollar volume, five regions',
      lede: 'Revenue is reported in two regions, so the finer cut is the volume that drives it: Mastercard reports gross dollar volume for the United States, Canada, Latin America, Europe and Asia Pacific, the Middle East and Africa every quarter. The United States is the largest single region and the slowest growing.',
      note: 'Quarterly from Mastercard’s earnings releases (Operating Performance table, all Mastercard credit, charge and debit programs), US$ converted at the quarter’s average rate; the five regions sum to the worldwide figure within rounding. Annual is the sum of the four quarters. This is volume, not revenue: Mastercard does not report revenue for these regions.',
      caveat: 'GDV counts purchases and cash, and converts local currency to US dollars at each quarter’s average rate, so a stronger or weaker dollar moves a region’s reported figure without any change in activity.',
      tenK: { text: 'Gross Dollar Volume (“GDV”) measures dollar volume of activity, including both domestic and cross-border volume, on cards carrying our brands during the period, on a local currency basis and U.S. dollar-converted basis. GDV represents purchase volume plus cash volume.',
              where: TENK + ', Item 7 — Key Metrics and Drivers', verbatim: true },
      spans: 'Quarterly 1Q23–2Q26; annual 2023–2025.',
      views: ['q', 'y'],
      series: [
        { key: 'gv_us', ref: 'shared:gv_us', label: 'United States' },
        { key: 'gv_eu', ref: 'shared:gv_eu', label: 'Europe' },
        { key: 'gv_ap', ref: 'shared:gv_ap', label: 'Asia Pacific, Middle East and Africa' },
        { key: 'gv_la', ref: 'shared:gv_la', label: 'Latin America' },
        { key: 'gv_ca', ref: 'shared:gv_ca', label: 'Canada' },
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
    splc: {
      revBaseM: 32791, revBaseLabel: 'FY2025 net revenue',
      coverageWhy: 'Bloomberg gives no relationship size for any of Mastercard\u2019s customers: this is a list of who reports a relationship, with the filing period behind each name, not of how much each one buys. Mastercard itself says its five largest customers were about $6.9B, or 21%, of FY2025 net revenue; none of the five is sized here. Of the 49 customers Bloomberg could domicile, 25 (51%) are US companies.',
      named: 61, sized: 0, sizedSumM: null,
      source: 'Bloomberg Supply Chain Analysis (SPLC), MA US Equity, Customers, as of Oct 28 2026 \u2014 relationships as reported by the counterparties or in company news, not a Mastercard statement',
      file: 'Bloomberg SPLC screenshots (MA US Equity, customer side, 61 relationships; geography: 49 customers domiciled, 209 customer facilities)',
      customers: [
        { name: 'Expedia Group Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Internet Media & Services' },
        { name: 'WEX Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'Emirates Telecommunications Group Co', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024A CF', what: 'Telecommunications' },
        { name: 'Fidelity National Information Services Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'Intelligent Wave Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025S1 CF', what: 'Software' },
        { name: 'Talabat Holding PLC', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2023A CF', what: 'Internet Media & Services' },
        { name: 'KnitWell Group LLC', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Retail - Discretionary' },
        { name: 'Reply SpA', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'IT Services' },
        { name: 'Shanghai Sunrate Information Technology', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'IT Services' },
        { name: 'Brex Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Specialty Finance' },
        { name: 'NationsBenefits LLC', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Health Care Facilities & Services' },
        { name: 'Alpha Modus Holdings Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Software' },
        { name: 'EverCommerce Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Software' },
        { name: 'Finseta PLC', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025S1 CF', what: 'Software' },
        { name: 'Bytes Technology Group PLC', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026A CF', what: 'IT Services' },
        { name: 'Lottomatica Group SpA', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025Q1 CF', what: 'Leisure Facilities & Services' },
        { name: 'Paysend Group Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Specialty Finance' },
        { name: 'Greenlight Financial Technology Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Software' },
        { name: 'HiPay Group SA', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024A CF', what: 'Specialty Finance' },
        { name: 'PayPal Holdings Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Specialty Finance' },
        { name: 'Worldline SA/France', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'GoDaddy Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Internet Media & Services' },
        { name: 'Usio Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'Goldpac Group Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Technology Hardware' },
        { name: 'LightInTheBox Holding Co Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'E-Commerce Discretionary' },
        { name: 'EVERTEC Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024A CF', what: 'Specialty Finance' },
        { name: 'Wix.com Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Software' },
        { name: 'Marqeta Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'Clearing House Payments Co LLC/The', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Banking' },
        { name: 'Zalando SE', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026Q2 CF', what: 'E-Commerce Discretionary' },
        { name: 'Citizens Financial Group Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Block Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'Euronet Worldwide Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'ePlus Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Wholesale - Discretionary' },
        { name: 'Amadeus IT Group SA', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024Q1 CF', what: 'Leisure Facilities & Services' },
        { name: 'Mobile Telecommunications Co KSCP', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Telecommunications' },
        { name: 'Green Dot Corp', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026Q2 CF', what: 'Specialty Finance' },
        { name: 'Thomas Cook India Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026A CF', what: 'Leisure Facilities & Services' },
        { name: 'Cia Brasileira de Distribuicao', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2023A CF', what: 'Retail - Consumer Staples' },
        { name: 'ACI Worldwide Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Software' },
        { name: 'Cantaloupe Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2023A CF', what: 'Software' },
        { name: 'RTB Digital Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024Q1 CF', what: 'Software' },
        { name: 'Freedom Holding Corp/NV', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024A CF', what: 'Asset Management' },
        { name: 'DTS Corp', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2024A CF', what: 'IT Services' },
        { name: 'Mobile Telecommunications Co Saudi Arabia', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2023A CF', what: 'Telecommunications' },
        { name: 'LAC Co Ltd', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'IT Services' },
        { name: 'BPER Banca SPA', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Tieto Oyj', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2022Q3 CF', what: 'IT Services' },
        { name: 'NewtekOne Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Banking' },
        { name: 'Deutsche Lufthansa AG', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Transportation & Logistics' },
        { name: 'UniCredit SpA', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Thales SA', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Company News', what: 'Aerospace & Defense' },
        { name: 'Webster Financial Corp', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Fiserv Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2025A CF', what: 'Specialty Finance' },
        { name: 'BOK Financial Corp', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Southwest Airlines Co', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026Q3 CF', what: 'Transportation & Logistics' },
        { name: 'Wells Fargo & Co', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'Gap Inc/The', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026A CF', what: 'Retail - Discretionary' },
        { name: 'Dillard\'s Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026A CF', what: 'Retail - Discretionary' },
        { name: 'JPMorgan Chase & Co', ticker: null, amtM: null, period: null, theirPct: null, basis: '2024Q1 CF', what: 'Banking' },
        { name: 'H&R Block Inc', ticker: null, amtM: null, period: null, theirPct: null, basis: 'Customer\'s 2026A CF', what: 'Commercial Support Services' }
      ],
    },
  },
};
