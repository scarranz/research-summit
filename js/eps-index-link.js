// eps-index-link.js — the PRICE side of Market Analysis > EPS Attribution, taken from Index Analysis so both
// tabs show the same numbers (analyst, Nov 25 2026). Nothing is re-priced here:
//   S&P 500 = the SPY fund, as Attribution Detail (js/spx-attribution.js): total, sector / industry-group
//             contributions and "cash & other"; company figures as Top Contributors (spx-holdings-data.js).
//   Nasdaq-100 = QQQ's holding periods (js/ndx-attribution.js ndxLink).
// The EPS tab then derives the multiple: (1 + price return) / (1 + EPS growth) - 1.
// Excluding sectors / groups uses Index Analysis' own simulation. Excluding a single company is not something
// Index Analysis does: it is estimated here by taking out its contribution and rescaling the rest.
import { spxDetail, spxDetailYears, spxDetailThrough } from './spx-attribution.js';

var SRC = null, ready = null, resolve = null;
ready = new Promise(function (r) { resolve = r; });

// { spx: SPX_DATA, holdings: SPX_HOLDINGS, ndxLink: fn | null, ndxIGs: [names] }
export function setEpsSources(s) { SRC = s; resolve(s); }
export function epsSourcesReady() { return ready; }

function key(s) { return String(s).toLowerCase().replace(/\band\b/g, '&').replace(/[^a-z&()]/g, ''); }
var ALIAS = { realestate: 'Real Estate Management & Development' };

function spxSide(excl) {
  var D = SRC.spx, years = spxDetailYears(D), y = years[years.length - 1], x = {};
  excl.sectors.forEach(function (s) { x['sec:' + s] = true; });
  excl.igs.forEach(function (g) { x[g] = true; });
  var r = spxDetail(D, y, x), sec = {}, ig = {}, t = {};
  Object.keys(r.wOpen).forEach(function (s) {
    var etf = D.etf && D.etf.annual[s];
    sec[s] = { c: r.bySec[s] || 0, ret: etf && etf[y] != null ? etf[y] : r.ret[s], w0: r.wOpen[s], w1: r.wClose[s] };
  });
  Object.keys(r.wOpenIG || {}).forEach(function (g) {
    if (r.wOpenIG[g] == null) return;
    ig[g] = { c: (r.byIG || {})[g] || 0, ret: (r.retIG || {})[g], w0: r.wOpenIG[g], w1: r.wCloseIG[g] };
  });
  var cut = {};
  excl.igs.forEach(function (g) { cut[D.groups.sectorOf[g]] = true; });
  Object.keys(cut).forEach(function (s) {
    if (!sec[s]) return;
    var w = 0, c = 0;
    Object.keys(ig).forEach(function (g) { if (D.groups.sectorOf[g] === s && !excl.igs.has(g) && ig[g].ret != null) { w += ig[g].w0; c += ig[g].w0 * ig[g].ret; } });
    sec[s].ret = w ? c / w : null;
  });
  var Y = SRC.holdings.years.filter(function (v) { return v.year === y; })[0], tot = 0, end = 0;
  var held = Y.holdings.filter(function (h) { return !excl.sectors.has(h.s) && !excl.igs.has(h.g); });
  held.forEach(function (h) { tot += h.w; end += h.w * (1 + h.r / 100); });
  var all = 0; Y.holdings.forEach(function (h) { all += h.w; });
  var scale = x && Object.keys(x).length && tot ? all / tot : 1;
  held.forEach(function (h) {
    t[h.t] = { c: h.w * scale * h.r / 100, ret: h.r, w0: h.w * scale, w1: h.w * (1 + h.r / 100) / end * 100 };
  });
  return { total: r.total, cash: r.sim ? 0 : r.residual, sec: sec, ig: ig, t: t, estimated: excl.igs.size > 0 };
}

function ndxSide(excl) {
  var D = SRC.spx, years = spxDetailYears(D), y = years[years.length - 1], canon = {};
  Object.keys(D.groups.sectorOf).forEach(function (g) { canon[key(g)] = g; });
  var name = function (n) { return canon[key(n)] || ALIAS[key(n)] || n; };
  var back = SRC.ndxIGs.filter(function (n) { return excl.igs.has(name(n)); });
  var r = SRC.ndxLink(y, Array.from(excl.sectors), back);
  var ig = {};
  Object.keys(r.ig).forEach(function (g) { ig[name(g)] = r.ig[g]; });
  return { total: r.total, cash: r.cash, sec: r.sec, ig: ig, t: r.t };
}

// ix: 'spx' | 'ndx' · excl: { sectors: Set, igs: Set, tickers: Set } · figures in %
export function indexSide(ix, excl) {
  var out = ix === 'spx' ? spxSide(excl) : ndxSide(excl);
  var gone = Array.from(excl.tickers).map(function (k) { return { k: k, x: out.t[k] }; }).filter(function (o) { return o.x; });
  if (!gone.length) return out;
  var w = 0, c = 0;
  gone.forEach(function (o) { w += o.x.w0; c += o.x.c; });
  var scale = 100 / (100 - w);
  gone.forEach(function (o) {
    [out.sec, out.ig].forEach(function (m) {
      Object.keys(m).forEach(function (n) {
        var u = SRC.unit(o.k);
        if (!u || (n !== u.s && n !== u.g)) return;
        var rest = m[n].w0 - o.x.w0;
        m[n].ret = m[n].ret == null || rest <= 1e-9 ? null : (m[n].ret * m[n].w0 - o.x.ret * o.x.w0) / rest;
        m[n].c -= o.x.c; m[n].w0 = rest; m[n].w1 -= o.x.w1;
      });
    });
    delete out.t[o.k];
  });
  [out.sec, out.ig, out.t].forEach(function (m) { Object.keys(m).forEach(function (n) { m[n].c *= scale; m[n].w0 *= scale; }); });
  out.total = (out.total - c) * scale;
  out.cash *= scale;
  out.estimated = true;
  return out;
}

// sector / industry group of a ticker, as the EPS file classifies it (set by the page)
export function setUnitLookup(fn) { if (SRC) SRC.unit = fn; }

// S&P 500 at an earlier date of the year: SPY to the month-end before it, as Index Analysis' monthly view
// (total and sector / group contributions). Company figures have no Index Analysis equivalent there.
export function spxThrough(ym, excl) {
  var D = SRC.spx, x = {};
  excl.sectors.forEach(function (s) { x['sec:' + s] = true; });
  excl.igs.forEach(function (g) { x[g] = true; });
  var r = spxDetailThrough(D, ym, x);
  if (!r) return null;
  var dates = D.etf.levels.dates, i1 = -1, i0 = -1;
  dates.forEach(function (d, i) { if (d.slice(0, 7) === ym) i1 = i; if (+d.slice(0, 4) === D.year - 1) i0 = i; });
  var sec = {}, ig = {};
  Object.keys(r.wOpen).forEach(function (s) {
    var l = D.etf.levels.series[s];
    sec[s] = { c: r.bySec[s] || 0, ret: l && l[i0] && l[i1] ? (l[i1] / l[i0] - 1) * 100 : r.ret[s], w0: r.wOpen[s], w1: r.wClose[s] };
  });
  Object.keys(r.wOpenIG || {}).forEach(function (g) {
    if (r.wOpenIG[g] != null) ig[g] = { c: (r.byIG || {})[g] || 0, ret: (r.retIG || {})[g], w0: r.wOpenIG[g], w1: r.wCloseIG[g] };
  });
  return { total: r.total, cash: r.sim ? 0 : r.residual, sec: sec, ig: ig };
}
