// Covered-call positions — the MANUAL inputs (mirrors the Excel "Covered Calls"
// sheet, block 1). Everything else (live price, premium, IV, greeks, valuation)
// is pulled at runtime: price/fundamentals from Massive equities, premium/IV/
// greeks from the Massive option chain, forward EBITDA/EPS from the Summit data.
//
// Only THREE fields are manual: ticker, strike, weight. There is no contracts
// field and no portfolio value — the whole analysis is expressed in %, with
// each position's contribution scaled by its portfolio weight.
//
//  ticker     — underlying
//  reason     — valuation lens used in the Excel ("EV EBITDA" | "EV Adj EBITDA")
//  strike     — call strike sold. The set below was chosen by SAB on 10 Sep 2026
//               against the 2027E basis, which is why the tab opens on that year:
//               the same strike is a different multiple on a different year.
//               Moved 11 Sep 2026 at SAB's instruction, on the 2026-10-16 chain:
//               GOOGL 375 -> 395 and TSM 490 -> 510 (he asked for +5%, and these
//               are the nearest LISTED strikes to it — +5.33% and +4.08%, since
//               GOOGL steps in $5 and TSM in $10, which puts 514.50 between 510
//               and 520), and AMZN 295 -> 300, the next listed strike up.
//               `null` means the book does not name one yet:
//               the tab then resolves the nearest listed strike AT OR ABOVE spot
//               for the selected expiry (the first covered call that would not
//               sell the shares below today's price) and marks the cell. Type
//               the real strike over it inline, or set it here.
//  weight     — % of portfolio (from the Excel "%" column), as a decimal
//  excluded   — held OUT of the portfolio totals from the start. The row loads and
//               prices normally and its own numbers are all on screen; it just does
//               not count toward Premium yield, Annualized, either average or
//               Covered weight, and its Contrib. reads "—". Toggle it per row with
//               the ● beside the ✕. This is a DEFAULT, not a lock.
//  isEtf      — index/sector ETFs: no fundamentals, so no multiples are shown
//  seedPrime  — last premium (per share). Fallback / reference only; the live
//               midpoint from Massive overrides it when available.
//
// Order is the book's own order, and it is preserved until a column is sorted.

// ── The book as of 13 Nov 2026 ───────────────────────────────────────────────
// Strikes, and which rows count toward the totals: exactly as SAB left the tab on
// 13 Nov 2026 after reviewing each name's latest Summit DCF price target on the
// 2027-01-15 chain (the January roll date, before most of the book reports 4Q).
// TBBB was removed from the book that day. `pt` / `ptSrc` keep each submit's 1-year
// price target (P/E method; EV/EBITDA where the submit has no P/E target) as the
// reference — hover the strike to see it next to the strike actually chosen.
// Weights: the "Alloc" column of the broker's Active positions screen, 13 Nov 2026.
// Equities ordered by weight, largest first. The three ETFs are not on that
// screen: their weights and strikes are the old ones, kept below the stocks.
// Counted in the totals: AMZN, SPOT, TSM, SOFI, SMH; everything else starts
// `excluded` (toggle per row with the ● beside the ✕).
export const POSITIONS = [
  { ticker: 'META',  reason: 'EV EBITDA',     strike: 900,  pt: 1097.56, ptSrc: 'Summit submit 2026-10-22 · P/E 18x 2028E', weight: 0.1389, seedPrime: 0.95, excluded: true },
  { ticker: 'UBER',  reason: 'EV Adj EBITDA', strike: 90,   pt: 154.36,  ptSrc: 'Summit submit 2026-11-04 · P/E 23x 2028E', weight: 0.1375, seedPrime: 0.07, excluded: true },
  { ticker: 'NVDA',  reason: 'EV EBITDA',     strike: 300,  pt: 370.00,  ptSrc: 'Summit submit 2026-08-28 · P/E 22x FY2028E (no newer submit)', weight: 0.1002, seedPrime: 0.13, excluded: true },
  { ticker: 'AMZN',  reason: 'EV Adj EBITDA', strike: 330,  pt: 271.68,  ptSrc: 'Summit submit 2026-10-30 · P/E 25x 2027E', weight: 0.0899, seedPrime: 0.17 },
  { ticker: 'GOOGL', reason: '',              strike: 370,  pt: 387.73,  ptSrc: 'Summit submit 2026-10-29 · P/E 20x 2028E', weight: 0.0597, seedPrime: null, excluded: true },
  { ticker: 'SPOT',  reason: 'EV Adj EBITDA', strike: 720,  pt: 532.86,  ptSrc: 'Summit submit 2026-10-22 · EV/EBITDA 20.5x 2027E (no P/E target in the submit)', weight: 0.0477, seedPrime: 2.48 },
  { ticker: 'TSM',   reason: '',              strike: 470,  pt: 453.92,  ptSrc: 'Summit submit 2026-10-19 · P/E 20x 2027E', weight: 0.0459, seedPrime: null },
  { ticker: 'MA',    reason: 'EV Adj EBITDA', strike: 740,  pt: 619.80,  ptSrc: 'Summit submit 2026-10-28 · P/E 28x 2027E', weight: 0.0444, seedPrime: 0.33, excluded: true },
  { ticker: 'SOFI',  reason: 'EV Adj EBITDA', strike: 21,   pt: 28.67,   ptSrc: 'Summit submit 2026-10-27 · P/E 22x 2028E (read from the workbook; the MCP carries no SOFI valuation)', weight: 0.0351, seedPrime: 0.14 },
  { ticker: 'LYFT',  reason: 'EV Adj EBITDA', strike: 19,   pt: 23.76,   ptSrc: 'Summit submit 2026-08-07 · P/E 16x 2027E — the workbook copies one target into both methods, so read it as unreliable (no newer submit)', weight: 0.0124, seedPrime: 0.04, excluded: true },
  { ticker: 'QQQ',   reason: '',              strike: 790, weight: 0.0480, seedPrime: null, isEtf: true, excluded: true },
  { ticker: 'XLG',   reason: '',              strike: null, weight: 0.0470, seedPrime: null, isEtf: true, excluded: true },
  { ticker: 'SMH',   reason: '',              strike: 640, weight: 0.0200, seedPrime: null, isEtf: true },
];
