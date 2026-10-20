// spot-sensitivity-data.js — one Summit DCF snapshot of SPOT, the base of Valuation ▸ Sensitivity (VA-SENS,
// docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-20, snapshot 2026-08-05 (after 2Q26); refresh by
// re-pulling when a new snapshot is submitted (replace the block and its date — Sensitivity reads ONE snapshot).
// Labels per js/summit-map/spot.js, EUR millions (Spotify reports and the model is built in euros), projection_history:
//   seg.prem  PREMIUM_REVENUE (SEGM) · seg.ads  ADS_REVENUE (SEGM) — together they equal REV to the euro in every year
//   rev       REV (DEFAULT)
//   op        OP_INCOME (DEFAULT) — IFRS operating income
//   eb        EBITDA (DEFAULT) — the model's definition (op. income + D&A and other), so eb − op also carries non-operating items
//   earn      EARNINGS (DEFAULT) — the model's net-income definition (mixed base; summit-map doubt), NOT the IFRS figure
//   tax       TAX_RATE (fraction) · sh  SHARES (diluted, millions)
export var SPOT_SENS = {
  model: '9d5961bf-4181-46ab-9b39-2147981380e1', snapshot: '2026-08-05', after: '2Q26', pulled: '2026-10-20',
  y: {
    2026: { seg: { prem: 17829.001005, ads: 1932.54296797 }, rev: 19761.54397297, op: 2969.73037586, eb: 3345.45938826, earn: 2821.63673076, tax: 0.12, sh: 206.36349383 },
    2027: { seg: { prem: 20884.80687725, ads: 2234.03785213 }, rev: 23118.84472938, op: 3914.0340267, eb: 4258.223604, earn: 3234.7830734, tax: 0.22, sh: 202.21781467 },
    2028: { seg: { prem: 24357.95026094, ads: 2739.49384353 }, rev: 27097.44410447, op: 5259.74111029, eb: 5535.32803493, earn: 4363.44402511, tax: 0.22, sh: 198.0721355 },
    2029: { seg: { prem: 28068.86067415, ads: 3303.99924992 }, rev: 31372.85992407, op: 6768.70477619, eb: 7007.19960592, earn: 5619.28121601, tax: 0.22, sh: 198.0721355 }
  }
};

// Net cash for the EV → equity step, EUR millions (negative = net cash). The Summit model carries no net-debt line.
// Source: Q2 2026 earnings call, Aug 4 2026, CFO: "As at close of the quarter, we had €9.4 billion cash and cash
// equivalents and no debt other than lease liabilities." Rounded as stated; lease liabilities and short-term
// investments are not in it.
export var SPOT_NETCASH = { value: -9400, asOf: '2026-06-30', src: 'Q2 2026 call, Aug 4 2026 (rounded; excludes lease liabilities and short-term investments)' };
