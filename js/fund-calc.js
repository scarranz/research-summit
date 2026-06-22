// fund-calc.js — Return calculation engine.
// Pure functions that replicate the Excel "Comparison vs Benchmark" formulas.
// No I/O: feed these a daily return series and a date range. This is the piece
// validated against the Excel verification cases (spec §8) and must stay pure so
// it can be unit-checked and reused regardless of where the data comes from.
//
// A "series" is an array of { date: Date, r: number } sorted ascending,
// where r is a daily time-weighted return as a decimal (not %).

// ─── Range filter (the parametric INI/FIN that everything depends on) ───
export function filterByRange(series, ini, fin) {
  return series.filter(p => p.date >= ini && p.date <= fin);
}

// ─── Calc 2: total / cumulative return = PRODUCT(1 + r) − 1 ───
export function totalReturn(series) {
  let prod = 1;
  for (const p of series) prod *= (1 + p.r);
  return prod - 1;
}

// ─── Calc 2 (series form): running cumulative, for the line chart ───
export function cumulativeSeries(series) {
  let prod = 1;
  return series.map(p => {
    prod *= (1 + p.r);
    return { date: p.date, cum: prod - 1 };
  });
}

// ─── Calc 3: annualized return (CAGR) ───
// The Excel overall uses ^(1/yearsSpan) where yearsSpan is the integer year
// difference (e.g. 2025 − 2022 = 3). We replicate that exactly so the number
// matches the verification table. NOTE (flagged in spec §3, Cálculo 3): this
// integer-year convention is what the Excel does; a calendar-accurate version
// (^(252/n_obs)) is on the table for a later refinement.
export function yearsSpan(ini, fin) {
  return fin.getFullYear() - ini.getFullYear();
}
export function annualizedReturn(totalRet, ini, fin) {
  const years = yearsSpan(ini, fin);
  if (years <= 0) return totalRet; // sub-year window: don't annualize
  return Math.pow(1 + totalRet, 1 / years) - 1;
}

// ─── Calc 4: annualized volatility = STDEV.P(returns) × √252 ───
// Uses the POPULATION standard deviation (STDEV.P) to match the Excel "overall".
export function annualizedVol(series) {
  const n = series.length;
  if (n === 0) return 0;
  const mean = series.reduce((s, p) => s + p.r, 0) / n;
  const variance = series.reduce((s, p) => s + (p.r - mean) ** 2, 0) / n;
  return Math.sqrt(variance) * Math.sqrt(252);
}

// ─── Yearly returns: group by calendar year, PRODUCT(1 + r) − 1 per year ───
export function yearlyReturns(series) {
  const byYear = new Map();
  for (const p of series) {
    const y = p.date.getFullYear();
    byYear.set(y, (byYear.get(y) ?? 1) * (1 + p.r));
  }
  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, prod]) => ({ year, r: prod - 1 }));
}

// ─── Align two series by date (inner join) → { dates, a, b } ───
// Returns the daily returns of both series only on dates present in both.
export function alignByDate(seriesA, seriesB) {
  const mapB = new Map(seriesB.map(p => [p.date.getTime(), p.r]));
  const dates = [], a = [], b = [];
  for (const p of seriesA) {
    const t = p.date.getTime();
    if (mapB.has(t)) { dates.push(p.date); a.push(p.r); b.push(mapB.get(t)); }
  }
  return { dates, a, b };
}
