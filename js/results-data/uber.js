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
  // ── GENERATED BLOCK — do not hand-edit. Rebuilt by scripts/gen-consensus (see
  // docs/RESULTS_CONVENTIONS.md §8). Source: the UNION of BBG_CONSENSUS.txt (the exported
  // archive) and Consensus_Portal.xlsm sheet BBG_CONSENSUS (the live sheet, which can
  // overwrite its most recent row), deduped by data_as_of. Only FORWARD horizons are
  // kept — fq-3/fq0/fy0 marked (Rep) are Bloomberg's own reported figures, not estimates,
  // and can sit on a different basis than the company's own measure.
  estMatrix: {
    cons: {
      vintages: [
        { id: '2023-10-26', label: '2023-10-26', lastActual: { q: '2Q23', y: '2022' } },
        { id: '2024-01-31', label: '2024-01-31', lastActual: { q: '3Q23', y: '2022' } },
        { id: '2024-05-01', label: '2024-05-01', lastActual: { q: '4Q23', y: '2023' } },
        { id: '2024-07-31', label: '2024-07-31', lastActual: { q: '1Q24', y: '2023' } },
        { id: '2024-10-31', label: '2024-10-31', lastActual: { q: '3Q24', y: '2023' } },
        { id: '2025-01-30', label: '2025-01-30', lastActual: { q: '3Q24', y: '2023' } },
        { id: '2025-05-01', label: '2025-05-01', lastActual: { q: '4Q24', y: '2024' } },
        { id: '2025-07-31', label: '2025-07-31', lastActual: { q: '1Q25', y: '2024' } },
        { id: '2025-10-30', label: '2025-10-30', lastActual: { q: '2Q25', y: '2024' } },
        { id: '2026-01-29', label: '2026-01-29', lastActual: { q: '3Q25', y: '2024' } },
        { id: '2026-04-30', label: '2026-04-30', lastActual: { q: '4Q25', y: '2025' } },
        { id: '2026-07-31', label: '2026-07-31', lastActual: { q: '1Q26', y: '2025' } },
        { id: '2026-08-07', label: '2026-08-07', lastActual: { q: '2Q26', y: '2025' } },
      ],
      q: {
      rev: {
        '2023-10-26': { '3Q23': 9536.425, '4Q23': 10011.6154, '1Q24': 10218.0417, '2Q24': 10797.0417 },
        '2024-01-31': { '4Q23': 9779.225, '1Q24': 9980.1143, '2Q24': 10520.7143, '3Q24': 10925.6 },
        '2024-05-01': { '1Q24': 10108.4146, '2Q24': 10667.775, '3Q24': 11026.9, '4Q24': 11632.275 },
        '2024-07-31': { '2Q24': 10580.3571, '3Q24': 10951.3171, '4Q24': 11567.9268, '1Q25': 11749.5238 },
        '2024-10-31': { '4Q24': 11707.6744, '1Q25': 11772.2571, '2Q25': 12447.6765, '3Q25': 12859.6364 },
        '2025-01-30': { '4Q24': 11770.2791, '1Q25': 11696.25, '2Q25': 12404.075, '3Q25': 12859.8947 },
        '2025-05-01': { '1Q25': 11614.3721, '2Q25': 12343.2791, '3Q25': 12765.8372, '4Q25': 13651.9048 },
        '2025-07-31': { '2Q25': 12475.4565, '3Q25': 12879.8444, '4Q25': 13777.1778, '1Q26': 13359 },
        '2025-10-30': { '3Q25': 13264, '4Q25': 14082.1837, '1Q26': 13615, '2Q26': 14717.4333 },
        '2026-01-29': { '4Q25': 14293.6735, '1Q26': 13774.725, '2Q26': 14824.775, '3Q26': 15545.3684 },
        '2026-04-30': { '1Q26': 13332.0889, '2Q26': 14204.9773, '3Q26': 14838.4773, '4Q26': 15781.7727 },
        '2026-07-31': { '2Q26': 14242.4651, '3Q26': 14820.907, '4Q26': 15820.9535, '1Q27': 15355.0435 },
        '2026-08-07': { '3Q26': 14702.3778, '4Q26': 15692.3333, '1Q27': 15412.4, '2Q27': 16510.84 },
      },
      gb: {
        '2023-10-26': { '3Q23': 34474.2199, '4Q23': 36318.9754, '1Q24': 36973.4679, '2Q24': 39316.7093 },
        '2024-01-31': { '4Q23': 37115.6542, '1Q24': 37277.4982, '2Q24': 39359.5518, '3Q24': 41199.0526 },
        '2024-05-01': { '1Q24': 37974.1548, '2Q24': 40028.7479, '3Q24': 41571.0456, '4Q24': 44019.4781 },
        '2024-07-31': { '2Q24': 39714.4999, '3Q24': 41281.3498, '4Q24': 43731.6814, '1Q25': 43877.1345 },
        '2024-10-31': { '4Q24': 43663.4033, '1Q25': 43771.7098, '2Q25': 46341.7502, '3Q25': 47627.9678 },
        '2025-01-30': { '4Q24': 43529.414, '1Q25': 43387.5328, '2Q25': 45974.0461, '3Q25': 47297.4805 },
        '2025-05-01': { '1Q25': 43114.4259, '2Q25': 45834.6449, '3Q25': 46962.0317, '4Q25': 50455.7916 },
        '2025-07-31': { '2Q25': 46419.3662, '3Q25': 47581.9439, '4Q25': 51225.6348, '1Q26': 49811.5612 },
        '2025-10-30': { '3Q25': 48960.4903, '4Q25': 52332.8908, '1Q26': 50819.3335, '2Q26': 54632.2541 },
        '2026-01-29': { '4Q25': 53179.1691, '1Q26': 51323.4539, '2Q26': 55038.8756, '3Q26': 57546.6706 },
        '2026-04-30': { '1Q26': 52882.0547, '2Q26': 56203.431, '3Q26': 58493.9274, '4Q26': 63123.5467 },
        '2026-07-31': { '2Q26': 57158.7885, '3Q26': 59312.9653, '4Q26': 63938.1466, '1Q27': 62536.1369 },
        '2026-08-07': { '3Q26': 59740.7711, '4Q26': 64257.9242, '1Q27': 62747.381, '2Q27': 67202.9947 },
      },
      mobgb: {
        '2023-10-26': { '3Q23': 17383.2195, '4Q23': 18554.4925, '1Q24': 18369.1898, '2Q24': 20125.5527 },
        '2024-01-31': { '4Q23': 19113.0259, '1Q24': 18721.025, '2Q24': 20247.2513, '3Q24': 21483.67 },
        '2024-05-01': { '1Q24': 19134.5006, '2Q24': 20748.2485, '3Q24': 21768.3623, '4Q24': 23221.5353 },
        '2024-07-31': { '2Q24': 20359.3931, '3Q24': 21538.7156, '4Q24': 23050.862, '1Q25': 22320.4768 },
        '2024-10-31': { '4Q24': 22718.1444, '1Q25': 22088.5238, '2Q25': 24220.5044, '3Q25': 24928.5393 },
        '2025-01-30': { '4Q24': 22525.4906, '1Q25': 21725.8019, '2Q25': 23902.3362, '3Q25': 24575.7367 },
        '2025-05-01': { '1Q25': 21470.2279, '2Q25': 23706.057, '3Q25': 24300.0703, '4Q25': 26352.7606 },
        '2025-07-31': { '2Q25': 23910.0366, '3Q25': 24540.3487, '4Q25': 26690.2065, '1Q26': 24907.5967 },
        '2025-10-30': { '3Q25': 24849.1571, '4Q25': 26841.4941, '1Q26': 25083.1507, '2Q26': 27687.4812 },
        '2026-01-29': { '4Q25': 27134.9854, '1Q26': 25233.3553, '2Q26': 27793.2238, '3Q26': 29019.154 },
        '2026-04-30': { '1Q26': 25845.4015, '2Q26': 28281.0594, '3Q26': 29468.1683, '4Q26': 32011.0586 },
        '2026-07-31': { '2Q26': 28935.5052, '3Q26': 29870.4514, '4Q26': 32407.9863, '1Q27': 30683.6791 },
        '2026-08-07': { '3Q26': 29879.4679, '4Q26': 32399.5768, '1Q27': 30680.7485, '2Q27': 33583.7172 },
      },
      delgb: {
        '2023-10-26': { '3Q23': 15795.5873, '4Q23': 16497.9181, '1Q24': 17257.9008, '2Q24': 17872.365 },
        '2024-01-31': { '4Q23': 16755.4385, '1Q24': 17113.859, '2Q24': 17688.4859, '3Q24': 18319.0954 },
        '2024-05-01': { '1Q24': 17524.1933, '2Q24': 17996.9741, '3Q24': 18500.731, '4Q24': 19473.2461 },
        '2024-07-31': { '2Q24': 18111.1911, '3Q24': 18472.4076, '4Q24': 19407.6626, '1Q25': 20230.1696 },
        '2024-10-31': { '4Q24': 19641.7284, '1Q25': 20369.3739, '2Q25': 20862.3424, '3Q25': 21372.1834 },
        '2025-01-30': { '4Q24': 19682.2395, '1Q25': 20329.4873, '2Q25': 20780.1775, '3Q25': 21379.0593 },
        '2025-05-01': { '1Q25': 20235.6488, '2Q25': 20807.0847, '3Q25': 21329.7514, '4Q25': 22916.496 },
        '2025-07-31': { '2Q25': 21212.1424, '3Q25': 21713.9986, '4Q25': 23264.8961, '1Q26': 23627.9383 },
        '2025-10-30': { '3Q25': 22838.7126, '4Q25': 24226.1098, '1Q26': 24501.3661, '2Q26': 25656.2569 },
        '2026-01-29': { '4Q25': 24752.7403, '1Q26': 24824.5299, '2Q26': 25940.5255, '3Q26': 27187.7903 },
        '2026-04-30': { '1Q26': 25757.6044, '2Q26': 26635.5242, '3Q26': 27759.9434, '4Q26': 29859.0957 },
        '2026-07-31': { '2Q26': 26965.1773, '3Q26': 28068.7387, '4Q26': 30161.0574, '1Q27': 30490.1969 },
        '2026-08-07': { '3Q26': 28392.2225, '4Q26': 30413.364, '1Q27': 30620.1024, '2Q27': 31971.1282 },
      },
      opinc: {
        '2023-10-26': { '3Q23': 302.3226, '4Q23': 481.0882, '1Q24': 525.2105, '2Q24': 672.3 },
        '2024-01-31': { '4Q23': 505.2059, '1Q24': 583.2, '2Q24': 727.7742, '3Q24': 880.6129 },
        '2024-05-01': { '1Q24': 620.8529, '2Q24': 778.4, '3Q24': 927.3714, '4Q24': 1156.5405 },
        '2024-07-31': { '2Q24': 792.4571, '3Q24': 916.9412, '4Q24': 1113.1176, '1Q25': 1151.1053 },
        '2024-10-31': { '4Q24': 1224.975, '1Q25': 1165.0323, '2Q25': 1385.2903, '3Q25': 1528.6129 },
        '2025-01-30': { '4Q24': 1196.1026, '1Q25': 1201.4706, '2Q25': 1402.6857, '3Q25': 1539.7059 },
        '2025-05-01': { '1Q25': 1218.9714, '2Q25': 1420.8649, '3Q25': 1561.0811, '4Q25': 1801.0909 },
        '2025-07-31': { '2Q25': 1470.3784, '3Q25': 1591.5, '4Q25': 1828.75, '1Q26': 1785.9474 },
        '2025-10-30': { '3Q25': 1618.075, '4Q25': 1859.1143, '1Q26': 1823.7917, '2Q26': 2071.0435 },
        '2026-01-29': { '4Q25': 1898.0909, '1Q26': 1864.1538, '2Q26': 2097.3182, '3Q26': 2201.3158 },
        '2026-04-30': { '1Q26': 1844.6552, '2Q26': 2062.7647, '3Q26': 2224.4571, '4Q26': 2462 },
        '2026-07-31': { '2Q26': 2110.7407, '3Q26': 2230.5484, '4Q26': 2497.2812, '1Q27': 2449.0556 },
        '2026-08-07': { '3Q26': 2263.5833, '4Q26': 2530.75, '1Q27': 2474.15, '2Q27': 2683.5 },
      },
      ebitda: {
        '2023-10-26': { '3Q23': 1007.075, '4Q23': 1142.2632, '1Q24': 1190.375, '2Q24': 1367.7917 },
        '2024-01-31': { '4Q23': 1221.875, '1Q24': 1245.8529, '2Q24': 1412.7647, '3Q24': 1544.7222 },
        '2024-05-01': { '1Q24': 1315.2, '2Q24': 1471.3714, '3Q24': 1602.8286, '4Q24': 1801.9429 },
        '2024-07-31': { '2Q24': 1502.7632, '3Q24': 1621.6923, '4Q24': 1827.5641, '1Q25': 1883.9524 },
        '2024-10-31': { '4Q24': 1847.3256, '1Q25': 1860.8857, '2Q25': 2060.0882, '3Q25': 2191.1562 },
        '2025-01-30': { '4Q24': 1849.2444, '1Q25': 1841.2051, '2Q25': 2054.8462, '3Q25': 2194 },
        '2025-05-01': { '1Q25': 1838.7, '2Q25': 2047, '3Q25': 2190.1463, '4Q25': 2417.4 },
        '2025-07-31': { '2Q25': 2094.7561, '3Q25': 2222.7209, '4Q25': 2436.3256, '1Q26': 2416.7143 },
        '2025-10-30': { '3Q25': 2270.8511, '4Q25': 2485.7609, '1Q26': 2453.0667, '2Q26': 2737.0345 },
        '2026-01-29': { '4Q25': 2480.9318, '1Q26': 2446.4167, '2Q26': 2700.8919, '3Q26': 2809.5429 },
        '2026-04-30': { '1Q26': 2438.45, '2Q26': 2656.2195, '3Q26': 2802.0976, '4Q26': 3055.1463 },
        '2026-07-31': { '2Q26': 2785.0789, '3Q26': 2884.175, '4Q26': 3335.125, '1Q27': 3091.5 },
        '2026-08-07': { '3Q26': 2928.6905, '4Q26': 3163.8837, '1Q27': 3120.7083, '2Q27': 3388.8261 },
      },
      eps: {   // consensus only from 4Q25 — earlier BBG cells are off-basis
        '2025-05-01': { '4Q25': 0.7521 },
        '2025-07-31': { '4Q25': 0.7708, '1Q26': 0.7868 },
        '2025-10-30': { '4Q25': 0.7882, '1Q26': 0.7856, '2Q26': 0.9 },
        '2026-01-29': { '4Q25': 0.7964, '1Q26': 0.7606, '2Q26': 0.8556, '3Q26': 0.9076 },
        '2026-04-30': { '1Q26': 0.7136, '2Q26': 0.7792, '3Q26': 0.8455, '4Q26': 0.9568 },
        '2026-07-31': { '2Q26': 0.8441, '3Q26': 0.9259, '4Q26': 1.0288, '1Q27': 0.9621 },
        '2026-08-07': { '3Q26': 0.9263, '4Q26': 1.0378, '1Q27': 0.9862, '2Q27': 1.131 },
      },
      trips: {
        '2023-10-26': { '3Q23': 2390.0931, '4Q23': 2459.5277, '1Q24': 2459.0051, '2Q24': 2585.3204 },
        '2024-01-31': { '4Q23': 2539.9033, '1Q24': 2507.2237, '2Q24': 2637.3187, '3Q24': 2927.8999 },
        '2024-05-01': { '1Q24': 2594.4741, '2Q24': 2727.6445, '3Q24': 2876.0559, '4Q24': 3020.904 },
        '2024-07-31': { '2Q24': 2713.6337, '3Q24': 2867.7658, '4Q24': 3014.8888, '1Q25': 2987.4551 },
        '2024-10-31': { '4Q24': 3032.2588, '1Q25': 2988.2168, '2Q25': 3180.1628, '3Q25': 3288.8158 },
        '2025-01-30': { '4Q24': 3015.6652, '1Q25': 2961.5417, '2Q25': 3153.5231, '3Q25': 3283.0913 },
        '2025-05-01': { '1Q25': 2981.8735, '2Q25': 3171.4337, '3Q25': 3279.4677, '4Q25': 3479.0152 },
        '2025-07-31': { '2Q25': 3228.4225, '3Q25': 3326.1125, '4Q25': 3539.3802, '1Q26': 3471.6485 },
        '2025-10-30': { '3Q25': 3389.403, '4Q25': 3593.1501, '1Q26': 3544.7609, '2Q26': 3783.6861 },
        '2026-01-29': { '4Q25': 3663.4375, '1Q26': 3598.6817, '2Q26': 3832.1243, '3Q26': 4054.8218 },
        '2026-04-30': { '1Q26': 3652.2938, '2Q26': 3885.5146, '3Q26': 4094.9069, '4Q26': 4339.9058 },
        '2026-07-31': { '2Q26': 3901.3579, '3Q26': 4115.6825, '4Q26': 4369.924, '1Q27': 4218.3326 },
        '2026-08-07': { '3Q26': 4086.9959, '4Q26': 4337.846, '1Q27': 4213.1155, '2Q27': 4453.7438 },
      },
      },
      y: {
      rev: {
        '2023-10-26': { '2023': 37550.6957, '2024': 44035.9787, '2025': 51233.2703, '2026': 58413, '2027': 66123.1333 },
        '2024-01-31': { '2023': 37141.5714, '2024': 42990.1837, '2025': 49919, '2026': 56834.72, '2027': 64142.7222 },
        '2024-05-01': { '2024': 43417.3617, '2025': 50573.9792, '2026': 58610.2647, '2027': 66755.4444, '2028': 75062 },
        '2024-07-31': { '2024': 43241.8696, '2025': 50162.8696, '2026': 57869.2647, '2027': 65313.7368, '2028': 73889.5385 },
        '2024-10-31': { '2024': 43630.2692, '2025': 50672, '2026': 58522.0238, '2027': 66524.9524, '2028': 75360.8462 },
        '2025-01-30': { '2024': 43758.4038, '2025': 50595.1887, '2026': 58370.9545, '2027': 66556.08, '2028': 75574.2143 },
        '2025-05-01': { '2025': 50333.74, '2026': 57958, '2027': 65985.697, '2028': 73818.0625, '2029': 80554.6154 },
        '2025-07-31': { '2025': 50673.9388, '2026': 57960.84, '2027': 66412.0588, '2028': 74308.625, '2029': 81536.6923 },
        '2025-10-30': { '2025': 51510.2727, '2026': 59634.4, '2027': 67947.8205, '2028': 75850.7368, '2029': 83451.6429 },
        '2026-01-29': { '2025': 51955.6981, '2026': 60499.2545, '2027': 69370.6889, '2028': 78259.0909, '2029': 86897.6111 },
        '2026-04-30': { '2026': 58196.0727, '2027': 66820.7692, '2028': 75702.7812, '2029': 83327.9375, '2030': 92719.3636 },
        '2026-07-31': { '2026': 58162.92, '2027': 66864.54, '2028': 76609.303, '2029': 85289.5294, '2030': 94927.0667 },
        '2026-08-07': { '2026': 57951.5577, '2027': 66797.8269, '2028': 76856.9143, '2029': 85699.1579, '2030': 95700.3125 },
      },
      gb: {
        '2023-10-26': { '2023': 135665.1055, '2024': 158665.3508, '2025': 184004.3319, '2026': 206730.937, '2027': 231391.0678 },
        '2024-01-31': { '2023': 137076.894, '2024': 160252.6498, '2025': 185515.0412, '2026': 208577.395, '2027': 231535.2283 },
        '2024-05-01': { '2024': 163303.759, '2025': 189582.0194, '2026': 217978.7078, '2027': 244987.6359, '2028': 273957.5022 },
        '2024-07-31': { '2024': 162267.9116, '2025': 188321.2477, '2026': 215572.3231, '2027': 242469.7034, '2028': 270214.5359 },
        '2024-10-31': { '2024': 162349.5425, '2025': 188483.7808, '2026': 216759.1819, '2027': 245442.6568, '2028': 273100.0399 },
        '2025-01-30': { '2024': 162125.1803, '2025': 187439.5083, '2026': 215746.4145, '2027': 293104460.9205, '2028': 17028750480550.5 },
        '2025-05-01': { '2025': 186419.2502, '2026': 214038.4654, '2027': 242561.3736, '2028': 271056.077, '2029': 294213.2904 },
        '2025-07-31': { '2025': 188014.097, '2026': 216422.6548, '2027': 245045.4044, '2028': 274570.8424, '2029': 299668.4335 },
        '2025-10-30': { '2025': 190979.7005, '2026': 221827.6411, '2027': 252644.5748, '2028': 285282.306, '2029': 314499.9456 },
        '2026-01-29': { '2025': 192502.4466, '2026': 224978.5602, '2027': 258320.5122, '2028': 291835.5393, '2029': 325734.4689 },
        '2026-04-30': { '2026': 230926.9744, '2027': 266777.3368, '2028': 301207.6046, '2029': 336578.6981, '2030': 373435.3164 },
        '2026-07-31': { '2026': 234383.6444, '2027': 271760.7584, '2028': 307103.0744, '2029': 342261.186, '2030': 380782.31 },
        '2026-08-07': { '2026': 235671.5208, '2027': 273654.871, '2028': 310448.6351, '2029': 347001.2052, '2030': 386769.8209 },
      },
      ebitda: {
        '2023-10-26': { '2023': 3840.4359, '2024': 5634.4222, '2025': 7800.4, '2026': 9838.6, '2027': 11830.5333 },
        '2024-01-31': { '2023': 3993.85, '2024': 5906.9348, '2025': 8085.2632, '2026': 10087.2692, '2027': 12382.4444 },
        '2024-05-01': { '2024': 6164.5455, '2025': 8370.0909, '2026': 10788.0312, '2027': 13119.8, '2028': 15845.0769 },
        '2024-07-31': { '2024': 6294.4762, '2025': 8363.3182, '2026': 10760.5882, '2027': 13118.2222, '2028': 15602.25 },
        '2024-10-31': { '2024': 6473.1064, '2025': 8575.5306, '2026': 10971.7317, '2027': 13542.85, '2028': 16018.1667 },
        '2025-01-30': { '2024': 6490.8723, '2025': 8509.22, '2026': 10901.3571, '2027': 13476.7917, '2028': 16074.3846 },
        '2025-05-01': { '2025': 8471.4043, '2026': 10677.84, '2027': 13228.9118, '2028': 15556.5625, '2029': 17775.1538 },
        '2025-07-31': { '2025': 8581.4091, '2026': 10779.3, '2027': 13250.6471, '2028': 15707.5625, '2029': 17859.6923 },
        '2025-10-30': { '2025': 8750.4375, '2026': 11061.4231, '2027': 13546.9459, '2028': 15749, '2029': 17922.7143 },
        '2026-01-29': { '2025': 8719.0698, '2026': 10983.4038, '2027': 13424.3256, '2028': 15719.6364, '2029': 18177.2222 },
        '2026-04-30': { '2026': 10864.1667, '2027': 13077.0204, '2028': 16039.3793, '2029': 18308.9231, '2030': 20604.2 },
        '2026-07-31': { '2026': 11381.6667, '2027': 13539.6809, '2028': 16260.6364, '2029': 18742, '2030': 21161 },
        '2026-08-07': { '2026': 11394.0652, '2027': 13646.1176, '2028': 16385.6757, '2029': 18713.2, '2030': 21185 },
      },
      opinc: {
        '2023-10-26': { '2023': 824.8333, '2024': 3112.65, '2025': 5108.1714, '2026': 6898.0556, '2027': 8186 },
        '2024-01-31': { '2023': 983.2368, '2024': 3176.0976, '2025': 5190.9722, '2026': 6915.76, '2027': 8734.6471 },
        '2024-05-01': { '2024': 3442.4359, '2025': 5700.025, '2026': 7904.0312, '2027': 9629.625, '2028': 11587.9167 },
        '2024-07-31': { '2024': 3051.9459, '2025': 5637.7105, '2026': 7902.8438, '2027': 9944.8667, '2028': 12265.8 },
        '2024-10-31': { '2024': 3195.2857, '2025': 6043.2045, '2026': 8499.9211, '2027': 10658.6111, '2028': 12983.8182 },
        '2025-01-30': { '2024': 3216.8, '2025': 6072.2619, '2026': 8558.0278, '2027': 10575.0952, '2028': 12891.9091 },
        '2025-05-01': { '2025': 5973.7568, '2026': 8245, '2027': 10388, '2028': 12571.0714, '2029': 14752 },
        '2025-07-31': { '2025': 5994.4286, '2026': 8400.6316, '2027': 10756.3793, '2028': 12694.6429, '2029': 14746.1818 },
        '2025-10-30': { '2025': 6103.4419, '2026': 8490.1778, '2027': 11043.1429, '2028': 12903.9444, '2029': 14991.0769 },
        '2026-01-29': { '2025': 6165, '2026': 8623.2333, '2027': 11039.3704, '2028': 13229.4615, '2029': 15615.6 },
        '2026-04-30': { '2026': 8604, '2027': 10784.5476, '2028': 13375.3704, '2029': 15549.1538, '2030': 17853.8333 },
        '2026-07-31': { '2026': 8778.2308, '2027': 11009.95, '2028': 13377.3462, '2029': 15833.625, '2030': 18264.1333 },
        '2026-08-07': { '2026': 8811.9091, '2027': 11083.8636, '2028': 13593.9, '2029': 15785.5294, '2030': 18282 },
      },
      eps: {
        '2023-10-26': { '2023': 0.3716, '2024': 1.1065, '2025': 1.8587, '2026': 2.66, '2027': 3.1473 },
        '2024-01-31': { '2023': 0.38, '2024': 1.1703, '2025': 1.9581, '2026': 2.7643, '2027': 3.4538 },
        '2024-05-01': { '2024': 1.3633, '2025': 2.1854, '2026': 3.0912, '2027': 3.525, '2028': 4.0282 },
        '2024-07-31': { '2024': 0.8908, '2025': 2.1333, '2026': 3.1516, '2027': 3.9392, '2028': 4.5488 },
        '2024-10-31': { '2024': 1.7102, '2025': 2.4289, '2026': 3.4717, '2027': 4.2478, '2028': 4.94 },
        '2025-01-30': { '2024': 1.9236, '2025': 2.3978, '2026': 3.3358, '2027': 4.2415, '2028': 5.0817 },
        '2025-05-01': { '2025': 2.4095, '2026': 3.4136, '2027': 4.4372, '2028': 5.0727, '2029': 6.0892 },
        '2025-07-31': { '2025': 2.871, '2026': 3.516, '2027': 4.515, '2028': 5.07, '2029': 5.905 },
        '2025-10-30': { '2025': 2.9258, '2026': 3.5836, '2027': 4.5819, '2028': 5.1871, '2029': 6.1885 },
        '2026-01-29': { '2025': 5.3631, '2026': 3.5627, '2027': 4.6076, '2028': 5.243, '2029': 6.3394 },
        '2026-04-30': { '2026': 3.298, '2027': 4.3136, '2028': 5.4667, '2029': 6.6671, '2030': 7.56 },
        '2026-07-31': { '2026': 2.9122, '2027': 4.5238, '2028': 5.5781, '2029': 6.9127, '2030': 7.9377 },
        '2026-08-07': { '2026': 3.1786, '2027': 4.6328, '2028': 5.6672, '2029': 6.9835, '2030': 8.0971 },
      },
      },
    },
    // The SUMMIT side. Generated by scripts/consensus/emit_summit_matrix.py from one
    // get_fundamentals(sheet_sources=['projection_history']) pull per model snapshot. Five usable
    // vintages: the nine stored snapshots dedupe by facts_hash (2026-05-06 == 2026-05-07), 2026-07-17
    // and 2026-08-03 are intra-period saves, and 2026-07-20 is unusable (Delivery-Hero pro-forma
    // toggle ON). Each row holds ONLY the periods forward of that snapshot's own last reported one —
    // a snapshot is an estimate for nothing it already knew. May 7 and Jul 31 carry identical
    // projections: the model did not move these lines between those two saves.
    // Zeros are dropped, never emitted: a literal 0 here means a row that was never populated
    // (the Aug-5 EBITDA/FCF rows, every 2030 column in the older files). That is why `preprint`
    // lands on Jul 31 for forward EBITDA — exactly what the hand-built column already did.
    // Annual `trips` and `fcf` are deliberately absent (model-audit list, see the header note).
    summit: {
      vintages: [
        { id: '2025-12-15', label: 'Dec 15, 2025', lastActual: { q: '3Q25', y: '2024' } },
        { id: '2026-02-05', label: 'Feb 5, 2026', lastActual: { q: '4Q25', y: '2025' } },
        { id: '2026-05-07', label: 'May 7, 2026', lastActual: { q: '1Q26', y: '2025' } },
        { id: '2026-07-31', label: 'Jul 31, 2026', lastActual: { q: '1Q26', y: '2025' } },
        { id: '2026-08-05', label: 'Aug 5, 2026', lastActual: { q: '2Q26', y: '2025' } },
      ],
      q: {
      rev: {
        '2025-12-15': { '4Q25': 14462.3, '1Q26': 12642.2, '2Q26': 13790, '3Q26': 14572, '4Q26': 15741.7, '1Q27': 15025.1 },
        '2026-02-05': { '1Q26': 14014.2, '2Q26': 14964, '3Q26': 15827.7, '4Q26': 17165.8, '1Q27': 15623.6 },
        '2026-05-07': { '2Q26': 14222.8, '3Q26': 14931.9, '4Q26': 16337.4, '1Q27': 15916.2 },
        '2026-07-31': { '2Q26': 14222.8, '3Q26': 14931.9, '4Q26': 16337.4, '1Q27': 15916.2 },
        '2026-08-05': { '3Q26': 15168.9, '4Q26': 16574.4, '1Q27': 16212.5 },
      },
      gb: {
        '2025-12-15': { '4Q25': 53848.8, '1Q26': 50158.9, '2Q26': 54815.5, '3Q26': 58260.5, '4Q26': 63109.4, '1Q27': 59084.4 },
        '2026-02-05': { '1Q26': 52987.8, '2Q26': 56691, '3Q26': 60283.7, '4Q26': 65691.6, '1Q27': 62354.8 },
        '2026-05-07': { '2Q26': 57807, '3Q26': 60852.9, '4Q26': 66307.5, '1Q27': 63231.1 },
        '2026-07-31': { '2Q26': 57807, '3Q26': 60852.9, '4Q26': 66307.5, '1Q27': 63231.1 },
        '2026-08-05': { '3Q26': 61089.9, '4Q26': 66544.5, '1Q27': 63527.3 },
      },
      mobgb: {
        '2025-12-15': { '4Q25': 27585.6, '1Q26': 25418.4, '2Q26': 28514.4, '3Q26': 30133.2, '4Q26': 33102.7, '1Q27': 30502.1 },
        '2026-02-05': { '1Q26': 25842, '2Q26': 28039.2, '3Q26': 29631, '4Q26': 32381.6, '1Q27': 31010.4 },
        '2026-05-07': { '2Q26': 28870.8, '3Q26': 30133.2, '4Q26': 32930.4, '1Q27': 31672.8 },
        '2026-07-31': { '2Q26': 28870.8, '3Q26': 30133.2, '4Q26': 32930.4, '1Q27': 31672.8 },
        '2026-08-05': { '3Q26': 30133.2, '4Q26': 32930.4, '1Q27': 31672.8 },
      },
      mobrev: {
        '2025-12-15': { '4Q25': 8413.6, '1Q26': 7117.2, '2Q26': 7984, '3Q26': 8437.3, '4Q26': 9268.8, '1Q27': 8540.6 },
        '2026-02-05': { '1Q26': 7752.6, '2Q26': 8411.7, '3Q26': 8889.3, '4Q26': 9714.5, '1Q27': 8682.9 },
        '2026-05-07': { '2Q26': 7506.4, '3Q26': 7864.8, '4Q26': 8594.8, '1Q27': 8868.4 },
        '2026-07-31': { '2Q26': 7506.4, '3Q26': 7864.8, '4Q26': 8594.8, '1Q27': 8868.4 },
        '2026-08-05': { '3Q26': 7864.8, '4Q26': 8594.8, '1Q27': 8868.4 },
      },
      delgb: {
        '2025-12-15': { '4Q25': 24956.2, '1Q26': 23433.5, '2Q26': 24994.1, '3Q26': 26820.3, '4Q26': 28699.7, '1Q27': 26948.6 },
        '2026-02-05': { '1Q26': 25878.8, '2Q26': 27384.8, '3Q26': 29385.7, '4Q26': 32043.1, '1Q27': 29760.6 },
        '2026-05-07': { '2Q26': 27602.2, '3Q26': 29385.7, '4Q26': 32043.1, '1Q27': 29890.8 },
        '2026-07-31': { '2Q26': 27602.2, '3Q26': 29385.7, '4Q26': 32043.1, '1Q27': 29890.8 },
        '2026-08-05': { '3Q26': 29385.7, '4Q26': 32043.1, '1Q27': 29890.8 },
      },
      delrev: {
        '2025-12-15': { '4Q25': 4741.7, '1Q26': 4218, '2Q26': 4498.9, '3Q26': 4827.7, '4Q26': 5165.9, '1Q27': 4850.7 },
        '2026-02-05': { '1Q26': 4994.6, '2Q26': 5285.3, '3Q26': 5671.4, '4Q26': 6184.3, '1Q27': 5356.9 },
        '2026-05-07': { '2Q26': 5382.4, '3Q26': 5733.2, '4Q26': 6408.6, '1Q27': 5380.3 },
        '2026-07-31': { '2Q26': 5382.4, '3Q26': 5733.2, '4Q26': 6408.6, '1Q27': 5380.3 },
        '2026-08-05': { '3Q26': 5733.2, '4Q26': 6408.6, '1Q27': 5380.3 },
      },
      frgb: {
        '2025-12-15': { '4Q25': 1307, '1Q26': 1307, '2Q26': 1307, '3Q26': 1307, '4Q26': 1307, '1Q27': 1633.8 },
        '2026-02-05': { '1Q26': 1267, '2Q26': 1267, '3Q26': 1267, '4Q26': 1267, '1Q27': 1583.8 },
        '2026-05-07': { '2Q26': 1334, '3Q26': 1334, '4Q26': 1334, '1Q27': 1667.5 },
        '2026-07-31': { '2Q26': 1334, '3Q26': 1334, '4Q26': 1334, '1Q27': 1667.5 },
        '2026-08-05': { '3Q26': 1571, '4Q26': 1571, '1Q27': 1963.8 },
      },
      opinc: {
        '2026-02-05': { '1Q26': 1735.7, '2Q26': 2081.2, '3Q26': 2271, '4Q26': 2576.3, '1Q27': 2631.7 },
        '2026-05-07': { '2Q26': 2192.2, '3Q26': 2363.5, '4Q26': 2683.3, '1Q27': 2701.4 },
        '2026-07-31': { '2Q26': 2192.2, '3Q26': 2363.5, '4Q26': 2683.3, '1Q27': 2701.4 },
        '2026-08-05': { '3Q26': 2370, '4Q26': 2690, '1Q27': 2717 },
      },
      ebitda: {
        '2025-12-15': { '4Q25': 2517.2, '1Q26': 2143.4, '2Q26': 2662.9, '3Q26': 2869.7, '4Q26': 3182.9, '1Q27': 2956.4 },
        '2026-02-05': { '1Q26': 2389.1, '2Q26': 2647.6, '3Q26': 2836.8, '4Q26': 3147.4, '1Q27': 2995.2 },
        '2026-05-07': { '2Q26': 2794.8, '3Q26': 2960.4, '4Q26': 3310.6, '1Q27': 3135.6 },
        '2026-07-31': { '2Q26': 2794.8, '3Q26': 2960.4, '4Q26': 3310.6, '1Q27': 3135.6 },
      },
      eps: {
        '2025-12-15': { '4Q25': 0.6151, '1Q26': 0.5144, '2Q26': 0.6708, '3Q26': 0.7282, '4Q26': 0.8083, '1Q27': 0.7506 },
        '2026-02-05': { '1Q26': 0.6694, '2Q26': 0.8107, '3Q26': 0.8936, '4Q26': 1.024, '1Q27': 1.1113 },
        '2026-05-07': { '2Q26': 0.8273, '3Q26': 0.9055, '4Q26': 1.0437, '1Q27': 1.1599 },
        '2026-07-31': { '2Q26': 0.8273, '3Q26': 0.9055, '4Q26': 1.0437, '1Q27': 1.1599 },
        '2026-08-05': { '3Q26': 0.9036, '4Q26': 1.0413, '1Q27': 1.161 },
      },
      fcf: {
        '2025-12-15': { '4Q25': 2693.4, '1Q26': 2293.4, '2Q26': 2316.7, '3Q26': 2496.7, '4Q26': 2769.2, '1Q27': 2572.1 },
        '2026-02-05': { '1Q26': 2448.7, '2Q26': 2921.3, '3Q26': 2877.6, '4Q26': 3148.4, '1Q27': 3335.1 },
        '2026-05-07': { '2Q26': 2589.1, '3Q26': 2756.9, '4Q26': 3032.5, '1Q27': 3202.2 },
        '2026-07-31': { '2Q26': 2589.1, '3Q26': 2756.9, '4Q26': 3032.5, '1Q27': 3202.2 },
      },
      trips: {
        '2025-12-15': { '4Q25': 3645.6, '1Q26': 3624.3, '2Q26': 3837.5, '3Q26': 4029.4, '4Q26': 4083.1, '1Q27': 4059.2 },
        '2026-02-05': { '1Q26': 3653.1, '2Q26': 3868, '3Q26': 4061.4, '4Q26': 4340.8, '1Q27': 4091.5 },
        '2026-05-07': { '2Q26': 3826.5, '3Q26': 4017.8, '4Q26': 4294.2, '1Q27': 4049.6 },
        '2026-07-31': { '2Q26': 4040.7, '3Q26': 4242.8, '4Q26': 4534.6, '1Q27': 4276.3 },
        '2026-08-05': { '3Q26': 4202, '4Q26': 4491, '1Q27': 4235.3 },
      },
      mapc: {
        '2025-12-15': { '4Q25': 191.5, '1Q26': 190.4, '2Q26': 201.6, '3Q26': 211.7, '4Q26': 214.5, '1Q27': 213.2 },
        '2026-02-05': { '1Q26': 190.4, '2Q26': 201.6, '3Q26': 211.7, '4Q26': 226.2, '1Q27': 213.2 },
        '2026-05-07': { '2Q26': 210.6, '3Q26': 221.1, '4Q26': 236.3, '1Q27': 222.9 },
        '2026-07-31': { '2Q26': 210.6, '3Q26': 221.1, '4Q26': 236.3, '1Q27': 222.9 },
        '2026-08-05': { '3Q26': 221.1, '4Q26': 236.3, '1Q27': 222.9 },
      },
      },
      y: {
      rev: {
        '2025-12-15': { '2025': 52113.3, '2026': 61688.9, '2027': 73404.8, '2028': 81964.4, '2029': 98410.2 },
        '2026-02-05': { '2026': 61971.8, '2027': 72490.4, '2028': 82203.1, '2029': 98519.3 },
        '2026-05-07': { '2026': 58695.2, '2027': 68127.7, '2028': 78362, '2029': 93642.3 },
        '2026-07-31': { '2026': 58695.2, '2027': 68127.7, '2028': 78362, '2029': 93642.3, '2030': 112296.2 },
        '2026-08-05': { '2026': 59137.4, '2027': 68838.9, '2028': 79079.9, '2029': 94365.4, '2030': 113026.5 },
      },
      gb: {
        '2025-12-15': { '2025': 193162.8, '2026': 231672.7, '2027': 279168, '2028': 334333.5, '2029': 401288.9 },
        '2026-02-05': { '2026': 235654.2, '2027': 284029.2, '2028': 339432.9, '2029': 406537.1 },
        '2026-05-07': { '2026': 238687.4, '2027': 287559, '2028': 343736.8, '2029': 411802.5 },
        '2026-07-31': { '2026': 238687.4, '2027': 287559, '2028': 343736.8, '2029': 411802.5, '2030': 494404.4 },
        '2026-08-05': { '2026': 239376.4, '2027': 288233.1, '2028': 344419.1, '2029': 412497.6, '2030': 495118.5 },
      },
      mobgb: {
        '2025-12-15': { '2025': 97640.6, '2026': 117168.7, '2027': 140602.4, '2028': 175753, '2029': 219691.3 },
        '2026-02-05': { '2026': 115893.7, '2027': 135595.7, '2028': 169494.6, '2029': 211868.2 },
        '2026-05-07': { '2026': 118328.4, '2027': 138444.3, '2028': 173055.3, '2029': 216319.2 },
        '2026-07-31': { '2026': 118328.4, '2027': 138444.3, '2028': 173055.3, '2029': 216319.2, '2030': 270399 },
        '2026-08-05': { '2026': 118445.6, '2027': 138581.4, '2028': 173226.7, '2029': 216533.4, '2030': 270666.7 },
      },
      mobrev: {
        '2025-12-15': { '2025': 29879.6, '2026': 36322.3, '2027': 43586.8, '2028': 49210.9, '2029': 61513.6 },
        '2026-02-05': { '2026': 34768.1, '2027': 39322.7, '2028': 47458.5, '2029': 59323.1 },
        '2026-05-07': { '2026': 30764, '2027': 34611.1, '2028': 43263.8, '2029': 54079.8 },
        '2026-07-31': { '2026': 30764, '2027': 34611.1, '2028': 43263.8, '2029': 54079.8, '2030': 67599.7 },
        '2026-08-05': { '2026': 30620.6, '2027': 34645.3, '2028': 43306.7, '2029': 54133.3, '2030': 67666.7 },
      },
      delgb: {
        '2025-12-15': { '2025': 90389.2, '2026': 109371, '2027': 133432.6, '2028': 153447.5, '2029': 176464.6 },
        '2026-02-05': { '2026': 114692.4, '2027': 143365.5, '2028': 164870.3, '2029': 189600.9 },
        '2026-05-07': { '2026': 115023, '2027': 143778.7, '2028': 165345.5, '2029': 190147.3 },
        '2026-07-31': { '2026': 115023, '2027': 143778.7, '2028': 165345.5, '2029': 190147.3, '2030': 218669.4 },
        '2026-08-05': { '2026': 114883.8, '2027': 143604.7, '2028': 165145.4, '2029': 189917.2, '2030': 218404.8 },
      },
      delrev: {
        '2025-12-15': { '2025': 17097.7, '2026': 20233.6, '2027': 24685, '2028': 27620.5, '2029': 31763.6 },
        '2026-02-05': { '2026': 22135.6, '2027': 28099.6, '2028': 29676.7, '2029': 34128.2 },
        '2026-05-07': { '2026': 22592.2, '2027': 28180.6, '2028': 29762.2, '2029': 34226.5 },
        '2026-07-31': { '2026': 22592.2, '2027': 28180.6, '2028': 29762.2, '2029': 34226.5, '2030': 39360.5 },
        '2026-08-05': { '2026': 22454.8, '2027': 28146.5, '2028': 29726.2, '2029': 34185.1, '2030': 39312.9 },
      },
      frgb: {
        '2025-12-15': { '2025': 5133, '2026': 5133, '2027': 5133, '2028': 5133, '2029': 5133 },
        '2026-02-05': { '2026': 5068, '2027': 5068, '2028': 5068, '2029': 5068 },
        '2026-05-07': { '2026': 5336, '2027': 5336, '2028': 5336, '2029': 5336 },
        '2026-07-31': { '2026': 5336, '2027': 5336, '2028': 5336, '2029': 5336, '2030': 5336 },
        '2026-08-05': { '2026': 6047, '2027': 6047, '2028': 6047, '2029': 6047, '2030': 6047 },
      },
      opinc: {
        '2026-02-05': { '2026': 8664.2, '2027': 10945, '2028': 15375.6, '2029': 19700.9 },
        '2026-05-07': { '2026': 9122, '2027': 11465.7, '2028': 15727.2, '2029': 20090.5 },
        '2026-07-31': { '2026': 9653.3, '2027': 11465.7, '2028': 15727.2, '2029': 20090.5, '2030': 25457.3 },
        '2026-08-05': { '2026': 9581.7, '2027': 11491.6, '2028': 15775.6, '2029': 20141.4, '2030': 25511.3 },
      },
      ebitda: {
        '2025-12-15': { '2025': 8760.2, '2026': 11451.1, '2027': 15335, '2028': 17831.5, '2029': 22251.9 },
        '2026-02-05': { '2026': 11021, '2027': 13643.6, '2028': 17486, '2029': 21853.5 },
        '2026-05-07': { '2026': 11546.7, '2027': 14817.4, '2028': 17397.3, '2029': 21495.5 },
        '2026-07-31': { '2026': 11546.7, '2027': 14817.4, '2028': 17397.3, '2029': 21495.5, '2030': 26517.3 },
      },
      eps: {
        '2025-12-15': { '2025': 2.023, '2026': 2.9952, '2027': 4.3957, '2028': 6.0979, '2029': 8.0586 },
        '2026-02-05': { '2026': 3.3657, '2027': 4.4503, '2028': 6.9734, '2029': 9.4053 },
        '2026-05-07': { '2026': 3.4595, '2027': 4.7403, '2028': 7.2525, '2029': 9.7523 },
        '2026-07-31': { '2026': 3.7196, '2027': 4.7403, '2028': 7.2525, '2029': 9.7523, '2030': 13.0079 },
        '2026-08-05': { '2026': 3.6808, '2027': 4.728, '2028': 7.2398, '2029': 9.7298, '2030': 12.9725 },
      },
      mapc: {
        '2025-12-15': { '2025': 191.5, '2026': 214.5, '2027': 240.2, '2028': 269.1, '2029': 301.4 },
        '2026-02-05': { '2026': 226.2, '2027': 253.4, '2028': 283.8, '2029': 317.9 },
        '2026-05-07': { '2026': 236.3, '2027': 264.7, '2028': 296.5, '2029': 332 },
        '2026-07-31': { '2026': 236.3, '2027': 264.7, '2028': 296.5, '2029': 332, '2030': 371.9 },
        '2026-08-05': { '2026': 236.3, '2027': 264.7, '2028': 296.5, '2029': 332, '2030': 371.9 },
      },
      },
    },
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
  // No surprise scorecard on the Setup chart: it is a single pre-print view of the NEXT
  // quarter, so "how did the print land" has nothing to score yet. (It also kept a second,
  // hidden copy of that block in the DOM with the same element ids as the real one.)
  surprise: false,
  views: {
    q: { label: 'Quarterly', note: 'Rolling \u2014 the last 8 reported quarters plus the one next (forecast) quarter. ' + uberResults.views.q.note,
         metrics: sliceMetrics(uberResults.views.q, qIdx), sections: mergedSection(uberResults.views.q) },
    y: { label: 'Annual', note: 'Rolling \u2014 the last 4 fiscal years plus the next 2 forward years. ' + uberResults.views.y.note,
         metrics: sliceMetrics(uberResults.views.y, yIdx), sections: mergedSection(uberResults.views.y) }
  }
};
