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
// ./long-put-data.js with its date. Nothing is stored; every input resets on reload.

import { LP_DATA } from './long-put-data.js';
import {
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
  account: 1000000,          // the account the position is sized against
  riskPct: 0.01,             // the share of it the premium may cost
  hist: { win: null, yr: null, hidden: {}, tbl: false },
};
let instOpen = false;
let D = null;                // LP_DATA[ticker]
let _chart = null;

// ── Forward EPS on any date: the blended next twelve months ──────────────────
// The fiscal year is the calendar year (MAR); a date d inside FY y blends y and y+1 by
// the days left in y — the same construction as Bloomberg's BF (blended forward) EPS.
function ntmEps(dateStr) {
  if (!D) return null;
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
  { k: 'a5', l: '5Y', t: 'The last five years (from Nov 2021)' },
  { k: 'a3', l: '3Y', t: 'The last three years' },
  { k: 'pre', l: 'Pre-COVID', t: 'Nov 2016 – Feb 2020' },
];
function avgOf(k) {
  if (!D) return null;
  const h = D.hist, last = h[h.length - 1][0];
  const back = (n) => String(+last.slice(0, 4) - n) + last.slice(4);
  const [c0, c1] = D.covid;
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
  const budget = st.account * st.riskPct;
  const contracts = (cost > 0) ? Math.floor(budget / cost) : 0;
  return {
    ...base, c, prem, days, be, cost, contracts,
    pe: sc.eps ? K / sc.eps : null,                       // the P/E at which the put starts to pay
    bePE: (be != null && sc.eps) ? be / sc.eps : null,     // the P/E the trade needs to break even
    beDrop: (be != null && st.spot) ? be / st.spot - 1 : null,
    value, pnl: (value != null && prem != null) ? (value - prem) * 100 : null,
    ret: (value != null && prem) ? value / prem - 1 : null,
    spent: cost != null ? cost * contracts : null,
    notional: K * 100 * contracts,
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
// (the January LEAPS when listed).
function defaultExpiry(dates) {
  const yr = dates.filter((d) => daysTo(d) >= 365);
  const jan = yr.find((d) => d.slice(5, 7) === '01');
  return jan || yr[0] || dates[dates.length - 1];
}
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
  D = LP_DATA[st.ticker] || null;
  st.chain = []; st.strikes = []; st.seeded = false; st.rangeFrom = null; st.rangeTo = null; st.selected = null;
  if (!D) { st.loading = false; st.err = `${st.ticker} has no consensus and P/E history on file — this tab needs both (see the foot)`; render(); return; }
  st.loading = true; st.err = null; render();
  st.expiries = await fetchExpiries(st.ticker);
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  st.expiry = defaultExpiry(st.expiries);
  await loadChain();
}

// ── Render: KPIs ──────────────────────────────────────────────────────────────
function renderKpis() {
  const r = selectedRow(), sc = scenario(), pe = nowPE(), a = avgOf(st.avgKey);
  const lbl = st.target != null ? `your ${mult(st.target)}` : (AVGS.find((x) => x.k === st.avgKey) || {}).l;
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Forward P/E today', mult(pe), a ? `${lbl} average ${mult(a.mean)} · ${pctS(pe && a.mean ? pe / a.mean - 1 : null)} above` : '—'],
    [`Price at ${mult(sc.m)} on expiry`, px(sc.price), sc.eps ? `${mult(sc.m)} × NTM EPS ${px(sc.eps)} · ${pctS(sc.price && st.spot ? sc.price / st.spot - 1 : null)} vs spot` : 'pick an expiry'],
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
      <th colspan="3" class="grp sep">Size · premium budget ${pct(st.riskPct, 1)} of
        <input id="lp-acct" class="hnum wide" type="number" step="100000" min="0" value="${st.account}"></th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Below spot</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">P/E at strike</th><th>Breakeven</th><th>P/E at breakeven</th>
      <th class="sep">Put value</th><th>P&amp;L / contract</th><th>Return on premium</th>
      <th class="sep">Contracts</th><th>Premium paid</th><th>Notional</th>
      <th class="sep" title="tick the contracts to hand to Instruments">Add</th><th title="drop this strike">Remove</th>
    </tr>`;
  const ncol = nC + 3 + 3 + 3 + 2;
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
      <td class="sep">${r.contracts.toLocaleString()}</td>
      <td>${cash(r.spent)}</td>
      <td class="muted">${cash(r.notional)}<span class="ttip" data-tip="${esc(`<b>Notional</b> = strike × 100 × contracts — ${pct(st.account ? r.notional / st.account : null, 1)} of the account`)}">i</span></td>
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

// ── Render: the growth block ──────────────────────────────────────────────────
// EPS growth = (1 + net-income growth) × (1 + the share-count effect) − 1, so the
// buyback piece is what is left once net-income growth is taken out.
function renderGrowth() {
  const box = $('lp-growth'); if (!box || !D) return;
  const ys = Object.keys(D.years).map(Number).sort();
  const rows = ys.slice(1).map((y) => {
    const a = D.years[y - 1], b = D.years[y];
    const gE = b.eps / a.eps - 1, gN = b.ni / a.ni - 1, gS = (1 + gE) / (1 + gN) - 1;
    return { y, est: b.est, eps: b.eps, gE, gN, gS, sh: b.sh };
  });
  const span = (y0, y1) => {
    const n = y1 - y0, a = D.years[y0], b = D.years[y1];
    const cE = Math.pow(b.eps / a.eps, 1 / n) - 1, cN = Math.pow(b.ni / a.ni, 1 / n) - 1;
    return { cE, cN, cS: (1 + cE) / (1 + cN) - 1, n };
  };
  const f = span(D.lastActual, D.lastActual + 4);
  box.innerHTML = `
    <div class="block-top"><div class="block-h">How fast earnings really grow — net income vs buybacks</div>
      <span class="muted">Bloomberg consensus · ${esc(D.asOf)}</span></div>
    <p class="lp-p">From FY${D.lastActual} to FY${D.lastActual + 4}E the consensus has adjusted EPS compounding at <b>${pct(f.cE, 1)}</b> a year, but adjusted net income at <b>${pct(f.cN, 1)}</b>: about <b>${pct(f.cS, 1)}</b> a year of the EPS growth is a falling share count (buybacks), not a growing business.</p>
    <table class="an-tbl lp-small"><thead><tr><th class="lft">Year</th><th>Adj. EPS</th><th>EPS growth</th><th>Net income growth</th><th>Share-count effect</th><th>Diluted shares (M)</th></tr></thead>
      <tbody>${rows.slice().reverse().map((r) => `<tr><td class="lft">FY${r.y}${r.est ? 'E' : ''}</td><td>${px(r.eps)}</td><td>${pctS(r.gE)}</td><td>${pctS(r.gN)}</td><td>${pctS(r.gS)}</td><td>${r.sh.toFixed(1)}</td></tr>`).join('')}</tbody></table>
    <div class="muted lp-hint">EPS and net income are Bloomberg's adjusted lines; the share-count effect is what EPS growth has over net-income growth, (1 + EPS growth) ÷ (1 + net-income growth) − 1. Consensus EPS and consensus net income are separate Bloomberg averages, so the effect is approximate (it also absorbs the small mismatch between them).</div>`;
}

function renderFoot() {
  $('lp-foot').innerHTML = `
    <b>The thesis in numbers</b> — today's forward P/E is the <b>live</b> price ÷ the next-twelve-months consensus EPS (each fiscal year blended by the days left, as Bloomberg's BF EPS is built), so it sits on the same basis as the ten-year Bloomberg series. The <b>scenario</b> takes the average you pick (or a P/E you type) × the next-twelve-months EPS <b>on the expiry date</b>: what the market would pay then if the multiple went back to that level and the consensus were right.<br>
    <b>Contract</b> — a buyer lifts the <b>ask</b> (the default); <b>mid</b> is the fair-value view, <b>last</b> the last print. Hover the <b>i</b> for bid/ask/mid, last trade, open interest and theta. <b>+</b> opens IV and delta.<br>
    <b>As a valuation</b> — <b>P/E at strike</b> = strike ÷ expiry-date EPS: the multiple below which the put is in the money at expiry. <b>Breakeven</b> = strike − premium, and its P/E is the multiple the trade needs to get paid back.<br>
    <b>If the P/E goes to …</b> — <b>Put value</b> = strike − scenario price (zero when the scenario price is above the strike); <b>P&amp;L</b> = (value − premium) × 100; <b>Return on premium</b> = value ÷ premium − 1. At expiry only — before then the put also carries time value.<br>
    <b>Size</b> — the premium budget is the share of the account (header) you allow this trade to cost; <b>Contracts</b> = how many whole contracts it buys at each strike, <b>Premium paid</b> the cash that leaves the account (the most that can be lost), <b>Notional</b> = strike × 100 × contracts, what the position controls.<br>
    Sources — option chain, price, IV and greeks live from Massive; EPS, net income, shares and the forward-P/E history: ${esc(D ? D.src : '')}; ${esc(D ? D.histSrc : '')} — frozen in js/long-put-data.js, not live. Nothing on this page is stored.`;
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
  renderKpis(); renderLadder(); renderPicker(); renderHist(); renderGrowth(); renderFoot();
}
function syncControls() {
  const sel = $('lp-expiry');
  if (sel) sel.innerHTML = st.expiries.map((d) => `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('') || '<option>—</option>';
  root().querySelectorAll('#lp-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  const r = $('lp-risk'); if (r && document.activeElement !== r) r.value = (st.riskPct * 100).toFixed(1);
  const tt = $('lp-tickers');
  if (tt) tt.innerHTML = Object.keys(LP_DATA).map((t) => `<button type="button" class="chip ${t === st.ticker ? 'on' : ''}" data-tkbtn="${esc(t)}">${esc(t)}</button>`).join('');
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
        <div class="ctl"><label>Premium budget, % of account</label><input id="lp-risk" type="number" step="0.5" min="0" max="100"></div>
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
    if (id === 'lp-acct') { st.account = (isFinite(v) && v >= 0) ? v : st.account; render(); }
    if (id === 'lp-risk') { st.riskPct = (isFinite(v) && v >= 0) ? v / 100 : st.riskPct; render(); }
    if (id === 'lp-target') { st.target = (ev.target.value === '' || !isFinite(v) || v <= 0) ? null : v; render(); }
  });
  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#lp-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const av = ev.target.closest('#lp-avgSel button');
    if (av) { st.avgKey = av.dataset.avg; st.target = null; render(); return; }
    if (ev.target.closest('#lp-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#lp-histTbl')) { st.hist.tbl = !st.hist.tbl; renderHist(); return; }
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
