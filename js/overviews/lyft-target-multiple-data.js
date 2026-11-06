// lyft-target-multiple-data.js — the Summit DCF model's valuation of Lyft (LYFT), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Read on 2026-11-05 from the local DCF LYFT.xlsm (the MCP is not used for Lyft), sheet Projection History, the four
// valid submits: 2025-12-15 · 2026-02-11 · 2026-05-08 · 2026-08-07 (after 2Q26). The file also holds a save dated
// 2026-11-05 17:35; it is NOT a submit (it was saved while the analyst corrected model lines, before the 3Q26 numbers were
// loaded) and is left out on the analyst's instruction (Dani, 2026-11-05). Refresh by APPENDING a row when a new submit
// is made (each row is a vintage — never overwrite one).
//
//   val      the workbook's valuation block in the same sheet, per submit: Multiple Type, Multiple, Year, Type (Forward),
//            Price Target, Fair Value, Current Price, WACC. The model values Lyft on EV / EBITDA only, in all four submits
//            (9× · 8× · 5× · 7×, target year 2027); there is no P/E leg. upside = fair value ÷ price at the submit − 1.
//            Check (playbook §6.3): price target ÷ fair value is 1.002, 1.225, 1.137 and 1.080 — one cell each, consistent.
//   y        projection_history rows (labels per js/summit-map/lyft.js): REV · EBITDA (the model's EBITDA row, the one the
//            EV / EBITDA target uses) · EARNINGS · SHARES (diluted, millions). FY2025 is the model's actuals from the
//            2026-02-11 submit on (act:true); on 2025-12-15 it was still a projection.
//   Left out on purpose: EARNINGS in the 2026-02-11 submit (null) — the model stores it about x378 too large from
//            FY2026 on (105,431 for FY2026), a scale error; the PEG and the P/E columns show — for that vintage. EARNINGS
//            and SHARES are also the two rows the model's author has questioned (docs/profiles/LYFT.md §1b, doubts 2 and 4):
//            the share count steps from 417.7M (FY2025 actual) to about 359M in the forecast years, and FY2025 EARNINGS
//            reads 134.6 in actuals_history against 2,844.0 reported (the $2.9B valuation-allowance release). The pane
//            shows them as the model has them and says so.
export var LYFT_TM = {
  model: 'DCF LYFT.xlsm', pulled: '2026-11-05',
  snaps: [
    { d: '2025-12-15', after: '3Q25', px: 18.85, wacc: 0.1731003,
      val: {
        ev: { method: 'EV / EBITDA', mult: 9.0, year: 2027, basis: 'Forward', pt: 32.01181173, fv: 31.95606236, upside: 0.695282, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 6523.0106, ebitda: 535.6158, earn: 62.6285, sh: 387.1258 },
        2026: { rev: 7728.9301, ebitda: 780.8692, earn: 318.5853, sh: 360.6006 },
        2027: { rev: 8806.7856, ebitda: 1109.2998, earn: 645.3918, sh: 360.6006 },
        2028: { rev: 10112.0944, ebitda: 1537.1881, earn: 789.4544, sh: 360.6006 }
      } },
    { d: '2026-02-11', after: '4Q25', px: 13.99, wacc: 0.25764671,
      val: {
        ev: { method: 'EV / EBITDA', mult: 8.0, year: 2027, basis: 'Forward', pt: 28.2077843, fv: 23.02853861, upside: 0.646071, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 6484.295, ebitda: 528.9, earn: null, sh: 381.9192, act: true },
        2026: { rev: 7551.7448, ebitda: 762.3732, earn: null, sh: 346.1794 },
        2027: { rev: 8629.2863, ebitda: 937.6526, earn: null, sh: 346.1794 },
        2028: { rev: 9953.1436, ebitda: 1273.6397, earn: null, sh: 346.1794 }
      } },
    { d: '2026-05-08', after: '1Q26', px: 14.368, wacc: 0.21842525,
      val: {
        ev: { method: 'EV / EBITDA', mult: 5.0, year: 2027, basis: 'Forward', pt: 18.72702271, fv: 16.47245099, upside: 0.146468, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 6484.295, ebitda: 528.9, earn: 2.4516, sh: 382.8594, act: true },
        2026: { rev: 7372.6861, ebitda: 683.1517, earn: 167.3202, sh: 348.0599 },
        2027: { rev: 8424.5581, ebitda: 930.2762, earn: 451.1182, sh: 348.0599 },
        2028: { rev: 9732.1183, ebitda: 1041.2101, earn: 241.6211, sh: 348.0599 }
      } },
    { d: '2026-08-07', after: '2Q26', px: 17.105, wacc: 0.2127812,
      val: {
        ev: { method: 'EV / EBITDA', mult: 7.0, year: 2027, basis: 'Forward', pt: 23.76254489, fv: 21.99783636, upside: 0.286047, flags: [] },
        pe: null
      },
      y: {
        2025: { rev: 6484.295, ebitda: 528.9, earn: -2.5305, sh: 388.4278, act: true },
        2026: { rev: 7268.7152, ebitda: 718.8064, earn: 164.023, sh: 359.1966 },
        2027: { rev: 8068.5047, ebitda: 959.0044, earn: 459.2948, sh: 359.1966 },
        2028: { rev: 8618.4538, ebitda: 1186.3053, earn: 591.728, sh: 359.1966 }
      } }
  ]
};
