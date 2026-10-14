// spx-attribution.js — the S&P 500 engine of Market Analysis ▸ Attribution Detail &
// Simulation (the table itself is js/ma-detail.js), and the yearly numbers behind Sector Return / Contribution ▸ Contribution
// (spyAttributionYears). Same idea as the Nasdaq-100, with MONTHS in place of HOCs and
// for the SPY fund:
//
//   contribution of group g in month t = w(g, t−1) × r(g, t)
//     w = SPY's weight in GICS industry group g at the previous month-end, from SPY's
//         holdings grouped by GICS level 2 (data.groups, the analyst's "Equity Universe
//         Consensus" SECTORS tab; renormalised over the groups)
//     r = the S&P 500 industry-group index price return in the month (S5xxxx)
//   a sector's contribution = the sum of its groups (so the table adds up at every level)
//   residual(t) = SPY's own price return(t) − Σ contributions (cash, timing)
//   each year: Carino-linked, so groups + residual = SPY's return exactly
// Without data.groups it falls back to the 11 sector weights × S5 sector indices.
//
// Simulation: excluded sectors / groups leave the fund and the remaining weights are
// rescaled to 100% every month; the residual cannot be assigned, so a simulation is the
// groups alone.
//
// The weights use TODAY's GICS while the index levels carry the GICS of the time; they
// only line up after the March 2023 GICS change, so years start at FIRST_YEAR.

var FIRST_YEAR = 2024;

var D = null, YEARS = [], SECS = [], UNITS = [], SEC_OF = {}, IG = false;

function W(){ return IG ? D.groups.weights : D.spyWeights.series; }
function LV(){ return IG ? D.groups.levels : D.levels.series; }
function dates(){ return D.levels.dates; }
function yearEndIdx(y){ var ds = dates(), j = -1; for (var i = 0; i < ds.length; i++) if (+ds[i].slice(0, 4) === y) j = i; return j; }

// Years with a full set of months: [{key, label, i0, i1}] oldest → newest
function buildYears(){
  var out = [];
  for (var y = FIRST_YEAR; y <= D.year; y++){
    var i0 = yearEndIdx(y - 1), i1 = yearEndIdx(y);
    if (i0 < 0 || i1 <= i0) continue;
    out.push({ key: String(y), label: String(y), ytd: y === D.year, i0: i0, i1: i1 });
  }
  return out;
}
function yearOf(key){ for (var i = 0; i < YEARS.length; i++) if (YEARS[i].key === key) return YEARS[i]; return null; }
function off(u, excl){ return !!(excl[u] || excl['sec:' + SEC_OF[u]]); }

// Unit weights at month-end i, renormalised over the units still in (%)
function weightsAt(i, excl){
  var w = W(), tot = 0, o = {};
  UNITS.forEach(function(u){ if (!off(u, excl)) tot += w[u][i] || 0; });
  UNITS.forEach(function(u){ o[u] = off(u, excl) || !tot ? null : (w[u][i] || 0) / tot * 100; });
  return o;
}

// The year's attribution. excl = { group: true, 'sec:Sector': true } for a simulation.
function compute(yr, excl){
  excl = excl || {};
  var L = LV(), SPY = D.etf.levels.series.SPY, sim = Object.keys(excl).some(function(k){ return excl[k]; });
  var monthC = [], kt = [], logSum = 0, resid = [];
  for (var i = yr.i0 + 1; i <= yr.i1; i++){
    var w = weightsAt(i - 1, excl), c = {}, sum = 0;
    UNITS.forEach(function(u){
      if (off(u, excl) || L[u][i] == null || L[u][i - 1] == null) return;
      c[u] = w[u] / 100 * (L[u][i] / L[u][i - 1] - 1); sum += c[u];
    });
    var Rt = sim ? sum : SPY[i] / SPY[i - 1] - 1;
    resid.push(Rt - sum); monthC.push(c);
    kt.push(Math.abs(Rt) > 1e-10 ? Math.log(1 + Rt) / Rt : 1);
    logSum += Math.log(1 + Rt);
  }
  var R = Math.exp(logSum) - 1, k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1;
  var byIG = {}, bySec = {}, residual = 0;
  UNITS.forEach(function(u){
    if (off(u, excl)) return;
    var t = 0; monthC.forEach(function(c, j){ t += kt[j] * (c[u] || 0); });
    byIG[u] = t / k * 100;
    bySec[SEC_OF[u]] = (bySec[SEC_OF[u]] || 0) + byIG[u];
  });
  resid.forEach(function(e, j){ residual += kt[j] * e; });
  var ret = {}, retIG = {};
  SECS.forEach(function(s){ var l = D.levels.series[s]; ret[s] = (l[yr.i1] / l[yr.i0] - 1) * 100; });
  if (IG) UNITS.forEach(function(u){ var l = L[u]; retIG[u] = l[yr.i0] && l[yr.i1] ? (l[yr.i1] / l[yr.i0] - 1) * 100 : null; });
  var w0 = weightsAt(yr.i0, excl), w1 = weightsAt(yr.i1, excl), s0 = {}, s1 = {};
  UNITS.forEach(function(u){ if (w0[u] != null){ s0[SEC_OF[u]] = (s0[SEC_OF[u]] || 0) + w0[u]; s1[SEC_OF[u]] = (s1[SEC_OF[u]] || 0) + (w1[u] || 0); } });
  return { bySec: bySec, byIG: IG ? byIG : null, residual: residual / k * 100, total: R * 100, ret: ret, retIG: retIG,
    wOpen: s0, wClose: s1, wOpenIG: w0, wCloseIG: w1, sim: sim };
}


function setup(data){
  if (D === data) return true;
  if (!data || !data.spyWeights || !data.etf || !data.etf.levels.series.SPY) return false;
  if (data.etf.levels.dates.join() !== data.levels.dates.join()){ console.warn('[spx-attribution] SPY and sector index dates differ'); return false; }
  D = data; IG = !!(data.groups && data.groups.weights);
  SECS = Object.keys(D.spyWeights.series);
  UNITS = IG ? Object.keys(D.groups.weights) : SECS.slice();
  SEC_OF = {}; UNITS.forEach(function(u){ SEC_OF[u] = IG ? D.groups.sectorOf[u] : u; });
  YEARS = buildYears();
  return YEARS.length > 0;
}

// Yearly SPY attribution: [{ key: '2024' …, bySec, byIG, residual, total }], complete years
// from FIRST_YEAR plus the current year to date. [] without the data.
export function spyAttributionYears(data){
  if (!setup(data)) return [];
  return YEARS.map(function(y){ var r = compute(y, {}); return { key: y.key, bySec: r.bySec, byIG: r.byIG, residual: r.residual, total: r.total }; });
}
// Open → close SPY weights by sector for a year key ('2024' …) — Index Composition
export function spyWeightSnaps(data, key){
  if (!setup(data)) return null;
  var y = +key, i0 = yearEndIdx(y - 1), i1 = yearEndIdx(y);
  if (i0 < 0 || i1 < 0) return null;
  var w = D.spyWeights.series, o = {}, c = {}, t0 = 0, t1 = 0;
  SECS.forEach(function(s){ t0 += w[s][i0] || 0; t1 += w[s][i1] || 0; });
  SECS.forEach(function(s){ o[s] = (w[s][i0] || 0) / t0 * 100; c[s] = (w[s][i1] || 0) / t1 * 100; });
  return { open: o, close: c, closeDate: D.levels.dates[i1] };
}

// Attribution Detail & Simulation (one table for both indices, js/ma-detail.js)
// excl = { 'sec:Sector': true, 'Industry Group': true }
export function spxDetailYears(data){ return setup(data) ? YEARS.map(function(y){ return +y.key; }) : []; }
export function spxDetail(data, year, excl){
  if (!setup(data)) return null;
  var y = yearOf(String(year)); if (!y) return null;
  return compute(y, excl || {});
}
export function spxGroups(data){
  if (!setup(data)) return null;
  var g = {}; UNITS.forEach(function(u){ (g[SEC_OF[u]] = g[SEC_OF[u]] || []).push(u); });
  return { secs: SECS.slice(), igsOf: g, ig: IG };
}
