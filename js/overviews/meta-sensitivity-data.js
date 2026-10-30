// meta-sensitivity-data.js — one Summit DCF snapshot of META, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for META, snapshot 2026-10-22 (after 3Q26; submitted 2026-10-22
// 11:06 UTC), on 2026-10-30 — it replaces the 2026-08-04 block (pulled 2026-10-20). Refresh by re-pulling when a
// new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
// Note: the model's FY2026 operating income (90,239) books 3Q26 without the $9.89B legal charge (META.md §6).
// Labels per js/summit-map/meta.js, US$ millions, projection_history:
//   line.*  ADV_REVENUE · OTH_REVENUE · RL_REVENUE — their sum equals REV to the dollar in every year
//   rev     REV · op OP_INCOME · dna DNA · earn EARNINGS (the model's normalized net income)
//   tax     TAX_RATE (fraction) · sh SHARES (diluted, millions — held flat in the model)
// EBITDA here = op + dna, the reported basis Results uses (the model's own EBITDA line adds back SBC).
// 2029 is left out: the snapshot carries no D&A for it.
export var META_SENS = {
  model: 'b8827a75-3628-4ac2-8fb1-17f70a8d3c42', snapshot: '2026-10-22', after: '3Q26', pulled: '2026-10-30',
  y: {
    2026: { line: { ads:251251.58, oth:4350.70, rl:2231.00 }, rev:257833.28, op: 90239.32, dna:28886.16, earn: 73335.50, tax:0.19, sh:2574 },
    2027: { line: { ads:334422.43, oth:6743.59, rl:4238.90 }, rev:345404.91, op:134906.51, dna:44941.14, earn:112093.75, tax:0.15, sh:2574 },
    2028: { line: { ads:433008.65, oth:9441.02, rl:5086.68 }, rev:447536.35, op:189040.21, dna:63970.59, earn:154667.82, tax:0.16, sh:2574 }
  }
};
