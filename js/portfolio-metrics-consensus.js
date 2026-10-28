// Street consensus for Portfolio Metrics — the alternative to the Summit DCF in
// the Source toggle. Same shape as SUMMIT_FUND (js/portfolio-metrics-summit.js)
// so the tab reads either one through the same accessors.
//
// Values in MILLIONS of each company's reporting currency, matching its Summit
// record. Pulled from the Summit MCP: the BBG_EST series that sit alongside the
// model (`<TICKER>:earnings_bbg_est`, `:ebitda_bbg_est`, `:shares_bbg_est`,
// sheet_source `projection_history`, source `BBG`). To refresh, ask Claude to
// re-pull — get_fundamentals(ticker, sources=['BBG']) returns a whole name at once.
//
// TWO CLASSES OF NUMBER LIVE HERE, and the difference matters:
//
//   • ebitda / earnings / shares — REAL street consensus, straight from BBG_EST.
//
//   • cfo / fcf — DERIVED, not consensus. The model carries no CFO or FCF estimate
//     on the street side (every ticker returns metric_count 4: earnings, ebitda,
//     rev, shares). These are the consensus EBITDA run through the company's own
//     Summit conversion rates for that year — cfo = ebitda_bbg × (cfo_summit ÷
//     ebitda_summit), fcf likewise. So they answer "what would cash flow look like
//     if the street's EBITDA converted the way our model says it converts", NOT
//     "what does the street forecast for cash flow". Every record carrying them is
//     tagged `derived`, and the tab marks those cells so they can't be misread.
//     Replace them the moment a real CFO/FCF consensus feed exists.
//
// `shares` is carried PER YEAR here (Summit's own share count is flat across the
// forecast). That is what makes EPS growth differ from Earnings growth under
// consensus — buybacks at MA and UBER, dilution at AMZN and SOFI.
//
// Gaps are absent rather than zero, and fall through to hand-typed values:
// TBBB (no BBG coverage at all), NVDA 2026 (its Jan fiscal year), and SOFI's
// cfo/fcf (Summit projects neither past 2025, so there is no rate to derive from).
const DERIVED_CASH = ['cfo', 'fcf'];

export const CONSENSUS_FUND = {
  UBER: { name: "Uber Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 11390.2, earnings: 6901.4, shares: 2059.461, cfo: 11117.4, fcf: 11435.1 },
    "2027": { ebitda: 13545.2, earnings: 8926.1, shares: 2025.821, cfo: 11123.0, fcf: 11664.8 },
    "2028": { ebitda: 16288.2, earnings: 10971.2, shares: 1983.341, cfo: 14067.4, fcf: 14393.2 },
  }},
  AMZN: { name: "Amazon.com, Inc.", currency: "USD", snapshot: "2026-08-04", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 216614.3, earnings: 114402.0, shares: 10884.708, cfo: 195695.7, fcf: 4339.3 },
    "2027": { ebitda: 280171.7, earnings: 116800.6, shares: 10975.598, cfo: 267858.1, fcf: 34761.8 },
    "2028": { ebitda: 354937.9, earnings: 149737.5, shares: 11058.166, cfo: 368475.1, fcf: 82911.6 },
  }},
  META: { name: "Meta Platforms, Inc.", currency: "USD", snapshot: "2026-08-04", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 138167.6, earnings: 93461.4, shares: 2566.770, cfo: 118889.9, fcf: -20883.3 },
    "2027": { ebitda: 178456.0, earnings: 103178.4, shares: 2583.450, cfo: 156185.9, fcf: 271.3 },
    "2028": { ebitda: 221170.0, earnings: 124524.4, shares: 2598.418, cfo: 188009.4, fcf: 31581.8 },
  }},
  LYFT: { name: "Lyft, Inc.", currency: "USD", snapshot: "2026-08-07", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 692.6, earnings: 220.5, shares: 396.767, cfo: 1323.0, fcf: 1219.6 },
    "2027": { ebitda: 867.4, earnings: 387.1, shares: 395.106, cfo: 1301.1, fcf: 1155.1 },
    "2028": { ebitda: 1008.7, earnings: 448.7, shares: 390.467, cfo: 928.0, fcf: 818.1 },
  }},
  // SOFI carries no Summit CFO/FCF past 2025, so there is no conversion rate to
  // derive from — those two stay hand-typed under Consensus.
  SOFI: { name: "SoFi Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", years: {
    "2026": { ebitda: 1624.0, earnings: 816.6, shares: 1360.331 },
    "2027": { ebitda: 2112.5, earnings: 1134.8, shares: 1392.622 },
    "2028": { ebitda: 2637.0, earnings: 1482.1, shares: 1391.402 },
  }},
  SPOT: { name: "Spotify Technology S.A.", currency: "EUR", snapshot: "2026-08-05", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 3004.6, earnings: 2597.9, shares: 209.237, cfo: 3080.9, fcf: 3151.0 },
    "2027": { ebitda: 3889.2, earnings: 3218.7, shares: 209.921, cfo: 3889.2, fcf: 3964.0 },
    "2028": { ebitda: 4816.5, earnings: 3972.9, shares: 208.447, cfo: 4816.5, fcf: 4891.3 },
  }},
  // Keys are NVIDIA's own fiscal labels (Jan year-end), lined up to the calendar by
  // fyOffset — see the Summit record. FY2027 is the street's first estimated year
  // because FY2026 closed in Jan 2026; FY2029 fills the calendar-2028 column.
  NVDA: { name: "NVIDIA Corporation", currency: "USD", snapshot: "2026-08-28", fyOffset: 1, derived: DERIVED_CASH, years: {
    "2027": { ebitda: 271111.4, earnings: 239106.6, shares: 24273.473, cfo: 211802.2, fcf: 203677.7 },
    "2028": { ebitda: 430132.6, earnings: 372561.2, shares: 24051.473, cfo: 321272.7, fcf: 308366.3 },
    "2029": { ebitda: 542333.2, earnings: 466765.0, shares: 23757.432, cfo: 444453.0, fcf: 428487.7 },
  }},
  MA: { name: "Mastercard Incorporated", currency: "USD", snapshot: "2026-07-30", derived: DERIVED_CASH, years: {
    "2026": { ebitda: 23398.9, earnings: 17124.6, shares: 883.459, cfo: 18423.1, fcf: 17846.8 },
    "2027": { ebitda: 26428.2, earnings: 19554.9, shares: 862.073, cfo: 20053.3, fcf: 19418.5 },
    "2028": { ebitda: 29820.1, earnings: 22057.6, shares: 841.037, cfo: 22652.9, fcf: 21934.5 },
  }},
  // TBBB carries no BBG estimates in the model — every series comes back zero.
  // Left out on purpose so it falls through to hand-typed values.
};
