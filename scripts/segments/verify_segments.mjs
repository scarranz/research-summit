// THE ACCEPTANCE TEST for a segments dataset.
//
//   node scripts/segments/verify_segments.mjs AMZN
//
// A bridge claims that a list of terms multiplies to a target. This resolves every driver —
// including the `from: results:<key>` pointers, which is also how it proves those pointers still
// land on something — computes the derived ratios, and checks the claim period by period.
//
//   kind: 'independent'   the terms come from separate sources, so a residual is a real finding
//   kind: 'decomposition' one term is derived from the target, so ANY residual is broken arithmetic
//
// It also prints each bridge as a table, because a bridge that reconciles and reads as nonsense
// is still wrong, and only a human can see that.
const TK = (process.argv[2] || 'AMZN').toLowerCase();
const seg = (await import(`../../js/segments-data/${TK}.js`))[`${TK}Segments`];
const res = (await import(`../../js/results-data/${TK}.js`))[`${TK}Results`];

const PPY = { q: 4, y: 1 };
const fmt = (v, unit) => v == null ? '—'
  : unit === 'pct' ? (v * 100).toFixed(1) + '%'
  : unit === 'x'   ? v.toFixed(2) + 'x'
  : unit === 'days'? v.toFixed(0)
  : Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'B' : v.toFixed(0) + 'M';

// resolve a driver key -> { unit, series(view) -> {period: value} }, merging act then summit
function driver(s, key, view) {
  const d = s.drivers[key] || seg.shared[key];
  if (!d) return null;
  if (d.from) {                                   // pointer into results-data
    const mk = d.from.split(':')[1];
    const m = res.views[view] && res.views[view].metrics[mk];
    if (!m) return null;
    const out = {};
    m.periods.forEach((p, i) => {
      const v = m.act && m.act[i] != null ? m.act[i] : (m.summit ? m.summit[i] : null);
      if (v != null) out[p] = v;
    });
    return { unit: 'usdM', vals: out, ref: d.from };
  }
  const blk = d[view];
  if (!blk) return null;
  return { unit: d.unit, vals: { ...blk.act, ...blk.summit }, src: d.src };
}

function derived(s, key, view) {
  const spec = seg.derived[key];
  if (!spec) return null;
  const n = driver(s, spec.num, view), dd = driver(s, spec.den, view);
  if (!n || !dd) return null;
  const out = {};
  for (const p of Object.keys(n.vals)) {
    const den = dd.vals[p];
    if (den == null || !den) continue;
    out[p] = n.vals[p] / (den * (spec.annualiseDen ? PPY[view] : 1));
  }
  return { unit: spec.unit, vals: out, derivedFrom: [spec.num, spec.den] };
}

const resolve = (s, key, view) => seg.derived[key] ? derived(s, key, view) : driver(s, key, view);

let fail = 0, checked = 0;
for (const s of seg.segments) {
  console.log(`\n${'='.repeat(78)}\n${s.label}`);
  for (const b of s.bridges) {
    const view = b.view;
    const target = resolve(s, b.target, view);
    const terms = b.terms.map(t => [t, resolve(s, t, view)]);
    const missing = terms.filter(([, v]) => !v).map(([t]) => t);
    console.log(`\n  ▸ ${b.label} (${view}, ${b.kind}) — ${b.identity}`);
    if (!target || missing.length) { console.log('    UNRESOLVED:', missing.join(', ') || b.target); fail++; continue; }
    const periods = seg.axis[view].filter(p => target.vals[p] != null && terms.every(([, v]) => v.vals[p] != null));
    if (!periods.length) { console.log('    no overlapping periods'); fail++; continue; }

    const w = 9;
    console.log('    ' + 'period'.padEnd(24) + periods.map(p => p.padStart(w)).join(''));
    for (const [k, v] of terms) {
      const lab = (s.drivers[k] || seg.shared[k] || seg.derived[k]).short || k;
      console.log('    ' + ('  ' + lab).padEnd(24) + periods.map(p => fmt(v.vals[p], v.unit).padStart(w)).join(''));
    }
    console.log('    ' + ('= ' + (s.drivers[b.target]?.short || b.target)).padEnd(24)
      + periods.map(p => fmt(target.vals[p], 'usdM').padStart(w)).join(''));

    let worst = 0;
    for (const p of periods) {
      const prod = terms.reduce((a, [, v]) => a * v.vals[p], 1);
      const t = target.vals[p];
      worst = Math.max(worst, Math.abs(prod - t) / Math.abs(t));
      checked++;
    }
    const tol = b.kind === 'decomposition' ? 1e-9 : 0.02;
    const ok = worst <= tol;
    if (!ok) fail++;
    console.log(`    residual: max ${(worst * 100).toExponential(1)}%  tolerance ${(tol * 100)}%  -> ${ok ? 'RECONCILES' : 'FAILS'}`);
  }
  const hi = s.highlights.map(h => {
    const v = resolve(s, h, 'y'); if (!v) return null;
    const ps = seg.axis.y.filter(p => v.vals[p] != null);
    return ps.length ? `${(seg.derived[h] || {}).short || h}: ${fmt(v.vals[ps[0]], v.unit)} (${ps[0]}) -> ${fmt(v.vals[ps[ps.length - 1]], v.unit)} (${ps[ps.length - 1]})` : null;
  }).filter(Boolean);
  console.log('\n  highlights (annual, first -> last):');
  hi.forEach(h => console.log('    ' + h));
}
// ── the OTHER cuts ───────────────────────────────────────────────────────────
// A disaggregation has exactly one acceptance test: the parts add to the whole. Product lines and
// countries are alternative slices of the SAME consolidated net sales, so every period must sum to
// reported revenue. Anything else means a line was dropped, double-counted, or restated in one
// place and not the other.
let othChecked = 0, othFail = 0;
for (const c of (seg.other || [])) {
  console.log(`\n${'='.repeat(78)}\n${c.label} — ${c.sub}`);
  for (const view of Object.keys(c.axis || {})) {
    const rev = res.views[view] && res.views[view].metrics.rev;
    if (!rev) { console.log(`  ${view}: no reported revenue to check against`); continue; }
    const bad = [];
    for (const p of c.axis[view]) {
      const i = rev.periods.indexOf(p);
      if (i < 0 || rev.act[i] == null) continue;
      const sum = c.series.reduce((a, x) => {
        const ref = (x.ref && typeof x.ref === 'object') ? x.ref[view] : x.ref;
        if (!ref) return a;
        const [kind, key] = ref.split(':');
        if (kind === 'shared') return a + (((seg.shared[key] || {})[view] || { act: {} }).act[p] || 0);
        const m = res.views[view].metrics[key], j = m ? m.periods.indexOf(p) : -1;
        return a + (j >= 0 && m.act[j] != null ? m.act[j] : 0);
      }, 0);
      const d = Math.abs(sum - rev.act[i]) / rev.act[i];
      othChecked++;
      if (d > 1e-9) { othFail++; bad.push(`    ${p}  parts ${fmt(sum)}  vs reported ${fmt(rev.act[i])}  ${(d * 100).toFixed(4)}%`); }
    }
    console.log(`  ${view}: ${c.axis[view].length} periods × ${c.series.length} series` +
      (bad.length ? ` — ${bad.length} DO NOT ADD UP\n${bad.join('\n')}`
                  : ' — every period adds to reported revenue'));
  }
}

console.log(`\n${'='.repeat(78)}`);
console.log(`${checked} period-checks across ${seg.segments.reduce((a, s) => a + s.bridges.length, 0)} bridges — ${fail ? fail + ' FAILURES' : 'all reconcile'}`);
if (seg.other) console.log(`${othChecked} period-checks across ${seg.other.length} alternative revenue cuts — ${othFail ? othFail + ' DO NOT ADD UP' : 'all add to reported revenue'}`);
process.exit(fail + othFail ? 1 : 0);
