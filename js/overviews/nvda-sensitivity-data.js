// nvda-sensitivity-data.js — one Summit DCF snapshot of NVIDIA (NVDA), the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit DCF model for NVDA (model 12da9a59), snapshot 2026-11-18 (after 3Q FY27 — the latest submit, the
// same one as the last Target Multiple row): get_fundamentals(projection_history, DEFAULT) on 2026-11-18 for the
// consolidated lines, and the 2026-11-18 dump (scripts/consensus/dumps/nvda_summit, source SEGM) for Data Center revenue
// and adjusted gross profit. (Previous base: 2026-08-28 — FY2028 revenue $726.1B, EBITDA $484.0B, earnings $395.6B.) Refresh by re-pulling when a new snapshot is submitted (replace the
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
  model: '12da9a59-d0b8-4317-a214-80b70760c532', snapshot: '2026-11-18', after: '3Q27', pulled: '2026-11-18',
  y: {
    2027: { line: { dc:400024.45, oth:30520.5 },
            rev:430544.95, gp:318020.43925, op:282409.23925, dna:3999.34975, ii:1876.68, eb:288285.289,
            earn:235401.8437775, tax:0.17, sh:23987.30304826 },
    2028: { line: { dc:726181.1425, oth:45780.75 },
            rev:771961.8925, gp:559812.68752341, op:505835.38752341, dna:6721.6718375, ii:3656.17182573, eb:516213.25768664,
            earn:422141.99756979, tax:0.17, sh:22775.18183614 },
    2029: { line: { dc:960589.77675, oth:57225.94 },
            rev:1017815.71425, gp:740566.21783116, op:673024.37093116, dna:9739.8456775, ii:6250.46042315, eb:689014.70353181,
            earn:569845.99421762, tax:0.16, sh:22775.18183614 },
    2030: { line: { dc:1200737.2209375, oth:62948.53 },
            rev:1263685.7521875, gp:922569.60023873, op:844854.35019154, dna:13391.73515281, ii:15473.83540311, eb:873719.94724746,
            earn:721930.81177951, tax:0.16, sh:22775.18183614 }
  }
};
