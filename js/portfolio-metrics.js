// Portfolio Metrics tab — work in progress. Two sub-tabs:
//   • Portfolio — the fixed 14-name book, split into Passive and Single Stock.
//                 Metric values (EBITDA / Earnings / CFO / FCF) come live from
//                 the Summit DCF model (js/portfolio-metrics-summit.js) for the
//                 9 covered names; growth computes from them. A year selector
//                 (NTM · current · +1 · +2) picks the right-hand period; the
//                 column before it is the prior period (NTM↔LTM are calendar
//                 blends). Price / Market Cap / Net Debt / EV are live from
//                 Massive (api.liveQuote). The forward multiple is computed live
//                 for USD Summit names — EV/EBITDA = EV ÷ EBITDA, the rest =
//                 Market Cap ÷ metric; SPOT/TBBB (EUR/MXN) keep a hand-typed
//                 multiple to avoid mixing currencies. PEG = multiple ÷ growth.
//                 Names Summit doesn't cover (GOOGL, TSMC, ETFs) show the live
//                 quote columns only. Below the book, a separate Benchmark card
//                 carries SPY on the same columns — live price / market cap, with
//                 its multiple and metric values hand-typed (Summit doesn't model
//                 the index); Net Debt / EV are dashed, a fund has no balance sheet.
//   • Paper     — same structure, rows added manually (+ Add), weight % typed.
// Manual entries persist in localStorage.
import { SUMMIT_FUND } from './portfolio-metrics-summit.js';
import { CONSENSUS_FUND } from './portfolio-metrics-consensus.js';
import { PRICES } from './portfolio-metrics-prices.js';
import { PRICES_WEEKLY } from './portfolio-metrics-prices-weekly.js';
import { INVESTORS } from './portal-data.js';
import { liveQuote } from './api.js';

// ── Portfolio subtab: the fixed book ─────────────────────────────────────────
const PORTFOLIO = {
  passive: [
    { ticker: 'QQQ', label: 'QQQ' },
    { ticker: 'XLG', label: 'XLG' },
    { ticker: 'SMH', label: 'SMH' },
  ],
  single: [
    { ticker: 'UBER',  label: 'Uber' },
    { ticker: 'AMZN',  label: 'Amzn' },
    { ticker: 'META',  label: 'Meta' },
    { ticker: 'LYFT',  label: 'Lyft' },
    { ticker: 'TBBB',  label: 'TBBB' },
    { ticker: 'SOFI',  label: 'Sofi' },
    { ticker: 'SPOT',  label: 'Spot' },
    { ticker: 'GOOGL', label: 'Googl' },
    { ticker: 'NVDA',  label: 'Nvda' },
    { ticker: 'TSMC',  label: 'Tsmc' },
    { ticker: 'MA',    label: 'MA' },
  ],
};

// Benchmark shown in its own card below the book. Not a holding — no weight, and
// no Net Debt / EV (a fund has no balance sheet of its own). Summit doesn't model
// the index, so its multiple and metric values are hand-typed, like GOOGL/TSMC.
const BENCHMARK = { ticker: 'SPY', label: 'SPY', name: 'S&amp;P 500', fund: true };

const DASH = '<td class="num muted">&mdash;</td>';

// Metric config. `mult` is the header label for the forward multiple column.
const METRICS = {
  ebitda:   { label: 'EBITDA',   mult: 'EV/EBITDA fwd' },
  earnings: { label: 'Earnings', mult: 'P/E fwd' },
  cfo:      { label: 'CFO',      mult: 'P/CFO fwd' },
  fcf:      { label: 'FCF',      mult: 'P/FCF fwd' },
};
// Period options for the growth window (From → To): last actual (FY−1) through the
// third forward year, plus NTM (disabled until it has a real feed). The two chosen
// periods are the two value columns shown, the growth endpoints, and the year the
// forward multiple prices off (the "To" end).
const CY = new Date().getFullYear();
// The forward multiple prices off one period: NTM (disabled until it has a real
// feed), FY0, FY+1, FY+2.
const MULT_PERIODS = ['NTM', String(CY), String(CY + 1), String(CY + 2)];
// Growth has three fixed windows. FY0→FY2 spans two years and is annualized (CAGR).
const GROWTH_OPTS = {
  'fy0-fy1': { from: String(CY),     to: String(CY + 1), label: 'FY0 → FY+1' },
  'fy0-fy2': { from: String(CY),     to: String(CY + 2), label: 'FY0 → FY+2 (anualizado)' },
  'fy1-fy2': { from: String(CY + 1), to: String(CY + 2), label: 'FY+1 → FY+2' },
};
// Massive symbol overrides for the live quote (label ticker → quote ticker).
const QUOTE_TICKER = { TSMC: 'TSM' };

let metricSel = 'earnings';           // active metric — always one, never off. Defaults to
                                      // P/E so the tab opens on Market Cap only; EBITDA (EV/EBITDA)
                                      // is the one metric that also shows Net Debt + EV.
let earnBasis = 'earnings';           // 'earnings' | 'eps' — only read when metricSel === 'earnings'
let source = 'summit';                // 'summit' | 'consensus' — which estimate set feeds the table
let multSel = String(CY + 1);         // period the forward multiple prices off (default FY+1)
let growthSel = 'fy0-fy1';            // active growth window key (see GROWTH_OPTS)
const quotes = {};                    // ticker → { price, marketCap, ev, netDebt } | null (flows in millions)

// The fixed per-name beta default: the market standard, 5 years monthly. There is
// no global control for it — methodology is chosen per name (see betaOverrides /
// betaMethod); a name with no override simply computes at this default.
// Monthly (portfolio-metrics-prices.js) and weekly (…-weekly.js) histories are
// imported eagerly; the larger daily history (…-daily.js) is loaded on demand the
// first time any name is switched to Daily, so it never weighs on initial load.
const betaFreq = 'monthly';           // 'daily' | 'weekly' | 'monthly'
const betaAmt = 5;                    // lookback amount
const betaUnit = 'y';                 // 'm' (months) | 'y' (years)
let PRICES_DAILY = null;              // filled by ensureDaily() on first Daily use
let dailyState = 'idle';              // 'idle' | 'loading' | 'ready' | 'error'

// Correlation matrix parameters. Unlike beta, correlation is pairwise, so the
// whole matrix must share one frequency + window (can't be per name). Default is
// the same market standard, 5 years monthly.
let corrFreq = 'monthly';             // 'daily' | 'weekly' | 'monthly'
let corrAmt = 5;
let corrUnit = 'y';                   // 'm' | 'y'
let corrSub = 'bench';                // active Correlations subtab ('bench' | 'matrix')

// Columns are labelled by position relative to the current calendar year — FY 0,
// FY+1, FY+2 — with the calendar year itself underneath in small type. The
// relative label is what keeps the table readable once names sit on different
// fiscal calendars: a column means a slice of time, not a number off one filing.
const relLabel = (y) => {
  const d = Number(y) - CY;
  return d === 0 ? 'FY 0' : `FY${d > 0 ? '+' : '−'}${Math.abs(d)}`;
};
const isRel = (k) => k !== 'NTM' && k !== 'LTM';
// Heading for one period: relative label over its calendar year.
const periodHead = (k) => isRel(k) ? `${relLabel(k)}<span class="pm-cy">${k}</span>` : k;

// The two value columns are the growth window's endpoints (From → To). Growth runs
// between them; the multiple prices off its own period (multSel), set separately.
const growthWin = () => GROWTH_OPTS[growthSel] || GROWTH_OPTS['fy0-fy1'];
function periodInfo() {
  const g = growthWin();
  return {
    prevKey: g.from, prevLabel: relLabel(g.from),
    currKey: g.to,   currLabel: relLabel(g.to),
  };
}
// Span of the growth window in years; > 1 (i.e. FY0→FY2) means growth is annualized.
const growthSpan = () => { const g = growthWin(); return Number(g.to) - Number(g.from); };

// ── State (manual entries, for names Summit doesn't cover + manual multiples) ─
const METRIC_KEY = 'pm-metric-v2';
const PAPER_KEY  = 'pm-paper-v1';
const PWEIGHT_KEY = 'pm-port-weights-v1';
const BETA_METHOD_KEY = 'pm-beta-methods-v1';
const CORR_SLOTS_KEY = 'pm-corr-slots-v1';
const CORR_MNAMES_KEY = 'pm-corr-matrix-names-v1';
const PAPER_SRC_KEY = 'pm-paper-source-v1';
const SUBMITS_KEY = 'pm-submits-v1';
const QUOTE_COLS_KEY = 'pm-show-quote-v1';
const BOOK_EXTRA_KEY = 'pm-book-extra-v1';
// Collapsed state of the Summit book: when true the holding rows are hidden and only
// the weighted-average summary shows under the portfolio name. Persists per browser.
const BOOK_COLLAPSE_KEY = 'pm-book-collapsed-v1';

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); }
  catch (e) { /* ignore corrupt storage */ }
  return fallback;
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
}

let metricData = loadJSON(METRIC_KEY, {});
// Book weights, ticker → typed percent. The fixed book has no weights of its own,
// and without them there is nothing for the footer average to weight by.
let portWeights = loadJSON(PWEIGHT_KEY, {});
// Tickers the user added to the book with + Add — each { ticker, weight }. The seeded
// names live in BOOK_SEED; these are appended after them in one flat list.
let bookExtra = (() => { const a = loadJSON(BOOK_EXTRA_KEY, []); return Array.isArray(a) ? a : []; })();
const saveBookExtra = () => saveJSON(BOOK_EXTRA_KEY, bookExtra);
let paper = (() => { const p = loadJSON(PAPER_KEY, {}); return { passive: p.passive || [], single: p.single || [] }; })();
// User-built portfolios, each a segment under Summit: { id, name, collapsed, holdings:
// [{ ticker, weight }] }. Created blank or prefilled from a predefined source (the
// same books the Paper prefill offers). Persist per browser.
const PORTFOLIOS_KEY = 'pm-portfolios-v1';
let portfolios = (() => { const a = loadJSON(PORTFOLIOS_KEY, []); return Array.isArray(a) ? a : []; })();
const savePortfolios = () => saveJSON(PORTFOLIOS_KEY, portfolios);
let newPfOpen = false;   // is the "+ New portfolio" source chooser expanded?
// Per-name beta method overrides, ticker → { freq, amt, unit }. Names without one
// use the global default (betaFreq/betaAmt/betaUnit) — see betaMethod().
let betaOverrides = loadJSON(BETA_METHOD_KEY, {});
let betaOpen = null;   // ticker whose inline method strip is expanded (accordion)
// Summit book collapsed? (holdings hidden, only the weighted-average row shown)
let bookCollapsed = loadJSON(BOOK_COLLAPSE_KEY, false);
// Show/hide the Price + Market Cap columns together. They're mostly visual noise
// next to the multiples, so they default to hidden and the choice persists. Net
// Debt + EV stay governed separately by the metric (showEvCols → EBITDA only).
// One toggle for the optional columns: Price, Market Cap and the two metric value
// columns (e.g. Earnings FY0 / FY+1). Defaults to shown so the values are visible on
// load; hiding them leaves a compact multiple / growth / PEG / Beta view.
let showQuote = loadJSON(QUOTE_COLS_KEY, true);
// Extra instruments (4 editable columns) the Benchmarks subtab correlates against,
// to the right of the fixed SPY column. Empty slots render an empty input header.
let corrSlots = (() => {
  const s = loadJSON(CORR_SLOTS_KEY, ['', '', '', '']);
  const a = Array.isArray(s) ? s.slice(0, 4) : [];
  while (a.length < 4) a.push('');
  return a;
})();
// Names in the Paper correlation matrix (Paper subtab only). null = mirror the
// Paper book live; once the user adds/removes a name it becomes a fixed own list.
let corrMatrixNames = loadJSON(CORR_MNAMES_KEY, null);
// The prefill source currently loaded into the Paper book (label shown in the bar).
let paperSource = loadJSON(PAPER_SRC_KEY, null);
// Submitted portfolio snapshots that show up in Comparison. Each: {id,label,passive,single}.
let submits = (() => { const s = loadJSON(SUBMITS_KEY, []); return Array.isArray(s) ? s : []; })();
let cmpView = 'summary';   // Comparison view: 'summary' (portfolio-level) | 'detail' (per holding)

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');

// Millions → compact string (company-currency, no symbol).
function fmtMM(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  return v.toLocaleString('en-US', { maximumFractionDigits: Math.abs(v) >= 100 ? 0 : 1 });
}
// Multiples → one decimal with the unit, e.g. 8.8x.
function fmtMult(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  return v.toFixed(1) + 'x';
}
// Per-share values (EPS) → two decimals, in the company's reporting currency.
function fmtPS(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  return v.toFixed(2);
}
// USD millions → -$X.XB / $XM.
function fmtUSDmm(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '&mdash;';
  const a = Math.abs(v), sign = v < 0 ? '-' : '';
  return a >= 1000
    ? sign + '$' + (a / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'B'
    : sign + '$' + a.toLocaleString('en-US', { maximumFractionDigits: 0 }) + 'M';
}

// ── Summit value access (with NTM/LTM calendar blending) ─────────────────────
// The two estimate sets are read through the same accessors — everything below
// this line is source-agnostic.
const SOURCES = {
  summit:    { label: 'Summit',    fund: SUMMIT_FUND,    note: 'Summit DCF model' },
  consensus: { label: 'Consensus', fund: CONSENSUS_FUND, note: 'street consensus (Bloomberg, via the Summit model)' },
};
const fundOf = (t) => SOURCES[source].fund[t];

// Covered means the ACTIVE source actually carries the metric on offer for this
// name. Consensus has no CFO/FCF, so under it those two behave like a name the
// model doesn't follow: hand-typed, not a column of dashes.
// True when the active source supplies this metric as a DERIVED figure rather than
// a sourced one (consensus CFO/FCF). Those cells get marked in the table — they
// answer a different question than the numbers around them.
function isDerived(t) {
  const rec = fundOf(t);
  return !!(rec && rec.derived && metricSel && rec.derived.includes(metricSel));
}

function isCovered(t) {
  const rec = fundOf(t);
  if (!rec) return false;
  if (!metricSel) return true;
  return Object.values(rec.years).some(y => y[metricSel] != null);
}
// Earnings reads two ways: the absolute figure, or per share. The basis drives
// what the value columns show and what growth computes from. The multiple (P/E)
// is the same number either way — Market Cap ÷ Earnings = Price ÷ EPS — so it is
// deliberately left on the absolute figure and doesn't move with the toggle.
const isEps = () => metricSel === 'earnings' && earnBasis === 'eps';
// CFO and FCF are grouped under one "Cash" metric button; which of the two is live
// is picked in the Basis sub-toggle. This says we're on either of them.
const isCashMetric = () => metricSel === 'cfo' || metricSel === 'fcf';
const metricLabel = () => (isEps() ? 'EPS' : METRICS[metricSel].label);
// Hand-typed values are keyed by basis — EPS and absolute earnings are different
// units and must not share a slot. The multiple stays keyed by the metric itself.
// Hand-typed entries are also separated by source: a name in neither model (GOOGL,
// TSMC, the ETFs) deserves a different number under Summit than under the street.
// Summit keeps the bare key so values saved before the toggle existed still load.
const srcKey = (k) => (source === 'summit' ? k : `${source}:${k}`);
const valueKey = () => srcKey(isEps() ? 'eps' : metricSel);
const multKey  = () => srcKey(metricSel);
const multRec  = (t) => (metricData[t] && metricData[t][multKey()]) || {};
const valueRec = (t) => (metricData[t] && metricData[t][valueKey()]) || {};

// Diluted share count for a period, from the active source. A per-year count wins
// where one exists — consensus carries them (and they blend across NTM/LTM like
// any other series), which is what makes EPS growth diverge from Earnings growth
// there. Summit's own count is flat across the forecast, so it falls back to the
// single record-level number and the two growths stay equal under Summit.
function sharesFor(t, periodKey) {
  const rec = fundOf(t);
  if (!rec) return null;
  const perYear = num(modelVal(t, 'shares', periodKey));
  return perYear !== null ? perYear : num(rec.shares);
}

function fracElapsed() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  return (now - start) / (end - start);
}
function blend(a, b, key, wa, wb) {
  if (!a || !b) return null;
  const va = a[key], vb = b[key];
  if (va === null || va === undefined || vb === null || vb === undefined) return null;
  return wa * va + wb * vb;
}
// Every period key in this tab is a CALENDAR year. A company whose fiscal year
// doesn't close in December declares an fyOffset (NVIDIA: +1, its FY2028 covers
// Feb 2027 → Jan 2028 ≈ CY2027), and that is the only place the translation
// happens — so a column always holds the same slice of real time for every name.
const fiscalKey = (rec, calYear) => String(Number(calYear) + (rec.fyOffset || 0));
// The fiscal year a name reports for a calendar year, when the two differ.
function fiscalLabel(t, calYear) {
  const rec = fundOf(t);
  if (!rec || !rec.fyOffset || calYear === 'NTM' || calYear === 'LTM') return null;
  return `FY${fiscalKey(rec, calYear)}`;
}

function modelVal(t, key, periodKey) {
  const rec = fundOf(t);
  if (!rec) return undefined;
  const yr = (c) => rec.years[fiscalKey(rec, c)];
  if (periodKey === 'NTM') { const f = fracElapsed(); return blend(yr(CY), yr(CY + 1), key, 1 - f, f); }
  if (periodKey === 'LTM') { const f = fracElapsed(); return blend(yr(CY - 1), yr(CY), key, 1 - f, f); }
  const y = yr(periodKey);
  return y ? y[key] : undefined;
}

// Metric value: Summit for covered names, manual entry otherwise.
function valueFor(t, periodKey) {
  if (isCovered(t)) {
    const v = num(modelVal(t, metricSel, periodKey));
    if (!isEps()) return v;
    const sh = sharesFor(t, periodKey);
    return (v === null || sh === null || sh === 0) ? null : v / sh;
  }
  return num((valueRec(t).byYear || {})[periodKey]);
}
const priceOf     = (t) => (quotes[t] ? quotes[t].price : null);
const marketCapOf = (t) => (quotes[t] ? quotes[t].marketCap : null);
const evOf        = (t) => (quotes[t] ? quotes[t].ev : null);
const netDebtOf   = (t) => (quotes[t] ? quotes[t].netDebt : null);

// Live forward multiple for USD Summit names: EV/EBITDA = EV ÷ EBITDA, the rest
// = Market Cap ÷ metric, priced off the chosen multiple period (multSel — independent
// of the growth window). SPOT/TBBB are skipped (metric in EUR/MXN vs USD quote).
function autoMultFor(t) {
  if (!metricSel) return null;
  const rec = fundOf(t);
  if (!rec || rec.currency !== 'USD') return null;
  const mv = num(modelVal(t, metricSel, multSel));
  if (mv === null || mv <= 0) return null;
  const numer = metricSel === 'ebitda' ? evOf(t) : marketCapOf(t);
  if (numer === null) return null;
  return numer / mv;
}
function multFor(t) {
  const a = autoMultFor(t);
  return a !== null ? a : num(multRec(t).mult);
}
// Growth over the chosen window. One year → simple period-over-period change. More
// than one → annualized (CAGR), which only reads cleanly when both ends are positive
// (a sign change can't be annualized, so it returns null rather than a bogus rate).
function growthFor(t) {
  const p = periodInfo();
  const a = valueFor(t, p.prevKey), b = valueFor(t, p.currKey);
  if (a === null || b === null || a === 0) return null;
  const n = Number(p.currKey) - Number(p.prevKey);
  if (!Number.isFinite(n) || n <= 0) return null;        // To must be after From
  if (n === 1) return ((b - a) / Math.abs(a)) * 100;
  if (a <= 0 || b <= 0) return null;                     // can't annualize across a sign change
  return (Math.pow(b / a, 1 / n) - 1) * 100;
}
function pegFor(t, g) {
  const m = multFor(t);
  if (m === null || g === null || g === 0) return null;
  return m / g;
}

// ── Weighted aggregates ──────────────────────────────────────────────────────
// Weights are typed percentages and always total 100 — whatever the rows don't
// claim is assumed to be cash.
//
// The multiple aggregates HARMONICALLY: sum each holding's earnings yield (its
// weight ÷ its multiple), then invert. An arithmetic average of multiples
// overweights the expensive names — a 60x name pulls the mean far past what its
// economic weight justifies — and only the harmonic figure corresponds to the
// EBITDA (or earnings) the book actually owns. It's what S&P and MSCI publish as
// an index P/E.
//
// Cash carries a yield of zero, so it RAISES the portfolio multiple rather than
// cheapening it: you hold the price without the earnings. It grows at zero too.
//
// A name with a weight but no multiple is neither priced nor cash, so it can't sit
// on either side of the ratio — it drops out of both, and the leftover shows up as
// uncovered weight so the aggregate is never read as covering more than it does.
function weightedStats(items) {
  let wTyped = 0, wMult = 0, invYield = 0, wG = 0, gSum = 0;
  items.forEach(it => {
    const w = num(it.weight);
    if (w === null || w <= 0) return;
    wTyped += w;
    const m = multFor(it.ticker);
    if (m !== null && m > 0) { wMult += w; invYield += w / m; }
    const g = growthFor(it.ticker);
    if (g !== null) { wG += w; gSum += w * g; }
  });
  const cash = 100 - wTyped;              // negative = weights overshoot 100
  const c = Math.max(0, cash);
  return {
    wTyped, cash,
    mult:   invYield > 0 ? (wMult + c) / invYield : null,
    growth: (wG + c) > 0 ? gSum / (wG + c) : null,
    get peg() {
      return (this.mult !== null && this.growth !== null && this.growth !== 0)
        ? this.mult / this.growth : null;
    },
    uncoveredMult: Math.max(0, wTyped - wMult),
    uncoveredG:    Math.max(0, wTyped - wG),
  };
}

// The Summit book as one flat list: the seeded names first, then any added via + Add.
const BOOK_SEED = [...PORTFOLIO.passive, ...PORTFOLIO.single];
const portItems = () => [
  ...BOOK_SEED.map(x => ({ ticker: x.ticker, weight: portWeights[x.ticker] })),
  ...bookExtra.map(x => ({ ticker: paperTicker(x), weight: x.weight })),
];
const paperItems = () => [...paper.passive, ...paper.single]
  .map(x => ({ ticker: paperTicker(x), weight: x.weight }));
// Book names that actually carry weight — the Correlation tab only looks at these.
const weightedBook = () => portItems().filter((it) => { const w = num(it.weight); return w != null && w > 0; });

// Weighted-average market cap: Σ(w·mc) / Σw over names that carry a market cap —
// the average size of a position in the book, by weight.
function wavgMarketCap(items) {
  let wSum = 0, mcSum = 0;
  items.forEach((it) => {
    const w = num(it.weight);
    if (w === null || w <= 0) return;
    const mc = marketCapOf(it.ticker);
    if (mc === null) return;
    wSum += w; mcSum += w * mc;
  });
  return wSum > 0 ? mcSum / wSum : null;
}

// The on-screen quote columns for the weighted-average row. Market Cap shows the
// weighted average; Price and Net Debt / EV carry no meaningful average, so dash.
function wavgQuoteCells(items) {
  let out = '';
  if (showQuote) {
    out += DASH;
    const wmc = wavgMarketCap(items);
    out += `<td class="num pm-sv">${wmc != null ? fmtUSDmm(wmc) : '&mdash;'}</td>`;
  }
  if (showEvCols()) out += DASH + DASH;
  return out;
}

// Cash line + weighted-average line, sized to whichever table asks for them.
// The weighted-average cells — everything to the right of the first (label/name)
// column: Weight, the quote columns, multiple, the two value pads, growth, PEG and
// Beta. Shared by the footer (Paper) and the Summit summary row so the two can
// never drift apart.
function wavgCells(s, pb, items) {
  const pad = (n) => DASH.repeat(n);
  const over = s.cash < 0;
  const note = (label, uncovered) => uncovered > 0.05
    ? ` title="${esc(`${(100 - uncovered).toFixed(1)}% of the book priced; ${uncovered.toFixed(1)}% carries a weight but no ${label}, and is excluded.`)}"`
    : '';
  const gCls = s.growth === null ? '' : (s.growth >= 0 ? 'up' : 'dn');
  return `
      <td class="num">${(over ? s.wTyped : 100).toFixed(1)}%</td>
      ${wavgQuoteCells(items)}
      <td class="msep pm-sv"${note('multiple', s.uncoveredMult)}>${s.mult === null ? '&mdash;' : fmtMult(s.mult)}</td>
      ${showQuote ? pad(2) : ''}
      <td class="pm-growth ${gCls}"${note('growth', s.uncoveredG)}>${s.growth === null ? '&mdash;' : s.growth.toFixed(1) + '%'}</td>
      <td class="pm-peg">${s.peg === null ? '&mdash;' : s.peg.toFixed(2)}</td>
      <td class="num pm-beta" title="β del portafolio = promedio ponderado por peso de las betas; el cash cuenta como β 0 y los nombres sin historial suficiente se excluyen (no cuentan como 0).">${pb.beta != null ? pb.beta.toFixed(2) : '&mdash;'}</td>`;
}

// The Cash residual row (100% − typed weights; negative when weights overshoot).
function cashRow(s, q, tail) {
  const pad = (n) => DASH.repeat(n);
  const over = s.cash < 0;
  const cashTd = over
    ? `<td class="num neg" title="Typed weights add to ${s.wTyped.toFixed(1)}% — over 100%. The average treats cash as 0%.">${s.cash.toFixed(1)}%</td>`
    : `<td class="num">${s.cash.toFixed(1)}%</td>`;
  return `<tr class="pm-cash"><td class="tk">Cash</td>${cashTd}${pad(q)}${pad(metricCols())}${tail}</tr>`;
}

// Cash + Weighted-avg as a <tfoot> pair — used by Paper (the Summit book renders its
// weighted-avg at the top instead; see bookSummaryRow).
function footRows(items, extra) {
  const s = weightedStats(items);
  const pb = portBeta(items);     // weight-weighted portfolio β (cash counts as β 0)
  const q = quoteCount();         // live-quote columns in play (Price/MC and/or Net Debt/EV)
  const tail = extra ? '<td class="pm-actions"></td>' : '';
  return cashRow(s, q, tail)
    + `<tr class="pm-wavg"><td class="tk">Weighted avg</td>${wavgCells(s, pb, items)}${tail}</tr>`;
}

// ── Portfolio rendering ──────────────────────────────────────────────────────
// Net Debt + EV only matter when the multiple runs off enterprise value — i.e.
// EV/EBITDA. Every other metric (Earnings, CFO, FCF) prices off Market Cap, so
// those two columns are hidden and only Market Cap is shown. One switch drives the
// header, the body cells, the column span and the footer padding together.
const showEvCols = () => metricSel === 'ebitda';
// How many live-quote columns are on screen: Price + Market Cap (the showQuote
// toggle) and/or Net Debt + EV (EBITDA only). Header, body, span and footer all
// read this so they can never drift out of alignment.
const quoteCount = () => (showQuote ? 2 : 0) + (showEvCols() ? 2 : 0);

// Live quote columns: Price + Market Cap when showQuote is on; Net Debt + EV only
// under EBITDA. A fund has no balance sheet of its own, so Net Debt / EV are dashed
// for it rather than derived from an enterprise value that doesn't apply.
function quoteCells(t, fund) {
  let out = '';
  if (showQuote) {
    const price = priceOf(t);
    out += `<td class="num">${price != null ? '$' + price.toFixed(2) : '&mdash;'}</td>`;
    out += `<td class="num pm-sv">${fmtUSDmm(marketCapOf(t))}</td>`;
  }
  if (showEvCols()) {
    out += fund ? DASH + DASH
      : `<td class="num pm-sv">${fmtUSDmm(netDebtOf(t))}</td><td class="num pm-sv">${fmtUSDmm(evOf(t))}</td>`;
  }
  return out;
}

// Book weights are typed and saved locally, the same way Paper's are. The
// benchmark isn't a holding, so it keeps a dash.
function weightCell(item) {
  if (item.fund) return DASH;
  return `<td><input class="pm-inp pm-wt" data-field="weight" value="${esc(portWeights[item.ticker])}" placeholder="0.0"> <span class="muted">%</span></td>`;
}
function baseCells(item) { return weightCell(item) + quoteCells(item.ticker, item.fund); }

function metricCells(ticker) {
  if (!metricSel) return '';
  const p = periodInfo();
  const covered = isCovered(ticker);
  const g = growthFor(ticker);
  const peg = pegFor(ticker, g);
  const gCls = g === null ? '' : (g >= 0 ? 'up' : 'dn');

  const auto = autoMultFor(ticker);
  // Typed multiples keep the input numeric and carry the unit beside it, the way
  // the Paper weight field carries its %.
  const multTd = auto !== null
    ? `<td class="msep pm-sv">${fmtMult(auto)}</td>`
    : `<td class="msep"><input class="pm-minp" data-field="mult" value="${esc(multRec(ticker).mult)}" placeholder="—"> <span class="muted">x</span></td>`;

  const fmtVal = isEps() ? fmtPS : fmtMM;
  let prevTd, currTd;
  if (covered) {
    const cls = isDerived(ticker) ? 'pm-sv pm-derived' : 'pm-sv';
    const why = isDerived(ticker)
      ? `Derived, not consensus: street EBITDA × this company's Summit ${METRICS[metricSel].label}/EBITDA rate for the year.`
      : '';
    // On an off-calendar name, name the fiscal year the cell actually came from —
    // the column says CY2027, the number is NVIDIA's FY2028.
    const cell = (k) => {
      const fy = fiscalLabel(ticker, k);
      const bits = [fy ? `${ticker} ${fy}, the fiscal year covering calendar ${k}.` : '', why]
        .filter(Boolean).join(' ');
      const tip = bits ? ` title="${esc(bits)}"` : '';
      const c = fy ? `${cls} pm-offcal` : cls;
      return `<td class="${c}"${tip}>${fmtVal(valueFor(ticker, k))}</td>`;
    };
    prevTd = cell(p.prevKey);
    currTd = cell(p.currKey);
  } else {
    const by = valueRec(ticker).byYear || {};
    prevTd = `<td><input class="pm-minp" data-period="${p.prevKey}" value="${esc(by[p.prevKey])}" placeholder="—"></td>`;
    currTd = `<td><input class="pm-minp" data-period="${p.currKey}" value="${esc(by[p.currKey])}" placeholder="—"></td>`;
  }
  return `
    ${multTd}
    ${showQuote ? prevTd + currTd : ''}
    <td class="pm-growth ${gCls}">${g === null ? '&mdash;' : g.toFixed(1) + '%'}</td>
    <td class="pm-peg">${peg === null ? '&mdash;' : peg.toFixed(2)}</td>
    ${betaTd(ticker)}`;
}

// The Beta column cell: the name's β at its own method, clickable to open the
// detail modal (the formula, the rolling history, and the controls to change the
// method). Names with too little history dash; a daily method still loading its
// price file shows "···" until it arrives.
function betaTd(t) {
  const r = betaOf(t);
  const pending = r.method.freq === 'daily' && dailyState !== 'ready';
  if (r.beta == null) {
    return `<td class="num pm-beta muted"${pending ? ' title="Cargando historial diario…"' : ''}>${pending ? '&middot;&middot;&middot;' : '&mdash;'}</td>`;
  }
  return `<td class="num pm-beta pm-beta-cell ${r.beta >= 1 ? 'hi' : 'lo'}" data-bt="${esc(t)}" `
    + `title="β ${r.beta.toFixed(2)} · ${methodTag(r.method)} · n=${r.n} — clic para ver cómo se calcula">${r.beta.toFixed(2)}</td>`;
}

// A name whose fiscal year doesn't close in December gets a marker next to its
// ticker, so nobody has to hover a cell to notice the row is calendarised.
function fyBadge(t) {
  const rec = fundOf(t);
  if (!rec || !rec.fyOffset) return '';
  const off = rec.fyOffset > 0 ? `+${rec.fyOffset}` : String(rec.fyOffset);
  const tip = `Off-calendar fiscal year: this name's FY label runs ${off} vs the calendar year. `
    + `Each column shows the fiscal year that covers that calendar year, so the row lines up with the rest.`;
  return ` <span class="pm-fy" title="${esc(tip)}">FY${off}</span>`;
}

function portRow(item) {
  return `<tr data-ticker="${item.ticker}">
    <td class="tk">${labelOf(item.ticker)}${fyBadge(item.ticker)}</td>
    ${baseCells(item)}
    ${metricCells(item.ticker)}
    <td class="pm-actions"></td>
  </tr>`;
}

// A user-added book row: like a seeded row but with an editable ticker and a × to
// remove it, same mechanics as a Paper row (the ticker drives everything to its right).
function bookExtraRow(item, idx) {
  const t = paperTicker(item);
  const tkTd = `<td><input class="pm-inp pm-tk" data-field="ticker" value="${esc(item.ticker)}" placeholder="Ticker">${fyBadge(t)}</td>`;
  const wtTd = `<td><input class="pm-inp pm-wt" data-field="weight" value="${esc(item.weight)}" placeholder="0.0"> <span class="muted">%</span></td>`;
  const rest = t ? quoteCells(t) + metricCells(t) : DASH.repeat(colSpan() - 2);
  return `<tr data-group="book" data-idx="${idx}" data-ticker="${t}">
    ${tkTd}${wtTd}${rest}
    <td class="pm-actions"><button class="pm-del" title="Remove">&times;</button></td>
  </tr>`;
}

// Book body = seeded rows + added rows + the "+ Add" button. Repainted in place on
// add/remove so the rest of the PEG pane and the metric bar survive.
function bookBody() {
  const span = colSpan(1);
  return BOOK_SEED.map(portRow).join('') +
    bookExtra.map(bookExtraRow).join('') +
    `<tr><td colspan="${span}"><button class="pm-add" data-book-add>+ Add</button></td></tr>`;
}
function renderBookBody() {
  const body = document.getElementById('pm-book-body');
  if (body) body.innerHTML = bookBody();
}

// Summit book stats, computed once for the summary row and the cash row.
function bookStats() {
  const items = portItems();
  return { items, s: weightedStats(items), pb: portBeta(items), q: quoteCount() };
}

// The always-visible top row: the portfolio name (with the collapse toggle) on the
// left, then the book's weighted-average cells. Stays put whether or not the
// holdings are collapsed.
function bookSummaryRow() {
  const { items, s, pb } = bookStats();
  const toggle = `<button class="pm-seg-toggle" data-book-collapse aria-expanded="${!bookCollapsed}" title="${bookCollapsed ? 'Expand holdings' : 'Collapse to weighted average'}"><span class="pm-seg-caret">&#9662;</span><span class="pm-seg-name">Summit</span></button>`;
  return `<tr class="pm-wavg pm-seg-summary" id="pm-book-summary"><td class="tk pm-seg-name-cell">${toggle}</td>${wavgCells(s, pb, items)}<td class="pm-actions"></td></tr>`;
}

// The Summit <tfoot> now carries only the Cash residual — the weighted average moved
// to the top summary row.
function bookCashRow() {
  const { s, q } = bookStats();
  return cashRow(s, q, '<td class="pm-actions"></td>');
}

function renderBookSummary() {
  const el = document.getElementById('pm-book-summary');
  if (el) el.outerHTML = bookSummaryRow();
}
function refreshBookFoot() {
  const foot = document.getElementById('pm-book-foot');
  if (foot) foot.innerHTML = bookCashRow();
}

// ── User-built portfolios (segments under Summit) ────────────────────────────
// Each is its own editable book, rendered as a collapsible segment exactly like the
// Summit one: a top summary row (name + weighted average) and the holdings beneath.
const pfFind = (id) => portfolios.find((p) => p.id === id);
const pfItems = (p) => (p.holdings || []).map((h) => ({ ticker: paperTicker(h), weight: h.weight }));
const pfNewId = () => 'pf-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// An editable holding row inside a portfolio — ticker drives everything to its right.
function pfRow(pid, h, idx) {
  const t = paperTicker(h);
  const tkTd = `<td><input class="pm-inp pm-tk" data-field="ticker" value="${esc(h.ticker)}" placeholder="Ticker">${fyBadge(t)}</td>`;
  const wtTd = `<td><input class="pm-inp pm-wt" data-field="weight" value="${esc(h.weight)}" placeholder="0.0"> <span class="muted">%</span></td>`;
  const rest = t ? quoteCells(t) + metricCells(t) : DASH.repeat(colSpan() - 2);
  return `<tr data-pf="${pid}" data-idx="${idx}" data-ticker="${t}">
    ${tkTd}${wtTd}${rest}
    <td class="pm-actions"><button class="pm-del" title="Remove">&times;</button></td>
  </tr>`;
}

// The always-visible top row: collapse caret + editable name on the left, then the
// portfolio's weighted-average cells, and a × to delete the whole portfolio.
function pfSummaryRow(p, s, pb, items) {
  const caret = `<button class="pm-seg-toggle no-label" data-pf-collapse="${p.id}" aria-expanded="${!p.collapsed}" title="${p.collapsed ? 'Expand holdings' : 'Collapse to weighted average'}"><span class="pm-seg-caret">&#9662;</span></button>`;
  const name = `<input class="pm-seg-nameinp" data-pf-name="${p.id}" value="${esc(p.name)}" aria-label="portfolio name">`;
  return `<tr class="pm-wavg pm-seg-summary" id="pf-sum-${p.id}"><td class="tk pm-seg-name-cell">${caret}${name}</td>${wavgCells(s, pb, items)}<td class="pm-actions"><button class="pm-segdel" data-pf-del="${p.id}" title="Delete portfolio">&times;</button></td></tr>`;
}

function pfBody(p) {
  const span = colSpan(1);
  return (p.holdings || []).map((h, i) => pfRow(p.id, h, i)).join('') +
    `<tr><td colspan="${span}"><button class="pm-add" data-pf-add="${p.id}">+ Add</button></td></tr>`;
}

function portfolioSegment(p) {
  const items = pfItems(p);
  const s = weightedStats(items), pb = portBeta(items), q = quoteCount();
  return `
    <div class="card pm-seg${p.collapsed ? ' is-collapsed' : ''}" data-seg="pf">
      <table data-side="pf" data-pf="${p.id}">
        <thead>${headRow('<th></th>')}${pfSummaryRow(p, s, pb, items)}</thead>
        <tbody id="pf-body-${p.id}">${pfBody(p)}</tbody>
        <tfoot id="pf-foot-${p.id}">${cashRow(s, q, '<td class="pm-actions"></td>')}</tfoot>
      </table>
    </div>`;
}

const customPortfolios = () => portfolios.map(portfolioSegment).join('');

// The "+ New portfolio" control: a button that reveals a source chooser — start
// blank, or prefill from the predefined books (Summit, the team books, or a
// superinvestor). Picking a source creates the portfolio and closes the chooser.
function newPortfolioBar() {
  const invs = (INVESTORS || []).filter((x) => x.key !== 'summit' && x.holdings && x.holdings.length);
  const menu = !newPfOpen ? '' : `
    <div class="pm-newpf-menu">
      <span class="lbl">Start from</span>
      <button class="pm-pf" data-newpf="blank" title="Empezar con 0 posiciones">Blank</button>
      <button class="pm-pf" data-newpf="summit">Summit</button>
      ${Object.keys(TEAM_BOOKS).map((k) => `<button class="pm-pf" data-newpf="${esc(k)}">${esc(TEAM_BOOKS[k].label)}</button>`).join('')}
      <select class="pm-pf-sel" data-newpf-inv aria-label="Prefill from a superinvestor">
        <option value="">Superinvestor&hellip;</option>
        ${invs.map((x) => `<option value="${esc(x.key)}">${esc(x.name)}${x.fund ? ' · ' + esc(x.fund) : ''}</option>`).join('')}
      </select>
    </div>`;
  return `<div class="pm-newpf">
    ${menu}
    <button class="pm-newpf-btn${newPfOpen ? ' open' : ''}" data-newpf-toggle>+ New portfolio</button>
  </div>`;
}

// Resolve a chooser key to { name, holdings }. Mirrors the Paper prefill sources.
function pfSourceBook(key) {
  if (key === 'summit') { const b = summitBook(); return { name: 'Summit (copy)', holdings: [...b.passive, ...b.single] }; }
  if (TEAM_BOOKS[key])  { const b = teamBook(key); return { name: TEAM_BOOKS[key].label, holdings: [...b.passive, ...b.single] }; }
  if (key && key !== 'blank') { const b = investorBook(key); return { name: b.label, holdings: [...b.passive, ...b.single] }; }
  return { name: 'Portfolio ' + (portfolios.length + 1), holdings: [] };   // blank
}

function addPortfolio(key) {
  const src = pfSourceBook(key);
  portfolios.push({ id: pfNewId(), name: src.name, collapsed: false, holdings: pfRows(src.holdings) });
  savePortfolios();
  newPfOpen = false;
  renderPortfolio();          // repaint the Summit pane (which now includes this segment)
  pfItems({ holdings: src.holdings }).forEach((it) => it.ticker && ensureQuote(it.ticker));
  renderBeta(); renderBlended();
}

function renderPfBody(id) {
  const p = pfFind(id), el = document.getElementById('pf-body-' + id);
  if (p && el) el.innerHTML = pfBody(p);
}

// Repaint a portfolio's summary (weighted avg) + cash rows after an edit. The focused
// input lives in the tbody, so replacing the thead/tfoot rows keeps the cursor put.
function refreshPfFooter(id) {
  const p = pfFind(id);
  if (!p) return;
  const items = pfItems(p), s = weightedStats(items), pb = portBeta(items), q = quoteCount();
  const sum = document.getElementById('pf-sum-' + id);
  if (sum) sum.outerHTML = pfSummaryRow(p, s, pb, items);
  const foot = document.getElementById('pf-foot-' + id);
  if (foot) foot.innerHTML = cashRow(s, q, '<td class="pm-actions"></td>');
}

function metricNote() {
  if (!metricSel) return '';
  const m = METRICS[metricSel], onSummit = source === 'summit';
  const isCash = metricSel === 'cfo' || metricSel === 'fcf';
  // The descriptive note was removed at the user's request. The one thing kept is
  // the data-integrity disclaimer: under Consensus, CFO/FCF are derived (the model
  // carries no street CFO/FCF), so a reader never mistakes them for sourced figures.
  if (!onSummit && isCash) {
    return `<p class="pm-note">
      <strong>${m.label} here is derived, not consensus.</strong> The model carries no street CFO or FCF
      estimate, so the marked cells are the street's EBITDA run through each company's own Summit
      ${m.label}/EBITDA conversion rate for that year. They answer "what would ${m.label} be if the street's
      EBITDA converted the way our model says it converts" — not "what does the street forecast for ${m.label}".
      SOFI is unmarked and hand-typed: Summit projects no ${m.label} for it past 2025, so there's no rate to
      derive from.</p>`;
  }
  return '';
}

// Sub-toggle under the metric bar. For Earnings it reads the metric as the absolute
// figure or per share; for Cash it picks which cash metric — CFO or FCF — is live.
// Hidden for EBITDA, which has no sub-choice.
function basisBar() {
  if (metricSel === 'earnings') {
    const opt = (k, label) =>
      `<button data-basis="${k}" class="${earnBasis === k ? 'on' : ''}">${label}</button>`;
    return `
    <div class="pm-metricbar pm-basisbar">
      <span class="lbl">Basis</span>
      <div class="pm-seg">${opt('earnings', 'Earnings')}${opt('eps', 'EPS')}</div>
    </div>`;
  }
  if (isCashMetric()) {
    const opt = (k, label) =>
      `<button data-cash="${k}" class="${metricSel === k ? 'on' : ''}">${label}</button>`;
    return `
    <div class="pm-metricbar pm-basisbar">
      <span class="lbl">Basis</span>
      <div class="pm-seg">${opt('cfo', 'CFO')}${opt('fcf', 'FCF')}</div>
    </div>`;
  }
  return '';
}

// Shared header row — the benchmark card reuses it so its columns stay aligned
// with the book above as the metric/year selectors change.
// Column count, so group/empty rows span the table as the selectors change.
// The metric block: multiple + growth + PEG + Beta (4), plus the two value columns
// when showQuote is on (6). The value columns ride the same toggle as Price/MktCap.
const metricCols = () => (showQuote ? 6 : 4);

// Ticker + Weight + the live-quote columns on screen (quoteCount: Price + Market
// Cap and/or Net Debt + EV) + the metric columns (metricCols), and Paper adds a
// trailing actions column.
const colSpan = (extra) => 2 + quoteCount() + metricCols() + (extra || 0);

function headRow(trailing) {
  const p = periodInfo();
  const m = METRICS[metricSel];
  return `<tr>
            <th>Ticker</th><th>Weight %</th>
            ${showQuote ? '<th>Price</th><th>Market Cap</th>' : ''}
            ${showEvCols() ? '<th>Net Debt</th><th>EV</th>' : ''}
            <th class="msep">${m.mult} <span class="pm-cy">${multSel === 'NTM' ? 'NTM' : relLabel(multSel)}</span></th>
            ${showQuote ? `<th>${metricLabel()} ${periodHead(p.prevKey)}</th>
            <th>${metricLabel()} ${periodHead(p.currKey)}</th>` : ''}
            <th>Growth${growthSpan() > 1 ? ' ann.' : ''} ${p.prevLabel}&rarr;${p.currLabel}${
              isRel(p.currKey) ? `<span class="pm-cy">${p.prevKey}&rarr;${p.currKey}${growthSpan() > 1 ? ` · ${growthSpan()}y CAGR` : ''}</span>` : ''}</th>
            <th>PEG</th>
            <th>Beta</th>
            ${trailing || ''}
          </tr>`;
}

// The benchmark card: same columns as the book, one row, its own box.
function benchmarkTable() {
  const b = BENCHMARK;
  return `
    <h3 class="pm-bmk-h">Benchmark</h3>
    <div class="card pm-bmk">
      <table>
        <thead>${headRow('<th></th>')}</thead>
        <tbody>
          <tr data-ticker="${b.ticker}">
            <td class="tk">${b.label}${fyBadge(b.ticker)} <span class="muted">${b.name}</span></td>
            ${baseCells(b)}
            ${metricCells(b.ticker)}
            <td class="pm-actions"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="pm-note">
      Benchmark, not a holding &mdash; no weight, and no Net Debt / EV (a fund has no
      balance sheet of its own). Price and Market Cap (the fund's AUM) are live via Massive.
      Neither source models the index, so ${METRICS[metricSel].mult} and the ${METRICS[metricSel].label}
      values are typed by hand and saved locally; growth and PEG compute from them.
    </p>`;
}

// Metric / Source / Multiple-period selectors + the Growth dropdown, with the metric
// basis sub-toggle under them. Both subtabs render this bar and share the same state.
// The multiple-period segment: NTM (disabled until it has a real feed), FY0, FY+1, FY+2.
function multButtons() {
  return MULT_PERIODS.map(y => {
    const dis = y === 'NTM';
    const attrs = dis
      ? ' disabled title="NTM no disponible aún — el modelo solo trae años fiscales. Próximamente conectaremos un NTM con dato real."'
      : '';
    return `<button data-mult="${y}" class="${multSel === y ? 'on' : ''}"${attrs}>${periodHead(y)}</button>`;
  }).join('');
}
// The growth dropdown: three fixed windows (FY0→FY2 annualized).
function growthSelect() {
  return `<select class="pm-select" data-growth>${
    Object.keys(GROWTH_OPTS).map(k =>
      `<option value="${k}"${growthSel === k ? ' selected' : ''}>${GROWTH_OPTS[k].label}</option>`
    ).join('')}</select>`;
}

function metricBar() {
  return `
    <div class="pm-metricbar">
      <span class="lbl">Metric</span>
      <div class="pm-seg">
        <button data-metric="ebitda" class="${metricSel === 'ebitda' ? 'on' : ''}">EBITDA</button>
        <button data-metric="earnings" class="${metricSel === 'earnings' ? 'on' : ''}">Earnings</button>
        <button data-metric="cash" class="${isCashMetric() ? 'on' : ''}" title="CFO o FCF — elige cuál en Basis">Cash</button>
      </div>
      <span class="lbl" style="margin-left:8px">Source</span>
      <div class="pm-seg">
        ${Object.keys(SOURCES).map(k =>
          `<button data-source="${k}" class="${source === k ? 'on' : ''}">${SOURCES[k].label}</button>`
        ).join('')}
      </div>
      <div class="pm-mg" style="margin-left:8px">
        <div class="pm-mg-line">
          <span class="lbl">Multiple</span>
          <div class="pm-seg">${multButtons()}</div>
        </div>
        <div class="pm-mg-line">
          <span class="lbl">Growth</span>
          ${growthSelect()}
        </div>
      </div>
    </div>
    ${basisBar()}`;
}

// Subtle show/hide control for the Price + Market Cap columns, parked at the top-right
// just above the table (rather than taking a slot in the metric bar).
function quoteToggle() {
  const eye = showQuote
    ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.9 17.9A10.7 10.7 0 0 1 12 19C5 19 1 12 1 12a19.8 19.8 0 0 1 5.1-5.9m3.3-1.5A10.7 10.7 0 0 1 12 5c7 0 11 7 11 7a19.8 19.8 0 0 1-2.3 3.3M1 1l22 22"/></svg>'
    : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  return `<div class="pm-qtoggle">
    <button data-togglequote class="pm-qbtn${showQuote ? ' on' : ''}" title="Mostrar u ocultar Price, Market Cap y las columnas de ${metricLabel()}">
      ${eye}<span>Price · Market Cap · ${metricLabel()}</span>
    </button>
  </div>`;
}

const quoteNote = () => {
  const parts = [];
  if (showQuote) parts.push('Price · Market Cap');
  if (showEvCols()) parts.push('Net Debt · EV');
  const nd = showEvCols() ? ' Net Debt = EV − Market Cap (negative = net cash).' : '';
  const live = parts.length
    ? `<p class="pm-note">${parts.join(' · ')} = live via Massive (api.liveQuote).${nd}</p>`
    : '';
  const hint = showEvCols()
    ? ''
    : `<p class="pm-note">Net Debt y EV aparecen solo con EBITDA (para EV/EBITDA); las demás métricas valúan sobre Market Cap.</p>`;
  return live + hint;
};

function portfolioTable() {
  // The book is a named, collapsible segment: collapsed hides the holdings and the
  // Cash row, leaving the column headers + the weighted-average row under the name.
  // (First of what will become one segment per portfolio.)
  return `
    ${metricBar()}
    <div class="pm-toprow">
      ${quoteToggle()}
      ${newPortfolioBar()}
    </div>
    <div class="card pm-seg${bookCollapsed ? ' is-collapsed' : ''}" data-seg="summit">
      <table data-side="portfolio">
        <thead>${headRow('<th></th>')}${bookSummaryRow()}</thead>
        <tbody id="pm-book-body">${bookBody()}</tbody>
        <tfoot id="pm-book-foot">${bookCashRow()}</tfoot>
      </table>
    </div>
    ${customPortfolios()}
    ${quoteNote()}
    ${metricNote()}
    ${benchmarkTable()}`;
}

function renderPortfolio() {
  // Repaint only the PEG table — the Correlations pane and the tab bar live in
  // #pm-sub-portfolio around it and must survive. The Beta column repaints with it.
  const el = document.getElementById('pm-an-peg');
  if (el) el.innerHTML = portfolioTable();
}

// Placeholder analyses — structure is in place; content is built out next.
// ── Beta ─────────────────────────────────────────────────────────────────────
// β = cov(asset returns, market returns) / var(market returns), over periodic
// returns computed from the embedded price history. Default: 5 years, monthly —
// the market standard. Window and frequency are adjustable per the controls; the
// portfolio β is the weight-weighted average of the per-name betas (cash and
// names without price data carry β 0, so they pull the aggregate toward zero).
const _mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;

// Price source for a given frequency. Monthly is embedded in PRICES, weekly in
// PRICES_WEEKLY, daily in PRICES_DAILY once ensureDaily() has loaded it (null until
// then, so a daily name reports "loading" instead of throwing).
function betaData(freq) {
  if (freq === 'weekly') return (typeof PRICES_WEEKLY !== 'undefined') ? PRICES_WEEKLY : null;
  if (freq === 'daily') return PRICES_DAILY;
  return PRICES;
}

// Lazy-load the daily history (~400KB) the first time it is needed, then repaint
// the Beta and Comparison views. Kept out of the initial bundle on purpose.
async function ensureDaily() {
  if (dailyState === 'ready' || dailyState === 'loading') return;
  dailyState = 'loading';
  renderBeta();
  try {
    const mod = await import('./portfolio-metrics-prices-daily.js');
    PRICES_DAILY = mod.PRICES_DAILY;
    dailyState = 'ready';
  } catch (e) {
    dailyState = 'error';
  }
  renderBeta();
  renderBlended();
  renderCorr();
}
const betaMarket = () => (PRICES && PRICES.market) || 'SPY';

// Vocabulary per frequency, so labels read naturally whatever a name is set to.
const FREQ_NOUN = {
  daily:   { many: 'días',    adj: 'diarios',   label: 'diaria'  },
  weekly:  { many: 'semanas', adj: 'semanales', label: 'semanal' },
  monthly: { many: 'meses',   adj: 'mensuales', label: 'mensual' },
};

// The effective method for a name: its own override, else the global default.
// Methodology varies a lot by name (a recent IPO wants daily/short; a mature name
// the 5y-monthly standard), so each row may pin its own frequency + window.
function betaMethod(t) {
  const o = betaOverrides[t];
  return (o && o.freq)
    ? { freq: o.freq, amt: Number(o.amt), unit: o.unit, override: true }
    : { freq: betaFreq, amt: Number(betaAmt), unit: betaUnit, override: false };
}
// Compact label for a method, e.g. "5A·M" (5 años, mensual) or "18M·D".
const methodTag = (m) => `${m.amt}${m.unit === 'y' ? 'A' : 'M'}·${{ daily: 'D', weekly: 'S', monthly: 'M' }[m.freq]}`;

// Set (or clear) a name's override from a partial patch, seeding missing fields
// from its current effective method. If the result equals the global default it is
// stored as "no override" so the name simply tracks the default again.
function setBetaOverride(t, patch) {
  const cur = betaMethod(t);
  const next = { freq: cur.freq, amt: cur.amt, unit: cur.unit, ...patch };
  if (next.freq === betaFreq && Number(next.amt) === Number(betaAmt) && next.unit === betaUnit) {
    delete betaOverrides[t];
  } else {
    betaOverrides[t] = { freq: next.freq, amt: Number(next.amt), unit: next.unit };
  }
  saveJSON(BETA_METHOD_KEY, betaOverrides);
}

// True when a name's beta override, or the correlation matrix, asks for daily data.
const needsDaily = () => corrFreq === 'daily' || betaFreq === 'daily' || Object.values(betaOverrides).some((o) => o && o.freq === 'daily');
function maybeLoadDaily() {
  if (needsDaily() && dailyState !== 'ready' && dailyState !== 'loading') ensureDaily();
}

// Series for a ticker at a given frequency: ascending [key, close] pairs
// (key = 'YYYY-MM' monthly, 'YYYY-MM-DD' weekly/daily), or null if not embedded.
function betaSeries(t, freq) {
  const d = betaData(freq);
  const s = d && d.series && d.series[t];
  return Array.isArray(s) && s.length ? s : null;
}

// Earliest period key kept for a method's window, counted back from the source's
// asOf. Format matches the series keys (month for monthly, day otherwise).
function betaCutoffKey(m) {
  const d = betaData(m.freq);
  const parts = String((d && d.asOf) || '').split('-');
  const y = Number(parts[0]), mo = Number(parts[1]), day = Number(parts[2] || 1);
  if (!y || !mo) return '0000-00';
  const back = m.unit === 'y' ? m.amt * 12 : m.amt;
  const dt = new Date(Date.UTC(y, (mo - 1) - back, day || 1));
  return m.freq === 'monthly' ? dt.toISOString().slice(0, 7) : dt.toISOString().slice(0, 10);
}

// Periodic simple returns inside a method's window, as a Map(periodKey → return).
function betaReturns(t, m) {
  const s = betaSeries(t, m.freq);
  if (!s) return null;
  const from = betaCutoffKey(m);
  const win = s.filter((r) => r[0] >= from);
  const out = new Map();
  for (let i = 1; i < win.length; i++) {
    const a = win[i - 1][1], b = win[i][1];
    if (a > 0 && b > 0) out.set(win[i][0], b / a - 1);
  }
  return out;
}

// { beta, n, method } for one name. Market returns use the SAME method as the name
// (same frequency and window) so cov/var line up on overlapping periods.
function betaOf(t) {
  const m = betaMethod(t);
  const mR = betaReturns(betaMarket(), m), sR = betaReturns(t, m);
  if (!mR || !sR) return { beta: null, n: 0, method: m };
  const xs = [], ys = [];
  sR.forEach((v, k) => { if (mR.has(k)) { ys.push(v); xs.push(mR.get(k)); } });
  const n = xs.length;
  if (n < 6) return { beta: null, n, method: m };     // too few points to trust
  const mx = _mean(xs), my = _mean(ys);
  let cov = 0, varm = 0;
  for (let i = 0; i < n; i++) { cov += (xs[i] - mx) * (ys[i] - my); varm += (xs[i] - mx) ** 2; }
  return { beta: varm > 0 ? cov / varm : null, n, method: m };
}

// Portfolio β = weighted average of the per-name betas (each at its own method),
// normalised over covered weight + cash — exactly how weightedStats handles growth.
// Cash is a β-0 holding (it drags β down to the extent the book isn't invested); a
// name with a weight but no usable beta (too little price history) drops out of BOTH
// sides, so it is excluded rather than counted as 0. Dividing by a flat 100 instead
// would wrongly pull β toward 0 for every uncovered name.
function portBeta(items) {
  let wTyped = 0, bSum = 0, wCov = 0;
  items.forEach((it) => {
    const w = num(it.weight);
    if (w === null || w <= 0) return;
    wTyped += w;
    const r = betaOf(it.ticker);
    if (!r || r.beta === null) return;     // no usable beta → excluded, not counted as 0
    bSum += w * r.beta; wCov += w;
  });
  const cash = Math.max(0, 100 - wTyped);  // uninvested remainder, β 0
  return { beta: wCov > 0 ? bSum / (wCov + cash) : null, covered: wCov };
}

// The per-name control strip, revealed under a row when its method tag is clicked.
function methodStrip(t, m, n) {
  const freqs = [['daily', 'D'], ['weekly', 'S'], ['monthly', 'M']];
  const units = [['m', 'M'], ['y', 'A']];
  const presets = [['1', 'y'], ['2', 'y'], ['3', 'y'], ['5', 'y']];
  return `<div class="pm-mstrip" data-mtk="${esc(t)}">
      <span class="lbl">Frec</span>
      <div class="pm-seg pm-seg-sm">${freqs.map(([k, l]) =>
        `<button data-mfreq="${k}" class="${m.freq === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <span class="lbl">Ventana</span>
      <input class="pm-mwin" data-mwin value="${esc(m.amt)}" inputmode="numeric" aria-label="ventana">
      <div class="pm-seg pm-seg-sm">${units.map(([k, l]) =>
        `<button data-munit="${k}" class="${m.unit === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="pm-seg pm-seg-sm">${presets.map(([a, u]) =>
        `<button data-mpreset="${a}${u}" class="${String(m.amt) === a && m.unit === u ? 'on' : ''}">${a}A</button>`).join('')}</div>
      <span class="pm-mn">n&nbsp;=&nbsp;${n || '&mdash;'}</span>
      ${m.override
        ? `<button class="pm-mreset" data-mreset title="Volver al método por defecto">&#8635; default</button>`
        : `<span class="pm-mdef">usa el default</span>`}
    </div>`;
}

// Beta now lives as a column inside the PEG tables (see betaTd / footRows), so a
// beta recompute just repaints those tables and re-syncs the detail modal if open.
function renderBeta() {
  maybeLoadDaily();
  renderPortfolio();                                   // Summit PEG table (Beta column)
  const p = document.getElementById('pm-an-peg-paper');
  if (p) p.innerHTML = paperTable();                   // Paper PEG table (Beta column)
  refreshBetaModal();                                  // keep an open detail modal in sync
}

// Rolling beta over ALL available history at a given frequency: at each period
// with `win` trailing return-periods, β over that trailing window. This is what
// the click-through chart plots — how a name's beta has drifted, independent of
// the row's selected lookback (that lookback only sets the single table number).
function rollingBeta(t, win, freq) {
  const s = betaSeries(t, freq), ms = betaSeries(betaMarket(), freq);
  if (!s || !ms) return [];
  const mret = new Map();
  for (let i = 1; i < ms.length; i++) {
    const a = ms[i - 1][1], b = ms[i][1];
    if (a > 0 && b > 0) mret.set(ms[i][0], b / a - 1);
  }
  const sr = []; // [key, stockRet, mktRet] only where both exist
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1][1], b = s[i][1], k = s[i][0];
    if (a > 0 && b > 0 && mret.has(k)) sr.push([k, b / a - 1, mret.get(k)]);
  }
  const out = [];
  for (let end = win - 1; end < sr.length; end++) {
    const xs = [], ys = [];
    for (let i = end - win + 1; i <= end; i++) { ys.push(sr[i][1]); xs.push(sr[i][2]); }
    const mx = _mean(xs), my = _mean(ys);
    let cov = 0, varm = 0;
    for (let i = 0; i < xs.length; i++) { cov += (xs[i] - mx) * (ys[i] - my); varm += (xs[i] - mx) ** 2; }
    if (varm > 0) out.push({ key: sr[end][0], beta: cov / varm });
  }
  return out;
}

// The single reusable modal behind the Beta column: the formula, the per-name
// method controls, and the rolling-beta history chart. One modal, re-pointed at
// whichever name was clicked.
function betaModal() {
  return `
    <div class="modal-overlay pm-beta-ov" id="pm-beta-modal">
      <div class="modal-card pm-beta-card">
        <div class="modal-header">
          <div>
            <div class="modal-title" id="pm-bm-title">Beta</div>
            <div class="pm-bm-sub" id="pm-bm-sub"></div>
          </div>
          <button class="modal-close" data-bm-close aria-label="Cerrar">&times;</button>
        </div>
        <div class="pm-bm-controls" id="pm-bm-controls"></div>
        <div class="pm-bm-body"><canvas id="pm-bm-canvas"></canvas></div>
        <div class="pm-bm-calc" id="pm-bm-calc"></div>
      </div>
    </div>`;
}

// How the number is built, in plain Spanish, with this name's actual inputs. Shown
// under the chart so the modal both explains the method and lets you change it.
function betaCalcHtml(t, m, cur) {
  const noun = FREQ_NOUN[m.freq];
  const win = m.unit === 'y'
    ? `${m.amt} año${m.amt > 1 ? 's' : ''}`
    : `${m.amt} mes${m.amt > 1 ? 'es' : ''}`;
  const b = cur.beta != null ? cur.beta.toFixed(2) : '—';
  const reads = cur.beta != null
    ? `En promedio la acción se movió <b>${b}%</b> por cada <b>1%</b> del mercado sobre esa ventana.`
    : `Aún no hay suficientes períodos en común (n = ${cur.n || 0}, se necesitan ≥6) para un número confiable.`;
  return `
    <div class="pm-bm-formula">&beta; = cov(r<sub>activo</sub>, r<sub>mercado</sub>) &divide; var(r<sub>mercado</sub>)</div>
    <p class="pm-bm-expl">
      Se toman los rendimientos <b>${noun.adj}</b> de <b>${labelOf(t)}</b> y de <b>${betaMarket()}</b> (el mercado)
      sobre los últimos <b>${win}</b>, se alinean en sus períodos en común (<b>n = ${cur.n || '—'}</b>) y se divide la
      covarianza del activo con el mercado entre la varianza del mercado. ${reads}
    </p>
    <p class="pm-bm-expl pm-bm-muted">
      Cambia frecuencia y ventana arriba para recalcular &mdash; el ajuste se guarda <b>solo para ${labelOf(t)}</b> y se
      refleja en la columna Beta de la tabla. La &beta; del portafolio es el promedio de estas betas ponderado por peso.
    </p>`;
}

let _betaChart = null;
let _betaModalTicker = null;    // the name the modal is currently showing, for live refresh

// Open (or re-point) the modal on a name. Draws title, controls, formula and chart.
function openBetaChart(ticker) {
  const overlay = document.getElementById('pm-beta-modal');
  if (!overlay || typeof Chart === 'undefined') return;
  _betaModalTicker = ticker;
  overlay.classList.add('open');
  drawBetaModal(ticker);
}

// Re-render the open modal in place after its method changed (called from renderBeta).
function refreshBetaModal() {
  const overlay = document.getElementById('pm-beta-modal');
  if (_betaModalTicker && overlay && overlay.classList.contains('open')) drawBetaModal(_betaModalTicker);
}

function drawBetaModal(ticker) {
  const m = betaMethod(ticker);                          // the name's own method
  const noun = FREQ_NOUN[m.freq];
  const avail = (betaSeries(ticker, m.freq) || []).length - 1;   // return-periods available
  // Rolling window sized to the frequency: ~1y daily, ~1y weekly, ~2y monthly, floored.
  const target = { daily: 252, weekly: 52, monthly: 24 }[m.freq];
  const floor  = { daily: 120, weekly: 26, monthly: 12 }[m.freq];
  const win = Math.max(floor, Math.min(target, avail - 6));
  const series = rollingBeta(ticker, win, m.freq);

  const cur = betaOf(ticker);
  document.getElementById('pm-bm-title').textContent = `${labelOf(ticker)} — Beta`;
  document.getElementById('pm-bm-sub').innerHTML =
    `Beta móvil de ${win} ${noun.many} vs ${betaMarket()} (${noun.label})` +
    (cur && cur.beta != null
      ? ` &middot; β actual (${methodTag(m)}) = <b>${cur.beta.toFixed(2)}</b>` : '');
  document.getElementById('pm-bm-controls').innerHTML = methodStrip(ticker, m, cur.n);
  document.getElementById('pm-bm-calc').innerHTML = betaCalcHtml(ticker, m, cur);

  if (_betaChart) { _betaChart.destroy(); _betaChart = null; }
  if (!series.length) return;   // nothing to plot (too little history)
  const ctx = document.getElementById('pm-bm-canvas').getContext('2d');
  _betaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: series.map((p) => p.key),
      datasets: [
        {
          label: `Beta (móvil ${win} ${noun.many})`, data: series.map((p) => p.beta),
          borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,.08)',
          fill: true, tension: 0.25, pointRadius: 0, borderWidth: 2,
        },
        {
          label: 'Mercado (β=1)', data: series.map(() => 1),
          borderColor: '#8A93A0', borderDash: [4, 4], borderWidth: 1,
          pointRadius: 0, fill: false,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => (c.datasetIndex === 0 ? 'β ' : '') + c.parsed.y.toFixed(2) } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 } } },
        y: { grid: { color: '#E7EAEE' }, ticks: { font: { size: 10 } }, title: { display: true, text: 'Beta' } },
      },
    },
  });
}

function closeBetaChart() {
  const overlay = document.getElementById('pm-beta-modal');
  if (overlay) overlay.classList.remove('open');
  if (_betaChart) { _betaChart.destroy(); _betaChart = null; }
  _betaModalTicker = null;
}
// ── Correlations ──────────────────────────────────────────────────────────────
// Pearson correlation of two return series (Map period→return), aligned on their
// overlapping periods only; < 6 shared points is treated as no read.
function pearsonMaps(r1, r2) {
  if (!r1 || !r2) return { r: null, n: 0 };
  const xs = [], ys = [];
  r1.forEach((v, k) => { if (r2.has(k)) { xs.push(v); ys.push(r2.get(k)); } });
  const n = xs.length;
  if (n < 6) return { r: null, n };
  const mx = _mean(xs), my = _mean(ys);
  let cov = 0, vx = 0, vy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; cov += dx * dy; vx += dx * dx; vy += dy * dy; }
  const den = Math.sqrt(vx * vy);
  return { r: den > 0 ? cov / den : null, n };
}
// Correlation between two tickers over a shared window/frequency.
const pearson = (t1, t2, m) => pearsonMaps(betaReturns(t1, m), betaReturns(t2, m));

// Average pairwise correlation among a set of positions (over method m), for the
// Comparison summary. Pairs without enough shared history are skipped.
function avgCorr(items, m) {
  const tks = [...new Set(items.map((it) => (it.ticker || '').toUpperCase()).filter(Boolean))];
  let sum = 0, cnt = 0;
  for (let i = 0; i < tks.length; i++) for (let j = i + 1; j < tks.length; j++) {
    const { r } = pearson(tks[i], tks[j], m); if (r != null) { sum += r; cnt++; }
  }
  return cnt ? sum / cnt : null;
}

// Weighted portfolio return series: each period's return is the weight-weighted
// average across the holdings that have a return that period (re-normalised to the
// names present, so a short-history name doesn't blank the whole period).
function portfolioReturns(items, m) {
  const parts = items
    .map((it) => ({ w: num(it.weight), r: betaReturns((it.ticker || '').toUpperCase(), m) }))
    .filter((p) => p.w && p.w > 0 && p.r);
  if (!parts.length) return null;
  const keys = new Set();
  parts.forEach((p) => p.r.forEach((_, k) => keys.add(k)));
  const out = new Map();
  keys.forEach((k) => {
    let wSum = 0, rSum = 0;
    parts.forEach((p) => { if (p.r.has(k)) { wSum += p.w; rSum += p.w * p.r.get(k); } });
    if (wSum > 0) out.set(k, rSum / wSum);
  });
  return out;
}

// Matrix-level frequency + window controls (correlation must share one sampling).
function corrControls() {
  const freqs = [['daily', 'Diario'], ['weekly', 'Semanal'], ['monthly', 'Mensual']];
  const units = [['m', 'Meses'], ['y', 'A&ntilde;os']];
  const presets = [['1', 'y'], ['2', 'y'], ['3', 'y'], ['5', 'y']];
  return `
    <div class="pm-betabar">
      <span class="lbl">Frecuencia</span>
      <div class="pm-seg">${freqs.map(([k, l]) =>
        `<button data-cfreq="${k}" class="${corrFreq === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <span class="lbl" style="margin-left:6px">Ventana</span>
      <input class="pm-cwin" data-cwin value="${esc(corrAmt)}" inputmode="numeric" aria-label="ventana">
      <div class="pm-seg">${units.map(([k, l]) =>
        `<button data-cunit="${k}" class="${corrUnit === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="pm-seg">${presets.map(([a, u]) =>
        `<button data-cpreset="${a}${u}" class="${String(corrAmt) === a && corrUnit === u ? 'on' : ''}">${a}A</button>`).join('')}</div>
    </div>`;
}

// The Paper matrix's editable name set. null = mirror the Paper book live; once
// the user edits it, corrMatrixNames holds a fixed own list. Summit's matrix is
// always the fixed book.
const paperMatrixBase = () => [...new Set(paperItems().map((x) => (x.ticker || '').toUpperCase()).filter(Boolean))];
const paperMatrixNames = () => (corrMatrixNames === null ? paperMatrixBase() : corrMatrixNames);

// Add / remove a name from the Paper matrix (materialises the list on first edit).
function addCorrName(input) {
  if (!input) return;
  const t = (input.value || '').trim().toUpperCase();
  if (!t) return;
  if (corrMatrixNames === null) corrMatrixNames = paperMatrixBase();
  if (!corrMatrixNames.includes(t)) corrMatrixNames.push(t);
  saveJSON(CORR_MNAMES_KEY, corrMatrixNames);
  renderCorr();
}
function delCorrName(t) {
  if (corrMatrixNames === null) corrMatrixNames = paperMatrixBase();
  corrMatrixNames = corrMatrixNames.filter((x) => x !== t);
  saveJSON(CORR_MNAMES_KEY, corrMatrixNames);
  renderCorr();
}

// The editable chip list shown above the Paper matrix (Paper subtab only).
function corrNamesEditor() {
  const tks = paperMatrixNames();
  return `<div class="pm-cnames">
      <span class="lbl">Nombres de la matriz</span>
      ${tks.map((t) => `<span class="pm-chip">${esc(t)}<button class="pm-chipx" data-cname-del="${esc(t)}" title="Quitar ${esc(t)}" aria-label="Quitar ${esc(t)}">&times;</button></span>`).join('')}
      <input class="pm-cnameinp" data-cnameinp placeholder="+ ticker" aria-label="agregar nombre a la matriz">
    </div>`;
}

// The correlation matrix for the current side's book (Summit or Paper).
function corrMatrix(side) {
  const editor = side === 'paper' ? corrNamesEditor() : '';
  const tks = side === 'paper'
    ? [...new Set(paperMatrixNames().map((t) => (t || '').toUpperCase()).filter(Boolean))]
    : [...new Set(weightedBook().map((it) => (it.ticker || '').toUpperCase()).filter(Boolean))];
  const m = { freq: corrFreq, amt: Number(corrAmt), unit: corrUnit };

  if (corrFreq === 'daily' && dailyState !== 'ready') {
    return corrControls() + editor + `<div class="pm-ph">${dailyState === 'error'
      ? 'No se pudo cargar el historial diario. Reintenta seleccionando <b>Diario</b>.'
      : 'Cargando el historial de precios diario&hellip;'}</div>`;
  }
  if (tks.length < 2) return corrControls() + editor
    + `<div class="pm-ph">${side === 'paper' ? 'Agrega al menos 2 nombres a la matriz.' : 'Se necesitan al menos 2 posiciones con peso &gt; 0%.'}</div>`;

  const R = tks.map((a) => tks.map((b) => (a === b ? { r: 1, n: null } : pearson(a, b, m))));
  let sum = 0, cnt = 0;
  for (let i = 0; i < tks.length; i++) for (let j = i + 1; j < tks.length; j++) {
    const r = R[i][j].r; if (r != null) { sum += r; cnt++; }
  }
  const avg = cnt ? sum / cnt : null;

  const head = `<tr><th class="pm-cxh"></th>${tks.map((t, j) => `<th class="pm-cxh" data-c="${j}">${esc(t)}</th>`).join('')}</tr>`;
  const body = tks.map((a, i) => `<tr>
      <td class="pm-cyh" data-r="${i}">${esc(a)}</td>
      ${tks.map((b, j) => {
        if (i === j) return `<td class="pm-cdiag" data-r="${i}" data-c="${j}">1.00</td>`;
        const { r, n } = R[i][j];
        if (r == null) return `<td class="pm-ccell muted" data-r="${i}" data-c="${j}" title="datos insuficientes">&mdash;</td>`;
        return `<td class="pm-ccell" data-r="${i}" data-c="${j}" title="${esc(a)} · ${esc(b)} = ${r.toFixed(2)} (n=${n})">${r.toFixed(2)}</td>`;
      }).join('')}
    </tr>`).join('');

  return `${corrControls()}${editor}
    <div class="pm-cstat">Correlaci&oacute;n promedio del portafolio:
      <b>${avg != null ? avg.toFixed(2) : '&mdash;'}</b> <span class="muted">(pares con datos)</span></div>
    <div class="card"><table class="pm-cmatrix"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <p class="pm-note">Correlaci&oacute;n de Pearson de retornos ${FREQ_NOUN[corrFreq].adj}, ventana ${corrAmt}${corrUnit === 'y' ? 'A' : 'M'}
      (hasta ${(betaData(corrFreq) || {}).asOf || '&mdash;'}). <b>Clic</b> en una celda (o en una etiqueta) para resaltar su fila
      y columna; clic de nuevo para quitar. <b>n</b> = periodos solapados; los pares con poca historia en com&uacute;n
      (p. ej. TBBB) muestran &mdash;.</p>`;
}

// Benchmarks subtab: each holding's correlation against SPY (fixed, left) plus up
// to 4 tickers you type into the editable column headers on the right. A weighted
// "Portafolio (pond.)" row gives the book's own return series vs each instrument.
function benchTable(side) {
  const items = side === 'paper' ? paperItems() : weightedBook();
  const m = { freq: corrFreq, amt: Number(corrAmt), unit: corrUnit };
  const cols = ['SPY', ...corrSlots.map((s) => (s || '').toUpperCase())];   // '' = empty slot

  if (corrFreq === 'daily' && dailyState !== 'ready') {
    return corrControls() + `<div class="pm-ph">${dailyState === 'error'
      ? 'No se pudo cargar el historial diario. Reintenta seleccionando <b>Diario</b>.'
      : 'Cargando el historial de precios diario&hellip;'}</div>`;
  }

  const slotHeads = corrSlots.map((s, i) =>
    `<th class="pm-bh pm-slh"><input class="pm-slotinp" data-slot="${i}" value="${esc(s)}" placeholder="+ ticker" aria-label="ticker extra ${i + 1}"></th>`).join('');
  const thead = `<tr><th>Name</th><th>Weight</th><th class="pm-bh">SPY</th>${slotHeads}</tr>`;

  const corrCell = (t, b) => {
    if (!t || !b) return `<td class="num muted">&mdash;</td>`;   // no holding or empty slot
    const { r, n } = pearson(t, b, m);
    return r == null
      ? `<td class="num muted" title="datos insuficientes o sin historial de ${esc(b)}">&mdash;</td>`
      : `<td class="num" title="${esc(t)} vs ${esc(b)} = ${r.toFixed(2)} (n=${n})">${r.toFixed(2)}</td>`;
  };

  const rowsHtml = items.map((it) => {
    const t = (it.ticker || '').toUpperCase();
    const w = num(it.weight);
    return `<tr>
        <td class="tk">${labelOf(t) || '&mdash;'}</td>
        <td class="num">${w == null ? '&mdash;' : w.toFixed(1) + '%'}</td>
        ${cols.map((b) => corrCell(t, b)).join('')}
      </tr>`;
  }).join('');

  const pr = portfolioReturns(items, m);   // the book's own weighted return series
  const footCells = cols.map((b) => {
    if (!b) return `<td class="num">&mdash;</td>`;
    const { r, n } = pearsonMaps(pr, betaReturns(b, m));
    return r == null ? `<td class="num">&mdash;</td>` : `<td class="num" title="Portafolio vs ${esc(b)} (n=${n})">${r.toFixed(2)}</td>`;
  }).join('');

  return `${corrControls()}
    <div class="card"><table class="pm-benchtable">
      <thead>${thead}</thead>
      <tbody>${rowsHtml || `<tr><td colspan="7" class="pm-empty">Sin posiciones con peso &gt; 0%.</td></tr>`}</tbody>
      <tfoot><tr class="pm-wavg"><td class="tk">Portafolio (pond.)</td><td class="num"></td>${footCells}</tr></tfoot>
    </table></div>
    <p class="pm-note">Correlaci&oacute;n de Pearson de cada posici&oacute;n vs <b>SPY</b> y hasta <b>4 tickers</b> que escribas en los
      encabezados de la derecha &mdash; retornos ${FREQ_NOUN[corrFreq].adj}, ventana ${corrAmt}${corrUnit === 'y' ? 'A' : 'M'}.
      <b>Portafolio (pond.)</b> = la serie de retornos del libro (ponderada por peso) vs cada instrumento. Con historial
      embebido hoy: <b>SPY, QQQ, XLG, SMH</b> y los nombres del portafolio; otros muestran &mdash; hasta que me pidas
      agregar su historial.</p>`;
}

function corrBlock(side) {
  const subs = [['bench', 'Benchmarks'], ['matrix', 'Matrix']];
  return `
    <div class="pm-cnav">${subs.map(([k, l]) =>
      `<button class="pm-ctab ${corrSub === k ? 'active' : ''}" data-ct="${k}">${l}</button>`).join('')}</div>
    <div class="pm-cbody">${corrSub === 'matrix' ? corrMatrix(side) : benchTable(side)}</div>`;
}

function renderCorr() {
  maybeLoadDaily();
  const a = document.getElementById('pm-an-corr');
  if (a) a.innerHTML = corrBlock('metrics');
  const b = document.getElementById('pm-an-corr-paper');
  if (b) b.innerHTML = corrBlock('paper');
}

// Commit a typed benchmark slot (one of the 4 editable columns) and repaint.
function setBenchSlot(input) {
  if (!input) return;
  const i = Number(input.dataset.slot);
  corrSlots[i] = (input.value || '').trim().toUpperCase();
  saveJSON(CORR_SLOTS_KEY, corrSlots);
  renderCorr();
}

// ── Blended subtab: Before (current book) vs After (paper) ────────────────────
// A summary of the first two subtabs — "how would the portfolio look if we made
// the paper changes." Before = current book weights, After = paper weights. Per
// name we show each side's weight, the change, and the name's PEG (new names
// included). Portfolio-level tiles compare weighted PEG / growth / multiple;
// Beta and Correlations join once those analyses exist.
const LABEL_OF = {};
[...PORTFOLIO.passive, ...PORTFOLIO.single].forEach(x => { LABEL_OF[x.ticker] = x.label; });
// Tickers always display in upper case, whatever the stored label's casing.
const labelOf = (t) => (LABEL_OF[t] || t || '').toUpperCase();

// The portfolios shown in Comparison: the current book (Summit) plus every
// portfolio submitted from Paper.
function comparePortfolios() {
  return [
    { label: 'Summit (actual)', items: portItems(), fixed: true },
    ...submits.map((s) => ({ label: s.label, items: [...s.passive, ...s.single], id: s.id })),
  ];
}
const subDel = (p) => (p.fixed ? ''
  : `<button class="pm-subdel" data-submit-del="${esc(p.id)}" title="Quitar de la comparación" aria-label="Quitar">&times;</button>`);

// Portfolio-level summary: one row per portfolio, weighted PEG / growth / multiple
// / beta / avg corr.
function cmpSummary(portfolios, m) {
  const f2 = (v) => (v == null ? '&mdash;' : v.toFixed(2));
  const f1 = (v, u = '') => (v == null ? '&mdash;' : v.toFixed(1) + u);
  const rows = portfolios.map((p) => {
    const st = weightedStats(p.items);
    return `<tr class="${p.fixed ? 'pm-cmp-cur' : ''}">
        <td class="tk">${esc(p.label)}${subDel(p)}</td>
        <td class="num pm-peg">${f2(st.peg)}</td>
        <td class="num">${f1(st.growth, '%')}</td>
        <td class="num">${f1(st.mult, 'x')}</td>
        <td class="num">${f2(portBeta(p.items).beta)}</td>
        <td class="num">${f2(avgCorr(p.items, m))}</td>
      </tr>`;
  }).join('');
  return `<div class="card"><table>
      <thead><tr>
        <th>Portafolio</th><th>Weighted PEG</th><th>Growth</th><th>Fwd Multiple</th><th>Beta</th><th>Corr prom.</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="pm-note"><b>Summit (actual)</b> es el libro actual; las dem&aacute;s filas son los portafolios que enviaste con
      <b>Submit</b> desde el subtab <b>Paper</b> (&times; para quitar). PEG / crecimiento / m&uacute;ltiplo usan la m&eacute;trica
      y a&ntilde;o de arriba; <b>Beta</b> = promedio ponderado (cash y nombres sin historial cuentan &beta; 0); <b>Corr prom.</b>
      = correlaci&oacute;n promedio entre pares (retornos mensuales, ventana 5A).</p>`;
}

// Per-holding detail: rows = every name across the compared portfolios. Left block
// = each portfolio's weight for the name (— where absent, so the differences are
// explicit); right block = the name's own metrics (β, PEG, growth, fwd multiple),
// which are stock-level so they're shown once. A Cash footer shows what each book
// leaves short of 100%.
function cmpDetail(portfolios) {
  // weight map + typed-weight sum per portfolio
  portfolios.forEach((p) => {
    p.w = {}; p.sum = 0;
    p.items.forEach((it) => {
      const t = (it.ticker || '').toUpperCase(); const w = num(it.weight);
      if (!t) return; p.w[t] = w; if (w && w > 0) p.sum += w;
    });
  });
  // name order: Summit's names first, then any submit-only names as they appear
  const order = [], seen = new Set();
  portfolios.forEach((p) => p.items.forEach((it) => {
    const t = (it.ticker || '').toUpperCase();
    if (t && !seen.has(t)) { seen.add(t); order.push(t); }
  }));

  const f2 = (v) => (v == null ? '&mdash;' : v.toFixed(2));
  const f1 = (v, u = '') => (v == null ? '&mdash;' : v.toFixed(1) + u);
  const head = `<tr>
      <th>Name</th>
      ${portfolios.map((p) => `<th class="num">${esc(p.label)}${subDel(p)}</th>`).join('')}
      <th class="num msep">Beta</th><th class="num">PEG</th><th class="num">Growth</th><th class="num">Fwd Mult</th>
    </tr>`;
  const body = order.map((t) => {
    const g = growthFor(t);
    const gCls = g == null ? '' : (g >= 0 ? 'up' : 'dn');
    return `<tr>
      <td class="tk">${esc(labelOf(t) || t)}</td>
      ${portfolios.map((p) => { const w = p.w[t]; return `<td class="num${w == null ? ' muted' : ''}">${w == null ? '&mdash;' : w.toFixed(1) + '%'}</td>`; }).join('')}
      <td class="num msep">${f2(betaOf(t).beta)}</td>
      <td class="num pm-peg">${f2(pegFor(t, g))}</td>
      <td class="num pm-growth ${gCls}">${f1(g, '%')}</td>
      <td class="num">${f1(multFor(t), 'x')}</td>
    </tr>`;
  }).join('');
  const cashRow = `<tr class="pm-cash"><td class="tk">Cash</td>${portfolios.map((p) =>
    `<td class="num">${(100 - p.sum).toFixed(1)}%</td>`).join('')}<td class="msep"></td><td></td><td></td><td></td></tr>`;

  return `<div class="card"><table class="pm-cmpdetail">
      <thead>${head}</thead>
      <tbody>${body || `<tr><td colspan="${portfolios.length + 5}" class="pm-empty">Sin posiciones.</td></tr>`}</tbody>
      <tfoot>${cashRow}</tfoot>
    </table></div>
    <p class="pm-note">Columnas de peso: cuánto tiene cada portafolio de ese nombre (<b>&mdash;</b> = no lo tiene). A la derecha,
      métricas de la acción (iguales en todos): <b>Beta</b> (con la metodología de cada nombre del tab Beta), <b>PEG</b> /
      <b>Growth</b> / <b>Fwd Mult</b> según la métrica y año elegidos arriba. <b>Cash</b> = lo que falta para 100%.</p>`;
}

function blendedBody() {
  const m = { freq: 'monthly', amt: 5, unit: 'y' };   // fixed method for the corr summary
  const ps = comparePortfolios();
  return `
    ${metricBar()}
    <div class="pm-cmpview"><div class="pm-seg">
      <button data-cmpview="summary" class="${cmpView === 'summary' ? 'on' : ''}">Resumen</button>
      <button data-cmpview="detail" class="${cmpView === 'detail' ? 'on' : ''}">Detalle por holding</button>
    </div></div>
    ${cmpView === 'detail' ? cmpDetail(ps) : cmpSummary(ps, m)}`;
}

function renderBlended() {
  const el = document.getElementById('pm-sub-blended');
  if (el) el.innerHTML = blendedBody();
}

// Both subtabs read the same metric/year/basis state, so a change to any of them
// has to repaint both — the hidden one included, or it comes back stale.
function renderAll() {
  renderPortfolio();
  const el = document.getElementById('pm-an-peg-paper');
  if (el) el.innerHTML = paperTable();
  renderBlended();
}

// Recompute the footer of whichever table the row belongs to, in place — typing a
// weight or a multiple moves the aggregate, and a full repaint would steal focus.
// The benchmark card has no footer, so the guard covers it.
function refreshFooter(tr) {
  const table = tr.closest('table');
  if (!table) return;
  if (table.dataset.side === 'paper') {
    const foot = table.querySelector('tfoot');
    if (foot) foot.innerHTML = footRows(paperItems(), 1);   // Paper keeps cash + wavg in the foot
    return;
  }
  if (table.dataset.side === 'pf') { refreshPfFooter(table.dataset.pf); return; }
  // Summit: the weighted average lives in the top summary row, cash in the foot.
  renderBookSummary();
  refreshBookFoot();
}

// Recompute the growth + PEG cells of one row in place (keeps input focus).
function refreshComputed(tr) {
  const t = tr.dataset.ticker;
  const g = growthFor(t);
  const peg = pegFor(t, g);
  const gEl = tr.querySelector('.pm-growth');
  const pEl = tr.querySelector('.pm-peg');
  if (gEl) {
    gEl.textContent = g === null ? '—' : g.toFixed(1) + '%';
    gEl.classList.toggle('up', g !== null && g >= 0);
    gEl.classList.toggle('dn', g !== null && g < 0);
  }
  if (pEl) pEl.textContent = peg === null ? '—' : peg.toFixed(2);
}

// ── Live quotes ──────────────────────────────────────────────────────────────
function pLimit(n) {
  let active = 0; const q = [];
  const next = () => {
    if (active >= n || !q.length) return;
    active++; const { fn, res, rej } = q.shift();
    fn().then(res, rej).finally(() => { active--; next(); });
  };
  return (fn) => new Promise((res, rej) => { q.push({ fn, res, rej }); next(); });
}

let _rerenderTimer = null;
function scheduleRerender() {
  if (_rerenderTimer) return;
  _rerenderTimer = setTimeout(() => {
    _rerenderTimer = null;
    // Don't repaint out from under someone mid-edit — covers the Paper ticker and
    // weight fields as well as the metric inputs. The repaint waits for the blur.
    const ae = document.activeElement;
    const editing = ae && ae.classList &&
      (ae.classList.contains('pm-minp') || ae.classList.contains('pm-inp'));
    if (editing) { scheduleRerender(); return; }
    renderAll();
  }, 120);
}

// liveQuote returns market cap / EV / net debt in absolute currency units; the rest
// of this tab (and SUMMIT_FUND) works in millions. Normalise once, here. Price is
// per-share and stays as-is.
function toMM(d) {
  if (!d) return d;
  const mm = (v) => (typeof v === 'number' && Number.isFinite(v)) ? v / 1e6 : null;
  return { ...d, marketCap: mm(d.marketCap), ev: mm(d.ev), netDebt: mm(d.netDebt) };
}

const _limit = pLimit(3);

// Fetch a ticker's quote once. Presence of the key means "already asked", so a
// name typed twice in Paper — or one that's also in the book — costs one call.
function ensureQuote(t) {
  if (!t || t in quotes) return;
  quotes[t] = null;
  _limit(() => liveQuote(QUOTE_TICKER[t] || t)
    .then(r => { quotes[t] = (r && r.success) ? toMM(r.data) : null; scheduleRerender(); })
    .catch(() => {}));
}

function fetchQuotes() {
  [...BOOK_SEED, BENCHMARK].forEach(x => ensureQuote(x.ticker));
  bookExtra.map(paperTicker).filter(Boolean).forEach(ensureQuote);
  paperTickers().forEach(ensureQuote);
  portfolios.forEach((p) => pfItems(p).forEach((it) => it.ticker && ensureQuote(it.ticker)));
}

// Paper tickers are typed, so quotes are fetched on a debounce rather than per
// keystroke — otherwise "AMZN" would fire four lookups on the way in.
let _paperQuoteTimer = null;
function schedulePaperQuotes() {
  if (_paperQuoteTimer) clearTimeout(_paperQuoteTimer);
  _paperQuoteTimer = setTimeout(() => {
    _paperQuoteTimer = null;
    paperTickers().forEach(ensureQuote);
  }, 600);
}
// Same debounce for book tickers added via + Add.
let _bookQuoteTimer = null;
function scheduleBookQuotes() {
  if (_bookQuoteTimer) clearTimeout(_bookQuoteTimer);
  _bookQuoteTimer = setTimeout(() => {
    _bookQuoteTimer = null;
    bookExtra.map(paperTicker).filter(Boolean).forEach(ensureQuote);
  }, 600);
}
// Same debounce for tickers typed into any user-built portfolio.
let _pfQuoteTimer = null;
function schedulePfQuotes() {
  if (_pfQuoteTimer) clearTimeout(_pfQuoteTimer);
  _pfQuoteTimer = setTimeout(() => {
    _pfQuoteTimer = null;
    portfolios.forEach((p) => pfItems(p).forEach((it) => it.ticker && ensureQuote(it.ticker)));
  }, 600);
}

// ── Paper subtab: manually-built book ────────────────────────────────────────
function savePaper() { saveJSON(PAPER_KEY, paper); }

// Prefill the Paper book from a real book — Summit's own or a superinvestor's —
// so you start from a full set of names and edit from there instead of adding them
// one by one. A book is { passive, single } of { ticker, weight }; weights are
// typed percents and a missing one is left blank to fill in.
const pfRows = (arr) => (arr || []).map((h) => ({
  ticker: h.ticker, weight: h.weight == null || h.weight === '' ? '' : String(h.weight),
}));

// Summit's own book, carrying whatever book weights are currently set.
const summitBook = () => ({
  passive: PORTFOLIO.passive.map((x) => ({ ticker: x.ticker, weight: portWeights[x.ticker] ?? '' })),
  single:  PORTFOLIO.single.map((x)  => ({ ticker: x.ticker, weight: portWeights[x.ticker] ?? '' })),
});

// Teammates' model books — provided by the team, all individual names. Weights are
// percent of book. Edit here to update a teammate's prefill.
const TEAM_BOOKS = {
  pvg: { label: 'PVG', single: [
    { ticker: 'SE', weight: 15 }, { ticker: 'AFRM', weight: 10 }, { ticker: 'PGY', weight: 8.5 },
    { ticker: 'KKR', weight: 8 }, { ticker: 'EAT', weight: 5 }, { ticker: 'ADBE', weight: 4.5 },
    { ticker: 'WRBY', weight: 2.2 },
  ] },
  sab: { label: 'SAB', single: [
    { ticker: 'GRAB', weight: 27.3 }, { ticker: 'SN', weight: 22.5 },
    { ticker: 'RDDT', weight: 13 }, { ticker: 'ONON', weight: 10 },
  ] },
};
const teamBook = (key) => ({ passive: [], single: TEAM_BOOKS[key].single });

// A superinvestor's latest-snapshot holdings (INVESTORS[].holdings: {t, w}). They
// are individual names, so everything lands under Single Stock.
function investorBook(key) {
  const inv = (INVESTORS || []).find((x) => x.key === key);
  const holds = (inv && inv.holdings) || [];
  return { label: inv ? inv.name : key, passive: [], single: holds.map((h) => ({ ticker: h.t, weight: h.w })) };
}

// Replace the Paper book with a source (confirm first if it already has edits).
function applyPrefill(label, next) {
  const hasContent = paper.passive.length || paper.single.length;
  if (hasContent && !confirm(`¿Reemplazar las posiciones actuales del Paper con las de ${label}?`)) return;
  paper.passive = pfRows(next.passive);
  paper.single  = pfRows(next.single);
  savePaper();
  paperSource = label;                     // remember what's loaded (shown in the bar)
  saveJSON(PAPER_SRC_KEY, paperSource);
  renderPaperHeader();
  // Prefilling a whole book flows its names into the Paper correlation matrix too:
  // reset it to mirror the book (drops any earlier per-matrix name customisation).
  corrMatrixNames = null;
  saveJSON(CORR_MNAMES_KEY, corrMatrixNames);
  renderPaperBody();
  refreshPaperFoot();
  schedulePaperQuotes();   // pull quotes for the freshly-added names
  renderBeta();            // beta table + portfolio β follow the paper book
  renderBlended();         // Before/After comparison too
  renderCorr();            // Paper matrix mirrors the new book
}

// Paper-subtab header (above the PEG/Beta/Correlations tabs): prefill selector, the
// currently-loaded source, a name field, and Submit (snapshots the book into
// Comparison). Always visible while working in Paper, from any analysis tab.
function paperHeader() {
  const invs = (INVESTORS || []).filter((x) => x.key !== 'summit' && x.holdings && x.holdings.length);
  const invSel = paperSource && invs.some((x) => x.name === paperSource);
  return `<div class="pm-paperbar">
      <span class="lbl">Prellenar con</span>
      <button class="pm-pf${paperSource === 'Summit' ? ' on' : ''}" data-prefill="summit">Summit</button>
      ${Object.keys(TEAM_BOOKS).map((k) => `<button class="pm-pf${paperSource === TEAM_BOOKS[k].label ? ' on' : ''}" data-prefill="${esc(k)}">${TEAM_BOOKS[k].label}</button>`).join('')}
      <button class="pm-pf${paperSource === null ? ' on' : ''}" data-prefill="blank" title="Empezar desde cero (Paper vacío)">New</button>
      <select class="pm-pf-sel${invSel ? ' on' : ''}" data-prefill-inv aria-label="Prellenar con un superinversor">
        <option value="">Superinversor&hellip;</option>
        ${invs.map((x) => `<option value="${esc(x.key)}"${x.name === paperSource ? ' selected' : ''}>${esc(x.name)}${x.fund ? ' · ' + esc(x.fund) : ''}</option>`).join('')}
      </select>
      <span class="pm-loaded">Cargado: <b>${paperSource ? esc(paperSource) : 'manual'}</b></span>
      <span class="pm-paperbar-gap"></span>
      <input class="pm-subname" data-subname placeholder="Name" aria-label="nombre del portafolio">
      <button class="pm-submit" data-submit>Submit to compare &rarr;</button>
      ${submits.length ? `<span class="pm-subcount">${submits.length} en Comparison</span>` : ''}
    </div>`;
}
function renderPaperHeader() {
  const el = document.getElementById('pm-paper-header');
  if (el) el.innerHTML = paperHeader();
}

// Submit: snapshot the current Paper book into Comparison under a name (the field,
// else the loaded source, else "Portafolio"; de-duplicated).
function submitPaper() {
  const passive = paper.passive.filter((x) => (x.ticker || '').trim());
  const single  = paper.single.filter((x) => (x.ticker || '').trim());
  if (!passive.length && !single.length) {
    alert('El Paper está vacío — prellena o agrega posiciones antes de enviar a Comparison.');
    return;
  }
  const inp = document.querySelector('[data-subname]');
  const base = ((inp && inp.value.trim()) || paperSource || 'Portafolio');
  let label = base, i = 2;
  while (submits.some((s) => s.label === label)) label = `${base} (${i++})`;
  submits.push({
    id: 'sub' + Date.now() + Math.floor(Math.random() * 1000),
    label,
    passive: passive.map((x) => ({ ticker: x.ticker, weight: x.weight })),
    single:  single.map((x) => ({ ticker: x.ticker, weight: x.weight })),
  });
  saveJSON(SUBMITS_KEY, submits);
  renderPaperHeader();   // updates the count and clears the name field
  renderBlended();       // Comparison now includes it
}
function removeSubmit(id) {
  submits = submits.filter((s) => s.id !== id);
  saveJSON(SUBMITS_KEY, submits);
  renderPaperHeader();
  renderBlended();
}

// Start from scratch: empty the Paper book (confirm if it has positions), then
// build it up with + Add. The correlation matrix reverts to mirroring the (empty) book.
function clearPaperBook() {
  const hasContent = paper.passive.length || paper.single.length;
  if (hasContent && !confirm('¿Vaciar el Paper y empezar desde cero?')) return;
  paper.passive = [];
  paper.single = [];
  savePaper();
  paperSource = null; saveJSON(PAPER_SRC_KEY, paperSource);
  corrMatrixNames = null; saveJSON(CORR_MNAMES_KEY, corrMatrixNames);
  renderPaperHeader();
  renderPaperBody();
  refreshPaperFoot();
  renderBeta();
  renderBlended();
  renderCorr();
}

// Typed tickers are normalised to upper case for every lookup (quotes, SUMMIT_FUND,
// saved metric values) while the input keeps whatever the user actually typed.
const paperTicker = (item) => (item.ticker || '').trim().toUpperCase();
const paperTickers = () => [...paper.passive, ...paper.single].map(paperTicker).filter(Boolean);

// A paper row is a book row with the first two columns made editable: the ticker
// drives everything to its right, so once you type a name Summit covers, the
// multiple and metric values fill in exactly as they do in the Portfolio table.
function paperRow(group, item, idx) {
  const t = paperTicker(item);
  const tkTd = `<td><input class="pm-inp pm-tk" data-field="ticker" value="${esc(item.ticker)}" placeholder="Ticker">${fyBadge(t)}</td>`;
  const wtTd = `<td><input class="pm-inp pm-wt" data-field="weight" value="${esc(item.weight)}" placeholder="0.0"> <span class="muted">%</span></td>`;
  // Nothing to look up until a ticker is typed — dash the rest of the row.
  const rest = t ? quoteCells(t) + metricCells(t) : DASH.repeat(colSpan() - 2);
  return `<tr data-group="${group}" data-idx="${idx}" data-ticker="${t}">
    ${tkTd}${wtTd}${rest}
    <td class="pm-actions"><button class="pm-del" title="Remove">&times;</button></td>
  </tr>`;
}

function paperGroup(label, group) {
  const items = paper[group];
  const span = colSpan(1);
  const rows = items.length
    ? items.map((it, i) => paperRow(group, it, i)).join('')
    : `<tr><td colspan="${span}" class="pm-empty">No positions yet &mdash; use + Add below.</td></tr>`;
  return `<tr class="grp"><td colspan="${span}">${label}</td></tr>` + rows +
    `<tr><td colspan="${span}"><button class="pm-add" data-add="${group}">+ Add</button></td></tr>`;
}

function paperTable() {
  return `
    ${metricBar()}
    ${quoteToggle()}
    <div class="card">
      <table data-side="paper">
        <thead>${headRow('<th></th>')}</thead>
        <tbody id="pm-paper-body">
          ${paperGroup('Passive', 'passive')}
          ${paperGroup('Single Stock', 'single')}
        </tbody>
        <tfoot id="pm-paper-foot">${footRows(paperItems(), 1)}</tfoot>
      </table>
    </div>
    ${quoteNote()}
    ${metricNote()}
    ${benchmarkTable()}`;
}

function renderPaperBody() {
  const body = document.getElementById('pm-paper-body');
  if (!body) return;
  body.innerHTML = paperGroup('Passive', 'passive') + paperGroup('Single Stock', 'single');
}

function refreshPaperFoot() {
  const foot = document.getElementById('pm-paper-foot');
  if (foot) foot.innerHTML = footRows(paperItems(), 1);
}

// ── Shell + wiring ───────────────────────────────────────────────────────────
export function loadPortfolioMetricsPage() {
  const root = document.getElementById('pm-root');
  if (!root) return;

  root.innerHTML = `
  <div class="pm-wrap">
    <div class="topbar"><h2>Portfolio Metrics</h2></div>
    <p class="sub">Portfolio holdings across passive and single-stock positions.</p>

    <div class="pm-subnav">
      <button class="pm-pill active" data-sub="portfolio">Summit</button>
      <button class="pm-pill" data-sub="paper">Paper</button>
      <button class="pm-pill" data-sub="blended">Comparison</button>
      <button class="pm-pill" data-sub="corr">Correlation</button>
    </div>

    <div class="pm-sub active" id="pm-sub-portfolio">
      <div id="pm-an-peg">${portfolioTable()}</div>
    </div>
    <div class="pm-sub" id="pm-sub-paper">
      <div id="pm-paper-header">${paperHeader()}</div>
      <div id="pm-an-peg-paper">${paperTable()}</div>
    </div>
    <div class="pm-sub" id="pm-sub-blended">${blendedBody()}</div>
    <div class="pm-sub" id="pm-sub-corr">
      <div id="pm-an-corr">${corrBlock('metrics')}</div>
    </div>
  </div>
  ${betaModal()}`;

  wire(root);
  fetchQuotes();

  // Esc closes the beta chart modal — registered once for the session.
  if (!window.__pmBetaEsc) {
    window.__pmBetaEsc = true;
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBetaChart(); });
  }
}

function wire(root) {
  root.addEventListener('click', (e) => {
    // Top-tab switch (Summit / Paper / Comparison / Correlation)
    const pill = e.target.closest('.pm-pill');
    if (pill) {
      const sub = pill.dataset.sub;
      root.querySelectorAll('.pm-pill').forEach(p => p.classList.toggle('active', p === pill));
      root.querySelectorAll('.pm-sub').forEach(s => s.classList.toggle('active', s.id === 'pm-sub-' + sub));
      // Refresh Correlation on open so the matrix reflects the current book / weights.
      if (sub === 'corr') renderCorr();
      return;
    }
    // Summit segment header → collapse/expand the holdings (only the weighted-average
    // row survives when collapsed). Toggle a class rather than repaint the table.
    const bc = e.target.closest('[data-book-collapse]');
    if (bc) {
      bookCollapsed = !bookCollapsed;
      saveJSON(BOOK_COLLAPSE_KEY, bookCollapsed);
      const seg = bc.closest('.pm-seg');
      if (seg) seg.classList.toggle('is-collapsed', bookCollapsed);
      bc.setAttribute('aria-expanded', String(!bookCollapsed));
      bc.title = bookCollapsed ? 'Expand holdings' : 'Collapse to weighted average';
      return;
    }
    // Beta cell → open the historical (rolling) beta chart for that name
    const bcell = e.target.closest('.pm-beta-cell');
    if (bcell && bcell.dataset.bt) { openBetaChart(bcell.dataset.bt); return; }
    // Method tag → expand/collapse that name's method strip (accordion: one open)
    const bopen = e.target.closest('[data-bopen]');
    if (bopen) {
      betaOpen = (betaOpen === bopen.dataset.bopen) ? null : bopen.dataset.bopen;
      renderBeta();
      return;
    }
    // Per-name method: frequency
    const mf = e.target.closest('.pm-mstrip button[data-mfreq]');
    if (mf) {
      const t = mf.closest('.pm-mstrip').dataset.mtk;
      setBetaOverride(t, { freq: mf.dataset.mfreq });
      if (mf.dataset.mfreq === 'daily' && dailyState !== 'ready') ensureDaily();
      renderBeta(); renderBlended();
      return;
    }
    // Per-name method: lookback unit (months / years)
    const mu = e.target.closest('.pm-mstrip button[data-munit]');
    if (mu) {
      setBetaOverride(mu.closest('.pm-mstrip').dataset.mtk, { unit: mu.dataset.munit });
      renderBeta(); renderBlended();
      return;
    }
    // Per-name method: lookback preset (e.g. "3y")
    const mp = e.target.closest('.pm-mstrip button[data-mpreset]');
    if (mp) {
      const v = mp.dataset.mpreset;
      setBetaOverride(mp.closest('.pm-mstrip').dataset.mtk, { amt: Number(v.slice(0, -1)), unit: v.slice(-1) });
      renderBeta(); renderBlended();
      return;
    }
    // Per-name method: reset to the global default
    const mr = e.target.closest('.pm-mstrip [data-mreset]');
    if (mr) {
      const t = mr.closest('.pm-mstrip').dataset.mtk;
      delete betaOverrides[t]; saveJSON(BETA_METHOD_KEY, betaOverrides);
      renderBeta(); renderBlended();
      return;
    }
    // Correlations subtab switch (Matrix / …)
    const ct = e.target.closest('.pm-ctab');
    if (ct) { corrSub = ct.dataset.ct; renderCorr(); return; }
    // Correlation matrix: frequency
    const cf = e.target.closest('.pm-seg button[data-cfreq]');
    if (cf) {
      corrFreq = cf.dataset.cfreq;
      if (corrFreq === 'daily' && dailyState !== 'ready') ensureDaily();
      renderCorr();
      return;
    }
    // Correlation matrix: window unit
    const cu = e.target.closest('.pm-seg button[data-cunit]');
    if (cu) { corrUnit = cu.dataset.cunit; renderCorr(); return; }
    // Correlation matrix: window preset
    const cp = e.target.closest('.pm-seg button[data-cpreset]');
    if (cp) {
      const v = cp.dataset.cpreset;
      corrAmt = Number(v.slice(0, -1)); corrUnit = v.slice(-1);
      renderCorr();
      return;
    }
    // Correlation matrix: click a cell (or a row/column label) to shade its whole
    // row and column. Toggled per table via a DOM class, so scroll isn't reset.
    const cCell = e.target.closest('.pm-cmatrix [data-r], .pm-cmatrix [data-c]');
    if (cCell) {
      const table = cCell.closest('table.pm-cmatrix');
      // A row label has only data-r, a column label only data-c; a body cell both.
      // Map a label to the ticker's own cross (its row and its matching column).
      let R = cCell.dataset.r, C = cCell.dataset.c;
      if (R == null) R = C;
      if (C == null) C = R;
      const key = `${R}:${C}`;
      table.querySelectorAll('.sel').forEach((el) => el.classList.remove('sel'));
      if (table.dataset.sel === key) {
        table.dataset.sel = '';                     // clicking the same cell clears it
      } else {
        table.dataset.sel = key;
        table.querySelectorAll(`[data-r="${R}"], [data-c="${C}"]`).forEach((el) => el.classList.add('sel'));
      }
      return;
    }
    // Paper matrix: remove a name (chip ×)
    const cnDel = e.target.closest('[data-cname-del]');
    if (cnDel) { delCorrName(cnDel.dataset.cnameDel); return; }
    // Close the beta chart modal (× button, or a click on the dimmed backdrop)
    if (e.target.closest('[data-bm-close]') ||
        (e.target.classList && e.target.classList.contains('pm-beta-ov'))) {
      closeBetaChart();
      return;
    }
    // Metric selector — click active one again to turn it off
    const mbtn = e.target.closest('.pm-seg button[data-metric]');
    if (mbtn) {
      // A metric is always on — clicking the active one again is a no-op, not an
      // "off". The tables never sit in a state with no metric to read.
      const m = mbtn.dataset.metric;
      // "Cash" is a group of CFO/FCF — land on the one already chosen, else CFO by
      // default; the Basis sub-toggle then switches between them.
      metricSel = (m === 'cash') ? (isCashMetric() ? metricSel : 'cfo') : m;
      renderAll();
      return;
    }
    // Cash basis sub-toggle (CFO vs FCF) — each is a real metric under the hood
    const cbtn = e.target.closest('.pm-seg button[data-cash]');
    if (cbtn) {
      metricSel = cbtn.dataset.cash;
      renderAll();
      return;
    }
    // Estimate source (Summit model vs street consensus)
    const sbtn = e.target.closest('.pm-seg button[data-source]');
    if (sbtn) {
      source = sbtn.dataset.source;
      renderAll();
      return;
    }
    // Earnings basis sub-toggle (absolute vs per share)
    const bbtn = e.target.closest('.pm-seg button[data-basis]');
    if (bbtn) {
      earnBasis = bbtn.dataset.basis;
      renderAll();
      return;
    }
    // Multiple period (the forward multiple's denominator)
    const multBtn = e.target.closest('.pm-seg button[data-mult]');
    if (multBtn) {
      if (multBtn.disabled) return;        // NTM is disabled until it has a real feed
      multSel = multBtn.dataset.mult;
      renderAll();
      return;
    }
    // Columns toggle — show / hide the Price + Market Cap columns (persisted)
    const qbtn = e.target.closest('[data-togglequote]');
    if (qbtn) {
      showQuote = !showQuote;
      saveJSON(QUOTE_COLS_KEY, showQuote);
      renderAll();
      return;
    }
    // Paper: prefill the book from Summit or a teammate's model book
    const pf = e.target.closest('[data-prefill]');
    if (pf) {
      const k = pf.dataset.prefill;
      if (k === 'blank') clearPaperBook();
      else if (k === 'summit') applyPrefill('Summit', summitBook());
      else if (TEAM_BOOKS[k]) applyPrefill(TEAM_BOOKS[k].label, teamBook(k));
      return;
    }
    // Paper: submit the current book as a snapshot into Comparison
    if (e.target.closest('[data-submit]')) { submitPaper(); return; }
    // Comparison: remove a submitted portfolio
    const sdel = e.target.closest('[data-submit-del]');
    if (sdel) { removeSubmit(sdel.dataset.submitDel); return; }
    // Comparison: switch between summary and per-holding detail
    const cv = e.target.closest('[data-cmpview]');
    if (cv) { cmpView = cv.dataset.cmpview; renderBlended(); return; }
    // New portfolio: toggle the source chooser open/closed.
    const npt = e.target.closest('[data-newpf-toggle]');
    if (npt) { newPfOpen = !newPfOpen; renderPortfolio(); return; }
    // New portfolio: create one from a chosen source (blank / Summit / a team book).
    const npf = e.target.closest('[data-newpf]');
    if (npf) { addPortfolio(npf.dataset.newpf); return; }
    // Portfolio: collapse / expand its holdings (summary row stays visible).
    const pfc = e.target.closest('[data-pf-collapse]');
    if (pfc) {
      const p = pfFind(pfc.dataset.pfCollapse);
      if (p) {
        p.collapsed = !p.collapsed;
        savePortfolios();
        const seg = pfc.closest('.pm-seg');
        if (seg) seg.classList.toggle('is-collapsed', p.collapsed);
        pfc.setAttribute('aria-expanded', String(!p.collapsed));
      }
      return;
    }
    // Portfolio: delete the whole portfolio (its × sits in the summary row).
    const pfd = e.target.closest('[data-pf-del]');
    if (pfd) {
      const p = pfFind(pfd.dataset.pfDel);
      if (p && confirm(`¿Eliminar el portafolio "${p.name}"?`)) {
        portfolios = portfolios.filter((x) => x.id !== p.id);
        savePortfolios();
        renderPortfolio(); renderBeta(); renderBlended();
      }
      return;
    }
    // Portfolio: add a holding row.
    const pfa = e.target.closest('[data-pf-add]');
    if (pfa) {
      const p = pfFind(pfa.dataset.pfAdd);
      if (p) { (p.holdings ||= []).push({ ticker: '', weight: '' }); savePortfolios(); renderPfBody(p.id); refreshPfFooter(p.id); }
      return;
    }
    // Portfolio: remove a holding row (its × lives on a data-pf row).
    const pfRowDel = e.target.closest('.pm-del');
    if (pfRowDel && pfRowDel.closest('tr') && pfRowDel.closest('tr').dataset.pf !== undefined) {
      const tr = pfRowDel.closest('tr'), p = pfFind(tr.dataset.pf);
      if (p) {
        p.holdings.splice(Number(tr.dataset.idx), 1);
        savePortfolios();
        renderPfBody(p.id); refreshPfFooter(p.id);
        renderBlended(); renderBeta();
      }
      return;
    }
    // Book: add a ticker row to the Summit book
    const bookAdd = e.target.closest('[data-book-add]');
    if (bookAdd) {
      bookExtra.push({ ticker: '', weight: '' });
      saveBookExtra();
      renderBookBody();
      renderBookSummary();
      refreshBookFoot();
      return;
    }
    // Book: remove an added ticker row
    const bookDel = e.target.closest('.pm-del');
    if (bookDel && bookDel.closest('tr') && bookDel.closest('tr').dataset.group === 'book') {
      bookExtra.splice(Number(bookDel.closest('tr').dataset.idx), 1);
      saveBookExtra();
      renderBookBody();
      renderBookSummary();
      refreshBookFoot();
      renderBlended(); renderBeta();
      return;
    }
    // Paper: add row
    const add = e.target.closest('.pm-add');
    if (add) {
      paper[add.dataset.add].push({ ticker: '', weight: '' });
      savePaper();
      renderPaperBody();
      refreshPaperFoot();
      return;
    }
    // Paper: remove row
    const del = e.target.closest('.pm-del');
    if (del) {
      const tr = del.closest('tr');
      paper[tr.dataset.group].splice(Number(tr.dataset.idx), 1);
      savePaper();
      renderPaperBody();
      refreshPaperFoot();
      renderCorr();      // Paper matrix follows the book while it mirrors it
      return;
    }
  });

  root.addEventListener('input', (e) => {
    // Per-name window field (inside a method strip) — update that name's override.
    // Held until commit (change/blur) so the field keeps focus and cursor.
    const mwin = e.target.closest('.pm-mwin');
    if (mwin) {
      const t = mwin.closest('.pm-mstrip').dataset.mtk;
      const v = parseInt(mwin.value, 10);
      if (Number.isFinite(v) && v > 0) setBetaOverride(t, { amt: v });
      return;   // hold repaint until commit (change/blur) so the field keeps focus
    }
    // Correlation matrix window field — hold repaint until commit, as above.
    const cwin = e.target.closest('.pm-cwin');
    if (cwin) {
      const v = parseInt(cwin.value, 10);
      if (Number.isFinite(v) && v > 0) corrAmt = v;
      return;
    }
    // Renaming a user-built portfolio (its name field lives in the summary row).
    const pfName = e.target.closest('[data-pf-name]');
    if (pfName) {
      const p = pfFind(pfName.dataset.pfName);
      if (p) { p.name = pfName.value; savePortfolios(); }
      return;
    }
    // Portfolio metric inputs (manual value or manual multiple) → save + recompute
    const minp = e.target.closest('.pm-minp');
    if (minp) {
      const tr = minp.closest('tr');
      const t = tr.dataset.ticker;
      (metricData[t] ||= {});
      if (minp.dataset.field === 'mult') {
        // The multiple is basis-independent — always stored under the metric.
        ((metricData[t][multKey()] ||= {})).mult = minp.value;
      } else {
        // Values are stored under the basis, so EPS and absolute figures don't
        // overwrite each other when the sub-toggle flips.
        const rec = (metricData[t][valueKey()] ||= {});
        (rec.byYear ||= {});
        rec.byYear[minp.dataset.period] = minp.value;
      }
      saveJSON(METRIC_KEY, metricData);
      refreshComputed(tr);
      refreshFooter(tr);
      return;
    }
    // Weight / ticker fields. Book rows carry no data-group — their weight lives
    // in portWeights keyed by ticker; Paper rows index into the paper arrays.
    const inp = e.target.closest('.pm-inp');
    if (!inp) return;
    const tr = inp.closest('tr');
    // User-built portfolio row (data-pf) — stored inline in that portfolio's holdings.
    // Checked before the group tests, since these rows carry no data-group.
    if (tr.dataset.pf !== undefined) {
      const p = pfFind(tr.dataset.pf);
      if (!p) return;
      const h = p.holdings[Number(tr.dataset.idx)];
      if (!h) return;
      h[inp.dataset.field] = inp.value;
      savePortfolios();
      if (inp.dataset.field === 'ticker') { tr.dataset.ticker = paperTicker(h); schedulePfQuotes(); }
      refreshFooter(tr);
      renderBlended();
      return;
    }
    if (tr.dataset.group === undefined) {
      portWeights[tr.dataset.ticker] = inp.value;
      saveJSON(PWEIGHT_KEY, portWeights);
      refreshFooter(tr);
      renderBlended();       // Comparison follows weights; the footer β updates via refreshFooter
      return;
    }
    // User-added book row (data-group="book") — stored inline in bookExtra, same
    // mechanics as Paper: a typed ticker drives the rest of the row.
    if (tr.dataset.group === 'book') {
      const bitem = bookExtra[Number(tr.dataset.idx)];
      if (!bitem) return;
      bitem[inp.dataset.field] = inp.value;
      saveBookExtra();
      if (inp.dataset.field === 'ticker') { tr.dataset.ticker = paperTicker(bitem); scheduleBookQuotes(); }
      refreshFooter(tr);
      renderBlended();
      return;
    }
    const item = paper[tr.dataset.group][Number(tr.dataset.idx)];
    if (!item) return;
    item[inp.dataset.field] = inp.value;
    savePaper();
    if (inp.dataset.field === 'ticker') {
      // Retarget the row now so a metric typed on it lands under the new name,
      // then go get the quote. The repaint that fills the row in follows the
      // quote arriving, and waits for this input to lose focus.
      tr.dataset.ticker = paperTicker(item);
      schedulePaperQuotes();
    }
    refreshFooter(tr);
    renderBlended();          // Comparison follows weights; the footer β updates via refreshFooter
  });

  // Commit the beta lookback field on blur / Enter, then repaint the beta panes.
  root.addEventListener('change', (e) => {
    // Growth window dropdown (FY0→FY1 · FY0→FY2 ann. · FY+1→FY2)
    const gsel = e.target.closest('[data-growth]');
    if (gsel) { growthSel = gsel.value; renderAll(); return; }
    // New portfolio prefilled from a superinvestor picked in the chooser dropdown.
    const npinv = e.target.closest('[data-newpf-inv]');
    if (npinv) {
      const key = npinv.value; npinv.value = '';   // reset so the same pick can re-fire
      if (key) addPortfolio(key);
      return;
    }
    // Paper: prefill from a superinvestor picked in the dropdown
    const pinv = e.target.closest('[data-prefill-inv]');
    if (pinv) {
      const key = pinv.value; pinv.value = '';   // reset so the same pick can re-fire
      if (key) { const book = investorBook(key); applyPrefill(book.label, book); }
      return;
    }
    if (e.target.closest('.pm-mwin')) { renderBeta(); renderBlended(); }
    if (e.target.closest('.pm-cwin')) { renderCorr(); }
    // Benchmark slot committed (change/blur) → recompute its column.
    const slot = e.target.closest('.pm-slotinp');
    if (slot) { setBenchSlot(slot); return; }
    // Paper matrix: name typed and committed (change/blur) → add it.
    const cn = e.target.closest('.pm-cnameinp');
    if (cn) { addCorrName(cn); }
  });

  // Enter commits a benchmark slot or a Paper-matrix name, like blurring the field.
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.closest('.pm-slotinp')) { e.preventDefault(); setBenchSlot(e.target); }
    else if (e.target.closest('.pm-cnameinp')) { e.preventDefault(); addCorrName(e.target); }
  });
}
