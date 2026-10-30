// sofi-target-multiple-data.js — the Summit DCF model's valuation of SOFI, one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Read once on 2026-10-26 from the analyst's own workbook, DCF SOFI.xlsm (Research/DCF/Banks - All/SOFI), sheet
// 'Projection History': each saved snapshot block holds the model rows and, beside them, that submit's valuation block
// (multiple, target year, basis, 1-year price target, fair value, price at the submit, WACC). The Summit data store
// (get_valuation_history('SOFI')) answers 'no_valuations_for_ticker' for all four snapshots (valuation_count 0), so
// the workbook is the source until the store re-ingests; refresh by APPENDING a row per new submit (never overwrite).
// Rows 1-3 read 2026-10-26; row 4 (snapshot 2026-10-27, after the 3Q26 print) read 2026-10-30: valuation from the workbook block,
// REV / EBITDA / EARNINGS / SHARES from the Summit DCF model snapshot 2026-10-27 (they equal the workbook rows).
//
//   val  per method: multiple, target year, basis, price target, fair value, upside (fair value ÷ price − 1). The pane shows
//        the price target and the multiple; fair value and WACC are kept as recorded and not shown (Dani, Oct 20 2026).
//   y    REV · EBITDA · EARNINGS · SHARES for FY2025–FY2029 as each submit stored them, US$ millions and millions of
//        diluted shares (the model holds 1,259.367 flat). EARNINGS is the model's adjusted net income. REV is the model's
//        headline revenue row ($4,845M for FY2026 on Aug 5), not the segment-build row the earlier Results pull used.
// SoFi is a bank holding company: EV/EBITDA is recorded because the model records it, but net debt is not meaningful, so
// the Live read of that leg uses zero net debt and P/E is the leg to read. The model's EV/EBITDA target year and
// multiples are exactly as the workbook wrote them.
export var SOFI_TM = {
  model: '2728dbdb-76e1-4bb3-a29a-f4d1f91946a1', pulled: '2026-10-30',
  snaps: [
    { d: '2026-02-03', after: '4Q25', px: 22.025, wacc: 0.29002,
      val: {
        ev: { method: 'EV / EBITDA', mult: 18, year: 2027, basis: 'Forward', pt: 27.0264, fv: 21.4533, upside: -0.025956, flags: [] },
        pe: { method: 'P / E', mult: 32, year: 2027, basis: 'Forward', pt: 27.1144, fv: 21.5231, upside: -0.022786, flags: [] }
      },
      y: {
        2025: { rev: 3616.669, ebitda: 1053.898, earn: 481.32, sh: 1259.367 },
        2026: { rev: 4613.168, ebitda: 1603.66, earn: 827.205, sh: 1259.367 },
        2027: { rev: 6105.246, ebitda: 2204.3, earn: 1243.954, sh: 1259.367 },
        2028: { rev: 7985.784, ebitda: 3085.629, earn: 1873.773, sh: 1259.367 },
        2029: { rev: 8838.912, ebitda: 2850.006, earn: 1816.086, sh: 1259.367 }
      } },
    { d: '2026-04-29', after: '1Q26', px: 15.77, wacc: 0.299233,
      val: {
        ev: { method: 'EV / EBITDA', mult: 14.1, year: 2027, basis: 'Forward', pt: 23.4577, fv: 19.6637, upside: 0.246902, flags: [] },
        pe: { method: 'P / E', mult: 25, year: 2027, basis: 'Forward', pt: 23.4407, fv: 19.6493, upside: 0.245995, flags: [] }
      },
      y: {
        2025: { rev: 3613.354, ebitda: 1053.898, earn: 481.32, sh: 1259.367, act: true },
        2026: { rev: 4669.519, ebitda: 1576.635, earn: 828.743, sh: 1259.367 },
        2027: { rev: 6287.649, ebitda: 2292.554, earn: 1292.059, sh: 1259.367 },
        2028: { rev: 8133.065, ebitda: 3112.475, earn: 1864.868, sh: 1259.367 },
        2029: { rev: 9407.863, ebitda: 3268.159, earn: 2159.874, sh: 1259.367 }
      } },
    { d: '2026-08-05', after: '2Q26', px: 18.25, wacc: 0.264808,
      val: {
        ev: { method: 'EV / EBITDA', mult: 14.1, year: 2027, basis: 'Forward', pt: 22.6894, fv: 20.6278, upside: 0.130293, flags: [] },
        pe: { method: 'P / E', mult: 25, year: 2027, basis: 'Forward', pt: 20.1503, fv: 18.2186, upside: -0.001723, flags: [] }
      },
      y: {
        2025: { rev: 3613.354, ebitda: 1053.898, earn: 481.32, sh: 1259.367, act: true },
        2026: { rev: 4845.191, ebitda: 1647.141, earn: 825.679, sh: 1259.367 },
        2027: { rev: 6280.304, ebitda: 2186.058, earn: 1094.962, sh: 1259.367 },
        2028: { rev: 8083.789, ebitda: 2902.395, earn: 1515.702, sh: 1259.367 },
        2029: { rev: 10682.536, ebitda: 4344.883, earn: 3116.26, sh: 1259.367 }
      } },
    // 2026-10-27, the submit of 13:45:54 UTC (the one the Summit data store parsed; the workbook also holds a re-submit at 13:49:05
    // with the same targets and a $16.40 price). The P/E leg moved its target year from 2027 to 2028 and its multiple from 25x to 22x.
    { d: '2026-10-27', after: '3Q26', px: 16.445, wacc: 0.269327,
      val: {
        ev: { method: 'EV / EBITDA', mult: 14.1, year: 2027, basis: 'Forward', pt: 25.5475, fv: 24.4852, upside: 0.488903, flags: [] },
        pe: { method: 'P / E', mult: 22, year: 2028, basis: 'Forward', pt: 28.6722, fv: 27.3727, upside: 0.664497, flags: [] }
      },
      y: {
        2025: { rev: 3613.354, ebitda: 1053.898, earn: 481.32, sh: 1259.367, act: true },
        2026: { rev: 5104.217, ebitda: 1692.135, earn: 840.257, sh: 1259.367 },
        2027: { rev: 6469.750, ebitda: 2466.700, earn: 1279.202, sh: 1259.367 },
        2028: { rev: 8472.104, ebitda: 3376.833, earn: 1854.141, sh: 1259.367 },
        2029: { rev: 11116.829, ebitda: 4422.970, earn: 2665.527, sh: 1259.367 }
      } }
  ]
};
