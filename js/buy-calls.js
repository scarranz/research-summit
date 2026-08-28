// Buy Calls — long-call analyzer.
//
// The mirror image of the Covered Calls tab. There we SELL a call and ask "at what
// valuation do I get called away"; here we BUY one and ask two questions the option
// chain alone cannot answer:
//
//   1. What multiple am I underwriting?  A $400 strike is meaningless until it is
//      "28x 2027E EPS". Every strike and every breakeven is priced back into an
//      implied P/E and EV/EBITDA on a year picked in the table header itself.
//   2. How big an account does one contract need?  Notional ÷ the share of the
//      account we allow a single position to control.
//
// The ladder is a HAND-PICKED list of strikes, not the whole chain — a long call is
// a considered bet on a few strikes, so they are added deliberately (a dropdown of
// what is listed, or a range) and removed one by one.
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
const mult = (x) => (x == null || !isFinite(x) || x <= 0) ? '—' : `${x.toFixed(1)}x`;
const pct = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : `${(x * 100).toFixed(d)}%`;
const pctS = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`;
// Dollars at position size — these get large, so compact above $10K.
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

  strikes: [],               // the hand-picked ladder, ascending
  rangeFrom: null, rangeTo: null,   // the "add range" inputs
  seeded: false,             // has this ticker's default range been laid down yet

  basisYear: null,           // estimate year driving every multiple (picked in the header)
  premBasis: 'ask',          // 'ask' | 'mid' | 'last' — a buyer lifts the ask
  notionalBasis: 'strike',   // 'strike' | 'spot'
  exposurePct: 0.02,         // share of the account one contract's notional may be
  expand: false,             // show IV + delta inside the Contract group

  selected: null,            // selected strike (drives the KPI strip)
  plotted: {},               // strike -> true, the strikes drawn on the payoff chart
  mode: 'pnl',               // 'pnl' | 'ret'
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
// Multiples need a USD estimate set: SPOT reports in EUR and TBBB in MXN, and a
// EUR EBITDA against a USD share price is simply a wrong number. Rule 6 — show
// nothing rather than something broken.
const usable = () => { const e = estOf(); return !!e && e.currency === 'USD'; };
const yl = (y) => { const e = estOf(); return (e && e.years[y] && e.years[y].est) ? `${y}E` : `${y}`; };

// Diluted shares (M) and net debt ($M) for a year. Net debt falls back to the live
// enterprise-value − market-cap when the estimate set has none.
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

// ── The strike ladder ─────────────────────────────────────────────────────────
// `premium` is the basis the user chose; a buyer paying the ask is the honest
// default, mid is the fair-value view.
function premiumOf(c) {
  const q = c.last_quote || {};
  const last = (c.last_trade && c.last_trade.price) ?? (c.day && c.day.close) ?? null;
  if (st.premBasis === 'ask') return q.ask ?? q.midpoint ?? last;
  if (st.premBasis === 'mid') return q.midpoint ?? ((q.bid != null && q.ask != null) ? (q.bid + q.ask) / 2 : null) ?? last;
  return last ?? q.midpoint ?? q.ask;
}

// Every strike listed at this expiry, ascending — the menu the picker offers.
function listedStrikes() {
  return [...new Set(st.chain.map((c) => c.details.strike_price))].sort((a, b) => a - b);
}
// The modal gap between consecutive listed strikes: the chain's own increment.
function strikeStep(all) {
  const gaps = {};
  for (let i = 1; i < all.length; i++) {
    const g = +(all[i] - all[i - 1]).toFixed(2);
    gaps[g] = (gaps[g] || 0) + 1;
  }
  let best = null, n = 0;
  Object.keys(gaps).forEach((g) => { if (gaps[g] > n) { n = gaps[g]; best = +g; } });
  return best || 5;
}
// The ladder a new ticker opens on: ten increments of listed strikes starting just
// out of the money. On AppLovin at ~$319 with $10 strikes that is exactly 350–450.
function defaultRange() {
  const all = listedStrikes();
  if (!all.length || st.spot == null) return { from: null, to: null };
  const step = strikeStep(all);
  const from = Math.ceil(st.spot * 1.08 / step) * step;
  return { from, to: from + 10 * step };
}

function rowFor(K) {
  const c = st.chain.find((x) => x.details.strike_price === K) || null;
  const notional = 100 * (st.notionalBasis === 'spot' ? st.spot : K);
  const base = {
    K, listed: !!c, notional,
    // Sizing: the account for which one contract's notional is still no more than
    // the exposure limit.
    minPort: (st.exposurePct > 0) ? notional / st.exposurePct : null,
    moneyness: (st.spot != null) ? K / st.spot - 1 : null,
  };
  if (!c) return base;
  const prem = premiumOf(c);
  const be = (prem != null) ? K + prem : null;
  const mK = multiplesAt(K, st.basisYear);
  const mBe = multiplesAt(be, st.basisYear);
  return {
    ...base,
    prem, be,
    cost: (prem != null) ? prem * 100 : null,
    // What the option costs as a share of the strike it buys — the cheapness of the
    // optionality, independent of the size of the stock.
    costPct: (prem != null && K) ? prem / K : null,
    toBe: (be != null && st.spot != null) ? be / st.spot - 1 : null,
    days: daysTo(c.details.expiration_date),
    iv: c.implied_volatility ?? null,
    delta: c.greeks ? c.greeks.delta : null,
    theta: c.greeks ? c.greeks.theta : null,
    oi: c.open_interest ?? null,
    bid: (c.last_quote || {}).bid ?? null, ask: (c.last_quote || {}).ask ?? null,
    mid: (c.last_quote || {}).midpoint ?? null,
    lastTrade: (c.last_trade || {}).price ?? null,
    peK: mK.pe, evK: mK.ev, peBe: mBe.pe, evBe: mBe.ev,
    exp: c.details.expiration_date,
  };
}

const ladder = () => st.strikes.slice().sort((a, b) => a - b).map(rowFor);

const selectedRow = () => {
  const rows = ladder().filter((r) => r.listed);
  if (!rows.length) return null;
  return rows.find((r) => r.K === st.selected) || rows[0];
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
      'strike_price.gte': Math.round(st.spot * 0.4), 'strike_price.lte': Math.round(st.spot * 2.4),
      limit: 250,
    });
    st.chain = (j.results || []).filter((c) => c.details && c.details.contract_type === 'call'
      && c.details.expiration_date === st.expiry);
    if (!st.chain.length) throw new Error(`no call contracts for ${st.ticker} at ${st.expiry}`);

    // Lay down the default ladder once per ticker; a later expiry change keeps
    // whatever the user has picked.
    const dr = defaultRange();
    if (st.rangeFrom == null) { st.rangeFrom = dr.from; st.rangeTo = dr.to; }
    if (!st.seeded) {
      st.seeded = true;
      st.strikes = listedStrikes().filter((k) => k >= dr.from - 1e-9 && k <= dr.to + 1e-9);
      st.selected = st.strikes[0] ?? null;
      st.plotted = {};
      [st.strikes[0], st.strikes[Math.floor(st.strikes.length / 2)], st.strikes[st.strikes.length - 1]]
        .forEach((k) => { if (k != null) st.plotted[k] = true; });
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
  st.strikes = []; st.seeded = false; st.rangeFrom = null; st.rangeTo = null;
  st.selected = null; st.plotted = {}; st.yr = null; st.win = null; st.hidden = {};
  const ys = yearsOf(), e = estOf();
  // Default the valuation basis to the first estimate year we hold (2026E for APP).
  const estYears = ys.filter((y) => e && e.years[y] && e.years[y].est);
  st.basisYear = estYears[0] ?? ys[ys.length - 1] ?? null;
  render();
  await loadExpiries();
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  await loadChain();
}

// ── The payoff chart (path-3 canvas, CHART_ENGINE_REFERENCE §0.7) ─────────────
const C_CALL = ['#1B3F94', '#2563EB', '#5E8BEC', '#93B1F0'];   // EVO_RAMP — ordinal by strike
const C_STOCK = 'rgba(30,39,51,0.92)';                          // RS_ACT — what you'd own instead

// The one predicate (rule 2): the chart, the table and every total ask this.
function vis(k) { return !st.hidden[k]; }

// Price grid on the x-axis — a category axis so the copied brush's index maths works.
function grid() {
  if (st.spot == null) return [];
  const ks = ladder().filter((r) => r.listed).map((r) => r.K);
  const lo = Math.max(1, Math.min(st.spot * 0.65, (ks[0] || st.spot) * 0.85));
  const hi = Math.max(st.spot * 1.6, (ks[ks.length - 1] || st.spot) * 1.35);
  const n = 60, out = [];
  for (let i = 0; i <= n; i++) out.push(lo + (hi - lo) * i / n);
  return out;
}

// Series drawn: one per plotted strike, plus the same cash held in shares.
function series() {
  const rows = ladder().filter((r) => r.listed && st.plotted[r.K] && r.prem != null);
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
  if (s.isStock) {
    // The same cheque put into shares instead: outlay × (price/spot − 1).
    return st.mode === 'ret' ? (price / st.spot - 1) * 100 : r.cost * (price / st.spot - 1);
  }
  const pnl = (Math.max(0, price - r.K) - r.prem) * 100;
  return st.mode === 'ret' ? pnl / r.cost * 100 : pnl;
}

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

  // A vertical marker at spot — a local plugin, the rsFwdZone pattern (§0.7):
  // passed in `plugins`, configured under options.plugins.
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
  const r = selectedRow();
  const cur = multiplesAt(st.spot, st.basisYear);
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Selected strike', r ? `$${r.K}` : '—', r ? `${pctS(r.moneyness)} · ${r.days}d to ${r.exp}` : 'pick a strike'],
    ['Premium', r ? px(r.prem) : '—', r ? `${cash(r.cost)} per contract · ${st.premBasis}` : '—'],
    ['Breakeven', r ? px(r.be) : '—', r ? `${pctS(r.toBe)} from spot` : '—'],
    [`P/E at breakeven · ${yl(st.basisYear)}`, r ? mult(r.peBe) : '—',
      cur.pe != null ? `spot is ${mult(cur.pe)}` : (usable() ? 'no EPS estimate' : 'non-USD estimates')],
    ['Min. portfolio', r ? cash(r.minPort) : '—',
      r ? `${cash(r.notional)} notional at ${pct(st.exposurePct, 1)}` : '—'],
  ];
  $('bc-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');

  const note = $('bc-note');
  if (note) {
    note.innerHTML = usable() ? ''
      : `<span class="muted">${esc(estOf() ? estOf().name : st.ticker)} reports in ${esc(estOf() ? estOf().currency : '—')} — multiples against a USD share price would be wrong, so they are not shown.</span>`;
  }
}

// ── Render: the strike ladder ─────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder(), ys = yearsOf().filter((y) => y >= 2025), e = estOf();
  const yearSel = `<select id="bc-basisYear" class="hsel">`
    + ys.map((y) => `<option value="${y}" ${y === st.basisYear ? 'selected' : ''}>${y}${e && e.years[y] && e.years[y].est ? 'E' : ''}</option>`).join('')
    + `</select>`;
  const nContract = st.expand ? 5 : 3;
  $('bc-thead').innerHTML = `
    <tr>
      <th rowspan="2" class="lft">Plot</th>
      <th colspan="${nContract}" class="grp">Contract
        <button type="button" class="xp" id="bc-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="2" class="grp sep">At strike · ${yearSel}</th>
      <th colspan="4" class="grp sep">Breakeven · ${esc(yl(st.basisYear))}</th>
      <th colspan="3" class="grp sep">Summary</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th>Strike</th><th>Moneyness</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">P/E</th><th>EV/EBITDA</th>
      <th class="sep">Breakeven</th><th>% move</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">Cost % of strike</th>
      <th>Exposure <input id="bc-expo" class="hnum" type="number" step="0.5" min="0.1" value="${(st.exposurePct * 100).toFixed(1)}"></th>
      <th>Min. portfolio</th>
    </tr>`;

  const ncol = 1 + nContract + 2 + 4 + 3 + 1;
  if (!rows.length) {
    $('bc-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear);
  $('bc-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="lft"></td><td class="tk">$${r.K}</td>
        <td colspan="${ncol - 3}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const sel = r.K === (selectedRow() || {}).K;
    const itm = st.spot != null && r.K <= st.spot;
    const q = `<b>Bid</b> ${px(r.bid)}  <b>Ask</b> ${px(r.ask)}  <b>Mid</b> ${px(r.mid)}<br>`
      + `<b>Last</b> ${px(r.lastTrade)} · <b>OI</b> ${r.oi == null ? '—' : r.oi.toLocaleString()} · <b>Theta</b> ${r.theta == null ? '—' : r.theta.toFixed(3)}`
      + `<br><b>Cost</b> ${cash(r.cost)} / contract · <b>Notional</b> ${cash(r.notional)}`;
    return `<tr class="${sel ? 'sel' : ''}" data-k="${r.K}">
      <td class="lft"><input type="checkbox" data-plot="${r.K}" ${st.plotted[r.K] ? 'checked' : ''} title="draw on the payoff chart"></td>
      <td class="tk">$${r.K}${itm ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="${r.moneyness >= 0 ? '' : 'up'}">${pctS(r.moneyness)}</td>
      <td class="big">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      ${st.expand ? `<td>${pct(r.iv, 0)}</td><td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>` : ''}
      <td class="sep ${rich(r.peK, curP.pe)}">${mult(r.peK)}</td>
      <td class="${rich(r.evK, curP.ev)}">${mult(r.evK)}</td>
      <td class="sep big">${px(r.be)}</td>
      <td class="dn">${pctS(r.toBe)}</td>
      <td class="${rich(r.peBe, curP.pe)}">${mult(r.peBe)}</td>
      <td class="${rich(r.evBe, curP.ev)}">${mult(r.evBe)}</td>
      <td class="sep">${pct(r.costPct, 1)}</td>
      <td class="muted">${pct(st.exposurePct, 1)}</td>
      <td class="big">${cash(r.minPort)}</td>
      <td class="sep"><button class="x" data-del="${r.K}" title="remove this strike">✕</button></td>
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
  root().querySelectorAll('[data-del]').forEach((el) => el.onclick = (ev) => {
    ev.stopPropagation();
    const k = +el.dataset.del;
    st.strikes = st.strikes.filter((x) => x !== k);
    delete st.plotted[k];
    if (st.selected === k) st.selected = st.strikes[0] ?? null;
    render();
  });
  root().querySelectorAll('#bc-tbody tr[data-k]').forEach((tr) => tr.onclick = () => {
    st.selected = +tr.dataset.k; render();
  });
}

// ── Render: the strike picker ─────────────────────────────────────────────────
function renderPicker() {
  const all = listedStrikes();
  const free = all.filter((k) => !st.strikes.includes(k));
  // Open the menu on the nearest unpicked strike above the money — the one someone
  // reaching for this control almost always wants — rather than the deepest ITM.
  const dflt = free.find((k) => st.spot != null && k >= st.spot) ?? free[free.length - 1];
  $('bc-addSel').innerHTML = free.length
    ? free.map((k) => `<option value="${k}" ${k === dflt ? 'selected' : ''}>$${k}</option>`).join('')
    : '<option value="">all listed strikes added</option>';
  const f = $('bc-from'), t = $('bc-to');
  if (f && document.activeElement !== f) f.value = st.rangeFrom ?? '';
  if (t && document.activeElement !== t) t.value = st.rangeTo ?? '';
  $('bc-pickinfo').textContent = all.length
    ? `${st.strikes.length} picked · ${all.length} listed at ${st.expiry} ($${all[0]}–$${all[all.length - 1]})`
    : '';
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
    <div class="rs-ft-cap">Underlying price at expiry (${esc(st.expiry || '')}) · values ${st.mode === 'ret' ? 'as a % of premium paid' : 'per contract'}</div>
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
  $('bc-foot').innerHTML = `
    <b>Contract</b> — a buyer lifting the offer pays the <b>ask</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old. Hover the <b>i</b> for bid/ask/mid, last trade, open interest, theta, and the cash cost and notional of one contract. <b>+</b> opens IV and delta.<br>
    <b>At strike</b> and <b>Breakeven</b> — the multiples the company would trade at <em>at that price</em>, on the estimate year picked in the header (both groups follow it). Breakeven = strike + premium, the price at expiry where the position returns the cheque; <b>% move</b> is the move from spot it needs. EV/EBITDA uses the estimate year's own net debt where the model carries one, otherwise live enterprise value − market cap. <span class="cheap">Green</span> = below today's multiple, <span class="rich">red</span> = above it.<br>
    <b>Summary</b> — <b>Cost % of strike</b> = premium ÷ strike, what the optionality costs relative to what it buys. <b>Exposure</b> is the share of the account a single contract's notional is allowed to be; set it in the header and it applies to every row. <b>Min. portfolio</b> = notional ÷ that exposure — the smallest account for which one contract still sits inside the limit, with notional = ${st.notionalBasis === 'strike' ? 'strike' : 'spot'} × 100. Note the cash at risk is the premium, not the notional: the notional is what the position <em>controls</em>, and the exposure limit is a rule about that.<br>
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
  renderPicker();
  renderChartBlock();
  renderEstimates();
  renderFoot();
}

function syncControls() {
  const sel = $('bc-expiry');
  if (sel) {
    sel.innerHTML = st.expiries.map((d) =>
      `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('')
      || '<option>—</option>';
  }
  root().querySelectorAll('#bc-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  root().querySelectorAll('#bc-notSel button').forEach((b) => b.classList.toggle('on', b.dataset.not === st.notionalBasis));
  root().querySelectorAll('#bc-modeSel button').forEach((b) => b.classList.toggle('on', b.dataset.mode === st.mode));
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
          <div class="ctl"><label>Notional basis</label><div class="seg" id="bc-notSel">
            <button data-not="strike">Strike × 100</button><button data-not="spot">Spot × 100</button></div></div>
          <div class="ctl"><label>&nbsp;</label><button id="bc-refresh">↻ Refresh</button></div>
        </div>
      </div>
      <div class="sub">Buying a call is a bet on a price. This prices the strikes you pick, and their breakevens, back into the multiple they imply.</div>
      <div class="chips" id="bc-tickers"></div>

      <div id="bc-status" class="spin">Loading…</div>
      <div id="bc-body" hidden>
        <div class="kpis" id="bc-kpis"></div>
        <div id="bc-note"></div>

        <div class="card">
          <table id="bc-tbl"><thead id="bc-thead"></thead><tbody id="bc-tbody"></tbody></table>
        </div>

        <div class="picker">
          <div class="ctl"><label>Add strike</label><select id="bc-addSel"></select></div>
          <button id="bc-addBtn" class="ghost sm">+ Add</button>
          <span class="divider"></span>
          <div class="ctl"><label>Range from</label><input id="bc-from" type="number" step="5"></div>
          <div class="ctl"><label>to</label><input id="bc-to" type="number" step="5"></div>
          <button id="bc-addRange" class="ghost sm">+ Add range</button>
          <button id="bc-clear" class="ghost sm">Clear all</button>
          <span class="muted" id="bc-pickinfo"></span>
        </div>

        <div class="block">
          <div class="block-top">
            <div class="block-h">Payoff at expiry</div>
            <div class="rs-modes">
              <div class="seg" id="bc-modeSel">
                <button data-mode="pnl">P&amp;L / contract</button><button data-mode="ret">% of premium</button>
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
function addStrikes(list) {
  const set = new Set(st.strikes);
  list.forEach((k) => { if (isFinite(k)) set.add(k); });
  st.strikes = [...set].sort((a, b) => a - b);
  if (st.selected == null) st.selected = st.strikes[0] ?? null;
  render();
}

function wireControls() {
  const r = root();

  $('bc-refresh').onclick = () => loadChain();
  $('bc-ticker').onchange = () => {
    const t = ($('bc-ticker').value || '').trim().toUpperCase();
    if (t && t !== st.ticker) loadTicker(t);
  };
  $('bc-expiry').onchange = () => { st.expiry = $('bc-expiry').value; loadChain(); };

  $('bc-addBtn').onclick = () => {
    const v = parseFloat($('bc-addSel').value);
    if (isFinite(v)) addStrikes([v]);
  };
  $('bc-addRange').onclick = () => {
    const a = parseFloat($('bc-from').value), b = parseFloat($('bc-to').value);
    if (!isFinite(a) || !isFinite(b)) return;
    st.rangeFrom = Math.min(a, b); st.rangeTo = Math.max(a, b);
    addStrikes(listedStrikes().filter((k) => k >= st.rangeFrom - 1e-9 && k <= st.rangeTo + 1e-9));
  };
  $('bc-clear').onclick = () => { st.strikes = []; st.plotted = {}; st.selected = null; render(); };

  // Delegated on the tab root, never on document (§12, invariant 2). The year
  // dropdown and the exposure input live inside the table header, which is
  // rewritten on every render, so they cannot be bound directly.
  r.addEventListener('change', (ev) => {
    if (ev.target.id === 'bc-basisYear') { st.basisYear = +ev.target.value; render(); }
    if (ev.target.id === 'bc-expo') {
      const v = parseFloat(ev.target.value);
      if (isFinite(v) && v > 0) st.exposurePct = v / 100;
      render();
    }
  });

  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#bc-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const not = ev.target.closest('#bc-notSel button');
    if (not) { st.notionalBasis = not.dataset.not; render(); return; }
    if (ev.target.closest('#bc-expand')) { st.expand = !st.expand; render(); return; }
    const mode = ev.target.closest('#bc-modeSel button');
    // Switching mode changes the y-axis units, so the zoom is dropped rather than
    // cropping a % range to a $ one (§0.2, rule 1).
    if (mode) { st.mode = mode.dataset.mode; st.yr = null; renderChartBlock(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('bc-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
    if (ev.target.closest('#bc-collh')) { st.tbl = !st.tbl; renderChartBlock(); return; }
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
