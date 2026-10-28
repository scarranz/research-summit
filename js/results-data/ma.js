// results-data/ma.js — Mastercard (MA) dataset for the standardized "Results" engine (js/results.js).
// Reconstructed from the rolling BBG_CONSENSUS.txt archive (G:\My Drive\Summit\Docs\0\), 23 MA
// snapshots (data_as_of 2021-05-04 → 2026-10-28). Spec + every parse trap: docs/EARNINGS_CONVENTIONS.md §6a.
// Integrity checked on load: fq+N == fq0+N, fq-3 == fq0-3 and every close_fqN equals that quarter's
// calendar end — 23 snapshots, 0 mismatches. Regenerate, never hand-edit (script: ma_build.py).
//   act    = reported actuals — the archive's fq0 walked down the snapshot rows (freshest print per
//            quarter), extended back with fq-3; annual = fy0 walked down.
//   cons   = the Street number that stood going in — a reported quarter takes the prior snapshot's
//            fq+1 (1q out); forward quarters take the latest snapshot's fq+1..fq+4. Annual analogous.
//   summit = the Summit DCF model's own annual line (local DCF MA - New.xlsm, tab Projection History,
//            read 2026-10-28), in USD millions; capex stored as positive magnitude. The MA model
//            is ANNUAL-only — it has no quarterly projections — so quarterly summit stays null, and
//            annual summit runs 2022–2029. Only the lines the model carries have a Summit series
//            (revenue, operating income, EBITDA, net income, D&A, interest expense, CFO, capex, FCF,
//            diluted shares). Summit's op-income/EBITDA defs can differ from the BBG actuals; that is
//            expected (its own line, not a restatement).
//   METRIC SET = THE FILE'S (EARNINGS_CONVENTIONS §6a). The Oct-2026 export widened from 9 headline +
//            4 KPI slots to 22 headline (metric1–39) + 12 KPI (kpi1–12) populated for MA, and EVERY
//            slot with valid values is carried. The revenue-build KPIs reconcile in the ACTUALS (Q2 2026:
//            domestic 3,154 + cross-border 3,460 + transaction processing 4,508 + other 326 = gross
//            11,448; gross − client incentives 5,997 = Payment Network 5,451; + VAS 3,826 = net 9,277).
//            Never sum CONSENSUS across lines (§6a — each cell is its own contributor set).
//            purchase_volume (kpi1) and processed_transactions (kpi2) are carried as unit USD / scale M
//            in the file but are a volume and a COUNT: ptx renders unit:'cnt', never a $.
//            Capex (HEADLINE_CAPEX) and repurchases (CF_DECR_CAP_STOCK) come through negative: stored as
//            positive magnitudes. Client incentives stay negative (contra-revenue).
//            Payment Network revenue and VAS revenue only exist from 2022 Q4 — shorter series, not an error.
//   guideLo/guideHi = null — MA's numeric guidance (net-revenue-growth ranges, opex) is not a BBG
//            line; it lives separately in MA_GUIDE, not here.
// Monetary values US$ millions; EPS in dollars. null = not available (Bloomberg "Error ####", an
// Excel date-serial string, a near-zero placeholder, or blank are all parsed to null — never carried
// as a number). EPS is the BBG GAAP-comparable line (IS_COMP_EPS_GAAP): eps_fq0 = 4.97 for Q2 2026,
// vs the company-reported ADJUSTED $5.04 — the BBG value is used for internal consistency with the
// BBG consensus series. Generated, do not hand-edit.

// Builder: act/cons are the reconstructed series; summit is the Summit DCF model's own line where
// available (annual only — the MA model has no quarterly projections, so quarterly summit stays null);
// guideLo/guideHi are null (MA guidance is authored separately in MA_GUIDE, not a BBG line).
function nA(p){ return p.map(function(){ return null; }); }
function mM(o){
  return { label:o.label, short:o.short, group:o.group, unit:o.unit,
    marginOf:o.marginOf, marginLabel:o.marginLabel,
    periods:o.periods, act:o.act, cons:o.cons,
    summit:o.summit || nA(o.periods), guideLo:nA(o.periods), guideHi:nA(o.periods) };
}

var Q=['2Q20','3Q20','4Q20','1Q21','2Q21','3Q21','4Q21','1Q22','2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27'];
var Y=['2020','2021','2022','2023','2024','2025','2026','2027','2028','2029'];

var MA_Q = {
  rev: { label:'Net revenue', short:'Net revenue', group:'Totals', unit:'usdM',
    act:  [3335,3837,4120,4155,4528,4985,5216,5136,5497,5756,5817,5748,6269,6533,6548,6348,6961,7369,7489,7250,8133,8602,8806,8398,9277,null,null,null,null],
    cons: [null,null,null,null,4328,4952,5181,4954,5262,5689,5818,5619,6183,6538,6495,6343,6858,7254,7404,7123,7923,8470,8768,8268,9079,9669,9970,9451,10397] },
  opinc: { label:'Operating income', short:'Op. income', group:'Profit', unit:'usdM', marginOf:'rev', marginLabel:'operating margin',
    act:  [1707,2100,2058,2197,2341,2717,2827,2950,3018,3112,3184,3136,3656,3844,3372,3604,4036,4004,3938,4149,4777,5061,4910,4907,5587,null,null,null,null],
    cons: [null,null,null,null,2188,2754,2778,2728,2930,3205,3147,3250,3566,3777,3648,3713,4017,4147,4186,4152,4678,4953,4410,4849,4942,5782,5755,5644,6320] },
  ebitda: { label:'Adjusted EBITDA', short:'EBITDA', group:'Profit', unit:'usdM', marginOf:'rev', marginLabel:'EBITDA margin',
    act:  [1874,2241,2250,2360,2527,2764,2951,3146,3367,3505,3384,3538,3869,4055,3885,3947,4358,4595,4431,4424,5154,5434,5381,5408,5978,null,null,null,null],
    cons: [null,null,null,null,2382,2950,2955,2943,3133,3457,3401,3449,3799,4046,3874,3941,4258,4486,4426,4413,4971,5289,5258,5228,5759,6127,6129,6048,6700] },
  eps: { label:'EPS (GAAP-comparable, diluted)', short:'EPS', group:'Profit', unit:'eps',
    act:  [1.41,1.51,1.78,1.83,2.08,2.44,2.42,2.68,2.34,2.58,2.62,2.47,3,3.39,2.97,3.22,3.5,3.53,3.64,3.59,4.07,4.34,4.52,4.35,4.97,null,null,null,null],
    cons: [null,null,null,null,1.73,2.18,2.2,2.21,2.35,2.61,2.58,2.71,2.99,3.22,3.1,3.23,3.51,3.68,3.69,3.59,4,4.29,4.25,4.3,4.76,5.13,5.15,5.1,5.75] },
  ni: { label:'Net income (GAAP-comparable)', short:'Net income', group:'Profit', unit:'usdM',
    act:  [1420,1513,1785,1828,2066,2414,2379,2631,2275,2499,2525,2361,2845,3198,2791,3011,3258,3263,3342,3280,3701,3927,4060,3882,4388,null,null,null,null],
    cons: [null,null,null,null,1721,2171,2175,2170,2307,2538,2504,2598,2847,3065,2901,3018,3271,3378,3396,3258,3631,3869,3818,3831,4221,4496,4485,4430,4949] },
  pti: { label:'Pre-tax income', short:'Pre-tax income', group:'Profit', unit:'usdM',
    act:  [1712,1915,2168,2190,2478,2675,2823,2773,3074,3072,3113,2853,3704,3761,3321,3558,3939,3866,3891,4031,4672,4999,4876,4812,5486,null,null,null,null],
    cons: [null,null,null,null,2094,2633,2651,2643,2833,3145,3098,3156,3479,3732,3561,3632,3942,4147,4096,4058,4558,4846,4814,4781,5316,5669,5643,5548,6213] },
  opex: { label:'Total operating expenses', short:'Opex', group:'Operating costs', unit:'usdM',
    act:  [1628,1732,2062,1958,2187,2268,2389,2217,2479,2644,2633,2612,2613,2689,3176,2744,2925,3365,3551,3101,3356,3541,3896,3491,3690,null,null,null,null],
    cons: [null,null,null,null,2144,2211,2415,2234,2358,2454,2632,2378,2608,2772,2871,2665,2876,3112,3232,2983,3238,3502,3832,3418,3642,3892,4217,3793,4077] },
  ga: { label:'General & administrative expense', short:'G&A', group:'Operating costs', unit:'usdM',
    act:  [1368,1423,1625,1676,1718,1831,1862,1844,1947,2069,2218,2043,2200,2285,2399,2286,2418,2744,2745,2523,2766,2923,3106,3039,3082,null,null,null,null],
    cons: [null,null,null,null,1753,1786,1940,1838,1895,1998,2086,1992,2166,2290,2405,2230,2414,2525,2667,2550,2737,2957,3174,2859,3080,3261,3501,3250,3457] },
  am: { label:'Advertising & marketing', short:'Adv. & mktg', group:'Operating costs', unit:'usdM',
    act:  [93,168,242,119,216,222,338,181,210,182,216,167,201,193,264,116,184,220,295,152,213,245,319,153,217,null,null,null,null],
    cons: [null,null,null,null,195,220,270,190,241,249,339,187,226,216,239,196,210,221,290,158,216,249,341,185,234,266,353,188,252] },
  dna: { label:'Depreciation & amortization', short:'D&A', group:'Operating costs', unit:'usdM',
    act:  [145,141,150,163,186,188,189,192,189,185,184,191,192,211,205,216,225,225,231,275,281,290,297,299,309,null,null,null,null],
    cons: [null,null,null,null,166,189,190,187,202,204,203,185,208,207,215,211,213,231,221,229,259,264,284,295,294,318,328,321,335] },
  sbc: { label:'Stock-based compensation', short:'SBC', group:'Operating costs', unit:'usdM',
    act:  [75,75,52,65,87,89,32,74,101,98,22,108,135,131,86,108,155,155,108,129,179,177,112,136,190,null,null,null,null],
    cons: [null,null,null,null,45,55,49,52,54,63,77,70,110,117,90,128,137,145,126,134,161,170,154,154,193,193,154,170,208] },
  lit: { label:'Provision for litigation', short:'Litigation', group:'Operating costs', unit:'usdM',
    act:  [22,null,45,null,67,27,null,null,133,208,15,211,20,null,308,126,98,176,280,151,96,83,174,202,82,null,null,null,null],
    cons: [null,null,null,null,null,null,null,25,92,10,9,3,27,-42,13,8,23,139,97,63,41,36,64,81,45,63,36,46,50] },
  intexp: { label:'Interest expense', short:'Interest exp.', group:'Below the line', unit:'usdM',
    act:  [101,105,105,107,106,110,108,110,114,120,127,132,144,151,148,150,153,159,184,182,195,186,159,185,218,null,null,null,null],
    cons: [null,null,null,null,113,112,116,110,115,116,118,120,124,107,148,149,154,154,162,179,197,194,187,168,192,220,214,213,214] },
  netint: { label:'Net interest expense', short:'Net interest', group:'Below the line', unit:'usdM',
    act:  [93,102,105,106,103,105,106,105,107,104,94,77,85,80,59,55,93,83,88,94,125,105,73,104,130,null,null,null,null],
    cons: [null,null,null,null,-35,-38,-35,112,116,39,34,30,97,99,77,73,74,77,89,107,121,123,109,81,113,137,140,144,149] },
  intnet: { label:'Interest expense / (income), net', short:'Int. exp./(inc.) net', group:'Below the line', unit:'usdM',
    act:  [17,190,-110,7,-137,-99,4,177,220,40,95,283,-48,83,51,46,97,138,47,118,105,62,34,95,101,null,null,null,null],
    cons: [null,null,null,null,97,105,103,91,102,110,100,90,67,67,76,70,75,89,91,97,132,126,84,76,112,125,121,115,117] },
  invinc: { label:'Investment income', short:'Invest. income', group:'Below the line', unit:'usdM',
    act:  [-8,-3,3,-1,-3,-5,-2,-5,-7,-16,-33,-55,-59,-71,-89,-95,-60,-76,-96,-88,-70,-81,-86,-81,-88,null,null,null,null],
    cons: [null,null,null,null,-3,-3,-3,-6,-5,-6,-15,-26,-43,-45,-67,-83,-61,-57,-61,-64,-61,-60,-57,-54,-46,-82,-83,-81,-81] },
  oie: { label:'Other income / (expense), net', short:'Other inc./(exp.)', group:'Below the line', unit:'usdM',
    act:  [-1,-3,2,-5,3,-7,9,-4,-4,-4,-11,-6,-10,-3,26,-3,-9,-7,-1,-5,-16,-2,-143,-75,-31,null,null,null,null],
    cons: [null,null,null,null,-9,-9,-15,-13,-13,12,-9,-7,-7,-5,-4,-6,2,-4,-6,-3,7,-2,-2,-40,10,-21,-18,-29,-25] },
  tax: { label:'Income tax expense', short:'Tax expense', group:'Below the line', unit:'usdM',
    act:  [270,402,383,362,412,402,444,142,523,573,564,492,859,563,530,547,681,603,549,751,971,1072,816,930,1098,null,null,null,null],
    cons: [null,null,null,null,382,475,486,456,521,609,584,573,648,699,657,618,677,706,708,794,917,996,921,880,1002,1162,1153,1125,1266] },
  cfo: { label:'Operating cash flow', short:'Op. cash flow', group:'Cash flow & capital', unit:'usdM',
    act:  [1458,1654,2253,1463,2268,2543,3189,1782,2457,3856,3100,1919,2698,3233,4130,1672,3138,5136,4834,2380,4603,5663,5002,2999,3773,null,null,null,null],
    cons: [null,null,null,null,1870,2399,2359,2202,2638,3140,2864,2643,3309,3904,3734,3232,3862,3960,3675,3189,4003,5112,4645,3248,4770,5678,5670,4273,5289] },
  fcf: { label:'Free cash flow', short:'FCF', group:'Cash flow & capital', unit:'usdM',
    act:  [1388,1575,2194,1398,2187,2404,3067,1636,2402,3745,2970,1809,2618,3129,4053,1515,3023,5029,4739,2221,4563,5485,4890,2845,3482,null,null,null,null],
    cons: [null,null,null,null,1414,2009,2353,1717,2392,2716,2553,2276,2956,3289,3066,2864,3458,3708,3676,3027,3718,4808,4180,2753,4479,5395,5445,3863,4886] },
  capex: { label:'Capex (headline capex)', short:'Capex', group:'Cash flow & capital', unit:'usdM',   // file carries it negative; stored as positive magnitude
    act:  [70,79,59,65,81,139,122,146,55,111,130,110,80,104,77,157,115,107,95,159,40,178,112,154,291,null,null,null,null],
    cons: [null,null,null,null,96,102,88,96,94,124,119,140,112,126,116,110,110,118,104,136,148,150,156,152,143,217,203,206,244] },
  buyback: { label:'Share repurchases', short:'Buybacks', group:'Cash flow & capital', unit:'usdM',   // file carries it negative; stored as positive magnitude
    act:  [10,2064,1035,1477,1715,1566,1279,2540,2384,1552,2418,2954,2419,1908,1840,2162,2643,2935,3473,2826,2291,3335,3566,4239,4898,null,null,null,null],
    cons: [null,null,null,null,1136,1161,977,1077,1388,1360,1493,1782,2017,2066,2366,2400,2400,2305,2023,2128,2210,2244,2200,2847,2312,3692,3730,3772,3901] },
  shares: { label:'Diluted weighted-avg. shares', short:'Diluted shares', group:'Cash flow & capital', unit:'cnt',
    act:  [1008,1005,1001,998,994,990,986,981,974,968,963,956,949,943,939,935,930,925,919,914,909,905,898,893,883,null,null,null,null],
    cons: [null,null,null,null,993,989,985,981,976,968,963,958,950,944,939,934,931,925,921,915,909,903,899,894,887,876,870,865,859] },
  amort: { label:'Amortization of customer & merchant incentives', short:'Incentive amort.', group:'Cash flow & capital', unit:'usdM',
    act:  [231,281,323,338,313,344,376,430,382,385,389,378,404,414,426,411,415,502,502,476,517,533,572,620,690,null,null,null,null],
    cons: [null,null,null,null,322,276,289,271,283,320,297,291,321,329,354,369,388,390,445,430,454,522,531,546,589,635,644,644,672] },
  gross: { label:'Gross revenue', short:'Gross revenue', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [5093,5935,6426,6428,7219,7826,8372,8025,8704,9167,9425,7067,7767,8174,7987,8020,8597,9259,9088,9011,9868,10568,10551,10587,11448,null,null,null,null],
    cons: [null,null,null,null,6789,7830,8232,7863,8364,8982,9389,8990,8442,8608,8522,8355,8802,9126,9037,8879,9764,10479,10427,10174,11071,11943,11866,11699,12637] },
  dom: { label:'Domestic assessments', short:'Domestic assess.', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [1474,1750,1749,1798,2056,2139,2165,2134,2283,2252,2251,2254,2468,2460,2384,2470,2596,2641,2538,2658,2789,2809,2773,2896,3154,null,null,null,null],
    cons: [null,null,null,null,1905,2173,2188,2119,2260,2348,2305,2264,2456,2500,2477,2461,2676,2684,2621,2636,2860,2915,2831,2904,3077,3159,3112,3163,3416] },
  xb: { label:'Cross-border volume fees', short:'Cross-border fees', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [637,791,867,932,1076,1276,1380,1395,1615,1803,1795,1849,2050,2313,2197,2238,2433,2804,2706,2595,2848,3313,3265,3190,3460,null,null,null,null],
    cons: [null,null,null,null,1002,1219,1341,1291,1442,1689,1690,1718,2004,2173,2170,2165,2379,2669,2632,2578,2840,3233,3180,3010,3278,3803,3721,3555,3855] },
  tp: { label:'Transaction processing revenue', short:'Txn processing', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [1901,2251,2379,2351,2612,2849,2987,2912,3061,3288,3334,2752,2979,3172,3164,3086,3324,3587,3605,3527,3971,4191,4241,4224,4508,null,null,null,null],
    cons: [null,null,null,null,2486,2885,2963,2817,2950,3120,3304,3198,3118,3225,3253,3142,3154,3506,3565,3442,3795,4068,4149,3986,4455,4685,4746,4647,4988] },
  oth: { label:'Other revenue', short:'Other revenue', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [1081,1143,1431,1347,1475,1562,1840,1584,1745,1824,2045,212,270,229,252,226,244,227,239,231,260,255,272,277,326,null,null,null,null],
    cons: [null,null,null,null,1340,null,null,null,null,1812,2098,1853,233,328,316,364,413,379,402,361,370,369,265,254,286,293,307,303,351] },
  cinc: { label:'Client incentives (contra-revenue)', short:'Client incentives', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [-1758,-2098,-2306,-2273,2691,-2841,-3156,-2858,-3207,-3411,-3608,-3417,-3694,-3963,-4108,-4100,-4222,-4630,-4677,-4579,-4923,-5389,-5631,null,-5997,null,null,null,null],
    cons: [null,null,null,null,-2445,-2880,-3030,-2910,-3088,-3296,-3554,-3347,-3340,-3047,-4043,-3224,-4378,-4169,-3844,-4182,-4525,-4899,-4992,-4913,-5324,-6281,-6400,-6259,-6672] },
  pnr: { label:'Payment Network (net revenue)', short:'Payment Network', group:'Net revenue by segment', unit:'usdM',
    act:  [null,null,null,null,null,null,null,null,null,null,null,3650,4073,4210,3891,3920,4375,4629,4411,4432,4945,5179,4920,4948,5451,null,null,null,null],
    cons: [null,null,null,null,null,null,null,null,null,null,null,null,3977,4223,3957,3932,4297,4526,4329,4310,4879,5168,4997,4863,5308,5630,5443,5412,5928] },
  vas: { label:'Value-Added Services & Solutions (net revenue)', short:'VAS', group:'Net revenue by segment', unit:'usdM',
    act:  [null,null,null,null,null,null,null,null,null,null,null,2098,2196,2323,2657,2428,2586,2740,3078,2818,3188,3423,3886,3450,3826,null,null,null,null],
    cons: [null,null,null,null,null,null,null,null,null,null,null,null,2213,2309,2540,2417,2567,2731,3093,2831,3037,3303,3785,3420,3778,4037,4526,4035,4469] },
  pvol: { label:'Purchase volume (network spend)', short:'Purchase vol', group:'Volumes & transactions', unit:'usdM',
    act:  [1037000,1236000,1321000,1296000,1466000,1543000,1655000,1517000,1650000,1669000,1728000,1707000,1839000,1879000,1921000,1871000,1975000,2058000,2114000,1993000,2182000,2280000,2344000,2251000,2417000,null,null,null,null],
    cons: [null,null,null,null,1357406,1545758,1624585,1523526,1640593,1706297,1784726,1650505,1832591,1872096,1917338,1885369,2009664,2052376,2116603,2041635,2157303,2263751,2339399,2198613,2398672,2503667,2573321,2462912,2638201] },
  ptx: { label:'Processed (switched) transactions', short:'Processed txns', group:'Volumes & transactions', unit:'cnt',
    act:  [19400,23800,24800,23800,27200,29700,31400,29000,30400,32352,34000,32500,35519,37155,38100,36700,39445,41102,42226,40096,43538,45373,46457,43797,47350,null,null,null,null],
    cons: [null,null,null,null,25772,29658,30709,29004,30839,32777,34263,31646,34591,36860,37883,36280,39498,41241,42118,40532,43480,45277,46449,44234,47627,49534,50714,48162,51969] }
};

var MA_Y = {
  rev: { label:'Net revenue', short:'Net revenue', group:'Totals', unit:'usdM',
    act:  [15301,18884,22237,25098,28167,32791,null,null,null,null],
    cons: [null,18858,22187,25077,28075,32740,37289,41976,46997,null],
    summit:[null,null,22237,25097,28167,32791,38058,41680,46386,51874] },
  opinc: { label:'Operating income', short:'Op. income', group:'Profit', unit:'usdM', marginOf:'rev', marginLabel:'operating margin',
    act:  [8081,10082,12264,14008,15582,18897,null,null,null,null],
    cons: [null,9497,11233,12614,15143,17142,22011,25125,28367,null],
    summit:[null,null,12127,13824,15278,18554,22281,24048,26737,29984] },
  ebitda: { label:'Adjusted EBITDA', short:'EBITDA', group:'Profit', unit:'usdM', marginOf:'rev', marginLabel:'EBITDA margin',
    act:  [8680,10385,13401,15347,17397,20544,null,null,null,null],
    cons: [null,10889,13352,15290,17267,20373,23590,26695,30198,null],
    summit:[null,null,12816,14829,16493,20100,23962,26905,29856,33380] },
  eps: { label:'EPS (GAAP-comparable, diluted)', short:'EPS', group:'Profit', unit:'eps',
    act:  [6.37,8.79,10.22,11.83,13.89,16.52,null,null,null,null],
    cons: [null,8.38,10.22,12.01,14.19,16.32,19.61,22.94,26.7,null] },
  ni: { label:'Net income (GAAP-comparable)', short:'Net income', group:'Profit', unit:'usdM',
    act:  [6411,8687,9930,11195,12874,14968,null,null,null,null],
    cons: [null,8369,10036,11326,13036,14736,17254,19691,22280,null],
    summit:[null,null,9793,11011,12570,14625,17320,18653,20778,23342] },
  pti: { label:'Pre-tax income', short:'Pre-tax income', group:'Profit', unit:'usdM',
    act:  [7760,9884,12121,13639,15254,18578,null,null,null,null],
    cons: [null,9928,12066,14046,15871,18638,21771,24777,28043,null] },
  opex: { label:'Total operating expenses', short:'Opex', group:'Operating costs', unit:'usdM',
    act:  [7220,8802,9973,11090,12585,13894,null,null,null,null],
    cons: [null,8796,9818,10832,12231,13839,15279,16828,18565,null] },
  ga: { label:'General & administrative expense', short:'G&A', group:'Operating costs', unit:'usdM',
    act:  [5910,7087,8078,8927,10193,11318,null,null,null,null],
    cons: [null,7134,7915,8941,10043,11397,12828,14248,15731,null] },
  am: { label:'Advertising & marketing', short:'Adv. & mktg', group:'Operating costs', unit:'usdM',
    act:  [657,895,789,825,815,929,null,null,null,null],
    cons: [null,823,935,815,824,954,992,1122,1222,null] },
  dna: { label:'Depreciation & amortization', short:'D&A', group:'Operating costs', unit:'usdM',
    act:  [580,726,750,799,897,1143,null,null,null,null],
    cons: [null,690,757,796,884,1123,1247,1358,1529,null],
    summit:[null,null,750,799,897,1143,1248,1410,1579,1753] },
  sbc: { label:'Stock-based compensation', short:'SBC', group:'Operating costs', unit:'usdM',
    act:  [254,273,295,460,526,597,null,null,null,null],
    cons: [null,278,296,439,535,641,672,768,875,null] },
  lit: { label:'Provision for litigation', short:'Litigation', group:'Operating costs', unit:'usdM',
    act:  [73,94,356,539,680,504,null,null,null,null],
    cons: [null,109,263,214,454,351,148,183,225,null] },
  intexp: { label:'Interest expense', short:'Interest exp.', group:'Below the line', unit:'usdM',
    act:  [380,431,471,575,646,722,null,null,null,null],
    cons: [null,422,467,560,629,748,832,853,847,null],
    summit:[null,null,471,575,646,722,895,1115,1115,1115] },
  netint: { label:'Net interest expense', short:'Net interest', group:'Below the line', unit:'usdM',
    act:  [356,420,410,301,319,397,null,null,null,null],
    cons: [null,-145,128,312,320,425,531,596,558,null] },
  intnet: { label:'Interest expense / (income), net', short:'Int. exp./(inc.) net', group:'Below the line', unit:'usdM',
    act:  [321,-225,532,369,328,319,null,null,null,null],
    cons: [null,-96,541,385,373,327,441,459,436,null] },
  invinc: { label:'Investment income', short:'Invest. income', group:'Below the line', unit:'usdM',
    act:  [-24,-11,-61,-274,-327,-325,null,null,null,null],
    cons: [null,-18,-43,-247,-257,-234,-332,-321,-345,null] },
  oie: { label:'Other income / (expense), net', short:'Other inc./(exp.)', group:'Below the line', unit:'usdM',
    act:  [-5,null,-23,7,-20,-166,null,null,null,null],
    cons: [null,-61,-3,-9,-23,-24,-143,-105,-108,null] },
  tax: { label:'Income tax expense', short:'Tax expense', group:'Below the line', unit:'usdM',
    act:  [1349,1620,1802,2444,2380,3610,null,null,null,null],
    cons: [null,1672,1836,2566,2576,3487,4345,5015,5695,null] },
  cfo: { label:'Operating cash flow', short:'Op. cash flow', group:'Cash flow & capital', unit:'usdM',
    act:  [7224,9463,11195,11980,14780,17648,null,null,null,null],
    cons: [null,8362,10722,11658,13748,17130,18163,21875,24825,null],
    summit:[null,null,10919,12076,14282,15610,18867,20415,22681,25431] },
  fcf: { label:'Free cash flow', short:'FCF', group:'Cash flow & capital', unit:'usdM',
    act:  [6885,9056,10753,11609,14306,17159,null,null,null,null],
    cons: [null,8137,10012,10814,12499,15759,17071,20405,22823,null],
    summit:[null,null,10477,11705,13808,15121,18276,19769,21961,24626] },
  capex: { label:'Capex (headline capex)', short:'Capex', group:'Cash flow & capital', unit:'usdM',   // file carries it negative; stored as positive magnitude
    act:  [339,407,442,371,474,489,null,null,null,null],
    cons: [null,376,415,397,481,520,840,916,1006,null],
    summit:[null,null,442,371,474,489,590,646,719,804] },
  buyback: { label:'Share repurchases', short:'Buybacks', group:'Cash flow & capital', unit:'usdM',   // file carries it negative; stored as positive magnitude
    act:  [4623,6037,8894,9121,11213,12018,null,null,null,null],
    cons: [null,4392,7030,9519,8438,8980,16183,15276,16667,null] },
  shares: { label:'Diluted weighted-avg. shares', short:'Diluted shares', group:'Cash flow & capital', unit:'cnt',
    act:  [1006,992,971,946,927,906,null,null,null,null],
    cons: [null,992,972,948,928,907,880,857,834,null],
    summit:[null,null,971,946,927,906,885,863,842,821] },
  amort: { label:'Amortization of customer & merchant incentives', short:'Incentive amort.', group:'Cash flow & capital', unit:'usdM',
    act:  [1072,1371,1586,1622,1830,2098,null,null,null,null],
    cons: [null,1156,1200,1222,1422,1778,2329,2468,2820,null] },
  gross: { label:'Gross revenue', short:'Gross revenue', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [23616,29845,35323,31005,34964,39998,null,null,null,null],
    cons: [null,29639,35223,33204,34913,39859,44937,50809,56355,null] },
  dom: { label:'Domestic assessments', short:'Domestic assess.', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [6656,8158,8920,9566,10245,11029,null,null,null,null],
    cons: [null,8167,9013,9657,10328,11124,12313,13436,14668,null] },
  xb: { label:'Cross-border volume fees', short:'Cross-border fees', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [3512,4664,6608,8409,10181,12021,null,null,null,null],
    cons: [null,4597,6452,8333,10108,11902,14169,15865,17989,null] },
  tp: { label:'Transaction processing revenue', short:'Txn processing', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [8731,10799,12597,12067,13602,15930,null,null,null,null],
    cons: [null,10791,12557,11048,13559,15760,18163,20119,22411,null] },
  oth: { label:'Other revenue', short:'Other revenue', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [4717,6224,7198,963,936,1018,null,null,null,null],
    cons: [null,5757,7239,1266,1468,988,1183,1314,1431,null] },
  cinc: { label:'Client incentives (contra-revenue)', short:'Client incentives', group:'Revenue build (gross to net)', unit:'usdM',
    act:  [-8315,-10961,-13084,-15182,-17629,-20522,null,null,null,null],
    cons: [null,-10778,-11833,-13648,-14526,-17261,-24274,-27214,-30710,null] },
  pnr: { label:'Payment Network (net revenue)', short:'Payment Network', group:'Net revenue by segment', unit:'usdM',
    act:  [null,null,14358,15824,17335,19476,null,null,null,null],
    cons: [null,null,null,15887,17253,19604,21575,23648,25855,null] },
  vas: { label:'Value-Added Services & Solutions (net revenue)', short:'VAS', group:'Net revenue by segment', unit:'usdM',
    act:  [null,null,7879,9274,10832,13315,null,null,null,null],
    cons: [null,18840,22188,9158,10847,13201,15829,18521,21333,null] },
  pvol: { label:'Purchase volume (network spend)', short:'Purchase vol', group:'Volumes & transactions', unit:'usdM',
    act:  [4743000,5974000,6570000,7346000,8018000,8799000,null,null,null,null],
    cons: [null,5926865,6627149,7338515,8020848,8791189,9746827,10660035,11641820,null] },
  ptx: { label:'Processed (switched) transactions', short:'Processed txns', group:'Volumes & transactions', unit:'cnt',
    act:  [90100,112100,125700,143200,159424,175464,null,null,null,null],
    cons: [null,111438,126023,142660,159403,175295,191439,209871,229736,null] }
};

function maMetrics(P, src){
  var m = {};
  Object.keys(src).forEach(function(k){
    var o = src[k];
    m[k] = mM({ label:o.label, short:o.short, group:o.group, unit:o.unit,
      marginOf:o.marginOf, marginLabel:o.marginLabel, periods:P, act:o.act, cons:o.cons, summit:o.summit });
  });
  return m;
}
var maSections=[
  { key:'top', label:'Top Line', defaultMetric:'rev', groups:[
    { label:'Totals', keys:['rev'] },
    { label:'Revenue build (gross to net)', keys:['gross','dom','xb','tp','oth','cinc'] },
    { label:'Net revenue by segment', keys:['pnr','vas'] },
    { label:'Volumes & transactions', keys:['pvol','ptx'] }
  ] },
  { key:'margins', label:'Margins & Profitability', defaultMetric:'opinc', groups:[
    { label:'Profit', keys:['opinc','ebitda','eps','ni','pti'] },
    { label:'Operating costs', keys:['opex','ga','am','dna','sbc','lit'] },
    { label:'Below the line', keys:['intexp','netint','intnet','invinc','oie','tax'] },
    { label:'Cash flow & capital', keys:['cfo','fcf','capex','buyback','shares','amort'] }
  ] }
];

export var maResults = {
  updated: 'Oct 2026',
  intro: 'How Mastercard\u2019s reported results have stacked up against Street consensus, per metric \u2014 quarterly and annual, with growth and margins. Each print shows the actual against the Street number we had going in, with the surprise in percent; periods marked \u201cest.\u201d are forward (no actual yet). The Summit column shows the Summit DCF model\u2019s own line on the annual view (the model is annual-only, so it is blank on the quarterly view); MA\u2019s numeric guidance is shown separately (it is not a Bloomberg line). EPS is the BBG GAAP-comparable line ($4.97 for Q2 2026, vs the company-reported adjusted $5.04) for consistency with the BBG consensus.',
  source: 'Street consensus (Bloomberg) via BBG_CONSENSUS.txt snapshot archive; actuals reported through 2026 Q2 (latest snapshot data_as_of 2026-10-28, close_fq0 6/30/2026). Summit column = Summit DCF model (MA, DCF MA - New.xlsm Projection History, read 2026-10-28), annual only, on the lines the model carries.',
  views: {
    q: { label:'Quarterly', note:'Reported actuals and the Street consensus that stood one quarter out, reconstructed from the rolling Bloomberg archive. The Summit model is annual-only, so its column is not shown here.',
         metrics: maMetrics(Q, MA_Q), sections: maSections },
    y: { label:'Annual', note:'Fiscal-year actuals, the Street consensus stored in the archive, and the Summit DCF model\u2019s own annual line (2022\u20132029).',
         metrics: maMetrics(Y, MA_Y), sections: maSections }
  }
  // no `evolution` key — Estimates sub-tab shows a pending note (matches googl.js).
};
