// Tools ▸ Betas ▸ Portafolio — the portfolio's beta, as a sandbox.
//
// Load a portfolio's beta-contribution export (the SMGS_beta_contribution_<date>.csv
// shape), then play: change a position's allocation, an option's contracts, delta,
// spot or delta-adjusted exposure, or the beta a name carries — and watch the
// portfolio beta move against the file as reported and against the loaded positions.
//
//   stock / ETF contribution = allocation % × β
//   option contribution      = delta × contracts × 100 × price ÷ NAV × β(underlying)
//                              price = the underlying's SPOT (default) or the strike,
//                              which is what the export uses — the toggle shows the gap
//   cash                     = 100% − stocks − option premiums, and carries β 0
//
// Each name's beta has a source, chosen per name: the Calculadora (the beta saved
// there, with its method), the file, or a manual number. Nothing is stored: the
// loaded portfolio lives in memory and resets on reload; only the Calculadora's
// saved betas persist (in this browser).

import {
  esc, fmtB, fmtPct, fmtUsd, num, getSelected, onSelectedChange, openInCalc,
  loadEmbedded, embeddedNow, attachBrush,
} from './betas-core.js';

const GROUPS = {
  etf:    { label: 'Pasivos (ETFs)', color: '#3E5A82' },
  stock:  { label: 'Acciones',       color: 'rgba(30,39,51,0.92)' },
  option: { label: 'Opciones',       color: '#2563EB' },
};
const SRC_LABEL = { calc: 'Calculadora', file: 'Archivo', manual: 'Manual' };

const pf = {
  fileName: '', nav: null, rows: [], base: null, fileBeta: null, err: '',
  basis: 'spot',
  betaSrc: {}, manual: {},
  ch: { hidden: {}, xr: null, win: null, tbl: false },
};
let root = null, chart = null, _id = 0;
const clone = (o) => JSON.parse(JSON.stringify(o));

// ── CSV ──────────────────────────────────────────────────────────────────────
function parseCsv(text) {
  const out = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x !== '')) out.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((x) => x !== '')) out.push(row);
  return out;
}

function loadCsv(text, name) {
  const grid = parseCsv(text);
  if (grid.length < 2) throw new Error('El archivo está vacío.');
  const H = grid[0].map((h) => h.trim().toLowerCase());
  const col = (k) => H.indexOf(k);
  for (const need of ['ticker', 'type', 'market_value']) {
    if (col(need) < 0) throw new Error(`Falta la columna "${need}". Se espera el export beta_contribution.`);
  }
  const get = (r, k) => (col(k) < 0 ? '' : (r[col(k)] || '').trim());
  const recs = grid.slice(1).map((r) => ({
    ticker: get(r, 'ticker'), type: get(r, 'type').toLowerCase(), und: get(r, 'underlying').toUpperCase(),
    cp: get(r, 'contract_type').toLowerCase(), strike: num(get(r, 'strike')), expiry: get(r, 'expiration'),
    qty: num(get(r, 'quantity')), mv: num(get(r, 'market_value')), beta: num(get(r, 'beta')),
    delta: num(get(r, 'delta')), ubeta: num(get(r, 'underlying_beta')), contrib: num(get(r, 'beta_contribution')),
  }));
  const nav = recs.reduce((a, r) => a + (r.mv || 0), 0);
  if (!(nav > 0)) throw new Error('El valor de mercado total no es positivo.');
  const rows = [];
  for (const r of recs) {
    if (r.type === 'cash') continue;
    if (r.type === 'option') {
      rows.push({
        id: ++_id, kind: 'option', contract: r.ticker, und: r.und, cp: r.cp === 'put' ? 'put' : 'call',
        strike: r.strike, expiry: r.expiry, qty: r.qty || 0, delta: r.delta,
        prem: r.qty ? (r.mv || 0) / (r.qty * 100) : 0, spot: null, fileBeta: r.ubeta, fileContrib: r.contrib,
      });
    } else {
      rows.push({
        id: ++_id, kind: r.type === 'etf' ? 'etf' : 'stock', ticker: r.ticker.toUpperCase(),
        alloc: (r.mv || 0) / nav * 100, px: r.qty ? (r.mv || 0) / r.qty : null,
        fileBeta: r.beta, fileContrib: r.contrib,
      });
    }
  }
  pf.fileName = name; pf.nav = nav; pf.rows = rows; pf.base = clone(rows);
  pf.fileBeta = recs.reduce((a, r) => a + (r.contrib || 0), 0);
  pf.betaSrc = {}; pf.manual = {}; pf.err = '';
  pf.ch = { hidden: {}, xr: null, win: null, tbl: false };
}

// ── Model ────────────────────────────────────────────────────────────────────
const tickerOf = (r) => (r.kind === 'option' ? r.und : r.ticker);

function fileBetaOf(T, rows) {
  for (const r of rows) if (tickerOf(r) === T && r.fileBeta != null) return r.fileBeta;
  return null;
}
function srcOf(T) {
  if (pf.betaSrc[T]) return pf.betaSrc[T];
  if (getSelected(T)) return 'calc';
  if (fileBetaOf(T, pf.rows) != null) return 'file';
  return 'manual';
}
function betaOf(T) {
  const src = srcOf(T);
  let v = null;
  if (src === 'calc') { const s = getSelected(T); v = s ? s.beta : null; }
  else if (src === 'file') v = fileBetaOf(T, pf.base || pf.rows);
  else v = num(pf.manual[T]);
  return { v, src };
}

function spotOf(o, rows) {
  if (o.spot != null) return { v: o.spot, from: 'manual' };
  const s = rows.find((r) => r.kind !== 'option' && r.ticker === o.und && r.px);
  if (s) return { v: s.px, from: 'posición' };
  const e = embeddedNow();
  const ser = e && e.series[o.und];
  if (ser && ser.length) return { v: ser[ser.length - 1][1], from: `cierre ${ser[ser.length - 1][0]}` };
  return { v: null, from: '' };
}
function priceFor(o, rows) { return pf.basis === 'strike' ? o.strike : spotOf(o, rows).v; }
const optPremPct = (o) => (o.qty * 100 * (o.prem || 0)) / pf.nav * 100;
function optExpPct(o, rows) {
  const p = priceFor(o, rows);
  if (o.delta == null || p == null) return null;
  return o.delta * o.qty * 100 * p / pf.nav * 100;
}

// One pass over a set of rows: every row's weight, beta and contribution, and the totals.
function evaluate(rows) {
  const items = rows.map((r) => {
    const T = tickerOf(r), b = betaOf(T);
    const w = r.kind === 'option' ? optExpPct(r, rows) : r.alloc;
    const contrib = w == null || b.v == null ? 0 : w * b.v / 100;
    return { r, T, w, beta: b.v, src: b.src, contrib, missing: b.v == null || w == null };
  });
  const sum = (f) => items.filter(f).reduce((a, x) => a + x.contrib, 0);
  const stocksPct = rows.filter((r) => r.kind !== 'option').reduce((a, r) => a + (r.alloc || 0), 0);
  const premPct = rows.filter((r) => r.kind === 'option').reduce((a, r) => a + optPremPct(r), 0);
  return {
    items,
    etf: sum((x) => x.r.kind === 'etf'), stock: sum((x) => x.r.kind === 'stock'), option: sum((x) => x.r.kind === 'option'),
    total: items.reduce((a, x) => a + x.contrib, 0),
    stocksPct, premPct, cash: 100 - stocksPct - premPct,
    missing: items.filter((x) => x.missing),
  };
}

// ── Markup ───────────────────────────────────────────────────────────────────
const seg = (attr, cur, opts) => `<div class="bt-seg">${opts.map(([k, l]) =>
  `<button type="button" data-${attr}="${k}" class="${cur === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;

function toolbar() {
  return `<div class="bt-card bt-ctl">
    <div class="bt-row">
      <div class="bt-f"><span>Portafolio</span>
        <div class="bt-inline">
          <label class="bt-btn bt-file">Cargar CSV<input type="file" accept=".csv,text/csv" data-file hidden></label>
          <span class="bt-muted">${pf.fileName ? esc(pf.fileName) : 'export beta_contribution'}</span>
        </div></div>
      ${pf.base ? `
      <label class="bt-f"><span>NAV (US$)</span>
        <input class="bt-in bt-nav" data-nav value="${Math.round(pf.nav).toLocaleString('en-US')}" inputmode="numeric"></label>
      <div class="bt-f"><span>Exposición de opciones a</span>${seg('basis', pf.basis, [['spot', 'Precio actual'], ['strike', 'Strike (como el archivo)']])}</div>
      <div class="bt-f"><span>Fuente de beta, todos</span>${seg('allsrc', '', [['calc', 'Calculadora'], ['file', 'Archivo']])}</div>
      <div class="bt-f"><span>&nbsp;</span><button type="button" class="bt-btn bt-ghost" data-act="reset">Restablecer posiciones</button></div>` : ''}
    </div>
  </div>`;
}

function tiles(base, cur) {
  const d = (a, b, dig = 3, unit = "") => {
    const x = b - a;
    if (Math.abs(x) < 0.0005) return '<span class="bt-d">sin cambio</span>';
    return `<span class="bt-d ${x > 0 ? 'up' : 'dn'}">${x > 0 ? '+' : '−'}${Math.abs(x).toFixed(dig)}${unit}</span>`;
  };
  const tile = (h, a, b, fmt, dig, unit) => `<div class="bt-tile">
    <div class="bt-tile-h">${h}</div>
    <div class="bt-tile-pair"><span><small>Base</small>${fmt(a)}</span><i>→</i><span><small>Escenario</small><b>${fmt(b)}</b></span></div>
    ${d(a, b, dig, unit)}</div>`;
  return `<div class="bt-tiles">
    <div class="bt-tile bt-tile-file"><div class="bt-tile-h">Beta según el archivo</div>
      <div class="bt-tile-v">${fmtB(pf.fileBeta, 3)}</div>
      <div class="bt-tile-s">suma de beta_contribution, tal cual</div></div>
    ${tile('Beta del portafolio', base.total, cur.total, (v) => fmtB(v, 3), 3)}
    ${tile('Acciones y ETFs', base.etf + base.stock, cur.etf + cur.stock, (v) => fmtB(v, 3), 3)}
    ${tile('Opciones', base.option, cur.option, (v) => fmtB(v, 3), 3)}
    ${tile('Cash', base.cash, cur.cash, (v) => fmtPct(v, 1), 2, ' pp')}
  </div>
  <p class="bt-note bt-note-top"><b>Base</b> = las posiciones del archivo con las betas y la base de exposición elegidas ahora.
    <b>Escenario</b> = tus cambios. La diferencia entre "archivo" y "base" es solo metodología (betas y spot vs strike).</p>`;
}

function betaCells(x) {
  const T = x.T, src = x.src;
  const has = { calc: !!getSelected(T), file: fileBetaOf(T, pf.base || pf.rows) != null, manual: true };
  const sel = `<select class="bt-in bt-src" data-src="${esc(T)}">${Object.keys(SRC_LABEL).map((k) =>
    `<option value="${k}"${k === src ? ' selected' : ''}${has[k] ? '' : ' disabled'}>${SRC_LABEL[k]}${has[k] ? '' : ' (no hay)'}</option>`).join('')}</select>`;
  let val;
  if (src === 'manual') {
    val = `<input class="bt-in bt-num" data-manual="${esc(T)}" value="${esc(pf.manual[T] == null ? '' : pf.manual[T])}" placeholder="β" inputmode="decimal">`;
  } else if (x.beta == null) {
    val = '<span class="rs-noguide">sin beta</span>';
  } else {
    const s = src === 'calc' ? getSelected(T) : null;
    val = `<b title="${s ? esc(`${s.label} · guardada ${s.savedAt}`) : 'Beta del archivo'}">${fmtB(x.beta, 3)}</b>`;
  }
  return `<td class="bt-l">${sel}</td><td>${val}
    <button type="button" class="bt-link" data-calc="${esc(T)}" title="Abrir ${esc(T)} en la Calculadora">calc</button></td>`;
}

function deltaCell(x, baseMap) {
  const b = baseMap.get(x.r.id);
  const dv = x.contrib - (b ? b.contrib : 0);
  if (Math.abs(dv) < 0.0005) return '<td class="bt-muted">—</td>';
  return `<td class="${dv > 0 ? 'bt-up' : 'bt-dn'}">${dv > 0 ? '+' : '−'}${Math.abs(dv).toFixed(3)}</td>`;
}

function stockTable(cur, baseMap) {
  const block = (kind) => {
    const xs = cur.items.filter((x) => x.r.kind === kind);
    if (!xs.length) return '';
    return `<tr class="bt-grp"><td colspan="8">${GROUPS[kind].label}</td></tr>` + xs.map((x) => {
      const r = x.r;
      return `<tr>
        <td class="bt-h">${r.isNew
          ? `<input class="bt-in bt-tk" data-row="${r.id}" data-f="ticker" value="${esc(r.ticker)}" placeholder="TICKER">`
          : `<b>${esc(r.ticker)}</b>`}</td>
        <td><input class="bt-in bt-num" data-row="${r.id}" data-f="alloc" value="${r.alloc == null ? '' : r.alloc.toFixed(2)}" inputmode="decimal"><span class="bt-u">%</span></td>
        <td class="bt-muted">${fmtUsd(r.alloc * pf.nav / 100)}${r.px ? `<small>${Math.round(r.alloc * pf.nav / 100 / r.px).toLocaleString('en-US')} acc.</small>` : ''}</td>
        ${betaCells(x)}
        <td><b>${fmtB(x.contrib, 3)}</b></td>
        ${deltaCell(x, baseMap)}
        <td class="bt-acts"><button type="button" class="bt-x" data-del="${r.id}" title="Quitar">×</button></td>
      </tr>`;
    }).join('');
  };
  return `<div class="bt-card">
    <div class="bt-block-h">Acciones y ETFs <span>contribución = allocation × beta</span></div>
    <div class="bt-scroll"><table class="bt-t bt-edit">
      <thead><tr><th class="bt-h">Nombre</th><th>Allocation</th><th>Valor</th><th class="bt-l">Fuente β</th><th>Beta</th><th>Contribución</th><th>Δ vs base</th><th></th></tr></thead>
      <tbody>${block('etf')}${block('stock')}</tbody>
      <tfoot>
        <tr><td class="bt-h">Cash</td><td>${fmtPct(cur.cash, 2)}</td><td class="bt-muted">${fmtUsd(cur.cash * pf.nav / 100)}</td><td class="bt-l bt-muted">sin beta</td><td>0.000</td><td>0.000</td><td></td><td></td></tr>
      </tfoot>
    </table></div>
    <button type="button" class="bt-add" data-act="add-stock">+ Agregar acción o ETF</button>
    ${cur.cash < -0.005 ? `<div class="bt-warn">⚑ Las allocations y primas suman ${fmtPct(100 - cur.cash, 2)} del NAV: cash negativo (apalancamiento).</div>` : ''}
  </div>`;
}

function optTable(cur, baseMap) {
  const xs = cur.items.filter((x) => x.r.kind === 'option');
  const rows = xs.map((x) => {
    const o = x.r, sp = spotOf(o, pf.rows);
    const exp = optExpPct(o, pf.rows);
    const side = o.qty < 0 ? 'Vendida' : 'Comprada';
    const name = o.isNew
      ? `<div class="bt-inline">
          <input class="bt-in bt-tk" data-row="${o.id}" data-f="und" value="${esc(o.und)}" placeholder="SUBY.">
          <select class="bt-in" data-row="${o.id}" data-f="cp"><option value="call"${o.cp === 'call' ? ' selected' : ''}>Call</option><option value="put"${o.cp === 'put' ? ' selected' : ''}>Put</option></select>
          <input class="bt-in bt-num" data-row="${o.id}" data-f="strike" value="${o.strike == null ? '' : o.strike}" placeholder="strike" inputmode="decimal">
        </div>`
      : `<b>${esc(o.und)} ${o.cp === 'put' ? 'Put' : 'Call'} ${o.strike}</b><small>${esc(o.expiry)} · ${side}</small>`;
    return `<tr>
      <td class="bt-h">${name}</td>
      <td><input class="bt-in bt-num" data-row="${o.id}" data-f="qty" value="${+o.qty.toFixed(2)}" inputmode="decimal"></td>
      <td><input class="bt-in bt-num" data-row="${o.id}" data-f="delta" value="${o.delta == null ? '' : o.delta}" inputmode="decimal"></td>
      <td><input class="bt-in bt-num" data-row="${o.id}" data-f="spot" value="${o.spot == null ? '' : o.spot}" placeholder="${sp.v == null ? 'precio' : sp.v.toFixed(2)}" inputmode="decimal"
        title="${sp.v == null ? 'Sin precio del subyacente — escríbelo' : `Automático: ${esc(sp.from)}. Escribe un precio para fijarlo.`}"></td>
      <td><input class="bt-in bt-num" data-row="${o.id}" data-f="exp" value="${exp == null ? '' : exp.toFixed(2)}" inputmode="decimal"
        title="Exposición ajustada por delta como % del NAV. Si la cambias, se recalculan los contratos."><span class="bt-u">%</span></td>
      ${betaCells(x)}
      <td><b>${fmtB(x.contrib, 3)}</b>${o.fileContrib != null ? `<small>archivo ${fmtB(o.fileContrib, 3)}</small>` : ''}</td>
      ${deltaCell(x, baseMap)}
      <td class="bt-acts"><button type="button" class="bt-x" data-del="${o.id}" title="Quitar">×</button></td>
    </tr>`;
  }).join('');
  return `<div class="bt-card">
    <div class="bt-block-h">Opciones <span>exposición = delta × contratos × 100 × ${pf.basis === 'strike' ? 'strike' : 'precio del subyacente'} ÷ NAV · contribución = exposición × beta del subyacente</span></div>
    ${xs.length ? `<div class="bt-scroll"><table class="bt-t bt-edit">
      <thead><tr><th class="bt-h">Contrato</th><th>Contratos</th><th>Delta</th><th>Precio subyacente</th><th>Exposición</th><th class="bt-l">Fuente β</th><th>Beta</th><th>Contribución</th><th>Δ vs base</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table></div>` : '<div class="bt-muted bt-pad">Sin opciones.</div>'}
    <button type="button" class="bt-add" data-act="add-opt">+ Agregar opción</button>
    <p class="bt-note">Contratos negativos = vendidos. Delta por acción, con su signo (put negativo). Una put vendida suma beta; una call vendida o una put comprada resta.</p>
  </div>`;
}

// Contribution chart — one bar per position, grouped by colour; chips hide a group
// from the chart, its table and the visible total alike (the one predicate: vis).
const vis = (kind) => !pf.ch.hidden[kind];
function chartItems(cur) {
  return cur.items.filter((x) => vis(x.r.kind))
    .map((x) => ({ label: x.r.kind === 'option' ? `${x.r.und} ${x.r.cp === 'put' ? 'P' : 'C'}${x.r.strike ?? ''}` : (x.r.ticker || '—'), kind: x.r.kind, v: x.contrib, x }))
    .sort((a, b) => b.v - a.v);
}
function chartRange(list) {
  const n = list.length;
  const [a, b] = pf.ch.win || [0, n - 1];
  return [Math.max(0, a), Math.min(n - 1, b)];
}
function chartHead(cur) {
  const list = chartItems(cur), [a, b] = chartRange(list);
  const tot = list.slice(a, b + 1).reduce((s, i) => s + i.v, 0);
  const open = pf.ch.tbl === true;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Detalle de contribuciones
    <span class="rs-collap-sub">${open ? 'ocultar' : 'mostrar'} · ${b - a + 1} posiciones · suma visible ${fmtB(tot, 3)}</span>`;
}
function chartTable(cur) {
  const list = chartItems(cur), [a, b] = chartRange(list);
  const sl = list.slice(a, b + 1);
  return `<div class="rs-ft-cap">Contribución a la beta del portafolio (puntos de beta) · peso en % del NAV</div>
    <div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Posición</th><th class="bt-l">Grupo</th><th>Peso / exposición</th><th>Beta</th><th>Contribución</th></tr></thead><tbody>
    ${sl.map((i) => `<tr><td class="bt-h">${esc(i.label)}</td><td class="bt-l">${GROUPS[i.kind].label}</td><td>${fmtPct(i.x.w)}</td><td>${fmtB(i.x.beta, 3)}</td><td><b>${fmtB(i.v, 3)}</b></td></tr>`).join('')}
    </tbody><tfoot><tr><td class="bt-h">Suma visible</td><td></td><td></td><td></td><td><b>${fmtB(sl.reduce((s, i) => s + i.v, 0), 3)}</b></td></tr></tfoot></table></div>`;
}
function chartBlock(cur) {
  return `<div class="bt-card">
    <div class="bt-block-h">Contribución por posición <span>escenario · arrastra para acercar, doble clic restablece</span></div>
    <div class="bt-legend">${Object.entries(GROUPS).map(([k, g]) => `<button type="button" class="rs-leg${vis(k) ? '' : ' off'}" data-leg="${k}">
      <span class="ave-leg-act" style="background:${g.color}"></span>${g.label}</button>`).join('')}</div>
    <div class="bt-cv bt-cv-bar"><canvas id="bt-pf-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="1">${chartHead(cur)}</button>
      <div class="rs-collap-b"${pf.ch.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${chartTable(cur)}</div></div>
    </div>
  </div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  if (!root) return;
  if (chart) { chart.destroy(); chart = null; }
  if (!pf.base) {
    root.innerHTML = `${toolbar()}
      ${pf.err ? `<div class="bt-err">${esc(pf.err)}</div>` : ''}
      <div class="bt-empty">
        <b>Carga el export de contribución de beta de un portafolio</b> (CSV con columnas ticker, type, underlying,
        contract_type, strike, expiration, quantity, market_value, beta, delta, underlying_beta, beta_contribution).
        El archivo se lee en tu navegador y no se sube a ningún lado.
      </div>`;
    return;
  }
  const cur = evaluate(pf.rows), base = evaluate(pf.base);
  const baseMap = new Map(base.items.map((x) => [x.r.id, x]));
  const miss = cur.missing.filter((x) => x.beta == null).map((x) => x.T);
  root.innerHTML = `${toolbar()}
    ${pf.err ? `<div class="bt-err">${esc(pf.err)}</div>` : ''}
    ${tiles(base, cur)}
    ${miss.length ? `<div class="bt-warn">⚑ Sin beta, cuentan como 0: <b>${esc([...new Set(miss)].join(', '))}</b>. Calcúlala en la Calculadora o escríbela a mano.</div>` : ''}
    ${stockTable(cur, baseMap)}
    ${optTable(cur, baseMap)}
    ${chartBlock(cur)}`;
  requestAnimationFrame(() => buildChart(cur));
}

function buildChart(cur) {
  const cv = root && root.querySelector('#bt-pf-cv');
  if (!cv || typeof Chart === 'undefined') return;
  const list = chartItems(cur), [a, b] = chartRange(list);
  const sl = list.slice(a, b + 1);
  cv.parentElement.style.height = Math.max(180, sl.length * 24 + 50) + 'px';
  chart = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: sl.map((i) => i.label), datasets: [{ data: sl.map((i) => i.v), backgroundColor: sl.map((i) => GROUPS[i.kind].color), borderRadius: 3, barThickness: 14 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => `Contribución ${fmtB(x.parsed.x, 3)} · peso ${fmtPct(sl[x.dataIndex].x.w)} × β ${fmtB(sl[x.dataIndex].x.beta, 3)}` } } },
      scales: {
        x: { position: 'top', grid: { color: (t) => (t.tick.value === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)') },
          ticks: { font: { size: 10 }, callback: (v) => 'β ' + Number(v).toFixed(2) },
          min: pf.ch.xr ? pf.ch.xr[0] : undefined, max: pf.ch.xr ? pf.ch.xr[1] : undefined },
        y: { grid: { display: false }, ticks: { font: { size: 11 }, autoSkip: false } },
      },
    },
  });
  // Sideways drag zooms the contribution axis; a vertical drag narrows to those positions.
  attachBrush(cv, chart,
    (v1, v2) => { pf.ch.xr = [v1, v2]; render(); },
    (v1, v2) => { const i = Math.round(v1), j = Math.round(v2); if (i !== j) { pf.ch.win = [a + Math.min(i, j), a + Math.max(i, j)]; render(); } },
    () => { pf.ch.xr = null; pf.ch.win = null; render(); });
}

// ── Events ───────────────────────────────────────────────────────────────────
const rowById = (id) => pf.rows.find((r) => r.id === Number(id));

function onChange(e) {
  const t = e.target;
  if (t.matches('[data-file]')) {
    const f = t.files && t.files[0];
    if (!f) return;
    f.text().then((txt) => {
      try { loadCsv(txt, f.name); } catch (err) { pf.err = err.message; }
      render();
    });
    return;
  }
  if (t.matches('[data-nav]')) { const n = num(t.value); if (n > 0) pf.nav = n; return render(); }
  if (t.matches('[data-src]')) { pf.betaSrc[t.dataset.src] = t.value; return render(); }
  if (t.matches('[data-manual]')) { pf.manual[t.dataset.manual] = t.value; return render(); }
  if (t.matches('[data-row]')) {
    const r = rowById(t.dataset.row), f = t.dataset.f, v = t.value;
    if (!r) return;
    if (f === 'ticker' || f === 'und') r[f] = v.trim().toUpperCase();
    else if (f === 'cp') r.cp = v;
    else if (f === 'alloc') { const n = num(v); r.alloc = n == null ? 0 : n; }
    else if (f === 'qty') { const n = num(v); r.qty = n == null ? 0 : n; }
    else if (f === 'delta') r.delta = num(v);
    else if (f === 'strike') r.strike = num(v);
    else if (f === 'spot') r.spot = num(v);
    else if (f === 'exp') {
      // Back-solve contracts from a target delta-adjusted exposure.
      const n = num(v), p = priceFor(r, pf.rows);
      if (n != null && r.delta && p) r.qty = n / 100 * pf.nav / (r.delta * 100 * p);
    }
    return render();
  }
}

function onClick(e) {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.basis) { pf.basis = d.basis; pf.ch.xr = null; return render(); }
  if (d.allsrc) {
    const T = new Set(pf.rows.map(tickerOf));
    T.forEach((t) => { if (d.allsrc === 'calc' ? getSelected(t) : fileBetaOf(t, pf.base) != null) pf.betaSrc[t] = d.allsrc; });
    return render();
  }
  if (d.act === 'reset') { pf.rows = clone(pf.base); pf.ch.win = null; pf.ch.xr = null; return render(); }
  if (d.act === 'add-stock') { pf.rows.push({ id: ++_id, kind: 'stock', ticker: '', alloc: 0, px: null, fileBeta: null, isNew: true }); return render(); }
  if (d.act === 'add-opt') { pf.rows.push({ id: ++_id, kind: 'option', und: '', cp: 'call', strike: null, expiry: '', qty: 0, delta: null, prem: 0, spot: null, fileBeta: null, isNew: true }); return render(); }
  if (d.del) { pf.rows = pf.rows.filter((r) => r.id !== Number(d.del)); return render(); }
  if (d.calc) return openInCalc(d.calc);
  if (d.leg) { pf.ch.hidden[d.leg] = !pf.ch.hidden[d.leg]; pf.ch.win = null; return render(); }
  if (d.tbl) { pf.ch.tbl = pf.ch.tbl !== true; return render(); }
}

let _wired = false;
export function loadBetasPortfolio(el) {
  root = el;
  if (!_wired) {
    _wired = true;
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input.bt-in')) e.target.blur(); });
    onSelectedChange(() => render());
    loadEmbedded().then(() => render()).catch(() => {});   // spot fallback for underlyings we don't hold
  }
  render();
}

// Test/harness hook: load a CSV string directly.
export function loadPortfolioCsvText(text, name) {
  try { loadCsv(text, name || 'portafolio.csv'); } catch (err) { pf.err = err.message; }
  render();
}
