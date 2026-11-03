// summit-map/tbbb.js — what each label in the TBBB Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only, never a number. Explanation and cross-checks: docs/profiles/TBBB.md §1b.
// Not imported by the portal: it is the dictionary read when freezing Summit numbers into the data files (rule 10).
//
// Model: local workbook DCF TBBB.xlsm (tab Projection History, read 2026-11-02; the Summit MCP was not reachable in this
// session) · Mexican pesos · millions · 4 submits (2025-12-12, 2026-03-13, 2026-05-08, 2026-08-13; the 2026-11-02 block in the tab is not a submit) · 56 labels.
// The tab stacks the five submits in blocks of 56 rows (newest first); the quarterly columns of a reported quarter hold the
// model's frozen pre-print projection, not the actual. Actuals live in the same workbook (Actuals History) and the Aug 13 block
// of Projection History also carries a pasted "actual" copy of them.
// ⚠ Everything is pesos (reported and modelled); the share price and targets are US$ (Currency FX column, Ps.17.0 to 18.6 per US$).
// Sources inside the model: DEFAULT (company totals, annual), SEGM (cost lines, KPIs, balance items; quarterly + annual),
// BBG (Bloomberg consensus held in the model: all zero in every submit, not used).
// Doubts marked `doubt:` must be resolved before a unit uses that field (asked of the model's author).

export var summitMap = {
  ticker: 'TBBB', currency: 'MXN', scale: 'millions',
  approved: null,                                   // F0-SM gate: pending the analyst
  core: {
    rev:      { mcp: 'REV',        base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Revenue', note: 'annual only in the projection blocks (quarters are 0 except the first submit, where the row is named SEG_REV); quarterly revenue is not available from Summit' },
    ebitda:   { mcp: 'EBITDA',     base: 'model (lease-adjusted)', unit: 'mxn_m', agg: 'sum', label: 'EBITDA',
                doubt: 'does not tie to reported EBITDA (FY2025 1,224) or the company adjusted EBITDA (4,384 with the write-off). Its FY2025 value is -18 in the Mar 13 and May 8 submits and 1,921 in the Aug 13 and Nov 2 submits, and FY2027 fell 5,762 to 3,839 between May 8 and Aug 13 with revenue unchanged: the definition changed. Not shown as a comparable line; used only as the EV/EBITDA basis in Submit History. Ask the author what it is (after lease cost? which SBC treatment?)' },
    opinc:    { mcp: 'OP_INCOME',  base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Operating income', note: 'actual years only (FY2025 -675); forward years are 0' },
    earnings: { mcp: 'EARNINGS',   base: 'model definition', unit: 'mxn_m', agg: 'sum', label: 'Net income',
                doubt: 'FY2025 reads -2,276 in the model against -2,840 reported (IFRS); forward years are the model definition. Labelled "model earnings" wherever shown' },
    shares:   { mcp: 'SHARES',     base: 'diluted (model)', unit: 'shares_m', agg: 'end', label: 'Diluted shares',
                doubt: 'projected at 115.0M (139.6M in the first submit) against 162.5M diluted in the 3Q26 release and a 165.4M fully diluted count: EPS built from it is not comparable' },
    dna:      { mcp: 'DNA',        base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'D&A', note: 'annual' },
    capex:    { mcp: 'CAPEX',      base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Capex',
                doubt: 'the unconfirmed Nov 2 block holds per-store ratios (1.4, -1.8, -2.4) instead of pesos; the Aug 13 submit row (-4,546 for 2026) is in pesos. Quarterly rows are populated but mix frozen and new values' },
    fcf:      { mcp: 'FCF',        base: 'model', unit: 'mxn_m', agg: 'sum', label: 'Free cash flow', note: 'quarterly only (annual is 0)' },
    cfo:      { mcp: 'CFO',        base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Operating cash flow', note: 'actuals only; projections are 0' },
    sbc:      { mcp: 'SBC',        base: 'company schedule', unit: 'mxn_m', agg: 'sum', label: 'Stock-based compensation', note: 'annual 2026-2029 (2,391 / 882 / 216 / 50) and quarterly to 4Q27; tracks the company graded-vesting schedule (2,376 / 879 / 215 / 50 in the 3Q26 release)' },
    int_inc:  { mcp: 'INT_INC',    base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Financial income', note: 'annual' },
    int_exp:  { mcp: 'INT_EXP',    base: 'IFRS', unit: 'mxn_m', agg: 'sum', label: 'Financial costs', note: 'annual' },
    tax_rate: { mcp: 'TAX_RATE',   base: 'model', unit: 'pct', agg: 'avg', label: 'Tax rate', note: 'annual, 5% in every projected year' }
  },
  segment: {},
  kpi: {
    sss:      { mcp: 'SSS',        unit: 'pct_fraction', label: 'Same-store sales growth', note: '0.18 = 18%; quarterly and annual' },
    stores:   { mcp: 'EYS',        unit: 'count', label: 'Stores at period end', note: 'projections are fractional (3,768.96); round for display' },
    dcs:      { mcp: 'DC',         unit: 'count', label: 'Distribution centers', note: 'fractional in projections' },
    spdc:     { mcp: 'SPDC',       unit: 'count', label: 'Stores per DC' },
    gp:       { mcp: 'GROSS_PROFIT', unit: 'mxn_m', label: 'Gross profit', note: 'quarterly + annual; ties to reported for actual periods' },
    sales:    { mcp: 'SALES_EXP',  unit: 'mxn_m', label: 'Sales expenses', note: 'quarterly + annual' },
    admin:    { mcp: 'ADMIN_EXP',  unit: 'mxn_m', label: 'Administrative expenses', note: 'includes SBC (reported basis); quarterly + annual' },
    dppe:     { mcp: 'DPPE',       unit: 'mxn_m', label: 'Depreciation of PP&E', note: 'annual and quarterly; equals D&A in projection rows' },
    employees:{ mcp: 'Employees',  unit: 'count', label: 'Employees', note: 'annual' },
    ats:      { mcp: 'ATS',        unit: 'mxn', label: 'Average ticket' },
    tnt:      { mcp: 'TNT',        unit: 'count_m', label: 'Total transactions (millions)' },
    cpens:    { mcp: 'CPENS',      unit: 'mxn_m', label: 'Capex per new store' },
    cpenc:    { mcp: 'CPENC',      unit: 'mxn_m', label: 'Capex per new DC' },
    days:     { mcp: 'DI / DP / DR / CCC', unit: 'days', label: 'Inventory, payable, receivable days and cash conversion cycle', note: 'annual' },
    leases:   { mcp: 'ROU / LL',   unit: 'mxn_m', label: 'Right-of-use assets and lease liabilities', note: 'ROU projected annually; LL is 0 in projections' }
  },
  guidance: {},
  consensus: {
    note: 'REV_BBG_EST, EBITDA_BBG_EST, SHARES_BBG_EST, EARNINGS_BBG_EST are 0 in every submit; the Street comes from BBG_CONSENSUS.txt instead'
  },
  ignore: {
    ADJ_EBITDA: 'model reconstruction after lease cost (FY2024 1,965; FY2025 3,757 does not tie to the company adjusted 4,384 or to adjusted less building leases 2,551)',
    ADJ_CFO: 'quarterly projection values are ~0 (units broken); annual only',
    OP_INC_LESS_LEASE: 'derived (operating income less lease cost); not a reported line',
    'SOE, APD, ATPS, SALES-EXPPS, ADMIN_EXPPS, LIPS, AUV_EXS, AUV_NEW, BRP, PLP, SP, SUPP, CASH, STBD, STD, OI_NET': 'auxiliary model rows: per-store ratios, product-mix counts and balance items; no consumer in the portal yet'
  },
  valuation: {
    method: 'EV / EBITDA only (the DNA, REV and OP_INCOME rows carry it). The P/E block is #VALUE! / #SPILL! in every submit (-US$78 in the first): unusable.',
    case: 'the workbook labels the same EV/EBITDA valuation Base on the D&A row and Bull on the REV row of the same submit: shown as Base',
    targetYear: '2027 at 25x in the first three submits, 2028 at 30x in the last',
    doubt: 'PT / FV discount factors (1.144, 1.060, 1.050, 1.068) vary with WACC and timing; with one method per submit the PT-to-FV consistency test cannot be run'
  }
};
