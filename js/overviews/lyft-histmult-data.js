// lyft-histmult-data.js — Lyft balance-sheet denominators for Valuation ▸ Historic Multiple (VA-HIST, playbook §14).
//
// Source: Lyft Forms 10-K FY2023 / FY2025 and Form 10-Q for 2Q26 (the filings on file), balance sheets and statements of operations — reported
// figures, as first filed (rule 10 allows them in a file). Typed 2026-11-05 and tied to the filings; the 3 quarterly 10-Qs between the 10-Ks are not
// on file, so the series steps at the annual filings plus 2Q26. EPS and Adjusted EBITDA are NOT here: the chart reads them from js/results-data/lyft.js.
//   shares    weighted-average diluted shares of the period (millions); Q4 = the full-year figure of the 10-K (FY2023 385.3, FY2024 413.7, FY2025 417.7);
//             2Q26 = the three-month figure of the 10-Q (386.3).
//   cash      cash and cash equivalents + short-term investments, period end. Restricted cash and restricted investments (they back insurance
//             claims) and other investments are left out.
//   debt      long-term debt, net of current portion + convertible senior notes, current, period end.
//   net debt  debt − cash (negative = net cash).
// The "filed" date is the 10-K signature date (FY2023 Feb 20 2024, FY2024 Feb 14 2025, FY2025 Feb 10 2026) and the 10-Q signature date for 2Q26
// (Aug 6 2026); the chart steps each series on that date.
// 3Q26 (added 2026-11-05) is from the 3Q26 release (8-K Ex. 99.1, Nov 5 2026), not a 10-Q: diluted shares 378.5M (the loss quarter, equal to basic), cash 1,308.9 + short-term
// investments 596.0, long-term debt net of current portion 999.5; its "filed" date is the release date. The 3Q26 10-Q is not on file.
// [quarter, period end, filed, diluted shares (M), cash + ST investments, debt, net debt] — US$ million
export var LYFT_HM_Q = [
  ['4Q23', '2023-12-31', '2024-02-20', 385.3, 1685.2, 839.4, -845.8],
  ['4Q24', '2024-12-31', '2025-02-14', 413.7, 1984.4, 956.1, -1028.3],
  ['4Q25', '2025-12-31', '2026-02-10', 417.7, 1837.2, 1002.4, -834.8],
  ['2Q26', '2026-06-30', '2026-08-06', 386.3, 1794.5, 990.6, -804.0],
  ['3Q26', '2026-09-30', '2026-11-05', 378.5, 1904.9, 999.5, -905.4]
];
