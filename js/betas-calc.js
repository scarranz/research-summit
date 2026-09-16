// Tools ▸ Betas ▸ Calculator — the beta of ANY name, with every variable exposed.
//
// There is no house default: the right method depends on the company (a recent IPO
// has no five years of monthly returns; a name that re-rated wants a shorter window),
// so the pane lays the choices side by side — the regression for the chosen method,
// a method matrix (frequency × window) to see how much the answer moves, the rolling
// beta to see how stable it has been, and the scatter behind the slope. "Submit"
// then records the chosen beta with its full method and statistics in the beta
// history (js/betas-core.js) — a new record every time, never an overwrite.
//
// Charts follow docs/CHART_ENGINE_REFERENCE.md §0: drag to zoom on both axes with
// double-click reset, legend chips that hide a series from the chart AND its table,
// and a collapsible table under each chart carrying everything drawn.

import {
  esc, fmtB, fmtPct, num, FREQS, lookTag, methodTag, monthsOf,
  getSeries, alignedReturns, windowReturns, regress, blume,
  rollingBeta, describe, historyFor, addHistory, onHistoryChange, attachBrush,
} from './betas-core.js';
import { getCurrentUser } from './auth.js';

const C_ACT = 'rgba(30,39,51,0.92)';     // navy — the measured series
const C_ADJ = '#2563EB';                 // blue — the adjusted / derived series
const C_SEL = '#1E9E62';                 // green — the beta selected for submission
const C_MKT = '#8A93A0';                 // grey — the market (β = 1)

const LOOKS = [[6, 'm'], [1, 'y'], [2, 'y'], [3, 'y'], [5, 'y'], [10, 'y']];
const INDEXES = ['SPY', 'QQQ', 'RSP', 'XLG'];

const st = {
  ticker: 'AMZN', index: 'SPY',
  freq: 'monthly', amt: 5, unit: 'y', end: '',
  rollAmt: 2, rollUnit: 'y', alpha: 0.67, anchor: 1,
  pick: 'raw', manual: '', note: '',
  loading: false, err: '', flash: '',
  data: null,              // { stock, index, key } — daily closes from Massive
  roll: { win: null, yr: null, hidden: {}, tbl: false },
  sc: { xr: null, yr: null, hidden: {}, tbl: false },
};
let root = null;
let _seq = 0;   // a render supersedes any chart build still queued from an earlier one
let charts = [];
let _alignCache = { key: '', byFreq: {} };

// ── Data ─────────────────────────────────────────────────────────────────────
async function loadData() {
  const T = st.ticker.trim().toUpperCase(), I = st.index.trim().toUpperCase();
  st.ticker = T; st.index = I;
  const key = `${T}|${I}`;
  if (st.data && st.data.key === key) return render();
  st.loading = true; st.err = '';
  render();
  try {
    const [s, m] = await Promise.all([getSeries(T), getSeries(I)]);
    if (st.ticker !== T || st.index !== I) return;   // superseded by a newer request
    st.data = { stock: s, index: m, key };
    _alignCache = { key: '', byFreq: {} };
    resetZoom();
  } catch (e) {
    st.data = null;
    st.err = e.message || String(e);
  }
  st.loading = false;
  render();
}

function aligned(freq) {
  const key = st.data ? st.data.key : '';
  if (_alignCache.key !== key) _alignCache = { key, byFreq: {} };
  if (!_alignCache.byFreq[freq]) _alignCache.byFreq[freq] = alignedReturns(st.data.stock, st.data.index, freq);
  return _alignCache.byFreq[freq];
}

// Everything the pane shows, from the current state. null when there is no data.
function compute() {
  if (!st.data) return null;
  const rets = aligned(st.freq);
  if (rets.length < 7) return { empty: true };
  const first = rets[0].prev, last = rets[rets.length - 1].date;
  const end = st.end && st.end >= first && st.end <= last ? st.end : last;
  const months = monthsOf(st.amt, st.unit);
  const w = windowReturns(rets, end, months);
  const reg = regress(w.rows, st.freq);
  const adj = blume(reg.beta, st.alpha, st.anchor);
  // Short of the window only when returns are actually missing, not when the first
  // period's date merely lands a few days after the nominal start.
  const expected = Math.round(FREQS[st.freq].ppy * months / 12);
  const clipped = w.start < first && reg.n < expected * 0.95;

  const ppy = FREQS[st.freq].ppy;
  const rollN = Math.max(6, Math.round(ppy * monthsOf(st.rollAmt, st.rollUnit) / 12));
  const roll = rollingBeta(rets, end, rollN);
  const rollAdj = roll.map((p) => ({ date: p.date, beta: blume(p.beta, st.alpha, st.anchor) }));
  const inWin = roll.filter((p) => p.date >= w.start);
  const stats = describe(inWin.map((p) => p.beta));

  const matrix = Object.keys(FREQS).map((f) => ({
    freq: f,
    cells: LOOKS.map(([a, u]) => {
      const r = regress(windowReturns(aligned(f), end, monthsOf(a, u)).rows, f);
      return { amt: a, unit: u, beta: r.beta, n: r.n };
    }),
  }));

  const picks = [
    { key: 'raw',    label: `Window beta (${methodTag(st)})`, v: reg.beta },
    { key: 'adj',    label: `Adjusted beta (α ${st.alpha}, anchor ${st.anchor})`, v: adj },
    { key: 'rlast',  label: 'Rolling beta — last', v: stats && stats.last },
    { key: 'ravg',   label: 'Rolling beta — average over the window', v: stats && stats.avg },
    { key: 'rmed',   label: 'Rolling beta — median over the window', v: stats && stats.median },
    { key: 'manual', label: 'Manual', v: num(st.manual) },
  ];
  const pick = picks.find((p) => p.key === st.pick) || picks[0];
  return { rets, first, last, end, months, w, reg, adj, clipped, rollN, roll, rollAdj, inWin, stats, matrix, picks, pick };
}

// ── Markup ───────────────────────────────────────────────────────────────────
const seg = (attr, cur, opts) => `<div class="bt-seg">${opts.map(([k, l]) =>
  `<button type="button" data-${attr}="${esc(k)}" class="${String(cur) === String(k) ? 'on' : ''}">${l}</button>`).join('')}</div>`;

function controls(c) {
  return `
  <div class="bt-card bt-ctl">
    <div class="bt-row">
      <label class="bt-f"><span>Ticker</span>
        <input class="bt-in bt-tk" data-in="ticker" value="${esc(st.ticker)}" spellcheck="false" autocomplete="off"></label>
      <label class="bt-f"><span>Index</span>
        <input class="bt-in bt-tk" data-in="index" value="${esc(st.index)}" list="bt-indexes" spellcheck="false" autocomplete="off"></label>
      <div class="bt-f"><span>Prices</span><span class="bt-srcfix">Massive · daily, split-adjusted</span></div>
      <datalist id="bt-indexes">${INDEXES.map((t) => `<option value="${t}">`).join('')}</datalist>
    </div>
    <div class="bt-row">
      <div class="bt-f"><span>Frequency</span>${seg('freq', st.freq, Object.entries(FREQS).map(([k, f]) => [k, f.label]))}</div>
      <div class="bt-f"><span>Time window</span>
        <div class="bt-inline">
          <input class="bt-in bt-num" data-in="amt" value="${esc(st.amt)}" inputmode="numeric">
          ${seg('unit', st.unit, [['m', 'Months'], ['y', 'Years']])}
          ${seg('look', `${st.amt}${st.unit}`, LOOKS.map(([a, u]) => [`${a}${u}`, lookTag(a, u)]))}
        </div></div>
      <label class="bt-f"><span>End date</span>
        <input class="bt-in" type="date" data-in="end" value="${esc(c && !c.empty ? c.end : st.end)}"
          ${c && !c.empty ? `min="${c.first}" max="${c.last}"` : ''}></label>
    </div>
    <div class="bt-row">
      <div class="bt-f"><span>Rolling beta window</span>
        <div class="bt-inline">
          <input class="bt-in bt-num" data-in="rollAmt" value="${esc(st.rollAmt)}" inputmode="numeric">
          ${seg('runit', st.rollUnit, [['m', 'Months'], ['y', 'Years']])}
        </div></div>
      <div class="bt-f"><span>Blume / Bloomberg adjustment</span>
        <div class="bt-inline">
          <span class="bt-mini">α</span><input class="bt-in bt-num" data-in="alpha" value="${esc(st.alpha)}" inputmode="decimal">
          <span class="bt-mini">anchor</span><input class="bt-in bt-num" data-in="anchor" value="${esc(st.anchor)}" inputmode="decimal">
        </div></div>
    </div>
  </div>`;
}

function statusLine(c) {
  const bits = [];
  if (c && !c.empty) {
    bits.push(`<span>Common history ${esc(c.first)} → ${esc(c.last)}</span>`);
    bits.push(`<span>Window ${esc(c.w.start)} → ${esc(c.end)} · <b>n = ${c.reg.n}</b> ${FREQS[st.freq].adj} returns</span>`);
  }
  const warns = [];
  if (c && !c.empty && c.clipped) warns.push(`The window starts ${c.w.start} but the history only starts ${c.first}: the beta uses what is available.`);
  if (c && !c.empty && c.reg.beta != null && c.reg.n < 24) warns.push(`Only ${c.reg.n} observations — the standard error is high; consider another frequency.`);
  return `<div class="bt-status">${bits.join('<span class="bt-dot">·</span>')}</div>
    ${warns.map((w) => `<div class="bt-warn">⚑ ${esc(w)}</div>`).join('')}`;
}

function kpis(c) {
  const r = c.reg;
  const tile = (h, v, sub) => `<div class="bt-tile"><div class="bt-tile-h">${h}</div><div class="bt-tile-v">${v}</div><div class="bt-tile-s">${sub}</div></div>`;
  return `<div class="bt-tiles">
    ${tile(`Beta · ${esc(methodTag(st))} vs ${esc(st.index)}`, fmtB(r.beta, 3),
      r.se == null ? '&nbsp;' : `± ${fmtB(r.se, 3)} std. error · 95% CI ${fmtB(r.lo)} to ${fmtB(r.hi)}`)}
    ${tile('Adjusted beta', fmtB(c.adj, 3), `${st.alpha} × beta + ${fmtB(1 - st.alpha)} × ${st.anchor}`)}
    ${tile('Correlation', fmtB(r.corr, 3), `R² ${fmtPct(r.r2 == null ? null : r.r2 * 100, 1)} explained by the index`)}
    ${tile('Annualized volatility', fmtPct(r.volS, 1), `${esc(st.ticker)} · ${esc(st.index)} ${fmtPct(r.volM, 1)}`)}
    ${tile('Annualized alpha', fmtPct(r.alphaAnn, 1), 'regression intercept × periods per year')}
    ${c.stats ? tile(`Rolling beta · ${c.rollN} ${FREQS[st.freq].noun}`, fmtB(c.stats.last, 3),
      `avg ${fmtB(c.stats.avg)} · med ${fmtB(c.stats.median)} · ${fmtB(c.stats.min)} to ${fmtB(c.stats.max)}`)
      : tile('Rolling beta', '—', 'not enough history for the rolling window')}
  </div>`;
}

function submitBar(c) {
  const prev = historyFor(st.ticker);
  const last = prev[0];
  return `<div class="bt-card bt-pick">
    <div class="bt-pick-l">
      <span class="bt-lbl">Beta to submit for ${esc(st.ticker)}</span>
      <select class="bt-in bt-sel" data-in="pick">${c.picks.map((p) =>
        `<option value="${p.key}"${p.key === c.pick.key ? ' selected' : ''}>${esc(p.label)}${p.key === 'manual' ? '' : ` — ${fmtB(p.v, 3)}`}</option>`).join('')}</select>
      ${st.pick === 'manual' ? `<input class="bt-in bt-num" data-in="manual" value="${esc(st.manual)}" placeholder="1.20" inputmode="decimal">` : ''}
      <b class="bt-pick-v">${fmtB(c.pick.v, 3)}</b>
      <input class="bt-in bt-noteinp" data-in="note" value="${esc(st.note)}" placeholder="Note (optional) — why this method" maxlength="240">
      <button type="button" class="bt-btn" data-act="submit"${c.pick.v == null ? ' disabled' : ''}>Submit</button>
      ${st.flash ? `<span class="bt-flash">${esc(st.flash)}</span>` : ''}
    </div>
    <div class="bt-pick-r">${last
      ? `Last submitted: <b>${fmtB(last.beta, 3)}</b> · ${esc(last.beta_type_label || last.beta_type)} · ${esc(last.submitted_at.slice(0, 10))} · ${prev.length} submission${prev.length === 1 ? '' : 's'} in <button type="button" class="bt-link" data-goto="history">History</button>`
      : '<span class="bt-muted">No beta submitted for this name yet</span>'}</div>
  </div>`;
}

function matrixCard(c) {
  const cur = `${st.freq}|${st.amt}${st.unit}`;
  const rows = c.matrix.map((row) => `<tr><td class="bt-h">${FREQS[row.freq].label}</td>${row.cells.map((x) => {
    const on = cur === `${row.freq}|${x.amt}${x.unit}`;
    return `<td class="bt-mx${on ? ' on' : ''}${x.beta == null ? ' nil' : ''}" data-mx="${row.freq}|${x.amt}|${x.unit}"
      title="${x.beta == null ? 'Fewer than 6 observations' : `n = ${x.n}`} · click to use this method">${fmtB(x.beta)}<small>n ${x.n}</small></td>`;
  }).join('')}</tr>`).join('');
  return `<div class="bt-card">
    <div class="bt-block-h">Beta by method <span>vs ${esc(st.index)} as of ${esc(c.end)} · unadjusted · click a cell to use that method</span></div>
    <div class="bt-scroll"><table class="bt-t bt-matrix">
      <thead><tr><th class="bt-h">Frequency</th>${LOOKS.map(([a, u]) => `<th>${lookTag(a, u)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody></table></div>
  </div>`;
}

const chip = (group, k, label, color, on, dashed) => `<button type="button" class="rs-leg${on ? '' : ' off'}" data-leg="${group}|${k}">
  <span class="${dashed ? 'rs-leg-dash' : 'rs-leg-line'}" style="${dashed ? 'color' : 'background'}:${color}"></span>${esc(label)}</button>`;

const ROLL_SER = [
  { k: 'raw', label: 'Rolling beta', color: C_ACT },
  { k: 'adj', label: 'Adjusted rolling beta', color: C_ADJ, dashed: true },
  { k: 'sel', label: 'Selected beta', color: C_SEL, dashed: true },
  { k: 'one', label: 'Market (β = 1)', color: C_MKT, dashed: true },
];
const rollVis = (k) => !st.roll.hidden[k];

function rollRange(c) {
  const n = c.roll.length;
  const [a, b] = st.roll.win || [0, n - 1];
  return [Math.max(0, a), Math.min(n - 1, b)];
}
function rollHead(c) {
  const open = st.roll.tbl === true;
  const [a, b] = rollRange(c);
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Rolling beta detail
    <span class="rs-collap-sub">${open ? 'hide' : 'show'} · ${b - a + 1} points in range</span>`;
}
function rollTable(c) {
  const [a, b] = rollRange(c);
  const cols = ROLL_SER.filter((s) => rollVis(s.k) && s.k !== 'one');
  let h = `<div class="rs-ft-cap">Beta (unitless) · rolling window of ${c.rollN} ${FREQS[st.freq].noun} · market = 1.00</div>
    <div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Date</th>${cols.map((s) => `<th>${esc(s.label)}</th>`).join('')}</tr></thead><tbody>`;
  for (let i = b; i >= a; i--) {
    h += `<tr><td class="bt-h">${esc(c.roll[i].date)}</td>${cols.map((s) =>
      `<td>${fmtB(s.k === 'raw' ? c.roll[i].beta : s.k === 'adj' ? c.rollAdj[i].beta : c.pick.v, 3)}</td>`).join('')}</tr>`;
  }
  return h + '</tbody></table></div>';
}

const SC_SER = [
  { k: 'obs', label: 'Period returns', color: C_ACT },
  { k: 'fit', label: 'Regression (slope = beta)', color: C_ADJ },
];
const scVis = (k) => !st.sc.hidden[k];
function scRows(c) {
  let rows = c.w.rows;
  if (st.sc.xr) rows = rows.filter((r) => r.m * 100 >= st.sc.xr[0] && r.m * 100 <= st.sc.xr[1]);
  if (st.sc.yr) rows = rows.filter((r) => r.s * 100 >= st.sc.yr[0] && r.s * 100 <= st.sc.yr[1]);
  return rows;
}
function scHead(c) {
  const open = st.sc.tbl === true;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Returns detail
    <span class="rs-collap-sub">${open ? 'hide' : 'show'} · ${scVis('obs') ? scRows(c).length + ' observations in range' : 'regression only'}</span>`;
}
function scTable(c) {
  const r = c.reg;
  let h = `<div class="rs-ft-cap">Returns in % per period · ${scVis('fit') ? `fit: ${esc(st.ticker)} % = ${fmtB(r.alpha * 100, 3)} + ${fmtB(r.beta, 3)} × ${esc(st.index)} %` : 'regression hidden'}</div>`;
  if (!scVis('obs')) return h;
  h += `<div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Period ending</th><th>${esc(st.index)}</th><th>${esc(st.ticker)}</th>${scVis('fit') ? '<th>Fitted</th><th>Residual</th>' : ''}</tr></thead><tbody>`;
  const rows = scRows(c);
  for (let i = rows.length - 1; i >= 0; i--) {
    const x = rows[i], fit = (r.alpha + r.beta * x.m) * 100;
    h += `<tr><td class="bt-h">${esc(x.date)}</td><td>${fmtPct(x.m * 100)}</td><td>${fmtPct(x.s * 100)}</td>${scVis('fit') ? `<td>${fmtPct(fit)}</td><td>${fmtB(x.s * 100 - fit)} pp</td>` : ''}</tr>`;
  }
  return h + '</tbody></table></div>';
}

function chartBlocks(c) {
  const unitNoun = FREQS[st.freq].noun.replace(/s$/, '');
  const roll = c.roll.length ? `
  <div class="bt-card">
    <div class="bt-block-h">Rolling beta <span>${c.rollN}-${unitNoun} window vs ${esc(st.index)} · drag to zoom, double-click to reset</span></div>
    <div class="bt-legend">${ROLL_SER.map((s) => chip('roll', s.k, s.label, s.color, rollVis(s.k), s.dashed)).join('')}</div>
    <div class="bt-cv"><canvas id="bt-roll-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="roll">${rollHead(c)}</button>
      <div class="rs-collap-b"${st.roll.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${rollTable(c)}</div></div>
    </div>
  </div>` : `<div class="bt-card"><span class="rs-noguide">⚑ Not enough history for a ${c.rollN}-${unitNoun} rolling beta</span></div>`;

  const scatter = c.reg.beta != null ? `
  <div class="bt-card">
    <div class="bt-block-h">Returns scatter <span>${esc(st.ticker)} against ${esc(st.index)} over the window · the slope of the line is the beta</span></div>
    <div class="bt-legend">${SC_SER.map((s) => chip('sc', s.k, s.label, s.color, scVis(s.k))).join('')}</div>
    <div class="bt-cv bt-cv-sq"><canvas id="bt-sc-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="sc">${scHead(c)}</button>
      <div class="rs-collap-b"${st.sc.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${scTable(c)}</div></div>
    </div>
  </div>` : '';
  return `<div class="bt-charts">${roll}${scatter}</div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function destroyCharts() { charts.forEach((ch) => ch.destroy()); charts = []; }

function render() {
  if (!root) return;
  destroyCharts();
  const c = compute();
  let body;
  if (st.loading) body = '<div class="bt-empty">Loading prices…</div>';
  else if (st.err) body = `<div class="bt-err">${esc(st.err)}</div>`;
  else if (!c) body = '';
  else if (c.empty) body = `<div class="bt-err">Not enough common periods between ${esc(st.ticker)} and ${esc(st.index)} at ${FREQS[st.freq].adj} frequency.</div>`;
  else if (c.reg.beta == null) body = `${statusLine(c)}<div class="bt-err">Fewer than 6 observations in the window — widen the window or raise the frequency.</div>${matrixCard(c)}`;
  else body = `${statusLine(c)}${kpis(c)}${submitBar(c)}${matrixCard(c)}${chartBlocks(c)}`;

  root.innerHTML = `${controls(c)}${body}
    <p class="bt-note">β = cov(name returns, index returns) / var(index returns), using simple returns over the same
    periods. Weekly and monthly use the last close of each week or month (the current period counts even if it is
    incomplete). Adjusted = α × β + (1 − α) × anchor (Blume; Bloomberg uses 0.67 and 1.0). 95% CI = β ± 1.96 standard
    errors. Daily closes from Massive, adjusted for splits (not dividends).</p>`;
  const seq = ++_seq;
  if (c && !c.empty && c.reg.beta != null && !st.loading && !st.err) requestAnimationFrame(() => { if (seq === _seq) buildCharts(c); });
}

function buildCharts(c) {
  if (typeof Chart === 'undefined' || !root) return;
  const rcv = root.querySelector('#bt-roll-cv');
  if (rcv && c.roll.length) {
    const [a, b] = rollRange(c);
    const labels = c.roll.slice(a, b + 1).map((p) => p.date);
    const ds = [];
    if (rollVis('raw')) ds.push({ label: 'Rolling beta', data: c.roll.slice(a, b + 1).map((p) => p.beta), borderColor: C_ACT, borderWidth: 2, pointRadius: 0, tension: 0.2 });
    if (rollVis('adj')) ds.push({ label: 'Adjusted', data: c.rollAdj.slice(a, b + 1).map((p) => p.beta), borderColor: C_ADJ, borderWidth: 1.5, borderDash: [5, 4], pointRadius: 0, tension: 0.2 });
    if (rollVis('sel') && c.pick.v != null) ds.push({ label: 'Selected beta', data: labels.map(() => c.pick.v), borderColor: C_SEL, borderWidth: 1.5, borderDash: [6, 3], pointRadius: 0 });
    if (rollVis('one')) ds.push({ label: 'Market', data: labels.map(() => 1), borderColor: C_MKT, borderWidth: 1, borderDash: [2, 3], pointRadius: 0 });
    const ch = new Chart(rcv.getContext('2d'), {
      type: 'line',
      data: { labels, datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => `${x.dataset.label}: ${fmtB(x.parsed.y, 3)}` } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8, maxRotation: 0, font: { size: 10 } } },
          y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, callback: (v) => 'β ' + Number(v).toFixed(2) },
            min: st.roll.yr ? st.roll.yr[0] : undefined, max: st.roll.yr ? st.roll.yr[1] : undefined },
        },
      },
    });
    charts.push(ch);
    attachBrush(rcv, ch,
      (i, j) => { st.roll.win = [a + i, a + j]; render(); },
      (v1, v2) => { st.roll.yr = [v1, v2]; render(); },
      () => { st.roll.win = null; st.roll.yr = null; render(); });
  }

  const scv = root.querySelector('#bt-sc-cv');
  if (scv) {
    const r = c.reg;
    const pts = c.w.rows.map((x) => ({ x: x.m * 100, y: x.s * 100, d: x.date }));
    const xs = pts.map((p) => p.x);
    const x0 = st.sc.xr ? st.sc.xr[0] : Math.min(...xs), x1 = st.sc.xr ? st.sc.xr[1] : Math.max(...xs);
    const ds = [];
    if (scVis('obs')) ds.push({ type: 'scatter', label: 'Returns', data: pts, backgroundColor: 'rgba(30,39,51,0.55)', pointRadius: pts.length > 300 ? 1.8 : 3 });
    if (scVis('fit')) ds.push({ type: 'line', label: 'Regression', data: [{ x: x0, y: (r.alpha * 100) + r.beta * x0 }, { x: x1, y: (r.alpha * 100) + r.beta * x1 }], borderColor: C_ADJ, borderWidth: 2, pointRadius: 0 });
    const ch = new Chart(scv.getContext('2d'), {
      type: 'scatter',
      data: { datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (x) => x.raw.d
            ? `${x.raw.d}: ${st.index} ${fmtPct(x.raw.x)} · ${st.ticker} ${fmtPct(x.raw.y)}`
            : `Regression: ${st.ticker} ${fmtPct(x.raw.y)} at ${st.index} ${fmtPct(x.raw.x)}` } },
        },
        scales: {
          x: { type: 'linear', title: { display: true, text: `${st.index} — return per period (%)`, font: { size: 11 } },
            grid: { color: (t) => (t.tick.value === 0 ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)') },
            ticks: { font: { size: 10 }, callback: (v) => v + '%' },
            min: st.sc.xr ? st.sc.xr[0] : undefined, max: st.sc.xr ? st.sc.xr[1] : undefined },
          y: { position: 'right', title: { display: true, text: `${st.ticker} (%)`, font: { size: 11 } },
            grid: { color: (t) => (t.tick.value === 0 ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)') },
            ticks: { font: { size: 10 }, callback: (v) => v + '%' },
            min: st.sc.yr ? st.sc.yr[0] : undefined, max: st.sc.yr ? st.sc.yr[1] : undefined },
        },
      },
    });
    charts.push(ch);
    attachBrush(scv, ch,
      (v1, v2) => { st.sc.xr = [v1, v2]; render(); },
      (v1, v2) => { st.sc.yr = [v1, v2]; render(); },
      () => { st.sc.xr = null; st.sc.yr = null; render(); });
  }
}

// ── Events ───────────────────────────────────────────────────────────────────
function resetZoom() { st.roll.win = null; st.roll.yr = null; st.sc.xr = null; st.sc.yr = null; }

function onChange(e) {
  const el = e.target.closest('[data-in]');
  if (!el) return;
  const k = el.dataset.in, v = el.value;
  if (k === 'note') { st.note = v; return; }   // no re-render: keeps the focus where the user is
  st.flash = '';
  if (k === 'ticker' || k === 'index') {
    if (!v.trim()) return;
    st[k] = v.trim().toUpperCase();
    if (k === 'ticker') st.note = '';
    return loadData();
  }
  if (k === 'amt' || k === 'rollAmt') { const n = Math.round(num(v)); if (n > 0) st[k] = n; resetZoom(); }
  else if (k === 'alpha') { const n = num(v); if (n != null && n >= 0 && n <= 1) st.alpha = n; }
  else if (k === 'anchor') { const n = num(v); if (n != null) st.anchor = n; }
  else if (k === 'end') { st.end = v; resetZoom(); }
  else if (k === 'pick') st.pick = v;
  else if (k === 'manual') st.manual = v;
  render();
}

let _goto = null;
function onClick(e) {
  const b = e.target.closest('button, td[data-mx]');
  if (!b) return;
  const d = b.dataset;
  if (d.act === 'submit') return submit();
  st.flash = '';
  if (d.freq) { st.freq = d.freq; resetZoom(); return render(); }
  if (d.unit) { st.unit = d.unit; resetZoom(); return render(); }
  if (d.runit) { st.rollUnit = d.runit; resetZoom(); return render(); }
  if (d.look) { st.amt = Number(d.look.slice(0, -1)); st.unit = d.look.slice(-1); resetZoom(); return render(); }
  if (d.mx) { const [f, a, u] = d.mx.split('|'); st.freq = f; st.amt = Number(a); st.unit = u; resetZoom(); return render(); }
  if (d.leg) {
    const [g, k] = d.leg.split('|');
    const h = g === 'roll' ? st.roll.hidden : st.sc.hidden;
    h[k] = !h[k];
    return render();
  }
  if (d.tbl) {
    const s = d.tbl === 'roll' ? st.roll : st.sc;
    s.tbl = s.tbl !== true;
    return render();
  }
  if (d.goto && _goto) return _goto(d.goto, st.ticker);
}

function submit() {
  const c = compute();
  if (!c || c.empty || c.pick.v == null) return;
  const noteEl = root.querySelector('[data-in="note"]');
  if (noteEl) st.note = noteEl.value;
  const r = c.reg, s = c.stats, user = getCurrentUser();
  const r6 = (v) => (v == null || !isFinite(v) ? null : Math.round(v * 1e6) / 1e6);
  addHistory({
    submitted_by: user ? user.email : null,
    ticker: st.ticker, index_ticker: st.index,
    frequency: st.freq, window_amount: st.amt, window_unit: st.unit === 'y' ? 'years' : 'months',
    window_start: c.w.start, end_date: c.end, observations: r.n,
    beta_type: c.pick.key, beta_type_label: c.pick.label, beta: r6(c.pick.v),
    raw_beta: r6(r.beta), adjusted_beta: r6(c.adj), blume_alpha: st.alpha, blume_anchor: st.anchor,
    std_error: r6(r.se), ci_low: r6(r.lo), ci_high: r6(r.hi),
    correlation: r6(r.corr), r_squared: r6(r.r2), alpha_annual_pct: r6(r.alphaAnn),
    stock_vol_pct: r6(r.volS), index_vol_pct: r6(r.volM),
    rolling_amount: st.rollAmt, rolling_unit: st.rollUnit === 'y' ? 'years' : 'months',
    rolling_last: r6(s && s.last), rolling_avg: r6(s && s.avg), rolling_median: r6(s && s.median),
    rolling_min: r6(s && s.min), rolling_max: r6(s && s.max),
    price_source: 'massive', data_as_of: c.last, note: st.note.trim() || null,
  });
  st.note = '';
  st.flash = `Submitted ${st.ticker} β ${fmtB(c.pick.v, 3)}`;
  render();
}

// Open a name in the Calculator — restoring a history record's method when given one.
export function openTicker(t, rec) {
  st.ticker = String(t || '').toUpperCase();
  st.flash = '';
  if (rec) {
    Object.assign(st, {
      index: rec.index_ticker || st.index, freq: rec.frequency || st.freq,
      amt: rec.window_amount || st.amt, unit: rec.window_unit === 'months' ? 'm' : 'y',
      end: rec.end_date || '',
      rollAmt: rec.rolling_amount || st.rollAmt, rollUnit: rec.rolling_unit === 'months' ? 'm' : 'y',
      alpha: rec.blume_alpha != null ? rec.blume_alpha : st.alpha, anchor: rec.blume_anchor != null ? rec.blume_anchor : st.anchor,
      pick: rec.beta_type || 'raw', manual: rec.beta_type === 'manual' ? String(rec.beta) : st.manual,
    });
  }
  resetZoom();
  if (root) loadData();
}

let _wired = false;
export async function loadBetasCalc(el, gotoPane) {
  root = el;
  _goto = gotoPane || null;
  if (!_wired) {
    _wired = true;
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !e.target.matches('input[data-in]')) return;
      if (e.target.dataset.in === 'note') { st.note = e.target.value; submit(); } else e.target.blur();
    });
    onHistoryChange(() => render());
  }
  render();
  loadData();
}
