// tsm-sensitivity-data.js — one Summit DCF snapshot of TSM, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-16, snapshot 2026-10-15 (after 3Q26); refresh by
// re-pulling when a new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
// Labels per js/summit-map/tsm.js, US$ millions, projection_history:
//   plat.*   PLAT_HPC_REV · PLAT_SMARTPH_REV · PLAT_IOT_REV · PLAT_AUTO_REV · PLAT_DCE_REV (source SEGM)
//   rev      REV (DEFAULT) — from 2026 it equals the sum of the five platforms above to the dollar.
//   op       SEGM_OPINC — operating income in reported US$ (the DEFAULT OP_INCOME projection is empty; F0-SM doubt)
//   eb       EBITDA (DEFAULT) — the model's definition ≈ EBT + interest + D&A, so eb − op also carries non-operating items
//   earn     EARNINGS (DEFAULT) — net income attributable to the parent
//   tax      TAX_RATE (fraction) · sh  SHARES (ADR-equivalent, millions)
// Open doubt for the model author (logged in docs/profiles/TSM.md): PLAT_OTHER_REV ("Others", $3.3B in 2026) is
// projected but is NOT inside REV from 2026 on — in TSMC's reported figures "Others" is part of net revenue.
export var TSM_SENS = {
  model: 'e35f84c0-651c-4b14-8295-5af638089cc8', snapshot: '2026-10-15', after: '3Q26', pulled: '2026-10-16',
  y: {
    2026: { plat: { hpc:110318.77, smart:41150.67, iot:8214.10, auto:6666.24, dce:1558.21 }, rev:167907.99, op: 96109.84, eb:133913.31, earn: 84061.61, tax:0.17, sh:5186.474 },
    2027: { plat: { hpc:159962.22, smart:47323.27, iot:10267.62, auto:7666.18, dce:1791.94 }, rev:227011.23, op:129145.02, eb:172812.91, earn:109184.11, tax:0.17, sh:5186.474 },
    2028: { plat: { hpc:215948.99, smart:53002.06, iot:11294.39, auto:8816.10, dce:1971.14 }, rev:291032.68, op:165631.20, eb:220186.27, earn:142629.85, tax:0.16, sh:5186.474 },
    2029: { plat: { hpc:280733.69, smart:59362.31, iot:12423.83, auto:10138.52, dce:2168.25 }, rev:364826.59, op:209174.19, eb:278368.37, earn:180633.24, tax:0.16, sh:5186.474 }
  }
};
