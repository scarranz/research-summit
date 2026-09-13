// Derivatives — the forward estimates behind every multiple in the four strategy tabs.
//
// Every option here is a bet on a PRICE — the strike you buy at, the floor you
// insure at, the basis you get assigned at — and a price only means something next
// to an earnings or EBITDA number. So each ticker carries, per fiscal year:
//   eps      — diluted EPS, USD          → implied P/E at any of those prices
//   ebitda   — EBITDA, $M                → implied EV/EBITDA (with net debt + shares)
//   netIncome, rev, shares, netDebt      → the pieces the two multiples need
//
// TWO SOURCES, side by side, because "12x 2027E EBITDA" means one thing on our own
// numbers and another on the Street's:
//
//   summit     — the Summit DCF model's own projections.
//   consensus  — Bloomberg consensus, which is stored INSIDE the same Summit
//                snapshot (rev_bbg_est / ebitda_bbg_est / earnings_bbg_est /
//                shares_bbg_est in projection_history). Same vintage as the Summit
//                column beside it, so the two are always compared like for like.
//
// ── WHEN was each set pulled ──────────────────────────────────────────────────
// A forward estimate without a date is unusable: "2027E revenue of $66.9B" is a
// fact about a MOMENT, and six weeks later it may be the Street's old view. So
// every ticker carries the vintage explicitly:
//
//   snapshot        — the date of the Summit workbook the numbers were parsed from.
//   consensusAsOf   — the date the CONSENSUS column is good as of.
//   consensusFrom   — where that date comes from, and this is the important part:
//       'snapshot'  the consensus was read out of the Summit workbook, so all we
//                   actually know is when the WORKBOOK was saved. The Bloomberg
//                   add-in inside it was refreshed at some point at or before
//                   that, and the model carries no field saying when — the MCP's
//                   BBG facts inherit the snapshot_date and nothing else. Treat it
//                   as an upper bound on freshness, not as a pull date.
//       'bbg'       a Bloomberg export pulled on that date, on purpose. This is
//                   the trustworthy one.
//       null        no consensus for this name at all.
//
// The panes print the date next to the Estimates toggle and age it in days, so a
// stale column announces itself instead of being mistaken for today's Street.
//
// Every pane picks one with its Estimates toggle, and the income statement shows
// the gap between them. A source that does not exist for a name is not faked: TBBB
// has no Bloomberg coverage in the model, NVDA's Street numbers start at FY2027
// (its FY2026 closed in January and is reported), and AppLovin is not in the Summit
// DCF universe at all, so consensus is the only basis it has.
//
// To refresh, or to add a ticker once it has a DCF model, ask Claude to pull it
// from the Summit MCP — get_fundamentals(ticker, sheet_sources=['projection_history'])
// carries both sources at once.

import { AM_YEARS, AM_ISEST, AM_IS, AM_BS } from './overviews/app-model.js';

// ── The Summit store: raw pulls, both sources, values in reporting-currency $M ──
// Generated from the Summit MCP. `lastActual` is the last fiscal year the company
// has reported; everything after it is an estimate and is marked E on screen.
export const EST_STORE = {
  UBER: {
    name: "Uber Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", lastActual: 2025,
    consensusAsOf: "2026-09-10", consensusFrom: "bbg",
    summit: {
      2024: { rev: 43978, ebitda: 6484, earnings: 3970, shares: 2154.466 },
      2025: { rev: 52017, ebitda: 8730, earnings: 5237, shares: 2124.391 },
      2026: { rev: 58066.75, ebitda: 11381.86, earnings: 6870.63, shares: 2009.426 },
      2027: { rev: 70356.42, ebitda: 15891.11, earnings: 9656.38, shares: 1939.096 },
      2028: { rev: 80391.35, ebitda: 18455.43, earnings: 13515.08, shares: 1842.141 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2023: { rev: 37281, ebitda: 4052, earnings: 1887, shares: 2091.78 },
      2024: { rev: 43978, ebitda: 6484, earnings: 9856, shares: 2150.51 },
      2025: { rev: 52017, ebitda: 8730, earnings: 10053, shares: 2119.69 },
      2026: { rev: 57792.22, ebitda: 11383.04, earnings: 6741.22, shares: 2050.31 },
      2027: { rev: 66656.1, ebitda: 13830.49, earnings: 9055.02, shares: 2020.62 },
      2028: { rev: 76497, ebitda: 16526.59, earnings: 10880.27, shares: 1975.28 },
    },
  },
  META: {
    name: "Meta Platforms, Inc.", currency: "USD", snapshot: "2026-08-04", lastActual: 2025,
    consensusAsOf: "2026-09-08", consensusFrom: "bbg",
    summit: {
      2024: { rev: 164500, ebitda: null, earnings: 56719.51, shares: 2614 },
      2025: { rev: 200965, ebitda: 127054.03, earnings: 73881.33, shares: 2574 },
      2026: { rev: 256178.17, ebitda: 143334.44, earnings: 75680.57, shares: 2574 },
      2027: { rev: 326206.34, ebitda: 190857.97, earnings: 101026.33, shares: 2574 },
      2028: { rev: 392845.9, ebitda: 271129.28, earnings: 140777.71, shares: 2574 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2023: { rev: 134902, ebitda: 57929, earnings: 39098, shares: 2629 },
      2024: { rev: 164501, ebitda: 84878, earnings: 62360, shares: 2614 },
      2025: { rev: 200966, ebitda: 101892, earnings: 60458, shares: 2574 },
      2026: { rev: 253945.64, ebitda: 119146.61, earnings: 81357.64, shares: 2566.43 },
      2027: { rev: 304784.98, ebitda: 150997.09, earnings: 86681.53, shares: 2582.53 },
      2028: { rev: 361436.61, ebitda: 194833.75, earnings: 101239.57, shares: 2597.27 },
    },
  },
  NVDA: {
    name: "NVIDIA Corporation", currency: "USD", snapshot: "2026-08-28", lastActual: 2026,
    // NVIDIA's fiscal year ends in late January, so its FY2026 ran Feb-2025 to
    // Jan-2026 and is really CALENDAR 2025. Both sources below are keyed on the
    // fiscal label — the model and Bloomberg both call that year 2024/2025/2026 —
    // and the years are shifted to the calendar at import so this name lines up
    // with the rest of the book. Without it, picking "2026E" compared everyone
    // else's calendar 2026 against an NVIDIA year that had already been reported.
    fiscalOffset: 1,   // fiscal year = calendar year + 1
    consensusAsOf: "2026-09-09", consensusFrom: "bbg",
    summit: {
      2024: { rev: 60922, ebitda: 35729.51, earnings: 29288.15, shares: 24940 },
      2025: { rev: 130497, ebitda: 85093.05, earnings: 70206.73, shares: 24804 },
      2026: { rev: 215938, ebitda: 136224.68, earnings: 110555.8, shares: 24514 },
      2027: { rev: 413720.31, ebitda: 276114.35, earnings: 225369.79, shares: 24150.438 },
      2028: { rev: 726095.49, ebitda: 483970.93, earnings: 395606.12, shares: 23786.876 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2024: { rev: 60922, ebitda: 38642, earnings: 32312, shares: 24940 },
      2025: { rev: 130497, ebitda: 88653, earnings: 74265, shares: 24804 },
      2026: { rev: 215938, ebitda: 140143, earnings: 116997, shares: 24514 },
      2027: { rev: 409702.7, ebitda: 272391.84, earnings: 228497.45, shares: 24249.93 },
      2028: { rev: 693718.06, ebitda: 451047.94, earnings: 380886.77, shares: 23998.13 },
      2029: { rev: 918348.91, ebitda: 596848, earnings: 503486.14, shares: 23732.79 },
    },
  },
  TBBB: {
    name: "BBB Foods Inc.", currency: "MXN", snapshot: "2026-08-13", lastActual: 2025,
    consensusAsOf: "2026-09-09", consensusFrom: "bbg",
    summit: {
      2024: { rev: 57439.02, ebitda: 1498.87, earnings: 681.67, shares: 139.607, netDebt: 9810 },
      2025: { rev: 78153.39, ebitda: 1921.37, earnings: -2275.6, shares: 115.023, netDebt: 9810 },
      2026: { rev: 106042.06, ebitda: 2547.66, earnings: -962.55, shares: 115.023, netDebt: 9810 },
      2027: { rev: 141324.66, ebitda: 3838.52, earnings: 1385.92, shares: 115.023, netDebt: 9810 },
      2028: { rev: 184993.98, ebitda: 5507.57, earnings: 2914.45, shares: 115.023, netDebt: 9810 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2024: { rev: 57439.02, ebitda: 2847, earnings: 334.42, shares: 139.61, netDebt: 21540 },
      2025: { rev: 78152.94, ebitda: null, earnings: -2839.57, shares: 115.02, netDebt: 21540 },
      2026: { rev: 103301.5, ebitda: 3402.3, earnings: -1666.88, shares: 115.02, netDebt: 21540 },
      2027: { rev: 130196.15, ebitda: 6205.85, earnings: -144.62, shares: 115.02, netDebt: 21540 },
      2028: { rev: 164742.23, ebitda: 8525.73, earnings: 647.57, shares: 115.02, netDebt: 21540 },
    },
  },
  AMZN: {
    name: "Amazon.com, Inc.", currency: "USD", snapshot: "2026-08-04", lastActual: 2025,
    consensusAsOf: "2026-09-10", consensusFrom: "bbg",
    summit: {
      2024: { rev: 637959, ebitda: 155229.17, earnings: 54772.65, shares: 10721 },
      2025: { rev: 716924, ebitda: 185600.08, earnings: 64969.21, shares: 10827 },
      2026: { rev: 831123.78, ebitda: 250686.72, earnings: 92038.96, shares: 10827 },
      2027: { rev: 959799.99, ebitda: 332725.53, earnings: 119053.41, shares: 10827 },
      2028: { rev: 1101189.6, ebitda: 430087.74, earnings: 137411.99, shares: 10827 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2023: { rev: 574785, ebitda: 109538, earnings: 29793, shares: 10492 },
      2024: { rev: 637959, ebitda: 143399, earnings: 59248, shares: 10721 },
      2025: { rev: 716924, ebitda: 165198, earnings: 77670, shares: 10827 },
      2026: { rev: 828782.97, ebitda: 220794.4, earnings: 137894.33, shares: 10888.6 },
      2027: { rev: 949660.5, ebitda: 283087.5, earnings: 118437.6, shares: 10992.06 },
      2028: { rev: 1092284.64, ebitda: 356131.13, earnings: 151833.86, shares: 11079.91 },
    },
  },
  SPOT: {
    name: "Spotify Technology S.A.", currency: "EUR", snapshot: "2026-08-05", lastActual: 2025,
    consensusAsOf: "2026-09-09", consensusFrom: "bbg",
    // Net CASH of 8,930 EUR M (9,390 cash against ~460 of debt), per Fiscal.ai —
    // SAB, 10 Sep 2026. Carried explicitly for the same two reasons as TBBB:
    // Massive returns no fundamentals for a foreign issuer, and SPOT's Summit model
    // has no balance-sheet lines at all — 46 metrics, every one of them P&L or KPI.
    // Held flat across every year, as net debt is everywhere else here.
    summit: {
      2024: { rev: 15673, ebitda: 2016.97, earnings: 2136.58, shares: 206.99, netDebt: -8930 },
      2025: { rev: 17186, ebitda: 2549, earnings: 3234.11, shares: 210.509, netDebt: -8930 },
      2026: { rev: 19761.54, ebitda: 3345.46, earnings: 2821.64, shares: 206.363, netDebt: -8930 },
      2027: { rev: 23118.84, ebitda: 4258.22, earnings: 3234.78, shares: 202.218, netDebt: -8930 },
      2028: { rev: 27097.44, ebitda: 5535.33, earnings: 4363.44, shares: 198.072, netDebt: -8930 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2023: { rev: 13247, ebitda: -288, earnings: -532, shares: 194.73, netDebt: -8930 },
      2024: { rev: 15673, ebitda: 1486, earnings: 1138, shares: 206.99, netDebt: -8930 },
      2025: { rev: 17186, ebitda: 2300, earnings: 2212, shares: 210.51, netDebt: -8930 },
      2026: { rev: 19522, ebitda: 3011.5, earnings: 2589.47, shares: 209.23, netDebt: -8930 },
      2027: { rev: 22305.67, ebitda: 3887.12, earnings: 3212.43, shares: 209.91, netDebt: -8930 },
      2028: { rev: 25231.66, ebitda: 4809.61, earnings: 3947.64, shares: 208.42, netDebt: -8930 },
    },
  },
  SOFI: {
    name: "SoFi Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", lastActual: 2025,
    consensusAsOf: "2026-09-10", consensusFrom: "bbg",
    summit: {
      2024: { rev: 2676, ebitda: 666.48, earnings: 227.22, shares: 1101.39 },
      2025: { rev: 3613.35, ebitda: 1053.9, earnings: 481.32, shares: 1259.367 },
      2026: { rev: 4845.19, ebitda: 1647.14, earnings: 825.68, shares: 1259.367 },
      2027: { rev: 6280.3, ebitda: 2186.06, earnings: 1094.96, shares: 1259.367 },
      2028: { rev: 8083.79, ebitda: 2902.39, earnings: 1515.7, shares: 1259.367 },
    },
    consensus: {
      2024: { rev: 2606.17, ebitda: 666.48, earnings: 498.67, shares: 1101.39 },
      2025: { rev: 3591.41, ebitda: 1053.9, earnings: 481.32, shares: 1251.77 },
      2026: { rev: 4897.63, ebitda: 1628.36, earnings: 807.1, shares: 1353.53 },
      2027: { rev: 6032.47, ebitda: 2121.55, earnings: 1131.3, shares: 1385.15 },
      2028: { rev: 7350.69, ebitda: 2651.21, earnings: 1476.75, shares: 1391.26 },
    },
  },
  MA: {
    name: "Mastercard Incorporated", currency: "USD", snapshot: "2026-07-30", lastActual: 2025,
    consensusAsOf: "2026-09-10", consensusFrom: "bbg",
    summit: {
      2024: { rev: 28167, ebitda: 16493, earnings: 12570, shares: 927 },
      2025: { rev: 32791, ebitda: 20100, earnings: 14625, shares: 906 },
      2026: { rev: 38058.05, ebitda: 23962.19, earnings: 17319.83, shares: 884.698 },
      2027: { rev: 41679.56, ebitda: 26905.36, earnings: 18652.76, shares: 863.395 },
      2028: { rev: 46385.62, ebitda: 29856.48, earnings: 20777.52, shares: 842.093 },
    },
    consensus: {
      2024: { rev: 28167, ebitda: 17397, earnings: 12874, shares: 927 },
      2025: { rev: 32791, ebitda: 20544, earnings: 14968, shares: 906 },
      2026: { rev: 37278.26, ebitda: 23610.61, earnings: 17286, shares: 880.05 },
      2027: { rev: 41953.5, ebitda: 26669.18, earnings: 19677.14, shares: 856.14 },
      2028: { rev: 46966.19, ebitda: 30219.26, earnings: 22271, shares: 834.37 },
    },
  },
  LYFT: {
    name: "Lyft, Inc.", currency: "USD", snapshot: "2026-08-07", lastActual: 2025,
    consensusAsOf: "2026-09-08", consensusFrom: "bbg",
    summit: {
      2024: { rev: 5785.98, ebitda: 382.4, earnings: -54.17, shares: 413.651 },
      2025: { rev: 6484.3, ebitda: 528.9, earnings: -2.53, shares: 388.428 },
      2026: { rev: 7268.72, ebitda: 718.81, earnings: 164.02, shares: 359.197 },
      2027: { rev: 8068.5, ebitda: 959, earnings: 459.29, shares: 359.197 },
      2028: { rev: 8618.45, ebitda: 1186.31, earnings: 591.73, shares: 359.197 },
    },
    // Bloomberg consensus straight from BBG_CONSENSUS.txt, ALL YEARS — history
    // included. It has to be all-or-nothing: the archive carries GAAP lines while
    // the model carries its own adjusted ones, so mixing a model actual with an
    // archive forecast would invent a growth rate. UBER FY2025 is 5,237 in the
    // model and 10,053 here; taking the model's actual would show +29% into 2026E
    // where the archive's own numbers say -33%.
    // ⚠ THE REPORTED YEARS THEREFORE DIFFER BETWEEN THE TWO TOGGLES. That is the
    // accounting basis, not a disagreement about the future, and the "vs" row in
    // the income statement now prints it on reported years instead of hiding it.
    consensus: {
      2023: { rev: 4403.59, ebitda: 222.4, earnings: -340.3, shares: 385.3 },
      2024: { rev: 5786.02, ebitda: 382.4, earnings: 22.8, shares: 413.7 },
      2025: { rev: 6316.3, ebitda: 528.8, earnings: 2844, shares: 417.66 },
      2026: { rev: 7354.98, ebitda: 695.45, earnings: 218.29, shares: 393.18 },
      2027: { rev: 8287.7, ebitda: 871.76, earnings: 383.56, shares: 390.58 },
      2028: { rev: 9090.71, ebitda: 1008.54, earnings: 455.64, shares: 388.16 },
    },
  },
  CART: {
    name: "Instacart (Maplebear Inc.)", currency: "USD", snapshot: "2026-05-13", lastActual: 2025,
    consensusAsOf: "2026-05-13", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 3378, ebitda: 884, earnings: 444.6, shares: 282.033 },
      2025: { rev: 3742, ebitda: 1088, earnings: 444.8, shares: 265.278 },
      2026: { rev: 4170.69, ebitda: 1275.84, earnings: 622.48, shares: 249.812 },
      2027: { rev: 4677.89, ebitda: 1538.17, earnings: 833.96, shares: 247.314 },
      2028: { rev: 5207.71, ebitda: 1795.41, earnings: 1070.28, shares: 234.948 },
    },
    consensus: {
      2026: { rev: 4153.7, ebitda: 1242.61, earnings: 627.29, shares: 265.005 },
      2027: { rev: 4548.85, ebitda: 1414.29, earnings: 726.67, shares: 262.82 },
      2028: { rev: 4932.1, ebitda: 1554.35, earnings: 827.75, shares: 264.68 },
    },
  },
  // Alphabet. Consensus-only — it has no Summit DCF model, so there is no house
  // column to compare against and the toggle says so. From BBG_CONSENSUS.txt,
  // pulled 2026-09-08, which carries 30 vintages of it back to 2019.
  // ⚠ Net income is Bloomberg's GAAP line (no adjusted twin in the workbook) and it
  // is LUMPY: 132,170 reported, then 240,570 in 2026E and back down to 185,861 in
  // 2027E — an 82% jump and a 23% fall, which is a one-off nobody has stripped out.
  // The EBITDA series is smooth and is the multiple to trust here. Flagged in the
  // source note so the P/E is read with that in mind rather than at face value.
  GOOGL: {
    name: "Alphabet Inc.", currency: "USD", snapshot: "2026-09-08", lastActual: 2025,
    consensusAsOf: "2026-09-08", consensusFrom: "bbg",
    summit: null,   // not in the Summit DCF universe — building one is San's call
    consensus: {
      2023: { rev: 307394, ebitda: 118699, earnings: 73795, shares: 12722 },
      2024: { rev: 350018, ebitda: 127701, earnings: 100118, shares: 12447 },
      2025: { rev: 402836, ebitda: 175128, earnings: 132170, shares: 12230 },
      2026: { rev: 430767.78, ebitda: 226427.79, earnings: 240569.63, shares: 12294.79 },
      2027: { rev: 535776.03, ebitda: 291785.21, earnings: 185861.36, shares: 12326.86 },
      2028: { rev: 657907.18, ebitda: 376882.66, earnings: 220542.31, shares: 12448.55 },
    },
  },
  // Taiwan Semiconductor. Three things make this one different from every other
  // name in the store, and all three are traps if missed:
  //   • it is NOT in the Summit DCF universe, so consensus is the only basis;
  //   • it reports in TWD while the shares we own trade in USD;
  //   • the figures below are for the TAIPEI ordinary share (2330 TT). What
  //     trades in New York is an ADR worth FIVE ordinary shares, so a multiple
  //     built on the ordinary count against the ADR price is out by 5x — and
  //     looks perfectly plausible while being wrong. `adrRatio` is applied in
  //     multiplesAt(); the income statement keeps the ordinary figures, which is
  //     what the filings say.
  TSM: {
    name: "Taiwan Semiconductor Manufacturing Company Limited", currency: "TWD",
    snapshot: "2026-09-10", lastActual: 2025, adrRatio: 5,
    consensusAsOf: "2026-09-10", consensusFrom: "bbg",
    summit: null,   // no Summit DCF model — building one is San's call
    consensus: {
      2024: { rev: 2894308, ebitda: 1984849.68, earnings: 1173267.7, shares: 25929.65, netDebt: -1403514.2 },
      2025: { rev: 3809050, ebitda: 2624188, earnings: 1717883, shares: 25930.56, netDebt: -2035506.9 },
      2026: { rev: 5434681.94, ebitda: 3994701.97, earnings: 2774373.54, shares: 25936.97, netDebt: -3136801.4 },
      2027: { rev: 7323472.87, ebitda: 5353009.82, earnings: 3653557.89, shares: 25937.44, netDebt: -4381232.2 },
      2028: { rev: 9152144.03, ebitda: 6673116.09, earnings: 4519359.5, shares: 25939.35, netDebt: -6407687.2 },
    },
  },
};

// ── APP, rebuilt from the model file's parallel arrays ────────────────────────
// AppLovin is NOT in the Summit DCF universe (search_ticker returns no match), so
// Bloomberg consensus is the only forward basis it has — there is no Summit column
// to compare against, and the toggle says so rather than inventing one.
function appYears() {
  const out = {};
  AM_YEARS.forEach((lbl, i) => {
    const y = parseInt(lbl, 10);
    if (y < 2023) return;                       // 2021/2022 have revenue only
    out[y] = {
      rev: AM_IS.revenue[i],
      ebitda: AM_IS.adjEbitda[i],
      netIncome: AM_IS.netIncome[i],
      eps: AM_IS.epsDiluted[i],
      shares: AM_IS.dilutedShares[i],
      netDebt: AM_BS.netDebt[i],
      est: AM_ISEST[i],
    };
  });
  return out;
}

// ── One source, in the shape every pane reads ─────────────────────────────────
// The store holds net income and a share count but no EPS, so EPS is derived.
// Net debt is not in the store at all: the panes fall back to the live
// enterprise-value − market-cap, which is the honest number for a forward year we
// have no balance-sheet projection for.
function shape(rows, lastActual) {
  const out = {};
  Object.keys(rows).forEach((k) => {
    const y = +k, r = rows[k];
    out[y] = {
      rev: r.rev, ebitda: r.ebitda, netIncome: r.earnings,
      eps: (r.earnings != null && r.shares) ? r.earnings / r.shares : null,
      // Net debt from the estimate set when it carries one — Massive returns no
      // enterprise value for foreign issuers (TSM, SPOT, TBBB), so for those the
      // live fallback is null and EV/EBITDA would go blank without this.
      shares: r.shares, netDebt: r.netDebt ?? null, est: y > lastActual,
    };
  });
  return out;
}

export const OPT_ESTIMATES = {};

// A fiscal year that is not the calendar year is re-keyed here, once, rather than
// special-cased at every place a year is picked. After this the whole store speaks
// CALENDAR years: `lastActual` moves with the rows, so a January reporter ends up
// with the same last reported year as a December one, and every basis-year control,
// growth rate and CAGR compares like for like across the book.
Object.keys(EST_STORE).forEach((tk) => {
  const s = EST_STORE[tk];
  const off = s.fiscalOffset || 0;
  const cal = (rows) => {
    if (!off || !rows) return rows;
    const o = {};
    Object.keys(rows).forEach((k) => { o[+k - off] = rows[k]; });
    return o;
  };
  const lastA = s.lastActual - off;
  const sources = {};
  if (s.summit) {
    sources.summit = {
      label: 'Summit',
      asOf: s.snapshot, asOfFrom: 'snapshot',
      source: `Summit DCF model, snapshot ${s.snapshot}. FY${lastA} and earlier are reported; later years are the model's own projections. EPS is net income ÷ diluted shares.`,
      years: shape(cal(s.summit), lastA),
    };
  }
  if (s.consensus) {
    // A reported year is the same number whichever source you are on — the Street
    // carries no estimate for a year already closed. So the history comes from the
    // model's own actuals columns and only the forward years differ; without this
    // the consensus view would lose its historical anchor and its CAGR.
    const rows = {};
    const sm = cal(s.summit) || {};
    if (s.summit) Object.keys(sm).forEach((k) => { if (+k <= lastA) rows[k] = sm[k]; });
    const cn = cal(s.consensus);
    Object.keys(cn).forEach((k) => { rows[k] = cn[k]; });
    sources.consensus = {
      label: 'Consensus',
      asOf: s.consensusAsOf, asOfFrom: s.consensusFrom,
      source: `Bloomberg consensus${s.consensusFrom === 'bbg'
        ? `, exported from Bloomberg on ${s.consensusAsOf}`
        : ` as carried in the Summit snapshot of ${s.snapshot} — which dates the WORKBOOK, not the Bloomberg refresh inside it, so read it as an upper bound on how fresh the Street column is`}. Same vintage as the Summit column beside it, so the two are comparable. Consensus covers forward years only; FY${lastA} and earlier are the reported figures, identical under either source. EPS is net income ÷ diluted shares.`,
      years: shape(rows, lastA),
    };
  }
  OPT_ESTIMATES[tk] = {
    name: s.name, currency: s.currency, adrRatio: s.adrRatio || 1, fiscalOffset: off,
    ebitdaLabel: 'EBITDA', epsLabel: 'EPS (derived)',
    sources,
  };
});

OPT_ESTIMATES.APP = {
  name: 'AppLovin Corporation', currency: 'USD',
  ebitdaLabel: 'Adj. EBITDA', epsLabel: 'Adj. diluted EPS',
  sources: {
    consensus: {
      label: 'Consensus',
      // No pull date was recorded when this was typed in. The file landed in the
      // repo on 2026-08-19, which is the only bound we have, and a bound is not a
      // vintage — the pane says "date not recorded" rather than implying one.
      asOf: null, asOfFrom: 'unrecorded',
      source: 'Bloomberg consensus (estimate source BST) for 2026E–2028E, pulled on a date that was never recorded — the file entered the repo on 2026-08-19, so it is no fresher than that; FY2023–FY2025 from the FY2025 Form 10-K and the 1Q26/2Q26 10-Qs. Continuing operations only — the Apps business was sold to Tripledot on 6/30/2025 and is discontinued in every period. AppLovin publishes no forward guidance, and is not in the Summit DCF universe, so consensus is the only basis.',
      years: appYears(),
    },
  },
};

// ── Lookups ───────────────────────────────────────────────────────────────────
// A ticker's estimate set for one source, flattened into the shape the panes read.
// Returns null when that source does not exist for that name — the caller shows
// nothing rather than falling back to the other source behind the user's back.
export function optEstimates(ticker, src) {
  const e = OPT_ESTIMATES[ticker];
  if (!e || !e.sources[src]) return null;
  const s = e.sources[src];
  return {
    name: e.name, currency: e.currency, adrRatio: e.adrRatio || 1, fiscalOffset: e.fiscalOffset || 0,
    ebitdaLabel: e.ebitdaLabel, epsLabel: e.epsLabel,
    label: s.label, source: s.source, years: s.years,
    asOf: s.asOf ?? null, asOfFrom: s.asOfFrom ?? null,
  };
}
export const optSources = (ticker) => {
  const e = OPT_ESTIMATES[ticker];
  return e ? Object.keys(e.sources) : [];
};
// Summit's own numbers are the house view, so they lead where they exist.
export const optDefaultSource = (ticker) => {
  const has = optSources(ticker);
  return has.indexOf('summit') >= 0 ? 'summit' : (has[0] || null);
};

// The name the strategy tabs open on.
export const OPT_DEFAULT_TICKER = 'APP';
