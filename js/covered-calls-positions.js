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
//               against the 2027E basis (which is why the tab now opens on it).
//               XLG is the one position still without one.
//  strike     — call strike sold. `null` means the book does not name one yet:
//               the tab then resolves the nearest listed strike AT OR ABOVE spot
//               for the selected expiry (the first covered call that would not
//               sell the shares below today's price) and marks the cell. Type
//               the real strike over it inline, or set it here.
//  weight     — % of portfolio (from the Excel "%" column), as a decimal
//  isEtf      — index/sector ETFs: no fundamentals, so no multiples are shown
//  seedPrime  — last premium (per share). Fallback / reference only; the live
//               midpoint from Massive overrides it when available.
//
// Order is the book's own order, and it is preserved until a column is sorted.

export const POSITIONS = [
  { ticker: 'UBER',  reason: 'EV Adj EBITDA', strike: 95,   weight: 0.1480, seedPrime: 0.07 },
  { ticker: 'META',  reason: 'EV EBITDA',     strike: 785,  weight: 0.1453, seedPrime: 0.95 },
  { ticker: 'NVDA',  reason: 'EV EBITDA',     strike: 285,  weight: 0.1160, seedPrime: 0.13 },
  { ticker: 'TBBB',  reason: 'EV Adj EBITDA', strike: 60, weight: 0.0900, seedPrime: null },
  { ticker: 'AMZN',  reason: 'EV Adj EBITDA', strike: 295,  weight: 0.0719, seedPrime: 0.17 },
  { ticker: 'SPOT',  reason: 'EV Adj EBITDA', strike: 600,  weight: 0.0400, seedPrime: 2.48 },
  { ticker: 'SOFI',  reason: 'EV Adj EBITDA', strike: 22,   weight: 0.0400, seedPrime: 0.14 },
  { ticker: 'GOOGL', reason: '',              strike: 375, weight: 0.0380, seedPrime: null },
  { ticker: 'MA',    reason: 'EV Adj EBITDA', strike: 645,  weight: 0.0375, seedPrime: 0.33 },
  { ticker: 'LYFT',  reason: 'EV Adj EBITDA', strike: 18,   weight: 0.0185, seedPrime: 0.04 },
  { ticker: 'TSM',   reason: '',              strike: 490, weight: 0.0100, seedPrime: null },
  { ticker: 'QQQ',   reason: '',              strike: 790, weight: 0.0480, seedPrime: null, isEtf: true },
  { ticker: 'XLG',   reason: '',              strike: null, weight: 0.0470, seedPrime: null, isEtf: true },
  { ticker: 'SMH',   reason: '',              strike: 640, weight: 0.0200, seedPrime: null, isEtf: true },
];
