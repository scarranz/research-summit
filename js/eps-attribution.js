// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into forward-EPS growth and forward-multiple change, by sector / industry group /
// security, with any group removable from the table (same pattern as Index Analysis > Attribution Detail).
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine, BASES } from './eps-engine.js';
import { divStack, scatter, lineChart, waterfall, ppTxt } from './eps-charts.js';
import { SCOLS } from './portal-data.js';

// EPS part = steel, multiple part = its light tint; up / down = the portal's green / red (as in Index Analysis)
var C = { eps: '#3E5A82', mult: '#B7C4D8', pos: '#177A4E', neg: '#9B2A20', ink: '#1E2733' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var SEMI = 'Semiconductors & Semiconductor Equipment';
var IXN = { spx: 'S&P 500', ndx: 'Nasdaq-100' };
var E = null, root = null, S = null;

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function dLong(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function dShort(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + " '" + String(d.getUTCFullYear()).slice(2); }
function pc(v, d) { return v == null || isNaN(v) ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(d == null ? 1 : d) + '%'; }
function pp(v, d) { return v == null || isNaN(v) ? '—' : ppTxt(v, d == null ? 2 : d); }
function x1(v) { return v == null || isNaN(v) ? '—' : v.toFixed(1) + 'x'; }
function col(v) { return v == null || isNaN(v) ? 'var(--mu)' : v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function cP(v, d) { return '<span style="color:' + col(v) + ';font-weight:600">' + pc(v, d) + '</span>'; }
function short(n) { var o; do { o = n; n = n.replace(/[,\s]+(Inc|Corp|Corporation|Co|Ltd|PLC|plc|Holdings|Group|Company|NV|SA|AG|Class [A-C])\.?$/i, ''); } while (n !== o); return n; }
function secColor(s) { return SCOLS[s] || SCOLS[s === 'Information Technology' ? 'Technology' : s] || '#7A8594'; }
function ixName() { return IXN[S.ix]; }
function seg(act, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" data-act="' + act + '" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function pills(act, opts, cur) {
  return opts.map(function (o) { return '<button class="ndx-tab-btn' + (o[0] === cur ? ' active' : '') + '" data-act="' + act + '" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('');
}
function sec(id, title, note, body) {
  return '<div class="sec" id="' + id + '"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn">' + note + '</span></div>' + body + '</div>';
}

// ─── state ────────────────────────────────────────────────────────
function initialState() {
  var last = E.dates.length - 1, ytd = E.dates.indexOf('2026-01-02');
  return { ix: 'spx', base: 'fwd', k0: ytd >= 0 ? ytd : 0, k1: last, excl: {}, open: {}, sort: 'cP', dir: -1,
    lvl: 'sector', wf: 'rev', wl: 'sec', fk: last };
}
// exclusions: 'S|Sector' · 'G|Industry group' · 'T|TICKER'; they apply to both indices
function exFrom(excl) {
  var set = new Set();
  E.secs.forEach(function (s, i) { if (excl['S|' + s.s] || excl['G|' + s.g] || excl['T|' + s.t]) set.add(i); });
  return set;
}
function exSet() { return exFrom(S.excl); }
function per(ix, ex) { return E.period(ix, S.k0, S.k1, S.base, ex && ex.size ? ex : null); }
function compute() {
  var ex = exSet(), filt = ex.size > 0, cur = per(S.ix, ex);
  return { ex: ex, filt: filt, cur: cur, all: filt ? per(S.ix, null) : cur };
}
function ctx(c) {
  var n = Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).length;
  return ixName() + ' · ' + dShort(E.dates[S.k0]) + ' → ' + dShort(E.dates[S.k1]) + ' · forward EPS ' + c.cur.y0 + (c.cur.y0 === c.cur.y1 ? '' : ' → ' + c.cur.y1) + (n ? ' · ' + n + ' excluded' : '');
}
function lblOf(r, lvl) {
  var s = E.secs[r.id];
  return lvl === 'sector' ? s.s : lvl === 'ig' ? s.g : s.t + ' · ' + short(s.n);
}
function keyOf(lvl) { return function (r) { var s = E.secs[r.id]; return lvl === 'sector' ? s.s : lvl === 'ig' ? s.g : String(r.id); }; }
function nameOf(key, lvl) { return lvl === 'sec' ? lblOf({ id: +key }, 'sec') : key; }

// ─── controls ─────────────────────────────────────────────────────
function controls(c) {
  var opt = function (k, sel, lo, hi) { return E.dates.map(function (d, i) { return (i < lo || i > hi) ? '' : '<option value="' + i + '"' + (i === sel ? ' selected' : '') + '>' + dLong(d) + '</option>'; }).join(''); };
  var last = E.dates.length - 1;
  var chips = Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).map(function (k) {
    return '<button class="ndx-chip active" data-act="unex" data-v="' + esc(k) + '">' + esc(k.slice(2)) + ' <span class="eps-x">×</span></button>'; }).join('');
  var rollNote = S.base === 'fwd' ? 'Forward year rolls on Oct 1: EPS of the year ahead at each date.' : 'One fixed year at both dates.';
  return '<div class="card eps-ctl">' +
    '<div><div class="eps-lbl">Index</div>' + seg('ix', [['spx', 'S&P 500'], ['ndx', 'Nasdaq-100']], S.ix) + '</div>' +
    '<div><div class="eps-lbl">From</div><select data-act="k0">' + opt('k0', S.k0, 0, S.k1 - 1) + '</select></div>' +
    '<div><div class="eps-lbl">To</div><select data-act="k1">' + opt('k1', S.k1, S.k0 + 1, last) + '</select></div>' +
    '<div><div class="eps-lbl">Forward EPS</div>' + seg('base', BASES.map(function (b) { return [b[0], b[1]]; }), S.base) + '</div>' +
    '<div class="eps-ctl-r"><button class="ndx-tab-btn" data-act="semis">Ex-semis</button> <button class="sb-tbtn" data-act="reset">Reset</button></div>' +
    '<div class="eps-ctl-n"><b>' + ixName() + '</b> · basket held on ' + dLong(E.dates[S.k0]) + ' · uses ' + c.cur.y0 + (c.cur.y0 === c.cur.y1 ? '' : ' EPS at the start and ' + c.cur.y1 + ' EPS at the end') + '. ' + rollNote +
      (chips ? '<span class="eps-chips"> Excluded: ' + chips + '</span>' : '') + '</div></div>';
}

// ─── 1 · hero: return = EPS growth × multiple change ──────────────
function hero(c) {
  var p = c.cur, g = p.g, m = p.m, R = p.R, eq = '';
  var sub = p.y0 + (p.y0 === p.y1 ? '' : ' → ' + p.y1) + ' EPS, ' + dShort(E.dates[S.k0]) + ' → ' + dShort(E.dates[S.k1]);
  // when the forward year rolls, split the EPS growth into "one more year of growth" and "revisions to the new year"
  var split = '';
  if (p.y0 !== p.y1) {
    var q0 = 0, qx = 0, q1 = 0, n = 0;
    p.rows.forEach(function (r) { if (r.x0 != null) { n++; q0 += r.q * r.e0; qx += r.q * r.x0; q1 += r.q * r.e1; } });
    if (n === p.rows.length && q0 > 0 && qx > 0) {
      var roll = qx / q0 - 1, rev = q1 / qx - 1;
      split = '<div class="eps-split"><b>Where the ' + pc(g) + ' comes from:</b> ' + cP(roll) + ' is the growth already expected from ' + p.y0 + ' to ' + p.y1 + ' on ' + dShort(E.dates[S.k0]) +
        ' (the year simply rolled), and ' + cP(rev) + ' is how much ' + p.y1 + ' estimates have been revised since. (1 ' + pc(roll) + ') × (1 ' + pc(rev) + ') = 1 ' + pc(g) + '.</div>';
    }
  }
  eq = '<div class="eps-eq">' +
    '<div class="eps-eqt"><div class="k">Forward EPS growth</div><div class="v" style="color:' + col(g) + '">' + pc(g) + '</div><div class="s">' + sub + '</div></div><div class="op">×</div>' +
    '<div class="eps-eqt"><div class="k">Forward P/E change</div><div class="v" style="color:' + col(m) + '">' + pc(m) + '</div><div class="s">' + x1(p.pe0) + ' → ' + x1(p.pe1) + '</div></div><div class="op">=</div>' +
    '<div class="eps-eqt tot"><div class="k">' + ixName() + ' price return</div><div class="v" style="color:' + col(R) + '">' + pc(R) + '</div><div class="s">(1 ' + pc(g) + ') × (1 ' + pc(m) + ') − 1</div></div></div>' + split;
  // both indices side by side, same exclusions
  var rows = ['spx', 'ndx'].map(function (ix) {
    var q = ix === S.ix ? p : per(ix, c.ex);
    return { ix: ix, p: q, label: IXN[ix], bold: ix === S.ix, a: q.g, b: q.R - q.g, net: q.R,
      tip: '<b style="font-size:13px">' + IXN[ix] + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Price return ' + pc(q.R) + '<br>Forward EPS growth ' + pc(q.g) + '<br>Forward P/E change ' + pc(q.m) + '<br>P/E ' + x1(q.pe0) + ' → ' + x1(q.pe1) + '<br>Interaction (g × m) ' + pc(q.mCross) + '</span>' };
  });
  var tbl = '<table class="rt eps-t2"><thead><tr><th>Index</th><th class="num">Price return</th><th class="num">Fwd EPS growth</th><th class="num">Fwd P/E change</th><th class="num">Fwd P/E, start → end</th><th class="num">Names</th></tr></thead><tbody>' +
    rows.map(function (r) {
      var q = r.p;
      return '<tr' + (r.bold ? ' class="on"' : '') + '><td>' + r.label + '</td><td class="num">' + cP(q.R) + '</td><td class="num">' + cP(q.g) + '</td><td class="num">' + cP(q.m) + '</td><td class="num">' + x1(q.pe0) + ' → ' + x1(q.pe1) + '</td><td class="num" style="color:var(--mu)">' + q.n + ' of ' + q.nStart + '</td></tr>'; }).join('') + '</tbody></table>';
  return { html: eq + '<div class="eps-h2">In points of return, both indices</div><div id="eps-hero-chart"></div>' + tbl, rows: rows };
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
function cm(v) { return v == null ? '<span style="color:var(--mu)">—</span>' : cP(v); }
function cc(v) { return v == null ? '<span style="color:var(--mu)">—</span>' : '<span style="color:' + col(v) + ';font-weight:600">' + pp(v, 2) + '</span>'; }
function wtxt(a, b) { return a == null ? '<span style="color:var(--mu)">—</span>' : (a * 100).toFixed(2) + '% → ' + (b * 100).toFixed(2) + '%'; }

function weightMaps(ex) {
  var w0 = {}, w1 = {};
  E.members(S.ix, S.k0, ex.size ? ex : null).forEach(function (m) { var s = E.secs[m.id]; w0[s.s] = (w0[s.s] || 0) + m.w; w0[s.g] = (w0[s.g] || 0) + m.w; w0[m.id] = m.w; });
  E.members(S.ix, S.k1, ex.size ? ex : null).forEach(function (m) { var s = E.secs[m.id]; w1[s.s] = (w1[s.s] || 0) + m.w; w1[s.g] = (w1[s.g] || 0) + m.w; w1[m.id] = m.w; });
  return { w0: w0, w1: w1 };
}

function detail(c) {
  var A = c.all.rows, byS = {}, byG = {}, byT = {}, igsOf = {};
  E.group(c.cur.rows, keyOf('sector')).forEach(function (o) { byS[o.key] = o; });
  E.group(c.cur.rows, keyOf('ig')).forEach(function (o) { byG[o.key] = o; });
  c.cur.rows.forEach(function (r) { byT[r.id] = r; });
  var aS = E.group(A, keyOf('sector')), aG = {}; E.group(A, keyOf('ig')).forEach(function (o) { aG[o.key] = o; });
  A.forEach(function (r) { var s = E.secs[r.id]; (igsOf[s.s] = igsOf[s.s] || {})[s.g] = 1; });
  var W = weightMaps(c.ex), sk = S.sort, dir = S.dir;
  function val(o) { var v = sk === 'w' ? o.w0 : o[sk]; return v == null ? -1e9 : v; }
  function cmp(a, b) { return dir * (val(b) - val(a)) * -1; }
  var body = '';
  function anyEx(pred) { return E.secs.some(function (s) { return pred(s) && (S.excl['S|' + s.s] || S.excl['G|' + s.g] || S.excl['T|' + s.t]); }); }
  aS.slice().sort(function (a, b) { return dir * (val(b) - val(a)); }).forEach(function (so) {
    var sname = so.key, offS = !!S.excl['S|' + sname], cur = byS[sname];
    var state = offS ? 'off' : anyEx(function (s) { return s.s === sname; }) ? 'part' : 'on';
    var igs = Object.keys(igsOf[sname]).map(function (g) { return aG[g]; }).sort(function (a, b) { return dir * (val(b) - val(a)); });
    var open = !!S.open['S|' + sname];
    body += '<tr class="eps-r1' + (offS ? ' off' : '') + '" data-act="tog" data-v="S|' + esc(sname) + '"><td class="c">' + selDot(state) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="S|' + esc(sname) + '">' + (open ? '▲' : '▼') + '</span></td>' +
      '<td class="nm"><i class="eps-sw" style="background:' + secColor(sname) + '"></i>' + esc(sname) + '</td>' + rowCells(cur, W, sname, offS) + '</tr>';
    if (!open) return;
    igs.forEach(function (go) {
      var gname = go.key, offG = offS || !!S.excl['G|' + gname], curG = byG[gname], gopen = !!S.open['G|' + gname];
      var gstate = offG ? 'off' : anyEx(function (s) { return s.g === gname; }) ? 'part' : 'on';
      body += '<tr class="eps-r2' + (offG ? ' off' : '') + '" data-act="tog" data-v="G|' + esc(gname) + '"><td class="c" style="padding-left:12px">' + selDot(gstate) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="G|' + esc(gname) + '">' + (gopen ? '▲' : '▼') + '</span></td>' +
        '<td class="nm" style="padding-left:22px">' + esc(gname) + '</td>' + rowCells(curG, W, gname, offG) + '</tr>';
      if (!gopen) return;
      go.rows.slice().sort(function (a, b) { return dir * (val(b) - val(a)); }).forEach(function (ro) {
        var s = E.secs[ro.id], offT = offG || !!S.excl['T|' + s.t], r = byT[ro.id];
        body += '<tr class="eps-r3' + (offT ? ' off' : '') + '" data-act="tog" data-v="T|' + esc(s.t) + '"><td class="c" style="padding-left:24px">' + dot(!offT, 12) + '</td><td></td>' +
          '<td class="nm" style="padding-left:38px"><b>' + esc(s.t) + '</b> <span style="color:var(--mu)">' + esc(short(s.n)) + '</span></td>' + rowCells(r, W, ro.id, offT) + '</tr>';
      });
    });
  });
  var p = c.cur;
  body += '<tr class="eps-tot"><td></td><td></td><td class="nm">' + (c.filt ? 'Selection' : 'Total') + ' · ' + ixName() + '</td><td class="num">100.00% → 100.00%</td><td class="num">' + cm(p.g) + '</td><td class="num">' + cm(p.m) + '</td><td class="num">' + cm(p.R) + '</td><td class="num">' + cc(p.g) + '</td><td class="num">' + cc(p.R - p.g) + '</td><td class="num">' + cc(p.R) + '</td></tr>';
  if (c.filt) { var a = c.all; body += '<tr class="eps-tot2"><td></td><td></td><td class="nm">Whole index</td><td class="num">100.00% → 100.00%</td><td class="num">' + cm(a.g) + '</td><td class="num">' + cm(a.m) + '</td><td class="num">' + cm(a.R) + '</td><td class="num">' + cc(a.g) + '</td><td class="num">' + cc(a.R - a.g) + '</td><td class="num">' + cc(a.R) + '</td></tr>'; }
  function th(k, label, cls) { return '<th class="num ' + (cls || '') + (S.sort === k ? ' on' : '') + '" data-act="sort" data-v="' + k + '">' + label + (S.sort === k ? (S.dir < 0 ? ' ▼' : ' ▲') : '') + '</th>'; }
  return '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click a row to take it out of the index — everything on this tab recalculates and the remaining weights rescale to 100%. Arrows open industry groups and securities.</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand sectors</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change</th><th colspan="3" class="grp">Contribution to the index (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry group / Security</th>' +
    th('w', 'Weight, start → end') + th('g', 'Fwd EPS') + th('m', 'Fwd P/E') + th('ret', 'Price') + th('cE', 'EPS', 'k') + th('cM', 'Multiple', 'k') + th('cP', 'Total', 'k') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note">Own change = the group as one block (its aggregate forward EPS, its forward P/E, its price): (1 + EPS) × (1 + P/E) = 1 + Price on every row. Contribution = the group\'s share of the index move; EPS + Multiple = Total, and the rows add up to the index. Multiple includes the interaction term.</div></div>';
}
function rowCells(o, W, key, off) {
  if (!o || off) return '<td class="num" style="color:var(--mu)">—</td>'.repeat(7);
  return '<td class="num" style="color:var(--mu);font-size:11px">' + wtxt(W.w0[key], W.w1[key] || 0) + '</td>' + '<td class="num">' + cm(o.g) + '</td><td class="num">' + cm(o.m) + '</td><td class="num">' + cm(o.ret) + '</td>' +
    '<td class="num">' + cc(o.cE) + '</td><td class="num">' + cc(o.cM) + '</td><td class="num" style="font-weight:700">' + cc(o.cP) + '</td>';
}

// ─── 3 · who moved it (chart) ─────────────────────────────────────
function who(c) {
  var lvl = S.lvl, gs = E.group(c.cur.rows, keyOf(lvl)).sort(function (a, b) { return b.cP - a.cP; });
  if (lvl === 'sec') gs = gs.slice(0, 8).concat(gs.slice(-8).filter(function (g) { return gs.indexOf(g) >= 8; }));
  var rows = gs.map(function (g) {
    var nm = nameOf(g.key, lvl), w = c.cur.rows.length ? g.w0 : 0;
    return { label: nm.length > 44 ? nm.slice(0, 43) + '…' : nm, a: g.cE, b: g.cM, net: g.cP,
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Weight at start ' + (g.w0 * 100).toFixed(2) + '%<br>Its forward EPS ' + pc(g.g) + ' · forward P/E ' + pc(g.m) + ' · price ' + pc(g.ret) +
        '<br>Contribution: EPS ' + pp(g.cE, 2) + ' pp · multiple ' + pp(g.cM, 2) + ' pp · <b>total ' + pp(g.cP, 2) + ' pp</b></span>' };
  });
  return rows;
}

// ─── 4 · aggregate vs weighted average ────────────────────────────
function avgTable(c) {
  var semi = per(S.ix, exFrom({ ['G|' + SEMI]: true })), cols = [['Whole index', c.all], ['Excluding semiconductors', semi]];
  if (c.filt) cols.push(['Your selection', c.cur]);
  var defs = [
    ['Aggregate EPS growth', 'The index\'s own earnings: each stock\'s EPS × its index shares (weight ÷ price), added up. This is the EPS in the index P/E, so it is the one that multiplies with the multiple.', function (p) { return p.g; }, 1],
    ['Weighted-average stock growth', 'Each stock\'s own EPS growth × its index weight (float-adjusted weight in the index). Stock growth is capped at ±100%.', function (p) { return p.wAvgG; }, 1],
    ['Gap (aggregate − weighted)', 'Positive: growth sits in stocks whose earnings are large for their weight (low P/E). Negative: in expensive, small-earnings names.', function (p) { return p.g - p.wAvgG; }, 1],
    ['Equal-weight average', 'Every stock counts the same, growth capped at ±100%.', function (p) { return p.eqG; }, 1],
    ['Median stock', 'The typical stock, no weighting.', function (p) { return p.medG; }, 1],
    ['Forward P/E change', 'Aggregate multiple, start → end.', function (p) { return p.m; }, 1],
    ['Price return', '(1 + aggregate EPS growth) × (1 + P/E change) − 1.', function (p) { return p.R; }, 1]
  ];
  var tb = defs.map(function (d) {
    return '<tr><td><div class="eps-dn">' + d[0] + '</div><div class="eps-dd">' + d[1] + '</div></td>' + cols.map(function (k) { return '<td class="num">' + (d[0].indexOf('Gap') === 0 ? '<span style="color:var(--mu)">' + pp(d[2](k[1]), 1) + ' pp</span>' : cP(d[2](k[1]))) + '</td>'; }).join('') + '</tr>'; }).join('') +
    '<tr><td><div class="eps-dn">Forward P/E, start → end</div></td>' + cols.map(function (k) { return '<td class="num">' + x1(k[1].pe0) + ' → ' + x1(k[1].pe1) + '</td>'; }).join('') + '</tr>' +
    '<tr><td><div class="eps-dn">Names in the calculation</div></td>' + cols.map(function (k) { return '<td class="num" style="color:var(--mu)">' + k[1].n + '</td>'; }).join('') + '</tr>';
  return '<div class="card"><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>' + ixName() + ' · ' + dShort(E.dates[S.k0]) + ' → ' + dShort(E.dates[S.k1]) + '</th>' + cols.map(function (k) { return '<th class="num">' + k[0] + '</th>'; }).join('') + '</tr></thead><tbody>' + tb + '</tbody></table></div></div>';
}

// ─── 5 · stock by stock ───────────────────────────────────────────
function scat(c) {
  var rs = c.cur.rows.filter(function (r) { return r.g != null && r.m != null; });
  var top = rs.slice().sort(function (a, b) { return Math.abs(b.cP) - Math.abs(a.cP); }).slice(0, 9).map(function (r) { return r.id; });
  var seen = {}, pts = rs.map(function (r) {
    var s = E.secs[r.id]; seen[s.s] = 1;
    return { x: r.g, y: r.m, r: r.w0, color: secColor(s.s), label: top.indexOf(r.id) >= 0 ? s.t : '',
      tip: '<b style="font-size:13px">' + esc(s.t) + '</b> <span style="color:#8A93A0">' + esc(short(s.n)) + '</span><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">' + esc(s.g) +
        '<br>Weight ' + (r.w0 * 100).toFixed(2) + '% → ' + (r.w1 * 100).toFixed(2) + '%<br>EPS ' + r.e0.toFixed(2) + ' → ' + r.e1.toFixed(2) + ' (' + pc(r.g) + ')<br>P/E ' + x1(r.pe0) + ' → ' + x1(r.pe1) + ' (' + pc(r.m) + ')<br>Price ' + pc(r.ret) +
        '<br>Contribution: EPS ' + pp(r.cE, 2) + ' · multiple ' + pp(r.cM, 2) + ' · <b>total ' + pp(r.cP, 2) + ' pp</b></span>' };
  });
  var leg = Object.keys(seen).map(function (s) { return '<span><i style="background:' + secColor(s) + '"></i>' + esc(s) + '</span>'; }).join('');
  return { pts: pts, leg: leg + '<span style="margin-left:auto">Dot size = weight in the index · hollow = beyond the axis</span>' };
}

// ─── 6 · where the growth comes from ──────────────────────────────
function growthSrc(c) {
  var lvl = S.wl, rows, total, ttl, p;
  if (S.wf === 'rev') { p = c.cur; rows = p.rows; total = p.g; ttl = 'Change in aggregate forward EPS, ' + dShort(E.dates[S.k0]) + ' → ' + dShort(E.dates[S.k1]) + ' (' + p.y0 + (p.y0 === p.y1 ? '' : ' → ' + p.y1) + ')'; }
  else { p = E.forward(S.ix, S.fk, c.ex.size ? c.ex : null); rows = p.rows; total = p.g; ttl = 'Expected growth CY2026 → CY2027 in aggregate EPS, as of ' + dShort(E.dates[S.fk]); }
  var gs = E.group(rows, keyOf(lvl)).sort(function (a, b) { return b.cE - a.cE; });
  var N = lvl === 'sector' ? 11 : lvl === 'ig' ? 12 : 10, shown = gs.slice(0, N);
  gs.slice(N).filter(function (g) { return g.cE < -0.0025; }).sort(function (a, b) { return a.cE - b.cE; }).slice(0, 3).forEach(function (g) { shown.push(g); });
  var used = shown.reduce(function (s, g) { return s + g.cE; }, 0), restN = gs.length - shown.length;
  var items = shown.map(function (g) {
    var nm = nameOf(g.key, lvl);
    return { label: nm.length > 46 ? nm.slice(0, 45) + '…' : nm, v: g.cE,
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span style="display:block;font-size:12px;color:#52514e;margin-top:3px">Adds ' + pp(g.cE, 2) + ' pp of the ' + pc(total) + ' (' + (total ? (g.cE / total * 100).toFixed(0) : '—') + '% of it)<br>Its own EPS growth ' + pc(g.g) + '<br>Share of index earnings at start ' + (g.qe0 && rows.length ? (g.rows.reduce(function (s, r) { return s + r.esh; }, 0) * 100).toFixed(1) : '—') + '%</span>' };
  });
  return { items: items, rest: restN > 0 ? total - used : null, restLabel: restN > 0 ? 'Other ' + restN + (lvl === 'sector' ? ' sectors' : lvl === 'ig' ? ' groups' : ' names') : null, total: total, title: ttl, top: shown.length ? shown : [], p: p, lvl: lvl };
}

// ─── 7 · path & concentration ─────────────────────────────────────
function pathBlock(c) {
  var pts = E.path(S.ix, S.k0, S.k1, S.base, c.ex.size ? c.ex : null), labels = pts.map(function (q) { return dShort(E.dates[q.k]); });
  return { labels: labels, pts: pts,
    a: [{ name: 'Price', color: C.ink, vals: pts.map(function (q) { return 100 * (1 + q.R); }) }, { name: 'Aggregate forward EPS', color: C.eps, vals: pts.map(function (q) { return 100 * (1 + q.g); }) }],
    b: [{ name: 'Forward P/E', color: C.eps, vals: pts.map(function (q) { return q.pe; }) }] };
}
function concBlock(c) {
  var ex = c.ex.size ? c.ex : null;
  function row(k) { var q = E.concentration(S.ix, k, S.base, ex); return '<tr><td>' + dLong(E.dates[k]) + '</td><td class="num">' + (q.w10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byW * 100).toFixed(1) + '%</td><td class="num">' + (q.w10byE * 100).toFixed(1) + '%</td><td class="num">' + (q.e10byE * 100).toFixed(1) + '%</td></tr>'; }
  return '<div class="card"><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>' + ixName() + '</th><th class="num">10 biggest by weight:<br>their weight</th><th class="num">…their share of earnings</th><th class="num">10 biggest earners:<br>their weight</th><th class="num">…their share of earnings</th></tr></thead><tbody>' +
    row(S.k0) + row(S.k1) + '</tbody></table></div><div class="eps-note">Earnings = aggregate forward EPS of the index (index shares × EPS). A top-10 that holds more weight than earnings is being paid for growth; the reverse means earnings are more concentrated than the index.</div></div>';
}

// ─── 8 · data & method ────────────────────────────────────────────
function dataBlock(c) {
  var p = c.cur, ix = S.ix;
  var cov = E.dates.map(function (d, k) {
    var m = E.members(ix, k, null), rows = E.D.snaps[k], byId = {}; rows.forEach(function (r) { byId[r[0]] = r; });
    var px = 0, e = 0, w = 0, we = 0;
    m.forEach(function (x) { var r = byId[x.id]; if (r[3] > 0) px++; var v = E.fy(S.base, k) >= 2027 ? r[5] : r[4]; if (v != null) { e++; we += x.w; } w += x.w; });
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + m.length + '</td><td class="num">' + px + '</td><td class="num">' + e + '</td><td class="num">' + (we * 100).toFixed(1) + '%</td><td class="num" style="color:var(--mu)">' + E.fyLabel(S.base, k) + '</td></tr>'; }).join('');
  var why = { 'no price at the end date': 'Left the index (acquired or removed) — the file has no later price', 'no EPS estimate at the start': 'No EPS estimate at the start', 'no EPS estimate at the end': 'No EPS estimate at the end' };
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td>' + (why[s.why] || s.why) + (s.why.indexOf('EPS') >= 0 && ['ASML', 'PDD', 'CCEP', 'FER'].indexOf(x.t) >= 0 ? ' (reports in another currency)' : '') + '</td></tr>'; }).join('');
  var skW = p.skipped.reduce(function (s, x) { return s + x.w0; }, 0);
  var defs = [
    ['Basket', 'The names the index held on the start date, at their start weights. They are followed to the end date even if they left the index meanwhile, so entrants during the period are not in it.'],
    ['Weight', 'The index weight in the source file (float-adjusted market cap), not a price or a plain market cap. Exclusions rescale the rest to 100%.'],
    ['Index shares (q)', 'weight ÷ price at the start. It only turns a weight into "how many shares of each stock one unit of the index holds", so earnings can be added up. Held fixed over the period.'],
    ['Forward EPS', 'Bloomberg consensus for the year ahead at each date; the year rolls from CY2026 to CY2027 on Oct 1. Or one fixed year if chosen above.'],
    ['Aggregate EPS growth', 'Σ q × EPS at the end ÷ Σ q × EPS at the start − 1. The index\'s own earnings; it is the only EPS that fits (1 + EPS) × (1 + P/E) = 1 + price.'],
    ['Weighted-average growth', 'Σ weight × each stock\'s EPS growth. Weights by index weight, not by earnings, so it differs from the aggregate.'],
    ['Contribution', 'EPS: q × ΔEPS ÷ index earnings at start. Price: q × Δprice ÷ index level at start. Multiple = Price − EPS. Each adds up over sectors, groups and securities.']
  ];
  return '<div class="eps-two"><div><div class="eps-h2">What is counted — ' + ixName() + ' (whole index)</div><div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>Date</th><th class="num">Members</th><th class="num">With price</th><th class="num">With fwd EPS</th><th class="num">Weight with EPS</th><th class="num">Fwd year</th></tr></thead><tbody>' + cov + '</tbody></table></div></div>' +
    '<div><div class="eps-h2">Left out of this calculation — ' + p.skipped.length + ' of ' + p.nStart + ' names, ' + (skW * 100).toFixed(1) + '% of weight</div>' +
    (out ? '<div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th>Why</th></tr></thead><tbody>' + out + '</tbody></table></div>' : '<div class="eps-note">None.</div>') +
    '<div class="eps-note">' + p.entered.n + ' names joined after the start (' + (p.entered.w * 100).toFixed(1) + '% of end weight); they are not in the basket by design.</div></div></div>' +
    '<div class="eps-h2" style="margin-top:18px">Definitions</div><table class="rt eps-t3 eps-defs"><tbody>' + defs.map(function (d) { return '<tr><td class="nm">' + d[0] + '</td><td>' + d[1] + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="eps-h2" style="margin-top:18px">Data caveats</div><ul class="eps-ul">' +
    '<li><b>GAAP, not adjusted.</b> The consensus is Bloomberg GAAP EPS (IS_COMP_EPS_GAAP). Names whose GAAP EPS includes investment marks (GOOGL, AMZN) move the aggregate for reasons that are not operating earnings; test it with the exclusion table. An adjusted-EPS pull (BEST_EPS) would replace it.</li>' +
    '<li><b>Calendarised.</b> Bloomberg blends fiscal years to December 31 (NVDA, MSFT and others do not close in December).</li>' +
    '<li><b>Currency.</b> Foreign filers that report EPS in another currency (ASML, PDD, CCEP, FER) are dropped rather than mixed with USD prices.</li>' +
    '<li><b>Source.</b> Index EPS Contribution Analysis.xlsx, sheet UNIVERSE: ' + E.D.source + '.</li></ul>';
}

// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  root.innerHTML = '<div id="eps-ctl"></div>' +
    sec('eps-s1', 'Return = EPS growth × multiple change', '<span id="eps-n1"></span>', '<div class="card" id="eps-hero"></div>') +
    sec('eps-s2', 'Attribution detail & simulation', '<span id="eps-n2"></span>', '<div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '<span id="eps-n3"></span>', '<div class="card"><div class="eps-row"><span id="eps-lvl"></span></div><div id="eps-who"></div></div>') +
    sec('eps-s4', 'Aggregate vs weighted-average EPS growth · with and without semiconductors', '<span id="eps-n4"></span>', '<div id="eps-avg"></div>') +
    sec('eps-s5', 'Stock by stock: EPS change vs multiple change', '<span id="eps-n5"></span>', '<div class="card"><div id="eps-scat"></div></div>') +
    sec('eps-s6', 'Where the earnings growth comes from', '<span id="eps-n6"></span>', '<div class="card"><div class="eps-row"><span id="eps-wf"></span><span id="eps-fk"></span><span id="eps-wl"></span></div><div class="eps-h2" id="eps-wft"></div><div id="eps-wfc"></div></div>') +
    sec('eps-s7', 'Path since the start date', '<span id="eps-n7"></span>', '<div class="card"><div class="eps-two"><div><div class="eps-h2">Price and aggregate forward EPS (start = 100)</div><div id="eps-pa"></div></div><div><div class="eps-h2">Forward P/E</div><div id="eps-pb"></div></div></div></div>') +
    sec('eps-s8', 'Concentration of earnings', '<span id="eps-n8"></span>', '<div id="eps-conc"></div>') +
    sec('eps-s9', 'Data & method', '', '<div class="card" id="eps-data"></div>');
}
function render() {
  var c = compute(), h = hero(c), set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; };
  set('eps-ctl', controls(c));
  ['eps-n1', 'eps-n2', 'eps-n3', 'eps-n4', 'eps-n5', 'eps-n6', 'eps-n7', 'eps-n8'].forEach(function (id) { set(id, ctx(c)); });
  set('eps-hero', h.html);
  divStack(document.getElementById('eps-hero-chart'), h.rows.map(function (r) { return { label: r.label, a: r.a, b: r.b, net: r.net, bold: r.bold, tip: r.tip }; }),
    { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, labA: 'EPS growth', labB: 'Multiple change (includes the interaction)', netTitle: 'Price return' });
  set('eps-detail', detail(c));
  set('eps-lvl', seg('lvl', [['sector', 'Sector'], ['ig', 'Industry group'], ['sec', 'Security (top 8 · bottom 8)']], S.lvl));
  var wr = who(c);
  divStack(document.getElementById('eps-who'), wr, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, labA: 'EPS growth', labB: 'Multiple change (includes the interaction)', netTitle: 'Contribution' });
  set('eps-avg', avgTable(c));
  var sc = scat(c);
  scatter(document.getElementById('eps-scat'), sc.pts, { xTitle: 'Change in the stock\'s forward EPS', yTitle: 'Change in its forward P/E', legend: sc.leg });
  set('eps-wf', seg('wf', [['rev', 'Change over the period'], ['fwd', 'Expected, CY2026 → CY2027']], S.wf));
  set('eps-fk', S.wf === 'fwd' ? '<span class="eps-pl">' + pills('fk', E.dates.map(function (d, i) { return [String(i), dShort(d)]; }), String(S.fk)) + '</span>' : '');
  set('eps-wl', seg('wl', [['sector', 'Sector'], ['ig', 'Industry group'], ['sec', 'Security']], S.wl));
  var g = growthSrc(c);
  set('eps-wft', g.title + ' — ' + ixName() + (c.filt ? ' (selection)' : ''));
  waterfall(document.getElementById('eps-wfc'), g.items, { rest: g.rest, restLabel: g.restLabel, pos: C.pos, neg: C.neg, fmt: function (v) { return ppTxt(v, 1) + ' pp'; }, axisFmt: function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t); },
    axisTitle: 'pp of aggregate EPS growth', totalLabel: 'Aggregate EPS growth ' + pc(g.total) });
  var pb = pathBlock(c);
  lineChart(document.getElementById('eps-pa'), pb.labels, pb.a, function (v) { return v.toFixed(0); }, { endFmt: function (v) { return pc(v / 100 - 1); }, h: 250,
    tip: function (i, h2) { return h2 + '<span style="display:block;font-size:11px;color:#8A93A0;margin-top:3px">Forward year ' + pb.pts[i].y + '</span>'; } });
  lineChart(document.getElementById('eps-pb'), pb.labels, pb.b, x1, { h: 250, tip: function (i, h2) { return h2 + '<span style="display:block;font-size:11px;color:#8A93A0;margin-top:3px">Forward year ' + pb.pts[i].y + '</span>'; } });
  set('eps-conc', concBlock(c));
  set('eps-data', dataBlock(c));
}

function toggle(key) {
  var next = Object.assign({}, S.excl); next[key] = !next[key];
  if (key.charAt(0) === 'S') E.secs.forEach(function (s) { if (s.s === key.slice(2)) { delete next['G|' + s.g]; delete next['T|' + s.t]; } });
  if (key.charAt(0) === 'G') E.secs.forEach(function (s) { if (s.g === key.slice(2)) delete next['T|' + s.t]; });
  var ex = exFrom(next);                 // never take the whole index out
  if (E.members('spx', S.k0, ex).length && E.members('ndx', S.k0, ex).length) S.excl = next;
}
function onAct(act, v) {
  if (act === 'ix') S.ix = v;
  else if (act === 'base') S.base = v;
  else if (act === 'k0') { S.k0 = +v; if (S.k1 <= S.k0) S.k1 = S.k0 + 1; }
  else if (act === 'k1') { S.k1 = +v; if (S.k0 >= S.k1) S.k0 = S.k1 - 1; }
  else if (act === 'tog') toggle(v);
  else if (act === 'unex') delete S.excl[v];
  else if (act === 'open') S.open[v] = !S.open[v];
  else if (act === 'openall') { E.secs.forEach(function (s) { S.open['S|' + s.s] = v === '1'; if (v !== '1') S.open['G|' + s.g] = false; }); }
  else if (act === 'semis') { var on = !S.excl['G|' + SEMI]; S.excl['G|' + SEMI] = on; if (!on) delete S.excl['G|' + SEMI]; }
  else if (act === 'reset') S.excl = {};
  else if (act === 'sort') { if (S.sort === v) S.dir = -S.dir; else { S.sort = v; S.dir = -1; } }
  else if (act === 'lvl') S.lvl = v;
  else if (act === 'wf') S.wf = v;
  else if (act === 'wl') S.wl = v;
  else if (act === 'fk') S.fk = +v;
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
