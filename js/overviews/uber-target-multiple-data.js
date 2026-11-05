// uber-target-multiple-data.js — the Summit DCF model's valuation of Uber (UBER), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store on 2026-11-03 (model 4dbd6471, instrument UBER, submits 2025-12-15 ·
// 2026-02-05 · 2026-05-06 · 2026-08-05) and on 2026-11-04 (the 2026-11-04 submit, after 3Q26, APPENDED — it values FY2028
// on both legs, the earlier four FY2027). Refresh by re-pulling when a new snapshot is submitted and APPENDING a row
// (each row is a vintage — never overwrite one).
//
//   val      get_valuation_history('UBER') — the workbook's Output ▸ VALUATION block, per method, verbatim: multiple,
//            target year, basis, price target (1-year), fair value (discounted at the model's WACC), upside = fair value ÷
//            price at snapshot − 1 (pre-computed by the store), quality flags (none in any submit). The three earlier
//            submits value EV / EBITDA only; P / E first appears on 2026-08-05. On 2026-11-04 both price targets are
//            corrected to the workbook's 1-year cells (ptStore keeps what the store recorded; see that row).
//   y        get_fundamentals, projection_history (labels per js/summit-map/uber.js): REV · EBITDA (Adjusted EBITDA) ·
//            EARNINGS (the model's Non-GAAP net income) · SHARES (diluted, millions). FY2025 is the model's actuals_history
//            (reported) from the 2026-02-05 submit on, act:true; on 2025-12-15 FY2025 was still a projection.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST), kept for the
//            record; the pane uses the model only. In the 2026-11-04 file those columns sit one fiscal year late (its FY2026
//            cell holds the Street's FY2027), so that row stores them under the year they belong to and FY2026 is left null.
//
// Checks before freezing (playbook §6.3): price target ÷ fair value on 2026-08-05 is 1.060 (EV/EBITDA) and 1.064 (P/E) —
// consistent, the store read the right cells. Both targets tie in the workbook (DCF UBER.xlsm ▸ Discounted Cash Flow,
// read 2026-11-03): P/E = 22 × ADJ_EPS FY2027 $4.89 ($107.61) + FY2026 FCFE per share $5.69 = $113.29; EV/EBITDA = 14 × FY2027
// EBITDA ($222.5B) + PV of FY2026 FCF ($11.7B) − net debt $5.3B (debt 10,726 − cash 5,391) → $107.58. The earlier
// 'implied EPS $5.15' / 'implied net debt $13.9B' readings ignored the FY2026 cash-flow term (closed, SAB 2026-11-03).
// 2026-11-04 (target year FY2028, two years out): the store recorded 152.04 (EV/EBITDA) and 154.36 (P/E) — the workbook's
// NEXT-year cells Q49 / Q80 (Q80 = 23 × FY2028 EPS $6.42 + FY2027 FCFE per share $6.74). The 1-year targets the workbook's
// Output ▸ VALUATION block reports (D206 / D208) are P49 = 150.16 and P80 = 155.08; with them price target ÷ fair value is
// 1.025 (EV/EBITDA) and 1.026 (P/E), consistent. Corrected below; ptStore keeps the stored figure (DCF UBER.xlsm, Nov 4 2026).
export var UBER_TM = {
  model: '4dbd6471-83b2-4fe7-9ceb-19cb249ff517', pulled: '2026-11-04',
  snaps: [
    { d: '2025-12-15', after: '3Q25', px: 81.60, wacc: 0.12607052,
      val: {
        ev: { method: 'EV / EBITDA', mult: 15.0, year: 2027, basis: 'Forward', pt: 118.93034624, fv: 118.57456948, upside: 0.453120, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 52113.2875,     ebitda: 8760.1608572,   earn: 5045.18439862,  sh: 2086.61911111 },
        2026: { rev: 61688.927134,   ebitda: 11451.07575748, earn: 7617.91164072,  sh: 2023.98294553 },
        2027: { rev: 73404.78518828, ebitda: 15334.97849167, earn: 10578.63812314, sh: 1961.34677996 },
        2028: { rev: 81964.39971022, ebitda: 17831.50114415, earn: 14252.37963523, sh: 1898.71061438 }
      },
      cons: {
        2026: { rev: 60448.73076923, ebitda: 10969.51020408, earn: 7693.55813953 },
        2027: { rev: 69193.35714286, ebitda: 13410.05,       earn: 9675.78787879 },
        2028: { rev: 77984.61111111, ebitda: 15789.11111111, earn: 11052.5 }
      } },
    { d: '2026-02-05', after: '4Q25', px: 75.745, wacc: 0.16929553,
      val: {
        ev: { method: 'EV / EBITDA', mult: 15.0, year: 2027, basis: 'Forward', pt: 100.38370137, fv: 87.18430226, upside: 0.151024, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 52017, ebitda: 8730, earn: 5237, sh: 2106.011, act: true },
        2026: { rev: 61971.75713,   ebitda: 11020.97559019, earn: 6931.37667992,  sh: 2012.80846178 },
        2027: { rev: 72490.386432,  ebitda: 13643.62512317, earn: 8756.0276893,   sh: 1922.232081 },
        2028: { rev: 82203.1476175, ebitda: 17485.95476549, earn: 13069.29024368, sh: 1826.12047695 }
      },
      cons: {
        2026: { rev: 60509.14545455, ebitda: 10978.14,       earn: 7512.8372093 },
        2027: { rev: 69327,          ebitda: 13460.3255814,  earn: 9473.48571429 },
        2028: { rev: 78273.63636364, ebitda: 15725.09090909, earn: 10848.7 }
      } },
    { d: '2026-05-06', after: '1Q26', px: 77.92, wacc: 0.16255254,
      val: {
        ev: { method: 'EV / EBITDA', mult: 14.0, year: 2027, basis: 'Forward', pt: 102.22731305, fv: 92.62647608, upside: 0.188738, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 52017, ebitda: 8730, earn: 5237, sh: 2106.011, act: true },
        2026: { rev: 58695.206472,   ebitda: 11546.74497612, earn: 7067.00261102,  sh: 1979.56960298 },
        2027: { rev: 68127.690975,   ebitda: 14817.43643425, earn: 9172.58436912,  sh: 1890.48897085 },
        2028: { rev: 78362.02311875, ebitda: 17397.25301625, earn: 13368.07908741, sh: 1795.9645223 }
      },
      cons: {
        2026: { rev: 58205.2,        ebitda: 10833.5,        earn: 6900.95652174 },
        2027: { rev: 66806.51923077, ebitda: 13014.24,       earn: 8833.82608696 },
        2028: { rev: 75643.03125,    ebitda: 15960.51724138, earn: 10967.4 }
      } },
    { d: '2026-08-05', after: '2Q26', px: 66.845, wacc: 0.1554282,
      val: {
        ev: { method: 'EV / EBITDA', mult: 14.0, year: 2027, basis: 'Forward', pt: 107.57945532, fv: 101.45848181, upside: 0.517817, flags: [] },
        pe: { method: 'P / E',       mult: 22.0, year: 2027, basis: 'Forward', pt: 113.29164863, fv: 106.50707075, upside: 0.593344, flags: [] }
      },
      y: {
        2025: { rev: 52017, ebitda: 8730, earn: 5237, sh: 2106.011, act: true },
        2026: { rev: 58066.7482,  ebitda: 11381.8565, earn: 6870.6308,  sh: 2009.4255 },
        2027: { rev: 70356.422,   ebitda: 15891.1144, earn: 9656.3828,  sh: 1939.0956 },
        2028: { rev: 80391.3534,  ebitda: 18455.4282, earn: 13515.0804, sh: 1842.1408 }
      },
      cons: {
        2026: { rev: 58173.1,     ebitda: 11390.2143, earn: 6901.3913 },
        2027: { rev: 66900.56,    ebitda: 13545.2128, earn: 8926.0938 },
        2028: { rev: 76723.0606,  ebitda: 16288.1818, earn: 10971.2105 }
      } },
    { d: '2026-11-04', after: '3Q26', px: 72.27, wacc: 0.17210201,
      val: {
        // pt corrected from the workbook on BOTH legs: the target year is FY2028, two years out, and the store read each price
        // target from the following year's cell (Q49 152.04, Q80 154.37) instead of the 1-year cell (P49 150.16, P80 155.08) —
        // the cells the workbook's own Output ▸ VALUATION block reports as the 1yr price targets (D206, D208). Fair values
        // match the store. Checked in DCF UBER.xlsm, Nov 4 2026.
        ev: { method: 'EV / EBITDA', mult: 16.0, year: 2028, basis: 'Forward', pt: 150.15677610, ptStore: 152.04021742, fv: 146.47878927, upside: 1.026827, flags: [] },
        pe: { method: 'P / E',       mult: 23.0, year: 2028, basis: 'Forward', pt: 155.08170335, ptStore: 154.36498209, fv: 151.09103647, upside: 1.090647, flags: [] }
      },
      y: {
        2025: { rev: 52017, ebitda: 8730, earn: 5237, sh: 2106.011, act: true },
        2026: { rev: 58170.5696,  ebitda: 11458.753,  earn: 6909.9189,  sh: 2029.8208 },
        2027: { rev: 70385.9464,  ebitda: 14677.97,   earn: 9293.3062,  sh: 1989.2243 },
        2028: { rev: 84340.8753,  ebitda: 18239.8278, earn: 12640.4596, sh: 1949.4399 },
        2029: { rev: 98019.001,   ebitda: 24500.9079, earn: 17714.1601, sh: 1851.9679 }
      },
      cons: {
        2026: null,
        2027: { rev: 66601.7708,  ebitda: 13778.6809, earn: 8748.4 },
        2028: { rev: 76660.0541,  ebitda: 16581,      earn: 10987.6875 },
        2029: { rev: 85451.2778,  ebitda: 18988.7368, earn: 13068.875 }
      } }
  ]
};
