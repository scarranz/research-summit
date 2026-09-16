// Tools ▸ Betas ▸ Calculadora — the beta of ANY name, with every variable exposed.
//
// There is no house default: the right method depends on the company (a recent IPO
// has no five years of monthly returns; a name that re-rated wants a shorter window),
// so the pane lays the choices side by side — the regression for the chosen method,
// a method matrix (frequency × window) to see how much the answer moves, the rolling
// beta to see how stable it has been, and the scatter behind the slope — and then
// asks which number to carry into the portfolio ("Usar en el portafolio").
//
// Charts follow docs/CHART_ENGINE_REFERENCE.md §0: drag to zoom on both axes with
// double-click reset, legend chips that hide a series from the chart AND its table,
// and a collapsible table under each chart carrying everything drawn.

import {
  esc, fmtB, fmtPct, num, FREQS, lookTag, methodTag, monthsOf,
  loadEmbedded, embeddedTickers, getSeries, alignedReturns, windowReturns, regress, blume,
  rollingBeta, describe, getSelected, setSelected, removeSelected, allSelected,
  onSelectedChange, attachBrush,
} from './betas-core.js';

const C_ACT = 'rgba(30,39,51,0.92)';     // navy — the measured series
const C_ADJ = '#2563EB';                 // blue — the adjusted / derived series
const C_SEL = '#1E9E62';                 // green — the beta chosen for the portfolio
const C_MKT = '#8A93A0';                 // grey — the market (β = 1)

const LOOKS = [[6, 'm'], [1, 'y'], [2, 'y'], [3, 'y'], [5, 'y']];
const INDEXES = ['SPY', 'QQQ', 'RSP', 'XLG'];

const st = {
  ticker: 'AMZN', index: 'SPY', source: 'portal',
  freq: 'monthly', amt: 5, unit: 'y', end: '',
  rollAmt: 2, rollUnit: 'y', alpha: 0.67, anchor: 1,
  pick: 'raw', manual: '',
  loading: false, err: '', note: '',
  data: null,              // { stock, index, src, key }
  roll: { win: null, yr: null, hidden: {}, tbl: false },
  sc: { xr: null, yr: null, hidden: {}, tbl: false },
};
let root = null;
let charts = [];
let _alignCache = { key: '', byFreq: {} };

// ── Data ─────────────────────────────────────────────────────────────────────
async function loadData() {
  const T = st.ticker.trim().toUpperCase(), I = st.index.trim().toUpperCase();
  st.ticker = T; st.index = I;
  const key = `${T}|${I}|${st.source}`;
  if (st.data && st.data.key === key) return render();
  st.loading = true; st.err = ''; st.note = '';
  render();
  try {
    // Portal first, name by name: a series the embed doesn't have comes from Massive,
    // so an uncovered stock can still be measured against the embedded SPY.
    const one = async (x) => {
      if (st.source !== 'portal') return getSeries(x, 'massive');
      try { return await getSeries(x, 'portal'); } catch (e) { return getSeries(x, 'massive'); }
    };
    const [s, m] = await Promise.all([one(T), one(I)]);
    const src = s.source === m.source ? s.source : 'mixed';
    const viaLive = [s.source === 'massive' && st.source === 'portal' ? T : null, m.source === 'massive' && st.source === 'portal' ? I : null].filter(Boolean);
    if (viaLive.length) st.note = `${viaLive.join(' y ')} no está en el historial del portal; se trajo de Massive.`;
    st.data = { stock: s.series, index: m.series, src, key };
    _alignCache = { key: '', byFreq: {} };
    st.roll.win = null; st.roll.yr = null; st.sc.xr = null; st.sc.yr = null;
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
    { key: 'raw',  label: `Beta de la ventana (${methodTag(st)})`, v: reg.beta },
    { key: 'adj',  label: `Beta ajustada (α ${st.alpha}, ancla ${st.anchor})`, v: adj },
    { key: 'rlast', label: 'Beta móvil — última', v: stats && stats.last },
    { key: 'ravg',  label: 'Beta móvil — promedio en la ventana', v: stats && stats.avg },
    { key: 'rmed',  label: 'Beta móvil — mediana en la ventana', v: stats && stats.median },
    { key: 'manual', label: 'Manual', v: num(st.manual) },
  ];
  const pick = picks.find((p) => p.key === st.pick) || picks[0];
  return { rets, first, last, end, months, w, reg, adj, clipped, rollN, roll, rollAdj, inWin, stats, matrix, picks, pick };
}

// ── Markup ───────────────────────────────────────────────────────────────────
const seg = (attr, cur, opts) => `<div class="bt-seg">${opts.map(([k, l]) =>
  `<button type="button" data-${attr}="${esc(k)}" class="${String(cur) === String(k) ? 'on' : ''}">${l}</button>`).join('')}</div>`;

function controls(c) {
  const tickers = embeddedTickers();
  return `
  <div class="bt-card bt-ctl">
    <div class="bt-row">
      <label class="bt-f"><span>Nombre</span>
        <input class="bt-in bt-tk" data-in="ticker" value="${esc(st.ticker)}" list="bt-tickers" spellcheck="false" autocomplete="off"></label>
      <label class="bt-f"><span>Índice</span>
        <input class="bt-in bt-tk" data-in="index" value="${esc(st.index)}" list="bt-indexes" spellcheck="false" autocomplete="off"></label>
      <div class="bt-f"><span>Fuente de precios</span>${seg('src', st.source, [['portal', 'Portal (IBKR)'], ['massive', 'Massive']])}</div>
      <datalist id="bt-tickers">${tickers.map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
      <datalist id="bt-indexes">${INDEXES.map((t) => `<option value="${t}">`).join('')}</datalist>
    </div>
    <div class="bt-row">
      <div class="bt-f"><span>Frecuencia</span>${seg('freq', st.freq, Object.entries(FREQS).map(([k, f]) => [k, f.label]))}</div>
      <div class="bt-f"><span>Ventana</span>
        <div class="bt-inline">
          <input class="bt-in bt-num" data-in="amt" value="${esc(st.amt)}" inputmode="numeric">
          ${seg('unit', st.unit, [['m', 'Meses'], ['y', 'Años']])}
          ${seg('look', `${st.amt}${st.unit}`, LOOKS.map(([a, u]) => [`${a}${u}`, lookTag(a, u)]))}
        </div></div>
      <label class="bt-f"><span>Fecha final</span>
        <input class="bt-in" type="date" data-in="end" value="${esc(c && !c.empty ? c.end : st.end)}"
          ${c && !c.empty ? `min="${c.first}" max="${c.last}"` : ''}></label>
    </div>
    <div class="bt-row">
      <div class="bt-f"><span>Ventana de la beta móvil</span>
        <div class="bt-inline">
          <input class="bt-in bt-num" data-in="rollAmt" value="${esc(st.rollAmt)}" inputmode="numeric">
          ${seg('runit', st.rollUnit, [['m', 'Meses'], ['y', 'Años']])}
        </div></div>
      <div class="bt-f"><span>Ajuste Blume / Bloomberg</span>
        <div class="bt-inline">
          <span class="bt-mini">α</span><input class="bt-in bt-num" data-in="alpha" value="${esc(st.alpha)}" inputmode="decimal">
          <span class="bt-mini">ancla</span><input class="bt-in bt-num" data-in="anchor" value="${esc(st.anchor)}" inputmode="decimal">
        </div></div>
    </div>
  </div>`;
}

function statusLine(c) {
  const bits = [];
  if (st.data) {
    bits.push(`<span class="bt-badge">${{ massive: 'Massive · en vivo', portal: 'Portal · IBKR ajustado', mixed: 'Portal + Massive' }[st.data.src]}</span>`);
  }
  if (c && !c.empty) {
    bits.push(`<span>Historial común ${esc(c.first)} → ${esc(c.last)}</span>`);
    bits.push(`<span>Ventana ${esc(c.w.start)} → ${esc(c.end)} · <b>n = ${c.reg.n}</b> retornos ${FREQS[st.freq].noun === 'días' ? 'diarios' : FREQS[st.freq].label.toLowerCase() + 'es'}</span>`);
  }
  const warns = [];
  if (st.note) warns.push(st.note);
  if (c && !c.empty && c.clipped) warns.push(`La ventana pide desde ${c.w.start} pero el historial empieza en ${c.first}: la beta usa solo lo disponible.`);
  if (c && !c.empty && c.reg.beta != null && c.reg.n < 24) warns.push(`Solo ${c.reg.n} observaciones — el error estándar es alto; considera otra frecuencia.`);
  return `<div class="bt-status">${bits.join('<span class="bt-dot">·</span>')}</div>
    ${warns.map((w) => `<div class="bt-warn">⚑ ${esc(w)}</div>`).join('')}`;
}

function kpis(c) {
  const r = c.reg;
  const tile = (h, v, sub) => `<div class="bt-tile"><div class="bt-tile-h">${h}</div><div class="bt-tile-v">${v}</div><div class="bt-tile-s">${sub}</div></div>`;
  return `<div class="bt-tiles">
    ${tile(`Beta · ${esc(methodTag(st))} vs ${esc(st.index)}`, fmtB(r.beta, 3),
      r.se == null ? '&nbsp;' : `± ${fmtB(r.se, 3)} error est. · IC 95% ${fmtB(r.lo)} a ${fmtB(r.hi)}`)}
    ${tile('Beta ajustada', fmtB(c.adj, 3), `${st.alpha} × beta + ${fmtB(1 - st.alpha)} × ${st.anchor}`)}
    ${tile('Correlación', fmtB(r.corr, 3), `R² ${fmtPct(r.r2 == null ? null : r.r2 * 100, 1)} explicado por el índice`)}
    ${tile('Volatilidad anual', `${fmtPct(r.volS, 1)}`, `${esc(st.ticker)} · ${esc(st.index)} ${fmtPct(r.volM, 1)}`)}
    ${tile('Alfa anualizada', fmtPct(r.alphaAnn, 1), 'intercepto de la regresión × períodos/año')}
    ${c.stats ? tile(`Beta móvil · ${c.rollN} ${FREQS[st.freq].noun}`, fmtB(c.stats.last, 3),
      `prom ${fmtB(c.stats.avg)} · med ${fmtB(c.stats.median)} · ${fmtB(c.stats.min)} a ${fmtB(c.stats.max)}`)
      : tile('Beta móvil', '—', 'historial insuficiente para la ventana móvil')}
  </div>`;
}

function pickBar(c) {
  const saved = getSelected(st.ticker);
  return `<div class="bt-card bt-pick">
    <div class="bt-pick-l">
      <span class="bt-lbl">Beta a usar para ${esc(st.ticker)}</span>
      <select class="bt-in bt-sel" data-in="pick">${c.picks.map((p) =>
        `<option value="${p.key}"${p.key === c.pick.key ? ' selected' : ''}>${esc(p.label)}${p.key === 'manual' ? '' : ` — ${fmtB(p.v, 3)}`}</option>`).join('')}</select>
      ${st.pick === 'manual' ? `<input class="bt-in bt-num" data-in="manual" value="${esc(st.manual)}" placeholder="1.20" inputmode="decimal">` : ''}
      <b class="bt-pick-v">${fmtB(c.pick.v, 3)}</b>
      <button type="button" class="bt-btn" data-act="save"${c.pick.v == null ? ' disabled' : ''}>Usar en el portafolio</button>
    </div>
    <div class="bt-pick-r">${saved
      ? `Guardada: <b>${fmtB(saved.beta, 3)}</b> · ${esc(saved.label)} · ${esc(saved.savedAt)}`
      : '<span class="bt-muted">Sin beta guardada para este nombre</span>'}</div>
  </div>`;
}

function matrixCard(c) {
  const cur = `${st.freq}|${st.amt}${st.unit}`;
  const rows = c.matrix.map((row) => `<tr><td class="bt-h">${FREQS[row.freq].label}</td>${row.cells.map((x) => {
    const on = cur === `${row.freq}|${x.amt}${x.unit}`;
    return `<td class="bt-mx${on ? ' on' : ''}${x.beta == null ? ' nil' : ''}" data-mx="${row.freq}|${x.amt}|${x.unit}"
      title="${x.beta == null ? 'Menos de 6 observaciones' : `n = ${x.n}`} · clic para usar este método">${fmtB(x.beta)}<small>n ${x.n}</small></td>`;
  }).join('')}</tr>`).join('');
  return `<div class="bt-card">
    <div class="bt-block-h">Beta por método <span>vs ${esc(st.index)} al ${esc(c.end)} · sin ajustar · clic en una celda para usar ese método</span></div>
    <div class="bt-scroll"><table class="bt-t bt-matrix">
      <thead><tr><th class="bt-h">Frecuencia</th>${LOOKS.map(([a, u]) => `<th>${lookTag(a, u)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody></table></div>
  </div>`;
}

const chip = (group, k, label, color, on, dashed) => `<button type="button" class="rs-leg${on ? '' : ' off'}" data-leg="${group}|${k}">
  <span class="${dashed ? 'rs-leg-dash' : 'rs-leg-line'}" style="${dashed ? 'color' : 'background'}:${color}"></span>${esc(label)}</button>`;

const ROLL_SER = [
  { k: 'raw', label: 'Beta móvil', color: C_ACT },
  { k: 'adj', label: 'Beta móvil ajustada', color: C_ADJ, dashed: true },
  { k: 'sel', label: 'Beta a usar', color: C_SEL, dashed: true },
  { k: 'one', label: 'Mercado (β = 1)', color: C_MKT, dashed: true },
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
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Detalle de la beta móvil
    <span class="rs-collap-sub">${open ? 'ocultar' : 'mostrar'} · ${b - a + 1} puntos en el rango</span>`;
}
function rollTable(c) {
  const [a, b] = rollRange(c);
  const cols = ROLL_SER.filter((s) => rollVis(s.k) && s.k !== 'one');
  let h = `<div class="rs-ft-cap">Beta (sin unidades) · ventana móvil de ${c.rollN} ${FREQS[st.freq].noun} · mercado = 1.00</div>
    <div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Fecha</th>${cols.map((s) => `<th>${esc(s.label)}</th>`).join('')}</tr></thead><tbody>`;
  for (let i = b; i >= a; i--) {
    h += `<tr><td class="bt-h">${esc(c.roll[i].date)}</td>${cols.map((s) =>
      `<td>${fmtB(s.k === 'raw' ? c.roll[i].beta : s.k === 'adj' ? c.rollAdj[i].beta : c.pick.v, 3)}</td>`).join('')}</tr>`;
  }
  return h + '</tbody></table></div>';
}

const SC_SER = [
  { k: 'obs', label: 'Retornos del período', color: C_ACT },
  { k: 'fit', label: 'Regresión (pendiente = beta)', color: C_ADJ },
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
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Detalle de retornos
    <span class="rs-collap-sub">${open ? 'ocultar' : 'mostrar'} · ${scVis('obs') ? scRows(c).length + ' observaciones en el rango' : 'solo la regresión'}</span>`;
}
function scTable(c) {
  const r = c.reg;
  let h = `<div class="rs-ft-cap">Retornos en % por período · ${scVis('fit') ? `ajuste: ${esc(st.ticker)} % = ${fmtB(r.alpha * 100, 3)} + ${fmtB(r.beta, 3)} × ${esc(st.index)} %` : 'regresión oculta'}</div>`;
  if (!scVis('obs')) return h;
  h += `<div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Período al</th><th>${esc(st.index)}</th><th>${esc(st.ticker)}</th>${scVis('fit') ? '<th>Ajuste</th><th>Residuo</th>' : ''}</tr></thead><tbody>`;
  const rows = scRows(c);
  for (let i = rows.length - 1; i >= 0; i--) {
    const x = rows[i], fit = (r.alpha + r.beta * x.m) * 100;
    h += `<tr><td class="bt-h">${esc(x.date)}</td><td>${fmtPct(x.m * 100)}</td><td>${fmtPct(x.s * 100)}</td>${scVis('fit') ? `<td>${fmtPct(fit)}</td><td>${fmtB(x.s * 100 - fit)} pp</td>` : ''}</tr>`;
  }
  return h + '</tbody></table></div>';
}

function chartBlocks(c) {
  const roll = c.roll.length ? `
  <div class="bt-card">
    <div class="bt-block-h">Beta móvil <span>ventana de ${c.rollN} ${FREQS[st.freq].noun} vs ${esc(st.index)} · arrastra para acercar, doble clic restablece</span></div>
    <div class="bt-legend" id="bt-roll-leg">${ROLL_SER.map((s) => chip('roll', s.k, s.label, s.color, rollVis(s.k), s.dashed)).join('')}</div>
    <div class="bt-cv"><canvas id="bt-roll-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="roll">${rollHead(c)}</button>
      <div class="rs-collap-b"${st.roll.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${rollTable(c)}</div></div>
    </div>
  </div>` : `<div class="bt-card"><span class="rs-noguide">⚑ Historial insuficiente para una beta móvil de ${c.rollN} ${FREQS[st.freq].noun}</span></div>`;

  const scatter = c.reg.beta != null ? `
  <div class="bt-card">
    <div class="bt-block-h">Dispersión de retornos <span>${esc(st.ticker)} contra ${esc(st.index)} en la ventana · la pendiente de la recta es la beta</span></div>
    <div class="bt-legend">${SC_SER.map((s) => chip('sc', s.k, s.label, s.color, scVis(s.k))).join('')}</div>
    <div class="bt-cv bt-cv-sq"><canvas id="bt-sc-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="sc">${scHead(c)}</button>
      <div class="rs-collap-b"${st.sc.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${scTable(c)}</div></div>
    </div>
  </div>` : '';
  return `<div class="bt-charts">${roll}${scatter}</div>`;
}

function savedCard() {
  const list = allSelected();
  if (!list.length) return '';
  return `<div class="bt-card">
    <div class="bt-block-h">Betas guardadas para el portafolio <span>en este navegador · el tab Portafolio las usa cuando la fuente del nombre es "Calculadora"</span></div>
    <div class="bt-scroll"><table class="bt-t">
      <thead><tr><th class="bt-h">Nombre</th><th>Beta</th><th class="bt-l">Cuál</th><th class="bt-l">Método</th><th>Guardada</th><th></th></tr></thead>
      <tbody>${list.map((s) => `<tr>
        <td class="bt-h"><b>${esc(s.ticker)}</b></td><td><b>${fmtB(s.beta, 3)}</b></td>
        <td class="bt-l">${esc(s.label)}</td>
        <td class="bt-l">${esc(`${lookTag(s.amt, s.unit)}·${FREQS[s.freq] ? FREQS[s.freq].short : '?'} vs ${s.index} al ${s.end} · ${s.source === 'massive' ? 'Massive' : 'Portal'}`)}</td>
        <td>${esc(s.savedAt)}</td>
        <td class="bt-acts"><button type="button" class="bt-link" data-open="${esc(s.ticker)}">Abrir</button>
          <button type="button" class="bt-x" data-del="${esc(s.ticker)}" title="Quitar">×</button></td></tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function destroyCharts() { charts.forEach((ch) => ch.destroy()); charts = []; }

function render() {
  if (!root) return;
  destroyCharts();
  const c = compute();
  let body;
  if (st.loading) body = '<div class="bt-empty">Cargando precios…</div>';
  else if (st.err) body = `<div class="bt-err">${esc(st.err)}</div>`;
  else if (!c) body = '';
  else if (c.empty) body = `<div class="bt-err">No hay suficientes períodos en común entre ${esc(st.ticker)} y ${esc(st.index)} a frecuencia ${FREQS[st.freq].label.toLowerCase()}.</div>`;
  else if (c.reg.beta == null) body = `${statusLine(c)}<div class="bt-err">Menos de 6 observaciones en la ventana — amplía la ventana o sube la frecuencia.</div>${matrixCard(c)}`;
  else body = `${statusLine(c)}${kpis(c)}${pickBar(c)}${matrixCard(c)}${chartBlocks(c)}`;

  root.innerHTML = `${controls(c)}${body}${savedCard()}
    <p class="bt-note">β = cov(retornos del nombre, retornos del índice) / var(retornos del índice), con retornos simples
    en los mismos períodos. Semanal y mensual toman el último cierre de cada semana o mes (el período en curso cuenta
    aunque esté incompleto). Ajustada = α × β + (1 − α) × ancla (Blume; Bloomberg usa 0.67 y 1.0). IC 95% = β ± 1.96
    errores estándar. Precios ajustados por splits y dividendos.</p>`;
  if (c && !c.empty && c.reg.beta != null && !st.loading && !st.err) requestAnimationFrame(() => buildCharts(c));
}

function buildCharts(c) {
  if (typeof Chart === 'undefined' || !root) return;
  const rcv = root.querySelector('#bt-roll-cv');
  if (rcv && c.roll.length) {
    const [a, b] = rollRange(c);
    const labels = c.roll.slice(a, b + 1).map((p) => p.date);
    const ds = [];
    if (rollVis('raw')) ds.push({ label: 'Beta móvil', data: c.roll.slice(a, b + 1).map((p) => p.beta), borderColor: C_ACT, borderWidth: 2, pointRadius: 0, tension: 0.2 });
    if (rollVis('adj')) ds.push({ label: 'Ajustada', data: c.rollAdj.slice(a, b + 1).map((p) => p.beta), borderColor: C_ADJ, borderWidth: 1.5, borderDash: [5, 4], pointRadius: 0, tension: 0.2 });
    if (rollVis('sel') && c.pick.v != null) ds.push({ label: 'Beta a usar', data: labels.map(() => c.pick.v), borderColor: C_SEL, borderWidth: 1.5, borderDash: [6, 3], pointRadius: 0 });
    if (rollVis('one')) ds.push({ label: 'Mercado', data: labels.map(() => 1), borderColor: C_MKT, borderWidth: 1, borderDash: [2, 3], pointRadius: 0 });
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
    if (scVis('obs')) ds.push({ type: 'scatter', label: 'Retornos', data: pts, backgroundColor: 'rgba(30,39,51,0.55)', pointRadius: pts.length > 300 ? 1.8 : 3 });
    if (scVis('fit')) ds.push({ type: 'line', label: 'Regresión', data: [{ x: x0, y: (r.alpha * 100) + r.beta * x0 }, { x: x1, y: (r.alpha * 100) + r.beta * x1 }], borderColor: C_ADJ, borderWidth: 2, pointRadius: 0 });
    const ch = new Chart(scv.getContext('2d'), {
      type: 'scatter',
      data: { datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (x) => x.raw.d
            ? `${x.raw.d}: ${st.index} ${fmtPct(x.raw.x)} · ${st.ticker} ${fmtPct(x.raw.y)}`
            : `Regresión: ${st.ticker} ${fmtPct(x.raw.y)} con ${st.index} ${fmtPct(x.raw.x)}` } },
        },
        scales: {
          x: { type: 'linear', title: { display: true, text: `${st.index} — retorno por período (%)`, font: { size: 11 } },
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
  if (k === 'ticker' || k === 'index') {
    if (!v.trim()) return;
    st[k] = v.trim().toUpperCase();
    if (st.source === 'massive' && k === 'ticker') st.source = 'portal';   // prefer the embed when it has the name
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

function onClick(e) {
  const b = e.target.closest('button, td[data-mx]');
  if (!b) return;
  const d = b.dataset;
  if (d.src) { if (d.src !== st.source) { st.source = d.src; loadData(); } return; }
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
  if (d.act === 'save') return save();
  if (d.open) return openTicker(d.open, true);
  if (d.del) { removeSelected(d.del); return render(); }
}

function save() {
  const c = compute();
  if (!c || c.empty || c.pick.v == null) return;
  setSelected(st.ticker, {
    beta: c.pick.v, key: c.pick.key, label: c.pick.label,
    index: st.index, freq: st.freq, amt: st.amt, unit: st.unit, end: c.end,
    rollAmt: st.rollAmt, rollUnit: st.rollUnit, alpha: st.alpha, anchor: st.anchor,
    source: st.source, n: c.reg.n, savedAt: new Date().toISOString().slice(0, 10),
  });
}

// Open a name — restoring the method it was saved with, if any.
export function openTicker(t, restore = true) {
  const T = String(t || '').toUpperCase();
  const s = restore ? getSelected(T) : null;
  st.ticker = T;
  if (s) {
    Object.assign(st, {
      index: s.index, freq: s.freq, amt: s.amt, unit: s.unit, end: s.end, source: s.source || 'portal',
      rollAmt: s.rollAmt || st.rollAmt, rollUnit: s.rollUnit || st.rollUnit,
      alpha: s.alpha != null ? s.alpha : st.alpha, anchor: s.anchor != null ? s.anchor : st.anchor,
      pick: s.key || 'raw', manual: s.key === 'manual' ? String(s.beta) : st.manual,
    });
  }
  resetZoom();
  if (root) loadData();
}

let _wired = false;
export async function loadBetasCalc(el) {
  root = el;
  if (!_wired) {
    _wired = true;
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input[data-in]')) e.target.blur(); });
    onSelectedChange(() => render());
  }
  render();
  await loadEmbedded().catch(() => {});
  loadData();
}
