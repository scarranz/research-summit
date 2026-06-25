// Covered Calls — live dashboard. Pulls price + option chain (premium/IV/greeks)
// from the local Massive proxy and forward EBITDA/EPS from Summit, then computes
// the covered-call economics + "valuation if exercised" the way the Excel does.
import { POSITIONS } from './positions.js';
import { SUMMIT } from './summit-data.js';

const $ = (id) => document.getElementById(id);

// Foreign currency → Massive forex pair. invert=true means the pair is USD/XXX,
// so XXX→USD = 1 / close (e.g. USDMXN). EUR uses EURUSD directly.
const FXCFG = { EUR: { pair: 'EURUSD', invert: false }, MXN: { pair: 'USDMXN', invert: true } };
const T0 = 2025;                 // last reported fiscal year (t0)
const FY = [T0, T0 + 1, T0 + 2]; // t0, t+1, t+2 shown in the fundamentals block
const fyLabel = (y) => `FY${String(y).slice(2)}${y > T0 ? 'E' : ''}`;

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
// No money formatter — the whole analysis is in %. Price is the only $ figure.
const px   = (x) => (x == null || isNaN(x)) ? '—' : `$${x.toFixed(2)}`;
const mult = (x) => (x == null || isNaN(x) || !isFinite(x)) ? '—' : `${x.toFixed(1)}x`;
const pct  = (x, d = 1) => (x == null || isNaN(x)) ? '—' : `${(x * 100).toFixed(d)}%`;
const pctSign = (x, d = 1) => (x == null || isNaN(x)) ? '—' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`;
// compact magnitude for values already expressed in millions (currency-neutral)
const bn = (x) => {
  if (x == null || isNaN(x)) return '—';
  const a = Math.abs(x), s = x < 0 ? '-' : '';
  return a >= 1000 ? `${s}${(a / 1000).toFixed(1)}B` : `${s}${a.toFixed(0)}M`;
};

// ── State ─────────────────────────────────────────────────────────────────────
let rows = POSITIONS.map((p, i) => ({ id: i, ...p, override: null, live: null, loading: true, err: null }));
let expiry = null;
let mulBasis = '2026E';  // '2026E' | '2027E' | 'NTM' — fundamental year driving every multiple + PEG
let showFund = true;     // show/hide the EBITDA & Net Income blocks

// Fraction of the next-twelve-months window that falls in calendar FY[1] (t+1).
// Used to blend FY[1]/FY[2] estimates into an NTM figure (no quarterly data).
function ntmFrac() {
  const now = new Date();
  const end = new Date(`${FY[1]}-12-31T00:00:00`);
  return Math.min(1, Math.max(0, (end - now) / 86400000 / 365));
}

// EBITDA / earnings (+ their YoY growth) for the selected basis, native currency.
function basisFundamentals(ticker) {
  const su = SUMMIT[ticker];
  if (!su || !su.years) return null;
  const yv = (y, k) => su.years[y]?.[k];
  const g  = (y, k) => (yv(y, k) != null && yv(y - 1, k) != null && yv(y - 1, k) > 0) ? yv(y, k) / yv(y - 1, k) - 1 : null;
  if (mulBasis === '2026E') return { ebitda: yv(FY[1], 'ebitda'), earnings: yv(FY[1], 'earnings'), gEb: g(FY[1], 'ebitda'), gEa: g(FY[1], 'earnings') };
  if (mulBasis === '2027E') return { ebitda: yv(FY[2], 'ebitda'), earnings: yv(FY[2], 'earnings'), gEb: g(FY[2], 'ebitda'), gEa: g(FY[2], 'earnings') };
  const f = ntmFrac(); // NTM = calendar blend of t+1 and t+2
  const blend = (a, b) => (a != null && b != null) ? f * a + (1 - f) * b : null;
  return {
    ebitda:   blend(yv(FY[1], 'ebitda'),   yv(FY[2], 'ebitda')),
    earnings: blend(yv(FY[1], 'earnings'), yv(FY[2], 'earnings')),
    gEb: blend(g(FY[1], 'ebitda'),   g(FY[2], 'ebitda')),
    gEa: blend(g(FY[1], 'earnings'), g(FY[2], 'earnings')),
  };
}

// CAGR from t0 (FY[0]) to t+2 (FY[2]); null unless both endpoints are positive.
function cagr(ticker, key) {
  const su = SUMMIT[ticker];
  if (!su || !su.years) return null;
  const a = su.years[FY[0]]?.[key], b = su.years[FY[2]]?.[key];
  return (a != null && b != null && a > 0 && b > 0) ? Math.pow(b / a, 1 / (FY[2] - FY[0])) - 1 : null;
}

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

    const lt = contract?.last_trade || {};
    row.live = {
      price, premium, iv: contract?.implied_volatility ?? null,
      delta: contract?.greeks?.delta ?? null, theta: contract?.greeks?.theta ?? null,
      oi: contract?.open_interest ?? null, name: d.name || row.ticker,
      shares, mktCap, netDebt, fxRate, fxNote,
      bid: q.bid ?? null, ask: q.ask ?? null,
      lastTrade: lt.price ?? null, lastTradeTs: lt.sip_timestamp ?? lt.timestamp ?? null,
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
  const days = daysTo(L.usedExpiry || expiry);
  const annYld = (yld != null && days > 0) ? yld * 365 / days : null;
  // contribution to the portfolio-level premium yield = position weight × its yield
  const w = row.weight || 0;
  const contrib = (yld != null) ? yld * w : null;
  const annContrib = (annYld != null) ? annYld * w : null;

  // Multiples on the selected basis (current price & strike), plus implied PEG.
  // PEG = current multiple ÷ (basis growth in %); only meaningful when growth > 0.
  let evP = null, evS = null, peP = null, peS = null;
  let pegEv = null, pegPe = null, pegEvS = null, pegPeS = null;
  const bf = basisFundamentals(row.ticker);
  if (bf && L.shares && price != null && !row.isEtf) {
    const f = L.fxRate, sh = L.shares;
    const ebitdaUSD = (bf.ebitda != null) ? bf.ebitda * f * 1e6 : null;
    const earnUSD = (bf.earnings != null) ? bf.earnings * f * 1e6 : null;
    const mc = price * sh, mcS = row.strike * sh;
    const nd = L.netDebt;
    if (ebitdaUSD && nd != null) { evP = (mc + nd) / ebitdaUSD; evS = (mcS + nd) / ebitdaUSD; }
    if (earnUSD && earnUSD > 0) { peP = mc / earnUSD; peS = mcS / earnUSD; }
    const gEb = (bf.gEb && bf.gEb > 0) ? bf.gEb * 100 : null;
    const gEa = (bf.gEa && bf.gEa > 0) ? bf.gEa * 100 : null;
    if (evP != null && gEb) pegEv = evP / gEb;
    if (peP != null && gEa) pegPe = peP / gEa;
    if (evS != null && gEb) pegEvS = evS / gEb;
    if (peS != null && gEa) pegPeS = peS / gEa;
  }
  return { price, premium, yld, upside, contrib, annContrib, annYld, days, evP, evS, peP, peS, pegEv, pegPe, pegEvS, pegPeS };
}

function daysTo(dateStr) {
  if (!dateStr) return null;
  const t = new Date(dateStr + 'T16:00:00'); const now = new Date();
  return Math.max(0, Math.round((t - now) / 86400000));
}

// Massive option last_trade timestamps come in ns / ms / s — normalize to a
// "YYYY-MM-DD HH:MM" stamp for the hover tooltip.
function tradeStamp(ts) {
  if (ts == null) return '—';
  const ms = ts > 1e15 ? ts / 1e6 : ts > 1e12 ? ts : ts * 1000;
  const d = new Date(ms);
  return isNaN(d) ? '—' : d.toISOString().slice(0, 16).replace('T', ' ');
}

// EBITDA / Net Income for t0..t+2 with YoY growth, from the Summit model.
// Returns [{ v, g }] per year (v = value in native-currency millions, g = YoY).
function fundSeries(ticker, key) {
  const su = SUMMIT[ticker];
  if (!su || !su.years) return null;
  return FY.map((y) => {
    const cur = su.years[y]?.[key];
    const prev = su.years[y - 1]?.[key];
    const g = (cur != null && prev != null && prev > 0) ? cur / prev - 1 : null;
    return { v: cur ?? null, g };
  });
}

// One fundamentals block (5 cells): FY[0..2] value-over-YoY, then CAGR, then PEG.
function fundSection(series, cagrVal, pegVal) {
  if (!series) return [0, 1, 2, 3, 4].map((i) => `<td class="${i === 0 ? 'sep ' : ''}fund muted">—</td>`).join('');
  const yrs = series.map((d, i) => `<td class="${i === 0 ? 'sep ' : ''}fund">
      <div class="fv">${bn(d.v)}</div>
      <div class="fg ${d.g == null ? '' : (d.g >= 0 ? 'up' : 'dn')}">${d.g == null ? '—' : pctSign(d.g)}</div>
    </td>`).join('');
  const cg = `<td class="fund"><div class="fv ${cagrVal == null ? '' : (cagrVal >= 0 ? 'up' : 'dn')}">${cagrVal == null ? '—' : pctSign(cagrVal)}</div></td>`;
  const pg = `<td class="fund"><div class="fv">${pegVal == null ? '—' : pegVal.toFixed(2)}</div></td>`;
  return yrs + cg + pg;
}

// ── Render ────────────────────────────────────────────────────────────────────
// Target multiple richer (higher) than current → green = called away at an
// expensive valuation (good for a call seller); cheaper → red.
const richer = (v, base) => (v != null && base != null) ? (v > base ? 'cheap' : 'rich') : '';

function render() {
  // KPIs — everything in %, derived purely from weights (no $, no portfolio value).
  let portYld = 0, portAnn = 0, wUp = 0, wYld = 0, wIv = 0, wSum = 0, priced = 0;
  rows.forEach((r) => {
    const m = metrics(r); if (r.err || !r.live) return;
    if (m.contrib != null) portYld += m.contrib;        // Σ weight × premium yield
    if (m.annContrib != null) portAnn += m.annContrib;  // Σ weight × annualized yield
    const w = r.weight || 0; wSum += w; priced += 1;
    if (m.upside != null) wUp += m.upside * w;
    if (m.yld != null) wYld += m.yld * w;
    if (r.live.iv != null) wIv += r.live.iv * w;
  });
  const kn = wSum || 1;
  $('kpis').innerHTML = [
    ['Premium yield', pct(portYld, 2), `portfolio · ${priced} positions`],
    ['Annualized', pct(portAnn, 1), 'weight-scaled'],
    ['Avg upside to strike', pct(wUp / kn), 'weighted'],
    ['Avg premium yield', pct(wYld / kn, 2), 'per position'],
    ['Covered weight', pct(wSum, 1), 'of portfolio'],
  ].map(([l, v, s]) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`).join('');

  // header (two-row grouped). EBITDA/Net Income blocks toggle with showFund.
  const fundGroups = showFund
    ? `<th colspan="5" class="grp sep">EBITDA</th><th colspan="5" class="grp sep">Net Income</th>` : '';
  const fyHdr = `<th class="sep">${fyLabel(FY[0])}</th><th>${fyLabel(FY[1])}</th><th>${fyLabel(FY[2])}</th><th>CAGR</th><th>PEG</th>`;
  const fundLabels = showFund ? fyHdr + fyHdr : '';
  $('thead').innerHTML = `
    <tr>
      <th rowspan="2" class="tkh">Ticker</th>
      <th colspan="3" class="grp sep">Current · ${mulBasis}</th>
      ${fundGroups}
      <th colspan="4" class="grp sep">Target · ${mulBasis}</th>
      <th colspan="5" class="grp sep">Economics</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="sep">Price</th><th>P/E</th><th>EV/EBITDA</th>
      ${fundLabels}
      <th class="sep">Strike</th><th>Impl. Upside</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">Wt</th><th>Premium</th><th>Yield</th><th>Port. yield</th><th>Contrib.</th>
    </tr>`;
  const ncol = 1 + 3 + (showFund ? 10 : 0) + 4 + 5 + 1; // total columns for colspans

  // body
  $('tbody').innerHTML = rows.map((r) => {
    if (r.loading) return `<tr><td class="tk">${r.ticker}</td><td colspan="${ncol - 1}" class="muted">loading…</td></tr>`;
    if (r.err) return `<tr><td class="tk">${r.ticker}</td><td colspan="${ncol - 2}" class="err">${r.err}</td>
      <td class="sep"><button class="x" data-del="${r.id}">✕</button></td></tr>`;
    const L = r.live, m = metrics(r);
    const ovr = r.override != null;
    const premVal = (m.premium != null) ? m.premium.toFixed(2) : '';
    const share = (m.contrib != null && portYld) ? m.contrib / portYld : null; // contribution to total premium yield
    const cur = SUMMIT[r.ticker]?.currency || 'USD';
    const peg = (x) => x == null ? '' : `PEG ${x.toFixed(2)}`;
    const q2 = (x) => x != null ? `$${x.toFixed(2)}` : '—';
    const qtip = `<b>Bid</b> ${q2(L.bid)} · <b>Ask</b> ${q2(L.ask)} · <b>Last</b> ${q2(L.lastTrade)} · <b>Traded</b> ${tradeStamp(L.lastTradeTs)} UTC`;
    const fund = showFund
      ? fundSection(fundSeries(r.ticker, 'ebitda'), cagr(r.ticker, 'ebitda'), m.pegEv)
        + fundSection(fundSeries(r.ticker, 'earnings'), cagr(r.ticker, 'earnings'), m.pegPe)
      : '';
    const mismatch = (L.usedExpiry && expiry && L.usedExpiry !== expiry) || (L.usedStrike != null && L.usedStrike !== r.strike);
    return `<tr>
      <td class="tk" title="${L.name || ''}">${r.ticker}${r.isEtf ? ' <span class="muted">ETF</span>' : (cur !== 'USD' ? ` <span class="cc" title="reports in ${cur}">${cur}</span>` : '')}</td>
      <td class="sep big">${px(m.price)}</td>
      <td><div class="fv">${mult(m.peP)}</div><div class="fg">${peg(m.pegPe)}</div></td>
      <td><div class="fv">${mult(m.evP)}</div><div class="fg">${peg(m.pegEv)}</div></td>
      ${fund}
      <td class="sep edit"><input type="number" step="1" value="${r.strike}" data-strike="${r.id}"></td>
      <td class="up">${pct(m.upside, 1)}</td>
      <td class="${richer(m.peS, m.peP)}"><div class="fv">${mult(m.peS)}</div><div class="fg">${peg(m.pegPeS)}</div></td>
      <td class="${richer(m.evS, m.evP)}"><div class="fv">${mult(m.evS)}</div><div class="fg">${peg(m.pegEvS)}</div></td>
      <td class="sep edit"><input type="number" step="0.1" value="${(r.weight * 100).toFixed(2)}" data-weight="${r.id}" title="portfolio weight %"></td>
      <td class="edit" data-tip="${qtip}"><input type="number" step="0.01" value="${premVal}" data-prem="${r.id}" class="${ovr ? 'ovr' : ''}" title="${ovr ? 'manual override' : 'live midpoint — type to override'}"></td>
      <td class="big up">${pct(m.yld, 2)}</td>
      <td class="big up">${pct(m.contrib, 2)}</td>
      <td>${pct(share, 1)}</td>
      <td class="sep"><button class="x" data-del="${r.id}" title="${mismatch ? 'using '+L.usedStrike+' @ '+L.usedExpiry : ''}">${mismatch ? '⚠' : '✕'}</button></td>
    </tr>`;
  }).join('');

  $('tbl').hidden = false; $('status').hidden = true;
  wireRowInputs();

  const anyMismatch = rows.some((r) => r.live && ((r.live.usedExpiry && expiry && r.live.usedExpiry !== expiry) || (r.live.usedStrike != null && r.live.usedStrike !== r.strike)));
  $('foot').innerHTML = `
    <b>EBITDA / Net Income</b> = Summit model ${fyLabel(FY[0])}–${fyLabel(FY[2])} (t0 = last reported FY), native-currency millions with YoY growth below · <b>CAGR</b> = ${FY[0]}→${FY[2]} · <b>PEG</b> = current multiple ÷ basis growth% ·
    <b>Multiple basis (${mulBasis})</b> drives every P/E &amp; EV/EBITDA${mulBasis === 'NTM' ? ' — NTM is a calendar-weighted blend of '+fyLabel(FY[1])+'/'+fyLabel(FY[2])+' (no quarterly data)' : ''} · <b>Current</b> uses live price, <b>Target</b> uses the strike; the PEG under each multiple = that multiple ÷ basis growth · <b>Impl. Upside</b> = strike ÷ price − 1 ·
    hover the <b>Premium</b> cell for live bid / ask / last trade &amp; time ·
    <b>Yield</b> = premium ÷ price · <b>Port. yield</b> = yield × weight · <b>Contrib.</b> = Port. yield ÷ Σ Port. yield (share of total) ·
    <span class="cheap">green</span> = target multiple richer than current (called away at an expensive valuation).<br>
    Premium/IV/greeks are the live Massive option chain for each strike &amp; target expiry. Edit strike or weight inline; type a premium to override the live midpoint. All figures are in % — no dollar amounts, no contracts, no portfolio value.
    ${anyMismatch ? '<br><span class="warn">⚠ some rows had no contract at the exact strike/expiry — nearest available was used (hover the ⚠).</span>' : ''}`;
}

function wireRowInputs() {
  document.querySelectorAll('[data-strike]').forEach((el) => el.onchange = async () => {
    const r = rows.find((x) => x.id == el.dataset.strike); r.strike = parseFloat(el.value) || r.strike;
    r.loading = true; render(); await fetchRow(r); render();
  });
  document.querySelectorAll('[data-weight]').forEach((el) => el.onchange = () => {
    const r = rows.find((x) => x.id == el.dataset.weight); r.weight = (parseFloat(el.value) || 0) / 100; render();
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
$('refresh').onclick = () => loadAll();

// Multiple basis segmented toggle — re-renders only (uses already-fetched data).
function syncBasis() {
  document.querySelectorAll('#basisSel button').forEach((b) => b.classList.toggle('on', b.dataset.basis === mulBasis));
}
document.querySelectorAll('#basisSel button').forEach((b) => b.onclick = () => { mulBasis = b.dataset.basis; syncBasis(); render(); });
syncBasis();

// Hide / show the EBITDA & Net Income blocks.
$('togFund').onclick = () => {
  showFund = !showFund;
  $('togFund').textContent = showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
  render();
};

// Hover tooltip (bid / ask / last + trade time on the Premium cell). Delegated
// on document so it keeps working across re-renders.
const tipEl = $('tip');
document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-tip]');
  if (!el) return;
  tipEl.innerHTML = el.dataset.tip;
  tipEl.classList.add('on');
});
document.addEventListener('mousemove', (e) => {
  if (!tipEl.classList.contains('on')) return;
  tipEl.style.left = (e.clientX + 14) + 'px';
  tipEl.style.top = (e.clientY + 16) + 'px';
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('[data-tip]')) tipEl.classList.remove('on');
});
$('addbtn').onclick = async () => {
  const tk = ($('newtk').value || '').trim().toUpperCase();
  const strike = parseFloat($('newstrike').value);
  if (!tk || !strike) return;
  const weight = (parseFloat($('newweight').value) || 0) / 100;
  const r = { id: Date.now(), ticker: tk, reason: '', strike, weight,
              seedPrime: null, isEtf: !SUMMIT[tk], override: null, live: null, loading: true, err: null };
  rows.push(r); $('newtk').value = ''; $('newstrike').value = ''; $('newweight').value = '';
  render(); await fetchRow(r); render();
};

(async function init() {
  await loadExpirations();
  await loadAll();
})();
