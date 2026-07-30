// results-data/uber.js - Uber (UBER) dataset for the standardized "Results" tab + the merged
// "Setup" chart (uberSetup). Reconstructed from the rolling BBG_CONSENSUS.txt archive
// (G:\My Drive\Summit\Docs\0\, newest data_as_of 2026-07-30) and the Summit projection model
// (MCP Summit_Financial_Data, snapshot 2026-07-20). All monetary values are US$ MILLIONS
// (unit 'usdM' -> engine divides by 1000 for $B); EPS in dollars. null = not available.
// Generated + hand-reconciled; do not hand-edit the number arrays.
//
//   act    = reported actuals (archive fq0/fq-3/fy0, freshest snapshot). For segment lines BBG
//            does not carry (Freight GB, segment Adj. EBITDA), act is the Summit model's
//            actuals-history (mirrors Uber's reported segment disclosure).
//   cons   = Street consensus going in (shortest-horizon fq+N before the print; forward carries
//            the latest fq+N / fy+N). Segment Adj. EBITDA + Freight GB have NO BBG line -> null.
//   summit = Summit's own forecast, plotted ONLY on forward periods. Filled ONLY where Summit is
//            on the SAME BASIS as the reported/Street line beside it (cross-checked, EARNINGS
//            _CONVENTIONS S6a): Mobility GB (ratio 1.00) and the Summit-only segment lines.
//            Left NULL where the Summit model export is on a DIFFERENT basis than Uber's
//            reported figures (a reconciliation item for San/Oscar, NOT a forecast gap):
//              * Total Revenue - Summit ~+30% vs reported ($67.9B vs $52.0B FY25)
//              * Delivery GB   - Summit ~+65% vs reported ($150B vs $90.9B FY25)
//              * Op income / Adj. EBITDA / EPS - Summit adj/managed vs BBG comparable-GAAP
//                (EPS especially: BBG is GAAP, whipsawed by equity-stake marks; Summit is adj).
//   guideLo/guideHi = null everywhere. Uber guides Gross Bookings + Adj. EBITDA each quarter, but
//            the Summit guidance metrics return all zeros in this snapshot -> no band drawn.

export var uberResults = {
  updated: 'Jul 2026',
  intro: 'How Uber\u2019s reported results have stacked up against Street consensus, per metric \u2014 quarterly and annual, with growth and margins. Street + reported actuals reconstructed from the rolling Bloomberg archive (BBG_CONSENSUS.txt); Summit is our own model, plotted on the forward periods where it shares the reported basis. Periods marked \u201cest.\u201d are forward (no actual yet).',
  source: 'Street consensus + reported actuals from BBG_CONSENSUS.txt (Bloomberg BEst archive, newest snapshot 2026-07-30). Summit estimates from the Summit_Financial_Data model (snapshot 2026-07-20). Segment Adj. EBITDA + Freight lines are Summit / company disclosure (no BBG consensus line).',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Reported actuals and the Street consensus that stood one quarter out, from the rolling Bloomberg archive. Summit is on the forward quarters, on the lines where it shares the reported basis.',
      metrics: {
        rev: { label: 'Revenue (Total)', short: 'Total revenue', group: 'Totals', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [8343, 8607, 8823, 9230, 9292, 9936, 10131, 10700, 11188, 11959, 11533, 12651, 13467, 14366, 13203, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, 9536, 9779, 10108, 10580, 10951, 11770, 11614, 12475, 13264, 14294, 13332, 14242, 14821, 15821, 15355],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
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
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, 15796, 16755, 17524, 18111, 18472, 19682, 20236, 21212, 22839, 24753, 25758, 26965, 28069, 30161, 30490],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        freightgb: { label: 'Freight Gross Bookings', short: 'Freight GB', group: 'Freight', unit: 'usdM',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, 1540, 1401, 1278, 1284, 1279, 1282, 1272, 1308, 1273, 1259, 1260, 1307, 1267, 1334, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 1334, 1334, 1334, 1668],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-495, -142, -262, 326, 394, 652, 821, 942, 1073, 1254, 1326, 1534, 1675, 1918, 1883, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, 302, 505, 621, 792, 917, 1196, 1219, 1470, 1618, 1898, 1845, 2111, 2231, 2497, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [516, 665, 761, 916, 1092, 1283, 708, 1570, 1690, 1842, 1868, 2119, 2256, 2487, 2481, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, 1007, 1222, 1315, 1503, 1622, 1849, 1839, 2095, 2271, 2481, 2438, 2785, 2884, 3335, 3092],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        eps: { label: 'EPS (GAAP, diluted)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [-0.61, 0.29, -0.08, 0.18, 0.1, 0.66, -0.32, 0.47, 1.2, 3.21, 0.83, 0.63, 3.11, 0.14, 0.13, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, 0.11, 0.17, 0.23, 0.31, 0.34, 0.51, 0.51, 0.63, 0.7, 0.8, 0.71, 0.84, 0.93, 1.03, 0.96],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        mobebitda: { label: 'Mobility Segment Adj. EBITDA', short: 'Mobility EBITDA', group: 'Mobility', unit: 'usdM', marginOf: 'mobgb', marginLabel: 'Mobility EBITDA margin (% of GB)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, 1012, 1060, 1170, 1287, 1446, 1479, 1567, 1682, 1769, 1753, 1905, 2038, 2203, 2029, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2365, 2477, 2707, 2483],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        delebitda: { label: 'Delivery Segment Adj. EBITDA', short: 'Delivery EBITDA', group: 'Delivery', unit: 'usdM', marginOf: 'delgb', marginLabel: 'Delivery EBITDA margin (% of GB)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, 167, 293, 334, 546, 609, 658, 718, 874, 971, 978, 1103, 1209, 1302, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, 1189, 1403, 1488, 1642, 1639],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
        freightebitda: { label: 'Freight Segment Adj. EBITDA', short: 'Freight EBITDA', group: 'Freight', unit: 'usdM', marginOf: 'freightgb', marginLabel: 'Freight EBITDA margin (% of GB)',
          periods: ["3Q22", "4Q22", "1Q23", "2Q23", "3Q23", "4Q23", "1Q24", "2Q24", "3Q24", "4Q24", "1Q25", "2Q25", "3Q25", "4Q25", "1Q26", "2Q26", "3Q26", "4Q26", "1Q27"],
          act:    [null, -8, -23, -14, -13, -14, -21, -12, -19, -22, -7, -6, -20, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, -13, 0, 0, 0, 0, 50],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Mobility', keys: ['mobgb'] },
          { label: 'Delivery', keys: ['delgb'] },
          { label: 'Freight', keys: ['freightgb'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['opinc', 'ebitda', 'eps'] },
          { label: 'Mobility', keys: ['mobebitda'] },
          { label: 'Delivery', keys: ['delebitda'] },
          { label: 'Freight', keys: ['freightebitda'] }
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
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 37142, 43758, 51956, 58163, 66865, 76609, 85290, 94927],
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
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 63552, 74230, 90218, 111248, 129636, 147972, 164476, 183604],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        freightgb: { label: 'Freight Gross Bookings', short: 'Freight GB', group: 'Freight', unit: 'usdM',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [6952, 5242, 5135, 5093, null, null, null, null, null],
          summit: [null, null, null, null, 5336, 5336, 5336, 5336, 5336],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [-1832, 1110, 3977, 6453, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 983, 3217, 6165, 8778, 11010, 13377, 15834, 18264],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Company', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin (% of rev)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [1713, 4052, 6484, 8730, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 3994, 6491, 8719, 11382, 13540, 16261, 18742, 21161],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        eps: { label: 'EPS (GAAP, diluted)', short: 'EPS', group: 'Company', unit: 'eps',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [-4.65, 0.87, 4.56, 4.73, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, 0.38, 1.92, 5.36, 2.91, 4.52, 5.58, 6.91, 7.94],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        mobebitda: { label: 'Mobility Segment Adj. EBITDA', short: 'Mobility EBITDA', group: 'Mobility', unit: 'usdM', marginOf: 'mobgb', marginLabel: 'Mobility EBITDA margin (% of GB)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [3299, 4963, 6497, 7899, null, null, null, null, null],
          summit: [null, null, null, null, 9578, 10729, 12114, 15142, 18928],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        delebitda: { label: 'Delivery Segment Adj. EBITDA', short: 'Delivery EBITDA', group: 'Delivery', unit: 'usdM', marginOf: 'delgb', marginLabel: 'Delivery EBITDA margin (% of GB)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [50, 1782, 3221, 4591, null, null, null, null, null],
          summit: [null, null, null, null, 4502, 7600, 9063, 10461, 12018],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
        freightebitda: { label: 'Freight Segment Adj. EBITDA', short: 'Freight EBITDA', group: 'Freight', unit: 'usdM', marginOf: 'freightgb', marginLabel: 'Freight EBITDA margin (% of GB)',
          periods: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          act:    [null, -64, -74, -33, null, null, null, null, null],
          summit: [55, null, null, null, 0, 160, 160, 160, 160],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null] },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Mobility', keys: ['mobgb'] },
          { label: 'Delivery', keys: ['delgb'] },
          { label: 'Freight', keys: ['freightgb'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['opinc', 'ebitda', 'eps'] },
          { label: 'Mobility', keys: ['mobebitda'] },
          { label: 'Delivery', keys: ['delebitda'] },
          { label: 'Freight', keys: ['freightebitda'] }
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
