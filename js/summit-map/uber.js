// summit-map/uber.js — what each label in the UBER Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only, never a number. Explanation and cross-checks: docs/profiles/UBER.md §1b.
// Not imported by the portal: it is the dictionary read when freezing Summit numbers into the data files (rule 10).
//
// Model: Summit MCP instrument UBER · US$ · millions · 5 submits (2025-12-15, 2026-02-05, 2026-05-06, 2026-08-05,
// 2026-11-04; the last one is after the 3Q26 print) · 67 labels (unchanged on 2026-11-04). Every label claims "USD · millions · sum" in the MCP; the real
// unit is written below. Reported periods are read from actuals_history only; projection_history keeps a frozen
// per-quarter pre-print projection back to 3Q22 in every submit.
// Doubts marked `doubt:` must be resolved before a unit uses that field (asked of the model's author).

export var summitMap = {
  ticker: 'UBER', currency: 'USD', scale: 'millions',
  approved: null,                                   // F0-SM gate: pending the analyst
  core: {
    rev:      { mcp: 'REV',            base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Revenue' },
    opinc:    { mcp: 'ADJ_OPINC',      base: 'non-GAAP', unit: 'usd_m',    agg: 'sum', label: 'Operating income (non-GAAP)',
                doubt: 'FY2025 reads 6,309 against 6,453 in the Results dataset (quarters tie: 2Q26 2,143)' },
    opinc_gaap:{ mcp: 'OP_INCOME',     base: 'GAAP?',    unit: 'usd_m',    agg: 'sum', label: 'Income from operations',
                doubt: '2Q26 reads 2,004 against a GAAP 1,890 in the release; quarterly projection rows were left at 0 in the Aug 5 submit' },
    ebitda:   { mcp: 'EBITDA',         base: 'adjusted', unit: 'usd_m',    agg: 'sum', label: 'Adjusted EBITDA',
                note: 'Uber is retiring Adjusted EBITDA (2Q26 release); quarterly forward rows are 0 in the Aug 5 submit, so forward EBITDA comes from the 2026-07-31 save (no longer listed by the MCP). Populated again in the 2026-11-04 submit' },
    earnings: { mcp: 'ADJ_NET_INCOME', base: 'non-GAAP', unit: 'usd_m',    agg: 'sum', label: 'Net income (non-GAAP)', note: 'EARNINGS is the same line annually (FY2025 5,237) and 0 quarterly' },
    net_income:{ mcp: 'GAAP_NET_INCOME', base: 'GAAP',   unit: 'usd_m',    agg: 'sum', label: 'Net income attributable (GAAP)', note: 'projection rows all 0 (2026-08-05 and 2026-11-04)' },
    eps:      { mcp: 'ADJ_EPS',        base: 'non-GAAP', unit: 'usd_per_share', agg: 'per-share', label: 'EPS (Non-GAAP)' },
    shares:   { mcp: 'SHARES',         base: 'diluted',  unit: 'shares_m', agg: 'end', label: 'Diluted shares', note: 'annual only; quarters 0 (still 0 on 2026-11-04)' },
    shares_out:{ mcp: 'SHARES_OUT',    base: 'basic, period end', unit: 'shares_m', agg: 'end', label: 'Shares outstanding' },
    capex:    { mcp: 'CAPEX',          base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Capex', note: 'negative = spend' },
    cfo:      { mcp: 'CFO',            base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Operating cash flow' },
    fcf:      { mcp: 'FCF',            base: 'company',  unit: 'usd_m',    agg: 'sum', label: 'Free cash flow', note: 'CFO less capex; forward quarterly rows 0 in the Aug 5 submit (filled in the 2026-11-04 submit). Annual rows exist twice: SEGM (the build-up, ties to the quarters for FY2026) and DEFAULT (higher; equals the workbook FCFE row 56)' },
    dna:      { mcp: 'DNA',            base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'D&A', note: 'negative sign' },
    sbc:      { mcp: 'SBC',            base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Stock-based compensation', note: 'negative sign' },
    int_inc:  { mcp: 'INT_INC',        base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Interest income', note: 'annual' },
    int_exp:  { mcp: 'INT_EXP',        base: 'GAAP',     unit: 'usd_m',    agg: 'sum', label: 'Interest expense', note: 'annual' },
    tax_rate: { mcp: 'TAX_RATE',       base: 'model',    unit: 'pct_fraction', agg: 'avg', label: 'Tax rate', note: '0.15 = 15%, annual' }
  },
  segment: [
    { key: 'mobility', label: 'Mobility', gb: 'MOBILITY_GB', rev: 'MOBILITY_REVENUE', opinc: 'MOBILITY_ADJ_OPINC', ebitda: 'MOBILITY_EBITDA', cfo: 'MOBILITY_CFO',
      note: 'MOBILITY_EBITDA splices segment operating income in from 1Q26 (basis break); MOBILITY_CFO is a model allocation, not reported' },
    { key: 'delivery', label: 'Delivery', gb: 'DELIVERY_GB', rev: 'DELIVERY_REVENUE', opinc: 'DELIVERY_ADJ_OPINC', ebitda: 'DELIVERY_EBITDA', cfo: 'DELIVERY_CFO',
      note: 'same EBITDA basis break; annual DELIVERY_EBITDA does not equal the sum of its quarters (audit list)' },
    { key: 'freight',  label: 'Freight',  gb: 'FREIGHT_GB',  rev: 'FREIGHT_REVENUE',  opinc: 'FREIGHT_ADJ_OPINC',  ebitda: 'FREIGHT_EBITDA' },
    { key: 'corporate', label: 'Corporate G&A and platform R&D', opinc: 'CORP_GNA_ADJ_OPINC', ebitda: 'CORP_GNA_EBITDA' }
  ],
  kpi: {
    trips:      { mcp: 'ORDERS',              unit: 'count_m', agg: 'sum', label: 'Trips', note: 'annual FY2026 row (12,260 < FY2025 actual 13,567) is unreliable: quarterly only' },
    mapc:       { mcp: 'USERS',               unit: 'count_m', agg: 'end', label: 'Monthly Active Platform Consumers' },
    gb_per_user:{ mcp: 'GB_PER_USER',         unit: 'usd',     agg: 'avg', label: 'Gross bookings per MAPC (model)' },
    one_users:  { mcp: 'ONE_MEMBERS_USERS',   unit: 'count_m', agg: 'end', label: 'Uber One members' },
    one_gb:     { mcp: 'ONE_GB',              unit: 'usd_m',   agg: 'sum', label: 'Gross bookings from Uber One members (model)' },
    one_spend:  { mcp: 'ONE_SPENDING',        unit: 'usd',     agg: 'avg', label: 'Spend per Uber One member (model)' },
    one_new_spend:{ mcp: 'NEW_UBER_ONE_SPENDING', unit: 'usd', agg: 'avg', label: 'Spend per new Uber One member (model)' },
    del_one_gb: { mcp: 'DELIVERY_GB_UBER_ONE', unit: 'usd_m',  agg: 'sum', label: 'Delivery gross bookings from members (model)' },
    non_users:  { mcp: 'NON_MEMBERS_USERS',   unit: 'count_m', agg: 'end', label: 'Non-member MAPCs (model)' },
    non_gb:     { mcp: 'NON_MEMBERS_GB',      unit: 'usd_m',   agg: 'sum', label: 'Gross bookings from non-members (model)' },
    non_spend:  { mcp: 'NON_MEMBERS_SPENDING', unit: 'usd',    agg: 'avg', label: 'Spend per non-member (model)' },
    buyback:    { mcp: 'SHR_BUYBACK',         unit: 'usd_m',   agg: 'sum', label: 'Share repurchases', note: 'negative = cash out' },
    ebitda_to_cfo:{ mcp: 'EBITDA_CFO',        unit: 'usd_m',   agg: 'sum', label: 'Cash conversion line (model)', doubt: 'what is EBITDA_CFO (FY2025 7,439)? not used' },
    insurance_cfo:{ mcp: 'INSURANCE_CFO',     unit: 'usd_m',   agg: 'sum', label: 'Insurance reserve cash flow (model)', note: 'equals AIR' }
  },
  guidance: {
    note: 'GB_LOW/HIGH_GUIDANCE, EBITDA_LOW/HIGH_GUIDANCE and EPS_LOW/HIGH_GUIDANCE exist but every cell is 0 (never entered): guidance is quoted from the releases'
  },
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST',
    note: 'annual Bloomberg pulls stored in the model on each submit date; quarters are 0. The Street in the portal comes from BBG_CONSENSUS.txt. doubt: in the 2026-11-04 submit the four rows sit one fiscal year late (FY2026 cell = the Street’s FY2027: revenue 66,602, EBITDA 13,779), also in DCF UBER.xlsm (Discounted Cash Flow rows 66–69)' },
  ignore: {
    GAI: 'zero in every period',
    SHR_BUYBACK_PRICE: 'mixes units (FY2025 79.5 $/share, 2Q26 1.51)',
    AIR: 'duplicate of INSURANCE_CFO',
    'LOTR, LTR, STR, STI, RCUR, RNCUR': 'balance-sheet auxiliaries (restricted cash, investments, tax items) feeding the DCF; no consumer in the portal'
  },
  valuation: {
    method: 'EV / EBITDA in all four submits (15x, 15x, 14x, 14x on 2027 Forward); P / E added in the Aug 5 submit (22x 2027 Forward)',
    quality: 'quality_flags empty in all four; Aug 5 PT/FV ratio 1.060 (EV/EBITDA) vs 1.064 (P/E): consistent'
  }
};
