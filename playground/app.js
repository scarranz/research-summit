// Multiples Playground — talks to the local proxy (/api/massive) + Summit data.
import { SUMMIT } from './summit-data.js';

const $ = (id) => document.getElementById(id);
const USD = Object.keys(SUMMIT).filter((k) => SUMMIT[k].currency === 'USD');

// Foreign currency → Massive forex pair. invert=true means pair is USD/XXX,
// so XXX→USD = 1 / close (e.g. USDMXN). EUR uses EURUSD directly.
const FXCFG = {
  EUR: { pair: 'EURUSD', invert: false },
  MXN: { pair: 'USDMXN', invert: true },
};

// ── Massive proxy ─────────────────────────────────────────────────────────────
async function mfetch(resource, ticker, params = {}) {
  const qs = new URLSearchParams({ resource, ticker, ...params });
  const r = await fetch(`/api/massive?${qs}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
}

// ── Formatting ────────────────────────────────────────────────────────────────
const money = (d) => {
  if (d == null || isNaN(d)) return '—';
  const a = Math.abs(d);
  if (a >= 1e12) return `$${(d / 1e12).toFixed(2)}T`;
  if (a >= 1e9)  return `$${(d / 1e9).toFixed(1)}B`;
  if (a >= 1e6)  return `$${(d / 1e6).toFixed(0)}M`;
  return `$${d.toFixed(0)}`;
};
const mult = (x) => (x == null || isNaN(x) || !isFinite(x)) ? '—' : `${x.toFixed(1)}x`;
const peg  = (x) => (x == null || isNaN(x) || !isFinite(x)) ? '—' : x.toFixed(2);
const pct  = (x) => (x == null || isNaN(x)) ? '—' : `${x >= 0 ? '+' : ''}${x.toFixed(0)}%`;
const num  = (x) => (x == null || isNaN(x)) ? '—' : x.toLocaleString('en-US', { maximumFractionDigits: 0 });
const cheapCls = (v, base) => (base > 0 && v > 0 && v < base) ? 'cheap' : (base > 0 && v > 0 ? 'rich' : '');
const isNullish = (v) => v == null || isNaN(v) || !isFinite(v);

let chart;

// ── Fetch + compute one company's metrics (no rendering) ──────────────────────
async function getData(ticker) {
  const su = SUMMIT[ticker];
  const isF = !!(su && su.currency !== 'USD');

  const reqs = [mfetch('details', ticker), mfetch('snapshot', ticker), mfetch('ratios', ticker)];
  if (isF) reqs.push(mfetch('fx', FXCFG[su.currency].pair).catch(() => null));
  const [details, snap, ratiosResp, fxResp] = await Promise.all(reqs);

  const d = details.results || {};
  const t = snap.ticker || {};
  const rt = (ratiosResp.results && ratiosResp.results[0]) || {};

  // FX: convert Summit (foreign) values to USD with a live Massive rate.
  let fxRate = 1, fxNote = '';
  if (isF) {
    const cfg = FXCFG[su.currency];
    const c = fxResp?.results?.[0]?.c;
    if (c) { fxRate = cfg.invert ? 1 / c : c; fxNote = `${su.currency}→USD @ ${fxRate.toFixed(4)} (live)`; }
  }

  const price = t.lastTrade?.p ?? t.day?.c ?? t.prevDay?.c ?? rt.price;
  const chgPct = t.todaysChangePerc;
  const shares = d.weighted_shares_outstanding ?? d.share_class_shares_outstanding;
  const mktCap = (price && shares) ? price * shares : (rt.market_cap ?? d.market_cap);
  const netDebt = (rt.enterprise_value != null && rt.market_cap != null)
    ? rt.enterprise_value - rt.market_cap : null;
  const ev = (mktCap != null && netDebt != null) ? mktCap + netDebt : rt.enterprise_value;

  const ttm = { 'EV/EBITDA': rt.ev_to_ebitda, 'P/E': rt.price_to_earnings, 'P/S': rt.price_to_sales };
  const fwd = (year) => {
    if (!su || !su.years[year]) return {};
    const y = su.years[year], f = fxRate; // Summit value × f = USD
    return {
      'EV/EBITDA': (ev != null && y.ebitda) ? ev / (y.ebitda * f * 1e6) : null,
      'P/E': (mktCap != null && y.earnings) ? mktCap / (y.earnings * f * 1e6) : null,
      'P/S': (mktCap != null && y.rev) ? mktCap / (y.rev * f * 1e6) : null,
    };
  };
  const f26 = fwd(2026), f27 = fwd(2027);

  // Growth is a currency-independent ratio.
  const y25 = su?.years[2025], y26 = su?.years[2026];
  const revGrowth = (y25 && y26) ? (y26.rev / y25.rev - 1) * 100 : null;
  const earnGrowth = (y25 && y26 && y25.earnings > 0 && y26.earnings != null)
    ? (y26.earnings / y25.earnings - 1) * 100 : null;
  // PEG = forward P/E ÷ earnings growth %. Skip if growth is non-positive or a
  // low-base artifact (>150%).
  const pegVal = (earnGrowth != null && earnGrowth > 0 && earnGrowth <= 150 && f26['P/E'])
    ? f26['P/E'] / earnGrowth : null;

  return { d, t, rt, price, chgPct, shares, mktCap, netDebt, ev, su, isF, fxNote,
           ttm, f26, f27, revGrowth, earnGrowth, peg: pegVal };
}

// ── Single-company view ───────────────────────────────────────────────────────
async function load(ticker) {
  $('status').innerHTML = `<div class="card">Loading <b>${ticker}</b>…</div>`;
  try {
    const m = await getData(ticker);
    $('status').innerHTML = '';

    $('head').hidden = false;
    $('nm').textContent = m.d.name || ticker;
    $('tk').textContent = ticker;
    $('px').textContent = m.price != null ? `$${m.price.toFixed(2)}` : '—';
    const chgEl = $('chg');
    if (m.chgPct != null) {
      chgEl.textContent = `${m.chgPct >= 0 ? '▲' : '▼'} ${Math.abs(m.chgPct).toFixed(2)}%`;
      chgEl.className = 'chg ' + (m.chgPct >= 0 ? 'up' : 'dn');
    } else chgEl.textContent = '';
    $('mcap').textContent = money(m.mktCap);
    $('ev').textContent = money(m.ev);
    $('nd').textContent = m.netDebt != null ? money(m.netDebt) : '—';
    $('sh').textContent = m.shares ? num(m.shares / 1e6) + 'M' : '—';

    const rows = ['EV/EBITDA', 'P/E', 'P/S'].map((k) => {
      const cell = (v, base) => v == null ? '<td>—</td>' : `<td class="big ${cheapCls(v, base)}">${mult(v)}</td>`;
      return `<tr><td>${k}</td><td class="big">${mult(m.ttm[k])}</td>
        ${cell(m.f26[k], m.ttm[k])}${cell(m.f27[k], m.ttm[k])}</tr>`;
    }).join('');
    $('mtab').innerHTML = rows;
    $('cmp').hidden = false;
    $('cmpnote').innerHTML = !m.su
      ? `<span class="err">No Summit data for ${ticker}.</span> Ask Claude to pull its DCF projections.`
      : m.isF
        ? `Summit values converted to USD: <b>${m.fxNote || 'FX unavailable'}</b>. P/E & P/S shown; EV/EBITDA needs net debt (no Massive financials for this ADR). <span class="cheap">Green</span> = cheaper than TTM.`
        : `Forward = live EV/market-cap (Massive) ÷ Summit projections (snapshot ${m.su.snapshot_date}). <span class="cheap">Green</span> = cheaper than TTM.`;

    drawChart([
      { label: 'TTM', v: m.ttm['EV/EBITDA'] },
      { label: '2026E', v: m.f26['EV/EBITDA'] },
      { label: '2027E', v: m.f27['EV/EBITDA'] },
    ]);
    setupExplorer(ticker);
  } catch (e) {
    $('status').innerHTML = `<div class="card err">Error: ${e.message}</div>`;
    $('head').hidden = true; $('cmp').hidden = true;
  }
}

function drawChart(data) {
  const ctx = $('chart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: data.map((d) => d.label),
      datasets: [{ data: data.map((d) => d.v), backgroundColor: ['#7C8694', '#3E5A82', '#1E2733'], borderRadius: 6 }] },
    options: { plugins: { legend: { display: false } },
      scales: { y: { position: 'right', ticks: { callback: (v) => v + 'x' }, grid: { color: '#EEF1F5' } },
                x: { grid: { display: false } } } },
  });
}

// ── Peers view — sortable table of all USD companies ──────────────────────────
let peerData = [];
let peerSort = { key: 'mcap', dir: 'desc' };
const PEERCOLS = [
  { key: 'co',      label: 'Company',       get: (r) => r.tk, type: 'str' },
  { key: 'mcap',    label: 'Mkt Cap',       get: (r) => r.m.mktCap, fmt: money },
  { key: 'evebTTM', label: 'EV/EBITDA TTM', get: (r) => r.m.ttm['EV/EBITDA'], fmt: mult },
  { key: 'eveb26',  label: '26E',           get: (r) => r.m.f26['EV/EBITDA'], fmt: mult, base: (r) => r.m.ttm['EV/EBITDA'] },
  { key: 'eveb27',  label: '27E',           get: (r) => r.m.f27['EV/EBITDA'], fmt: mult, base: (r) => r.m.ttm['EV/EBITDA'] },
  { key: 'pe26',    label: 'P/E 26E',       get: (r) => r.m.f26['P/E'], fmt: mult },
  { key: 'peg',     label: 'PEG',           get: (r) => r.m.peg, fmt: peg, lowGood: true },
  { key: 'ps26',    label: 'P/S 26E',       get: (r) => r.m.f26['P/S'], fmt: mult },
  { key: 'revgr',   label: 'Rev gr 26E',    get: (r) => r.m.revGrowth, fmt: pct },
];

function renderPeers() {
  const { key, dir } = peerSort;
  const col = PEERCOLS.find((c) => c.key === key);
  const ok = peerData.filter((r) => !r.err);
  const errs = peerData.filter((r) => r.err);

  ok.sort((a, b) => {
    if (col.type === 'str') {
      return dir === 'asc' ? String(col.get(a)).localeCompare(col.get(b)) : String(col.get(b)).localeCompare(col.get(a));
    }
    const va = col.get(a), vb = col.get(b), na = isNullish(va), nb = isNullish(vb);
    if (na && nb) return 0; if (na) return 1; if (nb) return -1; // nulls always last
    return dir === 'asc' ? va - vb : vb - va;
  });

  const head = '<thead><tr>' + PEERCOLS.map((c) => {
    const arrow = c.key === key ? (dir === 'asc' ? ' ▲' : ' ▼') : '';
    return `<th data-key="${c.key}" class="sortable">${c.label}${arrow}</th>`;
  }).join('') + '</tr></thead>';

  const body = ok.map((r) => '<tr>' + PEERCOLS.map((c) => {
    if (c.key === 'co') return `<td><b>${r.tk}</b></td>`;
    const v = c.get(r);
    let cls = '';
    if (c.base) cls = cheapCls(v, c.base(r));
    else if (c.lowGood) cls = (v != null && v > 0 && v < 1) ? 'cheap' : '';
    return `<td class="${cls}">${c.fmt(v)}</td>`;
  }).join('') + '</tr>').join('')
  + errs.map((r) => `<tr><td><b>${r.tk}</b></td><td colspan="${PEERCOLS.length - 1}" class="err">${r.err}</td></tr>`).join('');

  $('peerswrap').innerHTML = `<table>${head}<tbody>${body}</tbody></table>
    <div class="muted">Click any header to sort. TTM from Massive · 26E/27E forward from Summit DCF ·
    <span class="cheap">green</span> = forward cheaper than TTM (PEG &lt; 1 for PEG col). PEG = P/E 26E ÷ earnings growth %.</div>`;

  $('peerswrap').querySelectorAll('th[data-key]').forEach((th) => {
    th.onclick = () => {
      const k = th.dataset.key;
      if (peerSort.key === k) peerSort.dir = peerSort.dir === 'asc' ? 'desc' : 'asc';
      else peerSort = { key: k, dir: k === 'co' ? 'asc' : 'desc' };
      renderPeers();
    };
  });
}

async function buildPeers() {
  $('peerswrap').innerHTML = `<div class="muted">Loading ${USD.length} companies live…</div>`;
  peerData = await Promise.all(USD.map(async (tk) => {
    try { return { tk, m: await getData(tk) }; } catch (e) { return { tk, err: e.message }; }
  }));
  renderPeers();
}

// ── API explorer ──────────────────────────────────────────────────────────────
function setupExplorer(ticker) {
  $('exp').hidden = false;
  const resources = ['details', 'snapshot', 'prev', 'ratios', 'income', 'balance', 'cashflow', 'news', 'aggs'];
  $('expbtns').innerHTML = resources.map((r) => `<button class="ghost" data-r="${r}">${r}</button>`).join('');
  $('expbtns').querySelectorAll('button').forEach((b) => {
    b.onclick = async () => {
      $('raw').textContent = `Fetching ${b.dataset.r}…`;
      try { $('raw').textContent = JSON.stringify(await mfetch(b.dataset.r, ticker), null, 2); }
      catch (e) { $('raw').textContent = 'Error: ' + e.message; }
    };
  });
}

// ── Ticker chips (the 10 Summit-covered companies) ─────────────────────────────
function renderChips(active) {
  $('chips').innerHTML = Object.keys(SUMMIT).map((tk) => {
    const fx = SUMMIT[tk].currency !== 'USD' ? ` <span class="fx">${SUMMIT[tk].currency}</span>` : '';
    return `<button class="chip${tk === active ? ' active' : ''}" data-tk="${tk}">${tk}${fx}</button>`;
  }).join('');
  $('chips').querySelectorAll('.chip').forEach((c) => {
    c.onclick = () => { $('ticker').value = c.dataset.tk; load(c.dataset.tk); renderChips(c.dataset.tk); };
  });
}

// ── Wire up ───────────────────────────────────────────────────────────────────
function go(tk) { tk = (tk || '').trim().toUpperCase(); if (tk) { renderChips(tk); load(tk); } }
$('load').onclick = () => go($('ticker').value);
$('ticker').addEventListener('keydown', (e) => { if (e.key === 'Enter') go($('ticker').value); });
$('peersbtn').onclick = buildPeers;
go('UBER');
