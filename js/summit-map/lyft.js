// summit-map/lyft.js - what each label in the LYFT Summit DCF model means (docs/PROFILE_PLAYBOOK.md section 6.3).
// Names, definitions and units only, never a number. Explanation and cross-checks: docs/profiles/LYFT.md section 1b.
// Not imported by the portal: it is the dictionary read when freezing Summit numbers into the data files (rule 10).
//
// Source: DCF LYFT.xlsm (sheets Projection History / Actuals History), NOT the Summit MCP. 4 distinct submits
// (2025-12-15, 2026-02-11, 2026-05-08, 2026-08-07; the last one is stored twice). Actuals run through 2Q26.
// Valuation: EV / EBITDA only, target year 2027 Forward, in every submit.
// Doubts marked `doubt:` must be resolved before a unit uses that field (asked of the model's author).

export var summitMap = {
  ticker: 'LYFT', currency: 'USD', scale: 'millions',
  approved: '2026-11-04',                         // F0-SM gate
  core: {
    rev:      { code: 'REV',        base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Revenue' },
    ebitda:   { code: 'EBITDA',     base: 'adjusted', unit: 'usd_m',    agg: 'sum', label: 'Adjusted EBITDA',
                doubt: 'FY2026 reads 718.8 against ADJ_EBITDA 706.4' },
    earnings: { code: 'EARNINGS',   base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Net income (GAAP)', note: 'annual only; quarters 0' },
    shares:   { code: 'SHARES',     base: 'diluted',  unit: 'shares_m', agg: 'end', label: 'Diluted shares',
                doubt: 'FY2025 417.7 falls to 359.2 in FY2026; BBG has 396.8' },
    dna:      { code: 'DNA',        base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'D&A' },
    cfo:      { code: 'CFO',        base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Operating cash flow' },
    capex:    { code: 'CAPEX',      base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Capex', note: 'negative = spend',
                doubt: 'two definitions: core FY2025 -52.8 vs cost block -80.1' },
    fcf:      { code: 'FCF',        base: 'company',  unit: 'usd_m',    agg: 'sum', label: 'Free cash flow',
                doubt: 'two definitions: core FY2025 1,115.6 vs cost block 1,088.3; the profile today quotes +$1.12B' },
    opinc:    { code: 'OP_INCOME',  base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Operating income',
                doubt: 'the core row is 0 for FY2025-27; the cost-block row reads 23.3 / 198.6 / 509.4' },
    int_inc:  { code: 'INT_INC',    base: 'model',    unit: 'usd_m',    agg: 'sum', label: 'Interest income', doubt: '0 in every period' },
    int_exp:  { code: 'INT_EXP',    base: 'model',    unit: 'usd_m',    agg: 'sum', label: 'Interest expense', note: 'annual only' },
    tax_rate: { code: 'TAX_RATE',   base: 'model',    unit: 'pct_fraction', agg: 'avg', label: 'Tax rate', note: '0.15 = 15%, annual', doubt: '0.15 in FY2025 then 0.05' }
  },
  segment: [
    { key: 'rideshare', label: 'Rideshare / platform', rev: 'GB_REVENUE', gb: 'GROSS_BOOKINGS',
      doubt: 'GB_REVENUE + RENTALS_REVENUE (6,484.3 in FY2025) does not equal REV (6,316.3)' },
    { key: 'rentals',   label: 'Rentals', rev: 'RENTALS_REVENUE', note: '0 in the 2Q26 actual' }
  ],
  cost: {
    cogs: 'COGS', ops_support: 'OPERATION_SUPPORT_OPEX', rnd: 'RND_OPEX', snm: 'SNM_OPEX', gna: 'GNA_OPEX',
    ebitda_adj: 'ADJ_EBITDA',
    sbc: { cogs: 'SBC_COGS', ops_support: 'SBC_ONS', rnd: 'SBC_RND', snm: 'SBC_SNM', gna: 'SBC_GNA' }
  },
  kpi: {
    gb:             { code: 'GROSS_BOOKINGS',   unit: 'usd_m',   agg: 'sum', label: 'Gross Bookings' },
    rides:          { code: 'RIDES',            unit: 'count_m', agg: 'sum', label: 'Rides' },
    riders:         { code: 'RIDERS_ACTIVE',    unit: 'count_m', agg: 'end', label: 'Active riders' },
    rides_per_user: { code: 'RIDES_PER_USER',   unit: 'count',   agg: 'avg', label: 'Rides per active rider (model)' },
    gb_per_ride:    { code: 'GB_PER_RIDE',      unit: 'usd',     agg: 'avg', label: 'Gross Bookings per ride (model)' },
    cfo_ebitda:     { code: 'CFO_ADJ_EBITDA',   unit: 'usd_m',   agg: 'sum', label: 'Operating cash flow from Adj. EBITDA (model)' },
    cfo_ins:        { code: 'CFO_INSURANCE_RESERVES', unit: 'usd_m', agg: 'sum', label: 'Operating cash flow from insurance reserves (model)', note: 'appears twice (Direct)' },
    cfo_ins_ind:    { code: 'CFO_ACCRUED_LIAB', unit: 'usd_m',   agg: 'sum', label: 'Operating cash flow from accrued liabilities (model, Indirect)' },
    ins_reserves:   { code: 'INSURANCE_RESERVES', unit: 'usd_m', agg: 'end', label: 'Insurance reserves' }
  },
  guidance: {
    gb:     { low: 'GB_GUIDANCE_LOW',          high: 'GB_GUIDANCE_HIGH',          label: 'Gross Bookings guide' },
    ebitda: { low: 'ADJ_EBITDA_GUIDANCE_LOW',  high: 'ADJ_EBITDA_GUIDANCE_HIGH',  label: 'Adjusted EBITDA guide',
              note: '3Q26 range in the Aug 7 submit not yet checked against the 8-K' }
  },
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST' },
  // The valuation is not mapped (fixed fields). Only EV / EBITDA exists for LYFT; there is no P / E block in any submit.
  valuationUnreliable: [],
  valuationNote: 'EV / EBITDA only; PT/FV ratio varies across submits and there is no second method to cross-check',
  ignore: []
};
