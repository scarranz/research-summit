// Covered Calls — live dashboard. Pulls price + option chain (premium/IV/greeks)
// from the local Massive proxy and forward EBITDA/EPS from Summit, then computes
// the covered-call economics + "valuation if exercised" the way the Excel does.
import { POSITIONS, PORTFOLIO_VALUE } from './positions.js';
import { SUMMIT } from './summit-data.js';

const $ = (id) => document.getElementById(id);

// Foreign currency → Massive forex pair. invert=true means the pair is USD/XXX,
// so XXX→USD = 1 / close (e.g. USDMXN). EUR uses EURUSD directly.
const FXCFG = { EUR: { pair: 'EURUSD', invert: false }, MXN: { pair: 'USDMXN', invert: true } };
const VAL_YEAR = 2026; // valuation year (Excel D3)

// ── Massive proxy ─────────────────────────────────────────────────────────────
async function mfetch(resource, ticker, params = {}) {
  const qs = new URLSearchParams({ resource, ticker });
  for (const [k, v] of Object.entries(params)) if (v != null) qs.append(k, v);
  const r = await fetch(`/api/massive?${qs}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
}

// tiny concurrency limiter so we don't hammer the proxy / hit rate limits
function pLimit(n) {
  let active = 0; const q = [];
  const next = () => { if (active >= n || !q.length) return; active++; const { fn, res, rej } = q.shift();
    fn().then(res, rej).finally(() => { active--; next(); }); };
  return (fn) => new Promise((res, rej) => { q.push({ fn, res, rej }); next(); });
}
const limit = pLimit(5);

// ── Formatting ────────────────────────────────────────────────────────────────
const money = (d) => {
  if (d == null || isNaN(d)) return '—';
  const a = Math.abs(d), s = d < 0 ? '-' : '';
  if (a >= 1e9) return `${s}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${s}$${(a / 1e3).toFixed(1)}k`;
  return `${s}$${a.toFixed(0)}`;
};
const px   = (x) => (x == null || isNaN(x)) ? '—' : `$${x.toFixed(2)}`;
const mult = (x) => (x == null || isNaN(x) || !isFinite(x)) ? '—' : `${x.toFixed(1)}x`;
const pct  = (x, d = 1) => (x == null || isNaN(x)) ? '—' : `${(x * 100).toFixed(d)}%`;
const sg   = (x, d = 2) => (x == null || isNaN(x)) ? '—' : x.toFixed(d);

// ── State ─────────────────────────────────────────────────────────────────────
let rows = POSITIONS.map((p, i) => ({ id: i, ...p, override: null, live: null, loading: true, err: null }));
let expiry = null;
let portVal = PORTFOLIO_VALUE;

// ── Pull one option contract (premium/IV/greeks) for a strike+expiry ──────────
function pickFrom(results, wantStrike, wantExpiry) {
  if (!results || !results.length) return null;
  let pool = results.filter((c) => c.details?.contract_type === 'call');
  if (wantExpiry) {
    const exact = pool.filter((c) => c.details?.expiration_date === wantExpiry);
    if (exact.length) pool = exact;
    else { // nearest expiry on/after target, else nearest overall
      const fut = pool.filter((c) => c.details?.expiration_date >= wantExpiry)
                      .sort((a, b) => a.details.expiration_date.localeCompare(b.details.expiration_date));
      pool = fut.length ? fut.filter((c) => c.details.expiration_date === fut[0].details.expiration_date) : pool;
    }
  }
  // nearest strike to target
  pool.sort((a, b) => Math.abs(a.details.strike_price - wantStrike) - Math.abs(b.details.strike_price - wantStrike));
  return pool[0] || null;
}

async function fetchCall(ticker, strike, wantExpiry) {
  // 1) exact strike + expiry
  let j = await mfetch('chain', ticker, { contract_type: 'call', strike_price: strike, expiration_date: wantExpiry, limit: 10 });
  let c = pickFrom(j.results, strike, wantExpiry);
  if (c && c.details?.expiration_date === wantExpiry) return c;
  // 2) this strike, any expiry → nearest on/after target
  j = await mfetch('chain', ticker, { contract_type: 'call', strike_price: strike, limit: 60 });
  c = pickFrom(j.results, strike, wantExpiry) || c;
  if (c) return c;
  // 3) target expiry, nearby strikes
  j = await mfetch('chain', ticker, { contract_type: 'call', expiration_date: wantExpiry,
        'strike_price.gte': strike * 0.7, 'strike_price.lte': strike * 1.3, limit: 100 });
  return pickFrom(j.results, strike, wantExpiry);
}

// ── Fetch everything for one row ──────────────────────────────────────────────
async function fetchRow(row) {
  row.loading = true; row.err = null;
  try {
    const tasks = [limit(() => fetchCall(row.ticker, row.strike, expiry))];
    if (!row.isEtf) {
      tasks.push(limit(() => mfetch('details', row.ticker).catch(() => null)));
      tasks.push(limit(() => mfetch('ratios', row.ticker).catch(() => null)));
      const su = SUMMIT[row.ticker];
      if (su && su.currency !== 'USD') tasks.push(limit(() => mfetch('fx', FXCFG[su.currency].pair).catch(() => null)));
    }
    const [contract, details, ratiosResp, fxResp] = await Promise.all(tasks);

    const d = details?.results || {};
    const rt = (ratiosResp?.results && ratiosResp.results[0]) || {};
    const q = contract?.last_quote || {};
    const premium = q.midpoint ?? contract?.day?.close ?? contract?.last_trade?.price ?? row.seedPrime ?? null;
    const price = contract?.underlying_asset?.price ?? rt.price ?? null;
    const shares = d.weighted_shares_outstanding ?? d.share_class_shares_outstanding ?? null;
    const mktCap = (price && shares) ? price * shares : (rt.market_cap ?? null);
    const netDebt = (rt.enterprise_value != null && rt.market_cap != null) ? rt.enterprise_value - rt.market_cap : null;

    let fxRate = 1, fxNote = '';
    const su = SUMMIT[row.ticker];
    if (su && su.currency !== 'USD') {
      const cfg = FXCFG[su.currency]; const cc = fxResp?.results?.[0]?.c;
      if (cc) { fxRate = cfg.invert ? 1 / cc : cc; fxNote = `${su.currency}→USD ${fxRate.toFixed(4)}`; }
    }

    row.live = {
      price, premium, iv: contract?.implied_volatility ?? null,
      delta: contract?.greeks?.delta ?? null, theta: contract?.greeks?.theta ?? null,
      oi: contract?.open_interest ?? null, name: d.name || row.ticker,
      shares, mktCap, netDebt, fxRate, fxNote,
      usedStrike: contract?.details?.strike_price ?? null,
      usedExpiry: contract?.details?.expiration_date ?? null,
    };
  } catch (e) {
    row.err = e.message;
  } finally {
    row.loading = false;
  }
}

// ── Compute derived metrics for a row ─────────────────────────────────────────
function metrics(row) {
  const L = row.live; if (!L) return {};
  const price = L.price;
  const premium = row.override != null ? row.override : L.premium;
  const yld = (premium != null && price) ? premium / price : null;
  const upside = (price) ? row.strike / price - 1 : null;
  const amount = (premium != null) ? premium * row.contracts * 100 : null;
  const days = daysTo(L.usedExpiry || expiry);
  const annYld = (yld != null && days > 0) ? yld * 365 / days : null;

  // valuation if exercised (Summit forward, year VAL_YEAR)
  let evP = null, evS = null, peP = null, peS = null;
  const su = SUMMIT[row.ticker], y = su?.years?.[VAL_YEAR];
  if (y && L.shares && price != null && !row.isEtf) {
    const f = L.fxRate, sh = L.shares;
    const ebitdaUSD = (y.ebitda != null) ? y.ebitda * f * 1e6 : null;
    const earnUSD = (y.earnings != null) ? y.earnings * f * 1e6 : null;
    const mc = price * sh, mcS = row.strike * sh;
    const nd = L.netDebt;
    if (ebitdaUSD && nd != null) { evP = (mc + nd) / ebitdaUSD; evS = (mcS + nd) / ebitdaUSD; }
    if (earnUSD && earnUSD > 0) { peP = mc / earnUSD; peS = mcS / earnUSD; }
  }
  return { price, premium, yld, upside, amount, annYld, days, evP, evS, peP, peS };
}

function daysTo(dateStr) {
  if (!dateStr) return null;
  const t = new Date(dateStr + 'T16:00:00'); const now = new Date();
  return Math.max(0, Math.round((t - now) / 86400000));
}

// ── Render ────────────────────────────────────────────────────────────────────
const cheap = (v, base) => (v != null && base != null && v < base) ? 'cheap' : (v != null && base != null ? 'rich' : '');

function render() {
  // KPIs
  let totPrem = 0, wUp = 0, wYld = 0, wIv = 0, wSum = 0, contracts = 0, open = 0;
  rows.forEach((r) => {
    const m = metrics(r); if (r.err || !r.live) return;
    if (m.amount) totPrem += m.amount;
    contracts += r.contracts; open += r.contracts > 0 ? 1 : 0;
    const w = r.weight || 0; wSum += w;
    if (m.upside != null) wUp += m.upside * w;
    if (m.yld != null) wYld += m.yld * w;
    if (r.live.iv != null) wIv += r.live.iv * w;
  });
  const kn = wSum || 1;
  $('kpis').innerHTML = [
    ['Premium income', money(totPrem), `${rows.length} positions · ${contracts} contracts`],
    ['Yield on portfolio', pct(totPrem / portVal, 2), `on ${money(portVal)}`],
    ['Avg upside to strike', pct(wUp / kn), 'weighted'],
    ['Avg premium yield', pct(wYld / kn, 2), 'weighted'],
    ['Avg implied vol', pct(wIv / kn, 0), 'weighted'],
  ].map(([l, v, s]) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`).join('');

  // header (two-row grouped)
  $('thead').innerHTML = `
    <tr>
      <th colspan="4" class="grp">Position</th>
      <th colspan="5" class="grp sep">Live · Massive</th>
      <th colspan="4" class="grp sep">Economics</th>
      <th colspan="4" class="grp sep">Valuation @price → @strike (${VAL_YEAR}E)</th>
      <th class="grp sep"></th>
    </tr>
    <tr>
      <th>Ticker</th><th>Strike</th><th>Contr.</th><th>Wt</th>
      <th class="sep">Price</th><th>Premium</th><th>IV</th><th>Δ</th><th>OI</th>
      <th class="sep">Yield</th><th>Upside</th><th>Ann.</th><th>Amount</th>
      <th class="sep">EV/EBITDA</th><th>@strike</th><th>P/E</th><th>@strike</th>
      <th class="sep"></th>
    </tr>`;

  // body
  $('tbody').innerHTML = rows.map((r) => {
    if (r.loading) return `<tr><td class="tk">${r.ticker}</td><td colspan="17" class="muted">loading…</td></tr>`;
    if (r.err) return `<tr><td class="tk">${r.ticker}</td><td colspan="16" class="err">${r.err}</td>
      <td class="sep"><button class="x" data-del="${r.id}">✕</button></td></tr>`;
    const L = r.live, m = metrics(r);
    const ovr = r.override != null;
    const premVal = (m.premium != null) ? m.premium.toFixed(2) : '';
    const mismatch = (L.usedExpiry && expiry && L.usedExpiry !== expiry) || (L.usedStrike != null && L.usedStrike !== r.strike);
    return `<tr>
      <td class="tk" title="${L.name || ''}">${r.ticker}${r.isEtf ? ' <span class="muted">ETF</span>' : ''}</td>
      <td class="edit"><input type="number" step="1" value="${r.strike}" data-strike="${r.id}"></td>
      <td class="edit"><input type="number" step="1" value="${r.contracts}" data-contr="${r.id}"></td>
      <td class="muted">${pct(r.weight, 1)}</td>
      <td class="sep big">${px(m.price)}</td>
      <td class="edit"><input type="number" step="0.01" value="${premVal}" data-prem="${r.id}" class="${ovr ? 'ovr' : ''}" title="${ovr ? 'manual override' : 'live midpoint — type to override'}"></td>
      <td>${pct(L.iv, 0)}</td>
      <td class="muted">${sg(L.delta, 2)}</td>
      <td class="muted">${L.oi != null ? L.oi.toLocaleString() : '—'}</td>
      <td class="sep big up">${pct(m.yld, 2)}</td>
      <td>${pct(m.upside, 1)}</td>
      <td class="muted">${pct(m.annYld, 1)}</td>
      <td class="big">${money(m.amount)}</td>
      <td class="sep">${mult(m.evP)}</td>
      <td class="${cheap(m.evS, m.evP)}">${mult(m.evS)}</td>
      <td>${mult(m.peP)}</td>
      <td class="${cheap(m.peS, m.peP)}">${mult(m.peS)}</td>
      <td class="sep"><button class="x" data-del="${r.id}" title="${mismatch ? 'using '+L.usedStrike+' @ '+L.usedExpiry : ''}">${mismatch ? '⚠' : '✕'}</button></td>
    </tr>`;
  }).join('');

  $('tbl').hidden = false; $('status').hidden = true;
  wireRowInputs();

  const anyMismatch = rows.some((r) => r.live && ((r.live.usedExpiry && expiry && r.live.usedExpiry !== expiry) || (r.live.usedStrike != null && r.live.usedStrike !== r.strike)));
  $('foot').innerHTML = `
    <b>Yield</b> = premium ÷ price · <b>Upside</b> = strike ÷ price − 1 · <b>Amount</b> = premium × contracts × 100 ·
    <b>Ann.</b> = yield annualized by days-to-expiry · <span class="cheap">green</span> = exercised multiple richer than current (selling expensive).<br>
    Premium/IV/greeks are the live Massive option chain for each strike &amp; target expiry. Edit strike or contracts inline; type a premium to override the live midpoint.
    ${anyMismatch ? '<br><span class="warn">⚠ some rows had no contract at the exact strike/expiry — nearest available was used (hover the ⚠).</span>' : ''}`;
}

function wireRowInputs() {
  document.querySelectorAll('[data-strike]').forEach((el) => el.onchange = async () => {
    const r = rows.find((x) => x.id == el.dataset.strike); r.strike = parseFloat(el.value) || r.strike;
    r.loading = true; render(); await fetchRow(r); render();
  });
  document.querySelectorAll('[data-contr]').forEach((el) => el.onchange = () => {
    const r = rows.find((x) => x.id == el.dataset.contr); r.contracts = parseInt(el.value) || 0; render();
  });
  document.querySelectorAll('[data-prem]').forEach((el) => el.onchange = () => {
    const r = rows.find((x) => x.id == el.dataset.prem);
    r.override = el.value === '' ? null : parseFloat(el.value); render();
  });
  document.querySelectorAll('[data-del]').forEach((el) => el.onclick = () => {
    rows = rows.filter((x) => x.id != el.dataset.del); render();
  });
}

// ── Expirations dropdown ──────────────────────────────────────────────────────
async function loadExpirations() {
  const today = new Date().toISOString().slice(0, 10);
  // use a liquid underlying to populate the global list (standard monthlies align)
  const ref = rows.find((r) => !r.isEtf)?.ticker || rows[0].ticker;
  let dates = [];
  try {
    const j = await mfetch('expirations', ref, { 'expiration_date.gte': today });
    dates = [...new Set((j.results || []).map((c) => c.expiration_date))].filter(Boolean).sort();
  } catch { /* fall back to empty */ }
  if (!dates.length) { // synth a few monthly-ish fallbacks
    const d = new Date(); for (let i = 0; i < 6; i++) { d.setDate(d.getDate() + 30); dates.push(d.toISOString().slice(0, 10)); }
  }
  dates = dates.slice(0, 12);
  // default: first expiry ≥ ~20 days out, else nearest
  const def = dates.find((x) => daysTo(x) >= 20) || dates[0];
  expiry = def;
  $('expiry').innerHTML = dates.map((x) => `<option value="${x}" ${x === def ? 'selected' : ''}>${x} · ${daysTo(x)}d</option>`).join('');
  $('expiry').onchange = async () => { expiry = $('expiry').value; await loadAll(); };
}

// ── Load all rows ─────────────────────────────────────────────────────────────
async function loadAll() {
  rows.forEach((r) => { r.loading = true; r.live = null; r.err = null; });
  render();
  await Promise.all(rows.map((r) => fetchRow(r)));
  render();
}

// ── Wire up ───────────────────────────────────────────────────────────────────
$('portval').value = portVal;
$('portval').onchange = () => { portVal = parseFloat($('portval').value) || portVal; render(); };
$('refresh').onclick = () => loadAll();
$('addbtn').onclick = async () => {
  const tk = ($('newtk').value || '').trim().toUpperCase();
  const strike = parseFloat($('newstrike').value);
  if (!tk || !strike) return;
  const r = { id: Date.now(), ticker: tk, reason: '', strike, contracts: parseInt($('newcontracts').value) || 0,
              weight: 0, seedPrime: null, isEtf: !SUMMIT[tk], override: null, live: null, loading: true, err: null };
  rows.push(r); $('newtk').value = ''; $('newstrike').value = ''; $('newcontracts').value = '';
  render(); await fetchRow(r); render();
};

(async function init() {
  await loadExpirations();
  await loadAll();
})();
