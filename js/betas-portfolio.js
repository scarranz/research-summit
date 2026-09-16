// Tools ▸ Betas ▸ Portfolio — a portfolio beta from manually entered weights.
//
// The portal has no feed of the actual book, so the weights are typed in: one row per
// position, either a stock / ETF (weight = % of NAV) or a derivative (weight = its
// delta-adjusted exposure as a signed % of NAV, i.e. delta × contracts × 100 × spot
// ÷ NAV). Each row's beta is the latest one submitted for that ticker in the
// Calculator (with its method shown), or a manual number.
//
//   contribution = weight % × beta          (a derivative uses its underlying's beta)
//   cash         = 100% − stock weights, beta 0
//
// Rows persist in this browser (localStorage) so the weights survive a reload.

import {
  esc, fmtB, fmtPct, num, FREQS, lookTag, latestFor, onHistoryChange, openInCalc, attachBrush,
} from './betas-core.js';

const KEY = 'betas-portfolio-v1';
const KINDS = {
  stock:  { label: 'Stock / ETF', color: 'rgba(30,39,51,0.92)' },
  deriv:  { label: 'Derivative (delta-adj.)', color: '#2563EB' },
};

let rows = (() => {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
})();
const ps = { confirmClear: false, ch: { hidden: {}, xr: null, win: null, tbl: false } };
let root = null, chart = null, _seq = 0;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { /* private mode */ } };
const newId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function betaFor(r) {
  if (r.src === 'manual') return { v: num(r.manual), rec: null };
  const rec = r.ticker ? latestFor(r.ticker) : null;
  return { v: rec ? rec.beta : null, rec };
}

function evaluate() {
  const items = rows.map((r) => {
    const w = num(r.weight), b = betaFor(r);
    const contrib = w == null || b.v == null ? 0 : w * b.v / 100;
    return { r, w, beta: b.v, rec: b.rec, contrib };
  });
  const sum = (k) => items.filter((x) => x.r.kind === k).reduce((a, x) => a + x.contrib, 0);
  const stockW = items.filter((x) => x.r.kind === 'stock').reduce((a, x) => a + (x.w || 0), 0);
  const derivW = items.filter((x) => x.r.kind === 'deriv').reduce((a, x) => a + (x.w || 0), 0);
  const missing = items.filter((x) => x.r.ticker && x.w && x.beta == null);
  return {
    items, stock: sum('stock'), deriv: sum('deriv'), total: items.reduce((a, x) => a + x.contrib, 0),
    stockW, derivW, cash: 100 - stockW, missing,
    missingW: missing.reduce((a, x) => a + Math.abs(x.w), 0),
  };
}

// ── Markup ───────────────────────────────────────────────────────────────────
function tiles(ev) {
  const tile = (h, v, s) => `<div class="bt-tile"><div class="bt-tile-h">${h}</div><div class="bt-tile-v">${v}</div><div class="bt-tile-s">${s}</div></div>`;
  return `<div class="bt-tiles">
    ${tile('Portfolio beta', fmtB(ev.total, 3), 'Σ weight × beta · cash counts as 0')}
    ${tile('Stocks & ETFs', fmtB(ev.stock, 3), `${fmtPct(ev.stockW, 1)} of NAV`)}
    ${tile('Derivatives', fmtB(ev.deriv, 3), `${fmtPct(ev.derivW, 1)} delta-adjusted exposure`)}
    ${tile('Cash', fmtPct(ev.cash, 1), ev.cash < -0.005 ? 'negative — weights exceed 100%' : '100% − stock weights')}
    ${tile('Without beta', fmtPct(ev.missingW, 1), ev.missing.length ? `${ev.missing.length} position${ev.missing.length === 1 ? '' : 's'} counted as β 0` : 'every weighted position has a beta')}
  </div>`;
}

function betaCell(x) {
  const r = x.r;
  const sel = `<select class="bt-in bt-src" data-row="${esc(r.id)}" data-f="src">
      <option value="latest"${r.src !== 'manual' ? ' selected' : ''}>Latest submitted</option>
      <option value="manual"${r.src === 'manual' ? ' selected' : ''}>Manual</option></select>`;
  let val;
  if (r.src === 'manual') {
    val = `<input class="bt-in bt-num" data-row="${esc(r.id)}" data-f="manual" value="${esc(r.manual == null ? '' : r.manual)}" placeholder="β" inputmode="decimal">`;
  } else if (x.rec) {
    const m = x.rec;
    val = `<b>${fmtB(m.beta, 3)}</b><small>${esc(`${lookTag(m.window_amount, m.window_unit === 'months' ? 'm' : 'y')}·${FREQS[m.frequency] ? FREQS[m.frequency].short : '?'} vs ${m.index_ticker} · ${m.submitted_at.slice(0, 10)}`)}</small>`;
  } else {
    val = r.ticker ? '<span class="rs-noguide">no beta</span>' : '<span class="bt-muted">—</span>';
  }
  return `<td class="bt-l">${sel}</td><td>${val}</td>`;
}

function table(ev) {
  const body = ev.items.map((x) => {
    const r = x.r;
    return `<tr>
      <td class="bt-h"><input class="bt-in bt-tk" data-row="${esc(r.id)}" data-f="ticker" value="${esc(r.ticker)}" placeholder="TICKER" spellcheck="false"></td>
      <td class="bt-l"><select class="bt-in" data-row="${esc(r.id)}" data-f="kind">${Object.entries(KINDS).map(([k, v]) =>
        `<option value="${k}"${r.kind === k ? ' selected' : ''}>${v.label}</option>`).join('')}</select></td>
      <td><input class="bt-in bt-num" data-row="${esc(r.id)}" data-f="weight" value="${esc(r.weight == null ? '' : r.weight)}" placeholder="0.00" inputmode="decimal"><span class="bt-u">%</span></td>
      ${betaCell(x)}
      <td><b>${fmtB(x.contrib, 3)}</b></td>
      <td class="bt-acts">${r.ticker ? `<button type="button" class="bt-link" data-calc="${esc(r.ticker)}" title="Open ${esc(r.ticker)} in the Calculator">calc</button>` : ''}
        <button type="button" class="bt-x" data-del="${esc(r.id)}" title="Remove">×</button></td>
    </tr>`;
  }).join('');
  return `<div class="bt-card">
    <div class="bt-block-h">Positions <span>weights typed in · derivatives as signed delta-adjusted exposure</span></div>
    ${rows.length ? `<div class="bt-scroll"><table class="bt-t bt-edit">
      <thead><tr><th class="bt-h">Ticker</th><th class="bt-l">Type</th><th>Weight</th><th class="bt-l">Beta source</th><th>Beta</th><th>Contribution</th><th></th></tr></thead>
      <tbody>${body}</tbody>
      <tfoot>
        <tr><td class="bt-h">Cash</td><td class="bt-l"></td><td>${fmtPct(ev.cash, 2)}</td><td class="bt-l">—</td><td>0.000</td><td>0.000</td><td></td></tr>
        <tr class="bt-total"><td class="bt-h">Portfolio</td><td class="bt-l"></td><td>${fmtPct(ev.stockW + Math.max(ev.cash, 0), 1)}</td><td class="bt-l"></td><td></td><td><b>${fmtB(ev.total, 3)}</b></td><td></td></tr>
      </tfoot></table></div>` : '<div class="bt-muted bt-pad">No positions yet.</div>'}
    <div class="bt-inline bt-actions">
      <button type="button" class="bt-add" data-act="add-stock">+ Add stock / ETF</button>
      <button type="button" class="bt-add" data-act="add-deriv">+ Add derivative</button>
      ${rows.length ? (ps.confirmClear
        ? `<span class="bt-muted">Remove all positions?</span><button type="button" class="bt-link bt-danger" data-act="clear-yes">Yes, clear</button><button type="button" class="bt-link" data-act="clear-no">Cancel</button>`
        : '<button type="button" class="bt-link" data-act="clear">Clear all</button>') : ''}
    </div>
    <p class="bt-note">Derivative weight = delta × contracts × 100 × underlying price ÷ NAV, with its sign: a short put or
      long call is positive, a short call or long put is negative. Its beta is the underlying's — delta turns the option
      into equivalent shares, beta turns those shares into market exposure.</p>
  </div>`;
}

// Contribution chart — chips hide a type from the chart, its table and the visible total.
const vis = (k) => !ps.ch.hidden[k];
function chartItems(ev) {
  return ev.items.filter((x) => x.r.ticker && vis(x.r.kind))
    .map((x) => ({ label: x.r.kind === 'deriv' ? `${x.r.ticker} (deriv.)` : x.r.ticker, kind: x.r.kind, v: x.contrib, x }))
    .sort((a, b) => b.v - a.v);
}
function chartRange(n) {
  const [a, b] = ps.ch.win || [0, n - 1];
  return [Math.max(0, a), Math.min(n - 1, b)];
}
function chartHead(ev) {
  const list = chartItems(ev), [a, b] = chartRange(list.length);
  const open = ps.ch.tbl === true;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Contribution detail
    <span class="rs-collap-sub">${open ? 'hide' : 'show'} · ${Math.max(0, b - a + 1)} positions · visible sum ${fmtB(list.slice(a, b + 1).reduce((s, i) => s + i.v, 0), 3)}</span>`;
}
function chartTable(ev) {
  const list = chartItems(ev), [a, b] = chartRange(list.length), sl = list.slice(a, b + 1);
  return `<div class="rs-ft-cap">Contribution to portfolio beta (beta points) · weight in % of NAV</div>
    <div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Position</th><th class="bt-l">Type</th><th>Weight</th><th>Beta</th><th>Contribution</th></tr></thead><tbody>
    ${sl.map((i) => `<tr><td class="bt-h">${esc(i.label)}</td><td class="bt-l">${KINDS[i.kind].label}</td><td>${fmtPct(i.x.w)}</td><td>${fmtB(i.x.beta, 3)}</td><td><b>${fmtB(i.v, 3)}</b></td></tr>`).join('')}
    </tbody><tfoot><tr><td class="bt-h">Visible sum</td><td></td><td></td><td></td><td><b>${fmtB(sl.reduce((s, i) => s + i.v, 0), 3)}</b></td></tr></tfoot></table></div>`;
}
function chartBlock(ev) {
  if (!ev.items.some((x) => x.r.ticker)) return '';
  return `<div class="bt-card">
    <div class="bt-block-h">Contribution by position <span>drag to zoom, double-click to reset</span></div>
    <div class="bt-legend">${Object.entries(KINDS).map(([k, g]) => `<button type="button" class="rs-leg${vis(k) ? '' : ' off'}" data-leg="${k}">
      <span class="ave-leg-act" style="background:${g.color}"></span>${g.label}</button>`).join('')}</div>
    <div class="bt-cv bt-cv-bar"><canvas id="bt-pf-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="1">${chartHead(ev)}</button>
      <div class="rs-collap-b"${ps.ch.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${chartTable(ev)}</div></div>
    </div>
  </div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  if (!root) return;
  if (chart) { chart.destroy(); chart = null; }
  const ev = evaluate();
  root.innerHTML = `${tiles(ev)}
    ${ev.missing.length ? `<div class="bt-warn">⚑ No beta, counted as 0: <b>${esc([...new Set(ev.missing.map((x) => x.r.ticker))].join(', '))}</b>. Submit one from the Calculator or enter it manually.</div>` : ''}
    ${table(ev)}
    ${chartBlock(ev)}`;
  const seq = ++_seq;
  requestAnimationFrame(() => { if (seq === _seq) buildChart(ev); });
}

function buildChart(ev) {
  const cv = root && root.querySelector('#bt-pf-cv');
  if (!cv || typeof Chart === 'undefined') return;
  const list = chartItems(ev), [a, b] = chartRange(list.length), sl = list.slice(a, b + 1);
  cv.parentElement.style.height = Math.max(160, sl.length * 24 + 50) + 'px';
  chart = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: sl.map((i) => i.label), datasets: [{ data: sl.map((i) => i.v), backgroundColor: sl.map((i) => KINDS[i.kind].color), borderRadius: 3, barThickness: 14 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => `Contribution ${fmtB(x.parsed.x, 3)} · weight ${fmtPct(sl[x.dataIndex].x.w)} × β ${fmtB(sl[x.dataIndex].x.beta, 3)}` } } },
      scales: {
        x: { position: 'top', grid: { color: (t) => (t.tick.value === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)') },
          ticks: { font: { size: 10 }, callback: (v) => 'β ' + Number(v).toFixed(2) },
          min: ps.ch.xr ? ps.ch.xr[0] : undefined, max: ps.ch.xr ? ps.ch.xr[1] : undefined },
        y: { grid: { display: false }, ticks: { font: { size: 11 }, autoSkip: false } },
      },
    },
  });
  // Sideways drag zooms the contribution axis; a vertical drag narrows to those positions.
  attachBrush(cv, chart,
    (v1, v2) => { ps.ch.xr = [v1, v2]; render(); },
    (v1, v2) => { const i = Math.round(v1), j = Math.round(v2); if (i !== j) { ps.ch.win = [a + Math.min(i, j), a + Math.max(i, j)]; render(); } },
    () => { ps.ch.xr = null; ps.ch.win = null; render(); });
}

// ── Events ───────────────────────────────────────────────────────────────────
function onChange(e) {
  const t = e.target;
  if (!t.matches('[data-row]')) return;
  const r = rows.find((x) => x.id === t.dataset.row);
  if (!r) return;
  const f = t.dataset.f;
  if (f === 'ticker') r.ticker = t.value.trim().toUpperCase();
  else if (f === 'weight' || f === 'manual') { const n = num(t.value); r[f] = n; }
  else r[f] = t.value;
  save();
  render();
}

function onClick(e) {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.act === 'add-stock' || d.act === 'add-deriv') {
    rows.push({ id: newId(), ticker: '', kind: d.act === 'add-deriv' ? 'deriv' : 'stock', weight: null, src: 'latest', manual: null });
    save(); render();
    const inputs = root.querySelectorAll('input[data-f="ticker"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
    return;
  }
  if (d.act === 'clear') { ps.confirmClear = true; return render(); }
  if (d.act === 'clear-no') { ps.confirmClear = false; return render(); }
  if (d.act === 'clear-yes') { rows = []; ps.confirmClear = false; save(); return render(); }
  if (d.del) { rows = rows.filter((r) => r.id !== d.del); save(); return render(); }
  if (d.calc) return openInCalc(d.calc, latestFor(d.calc));
  if (d.leg) { ps.ch.hidden[d.leg] = !ps.ch.hidden[d.leg]; ps.ch.win = null; return render(); }
  if (d.tbl) { ps.ch.tbl = ps.ch.tbl !== true; return render(); }
}

let _wired = false;
export function loadBetasPortfolio(el) {
  root = el;
  if (!_wired) {
    _wired = true;
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input.bt-in')) e.target.blur(); });
    onHistoryChange(() => render());
  }
  render();
}
