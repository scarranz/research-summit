// amzn-sensitivity-data.js — one Summit DCF snapshot of AMZN, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for AMZN, snapshot 2026-08-04 (after 2Q26 — the same snapshot as the latest
// Target Multiple row), on 2026-10-29 (get_fundamentals, projection_history, annual periods). Refresh by re-pulling when a
// new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot). Labels per
// js/summit-map/amzn.js, US$ millions:
//   na / intl / aws   rev USREV · INTREV · AWS (they sum to REV exactly) · op OPINC · OPINC2 · OPINC3 (segment operating
//                     income; their sum is the model's operating income) · eb US_EBITDA · INT_EBITDA · AWS_EBITDA
//                     (segment operating income + segment D&A, NO SBC — annual only, summit-map doubt 2)
//   corp              CORP_OTHER_EBITDA (= CORP_OTHER_DNA: D&A not allocated to a segment). ⚠ 0 in 2029 in the model.
//   rev · eb          REV · EBITDA — the model's consolidated revenue and adjusted EBITDA (operating income + D&A + SBC),
//                     the EBITDA Target Multiple values. ⚠ The segment EBITDAs + corp do NOT sum to it (2027: $251.7B vs
//                     $332.7B): the consolidated line adds SBC, and its D&A (DNA, below) is larger than the segment D&A.
//   dna               DNA — the model's consolidated D&A (for the reconciliation in the footer only).
//   earn              EARNINGS — the model's adjusted earnings: (operating income + interest income − interest expense) ×
//                     (1 − TAX_RATE), without the non-operating gains.
//   tax               TAX_RATE (fraction) — 16% in 2026–2027 and 20% in 2028–2029 in this snapshot.
//   sh                SHARES — diluted, millions, held flat at the FY2025 count.
export var AMZN_SENS = {
  model: 'be6d6393-ae5b-4b62-b59b-883fc0e31dcb', snapshot: '2026-08-04', after: '2Q26', pulled: '2026-10-29',
  y: {
    2026: { na:{ rev:474879.66, op:37306.0457, eb:56832.9257 }, intl:{ rev:182768, op:6914.9196, eb:12734.9996 }, aws:{ rev:173476.12, op:65880.7154, eb:107692.8154 },
            corp:18853.3891, rev:831123.78, eb:250686.7223, dna:118954.3787, earn:92038.956, tax:0.16, sh:10827 },
    2027: { na:{ rev:519993.2277, op:46799.3905, eb:67247.8769 }, intl:{ rev:205614, op:8635.788, eb:15109.752 }, aws:{ rev:234192.762, op:84309.3943, eb:149525.6342 },
            corp:19822.9479, rev:959799.9897, eb:332725.5287, dna:168379.2933, earn:119053.4144, tax:0.16, sh:10827 },
    2028: { na:{ rev:571992.5505, op:51479.3295, eb:73566.9424 }, intl:{ rev:236456.1, op:10167.6123, eb:17338.8918 }, aws:{ rev:292740.9525, op:108314.1524, eb:183363.1838 },
            corp:40308.5449, rev:1101189.603, eb:430087.7403, dna:236845.9333, earn:137411.987, tax:0.2, sh:10827 },
    2029: { na:{ rev:629191.8055, op:56627.2625, eb:82722.9424 }, intl:{ rev:271924.515, op:11964.6787, eb:19797.1522 }, aws:{ rev:365926.1906, op:139051.9524, eb:235691.433 },
            corp:0, rev:1267042.5111, eb:531696.2946, dna:297567.4356, earn:169851.0738, tax:0.2, sh:10827 }
  }
};
