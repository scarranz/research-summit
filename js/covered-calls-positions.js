// Covered-call positions — the MANUAL inputs (mirrors the Excel "Covered Calls"
// sheet, block 1). Everything else (live price, premium, IV, greeks, valuation)
// is pulled at runtime: price/fundamentals from Massive equities, premium/IV/
// greeks from the Massive option chain, forward EBITDA/EPS from summit-data.js.
//
// Only THREE fields are manual: ticker, strike, weight. There is no contracts
// field and no portfolio value — the whole analysis is expressed in %, with
// each position's contribution scaled by its portfolio weight.
//
//  ticker     — underlying
//  reason     — valuation lens used in the Excel ("EV EBITDA" | "EV Adj EBITDA")
//  strike     — call strike sold
//  weight     — % of portfolio (from the Excel "%" column), as a decimal
//  seedPrime  — last premium from the Excel (per share). Fallback / reference
//               only; the live midpoint from Massive overrides it when available.
//  isEtf      — true for index hedges with no Summit fundamentals (valuation N/A)

export const POSITIONS = [
  { ticker: 'UBER', reason: 'EV Adj EBITDA', strike: 95,  weight: 0.1325, seedPrime: 0.20 },
  { ticker: 'META', reason: 'EV EBITDA',     strike: 780, weight: 0.1328, seedPrime: 1.08 },
  { ticker: 'LYFT', reason: 'EV Adj EBITDA', strike: 19,  weight: 0.0575, seedPrime: 0.08 },
  { ticker: 'NVDA', reason: 'EV EBITDA',     strike: 295, weight: 0.1175, seedPrime: 0.27 },
  { ticker: 'TBBB', reason: 'EV EBITDA',     strike: 45,  weight: 0.0669, seedPrime: null },
  { ticker: 'AMZN', reason: 'EV Adj EBITDA', strike: 320, weight: 0.0638, seedPrime: 0.23 },
  { ticker: 'CART', reason: 'EV Adj EBITDA', strike: 47,  weight: 0.0147, seedPrime: 0.95 },
  { ticker: 'SPOT', reason: 'EV Adj EBITDA', strike: 650, weight: 0.0358, seedPrime: 1.37 },
  { ticker: 'SOFI', reason: 'EV Adj EBITDA', strike: 21,  weight: 0.0387, seedPrime: 0.25 },
  { ticker: 'MA',   reason: 'EV Adj EBITDA', strike: 580, weight: 0.0344, seedPrime: 0.85 },
  { ticker: 'QQQ',  reason: '',              strike: 830, weight: 0.0520, seedPrime: 0.75, isEtf: true },
  { ticker: 'SMH',  reason: '',              strike: 650, weight: 0.0509, seedPrime: null, isEtf: true },
];
