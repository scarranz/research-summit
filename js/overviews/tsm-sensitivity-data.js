// tsm-sensitivity-data.js — one Summit DCF snapshot of TSM, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store on 2026-10-30, snapshot 2026-10-19 (after 3Q26) — it replaced the
// 2026-10-15 block pulled 2026-10-16 (the 10-15 vintage stays in tsm-target-multiple-data.js and submits-data/tsm.js).
// Refresh by re-pulling when a new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
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
  model: 'e35f84c0-651c-4b14-8295-5af638089cc8', snapshot: '2026-10-19', after: '3Q26', pulled: '2026-10-30',
  y: {
    2026: { plat: { hpc:116231.41, smart:41150.67, iot:8214.10, auto:6666.24, dce:1618.21 }, rev:173880.63, op: 99506.96, eb:138703.17, earn: 87697.97, tax:0.175, sh:5186.474 },
    2027: { plat: { hpc:168535.54, smart:47323.27, iot:10267.63, auto:7666.18, dce:1860.94 }, rev:235653.56, op:136427.73, eb:180870.52, earn:115217.79, tax:0.175, sh:5186.474 },
    2028: { plat: { hpc:227522.99, smart:53002.06, iot:11294.39, auto:8816.10, dce:2047.04 }, rev:302682.57, op:173814.24, eb:229675.87, earn:146454.55, tax:0.175, sh:5186.474 },
    2029: { plat: { hpc:295779.88, smart:59362.31, iot:12423.83, auto:10138.52, dce:2251.74 }, rev:379956.27, op:217920.93, eb:289022.28, earn:184127.05, tax:0.175, sh:5186.474 }
  }
};
