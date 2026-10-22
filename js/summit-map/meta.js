// summit-map/meta.js — what each label in the META Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the 10-K cross-checks
// are in docs/profiles/META.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live — SAB, Oct 15 2026).
//
// Model: G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\META\DCF META.xlsm. Snapshots 2025-12-15 → 2026-08-04.
// Three sources inside the model:
//  · DEFAULT — company totals. Actuals = 10-K GAAP. Projections ANNUAL ONLY, except REV (quarterly to 4Q26).
//  · SEGM    — Family of Apps / Reality Labs and the ad/other revenue split; guidance. Segment op-income
//              projections stop at 4Q25 (quarterly) and at 2026 (annual).
//  · BBG     — Bloomberg consensus held inside the model (annual).
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'META', currency: 'USD', scale: 'millions',
  approved: '2026-10-20',                          // F0-SM gate (SAB)
  core: {
    rev:      { mcp: 'REV',       base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'Revenue',
                doubt: '2027 quarters broken in the 2026-08-04 snapshot (1Q27 and 4Q27 hold values of the wrong scale): do not use 2027 quarters' },
    ebitda:   { mcp: 'EBITDA',    base: 'adjusted (Bloomberg comparable)', unit: 'usd_m', agg: 'sum', label: 'EBITDA (adj.)',
                note: 'FY25 actual does not equal GAAP op. income + D&A; it adds back SBC and one-offs (META.md §1b). Annual only' },
    opinc:    { mcp: 'OP_INCOME', base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'Operating income', note: 'annual only' },
    earnings: { mcp: 'EARNINGS',  base: 'mixed', unit: 'usd_m',    agg: 'sum', label: 'Net income',
                note: 'actuals = GAAP; projections = model-normalized (FY25 projection excludes the one-time OBBBA deferred-tax charge, META.md §1b). Label it "Model earnings (adj.)". Annual only' },
    shares:   { mcp: 'SHARES',    base: 'diluted', unit: 'shares_m', agg: 'end', label: 'Diluted shares',
                note: 'projections held flat at the last actual' },
    dna:      { mcp: 'DNA',       base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'D&A' },
    cfo:      { mcp: 'CFO',       base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'Cash from operations' },
    capex:    { mcp: 'CAPEX',     base: 'GAAP (purchases of P&E)', unit: 'usd_m', agg: 'sum', label: 'Capex', sign: 'negative' },
    fcf:      { mcp: 'FCF',       base: 'model (CFO − capex)', unit: 'usd_m', agg: 'sum', label: 'Free cash flow' },
    int_inc:  { mcp: 'INT_INC',   base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'Interest income' },
    int_exp:  { mcp: 'INT_EXP',   base: 'GAAP',  unit: 'usd_m',    agg: 'sum', label: 'Interest expense' },
    tax_rate: { mcp: 'TAX_RATE',  base: 'effective', unit: 'pct',  agg: 'avg', label: 'Effective tax rate',
                note: 'decimal (e.g. 0.15 = 15%)' }
  },
  segments: [
    { key: 'foa', label: 'Family of Apps', rev: 'FoA_Revenue', opinc: 'FA_OP_INCOME',
      doubt: 'FA_OP_INCOME projections stop at 2026 (2027+ = 0) and quarterly at 4Q25' },
    { key: 'foa.ads',   label: 'Advertising', rev: 'ADV_REVENUE' },
    { key: 'foa.other', label: 'Other revenue', rev: 'OTH_REVENUE' },
    { key: 'rl',  label: 'Reality Labs', rev: 'RL_REVENUE', opinc: 'RL_OP_INCOME',
      doubt: 'RL_OP_INCOME projections stop at 2026 (2027+ = 0) and quarterly at 4Q25' }
  ],
  // KPI block: filled in the 2026-02-03 snapshot (DAP and ARPP tie to the 4Q25 8-K, see META.md §1b),
  // but ALL ZERO in the 2026-08-04 snapshot and in the current workbook. Every KPI carries that doubt.
  kpis: [
    { key: 'dap',          label: 'Family daily active people (DAP)', mcp: 'DAP',             unit: 'people_m', agg: 'end' },
    { key: 'dap_growth',   label: 'DAP growth',                       mcp: 'DAP_GROWTH',      unit: 'pct',      agg: 'avg' },
    { key: 'arpp',         label: 'Average revenue per person (ARPP)', mcp: 'AVG_ARPU',       unit: 'usd',      agg: 'sum' },
    { key: 'foa_rev_dap',  label: 'Family of Apps revenue per person', mcp: 'FOA_REV_DAP',    unit: 'usd',      agg: 'sum' },
    { key: 'core_rev_dap', label: 'Core FoA revenue per person',       mcp: 'CORE_REV_DAP',   unit: 'usd',      agg: 'sum' },
    { key: 'wa_rev_dap',   label: 'WhatsApp revenue per person',       mcp: 'WA_REV_DAP',     unit: 'usd',      agg: 'sum' },
    { key: 'core_arpu_g',  label: 'Core FoA ARPU growth',              mcp: 'CORE_ARPU_GROWTH', unit: 'pct',    agg: 'avg' },
    { key: 'ad_rev_g',     label: 'Total advertising revenue growth',  mcp: 'TOTAL_ADV_REV_GROWTH', unit: 'pct', agg: 'avg' },
    { key: 'emp_rev',      label: 'Revenue per employee',              mcp: 'PER_EMPLOYEE_REV',   unit: 'usd',  agg: 'sum' },
    { key: 'emp_opex',     label: 'Opex per employee',                 mcp: 'PER_EMPLOYEE_OPEX',  unit: 'usd',  agg: 'sum' },
    { key: 'emp_opinc',    label: 'Operating income per employee',     mcp: 'PER_EMPLOYEE_OPINC', unit: 'usd',  agg: 'sum' }
  ].map(function(k){ k.doubt = 'empty (0) in the 2026-08-04 snapshot; filled in 2026-02-03 — units and the break to confirm with the model author'; return k; }),
  guidance: [
    { key: 'rev', low: 'REVENUE_GUIDANCE_LOW', high: 'REVENUE_GUIDANCE_HIGH', unit: 'usd_m', periods: 'quarterly',
      note: 'next-quarter guide from the prior 8-K; 3Q26 guide not yet entered in the 2026-08-04 snapshot' }
  ],
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST' },
  valuationUnreliable: [],                         // no valuation in the MCP for META yet (META.md §6)
  ignore: []
};
