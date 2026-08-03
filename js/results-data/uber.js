// results-data/uber.js - Uber (UBER) dataset for the standardized "Results" tab + the merged
// "Setup" chart (uberSetup). Reconstructed from the rolling BBG_CONSENSUS.txt archive
// (G:\My Drive\Summit\Docs\0\, newest data_as_of 2026-07-30) and the Summit projection model
// (MCP Summit_Financial_Data, snapshot 2026-07-20). All monetary values are US$ MILLIONS
// (unit 'usdM' -> engine divides by 1000 for $B); EPS in dollars. null = not available.
// Generated + hand-reconciled; do not hand-edit the number arrays.
//
//   act    = reported actuals (archive fq0/fq-3/fy0, freshest snapshot). NOTE: Freight (GB and EBITDA)
//            and the Mobility/Delivery segment Adj. EBITDA lines were REMOVED — not among the
//            BBG-txt-authorized KPIs (no BBG consensus line); a KPI existing in the DCF/overview does
//            NOT make it valid.
//   cons   = Street consensus going in (shortest-horizon fq+N before the print; forward carries
//            the latest fq+N / fy+N).
//   summit = Summit's own forecast (MCP projection_history), plotted on forward periods PLUS the
//            "going-in" estimate for recently-reported quarters — the last forecast before each print,
//            for a Summit-vs-actual audit trail: 4Q25 = $14,462M (Dec-15 snapshot, vs $14,366M actual),
//            1Q26 = $14,014M (Feb-05 snapshot, vs $13,203M actual — the UK-accounting miss). Only 4Q25 &
//            1Q26 carry a going-in value: the MCP's oldest snapshot is 2025-12-15, so older quarters
//            have no pre-print snapshot to read. The earlier DHER (Delivery Hero) pro-forma toggle — which
//            inflated Delivery GB to ~$150B and Revenue to ~$68B FY25 — is now OFF, so the model
//            reconciles 1:1 with reported: Revenue FY25 $52.0B exact, Delivery GB $89.3B, EBITDA
//            $8.73B exact. Filled on Revenue, Mobility/Delivery GB, EBITDA, segment EBITDA, and Op
//            income (quarterly). Left NULL only where the model is a genuinely different basis or is
//            not modeled forward:
//              * EPS is the Non-GAAP (ADJUSTED) line end-to-end. act = the reported ADJ_EPS (kpi5 / MCP
//                      UBER:adj_eps actuals_history, e.g. 4Q25 $0.71, 1Q26 $0.72); summit = Summit's ADJ_EPS;
//                      cons = the txt's adj-EPS consensus. FIX (Aug 2026): act had been mistakenly pulled from
//                      the GAAP `eps` header column (whipsawed by equity-stake marks — 4Q24 $3.21, 3Q25 $3.11,
//                      4Q25 $0.14) — re-sourced from adj_eps so all three series share the Non-GAAP basis.
//                      Pre-2024 quarters carry no adj_eps in the model → null (not the GAAP figure).
//              * Op income (annual) - the model carries op income quarterly, not as a forward annual line.
//   RE-SOURCE (Jul 2026): EPS switched to Non-GAAP (adj); MAPCs removed from the tracked KPI set (no
//   longer in the txt); a total Gross Bookings line ('gb' = Mobility+Delivery+Freight, reported/Summit)
//   was ADDED even though Freight stays excluded as its own line. Its Street consensus IS carried by
//   Bloomberg (the txt's total_gross_bookings / INTERNET_GROSS_BOOKINGS line — a true total incl.
//   Freight, ~$1.3B/qtr above Mobility+Delivery), so gb.cons is now WIRED from the newest snapshot
//   (forward quarters + annual). Historical quarterly gb.cons stays null pending the rolling-archive
//   backfill (same provenance as rev/mobgb/delgb). Guidance ($56.25–57.75B, Q2 2026) COEXISTS with
//   consensus on the gb line — it does not replace it.
//            ⚠ The MCP snapshot (2026-07-20) is STILL on the old toggled basis — wire from the local
//            xlsm, NOT the MCP, until a post-fix snapshot is re-parsed.
//   guideLo/guideHi = WIRED for Q2 2026 from Uber's Q1 2026 release Financial Outlook: Adjusted EBITDA
//            $2.70-2.80B, Non-GAAP EPS $0.78-0.82, and total Gross Bookings $56.25-57.75B (on the 'gb'
//            line). Uber guides exactly those three, quarterly / next-quarter only — NOT revenue, segment
//            GB or op income, which correctly render "No guidance". Sourced from the release (the DCF's
//            own guidance rows are 0 = not entered). Never assume no guidance (EARNINGS_CONVENTIONS §5 r5).

export var uberResults = {
  updated: 'Jul 2026',
  intro: 'How Uber\u2019s reported results have stacked up against Street consensus, per metric \u2014 quarterly and annual, with growth and margins. Street + reported actuals reconstructed from the rolling Bloomberg archive (BBG_CONSENSUS.txt); Summit is our own model, plotted on the forward periods where it shares the reported basis. Periods marked \u201cest.\u201d are forward (no actual yet).',
  source: 'Street consensus + reported actuals from BBG_CONSENSUS.txt (Bloomberg BEst archive, newest snapshot 2026-07-30). Summit estimates from the Summit_Financial_Data model (snapshot 2026-07-20).',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Reported actuals and the Street consensus that stood one quarter out, from the rolling Bloomberg archive. Summit is on the forward quarters, on the lines where it shares the reported basis.',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [8343, 8607, 8823, 9230, 9292, 9936, 10131, 10700, 11188, 11959, 11533, 12651, 13467, 14366, 13203, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 14462, 14014, 14223, 14932, 16337, 15916],
          cons:   [null, null, null, null, 9536, 9779, 10108, 10580, 10951, 11770, 11614, 12475, 13264, 14294, 13332, 14242, 14821, 15821, 15355],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        gb: { label: 'Gross Bookings (Total)', short: 'Total GB', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [27368, 30749, 31408, 33601, 35281, 37575, 37651, 39952, 40973, 44197, 42818, 46756, 49740, 54140, 53720, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 53849, 52988, 57807, 60853, 66307, 63231],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 57159, 59313, 63938, 62536],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 56250, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 57750, null, null, null] },
        mobgb: { label: 'Mobility Gross Bookings', short: 'Mobility GB', group: 'Mobility', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14894, 14981, 16728, 17903, 19285, 18670, 20554, 21002, 22798, 21182, 23762, 25111, 27442, 26394, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 27586, 25842, 28871, 30133, 32930, 31673],
          cons:   [null, null, null, null, 17383, 19113, 19135, 20359, 21539, 22525, 21470, 23910, 24849, 27135, 25845, 28936, 29870, 32408, 30684],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delgb: { label: 'Delivery Gross Bookings', short: 'Delivery GB', group: 'Delivery', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14315, 15026, 15595, 16094, 17011, 17699, 18126, 18663, 20126, 20377, 21734, 23322, 25431, 25992, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 24956, 25879, 27602, 29386, 32043, 29891],
          cons:   [null, null, null, null, 15796, 16755, 17524, 18111, 18472, 19682, 20236, 21212, 22839, 24753, 25758, 26965, 28069, 30161, 30490],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-495, -142, -262, 326, 394, 652, 821, 942, 1073, 1254, 1326, 1534, 1675, 1918, 1883, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 1823, 1688, 2084, 2214, 2494, 2340],
          cons:   [null, null, null, null, 302, 505, 621, 792, 917, 1196, 1219, 1470, 1618, 1898, 1845, 2111, 2231, 2497, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [516, 665, 761, 916, 1092, 1283, 708, 1570, 1690, 1842, 1868, 2119, 2256, 2487, 2481, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 2517, 2389, 2795, 2960, 3311, 3136],
          cons:   [null, null, null, null, 1007, 1222, 1315, 1503, 1622, 1849, 1839, 2095, 2271, 2481, 2438, 2785, 2884, 3335, 3092],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2700, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2800, null, null, null] },
        eps: { label: 'EPS (Non-GAAP, adj.)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, null, null, null, null, null, 0.37, 0.41, 0.52, 0.56, 0.51, 0.6, 0.65, 0.71, 0.72, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, 0.62, 0.67, 0.83, 0.91, 1.04, 1.16],
          cons:   [null, null, null, null, 0.219, 0.267, 0.282, 0.405, null, 0.523, 0.542, 0.843, 0.911, 0.739, 0.702, 0.809, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.78, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.82, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev', 'gb'] },
          { label: 'Mobility', keys: ['mobgb'] },
          { label: 'Delivery', keys: ['delgb'] },
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['opinc', 'ebitda', 'eps'] },
        ] }
      ],
    },
    y: {
      label: 'Annual',
      note: 'Fiscal-year actuals and the Street consensus stored in the archive; Summit forecast on the open years (basis-matched lines only).',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [31877, 37281, 43978, 52017, null, null, null, null, null],
          summit: [null, null, null, null, 58695, 68128, 78362, 93642, 112296],
          cons:   [null, 37142, 43758, 51956, 58163, 66865, 76609, 85290, 94927],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        gb: { label: 'Gross Bookings (Total)', short: 'Total GB', group: 'Totals', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [null, null, null, 193535, null, null, null, null, null],
          summit: [null, null, null, null, 238687, 287559, 343737, 411802, 494404],
          cons:   [null, null, null, 193454, 234384, 271761, 307103, 342261, 380782],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mobgb: { label: 'Mobility Gross Bookings', short: 'Mobility GB', group: 'Mobility', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [52665, 68897, 83024, 97497, null, null, null, null, null],
          summit: [null, null, null, null, 118328, 138444, 173055, 216319, 270399],
          cons:   [null, 68422, 82728, 97190, 117651, 135960, 154706, 171847, 190993],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        delgb: { label: 'Delivery Gross Bookings', short: 'Delivery GB', group: 'Delivery', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [55778, 63726, 74614, 90864, null, null, null, null, null],
          summit: [null, null, null, null, 115023, 143779, 165346, 190147, 218669],
          cons:   [null, 63552, 74230, 90218, 111248, 129636, 147972, 164476, 183604],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [-1832, 1110, 3977, 6453, null, null, null, null, null],
          summit: [null, null, null, null, 8485, 10744, 13004, 15684, null],
          cons:   [null, 983, 3217, 6165, 8778, 11010, 13377, 15834, 18264],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [1713, 4052, 6484, 8730, null, null, null, null, null],
          summit: [null, null, null, null, 11547, 14817, 17397, 21495, 26517],
          cons:   [null, 3994, 6491, 8719, 11382, 13540, 16261, 18742, 21161],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        eps: { label: 'EPS (Non-GAAP, adj.)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [null, null, 1.86, 2.47, null, null, null, null, null],
          summit: [null, null, null, null, 3.72, 4.74, 7.25, 9.75, 13.01],
          cons:   [null, 0.7, 2.115, 2.873, 3.311, 4.45, 5.487, 6.565, 7.441],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev', 'gb'] },
          { label: 'Mobility', keys: ['mobgb'] },
          { label: 'Delivery', keys: ['delgb'] },
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['opinc', 'ebitda', 'eps'] },
        ] }
      ],
    }
  },
  // Estimate EVOLUTION across model snapshots (vintages) — how the ANNUAL forecast for each fiscal
  // year moved as prints landed. Source: the Summit MCP (Summit_Financial_Data) projection_history
  // sheet, one column per snapshot. The 2026-07-20 snapshot is EXCLUDED (its DHER toggle was ON,
  // inflating every line — Revenue FY25 $67.9B vs the $52.0B standalone; see the header note); the
  // other snapshots are on the clean standalone basis and reconcile 1:1 with the Results forward
  // numbers. Arrays: one row per fiscal year (parallel to `years`), one value per vintage. cons is
  // null — no per-snapshot BBG line is wired yet (the model stores REV_BBG_EST / EBITDA_BBG_EST for
  // a future pass). The May/Jul-17/Jul-31 columns are identical: the model has not re-forecast since May.
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year’s Summit estimate across the model’s saved snapshots. The story: the May 2026 snapshot cut the revenue line (a UK accounting change that lowered reported revenue ~$1B/quarter), and the model has held its projections flat through the two July snapshots since — the forecast has not moved since May.',
    vintages: [
      { label: 'Dec 15, 2025', event: 'pre-4Q25 print' },
      { label: 'Feb 5, 2026',  event: 'post-4Q25 print' },
      { label: 'May 7, 2026',  event: 'post-1Q26 print' },
      { label: 'Jul 17, 2026', event: 'pre-2Q26' },
      { label: 'Jul 31, 2026', event: 'pre-2Q26 print' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Totals', keys: ['rev'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'ebitda', groups: [
        { label: 'Company', keys: ['ebitda'] }
      ] }
    ],
    metrics: {
      rev: { label: 'Revenue (Total)', unit: 'usdM',
        summit: [[61689, 61972, 58695, 58695, 58695], [73405, 72490, 68128, 68128, 68128], [81964, 82203, 78362, 78362, 78362], [98410, 98519, 93642, 93642, 93642]],
        cons: null,
        prior: { summit: [52113, 52017, 52017, 52017, 52017] },
        note: 'The May 2026 snapshot cut every forward year: FY26 $62.0B → $58.7B (−5%), FY27 $72.5B → $68.1B, FY29 $98.5B → $93.6B — the model absorbing the UK accounting change that lowered reported revenue. The two July snapshots did not touch it, so the May / Jul 17 / Jul 31 columns are identical (the last three points are flat by construction). In the growth view, implied FY26 growth stepped down from ~19% (Dec) to ~13% (May onward). The latest column ties 1:1 to the Results annual Summit line.' },
      ebitda: { label: 'Adjusted EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
        summit: [[11451, 11021, 11547, 11547, 11547], [15335, 13644, 14817, 14817, 14817], [17832, 17486, 17397, 17397, 17397], [22252, 21853, 21495, 21495, 21495]],
        cons: null,
        note: 'EBITDA held far steadier than revenue through the re-rates: FY26 sits at ~$11.5B across every snapshot, FY27 dipped to $13.6B in Feb then recovered to $14.8B by May. As with revenue, the May / Jul 17 / Jul 31 columns are identical — no revision since May. In the margin view the implied EBITDA margin rose as revenue was cut: FY26 ~19.7% at the latest snapshot vs ~18.6% in Dec — the arithmetic of a lower revenue base on a steady profit line.' }
    },
    note: 'Source: Summit DCF model for UBER — projection_history across five stored snapshots (15 Dec 2025, 5 Feb 2026, 7 May 2026, 17 Jul 2026, 31 Jul 2026), read from the Summit MCP. The 20 Jul 2026 snapshot is deliberately excluded — its Delivery-Hero pro-forma toggle was ON and inflated every line (Revenue FY25 $67.9B vs the $52.0B standalone actual). Values in US$ millions; growth chains within Summit’s own data (each year vs the prior year stored in the same vintage). No per-snapshot Bloomberg consensus is wired yet. Data sourced from Summit DCF models.'
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
  return [{ key: 'setup', label: 'All tracked lines', defaultMetric: 'rev', groups: groups }];
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
