// fund-returns.js — Return Analysis tab: "Performance Analysis" dashboard.
// Replicates the content of presentation slides 2 & 3, reorganized for a
// dashboard: a hero cumulative chart, the slide-2 detail tables, and themed
// sections for absolute and relative (alpha) monthly returns.
// Every figure is derived from the two daily series — nothing is hardcoded, so
// new days appear on their own as the live feed extends the series.
import { getSeries, getPortfolios } from './fund-data.js';
import * as C from './fund-calc.js';

const PORTFOLIO_DEFAULT = 'summit';
const RFR_DEFAULT = 0.045;
const LOOKBACK_DEFAULT = 12; // months (TTM window)
const WINDOW_LENGTHS = [2, 3, 4, 5]; // Rolling Window Analysis, in whole years
const COLOR = { summit: '#44546A', bench: '#808080', neg: '#C0392B', grid: '#E7EAEE', mu: '#8A93A0' };

let _strategy = null;   // full aligned series, loaded once
let _bench = null;
let _meta = null;       // which portfolio, which benchmark, where the days came from
let _charts = {};
let _req = 0;           // ticket for the in-flight portfolio switch (latest wins)
let _winLen = 3;        // Rolling Window Analysis: window length in years
let _winStart = null;   // ...and chosen start year (null = auto-pick latest)
// One period-picker state per block. They are deliberately independent: the
// global From/To they replace forced every table to answer the same question.
let _periods = {};

export async function loadFundReturnsPage() {
  const root = document.getElementById('fr-root');
  if (!root) return;

  const portfolios = await getPortfolios();
  if (!portfolios.length) {
    root.innerHTML = '<div class="fr-msg">No portfolios configured.</div>';
    return;
  }

  // The portfolio bar sits outside #fr-body, which is rebuilt on every switch:
  // the dashboard below is specific to one portfolio, the chooser is not.
  // A dropdown rather than pills — the list is meant to grow, and pills stop
  // scaling once there are more than a handful.
  root.innerHTML = `
    <div class="fr-pf-bar">
      <span class="fr-hero-label">Portfolio</span>
      <select class="fr-sel fr-pf-select" id="fr-pf-select">${portfolios.map(p =>
        `<option value="${esc(p.code)}">${esc(p.label)}</option>`).join('')}</select>
    </div>
    <div id="fr-body"></div>`;

  document.getElementById('fr-pf-select')
    .addEventListener('change', e => showPortfolio(e.target.value));

  const start = portfolios.some(p => p.code === PORTFOLIO_DEFAULT) ? PORTFOLIO_DEFAULT : portfolios[0].code;
  await showPortfolio(start);
}

// Load one portfolio and rebuild the dashboard around it. Everything that
// depends on the series — the shell's titles, the date range, the year toggles,
// the rolling-window lengths — is derived here rather than assumed, because a
// portfolio that starts in 2026 has none of the spans the original one had.
async function showPortfolio(code) {
  // Clicking a second portfolio while the first is still loading must not drop
  // the click, and must not let the slower load overwrite the newer one. Each
  // call takes a ticket; whoever comes back holding a stale one steps aside.
  const req = ++_req;
  const body = document.getElementById('fr-body');
  // Keep the dropdown in step when the switch was not started by the user
  // picking from it (first load, or a fallback to another portfolio).
  const sel = document.getElementById('fr-pf-select');
  if (sel && sel.value !== code) sel.value = code;
  body.innerHTML = '<div class="fr-loading">Loading…</div>';

  try {
    const series = await getSeries(code);
    if (req !== _req) return;
    _strategy = series.portfolio;
    _bench = series.benchmark;
    _meta = series.meta;
  } catch (err) {
    if (req !== _req) return;
    body.innerHTML = `<div class="fr-msg">Could not load the return series: ${esc(err.message)}</div>`;
    return;
  }
  if (!_strategy.length) {
    body.innerHTML = '<div class="fr-msg">No return data for this portfolio yet.</div>';
    return;
  }

  // Control state belongs to the portfolio that was on screen, not to this one:
  // its years, and the window lengths its history can support, are different.
  _periods = { hero: newPeriod(), metrics: newPeriod(), capture: newPeriod(), monthly: newPeriod() };
  _winStart = null;
  // Destroy the outgoing charts before the canvases they own are replaced.
  // Dropping the map without destroying leaves live Chart instances animating
  // against detached canvases, which piles up on every switch.
  destroyCharts();

  // Built after the data loads so every title can name the portfolio and the
  // benchmark actually on screen, instead of one fund's names hardcoded.
  body.innerHTML = shell(_meta);

  document.getElementById('fr-rfr').value = (RFR_DEFAULT * 100).toFixed(1);
  document.getElementById('fr-rfr').addEventListener('change', renderMetricsBlock);

  renderPeriod('hero', 'fr-p-hero', renderHeroBlock);
  renderPeriod('metrics', 'fr-p-metrics', renderMetricsBlock);
  renderPeriod('capture', 'fr-p-capture', renderCaptureBlock);
  renderPeriod('monthly', 'fr-p-monthly', renderMonthlyBlock);
  renderAll();
}

// ─── Period picker ──────────────────────────────────────────
// One reusable control, instantiated once per block. Each instance owns its own
// state, which is the whole point: reading capture ratios over 2023 while the
// monthly distribution covers the full run is a normal thing to want, and the
// single global From/To this replaces made it impossible.
//
// Mode pills pick the kind of period; a secondary control appears only for the
// two modes that need one. That mirrors the Rolling Window block, which already
// pairs a pill toggle with a select, rather than inventing a new pattern.
const PERIOD_MODES = [
  { key: 'max', label: 'Max' },
  { key: 'ytd', label: 'YTD' },
  { key: '1y', label: '1Y', months: 12 },
  { key: '3y', label: '3Y', months: 36 },
  { key: '5y', label: '5Y', months: 60 },
  { key: 'year', label: 'Year' },
  { key: 'custom', label: 'Custom' },
];

function newPeriod() { return { mode: 'max', year: null, from: null, to: null }; }

// Resolve one instance's state into actual dates, against this portfolio's own
// bounds — a preset never runs past the data it has.
function periodRange(st) {
  const first = _strategy[0].date, last = _strategy[_strategy.length - 1].date;
  const clamp = d => d < first ? first : d;
  switch (st.mode) {
    case 'ytd':
      return { ini: clamp(new Date(last.getFullYear(), 0, 1)), fin: last };
    case '1y': case '3y': case '5y': {
      const n = parseInt(st.mode, 10);
      return { ini: clamp(new Date(last.getFullYear() - n, last.getMonth(), last.getDate())), fin: last };
    }
    case 'year': {
      const y = st.year ?? last.getFullYear();
      return { ini: new Date(y, 0, 1), fin: new Date(y, 11, 31) };
    }
    case 'custom':
      return { ini: st.from ? parseInput(st.from) : first, fin: st.to ? parseInput(st.to) : last };
    default:
      return { ini: first, fin: last };
  }
}

function renderPeriod(key, containerId, onChange) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const st = _periods[key];
  const span = spanMonths(_strategy);
  const first = _strategy[0].date, last = _strategy[_strategy.length - 1].date;

  // Presets longer than the history stay visible but disabled — the same
  // treatment the rolling window gives its window lengths.
  const pills = PERIOD_MODES.map(m => {
    const ok = !m.months || m.months <= span + 1;
    return `<button class="fr-tg ${st.mode === m.key ? 'active' : ''}" data-mode="${m.key}"`
      + `${ok ? '' : ' disabled title="Not enough history"'}>${m.label}</button>`;
  }).join('');

  let extra = '';
  if (st.mode === 'year') {
    const years = seriesYears().slice().reverse();
    if (!years.includes(st.year)) st.year = years[0];
    extra = `<select class="fr-sel" data-role="year">${years.map(y =>
      `<option value="${y}" ${y === st.year ? 'selected' : ''}>${y}</option>`).join('')}</select>`;
  } else if (st.mode === 'custom') {
    if (!st.from) st.from = iso(first);
    if (!st.to) st.to = iso(last);
    extra = `<input type="date" class="fr-pdate" data-role="from" value="${st.from}" min="${iso(first)}" max="${iso(last)}">`
      + `<span class="fr-pdash">–</span>`
      + `<input type="date" class="fr-pdate" data-role="to" value="${st.to}" min="${iso(first)}" max="${iso(last)}">`;
  }

  el.innerHTML = `<div class="fr-toggle">${pills}</div>${extra}`;
  el.querySelectorAll('.fr-tg').forEach(btn => btn.addEventListener('click', () => {
    st.mode = btn.dataset.mode;
    renderPeriod(key, containerId, onChange);   // the secondary control appears/disappears
    onChange();
  }));
  el.querySelector('[data-role="year"]')?.addEventListener('change', e => { st.year = +e.target.value; onChange(); });
  el.querySelector('[data-role="from"]')?.addEventListener('change', e => { st.from = e.target.value; onChange(); });
  el.querySelector('[data-role="to"]')?.addEventListener('change', e => { st.to = e.target.value; onChange(); });
}

// Both series sliced together — they are index-aligned, so they have to be cut
// at the same positions or every relative figure silently compares mismatched days.
function sliceRange(ini, fin) {
  const s = [], b = [];
  for (let i = 0; i < _strategy.length; i++) {
    const d = _strategy[i].date;
    if (d >= ini && d <= fin) { s.push(_strategy[i]); b.push(_bench[i]); }
  }
  return { s, b };
}
function sliceFor(key) {
  const { ini, fin } = periodRange(_periods[key]);
  return (!ini || !fin || ini > fin) ? { s: [], b: [] } : sliceRange(ini, fin);
}
function monthlyFor(s, b) {
  return C.monthlyAligned(C.monthlySeries(s), C.monthlySeries(b));
}
function emptyNote(id, msg = 'No data in this period.') {
  document.getElementById(id).innerHTML = `<div class="fr-empty">${msg}</div>`;
}

// ─── Blocks ─────────────────────────────────────────────────
// Each renders from its own period, and only re-renders when its own control
// moves. Nothing here recomputes the whole page.
function renderAll() {
  renderMeta();
  renderAnalysisTable();          // no filter, by design: it is the year-by-year table
  renderMonthlyTable();           // no filter either
  renderHeroBlock();
  renderMetricsBlock();
  renderCaptureBlock();
  renderMonthlyBlock();
  renderWindowTable();
  setBadge(`Data through ${fmtDate(_meta.through)}`, 'neutral');
}

function renderMetricsBlock() {
  const { s, b } = sliceFor('metrics');
  if (!s.length) return emptyNote('fr-t-metrics');
  renderMetricsTable(s, b, rfrValue());
}

function renderCaptureBlock() {
  const { s, b } = sliceFor('capture');
  if (!s.length) return emptyNote('fr-t-capture');
  const ma = monthlyFor(s, b);
  renderCaptureTable(C.captureRatios(ma.a, ma.b));
}

function renderMonthlyBlock() {
  const { s, b } = sliceFor('monthly');
  if (!s.length) {
    ['mbars', 'abars', 'mhist', 'ahist'].forEach(destroyChart);
    emptyNote('fr-abs-stats'); emptyNote('fr-rel-stats');
    return;
  }
  const ma = monthlyFor(s, b);
  renderMonthlyBars('fr-mbars', ma.labels, ma.a);
  renderMonthlyBars('fr-abars', ma.labels, ma.alpha);
  renderStatsBlock('fr-abs-stats', ma.a, ma.labels, 'Up', 'Down', true);
  renderStatsBlock('fr-rel-stats', ma.alpha, ma.labels, 'Winning', 'Losing', false);
  renderHistogram('fr-mhist', ma.a, 0.02, 'Monthly Return');
  renderHistogram('fr-ahist', ma.alpha, 0.01, 'Monthly Alpha');
}

function rfrValue() {
  return (parseFloat(document.getElementById('fr-rfr')?.value) || 0) / 100;
}

// ─── Page shell ─────────────────────────────────────────────
function shell(m) {
  const P = esc(m.label), B = esc(m.benchmarkLabel);
  return `
    <div class="fr-head">
      <div class="fr-meta" id="fr-meta"></div>
      <div class="fr-controls"><span id="fr-badge" class="fr-badge"></span></div>
    </div>
    <div id="fr-msg" class="fr-msg" style="display:none"></div>

    <div class="fr-hero-bar">
      <span class="fr-hero-label">Period</span>
      <div class="fr-period" id="fr-p-hero"></div>
    </div>

    <div class="fr-hero">
      <div class="card">
        <div class="fr-charttitle">Total Return — ${P} vs ${B}</div>
        <div class="fr-canvas-wrap"><canvas id="fr-cum"></canvas></div>
        <div class="fr-foot">*Cumulative daily total return of ${P} and ${B}</div>
      </div>
      <div class="card">
        <div class="fr-charttitle">Cumulative Performance vs Benchmark</div>
        <div class="fr-canvas-wrap fr-canvas-short"><canvas id="fr-alpha"></canvas></div>
        <div class="fr-foot">*Cumulative difference in returns between ${P} and ${B}</div>
      </div>
    </div>

    <div class="fr-tables">
      <div class="fr-tcol">
        <div class="card"><div class="fr-charttitle">Performance &amp; Risk Analysis</div><div id="fr-t-analysis"></div></div>
        <div class="card"><div class="fr-charttitle">Rolling Window Analysis</div><div id="fr-window"></div></div>
      </div>
      <div class="fr-tcol">
        <div class="card">
          <div class="fr-cardhead">
            <div class="fr-charttitle">Performance &amp; Risk Metrics</div>
            <label class="fr-ctl">RFR <input type="number" id="fr-rfr" step="0.1" style="width:58px"></label>
          </div>
          <div class="fr-period fr-period-card" id="fr-p-metrics"></div>
          <div id="fr-t-metrics"></div>
          <div class="fr-foot">*The period control drives the Period columns; TTM is always the last twelve months</div>
        </div>
        <div class="card">
          <div class="fr-cardhead"><div class="fr-charttitle">Capture Ratios</div></div>
          <div class="fr-period fr-period-card" id="fr-p-capture"></div>
          <div id="fr-t-capture"></div>
          <div class="fr-foot">*Calculated with monthly returns</div>
        </div>
      </div>
    </div>

    <div class="fr-hero-bar">
      <span class="fr-hero-label">Monthly period</span>
      <div class="fr-period" id="fr-p-monthly"></div>
    </div>

    <div class="card fr-section">
      <div class="fr-charttitle">Absolute Return — Monthly (${P})</div>
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
      <div class="fr-charttitle">Monthly Returns — ${P}, ${B} &amp; Alpha</div>
      <div id="fr-monthly"></div>
    </div>`;
}

// ─── Renderers: header + KPIs ───────────────────────────────
// Header describes the whole loaded series, not any one block's period.
function renderMeta() {
  const d0 = _strategy[0].date, d1 = _strategy[_strategy.length - 1].date;
  const m = _meta;
  document.getElementById('fr-meta').innerHTML = `
    <div class="fr-meta-row">
      <span><b>${esc(m.label)}</b></span><span>Benchmark: <b>${esc(m.benchmarkLabel)}</b></span>
      <span>Start: <b>${fmtDate(d0)}</b></span><span>End: <b>${fmtDate(d1)}</b></span>
      <span>Currency: <b>${m.currency}</b></span>
    </div>
    <div class="fr-meta-row fr-meta-sub">
      <span>Benchmark Proxy: ${esc(m.benchmark)}</span><span>Period: ${fmtMonthLong(d0)} – ${fmtMonthLong(d1)}</span>
      <span class="fr-source">Daily total returns</span>${sourceNote(m)}
    </div>`;
}

// Where the days on screen came from. Worth saying out loud: the series is two
// halves spliced at HISTORY_CUTOFF, and until the daily feed is connected the
// recent half is a checked-in file rather than the database.
function sourceNote(m) {
  if (!m.liveFrom) return '';
  const via = m.liveSource === 'db' ? 'live feed' : 'pending feed connection';
  // A portfolio that starts after the cutoff has no frozen half at all — most
  // of them will look like this, so the note has to read correctly with the
  // history side missing rather than assume both halves exist.
  const txt = m.historyThrough
    ? `History through ${fmtMonthLong(m.historyThrough)}, ${fmtMonthLong(m.liveFrom)} onward from the ${via}`
    : `${fmtMonthLong(m.liveFrom)} onward from the ${via}`;
  return `<span class="fr-meta-note">${txt}</span>`;
}

// ─── Renderers: tables ──────────────────────────────────────
// Year by year over the whole series: this table IS the period breakdown, so a
// period filter on top of it would only ever remove rows.
function renderAnalysisTable() {
  const s = _strategy, b = _bench;
  const P = esc(_meta.label), BS = esc(_meta.benchmarkShort);
  const years = [...new Set(s.map(p => p.date.getFullYear()))].sort((a, c) => c - a);
  // Annualizing less than a year of returns compounds a partial period up to a
  // full one — for a portfolio eight months old that produces a figure that
  // looks like a track record and is not one. Volatility still holds (it is a
  // daily figure scaled by √252, not an extrapolation), so only the return and
  // the ratio built on it are withheld.
  const canAnnualize = spanMonths(s) >= 12;
  const rowFor = (label, sSlice, bSlice, mode, title = '') => {
    const sr = C.rets(sSlice), br = C.rets(bSlice);
    const blankRet = mode === 'annualized' && !canAnnualize;
    // Risk Adjusted divides whatever return the row shows by the annualized vol,
    // so each row's Return ÷ Volatility = its Risk Adjusted column.
    const retVal = (a) => mode === 'annualized' ? C.annualizedArr(a) : C.totalReturnArr(a);
    const ret = (a) => blankRet ? '—' : pct(retVal(a));
    const vol = (a) => mode === 'overall' ? '—' : pct(C.volArr(a, false));
    const rar = (a) => {
      if (mode === 'overall' || blankRet) return '—';
      const v = C.volArr(a, false); return v ? num(retVal(a) / v) : '—';
    };
    return `<tr><td class="fr-rl"${title ? ` title="${esc(title)}"` : ''}>${label}</td>
      <td>${ret(sr)}</td><td class="fr-bm">${ret(br)}</td>
      <td>${vol(sr)}</td><td class="fr-bm">${vol(br)}</td>
      <td>${rar(sr)}</td><td class="fr-bm">${rar(br)}</td></tr>`;
  };
  let rows = years.map(y => rowFor(y, C.yearSlice(s, y), C.yearSlice(b, y), 'year')).join('');
  rows += rowFor('Annualized', s, b, 'annualized',
    canAnnualize ? '' : 'Needs at least 12 months; the period on screen is shorter');
  rows += rowFor('Overall', s, b, 'overall');
  document.getElementById('fr-t-analysis').innerHTML = `
    <table class="fr-table">
      <thead>
        <tr><th></th><th colspan="2">Return</th><th colspan="2">Volatility</th><th colspan="2">Risk Adjusted</th></tr>
        <tr><th></th><th>${P}</th><th class="fr-bm">${BS}</th><th>${P}</th><th class="fr-bm">${BS}</th><th>${P}</th><th class="fr-bm">${BS}</th></tr>
      </thead><tbody>${rows}</tbody></table>`;
}

// s/b are this block's period slice and drive the Period columns. TTM is
// deliberately NOT sliced with them: it is always the last twelve months of the
// series, so the table always answers "recently, and over the period you chose"
// rather than two views of the same window.
function renderMetricsTable(s, b, rfr) {
  const P = esc(_meta.label), BS = esc(_meta.benchmarkShort);
  const last = _strategy[_strategy.length - 1].date;
  const ttmStart = new Date(last.getFullYear(), last.getMonth() - LOOKBACK_DEFAULT, last.getDate());
  const ttm = sliceRange(ttmStart, last);
  const sTtm = ttm.s, bTtm = ttm.b;
  const aT = C.rets(sTtm), bT = C.rets(bTtm), aP = C.rets(s), bP = C.rets(b);
  const row = (label, ttmS, ttmB, perS, perB) =>
    `<tr><td class="fr-rl">${label}</td><td>${ttmS}</td><td class="fr-bm">${ttmB}</td><td>${perS}</td><td class="fr-bm">${perB}</td></tr>`;
  const dash = '—';
  // For a portfolio younger than the lookback, the "trailing twelve months"
  // window is simply its whole life. Same numbers either way — but calling that
  // column TTM would claim a year of history that does not exist.
  const short = spanMonths(_strategy) < LOOKBACK_DEFAULT;
  const ttmHead = short
    ? `<th colspan="2" title="Less than ${LOOKBACK_DEFAULT} months of data">Since inception</th>`
    : '<th colspan="2">TTM</th>';
  const html = `
    <table class="fr-table">
      <thead>
        <tr><th></th>${ttmHead}<th colspan="2">Period</th></tr>
        <tr><th></th><th>${P}</th><th class="fr-bm">${BS}</th><th>${P}</th><th class="fr-bm">${BS}</th></tr>
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
  const P = esc(_meta.label), BS = esc(_meta.benchmarkShort);
  document.getElementById('fr-t-capture').innerHTML = `
    <table class="fr-table">
      <thead><tr><th></th><th>${P}</th><th class="fr-bm">${BS}</th><th>Capture</th></tr></thead>
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
// Calendar years present in the loaded series.
function seriesYears() {
  return [...new Set(_strategy.map(p => p.date.getFullYear()))].sort((a, b) => a - b);
}
// Window lengths this portfolio's history can actually fill. The rolling window
// works in whole calendar years, so the count of years is the ceiling.
function availableWindowLens() {
  if (!_strategy || !_strategy.length) return WINDOW_LENGTHS;
  const n = seriesYears().length;
  return WINDOW_LENGTHS.filter(l => l <= n);
}
// Whole months between the first and last day of a series. Used to decide when
// a figure would be extrapolating rather than measuring.
function spanMonths(s) {
  if (!s.length) return 0;
  const a = s[0].date, z = s[s.length - 1].date;
  const m = (z.getFullYear() - a.getFullYear()) * 12 + (z.getMonth() - a.getMonth());
  return z.getDate() >= a.getDate() ? m : m - 1;
}

function renderWindowTable() {
  const P = esc(_meta.label), B = esc(_meta.benchmarkLabel);
  const cont = document.getElementById('fr-window');
  const years = seriesYears();
  const avail = availableWindowLens();

  // A portfolio that started this year cannot fill even the shortest window.
  // Say so, rather than quietly showing a "3Y" figure covering eight months.
  if (!avail.length) {
    cont.innerHTML = `<div class="fr-empty">Needs at least two calendar years.`
      + ` ${esc(_meta.label)} has ${years.length === 1 ? 'one' : years.length} (${years.join(', ')}).</div>`;
    return;
  }

  const minY = years[0], maxY = years[years.length - 1];
  // _winLen is the user's preference and survives a portfolio switch; the length
  // actually drawn is the closest one this portfolio's history can fill.
  const len = avail.includes(_winLen) ? _winLen : avail[avail.length - 1];
  const starts = [];
  for (let y = minY; y <= maxY - len + 1; y++) starts.push(y);
  if (_winStart == null || !starts.includes(_winStart)) _winStart = starts[starts.length - 1];
  const endY = Math.min(_winStart + len - 1, maxY);

  const ini = new Date(_winStart, 0, 1), fin = new Date(endY, 11, 31);
  const s = [], b = [];
  for (let i = 0; i < _strategy.length; i++) {
    const d = _strategy[i].date;
    if (d >= ini && d <= fin) { s.push(_strategy[i]); b.push(_bench[i]); }
  }
  const sArr = C.rets(s), bArr = C.rets(b);

  // Lengths the series cannot fill stay visible but disabled — that reads as
  // "not yet" rather than as a control that silently went missing.
  const lenBtns = WINDOW_LENGTHS.map(n => {
    const ok = avail.includes(n);
    return `<button class="fr-tg ${n === len ? 'active' : ''}" data-len="${n}"`
      + `${ok ? '' : ' disabled title="Not enough history"'}>${n}Y</button>`;
  }).join('');
  const opts = starts.map(y => `<option value="${y}" ${y === _winStart ? 'selected' : ''}>${y}–${Math.min(y + len - 1, maxY)}</option>`).join('');
  cont.innerHTML = `
    <div class="fr-win-controls">
      <div class="fr-toggle">${lenBtns}</div>
      <select id="fr-win-range" class="fr-sel">${opts}</select>
    </div>
    <table class="fr-table">
      <thead><tr><th></th><th>Return</th><th>Volatility</th><th>Risk Adjusted</th></tr></thead>
      <tbody>
        <tr><td class="fr-rl">${P}</td><td>${pct(C.totalReturnArr(sArr))}</td><td>${pct(C.volArr(sArr, false))}</td><td>${num(C.riskAdjusted(sArr))}</td></tr>
        <tr><td class="fr-rl fr-bm">${B}</td><td class="fr-bm">${pct(C.totalReturnArr(bArr))}</td><td class="fr-bm">${pct(C.volArr(bArr, false))}</td><td class="fr-bm">${num(C.riskAdjusted(bArr))}</td></tr>
      </tbody></table>`;
  cont.querySelectorAll('.fr-tg').forEach(btn =>
    btn.addEventListener('click', () => { _winLen = +btn.dataset.len; _winStart = null; renderWindowTable(); }));
  document.getElementById('fr-win-range').addEventListener('change', e => { _winStart = +e.target.value; renderWindowTable(); });
}
// Monthly returns table — the portfolio, its benchmark, and the month's alpha.
function renderMonthlyTable() {
  const ma = monthlyFor(_strategy, _bench);
  const P = esc(_meta.label), B = esc(_meta.benchmarkLabel);
  const rows = ma.labels.map((m, i) =>
    `<tr><td class="fr-rl">${monthLabel(m)}</td>
       <td class="${sign(ma.a[i])}">${pct(ma.a[i], 2, true)}</td>
       <td class="${sign(ma.b[i])}">${pct(ma.b[i], 2, true)}</td>
       <td class="${sign(ma.alpha[i])}">${pct(ma.alpha[i], 2, true)}</td></tr>`).join('');
  document.getElementById('fr-monthly').innerHTML = `
    <table class="fr-table fr-monthly-table">
      <thead><tr><th class="fr-rl">Month</th><th>${P}</th><th>${B}</th><th>Alpha</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
}

// ─── Renderers: charts ──────────────────────────────────────
// Hero period toggle — "Max" (full inception) plus every calendar year present.
// Drives the two hero charts only; picking a year shows just that calendar year
// (Jan–Dec) with the cumulative series rebased to 0 at its start. Independent of
// the From/To filter that drives the tables.
function renderHeroBlock() {
  const { s, b } = sliceFor('hero');
  if (!s.length) { destroyChart('cum'); destroyChart('alpha'); return; }
  renderCumChart(s, b);
  renderAlphaChart(s, b);
}
function renderCumChart(s, b) {
  const cs = C.cumulativeSeries(s), cb = C.cumulativeSeries(b);
  build('cum', 'fr-cum', {
    type: 'line',
    data: { datasets: [tline(_meta.label, cs, COLOR.summit), tline(_meta.benchmarkLabel, cb, COLOR.bench)] },
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
function destroyChart(key) { _charts[key]?.destroy(); delete _charts[key]; }
function destroyCharts() {
  for (const c of Object.values(_charts)) c?.destroy();
  _charts = {};
}

// ─── helpers ────────────────────────────────────────────────
function pct(x, dec = 2, signed = false) { if (x === '—' || x == null || Number.isNaN(x)) return '—'; const v = (x * 100).toFixed(dec) + '%'; return signed && x > 0 ? '+' + v : v; }
function num(x, dec = 2) { return (x == null || Number.isNaN(x)) ? '—' : x.toFixed(dec); }
function sign(x) { return x >= 0 ? 'pos' : 'neg'; }
// The freshness badge in the header. (This helper went missing when the KPI
// strip was removed in 3bf59d7, so every setBadge call has been throwing a
// ReferenceError at the end of recompute() since then -- which is why the badge
// has been blank, and why an invalid date range silently left the previous
// figures on screen instead of flagging itself.)
function setBadge(text, kind) {
  const el = document.getElementById('fr-badge');
  if (!el) return;
  el.textContent = text;
  el.className = `fr-badge fr-badge-${kind || 'neutral'}`;
}
// Labels come from the portfolio registry and land inside HTML strings, so the
// ampersand in "S&P 500" has to be escaped or the markup is malformed.
function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function parseInput(s) { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(d) { return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function fmtMonthYear(d) { return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); }
function fmtMonthLong(d) { return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
function monthLabel(m) { return new Date(m.year, m.month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); }
