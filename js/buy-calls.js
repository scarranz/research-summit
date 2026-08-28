// Buy Calls — long-call analyzer.
//
// The mirror image of the Covered Calls tab. There we SELL a call and ask "at what
// valuation do I get called away"; here we BUY one and ask two questions the option
// chain alone cannot answer:
//
//   1. What multiple am I underwriting?  A $400 strike is meaningless until it is
//      "18x 2028E EPS". Every strike and every breakeven is priced back into an
//      implied P/E and EV/EBITDA on a year picked in the table header itself.
//   2. How big an account does one contract need?  Notional ÷ the share of the
//      account we allow a single position to control.
//
// The ladder is a HAND-PICKED list of strikes, not the whole chain — a long call is
// a considered bet on a few strikes, so they are added deliberately (a dropdown of
// what is listed, or a range) and removed one by one. The tab opens on the January
// LEAPS and on the last estimate year we hold: a valuation thesis needs the time.
//
// Live price, premium, IV and greeks come from the Massive option chain via the
// covered-calls-massive edge function. Forward EBITDA / net income / EPS / net debt
// come from js/buy-calls-data.js (Bloomberg consensus for APP, Summit DCF for the
// rest). Nothing is written anywhere — every input on the page is in-memory.

import { BC_ESTIMATES, BC_DEFAULT_TICKER } from './buy-calls-data.js';
import { coveredCallsQuote } from './api.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('bc-root');

// Copied verbatim from js/results.js:219 — every interpolated string goes through it.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// ── Formatting. No bare numbers, estimates always marked. ─────────────────────
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
  showFund: true,            // show the income-statement block
  sens: false,               // revenue-growth sensitivity inputs on/off
  revG: {},                  // year -> overridden revenue growth (decimal)

  selected: null,            // selected strike (drives the KPI strip)
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
const estYearsOf = () => { const e = estOf(); return yearsOf().filter((y) => e.years[y] && e.years[y].est); };
// Multiples need a USD estimate set: SPOT reports in EUR and TBBB in MXN, and a
// EUR EBITDA against a USD share price is simply a wrong number. Show nothing
// rather than something broken.
const usable = () => { const e = estOf(); return !!e && e.currency === 'USD'; };
const yl = (y) => { const e = estOf(); return (e && e.years[y] && e.years[y].est) ? `${y}E` : `${y}`; };

// ── The sensitivity layer ─────────────────────────────────────────────────────
// Every number on the page reads its estimates through eff(), not through the raw
// data file. That is what makes the sensitivity work: override the REVENUE GROWTH
// of a forward year and the revenue line is rebuilt off the prior year, then
// EBITDA, net income and EPS follow at their CONSENSUS MARGINS — everything else
// is held constant. Overrides compound, so flexing 2027 moves 2028 with it.
//
// Net debt is deliberately NOT flexed: moving it would need a cash-flow model, and
// inventing one behind a slider is exactly the kind of fake precision this page is
// supposed to avoid. The block says so.
const flexYears = () => estYearsOf().slice(-2);
const isFlexed = () => Object.keys(st.revG).some((y) => st.revG[y] != null);

function eff() {
  const e = estOf(); if (!e) return {};
  const out = {};
  Object.keys(e.years).forEach((y) => { out[y] = { ...e.years[y] }; });
  const ys = yearsOf();
  const first = ys.find((y) => st.revG[y] != null);
  if (first == null) return out;
  // From the first overridden year on, EVERY later year is rebuilt too — at its own
  // consensus growth rate unless it is itself overridden. Leaving a later year at its
  // consensus LEVEL would silently invent a growth rate for it: cut 2027 to +15% and
  // 2028 would have had to accelerate to +40% to land back on the consensus number.
  ys.filter((y) => y >= first).forEach((y) => {
    const base = e.years[y], prev = out[y - 1], prevC = e.years[y - 1];
    if (!base || !prev || prev.rev == null || !prevC || !(prevC.rev > 0)) return;
    const consG = base.rev != null ? base.rev / prevC.rev - 1 : null;
    const g = st.revG[y] != null ? st.revG[y] : consG;
    if (g == null) return;
    const mEb = (base.ebitda != null && base.rev) ? base.ebitda / base.rev : null;
    const mNi = (base.netIncome != null && base.rev) ? base.netIncome / base.rev : null;
    const rev = prev.rev * (1 + g);
    out[y].rev = rev;
    if (mEb != null) out[y].ebitda = rev * mEb;
    if (mNi != null) out[y].netIncome = rev * mNi;
    if (out[y].netIncome != null && out[y].shares) out[y].eps = out[y].netIncome / out[y].shares;
    if (base.rev && Math.abs(rev / base.rev - 1) > 1e-9) out[y].flexed = true;
  });
  return out;
}

// Diluted shares (M) and net debt ($M) for a year. Net debt falls back to the live
// enterprise-value − market-cap when the estimate set has none.
function capital(year) {
  const y = eff()[year];
  const shares = (y && y.shares != null) ? y.shares : (st.shares != null ? st.shares / 1e6 : null);
  const netDebt = (y && y.netDebt != null) ? y.netDebt
                : (st.netDebtLive != null ? st.netDebtLive / 1e6 : null);
  return { shares, netDebt };
}

// The two multiples a share price implies on a given estimate year.
function multiplesAt(price, year) {
  if (!usable() || price == null) return { pe: null, ev: null };
  const y = eff()[year];
  if (!y) return { pe: null, ev: null };
  const { shares, netDebt } = capital(year);
  const pe = (y.eps != null && y.eps > 0) ? price / y.eps : null;
  const ev = (y.ebitda != null && y.ebitda > 0 && shares != null && netDebt != null)
    ? (price * shares + netDebt) / y.ebitda : null;
  return { pe, ev };
}

// YoY growth of one estimate line, its CAGR across the window, and its margin on
// revenue. Each returns null unless the inputs are positive — a growth rate off a
// loss, or a margin off no revenue, is noise.
function growth(key, year, src) {
  const E = src || eff();
  const cur = E[year] && E[year][key];
  const prev = E[year - 1] && E[year - 1][key];
  return (cur != null && prev != null && prev > 0) ? cur / prev - 1 : null;
}
function cagr(key, from, to, src) {
  const E = src || eff();
  const a = E[from] && E[from][key], b = E[to] && E[to][key];
  return (a != null && b != null && a > 0 && b > 0 && to > from)
    ? Math.pow(b / a, 1 / (to - from)) - 1 : null;
}
function margin(key, year, src) {
  const E = src || eff();
  const v = E[year] && E[year][key], rev = E[year] && E[year].rev;
  return (v != null && rev != null && rev > 0) ? v / rev : null;
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
// The ladder a new ticker opens on: a band roughly 8%–42% out of the money, snapped
// to whatever increment the chain lists. On AppLovin at ~$319 that is exactly
// 350–450, and it stays sensible on a name whose strikes step in 20s or 50s.
function defaultRange() {
  const all = listedStrikes();
  if (!all.length || st.spot == null) return { from: null, to: null };
  const step = strikeStep(all);
  return {
    from: Math.ceil(st.spot * 1.08 / step) * step,
    to: Math.floor(st.spot * 1.42 / step) * step,
  };
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
// The tab opens on the JANUARY LEAPS — a call bought on a valuation view needs the
// time for the estimate year to arrive. Prefer a January expiry between one and
// roughly two and a half years out (Jan-2028 from here), else the longest listed.
function defaultExpiry(dates) {
  const jan = dates.filter((d) => d.slice(5, 7) === '01' && daysTo(d) >= 300 && daysTo(d) <= 950);
  if (jan.length) return jan[0];
  const long = dates.filter((d) => daysTo(d) >= 300);
  if (long.length) return long[0];
  return dates.find((d) => daysTo(d) >= 150) || dates[dates.length - 1];
}

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
  if (dates.length) st.expiry = defaultExpiry(dates);
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
    }
  } catch (e) {
    st.err = e.message; st.chain = [];
  } finally {
    st.loading = false; render();
  }
}

async function loadTicker(tk) {
  st.ticker = tk.toUpperCase();
  st.loading = true; st.err = null; st.chain = [];
  st.strikes = []; st.seeded = false; st.rangeFrom = null; st.rangeTo = null;
  st.selected = null; st.revG = {};
  // Underwrite on the LAST estimate year we hold (2028E for APP) — it is the one a
  // January LEAPS is actually a bet on.
  const ys = yearsOf(), ey = estYearsOf();
  st.basisYear = ey[ey.length - 1] ?? ys[ys.length - 1] ?? null;
  render();
  await loadExpiries();
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  await loadChain();
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
      <th colspan="${nContract}" class="grp">Contract
        <button type="button" class="xp" id="bc-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="2" class="grp sep">At strike · ${yearSel}</th>
      <th colspan="4" class="grp sep">Breakeven · ${esc(yl(st.basisYear))}</th>
      <th colspan="4" class="grp sep">Summary</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Moneyness</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">P/E</th><th>EV/EBITDA</th>
      <th class="sep">Breakeven</th><th>% move</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">Exposure <input id="bc-expo" class="hnum" type="number" step="0.5" min="0.1" value="${(st.exposurePct * 100).toFixed(1)}"></th>
      <th>Cost % of strike</th>
      <th>Cost outflow</th>
      <th>Min. portfolio</th>
    </tr>`;

  const ncol = nContract + 2 + 4 + 4 + 1;
  if (!rows.length) {
    $('bc-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear);
  $('bc-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="tk lft">$${r.K}</td>
        <td colspan="${ncol - 2}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const sel = r.K === (selectedRow() || {}).K;
    const itm = st.spot != null && r.K <= st.spot;
    const q = `<b>Bid</b> ${px(r.bid)}  <b>Ask</b> ${px(r.ask)}  <b>Mid</b> ${px(r.mid)}<br>`
      + `<b>Last</b> ${px(r.lastTrade)} · <b>OI</b> ${r.oi == null ? '—' : r.oi.toLocaleString()} · <b>Theta</b> ${r.theta == null ? '—' : r.theta.toFixed(3)}`
      + `<br><b>Cost</b> ${cash(r.cost)} / contract · <b>Notional</b> ${cash(r.notional)}`;
    return `<tr class="${sel ? 'sel' : ''}" data-k="${r.K}">
      <td class="tk lft">$${r.K}${itm ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="${r.moneyness >= 0 ? '' : 'up'}">${pctS(r.moneyness)}</td>
      <td class="big">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      ${st.expand ? `<td>${pct(r.iv, 0)}</td><td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>` : ''}
      <td class="sep ${rich(r.peK, curP.pe)}">${mult(r.peK)}</td>
      <td class="${rich(r.evK, curP.ev)}">${mult(r.evK)}</td>
      <td class="sep big">${px(r.be)}</td>
      <td class="dn">${pctS(r.toBe)}</td>
      <td class="${rich(r.peBe, curP.pe)}">${mult(r.peBe)}</td>
      <td class="${rich(r.evBe, curP.ev)}">${mult(r.evBe)}</td>
      <td class="sep muted">${pct(st.exposurePct, 1)}</td>
      <td>${pct(r.costPct, 1)}</td>
      <td>${cash(r.cost)}</td>
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
  root().querySelectorAll('[data-del]').forEach((el) => el.onclick = (ev) => {
    ev.stopPropagation();
    const k = +el.dataset.del;
    st.strikes = st.strikes.filter((x) => x !== k);
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

// ── Render: the income statement ──────────────────────────────────────────────
// The Covered Calls fundamentals block, on one ticker instead of nine, and read in
// income-statement order: revenue down to EPS, each level followed by its growth
// and — where it means anything — its margin on revenue. The CAGR sits on the
// growth line because that is what it measures; the PEG sits on the level.
//
// With Sensitivity on, the revenue growth of the last two estimate years becomes
// an input. See eff() for what moves and what is held.
function renderFund() {
  const wrap = $('bc-fund');
  if (!wrap) return;
  wrap.hidden = !st.showFund;
  if (!st.showFund) return;
  const e = estOf();
  if (!e) { wrap.innerHTML = ''; return; }

  const E = eff(), cons = e.years;
  const cols = yearsOf().filter((y) => y >= 2024);
  const firstA = cols.find((y) => !cons[y].est) ?? cols[0];
  const lastY = cols[cols.length - 1];
  const flex = flexYears();
  const cur = multiplesAt(st.spot, st.basisYear);
  // PEG on the selected basis year: today's multiple ÷ that year's growth, in points.
  const gEb = growth('ebitda', st.basisYear), gNi = growth('netIncome', st.basisYear);
  const pegEv = (cur.ev != null && gEb && gEb > 0) ? cur.ev / (gEb * 100) : null;
  const pegPe = (cur.pe != null && gNi && gNi > 0) ? cur.pe / (gNi * 100) : null;

  const est = (y) => cons[y].est ? ' rs-ft-este' : '';
  const flexed = (y) => E[y] && E[y].flexed ? ' flexed' : '';
  // These are REPORTING-currency figures, not the USD the ladder above is priced in.
  // A peso EBITDA printed with a $ reads as dollars, so only USD reporters get one;
  // the stub column names the unit for everyone else.
  const sym = e.currency === 'USD' ? '$' : '';
  const fbn = (x) => {
    if (x == null || !isFinite(x)) return '—';
    const a = Math.abs(x), s = x < 0 ? '−' : '';
    return a >= 1000 ? `${s}${sym}${(a / 1000).toFixed(2)}B` : `${s}${sym}${a.toFixed(0)}M`;
  };
  const fps = (v) => v == null ? '—' : `${sym}${v.toFixed(2)}`;

  // A level row, then a growth sub-row, then optionally a margin sub-row.
  function lines(label, key, fmtv, opts) {
    const o = opts || {};
    const lvl = `<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">${esc(label)}</td>`
      + cols.map((y) => `<td class="${est(y)}${flexed(y)}">${esc(fmtv(E[y][key]))}</td>`).join('')
      + `<td class="sep"></td><td>${o.peg == null ? '' : o.peg.toFixed(2)}</td></tr>`;

    const gcells = cols.map((y) => {
      const g = growth(key, y);
      // The one editable number on the page: revenue growth in a flex year.
      if (o.editable && st.sens && flex.includes(y)) {
        const val = (st.revG[y] != null ? st.revG[y] : g);
        return `<td class="${est(y)} gcell"><input class="gin" type="number" step="1" data-revg="${y}"
          value="${val == null ? '' : (val * 100).toFixed(1)}" title="revenue growth for ${y}E — everything below follows at consensus margins"></td>`;
      }
      return `<td class="${est(y)}${flexed(y)} ${g == null ? '' : (g >= 0 ? 'up' : 'dn')}">${g == null ? '—' : pctS(g, 0)}</td>`;
    }).join('');
    const cg = cagr(key, firstA, lastY);
    const grow = `<tr class="rs-ft-sub${o.margin ? ' rs-ft-nb' : ''}"><td class="rs-ft-h">growth</td>${gcells}`
      + `<td class="sep ${cg == null ? '' : (cg >= 0 ? 'up' : 'dn')}">${cg == null ? '—' : pctS(cg)}</td><td></td></tr>`;

    if (!o.margin) return lvl + grow;
    // No flexed marker on the margin line: the margins are exactly what the
    // sensitivity HOLDS, so painting them as moved would contradict itself.
    const mcells = cols.map((y) => {
      const m = margin(key, y);
      return `<td class="${est(y)}">${m == null ? '—' : pct(m, 1)}</td>`;
    }).join('');
    return lvl + grow + `<tr class="rs-ft-sub"><td class="rs-ft-h">margin</td>${mcells}<td class="sep"></td><td></td></tr>`;
  }

  const plain = (label, fmtv) => `<tr class="rs-ft-main"><td class="rs-ft-h">${esc(label)}</td>`
    + cols.map((y) => `<td class="${est(y)}">${esc(fmtv(y))}</td>`).join('')
    + `<td class="sep"></td><td></td></tr>`;

  wrap.innerHTML = `
    <div class="block-top">
      <div class="block-h">${esc(e.name)} — income statement</div>
      <button type="button" class="ghost sm ${st.sens ? 'on' : ''}" id="bc-sens">${st.sens ? '✓ ' : ''}Sensitivity</button>
      ${isFlexed() ? '<button type="button" class="ghost sm" id="bc-sensReset">Reset to consensus</button>' : ''}
      <span class="muted">CAGR ${firstA}→${lastY} on each growth line · PEG on ${esc(yl(st.basisYear))}</span>
    </div>
    ${st.sens ? `<div class="senshint">Type a revenue growth for ${flex.map((y) => esc(yl(y))).join(' and ')}. Revenue is rebuilt off the prior year and compounds; EBITDA, net income and EPS follow at their <b>consensus margins</b>; shares and net debt are held. Every multiple in the ladder above moves with it.</div>` : ''}
    <div class="rs-tablewrap"><div class="rs-ft-scroll"><table class="rs-ft bc-fundtbl">
      <thead><tr><th class="rs-ft-h">${e.currency === 'USD' ? '$M' : esc(e.currency) + ' M'} unless noted</th>
        ${cols.map((y) => `<th class="${est(y)}">${y}${cons[y].est ? '<span class="rs-ft-e">E</span>' : ''}</th>`).join('')}
        <th class="sep">CAGR</th><th>PEG</th></tr></thead>
      <tbody>
        ${lines('Revenue', 'rev', fbn, { editable: true })}
        ${lines(e.ebitdaLabel, 'ebitda', fbn, { margin: true, peg: pegEv })}
        ${lines('Net income', 'netIncome', fbn, { margin: true, peg: pegPe })}
        ${lines(e.epsLabel, 'eps', fps, {})}
        ${plain('Diluted shares (M)', (y) => E[y].shares == null ? '—' : E[y].shares.toFixed(1))}
        ${plain('Net debt (cash)', (y) => E[y].netDebt == null ? '—' : fbn(E[y].netDebt))}
      </tbody></table></div></div>
    <div class="foot">
      <b>Margin</b> is the line as a % of revenue — the common-size view. Revenue has none by definition, and EPS is per share rather than a share of revenue, so neither carries one. <b>PEG</b> = the multiple ${esc(st.ticker)} trades at <em>today</em> on ${esc(yl(st.basisYear))} ÷ that year's growth in points: EV/EBITDA ÷ EBITDA growth on the EBITDA line, P/E ÷ net-income growth on Net income. Growth off a loss-making or missing prior year is left blank rather than invented. Diluted shares and net debt carry no growth or margin; they are here because the ladder's EV/EBITDA is built from them.<br>
      <b>Sensitivity</b> holds every margin at consensus and moves revenue only, so it answers "what if the top line compounds differently", not "what if the business changes shape". <b>Net debt is not flexed</b> — restating it would need a cash-flow model, and guessing one behind an input would be false precision.<br>
      ${esc(e.source)}</div>`;
}

function renderFoot() {
  $('bc-foot').innerHTML = `
    <b>Contract</b> — a buyer lifting the offer pays the <b>ask</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old. Hover the <b>i</b> for bid/ask/mid, last trade, open interest, theta, and the cash cost and notional of one contract. <b>+</b> opens IV and delta.<br>
    <b>At strike</b> and <b>Breakeven</b> — the multiples the company would trade at <em>at that price</em>, on the estimate year picked in the header (both groups follow it). Breakeven = strike + premium, the price at expiry where the position returns the cheque; <b>% move</b> is the move from spot it needs. EV/EBITDA uses the estimate year's own net debt where the model carries one, otherwise live enterprise value − market cap. <span class="cheap">Green</span> = below today's multiple, <span class="rich">red</span> = above it.<br>
    <b>Summary</b>, read left to right as the sizing decision itself — <b>Exposure</b> is the share of the account a single contract's notional is allowed to be; set it once in the header and it applies to every row. <b>Cost % of strike</b> = premium ÷ strike, what the optionality costs relative to what it buys. <b>Cost outflow</b> = premium × 100, the cash that actually leaves the account for one contract, and the most you can lose on it. <b>Min. portfolio</b> = notional ÷ the exposure limit — the smallest account for which one contract still sits inside it, with notional = ${st.notionalBasis === 'strike' ? 'strike' : 'spot'} × 100. The gap between the last two columns is the whole trade: the outflow is what is at risk, the notional is what the position <em>controls</em>, and the exposure limit is a rule about the second, not the first.<br>
    Price, premium, IV and greeks are live from the Massive option chain. Nothing on this page is stored — every input is in-memory and resets on reload.`;
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
  renderFund();
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
  const tf = $('bc-togFund');
  if (tf) tf.textContent = st.showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
  // Say it out loud when the multiples are no longer running on consensus.
  const fp = $('bc-flexpill');
  if (fp) { fp.hidden = !isFlexed(); fp.textContent = 'estimates flexed'; }
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
        <span class="pill flex" id="bc-flexpill" hidden></span>
      </div>
      <div class="sub">Buying a call is a bet on a price. This prices the strikes you pick, and their breakevens, back into the multiple they imply.</div>
      <div class="controls">
          <div class="ctl"><label>Ticker</label><input id="bc-ticker" value="${esc(st.ticker)}" size="6"></div>
          <div class="ctl"><label>Expiry</label><select id="bc-expiry"></select></div>
          <div class="ctl"><label>Premium</label><div class="seg" id="bc-premSel">
            <button data-prem="ask">Ask</button><button data-prem="mid">Mid</button><button data-prem="last">Last</button></div></div>
          <div class="ctl"><label>Notional basis</label><div class="seg" id="bc-notSel">
            <button data-not="strike">Strike × 100</button><button data-not="spot">Spot × 100</button></div></div>
          <div class="ctl"><label>&nbsp;</label><button id="bc-togFund" class="ghost">Hide EBITDA / NI</button></div>
          <div class="ctl"><label>&nbsp;</label><button id="bc-refresh">↻ Refresh</button></div>
      </div>
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

        <div class="block" id="bc-fund"></div>
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
  $('bc-togFund').onclick = () => { st.showFund = !st.showFund; render(); };

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
  $('bc-clear').onclick = () => { st.strikes = []; st.selected = null; render(); };

  // Delegated on the tab root, never on document. The year dropdown and the
  // exposure input live inside the table header, which is rewritten on every
  // render, so they cannot be bound directly.
  r.addEventListener('change', (ev) => {
    if (ev.target.id === 'bc-basisYear') { st.basisYear = +ev.target.value; render(); }
    if (ev.target.id === 'bc-expo') {
      const v = parseFloat(ev.target.value);
      if (isFinite(v) && v > 0) st.exposurePct = v / 100;
      render();
    }
    // Revenue-growth override: blank clears it back to consensus.
    if (ev.target.dataset && ev.target.dataset.revg) {
      const y = +ev.target.dataset.revg, v = parseFloat(ev.target.value);
      if (ev.target.value === '' || !isFinite(v)) delete st.revG[y];
      else st.revG[y] = v / 100;
      render();
    }
  });

  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#bc-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const not = ev.target.closest('#bc-notSel button');
    if (not) { st.notionalBasis = not.dataset.not; render(); return; }
    if (ev.target.closest('#bc-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#bc-sens')) { st.sens = !st.sens; render(); return; }
    if (ev.target.closest('#bc-sensReset')) { st.revG = {}; render(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('bc-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
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
