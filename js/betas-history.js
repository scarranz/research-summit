// Tools ▸ Betas ▸ History — every beta ever submitted from the Calculator.
//
// One row per submission, newest first: the beta chosen, which statistic it was,
// the full method (index, frequency, window, end date, rolling window, Blume
// α/anchor, price source) and the regression's statistics, plus who submitted it
// and an optional note. Filter by ticker, reopen a record in the Calculator with its
// exact method, delete, or export the whole history to CSV. When a ticker is
// filtered, a chart shows how its submitted beta has moved over time.

import {
  esc, fmtB, fmtPct, recordMethod, listHistory, historyTickers, removeHistory,
  onHistoryChange, openInCalc, HISTORY_COLUMNS, attachBrush,
} from './betas-core.js';

const hs = { ticker: '', open: null, confirm: null, ch: { hidden: {}, yr: null, win: null, tbl: false } };
let root = null, chart = null, _seq = 0;

// Imported records (betas that pre-date the tool) carry no method: say so, never "undefined".
const methodOf = (r) => recordMethod(r) || 'not recorded';
const dash = (v) => (v == null || v === '' ? '—' : esc(v));
const TYPE_SHORT = { raw: 'Window', adj: 'Adjusted', rlast: 'Rolling last', ravg: 'Rolling avg', rmed: 'Rolling median', manual: 'Manual', imported: 'Imported' };

function rows() {
  const all = listHistory();
  return hs.ticker ? all.filter((r) => r.ticker === hs.ticker) : all;
}

function toCsv(list) {
  const cell = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [HISTORY_COLUMNS.join(','), ...list.map((r) => HISTORY_COLUMNS.map((k) => cell(r[k])).join(','))].join('\n');
}
function download(list) {
  const blob = new Blob([toCsv(list)], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `beta_history_${hs.ticker || 'all'}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function detail(r) {
  const kv = (k, v) => `<div><span>${k}</span><b>${v}</b></div>`;
  const submitted = kv(r.beta_type === 'imported' ? 'Created' : 'Submitted',
    `${esc(r.submitted_at.replace('T', ' ').slice(0, r.beta_type === 'imported' ? 10 : 16))}${r.beta_type === 'imported' ? '' : ' UTC'}${r.submitted_by ? ' · ' + esc(r.submitted_by) : ''}`);
  if (!recordMethod(r)) {
    return `<tr class="bt-hdetail"><td colspan="10"><div class="bt-kv">
      ${kv('Beta', fmtB(r.beta, 3))}
      ${kv('Method', 'Not recorded — frequency, window and index are unknown')}
      ${submitted}
      ${r.note ? kv('Note', esc(r.note)) : ''}
    </div></td></tr>`;
  }
  return `<tr class="bt-hdetail"><td colspan="10"><div class="bt-kv">
    ${kv('Window', `${dash(r.window_start)} → ${dash(r.end_date)}`)}
    ${kv('Observations', dash(r.observations))}
    ${kv('Raw beta', fmtB(r.raw_beta, 3))}
    ${kv('Adjusted beta', `${fmtB(r.adjusted_beta, 3)} (α ${dash(r.blume_alpha)}, anchor ${dash(r.blume_anchor)})`)}
    ${kv('Std. error', `${fmtB(r.std_error, 3)} · 95% CI ${fmtB(r.ci_low)} to ${fmtB(r.ci_high)}`)}
    ${kv('Correlation', `${fmtB(r.correlation, 3)} · R² ${fmtPct(r.r_squared == null ? null : r.r_squared * 100, 1)}`)}
    ${kv('Annualized vol', `${esc(r.ticker)} ${fmtPct(r.stock_vol_pct, 1)} · ${dash(r.index_ticker)} ${fmtPct(r.index_vol_pct, 1)}`)}
    ${kv('Annualized alpha', fmtPct(r.alpha_annual_pct, 1))}
    ${kv(`Rolling (${dash(r.rolling_amount)} ${dash(r.rolling_unit)})`, `last ${fmtB(r.rolling_last)} · avg ${fmtB(r.rolling_avg)} · med ${fmtB(r.rolling_median)} · ${fmtB(r.rolling_min)} to ${fmtB(r.rolling_max)}`)}
    ${kv('Prices', `${dash(r.price_source)} · data as of ${dash(r.data_as_of)}`)}
    ${submitted}
    ${r.note ? kv('Note', esc(r.note)) : ''}
  </div></td></tr>`;
}

function table(list) {
  return `<div class="bt-scroll"><table class="bt-t bt-hist">
    <thead><tr><th class="bt-h">Submitted</th><th class="bt-l">Ticker</th><th>Beta</th><th class="bt-l">Type</th>
      <th class="bt-l">Method</th><th class="bt-l">Index</th><th>End date</th><th>n</th><th class="bt-l">Note</th><th></th></tr></thead>
    <tbody>${list.map((r) => `
      <tr class="bt-hrow${hs.open === r.id ? ' open' : ''}" data-row="${esc(r.id)}">
        <td class="bt-h">${esc(r.submitted_at.slice(0, 10))}<small>${r.beta_type === 'imported' ? 'creation date' : esc(r.submitted_at.slice(11, 16)) + ' UTC'}</small></td>
        <td class="bt-l"><b>${esc(r.ticker)}</b></td>
        <td><b>${fmtB(r.beta, 3)}</b></td>
        <td class="bt-l">${esc(TYPE_SHORT[r.beta_type] || r.beta_type)}</td>
        <td class="bt-l"><span class="bt-mtag${recordMethod(r) ? '' : ' nil'}">${esc(methodOf(r))}</span></td>
        <td class="bt-l">${dash(r.index_ticker)}</td>
        <td>${dash(r.end_date)}</td>
        <td>${dash(r.observations)}</td>
        <td class="bt-l bt-notecell" title="${esc(r.note || '')}">${esc(r.note || '')}</td>
        <td class="bt-acts">
          <button type="button" class="bt-link" data-load="${esc(r.id)}" title="${recordMethod(r) ? 'Open in the Calculator with this method' : 'Open this ticker in the Calculator'}">Open</button>
          ${hs.confirm === r.id
            ? `<button type="button" class="bt-link bt-danger" data-delyes="${esc(r.id)}">Delete?</button><button type="button" class="bt-link" data-delno="1">Cancel</button>`
            : `<button type="button" class="bt-x" data-del="${esc(r.id)}" title="Delete this record">×</button>`}
        </td>
      </tr>${hs.open === r.id ? detail(r) : ''}`).join('')}
    </tbody></table></div>`;
}

// ── The over-time chart (one ticker filtered) ────────────────────────────────
const SER = [
  { k: 'beta', label: 'Submitted beta', color: 'rgba(30,39,51,0.92)' },
  { k: 'ci', label: '95% CI', color: 'rgba(37,99,235,0.35)' },
];
const vis = (k) => !hs.ch.hidden[k];
function chartList() {
  return rows().slice().reverse();   // oldest → newest
}
function chartRange(n) {
  const [a, b] = hs.ch.win || [0, n - 1];
  return [Math.max(0, a), Math.min(n - 1, b)];
}
function chartHead(list) {
  const [a, b] = chartRange(list.length);
  const open = hs.ch.tbl === true;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Submissions over time
    <span class="rs-collap-sub">${open ? 'hide' : 'show'} · ${b - a + 1} submissions in range</span>`;
}
function chartTable(list) {
  const [a, b] = chartRange(list.length);
  return `<div class="rs-ft-cap">Beta (unitless) by submission · method shown per point</div>
    <div class="bt-tscroll"><table class="bt-t"><thead><tr><th class="bt-h">Submitted</th><th class="bt-l">Method</th>${vis('beta') ? '<th>Beta</th>' : ''}${vis('ci') ? '<th>CI low</th><th>CI high</th>' : ''}</tr></thead><tbody>
    ${list.slice(a, b + 1).map((r) => `<tr><td class="bt-h">${esc(r.submitted_at.slice(0, 16).replace('T', ' '))}</td><td class="bt-l">${esc(methodOf(r))} · ${esc(TYPE_SHORT[r.beta_type] || r.beta_type)}</td>${vis('beta') ? `<td>${fmtB(r.beta, 3)}</td>` : ''}${vis('ci') ? `<td>${fmtB(r.ci_low, 3)}</td><td>${fmtB(r.ci_high, 3)}</td>` : ''}</tr>`).join('')}
    </tbody></table></div>`;
}
function chartBlock(list) {
  if (!hs.ticker || list.length < 2) return '';
  return `<div class="bt-card">
    <div class="bt-block-h">${esc(hs.ticker)} — submitted beta over time <span>one point per submission · drag to zoom, double-click to reset</span></div>
    <div class="bt-legend">${SER.map((s) => `<button type="button" class="rs-leg${vis(s.k) ? '' : ' off'}" data-leg="${s.k}">
      <span class="rs-leg-line" style="background:${s.color}"></span>${s.label}</button>`).join('')}</div>
    <div class="bt-cv"><canvas id="bt-hist-cv"></canvas></div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" data-tbl="1">${chartHead(list)}</button>
      <div class="rs-collap-b"${hs.ch.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${chartTable(list)}</div></div>
    </div>
  </div>`;
}
function buildChart(list) {
  const cv = root && root.querySelector('#bt-hist-cv');
  if (!cv || typeof Chart === 'undefined') return;
  const [a, b] = chartRange(list.length);
  const sl = list.slice(a, b + 1);
  const labels = sl.map((r) => r.submitted_at.slice(0, 10));
  const ds = [];
  if (vis('ci')) {
    ds.push({ label: 'CI high', data: sl.map((r) => r.ci_high), borderColor: 'transparent', backgroundColor: 'rgba(37,99,235,0.12)', pointRadius: 0, fill: '+1' });
    ds.push({ label: 'CI low', data: sl.map((r) => r.ci_low), borderColor: 'transparent', pointRadius: 0, fill: false });
  }
  if (vis('beta')) ds.push({ label: 'Beta', data: sl.map((r) => r.beta), borderColor: SER[0].color, backgroundColor: SER[0].color, borderWidth: 2, pointRadius: 4, tension: 0 });
  chart = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels, datasets: ds },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          title: (x) => { const r = sl[x[0].dataIndex]; return `${r.submitted_at.slice(0, 16).replace('T', ' ')} · ${methodOf(r)}${r.index_ticker ? ' vs ' + r.index_ticker : ''}`; },
          label: (x) => `${x.dataset.label}: ${fmtB(x.parsed.y, 3)}`,
        } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0 } },
        y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, callback: (v) => 'β ' + Number(v).toFixed(2) },
          min: hs.ch.yr ? hs.ch.yr[0] : undefined, max: hs.ch.yr ? hs.ch.yr[1] : undefined },
      },
    },
  });
  attachBrush(cv, chart,
    (i, j) => { hs.ch.win = [a + i, a + j]; render(); },
    (v1, v2) => { hs.ch.yr = [v1, v2]; render(); },
    () => { hs.ch.win = null; hs.ch.yr = null; render(); });
}

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  if (!root) return;
  if (chart) { chart.destroy(); chart = null; }
  const tickers = historyTickers();
  if (hs.ticker && !tickers.includes(hs.ticker)) hs.ticker = '';
  const list = rows();
  if (!listHistory().length) {
    root.innerHTML = `<div class="bt-empty"><b>No betas submitted yet.</b> Calculate a beta in the Calculator, pick
      which number to keep and press <b>Submit</b> — every submission is recorded here with its method and statistics.</div>`;
    return;
  }
  const cl = chartList();
  root.innerHTML = `
    <div class="bt-card bt-ctl">
      <div class="bt-row">
        <label class="bt-f"><span>Ticker</span>
          <select class="bt-in" data-filter>
            <option value="">All tickers (${listHistory().length})</option>
            ${tickers.map((t) => `<option value="${esc(t)}"${t === hs.ticker ? ' selected' : ''}>${esc(t)}</option>`).join('')}
          </select></label>
        <div class="bt-f"><span>&nbsp;</span><button type="button" class="bt-btn bt-ghost" data-act="export">Export CSV (${list.length})</button></div>
      </div>
    </div>
    ${chartBlock(cl)}
    <div class="bt-card">
      <div class="bt-block-h">Submitted betas <span>newest first · click a row for the full statistics</span></div>
      ${table(list)}
    </div>
    <p class="bt-note">Saved in this browser for now — not shared with the team and lost if the browser's site data is
      cleared. Export CSV keeps a copy. The record shape matches the planned <code>beta_history</code> table.</p>`;
  const seq = ++_seq;
  if (hs.ticker && cl.length >= 2) requestAnimationFrame(() => { if (seq === _seq) buildChart(cl); });
}

function onClick(e) {
  const b = e.target.closest('button, tr.bt-hrow');
  if (!b) return;
  const d = b.dataset;
  if (b.tagName === 'TR') { hs.open = hs.open === d.row ? null : d.row; hs.confirm = null; return render(); }
  e.stopPropagation();
  if (d.act === 'export') return download(rows());
  if (d.load) { const r = listHistory().find((x) => x.id === d.load); if (r) openInCalc(r.ticker, r); return; }
  if (d.del) { hs.confirm = d.del; return render(); }
  if (d.delno) { hs.confirm = null; return render(); }
  if (d.delyes) { hs.confirm = null; removeHistory(d.delyes); return; }
  if (d.leg) { hs.ch.hidden[d.leg] = !hs.ch.hidden[d.leg]; return render(); }
  if (d.tbl) { hs.ch.tbl = hs.ch.tbl !== true; return render(); }
}

let _wired = false;
export function loadBetasHistory(el) {
  root = el;
  if (!_wired) {
    _wired = true;
    root.addEventListener('click', onClick);
    root.addEventListener('change', (e) => {
      if (e.target.matches('[data-filter]')) {
        hs.ticker = e.target.value; hs.open = null; hs.ch = { hidden: {}, yr: null, win: null, tbl: false };
        render();
      }
    });
    onHistoryChange(() => render());
  }
  render();
}

export function filterHistory(t) { hs.ticker = t || ''; render(); }
