// node tests/eps-engine.test.mjs — identities of the EPS attribution engine + an independent brute-force check.
import { EPS_DATA as D } from '../js/eps-attribution-data.js';
import { makeEngine } from '../js/eps-engine.js';
var E = makeEngine(D), bad = 0;
function ok(c, m) { if (!c) { bad++; console.log('FAIL', m); } }
function near(a, b, t, m) { ok(Math.abs(a - b) < (t || 1e-9), m + ' (' + a + ' vs ' + b + ')'); }
var last = D.dates.length - 1, k0 = D.dates.indexOf('2026-01-02');
['spx', 'ndx'].forEach(function (ix) {
  ['cy26', 'cy27'].forEach(function (base) {
    var p = E.period(ix, k0, last, base), sum = function (f) { return p.rows.reduce(function (s, r) { return s + r[f]; }, 0); };
    near(sum('cP'), p.R, 1e-9, ix + base + ' sum cP = R'); near(sum('cE'), p.G, 1e-9, ix + base + ' sum cE = G');
    near(sum('cE') + sum('cM'), p.R, 1e-9, ix + base + ' EPS + multiple = price');
    // sectors and industry groups add up to the index
    [function (r) { return D.secs[r.id].s; }, function (r) { return D.secs[r.id].g; }].forEach(function (key, i) {
      var gs = E.group(p.rows, key);
      near(gs.reduce(function (s, o) { return s + o.cP; }, 0), p.R, 1e-9, ix + base + ' level ' + i + ' adds up to R');
      near(gs.reduce(function (s, o) { return s + o.cE; }, 0), p.G, 1e-9, ix + base + ' level ' + i + ' adds up to G');
      gs.forEach(function (o) { if (o.m != null) near((1 + o.g) * (1 + o.m), 1 + o.ret, 1e-9, 'group (1+g)(1+m) = 1+ret'); });
    });
    // brute force from the raw rows: weight x return, weights renormalised over the members, names with an end price
    var row1 = {}; D.snaps[last].forEach(function (r) { row1[r[0]] = r; });
    var col = ix === 'spx' ? 1 : 2, tot = 0, R = 0, G = 0;
    D.snaps[k0].forEach(function (r) { if (r[col] > 0) tot += r[col]; });
    p.rows.forEach(function (r) {
      var a = D.snaps[k0].find(function (x) { return x[0] === r.id; }), b = row1[r.id], e0 = base === 'cy27' ? a[5] : a[4], e1 = base === 'cy27' ? b[5] : b[4], w = a[col] / tot;
      R += w * (b[3] / a[3] - 1); if (e0 > 0) G += w * (e1 / e0 - 1);
    });
    near(R, p.R, 1e-9, ix + base + ' brute-force R'); near(G, p.G, 1e-9, ix + base + ' brute-force G');
    // every start member is either in rows or in skipped
    near(p.rows.length + p.skipped.length, p.nStart, 0, ix + base + ' rows + skipped = members');
  });
});
// excluding everything but one name leaves that name's own numbers
var one = new Set(); D.secs.forEach(function (s, i) { if (s.t !== 'NVDA') one.add(i); });
var n = E.period('spx', k0, last, 'cy26', one); ok(n.n === 1, 'single name'); near(n.R, n.rows[0].ret, 1e-12, 'single-name return'); near(n.G, n.rows[0].g, 1e-12, 'single-name EPS growth');
console.log(bad ? bad + ' failures' : 'all engine checks pass');
process.exit(bad ? 1 : 0);
