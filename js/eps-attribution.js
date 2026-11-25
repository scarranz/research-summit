// eps-attribution.js — Market Analysis > EPS Attribution tab (next to Index Analysis).
// Splits an index move into the change in forward EPS (CY2027) and the change in the forward multiple,
// from the base date (Jan 2, 2026) to each later snapshot, by sector / industry group / security.
// Controls copy Index Analysis (S&P / Nasdaq toggle, period buttons, Top 5 / 10 / 20 / All + a typed number);
// only the exclusions (clicked in the detail table) are shared, so a removed group is out everywhere.
// Maths: js/eps-engine.js · charts: js/eps-charts.js · data: js/eps-attribution-data.js
// (scripts/eps-attribution/extract_eps.py) · method: docs/EPS_ATTRIBUTION.md.
import { makeEngine } from './eps-engine.js';
import { indexSide, spxThrough, epsSourcesReady, setUnitLookup } from './eps-index-link.js';
import { barList, stackBars, ppTxt } from './eps-charts.js';

var BASE = 'cy27', Y = 'CY2027';
// Snapshots kept in the data file but left out of the page (none today).
var HIDDEN = [];
function visible(D) {
  var keep = D.dates.map(function (d, k) { return k; }).filter(function (k) { return HIDDEN.indexOf(D.dates[k]) < 0; });
  var clean = function (t) { return HIDDEN.reduce(function (x, d) { return x.split(', ' + d).join('').split(d + ', ').join(''); }, t); };
  return Object.assign({}, D, { dates: keep.map(function (k) { return D.dates[k]; }), snaps: keep.map(function (k) { return D.snaps[k]; }),
    notes: (D.notes || []).map(function (n) { return Object.assign({}, n, { text: clean(n.text) }); }) });
}
var C = { eps: '#3E5A82', mult: '#B7C4D8', pos: '#177A4E', neg: '#9B2A20', price: '#1E2733', earn: '#7C9CC4' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var IXN = { spx: 'S&P 500', ndx: 'Nasdaq-100' };
var LV = [['sec', 'Security'], ['sector', 'Sector'], ['ig', 'Industry group']];
var E = null, root = null, S = null, DOM = null, K0 = 1, ORD = {};

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function dLong(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function dShort(iso) { var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + " '" + String(d.getUTCFullYear()).slice(2); }
function pc(v, d) { return v == null || isNaN(v) ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(d == null ? 2 : d) + '%'; }
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
  var end = E.dates.length - 1;
  return { excl: {}, open: {}, sort: 'cP', dir: -1,
    hero: { k1: end }, detail: { ix: 'spx', k1: end }, who: { ix: 'spx', k1: end, lvl: 'sec', n: 10, side: 'pos', what: 'e', as: 'c' },
    est: { t: 'MU', k1: end }, conc: { ix: 'spx', n: 10, ks: [end] }, data: { ix: 'spx', k1: end, open: false } };
}
// exclusions: 'S|Sector' · 'G|Industry group' · 'T|TICKER' — shared by every section and both indices
function exFrom(excl) {
  var set = new Set();
  E.secs.forEach(function (s, i) { if (excl['S|' + s.s] || excl['G|' + s.g] || excl['T|' + s.t]) set.add(i); });
  return set;
}
function exNow() { var s = exFrom(S.excl); return s.size ? s : null; }
function nExcl() { return Object.keys(S.excl).filter(function (k) { return S.excl[k]; }).length; }
function ctxLine(ixTxt, k1) { return ixTxt + ' · ' + spanTxt(k1) + ' · ' + Y + ' EPS' + (nExcl() ? ' · ' + nExcl() + ' excluded' : ''); }
function keyOf(lvl) { return function (r) { var s = E.secs[r.id]; return lvl === 'sector' ? s.s : lvl === 'ig' ? s.g : String(r.id); }; }
function nameOf(key, lvl) { if (lvl !== 'sec') return key; var s = E.secs[+key]; return s.t + ' · ' + short(s.n); }
function last() { return E.dates.length - 1; }
function spanTxt(k) { return 'YTD to ' + dLong(priceDate(k == null ? last() : k)); }
// An earlier snapshot taken at the start of a quarter (Apr 1, Jul 1) is read against the month-end just before it
// (Mar 31, Jun 30); one taken mid-month (Oct 16) keeps its own date
function atMonthEnd(k) { return k !== last() && +E.dates[k].slice(8) <= 3; }
function priceDate(k) {
  if (!atMonthEnd(k)) return E.dates[k];
  var d = new Date(E.dates[k] + 'T12:00:00Z'); d.setUTCDate(0); return d.toISOString().slice(0, 10);
}
function periods() { var o = []; for (var k = K0 + 1; k <= last(); k++) o.push([k, dShort(priceDate(k))]); return o; }
// where the price of a view comes from
function basis(ix, k) {
  if (k === last()) return (ix === 'spx' ? 'SPY' : 'QQQ') + ', as in Index Analysis';
  var eps = ' · EPS estimates of ' + dShort(E.dates[k]);
  return (ix === 'spx' && atMonthEnd(k) ? 'SPY at month-end, as in Index Analysis' : 'built from the companies (Index Analysis has no figure at this date)') + eps;
}
function mult(ret, g) { return ret == null || g == null || g <= -1 ? null : (1 + ret) / (1 + g) - 1; }
// excluded sectors / groups / tickers, as Index Analysis' engines take them
function exSets(excl) {
  var o = { sectors: new Set(), igs: new Set(), tickers: new Set() };
  Object.keys(excl).forEach(function (k) { if (excl[k]) o[k.charAt(0) === 'S' ? 'sectors' : k.charAt(0) === 'G' ? 'igs' : 'tickers'].add(k.slice(2)); });
  return o;
}
// One view of an index: price, weights and price contribution from Index Analysis; EPS growth and its
// contribution from the EPS file; the multiple is what is left. Fractions (0.05 = 5%).
function view(ix, excl, k) {
  if (k == null) k = last();
  var ex = exFrom(excl), p = E.period(ix, K0, k, BASE, ex.size ? ex : null);
  var px = k === last() ? indexSide(ix, exSets(excl)) : ix === 'spx' && atMonthEnd(k) ? spxThrough(priceDate(k).slice(0, 7), exSets(excl)) : null;
  var built = !px;                                   // no Index Analysis figure: price from the EPS file's companies
  if (!px) px = { total: p.R * 100, cash: 0, sec: {}, ig: {} };
  var f = function (v) { return v == null ? null : v / 100; };
  // company price figures from the EPS file, where Index Analysis has none
  function own(keyFn) {
    var m = {};
    E.group(p.rows, keyFn).forEach(function (o) { m[o.key] = { c: o.cP * 100, ret: o.ret * 100, w0: o.w0 * 100, w1: o.w1 * 100 }; });
    return m;
  }
  if (built) { px.sec = own(keyOf('sector')); px.ig = own(keyOf('ig')); }
  if (!px.t) { var byId = own(keyOf('sec')); px.t = {}; Object.keys(byId).forEach(function (id) { px.t[E.secs[+id].t] = byId[id]; }); }
  function level(keyFn, side, n) {
    var en = E.earnings(p, keyFn), out = {};
    p.rows.forEach(function (r) {
      var k = keyFn(r), o = out[k] || (out[k] = { key: k, n: 0, cE: 0 }); o.n++; o.cE += en.contrib[r.id] || 0;
    });
    Object.keys(out).forEach(function (k) {
      var o = out[k], x = side[n(k)];
      o.g = en.group[k] === undefined ? null : en.group[k];
      o.ret = x ? f(x.ret) : null; o.cP = x ? f(x.c) : null; o.w0 = x ? f(x.w0) : null; o.w1 = x ? f(x.w1) : null;
      o.m = mult(o.ret, o.g);
    });
    return out;
  }
  var same = function (k) { return k; }, g = E.earnings(p).total, ret = f(px.total);
  return { p: p, k: k, built: built, estimated: !!px.estimated, cash: f(px.cash),
    total: { g: g, ret: ret, m: mult(ret, g), cE: g, cP: ret, n: p.n },
    sector: level(keyOf('sector'), px.sec, same), ig: level(keyOf('ig'), px.ig, same),
    sec: level(keyOf('sec'), px.t, function (k) { return E.secs[+k].t; }) };
}
function endDates() { var o = []; for (var k = K0 + 1; k < E.dates.length; k++) o.push([k, dShort(E.dates[k])]); return o; }

// ─── controls, as in Index Analysis: numbered steps in grey blocks ─
function seg(attrs, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) { return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" ' + attrs + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function chips(attrs, opts, on) {
  return opts.map(function (o) { return '<button class="sb-secchip' + (on(o[0]) ? ' active' : '') + '" ' + attrs + ' data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('');
}
function q(label, x) { return '<span class="eps-q"><span class="sb-secrow-lbl" style="margin-right:0">' + label + '</span>' + x + '</span>'; }
// rows: one list of controls per line of the block
function ctl(id, rows) {
  var c = S[id], a = function (f) { return 'data-act="s" data-id="' + id + '" data-f="' + f + '"'; }, n = 0;
  var one = {
    ix: function () { return q(++n + ' · Index', seg(a('ix'), [['spx', 'S&P 500'], ['ndx', 'Nasdaq-100']], c.ix)); },
    to: function () { return q(++n + ' · YTD to', chips(a('k1'), periods(), function (v) { return v === c.k1; })); },
    lvl: function () { return q(++n + ' · Level', seg(a('lvl'), LV, c.lvl)); },
    what: function () { return q(++n + ' · What', seg(a('what'), [['e', 'EPS estimate'], ['m', 'Multiple'], ['p', 'Price']], c.what)); },
    as: function () { return q(++n + ' · Measured as', seg(a('as'), c.what === 'm' ? [['o', 'Own change']] : [['c', 'Contribution'], ['o', 'Own change']], c.what === 'm' ? 'o' : c.as)); },
    side: function () { return q(++n + ' · Show', seg(a('side'), [['pos', 'Top'], ['neg', 'Bottom']], c.side)); },
    n: function () { return howMany([[5, '5'], [10, '10'], [20, '20'], [0, 'All']]); },
    n2: function () { return howMany([[5, '5'], [10, '10'], [20, '20']]); },
    stock: function () { return q(++n + ' · Company', '<input type="text" list="eps-dl" value="' + esc(c.t) + '" data-act="est" autocomplete="off" spellcheck="false"><datalist id="eps-dl">' + E.secs.map(function (x) { return '<option value="' + esc(x.t) + '">' + esc(short(x.n)) + '</option>'; }).join('') + '</datalist>'); },
    dates: function () { return q(++n + ' · Dates', chips('data-act="cdate"', E.dates.map(function (d, k) { return [k, dShort(d)]; }), function (v) { return c.ks.indexOf(v) >= 0; })); }
  };
  function howMany(opts) {
    return q(++n + ' · How many', chips(a('n'), opts, function (v) { return v === c.n; }) + '<input type="number" min="1" max="500" placeholder="Custom" ' + a('n') + ' value="' + ([5, 10, 20, 0].indexOf(c.n) < 0 ? c.n : '') + '">');
  }
  return '<div class="sb-block">' + rows.map(function (r) { return '<div class="sb-line q">' + r.map(function (k) { return one[k](); }).join('') + '</div>'; }).join('') + '</div>';
}

// ─── fixed axes: a bar keeps its length whatever index, date or level is shown ───
var CK = { e: 'cE', p: 'cP' }, OK = { e: 'g', m: 'm', p: 'ret' };     // contribution (pp) and own change (%) of each measure
function domains() {
  if (DOM) return DOM;
  var keys = ['cE', 'cP', 'g', 'm', 'ret'], d = { hero: [0, 0] };
  keys.forEach(function (k) { d[k] = { sector: [0, 0], ig: [0, 0], sec: [0, 0] }; });
  function ext(a, v) { if (v != null && isFinite(v)) { a[0] = Math.min(a[0], v); a[1] = Math.max(a[1], v); } }
  ['spx', 'ndx'].forEach(function (ix) {
    for (var j = K0 + 1; j < E.dates.length; j++) {
      var v = view(ix, {}, j);
      ext(d.hero, v.total.g); ext(d.hero, v.total.ret);
      LV.forEach(function (L) { Object.keys(v[L[0]]).forEach(function (n) { keys.forEach(function (k) { ext(d[k][L[0]], v[L[0]][n][k]); }); }); });
    }
  });
  return (DOM = d);
}
// the whole index at the latest date fixes the row order of the detail table, so rows never move when something is excluded
function order(ix, k) { if (k == null) k = last(); return ORD[ix + k] || (ORD[ix + k] = view(ix, {}, k)); }

// ─── 1 · EPS growth · multiple change · price return ──────────────
// Three cards and the portal's horizontal bars. Each card's second line runs on a base of 100, and the multiple's
// starts where the EPS one ended: the two compound into the price, with no equation. Price = Index Analysis';
// EPS growth = built from the companies; the multiple is what is left.
function cards(o, priceSub) {
  var l1 = 100 * (1 + o.g), l2 = 100 * (1 + o.ret);
  var card = function (k, v, from, to, sub, tot) {
    return '<div class="eps-eqt' + (tot ? ' tot' : '') + '"><div class="k">' + k + '</div><div class="v" style="color:' + col(v) + '">' + pc(v) + '</div>' +
      '<div class="s"><b>' + from + ' → ' + to + '</b>' + (sub ? ' · ' + sub : '') + '</div></div>';
  };
  return '<div class="eps-eq">' + card('EPS growth', o.g, '100', l1.toFixed(1), Y + ' EPS estimates') + card('Multiple change', o.m, l1.toFixed(1), l2.toFixed(1), 'price paid per unit of EPS') +
    '<div class="eps-sep"></div>' + card('Price return', o.ret, '100', l2.toFixed(1), priceSub, true) + '</div>';
}
function barsOf(o, who) {
  var tip = function (t) { return '<b style="font-size:13px">' + who + '</b><span class="tp">' + t + '</span>'; };
  return {
    rows: [{ label: 'EPS growth', v: o.g, tip: tip('Growth of the ' + Y + ' EPS estimate: <b>' + pc(o.g) + '</b>') },
      { label: 'Multiple change', v: o.m, tip: tip('Change of the price paid per unit of EPS, on the new EPS: <b>' + pc(o.m) + '</b>') }],
    total: { label: 'Price return', v: o.ret }
  };
}
function hero() {
  var k = S.hero.k1, d = domains();
  ['spx', 'ndx'].forEach(function (ix) {
    var o = order(ix, k).total, b = barsOf(o, IXN[ix] + ' · ' + spanTxt(k));
    var head = document.getElementById('eps-h-' + ix);
    if (head) head.innerHTML = cards(o, spanTxt(k)) + '<div class="eps-src">Price: ' + basis(ix, k) + '</div>';
    barList(document.getElementById('eps-hc-' + ix), b.rows, { pos: C.pos, neg: C.neg, domain: d.hero, unit: '%', dec: 2, total: b.total, axisTitle: 'change, ' + spanTxt(k) });
  });
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
function rowCells(o, W, key, off) {
  if (!o || off) return '<td class="num" style="color:var(--mu)">—</td>'.repeat(6);
  return '<td class="num" style="color:var(--mu);font-size:11px">' + wtxt(o.w0, o.w1) + '</td><td class="num">' + cP(o.g) + '</td><td class="num">' + cP(o.m) + '</td><td class="num">' + cP(o.ret) + '</td>' +
    '<td class="num">' + cc(o.cE) + '</td><td class="num" style="font-weight:700">' + cc(o.cP) + '</td>';
}
function naCells(w0, why) {
  return '<td class="num" style="color:var(--mu);font-size:11px">' + (w0 * 100).toFixed(2) + '% → —</td><td class="num" colspan="5" style="color:var(--mu);font-size:11px;text-align:center">n/a · ' + why + '</td>';
}
function whyTxt(w) { return w === 'no price at the end date' ? 'left the index, no end price' : 'no ' + Y + ' estimate in the file'; }
function detail() {
  var c = S.detail, v = view(c.ix, S.excl, c.k1), cur = v.p, ord = order(c.ix), byS = v.sector, byG = v.ig, byT = {}, naT = {}, ordT = {}, oS = ord.sector, oG = ord.ig, igsOf = {}, idsOf = {};
  cur.rows.forEach(function (r) { byT[r.id] = v.sec[r.id]; });
  cur.skipped.forEach(function (x) { naT[x.id] = x; });
  ord.p.rows.forEach(function (r) { ordT[r.id] = Object.assign({ id: r.id }, ord.sec[r.id]); });
  // every stock the index held at the start is listed, with or without data
  E.universe(c.ix, K0, E.dates.length - 1).forEach(function (m) { var s = E.secs[m.id]; (igsOf[s.s] = igsOf[s.s] || {})[s.g] = 1; (idsOf[s.g] = idsOf[s.g] || []).push({ id: m.id, w0: m.w, k: m.k }); });
  var W = null, sk = S.sort, body = '';
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
      idsOf[gname].map(function (x) { return ordT[x.id] || { id: x.id, w0: x.w0, k: x.k }; }).sort(by).forEach(function (ro) {
        var s = E.secs[ro.id], offT = offG || !!S.excl['T|' + s.t], o = byT[ro.id], uk = (idsOf[gname].find(function (x) { return x.id === ro.id; }) || {}).k;
        var cells = offT ? rowCells(null, W, ro.id, true) : o ? rowCells(o, W, ro.id, false) : naCells(ro.w0, naT[ro.id] ? whyTxt(naT[ro.id].why) : uk >= c.k1 ? 'joins the index on ' + dShort(E.dates[uk]) + ' or later' : 'no data in this period');
        body += '<tr class="eps-r3' + (offT ? ' off' : '') + '" data-act="tog" data-v="T|' + esc(s.t) + '"><td class="c" style="padding-left:24px">' + dot(!offT, 12) + '</td><td></td>' +
          '<td class="nm" style="padding-left:38px"><b>' + esc(s.t) + '</b> <span style="color:var(--mu)">' + esc(short(s.n)) + '</span></td>' + cells + '</tr>';
      });
    });
  });
  var t = v.total;
  body += '<tr><td></td><td></td><td class="nm" style="color:var(--mu);font-style:italic">Cash &amp; other' + (v.built ? '' : ' (as in Attribution Detail)') + '</td><td colspan="5"></td><td class="num">' + cc(v.cash) + '</td></tr>';
  body += '<tr class="eps-tot"><td></td><td></td><td class="nm">Total, ' + cur.n + ' stocks</td><td class="num">100.00% → 100.00%</td><td class="num">' + cP(t.g) + '</td><td class="num">' + cP(t.m) + '</td><td class="num">' + cP(t.ret) + '</td><td class="num">' + cc(t.cE) + '</td><td class="num">' + cc(t.cP) + '</td></tr>';
  function th(k, label) { return '<th class="num' + (S.sort === k ? ' on' : '') + '" data-act="sort" data-v="' + k + '">' + label + (S.sort === k ? (S.dir < 0 ? ' ▼' : ' ▲') : '') + '</th>'; }
  return '<div class="card"><div class="eps-tbar"><span class="eps-hint">Click a row to take it out of the index (sector, industry group or security). Every section below recalculates and the rest rescale to 100%.' +
    '</span>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="openall" data-v="1">Expand All</button><button class="ndx-tab-btn" data-act="openall" data-v="0">Collapse All</button><button class="sb-tbtn" data-act="reset">Reset</button></span></div>' +
    '<div class="eps-tw"><table class="rt eps-dt"><thead>' +
    '<tr class="gh"><th></th><th></th><th></th><th></th><th colspan="3" class="grp">Its own change</th><th colspan="2" class="grp">Contribution to the ' + IXN[c.ix] + ' (pp)</th></tr>' +
    '<tr><th style="width:30px"></th><th style="width:24px"></th><th>Sector / Industry Group</th>' +
    th('w', 'Weight, start → end') + th('g', Y + ' EPS') + th('m', 'Forward P/E') + th('ret', 'Price') + th('cE', 'To EPS growth') + th('cP', 'To price return') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="eps-note"><b>Price, weights and price contribution:</b> ' + basis(c.ix, c.k1) + '. <b>EPS growth</b> adds up each company\'s (weight ÷ price) × ' + Y + ' EPS. <b>Forward P/E</b> change = (1 + price) ÷ (1 + EPS growth) − 1.' +
    (c.ix === 'spx' && !v.built ? ' Sector rows come from SPY\'s sector weights and company rows from its year-start holdings, as in Index Analysis, so companies need not add up to their sector.' : '') +
    (v.estimated ? ' <b>Taking a single company out is an estimate.</b>' : '') + '</div></div>';
}

// ─── 3 · who moved the index ──────────────────────────────────────
// Two choices: what (EPS estimate · multiple · price) and how (contribution to the index in pp = weight × its own change,
// or its own change in %, whatever its weight). Multiple = price ÷ EPS of the same date, so each stock has its own P/E change.
function who() {
  var c = S.who, v = view(c.ix, S.excl, c.k1), lvl = c.lvl, W = c.what, contrib = c.as === 'c' && W !== 'm', key = contrib ? CK[W] : OK[W];
  var total = contrib ? (W === 'e' ? v.total.cE : v.total.cP) : null, note = '';
  var gs = Object.keys(v[lvl]).map(function (k) { return v[lvl][k]; }).filter(function (g) { return g[key] != null; }).sort(function (a, b) { return b[key] - a[key]; });
  var n = c.n === 0 ? gs.length : Math.min(c.n, gs.length);
  var pick = c.side === 'pos' ? gs.slice(0, n) : gs.slice(Math.max(0, gs.length - n)).reverse();
  var rows = pick.map(function (g) {
    var nm = nameOf(g.key, lvl);
    return { label: trunc(nm, 42), v: g[key],
      tip: '<b style="font-size:13px">' + esc(nm) + '</b><span class="tp">' + (g.w0 == null ? '' : 'Weight at the start: ' + (g.w0 * 100).toFixed(2) + '%<br>') +
        'EPS growth: ' + pc(g.g) + '<br>Forward P/E: ' + pc(g.m) + '<br>Price: ' + pc(g.ret) + '<br>To the index\'s EPS growth: ' + pp(g.cE, 2) + ' pp<br>To the index\'s price return: ' + pp(g.cP, 2) + ' pp</span>' };
  });
  var sum = pick.reduce(function (s, g) { return s + g[key]; }, 0), what = lvl === 'sec' ? 'stocks' : lvl === 'ig' ? 'industry groups' : 'sectors';
  if (!contrib) note = 'Ranked by each one\'s own change, whatever its weight. Hover for its weight and contributions.';
  else if (n < gs.length) note = 'The ' + rows.length + ' shown add up to ' + pp(sum, 2) + ' pp of the ' + pp(total, 2) + ', out of ' + gs.length + ' ' + what + '.';
  return { rows: rows, note: note, v: v, W: W, contrib: contrib, total: total, key: key, dom: domains()[key][lvl] };
}

// ─── 4 · one stock: how its EPS estimate moved, and what moved its price ───
function niceAxis(lo, hi) {
  var raw = (hi - lo) / 5 || 1, pw = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / pw, st = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pw, a = Math.floor(lo / st) * st, z = Math.ceil(hi / st) * st, t = [];
  for (var v = a; v <= z + st / 1e6; v += st) t.push(Math.round(v / st * 1e6) / 1e6 * st);
  return { dom: [a, z], ticks: t };
}
function money(v) { return v == null ? '—' : (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
function estBlock() {
  var t = S.est.t, k1 = S.est.k1, id = E.secs.findIndex(function (s) { return s.t === t; }), s = E.secs[id];
  var pts = E.dates.map(function (d, k) { var r = E.D.snaps[k].find(function (x) { return x[0] === id; }); return r ? { eps: r[5], px: r[3] } : null; });
  var a = pts[K0], z = pts[k1];
  var side = ['spx', 'ndx'].map(function (ix) { var x = order(ix, k1).sec[id]; return x && x.ret != null ? { ix: ix, x: x } : null; }).filter(Boolean);
  var g = a && z && a.eps > 0 ? z.eps / a.eps - 1 : null, r = side.length ? side[0].x.ret : null, m = mult(r, g);
  var inIx = side.map(function (o) { return IXN[o.ix] + ' (weight ' + (o.x.w0 * 100).toFixed(2) + '%): <b>' + pp(o.x.cE, 2) + ' pp</b> of its EPS growth, <b>' + pp(o.x.cP, 2) + ' pp</b> of its price return'; });
  var row = function (label, f) {
    return '<tr><td class="nm">' + label + '</td>' + pts.map(function (p, k) { return '<td class="num' + (k === k1 || k === K0 ? ' eps-hl' : '') + '">' + (p ? f(p) : '—') + '</td>'; }).join('') + '</tr>';
  };
  var table = '<div class="eps-tw"><table class="rt eps-t3"><thead><tr><th></th>' + E.dates.map(function (d, k) { return '<th class="num' + (k === k1 || k === K0 ? ' eps-hl' : '') + '">' + dShort(d) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    row('Price', function (p) { return money(p.px); }) + row(Y + ' EPS estimate' + (s.c ? ' (' + s.c + ')' : ''), function (p) { return money(p.eps); }) +
    row('Forward P/E', function (p) { return x1(p.eps > 0 ? p.px / p.eps : null); }) + '</tbody></table></div>' +
    '<div class="eps-note">The table shows the close on each date. The cards above use ' + (k1 === last() ? 'Index Analysis\' price return, which starts at the Dec 31 close' : 'the price basis of that date') + ', so they can differ from a change read across the table.</div>';
  return { msg: '<b>' + esc(s.t) + '</b> · ' + esc(s.n) + ' · ' + esc(s.s),
    data: g != null && r != null && m != null ? { g: g, m: m, ret: r } : null, k: k1,
    table: table,
    ix: inIx.length ? '<div class="eps-split">' + inIx.join('<br>') + '</div>' : '<div class="eps-split">No price for this company at this date.</div>' };
}

// ─── 5 · concentration of expected earnings ───────────────────────
// Not linked to the exclusions. One 100% bar per chosen date: the share of the index's expected CY2027 earnings produced by the
// N companies expected to earn the most (a company's expected earnings inside the index = its weight ÷ its forward P/E).
// Hover = who they are. (Concentration by value lives in Index Analysis.)
// share classes of one company (GOOGL + GOOG) count once
function companies(ix, k) {
  var by = {}, list = [];
  E.concentration(ix, k, BASE, null, 1000).topE.forEach(function (x) {
    var s = E.secs[x.id], o = by[s.n];
    if (!o) { o = by[s.n] = { t: [], n: s.n, sh: 0, w: 0, y: 0 }; list.push(o); }
    o.t.push(s.t); o.sh += x.sh; o.w += x.w; o.y += x.w / x.pe;
  });
  return list.sort(function (a, b) { return b.sh - a.sh; });
}
function concBlock() {
  var c = S.conc, n = c.n, ks = c.ks.slice().sort(function (a, b) { return a - b; }), k = ks[ks.length - 1];
  var top = function (j) { return companies(c.ix, j).slice(0, n); };
  var total = function (l, f) { return l.reduce(function (s, x) { return s + x[f]; }, 0); };
  var rows = ks.map(function (j) {
    var l = top(j), sh = total(l, 'sh');
    return { label: dShort(E.dates[j]), v: sh, bold: j === k, tip: '<b style="font-size:13px">' + dLong(E.dates[j]) + '</b><span class="tp">Top ' + n + ' companies: ' + (sh * 100).toFixed(2) + '% of expected earnings</span>' };
  });
  var l = top(k), sh = total(l, 'sh'), w = total(l, 'w');
  var list = '<div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>#</th><th>Company</th><th class="num">Share of expected earnings</th><th class="num">Weight in the index</th><th class="num">Forward P/E</th></tr></thead><tbody>' +
    l.map(function (x, i) { return '<tr><td>' + (i + 1) + '</td><td><b>' + esc(x.t.join(' + ')) + '</b> ' + esc(short(x.n)) + '</td><td class="num">' + (x.sh * 100).toFixed(2) + '%</td><td class="num">' + (x.w * 100).toFixed(2) + '%</td><td class="num">' + x1(x.y > 0 ? x.w / x.y : null) + '</td></tr>'; }).join('') +
    '<tr class="eps-tot2"><td></td><td><b>Top ' + n + '</b></td><td class="num"><b>' + (sh * 100).toFixed(2) + '%</b></td><td class="num"><b>' + (w * 100).toFixed(2) + '%</b></td><td></td></tr></tbody></table></div>';
  return { n: n, ks: ks, rows: rows, list: list,
    msg: 'The ' + n + ' largest earners are <b>' + (w * 100).toFixed(1) + '%</b> of the ' + IXN[c.ix] + ' by weight, but are expected to produce <b>' + (sh * 100).toFixed(1) + '%</b> of its ' + Y + ' earnings (' + dLong(E.dates[k]) + ').',
    how: 'A company\'s share = its weight ÷ its forward P/E, over the same for every company in the index. Share classes of one company are counted together.' };
}


// ─── 6 · data & method (short) ────────────────────────────────────
function exampleTable(v, ixn) {
  var rows = v.p.rows.map(function (r) { return Object.assign({ r: r }, v.sec[r.id]); }).filter(function (x) { return x.w0 != null; }).sort(function (a, b) { return b.w0 - a.w0; }).slice(0, 6);
  var line = function (x) { var s = E.secs[x.r.id]; return '<tr><td><b>' + esc(s.t) + '</b> ' + esc(short(s.n)) + '</td><td class="num">' + (x.w0 * 100).toFixed(2) + '%</td><td class="num">' + money(x.r.e0) + ' → ' + money(x.r.e1) + '</td><td class="num">' + pc(x.g) + '</td><td class="num">' + pc(x.m) + '</td><td class="num">' + pc(x.ret) + '</td><td class="num">' + pp(x.cE, 2) + '</td><td class="num">' + pp(x.cP, 2) + '</td></tr>'; };
  return '<details class="eps-det"><summary>Worked example: the six biggest companies of the ' + ixn + '</summary>' +
    '<div class="eps-tw"><table class="rt eps-t3"><thead><tr><th>Company</th><th class="num">Weight at start</th><th class="num">' + Y + ' EPS</th><th class="num">EPS growth</th><th class="num">P/E change</th><th class="num">Price return</th><th class="num">To index EPS growth (pp)</th><th class="num">To index price (pp)</th></tr></thead><tbody>' +
    rows.map(line).join('') + '</tbody></table></div></details>';
}
function dataBlock() {
  var c = S.data, v = order(c.ix, c.k1), p = v.p, ixn = IXN[c.ix];
  var out = p.skipped.slice().sort(function (a, b) { return b.w0 - a.w0; }).map(function (s) {
    var x = E.secs[s.id]; return '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(short(x.n)) + '</td><td class="num">' + (s.w0 * 100).toFixed(2) + '%</td><td>' + whyTxt(s.why) + '</td></tr>'; }).join('');
  // notes only for what applies to this index: names it held at some snapshot in 2026
  var held = {}; E.universe(c.ix, K0, E.dates.length - 1).forEach(function (m) { held[E.secs[m.id].t] = 1; });
  var fx = E.secs.filter(function (s) { return s.c && held[s.t]; }).map(function (s) { return s.t + ' (' + s.c + ')'; }).join(', ');
  var drop = (E.D.dropped || []).filter(function (x) { return x[c.ix]; }).map(function (x) { return short(x.n) + ' (' + x.t + ')'; }).join(', ');
  var li = function (cond, t) { return cond ? '<li>' + t + '</li>' : ''; };
  var neg = p.rows.filter(function (r) { return r.g == null; }).map(function (r) { return E.secs[r.id].t; });
  var steps = [
    ['1', 'Price', 'The same figures as Index Analysis: ' + (c.ix === 'spx' ? 'the SPY fund, with its sector weights and holdings' : 'QQQ, holding period by holding period') + '. YTD from the last close of the previous year.'],
    ['2', 'EPS growth', 'Each company adds (weight ÷ price) × its ' + Y + ' EPS (Bloomberg consensus, calendarised to December) to the index\'s EPS. Measured snapshot to snapshot (' + E.dates.slice(K0).map(dShort).join(' → ') + ') and chained. The first snapshot stands for the start of the year.'],
    ['3', 'Multiple', '(1 + price return) ÷ (1 + EPS growth) − 1, at every level: index, sector, industry group, company.'],
    ['4', 'Contributions', 'EPS contributions add up to the index\'s EPS growth. Price contributions plus cash & other add up to its price return. The multiple is not split into contributions.']
  ];
  return '<div class="eps-h2" style="margin-top:0">What it measures</div>' +
    '<p class="eps-p">The ' + ixn + ' price return split into the growth of its ' + Y + ' EPS estimate and the change of the multiple paid for it: (1 + EPS growth) × (1 + multiple change) = 1 + price return. A missing estimate takes the first one available later.</p>' +
    '<div class="eps-h2">The calculation</div><table class="rt eps-t3 eps-defs"><tbody>' + steps.map(function (d) { return '<tr><td class="nm">' + d[0] + '. ' + d[1] + '</td><td>' + d[2] + '</td></tr>'; }).join('') + '</tbody></table>' + exampleTable(v, ixn) +
    '<div class="eps-h2">Coverage</div>' +
    '<p class="eps-p">The ' + ixn + ' held ' + p.nStart + ' stocks on ' + dLong(E.dates[K0]) + '. Over this period ' + p.entered.n + ' joined and ' + p.left.n + ' left; each counts only while it was a member, and all of them are in the detail table. ' + p.skipped.length + ' have no price or estimate in the file for the period (0 pp).' + (neg.length ? ' ' + neg.join(', ') + (neg.length > 1 ? ' have' : ' has') + ' a negative EPS at the start of a step: no % change exists, EPS effect 0, the price move is all multiple.' : '') + '</p>' +
    '<details class="eps-det"><summary>' + p.skipped.length + ' stocks without data in this period</summary><div class="eps-tw eps-scr"><table class="rt eps-t3"><thead><tr><th>Ticker</th><th>Name</th><th class="num">Weight</th><th>Why</th></tr></thead><tbody>' + (out || '<tr><td colspan="4">None.</td></tr>') + '</tbody></table></div></details>' +
    '<div class="eps-h2">Caveats</div><ul class="eps-ul">' +
    li(drop, 'Removed by decision: ' + esc(drop) + '.') +
    li(held['BRK/B'], 'BRK/B EPS is divided by 1,500: the file carries the Class A EPS and one Class A is 1,500 Class B.') +
    li(held.GOOGL || held.AMZN, 'EPS is GAAP (Bloomberg IS_COMP_EPS_GAAP): ' + [held.GOOGL ? 'GOOGL' : '', held.AMZN ? 'AMZN' : ''].filter(Boolean).join(' and ') + ' carry investment marks. Take them out in the table to see the effect.') +
    li(fx, 'No currency conversion for ' + esc(fx) + '.') +
    (E.D.notes || []).filter(function (n) { return held[n.t]; }).map(function (n) { return '<li>' + esc(n.text) + '.</li>'; }).join('') +
    '<li>EPS is measured on the companies and weights in the EPS file; price comes from Index Analysis. The two weight snapshots differ slightly.</li>' +
    '<li>Source: ' + esc(E.D.source) + '.</li></ul>';
}


// ─── page ─────────────────────────────────────────────────────────
function skeleton() {
  var hb = function (ix) { return '<div class="eps-hb"><div class="eps-eqn">' + IXN[ix] + '</div><div id="eps-h-' + ix + '"></div><div id="eps-hc-' + ix + '"></div></div>'; };
  root.innerHTML =
    sec('eps-s1', 'Price return: EPS growth and multiple change', '<div id="eps-c1"></div><div class="card">' + hb('spx') + hb('ndx') + '</div>') +
    sec('eps-s2', 'Attribution detail & simulation', '<div id="eps-c2"></div><div id="eps-detail"></div>') +
    sec('eps-s3', 'Who moved the index', '<div id="eps-c3"></div><div class="card"><div class="eps-h2" style="margin-top:0" id="eps-t3"></div><div id="eps-who"></div><div class="eps-note" id="eps-who-n"></div></div>') +
    sec('eps-s5', 'Concentration of expected earnings', '<div id="eps-c5"></div><div class="card"><div class="eps-msg" id="eps-cm"></div><div class="eps-src" id="eps-ch"></div><div id="eps-cc"></div><div id="eps-cp" style="margin-top:14px"></div></div>') +
    sec('eps-s4', 'One stock: EPS estimate and what moved its price', '<div id="eps-c4"></div><div class="card"><div class="eps-msg" id="eps-em"></div><div id="eps-et"></div><div id="eps-ec" style="margin-top:14px"></div><div id="eps-ex"></div></div>') +
    sec('eps-s6', 'Data & method', '<div id="eps-c6"></div><div class="card" id="eps-data"></div>');
}
function render() {
  var set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }, d = domains();
  set('eps-c1', ctl('hero', [['to']])); set('eps-s1-n', 'whole index, not affected by the exclusions below · ' + spanTxt(S.hero.k1) + ' · ' + Y + ' EPS');
  hero();
  set('eps-c2', ctl('detail', [['ix', 'to']])); set('eps-s2-n', ctxLine(IXN[S.detail.ix], S.detail.k1)); set('eps-detail', detail());
  var cw = S.who; set('eps-c3', ctl('who', [['ix', 'to'], ['lvl', 'what', 'as'], ['side', 'n']])); set('eps-s3-n', ctxLine(IXN[cw.ix], cw.k1));
  var w = who(), unit = cw.lvl === 'sec' ? 'stock' : cw.lvl === 'ig' ? 'group' : 'sector', ixn = IXN[cw.ix];
  var nm = { e: 'EPS estimate', m: 'multiple (forward P/E)', p: 'price' }[w.W], own = { e: 'EPS change', m: 'P/E change', p: 'price return' }[w.W];
  set('eps-t3', w.contrib
    ? 'The ' + ixn + (w.W === 'p' ? ' returned ' + pc(w.v.total.ret) : '\'s EPS grew ' + pc(w.v.total.g)) + '. Each bar is how many of those points a ' + unit + ' added.'
    : 'Each bar is the ' + unit + '\'s own ' + own + ', whatever its weight.');
  barList(document.getElementById('eps-who'), w.rows, { pos: C.pos, neg: C.neg, domain: w.dom, unit: w.contrib ? 'pp' : '%',
    axisTitle: w.contrib ? 'points of the index ' + (w.W === 'p' ? 'price return' : 'EPS growth') : 'change of the ' + nm,
    total: w.contrib ? { label: 'Total, ' + w.v.total.n + ' stocks', v: w.total } : null });
  set('eps-who-n', w.note);
  var eb = estBlock(); set('eps-c4', ctl('est', [['stock', 'to']])); set('eps-s4-n', 'not affected by the exclusions · ' + Y + ' EPS'); set('eps-em', eb.msg); set('eps-ex', eb.ix);
  set('eps-et', eb.data ? cards(eb.data, spanTxt(eb.k)) : '<div class="eps-split">No EPS estimate or price to build it.</div>');
  set('eps-ec', eb.table);
  set('eps-c5', ctl('conc', [['ix', 'n2'], ['dates']])); set('eps-s5-n', 'whole index, not affected by the exclusions · ' + Y + ' EPS expectations');
  var cb = concBlock();
  set('eps-cm', cb.msg); set('eps-ch', cb.how); set('eps-cp', cb.list);
  stackBars(document.getElementById('eps-cc'), cb.rows, { color: C.eps, restLabel: 'all other companies', title: 'Share of expected ' + Y + ' earnings: top ' + cb.n + ' companies' });
  var dOpen = S.data.open, dc = document.getElementById('eps-data');
  set('eps-c6', '<div class="eps-ctl"><div><button class="ndx-tab-btn" data-act="dopen">' + (dOpen ? 'Hide' : 'Show') + ' data &amp; method</button></div></div>' + (dOpen ? ctl('data', [['ix', 'to']]) : ''));
  set('eps-s6-n', dOpen ? IXN[S.data.ix] + ' · ' + spanTxt(S.data.k1) : 'hidden · how the numbers are built, coverage and caveats');
  if (dc) { dc.style.display = dOpen ? '' : 'none'; dc.innerHTML = dOpen ? dataBlock() : ''; }
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
  else if (act === 'dopen') S.data.open = !S.data.open;
  else if (act === 'popkeep') return;
  else if (act === 'popclose') S.conc.pop = null;
  else if (act === 'cdate') { var kk = +v, i = S.conc.ks.indexOf(kk); if (i < 0) S.conc.ks.push(kk); else if (S.conc.ks.length > 1) S.conc.ks.splice(i, 1); }
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
  Promise.all([import('./eps-attribution-data.js'), epsSourcesReady()]).then(function (all) {
    var m = all[0];
    if (!all[1]) { root.innerHTML = '<div class="ma-pending">The Nasdaq-100 data failed to load, so this tab cannot be built. Please refresh the page.</div>'; started = false; return; }
    E = makeEngine(visible(m.EPS_DATA));
    var unit = {}; E.secs.forEach(function (s) { unit[s.t] = s; }); setUnitLookup(function (t) { return unit[t]; }); K0 = Math.max(0, E.dates.indexOf('2026-01-02')); S = initialState(); skeleton();
    root.addEventListener('click', function (e) { var t = e.target.closest('[data-act]'); if (!t || t.tagName === 'INPUT') return; e.preventDefault(); onAct(t); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.conc.pop != null) { S.conc.pop = null; render(); } });
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
