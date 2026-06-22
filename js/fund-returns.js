// fund-returns.js — Fund Returns tab (Step 1: return fundamentals).
// Loads the strategy + benchmark daily series, applies the parametric date
// range, and renders return KPIs + cumulative and yearly charts. Risk ratios,
// drawdown, attribution, etc. come in later steps (spec §6.1).
import { getStrategyReturns, getBenchmarkReturns } from './fund-data.js';
import {
  filterByRange, totalReturn, cumulativeSeries,
  annualizedReturn, annualizedVol, yearlyReturns,
} from './fund-calc.js';

// Default range = the Excel verification window (spec §8). The whole model is
// parametric on these dates, so changing them recomputes every metric.
const DEFAULT_INI = '2022-01-03';
const DEFAULT_FIN = '2025-09-30';

// Known-good numbers for the validation badge (Summit, verification window).
const EXPECT = { total: 0.8416, ann: 0.2257, vol: 0.1859, bmTotal: 0.3898 };
const TOL = 0.0005;

// Brand colors: Summit = #44546A, S&P 500 = #808080 (used across all charts/accents).
const COLOR = { summit: '#44546A', bench: '#808080', pos: '#16A34A', neg: '#DC2626', grid: '#E7EAEE' };

let _strategy = null;   // full series, loaded once
let _benchmark = null;
let _charts = {};       // live Chart instances, destroyed on re-render

export async function loadFundReturnsPage() {
  const root = document.getElementById('fr-root');
  if (!root) return;

  root.innerHTML = `
    <div class="fr-head">
      <div>
        <h1 class="fr-h1">Fund Returns</h1>
        <p class="fr-sub">Desempeño histórico del fondo Summit vs S&amp;P 500 — neto de comisiones.
          Calculado en vivo (TWR). <span class="fr-tag">Paso 1 · Retornos</span></p>
      </div>
      <div class="fr-controls">
        <label class="fr-ctl">Desde <input type="date" id="fr-ini" value="${DEFAULT_INI}"></label>
        <label class="fr-ctl">Hasta <input type="date" id="fr-fin" value="${DEFAULT_FIN}"></label>
        <span id="fr-badge" class="fr-badge"></span>
      </div>
    </div>
    <div id="fr-msg" class="fr-msg" style="display:none"></div>
    <div class="srow" id="fr-kpis"></div>
    <div class="card fr-chartcard">
      <div class="fr-charttitle">Retorno acumulado — Summit vs S&amp;P 500</div>
      <div class="fr-canvas-wrap"><canvas id="fr-cum"></canvas></div>
    </div>
    <div class="card fr-chartcard">
      <div class="fr-charttitle">Retorno por año</div>
      <div class="fr-canvas-wrap fr-canvas-short"><canvas id="fr-yearly"></canvas></div>
    </div>`;

  try {
    if (!_strategy) _strategy = await getStrategyReturns();
    if (!_benchmark) _benchmark = await getBenchmarkReturns();
  } catch (err) {
    showMessage(root, `No se pudieron cargar los datos: ${err.message}. ` +
      `En esta fase de diseño los CSV solo existen en el servidor local (no en Netlify).`);
    return;
  }

  document.getElementById('fr-ini').addEventListener('change', recompute);
  document.getElementById('fr-fin').addEventListener('change', recompute);
  recompute();
}

function recompute() {
  const iniStr = document.getElementById('fr-ini').value;
  const finStr = document.getElementById('fr-fin').value;
  const ini = parseInput(iniStr), fin = parseInput(finStr);
  if (!ini || !fin || ini > fin) { setBadge('Rango inválido', 'warn'); return; }

  const s = filterByRange(_strategy, ini, fin);
  const b = filterByRange(_benchmark, ini, fin);
  if (s.length === 0) { setBadge('Sin datos en el rango', 'warn'); return; }

  const metrics = {
    summit: {
      total: totalReturn(s),
      ann: annualizedReturn(totalReturn(s), ini, fin),
      vol: annualizedVol(s),
    },
    bench: {
      total: totalReturn(b),
      ann: annualizedReturn(totalReturn(b), ini, fin),
      vol: annualizedVol(b),
    },
  };
  metrics.alpha = metrics.summit.total - metrics.bench.total;

  renderKpis(metrics);
  renderCumulativeChart(s, b);
  renderYearlyChart(s, b);
  updateBadge(iniStr, finStr, metrics);
}

// ─── KPIs ───────────────────────────────────────────────────
function renderKpis(m) {
  const cards = [
    kpi('Retorno Total', m.summit.total, m.bench.total),
    kpi('Retorno Anualizado', m.summit.ann, m.bench.ann),
    kpi('Volatilidad', m.summit.vol, m.bench.vol, false),
    alphaKpi('Alpha (Total)', m.alpha),
  ];
  document.getElementById('fr-kpis').innerHTML = cards.join('');
}

function kpi(label, summit, bench, signColor = true) {
  const cls = signColor ? signClass(summit) : '';
  return `<div class="sc">
    <div class="sl">${label}</div>
    <div class="sv ${cls}">${pct(summit)}</div>
    <div class="ss">S&amp;P 500: ${pct(bench)}</div>
  </div>`;
}

function alphaKpi(label, alpha) {
  return `<div class="sc" style="border-top:2px solid ${alpha >= 0 ? COLOR.pos : COLOR.neg}">
    <div class="sl">${label}</div>
    <div class="sv ${signClass(alpha)}">${pct(alpha, true)}</div>
    <div class="ss">Summit − S&amp;P 500</div>
  </div>`;
}

// ─── Cumulative line chart ──────────────────────────────────
function renderCumulativeChart(s, b) {
  const cs = cumulativeSeries(s);
  const cb = cumulativeSeries(b);
  const ctx = document.getElementById('fr-cum');
  _charts.cum?.destroy();
  _charts.cum = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        line('Summit', cs, COLOR.summit),
        line('S&P 500', cb, COLOR.bench),
      ],
    },
    options: lineOptions(),
  });
}

function line(label, cumSeries, color) {
  return {
    label,
    data: cumSeries.map(p => ({ x: p.date.getTime(), y: p.cum * 100 })),
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.8,
    pointRadius: 0,
    tension: 0.05,
  };
}

function lineOptions() {
  return {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { boxWidth: 12, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          title: items => fmtDate(new Date(items[0].parsed.x)),
          label: c => `${c.dataset.label}: ${c.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        ticks: {
          maxTicksLimit: 8, color: COLOR.bench, font: { size: 11 },
          callback: v => fmtMonth(new Date(v)),
        },
        grid: { color: COLOR.grid },
      },
      y: {
        ticks: { callback: v => v + '%', color: COLOR.bench, font: { size: 11 } },
        grid: { color: COLOR.grid },
      },
    },
  };
}

// ─── Yearly bar chart ───────────────────────────────────────
function renderYearlyChart(s, b) {
  const ys = yearlyReturns(s);
  const yb = new Map(yearlyReturns(b).map(d => [d.year, d.r]));
  const labels = ys.map(d => d.year);
  const ctx = document.getElementById('fr-yearly');
  _charts.yearly?.destroy();
  _charts.yearly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Summit', data: ys.map(d => d.r * 100), backgroundColor: COLOR.summit, borderRadius: 3 },
        { label: 'S&P 500', data: ys.map(d => (yb.get(d.year) ?? 0) * 100), backgroundColor: COLOR.bench, borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 12, font: { size: 12 } } },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y.toFixed(2)}%` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: COLOR.bench, font: { size: 12 } } },
        y: { ticks: { callback: v => v + '%', color: COLOR.bench, font: { size: 11 } }, grid: { color: COLOR.grid } },
      },
    },
  });
}

// ─── Validation badge ───────────────────────────────────────
function updateBadge(iniStr, finStr, m) {
  if (iniStr !== DEFAULT_INI || finStr !== DEFAULT_FIN) {
    setBadge('Rango personalizado', 'neutral');
    return;
  }
  const ok = Math.abs(m.summit.total - EXPECT.total) < TOL
    && Math.abs(m.summit.ann - EXPECT.ann) < TOL
    && Math.abs(m.summit.vol - EXPECT.vol) < TOL
    && Math.abs(m.bench.total - EXPECT.bmTotal) < TOL;
  setBadge(ok ? '✓ Validado vs Excel' : '✗ No coincide con Excel', ok ? 'ok' : 'warn');
}

function setBadge(text, kind) {
  const el = document.getElementById('fr-badge');
  if (el) { el.textContent = text; el.className = `fr-badge fr-badge-${kind}`; }
}

// ─── Helpers ────────────────────────────────────────────────
function pct(x, signed = false) {
  const v = (x * 100).toFixed(2) + '%';
  return signed && x > 0 ? '+' + v : v;
}
function signClass(x) { return x >= 0 ? 'pos' : 'neg'; }
function parseInput(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmtDate(d) {
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtMonth(d) {
  return d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
}
function showMessage(root, msg) {
  const el = root.querySelector('#fr-msg');
  if (el) { el.textContent = msg; el.style.display = ''; }
}
