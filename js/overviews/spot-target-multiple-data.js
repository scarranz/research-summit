// spot-target-multiple-data.js — the Summit DCF model's valuation of SPOT, one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-20 (the 2026-10-22 submit appended on 2026-10-30) and written here; refresh by re-pulling when a
// new snapshot is submitted and APPENDING a row (each row is a vintage — never overwrite one).
//
//   val      get_valuation_history('SPOT') — the workbook's Output ▸ VALUATION block, per method, verbatim:
//            multiple, target year, basis, price target (1-year, EUR per share, as the workbook records it), quality
//            flags (none). The store also returns fair value, upside, the price at the submit and WACC; they are kept
//            below exactly as recorded but the pane does NOT show them (no WACC, no discounted fair value for Summit
//            estimates — Dani, Oct 20 2026).
//   y        get_fundamentals, projection_history, source DEFAULT (labels per js/summit-map/spot.js):
//            REV · EBITDA · EARNINGS · SHARES — EUR MILLIONS and millions of diluted shares. FY2025 is what each submit stored for that year (the last two carry the
//            reported actual; EARNINGS there is the model definition, not IFRS net income — summit-map doubt).
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST), EUR M.
//
// The first submit valued FY2029 on EV/EBITDA and FY2026 on P/E (49×) — different years per leg — so its row has a
// value for only one leg in each forward-year view.
export var SPOT_TM = {
  model: '9d5961bf-4181-46ab-9b39-2147981380e1', pulled: '2026-10-20', pulledLast: '2026-10-30',
  snaps: [
    { d: '2025-12-18', after: '3Q25', px: 567.23, wacc: 0.1613306,
      val: {
        ev: { method: 'EV / EBITDA', mult: 18, year: 2029, basis: 'Forward', pt: 936.41438385, fv: 751.95199776, upside: 0.325656, flags: [] },
        pe: { method: 'P / E', mult: 49, year: 2026, basis: 'Forward', pt: 817.29272498, fv: 812.91331394, upside: 0.433128, flags: [] }
      },
      y: {
        2025: { rev: 17255.44, ebitda: 2491.78, earn: 1920.25, sh: 206.990369 },
        2026: { rev: 20802.18, ebitda: 3558.27, earn: 2884.17, sh: 206.99 },
        2027: { rev: 24836.07, ebitda: 5174.82, earn: 4322.05, sh: 206.99 },
        2028: { rev: 29112.06, ebitda: 6851.12, earn: 5825.39, sh: 206.99 },
        2029: { rev: 33788.3, ebitda: 8456.05, earn: 7275.94, sh: 206.99 }
      },
      cons: {
        2026: { rev: 19699.65, ebitda: 3046.88, earn: 2584.19 },
        2027: { rev: 22434.53, ebitda: 3943.21, earn: 3276.89 },
        2028: { rev: 25185.47, ebitda: 4607.35, earn: 3927.65 },
        2029: { rev: 27784.43, ebitda: 5287.42, earn: 4628.5 }
      } },
    { d: '2026-02-09', after: '3Q25', px: 414.74, wacc: 0.22858119,
      val: {
        ev: { method: 'EV / EBITDA', mult: 18, year: 2027, basis: 'Forward', pt: 498.83920135, fv: 533.87521307, upside: 0.287253, flags: [] },
        pe: { method: 'P / E', mult: 20, year: 2027, basis: 'Forward', pt: 434.04225056, fv: 467.15870951, upside: 0.126389, flags: [] }
      },
      y: {
        2025: { rev: 17194.63, ebitda: 2480.85, earn: 1916.21, sh: 206.990369 },
        2026: { rev: 19580.87, ebitda: 3149.73, earn: 2567.63, sh: 206.99 },
        2027: { rev: 22197.83, ebitda: 4256.21, earn: 3579.86, sh: 206.99 },
        2028: { rev: 24857.75, ebitda: 5109.18, earn: 4373.13, sh: 206.99 },
        2029: { rev: 27446.55, ebitda: 5951.35, earn: 5166.5, sh: 206.99 }
      },
      cons: {
        2026: { rev: 19645.93, ebitda: 3061.56, earn: 2534.61 },
        2027: { rev: 22347.94, ebitda: 3921.54, earn: 3269.71 },
        2028: { rev: 25079.0, ebitda: 4606.44, earn: 3939.28 },
        2029: { rev: 27516.2, ebitda: 5264.25, earn: 4620.67 }
      } },
    { d: '2026-04-28', after: '1Q26', px: 479.84, wacc: 0.22867912,
      val: {
        ev: { method: 'EV / EBITDA', mult: 20.5, year: 2027, basis: 'Forward', pt: 537.41999755, fv: 467.50870389, upside: -0.025699, flags: [] },
        pe: { method: 'P / E', mult: 28, year: 2027, basis: 'Forward', pt: 541.65093757, fv: 470.43533235, upside: -0.0196, flags: [] }
      },
      y: {
        2025: { rev: 17186.0, ebitda: 2552.0, earn: 3204.69, sh: 210.509173, act: true },
        2026: { rev: 19736.52, ebitda: 3268.44, earn: 2685.5, sh: 209.259 },
        2027: { rev: 21963.3, ebitda: 3983.11, earn: 3335.84, sh: 208.008 },
        2028: { rev: 24853.96, ebitda: 5024.09, earn: 4657.51, sh: 206.758 },
        2029: { rev: 27700.91, ebitda: 5944.1, earn: 5634.26, sh: 205.508 }
      },
      cons: {
        2026: { rev: 19512.05, ebitda: 3171.56, earn: 2743.37 },
        2027: { rev: 22142.18, ebitda: 3974.28, earn: 3405.87 },
        2028: { rev: 24866.35, ebitda: 4837.85, earn: 4067.87 },
        2029: { rev: 27103.57, ebitda: 5267.42, earn: 4481.58 }
      } },
    { d: '2026-08-05', after: '2Q26', px: 482.43, wacc: 0.20734415,
      val: {
        ev: { method: 'EV / EBITDA', mult: 20.5, year: 2027, basis: 'Forward', pt: 561.14924167, fv: 519.873353, upside: 0.077614, flags: [] },
        pe: { method: 'P / E', mult: 28, year: 2027, basis: 'Forward', pt: 517.9130953, fv: 479.40371136, upside: -0.006273, flags: [] }
      },
      y: {
        2025: { rev: 17186.0, ebitda: 2549.0, earn: 3234.11, sh: 210.509173, act: true },
        2026: { rev: 19761.54, ebitda: 3345.46, earn: 2821.64, sh: 206.363 },
        2027: { rev: 23118.84, ebitda: 4258.22, earn: 3234.78, sh: 202.218 },
        2028: { rev: 27097.44, ebitda: 5535.33, earn: 4363.44, sh: 198.072 },
        2029: { rev: 31372.86, ebitda: 7007.2, earn: 5619.28, sh: 198.072 }
      },
      cons: {
        2026: { rev: 19526.64, ebitda: 3004.55, earn: 2597.91 },
        2027: { rev: 22316.1, ebitda: 3889.24, earn: 3218.68 },
        2028: { rev: 25332.73, ebitda: 4816.5, earn: 3972.89 },
        2029: { rev: 28150.16, ebitda: 5624.67, earn: 4665.63 }
      } },
    // 2026-10-22 (after 3Q26), appended 2026-10-30. The P/E leg moved to FY2028 (EV/EBITDA stays FY2027).
    // pe.pt: the store records US$672.78, the workbook's NEXT-year price cell (Q80); the 1-year target is US$645.14 (P80),
    // the cell its own fair value is discounted from — the same correction js/submits-data/spot.js carries (checked in
    // DCF SPOT.xlsm, Oct 28 2026). ptStore keeps what the store returned.
    // cons: only EARNINGS_BBG_EST is used — REV_BBG_EST and EBITDA_BBG_EST in this snapshot are on another scale (about
    // 1.12–1.14x the EUR consensus on revenue, apparently US$) and FY2030 is zero, so they are left null (logged in SPOT.md §6).
    // FY2025 is what this snapshot stores for the year (REV 17,177 / EBITDA 2,540, 9 below the reported 17,186 / 2,549).
    { d: '2026-10-22', after: '3Q26', px: 583.59, wacc: 0.20427911,
      val: {
        ev: { method: 'EV / EBITDA', mult: 20.5, year: 2027, basis: 'Forward', pt: 532.86350547, fv: 514.20235111, upside: -0.118898, flags: [] },
        pe: { method: 'P / E', mult: 28, year: 2028, basis: 'Forward', pt: 645.13951888, ptStore: 672.77781338, fv: 622.33963145, upside: 0.066399, flags: [] }
      },
      y: {
        2025: { rev: 17177.0, ebitda: 2540.0, earn: 3226.01, sh: 210.509173, act: true },
        2026: { rev: 19533.81, ebitda: 3289.69, earn: 2743.18, sh: 207.082 },
        2027: { rev: 22753.48, ebitda: 4173.56, earn: 3163.27, sh: 203.655 },
        2028: { rev: 26667.23, ebitda: 5352.98, earn: 4212.68, sh: 200.228 },
        2029: { rev: 30872.61, ebitda: 7000.56, earn: 5601.01, sh: 200.228 }
      },
      cons: {
        2026: { rev: null, ebitda: null, earn: 2539.09 },
        2027: { rev: null, ebitda: null, earn: 3175.43 },
        2028: { rev: null, ebitda: null, earn: 3924.81 },
        2029: { rev: null, ebitda: null, earn: 4675.5 }
      } }
  ]
};
