// eps-engine.js — the maths of Market Analysis > EPS Attribution. Pure functions, no DOM,
// so the numbers can be checked in node (tests/eps-engine.test.mjs) against the Python reference.
// Method and every decision: docs/EPS_ATTRIBUTION.md.
//
// Index earnings per unit of index = sum( q_i x EPS_i ), with q_i = weight_i / price_i (implied index
// shares; the index-size constant cancels in every ratio). Then, between two snapshots, with q held at
// its start-of-period value:
//     price index I = sum q P        earnings E = sum q EPS        multiple PE = I / E
//     R = (1+g)(1+m) - 1            g = E1/E0 - 1 (aggregate EPS revision)   m = PE1/PE0 - 1
// Contribution of one security (pp of index): price cP = q dP / I0, EPS cE = q dEPS / E0,
// multiple cM = cP - cE. Each sums over any group, so sector / industry group / security all add up.

var YR = { cy26: 4, cy27: 5 };           // column of EPS in a snapshot row: [id, spx_w, ndx_w, price, eps26, eps27]
export var BASES = [['cy26', 'CY2026'], ['cy27', 'CY2027']];

export function makeEngine(D) {
  var secs = D.secs, snaps = D.snaps, dates = D.dates;

  // members of one index at one snapshot: [{id, w (fraction of the whole index), px, e26, e27}]
  function members(ix, k, ex) {
    var col = ix === 'spx' ? 1 : 2, out = [], tot = 0;
    snaps[k].forEach(function (r) {
      if (!(r[col] > 0) || (ex && ex.has(r[0]))) return;
      out.push({ id: r[0], w: r[col], px: r[3], e26: r[4], e27: r[5] }); tot += r[col];
    });
    out.forEach(function (m) { m.w /= tot; });
    return out;
  }
  function eps(m, base) { return base === 'cy27' ? m.e27 : m.e26; }
  function ok(m, base) { var e = eps(m, base); return e != null && m.px > 0; }

  // per-stock growth is capped at +-100% inside the cap-weighted average: a name whose EPS goes from ~0 to something would otherwise decide it
function clip(g) { return Math.max(-1, Math.min(1, g)); }
  function median(a) { if (!a.length) return null; a = a.slice().sort(function (x, y) { return x - y; }); var h = a.length >> 1; return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2; }

  // Change between two snapshots on one EPS year.
  function period(ix, k0, k1, base, ex) {
    var a = members(ix, k0, ex), b = {};
    members(ix, k1, ex).forEach(function (m) { b[m.id] = m; });
    var allW0 = 0, covW0 = 0, rows = [], I0 = 0, I1 = 0, E0 = 0, E1 = 0;
    a.forEach(function (m) {
      allW0 += m.w;
      var n = b[m.id]; if (!n || !ok(m, base) || !ok(n, base)) return;
      covW0 += m.w;
      var q = m.w / m.px;
      rows.push({ id: m.id, w0: m.w, px0: m.px, px1: n.px, e0: eps(m, base), e1: eps(n, base), q: q });
      I0 += q * m.px; I1 += q * n.px; E0 += q * eps(m, base); E1 += q * eps(n, base);
    });
    var gs = [], wg = 0, wgW = 0;
    rows.forEach(function (r) {
      r.cP = r.q * (r.px1 - r.px0) / I0;
      r.cE = r.q * (r.e1 - r.e0) / E0;
      r.cM = r.cP - r.cE;
      r.ret = r.px1 / r.px0 - 1;
      r.g = r.e0 > 0 ? r.e1 / r.e0 - 1 : null;
      r.esh = r.q * r.e0 / E0;                  // share of aggregate start-of-period earnings
      r.wn = r.w0 / covW0;                      // weight within the covered names
      if (r.g != null) { gs.push(r.g); wg += r.wn * clip(r.g); wgW += r.wn; }
    });
    var R = I1 / I0 - 1, g = E1 / E0 - 1, m = (I1 / E1) / (I0 / E0) - 1;
    return { k0: k0, k1: k1, base: base, rows: rows, R: R, g: g, m: m, mCross: (1 + g) * m,
      pe0: I0 / E0, pe1: I1 / E1, cov: allW0 ? covW0 / allW0 : 0, n: rows.length,
      wAvgG: wgW ? wg / wgW : null, medG: median(gs) };
  }

  // Forward growth of one snapshot: CY2026 -> CY2027, aggregate earnings.
  function forward(ix, k, ex) {
    var a = members(ix, k, ex), all = 0, cov = 0, rows = [], E26 = 0, E27 = 0, I = 0;
    a.forEach(function (m) {
      all += m.w;
      if (m.e26 == null || m.e27 == null || !(m.px > 0)) return;
      cov += m.w; var q = m.w / m.px;
      rows.push({ id: m.id, w0: m.w, q: q, e0: m.e26, e1: m.e27, px0: m.px });
      I += q * m.px; E26 += q * m.e26; E27 += q * m.e27;
    });
    var gs = [], wg = 0, wgW = 0;
    rows.forEach(function (r) {
      r.cE = r.q * (r.e1 - r.e0) / E26; r.esh = r.q * r.e0 / E26; r.wn = r.w0 / cov;
      r.g = r.e0 > 0 ? r.e1 / r.e0 - 1 : null;
      if (r.g != null) { gs.push(r.g); wg += r.wn * clip(r.g); wgW += r.wn; }
    });
    return { k: k, rows: rows, g: E27 / E26 - 1, pe26: I / E26, pe27: I / E27, cov: all ? cov / all : 0, n: rows.length,
      wAvgG: wgW ? wg / wgW : null, medG: median(gs) };
  }

  // Concentration of the (filtered) index: by weight, and by earnings on one EPS year.
  function concentration(ix, k, base, ex) {
    var a = members(ix, k, ex).sort(function (x, y) { return y.w - x.w; });
    var top5 = 0, top10 = 0, hhi = 0;
    a.forEach(function (m, i) { if (i < 5) top5 += m.w; if (i < 10) top10 += m.w; hhi += m.w * m.w * 1e4; });
    var cov = a.filter(function (m) { return ok(m, base); }), E = 0;
    cov.forEach(function (m) { m.q = m.w / m.px; m.e = m.q * eps(m, base); E += m.e; });
    var posE = cov.filter(function (m) { return m.e > 0; }).reduce(function (s, m) { return s + m.e; }, 0);
    var byW = cov.slice().sort(function (x, y) { return y.w - x.w; }), byE = cov.slice().sort(function (x, y) { return y.e - x.e; });
    function sh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.e; }); return E ? s / E : null; }
    var covW = cov.reduce(function (s, m) { return s + m.w; }, 0);
    function wsh(list, n) { var s = 0; list.slice(0, n).forEach(function (m) { s += m.w; }); return covW ? s / covW : null; }
    return { top5: top5, top10: top10, hhi: hhi, n: a.length,
      // earnings held by the 10 biggest by weight vs the 10 biggest earners; their weight among covered names
      e10byW: sh(byW, 10), e10byE: sh(byE, 10), w10byE: wsh(byE, 10), w10byW: wsh(byW, 10), posE: E ? posE / E : null };
  }

  // Chain-linked path over all snapshots, rebased to 100 at the first one: price, aggregate EPS, multiple.
  function series(ix, base, ex) {
    var P = [100], E = [100], pe0 = null, steps = [];
    for (var k = 1; k < dates.length; k++) {
      var p = period(ix, k - 1, k, base, ex); steps.push(p);
      if (pe0 == null) pe0 = p.pe0;
      P.push(P[k - 1] * (1 + p.R)); E.push(E[k - 1] * (1 + p.g));
    }
    var PE = P.map(function (v, k) { return pe0 * (v / 100) / (E[k] / 100); });
    return { price: P, eps: E, pe: PE, steps: steps };
  }

  // Sum rows by a key (sector / industry group / security).
  function group(rows, keyFn, fields) {
    var map = {}, order = [];
    rows.forEach(function (r) {
      var k = keyFn(r); if (!map[k]) { map[k] = { key: k, n: 0 }; fields.forEach(function (f) { map[k][f] = 0; }); order.push(k); }
      var o = map[k]; o.n++; fields.forEach(function (f) { o[f] += r[f] || 0; });
    });
    return order.map(function (k) { return map[k]; });
  }

  return { D: D, secs: secs, dates: dates, members: members, period: period, forward: forward, concentration: concentration, series: series, group: group };
}
