// summit-map/googl.js — what each label in the GOOGL Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the 10-K cross-checks
// are in docs/profiles/GOOGL.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live — SAB, Oct 15 2026).
//
// Model: G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\GOOGL\DCF GOOGL - New.xlsm.
// Snapshots 2026-07-23 → 2026-08-06 (all three after Q2 - 2026; ingested 2026-10-26) + 2026-10-29 (after Q3 - 2026;
// checked 2026-10-30: same 62 labels, no scale or sign jump — see GOOGL.md §1b "Cambios del mapa").
// Three sources inside the model:
//  · DEFAULT — company totals. Actuals = 10-K GAAP. Projections ANNUAL ONLY (2026–2029).
//  · SEGM    — the 10-K revenue-by-type and segment tables, the P&L lines, and the QUARTERLY projections
//              of the company totals (SEG_REV, SEG_OPINC, SEG_EBITDA, SEG_GP…) that DEFAULT does not carry.
//  · BBG     — Bloomberg consensus held inside the model (annual).
// Rule for every label: a REPORTED period is read from `actuals_history` only. The projection sheet's columns
// for reported periods hold values from other rows (GOOGL.md §1b, doubt 1).
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'GOOGL', currency: 'USD', scale: 'millions',
  approved: '2026-10-26',                         // F0-SM gate (SAB)
  core: {
    rev:        { mcp: 'REV', mcpQ: 'SEG_REV', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Revenue',
                  note: 'quarters are projected for the CURRENT fiscal year only (2026); later years are projected as full years — 2027+ quarters are not used (SAB, 2026-10-26). The 2026 annual of SEG_REV is broken: never read it' },
    cogs:       { mcp: 'COGS', base: 'GAAP (incl. TAC)', unit: 'usd_m', agg: 'sum', label: 'Cost of revenues',
                  note: '2026 annual empty (quarters only); 2027+ annual' },
    gp:         { mcp: 'SEG_GP', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Gross profit', note: '2026 annual empty' },
    rd:         { mcp: 'R&D', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Research & development' },
    sm:         { mcp: 'S&A', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Sales & marketing',
                  note: 'the label says S&A; it is the 10-K "Sales and marketing" line' },
    ga:         { mcp: 'G&A', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'General & administrative' },
    opinc:      { mcp: 'OP_INCOME', mcpQ: 'SEG_OPINC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Operating income' },
    ebitda:     { mcp: 'EBITDA', mcpQ: 'SEG_EBITDA', base: 'adjusted (op. income + D&A + SBC)', unit: 'usd_m', agg: 'sum',
                  label: 'EBITDA (adj.)', note: '= 10-K op. income + depreciation + SBC, to the dollar. Not GAAP' },
    sbc:        { mcp: 'SBC', base: 'GAAP (cash-flow statement)', unit: 'usd_m', agg: 'sum', label: 'Stock-based compensation',
                  note: 'the cash-flow add-back, not the larger total SBC expense of the 10-K note; 2026 annual empty' },
    dna:        { mcp: 'DNA', mcpQ: 'D&A', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Depreciation',
                  note: 'the 10-K "Depreciation of property and equipment" (Alphabet reports no separate amortization line)' },
    capex:      { mcp: 'CAPEX', mcpQ: 'SEG_CAPEX', base: 'GAAP (purchases of P&E)', unit: 'usd_m', agg: 'sum', label: 'Capex', sign: 'negative' },
    cfo:        { mcp: 'CFO', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Cash from operations', note: 'annual only' },
    fcf:        { mcp: 'FCF', base: 'model (CFO − capex)', unit: 'usd_m', agg: 'sum', label: 'Free cash flow', note: 'annual only' },
    int_inc:    { mcp: 'INT_INC', mcpQ: 'SEG_INT_INC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest income' },
    int_exp:    { mcp: 'INT_EXP', mcpQ: 'SEG_INT_EXP', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Interest expense' },
    non_op:     { mcp: 'SEG_NON_OPINC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Other income (expense), net (OI&E)' },
    oie_equity: { mcp: 'SEG_OTHER_INC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'OI&E — equity securities and other',
                  doubt: 'FY25 does not equal the sum of the 10-K OI&E components it seems to hold — which lines it includes (GOOGL.md §1b)' },
    oie_perf:   { mcp: 'PERF_FEES', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'OI&E — performance fees',
                  doubt: 'not a separate line in the FY25 10-K OI&E table' },
    oie_debt:   { mcp: 'DEBT_LOSS_GAIN', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'OI&E — gain (loss) on debt securities' },
    oie_fx:     { mcp: 'FX_LOSS_GAIN', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'OI&E — FX gain (loss)' },
    ebt:        { mcp: 'SEG_EBT', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Income before taxes' },
    tax:        { mcp: 'SEG_INCTAX', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Provision for income taxes' },
    net_income: { mcp: 'SEG_NETINC', base: 'GAAP', unit: 'usd_m', agg: 'sum', label: 'Net income (GAAP)' },
    earnings:   { mcp: 'EARNINGS', base: 'adjusted', unit: 'usd_m', agg: 'sum', label: 'Model earnings (adj.)',
                  note: '= (op. income + interest income − interest expense) × (1 − TAX_RATE): excludes the OI&E gains on equity securities, so it sits well below GAAP net income in FY25' },
    tax_rate:   { mcp: 'TAX_RATE', base: 'model', unit: 'pct', agg: 'avg', label: 'Tax rate (model)',
                  note: 'decimal. Actual = GAAP tax ÷ (op. income + net interest), not the 10-K effective rate' },
    shares:     { mcp: 'SHARES', base: 'diluted', unit: 'shares_m', agg: 'end', label: 'Diluted shares (Class A+B+C)' }
  },
  // 10-K Note 2 (revenues by type) + Note 15 (segments). The SEGn numbering is NOT the 10-K order: read the label.
  segments: [
    { key: 'services', label: 'Google Services', rev: 'SEG2_REV', opinc: 'SEG1_OPINC' },
    { key: 'services.ads', label: 'Google advertising', rev: 'SEG3_REV' },
    { key: 'services.ads.search', label: 'Google Search & other', rev: 'SEG4_REV' },
    { key: 'services.ads.youtube', label: 'YouTube ads', rev: 'SEG5_REV' },
    { key: 'services.ads.network', label: 'Google Network', rev: 'SEG6_REV' },
    { key: 'services.subs', label: 'Google subscriptions, platforms, and devices', rev: 'SEG7_REV' },
    { key: 'cloud', label: 'Google Cloud', rev: 'SEG8_REV', opinc: 'SEG2_OPINC',
      note: '2026 = reported quarters + the model\'s remaining ones (1Q–3Q + 4Q from the 2026-10-29 snapshot; the only basis that ties to the model\'s total revenue, like every other 2026 line); the 2026 annual cell is wrong — never read it (SAB, 2026-10-26, EV-RES-DATA)' },
    { key: 'bets', label: 'Other Bets', rev: 'SEG9_REV', opinc: 'SEG3_OPINC' },
    { key: 'hedging', label: 'Hedging gains (losses)', rev: 'SEG10_REV' },
    { key: 'alphabet_level', label: 'Alphabet-level activities', opinc: 'SEG4_OPINC' }
  ].map(function(s){ if (s.opinc) s.opincNote = 'projected for 2026 only (annual) and 1Q26; 2027+ = 0 — show as "Summit (discontinued)"; SAB may reinstate the projection (2026-10-26)'; return s; }),
  kpis: [
    { key: 'tac', label: 'Traffic acquisition costs (TAC)', mcp: 'TAC', unit: 'usd_m', agg: 'sum',
      note: 'inside cost of revenues; ties to the 10-K. 1Q26 empty in the projections' },
    { key: 'buyback_usd', label: 'Repurchases of stock', mcp: 'SHARE_BUYBACK', unit: 'usd_m', agg: 'sum', sign: 'negative',
      note: 'ties to the 10-K; the model does not project buybacks' },
    { key: 'buyback_sh', label: 'Shares repurchased', mcp: 'SH_REPUR', unit: 'shares_m', agg: 'sum', sign: 'negative',
      doubt: 'unit to confirm (millions of shares?)' },
    { key: 'stock_issuance', label: 'Proceeds from stock issuance', mcp: 'STOCK_PAYMENT', unit: 'usd_m', agg: 'sum',
      note: 'per the model author (SAB, 2026-10-26)' }
  ],
  guidance: [],                                    // Alphabet gives no numeric guidance
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST',
    doubt: 'REV_BBG_EST looks like revenue NET of TAC: Street revenue is not comparable with GAAP revenue (doubt 7)' },
  valuationUnreliable: [],                         // quality_flags empty in all 4 snapshots (through 2026-10-29)
  ignore: [
    { mcp: 'SEG1_REV',  why: 'all zero' },
    { mcp: 'SEG5_OPINC', why: 'all zero' },
    { mcp: 'SEG_COGS',  why: 'all zero (COGS lives in COGS)' },
    { mcp: 'SEG_DNA',   why: 'all zero (D&A lives in DNA / D&A)' },
    { mcp: 'SEG_SBC',   why: 'all zero (SBC lives in SBC)' },
    { mcp: 'SEG_CFO',   why: 'projections all zero; actuals duplicate CFO' },
    { mcp: 'SEG_FCF',   why: 'projection = capex only (not FCF); FCF lives in FCF' },
    { mcp: 'RPO',       why: 'empty (0) in every period' }
  ]
};
