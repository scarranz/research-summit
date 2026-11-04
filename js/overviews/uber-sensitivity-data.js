// uber-sensitivity-data.js — one Summit DCF snapshot of UBER, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for UBER (model 4dbd6471), snapshot 2026-11-04 (after 3Q26 — the latest submit,
// the same one as the Results dataset's forward periods and the last Target Multiple row), on 2026-11-04 (replaced the
// 2026-08-05 block pulled on 2026-11-03). Refresh by re-pulling when a new
// snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot). Labels per
// js/summit-map/uber.js, US$ millions, projection_history:
//   line.*  MOBILITY_REVENUE · DELIVERY_REVENUE · FREIGHT_REVENUE — the three sum to the model's REV in every year.
//   gb.*    MOBILITY_GB · DELIVERY_GB · FREIGHT_GB (gross bookings), for the record and the assumption strip; the grid's
//           drivers are revenue, as in every copy of this pane.
//   seg.*   MOBILITY_ADJ_OPINC · DELIVERY_ADJ_OPINC · FREIGHT_ADJ_OPINC · CORP_GNA_ADJ_OPINC (segment operating income,
//           non-GAAP; corporate G&A and platform R&D is the negative fourth line) — they sum to ADJ_OPINC. Kept for the
//           record; the margin driver stays consolidated, as in the GOOGL copy.
//   rev     REV · op ADJ_OPINC (Uber's non-GAAP operating income; the model's OP_INCOME row is 0 in every projected year)
//           · eb EBITDA (Adjusted EBITDA, the line Target Multiple values) · earn EARNINGS (Non-GAAP net income) ·
//           tax TAX_RATE (fraction) · sh SHARES (diluted, millions — falling with buybacks in the model).
export var UBER_SENS = {
  model: '4dbd6471-83b2-4fe7-9ceb-19cb249ff517', snapshot: '2026-11-04', after: '3Q26', pulled: '2026-11-04',
  y: {
    2026: { line: { mob:29873.53468, del:21851.0349, fr:6446 },
            gb:   { mob:117275.56, del:113019.82, fr:6441 },
            seg:  { mob:9063.760404, del:4807.227678, fr:-113.52, corp:-4376.46 },
            rev:58170.5696, op:9381.0081, eb:11458.753, earn:6909.9189, tax:0.2, sh:2029.8208 },
    2027: { line: { mob:35182.668, del:27989.358423, fr:7213.92 },
            gb:   { mob:140730.672, del:143535.1714, fr:7213.92 },
            seg:  { mob:10906.62708, del:6017.71206095, fr:-108.2088, corp:-4901.6352 },
            rev:70385.9464, op:11914.4951, eb:14677.97, earn:9293.3062, tax:0.2, sh:1989.2243 },
    2028: { line: { mob:42219.2016, del:34907.75368448, fr:7213.92 },
            gb:   { mob:168876.8064, del:183725.019392, fr:7213.92 },
            seg:  { mob:13087.952496, del:7784.42907164, fr:-72.1392, corp:-4999.667904 },
            rev:84340.8753, op:15800.5745, eb:18239.8278, earn:12640.4596, tax:0.2, sh:1949.4399 },
    2029: { line: { mob:52774.002, del:38031.07901414, fr:7213.92 },
            gb:   { mob:211096.008, del:211283.7723008, fr:7213.92 },
            seg:  { mob:16359.94062, del:9507.76975354, fr:72.1392, corp:-5099.66126208 },
            rev:98019.001, op:20840.1883, eb:24500.9079, earn:17714.1601, tax:0.2, sh:1851.9679 }
  }
};
