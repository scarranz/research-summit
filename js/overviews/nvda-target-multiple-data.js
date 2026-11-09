// nvda-target-multiple-data.js — the Summit DCF model's valuation of NVIDIA (NVDA), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store: valuation on 2026-11-09 (get_valuation_history), model rows from the
// get_fundamentals dumps of 2026-11-02 (scripts/consensus/dumps/nvda_summit). Model 12da9a59, instrument NVDA, three
// submits: 2025-12-12 (after 3Q FY26) · 2026-03-04 (after 4Q FY26) · 2026-08-28 (after 2Q FY27 — the newest; no submit
// since, NVIDIA reports 3Q FY27 on Nov 19 2026). Refresh by re-pulling when a new snapshot is submitted and APPENDING a
// row (each row is a vintage — never overwrite one). Years are NVIDIA fiscal years (FY2028 = Feb 2027 – Jan 2028).
//
//   val      get_valuation_history('NVDA') — the workbook's Output ▸ VALUATION block, per method, verbatim: multiple,
//            target year, basis, price target (1-year), fair value (discounted at the model's WACC), upside = fair value ÷
//            price at snapshot − 1 (pre-computed by the store), quality flags (none in any submit). 2025-12-12 values the
//            two legs on DIFFERENT years (P/E on FY2027, EV/EBITDA on FY2028); the later two value both on FY2028.
//   y        get_fundamentals, projection_history (labels per js/summit-map/nvda.js): REV · EBITDA (the model's EBITDA =
//            adj. op. income + D&A + interest income) · EARNINGS (the model's adjusted earnings) · SHARES (diluted, millions).
//            act:true = a reported year in that submit.
//            BASIS BREAK: in the 2025-12-12 submit the adjusted lines still added back stock-based compensation (NVIDIA's
//            old non-GAAP); from 2026-03-04 they count it as a cost (NVIDIA's definition from Feb 2026). EBITDA and
//            earnings therefore step down at 2026-03-04 partly by definition — the pane flags that submit.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST), kept for the
//            record; the pane uses the model only.
//
// Checks before freezing (playbook §6.3): price target ÷ fair value = 1.112 / 1.112 on 2026-08-28 and 1.281 / 1.281 on
// 2026-03-04 (consistent per submit). Both 2026-08-28 targets tie in the workbook (DCF NVDA.xlsm ▸ Discounted Cash Flow,
// file of Aug 28 2026, read 2026-11-09): P/E = (22 × FY2028 earnings $395,606M + FY2027 free cash flow to equity
// $232,436M) = $8,935,771M ÷ FY2027 diluted shares 24,150M = $370.00; EV/EBITDA = 18 × FY2028 EBITDA $483,971M + FY2027
// free cash flow to the firm $208,043M = EV $8,919,520M, − debt $33,875M + cash and securities $99,369M = $8,985,014M of
// equity → $370.54 per share. So target ÷ multiple is not the year's EPS or EBITDA (the target includes the cash
// flow of the year before).
export var NVDA_TM = {
  model: '12da9a59-d0b8-4317-a214-80b70760c532', pulled: '2026-11-09',
  // The model's own balance at the 2026-08-28 submit (DCF sheet): the net debt Live uses, so a Live target at the
  // recorded multiple reads off the same balance as the recorded one (A23: the source is named in the foot).
  balance: { d: '2026-08-28', debt: 33875, cash: 99369, src: 'Summit DCF model balance at the 2026-08-28 submit (DCF NVDA.xlsm ▸ Discounted Cash Flow: debt $33.9B; cash, marketable and equity securities $99.4B)' },
  snaps: [
    { d: '2025-12-12', after: '3Q26', px: 174.82, wacc: 0.20958122,
      val: {
        ev: { method: 'EV / EBITDA', mult: 16.0, year: 2028, basis: 'Forward', pt: 249.54012389, fv: 236.21140024, upside: 0.351169, flags: [] },
        pe: { method: 'P / E', mult: 24.0, year: 2027, basis: 'Forward', pt: 201.94572274, fv: 196.74284352, upside: 0.125402, flags: [] }
      },
      y: {
        2025: { rev: 130497, ebitda: 89831.047, earn: 74234.0309, sh: 24804, act: true },
        2026: { rev: 213257.9, ebitda: 140701.036, earn: 115433.91368, sh: 24374.98730122 },
        2027: { rev: 337414.559, ebitda: 241983.23457929, earn: 200295.88196881, sh: 23945.97460245 },
        2028: { rev: 492465.51975, ebitda: 359232.68134422, earn: 297476.97764229, sh: 23945.97460245 },
        2029: { rev: 567324.7808375, ebitda: 420091.89337736, earn: 351503.90937235, sh: 23945.97460245 }
      },
      cons: {
        2026: { rev: 212310.7826087, ebitda: 134128.625, earn: 112308.41666667 },
        2027: { rev: 316920.8, ebitda: 217220.625, earn: 173920.71428571 },
        2028: { rev: 400393.32692308, ebitda: 270792.04166667, earn: 214996.80555556 },
        2029: { rev: 499600.625, ebitda: 256028.2, earn: 208888 }
      } },
    { d: '2026-03-04', after: '4Q26', px: 182.58, wacc: 0.31183548,
      val: {
        ev: { method: 'EV / EBITDA', mult: 18.0, year: 2028, basis: 'Forward', pt: 245.69140482, fv: 191.79850677, upside: 0.05049, flags: [] },
        pe: { method: 'P / E', mult: 22.0, year: 2028, basis: 'Forward', pt: 245.68406373, fv: 191.72052061, upside: 0.050063, flags: [] }
      },
      y: {
        2025: { rev: 130497, ebitda: 85093.047, earn: 70206.7309, sh: 24804, act: true },
        2026: { rev: 215938, ebitda: 136224.6765, earn: 110555.801095, sh: 24514, act: true },
        2027: { rev: 358397.79, ebitda: 238464.08802776, earn: 197065.01184532, sh: 24193.59250739 },
        2028: { rev: 478481.3715, ebitda: 316727.27605957, earn: 261600.44839074, sh: 24193.59250739 },
        2029: { rev: 594926.915775, ebitda: 395436.2887766, earn: 326340.57690694, sh: 24193.59250739 }
      },
      cons: {
        2027: { rev: 357482.14492754, ebitda: 237902.08571429, earn: 196670.12 },
        2028: { rev: 466720.46031746, ebitda: 306364.25714286, earn: 253868.20833333 },
        2029: { rev: 562392.03571429, ebitda: 358801.64285714, earn: 294360.42105263 }
      } },
    { d: '2026-08-28', after: '2Q27', px: 220.045, wacc: 0.28219672,
      val: {
        ev: { method: 'EV / EBITDA', mult: 18.0, year: 2028, basis: 'Forward', pt: 370.53626727, fv: 333.18941485, upside: 0.514188, flags: [] },
        pe: { method: 'P / E', mult: 22.0, year: 2028, basis: 'Forward', pt: 370.00450303, fv: 332.66645524, upside: 0.511811, flags: [] }
      },
      y: {
        2025: { rev: 130497, ebitda: 85093.047, earn: 70206.7309, sh: 24804, act: true },
        2026: { rev: 215938, ebitda: 136224.6765, earn: 110555.801095, sh: 24514, act: true },
        2027: { rev: 413720.31, ebitda: 276114.34995, earn: 225369.786622, sh: 24150.43800132 },
        2028: { rev: 726095.487, ebitda: 483970.92719182, earn: 395606.11996991, sh: 23786.87600264 },
        2029: { rev: 904110.35875, ebitda: 614242.76797346, earn: 507646.78203726, sh: 23786.87600264 }
      },
      cons: {
        2027: { rev: 406779.46376812, ebitda: 271111.43243243, earn: 239106.55769231 },
        2028: { rev: 670087.28358209, ebitda: 430132.56756757, earn: 372561.22641509 },
        2029: { rev: 863857.16666667, ebitda: 542333.2, earn: 466765 }
      } }
  ]
};
