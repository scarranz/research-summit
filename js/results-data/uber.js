// results-data/uber.js - Uber (UBER) dataset for the standardized "Results" tab + the merged
// "Setup" chart (uberSetup). All monetary values are US$ MILLIONS (unit 'usdM' -> the engine divides
// by 1000 for $B); EPS in dollars; Trips and MAPCs are counts in millions (unit 'count').
// null = not available. Generated + hand-reconciled; do not hand-edit the number arrays.
//
// LAST UPDATED: 5 Aug 2026, the morning of the 2Q26 print (reported BMO, call 8:00am ET).
//
// ── THE FOUR SERIES ───────────────────────────────────────────────────────────────────────────
//   act    = reported actuals. Sourced from the Summit model's actuals_history (which ties 1:1 to
//            Uber's releases) and cross-checked against the Bloomberg archive's reported columns.
//   summit = Summit's own forecast, from the model's projection_history. **The model keeps a FROZEN
//            per-quarter projection for every quarter back to 3Q22** — the estimate as it stood
//            going into each print. This is what makes an actual-vs-Summit audit trail possible
//            across the whole history, not just the last two quarters.
//   cons   = Street consensus going in, rebuilt from the rolling Bloomberg archive
//            (BBG_CONSENSUS.txt, G:\My Drive\Summit\Docs\0\, 12 UBER snapshots, newest
//            data_as_of 2026-07-31). Rule: for each period take the SHORTEST forward horizon
//            available before the print, and among equal horizons the LATEST snapshot. Every
//            reported quarter from 3Q23 on is fq+1 (one quarter out) except 3Q24, which no snapshot
//            covers at fq+1 and so comes from fq+2. Forward quarters carry fq+2/+3/+4 from the
//            2026-07-31 file — i.e. they are PRE-2Q26-PRINT. The Street will have moved on the
//            3Q26 numbers today; refresh when the next archive drop lands.
//   guideLo/guideHi = Uber's own quarterly Financial Outlook, taken verbatim from each quarter's
//            press release. Uber guides THREE lines and only one quarter ahead: total Gross
//            Bookings and Adjusted EBITDA every quarter since 3Q22, and Non-GAAP EPS since the
//            1Q26 guide. Revenue, segment GB, op income and the KPIs are NOT guided and correctly
//            render "No guidance".
//
// ── WHAT CHANGED IN THIS PASS (Aug 2026) ──────────────────────────────────────────────────────
//  1. 2Q26 print filled end-to-end + the 3Q26 guide added.
//  2. **Summit backfilled across the whole history.** It previously carried values for 4Q25 and
//     1Q26 only, on the belief that the MCP's oldest snapshot (2025-12-15) capped how far back a
//     pre-print estimate could be read. That was wrong: projection_history in ANY snapshot holds
//     the frozen quarters back to 3Q22. This is why the chart only plotted two quarters of Summit.
//  3. **Guidance backfilled for all 17 guided quarters.** The model HAS guidance rows
//     (GB_LOW/HIGH_GUIDANCE, EBITDA_LOW/HIGH_GUIDANCE, EPS_LOW/HIGH_GUIDANCE) but every cell is a
//     literal 0 — never entered. Guidance therefore comes from the releases, not the DCF. If
//     San/Oscar populate those rows the next refresh can read them straight from the model.
//  4. **Total Gross Bookings consensus backfilled** from the archive's total_gross_bookings (kpi8)
//     line; it had no history at all. Trips consensus (kpi7) added with the new Trips metric.
//  5. **gb.act corrected.** It had been computed as Mobility + Delivery for the early quarters,
//     silently EXCLUDING Freight (3Q22 read 27,368 against a true 29,119) — which also put the
//     actual below every guidance band it is now scored against. All 16 quarters now reconcile:
//     Mobility + Delivery + Freight, tying exactly to each release.
//  6. **ebitda.act 1Q24 corrected 708 -> 1,382.** The 708 came from the Bloomberg archive's
//     reported column and is not Uber's Adjusted EBITDA; against a 1,315 consensus it printed a
//     46% miss for a quarter Uber actually beat.
//  7. New metrics: Freight GB, Mobility/Delivery revenue, Free cash flow, Trips, MAPCs.
//
// ── BASIS NOTES (read before trusting a surprise) ──────────────────────────────────────────────
//  * Operating income is the COMPARABLE / non-GAAP line (Bloomberg IS_COMPARABLE_EBIT for act and
//    cons; the model's ADJ_OPINC for summit), NOT GAAP income from operations. For 2Q26 that is
//    $2,143M, not the $1,890M GAAP figure. Mixing the two manufactures a miss.
//  * EPS is Uber's own Non-GAAP EPS throughout for act, summit and guidance. **eps.cons is null
//    before 4Q25 on purpose.** Bloomberg's adjusted-EPS aggregate sits on a different basis in the
//    earlier years — it implies a 29% miss in 2Q25 (0.843 vs a 0.602 print) and a 33% beat in
//    1Q24 — so publishing it would invent surprises out of a definition gap. From 4Q25 on it
//    reconciles (2Q26: 0.809 cons vs 0.806 print, inside a 0.78-0.82 guide). A proper Non-GAAP EPS
//    consensus needs a Bloomberg pull, not more of this file.
//  * Segment Adjusted EBITDA is deliberately ABSENT. In the 2Q26 release Uber states that
//    "Adjusted EBITDA is no longer a key measure used by management" and replaced the segment
//    tables with Segment Operating Income. The model's MOBILITY_EBITDA / DELIVERY_EBITDA rows
//    already splice the new measure in from 1Q26 (Mobility 1Q26 reads 2,029 = the segment
//    OPERATING INCOME). Charting that line would put a basis break mid-series. Revisit once there
//    are enough quarters of the new measure to stand on its own.
//  * summit forward EBITDA and FCF (3Q26 onward) come from the **2026-07-31** vintage. The Aug-5
//    model re-cut revenue, segment GB and the adjusted P&L but left the quarterly EBITDA /
//    OP_INCOME / FCF rows at zero — not yet refreshed for the print. Everything else is Aug-5.
//  * trips.summit is null at 1Q26: the model's projection for that quarter is 3,751, a verbatim
//    carry-forward of the 4Q25 ACTUAL rather than a forecast.
//  * MODEL ANOMALIES for the audit list: the ANNUAL projection rows for ORDERS (FY2026 reads
//    12,260 — below the FY2025 actual of 13,567), DELIVERY_EBITDA (FY2026 2,550 vs 4,729 summing
//    its own quarters) and EBITDA (zeroed from FY2026 in the Aug-5 vintage) are unreliable. Annual
//    trips.summit and fcf.summit are therefore left null rather than filled with a bad number.

export var uberResults = {
  updated: 'Aug 2026',
  intro: 'How Uber\u2019s reported results have stacked up against the three things that set expectations \u2014 the company\u2019s own quarterly guidance, Street consensus, and the Summit model \u2014 per metric, quarterly and annual, with growth and margins. Uber guides Gross Bookings and Adjusted EBITDA every quarter (and Non-GAAP EPS since 1Q26), so those lines carry a guidance band across the whole history. Periods marked \u201cest.\u201d are forward (no actual yet).',
  source: 'Actuals and Summit estimates from the Summit_Financial_Data model (snapshot 2026-08-05, which already contains the 2Q26 print). Street consensus rebuilt from the rolling Bloomberg archive BBG_CONSENSUS.txt (newest snapshot 2026-07-31, i.e. pre-print). Guidance quoted from each quarter\u2019s Uber press release \u2014 the model\u2019s own guidance rows are empty.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Reported actuals against (1) the guidance range Uber gave a quarter earlier, (2) the Street consensus that stood one quarter out, and (3) Summit\u2019s frozen pre-print estimate. All three run the full history.',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [8343, 8607, 8823, 9230, 9292, 9936, 10131, 10700, 11188, 11959, 11533, 12651, 13467, 14366, 13203, 14191, null, null, null],
          summit: [8385.7, 8966, 8804.2, 9229.2, 9252.4, 9489, 9450.1, 10158.8, 10953.8, 11771.9, 11607.4, 12537.3, 13426.1, 14462.3, 14040.1, 14222.8, 15168.9, 16574.4, 16212.5],
          cons:   [null, null, null, null, 9536.4, 9779.2, 10108.4, 10580.4, 10951.3, 11770.3, 11614.4, 12475.5, 13264, 14293.7, 13332.1, 14242.5, 14820.9, 15821, 15355],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        gb: { label: 'Gross Bookings (Total)', short: 'Total GB', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [29119, 30749, 31408, 33601, 35281, 37575, 37651, 39952, 40973, 44197, 42818, 46756, 49740, 54140, 53720, 58022, null, null, null],
          summit: [31048.9, 31974.6, 32051.7, 33521.1, 35031.6, 37046.2, 36686.4, 39445.8, 41770, 44012.7, 43397.3, 46695.9, 49593.1, 53848.8, 52987.8, 57807, 61089.9, 66544.5, 63527.3],
          cons:   [null, null, null, null, 34474.2, 37115.7, 37974.2, 39714.5, 41281.4, 43529.4, 43114.4, 46419.4, 48960.5, 53179.2, 52882.1, 57158.8, 59313, 63938.1, 62536.1],
          guideLo:[29000, 30000, 31000, 33000, 34000, 36500, 37000, 38750, 40250, 42750, 42000, 45750, 48250, 52250, 52000, 56250, 58250, null, null],
          guideHi:[30000, 31000, 32000, 34000, 35000, 37500, 38500, 40250, 41750, 44250, 43500, 47250, 49750, 53750, 53500, 57750, 60250, null, null] },
        mobgb: { label: 'Mobility Gross Bookings', short: 'Mobility GB', group: 'Mobility', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14894, 14981, 16728, 17903, 19285, 18670, 20554, 21002, 22798, 21182, 23762, 25111, 27442, 26394, 28988, null, null, null],
          summit: [14330.4, 14628.6, 14368.8, 16304.1, 18199.7, 19362.2, 17977.2, 20073.6, 21841.7, 23142, 21657.2, 24048.2, 25937.5, 27585.6, 25842, 28870.8, 30133.2, 32930.4, 31672.8],
          cons:   [null, null, null, null, 17383.2, 19113, 19134.5, 20359.4, 21538.7, 22525.5, 21470.2, 23910, 24849.2, 27135, 25845.4, 28935.5, 29870.5, 32408, 30683.7],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        mobrev: { label: 'Mobility Revenue', short: 'Mobility rev.', group: 'Mobility', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [3822, 4136, 4330, 4894, 5071, 5537, 5633, 6134, 6409, 6911, 6496, 7288, 7682, 8204, 6798, 7363, null, null, null],
          summit: [3869.2, 4096, 4023.3, 4728.2, 5277.9, 5421.4, 5033.6, 5620.6, 6334.1, 6942.6, 6497.2, 7214.5, 7910.9, 8413.6, 7778.5, 7506.4, 7864.8, 8594.8, 8868.4],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delgb: { label: 'Delivery Gross Bookings', short: 'Delivery GB', group: 'Delivery', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14315, 15026, 15595, 16094, 17011, 17699, 18126, 18663, 20126, 20377, 21734, 23322, 25431, 25992, 27463, null, null, null],
          summit: [14880.5, 15595, 16127.5, 16096.2, 15873.4, 16605.4, 17430.2, 18090.2, 18669, 19562.7, 20530.8, 21388.7, 22395.6, 24956.2, 25878.8, 27602.2, 29385.7, 32043.1, 29890.8],
          cons:   [null, null, null, null, 15795.6, 16755.4, 17524.2, 18111.2, 18472.4, 19682.2, 20235.6, 21212.1, 22838.7, 24752.7, 25757.6, 26965.2, 28068.7, 30161.1, 30490.2],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delrev: { label: 'Delivery Revenue', short: 'Delivery rev.', group: 'Delivery', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [2770, 2931, 3093, 3057, 2935, 3119, 3214, 3293, 3470, 3773, 3777, 4102, 4477, 4892, 5068, 5245, null, null, null],
          summit: [2678.5, 3119, 3225.5, 3380.2, 3016, 2989, 3137.4, 3256.2, 3360.4, 3521.3, 3900.9, 4063.9, 4255.2, 4741.7, 4994.6, 5382.4, 5733.2, 6408.6, 5380.3],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        frgb: { label: 'Freight Gross Bookings', short: 'Freight GB', group: 'Freight', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [1751, 1540, 1401, 1278, 1284, 1279, 1282, 1272, 1308, 1273, 1259, 1260, 1307, 1267, 1334, 1571, null, null, null],
          summit: [1838, 1751, 1555.4, 1120.8, 958.5, 1078.6, 1279, 1282, 1259.3, 1308, 1209.4, 1259, 1260, 1307, 1267, 1334, 1571, 1571, 1963.8],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income (non-GAAP)', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'gb', marginLabel: 'operating margin (% of Gross Bookings)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-495, -142, -262, 326, 394, 652, 821, 942, 1073, 1254, 1326, 1534, 1675, 1918, 1883, 2143, null, null, null],
          summit: [null, null, null, null, null, null, null, 1193, 1359.5, 1618.2, 1607, 1841.1, 2040.7, 2234.6, 1742.2, 2192.2, 2370, 2690, 2717],
          cons:   [null, null, null, null, 302.3, 505.2, 620.9, 792.5, 916.9, 1196.1, 1219, 1470.4, 1618.1, 1898.1, 1844.7, 2110.7, 2230.5, 2497.3, 2449.1],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'gb', marginLabel: 'EBITDA margin (% of Gross Bookings)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [516, 665, 761, 916, 1092, 1283, 1382, 1570, 1690, 1842, 1868, 2119, 2256, 2487, 2481, 2819, null, null, null],
          summit: [507.9, 551.5, 693.4, 944.9, 1032.2, 1068.8, 1199.8, 1464, 1634.5, 1890.2, 1855.3, 2107.1, 2328.3, 2517.2, 2396.1, 2794.8, 2960.4, 3310.6, 3135.6],
          cons:   [null, null, null, null, 1007.1, 1221.9, 1315.2, 1502.8, 1621.7, 1849.2, 1838.7, 2094.8, 2270.9, 2480.9, 2438.5, 2785.1, 2884.2, 3335.1, 3091.5],
          guideLo:[440, 600, 660, 800, 975, 1180, 1260, 1450, 1580, 1780, 1790, 2020, 2190, 2410, 2370, 2700, 2860, null, null],
          guideHi:[470, 630, 700, 850, 1025, 1240, 1340, 1530, 1680, 1880, 1890, 2120, 2290, 2510, 2470, 2800, 2960, null, null] },
        eps: { label: 'EPS (Non-GAAP)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, null, null, null, null, null, 0.37, 0.41, 0.52, 0.56, 0.51, 0.6, 0.65, 0.71, 0.72, 0.81, null, null, null],
          summit: [null, null, null, null, null, null, null, 0.487, 0.537, 0.638, 0.638, 0.737, 0.816, 0.894, 0.672, 0.827, 0.904, 1.041, 1.161],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, 0.739, 0.702, 0.809, 0.856, 0.962, 0.949],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.65, 0.78, 0.84, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.72, 0.82, 0.88, null, null] },
        fcf: { label: 'Free Cash Flow', short: 'FCF', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin (% of revenue)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [358, -496, 549, 1083, 798, 600, 1359, 1721, 2109, 1706, 2250, 2475, 2230, 2808, 2286, 2792, null, null, null],
          summit: [null, null, null, null, null, null, null, 1913.7, 2167.9, 2129.8, 2409.6, 2632.5, 2910.7, 2988.1, 2454.5, 2589.1, 2756.9, 3032.5, 3202.2],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        trips: { label: 'Trips', short: 'Trips', group: 'Platform', unit: 'count', unitLabel: 'millions of trips',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [1953, 2104, 2124, 2282, 2441, 2601, 2572, 2765, 2868, 3068, 3036, 3268, 3512, 3751, 3643, 3867, null, null, null],
          summit: [2102.6, 2154.7, 2125.5, 2223.9, 2374, 2567.3, 2779.2, 2710.5, 2935.1, 3094.2, 3111.8, 3111.1, 3367.4, 3645.6, null, 4040.7, 4202, 4491, 4235.3],
          cons:   [null, null, null, null, 2390.1, 2539.9, 2594.5, 2713.6, 2867.8, 3015.7, 2981.9, 3228.4, 3389.4, 3663.4, 3652.3, 3901.4, 4115.7, 4369.9, 4218.3],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        mapc: { label: 'Monthly Active Platform Consumers', short: 'MAPCs', group: 'Platform', unit: 'count', unitLabel: 'millions of consumers',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [124, 131, 130, 137, 142, 150, 149, 156, 161, 171, 170, 180, 189, 202, 199, 208, null, null, null],
          summit: [133.1, 135.7, 128.8, 136.6, 138.9, 146.7, 156, 157.6, 161.9, 171, 168.4, 174.7, 180.3, 191.5, 195.5, 210.6, 221.1, 236.3, 222.9],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'gb', groups: [
          { label: 'Totals', keys: ['gb', 'rev'] },
          { label: 'Mobility', keys: ['mobgb', 'mobrev'] },
          { label: 'Delivery', keys: ['delgb', 'delrev'] },
          { label: 'Freight', keys: ['frgb'] },
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'opinc', 'eps', 'fcf'] },
        ] },
        { key: 'kpis', label: 'Operating KPIs', defaultMetric: 'trips', groups: [
          { label: 'Platform', keys: ['trips', 'mapc'] },
        ] }
      ],
    },
    y: {
      label: 'Annual',
      note: 'Fiscal-year actuals against the Street consensus that stood going into each year\u2019s Q4 print, plus Summit\u2019s forecast on the open years. Uber does not give annual guidance, so no bands here.',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [31877, 37281, 43978, 52017, null, null, null, null, null],
          summit: [null, null, null, null, 59137.4, 68838.9, 79079.9, 94365.4, 113027],
          cons:   [null, 37141.6, 43758.4, 51955.7, 58162.9, 66864.5, 76609.3, 85289.5, 94927.1],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        gb: { label: 'Gross Bookings (Total)', short: 'Total GB', group: 'Totals', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [115395, 137865, 162773, 193454, null, null, null, null, null],
          summit: [null, null, null, null, 239377, 288233, 344419, 412497, 495119],
          cons:   [null, 137076.9, 162125.2, 192502.4, 234383.6, 271760.8, 307103.1, 342261.2, 380782.3],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mobgb: { label: 'Mobility Gross Bookings', short: 'Mobility GB', group: 'Mobility', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [52665, 68897, 83024, 97497, null, null, null, null, null],
          summit: [null, null, null, null, 118446, 138581, 173227, 216533, 270667],
          cons:   [null, 68421.5, 82728.2, 97189.5, 117650.9, 135960.2, 154706.4, 171847, 190992.9],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mobrev: { label: 'Mobility Revenue', short: 'Mobility rev.', group: 'Mobility', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [14029, 19832, 25087, 29670, null, null, null, null, null],
          summit: [null, null, null, null, 30620.6, 34645.3, 43306.7, 54133.3, 67666.7],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        delgb: { label: 'Delivery Gross Bookings', short: 'Delivery GB', group: 'Delivery', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [55778, 63726, 74614, 90864, null, null, null, null, null],
          summit: [null, null, null, null, 114884, 143605, 165145, 189917, 218405],
          cons:   [null, 63551.9, 74229.6, 90217.7, 111247.8, 129636.1, 147972.5, 164476.4, 183604.2],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        delrev: { label: 'Delivery Revenue', short: 'Delivery rev.', group: 'Delivery', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [10901, 12204, 13750, 17248, null, null, null, null, null],
          summit: [null, null, null, null, 22454.8, 28146.5, 29726.2, 34185.1, 39312.9],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        frgb: { label: 'Freight Gross Bookings', short: 'Freight GB', group: 'Freight', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [6952, 5242, 5135, 5093, null, null, null, null, null],
          summit: [null, null, null, null, 6047, 6047, 6047, 6047, 6047],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income (non-GAAP)', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'gb', marginLabel: 'operating margin (% of Gross Bookings)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [-1832, 1110, 3977, 6453, null, null, null, null, null],
          summit: [null, null, null, null, 9581.7, 11491.6, 15775.6, 20141.4, 25511.3],
          cons:   [null, 983.2, 3216.8, 6165, 8778.2, 11010, 13377.3, 15833.6, 18264.1],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'gb', marginLabel: 'EBITDA margin (% of Gross Bookings)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [1713, 4052, 6484, 8730, null, null, null, null, null],
          summit: [null, null, null, null, 11546.7, 14817.4, 17397.3, 21495.5, 26517.3],
          cons:   [null, 3993.9, 6490.9, 8719.1, 11381.7, 13539.7, 16260.6, 18742, 21161],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        eps: { label: 'EPS (Non-GAAP)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [null, null, 1.86, 2.47, null, null, null, null, null],
          summit: [null, null, null, null, 3.681, 4.728, 7.24, 9.73, 12.972],
          cons:   [null, null, null, null, 3.311, 4.45, 5.487, 6.565, 7.441],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        fcf: { label: 'Free Cash Flow', short: 'FCF', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin (% of revenue)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [390, 3362, 6895, 9763, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        trips: { label: 'Trips', short: 'Trips', group: 'Platform', unit: 'count', unitLabel: 'millions of trips',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [7642, 9448, 11273, 13567, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 9453, 11318.6, 13464.5, 16046.8, 18264, 20873.7, 22949.2, 25661.1],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mapc: { label: 'Monthly Active Platform Consumers', short: 'MAPCs', group: 'Platform', unit: 'count', unitLabel: 'millions of consumers',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [131, 150, 171, 202, null, null, null, null, null],
          summit: [null, null, null, null, 236.3, 264.7, 296.5, 332, 371.9],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'gb', groups: [
          { label: 'Totals', keys: ['gb', 'rev'] },
          { label: 'Mobility', keys: ['mobgb', 'mobrev'] },
          { label: 'Delivery', keys: ['delgb', 'delrev'] },
          { label: 'Freight', keys: ['frgb'] },
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'opinc', 'eps', 'fcf'] },
        ] },
        { key: 'kpis', label: 'Operating KPIs', defaultMetric: 'trips', groups: [
          { label: 'Platform', keys: ['trips', 'mapc'] },
        ] }
      ],
    }
  },
  // Estimate EVOLUTION across model snapshots (vintages) — how the ANNUAL forecast for each fiscal
  // year moved as prints landed. Source: the Summit MCP projection_history sheet, one column per
  // snapshot, PLUS the Bloomberg consensus the model stores alongside it (REV_BBG_EST /
  // EBITDA_BBG_EST) — which is what the dashed `cons` line now plots. Five of the model's nine
  // stored snapshots are shown: the ones that bracket a print. The 17 Jul, 20 Jul and 3 Aug 2026
  // vintages are intra-period saves and are omitted (the 20 Jul one is unusable anyway — its
  // Delivery-Hero pro-forma toggle was ON, inflating every line to a $67.9B FY25 revenue against
  // the $52.0B standalone actual).
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year\u2019s estimate across the model\u2019s saved snapshots \u2014 solid for Summit, dashed for the Bloomberg consensus stored in the same file. The story is a convergence: the May 2026 snapshot cut Summit\u2019s revenue line hard (a UK accounting change that lowered reported revenue ~$1B a quarter), taking it from well above the Street to roughly on top of it, and the post-2Q26 snapshot nudged it back up. On EBITDA the pattern runs the other way \u2014 Summit has sat above the Street the whole time, and the gap has closed because the Street kept raising, not because Summit came down.',
    vintages: [
      { label: 'Dec 15, 2025', event: 'pre-4Q25 print' },
      { label: 'Feb 5, 2026',  event: 'post-4Q25 print' },
      { label: 'May 7, 2026',  event: 'post-1Q26 print' },
      { label: 'Jul 31, 2026', event: 'pre-2Q26 print' },
      { label: 'Aug 5, 2026',  event: 'post-2Q26 print' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Totals', keys: ['rev'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'ebitda', groups: [
        { label: 'Company', keys: ['ebitda', 'opinc'] }
      ] }
    ],
    metrics: {
      rev: { label: 'Revenue (Total)', unit: 'usdM',
        summit: [[61688.9, 61971.8, 58695.2, 58695.2, 59137.4], [73404.8, 72490.4, 68127.7, 68127.7, 68838.9], [81964.4, 82203.1, 78362, 78362, 79079.9], [98410.2, 98519.3, 93642.3, 93642.3, 94365.4]],
        cons: [[60448.7, 60509.1, 58205.2, 58183.7, 58176.7], [69193.4, 69327, 66806.5, 66857, 66911], [77984.6, 78273.6, 75643, 76607.5, 76723.1], [85783.4, 86818.3, 83149.6, 85308.5, 85341.9]],
        prior: { summit: [52113, 52017, 52017, 52017, 52017] },
        note: 'The May 2026 snapshot cut every forward year: FY26 $62.0B \u2192 $58.7B (\u22125%), FY27 $72.5B \u2192 $68.1B, FY29 $98.5B \u2192 $93.6B \u2014 the model absorbing the UK accounting change that lowered reported revenue. What the consensus line adds is the shape of it: the Street was already at ~$58.2B for FY26 in December and has not moved off it since (a $58.2\u201360.5B band across eight months). So Summit did not lead the cut, it closed a gap it had been carrying \u2014 and after the 2Q26 print it sits $1.0B ABOVE the Street on FY26 again. In the growth view, implied FY26 growth stepped down from ~19% (Dec) to ~13% (May) and back to ~13.7%.' },
      ebitda: { label: 'Adjusted EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
        summit: [[11451.1, 11021, 11546.7, 11546.7, null], [15335, 13643.6, 14817.4, 14817.4, null], [17831.5, 17486, 17397.3, 17397.3, null], [22251.9, 21853.5, 21495.5, 21495.5, null]],
        cons: [[10969.5, 10978.1, 10833.5, 11057.4, 11382], [13410.1, 13460.3, 13014.2, 13423.8, 13538.7], [15789.1, 15725.1, 15960.5, 16173.2, 16288.2], [18037, 18145.5, 18099, 18530.6, 18746.2]],
        note: 'EBITDA held far steadier than revenue through the re-rates \u2014 FY26 sits at ~$11.5B in every snapshot that carries it, FY27 dipped to $13.6B in Feb then recovered to $14.8B by May. The consensus line is the one that moved: the Street has raised FY26 EBITDA in every snapshot since May ($10.8B \u2192 $11.1B \u2192 $11.4B) and has now essentially caught Summit. **The Aug 5 column is blank by design** \u2014 that vintage re-cut revenue and the adjusted P&L but left the EBITDA rows at zero, not yet refreshed for the print; it is a gap in the model, not a forecast of nothing. In the margin view the implied EBITDA margin rose as revenue was cut: FY26 ~19.7% at the last complete snapshot vs ~18.6% in Dec \u2014 the arithmetic of a lower revenue base on a steady profit line.' },
      opinc: { label: 'Operating Income (non-GAAP)', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin (% of rev)',
        summit: [[null, 8664.2, 9122, 9653.3, 9581.7], [null, 10945, 11465.7, 11465.7, 11491.6], [null, 15375.6, 15727.2, 15727.2, 15775.6], [null, 19700.9, 20090.5, 20090.5, 20141.4]],
        cons: null,
        note: 'The cleanest read on the model\u2019s direction, because unlike revenue it was never re-based: Summit\u2019s FY26 non-GAAP operating income has been raised at every snapshot since February \u2014 $8.66B \u2192 $9.12B \u2192 $9.65B \u2014 easing only fractionally to $9.58B after the 2Q26 print. The out-years moved with it. Read alongside revenue, that is the whole thesis in one line: the model cut the top line and raised the profit on it. The Dec 2025 vintage does not carry this metric, so the first column is empty. No stored Bloomberg consensus exists for this line.' }
    },
    note: 'Source: Summit DCF model for UBER \u2014 projection_history across the five stored snapshots that bracket a print (15 Dec 2025, 5 Feb 2026, 7 May 2026, 31 Jul 2026, 5 Aug 2026), read from the Summit MCP, with the Bloomberg consensus (REV_BBG_EST / EBITDA_BBG_EST) stored in the same file plotted as the dashed line. Values in US$ millions; growth chains within each vintage\u2019s own data (each year vs the prior year stored in the same vintage). Data sourced from Summit DCF models.'
  }
};

// ---- uberSetup: merged Setup chart dataset (Earnings > Setup), EARNINGS_CONVENTIONS S6a-viii-bis
// Same engine + data as uberResults, CLUBBED into ONE section (key 'setup') with narrow rolling
// windows. Mirrors results-data/googl-setup.js.
function sliceMetrics(view, idx){
  var out = {};
  Object.keys(view.metrics).forEach(function(k){
    var m = view.metrics[k], o = {};
    Object.keys(m).forEach(function(f){ o[f] = Array.isArray(m[f]) ? idx.map(function(i){ return m[f][i]; }) : m[f]; });
    out[k] = o;
  });
  return out;
}
var Q_BACK = 8;
function quarterlyIdx(view){
  var rev = view.metrics.rev, fc = -1, i;
  for (i = 0; i < rev.periods.length; i++){ if (rev.act[i] == null){ fc = i; break; } }
  if (fc < 0) fc = rev.periods.length - 1;
  var start = Math.max(0, fc - Q_BACK), idx = [];
  for (i = start; i <= fc; i++) idx.push(i);
  return idx;
}
var Y_BACK = 3, Y_FWD = 2;
function annualIdx(view){
  var rev = view.metrics.rev, lastA = -1;
  rev.act.forEach(function(v, i){ if (v != null) lastA = i; });
  var start = Math.max(0, lastA - Y_BACK), end = Math.min(lastA + Y_FWD, rev.periods.length - 1), idx = [];
  for (var i = start; i <= end; i++) idx.push(i);
  return idx;
}
function mergedSection(view){
  var groups = view.sections.reduce(function(a, s){ return a.concat(s.groups); }, []);
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'gb', groups: groups }];
}
var qIdx = quarterlyIdx(uberResults.views.q);
var yIdx = annualIdx(uberResults.views.y);

export var uberSetup = {
  updated: uberResults.updated,
  intro: '',
  source: uberResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Rolling \u2014 the last 8 reported quarters plus the one next (forecast) quarter. ' + uberResults.views.q.note,
         metrics: sliceMetrics(uberResults.views.q, qIdx), sections: mergedSection(uberResults.views.q) },
    y: { label: 'Annual', note: 'Rolling \u2014 the last 4 fiscal years plus the next 2 forward years. ' + uberResults.views.y.note,
         metrics: sliceMetrics(uberResults.views.y, yIdx), sections: mergedSection(uberResults.views.y) }
  }
};
