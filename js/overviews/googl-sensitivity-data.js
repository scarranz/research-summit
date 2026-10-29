// googl-sensitivity-data.js — one Summit DCF snapshot of GOOGL, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for GOOGL, snapshot 2026-08-06 (after 2Q26 — the same snapshot as the Results
// dataset and Target Multiple), on 2026-10-26. Refresh by re-pulling when a new snapshot is submitted (replace the block
// and its date — Sensitivity reads ONE snapshot). Labels per js/summit-map/googl.js, US$ millions, projection_history:
//   line.*  SEG2_REV (Google Services) · SEG8_REV (Google Cloud) · SEG9_REV (Other Bets); hedging (SEG10_REV) is
//           −$74M in 2026 and zero after, so the three lines are the model's total revenue to within $74M.
//           Cloud 2026 = reported 1Q–2Q + the model's 3Q–4Q (the 2026 annual cell of SEG8_REV is wrong — SAB, Oct 26 2026,
//           EV-RES-DATA; js/results-data/googl.js carries the same figure).
//   rev     REV · op OP_INCOME · eb EBITDA (adjusted: operating income + D&A + SBC, the model's own line and the basis
//           SAB chose for the profile) · earn EARNINGS (the model's adjusted earnings, without the gains on equity
//           securities) · tax TAX_RATE (fraction) · sh SHARES (diluted, millions — held flat in the model)
// 2029 is left out: the snapshot carries no EBITDA or D&A for it.
// The model projects segment operating income for 2026 only (SEGn_OPINC are zero after), so there is no segment margin.
export var GOOGL_SENS = {
  model: '09067682-3dcb-439a-a598-794f2b20fff0', snapshot: '2026-08-06', after: '2Q26', pulled: '2026-10-26',
  y: {
    2026: { line: { svc:388080.221,   cloud:117495, bets:793 },       rev:506294.91, op:184812.29, eb:248305.11, earn:147945.06, tax:0.19699, sh:12317.14 },
    2027: { line: { svc:434570.4684,  cloud:194192.1021, bets:780.9 }, rev:629543.47, op:245093.38, eb:334682.20, earn:196620.50, tax:0.2,     sh:12317.14 },
    2028: { line: { svc:483363.8846,  cloud:270363.0714, bets:1136.21 }, rev:754863.17, op:301001.44, eb:422116.23, earn:242958.18, tax:0.2,   sh:12317.14 }
  }
};
