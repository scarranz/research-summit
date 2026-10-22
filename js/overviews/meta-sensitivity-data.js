// meta-sensitivity-data.js — one Summit DCF snapshot of META, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for META, snapshot 2026-08-04 (after 2Q26; the workbook's Projection
// History, Last Submit 2026-08-04 15:52:20 = the MCP snapshot), on 2026-10-20. Refresh by re-pulling when a new
// snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
// Labels per js/summit-map/meta.js, US$ millions, projection_history:
//   line.*  ADV_REVENUE · OTH_REVENUE · RL_REVENUE — their sum equals REV to the dollar in every year
//   rev     REV · op OP_INCOME · dna DNA · earn EARNINGS (the model's normalized net income)
//   tax     TAX_RATE (fraction) · sh SHARES (diluted, millions — held flat in the model)
// EBITDA here = op + dna, the reported basis Results uses (the model's own EBITDA line adds back SBC).
// 2029 is left out: the snapshot carries no D&A for it.
export var META_SENS = {
  model: 'b8827a75-3628-4ac2-8fb1-17f70a8d3c42', snapshot: '2026-08-04', after: '2Q26', pulled: '2026-10-20',
  y: {
    2026: { line: { ads:249493.47, oth:4426.70, rl:2258.00 }, rev:256178.17, op: 88737.63, dna:28886.16, earn: 75680.57, tax:0.15, sh:2574 },
    2027: { line: { ads:316251.49, oth:6861.39, rl:3093.46 }, rev:326206.34, op:118779.24, dna:43067.29, earn:101026.33, tax:0.15, sh:2574 },
    2028: { line: { ads:381060.34, oth:7547.52, rl:4238.04 }, rev:392845.90, op:174388.32, dna:59154.43, earn:140777.71, tax:0.1965, sh:2574 }
  }
};
