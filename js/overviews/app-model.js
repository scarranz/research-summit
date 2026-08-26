// overviews/app-model.js — AppLovin Corporation (APP) financial model.
//
// Sources:
//   • FY2025 Form 10-K (filed Feb 19, 2026) — FY2023/2024/2025 continuing operations.
//   • 1Q26 and 2Q26 Form 10-Qs — the 2026 quarterly progression.
//   • Bloomberg "APP US Equity — Company Financial (Multiple Periods)", estimate source BST
//     (Bloomberg consensus) — 2026E/2027E/2028E, plus the 2021/2022 segment split.
//
// ── THE ONE THING TO UNDERSTAND BEFORE READING ANY NUMBER ────────────────────────
// On 2025-06-30 AppLovin sold its Apps (mobile-gaming) business to Tripledot. Apps is
// presented as DISCONTINUED OPERATIONS in every period, and the company now reports a
// SINGLE operating and reportable segment. Every series below named "…" without an
// `apps` prefix is CONTINUING OPERATIONS = the advertising business only.
//
// That means the revenue line the company printed in its own 2021-2024 10-Ks
// (`reportedRevenue` below) is NOT comparable to today's `revenue`. Both are carried so
// the divestiture optics can be shown honestly side by side.
//
// Verification: the Bloomberg segment rows reconcile exactly to the 10-K restatement —
// Advertising 2023 1,841.762 / 2024 3,224.058 == 10-K continuing-ops revenue, and
// Apps 2023 1,441.325 / 2024 1,485.190 == 10-K discontinued-ops revenue. The historical
// split is therefore reliable; the model's *forward* segment rows are not (see APP_MODEL_WARN).
//
// Units: $M USD unless noted. Per-share in USD. Percentages in %. `null` = not disclosed
// on a continuing-operations basis for that year (AppLovin never restated 2021/2022 cost
// lines, so only revenue and Adjusted EBITDA exist that far back).
//
// Data only — no DOM, no Chart.js. Imported by app.js.

// ─── Timeline axis ──────────────────────────────────────────────────────────────
export var AM_YEARS = ['2021','2022','2023','2024','2025','2026E','2027E','2028E'];
export var AM_ISEST = [false,false,false,false,false,true,true,true];
export var AM_LAST_ACTUAL = 4;   // index of 2025 (last reported year)
export var AM_EST_FROM   = 5;    // index of first estimate (2026E)
export var AM_MIN_FULL   = 2;    // index of 2023 — first year with a full continuing-ops P&L

// ─── Income statement — CONTINUING OPERATIONS (the advertising business) ─────────
export var AM_IS = {
  // 2021/2022 = Bloomberg "Advertising" segment revenue (the pre-divestiture reporting
  // segment that became today's whole company). 2023-2025 = 10-K continuing operations.
  revenue:         [673.952, 1049.167, 1841.762, 3224.058, 5480.717, 8142.882, 10521.455, 13111.208],

  costOfRevenue:   [null, null,  356.613,  520.613,  665.140,  938.588, 1206.708, 1704.048],
  salesMarketing:  [null, null,  228.025,  252.863,  203.651,  263.286,  336.025,  571.051],
  researchDev:     [null, null,  333.781,  374.710,  226.510,  385.077,  439.662,  658.450],
  generalAdmin:    [null, null,  150.932,  164.916,  233.502,  197.671,  247.265,  265.623],
  totalCosts:      [null, null, 1069.351, 1313.102, 1328.803, 1784.622, 2229.660, 3199.172],

  operatingIncome: [null, null,  772.411, 1910.956, 4151.914, 6344.680, 8306.520, 10209.789],

  // 2021/2022 = Bloomberg's Advertising-segment Adjusted EBITDA as reported at the time;
  // 2023-2025 = the 10-K's restated continuing-operations Adjusted EBITDA. The two bases
  // differ slightly (the segment figure for 2023/2024 was 1,275.7 / 2,442.6).
  adjEbitda:       [457.302, 808.415, 1236.284, 2411.764, 4512.452, 6820.781, 8783.531, 10963.905],

  interestExpense: [null, null,  273.508,  317.209,  207.016,  204.032,  199.245,  195.361],
  pretaxIncome:    [null, null,  501.602, 1611.943, 3952.910, 6287.037, 8150.778, 10446.278],
  incomeTax:       [null, null,   43.776,   22.419,  519.715,  956.792, 1180.424, 1584.654],
  netIncome:       [null, null,  457.826, 1589.524, 3433.195, 5377.125, 6997.250, 8801.000],

  // Diluted EPS. 2023-2025 are the reported TOTAL diluted EPS (continuing + discontinued);
  // 2026E+ are BST adjusted diluted EPS. They coincide in 2023/2024/2025 because Bloomberg's
  // adjusted EPS equals GAAP diluted EPS in those years.
  epsDiluted:      [null, null,     0.98,     4.53,     9.75,    15.792,   20.696,   26.425],
  // Reported (as-printed) diluted shares. Bloomberg's forward share counts are unusable
  // (they jump to ~398M then back to ~338M while the company retires ~3.3M shares a half),
  // so the estimate years are derived consistently as netIncome ÷ epsDiluted.
  dilutedShares:   [null, null,  362.589,  347.808,  341.970,  340.5,    338.1,     333.1],
  dilutedSharesDerived: [false,false,false,false,false,true,true,true],
};

// ─── Revenue by geography (based on user location) ───────────────────────────────
// 2023-2025 tie exactly to total revenue. The 2026E-2028E consensus geography lines
// sum ~0.5-0.7% short of consensus total revenue — see AM_GEO_NOTE.
export var AM_GEO = {
  unitedStates: [null, null, 1015.897, 1726.202, 2827.248, 4166.214, 5456.009, 6989.554],
  restOfWorld:  [null, null,  825.865, 1497.856, 2653.469, 3919.287, 5206.746, 6748.379],
};
export var AM_GEO_NOTE = "Revenue disaggregated by geography is based on END-USER location, not billing entity — it is the only revenue split AppLovin publishes. 2023-2025 tie exactly to total revenue; the 2026E-2028E consensus geography lines sum about 0.5-0.7% short of consensus total revenue, so treat the forward split as directional.";

// ─── Discontinued operations — the Apps business that was sold ───────────────────
export var AM_APPS = {
  revenue:    [2119.152, 1767.891, 1441.325, 1485.190, 640.830, null, null, null],
  adjEbitda:  [ 340.142,  254.795,  226.953,  277.008,    null, null, null, null],
  // The revenue line as printed in each year's own filing (advertising + apps), i.e. what
  // the market saw at the time. 2025 onward there is no Apps line to add.
  reportedRevenue: [2793.104, 2817.058, 3283.087, 4709.248, 5480.717, 8142.882, 10521.455, 13111.208],
};

// ─── Cash flow ($M) — capex/buyback stored as POSITIVE magnitudes (cash outflows) ─
export var AM_CF = {
  cfo:      [null, null, 1061.510, 2099.011, 3971.094, 5289.423, 7106.500, 8696.747],
  fcf:      [null, null, 1037.094, 2073.360, 3951.952, 5290.715, 7053.573, 8616.510],
  capex:    [null, null,    4.246,    4.776,    0.473,   20.191,   24.522,   39.559],
  buyback:  [null, null, 1153.593,  981.297, 2191.944, 2620.071, 2860.902, 3452.103],
  sbc:      [null, null,  342.551,  357.431,  207.958,  323.023,  341.339,  435.140],
  taxesPaid:[null, null,   75.433,   67.332,  194.843,     null,     null,     null],
};

// ─── Balance sheet ───────────────────────────────────────────────────────────────
export var AM_BS = {
  cash:        [null, null,  502.152,  741.411, 2487.096, 4783.347,  8972.909, 14833.021],
  totalDebt:   [null, null, 2905.906, 3508.983, 3512.987, 3508.589,  3500.079,  3439.593],
  netDebt:     [null, null, 2675.264, 2837.330, 1075.126,-1430.509, -5644.901,-10181.451],
  totalAssets: [null, null, 5359.187, 5869.259, 7259.610,10373.130, 15297.216, 22193.627],
  equity:      [null, null, 1256.329, 1089.818, 2134.671, 5124.714,  9834.153, 16144.600],
  accountsRec: [null, null,  953.810, 1283.335, 1819.366, 2430.924,  3002.408,  3827.761],
};

// ─── The CODM's significant-expense view (10-K Note 14, continuing ops) ──────────
// This is how the CEO actually sees the cost base. Datacenter is the true variable cost.
export var AM_CODM = {
  datacenter:   [null, null, 251.197, 392.498, 542.674, null, null, null],
  personnel:    [null, null, 230.762, 259.711, 207.278, null, null, null],
  interest:     [null, null, 273.508, 317.209, 207.016, null, null, null],
  taxes:        [null, null,  43.776,  22.419, 519.715, null, null, null],
  daWriteoffs:  [null, null, 119.152, 128.791, 130.724, null, null, null],
  sbc:          [null, null, 342.551, 357.431, 207.958, null, null, null],
  other:        [null, null, 122.990, 156.475, 232.157, null, null, null],
};
export var AM_CODM_NOTE = "AppLovin has ONE reportable segment, so instead of a segment table the 10-K discloses the expense categories the Chief Operating Decision Maker (the CEO) reviews. \"Other expenses\" covers professional services, facilities, advertising, software and individually insignificant costs. Only 2023-2025 are disclosed on this basis — consensus does not forecast these categories.";

// ─── The growth decomposition — volume vs price (MD&A, as disclosed) ─────────────
// AppLovin discloses ONLY the YoY percentages, never the absolute install count or the
// dollar revenue per install. These are the company's own rounded figures.
export var AM_DRIVERS = {
  labels:      ['FY2024','FY2025','1Q26','2Q26','1H26'],
  isQuarter:   [false, false, true, true, false],
  installs:    [ 50,  3, -18, -2, -10],   // YoY % change in volume of installations
  netRevPerInstall: [22, 72, 93, 58, 75], // YoY % change in net revenue per installation
  revenue:     [ 75, 70,  59, 53,  56],   // YoY % revenue growth
};
export var AM_DRIVERS_NOTE = "Volume × price does not multiply out exactly to revenue growth because AppLovin discloses only rounded percentages and the mix shifts between periods. FY2024 is the last year growth came from volume; every period since has been driven by monetisation per install. \"Net revenue per installation\" is revenue net of amounts paid to publishers, divided by installs — the company never publishes the underlying levels.";

// ─── The non-GAAP bridge (10-K, continuing ops) ──────────────────────────────────
// Net income from continuing operations up to Adjusted EBITDA, in the company's own order.
// Indexed like every other series here (2023 at AM_MIN_FULL), so only 2023-2025 are populated:
// consensus carries an Adjusted EBITDA number but never the reconciling items behind it.
export var AM_BRIDGE = {
  netIncomeCont:  [null, null, 457.826, 1589.524, 3433.195, null, null, null],
  interest:       [null, null, 273.508,  317.209,  207.016, null, null, null],
  otherIncome:    [null, null,  -4.729,  -23.396,  -15.694, null, null, null],
  tax:            [null, null,  43.776,   22.419,  519.715, null, null, null],
  daWriteoffs:    [null, null, 119.152,  128.791,  130.724, null, null, null],
  fx:             [null, null,   0.837,    1.642,   -3.949, null, null, null],
  sbc:            [null, null, 342.551,  357.431,  207.958, null, null, null],
  transaction:    [null, null,   1.047,    0.885,   27.579, null, null, null],
  restructuring:  [null, null,   2.316,   17.259,    5.908, null, null, null],
  adjEbitda:      [null, null,1236.284, 2411.764, 4512.452, null, null, null],
};
// Order and labels for the bridge table — keeps the walk in the filing's own sequence.
export var AM_BRIDGE_ROWS = [
  ['netIncomeCont', 'Net income from continuing operations', 'start'],
  ['interest',      'Interest expense & loss on settlement',  'add'],
  ['otherIncome',   'Other income, net',                      'add'],
  ['tax',           'Provision for income taxes',             'add'],
  ['daWriteoffs',   'Amortization, depreciation, write-offs', 'add'],
  ['fx',            'Non-operating foreign exchange',         'add'],
  ['sbc',           'Stock-based compensation',               'add'],
  ['transaction',   'Transaction-related expense',            'add'],
  ['restructuring', 'Restructuring costs',                    'add'],
  ['adjEbitda',     'Adjusted EBITDA',                        'total'],
];
export var AM_BRIDGE_NOTE = "AppLovin's own reconciliation, FY2025 Form 10-K. Every line between the two totals is an add-back — the reason Adjusted EBITDA margin (82.3% in FY2025) sits so far above operating margin. Consensus forecasts Adjusted EBITDA for 2026E-2028E but not the reconciling items, so the bridge stops at the last reported year.";

// ─── Stock-based compensation, the largest single add-back ───────────────────────
// Annual is continuing operations (matches the bridge). Quarterly comes from the 10-Qs and is
// what makes the 2026 inflection visible: the October 2025 PSU grant starts amortising.
export var AM_SBC_UNRECOGNISED = 489.0;      // $M unrecognised at 12/31/25
export var AM_SBC_PERIOD_YRS   = 1.95;       // weighted-average recognition period, years
export var AM_PSU_GRANT_FV     = 410.5;      // Oct-2025 grant-date fair value, $M
// The PSU programme. The Oct-2025 grant is the one still outstanding and the only one whose
// expense is still ahead of the P&L.
export var AM_PSUS = [
  { d:'Mar 2023', who:'6,902,000 PSUs each to the CEO and CTO',   cond:'Stock price $36 → $79, 5 tranches, 5-year window', st:'Vested 12/31/24', live:false },
  { d:'Apr 2023', who:'3,451,000 PSUs to non-executives',          cond:'Same stock-price targets',                        st:'Vested 12/31/24', live:false },
  { d:'Nov 2024', who:'348,327 PSUs to non-executives',            cond:'Stock price $184.35 → $294.96, 3 tranches',        st:'Vested 12/31/24', live:false },
  { d:'Oct 2025', who:'920,526 PSUs to key engineering employees', cond:'Market cap $300.0B, milestones to $1.0 trillion, 7-year period', st:'Outstanding · $410.5M', live:true },
];
export var AM_PSU_NOTE = "The October 2025 grant is valued on market-capitalization milestones rather than a share price, and its Monte Carlo valuation (stock $620.62 at grant, 70.95% volatility, 3.85% risk-free, 20.34% marketability discount) was the Critical Audit Matter in Deloitte's FY2025 report — the auditor's own signal that this is the most judgement-heavy number in the accounts. Unrecognised stock compensation was $489.0M over a 1.95-year weighted average at 12/31/2025, BEFORE the full effect of this grant.";

// ─── Quarterly progression (10-Qs). Only the four quarters these filings cover. ───
export var AQ_LABELS = ['1Q25','2Q25','1Q26','2Q26'];
export var AQ = {
  revenue:        [1158.974, 1258.754, 1842.449, 1923.686],
  costOfRevenue:  [ 151.680,  155.076,  203.632,  225.801],
  salesMarketing: [  59.383,   46.917,   60.751,   63.394],
  researchDev:    [  56.406,   44.032,   94.104,   99.901],
  generalAdmin:   [  51.523,   55.047,   44.029,   40.313],
  totalCosts:     [ 318.992,  301.072,  402.516,  429.409],
  operatingIncome:[ 839.982,  957.682, 1439.933, 1494.277],
  adjEbitda:      [ 937.772, 1018.347, 1556.919, 1613.823],
  netIncome:      [ 723.538,  771.856, 1205.613, 1266.538],   // continuing operations
  epsDiluted:     [    2.10,     2.26,     3.56,     3.76],   // continuing operations
  cfo:            [ 831.712,  772.226, 1291.393,  869.040],   // 2Q figures derived (6M − 3M)
  fcf:            [ 825.731,  768.063, 1286.748,  863.317],   // 2Q figures derived (6M − 3M)
  unitedStates:   [ 615.703,  658.321,  907.219,  989.626],
  restOfWorld:    [ 543.271,  600.433,  935.230,  934.060],
  sbc:            [  59.115,   34.552,   83.469,   85.783],
};
export var AQ_DERIVED = { cfo:[false,true,false,true], fcf:[false,true,false,true] };
export var AQ_NOTE = "The 10-Qs report cash flows CUMULATIVELY, so the 2Q standalone cash-flow figures are derived (six-month minus three-month) and marked. 3Q25 and 4Q25 are not in these filings, so the quarterly series jumps from 2Q25 to 1Q26 — YoY comparisons are still clean. Net income and EPS are continuing operations; reported total net income in 1Q25/2Q25 was 576.4 and 819.5 after discontinued-operations items.";

// ─── Known-bad Bloomberg fields — documented so nobody wires them by accident ─────
export var APP_MODEL_WARN = [
  ['Forward segment rows', 'Apps / In-App Purchase / In-App Advertising revenue still carry 2026E-2028E values for a business sold on 2025-06-30. The HISTORICAL split (2021-2024) is verified against the 10-K and is used here; the forward rows are ignored.'],
  ['Non-controlling interest', 'Shows $10.8B / $15.5B / $21.9B for 2026E-2028E. AppLovin’s actual NCI is zero — the field is mis-mapped.'],
  ['Forward diluted share count', 'Jumps to ~398M in 2026E-2027E then back to ~338M in 2028E, while the company is retiring ~3.3M shares per half. Unusable — this model derives forward shares as net income ÷ EPS instead.'],
  ['Adjusted EBITDA margin field', 'Bloomberg prints 84.31% for 2026E, but Adjusted EBITDA ÷ revenue is 83.8%. Margins here are always computed, never read off.'],
  ['Free Cash Flow 2025', 'Bloomberg shows $3,971.1M (= cash from operations, no deduction). The company’s own FY25 definition nets finance-lease principal and gives $3,952.0M, which is what this model carries.'],
];

export var AM_SOURCE = "Bloomberg — APP US Equity, Company Financial (Multiple Periods); estimate source BST (Bloomberg consensus). 2021-2025 actuals cross-checked line by line against AppLovin’s FY2025 Form 10-K and the 1Q26/2Q26 Form 10-Qs; where the filing and the model disagree the filing wins. 2026E-2028E are consensus estimates, NOT company guidance — AppLovin publishes no forward guidance in its SEC filings. All figures are continuing operations (the advertising business) unless labelled Apps or as-reported.";
