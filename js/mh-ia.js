// mh-ia.js — Market History ▸ the Index Analysis sections, for 1995-2005, in the SAME format as Market Analysis ▸ Index Analysis
// (same markup and classes as js/spx-sector-alpha.js · ma-detail.js · spx-securities.js · market-analysis.js; Winners vs Losers uses distribution() from ma-charts.js).
// The data is the study's: the S&P 500 members at the first trading day of each year, their weights and price returns (docs/MARKET_HISTORY.md).
// A name that stopped trading during a year is carried at its last close. If Index Analysis changes its format, change it here too.
import { D, NK, SEC_COL, esc, n1, pc, med, snapLbl, exitYear, FATE_COL, px, lvl } from './mh-util.js';
import { dumbbell, distribution } from './ma-charts.js';

var YS = D.years, NY = YS.length, SECS = D.meta.sectors;
var FATE_SHORT = { SPX: 'In S&P 500', LIVE: 'Listed', ACQ: 'Acquired', BK: 'Bankrupt', OTH: 'Delisted' };
function el(id) { return document.getElementById(id); }
function colr(v) { return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function sg2(v) { if (v == null) return '—'; if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2); }
function sg1(v) { if (v == null) return '—'; if (Math.abs(v) < 0.05) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1); }
function trunc(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function tk(s) { return s.t || s.n; }

// ─── the data, in the shape the Index Analysis sections read ───
var MEM = YS.map(function (y, k) { return D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }); });
var GROUPS = {};            // industry group -> sector
D.secs.forEach(function (s) { if (s.g && !GROUPS[s.g]) GROUPS[s.g] = s.s; });
var AG = {};
function agg(k, level) {   // { name: { w, c, r, n } } for the sectors or industry groups of year k
  var key = k + level; if (AG[key]) return AG[key];
  var o = {};
  MEM[k].forEach(function (s) { var n = level === 'ig' ? (s.g || 'Unclassified') : s.s, a = o[n] || (o[n] = { w: 0, c: 0, n: 0 }); a.w += s.w[k]; a.c += s.w[k] * s.r[k] / 100; a.n++; });
  Object.keys(o).forEach(function (n) { o[n].r = o[n].w > 0 ? o[n].c / o[n].w * 100 : null; });
  return (AG[key] = o);
}
function elig(s, k) { return s.w[k] != null && s.r[k] != null && !(s.x && +s.x.slice(0, 4) === YS[k]); }   // a member for the whole year (did not stop trading in it)
function igList() { return Object.keys(GROUPS).sort(function (a, b) { return (GROUPS[a] === GROUPS[b] ? 0 : SECS.indexOf(GROUPS[a]) - SECS.indexOf(GROUPS[b])) || (a < b ? -1 : 1); }); }

var S = {
  sec: { level: 'sec', one: false, show: 'ret', rel: false, years: {}, secs: {}, igs: {} },
  det: { year: 1999, excl: {}, open: {} },
  beat: { f: {}, excl: {}, sec: {}, ig: {} },
  top: { years: { 1999: true }, n: 10, custom: 0, side: 'pos', info: 'sector', ret: true },
  wl: { year: 1999, bin: null }
};
YS.forEach(function (y) { S.sec.years[y] = y >= 1998 && y <= 2002; });   // opens on the narrow peak and the break; "All years" is one click
SECS.forEach(function (n) { S.sec.secs[n] = true; });
Object.keys(GROUPS).forEach(function (n) { S.sec.igs[n] = true; });

function seg(act, opts, cur) {
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function (o) { return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" data-act="' + act + '" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function q(label, ctl) { return '<span style="display:inline-flex;align-items:center;gap:8px"><span class="sb-secrow-lbl" style="margin-right:0">' + label + '</span>' + ctl + '</span>'; }
function tab(act, on, v, label, extra) { return '<button class="ndx-tab-btn' + (on ? ' active' : '') + '" data-act="' + act + '" data-v="' + v + '"' + (extra || '') + '>' + label + '</button>'; }

// ═══ Sector Return / Contribution ═══════════════════════════════════
function secNames() { return S.sec.level === 'ig' ? igList() : SECS; }
function secPicked() { return S.sec.level === 'ig' ? S.sec.igs : S.sec.secs; }
function secVal(n, y) {
  var k = YS.indexOf(+y), a = agg(k, S.sec.level)[n]; if (!a) return null;
  if (S.sec.show === 'attr') return a.c;
  return S.sec.rel ? (a.r == null ? null : a.r - D.index[k].pub) : a.r;
}
function onYears() { return YS.filter(function (y) { return S.sec.years[y]; }); }
function secBar(lbl, v, maxV, hl) {
  var u = S.sec.rel && S.sec.show === 'ret' ? ' pp' : '%';
  if (v == null) return '<div class="sby' + (hl ? ' sby-hl' : '') + '"><span class="sbyl">' + lbl + '</span><div class="sbtr-div"></div><span class="sbi" style="color:var(--mu);font-weight:600">n/a</span></div>';
  if (Math.abs(v) < 0.005) v = 0;
  var pct = Math.min(Math.abs(v) / maxV * 50, 50), left = v >= 0 ? 50 : 50 - pct;
  return '<div class="sby' + (hl ? ' sby-hl' : '') + '"><span class="sbyl">' + lbl + '</span><div class="sbtr-div"><div class="sbfl-div" style="left:' + left + '%;width:' + pct + '%;background:' + (v >= 0 ? '#1E3A5F' : '#9B2A20') + '"></div></div>' +
    '<span class="sbi" style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) + u + '</span></div>';
}
function renderSector() {
  var host = el('mh-ia-sector'); if (!host) return;
  var A = S.sec, attr = A.show === 'attr', ig = A.level === 'ig', ys = onYears(), P = secPicked(), lastY = ys[ys.length - 1];
  var qs = q('1 · Level', seg('iaSecLevel', [['sec', 'Sectors'], ['ig', 'Industry Groups']], A.level)) + q('2 · How many', seg('iaSecOne', [['one', 'One'], ['multi', 'Multiple']], A.one ? 'one' : 'multi')) +
    q('3 · Show', seg('iaSecShow', [['ret', 'Returns'], ['attr', 'Contribution to the S&amp;P 500']], A.show)) + (attr ? '' : '<span style="margin-left:auto">' + seg('iaSecRel', [['abs', 'Absolute'], ['rel', 'Relative']], A.rel ? 'rel' : 'abs') + '</span>');
  var names = secNames().slice().sort(function (a, b) { return (secVal(b, lastY) == null ? -1e9 : secVal(b, lastY)) - (secVal(a, lastY) == null ? -1e9 : secVal(a, lastY)); });
  var chips = '<span class="sb-secrow-lbl">' + (ig ? 'Industry groups:' : 'Sectors:') + '</span>' + names.map(function (n) { return '<span class="sb-secchip' + (P[n] ? ' active' : '') + '" data-act="iaSecPick" data-v="' + esc(n) + '">' + esc(n) + '</span>'; }).join('') +
    (A.one ? '' : '<span style="margin-left:auto;display:inline-flex;gap:6px"><button class="sb-secchip-all" style="margin-left:0" data-act="iaSecAll" data-v="1">All</button><button class="sb-secchip-all" style="margin-left:0" data-act="iaSecAll" data-v="0">None</button></span>');
  var dates = '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="sb-secrow-lbl">Years</span>' + YS.map(function (y) { return '<span class="sb-secchip' + (A.years[y] ? ' active' : '') + '" data-act="iaSecYear" data-v="' + y + '">' + y + '</span>'; }).join('') +
    '<span style="margin-left:auto;display:inline-flex;gap:6px"><button class="sb-secchip-all" style="margin-left:0" data-act="iaSecYears" data-v="1">All years</button></span></div>';
  var rows = names.filter(function (n) { return P[n]; }), maxV = 0;
  rows.forEach(function (n) { ys.forEach(function (y) { var v = secVal(n, y); if (v != null && Math.abs(v) > maxV) maxV = Math.abs(v); }); });
  maxV = Math.max(maxV, attr ? 5 : A.rel ? 15 : 30);
  var NM = 'width:230px;min-width:230px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', h = '';
  function row(html, vals, style, title) {
    h += '<div class="sbr"><span class="sbn" style="' + NM + (style ? ';' + style : '') + '" title="' + esc(title || '') + '">' + html + '</span><div class="sbbs">' + ys.map(function (y, i) { return secBar(String(y), vals[i], maxV, true); }).join('') + '</div></div>';
  }
  if (attr) row('S&amp;P 500, published', ys.map(function (y) { return D.index[YS.indexOf(y)].pub; }), 'font-weight:700;color:var(--navy)');
  rows.forEach(function (n) {
    var dot = '<span style="display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:6px;background:' + SEC_COL[ig ? GROUPS[n] : n] + '"></span>';
    row(dot + esc(n), ys.map(function (y) { return secVal(n, y); }), '', n + (ig ? ' · ' + GROUPS[n] : ''));
  });
  if (attr && !A.one && names.every(function (n) { return P[n]; })) row('Not explained (published index minus the members)', ys.map(function (y) { var k = YS.indexOf(y); return D.index[k].pub - D.index[k].basket; }), 'color:var(--mu);font-style:italic');
  host.innerHTML = '<div class="sb-secrow" style="gap:16px">' + qs + '</div><div class="sb-secrow">' + chips + '</div><div class="sb-secrow" style="flex-direction:column;align-items:stretch;gap:10px">' + dates + '</div><div class="sbrs">' + h + '</div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:12px;line-height:1.5">' + (attr
      ? 'Contribution = points of the index return each ' + (ig ? 'industry group' : 'sector') + ' added: its weight at the start of the year × the return of its members. The members\' return differs from the published index by the names without a market value in the workbook and the names that joined during the year.'
      : 'Price return of the members of each ' + (ig ? 'industry group' : 'sector') + ' in the year, weighted by their size at the start of the year. Relative = minus the published S&amp;P 500, in pp.') + ' Sectors and groups are Bloomberg\'s today, applied to every year.</div>';
}

// ═══ Attribution Detail & Simulation ════════════════════════════════
function detail(k, excl) {
  var off = function (s) { return !!(excl[s.g] || excl['sec:' + s.s]); };
  var inc = MEM[k].filter(function (s) { return !off(s); }), W = 0, T1 = 0;
  inc.forEach(function (s) { W += s.w[k]; T1 += s.w[k] * (1 + s.r[k] / 100); });
  var o = { byIG: {}, bySec: {}, wOpenIG: {}, wCloseIG: {}, wOpen: {}, wClose: {}, total: 0, residual: null };
  inc.forEach(function (s) {
    var g = s.g || 'Unclassified', c = s.w[k] * s.r[k] / W, w0 = s.w[k] / W * 100, w1 = s.w[k] * (1 + s.r[k] / 100) / T1 * 100;
    o.byIG[g] = (o.byIG[g] || 0) + c; o.wOpenIG[g] = (o.wOpenIG[g] || 0) + w0; o.wCloseIG[g] = (o.wCloseIG[g] || 0) + w1;
    o.bySec[s.s] = (o.bySec[s.s] || 0) + c; o.wOpen[s.s] = (o.wOpen[s.s] || 0) + w0; o.wClose[s.s] = (o.wClose[s.s] || 0) + w1; o.total += c;
  });
  if (!Object.keys(excl).some(function (x) { return excl[x]; })) { o.residual = D.index[k].pub - o.total; o.total = D.index[k].pub; }
  return o;
}
function detFmtC(v) { if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>'; if (Math.abs(v) < 0.005) v = 0; return '<span style="color:' + colr(v) + ';font-weight:600">' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) + '%</span>'; }
function detFmtW(a, b) { return a == null && b == null ? '<span style="color:var(--mu)">—</span>' : (a || 0).toFixed(2) + '% → ' + (b || 0).toFixed(2) + '%'; }
function renderDetail() {
  var host = el('mh-ia-detail'); if (!host) return;
  var B = S.det, k = YS.indexOf(B.year), d = detail(k, B.excl), sim = Object.keys(B.excl).some(function (x) { return B.excl[x]; });
  var base = detail(NY - 1, {}), igs = igList();
  var secs = SECS.slice().sort(function (a, b) { return (base.bySec[b] || 0) - (base.bySec[a] || 0); });
  var dot = function (on, sz) { sz = sz || 16; return '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;vertical-align:middle;' + (on ? 'background:var(--navy);border:2px solid var(--navy)' : 'background:transparent;border:2px solid #9AAAB8') + '"></span>'; };
  var body = '';
  secs.forEach(function (sec) {
    var off = !!B.excl['sec:' + sec], list = igs.filter(function (g) { return GROUPS[g] === sec; }).sort(function (a, b) { return (base.byIG[b] || 0) - (base.byIG[a] || 0); }), canOpen = list.length > 1, open = canOpen && B.open[sec];
    body += '<tr style="cursor:pointer;background:var(--surface);' + (off ? 'opacity:.42' : '') + '" data-act="iaDetTog" data-v="sec:' + esc(sec) + '"><td style="text-align:center;padding:6px 4px">' + dot(!off) + '</td>' +
      '<td style="text-align:center;padding:6px 0">' + (canOpen ? '<span data-act="iaDetOpen" data-v="' + esc(sec) + '" style="cursor:pointer;color:var(--mu);font-size:10px">' + (open ? '▲' : '▼') + '</span>' : '') + '</td><td style="font-weight:700;color:var(--navy)">' + sec + '</td>' +
      '<td class="num ma-dt-k" style="color:var(--mu);font-size:11px">' + (off ? '—' : detFmtW(d.wOpen[sec], d.wClose[sec])) + '</td><td class="num" style="font-weight:700">' + (off ? '<span style="color:var(--mu)">—</span>' : detFmtC(d.bySec[sec])) + '</td></tr>';
    if (open) list.forEach(function (g) {
      var gx = off || !!B.excl[g];
      body += '<tr style="cursor:pointer;' + (gx ? 'opacity:.38' : '') + '" data-act="iaDetTog" data-v="' + esc(g) + '"><td style="text-align:center;padding:5px 4px 5px 10px">' + dot(!gx, 13) + '</td><td></td><td style="padding-left:20px;font-size:12px">' + esc(g) + '</td>' +
        '<td class="num ma-dt-k" style="color:var(--mu);font-size:11px">' + (gx ? '—' : detFmtW(d.wOpenIG[g], d.wCloseIG[g])) + '</td><td class="num" style="font-weight:700">' + (gx ? '<span style="color:var(--mu)">—</span>' : detFmtC(d.byIG[g])) + '</td></tr>';
    });
  });
  body += '<tr><td></td><td></td><td style="color:var(--mu);font-style:italic" title="Published S&amp;P 500 return minus the members\' return: names without a market value in the workbook, names that joined during the year">Not explained</td><td class="num ma-dt-k" style="color:var(--mu)">—</td><td class="num" style="color:var(--mu)">' + (sim ? '—' : detFmtC(d.residual)) + '</td></tr>';
  body += '<tr style="border-top:2px solid var(--navy);font-weight:700"><td></td><td></td><td style="color:var(--navy)">Total</td><td class="ma-dt-k"></td><td class="num">' + detFmtC(d.total) + '</td></tr>';
  host.innerHTML = '<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-bottom:10px"><div style="display:flex;gap:3px;flex-wrap:wrap">' + YS.map(function (y) { return tab('iaDetYear', y === B.year, y, y); }).join('') + '</div>' +
    '<span style="margin-left:auto;display:flex;gap:3px"><button class="ndx-tab-btn" data-act="iaDetAll" data-v="1">Expand All</button><button class="ndx-tab-btn" data-act="iaDetAll" data-v="0">Collapse All</button><button class="sb-tbtn" data-act="iaDetReset" data-v="1">Reset</button></span></div>' +
    '<table class="rt" style="width:100%;table-layout:fixed"><colgroup><col style="width:32px"><col style="width:26px"><col><col style="width:150px"><col style="width:100px"></colgroup><thead><tr><th></th><th></th><th></th><th colspan="2" class="ma-dt-k" style="text-align:center;color:var(--navy)">S&amp;P 500 · members at the start of ' + B.year + '</th></tr>' +
    '<tr><th></th><th></th><th>Sector / Industry Group</th><th class="num ma-dt-k">Weight: open → close</th><th class="num">Contribution</th></tr></thead><tbody>' + body + '</tbody></table>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px">Click a row to exclude it from the index; the rest rescale to 100%. Weights: the start of the year, and the end of the year after each name\'s return. Contribution = weight × return; a name that stopped trading is carried at its last close. In a simulation "Not explained" disappears: the total is the members\' return without the excluded rows.</div>';
}

// ═══ Sector Summary — Market Beaters ════════════════════════════════
function fmtRet(v) { if (v == null || isNaN(v)) return '<span style="color:var(--mu)">&mdash;</span>'; return '<span style="color:' + colr(v) + ';font-weight:600">' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) + '%</span>'; }
function after3(s, kMax) {   // price return over the 3 years after year kMax (to Dec 2005 at most), counting the Bloomberg prices after the index
  var a = kMax + 1, b = Math.min(kMax + 4, NK); if (b <= a) return null;
  var p0 = px(s, a), p1 = lvl(s, b); return p0 != null && p1 != null ? (p1 / p0 - 1) * 100 : null;
}
function beatState() {
  var f = S.beat.f, act = [];
  YS.forEach(function (y, k) { if (f['p' + y] || f['b' + y]) act.push(k); });
  var data = D.secs.filter(function (s) { return act.every(function (k) { var y = YS[k]; return elig(s, k) && (!f['p' + y] || s.r[k] > 0) && (!f['b' + y] || s.r[k] > D.index[k].pub); }); });
  var pool = D.secs.filter(function (s) { return act.every(function (k) { return elig(s, k); }); });
  return { act: act, match: data, pool: pool };
}
function renderBeaters() {
  var host = el('mh-ia-beat'); if (!host) return;
  var f = S.beat.f, bs = beatState(), kMax = bs.act.length ? Math.max.apply(null, bs.act) : null, match = {};
  bs.match.forEach(function (s) { if (!S.beat.excl[s.s]) match[s.f] = 1; });
  var chips = YS.map(function (y) {
    return '<label class="fc' + (f['p' + y] ? ' active' : '') + '"><input type="checkbox" data-act="iaFilt" data-v="p' + y + '"' + (f['p' + y] ? ' checked' : '') + '> &#x2713; Positive ' + y + '</label>' +
      '<label class="fc' + (f['b' + y] ? ' active' : '') + '"><input type="checkbox" data-act="iaFilt" data-v="b' + y + '"' + (f['b' + y] ? ' checked' : '') + '> &#x2191; Beat the S&amp;P 500 ' + y + '</label>';
  }).join('') + '<button data-act="iaFiltClear" data-v="1" style="padding:5px 11px;border:1px solid var(--bdr);border-radius:7px;background:var(--w);cursor:pointer;font-size:11px;color:var(--mu)">Clear</button>';
  var exc = '<span class="sb-secrow-lbl">Exclude:</span>' + SECS.map(function (k2) { var x = S.beat.excl[k2]; return '<span class="sb-secchip' + (x ? ' active' : '') + '" style="' + (x ? 'background:#9B2A20;border-color:#9B2A20' : '') + '" data-act="iaBeatExcl" data-v="' + esc(k2) + '">' + k2 + '</span>'; }).join('') + '<button class="sb-secchip-all" data-act="iaBeatExclClear" data-v="1">Clear</button>';
  var pool = bs.pool.filter(function (s) { return !S.beat.excl[s.s]; }), bySec = {};
  pool.forEach(function (s) { (bySec[s.s] = bySec[s.s] || []).push(s); });
  var rows = SECS.filter(function (x) { return bySec[x]; }), html = '', totM = 0, totS = 0, allM = [];
  var after = function (list) { return kMax == null ? null : med(list.map(function (s) { return after3(s, kMax); })); };
  var inSpx = function (list) { return list.length ? list.filter(function (s) { return s.st === 'SPX'; }).length / list.length * 100 : null; };
  var tail = function (m) { return '<td style="text-align:right">' + (kMax == null || !m.length ? '<span style="color:var(--mu)">&mdash;</span>' : fmtRet(after(m))) + '</td><td style="text-align:right;color:var(--mu)">' + (m.length ? n1(inSpx(m), 0) + '%' : '&mdash;') + '</td>'; };
  rows.forEach(function (sec) {
    var all = bySec[sec], m = all.filter(function (s) { return match[s.f]; }), pctv = all.length ? m.length / all.length * 100 : 0, cc = SEC_COL[sec], open = S.beat.sec[sec];
    totM += m.length; totS += all.length; allM = allM.concat(m);
    var pcol = pctv >= 70 ? 'var(--pos)' : pctv >= 40 ? 'var(--text)' : 'var(--mu)';
    html += '<tr data-act="iaBeatSec" data-v="' + esc(sec) + '" style="cursor:pointer"><td><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">' + (open ? '&#x25BC;' : '&#x25B6;') + '</span><span class="sch" style="background:' + cc + '22;color:' + cc + ';font-weight:600;margin-left:4px">' + sec + '</span></td>' +
      '<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">' + m.length + '</td><td style="text-align:right;font-weight:600;color:' + pcol + '">' + pctv.toFixed(0) + '%</td><td style="text-align:right;color:var(--mu)">' + all.length + '</td>' + tail(m) + '</tr>';
    if (!open) return;
    var ig = {};
    all.forEach(function (s) { var g = s.g || 'Unclassified'; (ig[g] = ig[g] || { all: [], m: [] }).all.push(s); if (match[s.f]) ig[g].m.push(s); });
    var gs = Object.keys(ig);
    if (gs.length < 2) { html += companies(m, 32, kMax); return; }
    gs.sort().forEach(function (g) {
      var key = sec + '|' + g, gopen = S.beat.ig[key], x = ig[g], p = all.length ? x.m.length / all.length * 100 : 0;
      html += '<tr data-act="iaBeatIg" data-v="' + esc(key) + '" style="cursor:pointer;background:#FAFCFE"><td style="padding-left:32px"><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">' + (gopen ? '&#x25BC;' : '&#x25B6;') + '</span><span style="margin-left:4px">' + esc(g) + '</span></td>' +
        '<td style="text-align:right;font-weight:600;color:var(--navy)">' + x.m.length + '</td><td style="text-align:right;color:' + (p >= 70 ? 'var(--pos)' : p >= 40 ? 'var(--text)' : 'var(--mu)') + '">' + p.toFixed(0) + '%</td><td style="text-align:right;color:var(--mu)">' + x.all.length + '</td>' + tail(x.m) + '</tr>';
      if (gopen) html += companies(x.m, 58, kMax);
    });
  });
  html += '<tr style="border-top:2px solid var(--navy);background:var(--surface)"><td style="font-weight:700;color:var(--navy);text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding-left:25px">Total</td><td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">' + totM + '</td><td style="text-align:right;font-weight:700;color:var(--navy)">' + (totS ? (totM / totS * 100).toFixed(0) : 0) + '%</td><td style="text-align:right;color:var(--mu);font-weight:600">' + totS + '</td>' + tail(allM) + '</tr>';
  var yrTxt = bs.act.length ? bs.act.map(function (k) { return YS[k]; }).join(', ') : null;
  host.innerHTML = '<div class="fbar">' + chips + '</div><div class="sb-secrow">' + exc + '</div>' +
    '<div style="font-size:11px;color:var(--mu);line-height:1.55;margin:6px 2px 4px"><i>Positive</i> = price return above 0% that year · <i>Beat</i> = above the S&amp;P 500 (published). A year counts only for a company that was a member for the <b>whole year</b> (one that stopped trading during it is left out of that year\'s filters and counts). ' +
    (yrTxt ? 'Filtering ' + yrTxt + ': the last two columns follow the matching stocks <b>after ' + YS[kMax] + '</b>: their median price return over the next 3 years (to Dec 2005 at most) and the share still in the S&amp;P 500 today.' : 'Pick years to filter; no filter = every name that was a member.') + '</div>' +
    '<table class="rt" style="margin-top:6px"><thead><tr><th>Sector</th><th style="text-align:right">Stocks Matching</th><th style="text-align:right">% of Sector</th><th style="text-align:right">Total in Sector</th><th style="text-align:right" title="Median price return of the matching stocks in the 3 years after the last year filtered">Next 3 yrs, median</th><th style="text-align:right" title="Share of the matching stocks that are in the S&amp;P 500 today">In S&amp;P 500 today</th></tr></thead><tbody>' + html + '</tbody></table>';
}
function companies(list, indent, kMax) {
  var m = list.slice().sort(function (a, b) { var k = kMax == null ? 4 : kMax; return (b.r[k] != null ? b.r[k] : -999) - (a.r[k] != null ? a.r[k] : -999); });
  var th = 'padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500';
  var h = '<tr><td colspan="6" style="padding:0;background:#FAFCFE"><div style="padding:8px 14px 12px ' + indent + 'px"><div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:600;margin-bottom:6px">Matched companies (' + m.length + ')</div>';
  if (!m.length) return h + '<div style="font-size:11px;color:var(--mu);font-style:italic;padding:4px 0">No companies match the current filters.</div></div></td></tr>';
  h += '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="border-bottom:1px solid var(--bdr)"><th style="text-align:left;' + th + '">Ticker</th><th style="text-align:left;' + th + '">Company</th>' + YS.map(function (y) { return '<th style="text-align:right;' + th + '">' + y + '</th>'; }).join('') + '<th style="text-align:left;' + th + '">Today</th></tr></thead>';
  m.forEach(function (s) {
    h += '<tr style="border-bottom:.5px solid #EEF2F7"><td style="padding:5px 8px;font-weight:600;color:var(--navy);font-size:11px">' + esc(s.t || '') + '</td><td style="padding:5px 8px">' + esc(trunc(s.n, 30)) + '</td>' +
      YS.map(function (y, k) {
        var v = s.r[k], e = v == null && px(s, k) != null && px(s, k + 1) != null ? (px(s, k + 1) / px(s, k) - 1) * 100 : null;
        if (v == null && e == null) return '<td style="padding:5px 8px;text-align:right;color:var(--mu)">&mdash;</td>';
        if (v == null) return '<td style="padding:5px 8px;text-align:right;color:var(--mu);font-style:italic;opacity:.7" title="Not in the S&amp;P 500 that year (Bloomberg price)">' + (e >= 0 ? '+' : '−') + Math.abs(e).toFixed(0) + '%</td>';
        if (!elig(s, k)) return '<td style="padding:5px 8px;text-align:right;color:var(--mu);font-style:italic;opacity:.6" title="Stopped trading during the year: left out of the filters">' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(0) + '%</td>';
        return '<td style="padding:5px 8px;text-align:right;color:' + colr(v) + ';font-weight:600">' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(0) + '%</td>';
      }).join('') + '<td style="padding:5px 8px;white-space:nowrap"><span class="mh-badge" style="background:' + FATE_COL[s.st] + '">' + FATE_SHORT[s.st] + '</span>' + (exitYear(s) ? ' <span style="color:var(--mu)">' + exitYear(s) + '</span>' : '') + '</td></tr>';
  });
  return h + '</table></div></div></td></tr>';
}

// ═══ Top Contributors ═══════════════════════════════════════════════
function topSecs(y) {
  var k = YS.indexOf(y), tot = 0; MEM[k].forEach(function (s) { tot += s.w[k] * (1 + s.r[k] / 100); });
  return MEM[k].map(function (s) { return { name: tk(s), co: s.n, sect: s.s, grp: s.g || '', ret: s.r[k], w0: s.w[k], contrib: s.w[k] * s.r[k] / 100, st: s.st, x: exitYear(s) }; });
}
function renderTop() {
  var host = el('mh-ia-top'); if (!host) return;
  var P = S.top, years = YS.filter(function (y) { return P.years[y]; }), N = P.custom > 0 ? P.custom : P.n, showAll = N === 0, showPos = P.side !== 'neg', showNeg = P.side !== 'pos', yd = {};
  years.forEach(function (y) {
    var ranked = topSecs(y).sort(function (a, b) { return b.contrib - a.contrib; });
    ranked.forEach(function (d, i) { d.rank = i + 1; });
    var n = showAll ? ranked.length : Math.min(N, ranked.length), pos = ranked.slice(0, n), neg = ranked.slice(P.side === 'both' ? Math.max(n, ranked.length - n) : ranked.length - n).reverse();
    [pos, neg].forEach(function (l) { var c = 0; l.forEach(function (d) { c += d.contrib; d.cum = c; }); });
    yd[y] = { n: ranked.length, pos: showPos ? pos : [], neg: showNeg ? neg : [], total: D.index[YS.indexOf(y)].pub };
  });
  var SEP = '<div style="width:1px;height:16px;background:var(--rule);flex-shrink:0"></div>', LBL = function (t) { return '<span style="font-size:11px;color:var(--mu)">' + t + '</span>'; };
  var html = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap"><div style="display:flex;gap:4px;flex-wrap:wrap">' + YS.map(function (y) { return tab('iaTopYear', P.years[y], y, y); }).join('') + '</div>' + SEP +
    '<div style="display:flex;gap:4px">' + [5, 10, 20, 0].map(function (nv) { return tab('iaTopN', P.custom === 0 && P.n === nv, nv, nv === 0 ? 'All' : 'Top ' + nv); }).join('') + '</div>' +
    '<input type="number" min="1" max="600" placeholder="Custom" value="' + (P.custom > 0 ? P.custom : '') + '" style="width:70px;font-size:11px;padding:3px 6px;border:1px solid var(--rule);border-radius:4px;background:var(--surface);color:var(--navy)" data-act="iaTopCustom">' + SEP +
    LBL('Show') + '<div style="display:flex;gap:4px">' + [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']].map(function (o) { return tab('iaTopSide', P.side === o[0], o[0], o[1]); }).join('') + '</div>' + SEP +
    LBL('Column') + '<div style="display:flex;gap:4px">' + [['', 'None'], ['sector', 'Sector'], ['ig', 'Industry Group'], ['fate', 'Today']].map(function (o) { return tab('iaTopInfo', P.info === o[0], o[0], o[1]); }).join('') + '</div>' + tab('iaTopRet', P.ret, 1, 'Ret%') + '</div>';
  var info = P.info, showRet = P.ret, cpy = 4 + (info ? 1 : 0) + (showRet ? 1 : 0);
  var TH = 'padding:4px 8px;color:var(--mu);font-weight:500;white-space:nowrap', GAP = 'border-left:12px solid transparent';
  var thead = '<thead><tr>' + years.map(function (y, i) { return '<th colspan="' + cpy + '" style="text-align:left;padding:4px 8px 2px;color:var(--navy);font-weight:700;border-bottom:1px solid var(--rule);' + (i ? GAP : '') + '">' + y + '</th>'; }).join('') +
    '</tr><tr style="border-bottom:1.5px solid var(--rule)">' + years.map(function (y, i) {
      return '<th style="text-align:right;' + TH + ';' + (i ? GAP : '') + '" title="Rank by contribution among all ' + yd[y].n + ' members of the year">Rank</th><th style="text-align:left;' + TH + '">Ticker</th>' +
        (info ? '<th style="text-align:left;' + TH + '">' + (info === 'ig' ? 'Industry Group' : info === 'fate' ? 'Today' : 'Sector') + '</th>' : '') + '<th style="text-align:right;' + TH + '">Contrib</th><th style="text-align:right;' + TH + '">Cum.</th>' + (showRet ? '<th style="text-align:right;' + TH + '">Ret%</th>' : '');
    }).join('') + '</tr></thead>';
  function cells(d, i) {
    var first = i ? GAP + ';' : '';
    if (!d) return '<td style="' + first + 'padding:4px 8px"></td>' + new Array(cpy).join('<td></td>');
    var NUM = 'text-align:right;padding:4px 8px;font-variant-numeric:tabular-nums', cat = info === 'ig' ? d.grp : d.sect;
    return '<td style="' + first + NUM + ';color:var(--mu);font-size:11px">' + d.rank + '</td><td style="padding:4px 8px;white-space:nowrap" title="' + esc(d.co) + '"><b style="font-size:12px;color:var(--navy)">' + esc(trunc(d.name, 22)) + '</b></td>' +
      (info === 'fate' ? '<td style="padding:4px 8px;font-size:11px;white-space:nowrap"><span class="mh-badge" style="background:' + FATE_COL[d.st] + '">' + FATE_SHORT[d.st] + '</span>' + (d.x ? ' <span style="color:var(--mu)">' + d.x + '</span>' : '') + '</td>'
        : info ? '<td style="padding:4px 8px;font-size:11px;color:var(--mu);white-space:nowrap" title="' + esc(cat) + '">' + esc(trunc(cat, info === 'ig' ? 30 : 22)) + '</td>' : '') +
      '<td style="' + NUM + ';font-weight:600;color:' + colr(d.contrib) + '">' + sg2(d.contrib) + '%</td><td style="' + NUM + ';color:var(--mu);font-size:11px">' + sg2(d.cum) + '%</td>' +
      (showRet ? '<td style="' + NUM + ';font-size:11px;color:' + colr(d.ret) + '">' + sg1(d.ret) + '%</td>' : '');
  }
  function block(key, title) {
    var rows = Math.max.apply(null, years.map(function (y) { return yd[y][key].length; }).concat(0)); if (!rows) return '';
    var out = '<tr><td colspan="' + (cpy * years.length) + '" style="padding:8px 8px 3px;font-size:10.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:' + (key === 'pos' ? 'var(--pos)' : 'var(--neg)') + '">' + title + '</td></tr>';
    for (var r = 0; r < rows; r++) { out += '<tr style="border-bottom:.5px solid var(--rule);' + (r % 2 ? 'background:var(--surface)' : '') + '">'; years.forEach(function (y, i) { out += cells(yd[y][key][r], i); }); out += '</tr>'; }
    return out;
  }
  var tbody = '<tbody>' + (showPos ? block('pos', showAll ? 'All members, top to bottom' : 'Top ' + N + ' contributors') : '') + (showNeg && !(showAll && showPos) ? block('neg', showAll ? 'All members, bottom to top' : 'Bottom ' + N + ' contributors') : '') + '</tbody>';
  var foot = '<tfoot><tr style="border-top:2px solid var(--navy)">' + years.map(function (y, i) {
    var d = yd[y], shown = d.pos.concat(d.neg).reduce(function (s, x) { return s + x.contrib; }, 0), share = Math.abs(d.total) > 1e-9 ? shown / d.total * 100 : 0;
    return '<td colspan="' + cpy + '" style="padding:7px 8px;font-size:11.5px;color:var(--navy);' + (i ? GAP : '') + '">Listed: <b style="color:' + colr(shown) + '">' + sg2(shown) + '%</b> of <b style="color:' + colr(d.total) + '">' + sg2(d.total) + '%</b> S&amp;P 500 return <span style="color:var(--mu)">(' + share.toFixed(0) + '%)</span></td>';
  }).join('') + '</tr></tfoot>';
  host.innerHTML = html + '<div style="overflow-x:auto"><table style="width:auto;border-collapse:collapse;font-size:12px">' + thead + tbody + foot + '</table></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5"><b>Contrib</b> = weight in the S&amp;P 500 at the start of the year × the year\'s return. <b>Cum.</b> = running total down the list. ' + (showRet ? '<b>Ret%</b> = the year\'s price return. ' : '') +
    '<b>Rank</b> = position among all members of that year, 1 = largest contributor. The share in brackets is the published index return; a name that stopped trading is carried at its last close.</div>';
}

// ═══ Winners vs Losers ══════════════════════════════════════════════
var WL_BINS = { split: 3, bins: [[-1e9, -50, '< −50%'], [-50, -25, '−50 to −25%'], [-25, 0, '−25 to 0%'], [0, 25, '0 to +25%'], [25, 50, '+25 to +50%'], [50, 100, '+50 to +100%'], [100, 1e9, '> +100%']] };
function renderWL() {
  var host = el('mh-ia-wl'); if (!host) return;
  var W = S.wl, k = YS.indexOf(W.year);
  host.innerHTML = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">' + YS.map(function (y) { return tab('iaWlYear', y === W.year, y, y); }).join('') + '</div><div id="mh-ia-wl-box"></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:6px">Members of the S&amp;P 500 at the start of ' + W.year + ', price return over the year; a name that stopped trading is carried at its last close. The bins are wider than in Index Analysis because 1990s returns were more spread out.</div>' + wlTable(k);
  distribution(el('mh-ia-wl-box'), MEM[k].map(function (s) { return { name: tk(s), co: s.n, ret: s.r[k] }; }), W, WL_BINS);
}
function wlTable(k) {
  var all = MEM[k], base = D.index[k].basket;
  var rows = SECS.map(function (sc) {
    var L = all.filter(function (s) { return s.s === sc; }); if (!L.length) return '';
    var up = L.filter(function (s) { return s.r[k] > 0; }).length, bt = L.filter(function (s) { return s.r[k] > D.index[k].pub; }).length, m = med(L.map(function (s) { return s.r[k]; }));
    return '<tr><td><span class="sch" style="background:' + SEC_COL[sc] + '22;color:' + SEC_COL[sc] + ';font-weight:600">' + sc + '</span></td><td style="text-align:right">' + L.length + '</td><td style="text-align:right">' + up + ' <span style="color:var(--mu)">' + n1(up / L.length * 100, 0) + '%</span></td><td style="text-align:right">' + bt + ' <span style="color:var(--mu)">' + n1(bt / L.length * 100, 0) + '%</span></td><td style="text-align:right">' + fmtRet(m) + '</td></tr>';
  }).join('');
  return '<table class="rt" style="margin-top:14px"><thead><tr><th>Sector</th><th style="text-align:right">Members</th><th style="text-align:right">Rose</th><th style="text-align:right">Beat the S&amp;P 500</th><th style="text-align:right">Median return</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

// ═══ handlers ═══════════════════════════════════════════════════════
export function renderIA() { renderSector(); renderDetail(); renderBeaters(); renderTop(); renderWL(); }
export function iaAct(a, v, t) {
  var A = S.sec;
  switch (a) {
    case 'iaSecLevel': A.level = v; if (A.one) keepOne(); return r(renderSector);
    case 'iaSecOne': A.one = v === 'one'; if (A.one) keepOne(); return r(renderSector);
    case 'iaSecShow': A.show = v; return r(renderSector);
    case 'iaSecRel': A.rel = v === 'rel'; return r(renderSector);
    case 'iaSecYear': if (A.years[v] && onYears().length === 1) return true; A.years[v] = !A.years[v]; return r(renderSector);
    case 'iaSecYears': YS.forEach(function (y) { A.years[y] = true; }); return r(renderSector);
    case 'iaSecPick': var P = secPicked(); if (A.one) { var o = {}; o[v] = true; if (A.level === 'ig') A.igs = o; else A.secs = o; } else { P[v] = !P[v]; if (!Object.keys(P).some(function (k) { return P[k]; })) P[v] = true; } return r(renderSector);
    case 'iaSecAll': var P2 = secPicked(); secNames().forEach(function (n) { P2[n] = v === '1'; }); if (v !== '1') keepOne(); return r(renderSector);
    case 'iaDetYear': S.det.year = +v; return r(renderDetail);
    case 'iaDetOpen': S.det.open[v] = !S.det.open[v]; return r(renderDetail);
    case 'iaDetAll': SECS.forEach(function (s) { S.det.open[s] = v === '1'; }); return r(renderDetail);
    case 'iaDetReset': S.det.excl = {}; return r(renderDetail);
    case 'iaDetTog':
      S.det.excl[v] = !S.det.excl[v];
      if (v.indexOf('sec:') === 0) igList().filter(function (g) { return GROUPS[g] === v.slice(4); }).forEach(function (g) { delete S.det.excl[g]; });
      if (!SECS.some(function (s) { return !S.det.excl['sec:' + s]; })) S.det.excl[v] = false;
      return r(renderDetail);
    case 'iaFilt': S.beat.f[v] = t.checked; return r(renderBeaters);
    case 'iaFiltClear': S.beat.f = {}; return r(renderBeaters);
    case 'iaBeatExcl': S.beat.excl[v] = !S.beat.excl[v]; return r(renderBeaters);
    case 'iaBeatExclClear': S.beat.excl = {}; return r(renderBeaters);
    case 'iaBeatSec': S.beat.sec[v] = !S.beat.sec[v]; return r(renderBeaters);
    case 'iaBeatIg': S.beat.ig[v] = !S.beat.ig[v]; return r(renderBeaters);
    case 'iaTopYear': if (S.top.years[v] && Object.keys(S.top.years).filter(function (k) { return S.top.years[k]; }).length === 1) return true; S.top.years[v] = !S.top.years[v]; return r(renderTop);
    case 'iaTopN': S.top.n = +v; S.top.custom = 0; return r(renderTop);
    case 'iaTopCustom': S.top.custom = +t.value > 0 ? Math.floor(+t.value) : 0; return r(renderTop);
    case 'iaTopSide': S.top.side = v; return r(renderTop);
    case 'iaTopInfo': S.top.info = v; return r(renderTop);
    case 'iaTopRet': S.top.ret = !S.top.ret; return r(renderTop);
    case 'iaWlYear': S.wl.year = +v; S.wl.bin = null; return r(renderWL);
  }
  return false;
}
function r(fn) { fn(); return true; }
function keepOne() { var P = secPicked(), k = secNames().filter(function (n) { return P[n]; })[0] || secNames()[0], o = {}; o[k] = true; if (S.sec.level === 'ig') S.sec.igs = o; else S.sec.secs = o; }
