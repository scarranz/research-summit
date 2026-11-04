// uber-bl-data.js — reported data, filing text and the FROZEN Summit block for Uber Deep Dive ▸ Bottom Line
// (General BL-GEN-1…5 and Segments BL-SEG), read by ./uber-bl.js. docs/PROFILE_PLAYBOOK.md §13.
//
// 1) The income-statement cost lines (US$ million), between the BEGIN/END markers — GENERATED, not typed, by a scratch
//    builder from SEC EDGAR XBRL companyfacts (CIK 0001543151, pulled 2026-11-03):
//      · tags: Revenues · CostOfGoodsAndServiceExcludingDepreciationDepletionAndAmortization (Uber’s “cost of revenue,
//        exclusive of depreciation and amortization”) · SellingAndMarketingExpense · ResearchAndDevelopmentExpense ·
//        GeneralAndAdministrativeExpense · DepreciationDepletionAndAmortization · CostsAndExpenses · OperatingIncomeLoss ·
//        ShareBasedCompensation (annual `sbc`, cash-flow statement) / AllocatedShareBasedCompensationExpense (quarterly).
//      · “Operations and support” is a company-specific tag that companyfacts does not carry, so opsSupport = total
//        costs and expenses − the five other lines. It matches the 10-K MD&A table (FY2023 2,689 · FY2024 2,732 ·
//        FY2025 2,854) and the 2Q26 10-Q (805 = 696 + the $109M increase it reports).
//      · a Q4 is the fiscal year minus the nine-month year-to-date.
//      · tie-out run at generation: revenue − the six lines = income from operations (OperatingIncomeLoss) in every year
//        FY2019–FY2025 and every quarter 1Q23–2Q26, to the US$ million. These six lines ARE Uber’s costs and expenses.
//      · Uber reports no gross profit: cost of revenue EXCLUDES depreciation and amortization, which is its own line.
//
// 2) UBER_SBC_FN — stock-based compensation by function, typed from the 10-K note (“Stock-based compensation expense
//    is allocated based on the cost center to which the award holder belongs”): Form 10-K FY2025 (FY2023–FY2025) and
//    Form 10-K FY2024 (FY2022). There is no SBC in cost of revenue. Bloomberg’s by-line SBC (uber-bbg.js) matches it.
//
// 3) Segment profit — two measures, NEVER spliced into one series:
//      · Segment Adjusted EBITDA — Uber’s segment measure through 4Q25 (Form 10-K FY2025, Note 13; quarterly from the
//        10-Q segment notes; 4Q = the year less the nine months).
//      · Segment Operating Income — the measure from 1Q26 (Form 8-K of Jan 12 2026: “Beginning in the first quarter of
//        2026, the Company plans to change its segment operating performance measure from Segment Adjusted EBITDA to
//        Segment Operating Income”). Recast for 1Q24–3Q25 in that 8-K; 4Q25 in the 4Q25 earnings release (Form 8-K,
//        Feb 4 2026); 1Q26 and 2Q26 in the Forms 10-Q. Unlike Adjusted EBITDA it is AFTER stock-based compensation and
//        depreciation (except amortization of acquired intangibles).
//    Every row ties: revenue − Platform Participant direct transaction costs − other = segment profit; the three
//    segments + Corporate G&A and Platform R&D = Adjusted EBITDA / Non-GAAP Operating Income.
//
// 4) UBER_SUMMIT — the Summit DCF model, FROZEN on purpose, not live (playbook rule 10, SAB Oct 15 2026): pulled once
//    from the Summit_Financial_Data MCP, snapshot 2026-08-05 (the latest UBER submit), sheet projection_history.
//    Metric names are the model’s. The model projects no GAAP operating income or GAAP net income (those rows are zero),
//    so there is no Summit line for them.
//
// 5) UBER_EW_LINES / UBER_SEG_DIVES — quotes are verbatim: Form 10-K FY2025 (filed Feb 13 2026), Item 7 MD&A
//    (“Components of Results of Operations” and the year-over-year comparison) and Note 13; Form 10-Q 2Q26 (filed
//    Aug 5 2026), MD&A; call remarks from docs/calls/UBER.md and UBER-latest.md (transcripts Q3 2024 – Q1 2026).
//    Every amount, share of revenue and margin effect is computed in uber-bl.js — never typed here.
//
// BEGIN GENERATED (scratch builder, SEC EDGAR XBRL companyfacts, CIK 0001543151, pulled 2026-11-03)
export var UBER_OPEX_YEARS=[2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var UBER_OPEX={
  2019:{"revenue": 13000, "cor": 6061, "opsSupport": 2302, "marketing": 4626, "rnd": 4836, "gAdmin": 3299, "da": 472, "oi": -8596, "sbc": 4596},
  2020:{"revenue": 11139, "cor": 5154, "opsSupport": 1819, "marketing": 3583, "rnd": 2205, "gAdmin": 2666, "da": 575, "oi": -4863, "sbc": 827},
  2021:{"revenue": 17455, "cor": 9351, "opsSupport": 1877, "marketing": 4789, "rnd": 2054, "gAdmin": 2316, "da": 902, "oi": -3834, "sbc": 1168},
  2022:{"revenue": 31877, "cor": 19659, "opsSupport": 2413, "marketing": 4756, "rnd": 2798, "gAdmin": 3136, "da": 947, "oi": -1832, "sbc": 1793},
  2023:{"revenue": 37281, "cor": 22457, "opsSupport": 2689, "marketing": 4356, "rnd": 3164, "gAdmin": 2682, "da": 823, "oi": 1110, "sbc": 1935},
  2024:{"revenue": 43978, "cor": 26651, "opsSupport": 2732, "marketing": 4337, "rnd": 3109, "gAdmin": 3639, "da": 711, "oi": 2799, "sbc": 1796},
  2025:{"revenue": 52017, "cor": 31338, "opsSupport": 2854, "marketing": 4898, "rnd": 3402, "gAdmin": 3241, "da": 719, "oi": 5565, "sbc": 1826},
};
export var UBER_OPEXQ=[
  {"p": "1Q23", "yr": 2023, "q": "Q1", "revenue": 8823, "cor": 5259, "opsSupport": 640, "marketing": 1262, "rnd": 775, "gAdmin": 942, "da": 207, "oi": -262, "sbc": 470},
  {"p": "2Q23", "yr": 2023, "q": "Q2", "revenue": 9230, "cor": 5515, "opsSupport": 664, "marketing": 1218, "rnd": 808, "gAdmin": 491, "da": 208, "oi": 326, "sbc": 504},
  {"p": "3Q23", "yr": 2023, "q": "Q3", "revenue": 9292, "cor": 5626, "opsSupport": 683, "marketing": 941, "rnd": 797, "gAdmin": 646, "da": 205, "oi": 394, "sbc": 492},
  {"p": "4Q23", "yr": 2023, "q": "Q4", "revenue": 9936, "cor": 6057, "opsSupport": 702, "marketing": 935, "rnd": 784, "gAdmin": 603, "da": 203, "oi": 652, "sbc": 469},
  {"p": "1Q24", "yr": 2024, "q": "Q1", "revenue": 10131, "cor": 6168, "opsSupport": 685, "marketing": 917, "rnd": 790, "gAdmin": 1209, "da": 190, "oi": 172, "sbc": 484},
  {"p": "2Q24", "yr": 2024, "q": "Q2", "revenue": 10700, "cor": 6488, "opsSupport": 682, "marketing": 1115, "rnd": 760, "gAdmin": 686, "da": 173, "oi": 796, "sbc": 455},
  {"p": "3Q24", "yr": 2024, "q": "Q3", "revenue": 11188, "cor": 6761, "opsSupport": 687, "marketing": 1096, "rnd": 774, "gAdmin": 630, "da": 179, "oi": 1061, "sbc": 438},
  {"p": "4Q24", "yr": 2024, "q": "Q4", "revenue": 11959, "cor": 7234, "opsSupport": 678, "marketing": 1209, "rnd": 785, "gAdmin": 1114, "da": 169, "oi": 770, "sbc": 419},
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 11533, "cor": 6937, "opsSupport": 668, "marketing": 1057, "rnd": 815, "gAdmin": 657, "da": 171, "oi": 1228, "sbc": 435},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 12651, "cor": 7611, "opsSupport": 696, "marketing": 1210, "rnd": 840, "gAdmin": 669, "da": 175, "oi": 1450, "sbc": 475},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 13467, "cor": 8109, "opsSupport": 735, "marketing": 1277, "rnd": 862, "gAdmin": 1183, "da": 188, "oi": 1113, "sbc": 465},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 14366, "cor": 8681, "opsSupport": 755, "marketing": 1354, "rnd": 885, "gAdmin": 732, "da": 185, "oi": 1774, "sbc": 451},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 13203, "cor": 7258, "opsSupport": 763, "marketing": 1326, "rnd": 951, "gAdmin": 798, "da": 184, "oi": 1923, "sbc": 473},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 14191, "cor": 7815, "opsSupport": 805, "marketing": 1515, "rnd": 1043, "gAdmin": 935, "da": 188, "oi": 1890, "sbc": 556},
];
// END GENERATED
export var UBER_OPEX_SRC='Uber Forms 10-K (FY2019–FY2025) and 10-Q (1Q23–2Q26) via SEC EDGAR XBRL (CIK 0001543151)';

// The UK business-model change (Form 10-Q 1Q26, MD&A, verbatim) — it moves revenue AND cost of revenue, not profit.
export var UBER_UK_NOTE='Effective January 2, 2026, we implemented a business model change in certain UK markets, primarily driven by regulatory and tax considerations. As a result of this business model change, we are no longer responsible for the Mobility services in these markets, and accordingly, payments to drivers are recorded as a reduction of revenue instead of cost of revenue.';
// Revenue impact of that change, as reported: 1Q26 Form 10-Q ($1.0B) and 2Q26 Form 10-Q ($1.1B), US$ million.
export var UBER_UK_IMPACT={ '1Q26':1000, '2Q26':1100 };

// Stock-based compensation by function (US$ million) — Form 10-K FY2025 (2023–2025) and Form 10-K FY2024 (2022).
export var UBER_SBC_FN={
  2022:{ opsSupport:154, marketing:102, rnd:1060, gAdmin:477 },
  2023:{ opsSupport:184, marketing:96,  rnd:1215, gAdmin:440 },
  2024:{ opsSupport:218, marketing:91,  rnd:1104, gAdmin:383 },
  2025:{ opsSupport:225, marketing:103, rnd:1101, gAdmin:397 }
};
export var UBER_SBC_FN_SRC='Uber Form 10-K FY2025 (Note 10, stock-based compensation expense by function, 2023–2025) and Form 10-K FY2024 (2022)';

// Valuation-allowance releases inside the income-tax line (US$ million) — Form 10-K FY2025, MD&A, verbatim basis:
// “the release of $6.4 billion of our valuation allowance of certain U.S. federal and state deferred tax assets in the
// fourth quarter of 2024 compared to the release of $5.0 billion of our Netherlands valuation allowance during the year
// ended December 31, 2025.” Normalized net income takes them out (uber-bl.js).
export var UBER_VA_RELEASE={ 2024:6400, 2025:5000 };

// Non-GAAP Operating Income (US$ million) — Uber’s key profit measure from 1Q26. 1Q24–3Q25: Form 8-K Jan 12 2026
// (recast); 4Q25: 4Q25 earnings release; 1Q26–2Q26: segment notes of the Forms 10-Q (segments − Corporate G&A and
// Platform R&D). Not defined before 1Q24.
export var UBER_NGOI_Q=[
  { p:'1Q24', v:821 }, { p:'2Q24', v:1025 }, { p:'3Q24', v:1146 }, { p:'4Q24', v:1318 },
  { p:'1Q25', v:1326 }, { p:'2Q25', v:1534 }, { p:'3Q25', v:1675 }, { p:'4Q25', v:1918 },
  { p:'1Q26', v:1883 }, { p:'2Q26', v:2143 }
];

// Segment ADJUSTED EBITDA (retired after 4Q25), US$ million. mob · del · fr = Mobility · Delivery · Freight;
// corp = Corporate G&A and Platform R&D (not allocated). Quarterly: Forms 10-Q 2024–2025 (with prior-year comparatives);
// 4Q = the year less the nine months. Annual + cost split: Form 10-K FY2025, Note 13.
export var UBER_SEG_EBITDA_Q=[
  { p:'1Q23', mob:1060, del:288, fr:-23, corp:-564 }, { p:'2Q23', mob:1170, del:329, fr:-14, corp:-569 },
  { p:'3Q23', mob:1287, del:413, fr:-13, corp:-595 }, { p:'4Q23', mob:1446, del:476, fr:-14, corp:-625 },
  { p:'1Q24', mob:1479, del:528, fr:-21, corp:-604 }, { p:'2Q24', mob:1567, del:588, fr:-12, corp:-573 },
  { p:'3Q24', mob:1682, del:628, fr:-19, corp:-601 }, { p:'4Q24', mob:1769, del:727, fr:-22, corp:-632 },
  { p:'1Q25', mob:1753, del:763, fr:-7,  corp:-641 }, { p:'2Q25', mob:1905, del:873, fr:-6,  corp:-653 },
  { p:'3Q25', mob:2038, del:921, fr:-20, corp:-683 }, { p:'4Q25', mob:2203, del:1015, fr:0, corp:-731 }
];
// rev − pp (Platform Participant direct transaction costs) − other = oi (segment Adjusted EBITDA here).
export var UBER_SEG_EBITDA_Y={
  2023:{ mob:{rev:19832, pp:5130, other:9739,  oi:4963}, del:{rev:12204, pp:5329, other:5369, oi:1506}, fr:{rev:5245, pp:4714, other:595, oi:-64}, corp:-2353 },
  2024:{ mob:{rev:25087, pp:6884, other:11706, oi:6497}, del:{rev:13750, pp:5591, other:5688, oi:2471}, fr:{rev:5141, pp:4652, other:563, oi:-74}, corp:-2410 },
  2025:{ mob:{rev:29670, pp:8683, other:13088, oi:7899}, del:{rev:17248, pp:7097, other:6579, oi:3572}, fr:{rev:5099, pp:4583, other:549, oi:-33}, corp:-2708 }
};
// Segment OPERATING INCOME (the measure from 1Q26), US$ million, with the same cost split where the filing gives it
// (the 4Q25 release gives segment operating income only, so 4Q25 has no split).
export var UBER_SEG_SOI_Q=[
  { p:'1Q24', mob:{rev:5633, pp:1437, other:2886, oi:1310}, del:{rev:3214, pp:1342, other:1444, oi:428}, fr:{rev:1284, pp:1159, other:167, oi:-42}, corp:-875 },
  { p:'2Q24', mob:{rev:6134, pp:1682, other:3060, oi:1392}, del:{rev:3293, pp:1324, other:1455, oi:514}, fr:{rev:1273, pp:1146, other:160, oi:-33}, corp:-848 },
  { p:'3Q24', mob:{rev:6409, pp:1770, other:3125, oi:1514}, del:{rev:3470, pp:1389, other:1537, oi:544}, fr:{rev:1309, pp:1185, other:163, oi:-39}, corp:-873 },
  { p:'4Q24', mob:{rev:6911, pp:1995, other:3308, oi:1608}, del:{rev:3773, pp:1536, other:1598, oi:639}, fr:{rev:1275, pp:1162, other:154, oi:-41}, corp:-888 },
  { p:'1Q25', mob:{rev:6496, pp:1771, other:3138, oi:1587}, del:{rev:3777, pp:1506, other:1600, oi:671}, fr:{rev:1260, pp:1134, other:151, oi:-25}, corp:-907 },
  { p:'2Q25', mob:{rev:7288, pp:2058, other:3501, oi:1729}, del:{rev:4102, pp:1649, other:1687, oi:766}, fr:{rev:1261, pp:1133, other:154, oi:-26}, corp:-935 },
  { p:'3Q25', mob:{rev:7682, pp:2359, other:3459, oi:1864}, del:{rev:4477, pp:1874, other:1792, oi:811}, fr:{rev:1308, pp:1181, other:167, oi:-40}, corp:-960 },
  { p:'4Q25', mob:{rev:8204, pp:null, other:null, oi:2027}, del:{rev:4892, pp:null, other:null, oi:905}, fr:{rev:1270, pp:null, other:null, oi:-18}, corp:-996 },
  { p:'1Q26', mob:{rev:6798, pp:1260, other:3509, oi:2029}, del:{rev:5068, pp:2131, other:1976, oi:961}, fr:{rev:1337, pp:1215, other:152, oi:-30}, corp:-1077 },
  { p:'2Q26', mob:{rev:7363, pp:1362, other:3786, oi:2215}, del:{rev:5245, pp:2186, other:2004, oi:1055}, fr:{rev:1583, pp:1453, other:154, oi:-24}, corp:-1103 }
];
export var UBER_SEG_SRC='Uber Form 10-K FY2025 (Note 13, Segment Information) and Forms 10-Q 1Q24–2Q26 (segment note); Form 8-K of Jan 12 2026 (Segment Operating Income recast, 1Q24–3Q25); 4Q25 earnings release (Form 8-K, Feb 4 2026) · SEC EDGAR';
// The filings’ own words on the segment measures and the cost split, verbatim.
export var UBER_SEG_TXT={
  soi:'Segment Operating Income excludes non-cash items or items that management does not believe are reflective of our ongoing core operations.',
  soiChange:'Beginning in the first quarter of 2026, we changed our segment operating performance measure from Segment Adjusted EBITDA to Segment Operating Income.',
  codm:'The CODM does not evaluate operating segments using asset information and, accordingly, we do not report asset information by segment.',
  pp:'Platform Participant direct transaction costs primarily consist of (i) costs paid directly to Platform Earners on our platform recorded in cost of revenue, excluding depreciation and amortization; and (ii) incentives to end-users recorded in sales and marketing.',
  other:'Other primarily consists of non-Platform Participant costs, including: (i) trip insurance, payment card fees and bank fees, customer support and technology costs; (ii) other operating costs, primarily related to employee headcount costs (including stock-based compensation), external contractor expenses and brand marketing; (iii) costs related to bringing new Platform Earners and new Platform end-users to the Platform recorded in costs and expenses; and (iv) depreciation and amortization (excluding amortization of acquired intangible assets).',
  corp:'Includes costs that are not directly attributable to our reportable segments. Corporate G&A also includes certain shared costs such as finance, accounting, tax, human resources, information technology and legal costs. Platform R&D also includes mapping and payment technologies and support and development of the internal technology infrastructure. Our allocation methodology is periodically evaluated and may change.'
};

// ═══ Summit DCF model — FROZEN, snapshot 2026-08-05 (projection_history), US$ million; shares in millions ═══
export var UBER_SUMMIT={
  snapshot:'2026-08-05',
  years:[2026, 2027, 2028],
  rev:   [58066.7, 70356.4, 80391.4],     // REV
  gb:    [238407.5, 292414.8, 349250.3],  // MOBILITY_GB + DELIVERY_GB + FREIGHT_GB
  ngoi:  [9312.6, 11921.5, 15900.1],      // ADJ_OPINC (= the segments + CORP_GNA_ADJ_OPINC)
  ebitda:[11381.9, 15891.1, 18455.4],     // EBITDA (Adjusted EBITDA)
  fcf:   [11426.8, 13685.0, 16308.3],     // FCF
  adjNi: [7318.8, 9656.4, 13515.1],       // ADJ_NET_INCOME (the model’s non-GAAP earnings)
  shares:[2009.4, 1939.1, 1842.1],        // SHARES (diluted)
  seg:{ mob:{ rev:[30053.4, 34866.9, 43584.0], gb:[118194.5, 139469.5, 174336.9], soi:[9010.9, 10809.2, 13511.4] },
        del:{ rev:[22204.0, 28998.3, 30316.3], gb:[114417.3, 146454.2, 168422.3], soi:[4885.2, 6235.5, 7579.0] },
        fr: { rev:[5810.6, 6491.1, 6491.1],    gb:[5795.6, 6491.1, 6491.1],       soi:[-96.9, -97.0, -64.9] },
        corp:{ soi:[-4485.9, -5025.4, -5125.4] } }
};

export var UBER_EW_SRC='— Uber Form 10-K for FY2025, Item 7 (MD&amp;A), Components of Results of Operations · SEC EDGAR';

// One dive per line. Composition / driver rows are [icon (ignored), label, text].
export var UBER_EW_LINES=[
  { k:'cor', name:'Cost of revenue (exclusive of D&amp;A)',
    kpiExtra:['$851M','more insurance expense in FY2025, on a higher insurance rate per mile and more miles driven (10-K MD&amp;A)'],
    def:'Cost of revenue, exclusive of depreciation and amortization, primarily consists of costs incurred for certain Mobility and Delivery transactions where we are primarily responsible for Mobility and Delivery services and pay Drivers and Couriers for services, certain insurance costs related to our Mobility and Delivery offerings, costs incurred with Carriers for Uber Freight transportation services, credit card processing fees, bank fees, data center and networking expenses, mobile device and service costs, and amounts related to fare chargebacks and other credit card losses.',
    comp:[['','Driver, Courier and Carrier payments','What Uber pays the people doing the work where it is the principal (certain Mobility and Delivery markets, and most of Freight) — in agency markets the driver’s share never enters revenue.'],
          ['','Trip insurance','Commercial auto insurance on Mobility and Delivery trips, much of it written through Uber’s captive insurer (Miscellaneous ▸ Insurance).'],
          ['','Payments and infrastructure','Credit card processing and bank fees, data centers and networking, chargebacks.']],
    compNote:'The 10-K gives cost of revenue as one line, so the bridge draws one bar. Uber reports no gross profit: depreciation and amortization sit in their own line, so “revenue less cost of revenue” is not a gross margin.',
    unit:'<div class="ew-note">Uber does not disclose a dollar cost per trip. Management speaks to insurance cost per trip in percentage terms (see the commentary below).</div>',
    why:'<b>The line that moves with the business model, not only with volume.</b> Where Uber is the principal, the driver’s pay is a cost here; where it is the agent, it nets out of revenue. The 10-K on 2025: “Cost of revenue, exclusive of depreciation and amortization, increased $4.7 billion, or 18%, mainly due to a $1.6 billion increase in Driver payments and incentives that are recorded in cost of revenue, exclusive of depreciation and amortization, as a result of increased Mobility Gross Bookings in certain markets, a $1.6 billion increase in Courier payments and incentives that are recorded in cost of revenue, exclusive of depreciation and amortization, as a result of increased Delivery Gross Bookings in certain markets, and a $851 million increase in insurance expense primarily due to an increase in insurance rate per mile and miles driven in our Mobility business.”',
    drivers:[['','UK business-model change (from January 2026)','1Q26 10-Q: “'+'we are no longer responsible for the Mobility services in these markets, and accordingly, payments to drivers are recorded as a reduction of revenue instead of cost of revenue.” Revenue fell $1.0B in 1Q26 and $1.1B in 2Q26 from it; cost of revenue fell with it, so the share of revenue dropped without a change in profit.'],
             ['','Courier and Carrier payments','2Q26: “a $545 million increase in Courier payments and incentives, as a result of increased Delivery Gross Bookings in certain markets; a $320 million increase in Carrier payments and incentives, as a result of increased Freight Gross Bookings; and a $132 million increase in credit card processing costs … partially offset by a $808 million decrease in Driver payments and incentives, as a result of Mobility business model changes in the UK.” (10-Q)'],
             ['','Insurance','FY2025: insurance expense up $851M “primarily due to an increase in insurance rate per mile and miles driven in our Mobility business” (10-K). Management expects US insurance to turn into a source of leverage in 2026 (commentary below).']],
    calls:[{q:'Q3 2024', txt:'“So as we look forward to 2025, I’d say we expect the insurance cost to continue to increase, but at a pretty significantly modulated rate compared to what we’ve seen over the last two years.”', who:'Prashanth Mahendra-Rajah, CFO'},
           {q:'Q1 2026', txt:'“As we said at the end of last year, we expect to see hundreds of millions of dollars of savings in our insurance line this year, thanks to the great work our policy teams have done as well as the tech improvements we have implemented in the market.”', who:'Balaji Krishnamurthy, CFO'},
           {q:'Q1 2026', txt:'“All in all, it’s putting us in a place where this will be the first year since COVID where we expect to see good leverage on our insurance cost line for the U.S.”', who:'Balaji Krishnamurthy, CFO'}] },
  { k:'opsSupport', name:'Operations &amp; support',
    kpiExtra:['$138M','more employee headcount costs in FY2025, partly offset by $30M less external contractor expense (10-K MD&amp;A)'],
    def:'Operations and support expenses primarily consist of compensation expenses, including stock-based compensation, for employees that support operations in cities, including the general managers, Driver operations, platform user support representatives and community managers. Also included is the cost of customer support, Driver background checks and the allocation of certain corporate costs.',
    comp:[['','City operations','General managers, Driver operations and community managers in each market.'],
          ['','Support','Platform user support representatives, customer support and Driver background checks.']],
    unit:'<div class="ew-note">Uber does not disclose a support cost per trip or per user.</div>',
    why:'A people line that grows slower than the platform. The 10-K expects it “to vary from period to period on an absolute dollar basis, but decrease as a percentage of revenue as we become more efficient in supporting platform users.” On 2025: “Operations and support expenses increased $122 million, or 4%, primarily attributable to a $138 million increase in employee headcount costs, partially offset by a $30 million decrease in external contractor expenses.”',
    drivers:[['','Headcount','2Q26: “Operations and support expenses increased $109 million or 16% in the three months ended June 30, 2026, primarily attributable to a $80 million increase in employee compensation costs including stock-based compensation, and a $15 million increase in contractor and professional service costs.” (10-Q)']] },
  { k:'marketing', name:'Sales &amp; marketing',
    kpiExtra:['$1.6B','consumer discounts, promotions, credits and refunds in FY2025, from $1.4B in FY2024 (10-K MD&amp;A)'],
    def:'Sales and marketing expenses primarily consist of advertising costs, product marketing costs, consumer discounts, promotions, credits and refunds provided to end-users who are not customers, compensation costs, including stock-based compensation to sales and marketing employees, and the allocation of certain corporate costs. We expense advertising and other promotional expenditures as incurred.',
    comp:[['','Consumer incentives','Discounts, promotions, credits and refunds to end-users who are not Uber’s customers (where they are, incentives reduce revenue instead).'],
          ['','Advertising and brand','Indirect advertising and marketing, product marketing, and sales and marketing staff.']],
    unit:'<div class="ew-note">Uber does not disclose a cost per user acquired; management says it manages these investments to lifetime value against acquisition cost.</div>',
    why:'The growth-investment line. The 10-K on 2025: “Sales and marketing expenses increased $561 million, or 13%, primarily attributable to a $221 million increase in indirect advertising and marketing, a $207 million increase in consumer discounts, promotions, credits and refunds to $1.6 billion compared to $1.4 billion in the same period in 2024, and a $129 million increase in employee headcount costs.”',
    drivers:[['','Incentives and advertising','2Q26: “Sales and marketing expenses increased $305 million or 25% in the three months ended June 30, 2026, primarily attributable to a a $136 million increase in consumer discounts, promotions, credits and refunds and a $115 million increase in indirect advertising and marketing.” (10-Q, wording as filed)']],
    calls:[{q:'Q3 2025', txt:'“The math behind those investments in terms of the lifetime value versus the cost of a member acquisition continues to improve.”', who:'Dara Khosrowshahi, CEO'},
           {q:'Q4 2025', txt:'“So there’s a lot of runway here, and we feel pretty good about the investments we’re making, and we are being quite deliberate in measuring the LTV to CAC ratios over on that.”', who:'Balaji Krishnamurthy, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['$313M','more employee headcount costs in FY2025 — nearly all of the line’s $293M increase (10-K MD&amp;A)'],
    def:'Research and development expenses primarily consist of compensation costs, including stock-based compensation, for employees in engineering, design and product development. Expenses also include ongoing improvements to, and maintenance of, existing products and services, and allocation of certain corporate costs. We expense substantially all research and development expenses as incurred.',
    comp:[['','Engineering and product','Pay and stock of engineering, design and product-development staff.'],
          ['','Stock-based compensation','R&amp;D carries most of Uber’s SBC (the key figure above).']],
    unit:'<div class="ew-note">Uber does not disclose a cost per engineer or per product.</div>',
    why:'Where most of the stock-based compensation lands. The 10-K on 2025: “Research and development expenses increased $293 million, or 9%, primarily attributable to $313 million increase in employee headcount costs.”',
    drivers:[['','Compensation','2Q26: “Research and development expenses increased $203 million or 24% in the three months ended June 30, 2026, primarily attributable to a $189 million increase in employee compensation costs including stock-based compensation.” (10-Q)'],
             ['','AI tools against headcount','Management says it is trading AI-tool spend against headcount growth (commentary below).']],
    calls:[{q:'Q1 2026', txt:'“We’ve re-upped our investment here, and as Dara said, we are trading that off against incremental headcount growth, which we noted in the remarks as well.”', who:'Balaji Krishnamurthy, CFO'},
           {q:'Q1 2026', txt:'“If every person at this company can increase their throughput by 20%, 30%, 50%, 100%, I think leading headcount growth and leaning in on AI investment is gonna be well worth it.”', who:'Dara Khosrowshahi, CEO'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['$549M','less legal-related accruals and expenses in FY2025 (10-K MD&amp;A)'],
    def:'General and administrative expenses primarily consist of compensation costs, including stock-based compensation, for executive management and administrative employees, including finance and accounting, human resources, policy and communications, legal, and certain impairment charges, as well as allocation of certain corporate costs, occupancy, and general corporate insurance costs. General and administrative expenses also include certain legal-related accruals and expenses.',
    comp:[['','Legal and regulatory','Legal-related accruals — the swing item; the large worker-classification and non-income-tax reserves are excluded from Non-GAAP Operating Income.'],
          ['','Corporate functions','Executive, finance, HR, policy and legal staff; occupancy and corporate insurance.']],
    unit:'<div class="ew-note">Not a unit-cost line: it moves with legal accruals, not with volume.</div>',
    why:'The volatile line. The 10-K: “General and administrative expenses as a percentage of revenue may vary from period to period as a percentage of revenue due to the variability of legal and regulatory-related expenses.” On 2025: “General and administrative expenses decreased $398 million, or 11%, primarily attributable to a $549 million decrease in legal-related accruals and expenses, partially offset by a $65 million increase in employee headcount costs and a $47 million increase in other corporate expenses.”',
    drivers:[['','Legal accruals','2Q26: “General and administrative expenses increased $266 million or 40% in the three months ended June 30, 2026, primarily attributable to a $138 million increase in legal-related accruals and expenses, a $66 million increase in employee compensation costs including stock-based compensation and a $53 million increase in contractor and professional service costs.” (10-Q)']] },
  { k:'da', name:'Depreciation &amp; amortization',
    def:'Depreciation and amortization expenses primarily consist of depreciation on buildings, site improvements, computer and network equipment, software, leasehold improvements, furniture and fixtures, and amortization of intangible assets. Depreciation includes expenses associated with buildings, site improvements, computer and network equipment, and furniture, fixtures, as well as leasehold improvements. Amortization includes expenses associated with our capitalized internal-use software and acquired intangible assets.',
    comp:[['','Depreciation','Buildings, computer and network equipment, leasehold improvements.'],
          ['','Amortization','Capitalized internal-use software and acquired intangibles — only the acquired-intangibles part is excluded from Non-GAAP Operating Income.']],
    unit:'<div class="ew-note">An asset-light platform: D&amp;A is about 1–2% of revenue.</div>',
    why:'Small and flat. The 10-K on 2025: “The change in depreciation and amortization expenses was not material.” It matters for the measure change: Adjusted EBITDA excluded D&amp;A; Non-GAAP Operating Income and Segment Operating Income include it (except amortization of acquired intangibles).',
    calls:[{q:'Q3 2025', txt:'“It reflects that we, as a management team, understand that there are real costs that come from depreciation, from some of the software amortization, the stock-based comp, etc.”', who:'Prashanth Mahendra-Rajah, CFO'}] }
];

// One deep dive per segment. Definitions verbatim from the 10-K FY2025 Note 13; MD&A drivers verbatim from the 10-K
// FY2025 and the 2Q26 10-Q; calls from docs/calls. Every number in the key figures and the bars is computed in uber-bl.js.
export var UBER_SEG_DIVES=[
  { k:'mob', name:'Mobility',
    def:'Mobility products connect consumers with Drivers who provide rides in a variety of vehicles, such as cars, auto rickshaws, motorbikes, minibuses, or taxis. Mobility also includes activity related to our financial partnerships products and advertising.',
    business:'The ride business and most of the profit: in FY2025 Mobility earned more than two thirds of the three segments’ Adjusted EBITDA. Its revenue depends on where Uber is the principal or the agent, so the margin on Gross Bookings reads more cleanly than the margin on revenue.',
    moves:[
      ['Driver payments and incentives','The largest cost, inside Platform Participant direct transaction costs. FY2025: “a $1.6 billion increase in Driver payments and incentives recorded in Mobility Platform Participant direct transaction costs” (10-K MD&amp;A).'],
      ['Insurance','FY2025: “a $851 million increase in insurance expense primarily due to an increase in insurance rate per mile and miles driven” (10-K MD&amp;A), inside “other”.'],
      ['UK business-model change','2Q26: Mobility Segment Operating Income “increased primarily attributable to an increase in Mobility Gross Bookings and an $813 million decrease in Driver payments and incentives” — the UK change, which also took $1.1B out of revenue (10-Q).'],
      ['One $10 trip (illustrative)','Of a $10 fare, about $6.50 goes to the driver, $0.50 to commercial insurance and $3.00 is Uber’s revenue; of the $3.00, about $0.80 was Adjusted EBITDA. Illustrative — Summit deck, Dec 2024 (moved from the old Unit Economics panel).']
    ],
    calls:[
      {q:'Q4 2025', txt:'“But throughout the last year, we have held prices relatively consistent, and as we look forward, with the amount of insurance reform and product-driven hundreds of millions of cost savings that we are seeing, we are in a position where insurance is going from a deleveraging cost item to something that gives us leverage and that allows us to hold prices flat or better in certain markets.”', who:'Balaji Krishnamurthy, CFO'}
    ] },
  { k:'del', name:'Delivery',
    def:'Delivery offerings allow consumers to search for and discover local restaurants, order a meal, and either pick-up at the restaurant or have the meal delivered. In certain markets, Delivery provides offerings for grocery, alcohol, and convenience store delivery as well as select other goods. We refer to the grocery, alcohol, convenience and retail categories collectively as Grocery &amp; Retail. Delivery also includes advertising.',
    business:'Restaurants, Grocery &amp; Retail and advertising. A lower take than Mobility and a lower margin on Gross Bookings; the margin has been rising as advertising grows and volume scales.',
    moves:[
      ['Courier payments','FY2025: “a $1.6 billion increase in Courier payments and incentives recorded in Delivery Platform Participant direct transaction costs” (10-K MD&amp;A).'],
      ['Advertising','FY2025 Delivery revenue rose on Gross Bookings “and a $568 million increase in advertising revenue”; 2Q26 “a $182 million increase in advertising revenue” (10-K, 10-Q).'],
      ['Headcount','FY2025: “a $337 million increase in employee headcount costs” in Delivery other expense (10-K MD&amp;A).'],
      ['One order (illustrative)','On a typical order the food cost goes to the restaurant, about 20% to the courier and about 19% to Uber as commission and fees. Illustrative of the disclosed structure, not a reported per-order breakdown (moved from the old Unit Economics panel).']
    ],
    calls:[] },
  { k:'fr', name:'Freight',
    def:'Freight connects Carriers with Shippers on our platform, and gives Carriers upfront, transparent pricing and the ability to book a shipment. Freight also includes transportation management and other logistics services offerings.',
    business:'A digital freight brokerage reported gross: revenue is close to Gross Bookings and most of it is paid on to Carriers. It runs near breakeven at the segment level.',
    moves:[
      ['Freight cycle','FY2025: “Freight revenue decreased primarily attributable to a 1% decrease in Freight Gross Bookings due to lower revenue per load as a result of the challenging freight market cycle.” (10-K MD&amp;A)'],
      ['Carrier payments','2Q26: “Freight Segment Operating Loss decreased primarily attributable to a $322 million increase in Freight revenue, partially offset by an $320 million increase in Freight Carrier payments.” (10-Q, wording as filed)']
    ],
    calls:[] }
];
