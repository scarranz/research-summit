// eps-attribution.js — Market Analysis > EPS Attribution tab (third tab of tp-rot, next to Index Analysis).
// What drove the index this year: aggregate EPS revisions vs multiple, by security / industry group / sector,
// with any group removable (ex-semis, ex-IT, ...). Maths: js/eps-engine.js · charts: js/eps-charts.js ·
// data: js/eps-attribution-data.js (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine, BASES } from './eps-engine.js';
import { stepBars, lineChart, waterfall, ppTxt, legendItem } from './eps-charts.js';
import { SCOLS } from './portal-data.js';

var C = { eps: '#185FA5', mult: '#BA7517', tot: '#1E2733', pos: '#185FA5', neg: '#9B2A20' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var SEMI = 'Semiconductors & Semiconductor Equipment';
var PRESETS = [
  { k: 'semis', label: 'Semiconductors', test: function (s) { return s.g === SEMI; } },
  { k: 'it', label: 'Information Technology', test: function (s) { return s.s === 'Information Technology'; } },
  { k: 'gaap', label: 'GOOGL · GOOG · AMZN', test: function (s) { return ['GOOGL', 'GOOG', 'AMZN'].indexOf(s.t) >= 0; } },
  { k: 'nvmu', label: 'NVDA · MU', test: function (s) { return ['NVDA', 'MU'].indexOf(s.t) >= 0; } }
];
var METRICS = [['cE', 'EPS revision'], ['cP', 'Price return'], ['cM', 'Multiple (P/E)']];
var LEVELS = [['sec', 'Security'], ['ig', 'Industry group'], ['sector', 'Sector']];

var E = null, root = null, S = null;

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function dLong(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function dShort(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + " '" + String(d.getUTCFullYear()).slice(2); }
function pc(v, d) { return v == null || isNaN(v) ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(d == null ? 1 : d) + '%'; }
function pp(v, d) { return v == null || isNaN(v) ? '—' : ppTxt(v, d == null ? 2 : d) + ' pp'; }
function x1(v) { return v == null || isNaN(v) ? '—' : v.toFixed(1) + 'x'; }
function cls(v) { return v > 0.00005 ? 'pos' : v < -0.00005 ? 'neg' : ''; }
function secColor(s) { return SCOLS[s] || SCOLS[s === 'Information Technology' ? 'Technology' : s] || '#888'; }
function baseLbl() { return S.base === 'cy27' ? 'CY2027' : 'CY2026'; }
function ixLbl() { return S.ix === 'spx' ? 'S&P 500' : 'Nasdaq-100'; }
function seg(act, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" data-act="' + act + '" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}

// ─── state ────────────────────────────────────────────────────────
function initialState() {
  var last = E.dates.length - 1, ytd = E.dates.indexOf('2026-01-02');
  return { ix: 'spx', base: 'cy26', k0: ytd >= 0 ? ytd : 0, k1: last, ex: {}, custom: [], metric: 'cE', level: 'sec', fk: last, sort: 'cE', dir: -1, q: '', all: false };
}
function exSet() {
  var set = new Set();
  E.secs.forEach(function (s, i) {
    if (PRESETS.some(function (p) { return S.ex[p.k] && p.test(s); }) || S.custom.indexOf(s.t) >= 0) set.add(i);
  });
  return set;
}
function filtered() { return Object.keys(S.ex).some(function (k) { return S.ex[k]; }) || S.custom.length > 0; }

// ─── compute ──────────────────────────────────────────────────────
function compute() {
  var ex = exSet(), f = ex.size > 0;
  var cur = E.period(S.ix, S.k0, S.k1, S.base, ex);
  return { ex: ex, f: f, cur: cur, all: f ? E.period(S.ix, S.k0, S.k1, S.base, null) : cur };
}

function lbl(row, level) {
  var s = E.secs[row.id];
  return level === 'sec' ? s.t : level === 'ig' ? s.g : s.s;
}
// rows of a period grouped at a level, with the fields the charts and the table need
function grouped(p, level) {
  var I1 = 0; p.rows.forEach(function (r) { I1 += r.q * r.px1; });
  p.rows.forEach(function (r) { r.qp0 = r.q * r.px0; r.qp1 = r.q * r.px1; r.qe0 = r.q * r.e0; r.qe1 = r.q * r.e1; });
  var key = function (r) { return level === 'sec' ? r.id : lbl(r, level); };
  var list = E.group(p.rows, key, ['w0', 'cP', 'cE', 'cM', 'qp0', 'qp1', 'qe0', 'qe1']);
  list.forEach(function (g) {
    var first = null; p.rows.some(function (r) { if (key(r) === g.key) { first = r; return true; } });
    var s = E.secs[first.id];
    g.label = level === 'sec' ? s.t : g.key; g.name = level === 'sec' ? s.n : (g.n + ' securities');
    g.sector = s.s; g.ig = s.g;
    g.w0n = g.w0 / p.cov_w0; g.w1n = g.qp1 / I1;
    g.ret = g.qp1 / g.qp0 - 1; g.eg = g.qe0 > 0 ? g.qe1 / g.qe0 - 1 : null;
    g.pe0 = g.qe0 > 0 ? g.qp0 / g.qe0 : null; g.pe1 = g.qe1 > 0 ? g.qp1 / g.qe1 : null;
  });
  return list;
}
function withCov(p) { var s = 0; p.rows.forEach(function (r) { s += r.w0; }); p.cov_w0 = s; return p; }

// ─── sections ─────────────────────────────────────────────────────
function sec(title, note, body, id) {
  return '<div class="sec"' + (id ? ' id="' + id + '"' : '') + '><div class="sechdr"><span class="sect">' + title + '</span><span class="secn">' + (note || '') + '</span></div><div class="card">' + body + '</div></div>';
}

function controls() {
  var d = E.dates, pre = [['ytd', 'YTD 2026', d.indexOf('2026-01-02'), d.length - 1], ['all', 'Since ' + dShort(d[0]), 0, d.length - 1], ['q', 'Last quarter', d.length - 2, d.length - 1]];
  var opts = function (sel, from, to) { var h = ''; for (var k = from; k <= to; k++) h += '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + dLong(d[k]) + '</option>'; return h; };
  var chips = PRESETS.map(function (p) { return '<span class="sb-secchip' + (S.ex[p.k] ? ' active' : '') + '" data-act="ex" data-v="' + p.k + '">' + p.label + '</span>'; }).join('') +
    S.custom.map(function (t) { return '<span class="sb-secchip active" data-act="uncustom" data-v="' + esc(t) + '">' + esc(t) + '<span class="eps-x">×</span></span>'; }).join('') +
    '<input type="text" id="eps-add" placeholder="+ ticker" list="eps-tickers" style="width:86px" autocomplete="off">' +
    (filtered() ? '<span class="sb-secchip" data-act="exclear" style="border-style:dashed">Clear</span>' : '');
  var tick = '<datalist id="eps-tickers">' + E.secs.map(function (s) { return '<option value="' + esc(s.t) + '">'; }).join('') + '</datalist>';
  return '<div class="eps-ctl">' +
    '<div><span class="eps-lbl">Index</span>' + seg('ix', [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']], S.ix) + '</div>' +
    '<div><span class="eps-lbl">EPS year</span>' + seg('base', BASES, S.base) + '</div>' +
    '<div><span class="eps-lbl">Period</span><div class="eps-chips"><select data-act="k0">' + opts(S.k0, 0, d.length - 2) + '</select><span style="color:var(--mu)">→</span><select data-act="k1">' + opts(S.k1, 1, d.length - 1) + '</select>' +
    pre.map(function (p) { return '<span class="sb-secchip' + (S.k0 === p[2] && S.k1 === p[3] ? ' active' : '') + '" data-act="pre" data-v="' + p[2] + ',' + p[3] + '">' + p[1] + '</span>'; }).join('') + '</div></div>' +
    '<div><span class="eps-lbl">Remove from the index</span><div class="eps-chips">' + chips + '</div></div></div>' + tick;
}

function gaapWarn() {
  if (S.base !== 'cy26' || S.ex.gaap) return '';
  var last = E.dates.length - 1, prev = last - 1, out = [];
  ['GOOGL', 'AMZN'].forEach(function (t) {
    var id = E.secs.findIndex(function (s) { return s.t === t; }); if (id < 0) return;
    var a = E.D.snaps[prev].find(function (r) { return r[0] === id; }), b = E.D.snaps[last].find(function (r) { return r[0] === id; });
    if (a && b && a[4] != null && b[4] != null && b[5] != null && b[4] > b[5])
      out.push(t + ' CY26 EPS $' + a[4].toFixed(2) + ' → $' + b[4].toFixed(2) + ' (' + dShort(E.dates[prev]) + ' → ' + dShort(E.dates[last]) + '), above its CY27 $' + b[5].toFixed(2));
  });
  return out.length ? '<div class="eps-warn"><b>GAAP basis.</b> The consensus here is Bloomberg GAAP EPS, so non-operating items enter the estimates: ' + out.join('; ') +
    '. That is consistent with one-off gains in the CY2026 figure, and it inflates the CY2026 revision (check it with <b>Remove GOOGL · GOOG · AMZN</b> or switch to CY2027).</div>' : '';
}

function kpis(c) {
  var p = c.cur, a = c.all, sub = function (cur, all, fn) { return c.f ? 'Whole index: ' + fn(all) : '&nbsp;'; };
  var tile = function (k, v, s) { return '<div class="eps-kpi"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="s">' + s + '</div></div>'; };
  return '<div class="eps-kpis">' +
    tile('Price return', '<span class="' + cls(p.R) + '">' + pc(p.R) + '</span>', sub(p.R, a.R, pc)) +
    tile('Aggregate EPS revision, ' + baseLbl(), '<span class="' + cls(p.g) + '">' + pc(p.g) + '</span>', sub(p.g, a.g, pc)) +
    tile('Multiple (P/E) change', '<span class="' + cls(p.m) + '">' + pc(p.m) + '</span>', x1(p.pe0) + ' → ' + x1(p.pe1) + (c.f ? ' · whole index ' + x1(a.pe0) + ' → ' + x1(a.pe1) : '')) +
    tile('Coverage', (p.cov * 100).toFixed(1) + '%', p.n + ' names with ' + baseLbl() + ' EPS at both dates') + '</div>';
}
function reading(c) {
  var p = c.cur, who = c.f ? ixLbl() + ' without ' + removedText() : ixLbl();
  return who + (p.R >= 0 ? ' gained ' : ' lost ') + Math.abs(p.R * 100).toFixed(1) + '% from ' + dLong(E.dates[p.k0]) + ' to ' + dLong(E.dates[p.k1]) +
    '. Aggregate ' + baseLbl() + ' EPS moved ' + pc(p.g) + ' while the P/E went from ' + x1(p.pe0) + ' to ' + x1(p.pe1) + ' (' + pc(p.m) + '), which ' + ((p.R - p.g) >= 0 ? 'adds ' : 'subtracts ') + Math.abs((p.R - p.g) * 100).toFixed(1) + ' pp to the return.' + (Math.abs(p.R) > 0.005 ? ' The EPS revision is ' + (p.g / p.R * 100).toFixed(0) + '% of the price return.' : '');
}
function removedText() {
  var n = []; PRESETS.forEach(function (p) { if (S.ex[p.k]) n.push(p.label); }); S.custom.forEach(function (t) { n.push(t); });
  return n.join(', ');
}

// EPS vs multiple, period by period
function steps(c) {
  var gs = [], total = E.period(S.ix, S.k0, S.k1, S.base, c.ex), n = E.dates.length;
  for (var k = 1; k < n; k++) {
    var p = E.period(S.ix, k - 1, k, S.base, c.ex), inside = k - 1 >= S.k0 && k <= S.k1;
    gs.push({ label: dShort(E.dates[k - 1]) + '\n→ ' + dShort(E.dates[k]), eps: p.g, mult: p.R - p.g, tot: p.R, dim: !inside, tip: stepTip(p) });
  }
  gs.push({ label: 'Selected period\n' + dShort(E.dates[S.k0]) + ' → ' + dShort(E.dates[S.k1]), eps: total.g, mult: total.R - total.g, tot: total.R, tip: stepTip(total) });
  stepBars(document.getElementById('eps-steps'), gs, C);
}
function stepTip(p) {
  return '<b style="font-size:13px">' + dLong(E.dates[p.k0]) + ' → ' + dLong(E.dates[p.k1]) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">' +
    'Price return <b>' + pc(p.R) + '</b><br>EPS revision <b>' + pc(p.g) + '</b><br>Multiple <b>' + pp(p.R - p.g, 1) + '</b> (P/E ' + x1(p.pe0) + ' → ' + x1(p.pe1) + ')<br>Coverage ' + (p.cov * 100).toFixed(1) + '%</span>';
}
function paths(c) {
  var a = E.series(S.ix, S.base, c.ex), b = c.f ? E.series(S.ix, S.base, null) : null, lab = E.dates.map(dShort);
  var f0 = function (v) { return v.toFixed(0); };
  var s1 = [{ name: 'Price' + (c.f ? ' (filtered)' : ''), color: C.tot, vals: a.price }, { name: 'Aggregate ' + baseLbl() + ' EPS' + (c.f ? ' (filtered)' : ''), color: C.eps, vals: a.eps }];
  if (b) { s1.push({ name: 'Price (whole index)', color: C.tot, vals: b.price, dash: true }); s1.push({ name: 'EPS (whole index)', color: C.eps, vals: b.eps, dash: true }); }
  lineChart(document.getElementById('eps-path-a'), lab, s1, f0, { endFmt: function (v) { return v.toFixed(1); } });
  var s2 = [{ name: 'P/E on ' + baseLbl() + (c.f ? ' (filtered)' : ''), color: C.mult, vals: a.pe }];
  if (b) s2.push({ name: 'P/E (whole index)', color: C.mult, vals: b.pe, dash: true });
  lineChart(document.getElementById('eps-path-b'), lab, s2, x1, { endFmt: x1 });
}

// Who drove it
function who(c) {
  var level = S.level, p = withCov(c.cur), list = grouped(p, level), m = S.metric;
  var total = m === 'cE' ? p.g : m === 'cP' ? p.R : p.R - p.g, N = level === 'sec' ? 10 : level === 'ig' ? 8 : 11;
  var top = list.slice().sort(function (a, b) { return Math.abs(b[m]) - Math.abs(a[m]); }).slice(0, N).sort(function (a, b) { return b[m] - a[m]; });
  var shown = 0; top.forEach(function (g) { shown += g[m]; });
  var rows = top.map(function (g) { return { label: g.label, v: g[m], tip: rowTip(g, level) }; });
  var mname = METRICS.filter(function (x) { return x[0] === m; })[0][1];
  var head = '';
  if (m === 'cE' && total > 0 && top.length > 2 && level !== 'sector') {
    var byV = list.slice().sort(function (a, b) { return b.cE - a.cE; }), t2 = byV[0].cE + byV[1].cE, t10 = byV.slice(0, 10).reduce(function (s, g) { return s + g.cE; }, 0);
    if (t2 >= 0 && t10 >= t2 && t10 <= total) head = '<div class="eps-seg"><div style="flex:' + Math.max(t2, 0.0001) + ';background:' + C.eps + '"></div><div style="flex:' + Math.max(t10 - t2, 0.0001) + ';background:#0E2F55"></div><div style="flex:' + Math.max(total - t10, 0.0001) + ';background:#C9CFD8"></div></div>' +
      '<div class="eps-leg" style="margin:-6px 0 14px">' + legendItem(C.eps, byV[0].label + ' + ' + byV[1].label + ': <b>' + (t2 / total * 100).toFixed(0) + '%</b> of the total') + legendItem('#0E2F55', 'next 8: <b>' + ((t10 - t2) / total * 100).toFixed(0) + '%</b>') + legendItem('#C9CFD8', 'rest of index: <b>' + ((total - t10) / total * 100).toFixed(0) + '%</b>') + '</div>';
  }
  document.getElementById('eps-who-head').innerHTML = head;
  waterfall(document.getElementById('eps-who'), rows, {
    rest: level === 'sector' ? null : total - shown, restLabel: 'Rest of index', fmt: function (v) { return ppTxt(v, 1) + ' pp'; }, pos: C.pos, neg: C.neg,
    totalLabel: ixLbl() + (c.f ? ' (filtered)' : ''), axisTitle: mname + ' — contribution, percentage points of the index',
    axisFmt: function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t); }
  });
}
function rowTip(g, level) {
  return '<b style="font-size:13px">' + esc(g.label) + '</b><span style="display:block;color:#52514e;font-size:12px;margin-top:2px">' + esc(g.name) + (level === 'sec' ? ' · ' + esc(g.ig) : '') + '<br>' +
    'Weight ' + (g.w0n * 100).toFixed(2) + '% → ' + (g.w1n * 100).toFixed(2) + '%<br>' +
    (level === 'sec' ? 'EPS ' : 'Aggregate EPS ') + pc(g.eg) + ' · P/E ' + x1(g.pe0) + ' → ' + x1(g.pe1) + '<br>Price ' + pc(g.ret) +
    '<br>Contribution: EPS <b>' + pp(g.cE) + '</b> · multiple <b>' + pp(g.cM) + '</b> · price <b>' + pp(g.cP) + '</b></span>';
}

// Forward growth CY2026 -> CY2027 of one snapshot
function fwd(c) {
  var f = E.forward(S.ix, S.fk, c.ex), list = E.group(f.rows, function (r) { return S.level === 'sec' ? r.id : lbl(r, S.level); }, ['w0', 'cE', 'esh']);
  var N = S.level === 'sec' ? 10 : S.level === 'ig' ? 8 : 11;
  list.forEach(function (g) {
    var first = f.rows.filter(function (r) { return (S.level === 'sec' ? r.id : lbl(r, S.level)) === g.key; })[0], s = E.secs[first.id];
    g.label = S.level === 'sec' ? s.t : g.key; g.name = S.level === 'sec' ? s.n : g.n + ' securities';
  });
  var top = list.slice().sort(function (a, b) { return Math.abs(b.cE) - Math.abs(a.cE); }).slice(0, N).sort(function (a, b) { return b.cE - a.cE; });
  var shown = top.reduce(function (s, g) { return s + g.cE; }, 0);
  var rows = top.map(function (g) {
    return { label: g.label, v: g.cE, tip: '<b style="font-size:13px">' + esc(g.label) + '</b><span style="display:block;color:#52514e;font-size:12px;margin-top:2px">' + esc(g.name) +
      '<br>Share of index earnings (CY26) ' + (g.esh * 100).toFixed(1) + '%<br>Contribution to CY26→CY27 growth <b>' + pp(g.cE) + '</b></span>' };
  });
  document.getElementById('eps-fwd-pills').innerHTML = E.dates.map(function (d, k) { return '<button class="ndx-tab-btn' + (k === S.fk ? ' active' : '') + '" data-act="fk" data-v="' + k + '">' + dShort(d) + '</button>'; }).join('');
  waterfall(document.getElementById('eps-fwd'), rows, { rest: S.level === 'sector' ? null : f.g - shown, fmt: function (v) { return ppTxt(v, 1) + ' pp'; }, pos: C.pos, neg: C.neg,
    totalLabel: 'CY26 → CY27 growth' + (c.f ? ' (filtered)' : ''), axisTitle: 'Contribution to aggregate EPS growth, percentage points',
    axisFmt: function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t); } });
  var series = E.dates.map(function (_, k) { return E.forward(S.ix, k, c.ex); }), whole = c.f ? E.dates.map(function (_, k) { return E.forward(S.ix, k, null); }) : null;
  var lines = [{ name: 'Aggregate earnings' + (c.f ? ' (filtered)' : ''), color: C.eps, vals: series.map(function (x) { return x.g * 100; }) },
    { name: 'Cap-weighted avg of stock growth', color: '#7C8694', vals: series.map(function (x) { return x.wAvgG == null ? null : x.wAvgG * 100; }) },
    { name: 'Median stock', color: '#C9A15B', vals: series.map(function (x) { return x.medG == null ? null : x.medG * 100; }) }];
  if (whole) lines.push({ name: 'Aggregate (whole index)', color: C.eps, dash: true, vals: whole.map(function (x) { return x.g * 100; }) });
  lineChart(document.getElementById('eps-fwd-trend'), E.dates.map(dShort), lines, function (v) { return v.toFixed(0) + '%'; }, { endFmt: function (v) { return v.toFixed(1) + '%'; } });
  var cur = series[S.fk];
  document.getElementById('eps-fwd-note').innerHTML = 'On ' + dLong(E.dates[S.fk]) + ' aggregate ' + ixLbl() + ' earnings are expected to grow <b>' + pc(cur.g) + '</b> from CY2026 to CY2027 (P/E ' + x1(cur.pe26) + ' on CY26, ' + x1(cur.pe27) + ' on CY27; ' + (cur.cov * 100).toFixed(1) + '% of the index weight has both years).';
}

// Concentration: market cap vs earnings
function conc(c) {
  var cs = E.dates.map(function (_, k) { return E.concentration(S.ix, k, S.base, c.ex); }), lab = E.dates.map(dShort);
  var v = function (f) { return cs.map(function (x) { return x[f] == null ? null : x[f] * 100; }); };
  lineChart(document.getElementById('eps-conc'), lab, [
    { name: 'Top-10 by weight: share of index weight', color: C.tot, vals: v('w10byW') },
    { name: 'Same 10: share of aggregate ' + baseLbl() + ' earnings', color: C.eps, vals: v('e10byW') },
    { name: '10 largest earners: share of earnings', color: C.mult, vals: v('e10byE') }], function (x) { return x.toFixed(0) + '%'; }, { endFmt: function (x) { return x.toFixed(1) + '%'; } });
  var h = '<table class="eps-tbl"><thead><tr><th class="l">Snapshot</th><th>Top 5 weight</th><th>Top 10 weight</th><th>HHI</th><th>Top-10 earnings share</th><th>Names</th></tr></thead><tbody>';
  cs.forEach(function (x, k) { h += '<tr><td class="l">' + dLong(E.dates[k]) + '</td><td>' + (x.top5 * 100).toFixed(1) + '%</td><td>' + (x.top10 * 100).toFixed(1) + '%</td><td>' + x.hhi.toFixed(0) + '</td><td>' + (x.e10byW == null ? '—' : (x.e10byW * 100).toFixed(1) + '%') + '</td><td>' + x.n + '</td></tr>'; });
  document.getElementById('eps-conc-tbl').innerHTML = h + '</tbody></table>';
}

// Aggregate vs weighted average
function avg(c) {
  var p = c.cur, f = E.forward(S.ix, S.k1, c.ex);
  var row = function (n, a, b, d) { return '<tr><td class="l">' + n + '</td><td>' + pc(a) + '</td><td>' + pc(b) + '</td><td class="l" style="white-space:normal;color:var(--mu)">' + d + '</td></tr>'; };
  document.getElementById('eps-avg').innerHTML = '<div class="eps-tw"><table class="eps-tbl"><thead><tr><th class="l">Measure</th><th>' + baseLbl() + ' revision<br>' + dShort(E.dates[p.k0]) + ' → ' + dShort(E.dates[p.k1]) + '</th><th>CY26 → CY27 growth<br>on ' + dShort(E.dates[p.k1]) + '</th><th class="l">Weights each stock by</th></tr></thead><tbody>' +
    row('<b>Aggregate earnings</b> (what the index earns)', p.g, f.g, 'its share of index earnings, <code>weight ÷ P/E</code>') +
    row('Cap-weighted average of stock growth', p.wAvgG, f.wAvgG, 'its share of market cap, <code>weight</code>') +
    row('Median stock', p.medG, f.medG, 'equally; the typical company') + '</tbody></table></div>' +
    '<div class="eps-note">The aggregate is the one that reconciles with the index P/E (<code>price = EPS × P/E</code>) and the one the contribution charts add up to. The cap-weighted average gives each stock the weight it has in the <i>price</i>, so a high-multiple name counts for more than the earnings it brings; the gap between the first two rows is that mix effect. The median shows how far the typical company is from the index.</div>';
}

// Detail table
var COLS = [['label', 'Name', 'l'], ['w0n', 'Weight start'], ['w1n', 'Weight end'], ['eg', 'EPS chg'], ['ret', 'Price'], ['cE', 'EPS contr.'], ['cM', 'Multiple contr.'], ['cP', 'Price contr.'], ['pe0', 'P/E start'], ['pe1', 'P/E end']];
function table(c) {
  var p = withCov(c.cur), list = grouped(p, S.level), q = S.q.trim().toLowerCase();
  if (q) list = list.filter(function (g) { return (g.label + ' ' + g.name + ' ' + g.sector + ' ' + g.ig).toLowerCase().indexOf(q) >= 0; });
  var k = S.sort; list.sort(function (a, b) { var x = a[k], y = b[k]; if (typeof x === 'string') return S.dir * (x < y ? -1 : x > y ? 1 : 0); return S.dir * ((x == null ? -1e9 : x) - (y == null ? -1e9 : y)); });
  var cap = S.all ? list.length : 40, h = '<table class="eps-tbl"><thead><tr>' + COLS.map(function (col) {
    return '<th class="' + (col[2] || '') + (k === col[0] ? ' on' : '') + '" data-act="sort" data-v="' + col[0] + '">' + col[1] + (k === col[0] ? (S.dir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
  list.slice(0, cap).forEach(function (g) {
    h += '<tr><td class="l"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:' + secColor(g.sector) + ';margin-right:7px"></span><b>' + esc(g.label) + '</b>' + (S.level === 'sec' ? ' <span style="color:var(--mu)">' + esc(g.name) + '</span>' : ' <span style="color:var(--mu)">' + esc(g.name) + '</span>') + '</td>' +
      '<td>' + (g.w0n * 100).toFixed(2) + '%</td><td>' + (g.w1n * 100).toFixed(2) + '%</td><td class="' + cls(g.eg) + '">' + pc(g.eg) + '</td><td class="' + cls(g.ret) + '">' + pc(g.ret) + '</td>' +
      '<td class="' + cls(g.cE) + '">' + ppTxt(g.cE * 1, 2) + '</td><td class="' + cls(g.cM) + '">' + ppTxt(g.cM, 2) + '</td><td class="' + cls(g.cP) + '">' + ppTxt(g.cP, 2) + '</td><td>' + x1(g.pe0) + '</td><td>' + x1(g.pe1) + '</td></tr>';
  });
  h += '<tr style="font-weight:600"><td class="l">Total (covered names)</td><td>100%</td><td>100%</td><td class="' + cls(p.g) + '">' + pc(p.g) + '</td><td class="' + cls(p.R) + '">' + pc(p.R) + '</td><td>' + ppTxt(p.g, 2) + '</td><td>' + ppTxt(p.R - p.g, 2) + '</td><td>' + ppTxt(p.R, 2) + '</td><td>' + x1(p.pe0) + '</td><td>' + x1(p.pe1) + '</td></tr></tbody></table>';
  if (list.length > cap) h += '<div class="eps-note"><a href="#" data-act="all" style="color:var(--steel);font-weight:600">Show all ' + list.length + '</a></div>';
  document.getElementById('eps-tbl').innerHTML = h;
}

function methodology() {
  return '<div class="eps-meth">' +
    '<h4>What is measured</h4><p>For every snapshot, the Bloomberg consensus (calendarised to December-31, so a June or January fiscal year is comparable) of EPS for CY2026 and CY2027, the closing price and the true index weight (SPY and QQQ holdings). Nothing else is needed: with <code>q = weight ÷ price</code> (implied index shares) the index is <code>price = Σ q·P</code>, earnings are <code>Σ q·EPS</code>, and the P/E is their ratio.</p>' +
    '<h4>Price return = EPS × multiple</h4><p>Between two snapshots, <code>1 + R = (1 + g)(1 + m)</code> where <code>g</code> is the change in aggregate EPS at constant shares and <code>m</code> the change in the index P/E. A security contributes <code>q·ΔEPS ÷ E₀</code> to <code>g</code> and <code>q·ΔP ÷ I₀</code> to <code>R</code>; the multiple contribution is the difference. Every figure adds exactly over any group, which is why sector, industry group and security views reconcile. The multiple column also carries each name\'s mix against the index multiple, and the cross term <code>g·m</code>.</p>' +
    '<h4>Aggregate, not a weighted average of EPS</h4><p>Index earnings are the sum of EPS over implied shares. A weighted average of per-share EPS mixes share-price scales and does not reconcile with the P/E. The cap-weighted average of stock growth is shown only as a comparison.</p>' +
    '<h4>Removing a group</h4><p>Removing semiconductors (or anything else) recomputes everything on the rest of the index, re-weighted to 100%. The "whole index" lines are always computed without removal.</p>' +
    '<h4>Data treatment</h4><ul><li>Dropped: the cash line (<code>USD Curncy</code>), the Nasdaq futures that appear in the QQQ file, MMED and names with no price.</li>' +
    '<li>GOOG has no per-share consensus; it takes GOOGL\'s (same company). Before this, the second share class fell out of the maths.</li>' +
    '<li>No EPS in the file: BRK/B, ASML, ERIE (CY27), some early snapshots of FDX. They stay in the weights and concentration and out of the EPS maths; <i>Coverage</i> shows the weight that remains.</li>' +
    '<li>Reported in EUR or CNY against a USD price (CCEP, FER, PDD, ASML): left out of the EPS maths until an FX rate is added.</li>' +
    '<li>A name that entered or left the index between two snapshots is outside that period (shares are fixed at the start).</li>' +
    '<li>The consensus is on a GAAP basis; see the warning above for the names where it distorts CY2026.</li></ul>' +
    '<p style="color:var(--mu);margin-top:12px">Source: Bloomberg consensus, SPY and QQQ holdings · ' + esc(E.D.source) + ' · full detail in docs/EPS_ATTRIBUTION.md.</p></div>';
}

// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  root.innerHTML =
    sec('EPS Attribution', 'What moved the index: earnings revisions or the multiple', '<div id="eps-ctl"></div><div id="eps-warn"></div><div style="margin-top:16px" id="eps-kpis"></div><div id="eps-read" class="eps-read"></div>') +
    sec('EPS vs multiple', 'Price return split period by period', '<div class="eps-sub">Index price return = aggregate EPS revision + multiple<small>Each diamond is the price return of the period; the dimmed periods fall outside the selected dates.</small></div><div id="eps-steps"></div>') +
    sec('Path since ' + dShort(E.dates[0]), 'Rebased to 100', '<div class="eps-grid2"><div><div class="eps-sub">Price vs aggregate EPS</div><div id="eps-path-a"></div></div><div><div class="eps-sub">Index P/E</div><div id="eps-path-b"></div></div></div>') +
    sec('Who drove it', 'Contribution to the selected period', '<div class="eps-row">' + '<span id="eps-who-m"></span><span id="eps-who-l"></span></div><div id="eps-who-head"></div><div id="eps-who"></div>') +
    sec('Where forward earnings growth comes from', 'CY2026 → CY2027, aggregate earnings', '<div class="eps-row"><div id="eps-fwd-pills" class="ndx-tabs" style="display:flex;gap:6px;flex-wrap:wrap"></div></div><div id="eps-fwd-note" class="eps-note" style="margin:0 0 12px"></div><div class="eps-sub">Contribution to growth<small>Same grouping as above.</small></div><div id="eps-fwd"></div><div class="eps-sub" style="margin-top:22px">Growth at each snapshot<small>Aggregate earnings vs the cap-weighted average of stock growth (each stock capped at ±100%) vs the median stock.</small></div><div id="eps-fwd-trend" style="max-width:680px"></div>') +
    sec('Concentration: market cap vs earnings', 'Does the weight of the biggest names match their earnings?', '<div id="eps-conc" style="max-width:680px"></div><div class="eps-tw" id="eps-conc-tbl" style="margin-top:14px"></div>') +
    sec('Aggregate or weighted average?', 'Same data, different question', '<div id="eps-avg"></div>') +
    sec('Detail', 'Every security or group, sortable', '<div class="eps-row"><span id="eps-tbl-l"></span><input type="text" id="eps-q" placeholder="Search ticker, name, sector…" style="width:230px"></div><div class="eps-tw" id="eps-tbl"></div>') +
    sec('Method and data notes', '', '<details class="eps-det" open><summary>How the numbers are built</summary>' + methodology() + '</details>');
  root.querySelector('#eps-q').addEventListener('input', function () { S.q = this.value; table(compute()); });
}

function render(all) {
  var c = compute();
  document.getElementById('eps-ctl').innerHTML = controls();
  document.getElementById('eps-warn').innerHTML = gaapWarn();
  document.getElementById('eps-kpis').innerHTML = kpis(c);
  document.getElementById('eps-read').textContent = reading(c);
  steps(c); paths(c);
  document.getElementById('eps-who-m').innerHTML = seg('metric', METRICS, S.metric);
  document.getElementById('eps-who-l').innerHTML = seg('level', LEVELS, S.level);
  document.getElementById('eps-tbl-l').innerHTML = seg('level', LEVELS, S.level);
  who(c); fwd(c); conc(c); avg(c); table(c);
  var add = document.getElementById('eps-add');
  if (add) add.addEventListener('change', function () {
    var t = this.value.trim().toUpperCase(), ok = E.secs.some(function (s) { return s.t === t; });
    if (ok && S.custom.indexOf(t) < 0) { S.custom.push(t); render(); } else this.value = '';
  });
}

function onAct(act, v) {
  if (act === 'ix') S.ix = v;
  else if (act === 'base') S.base = v;
  else if (act === 'k0') { S.k0 = +v; if (S.k1 <= S.k0) S.k1 = S.k0 + 1; }
  else if (act === 'k1') { S.k1 = +v; if (S.k0 >= S.k1) S.k0 = S.k1 - 1; }
  else if (act === 'pre') { var a = v.split(','); S.k0 = +a[0]; S.k1 = +a[1]; }
  else if (act === 'ex') S.ex[v] = !S.ex[v];
  else if (act === 'exclear') { S.ex = {}; S.custom = []; }
  else if (act === 'uncustom') S.custom = S.custom.filter(function (t) { return t !== v; });
  else if (act === 'metric') S.metric = v;
  else if (act === 'level') { S.level = v; S.sort = S.sort === 'label' ? 'label' : 'cE'; }
  else if (act === 'fk') S.fk = +v;
  else if (act === 'sort') { if (S.sort === v) S.dir = -S.dir; else { S.sort = v; S.dir = v === 'label' ? 1 : -1; } }
  else if (act === 'all') S.all = true;
  render();
}

var started = false;
function open() {
  var tp = document.getElementById('tp-rot'); if (!tp) return;
  tp.classList.add('eps-on');
  if (started) return; started = true;
  root = document.getElementById('eps-root'); root.innerHTML = '<div class="ma-pending">Loading…</div>';
  import('./eps-attribution-data.js').then(function (m) {
    E = makeEngine(m.EPS_DATA); S = initialState(); skeleton();
    root.addEventListener('click', function (e) { var t = e.target.closest('[data-act]'); if (!t || t.tagName === 'SELECT') return; e.preventDefault(); onAct(t.getAttribute('data-act'), t.getAttribute('data-v')); });
    root.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'SELECT' && t.getAttribute('data-act')) onAct(t.getAttribute('data-act'), t.value); });
    render();
  }, function () { root.innerHTML = '<div class="ma-pending">The EPS data failed to load. Please refresh the page.</div>'; started = false; });
}

// The tab bar is static HTML in index.html; every tab button closes this tab, this one opens it.
export function initEpsTab() {
  var tp = document.getElementById('tp-rot'); if (!tp || tp.getAttribute('data-eps-wired')) return;
  tp.setAttribute('data-eps-wired', '1');
  tp.querySelectorAll('.ma-tab').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('data-matab') === 'eps') open(); else tp.classList.remove('eps-on');
      tp.querySelectorAll('.ma-tab').forEach(function (x) { x.classList.toggle('active', x === b); });
    });
  });
}
