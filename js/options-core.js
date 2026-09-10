// Options core — the machinery the four Derivatives strategies share.
//
// Covered Calls, Protective Put, Buy Calls and Short Puts are four ways of asking
// the same question — "what price am I agreeing to, and what valuation is that?" —
// so the parts that answer it live here once:
//
//   • the Massive proxy (price, chain, expiries) via the covered-calls-massive
//     edge function, which already forwards contract_type, so puts need no deploy;
//   • the estimate layer: forward revenue → EBITDA → net income → EPS per year, the
//     revenue-growth sensitivity that flexes them, and the two multiples any share
//     price implies on a chosen year;
//   • the income-statement block that sits under every ladder, and the cursor
//     tooltip that carries the quote detail.
//
// What each strategy owns is only what makes it that strategy: its ladder columns,
// its KPI strip and its footnote. Nothing here is stored — every input is
// in-memory and resets on reload.

import { OPT_ESTIMATES, optEstimates, optSources, optDefaultSource } from './options-data.js';
import { coveredCallsQuote } from './api.js';

// ── Formatting. No bare numbers, estimates always marked. ─────────────────────
// Copied verbatim from js/results.js:219 — every interpolated string goes through it.
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
export const px = (x) => (x == null || !isFinite(x)) ? '—' : `$${x.toFixed(2)}`;
export const mult = (x) => (x == null || !isFinite(x) || x <= 0) ? '—' : `${x.toFixed(1)}x`;
export const pct = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : `${(x * 100).toFixed(d)}%`;
// Signed percent. Rounding a tiny negative gives "-0%", which reads as a fall that
// is not there — `+ 0` collapses negative zero back to zero before the sign is chosen.
export const pctS = (x, d = 1) => {
  if (x == null || !isFinite(x)) return '—';
  const n = +(x * 100).toFixed(d) + 0;
  return `${n >= 0 ? '+' : ''}${n.toFixed(d)}%`;
};
// Dollars at position size — these get large, so compact above $10K.
export const cash = (x) => {
  if (x == null || !isFinite(x)) return '—';
  const a = Math.abs(x), s = x < 0 ? '−' : '';
  if (a >= 1e9) return `${s}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `${s}$${(a / 1e3).toFixed(0)}K`;
  return `${s}$${Math.round(a).toLocaleString()}`;
};
export const bn = (x) => {   // values already in $M
  if (x == null || !isFinite(x)) return '—';
  const a = Math.abs(x), s = x < 0 ? '−' : '';
  return a >= 1000 ? `${s}$${(a / 1000).toFixed(2)}B` : `${s}$${a.toFixed(0)}M`;
};
export const daysTo = (d) => {
  if (!d) return null;
  return Math.max(0, Math.round((new Date(d + 'T16:00:00') - new Date()) / 86400000));
};
// A price that implies a richer (higher) multiple than today's is the expensive one
// to underwrite — red; below today's multiple, green. Callers flip it where being
// richer is the good outcome, as it is for a covered call.
export const rich = (v, base) => (v != null && base != null) ? (v > base ? 'rich' : 'cheap') : '';

// ── Massive proxy ─────────────────────────────────────────────────────────────
export async function mfetch(resource, ticker, params = {}) {
  const res = await coveredCallsQuote(resource, ticker, params);
  if (!res.success) throw new Error(res.error?.message || 'request failed');
  return res.data;
}

// Expiries listed for a name. The edge function's `expirations` route asks for
// calls, which is fine for puts too: listed equity options carry the same
// expiration series on both sides.
export async function fetchExpiries(ticker) {
  const today = new Date().toISOString().slice(0, 10);
  let dates = [];
  try {
    const j = await mfetch('expirations', ticker, { 'expiration_date.gte': today });
    dates = [...new Set((j.results || []).map((c) => c.expiration_date))].filter(Boolean).sort();
  } catch { /* leave empty — the caller shows the error */ }
  // The contracts endpoint caps at 1000 rows, which on a busy name truncates the
  // long end — exactly the LEAPS a long-dated view wants. Ask again from the far side.
  try {
    const j2 = await mfetch('expirations', ticker, { 'expiration_date.gte': dates[dates.length - 1] || today });
    dates = [...new Set(dates.concat((j2.results || []).map((c) => c.expiration_date)))].filter(Boolean).sort();
  } catch { /* the first list stands */ }
  return dates;
}

// Live price, name, diluted shares and net debt (enterprise value − market cap).
export async function fetchUnderlying(ticker) {
  const [snap, det, rat] = await Promise.all([
    mfetch('snapshot', ticker).catch(() => null),
    mfetch('details', ticker).catch(() => null),
    mfetch('ratios', ticker).catch(() => null),
  ]);
  const tk = snap && (snap.ticker || snap.results);
  const r0 = (rat && rat.results && rat.results[0]) || {};
  const d0 = (det && det.results) || {};
  const spot = (tk && ((tk.lastTrade && tk.lastTrade.p) || (tk.min && tk.min.c) || (tk.day && tk.day.c) || (tk.prevDay && tk.prevDay.c))) || r0.price || null;
  const shares = d0.weighted_shares_outstanding ?? d0.share_class_shares_outstanding ?? null;
  const mktCap = (spot != null && shares != null) ? spot * shares : (r0.market_cap ?? null);
  return {
    spot,
    changePct: (tk && tk.todaysChangePerc != null) ? tk.todaysChangePerc / 100 : null,
    name: d0.name || null,
    shares,
    netDebt: (r0.enterprise_value != null && mktCap != null) ? r0.enterprise_value - mktCap : null,
  };
}

// One expiry's contracts on one side, filtered to that expiry (Massive can return
// neighbours) and to a strike band wide enough for any of the four ladders.
export async function fetchChain(ticker, expiry, type, spot) {
  const j = await mfetch('chain', ticker, {
    contract_type: type, expiration_date: expiry,
    'strike_price.gte': Math.round(spot * 0.4), 'strike_price.lte': Math.round(spot * 2.4),
    limit: 250,
  });
  return (j.results || []).filter((c) => c.details && c.details.contract_type === type
    && c.details.expiration_date === expiry);
}

// ── The strike ladder's raw material ──────────────────────────────────────────
export const listedStrikes = (chain) => [...new Set(chain.map((c) => c.details.strike_price))].sort((a, b) => a - b);

// The modal gap between consecutive listed strikes: the chain's own increment.
export function strikeStep(all) {
  const gaps = {};
  for (let i = 1; i < all.length; i++) {
    const g = +(all[i] - all[i - 1]).toFixed(2);
    gaps[g] = (gaps[g] || 0) + 1;
  }
  let best = null, n = 0;
  Object.keys(gaps).forEach((g) => { if (gaps[g] > n) { n = gaps[g]; best = +g; } });
  return best || 5;
}

// Snap a band around spot to whatever increment the chain lists. `lo`/`hi` are
// multiples of spot — 1.08/1.42 for a call ladder, 0.62/0.98 for a put one.
export function bandAround(all, spot, lo, hi) {
  if (!all.length || spot == null) return { from: null, to: null };
  const step = strikeStep(all);
  return { from: Math.ceil(spot * lo / step) * step, to: Math.floor(spot * hi / step) * step };
}

// The premium on the basis the user chose. A buyer lifts the ask, a seller hits
// the bid; `mid` is the fair-value view and `last` the last print, which on an
// illiquid strike can be hours old.
export function premiumOf(c, basis) {
  const q = c.last_quote || {};
  const last = (c.last_trade && c.last_trade.price) ?? (c.day && c.day.close) ?? null;
  if (basis === 'ask') return q.ask ?? q.midpoint ?? last;
  if (basis === 'bid') return q.bid ?? q.midpoint ?? last;
  if (basis === 'mid') return q.midpoint ?? ((q.bid != null && q.ask != null) ? (q.bid + q.ask) / 2 : null) ?? last;
  return last ?? q.midpoint ?? q.ask;
}

// The quote detail behind the `i` on every premium.
export function quoteTip(c, extra) {
  const q = c.last_quote || {}, g = c.greeks || {};
  const oi = c.open_interest;
  return `<b>Bid</b> ${px(q.bid == null ? null : q.bid)}  <b>Ask</b> ${px(q.ask == null ? null : q.ask)}  <b>Mid</b> ${px(q.midpoint == null ? null : q.midpoint)}<br>`
    + `<b>Last</b> ${px((c.last_trade || {}).price == null ? null : c.last_trade.price)} · <b>OI</b> ${oi == null ? '—' : oi.toLocaleString()}`
    + ` · <b>Theta</b> ${g.theta == null ? '—' : g.theta.toFixed(3)}`
    + (extra ? `<br>${extra}` : '');
}

// ── Estimates ─────────────────────────────────────────────────────────────────
// One ticker's estimate set for ONE source ('summit' | 'consensus'). Null when the
// name has no set for that source — nothing is silently substituted from the other.
export const estimatesFor = (ticker, src) => optEstimates(ticker, src);
export { optSources, optDefaultSource };
// The source a pane should fall back to when the one it is holding does not exist
// for the ticker just typed in (APP has no Summit column, TBBB no Street one).
export const resolveSource = (ticker, want) =>
  (optSources(ticker).indexOf(want) >= 0 ? want : optDefaultSource(ticker));
export const yearsOf = (e) => e ? Object.keys(e.years).map(Number).sort((a, b) => a - b) : [];
export const estYearsOf = (e) => yearsOf(e).filter((y) => e.years[y] && e.years[y].est);
// ── FX: a multiple compares a USD price to a USD number ───────────────────────
// SPOT reports in EUR and TBBB in MXN, but both trade in USD. A EUR EBITDA held
// against a USD share price is simply a wrong number — so instead of refusing to
// show a multiple (which is what this used to do, leaving two names in the book
// with a column of dashes), the estimate line is converted at the live spot rate
// before the multiple is taken. Covered Calls has always done this; the three
// ladder panes now read the same rate from here, so a multiple means the same
// thing in all four.
//
// The rate is fetched once per currency and cached for the session. If it cannot
// be fetched the multiples stay blank — a stale or invented FX rate would be the
// worse answer, and estNote() says so out loud.
const FXCFG = {
  EUR: { pair: 'EURUSD', invert: false },
  MXN: { pair: 'USDMXN', invert: true },
  TWD: { pair: 'USDTWD', invert: true },
};
const FX = { USD: { rate: 1, asOf: null } };   // currency → { rate, asOf }, native→USD
const fxPending = {};

// The native→USD rate for a reporting currency: 1 for USD, the cached spot rate for
// a currency we have fetched, null for anything else (including a failed fetch).
export const fxRate = (cur) => (cur && FX[cur]) ? FX[cur].rate : null;
// "MXN→USD 0.0534" — what the ladder above actually used. Empty for a USD reporter.
export const fxLabel = (cur) => {
  const f = cur && FX[cur];
  return (!f || cur === 'USD') ? '' : `${cur}→USD ${f.rate.toFixed(cur === 'MXN' ? 5 : 4)}`;
};

// Fetch a currency's rate if we do not hold it yet. Safe to call on every load —
// it is a no-op once cached, and concurrent callers share the one request.
export async function ensureFx(cur) {
  if (!cur || FX[cur]) return fxRate(cur);
  const cfg = FXCFG[cur];
  if (!cfg) return null;   // a currency we carry no pair for — nothing to convert with
  if (!fxPending[cur]) {
    fxPending[cur] = mfetch('fx', cfg.pair)
      .then((j) => {
        const c = j && j.results && j.results[0] && j.results[0].c;
        if (c) FX[cur] = { rate: cfg.invert ? 1 / c : c, asOf: j.results[0].t || null };
      })
      .catch(() => { /* leave it unfetched; estNote explains the blank */ })
      .finally(() => { delete fxPending[cur]; });   // a failure may be retried later
  }
  await fxPending[cur];
  return fxRate(cur);
}

// A set is usable for multiples when it is in USD, or when we hold a rate to put
// it in USD. Show nothing rather than something broken.
export const usable = (e) => !!e && fxRate(e.currency) != null;
export const yl = (e, y) => (e && e.years[y] && e.years[y].est) ? `${y}E` : `${y}`;
// The years the sensitivity opens on: the last two estimate years.
export const flexYears = (e) => estYearsOf(e).slice(-2);
export const isFlexed = (revG) => Object.keys(revG || {}).some((y) => revG[y] != null);

// Every number on a strategy page reads its estimates through effYears(), not
// through the raw data file. That is what makes the sensitivity work: override the
// REVENUE GROWTH of a forward year and the revenue line is rebuilt off the prior
// year, then EBITDA, net income and EPS follow at their CONSENSUS MARGINS —
// everything else is held constant. Overrides compound, so flexing 2027 moves 2028.
//
// Net debt is deliberately NOT flexed: moving it would need a cash-flow model, and
// inventing one behind an input is exactly the kind of fake precision this page is
// supposed to avoid. The block says so.
export function effYears(e, revG) {
  if (!e) return {};
  const out = {};
  Object.keys(e.years).forEach((y) => { out[y] = { ...e.years[y] }; });
  const ys = yearsOf(e);
  const first = ys.find((y) => revG && revG[y] != null);
  if (first == null) return out;
  // From the first overridden year on, EVERY later year is rebuilt too — at its own
  // consensus growth rate unless it is itself overridden. Leaving a later year at its
  // consensus LEVEL would silently invent a growth rate for it: cut 2027 to +15% and
  // 2028 would have had to accelerate to +40% to land back on the consensus number.
  ys.filter((y) => y >= first).forEach((y) => {
    const base = e.years[y], prev = out[y - 1], prevC = e.years[y - 1];
    if (!base || !prev || prev.rev == null || !prevC || !(prevC.rev > 0)) return;
    const consG = base.rev != null ? base.rev / prevC.rev - 1 : null;
    const g = revG[y] != null ? revG[y] : consG;
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

// Diluted shares (M) and net debt for a year, falling back to the live
// enterprise-value − market-cap when the estimate set carries none. `native` says
// which currency that net debt is in: a figure taken from the estimate set is in
// the company's REPORTING currency, while the live fallback comes from Massive and
// is already USD. Only the caller knows the share price it is about to be added
// to, so the conversion happens there, not here.
export function capital(E, year, live) {
  const y = E[year];
  const shares = (y && y.shares != null) ? y.shares : (live && live.shares != null ? live.shares / 1e6 : null);
  const fromEst = y && y.netDebt != null;
  const netDebt = fromEst ? y.netDebt : (live && live.netDebt != null ? live.netDebt / 1e6 : null);
  return { shares, netDebt, native: fromEst };
}

// The two multiples a share price implies on a given estimate year.
// The price is USD; the estimate line may not be, so it is put in USD first (fx is
// 1 for a USD reporter). Shares are a count and never converted; net debt is
// converted only when it came from the estimate set — see capital().
export function multiplesAt(price, year, E, e, live) {
  if (!usable(e) || price == null) return { pe: null, ev: null };
  const y = E[year];
  if (!y) return { pe: null, ev: null };
  const fx = fxRate(e.currency);
  const cap = capital(E, year, live);
  // An ADR is worth `adrRatio` ordinary shares, so the price being held is a price
  // for that many at once. Per-share figures scale UP by the ratio and the share
  // COUNT scales down: TSM's 25.9bn Taipei ordinaries are 5.19bn New York ADSs.
  // The ratio is 1 for every ordinary listing, so this is a no-op everywhere else.
  // Absolute lines (revenue, EBITDA, net debt) are unaffected — the company is the
  // same size however its equity is sliced.
  const adr = e.adrRatio || 1;
  const eps = (y.eps != null) ? y.eps * adr * fx : null;
  const shares = (cap.shares != null) ? cap.shares / adr : null;
  const ebitda = (y.ebitda != null) ? y.ebitda * fx : null;
  const netDebt = (cap.netDebt == null) ? null : (cap.native ? cap.netDebt * fx : cap.netDebt);
  return {
    pe: (eps != null && eps > 0) ? price / eps : null,
    ev: (ebitda != null && ebitda > 0 && shares != null && netDebt != null)
      ? (price * shares + netDebt) / ebitda : null,
  };
}

// Why a multiple came out blank — the INPUT that is missing, not a guess. A KPI
// that says "no EBITDA estimate" when the EBITDA is right there and it is the net
// debt that Massive never returned sends the reader looking in the wrong place.
export function whyBlank(kind, year, E, e, live) {
  if (!e) return 'no estimate set';
  if (!usable(e)) return `no ${e.currency}→USD rate`;
  const y = E[year];
  if (!y) return `nothing for ${year}`;
  if (kind === 'pe') {
    if (y.eps == null) return 'no EPS estimate';
    if (!(y.eps > 0)) return 'loss-making that year';
    return '';
  }
  if (y.ebitda == null) return 'no EBITDA estimate';
  if (!(y.ebitda > 0)) return 'EBITDA not positive';
  const cap = capital(E, year, live);
  if (cap.shares == null) return 'no share count';
  // Massive returns no enterprise value for foreign issuers, so there is nothing
  // to back out net debt from and the estimate set carries none either.
  if (cap.netDebt == null) return 'no net debt for this name';
  return '';
}

// YoY growth of one estimate line, its CAGR across the window, and its margin on
// revenue. Each returns null unless the inputs are positive — a growth rate off a
// loss, or a margin off no revenue, is noise.
export function growth(E, key, year) {
  const cur = E[year] && E[year][key], prev = E[year - 1] && E[year - 1][key];
  return (cur != null && prev != null && prev > 0) ? cur / prev - 1 : null;
}
export function cagr(E, key, from, to) {
  const a = E[from] && E[from][key], b = E[to] && E[to][key];
  return (a != null && b != null && a > 0 && b > 0 && to > from) ? Math.pow(b / a, 1 / (to - from)) - 1 : null;
}
export function margin(E, key, year) {
  const v = E[year] && E[year][key], rev = E[year] && E[year].rev;
  return (v != null && rev != null && rev > 0) ? v / rev : null;
}

// The one-line verdict on the two sources, on the year the multiples are computed
// on: where the selected estimates sit against the other set. Blank when there is
// no other set, or when the base is not a positive number to divide by.
function gapLine(E, o) {
  if (!o.other) return '';
  const y = o.basisYear;
  const cell = (key, label) => {
    const a = E[y] && E[y][key], b = o.other[y] && o.other[y][key];
    if (a == null || b == null || !(b > 0)) return null;
    const g = a / b - 1;
    return `${esc(label)} <b class="${g >= 0 ? "up" : "dn"}">${pctS(g, 1)}</b>`;
  };
  const parts = [cell('rev', 'revenue'), cell('ebitda', 'EBITDA'), cell('netIncome', 'net income')].filter(Boolean);
  if (!parts.length) return '';
  return `<span class="gapline">on ${esc(yl(o.est, y))}, ${esc((o.est && o.est.label) || 'this source')} vs ${esc(o.otherLabel)}: ${parts.join(' · ')}</span>`;
}

// ── The income statement under every ladder ───────────────────────────────────
// Revenue down to EPS, each level followed by its growth and — where it means
// anything — its margin on revenue. The CAGR sits on the growth line because that
// is what it measures; the PEG sits on the level.
//
// o = { prefix, ticker, est, E, revG, basisYear, sens, spotMult }
// spotMult is the multiple pair at today's price, which is what the PEG divides.
export function renderFundBlock(wrap, o) {
  if (!wrap) return;
  const e = o.est;
  if (!e) { wrap.innerHTML = ''; return; }
  const E = o.E, cons = e.years, p = o.prefix;
  const cols = yearsOf(e).filter((y) => y >= 2024);
  const firstA = cols.find((y) => !cons[y].est) != null ? cols.find((y) => !cons[y].est) : cols[0];
  const lastY = cols[cols.length - 1];
  const flex = flexYears(e);
  const cur = o.spotMult || { pe: null, ev: null };
  // PEG on the selected basis year: today's multiple ÷ that year's growth, in points.
  const gEb = growth(E, 'ebitda', o.basisYear), gNi = growth(E, 'netIncome', o.basisYear);
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
    const q = opts || {};
    const lvl = `<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">${esc(label)}</td>`
      + cols.map((y) => `<td class="${est(y)}${flexed(y)}">${esc(fmtv(E[y][key]))}</td>`).join('')
      + `<td class="sep"></td><td>${q.peg == null ? '' : q.peg.toFixed(2)}</td></tr>`;

    const gcells = cols.map((y) => {
      const g = growth(E, key, y);
      // The one editable number on the page: revenue growth in a flex year.
      if (q.editable && o.sens && flex.indexOf(y) >= 0) {
        const val = (o.revG[y] != null ? o.revG[y] : g);
        return `<td class="${est(y)} gcell"><input class="gin" type="number" step="1" data-revg="${y}"
          value="${val == null ? '' : (val * 100).toFixed(1)}" title="revenue growth for ${y}E — everything below follows at consensus margins"></td>`;
      }
      return `<td class="${est(y)}${flexed(y)} ${g == null ? '' : (g >= 0 ? 'up' : 'dn')}">${g == null ? '—' : pctS(g, 0)}</td>`;
    }).join('');
    const cg = cagr(E, key, firstA, lastY);
    const grow = `<tr class="rs-ft-sub${q.margin ? ' rs-ft-nb' : ''}"><td class="rs-ft-h">growth</td>${gcells}`
      + `<td class="sep ${cg == null ? '' : (cg >= 0 ? 'up' : 'dn')}">${cg == null ? '—' : pctS(cg)}</td><td></td></tr>`;

    // The comparison line: this source against the other one, year by year. It is
    // the whole point of carrying both — a multiple on our numbers only means
    // something next to the same multiple on the Street's.
    let vs = '';
    if (o.other) {
      const cells = cols.map((y) => {
        const a = E[y] && E[y][key], b = o.other[y] && o.other[y][key];
        // REPORTED years are compared too. They used to be skipped on the grounds
        // that a closed year is the same figure under either source — true while the
        // Street column came out of the model's own workbook, and false since it
        // comes from the Bloomberg archive, which carries GAAP lines where the model
        // carries adjusted ones. UBER's FY2025 net income is 5,237 one way and
        // 10,053 the other. That gap is the accounting basis rather than a view on
        // the future, and hiding it would leave the forecast rows looking like
        // disagreement when part of the distance was there all along.
        // A percentage against a negative or missing base is noise, so it is left
        // blank rather than invented — the same rule the growth lines follow.
        const g = (a != null && b != null && b > 0) ? a / b - 1 : null;
        return `<td class="${est(y)} ${g == null ? '' : (g >= 0 ? 'up' : 'dn')}">${g == null ? '—' : pctS(g, 0)}</td>`;
      }).join('');
      vs = `<tr class="rs-ft-sub vsrow"><td class="rs-ft-h">vs ${esc(o.otherLabel)}</td>${cells}<td class="sep"></td><td></td></tr>`;
    }

    if (!q.margin) return lvl + grow + vs;
    // No flexed marker on the margin line: the margins are exactly what the
    // sensitivity HOLDS, so painting them as moved would contradict itself.
    const mcells = cols.map((y) => {
      const m = margin(E, key, y);
      return `<td class="${est(y)}">${m == null ? '—' : pct(m, 1)}</td>`;
    }).join('');
    return lvl + grow + `<tr class="rs-ft-sub"><td class="rs-ft-h">margin</td>${mcells}<td class="sep"></td><td></td></tr>` + vs;
  }

  const plain = (label, fmtv) => `<tr class="rs-ft-main"><td class="rs-ft-h">${esc(label)}</td>`
    + cols.map((y) => `<td class="${est(y)}">${esc(fmtv(y))}</td>`).join('')
    + `<td class="sep"></td><td></td></tr>`;

  wrap.innerHTML = `
    <div class="block-top">
      <div class="block-h">${esc(e.name)} — income statement · <span class="srcname">${esc(e.label || '')}</span></div>
      ${gapLine(E, o)}
      <button type="button" class="ghost sm ${o.sens ? 'on' : ''}" id="${p}-sens">${o.sens ? '✓ ' : ''}Sensitivity</button>
      ${isFlexed(o.revG) ? `<button type="button" class="ghost sm" id="${p}-sensReset">Reset to consensus</button>` : ''}
      <span class="muted">CAGR ${firstA}→${lastY} on each growth line · PEG on ${esc(yl(e, o.basisYear))}</span>
    </div>
    ${o.sens ? `<div class="senshint">Type a revenue growth for ${flex.map((y) => esc(yl(e, y))).join(' and ')}. Revenue is rebuilt off the prior year and compounds; EBITDA, net income and EPS follow at their <b>consensus margins</b>; shares and net debt are held. Every multiple in the ladder above moves with it.</div>` : ''}
    <div class="rs-tablewrap"><div class="rs-ft-scroll"><table class="rs-ft an-fundtbl">
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
      <b>Margin</b> is the line as a % of revenue — the common-size view. Revenue has none by definition, and EPS is per share rather than a share of revenue, so neither carries one. <b>PEG</b> = the multiple ${esc(o.ticker)} trades at <em>today</em> on ${esc(yl(e, o.basisYear))} ÷ that year's growth in points: EV/EBITDA ÷ EBITDA growth on the EBITDA line, P/E ÷ net-income growth on Net income. Growth off a loss-making or missing prior year is left blank rather than invented. Diluted shares and net debt carry no growth or margin; they are here because the ladder's EV/EBITDA is built from them.<br>
      <b>Sensitivity</b> holds every margin at consensus and moves revenue only, so it answers "what if the top line compounds differently", not "what if the business changes shape". <b>Net debt is not flexed</b> — restating it would need a cash-flow model, and guessing one behind an input would be false precision.<br>
      ${e.currency === 'USD' ? '' : `<b>Currency</b> — this table is in ${esc(e.currency)}, the currency ${esc(e.name)} reports in, and is left unconverted so it ties to the filings. The ladder above is priced in USD, so every multiple there puts these figures in USD first, at ${fxLabel(e.currency) ? esc(fxLabel(e.currency)) : '<b>no rate we could fetch — which is why those multiples are blank</b>'}.<br>`}
      ${esc(e.source)}</div>`;
}

// ── Multiple basis: the estimate year every multiple on a pane is computed on ──
// A segmented control in the pane's own control row, the same shape Covered Calls
// uses, so all four strategies carry their expiry and their basis in the same
// place. The years offered are whatever that ticker's estimate set holds.
export function yearSegments(prefix, est, basisYear, from) {
  const ys = yearsOf(est).filter((y) => y >= (from || 2025));
  if (!ys.length) return '<span class="muted">—</span>';
  return `<div class="seg" id="${prefix}-basisSel">`
    + ys.map((y) => `<button type="button" data-year="${y}" class="${y === basisYear ? 'on' : ''}">${y}${est && est.years[y] && est.years[y].est ? 'E' : ''}</button>`).join('')
    + `</div>`;
}

// Why a pane is showing no multiples — said out loud, because a column of dashes
// with no explanation reads as a bug. Empty string when there is nothing to say.
export function estNote(ticker, est) {
  if (!est) return `No estimate set for ${esc(ticker)} — it is not in the Summit DCF universe and we carry no consensus for it. The option economics still price; the multiples cannot.`;
  if (!usable(est)) return `${esc(est.name)} reports in ${esc(est.currency)} and we could not fetch a ${esc(est.currency)}→USD rate, so the multiples are left blank rather than computed against the wrong currency. Reload to retry.`;
  // Converted, not blank — but the reader is owed the rate it was converted at.
  if (est.currency !== 'USD') return `${esc(est.name)} reports in ${esc(est.currency)}; every multiple below converts the estimate line to USD at the live ${esc(fxLabel(est.currency))} before comparing it to the share price. The income statement stays in ${esc(est.currency)}.`;
  return '';
}

// ── Estimates: whose numbers every multiple on the pane is computed on ────────
// Summit's model or the Street. A source the ticker does not have is still drawn,
// disabled, because "there is no Street number for TBBB" is itself the answer.
export function sourceSegments(prefix, ticker, current) {
  const have = optSources(ticker);
  const all = [['summit', 'Summit'], ['consensus', 'Consensus']];
  return `<div class="seg" id="${prefix}-srcSel">`
    + all.map(([k, lbl]) => {
      const on = k === current, missing = have.indexOf(k) < 0;
      return `<button type="button" data-src="${k}" class="${on ? 'on' : ''}${missing ? ' off' : ''}"
        ${missing ? 'disabled' : ''} title="${missing ? `no ${lbl} estimates for ${esc(ticker)}` : `${lbl} estimates`}">${lbl}</button>`;
    }).join('')
    + `</div>`;
}

// ── How old are these numbers ─────────────────────────────────────────────────
// A forward estimate is a fact about a MOMENT, so every pane prints the vintage
// of the set it is showing and ages it in days. Three states, and they are not
// the same claim:
//
//   observed  — a Bloomberg export pulled on that date, on purpose. Trustworthy.
//   inherited — read out of a Summit workbook saved on that date. The Bloomberg
//               add-in inside it was refreshed at or before then and the model
//               records no field saying when, so the date is an UPPER BOUND on
//               freshness, not a pull date. Rendered with a ~ to say so.
//   unknown   — nobody wrote it down. Says exactly that, and never guesses.
export function ageDays(iso) {
  if (!iso) return null;
  return Math.max(0, Math.round((Date.now() - new Date(iso + 'T00:00:00')) / 86400000));
}
// Anything past a quarter has lived through an earnings season it does not know
// about, which is the point at which "old" becomes "wrong".
export const STALE_DAYS = 92;

export function vintage(est) {
  if (!est) return null;
  const d = est.asOf, from = est.asOfFrom;
  if (!d) return { state: 'unknown', text: 'date not recorded', title:
    `Nobody recorded when this ${est.label || 'estimate'} set was pulled, so its age cannot be judged. ${est.source || ''}` };
  const n = ageDays(d);
  const inherited = from !== 'bbg';
  const nice = new Date(d + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return {
    state: n > STALE_DAYS ? 'stale' : (inherited ? 'inherited' : 'observed'),
    text: `${inherited ? '~' : ''}${nice} · ${n}d`,
    title: inherited
      ? `Dated from the Summit workbook saved on ${d}, not from a Bloomberg pull — the model carries no field for when its BBG cells were last refreshed, so ${d} is the OLDEST this can be, and it may be older. ${n} days ago.`
      : `Exported from Bloomberg on ${d}, ${n} days ago.`,
  };
}

// The badge that sits next to the Estimates toggle. Empty when there is no set.
export function vintageBadge(est) {
  const v = vintage(est);
  if (!v) return '';
  return `<span class="vintage ${v.state}" data-tip="${esc(v.title)}">${esc(v.text)}</span>`;
}

// ── The ticker chips: the names we hold estimates for ─────────────────────────
export function tickerChips(current) {
  return Object.keys(OPT_ESTIMATES).map((t) =>
    `<button type="button" class="chip ${t === current ? 'on' : ''}" data-tkbtn="${esc(t)}">${esc(t)}</button>`).join('');
}

// ── Cursor-following tooltip ──────────────────────────────────────────────────
// One element for the whole Derivatives tab, created on first use. Each strategy
// root wires its own hover handlers into it.
export function wireTooltip(rootEl) {
  let tip = document.getElementById('der-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'der-tip';
    document.body.appendChild(tip);
  }
  rootEl.addEventListener('mouseover', (ev) => {
    const el = ev.target.closest('[data-tip]');
    if (!el) return;
    tip.innerHTML = el.dataset.tip; tip.classList.add('on');
  });
  rootEl.addEventListener('mousemove', (ev) => {
    if (!tip.classList.contains('on')) return;
    tip.style.left = (ev.clientX + 14) + 'px';
    tip.style.top = (ev.clientY + 16) + 'px';
  });
  rootEl.addEventListener('mouseout', (ev) => {
    if (ev.target.closest('[data-tip]')) tip.classList.remove('on');
  });
}
