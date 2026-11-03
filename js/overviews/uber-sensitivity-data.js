// uber-sensitivity-data.js — one Summit DCF snapshot of UBER, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit DCF model for UBER (model 4dbd6471), snapshot 2026-08-05 (after 2Q26 — the latest submit,
// the same one as the Results dataset and the last Target Multiple row), on 2026-11-03. Refresh by re-pulling when a new
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
  model: '4dbd6471-83b2-4fe7-9ceb-19cb249ff517', snapshot: '2026-08-05', after: '2Q26', pulled: '2026-11-03',
  y: {
    2026: { line: { mob:30052.55997, del:22203.548228, fr:5810.64 },
            gb:   { mob:118194.49, del:114417.34, fr:5795.64 },
            seg:  { mob:9011.467991, del:4884.78061016, fr:-97.3596, corp:-4486.2627 },
            rev:58066.7482, op:9312.6263, eb:11381.8565, earn:6870.6308, tax:0.2, sh:2009.4255 },
    2027: { line: { mob:34867.37455, del:28997.9306496, fr:6491.1168 },
            gb:   { mob:139469.4982, del:146454.1952, fr:6491.1168 },
            seg:  { mob:10808.8861105, del:6234.55508966, fr:-97.366752, corp:-5024.614224 },
            rev:70356.422, op:11921.4602, eb:15891.1144, earn:9656.3828, tax:0.2, sh:1939.0956 },
    2028: { line: { mob:43584.2181875, del:30316.0184064, fr:6491.1168 },
            gb:   { mob:174336.87275, del:168422.32448, fr:6491.1168 },
            seg:  { mob:13511.10763813, del:7579.0046016, fr:-64.911168, corp:-5125.10650848 },
            rev:80391.3534, op:15900.0946, eb:18455.4282, earn:13515.0804, tax:0.2, sh:1842.1408 },
    2029: { line: { mob:54480.27273438, del:34863.42116736, fr:6491.1168 },
            gb:   { mob:217921.0909375, del:193685.673152, fr:6491.1168 },
            seg:  { mob:16888.88454766, del:8715.85529184, fr:64.911168, corp:-5227.60863865 },
            rev:95834.8107, op:20442.0424, eb:22612.7363, earn:17375.736, tax:0.2, sh:1750.0338 }
  }
};
