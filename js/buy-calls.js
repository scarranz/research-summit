// Buy Calls — long-call analyzer. Derivatives ▸ Buy Calls.
//
// The stock you WANT, paying premium for the upside. Where Covered Calls sells the
// upside on something already owned, this buys it outright, and asks two questions
// the option chain alone cannot answer:
//
//   1. What multiple am I underwriting?  A $400 strike is meaningless until it is
//      "18x 2028E EPS". Every strike and every breakeven is priced back into an
//      implied P/E and EV/EBITDA on a year picked in Multiple basis, above the table.
//   2. How big an account does one contract need?  Notional ÷ the share of the
//      account we allow a single position to control.
//
// The ladder is a HAND-PICKED list of strikes, not the whole chain — a long call is
// a considered bet on a few strikes, so they are added deliberately (a dropdown of
// what is listed, or a range) and removed one by one. The tab opens on the January
// LEAPS and on the last estimate year we hold: a valuation thesis needs the time.
//
// Price, premium, IV and greeks are live from the Massive option chain; forward
// EBITDA / net income / EPS / net debt come from js/options-data.js. Everything
// shared with the other three strategies lives in js/options-core.js.

import { OPT_ESTIMATES, OPT_DEFAULT_TICKER } from './options-data.js';
import {
  esc, px, mult, pct, pctS, cash, daysTo, rich,
  fetchExpiries, fetchUnderlying, fetchChain,
  listedStrikes, bandAround, premiumOf, quoteTip,
  estimatesFor, resolveSource, sourceSegments, estNote, yearsOf, estYearsOf, usable, yl, isFlexed, ensureFx,
  effYears, multiplesAt, renderFundBlock, yearSegments, tickerChips, wireTooltip, vintageBadge,
} from './options-core.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('bc-root');

// ── State ─────────────────────────────────────────────────────────────────────
const st = {
  ticker: OPT_DEFAULT_TICKER,
  expiry: null, expiries: [],
  spot: null, changePct: null, shares: null, netDebtLive: null, name: '',
  chain: [],                 // raw call contracts for the selected expiry
  loading: true, err: null,

  strikes: [],               // the hand-picked ladder, ascending
  rangeFrom: null, rangeTo: null,   // the "add range" inputs
  seeded: false,             // has this ticker's default range been laid down yet

  basisYear: null,           // estimate year driving every multiple (the Multiple basis control)
  premBasis: 'ask',          // 'ask' | 'mid' | 'last' — a buyer lifts the ask
  notionalBasis: 'strike',   // 'strike' | 'spot'
  exposurePct: 0.02,         // share of the account one contract's notional may be
  expand: false,             // show IV + delta inside the Contract group
  showFund: true,            // show the income-statement block
  estSrc: 'summit',          // 'summit' | 'consensus' — whose numbers every multiple uses
  sens: false,               // revenue-growth sensitivity inputs on/off
  revG: {},                  // year -> overridden revenue growth (decimal)

  selected: null,            // selected strike (drives the KPI strip)
};

// The estimate set for the current ticker, and its years after the sensitivity has
// been applied. Both are refreshed at the top of every render.
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

// The ladder a new ticker opens on: a band roughly 8%–42% out of the money, snapped
// to whatever increment the chain lists. On AppLovin at ~$319 that is exactly
// 350–450, and it stays sensible on a name whose strikes step in 20s or 50s.
const defaultRange = () => bandAround(strikesListed(), st.spot, 1.08, 1.42);

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
  const prem = premiumOf(c, st.premBasis);
  const cost = (prem != null) ? prem * 100 : null;
  const be = (prem != null) ? K + prem : null;
  const mK = multiplesAt(K, st.basisYear, E, est, live());
  const mBe = multiplesAt(be, st.basisYear, E, est, live());
  return {
    ...base,
    c, prem, be, cost,
    // What the option costs as a share of the strike it buys — the cheapness of the
    // optionality, independent of the size of the stock.
    costPct: (prem != null && K) ? prem / K : null,
    // And as a share of the account the exposure rule implies: the premium is the
    // cash actually at risk, so this is the real position size.
    costPctPort: (cost != null && base.minPort) ? cost / base.minPort : null,
    toBe: (be != null && st.spot != null) ? be / st.spot - 1 : null,
    days: daysTo(c.details.expiration_date),
    iv: c.implied_volatility == null ? null : c.implied_volatility,
    delta: c.greeks ? c.greeks.delta : null,
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

    st.chain = await fetchChain(st.ticker, st.expiry, 'call', st.spot);
    if (!st.chain.length) throw new Error(`no call contracts for ${st.ticker} at ${st.expiry}`);

    // Lay down the default ladder once per ticker; a later expiry change keeps
    // whatever the user has picked.
    const dr = defaultRange();
    if (st.rangeFrom == null) { st.rangeFrom = dr.from; st.rangeTo = dr.to; }
    if (!st.seeded) {
      st.seeded = true;
      st.strikes = strikesListed().filter((k) => k >= dr.from - 1e-9 && k <= dr.to + 1e-9);
      st.selected = st.strikes.length ? st.strikes[0] : null;
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
  // Underwrite on the LAST estimate year we hold (2028E for APP) — it is the one a
  // January LEAPS is actually a bet on.
  const ys = yearsOf(est), ey = estYearsOf(est);
  st.basisYear = ey.length ? ey[ey.length - 1] : (ys.length ? ys[ys.length - 1] : null);
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
    ['Selected strike', r ? `$${r.K}` : '—', r ? `${pctS(r.moneyness)} · ${r.days}d to ${r.exp}` : 'pick a strike'],
    ['Premium', r ? px(r.prem) : '—', r ? `${cash(r.cost)} per contract · ${st.premBasis}` : '—'],
    ['Breakeven', r ? px(r.be) : '—', r ? `${pctS(r.toBe)} from spot` : '—'],
    [`P/E at breakeven · ${yl(est, st.basisYear)}`, r ? mult(r.peBe) : '—',
      cur.pe != null ? `spot is ${mult(cur.pe)}` : (usable(est) ? 'no EPS estimate' : (est ? `no ${est.currency}→USD rate` : 'no estimate set'))],
    ['Min. portfolio', r ? cash(r.minPort) : '—',
      r ? `${cash(r.notional)} notional at ${pct(st.exposurePct, 1)}` : '—'],
  ];
  $('bc-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');

  const note = $('bc-note');
  if (note) {
    const msg = estNote(st.ticker, est);
    note.innerHTML = msg ? `<span class="muted">${msg}</span>` : '';
  }
}

// ── Render: the strike ladder ─────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder();
  const nContract = st.expand ? 5 : 3;
  $('bc-thead').innerHTML = `
    <tr>
      <th colspan="${nContract}" class="grp">Contract
        <button type="button" class="xp" id="bc-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="2" class="grp sep">At strike · ${esc(yl(est, st.basisYear))}</th>
      <th colspan="4" class="grp sep">Breakeven · ${esc(yl(est, st.basisYear))}</th>
      <th colspan="4" class="grp sep">Summary</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Moneyness</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">P/E</th><th>EV/EBITDA</th>
      <th class="sep">Breakeven</th><th>% move</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep">Exposure<br><input id="bc-expo" class="hnum" type="number" step="0.5" min="0.1" value="${(st.exposurePct * 100).toFixed(1)}"></th>
      <th>Cost %<br>of strike</th>
      <th>Cost outflow<br>% of portfolio</th>
      <th>Min.<br>portfolio</th>
    </tr>`;

  const ncol = nContract + 2 + 4 + 4 + 1;
  if (!rows.length) {
    $('bc-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear, E, est, live());
  const selK = (selectedRow() || {}).K;
  $('bc-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="tk lft">$${r.K}</td>
        <td colspan="${ncol - 2}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const itm = st.spot != null && r.K <= st.spot;
    const q = quoteTip(r.c, `<b>Cost</b> ${cash(r.cost)} / contract · <b>Notional</b> ${cash(r.notional)}`);
    return `<tr class="${r.K === selK ? 'sel' : ''}" data-k="${r.K}">
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
      <td>${pct(r.costPctPort, 2)}</td>
      <td class="big">${cash(r.minPort)}</td>
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
    if (st.selected === k) st.selected = st.strikes.length ? st.strikes[0] : null;
    render();
  });
  root().querySelectorAll('#bc-tbody tr[data-k]').forEach((tr) => tr.onclick = () => {
    st.selected = +tr.dataset.k; render();
  });
}

// ── Render: the strike picker ─────────────────────────────────────────────────
function renderPicker() {
  const all = strikesListed();
  const free = all.filter((k) => st.strikes.indexOf(k) < 0);
  // Open the menu on the nearest unpicked strike above the money — the one someone
  // reaching for this control almost always wants — rather than the deepest ITM.
  const above = free.find((k) => st.spot != null && k >= st.spot);
  const dflt = above != null ? above : free[free.length - 1];
  $('bc-addSel').innerHTML = free.length
    ? free.map((k) => `<option value="${k}" ${k === dflt ? 'selected' : ''}>$${k}</option>`).join('')
    : '<option value="">all listed strikes added</option>';
  const f = $('bc-from'), t = $('bc-to');
  if (f && document.activeElement !== f) f.value = st.rangeFrom == null ? '' : st.rangeFrom;
  if (t && document.activeElement !== t) t.value = st.rangeTo == null ? '' : st.rangeTo;
  $('bc-pickinfo').textContent = all.length
    ? `${st.strikes.length} picked · ${all.length} listed at ${st.expiry} ($${all[0]}–$${all[all.length - 1]})`
    : '';
}

function renderFoot() {
  $('bc-foot').innerHTML = `
    <b>Contract</b> — a buyer lifting the offer pays the <b>ask</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old. Hover the <b>i</b> for bid/ask/mid, last trade, open interest, theta, and the cash cost and notional of one contract. <b>+</b> opens IV and delta.<br>
    <b>At strike</b> and <b>Breakeven</b> — the multiples the company would trade at <em>at that price</em>, on the estimate year picked in <b>Multiple basis</b> above (both groups follow it). Breakeven = strike + premium, the price at expiry where the position returns the cheque; <b>% move</b> is the move from spot it needs. EV/EBITDA uses the estimate year's own net debt where the model carries one, otherwise live enterprise value − market cap. <span class="cheap">Green</span> = below today's multiple, <span class="rich">red</span> = above it.<br>
    <b>Summary</b>, read left to right as the sizing decision itself — <b>Exposure</b> is the share of the account a single contract's notional is allowed to be; set it once in the header and it applies to every row. <b>Cost % of strike</b> = premium ÷ strike, what the optionality costs relative to what it buys. <b>Cost outflow</b> is the cash that actually leaves the account for one contract (premium × 100 — hover the <b>i</b> by the premium for the amount), as a <b>% of the minimum portfolio in the next column</b>: at a ${pct(st.exposurePct, 1)} exposure limit that is the real size of the position, and the most of the account that can be lost on it. <b>Min. portfolio</b> = notional ÷ the exposure limit — the smallest account for which one contract still sits inside it, with notional = ${st.notionalBasis === 'strike' ? 'strike' : 'spot'} × 100. The two columns together are the whole trade: the outflow is what is at risk, the notional behind the minimum is what the position <em>controls</em>, and the exposure limit is a rule about the second, not the first — which is why the outflow lands at a small fraction of it.<br>
    Price, premium, IV and greeks are live from the Massive option chain. Nothing on this page is stored — every input is in-memory and resets on reload.`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!root()) return;
  refresh();
  if (st.loading) { $('bc-status').hidden = false; $('bc-status').textContent = `Loading ${st.ticker}…`; }
  else if (st.err) { $('bc-status').hidden = false; $('bc-status').innerHTML = `<span class="err">${esc(st.err)}</span>`; }
  else $('bc-status').hidden = true;

  $('bc-body').hidden = !!st.err || st.loading;
  syncControls();
  if (st.err || st.loading) return;
  renderKpis();
  renderLadder();
  renderPicker();
  const fund = $('bc-fund');
  fund.hidden = !st.showFund;
  if (st.showFund) {
    renderFundBlock(fund, {
      prefix: 'bc', ticker: st.ticker, est: est, E: E, revG: st.revG,
      basisYear: st.basisYear, sens: st.sens,
      other: other ? other.years : null, otherLabel: other ? other.label : '',
      spotMult: multiplesAt(st.spot, st.basisYear, E, est, live()),
    });
  }
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
  const sw = $('bc-srcWrap');
  // The toggle, then how old the set behind it is — a Street column six weeks
  // past an earnings print is not the Street's view, and should not look like it.
  if (sw) sw.innerHTML = sourceSegments('bc', st.ticker, st.estSrc);
  const vw = $('bc-vintage');
  if (vw) vw.innerHTML = vintageBadge(est);
  const bw = $('bc-basisWrap');
  if (bw) bw.innerHTML = yearSegments('bc', est, st.basisYear);
  const tf = $('bc-togFund');
  if (tf) tf.textContent = st.showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
  // Say it out loud when the multiples are no longer running on consensus.
  const fp = $('bc-flexpill');
  if (fp) { fp.hidden = !isFlexed(st.revG); fp.textContent = 'estimates flexed'; }
  const tt = $('bc-tickers');
  if (tt) tt.innerHTML = tickerChips(st.ticker);
}

// ── Markup ────────────────────────────────────────────────────────────────────
function injectMarkup() {
  root().className = 'der-an';
  root().innerHTML = `
    <div class="an-wrap">
      <div class="topbar">
        <h2>Buy Calls — Long Call Analyzer</h2>
        <span class="pill">live · Massive</span>
        <span class="pill flex" id="bc-flexpill" hidden></span>
      </div>
      <div class="sub">Buying a call is a bet on a price. This prices the strikes you pick, and their breakevens, back into the multiple they imply.</div>
      <div class="controls">
          <div class="ctl"><label>Ticker</label><input id="bc-ticker" value="${esc(st.ticker)}" size="6"></div>
          <div class="ctl"><label>Expiry</label><select id="bc-expiry"></select></div>
          <div class="ctl"><label>Estimates <span id="bc-vintage"></span></label><span id="bc-srcWrap"></span></div>
          <div class="ctl"><label>Multiple basis</label><span id="bc-basisWrap"></span></div>
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
        <div class="kpis six" id="bc-kpis"></div>
        <div id="bc-note"></div>

        <div class="card">
          <table id="bc-tbl" class="an-tbl"><thead id="bc-thead"></thead><tbody id="bc-tbody"></tbody></table>
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
    </div>`;
}

// ── Wiring ────────────────────────────────────────────────────────────────────
function addStrikes(list) {
  const set = new Set(st.strikes);
  list.forEach((k) => { if (isFinite(k)) set.add(k); });
  st.strikes = [...set].sort((a, b) => a - b);
  if (st.selected == null) st.selected = st.strikes.length ? st.strikes[0] : null;
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
    addStrikes(strikesListed().filter((k) => k >= st.rangeFrom - 1e-9 && k <= st.rangeTo + 1e-9));
  };
  $('bc-clear').onclick = () => { st.strikes = []; st.selected = null; render(); };

  // Delegated on the tab root, never on document. The exposure input lives inside
  // the table header, which is rewritten on every render, so it cannot be bound
  // directly.
  r.addEventListener('change', (ev) => {
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
    const sb = ev.target.closest('#bc-srcSel button');
    if (sb && !sb.disabled) { st.estSrc = sb.dataset.src; st.revG = {}; render(); return; }
    const yb = ev.target.closest('#bc-basisSel button');
    if (yb) { st.basisYear = +yb.dataset.year; render(); return; }
    const not = ev.target.closest('#bc-notSel button');
    if (not) { st.notionalBasis = not.dataset.not; render(); return; }
    if (ev.target.closest('#bc-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#bc-sens')) { st.sens = !st.sens; render(); return; }
    if (ev.target.closest('#bc-sensReset')) { st.revG = {}; render(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('bc-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
  });

  wireTooltip(r);
}

// ── Page loader ───────────────────────────────────────────────────────────────
let _inited = false;
export async function loadBuyCallsPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadTicker(OPT_ESTIMATES[OPT_DEFAULT_TICKER] ? OPT_DEFAULT_TICKER : Object.keys(OPT_ESTIMATES)[0]);
}
