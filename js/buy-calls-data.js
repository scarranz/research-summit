// Buy Calls — the forward estimates behind every multiple in the tab.
//
// A long call is a bet on a PRICE, and a price only means something next to an
// earnings or EBITDA number. So each ticker here carries, per fiscal year:
//   eps      — diluted EPS, USD          → implied P/E at a strike or breakeven
//   ebitda   — EBITDA, $M                → implied EV/EBITDA (with net debt + shares)
//   netIncome, rev, shares, netDebt      — the pieces the two multiples need
//
// Two sources, both already in the repo — nothing is retyped here, so nothing drifts:
//   • APP  → js/overviews/app-model.js — Bloomberg consensus (estimate source BST)
//            for 2026E-2028E, FY2023-FY2025 from the Form 10-K. AppLovin is NOT in
//            the Summit DCF universe, which is why consensus is the basis.
//   • everything else → js/covered-calls-summit.js, the Summit DCF snapshots that
//            already feed the Covered Calls tab (2026/2027 are model projections).
//
// Net debt: the APP model carries it per year (it swings from +$1.1B net debt in
// 2025 to −$10.2B net cash by 2028E, which moves EV/EBITDA materially on a 2028
// LEAPS). The Summit rows do not, so those fall back to the live Massive
// enterprise-value − market-cap at run time.

import { AM_YEARS, AM_ISEST, AM_IS, AM_BS } from './overviews/app-model.js';
import { SUMMIT } from './covered-calls-summit.js';

// ── APP, rebuilt from the model file's parallel arrays ────────────────────────
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

// ── The Summit DCF names, mapped into the same shape ──────────────────────────
// The snapshots store net income and a share count but no EPS, so EPS is derived.
// 2026+ are projections.
function summitYears(su) {
  const out = {};
  Object.keys(su.years).forEach((k) => {
    const y = +k, r = su.years[k];
    out[y] = {
      rev: r.rev, ebitda: r.ebitda, netIncome: r.earnings,
      eps: (r.earnings != null && r.shares_out) ? r.earnings / r.shares_out : null,
      shares: r.shares_out, netDebt: null, est: y >= 2026,
    };
  });
  return out;
}

export const BC_ESTIMATES = {
  APP: {
    name: 'AppLovin Corporation', currency: 'USD',
    ebitdaLabel: 'Adj. EBITDA', epsLabel: 'Adj. diluted EPS',
    source: 'Bloomberg consensus (estimate source BST) for 2026E–2028E; FY2023–FY2025 from the FY2025 Form 10-K and the 1Q26/2Q26 10-Qs. Continuing operations only — the Apps business was sold to Tripledot on 6/30/2025 and is discontinued in every period. AppLovin publishes no forward guidance, so consensus is the only forward basis.',
    years: appYears(),
  },
};

Object.keys(SUMMIT).forEach((tk) => {
  BC_ESTIMATES[tk] = {
    name: SUMMIT[tk].name, currency: SUMMIT[tk].currency,
    ebitdaLabel: 'EBITDA', epsLabel: 'EPS (derived)',
    source: `Summit DCF model, snapshot ${SUMMIT[tk].snapshot_date}. 2026/2027 are the model's own projections; EPS is net income ÷ diluted shares.`,
    years: summitYears(SUMMIT[tk]),
  };
});

// The name the tab opens on.
export const BC_DEFAULT_TICKER = 'APP';
