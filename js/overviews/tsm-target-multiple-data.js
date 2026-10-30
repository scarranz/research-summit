// tsm-target-multiple-data.js — the Summit DCF model's valuation of TSM, one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-16 (snapshot 2026-10-15) and on 2026-10-30 (snapshot
// 2026-10-19), and written here; refresh by re-pulling
// when a new snapshot is submitted and APPENDING a row (each row is a vintage — never overwrite one).
//
//   val      get_valuation_history('TSM') — the workbook's Output ▸ VALUATION block, per method, verbatim:
//            multiple, target year, basis, price target (1-yr), fair value (discounted at the model's WACC),
//            upside = fair value ÷ price at snapshot − 1 (pre-computed by the store), quality flags.
//   y        get_fundamentals, projection_history, source DEFAULT (labels per js/summit-map/tsm.js):
//            REV · EBITDA · EARNINGS · SHARES, US$ millions / ADR-equivalent shares in millions. FY2025 is the
//            model's actuals_history (reported), flagged act:true.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST).
//
// Open doubt for the model author (logged in docs/profiles/TSM.md): the P/E leg's price target does not tie to
// EARNINGS ÷ SHARES — 10-15: $410.28 at 19× implies FY2027 EPS $21.59 vs $21.05; 10-19: $453.92 at 20× implies
// $22.70 vs $22.22 (~2% gap both times). The EV/EBITDA leg ties: (12 × EBITDA − net debt) ÷ shares = $413.63 with
// ~US$71.5B of net cash (10-15) and $431.59 with ~US$68.0B (10-19). The pane shows the targets as
// the workbook recorded them and never recomputes them.
export var TSM_TM = {
  model: 'e35f84c0-651c-4b14-8295-5af638089cc8', pulled: '2026-10-30',
  snaps: [
    { d: '2026-10-15', after: '3Q26', px: 422.10, wacc: 0.19262128,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12, year: 2027, basis: 'Forward', pt: 413.63229192, fv: 398.54332633, upside: -0.055808, flags: [] },
        pe: { method: 'P / E',       mult: 19, year: 2027, basis: 'Forward', pt: 410.28229173, fv: 395.15526922, upside: -0.063835, flags: [] }
      },
      y: {
        2025: { rev: 122555.6, ebitda: 88178.8,  earn: 55143.9,  sh: 5186.5, act: true },
        2026: { rev: 167907.99, ebitda: 133913.31, earn: 84061.61,  sh: 5186.474 },
        2027: { rev: 227011.23, ebitda: 172812.91, earn: 109184.11, sh: 5186.474 },
        2028: { rev: 291032.7, ebitda: 220186.3, earn: 142629.9, sh: 5186.5 }
      },
      cons: {
        2026: { rev: 170190.4, ebitda: 125331.9, earn: 86428.1 },
        2027: { rev: 232229.4, ebitda: 170425.1, earn: 116558.0 },
        2028: { rev: 294900.2, ebitda: 216017.1, earn: 148244.7 }
      } },
    // Appended 2026-10-30 from the same store (get_valuation_history + get_fundamentals, snapshot 2026-10-19).
    // P/E moved 19× → 20×; EV/EBITDA stays 12×. cons is null: in this submit the model's Bloomberg columns
    // (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST) are all 0 — a DCF issue logged in docs/profiles/TSM.md §6.
    { d: '2026-10-19', after: '3Q26', px: 424.675, wacc: 0.19346028,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12, year: 2027, basis: 'Forward', pt: 431.59362263, fv: 416.59439698, upside: -0.019028, flags: [] },
        pe: { method: 'P / E',       mult: 20, year: 2027, basis: 'Forward', pt: 453.91934689, fv: 437.97605299, upside: 0.031321, flags: [] }
      },
      y: {
        2025: { rev: 122555.6, ebitda: 88178.8,  earn: 55143.9,  sh: 5186.5, act: true },
        2026: { rev: 173880.63, ebitda: 138703.17, earn: 87697.97,  sh: 5186.474 },
        2027: { rev: 235653.56, ebitda: 180870.52, earn: 115217.79, sh: 5186.474 },
        2028: { rev: 302682.6, ebitda: 229675.9, earn: 146454.6, sh: 5186.5 }
      },
      cons: null }
  ]
};
