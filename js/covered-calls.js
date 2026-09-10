// Covered Calls tab — live covered-call book. Price + option chain (premium/IV/
// greeks) come from Massive via the covered-calls-massive edge function; forward
// EBITDA/EPS come from js/options-data.js on whichever source the Estimates toggle
// is on — the Summit model or the Bloomberg consensus carried in the same snapshot.
// Computes the covered-call economics and the "valuation if exercised" multiples.
// Everything is in %.
import { POSITIONS } from './covered-calls-positions.js';
import { EST_STORE, optSources } from './options-data.js';
import { coveredCallsQuote } from './api.js';
// Shared with the other three panes so a date means the same thing everywhere.
import { esc, ageDays, STALE_DAYS, ensureFx, fxRate as coreFxRate, fxLabel } from './options-core.js';

// The estimate store, reshaped to what this tab reads: { currency, years } where a
// year carries ebitda / earnings / shares_out. `estSrc` picks whose numbers those
// are — Summit's model or Bloomberg consensus, both carried in the same snapshot.
// A ticker with no set for the selected source falls back to nothing, not to the
// other source: the multiples go blank and the footnote says why.
//
// A REPORTED year is the same figure under either source — the Street carries no
// estimate for a year already closed — so on Consensus the history comes from the
// model's own actuals columns and only the forward years differ. Without this the
// whole book lost its t0 column the moment you toggled to Consensus, and with it
// every CAGR and the first growth row. (This is the same rule optEstimates()
// applies for the other three panes; it just never made it into this one.)
function SU(ticker) {
  const s = EST_STORE[ticker];
  if (!s) return null;
  const rows = s[estSrc];
  if (!rows) return null;
  // A fiscal year that is not the calendar year is re-keyed to the calendar, the
  // same shift optEstimates() applies for the other three panes. This tab reads the
  // store directly, so it has to do it too — and it MUST, because the FY window
  // below is one shared set of calendar columns for the whole book: without the
  // shift, NVIDIA's already-reported January year sat in the FY26 column while
  // every other name had an estimate there.
  const off = s.fiscalOffset || 0;
  const cal = (r) => {
    if (!off || !r) return r;
    const o = {}; Object.keys(r).forEach((k) => { o[+k - off] = r[k]; }); return o;
  };
  const lastA = s.lastActual - off;
  const merged = {};
  const sm = cal(s.summit);
  if (estSrc !== 'summit' && sm) {
    Object.keys(sm).forEach((k) => { if (+k <= lastA) merged[k] = sm[k]; });
  }
  const cr = cal(rows);
  Object.keys(cr).forEach((k) => { merged[k] = cr[k]; });
  const years = {};
  Object.keys(merged).forEach((k) => {
    const r = merged[k];
    years[k] = { rev: r.rev, ebitda: r.ebitda, earnings: r.earnings, shares_out: r.shares,
                 netDebt: r.netDebt ?? null, est: +k > lastA };
  });
  // `lastActual` differs by name: NVIDIA's FY2026 closed in January and is
  // reported, so its FY26 column is an actual while everyone else's is a forecast.
  // The cells carry their own E for that reason; the header cannot.
  return { name: s.name, currency: s.currency, snapshot_date: s.snapshot,
           lastActual: lastA, fiscalOffset: off, years };
}

const $ = (id) => document.getElementById(id);

// The FX table used to live here, knowing only EUR and MXN. It now lives in
// options-core.js alongside the three ladder panes' copy of the same problem, so
// adding a currency (TWD, for TSM) is one edit and every pane gets it.
const T0 = 2025;                 // last reported fiscal year (t0)
const FY = [T0, T0 + 1, T0 + 2, T0 + 3]; // t0..t+3 shown in the fundamentals block. The
                                        // store runs to FY2028, so the block and the
                                        // Multiple basis both reach it.
const fyLabel = (y) => `FY${String(y).slice(2)}`;

// ── Massive proxy (via the edge function) ─────────────────────────────────────
async function mfetch(resource, ticker, params = {}) {
  const res = await coveredCallsQuote(resource, ticker, params);
  if (!res.success) throw new Error(res.error?.message || 'request failed');
  return res.data;
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
let estSrc = 'summit';   // 'summit' | 'consensus' — whose estimates every multiple uses
let showFund = true;     // show/hide the EBITDA & Net Income blocks
let sortKey = null;      // 'wt' | 'yield' | 'portyield' | 'contrib' | null (book order)
let sortDir = -1;        // -1 = descending (high→low), 1 = ascending

// Fraction of the next-twelve-months window that falls in calendar FY[1] (t+1).
// Used to blend FY[1]/FY[2] estimates into an NTM figure (no quarterly data).
function ntmFrac() {
  const now = new Date();
  const end = new Date(`${FY[1]}-12-31T00:00:00`);
  return Math.min(1, Math.max(0, (end - now) / 86400000 / 365));
}

// EBITDA / earnings (+ their YoY growth) for the selected basis, native currency.
function basisFundamentals(ticker) {
  const su = SU(ticker);
  if (!su || !su.years) return null;
  const yv = (y, k) => su.years[y]?.[k];
  const g  = (y, k) => (yv(y, k) != null && yv(y - 1, k) != null && yv(y - 1, k) > 0) ? yv(y, k) / yv(y - 1, k) - 1 : null;
  if (mulBasis === '2026E') return { ebitda: yv(FY[1], 'ebitda'), earnings: yv(FY[1], 'earnings'), netDebt: yv(FY[1], 'netDebt'), shares: yv(FY[1], 'shares_out'), gEb: g(FY[1], 'ebitda'), gEa: g(FY[1], 'earnings') };
  if (mulBasis === '2027E') return { ebitda: yv(FY[2], 'ebitda'), earnings: yv(FY[2], 'earnings'), netDebt: yv(FY[2], 'netDebt'), shares: yv(FY[2], 'shares_out'), gEb: g(FY[2], 'ebitda'), gEa: g(FY[2], 'earnings') };
  if (mulBasis === '2028E') return { ebitda: yv(FY[3], 'ebitda'), earnings: yv(FY[3], 'earnings'), netDebt: yv(FY[3], 'netDebt'), shares: yv(FY[3], 'shares_out'), gEb: g(FY[3], 'ebitda'), gEa: g(FY[3], 'earnings') };
  const f = ntmFrac(); // NTM = calendar blend of t+1 and t+2
  const blend = (a, b) => (a != null && b != null) ? f * a + (1 - f) * b : null;
  return {
    ebitda:   blend(yv(FY[1], 'ebitda'),   yv(FY[2], 'ebitda')),
    earnings: blend(yv(FY[1], 'earnings'), yv(FY[2], 'earnings')),
    netDebt:  blend(yv(FY[1], 'netDebt'),  yv(FY[2], 'netDebt')),
    shares:   blend(yv(FY[1], 'shares_out'), yv(FY[2], 'shares_out')),
    gEb: blend(g(FY[1], 'ebitda'),   g(FY[2], 'ebitda')),
    gEa: blend(g(FY[1], 'earnings'), g(FY[2], 'earnings')),
  };
}

// Where the CAGR ends: the year the multiples are on, NOT the last column drawn.
// The row asks one question — "what am I agreeing to on THIS year" — and a growth
// rate measured to a year you are not underwriting answers a different one. Move
// the Multiple basis and the CAGR moves with it, which is also what makes it
// comparable to the PEG sitting beside it, since the PEG divides by the basis
// year's growth.
//
// NTM is a calendar blend of t+1 and t+2, so it lands BETWEEN two years: its
// effective horizon is t+1 plus whatever share of the window falls in t+2. The
// exponent uses that fraction rather than rounding to a whole year.
function basisEnd() {
  if (mulBasis === '2026E') return FY[1];
  if (mulBasis === '2027E') return FY[2];
  if (mulBasis === '2028E') return FY[3];
  return FY[1] + (1 - ntmFrac());
}
// The label for that endpoint — the header prints it, because a CAGR whose window
// moves under a toggle is unreadable without saying where it stops.
function basisEndLabel() { return mulBasis === 'NTM' ? 'NTM' : fyLabel(Math.round(basisEnd())); }

// t0 → the basis year; null unless both endpoints are positive, since a compound
// rate off a loss is noise.
function cagr(ticker, key) {
  const su = SU(ticker);
  if (!su || !su.years) return null;
  const a = su.years[FY[0]]?.[key];
  const end = basisEnd();
  // On NTM the endpoint is the blended figure itself, which basisFundamentals holds.
  const bf = mulBasis === 'NTM' ? basisFundamentals(ticker) : null;
  const b = bf ? bf[key] : su.years[end]?.[key];
  const yrs = end - FY[0];
  return (a != null && b != null && a > 0 && b > 0 && yrs > 0)
    ? Math.pow(b / a, 1 / yrs) - 1 : null;
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

// ── Strikes the book doesn't name ─────────────────────────────────────────────
// The nearest listed strike AT OR ABOVE spot: the first covered call that would
// not agree to sell the shares below today's price. Resolved live rather than
// guessed in the data file, and flagged in the table so a strike the tab picked
// is never mistaken for one somebody chose.
async function autoStrike(ticker, wantExpiry) {
  const j = await mfetch('chain', ticker, { contract_type: 'call', expiration_date: wantExpiry, limit: 250 });
  const list = (j.results || []).filter((c) => c.details?.contract_type === 'call'
    && c.details?.expiration_date === wantExpiry);
  if (!list.length) return null;
  const spot = list.find((c) => c.underlying_asset?.price)?.underlying_asset?.price;
  if (spot == null) return null;
  const ks = [...new Set(list.map((c) => c.details.strike_price))].sort((a, b) => a - b);
  return ks.find((k) => k >= spot) ?? ks[ks.length - 1];
}

// ── Strike FROM a multiple ────────────────────────────────────────────────────
// metrics() takes a strike and reports the multiple it implies. This is the same
// arithmetic read backwards, because that is the order the decision actually
// happens in: you do not pick $570 on Mastercard, you decide you are content to
// be called away at 24x and find out that means $570.
//
//   EV/EBITDA :  EV = M x EBITDA, so equity = M x EBITDA - net debt
//   P/E       :  price = M x EPS, i.e. equity = M x earnings
//
// Everything is on the SELECTED basis year and the SELECTED estimate source, in
// USD, with the ADR ratio applied — the same inputs the forward multiple uses, so
// typing a number back into the cell it came out of returns the strike it came from.
function strikeFromMultiple(row, kind, M) {
  const L = row.live;
  if (!L || row.isEtf || !L.fxOk || !(M > 0)) return null;
  const bf = basisFundamentals(row.ticker);
  if (!bf) return null;
  const f = L.fxRate;
  const adr = (EST_STORE[row.ticker] && EST_STORE[row.ticker].adrRatio) || 1;
  const sh = (bf.shares != null && bf.shares > 0) ? bf.shares * 1e6 / adr : L.shares;
  if (!sh) return null;
  if (kind === 'ev') {
    const eb = (bf.ebitda != null) ? bf.ebitda * f * 1e6 : null;
    const nd = L.netDebt != null ? L.netDebt : (bf.netDebt != null ? bf.netDebt * f * 1e6 : null);
    if (!(eb > 0) || nd == null) return null;
    return (M * eb - nd) / sh;
  }
  const earn = (bf.earnings != null) ? bf.earnings * f * 1e6 : null;
  if (!(earn > 0)) return null;
  return (M * earn) / sh;
}

// The listed strike closest to a price. A multiple almost never lands on one, and
// silently keeping the unlisted number would leave a row that cannot be traded —
// so it snaps, and the cell then shows the multiple the LISTED strike actually
// gives, which is a slightly different number from the one that was typed.
async function nearestListed(ticker, wantExpiry, target) {
  const j = await mfetch('chain', ticker, {
    contract_type: 'call', expiration_date: wantExpiry,
    'strike_price.gte': Math.max(0.5, target * 0.45), 'strike_price.lte': target * 1.8, limit: 250 });
  const ks = [...new Set((j.results || [])
    .filter((c) => c.details && c.details.contract_type === 'call' && c.details.expiration_date === wantExpiry)
    .map((c) => c.details.strike_price))].sort((a, b) => a - b);
  if (!ks.length) return null;
  return ks.reduce((best, k) => Math.abs(k - target) < Math.abs(best - target) ? k : best, ks[0]);
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
    // A position with no strike in the book gets one from the chain first.
    if (row.strike == null) {
      row.strike = await limit(() => autoStrike(row.ticker, expiry));
      row.autoStrike = true;
      if (row.strike == null) throw new Error(`no listed calls at ${expiry}`);
    }
    // `ratios` is fetched for ETFs too — it carries the price, which is the one
    // figure an index fund still needs. Only the fundamentals behind the
    // multiples are skipped for them.
    const tasks = [
      limit(() => fetchCall(row.ticker, row.strike, expiry)),
      limit(() => (row.isEtf ? Promise.resolve(null) : mfetch('details', row.ticker).catch(() => null))),
      limit(() => mfetch('ratios', row.ticker).catch(() => null)),
    ];
    // The reporting currency is a property of the TICKER, not of the estimate
    // source selected right now — read it from the store, not through SU(). SU()
    // returns null when the current source has no numbers for that name, which is
    // exactly TSM's case on the Summit toggle: the rate was never fetched, and a
    // TWD net income then divided a USD price as if it were dollars.
    // One request per CURRENCY per session: ensureFx caches, so fourteen
    // positions in three currencies cost three calls, not fourteen.
    const cur0 = EST_STORE[row.ticker] && EST_STORE[row.ticker].currency;
    if (!row.isEtf && cur0) tasks.push(limit(() => ensureFx(cur0)));
    const [contract, details, ratiosResp] = await Promise.all(tasks);

    const d = details?.results || {};
    const rt = (ratiosResp?.results && ratiosResp.results[0]) || {};
    const q = contract?.last_quote || {};
    const premium = q.midpoint ?? contract?.day?.close ?? contract?.last_trade?.price ?? row.seedPrime ?? null;
    const price = contract?.underlying_asset?.price ?? rt.price ?? null;
    const shares = d.weighted_shares_outstanding ?? d.share_class_shares_outstanding ?? null;
    const mktCap = (price && shares) ? price * shares : (rt.market_cap ?? null);
    const netDebt = (rt.enterprise_value != null && rt.market_cap != null) ? rt.enterprise_value - rt.market_cap : null;

    // 1 for a USD reporter, and 1 when the rate could not be fetched — in which
    // case the multiple would be built on a native-currency figure, so `fxOk` is
    // false and the fundamentals are dropped rather than silently mixed.
    const fxRate = (cur0 ? coreFxRate(cur0) : 1) || 1;
    const fxNote = cur0 ? fxLabel(cur0) : '';
    const fxOk = !cur0 || cur0 === 'USD' || coreFxRate(cur0) != null;

    const lt = contract?.last_trade || {};
    row.live = {
      price, premium, iv: contract?.implied_volatility ?? null,
      delta: contract?.greeks?.delta ?? null, theta: contract?.greeks?.theta ?? null,
      oi: contract?.open_interest ?? null, name: d.name || row.ticker,
      shares, mktCap, netDebt, fxRate, fxNote, fxOk,
      bid: q.bid ?? null, ask: q.ask ?? null, mid: q.midpoint ?? null,
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

// ── How much of the premium the spread eats ──────────────────────────────────
// The Premium column shows the MID, which is a fair-value estimate, not a price
// anyone will pay you. Selling a covered call means hitting the BID, so half the
// spread is a real cost taken off the yield the row is advertising — and on a thin
// strike it is not a rounding error: a $0.10 spread on a $0.50 mid is 20% of the
// premium gone before the trade exists.
//
// Measured relative to the mid, which is the standard way to compare a $0.05
// spread on a $17 name with a $2 spread on a $650 one. Two bands:
//   >= 10%  wide      — the mid is an optimistic estimate of what you will get
//   >= 25%  very wide — or no bid at all, which is the same thing said louder
// A missing bid is treated as the worst case rather than skipped, because "nobody
// is bidding" is exactly what the column is there to warn about.
function spreadOf(L) {
  if (!L) return null;
  const bid = L.bid, ask = L.ask;
  if (ask == null || !(ask > 0)) return null;
  const b = (bid == null) ? 0 : bid;
  const mid = (L.mid != null && L.mid > 0) ? L.mid : (b + ask) / 2;
  if (!(mid > 0)) return null;
  const abs = ask - b;
  return { abs, pct: abs / mid, noBid: !(b > 0), cross: (abs / 2) / mid };
}
const spreadClass = (sp) => !sp ? '' : (sp.pct >= 0.25 || sp.noBid ? ' spx' : (sp.pct >= 0.10 ? ' spw' : ''));

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
  if (bf && L.shares && price != null && !row.isEtf && L.fxOk) {
    const f = L.fxRate;
    // The FORECAST share count for the basis year, not today's — a forward multiple
    // should carry the dilution or buyback the model expects by then. This is the
    // rule capital() already applies in the engine, and without it the same name
    // read 44.9x here and 43.0x in the ladder panes on the same year (TBBB: 120.6M
    // shares live vs 115.0M modelled). Falls back to the live count when the
    // estimate set carries none.
    // ...divided by the ADR ratio where there is one. The estimate set counts the
    // ORDINARY share (TSM: 25.9bn Taipei) while the price is for an ADR worth five
    // of them, so without this the market cap is 5x too big. Massive's live count
    // is already in ADSs (5.19bn), which is why the fallback needs no adjustment.
    const adr = (EST_STORE[row.ticker] && EST_STORE[row.ticker].adrRatio) || 1;
    const sh = (bf.shares != null && bf.shares > 0) ? bf.shares * 1e6 / adr : L.shares;
    const ebitdaUSD = (bf.ebitda != null) ? bf.ebitda * f * 1e6 : null;
    const earnUSD = (bf.earnings != null) ? bf.earnings * f * 1e6 : null;
    const mc = price * sh, mcS = row.strike * sh;
    // Massive returns no enterprise value for a foreign issuer, so EV - market cap
    // is null for TSM, SPOT and TBBB. Where the estimate set carries its own net
    // debt, use it — it is in the REPORTING currency, so it converts like the
    // other lines; the live figure is already USD and must not.
    const nd = L.netDebt != null ? L.netDebt
             : (bf.netDebt != null ? bf.netDebt * f * 1e6 : null);
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

// Massive option last_trade timestamps come in ns / ms / s — normalize and show
// in the viewer's local time for the hover tooltip.
function tradeStamp(ts) {
  if (ts == null) return '—';
  const ms = ts > 1e15 ? ts / 1e6 : ts > 1e12 ? ts : ts * 1000;
  const d = new Date(ms);
  return isNaN(d) ? '—' : d.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// EBITDA / Net Income for t0..t+2 with YoY growth, from the Summit model.
// Returns [{ v, g }] per year (v = value in native-currency millions, g = YoY).
function fundSeries(ticker, key) {
  const su = SU(ticker);
  if (!su || !su.years) return null;
  return FY.map((y) => {
    const cur = su.years[y]?.[key];
    const prev = su.years[y - 1]?.[key];
    const g = (cur != null && prev != null && prev > 0) ? cur / prev - 1 : null;
    // Whether THIS name has reported that year, not whether the book has.
    return { v: cur ?? null, g, est: y > su.lastActual };
  });
}

// One fundamentals block: one cell per FY column (value over YoY), then CAGR, then PEG.
function fundSection(series, cagrVal, pegVal) {
  if (!series) return [0, 1, 2, 3, 4, 5].map((i) => `<td class="${i === 0 ? 'sep ' : ''}fund muted">—</td>`).join('');
  const yrs = series.map((d, i) => `<td class="${i === 0 ? 'sep ' : ''}fund">
      <div class="fv">${bn(d.v)}${d.est && d.v != null ? '<sup class="estm">E</sup>' : ''}</div>
      <div class="fg ${d.g == null ? '' : (d.g >= 0 ? 'up' : 'dn')}">${d.g == null ? '—' : pctSign(d.g)}</div>
    </td>`).join('');
  const cg = `<td class="fund"><div class="fv ${cagrVal == null ? '' : (cagrVal >= 0 ? 'up' : 'dn')}">${cagrVal == null ? '—' : pctSign(cagrVal)}</div></td>`;
  const pg = `<td class="fund"><div class="fv">${pegVal == null ? '—' : pegVal.toFixed(2)}</div></td>`;
  return yrs + cg + pg;
}

// ── The identity columns stay put ─────────────────────────────────────────────
// Ticker and Current (price and the two multiples it trades at) are what every
// other column is read AGAINST, and the table is 1,800px wide — so scrolling to
// the Economics end used to leave a row of numbers with nothing to say whose they
// were. They are sticky horizontally now.
//
// The offsets have to be measured rather than declared: the columns size to their
// contents, and a $17.33 book row is not as wide as a $653.61 one. Re-run after
// every render, and on resize, because the widths move with the content.
function pinColumns() {
  const tbl = $('cc-tbl');
  if (!tbl || tbl.hidden) return;
  const ref = [...tbl.querySelectorAll('tbody tr')]
    .find((tr) => tr.querySelectorAll('td[data-pin]').length >= 4);
  if (!ref) return;
  const w = [...ref.querySelectorAll('td[data-pin]')].slice(0, 4)
    .map((td) => td.getBoundingClientRect().width);
  const off = [0, w[0], w[0] + w[1], w[0] + w[1] + w[2]];
  tbl.querySelectorAll('[data-pin]').forEach((el) => {
    const i = +el.dataset.pin;
    el.style.left = (off[i] != null ? off[i] : 0) + 'px';
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
// Target multiple richer (higher) than current → green = called away at an
// expensive valuation (good for a call seller); cheaper → red.
const richer = (v, base) => (v != null && base != null) ? (v > base ? 'cheap' : 'rich') : '';

// Sortable Economics columns. 'portyield' and 'contrib' share an ordering since
// Contrib. = Port. yield ÷ constant. Missing values always sink to the bottom.
function sortVal(r, key) {
  if (key === 'wt') return r.weight ?? null;
  const m = metrics(r);
  if (key === 'yield') return m.yld ?? null;
  return m.contrib ?? null; // portyield + contrib
}
function sortedRows() {
  if (!sortKey) return rows;
  return rows.slice().sort((a, b) => {
    const va = sortVal(a, sortKey), vb = sortVal(b, sortKey);
    const na = va == null || isNaN(va), nb = vb == null || isNaN(vb);
    if (na && nb) return 0;
    if (na) return 1;
    if (nb) return -1;
    return (va - vb) * sortDir;
  });
}
const sarrow = (k) => sortKey === k ? (sortDir < 0 ? ' ▾' : ' ▴') : '';

function render() {
  // KPIs — everything in %, derived purely from weights (no $, no portfolio value).
  let portYld = 0, portAnn = 0, wUp = 0, wYld = 0, wIv = 0, wSum = 0, priced = 0, held = 0;
  rows.forEach((r) => {
    const m = metrics(r); if (r.err || !r.live) return;
    // An excluded row keeps its own numbers on screen and leaves every TOTAL alone
    // — the weight too, so Covered weight falls when you drop one and the averages
    // are taken over what is left rather than being diluted by a position you have
    // decided is not part of the question.
    if (r.excluded) { held += 1; return; }
    if (m.contrib != null) portYld += m.contrib;        // Σ weight × premium yield
    if (m.annContrib != null) portAnn += m.annContrib;  // Σ weight × annualized yield
    const w = r.weight || 0; wSum += w; priced += 1;
    if (m.upside != null) wUp += m.upside * w;
    if (m.yld != null) wYld += m.yld * w;
    if (r.live.iv != null) wIv += r.live.iv * w;
  });
  const kn = wSum || 1;
  $('cc-kpis').innerHTML = [
    ['Premium yield', pct(portYld, 2), `portfolio · ${priced} position${priced === 1 ? '' : 's'}${held ? ` · ${held} excluded` : ''}`],
    ['Annualized', pct(portAnn, 1), 'weight-scaled'],
    ['Avg upside to strike', pct(wUp / kn), 'weighted'],
    ['Avg premium yield', pct(wYld / kn, 2), 'per position'],
    ['Covered weight', pct(wSum, 1), 'of portfolio'],
  ].map(([l, v, s]) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`).join('');

  // header (two-row grouped). EBITDA/Net Income blocks toggle with showFund.
  const fundGroups = showFund
    ? `<th colspan="6" class="grp sep">EBITDA</th><th colspan="6" class="grp sep">Net Income</th>` : '';
  // No E in the header: whether a year is still a forecast is a per-NAME fact
  // (NVIDIA reports its fiscal year in January), so the E lives on the cell.
  const fyHdr = FY.map((y, i) => `<th${i === 0 ? ' class="sep"' : ''}>${fyLabel(y)}</th>`).join('') + `<th title="compound annual growth from ${fyLabel(FY[0])} to the selected Multiple basis — it moves when you change the basis">CAGR ${fyLabel(FY[0])}→${basisEndLabel()}</th><th>PEG</th>`;
  const fundLabels = showFund ? fyHdr + fyHdr : '';
  $('cc-thead').innerHTML = `
    <tr>
      <th rowspan="2" class="tkh" data-pin="0">Ticker</th>
      <th colspan="3" class="grp sep" data-pin="1">Current · ${mulBasis}</th>
      ${fundGroups}
      <th colspan="4" class="grp sep">Target · ${mulBasis}</th>
      <th colspan="5" class="grp sep">Economics</th>
      <th rowspan="2" class="sep"></th>
    </tr>
    <tr>
      <th class="sep" data-pin="1">Price</th><th data-pin="2">P/E</th><th data-pin="3">EV/EBITDA</th>
      ${fundLabels}
      <th class="sep">Strike</th><th>Impl. Upside</th><th>P/E</th><th>EV/EBITDA</th>
      <th class="sep sortable" data-sort="wt">Wt${sarrow('wt')}</th><th>Premium</th><th class="sortable" data-sort="yield">Yield${sarrow('yield')}</th><th class="sortable" data-sort="portyield">Port. yield${sarrow('portyield')}</th><th class="sortable" data-sort="contrib">Contrib.${sarrow('contrib')}</th>
    </tr>`;
  const ncol = 1 + 3 + (showFund ? 10 : 0) + 4 + 5 + 1; // total columns for colspans

  // body
  $('cc-tbody').innerHTML = sortedRows().map((r) => {
    if (r.loading) return `<tr><td class="tk" data-pin="0">${r.ticker}</td><td colspan="${ncol - 1}" class="muted">loading…</td></tr>`;
    if (r.err) return `<tr><td class="tk" data-pin="0">${r.ticker}</td><td colspan="${ncol - 2}" class="err">${r.err}</td>
      <td class="sep"><button class="x" data-del="${r.id}">✕</button></td></tr>`;
    const L = r.live, m = metrics(r);
    const ovr = r.override != null;
    const premVal = (m.premium != null) ? m.premium.toFixed(2) : '';
    // Share of the TOTAL premium yield — so an excluded row has none by definition,
    // and blanking it is what keeps the column summing to 100%. Its Port. yield
    // still prints: that is the row's own number, and seeing what you are setting
    // aside is the point of setting it aside rather than deleting it.
    const share = (!r.excluded && m.contrib != null && portYld) ? m.contrib / portYld : null;
    const cur = EST_STORE[r.ticker]?.currency || 'USD';
    const peg = (x) => x == null ? '' : `PEG ${x.toFixed(2)}`;
    const q2 = (x) => x != null ? `$${x.toFixed(2)}` : '—';
    const sp = spreadOf(L);
    const spLine = !sp ? '' : `<br><b>Spread</b> ${q2(sp.abs)} · ${(sp.pct * 100).toFixed(0)}% of mid`
      + (sp.noBid ? ' — <b>no bid</b>, so the mid is guesswork'
                  : ` — hitting the bid costs ${(sp.cross * 100).toFixed(0)}% of the premium`
                    + (sp.pct >= 0.10 ? ', and the yield on this row is quoted at the mid' : ''));
    const qtip = `<b>Bid</b> ${q2(L.bid)}   <b>Ask</b> ${q2(L.ask)}   <b>Mid</b> ${q2(L.mid)}<br><b>Last</b> ${q2(L.lastTrade)} · ${tradeStamp(L.lastTradeTs)}${spLine}`;
    const fund = showFund
      ? fundSection(fundSeries(r.ticker, 'ebitda'), cagr(r.ticker, 'ebitda'), m.pegEv)
        + fundSection(fundSeries(r.ticker, 'earnings'), cagr(r.ticker, 'earnings'), m.pegPe)
      : '';
    const mismatch = (L.usedExpiry && expiry && L.usedExpiry !== expiry) || (L.usedStrike != null && L.usedStrike !== r.strike);
    return `<tr class="${r.excluded ? 'excl' : ''}">
      <td class="tk" data-pin="0" title="${L.name || ''}">${r.ticker}${r.isEtf ? ' <span class="muted">ETF</span>' : (cur !== 'USD' ? ` <span class="cc" title="reports in ${cur}">${cur}</span>` : '')}</td>
      <td class="sep big" data-pin="1">${px(m.price)}</td>
      <td data-pin="2"><div class="fv">${mult(m.peP)}</div><div class="fg">${peg(m.pegPe)}</div></td>
      <td data-pin="3"><div class="fv">${mult(m.evP)}</div><div class="fg">${peg(m.pegEv)}</div></td>
      ${fund}
      <td class="sep edit"><input type="number" step="1" value="${r.strike}" data-strike="${r.id}" class="${r.autoStrike ? 'auto' : ''}" title="${r.autoStrike ? 'no strike in the book — nearest listed strike at or above spot; type the real one over it'
        : (r.strikeFrom ? `set from ${r.strikeFrom.M}x ${r.strikeFrom.kind === 'ev' ? 'EV/EBITDA' : 'P/E'} on ${r.strikeFrom.basis} ${r.strikeFrom.src} — implied $${r.strikeFrom.wanted.toFixed(2)}, snapped to the nearest listed strike` : 'strike sold')}"></td>
      <td class="up">${pct(m.upside, 1)}</td>
      <td class="${richer(m.peS, m.peP)} mcell"><input type="number" step="0.1" class="mx" data-setmult="${r.id}" data-kind="pe"
          value="${m.peS == null ? '' : m.peS.toFixed(1)}" ${m.peS == null ? 'disabled' : ''}
          title="${m.peS == null ? 'no P/E on this basis' : 'type the P/E you would accept being called away at — the strike jumps to the nearest listed one that gives it'}"><span class="mxu">x</span><div class="fg">${peg(m.pegPeS)}</div></td>
      <td class="${richer(m.evS, m.evP)} mcell"><input type="number" step="0.1" class="mx" data-setmult="${r.id}" data-kind="ev"
          value="${m.evS == null ? '' : m.evS.toFixed(1)}" ${m.evS == null ? 'disabled' : ''}
          title="${m.evS == null ? 'no EV/EBITDA on this basis' : 'type the EV/EBITDA you would accept being called away at — the strike jumps to the nearest listed one that gives it'}"><span class="mxu">x</span><div class="fg">${peg(m.pegEvS)}</div></td>
      <td class="sep edit"><input type="number" step="0.1" value="${(r.weight * 100).toFixed(2)}" data-weight="${r.id}" title="portfolio weight %"></td>
      <td class="edit${ovr ? '' : spreadClass(sp)}"><input type="number" step="0.01" value="${premVal}" data-prem="${r.id}" class="${ovr ? 'ovr' : ''}" title="${ovr ? 'manual override' : 'live midpoint — type to override'}"><span class="ttip" data-tip="${qtip}">i</span></td>
      <td class="big up">${pct(m.yld, 2)}</td>
      <td class="big up">${pct(m.contrib, 2)}</td>
      <td>${pct(share, 1)}</td>
      <td class="sep nowrap"><button class="ex${r.excluded ? ' off' : ''}" data-excl="${r.id}"
          title="${r.excluded ? 'excluded from the portfolio totals — click to count it again' : 'counting toward the portfolio totals — click to exclude it without deleting the row'}"
          aria-pressed="${r.excluded ? 'true' : 'false'}">${r.excluded ? '○' : '●'}</button><button class="x" data-del="${r.id}" title="${mismatch ? 'using '+L.usedStrike+' @ '+L.usedExpiry : 'remove the position'}">${mismatch ? '⚠' : '✕'}</button></td>
    </tr>`;
  }).join('');

  $('cc-tbl').hidden = false; $('cc-status').hidden = true;
  wireRowInputs();
  pinColumns();

  const anyMismatch = rows.some((r) => r.live && ((r.live.usedExpiry && expiry && r.live.usedExpiry !== expiry) || (r.live.usedStrike != null && r.live.usedStrike !== r.strike)));
  $('cc-foot').innerHTML = `
    <b>EBITDA / Net Income</b> = ${estSrc === 'summit' ? 'Summit model' : 'Bloomberg consensus'} ${fyLabel(FY[0])}–${fyLabel(FY[FY.length - 1])} native-currency millions with YoY growth below. Columns are <b>CALENDAR</b> years. A superscript <b>E</b> marks a year that name has not yet reported. NVIDIA closes its year in January and labels it one ahead, so what it calls FY2027 is calendar 2026 — its rows are shifted to the calendar here, which is what lets one set of columns compare the whole book. On <b>Consensus</b>, years already closed carry the reported figure (the Street publishes no estimate for a year that is done), so only the forward columns differ between the two sources · <b>CAGR</b> = ${fyLabel(FY[0])}→${basisEndLabel()}, i.e. it ENDS on whatever the Multiple basis is set to — change the basis and it re-measures, so it always describes the run into the year the multiples are priced on · <b>PEG</b> = current multiple ÷ basis growth% ·
    <b>Multiple basis (${mulBasis})</b> drives every P/E &amp; EV/EBITDA${mulBasis === 'NTM' ? ' — NTM is a calendar-weighted blend of '+fyLabel(FY[1])+'/'+fyLabel(FY[2])+' (no quarterly data)' : ''} · <b>Current</b> uses live price, <b>Target</b> uses the strike; the PEG under each multiple = that multiple ÷ basis growth · <b>Impl. Upside</b> = strike ÷ price − 1 ·
    hover the <b>i</b> by Premium for live bid / ask / mid, last trade (local time) and the spread · a Premium cell shaded <span class="spwk">amber</span> has a bid/ask spread of <b>10% of mid or more</b>, <span class="spxk">deeper amber</span> <b>25% or more</b> or no bid at all — the column quotes the MID, and a covered call is sold on the BID, so half that spread comes straight off the yield beside it. An overridden premium is not shaded: the number is yours, not the chain's ·
    <b>Yield</b> = premium ÷ price · <b>Port. yield</b> = yield × weight · <b>Contrib.</b> = Port. yield ÷ Σ Port. yield (share of total) ·
    <span class="cheap">green</span> = target multiple richer than current (called away at an expensive valuation).<br>
    <b>Target expiry</b> opens on the <b>roll date</b> — the third Friday of January, April, July or October, the Friday before earnings season starts — taking the nearest one that has not expired; the menu carries the next few ordinary expiries alongside every roll date.<br>
    Premium/IV/greeks are the live Massive option chain for each strike &amp; target expiry. <b>Edit the strike either way round.</b> Type a price into <b>Strike</b>, or type a multiple into <b>Target P/E</b> or <b>Target EV/EBITDA</b> and the strike moves to the nearest LISTED strike that produces it — which is the order the decision really happens in: not “$570 on Mastercard” but “happy to be called away at 24x”. The cell then shows the multiple the listed strike actually gives, so it will differ a little from what you typed; hover the strike to see the price the multiple implied before snapping. It reads the SELECTED basis year and estimate source, so change either and the same multiple means a different strike. Edit weight inline; type a premium to override the live midpoint. A strike shown <span class="autoink">in blue</span> is not in the book — it is the nearest listed strike at or above spot, picked so the row can price at all; type the real one over it. The <b>●</b> beside each row's ✕ drops that position out of the portfolio TOTALS without deleting it — its own numbers stay on screen and the row dims, but Premium yield, Annualized, both averages and Covered weight are taken over what is left, and Contrib. blanks on an excluded row and re-bases on the rest, so the column still sums to 100%. Port. yield keeps printing on an excluded row — that is its own number, and seeing what you set aside is the point. The KPI strip says how many are set aside. Nothing is stored, so a reload brings them all back. All figures are in % — no dollar amounts, no contracts, no portfolio value.
    ${anyMismatch ? '<br><span class="warn">⚠ some rows had no contract at the exact strike/expiry — nearest available was used (hover the ⚠).</span>' : ''}`;
}

function wireRowInputs() {
  document.querySelectorAll('#cc-root [data-strike]').forEach((el) => el.onchange = async () => {
    const r = rows.find((x) => x.id == el.dataset.strike); r.strike = parseFloat(el.value) || r.strike;
    r.autoStrike = false;   // typed over: it is a chosen strike now
    r.strikeFrom = null;    // ...and no longer the product of a multiple
    r.loading = true; render(); await fetchRow(r); render();
  });
  // Type a multiple, get a strike. The row remembers WHICH multiple set it, on
  // which basis year and which source, because "$570" means nothing six weeks
  // later while "24x on 2026E Summit" still does.
  document.querySelectorAll('#cc-root [data-setmult]').forEach((el) => el.onchange = async () => {
    const r = rows.find((x) => x.id == el.dataset.setmult);
    const M = parseFloat(el.value);
    const px = r ? strikeFromMultiple(r, el.dataset.kind, M) : null;
    if (px == null || !(px > 0)) { render(); return; }   // unusable input: put the old number back
    r.loading = true; render();
    const k = await nearestListed(r.ticker, expiry, px);
    if (k != null) {
      r.strike = k; r.autoStrike = false;
      r.strikeFrom = { kind: el.dataset.kind, M, basis: mulBasis, src: estSrc, wanted: px };
    }
    await fetchRow(r); render();
  });
  document.querySelectorAll('#cc-root [data-weight]').forEach((el) => el.onchange = () => {
    const r = rows.find((x) => x.id == el.dataset.weight); r.weight = (parseFloat(el.value) || 0) / 100; render();
  });
  document.querySelectorAll('#cc-root [data-prem]').forEach((el) => el.onchange = () => {
    const r = rows.find((x) => x.id == el.dataset.prem);
    r.override = el.value === '' ? null : parseFloat(el.value); render();
  });
  // Exclude / include. No refetch: the row's own numbers do not change, only whether
  // the totals count them, so this is a re-render and nothing more.
  document.querySelectorAll('#cc-root [data-excl]').forEach((el) => el.onclick = () => {
    const r = rows.find((x) => x.id == el.dataset.excl);
    if (r) { r.excluded = !r.excluded; render(); }
  });
  document.querySelectorAll('#cc-root [data-del]').forEach((el) => el.onclick = () => {
    rows = rows.filter((x) => x.id != el.dataset.del); render();
  });
}

// ── The roll date ─────────────────────────────────────────────────────────────
// The book rolls on the Friday before earnings season opens — the third Friday
// of January, April, July and October — so that is what the tab opens on: the
// nearest one that has not expired. Computed, not tabulated, so it keeps working
// every quarter without anyone editing a list.
function thirdFriday(year, monthIdx) {
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const firstFri = 1 + ((5 - first.getUTCDay() + 7) % 7);  // 5 = Friday
  return new Date(Date.UTC(year, monthIdx, firstFri + 14)).toISOString().slice(0, 10);
}
// The next `n` season Fridays from today. A contract expiring today has not
// expired yet (it dies at the close), so today itself still counts.
function seasonFridays(n) {
  const today = new Date().toISOString().slice(0, 10);
  const out = [];
  for (let y = new Date().getUTCFullYear(); out.length < n; y++) {
    [0, 3, 6, 9].forEach((m) => {
      const d = thirdFriday(y, m);
      if (d >= today && out.length < n) out.push(d);
    });
  }
  return out;
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

  // Each season Friday, mapped onto what is actually listed (they are standard
  // monthlies, so this is normally the same date). Anything past the end of the
  // chain simply drops out.
  const season = seasonFridays(4).map((t) => dates.find((d) => d >= t)).filter(Boolean);
  const isSeason = new Set(season);
  // The menu: the next couple of months of ordinary expiries, plus every roll
  // date, so the book can be moved forward a quarter without leaving the tab.
  const opts = [...new Set(dates.slice(0, 10).concat(season))].sort();

  const def = season[0] || opts.find((x) => daysTo(x) >= 20) || opts[0];
  expiry = def;
  $('cc-expiry').innerHTML = opts.map((x) =>
    `<option value="${x}" ${x === def ? 'selected' : ''}>${x} · ${daysTo(x)}d${isSeason.has(x) ? ' · roll' : ''}</option>`).join('');
  $('cc-expiry').onchange = async () => { expiry = $('cc-expiry').value; await loadAll(); };
}

// ── Load all rows ─────────────────────────────────────────────────────────────
async function loadAll() {
  rows.forEach((r) => { r.loading = true; r.live = null; r.err = null; });
  render();
  await Promise.all(rows.map((r) => fetchRow(r)));
  render();
}

// ── Markup + wire-up ──────────────────────────────────────────────────────────
function injectMarkup() {
  $('cc-root').innerHTML = `
    <div class="cc-wrap">
      <div class="der-head">
        <h2>Covered Calls — Live</h2>
        <span class="pill">live · Massive</span>
        <div class="controls">
          <div class="ctl"><label>Target expiry</label><select id="cc-expiry"><option>loading…</option></select></div>
          <div class="ctl"><label>Estimates <span id="cc-vintage"></span></label><span id="cc-srcWrap"></span></div>
          <div class="ctl"><label>Multiple basis</label>
            <div class="seg" id="cc-basisSel">
              <button data-basis="2026E">2026E</button><button data-basis="2027E">2027E</button><button data-basis="2028E">2028E</button><button data-basis="NTM">NTM</button>
            </div>
          </div>
          <div class="ctl"><label>&nbsp;</label><button id="cc-togFund" class="ghost">Hide EBITDA / NI</button></div>
          <div class="ctl"><label>&nbsp;</label><button id="cc-refresh">↻ Refresh live</button></div>
        </div>
      </div>
      <div class="sub">Premium, IV &amp; greeks pull live from the Massive option chain for each strike/expiry · valuation-if-exercised uses Summit forward EBITDA/EPS · nothing is stored</div>
      <div class="kpis" id="cc-kpis"></div>
      <div class="card">
        <div id="cc-status" class="spin">Loading live data…</div>
        <table id="cc-tbl" hidden><thead id="cc-thead"></thead><tbody id="cc-tbody"></tbody></table>
      </div>
      <div class="addrow">
        <div class="ctl"><label>Add ticker</label><input id="cc-newtk" placeholder="TICKER" /></div>
        <div class="ctl"><label>Strike</label><input id="cc-newstrike" type="number" step="1" /></div>
        <div class="ctl"><label>Weight (%)</label><input id="cc-newweight" type="number" step="0.1" /></div>
        <div class="ctl"><label>&nbsp;</label><button id="cc-addbtn" class="ghost sm">+ Add position</button></div>
      </div>
      <div class="foot" id="cc-foot"></div>
    </div>
    <div id="cc-tip"></div>`;
}

function wireControls() {
  $('cc-refresh').onclick = () => loadAll();

  // Estimates source. Unlike the single-name panes this is a whole book, so a
  // source counts as available when ANY position carries it; the rows that do not
  // simply show "—" for their multiples, which is the honest answer for them.
  const renderSrc = () => {
    const have = new Set();
    rows.forEach((r) => optSources(r.ticker).forEach((k) => have.add(k)));
    $('cc-srcWrap').innerHTML = [['summit', 'Summit'], ['consensus', 'Consensus']].map(([k, lbl]) => {
      const missing = !have.has(k);
      return `<button type="button" data-src="${k}" class="${k === estSrc ? 'on' : ''}"
        ${missing ? 'disabled' : ''} title="${missing ? 'no ' + lbl + ' estimates in this book' : lbl + ' estimates'}">${lbl}</button>`;
    }).join('');
  };
  // How old the book's estimates are. This is a BOOK, not one name, and the
  // positions carry different snapshot dates — so what matters is the OLDEST one,
  // because that is the weakest number any multiple on screen rests on. The badge
  // shows the range and names the laggard; hovering lists every position's date.
  const renderVintage = () => {
    const el = $('cc-vintage'); if (!el) return;
    const seen = rows.map((r) => {
      const s = EST_STORE[r.ticker]; if (!s) return null;
      const d = estSrc === 'summit' ? s.snapshot : s.consensusAsOf;
      const from = estSrc === 'summit' ? 'snapshot' : s.consensusFrom;
      return d ? { tk: r.ticker, d, from, age: ageDays(d) } : null;
    }).filter(Boolean).sort((a, b) => b.age - a.age);
    if (!seen.length) { el.innerHTML = ''; return; }
    const oldest = seen[0], newest = seen[seen.length - 1];
    // Every date here is inherited from a workbook save, never an observed pull,
    // so the ~ stays until a dated Bloomberg export replaces one.
    const inherited = seen.some((s) => s.from !== 'bbg');
    const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    const span = oldest.d === newest.d ? fmt(oldest.d) : `${fmt(oldest.d)}–${fmt(newest.d)}`;
    const tip = `Oldest first — every multiple on a row is only as current as its own set:<br>`
      + seen.map((s) => `<b>${esc(s.tk)}</b> ${s.d} · ${s.age}d${s.age > STALE_DAYS ? ' — past a full quarter' : ''}`).join('<br>')
      + (inherited ? `<br><br>A <b>~</b> means the date came from the Summit workbook's save, not from a dated Bloomberg pull, so it is the oldest the numbers can be — they may be older.` : '');
    el.className = 'vintwrap';
    el.innerHTML = `<span class="vintage ${oldest.age > STALE_DAYS ? 'stale' : (inherited ? 'inherited' : 'observed')}"
      data-tip="${esc(tip)}">${inherited ? '~' : ''}${esc(span)} · up to ${oldest.age}d</span>`;
  };
  $('cc-srcWrap').className = 'seg';
  renderSrc(); renderVintage();
  document.addEventListener('click', (e) => {
    const b = e.target.closest('#cc-srcWrap button');
    if (!b || b.disabled) return;
    estSrc = b.dataset.src; renderSrc(); renderVintage(); render();
  });

  // Multiple basis segmented toggle — re-renders only (uses already-fetched data).
  const syncBasis = () => document.querySelectorAll('#cc-basisSel button')
    .forEach((b) => b.classList.toggle('on', b.dataset.basis === mulBasis));
  document.querySelectorAll('#cc-basisSel button').forEach((b) => b.onclick = () => { mulBasis = b.dataset.basis; syncBasis(); render(); });
  syncBasis();

  // Sortable Economics headers (Wt / Yield / Port. yield / Contrib.). Click to
  // sort high→low, click again to flip. Delegated so it survives re-renders.
  document.addEventListener('click', (e) => {
    const th = e.target.closest('#cc-root th[data-sort]');
    if (!th) return;
    const key = th.dataset.sort;
    if (sortKey === key) sortDir = -sortDir;
    else { sortKey = key; sortDir = -1; }
    render();
  });

  // Hide / show the EBITDA & Net Income blocks.
  $('cc-togFund').onclick = () => {
    showFund = !showFund;
    $('cc-togFund').textContent = showFund ? 'Hide EBITDA / NI' : 'Show EBITDA / NI';
    render();
  };

  // The pinned columns are placed from measured widths, so a resize moves them.
  window.addEventListener('resize', pinColumns);

  // Hover tooltip (bid / ask / mid + trade time on the Premium cell). Delegated
  // on document so it keeps working across re-renders.
  const tipEl = $('cc-tip');
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('#cc-root [data-tip]');
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
    if (e.target.closest('#cc-root [data-tip]')) tipEl.classList.remove('on');
  });

  $('cc-addbtn').onclick = async () => {
    const tk = ($('cc-newtk').value || '').trim().toUpperCase();
    const strike = parseFloat($('cc-newstrike').value);
    if (!tk || !strike) return;
    const weight = (parseFloat($('cc-newweight').value) || 0) / 100;
    const r = { id: Date.now(), ticker: tk, reason: '', strike, weight,
                seedPrime: null, isEtf: !EST_STORE[tk], override: null, live: null, loading: true, err: null };
    rows.push(r); $('cc-newtk').value = ''; $('cc-newstrike').value = ''; $('cc-newweight').value = '';
    render(); await fetchRow(r); render();
  };
}

// ── Page loader (called once on first tab visit) ──────────────────────────────
let _inited = false;
export async function loadCoveredCallsPage() {
  if (_inited) return;
  _inited = true;
  injectMarkup();
  wireControls();
  await loadExpirations();
  await loadAll();
}
