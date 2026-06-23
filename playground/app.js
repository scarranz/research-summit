// Multiples Playground — talks to the local proxy (/api/massive) + Summit data.
import { SUMMIT } from './summit-data.js';

const $ = (id) => document.getElementById(id);
const USD = Object.keys(SUMMIT).filter((k) => SUMMIT[k].currency === 'USD');

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
const pct  = (x) => (x == null || isNaN(x)) ? '—' : `${x >= 0 ? '+' : ''}${x.toFixed(0)}%`;
const num  = (x) => (x == null || isNaN(x)) ? '—' : x.toLocaleString('en-US', { maximumFractionDigits: 0 });
const cheapCls = (v, base) => (base > 0 && v > 0 && v < base) ? 'cheap' : (base > 0 && v > 0 ? 'rich' : '');

let chart;

// ── Fetch + compute one company's metrics (no rendering) ──────────────────────
async function getData(ticker) {
  const [details, snap, ratiosResp] = await Promise.all([
    mfetch('details', ticker),
    mfetch('snapshot', ticker),
    mfetch('ratios', ticker),
  ]);
  const d = details.results || {};
  const t = snap.ticker || {};
  const rt = (ratiosResp.results && ratiosResp.results[0]) || {};

  const price = t.lastTrade?.p ?? t.day?.c ?? t.prevDay?.c ?? rt.price;
  const chgPct = t.todaysChangePerc;
  const shares = d.weighted_shares_outstanding ?? d.share_class_shares_outstanding;
  const mktCap = (price && shares) ? price * shares : (rt.market_cap ?? d.market_cap);
  const netDebt = (rt.enterprise_value != null && rt.market_cap != null)
    ? rt.enterprise_value - rt.market_cap : null;
  const ev = (mktCap != null && netDebt != null) ? mktCap + netDebt : rt.enterprise_value;

  const su = SUMMIT[ticker];
  const fx = su && su.currency !== 'USD';
  const ttm = { 'EV/EBITDA': rt.ev_to_ebitda, 'P/E': rt.price_to_earnings, 'P/S': rt.price_to_sales };
  const fwd = (year) => {
    if (!su || fx || !su.years[year]) return {};
    const y = su.years[year];
    return {
      'EV/EBITDA': (ev != null && y.ebitda) ? ev / (y.ebitda * 1e6) : null,
      'P/E': (mktCap != null && y.earnings) ? mktCap / (y.earnings * 1e6) : null,
      'P/S': (mktCap != null && y.rev) ? mktCap / (y.rev * 1e6) : null,
    };
  };
  const revGrowth = (su && !fx && su.years[2026] && su.years[2025])
    ? (su.years[2026].rev / su.years[2025].rev - 1) * 100 : null;

  return { d, t, rt, price, chgPct, shares, mktCap, netDebt, ev, su, fx,
           ttm, f26: fwd(2026), f27: fwd(2027), revGrowth };
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
      : m.fx
        ? `<span class="err">${ticker} reports in ${m.su.currency}.</span> Forward multiples need FX (Massive price is USD) — not shown to avoid wrong numbers. TTM (Massive) is still valid.`
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

// ── Peers view — all USD companies side by side ───────────────────────────────
async function buildPeers() {
  $('peerswrap').innerHTML = `<div class="muted">Loading ${USD.length} companies live…</div>`;
  const results = await Promise.all(USD.map(async (tk) => {
    try { return { tk, m: await getData(tk) }; } catch (e) { return { tk, err: e.message }; }
  }));

  const head = `<thead><tr>
    <th>Company</th><th>Mkt Cap</th>
    <th>EV/EBITDA TTM</th><th>26E</th><th>27E</th>
    <th>P/E 26E</th><th>P/S 26E</th><th>Rev gr 26E</th>
  </tr></thead>`;

  const body = results.map(({ tk, m, err }) => {
    if (err) return `<tr><td>${tk}</td><td colspan="7" class="err">${err}</td></tr>`;
    const c = (v, base) => v == null ? '<td>—</td>' : `<td class="${cheapCls(v, base)}">${mult(v)}</td>`;
    return `<tr>
      <td><b>${tk}</b></td>
      <td>${money(m.mktCap)}</td>
      <td>${mult(m.ttm['EV/EBITDA'])}</td>
      ${c(m.f26['EV/EBITDA'], m.ttm['EV/EBITDA'])}
      ${c(m.f27['EV/EBITDA'], m.ttm['EV/EBITDA'])}
      <td>${mult(m.f26['P/E'])}</td>
      <td>${mult(m.f26['P/S'])}</td>
      <td>${pct(m.revGrowth)}</td>
    </tr>`;
  }).join('');

  $('peerswrap').innerHTML = `<table>${head}<tbody>${body}</tbody></table>
    <div class="muted">TTM from Massive · 26E/27E forward from Summit DCF · <span class="cheap">green</span> = forward cheaper than TTM. Click a row's ticker chip above to drill in.</div>`;
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
