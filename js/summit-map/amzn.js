// summit-map/amzn.js — what each label in the AMZN Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the 10-K cross-checks
// are in docs/profiles/AMZN.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live — SAB, Oct 15 2026).
//
// Model: Summit DCF AMZN (.xlsm, G:\My Drive\Summit\Docs\Research\DCF). 4 snapshots in the MCP:
// 2025-12-18 (after Q3 - 2025) · 2026-02-10 (Q4 - 2025) · 2026-05-05 (Q1 - 2026) · 2026-08-04 (Q2 - 2026).
// Three sources inside the model:
//  · DEFAULT — company totals. Actuals = 10-K. Projections ANNUAL ONLY (quarters hold 0).
//  · SEGM    — the three reportable segments (North America · International · AWS) plus corporate/other,
//              projected QUARTERLY and annual for revenue and operating income.
//  · BBG     — Bloomberg consensus held inside the model (annual; the projection sheet holds 0 for reported years).
// Rule for every label: a REPORTED period is read from `actuals_history` only.
// The model carries NO cost of sales, gross profit or functional opex lines: there is no Summit gross profit.
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'AMZN', currency: 'USD', scale: 'millions',
  approved: '2026-10-29',                         // F0-SM gate (SAB)
  core: {
    rev:      { mcp: 'REV', mcpQ: 'USREV + INTREV + AWS', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Net sales',
                note: 'DEFAULT is annual only; a quarter is the sum of the three segment lines' },
    opinc:    { mcp: 'OPINC + OPINC2 + OPINC3', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Operating income',
                note: 'the sum of the three segments; equals the 10-K total (FY25 to the dollar)',
                doubt: 'OP_INCOME (DEFAULT) projections are broken: 2026Q3 holds 197,000 and 2027+ hold 0 — never read its projections (AMZN.md §1b, doubt 1)' },
    ebitda:   { mcp: 'EBITDA', mcpQ: 'EBITDA_SEGM', base: 'adjusted (op. income + D&A + SBC)', unit: 'usd_m', agg: 'sum',
                label: 'EBITDA (adj.)', note: '= 10-K op. income + D&A + SBC, to the dollar (FY25). Not GAAP' },
    earnings: { mcp: 'EARNINGS', base: 'adjusted', unit: 'usd_m', agg: 'sum', label: 'Model earnings (adj.)',
                note: '= (op. income + interest income − interest expense) × (1 − TAX_RATE): excludes the non-operating gains (Anthropic, Rivian), so it sits well below GAAP net income in FY25' },
    tax_rate: { mcp: 'TAX_RATE', base: 'model', unit: 'pct', agg: 'avg', label: 'Tax rate (model)',
                note: 'decimal. Actual = the rate that ties EARNINGS, not the 10-K effective rate; projections 16% for 2026–27 and 20% for 2028–29 (snapshot 2026-08-04)' },
    shares:   { mcp: 'SHARES', base: 'diluted', unit: 'shares_m', agg: 'end', label: 'Diluted shares',
                note: 'projections held flat at the FY25 count (10,827M) in every year' },
    dna:      { mcp: 'DNA', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Depreciation & amortization', note: 'annual only' },
    capex:    { mcp: 'CAPEX', base: 'GAAP (purchases of P&E, gross)', unit: 'usd_m', agg: 'sum', label: 'Capex', sign: 'negative',
                note: 'annual only' },
    cfo:      { mcp: 'CFO', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Cash from operations', note: 'annual only' },
    fcf:      { mcp: 'FCF', base: 'model (CFO − gross capex)', unit: 'usd_m', agg: 'sum', label: 'Free cash flow',
                note: 'not Amazon\'s reported FCF, which nets proceeds from P&E sales and incentives (FY25 $11.2B vs model $7.7B)' },
    int_inc:  { mcp: 'INT_INC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest income', note: 'annual only' },
    int_exp:  { mcp: 'INT_EXP', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest expense', note: 'annual only' }
  },
  // 10-K Note 10. The label numbering is NOT obvious: OPINC = North America, OPINC2 = International, OPINC3 = AWS.
  segments: [
    { key: 'na',   label: 'North America', rev: 'USREV',  opinc: 'OPINC',  ebitda: 'US_EBITDA',  capex: 'US_CAPEX',  dna: 'US_DNA',  ppe: 'US_PPE' },
    { key: 'intl', label: 'International', rev: 'INTREV', opinc: 'OPINC2', ebitda: 'INT_EBITDA', capex: 'INT_CAPEX', dna: 'INT_DNA', ppe: 'INT_PPE' },
    { key: 'aws',  label: 'AWS',           rev: 'AWS',    opinc: 'OPINC3', ebitda: 'AWS_EBITDA', capex: 'AWS_CAPEX', dna: 'AWS_DNA', ppe: 'AWS_PPE' },
    { key: 'corp', label: 'Corporate & other (unallocated)', ebitda: 'CORP_OTHER_EBITDA', capex: 'CORP_CAPEX', dna: 'CORP_OTHER_DNA', ppe: 'CORP_PPE' }
  ],
  // Segment EBITDA = segment op. income + segment D&A (no SBC). The four segment EBITDAs sum to op. income + D&A,
  // NOT to the consolidated EBITDA above (which adds SBC): FY25 145.7B vs 165.2B — say so wherever both appear (A26).
  segmentNotes: {
    ebitdaQ: 'doubt: quarterly segment D&A is 0 in the model, so a quarterly segment EBITDA equals op. income — use annual only (AMZN.md §1b, doubt 2)',
    other: 'OTHER_CAPEX / OTHER_PPE: a reconciling line (FY25 capex +10,533, positive) — doubt 3'
  },
  kpis: [], guidance: [],
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST' },
  valuationUnreliable: [],                        // the 2025-12-18 submit fails the PT ÷ FV check: left out of VA-SUB / VA-TM (SAB, 2026-10-29)
  ignore: ['OP_INCOME (projections)', 'OTHER_CAPEX', 'OTHER_PPE']
};
