// Summit DCF fundamentals for Portfolio Metrics — EBITDA / Earnings / CFO / FCF + shares.
// Flow values in MILLIONS of each company's reporting currency (see currency);
// shares is the latest actual diluted share count (millions) for market cap.
// Forward years (2026+) are the model's projection_history; 2025 is the last actual.
// null = not modelled by Summit for that period (rendered as an em dash).
// Pulled from the Summit MCP. To refresh, ask Claude to re-pull from Summit.
export const SUMMIT_FUND = {
  UBER: { name: "Uber Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", shares: 2119.689, years: {
    "2025": { ebitda: 8730, earnings: 5237, cfo: 10099, fcf: 9763 },
    "2026": { ebitda: 11381.9, earnings: 6870.6, cfo: 11109.3, fcf: 11426.8 },
    "2027": { ebitda: 15891.1, earnings: 9656.4, cfo: 13049.4, fcf: 13685 },
    "2028": { ebitda: 18455.4, earnings: 13515.1, cfo: 15939.1, fcf: 16308.3 },
  }},
  AMZN: { name: "Amazon.com, Inc.", currency: "USD", snapshot: "2026-08-04", shares: 10827, years: {
    "2025": { ebitda: 165198, earnings: 62995, cfo: 139514, fcf: 7695 },
    "2026": { ebitda: 250686.7, earnings: 92039, cfo: 226477.7, fcf: 5021.8 },
    "2027": { ebitda: 332725.5, earnings: 119053.4, cfo: 318102.2, fcf: 41282.3 },
    "2028": { ebitda: 430087.7, earnings: 137412, cfo: 446491.1, fcf: 100466.2 },
  }},
  META: { name: "Meta Platforms, Inc.", currency: "USD", snapshot: "2026-08-04", shares: 2574, years: {
    "2025": { ebitda: 126140, earnings: 60458, cfo: 115800, fcf: 46109 },
    "2026": { ebitda: 143334.4, earnings: 75680.6, cfo: 123335.8, fcf: -21664.2 },
    "2027": { ebitda: 190858, earnings: 101026.3, cfo: 167040.2, fcf: 290.2 },
    "2028": { ebitda: 271129.3, earnings: 140777.7, cfo: 230478.2, fcf: 38715.7 },
  }},
  LYFT: { name: "Lyft, Inc.", currency: "USD", snapshot: "2026-08-07", shares: 417.659, years: {
    "2025": { ebitda: 528.9, earnings: 134.6, cfo: 1168.4, fcf: 1115.6 },
    "2026": { ebitda: 718.8, earnings: 164, cfo: 1373, fcf: 1265.7 },
    "2027": { ebitda: 959, earnings: 459.3, cfo: 1438.5, fcf: 1277.1 },
    "2028": { ebitda: 1186.3, earnings: 591.7, cfo: 1091.4, fcf: 962.1 },
  }},
  TBBB: { name: "BBB Foods Inc.", currency: "MXN", snapshot: "2026-08-13", shares: 115.023, years: {
    "2025": { ebitda: 1921.4, earnings: -2395.4, cfo: 4681.6, fcf: 1132.7 },
    "2026": { ebitda: 2547.7, earnings: -962.6, cfo: null, fcf: null },
    "2027": { ebitda: 3838.5, earnings: 1385.9, cfo: null, fcf: null },
    "2028": { ebitda: 5507.6, earnings: 2914.5, cfo: null, fcf: null },
  }},
  SOFI: { name: "SoFi Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", shares: 1251.767, years: {
    "2025": { ebitda: 1053.9, earnings: 481.3, cfo: -3742.5, fcf: -3984.9 },
    "2026": { ebitda: 1647.1, earnings: 825.7, cfo: null, fcf: null },
    "2027": { ebitda: 2186.1, earnings: 1095, cfo: null, fcf: null },
    "2028": { ebitda: 2902.4, earnings: 1515.7, cfo: null, fcf: null },
  }},
  SPOT: { name: "Spotify Technology S.A.", currency: "EUR", snapshot: "2026-08-05", shares: 210.509, years: {
    "2025": { ebitda: 2549, earnings: 2212, cfo: 2933, fcf: 2872 },
    "2026": { ebitda: 3345.5, earnings: 2821.6, cfo: 3430.5, fcf: 3508.5 },
    "2027": { ebitda: 4258.2, earnings: 3234.8, cfo: 4258.2, fcf: 4340.1 },
    "2028": { ebitda: 5535.3, earnings: 4363.4, cfo: 5535.3, fcf: 5621.3 },
  }},
  NVDA: { name: "NVIDIA Corporation", currency: "USD", snapshot: "2026-08-28", shares: 24804, years: {
    "2025": { ebitda: 85093, earnings: 70206.7, cfo: 70135.2, fcf: 66899.2 },
    "2026": { ebitda: 136224.7, earnings: 110555.8, cfo: 116788.2, fcf: 110746.2 },
    "2027": { ebitda: 276114.3, earnings: 225369.8, cfo: 215710.6, fcf: 207436.2 },
    "2028": { ebitda: 483970.9, earnings: 395606.1, cfo: 361485.4, fcf: 346963.5 },
  }},
  MA: { name: "Mastercard Incorporated", currency: "USD", snapshot: "2026-07-30", shares: 906, years: {
    "2025": { ebitda: 20100, earnings: 14625, cfo: 17648, fcf: 17159 },
    "2026": { ebitda: 23962.2, earnings: 17319.8, cfo: 18866.6, fcf: 18276.4 },
    "2027": { ebitda: 26905.4, earnings: 18652.8, cfo: 20415.4, fcf: 19769.1 },
    "2028": { ebitda: 29856.5, earnings: 20777.5, cfo: 22680.6, fcf: 21961.3 },
  }},
};
