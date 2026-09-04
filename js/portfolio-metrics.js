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
  const m = METRICS[metricSel], src = SOURCES[source], onSummit = source === 'summit';
  const label = `${src.label} ${m.label}`;
  const formula = metricSel === 'ebitda' ? `EV ÷ ${label}` : `Market Cap ÷ ${label}`;
  const units = isEps()
    ? `per share, in each company's reporting currency; SPOT in EUR, TBBB in MXN`
    : `millions of each company's reporting currency; SPOT in EUR, TBBB in MXN`;
  // Which names fall through to hand-typed values depends on the source: GOOGL,
  // TSMC and the ETFs are in neither, and consensus additionally lacks CFO/FCF
  // entirely, plus TBBB (no BBG coverage) and NVDA's 2026 (its fiscal calendar).
  const isCash = metricSel === 'cfo' || metricSel === 'fcf';
  const gaps = onSummit
    ? `GOOGL, TSMC and the ETFs aren't in Summit — type those by hand.`
    : `GOOGL, TSMC, the ETFs and TBBB have no consensus in the model — type those by hand.
       NVDA starts at 2027 on its fiscal calendar, so an earlier year shows an em dash rather than a zero.`;
  // CFO/FCF under consensus are derived, not sourced — say so where it's read, not
  // only in the data file, and name what they actually answer.
  const derivedNote = (!onSummit && isCash) ? `
    <strong>${m.label} here is derived, not consensus.</strong> The model carries no street CFO or FCF
    estimate, so the marked cells are the street's EBITDA run through each company's own Summit
    ${m.label}/EBITDA conversion rate for that year. They answer "what would ${m.label} be if the street's
    EBITDA converted the way our model says it converts" — not "what does the street forecast for ${m.label}".
    SOFI is unmarked and hand-typed: Summit projects no ${m.label} for it past 2025, so there's no rate to
    derive from.` : '';
  return `<p class="pm-note">
    Metric values = ${src.note} (${units}).
    Columns are CALENDAR years, labelled by position (FY 0 = ${CY}) with the year underneath.
    A name whose fiscal year doesn't close in December is mapped to the calendar year its
    fiscal year mostly covers and carries an FY badge — NVDA's FY${CY + 2} sits in the FY+1 (${CY + 1})
    column, so every row in a column describes the same stretch of time.
    Forward years are estimates; NTM/LTM are calendar-weighted blends.
    ${m.mult} is computed live = ${formula} for USD names; SPOT/TBBB use a hand-typed multiple (metric is in EUR/MXN, quote in USD).
    ${gaps} PEG = multiple ÷ growth.${derivedNote}${isEps() ? `
    EPS = ${label} ÷ diluted shares. ${onSummit
      ? `Our Summit snapshot carries one share count per name rather than one per year, so under
         Summit EPS growth matches Earnings growth exactly — switch to Consensus, which does carry a
         count per year, to see buybacks and dilution pull the two apart.`
      : `Consensus carries a share count per year, so EPS growth and Earnings growth genuinely differ
         here — buybacks at MA and UBER, dilution at AMZN and SOFI.`}
    ${m.mult} is unchanged by this toggle: Market Cap ÷ Earnings and Price ÷ EPS are the same ratio.` : ''}
  </p>`;
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
  const el = document.getElementById('pm-sub-portfolio');
  if (el) el.innerHTML = portfolioTable();
}

// Both subtabs read the same metric/year/basis state, so a change to any of them
// has to repaint both — the hidden one included, or it comes back stale.
function renderAll() {
  renderPortfolio();
  const el = document.getElementById('pm-sub-paper');
  if (el) el.innerHTML = paperTable();
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
      <button class="pm-pill active" data-sub="portfolio">Portfolio</button>
      <button class="pm-pill" data-sub="paper">Paper</button>
    </div>

    <div class="pm-sub active" id="pm-sub-portfolio">${portfolioTable()}</div>
    <div class="pm-sub" id="pm-sub-paper">${paperTable()}</div>
  </div>`;

  wire(root);
  fetchQuotes();
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
      return;
    }
  });

  root.addEventListener('input', (e) => {
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
  });
}
