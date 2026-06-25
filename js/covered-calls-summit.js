// Summit DCF projections — forward EBITDA / earnings used for the "valuation if
// exercised" multiples (EV/EBITDA and P/E at the strike price).
// All financial values in MILLIONS of the company's reporting currency.
// Forward years (2026+) are projection_history (the model's estimates).
// To refresh or add a ticker, ask Claude to pull it from the Summit MCP.
//
// NOTE: SPOT reports in EUR and TBBB in MXN — forward multiples vs a USD price
// need FX conversion (the app flags these rather than show wrong numbers).

export const SUMMIT = {
  UBER: {
    name: "Uber Technologies, Inc.", currency: "USD", snapshot_date: "2026-05-07",
    years: {
      2024: { rev: 43978,    ebitda: 6484,     earnings: 3970,    shares_out: 2154.466 },
      2025: { rev: 52017,    ebitda: 8730,     earnings: 5237,    shares_out: 2124.391 },
      2026: { rev: 58695.21, ebitda: 11546.74, earnings: 7067.00, shares_out: 1979.57  },
      2027: { rev: 68127.69, ebitda: 14817.44, earnings: 9172.58, shares_out: 1890.49  },
    },
  },
  AMZN: {
    name: "Amazon.com, Inc.", currency: "USD", snapshot_date: "2026-05-13",
    years: {
      2024: { rev: 637959,    ebitda: 155229.17, earnings: 54772.65,  shares_out: 10721 },
      2025: { rev: 716924,    ebitda: 185600.08, earnings: 64969.21,  shares_out: 10827 },
      2026: { rev: 823035.40, ebitda: 238289.05, earnings: 85902.25,  shares_out: 10827 },
      2027: { rev: 941960.21, ebitda: 301971.45, earnings: 109056.02, shares_out: 10827 },
    },
  },
  CART: {
    name: "Maplebear Inc. (Instacart)", currency: "USD", snapshot_date: "2026-05-13",
    years: {
      2024: { rev: 3378,    ebitda: 884,     earnings: 444.6,   shares_out: 282.033 },
      2025: { rev: 3742,    ebitda: 1088,    earnings: 444.8,   shares_out: 265.278 },
      2026: { rev: 4170.69, ebitda: 1275.84, earnings: 622.48,  shares_out: 249.812 },
      2027: { rev: 4677.89, ebitda: 1538.17, earnings: 833.96,  shares_out: 247.314 },
    },
  },
  LYFT: {
    name: "Lyft, Inc.", currency: "USD", snapshot_date: "2026-05-13",
    years: {
      2024: { rev: 5785.98, ebitda: 382.4,  earnings: -59.30,  shares_out: 413.651 },
      2025: { rev: 6484.30, ebitda: 528.9,  earnings: 2.45,    shares_out: 381.282 },
      2026: { rev: 7372.69, ebitda: 683.15, earnings: 167.32,  shares_out: 344.905 },
      2027: { rev: 8219.33, ebitda: 829.78, earnings: 359.48,  shares_out: 344.905 },
    },
  },
  MA: {
    name: "Mastercard Incorporated", currency: "USD", snapshot_date: "2026-05-22",
    years: {
      2024: { rev: 28167,    ebitda: 16493,    earnings: 12570,    shares_out: 927 },
      2025: { rev: 32791,    ebitda: 20100,    earnings: 14625,    shares_out: 906 },
      2026: { rev: 38161.85, ebitda: 23504.66, earnings: 17069.93, shares_out: 881.976 },
      2027: { rev: 41901.69, ebitda: 26302.48, earnings: 18343.52, shares_out: 857.951 },
    },
  },
  META: {
    name: "Meta Platforms, Inc.", currency: "USD", snapshot_date: "2026-05-22",
    years: {
      2024: { rev: 164500,    ebitda: null,      earnings: 56719.51,  shares_out: 2614 },
      2025: { rev: 200965,    ebitda: 126644.80, earnings: 73881.33,  shares_out: 2574 },
      2026: { rev: 256181.52, ebitda: 168427.88, earnings: 99776.23,  shares_out: 2574 },
      2027: { rev: 322461.11, ebitda: 220074.48, earnings: 129423.49, shares_out: 2574 },
    },
  },
  NVDA: {
    name: "NVIDIA Corporation", currency: "USD", snapshot_date: "2026-05-26",
    years: {
      2024: { rev: 60922,    ebitda: 35729.51,  earnings: 29288.15,  shares_out: 24940 },
      2025: { rev: 130497,   ebitda: 85093.05,  earnings: 70206.73,  shares_out: 24804 },
      2026: { rev: 215938,   ebitda: 136224.68, earnings: 110555.80, shares_out: 24514 },
      2027: { rev: 390324.19,ebitda: 261030.06, earnings: 213316.27, shares_out: 24139.28 },
    },
  },
  SOFI: {
    name: "SoFi Technologies, Inc.", currency: "USD", snapshot_date: "2026-05-13",
    years: {
      2024: { rev: 2675.997, ebitda: 666.48,   earnings: 227.222, shares_out: 1101.39 },
      2025: { rev: 3613.354, ebitda: 1053.898, earnings: 481.32,  shares_out: 1259.367 },
      2026: { rev: 4669.52,  ebitda: 1576.64,  earnings: 828.74,  shares_out: 1259.367 },
      2027: { rev: 6287.65,  ebitda: 2292.55,  earnings: 1292.06, shares_out: 1259.367 },
    },
  },
  SPOT: {
    name: "Spotify Technology S.A.", currency: "EUR", snapshot_date: "2026-05-22",
    years: {
      2024: { rev: 15673,    ebitda: 2016.97, earnings: 2136.58, shares_out: 206.990 },
      2025: { rev: 17186,    ebitda: 2552,    earnings: 3234.11, shares_out: 210.509 },
      2026: { rev: 19775.17, ebitda: 3249.67, earnings: 2760.34, shares_out: 206.642 },
      2027: { rev: 22957.97, ebitda: 4047.51, earnings: 3075.94, shares_out: 202.776 },
    },
  },
  TBBB: {
    name: "BBB Foods Inc.", currency: "MXN", snapshot_date: "2026-05-22",
    years: {
      2024: { rev: 57439.019,  ebitda: 1498.866, earnings: 681.670,   shares_out: 139.607 },
      2025: { rev: 78153.393,  ebitda: 1921.375, earnings: -2275.602, shares_out: 115.023 },
      2026: { rev: 103158.996, ebitda: 2560.971, earnings: -947.219,  shares_out: 115.023 },
      2027: { rev: 131354.880, ebitda: 3654.071, earnings: 1141.690,  shares_out: 115.023 },
    },
  },
};
