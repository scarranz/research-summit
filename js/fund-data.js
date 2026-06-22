// fund-data.js — Data adapter for the Fund Returns tab.
//
// DESIGN PHASE (today): reads local CSVs in /data (served only by the local dev
// server; gitignored, never deployed):
//   · STRATEGY_RETURNS.csv — the spliced strategy daily series 2022→2026
//     (strategy through 2025-09-30, then EGB), columns date,period_return,total_beta
//   · BENCHMARK_SPY.csv — SPY daily closes 2020→2026, columns date,close
//
// PRODUCTION (later): swap the internals so the strategy series comes from the
// Summit DB (spliced upstream, by portfolio_id) and the benchmark from Massive
// (SPY/S&P prices). The calc engine and page never change — only this file.

async function loadCsv(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (HTTP ${res.status})`);
  return parseCsv(await res.text());
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

// 'YYYY-MM-DD...' → local-midnight Date (avoids timezone drift in grouping)
function toDate(s) {
  const [y, m, d] = s.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Strategy daily return series. [{ date, r, beta }]
export async function getStrategy() {
  const rows = await loadCsv('data/STRATEGY_RETURNS.csv');
  return rows
    .filter(r => r.date && r.period_return !== '')
    .map(r => ({
      date: toDate(r.date),
      r: parseFloat(r.period_return),
      beta: r.total_beta !== undefined && r.total_beta !== '' ? parseFloat(r.total_beta) : null,
    }))
    .filter(p => !Number.isNaN(p.r))
    .sort((a, b) => a.date - b.date);
}

// Benchmark daily returns aligned 1:1 to the strategy dates. The return on each
// fund date is close_t / close_(prev fund date) − 1; the very first fund date
// uses the close of the prior available business day (validated: SPY reproduces
// the Excel/guide benchmark exactly, e.g. EGB 2025 +16.35%, overall +24.71%).
export async function getBenchmark(strategyDates) {
  const rows = await loadCsv('data/BENCHMARK_SPY.csv');
  const spy = rows
    .filter(r => r.date && r.close !== '')
    .map(r => ({ date: toDate(r.date), close: parseFloat(r.close) }))
    .filter(p => !Number.isNaN(p.close))
    .sort((a, b) => a.date - b.date);

  // close on `target` or the most recent close before it (two-pointer over spy)
  let j = 0;
  const closeOnOrBefore = (target) => {
    while (j + 1 < spy.length && spy[j + 1].date <= target) j++;
    return spy[j].close;
  };

  const out = [];
  if (!strategyDates.length || !spy.length) return out;

  // prior business-day close for the first fund date
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
