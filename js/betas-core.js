// Tools ▸ Betas — the shared engine behind the Calculator, History and Portfolio sub-tabs.
//
//   • Prices   — daily closes, from the portal's embedded IBKR history
//                (portfolio-metrics-prices-daily.js, ~5 years, loaded on first use) or
//                live from Massive through the get-market-history edge function
//                (api.fetchPriceHistory) for names or windows the embed doesn't cover.
//   • Maths    — resample to daily / weekly / monthly, align stock and index on the
//                same periods, and regress: β = cov(stock, index) / var(index),
//                plus α, correlation, R², the standard error of β, annualised vols,
//                the Blume (Bloomberg) adjustment and a rolling series.
//   • Beta history — every submitted calculation (beta + method + stats), newest
//                first. The Portfolio tab uses each name's latest submission. Kept in
//                localStorage for now (per browser), in the shape of the future
//                beta_history table (sql/024_beta_history.sql).
//
// Also carries the two chart helpers every canvas in the portal copies from
// js/results.js (esc, rsAttachBrush), per docs/CHART_ENGINE_REFERENCE.md §0.7.

import { fetchPriceHistory } from './api.js';

// ── Formatting ───────────────────────────────────────────────────────────────
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
export const fmtB = (v, d = 2) => (v == null || !isFinite(v) ? '—' : v.toFixed(d));
export const fmtPct = (v, d = 2) => (v == null || !isFinite(v) ? '—' : v.toFixed(d) + '%');
export const fmtUsd = (v) => (v == null || !isFinite(v) ? '—'
  : (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 }));
export function num(v) {
  if (v === '' || v == null) return null;
  const n = Number(String(v).replace(/[,%$\s]/g, '').replace('−', '-'));
  return isFinite(n) ? n : null;
}

// ── Frequencies ──────────────────────────────────────────────────────────────
export const FREQS = {
  daily:   { label: 'Daily',   short: 'D', ppy: 252, noun: 'days',   adj: 'daily' },
  weekly:  { label: 'Weekly',  short: 'W', ppy: 52,  noun: 'weeks',  adj: 'weekly' },
  monthly: { label: 'Monthly', short: 'M', ppy: 12,  noun: 'months', adj: 'monthly' },
};
// "5Y·M", "18M·W" — the compact method tag used across the tabs.
export const lookTag = (amt, unit) => `${amt}${unit === 'y' ? 'Y' : 'M'}`;
export const methodTag = (m) => `${lookTag(m.amt, m.unit)}·${FREQS[m.freq].short}`;
export const monthsOf = (amt, unit) => (unit === 'y' ? Number(amt) * 12 : Number(amt));

// ── Prices ───────────────────────────────────────────────────────────────────
let _embed = null;          // { asOf, series: { T: [[date, close], …] } }
let _embedP = null;
export function loadEmbedded() {
  if (_embed) return Promise.resolve(_embed);
  if (!_embedP) {
    _embedP = import('./portfolio-metrics-prices-daily.js').then((m) => {
      _embed = m.PRICES_DAILY;
      return _embed;
    });
  }
  return _embedP;
}
export const embeddedNow = () => _embed;
export function embeddedTickers() {
  return _embed ? Object.keys(_embed.series).sort() : [];
}
// The embed keys a few names by their app label (TSMC); Massive wants the listing.
const EMBED_ALIAS = { TSM: 'TSMC', TSMC: 'TSM' };
function embeddedSeries(t) {
  if (!_embed) return null;
  const s = _embed.series[t] || _embed.series[EMBED_ALIAS[t]];
  return Array.isArray(s) && s.length ? s : null;
}

const _live = new Map();   // ticker → Promise<[[date, close]]>
function isoDay(d) { return d.toISOString().slice(0, 10); }
function liveSeries(t) {
  if (!_live.has(t)) {
    const to = new Date();
    const from = new Date(Date.UTC(to.getUTCFullYear() - 15, to.getUTCMonth(), to.getUTCDate()));
    const p = fetchPriceHistory(EMBED_ALIAS[t] === 'TSM' ? 'TSM' : t, isoDay(from), isoDay(to)).then((r) => {
      if (!r.success) throw new Error(typeof r.error === 'string' ? r.error : (r.error && r.error.message) || 'no data');
      return r.data.filter((x) => x.c > 0).map((x) => [isoDay(new Date(x.t)), x.c]);
    });
    p.catch(() => _live.delete(t));   // let a later attempt retry
    _live.set(t, p);
  }
  return _live.get(t);
}

// source: 'portal' | 'massive'. Resolves { series, source } or throws a readable error.
export async function getSeries(t, source) {
  const T = String(t || '').trim().toUpperCase();
  if (!T) throw new Error('Enter a ticker');
  if (source === 'massive') {
    try {
      return { series: await liveSeries(T), source: 'massive' };
    } catch (e) {
      throw new Error(`Massive returned no price history for ${T} (${e.message}). ` +
        'This needs the get-market-history edge function deployed.');
    }
  }
  await loadEmbedded();
  const s = embeddedSeries(T);
  if (!s) throw new Error(`${T} is not in the portal's price history. Switch the source to Massive.`);
  return { series: s, source: 'portal' };
}

// ── Resampling & alignment ───────────────────────────────────────────────────
// A period key per frequency; the label kept for each period is its LAST trading
// date, so a weekly or monthly return is dated when it closed.
function periodKey(date, freq) {
  if (freq === 'monthly') return date.slice(0, 7);
  if (freq === 'weekly') {
    const days = Math.floor(Date.parse(date + 'T00:00:00Z') / 86400000);
    return String(Math.floor((days + 3) / 7));   // epoch was a Thursday → weeks start Monday
  }
  return date;
}
function resample(series, freq) {
  const out = new Map();   // key → [date, close]  (last one wins)
  for (const [d, c] of series) if (c > 0) out.set(periodKey(d, freq), [d, c]);
  return out;
}

// Aligned periodic returns for stock vs index, ascending:
// [{ date, s, m }] — simple returns over consecutive COMMON periods only.
export function alignedReturns(stock, index, freq) {
  const S = resample(stock, freq), M = resample(index, freq);
  const keys = [...S.keys()].filter((k) => M.has(k)).sort((a, b) =>
    (freq === 'weekly' ? Number(a) - Number(b) : (a < b ? -1 : a > b ? 1 : 0)));
  const out = [];
  for (let i = 1; i < keys.length; i++) {
    const s0 = S.get(keys[i - 1])[1], s1 = S.get(keys[i])[1];
    const m0 = M.get(keys[i - 1])[1], m1 = M.get(keys[i])[1];
    const date = S.get(keys[i])[0] > M.get(keys[i])[0] ? S.get(keys[i])[0] : M.get(keys[i])[0];
    out.push({ date, prev: S.get(keys[i - 1])[0], s: s1 / s0 - 1, m: m1 / m0 - 1 });
  }
  return out;
}

// Returns inside [end − lookback, end]: a return is in the window when the period
// it starts from is on or after the window start, so 5 years monthly is 60 returns.
export function windowReturns(rets, endDate, months) {
  const e = new Date(endDate + 'T00:00:00Z');
  const start = isoDay(new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth() - months, e.getUTCDate())));
  return { start, rows: rets.filter((r) => r.date <= endDate && r.prev >= start) };
}

// ── Regression ───────────────────────────────────────────────────────────────
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;

export function regress(rows, freq) {
  const n = rows.length;
  if (n < 6) return { n, beta: null };
  const xs = rows.map((r) => r.m), ys = rows.map((r) => r.s);
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  if (!(sxx > 0)) return { n, beta: null };
  const beta = sxy / sxx;
  const alpha = my - beta * mx;
  const corr = syy > 0 ? sxy / Math.sqrt(sxx * syy) : null;
  const r2 = corr == null ? null : corr * corr;
  const sse = Math.max(0, syy - beta * sxy);
  const se = n > 2 ? Math.sqrt(sse / (n - 2) / sxx) : null;
  const ppy = FREQS[freq].ppy;
  return {
    n, beta, alpha, corr, r2, se,
    lo: se == null ? null : beta - 1.96 * se,
    hi: se == null ? null : beta + 1.96 * se,
    alphaAnn: alpha * ppy * 100,                                   // % per year
    volS: Math.sqrt(syy / (n - 1)) * Math.sqrt(ppy) * 100,          // % annualised
    volM: Math.sqrt(sxx / (n - 1)) * Math.sqrt(ppy) * 100,
  };
}

export const blume = (raw, alpha, anchor) => (raw == null ? null : alpha * raw + (1 - alpha) * anchor);

// Rolling β over ALL returns up to the end date, `win` returns per point.
export function rollingBeta(rets, endDate, win) {
  const rows = rets.filter((r) => r.date <= endDate);
  const out = [];
  for (let end = win; end <= rows.length; end++) {
    const w = rows.slice(end - win, end);
    let sx = 0, sy = 0;
    for (const r of w) { sx += r.m; sy += r.s; }
    const mx = sx / win, my = sy / win;
    let sxy = 0, sxx = 0;
    for (const r of w) { sxy += (r.m - mx) * (r.s - my); sxx += (r.m - mx) ** 2; }
    if (sxx > 0) out.push({ date: rows[end - 1].date, beta: sxy / sxx });
  }
  return out;
}

export function describe(vals) {
  if (!vals.length) return null;
  const s = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return {
    last: vals[vals.length - 1], avg: mean(vals),
    median: s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2,
    min: s[0], max: s[s.length - 1],
  };
}

// ── Beta history — every submitted calculation, one record each ──────────────
// A submit never overwrites: the history is the record of which beta was chosen
// for a name, when, by whom and with which method, so the choice can be revisited
// as time passes. For now it lives in this browser (localStorage); the record shape
// matches sql/024_beta_history.sql so it can move to Supabase without changing
// any consumer — only these functions.
const HIST_KEY = 'betas-history-v1';
let _hist = (() => {
  try {
    const v = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
})();
const _subs = new Set();
function persist() {
  try { localStorage.setItem(HIST_KEY, JSON.stringify(_hist)); } catch (e) { /* private mode */ }
  _subs.forEach((fn) => { try { fn(); } catch (e) { console.error('[Betas]', e); } });
}
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));

// Newest first.
export const listHistory = () => [..._hist].sort((a, b) => (a.submitted_at < b.submitted_at ? 1 : -1));
export const historyFor = (t) => listHistory().filter((r) => r.ticker === String(t || '').toUpperCase());
export const latestFor = (t) => historyFor(t)[0] || null;
export const historyTickers = () => [...new Set(_hist.map((r) => r.ticker))].sort();
export function addHistory(rec) {
  const r = { id: newId(), submitted_at: new Date().toISOString(), ...rec };
  _hist.push(r);
  persist();
  return r;
}
export function removeHistory(id) { _hist = _hist.filter((r) => r.id !== id); persist(); }
export function onHistoryChange(fn) { _subs.add(fn); return () => _subs.delete(fn); }

// Export columns — the same names as the future table.
export const HISTORY_COLUMNS = [
  'submitted_at', 'submitted_by', 'ticker', 'index_ticker', 'frequency', 'window_amount', 'window_unit',
  'window_start', 'end_date', 'observations', 'beta_type', 'beta', 'raw_beta', 'adjusted_beta',
  'blume_alpha', 'blume_anchor', 'std_error', 'ci_low', 'ci_high', 'correlation', 'r_squared',
  'alpha_annual_pct', 'stock_vol_pct', 'index_vol_pct', 'rolling_amount', 'rolling_unit',
  'rolling_last', 'rolling_avg', 'rolling_median', 'rolling_min', 'rolling_max',
  'price_source', 'data_as_of', 'note', 'id',
];

// Cross-tab navigation: History and Portfolio can open a record in the Calculator.
let _openCalc = null;
export function registerCalcOpener(fn) { _openCalc = fn; }
export function openInCalc(t, rec) { if (_openCalc) _openCalc(t, rec); }

// ── Chart helper: drag-to-zoom on both axes, double-click resets ─────────────
// Copied from js/results.js rsAttachBrush (CHART_ENGINE_REFERENCE §0.7). One change:
// on a linear x-axis (the scatter) a sideways drag hands back VALUES, not indices.
export function attachBrush(el, chart, onX, onY, onReset) {
  const wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function (ev) {
    if (ev.button !== 0) return;
    const r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    const area = chart.chartArea;
    const onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    let vertical = (onAxis || !onX) ? true : null;
    const startX = ev.clientX, startY = ev.clientY;
    let box = null;
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
      const dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy) {
      if (vertical == null) return;
      ensureBox();
      if (vertical) {
        const a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        const a = Math.min(startX, cx), b = Math.max(startX, cx);
        box.style.left = (a - w0.left) + 'px';
        box.style.width = (b - a) + 'px';
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
        const v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        const v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        const xs = chart.scales.x;
        if (xs.type === 'category') {
          const idxAt = (cx) => Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(xs.getValueForPixel(cx - r0.left))));
          const a = idxAt(startX), b = idxAt(e2.clientX);
          if (a !== b) onX(Math.min(a, b), Math.max(a, b));
        } else {
          const a = xs.getValueForPixel(startX - r0.left), b = xs.getValueForPixel(e2.clientX - r0.left);
          onX(Math.min(a, b), Math.max(a, b));
        }
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}
