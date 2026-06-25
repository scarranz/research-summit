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
//  strike     — call strike sold
//  weight     — % of portfolio (from the Excel "%" column), as a decimal
//  seedPrime  — last premium (per share). Fallback / reference only; the live
//               midpoint from Massive overrides it when available.

export const POSITIONS = [
  { ticker: 'UBER', reason: 'EV Adj EBITDA', strike: 90,  weight: 0.1400, seedPrime: 0.07 },
  { ticker: 'META', reason: 'EV EBITDA',     strike: 650, weight: 0.1225, seedPrime: 0.95 },
  { ticker: 'LYFT', reason: 'EV Adj EBITDA', strike: 18,  weight: 0.0610, seedPrime: 0.04 },
  { ticker: 'NVDA', reason: 'EV EBITDA',     strike: 250, weight: 0.1100, seedPrime: 0.13 },
  { ticker: 'AMZN', reason: 'EV Adj EBITDA', strike: 280, weight: 0.0715, seedPrime: 0.17 },
  { ticker: 'CART', reason: 'EV Adj EBITDA', strike: 53,  weight: 0.0100, seedPrime: 0.30 },
  { ticker: 'SPOT', reason: 'EV Adj EBITDA', strike: 580, weight: 0.0370, seedPrime: 2.48 },
  { ticker: 'SOFI', reason: 'EV Adj EBITDA', strike: 21,  weight: 0.0430, seedPrime: 0.14 },
  { ticker: 'MA',   reason: 'EV Adj EBITDA', strike: 570, weight: 0.0350, seedPrime: 0.33 },
];
