// overviews/dis-model.js — The Walt Disney Company (DIS) full financial model.
//
// Source: Bloomberg "DIS US Equity — Company Financial (Multiple Periods)", Estimate Source
// BST (Bloomberg consensus), Actual Source Bloomberg/company filings. Fiscal years ending ~late
// Sept/early Oct. FY2019–FY2025 are ACTUAL (reported); FY2026E–FY2028E are ESTIMATES (BST).
//
// Units: all monetary series in $M USD unless noted. Subscribers in THOUSANDS. ARPU is monthly
// USD. Margins / rates / growth in %. Per-share in USD. `null` = not disclosed / not mapped for
// that year (e.g. the current three-segment split only goes back to the FY2022 restatement).
//
// Data only — no DOM, no Chart.js. Imported by dis.js.

// ─── Timeline axis ──────────────────────────────────────────────────────────────
export var DM_YEARS = ['FY19','FY20','FY21','FY22','FY23','FY24','FY25','FY26E','FY27E','FY28E'];
export var DM_ISEST = [false,false,false,false,false,false,false,true,true,true];
export var DM_LAST_ACTUAL = 6;   // index of FY2025 (last reported year)
export var DM_EST_FROM   = 7;    // index of first estimate (FY2026E)

// ─── Income statement ($M unless noted) ─────────────────────────────────────────
export var DM_IS = {
  revenue:         [69570,65388,67418,82722,88898,91361,94425,101430,106183,110622],
  grossProfit:     [27546,21508,22287,28321,29697,32663,35659,34207,35911,30406],
  grossMargin:     [39.6,32.9,33.1,34.2,33.4,35.8,37.8,37.6,38.0,40.8],           // %
  ebitda:          [17985,11532,11120,17284,16685,20591,22877,22536,24147,26095], // comparable
  segmentOI:       [14868,8108,7766,12121,12863,15601,17551,19606,20358,21802],   // total segment OI (comparable EBIT)
  operatingIncome: [11830,-1941,3659,6533,5100,8319,13832,16254,17896,19783],     // GAAP
  operatingMargin: [17.0,-3.0,5.4,7.9,5.7,9.1,14.6,16.0,16.6,17.1],               // %
  netIncomeGAAP:   [11054,-2864,1995,3145,2354,4972,12404,10200,11803,12878],
  adjNetIncome:    [10089,4110,4739,6835,7959,9997,11340,12485,12891,14110],
  epsGAAP:         [6.27,-1.57,1.11,1.75,1.29,2.72,6.85,5.74,6.75,7.68],
  epsAdj:          [5.77,2.02,2.29,3.53,3.76,4.97,5.93,6.88,7.42,8.18],
  dilutedShares:   [1666,1808,1828,1827,1830,1831,1811,1758,1698,1650],
  dps:             [1.76,0.88,0,0,0,0.75,1.00,1.41,1.62,1.74],
  taxRate:         [21.7,null,1.0,32.8,28.9,23.7,null,25.4,24.1,25.0],             // %
};

// ─── Segment revenue & operating income ($M) — current 3-segment view (from FY2022) ─
export var DM_SEG = {
  rev: {
    Entertainment: [null,48350,50866,39569,40635,41186,42466,46267,47957,49861],
    Sports:        [null,null,null,17270,17111,17619,17672,18390,19232,19363],
    Experiences:   [null,17038,16552,28085,32549,34151,36156,39260,41269,43541],
  },
  oi: {
    Entertainment: [null,null,null,2126,1444,3923,4674,5318,5966,6559],
    Sports:        [null,null,null,2655,2410,2406,2882,3048,3014,2904],
    Experiences:   [null,null,null,7285,8954,9272,9995,11110,11766,12523],
  },
};

// ─── Segment sub-lines ($M) — the revenue/OI breakdown inside each segment ───────
export var DM_SEG_DETAIL = {
  Entertainment: {
    // Bloomberg only carries the sub&affiliate / content-sales split on the estimate columns.
    subAffiliate: [null,null,null,null,null,null,null,29272,31890,33448],
    advertising:  [null,null,null,8674,7594,7506,6679,6287,6524,6515],
    contentSales: [null,null,null,null,null,null,null,6345,6587,6845],
    // Reported cost lines (FY2022+) — used for the operating-expense cost-type split.
    sga:          [null,null,null,10576,9404,9326,9733,10043,10206,10568],
    da:           [null,null,null,724,756,734,825,919,933,955],
  },
  Sports: {
    subAffiliate: [null,null,null,null,null,null,null,12504,12803,11578],
    advertising:  [null,null,null,4370,3920,4388,4444,4600,5227,4690],
    other:        [null,null,null,991,1084,1163,1284,1081,1051,1004],
  },
  Experiences: {
    // Revenue — By Region (Domestic + International + Consumer Products reconcile to segment total FY2022+)
    domesticRev:         [null,null,null,20131,22677,23596,25191,27480,29191,31001],
    intlRev:             [null,null,null,3297,5475,6183,6520,6997,7402,7863],
    consumerProductsRev: [4633,4792,5340,4657,4397,4372,4445,4644,4596,4634],
    // Revenue — By Type (the five revenue lines reconcile to the segment total FY2022+)
    themeParkAdmissions:        [null,null,null,8602,10423,11171,11707,12619,13242,14067],
    resortsVacation:            [null,null,null,6410,7949,8375,9210,10364,11391,12113],
    merchandiseFB:              [5963,3441,3299,6579,7712,8039,8491,9113,9554,10103],   // Parks & Experiences Merchandise, Food & Beverage
    parksLicensingOther:        [1937,1436,1463,1885,2107,2259,2361,2521,2603,2718],
    merchandiseLicensingRetail: [4519,4721,5241,4609,4358,4307,4387,4603,4658,4755],
    // Operating income & capex
    domesticOI:          [null,null,null,5332,5876,5878,6375,7249,7703,8282],
    intlOI:              [null,null,null,-237,1104,1354,1442,1385,1552,1693],
    consumerProductsOI:  [1839,2151,2684,2190,1974,2040,2178,2464,2426,2440],
    capex:               [null,null,null,3447,3025,3659,6429,7364,7566,8120],
    // Operating expenses — by cost type (the clean, complete FY2022+ lines; "Other" is the
    // reconciling residual that absorbs cost of goods, infrastructure, distribution & occupancy).
    operatingLabor:      [null,4870,4711,6577,7550,8392,8948,9532,10088,10577],
    sga:                 [null,null,null,3403,3675,3944,4114,4334,4677,4840],
    da:                  [null,null,null,2451,2789,2579,2823,3162,3361,3542],
  },
};

// ─── Streaming — subscribers (000s), ARPU ($/mo), DTC P&L ($M) ────────────────────
export var DM_STREAM = {
  totalSubs:       [32000,120600,179000,235000,224700,238800,195700,229540,237503,244512],
  disneyPlusSubs:  [null,null,74800,102900,112600,125300,131600,138108,145295,151014],
  disneyPlusArpu:  [null,null,5.87,6.22,6.39,7.18,7.81,7.60,7.93,8.34],
  huluSubs:        [28500,36600,43700,47200,48500,52000,64100,67587,68117,70517],
  dtcRev:          [null,null,null,19576,21926,24938,null,29501,32667,33775],   // combined DTC streaming
  dtcOI:           [null,null,null,-4013,-2612,134,null,2768,4527,6461],
};

// ─── Cash flow ($M unless noted) ─────────────────────────────────────────────────
// Capex / dividends / buyback stored as POSITIVE magnitudes (they are cash outflows).
export var DM_CF = {
  cfo:           [6606,7618,5567,6010,9866,13971,18101,18836,19451,20370],
  capex:         [4876,4022,3578,4943,4969,5412,8024,9154,9163,9485],
  capexPctSales: [7.0,6.2,5.3,6.0,5.6,5.9,8.5,8.9,8.7,9.0],                 // %
  fcf:           [1108,3594,1988,1059,4897,8559,10077,9776,10111,11181],
  fcfPerShare:   [1.04,1.99,1.10,0.59,2.68,4.69,5.59,5.65,6.07,6.62],
  dividendsPaid: [2895,1587,0,0,0,1366,1803,2548,2885,2987],
  buyback:       [0,0,0,0,0,2992,3500,8071,6536,7385],
};

// ─── Balance sheet & returns ($M unless noted) ───────────────────────────────────
export var DM_BS = {
  cash:        [5418,17914,15959,11615,14182,6002,5695,6443,5970,6438],
  totalDebt:   [46986,58628,54406,48369,46412,45101,41251,46141,45213,44487],
  netDebt:     [41719,44409,42354,40644,36490,43515,39728,39677,39911,39120],
  totalAssets: [193984,201549,203609,203631,205579,196219,197514,205542,209602,214424],
  equity:      [102852,97512,102224,108378,113012,105522,114612,117684,123293,127765],
  roe:         [16.1,-3.3,2.3,4.5,2.4,5.0,11.8,9.1,9.6,10.8],   // %
  roa:         [7.6,-1.4,1.0,1.5,1.2,2.5,6.3,5.1,5.8,6.5],       // %
};

export var DM_SOURCE = "Bloomberg — DIS US Equity, Company Financial (Multiple Periods). FY2019–FY2025 actuals (Bloomberg / company filings); FY2026E–FY2028E are Bloomberg consensus (BST) estimates. Fiscal years end ~late September. Subscribers in thousands; ARPU monthly USD; financials $M USD unless noted. The current three-segment split (Entertainment / Sports / Experiences) is disclosed from the FY2022 restatement, so earlier cells are blank.";
