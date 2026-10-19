// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into the change in forward EPS and the change in the forward multiple, by sector /
// industry group / security. Every section has its own index, EPS-year and period controls (as Index Analysis);
// only the exclusions (clicked in the detail table) are shared, so a removed group is out everywhere.
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine, BASES } from './eps-engine.js';
import { triBars, scatter, lineChart, waterfall, ppTxt } from './eps-charts.js';

// EPS part = steel, multiple part = its light tint; up / down = the portal's green / red (as in Index Analysis)
var C = { eps: '#3E5A82', mult: '#B7C4D8', pos: '#177A4E', neg: '#9B2A20', ink: '#1E2733' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var IXN = { spx: 'S&P 500', ndx: 'Nasdaq-100' };
var LV = [['sector', 'Sector'], ['ig', 'Industry group'], ['sec', 'Security']];
var E = null, root = null, S = null, DOM = null;

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function dLong(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function dShort(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + " '" + String(d.getUTCFullYear()).slice(2); }
function pc(v, d) { return v == null || isNaN(v) ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(d == null ? 1 : d) + '%'; }
function pp(v, d) { return v == null || isNaN(v) ? '—' : ppTxt(v, d == null ? 2 : d); }
function x1(v) { return v == null || isNaN(v) ? '—' : v.toFixed(1) + 'x'; }
function col(v) { return v == null || isNaN(v) ? 'var(--mu)' : v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function cP(v, d) { return v == null || isNaN(v) ? '<span style="color:var(--mu)">—</span>' : '<span style="color:' + col(v) + ';font-weight:600">' + pc(v, d) + '</span>'; }
function cc(v) { return v == null ? '<span style="color:var(--mu)">—</span>' : '<span style="color:' + col(v) + ';font-weight:600">' + pp(v, 2) + '</span>'; }
function short(n) { var o; do { o = n; n = n.replace(/[,\s]+(Inc|Corp|Corporation|Co|Ltd|PLC|plc|Holdings|Group|Company|NV|SA|AG|Class [A-C])\.?$/i, ''); } while (n !== o); return n; }
function yr(base) { return base === 'cy27' ? 'CY2027' : 'CY2026'; }
function seg(attrs, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" ' + attrs + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function sel(attrs, opts, cur) {
  return '<select ' + attrs + '>' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(cur) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
}
function sec(id, title, note, body) {
  return '<div class="sec" id="' + id + '"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn" id="' + id + '-n">' + note + '</span></div>' + body + '</div>';
}

// ─── state: one config per section ────────────────────────────────
function cfg(extra) {
  var last = E.dates.length - 1, ytd = E.dates.indexOf('2026-01-02');
  return Object.assign({ ix: 'spx', base: 'cy26', k0: ytd >= 0 ? ytd : 0, k1: last }, extra || {});
}
function initialState() {
  var last = E.dates.length - 1;
  return { excl: {}, open: {}, sort: 'cP', dir: -1,
    hero: cfg({ ix: 'both' }), detail: cfg(), who: cfg({ lvl: 'sector', n: 10 }), avg: cfg(), scat: cfg(),
    rev: cfg({ lvl: 'sec', n: 10 }), fwd: cfg({ k: last, lvl: 'sec', n: 10 }), path: cfg(), conc: cfg(), data: cfg() };
}
// exclusions: 'S|Sector' · 'G|Industry group' · 'T|TICKER' — shared by every section and both indices
function exFrom(excl) {
  var set = new Set();
  E.secs.forEach(function (s, i) { if (excl['S|' + s.s] || excl['G|' + s.g] || excl['T|' + s.t]) set.add(i); });
  return set;
}
function exNow() { var s = exFrom(S.excl); return s.size ? s : null; }
function per(c, ix) { return E.period(ix || c.ix, c.k0, c.k1, c.base, exNow()); }
function nExcl() { return Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).length; }
function ctxLine(c, ixs) {
  var i = ixs || (c.ix === 'both' ? 'S&P 500 + Nasdaq-100' : IXN[c.ix]);
  return i + ' · ' + dShort(E.dates[c.k0]) + ' → ' + dShort(E.dates[c.k1]) + ' · ' + yr(c.base) + ' EPS' + (nExcl() ? ' · ' + nExcl() + ' excluded' : '');
}
function keyOf(lvl) { return function (r) { var s = E.secs[r.id]; return lvl === 'sector' ? s.s : lvl === 'ig' ? s.g : String(r.id); }; }
function nameOf(key, lvl) { if (lvl !== 'sec') return key; var s = E.secs[+key]; return s.t + ' · ' + short(s.n); }
function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

// ─── per-section controls ─────────────────────────────────────────
// parts: ix (S&P/Nasdaq), both (adds "Both"), base (EPS year), period (from/to), date (one snapshot), lvl, n
function ctl(id, parts, extra) {
  var c = S[id], a = function (f) { return 'data-act="s" data-id="' + id + '" data-f="' + f + '"'; }, h = '';
  var dopt = function (lo, hi) { return E.dates.map(function (d, i) { return (i < lo || i > hi) ? null : [i, dLong(d)]; }).filter(Boolean); };
  var last = E.dates.length - 1;
  function blk(l, x) { h += '<div><div class="eps-lbl">' + l + '</div>' + x + '</div>'; }
  if (parts.indexOf('ix') >= 0) blk('Index', seg(a('ix'), [['spx', 'S&P 500'], ['ndx', 'Nasdaq-100']].concat(parts.indexOf('both') >= 0 ? [['both', 'Both']] : []), c.ix));
  if (parts.indexOf('base') >= 0) blk('EPS year', seg(a('base'), BASES, c.base));
  if (parts.indexOf('period') >= 0) { blk('From', sel(a('k0'), dopt(0, c.k1 - 1), c.k0)); blk('To', sel(a('k1'), dopt(c.k0 + 1, last), c.k1)); }
  if (parts.indexOf('date') >= 0) blk('As of', sel(a('k'), dopt(0, last), c.k));
  if (parts.indexOf('lvl') >= 0) blk('Level', seg(a('lvl'), LV, c.lvl));
  if (parts.indexOf('n') >= 0) blk(extra || 'Show', sel(a('n'), [[5, 'Top 5'], [10, 'Top 10'], [15, 'Top 15'], [20, 'Top 20']], c.n));
  return '<div class="eps-ctl">' + h + '</div>';
}

// ─── fixed axes: a bar keeps its length whatever index, year, period or level is shown ───
function stepsOf(items, total) { var cum = 0, lo = 0, hi = 0; items.forEach(function (v) { cum += v; lo = Math.min(lo, cum); hi = Math.max(hi, cum); }); return [Math.min(lo, total), Math.max(hi, total)]; }
function domains() {
  if (DOM) return DOM;
  var d = { idx: [0, 0], stack: { sector: [0, 0], ig: [0, 0], sec: [0, 0] }, rev: { sector: [0, 0], ig: [0, 0], sec: [0, 0] }, fwd: { sector: [0, 0], ig: [0, 0], sec: [0, 0] } };
  function ext(a, lo, hi) { a[0] = Math.min(a[0], lo); a[1] = Math.max(a[1], hi); }
  function wf(arr, rows, lvl, total) {
    var gs = E.group(rows, keyOf(lvl)).sort(function (x, y) { return y.cE - x.cE; }), st = stepsOf(gs.map(function (g) { return g.cE; }), total);
    ext(arr[lvl], st[0], st[1]);
  }
  var last = E.dates.length - 1;
  ['spx', 'ndx'].forEach(function (ix) {
    ['cy26', 'cy27'].forEach(function (b) {
      for (var k0 = 0; k0 < last; k0++) for (var k1 = k0 + 1; k1 <= last; k1++) {
        var p = E.period(ix, k0, k1, b, null);
        ext(d.idx, Math.min(p.g, p.R - p.g, p.R), Math.max(p.g, p.R - p.g, p.R));
        LV.forEach(function (L) {
          E.group(p.rows, keyOf(L[0])).forEach(function (g) { ext(d.stack[L[0]], Math.min(g.cE, g.cM, g.cP), Math.max(g.cE, g.cM, g.cP)); });
          wf(d.rev, p.rows, L[0], p.g);
        });
      }
    });
    for (var k = 0; k <= last; k++) { var f = E.forward(ix, k, null); LV.forEach(function (L) { wf(d.fwd, f.rows, L[0], f.g); }); }
  });
  return (DOM = d);
}

// ─── 1 · hero ─────────────────────────────────────────────────────
function hero() {
  var c = S.hero, ixs = c.ix === 'both' ? ['spx', 'ndx'] : [c.ix], rows = [], tiles = '';
  ixs.forEach(function (ix) {
    var p = per(c, ix), nm = IXN[ix];
    tiles += '<div class="eps-eqrow">' + (ixs.length > 1 ? '<div class="eps-eqn">' + nm + '</div>' : '') + '<div class="eps-eq">' +
      '<div class="eps-eqt"><div class="k">Forward EPS (' + yr(c.base) + ')</div><div class="v" style="color:' + col(p.g) + '">' + pc(p.g) + '</div><div class="s">index earnings, ' + dShort(E.dates[c.k0]) + ' → ' + dShort(E.dates[c.k1]) + '</div></div><div class="op">×</div>' +
      '<div class="eps-eqt"><div class="k">Forward P/E</div><div class="v" style="color:' + col(p.m) + '">' + pc(p.m) + '</div><div class="s">' + x1(p.pe0) + ' → ' + x1(p.pe1) + '</div></div><div class="op">=</div>' +
      '<div class="eps-eqt tot"><div class="k">Price return</div><div class="v" style="color:' + col(p.R) + '">' + pc(p.R) + '</div><div class="s">(1 ' + pc(p.g) + ') × (1 ' + pc(p.m) + ') − 1</div></div></div></div>';
    rows.push({ label: nm, a: p.g, b: p.R - p.g, net: p.R, bold: true,
      tip: '<b style="font-size:13px">' + nm + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Price return ' + pc(p.R) + '<br>Forward EPS change ' + pc(p.g) + '<br>Forward P/E change ' + pc(p.m) + '<br>Interaction (EPS × P/E) ' + pc(p.mCross) + ', counted in the multiple bar</span>' });
  });
  return { tiles: tiles, rows: rows };
}

// ─── 2 · detail & simulation table ────────────────────────────────
function dot(on, sz) {
  return '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;vertical-align:middle;' + (on ? 'background:var(--navy);border:2px solid var(--navy)' : 'background:transparent;border:2px solid #9AAAB8') + '"></span>';
}
function selDot(state) {
  var r = 6.5, cx = 8, cy = 8, pfx = '<svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align:middle;overflow:visible">';
  if (state === 'off') return pfx + '<circle cx="8" cy="8" r="' + r + '" fill="none" stroke="#9AAAB8" stroke-width="2"/></svg>';
  if (state === 'part') return pfx + '<circle cx="8" cy="8" r="' + r + '" fill="none" stroke="var(--navy)" stroke-width="1.5"/><path d="M ' + cx + ' ' + (cy - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (cy + r) + ' Z" fill="var(--navy)"/></svg>';
  return pfx + '<circle cx="8" cy="8" r="' + r + '" fill="var(--navy)" stroke="var(--navy)" stroke-width="1.5"/></svg>';
}
function wtxt(a, b) { return a == null ? '<span style="color:var(--mu)">—</span>' : (a * 100).toFixed(2) + '% → ' + (b * 100).toFixed(2) + '%'; }
function weightMaps(c) {
  var w0 = {}, w1 = {};
  E.members(c.ix, c.k0, exNow()).forEach(function (m) { var s = E.secs[m.id]; w0[s.s] = (w0[s.s] || 0) + m.w; w0[s.g] = (w0[s.g] || 0) + m.w; w0[m.id] = m.w; });
  E.members(c.ix, c.k1, exNow()).forEach(function (m) { var s = E.secs[m.id]; w1[s.s] = (w1[s.s] || 0) + m.w; w1[s.g] = (w1[s.g] || 0) + m.w; w1[m.id] = m.w; });
  return { w0: w0, w1: w1 };
}
function rowCells(o, W, key, off) {
  if (!o || off) return '<td class="num" style="color:var(--mu)">—</td>'.repeat(7);
  return '<td class="num" style="color:var(--mu);font-size:11px">' + wtxt(W.w0[key], W.w1[key] || 0) + '</td><td class="num">' + cP(o.g) + '</td><td class="num">' + cP(o.m) + '</td><td class="num">' + cP(o.ret) + '</td>' +
    '<td class="num">' + cc(o.cE) + '</td><td class="num">' + cc(o.cM) + '</td><td class="num" style="font-weight:700">' + cc(o.cP) + '</td>';
}
function detail() {
  var c = S.detail, cur = per(c), all = nExcl() ? E.period(c.ix, c.k0, c.k1, c.base, null) : cur, byS = {}, byG = {}, byT = {}, igsOf = {};
  E.group(cur.rows, keyOf('sector')).forEach(function (o) { byS[o.key] = o; });
  E.group(cur.rows, keyOf('ig')).forEach(function (o) { byG[o.key] = o; });
  cur.rows.forEach(function (r) { byT[r.id] = r; });
  var aS = E.group(all.rows, keyOf('sector')), aG = {}; E.group(all.rows, keyOf('ig')).forEach(function (o) { aG[o.key] = o; });
  all.rows.forEach(function (r) { var s = E.secs[r.id]; (igsOf[s.s] = igsOf[s.s] || {})[s.g] = 1; });
  var W = weightMaps(c), sk = S.sort, dir = S.dir, body = '';
  function val(o) { var v = sk === 'w' ? o.w0 : o[sk]; return v == null ? -1e9 : v; }
  function by(a, b) { return dir * (val(b) - val(a)); }
  function anyEx(pred) { return E.secs.some(function (s) { return pred(s) && (S.excl['S|' + s.s] || S.excl['G|' + s.g] || S.excl['T|' + s.t]); }); }
  aS.slice().sort(by).forEach(function (so) {
    var sname = so.key, offS = !!S.excl['S|' + sname], open = !!S.open['S|' + sname];
    var state = offS ? 'off' : anyEx(function (s) { return s.s === sname; }) ? 'part' : 'on';
    body += '<tr class="eps-r1' + (offS ? ' off' : '') + '" data-act="tog" data-v="S|' + esc(sname) + '"><td class="c">' + selDot(state) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="S|' + esc(sname) + '">' + (open ? '▲' : '▼') + '</span></td>' +
      '<td class="nm">' + esc(sname) + '</td>' + rowCells(byS[sname], W, sname, offS) + '</tr>';
    if (!open) return;
    Object.keys(igsOf[sname]).map(function (g) { return aG[g]; }).sort(by).forEach(function (go) {
      var gname = go.key, offG = offS || !!S.excl['G|' + gname], gopen = !!S.open['G|' + gname];
      var gstate = offG ? 'off' : anyEx(function (s) { return s.g === gname; }) ? 'part' : 'on';
      body += '<tr class="eps-r2' + (offG ? ' off' : '') + '" data-act="tog" data-v="G|' + esc(gname) + '"><td class="c" style="padding-left:12px">' + selDot(gstate) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="G|' + esc(gname) + '">' + (gopen ? '▲' : '▼') + '</span></td>' +
        '<td class="nm" style="padding-left:22px">' + esc(gname) + '</td>' + rowCells(byG[gname], W, gname, offG) + '</tr>';
      if (!gopen) return;
      go.rows.slice().sort(by).forEach(function (ro) {
        var s = E.secs[ro.id], offT = offG || !!S.excl['T|' + s.t];
        body += '<tr class="eps-r3' + (offT ? ' off' : '') + '" data-act="tog" data-v="T|' + esc(s.t) + '"><td class="c" style="padding-left:24px">' + dot(!offT, 12) + '</td><td></td>' +
          '<td class="nm" style="padding-left:38px"><b>' + esc(s.t) + '</b> <span style="color:var(--mu)">' + esc(short(s.n)) + '</span></td>' + rowCells(byT[ro.id], W, ro.id, offT) + '</tr>';
      });
    });
  });
  function tot(cls, label, p) { return '<tr class="' + cls + '"><td></td><td></td><td class="nm">' + label + '</td><td class="num">100.00% → 100.00%</td><td class="num">' + cP(p.g) + '</td><td class="num">' + cP(p.m) + '</td><td class="num">' + cP(p.R) + '</td><td class="num">' + cc(p.g) + '</td><td class="num">' + cc(p.R - p.g) + '</td><td class="num">' + cc(p.R) + '</td></tr>'; }
  body += tot('eps-tot', (nExcl() ? 'Selection' : 'Total') + ' · ' + IXN[c.ix], cur);
  if (nExcl()) body += tot('eps-tot2', 'Whole ' + IXN[c.ix], all);
  function th(k, label) { return '<th class="num' + (S.sort === k ? ' on' : '') + '" data-act="sort" data-v="' + k + '">' + label + (S.sort === k ? (S.dir < 0 ? ' ▼' : ' ▲') : '') + '</th>'; }
  var chips = Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).map(function (k) { return '<button class="ndx-chip active" data-act="unex" data-v="' + esc(k) + '">' + esc(k.slice(2)) + ' <span class="eps-x">×</span></button>'; }).join('');
  return ctl('detail', ['ix', 'base', 'period']) + '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click any row — sector, industry group or security — to take it out of the index. Every section on this tab recalculates without it and the rest rescale to 100%. Arrows open the next level.' +
    (chips ? '<span class="eps-chips"><br>Excluded: ' + chips + '</span>' : '') + '</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand all sectors</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse</button><button class="sb-tbtn" data-act="reset">Reset</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change</th><th colspan="3" class="grp">Contribution to ' + IXN[c.ix] + ' (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry group / Security</th>' +
    th('w', 'Weight, start → end') + th('g', yr(c.base) + ' EPS') + th('m', 'Forward P/E') + th('ret', 'Price') + th('cE', 'From EPS') + th('cM', 'From multiple') + th('cP', 'Total') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note">Its own change treats the group as one block: its ' + yr(c.base) + ' EPS (summed over its stocks), its forward P/E, its price. On every row (1 + EPS) × (1 + P/E) = 1 + Price. Contribution is the group\'s share of the index move; From EPS + From multiple = Total, and the rows add up to the index total. The multiple column includes the EPS × P/E interaction.</div></div>';
}

// ─── 3 · who moved the index ──────────────────────────────────────
function who() {
  var c = S.who, p = per(c), lvl = c.lvl, gs = E.group(p.rows, keyOf(lvl)).sort(function (a, b) { return b.cP - a.cP; }), note = '';
  if (lvl === 'sec' && gs.length > 2 * c.n) { gs = gs.slice(0, c.n).concat(gs.slice(-c.n)); note = 'Showing the ' + c.n + ' biggest positive and the ' + c.n + ' biggest negative contributors out of ' + p.n + ' stocks.'; }
  var rows = gs.map(function (g) {
    var nm = nameOf(g.key, lvl);
    return { label: trunc(nm, 42), a: g.cE, b: g.cM, net: g.cP,
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Weight at start ' + (g.w0 * 100).toFixed(2) + '%<br>Its own ' + yr(c.base) + ' EPS ' + pc(g.g) + ' · forward P/E ' + pc(g.m) + ' · price ' + pc(g.ret) +
        '<br>Contribution: EPS ' + pp(g.cE, 2) + ' pp · multiple ' + pp(g.cM, 2) + ' pp · <b>total ' + pp(g.cP, 2) + ' pp</b></span>' };
  });
  return { rows: rows, note: note, dom: domains().stack[lvl] };
}

// ─── 4 · aggregate vs weighted average ────────────────────────────
function avgTable() {
  var c = S.avg, whole = E.period(c.ix, c.k0, c.k1, c.base, null), cols = [['Whole index', whole]];
  if (nExcl()) cols.push(['Without the excluded', per(c)]);
  var defs = [
    ['Aggregate EPS change', 'The index\'s own earnings: Σ weight × (EPS ÷ price) for every stock, compared between the two dates. This is the EPS inside the index P/E, so it is the one that multiplies with the multiple.', function (p) { return p.g; }],
    ['Weighted-average EPS change', 'Each stock\'s own EPS change × its index weight at the start (float-adjusted weight from the file). No cap and no trimming: a stock that doubles counts as +100%, one that swings to a loss counts as it is.', function (p) { return p.wAvgG; }],
    ['Gap, aggregate − weighted', 'Aggregate counts a stock by weight × earnings yield, the weighted average by weight alone. Positive: the EPS change sits in stocks with a lot of earnings for their weight.', function (p) { return p.g - p.wAvgG; }],
    ['Equal-weight average', 'Every stock counts the same.', function (p) { return p.eqG; }],
    ['Median stock', 'The typical stock.', function (p) { return p.medG; }],
    ['Forward P/E change', 'Aggregate multiple, price ÷ ' + yr(c.base) + ' EPS, start to end.', function (p) { return p.m; }],
    ['Price return', '(1 + aggregate EPS change) × (1 + P/E change) − 1.', function (p) { return p.R; }]
  ];
  var tb = defs.map(function (d) {
    return '<tr><td><div class="eps-dn">' + d[0] + '</div><div class="eps-dd">' + d[1] + '</div></td>' + cols.map(function (k) { return '<td class="num">' + (d[0].indexOf('Gap') === 0 ? '<span style="color:var(--mu)">' + pp(d[2](k[1]), 1) + ' pp</span>' : cP(d[2](k[1]))) + '</td>'; }).join('') + '</tr>'; }).join('') +
    '<tr><td><div class="eps-dn">Forward P/E, start → end</div></td>' + cols.map(function (k) { return '<td class="num">' + x1(k[1].pe0) + ' → ' + x1(k[1].pe1) + '</td>'; }).join('') + '</tr>' +
    '<tr><td><div class="eps-dn">Stocks in the calculation</div></td>' + cols.map(function (k) { return '<td class="num" style="color:var(--mu)">' + k[1].n + '</td>'; }).join('') + '</tr>';
  return '<div class="card"><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>' + IXN[c.ix] + ' · ' + dShort(E.dates[c.k0]) + ' → ' + dShort(E.dates[c.k1]) + ' · ' + yr(c.base) + '</th>' + cols.map(function (k) { return '<th class="num">' + k[0] + '</th>'; }).join('') + '</tr></thead><tbody>' + tb + '</tbody></table></div>' +
    (nExcl() ? '' : '<div class="eps-note">To see the index without a sector, industry group or stock, click it in the detail table above; a second column appears here.</div>') + '</div>';
}

// ─── 5 · stock by stock ───────────────────────────────────────────
function scat() {
  var c = S.scat, p = per(c), rs = p.rows.filter(function (r) { return r.g != null && r.m != null; }), beyond = 0;
  var top = rs.slice().sort(function (a, b) { return Math.abs(b.cP) - Math.abs(a.cP); }).slice(0, 9).map(function (r) { return r.id; });
  var pts = rs.map(function (r) {
    var s = E.secs[r.id]; if (r.g > 4 || r.m > 4) beyond++;
    return { x: r.g, y: r.m, r: r.w0, color: r.ret >= 0 ? C.pos : C.neg, label: top.indexOf(r.id) >= 0 ? s.t : '',
      tip: '<b style="font-size:13px">' + esc(s.t) + '</b> <span style="color:#8A93A0">' + esc(short(s.n)) + '</span><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">' + esc(s.g) +
        '<br>Weight ' + (r.w0 * 100).toFixed(2) + '% → ' + (r.w1 * 100).toFixed(2) + '%<br>' + yr(c.base) + ' EPS ' + r.e0.toFixed(2) + ' → ' + r.e1.toFixed(2) + ' (' + pc(r.g) + ')<br>P/E ' + x1(r.pe0) + ' → ' + x1(r.pe1) + ' (' + pc(r.m) + ')<br>Price ' + pc(r.ret) +
        '<br>Contribution: EPS ' + pp(r.cE, 2) + ' · multiple ' + pp(r.cM, 2) + ' · <b>total ' + pp(r.cP, 2) + ' pp</b></span>' };
  });
  var leg = '<span><i style="background:' + C.pos + '"></i>Price up</span><span><i style="background:' + C.neg + '"></i>Price down</span><span style="margin-left:auto">Dot size = weight in the index' + (beyond ? ' · hollow = beyond the axis (' + beyond + ')' : '') + ' · labels = the 9 biggest contributors</span>';
  return { pts: pts, leg: leg, c: c };
}

// ─── 6 · where the EPS change comes from (two charts) ─────────────
function waterfallData(rows, total, lvl, n, titleVerb) {
  var gs = E.group(rows, keyOf(lvl)).sort(function (a, b) { return b.cE - a.cE; });
  var N = lvl === 'sec' ? n : gs.length, shown = gs.slice(0, N), used = shown.reduce(function (s, g) { return s + g.cE; }, 0), rest = gs.length - shown.length;
  var items = shown.map(function (g) {
    var nm = nameOf(g.key, lvl);
    return { label: trunc(nm, 46), v: g.cE,
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Adds ' + pp(g.cE, 2) + ' pp of the ' + pc(total) + ' (' + (total ? (g.cE / total * 100).toFixed(0) : '—') + '% of it)<br>Its own EPS ' + pc(g.g) + '<br>Share of index earnings at the start ' + (g.rows.reduce(function (s, r) { return s + (r.esh || 0); }, 0) * 100).toFixed(1) + '%</span>' };
  });
  return { items: items, rest: rest > 0 ? total - used : null, restLabel: rest > 0 ? 'All other ' + rest + (lvl === 'sector' ? ' sectors' : lvl === 'ig' ? ' groups' : ' stocks') + ' (net)' : null, total: total };
}
function revChart() { var c = S.rev, p = per(c); return Object.assign(waterfallData(p.rows, p.g, c.lvl, c.n), { dom: domains().rev[c.lvl], p: p }); }
function fwdChart() { var c = S.fwd, f = E.forward(c.ix, c.k, exNow()); return Object.assign(waterfallData(f.rows, f.g, c.lvl, c.n), { dom: domains().fwd[c.lvl], f: f }); }
function wfOpts(g, axisTitle, label) {
  return { rest: g.rest, restLabel: g.restLabel, pos: C.pos, neg: C.neg, domain: g.dom, fmt: function (v) { return ppTxt(v, 1) + ' pp'; }, axisFmt: function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t); },
    axisTitle: axisTitle, totalLabel: label };
}

// ─── 7 · path · 8 · concentration ─────────────────────────────────
function pathBlock() {
  var c = S.path, pts = E.path(c.ix, c.k0, c.k1, c.base, exNow()), labels = pts.map(function (q) { return dShort(E.dates[q.k]); });
  return { labels: labels, c: c,
    a: [{ name: 'Price', color: C.ink, vals: pts.map(function (q) { return 100 * (1 + q.R); }) }, { name: yr(c.base) + ' aggregate EPS', color: C.eps, vals: pts.map(function (q) { return 100 * (1 + q.g); }) }],
    b: [{ name: 'Forward P/E on ' + yr(c.base), color: C.eps, vals: pts.map(function (q) { return q.pe; }) }] };
}
function concBlock() {
  var c = S.conc;
  var tb = E.dates.map(function (d, k) {
    var q = E.concentration(c.ix, k, c.base, exNow());
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + (q.w10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.w10byE * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byE * 100).toFixed(1) + '%</td></tr>'; }).join('');
  return '<div class="card"><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>' + IXN[c.ix] + ' · ' + yr(c.base) + ' EPS</th><th class="num">10 biggest by weight:<br>their weight</th><th class="num">…their share of the index\'s earnings</th><th class="num">10 biggest earners:<br>their weight</th><th class="num">…their share of the index\'s earnings</th></tr></thead><tbody>' + tb + '</tbody></table></div>' +
    '<div class="eps-note">Weights here are among the stocks that have an EPS estimate. If the 10 biggest by weight hold more weight than earnings, the index is paying for growth in them; if the 10 biggest earners hold more weight than the first group, earnings are more concentrated than the index.</div></div>';
}

// ─── 9 · data & method ────────────────────────────────────────────
function dataBlock() {
  var c = S.data, p = per(c), ix = c.ix;
  var cov = E.dates.map(function (d, k) {
    var m = E.members(ix, k, exNow()), byId = {}; E.D.snaps[k].forEach(function (r) { byId[r[0]] = r; });
    var px = 0, e = 0, we = 0;
    m.forEach(function (x) { var r = byId[x.id]; if (r[3] > 0) px++; var v = c.base === 'cy27' ? r[5] : r[4]; if (v != null) { e++; we += x.w; } });
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + m.length + '</td><td class="num">' + px + '</td><td class="num">' + e + '</td><td class="num">' + (we * 100).toFixed(1) + '%</td></tr>'; }).join('');
  var why = { 'no price at the end date': 'Left the index (acquired or removed): no later price in the file', 'no EPS estimate at the start': 'No ' + yr(c.base) + ' estimate in the file at the start', 'no EPS estimate at the end': 'No ' + yr(c.base) + ' estimate in the file at the end' };
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td class="num">' + (s.ret == null ? '—' : cP(s.ret)) + '</td><td>' + (why[s.why] || s.why) + '</td></tr>'; }).join('');
  var skW = p.skipped.reduce(function (s, x) { return s + x.w0; }, 0), noEps = p.skipped.filter(function (s) { return s.why.indexOf('EPS') >= 0; });
  // corporate-action check: a weight that moved far more than the price (spin-off, merger, float or share change)
  var odd = p.rows.filter(function (r) { return r.w1 > 0 && Math.abs((1 + r.ret) / ((r.w1 / r.w0) * (1 + p.R)) - 1) > 0.25; }).sort(function (a, b) { return b.w0 - a.w0; }).slice(0, 12).map(function (r) {
    var s = E.secs[r.id]; return '<tr><td><b>' + esc(s.t) + '</b></td><td class="num">' + cP(r.ret) + '</td><td class="num">' + cP((r.w1 / r.w0) * (1 + p.R) - 1) + '</td><td class="num">' + (r.w0 * 100).toFixed(2) + '% → ' + (r.w1 * 100).toFixed(2) + '%</td></tr>'; }).join('');
  var fx = E.secs.map(function (s, i) { return s.c ? s.t + ' (' + s.c + ')' : null; }).filter(Boolean).join(', ');
  var defs = [
    ['Basket', 'The stocks the index held on the start date, at their start weights, followed to the end date. Stocks that joined later are not in it; stocks that left stay in it while they have a price.'],
    ['Weight', 'The index weight in the source file (float-adjusted), at each date.'],
    ['Forward EPS', 'Bloomberg consensus EPS for one fiscal year, CY2026 or CY2027, calendarised to December. Nothing is blended into a rolling or next-twelve-months figure: the file only has annual estimates, so quarters are never inferred.'],
    ['Index earnings', 'Σ weight × (EPS ÷ price), each stock\'s earnings yield weighted by its index weight, both taken at the same date, so a split cannot enter. Its change between the two dates is the aggregate EPS change.'],
    ['Forward P/E', 'Price level of the basket ÷ index earnings. Price return = (1 + EPS change) × (1 + P/E change) − 1, exactly.'],
    ['Contribution', 'EPS: the stock\'s share of the change in index earnings. Price: its share of the index price move. Multiple = Price − EPS. Each adds up across any group.']
  ];
  return '<div class="eps-h2" style="margin-top:0">How the numbers are built</div><table class="rt eps-t3 eps-defs"><tbody>' + defs.map(function (d) { return '<tr><td class="nm">' + d[0] + '</td><td>' + d[1] + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="eps-h2">What is in the calculation — ' + IXN[ix] + ', ' + dShort(E.dates[c.k0]) + ' → ' + dShort(E.dates[c.k1]) + ', ' + yr(c.base) + '</div>' +
    '<div class="eps-note" style="margin-top:0;font-size:12px">The index held <b>' + p.nStart + '</b> stocks on ' + dLong(E.dates[c.k0]) + '. <b>' + p.n + '</b> are in the calculation (' + ((1 - skW) * 100).toFixed(1) + '% of weight). <b>' + p.skipped.length + '</b> are not, listed below, because the file has no price at the end or no ' + yr(c.base) + ' estimate. Their price return is not in the bridge: the whole basket returned ' + pc(p.Rfull) + ', the bridge ' + pc(p.R) + '.</div>' +
    '<div class="eps-two" style="margin-top:12px"><div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th class="num">Price</th><th>Why it is not in</th></tr></thead><tbody>' + (out || '<tr><td colspan="5">None.</td></tr>') + '</tbody></table></div>' +
    '<div><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>Date</th><th class="num">Members</th><th class="num">With price</th><th class="num">With ' + yr(c.base) + ' EPS</th><th class="num">Weight with EPS</th></tr></thead><tbody>' + cov + '</tbody></table></div>' +
    '<div class="eps-note">' + p.entered.n + ' stocks joined the index after the start date (' + (p.entered.w * 100).toFixed(1) + '% of its end weight); they are not in the basket.</div></div></div>' +
    '<div class="eps-h2">Corporate-action check</div><div class="eps-note" style="margin-top:0;font-size:12px">Price and EPS are taken as the file gives them at each date. A split would show as price and EPS falling by the same factor; none does in any period. Spin-offs, mergers and float changes show as a weight that moved far more than the price, so the stocks below (if any) are worth a look before relying on their own line.</div>' +
    (odd ? '<div class="eps-tw"><table class="rt eps-t3" style="max-width:560px"><thead><tr><th>Ticker</th><th class="num">Price move</th><th class="num">Move implied by its weight</th><th class="num">Weight</th></tr></thead><tbody>' + odd + '</tbody></table></div>' : '<div class="eps-note">None in this period.</div>') +
    '<div class="eps-h2">Caveats</div><ul class="eps-ul">' +
    '<li><b>GAAP EPS.</b> The consensus is Bloomberg GAAP EPS (IS_COMP_EPS_GAAP), so investment marks at GOOGL and AMZN move the aggregate; exclude them in the detail table to see the effect. An adjusted-EPS pull would replace it.</li>' +
    '<li><b>Currency.</b> ' + esc(fx) + ' report in another currency; the file\'s EPS is used as given with no FX conversion. Their change is unaffected; the size of their earnings in the aggregate is only as good as the file\'s currency.</li>' +
    '<li><b>No estimate in the file.</b> ' + (function () { var t = {}; E.D.snaps.forEach(function (s) { s.forEach(function (r) { if ((r[1] > 0 || r[2] > 0) && r[4] == null && r[5] == null) t[E.secs[r[0]].t] = 1; }); }); return Object.keys(t).join(', ') || 'none'; })() + ' have no EPS estimate in the file at one or more dates, so they cannot be in the bridge for those dates until the pull has them.</li>' +
    '<li><b>Source.</b> ' + esc(E.D.source) + ', sheet UNIVERSE: ' + E.dates.length + ' snapshots, ' + E.secs.length + ' securities.</li></ul>';
}

// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  root.innerHTML =
    sec('eps-s1', 'Return = EPS change × multiple change', '', '<div id="eps-c1"></div><div class="card"><div id="eps-h1"></div><div class="eps-h2">In points of return</div><div id="eps-h1c"></div>' +
      '<div class="eps-note">Forward EPS = the change in the index\'s aggregate EPS estimate for the chosen year between the two dates. Forward P/E = price ÷ that EPS. A fall in the multiple with rising EPS means estimates went up faster than prices.</div></div>') +
    sec('eps-s2', 'Attribution detail & simulation', '', '<div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '', '<div id="eps-c3"></div><div class="card"><div id="eps-who"></div><div class="eps-note" id="eps-who-n"></div></div>') +
    sec('eps-s4', 'Aggregate vs weighted-average EPS change', '', '<div id="eps-c4"></div><div id="eps-avg"></div>') +
    sec('eps-s5', 'Stock by stock: EPS change vs multiple change', '', '<div id="eps-c5"></div><div class="card"><div id="eps-scat"></div></div>') +
    sec('eps-s6', 'Where the index\'s EPS change comes from', '', '<div id="eps-c6"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t6"></div><div id="eps-w6"></div></div>') +
    sec('eps-s7', 'Expected EPS growth, CY2026 → CY2027', '', '<div id="eps-c7"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t7"></div><div id="eps-w7"></div></div>') +
    sec('eps-s8', 'Path between the dates', '', '<div id="eps-c8"></div><div class="card"><div class="eps-two"><div><div class="eps-h2">Price and aggregate EPS (start = 100)</div><div id="eps-pa"></div></div><div><div class="eps-h2">Forward P/E</div><div id="eps-pb"></div></div></div></div>') +
    sec('eps-s9', 'Concentration of earnings', '', '<div id="eps-c9"></div><div id="eps-conc"></div>') +
    sec('eps-s10', 'Data & method', '', '<div id="eps-c10"></div><div class="card" id="eps-data"></div>');
}
function render() {
  var set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }, note = function (id, c, ixs) { set(id, ctxLine(c, ixs)); };
  var d = domains(), h = hero();
  set('eps-c1', ctl('hero', ['ix', 'both', 'base', 'period'])); note('eps-s1-n', S.hero);
  set('eps-h1', h.tiles);
  triBars(document.getElementById('eps-h1c'), h.rows, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, domain: d.idx, labA: 'from EPS change', labB: 'from multiple change (includes the interaction)' });
  set('eps-detail', detail()); note('eps-s2-n', S.detail);
  set('eps-c3', ctl('who', ['ix', 'base', 'period', 'lvl'].concat(S.who.lvl === 'sec' ? ['n'] : []), 'Show')); note('eps-s3-n', S.who);
  var w = who();
  triBars(document.getElementById('eps-who'), w.rows, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, domain: w.dom, axisTitle: 'pp of ' + IXN[S.who.ix] + ' return', labA: 'from EPS change', labB: 'from multiple change' });
  set('eps-who-n', w.note);
  set('eps-c4', ctl('avg', ['ix', 'base', 'period'])); note('eps-s4-n', S.avg); set('eps-avg', avgTable());
  set('eps-c5', ctl('scat', ['ix', 'base', 'period'])); note('eps-s5-n', S.scat);
  var sc = scat();
  scatter(document.getElementById('eps-scat'), sc.pts, { xTitle: 'Change in the stock\'s ' + yr(S.scat.base) + ' EPS estimate', yTitle: 'Change in its forward P/E', legend: sc.leg });
  set('eps-c6', ctl('rev', ['ix', 'base', 'period', 'lvl'].concat(S.rev.lvl === 'sec' ? ['n'] : []), 'Show')); note('eps-s6-n', S.rev);
  var r = revChart(), cr = S.rev;
  set('eps-t6', 'How much did the ' + IXN[cr.ix] + '\'s aggregate ' + yr(cr.base) + ' EPS estimate change between ' + dShort(E.dates[cr.k0]) + ' and ' + dShort(E.dates[cr.k1]) + ', and who added it?');
  waterfall(document.getElementById('eps-w6'), r.items, wfOpts(r, 'pp of the index\'s ' + yr(cr.base) + ' EPS change', 'Index EPS change ' + pc(r.total)));
  set('eps-c7', ctl('fwd', ['ix', 'date', 'lvl'].concat(S.fwd.lvl === 'sec' ? ['n'] : []), 'Show'));
  var cf = S.fwd; set('eps-s7-n', IXN[cf.ix] + ' · as of ' + dShort(E.dates[cf.k]) + (nExcl() ? ' · ' + nExcl() + ' excluded' : ''));
  var f = fwdChart();
  set('eps-t7', 'On ' + dShort(E.dates[cf.k]) + ' consensus has the ' + IXN[cf.ix] + '\'s aggregate EPS growing from CY2026 to CY2027. Who contributes to that growth?');
  waterfall(document.getElementById('eps-w7'), f.items, wfOpts(f, 'pp of the index\'s CY2026 → CY2027 EPS growth', 'Expected EPS growth ' + pc(f.total)));
  set('eps-c8', ctl('path', ['ix', 'base', 'period'])); note('eps-s8-n', S.path);
  var pb = pathBlock();
  lineChart(document.getElementById('eps-pa'), pb.labels, pb.a, function (v) { return v.toFixed(0); }, { endFmt: function (v) { return pc(v / 100 - 1); }, h: 250 });
  lineChart(document.getElementById('eps-pb'), pb.labels, pb.b, x1, { h: 250 });
  set('eps-c9', ctl('conc', ['ix', 'base'])); set('eps-s9-n', IXN[S.conc.ix] + ' · all snapshots · ' + yr(S.conc.base) + ' EPS'); set('eps-conc', concBlock());
  set('eps-c10', ctl('data', ['ix', 'base', 'period'])); note('eps-s10-n', S.data); set('eps-data', dataBlock());
}

function toggle(key) {
  var next = Object.assign({}, S.excl); next[key] = !next[key]; if (!next[key]) delete next[key];
  if (key.charAt(0) === 'S') E.secs.forEach(function (s) { if (s.s === key.slice(2)) { delete next['G|' + s.g]; delete next['T|' + s.t]; } });
  if (key.charAt(0) === 'G') E.secs.forEach(function (s) { if (s.g === key.slice(2)) delete next['T|' + s.t]; });
  var ex = exFrom(next);                 // never take the whole index out
  if (E.members('spx', S.detail.k0, ex).length && E.members('ndx', S.detail.k0, ex).length) { S.excl = next; DOM = null; }
}
function onAct(el) {
  var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
  if (act === 's') {
    var id = el.getAttribute('data-id'), f = el.getAttribute('data-f'), c = S[id], val = el.tagName === 'SELECT' ? el.value : v;
    if (['k0', 'k1', 'k', 'n'].indexOf(f) >= 0) val = +val;
    c[f] = val;
    if (f === 'k0' && c.k1 <= c.k0) c.k1 = c.k0 + 1;
    if (f === 'k1' && c.k0 >= c.k1) c.k0 = c.k1 - 1;
  }
  else if (act === 'tog') toggle(v);
  else if (act === 'unex') { delete S.excl[v]; }
  else if (act === 'open') S.open[v] = !S.open[v];
  else if (act === 'openall') E.secs.forEach(function (s) { S.open['S|' + s.s] = v === '1'; if (v !== '1') S.open['G|' + s.g] = false; });
  else if (act === 'reset') S.excl = {};
  else if (act === 'sort') { if (S.sort === v) S.dir = -S.dir; else { S.sort = v; S.dir = -1; } }
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
    root.addEventListener('click', function (e) { var t = e.target.closest('[data-act]'); if (!t || t.tagName === 'SELECT') return; e.preventDefault(); onAct(t); });
    root.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'SELECT' && t.getAttribute('data-act')) onAct(t); });
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
