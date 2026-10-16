// market-history.js — Market History (1995-2005): what happened to the S&P 500's leaders, laggards and everyone else,
// and which of the conditions of that cycle are (not) present today.
//
// Data: js/market-history-data.js (scripts/market-history/extract_history.py: the analyst's Bloomberg workbook + FRED, R. Shiller (S&P 500 monthly level), FINRA).
// Method, caveats and what is still missing: docs/MARKET_HISTORY.md.
// Prices, weights and returns of the index members only: no multiples, no fundamentals.
import { MHIST as D } from './market-history-data.js';
import { SPX_HOLDINGS } from './spx-holdings-data.js';
import { dumbbell } from './ma-charts.js';

var SEC_COL = { 'Technology': '#185FA5', 'Communications': '#0F6E56', 'Health Care': '#D85A30', 'Financials': '#7F77DD',
  'Consumer Discretionary': '#BA7517', 'Consumer Staples': '#3B6D11', 'Industrials': '#5A6E83', 'Energy': '#C0392B',
  'Materials': '#0B9D7A', 'Utilities': '#7C3AED', 'Real Estate': '#993556' };
var FATE_COL = { SPX: '#177A4E', LIVE: '#3E5A82', ACQ: '#9AA3AF', BK: '#9B2A20', OTH: '#C79A2B' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var K0 = D.bases.indexOf('1999-12-31');            // the cohort snapshot
var NK = D.bases.length;

var st = { fn: { y: 1999, side: 'top' }, wc: [K0, 8] };
var root = null, tip = null;

// ─── helpers ───────────────────────────────────────────────
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function n1(v, d) { return v == null ? '—' : v.toFixed(d == null ? 1 : d); }
function pc(v, d) { if (v == null) return '—'; d = d == null ? 1 : d; if (Math.abs(v) < Math.pow(10, -d) / 2) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%'; }
function pp(v, d) { if (v == null) return '—'; d = d == null ? 2 : d; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + ' pp'; }
function cls(v) { return v == null ? '' : v >= 0 ? 'mh-pos' : 'mh-neg'; }
function med(a) { a = a.filter(function (x) { return x != null; }).sort(function (x, y) { return x - y; }); if (!a.length) return null; var m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function snapLbl(k) { var d = D.bases[k]; return MON[+d.slice(5, 7) - 1] + ' ' + d.slice(0, 4); }
function secBtn(act, opts, cur) {
  return '<span class="sb-toggle mh-seg">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" data-act="' + act + '" data-v="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function nameCell(s) {
  var t = (s.bn ? 'Bloomberg name: ' + s.bn : '') + (s.t ? (s.bn ? ' · ' : '') + s.t : '') + (s.x ? ' · delisted ' + s.x : '');
  return '<span title="' + esc(t) + '">' + esc(s.n) + '</span>' + (s.t ? ' <span class="mh-mu">' + esc(s.t) + '</span>' : '');
}
function showTip(html, e) {
  if (!tip) { tip = document.createElement('div'); tip.id = 'mh-tip'; document.body.appendChild(tip); }
  tip.innerHTML = html; tip.style.opacity = 1;
  var w = tip.offsetWidth, x = e.clientX + 14; if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
  tip.style.left = x + 'px'; tip.style.top = (e.clientY + 14) + 'px';
}
function hideTip() { if (tip) tip.style.opacity = 0; }

// ─── generic line chart ─────────────────────────────────────
// cfg: { x:[labels], series:[{key,label,color,vals,fmt,dash}], unit, title, bands:[{i0,i1}], events:[{i,label}],
//        compact, yMin, ordinal, note } — legend chips hide a series (and its table column); drag = zoom, dblclick = reset.
var chartSeq = 0;
function mountLine(box, cfg) {
  var id = 'dcl' + (++chartSeq), hidden = {}, win = [0, cfg.x.length - 1];
  var H = cfg.compact ? 190 : cfg.half ? 260 : 300, VW = cfg.compact || cfg.half ? 640 : 900, P = { l: 46, r: 26, t: 12, b: cfg.ordinal ? 30 : 24 };
  function niceTicks(lo, hi) {
    if (lo === hi) { hi = lo + 1; }
    var step = Math.pow(10, Math.floor(Math.log10((hi - lo) / 4))), m = (hi - lo) / 4 / step;
    step *= m > 5 ? 10 : m > 2 ? 5 : m > 1 ? 2 : 1;
    var t = [], v = Math.ceil(lo / step) * step; for (; v <= hi + 1e-9; v += step) t.push(+v.toFixed(6)); return { t: t, step: step };
  }
  function draw() {
    var vis = cfg.series.filter(function (s) { return !hidden[s.key]; });
    var i0 = win[0], i1 = win[1], lo = Infinity, hi = -Infinity;
    vis.forEach(function (s) { for (var i = i0; i <= i1; i++) { var v = s.vals[i]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } } });
    if (cfg.yMin != null && lo > cfg.yMin) lo = cfg.yMin;
    if (lo === Infinity) { box.innerHTML = '<div class="mh-empty">Nothing to draw.</div>'; return; }
    var pad = (hi - lo) * .06 || 1; if (cfg.yMin == null || lo < cfg.yMin) lo -= pad; hi += pad;
    var tk = niceTicks(lo, hi), plotW = VW - P.l - P.r, plotH = H - P.t - P.b, span = Math.max(1, i1 - i0);
    function X(i) { return P.l + (i - i0) / span * plotW; }
    function Y(v) { return P.t + (1 - (v - lo) / (hi - lo)) * plotH; }
    var g = '';
    (cfg.bands || []).forEach(function (b) {
      var a = Math.max(b.i0, i0), z = Math.min(b.i1, i1); if (z <= a) return;
      g += '<rect x="' + X(a) + '" y="' + P.t + '" width="' + (X(z) - X(a)) + '" height="' + plotH + '" fill="#9B2A20" opacity=".06"/>';
    });
    tk.t.forEach(function (v) { g += '<line x1="' + P.l + '" x2="' + (VW - P.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#EEF1F4"/><text x="' + (P.l - 6) + '" y="' + (Y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="#8A93A0">' + (cfg.yFmt ? cfg.yFmt(v) : v) + '</text>'; });
    if (lo < 0 && hi > 0) g += '<line x1="' + P.l + '" x2="' + (VW - P.r) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="#C9CFD7"/>';
    // x labels: every January for monthly axes, every category for ordinal ones
    var lastLbl = -99;
    for (var i = i0; i <= i1; i++) {
      var lab = cfg.x[i], show = cfg.ordinal ? (i1 - i0 < 14 || (i - i0) % 2 === 0) : (/-01$/.test(lab) && (span < 80 || lab.slice(2, 4) % 2 === 0));
      if (show && X(i) - lastLbl > 28) {
        lastLbl = X(i);
        g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="#8A93A0">' + (cfg.ordinal ? lab : lab.slice(0, 4)) + '</text>';
        if (!cfg.ordinal) g += '<line x1="' + X(i) + '" x2="' + X(i) + '" y1="' + P.t + '" y2="' + (H - P.b) + '" stroke="#F3F5F7"/>';
      }
    }
    (cfg.events || []).forEach(function (e) { if (e.i >= i0 && e.i <= i1) g += '<line x1="' + X(e.i) + '" x2="' + X(e.i) + '" y1="' + P.t + '" y2="' + (H - P.b) + '" stroke="#3E5A82" stroke-dasharray="2 3" opacity=".55"/>'; });
    vis.forEach(function (s) {
      var d = '', pen = false;
      for (var i = i0; i <= i1; i++) { var v = s.vals[i]; if (v == null) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); pen = true; }
      g += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="' + (cfg.compact ? 1.6 : 2) + '"' + (s.dash ? ' stroke-dasharray="5 4"' : '') + ' stroke-linejoin="round"/>';
      if (span < 16) for (var j = i0; j <= i1; j++) if (s.vals[j] != null) g += '<circle cx="' + X(j) + '" cy="' + Y(s.vals[j]) + '" r="3" fill="' + s.color + '"/>';
    });
    g += '<line id="' + id + 'x" y1="' + P.t + '" y2="' + (H - P.b) + '" stroke="#1E2733" opacity="0" />';
    g += '<rect id="' + id + 'o" x="' + P.l + '" y="' + P.t + '" width="' + plotW + '" height="' + plotH + '" fill="transparent" style="cursor:crosshair"/>';
    g += '<rect id="' + id + 'z" y="' + P.t + '" height="' + plotH + '" fill="#2563EB" opacity="0"/>';
    var chips = cfg.series.length > 1 || cfg.alwaysLegend ? '<div class="mh-legend">' + cfg.series.map(function (s) {
      return '<button class="mh-chip' + (hidden[s.key] ? ' off' : '') + '" data-k="' + s.key + '"><i style="background:' + s.color + '"></i>' + esc(s.label) + '</button>'; }).join('') + '</div>' : '';
    var tbl = '';
    if (!cfg.compact) {
      tbl = '<details class="mh-det"><summary>Data (' + vis.map(function (s) { return esc(s.label); }).join(' · ') + ')</summary><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th></th>' +
        vis.map(function (s) { return '<th class="r">' + esc(s.label) + '</th>'; }).join('') + '</tr></thead><tbody>';
      for (var r = i0; r <= i1; r++) tbl += '<tr><td>' + esc(cfg.x[r]) + '</td>' + vis.map(function (s) { return '<td class="r">' + (s.vals[r] == null ? '—' : (s.fmt ? s.fmt(s.vals[r]) : s.vals[r])) + '</td>'; }).join('') + '</tr>';
      tbl += '</tbody></table></div></details>';
    }
    box.innerHTML = (cfg.title ? '<div class="mh-ch">' + esc(cfg.title) + (cfg.unit ? ' <span class="mh-mu">' + esc(cfg.unit) + '</span>' : '') + '</div>' : '') +
      '<svg viewBox="0 0 ' + VW + ' ' + H + '" class="mh-svg">' + g + '</svg>' + chips +
      (cfg.note ? '<div class="mh-note">' + cfg.note + '</div>' : '') + tbl + (win[0] > 0 || win[1] < cfg.x.length - 1 ? '<div class="mh-note">Zoomed — double-click the chart to reset.</div>' : '');
    var o = box.querySelector('#' + id + 'o'), ln = box.querySelector('#' + id + 'x'), zr = box.querySelector('#' + id + 'z'), svg = box.querySelector('svg');
    function idxAt(e) { var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * VW; return Math.max(i0, Math.min(i1, Math.round(i0 + (px - P.l) / plotW * span))); }
    var down = null;
    o.addEventListener('mousedown', function (e) { down = idxAt(e); });
    o.addEventListener('mousemove', function (e) {
      var i = idxAt(e); ln.setAttribute('x1', X(i)); ln.setAttribute('x2', X(i)); ln.setAttribute('opacity', '.35');
      if (down != null) { var a = Math.min(down, i), z = Math.max(down, i); zr.setAttribute('x', X(a)); zr.setAttribute('width', X(z) - X(a)); zr.setAttribute('opacity', '.12'); }
      var ev = (cfg.events || []).filter(function (q) { return q.i === i; });
      showTip('<b>' + esc(cfg.x[i]) + '</b>' + vis.map(function (s) { return '<div><i class="mh-dot" style="background:' + s.color + '"></i>' + esc(s.label) + ': <b>' + (s.vals[i] == null ? '—' : (s.fmt ? s.fmt(s.vals[i]) : s.vals[i])) + '</b></div>'; }).join('') +
        ev.map(function (q) { return '<div class="mh-evt">' + esc(q.label) + '</div>'; }).join(''), e);
    });
    o.addEventListener('mouseleave', function () { ln.setAttribute('opacity', '0'); hideTip(); if (down != null) { down = null; zr.setAttribute('opacity', '0'); } });
    o.addEventListener('mouseup', function (e) {
      if (down == null) return; var a = Math.min(down, idxAt(e)), z = Math.max(down, idxAt(e)); down = null;
      if (z - a >= 2) { win = [a, z]; hideTip(); draw(); } else zr.setAttribute('opacity', '0');
    });
    o.addEventListener('dblclick', function () { win = [0, cfg.x.length - 1]; draw(); });
    box.querySelectorAll('.mh-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-k'); var left = cfg.series.filter(function (s) { return !hidden[s.key] && s.key !== k; }).length;
        if (!hidden[k] && !left) return; hidden[k] = !hidden[k]; draw(); });
    });
  }
  draw();
}

// ─── helpers for the numbers ───────────────────────────────
function dn(v) { return n1(Math.abs(v), 0) + '%'; }
function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
// items: [{ w, r }] — w any positive weight, r % return of the window
function breadth(items) {
  var tw = items.reduce(function (a, x) { return a + x.w; }, 0), r = items.map(function (x) { return x.r; });
  var cap = items.reduce(function (a, x) { return a + x.w * x.r; }, 0) / tw;
  var ws = items.map(function (x) { return x.w / tw * 100; }).sort(function (a, b) { return b - a; });
  return { n: items.length, cap: cap, ew: mean(r), med: med(r), up: r.filter(function (v) { return v > 0; }).length / r.length * 100, beat: r.filter(function (v) { return v > cap; }).length / r.length * 100,
    top10w: ws.slice(0, 10).reduce(function (a, b) { return a + b; }, 0) };
}
function histBreadth(k) { return breadth(D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }).map(function (s) { return { w: s.w[k], r: s.r[k] }; })); }
function nowBreadth() {
  return (SPX_HOLDINGS.years || []).map(function (y) {
    var b = breadth((y.holdings || []).filter(function (h) { return h.w > 0 && h.r != null; }).map(function (h) { return { w: h.w, r: h.r }; }));
    b.label = String(y.year) + (y.year === +SPX_HOLDINGS.asOf.slice(0, 4) ? ' YTD' : ''); return b; });
}
function lvl(s, i) { for (var j = i; j >= 0; j--) if (s.p[j] != null) return s.p[j]; return null; }   // price at snapshot i; a name that left stays at its last close
function exitYear(s) { return s.x ? +s.x.slice(0, 4) : null; }
var B = null;
function breadths() { return B || (B = D.years.map(function (y, k) { return histBreadth(k); })); }
var Mo = D.macro.months, MM = D.macro.m;
function macroAt(key, ym) { var i = Mo.indexOf(ym); return i < 0 ? null : MM[key][i]; }

// ─── 1. the decade in four stages ───────────────────────────
var STAGES = [
  { name: 'Broad rally', y0: 1995, y1: 1997 },
  { name: 'Narrow peak', y0: 1998, y1: 1999 },
  { name: 'The break', y0: 2000, y1: 2002 },
  { name: 'Recovery', y0: 2003, y1: 2005 }
];
function stageCards() {
  var b = breadths();
  return '<div class="mh-stages">' + STAGES.map(function (s, n) {
    var k0 = D.years.indexOf(s.y0), k1 = D.years.indexOf(s.y1), cum = 1, ks = [];
    for (var k = k0; k <= k1; k++) { cum *= 1 + D.index[k].pub / 100; ks.push(k); }
    var yrs = s.y1 - s.y0 + 1, med1 = mean(ks.map(function (k) { return b[k].med; })), up = mean(ks.map(function (k) { return b[k].up; }));
    var ev = D.events.filter(function (e) { var y = +e[0].slice(0, 4); return y >= s.y0 && y <= s.y1; });
    var li = function (a, v) { return '<div class="mh-sr"><span>' + a + '</span><b>' + v + '</b></div>'; };
    return '<div class="mh-stage"><div class="mh-sn">' + (n + 1) + '</div><div class="mh-stt">' + s.name + '</div><div class="mh-sy">' + s.y0 + '–' + s.y1 + '</div>' +
      '<div class="mh-sbig ' + cls(cum - 1) + '">' + pc((cum - 1) * 100, 0) + '</div><div class="mh-scap">S&amp;P 500, ' + yrs + ' years</div>' +
      li('Typical stock, per year', pc(med1, 0)) + li('Names that rose, per year', n1(up, 0) + '%') + li('Top 10 weight at start', n1(D.conc[k0].top10, 0) + '%') +
      li('Fed funds, Dec to Dec', n1(macroAt('ffr', (s.y0 - 1) + '-12'), 1) + '% → ' + n1(macroAt('ffr', s.y1 + '-12'), 1) + '%') +
      '<details class="mh-det"><summary>Events (' + ev.length + ')</summary><ul class="mh-ul mh-evl">' + ev.map(function (e) { return '<li><span class="mh-mu">' + e[0].slice(0, 7) + '</span> ' + esc(e[1]) + '</li>'; }).join('') + '</ul></details></div>';
  }).join('') + '</div><div class="mh-note">S&amp;P 500 = published index return (Bloomberg), compounded. Typical stock = the median member. Fed funds = FRED monthly average. Events: public record, each date checked against its source (docs/MARKET_HISTORY.md).</div>';
}
function mountTimeline() {
  var ix = function (iso) { return (+iso.slice(0, 4) - 1994) * 12 + (+iso.slice(5, 7) - 1); };
  var events = D.events.map(function (e) { return { i: ix(e[0]), label: e[0] + ' · ' + e[1] }; });
  var bands = [{ i0: ix('2000-03-24'), i1: ix('2002-10-09') }];
  var cut = Mo.indexOf('2005-12') + 1, xs = Mo.slice(0, cut);
  mountLine(document.getElementById('mh-t1'), { x: xs, compact: true, title: 'S&P 500, monthly', unit: 'index level; shaded = peak (Mar 2000) to low (Oct 2002)', series: [{ key: 'sp', label: 'S&P 500', color: '#1E2733', vals: MM.sp.slice(0, cut), fmt: function (v) { return n1(v, 0); } }], bands: bands, events: events });
  mountLine(document.getElementById('mh-t2'), { x: xs, compact: true, title: 'Interest rates', unit: '%, monthly average', alwaysLegend: true, series: [
    { key: 'ffr', label: 'Fed funds', color: '#B45309', vals: MM.ffr.slice(0, cut), fmt: function (v) { return n1(v, 2) + '%'; } },
    { key: 'y10', label: '10-year Treasury', color: '#185FA5', vals: MM.y10.slice(0, cut), fmt: function (v) { return n1(v, 2) + '%'; } }], bands: bands, events: events });
}

// ─── 2. who led, and what became of them ───────────────────
var FN_SIDE = { top: ['#1E2733', 'Best'], bot: ['#B45309', 'Worst'] };
var FN_N = 10;
function fnPool(side) {
  var k = D.years.indexOf(st.fn.y);
  var pool = D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }).map(function (s) { return { s: s, ret: s.r[k], contrib: s.w[k] * s.r[k] / 100 }; });
  pool.sort(function (a, b) { return b.contrib - a.contrib; });
  return { k: k, n: pool.length, list: side === 'top' ? pool.slice(0, FN_N) : pool.slice(-FN_N).reverse() };
}
function fnHeat(v) {
  if (v == null) return '';
  var a = Math.min(.5, .06 + Math.abs(v) / 100 * .34);
  return 'background:' + (v >= 0 ? 'rgba(23,122,78,' + a + ')' : 'rgba(155,42,32,' + a + ')');
}
function fate(s) {
  var y = exitYear(s), txt = { SPX: 'In the S&amp;P 500 today', LIVE: 'Listed, not in the S&amp;P 500', ACQ: 'Acquired / merged', BK: 'Bankrupt', OTH: 'Delisted' }[s.st];
  return '<span class="mh-badge" style="background:' + FATE_COL[s.st] + '">' + txt + '</span>' + (y ? ' <span class="' + (y > 2005 ? 'mh-mu' : '') + '">' + y + '</span>' : '');
}
function fnTable(side) {
  var p = fnPool(side), k = p.k, yr = D.years[k];
  var cell = function (v, out) { return v != null ? '<td class="r mh-cell" style="' + fnHeat(v) + '">' + pc(v, 0) + '</td>' : '<td class="r mh-mu">' + (out ? 'out' : '—') + '</td>'; };
  var rows = p.list.map(function (d, i) {
    var s = d.s, after = k + 1 < NK ? s.r[k + 1] : null, since = lvl(s, 11) && lvl(s, k + 1) ? (lvl(s, 11) / lvl(s, k + 1) - 1) * 100 : null;
    return '<tr><td class="mh-mu">' + (i + 1) + '</td><td>' + nameCell(s) + '</td><td><i class="mh-dot" style="background:' + SEC_COL[s.s] + '"></i>' + s.s + '</td><td class="r">' + n1(s.w[k], 1) + '%</td>' +
      cell(k > 0 ? s.r[k - 1] : null) + '<td class="r mh-cell mh-selcol" style="' + fnHeat(d.ret) + '"><b>' + pc(d.ret, 0) + '</b></td>' + cell(after, after == null) + cell(since) + '<td>' + fate(s) + '</td></tr>';
  }).join('');
  var m = function (fn) { return med(p.list.map(fn)); };
  var cnt = function (f) { return p.list.filter(function (d) { return f(d.s); }).length; };
  var gone = cnt(function (s) { var y = exitYear(s); return y && y <= 2005; });
  var prior = k > 0 ? m(function (d) { return d.s.r[k - 1]; }) : null, next = m(function (d) { return k + 1 < NK ? d.s.r[k + 1] : null; });
  return '<div class="mh-ch" style="margin-top:14px"><i class="mh-dot" style="background:' + FN_SIDE[side][0] + '"></i>' + FN_SIDE[side][1] + ' ' + FN_N + ' of ' + yr + ', by what they added to (or took from) the index</div>' +
    '<div class="mh-read">Median of the ten: ' + pc(m(function (d) { return d.ret; }), 0) + ' in ' + yr + (prior != null ? ', ' + pc(prior, 0) + ' the year before' : '') + (next != null ? ', ' + pc(next, 0) + ' the year after' : '') + '. ' +
    'Today: ' + cnt(function (s) { return s.st === 'SPX'; }) + ' in the S&amp;P 500, ' + cnt(function (s) { return s.st === 'ACQ' || s.st === 'OTH'; }) + ' acquired or delisted, ' + cnt(function (s) { return s.st === 'BK'; }) + ' bankrupt, ' + cnt(function (s) { return s.st === 'LIVE'; }) + ' listed outside the index. Only ' + gone + ' had left the index by Dec 2005.</div>' +
    '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r">Weight</th><th class="r">Year before</th><th class="r mh-selcol">' + yr + '</th><th class="r">Year after</th><th class="r">End of ' + yr + ' → Dec 2005</th><th>Today (year it left)</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function renderFN() {
  var box = document.getElementById('mh-fn'); if (!box) return;
  var yrs = D.years.slice(0, NK - 1);
  box.innerHTML = '<div class="mh-row"><label class="mh-lbl">Year</label><span class="sb-toggle mh-seg">' + yrs.map(function (y) { return '<button class="sb-tbtn' + (y === st.fn.y ? ' active' : '') + '" data-act="fny" data-v="' + y + '">' + y + '</button>'; }).join('') + '</span>' +
    '<label class="mh-lbl" style="margin-left:10px">Show</label>' + secBtn('fns', [['top', 'Best 10'], ['bot', 'Worst 10']], st.fn.side) + '</div>' +
    fnTable(st.fn.side) + '<div class="mh-note">Members of the index at the previous year-end, ranked by weight × return. A name that leaves the index is carried at its last close and nothing replaces it ("out"). Years in grey are after the study window (2005).</div>' + exitTiming();
}
function exitTiming() {
  var rows = ['ACQ', 'BK', 'OTH'].map(function (c) {
    var L = D.secs.filter(function (s) { return s.st === c; }), by = L.filter(function (s) { return exitYear(s) && exitYear(s) <= 2005; }).length, af = L.filter(function (s) { return exitYear(s) && exitYear(s) > 2005; }).length;
    return '<tr><td><b>' + { ACQ: 'Acquired / merged', BK: 'Bankrupt', OTH: 'Delisted, other' }[c] + '</b></td><td class="r">' + L.length + '</td><td class="r">' + by + '</td><td class="r">' + af + '</td><td class="r">' + (L.length - by - af) + '</td></tr>'; }).join('');
  return '<details class="mh-more" style="margin-top:14px"><summary><b>When did the names actually leave?</b><span class="mh-mu"> most acquisitions came after the study window</span></summary><div class="mh-moreb"><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Fate today</th><th class="r">Names</th><th class="r">Left by Dec 2005</th><th class="r">Left after 2005</th><th class="r">No date in Bloomberg</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="mh-note">All ' + D.secs.length + ' names that were members at any year-end from Dec 1994 to Dec 2004. From the delisting date in the Bloomberg workbook. "Acquired" in the table above can mean a deal 5 or 15 years after the window.</div></div></details>';
}

// ─── 3. where the weight went ──────────────────────────────
function renderWC() {
  var box = document.getElementById('mh-wc'); if (!box) return;
  var pre = [[[0, K0], 'Build-up: Dec 1994 → Dec 1999'], [[K0, 8], 'Break: Dec 1999 → Dec 2002']];
  box.innerHTML = '<div class="mh-row"><span class="sb-toggle mh-seg">' + pre.map(function (p) { var on = st.wc[0] === p[0][0] && st.wc[1] === p[0][1]; return '<button class="sb-tbtn' + (on ? ' active' : '') + '" data-act="wcp" data-v="' + p[0].join('-') + '">' + p[1] + '</button>'; }).join('') + '</span></div><div id="mh-wcbox"></div>';
  var a = st.wc[0], b = st.wc[1], hi = 10;
  D.sectors.forEach(function (y) { D.meta.sectors.forEach(function (sc) { hi = Math.max(hi, Math.ceil(y.d[sc].w / 10) * 10); }); });
  var rows = D.meta.sectors.map(function (sc) { return { name: sc, w0: D.sectors[a].d[sc].w, w1: D.sectors[b].d[sc].w }; }).sort(function (x, y) { return y.w0 - x.w0; });
  dumbbell(document.getElementById('mh-wcbox'), rows, hi, snapLbl(b), snapLbl(a).replace(/ 19| 20/, " '") + ' → ' + snapLbl(b).replace(/ 19| 20/, " '"), 'Share of the S&amp;P 500 by sector at each year-end. A sector\'s share falls when its stocks fall, or when other stocks rise faster.', snapLbl(a));
}

// ─── 4. names that joined the index ─────────────────────────
function newNames() {
  var rows = [], wins = 0, losers = [];
  for (var k = 1; k < NK; k++) {
    var ok = function (s) { return s.r[k] != null; };
    var ent = D.secs.filter(function (s) { return s.w[k] != null && s.w[k - 1] == null && ok(s); }), stay = D.secs.filter(function (s) { return s.w[k] != null && s.w[k - 1] != null && ok(s); });
    var a = med(ent.map(function (s) { return s.r[k]; })), b = med(stay.map(function (s) { return s.r[k]; }));
    var nx = function (L) { return k + 1 < NK ? med(L.filter(function (s) { return s.r[k + 1] != null; }).map(function (s) { return s.r[k + 1]; })) : null; };
    var n1x = nx(ent), n2x = nx(stay);
    if (a > b) wins++;
    rows.push('<tr><td><b>' + D.years[k] + '</b></td><td class="r">' + ent.length + '</td><td class="r ' + cls(a) + '">' + pc(a, 0) + '</td><td class="r ' + cls(b) + '">' + pc(b, 0) + '</td><td class="r ' + cls(a - b) + '"><b>' + (a - b >= 0 ? '+' : '−') + Math.abs(a - b).toFixed(0) + '</b></td><td class="r ' + cls(n1x) + '">' + pc(n1x, 0) + '</td><td class="r ' + cls(n2x) + '">' + pc(n2x, 0) + '</td></tr>');
  }
  return '<div class="mh-read">Names added at a year-end beat the ones already in the index in ' + wins + ' of ' + rows.length + ' years. The gap has no steady sign: see the table.</div>' +
    '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Year</th><th class="r">Names added at the previous year-end</th><th class="r">Their median return</th><th class="r">Others in the index</th><th class="r">Gap (pp)</th><th class="r">Added names, next year</th><th class="r">Others, next year</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' +
    '<div class="mh-note">"Added" = a member at the start of the year that was not a member one year-end earlier. The data starts when a company joins: returns before joining are not in it, so this cannot show whether a name was already rising when it was picked. Only index members are in the sample.</div>';
}

// ─── 5. then vs now ─────────────────────────────────────────
function thenNow() {
  var b = breadths(), now = nowBreadth().slice(-3), cols = [['1998', b[3]], ['1999', b[4]], ['2000', b[5]]].concat(now.map(function (x) { return [x.label, x]; }));
  var row = function (lab, sub, fn, pct) {
    return '<tr><td><b>' + lab + '</b><div class="mh-mu">' + sub + '</div></td>' + cols.map(function (c, i) { var v = fn(c[1]); return '<td class="r' + (i === 3 ? ' mh-sepl' : '') + (pct ? '' : ' ' + cls(v)) + '">' + (pct ? n1(v, 0) + '%' : pc(v, 0)) + '</td>'; }).join('') + '</tr>';
  };
  return '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th></th>' + cols.map(function (c, i) { return '<th class="r' + (i === 3 ? ' mh-sepl' : '') + '">' + c[0] + '</th>'; }).join('') + '</tr></thead><tbody>' +
    row('The index', 'size-weighted return', function (x) { return x.cap; }) + row('The average stock', 'equal-weighted return', function (x) { return x.ew; }) + row('The typical stock', 'median return', function (x) { return x.med; }) +
    row('Names that beat the index', 'share of members', function (x) { return x.beat; }, true) + row('Top 10 weight', 'share of the index at the start', function (x) { return x.top10w; }, true) + '</tbody></table></div>' +
    '<div class="mh-note">Left of the line: this study (published index weights). Right: SPY holdings already in the portal (float-adjusted weights), price returns, 2026 to ' + SPX_HOLDINGS.asOf + '. The two weighting methods differ slightly (docs).</div>';
}

// ─── the story ──────────────────────────────────────────────
function bottomLine() {
  var b = breadths(), cohort = D.secs.filter(function (s) { return s.q != null; });
  var q5m = med(cohort.filter(function (s) { return s.q === 5; }).map(function (s) { return s.r05; })), q1m = med(cohort.filter(function (s) { return s.q === 1; }).map(function (s) { return s.r05; }));
  var top = D.secs.filter(function (s) { return s.w[K0] != null; }).sort(function (a, c) { return c.w[K0] - a.w[K0]; }).slice(0, 10);
  var nb = nowBreadth(); nb = nb[nb.length - 1];
  return '<div class="mh-bl"><ol>' +
    '<li>1998-99: the index rose ' + pc(b[3].cap, 0) + ' and ' + pc(b[4].cap, 0) + '. The typical stock: ' + pc(b[3].med, 0) + ' and ' + pc(b[4].med, 0) + '.</li>' +
    '<li>2000: the index fell ' + dn(b[5].cap) + ' while the average stock rose ' + pc(b[5].ew, 0) + '. The leaders fell first.</li>' +
    '<li>The 1995-99 winners returned ' + pc(q5m, 0) + ' (median) in 2000-05; the laggards ' + pc(q1m, 0) + '.</li>' +
    '<li>' + top.filter(function (s) { return s.st === 'SPX'; }).length + ' of the 10 largest of Dec 1999 are still in the S&amp;P 500. In 2000-05 they lost ' + dn(med(top.map(function (s) { return s.r05; }))) + ' (median).</li>' +
    '<li>Today: top 10 = ' + n1(nb.top10w, 0) + '% of the index vs ' + n1(D.conc[K0].top10, 0) + '% in 1999.</li></ol></div>';
}
function howTo() {
  return '<details class="mh-more"><summary><b>How to read this page</b><span class="mh-mu"> data, terms, limits</span></summary><div class="mh-moreb"><ul class="mh-ul">' +
    '<li><b>Data.</b> Every member of the S&amp;P 500 at the last trading day of each year, Dec 1994 to Dec 2004: its weight and its price return over the next year. A name that leaves is followed to its last close and not replaced.</li>' +
    '<li><b>Index</b> = size-weighted, as the S&amp;P 500. <b>Average stock</b> = equal-weighted. <b>Typical stock</b> = the median member. <b>Weight</b> = share of the index. <b>Contribution</b> = weight × return.</li>' +
    '<li><b>Limits.</b> Prices and weights only: no revenue, profit or valuation. It shows what happened, not why, and not what comes next.</li></ul></div></details>';
}
function takeaway() {
  var li = function (t) { return '<li>' + t + '</li>'; };
  return '<div class="mh-two"><div class="mh-box"><div class="mh-ch">Supports</div><ul class="mh-ul">' +
    li('A minority can carry an index for years before it reverses (1998-99: two years).') +
    li('The leaders reversed first; the average stock held until 2001.') +
    li('Owning the 1999 winners at 1999 prices lost money for years, even when the company survived.') +
    li('Today\'s index return depends on a minority as much as 1998-99\'s.') +
    '</ul></div><div class="mh-box"><div class="mh-ch">Does not support</div><ul class="mh-ul">' +
    li('That today is 1999, or that a reversal is due.') +
    li('Anything on profits, revenue or valuation.') +
    li('What happened after 2005, or any forecast for a name.') +
    '</ul></div></div>' +
    '<details class="mh-more" style="margin-top:14px"><summary><b>Where today differs</b><span class="mh-mu"> analyst view, not tested by this data</span></summary><div class="mh-moreb">In 1999 many leaders were promises of revenue and profit that arrived late or never. Today several leaders report growing revenue and profit (AWS inside Amazon, Meta, Alphabet) and a record contracted backlog, so "no business behind the price" does not fit them. The risk is a different one: growth below what the price assumes, or efficiency in using AI (smaller models for routine work) that lowers demand for tokens, unless cheaper tokens bring more usage. This page holds no revenue or profit data and cannot test any of it.</div></details>';
}

// ─── page ──────────────────────────────────────────────────
function sec(title, sub, body) { return '<div class="sec"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn">' + (sub || '') + '</span></div>' + body + '</div>'; }
function render() {
  var ev = D.events.map(function (e) { return '<tr><td>' + e[0] + '</td><td>' + esc(e[1]) + '</td><td class="mh-mu">' + e[2] + '</td></tr>'; }).join('');
  root.innerHTML =
    '<div class="mh-intro"><div class="mh-h1">Market History · 1995-2005</div><div class="mh-mu">S&amp;P 500 members, weights and price returns, followed to today · Bloomberg, FRED, FINRA · docs/MARKET_HISTORY.md</div></div>' +
    bottomLine() + howTo() +
    sec('The decade in four stages', 'what the market did, who carried it, what the backdrop was', stageCards() + '<div class="mh-two" style="margin-top:14px"><div id="mh-t1"></div><div id="mh-t2"></div></div>' +
      '<details class="mh-more"><summary><b>All events marked on the charts</b><span class="mh-mu"> hover a dashed line</span></summary><div class="mh-moreb"><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Date</th><th>Event</th><th>Type</th></tr></thead><tbody>' + ev + '</tbody></table></div></div></details>') +
    sec('Who led, and what became of them', 'pick a year', '<div id="mh-fn"></div>') +
    sec('Where the index\'s weight sat', 'by sector', '<div id="mh-wc"></div>') +
    sec('Names added to the index', 'did the new members do better?', newNames()) +
    sec('Then and now', 'same measures, two eras', thenNow()) +
    sec('Take away', '', takeaway());
  mountTimeline(); renderFN(); renderWC();
}

var wired = false, built = false;
function build() {
  if (built) return; built = true;
  root = document.getElementById('mh-root'); if (!root) return;
  render();
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var a = t.getAttribute('data-act'), v = t.getAttribute('data-v');
    if (a === 'fny') { st.fn.y = +v; renderFN(); }
    else if (a === 'fns') { st.fn.side = v; renderFN(); }
    else if (a === 'wcp') { var q = v.split('-'); st.wc = [+q[0], +q[1]]; renderWC(); }
  });
}
// Market Analysis ▸ the tab bar at the top of #tp-rot switches between the index sections and this page
export function initMarketHistoryTabs() {
  if (wired) return; wired = true;
  var tp = document.getElementById('tp-rot'); if (!tp) return;
  tp.querySelectorAll('.ma-tab').forEach(function (b) {
    b.addEventListener('click', function () {
      var hist = b.getAttribute('data-matab') === 'history';
      tp.classList.toggle('mh-on', hist);
      tp.querySelectorAll('.ma-tab').forEach(function (x) { x.classList.toggle('active', x === b); });
      if (hist) build();
    });
  });
}
