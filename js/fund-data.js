// fund-data.js — Data adapter for the Fund Returns tab.
//
// DESIGN PHASE (today): reads the local CSVs in /data (served only on the local
// dev server; they are gitignored and never deployed). These CSVs define the
// schema/contract of the data.
//
// PRODUCTION (later): swap the internals of these two functions so that
//   · the portfolio return series comes from the Summit DB (by portfolio_id)
//   · the benchmark (S&P 500) series comes from Massive
// The calculation engine (fund-calc.js) and the page (fund-returns.js) never see
// where the data came from — only this file changes when the DB/Massive land.

const DATA_DIR = 'data/';

async function loadCsv(file) {
  const res = await fetch(DATA_DIR + file);
  if (!res.ok) throw new Error(`No se pudo cargar ${file} (HTTP ${res.status})`);
  return parseCsv(await res.text());
}

// Minimal CSV parser — the columns we read (date + return) contain no embedded
// commas, so a plain split is safe and avoids pulling in a dependency.
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

// Parse a 'YYYY-MM-DD...' string into a local-midnight Date. Using the y/m/d
// parts (not new Date(string)) avoids timezone drift that would otherwise shift
// year grouping and range filters by a day.
function toDate(s) {
  const [y, m, d] = s.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Strategy (Summit) daily return series — already the spliced multi-portfolio
// series (spec §3.A). Source today: DATA_port_return.csv.
export async function getStrategyReturns() {
  const rows = await loadCsv('DATA_port_return.csv');
  return rows
    .filter(r => r.date && r.period_return !== '')
    .map(r => ({ date: toDate(r.date), r: parseFloat(r.period_return) }))
    .filter(p => !Number.isNaN(p.r))
    .sort((a, b) => a.date - b.date);
}

// Benchmark (S&P 500) daily return series. Source today: BENCHMARK_SP500.csv.
// Production: Massive.
export async function getBenchmarkReturns() {
  const rows = await loadCsv('BENCHMARK_SP500.csv');
  return rows
    .filter(r => r.date && r.daily_return !== '')
    .map(r => ({ date: toDate(r.date), r: parseFloat(r.daily_return) }))
    .filter(p => !Number.isNaN(p.r))
    .sort((a, b) => a.date - b.date);
}
