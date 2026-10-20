// eps-engine.js — the maths of Market Analysis > EPS Attribution. Pure functions, no DOM,
// so the numbers can be checked in node (tests/eps-engine.test.mjs).
// Method and every decision: docs/EPS_ATTRIBUTION.md.
//
// Forward multiple = price / EPS of one fixed fiscal year (CY2026 or CY2027, Bloomberg consensus calendarised to
// December). No rolling or NTM: the file has annual estimates only, so a year is never blended or split into quarters.
//
// Attribution is by index weight, as in any index contribution table. A period (say Jan 2 -> Oct 16) is walked one snapshot at
// a time. In each step the basket is the one the index holds at the START of the step (names that joined start counting
// there, names that left stopped counting at their last snapshot), with its weights rescaled to the names that have a price
// and an estimate at both ends of the step. For each security, with w that weight:
//     price cP = w x return      EPS cE = w x its own EPS change      multiple cM = cP - cE
// cM is "the rest": it equals w(1+g)m, the multiple change taken after the EPS change, so the interaction sits there.
// A name with EPS <= 0 at the start of a step has no % EPS change: cE = 0 and all of its price move is in cM.
// Steps are linked by the index's own growth: contribution = sum over steps of (index value at the step start) x (the step's
// contribution), so the contributions of every security add up exactly to the index return, and so do groups and sectors.
// Memo (kept for the notes only): the index-level forward P/E (price / earnings of everything it holds) and the change of the
// earnings of the start basket; they weight each company by the earnings it brings, not by its weight.

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
  function dataAt(k, id, base) { var r = rowsAt(k)[id]; return r && r[3] > 0 && epsOf(r, base) != null ? r : null; }

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
  // every name the index held at any snapshot in k0..k1 (the rows of the detail table)
  function universe(ix, k0, k1) {
    var seen = {}, out = [];
    for (var k = k0; k <= k1; k++) members(ix, k, null).forEach(function (m) { if (!seen[m.id]) { seen[m.id] = 1; out.push({ id: m.id, w: m.w, k: k }); } });
    return out;
  }
  // weights at snapshot k among the members that have a price and an estimate there, rescaled to 100%
  function dataWeights(ix, k, base, ex) {
    var a = members(ix, k, ex).filter(function (m) { return dataAt(k, m.id, base); }), tot = a.reduce(function (s, m) { return s + m.w; }, 0), out = {};
    a.forEach(function (m) { out[m.id] = m.w / tot; });
    return out;
  }
  // forward P/E of the index at snapshot k: price of everything it holds / earnings of everything it holds
  function peAt(ix, k, base, ex) {
    var a = members(ix, k, ex).filter(function (m) { return dataAt(k, m.id, base); }), y = 0, tot = 0;
    a.forEach(function (m) { tot += m.w; });
    a.forEach(function (m) { y += (m.w / tot) * epsOf([0, 0, 0, 0, m.e26, m.e27], base) / m.px; });
    return y > 0 ? 1 / y : null;
  }

  // one step j -> j+1 on the basket held at j
  function step(ix, j, base, ex) {
    var rows = [], skipped = [], tw = 0;
    members(ix, j, ex).forEach(function (m) {
      var r0 = dataAt(j, m.id, base), r1 = dataAt(j + 1, m.id, base), why = null;
      if (!r1) why = rowsAt(j + 1)[m.id] && rowsAt(j + 1)[m.id][3] > 0 ? 'no EPS estimate at the end' : 'no price at the end date';
      else if (!r0) why = 'no EPS estimate at the start';
      if (why) { skipped.push({ id: m.id, w0: m.w, why: why }); return; }
      tw += m.w;
      rows.push({ id: m.id, w: m.w, px0: r0[3], px1: r1[3], e0: epsOf(r0, base), e1: epsOf(r1, base) });
    });
    var R = 0, G = 0;
    rows.forEach(function (r) {
      r.w /= tw;
      r.ret = r.px1 / r.px0 - 1; r.g = r.e0 > 0 ? r.e1 / r.e0 - 1 : null;
      r.cP = r.w * r.ret; r.cE = r.g != null ? r.w * r.g : 0;
      R += r.cP; G += r.cE;
    });
    return { j: j, rows: rows, skipped: skipped, R: R, G: G };
  }

  function median(a) { if (!a.length) return null; a = a.slice().sort(function (x, y) { return x - y; }); var h = a.length >> 1; return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2; }

  // Change between two snapshots, walked one snapshot at a time (see the header).
  function period(ix, k0, k1, base, ex) {
    var W = 1, acc = {}, order = [], steps = [];
    for (var j = k0; j < k1; j++) {
      var s = step(ix, j, base, ex); steps.push(s);
      s.rows.forEach(function (r) {
        var a = acc[r.id];
        if (!a) { a = acc[r.id] = { id: r.id, cP: 0, cE: 0, cM: 0, subs: [], first: j, last: j, px0: r.px0, e0: r.e0, w0: 0 }; order.push(a); }
        a.cP += W * r.cP; a.cE += W * r.cE; a.last = j; a.px1 = r.px1; a.e1 = r.e1;
        a.subs.push({ j: j, w: r.w, cP: r.cP, cE: r.cE, ret: r.ret, g: r.g });
        if (j === k0) a.w0 = r.w;
      });
      W *= 1 + s.R;
    }
    var R = W - 1, G = 0, endW = k1 > k0 ? dataWeights(ix, k1, base, ex) : {}, rows = order;
    rows.forEach(function (a) {
      a.cM = a.cP - a.cE; G += a.cE;
      a.w1 = endW[a.id] || 0;
      // its own change over the part of the period it was held: steps chained
      var ret = 1, g = 1, gOk = true;
      a.subs.forEach(function (x) { ret *= 1 + x.ret; if (x.g == null) gOk = false; else g *= 1 + x.g; });
      a.ret = ret - 1; a.g = gOk ? g - 1 : null;
      a.pe0 = a.e0 > 0 ? a.px0 / a.e0 : null; a.pe1 = a.e1 > 0 ? a.px1 / a.e1 : null;
      a.m = a.g != null && a.g > -1 ? (1 + a.ret) / (1 + a.g) - 1 : null;
    });
    // names that were members at the start of a step but never had data in any step: n/a
    var seen = {}, skipped = [];
    steps.forEach(function (s) { s.skipped.forEach(function (x) { if (!acc[x.id] && !seen[x.id]) { seen[x.id] = 1; skipped.push(x); } }); });
    // memo: earnings of the start basket held fixed, and the index forward P/E at each end
    var q0 = 0, q1 = 0, a0 = members(ix, k0, ex);
    var tw = 0; a0.forEach(function (m) { if (dataAt(k0, m.id, base) && dataAt(k1, m.id, base)) tw += m.w; });
    a0.forEach(function (m) { var r1 = dataAt(k1, m.id, base); if (!r1 || !dataAt(k0, m.id, base)) return; var q = m.w / tw / m.px; q0 += q * epsOf([0, 0, 0, 0, m.e26, m.e27], base); q1 += q * epsOf(r1, base); });
    var pe0 = peAt(ix, k0, base, ex), pe1 = peAt(ix, k1, base, ex), gs = rows.map(function (r) { return r.g; }).filter(function (v) { return v != null; });
    return { k0: k0, k1: k1, base: base, rows: rows, skipped: skipped, R: R, G: G, M: R - G, gAgg: q0 > 0 ? q1 / q0 - 1 : null, m: pe0 && pe1 ? pe1 / pe0 - 1 : null,
      pe0: pe0, pe1: pe1, n: rows.length, nStart: a0.length, y0: fyLabel(base, k0), y1: fyLabel(base, k1), steps: steps.length,
      entered: { n: rows.filter(function (r) { return r.first > k0; }).length }, left: { n: rows.filter(function (r) { return r.last + 1 < k1; }).length },
      medG: median(gs) };
  }

  // Concentration of the (filtered) index at one snapshot: by weight, and by expected earnings on the forward year.
  function concentration(ix, k, base, ex, N) {
    N = N || 10;
    var a = members(ix, k, ex).sort(function (x, y) { return y.w - x.w; });
    var top5 = 0, top10 = 0;
    a.forEach(function (m, i) { if (i < 5) top5 += m.w; if (i < N) top10 += m.w; });
    var cov = a.filter(function (m) { return m.px > 0 && epsOf([0, 0, 0, 0, m.e26, m.e27], base) != null; }), E = 0;
    cov.forEach(function (m) { m.q = m.w / m.px; m.e = m.q * epsOf([0, 0, 0, 0, m.e26, m.e27], base); E += m.e; });
    var byW = cov.slice().sort(function (x, y) { return y.w - x.w; }), byE = cov.slice().sort(function (x, y) { return y.e - x.e; });
    function sh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.e; }); return E ? s / E : null; }
    var covW = cov.reduce(function (s, m) { return s + m.w; }, 0);
    function wsh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.w; }); return covW ? s / covW : null; }
    return { top5: top5, top10: top10, n: a.length, topE: byE.slice(0, N).map(function (m) { return { id: m.id, sh: E ? m.e / E : 0, w: m.w, pe: m.px / epsOf([0, 0, 0, 0, m.e26, m.e27], base) }; }),
      e10byW: sh(byW, N), e10byE: sh(byE, N), w10byE: wsh(byE, N), w10byW: wsh(byW, N) };
  }

  // Sum rows by a key. Contributions add up; the group's own change is its steps chained, each step the weight-average of its stocks.
  function group(rows, keyFn) {
    var map = {}, order = [];
    rows.forEach(function (r) {
      var k = keyFn(r); if (!map[k]) { map[k] = { key: k, n: 0, w0: 0, w1: 0, cP: 0, cE: 0, cM: 0, rows: [], byJ: {} }; order.push(k); }
      var o = map[k]; o.n++; o.rows.push(r);
      ['w0', 'w1', 'cP', 'cE', 'cM'].forEach(function (f) { o[f] += r[f] || 0; });
      r.subs.forEach(function (s) { var b = o.byJ[s.j] || (o.byJ[s.j] = { w: 0, cP: 0, cE: 0 }); b.w += s.w; b.cP += s.cP; b.cE += s.cE; });
    });
    return order.map(function (k) {
      var o = map[k], ret = 1, g = 1;
      Object.keys(o.byJ).forEach(function (j) { var b = o.byJ[j]; if (b.w > 0) { ret *= 1 + b.cP / b.w; g *= 1 + b.cE / b.w; } });
      o.ret = ret - 1; o.g = g - 1; o.m = o.g > -1 ? (1 + o.ret) / (1 + o.g) - 1 : null;
      return o;
    });
  }

  return { D: D, secs: secs, dates: dates, members: members, universe: universe, period: period, concentration: concentration,
    group: group, fy: fy, fyLabel: fyLabel };
}
