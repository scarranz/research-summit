// nvda-sensitivity-data.js — one Summit DCF snapshot of NVIDIA (NVDA), the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit DCF model for NVDA (model 12da9a59), snapshot 2026-08-28 (after 2Q FY27 — the latest submit, the
// same one as the last Target Multiple and Submit History rows): get_fundamentals(projection_history, DEFAULT) on
// 2026-11-09 for the consolidated lines, and the 2026-11-02 dumps (scripts/consensus/dumps/nvda_summit, source SEGM) for
// Data Center revenue and adjusted gross profit. Refresh by re-pulling when a new snapshot is submitted (replace the
// block and its date — Sensitivity reads ONE snapshot). Labels per js/summit-map/nvda.js, US$ millions, NVIDIA fiscal
// years (FY2028 = Feb 2027 – Jan 2028):
//   line.dc   DC_REVENUE (the model projects Data Center only); line.oth = REV − DC_REVENUE (Gaming, Professional
//             Visualization, Automotive and OEM & other together — the model does not project them one by one).
//   rev REV · gp ADJ_GROSS_PROFIT (adjusted: GAAP + acquisition-related costs; the driver the old calculator moved) ·
//   op OP_INCOME (adjusted operating income, the DCF driver) · dna DNA · ii INT_INC · eb EBITDA (= op + dna + ii, the
//   model's EBITDA, the line Target Multiple values) · earn EARNINGS (the model's adjusted earnings) · tax TAX_RATE ·
//   sh SHARES (diluted, millions).
//   Opex is not a model row: the pane holds it at gp − op (in dollars) when the gross margin moves.
//   The model's FY2026 Data Center figure (189,308) sits below the reported 193,737 (8-K CFO commentary); the pane's
//   base year is the reported one (js/results-data/nvda.js), as in every copy of this pane.
// Exit multiples and net debt come from ./nvda-target-multiple-data.js (the model's own valuation and balance).
export var NVDA_SENS = {
  model: '12da9a59-d0b8-4317-a214-80b70760c532', snapshot: '2026-08-28', after: '2Q27', pulled: '2026-11-09',
  y: {
    2027: { line: { dc:385648.31, oth:28072 },
            rev:413720.31, gp:304898.3354, op:270322.4234, dna:3915.22655, ii:1876.68, eb:276114.34995,
            earn:225369.786622, tax:0.17, sh:24150.43800132 },
    2028: { line: { dc:691005.487, oth:35090 },
            rev:726095.487, gp:526558.0428358, op:473995.6748358, dna:6450.27821, ii:3524.94764603, eb:483970.92719182,
            earn:395606.11996991, tax:0.17, sh:23786.87600264 },
    2029: { line: { dc:863756.85875, oth:40353.5 },
            rev:904110.35875, gp:657844.44565449, op:597345.25745449, dna:9014.59128625, ii:7882.89273272, eb:614242.76797346,
            earn:507646.78203726, tax:0.16, sh:23786.87600264 },
    2030: { line: { dc:1079696.0734375, oth:44388.85 },
            rev:1124084.9234375, gp:820660.15031924, op:751033.61364274, dna:12252.74000656, ii:16174.20582827, eb:779460.58597757,
            earn:643709.70423565, tax:0.16, sh:23786.87600264 }
  }
};
