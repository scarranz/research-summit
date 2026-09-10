// Protective Put — downside-insurance analyzer. Derivatives ▸ Protective Put.
//
// The stock you OWN, paying premium for a floor. It is the mirror of Covered Calls
// on the same shares: there we sell the upside and get paid, here we buy the
// downside and pay. Three questions, and the chain answers none of them on its own:
//
//   1. Where does the floor actually sit?  Not the strike — the strike MINUS the
//      premium. That is what a share is worth to you at expiry however far it
//      falls, and the % below spot is the most the protected position can lose.
//   2. What valuation am I insuring at?  A $260 floor on Amazon is a number until
//      it is "11x 2027E EBITDA" — the level where you would rather be adding than
//      hedging. Every strike is priced back into an implied P/E and EV/EBITDA.
//   3. What does the insurance cost, as a rate?  Premium ÷ spot annualised is the
//      drag the hedge puts on the position for as long as you keep rolling it.
//
// The ladder is HAND-PICKED, like Buy Calls: protection is a considered choice of a
// few strikes, not a scan of the chain. It opens on a band 3%–20% below spot and on
// the nearest expiry beyond two months — insurance nobody would actually buy (a
// week out, or 40% out of the money) is noise.
//
// Price, premium, IV and greeks are live from the Massive option chain; the
// estimates and everything else shared with the other three strategies come from
// js/options-data.js and js/options-core.js.

import { OPT_ESTIMATES, OPT_DEFAULT_TICKER } from './options-data.js';
import {
  esc, px, mult, pct, pctS, cash, daysTo, rich,
  fetchExpiries, fetchUnderlying, fetchChain,
  listedStrikes, bandAround, premiumOf, quoteTip,
  estimatesFor, resolveSource, sourceSegments, estNote, yearsOf, estYearsOf, usable, yl, isFlexed, ensureFx,
  effYears, multiplesAt, renderFundBlock, yearSegments, tickerChips, wireTooltip, vintageBadge,
} from './options-core.js';

const $ = (id) => document.getElementById(id);
const root = () => document.getElementById('pp-root');

// ── State ─────────────────────────────────────────────────────────────────────
const st = {
  ticker: 'AMZN',            // a name we own, not the long-call idea
  expiry: null, expiries: [],
  spot: null, changePct: null, shares: null, netDebtLive: null, name: '',
  chain: [],                 // raw put contracts for the selected expiry
  loading: true, err: null,

  strikes: [], rangeFrom: null, rangeTo: null, seeded: false,

  basisYear: null,           // estimate year driving every multiple (the Multiple basis control)
  premBasis: 'ask',          // a buyer of protection lifts the ask
  held: 1000,                // shares held — the position being insured
  expand: false,             // IV + delta inside the Contract group
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
// A band 3%–20% below spot: the range where protection is actually bought. Deeper
// out is a lottery ticket, at the money is a different trade.
const defaultRange = () => bandAround(strikesListed(), st.spot, 0.80, 0.97);

// Contracts are whole and each covers 100 shares, so a holding that is not a round
// lot is partly uninsured. Say so rather than round it away.
function coverage() {
  const held = st.held > 0 ? st.held : 0;
  const contracts = Math.floor(held / 100);
  const covered = contracts * 100;
  return { held, contracts, covered, share: held ? covered / held : null };
}

function rowFor(K) {
  const c = st.chain.find((x) => x.details.strike_price === K) || null;
  const base = { K, listed: !!c, below: (st.spot != null) ? K / st.spot - 1 : null };
  if (!c) return base;
  const prem = premiumOf(c, st.premBasis);
  const days = daysTo(c.details.expiration_date);
  // The floor is the strike net of what the insurance cost: below it, every further
  // dollar of decline is covered, and this is what the share is worth at expiry.
  const floor = (prem != null) ? K - prem : null;
  const cov = coverage();
  const costTotal = (prem != null) ? prem * 100 * cov.contracts : null;
  const posValue = (st.spot != null) ? st.spot * cov.held : null;
  const mK = multiplesAt(K, st.basisYear, E, est, live());
  return {
    ...base,
    c, prem, floor, days,
    // The most the protected position can lose from here.
    maxLoss: (floor != null && st.spot) ? floor / st.spot - 1 : null,
    costPct: (prem != null && st.spot) ? prem / st.spot : null,
    annCost: (prem != null && st.spot && days > 0) ? (prem / st.spot) * 365 / days : null,
    contracts: cov.contracts, costTotal, posValue,
    costPctPos: (costTotal != null && posValue) ? costTotal / posValue : null,
    // What the insured shares are guaranteed to be worth at expiry, in cash.
    floorValue: (floor != null) ? floor * cov.covered : null,
    iv: c.implied_volatility == null ? null : c.implied_volatility,
    delta: c.greeks ? c.greeks.delta : null,
    peK: mK.pe, evK: mK.ev,
    exp: c.details.expiration_date,
  };
}

// Puts read best from the money DOWN — the first row is the closest floor.
const ladder = () => st.strikes.slice().sort((a, b) => b - a).map(rowFor);

const selectedRow = () => {
  const rows = ladder().filter((r) => r.listed);
  if (!rows.length) return null;
  return rows.find((r) => r.K === st.selected) || rows[0];
};

// ── Fetching ──────────────────────────────────────────────────────────────────
// Protection is bought in months, not weeks: a put that expires before the risk
// does is not a hedge. Open on the nearest expiry at least two months out.
function defaultExpiry(dates) {
  return dates.find((d) => daysTo(d) >= 60) || dates[dates.length - 1];
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
      st.selected = st.strikes.length ? st.strikes[st.strikes.length - 1] : null;  // nearest the money
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
  // Insure against the NEAREST forward year: a three-to-nine-month put is a bet on
  // the multiple the market is paying now, not on 2028.
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
  const cov = coverage();
  const cur = multiplesAt(st.spot, st.basisYear, E, est, live());
  const posValue = (st.spot != null) ? st.spot * cov.held : null;
  const cells = [
    ['Spot', px(st.spot), st.changePct != null ? `${pctS(st.changePct)} today` : esc(st.ticker)],
    ['Strike', r ? `$${r.K}` : '—', r ? `${pctS(r.below)} · ${r.days}d to ${r.exp}` : 'pick a strike'],
    ['Floor', r ? px(r.floor) : '—', r ? `strike − ${px(r.prem)} premium` : '—'],
    ['Max loss', r ? pctS(r.maxLoss) : '—', 'from spot, however far it falls'],
    [`EV/EBITDA at the strike · ${yl(est, st.basisYear)}`, r ? mult(r.evK) : '—',
      cur.ev != null ? `spot is ${mult(cur.ev)}` : (usable(est) ? 'no EBITDA estimate' : (est ? `no ${est.currency}→USD rate` : 'no estimate set'))],
    ['Cost of the hedge', r ? cash(r.costTotal) : '—',
      r ? `${pct(r.costPctPos, 2)} of ${cash(posValue)} · ${pct(r.annCost, 1)} annualised` : '—'],
  ];
  $('pp-kpis').innerHTML = cells.map(([l, v, s]) =>
    `<div class="kpi"><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('');

  const note = $('pp-note');
  if (note) {
    const parts = [];
    const msg = estNote(st.ticker, est);
    if (msg) parts.push(msg);
    if (cov.share != null && cov.share < 1) parts.push(`${cov.contracts} contract${cov.contracts === 1 ? '' : 's'} cover ${cov.covered.toLocaleString()} of ${cov.held.toLocaleString()} shares — ${pct(1 - cov.share, 1)} of the position stays unhedged.`);
    note.innerHTML = parts.length ? `<span class="muted">${parts.join(' ')}</span>` : '';
  }
}

// ── Render: the ladder ────────────────────────────────────────────────────────
function renderLadder() {
  const rows = ladder();
  const nContract = st.expand ? 5 : 3;
  $('pp-thead').innerHTML = `
    <tr>
      <th colspan="${nContract}" class="grp">Contract
        <button type="button" class="xp" id="pp-expand" title="${st.expand ? 'hide IV and delta' : 'show IV and delta'}">${st.expand ? '−' : '+'}</button></th>
      <th colspan="2" class="grp sep">Protection</th>
      <th colspan="2" class="grp sep">Insuring at · ${esc(yl(est, st.basisYear))}</th>
      <th colspan="5" class="grp sep">Cost of the hedge · on
        <input id="pp-held" class="hnum wide" type="number" step="100" min="0" value="${st.held}"> shares</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="lft">Strike</th><th>Below spot</th><th>Premium</th>${st.expand ? '<th>IV</th><th>Delta</th>' : ''}
      <th class="sep">Floor</th><th>Max loss</th>
      <th class="sep">P/E</th><th>EV/EBITDA</th>
      <th class="sep">% of spot</th><th>Annualised</th>
      <th>Contracts</th><th>Total cost</th><th>Floor value</th>
    </tr>`;

  const ncol = nContract + 2 + 2 + 5 + 1;
  if (!rows.length) {
    $('pp-tbody').innerHTML = `<tr><td colspan="${ncol}" class="muted">no strikes picked yet — add them below.</td></tr>`;
    return;
  }
  const curP = multiplesAt(st.spot, st.basisYear, E, est, live());
  const selK = (selectedRow() || {}).K;
  $('pp-tbody').innerHTML = rows.map((r) => {
    if (!r.listed) {
      return `<tr data-k="${r.K}"><td class="tk lft">$${r.K}</td>
        <td colspan="${ncol - 2}" class="muted">not listed at ${esc(st.expiry || '')}</td>
        <td class="sep"><button class="x" data-del="${r.K}" title="remove">✕</button></td></tr>`;
    }
    const itm = st.spot != null && r.K >= st.spot;
    const q = quoteTip(r.c, `<b>Premium</b> ${cash(r.prem == null ? null : r.prem * 100)} / contract · <b>Covers</b> ${cash(r.K * 100)} at the strike`);
    return `<tr class="${r.K === selK ? 'sel' : ''}" data-k="${r.K}">
      <td class="tk lft">$${r.K}${itm ? ' <span class="tag">ITM</span>' : ''}</td>
      <td class="dn">${pctS(r.below)}</td>
      <td class="big">${px(r.prem)}<span class="ttip" data-tip="${esc(q)}">i</span></td>
      ${st.expand ? `<td>${pct(r.iv, 0)}</td><td>${r.delta == null ? '—' : r.delta.toFixed(2)}</td>` : ''}
      <td class="sep big">${px(r.floor)}</td>
      <td class="dn">${pctS(r.maxLoss)}</td>
      <td class="sep ${rich(r.peK, curP.pe)}">${mult(r.peK)}</td>
      <td class="${rich(r.evK, curP.ev)}">${mult(r.evK)}</td>
      <td class="sep">${pct(r.costPct, 2)}</td>
      <td class="big">${pct(r.annCost, 1)}</td>
      <td class="muted">${r.contracts.toLocaleString()}</td>
      <td>${cash(r.costTotal)}</td>
      <td class="big">${cash(r.floorValue)}</td>
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
  root().querySelectorAll('#pp-tbody tr[data-k]').forEach((tr) => tr.onclick = () => {
    st.selected = +tr.dataset.k; render();
  });
}

// ── Render: the strike picker ─────────────────────────────────────────────────
function renderPicker() {
  const all = strikesListed();
  const free = all.filter((k) => st.strikes.indexOf(k) < 0);
  // Open the menu on the nearest unpicked strike BELOW the money — the next floor
  // down is what someone reaching for this control wants.
  const below = free.filter((k) => st.spot != null && k <= st.spot);
  const dflt = below.length ? below[below.length - 1] : free[0];
  $('pp-addSel').innerHTML = free.length
    ? free.slice().reverse().map((k) => `<option value="${k}" ${k === dflt ? 'selected' : ''}>$${k}</option>`).join('')
    : '<option value="">all listed strikes added</option>';
  const f = $('pp-from'), t = $('pp-to');
  if (f && document.activeElement !== f) f.value = st.rangeFrom == null ? '' : st.rangeFrom;
  if (t && document.activeElement !== t) t.value = st.rangeTo == null ? '' : st.rangeTo;
  $('pp-pickinfo').textContent = all.length
    ? `${st.strikes.length} picked · ${all.length} listed at ${st.expiry} ($${all[0]}–$${all[all.length - 1]})`
    : '';
}

function renderFoot() {
  const cov = coverage();
  $('pp-foot').innerHTML = `
    <b>Contract</b> — a buyer of protection lifts the <b>ask</b> (the default); <b>mid</b> is the fair-value view and <b>last</b> is the last print, which on an illiquid strike can be hours old. Hover the <b>i</b> for bid/ask/mid, last trade, open interest and theta. <b>+</b> opens IV and delta. Rows run from the money down, so the first is the nearest floor.<br>
    <b>Protection</b> — <b>Floor</b> = strike − premium, what a share is worth to you at expiry however far it falls; the strike alone overstates it by exactly what the insurance cost. <b>Max loss</b> = floor ÷ spot − 1, the most the protected position can lose from here. Everything between spot and the strike is the deductible you still eat — that is the <b>Below spot</b> column.<br>
    <b>Insuring at</b> — the multiples ${esc(st.ticker)} would trade at <em>at the strike</em>, on the estimate year picked in <b>Multiple basis</b> above. This is the question behind the hedge: <span class="cheap">green</span> means the floor sits below today's multiple, at a valuation you might rather be adding at than insuring; <span class="rich">red</span> means you are paying to protect a price the market already calls expensive. It is a fact about where the floor sits, not a verdict on the trade.<br>
    <b>Cost of the hedge</b> — <b>% of spot</b> is the premium relative to the share it insures, and <b>Annualised</b> is that rate × 365 ÷ days to expiry: the drag on the position for as long as you keep rolling it. The <b>shares held</b> box in the group header is the position being insured; set it once and every row follows. Contracts are whole and cover 100 shares each, so ${cov.held.toLocaleString()} shares means ${cov.contracts.toLocaleString()} contract${cov.contracts === 1 ? '' : 's'} over ${cov.covered.toLocaleString()} shares${cov.share != null && cov.share < 1 ? ` — the remaining ${pct(1 - cov.share, 1)} is unhedged` : ''}. <b>Total cost</b> is the premium across them, and <b>Floor value</b> = floor × insured shares: what those shares are guaranteed to be worth at expiry, against the ${cash(st.spot == null ? null : st.spot * cov.held)} the position is worth today.<br>
    Price, premium, IV and greeks are live from the Massive option chain. Nothing on this page is stored — every input is in-memory and resets on reload.`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  if (!root()) return;
  refresh();
  if (st.loading) { $('pp-status').hidden = false; $('pp-status').textContent = `Loading ${st.ticker}…`; }
  else if (st.err) { $('pp-status').hidden = false; $('pp-status').innerHTML = `<span class="err">${esc(st.err)}</span>`; }
  else $('pp-status').hidden = true;

  $('pp-body').hidden = !!st.err || st.loading;
  syncControls();
  if (st.err || st.loading) return;
  renderKpis();
  renderLadder();
  renderPicker();
  const fund = $('pp-fund');
  fund.hidden = !st.showFund;
  if (st.showFund) {
    renderFundBlock(fund, {
      prefix: 'pp', ticker: st.ticker, est: est, E: E, revG: st.revG,
      basisYear: st.basisYear, sens: st.sens,
      other: other ? other.years : null, otherLabel: other ? other.label : '',
      spotMult: multiplesAt(st.spot, st.basisYear, E, est, live()),
    });
  }
  renderFoot();
}

function syncControls() {
  const sel = $('pp-expiry');
  if (sel) {
    sel.innerHTML = st.expiries.map((d) =>
      `<option value="${esc(d)}" ${d === st.expiry ? 'selected' : ''}>${esc(d)} · ${daysTo(d)}d</option>`).join('')
      || '<option>—</option>';
  }
  root().querySelectorAll('#pp-premSel button').forEach((b) => b.classList.toggle('on', b.dataset.prem === st.premBasis));
  const sw = $('pp-srcWrap');
  // The toggle, then how old the set behind it is — a Street column six weeks
  // past an earnings print is not the Street's view, and should not look like it.
  if (sw) sw.innerHTML = sourceSegments('pp', st.ticker, st.estSrc);
  const vw = $('pp-vintage');
  if (vw) vw.innerHTML = vintageBadge(est);
  const bw = $('pp-basisWrap');
  if (bw) bw.innerHTML = yearSegments('pp', est, st.basisYear);
  const tf = $('pp-togFund');
  if (tf) tf.textContent = st.showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
  const fp = $('pp-flexpill');
  if (fp) { fp.hidden = !isFlexed(st.revG); fp.textContent = 'estimates flexed'; }
  const tt = $('pp-tickers');
  if (tt) tt.innerHTML = tickerChips(st.ticker);
}

// ── Markup ────────────────────────────────────────────────────────────────────
function injectMarkup() {
  root().className = 'der-an';
  root().innerHTML = `
    <div class="an-wrap">
      <div class="der-head">
        <h2>Protective Put — Downside Insurance</h2>
        <span class="pill">live · Massive</span>
        <span class="pill flex" id="pp-flexpill" hidden></span>
      </div>
      <div class="sub">A put on stock you own is insurance with a deductible. This shows where the floor really sits, what valuation you are insuring at, and what the cover costs as a rate.</div>
      <div class="controls">
          <div class="ctl"><label>Ticker</label><input id="pp-ticker" value="${esc(st.ticker)}" size="6"></div>
          <div class="ctl"><label>Expiry</label><select id="pp-expiry"></select></div>
          <div class="ctl"><label>Estimates <span id="pp-vintage"></span></label><span id="pp-srcWrap"></span></div>
          <div class="ctl"><label>Multiple basis</label><span id="pp-basisWrap"></span></div>
          <div class="ctl"><label>Premium</label><div class="seg" id="pp-premSel">
            <button data-prem="ask">Ask</button><button data-prem="mid">Mid</button><button data-prem="last">Last</button></div></div>
          <div class="ctl"><label>&nbsp;</label><button id="pp-togFund" class="ghost">Hide EBITDA / NI</button></div>
          <div class="ctl"><label>&nbsp;</label><button id="pp-refresh">↻ Refresh</button></div>
      </div>
      <div class="chips" id="pp-tickers"></div>

      <div id="pp-status" class="spin">Loading…</div>
      <div id="pp-body" hidden>
        <div class="kpis six" id="pp-kpis"></div>
        <div id="pp-note"></div>

        <div class="card">
          <table id="pp-tbl" class="an-tbl"><thead id="pp-thead"></thead><tbody id="pp-tbody"></tbody></table>
        </div>

        <div class="picker">
          <div class="ctl"><label>Add strike</label><select id="pp-addSel"></select></div>
          <button id="pp-addBtn" class="ghost sm">+ Add</button>
          <span class="divider"></span>
          <div class="ctl"><label>Range from</label><input id="pp-from" type="number" step="5"></div>
          <div class="ctl"><label>to</label><input id="pp-to" type="number" step="5"></div>
          <button id="pp-addRange" class="ghost sm">+ Add range</button>
          <button id="pp-clear" class="ghost sm">Clear all</button>
          <span class="muted" id="pp-pickinfo"></span>
        </div>

        <div class="block" id="pp-fund"></div>
        <div class="foot" id="pp-foot"></div>
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

  $('pp-refresh').onclick = () => loadChain();
  $('pp-ticker').onchange = () => {
    const t = ($('pp-ticker').value || '').trim().toUpperCase();
    if (t && t !== st.ticker) loadTicker(t);
  };
  $('pp-expiry').onchange = () => { st.expiry = $('pp-expiry').value; loadChain(); };
  $('pp-togFund').onclick = () => { st.showFund = !st.showFund; render(); };

  $('pp-addBtn').onclick = () => {
    const v = parseFloat($('pp-addSel').value);
    if (isFinite(v)) addStrikes([v]);
  };
  $('pp-addRange').onclick = () => {
    const a = parseFloat($('pp-from').value), b = parseFloat($('pp-to').value);
    if (!isFinite(a) || !isFinite(b)) return;
    st.rangeFrom = Math.min(a, b); st.rangeTo = Math.max(a, b);
    addStrikes(strikesListed().filter((k) => k >= st.rangeFrom - 1e-9 && k <= st.rangeTo + 1e-9));
  };
  $('pp-clear').onclick = () => { st.strikes = []; st.selected = null; render(); };

  // Delegated on the tab root: the shares-held input lives inside
  // the table header, which is rewritten on every render.
  r.addEventListener('change', (ev) => {
    if (ev.target.id === 'pp-held') {
      const v = parseFloat(ev.target.value);
      st.held = (isFinite(v) && v >= 0) ? Math.round(v) : st.held;
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
    const prem = ev.target.closest('#pp-premSel button');
    if (prem) { st.premBasis = prem.dataset.prem; render(); return; }
    const sb = ev.target.closest('#pp-srcSel button');
    if (sb && !sb.disabled) { st.estSrc = sb.dataset.src; st.revG = {}; render(); return; }
    const yb = ev.target.closest('#pp-basisSel button');
    if (yb) { st.basisYear = +yb.dataset.year; render(); return; }
    if (ev.target.closest('#pp-expand')) { st.expand = !st.expand; render(); return; }
    if (ev.target.closest('#pp-sens')) { st.sens = !st.sens; render(); return; }
    if (ev.target.closest('#pp-sensReset')) { st.revG = {}; render(); return; }
    const tk = ev.target.closest('[data-tkbtn]');
    if (tk) { $('pp-ticker').value = tk.dataset.tkbtn; loadTicker(tk.dataset.tkbtn); return; }
  });

  wireTooltip(r);
}

// ── Page loader ───────────────────────────────────────────────────────────────
let _inited = false;
export async function loadProtectivePutPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadTicker(OPT_ESTIMATES[st.ticker] ? st.ticker : OPT_DEFAULT_TICKER);
}
