// Buy Calls — long-call analyzer.
//
// The mirror image of the Covered Calls tab. There we SELL a call and ask "at what
// valuation do I get called away"; here we BUY one and ask three questions the
// option chain alone cannot answer:
//
//   1. What multiple am I underwriting?  A $400 strike is meaningless until it is
//      "28x 2027E EPS". Every strike and every breakeven is priced back into an
//      implied P/E and EV/EBITDA on a chosen estimate year.
//   2. What does the position cost, and what does it control?  Premium × 100 is the
//      cheque; spot × 100 is the exposure. The gap between them is the whole trade.
//   3. How big an account does this need?  Given a maximum % of the account we are
//      willing to have in notional exposure, the minimum account value that a given
//      number of contracts implies — and, the other way round, the contracts an
//      account of a given size supports.
//
// Live price, premium, IV and greeks come from the Massive option chain via the
// covered-calls-massive edge function. Forward EPS / EBITDA / net debt come from
// js/buy-calls-data.js (Bloomberg consensus for APP, Summit DCF for the rest).
// Nothing is written anywhere — every input on the page is in-memory.
//
// The payoff chart is a path-3 bespoke canvas per docs/CHART_ENGINE_REFERENCE §0.7:
// esc() and rsAttachBrush() are copied verbatim from js/results.js (:219, :1298),
// the visual language (.rs-collap, .rs-leg, .rs-ft*, .rs-brush) is global CSS.

import { BC_ESTIMATES, BC_DEFAULT_TICKER } from './buy-calls-data.js';
import { coveredCallsQuote } from './api.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('bc-root');

// Copied verbatim from js/results.js:219 — every interpolated string goes through it.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// ── Formatting. Rule 5: no bare numbers, estimates always marked. ─────────────
const px = (x) => (x == null || !isFinite(x)) ? '—' : `$${x.toFixed(2)}`;
const px0 = (x) => (x == null || !isFinite(x)) ? '—' : `$${Math.round(x).toLocaleString()}`;
const mult = (x) => (x == null || !isFinite(x) || x <= 0) ? '—' : `${x.toFixed(1)}x`;
const mom = (x) => (x == null || !isFinite(x)) ? '—' : `${x.toFixed(2)}x`;
const pct = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : `${(x * 100).toFixed(d)}%`;
const pctS = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`;
// Dollars at position size — these get large, so compact above $1M.
const cash = (x) => {
  if (x == null || !isFinite(x)) return '—';
  const a = Math.abs(x), s = x < 0 ? '−' : '';
  if (a >= 1e9) return `${s}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `${s}$${(a / 1e3).toFixed(0)}K`;
  return `${s}$${Math.round(a).toLocaleString()}`;
};
const bn = (x) => {   // values already in $M
  if (x == null || !isFinite(x)) return '—';
  const a = Math.abs(x), s = x < 0 ? '−' : '';
  return a >= 1000 ? `${s}$${(a / 1000).toFixed(2)}B` : `${s}$${a.toFixed(0)}M`;
};

// ── State ─────────────────────────────────────────────────────────────────────
const st = {
  ticker: BC_DEFAULT_TICKER,
  expiry: null, expiries: [],
  spot: null, changePct: null, shares: null, netDebtLive: null, name: '',
  chain: [],                 // raw call contracts for the selected expiry
  loading: true, err: null,

  basisYear: null,           // estimate year driving every multiple
  premBasis: 'ask',          // 'ask' | 'mid' | 'last' — a buyer lifts the ask
  notionalBasis: 'spot',     // 'spot' | 'strike'
  band: 0.35,                // ± moneyness band of strikes shown
  account: 1000000,          // account value, $
  exposurePct: 0.20,         // max % of the account allowed in notional exposure
  contracts: 10,             // contracts per position

  scenKind: 'pe',            // 'pe' | 'ev' — the multiple the scenario price is built on
  scenMult: 25,
  scenYear: null,

  selected: null,            // selected strike (drives the KPI strip)
  plotted: {},               // strike -> true, the strikes drawn on the payoff chart
  mode: 'pnl',               // 'pnl' | 'ret' | 'pos'
  hidden: {},                // series key -> true (rule 2)
  yr: null, win: null,       // brush zoom: y range, x window (grid indexes)
  tbl: false,                // payoff table open
  chart: null,
};

// ── Massive proxy ─────────────────────────────────────────────────────────────
async function mfetch(resource, ticker, params = {}) {
  const res = await coveredCallsQuote(resource, ticker, params);
  if (!res.success) throw new Error(res.error?.message || 'request failed');
  return res.data;
}

const daysTo = (d) => {
  if (!d) return null;
  return Math.max(0, Math.round((new Date(d + 'T16:00:00') - new Date()) / 86400000));
};

// ── Estimates ─────────────────────────────────────────────────────────────────
const estOf = () => BC_ESTIMATES[st.ticker] || null;
const yearsOf = () => { const e = estOf(); return e ? Object.keys(e.years).map(Number).sort((a, b) => a - b) : []; };
const basis = () => { const e = estOf(); return (e && st.basisYear != null) ? e.years[st.basisYear] : null; };
// Multiples need a USD estimate set: SPOT reports in EUR and TBBB in MXN, and a
// EUR EBITDA against a USD share price is simply a wrong number. Rule 6 — show
// nothing rather than something broken.
const usable = () => { const e = estOf(); return !!e && e.currency === 'USD'; };

// Diluted shares (M) and net debt ($M) for the basis year. Net debt falls back to
// the live enterprise-value − market-cap when the estimate set has none.
function capital(year) {
  const e = estOf(); const y = e && e.years[year];
  const shares = (y && y.shares != null) ? y.shares : (st.shares != null ? st.shares / 1e6 : null);
  const netDebt = (y && y.netDebt != null) ? y.netDebt
                : (st.netDebtLive != null ? st.netDebtLive / 1e6 : null);
  return { shares, netDebt };
}

// The two multiples a share price implies on a given estimate year.
function multiplesAt(price, year) {
  if (!usable() || price == null) return { pe: null, ev: null };
  const e = estOf(); const y = e && e.years[year];
  if (!y) return { pe: null, ev: null };
  const { shares, netDebt } = capital(year);
  const pe = (y.eps != null && y.eps > 0) ? price / y.eps : null;
  const ev = (y.ebitda != null && y.ebitda > 0 && shares != null && netDebt != null)
    ? (price * shares + netDebt) / y.ebitda : null;
  return { pe, ev };
}

// The inverse: the share price a target multiple implies. This is the scenario engine —
// "if AppLovin trades at 25x 2027E EPS, the stock is $517".
function priceFromMultiple(kind, m, year) {
  if (!usable() || !(m > 0)) return null;
  const e = estOf(); const y = e && e.years[year];
  if (!y) return null;
  if (kind === 'pe') return (y.eps != null && y.eps > 0) ? m * y.eps : null;
  const { shares, netDebt } = capital(year);
  if (y.ebitda == null || shares == null || netDebt == null) return null;
  return (m * y.ebitda - netDebt) / shares;
}
const scenPrice = () => priceFromMultiple(st.scenKind, st.scenMult, st.scenYear);

// ── The strike ladder ─────────────────────────────────────────────────────────
// One row per call contract, everything derived. `premium` is the basis the user
// chose; a buyer paying the ask is the honest default, mid is the fair-value view.
function premiumOf(c) {
  const q = c.last_quote || {};
  const last = (c.last_trade && c.last_trade.price) ?? (c.day && c.day.close) ?? null;
  if (st.premBasis === 'ask') return q.ask ?? q.midpoint ?? last;
  if (st.premBasis === 'mid') return q.midpoint ?? ((q.bid != null && q.ask != null) ? (q.bid + q.ask) / 2 : null) ?? last;
  return last ?? q.midpoint ?? q.ask;
}

function ladder() {
  if (st.spot == null) return [];
  const lo = st.spot * (1 - st.band), hi = st.spot * (1 + st.band);
  const S = scenPrice();
  return st.chain
    .filter((c) => c.details && c.details.strike_price >= lo && c.details.strike_price <= hi)
    .map((c) => {
      const K = c.details.strike_price;
      const prem = premiumOf(c);
      const cost = (prem != null) ? prem * 100 : null;                 // cheque per contract
      const notional = 100 * (st.notionalBasis === 'strike' ? K : st.spot);
      const be = (prem != null) ? K + prem : null;                     // breakeven at expiry
      const days = daysTo(c.details.expiration_date);
      const toBe = (be != null) ? be / st.spot - 1 : null;
      // The same move, annualized — a 22% move needed in 5 months is not a 22% bet.
      const annBe = (toBe != null && days > 0) ? Math.pow(1 + toBe, 365 / days) - 1 : null;
      const mK = multiplesAt(K, st.basisYear);
      const mBe = multiplesAt(be, st.basisYear);
      const delta = c.greeks ? c.greeks.delta : null;
      // Effective leverage: the $ of underlying each $ of premium moves with.
      const lev = (delta != null && prem) ? delta * st.spot / prem : null;
      // Scenario payoff at expiry, per contract.
      const payoff = (S != null) ? Math.max(0, S - K) * 100 : null;
      const pnl = (payoff != null && cost != null) ? payoff - cost : null;
      const moM = (payoff != null && cost) ? payoff / cost : null;
      const stockRet = (S != null) ? S / st.spot - 1 : null;           // same cash in shares
      // Sizing. Notional ÷ the % of the account it is allowed to be = the account
      // this position needs; the inverse gives the contracts an account supports.
      const minAcct = (st.exposurePct > 0) ? notional * st.contracts / st.exposurePct : null;
      const maxCts = (st.exposurePct > 0 && notional > 0)
        ? Math.floor(st.account * st.exposurePct / notional) : null;
      return {
        K, prem, cost, notional, be, days, toBe, annBe, delta, lev,
        iv: c.implied_volatility ?? null, theta: c.greeks ? c.greeks.theta : null,
        oi: c.open_interest ?? null,
        bid: (c.last_quote || {}).bid ?? null, ask: (c.last_quote || {}).ask ?? null,
        mid: (c.last_quote || {}).midpoint ?? null,
        lastTrade: (c.last_trade || {}).price ?? null,
        moneyness: K / st.spot - 1,
        premPctNotional: (prem != null) ? prem * 100 / notional : null,
        peK: mK.pe, evK: mK.ev, peBe: mBe.pe, evBe: mBe.ev,
        payoff, pnl, moM, stockRet,
        outlay: (cost != null) ? cost * st.contracts : null,
        minAcct, maxCts,
        exp: c.details.expiration_date,
      };
    })
    .sort((a, b) => a.K - b.K);
}

const selectedRow = () => {
  const rows = ladder();
  if (!rows.length) return null;
  return rows.find((r) => r.K === st.selected) || rows.find((r) => r.K >= st.spot) || rows[0];
};

// ── Fetching ──────────────────────────────────────────────────────────────────
async function loadExpiries() {
  const today = new Date().toISOString().slice(0, 10);
  let dates = [];
  try {
    const j = await mfetch('expirations', st.ticker, { 'expiration_date.gte': today });
    dates = [...new Set((j.results || []).map((c) => c.expiration_date))].filter(Boolean).sort();
  } catch { /* leave empty — the caller shows the error */ }
  // The contracts endpoint caps at 1000 rows, which on a busy name truncates the
  // long end — exactly the LEAPS a call buyer wants. Ask again from the far side.
  try {
    const j2 = await mfetch('expirations', st.ticker, { 'expiration_date.gte': dates[dates.length - 1] || today });
    dates = [...new Set(dates.concat((j2.results || []).map((c) => c.expiration_date)))].filter(Boolean).sort();
  } catch { /* the first list stands */ }
  st.expiries = dates;
  if (!dates.length) return;
  // Default to the first expiry at least ~6 months out: a valuation thesis needs time.
  st.expiry = dates.find((d) => daysTo(d) >= 150) || dates[dates.length - 1];
}

async function loadChain() {
  st.loading = true; st.err = null; render();
  try {
    const [snap, det, rat] = await Promise.all([
      mfetch('snapshot', st.ticker).catch(() => null),
      mfetch('details', st.ticker).catch(() => null),
      mfetch('ratios', st.ticker).catch(() => null),
    ]);
    const tk = snap && (snap.ticker || snap.results);
    const r0 = (rat && rat.results && rat.results[0]) || {};
    const d0 = (det && det.results) || {};
    st.spot = (tk && ((tk.lastTrade && tk.lastTrade.p) || (tk.min && tk.min.c) || (tk.day && tk.day.c) || (tk.prevDay && tk.prevDay.c))) || r0.price || null;
    st.changePct = tk && tk.todaysChangePerc != null ? tk.todaysChangePerc / 100 : null;
    st.name = d0.name || (estOf() ? estOf().name : st.ticker);
    st.shares = d0.weighted_shares_outstanding ?? d0.share_class_shares_outstanding ?? null;
    const mktCap = (st.spot != null && st.shares != null) ? st.spot * st.shares : (r0.market_cap ?? null);
    st.netDebtLive = (r0.enterprise_value != null && mktCap != null) ? r0.enterprise_value - mktCap : null;

    if (st.spot == null) throw new Error(`no live price for ${st.ticker}`);
    const j = await mfetch('chain', st.ticker, {
      contract_type: 'call', expiration_date: st.expiry,
      'strike_price.gte': Math.round(st.spot * 0.4), 'strike_price.lte': Math.round(st.spot * 2.2),
      limit: 250,
    });
    st.chain = (j.results || []).filter((c) => c.details && c.details.contract_type === 'call'
      && c.details.expiration_date === st.expiry);
    if (!st.chain.length) throw new Error(`no call contracts for ${st.ticker} at ${st.expiry}`);
    // Land the selection and the plotted set on the money.
    const rows = ladder();
    if (rows.length) {
      const atm = rows.find((r) => r.K >= st.spot) || rows[rows.length - 1];
      st.selected = atm.K;
      st.plotted = {};
      const i = rows.indexOf(atm);
      [rows[i], rows[i + 2], rows[i + 4]].forEach((r) => { if (r) st.plotted[r.K] = true; });
    }
  } catch (e) {
    st.err = e.message; st.chain = [];
  } finally {
    st.loading = false; render();
  }
}

async function loadTicker(tk) {
  st.ticker = tk.toUpperCase();
  killChart($('bc-canvas'));
  st.loading = true; st.err = null; st.chain = [];
  st.selected = null; st.plotted = {}; st.yr = null; st.win = null; st.hidden = {};
  const ys = yearsOf();
  // Default the valuation basis to the first estimate year we hold (2026E for APP),
  // and the scenario to the year after it — a LEAPS is usually underwritten a year out.
  const e = estOf();
  const estYears = ys.filter((y) => e && e.years[y] && e.years[y].est);
  st.basisYear = estYears[0] ?? ys[ys.length - 1] ?? null;
  st.scenYear = estYears[1] ?? st.basisYear;
  render();
  await loadExpiries();
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  await loadChain();
}

// ── The payoff chart (path-3 canvas, CHART_ENGINE_REFERENCE §0.7) ─────────────
const C_CALL = ['#1B3F94', '#2563EB', '#5E8BEC', '#93B1F0'];   // EVO_RAMP — ordinal by strike
const C_STOCK = 'rgba(30,39,51,0.92)';                          // RS_ACT — what you'd own instead
const C_ZERO = 'rgba(124,134,148,0.85)';

// The one predicate (rule 2): the chart, the table and every total ask this.
function vis(k) { return !st.hidden[k]; }

// Price grid on the x-axis — a category axis so the copied brush's index maths works.
function grid() {
  const rows = ladder();
  if (st.spot == null) return [];
  const ks = rows.map((r) => r.K);
  const lo = Math.max(1, Math.min(st.spot * 0.55, (ks[0] || st.spot) * 0.85));
  const hi = Math.max(st.spot * 1.75, (ks[ks.length - 1] || st.spot) * 1.3, (scenPrice() || 0) * 1.05);
  const n = 60, out = [];
  for (let i = 0; i <= n; i++) out.push(lo + (hi - lo) * i / n);
  return out;
}

// Series drawn: one per plotted strike, plus the same cash held in shares.
function series() {
  const rows = ladder().filter((r) => st.plotted[r.K] && r.prem != null);
  const out = rows.map((r, i) => ({
    k: `k${r.K}`, label: `$${r.K} call`, color: C_CALL[i % C_CALL.length], row: r,
  }));
  const ref = rows[0];
  if (ref) out.push({ k: 'stock', label: 'Same cash in shares', color: C_STOCK, row: ref, isStock: true });
  return out;
}

// The value of one series at one underlying price, in the current mode.
function valueAt(s, price) {
  const r = s.row;
  if (r.cost == null) return null;
  const n = st.mode === 'pos' ? st.contracts : 1;
  if (s.isStock) {
    // The same cheque put into shares instead: outlay × (price/spot − 1).
    const p = r.cost * n * (price / st.spot - 1);
    return st.mode === 'ret' ? (price / st.spot - 1) * 100 : p;
  }
  const pnl = (Math.max(0, price - r.K) - r.prem) * 100 * n;
  return st.mode === 'ret' ? pnl / (r.cost) * 100 : pnl;
}

const modeUnit = () => st.mode === 'ret' ? '%' : '$';
const modeFmt = (v) => v == null ? '—' : (st.mode === 'ret' ? `${v >= 0 ? '+' : ''}${v.toFixed(0)}%` : cash(v));

// Chart.js keeps its own registry keyed on the canvas element, so dropping our
// reference is not enough — a ticker switch would hit "canvas is already in use".
// Ask the registry too, then clear ours.
function killChart(el) {
  const prev = (typeof Chart !== 'undefined' && el) ? Chart.getChart(el) : null;
  if (prev) prev.destroy();
  if (st.chart) { try { st.chart.destroy(); } catch { /* already gone */ } }
  st.chart = null;
}

function buildChart() {
  const el = $('bc-canvas');
  if (!el || typeof Chart === 'undefined') return;
  const g = grid();
  if (!g.length) { killChart(el); return; }
  const lo = st.win ? st.win[0] : 0, hi = st.win ? st.win[1] : g.length - 1;
  const gx = g.slice(lo, hi + 1);
  const ss = series().filter((s) => vis(s.k));
  killChart(el);

  const datasets = ss.map((s) => ({
    label: s.label,
    data: gx.map((p) => valueAt(s, p)),
    borderColor: s.color,
    backgroundColor: s.color,
    borderWidth: s.isStock ? 1.6 : 2.2,
    borderDash: s.isStock ? [5, 4] : undefined,
    pointRadius: 0, pointHitRadius: 8, tension: 0,
  }));

  const S = scenPrice();
  // Vertical markers for spot and the valuation-implied price — a local plugin, the
  // rsFwdZone pattern (§0.7): passed in `plugins`, configured under options.plugins.
  const markers = {
    id: 'bcMarkers',
    beforeDatasetsDraw(chart, args, opts) {
      const { ctx, chartArea: a, scales } = chart;
      if (!a) return;
      (opts.at || []).forEach((m) => {
        if (m.i == null || m.i < 0) return;
        const x = scales.x.getPixelForValue(m.i);
        if (x < a.left || x > a.right) return;
        ctx.save();
        ctx.setLineDash(m.dash || [4, 4]);
        ctx.strokeStyle = m.color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, a.top); ctx.lineTo(x, a.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = m.color; ctx.font = '600 10px Inter, system-ui, sans-serif';
        ctx.textAlign = x > a.right - 70 ? 'right' : 'left';
        ctx.fillText(m.label, x > a.right - 70 ? x - 5 : x + 5, a.top + 11);
        ctx.restore();
      });
    },
  };
  const nearest = (p) => p == null ? -1 : gx.reduce((best, v, i) => Math.abs(v - p) < Math.abs(gx[best] - p) ? i : best, 0);
  const at = [{ i: nearest(st.spot), label: `spot ${px(st.spot)}`, color: 'rgba(124,134,148,0.9)' }];
  if (S != null && S >= gx[0] && S <= gx[gx.length - 1]) {
    at.push({ i: nearest(S), label: `${st.scenMult}x ${st.scenYear}E → ${px(S)}`, color: '#2563EB', dash: [2, 3] });
  }

  st.chart = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: gx.map((p) => `$${Math.round(p)}`), datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 200 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        bcMarkers: { at },
        tooltip: {
          callbacks: {
            title: (items) => `Underlying at expiry: ${items[0].label}`,
            label: (ctx) => `${ctx.dataset.label}: ${modeFmt(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
        y: {
          position: 'right', grid: { color: 'rgba(0,0,0,0.05)' },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
          ticks: { font: { size: 11 }, callback: (v) => st.mode === 'ret' ? `${v}%` : cash(v) },
        },
      },
    },
    plugins: [markers],
  });

  rsAttachBrush(el, st.chart,
    (a, b) => { st.win = [lo + a, lo + b]; buildChart(); },
    (v1, v2) => { st.yr = [v1, v2]; buildChart(); },
    () => { st.win = null; st.yr = null; buildChart(); });
}

// Copied verbatim from js/results.js:1298 — drag-to-zoom on both axes, double-click resets.
function rsAttachBrush(el, chart, onX, onY, onReset) {
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function (ev) {
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox() {
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical) {
        box.style.left = (r0.left - w0.left + area.left) + 'px';
        box.style.width = (area.right - area.left) + 'px';
      } else {
        box.style.top = (r0.top - w0.top) + 'px';
        box.style.height = r0.height + 'px';
      }
      wrap.appendChild(box);
    }
    function decide(cx, cy) {
      if (vertical != null) return;
      var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy) {
      if (vertical == null) return;
      ensureBox();
      if (vertical) {
        var a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx);
        box.style.left = (a2 - w0.left) + 'px';
        box.style.width = (b2 - a2) + 'px';
      }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2) { decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2) {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical) {
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(clientX) {
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        }
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

// ── Render: KPIs ──────────────────────────────────────────────────────────────
function renderKpis() {
  const r = selectedRow(), e = estOf(), S = scenPrice();
  const cur = multiplesAt(st.spot, st.basisYear);
  const yl = (y) => (e && e.years[y] && e.years[y].est) ? `${y}E` : `${y}`;
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Selected strike', r ? `$${r.K}` : '—', r ? `${pctS(r.moneyness)} · ${r.days}d to ${r.exp}` : '—'],
    ['Premium', r ? px(r.prem) : '—', r ? `${cash(r.cost)} per contract · ${st.premBasis}` : '—'],
    ['Breakeven', r ? px(r.be) : '—', r ? `${pctS(r.toBe)} · ${pctS(r.annBe)} ann.` : '—'],
    [`P/E at breakeven · ${yl(st.basisYear)}`, r ? mult(r.peBe) : '—',
      cur.pe != null ? `spot is ${mult(cur.pe)}` : (usable() ? 'no EPS estimate' : 'non-USD estimates')],
    ['Position cost', r ? cash(r.outlay) : '—', `${st.contracts} contract${st.contracts === 1 ? '' : 's'}`],
    ['Min. account', r ? cash(r.minAcct) : '—',
      r ? `${cash(r.notional * st.contracts)} notional at ${pct(st.exposurePct, 0)}` : '—'],
  ];
  $('bc-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');

  // The scenario read-out: the price a target multiple implies, and what the
  // selected call is worth there.
  const sc = $('bc-scenout');
  if (!sc) return;
  if (!usable()) {
    sc.innerHTML = `<span class="muted">${esc(e ? e.name : st.ticker)} reports in ${esc(e ? e.currency : '—')} — multiples against a USD share price would be wrong, so they are not shown.</span>`;
  } else if (S == null) {
    sc.innerHTML = '<span class="muted">no estimate for that year — pick another.</span>';
  } else {
    const up = S / st.spot - 1;
    sc.innerHTML = `<b>${st.scenMult}x ${esc(st.scenKind === 'pe' ? 'P/E' : 'EV/EBITDA')} on ${esc(yl(st.scenYear))}</b> → `
      + `<span class="big">${px(S)}</span> <span class="${up >= 0 ? 'up' : 'dn'}">${pctS(up)}</span> vs spot`
      + (r && r.moM != null ? ` · the $${r.K} call returns <span class="big ${r.pnl >= 0 ? 'up' : 'dn'}">${mom(r.moM)}</span> the premium (${cash(r.pnl * st.contracts)} on ${st.contracts})` : '');
  }
}

// ── Render: the strike ladder ─────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder(), e = estOf();
  const yl = (y) => (e && e.years[y] && e.years[y].est) ? `${y}E` : `${y}`;
  const S = scenPrice();
  $('bc-thead').innerHTML = `
    <tr>
      <th rowspan="2" class="lft">Plot</th>
      <th colspan="5" class="grp">Contract</th>
      <th colspan="4" class="grp sep">Cost &amp; exposure</th>
      <th colspan="4" class="grp sep">Breakeven · ${esc(yl(st.basisYear))}</th>
      <th colspan="2" class="grp sep">At strike · ${esc(yl(st.basisYear))}</th>
      <th colspan="3" class="grp sep">Scenario${S != null ? ' · ' + px(S) : ''}</th>
      <th colspan="2" class="grp sep">Sizing @ ${pct(st.exposurePct, 0)}</th>
    </tr>
    <tr>
      <th>Strike</th><th>Moneyness</th><th>Premium</th><th>IV</th><th>Delta</th>
      <th class="sep">Cost / ct</th><th>Notional / ct</th><th>Prem % not.</th><th>Leverage</th>
      <th class="sep">Breakeven</th><th>% move</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">P/E</th><th>EV/EBITDA</th>
      <th class="sep">Payoff / ct</th><th>P&amp;L / ct</th><th>× premium</th>
      <th class="sep">Max contracts</th><th>Min. account</th>
    </tr>`;

  if (!rows.length) {
    $('bc-tbody').innerHTML = `<tr><td colspan="21" class="muted">no strikes in the ±${pct(st.band, 0)} band — widen it.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear);
  $('bc-tbody').innerHTML = rows.map((r) => {
    const sel = r.K === (selectedRow() || {}).K;
    const itm = r.K <= st.spot;
    const q = `<b>Bid</b> ${px(r.bid)}  <b>Ask</b> ${px(r.ask)}  <b>Mid</b> ${px(r.mid)}<br><b>Last</b> ${px(r.lastTrade)} · <b>OI</b> ${r.oi == null ? '—' : r.oi.toLocaleString()} · <b>Theta</b> ${r.theta == null ? '—' : r.theta.toFixed(3)}`;
    return `<tr class="${sel ? 'sel' : ''}" data-k="${r.K}">
      <td class="lft"><input type="checkbox" data-plot="${r.K}" ${st.plotted[r.K] ? 'checked' : ''} title="draw on the payoff chart"></td>
      <td class="tk">$${r.K}${itm ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="${r.moneyness >= 0 ? '' : 'up'}">${pctS(r.moneyness)}</td>
      <td class="big">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      <td>${pct(r.iv, 0)}</td>
      <td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>
      <td class="sep">${cash(r.cost)}</td>
      <td>${cash(r.notional)}</td>
      <td>${pct(r.premPctNotional, 1)}</td>
      <td>${mom(r.lev)}</td>
      <td class="sep big">${px(r.be)}</td>
      <td class="dn">${pctS(r.toBe)}</td>
      <td class="${rich(r.peBe, curP.pe)}">${mult(r.peBe)}</td>
      <td class="${rich(r.evBe, curP.ev)}">${mult(r.evBe)}</td>
      <td class="sep ${rich(r.peK, curP.pe)}">${mult(r.peK)}</td>
      <td class="${rich(r.evK, curP.ev)}">${mult(r.evK)}</td>
      <td class="sep">${cash(r.payoff)}</td>
      <td class="${r.pnl == null ? '' : (r.pnl >= 0 ? 'up' : 'dn')}">${cash(r.pnl)}</td>
      <td class="big ${r.moM == null ? '' : (r.moM >= 1 ? 'up' : 'dn')}">${mom(r.moM)}</td>
      <td class="sep">${r.maxCts == null ? '—' : r.maxCts.toLocaleString()}</td>
      <td class="big">${cash(r.minAcct)}</td>
    </tr>`;
  }).join('');
  wireLadder();
}

// A strike that prices the company ABOVE today's multiple is the expensive one to
// underwrite — red. Below today's multiple, green.
const rich = (v, base) => (v != null && base != null) ? (v > base ? 'rich' : 'cheap') : '';

function wireLadder() {
  root().querySelectorAll('[data-plot]').forEach((el) => el.onclick = (ev) => {
    ev.stopPropagation();
    const k = +el.dataset.plot;
    if (el.checked) st.plotted[k] = true; else delete st.plotted[k];
    renderChartBlock();
  });
  root().querySelectorAll('#bc-tbody tr[data-k]').forEach((tr) => tr.onclick = () => {
    st.selected = +tr.dataset.k; render();
  });
}

// ── Render: the payoff chart block (legend, canvas, table) ────────────────────
function renderChartBlock() {
  const ss = series();
  $('bc-legend').innerHTML = ss.length
    ? ss.map((s) => `<button type="button" class="rs-leg ${vis(s.k) ? '' : 'off'}" data-leg="${esc(s.k)}">`
        + `<span class="${s.isStock ? 'rs-leg-dash' : 'rs-leg-line'}" style="background:${s.color}"></span>${esc(s.label)}</button>`).join('')
    : '<span class="muted">tick a strike in the ladder to draw it</span>';
  root().querySelectorAll('[data-leg]').forEach((el) => el.onclick = () => {
    const k = el.dataset.leg;
    if (st.hidden[k]) delete st.hidden[k]; else st.hidden[k] = true;
    renderChartBlock();
  });
  $('bc-collh').innerHTML = `<span class="rs-collap-ic">${st.tbl ? '▾' : '▸'}</span>Payoff at expiry`
    + `<span class="rs-collap-sub">${st.tbl ? 'hide' : 'show'} · ${ss.filter((s) => vis(s.k)).length} series `
    + `× ${grid().length} price points, ${st.mode === 'ret' ? 'return on premium' : 'P&L in $'}</span>`;
  $('bc-collb').hidden = !st.tbl;
  renderPayoffTable();
  buildChart();
}

// The table under the chart carries every series that is drawn, across the same
// price range — coarser on x so it stays readable (rule 3).
function renderPayoffTable() {
  const g = grid(), ss = series().filter((s) => vis(s.k));
  if (!g.length || !ss.length) { $('bc-tbl2').innerHTML = '<div class="muted">nothing drawn.</div>'; return; }
  const lo = st.win ? st.win[0] : 0, hi = st.win ? st.win[1] : g.length - 1;
  const gx = g.slice(lo, hi + 1);
  const step = Math.max(1, Math.round(gx.length / 14));
  const cols = gx.filter((_, i) => i % step === 0);
  const head = cols.map((p) => `<th>$${Math.round(p)}</th>`).join('');
  const body = ss.map((s) => {
    const cells = cols.map((p) => {
      const v = valueAt(s, p);
      return `<td class="${v == null ? 'rs-ft-nil' : (v >= 0 ? 'up' : 'dn')}">${esc(modeFmt(v))}</td>`;
    }).join('');
    const be = s.isStock ? st.spot : s.row.be;
    return `<tr><td class="rs-ft-h">${esc(s.label)}<span class="sub">breakeven ${px(be)}</span></td>${cells}</tr>`;
  }).join('');
  $('bc-tbl2').innerHTML = `
    <div class="rs-ft-cap">Underlying price at expiry (${esc(st.expiry || '')}) · values ${st.mode === 'ret' ? 'as a % of premium paid' : st.mode === 'pos' ? `for the whole ${st.contracts}-contract position` : 'per contract'}</div>
    <div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Series</th>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

// ── Render: the estimates strip and the footnote ──────────────────────────────
function renderEstimates() {
  const e = estOf(), ys = yearsOf();
  if (!e) { $('bc-est').innerHTML = ''; return; }
  const cols = ys.filter((y) => y >= 2024);
  $('bc-est').innerHTML = `
    <div class="rs-ft-cap">${esc(e.name)} — the estimates every multiple on this page is built on${e.currency !== 'USD' ? ` · reports in ${esc(e.currency)}` : ''}</div>
    <div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">$M unless noted</th>
      ${cols.map((y) => `<th class="${e.years[y].est ? 'rs-ft-este' : ''}">${y}${e.years[y].est ? '<span class="rs-ft-e">E</span>' : ''}</th>`).join('')}</tr></thead>
      <tbody>
        ${estRow('Revenue', cols, (y) => bn(e.years[y].rev), e)}
        ${estRow(e.ebitdaLabel, cols, (y) => bn(e.years[y].ebitda), e)}
        ${estRow('Net income', cols, (y) => bn(e.years[y].netIncome), e)}
        ${estRow(e.epsLabel, cols, (y) => e.years[y].eps == null ? '—' : `$${e.years[y].eps.toFixed(2)}`, e)}
        ${estRow('Diluted shares (M)', cols, (y) => e.years[y].shares == null ? '—' : e.years[y].shares.toFixed(1), e)}
        ${estRow('Net debt (cash)', cols, (y) => e.years[y].netDebt == null ? '—' : bn(e.years[y].netDebt), e)}
      </tbody></table></div>
    <div class="foot">${esc(e.source)}</div>`;
}
function estRow(label, cols, get, e) {
  return `<tr><td class="rs-ft-h">${esc(label)}</td>`
    + cols.map((y) => `<td class="${e.years[y].est ? 'rs-ft-este' : ''}">${esc(get(y))}</td>`).join('') + '</tr>';
}

function renderFoot() {
  const r = selectedRow();
  $('bc-foot').innerHTML = `
    <b>Premium basis</b> — a buyer lifting the offer pays the <b>ask</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old (hover the <b>i</b> for bid/ask/mid, last trade, open interest and theta).
    <b>Cost / ct</b> = premium × 100 · <b>Notional / ct</b> = ${st.notionalBasis === 'strike' ? 'strike' : 'spot'} × 100, the exposure one contract controls · <b>Leverage</b> = delta × spot ÷ premium, the dollars of underlying each dollar of premium moves with.<br>
    <b>Breakeven</b> = strike + premium, the price at expiry where the position returns the cheque; <b>% move</b> is the move from spot it needs${r && r.days ? `, over ${r.days} days` : ''}. The <b>P/E</b> and <b>EV/EBITDA</b> under it are the multiples the company would trade at <em>at that price</em> on the estimate year selected — that is the bar the thesis has to clear. EV/EBITDA uses the estimate year's own net debt where the model carries one, otherwise live enterprise value − market cap. <span class="cheap">Green</span> = below today's multiple, <span class="rich">red</span> = above it.<br>
    <b>Scenario</b> — pick a target multiple and a year and the page solves for the share price it implies, then values every strike there: <b>payoff</b> is intrinsic value at expiry, <b>P&amp;L</b> nets the premium, <b>× premium</b> is the multiple of money.<br>
    <b>Sizing</b> — <b>Min. account</b> = notional × contracts ÷ the exposure limit: the smallest account for which ${st.contracts} contract${st.contracts === 1 ? '' : 's'} still sits inside ${pct(st.exposurePct, 0)} of notional. <b>Max contracts</b> is the same rule read the other way, against the account value entered. Premium at risk is the cost, not the notional — the notional is what the position <em>controls</em>, and the exposure limit is a rule about that.<br>
    Price, premium, IV and greeks are live from the Massive option chain; estimates are as sourced under the table below. Nothing on this page is stored — every input is in-memory and resets on reload.`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!root()) return;
  if (st.loading) { $('bc-status').hidden = false; $('bc-status').textContent = `Loading ${st.ticker}…`; }
  else if (st.err) { $('bc-status').hidden = false; $('bc-status').innerHTML = `<span class="err">${esc(st.err)}</span>`; }
  else $('bc-status').hidden = true;

  $('bc-body').hidden = !!st.err || st.loading;
  syncControls();
  if (st.err || st.loading) return;
  renderKpis();
  renderLadder();
  renderChartBlock();
  renderEstimates();
  renderFoot();
}

function syncControls() {
  const e = estOf(), ys = yearsOf().filter((y) => y >= 2025);
  const sel = $('bc-expiry');
  if (sel) {
    sel.innerHTML = st.expiries.map((d) =>
      `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('')
      || '<option>—</option>';
  }
  const by = $('bc-basisYear'), sy = $('bc-scenYear');
  const opts = (cur) => ys.map((y) => `<option value="${y}" ${y === cur ? 'selected' : ''}>${y}${e && e.years[y] && e.years[y].est ? 'E' : 'A'}</option>`).join('');
  if (by) by.innerHTML = opts(st.basisYear);
  if (sy) sy.innerHTML = opts(st.scenYear);
  root().querySelectorAll('#bc-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  root().querySelectorAll('#bc-notSel button').forEach((b) => b.classList.toggle('on', b.dataset.not === st.notionalBasis));
  root().querySelectorAll('#bc-modeSel button').forEach((b) => b.classList.toggle('on', b.dataset.mode === st.mode));
  root().querySelectorAll('#bc-scenSel button').forEach((b) => b.classList.toggle('on', b.dataset.scen === st.scenKind));
  const tt = $('bc-tickers');
  if (tt) tt.innerHTML = Object.keys(BC_ESTIMATES).map((t) =>
    `<button type="button" class="chip ${t === st.ticker ? 'on' : ''}" data-tkbtn="${esc(t)}">${esc(t)}</button>`).join('');
}

// ── Markup ────────────────────────────────────────────────────────────────────
function injectMarkup() {
  root().innerHTML = `
    <div class="bc-wrap">
      <div class="topbar">
        <h2>Buy Calls — Long Call Analyzer</h2>
        <span class="pill">live · Massive</span>
        <div class="controls">
          <div class="ctl"><label>Ticker</label><input id="bc-ticker" value="${esc(st.ticker)}" size="6"></div>
          <div class="ctl"><label>Expiry</label><select id="bc-expiry"></select></div>
          <div class="ctl"><label>Premium</label><div class="seg" id="bc-premSel">
            <button data-prem="ask">Ask</button><button data-prem="mid">Mid</button><button data-prem="last">Last</button></div></div>
          <div class="ctl"><label>Valuation basis</label><select id="bc-basisYear"></select></div>
          <div class="ctl"><label>&nbsp;</label><button id="bc-refresh">↻ Refresh</button></div>
        </div>
      </div>
      <div class="sub">Buying a call is a bet on a price. This prices every strike and every breakeven back into the multiple it implies, then sizes the position against the account.</div>
      <div class="chips" id="bc-tickers"></div>

      <div id="bc-status" class="spin">Loading…</div>
      <div id="bc-body" hidden>
        <div class="kpis" id="bc-kpis"></div>

        <div class="panel">
          <div class="panel-h">Sizing &amp; scenario</div>
          <div class="panel-b">
            <div class="ctl"><label>Account value</label><input id="bc-account" type="number" step="10000" value="${st.account}"></div>
            <div class="ctl"><label>Max exposure (% of notional)</label><input id="bc-exposure" type="number" step="1" value="${(st.exposurePct * 100).toFixed(0)}"></div>
            <div class="ctl"><label>Contracts</label><input id="bc-contracts" type="number" step="1" min="1" value="${st.contracts}"></div>
            <div class="ctl"><label>Notional basis</label><div class="seg" id="bc-notSel">
              <button data-not="spot">Spot × 100</button><button data-not="strike">Strike × 100</button></div></div>
            <div class="ctl"><label>Strike band (±%)</label><input id="bc-band" type="number" step="5" min="5" max="120" value="${(st.band * 100).toFixed(0)}"></div>
            <div class="ctl grow"><label>Scenario — the price a target multiple implies</label>
              <div class="row">
                <div class="seg" id="bc-scenSel"><button data-scen="pe">P/E</button><button data-scen="ev">EV/EBITDA</button></div>
                <input id="bc-scenMult" type="number" step="0.5" min="0" value="${st.scenMult}" title="target multiple">
                <span class="x">on</span>
                <select id="bc-scenYear"></select>
              </div>
            </div>
          </div>
          <div class="scenout" id="bc-scenout"></div>
        </div>

        <div class="card">
          <table id="bc-tbl"><thead id="bc-thead"></thead><tbody id="bc-tbody"></tbody></table>
        </div>

        <div class="block">
          <div class="block-top">
            <div class="block-h">Payoff at expiry</div>
            <div class="rs-modes">
              <div class="seg" id="bc-modeSel">
                <button data-mode="pnl">P&amp;L / contract</button><button data-mode="ret">% of premium</button><button data-mode="pos">Whole position</button>
              </div>
            </div>
          </div>
          <div class="legend rs-leg-row" id="bc-legend"></div>
          <div class="cwrap"><canvas id="bc-canvas" height="300"></canvas></div>
          <div class="hint">Drag across the chart to zoom — sideways for the price range, down for the value axis. Double-click resets.</div>
          <div class="rs-collap">
            <button type="button" class="rs-collap-h" id="bc-collh"></button>
            <div class="rs-collap-b" id="bc-collb" hidden><div class="rs-tablewrap" id="bc-tbl2"></div></div>
          </div>
        </div>

        <div class="block"><div id="bc-est" class="rs-tablewrap"></div></div>
        <div class="foot" id="bc-foot"></div>
      </div>
    </div>
    <div id="bc-tip"></div>`;
}

// ── Wiring ────────────────────────────────────────────────────────────────────
function wireControls() {
  const r = root();
  const num = (id, f) => { const el = $(id); if (el) el.onchange = () => { f(parseFloat(el.value)); render(); }; };

  $('bc-refresh').onclick = () => loadChain();
  $('bc-ticker').onchange = () => {
    const t = ($('bc-ticker').value || '').trim().toUpperCase();
    if (t && t !== st.ticker) loadTicker(t);
  };
  $('bc-expiry').onchange = () => { st.expiry = $('bc-expiry').value; loadChain(); };
  $('bc-basisYear').onchange = () => { st.basisYear = +$('bc-basisYear').value; render(); };
  $('bc-scenYear').onchange = () => { st.scenYear = +$('bc-scenYear').value; render(); };

  num('bc-account', (v) => { st.account = isFinite(v) ? v : st.account; });
  num('bc-exposure', (v) => { st.exposurePct = (isFinite(v) && v > 0) ? v / 100 : st.exposurePct; });
  num('bc-contracts', (v) => { st.contracts = (isFinite(v) && v >= 1) ? Math.round(v) : st.contracts; });
  num('bc-band', (v) => { st.band = (isFinite(v) && v > 0) ? Math.min(1.2, v / 100) : st.band; });
  num('bc-scenMult', (v) => { st.scenMult = (isFinite(v) && v > 0) ? v : st.scenMult; });

  // Delegated on the tab root, never on document (§12, invariant 2).
  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#bc-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const not = ev.target.closest('#bc-notSel button');
    if (not) { st.notionalBasis = not.dataset.not; render(); return; }
    const scen = ev.target.closest('#bc-scenSel button');
    if (scen) { st.scenKind = scen.dataset.scen; st.scenMult = scen.dataset.scen === 'pe' ? 25 : 20; $('bc-scenMult').value = st.scenMult; render(); return; }
    const mode = ev.target.closest('#bc-modeSel button');
    // Switching mode changes the y-axis units, so the zoom is dropped rather than
    // cropping a % range to a $ one (§0.2, rule 1).
    if (mode) { st.mode = mode.dataset.mode; st.yr = null; renderChartBlock(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('bc-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
    const coll = ev.target.closest('#bc-collh');
    if (coll) { st.tbl = !st.tbl; renderChartBlock(); return; }
  });

  // Cursor tooltip for the quote detail on each premium.
  const tip = $('bc-tip');
  r.addEventListener('mouseover', (ev) => {
    const el = ev.target.closest('[data-tip]');
    if (!el) return;
    tip.innerHTML = el.dataset.tip; tip.classList.add('on');
  });
  r.addEventListener('mousemove', (ev) => {
    if (!tip.classList.contains('on')) return;
    tip.style.left = (ev.clientX + 14) + 'px';
    tip.style.top = (ev.clientY + 16) + 'px';
  });
  r.addEventListener('mouseout', (ev) => {
    if (ev.target.closest('[data-tip]')) tip.classList.remove('on');
  });
}

// ── Page loader ───────────────────────────────────────────────────────────────
let _inited = false;
export async function loadBuyCallsPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadTicker(BC_DEFAULT_TICKER);
}
