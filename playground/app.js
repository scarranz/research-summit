// Multiples Playground — talks to the local proxy (/api/massive) + Summit data.
import { SUMMIT } from './summit-data.js';

const $ = (id) => document.getElementById(id);

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
const num  = (x) => (x == null || isNaN(x)) ? '—' : x.toLocaleString('en-US', { maximumFractionDigits: 0 });

let chart;

// ── Main load ─────────────────────────────────────────────────────────────────
async function load(ticker) {
  $('status').innerHTML = `<div class="card">Loading <b>${ticker}</b>…</div>`;
  try {
    const [details, snap, ratiosResp] = await Promise.all([
      mfetch('details', ticker),
      mfetch('snapshot', ticker),
      mfetch('ratios', ticker),
    ]);
    $('status').innerHTML = '';

    const d = details.results || {};
    const t = snap.ticker || {};
    const rt = (ratiosResp.results && ratiosResp.results[0]) || {};

    // Market side (live)
    const price = t.lastTrade?.p ?? t.day?.c ?? t.prevDay?.c ?? rt.price;
    const chgPct = t.todaysChangePerc;
    const shares = d.weighted_shares_outstanding ?? d.share_class_shares_outstanding;
    const mktCap = price && shares ? price * shares : (rt.market_cap ?? d.market_cap);
    const netDebt = (rt.enterprise_value != null && rt.market_cap != null)
      ? rt.enterprise_value - rt.market_cap : null;
    const ev = (mktCap != null && netDebt != null) ? mktCap + netDebt : rt.enterprise_value;

    // Header
    $('head').hidden = false;
    $('nm').textContent = d.name || ticker;
    $('tk').textContent = ticker;
    $('px').textContent = price != null ? `$${price.toFixed(2)}` : '—';
    const chgEl = $('chg');
    if (chgPct != null) {
      chgEl.textContent = `${chgPct >= 0 ? '▲' : '▼'} ${Math.abs(chgPct).toFixed(2)}%`;
      chgEl.className = 'chg ' + (chgPct >= 0 ? 'up' : 'dn');
    } else chgEl.textContent = '';
    $('mcap').textContent = money(mktCap);
    $('ev').textContent = money(ev);
    $('nd').textContent = netDebt != null ? money(netDebt) : '—';
    $('sh').textContent = shares ? num(shares / 1e6) + 'M' : '—';

    // Multiples: TTM (Massive) vs forward (Summit)
    const su = SUMMIT[ticker];
    const ttm = {
      'EV/EBITDA': rt.ev_to_ebitda,
      'P/E': rt.price_to_earnings,
      'P/S': rt.price_to_sales,
    };
    const fx = su && su.currency && su.currency !== 'USD'; // price is USD; foreign-ccy fundamentals need FX
    const fwd = (year) => {
      if (!su || fx || !su.years[year]) return {};
      const y = su.years[year];
      return {
        'EV/EBITDA': (ev != null && y.ebitda) ? ev / (y.ebitda * 1e6) : null,
        'P/E': (mktCap != null && y.earnings) ? mktCap / (y.earnings * 1e6) : null,
        'P/S': (mktCap != null && y.rev) ? mktCap / (y.rev * 1e6) : null,
      };
    };
    const f26 = fwd(2026), f27 = fwd(2027);

    const rows = ['EV/EBITDA', 'P/E', 'P/S'].map((k) => {
      const cell = (v, base) => {
        if (v == null) return '<td>—</td>';
        const cls = base != null ? (v < base ? 'cheap' : 'rich') : '';
        return `<td class="big ${cls}">${mult(v)}</td>`;
      };
      return `<tr><td>${k}</td>
        <td class="big">${mult(ttm[k])}</td>
        ${cell(f26[k], ttm[k])}
        ${cell(f27[k], ttm[k])}</tr>`;
    }).join('');
    $('mtab').innerHTML = rows;
    $('cmp').hidden = false;
    $('cmpnote').innerHTML = !su
      ? `<span class="err">No Summit data for ${ticker}.</span> Ask Claude to pull its DCF projections to fill the forward columns.`
      : fx
        ? `<span class="err">${ticker} reports in ${su.currency}.</span> Forward multiples need FX (Massive price is USD) — not shown to avoid wrong numbers. TTM (Massive) is still valid.`
        : `Forward = live EV/market-cap (Massive) ÷ Summit projections (snapshot ${su.snapshot_date}). <span class="cheap">Green</span> = cheaper than TTM.`;

    // Chart: EV/EBITDA trailing → forward
    drawChart([
      { label: 'TTM', v: ttm['EV/EBITDA'] },
      { label: '2026E', v: f26['EV/EBITDA'] },
      { label: '2027E', v: f27['EV/EBITDA'] },
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
    data: {
      labels: data.map((d) => d.label),
      datasets: [{
        data: data.map((d) => d.v),
        backgroundColor: ['#7C8694', '#3E5A82', '#1E2733'],
        borderRadius: 6,
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { position: 'right', ticks: { callback: (v) => v + 'x' }, grid: { color: '#EEF1F5' } },
        x: { grid: { display: false } },
      },
    },
  });
}

// ── API explorer ──────────────────────────────────────────────────────────────
function setupExplorer(ticker) {
  $('exp').hidden = false;
  const resources = ['details', 'snapshot', 'prev', 'ratios', 'income', 'balance', 'cashflow', 'news', 'aggs'];
  $('expbtns').innerHTML = resources
    .map((r) => `<button class="ghost" data-r="${r}">${r}</button>`).join('');
  $('expbtns').querySelectorAll('button').forEach((b) => {
    b.onclick = async () => {
      $('raw').textContent = `Fetching ${b.dataset.r}…`;
      try {
        const j = await mfetch(b.dataset.r, ticker);
        $('raw').textContent = JSON.stringify(j, null, 2);
      } catch (e) { $('raw').textContent = 'Error: ' + e.message; }
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
    c.onclick = () => { $('ticker').value = c.dataset.tk; load(c.dataset.tk); };
  });
}

// ── Wire up ───────────────────────────────────────────────────────────────────
function go(tk) { tk = (tk || '').trim().toUpperCase(); if (tk) { renderChips(tk); load(tk); } }
$('load').onclick = () => go($('ticker').value);
$('ticker').addEventListener('keydown', (e) => { if (e.key === 'Enter') go($('ticker').value); });
go('UBER');
