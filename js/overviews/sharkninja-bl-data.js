// overviews/sharkninja-bl-data.js — SharkNinja Bottom Line ▸ General data, in Amazon's exact shape.
//
// Feeds the SN port of amzn.js Bottom Line ▸ General: aMarginsBody/aBuildMargins (snBBG.is),
// aBridgeBody/aBuildBridge (SN_OPEX / SN_OPEXQ / snBBG.is forward), aNetBridgeBody/aBuildNetBridge
// (snBBG.is oi/netInterest/otherNonOp/tax/pretax/netIncome), aSbcBody/aBuildSbc (snBBG.is sbc,
// dilShares, sbc* by line) and expenseTabsBody (SN_EW_LINES / SN_EXP_DEFS).
//
// SOURCES (authority order) — frozen Sep 2026, nothing is fetched at runtime:
//  1. js/results-data/sn.js — every series it carries (rev, grossProfit, opIncome, ebitdaGaap,
//     ebitdaAdj, niGaap, niAdj, sm, ga, rd) is copied value-for-value so Bottom Line cannot disagree
//     with Results. ONE deliberate exception: 3Q23 revenue is GAAP net sales $1,070.62M (10-Q /
//     Bloomberg SALES_REV_TURN), not the $1,057.42M in sn.js (that figure is Bloomberg IS_COMP_SALES,
//     i.e. ADJUSTED net sales for that one quarter). GAAP gross profit ($487.49M) and operating income
//     ($94.55M) only reconcile against GAAP revenue, so the bridge needs it. Every other actual
//     quarter/year is identical in both Bloomberg rows.
//  2. Bloomberg company-financials export FA_SN_US_0fels5uk.xlsx (G:\My Drive\Summit\Docs\Research\
//     DCF\Consumer - PV\SN, Sep 2026 snapshot, Estimate Source BST) — cost of revenue, interest expense
//     (income) net, other non-operating (income) expense, income tax, SBC (cash-flow add-back), diluted
//     weighted shares, free cash flow; actuals and BST consensus. Values rounded to $0.01M.
//  3. SEC filings (CIK 0001957132): FY2025 Form 10-K (acc. 0001957132-26-000015), FY2024 and FY2023
//     Forms 20-F, Form F-1 (Jun 28, 2023) for FY2020-FY2021, Forms 10-Q 1Q26/2Q26 — functional lines
//     FY2020-21, SBC by line item, the MD&A line definitions and the drivers quoted below.
//  4. js/themes-data/sn.js — the verbatim earnings-call quotes used in `calls`.
//
// !! Bloomberg SWAPS R&D and G&A for FY2020 and FY2021 (it shows R&D 183.29 / 180.12 and G&A
// 159.64 / 200.64). The F-1 income statement has R&D $159,635K / $200,641K and G&A $183,286K /
// $180,124K, and the F-1 MD&A ties it ("R&D increased by $41.0 million, or 25.7%" in 2021). SN_OPEX
// uses the filing.

// ── Annual functional P&L ($M) ─────────────────────────────────────────────────────────────────
// SharkNinja reports exactly three operating-expense lines ("Our operating expenses consist of
// research and development, sales and marketing and general and administrative expenses." — 10-K
// MD&A). There is NO other-operating-expense line on its income statement, so `otherOpex` is the
// residual revenue − cost of sales − R&D − S&M − G&A − GAAP operating income and contains nothing but
// the rounding of five lines to $0.01M (|otherOpex| <= 0.01). With it, every row reconciles to GAAP
// operating income (sn.js opIncome for FY2022-25; F-1 for FY2020-21) exactly.
// FY2020-21: F-1 (revenue 2,753.17 / 3,726.99; operating income 465.44 / 438.26).
export var SN_OPEX_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
export var SN_OPEX = {
  2020:{ revenue:2753.17, costOfSales:1499.72, rd:159.63, marketing:445.08, gAdmin:183.29, otherOpex:0.01 },
  2021:{ revenue:3726.99, costOfSales:2288.81, rd:200.64, marketing:619.16, gAdmin:180.12, otherOpex:0 },
  2022:{ revenue:3717.37, costOfSales:2307.17, rd:215.66, marketing:621.95, gAdmin:251.21, otherOpex:0.01 },
  2023:{ revenue:4253.71, costOfSales:2345.86, rd:249.39, marketing:897.59, gAdmin:387.32, otherOpex:-0.01 },
  2024:{ revenue:5528.64, costOfSales:2866.65, rd:341.29, marketing:1243.14, gAdmin:433.39, otherOpex:0.01 },
  2025:{ revenue:6399.19, costOfSales:3262.7, rd:368.07, marketing:1458.03, gAdmin:390.11, otherOpex:0 }
};
// FY2022 revenue is the filed $3,717,366K (sn.js carries 3717.4 from an aggregator; same number,
// one fewer decimal).

// ── Quarterly functional P&L ($M), reported quarters only, oldest → newest ──────────────────────
// Same residual rule; reconciles to sn.js quarterly opIncome exactly. 3Q23 revenue = GAAP (see top).
export var SN_OPEXQ = [
  { p:"Q3 '23", yr:2023, q:'Q3', revenue:1070.62, costOfSales:583.12, rd:60.69, marketing:207.6, gAdmin:124.66, otherOpex:0 },
  { p:"Q4 '23", yr:2023, q:'Q4', revenue:1377.5, costOfSales:754.6, rd:68.96, marketing:329.55, gAdmin:123.63, otherOpex:0.01 },
  { p:"Q1 '24", yr:2024, q:'Q1', revenue:1066.23, costOfSales:539.61, rd:69.6, marketing:214.57, gAdmin:87.51, otherOpex:0 },
  { p:"Q2 '24", yr:2024, q:'Q2', revenue:1248.66, costOfSales:647.76, rd:90.05, marketing:303.19, gAdmin:103.83, otherOpex:-0.01 },
  { p:"Q3 '24", yr:2024, q:'Q3', revenue:1426.57, costOfSales:731.56, rd:94.81, marketing:300.84, gAdmin:119.1, otherOpex:0 },
  { p:"Q4 '24", yr:2024, q:'Q4', revenue:1787.19, costOfSales:947.72, rd:86.83, marketing:424.55, gAdmin:122.96, otherOpex:0.01 },
  { p:"Q1 '25", yr:2025, q:'Q1', revenue:1222.64, costOfSales:619.41, rd:87.6, marketing:275.74, gAdmin:94.94, otherOpex:0 },
  { p:"Q2 '25", yr:2025, q:'Q2', revenue:1444.88, costOfSales:736.71, rd:89.41, marketing:357.72, gAdmin:92.39, otherOpex:0 },
  { p:"Q3 '25", yr:2025, q:'Q3', revenue:1630.24, costOfSales:812.77, rd:92.83, marketing:365.92, gAdmin:95.83, otherOpex:0 },
  { p:"Q4 '25", yr:2025, q:'Q4', revenue:2101.43, costOfSales:1093.81, rd:98.23, marketing:458.65, gAdmin:106.94, otherOpex:0 },
  { p:"Q1 '26", yr:2026, q:'Q1', revenue:1412.81, costOfSales:717.84, rd:98.88, marketing:315.34, gAdmin:116.22, otherOpex:0 },
  { p:"Q2 '26", yr:2026, q:'Q2', revenue:1765.48, costOfSales:905.14, rd:109.33, marketing:441.51, gAdmin:130.11, otherOpex:0.01 }
];

// ── Bloomberg-shaped income statement (like amzn-bbg.js amznBBG) ──────────────────────────────
// $M; dilShares in millions. a = FY23-25 actual, f = FY26E-28E BST consensus, q = 3Q23..4Q26
// (12 reported quarters then 3Q26E, 4Q26E consensus), qA = the 12 reported quarters only.
// Sign conventions copied from amznBBG:
//   netInterest — positive = net interest EXPENSE (Bloomberg IS_NET_INTEREST_EXPENSE; SN has been a
//                 net payer every period: term-loan interest > interest earned on cash).
//   otherNonOp  — positive = expense/loss, negative = GAIN (Bloomberg "Other Non-Operating (Income)
//                 Expense" = the 10-K "Other income (expense), net" with the sign flipped).
//   tax         — positive = expense.
//   pretax      — oi − netInterest − otherNonOp, on the stored values. Ties to the filed "Income before
//                 income taxes" within $0.01M in every actual period (FY23 293.23, FY24 572.47,
//                 FY25 900.28 filed). Bloomberg's own "Pre-Tax Income" row is IS_COMP_PTP_EX_STK_
//                 BASED_COMP — an ADJUSTED, ex-SBC figure (FY25 966.88) — so it is NOT used.
//                 Forward: the same formula on consensus lines. Consensus is not internally consistent
//                 (different contributors per line), so forward pretax − tax ≠ consensus net income:
//                 net − (pretax − tax) = +14.7 / +34.2 / −27.5 for FY26E-28E and −52.2 / +19.9 for
//                 3Q26E / 4Q26E ($M). aBuildNetBridge draws that as its reconciling "plug" step.
// Consensus rows that do not tie to each other (flagged, not forced):
//   cogs.f / cogs.q forward are Bloomberg's "Cost of Revenue" consensus; rev − cogs ≠ grossProfit
//   consensus (FY26E 3,781.4 vs 3,833.7). aFwdOpexRow prefers cogs when present — with it the FY26E
//   "other" residual is 21.6; deriving cogs = rev − grossProfit instead gives 74.0. Lead's call.
//   rev.f / rev.q forward are IS_COMP_SALES consensus (= sn.js cons), which Bloomberg's
//   SALES_REV_TURN consensus puts slightly lower (FY26E 7,478.7).
export var snBBG = {
  asOf: 'Sep 2026',
  yearsA: [2023, 2024, 2025], yearsF: [2026, 2027, 2028],
  qtrs: ['3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26E','4Q26E'],
  is: {
    rev: { a:[4253.71, 5528.64, 6399.19], f:[7483.62, 8478.23, 9413.5], q:[1070.62, 1377.5, 1066.23, 1248.66, 1426.57, 1787.19, 1222.64, 1444.88, 1630.24, 2101.43, 1412.81, 1765.48, 1867.36, 2463.55], qA:[1070.62, 1377.5, 1066.23, 1248.66, 1426.57, 1787.19, 1222.64, 1444.88, 1630.24, 2101.43, 1412.81, 1765.48] },
    cogs: { a:[2345.86, 2866.65, 3262.7], f:[3702.19, 4298.3, 4740.82], q:[583.12, 754.6, 539.61, 647.76, 731.56, 947.72, 619.41, 736.71, 812.77, 1093.81, 717.84, 905.14, 815.19, 1258.86], qA:[583.12, 754.6, 539.61, 647.76, 731.56, 947.72, 619.41, 736.71, 812.77, 1093.81, 717.84, 905.14] },
    grossProfit: { a:[1907.85, 2661.99, 3136.49], f:[3833.74, 4156.92, 4655.83], q:[487.49, 622.89, 526.62, 600.9, 695.01, 839.47, 603.23, 708.17, 817.47, 1007.63, 694.97, 860.34, 1073.42, 1182.91], qA:[487.49, 622.89, 526.62, 600.9, 695.01, 839.47, 603.23, 708.17, 817.47, 1007.63, 694.97, 860.34] },
    oi: { a:[373.56, 644.16, 920.28], f:[1155.26, 1305.94, 1565.77], q:[94.55, 100.75, 154.94, 103.84, 180.26, 205.12, 144.95, 168.65, 262.89, 343.8, 164.53, 179.38, 419.18, 409.26], qA:[94.55, 100.75, 154.94, 103.84, 180.26, 205.12, 144.95, 168.65, 262.89, 343.8, 164.53, 179.38] },
    ebitda: { a:[441.96, 759.29, 1088.51], f:[1314.67, 1511.22, 1708.59], q:[114.28, 133.07, 186.01, 133.75, 221.12, 218.41, 190.11, 229.72, 290.45, 378.23, 192.64, 211.57, 393.66, 471.02], qA:[114.28, 133.07, 186.01, 133.75, 221.12, 218.41, 190.11, 229.72, 290.45, 378.23, 192.64, 211.57] },
    ebitdaAdj: { a:[719.7, 951.11, 1135.52], f:[1360.73, 1568.45, 1747.67], q:[208.74, 219.33, 230.53, 167.67, 262.36, 290.55, 200.36, 223.36, 316.53, 395.26, 235.36, 264.89, 394.1, 478.8], qA:[208.74, 219.33, 230.53, 167.67, 262.36, 290.55, 200.36, 223.36, 316.53, 395.26, 235.36, 264.89] },
    netIncome: { a:[167.08, 438.7, 701.37], f:[880.7, 1010.1, 1170.17], q:[18.72, 49.32, 109.61, 68.05, 132.33, 128.72, 117.83, 139.6, 188.73, 255.21, 121.46, 129.82, 273, 326], qA:[18.72, 49.32, 109.61, 68.05, 132.33, 128.72, 117.83, 139.6, 188.73, 255.21, 121.46, 129.82] },
    netIncomeAdj: { a:[449.26, 616.24, 749.57], f:[937.46, 1086.67, 1226.5], q:[132.98, 132.11, 148.56, 99.63, 170.46, 197.59, 123.78, 137.84, 213.42, 274.54, 154.8, 178.25, 265.2, 342.4], qA:[132.98, 132.11, 148.56, 99.63, 170.46, 197.59, 123.78, 137.84, 213.42, 274.54, 154.8, 178.25] },
    // Bloomberg HEADLINE_FCF (CFO − capex). FY24/FY25 tie to the 10-K (CFO 446.62 − capex 137.69; 634.13 − 146.08).
    fcf: { a:[157.86, 308.93, 488.05], f:[711.72, 829.32, 913.21], q:[-128.83, 132.58, 20.31, -94.04, -64.55, 447.21, -87.52, -36.51, 86.17, 525.91, -190.2, 382.64, 154, 407.16], qA:[-128.83, 132.58, 20.31, -94.04, -64.55, 447.21, -87.52, -36.51, 86.17, 525.91, -190.2, 382.64] },
    netInterest: { a:[44.91, 63.72, 48.6], f:[33.82, 31.75, 27.52], q:[13, 16.39, 14.72, 14.84, 16.92, 17.23, 12.63, 13.77, 12.78, 9.42, 6.61, 7.89, 9.04, 8.94], qA:[13, 16.39, 14.72, 14.84, 16.92, 17.23, 12.63, 13.77, 12.78, 9.42, 6.61, 7.89] },
    // FY27E/FY28E and 3Q26E/4Q26E are Bloomberg consensus ZEROS (contributors model no other income), not missing data.
    otherNonOp: { a:[35.43, 7.98, -28.6], f:[13.58, 0, 0], q:[5.87, -5.89, -3.25, -0.69, -11.03, 22.95, -13.22, -26, 6.12, 4.51, 10.34, 7.8, 0, 0], qA:[5.87, -5.89, -3.25, -0.69, -11.03, 22.95, -13.22, -26, 6.12, 4.51, 10.34, 7.8] },
    pretax: { a:[293.22, 572.46, 900.28], f:[1107.86, 1274.19, 1538.25], q:[75.68, 90.25, 143.47, 89.69, 174.37, 164.94, 145.54, 180.88, 243.99, 329.87, 147.58, 163.69, 410.14, 400.32], qA:[75.68, 90.25, 143.47, 89.69, 174.37, 164.94, 145.54, 180.88, 243.99, 329.87, 147.58, 163.69] },
    tax: { a:[126.15, 133.76, 198.9], f:[241.9, 298.32, 340.61], q:[56.96, 40.93, 33.86, 21.63, 42.05, 36.23, 27.7, 41.29, 55.26, 74.66, 26.12, 33.88, 84.98, 94.2], qA:[56.96, 40.93, 33.86, 21.63, 42.05, 36.23, 27.7, 41.29, 55.26, 74.66, 26.12, 33.88] },
    // Cash-flow SBC add-back; equals the SBC footnote total every year (FY23 46,966K / FY24 84,531K / FY25 43,872K).
    sbc: { a:[46.97, 84.53, 43.87], f:[106.54, 104.79, 91.5], q:[21.34, 22.46, 19.43, 14.13, 13.79, 37.19, 11.55, 10.93, 9.12, 12.27, 30.31, 47.21, 22.8, 27.38], qA:[21.34, 22.46, 19.43, 14.13, 13.79, 37.19, 11.55, 10.93, 9.12, 12.27, 30.31, 47.21] },
    // Diluted weighted-average shares (M). FY25 142,089,766 per the 10-K.
    dilShares: { a:[139.42, 141.08, 142.09], f:[142.06, 142.59, 142.34], q:[139.43, 140.28, 140.7, 140.92, 141.31, 141.52, 142.18, 141.87, 142.12, 142.13, 142.36, 141.51, 141.97, 142.61], qA:[139.43, 140.28, 140.7, 140.92, 141.31, 141.52, 142.18, 141.87, 142.12, 142.13, 142.36, 141.51] },
    sm: { a:[897.59, 1243.14, 1458.03], f:[1715.09, 1879.4, 2054.68], q:[207.6, 329.55, 214.57, 303.19, 300.84, 424.55, 275.74, 357.72, 365.92, 458.65, 315.34, 441.51, 445.25, 529.73], qA:[207.6, 329.55, 214.57, 303.19, 300.84, 424.55, 275.74, 357.72, 365.92, 458.65, 315.34, 441.51] },
    ga: { a:[387.32, 433.39, 390.11], f:[475.51, 475.88, 508.33], q:[124.66, 123.63, 87.51, 103.83, 119.1, 122.96, 94.94, 92.39, 95.83, 106.94, 116.22, 130.11, 119.73, 118.43], qA:[124.66, 123.63, 87.51, 103.83, 119.1, 122.96, 94.94, 92.39, 95.83, 106.94, 116.22, 130.11] },
    rd: { a:[249.39, 341.29, 368.07], f:[413.93, 450.65, 484.04], q:[60.69, 68.96, 69.6, 90.05, 94.81, 86.83, 87.6, 89.41, 92.83, 98.23, 98.88, 109.33, 105.48, 107.78], qA:[60.69, 68.96, 69.6, 90.05, 94.81, 86.83, 87.6, 89.41, 92.83, 98.23, 98.88, 109.33] },
    // SBC by line item — the SBC note (FY2025 10-K; FY2024 20-F for FY23). Annual actuals only: `q` omitted
    // (by-line quarterly splits exist only in the 10-Qs for 1Q25/2Q25/1Q26/2Q26, not a continuous series),
    // and `f` all-null because no consensus is published by line.
    // sbcCogs is a DISCLOSED zero, not a gap: the note allocates SBC only to R&D, S&M and G&A, and those
    // three sum to total SBC every year — none sits in cost of sales.
    sbcCogs: { a:[0, 0, 0], f:[null, null, null] },
    sbcRD: { a:[7.7, 10.41, 11.73], f:[null, null, null] },
    sbcSM: { a:[4.93, 13.58, 14.69], f:[null, null, null] },
    sbcGA: { a:[34.34, 60.54, 17.45], f:[null, null, null] }
  }
};

// ── Expense explorer — one entry per SN line, same shape as amzn.js EW_LINES ───────────────────
// traj = % of revenue per SN_EW_LABS year (FY2020-FY2025, filed figures). `def` is VERBATIM from the
// FY2025 10-K MD&A ("Components of Our Results of Operations"). `calls` are verbatim fragments only,
// from js/themes-data/sn.js (each was string-matched to its transcript there); the words outside the
// quotation marks in that file are the desk's, and none of them are used here.
// NOTE for the port: amzn ewBase calls ewSpark(c.traj, 7) — SN has six points, so the highlighted
// index is 5; and otherOpex.traj is all zeros, so ewSpark's max-scaling divides by zero (guard it or
// skip the spark for that line).
export var SN_EW_LABS = ['’20','’21','’22','’23','’24','’25'];
export var SN_EW_LINES = [
  { k:'costOfSales', name:'Cost of sales',
    kpis:[['$3.3B','of revenue: 51.0%'],['+0.9 ppt','to operating margin (YoY)'],['$0M','stock-based comp inside (none allocated)']],
    def:'Cost of sales primarily consists of the purchase cost of our products from third-party manufacturers, inbound freight costs, tariffs, product quality testing and inspection costs, the costs associated with receiving inventory into our warehouses, depreciation on molds and tooling that we own, warranty costs, damages, obsolescence and shrinkage costs and allocated overhead, including the service fee paid to JS Global for supply chain services.',
    comp:[
      ['🏭','Product cost','What SharkNinja pays its third-party manufacturers. It owns no factories, so this is the bulk of the line.'],
      ['🚢','Freight &amp; tariffs','Inbound freight and import duties. Tariffs sit here, which is why every tariff round shows up first in gross margin.'],
      ['🛠️','Quality, warranty &amp; tooling','Testing and inspection, warranty, damages, obsolescence and shrinkage, and depreciation on the molds and tooling SharkNinja owns.'],
      ['🔗','JS Global sourcing fee','The transitional supply-chain service fee paid to the former parent. The agreement <b>ended July 31, 2025</b>.']
    ],
    compNote:'The largest line, and the one that moved most: <b>62.1%</b> of net sales in FY2022, <b>51.0%</b> in FY2025. No stock-based compensation is allocated here.',
    fwd:'Street consensus gross margin implies cost of sales at <b>48.8%</b> of FY26E net sales, then <b>51.0%</b> in FY27E and <b>50.5%</b> in FY28E. The FY26E dip is consistent with the <b>$247.1M</b> of IEEPA duty refund claims CBP accepted in July 2026 (about 3.3% of FY26E sales), which the company recognizes when realized; the reported first half ran <b>51.1%</b> vs 50.8% a year earlier, as tariffs annualized.',
    traj:[54.5, 61.4, 62.1, 55.1, 51.9, 51.0],
    why:'<b>The margin lever.</b> Eleven points of net sales came out of this line between FY2022 and FY2025 — more than every other line combined moved the other way. In FY2025 it added <b>+0.9 ppt</b> to the operating margin.',
    drivers:[
      ['⚙️','Cost optimization','The 10-K names cost optimization first for FY2025; the calls describe supplier diversification, competitive bidding and value engineering behind the FY2023-24 expansion.'],
      ['🔗','The JS Global fee rolling off','A decline in the contractual sourcing service fee paid to JS Global, which ended July 31, 2025 (10-K).'],
      ['🧾','Tariffs, the offset','The 10-K says the gain was partially offset by the impact of tariffs; by Q1 2026 a full quarter of tariff cost was in the P&amp;L.'],
      ['🛒','Channel &amp; category mix','Per the 10-K, DTC sales usually carry a higher gross margin than sales to retailers and distributors, and category mix moves the line too.']
    ],
    extra:'<div class="ew-h">From 62% to 51% of net sales</div>'+
      '<div class="ew-flow"><div class="ew-fn"><div class="ew-fn-v">62.1%</div><div class="ew-fn-l">cost of sales, FY22</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">55.1%</div><div class="ew-fn-l">FY23</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">51.9%</div><div class="ew-fn-l">FY24</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">51.0%</div><div class="ew-fn-l">FY25</div></div></div>'+
      '<div class="ew-q">The increase in gross margin was primarily driven by cost optimization efforts, as well as a decline in the amounts owed under a contractual sourcing service fee paid to JS Global for supply chain services that ended July 31, 2025, partially offset by the impact of tariffs.<span class="ew-att">— SharkNinja FY2025 Form 10-K · MD&amp;A</span></div>',
    calls:[
      { q:'Q3 2025', txt:'&ldquo;roughly one-third of the year-over-year expansion came from true outperformance, while two-thirds was the result of favorability related to the timing of tariffs flowing through the financials.&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q4 2025', txt:'&ldquo;We did start to see the increased impact of tariffs on our domestic gross margins in Q4, partially offset by this mix benefit&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q1 2026', txt:'&ldquo;Tariffs presented a sizable headwind with a full quarter of impact in Q1 of 2026 compared to a baseline with minimal tariffs&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q2 2026', txt:'&ldquo;DTC, TikTok Shop, overall social commerce does come at a higher structural gross margin&hellip;&rdquo;', who:'Adam Quigley (CFO)' }
    ]
  },
  { k:'rd', name:'Research &amp; development',
    kpis:[['$368M','of revenue: 5.8%'],['+0.4 ppt','to operating margin (YoY)'],['$11.7M','stock-based comp inside']],
    def:'Research and development costs primarily consist of personnel-related costs for our engineering and product development personnel responsible for the design, development and testing of our products, contractors and consulting expenses, the cost of components and test equipment used for product, tooling and prototype development, prototype expenses, overhead costs and amortization of intangible assets related to patents and amortization expenses related to capitalized development software.',
    comp:[
      ['🧑‍🔬','Engineering &amp; design personnel','The people who design, develop and test the products — the largest component.'],
      ['🧪','Prototypes, components &amp; testing','Components, test equipment, tooling and prototype development.'],
      ['📑','Contractors &amp; consulting','Outside engineering and consulting — the piece management has been pulling in-house.'],
      ['🧩','Amortization','Patent intangibles ($3.7M a year of acquired-intangible amortization lands here) and capitalized development software.']
    ],
    compNote:'The steadiest line on the page: between <b>5.4% and 6.2%</b> of net sales every year since FY2020.',
    fwd:'Consensus holds R&amp;D roughly flat in dollars relative to growth: <b>5.5%</b> of FY26E net sales, <b>5.3%</b> FY27E, <b>5.1%</b> FY28E. The reported first half of 2026 ran 6.6% (same as a year earlier), with Q2 R&amp;D +22.3% on personnel.',
    traj:[5.8, 5.4, 5.8, 5.9, 6.2, 5.8],
    why:'A small line that barely moves the margin on its own (+0.4 ppt in FY2025), but it is the product-refresh engine the growth rate depends on — the risk is under-spending, not over-spending.',
    drivers:[
      ['👥','Headcount for new categories and markets','FY2025: +$38.8M personnel-related expenses "to support new product categories and market expansion" (10-K).'],
      ['🧪','Prototypes &amp; testing','+$4.4M in FY2025 on the same initiatives (10-K).'],
      ['↩️','Consulting brought in-house','Offsets: −$12.2M professional and consulting fees and −$3.3M consumer-insight initiatives in FY2025 (10-K).']
    ],
    extra:'',
    calls:[
      { q:'Q1 2024', txt:'&ldquo;a business that\'s investing, you know, over 6% of sales in R&amp;D, and over 9% of sales in marketing&rdquo;', who:'Mark Barrocas (CEO)' },
      { q:'Q3 2025', txt:'&ldquo;we strategically brought a portion of that talent in-house, allowing us to retain and develop our knowledge base while optimizing overall operating costs.&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q4 2025', txt:'&ldquo;We\'re on track to hire 100 new software engineers to help drive this AI ambition.&rdquo;', who:'Mark Barrocas (CEO)' }
    ]
  },
  { k:'marketing', name:'Sales &amp; marketing',
    kpis:[['$1.46B','of revenue: 22.8%'],['−0.3 ppt','to operating margin (YoY)'],['$14.7M','stock-based comp inside']],
    def:'Sales and marketing expenses primarily consist of advertising, marketing and other brand-building costs, salaries and associated expenses for sales and marketing teams, shipping and fulfillment costs, including costs for third-party delivery services and shipping materials, overhead costs, amortization expenses of intangible assets related to customer relationships and depreciation expenses.',
    comp:[
      ['📣','Advertising &amp; brand-building','Digital, social-media and other advertising — per the 10-K, the most significant component of operating expenses overall.'],
      ['🚚','Shipping &amp; fulfillment','Third-party delivery and shipping materials — the cost of the direct-to-consumer channel lands here, not in cost of sales.'],
      ['🧑‍💼','Sales &amp; marketing teams','Salaries and associated expenses.'],
      ['🧩','Amortization &amp; depreciation','Customer-relationship intangibles ($15.9M a year of acquired-intangible amortization) and depreciation.']
    ],
    compNote:'The second-largest line, and the one that absorbed the gross-margin gain: <b>16.7%</b> of net sales in FY2022, <b>22.8%</b> in FY2025.',
    fwd:'Consensus has S&amp;M levering slowly: <b>22.9%</b> of FY26E net sales, <b>22.2%</b> FY27E, <b>21.8%</b> FY28E. The reported first half of 2026 ran 23.8% vs 23.7% — flat, not yet down — and management has said not to expect media leverage on a long-term basis.',
    traj:[16.2, 16.6, 16.7, 21.1, 22.5, 22.8],
    why:'The line that decides how much of the gross margin reaches operating income. It rose six points of net sales in three years as the company reinvested its gross-margin gain in demand; in FY2025 it still took <b>−0.3 ppt</b> off the operating margin.',
    drivers:[
      ['🚚','Delivery &amp; distribution','FY2025: +$66.1M "driven by higher volumes" (10-K); FY2024: +$113.7M, "particularly in our DTC business" (20-F).'],
      ['👥','Personnel for launches and new markets','+$64.5M in FY2025 (10-K).'],
      ['📣','Advertising','+$47.6M in FY2025, after +$176.1M in FY2024 and +$145.3M in FY2023 (10-K / 20-F).'],
      ['📑','Consulting, D&amp;A','+$16.5M professional and consulting fees and +$9.5M depreciation and amortization in FY2025 (10-K).']
    ],
    extra:'',
    calls:[
      { q:'Q3 2023', txt:'&ldquo;&hellip;fueling healthy top-line growth through media versus promotional activity.&rdquo;', who:'Larry Flynn (interim CFO)' },
      { q:'Q1 2025', txt:'&ldquo;We do need to get more efficient with our marketing and advertising spending.&rdquo;', who:'Mark Barrocas (CEO)' },
      { q:'Q4 2025', txt:'&ldquo;we have internally developed more sophisticated social media optimization tools. These help us more efficiently spend advertising dollars in social channels to drive strong ROI.&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q1 2026', txt:'&ldquo;I don\'t think, Steve, that we should think of it as that we\'re gonna get media leverage, you know, on a long-term basis.&rdquo;', who:'Mark Barrocas (CEO)' }
    ]
  },
  { k:'gAdmin', name:'General &amp; administrative',
    kpis:[['$390M','of revenue: 6.1%'],['+1.7 ppt','to operating margin (YoY)'],['$17.5M','stock-based comp inside']],
    def:'General and administrative expenses primarily consist of personnel-related costs for finance, legal, human resources, information technology and administrative functions, third-party professional service fees for external legal, accounting and other consulting services, depreciation expenses, overhead costs and expenses associated with operating as a public company, including expenses to comply with the rules and regulations of the SEC and the listing rules of NYSE, as well as expenses for corporate insurance, director and officer insurance, and investor relations.',
    comp:[
      ['🏢','Corporate personnel','Finance, legal, HR, IT and administration — including most of the company\'s stock-based compensation.'],
      ['⚖️','Legal &amp; professional fees','External legal, accounting and consulting; litigation costs are recorded here.'],
      ['💳','Technology &amp; merchant fees','Per the MD&amp;A, cloud-computing support costs and credit-card processing and merchant fees also moved this line.'],
      ['🏛️','Public-company costs','SEC/NYSE compliance, corporate and D&amp;O insurance, investor relations; separation and offering costs in FY2023.']
    ],
    compNote:'The line that actually produced the FY2025 operating-margin expansion, and the one carrying the one-offs: separation costs in FY2023, an SBC peak in FY2024.',
    fwd:'Consensus: <b>6.4%</b> of FY26E net sales, then <b>5.6%</b> FY27E and <b>5.4%</b> FY28E. FY26E is up because SBC is rising again — consensus SBC is <b>$106.5M</b> for FY26E vs $43.9M in FY2025, and Q2 2026 G&amp;A was +40.8% on a $22.6M increase in share-based compensation. Management\'s stated 2027 claim is to leverage compensation on roughly flat headcount.',
    traj:[6.7, 4.8, 6.8, 9.1, 7.8, 6.1],
    why:'Pure overhead, so it should lever — but on SharkNinja\'s scale the one-offs dominate. FY2025\'s <b>+1.7 ppt</b> to operating margin came mostly from SBC and litigation falling, which cannot repeat from here; ex-SBC, G&amp;A went from 6.7% to 5.8% of net sales.',
    drivers:[
      ['📉','Share-based compensation','FY2025: personnel costs −$36.8M, "including a $43.1 million decrease in share-based compensation" (10-K). Direction reversed in 2026.'],
      ['⚖️','Litigation','FY2025: legal fees −$32.3M, "including a decrease of $36.0 million in litigation-related costs" (10-K).'],
      ['💳','Merchant fees &amp; cloud','Offsets in FY2025: +$13.2M credit-card processing and merchant fees, +$12.3M cloud technology support, +$5.9M transaction-related costs (10-K).'],
      ['🔗','Separation (FY2023)','"an increase of $79.4 million of costs related to the separation and distribution from JS Global and secondary offering" (FY2024 20-F, on FY2023).']
    ],
    extra:'<div class="ew-h">Stock-based comp inside G&amp;A</div>'+
      '<div class="ew-flow"><div class="ew-fn"><div class="ew-fn-v">$3.3M</div><div class="ew-fn-l">FY22</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">$34.3M</div><div class="ew-fn-l">FY23</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">$60.5M</div><div class="ew-fn-l">FY24</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">$17.5M</div><div class="ew-fn-l">FY25</div></div></div>'+
      '<div class="ew-q">This increase was driven by an increase of $30.3 million in personnel-related expenses, primarily due to a $22.6 million increase in share-based compensation, as well as an increase of $5.1 million in professional and consulting fees.<span class="ew-att">— SharkNinja Form 10-Q, Q2 2026 · MD&amp;A, General and Administrative</span></div>',
    calls:[
      { q:'Q3 2023', txt:'&ldquo;primarily due to costs related to the spin-off from JS Global and stock compensation expense associated with new RSU grants.&rdquo;', who:'Larry Flynn (interim CFO)' },
      { q:'Q3 2025', txt:'&ldquo;The bulk of that increase relates to higher merchant fees in our direct-to-consumer business, driven by channel growth in EMEA.&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q4 2025', txt:'&ldquo;The bulk of the decrease this quarter relates to lower expenses on personnel, including stock-based compensation favorability year-over-year.&rdquo;', who:'Adam Quigley (CFO)' },
      { q:'Q1 2026', txt:'&ldquo;The bulk of this increase came from taxes related to share-based compensation.&rdquo;', who:'Adam Quigley (CFO)' }
    ]
  },
  { k:'otherOpex', name:'Other operating expense',
    kpis:[['$0M','of revenue: 0.0%'],['0.0 ppt','to operating margin (YoY)'],['—','no stock-based comp']],
    def:'Our operating expenses consist of research and development, sales and marketing and general and administrative expenses.',
    comp:[
      ['∅','No such line','SharkNinja\'s income statement has no other-operating-expense line. What is shown here is revenue − cost of sales − the three expense lines − GAAP operating income: the rounding of five lines to $0.01M, never more than $0.01M in any year or quarter.'],
      ['↘️','Where one-offs actually sit','Litigation, separation and transaction costs are inside G&amp;A; the Product Procurement Adjustment and the 2025 product recall are inside cost of sales; FX and the 2024 supplier-settlement gain are below operating income, in other income (expense), net.']
    ],
    compNote:'Kept only so the bridge has the same six slots as Amazon\'s. It is empty by construction.',
    fwd:'Nothing to forecast. Forward consensus lines do not sum to consensus operating income (FY26E gross profit − the three expense lines − operating income = $74.0M) — that is contributor mismatch in the consensus, not an expense line.',
    traj:[0, 0, 0, 0, 0, 0],
    why:'None — every one-off that moves SharkNinja\'s operating margin is inside one of the four real lines, which is where the other tabs call it out.',
    drivers:[
      ['⚖️','One-offs live elsewhere','FY2025 adjusted operating income adds back $0.8M litigation, $8.5M transaction costs, $18.7M Product Procurement Adjustment and $11.2M product recall — all recorded in G&amp;A or cost of sales (10-K).']
    ],
    extra:'',
    calls:[]
  }
];
export var SN_EW_SRC = '— SharkNinja FY2025 Form 10-K · MD&amp;A, Operating Expenses (SEC EDGAR)';
export var SN_EXP_DEFS = [
  { k:'costOfSales', n:'Cost of sales', tag:'$3.3B · 51.0%' },
  { k:'rd', n:'Research &amp; development', tag:'$368M · 5.8%' },
  { k:'marketing', n:'Sales &amp; marketing', tag:'$1.46B · 22.8%' },
  { k:'gAdmin', n:'General &amp; administrative', tag:'$390M · 6.1%' },
  { k:'otherOpex', n:'Other operating expense', tag:'$0M · 0.0%' }
];

// ── Net-income bridge note ─────────────────────────────────────────────────────────────────────
// Normalized (amzn logic, unchanged): remove the otherNonOp gain/loss AFTER TAX at the period's
// effective rate → FY23 $187.3M (reported 167.1), FY24 $444.8M (438.7), FY25 $679.1M (701.4).
export var SN_NB_NOTE = '<p>Between operating income and net income SharkNinja has only two lines. <b>Interest expense, net</b> is interest on its borrowings — mainly the term loan entered into on July 20, 2023, as part of the separation from JS Global ($739.1M outstanding at end-2025, maturing July 20, 2028) — net of interest earned on cash: $44.9M in FY2023, $63.7M in FY2024, $48.6M in FY2025, and falling in 2026 ($7.9M in Q2) as principal is repaid and cash builds. <b>Other income (expense), net</b> is, per the 10-K, "gains and losses on foreign currency transactions, foreign currency forward contracts and other income and expenses that are not part of our normal operating activities": a $35.4M loss in FY2023 (foreign-currency losses of $35.2M, including losses on forward contracts), an $8.0M loss in FY2024 (FX losses of $16.1M, partly offset by a $5.0M supplier-settlement gain), a $28.6M gain in FY2025 (FX gains of $36.1M), and a $7.8M loss in Q2 2026 (remeasurement of U.S.-dollar intercompany balances as sterling moved).</p>'+
  '<p><b>Normalized</b> removes that other-income line after tax at the period\'s effective rate, because it is FX noise rather than the business: FY2025 net income normalizes down to <b>$679.1M</b> from $701.4M reported, FY2024 up to $444.8M from $438.7M, FY2023 up to $187.3M from $167.1M. FY2023 needs care — its 43.0% effective rate carries separation withholding taxes and non-deductible transaction costs, so tax-effecting at that rate understates the add-back. The 2026 IEEPA tariff refunds ($247.1M of claims accepted by CBP in July 2026) are <b>not</b> below the line — they are duties previously expensed through cost of sales — so they flatter operating income, and this normalization does not touch them.</p>'+
  '<p>The company\'s own <b>Adjusted Net Income</b> goes much further: on top of FX it adds back share-based compensation, amortization of acquired intangibles ($19.6M a year), litigation costs, transaction-related costs ($82.3M in FY2023), shareholder-funded executive bonuses ($32.2M in FY2023), the Product Procurement Adjustment ($83.2M / $53.1M / $18.7M in FY2023-25), the FY2025 product recall ($11.2M), and the tax effect of all of it — $449.3M / $616.2M / $749.6M for FY2023-25, versus $187.3M / $444.8M / $679.1M normalized here. The gap is mostly SBC and separation costs, which this bridge treats as real. Forward years use Bloomberg consensus; consensus lines are not internally consistent, so pretax income less tax misses consensus net income by +$14.7M / +$34.2M / −$27.5M in FY26E-28E, shown as the reconciling step.</p>';

// ── SBC-dilution caption ────────────────────────────────────────────────────────────────────────
// No Summit DCF exists for SN, so there is no Summit diluted-share line (amzn's A_SUMMIT_SHARES has
// no SN counterpart) — the port should draw consensus only.
export var SN_SBC_NOTE = 'Diluted shares rose from <b>139.4M</b> (FY23) to <b>142.1M</b> (FY25) as RSUs vested; consensus holds them flat at ~142M through FY28E even with SBC stepping up to <b>$106.5M</b> in FY26E, i.e. the $750M buyback authorized Feb 11, 2026 is assumed to offset the dilution — 1.0M shares bought for $119.7M in 1H26, and Q2 2026 diluted shares fell to 141.5M from 142.4M in Q1.';

export var SN_BL_DATA_SOURCES = 'Income-statement series are the same Bloomberg (BST) company-financials export as the Results tab (FA_SN_US, Sep 2026 snapshot) and are copied value-for-value from js/results-data/sn.js; the lines Results does not carry — cost of sales, net interest, other income (expense), income tax, pretax income (derived as operating income less both non-operating lines, tying to the filings within $0.01M), stock-based compensation, diluted shares and free cash flow — come from the same export, with forward years as Street consensus. FY2020-21 functional lines are from the June 2023 Form F-1, where the filing corrects Bloomberg\'s transposed R&amp;D and G&amp;A. Stock-based compensation by line, the expense-line definitions and the drivers are from the FY2025 Form 10-K, the FY2023 and FY2024 Forms 20-F and the 2026 Forms 10-Q (SEC EDGAR); management quotes are verbatim from SharkNinja\'s earnings calls as recorded in the portal\'s theme record. SharkNinja has no other-operating-expense line, so that slot is a rounding residual. No Summit DCF model exists for SharkNinja.';
