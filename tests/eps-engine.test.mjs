// node tests/eps-engine.test.mjs — identities of the EPS attribution engine + an independent brute-force check.
import { EPS_DATA as D } from '../js/eps-attribution-data.js';
import { makeEngine } from '../js/eps-engine.js';
var E = makeEngine(D), bad = 0;
function ok(c, m) { if (!c) { bad++; console.log('FAIL', m); } }
function near(a, b, t, m) { ok(Math.abs(a - b) < (t || 1e-9), m + ' (' + a + ' vs ' + b + ')'); }
var last = D.dates.length - 1, k0 = D.dates.indexOf('2026-01-02');
['spx', 'ndx'].forEach(function (ix) {
  ['fwd', 'cy26', 'cy27'].forEach(function (base) {
    var p = E.period(ix, k0, last, base), sum = function (f) { return p.rows.reduce(function (s, r) { return s + r[f]; }, 0); };
    near(sum('cP'), p.R, 1e-9, ix + base + ' sum cP = R'); near(sum('cE'), p.g, 1e-9, ix + base + ' sum cE = g');
    near((1 + p.g) * (1 + p.m), 1 + p.R, 1e-9, ix + base + ' (1+g)(1+m) = 1+R');
    // sectors add up to the index
    var gs = E.group(p.rows, function (r) { return D.secs[r.id].s; });
    near(gs.reduce(function (s, o) { return s + o.cP; }, 0), p.R, 1e-9, ix + base + ' sectors add up');
    // brute force from raw rows: price return of the start basket
    var row1 = {}; D.snaps[last].forEach(function (r) { row1[r[0]] = r; });
    var I0 = 0, I1 = 0; p.rows.forEach(function (r) { var q = r.w0 / r.px0; I0 += q * r.px0; I1 += q * row1[r.id][3]; });
    near(I1 / I0 - 1, p.R, 1e-9, ix + base + ' brute-force R');
  });
});
// rolling basis: CY2026 at the start, CY2027 at the end on a YTD window
var y = E.period('spx', k0, last, 'fwd'); ok(y.y0 === 'CY2026' && y.y1 === 'CY2027', 'forward year rolls');
// excluding everything but one name leaves that name's own numbers
var one = new Set(); D.secs.forEach(function (s, i) { if (s.t !== 'NVDA') one.add(i); });
var n = E.period('spx', k0, last, 'cy26', one); ok(n.n === 1, 'single name'); near(n.R, n.rows[0].ret, 1e-12, 'single-name return'); near(n.g, n.rows[0].g, 1e-12, 'single-name EPS growth');
console.log(bad ? bad + ' failures' : 'all engine checks pass');
process.exit(bad ? 1 : 0);
