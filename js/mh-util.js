// mh-util.js — what the Market History page modules share: the data, number formats, the line chart, the tooltip,
// and the per-year numbers (breadth, price helpers). Pages: market-history.js (the story), mh-attrib.js (sector table, year drill-down).
import { MHIST as D } from './market-history-data.js';

export { D };
export var SEC_COL = { 'Technology': '#185FA5', 'Communications': '#0F6E56', 'Health Care': '#D85A30', 'Financials': '#7F77DD',
  'Consumer Discretionary': '#BA7517', 'Consumer Staples': '#3B6D11', 'Industrials': '#5A6E83', 'Energy': '#C0392B',
  'Materials': '#0B9D7A', 'Utilities': '#7C3AED', 'Real Estate': '#993556' };
export var FATE_COL = { SPX: '#177A4E', LIVE: '#3E5A82', ACQ: '#9AA3AF', BK: '#9B2A20', OTH: '#C79A2B' };
export var FATE_TXT = { SPX: 'In the S&amp;P 500 today', LIVE: 'Listed, not in the S&amp;P 500', ACQ: 'Acquired / merged', BK: 'Bankrupt', OTH: 'Delisted' };
export var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export var K0 = D.bases.indexOf('1999-12-31');            // the cohort snapshot
export var NK = D.bases.length;

// Page state (the Index Analysis sections keep their own in mh-ia.js). fn = follow-the-names list; sc = scatter dates [start, split, end]; scm = scatter highlight; wc = weight dates
export var st = { fn: { y: 1999, side: 'top', n: 10 }, sc: { d: [0, K0, 8] }, scm: { side: 'both', n: 20 }, wc: [K0 - 1, K0] };

// ─── helpers ───────────────────────────────────────────────
export function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
export function n1(v, d) { return v == null ? '—' : v.toFixed(d == null ? 1 : d); }
export function pc(v, d) { if (v == null) return '—'; d = d == null ? 1 : d; if (Math.abs(v) < Math.pow(10, -d) / 2) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%'; }
export function pp(v, d) { if (v == null) return '—'; d = d == null ? 2 : d; if (Math.abs(v) < Math.pow(10, -d) / 2) v = 0; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + ' pp'; }
export function sg(v, d) { if (v == null) return '—'; d = d == null ? 1 : d; if (Math.abs(v) < Math.pow(10, -d) / 2) v = 0; return (v < 0 ? '−' : '') + Math.abs(v).toFixed(d); }   // signed number with a proper minus
export function nf(v, d) { return v == null ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d }); }
export function cls(v) { return v == null ? '' : v >= 0 ? 'mh-pos' : 'mh-neg'; }
export function dn(v) { return n1(Math.abs(v), 0) + '%'; }
export function mean(a) { a = a.filter(function (x) { return x != null; }); return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
export function med(a) { a = a.filter(function (x) { return x != null; }).sort(function (x, y) { return x - y; }); if (!a.length) return null; var m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
export function snapLbl(k) { if (k >= D.bases.length) return 'Dec ' + D.years[D.years.length - 1]; var d = D.bases[k]; return MON[+d.slice(5, 7) - 1] + ' ' + d.slice(0, 4); }
export function ymLbl(ym) { return MON[+ym.slice(5, 7) - 1] + ' ' + ym.slice(0, 4); }
export function secBtn(act, opts, cur) {
  return '<span class="sb-toggle mh-seg">' + opts.map(function (o) {
    return '<button class="sb-tbtn' + (String(o[0]) === String(cur) ? ' active' : '') + '" data-act="' + act + '" data-v="' + esc(o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span>';
}
export function nameCell(s) {
  var t = (s.bn ? 'Bloomberg name: ' + s.bn : '') + (s.t ? (s.bn ? ' · ' : '') + s.t : '') + (s.x ? ' · delisted ' + s.x : '');
  return '<span title="' + esc(t) + '">' + esc(s.n) + '</span>' + (s.t ? ' <span class="mh-mu">' + esc(s.t) + '</span>' : '');
}
// colour of a return / contribution cell: green up, red down, deeper with size (scale = the value that gives full colour)
export function heat(v, scale) {
  if (v == null) return '';
  var a = Math.min(.5, .06 + Math.abs(v) / scale * .44);
  return 'background:' + (v >= 0 ? 'rgba(23,122,78,' + a + ')' : 'rgba(155,42,32,' + a + ')');
}
var tip = null;
export function showTip(html, e) {
  if (!tip) { tip = document.createElement('div'); tip.id = 'mh-tip'; document.body.appendChild(tip); }
  tip.innerHTML = html; tip.style.opacity = 1;
  var w = tip.offsetWidth, x = e.clientX + 14; if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
  tip.style.left = x + 'px'; tip.style.top = (e.clientY + 14) + 'px';
}
export function hideTip() { if (tip) tip.style.opacity = 0; }

// ─── numbers per year ──────────────────────────────────────
// items: [{ w, r }] — w any positive weight, r % return of the window
export function breadth(items) {
  var tw = items.reduce(function (a, x) { return a + x.w; }, 0), r = items.map(function (x) { return x.r; });
  var cap = items.reduce(function (a, x) { return a + x.w * x.r; }, 0) / tw;
  var ws = items.map(function (x) { return x.w / tw * 100; }).sort(function (a, b) { return b - a; }), cum = 0, n50 = 0;
  ws.forEach(function (w) { if (cum < 50) { cum += w; n50++; } });
  return { n: items.length, cap: cap, ew: mean(r), med: med(r), up: r.filter(function (v) { return v > 0; }).length / r.length * 100, beat: r.filter(function (v) { return v > cap; }).length / r.length * 100,
    top10w: ws.slice(0, 10).reduce(function (a, b) { return a + b; }, 0), n50: n50 };
}
export function histBreadth(k) { return breadth(D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }).map(function (s) { return { w: s.w[k], r: s.r[k] }; })); }
var B = null;
export function breadths() { return B || (B = D.years.map(function (y, k) { return histBreadth(k); })); }
export function px(s, i) { var v = s.p[i]; return v != null ? v : (s.pe ? s.pe[i] : null); }   // member price, else the Bloomberg price outside membership (before joining / after leaving)
export function lvl(s, i) { for (var j = i; j >= 0; j--) { var v = px(s, j); if (v != null) return v; } return null; }   // price at snapshot i; a name that stopped trading stays at its last close
export function exitYear(s) { return s.x ? +s.x.slice(0, 4) : null; }
export var Mo = D.macro.months, MM = D.macro.m;
export function macroAt(key, ym) { var i = Mo.indexOf(ym); return i < 0 ? null : MM[key][i]; }
var FATE_SHORT = { SPX: 'In S&amp;P 500', LIVE: 'Listed', ACQ: 'Acquired', BK: 'Bankrupt', OTH: 'Delisted' };
export function fate(s) {
  var y = exitYear(s);
  return '<span class="mh-badge" style="background:' + FATE_COL[s.st] + '" title="' + FATE_TXT[s.st].replace(/&amp;/g, '&') + (y ? ', ' + y : '') + '">' + FATE_SHORT[s.st] + '</span>' + (y ? ' <span class="' + (y > 2005 ? 'mh-mu' : '') + '">' + y + '</span>' : '');
}

// ─── generic line chart ─────────────────────────────────────
// cfg: { x:[labels], series:[{key,label,color,vals,fmt,dash}], unit, title, bands:[{i0,i1,color,op}], events:[{i,label}],
//        compact, yMin, ordinal, note } — legend chips hide a series (and its table column); drag = zoom, dblclick = reset.
var chartSeq = 0;
export function mountLine(box, cfg) {
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
      g += '<rect x="' + X(a) + '" y="' + P.t + '" width="' + (X(z) - X(a)) + '" height="' + plotH + '" fill="' + (b.color || '#9B2A20') + '" opacity="' + (b.op || .06) + '"/>';
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
