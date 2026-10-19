// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into the change in forward EPS (CY2027) and the change in the forward multiple,
// from the base date (Jan 2, 2026) to each later snapshot, by sector / industry group / security.
// Sections that make sense per index have their own S&P / Nasdaq toggle (as Index Analysis); only the
// exclusions (clicked in the detail table) are shared, so a removed group is out everywhere.
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine } from './eps-engine.js';
import { triBars, groupBars, scatter, waterfall, ppTxt } from './eps-charts.js';

var BASE = 'cy27', Y = 'CY2027';
// EPS part = steel, multiple part = its light tint; up / down = the portal's green / red (as in Index Analysis)
var C = { eps: '#3E5A82', mult: '#B7C4D8', pos: '#177A4E', neg: '#9B2A20' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var IXN = { spx: 'S&P 500', ndx: 'Nasdaq-100' };
var LV = [['sector', 'Sector'], ['ig', 'Industry group'], ['sec', 'Security']];
var E = null, root = null, S = null, DOM = null, K0 = 1;

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
function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function seg(attrs, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" ' + attrs + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function sel(attrs, opts, cur) {
  return '<select ' + attrs + '>' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(cur) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
}
function sec(id, title, body) {
  return '<div class="sec" id="' + id + '"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn" id="' + id + '-n"></span></div>' + body + '</div>';
}

// ─── state ────────────────────────────────────────────────────────
function initialState() {
  var last = E.dates.length - 1;
  return { excl: {}, open: {}, sort: 'cP', dir: -1,
    detail: { ix: 'spx', k1: last }, who: { ix: 'spx', k1: last, lvl: 'sector', meas: 'c', n: 10 }, rev: { ix: 'spx', k1: last, lvl: 'sec', n: 10 },
    scat: { ix: 'spx', k1: last }, conc: { ix: 'spx' }, data: { ix: 'spx', k1: last } };
}
// exclusions: 'S|Sector' · 'G|Industry group' · 'T|TICKER' — shared by every section and both indices
function exFrom(excl) {
  var set = new Set();
  E.secs.forEach(function (s, i) { if (excl['S|' + s.s] || excl['G|' + s.g] || excl['T|' + s.t]) set.add(i); });
  return set;
}
function exNow() { var s = exFrom(S.excl); return s.size ? s : null; }
function per(ix, k1) { return E.period(ix, K0, k1, BASE, exNow()); }
function nExcl() { return Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).length; }
function ctxLine(ixTxt, k1) { return ixTxt + ' · ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k1]) + ' · ' + Y + ' EPS' + (nExcl() ? ' · ' + nExcl() + ' excluded' : ''); }
function keyOf(lvl) { return function (r) { var s = E.secs[r.id]; return lvl === 'sector' ? s.s : lvl === 'ig' ? s.g : String(r.id); }; }
function nameOf(key, lvl) { if (lvl !== 'sec') return key; var s = E.secs[+key]; return s.t + ' · ' + short(s.n); }
function endDates() { var o = []; for (var k = K0 + 1; k < E.dates.length; k++) o.push([k, dLong(E.dates[k])]); return o; }

// per-section controls: ix (S&P / Nasdaq), to (end date), lvl, meas (contribution / own return), n
function ctl(id, parts) {
  var c = S[id], a = function (f) { return 'data-act="s" data-id="' + id + '" data-f="' + f + '"'; }, h = '';
  function blk(l, x) { h += '<div><div class="eps-lbl">' + l + '</div>' + x + '</div>'; }
  if (parts.indexOf('ix') >= 0) blk('Index', seg(a('ix'), [['spx', 'S&P 500'], ['ndx', 'Nasdaq-100']], c.ix));
  if (parts.indexOf('to') >= 0) blk('From ' + dShort(E.dates[K0]) + ' to', sel(a('k1'), endDates(), c.k1));
  if (parts.indexOf('lvl') >= 0) blk('Level', seg(a('lvl'), LV, c.lvl));
  if (parts.indexOf('meas') >= 0) blk('Measure', seg(a('meas'), [['c', 'Contribution to the index (pp)'], ['r', 'Own return (%)']], c.meas));
  if (parts.indexOf('n') >= 0) blk('Show', sel(a('n'), [[5, 'Top 5'], [10, 'Top 10'], [15, 'Top 15'], [20, 'Top 20']], c.n));
  return '<div class="eps-ctl">' + h + '</div>';
}

// ─── fixed axes: a bar keeps its length whatever index, date or level is shown ───
function stepsOf(items, total) { var cum = 0, lo = 0, hi = 0; items.forEach(function (v) { cum += v; lo = Math.min(lo, cum); hi = Math.max(hi, cum); }); return [Math.min(lo, total), Math.max(hi, total)]; }
function domains() {
  if (DOM) return DOM;
  var z = function () { return { sector: [0, 0], ig: [0, 0], sec: [0, 0] }; };
  var d = { hero: [0, 0], stack: z(), own: z(), rev: z() };
  function ext(a, lo, hi) { a[0] = Math.min(a[0], lo); a[1] = Math.max(a[1], hi); }
  ['spx', 'ndx'].forEach(function (ix) {
    for (var k1 = K0 + 1; k1 < E.dates.length; k1++) {
      var p = E.period(ix, K0, k1, BASE, null);
      ext(d.hero, Math.min(p.g, p.m, p.R), Math.max(p.g, p.m, p.R));
      LV.forEach(function (L) {
        var gs = E.group(p.rows, keyOf(L[0]));
        gs.forEach(function (g) {
          ext(d.stack[L[0]], Math.min(g.cE, g.cM, g.cP), Math.max(g.cE, g.cM, g.cP));
          if (g.g != null && g.m != null) ext(d.own[L[0]], Math.min(g.g, g.m, g.ret), Math.max(g.g, g.m, g.ret));
        });
        var st = stepsOf(gs.slice().sort(function (x, y) { return y.cE - x.cE; }).map(function (g) { return g.cE; }), p.g);
        ext(d.rev[L[0]], st[0], st[1]);
      });
    }
  });
  return (DOM = d);
}

// ─── 1 · return = EPS change × multiple change (both indices, returns only) ───
function hero() {
  var last = E.dates.length - 1, tiles = '', panels = [];
  ['spx', 'ndx'].forEach(function (ix) {
    var p = per(ix, last), groups = [];
    tiles += '<div class="eps-eqrow"><div class="eps-eqn">' + IXN[ix] + '</div><div class="eps-eq">' +
      '<div class="eps-eqt"><div class="k">' + Y + ' EPS</div><div class="v" style="color:' + col(p.g) + '">' + pc(p.g) + '</div><div class="s">index earnings, ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[last]) + '</div></div><div class="op">×</div>' +
      '<div class="eps-eqt"><div class="k">Forward P/E</div><div class="v" style="color:' + col(p.m) + '">' + pc(p.m) + '</div><div class="s">' + x1(p.pe0) + ' → ' + x1(p.pe1) + '</div></div><div class="op">=</div>' +
      '<div class="eps-eqt tot"><div class="k">Price return</div><div class="v" style="color:' + col(p.R) + '">' + pc(p.R) + '</div><div class="s">(1 ' + pc(p.g) + ') × (1 ' + pc(p.m) + ') − 1</div></div></div></div>';
    for (var k = K0 + 1; k <= last; k++) {
      var q = per(ix, k), tip = '<b style="font-size:13px">' + IXN[ix] + ' · ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k]) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">' + Y + ' EPS ' + pc(q.g) + '<br>Forward P/E ' + pc(q.m) + ' (' + x1(q.pe0) + ' → ' + x1(q.pe1) + ')<br>Price ' + pc(q.R) + '</span>';
      groups.push({ label: dShort(E.dates[k]), bars: [{ v: q.g, color: C.eps, tip: tip }, { v: q.m, color: C.mult, tip: tip }, { v: q.R, color: q.R >= 0 ? C.pos : C.neg, tip: tip }] });
    }
    panels.push({ ix: ix, groups: groups });
  });
  return { tiles: tiles, panels: panels };
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
  E.members(c.ix, K0, exNow()).forEach(function (m) { var s = E.secs[m.id]; w0[s.s] = (w0[s.s] || 0) + m.w; w0[s.g] = (w0[s.g] || 0) + m.w; w0[m.id] = m.w; });
  E.members(c.ix, c.k1, exNow()).forEach(function (m) { var s = E.secs[m.id]; w1[s.s] = (w1[s.s] || 0) + m.w; w1[s.g] = (w1[s.g] || 0) + m.w; w1[m.id] = m.w; });
  return { w0: w0, w1: w1 };
}
function rowCells(o, W, key, off) {
  if (!o || off) return '<td class="num" style="color:var(--mu)">—</td>'.repeat(7);
  return '<td class="num" style="color:var(--mu);font-size:11px">' + wtxt(W.w0[key], W.w1[key] || 0) + '</td><td class="num">' + cP(o.g) + '</td><td class="num">' + cP(o.m) + '</td><td class="num">' + cP(o.ret) + '</td>' +
    '<td class="num">' + cc(o.cE) + '</td><td class="num">' + cc(o.cM) + '</td><td class="num" style="font-weight:700">' + cc(o.cP) + '</td>';
}
function detail() {
  var c = S.detail, cur = per(c.ix, c.k1), all = nExcl() ? E.period(c.ix, K0, c.k1, BASE, null) : cur, byS = {}, byG = {}, byT = {}, igsOf = {};
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
  return '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click any row — sector, industry group or security — to take it out of the index. Every section recalculates without it and the rest rescale to 100%. Arrows open the next level.' +
    (chips ? '<span class="eps-chips"><br>Excluded: ' + chips + '</span>' : '') + '</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand all sectors</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse</button><button class="sb-tbtn" data-act="reset">Reset</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change</th><th colspan="3" class="grp">Contribution to ' + IXN[c.ix] + ' (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry group / Security</th>' +
    th('w', 'Weight, start → end') + th('g', Y + ' EPS') + th('m', 'Forward P/E') + th('ret', 'Price') + th('cE', 'From EPS') + th('cM', 'From multiple') + th('cP', 'Total') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note">Its own change: the group as one block (its ' + Y + ' EPS summed over its stocks, its forward P/E, its price), so (1 + EPS) × (1 + P/E) = 1 + Price on every row. Contribution: its share of the index move, weights included; From EPS + From multiple = Total, and the rows add up to the index.</div>' +
    '<div class="eps-three"><b>Index ' + Y + ' EPS change, three ways:</b> aggregate ' + cP(cur.g) + ' (the index\'s total earnings; what the table uses) · weighted average of its stocks\' own changes ' + cP(cur.wAvgG) + ' (each stock\'s change × its index weight) · median stock ' + cP(cur.medG) + '. Aggregate and weighted average differ because the first counts a stock by weight × earnings yield, the second by weight alone. No stock is capped.</div></div>';
}

// ─── 3 · who moved the index: contribution OR own return, one at a time ───
function who() {
  var c = S.who, p = per(c.ix, c.k1), lvl = c.lvl, contrib = c.meas === 'c', note = '';
  var gs = E.group(p.rows, keyOf(lvl)).filter(function (g) { return contrib || (g.g != null && g.m != null); });
  var sortV = function (g) { return contrib ? g.cP : g.ret; };
  gs.sort(function (a, b) { return sortV(b) - sortV(a); });
  if (lvl === 'sec' && gs.length > 2 * c.n) { gs = gs.slice(0, c.n).concat(gs.slice(-c.n)); note = 'The ' + c.n + ' biggest and ' + c.n + ' smallest of ' + p.n + ' stocks, ranked by ' + (contrib ? 'contribution' : 'own return') + '.'; }
  var rows = gs.map(function (g) {
    var nm = nameOf(g.key, lvl), head = '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">';
    if (contrib) return { label: trunc(nm, 42), a: g.cE, b: g.cM, net: g.cP, tip: head + 'Weight at start ' + (g.w0 * 100).toFixed(2) + '%<br>EPS ' + pp(g.cE, 2) + ' pp · multiple ' + pp(g.cM, 2) + ' pp · <b>total ' + pp(g.cP, 2) + ' pp</b></span>' };
    return { label: trunc(nm, 42), a: g.g, b: g.m, net: g.ret, tip: head + Y + ' EPS ' + pc(g.g) + '<br>Forward P/E ' + pc(g.m) + ' (' + x1(g.pe0) + ' → ' + x1(g.pe1) + ')<br><b>Price ' + pc(g.ret) + '</b></span>' };
  });
  return { rows: rows, note: note, contrib: contrib, dom: contrib ? domains().stack[lvl] : domains().own[lvl] };
}

// ─── 4 · where the index's EPS change comes from ──────────────────
function revChart() {
  var c = S.rev, p = per(c.ix, c.k1), lvl = c.lvl, total = p.g;
  var gs = E.group(p.rows, keyOf(lvl)).sort(function (a, b) { return b.cE - a.cE; });
  var N = lvl === 'sec' ? c.n : gs.length, shown = gs.slice(0, N), used = shown.reduce(function (s, g) { return s + g.cE; }, 0), rest = gs.length - shown.length;
  var items = shown.map(function (g) {
    var nm = nameOf(g.key, lvl);
    return { label: trunc(nm, 46), v: g.cE,
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Adds ' + pp(g.cE, 2) + ' pp of the index\'s ' + pc(total) + ' (' + (total ? (g.cE / total * 100).toFixed(0) : '—') + '% of it)<br>Its own ' + Y + ' EPS ' + pc(g.g) + '<br>Share of index earnings at the start ' + (g.rows.reduce(function (s, r) { return s + (r.esh || 0); }, 0) * 100).toFixed(1) + '%</span>' };
  });
  return { items: items, rest: rest > 0 ? total - used : null, restLabel: rest > 0 ? 'All other ' + rest + (lvl === 'sector' ? ' sectors' : lvl === 'ig' ? ' groups' : ' stocks') + ' (net)' : null, total: total, dom: domains().rev[lvl], p: p };
}

// ─── 5 · stock by stock ───────────────────────────────────────────
function scat() {
  var c = S.scat, p = per(c.ix, c.k1), rs = p.rows.filter(function (r) { return r.g != null && r.m != null; }), beyond = 0;
  var top = rs.slice().sort(function (a, b) { return Math.abs(b.cP) - Math.abs(a.cP); }).slice(0, 9).map(function (r) { return r.id; });
  var pts = rs.map(function (r) {
    var s = E.secs[r.id]; if (r.g > 4 || r.m > 4) beyond++;
    return { x: r.g, y: r.m, r: r.w0, color: r.ret >= 0 ? C.pos : C.neg, label: top.indexOf(r.id) >= 0 ? s.t : '',
      tip: '<b style="font-size:13px">' + esc(s.t) + '</b> <span style="color:#8A93A0">' + esc(short(s.n)) + '</span><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">' + esc(s.g) +
        '<br>' + Y + ' EPS ' + r.e0.toFixed(2) + ' → ' + r.e1.toFixed(2) + ' (' + pc(r.g) + ')<br>P/E ' + x1(r.pe0) + ' → ' + x1(r.pe1) + ' (' + pc(r.m) + ')<br><b>Price ' + pc(r.ret) + '</b></span>' };
  });
  var leg = '<span><i style="background:' + C.pos + '"></i>Price up</span><span><i style="background:' + C.neg + '"></i>Price down</span><span style="margin-left:auto">Dot size = weight in the index · labels = the 9 biggest contributors' + (beyond ? ' · hollow = beyond the axis (' + beyond + ')' : '') + '</span>';
  return { pts: pts, leg: leg };
}

// ─── 6 · concentration ────────────────────────────────────────────
function concBlock() {
  var c = S.conc;
  var tb = E.dates.map(function (d, k) {
    var q = E.concentration(c.ix, k, BASE, exNow());
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + (q.w10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.w10byE * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byE * 100).toFixed(1) + '%</td></tr>'; }).join('');
  return '<div class="card"><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>' + IXN[c.ix] + ' · ' + Y + ' EPS</th><th class="num">10 biggest by weight:<br>their weight</th><th class="num">…their share of the index\'s earnings</th><th class="num">10 biggest earners:<br>their weight</th><th class="num">…their share of the index\'s earnings</th></tr></thead><tbody>' + tb + '</tbody></table></div></div>';
}

// ─── 7 · data & method (short) ────────────────────────────────────
function dataBlock() {
  var c = S.data, p = per(c.ix, c.k1), skW = p.skipped.reduce(function (s, x) { return s + x.w0; }, 0);
  var why = { 'no price at the end date': 'Left the index, no later price', 'no EPS estimate at the start': 'No ' + Y + ' estimate at the start', 'no EPS estimate at the end': 'No ' + Y + ' estimate at the end' };
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td>' + (why[s.why] || s.why) + '</td></tr>'; }).join('');
  var fx = E.secs.filter(function (s) { return s.c; }).map(function (s) { return s.t + ' (' + s.c + ')'; }).join(', ');
  var defs = [
    ['Basket', 'The stocks the index held on ' + dLong(E.dates[K0]) + ', at their weights then, followed to the end date.'],
    ['Weight', 'Index weight from the file (float-adjusted).'],
    ['Forward EPS', 'Bloomberg consensus ' + Y + ' EPS, calendarised to December. Always ' + Y + ': no NTM or rolling year.'],
    ['Index earnings', 'Σ weight × EPS ÷ price. EPS change = its change between the two dates.'],
    ['Forward P/E', 'Basket price ÷ index earnings. Price return = (1 + EPS change) × (1 + P/E change) − 1.']
  ];
  return '<table class="rt eps-t3 eps-defs"><tbody>' + defs.map(function (d) { return '<tr><td class="nm">' + d[0] + '</td><td>' + d[1] + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="eps-h2">Which stocks are counted — ' + IXN[c.ix] + ', to ' + dShort(E.dates[c.k1]) + '</div>' +
    '<div class="eps-note" style="margin-top:0;font-size:12px"><b>' + p.n + '</b> of the <b>' + p.nStart + '</b> stocks held on the base date, ' + ((1 - skW) * 100).toFixed(1) + '% of the weight. The rest are not counted because the file has no end price or no ' + Y + ' estimate:</div>' +
    '<div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th>Why</th></tr></thead><tbody>' + (out || '<tr><td colspan="4">None.</td></tr>') + '</tbody></table></div>' +
    '<ul class="eps-ul"><li><b>GAAP EPS</b> (Bloomberg IS_COMP_EPS_GAAP): GOOGL and AMZN carry investment marks; exclude them in the table to see the effect.</li>' +
    '<li><b>No FX applied</b> to ' + esc(fx) + ': EPS used as the file gives it.</li>' +
    '<li>Source: ' + esc(E.D.source) + '.</li></ul>';
}

// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  root.innerHTML =
    sec('eps-s1', 'Return = EPS change × multiple change', '<div class="card"><div id="eps-h1"></div><div class="eps-two" style="margin-top:16px"><div id="eps-h1a"></div><div id="eps-h1b"></div></div>' +
      '<div class="eps-leg"><span><i style="background:' + C.eps + '"></i>' + Y + ' EPS change</span><span><i style="background:' + C.mult + '"></i>Forward P/E change</span><span><i style="background:' + C.pos + '"></i>Price return (green up · red down)</span></div></div>') +
    sec('eps-s2', 'Attribution detail & simulation', '<div id="eps-c2"></div><div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '<div id="eps-c3"></div><div class="card"><div id="eps-who"></div><div class="eps-note" id="eps-who-n"></div></div>') +
    sec('eps-s4', 'Where the index\'s ' + Y + ' EPS change comes from', '<div id="eps-c4"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t4"></div><div id="eps-w4"></div></div>') +
    sec('eps-s5', 'Stock by stock: EPS change vs multiple change', '<div id="eps-c5"></div><div class="card"><div id="eps-scat"></div></div>') +
    sec('eps-s6', 'Concentration of earnings', '<div id="eps-c6"></div><div id="eps-conc"></div>') +
    sec('eps-s7', 'Data & method', '<div id="eps-c7"></div><div class="card" id="eps-data"></div>');
}
function render() {
  var set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }, d = domains(), last = E.dates.length - 1, both = 'S&P 500 + Nasdaq-100';
  var h = hero();
  set('eps-s1-n', both + ' · from ' + dShort(E.dates[K0]) + ' to each later snapshot · ' + Y + ' EPS' + (nExcl() ? ' · ' + nExcl() + ' excluded' : ''));
  set('eps-h1', h.tiles);
  h.panels.forEach(function (pn, i) { groupBars(document.getElementById(i ? 'eps-h1b' : 'eps-h1a'), pn.groups, { domain: d.hero, title: IXN[pn.ix] + ' · from ' + dShort(E.dates[K0]) }); });
  set('eps-c2', ctl('detail', ['ix', 'to'])); set('eps-s2-n', ctxLine(IXN[S.detail.ix], S.detail.k1)); set('eps-detail', detail());
  var cw = S.who; set('eps-c3', ctl('who', ['ix', 'to', 'lvl', 'meas'].concat(cw.lvl === 'sec' ? ['n'] : []))); set('eps-s3-n', ctxLine(IXN[cw.ix], cw.k1));
  var w = who();
  triBars(document.getElementById('eps-who'), w.rows, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, domain: w.dom, unit: w.contrib ? 'pp' : '%',
    axisTitle: w.contrib ? 'pp of the ' + IXN[cw.ix] + ' price return' : 'each group\'s own change, %', totLabel: w.contrib ? 'Total contribution' : 'Price return', labA: w.contrib ? 'from ' + Y + ' EPS change' : Y + ' EPS change', labB: w.contrib ? 'from multiple change' : 'Forward P/E change' });
  set('eps-who-n', w.note);
  var cr = S.rev; set('eps-c4', ctl('rev', ['ix', 'to', 'lvl'].concat(cr.lvl === 'sec' ? ['n'] : []))); set('eps-s4-n', ctxLine(IXN[cr.ix], cr.k1));
  var r = revChart();
  set('eps-t4', 'Each bar is a stock\'s share of the ' + IXN[cr.ix] + '\'s ' + pc(r.total) + ' change in ' + Y + ' EPS since ' + dShort(E.dates[K0]) + '. It reflects its weight, its earnings yield and its own EPS change.');
  waterfall(document.getElementById('eps-w4'), r.items, { rest: r.rest, restLabel: r.restLabel, pos: C.pos, neg: C.neg, domain: r.dom, fmt: function (v) { return ppTxt(v, 1) + ' pp'; }, axisFmt: function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t); },
    axisTitle: 'pp of the index\'s ' + Y + ' EPS change', totalLabel: 'Index ' + Y + ' EPS change ' + pc(r.total) });
  set('eps-c5', ctl('scat', ['ix', 'to'])); set('eps-s5-n', ctxLine(IXN[S.scat.ix], S.scat.k1));
  var sc = scat();
  scatter(document.getElementById('eps-scat'), sc.pts, { xTitle: 'Change in the stock\'s ' + Y + ' EPS estimate', yTitle: 'Change in its forward P/E', legend: sc.leg });
  set('eps-c6', ctl('conc', ['ix'])); set('eps-s6-n', IXN[S.conc.ix] + ' · all snapshots · ' + Y + ' EPS'); set('eps-conc', concBlock());
  set('eps-c7', ctl('data', ['ix', 'to'])); set('eps-s7-n', ctxLine(IXN[S.data.ix], S.data.k1)); set('eps-data', dataBlock());
}

function toggle(key) {
  var next = Object.assign({}, S.excl); next[key] = !next[key]; if (!next[key]) delete next[key];
  if (key.charAt(0) === 'S') E.secs.forEach(function (s) { if (s.s === key.slice(2)) { delete next['G|' + s.g]; delete next['T|' + s.t]; } });
  if (key.charAt(0) === 'G') E.secs.forEach(function (s) { if (s.g === key.slice(2)) delete next['T|' + s.t]; });
  var ex = exFrom(next);                 // never take the whole index out
  if (E.members('spx', K0, ex).length && E.members('ndx', K0, ex).length) S.excl = next;
}
function onAct(el) {
  var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
  if (act === 's') {
    var id = el.getAttribute('data-id'), f = el.getAttribute('data-f'), val = el.tagName === 'SELECT' ? el.value : v;
    if (['k1', 'n'].indexOf(f) >= 0) val = +val;
    S[id][f] = val;
  }
  else if (act === 'tog') toggle(v);
  else if (act === 'unex') delete S.excl[v];
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
    E = makeEngine(m.EPS_DATA); K0 = Math.max(0, E.dates.indexOf('2026-01-02')); S = initialState(); skeleton();
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
