// uber-target-multiple-data.js — the Summit DCF model's valuation of Uber (UBER), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-11-03 (model 4dbd6471, instrument UBER, four submits:
// 2025-12-15 · 2026-02-05 · 2026-05-06 · 2026-08-05 — the newest snapshot, after 2Q26; there is no submit after the 3Q26
// print and SAB chose to work on the 2026-08-05 one, Nov 3 2026). Refresh by re-pulling when a new snapshot is submitted
// and APPENDING a row (each row is a vintage — never overwrite one).
//
//   val      get_valuation_history('UBER') — the workbook's Output ▸ VALUATION block, per method, verbatim: multiple,
//            target year, basis, price target (1-year), fair value (discounted at the model's WACC), upside = fair value ÷
//            price at snapshot − 1 (pre-computed by the store), quality flags (none in any submit). The three earlier
//            submits value EV / EBITDA only; P / E first appears on 2026-08-05.
//   y        get_fundamentals, projection_history (labels per js/summit-map/uber.js): REV · EBITDA (Adjusted EBITDA) ·
//            EARNINGS (the model's Non-GAAP net income) · SHARES (diluted, millions). FY2025 is the model's actuals_history
//            (reported) from the 2026-02-05 submit on, act:true; on 2025-12-15 FY2025 was still a projection.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST), kept for the
//            record; the pane uses the model only.
//
// Checks before freezing (playbook §6.3): price target ÷ fair value on 2026-08-05 is 1.060 (EV/EBITDA) and 1.064 (P/E) —
// consistent, the store read the right cells. The EV/EBITDA leg ties to its EBITDA with an implied net debt of about
// US$13.9B (14.0 × 15,891 − 107.58 × 1,939) — larger than the 2Q26 balance-sheet net debt of US$7.3B
// (./uber-histmult-data.js); the model's bridge is not in the store, so the pane never recomputes the recorded targets.
// Open doubt for the model author (logged in docs/profiles/UBER.md): the P/E leg's price target ($113.29 at 22.0× FY2027)
// implies FY2027 EPS of $5.15, while EARNINGS ÷ SHARES gives $4.98 and the model's ADJ_EPS row $4.89.
export var UBER_TM = {
  model: '4dbd6471-83b2-4fe7-9ceb-19cb249ff517', pulled: '2026-11-03',
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
      } }
  ]
};
