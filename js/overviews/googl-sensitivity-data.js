// googl-sensitivity-data.js — one Summit DCF snapshot of GOOGL, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for GOOGL, snapshot 2026-10-29 (after 3Q26 — the same snapshot as the Results
// dataset and the latest Target Multiple row), on 2026-10-30 (replaced the 2026-08-06 block pulled on 2026-10-26). Refresh by re-pulling when a new snapshot is submitted (replace the block
// and its date — Sensitivity reads ONE snapshot). Labels per js/summit-map/googl.js, US$ millions, projection_history:
//   line.*  SEG2_REV (Google Services) · SEG8_REV (Google Cloud) · SEG9_REV (Other Bets); hedging (SEG10_REV) is
//           +$120M in 2026 and zero after, so the three lines are the model's total revenue to within $120M.
//           Cloud 2026 = reported 1Q–3Q + the model's 4Q (the 2026 annual cell of SEG8_REV is wrong — SAB, Oct 26 2026,
//           EV-RES-DATA; js/results-data/googl.js carries the same figure).
//   rev     REV · op OP_INCOME · eb EBITDA (adjusted: operating income + D&A + SBC, the model's own line and the basis
//           SAB chose for the profile) · earn EARNINGS (the model's adjusted earnings, without the gains on equity
//           securities) · tax TAX_RATE (fraction) · sh SHARES (diluted, millions — held flat in the model)
// 2029 is left out to keep the pane's FY2026–FY2028 axis (the 2026-10-29 snapshot populates it; the 2026-08-06 one did not).
// The model projects segment operating income for 2026 only (SEGn_OPINC are zero after), so there is no segment margin.
export var GOOGL_SENS = {
  model: '09067682-3dcb-439a-a598-794f2b20fff0', snapshot: '2026-10-29', after: '3Q26', pulled: '2026-10-30',
  y: {
    2026: { line: { svc:386564.611,   cloud:113207.615, bets:1574.5 }, rev:501466.73, op:169765.85, eb:233665.16, earn:135862.61, tax:0.19699, sh:12317.14 },
    2027: { line: { svc:432607.549,   cloud:187104.947, bets:2818.65 }, rev:622531.15, op:211714.32, eb:300882.40, earn:169758.91, tax:0.2,     sh:12317.14 },
    2028: { line: { svc:481204.176,   cloud:297764.843, bets:4101.136 }, rev:783070.15, op:303354.06, eb:426020.23, earn:243935.71, tax:0.2,    sh:12317.14 }
  }
};
