// eps-charts.js — SVG charts of Market Analysis > EPS Attribution (js/eps-attribution.js).
//   triBars()    total contribution, EPS part and multiple part of a return, three bars per row
//   scatter()    every stock: EPS change vs multiple change, sized by weight
//   lineChart()  a few series over the snapshots
//   waterfall()  contributors to a total, largest first, "rest of index" closing the bar (Citadel style)
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

// rows: [{ label, a, b, net, bold, tip }] — a = EPS part, b = multiple part, net = their sum (the price part), fractions.
// Each row = three bars on one shared axis: the total (thick, green up / red down), then EPS and multiple (thin).
// o.domain = [lo, hi] fixes the axis (fractions) so bars keep their length when a toggle changes.
export function triBars(box, rows, o) {
  var rowH = 50, maxLab = 0; rows.forEach(function (r) { maxLab = Math.max(maxLab, String(r.label).length); });
  var VW = 900, P = { t: 28, r: 74, b: 26, l: Math.max(150, Math.round(maxLab * 6.3) + 22) };
  var lo = 0, hi = 0; rows.forEach(function (r) { lo = Math.min(lo, r.a, r.b, r.net); hi = Math.max(hi, r.a, r.b, r.net); });
  if (o.domain) { lo = Math.min(lo, o.domain[0]); hi = Math.max(hi, o.domain[1]); }
  var A = axis(lo * 100, hi * 100, 7), VH = P.t + rows.length * rowH + P.b;
  function X(v) { return P.l + (v * 100 - A.lo) / (A.hi - A.lo) * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t / 100), x2: X(t / 100), y1: P.t - 8, y2: VH - P.b, stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: X(t / 100), y: VH - P.b + 15, 'text-anchor': 'middle', 'font-size': 10, fill: MUTED }, (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + (o.unit === '%' ? '%' : '')));
  });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 10, fill: MUTED, 'font-weight': 600 }, o.axisTitle || 'pp of index return'));
  function bar(g, v, y, h, color, bold) {
    var x0 = X(Math.min(0, v)), x1 = X(Math.max(0, v));
    g.appendChild(se('rect', { x: x0, y: y, width: Math.max(1.5, x1 - x0), height: h, rx: 2, fill: color }));
    g.appendChild(txt({ x: v >= 0 ? x1 + 6 : x0 - 6, y: y + h / 2 + 3.5, 'text-anchor': v >= 0 ? 'start' : 'end', 'font-size': bold ? 11.5 : 10.5, 'font-weight': bold ? 700 : 500, fill: bold ? color : MUTED, 'font-variant-numeric': 'tabular-nums' }, ppTxt(v, o.unit === '%' ? 1 : (bold ? 2 : 1)) + (o.unit === '%' ? '%' : ' pp')));
  }
  rows.forEach(function (r, i) {
    var y = P.t + i * rowH + 4, g = se('g', {});
    if (i > 0) g.appendChild(se('line', { x1: 8, x2: VW - 8, y1: y - 4, y2: y - 4, stroke: '#EEF1F4' }));
    g.appendChild(txt({ x: P.l - 12, y: y + 20, 'text-anchor': 'end', 'font-size': 12, 'font-weight': r.bold ? 700 : 600 }, r.label));
    bar(g, r.net, y, 14, r.net >= 0 ? o.pos : o.neg, true);
    bar(g, r.a, y + 17, 9, o.colA, false);
    bar(g, r.b, y + 28, 9, o.colB, false);
    g.appendChild(se('rect', { x: 0, y: y - 3, width: VW, height: rowH - 2, fill: 'transparent' }));
    if (r.tip) bindTip(g, r.tip, 280);
    svg.appendChild(g);
  });
  mount(box, svg, '<span><i style="background:' + o.pos + '"></i>' + (o.totLabel || 'Total contribution') + ' <span style="opacity:.7">(green up · red down)</span></span>' + legendItem(o.colA, o.labA || 'from EPS growth') + legendItem(o.colB, o.labB || 'from multiple change'));
}

// groups: [{ label, bars: [{ v, color, tip }] }] — vertical bars on one fixed axis (o.domain = [lo, hi], fractions), values in %.
export function groupBars(box, groups, o) {
  var VW = 460, VH = 290, P = { t: 22, r: 10, b: 38, l: 46 };
  var lo = 0, hi = 0; groups.forEach(function (g) { g.bars.forEach(function (b) { lo = Math.min(lo, b.v); hi = Math.max(hi, b.v); }); });
  if (o.domain) { lo = Math.min(lo, o.domain[0]); hi = Math.max(hi, o.domain[1]); }
  var A = axis(lo * 100, hi * 100, 6);
  function Y(v) { return P.t + (A.hi - v * 100) / (A.hi - A.lo) * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(t / 100), y2: Y(t / 100), stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: P.l - 7, y: Y(t / 100) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: MUTED }, (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + '%'));
  });
  var slot = (VW - P.l - P.r) / groups.length, n = groups[0].bars.length, bw = Math.min(30, slot * 0.76 / n);
  groups.forEach(function (g, i) {
    var cx = P.l + slot * (i + 0.5);
    g.bars.forEach(function (b, j) {
      var x = cx - bw * n / 2 + j * bw, y0 = Y(0), y1 = Y(b.v), el = se('g', {});
      el.appendChild(se('rect', { x: x + 1, y: Math.min(y0, y1), width: bw - 2, height: Math.max(1.5, Math.abs(y1 - y0)), rx: 2, fill: b.color }));
      el.appendChild(txt({ x: x + bw / 2, y: b.v >= 0 ? y1 - 4 : y1 + 12, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 600, fill: INK, 'font-variant-numeric': 'tabular-nums' }, ppTxt(b.v, 1) + '%'));
      el.appendChild(se('rect', { x: x, y: P.t, width: bw, height: VH - P.t - P.b, fill: 'transparent' }));
      if (b.tip) bindTip(el, b.tip, 260);
      svg.appendChild(el);
    });
    svg.appendChild(txt({ x: cx, y: VH - P.b + 17, 'text-anchor': 'middle', 'font-size': 11, fill: INK, 'font-weight': 600 }, g.label));
  });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 11, fill: INK, 'font-weight': 700 }, o.title || ''));
  mount(box, svg, '');
}

// pts: [{ x, y, r, color, label, tip }] — x = EPS change, y = multiple change (fractions), r = weight.
// The dashed curve is the "price flat" line, (1+x)(1+y) = 1. Points beyond the axis are pinned to its edge, hollow.
export function scatter(box, pts, o) {
  var VW = 900, VH = 520, P = { t: 16, r: 18, b: 44, l: 56 };
  function pct(a, q) { a = a.slice().sort(function (x, y) { return x - y; }); return a[Math.max(0, Math.min(a.length - 1, Math.round(q * (a.length - 1))))]; }
  var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
  var Ax = axis(Math.max(-1, Math.min.apply(null, xs.concat(-0.1))) * 100, Math.min(4, Math.max.apply(null, xs.concat(0.1))) * 100, 7), Ay = axis(Math.max(-1, Math.min.apply(null, ys.concat(-0.1))) * 100, Math.min(4, Math.max.apply(null, ys.concat(0.1))) * 100, 6);
  function X(v) { return P.l + (v * 100 - Ax.lo) / (Ax.hi - Ax.lo) * (VW - P.l - P.r); }
  function Y(v) { return P.t + (Ay.hi - v * 100) / (Ay.hi - Ay.lo) * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  function tk(t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + '%'; }
  Ax.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t / 100), x2: X(t / 100), y1: P.t, y2: VH - P.b, stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: X(t / 100), y: VH - P.b + 15, 'text-anchor': 'middle', 'font-size': 10, fill: MUTED }, tk(t)));
  });
  Ay.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(t / 100), y2: Y(t / 100), stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: P.l - 8, y: Y(t / 100) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: MUTED }, tk(t)));
  });
  svg.appendChild(txt({ x: (P.l + VW - P.r) / 2, y: VH - 6, 'text-anchor': 'middle', 'font-size': 11, fill: INK, 'font-weight': 600 }, o.xTitle));
  var cyT = (P.t + VH - P.b) / 2, yt = txt({ x: 14, y: cyT, 'text-anchor': 'middle', 'font-size': 11, fill: INK, 'font-weight': 600 }, o.yTitle);
  yt.setAttribute('transform', 'rotate(-90 14 ' + cyT + ')'); svg.appendChild(yt);
  var d = '', pen = false, x0 = Math.max(-0.97, Ax.lo / 100);
  for (var i = 0; i <= 160; i++) {
    var x = x0 + (Ax.hi / 100 - x0) * i / 160, y = 1 / (1 + x) - 1;
    if (y > Ay.hi / 100 || y < Ay.lo / 100) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); pen = true;
  }
  svg.appendChild(se('path', { d: d, fill: 'none', stroke: '#6B7686', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }));
  svg.appendChild(txt({ x: VW - P.r - 4, y: P.t + 14, 'text-anchor': 'end', 'font-size': 10.5, fill: '#6B7686' }, 'Dashed line = price unchanged · above it the stock is up, below it down'));
  var maxR = Math.max.apply(null, pts.map(function (p) { return p.r; })) || 1;
  pts.slice().sort(function (a, b) { return b.r - a.r; }).forEach(function (p) {
    var cx = Math.max(P.l + 2, Math.min(VW - P.r - 2, X(p.x))), cy = Math.max(P.t + 2, Math.min(VH - P.b - 2, Y(p.y)));
    var pinned = cx !== X(p.x) || cy !== Y(p.y), rad = 3 + 13 * Math.sqrt(p.r / maxR);
    var c = se('circle', { cx: cx, cy: cy, r: rad, fill: pinned ? '#fff' : p.color, 'fill-opacity': pinned ? 1 : 0.62, stroke: p.color, 'stroke-width': pinned ? 1.6 : 1 });
    bindTip(c, p.tip, 260); svg.appendChild(c);
    if (p.label) svg.appendChild(txt({ x: cx + rad + 3, y: cy + 3.5, 'font-size': 10.5, 'font-weight': 600, fill: INK, 'pointer-events': 'none' }, p.label));
  });
  mount(box, svg, o.legend);
}

// series: [{ name, color, vals, dash }] — labels: x categories; yfmt(v) -> axis text
export function lineChart(box, labels, series, yfmt, o) {
  o = o || {};
  var VW = 520, VH = o.h || 260, P = { t: 16, r: 62, b: 30, l: 44 };
  var all = []; series.forEach(function (s) { s.vals.forEach(function (v) { if (v != null) all.push(v); }); });
  var A = axis(Math.min.apply(null, all), Math.max.apply(null, all), 5);
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

// rows: [{ label, v, tip, color }] largest first; closes with a grey "rest" bar when o.rest != null.
// fmt(v) -> text. The bar for row i spans [cum_i-1, cum_i].
export function waterfall(box, rows, o) {
  var rowH = 28, VW = 900, P = { t: 30, r: 90, b: 28, l: 190 };
  var items = rows.slice(); if (o.rest != null) items.push({ label: o.restLabel || 'Rest of index', v: o.rest, rest: true, tip: o.restTip });
  var maxLab = 0; items.forEach(function (r) { maxLab = Math.max(maxLab, String(r.label).length); }); maxLab = Math.max(maxLab, String(o.totalLabel || 'Total').length * 1.1); P.l = Math.max(190, Math.round(maxLab * 6.4) + 24);
  var cum = 0, bars = items.map(function (r) { var a = cum; cum += r.v; return { r: r, a: a, b: cum }; });
  var lo = Math.min.apply(null, bars.map(function (x) { return Math.min(x.a, x.b); }).concat(0)) * 100;
  var hi = Math.max.apply(null, bars.map(function (x) { return Math.max(x.a, x.b); }).concat(0)) * 100;
  if (o.domain) { lo = Math.min(lo, o.domain[0] * 100); hi = Math.max(hi, o.domain[1] * 100); }
  var A = axis(lo, hi, 6), VH = P.t + (bars.length + 1) * rowH + P.b;
  function X(v) { return P.l + (v * 100 - A.lo) / (A.hi - A.lo) * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: X(t / 100), x2: X(t / 100), y1: P.t - 8, y2: VH - P.b, stroke: t === 0 ? '#9AA3AF' : GRID }));
    svg.appendChild(txt({ x: X(t / 100), y: VH - P.b + 15, 'text-anchor': 'middle', 'font-size': 10, fill: MUTED }, (o.axisFmt || function (x) { return x + '%'; })(t)));
  });
  svg.appendChild(txt({ x: P.l, y: 12, 'font-size': 10, fill: MUTED, 'font-weight': 600 }, o.axisTitle || ''));
  var tot = cum;
  var all = bars.concat([{ r: { label: o.totalLabel || 'Total', total: true, v: tot, tip: o.totalTip }, a: 0, b: tot }]);
  all.forEach(function (x, i) {
    var r = x.r, y = P.t + i * rowH + 4, h = rowH - 10, g = se('g', {});
    var col = r.total ? '#1E2733' : r.rest ? '#C9CFD8' : (r.color || (r.v >= 0 ? o.pos : o.neg));
    var x0 = X(Math.min(x.a, x.b)), x1 = X(Math.max(x.a, x.b));
    g.appendChild(txt({ x: P.l - 12, y: y + h / 2 + 4, 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': r.total ? 700 : 500 }, r.label));
    if (i > 0 && !r.total) g.appendChild(se('line', { x1: X(x.a), x2: X(x.a), y1: y - 6, y2: y, stroke: '#9AA3AF', 'stroke-width': 1 }));
    g.appendChild(se('rect', { x: x0, y: y, width: Math.max(1.5, x1 - x0), height: h, rx: 2, fill: col }));
    g.appendChild(txt({ x: x1 + 7, y: y + h / 2 + 4, 'font-size': 11, 'font-weight': 600, 'font-variant-numeric': 'tabular-nums', fill: r.total ? '#1E2733' : INK }, o.fmt(r.v)));
    g.appendChild(se('rect', { x: 0, y: y - 3, width: VW - P.r, height: rowH - 4, fill: 'transparent' }));
    if (r.tip) bindTip(g, r.tip, 270);
    svg.appendChild(g);
  });
  mount(box, svg);
}
