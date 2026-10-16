// summit-map/tsm.js — what each label in the TSM Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the filing cross-checks
// are in docs/profiles/TSM.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live — SAB, Oct 15 2026).
//
// The model carries two US$ bases:
//  · DEFAULT — the 20-F's NT$ divided by the model's FX (see TSM.md §1b). Annual + quarterly.
//  · SEGM    — the US$ figures TSMC publishes each quarter (Management Report). Quarterly is the
//              reliable series there; the SEGM annuals do not equal the sum of the quarters (open doubt).
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'TSM', currency: 'USD', scale: 'millions',
  approved: '2026-10-15',                         // F0-SM gate (SAB)
  core: {
    rev:      { mcp: 'REV',       base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Revenue' },
    opinc:    { mcp: 'OP_INCOME', base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Operating income',
                doubt: 'Q4 quarters are 0 in the DEFAULT sheet — use seg.total.opinc for quarters' },
    ebitda:   { mcp: 'EBITDA',    base: 'model', unit: 'usd_m',    agg: 'sum', label: 'EBITDA',
                doubt: 'Q4 quarters broken; definition ≈ EBT + interest expense + D&A (includes non-operating)' },
    earnings: { mcp: 'EARNINGS',  base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Net income attributable to parent',
                doubt: 'Q4 quarters negative; FY25 does not tie to the 20-F at the model FX (see TSM.md §1b)' },
    shares:   { mcp: 'SHARES',    base: 'ADR-equivalent (common ÷ 5)', unit: 'shares_m', agg: 'end', label: 'Shares (ADR equivalent)' },
    dna:      { mcp: 'DNA',       base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'D&A' },
    cfo:      { mcp: 'CFO',       base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Cash from operations' },
    capex:    { mcp: 'CAPEX',     base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Capex', sign: 'negative' },
    fcf:      { mcp: 'FCF',       base: 'model', unit: 'usd_m',    agg: 'sum', label: 'Free cash flow' },
    int_inc:  { mcp: 'INT_INC',   base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Interest income' },
    int_exp:  { mcp: 'INT_EXP',   base: 'IFRS',  unit: 'usd_m',    agg: 'sum', label: 'Finance costs' },
    tax_rate: { mcp: 'TAX_RATE',  base: null,    unit: 'pct',      agg: 'avg', label: 'Tax rate',
                doubt: 'Q4 quarters broken; FY25 below the 20-F effective rate (see TSM.md §1b)' }
  },
  // TSMC reports one segment (foundry); 'total' is the company in reported US$ (SEGM sheet).
  segments: [
    { key: 'total', label: 'TSMC (reported US$)', rev: 'SEGM_REV', gp: 'SEMG_GP', cogs: 'SEGM_COGS',
      opex: 'SEGM_OPEX', opinc: 'SEGM_OPINC', rnd: 'RND_OPEX', sga: 'SGNA_OPEX', other_opex: 'OTHER_OPEX',
      doubt: 'SEGM_REV annual ≠ sum of quarters (sum the quarters); RND/SGNA projections on another scale; OTHER_OPEX does not tie' },
    { key: 'hpc',        label: 'High Performance Computing',   rev: 'PLAT_HPC_REV' },
    { key: 'smartphone', label: 'Smartphone',                   rev: 'PLAT_SMARTPH_REV' },
    { key: 'iot',        label: 'Internet of Things',           rev: 'PLAT_IOT_REV' },
    { key: 'auto',       label: 'Automotive',                   rev: 'PLAT_AUTO_REV' },
    { key: 'dce',        label: 'Digital Consumer Electronics', rev: 'PLAT_DCE_REV' },
    { key: 'other',      label: 'Others',                       rev: 'PLAT_OTHER_REV' }
  ],
  // Published % × revenue, so they carry the rounding of the %. No projections.
  kpis: [
    { key: 'geo.na',    label: 'North America',            mcp: 'REG_NA_REV',   unit: 'usd_m', agg: 'sum' },
    { key: 'geo.apac',  label: 'Asia Pacific (ex China/Japan)', mcp: 'REG_APAC_REV', unit: 'usd_m', agg: 'sum' },
    { key: 'geo.china', label: 'China',                    mcp: 'REG_CHI_REV',  unit: 'usd_m', agg: 'sum' },
    { key: 'geo.japan', label: 'Japan',                    mcp: 'REG_JAP_REV',  unit: 'usd_m', agg: 'sum' },
    { key: 'node.2nm',   label: '2nm',     mcp: 'TECH_2NM_REV',     unit: 'usd_m', agg: 'sum' },
    { key: 'node.3nm',   label: '3nm',     mcp: 'TECH_3NM_REV',     unit: 'usd_m', agg: 'sum' },
    { key: 'node.5nm',   label: '5nm',     mcp: 'TECH_5NM_REV',     unit: 'usd_m', agg: 'sum' },
    { key: 'node.7nm',   label: '7nm',     mcp: 'TECH_7NM_REV',     unit: 'usd_m', agg: 'sum' },
    { key: 'node.16nm',  label: '16nm',    mcp: 'TECH_16NM_REV',    unit: 'usd_m', agg: 'sum' },
    { key: 'node.28nm',  label: '28nm',    mcp: 'TECH_28NM_REV',    unit: 'usd_m', agg: 'sum' },
    { key: 'node.40nm',  label: '40/45nm', mcp: 'TECH_40_45NM_REV', unit: 'usd_m', agg: 'sum' },
    { key: 'node.65nm',  label: '65nm',    mcp: 'TECH_65NM_REV',    unit: 'usd_m', agg: 'sum' },
    { key: 'node.90nm',  label: '90nm',    mcp: 'TECH_90NM_REV',    unit: 'usd_m', agg: 'sum' },
    { key: 'node.110nm', label: '110/130nm', mcp: 'TECH_110NM_REV', unit: 'usd_m', agg: 'sum' },
    { key: 'node.150nm', label: '150/180nm', mcp: 'TECH_150NM_REV', unit: 'usd_m', agg: 'sum' }
  ],
  guidance: [
    { key: 'rev', label: 'Revenue guidance',          low: 'REV_LOW_GUIDANCE',          high: 'REV_HIGH_GUIDANCE',          unit: 'usd_m',
      doubt: 'the latest guided quarter (4Q26) low does not match the 6-K (see TSM.md §1b)' },
    { key: 'gm',  label: 'Gross margin guidance',     low: 'GROSS_MARGIN_LOW_GUIDANCE', high: 'GROSS_MARGIN_HIGH_GUIDANCE', unit: 'pct' },
    { key: 'om',  label: 'Operating margin guidance', low: 'OP_MARGIN_LOW_GUIDANCE',    high: 'OP_MARGIN_HIGH_GUIDANCE',    unit: 'pct' }
  ],
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST' },
  // valuation: re-ingested Oct 16 2026 with SAB's fix (EV/EBITDA and P/E now differ, no quality flags) — reliable
  ignore: [
    'DNA_COGS', 'EMPLOYEE_COGS', 'OTHER_COGS',                                   // COGS split does not tie
    'TECH_10NM_REV', 'TECH_20NM_REV', 'TECH_ABOVE_250NM_REV',                    // empty
    'AVG_REV_PER_WAFER', 'WAF_CAPACITY', 'WAF_SHIPMENTS', 'SHARES_BBG_EST',      // empty
    'SEG1_REV', 'SEG1_OPINC', 'SEG2_REV', 'SEG2_OPINC', 'SEG3_REV', 'SEG3_OPINC',
    'SEG4_REV', 'SEG4_OPINC', 'SEG5_REV', 'SEG5_OPINC',                          // unused segment template
    'SEG_REV', 'SEG_GP', 'SEG_COGS', 'SEG_OPINC', 'SEG_EBITDA', 'SEG_EBT', 'SEG_NETINC', 'SEG_DNA',
    'SEG_CAPEX', 'SEG_CFO', 'SEG_FCF', 'SEG_SBC', 'SEG_INCTAX', 'SEG_INT_EXP', 'SEG_INT_INC',
    'SEG_NON_OPINC', 'SEG_OTHER_INC'                                             // unused segment template
  ]
};
