// spot-sensitivity-data.js — one Summit DCF snapshot of SPOT, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-30, snapshot 2026-10-22 (after 3Q26; it replaced the
// 2026-08-05 snapshot pulled on 2026-10-20 — the values of that one are in docs/profiles/SPOT.md §14); refresh by
// re-pulling when a new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
// Labels per js/summit-map/spot.js, EUR millions (Spotify reports and the model is built in euros), projection_history:
//   seg.prem  PREMIUM_REVENUE (SEGM) · seg.ads  ADS_REVENUE (SEGM) — together they equal REV to the euro in every year
//   rev       REV (DEFAULT)
//   op        OP_INCOME (DEFAULT) — IFRS operating income
//   eb        EBITDA (DEFAULT) — the model's definition (op. income + D&A and other), so eb − op also carries non-operating items
//   earn      EARNINGS (DEFAULT) — the model's net-income definition (mixed base; summit-map doubt), NOT the IFRS figure
//   tax       TAX_RATE (fraction) · sh  SHARES (diluted, millions)
export var SPOT_SENS = {
  model: '9d5961bf-4181-46ab-9b39-2147981380e1', snapshot: '2026-10-22', after: '3Q26', pulled: '2026-10-30',
  y: {
    2026: { seg: { prem: 17652.08643039, ads: 1881.72061206 }, rev: 19533.80704245, op: 2880.57764364, eb: 3289.68550364, earn: 2743.1823264, tax: 0.12, sh: 207.08210948 },
    2027: { seg: { prem: 20587.62840377, ads: 2165.85069487 }, rev: 22753.47909864, op: 3825.0199933, eb: 4173.55599429, earn: 3163.27466133, tax: 0.22, sh: 203.65504596 },
    2028: { seg: { prem: 24011.35100731, ads: 2655.87919156 }, rev: 26667.23019887, op: 5071.97424627, eb: 5352.98004747, earn: 4212.67944425, tax: 0.22, sh: 200.22798244 },
    2029: { seg: { prem: 27669.45735591, ads: 3203.15480084 }, rev: 30872.61215675, op: 6756.06837836, eb: 7000.56245703, earn: 5601.01457316, tax: 0.22, sh: 200.22798244 }
  }
};

// Net cash for the EV → equity step, EUR millions (negative = net cash). The Summit model carries no net-debt line.
// Source: Q3 2026 update, Oct 22 2026: EUR 9.9 billion of cash and cash equivalents, restricted cash and short term
// investments at 30 Sep 2026 (the deck), and on the call the CFO: no debt other than lease liabilities. Rounded as
// stated; lease liabilities are not in it.
export var SPOT_NETCASH = { value: -9900, asOf: '2026-09-30', src: 'Q3 2026 update, Oct 22 2026 (rounded; cash, restricted cash and short term investments; excludes lease liabilities)' };
