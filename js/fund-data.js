// fund-data.js -- Data adapter for the Fund Returns tab.
//
// The daily return series is EMBEDDED in js/fund-returns-data.js as a plain CSV
// string (date, summit, sp500, beta). That makes the dashboard a self-contained
// mockup: it works on the static site with no database and no build step, and the
// whole logged-in team sees the same numbers. To update the figures, edit only
// js/fund-returns-data.js -- see the instructions at the top of that file.
//
// Only daily total returns live here; no portfolio holdings are stored.
//
// PRODUCTION (later): swap parseRows() for the Summit DB + Massive. The calc
// engine (fund-calc.js) and the page (fund-returns.js) never change, because the
// shapes returned by getStrategy()/getBenchmark() stay the same.
import { FUND_RETURNS_CSV } from './fund-returns-data.js';

// 'YYYY-MM-DD...' -> local-midnight Date (avoids timezone drift in grouping)
function toDate(s) {
  const [y, m, d] = String(s).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

let _rows = null; // parsed once, cached

// Parse the embedded CSV into aligned [{ date, summit, sp500, beta }] rows.
// Columns are matched by header name (case-insensitive) so the CSV is forgiving
// to reorder; only `date`, `summit` and `sp500` are required. Rows missing any
// of those are dropped, which keeps the strategy and benchmark series in lockstep.
function parseRows() {
  if (_rows) return _rows;
  const lines = FUND_RETURNS_CSV.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idx = (...names) => header.findIndex(h => names.includes(h));
  const di = idx('date', 'fecha');
  const si = idx('summit', 'strategy', 'summit_return');
  const bi = idx('sp500', 'sp', 'benchmark', 'spx', 'sp_500');
  const betai = idx('beta', 'total_beta');

  _rows = lines.slice(1).map(line => {
    const c = line.split(',');
    const summit = Number(c[si]);
    const sp500 = Number(c[bi]);
    const betaRaw = betai >= 0 ? c[betai] : '';
    return {
      date: toDate(c[di]),
      summit,
      sp500,
      beta: (betaRaw != null && String(betaRaw).trim() !== '') ? Number(betaRaw) : null,
    };
  })
    .filter(p => !Number.isNaN(p.summit) && !Number.isNaN(p.sp500))
    .sort((a, b) => a.date - b.date);
  return _rows;
}

// Strategy daily return series. [{ date, r, beta }]
export async function getStrategy() {
  return parseRows().map(p => ({ date: p.date, r: p.summit, beta: p.beta }));
}

// Benchmark daily returns, already aligned 1:1 to the strategy by construction
// (same source rows, same order). The argument is accepted for API compatibility
// with the previous SPY-close adapter but is no longer needed. [{ date, r }]
export async function getBenchmark(_strategyDates) {
  return parseRows().map(p => ({ date: p.date, r: p.sp500 }));
}
