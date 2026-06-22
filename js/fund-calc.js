// fund-calc.js — Return & risk calculation engine.
// Pure functions replicating the Excel "Comparison vs Benchmark" formulas
// (spec §3) and the slide-2/slide-3 tables. No I/O. Validated in PowerShell:
// spliced strategy 2022→2026 total 61.65%, vol 18.58%, S&P 57.22%, corr 82.1%,
// beta 0.863, Sharpe 0.37/0.35, IR 0.06.
//
// Series:  [{ date: Date, r: number, beta?: number|null }] sorted ascending.
// Arrays:  plain number[] of daily/monthly returns (used by the stat helpers;
//          strategy & benchmark arrays must be positionally aligned by date).

const TD = 252; // trading days / year

// ─── basic array stats ──────────────────────────────────────
export function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
function variance(a, sample = false) {
  const n = a.length; if (n < (sample ? 2 : 1)) return 0;
  const m = mean(a);
  return a.reduce((s, x) => s + (x - m) ** 2, 0) / (sample ? n - 1 : n);
}
export function stdP(a) { return Math.sqrt(variance(a, false)); }
export function stdS(a) { return Math.sqrt(variance(a, true)); }

// product of (1+r) − 1
export function totalReturnArr(a) { let p = 1; for (const x of a) p *= (1 + x); return p - 1; }
// annualized via the trading-day convention: (1+total)^(252/n) − 1
export function annualizedArr(a) {
  if (!a.length) return 0;
  return Math.pow(1 + totalReturnArr(a), TD / a.length) - 1;
}
// annualized volatility = STDEV[.P/.S] × √252
export function volArr(a, sample = false) { return (sample ? stdS(a) : stdP(a)) * Math.sqrt(TD); }

// ─── series helpers ─────────────────────────────────────────
export function filterByRange(series, ini, fin) {
  return series.filter(p => p.date >= ini && p.date <= fin);
}
export function rets(series) { return series.map(p => p.r); }

export function totalReturn(series) { return totalReturnArr(rets(series)); }

export function cumulativeSeries(series) {
  let p = 1;
  return series.map(pt => { p *= (1 + pt.r); return { date: pt.date, cum: p - 1 }; });
}

// average portfolio beta over the window (Beta Ante); skips missing betas
export function betaAnte(series) {
  const b = series.map(p => p.beta).filter(v => v != null && !Number.isNaN(v));
  return b.length ? mean(b) : null;
}

// ─── two-series (aligned) stats ─────────────────────────────
export function correlation(a, b) {
  const n = Math.min(a.length, b.length); if (n < 2) return 0;
  const ma = mean(a), mb = mean(b);
  let cov = 0, va = 0, vb = 0;
  for (let i = 0; i < n; i++) { cov += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; }
  return cov / Math.sqrt(va * vb);
}
// Beta Post = COVAR(summit, bench) / VAR(bench)
export function betaPost(summit, bench) {
  const n = Math.min(summit.length, bench.length); if (n < 2) return 0;
  const ms = mean(summit), mb = mean(bench);
  let cov = 0, vb = 0;
  for (let i = 0; i < n; i++) { cov += (summit[i] - ms) * (bench[i] - mb); vb += (bench[i] - mb) ** 2; }
  return cov / vb;
}
// Sharpe = (annualized − RFR) / annualized vol
export function sharpe(a, rfr, sample = false) { return (annualizedArr(a) - rfr) / volArr(a, sample); }
// Information Ratio = (annS − annB) / tracking error;  TE = STDEV.P(s−b) × √252
export function informationRatio(summit, bench) {
  const n = Math.min(summit.length, bench.length);
  const diff = []; for (let i = 0; i < n; i++) diff.push(summit[i] - bench[i]);
  const te = volArr(diff, false);
  return te === 0 ? 0 : (annualizedArr(summit) - annualizedArr(bench)) / te;
}
// Risk Adjusted Return (slide-2 table): annualized / vol
export function riskAdjusted(a) { const v = volArr(a, false); return v === 0 ? 0 : annualizedArr(a) / v; }

// ─── period aggregations ────────────────────────────────────
export function yearlyReturns(series) {
  const m = new Map();
  for (const p of series) m.set(p.date.getFullYear(), (m.get(p.date.getFullYear()) ?? 1) * (1 + p.r));
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([year, prod]) => ({ year, r: prod - 1 }));
}
// daily returns grouped into a given calendar year
export function yearSlice(series, year) { return series.filter(p => p.date.getFullYear() === year); }

export function monthlySeries(series) {
  const m = new Map();
  for (const p of series) {
    const k = p.date.getFullYear() * 100 + (p.date.getMonth() + 1);
    m.set(k, (m.get(k) ?? 1) * (1 + p.r));
  }
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([k, prod]) =>
    ({ year: Math.floor(k / 100), month: k % 100, r: prod - 1 }));
}
// align two monthly series by (year,month) → { labels, a, b, alpha }
export function monthlyAligned(sMonthly, bMonthly) {
  const bMap = new Map(bMonthly.map(m => [m.year * 100 + m.month, m.r]));
  const labels = [], a = [], b = [], alpha = [];
  for (const m of sMonthly) {
    const k = m.year * 100 + m.month;
    if (bMap.has(k)) { labels.push({ year: m.year, month: m.month }); a.push(m.r); b.push(bMap.get(k)); alpha.push(m.r - bMap.get(k)); }
  }
  return { labels, a, b, alpha };
}

// ─── distribution / streak stats (slide 3) ──────────────────
// Up/Down (absolute, threshold 0, ">0" vs "<=0") or Winning/Losing (alpha, ">0" vs "<0").
export function periodStats(values, { downInclusiveZero = true } = {}) {
  const pos = v => v > 0;
  const neg = downInclusiveZero ? (v => v <= 0) : (v => v < 0);
  const up = values.filter(pos), down = values.filter(neg);
  const grp = (arr) => ({ number: arr.length, pct: values.length ? arr.length / values.length : 0, avg: mean(arr), std: stdP(arr) });
  return {
    up: grp(up), down: grp(down),
    total: { number: values.length, avg: mean(values), std: stdP(values) },
    maxSeqUp: maxRun(values, pos), maxSeqDown: maxRun(values, neg),
    avgSeqUp: avgRun(values, pos), avgSeqDown: avgRun(values, neg),
  };
}
function maxRun(values, pred) {
  let max = 0, cur = 0;
  for (const v of values) { if (pred(v)) { cur++; max = Math.max(max, cur); } else cur = 0; }
  return max;
}
function avgRun(values, pred) {
  const runs = []; let cur = 0;
  for (const v of values) { if (pred(v)) cur++; else if (cur) { runs.push(cur); cur = 0; } }
  if (cur) runs.push(cur);
  return runs.length ? mean(runs) : 0;
}

// best/worst N months → [{ r, year, month }]
export function bestWorst(monthly, n = 3) {
  const sorted = [...monthly].sort((a, b) => b.r - a.r);
  return { best: sorted.slice(0, n), worst: sorted.slice(-n).reverse() };
}

// histogram with step bucketing (left edge), plus a fitted normal curve
export function histogram(values, step) {
  if (!values.length) return { bars: [], curve: [] };
  const edges = values.map(v => Math.floor(v / step) * step);
  const lo = Math.min(...edges), hi = Math.max(...edges);
  const bars = [];
  for (let e = lo; e <= hi + 1e-9; e += step) {
    const left = +e.toFixed(10);
    const count = values.filter(v => v >= left - 1e-9 && v < left + step - 1e-9).length;
    bars.push({ left, center: left + step / 2, count });
  }
  // normal curve sampled across the range, scaled to frequency (n × step × pdf)
  const mu = mean(values), sigma = stdP(values);
  const curve = [];
  if (sigma > 0) {
    const start = lo - step, end = hi + step * 2;
    const pts = 80;
    for (let i = 0; i <= pts; i++) {
      const x = start + (end - start) * (i / pts);
      const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));
      curve.push({ x: x + step / 2, y: values.length * step * pdf });
    }
  }
  return { bars, curve };
}

// Capture ratios from monthly series (averages of monthly returns)
export function captureRatios(sMonthly, bMonthly) {
  const upS = [], upB = [], dnS = [], dnB = [];
  for (let i = 0; i < bMonthly.length; i++) {
    if (bMonthly[i] > 0) { upS.push(sMonthly[i]); upB.push(bMonthly[i]); }
    else if (bMonthly[i] < 0) { dnS.push(sMonthly[i]); dnB.push(bMonthly[i]); }
  }
  const upSummit = mean(upS), upBench = mean(upB), dnSummit = mean(dnS), dnBench = mean(dnB);
  const captureUp = upBench ? upSummit / upBench : 0;
  const captureDown = dnBench ? dnSummit / dnBench : 0;
  return {
    upSummit, upBench, dnSummit, dnBench, captureUp, captureDown,
    ratio: captureDown ? captureUp / captureDown : 0,
  };
}
