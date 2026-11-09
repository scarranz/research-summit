// summit-map/nvda.js — what each label in the NVDA Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the 10-K cross-checks
// are in docs/profiles/NVDA.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live — SAB, Oct 15 2026).
//
// Model: G:\My Drive\Summit\Docs\Research\DCF\Semiconductors - SAB\NVDA\DCF NVDA.xlsm (SAB's own model).
// Snapshots 2025-12-12 (after Q3 FY26) · 2026-03-04 (after Q4 FY26) · 2026-08-28 (after Q2 FY27). 33 labels.
// FISCAL YEARS: NVIDIA's year ends the last Sunday of January. MCP period '2026' = FY2026 (Feb 2025 → Jan 2026);
// '2027Q2' = Q2 FY27 (quarter ended late Jul 2026). Every label in the portal is fiscal (FY27, 2Q FY27).
// Three sources inside the model:
//  · DEFAULT — company totals. Actuals = 10-K. Projections ANNUAL ONLY.
//  · SEGM    — revenue by market platform, gross/operating profit (GAAP and adj.), SBC, acquisition-related
//              costs, guidance, and the QUARTERLY projections (REV is also quarterly).
//  · BBG     — Bloomberg consensus held inside the model (annual).
// Rule for every label: a REPORTED period is read from `actuals_history` only.
// "Adjusted" in this model = GAAP + acquisition-related costs (AR_COGS + AR_OPEX); SBC is NOT added back in the
// 2026-08-28 snapshot. The 2025-12-12 snapshot also added back SBC (NVDA.md §1b, doubt 1).
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'NVDA', currency: 'USD', scale: 'millions', fiscalYearEnd: 'last Sunday of January',
  approved: '2026-11-02',                         // F0-SM gate (SAB)
  core: {
    rev:        { mcp: 'REV', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Revenue', note: 'annual and quarterly' },
    gp:         { mcp: 'GAAP_GROSS_PROFIT', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Gross profit' },
    gp_adj:     { mcp: 'ADJ_GROSS_PROFIT', base: 'adjusted', unit: 'usd_m', agg: 'sum', label: 'Gross profit (adj.)',
                  doubt: 'FY26 = GAAP + AR_COGS; Q2 FY27 = GAAP + AR_COGS + SBC_COGS — the definition is not the same in one snapshot (doubt 2)' },
    opinc:      { mcp: 'GAAP_OP_INCOME', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Operating income' },
    opinc_adj:  { mcp: 'OP_INCOME', base: 'adjusted (GAAP + acquisition-related)', unit: 'usd_m', agg: 'sum',
                  label: 'Operating income (adj.)', note: 'the DCF driver; ADJ_OP_INCOME (SEGM) holds the same values',
                  doubt: 'in 2025-12-12 it also added back SBC (doubt 1)' },
    ebitda:     { mcp: 'EBITDA', base: 'model', unit: 'usd_m', agg: 'sum', label: 'EBITDA (model)',
                  note: '= adj. op. income + D&A + interest income (+ other non-operating income in actuals: FY26 includes the gains on equity securities). Not GAAP, not NVIDIA non-GAAP',
                  doubt: 'interest income and investment gains inside EBITDA — intended? (doubt 3)' },
    earnings:   { mcp: 'EARNINGS', base: 'adjusted', unit: 'usd_m', agg: 'sum', label: 'Model earnings (adj.)',
                  note: 'projections = (adj. op. income + interest income − interest expense) × (1 − TAX_RATE); actuals = GAAP net income + acquisition-related costs (pre-tax)',
                  doubt: 'in 2025-12-12 actuals also added back SBC (doubt 1)' },
    dna:        { mcp: 'DNA', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Depreciation & amortization', note: 'annual only' },
    capex:      { mcp: 'CAPEX', base: 'GAAP (purchases of P&E and intangibles)', unit: 'usd_m', agg: 'sum', label: 'Capex', sign: 'negative',
                  note: 'annual in DEFAULT; the quarterly actual sits in SEGM' },
    cfo:        { mcp: 'CFO', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Cash from operations', note: 'annual only' },
    fcf:        { mcp: 'FCF', base: 'model (CFO − capex)', unit: 'usd_m', agg: 'sum', label: 'Free cash flow', note: 'annual only' },
    int_inc:    { mcp: 'INT_INC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest income', note: 'annual only' },
    int_exp:    { mcp: 'INT_EXP', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest expense', note: 'annual only' },
    tax_rate:   { mcp: 'TAX_RATE', base: 'model', unit: 'pct', agg: 'avg', label: 'Tax rate (model)',
                  note: 'decimal. Actual = GAAP tax ÷ (pre-tax income + acquisition-related costs), so a hair under the 10-K effective rate' },
    shares:     { mcp: 'SHARES', base: 'diluted', unit: 'shares_m', agg: 'end', label: 'Diluted shares', note: 'annual only' },
    sbc_cogs:   { mcp: 'SBC_COGS', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'SBC in cost of revenue', sign: 'positive',
                  note: 'actuals only (annual + quarterly)' },
    sbc_opex:   { mcp: 'SBC_OPEX', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'SBC in operating expenses', sign: 'negative',
                  note: 'actuals only; SBC_COGS + |SBC_OPEX| = 10-K SBC' },
    ar_cogs:    { mcp: 'AR_COGS', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Acquisition-related costs in cost of revenue', sign: 'positive' },
    ar_opex:    { mcp: 'AR_OPEX', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Acquisition-related costs in operating expenses', sign: 'negative' }
  },
  // Revenue by market platform (the old framework, as reported through FY2026). Only Data Center is projected;
  // the new framework (Hyperscale · ACIE · Edge, from Q1 FY27) is NOT in the model.
  segments: [
    { key: 'dc',   label: 'Data Center',                rev: 'DC_REVENUE',   note: 'actuals + projections, annual and quarterly' },
    { key: 'comp', label: 'Data Center — Compute',      rev: 'COMP_REVENUE', parent: 'dc', note: 'actuals only' },
    { key: 'netw', label: 'Data Center — Networking',   rev: 'NETW_REVENUE', parent: 'dc', note: 'actuals only' },
    { key: 'gmng', label: 'Gaming',                     rev: 'GMNG_REVENUE', note: 'actuals only' },
    { key: 'pv',   label: 'Professional Visualization', rev: 'PV_REVENUE',   note: 'actuals only' },
    { key: 'auto', label: 'Automotive',                 rev: 'AUTO_REVENUE', note: 'actuals only' },
    { key: 'oem',  label: 'OEM & Other',                rev: 'OEM_REVENUE',  note: 'actuals only' }
  ],
  kpis: [],
  guidance: [
    { key: 'rev', label: 'Revenue guidance', low: 'REVENUE_GUIDANCE_LOW', high: 'REVENUE_GUIDANCE_HIGH', period: 'quarterly',
      note: 'the next quarter\'s outlook (midpoint ±2%)' }
  ],
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST' },
  valuationUnreliable: [],                         // 3 submits, no quality_flags (2026-11-02)
  ignore: [
    { mcp: 'ADJ_OP_INCOME', why: 'same values as OP_INCOME (SEGM copy of the DCF driver)' }
  ]
};
