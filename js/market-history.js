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
var FATE_SHORT = { SPX: 'In the S&P 500', LIVE: 'Listed, not in S&P', ACQ: 'Acquired', BK: 'Bankrupt', OTH: 'Delisted (other)' };
var Q_COL = { 5: '#1E2733', 4: '#3E5A82', 3: '#8A93A0', 2: '#B7C0CC', 1: '#B45309', 0: '#7C3AED' };
var Q_NAME = { 5: 'Q5 · winners', 4: 'Q4', 3: 'Q3', 2: 'Q2', 1: 'Q1 · laggards', 0: 'Joined at the 1999 close' };
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var K0 = D.bases.indexOf('1999-12-31');            // the cohort snapshot
var NK = D.bases.length;

var st = { sector: 'All', openQ: null, year: 2000, yview: 'contrib', rot: K0, fmode: 'weight', fsnap: K0, mgroup: 'market', concMode: 'chart', fn: { y: 1999, n: 10, side: 'top', by: 'contrib', sec: 'All', view: 'strip' }, wc: [K0, NK - 1] };
var root = null, tip = null;

// ─── helpers ───────────────────────────────────────────────
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function n1(v, d) { return v == null ? '—' : v.toFixed(d == null ? 1 : d); }
function pc(v, d) { if (v == null) return '—'; d = d == null ? 1 : d; if (Math.abs(v) < Math.pow(10, -d) / 2) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%'; }
function pp(v, d) { if (v == null) return '—'; d = d == null ? 2 : d; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + ' pp'; }
function cls(v) { return v == null ? '' : v >= 0 ? 'mh-pos' : 'mh-neg'; }
function med(a) { a = a.filter(function (x) { return x != null; }).sort(function (x, y) { return x - y; }); if (!a.length) return null; var m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function snapLbl(k) { var d = D.bases[k]; return MON[+d.slice(5, 7) - 1] + ' ' + d.slice(0, 4); }
function winLbl(k) { return String(D.years[k]); }
function secBtn(act, opts, cur) {
  return '<span class="sb-toggle mh-seg">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" data-act="' + act + '" data-v="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
function badge(code) { return '<span class="mh-badge" style="background:' + FATE_COL[code] + '">' + FATE_SHORT[code] + '</span>'; }
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

// ─── generic stacked bar chart (categories on x) ────────────
// cfg: { cats:[labels], series:[{key,label,color,vals}], unit, title, max, fmt }
function mountStack(box, cfg) {
  var hidden = {}, VW = 900, H = 290, P = { l: 48, r: 14, t: 12, b: 30 }, id = 'dcs' + (++chartSeq);
  function draw() {
    var vis = cfg.series.filter(function (s) { return !hidden[s.key]; });
    var tot = cfg.cats.map(function (c, i) { return vis.reduce(function (a, s) { return a + (s.vals[i] || 0); }, 0); });
    var mx = cfg.max || Math.max.apply(null, tot) * 1.05 || 1, plotW = VW - P.l - P.r, plotH = H - P.t - P.b, slot = plotW / cfg.cats.length, bw = Math.min(46, slot - 8);
    function Y(v) { return P.t + (1 - v / mx) * plotH; }
    var step = mx > 150 ? 100 : mx > 60 ? 20 : mx > 25 ? 10 : 5, g = '';
    for (var v = 0; v <= mx + 1e-9; v += step) g += '<line x1="' + P.l + '" x2="' + (VW - P.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#EEF1F4"/><text x="' + (P.l - 6) + '" y="' + (Y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="#8A93A0">' + v + (cfg.unit === '%' ? '%' : '') + '</text>';
    cfg.cats.forEach(function (c, i) {
      var x = P.l + i * slot + (slot - bw) / 2, acc = 0;
      vis.forEach(function (s) { var val = s.vals[i] || 0; if (val <= 0) return; g += '<rect x="' + x + '" y="' + Y(acc + val) + '" width="' + bw + '" height="' + Math.max(0, Y(acc) - Y(acc + val)) + '" fill="' + s.color + '"/>'; acc += val; });
      g += '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="10" fill="#8A93A0">' + esc(c) + '</text>';
      g += '<rect class="mh-hit" data-i="' + i + '" x="' + (P.l + i * slot) + '" y="' + P.t + '" width="' + slot + '" height="' + plotH + '" fill="transparent"/>';
    });
    var chips = '<div class="mh-legend">' + cfg.series.map(function (s) { return '<button class="mh-chip' + (hidden[s.key] ? ' off' : '') + '" data-k="' + s.key + '"><i style="background:' + s.color + '"></i>' + esc(s.label) + '</button>'; }).join('') + '</div>';
    var tbl = '<details class="mh-det"><summary>Data</summary><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th></th>' + vis.map(function (s) { return '<th class="r">' + esc(s.label) + '</th>'; }).join('') + '<th class="r">Total</th></tr></thead><tbody>' +
      cfg.cats.map(function (c, i) { return '<tr><td>' + esc(c) + '</td>' + vis.map(function (s) { return '<td class="r">' + (s.vals[i] == null ? '—' : (cfg.fmt ? cfg.fmt(s.vals[i]) : s.vals[i])) + '</td>'; }).join('') + '<td class="r">' + (cfg.fmt ? cfg.fmt(tot[i]) : tot[i].toFixed(1)) + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
    box.innerHTML = (cfg.title ? '<div class="mh-ch">' + esc(cfg.title) + (cfg.unit ? ' <span class="mh-mu">' + esc(cfg.unitLabel || cfg.unit) + '</span>' : '') + '</div>' : '') +
      '<svg viewBox="0 0 ' + VW + ' ' + H + '" class="mh-svg" id="' + id + '">' + g + '</svg>' + chips + (cfg.note ? '<div class="mh-note">' + cfg.note + '</div>' : '') + tbl;
    box.querySelectorAll('.mh-hit').forEach(function (r) {
      r.addEventListener('mousemove', function (e) { var i = +r.getAttribute('data-i');
        showTip('<b>' + esc(cfg.cats[i]) + '</b>' + vis.slice().reverse().map(function (s) { return '<div><i class="mh-dot" style="background:' + s.color + '"></i>' + esc(s.label) + ': <b>' + (cfg.fmt ? cfg.fmt(s.vals[i] || 0) : (s.vals[i] || 0)) + '</b></div>'; }).join(''), e); });
      r.addEventListener('mouseleave', hideTip);
    });
    box.querySelectorAll('.mh-chip').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-k'); if (!hidden[k] && vis.length < 2) return; hidden[k] = !hidden[k]; draw(); }); });
  }
  draw();
}

// ─── data helpers ───────────────────────────────────────────
function secsAt(k) { return D.secs.filter(function (s) { return s.w[k] != null; }); }
function fateCounts(list) { var c = { SPX: 0, LIVE: 0, ACQ: 0, BK: 0, OTH: 0 }; list.forEach(function (s) { c[s.st]++; }); return c; }

// today's concentration, on the same measures, from the SPY holdings already in the portal (GICS, not BICS)
function todayConc() {
  var out = [];
  (SPX_HOLDINGS.years || []).forEach(function (yr) {
    var hs = (yr.holdings || []).filter(function (h) { return h.w > 0; });
    var tot = hs.reduce(function (a, h) { return a + h.w; }, 0); if (!tot) return;
    var ws = hs.map(function (h) { return h.w / tot * 100; }).sort(function (a, b) { return b - a; });
    var top = function (n) { return ws.slice(0, n).reduce(function (a, b) { return a + b; }, 0); };
    var hhi = ws.reduce(function (a, w) { return a + w * w; }, 0);
    var it = hs.filter(function (h) { return h.s === 'Information Technology'; }).reduce(function (a, h) { return a + h.w; }, 0) / tot * 100;
    var cm = hs.filter(function (h) { return h.s === 'Communication Services'; }).reduce(function (a, h) { return a + h.w; }, 0) / tot * 100;
    var c = 0, n50 = null, n80 = null; ws.forEach(function (w, i) { c += w; if (n50 == null && c >= 50) n50 = i + 1; if (n80 == null && c >= 80) n80 = i + 1; });
    out.push({ label: yr.eff, top1: ws[0], top4: top(4), top10: top(10), top20: top(20), top50: top(50), hhi: hhi, effN: 1e4 / hhi, n50: n50, n80: n80, tech: it, techComm: it + cm, n: hs.length });
  });
  return out;
}

// ─── detail sections (the explorer) ───
function concHtml() {
  var rows = D.conc.map(function (r, k) {
    return '<tr><td>' + snapLbl(k) + '</td><td class="r">' + n1(r.top1) + '</td><td class="r">' + n1(r.top4) + '</td><td class="r">' + n1(r.top10) + '</td><td class="r">' + n1(r.top20) + '</td><td class="r">' + n1(r.top50) + '</td><td class="r">' + n1(r.hhi, 0) + '</td><td class="r">' + n1(r.effN, 0) +
      '</td><td class="r">' + r.n50 + '</td><td class="r">' + r.n80 + '</td><td class="r">' + r.nRet50 + '</td><td class="r">' + n1(r.tech) + '</td><td class="r">' + n1(r.techComm) + '</td></tr>'; }).join('');
  var tc = todayConc(), trows = tc.map(function (r) {
    return '<tr class="mh-today"><td>' + r.label.slice(0, 7) + '</td><td class="r">' + n1(r.top1) + '</td><td class="r">' + n1(r.top4) + '</td><td class="r">' + n1(r.top10) + '</td><td class="r">' + n1(r.top20) + '</td><td class="r">' + n1(r.top50) + '</td><td class="r">' + n1(r.hhi, 0) + '</td><td class="r">' + n1(r.effN, 0) +
      '</td><td class="r">' + r.n50 + '</td><td class="r">' + r.n80 + '</td><td class="r">n/a</td><td class="r">' + n1(r.tech) + '</td><td class="r">' + n1(r.techComm) + '</td></tr>'; }).join('');
  return '<div class="mh-two"><div id="mh-conc1"></div><div id="mh-conc2"></div></div>' +
    '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Snapshot (opening weights)</th><th class="r">Top 1 %</th><th class="r">Top 4 %</th><th class="r">Top 10 %</th><th class="r">Top 20 %</th><th class="r">Top 50 %</th><th class="r">HHI</th><th class="r">Effective N</th><th class="r">Names for 50% of weight</th><th class="r">Names for 80%</th><th class="r">Names for 50% of the year\'s return</th><th class="r">Technology %</th><th class="r">Tech + Comm. %</th></tr></thead><tbody>' +
    rows + (trows ? '<tr><td colspan="13" class="mh-sep">Today, same measures from SPY\'s year-end holdings already in the portal (GICS: Information Technology + Communication Services; not the BICS sectors above, so read the last two columns as comparable, not identical)</td></tr>' + trows : '') + '</tbody></table></div>' +
    '<div class="mh-note">Concentration is a condition that amplifies, not a mechanism that breaks a cycle: it was already high in 1999 and did not cause 2000. Weights are market cap at each year-end snapshot (the S&amp;P 500 was market-cap weighted, not float-adjusted, until the March / September 2005 change); ' +
    D.index.reduce(function (a, r) { return a + (r.nEst ? 1 : 0); }, 0) + ' of 11 snapshots include names with no market cap in Bloomberg, which carry a flat estimated weight (' + n1(D.index[0].wEst) + '% of the index in ' + snapLbl(0) + ', ' + n1(D.index[K0].wEst) + '% in ' + snapLbl(K0) + ', none from ' + snapLbl(6) + ').</div>';
}
function mountConc() {
  var x = D.bases.map(function (b, k) { return snapLbl(k); });
  mountLine(document.getElementById('mh-conc1'), { x: x, ordinal: true, half: true, title: 'Weight of the largest names, and of Technology + Communications', unit: '% of the index', yMin: 0, yFmt: function (v) { return v + '%'; },
    series: [ { key: 'techComm', label: 'Tech + Comm.', color: '#185FA5', vals: D.conc.map(function (r) { return r.techComm; }), fmt: function (v) { return n1(v) + '%'; } },
              { key: 'tech', label: 'Technology', color: '#5A9BD5', vals: D.conc.map(function (r) { return r.tech; }), fmt: function (v) { return n1(v) + '%'; } },
              { key: 'top10', label: 'Top 10 names', color: '#1E2733', vals: D.conc.map(function (r) { return r.top10; }), fmt: function (v) { return n1(v) + '%'; } },
              { key: 'top50', label: 'Top 50 names', color: '#8A93A0', vals: D.conc.map(function (r) { return r.top50; }), fmt: function (v) { return n1(v) + '%'; }, dash: true } ] });
  mountLine(document.getElementById('mh-conc2'), { x: x, ordinal: true, half: true, title: 'How many names it took', unit: 'names', yMin: 0,
    series: [ { key: 'n50', label: '50% of the weight', color: '#1E2733', vals: D.conc.map(function (r) { return r.n50; }) },
              { key: 'nRet50', label: '50% of the year\'s return', color: '#B45309', vals: D.conc.map(function (r) { return r.nRet50; }) } ],
    note: 'The return count is for the window that opens at each snapshot (e.g. Dec 1999 → the 2000 window). In 2000 the index fell; the count is the names that explain half of that fall.' });
}

// ── cohorts ──
function cohortRows(sector) {
  var all = D.secs.filter(function (s) { return s.q != null && (sector === 'All' || s.s === sector); });
  return [5, 4, 3, 2, 1, 0].map(function (q) {
    var g = all.filter(function (s) { return s.q === q; }); if (!g.length) return null;
    var r05 = g.map(function (s) { return s.r05; }).filter(function (v) { return v != null; });
    var fc = fateCounts(g);
    return { q: q, n: g.length, w: g.reduce(function (a, s) { return a + (s.w[K0] || 0); }, 0), c: med(g.map(function (s) { return s.c; })), r02: med(g.map(function (s) { return s.r02; })), r35: med(g.map(function (s) { return s.r35; })),
      r05: med(r05), neg: r05.length ? r05.filter(function (v) { return v < 0; }).length / r05.length * 100 : null, in04: g.filter(function (s) { return s.in04; }).length / g.length * 100, fc: fc, partial: g.filter(function (s) { return s.nc && s.nc < 5; }).length };
  }).filter(Boolean);
}
function cohortHtml() {
  var secOpts = ['All'].concat(D.meta.sectors);
  var rows = cohortRows(st.sector);
  var head = '<div class="mh-row"><label class="mh-lbl">Sector</label><select id="mh-sec" class="mh-sel">' + secOpts.map(function (s) { return '<option' + (s === st.sector ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>' +
    '<span class="mh-mu" style="margin-left:12px">Ranked on the 1995-99 price return of every name in the index at the ' + snapLbl(K0) + ' close (partial windows for late joiners). Nothing after that date is used to form the groups.</span></div>';
  var tb = '<div class="mh-scroll"><table class="mh-tbl mh-click"><thead><tr><th>Group</th><th class="r">Names</th><th class="r">% of index at ' + snapLbl(K0) + '</th><th class="r">1995-99 (median)</th><th class="r">2000-02 (median)</th><th class="r">2003-05 (median)</th><th class="r">2000-05 (median)</th><th class="r">% below their ' + snapLbl(K0) + ' close at last observation</th><th class="r">% still in the index ' + snapLbl(NK - 1) + '</th></tr></thead><tbody>' +
    rows.map(function (r) {
      return '<tr data-act="openq" data-v="' + r.q + '" class="' + (st.openQ === r.q ? 'sel' : '') + '"><td><i class="mh-dot" style="background:' + Q_COL[r.q] + '"></i><b>' + Q_NAME[r.q] + '</b></td><td class="r">' + r.n + '</td><td class="r">' + n1(r.w) + '%</td><td class="r">' + (r.q ? pc(r.c, 0) : '—') + '</td><td class="r ' + cls(r.r02) + '">' + pc(r.r02, 0) + '</td><td class="r ' + cls(r.r35) + '">' + pc(r.r35, 0) + '</td><td class="r ' + cls(r.r05) + '"><b>' + pc(r.r05, 0) + '</b></td><td class="r">' + n1(r.neg, 0) + '%</td><td class="r">' + n1(r.in04, 0) + '%</td></tr>'; }).join('') + '</tbody></table></div>';
  var fate = '<div class="mh-ch" style="margin-top:16px">Where each group is today</div>' + rows.map(function (r) {
    var seg = ['SPX', 'LIVE', 'ACQ', 'BK', 'OTH'].map(function (c) { var p = r.fc[c] / r.n * 100; return p ? '<span style="width:' + p + '%;background:' + FATE_COL[c] + '" title="' + FATE_SHORT[c] + ': ' + r.fc[c] + ' (' + n1(p, 0) + '%)">' + (p >= 8 ? n1(p, 0) + '%' : '') + '</span>' : ''; }).join('');
    return '<div class="mh-fbar"><div class="mh-fl"><i class="mh-dot" style="background:' + Q_COL[r.q] + '"></i>' + Q_NAME[r.q] + '</div><div class="mh-fb">' + seg + '</div></div>'; }).join('') +
    '<div class="mh-legend">' + ['SPX', 'LIVE', 'ACQ', 'BK', 'OTH'].map(function (c) { return '<span class="mh-key"><i style="background:' + FATE_COL[c] + '"></i>' + FATE_SHORT[c] + '</span>'; }).join('') + '</div>';
  var split = outcomeSplit();
  var list = st.openQ != null ? cohortList(st.openQ) : '<div class="mh-note">Click a group to list its names.</div>';
  var q5 = cohortRows('All')[0];
  var read = '<div class="mh-read"><b>Reading.</b> The ' + q5.n + ' winners were ' + n1(q5.w, 0) + '% of the index at the ' + snapLbl(K0) + ' close. ' + n1(q5.neg, 0) + '% of them closed their last observed year below that close, ' + n1(q5.fc.SPX / q5.n * 100, 0) + '% are in the S&amp;P 500 today and ' + n1(q5.fc.BK / q5.n * 100, 0) + '% went bankrupt. The group is not one population: the split by outcome is below.</div>';
  return head + read + tb + fate + split + '<div id="mh-qlist">' + list + '</div>' + '<div class="mh-ch" style="margin-top:20px">Do winners keep winning? The same test at every start date</div><div id="mh-roll"></div>';
}

// Q5 (the 1995-99 winners) split by what happened afterwards: it is not one population
function outcomeSplit() {
  var g = D.secs.filter(function (s) { return s.q === 5 && (st.sector === 'All' || s.s === st.sector); });
  var cats = [
    ['Above their Dec 1999 close at the last observation', function (s) { return s.r05 != null && s.r05 >= 0; }],
    ['Below it, and still in the S&P 500 today', function (s) { return (s.r05 == null || s.r05 < 0) && s.st === 'SPX'; }],
    ['Below it, and no longer in the S&P 500 (acquired, bankrupt, delisted or just dropped out)', function (s) { return (s.r05 == null || s.r05 < 0) && s.st !== 'SPX'; }]
  ];
  var rows = cats.map(function (c) {
    var m = g.filter(c[1]);
    return '<tr><td>' + c[0] + '</td><td class="r">' + m.length + '</td><td class="r">' + n1(m.reduce(function (a, s) { return a + (s.w[K0] || 0); }, 0)) + '%</td><td class="r ' + cls(med(m.map(function (s) { return s.r05; }))) + '">' + pc(med(m.map(function (s) { return s.r05; })), 0) + '</td><td class="r">' + m.filter(function (s) { return s.st === 'BK'; }).length + '</td></tr>'; }).join('');
  return '<div class="mh-ch" style="margin-top:20px">The winners (Q5) by outcome</div><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>2000-05 outcome</th><th class="r">Names</th><th class="r">% of index at ' + snapLbl(K0) + '</th><th class="r">2000-05 (median)</th><th class="r">of which bankrupt</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="mh-note">What separates the groups is not visible in price data: whether the revenue existed and persisted. That needs revenue per name at each snapshot (see What is missing).</div>';
}
function cohortList(q) {
  var g = D.secs.filter(function (s) { return s.q === q && (st.sector === 'All' || s.s === st.sector); }).sort(function (a, b) { return (b.w[K0] || 0) - (a.w[K0] || 0); });
  var shown = g.slice(0, 60);
  return '<div class="mh-ch" style="margin-top:16px">' + Q_NAME[q] + ' · ' + g.length + ' names' + (g.length > shown.length ? ' (largest ' + shown.length + ' at ' + snapLbl(K0) + ')' : '') + '</div><div class="mh-scroll" style="max-height:420px"><table class="mh-tbl"><thead><tr><th>Name</th><th>Sector</th><th class="r">Weight ' + snapLbl(K0) + '</th><th class="r">1995-99</th><th class="r">2000-02</th><th class="r">2003-05</th><th class="r">2000-05</th><th class="r">Last price / peak year-end</th><th>Today</th></tr></thead><tbody>' +
    shown.map(function (s) { return '<tr><td>' + nameCell(s) + '</td><td>' + s.s + '</td><td class="r">' + n1(s.w[K0], 2) + '%</td><td class="r">' + (q ? pc(s.c, 0) + (s.nc < 5 ? '*' : '') : '—') + '</td><td class="r ' + cls(s.r02) + '">' + pc(s.r02, 0) + '</td><td class="r ' + cls(s.r35) + '">' + pc(s.r35, 0) + '</td><td class="r ' + cls(s.r05) + '">' + pc(s.r05, 0) + '</td><td class="r">' + (s.pk == null ? '—' : n1(s.pk * 100, 0) + '%') + '</td><td>' + badge(s.st) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="mh-note">* partial window: the name joined the index after Dec 1994. 2000-05 is chained over the years the name stayed in the index (see methodology: an exit before 2005 truncates it). Peak = highest year-end price observed, not the March 2000 high.</div>';
}
function mountRoll() {
  var box = document.getElementById('mh-roll'); if (!box) return;
  var x = D.roll.map(function (r) { return r.asOf.slice(0, 7); });
  mountLine(box, { x: x.map(function (s) { return MON[+s.slice(5) - 1] + ' ' + s.slice(0, 4); }), ordinal: true, unit: 'median 3-year forward return of each group', yFmt: function (v) { return v + '%'; },
    series: [5, 4, 3, 2, 1].map(function (q) { return { key: 'q' + q, label: Q_NAME[q], color: Q_COL[q], vals: D.roll.map(function (r) { return r.q[q].fwd; }), fmt: function (v) { return pc(v, 1); } }; }),
    note: 'At each start date every name with three full years of history is ranked on that trailing return and followed for the next three windows (chained while it stays in the index). Q5 beat Q1 when the start was Dec 1997 or Dec 1998 and lost badly from Dec 1999. Few start dates exist in a 10-year file; read it as a pattern, not a statistic.' });
}

// ── year by year ──
function yearHtml() {
  var k = D.years.indexOf(st.year);
  var yb = D.years.map(function (y) { return [y, y]; });
  var idx = D.index[k];
  var head = '<div class="mh-row">' + secBtn('year', yb, st.year) + secBtn('yview', [['contrib', 'Sectors'], ['top', 'Top contributors'], ['bot', 'Bottom contributors'], ['wt', 'Largest weights']], st.yview) + '</div>' +
    '<div class="mh-mu" style="margin:6px 0 10px">Window ' + snapLbl(k) + ' → ' + (D.index[k].hoc ? D.index[k].hoc : '') + ' · fixed basket of the ' + snapLbl(k) + ' members · ' + pc(idx.basket, 2) + ' vs published S&amp;P 500 ' + pc(idx.pub, 2) + ' (gap ' + pp(idx.gap, 2) + ')</div>';
  var body = '';
  if (st.yview === 'contrib') {
    var secs = D.meta.sectors.map(function (sc) { var d = D.sectors[k].d[sc]; return { sc: sc, w: d.w, c: d.c, n: d.n, r: d.w ? d.c / d.w * 100 : null }; }).filter(function (r) { return r.n; }).sort(function (a, b) { return b.c - a.c; });
    var mx = Math.max.apply(null, secs.map(function (r) { return Math.abs(r.c); })) || 1;
    body = '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Sector</th><th class="r">Names</th><th class="r">Opening weight</th><th class="r">Sector return</th><th class="r">Contribution</th><th style="width:34%"></th></tr></thead><tbody>' +
      secs.map(function (r) { var w = Math.abs(r.c) / mx * 48; return '<tr><td><i class="mh-dot" style="background:' + SEC_COL[r.sc] + '"></i>' + r.sc + '</td><td class="r">' + r.n + '</td><td class="r">' + n1(r.w) + '%</td><td class="r ' + cls(r.r) + '">' + pc(r.r, 1) + '</td><td class="r ' + cls(r.c) + '"><b>' + pp(r.c) + '</b></td><td><div class="mh-div"><span style="' + (r.c >= 0 ? 'left:50%;' : 'right:50%;') + 'width:' + w + '%;background:' + (r.c >= 0 ? '#177A4E' : '#9B2A20') + '"></span></div></td></tr>'; }).join('') +
      '<tr class="mh-tot"><td>Fixed basket</td><td class="r">500</td><td class="r">100%</td><td class="r">' + pc(idx.basket, 2) + '</td><td class="r"><b>' + pp(idx.basket) + '</b></td><td></td></tr></tbody></table></div>';
  } else {
    var list = secsAt(k).map(function (s) { return { s: s, w: s.w[k], r: s.r[k], c: s.w[k] * s.r[k] / 100 }; });
    if (st.yview === 'top') list.sort(function (a, b) { return b.c - a.c; }); else if (st.yview === 'bot') list.sort(function (a, b) { return a.c - b.c; }); else list.sort(function (a, b) { return b.w - a.w; });
    body = '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r">Opening weight</th><th class="r">Return</th><th class="r">Contribution</th><th>Today</th></tr></thead><tbody>' +
      list.slice(0, 15).map(function (r, i) { return '<tr><td class="mh-mu">' + (i + 1) + '</td><td>' + nameCell(r.s) + '</td><td>' + r.s.s + '</td><td class="r">' + n1(r.w, 2) + '%</td><td class="r ' + cls(r.r) + '">' + pc(r.r, 1) + '</td><td class="r ' + cls(r.c) + '">' + pp(r.c) + '</td><td>' + badge(r.s.st) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  return head + body;
}

// ── rotation ──
function rotHtml() {
  var r = D.rot[st.rot], a = st.rot, b = st.rot + 1;
  var head = '<div class="mh-row mh-wrap">' + secBtn('rot', D.rot.map(function (t, i) { return [i, snapLbl(i) + ' → ' + snapLbl(i + 1).slice(-4)]; }), st.rot) + '</div>';
  var tiles = '<div class="mh-tiles mh-tiles3"><div class="mh-tile"><div class="mh-big">' + r.nStay + '</div><div class="mh-cap">stayed in the index</div><div class="mh-sub">' + n1(r.wStayOpen) + '% of the opening weight</div></div>' +
    '<div class="mh-tile"><div class="mh-big">' + r.nOut + '</div><div class="mh-cap">left</div><div class="mh-sub">' + n1(r.wOut) + '% of the opening weight · ' + ['ACQ', 'BK', 'SPX', 'LIVE', 'OTH'].filter(function (c) { return r.outState[c][0]; }).map(function (c) { return r.outState[c][0] + ' ' + FATE_SHORT[c].toLowerCase(); }).join(', ') + '</div></div>' +
    '<div class="mh-tile"><div class="mh-big">' + r.nIn + '</div><div class="mh-cap">entered</div><div class="mh-sub">' + n1(r.wIn) + '% of the closing-snapshot weight</div></div></div>';
  var tbl = '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Sector</th><th class="r">Weight of leavers</th><th class="r">Names out</th><th class="r">Weight of entrants</th><th class="r">Names in</th><th class="r">Net (in − out)</th></tr></thead><tbody>' +
    D.meta.sectors.map(function (sc) { var d = r.bySec[sc]; if (!d.nOut && !d.nIn) return ''; var net = d.inn - d.out; return '<tr><td><i class="mh-dot" style="background:' + SEC_COL[sc] + '"></i>' + sc + '</td><td class="r">' + n1(d.out) + '%</td><td class="r">' + d.nOut + '</td><td class="r">' + n1(d.inn) + '%</td><td class="r">' + d.nIn + '</td><td class="r ' + cls(net) + '">' + pp(net) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  var nm = function (ids, k, wk) { return ids.map(function (i) { var s = D.secs[i]; return '<tr><td>' + nameCell(s) + '</td><td>' + s.s + '</td><td class="r">' + n1(s.w[wk], 2) + '%</td><td>' + badge(s.st) + '</td></tr>'; }).join(''); };
  var lists = '<div class="mh-two"><div><div class="mh-ch">Largest leavers</div><table class="mh-tbl"><thead><tr><th>Name</th><th>Sector</th><th class="r">Weight</th><th>Today</th></tr></thead><tbody>' + nm(r.topOut, a, a) + '</tbody></table></div>' +
    '<div><div class="mh-ch">Largest entrants</div><table class="mh-tbl"><thead><tr><th>Name</th><th>Sector</th><th class="r">Weight</th><th>Today</th></tr></thead><tbody>' + nm(r.topIn, b, b) + '</tbody></table></div></div>';
  return head + tiles + tbl + lists + '<div class="mh-ch" style="margin-top:20px">Where the weight sat, snapshot by snapshot</div><div id="mh-secw"></div>';
}
function mountSecW() {
  var box = document.getElementById('mh-secw'); if (!box) return;
  mountStack(box, { cats: D.bases.map(function (b, k) { return snapLbl(k); }), unit: '%', max: 100, fmt: function (v) { return v.toFixed(1) + '%'; },
    series: D.meta.sectors.map(function (sc) { return { key: sc, label: sc, color: SEC_COL[sc], vals: D.sectors.map(function (y) { return y.d[sc].w; }) }; }),
    note: 'Opening weights of each snapshot, BICS sectors. Technology and Communications swell into Dec 1999; Financials, Energy, Health Care and Consumer Staples give the weight back and then take it again.' });
}

// ── fate / mortality ──
function fateHtml() {
  var head = '<div class="mh-row">' + secBtn('fmode', [['weight', 'By weight'], ['count', 'By number of names']], st.fmode) + '</div><div id="mh-fate"></div>';
  var k = st.fsnap, f = D.fate[k];
  var sel = '<div class="mh-row" style="margin-top:18px"><label class="mh-lbl">Snapshot</label>' + secBtn('fsnap', D.bases.map(function (b, i) { return [i, snapLbl(i)]; }), st.fsnap) + '</div>';
  var rows = D.meta.sectors.map(function (sc) { var d = f.s[sc], n = 0, w = 0, gone = 0, gw = 0; D.meta.states.forEach(function (c) { n += d[c][0]; w += d[c][1]; if (c !== 'SPX') { gone += d[c][0]; gw += d[c][1]; } });
    return n ? '<tr><td><i class="mh-dot" style="background:' + SEC_COL[sc] + '"></i>' + sc + '</td><td class="r">' + n + '</td><td class="r">' + n1(w) + '%</td>' + D.meta.states.map(function (c) { return '<td class="r">' + d[c][0] + '</td>'; }).join('') + '<td class="r"><b>' + n1(gone / n * 100, 0) + '%</b></td><td class="r">' + n1(w ? gw / w * 100 : 0, 0) + '%</td></tr>' : ''; }).join('');
  var tbl = '<div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Sector at ' + snapLbl(k) + '</th><th class="r">Names</th><th class="r">Weight</th>' + D.meta.states.map(function (c) { return '<th class="r">' + FATE_SHORT[c] + '</th>'; }).join('') + '<th class="r">% of names not in the S&amp;P 500 today</th><th class="r">% of weight not in it</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  var top = secsAt(k).sort(function (a, b) { return b.w[k] - a.w[k]; }).slice(0, 30);
  var nxt = Math.min(NK - 1, k + 1);
  var lead = '<div class="mh-ch" style="margin-top:18px">The 30 largest names at ' + snapLbl(k) + ' — where are they today?</div><div class="mh-scroll" style="max-height:440px"><table class="mh-tbl"><thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r">Weight</th><th class="r">Next-year return</th><th class="r">Delisted</th><th>Today</th></tr></thead><tbody>' +
    top.map(function (s, i) { return '<tr><td class="mh-mu">' + (i + 1) + '</td><td>' + nameCell(s) + '</td><td>' + s.s + '</td><td class="r">' + n1(s.w[k], 2) + '%</td><td class="r ' + cls(s.r[k]) + '">' + pc(s.r[k], 0) + '</td><td class="r mh-mu">' + (s.st === 'SPX' || s.st === 'LIVE' ? '' : (s.x || '')) + '</td><td>' + badge(s.st) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="mh-note">State comes from Bloomberg\'s delisting type and date plus the current S&amp;P 500 list, keyed on the FIGI. "Acquired" includes mergers of equals and stock deals, where the business lives on inside the buyer; it counts as the name no longer existing, not as a failure. Bankruptcy = Chapter 11 ticker (Q suffix), liquidation, or a hand-listed few; old equity is what is counted (Kodak, Delta and American Airlines emerged, their old shares did not).</div>';
  return head + sel + tbl + lead;
}
function mountFate() {
  var box = document.getElementById('mh-fate'); if (!box) return;
  var w = st.fmode === 'weight';
  mountStack(box, { cats: D.bases.map(function (b, k) { return snapLbl(k); }), unit: w ? '%' : '', unitLabel: w ? 'of the opening weight' : 'of the 500 names', max: w ? 100 : 500, title: 'What became of the names in the index at each snapshot', fmt: function (v) { return w ? v.toFixed(1) + '%' : String(Math.round(v)); },
    series: D.meta.states.map(function (c) { return { key: c, label: FATE_SHORT[c], color: FATE_COL[c], vals: D.fate.map(function (f) { return f.t[c][w ? 1 : 0]; }) }; }) });
}

// ── macro ──
var MACRO_GROUPS = {
  market: ['Market & valuation', function (M) { return [
    { title: 'S&P 500 (monthly average)', unit: 'index', k: 'm', series: [{ key: 'sp', label: 'S&P 500', color: '#1E2733', vals: M.m.sp, fmt: function (v) { return v.toFixed(0); } }] },
    { title: 'Nasdaq Composite (month-end)', unit: 'index', k: 'm', series: [{ key: 'nasdaq', label: 'Nasdaq', color: '#185FA5', vals: M.m.nasdaq, fmt: function (v) { return v.toFixed(0); } }] },
    { title: 'Margin debt (FINRA, from 1997)', unit: '$ billions', k: 'm', series: [{ key: 'margin', label: 'Debit balances', color: '#B45309', vals: M.m.margin, fmt: function (v) { return v.toFixed(0); } }] },
    { title: 'Baa corporate yield minus 10-year Treasury', unit: 'pp', k: 'm', series: [{ key: 'baa', label: 'Baa spread', color: '#9B2A20', vals: M.m.baaSpread, fmt: function (v) { return v.toFixed(2); } }, { key: 'aaa', label: 'Aaa spread', color: '#3E5A82', vals: M.m.aaaSpread, fmt: function (v) { return v.toFixed(2); } }], note: 'Investment-grade spreads only: Moody\'s Baa / Aaa. High-yield and telecom-specific spreads are not available publicly for 1999-2002 (see data gaps).' } ]; }],
  rates: ['Rates, policy & fiscal', function (M) { return [
    { title: 'Fed funds rate', unit: '%', k: 'm', series: [{ key: 'ffr', label: 'Fed funds', color: '#1E2733', vals: M.m.ffr, fmt: function (v) { return v.toFixed(2) + '%'; } }], note: 'The market peaked with the Fed raising, not cutting: 4.75% in mid-1999 to 6.50% in May 2000.' },
    { title: '10-year and 2-year Treasury yields', unit: '%', k: 'm', series: [{ key: 'y10', label: '10-year', color: '#185FA5', vals: M.m.y10, fmt: function (v) { return v.toFixed(2) + '%'; } }, { key: 'y2', label: '2-year', color: '#B45309', vals: M.m.y2, fmt: function (v) { return v.toFixed(2) + '%'; } }] },
    { title: 'Yield curve: 10-year minus 2-year', unit: 'pp', k: 'm', series: [{ key: 'curve', label: '10y − 2y', color: '#7C3AED', vals: M.m.curve, fmt: function (v) { return v.toFixed(2); } }] },
    { title: 'Banks tightening C&I loan standards (net %)', unit: '% of banks', k: 'q', series: [{ key: 'sloos', label: 'SLOOS, large & mid-size firms', color: '#9B2A20', vals: M.q.sloos, fmt: function (v) { return v.toFixed(1); } }] },
    { title: 'Federal surplus / deficit', unit: '% of GDP', k: 'a', series: [{ key: 'fiscal', label: 'Surplus (+) / deficit (−)', color: '#177A4E', vals: M.a.fiscalVals, fmt: function (v) { return v.toFixed(2) + '%'; } }], note: 'Fiscal years. Surpluses in 1998-2001; the sign today is the opposite.' } ]; }],
  real: ['Real economy', function (M) { return [
    { title: 'Unemployment rate', unit: '%', k: 'm', series: [{ key: 'unrate', label: 'Unemployment', color: '#1E2733', vals: M.m.unrate, fmt: function (v) { return v.toFixed(1) + '%'; } }] },
    { title: 'Nonfarm payrolls, year over year', unit: '%', k: 'm', series: [{ key: 'payYoy', label: 'Payrolls y/y', color: '#185FA5', vals: M.m.payYoy, fmt: function (v) { return v.toFixed(2) + '%'; } }] },
    { title: 'Consumer prices, year over year', unit: '%', k: 'm', series: [{ key: 'cpiYoy', label: 'CPI', color: '#9B2A20', vals: M.m.cpiYoy, fmt: function (v) { return v.toFixed(2) + '%'; } }, { key: 'coreYoy', label: 'Core CPI', color: '#8A93A0', vals: M.m.coreYoy, fmt: function (v) { return v.toFixed(2) + '%'; } }] },
    { title: 'Capacity utilization', unit: '%', k: 'm', series: [{ key: 'tcu', label: 'Total industry', color: '#7C3AED', vals: M.m.tcu, fmt: function (v) { return v.toFixed(1) + '%'; } }] },
    { title: 'Labor productivity, nonfarm business', unit: 'index 2012=100', k: 'q', series: [{ key: 'prod', label: 'Output per hour', color: '#177A4E', vals: M.q.prod, fmt: function (v) { return v.toFixed(1); } }] },
    { title: 'Real GDP growth (annualised)', unit: '%', k: 'q', series: [{ key: 'gdp', label: 'GDP growth', color: '#1E2733', vals: M.q.gdpGrowth, fmt: function (v) { return v.toFixed(1) + '%'; } }] },
    { title: 'Housing starts', unit: 'thousands, annualised', k: 'm', series: [{ key: 'housing', label: 'Starts', color: '#B45309', vals: M.m.housing, fmt: function (v) { return v.toFixed(0); } }] } ]; }],
  commod: ['Commodities & dollar', function (M) { return [
    { title: 'WTI crude oil', unit: '$ / barrel, monthly average', k: 'm', series: [{ key: 'wti', label: 'WTI', color: '#1E2733', vals: M.m.wti, fmt: function (v) { return '$' + v.toFixed(2); } }], note: 'About $11 at the end of 1998; a cost shock during the melt-up and again after 2002.' },
    { title: 'Natural gas, Henry Hub', unit: '$ / MMBtu', k: 'm', series: [{ key: 'gas', label: 'Henry Hub', color: '#C0392B', vals: M.m.gas, fmt: function (v) { return '$' + v.toFixed(2); } }] },
    { title: 'Copper', unit: '$ / metric ton', k: 'm', series: [{ key: 'copper', label: 'Copper', color: '#BA7517', vals: M.m.copper, fmt: function (v) { return '$' + v.toFixed(0); } }] },
    { title: 'IMF commodity indices (2016=100)', unit: 'index', k: 'm', series: [{ key: 'all', label: 'All commodities', color: '#1E2733', vals: M.m.commAll, fmt: function (v) { return v.toFixed(1); } }, { key: 'en', label: 'Energy', color: '#C0392B', vals: M.m.commEnergy, fmt: function (v) { return v.toFixed(1); } }, { key: 'me', label: 'Metals', color: '#0B9D7A', vals: M.m.commMetals, fmt: function (v) { return v.toFixed(1); } }] },
    { title: 'Broad dollar index (goods)', unit: 'Jan 1997 = 100', k: 'm', series: [{ key: 'usd', label: 'Nominal broad dollar', color: '#3E5A82', vals: M.m.usd, fmt: function (v) { return v.toFixed(1); } }], note: 'Strong dollar from 1995 to 2001, then a long decline — the backdrop of the commodity and emerging-market rally that followed.' } ]; }],
  tech: ['Tech investment & prices', function (M) { return [
    { title: 'Investment in information processing equipment & software', unit: '$ billions, annualised', k: 'q', series: [{ key: 'it', label: 'Private fixed investment', color: '#185FA5', vals: M.q.itInv, fmt: function (v) { return v.toFixed(0); } }], note: 'The closest public series to today\'s AI capex: the 2000 peak, then a fall that took years to recover.' },
    { title: 'Computers & peripheral equipment investment', unit: '$ billions, annualised', k: 'q', series: [{ key: 'comp', label: 'Computers & peripherals', color: '#0F6E56', vals: M.q.compInv, fmt: function (v) { return v.toFixed(0); } }] },
    { title: 'Information processing equipment investment', unit: '$ billions, annualised', k: 'q', series: [{ key: 'ipe', label: 'Equipment', color: '#7C3AED', vals: M.q.ipEquip, fmt: function (v) { return v.toFixed(0); } }] },
    { title: 'Producer price index: semiconductors & related devices', unit: 'index', k: 'm', series: [{ key: 'semi', label: 'PPI', color: '#9B2A20', vals: M.m.semiPpi, fmt: function (v) { return v.toFixed(1); } }], note: 'Price down, volume up: the PPI falls steadily while the industry grows. No public series exists for the price of bandwidth, DRAM spot or lit-fibre utilisation (see data gaps).' } ]; }]
};
function macroHtml() {
  var tabs = Object.keys(MACRO_GROUPS).map(function (g) { return [g, MACRO_GROUPS[g][0]]; });
  var ev = D.events.map(function (e) { return '<tr><td>' + e[0] + '</td><td>' + esc(e[1]) + '</td><td class="mh-mu">' + e[2] + '</td></tr>'; }).join('');
  return '<div class="mh-row">' + secBtn('mgroup', tabs, st.mgroup) + '<span class="mh-mu" style="margin-left:12px">Shaded: Mar 2000 → Oct 2002. Dashed lines: events (hover). Drag to zoom, double-click to reset.</span></div><div class="mh-grid" id="mh-macro"></div>' +
    '<details class="mh-det" style="margin-top:14px"><summary>Events marked on the charts</summary><table class="mh-tbl"><thead><tr><th>Date</th><th>Event</th><th>Type</th></tr></thead><tbody>' + ev + '</tbody></table><div class="mh-note">Dates of laws and bankruptcies are public record; market highs and lows are from memory and still to verify against S&amp;P DJI / Nasdaq.</div></details>';
}
function mountMacro() {
  var box = document.getElementById('mh-macro'); if (!box) return;
  var M = JSON.parse(JSON.stringify(D.macro)); var fy = Object.keys(M.a.fiscal).sort(); M.a.fiscalVals = fy.map(function (y) { return M.a.fiscal[y]; });
  var xs = { m: M.months, q: M.quarters.map(function (q) { return q; }), a: fy };
  var qIdx = function (iso) { return (+iso.slice(0, 4) - 1994) * 4 + Math.floor((+iso.slice(5, 7) - 1) / 3); };
  var mIdx = function (iso) { return (+iso.slice(0, 4) - 1994) * 12 + (+iso.slice(5, 7) - 1); };
  var charts = MACRO_GROUPS[st.mgroup][1](M);
  box.innerHTML = charts.map(function (c, i) { return '<div class="mh-mini" id="mh-m' + i + '"></div>'; }).join('');
  charts.forEach(function (c, i) {
    var ix = c.k === 'm' ? mIdx : c.k === 'q' ? qIdx : function (iso) { return +iso.slice(0, 4) - 1993; };
    var x = c.k === 'q' ? M.quarters.map(function (q) { return q.slice(0, 4) + '-' + ('0' + ((+q[5] - 1) * 3 + 1)).slice(-2); }) : xs[c.k];
    var bands = c.k === 'a' ? [] : [{ i0: ix('2000-03-24'), i1: ix('2002-10-09') }];
    var events = c.k === 'a' ? [] : D.events.map(function (e) { return { i: ix(e[0]), label: e[0] + ' · ' + e[1] }; });
    mountLine(document.getElementById('mh-m' + i), { x: x, ordinal: c.k === 'a', compact: true, title: c.title, unit: c.unit, series: c.series, bands: bands, events: events, note: c.note, alwaysLegend: c.series.length > 1 });
  });
}

// ── scorecard & gaps ──

// ─── facts: every number in the narrative is computed here, from the data ───────────────
function dn(v) { return n1(Math.abs(v), 0) + '%'; }
function dn1(v) { return n1(Math.abs(v), 1) + '%'; }
function wmean(rs, ws) { var t = 0, s = 0; for (var i = 0; i < rs.length; i++) { t += ws[i]; s += rs[i] * ws[i]; } return t ? s / t : null; }
function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
// items: [{ w, r }] — w any positive weight, r % return of the window
function breadth(items) {
  var tw = items.reduce(function (a, x) { return a + x.w; }, 0), r = items.map(function (x) { return x.r; });
  var cap = items.reduce(function (a, x) { return a + x.w * x.r; }, 0) / tw, avg = mean(r), mu = avg;
  var sd = Math.sqrt(mean(r.map(function (v) { return (v - mu) * (v - mu); }))), srt = r.slice().sort(function (a, b) { return a - b; }), n10 = Math.floor(srt.length / 10);
  var ws = items.map(function (x) { return x.w / tw * 100; }).sort(function (a, b) { return b - a; });
  return { n: items.length, cap: cap, ew: avg, med: med(r), up: r.filter(function (v) { return v > 0; }).length / r.length * 100, beat: r.filter(function (v) { return v > cap; }).length / r.length * 100,
    sd: sd, topDec: mean(srt.slice(-n10)), botDec: mean(srt.slice(0, n10)), top10w: ws.slice(0, 10).reduce(function (a, b) { return a + b; }, 0) };
}
function histBreadth(k) { return breadth(D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }).map(function (s) { return { w: s.w[k], r: s.r[k] }; })); }
function nowBreadth() {
  return (SPX_HOLDINGS.years || []).map(function (y) {
    var b = breadth((y.holdings || []).filter(function (h) { return h.w > 0 && h.r != null; }).map(function (h) { return { w: h.w, r: h.r }; }));
    b.label = String(y.year) + (y.year === +SPX_HOLDINGS.asOf.slice(0, 4) ? ' YTD' : ''); return b; });
}
// cap-weighted path of a group of names, each year weighted by the members still in the index; 100 at Dec 1999
function groupPath(list) {
  var lvl = 100, p = [100];
  for (var k = K0; k < NK; k++) {
    var m = list.filter(function (s) { return s.r[k] != null && s.w[k] != null; });
    if (m.length) lvl *= 1 + wmean(m.map(function (s) { return s.r[k]; }), m.map(function (s) { return s.w[k]; })) / 100;
    p.push(lvl);
  }
  return p;
}
function endLbls() { var a = [snapLbl(K0)]; for (var k = K0; k < NK; k++) a.push('Dec ' + D.years[k]); return a; }
function cohortAll() { return D.secs.filter(function (s) { return s.q != null; }); }
function spreads() {   // prior-year top fifth minus bottom fifth: median return in the NEXT year
  var out = [];
  for (var k = 0; k < NK - 1; k++) {
    var m = D.secs.filter(function (s) { return s.r[k] != null && s.r[k + 1] != null; }).sort(function (a, b) { return a.r[k] - b.r[k]; }), n = m.length;
    var lo = m.slice(0, Math.floor(n / 5)), hi = m.slice(Math.ceil(n * 4 / 5));
    out.push({ lbl: D.years[k] + '→' + D.years[k + 1], hi: med(hi.map(function (s) { return s.r[k + 1]; })), lo: med(lo.map(function (s) { return s.r[k + 1]; })) });
  }
  return out;
}
var FACTS = null;
function facts() {
  if (FACTS) return FACTS;
  var f = {}, cohort = cohortAll(), tc = ['Technology', 'Communications'];
  f.b = D.years.map(function (y, k) { return histBreadth(k); });
  f.now = nowBreadth();
  f.paths = {}; D.meta.sectors.forEach(function (sc) { var g = cohort.filter(function (s) { return s.s === sc; }); if (g.length) f.paths[sc] = groupPath(g); });
  f.all = groupPath(cohort);
  f.q = {}; [5, 4, 3, 2, 1].forEach(function (q) { f.q[q] = groupPath(cohort.filter(function (s) { return s.q === q; })); });
  f.q5tc = groupPath(cohort.filter(function (s) { return s.q === 5 && tc.indexOf(s.s) >= 0; }));
  f.q5ot = groupPath(cohort.filter(function (s) { return s.q === 5 && tc.indexOf(s.s) < 0; }));
  f.q1ot = groupPath(cohort.filter(function (s) { return s.q === 1 && tc.indexOf(s.s) < 0; }));
  var q5 = cohort.filter(function (s) { return s.q === 5; }), q5w = q5.reduce(function (a, s) { return a + s.w[K0]; }, 0);
  f.q5w = q5w; f.q5n = q5.length; f.q5tcShare = q5.filter(function (s) { return tc.indexOf(s.s) >= 0; }).reduce(function (a, s) { return a + s.w[K0]; }, 0) / q5w * 100;
  f.q5med = med(q5.map(function (s) { return s.r05; })); f.q1med = med(cohort.filter(function (s) { return s.q === 1; }).map(function (s) { return s.r05; }));
  f.q5tcMed = med(q5.filter(function (s) { return tc.indexOf(s.s) >= 0; }).map(function (s) { return s.r05; }));
  f.q5otMed = med(q5.filter(function (s) { return tc.indexOf(s.s) < 0; }).map(function (s) { return s.r05; }));
  f.q1otMed = med(cohort.filter(function (s) { return s.q === 1 && tc.indexOf(s.s) < 0; }).map(function (s) { return s.r05; }));
  f.spreads = spreads();
  var top = D.secs.filter(function (s) { return s.w[K0] != null; }).sort(function (a, b) { return b.w[K0] - a.w[K0]; });
  f.top10 = top.slice(0, 10);
  f.top10Spx = f.top10.filter(function (s) { return s.st === 'SPX'; }).length;
  f.top10Med = med(f.top10.map(function (s) { return s.r05; }));
  f.ig = {};
  var igs = {}; cohort.forEach(function (s) { if (s.g) (igs[s.g] = igs[s.g] || []).push(s); });
  f.igRows = Object.keys(igs).map(function (g) {
    var p = groupPath(igs[g]), w = igs[g].reduce(function (a, s) { return a + s.w[K0]; }, 0);
    return { g: g, sector: igs[g][0].s, w: w, n: igs[g].length, r00: (p[1] / p[0] - 1) * 100, r0102: (p[3] / p[1] - 1) * 100, r0305: (p[6] / p[3] - 1) * 100, tot: (p[6] / p[0] - 1) * 100, p02: (p[3] / p[0] - 1) * 100 };
  }).filter(function (r) { return r.w >= 1.5; }).sort(function (a, b) { return b.w - a.w; });
  FACTS = f; return f;
}

// ─── follow the names: the best / worst of a year, and the years around it ───
var FN_PAL = ['#185FA5', '#D85A30', '#177A4E', '#7C3AED', '#BA7517', '#C0392B', '#0B9D7A', '#993556', '#3E5A82', '#8A6D00'];
var FN_SIDE = { top: ['#1E2733', 'Best'], bot: ['#B45309', 'Worst'] };
function lvl(s, i) { for (var j = i; j >= 0; j--) if (s.p[j] != null) return s.p[j]; return null; }   // price at snapshot i; a name that left stays at its last close
function fnPool() {
  var f = st.fn, k = D.years.indexOf(f.y);
  var pool = D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null && (f.sec === 'All' || s.s === f.sec); }).map(function (s) { return { s: s, ret: s.r[k], contrib: s.w[k] * s.r[k] / 100 }; });
  pool.sort(function (a, b) { return b[f.by] - a[f.by]; });
  pool.forEach(function (d, i) { d.rank = i + 1; });
  var N = f.n > 0 ? Math.min(f.n, pool.length) : pool.length;
  return { k: k, pool: pool, top: pool.slice(0, N), bot: pool.slice(f.side === 'both' ? Math.max(N, pool.length - N) : pool.length - N).reverse() };
}
function fnControls() {
  var f = st.fn, yrs = D.years.slice(0, NK - 1);
  return '<div class="mh-row"><label class="mh-lbl">Year</label><span class="sb-toggle mh-seg" id="mh-fny-b">' + yrs.map(function (y) { return '<button class="sb-tbtn' + (y === f.y ? ' active' : '') + '" data-act="fny" data-v="' + y + '">' + y + '</button>'; }).join('') + '</span></div>' +
    '<div class="mh-row"><input type="range" id="mh-fny" min="' + yrs[0] + '" max="' + yrs[yrs.length - 1] + '" step="1" value="' + f.y + '" class="mh-range"><span class="mh-mu">drag to move through the years</span></div>' +
    '<div class="mh-row"><label class="mh-lbl">Show</label>' + secBtn('fns', [['top', 'Best'], ['bot', 'Worst'], ['both', 'Both']], f.side) +
    '<label class="mh-lbl" style="margin-left:10px">How many</label>' + secBtn('fnn', [[5, '5'], [10, '10'], [20, '20']], f.n) +
    '<label class="mh-lbl" style="margin-left:10px">Ranked by</label>' + secBtn('fnb', [['ret', 'Return'], ['contrib', 'Contribution to the index']], f.by) + '</div>' +
    '<div class="mh-row"><label class="mh-lbl">Sector</label><select id="mh-fnsec" class="mh-sel">' + ['All'].concat(D.meta.sectors).map(function (x) { return '<option' + (x === f.sec ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>' +
    '<label class="mh-lbl" style="margin-left:10px">View</label>' + secBtn('fnv', [['strip', 'Year by year'], ['path', 'Price paths'], ['scat', 'Scatter: return vs weight']], f.view) + '</div>';
}
function fnHeat(v) {
  if (v == null) return '';
  var a = Math.min(.5, .06 + Math.abs(v) / 100 * .34);
  return 'background:' + (v >= 0 ? 'rgba(23,122,78,' + a + ')' : 'rgba(155,42,32,' + a + ')');
}
function fnStrip(list, side, k) {
  var yrs = D.years, cols = yrs.map(function (y, i) { return '<th class="r' + (i === k ? ' mh-selcol' : '') + '">' + y + '</th>'; }).join('');
  var rows = list.map(function (d) {
    var s = d.s, last = -1; s.r.forEach(function (v, i) { if (v != null) last = i; });
    return '<tr><td class="mh-mu">' + d.rank + '</td><td>' + nameCell(s) + '</td><td><i class="mh-dot" style="background:' + SEC_COL[s.s] + '"></i>' + s.s + '</td><td class="r">' + n1(s.w[k], 2) + '%</td>' +
      yrs.map(function (y, i) {
        var v = s.r[i], sel = i === k ? ' mh-selcol' : '';
        if (v != null) return '<td class="r mh-cell' + sel + '" style="' + fnHeat(v) + '" title="' + y + ': ' + pc(v, 1) + '">' + pc(v, 0) + '</td>';
        if (i === last + 1 && last < NK - 1) return '<td class="r mh-mu' + sel + '" title="Left the S&amp;P 500 after ' + yrs[last] + (s.x ? ' (delisted ' + s.x + ')' : '') + '. Carried at its last close.">out</td>';
        return '<td class="' + sel + '"></td>';
      }).join('') + '<td>' + badge(s.st) + '</td></tr>';
  }).join('');
  var ref = function (lab, vals) { return '<tr class="mh-tot"><td></td><td>' + lab + '</td><td></td><td></td>' + vals.map(function (v, i) { return '<td class="r ' + cls(v) + (i === k ? ' mh-selcol' : '') + '">' + pc(v, 0) + '</td>'; }).join('') + '<td></td></tr>'; };
  var f = facts();
  return '<div class="mh-ch" style="margin-top:14px"><i class="mh-dot" style="background:' + FN_SIDE[side][0] + '"></i>' + FN_SIDE[side][1] + ' ' + list.length + ' of ' + D.years[k] + ' and what they did in every year</div><div class="mh-scroll"><table class="mh-tbl mh-strip"><thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r">Weight, start of ' + D.years[k] + '</th>' + cols + '<th>Today</th></tr></thead><tbody>' + rows +
    ref('S&amp;P 500, published', D.index.map(function (x) { return x.pub; })) + ref('Median stock', f.b.map(function (x) { return x.med; })) + '</tbody></table></div>';
}
function fnTiles(list, side, k) {
  var c = { BK: 0, ACQ: 0, OTH: 0, LIVE: 0, up: 0, dn: 0 }, base = k + 1;
  list.forEach(function (d) { var s = d.s; if (s.st === 'SPX') { var l = lvl(s, 11); (l != null && lvl(s, base) != null && l >= lvl(s, base) ? c.up++ : c.dn++); } else c[s.st]++; });
  var T = function (n, cap, sub) { return '<div class="mh-tile"><div class="mh-big">' + n + '</div><div class="mh-cap">' + cap + '</div>' + (sub ? '<div class="mh-sub">' + sub + '</div>' : '') + '</div>'; };
  return '<div class="mh-ch" style="margin-top:12px"><i class="mh-dot" style="background:' + FN_SIDE[side][0] + '"></i>Where the ' + FN_SIDE[side][1].toLowerCase() + ' ' + list.length + ' ended up</div><div class="mh-tiles mh-tiles6">' +
    T(c.BK, 'Bankrupt', 'old shares wiped out') + T(c.ACQ + c.OTH, 'Acquired, merged or delisted', 'the name no longer exists') + T(c.LIVE, 'Still listed, out of the S&amp;P 500', 'a shadow of what it was?') +
    T(c.dn, 'In the S&amp;P 500, below its Dec ' + D.years[k] + ' close', 'at Dec 2005') + T(c.up, 'In the S&amp;P 500, above it', 'at Dec 2005') + '</div>';
}
function fnReading(list, side, k) {
  var f = st.fn, m = function (fn) { return med(list.map(fn)); };
  var prior = k > 0 ? m(function (d) { return d.s.r[k - 1]; }) : null;
  var next1 = m(function (d) { var a = lvl(d.s, k + 1), b = lvl(d.s, k + 2); return a && b ? (b / a - 1) * 100 : null; });
  var next3 = k + 4 <= 11 ? m(function (d) { var a = lvl(d.s, k + 1), b = lvl(d.s, k + 4); return a && b ? (b / a - 1) * 100 : null; }) : null;
  var gone = list.filter(function (d) { return d.s.r[NK - 1] == null; }).length, bk = list.filter(function (d) { return d.s.st === 'BK'; }).length;
  return '<div class="mh-read"><b>Reading.</b> The ' + list.length + ' ' + FN_SIDE[side][1].toLowerCase() + ' stocks of ' + D.years[k] + (f.sec !== 'All' ? ' in ' + f.sec : '') + ', by ' + (f.by === 'ret' ? 'return' : 'contribution to the index') + ': median ' + pc(m(function (d) { return d.ret; }), 0) + ' that year' +
    (prior != null ? ', ' + pc(prior, 0) + ' the year before' : '') + (next1 != null ? ', ' + pc(next1, 0) + ' the year after' : '') + (next3 != null ? ' and ' + pc(next3, 0) + ' over the three years after that' : '') + '. ' +
    gone + ' of them had left the index by Dec 2004' + (bk ? ', ' + bk + ' bankrupt' : '') + '.</div>';
}
function fnPath(pk, k) {
  var f = st.fn, x = D.bases.map(function (b, i) { return snapLbl(i); }).concat(['Dec ' + D.years[NK - 1]]);
  var series = [], sides = f.side === 'both' ? ['top', 'bot'] : [f.side];
  var pubL = D.index.map(function (r) { return 1 + r.pub / 100; });
  var spx = x.map(function (_, i) { var v = 1; if (i >= k) for (var j = k; j < i; j++) v *= pubL[j]; else for (var j2 = i; j2 < k; j2++) v /= pubL[j2]; return v * 100; });
  sides.forEach(function (side) {
    var list = side === 'top' ? pk.top : pk.bot, col = FN_SIDE[side][0];
    if (sides.length === 1 && list.length <= 10) list.forEach(function (d, j) {
      series.push({ key: 'n' + side + j, label: d.s.t || d.s.n, color: FN_PAL[j % FN_PAL.length], vals: x.map(function (_, i) { return d.s.p[i] != null && d.s.p[k] ? d.s.p[i] / d.s.p[k] * 100 : null; }), fmt: function (v) { return n1(v, 0); } });
    });
    series.push({ key: 'm' + side, label: FN_SIDE[side][1] + ' ' + list.length + ': median', color: col, dash: false, vals: x.map(function (_, i) { return med(list.map(function (d) { var a = lvl(d.s, k), b = lvl(d.s, i); return a && b && d.s.p[k] != null ? b / a * 100 : null; })); }), fmt: function (v) { return n1(v, 0); } });
  });
  series.push({ key: 'spx', label: 'S&P 500 (published)', color: '#8A93A0', dash: true, vals: spx, fmt: function (v) { return n1(v, 0); } });
  mountLine(document.getElementById('mh-fnchart'), { x: x, ordinal: true, alwaysLegend: true, title: 'What 100 held at ' + snapLbl(k) + ' became', unit: 'a name that leaves the index stays at its last close; the two dashed verticals bracket ' + D.years[k], yFmt: function (v) { return v; }, series: series,
    events: [{ i: k, label: 'Start of ' + D.years[k] }, { i: k + 1, label: 'End of ' + D.years[k] }] });
}
function fnScat(pk, k) {
  var f = st.fn, pool = pk.pool, key = f.by, VW = 900, VH = 420, M = { t: 14, r: 24, b: 44, l: 54 }, cw = VW - M.l - M.r, ch = VH - M.t - M.b;
  var xs = pool.map(function (d) { return d[key]; }), lo = Math.min.apply(null, xs.concat(0)), hi = Math.max.apply(null, xs.concat(0)), pad = (hi - lo) * .05 || 1, xLo = lo - pad, xHi = hi + pad;
  var yHi = Math.max.apply(null, pool.map(function (d) { return d.s.w[k]; })) * 1.08;
  var X = function (v) { return M.l + (v - xLo) / (xHi - xLo) * cw; }, Y = function (v) { return M.t + ch - v / yHi * ch; };
  var mark = {}; (f.side !== 'bot' ? pk.top : []).forEach(function (d) { mark[d.s.f] = 'top'; }); (f.side !== 'top' ? pk.bot : []).forEach(function (d) { mark[d.s.f] = 'bot'; });
  var g = '', st1 = niceStep(xHi - xLo), st2 = niceStep(yHi);
  for (var v = Math.ceil(xLo / st1) * st1; v <= xHi; v += st1) g += '<line x1="' + X(v) + '" x2="' + X(v) + '" y1="' + M.t + '" y2="' + (VH - M.b) + '" stroke="#EEF1F4"/><text x="' + X(v) + '" y="' + (VH - M.b + 14) + '" text-anchor="middle" font-size="10" fill="#8A93A0">' + (v > 0 ? '+' : '') + (+v.toFixed(2)) + '%</text>';
  for (var u = 0; u <= yHi; u += st2) g += '<line x1="' + M.l + '" x2="' + (VW - M.r) + '" y1="' + Y(u) + '" y2="' + Y(u) + '" stroke="#EEF1F4"/><text x="' + (M.l - 6) + '" y="' + (Y(u) + 3.5) + '" text-anchor="end" font-size="10" fill="#8A93A0">' + (+u.toFixed(2)) + '%</text>';
  if (xLo < 0 && xHi > 0) g += '<line x1="' + X(0) + '" x2="' + X(0) + '" y1="' + M.t + '" y2="' + (VH - M.b) + '" stroke="#C0C8D0" stroke-width="1.5"/>';
  g += '<text x="' + (M.l + cw / 2) + '" y="' + (VH - 6) + '" text-anchor="middle" font-size="11" fill="#8A93A0">' + (key === 'ret' ? 'Return in ' + D.years[k] : 'Contribution to the index in ' + D.years[k] + ' (pp)') + '</text>';
  g += '<text transform="translate(12,' + (M.t + ch / 2) + ') rotate(-90)" text-anchor="middle" font-size="11" fill="#8A93A0">Weight at the start of ' + D.years[k] + '</text>';
  var dots = pool.slice().sort(function (a, b) { return (mark[a.s.f] ? 1 : 0) - (mark[b.s.f] ? 1 : 0); });
  dots.forEach(function (d, i) {
    var m = mark[d.s.f], r = m ? 5.5 : 3.2, col = m ? FN_SIDE[m][0] : '#B7C0CC';
    g += '<circle class="mh-hit" data-i="' + pool.indexOf(d) + '" cx="' + X(d[key]) + '" cy="' + Y(d.s.w[k]) + '" r="' + r + '" fill="' + col + '" fill-opacity="' + (m ? .8 : .55) + '" stroke="#fff" stroke-width="1"/>';
    if (m) g += '<text x="' + (X(d[key]) + 8) + '" y="' + (Y(d.s.w[k]) + 4) + '" font-size="10.5" font-weight="700" fill="#1E2733">' + esc(d.s.t || d.s.n.split(' ')[0]) + '</text>';
  });
  var box = document.getElementById('mh-fnchart');
  box.innerHTML = '<div class="mh-ch">One dot per member of the index at the start of ' + D.years[k] + ' <span class="mh-mu">the highlighted ones are the names listed above</span></div><svg viewBox="0 0 ' + VW + ' ' + VH + '" class="mh-svg">' + g + '</svg>';
  box.querySelectorAll('.mh-hit').forEach(function (c) {
    c.addEventListener('mousemove', function (e) { var d = pool[+c.getAttribute('data-i')], s = d.s;
      showTip('<b>' + esc(s.n) + '</b>' + (s.t ? ' ' + esc(s.t) : '') + '<div>' + s.s + '</div><div>Return: <b>' + pc(d.ret, 1) + '</b></div><div>Weight: <b>' + n1(s.w[k], 2) + '%</b> · contribution <b>' + pp(d.contrib) + '</b></div><div>Today: ' + FATE_SHORT[s.st] + '</div>', e); });
    c.addEventListener('mouseleave', hideTip);
  });
}
function niceStep(range) { var raw = range / 7, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * mag; }
function renderFN() {
  var box = document.getElementById('mh-fn'); if (!box) return;
  box.innerHTML = fnControls() + '<div id="mh-fnb"></div>';
  renderFNBody();
}
function renderFNBody() {
  var b = document.getElementById('mh-fnb'); if (!b) return;
  var f = st.fn, pk = fnPool(), k = pk.k, sides = f.side === 'both' ? ['top', 'bot'] : [f.side], h = '';
  sides.forEach(function (sd) { h += fnReading(sd === 'top' ? pk.top : pk.bot, sd, k); });
  if (f.view === 'strip') sides.forEach(function (sd) { var l = sd === 'top' ? pk.top : pk.bot; h += fnStrip(l, sd, k) + fnTiles(l, sd, k); });
  else h += '<div id="mh-fnchart"></div>';
  h += '<div class="mh-note">Ranked on the price return of the year, for the members of the index at the previous year-end (' + pk.pool.length + (f.sec !== 'All' ? ' in ' + f.sec : '') + '). A name that leaves the index is carried at its last close and nothing replaces it ("out" marks the year after its last). Contribution = weight at the start of the year × return.</div>';
  b.innerHTML = h;
  if (f.view === 'path') fnPath(pk, k); else if (f.view === 'scat') fnScat(pk, k);
}

// ─── where the weight sat, and where it went (same chart as Index Composition) ───
function wcHtml() {
  var opts = function (cur, lo, hi) { var o = ''; for (var k = lo; k <= hi; k++) o += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + snapLbl(k) + '</option>'; return o; };
  var pre = [[[0, K0], 'The build-up: 1994 → 1999'], [[K0, 8], 'The break: 1999 → 2002'], [[8, NK - 1], 'The rebound: 2002 → 2004'], [[0, NK - 1], 'Whole decade']];
  return '<div class="mh-row"><span class="sb-toggle mh-seg">' + pre.map(function (p) { var on = st.wc[0] === p[0][0] && st.wc[1] === p[0][1]; return '<button class="sb-tbtn' + (on ? ' active' : '') + '" data-act="wcp" data-v="' + p[0].join('-') + '">' + p[1] + '</button>'; }).join('') + '</span></div>' +
    '<div class="mh-row"><label class="mh-lbl">From</label><select id="mh-wcf" class="mh-sel">' + opts(st.wc[0], 0, NK - 2) + '</select><label class="mh-lbl">to</label><select id="mh-wct" class="mh-sel">' + opts(st.wc[1], 1, NK - 1) + '</select></div><div id="mh-wcbox"></div>';
}
function renderWC() {
  var box = document.getElementById('mh-wc'); if (!box) return;
  box.innerHTML = wcHtml();
  var a = st.wc[0], b = st.wc[1], hi = 10;
  D.sectors.forEach(function (y) { D.meta.sectors.forEach(function (sc) { hi = Math.max(hi, Math.ceil(y.d[sc].w / 10) * 10); }); });
  var rows = D.meta.sectors.map(function (sc) { return { name: sc, w0: D.sectors[a].d[sc].w, w1: D.sectors[b].d[sc].w }; }).sort(function (x, y) { return y.w0 - x.w0; });
  dumbbell(document.getElementById('mh-wcbox'), rows, hi, snapLbl(b), snapLbl(a) + ' to ' + snapLbl(b), 'Share of the S&amp;P 500 by sector (BICS) at each year-end snapshot. A sector\'s weight falls when its stocks fall, or when other stocks rise faster.', snapLbl(a));
}

// ─── the story ────────────────────────────────────────────
function finding(n, head, body, exhibit, plain) {
  return '<div class="mh-find"><div class="mh-fh"><span class="mh-fn">' + n + '</span><span class="mh-ft">' + head + '</span></div><div class="mh-fbody">' + body + '</div>' + (plain ? '<div class="mh-plain"><b>In plain words:</b> ' + plain + '</div>' : '') + exhibit + '</div>';
}
function bar(v, mx, goodPos) {
  var w = Math.min(48, Math.abs(v) / mx * 48), pos = v >= 0;
  return '<div class="mh-div"><span style="' + (pos ? 'left:50%;' : 'right:50%;') + 'width:' + w + '%;background:' + (pos ? '#177A4E' : '#9B2A20') + '"></span></div>';
}
function howTo() {
  return '<div class="mh-howto"><div class="mh-blh">How to read this page</div><ul>' +
    '<li><b>What the data is.</b> Every member of the S&amp;P 500 at the last trading day of each year, Dec 1994 to Dec 2004, with its size in the index (its <i>weight</i>) and its price return over the following year. A name that leaves the index is followed to its last close and is not replaced.</li>' +
    '<li><b>Leaders and laggards.</b> Stocks ranked by recent return: the top fifth are the leaders, the bottom fifth the laggards. The question: did leaders keep leading, and did laggards stay behind?</li>' +
    '<li><b>Index vs median stock.</b> The index is weighted by size, so a few big stocks can move it. The median stock is the typical one.</li>' +
    '<li><b>What it cannot tell.</b> Only prices and weights: no revenue, profit or valuation. It says what happened, not why, and not what comes next.</li></ul>' +
    '<details class="mh-more" style="margin-top:10px"><summary><b>Terms used on this page</b></summary><div class="mh-moreb"><ul>' +
    '<li><b>Cap-weighted (the index)</b>: each stock counts in proportion to its market value, as in the S&amp;P 500 itself.</li>' +
    '<li><b>Equal-weighted</b>: every stock counts the same, whatever its size.</li>' +
    '<li><b>Median stock</b>: line the stocks up by return and take the one in the middle.</li>' +
    '<li><b>Weight</b>: a stock\'s (or sector\'s) share of the index\'s total market value.</li>' +
    '<li><b>Contribution</b>: weight at the start of the year × the stock\'s return, in points of index return.</li>' +
    '<li><b>Out</b>: the name left the index; it is carried at its last close.</li></ul></div></details></div>';
}
function bottomLine() {
  var f = facts(), b = f.b, nb = f.now[f.now.length - 1];
  return '<div class="mh-bl"><ol>' +
    '<li>1998-99: the index rose ' + pc(b[3].cap, 0) + ' and ' + pc(b[4].cap, 0) + '. The median stock: ' + pc(b[3].med, 0) + ' and ' + pc(b[4].med, 0) + '.</li>' +
    '<li>2000: the index fell ' + dn(b[5].cap) + '. The average stock rose ' + pc(b[5].ew, 0) + '. The leaders fell first.</li>' +
    '<li>1995-99 winners vs laggards, 2000-05 (median): ' + pc(f.q5med, 0) + ' vs ' + pc(f.q1med, 0) + '.</li>' +
    '<li>' + f.top10Spx + ' of the 10 largest of Dec 1999 are still in the S&amp;P 500. They lost ' + dn(f.top10Med) + ' (median).</li>' +
    '<li>2023-25 shows the same narrow breadth. Top 10 = ' + n1(nb.top10w, 0) + '% of the index vs ' + n1(D.conc[K0].top10, 0) + '% in 1999.</li></ol></div>';
}
function findingsHtml() {
  var f = facts(), b = f.b, o = '', p = f.paths, g = function (sc, i) { return (p[sc][i] / p[sc][0] - 1) * 100; };
  o += finding(1, 'Until 1997 the rally was broad. In 1998-99 a minority carried it.',
    '1995-97: ' + n1(mean([b[0].up, b[1].up, b[2].up]), 0) + '% of names rose each year. 1999: index ' + pc(b[4].cap, 0) + ', median stock ' + pc(b[4].med, 0) + ', only ' + n1(b[4].beat, 0) + '% of names beat the index.',
    '<div class="mh-two"><div id="mh-f1a"></div><div id="mh-f1b"></div></div>',
    'Most of the index\'s gain came from a few large stocks, not from the typical stock. That is what a narrow market means.');
  o += finding(2, 'The break started with the leaders. In 2000 the average stock rose.',
    '2000: index ' + pc(b[5].cap, 0) + ', average stock ' + pc(b[5].ew, 0) + '. Utilities ' + pc(g('Utilities', 1), 0) + ', Health Care ' + pc(g('Health Care', 1), 0) + ', Technology ' + pc(g('Technology', 1), 0) + '. Dec 1999 to Dec 2002: Technology ' + pc(g('Technology', 3), 0) + ', Utilities ' + pc(g('Utilities', 3), 0) + '.',
    '<div id="mh-f2"></div>' + igTable(),
    'The biggest winners started falling first. The average stock was still rising, so most investors did not feel it yet.');
  o += finding(3, 'The 1995-99 winners trailed the laggards for six years. The loss is in tech and communications.',
    'Dec 1999 = 100, Dec 2005: winners ' + n1(f.q[5][6], 0) + ', laggards ' + n1(f.q[1][6], 0) + '. Median 2000-05: tech/comm winners ' + pc(f.q5tcMed, 0) + ', other winners ' + pc(f.q5otMed, 0) + '.',
    '<div id="mh-f3"></div>' + quintileTable() + spreadsHtml(),
    'Buying the stars of the last five years at the top meant waiting years just to get even. A good company can be a poor investment at the wrong price.');
  var c0 = D.fate[0].t;
  o += finding(4, 'Leaders survive as companies and lose as stocks.',
    f.top10Spx + ' of the 10 largest of Dec 1999 are still in the S&amp;P 500; median 2000-05 ' + pc(f.top10Med, 0) + '. Of the 500 of Dec 1994: ' + c0.SPX[0] + ' remain, ' + c0.ACQ[0] + ' acquired, ' + c0.BK[0] + ' bankrupt.',
    '<div class="mh-two"><div>' + top10Table() + '</div><div id="mh-f5"></div></div>',
    'Most of the big names are still around. Their shares, bought at the peak, were the problem, not their survival.');
  var s0 = D.sectors[0].d, s5 = D.sectors[K0].d, s10 = D.sectors[10].d, tcw = function (s) { return s.Technology.w + s.Communications.w; };
  o += finding(5, 'Where the index\'s weight sat, and where it went.',
    'Tech + Comm: ' + n1(tcw(s0), 0) + '% → ' + n1(tcw(s5), 0) + '% → ' + n1(tcw(s10), 0) + '% (Dec 1994, 1999, 2004). Financials: ' + n1(s0.Financials.w, 0) + '% → ' + n1(s5.Financials.w, 0) + '% → ' + n1(s10.Financials.w, 0) + '%.',
    '<div id="mh-wc"></div>',
    'Weight is a sector\'s share of the index. Tech and communications grew to be a quarter of it, then lost that share as their stocks fell and other sectors took it.');
  var nb = f.now[f.now.length - 1];
  o += finding(6, 'Today shows the same narrow breadth.',
    'Index vs equal-weighted: 1998 ' + pc(b[3].cap, 0) + ' / ' + pc(b[3].ew, 0) + ', 1999 ' + pc(b[4].cap, 0) + ' / ' + pc(b[4].ew, 0) + '; ' + f.now.slice(3, 6).map(function (x) { return x.label + ' ' + pc(x.cap, 0) + ' / ' + pc(x.ew, 0); }).join(', ') + '. Top 10: ' + n1(nb.top10w, 0) + '% of the index vs ' + n1(D.conc[K0].top10, 0) + '%. A condition, not a timing signal.',
    '<div class="mh-two"><div id="mh-f7a"></div><div id="mh-f7b"></div></div>' + eraTable(),
    'Today a few stocks again explain most of the index\'s return. That is a condition worth watching, not a sign of when it turns.');
  return o;
}
function igTable() {
  var f = facts(), rows = f.igRows.slice(0, 14), mx = 80;
  return '<div class="mh-ch" style="margin-top:14px">Industry groups, Dec-1999 members <span class="mh-mu">cap-weighted, members still in the index each year</span></div><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Industry group</th><th>Sector</th><th class="r">Weight Dec 1999</th><th class="r">2000</th><th class="r">2001-02</th><th class="r">2003-05</th><th class="r">Dec 1999 → Dec 2005</th></tr></thead><tbody>' +
    rows.map(function (r) { return '<tr><td><b>' + esc(r.g) + '</b></td><td><i class="mh-dot" style="background:' + SEC_COL[r.sector] + '"></i>' + r.sector + '</td><td class="r">' + n1(r.w) + '%</td><td class="r ' + cls(r.r00) + '">' + pc(r.r00, 0) + '</td><td class="r ' + cls(r.r0102) + '">' + pc(r.r0102, 0) + '</td><td class="r ' + cls(r.r0305) + '">' + pc(r.r0305, 0) + '</td><td class="r ' + cls(r.tot) + '"><b>' + pc(r.tot, 0) + '</b></td></tr>'; }).join('') + '</tbody></table></div>';
}
function quintileTable() {
  var rows = cohortRows('All').filter(function (r) { return r.q; });
  return '<div class="mh-ch" style="margin-top:14px">The five groups, ranked at the Dec-1999 close <span class="mh-mu">medians; detail by name in the explorer below</span></div><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Group</th><th class="r">Names</th><th class="r">% of index</th><th class="r">1995-99</th><th class="r">2000-02</th><th class="r">2003-05</th><th class="r">2000-05</th><th class="r">Still in S&amp;P 500 today</th></tr></thead><tbody>' +
    rows.map(function (r) { return '<tr><td><i class="mh-dot" style="background:' + Q_COL[r.q] + '"></i><b>' + Q_NAME[r.q] + '</b></td><td class="r">' + r.n + '</td><td class="r">' + n1(r.w, 0) + '%</td><td class="r">' + pc(r.c, 0) + '</td><td class="r ' + cls(r.r02) + '">' + pc(r.r02, 0) + '</td><td class="r ' + cls(r.r35) + '">' + pc(r.r35, 0) + '</td><td class="r ' + cls(r.r05) + '"><b>' + pc(r.r05, 0) + '</b></td><td class="r">' + n1(r.fc.SPX / r.n * 100, 0) + '%</td></tr>'; }).join('') + '</tbody></table></div>';
}
function spreadsHtml() {
  var sp = facts().spreads;
  return '<div class="mh-ch" style="margin-top:14px">Did last year\'s winners keep winning? <span class="mh-mu">median return next year, prior-year top fifth minus bottom fifth, in points</span></div><div class="mh-scroll"><table class="mh-tbl"><thead><tr>' + sp.map(function (x) { return '<th class="r">' + x.lbl + '</th>'; }).join('') + '</tr></thead><tbody><tr>' +
    sp.map(function (x) { var d = x.hi - x.lo; return '<td class="r ' + cls(d) + '"><b>' + (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(0) + '</b></td>'; }).join('') + '</tr></tbody></table></div><div class="mh-note">Positive = winners kept winning.</div</div>';
}
function top10Table() {
  var f = facts();
  return '<div class="mh-ch">The ten largest at ' + snapLbl(K0) + '</div><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Name</th><th class="r">Weight</th><th class="r">2000-05</th><th>Today</th></tr></thead><tbody>' +
    f.top10.map(function (s) { return '<tr><td>' + nameCell(s) + '</td><td class="r">' + n1(s.w[K0], 2) + '%</td><td class="r ' + cls(s.r05) + '">' + pc(s.r05, 0) + '</td><td>' + badge(s.st) + '</td></tr>'; }).join('') + '</tbody></table></div>';
}
function eraTable() {
  var f = facts(), rows = [];
  f.b.forEach(function (x, k) { if (D.years[k] >= 1996) rows.push([String(D.years[k]), x, D.years[k] === 1998 || D.years[k] === 1999 ? 'hl' : '', D.conc[k].top10 / 1]); });
  var hist = rows.slice(), now = f.now.map(function (x) { return [x.label, x, /202[345]|YTD/.test(x.label) ? 'hl' : '', x.top10w]; });
  var tr = function (r) { var x = r[1]; return '<tr class="' + r[2] + '"><td><b>' + r[0] + '</b></td><td class="r">' + pc(x.cap, 1) + '</td><td class="r">' + pc(x.ew, 1) + '</td><td class="r ' + cls(x.med) + '">' + pc(x.med, 1) + '</td><td class="r">' + n1(x.up, 0) + '%</td><td class="r">' + n1(x.beat, 0) + '%</td><td class="r">' + n1(x.sd, 0) + '</td><td class="r">' + n1(r[3], 1) + '%</td></tr>'; };
  return '<div class="mh-ch" style="margin-top:14px">Same measures, both eras</div><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Year</th><th class="r">Index (cap-weighted)</th><th class="r">Equal-weighted</th><th class="r">Median stock</th><th class="r">% of names up</th><th class="r">% beating the index</th><th class="r">Dispersion (σ)</th><th class="r">Top 10 weight at start</th></tr></thead><tbody>' +
    hist.map(tr).join('') + '<tr><td colspan="8" class="mh-sep">Today: SPY\'s year-end holdings already in the portal (float-adjusted weights), price returns; 2026 to ' + SPX_HOLDINGS.asOf + '</td></tr>' + now.map(tr).join('') + '</tbody></table></div>';
}
function mountFindings() {
  var f = facts(), yl = D.years.map(String);
  var pcf = function (v) { return pc(v, 1); };
  mountLine(document.getElementById('mh-f1a'), { x: yl, ordinal: true, half: true, title: 'Return of the index vs the average and the median stock', unit: '% per year', yFmt: function (v) { return v + '%'; },
    series: [{ key: 'cap', label: 'Index (cap-weighted)', color: '#1E2733', vals: f.b.map(function (x) { return x.cap; }), fmt: pcf }, { key: 'ew', label: 'Equal-weighted', color: '#185FA5', vals: f.b.map(function (x) { return x.ew; }), fmt: pcf }, { key: 'med', label: 'Median stock', color: '#B45309', vals: f.b.map(function (x) { return x.med; }), fmt: pcf }] });
  mountLine(document.getElementById('mh-f1b'), { x: yl, ordinal: true, half: true, title: 'How many names took part', unit: '% of the 500', yMin: 0, yFmt: function (v) { return v + '%'; },
    series: [{ key: 'up', label: 'Names that rose', color: '#177A4E', vals: f.b.map(function (x) { return x.up; }), fmt: function (v) { return n1(v, 0) + '%'; } }, { key: 'beat', label: 'Names that beat the index', color: '#9B2A20', vals: f.b.map(function (x) { return x.beat; }), fmt: function (v) { return n1(v, 0) + '%'; } }] });
  var lb = endLbls(), sec = ['Technology', 'Communications', 'Utilities', 'Health Care', 'Financials', 'Energy', 'Consumer Staples', 'Industrials', 'Consumer Discretionary', 'Materials'];
  mountLine(document.getElementById('mh-f2'), { x: lb, ordinal: true, title: 'Sectors after the peak, Dec 1999 = 100', unit: 'cap-weighted, Dec-1999 members still in the index each year', yFmt: function (v) { return v; },
    series: sec.filter(function (sc) { return f.paths[sc]; }).map(function (sc) { return { key: sc, label: sc, color: SEC_COL[sc], vals: f.paths[sc], fmt: function (v) { return n1(v, 0); } }; }) });
  mountLine(document.getElementById('mh-f3'), { x: lb, ordinal: true, title: 'Winners and laggards of 1995-99 after the peak, Dec 1999 = 100', unit: 'cap-weighted, members still in the index each year', yFmt: function (v) { return v; },
    series: [{ key: 'q5tc', label: 'Q5 winners · Technology & Communications', color: '#185FA5', vals: f.q5tc, fmt: function (v) { return n1(v, 0); } }, { key: 'q5ot', label: 'Q5 winners · all other sectors', color: '#1E2733', vals: f.q5ot, fmt: function (v) { return n1(v, 0); } },
      { key: 'all', label: 'All Dec-1999 members', color: '#8A93A0', vals: f.all, fmt: function (v) { return n1(v, 0); }, dash: true }, { key: 'q1', label: 'Q1 laggards', color: '#B45309', vals: f.q[1], fmt: function (v) { return n1(v, 0); } }, { key: 'q1ot', label: 'Q1 laggards · non-tech', color: '#D9A15B', vals: f.q1ot, fmt: function (v) { return n1(v, 0); }, dash: true }] });
  mountStack(document.getElementById('mh-f5'), { cats: D.bases.map(function (b, k) { return snapLbl(k); }), unit: '%', max: 100, title: 'Where the names of each snapshot are today', unitLabel: 'weight at the snapshot', fmt: function (v) { return v.toFixed(1) + '%'; },
    series: D.meta.states.map(function (c) { return { key: c, label: FATE_SHORT[c], color: FATE_COL[c], vals: D.fate.map(function (x) { return x.t[c][1]; }) }; }) });
  mountLine(document.getElementById('mh-f7a'), { x: yl.slice(2), ordinal: true, half: true, title: '1997-2005: index minus equal-weighted return', unit: 'points', yFmt: function (v) { return v; },
    series: [{ key: 'gap', label: 'Cap-weighted − equal-weighted', color: '#185FA5', vals: f.b.slice(2).map(function (x) { return x.cap - x.ew; }), fmt: function (v) { return pp(v, 1); } }] });
  mountLine(document.getElementById('mh-f7b'), { x: f.now.map(function (x) { return x.label; }), ordinal: true, half: true, title: '2020-2026: index minus equal-weighted return', unit: 'points', yFmt: function (v) { return v; },
    series: [{ key: 'gap', label: 'Cap-weighted − equal-weighted', color: '#185FA5', vals: f.now.map(function (x) { return x.cap - x.ew; }), fmt: function (v) { return pp(v, 1); } }], note: 'The vertical scale differs from the left chart: read the values.' });
}

// ─── the take-away ──────────────────────────────────────
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
    '<div class="mh-box" style="margin-top:14px"><div class="mh-ch">Where today differs <span class="mh-mu">analyst view, not tested by this data</span></div><div class="mh-fbody" style="margin:0">In 1999 many leaders were promises of revenue and profit that arrived late or never. Today several leaders report growing revenue and profit (AWS inside Amazon, Meta, Alphabet) and a record contracted backlog, so "no business behind the price" does not fit them. The risk is a different one: growth below what the price assumes, or efficiency in using AI (smaller models for routine work) that lowers demand for tokens, unless cheaper tokens bring more usage. This page holds no revenue or profit data and cannot test any of it.</div></div>';
}
function backdrop() {
  var mo = D.macro.months, M = D.macro.m, Q = D.macro.q, qx = D.macro.quarters;
  var at = function (a, m) { return a[mo.indexOf(m)]; };
  var pk = function (a, lo, hi) { var b = -1; for (var i = lo; i <= hi; i++) if (a[i] != null && (b < 0 || a[i] > a[b])) b = i; return b; };
  var mEnd = mo.indexOf('2003-12'), qEnd = qx.indexOf('2003Q4');
  var qp = pk(Q.itInv, 0, qEnd), mp = pk(M.margin, 0, mEnd), sp = pk(M.sp, 0, mEnd);
  var qLow = (function () { var b = qp; for (var i = qp; i <= qEnd; i++) if (Q.itInv[i] < Q.itInv[b]) b = i; return b; })();
  var up = (function () { var b = -1; for (var i = 0; i <= mEnd; i++) if (M.unrate[i] != null && (b < 0 || M.unrate[i] < M.unrate[b])) b = i; return b; })();
  var rows = [
    ['Fed funds rate (monthly average)', n1(at(M.ffr, '1999-06'), 2) + '% (Jun 1999) → ' + n1(at(M.ffr, '2000-05'), 2) + '% (May 2000)', 'Rates rose into the market peak.'],
    ['10-year Treasury yield', n1(at(M.y10, '1998-10'), 2) + '% (Oct 1998) → ' + n1(at(M.y10, '2000-01'), 2) + '% (Jan 2000)', 'Long rates rose into the peak.'],
    ['WTI crude oil', '$' + n1(at(M.wti, '1998-12'), 0) + ' (Dec 1998) → $' + n1(at(M.wti, '2000-03'), 0) + ' (Mar 2000)', 'A cost shock during the last leg up.'],
    ['Investment in IT equipment & software', 'peak ' + qx[qp] + ' at $' + n1(Q.itInv[qp], 0) + 'B, low ' + qx[qLow] + ' at $' + n1(Q.itInv[qLow], 0) + 'B (annualised, to 2003)', 'Peak-to-low ' + pc((Q.itInv[qLow] / Q.itInv[qp] - 1) * 100, 0) + '.'],
    ['Semiconductor producer prices', n1(at(M.semiPpi, '2000-03'), 0) + ' (Mar 2000) → ' + n1(at(M.semiPpi, '2002-12'), 0) + ' (Dec 2002)', 'Chip prices kept falling after the peak.'],
    ['Margin debt (FINRA)', 'peak ' + mo[mp] + ' at $' + n1(M.margin[mp], 0) + 'B (from 1997 to 2003)', 'Compare with the index peak in the charts above.'],
    ['Unemployment rate', 'low of ' + n1(M.unrate[up], 1) + '% (' + mo[up] + ')', 'A tight labour market at the top.'],
    ['Federal budget', n1(D.macro.a.fiscal['2000'], 1) + '% of GDP surplus (FY2000)', 'A surplus year.']
  ];
  return '<div class="mh-scroll"><table class="mh-tbl"><tbody>' + rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="mh-note">FRED, FINRA. Context only.</div>';
}

// ─── page ──────────────────────────────────────────────────
function det(id, title, sub, body, open) { return '<details class="mh-more" id="mh-d-' + id + '"' + (open ? ' open' : '') + '><summary><b>' + title + '</b><span class="mh-mu"> ' + sub + '</span></summary><div class="mh-moreb" id="mh-c-' + id + '">' + body + '</div></details>'; }
function sec(title, sub, body) { return '<div class="sec"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn">' + (sub || '') + '</span></div>' + body + '</div>'; }

function render() {
  root.innerHTML =
    '<div class="mh-intro"><div class="mh-h1">Market History · 1995-2005</div><div class="mh-mu">S&amp;P 500 members, weights and price returns, followed to today · Bloomberg, FRED, FINRA · docs/MARKET_HISTORY.md</div></div>' +
    howTo() + bottomLine() + sec('Follow the names', 'the best and worst of any year, and the years around it', '<div id="mh-fn"></div>') + sec('The story', '', findingsHtml()) +
    sec('Take away', '', takeaway()) +
    sec('Backdrop', '', backdrop()) +
    sec('Explore the data', '', det('macro', 'Macro, commodities and policy charts', 'public series, monthly', '<div id="mh-macroc"></div>') +
      det('conc', 'Concentration table', '11 year-end snapshots, plus today', concHtml()) + det('coh', 'Cohort explorer', 'by sector, name by name', '<div id="mh-cohort"></div>') +
      det('year', 'Year by year', 'who moved the index', '<div id="mh-year"></div>') + det('rot', 'Rotation', 'who stayed, left, entered', '<div id="mh-rot"></div>') + det('fate', 'What became of them', 'terminal state, snapshot by snapshot', '<div id="mh-fatec"></div>'));
  mountFindings(); renderFN(); renderWC(); mountConc(); renderCohort(); renderYear(); renderRot(); renderFate(); renderMacro();
}
function renderCohort() { document.getElementById('mh-cohort').innerHTML = cohortHtml(); mountRoll(); }
function renderYear() { document.getElementById('mh-year').innerHTML = yearHtml(); }
function renderRot() { document.getElementById('mh-rot').innerHTML = rotHtml(); mountSecW(); }
function renderFate() { document.getElementById('mh-fatec').innerHTML = fateHtml(); mountFate(); }
function renderMacro() { document.getElementById('mh-macroc').innerHTML = macroHtml(); mountMacro(); }

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
    else if (a === 'fnn') { st.fn.n = +v; renderFN(); }
    else if (a === 'fnb') { st.fn.by = v; renderFN(); }
    else if (a === 'fnv') { st.fn.view = v; renderFN(); }
    else if (a === 'wcp') { var q = v.split('-'); st.wc = [+q[0], +q[1]]; renderWC(); }
    else if (a === 'year') { st.year = +v; renderYear(); }
    else if (a === 'yview') { st.yview = v; renderYear(); }
    else if (a === 'rot') { st.rot = +v; renderRot(); }
    else if (a === 'fmode') { st.fmode = v; renderFate(); }
    else if (a === 'fsnap') { st.fsnap = +v; renderFate(); }
    else if (a === 'mgroup') { st.mgroup = v; renderMacro(); }
    else if (a === 'openq') { st.openQ = st.openQ === +v ? null : +v; renderCohort(); }
  });
  root.addEventListener('input', function (e) {
    if (e.target.id !== 'mh-fny') return;
    st.fn.y = +e.target.value;
    document.querySelectorAll('#mh-fny-b .sb-tbtn').forEach(function (b) { b.classList.toggle('active', +b.getAttribute('data-v') === st.fn.y); });
    renderFNBody();
  });
  root.addEventListener('change', function (e) {
    if (e.target.id === 'mh-fnsec') { st.fn.sec = e.target.value; renderFN(); }
    else if (e.target.id === 'mh-sec') { st.sector = e.target.value; st.openQ = null; renderCohort(); }
    else if (e.target.id === 'mh-wcf' || e.target.id === 'mh-wct') {
      var f = +document.getElementById('mh-wcf').value, t = +document.getElementById('mh-wct').value;
      if (e.target.id === 'mh-wcf' && f >= t) t = f + 1; if (e.target.id === 'mh-wct' && t <= f) f = t - 1;
      st.wc = [f, t]; renderWC();
    }
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
