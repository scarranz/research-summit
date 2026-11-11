// Long Put — a valuation short through options. Derivatives ▸ Long Put.
//
// The stock you think is TOO EXPENSIVE, paying premium for the downside. Where Protective
// Put insures shares we own, this is a directional bet with no shares behind it: the
// thesis is that earnings grow slowly while the market pays a multiple well above the
// company's own history, and that the multiple comes back. So the page answers the three
// things the option chain cannot:
//
//   1. How expensive is it, against its own past?  Today's forward P/E (live price ÷
//      next-twelve-months consensus EPS) against the 10-year Bloomberg history, with the
//      averages (10Y ex-COVID by default, 10Y, 5Y, 3Y, pre-COVID) one click apart.
//   2. Where would the price be if the multiple reverted?  The average × the EPS the
//      market will be looking at ON THE EXPIRY DATE (the next twelve months from then).
//      That is the re-rating scenario every strike is marked against: value at expiry,
//      P&L and return on the premium.
//   3. What valuation does each strike stand for?  Strike and breakeven (strike − premium)
//      as a P/E on that same expiry-date EPS — "the put pays below 26x" is a thesis.
//
// P/E only (SAB, Nov 9 2026). The growth question has its own block: how much of the
// consensus EPS growth is net-income growth and how much is buybacks.
//
// Price, premium, IV and greeks are live from the Massive option chain (options-core.js);
// EPS, net income, shares and the forward-P/E history are SAB's Bloomberg export, frozen in
// ./long-put-data.js with its date. Any other ticker works too (see lpDataFor): EPS from the
// Derivatives estimate store when the name is in it, else the live chain alone. Opens on MAR.
// Nothing is stored; every input resets on reload.

import { LP_DATA } from './long-put-data.js';
import { OPT_ESTIMATES } from './options-data.js';
import {
  estimatesFor,
  esc, px, mult, pct, pctS, cash, daysTo,
  fetchExpiries, fetchUnderlying, fetchChain,
  listedStrikes, bandAround, premiumOf, quoteTip, wireTooltip,
  selToggle, selHas, selClear, symbolOf, instrumentsBar, renderInstruments, onSelection,
} from './options-core.js';
import { attachBrush } from './betas-core.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('lp-root');
const DAY = 86400000;
const C_PE = '#1E2733', C_AVG = '#3E5A82', C_NOW = '#C0392B';

// ── State ─────────────────────────────────────────────────────────────────────
const st = {
  ticker: 'MAR',
  expiry: null, expiries: [],
  spot: null, changePct: null, name: '',
  chain: [], loading: true, err: null,
  strikes: [], rangeFrom: null, rangeTo: null, seeded: false, selected: null,
  premBasis: 'ask',          // a buyer lifts the offer
  expand: false,
  avgKey: 'x10',             // which historical average the scenario reverts to
  target: null,              // a typed target multiple overrides the average
  riskPct: 0.005,            // the premium is this share of the portfolio (SAB, Nov 10 2026: 0.5%)
  hist: { win: null, yr: null, hidden: {}, tbl: false },
};
let instOpen = false;
let D = null;                // lpDataFor(ticker)
let _chart = null;

// ── Any ticker: what we know about it, from the richest source on file ────────
// Three tiers, so the tab works for any optionable name and opens on MAR:
//   'bbg'  — a Bloomberg export in long-put-data.js: consensus EPS + the ten-year
//            forward-P/E history + the full income statement (MAR today).
//   'est'  — no export, but the name is in the Derivatives estimate store
//            (options-data.js: BBG consensus, else the Summit DCF): forward EPS, net
//            income and shares, so the P/E, the scenario and the growth split work;
//            there is no history, so the P/E to revert to is typed.
//   'none' — nothing on file (or a non-USD reporter, whose EPS is not in the option's
//            currency): the live chain, premiums, breakevens and sizing still work;
//            every valuation column stays blank rather than guessed.
const LP_TICKERS = () => [...new Set([...Object.keys(LP_DATA), ...Object.keys(OPT_ESTIMATES)])];
function lpDataFor(tk) {
  if (LP_DATA[tk]) return { kind: 'bbg', ...LP_DATA[tk] };
  const e = OPT_ESTIMATES[tk];
  if (!e) return { kind: 'none', name: null, years: {}, why: `${tk} has no consensus on file` };
  if ((e.currency || 'USD') !== 'USD') {
    return { kind: 'none', name: e.name, years: {}, why: `${e.name} reports in ${e.currency}, so its EPS is not in the option's dollars — no P/E is shown` };
  }
  const src = e.sources.consensus ? 'consensus' : (e.sources.summit ? 'summit' : null);
  const x = src ? estimatesFor(tk, src) : null;
  if (!x) return { kind: 'none', name: e.name, years: {}, why: `${tk} has no estimates on file` };
  const years = {}; let lastActual = null;
  Object.keys(x.years).map(Number).sort((a, b) => a - b).forEach((y) => {
    const r = x.years[y];
    years[y] = { eps: r.eps, ni: r.netIncome, sh: r.shares, rev: r.rev, ebitda: r.ebitda, est: !!r.est };
    if (!r.est) lastActual = y;
  });
  return {
    kind: 'est', name: x.name, currency: x.currency, asOf: x.asOf || '', lastActual, years,
    srcLabel: src === 'consensus' ? 'Bloomberg consensus' : 'Summit DCF model', epsLabel: x.epsLabel || 'EPS',
    src: x.source, hist: null, is: estIs(years, lastActual),
  };
}
// The income-statement block on the lines the estimate store carries.
function estIs(years, lastActual) {
  const ys = Object.keys(years).map(Number).sort((a, b) => a - b).filter((y) => lastActual == null || y >= lastActual - 3);
  if (ys.length < 2) return null;
  const v = (k) => ys.map((y) => (years[y][k] == null || !isFinite(years[y][k]) ? null : years[y][k]));
  const lines = {
    rev: { l: 'Revenue', u: 'm', v: v('rev'), f: 'revenue' },
    ebitda: { l: 'EBITDA', u: 'm', v: v('ebitda'), f: 'EBITDA' },
    a_ni: { l: 'Net income', u: 'm', v: v('ni'), f: 'net income' },
    sh: { l: 'Diluted shares', u: 'sh', v: v('sh'), f: 'diluted shares' },
    eps: { l: 'EPS (net income ÷ shares)', u: 'ps', v: v('eps'), f: 'net income ÷ diluted shares' },
  };
  Object.keys(lines).forEach((k) => { if (lines[k].v.every((x) => x == null)) delete lines[k]; });
  if (!lines.eps || !lines.a_ni) return null;
  const layout = [{ sec: 'Income statement' }];
  if (lines.rev) layout.push({ k: 'rev', kind: 'main', g: true });
  if (lines.ebitda) layout.push({ k: 'ebitda', g: true, cs: lines.rev ? 'rev' : null, csL: 'Margin' });
  layout.push({ k: 'a_ni', kind: 'main', g: true, cs: lines.rev ? 'rev' : null, csL: 'Margin' });
  layout.push({ sec: 'Per share' });
  if (lines.sh) layout.push({ k: 'sh', g: true });
  layout.push({ k: 'eps', kind: 'main', g: true });
  return { years: ys, lines, layout };
}
const hasHist = () => !!(D && D.hist && D.hist.length);

// ── Forward EPS on any date: the blended next twelve months ──────────────────
// Years are calendar years (MAR's fiscal year is; the estimate store re-keys any other
// fiscal year to the calendar once). A date d inside year y blends y and y+1 by the days
// left in y — the same construction as Bloomberg's BF (blended forward) EPS.
function ntmEps(dateStr) {
  if (!D || !D.years) return null;
  const d = new Date(dateStr + 'T00:00:00Z');
  const y = d.getUTCFullYear();
  const end = Date.UTC(y, 11, 31), start = Date.UTC(y - 1, 11, 31);
  const w = Math.max(0, Math.min(1, (end - d.getTime()) / (end - start)));
  const a = D.years[y] && D.years[y].eps, b = D.years[y + 1] && D.years[y + 1].eps;
  if (a == null || b == null) return null;
  return w * a + (1 - w) * b;
}
const todayStr = () => new Date().toISOString().slice(0, 10);

// ── The history and its averages ──────────────────────────────────────────────
const AVGS = [
  { k: 'x10', l: '10Y ex-COVID', t: 'Ten years, leaving out Mar 2020 – Dec 2021, when forward EPS collapsed and the P/E printed up to the 60s' },
  { k: 'a10', l: '10Y', t: 'Every day of the ten years, COVID included' },
  { k: 'a5', l: '5Y', t: 'The last five years of the history' },
  { k: 'a3', l: '3Y', t: 'The last three years of the history' },
  { k: 'pre', l: 'Pre-COVID', t: 'From the start of the history to Feb 2020' },
];
function avgOf(k) {
  if (!hasHist()) return null;
  const h = D.hist, last = h[h.length - 1][0];
  const back = (n) => String(+last.slice(0, 4) - n) + last.slice(4);
  const [c0, c1] = D.covid || ['2020-03-01', '2021-12-31'];
  const pick = {
    x10: (d) => !(d >= c0 && d <= c1),
    a10: () => true,
    a5: (d) => d >= back(5),
    a3: (d) => d >= back(3),
    pre: (d) => d < '2020-03-01',
  }[k];
  const v = h.filter(([d]) => pick(d)).map(([, p]) => p);
  if (!v.length) return null;
  return { mean: v.reduce((s, x) => s + x, 0) / v.length, min: Math.min(...v), max: Math.max(...v), n: v.length };
}
const targetMult = () => (st.target != null ? st.target : (avgOf(st.avgKey) || {}).mean);
const nowPE = () => { const e = ntmEps(todayStr()); return (st.spot != null && e) ? st.spot / e : null; };

// ── The strike ladder ─────────────────────────────────────────────────────────
const strikesListed = () => listedStrikes(st.chain);
// The band a re-rating thesis lives in: from at the money down to ~35% below.
const defaultRange = () => bandAround(strikesListed(), st.spot, 0.65, 1.0);

function scenario() {
  const eps = st.expiry ? ntmEps(st.expiry) : null;
  const m = targetMult();
  return { eps, m, price: (eps != null && m != null) ? eps * m : null };
}

function rowFor(K) {
  const c = st.chain.find((x) => x.details.strike_price === K) || null;
  const base = { K, listed: !!c, below: (st.spot != null) ? K / st.spot - 1 : null };
  if (!c) return base;
  const prem = premiumOf(c, st.premBasis);
  const days = daysTo(c.details.expiration_date);
  const sc = scenario();
  const be = (prem != null) ? K - prem : null;
  const value = (sc.price != null) ? Math.max(K - sc.price, 0) : null;
  const cost = (prem != null) ? prem * 100 : null;
  return {
    ...base, c, prem, days, be, cost,
    pe: sc.eps ? K / sc.eps : null,                       // the P/E at which the put starts to pay
    bePE: (be != null && sc.eps) ? be / sc.eps : null,     // the P/E the trade needs to break even
    beDrop: (be != null && st.spot) ? be / st.spot - 1 : null,
    value, pnl: (value != null && prem != null) ? (value - prem) * 100 : null,
    ret: (value != null && prem) ? value / prem - 1 : null,
    minPort: (cost != null && st.riskPct > 0) ? cost / st.riskPct : null,   // the smallest portfolio one contract fits
    iv: c.implied_volatility == null ? null : c.implied_volatility,
    delta: c.greeks ? c.greeks.delta : null,
    exp: c.details.expiration_date,
  };
}
const ladder = () => st.strikes.slice().sort((a, b) => b - a).map(rowFor);
const selectedRow = () => {
  const rows = ladder().filter((r) => r.listed);
  if (!rows.length) return null;
  return rows.find((r) => r.K === st.selected) || rows[0];
};

// ── Fetching ──────────────────────────────────────────────────────────────────
// A multiple takes time to come back: open on the first expiry a year or more out
// (the January LEAPS when listed) — among the expiries the EPS on file reaches, so the
// scenario has an expiry-date EPS to price (a name whose estimates stop at FY2028 cannot
// price an expiry in 2028, which needs FY2029).
function defaultExpiry(dates) {
  const priced = (D && D.kind !== 'none') ? dates.filter((d) => ntmEps(d) != null) : [];
  const pool = priced.length ? priced : dates;
  const yr = pool.filter((d) => daysTo(d) >= 365);
  const jan = yr.find((d) => d.slice(5, 7) === '01');
  return jan || yr[0] || pool[pool.length - 1];
}
const lastEpsYear = () => {
  const ys = D && D.years ? Object.keys(D.years).map(Number).filter((y) => D.years[y] && D.years[y].eps != null) : [];
  return ys.length ? Math.max(...ys) : null;
};
async function loadChain() {
  st.loading = true; st.err = null; render();
  try {
    const u = await fetchUnderlying(st.ticker);
    st.spot = u.spot; st.changePct = u.changePct; st.name = u.name || (D ? D.name : st.ticker);
    if (st.spot == null) throw new Error(`no live price for ${st.ticker}`);
    st.chain = await fetchChain(st.ticker, st.expiry, 'put', st.spot);
    if (!st.chain.length) throw new Error(`no put contracts for ${st.ticker} at ${st.expiry}`);
    const dr = defaultRange();
    if (st.rangeFrom == null) { st.rangeFrom = dr.from; st.rangeTo = dr.to; }
    if (!st.seeded) {
      st.seeded = true;
      // Seed a handful across the band rather than every listed strike.
      const inBand = strikesListed().filter((k) => k >= dr.from - 1e-9 && k <= dr.to + 1e-9);
      const n = inBand.length, pickN = Math.min(6, n);
      st.strikes = n <= 6 ? inBand : Array.from({ length: pickN }, (_, i) => inBand[Math.round(i * (n - 1) / (pickN - 1))]);
      st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
    }
  } catch (e) { st.err = e.message; st.chain = []; }
  finally { st.loading = false; render(); }
}
async function loadTicker(tk) {
  st.ticker = tk.toUpperCase();
  D = lpDataFor(st.ticker);
  st.chain = []; st.strikes = []; st.seeded = false; st.rangeFrom = null; st.rangeTo = null; st.selected = null;
  st.target = null; st.hist.win = null; st.hist.yr = null;   // a typed P/E belongs to the name it was typed for
  if (st.growth) { st.growth.win = null; st.growth.yr = null; st.growth.metric = 'rev'; }
  st.loading = true; st.err = null; render();
  st.expiries = await fetchExpiries(st.ticker);
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  st.expiry = defaultExpiry(st.expiries);
  await loadChain();
}

// ── Render: KPIs ──────────────────────────────────────────────────────────────
function renderKpis() {
  const r = selectedRow(), sc = scenario(), pe = nowPE(), a = avgOf(st.avgKey);
  const noEps = D && D.kind === 'none';
  const peSub = noEps ? (D.why || 'no EPS on file')
    : st.target != null ? `vs your ${mult(st.target)} · ${pctS(pe ? pe / st.target - 1 : null)}`
    : a ? `${(AVGS.find((x) => x.k === st.avgKey) || {}).l} average ${mult(a.mean)} · ${pctS(pe && a.mean ? pe / a.mean - 1 : null)} vs it`
    : 'no P/E history on file — type a target P/E below';
  const scSub = noEps ? 'needs EPS on file'
    : !sc.eps ? (st.expiry && lastEpsYear() ? `EPS on file ends FY${lastEpsYear()} — pick an expiry before ${lastEpsYear()}` : 'pick an expiry')
    : sc.m == null ? `NTM EPS ${px(sc.eps)} · type a target P/E`
    : `${mult(sc.m)} × NTM EPS ${px(sc.eps)} · ${pctS(sc.price && st.spot ? sc.price / st.spot - 1 : null)} vs spot`;
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Forward P/E today', mult(pe), peSub],
    [sc.m != null ? `Price at ${mult(sc.m)} on expiry` : 'Price on expiry', px(sc.price), scSub],
    ['Strike · premium', r ? `$${r.K} · ${px(r.prem)}` : '—', r ? `${pctS(r.below)} · ${r.days}d to ${r.exp} · ${st.premBasis}` : 'pick a strike'],
    ['Breakeven', r ? px(r.be) : '—', r ? `${mult(r.bePE)} on expiry EPS · ${pctS(r.beDrop)} vs spot` : '—'],
    ['If it re-rates', r ? (r.ret == null ? '—' : pctS(r.ret, 0)) : '—', r && r.pnl != null ? `${cash(r.pnl)} per contract on ${cash(r.cost)}` : '—'],
  ];
  $('lp-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');
}

// ── Render: the ladder ────────────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder(), sc = scenario();
  const nC = st.expand ? 5 : 3;
  $('lp-thead').innerHTML = `
    <tr>
      <th colspan="${nC}" class="grp">Contract
        <button type="button" class="xp" id="lp-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="3" class="grp sep">As a valuation · NTM EPS on ${esc(st.expiry || '')} ${px(sc.eps)}</th>
      <th colspan="3" class="grp sep">If the P/E goes to ${mult(sc.m)} by expiry → ${px(sc.price)}</th>
      <th class="grp sep">Size · premium = ${pct(st.riskPct, 1)} of the portfolio</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Below spot</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">P/E at strike</th><th>Breakeven</th><th>P/E at breakeven</th>
      <th class="sep">Put value</th><th>P&amp;L / contract</th><th>Return on premium</th>
      <th class="sep" title="the smallest portfolio for which one contract's premium is ${pct(st.riskPct, 1)} of it">Min. portfolio</th>
      <th class="sep" title="tick the contracts to hand to Instruments">Add</th><th title="drop this strike">Remove</th>
    </tr>`;
  const ncol = nC + 3 + 3 + 1 + 2;
  if (!rows.length) { $('lp-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`; return; }
  const selK = (selectedRow() || {}).K;
  $('lp-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="tk lft">$${r.K}</td><td colspan="${ncol - 2}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const q = quoteTip(r.c, `<b>Cost</b> ${cash(r.cost)} / contract`);
    const inScn = sc.price != null && r.K > sc.price;
    return `<tr class="${r.K === selK ? 'sel' : ''}" data-k="${r.K}">
      <td class="tk lft">$${r.K}${st.spot != null && r.K >= st.spot ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="dn">${pctS(r.below)}</td>
      <td class="big">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      ${st.expand ? `<td>${pct(r.iv, 0)}</td><td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>` : ''}
      <td class="sep">${mult(r.pe)}</td>
      <td>${px(r.be)}</td>
      <td>${mult(r.bePE)}</td>
      <td class="sep ${inScn ? 'up' : 'muted'}">${px(r.value)}</td>
      <td class="${r.pnl > 0 ? 'up' : 'dn'}">${cash(r.pnl)}</td>
      <td class="big ${r.ret > 0 ? 'up' : 'dn'}">${r.ret == null ? '—' : pctS(r.ret, 0)}</td>
      <td class="sep big">${cash(r.minPort)}<span class="ttip" data-tip="${esc(`One contract costs <b>${cash(r.cost)}</b> (${px(r.prem)} × 100). At ${pct(st.riskPct, 1)} of the portfolio that needs a portfolio of at least <b>${cash(r.minPort)}</b>; a larger one takes more contracts, one per ${cash(r.minPort)}.`)}">i</span></td>
      <td class="sep">${r.c ? `<input type="checkbox" class="pick" data-pick="${r.K}" ${selHas('lp', symbolOf(r.c, st.ticker, st.expiry, 'put', r.K)) ? 'checked' : ''}>` : '<span class="muted">—</span>'}</td>
      <td><button class="x" data-del="${r.K}" title="remove this strike">✕</button></td>
    </tr>`;
  }).join('');
  wireLadder();
  renderInstruments('lp', instOpen);
  wireInstruments();
}
function wireInstruments() {
  const el = document.getElementById('lp-instbar'); if (!el) return;
  const t = el.querySelector('[data-insttoggle]');
  if (t) t.onclick = () => { instOpen = !instOpen; renderInstruments('lp', instOpen); wireInstruments(); };
  const c = el.querySelector('[data-instclear]');
  if (c) c.onclick = () => selClear('lp');
}
function wireLadder() {
  root().querySelectorAll('[data-pick]').forEach((el) => {
    el.onclick = (ev) => ev.stopPropagation();
    el.onchange = (ev) => {
      ev.stopPropagation();
      const k = +el.dataset.pick, r = ladder().find((x) => x.K === k);
      if (!r || !r.c) return;
      selToggle('lp', { sym: symbolOf(r.c, st.ticker, st.expiry, 'put', k), ticker: st.ticker, expiry: st.expiry, type: 'put', strike: k });
    };
  });
  root().querySelectorAll('[data-del]').forEach((el) => el.onclick = (ev) => {
    ev.stopPropagation();
    const k = +el.dataset.del;
    st.strikes = st.strikes.filter((x) => x !== k);
    if (st.selected === k) st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
    render();
  });
  root().querySelectorAll('#lp-tbody tr[data-k]').forEach((tr) => tr.onclick = () => { st.selected = +tr.dataset.k; render(); });
}

function renderPicker() {
  const all = strikesListed(), free = all.filter((k) => st.strikes.indexOf(k) < 0);
  const sc = scenario();
  const near = free.length && sc.price ? free.reduce((a, b) => (Math.abs(b - sc.price) < Math.abs(a - sc.price) ? b : a)) : free[0];
  $('lp-addSel').innerHTML = free.length
    ? free.slice().reverse().map((k) => `<option value="${k}" ${k === near ? 'selected' : ''}>$${k}</option>`).join('')
    : '<option value="">all listed strikes added</option>';
  const f = $('lp-from'), t = $('lp-to');
  if (f && document.activeElement !== f) f.value = st.rangeFrom == null ? '' : st.rangeFrom;
  if (t && document.activeElement !== t) t.value = st.rangeTo == null ? '' : st.rangeTo;
  $('lp-pickinfo').textContent = all.length ? `${st.strikes.length} picked · ${all.length} listed at ${st.expiry} ($${all[0]}–$${all[all.length - 1]})` : '';
}

// ── Render: the history block ─────────────────────────────────────────────────
function histPoints() {
  const h = D.hist, n = h.length, w = st.hist.win || [0, n - 1];
  return h.slice(w[0], w[1] + 1);
}
function renderHist() {
  const box = $('lp-hist'); if (!box || !D) return;
  const pe = nowPE();
  if (!hasHist()) {
    if (_chart) { _chart.destroy(); _chart = null; }
    const e = ntmEps(todayStr());
    box.innerHTML = D.kind === 'none'
      ? `<div class="block-top"><div class="block-h">How expensive — forward P/E</div></div>
        <p class="lp-p muted">${esc(D.why || 'No EPS on file')}. The chain, the premiums, the breakevens and the sizing below are live; the valuation columns stay blank. To add the P/E, its history and the income statement, export the same two Bloomberg sheets as MAR (see the foot).</p>`
      : `<div class="block-top"><div class="block-h">How expensive — forward P/E</div>
          <span class="muted">Today (live) ${mult(pe)} on NTM EPS ${px(e)} · ${esc(D.srcLabel)}${D.asOf ? ` as of ${esc(D.asOf)}` : ''}</span></div>
        <div class="lp-avgs"><label class="lp-lbl">Revert to a P/E of <input id="lp-target" class="hnum" type="number" step="0.5" min="1" value="${st.target == null ? '' : st.target}" placeholder="—"></label>
          <span class="muted">No forward-P/E history on file for ${esc(st.ticker)}, so the multiple the thesis reverts to is yours to type. The ten-year chart and its averages appear once a Bloomberg export is added (see the foot).</span></div>`;
    return;
  }
  const avgBtns = AVGS.map((a) => `<button type="button" class="${a.k === st.avgKey && st.target == null ? 'on' : ''}" data-avg="${a.k}" title="${esc(a.t)}">${esc(a.l)} ${mult((avgOf(a.k) || {}).mean)}</button>`).join('');
  const yrs = {};
  D.hist.forEach(([d, p]) => { const y = d.slice(0, 4); (yrs[y] = yrs[y] || []).push(p); });
  const rows = Object.keys(yrs).sort().reverse().map((y) => {
    const v = yrs[y], m = v.reduce((s, x) => s + x, 0) / v.length;
    const cov = y === '2020' || y === '2021';
    return `<tr><td class="lft">${y}${cov ? ' <span class="muted">(COVID)</span>' : ''}</td><td>${mult(m)}</td><td>${mult(Math.min(...v))}</td><td>${mult(Math.max(...v))}</td><td class="muted">${v.length}</td></tr>`;
  }).join('');
  const avgRows = AVGS.map((a) => { const s = avgOf(a.k); return `<tr><td class="lft">${esc(a.l)}</td><td>${mult(s.mean)}</td><td>${mult(s.min)}</td><td>${mult(s.max)}</td><td class="muted">${s.n}</td></tr>`; }).join('');
  box.innerHTML = `
    <div class="block-top"><div class="block-h">How expensive — forward P/E against its own ten years</div>
      <span class="muted">Today (live) ${mult(pe)} · last Bloomberg print ${mult(D.hist[D.hist.length - 1][1])} on ${esc(D.hist[D.hist.length - 1][0])}</span></div>
    <div class="lp-avgs"><span class="lp-lbl">Revert to</span><div class="seg" id="lp-avgSel">${avgBtns}</div>
      <label class="lp-lbl">or type a P/E <input id="lp-target" class="hnum" type="number" step="0.5" min="1" value="${st.target == null ? '' : st.target}" placeholder="—"></label></div>
    <div class="lp-chart"><canvas id="lp-chart"></canvas></div>
    <div class="muted lp-hint">Drag sideways to zoom the dates, up or down to zoom the multiple; double-click resets. Click a line in the legend to hide it.</div>
    <div class="lp-tblwrap"><button type="button" class="ghost sm" id="lp-histTbl">${st.hist.tbl ? '▾' : '▸'} Data — yearly averages and the averages used (${Object.keys(yrs).length} years)</button>
      <div ${st.hist.tbl ? '' : 'hidden'}><table class="an-tbl lp-small"><thead><tr><th class="lft">Period</th><th>Average</th><th>Low</th><th>High</th><th>Days</th></tr></thead>
        <tbody>${avgRows}<tr><td colspan="5" class="muted lft">By year</td></tr>${rows}</tbody></table></div></div>`;
  requestAnimationFrame(buildHistChart);
}
function buildHistChart() {
  const cv = $('lp-chart'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chart) { _chart.destroy(); _chart = null; }
  const pts = histPoints();
  const labels = pts.map((p) => p[0]);
  const a = avgOf(st.avgKey), tm = targetMult(), pe = nowPE();
  const flat = (v) => labels.map(() => v);
  const ds = [
    { label: 'Forward P/E (Bloomberg, daily)', data: pts.map((p) => p[1]), borderColor: C_PE, borderWidth: 1.4, pointRadius: 0, tension: 0 },
    { label: `${st.target != null ? 'Your target' : (AVGS.find((x) => x.k === st.avgKey) || {}).l + ' average'} ${mult(tm)}`, data: flat(tm), borderColor: C_AVG, borderWidth: 1.6, borderDash: [6, 4], pointRadius: 0 },
    { label: `Today, live ${mult(pe)}`, data: labels.map((l, i) => (i === labels.length - 1 && !st.hist.win ? pe : null)), borderColor: C_NOW, backgroundColor: C_NOW, pointRadius: 5, showLine: false },
  ];
  ds.forEach((d, i) => { d.hidden = !!st.hist.hidden[i]; d.fill = false; d.spanGaps = false; });
  _chart = new Chart(cv.getContext('2d'), {
    type: 'line', data: { labels, datasets: ds },
    options: { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } },
          onClick: (e, item) => { st.hist.hidden[item.datasetIndex] = !st.hist.hidden[item.datasetIndex]; buildHistChart(); } },
        tooltip: { filter: (it) => it.raw != null, callbacks: { label: (c) => `${c.dataset.label.split(' ')[0] === 'Forward' ? 'Forward P/E' : c.dataset.label}: ${mult(c.parsed.y)}` } } },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8, autoSkip: true, callback: function (v) { const s = this.getLabelForValue(v); return s ? s.slice(0, 7) : ''; } } },
        y: { min: st.hist.yr ? st.hist.yr[0] : undefined, max: st.hist.yr ? st.hist.yr[1] : undefined, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: (v) => v + 'x' } } } },
  });
  const w0 = st.hist.win ? st.hist.win[0] : 0;
  attachBrush(cv, _chart,
    (i, j) => { st.hist.win = [w0 + i, w0 + j]; buildHistChart(); },
    (v1, v2) => { st.hist.yr = [v1, v2]; buildHistChart(); },
    () => { st.hist.win = null; st.hist.yr = null; buildHistChart(); });
}

// ── Render: the P&L of the selected strike ────────────────────────────────────
// Click a row in the ladder and this block charts that put's P&L at expiry across
// the price of the stock, with the same prices as a table under it. The x-axis is
// the price; a second axis on top reads the same price as a P/E on the expiry-date
// EPS, so "where does it pay" is a valuation as well as a price. Portal chart
// standard (CHART_ENGINE_REFERENCE §0): both axes zoom, double-click resets; the
// chips hide a marker from the chart AND its column from the table; the table sits
// in a dropdown; every number has its unit.
const P_LINE = 'rgba(30,39,51,0.92)';
const P_MARK = [
  { k: 'spot', l: 'Spot', c: '#7C8694' },
  { k: 'strike', l: 'Strike', c: '#3E5A82' },
  { k: 'be', l: 'Breakeven', c: '#B7791F' },
  { k: 'scn', l: 'Scenario', c: '#2563EB' },
];
let _pChart = null;
const pst = () => st.pnl || (st.pnl = { hidden: {}, xr: null, yr: null, tbl: true, K: null });

function pnlAt(r, S) {
  const value = Math.max(r.K - S, 0);
  return { value, pnl: (value - r.prem) * 100, ret: r.prem ? value / r.prem - 1 : null };
}
function pnlMarks(r) {
  const sc = scenario();
  return { spot: st.spot, strike: r.K, be: r.be, scn: sc.price };
}
// The price grid of the table: every 2x of P/E on the expiry-date EPS across the
// range that matters, plus the four marked prices themselves.
function pnlGrid(r) {
  const sc = scenario(), eps = sc.eps, mk = pnlMarks(r), s = pst();
  const pts = [];
  if (eps) {
    const pes = [mk.scn, mk.be, mk.strike, mk.spot].filter((v) => v != null).map((v) => v / eps);
    const lo = Math.max(2, Math.floor((Math.min(...pes) - 4) / 2) * 2), hi = Math.ceil((Math.max(...pes) + 2) / 2) * 2;
    for (let m = lo; m <= hi + 1e-9; m += 2) pts.push({ S: m * eps, key: null });
  }
  P_MARK.forEach((m) => { if (mk[m.k] != null && !s.hidden[m.k]) pts.push({ S: mk[m.k], key: m.k }); });
  const inWin = (S) => !s.xr || (S >= s.xr[0] - 1e-9 && S <= s.xr[1] + 1e-9);
  return pts.filter((p) => inWin(p.S)).sort((a, b) => a.S - b.S);
}

function pnlHead(r) {
  const s = pst(), open = s.tbl === true, n = pnlGrid(r).length;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>P&amp;L by price` +
    `<span class="rs-collap-sub">${open ? 'hide' : 'show'} · $${r.K} put, ${n} prices at expiry</span>`;
}
function pnlTable(r) {
  const grid = pnlGrid(r), eps = scenario().eps;
  if (!grid.length) return '<div class="rs-ft-cap">No price in the zoomed range — double-click the chart to reset.</div>';
  const markL = Object.fromEntries(P_MARK.map((m) => [m.k, m]));
  const td = (p, txt, cls = '') => `<td class="${p.key ? 'lp-pk' : ''}${cls}">${txt}</td>`;
  const line = (label, fn, main) => `<tr class="${main ? 'rs-ft-main' : 'rs-ft-sub'}"><td class="rs-ft-h">${label}</td>${grid.map((p) => fn(p)).join('')}</tr>`;
  return `<div class="rs-ft-cap">At expiry (${esc(r.exp)}) · US$ · per contract = 100 shares · premium ${px(r.prem)} (${esc(st.premBasis)}) · P/E on the NTM EPS of that date, ${px(eps)}</div>
    <div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Stock at expiry</th>
      ${grid.map((p) => `<th class="${p.key ? 'lp-pk' : ''}">${p.key ? `<span class="lp-pkl" style="color:${markL[p.key].c}">${esc(markL[p.key].l)}</span><br>` : ''}${px(p.S)}</th>`).join('')}
    </tr></thead><tbody>
      ${line('vs spot', (p) => td(p, pctS(st.spot ? p.S / st.spot - 1 : null)))}
      ${line('P/E on expiry EPS', (p) => td(p, mult(eps ? p.S / eps : null)))}
      ${line('Put value', (p) => td(p, px(pnlAt(r, p.S).value)))}
      ${line('P&amp;L / contract', (p) => { const v = pnlAt(r, p.S).pnl; return td(p, cash(v), Math.abs(v) < 0.5 ? '' : v > 0 ? ' up' : ' dn'); }, true)}
      ${line('Return on premium', (p) => { const v = pnlAt(r, p.S).ret; return td(p, v == null ? '—' : pctS(v, 0), v > 0 ? ' up' : v < 0 ? ' dn' : ''); })}
      ${line(`Portfolio impact (premium = ${pct(st.riskPct, 1)})`, (p) => { const v = pnlAt(r, p.S).ret; return td(p, v == null ? '—' : pctS(v * st.riskPct, 2), v > 0 ? ' up' : v < 0 ? ' dn' : ''); })}
    </tbody></table></div>`;
}
function pnlChips() {
  const s = pst();
  return `<span class="rs-leg lp-static"><span class="rs-leg-line" style="background:${P_LINE}"></span>P&amp;L / contract</span>` +
    P_MARK.map((m) => `<button type="button" class="rs-leg${s.hidden[m.k] ? ' off' : ''}" data-plg="${m.k}" title="Show / hide">` +
      `<span class="rs-leg-dash" style="color:${m.c}"></span>${esc(m.l)}</button>`).join('');
}

function renderPnl() {
  const box = $('lp-pnl'); if (!box) return;
  const r = selectedRow();
  if (!r || r.prem == null) { box.hidden = true; box.innerHTML = ''; return; }   // nothing selected: nothing drawn
  box.hidden = false;
  const s = pst();
  if (s.K !== r.K) { s.K = r.K; s.xr = null; s.yr = null; }      // a new strike drops the zoom
  const sc = scenario(), atScn = sc.price != null ? pnlAt(r, sc.price) : null;
  box.innerHTML = `
    <div class="block-top"><div class="block-h">P&amp;L at expiry — $${r.K} put, ${esc(r.exp)}, premium ${px(r.prem)}</div>
      <span class="muted">Click another strike in the table above to chart it</span></div>
    <p class="lp-p">Breakeven <b>${px(r.be)}</b> (${pctS(r.beDrop)} vs spot${r.bePE != null ? `, ${mult(r.bePE)} on expiry EPS` : ''}). The most this contract can lose is the premium, <b>${cash(r.cost)}</b>${sc.price == null ? '.' : `; at ${mult(sc.m)} the stock would be ${px(sc.price)} and the contract ${atScn ? `<b class="${atScn.pnl > 0 ? 'up' : 'dn'}">${cash(atScn.pnl)}</b> (${atScn.ret == null ? '—' : pctS(atScn.ret, 0)} on the premium)` : '—'}.`}</p>
    <div class="lp-gleg">${pnlChips()}</div>
    <div class="lp-chart lp-pchart"><canvas id="lp-pChart"></canvas></div>
    <div class="muted lp-hint">Hover to read any price on both axes: the stock price at the bottom, the same price as a P/E on the expiry-date EPS on top, the P&amp;L on the right. Drag sideways to zoom the prices, up or down to zoom the P&amp;L; double-click resets.</div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" id="lp-pTblB">${pnlHead(r)}</button>
      <div class="rs-collap-b" id="lp-pTblBody"${s.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${pnlTable(r)}</div></div>
    </div>`;
  requestAnimationFrame(buildPnlChart);
}

// The chart's own drawing: rounded pills for the markers, and a crosshair that follows
// the mouse and reads the hovered price on BOTH x-axes (bottom: the stock price; top:
// that price as a P/E on the expiry-date EPS) and the P&L on the right axis.
function pPill(ctx, x, y, text, bg, fg = '#fff', font = '700 10.5px Inter, system-ui, sans-serif') {
  ctx.font = font;
  const w = ctx.measureText(text).width + 12, h = 18;
  gRR(ctx, x - w / 2, y - h / 2, w, h, 9); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 0.5);
  return w;
}
const pMarkers = {
  id: 'pMarkers',
  beforeDatasetsDraw(chart, args, opts) {          // the marker lines sit under the P&L line
    const list = (opts && opts.list) || [], x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
    ctx.save();
    list.forEach((m) => {
      if (m.v == null || m.v < x.min || m.v > x.max) return;
      const p = x.getPixelForValue(m.v);
      ctx.strokeStyle = m.c; ctx.globalAlpha = 0.75; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(p, a.top + 2); ctx.lineTo(p, a.bottom); ctx.stroke();
    });
    ctx.restore();
  },
  afterDatasetsDraw(chart, args, opts) {           // pills on top, stepped down when two would collide
    const list = ((opts && opts.list) || []).filter((m) => m.v != null && m.v >= chart.scales.x.min && m.v <= chart.scales.x.max)
      .sort((p, q) => p.v - q.v);
    const x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx, rows = [];
    ctx.save(); ctx.font = '700 10.5px Inter, system-ui, sans-serif';
    list.forEach((m) => {
      const t = `${m.l} ${px(m.v)}`, w = ctx.measureText(t).width + 12;
      let cx = Math.min(Math.max(x.getPixelForValue(m.v), a.left + w / 2 + 2), a.right - w / 2 - 2);
      let row = 0; while (rows[row] != null && rows[row] > cx - w / 2 - 4) row++;
      rows[row] = cx + w / 2;
      pPill(ctx, cx, a.top + 12 + row * 22, t, m.c);
    });
    ctx.restore();
  },
};
const pCross = {
  id: 'pCross',
  afterEvent(chart, args) {
    const e = args.event, a = chart.chartArea;
    const inside = e.type !== 'mouseout' && e.x >= a.left && e.x <= a.right && e.y >= a.top && e.y <= a.bottom;
    const nx = inside ? e.x : null;
    if (chart.$crossX !== nx) { chart.$crossX = nx; args.changed = true; }
  },
  afterDraw(chart, args, opts) {
    const cx = chart.$crossX; if (cx == null || !opts || !opts.r) return;
    const { r, eps } = opts, x = chart.scales.x, top = chart.scales.xpe, y = chart.scales.y, a = chart.chartArea, ctx = chart.ctx;
    const S = x.getValueForPixel(cx), p = pnlAt(r, S), py = y.getPixelForValue(p.pnl);
    const col = p.pnl > 0.5 ? '#1E9E62' : p.pnl < -0.5 ? '#C0392B' : '#1E2733';
    ctx.save();
    // the crosshair: a vertical line through both axes and a horizontal one to the P&L axis
    ctx.strokeStyle = 'rgba(30,39,51,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, a.top); ctx.lineTo(cx, a.bottom); ctx.stroke();
    if (py >= a.top && py <= a.bottom) { ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(a.right, py); ctx.stroke(); }
    ctx.setLineDash([]);
    if (py >= a.top && py <= a.bottom) {
      ctx.beginPath(); ctx.arc(cx, py, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke();
    }
    // the hovered value on each axis, in a pill over the tick labels
    const clampX = (w) => Math.min(Math.max(cx, a.left + w / 2), a.right - w / 2);
    ctx.font = '700 11px Inter, system-ui, sans-serif';
    const tb = `$${S.toFixed(2)}`, tt = eps ? `${(S / eps).toFixed(1)}x` : '—';
    pPill(ctx, clampX(ctx.measureText(tb).width + 12), x.top + 11, tb, '#1E2733', '#fff', '700 11px Inter, system-ui, sans-serif');
    pPill(ctx, clampX(ctx.measureText(tt).width + 12), top.bottom - 11, tt, '#2563EB', '#fff', '700 11px Inter, system-ui, sans-serif');
    if (py >= a.top && py <= a.bottom) {
      const tp = cash(p.pnl), w = ctx.measureText(tp).width + 12;
      pPill(ctx, a.right + 4 + w / 2, py, tp, col, '#fff', '700 11px Inter, system-ui, sans-serif');
    }
    // a small card beside the cursor: what this price means for the contract
    const lines = [
      [`P&L ${cash(p.pnl)}`, col, '800 12.5px Inter, system-ui, sans-serif'],
      [`${p.ret == null ? '—' : pctS(p.ret, 0)} on the premium · ${pctS(p.ret == null ? null : p.ret * st.riskPct, 2)} of portfolio`, '#475467', '500 11px Inter, system-ui, sans-serif'],
      [`Put worth ${px(p.value)} · stock ${pctS(st.spot ? S / st.spot - 1 : null)} vs spot`, '#475467', '500 11px Inter, system-ui, sans-serif'],
    ];
    let w = 0; lines.forEach(([t, , f]) => { ctx.font = f; w = Math.max(w, ctx.measureText(t).width); });
    const cw = w + 20, ch = 16 + lines.length * 16;
    let bx = cx + 14; if (bx + cw > a.right - 4) bx = cx - 14 - cw;
    let by = (py >= a.top && py <= a.bottom ? py : (a.top + a.bottom) / 2) - ch - 10;
    if (by < a.top + 4) by = Math.min(a.bottom - ch - 4, (py || a.top) + 12);
    ctx.shadowColor = 'rgba(16,24,40,0.12)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3;
    gRR(ctx, bx, by, cw, ch, 8); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#E4E7EC'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(bx, by + 8, 3, ch - 16);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    lines.forEach(([t, c, f], i) => { ctx.font = f; ctx.fillStyle = c; ctx.fillText(t, bx + 11, by + 9 + i * 16); });
    ctx.restore();
  },
};

function buildPnlChart() {
  const cv = $('lp-pChart'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_pChart) { _pChart.destroy(); _pChart = null; }
  const r = selectedRow(); if (!r || r.prem == null) return;
  const s = pst(), mk = pnlMarks(r), eps = scenario().eps;
  const ref = [mk.spot, mk.strike, mk.be, mk.scn].filter((v) => v != null).concat(pnlGrid(r).map((p) => p.S));   // the chart spans every price in the table
  const x0 = s.xr ? s.xr[0] : Math.max(0, Math.min(...ref) * 0.97), x1 = s.xr ? s.xr[1] : Math.max(...ref) * 1.02;
  const N = 200, line = [];
  for (let i = 0; i <= N; i++) { const S = x0 + (x1 - x0) * i / N; line.push({ x: S, y: pnlAt(r, S).pnl }); }
  [r.K, r.be].forEach((S) => { if (S > x0 && S < x1) line.push({ x: S, y: pnlAt(r, S).pnl }); });   // the kink lands exactly
  line.sort((a, b) => a.x - b.x);
  const dots = pnlGrid(r).map((p) => ({ x: p.S, y: pnlAt(r, p.S).pnl }));
  const marks = P_MARK.filter((m) => !s.hidden[m.k]).map((m) => ({ ...m, v: mk[m.k] }));
  // profit / loss fills fade toward the zero line
  const grad = (ctx, area, up) => {
    if (!area) return up ? 'rgba(30,158,98,0.12)' : 'rgba(192,57,43,0.10)';
    const y0 = ctx.chart.scales.y.getPixelForValue(0);
    const g0 = ctx.chart.ctx.createLinearGradient(0, up ? area.top : area.bottom, 0, Math.min(Math.max(y0, area.top), area.bottom));
    g0.addColorStop(0, up ? 'rgba(30,158,98,0.28)' : 'rgba(192,57,43,0.22)');
    g0.addColorStop(1, up ? 'rgba(30,158,98,0.03)' : 'rgba(192,57,43,0.03)');
    return g0;
  };
  const tickFont = { family: 'Inter, system-ui, sans-serif', size: 11 }, mu = '#7C8694';
  _pChart = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { datasets: [
      { label: 'P&L / contract', data: line, borderColor: P_LINE, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 0, tension: 0,
        borderCapStyle: 'round', borderJoinStyle: 'round',
        fill: { target: { value: 0 }, above: (c) => grad(c, c.chart.chartArea, true), below: (c) => grad(c, c.chart.chartArea, false) } },
      { label: 'Table prices', data: dots, borderColor: 'rgba(30,39,51,0.55)', backgroundColor: '#fff', pointRadius: 2.5, pointHoverRadius: 2.5, pointBorderWidth: 1.2, showLine: false },
    ] },
    options: { responsive: true, maintainAspectRatio: false, animation: false, parsing: false,
      layout: { padding: { top: 2, right: 6 } },
      events: ['mousemove', 'mouseout'],
      plugins: { legend: { display: false }, tooltip: { enabled: false },
        pMarkers: { list: marks }, pCross: { r, eps } },
      scales: {
        x: { type: 'linear', min: x0, max: x1, border: { color: '#D0D5DD' },
          grid: { color: 'rgba(16,24,40,0.04)', drawTicks: false },
          afterBuildTicks: (ax) => {                     // round prices only, not the odd range ends
            const span = x1 - x0, step = [5, 10, 20, 25, 50, 100, 200].find((k) => span / k <= 10) || 500, out = [];
            for (let v = Math.ceil(x0 / step) * step; v <= x1; v += step) out.push({ value: v });
            ax.ticks = out;
          },
          ticks: { padding: 8, font: tickFont, color: mu, callback: (v) => `$${Math.round(v)}` },
          title: { display: true, text: 'STOCK PRICE AT EXPIRY', font: { ...tickFont, size: 10, weight: '700' }, color: mu, padding: { top: 6 } } },
        xpe: { type: 'linear', position: 'top', min: x0, max: x1, border: { color: '#D0D5DD' }, grid: { display: false, drawTicks: false },
          afterBuildTicks: (ax) => {                     // ticks on whole multiples, so the top axis reads 20x, 22x, 24x
            if (!eps) return;
            const m0 = Math.ceil(x0 / eps), m1 = Math.floor(x1 / eps), step = (m1 - m0) > 14 ? 4 : (m1 - m0) > 7 ? 2 : 1;
            const out = []; for (let m = Math.ceil(m0 / step) * step; m <= m1; m += step) out.push({ value: m * eps });
            ax.ticks = out;
          },
          ticks: { padding: 8, font: tickFont, color: '#2563EB', callback: (v) => (eps ? `${Math.round(v / eps)}x` : '') },
          title: { display: true, text: 'P/E ON EXPIRY-DATE EPS', font: { ...tickFont, size: 10, weight: '700' }, color: '#2563EB', padding: { bottom: 4 } } },
        y: { position: 'right', min: s.yr ? s.yr[0] : undefined, max: s.yr ? s.yr[1] : undefined, border: { display: false },
          grid: { color: (c) => (c.tick && c.tick.value === 0 ? 'rgba(30,39,51,0.55)' : 'rgba(16,24,40,0.05)'), lineWidth: (c) => (c.tick && c.tick.value === 0 ? 1.2 : 1), drawTicks: false },
          ticks: { padding: 8, font: tickFont, color: mu, maxTicksLimit: 8, callback: (v) => cash(v) } } } },
    plugins: [pMarkers, pCross],
  });
  attachBrush(cv, _pChart,
    (v1, v2) => { s.xr = [v1, v2]; setTimeout(renderPnl, 0); },
    (v1, v2) => { s.yr = [v1, v2]; setTimeout(buildPnlChart, 0); },
    () => { s.xr = null; s.yr = null; setTimeout(renderPnl, 0); });
}
function pnlClick(ev) {
  const s = pst();
  const lg = ev.target.closest('[data-plg]');
  if (lg) { const k = lg.dataset.plg; s.hidden[k] = !s.hidden[k]; renderPnl(); return true; }
  const tb = ev.target.closest('#lp-pTblB');
  if (tb) {
    s.tbl = s.tbl !== true;
    const b = $('lp-pTblBody'); if (b) b.hidden = s.tbl !== true;
    const r = selectedRow(); if (r) tb.innerHTML = pnlHead(r);
    return true;
  }
  return false;
}

// ── Render: the income statement block ────────────────────────────────────────
// One chart of any income-statement line by fiscal year (Total revenue by default), and
// the full consensus income statement under it: every line, with its growth and its
// common size / margin beneath it in small gray. Portal chart standard
// (docs/CHART_ENGINE_REFERENCE.md §0, path 3): both axes zoom and double-click resets;
// the chips hide reported or consensus years from the chart AND the table; the table
// sits in a dropdown and carries everything drawn; the metric dropdown is grouped by
// section; every number has its unit; consensus years are shaded and marked E; a
// ticker without an income statement on file renders nothing.
//
// EPS growth = (1 + net-income growth) × (1 + the share-count effect) − 1, so the
// buyback piece is what is left once net-income growth is taken out.
const G_ACT = 'rgba(30,39,51,0.92)', G_FWD = '#2563EB', G_FWD_BAR = 'rgba(37,99,235,0.78)';
let _gChart = null;
const g = () => st.growth || (st.growth = { metric: 'rev', mode: 'lvl', win: null, yr: null, hidden: {}, tbl: true });
const IS = () => (D && D.is) || null;
const isLine = (k) => IS().lines[k];
const lineOk = (k) => !!(IS() && IS().lines[k]);
const isEntry = (k) => IS().layout.find((e) => e.k === k) || {};
const isVal = (k, i) => { const l = isLine(k); return l && l.v[i] != null ? l.v[i] : null; };
function isGrowth(k, i) {
  const a = isVal(k, i - 1), b = isVal(k, i);
  if (!(i > 0 && a != null && b != null && a !== 0)) return null;
  return (a > 0) === (b > 0) ? b / a - 1 : (b - a) / Math.abs(a);   // a negative line growing more negative reads as growth
}
const isDiff = (k, i) => { const a = isVal(k, i - 1), b = isVal(k, i); return (i > 0 && a != null && b != null) ? b - a : null; };
function isCs(k, i) {
  const e = isEntry(k); if (!e.cs) return null;
  const v = isVal(k, i), d = isVal(e.cs, i);
  return (v != null && d) ? v / d : null;
}
// The share-count effect on EPS: what adj. EPS growth has over adj. net-income growth.
function isShareEff(i) {
  const gE = isGrowth('eps', i), gN = isGrowth('a_ni', i);
  return (gE != null && gN != null) ? (1 + gE) / (1 + gN) - 1 : null;
}

// Years: the index into IS().years, whether it is consensus, and the ONE predicate.
function gYearsAll() { return IS().years.map((y, i) => ({ y, i, est: y > D.lastActual })); }
const gVis = (r) => !g().hidden[r.est ? 'est' : 'act'];                       // rule 2
function gShown() {
  const all = gYearsAll(), w = g().win || [0, all.length - 1];
  return all.slice(w[0], w[1] + 1).filter(gVis);
}
const gLabel = (r) => `FY${String(r.y).slice(2)}${r.est ? 'E' : ''}`;

// Units: US$ millions, US$ per share, or millions of shares.
function gAbs(v, u) {
  if (v == null || !isFinite(v)) return '—';
  if (u === 'ps') return (v < 0 ? '−$' : '$') + Math.abs(v).toFixed(2);
  if (u === 'sh') return Math.abs(v).toFixed(1) + 'M';
  return (v < 0 ? '−' : '') + '$' + Math.round(Math.abs(v)).toLocaleString('en-US') + 'M';
}
const gDelta = (v, u) => (v == null || !isFinite(v)) ? '—' : (v >= 0 ? '+' : '−') + gAbs(Math.abs(v), u);
// The table writes millions without the unit on every cell (the caption carries it).
function gCell(v, u) {
  if (v == null || !isFinite(v)) return '—';
  if (u === 'ps') return (v < 0 ? '−' : '') + '$' + Math.abs(v).toFixed(2);
  if (u === 'sh') return v.toFixed(1);
  return (v < 0 ? '(' : '') + Math.round(Math.abs(v)).toLocaleString('en-US') + (v < 0 ? ')' : '');
}
function gModes(k) {
  const l = isLine(k), e = isEntry(k), unit = l.u === 'ps' ? 'US$' : l.u === 'sh' ? 'M sh.' : 'US$M';
  const m = [['lvl', unit], ['pct', 'Growth %'], ['amt', 'Growth $']];
  if (e.cs) m.push(['cs', e.csL]);
  return m;
}
function gVal(k, i, mode) {
  return mode === 'pct' ? isGrowth(k, i) : mode === 'amt' ? isDiff(k, i) : mode === 'cs' ? isCs(k, i) : isVal(k, i);
}
function gFmt(v, k, mode) {
  if (v == null || !isFinite(v)) return '—';
  const u = isLine(k).u;
  return mode === 'pct' || mode === 'cs' ? (mode === 'pct' ? pctS(v) : pct(v, 1)) : mode === 'amt' ? gDelta(v, u) : gAbs(v, u);
}
// Compound annual growth between the first and last year on screen (both must be positive).
function gCagr(k, rows) {
  if (rows.length < 2) return null;
  const a = isVal(k, rows[0].i), b = isVal(k, rows[rows.length - 1].i), n = rows[rows.length - 1].y - rows[0].y;
  return (a > 0 && b > 0 && n > 0) ? Math.pow(b / a, 1 / n) - 1 : null;
}
// The CAGR column runs over the life of the trade: from the current fiscal year (the first
// estimate year, FY2026 today) to the fiscal year of the selected expiry — Jan 2028 → FY2028,
// any 2029 expiry → FY2029. Capped at the last year on file; if the expiry falls inside the
// current year (or there is no expiry yet) it falls back to the years on screen.
function cagrRows(shown) {
  const all = gYearsAll(), y0 = D.lastActual + 1;
  const y1raw = st.expiry ? +st.expiry.slice(0, 4) : null;
  const y1 = y1raw == null ? null : Math.min(y1raw, all[all.length - 1].y);
  const a = all.find((r) => r.y === y0), b = y1 != null ? all.find((r) => r.y === y1) : null;
  return (a && b && b.y > a.y) ? [a, b] : shown;
}
const cagrSpan = (cr) => `${gLabel(cr[0])}→${gLabel(cr[cr.length - 1])}`;

function gHead() {
  const s = g(), rows = gShown(), open = s.tbl === true;
  const span = rows.length ? `${gLabel(rows[0])}–${gLabel(rows[rows.length - 1])}` : 'no years';
  const n = IS().layout.filter((e) => e.k).length;
  return `<span class="rs-collap-ic">${open ? '▾' : '▸'}</span>Income statement` +
    `<span class="rs-collap-sub">${open ? 'hide' : 'show'} · ${n} lines with growth and margins, ${rows.length} years (${esc(span)})</span>`;
}

function gTable() {
  const s = g(), rows = gShown(), I = IS();
  if (!rows.length) return '<div class="rs-ft-cap">No year selected — turn Reported or Bloomberg consensus back on above.</div>';
  const cr = cagrRows(rows), span = cagrSpan(cr), nc = rows.length + 2;
  const est = (r) => (r.est ? ' rs-ft-este' : '');
  const val = (r, txt) => `<td class="${est(r).trim()}${txt === '—' ? ' rs-ft-nil' : ''}">${txt}</td>`;
  const sub = (label, fn, sum = '') =>
    `<tr class="lp-is-sub"><td class="rs-ft-h">${esc(label)}</td>${rows.map((r) => `<td class="${est(r).trim()}">${fn(r)}</td>`).join('')}<td class="rs-ft-s">${sum}</td></tr>`;
  let body = '';
  I.layout.forEach((e) => {
    if (e.sec) { body += `<tr class="lp-is-sec"><td class="rs-ft-h">${esc(e.sec)}</td><td colspan="${nc - 1}"></td></tr>`; return; }
    const l = I.lines[e.k], on = e.k === s.metric;
    const c = gCagr(e.k, cr);
    body += `<tr class="${e.kind === 'main' ? 'rs-ft-main' : 'lp-is-seg'}${on ? ' lp-is-on' : ''}" data-gline="${e.k}">` +
      `<td class="rs-ft-h" title="${D.kind === 'bbg' ? 'Bloomberg field ' : ''}${esc(l.f)} — click to chart it">${esc(l.l)}</td>` +
      `${rows.map((r) => val(r, gCell(isVal(e.k, r.i), l.u))).join('')}<td class="rs-ft-s">${c == null ? '' : pctS(c)}</td></tr>`;
    if (e.g) body += sub(e.k === 'sh' ? 'Change' : 'Growth', (r) => pctS(isGrowth(e.k, r.i)));
    if (e.cs) {
      const a = isCs(e.k, cr[0].i), b = isCs(e.k, cr[cr.length - 1].i);
      const pp = (a != null && b != null) ? `${(b - a) * 100 >= 0 ? '+' : '−'}${Math.abs((b - a) * 100).toFixed(1)}pp` : '';
      body += sub(e.csL, (r) => pct(isCs(e.k, r.i), 1), pp);
    }
    if (e.k === 'eps') {
      const cE = gCagr('eps', cr), cN = gCagr('a_ni', cr);
      body += sub('Share-count effect on EPS', (r) => pctS(isShareEff(r.i)), (cE != null && cN != null) ? pctS((1 + cE) / (1 + cN) - 1) : '');
    }
  });
  return `<div class="rs-ft-cap">US$ millions unless noted · per-share lines in US$ · shares in millions · (negative) in parentheses · gray rows: growth, and common size or margin · <span class="rs-ft-e">E</span> = ${esc(D.srcLabel || 'Bloomberg consensus')} · last column = compound annual growth ${esc(span)} (margins: change in points) · click a line to chart it</div>
    <div class="rs-ft-scroll"><table class="rs-ft lp-is"><thead><tr><th class="rs-ft-h"></th>
      ${rows.map((r) => `<th class="${est(r).trim()}">FY${r.y}${r.est ? ' <span class="rs-ft-e">E</span>' : ''}</th>`).join('')}
      <th class="rs-ft-s" title="Compound annual growth from the current fiscal year to the fiscal year of the selected expiry">CAGR<br><span class="muted">${esc(span)}</span></th></tr></thead><tbody>${body}</tbody></table></div>`;
}

function gChips() {
  const s = g();
  return [['act', 'Reported', G_ACT], ['est', 'Bloomberg consensus', G_FWD_BAR]].map(([k, l, c]) =>
    `<button type="button" class="rs-leg${s.hidden[k] ? ' off' : ''}" data-glg="${k}" title="Show / hide">` +
    `<span class="ave-leg-act" style="background:${c}"></span>${esc(l)}</button>`).join('');
}

function renderGrowth() {
  const box = $('lp-growth'); if (!box) return;
  if (!D || !IS()) { box.innerHTML = ''; box.hidden = true; return; }      // rule 6
  box.hidden = false;
  const s = g(), I = IS();
  if (!I.lines[s.metric]) s.metric = 'rev';
  if (!gModes(s.metric).some(([k]) => k === s.mode)) s.mode = 'lvl';
  const all = gYearsAll();
  const f = (() => {
    // Up to four years out — fewer when the estimates stop sooner.
    const last = Math.max(...Object.keys(D.years).map(Number).filter((y) => D.years[y] && D.years[y].eps != null));
    const n = Math.min(4, last - D.lastActual);
    const a = D.years[D.lastActual], b = D.years[D.lastActual + n];
    if (!(n >= 1) || !a || !b || !(a.eps > 0 && b.eps > 0 && a.ni > 0 && b.ni > 0)) return null;
    const cE = Math.pow(b.eps / a.eps, 1 / n) - 1, cN = Math.pow(b.ni / a.ni, 1 / n) - 1;
    const ir = I.years.indexOf(D.lastActual), r0 = lineOk('rev') ? isVal('rev', ir) : null, r1 = lineOk('rev') ? isVal('rev', ir + n) : null;
    return { n, cE, cN, cS: (1 + cE) / (1 + cN) - 1, cR: (r0 && r1) ? Math.pow(r1 / r0, 1 / n) - 1 : null };
  })();
  let opts = '', open = false;
  I.layout.forEach((e) => {
    if (e.sec) { opts += `${open ? '</optgroup>' : ''}<optgroup label="${esc(e.sec)}">`; open = true; return; }
    opts += `<option value="${e.k}" ${e.k === s.metric ? 'selected' : ''}>${esc(I.lines[e.k].l)}</option>`;
  });
  if (open) opts += '</optgroup>';
  const modes = gModes(s.metric).map(([k, l]) => `<button type="button" class="${k === s.mode ? 'on' : ''}" data-gmode="${k}">${esc(l)}</button>`).join('');
  const la = all.findIndex((r) => r.y === D.lastActual);
  const pres = [['all', 'All years', null], ['fwd', `FY${String(D.lastActual).slice(2)} onward`, la >= 0 ? [la, all.length - 1] : null]]
    .filter((p) => p[0] === 'all' || p[2]);
  const winKey = !s.win ? 'all' : (pres.find((p) => p[2] && p[2][0] === s.win[0] && p[2][1] === s.win[1]) || [''])[0];
  const preBtns = pres.map(([k, l]) => `<button type="button" class="${k === winKey ? 'on' : ''}" data-gpre="${k}">${esc(l)}</button>`).join('');
  box.innerHTML = `
    <div class="block-top"><div class="block-h">How fast earnings really grow — from revenue to EPS</div>
      <span class="muted">${esc(D.srcLabel || 'Bloomberg consensus')}${D.asOf ? ` · ${esc(D.asOf)}` : ''}</span></div>
    ${f ? (() => {
      const adj = D.kind === 'bbg' ? 'adjusted ' : '', who = D.srcLabel === 'Summit DCF model' ? 'the Summit model' : 'the consensus';
      const head = `From FY${D.lastActual} to FY${D.lastActual + f.n}E ${who} has ${f.cR != null ? `revenue compounding at <b>${pct(f.cR, 1)}</b> a year and ` : ''}${adj}EPS at <b>${pct(f.cE, 1)}</b>`;
      return `<p class="lp-p">${head}${f.cS >= 0
        ? `, but ${adj}net income at only <b>${pct(f.cN, 1)}</b>: about <b>${pct(f.cS, 1)}</b> a year of the EPS growth is a falling share count (buybacks), not a growing business.`
        : ` and ${adj}net income at <b>${pct(f.cN, 1)}</b>: the share count grows, diluting EPS by about <b>${pct(-f.cS, 1)}</b> a year.`}</p>`;
    })() : ''}
    <div class="lp-gctl"><div class="lp-avgs"><span class="lp-lbl">Metric</span><select id="lp-gMetric" class="lp-gsel">${opts}</select><div class="seg">${modes}</div></div><div class="lp-avgs"><span class="lp-lbl">Range</span><div class="seg">${preBtns}</div></div></div>
    <div class="lp-gleg">${gChips()}</div>
    <div class="lp-chart"><canvas id="lp-gChart"></canvas></div>
    <div class="muted lp-hint">Drag sideways to zoom the years, up or down to zoom the values; double-click resets. Click Reported or Bloomberg consensus to hide those years from the chart and the table; click any line of the table to chart it.</div>
    <div class="rs-collap">
      <button type="button" class="rs-collap-h" id="lp-gTblB">${gHead()}</button>
      <div class="rs-collap-b" id="lp-gTblBody"${s.tbl === true ? '' : ' hidden'}><div class="rs-tablewrap">${gTable()}</div></div>
    </div>
    <div class="muted lp-hint">Bloomberg's lines as exported (Company Financial, BST consensus): expenses are expense-positive, and its comparable pre-tax line does not tie exactly to operating income less the lines between them. Total revenue includes cost reimbursements passed through from owners and franchisees, which is why reported margins are thin; the Adjusted block is the fee view, margins on revenue ex reimbursements. The share-count effect is (1 + adj. EPS growth) ÷ (1 + adj. net-income growth) − 1; consensus EPS and net income are separate Bloomberg averages, so it is approximate.</div>`;
  requestAnimationFrame(buildGrowthChart);
}

// The forecast zone: the same shaded band, dashed boundary, FORECAST pill and blue
// label bubbles as js/results.js rsFwdZone, so a consensus year reads the same here.
function gRR(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
const gFwdZone = {
  id: 'gFwdZone',
  beforeDatasetsDraw(chart, args, opts) {
    const from = opts && opts.from; if (from == null || from < 0) return;
    const x = chart.scales.x, area = chart.chartArea, ctx = chart.ctx;
    const left = from > 0 ? (x.getPixelForTick(from - 1) + x.getPixelForTick(from)) / 2 : area.left;
    ctx.save();
    ctx.fillStyle = 'rgba(37,99,235,0.07)'; ctx.fillRect(left, area.top, area.right - left, area.bottom - area.top);
    ctx.strokeStyle = 'rgba(37,99,235,0.40)'; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(left, area.top); ctx.lineTo(left, area.bottom); ctx.stroke(); ctx.setLineDash([]);
    const label = 'FORECAST', pad = 7;
    ctx.font = '700 9px Inter, system-ui, sans-serif';
    const w = ctx.measureText(label).width; let px0 = left + 8; const py = area.top + 5;
    if (px0 + w + pad * 2 > area.right - 4) px0 = area.right - w - pad * 2 - 4;
    ctx.fillStyle = 'rgba(37,99,235,0.92)'; gRR(ctx, px0, py, w + pad * 2, 15, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, px0 + pad, py + 8);
    ctx.restore();
  },
  afterDraw(chart, args, opts) {
    const from = opts && opts.from; if (from == null || from < 0) return;
    const x = chart.scales.x, ctx = chart.ctx, labels = chart.data.labels || [];
    ctx.save();
    ctx.font = '700 11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const y = x.top + 13;
    for (let i = from; i < x.ticks.length; i++) {
      const lbl = labels[i] != null ? String(labels[i]) : ''; if (!lbl) continue;
      const p = x.getPixelForTick(i), w = ctx.measureText(lbl).width;
      ctx.fillStyle = 'rgba(37,99,235,0.14)'; gRR(ctx, p - w / 2 - 7, y - 9, w + 14, 18, 9); ctx.fill();
      ctx.fillStyle = G_FWD; ctx.fillText(lbl, p, y);
    }
    ctx.restore();
  },
};

function buildGrowthChart() {
  const cv = $('lp-gChart'); if (!cv || typeof Chart === 'undefined' || !cv.offsetParent || !IS()) return;
  if (_gChart) { _gChart.destroy(); _gChart = null; }
  const s = g(), k = s.metric, rows = gShown(), l = isLine(k);
  const from = rows.findIndex((r) => r.est);
  const isPct = s.mode === 'pct' || s.mode === 'cs';
  const name = s.mode === 'lvl' ? l.l : s.mode === 'pct' ? `${l.l} growth` : s.mode === 'amt' ? `${l.l} change` : `${l.l} — ${isEntry(k).csL}`;
  _gChart = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: rows.map(gLabel), datasets: [{
      label: name, data: rows.map((r) => gVal(k, r.i, s.mode)),
      backgroundColor: rows.map((r) => (r.est ? G_FWD_BAR : G_ACT)), borderRadius: 3, maxBarThickness: 46,
    }] },
    options: { responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, gFwdZone: { from },
        tooltip: { callbacks: {
          title: (it) => { const r = rows[it[0].dataIndex]; return `FY${r.y}${r.est ? ` — ${D.srcLabel || 'Bloomberg consensus'}` : ' — reported'}`; },
          label: (c) => {
            const r = rows[c.dataIndex], out = [`${c.dataset.label}: ${gFmt(c.parsed.y, k, s.mode)}`];
            if (s.mode !== 'pct' && isGrowth(k, r.i) != null) out.push(`Growth ${pctS(isGrowth(k, r.i))}`);
            if (s.mode !== 'cs' && isEntry(k).cs && isCs(k, r.i) != null) out.push(`${isEntry(k).csL} ${pct(isCs(k, r.i), 1)}`);
            if (k === 'eps' && isShareEff(r.i) != null) out.push(`${D.kind === 'bbg' ? 'Adj. net' : 'Net'} income growth ${pctS(isGrowth('a_ni', r.i))} · share-count effect ${pctS(isShareEff(r.i))}`);
            return out;
          } } } },
      scales: {
        x: { grid: { display: false }, ticks: { callback: function (v, i) { return from >= 0 && i >= from ? '' : this.getLabelForValue(v); } } },
        y: { position: 'right', min: s.yr ? s.yr[0] : undefined, max: s.yr ? s.yr[1] : undefined,
          beginAtZero: !s.yr && s.mode === 'lvl' && l.u !== 'sh', grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { callback: (v) => isPct ? `${+(v * 100).toFixed(1)}%` : (s.mode === 'amt' ? gDelta(+v, l.u) : gAbs(+v, l.u)) } } } },
    plugins: [gFwdZone],
  });
  const all = gYearsAll(), shownYears = rows.map((r) => r.y);
  attachBrush(cv, _gChart,
    (i, j) => {
      const a = all.findIndex((r) => r.y === shownYears[i]), b = all.findIndex((r) => r.y === shownYears[j]);
      if (a >= 0 && b >= a) { s.win = [a, b]; setTimeout(renderGrowth, 0); }   // after Chart.js finishes the event
    },
    (v1, v2) => { s.yr = [v1, v2]; setTimeout(buildGrowthChart, 0); },
    () => { s.win = null; s.yr = null; setTimeout(renderGrowth, 0); });
}

// Clicks, delegated from the pane root (wireControls). The metric dropdown is a change event there.
function gClick(ev) {
  const s = g();
  const md = ev.target.closest('[data-gmode]');
  if (md) { s.mode = md.dataset.gmode; s.yr = null; renderGrowth(); return true; }
  const pr = ev.target.closest('[data-gpre]');
  if (pr) {
    const all = gYearsAll(), la = all.findIndex((r) => r.y === D.lastActual);
    s.win = pr.dataset.gpre === 'fwd' && la >= 0 ? [la, all.length - 1] : null; s.yr = null; renderGrowth(); return true;
  }
  const lg = ev.target.closest('[data-glg]');
  if (lg) { const k = lg.dataset.glg; s.hidden[k] = !s.hidden[k]; s.yr = null; renderGrowth(); return true; }
  const ln = ev.target.closest('[data-gline]');
  if (ln) { s.metric = ln.dataset.gline; s.yr = null; renderGrowth(); return true; }
  const tb = ev.target.closest('#lp-gTblB');
  if (tb) {
    s.tbl = s.tbl !== true;
    const b = $('lp-gTblBody'); if (b) b.hidden = s.tbl !== true;
    tb.innerHTML = gHead(); return true;
  }
  return false;
}

function renderFoot() {
  $('lp-foot').innerHTML = `
    <b>The thesis in numbers</b> — today's forward P/E is the <b>live</b> price ÷ the next-twelve-months consensus EPS (each fiscal year blended by the days left, as Bloomberg's BF EPS is built), so it sits on the same basis as the ten-year Bloomberg series. The <b>scenario</b> takes the average you pick (or a P/E you type) × the next-twelve-months EPS <b>on the expiry date</b>: what the market would pay then if the multiple went back to that level and the consensus were right.<br>
    <b>Contract</b> — a buyer lifts the <b>ask</b> (the default); <b>mid</b> is the fair-value view, <b>last</b> the last print. Hover the <b>i</b> for bid/ask/mid, last trade, open interest and theta. <b>+</b> opens IV and delta.<br>
    <b>As a valuation</b> — <b>P/E at strike</b> = strike ÷ expiry-date EPS: the multiple below which the put is in the money at expiry. <b>Breakeven</b> = strike − premium, and its P/E is the multiple the trade needs to get paid back.<br>
    <b>If the P/E goes to …</b> — <b>Put value</b> = strike − scenario price (zero when the scenario price is above the strike); <b>P&amp;L</b> = (value − premium) × 100; <b>Return on premium</b> = value ÷ premium − 1. At expiry only — before then the put also carries time value.<br>
    <b>Size</b> — the premium is set at ${pct(st.riskPct, 1)} of the portfolio (header); <b>Min. portfolio</b> = one contract's premium × 100 ÷ ${pct(st.riskPct, 1)}: the smallest portfolio in which one contract fits that rule. The premium is also the most the trade can lose.<br>
    <b>P&amp;L at expiry</b> — click a strike: the chart and its table give the contract's P&amp;L at each stock price on the expiry date, (max(strike − price, 0) − premium) × 100; the price grid steps every 2x of P/E on the expiry-date EPS, plus spot, strike, breakeven and the scenario. <b>Portfolio impact</b> = return on premium × ${pct(st.riskPct, 1)}.<br>
    <b>Any ticker</b> — type it in the header. A name with a Bloomberg export in js/long-put-data.js (MAR) gets the ten-year forward-P/E history, its averages and the full income statement; a name in the Derivatives estimate store (js/options-data.js) gets the live P/E, the scenario on a P/E you type and the growth split; any other optionable name gets the live chain, premiums, breakevens and sizing, with the valuation columns blank. To add the history for a name, export the same two Bloomberg sheets as MAR (Annual + Historic fwd PE).<br>
    Sources — option chain, price, IV and greeks live from Massive; ${!D || D.kind === 'none'
      ? `no EPS on file for ${esc(st.ticker)}.`
      : D.kind === 'bbg'
        ? `EPS, net income, shares and the forward-P/E history: ${esc(D.src)}; ${esc(D.histSrc)} — frozen in js/long-put-data.js, not live.`
        : `EPS, net income and shares: ${esc(D.src)} — frozen in js/options-data.js, not live.`} Nothing on this page is stored.`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!root()) return;
  if (st.loading) { $('lp-status').hidden = false; $('lp-status').textContent = `Loading ${st.ticker}…`; }
  else if (st.err) { $('lp-status').hidden = false; $('lp-status').innerHTML = `<span class="err">${esc(st.err)}</span>`; }
  else $('lp-status').hidden = true;
  $('lp-body').hidden = !!st.err || st.loading;
  syncControls();
  if (st.err || st.loading) return;
  renderKpis(); renderLadder(); renderPicker(); renderPnl(); renderHist(); renderGrowth(); renderFoot();
}
function syncControls() {
  const sel = $('lp-expiry');
  if (sel) sel.innerHTML = st.expiries.map((d) => `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('') || '<option>—</option>';
  root().querySelectorAll('#lp-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  const r = $('lp-risk'); if (r && document.activeElement !== r) r.value = +(st.riskPct * 100).toFixed(2);
  const tt = $('lp-tickers');
  // Names with a P/E history first (the full page), then the estimate store; a typed
  // ticker that is in neither still gets its own chip while it is open.
  const list = LP_TICKERS();
  if (list.indexOf(st.ticker) < 0) list.push(st.ticker);
  if (tt) tt.innerHTML = list.map((t) => `<button type="button" class="chip ${t === st.ticker ? 'on' : ''}" data-tkbtn="${esc(t)}" title="${LP_DATA[t] ? 'Bloomberg export: P/E history + income statement' : OPT_ESTIMATES[t] ? 'Estimates on file: P/E on a target you type' : 'Live chain only'}">${esc(t)}</button>`).join('');
}

function injectMarkup() {
  root().className = 'der-an';
  root().innerHTML = `
    <div class="an-wrap">
      <div class="der-head"><h2>Long Put — Betting the Multiple Comes Back</h2><span class="pill">live · Massive</span></div>
      <div class="sub">A put on a stock we think the market prices too high for how fast its earnings grow. Today's forward P/E against its own ten years, the price if it reverted by expiry, and what each strike pays in that case.</div>
      <div class="controls">
        <div class="ctl"><label>Ticker</label><input id="lp-ticker" value="${esc(st.ticker)}" size="6"></div>
        <div class="ctl"><label>Expiry</label><select id="lp-expiry"></select></div>
        <div class="ctl"><label>Premium</label><div class="seg" id="lp-premSel"><button data-prem="ask">Ask</button><button data-prem="mid">Mid</button><button data-prem="last">Last</button></div></div>
        <div class="ctl"><label>Premium, % of portfolio</label><input id="lp-risk" type="number" step="0.1" min="0" max="100"></div>
        <div class="ctl"><label>&nbsp;</label><button id="lp-refresh">↻ Refresh</button></div>
      </div>
      <div class="chips" id="lp-tickers"></div>
      <div id="lp-status" class="spin">Loading…</div>
      <div id="lp-body" hidden>
        <div class="kpis six" id="lp-kpis"></div>
        <div class="block" id="lp-hist"></div>
        <div class="card"><table id="lp-tbl" class="an-tbl"><thead id="lp-thead"></thead><tbody id="lp-tbody"></tbody></table></div>
        <div class="picker">
          <div class="ctl"><label>Add strike</label><select id="lp-addSel"></select></div>
          <button id="lp-addBtn" class="ghost sm">+ Add</button>
          <span class="divider"></span>
          <div class="ctl"><label>Range from</label><input id="lp-from" type="number" step="5"></div>
          <div class="ctl"><label>to</label><input id="lp-to" type="number" step="5"></div>
          <button id="lp-addRange" class="ghost sm">+ Add range</button>
          <button id="lp-clear" class="ghost sm">Clear all</button>
          <span class="muted" id="lp-pickinfo"></span>
        </div>
        <div class="block" id="lp-pnl" hidden></div>
        <div class="block" id="lp-growth"></div>
        ${instrumentsBar('lp')}
        <div class="foot" id="lp-foot"></div>
      </div>
    </div>`;
}

function addStrikes(list) {
  const set = new Set(st.strikes);
  list.forEach((k) => { if (isFinite(k)) set.add(k); });
  st.strikes = [...set].sort((a, b) => a - b);
  if (st.selected == null) st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
  render();
}
function wireControls() {
  const r = root();
  $('lp-refresh').onclick = () => loadChain();
  $('lp-ticker').onchange = () => { const t = ($('lp-ticker').value || '').trim().toUpperCase(); if (t && t !== st.ticker) loadTicker(t); };
  $('lp-expiry').onchange = () => { st.expiry = $('lp-expiry').value; loadChain(); };
  $('lp-addBtn').onclick = () => { const v = parseFloat($('lp-addSel').value); if (isFinite(v)) addStrikes([v]); };
  $('lp-addRange').onclick = () => {
    const a = parseFloat($('lp-from').value), b = parseFloat($('lp-to').value);
    if (!isFinite(a) || !isFinite(b)) return;
    st.rangeFrom = Math.min(a, b); st.rangeTo = Math.max(a, b);
    addStrikes(strikesListed().filter((k) => k >= st.rangeFrom - 1e-9 && k <= st.rangeTo + 1e-9));
  };
  $('lp-clear').onclick = () => { st.strikes = []; st.selected = null; render(); };
  r.addEventListener('change', (ev) => {
    const id = ev.target.id, v = parseFloat(ev.target.value);
    if (id === 'lp-risk') { st.riskPct = (isFinite(v) && v >= 0) ? v / 100 : st.riskPct; render(); }
    if (id === 'lp-gMetric') { g().metric = ev.target.value; g().yr = null; renderGrowth(); return; }
    if (id === 'lp-target') { st.target = (ev.target.value === '' || !isFinite(v) || v <= 0) ? null : v; render(); }
  });
  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#lp-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const av = ev.target.closest('#lp-avgSel button');
    if (av) { st.avgKey = av.dataset.avg; st.target = null; render(); return; }
    if (ev.target.closest('#lp-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#lp-histTbl')) { st.hist.tbl = !st.hist.tbl; renderHist(); return; }
    if (gClick(ev) || pnlClick(ev)) return;
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('lp-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); }
  });
  wireTooltip(r);
  onSelection((p) => { if (p !== 'lp') return; renderInstruments('lp', instOpen); wireInstruments(); });
}

let _inited = false;
export async function loadLongPutPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadTicker(st.ticker);
}
