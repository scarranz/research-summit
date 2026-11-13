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

// ── Strikes = the price targets of each name's latest Summit DCF submit ──────
// Reset 13 Nov 2026 at SAB's instruction: every equity strike is the LISTED strike
// nearest the 1-year price target of the latest submit, on the P/E method
// (EV/EBITDA where the submit carries no P/E target: SPOT, TBBB), on the
// 2027-01-15 chain — the January roll date, before most of the book reports 4Q.
// TBBB lists no January expiry, so the tab takes its next one (2027-02-19).
// A target below spot gives an in-the-money call ON PURPOSE: the policy is
// "sell only at our own target". `pt` is that target (USD/share) and `ptSrc`
// where it came from; hover the strike to see both. ETF strikes are unchanged
// (no Summit model, so no target).
export const POSITIONS = [
  { ticker: 'UBER',  reason: 'EV Adj EBITDA', strike: 150,  pt: 154.36,  ptSrc: 'Summit submit 2026-11-04 · P/E 23x 2028E', weight: 0.1480, seedPrime: 0.07, excluded: true },
  { ticker: 'META',  reason: 'EV EBITDA',     strike: 1100, pt: 1097.56, ptSrc: 'Summit submit 2026-10-22 · P/E 18x 2028E', weight: 0.1453, seedPrime: 0.95 },
  { ticker: 'NVDA',  reason: 'EV EBITDA',     strike: 370,  pt: 370.00,  ptSrc: 'Summit submit 2026-08-28 · P/E 22x FY2028E (no newer submit)', weight: 0.1160, seedPrime: 0.13 },
  { ticker: 'TBBB',  reason: 'EV Adj EBITDA', strike: 65,   pt: 62.85,   ptSrc: 'Summit submit 2026-08-13 · EV/EBITDA 30x 2028E (the P/E leg has no target; no newer submit)', weight: 0.0900, seedPrime: null, excluded: true },
  { ticker: 'AMZN',  reason: 'EV Adj EBITDA', strike: 270,  pt: 271.68,  ptSrc: 'Summit submit 2026-10-30 · P/E 25x 2027E', weight: 0.0719, seedPrime: 0.17 },
  { ticker: 'SPOT',  reason: 'EV Adj EBITDA', strike: 530,  pt: 532.86,  ptSrc: 'Summit submit 2026-10-22 · EV/EBITDA 20.5x 2027E (no P/E target in the submit)', weight: 0.0400, seedPrime: 2.48 },
  { ticker: 'SOFI',  reason: 'EV Adj EBITDA', strike: 29,   pt: 28.67,   ptSrc: 'Summit submit 2026-10-27 · P/E 22x 2028E (read from the workbook; the MCP carries no SOFI valuation)', weight: 0.0400, seedPrime: 0.14 },
  { ticker: 'GOOGL', reason: '',              strike: 390,  pt: 387.73,  ptSrc: 'Summit submit 2026-10-29 · P/E 20x 2028E', weight: 0.0380, seedPrime: null },
  { ticker: 'MA',    reason: 'EV Adj EBITDA', strike: 620,  pt: 619.80,  ptSrc: 'Summit submit 2026-10-28 · P/E 28x 2027E', weight: 0.0375, seedPrime: 0.33, excluded: true },
  { ticker: 'LYFT',  reason: 'EV Adj EBITDA', strike: 24,   pt: 23.76,   ptSrc: 'Summit submit 2026-08-07 · P/E 16x 2027E — the workbook copies one target into both methods, so read it as unreliable (no newer submit)', weight: 0.0185, seedPrime: 0.04, excluded: true },
  { ticker: 'TSM',   reason: '',              strike: 450,  pt: 453.92,  ptSrc: 'Summit submit 2026-10-19 · P/E 20x 2027E', weight: 0.0100, seedPrime: null },
  { ticker: 'QQQ',   reason: '',              strike: 790, weight: 0.0480, seedPrime: null, isEtf: true, excluded: true },
  { ticker: 'XLG',   reason: '',              strike: null, weight: 0.0470, seedPrime: null, isEtf: true, excluded: true },
  { ticker: 'SMH',   reason: '',              strike: 640, weight: 0.0200, seedPrime: null, isEtf: true },
];
