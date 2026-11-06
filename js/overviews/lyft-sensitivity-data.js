// lyft-sensitivity-data.js — one Summit DCF snapshot of Lyft (LYFT), the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Read on 2026-11-05 from the local DCF LYFT.xlsm, sheet Projection History, the 2026-08-07 submit (after 2Q26 — the latest valid
// submit, the same one as the Results dataset and the last Target Multiple row). The file also holds a save dated 2026-11-05 17:35 that
// is NOT a submit (left out on the analyst's instruction). Refresh by replacing the block and its date — Sensitivity reads ONE snapshot.
// Labels per js/summit-map/lyft.js, US$ millions:
//   line.lyft  REV — Lyft reports ONE operating segment (10-K Note 2), so the "line" is total revenue.
//   rev        REV · eb EBITDA (the model's EBITDA row, the line Target Multiple values) · sh SHARES (diluted, millions).
//   earn       EARNINGS (GAAP net income) — kept for the record; the grid is on EV/EBITDA, the only method the model records.
// Not read: OP_INCOME (the model stores 0 for every projected year in this submit — model doubt 2, docs/profiles/LYFT.md §1b), and
// TAX_RATE. The margin driver is therefore the Adjusted EBITDA margin on revenue, not an operating margin.
export var LYFT_SENS = {
  model: 'DCF LYFT.xlsm', snapshot: '2026-08-07', after: '2Q26', pulled: '2026-11-05',
  y: {
    2026: { line: { lyft: 7268.7152 },
         rev: 7268.7152, eb: 718.8064, earn: 164.023, sh: 359.1966 },
    2027: { line: { lyft: 8068.5047 },
         rev: 8068.5047, eb: 959.0044, earn: 459.2948, sh: 359.1966 },
    2028: { line: { lyft: 8618.4538 },
         rev: 8618.4538, eb: 1186.3053, earn: 591.728, sh: 359.1966 },
    2029: { line: { lyft: 9209.3967 },
         rev: 9209.3967, eb: 1334.475, earn: 741.1438, sh: 359.1966 }
  }
};
