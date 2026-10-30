// summit-map/spot.js — what each label in the SPOT Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// Names, definitions and units only — never a number. The explanation and the cross-checks are in
// docs/profiles/SPOT.md §1b. Not imported by the portal: it is the dictionary Claude reads when freezing
// Summit numbers into the data files (rule 10, frozen not live).
//
// Model: Summit MCP instrument SPOT · EUR · millions · 5 snapshots 2025-12-18 → 2026-10-22 · 54 labels
// (2026-10-22 re-checked on 2026-10-30 over 3Q26–4Q27 and FY2025–FY2030: the same 54 labels).
// ⚠ EVERYTHING IS EUROS (reported, guided, modelled and Bloomberg consensus). The MCP tags every label
// canonical_unit 'EUR' / display_scale 'millions', including counts (MAU, subs) and ARPU — the unit below
// is the real one.
// Three sources inside the model:
//  · DEFAULT — company totals. Actuals = IFRS reported. Projections annual, REV/OP_INCOME/EBITDA/FCF/CFO also quarterly.
//  · SEGM    — Premium / Ad-Supported split, cost lines, KPIs by region, guidance. Quarterly + annual.
//  · BBG     — Bloomberg consensus held inside the model (annual only).
// Facts live in two sheets: actuals_history (reported periods) and projection_history (everything else,
// including a re-projection of the already-reported periods — read reported periods from actuals_history).
// Doubts marked `doubt:` must be resolved before a unit uses that field.

export var summitMap = {
  ticker: 'SPOT', currency: 'EUR', scale: 'millions',
  approved: null,                                   // F0-SM gate — pending the analyst
  core: {
    rev:      { mcp: 'REV',       base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Revenue',
                doubt: '2026-10-22 projection_history holds FY2025 at 17,177 (REV), 2,189 (OP_INCOME), 2,540 (EBITDA): 9 below the reported 17,186 / 2,198 / 2,549 that 2026-08-05 held. Read reported years from actuals_history',
                note: 'FY25 17,186 = 1Q25–4Q25 (4,190+4,193+4,272+4,531). Projection quarters sum to the annual (2026: 4,533+4,777+5,023+5,428 = 19,762)' },
    opinc:    { mcp: 'OP_INCOME', base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Operating income', note: 'quarterly + annual' },
    ebitda:   { mcp: 'EBITDA',    base: 'model (op. income + D&A)', unit: 'eur_m', agg: 'sum', label: 'EBITDA', note: 'quarterly + annual' },
    earnings: { mcp: 'EARNINGS',  base: 'mixed', unit: 'eur_m', agg: 'sum', label: 'Net income',
                doubt: 'annual only. FY25 actual 2,212 (IFRS) but the projection-history FY25 row says 3,234 (model definition) — the Estimates pane must label it "Model earnings", never mix the two' },
    shares:   { mcp: 'SHARES',    base: 'diluted', unit: 'shares_m', agg: 'end', label: 'Diluted shares', note: 'annual only' },
    dna:      { mcp: 'DNA',       base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'D&A' },
    cfo:      { mcp: 'CFO',       base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Cash from operations' },
    capex:    { mcp: 'CAPEX',     base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Capex',
                doubt: 'sign flips: actuals negative (−61 FY25), projections positive (61, 78…). Normalize on load' },
    fcf:      { mcp: 'FCF',       base: 'model (CFO − capex)', unit: 'eur_m', agg: 'sum', label: 'Free cash flow' },
    int_inc:  { mcp: 'INT_INC',   base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Interest income', note: 'annual only' },
    int_exp:  { mcp: 'INT_EXP',   base: 'IFRS',  unit: 'eur_m', agg: 'sum', label: 'Interest expense',
                doubt: 'projections stop at FY25 (2026+ = 0)' },
    tax_rate: { mcp: 'TAX_RATE',  base: 'effective', unit: 'pct', agg: 'avg', label: 'Effective tax rate',
                doubt: 'FY25 actual 0.5% vs projections 10% / 12% / 22% — a one-off in FY25 (tax benefit), not a trend; annual only' }
  },
  segments: [
    { key: 'prem', label: 'Premium', rev: 'PREMIUM_REVENUE', gp: 'PREMIUM_GROSS_PROFIT', cogs: 'PREMIUM_COGS',
      doubt: 'PREMIUM_COGS annual projections 2025/2026 equal PREMIUM_REVENUE (14,093 / 17,829) and 2027 falls to 13,512: broken — use quarterly COGS or revenue − gross profit. Quarterly ties (2026Q4: 4,838 − 1,693 = 3,145)' },
    { key: 'ads',  label: 'Ad-Supported', rev: 'ADS_REVENUE', gp: 'ADS_GROSS_PROFIT', cogs: 'ADS_COGS',
      doubt: 'ADS_COGS annual projections 2025/2026 equal ADS_REVENUE (1,768 / 1,933): broken, same as Premium' }
  ],
  // Reported-vs-model basis break: from 1Q26 Spotify reclassified some revenue-generating activities out of
  // Ad-Supported and into Premium (results-data/spot.js notes). The 2025 actual split (15,350 / 1,836) is on the OLD basis.
  opex: [
    { key: 'rd', mcp: 'RD', label: 'Research & development' },
    { key: 'sm', mcp: 'SM', label: 'Sales & marketing' },
    { key: 'ga', mcp: 'GA', label: 'General & administrative' },
    { key: 'sbc', mcp: 'SBC', label: 'Stock-based compensation', doubt: 'FY25 actual 247 vs projection-history FY25 228' }
  ],
  adjusted: [
    { key: 'adj_opinc', mcp: 'ADJ_OP_INCOME', note: 'equals OP_INCOME in the actuals; the projection row for reported periods is a re-projection' },
    { key: 'adj_ebitda', mcp: 'ADJ_EBITDA',   note: 'equals EBITDA in the actuals' }
  ],
  kpis: [
    { key: 'eu_mau',    label: 'Europe MAU',            mcp: 'EU_MAU',    unit: 'users_m', agg: 'end', doubt: 'actuals only 4Q25–2Q26 in this snapshot; no projection' },
    { key: 'na_mau',    label: 'North America MAU',     mcp: 'NA_MAU',    unit: 'users_m', agg: 'end', doubt: 'same' },
    { key: 'latam_mau', label: 'Latin America MAU',     mcp: 'LATAM_MAU', unit: 'users_m', agg: 'end', doubt: 'same' },
    { key: 'row_mau',   label: 'Rest of World MAU',     mcp: 'ROW_MAU',   unit: 'users_m', agg: 'end', doubt: 'same' },
    { key: 'eu_subs',   label: 'Europe subscribers',    mcp: 'EU_MAUPS',  unit: 'users_m', agg: 'end', doubt: 'label says MAUPS (premium MAU) = paying subscribers; same coverage limit' },
    { key: 'na_subs',   label: 'North America subscribers', mcp: 'NA_MAUPS', unit: 'users_m', agg: 'end' },
    { key: 'latam_subs',label: 'Latin America subscribers', mcp: 'LATAM_MAUPS', unit: 'users_m', agg: 'end' },
    { key: 'row_subs',  label: 'Rest of World subscribers', mcp: 'ROW_MAUPS', unit: 'users_m', agg: 'end' },
    { key: 'employees', label: 'Employees',             mcp: 'EMPLOYEES', unit: 'people', agg: 'end', doubt: 'labelled EUR/millions in the MCP; the values (29,177) are people' }
  ],
  // Labels present in the catalog but ZERO in every period of the 2026-08-05 snapshot (and of the 2026-10-22 periods pulled) — do not use.
  empty: ['MAU', 'MAUAD', 'MAUPS', 'ARPU_PREM', 'ARPU_ADS', 'COST_PREM', 'COST_ADS', 'MAUPS_GUIDANCE_LOW', 'MAUPS_GUIDANCE_HIGH'],
  guidance: [
    { key: 'rev', low: 'REVENUE_GUIDANCE_LOW', high: 'REVENUE_GUIDANCE_HIGH', unit: 'eur_m',
      note: 'Spotify guides a point; the model stores point ±10 (3Q26: 4,990–5,010 = €5.0B). Next-quarter guide from the prior print' },
    { key: 'gm',  low: 'GROSS_MARGIN_GUIDANCE_LOW', high: 'GROSS_MARGIN_GUIDANCE_HIGH', unit: 'pct_decimal',
      note: '3Q26 32.7–33.1% = the 32.9% point ±0.2' },
    { key: 'opinc', low: 'OP_INCOME_GUIDANCE_LOW', high: 'OP_INCOME_GUIDANCE_HIGH', unit: 'eur_m', note: '3Q26 669–671 = the €670M point ±1' },
    { key: 'mau', low: 'MAU_GUIDANCE_LOW', high: 'MAU_GUIDANCE_HIGH', unit: 'users_m', note: '3Q26 787–789 = the 788M point (777M + 11M)' }
  ],
  consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST', earnings: 'EARNINGS_BBG_EST', shares: 'SHARES_BBG_EST',
               doubt: '2026-10-22: REV_BBG_EST and EBITDA_BBG_EST are on another scale (FY2026 revenue 22,346 vs 19,530 in the Bloomberg workbook of 2026-10-21, about 1.12–1.14x on revenue: apparently US$) and FY2030 is zero; EARNINGS_BBG_EST and SHARES_BBG_EST are EUR / millions as before. Do not use rev/ebitda from that snapshot (SPOT.md §6)' },
  valuation: { snapshot: '2026-10-22', methods: ['EV / EBITDA', 'P / E'], qualityFlags: [],
               note: 'both methods clean (no quality_flags). 2026-10-22: EV/EBITDA 20.5x FY2027 Forward, P/E 28x FY2028 Forward (it was FY2027 through 2026-08-05). The store records the P/E price target from the following year cell (US$672.78); the 1-year target is US$645.14 (js/submits-data/spot.js fix)' },
  valuationUnreliable: []
};
