// Short Puts — cash-secured put analyzer. Derivatives ▸ Short Puts.
//
// The stock you WANT, getting paid to bid for it. Selling a put is a limit order
// with a fee attached: either the stock never comes to you and you keep the
// premium, or it does and you own it at a price you named. So the page answers the
// two things that decide whether the trade is any good:
//
//   1. What am I actually bidding?  Not the strike — the strike MINUS the premium
//      collected. That is the cost basis if assigned, and it is the number that
//      gets priced back into an implied P/E and EV/EBITDA. "Paid to bid Amazon at
//      11x 2027E EBITDA" is a thesis; "sold the $260 put" is not.
//   2. What does the cash earn while it waits?  Premium ÷ strike is the return on
//      the collateral a cash-secured put ties up; annualised, it is comparable to
//      anything else that cash could be doing.
//
// Assignment is the risk AND the plan, so the odds sit next to the basis rather
// than hidden in the greeks: a short put you would hate to be assigned on is a
// short put you should not have sold.
//
// The ladder is HAND-PICKED, opening on a band 2%–15% below spot and the nearest
// expiry beyond a month. Price, premium, IV and greeks are live from the Massive
// option chain; the estimates and everything shared with the other three
// strategies come from js/options-data.js and js/options-core.js.

import { OPT_ESTIMATES, OPT_DEFAULT_TICKER } from './options-data.js';
import {
  esc, px, mult, pct, pctS, cash, daysTo, rich,
  fetchExpiries, fetchUnderlying, fetchChain,
  listedStrikes, bandAround, premiumOf, quoteTip,
  estimatesFor, resolveSource, sourceSegments, estNote, yearsOf, estYearsOf, usable, yl, isFlexed, ensureFx,
  effYears, multiplesAt, renderFundBlock, yearSegments, tickerChips, wireTooltip, vintageBadge,
} from './options-core.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('sp-root');

// ── State ─────────────────────────────────────────────────────────────────────
const st = {
  ticker: 'UBER',
  expiry: null, expiries: [],
  spot: null, changePct: null, shares: null, netDebtLive: null, name: '',
  chain: [],                 // raw put contracts for the selected expiry
  loading: true, err: null,

  strikes: [], rangeFrom: null, rangeTo: null, seeded: false,

  basisYear: null,
  premBasis: 'bid',          // a seller hits the bid
  cashCommitted: 100000,     // the collateral available for this trade
  expand: false,
  showFund: true,
  estSrc: 'summit',          // 'summit' | 'consensus' — whose numbers every multiple uses
  sens: false, revG: {},

  selected: null,
};

let est = null, E = {};
const live = () => ({ shares: st.shares, netDebt: st.netDebtLive });
// The selected source, the other one (for the comparison lines), and the effective
// years after the sensitivity. Rebuilt at the top of every render.
let other = null;
function refresh() {
  st.estSrc = resolveSource(st.ticker, st.estSrc) || st.estSrc;
  est = estimatesFor(st.ticker, st.estSrc);
  E = effYears(est, st.revG);
  const alt = st.estSrc === 'summit' ? 'consensus' : 'summit';
  other = estimatesFor(st.ticker, alt);
}

// ── The strike ladder ─────────────────────────────────────────────────────────
const strikesListed = () => listedStrikes(st.chain);
// A band 2%–15% below spot: close enough that the premium is real, far enough that
// the bid is a price you would actually want to pay.
const defaultRange = () => bandAround(strikesListed(), st.spot, 0.85, 0.98);

function rowFor(K) {
  const c = st.chain.find((x) => x.details.strike_price === K) || null;
  const base = { K, listed: !!c, below: (st.spot != null) ? K / st.spot - 1 : null };
  if (!c) return base;
  const prem = premiumOf(c, st.premBasis);
  const days = daysTo(c.details.expiration_date);
  // Cash-secured: the collateral is the full purchase price the put obliges.
  const collateral = K * 100;
  const contracts = (collateral > 0) ? Math.floor(st.cashCommitted / collateral) : 0;
  // The bid you are actually making: assigned at the strike, net of the premium
  // already collected.
  const basis = (prem != null) ? K - prem : null;
  const m = multiplesAt(basis, st.basisYear, E, est, live());
  const d = c.greeks ? c.greeks.delta : null;
  return {
    ...base,
    c, prem, days, basis, collateral, contracts,
    // |delta| is the market's own rough odds of finishing in the money — of being
    // assigned. It is a risk-neutral probability, not a forecast.
    odds: (d == null) ? null : Math.min(1, Math.abs(d)),
    discount: (basis != null && st.spot) ? basis / st.spot - 1 : null,
    yield: (prem != null && K) ? prem / K : null,
    annYield: (prem != null && K && days > 0) ? (prem / K) * 365 / days : null,
    collected: (prem != null) ? prem * 100 * contracts : null,
    committed: collateral * contracts,
    iv: c.implied_volatility == null ? null : c.implied_volatility,
    delta: d,
    pe: m.pe, ev: m.ev,
    exp: c.details.expiration_date,
  };
}

// From the money down: the first row is the closest bid.
const ladder = () => st.strikes.slice().sort((a, b) => b - a).map(rowFor);

const selectedRow = () => {
  const rows = ladder().filter((r) => r.listed);
  if (!rows.length) return null;
  return rows.find((r) => r.K === st.selected) || rows[0];
};

// ── Fetching ──────────────────────────────────────────────────────────────────
// A month to a quarter is where a cash-secured put earns its keep: enough premium
// to be worth the collateral, short enough to re-price the bid often.
function defaultExpiry(dates) {
  const win = dates.filter((d) => daysTo(d) >= 30 && daysTo(d) <= 120);
  if (win.length) return win[0];
  return dates.find((d) => daysTo(d) >= 30) || dates[dates.length - 1];
}

async function loadChain() {
  st.loading = true; st.err = null; render();
  try {
    // The FX rate for a non-USD reporter is fetched alongside the quote: without it
    // multiplesAt() has nothing to convert with and every multiple would go blank.
    const [u] = await Promise.all([fetchUnderlying(st.ticker), ensureFx(est && est.currency)]);
    st.spot = u.spot; st.changePct = u.changePct;
    st.name = u.name || (est ? est.name : st.ticker);
    st.shares = u.shares; st.netDebtLive = u.netDebt;
    if (st.spot == null) throw new Error(`no live price for ${st.ticker}`);

    st.chain = await fetchChain(st.ticker, st.expiry, 'put', st.spot);
    if (!st.chain.length) throw new Error(`no put contracts for ${st.ticker} at ${st.expiry}`);

    const dr = defaultRange();
    if (st.rangeFrom == null) { st.rangeFrom = dr.from; st.rangeTo = dr.to; }
    if (!st.seeded) {
      st.seeded = true;
      st.strikes = strikesListed().filter((k) => k >= dr.from - 1e-9 && k <= dr.to + 1e-9);
      st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
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
  refresh();
  // Assignment happens within months, so the bid is judged on the nearest forward
  // year — the one the market is pricing now.
  const ys = yearsOf(est), ey = estYearsOf(est);
  st.basisYear = ey.length ? ey[0] : (ys.length ? ys[ys.length - 1] : null);
  render();
  st.expiries = await fetchExpiries(st.ticker);
  if (!st.expiries.length) { st.err = `no listed options found for ${st.ticker}`; st.loading = false; render(); return; }
  st.expiry = defaultExpiry(st.expiries);
  await loadChain();
}

// ── Render: KPIs ──────────────────────────────────────────────────────────────
function renderKpis() {
  const r = selectedRow();
  const cur = multiplesAt(st.spot, st.basisYear, E, est, live());
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Strike', r ? `$${r.K}` : '—', r ? `${pctS(r.below)} · ${r.days}d to ${r.exp}` : 'pick a strike'],
    ['Premium', r ? px(r.prem) : '—', r ? `${cash(r.prem == null ? null : r.prem * 100)} per contract · ${st.premBasis}` : '—'],
    ['Cost basis if assigned', r ? px(r.basis) : '—', r ? `${pctS(r.discount)} vs spot` : '—'],
    [`EV/EBITDA at that basis · ${yl(est, st.basisYear)}`, r ? mult(r.ev) : '—',
      cur.ev != null ? `spot is ${mult(cur.ev)}` : (usable(est) ? 'no EBITDA estimate' : (est ? `no ${est.currency}→USD rate` : 'no estimate set'))],
    ['Annualised yield', r ? pct(r.annYield, 1) : '—',
      r ? `${pct(r.yield, 2)} over ${r.days}d on collateral` : '—'],
  ];
  $('sp-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');

  const note = $('sp-note');
  if (note) {
    const msg = estNote(st.ticker, est);
    note.innerHTML = msg ? `<span class="muted">${msg}</span>` : '';
  }
}

// ── Render: the ladder ────────────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder();
  const nContract = st.expand ? 5 : 3;
  $('sp-thead').innerHTML = `
    <tr>
      <th colspan="${nContract}" class="grp">Contract
        <button type="button" class="xp" id="sp-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="5" class="grp sep">If assigned · ${esc(yl(est, st.basisYear))}</th>
      <th colspan="5" class="grp sep">Income on the cash · committing
        <input id="sp-cash" class="hnum wide" type="number" step="10000" min="0" value="${st.cashCommitted}"></th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Below spot</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">Odds</th><th>Cost basis</th><th>Discount</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">Yield</th><th>Annualised</th><th>Collateral<br>per contract</th>
      <th>Contracts</th><th>Premium<br>collected</th>
    </tr>`;

  const ncol = nContract + 5 + 5 + 1;
  if (!rows.length) {
    $('sp-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear, E, est, live());
  const selK = (selectedRow() || {}).K;
  $('sp-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="tk lft">$${r.K}</td>
        <td colspan="${ncol - 2}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const itm = st.spot != null && r.K >= st.spot;
    const q = quoteTip(r.c, `<b>Collateral</b> ${cash(r.collateral)} / contract · <b>Committed</b> ${cash(r.committed)} across ${r.contracts} contract${r.contracts === 1 ? '' : 's'}`);
    return `<tr class="${r.K === selK ? 'sel' : ''}" data-k="${r.K}">
      <td class="tk lft">$${r.K}${itm ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="dn">${pctS(r.below)}</td>
      <td class="big up">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      ${st.expand ? `<td>${pct(r.iv, 0)}</td><td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>` : ''}
      <td class="sep">${pct(r.odds, 0)}</td>
      <td class="big">${px(r.basis)}</td>
      <td class="dn">${pctS(r.discount)}</td>
      <td class="${rich(r.pe, curP.pe)}">${mult(r.pe)}</td>
      <td class="${rich(r.ev, curP.ev)}">${mult(r.ev)}</td>
      <td class="sep up">${pct(r.yield, 2)}</td>
      <td class="big up">${pct(r.annYield, 1)}</td>
      <td class="muted">${cash(r.collateral)}</td>
      <td>${r.contracts.toLocaleString()}<span class="ttip" data-tip="${esc(`<b>Committed</b> ${cash(r.committed)} of ${cash(st.cashCommitted)} · <b>Idle</b> ${cash(st.cashCommitted - r.committed)}`)}">i</span></td>
      <td class="big up">${cash(r.collected)}</td>
      <td class="sep"><button class="x" data-del="${r.K}" title="remove this strike">✕</button></td>
    </tr>`;
  }).join('');
  wireLadder();
}

function wireLadder() {
  root().querySelectorAll('[data-del]').forEach((el) => el.onclick = (ev) => {
    ev.stopPropagation();
    const k = +el.dataset.del;
    st.strikes = st.strikes.filter((x) => x !== k);
    if (st.selected === k) st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
    render();
  });
  root().querySelectorAll('#sp-tbody tr[data-k]').forEach((tr) => tr.onclick = () => {
    st.selected = +tr.dataset.k; render();
  });
}

// ── Render: the strike picker ─────────────────────────────────────────────────
function renderPicker() {
  const all = strikesListed();
  const free = all.filter((k) => st.strikes.indexOf(k) < 0);
  const below = free.filter((k) => st.spot != null && k <= st.spot);
  const dflt = below.length ? below[below.length - 1] : free[0];
  $('sp-addSel').innerHTML = free.length
    ? free.slice().reverse().map((k) => `<option value="${k}" ${k === dflt ? 'selected' : ''}>$${k}</option>`).join('')
    : '<option value="">all listed strikes added</option>';
  const f = $('sp-from'), t = $('sp-to');
  if (f && document.activeElement !== f) f.value = st.rangeFrom == null ? '' : st.rangeFrom;
  if (t && document.activeElement !== t) t.value = st.rangeTo == null ? '' : st.rangeTo;
  $('sp-pickinfo').textContent = all.length
    ? `${st.strikes.length} picked · ${all.length} listed at ${st.expiry} ($${all[0]}–$${all[all.length - 1]})`
    : '';
}

function renderFoot() {
  $('sp-foot').innerHTML = `
    <b>Contract</b> — a seller hits the <b>bid</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old. Hover the <b>i</b> for bid/ask/mid, last trade, open interest, theta, and the collateral one contract ties up. <b>+</b> opens IV and delta. Rows run from the money down, so the first is the closest bid.<br>
    <b>If assigned</b> — <b>Odds</b> is |delta|, the market's own rough probability of finishing in the money; it is a risk-neutral number, not a forecast, and it is here because assignment is the plan, not the accident. <b>Cost basis</b> = strike − premium: the price you actually pay for the shares, which is why it, and not the strike, is what the multiples are computed on. <b>Discount</b> is that basis against today's price. <span class="cheap">Green</span> = the basis prices ${esc(st.ticker)} below today's multiple, <span class="rich">red</span> = above it — a put whose "discount" still leaves you paying up is worth seeing as such.<br>
    <b>Income on the cash</b> — <b>Yield</b> = premium ÷ strike, the return on the collateral a cash-secured put ties up if the option expires worthless; <b>Annualised</b> is that × 365 ÷ days, so it can be compared with anything else the cash could earn. <b>Collateral per contract</b> = strike × 100, the full purchase price the obligation carries. The <b>cash committed</b> box in the group header is what you are willing to set aside; <b>Contracts</b> is how many whole ones that buys at each strike — hover its <b>i</b> for what is actually committed and what stays idle — and <b>Premium collected</b> is the cash received across them. A deeper strike ties up less per contract, so the same cash sells more of them.<br>
    This is the cash-secured view: no margin, and the whole strike is reserved. Price, premium, IV and greeks are live from the Massive option chain. Nothing on this page is stored — every input is in-memory and resets on reload.`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!root()) return;
  refresh();
  if (st.loading) { $('sp-status').hidden = false; $('sp-status').textContent = `Loading ${st.ticker}…`; }
  else if (st.err) { $('sp-status').hidden = false; $('sp-status').innerHTML = `<span class="err">${esc(st.err)}</span>`; }
  else $('sp-status').hidden = true;

  $('sp-body').hidden = !!st.err || st.loading;
  syncControls();
  if (st.err || st.loading) return;
  renderKpis();
  renderLadder();
  renderPicker();
  const fund = $('sp-fund');
  fund.hidden = !st.showFund;
  if (st.showFund) {
    renderFundBlock(fund, {
      prefix: 'sp', ticker: st.ticker, est: est, E: E, revG: st.revG,
      basisYear: st.basisYear, sens: st.sens,
      other: other ? other.years : null, otherLabel: other ? other.label : '',
      spotMult: multiplesAt(st.spot, st.basisYear, E, est, live()),
    });
  }
  renderFoot();
}

function syncControls() {
  const sel = $('sp-expiry');
  if (sel) {
    sel.innerHTML = st.expiries.map((d) =>
      `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('')
      || '<option>—</option>';
  }
  root().querySelectorAll('#sp-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  const sw = $('sp-srcWrap');
  // The toggle, then how old the set behind it is — a Street column six weeks
  // past an earnings print is not the Street's view, and should not look like it.
  if (sw) sw.innerHTML = sourceSegments('sp', st.ticker, st.estSrc);
  const vw = $('sp-vintage');
  if (vw) vw.innerHTML = vintageBadge(est);
  const bw = $('sp-basisWrap');
  if (bw) bw.innerHTML = yearSegments('sp', est, st.basisYear);
  const tf = $('sp-togFund');
  if (tf) tf.textContent = st.showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
  const fp = $('sp-flexpill');
  if (fp) { fp.hidden = !isFlexed(st.revG); fp.textContent = 'estimates flexed'; }
  const tt = $('sp-tickers');
  if (tt) tt.innerHTML = tickerChips(st.ticker);
}

// ── Markup ────────────────────────────────────────────────────────────────────
function injectMarkup() {
  root().className = 'der-an';
  root().innerHTML = `
    <div class="an-wrap">
      <div class="der-head">
        <h2>Short Puts — Getting Paid to Bid</h2>
        <span class="pill">live · Massive</span>
        <span class="pill flex" id="sp-flexpill" hidden></span>
      </div>
      <div class="sub">Selling a put is a limit order with a fee. This shows the bid you are really making — strike less premium — as a valuation, and what the collateral earns while it waits.</div>
      <div class="controls">
          <div class="ctl"><label>Ticker</label><input id="sp-ticker" value="${esc(st.ticker)}" size="6"></div>
          <div class="ctl"><label>Expiry</label><select id="sp-expiry"></select></div>
          <div class="ctl"><label>Estimates <span id="sp-vintage"></span></label><span id="sp-srcWrap"></span></div>
          <div class="ctl"><label>Multiple basis</label><span id="sp-basisWrap"></span></div>
          <div class="ctl"><label>Premium</label><div class="seg" id="sp-premSel">
            <button data-prem="bid">Bid</button><button data-prem="mid">Mid</button><button data-prem="ask">Ask</button></div></div>
          <div class="ctl"><label>&nbsp;</label><button id="sp-togFund" class="ghost">Hide EBITDA / NI</button></div>
          <div class="ctl"><label>&nbsp;</label><button id="sp-refresh">↻ Refresh</button></div>
      </div>
      <div class="chips" id="sp-tickers"></div>

      <div id="sp-status" class="spin">Loading…</div>
      <div id="sp-body" hidden>
        <div class="kpis six" id="sp-kpis"></div>
        <div id="sp-note"></div>

        <div class="card">
          <table id="sp-tbl" class="an-tbl"><thead id="sp-thead"></thead><tbody id="sp-tbody"></tbody></table>
        </div>

        <div class="picker">
          <div class="ctl"><label>Add strike</label><select id="sp-addSel"></select></div>
          <button id="sp-addBtn" class="ghost sm">+ Add</button>
          <span class="divider"></span>
          <div class="ctl"><label>Range from</label><input id="sp-from" type="number" step="5"></div>
          <div class="ctl"><label>to</label><input id="sp-to" type="number" step="5"></div>
          <button id="sp-addRange" class="ghost sm">+ Add range</button>
          <button id="sp-clear" class="ghost sm">Clear all</button>
          <span class="muted" id="sp-pickinfo"></span>
        </div>

        <div class="block" id="sp-fund"></div>
        <div class="foot" id="sp-foot"></div>
      </div>
    </div>`;
}

// ── Wiring ────────────────────────────────────────────────────────────────────
function addStrikes(list) {
  const set = new Set(st.strikes);
  list.forEach((k) => { if (isFinite(k)) set.add(k); });
  st.strikes = [...set].sort((a, b) => a - b);
  if (st.selected == null) st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;
  render();
}

function wireControls() {
  const r = root();

  $('sp-refresh').onclick = () => loadChain();
  $('sp-ticker').onchange = () => {
    const t = ($('sp-ticker').value || '').trim().toUpperCase();
    if (t && t !== st.ticker) loadTicker(t);
  };
  $('sp-expiry').onchange = () => { st.expiry = $('sp-expiry').value; loadChain(); };
  $('sp-togFund').onclick = () => { st.showFund = !st.showFund; render(); };

  $('sp-addBtn').onclick = () => {
    const v = parseFloat($('sp-addSel').value);
    if (isFinite(v)) addStrikes([v]);
  };
  $('sp-addRange').onclick = () => {
    const a = parseFloat($('sp-from').value), b = parseFloat($('sp-to').value);
    if (!isFinite(a) || !isFinite(b)) return;
    st.rangeFrom = Math.min(a, b); st.rangeTo = Math.max(a, b);
    addStrikes(strikesListed().filter((k) => k >= st.rangeFrom - 1e-9 && k <= st.rangeTo + 1e-9));
  };
  $('sp-clear').onclick = () => { st.strikes = []; st.selected = null; render(); };

  r.addEventListener('change', (ev) => {
    if (ev.target.id === 'sp-cash') {
      const v = parseFloat(ev.target.value);
      st.cashCommitted = (isFinite(v) && v >= 0) ? v : st.cashCommitted;
      render();
    }
    if (ev.target.dataset && ev.target.dataset.revg) {
      const y = +ev.target.dataset.revg, v = parseFloat(ev.target.value);
      if (ev.target.value === '' || !isFinite(v)) delete st.revG[y];
      else st.revG[y] = v / 100;
      render();
    }
  });

  r.addEventListener('click', (ev) => {
    const prem = ev.target.closest('#sp-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const sb = ev.target.closest('#sp-srcSel button');
    if (sb && !sb.disabled) { st.estSrc = sb.dataset.src; st.revG = {}; render(); return; }
    const yb = ev.target.closest('#sp-basisSel button');
    if (yb) { st.basisYear = +yb.dataset.year; render(); return; }
    if (ev.target.closest('#sp-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#sp-sens')) { st.sens = !st.sens; render(); return; }
    if (ev.target.closest('#sp-sensReset')) { st.revG = {}; render(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('sp-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
  });

  wireTooltip(r);
}

// ── Page loader ───────────────────────────────────────────────────────────────
let _inited = false;
export async function loadShortPutsPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadTicker(OPT_ESTIMATES[st.ticker] ? st.ticker : OPT_DEFAULT_TICKER);
}
