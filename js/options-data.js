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
    consensusAsOf: "2026-08-05", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 43978, ebitda: 6484, earnings: 3970, shares: 2154.466 },
      2025: { rev: 52017, ebitda: 8730, earnings: 5237, shares: 2124.391 },
      2026: { rev: 58066.75, ebitda: 11381.86, earnings: 6870.63, shares: 2009.426 },
      2027: { rev: 70356.42, ebitda: 15891.11, earnings: 9656.38, shares: 1939.096 },
      2028: { rev: 80391.35, ebitda: 18455.43, earnings: 13515.08, shares: 1842.141 },
    },
    consensus: {
      2026: { rev: 58173.1, ebitda: 11390.21, earnings: 6901.39, shares: 2059.461 },
      2027: { rev: 66900.56, ebitda: 13545.21, earnings: 8926.09, shares: 2025.821 },
      2028: { rev: 76723.06, ebitda: 16288.18, earnings: 10971.21, shares: 1983.341 },
    },
  },
  META: {
    name: "Meta Platforms, Inc.", currency: "USD", snapshot: "2026-08-04", lastActual: 2025,
    consensusAsOf: "2026-08-04", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 164500, ebitda: null, earnings: 56719.51, shares: 2614 },
      2025: { rev: 200965, ebitda: 127054.03, earnings: 73881.33, shares: 2574 },
      2026: { rev: 256178.17, ebitda: 143334.44, earnings: 75680.57, shares: 2574 },
      2027: { rev: 326206.34, ebitda: 190857.97, earnings: 101026.33, shares: 2574 },
      2028: { rev: 392845.9, ebitda: 271129.28, earnings: 140777.71, shares: 2574 },
    },
    consensus: {
      2026: { rev: 254015.78, ebitda: 138167.65, earnings: 93461.41, shares: 2566.77 },
      2027: { rev: 305065.29, ebitda: 178456.02, earnings: 103178.35, shares: 2583.45 },
      2028: { rev: 360834.75, ebitda: 221169.97, earnings: 124524.43, shares: 2598.418 },
    },
  },
  NVDA: {
    name: "NVIDIA Corporation", currency: "USD", snapshot: "2026-08-28", lastActual: 2026,
    consensusAsOf: "2026-08-28", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 60922, ebitda: 35729.51, earnings: 29288.15, shares: 24940 },
      2025: { rev: 130497, ebitda: 85093.05, earnings: 70206.73, shares: 24804 },
      2026: { rev: 215938, ebitda: 136224.68, earnings: 110555.8, shares: 24514 },
      2027: { rev: 413720.31, ebitda: 276114.35, earnings: 225369.79, shares: 24150.438 },
      2028: { rev: 726095.49, ebitda: 483970.93, earnings: 395606.12, shares: 23786.876 },
    },
    consensus: {
      2027: { rev: 406779.46, ebitda: 271111.43, earnings: 239106.56, shares: 24273.473 },
      2028: { rev: 670087.28, ebitda: 430132.57, earnings: 372561.23, shares: 24051.473 },
    },
  },
  TBBB: {
    name: "BBB Foods Inc.", currency: "MXN", snapshot: "2026-08-13", lastActual: 2025,
    consensusAsOf: null, consensusFrom: null,   // no Bloomberg coverage at all
    summit: {
      2024: { rev: 57439.02, ebitda: 1498.87, earnings: 681.67, shares: 139.607 },
      2025: { rev: 78153.39, ebitda: 1921.37, earnings: -2275.6, shares: 115.023 },
      2026: { rev: 106042.06, ebitda: 2547.66, earnings: -962.55, shares: 115.023 },
      2027: { rev: 141324.66, ebitda: 3838.52, earnings: 1385.92, shares: 115.023 },
      2028: { rev: 184993.98, ebitda: 5507.57, earnings: 2914.45, shares: 115.023 },
    },
    consensus: null,   // no Bloomberg coverage in the model
  },
  AMZN: {
    name: "Amazon.com, Inc.", currency: "USD", snapshot: "2026-08-04", lastActual: 2025,
    consensusAsOf: "2026-08-04", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 637959, ebitda: 155229.17, earnings: 54772.65, shares: 10721 },
      2025: { rev: 716924, ebitda: 185600.08, earnings: 64969.21, shares: 10827 },
      2026: { rev: 831123.78, ebitda: 250686.72, earnings: 92038.96, shares: 10827 },
      2027: { rev: 959799.99, ebitda: 332725.53, earnings: 119053.41, shares: 10827 },
      2028: { rev: 1101189.6, ebitda: 430087.74, earnings: 137411.99, shares: 10827 },
    },
    consensus: {
      2026: { rev: 827451.78, ebitda: 216614.33, earnings: 114401.96, shares: 10884.708 },
      2027: { rev: 946680.13, ebitda: 280171.74, earnings: 116800.63, shares: 10975.598 },
      2028: { rev: 1069017.11, ebitda: 354937.9, earnings: 149737.54, shares: 11058.166 },
    },
  },
  SPOT: {
    name: "Spotify Technology S.A.", currency: "EUR", snapshot: "2026-08-05", lastActual: 2025,
    consensusAsOf: "2026-08-05", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 15673, ebitda: 2016.97, earnings: 2136.58, shares: 206.99 },
      2025: { rev: 17186, ebitda: 2549, earnings: 3234.11, shares: 210.509 },
      2026: { rev: 19761.54, ebitda: 3345.46, earnings: 2821.64, shares: 206.363 },
      2027: { rev: 23118.84, ebitda: 4258.22, earnings: 3234.78, shares: 202.218 },
      2028: { rev: 27097.44, ebitda: 5535.33, earnings: 4363.44, shares: 198.072 },
    },
    consensus: {
      2026: { rev: 19526.64, ebitda: 3004.55, earnings: 2597.91, shares: 209.237 },
      2027: { rev: 22316.1, ebitda: 3889.24, earnings: 3218.68, shares: 209.921 },
      2028: { rev: 25332.73, ebitda: 4816.5, earnings: 3972.89, shares: 208.447 },
    },
  },
  SOFI: {
    name: "SoFi Technologies, Inc.", currency: "USD", snapshot: "2026-08-05", lastActual: 2025,
    consensusAsOf: "2026-08-05", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 2676, ebitda: 666.48, earnings: 227.22, shares: 1101.39 },
      2025: { rev: 3613.35, ebitda: 1053.9, earnings: 481.32, shares: 1259.367 },
      2026: { rev: 4845.19, ebitda: 1647.14, earnings: 825.68, shares: 1259.367 },
      2027: { rev: 6280.3, ebitda: 2186.06, earnings: 1094.96, shares: 1259.367 },
      2028: { rev: 8083.79, ebitda: 2902.39, earnings: 1515.7, shares: 1259.367 },
    },
    consensus: {
      2026: { rev: 4845.12, ebitda: 1623.95, earnings: 816.58, shares: 1360.331 },
      2027: { rev: 5939.94, ebitda: 2112.45, earnings: 1134.84, shares: 1392.622 },
      2028: { rev: 7226.5, ebitda: 2637, earnings: 1482.1, shares: 1391.402 },
    },
  },
  MA: {
    name: "Mastercard Incorporated", currency: "USD", snapshot: "2026-07-30", lastActual: 2025,
    consensusAsOf: "2026-07-30", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 28167, ebitda: 16493, earnings: 12570, shares: 927 },
      2025: { rev: 32791, ebitda: 20100, earnings: 14625, shares: 906 },
      2026: { rev: 38058.05, ebitda: 23962.19, earnings: 17319.83, shares: 884.698 },
      2027: { rev: 41679.56, ebitda: 26905.36, earnings: 18652.76, shares: 863.395 },
      2028: { rev: 46385.62, ebitda: 29856.48, earnings: 20777.52, shares: 842.093 },
    },
    consensus: {
      2026: { rev: 37088.95, ebitda: 23398.92, earnings: 17124.57, shares: 883.459 },
      2027: { rev: 41753.14, ebitda: 26428.19, earnings: 19554.87, shares: 862.073 },
      2028: { rev: 46733.96, ebitda: 29820.06, earnings: 22057.62, shares: 841.037 },
    },
  },
  LYFT: {
    name: "Lyft, Inc.", currency: "USD", snapshot: "2026-08-07", lastActual: 2025,
    consensusAsOf: "2026-08-07", consensusFrom: "snapshot",
    summit: {
      2024: { rev: 5785.98, ebitda: 382.4, earnings: -54.17, shares: 413.651 },
      2025: { rev: 6484.3, ebitda: 528.9, earnings: -2.53, shares: 388.428 },
      2026: { rev: 7268.72, ebitda: 718.81, earnings: 164.02, shares: 359.197 },
      2027: { rev: 8068.5, ebitda: 959, earnings: 459.29, shares: 359.197 },
      2028: { rev: 8618.45, ebitda: 1186.31, earnings: 591.73, shares: 359.197 },
    },
    consensus: {
      2026: { rev: 7335.24, ebitda: 692.57, earnings: 220.54, shares: 396.767 },
      2027: { rev: 8255.72, ebitda: 867.4, earnings: 387.13, shares: 395.106 },
      2028: { rev: 9105.07, ebitda: 1008.68, earnings: 448.71, shares: 390.467 },
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
      shares: r.shares, netDebt: null, est: y > lastActual,
    };
  });
  return out;
}

export const OPT_ESTIMATES = {};

Object.keys(EST_STORE).forEach((tk) => {
  const s = EST_STORE[tk];
  const sources = {};
  if (s.summit) {
    sources.summit = {
      label: 'Summit',
      asOf: s.snapshot, asOfFrom: 'snapshot',
      source: `Summit DCF model, snapshot ${s.snapshot}. FY${s.lastActual} and earlier are reported; later years are the model's own projections. EPS is net income ÷ diluted shares.`,
      years: shape(s.summit, s.lastActual),
    };
  }
  if (s.consensus) {
    // A reported year is the same number whichever source you are on — the Street
    // carries no estimate for a year already closed. So the history comes from the
    // model's own actuals columns and only the forward years differ; without this
    // the consensus view would lose its historical anchor and its CAGR.
    const rows = {};
    if (s.summit) Object.keys(s.summit).forEach((k) => { if (+k <= s.lastActual) rows[k] = s.summit[k]; });
    Object.keys(s.consensus).forEach((k) => { rows[k] = s.consensus[k]; });
    sources.consensus = {
      label: 'Consensus',
      asOf: s.consensusAsOf, asOfFrom: s.consensusFrom,
      source: `Bloomberg consensus${s.consensusFrom === 'bbg'
        ? `, exported from Bloomberg on ${s.consensusAsOf}`
        : ` as carried in the Summit snapshot of ${s.snapshot} — which dates the WORKBOOK, not the Bloomberg refresh inside it, so read it as an upper bound on how fresh the Street column is`}. Same vintage as the Summit column beside it, so the two are comparable. Consensus covers forward years only; FY${s.lastActual} and earlier are the reported figures, identical under either source. EPS is net income ÷ diluted shares.`,
      years: shape(rows, s.lastActual),
    };
  }
  OPT_ESTIMATES[tk] = {
    name: s.name, currency: s.currency,
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
    name: e.name, currency: e.currency,
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
