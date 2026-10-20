// node tests/eps-engine.test.mjs — identities of the EPS attribution engine + an independent brute-force check.
import { EPS_DATA as D } from '../js/eps-attribution-data.js';
import { makeEngine } from '../js/eps-engine.js';
var E = makeEngine(D), bad = 0;
function ok(c, m) { if (!c) { bad++; console.log('FAIL', m); } }
function near(a, b, t, m) { ok(Math.abs(a - b) < (t || 1e-9), m + ' (' + a + ' vs ' + b + ')'); }
var last = D.dates.length - 1, k0 = D.dates.indexOf('2026-01-02');
var by = D.snaps.map(function (s) { var m = {}; s.forEach(function (r) { m[r[0]] = r; }); return m; });

// independent walk: step by step, weights of the names held at the start of the step that have data at both ends
function brute(ix, base, ka, kb) {
  var col = ix === 'spx' ? 1 : 2, ec = base === 'cy27' ? 5 : 4, W = 1, G = 0, perId = {}, cum = 1;
  for (var j = ka; j < kb; j++) {
    var held = D.snaps[j].filter(function (r) { return r[col] > 0 && r[3] > 0 && r[ec] != null && by[j + 1][r[0]] && by[j + 1][r[0]][3] > 0 && by[j + 1][r[0]][ec] != null; });
    var tot = held.reduce(function (s, r) { return s + r[col]; }, 0), Rj = 0, Gj = 0;
    held.forEach(function (r) {
      var w = r[col] / tot, n = by[j + 1][r[0]], ret = n[3] / r[3] - 1, g = r[ec] > 0 ? n[ec] / r[ec] - 1 : 0;
      Rj += w * ret; Gj += w * g; perId[r[0]] = perId[r[0]] || { cP: 0, cE: 0 };
      perId[r[0]].cP += cum * w * ret; perId[r[0]].cE += cum * w * g;
    });
    G += cum * Gj; cum *= 1 + Rj;
  }
  return { R: cum - 1, G: G, perId: perId };
}
['spx', 'ndx'].forEach(function (ix) {
  ['cy26', 'cy27'].forEach(function (base) {
    [last, last - 1, k0 + 1].forEach(function (k1) {
      var p = E.period(ix, k0, k1, base), sum = function (f) { return p.rows.reduce(function (s, r) { return s + r[f]; }, 0); }, tag = ix + base + k1;
      near(sum('cP'), p.R, 1e-9, tag + ' sum cP = R'); near(sum('cE'), p.G, 1e-9, tag + ' sum cE = G');
      near(sum('cE') + sum('cM'), p.R, 1e-9, tag + ' EPS + multiple = price');
      [function (r) { return D.secs[r.id].s; }, function (r) { return D.secs[r.id].g; }].forEach(function (key, i) {
        var gs = E.group(p.rows, key);
        near(gs.reduce(function (s, o) { return s + o.cP; }, 0), p.R, 1e-9, tag + ' level ' + i + ' adds up to R');
        near(gs.reduce(function (s, o) { return s + o.cE; }, 0), p.G, 1e-9, tag + ' level ' + i + ' adds up to G');
        gs.forEach(function (o) { if (o.m != null) near((1 + o.g) * (1 + o.m), 1 + o.ret, 1e-9, 'group (1+g)(1+m) = 1+ret'); });
      });
      var b = brute(ix, base, k0, k1);
      near(b.R, p.R, 1e-9, tag + ' brute-force R'); near(b.G, p.G, 1e-9, tag + ' brute-force G');
      p.rows.forEach(function (r) { var x = b.perId[r.id]; ok(x, tag + ' row has brute-force twin'); if (x) { near(x.cP, r.cP, 1e-9, tag + ' ' + D.secs[r.id].t + ' cP'); near(x.cE, r.cE, 1e-9, tag + ' ' + D.secs[r.id].t + ' cE'); } });
    });
  });
});
// names that joined or left are counted only while they were members
var pn = E.period('ndx', k0, last, 'cy27'), iaz = D.secs.findIndex(function (s) { return s.t === 'AZN'; }), az = pn.rows.find(function (r) { return r.id === iaz; });
ok(az && az.last < last - 1, 'AZN counted until it left'); ok(pn.entered.n > 0, 'some names entered during the period');
// excluding everything but one name leaves that name's own numbers
var one = new Set(); D.secs.forEach(function (s, i) { if (s.t !== 'NVDA') one.add(i); });
var n = E.period('spx', k0, last, 'cy26', one); ok(n.n === 1, 'single name'); near(n.R, n.rows[0].ret, 1e-12, 'single-name return'); near(n.G + n.M, n.R, 1e-12, 'single-name EPS + multiple = return');
console.log(bad ? bad + ' failures' : 'all engine checks pass');
process.exit(bad ? 1 : 0);
