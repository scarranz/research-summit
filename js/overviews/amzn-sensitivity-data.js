// amzn-sensitivity-data.js — one Summit DCF snapshot of AMZN, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for AMZN, snapshot 2026-10-30 (after 3Q26 — the same snapshot as the latest
// Target Multiple row), on 2026-10-30 (get_fundamentals, projection_history, annual periods). Replaced the 2026-08-04 block
// (that snapshot stays in Target Multiple and Submit History as a vintage). Refresh by re-pulling when a
// new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot). Labels per
// js/summit-map/amzn.js, US$ millions:
//   na / intl / aws   rev USREV · INTREV · AWS (they sum to REV exactly) · op OPINC · OPINC2 · OPINC3 (segment operating
//                     income; their sum is the model's operating income) · eb US_EBITDA · INT_EBITDA · AWS_EBITDA
//                     (segment operating income + segment D&A, NO SBC — annual only, summit-map doubt 2)
//   corp              CORP_OTHER_EBITDA (= CORP_OTHER_DNA: D&A not allocated to a segment).
//   rev · eb          REV · EBITDA — the model's consolidated revenue and adjusted EBITDA (operating income + D&A + SBC),
//                     the EBITDA Target Multiple values. ⚠ The segment EBITDAs + corp do NOT sum to it (2027: $259.6B vs
//                     $280.1B): the consolidated line adds SBC. Its D&A (DNA, below) equals the segment + unallocated D&A from
//                     2027 in this snapshot (2026: $84.6B vs $86.0B); in 2026-08-04 it was far larger (2027: $168.4B).
//   dna               DNA — the model's consolidated D&A (for the reconciliation in the footer only).
//   earn              EARNINGS — the model's adjusted earnings: (operating income + interest income − interest expense) ×
//                     (1 − TAX_RATE), without the non-operating gains.
//   tax               TAX_RATE (fraction) — 20% in every year in this snapshot (2026-08-04: 16% in 2026–2027).
//   sh                SHARES — diluted, millions, held flat at the FY2025 count.
export var AMZN_SENS = {
  model: 'be6d6393-ae5b-4b62-b59b-883fc0e31dcb', snapshot: '2026-10-30', after: '3Q26', pulled: '2026-10-30',
  y: {
    2026: { na:{ rev:474234.13, op:38103.281, eb:57630.1611 }, intl:{ rev:181397.64, op:7085.7529, eb:12905.8329 }, aws:{ rev:176325.18, op:68258.6502, eb:110070.7502 },
            corp:18853.3891, rev:831956.95, eb:218164.1559, dna:84598.2123, earn:90332.9513, tax:0.2, sh:10827 },
    2027: { na:{ rev:521657.543, op:44340.8912, eb:64789.3776 }, intl:{ rev:199537.404, op:10575.4824, eb:17049.4464 }, aws:{ rev:246855.252, op:91336.4432, eb:156552.6832 },
            corp:21187.1329, rev:968050.199, eb:280123.5746, dna:113325.8233, earn:117182.2364, tax:0.2, sh:10827 },
    2028: { na:{ rev:568606.7219, op:51174.605, eb:73262.2178 }, intl:{ rev:217495.7704, op:14137.2251, eb:21308.5046 }, aws:{ rev:345597.3528, op:127871.0205, eb:202920.0519 },
            corp:42431.7108, rev:1131699.845, eb:361508.376, dna:146739.6345, earn:153476.8995, tax:0.2, sh:10827 },
    2029: { na:{ rev:619781.3268, op:58879.226, eb:84974.906 }, intl:{ rev:250120.1359, op:17508.4095, eb:25340.8831 }, aws:{ rev:449276.5586, op:170725.0923, eb:267364.5729 },
            corp:56745.17, rev:1319178.0214, eb:461227.1643, dna:187312.8041, earn:195460.0998, tax:0.2, sh:10827 }
  }
};
