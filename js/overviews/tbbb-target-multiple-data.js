// tbbb-target-multiple-data.js — the Summit DCF model's valuation of TBBB, one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (playbook rule 10). Read on 2026-11-02 from the analyst's DCF TBBB.xlsm (tab Projection History) by
// scripts/consensus/tbbb/build_tbbb_summit.py: the four submits (2025-12-12, 2026-03-13, 2026-05-08, 2026-08-13); the block dated 2026-11-02
// in that tab is not a submit and is not read. Refresh by APPENDING a row per new submit (never overwrite).
//   val  the EV/EBITDA valuation of that submit: multiple, target year, basis, 1-year price target, fair value, upside (fair value / price - 1).
//        Prices and targets are US$ (NYSE); the model is built in Mexican pesos. The P/E block is #VALUE! / #SPILL! in every submit (-US$78
//        in the first), so there is no P/E leg.
//   y    REV, EBITDA, EARNINGS, SHARES for FY2025-FY2028 as each submit stored them, Ps. millions and millions of diluted shares.
//        EBITDA is the model's own line (the one the EV/EBITDA leg multiplies): lease-adjusted, not reported or company-adjusted EBITDA,
//        and its definition changed between the May 8 and Aug 13 submits (FY2027 Ps.5,762M to Ps.3,839M on unchanged revenue).
//        EARNINGS is the model's definition (FY2025 -2,276 against -2,840 reported). SHARES are the model's 115.0M (139.6M in the first
//        submit), not the 162.5M diluted of the 3Q26 release.
export var TBBB_TM = {
  pulled: '2026-11-02',
  snaps: [
    { d: '2025-12-12', after: '3Q25', px: 33.01, wacc: 0.075901,
      val: {
        ev: { method: 'EV / EBITDA', mult: 25, year: 2027, basis: 'Forward', pt: 42.9514, fv: 37.5592, upside: 0.137812, flags: [] }
      },
      y: {
        2025: { rev: 77611.33, ebitda: 1146.28, earn: -1248.02, sh: 139.607 },
        2026: { rev: 103696.3, ebitda: 3190.14, earn: -41.85, sh: 139.607 },
        2027: { rev: 136092.84, ebitda: 6356.13, earn: 1930.6, sh: 139.607 },
        2028: { rev: 174011.6, ebitda: 9387.68, earn: 3487.47, sh: 139.607 }
      } },
    { d: '2026-03-13', after: '4Q25', px: 33.08, wacc: 0.074996,
      val: {
        ev: { method: 'EV / EBITDA', mult: 25, year: 2027, basis: 'Forward', pt: 36.1899, fv: 34.1489, upside: 0.032311, flags: [] }
      },
      y: {
        2025: { rev: 78153.39, ebitda: -18.23, earn: -2275.6, sh: 115.023, act: true },
        2026: { rev: 102534.13, ebitda: 2555.52, earn: -861.44, sh: 115.023 },
        2027: { rev: 135089.08, ebitda: 5837.26, earn: 1338.07, sh: 115.023 },
        2028: { rev: 175276.1, ebitda: 8727.95, earn: 2841.17, sh: 115.023 }
      } },
    { d: '2026-05-08', after: '1Q26', px: 37.965, wacc: 0.077691,
      val: {
        ev: { method: 'EV / EBITDA', mult: 25, year: 2027, basis: 'Forward', pt: 34.5221, fv: 32.885, upside: -0.133807, flags: [] }
      },
      y: {
        2025: { rev: 78153.39, ebitda: -18.23, earn: -2275.6, sh: 115.023, act: true },
        2026: { rev: 103159.0, ebitda: 2374.73, earn: -985.36, sh: 115.023 },
        2027: { rev: 134371.7, ebitda: 5762.29, earn: 1186.33, sh: 115.023 },
        2028: { rev: 175099.86, ebitda: 8691.42, earn: 2608.51, sh: 115.023 }
      } },
    { d: '2026-08-13', after: '2Q26', px: 49.365, wacc: 0.078825,
      val: {
        ev: { method: 'EV / EBITDA', mult: 30, year: 2028, basis: 'Forward', pt: 62.8548, fv: 58.8548, upside: 0.192236, flags: [] }
      },
      y: {
        2025: { rev: 78153.39, ebitda: 1921.37, earn: -2275.6, sh: 115.023, act: true },
        2026: { rev: 106042.06, ebitda: 2547.66, earn: -962.55, sh: 115.023 },
        2027: { rev: 141324.66, ebitda: 3838.52, earn: 1385.92, sh: 115.023 },
        2028: { rev: 184993.98, ebitda: 5507.57, earn: 2914.45, sh: 115.023 }
      } }
  ]
};
