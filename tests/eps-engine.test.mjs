// node tests/eps-engine.test.mjs  — engine vs reference numbers computed independently in pandas
// (scripts in docs/EPS_ATTRIBUTION.md §6). Also checks that contributions add up exactly.
import { makeEngine } from '../js/eps-engine.js';
import { EPS_DATA } from '../js/eps-attribution-data.js';
const E = makeEngine(EPS_DATA);
let bad = 0;
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) { bad++; console.log('FAIL', what, a, b); } else console.log('ok  ', what, (+a).toFixed(4)); };

for (const ix of ['spx', 'ndx']) for (const base of ['cy26', 'cy27']) {
  const p = E.period(ix, 1, 4, base);
  const sum = f => p.rows.reduce((s, r) => s + r[f], 0);
  near(sum('cP'), p.R, 1e-9, `${ix} ${base} sum cP = R`);
  near(sum('cE'), p.g, 1e-9, `${ix} ${base} sum cE = g`);
  near(sum('cM'), p.R - p.g, 1e-9, `${ix} ${base} sum cM = R-g`);
  near((1 + p.g) * (1 + p.m) - 1, p.R, 1e-9, `${ix} ${base} (1+g)(1+m)=1+R`);
}
// reference (pandas) YTD Jan-2 -> Oct-16, CY2026
let p = E.period('spx', 1, 4, 'cy26');
near(p.R, 0.121, 0.0015, 'spx YTD R'); near(p.g, 0.174, 0.0015, 'spx YTD EPS rev'); near(p.pe0, 23.6, 0.06, 'spx PE0'); near(p.pe1, 22.5, 0.06, 'spx PE1');
p = E.period('ndx', 1, 4, 'cy26');
near(p.R, 0.186, 0.0015, 'ndx YTD R'); near(p.g, 0.250, 0.0015, 'ndx YTD EPS rev');
// ex-semis changes the answer
const semis = new Set(EPS_DATA.secs.map((s, i) => s.g === 'Semiconductors & Semiconductor Equipment' ? i : -1).filter(i => i >= 0));
const x = E.period('spx', 1, 4, 'cy26', semis);
console.log('spx YTD ex-semis: R %s g %s m %s', x.R.toFixed(4), x.g.toFixed(4), x.m.toFixed(4));
process.exit(bad ? 1 : 0);
