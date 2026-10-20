// eps-engine.js — the maths of Market Analysis > EPS Attribution. Pure functions, no DOM,
// so the numbers can be checked in node (tests/eps-engine.test.mjs).
// Method and every decision: docs/EPS_ATTRIBUTION.md.
//
// Forward multiple = price / EPS of one fixed fiscal year (CY2026 or CY2027, Bloomberg consensus calendarised to
// December). No rolling or NTM: the file has annual estimates only, so a year is never blended or split into quarters.
//     1 + R = (1 + g)(1 + m)      R price return, g aggregate EPS growth of that year's estimate, m forward P/E change
//
// Attribution is by index weight, as in any index contribution table. For each security, with w its start-of-period
// index weight (float-adjusted, from the file; renormalised only when something is excluded):
//     price cP = w x return      EPS cE = w x its own EPS change      multiple cM = cP - cE
// cM is "the rest": it equals w(1+g)m, the multiple change taken after the EPS change, so the interaction sits there.
// A name with EPS <= 0 at the start has no % EPS change: cE = 0 and all of its price move is in cM.
// A name with no price at the end date (it left the index) has no return: listed as n/a and left out of the 100%
// (the other weights are rescaled to the names with data, so weight x change adds up to the index return exactly).
// All three add up over any group, so securities -> industry groups -> sectors -> index.
// The index-level numbers of the aggregate view (gAgg = change of sum(shares x EPS), m = change of the index forward P/E)
// are kept as a memo: they weight each company by the earnings it brings, not by its weight.

var COL = { cy26: 4, cy27: 5 };           // EPS column of a snapshot row: [id, spx_w, ndx_w, price, eps26, eps27]
export var BASES = [['cy26', 'CY2026'], ['cy27', 'CY2027']];

export function makeEngine(D) {
  var secs = D.secs, snaps = D.snaps, dates = D.dates, byId = [];

  function fy(base) { return base === 'cy27' ? 2027 : 2026; }
  function epsOf(r, base) { return base === 'cy27' ? r[5] : r[4]; }
  function fyLabel(base) { return 'CY' + fy(base); }
  function rowsAt(k) {                    // every security with a price at snapshot k, member or not
    if (!byId[k]) { var m = {}; snaps[k].forEach(function (r) { m[r[0]] = r; }); byId[k] = m; }
    return byId[k];
  }

  // members of one index at one snapshot, weights renormalised after exclusions: [{id, w}]
  function members(ix, k, ex) {
    var col = ix === 'spx' ? 1 : 2, out = [], tot = 0;
    snaps[k].forEach(function (r) {
      if (!(r[col] > 0) || (ex && ex.has(r[0]))) return;
      out.push({ id: r[0], w: r[col], px: r[3], e26: r[4], e27: r[5] }); tot += r[col];
    });
    out.forEach(function (m) { m.w /= tot; });
    return out;
  }

  function median(a) { if (!a.length) return null; a = a.slice().sort(function (x, y) { return x - y; }); var h = a.length >> 1; return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2; }

  // Change between two snapshots. The basket is the one held at k0; every name is followed to k1 whether or not
  // it is still a member there (a name that left the index still earned its return).
  function period(ix, k0, k1, base, ex) {
    var a = members(ix, k0, ex), end = rowsAt(k1), endW = {};
    members(ix, k1, ex).forEach(function (m) { endW[m.id] = m.w; });
    var rows = [], skipped = [], I0 = 0, I1 = 0, E0 = 0, E1 = 0, covW0 = 0, Rsum = 0, Gsum = 0;
    a.forEach(function (m) {
      var n = end[m.id], e0 = epsOf([0, 0, 0, 0, m.e26, m.e27], base, k0), why = null;
      var e1 = n ? epsOf(n, base, k1) : null;
      if (!n || !(n[3] > 0)) why = 'no price at the end date';
      else if (e0 == null) why = 'no EPS estimate at the start';
      else if (e1 == null) why = 'no EPS estimate at the end';
      if (why) { skipped.push({ id: m.id, w0: m.w, why: why, ret: n && n[3] > 0 ? n[3] / m.px - 1 : null }); return; }
      covW0 += m.w;
      var q = m.w / m.px;
      rows.push({ id: m.id, w0: m.w, w1: endW[m.id] || 0, px0: m.px, px1: n[3], e0: e0, e1: e1, q: q, x0: m.e27,
        qp0: q * m.px, qp1: q * n[3], qe0: q * e0, qe1: q * e1 });
      I0 += q * m.px; I1 += q * n[3]; E0 += q * e0; E1 += q * e1;
    });
    // weights are rescaled to the names that have data, so the rows weigh 100% at the start (and at the end) and
    // weight x change ties out exactly; the names without figures (skipped) keep their raw weight and are listed n/a
    var endSum = rows.reduce(function (s, r) { return s + r.w1; }, 0);
    rows.forEach(function (r) { r.wRaw = r.w0; r.w0 = r.w0 / covW0; r.w1 = endSum ? r.w1 / endSum : 0; });
    var gs = [], wg = 0, wgW = 0, eq = 0;
    rows.forEach(function (r) {
      r.ret = r.px1 / r.px0 - 1;
      r.g = r.e0 > 0 ? r.e1 / r.e0 - 1 : null;
      // weight x change, nothing else: price = w x return, EPS = w x its own EPS change, multiple = the rest
      r.cP = r.w0 * r.ret;
      r.cE = r.g != null ? r.w0 * r.g : 0;      // EPS <= 0 at the start: no % change exists, 0 pp from EPS
      r.cM = r.cP - r.cE;
      Rsum += r.cP; Gsum += r.cE;
      r.pe0 = r.e0 > 0 ? r.px0 / r.e0 : null; r.pe1 = r.e1 > 0 ? r.px1 / r.e1 : null;
      r.m = r.pe0 && r.pe1 ? r.pe1 / r.pe0 - 1 : null;
      r.esh = r.qe0 / E0;                       // share of aggregate start-of-period earnings
      r.wn = r.w0;
      if (r.g != null) { gs.push(r.g); wg += r.wn * r.g; wgW += r.wn; eq += r.g; }
    });
    // price return of every start-basket name that has an end price, with or without an EPS estimate
    var fw = 0, fr = 0; rows.forEach(function (r) { fw += r.w0; fr += r.w0 * (r.px1 / r.px0 - 1); });
    skipped.forEach(function (x) { if (x.ret != null) { fw += x.w0; fr += x.w0 * x.ret; } });
    var g = E1 / E0 - 1, m = (I1 / E1) / (I0 / E0) - 1;   // index-level (aggregate) EPS and forward P/E, kept as a memo
    var allW0 = a.reduce(function (s, x) { return s + x.w; }, 0), left = 0, entered = { n: 0, w: 0 };
    var startIds = {}; a.forEach(function (x) { startIds[x.id] = 1; });
    Object.keys(endW).forEach(function (id) { if (!startIds[id]) { entered.n++; entered.w += endW[id]; } });
    return { k0: k0, k1: k1, base: base, Rfull: fw ? fr / fw : null, rows: rows, skipped: skipped, endW: endW, R: Rsum, G: Gsum, M: Rsum - Gsum, gAgg: g, m: m, covW: covW0, allW: allW0,
      pe0: I0 / E0, pe1: I1 / E1, n: rows.length, nStart: a.length, cov: allW0 ? covW0 / allW0 : 0, entered: entered,
      y0: fyLabel(base, k0), y1: fyLabel(base, k1),
      wAvgG: wgW ? wg / wgW : null, eqG: gs.length ? eq / gs.length : null, medG: median(gs) };
  }

  // Forward growth of one snapshot: CY2026 -> CY2027, aggregate earnings of the members.
  function forward(ix, k, ex) {
    var a = members(ix, k, ex), all = 0, cov = 0, rows = [], E26 = 0, E27 = 0, I = 0;
    a.forEach(function (m) {
      all += m.w;
      if (m.e26 == null || m.e27 == null || !(m.px > 0)) return;
      cov += m.w; var q = m.w / m.px;
      rows.push({ id: m.id, w0: m.w, q: q, e0: m.e26, e1: m.e27, px0: m.px, qe0: q * m.e26, qe1: q * m.e27, qp0: q * m.px });
      I += q * m.px; E26 += q * m.e26; E27 += q * m.e27;
    });
    var gs = [], wg = 0, wgW = 0;
    rows.forEach(function (r) {
      r.cE = r.q * (r.e1 - r.e0) / E26; r.esh = r.q * r.e0 / E26; r.wn = r.w0 / cov;
      r.g = r.e0 > 0 ? r.e1 / r.e0 - 1 : null;
      if (r.g != null) { gs.push(r.g); wg += r.wn * r.g; wgW += r.wn; }
    });
    return { k: k, rows: rows, g: E27 / E26 - 1, pe26: I / E26, pe27: I / E27, cov: all ? cov / all : 0, n: rows.length, nAll: a.length,
      wAvgG: wgW ? wg / wgW : null, medG: median(gs) };
  }

  // Concentration of the (filtered) index at one snapshot: by weight, and by earnings on the forward year.
  function concentration(ix, k, base, ex, N) {
    N = N || 10;
    var a = members(ix, k, ex).sort(function (x, y) { return y.w - x.w; });
    var top5 = 0, top10 = 0;
    a.forEach(function (m, i) { if (i < 5) top5 += m.w; if (i < N) top10 += m.w; });
    var cov = a.filter(function (m) { return m.px > 0 && epsOf([0, 0, 0, 0, m.e26, m.e27], base, k) != null; }), E = 0;
    cov.forEach(function (m) { m.q = m.w / m.px; m.e = m.q * epsOf([0, 0, 0, 0, m.e26, m.e27], base, k); E += m.e; });
    var byW = cov.slice().sort(function (x, y) { return y.w - x.w; }), byE = cov.slice().sort(function (x, y) { return y.e - x.e; });
    function sh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.e; }); return E ? s / E : null; }
    var covW = cov.reduce(function (s, m) { return s + m.w; }, 0);
    function wsh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.w; }); return covW ? s / covW : null; }
    return { top5: top5, top10: top10, n: a.length, topE: byE.slice(0, N).map(function (m) { return { id: m.id, sh: E ? m.e / E : 0 }; }),
      e10byW: sh(byW, N), e10byE: sh(byE, N), w10byE: wsh(byE, N), w10byW: wsh(byW, N) };
  }

  // Cumulative path from k0 to every later snapshot, on the basket held at k0: price, aggregate EPS, forward P/E.
  function path(ix, k0, k1, base, ex) {
    var out = [];
    for (var k = k0; k <= k1; k++) { var p = period(ix, k0, k, base, ex); out.push({ k: k, R: p.R, g: p.g, m: p.m, pe: p.pe1, y: p.y1 }); }
    return out;
  }

  // Sum rows by a key and derive the group's own growth / return / multiple from the summed levels.
  function group(rows, keyFn) {
    var map = {}, order = [];
    rows.forEach(function (r) {
      var k = keyFn(r); if (!map[k]) { map[k] = { key: k, n: 0, w0: 0, w1: 0, cP: 0, cE: 0, cM: 0, qp0: 0, qp1: 0, qe0: 0, qe1: 0, rows: [] }; order.push(k); }
      var o = map[k]; o.n++; o.rows.push(r);
      ['w0', 'w1', 'cP', 'cE', 'cM', 'qp0', 'qp1', 'qe0', 'qe1'].forEach(function (f) { o[f] += r[f] || 0; });
    });
    return order.map(function (k) {
      var o = map[k];
      // the group's own change, by weight: its return and EPS change are the weight-averages of its stocks'
      o.ret = o.w0 > 0 ? o.cP / o.w0 : null; o.g = o.w0 > 0 ? o.cE / o.w0 : null;
      o.m = o.ret != null && o.g != null && o.g > -1 ? (1 + o.ret) / (1 + o.g) - 1 : null;   // (1+g)(1+m) = 1+ret
      o.pe0 = o.qe0 > 0 ? o.qp0 / o.qe0 : null; o.pe1 = o.qe1 > 0 ? o.qp1 / o.qe1 : null;
      return o;
    });
  }

  return { D: D, secs: secs, dates: dates, members: members, period: period, forward: forward, concentration: concentration,
    path: path, group: group, fy: fy, fyLabel: fyLabel };
}
