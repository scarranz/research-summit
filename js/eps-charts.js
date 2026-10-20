// eps-charts.js — SVG charts of Market Analysis > EPS Attribution (js/eps-attribution.js).
//   divStack()   EPS part + multiple part stacked, diamond = their total
//   barList()    one green/red bar per name, closed by a total row
//   stackBars()  one 100% bar per date: the part that matters against everyone else
//   lineChart()  a few series over the snapshots
// Tooltips use the page's #ndx-tip (index.html) through ma-charts.js.
import { se, bindTip } from './ma-charts.js';

var INK = '#2B3B4E', MUTED = '#8A93A0', GRID = '#E5E8EC';
function txt(attrs, s) { var t = se('text', Object.assign({ 'font-family': 'Inter,sans-serif', fill: INK }, attrs)); t.textContent = s; return t; }
export function ppTxt(v, d) { if (v == null || isNaN(v)) return '—'; var x = v * 100; if (Math.abs(x) < 0.5 * Math.pow(10, -(d == null ? 1 : d))) x = 0; return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d == null ? 1 : d); }
function niceStep(range, n) {
  var raw = range / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}
function axis(lo, hi, n) {
  var st = niceStep(hi - lo || 1, n || 5), a = Math.floor(lo / st) * st, b = Math.ceil(hi / st) * st, t = [];
  for (var v = a; v <= b + st / 1e6; v += st) t.push(Math.round(v / st * 1e6) / 1e6 * st);
  return { lo: a, hi: b, ticks: t };
}
function mount(box, svg, legendHtml) {
  box.innerHTML = ''; box.appendChild(svg);
  if (legendHtml) { var l = document.createElement('div'); l.className = 'eps-leg'; l.innerHTML = legendHtml; box.appendChild(l); }
}
export function legendItem(color, label, dashed) {
  return '<span><i style="background:' + (dashed ? 'repeating-linear-gradient(90deg,' + color + ' 0 3px,transparent 3px 5px)' : color) + (dashed ? ';height:2px;vertical-align:3px' : '') + '"></i>' + label + '</span>';
}

// rows: [{ label, a, b, net, bold, tip }] — a = EPS part, b = multiple part, net = their sum = the price part (fractions).
// Diverging stacked bars on one axis: positives go right, negatives left; the diamond marks the net, its value sits at the right.
// o.domain = [lo, hi] fixes the axis (fractions) so bars keep their length when a toggle changes; o.unit = '%' | 'pp'.
export function divStack(box, rows, o) {
  var rowH = 30, maxLab = 0; rows.forEach(function (r) { maxLab = Math.max(maxLab, String(r.label).length); });
  var VW = 900, P = { t: 30, r: 96, b: 26, l: Math.max(150, Math.round(maxLab * 6.3) + 22) }, u = o.unit === '%' ? '%' : ' pp';
  var lo = 0, hi = 0; rows.forEach(function (r) { lo = Math.min(lo, r.a, r.b, r.a + r.b, r.net); hi = Math.max(hi, r.a, r.b, r.a + r.b, r.net); });
  if (o.domain) { lo = Math.min(lo, o.domain[0]); hi = Math.max(hi, o.domain[1]); }
  var A = axis(lo * 100, hi * 100, 7), VH = P.t + rows.length * rowH + P.b;
  function X(v) { return P.l + (v * 100 - A.lo) / (A.hi - A.lo) * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t / 100), x2: X(t / 100), y1: P.t - 8, y2: VH - P.b, stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: X(t / 100), y: VH - P.b + 15, 'text-anchor': 'middle', 'font-size': 10, fill: MUTED }, (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + (u === '%' ? '%' : '')));
  });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 10, fill: MUTED, 'font-weight': 600 }, o.axisTitle || ''));
  svg.appendChild(txt({ x: VW - 6, y: 12, 'text-anchor': 'end', 'font-size': 10, fill: MUTED, 'font-weight': 600 }, o.netTitle || 'Net'));
  rows.forEach(function (r, i) {
    var y = P.t + i * rowH + 5, h = rowH - 11, g = se('g', {}), pos = 0, neg = 0;
    if (r.gap && i > 0) g.appendChild(se('line', { x1: 8, x2: VW - 8, y1: y - 5, y2: y - 5, stroke: '#DDE2E8' }));
    g.appendChild(txt({ x: P.l - 12, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': r.bold ? 700 : 500 }, r.label));
    [[r.a, o.colA], [r.b, o.colB]].forEach(function (s) {
      var v = s[0]; if (!v) return; var x0, x1;
      if (v >= 0) { x0 = X(pos); pos += v; x1 = X(pos); } else { x1 = X(neg); neg += v; x0 = X(neg); }
      g.appendChild(se('rect', { x: Math.min(x0, x1) + 0.5, y: y, width: Math.max(1, Math.abs(x1 - x0) - 1), height: h, rx: 2, fill: s[1] }));
    });
    var nx = X(r.net), nc = r.net >= 0 ? o.pos : o.neg;
    g.appendChild(se('rect', { x: nx - 5.5, y: y + h / 2 - 5.5, width: 11, height: 11, fill: nc, stroke: '#fff', 'stroke-width': 2, transform: 'rotate(45 ' + nx + ' ' + (y + h / 2) + ')' }));
    g.appendChild(txt({ x: VW - 6, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': 700, fill: nc, 'font-variant-numeric': 'tabular-nums' }, ppTxt(r.net, u === '%' ? 1 : 2) + u));
    g.appendChild(se('rect', { x: 0, y: y - 4, width: VW, height: rowH - 2, fill: 'transparent' }));
    if (r.tip) bindTip(g, r.tip, 290);
    svg.appendChild(g);
  });
  mount(box, svg, legendItem(o.colA, o.labA) + legendItem(o.colB, o.labB) +
    '<span><i style="background:' + o.pos + ';transform:rotate(45deg);border-radius:0"></i>' + (o.diaLabel || 'Total') + ' (green up, red down) = the two bars added</span>');
}

// rows: [{ label, v, tip }] — one bar per row, green up / red down, value at the end; o.total = { label, v } closes the list.
// o.domain = [lo, hi] (fractions) fixes the axis so bars keep their length when a toggle changes.
export function barList(box, rows, o) {
  var rowH = 28, maxLab = 0, all = rows.concat(o.total ? [o.total] : []); all.forEach(function (r) { maxLab = Math.max(maxLab, String(r.label).length); });
  var VW = 900, P = { t: 28, r: 84, b: 26, l: Math.max(150, Math.round(maxLab * 6.3) + 22) };
  var lo = 0, hi = 0; all.forEach(function (r) { lo = Math.min(lo, r.v); hi = Math.max(hi, r.v); });
  if (o.domain) { lo = Math.min(lo, o.domain[0]); hi = Math.max(hi, o.domain[1]); }
  var pct = o.unit === '%', suf = pct ? '%' : ' pp', dec = pct ? 0 : 2;
  var A = axis(lo * 100, hi * 100, 7), VH = P.t + all.length * rowH + P.b + (o.total ? 8 : 0);
  function X(v) { return P.l + (v * 100 - A.lo) / (A.hi - A.lo) * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t / 100), x2: X(t / 100), y1: P.t - 8, y2: VH - P.b, stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: X(t / 100), y: VH - P.b + 15, 'text-anchor': 'middle', 'font-size': 10, fill: MUTED }, (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + (pct ? '%' : '')));
  });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 10, fill: MUTED, 'font-weight': 600 }, o.axisTitle || 'pp'));
  all.forEach(function (r, i) {
    var isTot = o.total && i === all.length - 1, y = P.t + i * rowH + (isTot ? 8 : 0) + 4, h = rowH - 10, g = se('g', {});
    var x0 = X(Math.min(0, r.v)), x1 = X(Math.max(0, r.v)), color = isTot ? '#1E2733' : r.v >= 0 ? o.pos : o.neg;
    if (isTot) g.appendChild(se('line', { x1: 8, x2: VW - 8, y1: y - 6, y2: y - 6, stroke: '#9AA3AF' }));
    g.appendChild(txt({ x: P.l - 12, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': isTot ? 700 : 500 }, r.label));
    g.appendChild(se('rect', { x: x0, y: y, width: Math.max(1.5, x1 - x0), height: h, rx: 2, fill: color }));
    g.appendChild(txt({ x: r.v >= 0 ? x1 + 7 : x0 - 7, y: y + h / 2 + 4, 'text-anchor': r.v >= 0 ? 'start' : 'end', 'font-size': 11, 'font-weight': 700, fill: isTot ? '#1E2733' : color, 'font-variant-numeric': 'tabular-nums' }, ppTxt(r.v, dec) + suf));
    g.appendChild(se('rect', { x: 0, y: y - 3, width: VW, height: rowH - 4, fill: 'transparent' }));
    if (r.tip) bindTip(g, r.tip, 300);
    svg.appendChild(g);
  });
  mount(box, svg, '');
}

// rows: [{ label, v, tip }] — v = share (0..1). One bar per row on a fixed 0–100% axis: the dark part is v, the light part the rest.
// o = { color, rest, restLabel, title }
export function stackBars(box, rows, o) {
  var rowH = 34, VW = 900, P = { t: 26, r: 14, b: 8, l: 70 }, VH = P.t + rows.length * rowH + P.b;
  function X(v) { return P.l + v * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 10.5, fill: MUTED, 'font-weight': 600 }, o.title || ''));
  [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 6, y2: VH - P.b, stroke: GRID }));
    svg.appendChild(txt({ x: X(t), y: P.t - 10, 'text-anchor': t === 0 ? 'start' : t === 1 ? 'end' : 'middle', 'font-size': 9.5, fill: MUTED }, Math.round(t * 100) + '%'));
  });
  rows.forEach(function (r, i) {
    var y = P.t + i * rowH + 3, h = rowH - 10, g = se('g', {}), xm = X(r.v);
    g.appendChild(txt({ x: P.l - 10, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': r.bold ? 700 : 500 }, r.label));
    g.appendChild(se('rect', { x: P.l, y: y, width: xm - P.l, height: h, rx: 2, fill: o.color }));
    g.appendChild(se('rect', { x: xm, y: y, width: X(1) - xm, height: h, rx: 2, fill: o.rest || '#E3E8EE' }));
    g.appendChild(txt({ x: xm - 8, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: '#fff', 'font-variant-numeric': 'tabular-nums' }, (r.v * 100).toFixed(1) + '%'));
    g.appendChild(txt({ x: X(1) - 8, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 10.5, fill: '#6B7686' }, o.restLabel || 'everyone else'));
    g.appendChild(se('rect', { x: 0, y: y - 3, width: VW, height: rowH - 4, fill: 'transparent' }));
    if (r.tip) bindTip(g, r.tip, 290);
    svg.appendChild(g);
  });
  mount(box, svg, '');
}

// series: [{ name, color, vals, dash }] — labels: x categories; yfmt(v) -> axis text
export function lineChart(box, labels, series, yfmt, o) {
  o = o || {};
  var VW = o.vw || 520, VH = o.h || 260, P = { t: 16, r: 62, b: 30, l: 44 };
  var all = []; series.forEach(function (s) { s.vals.forEach(function (v) { if (v != null) all.push(v); }); });
  var A = o.dom ? { lo: o.dom[0], hi: o.dom[1], ticks: o.ticks } : axis(Math.min.apply(null, all), Math.max.apply(null, all), 5);
  function Y(v) { return P.t + (A.hi - v) / (A.hi - A.lo) * (VH - P.t - P.b); }
  function X(i) { return P.l + i * (VW - P.l - P.r) / Math.max(1, labels.length - 1); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(t), y2: Y(t), stroke: GRID }));
    svg.appendChild(txt({ x: P.l - 8, y: Y(t) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: MUTED }, yfmt(t)));
  });
  labels.forEach(function (l, i) { svg.appendChild(txt({ x: X(i), y: VH - 10, 'text-anchor': i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle', 'font-size': 10, fill: MUTED }, l)); });
  series.forEach(function (s) {
    var d = ''; s.vals.forEach(function (v, i) { if (v != null) d += (d ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); });
    svg.appendChild(se('path', { d: d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-dasharray': s.dash ? '5 4' : '', 'stroke-linejoin': 'round' }));
    s.vals.forEach(function (v, i) { if (v != null) svg.appendChild(se('circle', { cx: X(i), cy: Y(v), r: 3.6, fill: s.dash ? '#fff' : s.color, stroke: s.color, 'stroke-width': 1.6 })); });
    var last = s.vals.length - 1;
    if (s.vals[last] != null) svg.appendChild(txt({ x: X(last) + 8, y: Y(s.vals[last]) + 4, 'font-size': 11, 'font-weight': 600, fill: s.color }, (o.endFmt || yfmt)(s.vals[last])));
  });
  labels.forEach(function (l, i) {
    var r = se('rect', { x: X(i) - 20, y: P.t, width: 40, height: VH - P.t - P.b, fill: 'transparent' });
    var h = '<b style="font-size:13px">' + l + '</b>' + series.map(function (s) { return '<span style="display:block;font-size:12px;color:#52514e">' + s.name + ': <b>' + (s.vals[i] == null ? '—' : (o.endFmt || yfmt)(s.vals[i])) + '</b></span>'; }).join('');
    bindTip(r, o.tip ? o.tip(i, h) : h, 260); svg.appendChild(r);
  });
  mount(box, svg, series.length > 1 ? series.map(function (s) { return legendItem(s.color, s.name, s.dash); }).join('') : '');
}

