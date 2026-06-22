// fund-data.js — Data adapter for the Fund Returns tab.
//
// Source priority:
//   1. Supabase (RLS-gated tables) — shared, so the whole logged-in team sees it.
//   2. Local CSVs in /data — design-phase fallback so the dashboard still works
//      locally before the Supabase tables have been loaded (gitignored, local only).
//
// The strategy series is the spliced track record (strategy through 2025-09-30,
// then EGB); the benchmark is SPY closes (interim → Massive in production).
// PRODUCTION: swap the Supabase calls for the Summit DB + Massive — the calc
// engine and page never change.
import { fetchFundReturns, fetchBenchmarkPrices } from './api.js';

const CSV_STRATEGY = 'data/STRATEGY_RETURNS.csv';
const CSV_BENCHMARK = 'data/BENCHMARK_SPY.csv';

// 'YYYY-MM-DD...' → local-midnight Date (avoids timezone drift in grouping)
function toDate(s) {
  const [y, m, d] = String(s).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}
async function loadCsv(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (HTTP ${res.status})`);
  return parseCsv(await res.text());
}

// Supabase first; fall back to the local CSV if the tables aren't there yet.
async function loadRows(supabaseFetch, csvPath) {
  try {
    const res = await supabaseFetch();
    if (res.success && res.data && res.data.length) return res.data;
  } catch (_) { /* fall through to CSV */ }
  return loadCsv(csvPath);
}

// Strategy daily return series. [{ date, r, beta }]
export async function getStrategy() {
  const rows = await loadRows(() => fetchFundReturns('STRATEGY'), CSV_STRATEGY);
  return rows
    .map(r => ({
      date: toDate(r.date),
      r: Number(r.period_return),
      beta: (r.total_beta != null && r.total_beta !== '') ? Number(r.total_beta) : null,
    }))
    .filter(p => !Number.isNaN(p.r))
    .sort((a, b) => a.date - b.date);
}

// Benchmark daily returns aligned 1:1 to the strategy dates. The return on each
// fund date is close_t / close_(prev fund date) − 1; the first fund date uses
// the close of the prior available business day.
export async function getBenchmark(strategyDates) {
  const rows = await loadRows(() => fetchBenchmarkPrices('SPY'), CSV_BENCHMARK);
  const spy = rows
    .map(r => ({ date: toDate(r.date), close: Number(r.close) }))
    .filter(p => !Number.isNaN(p.close))
    .sort((a, b) => a.date - b.date);

  const out = [];
  if (!strategyDates.length || !spy.length) return out;

  let j = 0;
  const closeOnOrBefore = (target) => {
    while (j + 1 < spy.length && spy[j + 1].date <= target) j++;
    return spy[j].close;
  };

  const first = strategyDates[0];
  let prevClose = spy[0].close;
  for (const p of spy) { if (p.date < first) prevClose = p.close; else break; }

  for (const d of strategyDates) {
    const c = closeOnOrBefore(d);
    out.push({ date: d, r: c / prevClose - 1 });
    prevClose = c;
  }
  return out;
}
