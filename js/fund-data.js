// fund-data.js -- Data adapter for the Return Analysis tab.
//
// Assembles one portfolio's daily series out of two halves and hands the page a
// single aligned pair (portfolio + benchmark). Nothing downstream knows or cares
// where a given day came from.
//
//   before HISTORY_CUTOFF    js/fund-history-data.js  frozen, committed, closed
//   on/after HISTORY_CUTOFF  the database (live, T-1)  <- the daily feed
//                            ...or js/fund-live-seed.js if the database has
//                               nothing for this portfolio yet
//
// The database is always asked first. The seed exists so the tab is complete
// while the feed is being connected, and so a late or unreachable feed degrades
// to "slightly stale" instead of "blank page". When the table is populated the
// database wins on its own -- no code change, no migration.
//
// Only daily total returns are handled here; no holdings, ever.
import { PORTFOLIOS, HISTORY_CUTOFF, getPortfolio } from './fund-portfolios.js';
import { FUND_HISTORY } from './fund-history-data.js';
import { FUND_LIVE_SEED } from './fund-live-seed.js';
import { fetchPortfolios, fetchPortfolioReturns, fetchBenchmarkPrices } from './api.js';

const _cache = new Map();   // code -> resolved series
let _dbPortfolios = null;   // null = not asked yet, [] = asked and unavailable

// ─── CSV parsing ────────────────────────────────────────────
// Columns are matched by header NAME, so the files tolerate reordering and a
// few spellings. Only the date, the portfolio return and the benchmark return
// are required; a row missing any of them is dropped, which is what keeps the
// two series in lockstep.
function parseCsv(text) {
  if (!text) return [];
  const lines = String(text).trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idx = (...names) => header.findIndex(h => names.includes(h));
  const di = idx('date', 'fecha');
  const pi = idx('portfolio', 'summit', 'strategy', 'r', 'daily_return', 'period_return');
  const bi = idx('benchmark', 'sp500', 'sp', 'spx', 'sp_500');
  const bti = idx('beta', 'total_beta');
  const out = [];
  for (const line of lines.slice(1)) {
    const c = line.split(',');
    const date = String(c[di] ?? '').trim().slice(0, 10);
    const r = Number(c[pi]), b = Number(c[bi]);
    if (!date || Number.isNaN(r) || Number.isNaN(b)) continue;
    const rawBeta = bti >= 0 ? String(c[bti] ?? '').trim() : '';
    out.push({ date, r, b, beta: rawBeta === '' ? null : Number(rawBeta) });
  }
  return out;
}

// 'YYYY-MM-DD' -> local-midnight Date (avoids the timezone drift that would
// otherwise push days into the wrong month or year when grouping).
function toDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isoShift(iso, days) {
  const d = toDate(iso);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Live half: the database ────────────────────────────────
// Returns rows in the same shape parseCsv produces, or null if the database
// cannot serve this portfolio (table missing, not populated yet, no session).
async function loadLiveFromDb(portfolio) {
  try {
    if (_dbPortfolios === null) {
      const res = await fetchPortfolios();
      _dbPortfolios = res.success ? (res.data || []) : [];
    }
    const match = _dbPortfolios.find(p => p.code === portfolio.code);
    if (!match) return null;

    const rows = await fetchPortfolioReturns(match.id, HISTORY_CUTOFF);
    if (!rows.success || !rows.data || !rows.data.length) return null;

    // Benchmark closes start a little before the cutoff so the first live day
    // has a prior close to compute its return against.
    const prices = await fetchBenchmarkPrices(portfolio.benchmark, isoShift(HISTORY_CUTOFF, -10));
    if (!prices.success || !prices.data || !prices.data.length) return null;

    const bench = closesToReturns(prices.data);
    const out = [];
    for (const row of rows.data) {
      const date = String(row.date).slice(0, 10);
      const b = bench.get(date);
      if (b === undefined) continue;          // no benchmark that day -> drop it
      const r = Number(row.daily_return);
      if (Number.isNaN(r)) continue;
      out.push({ date, r, b, beta: row.beta == null ? null : Number(row.beta) });
    }
    return out.length ? out : null;
  } catch (err) {
    console.warn('[fund-data] live feed unavailable, falling back:', err.message);
    return null;
  }
}

// [{date, close}] -> Map(date -> simple close-to-close return). This is the same
// method used to build the benchmark column of the frozen history, and it
// reproduces it exactly over the days where the two overlap.
function closesToReturns(rows) {
  const sorted = rows
    .map(r => ({ date: String(r.date).slice(0, 10), close: Number(r.close) }))
    .filter(r => r.date && !Number.isNaN(r.close))
    .sort((a, b) => a.date < b.date ? -1 : 1);
  const m = new Map();
  for (let i = 1; i < sorted.length; i++) m.set(sorted[i].date, sorted[i].close / sorted[i - 1].close - 1);
  return m;
}

// ─── Public API ─────────────────────────────────────────────
// The portfolios offered in the tab's toggle. The registry is the source of
// truth for what the front end shows; the database only supplies ids.
export async function getPortfolios() {
  return PORTFOLIOS.map(p => ({ code: p.code, label: p.label }));
}

// One portfolio's full series, history and live spliced together.
//
//   { portfolio: [{ date: Date, r, beta }],
//     benchmark: [{ date: Date, r }],        <- index-aligned with portfolio
//     meta: { ... } }
//
// The two arrays are aligned position by position, because everything the calc
// engine does (correlation, beta, capture, alpha) reads them by index.
export async function getSeries(code) {
  if (_cache.has(code)) return _cache.get(code);

  const portfolio = getPortfolio(code);
  const history = parseCsv(FUND_HISTORY[portfolio.code]).filter(p => p.date < HISTORY_CUTOFF);

  let live = await loadLiveFromDb(portfolio);
  let liveSource = 'db';
  if (!live) {
    live = parseCsv(FUND_LIVE_SEED[portfolio.code]).filter(p => p.date >= HISTORY_CUTOFF);
    liveSource = live.length ? 'seed' : 'none';
  } else {
    live = live.filter(p => p.date >= HISTORY_CUTOFF);
  }

  // Splice. There is no overlap by construction, but a Map keyed by date makes
  // that guarantee explicit: a duplicated day resolves to the live copy instead
  // of silently appearing twice and double-counting in the compounding.
  const byDate = new Map();
  for (const p of history) byDate.set(p.date, p);
  for (const p of live) byDate.set(p.date, p);
  const rows = [...byDate.values()].sort((a, b) => a.date < b.date ? -1 : 1);

  const result = {
    portfolio: rows.map(p => ({ date: toDate(p.date), r: p.r, beta: p.beta })),
    benchmark: rows.map(p => ({ date: toDate(p.date), r: p.b })),
    meta: {
      code: portfolio.code,
      label: portfolio.label,
      benchmark: portfolio.benchmark,
      benchmarkLabel: portfolio.benchmarkLabel,
      benchmarkShort: portfolio.benchmarkShort || portfolio.benchmarkLabel,
      currency: portfolio.currency,
      liveSource,
      historyThrough: history.length ? toDate(history[history.length - 1].date) : null,
      liveFrom: live.length ? toDate(live[0].date) : null,
      through: rows.length ? toDate(rows[rows.length - 1].date) : null,
      days: rows.length,
    },
  };
  _cache.set(code, result);
  return result;
}

// Drop the cache so the next getSeries() re-reads the live feed. Used when the
// user explicitly asks for fresh data.
export function invalidate(code) {
  if (code) _cache.delete(code); else _cache.clear();
  _dbPortfolios = null;
}
