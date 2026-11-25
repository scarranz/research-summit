// spcx-histmult-data.js — SpaceX quarterly denominators for Valuation ▸ Historic Multiple (VA-HIST, playbook §14).
//
// Reported figures, rule 10 (allowed in a file): nothing here is a market number or an estimate.
// Sources (SEC EDGAR, CIK 0001181412):
//   424B4 prospectus, filed 2026-06-12, accession 0001628280-26-042639 — 1Q25–1Q26 results and the
//        "pro forma as adjusted" capitalization (Mar 31 2026 balance sheet + the IPO proceeds).
//   Form 10-Q for 2Q26, filed 2026-08-04, accession 0001628280-26-052535.
//   Form 10-Q for 3Q26, filed 2026-10-22, accession 0001628280-26-066880.
// Same shape as meta-histmult-data.js:
//   EPS        GAAP diluted EPS for the quarter, as js/results-data/spcx.js carries it. 3Q25 and 4Q25 are null:
//              SpaceX was private and never published a per-share figure for those quarters (FY2025 was −$1.69).
//   EBITDA     company-defined adjusted EBITDA (the Results basis: the sum of the three segments). 4Q25 = FY2025
//              less the three published quarters.
//   OI         GAAP operating income (reference; not used by the chart).
//   shares     shares OUTSTANDING, Class A + Class B, millions — not the weighted diluted count. The xAI merger
//              (Feb 2026), the preferred conversion and the IPO (Jun 2026) change the base inside a quarter, so a
//              weighted average understates the equity the price applies to. 1Q26 row = 424B4 pro forma as
//              adjusted (7,380.2M A + 5,695.7M B, before the over-allotment); 2Q26 = 10-Q cover, as of Jul 28 2026;
//              3Q26 = 10-Q cover, as of Oct 15 2026.
//   cash       cash and cash equivalents + marketable securities, period end ($M).
//   debt       total debt + finance lease liability, carrying amount (net of deferred financing costs), period end.
//   net debt   debt − cash (negative = net cash). The off-balance-sheet Saturn GPU lease is NOT in debt.
//   1Q26 balance-sheet columns are the 424B4 pro forma as adjusted: cash $90,300M (incl. the IPO's net proceeds) +
//   $7,823M marketable securities; debt $29,111M + $1,154M finance leases. Quarters before 1Q26 carry no
//   share / balance-sheet figure: the stock did not trade, and the pre-IPO capital structure is not comparable.
// The "filed" date is when the document became public; the chart steps every series on that date.
// [quarter, period end, filed, EPS, adj. EBITDA, operating income, shares, cash, debt, net debt] — US$ million (EPS in $)
export var SPCX_HM_Q = [
  ['1Q25','2025-03-31','2026-06-12', -0.18, 1730,    27, null,      null,   null,   null],
  ['2Q25','2025-06-30','2026-06-12', -0.34, 1214,  -970, null,      null,   null,   null],
  ['3Q25','2025-09-30','2026-06-12',  null, 2169,  -273, null,      null,   null,   null],
  ['4Q25','2025-12-31','2026-06-12',  null, 1471, -1373, null,      null,   null,   null],
  ['1Q26','2026-03-31','2026-06-12', -1.27, 1127, -1943, 13075.9, 98123, 30265, -67858],
  ['2Q26','2026-06-30','2026-08-04', -0.09, 3538,  -143, 13181.8, 100009, 39364, -60645],
  ['3Q26','2026-09-30','2026-10-22',  0.35, 8809,  2791, 13581.1,  89855, 38844, -51011]
];

// The last fiscal year fully reported, and the day it became public (FY2025 in the 424B4).
export var SPCX_HM_FY = [['2026-06-12', 2025]];

// Accession numbers for the footer.
export var SPCX_HM_SRC = {
  prospectus: { form:'424B4', filed:'2026-06-12', acc:'0001628280-26-042639' },
  q2: { form:'10-Q', filed:'2026-08-04', acc:'0001628280-26-052535' },
  q3: { form:'10-Q', filed:'2026-10-22', acc:'0001628280-26-066880' }
};
