// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into the change in forward EPS (CY2027) and the change in the forward multiple,
// from the base date (Jan 2, 2026) to each later snapshot, by sector / industry group / security.
// Controls copy Index Analysis (S&P / Nasdaq toggle, period buttons, Top 5 / 10 / 20 / All + a typed number);
// only the exclusions (clicked in the detail table) are shared, so a removed group is out everywhere.
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine } from './eps-engine.js';
import { divStack, lineChart, barList, ppTxt } from './eps-charts.js';

var BASE = 'cy27', Y = 'CY2027';
var C = { eps: '#3E5A82', mult: '#B7C4D8', pos: '#177A4E', neg: '#9B2A20', price: '#1E2733', earn: '#7C9CC4' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var IXN = { spx: 'S&P 500', ndx: 'Nasdaq-100' };
var LV = [['sector', 'Sector'], ['ig', 'Industry group'], ['sec', 'Security']];
var E = null, root = null, S = null, DOM = null, K0 = 1, ORD = {};

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
function sec(id, title, body) {
  return '<div class="sec" id="' + id + '"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn" id="' + id + '-n"></span></div>' + body + '</div>';
}

// ─── state ────────────────────────────────────────────────────────
function initialState() {
  var last = E.dates.length - 1;
  return { excl: {}, open: {}, sort: 'cP', dir: -1,
    hero: { k1: last }, detail: { ix: 'spx', k1: last }, who: { ix: 'spx', k1: last, lvl: 'sec', n: 10, side: 'pos', meas: 'p' },
    conc: { ix: 'spx', n: 10, table: false }, data: { ix: 'spx', k1: last } };
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
function endDates() { var o = []; for (var k = K0 + 1; k < E.dates.length; k++) o.push([k, dShort(E.dates[k])]); return o; }

// ─── controls, as in Index Analysis ───────────────────────────────
function pills(attrs, opts, cur) {
  return '<span class="eps-pl">' + opts.map(function (o) { return '<button class="ndx-tab-btn' + (String(o[0]) === String(cur) ? ' active' : '') + '" ' + attrs + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function ctl(id, parts) {
  var c = S[id], a = function (f) { return 'data-act="s" data-id="' + id + '" data-f="' + f + '"'; }, h = '';
  function blk(l, x) { h += '<div><div class="eps-lbl">' + l + '</div>' + x + '</div>'; }
  if (parts.indexOf('ix') >= 0) blk('Index', '<span class="sb-toggle" style="margin-left:0">' + [['spx', 'S&P 500'], ['ndx', 'Nasdaq-100']].map(function (o) {
    return '<button class="sb-tbtn' + (o[0] === c.ix ? ' active' : '') + '" ' + a('ix') + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>');
  if (parts.indexOf('to') >= 0) blk('Period from ' + dShort(E.dates[K0]), pills(a('k1'), endDates(), c.k1));
  if (parts.indexOf('lvl') >= 0) blk('Level', pills(a('lvl'), LV, c.lvl));
  if (parts.indexOf('meas') >= 0) blk('What to show', pills(a('meas'), [['p', 'Price return'], ['e', 'EPS change']], c.meas));
  if (parts.indexOf('side') >= 0) blk('Show', pills(a('side'), [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']], c.side));
  if (parts.indexOf('n') >= 0) blk('How many', '<span class="eps-pl" style="flex-wrap:nowrap">' + [[5, 'Top 5'], [10, 'Top 10'], [20, 'Top 20'], [0, 'All']].map(function (o) {
    return '<button class="ndx-tab-btn' + (o[0] === c.n ? ' active' : '') + '" ' + a('n') + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') +
    '<input type="number" min="1" max="500" placeholder="Custom" ' + a('n') + ' value="' + ([5, 10, 20, 0].indexOf(c.n) < 0 ? c.n : '') + '"></span>');
  return '<div class="eps-ctl">' + h + '</div>';
}

// ─── fixed axes: a bar keeps its length whatever index, date or level is shown ───
function domains() {
  if (DOM) return DOM;
  var z = function () { return { sector: [0, 0], ig: [0, 0], sec: [0, 0] }; }, d = { hero: [0, 0], p: z(), e: z() };
  function ext(a, lo, hi) { a[0] = Math.min(a[0], lo); a[1] = Math.max(a[1], hi); }
  ['spx', 'ndx'].forEach(function (ix) {
    for (var k1 = K0 + 1; k1 < E.dates.length; k1++) {
      var p = E.period(ix, K0, k1, BASE, null);
      ext(d.hero, Math.min(p.g, p.R - p.g, p.R), Math.max(p.g, p.R - p.g, p.R));
      LV.forEach(function (L) { E.group(p.rows, keyOf(L[0])).forEach(function (g) { ext(d.p[L[0]], g.cP, g.cP); ext(d.e[L[0]], g.cE, g.cE); }); });
    }
  });
  return (DOM = d);
}
// the whole index at the latest date fixes the row order of the detail table, so rows never move when something is excluded
function order(ix) { return ORD[ix] || (ORD[ix] = E.period(ix, K0, E.dates.length - 1, BASE, null)); }

// ─── 1 · return = EPS change × multiple change ────────────────────
// Not linked to the exclusions of the detail table (as in Index Analysis): always the whole index.
// One block per index: its boxes for the chosen period, then its chart with every period (the chosen one in bold).
function hero() {
  var kSel = S.hero.k1, out = {};
  ['spx', 'ndx'].forEach(function (ix) {
    var p = E.period(ix, K0, kSel, BASE, null), rows = [];
    var tiles = '<div class="eps-eq">' +
      '<div class="eps-eqt"><div class="k">' + Y + ' EPS</div><div class="v" style="color:' + col(p.g) + '">' + pc(p.g) + '</div><div class="s">index earnings, ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[kSel]) + '</div></div><div class="op">×</div>' +
      '<div class="eps-eqt"><div class="k">Forward P/E</div><div class="v" style="color:' + col(p.m) + '">' + pc(p.m) + '</div><div class="s">' + x1(p.pe0) + ' → ' + x1(p.pe1) + '</div></div><div class="op">=</div>' +
      '<div class="eps-eqt tot"><div class="k">Price return</div><div class="v" style="color:' + col(p.R) + '">' + pc(p.R) + '</div><div class="s">(1 ' + pc(p.g) + ') × (1 ' + pc(p.m) + ') − 1</div></div></div>';
    for (var k = K0 + 1; k < E.dates.length; k++) {
      var q = E.period(ix, K0, k, BASE, null);
      rows.push({ label: dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k]), a: q.g, b: q.R - q.g, net: q.R, bold: k === kSel,
        tip: '<b style="font-size:13px">' + IXN[ix] + ' · ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k]) + '</b><span class="tp">' + Y + ' EPS: ' + pc(q.g) + '<br>Forward P/E: ' + x1(q.pe0) + ' → ' + x1(q.pe1) + ' (' + pc(q.m) + ')<br><b>Price: ' + pc(q.R) + '</b> = (1 ' + pc(q.g) + ') × (1 ' + pc(q.m) + ') − 1<br>In the bars, the multiple part is the price return minus the EPS part (' + pc(q.R - q.g) + '), so it includes the small EPS × P/E interaction.</span>' });
    }
    out[ix] = { tiles: tiles, rows: rows };
  });
  return out;
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
  var c = S.detail, cur = per(c.ix, c.k1), ord = order(c.ix), byS = {}, byG = {}, byT = {}, igsOf = {};
  E.group(cur.rows, keyOf('sector')).forEach(function (o) { byS[o.key] = o; });
  E.group(cur.rows, keyOf('ig')).forEach(function (o) { byG[o.key] = o; });
  cur.rows.forEach(function (r) { byT[r.id] = r; });
  var aS = E.group(ord.rows, keyOf('sector')), aG = {}; E.group(ord.rows, keyOf('ig')).forEach(function (o) { aG[o.key] = o; });
  ord.rows.forEach(function (r) { var s = E.secs[r.id]; (igsOf[s.s] = igsOf[s.s] || {})[s.g] = 1; });
  var W = weightMaps(c), sk = S.sort, body = '';
  function val(o) { var v = sk === 'w' ? o.w0 : o[sk]; return v == null ? -1e9 : v; }
  function by(a, b) { return S.dir * (val(a) - val(b)); }       // dir -1 = largest first
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
  body += '<tr class="eps-tot"><td></td><td></td><td class="nm">Total</td><td class="num">100.00% → 100.00%</td><td class="num">' + cP(cur.g) + '</td><td class="num">' + cP(cur.m) + '</td><td class="num">' + cP(cur.R) + '</td><td class="num">' + cc(cur.g) + '</td><td class="num">' + cc(cur.R - cur.g) + '</td><td class="num">' + cc(cur.R) + '</td></tr>';
  function th(k, label) { return '<th class="num' + (S.sort === k ? ' on' : '') + '" data-act="sort" data-v="' + k + '">' + label + (S.sort === k ? (S.dir < 0 ? ' ▼' : ' ▲') : '') + '</th>'; }
  return '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click a row to take it out of the index (sector, industry group or security). Every section recalculates and the rest rescale to 100%.' +
    '</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand All</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse All</button><button class="sb-tbtn" data-act="reset">Reset</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change</th><th colspan="3" class="grp">Contribution to the ' + IXN[c.ix] + ' return (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry Group</th>' +
    th('w', 'Weight, start → end') + th('g', Y + ' EPS') + th('m', 'Forward P/E') + th('ret', 'Price') + th('cE', 'From EPS') + th('cM', 'From multiple') + th('cP', 'Total') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note"><b>Its own change</b>: the group as one block, so (1 + EPS) × (1 + P/E) = 1 + Price on every row. <b>Total</b> = its weight × its price return, so the rows add up to the index return. <b>From EPS</b> = its part of the index EPS change; <b>From multiple</b> = Total − From EPS.</div>' +
    '<div class="eps-note"><b>Aggregate or weighted average?</b> The index EPS change shown, ' + cP(cur.g) + ', is the aggregate: the change in the index\'s total earnings (shares of each company the index holds × its EPS), loss-making companies included at their negative EPS. A weighted average of each stock\'s own EPS change would give ' + cP(cur.wAvgG) + '; it leaves out stocks that start with negative EPS, because a % change from a negative number means nothing. The aggregate is the one that fits the index P/E.</div></div>';
}

// ─── 3 · who moved the index: one measure at a time ───────────────
// Price return: how many points of the index return each name added (its weight × its own return).
// EPS change: how many points of the index EPS change each name added (its share of index earnings × its own EPS change).
function who() {
  var c = S.who, p = per(c.ix, c.k1), lvl = c.lvl, price = c.meas === 'p', key = price ? 'cP' : 'cE', total = price ? p.R : p.g, note = '';
  var gs = E.group(p.rows, keyOf(lvl)).sort(function (a, b) { return b[key] - a[key]; });
  var n = c.n === 0 ? gs.length : Math.min(c.n, gs.length), top = gs.slice(0, n), bot = gs.slice(Math.max(n, gs.length - n));
  var pick = c.side === 'pos' ? top : c.side === 'neg' ? gs.slice(gs.length - n).reverse() : top.concat(bot.slice().reverse());
  var rows = pick.map(function (g) {
    var nm = nameOf(g.key, lvl), share = Math.abs(total) >= 0.05 ? ' (' + (g[key] / total * 100).toFixed(0) + '% of the ' + pc(total) + ')' : '';
    return { label: trunc(nm, 42), v: g[key],
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span class="tp">' + (price
        ? 'Weight at the start: ' + (g.w0 * 100).toFixed(2) + '%<br>Its price return: ' + pc(g.ret) + '<br><b>Added ' + pp(g.cP, 2) + ' pp to the index return</b>' + share + '<br>= weight × price return'
        : 'Share of the index\'s earnings at the start: ' + (g.rows.reduce(function (s, r) { return s + (r.esh || 0); }, 0) * 100).toFixed(2) + '%<br>Its ' + Y + ' EPS change: ' + pc(g.g) + '<br><b>Added ' + pp(g.cE, 2) + ' pp to the index EPS change</b>' + share + '<br>= its share of index earnings × its EPS change') + '</span>' };
  });
  var sum = pick.reduce(function (s, g) { return s + g[key]; }, 0);
  if (n < gs.length) note = 'The ' + rows.length + ' shown add up to ' + pp(sum, 2) + ' pp of the ' + pp(total, 1) + ' total, out of ' + gs.length + ' ' + (lvl === 'sec' ? 'stocks' : lvl === 'ig' ? 'industry groups' : 'sectors') + '.';
  return { rows: rows, note: note, p: p, price: price, total: total, dom: domains()[price ? 'p' : 'e'][lvl] };
}

// ─── 5 · concentration ────────────────────────────────────────────
// Not linked to the exclusions. Two questions, one number each per date:
//  - size: what share of the index's value (weight) the N largest companies hold;
//  - earnings: what share of the index's total earnings the N companies that contribute the most earnings hold
//    (earnings = shares the index holds × EPS, so a company counts by the dollars it earns for the index, not by EPS per share).
function concBlock() {
  var c = S.conc, n = c.n === 0 ? 1000 : c.n, N = c.n === 0 ? 'All' : c.n, last = E.dates.length - 1;
  var q = E.dates.map(function (d, k) { return E.concentration(c.ix, k, BASE, null, n); });
  var tb = E.dates.map(function (d, k) {
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + (q[k].w10byW * 100).toFixed(1) + '%</td><td class="num">' + (q[k].e10byE * 100).toFixed(1) + '%</td></tr>'; }).join('');
  var who = c.n === 0 ? 'all companies' : 'the ' + c.n + ' largest companies', earn = c.n === 0 ? 'all companies' : 'the ' + c.n + ' companies that earn the most';
  return { labels: E.dates.map(dShort),
    msg: 'On ' + dLong(E.dates[last]) + ', ' + who + ' hold <b>' + (q[last].w10byW * 100).toFixed(1) + '%</b> of the ' + IXN[c.ix] + ' value, and ' + earn + ' produce <b>' + (q[last].e10byE * 100).toFixed(1) + '%</b> of its earnings.',
    series: [
      { name: 'Value held by the ' + (c.n === 0 ? 'all' : c.n) + ' largest companies', color: C.price, vals: q.map(function (r) { return r.w10byW * 100; }) },
      { name: 'Earnings produced by the ' + (c.n === 0 ? 'all' : c.n) + ' biggest earners', color: C.eps, vals: q.map(function (r) { return r.e10byE * 100; }) }],
    table: c.table ? '<div class="eps-tw"><table class="rt eps-t3" style="max-width:640px"><thead><tr><th>' + IXN[c.ix] + '</th><th class="num">Value held by the ' + N + ' largest</th><th class="num">Earnings of the ' + N + ' biggest earners</th></tr></thead><tbody>' + tb + '</tbody></table></div>' : '' };
}

// ─── 6 · data & method (short) ────────────────────────────────────
function buildTable(c) {
  var LEVEL = 1000, m = E.members(c.ix, K0, null).filter(function (x) { return x.px > 0 && x['e' + (BASE === 'cy27' ? '27' : '26')] != null; }), tw = m.reduce(function (s, x) { return s + x.w; }, 0), rows = [], tot = 0;
  m.forEach(function (x) { var w = x.w / tw, q = LEVEL * w / x.px, e = x.e27; rows.push({ id: x.id, w: w, px: x.px, q: q, eps: e, earn: q * e }); tot += q * e; });
  rows.sort(function (a, b) { return b.w - a.w; });
  var top = rows.slice(0, 6), restE = tot - top.reduce(function (s, r) { return s + r.earn; }, 0), restW = 1 - top.reduce(function (s, r) { return s + r.w; }, 0);
  return '<details class="eps-det"><summary>Worked example: the earnings of the ' + IXN[c.ix] + ' on ' + dLong(E.dates[K0]) + ', as an index of 1,000 points</summary>' +
    '<div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>Company</th><th class="num">Weight</th><th class="num">Price</th><th class="num">Shares the index holds<br>= 1,000 × weight ÷ price</th><th class="num">' + Y + ' EPS</th><th class="num">Earnings it brings<br>= shares × EPS</th></tr></thead><tbody>' +
    top.map(function (r) { var s = E.secs[r.id]; return '<tr><td><b>' + esc(s.t) + '</b> ' + esc(short(s.n)) + '</td><td class="num">' + (r.w * 100).toFixed(2) + '%</td><td class="num">' + r.px.toFixed(2) + '</td><td class="num">' + r.q.toFixed(3) + '</td><td class="num">' + r.eps.toFixed(2) + '</td><td class="num">' + r.earn.toFixed(2) + '</td></tr>'; }).join('') +
    '<tr><td style="color:var(--mu)">All other ' + (rows.length - top.length) + ' companies</td><td class="num">' + (restW * 100).toFixed(2) + '%</td><td></td><td></td><td></td><td class="num">' + restE.toFixed(2) + '</td></tr>' +
    '<tr class="eps-tot"><td class="nm">Index</td><td class="num">100%</td><td class="num">1,000</td><td></td><td></td><td class="num">' + tot.toFixed(2) + '</td></tr></tbody></table></div>' +
    '<div class="eps-note">Forward P/E of the index = 1,000 ÷ ' + tot.toFixed(2) + ' = ' + (LEVEL / tot).toFixed(1) + 'x. The index EPS change is how much that total earnings number moves between two dates, with the same shares held. Companies with negative EPS subtract.</div></details>';
}
function dataBlock() {
  var c = S.data, p = E.period(c.ix, K0, c.k1, BASE, null), skW = p.skipped.reduce(function (s, x) { return s + x.w0; }, 0), ixn = IXN[c.ix];
  var why = { 'no price at the end date': 'Left the index, no later price', 'no EPS estimate at the start': 'No ' + Y + ' estimate in the file', 'no EPS estimate at the end': 'No ' + Y + ' estimate in the file' };
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td>' + (why[s.why] || s.why) + '</td></tr>'; }).join('');
  var fx = E.secs.filter(function (s) { return s.c; }).map(function (s) { return s.t + ' (' + s.c + ')'; }).join(', ');
  // the example that answers "why aggregate and not a weighted average": the name that adds the most EPS
  var big = p.rows.slice().sort(function (a, b) { return b.cE - a.cE; })[0], bs = E.secs[big.id];
  var steps = [
    ['1', 'Basket', 'The stocks the ' + ixn + ' held on ' + dLong(E.dates[K0]) + ', at the weights of that day. They are followed to the end date.'],
    ['2', 'Index earnings', 'For each company: shares the index holds × its ' + Y + ' EPS. Add them up. That total is what the index earns.'],
    ['3', 'EPS change', 'The same total on the end date, with the same shares. Its % change is the index EPS change.'],
    ['4', 'Forward P/E', 'Index price ÷ index earnings. Its % change is the P/E change.'],
    ['5', 'Return', '(1 + EPS change) × (1 + P/E change) − 1 = the price return.']
  ];
  return '<div class="eps-h2" style="margin-top:0">What it measures</div>' +
    '<p class="eps-p">How much of the ' + ixn + ' move since ' + dLong(E.dates[K0]) + ' came from analysts raising or cutting the ' + Y + ' EPS estimates, and how much from the multiple the market pays for them. EPS is Bloomberg consensus, calendarised to December. A missing estimate takes the first one available later.</p>' +
    '<div class="eps-h2">The calculation</div><table class="rt eps-t3 eps-defs"><tbody>' + steps.map(function (d) { return '<tr><td class="nm">' + d[0] + '. ' + d[1] + '</td><td>' + d[2] + '</td></tr>'; }).join('') + '</tbody></table>' + buildTable(c) +
    '<div class="eps-h2">Why the aggregate and not an average of growth rates</div>' +
    '<p class="eps-p">The index price is the price of everything it holds, so it is explained by the total earnings it holds. A company counts by the earnings it brings in, not by its weight: <b>' + esc(bs.t) + '</b> is ' + (big.w0 * 100).toFixed(1) + '% of the ' + ixn + ' by weight but ' + (big.esh * 100).toFixed(1) + '% of its earnings, so a change in its EPS moves the index EPS about ' + (big.esh / big.w0).toFixed(0) + ' times more than its weight suggests. An average of growth rates weighted by index weight would miss that, and it also cannot include companies that start with negative EPS. The aggregate is the only one that multiplies with the P/E to give the price.</p>' +
    '<div class="eps-h2">What each bar means</div>' +
    '<p class="eps-p"><b>Price return contribution</b> = weight × the company\'s own price return; all of them add up to the index return. <b>EPS change contribution</b> = its share of the index earnings × its own EPS change; all of them add up to the index EPS change. Both are in percentage points (pp) of that total.</p>' +
    '<details class="eps-det"><summary>' + p.skipped.length + ' of ' + p.nStart + ' stocks are not counted (' + (skW * 100).toFixed(1) + '% of the weight)</summary><div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th>Why</th></tr></thead><tbody>' + (out || '<tr><td colspan="4">None.</td></tr>') + '</tbody></table></div></details>' +
    '<div class="eps-h2">Caveats</div><ul class="eps-ul">' +
    '<li>Removed by decision: FDX, Mobility Global (MBGL), MMED. BRK/B EPS is divided by 1,500: the file carries the Class A EPS and one Class A is 1,500 Class B.</li>' +
    '<li>EPS is GAAP (Bloomberg IS_COMP_EPS_GAAP): GOOGL and AMZN carry investment marks. Take them out in the table to see the effect.</li>' +
    '<li>No currency conversion for ' + esc(fx) + '.</li>' +
    '<li>Source: ' + esc(E.D.source) + '.</li></ul>';
}

// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  var hb = function (ix) { return '<div class="eps-hb"><div class="eps-eqn">' + IXN[ix] + '</div><div id="eps-h-' + ix + '"></div><div id="eps-hc-' + ix + '"></div></div>'; };
  root.innerHTML =
    sec('eps-s1', 'Return = EPS change × multiple change', '<div id="eps-c1"></div><div class="card">' + hb('spx') + hb('ndx') + '</div>') +
    sec('eps-s2', 'Attribution detail & simulation', '<div id="eps-c2"></div><div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '<div id="eps-c3"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t3"></div><div id="eps-who"></div><div class="eps-note" id="eps-who-n"></div></div>') +
    sec('eps-s5', 'Concentration', '<div id="eps-c5"></div><div class="card"><div class="eps-msg" id="eps-cm"></div><div id="eps-cc"></div><div style="margin-top:8px"><button class="ndx-tab-btn" data-act="ctable" id="eps-ctb"></button></div><div id="eps-conc"></div></div>') +
    sec('eps-s6', 'Data & method', '<div id="eps-c6"></div><div class="card" id="eps-data"></div>');
}
function render() {
  var set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }, d = domains();
  var h = hero();
  set('eps-c1', ctl('hero', ['to'])); set('eps-s1-n', 'whole index, not affected by the exclusions below · from ' + dShort(E.dates[K0]) + ' · ' + Y + ' EPS');
  ['spx', 'ndx'].forEach(function (ix) {
    set('eps-h-' + ix, h[ix].tiles);
    divStack(document.getElementById('eps-hc-' + ix), h[ix].rows, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, domain: d.hero, unit: '%', axisTitle: 'return since ' + dShort(E.dates[K0]), netTitle: 'Price return', labA: Y + ' EPS change', labB: 'Forward P/E change (with the interaction)', diaLabel: 'Price return' });
  });
  set('eps-c2', ctl('detail', ['ix', 'to'])); set('eps-s2-n', ctxLine(IXN[S.detail.ix], S.detail.k1)); set('eps-detail', detail());
  var cw = S.who; set('eps-c3', ctl('who', ['ix', 'to', 'meas', 'lvl', 'side', 'n'])); set('eps-s3-n', ctxLine(IXN[cw.ix], cw.k1));
  var w = who();
  set('eps-t3', w.price
    ? 'The ' + IXN[cw.ix] + ' returned ' + pc(w.total) + '. Each bar is how many percentage points of that return a ' + (cw.lvl === 'sec' ? 'stock' : cw.lvl === 'ig' ? 'group' : 'sector') + ' added (its weight × its own return).'
    : 'The ' + IXN[cw.ix] + '\'s ' + Y + ' EPS rose ' + pc(w.total) + '. Each bar is how many percentage points of that rise a ' + (cw.lvl === 'sec' ? 'stock' : cw.lvl === 'ig' ? 'group' : 'sector') + ' added (its share of the index earnings × its own EPS change).');
  barList(document.getElementById('eps-who'), w.rows, { pos: C.pos, neg: C.neg, domain: w.dom, axisTitle: 'percentage points of the ' + (w.price ? 'index return' : 'index EPS change'), total: { label: 'Total, all ' + w.p.n + ' stocks', v: w.total } });
  set('eps-who-n', w.note);
  set('eps-c5', ctl('conc', ['ix', 'n'])); set('eps-s5-n', 'whole index, not affected by the exclusions · all snapshots · ' + Y + ' EPS');
  var cb = concBlock();
  set('eps-cm', cb.msg);
  lineChart(document.getElementById('eps-cc'), cb.labels, cb.series, function (v) { return v.toFixed(0) + '%'; }, { vw: 900, h: 260, dom: [0, 100], ticks: [0, 20, 40, 60, 80, 100], endFmt: function (v) { return v.toFixed(1) + '%'; } });
  set('eps-ctb', S.conc.table ? 'Hide table' : 'Show table'); set('eps-conc', cb.table);
  set('eps-c6', ctl('data', ['ix', 'to'])); set('eps-s6-n', IXN[S.data.ix] + ' · ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[S.data.k1])); set('eps-data', dataBlock());
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
    var id = el.getAttribute('data-id'), f = el.getAttribute('data-f'), val = el.tagName === 'INPUT' ? el.value : v;
    if (f === 'k1' || f === 'n') { val = Math.max(0, Math.round(+val)); if (f === 'n' && el.tagName === 'INPUT' && !val) return; }
    S[id][f] = val;
  }
  else if (act === 'tog') toggle(v);
  else if (act === 'unex') delete S.excl[v];
  else if (act === 'ctable') S.conc.table = !S.conc.table;
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
    root.addEventListener('click', function (e) { var t = e.target.closest('[data-act]'); if (!t || t.tagName === 'INPUT') return; e.preventDefault(); onAct(t); });
    root.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'INPUT' && t.getAttribute('data-act')) onAct(t); });
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
