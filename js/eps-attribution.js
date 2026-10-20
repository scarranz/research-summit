// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into the change in forward EPS (CY2027) and the change in the forward multiple,
// from the base date (Jan 2, 2026) to each later snapshot, by sector / industry group / security.
// Controls copy Index Analysis (S&P / Nasdaq toggle, period buttons, Top 5 / 10 / 20 / All + a typed number);
// only the exclusions (clicked in the detail table) are shared, so a removed group is out everywhere.
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine } from './eps-engine.js';
import { divStack, lineChart, barList, stackBars, ppTxt } from './eps-charts.js';

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
    hero: { k1: last }, detail: { ix: 'spx', k1: last }, who: { ix: 'spx', k1: last, lvl: 'sec', n: 10, side: 'pos', meas: 'e' },
    est: { t: 'MU' }, conc: { ix: 'spx', n: 10, table: false }, data: { ix: 'spx', k1: last } };
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
  if (parts.indexOf('meas') >= 0) blk('What to show', pills(a('meas'), [['e', 'EPS effect (pp)'], ['p', 'Price return (pp)'], ['g', 'Own EPS change (%)']], c.meas));
  if (parts.indexOf('side') >= 0) blk('Show', pills(a('side'), [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']], c.side));
  if (parts.indexOf('n') >= 0 || parts.indexOf('n2') >= 0) blk('How many', '<span class="eps-pl" style="flex-wrap:nowrap">' + [[5, 'Top 5'], [10, 'Top 10'], [20, 'Top 20']].concat(parts.indexOf('n') >= 0 ? [[0, 'All']] : []).map(function (o) {
    return '<button class="ndx-tab-btn' + (o[0] === c.n ? ' active' : '') + '" ' + a('n') + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') +
    '<input type="number" min="1" max="500" placeholder="Custom" ' + a('n') + ' value="' + ([5, 10, 20, 0].indexOf(c.n) < 0 ? c.n : '') + '"></span>');
  return '<div class="eps-ctl">' + h + '</div>';
}

// ─── fixed axes: a bar keeps its length whatever index, date or level is shown ───
function domains() {
  if (DOM) return DOM;
  var z = function () { return { sector: [0, 0], ig: [0, 0], sec: [0, 0] }; }, d = { hero: [0, 0], p: z(), e: z(), g: z() };
  function ext(a, lo, hi) { a[0] = Math.min(a[0], lo); a[1] = Math.max(a[1], hi); }
  ['spx', 'ndx'].forEach(function (ix) {
    for (var k1 = K0 + 1; k1 < E.dates.length; k1++) {
      var p = E.period(ix, K0, k1, BASE, null);
      ext(d.hero, Math.min(p.G, p.M, p.R), Math.max(p.G, p.M, p.R));
      LV.forEach(function (L) { E.group(p.rows, keyOf(L[0])).forEach(function (g) { ext(d.p[L[0]], g.cP, g.cP); ext(d.e[L[0]], g.cE, g.cE); if (g.g != null) ext(d.g[L[0]], g.g, g.g); }); });
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
      '<div class="eps-eqt"><div class="k">EPS effect</div><div class="v" style="color:' + col(p.G) + '">' + pp(p.G, 1) + ' pp</div><div class="s">' + Y + ' EPS estimates: Σ weight × own EPS change</div></div><div class="op">+</div>' +
      '<div class="eps-eqt"><div class="k">Multiple effect</div><div class="v" style="color:' + col(p.M) + '">' + pp(p.M, 1) + ' pp</div><div class="s">the rest of the price move · forward P/E ' + x1(p.pe0) + ' → ' + x1(p.pe1) + '</div></div><div class="op">=</div>' +
      '<div class="eps-eqt tot"><div class="k">Price return</div><div class="v" style="color:' + col(p.R) + '">' + pc(p.R) + '</div><div class="s">' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[kSel]) + ' · Σ weight × own price return</div></div></div>';
    for (var k = K0 + 1; k < E.dates.length; k++) {
      var q = E.period(ix, K0, k, BASE, null);
      rows.push({ label: dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k]), a: q.G, b: q.M, net: q.R, bold: k === kSel,
        tip: '<b style="font-size:13px">' + IXN[ix] + ' · ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[k]) + '</b><span class="tp">EPS effect: ' + pp(q.G, 1) + ' pp (each stock\'s weight × its ' + Y + ' EPS change, added up)<br>Multiple effect: ' + pp(q.M, 1) + ' pp (the rest)<br><b>Price return: ' + pc(q.R) + '</b><br>Forward P/E of the index: ' + x1(q.pe0) + ' → ' + x1(q.pe1) + '</span>' });
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
function naCells(w0, why) {
  return '<td class="num" style="color:var(--mu);font-size:11px">' + (w0 * 100).toFixed(2) + '% → —</td><td class="num" colspan="6" style="color:var(--mu);font-size:11px;text-align:center">n/a · ' + why + ' · counted as 0 pp</td>';
}
function whyTxt(w) { return w === 'no price at the end date' ? 'left the index, no end price' : 'no ' + Y + ' estimate in the file'; }
function detail() {
  var c = S.detail, cur = per(c.ix, c.k1), ord = order(c.ix), byS = {}, byG = {}, byT = {}, naT = {}, ordT = {}, oS = {}, oG = {}, igsOf = {}, idsOf = {};
  E.group(cur.rows, keyOf('sector')).forEach(function (o) { byS[o.key] = o; });
  E.group(cur.rows, keyOf('ig')).forEach(function (o) { byG[o.key] = o; });
  cur.rows.forEach(function (r) { byT[r.id] = r; });
  cur.skipped.forEach(function (x) { naT[x.id] = x; });
  ord.rows.forEach(function (r) { ordT[r.id] = r; });
  E.group(ord.rows, keyOf('sector')).forEach(function (o) { oS[o.key] = o; });
  E.group(ord.rows, keyOf('ig')).forEach(function (o) { oG[o.key] = o; });
  // every stock the index held at the start is listed, with or without data
  E.members(c.ix, K0, null).forEach(function (m) { var s = E.secs[m.id]; (igsOf[s.s] = igsOf[s.s] || {})[s.g] = 1; (idsOf[s.g] = idsOf[s.g] || []).push({ id: m.id, w0: m.w }); });
  var W = weightMaps(c), sk = S.sort, body = '';
  function val(o) { var v = sk === 'w' ? o.w0 : o[sk]; return v == null ? -1e9 : v; }
  function by(a, b) { return S.dir * (val(a) - val(b)); }       // dir -1 = largest first
  function anyEx(pred) { return E.secs.some(function (s) { return pred(s) && (S.excl['S|' + s.s] || S.excl['G|' + s.g] || S.excl['T|' + s.t]); }); }
  Object.keys(igsOf).map(function (k) { return oS[k] || { key: k }; }).sort(by).forEach(function (so) {
    var sname = so.key, offS = !!S.excl['S|' + sname], open = !!S.open['S|' + sname];
    var state = offS ? 'off' : anyEx(function (s) { return s.s === sname; }) ? 'part' : 'on';
    body += '<tr class="eps-r1' + (offS ? ' off' : '') + '" data-act="tog" data-v="S|' + esc(sname) + '"><td class="c">' + selDot(state) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="S|' + esc(sname) + '">' + (open ? '▲' : '▼') + '</span></td>' +
      '<td class="nm">' + esc(sname) + '</td>' + rowCells(byS[sname], W, sname, offS) + '</tr>';
    if (!open) return;
    Object.keys(igsOf[sname]).map(function (g) { return oG[g] || { key: g }; }).sort(by).forEach(function (go) {
      var gname = go.key, offG = offS || !!S.excl['G|' + gname], gopen = !!S.open['G|' + gname];
      var gstate = offG ? 'off' : anyEx(function (s) { return s.g === gname; }) ? 'part' : 'on';
      body += '<tr class="eps-r2' + (offG ? ' off' : '') + '" data-act="tog" data-v="G|' + esc(gname) + '"><td class="c" style="padding-left:12px">' + selDot(gstate) + '</td><td class="c"><span class="eps-arr" data-act="open" data-v="G|' + esc(gname) + '">' + (gopen ? '▲' : '▼') + '</span></td>' +
        '<td class="nm" style="padding-left:22px">' + esc(gname) + '</td>' + rowCells(byG[gname], W, gname, offG) + '</tr>';
      if (!gopen) return;
      idsOf[gname].map(function (x) { return ordT[x.id] || { id: x.id, w0: x.w0 }; }).sort(by).forEach(function (ro) {
        var s = E.secs[ro.id], offT = offG || !!S.excl['T|' + s.t], o = byT[ro.id];
        var cells = offT ? rowCells(null, W, ro.id, true) : o ? rowCells(o, W, ro.id, false) : naCells(W.w0[ro.id] || ro.w0, whyTxt(naT[ro.id] ? naT[ro.id].why : ''));
        body += '<tr class="eps-r3' + (offT ? ' off' : '') + '" data-act="tog" data-v="T|' + esc(s.t) + '"><td class="c" style="padding-left:24px">' + dot(!offT, 12) + '</td><td></td>' +
          '<td class="nm" style="padding-left:38px"><b>' + esc(s.t) + '</b> <span style="color:var(--mu)">' + esc(short(s.n)) + '</span></td>' + cells + '</tr>';
      });
    });
  });
  var cw = cur.covW || 1, gT = cur.G / cw, rT = cur.R / cw, mT = (1 + rT) / (1 + gT) - 1, skW = cur.skipped.reduce(function (s, x) { return s + x.w0; }, 0);
  body += '<tr class="eps-tot"><td></td><td></td><td class="nm">Total, ' + cur.nStart + ' stocks</td><td class="num">100.00% → 100.00%</td><td class="num">' + cP(gT) + '</td><td class="num">' + cP(mT) + '</td><td class="num">' + cP(rT) + '</td><td class="num">' + cc(cur.G) + '</td><td class="num">' + cc(cur.M) + '</td><td class="num">' + cc(cur.R) + '</td></tr>';
  function th(k, label) { return '<th class="num' + (S.sort === k ? ' on' : '') + '" data-act="sort" data-v="' + k + '">' + label + (S.sort === k ? (S.dir < 0 ? ' ▼' : ' ▲') : '') + '</th>'; }
  return '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click a row to take it out of the index (sector, industry group or security). Every section below recalculates and the rest rescale to 100%.' +
    '</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand All</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse All</button><button class="sb-tbtn" data-act="reset">Reset</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change (weighted average for groups)</th><th colspan="3" class="grp">Contribution to the ' + IXN[c.ix] + ' return (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry Group</th>' +
    th('w', 'Weight, start → end') + th('g', Y + ' EPS') + th('m', 'Forward P/E') + th('ret', 'Price') + th('cE', 'From EPS') + th('cM', 'From multiple') + th('cP', 'Total') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note"><b>Total</b> = weight × price return; the rows add up to the index return. <b>From EPS</b> = weight × its ' + Y + ' EPS change. <b>From multiple</b> = Total − From EPS (what the P/E did on top of the EPS change). A sector or group is the sum of its stocks.</div>' +
    '<div class="eps-note">All ' + cur.nStart + ' stocks of the ' + IXN[c.ix] + ' on ' + dShort(E.dates[K0]) + ' are in the table. ' + (cur.skipped.length ? cur.skipped.length + ' have no figures on ' + dShort(E.dates[c.k1]) + ' (' + (skW * 100).toFixed(1) + '% of the weight): they left the index or have no ' + Y + ' estimate, and are counted as 0 pp. ' : '') + 'A stock with a negative EPS at the start has no % EPS change: its EPS effect is 0 and its whole price move shows as multiple.</div></div>';
}

// ─── 3 · who moved the index: one measure at a time ───────────────
// EPS effect: pp of the index return each name added through its EPS estimate (weight × its EPS change).
// Price return: pp each name added in total (weight × its price return).
// Own EPS change: the stock's own % change, whatever its weight (finds the big revisions on small names).
function who() {
  var c = S.who, p = per(c.ix, c.k1), lvl = c.lvl, m = c.meas, key = m === 'e' ? 'cE' : m === 'p' ? 'cP' : 'g', total = m === 'e' ? p.G : m === 'p' ? p.R : null, note = '';
  var gs = E.group(p.rows, keyOf(lvl)).filter(function (g) { return g[key] != null; }).sort(function (a, b) { return b[key] - a[key]; });
  var n = c.n === 0 ? gs.length : Math.min(c.n, gs.length), top = gs.slice(0, n), bot = gs.slice(Math.max(n, gs.length - n));
  var pick = c.side === 'pos' ? top : c.side === 'neg' ? gs.slice(gs.length - n).reverse() : top.concat(bot.slice().reverse());
  function b(sel, t) { return sel ? '<b>' + t + '</b>' : t; }
  var rows = pick.map(function (g) {
    var nm = nameOf(g.key, lvl), share = m !== 'g' && Math.abs(total) >= 0.05 ? ' (' + (g[key] / total * 100).toFixed(0) + '% of the ' + (m === 'e' ? pp(total, 1) + ' pp' : pc(total)) + ')' : '';
    return { label: trunc(nm, 42), v: g[key],
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span class="tp">Weight at the start: ' + (g.w0 * 100).toFixed(2) + '%<br>' +
        b(m === 'g', 'Its ' + Y + ' EPS estimate: ' + pc(g.g)) + '<br>Its price return: ' + pc(g.ret) + '<br>' +
        b(m === 'e', 'EPS effect: ' + pp(g.cE, 2) + ' pp = weight × EPS change' + (m === 'e' ? share : '')) + '<br>Multiple effect: ' + pp(g.cM, 2) + ' pp<br>' +
        b(m === 'p', 'Price: ' + pp(g.cP, 2) + ' pp = weight × price return' + (m === 'p' ? share : '')) + '</span>' };
  });
  var sum = pick.reduce(function (s, g) { return s + g[key]; }, 0);
  if (m === 'g') note = 'Ranked by each ' + (lvl === 'sec' ? 'stock' : 'group') + '\'s own estimate change, whatever its weight: a small company can lead. Hover for its weight and what it added to the index.';
  else if (n < gs.length) note = 'The ' + rows.length + ' shown add up to ' + pp(sum, 2) + ' pp of the ' + pp(total, 1) + ' ' + (m === 'e' ? 'EPS effect' : 'total') + ', out of ' + gs.length + ' ' + (lvl === 'sec' ? 'stocks' : lvl === 'ig' ? 'industry groups' : 'sectors') + '.';
  return { rows: rows, note: note, p: p, m: m, total: total, dom: domains()[m][lvl] };
}

// ─── 4 · one stock: how its EPS estimate moved ────────────────────
function niceAxis(lo, hi) {
  var raw = (hi - lo) / 5 || 1, pw = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / pw, st = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pw, a = Math.floor(lo / st) * st, z = Math.ceil(hi / st) * st, t = [];
  for (var v = a; v <= z + st / 1e6; v += st) t.push(Math.round(v / st * 1e6) / 1e6 * st);
  return { dom: [a, z], ticks: t };
}
function money(v) { return v == null ? '—' : (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
function estBlock() {
  var t = S.est.t, id = E.secs.findIndex(function (s) { return s.t === t; }), s = E.secs[id];
  var pts = E.dates.map(function (d, k) { var r = E.D.snaps[k].find(function (x) { return x[0] === id; }); return r ? { eps: r[5], px: r[3], ws: r[1], wn: r[2] } : null; });
  var vals = pts.map(function (p) { return p ? p.eps : null; }), real = vals.filter(function (v) { return v != null; });
  var ax = niceAxis(Math.min(0, Math.min.apply(null, real)), Math.max.apply(null, real) * 1.08), base = pts[K0] ? pts[K0].eps : null, last = pts[pts.length - 1];
  var chg = function (v) { return base > 0 && v != null ? v / base - 1 : null; };
  var ccy = s.c ? ' (' + s.c + ')' : '';
  var rowsT = E.dates.map(function (d, k) {
    var p = pts[k]; if (!p) return '<tr><td>' + dLong(d) + '</td><td class="num" colspan="5" style="color:var(--mu)">not in the file</td></tr>';
    return '<tr' + (k === K0 ? ' class="on"' : '') + '><td>' + dLong(d) + (k === K0 ? ' (base)' : '') + '</td><td class="num">' + money(p.eps) + '</td><td class="num">' + (k > K0 ? cP(chg(p.eps)) : '—') + '</td><td class="num">' + money(p.px) + '</td><td class="num">' + (p.eps > 0 ? x1(p.px / p.eps) : '—') + '</td><td class="num">' + (p.ws > 0 ? (p.ws).toFixed(2) + '%' : '—') + ' / ' + (p.wn > 0 ? (p.wn).toFixed(2) + '%' : '—') + '</td></tr>';
  }).join('');
  var dl = E.secs.map(function (x) { return '<option value="' + esc(x.t) + '">' + esc(short(x.n)) + '</option>'; }).join('');
  return { ctl: '<div class="eps-ctl"><div><div class="eps-lbl">Stock (type a ticker)</div><input type="text" list="eps-dl" value="' + esc(t) + '" data-act="est" autocomplete="off" spellcheck="false"><datalist id="eps-dl">' + dl + '</datalist></div></div>',
    msg: '<b>' + esc(s.t) + '</b> · ' + esc(s.n) + ' · ' + esc(s.s) + '. Its ' + Y + ' EPS estimate' + ccy + (base != null && last && last.eps != null ? ' went from <b>' + money(base) + '</b> on ' + dLong(E.dates[K0]) + ' to <b>' + money(last.eps) + '</b> on ' + dLong(E.dates[E.dates.length - 1]) + ' (' + cP(chg(last.eps)) + ').' : '.'),
    labels: E.dates.map(dShort), series: [{ name: Y + ' EPS estimate', color: C.eps, vals: vals }], dom: ax.dom, ticks: ax.ticks, base: base, chg: chg,
    table: '<div class="eps-tw"><table class="rt eps-t3 eps-t2" style="max-width:760px"><thead><tr><th>Date</th><th class="num">' + Y + ' EPS</th><th class="num">vs ' + dShort(E.dates[K0]) + '</th><th class="num">Price</th><th class="num">Forward P/E</th><th class="num">Weight S&amp;P / Nasdaq-100</th></tr></thead><tbody>' + rowsT + '</tbody></table></div>' };
}

// ─── 5 · concentration ────────────────────────────────────────────
// Not linked to the exclusions. Two questions, one 100% bar per date for each:
//  - value: what share of the index's weight the N largest companies hold;
//  - earnings: what share of the index's earnings the N companies that earn the most produce
//    (a company's earnings inside the index = its weight ÷ its forward P/E).
function concBlock() {
  var c = S.conc, n = c.n, last = E.dates.length - 1;
  var q = E.dates.map(function (d, k) { return E.concentration(c.ix, k, BASE, null, n); });
  var tb = E.dates.map(function (d, k) {
    return '<tr><td>' + dLong(d) + '</td><td class="num">' + (q[k].w10byW * 100).toFixed(1) + '%</td><td class="num">' + (q[k].e10byE * 100).toFixed(1) + '%</td></tr>'; }).join('');
  function rows(f, what) {
    return E.dates.map(function (d, k) { return { label: dShort(d), v: q[k][f], bold: k === last,
      tip: '<b style="font-size:13px">' + dLong(d) + '</b><span class="tp">' + what(q[k][f]) + '</span>' }; });
  }
  return { n: n,
    msg: 'On ' + dLong(E.dates[last]) + ', the ' + n + ' largest companies hold <b>' + (q[last].w10byW * 100).toFixed(1) + '%</b> of the ' + IXN[c.ix] + ' value, and the ' + n + ' companies that earn the most produce <b>' + (q[last].e10byE * 100).toFixed(1) + '%</b> of its earnings.',
    value: rows('w10byW', function (v) { return 'The ' + n + ' largest companies hold ' + (v * 100).toFixed(1) + '% of the ' + IXN[c.ix] + ' value; the other companies hold ' + ((1 - v) * 100).toFixed(1) + '%.'; }),
    earn: rows('e10byE', function (v) { return 'The ' + n + ' companies that earn the most produce ' + (v * 100).toFixed(1) + '% of the index earnings (' + Y + '); all the others, ' + ((1 - v) * 100).toFixed(1) + '%.'; }),
    table: c.table ? '<div class="eps-tw"><table class="rt eps-t3" style="max-width:640px"><thead><tr><th>' + IXN[c.ix] + '</th><th class="num">Value held by the ' + n + ' largest</th><th class="num">Earnings of the ' + n + ' biggest earners</th></tr></thead><tbody>' + tb + '</tbody></table></div>' : '' };
}

// ─── 6 · data & method (short) ────────────────────────────────────
function exampleTable(p, ixn) {
  var rows = p.rows.slice().sort(function (a, b) { return b.w0 - a.w0; }), top = rows.slice(0, 6), rest = rows.slice(6), sum = function (l, f) { return l.reduce(function (s, r) { return s + r[f]; }, 0); };
  var line = function (r) { var s = E.secs[r.id]; return '<tr><td><b>' + esc(s.t) + '</b> ' + esc(short(s.n)) + '</td><td class="num">' + (r.w0 * 100).toFixed(2) + '%</td><td class="num">' + money(r.e0) + ' → ' + money(r.e1) + '</td><td class="num">' + pc(r.g) + '</td><td class="num">' + pc(r.ret) + '</td><td class="num">' + pp(r.cE, 2) + '</td><td class="num">' + pp(r.cM, 2) + '</td><td class="num"><b>' + pp(r.cP, 2) + '</b></td></tr>'; };
  return '<details class="eps-det"><summary>Worked example: the six biggest companies of the ' + ixn + ', ' + dShort(E.dates[K0]) + ' → ' + dShort(E.dates[p.k1]) + '</summary>' +
    '<div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>Company</th><th class="num">Weight at start</th><th class="num">' + Y + ' EPS</th><th class="num">EPS change</th><th class="num">Price return</th><th class="num">EPS effect (pp)<br>= weight × EPS change</th><th class="num">Multiple effect (pp)<br>= price − EPS</th><th class="num">Price (pp)<br>= weight × price return</th></tr></thead><tbody>' +
    top.map(line).join('') +
    '<tr><td style="color:var(--mu)">All other ' + rest.length + ' companies</td><td class="num">' + (sum(rest, 'w0') * 100).toFixed(2) + '%</td><td></td><td></td><td></td><td class="num">' + pp(sum(rest, 'cE'), 2) + '</td><td class="num">' + pp(sum(rest, 'cM'), 2) + '</td><td class="num">' + pp(sum(rest, 'cP'), 2) + '</td></tr>' +
    '<tr class="eps-tot"><td class="nm">Index</td><td class="num">' + (p.covW * 100).toFixed(2) + '%</td><td></td><td></td><td></td><td class="num">' + pp(p.G, 2) + '</td><td class="num">' + pp(p.M, 2) + '</td><td class="num">' + pp(p.R, 2) + '</td></tr></tbody></table></div></details>';
}
function dataBlock() {
  var c = S.data, p = E.period(c.ix, K0, c.k1, BASE, null), skW = p.skipped.reduce(function (s, x) { return s + x.w0; }, 0), ixn = IXN[c.ix];
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td>' + whyTxt(s.why) + '</td></tr>'; }).join('');
  var fx = E.secs.filter(function (s) { return s.c; }).map(function (s) { return s.t + ' (' + s.c + ')'; }).join(', ');
  var neg = p.rows.filter(function (r) { return r.g == null; }).map(function (r) { return E.secs[r.id].t; });
  var steps = [
    ['1', 'Weight', 'Each stock\'s weight in the ' + ixn + ' on ' + dLong(E.dates[K0]) + ': its float-adjusted market-cap weight, taken from the file. Prices and share counts are not used for weighting.'],
    ['2', 'Own changes', 'Between the two dates: the change of its ' + Y + ' EPS estimate (Bloomberg consensus, calendarised to December) and its price return.'],
    ['3', 'Contribution', 'Price = weight × price return. EPS effect = weight × EPS change. Multiple effect = price − EPS effect.'],
    ['4', 'Add up', 'Stocks add up to industry groups, groups to sectors, sectors to the index. The index return is the sum of the price contributions.']
  ];
  return '<div class="eps-h2" style="margin-top:0">What it measures</div>' +
    '<p class="eps-p">How much of the ' + ixn + ' move since ' + dLong(E.dates[K0]) + ' came from analysts raising or cutting ' + Y + ' EPS estimates (EPS effect), and how much from the price the market pays per unit of those estimates (multiple effect). Both are in percentage points (pp) of the index return and add up to it. A missing estimate takes the first one available later.</p>' +
    '<div class="eps-h2">The calculation</div><table class="rt eps-t3 eps-defs"><tbody>' + steps.map(function (d) { return '<tr><td class="nm">' + d[0] + '. ' + d[1] + '</td><td>' + d[2] + '</td></tr>'; }).join('') + '</tbody></table>' + exampleTable(p, ixn) +
    '<p class="eps-p">A small weight dilutes any change: a stock at 0.01% of the index whose EPS estimate rises 500% adds 0.01% × 500% = 0.05 pp to the EPS effect, never 500%. The multiple effect is the rest of the price move: it equals the weight × (1 + EPS change) × the stock\'s own P/E change, so the cross term sits in it.</p>' +
    '<div class="eps-h2">The index-level P/E, as a memo</div>' +
    '<p class="eps-p">The forward P/E of the index (index price ÷ the earnings of everything it holds) went ' + x1(p.pe0) + ' → ' + x1(p.pe1) + ' (' + pc(p.m) + '), and the earnings of everything it holds rose ' + pc(p.gAgg) + '. That aggregate counts each company by the dollars it earns, so a cheap stock with a big EPS jump pulls it up more than its weight does. The EPS effect above counts each company by weight only: ' + pp(p.G, 1) + ' pp. Both are right; they answer different questions, and the contributions in this tab use weights.</p>' +
    '<div class="eps-h2">Coverage</div>' +
    '<p class="eps-p">The ' + ixn + ' held ' + p.nStart + ' stocks on ' + dLong(E.dates[K0]) + '. All are listed in the detail table. ' + p.skipped.length + ' of them (' + (skW * 100).toFixed(1) + '% of the weight) have no figures on ' + dLong(E.dates[c.k1]) + ': most left the index (acquired or removed), so there is no end price, and they count as 0 pp.' + (neg.length ? ' ' + neg.join(', ') + (neg.length > 1 ? ' have' : ' has') + ' a negative EPS at the start, so no % change exists: EPS effect 0, the price move is all multiple.' : '') + ' Stocks that joined the index later (' + p.entered.n + ' on this date) are not part of the start basket.</p>' +
    '<details class="eps-det"><summary>' + p.skipped.length + ' stocks without figures on ' + dShort(E.dates[c.k1]) + '</summary><div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th>Why</th></tr></thead><tbody>' + (out || '<tr><td colspan="4">None.</td></tr>') + '</tbody></table></div></details>' +
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
    sec('eps-s1', 'Return = EPS effect + multiple effect', '<div id="eps-c1"></div><div class="card">' + hb('spx') + hb('ndx') + '</div>') +
    sec('eps-s2', 'Attribution detail & simulation', '<div id="eps-c2"></div><div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '<div id="eps-c3"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t3"></div><div id="eps-who"></div><div class="eps-note" id="eps-who-n"></div></div>') +
    sec('eps-s4', 'EPS estimate of one stock', '<div id="eps-c4"></div><div class="card"><div class="eps-msg" id="eps-em"></div><div id="eps-ec"></div><div id="eps-et" style="margin-top:12px"></div></div>') +
    sec('eps-s5', 'Concentration', '<div id="eps-c5"></div><div class="card"><div class="eps-msg" id="eps-cm"></div><div class="eps-h2" id="eps-ch1" style="margin-top:6px"></div><div id="eps-cc1"></div><div class="eps-h2" id="eps-ch2"></div><div id="eps-cc2"></div><div style="margin-top:8px"><button class="ndx-tab-btn" data-act="ctable" id="eps-ctb"></button></div><div id="eps-conc"></div></div>') +
    sec('eps-s6', 'Data & method', '<div id="eps-c6"></div><div class="card" id="eps-data"></div>');
}
function render() {
  var set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }, d = domains();
  var h = hero();
  set('eps-c1', ctl('hero', ['to'])); set('eps-s1-n', 'whole index, not affected by the exclusions below · from ' + dShort(E.dates[K0]) + ' · ' + Y + ' EPS');
  ['spx', 'ndx'].forEach(function (ix) {
    set('eps-h-' + ix, h[ix].tiles);
    divStack(document.getElementById('eps-hc-' + ix), h[ix].rows, { colA: C.eps, colB: C.mult, pos: C.pos, neg: C.neg, domain: d.hero, unit: '%', axisTitle: 'points of return since ' + dShort(E.dates[K0]), netTitle: 'Price return', labA: 'EPS effect', labB: 'Multiple effect', diaLabel: 'Price return' });
  });
  set('eps-c2', ctl('detail', ['ix', 'to'])); set('eps-s2-n', ctxLine(IXN[S.detail.ix], S.detail.k1)); set('eps-detail', detail());
  var cw = S.who; set('eps-c3', ctl('who', ['ix', 'to', 'meas', 'lvl', 'side', 'n'])); set('eps-s3-n', ctxLine(IXN[cw.ix], cw.k1));
  var w = who();
  var unit = cw.lvl === 'sec' ? 'stock' : cw.lvl === 'ig' ? 'group' : 'sector';
  set('eps-t3', w.m === 'e'
    ? 'The ' + IXN[cw.ix] + ' returned ' + pc(w.p.R) + ', of which the EPS effect is ' + pp(w.total, 1) + ' pp. Each bar is how many of those points a ' + unit + ' added through its EPS estimate: its weight × its own EPS change.'
    : w.m === 'p' ? 'The ' + IXN[cw.ix] + ' returned ' + pc(w.total) + '. Each bar is how many percentage points of that return a ' + unit + ' added: its weight × its own price return.'
    : 'Each bar is the change of the ' + Y + ' EPS estimate of the ' + unit + ' itself, whatever its weight (the index EPS effect is ' + pp(w.p.G, 1) + ' pp).');
  barList(document.getElementById('eps-who'), w.rows, { pos: C.pos, neg: C.neg, domain: w.dom, unit: w.m === 'g' ? '%' : 'pp', axisTitle: w.m === 'e' ? 'points of the index return, through EPS' : w.m === 'p' ? 'points of the index return' : 'change of the ' + Y + ' EPS estimate',
    total: w.m === 'g' ? null : { label: 'Total, ' + w.p.n + ' stocks', v: w.total } });
  set('eps-who-n', w.note);
  var eb = estBlock(); set('eps-c4', eb.ctl); set('eps-s4-n', 'all 5 snapshots · ' + Y + ' EPS, not affected by the exclusions'); set('eps-em', eb.msg);
  lineChart(document.getElementById('eps-ec'), eb.labels, eb.series, function (v) { return v.toFixed(Math.abs(v) < 10 ? 1 : 0); },
    { vw: 900, h: 280, dom: eb.dom, ticks: eb.ticks, endFmt: function (v) { return v.toFixed(2); },
      tip: function (i, h) { var v = eb.series[0].vals[i]; return h + (i > K0 && eb.chg(v) != null ? '<span style="display:block;font-size:12px;color:#52514e">vs ' + dShort(E.dates[K0]) + ': <b>' + pc(eb.chg(v)) + '</b></span>' : ''); } });
  set('eps-et', eb.table);
  set('eps-c5', ctl('conc', ['ix', 'n2'])); set('eps-s5-n', 'whole index, not affected by the exclusions · all snapshots · ' + Y + ' EPS');
  var cb = concBlock();
  set('eps-cm', cb.msg);
  set('eps-ch1', 'Value: share of the ' + IXN[S.conc.ix] + ' held by its ' + cb.n + ' largest companies'); set('eps-ch2', 'Earnings: share of the index earnings produced by the ' + cb.n + ' companies that earn the most');
  stackBars(document.getElementById('eps-cc1'), cb.value, { color: C.price, restLabel: 'all other companies' });
  stackBars(document.getElementById('eps-cc2'), cb.earn, { color: C.eps, restLabel: 'all other companies' });
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
    if (id === 'who' && f === 'lvl') S.who.n = val === 'sec' ? 10 : 0;     // sectors and industry groups: show all of them
  }
  else if (act === 'est') { var t = String(el.value || '').trim().toUpperCase(); if (E.secs.some(function (s) { return s.t === t; })) S.est.t = t; }
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
