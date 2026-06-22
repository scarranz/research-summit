// fund-returns.js — Fund Returns tab: "Performance Analysis" dashboard.
// Replicates the content of presentation slides 2 & 3, reorganized for a
// dashboard: executive KPI strip, a hero cumulative chart, the slide-2 detail
// tables, and themed sections for absolute and relative (alpha) monthly returns.
// All figures are derived live from the two daily series — nothing hardcoded,
// so new months (incl. 2026) appear automatically.
import { getStrategy, getBenchmark } from './fund-data.js';
import * as C from './fund-calc.js';

const RFR_DEFAULT = 0.045;
const LOOKBACK_DEFAULT = 12; // months (TTM window)
const COLOR = { summit: '#44546A', bench: '#808080', neg: '#C0392B', grid: '#E7EAEE', mu: '#8A93A0' };

let _strategy = null;   // full aligned series, loaded once
let _bench = null;
let _charts = {};
let _winLen = 3;        // Rolling Window Analysis: window length in years
let _winStart = null;   // ...and chosen start year (null = auto-pick latest)

export async function loadFundReturnsPage() {
  const root = document.getElementById('fr-root');
  if (!root) return;

  root.innerHTML = `
    <div class="fr-head">
      <div class="fr-meta" id="fr-meta"></div>
      <div class="fr-controls">
        <label class="fr-ctl">From <input type="date" id="fr-ini"></label>
        <label class="fr-ctl">To <input type="date" id="fr-fin"></label>
        <label class="fr-ctl">RFR <input type="number" id="fr-rfr" step="0.1" style="width:64px"></label>
        <span id="fr-badge" class="fr-badge"></span>
      </div>
    </div>
    <div id="fr-msg" class="fr-msg" style="display:none"></div>

    <div class="fr-hero">
      <div class="card">
        <div class="fr-charttitle">Total Return — Summit vs S&amp;P 500</div>
        <div class="fr-canvas-wrap"><canvas id="fr-cum"></canvas></div>
        <div class="fr-foot">*Cumulative daily total return of Summit and S&amp;P 500</div>
      </div>
      <div class="card">
        <div class="fr-charttitle">Cumulative Performance vs Benchmark</div>
        <div class="fr-canvas-wrap fr-canvas-short"><canvas id="fr-alpha"></canvas></div>
        <div class="fr-foot">*Cumulative difference in returns between Summit and S&amp;P 500</div>
      </div>
    </div>

    <div class="fr-tables">
      <div class="fr-tcol">
        <div class="card"><div class="fr-charttitle">Performance &amp; Risk Analysis</div><div id="fr-t-analysis"></div></div>
        <div class="card"><div class="fr-charttitle">Rolling Window Analysis</div><div id="fr-window"></div></div>
      </div>
      <div class="fr-tcol">
        <div class="card"><div class="fr-charttitle">Performance &amp; Risk Metrics</div><div id="fr-t-metrics"></div></div>
        <div class="card"><div class="fr-charttitle">Capture Ratios</div><div id="fr-t-capture"></div>
          <div class="fr-foot">*Calculated with monthly returns</div></div>
      </div>
    </div>

    <div class="card fr-section">
      <div class="fr-charttitle">Absolute Return — Monthly (Summit)</div>
      <div class="fr-secgrid">
        <div class="fr-canvas-wrap"><canvas id="fr-mbars"></canvas></div>
        <div id="fr-abs-stats"></div>
        <div class="fr-canvas-wrap"><canvas id="fr-mhist"></canvas></div>
      </div>
    </div>

    <div class="card fr-section">
      <div class="fr-charttitle">Relative Return vs Benchmark — Monthly (Alpha)</div>
      <div class="fr-secgrid">
        <div class="fr-canvas-wrap"><canvas id="fr-abars"></canvas></div>
        <div id="fr-rel-stats"></div>
        <div class="fr-canvas-wrap"><canvas id="fr-ahist"></canvas></div>
      </div>
    </div>

    <div class="card fr-section">
      <div class="fr-charttitle">Monthly Returns — Summit, S&amp;P 500 &amp; Alpha</div>
      <div id="fr-monthly"></div>
    </div>`;

  try {
    if (!_strategy) {
      _strategy = await getStrategy();
      _bench = await getBenchmark(_strategy.map(p => p.date));
    }
  } catch (err) {
    showMessage(root, `No se pudieron cargar los datos: ${err.message}. ` +
      `En esta fase de diseño los CSV solo existen en el servidor local.`);
    return;
  }

  const dmin = _strategy[0].date, dmax = _strategy[_strategy.length - 1].date;
  document.getElementById('fr-ini').value = iso(dmin);
  document.getElementById('fr-fin').value = iso(dmax);
  document.getElementById('fr-rfr').value = (RFR_DEFAULT * 100).toFixed(1);
  ['fr-ini', 'fr-fin', 'fr-rfr'].forEach(id =>
    document.getElementById(id).addEventListener('change', recompute));
  recompute();
}

function recompute() {
  const ini = parseInput(document.getElementById('fr-ini').value);
  const fin = parseInput(document.getElementById('fr-fin').value);
  const rfr = (parseFloat(document.getElementById('fr-rfr').value) || 0) / 100;
  if (!ini || !fin || ini > fin) { setBadge('Invalid range', 'warn'); return; }

  // filter both series together (they are index-aligned by date)
  const s = [], b = [];
  for (let i = 0; i < _strategy.length; i++) {
    const d = _strategy[i].date;
    if (d >= ini && d <= fin) { s.push(_strategy[i]); b.push(_bench[i]); }
  }
  if (s.length === 0) { setBadge('No data in range', 'warn'); return; }

  const sArr = C.rets(s), bArr = C.rets(b);
  // M holds just what the validation badge checks (the detail tables compute
  // their own figures).
  const M = {
    totalS: C.totalReturnArr(sArr), totalB: C.totalReturnArr(bArr),
    volS: C.volArr(sArr, false), corr: C.correlation(sArr, bArr),
  };
  const sM = C.monthlySeries(s), bM = C.monthlySeries(b);
  const ma = C.monthlyAligned(sM, bM);
  const capture = C.captureRatios(ma.a, ma.b);

  renderMeta(s, b);
  renderAnalysisTable(s, b, ini, fin);
  renderMetricsTable(s, b, ini, fin, rfr);
  renderCaptureTable(capture);
  renderCumChart(s, b);
  renderAlphaChart(s, b);
  renderMonthlyBars('fr-mbars', ma.labels, ma.a);
  renderMonthlyBars('fr-abars', ma.labels, ma.alpha);
  renderStatsBlock('fr-abs-stats', ma.a, ma.labels, 'Up', 'Down', true);
  renderStatsBlock('fr-rel-stats', ma.alpha, ma.labels, 'Winning', 'Losing', false);
  renderHistogram('fr-mhist', ma.a, 0.02, 'Monthly Return');
  renderHistogram('fr-ahist', ma.alpha, 0.01, 'Monthly Alpha');
  renderWindowTable();
  renderMonthlyTable(ma);

  // validation badge vs PowerShell reference for the full default range
  const full = iso(_strategy[0].date) === document.getElementById('fr-ini').value
    && iso(_strategy[_strategy.length - 1].date) === document.getElementById('fr-fin').value;
  if (full) {
    const ok = near(M.totalS, 0.6165) && near(M.volS, 0.1858) && near(M.totalB, 0.5722) && near(M.corr, 0.821, 0.002);
    setBadge(ok ? '✓ Engine validated' : '✗ Mismatch', ok ? 'ok' : 'warn');
  } else setBadge('Custom range', 'neutral');
}

// ─── Renderers: header + KPIs ───────────────────────────────
function renderMeta(s, b) {
  const d0 = s[0].date, d1 = s[s.length - 1].date;
  document.getElementById('fr-meta').innerHTML = `
    <div class="fr-meta-row">
      <span><b>Summit Management</b></span><span>Benchmark: <b>S&amp;P 500</b></span>
      <span>Start: <b>${fmtDate(d0)}</b></span><span>End: <b>${fmtDate(d1)}</b></span><span>Currency: <b>USD</b></span>
    </div>
    <div class="fr-meta-row fr-meta-sub">
      <span>Benchmark Proxy: SPY</span><span>Period: ${fmtMonthLong(d0)} – ${fmtMonthLong(d1)}</span>
      <span class="fr-source">Portfolio: EGB · sample data — pending DB/Massive</span>
    </div>`;
}

// ─── Renderers: tables ──────────────────────────────────────
function renderAnalysisTable(s, b, ini, fin) {
  const years = [...new Set(s.map(p => p.date.getFullYear()))].sort((a, c) => c - a);
  const rowFor = (label, sSlice, bSlice, mode) => {
    const sr = C.rets(sSlice), br = C.rets(bSlice);
    const ret = (a) => mode === 'annualized' ? pct(C.annualizedArr(a)) : pct(C.totalReturnArr(a));
    const vol = (a) => mode === 'overall' ? '—' : pct(C.volArr(a, false));
    const rar = (a) => mode === 'overall' ? '—' : num(C.riskAdjusted(a));
    return `<tr><td class="fr-rl">${label}</td>
      <td>${ret(sr)}</td><td class="fr-bm">${ret(br)}</td>
      <td>${vol(sr)}</td><td class="fr-bm">${vol(br)}</td>
      <td>${rar(sr)}</td><td class="fr-bm">${rar(br)}</td></tr>`;
  };
  let rows = years.map(y => rowFor(y, C.yearSlice(s, y), C.yearSlice(b, y), 'year')).join('');
  rows += rowFor('Annualized', s, b, 'annualized');
  rows += rowFor('Overall', s, b, 'overall');
  document.getElementById('fr-t-analysis').innerHTML = `
    <table class="fr-table">
      <thead>
        <tr><th></th><th colspan="2">Return</th><th colspan="2">Volatility</th><th colspan="2">Risk Adjusted</th></tr>
        <tr><th></th><th>Summit</th><th class="fr-bm">S&amp;P</th><th>Summit</th><th class="fr-bm">S&amp;P</th><th>Summit</th><th class="fr-bm">S&amp;P</th></tr>
      </thead><tbody>${rows}</tbody></table>`;
}

function renderMetricsTable(s, b, ini, fin, rfr) {
  // TTM window = last LOOKBACK months
  const ttmStart = new Date(fin.getFullYear(), fin.getMonth() - LOOKBACK_DEFAULT, fin.getDate());
  const sTtm = s.filter(p => p.date >= ttmStart), bTtm = b.filter(p => p.date >= ttmStart);
  const aT = C.rets(sTtm), bT = C.rets(bTtm), aP = C.rets(s), bP = C.rets(b);
  const row = (label, ttmS, ttmB, perS, perB) =>
    `<tr><td class="fr-rl">${label}</td><td>${ttmS}</td><td class="fr-bm">${ttmB}</td><td>${perS}</td><td class="fr-bm">${perB}</td></tr>`;
  const dash = '—';
  const html = `
    <table class="fr-table">
      <thead>
        <tr><th></th><th colspan="2">TTM</th><th colspan="2">Period</th></tr>
        <tr><th></th><th>Summit</th><th class="fr-bm">S&amp;P</th><th>Summit</th><th class="fr-bm">S&amp;P</th></tr>
      </thead><tbody>
      ${row('Standard Deviation', pct(C.volArr(aT, true)), pct(C.volArr(bT, true)), pct(C.volArr(aP, false)), pct(C.volArr(bP, false)))}
      ${row('Beta Ante', num(C.betaAnte(sTtm)), dash, num(C.betaAnte(s)), dash)}
      ${row('Beta Post', num(C.betaPost(aT, bT)), dash, num(C.betaPost(aP, bP)), dash)}
      ${row('Correlation', pct(C.correlation(aT, bT), 1), dash, pct(C.correlation(aP, bP), 1), dash)}
      ${row('Information Ratio', num(C.informationRatio(aT, bT)), dash, num(C.informationRatio(aP, bP)), dash)}
      ${row('Sharpe Ratio', num(C.sharpe(aT, rfr, true)), num(C.sharpe(bT, rfr, true)), num(C.sharpe(aP, rfr, false)), num(C.sharpe(bP, rfr, false)))}
      </tbody></table>`;
  document.getElementById('fr-t-metrics').innerHTML = html;
}

function renderCaptureTable(c) {
  document.getElementById('fr-t-capture').innerHTML = `
    <table class="fr-table">
      <thead><tr><th></th><th>Summit</th><th class="fr-bm">S&amp;P</th><th>Capture</th></tr></thead>
      <tbody>
        <tr><td class="fr-rl">Upside Avg</td><td>${pct(c.upSummit)}</td><td class="fr-bm">${pct(c.upBench)}</td><td>${num(c.captureUp)}</td></tr>
        <tr><td class="fr-rl">Downside Avg</td><td>${pct(c.dnSummit)}</td><td class="fr-bm">${pct(c.dnBench)}</td><td>${num(c.captureDown)}</td></tr>
        <tr class="fr-hi"><td class="fr-rl">Capture Ratio</td><td colspan="2"></td><td>${num(c.ratio)}</td></tr>
      </tbody></table>`;
}

function renderStatsBlock(id, values, labels, posName, negName, downInclusiveZero) {
  const st = C.periodStats(values, { downInclusiveZero });
  const bw = C.bestWorst(values.map((r, i) => ({ r, year: labels[i].year, month: labels[i].month })), 3);
  const r = (a, b, c) => `<tr><td class="fr-rl">${a}</td><td>${b}</td><td>${c}</td><td></td></tr>`;
  const stats = `
    <table class="fr-table fr-table-sm">
      <thead><tr><th></th><th>${posName}</th><th>${negName}</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td class="fr-rl">Number</td><td>${st.up.number}</td><td>${st.down.number}</td><td>${st.total.number}</td></tr>
        <tr><td class="fr-rl">Percentage</td><td>${pct(st.up.pct, 1)}</td><td>${pct(st.down.pct, 1)}</td><td>100%</td></tr>
        <tr><td class="fr-rl">Average</td><td>${pct(st.up.avg)}</td><td>${pct(st.down.avg)}</td><td>${pct(st.total.avg)}</td></tr>
        <tr><td class="fr-rl">Std Deviation</td><td>${pct(st.up.std)}</td><td>${pct(st.down.std)}</td><td>${pct(st.total.std)}</td></tr>
        <tr><td class="fr-rl">Max Sequence</td><td>${st.maxSeqUp}</td><td>${st.maxSeqDown}</td><td></td></tr>
        <tr><td class="fr-rl">Avg Sequence</td><td>${num(st.avgSeqUp)}</td><td>${num(st.avgSeqDown)}</td><td></td></tr>
      </tbody></table>`;
  const bwRows = (arr, prefix) => arr.map((m, i) =>
    `<tr><td class="fr-rl">${prefix} ${i + 1}</td><td class="${sign(m.r)}">${pct(m.r, 2, true)}</td><td>${monthLabel(m)}</td></tr>`).join('');
  const best = `
    <table class="fr-table fr-table-sm">
      <thead><tr><th></th><th>Performance</th><th>Date</th></tr></thead>
      <tbody>${bwRows(bw.best, 'Best')}${bwRows(bw.worst, 'Worst')}</tbody></table>`;
  document.getElementById(id).innerHTML = stats + best;
}

// Rolling Window Analysis — pick a window length (2Y–5Y) and which span of
// years to view (e.g. 3Y → 2022–2024, 2023–2025 …). Independent of the From/To
// filter; always computed over the full series.
function renderWindowTable() {
  const years = [...new Set(_strategy.map(p => p.date.getFullYear()))].sort((a, b) => a - b);
  const minY = years[0], maxY = years[years.length - 1];
  const len = _winLen;
  const starts = [];
  for (let y = minY; y <= maxY - len + 1; y++) starts.push(y);
  if (starts.length === 0) starts.push(minY);
  if (_winStart == null || !starts.includes(_winStart)) _winStart = starts[starts.length - 1];
  const endY = Math.min(_winStart + len - 1, maxY);

  const ini = new Date(_winStart, 0, 1), fin = new Date(endY, 11, 31);
  const s = [], b = [];
  for (let i = 0; i < _strategy.length; i++) {
    const d = _strategy[i].date;
    if (d >= ini && d <= fin) { s.push(_strategy[i]); b.push(_bench[i]); }
  }
  const sArr = C.rets(s), bArr = C.rets(b);

  const lenBtns = [2, 3, 4, 5].map(n => `<button class="fr-tg ${n === len ? 'active' : ''}" data-len="${n}">${n}Y</button>`).join('');
  const opts = starts.map(y => `<option value="${y}" ${y === _winStart ? 'selected' : ''}>${y}–${Math.min(y + len - 1, maxY)}</option>`).join('');
  const cont = document.getElementById('fr-window');
  cont.innerHTML = `
    <div class="fr-win-controls">
      <div class="fr-toggle">${lenBtns}</div>
      <select id="fr-win-range" class="fr-sel">${opts}</select>
    </div>
    <table class="fr-table">
      <thead><tr><th></th><th>Return</th><th>Volatility</th><th>Risk Adjusted</th></tr></thead>
      <tbody>
        <tr><td class="fr-rl">Summit</td><td>${pct(C.totalReturnArr(sArr))}</td><td>${pct(C.volArr(sArr, false))}</td><td>${num(C.riskAdjusted(sArr))}</td></tr>
        <tr><td class="fr-rl fr-bm">S&amp;P 500</td><td class="fr-bm">${pct(C.totalReturnArr(bArr))}</td><td class="fr-bm">${pct(C.volArr(bArr, false))}</td><td class="fr-bm">${num(C.riskAdjusted(bArr))}</td></tr>
      </tbody></table>`;
  cont.querySelectorAll('.fr-tg').forEach(btn =>
    btn.addEventListener('click', () => { _winLen = +btn.dataset.len; _winStart = null; renderWindowTable(); }));
  document.getElementById('fr-win-range').addEventListener('change', e => { _winStart = +e.target.value; renderWindowTable(); });
}

// Monthly returns table — Summit, S&P 500 and the month's alpha.
function renderMonthlyTable(ma) {
  const rows = ma.labels.map((m, i) =>
    `<tr><td class="fr-rl">${monthLabel(m)}</td>
       <td class="${sign(ma.a[i])}">${pct(ma.a[i], 2, true)}</td>
       <td class="${sign(ma.b[i])}">${pct(ma.b[i], 2, true)}</td>
       <td class="${sign(ma.alpha[i])}">${pct(ma.alpha[i], 2, true)}</td></tr>`).join('');
  document.getElementById('fr-monthly').innerHTML = `
    <table class="fr-table fr-monthly-table">
      <thead><tr><th class="fr-rl">Month</th><th>Summit</th><th>S&amp;P 500</th><th>Alpha</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
}

// ─── Renderers: charts ──────────────────────────────────────
function renderCumChart(s, b) {
  const cs = C.cumulativeSeries(s), cb = C.cumulativeSeries(b);
  build('cum', 'fr-cum', {
    type: 'line',
    data: { datasets: [tline('Summit Management', cs, COLOR.summit), tline('S&P 500', cb, COLOR.bench)] },
    options: timeLineOpts(true, semiAnnual(s)),
  });
}
function renderAlphaChart(s, b) {
  const cs = C.cumulativeSeries(s), cb = C.cumulativeSeries(b);
  const data = cs.map((p, i) => ({ x: p.date.getTime(), y: (p.cum - cb[i].cum) * 100 }));
  build('alpha', 'fr-alpha', {
    type: 'line',
    data: { datasets: [{ label: 'Cumulative Alpha', data, borderColor: COLOR.summit, backgroundColor: 'rgba(68,84,106,.18)', fill: true, borderWidth: 1.3, pointRadius: 0, tension: 0.05 }] },
    options: timeLineOpts(false, semiAnnual(s)),
  });
}
function tline(label, cum, color) {
  return { label, data: cum.map(p => ({ x: p.date.getTime(), y: p.cum * 100 })), borderColor: color, backgroundColor: color, borderWidth: 1.6, pointRadius: 0, tension: 0.05 };
}
// Pin the time axis to the data range and place ticks every June and December,
// so the same months line up across years (Dec 2021, Jun 2022, Dec 2022, …).
function semiAnnual(series) {
  const minD = series[0].date, maxD = series[series.length - 1].date;
  const min = new Date(minD.getFullYear() - 1, 11, 1).getTime(); // Dec 1 of prior year
  const max = maxD.getTime();
  const ticks = [];
  for (let yr = minD.getFullYear() - 1; yr <= maxD.getFullYear(); yr++)
    for (const mo of [5, 11]) { const t = new Date(yr, mo, 1).getTime(); if (t >= min && t <= max) ticks.push(t); }
  return { min, max, ticks };
}
function timeLineOpts(legend = true, xr = null) {
  return {
    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: legend, labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { callbacks: { title: it => fmtDate(new Date(it[0].parsed.x)), label: c => `${c.dataset.label}: ${c.parsed.y.toFixed(1)}%` } },
    },
    scales: {
      x: {
        type: 'linear', min: xr?.min, max: xr?.max,
        afterBuildTicks: xr ? (axis => { axis.ticks = xr.ticks.map(v => ({ value: v })); }) : undefined,
        ticks: { color: COLOR.mu, font: { size: 10 }, autoSkip: false, callback: v => fmtMonthYear(new Date(v)) },
        grid: { color: COLOR.grid },
      },
      y: { position: 'right', ticks: { callback: v => v + '%', color: COLOR.mu, font: { size: 10 } }, grid: { color: COLOR.grid } },
    },
  };
}
function renderMonthlyBars(id, labels, values) {
  const key = id.replace('fr-', '');
  build(key, id, {
    type: 'bar',
    data: {
      labels: labels.map(monthLabel),
      datasets: [{ data: values.map(v => v * 100), backgroundColor: values.map(v => v < 0 ? COLOR.neg : COLOR.summit), borderRadius: 2 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.y.toFixed(2) + '%' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: COLOR.mu, font: { size: 9 }, maxRotation: 90, autoSkip: true, maxTicksLimit: 18 } },
        y: { position: 'right', ticks: { callback: v => v + '%', color: COLOR.mu, font: { size: 10 } }, grid: { color: COLOR.grid } },
      },
    },
  });
}
function renderHistogram(id, values, step, xlabel) {
  const h = C.histogram(values, step);
  const key = id.replace('fr-', '');
  build(key, id, {
    type: 'bar',
    data: {
      datasets: [
        { type: 'bar', label: 'Frequency', data: h.bars.map(x => ({ x: x.center * 100, y: x.count })), backgroundColor: h.bars.map(x => x.center < 0 ? COLOR.neg : COLOR.summit), barThickness: step === 0.02 ? 20 : 14 },
        { type: 'line', label: 'Normal', data: h.curve.map(p => ({ x: p.x * 100, y: p.y })), borderColor: COLOR.mu, borderWidth: 1.3, pointRadius: 0, tension: 0.35 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { type: 'linear', title: { display: true, text: xlabel, color: COLOR.mu, font: { size: 10 } }, ticks: { callback: v => v + '%', color: COLOR.mu, font: { size: 9 } }, grid: { display: false } },
        y: { position: 'right', title: { display: true, text: 'Frequency', color: COLOR.mu, font: { size: 10 } }, ticks: { precision: 0, color: COLOR.mu, font: { size: 9 } }, grid: { color: COLOR.grid } },
      },
    },
  });
}
function build(key, canvasId, config) {
  _charts[key]?.destroy();
  _charts[key] = new Chart(document.getElementById(canvasId), config);
}

// ─── helpers ────────────────────────────────────────────────
function pct(x, dec = 2, signed = false) { if (x === '—' || x == null || Number.isNaN(x)) return '—'; const v = (x * 100).toFixed(dec) + '%'; return signed && x > 0 ? '+' + v : v; }
function num(x, dec = 2) { return (x == null || Number.isNaN(x)) ? '—' : x.toFixed(dec); }
function sign(x) { return x >= 0 ? 'pos' : 'neg'; }
function near(a, b, tol = 0.0005) { return Math.abs(a - b) < tol; }
function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function parseInput(s) { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(d) { return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function fmtMonth(d) { return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); }
function fmtMonthYear(d) { return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); }
function fmtMonthLong(d) { return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
function monthLabel(m) { return new Date(m.year, m.month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); }
function showMessage(root, msg) { const el = root.querySelector('#fr-msg'); if (el) { el.textContent = msg; el.style.display = ''; } }
