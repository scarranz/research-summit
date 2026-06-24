// Covered-call positions — the MANUAL inputs (mirrors the Excel "Covered Calls"
// sheet, block 1). Everything else (live price, premium, IV, greeks, valuation)
// is pulled at runtime: price/fundamentals from Massive equities, premium/IV/
// greeks from the Massive option chain, forward EBITDA/EPS from summit-data.js.
//
//  ticker     — underlying
//  reason     — valuation lens used in the Excel ("EV EBITDA" | "EV Adj EBITDA")
//  strike     — call strike sold
//  contracts  — number of contracts (each = 100 shares)
//  weight     — % of portfolio (from the Excel "%" column)
//  seedPrime  — last premium from the Excel (per share). Fallback / reference
//               only; the live midpoint from Massive overrides it when available.
//  isEtf      — true for index hedges with no Summit fundamentals (valuation N/A)

export const POSITIONS = [
  { ticker: 'UBER', reason: 'EV Adj EBITDA', strike: 95,  contracts: 63, weight: 0.1325, seedPrime: 0.20 },
  { ticker: 'META', reason: 'EV EBITDA',     strike: 780, contracts: 3,  weight: 0.1328, seedPrime: 1.08 },
  { ticker: 'LYFT', reason: 'EV Adj EBITDA', strike: 19,  contracts: 195,weight: 0.0575, seedPrime: 0.08 },
  { ticker: 'NVDA', reason: 'EV EBITDA',     strike: 295, contracts: 15, weight: 0.1175, seedPrime: 0.27 },
  { ticker: 'TBBB', reason: 'EV EBITDA',     strike: 45,  contracts: 13, weight: 0.0669, seedPrime: null },
  { ticker: 'AMZN', reason: 'EV Adj EBITDA', strike: 320, contracts: 2,  weight: 0.0638, seedPrime: 0.23 },
  { ticker: 'CART', reason: 'EV Adj EBITDA', strike: 47,  contracts: 0,  weight: 0.0147, seedPrime: 0.95 },
  { ticker: 'SPOT', reason: 'EV Adj EBITDA', strike: 650, contracts: 0,  weight: 0.0358, seedPrime: 1.37 },
  { ticker: 'SOFI', reason: 'EV Adj EBITDA', strike: 21,  contracts: 35, weight: 0.0387, seedPrime: 0.25 },
  { ticker: 'MA',   reason: 'EV Adj EBITDA', strike: 580, contracts: 0,  weight: 0.0344, seedPrime: 0.85 },
  { ticker: 'QQQ',  reason: '',              strike: 830, contracts: 16, weight: 0.0520, seedPrime: 0.75, isEtf: true },
  { ticker: 'SMH',  reason: '',              strike: 650, contracts: 0,  weight: 0.0509, seedPrime: null, isEtf: true },
];

// Portfolio value used to express premium income as a yield (Excel AD261 ≈ 8.06M).
// Editable in the UI.
export const PORTFOLIO_VALUE = 8057609;
