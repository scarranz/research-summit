// results-data/uber.js - Uber (UBER) dataset for the standardized "Results" tab + the merged
// "Setup" chart (uberSetup). Reconstructed from the rolling BBG_CONSENSUS.txt archive
// (G:\My Drive\Summit\Docs\0\, newest data_as_of 2026-07-30) and the Summit projection model
// (MCP Summit_Financial_Data, snapshot 2026-07-20). All monetary values are US$ MILLIONS
// (unit 'usdM' -> engine divides by 1000 for $B); EPS in dollars. null = not available.
// Generated + hand-reconciled; do not hand-edit the number arrays.
//
//   act    = reported actuals (archive fq0/fq-3/fy0, freshest snapshot). For segment lines BBG
//            does not carry (Mobility/Delivery segment Adj. EBITDA), act is the Summit model's
//            actuals-history (mirrors Uber's reported segment disclosure). NOTE: Freight (GB and
//            EBITDA) was REMOVED — it is not among the BBG-txt-authorized KPIs (see the authorized
//            set); a KPI existing in the DCF/overview does NOT make it valid.
//   cons   = Street consensus going in (shortest-horizon fq+N before the print; forward carries
//            the latest fq+N / fy+N). Segment Adj. EBITDA has NO BBG line -> null.
//   summit = Summit's own forecast, from the LOCAL DCF (Projection History sheet), plotted ONLY on
//            forward periods. The earlier DHER (Delivery Hero) pro-forma consolidation toggle — which
//            inflated Delivery GB to ~$150B and Revenue to ~$68B FY25 — is now OFF, so the model
//            reconciles 1:1 with reported: Revenue FY25 $52.0B exact, Delivery GB $89.3B, EBITDA
//            $8.73B exact. Filled on Revenue, Mobility/Delivery GB, EBITDA, segment EBITDA, and Op
//            income (quarterly). Left NULL only where the model is a genuinely different basis or is
//            not modeled forward:
//              * EPS is now the Non-GAAP (ADJUSTED) line — the txt carries adj EPS (kpi5) and Summit's
//                      ADJ_EPS is plotted against it (comparable). The GAAP EPS (whipsawed by equity-stake
//                      marks) is NOT charted; it survives only as a Setup-grid headline.
//              * Op income (annual) - the model carries op income quarterly, not as a forward annual line.
//   RE-SOURCE (Jul 2026): EPS switched to Non-GAAP (adj); MAPCs removed from the tracked KPI set (no
//   longer in the txt); a total Gross Bookings line ('gb' = Mobility+Delivery+Freight, reported/Summit)
//   was ADDED even though Freight stays excluded as its own line.
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
  source: 'Street consensus + reported actuals from BBG_CONSENSUS.txt (Bloomberg BEst archive, newest snapshot 2026-07-30). Summit estimates from the Summit_Financial_Data model (snapshot 2026-07-20). Segment Adj. EBITDA lines are Summit / company disclosure (no BBG consensus line).',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Reported actuals and the Street consensus that stood one quarter out, from the rolling Bloomberg archive. Summit is on the forward quarters, on the lines where it shares the reported basis.',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [8343, 8607, 8823, 9230, 9292, 9936, 10131, 10700, 11188, 11959, 11533, 12651, 13467, 14366, 13203, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 14223, 14932, 16337, 15916],
          cons:   [null, null, null, null, 9536, 9779, 10108, 10580, 10951, 11770, 11614, 12475, 13264, 14294, 13332, 14242, 14821, 15821, 15355],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        gb: { label: 'Gross Bookings (Total)', short: 'Total GB', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [27368, 30749, 31408, 33601, 35281, 37575, 37651, 39952, 40973, 44197, 42818, 46756, 49740, 54140, 53720, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 57807, 60853, 66307, 63231],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 56250, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 57750, null, null, null] },
        mobgb: { label: 'Mobility Gross Bookings', short: 'Mobility GB', group: 'Mobility', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14894, 14981, 16728, 17903, 19285, 18670, 20554, 21002, 22798, 21182, 23762, 25111, 27442, 26394, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 28871, 30133, 32930, 31673],
          cons:   [null, null, null, null, 17383, 19113, 19135, 20359, 21539, 22525, 21470, 23910, 24849, 27135, 25845, 28936, 29870, 32408, 30684],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delgb: { label: 'Delivery Gross Bookings', short: 'Delivery GB', group: 'Delivery', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [13684, 14315, 15026, 15595, 16094, 17011, 17699, 18126, 18663, 20126, 20377, 21734, 23322, 25431, 25992, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 27602, 29386, 32043, 29891],
          cons:   [null, null, null, null, 15796, 16755, 17524, 18111, 18472, 19682, 20236, 21212, 22839, 24753, 25758, 26965, 28069, 30161, 30490],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-495, -142, -262, 326, 394, 652, 821, 942, 1073, 1254, 1326, 1534, 1675, 1918, 1883, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2084, 2214, 2494, 2340],
          cons:   [null, null, null, null, 302, 505, 621, 792, 917, 1196, 1219, 1470, 1618, 1898, 1845, 2111, 2231, 2497, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [516, 665, 761, 916, 1092, 1283, 708, 1570, 1690, 1842, 1868, 2119, 2256, 2487, 2481, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2795, 2960, 3311, 3136],
          cons:   [null, null, null, null, 1007, 1222, 1315, 1503, 1622, 1849, 1839, 2095, 2271, 2481, 2438, 2785, 2884, 3335, 3092],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2700, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2800, null, null, null] },
        eps: { label: 'EPS (Non-GAAP, adj.)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-0.61, 0.29, -0.08, 0.18, 0.1, 0.66, -0.32, 0.47, 1.2, 3.21, 0.83, 0.63, 3.11, 0.14, 0.13, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.83, 0.91, 1.04, 1.16],
          cons:   [null, null, null, null, 0.219, 0.267, 0.282, 0.405, null, 0.523, 0.542, 0.843, 0.911, 0.739, 0.702, 0.809, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.78, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.82, null, null, null] },
        mobebitda: { label: 'Mobility Segment Adj. EBITDA', short: 'Mobility EBITDA', group: 'Mobility', unit: 'usdM', marginOf: 'mobgb', marginLabel: 'Mobility EBITDA margin (% of GB)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-0.61, 0.29, -0.024, 0.031, 0.111, 0.645, 0.285, 0.371, 0.51, 0.56, 0.5, 0.637, 0.683, 0.71, 0.72, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2365, 2477, 2707, 2483],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delebitda: { label: 'Delivery Segment Adj. EBITDA', short: 'Delivery EBITDA', group: 'Delivery', unit: 'usdM', marginOf: 'delgb', marginLabel: 'Delivery EBITDA margin (% of GB)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, 167, 293, 334, 546, 609, 658, 718, 874, 971, 978, 1103, 1209, 1302, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 1130, 1204, 1346, 1345],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev', 'gb'] },
          { label: 'Mobility', keys: ['mobgb'] },
          { label: 'Delivery', keys: ['delgb'] },
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['opinc', 'ebitda', 'eps'] },
          { label: 'Mobility', keys: ['mobebitda'] },
          { label: 'Delivery', keys: ['delebitda'] },
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
          cons:   [null, null, null, null, null, null, null, null, null],
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
          act:    [-4.65, 0.87, 4.56, 4.73, null, null, null, null, null],
          summit: [null, null, null, null, 3.72, 4.74, 7.25, 9.75, 13.01],
          cons:   [null, 0.7, 2.115, 2.873, 3.311, 4.45, 5.487, 6.565, 7.441],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mobebitda: { label: 'Mobility Segment Adj. EBITDA', short: 'Mobility EBITDA', group: 'Mobility', unit: 'usdM', marginOf: 'mobgb', marginLabel: 'Mobility EBITDA margin (% of GB)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [-4.65, 0.939, 1.593, 2.45, null, null, null, null, null],
          summit: [null, null, null, null, 9578, 10729, 12114, 15142, 18928],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        delebitda: { label: 'Delivery Segment Adj. EBITDA', short: 'Delivery EBITDA', group: 'Delivery', unit: 'usdM', marginOf: 'delgb', marginLabel: 'Delivery EBITDA margin (% of GB)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [50, 1782, 3221, 4591, null, null, null, null, null],
          summit: [null, null, null, null, 3680, 6200, 7441, 8557, 9840],
          cons:   [null, null, null, null, null, null, null, null, null],
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
          { label: 'Mobility', keys: ['mobebitda'] },
          { label: 'Delivery', keys: ['delebitda'] },
        ] }
      ],
    }
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
  intro: 'The Setup chart \u2014 the same actuals-vs-estimates chart+table as Results, MERGED into one: every tracked money line in a single grouped picker, with the period lever, the legend chips, and margin lines for the profit lines. The window is rolling: quarterly shows the last 8 reported quarters + the one next (forecast) quarter; annual shows the last 4 fiscal years + the next 2. Street from the Bloomberg archive; Summit on the forward periods where it shares the reported basis.',
  source: uberResults.source,
  views: {
    q: { label: 'Quarterly', note: 'Rolling \u2014 the last 8 reported quarters plus the one next (forecast) quarter. ' + uberResults.views.q.note,
         metrics: sliceMetrics(uberResults.views.q, qIdx), sections: mergedSection(uberResults.views.q) },
    y: { label: 'Annual', note: 'Rolling \u2014 the last 4 fiscal years plus the next 2 forward years. ' + uberResults.views.y.note,
         metrics: sliceMetrics(uberResults.views.y, yIdx), sections: mergedSection(uberResults.views.y) }
  }
};
