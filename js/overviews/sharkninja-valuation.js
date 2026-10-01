// overviews/sharkninja-valuation.js — Valuation for SharkNinja. docs/PANE_CATALOG.md §4.
//
// ── WHAT THE SECTION CAN AND CANNOT CARRY ────────────────────────────────────────────────────
// §4 defines four panes. Two of them are blocked on a Summit DCF model that does not exist for
// SN, and the catalog is explicit that they never come free from the Results dataset:
//
//   Historic Multiple      ⚠ PARTIAL. The multiple HISTORY needs daily price + quarterly
//                          shares/net-debt via the `get-market-history` edge function, which is
//                          not deployed (San/Oscar only), AND consensus EPS/EBITDA per fiscal
//                          year out of `estMatrix.cons`, which SN does not have. §4 says the
//                          correct behaviour is an honest "live data unavailable" state, not a
//                          broken chart. What IS computable is the CURRENT point on that series
//                          — live price against the Street strip already in results-data/sn.js —
//                          so this pane carries that instead of an empty frame.
//   Peers                  ✅ BUILDABLE. One hand-seeded, dated array; SN already has it.
//   Target Multiple / PEG  ⛔ Needs a snapshot-by-snapshot transcription of the Summit DCF's
//                          saved vintages. No model for SN, so there are no snapshots.
//   Sensitivity Analysis   ⛔ Needs per-segment revenue/operating income/EBITDA hand-transcribed
//                          from ONE Summit DCF snapshot. Same blocker — and SN reports one
//                          segment, so even with a model the per-segment grid would not apply
//                          as written.
//
// The two blocked panes are NOT shipped as empty placeholders. The blueprint calls that out by
// name (AMZN shipped M&A and Other Analysis as placeholders for months); sub-tabs are earned.
// The absence is stated once, in the section lede, where a reader will actually see it.

import { snResults } from '../results-data/sn.js';

export var SN_VAL_LEDE = 'Valuation ships the two panes SharkNinja has the data for. <b>Target Multiple / PEG</b> and <b>Sensitivity Analysis</b> are not here, and not as placeholders: both are hand-transcribed from Summit DCF snapshots, and <b>there is no Summit DCF model for SN</b> — so there is nothing to transcribe, and per <code>PANE_CATALOG.md</code> §4 neither ever comes free from the Results dataset. <b>Historic Multiple</b> ships partially, for a reason worth reading below.';

// ── Historic Multiple ────────────────────────────────────────────────────────────────────────
export var SN_VAL_HIST_BLOCKED = {
  title: 'The multiple HISTORY is unavailable — deliberately degraded, not broken',
  body: 'Drawing P/E or EV/EBITDA through time needs two inputs SN does not have:<br><br>' +
    '<b>1 · Daily price and quarterly shares / net debt.</b> These come from the <code>get-market-history</code> Supabase edge function, which <b>is not deployed</b> — and deploying it is San or Oscar\'s call, not something this profile can route around. The catalog is explicit that the right behaviour here is an honest unavailable state rather than a chart fed on something else.<br>' +
    '<b>2 · Consensus EPS / EBITDA per fiscal year, with revision dates.</b> That is <code>estMatrix.cons</code>, generated from <code>BBG_CONSENSUS.txt</code> — and SN is not one of the eight tickers in that archive. See <code>scripts/consensus/map_sn.json</code>.<br><br>' +
    'Both are the same blockers the Estimates pane names, which is why the two fill together. What <i>is</i> computable today is the <b>current</b> point on that series: a live quote against the Street strip already in the Results dataset. That is what this pane shows.',
};

// The multiple grid. Every estimate below is Bloomberg Street consensus already carried in
// js/results-data/sn.js — read through, never re-typed.
export var SN_VAL_YEARS = ['2025', '2026', '2027', '2028'];

export function valRow(key){
  var m = snResults.views.y.metrics[key];
  if (!m) return {};
  var out = {};
  SN_VAL_YEARS.forEach(function(y){
    var i = m.periods.indexOf(y);
    if (i < 0) return;
    var a = (m.act && m.act[i] != null) ? m.act[i] : null;
    var c = (m.cons && m.cons[i] != null) ? m.cons[i] : null;
    out[y] = { v: a != null ? a : c, est: a == null };
  });
  return out;
}

// Fallbacks used only if the live quote fails, so the grid degrades to a dated snapshot rather
// than to dashes. Both are the company's own disclosures, not estimates.
export var SN_VAL_FALLBACK = {
  shares: 142.5,      // M — FY2026 guided diluted weighted-average, Q2 2026 release
  netDebt: -61,       // $M — NET CASH at Jun 30, 2026, per the investor deck's capital structure
  note: 'Live quote unavailable, so enterprise value is built from the company\'s own disclosures instead: ~142.5M guided diluted shares (FY2026 outlook) and net CASH of $61M at Jun 30, 2026. Price is then the only missing input and the grid shows dashes for anything that needs it.',
};

export var SN_VAL_HIST_READ = 'Two things to hold while reading the grid. First, the Street models <b>FY2026 adjusted EPS of $6.59</b> — <i>above</i> the company\'s own guided range of $6.45–6.55, so the Street is carrying either more of the tariff refund than management is guiding to, or more operating upside. Second, the multiple compresses fast across the strip because the Street models earnings compounding into FY2029; a forward multiple three years out is an arithmetic statement about those estimates, not a valuation.';

export var SN_VAL_HIST_SOURCES = 'Estimates: Bloomberg (BST) FA_SN company-financials export, Sep 2026 snapshot, read through from js/results-data/sn.js. FY2025 is reported actual. Live price, shares, market cap and net debt: the portal\'s own quote path (js/api.js liveQuote), resolved in the browser — so the multiples move with the tape and are not a stored number.';

// ── Peers ────────────────────────────────────────────────────────────────────────────────────
// §4 specifies an inline-SVG scatter plus an equivalent table open by default. SN's scatter is
// already in the OVERVIEW — OVERVIEW_CONVENTIONS §4.6 requires a competitor scatter there, with
// the same five peers and the same add-by-ticker contract. A second copy of five dots would be
// duplication, not a second view, so this pane carries the half the Overview does NOT have: the
// full table, the toggles, and the reasoning about who is and is not comparable.
export var SN_VAL_PEERS_DIVERGENCE = 'The <b>scatter</b> for these peers lives in the Overview, where <code>OVERVIEW_CONVENTIONS.md</code> §4.6 requires it, with the same five names and the same add-by-ticker contract. §4 specifies a scatter here too — but a second plot of the same five dots is duplication rather than a second view. This pane carries what the Overview does not: the full table behind those dots, and the argument about comparability.';

export var SN_VAL_PEERS_READ = 'The peer set is the honest problem with valuing SharkNinja. It is usually bucketed with <b>small-appliance and housewares</b> names — Helen of Troy, Newell, Whirlpool — which trade at single-digit to low-teens multiples on flat-to-negative revenue growth. SN is growing net sales <b>+15.7%</b> with every margin line expanding, which is not that business. The closest structural comparables are not in the table at all: <b>Roborock</b> (Shanghai STAR 688169) and <b>De\'Longhi</b> (Borsa Italiana DLG) are direct category rivals on other exchanges, and <b>Dyson, Bissell, Conair and Vitamix</b> are private. <b>iRobot</b> — the obvious robot-vacuum comp — is delisted and in Chapter 11, which is itself a data point about the category rather than a multiple.';

export var SN_VAL_PEERS_CAVEAT = 'Multiples and growth in the table are <b>hand-seeded and dated (Sep 2026)</b>, never live — the same rule the Overview scatter carries. Only market cap resolves live. A peer added by ticker shows a live market cap and em-dashes for everything else until someone seeds it.';

export var SN_VAL_SOURCES = 'Sources: js/results-data/sn.js (Bloomberg FA_SN export, Sep 2026) for the Street strip; the Q2 2026 release and the August 2026 investor presentation for guided shares and the Jun-30-2026 capital structure; js/api.js liveQuote for price and market cap. Peer multiples are hand-seeded approximations dated Sep 2026 and are labelled as such wherever they appear.';
