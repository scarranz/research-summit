// googl-target-multiple-data.js — the Summit DCF model's valuation of Alphabet (GOOGL), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-26 and written here; refresh by re-pulling when a new
// snapshot is submitted and APPENDING a row (each row is a vintage — never overwrite one). 2026-10-29 (after 3Q26)
// appended on 2026-10-30: EV/EBITDA 12.7× FY2027 (PT $307.71); the P/E leg moved to FY2028 at 20.0× (PT $387.73).
//
//   val      get_valuation_history('GOOGL') — the workbook's Output ▸ VALUATION block, per method, verbatim:
//            multiple, target year, basis, price target (1-yr), fair value (discounted at the model's WACC),
//            upside = fair value ÷ price at snapshot − 1 (pre-computed by the store), quality flags (none).
//   y        get_fundamentals, projection_history, source DEFAULT (labels per js/summit-map/googl.js): REV · EBITDA (adj.:
//            operating income + D&A + SBC) · EARNINGS (the model's adjusted earnings, without the gains on equity
//            securities) · SHARES (diluted, millions). FY2025 is the model's actuals_history (reported), act:true.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST). REV_BBG_EST
//            looks like revenue NET of TAC (summit-map doubt 7) and EARNINGS_BBG_EST is GAAP (with the gains), so neither
//            is comparable with the model's line; the pane uses the model only.
//            2026-10-29: EBITDA_BBG_EST jumped ~30% in every year (FY27 $296.4B → $391.6B) while REV_BBG_EST moved ~3% —
//            looks like a different Bloomberg field; kept out (null) and logged for SAB in docs/profiles/GOOGL.md §6.
//
// The 2026-07-23 snapshot is left out, as everywhere in this profile (SAB, Oct 26 2026: taken while the model was being
// updated — its EV/EBITDA leg targets 2029 and its P/E leg 2027).
//
// Open doubt for the model author (logged in docs/profiles/GOOGL.md): the P/E leg's price target ($391.52 at 24.0× on
// 2026-08-06) implies FY2027 EPS of $16.31, while EARNINGS ÷ SHARES for FY2027 is $15.96 (→ $383 at 24×); the implied
// share count is about 12,050M against the model's 12,317M. On 2026-10-29 it goes the other way: $387.73 at 20.0× implies
// FY2028 EPS of $19.39 vs EARNINGS ÷ SHARES $19.80 (→ $396 at 20×). The EV/EBITDA leg ties: (12.7 × EBITDA − net debt) ÷
// shares = $344.60 with about US$6.0B of net debt (08-06) and $307.71 with about US$31.1B (10-29). The pane shows the
// targets as the workbook recorded them and never recomputes them.
export var GOOGL_TM = {
  model: '09067682-3dcb-439a-a598-794f2b20fff0', pulled: '2026-10-26',
  snaps: [
    { d: '2026-07-28', after: '2Q26', px: 334.1458, wacc: 0.17420525,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12.7, year: 2027, basis: 'Forward', pt: 318.50248017, fv: 297.37497342, upside: -0.110044, flags: [] },
        pe: { method: 'P / E',       mult: 21.3, year: 2027, basis: 'Forward', pt: 317.52872317, fv: 296.23520144, upside: -0.113455, flags: [] }
      },
      y: {
        2025: { rev: 402836, ebitda: 175128, earn: 105984, sh: 12230, act: true },
        2026: { rev: 491250.91655879, ebitda: 232588.07079375, earn: 138527.07953296, sh: 12317.14285714 },
        2027: { rev: 604679.36843813, ebitda: 307907.78852883, earn: 180147.5179671,  sh: 12317.14285714 },
        2028: { rev: 729095.09412951, ebitda: 368557.54510716, earn: 222795.96946039, sh: 12317.14285714 }
      },
      cons: {
        2026: { rev: 430283.96969697, ebitda: 227752.72727273, earn: 232809.22033898 },
        2027: { rev: 534344.81818182, ebitda: 293505.88,       earn: 185132.89285714 },
        2028: { rev: 639103.7826087,  ebitda: 377909.17647059, earn: 219315.27027027 }
      } },
    { d: '2026-08-06', after: '2Q26', px: 357.6537, wacc: 0.17152219,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12.7, year: 2027, basis: 'Forward', pt: 344.59926068, fv: 323.31494206, upside: -0.096011, flags: [] },
        pe: { method: 'P / E',       mult: 24.0, year: 2027, basis: 'Forward', pt: 391.5238559,  fv: 367.09294023, upside: 0.026392,  flags: [] }
      },
      y: {
        2025: { rev: 402836, ebitda: 175128, earn: 105984, sh: 12230, act: true },
        2026: { rev: 506294.91059347, ebitda: 248305.11418485, earn: 147945.05585094, sh: 12317.14285714 },
        2027: { rev: 629543.4705695,  ebitda: 334682.20391477, earn: 196620.49834001, sh: 12317.14285714 },
        2028: { rev: 754863.16554644, ebitda: 422116.2262997,  earn: 242958.17818359, sh: 12317.14285714 }
      },
      cons: {
        2026: { rev: 432266.21875,    ebitda: 225901.71111111, earn: 253856.15686275 },
        2027: { rev: 541582.62068966, ebitda: 296391.72916667, earn: 187001.85714286 },
        2028: { rev: 670637.78947368, ebitda: 380955.53125,    earn: 222705.27272727 }
      } },
    { d: '2026-10-29', after: '3Q26', px: 283.82, wacc: 0.16784548,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12.7, year: 2027, basis: 'Forward', pt: 307.70721313, fv: 299.57583279, upside: 0.055513, flags: [] },
        pe: { method: 'P / E',       mult: 20.0, year: 2028, basis: 'Forward', pt: 387.7261439,  fv: 376.81736928, upside: 0.327663, flags: [] }
      },
      y: {
        2025: { rev: 402836, ebitda: 175128, earn: 105984, sh: 12230, act: true },
        2026: { rev: 501466.72629195, ebitda: 233665.1570038,  earn: 135862.61355492, sh: 12317.14285714 },
        2027: { rev: 622531.14535542, ebitda: 300882.40101674, earn: 169758.90763682, sh: 12317.14285714 },
        2028: { rev: 783070.15487842, ebitda: 426020.2269276,  earn: 243935.70628768, sh: 12317.14285714 }
      },
      cons: {
        2026: { rev: 436385.40625,    ebitda: null, earn: 246152.10909091 },
        2027: { rev: 559550.0625,     ebitda: null,            earn: 185613.72222222 },
        2028: { rev: 705099.92592593, ebitda: null, earn: 227834.41463415 }
      } }
  ]
};
