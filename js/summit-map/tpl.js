// summit-map/tpl.js — what each label in the TPL Summit DCF model means (docs/PROFILE_PLAYBOOK.md §6.3).
// SCAFFOLD (2026-11-04): TPL is not in the Summit MCP yet (search_ticker → no_matches). Every `mcp` below is EXPECTED,
// not confirmed: fill it from list_metrics('TPL') on the first submit, cross-check one closed period of each core and
// segment label against the FY2025 10-K, then set `approved`. Names, definitions and units only — never a number.
// Not imported by the portal: it is the dictionary read when freezing Summit numbers into the data files (rule 10).
// Recipe: docs/profiles/TPL.md §5b.

export var summitMap = {
  ticker: 'TPL', currency: 'USD', scale: 'millions',
  approved: null,                                   // F0-SM gate: blocked, no model yet
  core: {
    rev:        { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Total revenues' },
    opinc:      { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Operating income' },
    ebitda:     { mcp: null, base: 'adjusted', unit: 'usd_m',         agg: 'sum',       label: 'Adjusted EBITDA', note: 'company definition: EBITDA + share-based compensation (10-K Item 7)' },
    net_income: { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Net income' },
    eps:        { mcp: null, base: 'GAAP',     unit: 'usd_per_share', agg: 'per-share', label: 'EPS (diluted)', note: 'must be on the post Dec 2025 3-for-1 split basis' },
    shares:     { mcp: null, base: 'diluted',  unit: 'shares_m',      agg: 'end',       label: 'Diluted shares', note: '~69M after the Dec 2025 split' },
    capex:      { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Capex' },
    cfo:        { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Operating cash flow' },
    fcf:        { mcp: null, base: 'company',  unit: 'usd_m',         agg: 'sum',       label: 'Free cash flow' },
    dna:        { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Depreciation, depletion and amortization' },
    sbc:        { mcp: null, base: 'GAAP',     unit: 'usd_m',         agg: 'sum',       label: 'Share-based compensation' },
    tax_rate:   { mcp: null, base: 'model',    unit: 'pct_fraction',  agg: 'avg',       label: 'Tax rate' }
  },
  segment: [
    { key: 'lrm', label: 'Land and Resource Management', rev: null, opinc: null },
    { key: 'wso', label: 'Water Services and Operations', rev: null, opinc: null }
  ],
  // Revenue lines and operating KPIs the model is expected to carry (royalty production Boe/d, realized $/Boe,
  // water volumes) — classify on the first submit.
  kpi: [], guidance: [], consensus: {},
  valuationUnreliable: [],
  ignore: []
};
