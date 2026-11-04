// tpl-bl-data.js — reported data and filing text for Texas Pacific Land (NYSE: TPL) Deep Dive ▸ Bottom Line
// (General BL-GEN-1…5 and Segments BL-SEG), read by ./tpl-bl.js. docs/PROFILE_PLAYBOOK.md §13.
//
// Rule 10: there is NO Summit DCF model for TPL, so this file carries no Summit block and the views draw no Summit
// series. Forward figures in the views are Bloomberg consensus (Consensus_Portal.xlsm CONSENSUS sheet, read through
// ../results-data/tpl.js estMatrix and ./tpl-bbg.js), never typed here.
//
// 1) The income-statement expense lines (US$ million, to the thousand), between the BEGIN/END markers — GENERATED, not
//    typed, by a scratch builder from SEC EDGAR XBRL companyfacts (CIK 0001811074, pulled 2026-11-04), checked against
//    the statements of income in the filings named in each row’s comment (the accession whose figures were taken):
//      · TPL presents its expenses BY NATURE, not by function: there is no cost of revenue, no gross profit, no R&D or
//        S&M line. The five lines are the FY2025 Form 10-K’s: salaries and related employee expenses (LaborAndRelated-
//        Expense) · water service-related expenses (WaterProductionCosts) · general and administrative expenses ·
//        depreciation, depletion and amortization · ad valorem and other taxes (TaxesExcludingIncomeAndExciseTaxes).
//      · Current presentation throughout. The FY2024 Form 10-K folded “Legal and professional fees” (and the small
//        “Land sales expenses” line of the older filings) into general and administrative expenses, so gAdmin = total
//        operating expenses − the other four lines in every period. `legal` keeps the legal and professional fees
//        where a filing still showed them apart (FY2018–FY2023, 1Q22–3Q24) — a memo INSIDE gAdmin, never added again.
//      · Ad valorem and other taxes are not a separate line before FY2021 (adval:null; they sit inside gAdmin — and
//        until 2022 third parties paid the ad valorem taxes on the historical royalty interests, 10-K FY2025 Note 14).
//      · FY2018–FY2020 are the Texas Pacific Land Trust’s figures as restated in TPL Corporation’s Forms 10-K.
//      · a Q4 is the fiscal year minus the nine-month year-to-date.
//      · tie-out run at generation: revenue − the five lines = operating income (OperatingIncomeLoss) in every year
//        FY2018–FY2025 and every quarter 1Q22–2Q26, to the US$ thousand; operating income − interest expense + other
//        income, net = income before income taxes; that − income tax = net income.
//      · sbc = total share-based compensation (AllocatedShareBasedCompensationExpense; employee awards in salaries,
//        director awards in G&A — TPL_SBC_FN). oth = other income, net (mostly interest on cash, TPL_OTHINC).
//
// 2) TPL_SBC_FN, TPL_OTHINC, TPL_DILSH, TPL_SEG_Y, TPL_SEG_Q — typed from the filing tables named in each block.
// 3) TPL_EW_LINES / TPL_SEG_DIVES — quotes are VERBATIM from the Forms 10-K and 10-Q named in each text. TPL earnings-
//    call transcripts are not on file in docs/calls, so there is no Management commentary (never paraphrased as a quote).
//    Every amount, share of revenue and margin effect is computed in tpl-bl.js — never typed here.
//
// BEGIN GENERATED (scratch builder, SEC EDGAR XBRL companyfacts, CIK 0001811074, pulled 2026-11-04)
export var TPL_OPEX_YEARS=[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var TPL_OPEX={
  2018:{revenue:300.22, sal:18.433, water:11.168, gAdmin:7.202, da:2.583, adval:null, oi:260.834, legal:2.498, sbc:null, intx:0, oth:0.916, pretax:261.75, tax:52.014, ni:209.736},   // 0001811074-21-000013
  2019:{revenue:490.496, sal:35.041, water:20.808, gAdmin:26.168, da:8.906, adval:null, oi:399.573, legal:16.403, sbc:0, intx:0, oth:2.682, pretax:402.255, tax:83.527, ni:318.728},   // 0001811074-22-000014
  2020:{revenue:302.564, sal:32.173, water:14.233, gAdmin:24.502, da:14.395, adval:null, oi:217.261, legal:10.778, sbc:0, intx:0, oth:2.401, pretax:219.662, tax:43.613, ni:176.049},   // 0001811074-23-000014
  2021:{revenue:450.958, sal:40.012, water:13.233, gAdmin:18.919, da:16.257, adval:0.144, oi:362.393, legal:7.281, sbc:0.028, intx:0, oth:0.624, pretax:363.017, tax:93.037, ni:269.98},   // 0001811074-24-000015
  2022:{revenue:667.422, sal:41.402, water:17.463, gAdmin:22.02, da:15.376, adval:8.854, oi:562.307, legal:8.735, sbc:8.432, intx:0, oth:6.548, pretax:568.855, tax:122.493, ni:446.362},   // 0001811074-25-000044
  2023:{revenue:631.595, sal:43.384, water:33.566, gAdmin:46.45, da:14.757, adval:7.385, oi:486.053, legal:31.522, sbc:10.343, intx:0, oth:31.508, pretax:517.561, tax:111.916, ni:405.645},   // 0001811074-26-000018
  2024:{revenue:705.823, sal:53.621, water:46.124, gAdmin:34.483, da:25.162, adval:7.295, oi:539.138, legal:null, sbc:12.498, intx:0, oth:39.683, pretax:578.821, tax:124.861, ni:453.96},   // 0001811074-26-000018
  2025:{revenue:798.19, sal:57.925, water:53.528, gAdmin:23.78, da:62.533, adval:8.263, oi:592.161, legal:null, sbc:15.131, intx:0.69, oth:18.858, pretax:610.329, tax:128.953, ni:481.376},   // 0001811074-26-000018
};
export var TPL_OPEXQ=[
  {p:'1Q22', yr:2022, q:'Q1', revenue:147.335, sal:9.385, water:2.782, gAdmin:4.686, da:4.126, adval:2.043, oi:124.313, legal:1.719, sbc:1.505, intx:0, oth:0.076, tax:26.489, ni:97.9},   // 0001811074-23-000025
  {p:'2Q22', yr:2022, q:'Q2', revenue:176.27, sal:9.588, water:3.915, gAdmin:4.837, da:4.18, adval:2.042, oi:151.708, legal:1.163, sbc:1.99, intx:0, oth:0.63, tax:33.444, ni:118.894},   // 0001811074-23-000041
  {p:'3Q22', yr:2022, q:'Q3', revenue:191.111, sal:10.697, water:6.348, gAdmin:5.226, da:3.917, adval:2.868, oi:162.055, legal:2.106, sbc:2.121, intx:0, oth:1.92, tax:34.138, ni:129.837},   // 0001811074-23-000053
  {p:'4Q22', yr:2022, q:'Q4', revenue:152.706, sal:11.732, water:4.418, gAdmin:7.271, da:3.153, adval:1.901, oi:124.231, legal:3.747, sbc:2.816, intx:0, oth:3.922, tax:28.422, ni:99.731},   // 0001811074-25-000044 less 0001811074-23-000053
  {p:'1Q23', yr:2023, q:'Q1', revenue:146.362, sal:10.593, water:5.656, gAdmin:20.183, da:3.404, adval:1.574, oi:104.952, legal:16.628, sbc:2.473, intx:0, oth:5.389, tax:23.773, ni:86.568},   // 0001811074-24-000031
  {p:'2Q23', yr:2023, q:'Q2', revenue:160.609, sal:10.596, water:10.287, gAdmin:13.483, da:3.893, adval:2.07, oi:120.28, legal:10.154, sbc:2.85, intx:0, oth:6.871, tax:26.758, ni:100.393},   // 0001811074-24-000049
  {p:'3Q23', yr:2023, q:'Q3', revenue:157.967, sal:11.499, water:8.553, gAdmin:5.592, da:3.584, adval:1.781, oi:126.958, legal:1.689, sbc:2.789, intx:0, oth:7.979, tax:29.363, ni:105.574},   // 0001811074-24-000061
  {p:'4Q23', yr:2023, q:'Q4', revenue:166.657, sal:10.696, water:9.07, gAdmin:7.192, da:3.876, adval:1.96, oi:133.863, legal:3.051, sbc:2.231, intx:0, oth:11.269, tax:32.022, ni:113.11},   // 0001811074-26-000018 less 0001811074-24-000061
  {p:'1Q24', yr:2024, q:'Q1', revenue:174.142, sal:12.461, water:10.212, gAdmin:9.231, da:3.84, adval:2.357, oi:136.041, legal:4.057, sbc:3.354, intx:0, oth:9.943, tax:31.567, ni:114.417},   // 0001811074-25-000060
  {p:'2Q24', yr:2024, q:'Q2', revenue:172.334, sal:12.771, water:14.824, gAdmin:5.98, da:4.093, adval:1.444, oi:133.222, legal:2.307, sbc:2.7, intx:0, oth:13.22, tax:31.853, ni:114.589},   // 0001811074-25-000077
  {p:'3Q24', yr:2024, q:'Q3', revenue:173.563, sal:14.03, water:11.731, gAdmin:12.52, da:5.762, adval:2.189, oi:127.331, legal:8.316, sbc:2.935, intx:0, oth:8.086, tax:28.823, ni:106.594},   // 0001811074-25-000096
  {p:'4Q24', yr:2024, q:'Q4', revenue:185.784, sal:14.359, water:9.357, gAdmin:6.752, da:11.467, adval:1.305, oi:142.544, legal:null, sbc:3.509, intx:0, oth:8.434, tax:32.618, ni:118.36},   // 0001811074-26-000018 less 0001811074-25-000096
  {p:'1Q25', yr:2025, q:'Q1', revenue:195.983, sal:14.572, water:11.126, gAdmin:6.072, da:11.941, adval:2.199, oi:150.073, legal:null, sbc:4.397, intx:0, oth:4.321, tax:33.742, ni:120.652},   // 0001811074-26-000035
  {p:'2Q25', yr:2025, q:'Q2', revenue:187.543, sal:14.072, water:8.451, gAdmin:5.693, da:13.699, adval:1.877, oi:143.751, legal:null, sbc:3.485, intx:0, oth:5.24, tax:32.851, ni:116.14},   // 0001811074-26-000058
  {p:'3Q25', yr:2025, q:'Q3', revenue:203.085, sal:14.387, water:16.428, gAdmin:5.591, da:14.963, adval:2.625, oi:149.091, legal:null, sbc:3.493, intx:0, oth:6.088, tax:33.941, ni:121.238},   // 0001811074-25-000096
  {p:'4Q25', yr:2025, q:'Q4', revenue:211.579, sal:14.894, water:17.523, gAdmin:6.424, da:21.93, adval:1.562, oi:149.246, legal:null, sbc:3.756, intx:0.69, oth:3.209, tax:28.419, ni:123.346},   // 0001811074-26-000018 less 0001811074-25-000096
  {p:'1Q26', yr:2026, q:'Q1', revenue:236.818, sal:14.987, water:14.287, gAdmin:8.631, da:14.043, adval:2.542, oi:182.328, legal:null, sbc:5.063, intx:0.992, oth:2.228, tax:40.662, ni:142.902},   // 0001811074-26-000035
  {p:'2Q26', yr:2026, q:'Q2', revenue:246.059, sal:15.562, water:11.57, gAdmin:8.004, da:16.639, adval:2.467, oi:191.817, legal:null, sbc:4.388, intx:0.973, oth:2.854, tax:39.768, ni:153.93},   // 0001811074-26-000058
  {p:'3Q26', yr:2026, q:'Q3', revenue:273.39, sal:17.167, water:13.817, gAdmin:10.6, da:22.833, adval:1.19, oi:207.783, legal:null, sbc:null, intx:0.981, oth:3.59, tax:43.024, ni:167.368},   // 0001811074-26-000075 (3Q26 release, Nov 4 2026; sbc null until read from the 10-Q cash-flow statement)
];
// END GENERATED
export var TPL_OPEX_SRC='TPL Forms 10-K (FY2020 acc. 0001811074-21-000013 for FY2018; FY2021 0001811074-22-000014; FY2022 0001811074-23-000014; FY2023 0001811074-24-000015; FY2024 0001811074-25-000044; FY2025 0001811074-26-000018) and Forms 10-Q 1Q22–2Q26 (latest: 2Q26, acc. 0001811074-26-000058), via SEC EDGAR XBRL (CIK 0001811074)';

// Share-based compensation by line item (US$ million) — Form 10-K FY2025 Note 10 (2023–2025) and Form 10-K FY2023
// (2021–2022): employee awards sit in salaries and related employee expenses, director awards in G&A.
export var TPL_SBC_FN={
  2021:{ sal:0.028, gAdmin:0 },
  2022:{ sal:7.583, gAdmin:0.849 },
  2023:{ sal:9.124, gAdmin:1.219 },
  2024:{ sal:11.364, gAdmin:1.134 },
  2025:{ sal:13.817, gAdmin:1.314 }
};
export var TPL_SBC_FN_SRC='Form 10-K FY2025, Note 10 (share-based compensation expense by line item, 2023–2025) and Form 10-K FY2023 (2021–2022)';

// Other income, net (US$ million) — Form 10-K FY2025 Note 11 (2023–2025), FY2024 (2022), FY2023 (2021).
// int = interest earned on cash and cash equivalents, net · pen = other employee pension costs (a credit) · gain = 2024
// pension curtailment gain ($3.864M) + realized gain on pension settlement ($0.752M) · misc = miscellaneous other income
// (expense), net (2023: $1.4M arbitration interest and damages; 2024: $1.9M title-company settlement).
export var TPL_OTHINC={
  2021:{ int:0.078, pen:0.113, gain:0, misc:0.433 },
  2022:{ int:6.207, pen:0.363, gain:0, misc:-0.022 },
  2023:{ int:28.63, pen:0.514, gain:0, misc:2.364 },
  2024:{ int:32.14, pen:0.575, gain:4.616, misc:2.352 },
  2025:{ int:17.97, pen:0.873, gain:0, misc:0.015 }
};

// Weighted-average diluted shares (millions), split-adjusted to today’s count (3-for-1 in March 2024 and Dec 22, 2025):
// FY2023–FY2025 as restated in the FY2025 10-K; FY2022 (FY2024 10-K) × 3; FY2018–FY2021 (FY2020–FY2023 10-Ks) × 9.
export var TPL_DILSH={ 2018:70.087, 2019:69.808, 2020:69.805, 2021:69.768, 2022:69.541, 2023:69.180, 2024:69.059, 2025:69.027 };

// Segment results (US$ million) — Note 16, Business Segment Reporting: Form 10-K FY2025 (2023–2025) and Form 10-K FY2024
// (2022); the quarters from the Form 10-Q 2Q26 segment note (three months ended June 30, 2026 and 2025). Every expense
// line is disclosed by segment; nothing is left unallocated (LRM + WSO = consolidated).
export var TPL_SEG_Y={
  2022:{ lrm:{rev:506.975, sal:22.054, water:0, gAdmin:14.978, da:2.234, adval:8.848, oi:458.861, intx:0, oth:6.491, tax:100.311, ni:365.041},
         wso:{rev:160.447, sal:19.348, water:17.463, gAdmin:7.042, da:13.142, adval:0.006, oi:103.446, intx:0, oth:0.057, tax:22.182, ni:81.321} },
  2023:{ lrm:{rev:432.105, sal:21.945, water:0, gAdmin:39.078, da:3.073, adval:7.382, oi:360.627, intx:0, oth:30.384, tax:84.305, ni:306.706},
         wso:{rev:199.49, sal:21.439, water:33.566, gAdmin:7.372, da:11.684, adval:0.003, oi:125.426, intx:0, oth:1.124, tax:27.611, ni:98.939} },
  2024:{ lrm:{rev:440.793, sal:27.493, water:0, gAdmin:25.531, da:10.968, adval:7.257, oi:369.544, intx:0, oth:31.707, tax:86.35, ni:314.901},
         wso:{rev:265.03, sal:26.128, water:46.124, gAdmin:8.952, da:14.194, adval:0.038, oi:169.594, intx:0, oth:7.976, tax:38.511, ni:139.059} },
  2025:{ lrm:{rev:490.726, sal:29.184, water:0, gAdmin:14.358, da:44.555, adval:8.218, oi:394.411, intx:0.552, oth:14.926, tax:86.37, ni:322.415},
         wso:{rev:307.464, sal:28.741, water:53.528, gAdmin:9.422, da:17.978, adval:0.045, oi:197.75, intx:0.138, oth:3.932, tax:42.583, ni:158.961} }
};
export var TPL_SEG_Q=[
  { p:'2Q25', lrm:{rev:128.497, sal:7.025, water:0, gAdmin:3.648, da:9.137, adval:1.864, oi:106.823, intx:0, oth:4.156, tax:24.41, ni:86.569},
              wso:{rev:59.046, sal:7.047, water:8.451, gAdmin:2.045, da:4.562, adval:0.013, oi:36.928, intx:0, oth:1.084, tax:8.441, ni:29.571} },
  { p:'2Q26', lrm:{rev:163.867, sal:8.347, water:0, gAdmin:5.245, da:11.695, adval:2.279, oi:136.301, intx:0.779, oth:2.14, tax:28.23, ni:109.432},
              wso:{rev:82.192, sal:7.215, water:11.57, gAdmin:2.759, da:4.944, adval:0.188, oi:55.516, intx:0.194, oth:0.714, tax:11.538, ni:44.498} }
];
export var TPL_SEG_SRC='TPL Form 10-K FY2025 (Note 16, Business Segment Reporting, acc. 0001811074-26-000018), Form 10-K FY2024 (Note 16, acc. 0001811074-25-000044), Form 10-Q 2Q26 (segment note, acc. 0001811074-26-000058) and the earnings releases (Form 8-K Ex. 99.1) through the Results dataset · SEC EDGAR';
// The filings’ own words on the segments, verbatim (Form 10-K FY2025, Note 2 and Note 16).
export var TPL_SEG_TXT={
  codm:'The measure of profit or loss that the CODM uses to assess performance and allocated resources to our reportable segments is Net Income. Our chief executive officer is the CODM and uses Net Income to evaluate income generated by each segment in his determination of allocating resources to each segment.',
  elim:'We eliminate inter-segment revenues and expenses, if any, upon consolidation. There were no inter-segment revenues for the years ended December 31, 2025, 2024, and 2023.',
  intinc:'Interest income by segment is included in other income, net in the table above.'
};

export var TPL_EW_SRC='TPL Form 10-K for FY2025 (filed Feb 18, 2026, acc. 0001811074-26-000018)';

// One dive per expense line, in the 10-K’s order. Composition / driver rows are [icon (ignored), label, text]; every
// quoted passage is verbatim, with its document named after it.
export var TPL_EW_LINES=[
  { k:'sal', name:'Salaries and related employee expenses',
    def:'Salaries and related employee expenses, which include not only salaries, equity and non-equity incentive compensation, but also employee benefits and contract labor expense, were $29.2 million for the year ended December 31, 2025 compared to $27.5 million for the same period of 2024.',
    defSrc:'Item 7 (MD&amp;A), Land and Resource Management',
    comp:[['','Pay, incentives and benefits','Salaries, equity and non-equity incentive compensation, employee benefits and contract labor — split about evenly between the two segments (Note 16).'],
          ['','Employee share awards','“Share-based compensation is reported on the consolidated statements of income and total comprehensive income as a component of salaries and related employee expenses for employee awards and in general and administrative expenses for director awards.” (10-K FY2025, Note 2)']],
    unit:'<div class="ew-note">TPL does not disclose a cost per employee or per barrel; the line is a people cost, not a unit cost.</div>',
    why:'A people cost on a high-margin revenue base: it grows with pay adjustments and headcount, not with royalty volumes. The 10-K on the LRM side in 2025: “The increase in salaries and related employee expenses was principally related to market compensation adjustments that take effect annually at the start of a given year.”',
    drivers:[['','Contract labor for water software','WSO, 2025: “The increase in salaries and related employee expenses is principally related to increased contract labor costs associated with development of an in-house water management application and market compensation adjustments that take effect annually at the start of the year.” (10-K FY2025)'],
             ['','Headcount','LRM, 2Q26: “The increase in salaries and related employee expenses was principally related to market compensation adjustments that take effect annually at the start of a given year and an increase in company headcount compared to the same period of 2025.” (10-Q 2Q26)']] },
  { k:'water', name:'Water service-related expenses',
    def:'Certain types of water service-related expenses, including, but not limited to, treatment, transfer, water purchases, repairs and maintenance, equipment rental, and fuel costs vary from period to period as our customers’ needs and requirements change. Right of way and other expenses also vary from period to period depending on the location of customer delivery.',
    defSrc:'Item 7 (MD&amp;A), Water Services and Operations',
    comp:[['','Delivering water','Treatment, transfer, water purchases, repairs and maintenance, equipment rental and fuel — the costs of sourcing and moving the water TPL sells.'],
          ['','Right of way and other','Varies with where the customer takes delivery.'],
          ['','Desalination R&amp;D','“Research and development expenses related to development of a new energy-efficient method of produced water desalination and treatment were $2.8 million and $2.5 million for the years ended December 31, 2025 and 2024, respectively.” (10-K FY2025)']],
    compNote:'TPL reports no cost of revenue and no gross profit. This is the closest it has to a direct cost of a revenue stream — it belongs to Water Services and Operations only (Note 16) — and the bridge does not relabel it.',
    unit:'<div class="ew-note">TPL does not disclose a dollar cost per barrel of water sold; it gives volumes (thousand barrels per day) and revenue, not unit cost.</div>',
    why:'The one line that moves with volume. 2025: “The increase in water service-related expenses for the year ended December 31, 2025 was principally related to increased water sales volumes compared to the same period of 2024.” (10-K FY2025)',
    drivers:[['','Water sales volumes','2Q26: “The increase in water service-related expenses for the three months ended June 30, 2026 compared to the same period of 2025 was principally related to a 37.5% increase in water sales volumes.” (10-Q 2Q26)']] },
  { k:'gAdmin', name:'General and administrative expenses',
    def:'General and administrative expenses were $14.4 million for the year ended December 31, 2025 compared to $25.5 million for the same period of 2024. The decrease was primarily due to a decrease in legal and professional fees of $11.9 million over the same period of 2024.',
    defSrc:'Item 7 (MD&amp;A), Land and Resource Management',
    comp:[['','Legal and professional fees','Shown as their own line through the FY2023 10-K and the 3Q24 10-Q; folded into general and administrative expenses from the FY2024 10-K (and restated back). The memo amounts are in the key figures.'],
          ['','Office, technology, board','Rent and office-related costs, technology applications, corporate insurance and director fees and awards.']],
    unit:'<div class="ew-note">Not a unit-cost line: it moves with legal matters and corporate costs, not with volume.</div>',
    why:'The swing line. In 2023 the legal costs of the stockholder matters drove it up: “Legal and professional fees were $31.5 million for the year ended December 31, 2023 compared to $8.7 million for the comparable period of 2022. The increase is principally related to legal expenses associated with stockholder matters.” (10-K FY2023)',
    drivers:[['','Stockholder matters fade','2024: “The decrease in general and administrative expenses during the year ended December 31, 2024 compared to the same period of 2023 was principally related to a reduction in legal and professional fees associated with stockholder matters that occurred during 2023.” (10-K FY2024)'],
             ['','Rent and office','LRM, 1H26: “The increase was principally related to increases in rent and office-related expenses of $1.1 million and legal and professional fees of $1.0 million over the same time period.” (10-Q 2Q26)']] },
  { k:'da', name:'Depreciation, depletion and amortization',
    def:'Capitalized costs for proved oil and gas royalty interests are depleted on a unit-of-production basis over total PDP reserves. … We account for depreciation of property, plant and equipment on the straight-line method over the estimated useful lives of the assets. … Intangible assets are amortized on a straight-line basis over their estimated useful lives ranging from 13 to 20 years.',
    defSrc:'Note 2, Summary of Significant Accounting Policies',
    comp:[['','Depletion','Of the royalty interests TPL has bought — not of the 1888 land: “no allowance has been made for depletion and no cost has been deducted from the proceeds of sales of the Assigned land and royalty interests.” (10-K FY2025, Note 2)'],
          ['','Depreciation','Water infrastructure (sourcing and treatment) and other property, plant and equipment, mostly in Water Services and Operations.'],
          ['','Amortization','Intangible assets: “Amortization of intangible assets was $2.3 million, $1.5 million, and $0.4 million for the years ended December 31, 2025, 2024, and 2023, respectively.” (10-K FY2025, Note 7)']],
    unit:'<div class="ew-note">TPL discloses depletion in dollars (Note 4) but no depletion rate per Boe.</div>',
    why:'The line acquisitions created. “Depletion expense was $42.7 million, $9.8 million, and $2.0 million for the years ended December 31, 2025, 2024, and 2023, respectively.” (10-K FY2025, Note 4) The royalties TPL inherited carry no book value, so they are not depleted; only purchased interests are.',
    drivers:[['','Royalty acquisitions','LRM, 2025: “The increase was principally due to depletion expense associated with royalty interests acquired during the second half of both 2025 and 2024.” (10-K FY2025)'],
             ['','New water assets','WSO, 2025: “The increase was principally due to depreciation expense related to new water service-related assets placed in service.” (10-K FY2025)']] },
  { k:'adval', name:'Ad valorem and other taxes',
    def:'Prior to January 1, 2022, ad valorem taxes with respect to our historical royalty interests were paid directly by third parties pursuant to an existing arrangement. After the completion of our Corporate Reorganization, we received notice from a third party that it no longer intended to pay the ad valorem taxes related to such historical royalty interests. In order to protect the historical royalty interests from any potential tax liens for non-payment of ad valorem taxes, we have accrued and/or paid such ad valorem taxes since January 1, 2022.',
    defSrc:'Note 14, Commitments and Contingencies',
    comp:[['','Property taxes on royalty interests','Almost all in Land and Resource Management (Note 16).'],
          ['','Reimbursement sought','“While we intend to seek reimbursement from the third party for such taxes, we are unable to estimate the amount and/or likelihood of such reimbursement, and accordingly, no loss recovery receivable has been recorded as of December 31, 2025.” (10-K FY2025, Note 14)']],
    unit:'<div class="ew-note">Not presented as its own line before FY2021; FY2018–FY2020 carry it inside general and administrative expenses, so the bars start in FY2021.</div>',
    why:'A step-change in 2022, then stable: the cost appeared when the third party stopped paying the taxes on the historical royalty interests, and it has stayed near 1% of revenue since.' }
];

// One deep dive per segment. Definitions verbatim from the 10-K FY2025 Note 16; drivers verbatim from the 10-K FY2025
// MD&A. Every number in the key figures, the bars and the cost table is computed in tpl-bl.js.
export var TPL_SEG_DIVES=[
  { k:'lrm', name:'Land and Resource Management',
    def:'The Land and Resource Management segment encompasses the business of managing our approximately 882,000 surface acres of land and our approximately 224,000 NRA of oil and gas royalty interests, principally concentrated in the Permian Basin. The revenue streams of this segment consist primarily of royalties from oil and gas, revenues from easements and commercial leases, and land and material sales.',
    business:'Royalties on oil, gas and NGL from operators on TPL’s acreage, plus easements and land sales. TPL pays none of the drilling cost, so the segment’s expenses are people, G&amp;A, ad valorem taxes and — since the 2024–2025 royalty purchases — depletion.',
    moves:[
      ['Volumes and prices','2025: “Oil and gas royalty revenue was $411.7 million for the year ended December 31, 2025 compared to $373.3 million for the year ended December 31, 2024, an increase of 10.3%. Our share of production volumes increased to 34.6 thousand Boe per day for the year ended December 31, 2025 compared to 26.8 thousand Boe per day for 2024. The average realized prices decreased to $34.18 per Boe for the year ended December 31, 2025 from $39.87 per Boe for 2024, a decrease of 14.3%.” (10-K FY2025)'],
      ['Depletion','2025: “The increase was principally due to depletion expense associated with royalty interests acquired during the second half of both 2025 and 2024.” (10-K FY2025)'],
      ['Legal and professional fees','2025: “The decrease was primarily due to a decrease in legal and professional fees of $11.9 million over the same period of 2024.” (10-K FY2025)']
    ] },
  { k:'wso', name:'Water Services and Operations',
    def:'The Water Services and Operations segment encompasses the business of providing a full-service water offering to operators in the Permian Basin. The revenue streams of this segment primarily consist of revenue generated from sales of sourced and treated water as well as revenue from produced water royalties.',
    business:'Sourced and treated water sold to operators, plus royalties on produced water moved across or disposed of on TPL’s land. The segment carries TPL’s only volume-driven cost line (water service-related expenses) and most of its capital spending.',
    moves:[
      ['Water sales','2025: “The growth in water sales was principally due to increases of 8.8% in water sales pricing and 3.4% in volumes for the year ended December 31, 2025 compared to the year ended December 31, 2024.” (10-K FY2025)'],
      ['Produced water royalties','2025: “This increase was principally due to a 24.6% increase in produced water volumes for the year ended December 31, 2025 compared to 2024.” (10-K FY2025)'],
      ['Water service-related expenses','2025: “The increase in water service-related expenses for the year ended December 31, 2025 was principally related to increased water sales volumes compared to the same period of 2024.” (10-K FY2025)'],
      ['Depreciation','2025: “The increase was principally due to depreciation expense related to new water service-related assets placed in service.” (10-K FY2025)']
    ] }
];
