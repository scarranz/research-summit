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
// Year selector: NTM + current calendar year + next two.
const CY = new Date().getFullYear();
const YEARS = ['NTM', String(CY), String(CY + 1), String(CY + 2)];
// Massive symbol overrides for the live quote (label ticker → quote ticker).
const QUOTE_TICKER = { TSMC: 'TSM' };

let metricSel = 'ebitda';             // active metric — always one, never off
let earnBasis = 'earnings';           // 'earnings' | 'eps' — only read when metricSel === 'earnings'
let source = 'summit';                // 'summit' | 'consensus' — which estimate set feeds the table
let yearSel = String(CY + 1);         // selected "last" period; default = current+1
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

function periodInfo() {
  if (yearSel === 'NTM') return { prevKey: 'LTM', prevLabel: 'LTM', currKey: 'NTM', currLabel: 'NTM' };
  const y = parseInt(yearSel, 10);
  return {
    prevKey: String(y - 1), prevLabel: relLabel(y - 1),
    currKey: String(y),     currLabel: relLabel(y),
  };
}

// ── State (manual entries, for names Summit doesn't cover + manual multiples) ─
const METRIC_KEY = 'pm-metric-v2';
const PAPER_KEY  = 'pm-paper-v1';
const PWEIGHT_KEY = 'pm-port-weights-v1';
const BETA_METHOD_KEY = 'pm-beta-methods-v1';
const CORR_SLOTS_KEY = 'pm-corr-slots-v1';
const CORR_MNAMES_KEY = 'pm-corr-matrix-names-v1';
const PAPER_SRC_KEY = 'pm-paper-source-v1';
const SUBMITS_KEY = 'pm-submits-v1';

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
let paper = (() => { const p = loadJSON(PAPER_KEY, {}); return { passive: p.passive || [], single: p.single || [] }; })();
// Per-name beta method overrides, ticker → { freq, amt, unit }. Names without one
// use the global default (betaFreq/betaAmt/betaUnit) — see betaMethod().
let betaOverrides = loadJSON(BETA_METHOD_KEY, {});
let betaOpen = null;   // ticker whose inline method strip is expanded (accordion)
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
// = Market Cap ÷ metric. SPOT/TBBB are skipped (metric in EUR/MXN vs USD quote).
function autoMultFor(t) {
  if (!metricSel) return null;
  const rec = fundOf(t);
  if (!rec || rec.currency !== 'USD') return null;
  const mv = num(modelVal(t, metricSel, periodInfo().currKey));
  if (mv === null || mv <= 0) return null;
  const numer = metricSel === 'ebitda' ? evOf(t) : marketCapOf(t);
  if (numer === null) return null;
  return numer / mv;
}
function multFor(t) {
  const a = autoMultFor(t);
  return a !== null ? a : num(multRec(t).mult);
}
function growthFor(t) {
  const p = periodInfo();
  const a = valueFor(t, p.prevKey), b = valueFor(t, p.currKey);
  if (a === null || b === null || a === 0) return null;
  return ((b - a) / Math.abs(a)) * 100;
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

const portItems = () => [...PORTFOLIO.passive, ...PORTFOLIO.single]
  .map(x => ({ ticker: x.ticker, weight: portWeights[x.ticker] }));
const paperItems = () => [...paper.passive, ...paper.single]
  .map(x => ({ ticker: paperTicker(x), weight: x.weight }));

// Cash line + weighted-average line, sized to whichever table asks for them.
function footRows(items, extra) {
  const s = weightedStats(items);
  const pad = (n) => DASH.repeat(n);
  const tail = extra ? '<td class="pm-actions"></td>' : '';
  const over = s.cash < 0;
  const cashTd = over
    ? `<td class="num neg" title="Typed weights add to ${s.wTyped.toFixed(1)}% — over 100%. The average treats cash as 0%.">${s.cash.toFixed(1)}%</td>`
    : `<td class="num">${s.cash.toFixed(1)}%</td>`;

  const note = (label, uncovered) => uncovered > 0.05
    ? ` title="${esc(`${(100 - uncovered).toFixed(1)}% of the book priced; ${uncovered.toFixed(1)}% carries a weight but no ${label}, and is excluded.`)}"`
    : '';
  const gCls = s.growth === null ? '' : (s.growth >= 0 ? 'up' : 'dn');

  return `
    <tr class="pm-cash">
      <td class="tk">Cash</td>${cashTd}${pad(4)}${pad(5)}${tail}
    </tr>
    <tr class="pm-wavg">
      <td class="tk">Weighted avg</td>
      <td class="num">${(over ? s.wTyped : 100).toFixed(1)}%</td>
      ${pad(4)}
      <td class="msep pm-sv"${note('multiple', s.uncoveredMult)}>${s.mult === null ? '&mdash;' : fmtMult(s.mult)}</td>
      ${pad(2)}
      <td class="pm-growth ${gCls}"${note('growth', s.uncoveredG)}>${s.growth === null ? '&mdash;' : s.growth.toFixed(1) + '%'}</td>
      <td class="pm-peg">${s.peg === null ? '&mdash;' : s.peg.toFixed(2)}</td>
      ${tail}
    </tr>`;
}

// ── Portfolio rendering ──────────────────────────────────────────────────────
// Live quote columns: Price and Market Cap, plus Net Debt + EV in the base view.
// A fund has no balance sheet of its own, so those two are dashed for it rather
// than derived from an enterprise value that doesn't apply.
function quoteCells(t, fund) {
  const price = priceOf(t);
  const priceTd = `<td class="num">${price != null ? '$' + price.toFixed(2) : '&mdash;'}</td>`;
  const mcTd = `<td class="num pm-sv">${fmtUSDmm(marketCapOf(t))}</td>`;
  const tail = fund ? DASH + DASH :
    `<td class="num pm-sv">${fmtUSDmm(netDebtOf(t))}</td><td class="num pm-sv">${fmtUSDmm(evOf(t))}</td>`;
  return priceTd + mcTd + tail;
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
    ${prevTd}
    ${currTd}
    <td class="pm-growth ${gCls}">${g === null ? '&mdash;' : g.toFixed(1) + '%'}</td>
    <td class="pm-peg">${peg === null ? '&mdash;' : peg.toFixed(2)}</td>`;
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
    <td class="tk">${item.label}${fyBadge(item.ticker)}</td>
    ${baseCells(item)}
    ${metricCells(item.ticker)}
  </tr>`;
}

function portGroup(label, items, span) {
  return `<tr class="grp"><td colspan="${span}">${label}</td></tr>` +
    items.map(portRow).join('');
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

// Earnings-only sub-toggle, sitting under the metric bar: read the metric as the
// absolute figure or per share. Hidden for every other metric.
function basisBar() {
  if (metricSel !== 'earnings') return '';
  const opt = (k, label) =>
    `<button data-basis="${k}" class="${earnBasis === k ? 'on' : ''}">${label}</button>`;
  return `
    <div class="pm-metricbar pm-basisbar">
      <span class="lbl">Basis</span>
      <div class="pm-seg">${opt('earnings', 'Earnings')}${opt('eps', 'EPS')}</div>
    </div>`;
}

// Shared header row — the benchmark card reuses it so its columns stay aligned
// with the book above as the metric/year selectors change.
// Column count, so group/empty rows span the table as the selectors change.
// Ticker + Weight + quote columns (2 with a metric active, 4 without) + metric
// columns (5 or 0), and Paper adds a trailing actions column.
const colSpan = (extra) => 2 + 4 + 5 + (extra || 0);

function headRow(trailing) {
  const p = periodInfo();
  const m = METRICS[metricSel];
  return `<tr>
            <th>Ticker</th><th>Weight %</th><th>Price</th><th>Market Cap</th>
            <th>Net Debt</th><th>EV</th>
            <th class="msep">${m.mult}</th>
            <th>${metricLabel()} ${periodHead(p.prevKey)}</th>
            <th>${metricLabel()} ${periodHead(p.currKey)}</th>
            <th>Growth ${p.prevLabel}&rarr;${p.currLabel}${
              isRel(p.currKey) ? `<span class="pm-cy">${p.prevKey}&rarr;${p.currKey}</span>` : ''}</th>
            <th>PEG</th>
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
        <thead>${headRow()}</thead>
        <tbody>
          <tr data-ticker="${b.ticker}">
            <td class="tk">${b.label}${fyBadge(b.ticker)} <span class="muted">${b.name}</span></td>
            ${baseCells(b)}
            ${metricCells(b.ticker)}
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

// Metric + Year selectors, with the Earnings basis sub-toggle under them. Both
// subtabs render this bar and share the same state, so the two tables always
// describe the same metric and period.
function metricBar() {
  return `
    <div class="pm-metricbar">
      <span class="lbl">Metric</span>
      <div class="pm-seg">
        ${Object.keys(METRICS).map(k =>
          `<button data-metric="${k}" class="${metricSel === k ? 'on' : ''}">${METRICS[k].label}</button>`
        ).join('')}
      </div>
      <span class="lbl" style="margin-left:8px">Source</span>
      <div class="pm-seg">
        ${Object.keys(SOURCES).map(k =>
          `<button data-source="${k}" class="${source === k ? 'on' : ''}">${SOURCES[k].label}</button>`
        ).join('')}
      </div>
      <span class="lbl" style="margin-left:8px">Year</span>
      <div class="pm-seg">
        ${YEARS.map(y =>
          `<button data-year="${y}" class="${yearSel === y ? 'on' : ''}">${periodHead(y)}</button>`
        ).join('')}
      </div>
    </div>
    ${basisBar()}`;
}

const quoteNote = () =>
  `<p class="pm-note">Price · Market Cap · Net Debt · EV = live via Massive (api.liveQuote). Net Debt = EV − Market Cap (negative = net cash).</p>`;

function portfolioTable() {
  const span = colSpan();
  return `
    ${metricBar()}
    <div class="card">
      <table data-side="portfolio">
        <thead>${headRow()}</thead>
        <tbody>
          ${portGroup('Passive', PORTFOLIO.passive, span)}
          ${portGroup('Single Stock', PORTFOLIO.single, span)}
        </tbody>
        <tfoot>${footRows(portItems(), 0)}</tfoot>
      </table>
    </div>
    ${quoteNote()}
    ${metricNote()}
    ${benchmarkTable()}`;
}

function renderPortfolio() {
  // Repaint only the PEG pane — the nested analysis tabs (Beta / Correlations)
  // and the tab bar live in #pm-sub-portfolio around it and must survive.
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

// Portfolio β = Σ (weight_i × β_i) ÷ 100, each name at its own method. Cash and
// names with no price data contribute 0, so they drag β toward 0.
function portBeta(items) {
  let bSum = 0, wCov = 0;
  items.forEach((it) => {
    const w = num(it.weight);
    if (w === null || w <= 0) return;
    const r = betaOf(it.ticker);
    if (!r || r.beta === null) return;
    bSum += w * r.beta; wCov += w;
  });
  return { beta: wCov > 0 ? bSum / 100 : null, covered: wCov };
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

function betaBlock(side) {
  const items = side === 'paper' ? paperItems() : portItems();
  const pb = portBeta(items);
  // Whatever the weights leave short of 100% is cash — it carries no beta, so it
  // counts as β 0 in the weighted average (same treatment as the metric tables).
  const sumW = items.reduce((a, it) => { const w = num(it.weight); return a + (w && w > 0 ? w : 0); }, 0);
  const cash = 100 - sumW;

  const rows = items.map((it) => {
    const t = it.ticker;
    const r = betaOf(t);
    const m = r.method;
    const w = num(it.weight);
    const has = r.beta != null;
    const pending = m.freq === 'daily' && dailyState !== 'ready';
    const open = betaOpen === t;

    const betaCell = has
      ? `<td class="num pm-beta pm-beta-cell ${r.beta >= 1 ? 'hi' : 'lo'}" data-bt="${esc(t)}" title="Ver beta histórica &middot; n=${r.n}">${r.beta.toFixed(2)}</td>`
      : `<td class="num pm-beta muted"${pending ? ' title="Cargando historial diario…"' : ''}>${pending ? '&middot;&middot;&middot;' : '&mdash;'}</td>`;
    const methodCell = `<td class="pm-method">
        <button class="pm-mtag${m.override ? ' ov' : ''}${open ? ' open' : ''}" data-bopen="${esc(t)}"
          title="${m.override ? 'Método propio' : 'Método por defecto'} — clic para ajustar">
          ${methodTag(m)}<span class="pm-mchev">${open ? '&#9662;' : '&#9656;'}</span></button>
      </td>`;

    const rowTr = `<tr class="pm-brow${open ? ' open' : ''}">
        <td class="tk">${labelOf(t)}${m.override ? '<span class="pm-ovdot" title="Método propio"></span>' : ''}</td>
        <td class="num">${w === null ? '&mdash;' : w.toFixed(1) + '%'}</td>
        ${betaCell}${methodCell}
      </tr>`;
    const ctlTr = open ? `<tr class="pm-bctl"><td colspan="4">${methodStrip(t, m, r.n)}</td></tr>` : '';
    return rowTr + ctlTr;
  }).join('');

  return `
    ${dailyState === 'loading' ? '<div class="pm-daily-loading">Cargando historial de precios diario&hellip;</div>' : ''}
    <div class="card">
      <table>
        <thead><tr><th>Name</th><th>Weight</th><th>Beta</th><th>M&eacute;todo</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          ${cash > 0.05 ? `<tr class="pm-cash">
            <td class="tk">Cash</td>
            <td class="num">${cash.toFixed(1)}%</td>
            <td class="num muted" title="El cash no tiene beta — cuenta como β 0 en el promedio.">&beta; 0.00</td>
            <td></td>
          </tr>` : ''}
          <tr class="pm-wavg">
            <td class="tk">Portfolio &beta;</td>
            <td class="num" title="${pb.covered.toFixed(1)}% del libro tiene beta calculable${cash > 0.05 ? ` · ${cash.toFixed(1)}% es cash (β 0)` : ''}${sumW > 100 ? ` · pesos suman ${sumW.toFixed(1)}% (sobre 100%)` : ''}.">${(sumW > 100 ? sumW : 100).toFixed(1)}%</td>
            <td class="num pm-beta">${pb.beta != null ? pb.beta.toFixed(2) : '&mdash;'}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p class="pm-note">&beta; vs <b>${betaMarket()}</b>. Por defecto cada nombre usa <b>5 a&ntilde;os &middot; mensual</b>; clic en su
      etiqueta de <b>M&eacute;todo</b> para cambiar frecuencia y ventana <b>solo en esa acci&oacute;n</b> (las ajustadas se marcan
      con &bull;). &beta; = cov(activo, mercado) / var(mercado), ambos a la misma frecuencia y ventana; el &beta; del portafolio
      es el promedio ponderado por peso &mdash; efectivo y nombres sin historial cuentan como &beta; 0.</p>`;
}

function renderBeta() {
  maybeLoadDaily();
  const a = document.getElementById('pm-an-beta');
  if (a) a.innerHTML = betaBlock('metrics');
  const b = document.getElementById('pm-an-beta-paper');
  if (b) b.innerHTML = betaBlock('paper');
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

// The single reusable modal that holds the beta chart.
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
        <div class="pm-bm-body"><canvas id="pm-bm-canvas"></canvas></div>
      </div>
    </div>`;
}

let _betaChart = null;

function openBetaChart(ticker) {
  const overlay = document.getElementById('pm-beta-modal');
  if (!overlay || typeof Chart === 'undefined') return;
  const m = betaMethod(ticker);                          // the name's own method
  const noun = FREQ_NOUN[m.freq];
  const avail = (betaSeries(ticker, m.freq) || []).length - 1;   // return-periods available
  // Rolling window sized to the frequency: ~1y daily, ~1y weekly, ~2y monthly, floored.
  const target = { daily: 252, weekly: 52, monthly: 24 }[m.freq];
  const floor  = { daily: 120, weekly: 26, monthly: 12 }[m.freq];
  const win = Math.max(floor, Math.min(target, avail - 6));
  const series = rollingBeta(ticker, win, m.freq);

  document.getElementById('pm-bm-title').textContent = `${labelOf(ticker)} — Beta histórica`;
  const cur = betaOf(ticker);
  document.getElementById('pm-bm-sub').innerHTML =
    `Beta móvil de ${win} ${noun.many} vs ${betaMarket()} (${noun.label})` +
    (cur && cur.beta != null
      ? ` &middot; β actual (${methodTag(m)}) = <b>${cur.beta.toFixed(2)}</b>` : '');

  overlay.classList.add('open');
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
    : [...new Set(portItems().map((it) => (it.ticker || '').toUpperCase()).filter(Boolean))];
  const m = { freq: corrFreq, amt: Number(corrAmt), unit: corrUnit };

  if (corrFreq === 'daily' && dailyState !== 'ready') {
    return corrControls() + editor + `<div class="pm-ph">${dailyState === 'error'
      ? 'No se pudo cargar el historial diario. Reintenta seleccionando <b>Diario</b>.'
      : 'Cargando el historial de precios diario&hellip;'}</div>`;
  }
  if (tks.length < 2) return corrControls() + editor
    + `<div class="pm-ph">${side === 'paper' ? 'Agrega al menos 2 nombres a la matriz.' : 'Se necesitan al menos 2 posiciones con ticker.'}</div>`;

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
  const items = side === 'paper' ? paperItems() : portItems();
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
      <tbody>${rowsHtml || `<tr><td colspan="7" class="pm-empty">Sin posiciones.</td></tr>`}</tbody>
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
const labelOf = (t) => LABEL_OF[t] || t;

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
  const foot = table && table.querySelector('tfoot');
  if (!foot) return;
  const paperSide = table.dataset.side === 'paper';
  foot.innerHTML = footRows(paperSide ? paperItems() : portItems(), paperSide ? 1 : 0);
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
  [...PORTFOLIO.passive, ...PORTFOLIO.single, BENCHMARK].forEach(x => ensureQuote(x.ticker));
  paperTickers().forEach(ensureQuote);
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
      <button class="pm-pf${paperSource === null ? ' on' : ''}" data-prefill="blank" title="Empezar desde cero (Paper vacío)">En blanco</button>
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
    </div>

    <div class="pm-sub active" id="pm-sub-portfolio">
      <div class="pm-anav">
        <button class="pm-atab active" data-an="peg">PEG</button>
        <button class="pm-atab" data-an="beta">Beta</button>
        <button class="pm-atab" data-an="corr">Correlations</button>
      </div>
      <div class="pm-apane active" data-an="peg" id="pm-an-peg">${portfolioTable()}</div>
      <div class="pm-apane" data-an="beta" id="pm-an-beta">${betaBlock('metrics')}</div>
      <div class="pm-apane" data-an="corr" id="pm-an-corr">${corrBlock('metrics')}</div>
    </div>
    <div class="pm-sub" id="pm-sub-paper">
      <div id="pm-paper-header">${paperHeader()}</div>
      <div class="pm-anav">
        <button class="pm-atab active" data-an="peg">PEG</button>
        <button class="pm-atab" data-an="beta">Beta</button>
        <button class="pm-atab" data-an="corr">Correlations</button>
      </div>
      <div class="pm-apane active" data-an="peg" id="pm-an-peg-paper">${paperTable()}</div>
      <div class="pm-apane" data-an="beta" id="pm-an-beta-paper">${betaBlock('paper')}</div>
      <div class="pm-apane" data-an="corr" id="pm-an-corr-paper">${corrBlock('paper')}</div>
    </div>
    <div class="pm-sub" id="pm-sub-blended">${blendedBody()}</div>
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
    // Sub-tab switch (Portfolio / Paper)
    const pill = e.target.closest('.pm-pill');
    if (pill) {
      const sub = pill.dataset.sub;
      root.querySelectorAll('.pm-pill').forEach(p => p.classList.toggle('active', p === pill));
      root.querySelectorAll('.pm-sub').forEach(s => s.classList.toggle('active', s.id === 'pm-sub-' + sub));
      return;
    }
    // Analysis tab switch (PEG / Beta / Correlations) inside the Metrics subtab
    const atab = e.target.closest('.pm-atab');
    if (atab) {
      const an = atab.dataset.an;
      // Scope to this subtab's group so Metrics and Paper switch independently
      // (both carry the same PEG / Beta / Correlations tabs).
      const group = atab.closest('.pm-sub');
      group.querySelectorAll('.pm-atab').forEach(b => b.classList.toggle('active', b === atab));
      group.querySelectorAll('.pm-apane').forEach(p => p.classList.toggle('active', p.dataset.an === an));
      // Refresh Correlations on open so the Paper matrix reflects the current book
      // when it's mirroring it (no per-keystroke cost while editing the book).
      if (an === 'corr') renderCorr();
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
      metricSel = mbtn.dataset.metric;
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
    // Year selector
    const ybtn = e.target.closest('.pm-seg button[data-year]');
    if (ybtn) {
      yearSel = ybtn.dataset.year;
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
    if (tr.dataset.group === undefined) {
      portWeights[tr.dataset.ticker] = inp.value;
      saveJSON(PWEIGHT_KEY, portWeights);
      refreshFooter(tr);
      renderBlended(); renderBeta();       // portfolio β + Before/After follow weights
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
    renderBlended(); renderBeta();          // After-side β + Before/After follow weights
  });

  // Commit the beta lookback field on blur / Enter, then repaint the beta panes.
  root.addEventListener('change', (e) => {
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
