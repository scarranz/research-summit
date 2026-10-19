// eps-charts.js — SVG charts of Market Analysis > EPS Attribution (js/eps-attribution.js).
//   stepBars()   EPS vs multiple, stacked and diverging, one group per period, total marked
//   lineChart()  a few series over the five snapshots, filtered series dashed
//   waterfall()  contributors to a total, largest first, "rest of index" closing the bar (Citadel style)
// Tooltips use the page's #ndx-tip (index.html) through ma-charts.js.
import { se, bindTip } from './ma-charts.js';

var INK = '#2B3B4E', MUTED = '#8A93A0', GRID = '#E5E8EC';
function txt(attrs, s) { var t = se('text', Object.assign({ 'font-family': 'Inter,sans-serif', fill: INK }, attrs)); t.textContent = s; return t; }
export function ppTxt(v, d) { if (v == null || isNaN(v)) return '—'; var x = v * 100; if (Math.abs(x) < 0.05 * Math.pow(10, 1 - (d == null ? 1 : d))) x = 0; return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d == null ? 1 : d); }
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

// groups: [{ label, eps, mult, tot, dim, tip }] — values are fractions (0.12 = 12 pp)
export function stepBars(box, groups, colors) {
  var VW = 900, VH = 300, P = { t: 18, r: 14, b: 44, l: 44 };
  var vals = []; groups.forEach(function (g) { vals.push(g.eps, g.mult, g.eps + g.mult, g.tot); });
  var lo = Math.min.apply(null, vals.concat(0)) * 100, hi = Math.max.apply(null, vals.concat(0)) * 100;
  var A = axis(lo, hi, 6);
  function Y(v) { return P.t + (A.hi - v * 100) / (A.hi - A.lo) * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  A.ticks.forEach(function (t) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(t / 100), y2: Y(t / 100), stroke: t === 0 ? '#9AA3AF' : GRID, 'stroke-width': t === 0 ? 1.2 : 1 }));
    svg.appendChild(txt({ x: P.l - 8, y: Y(t / 100) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: MUTED }, (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t) + '%'));
  });
  var slot = (VW - P.l - P.r) / groups.length, bw = Math.min(54, slot * 0.34);
  groups.forEach(function (g, i) {
    var cx = P.l + slot * (i + 0.5), gEl = se('g', { opacity: g.dim ? 0.42 : 1 });
    // stack away from zero on each side: positives upward, negatives downward
    var posTop = 0, negBot = 0;
    [['eps', colors.eps], ['mult', colors.mult]].forEach(function (s) {
      var v = g[s[0]]; if (!v) return;
      var y0, y1;
      if (v >= 0) { y0 = Y(posTop); posTop += v; y1 = Y(posTop); } else { y0 = Y(negBot); negBot += v; y1 = Y(negBot); }
      gEl.appendChild(se('rect', { x: cx - bw / 2, width: bw, y: Math.min(y0, y1) + 1, height: Math.max(0.5, Math.abs(y1 - y0) - 2), rx: 3, fill: s[1] }));
    });
    gEl.appendChild(se('rect', { x: cx - bw / 2 - 8, y: P.t, width: bw + 16, height: VH - P.t - P.b, fill: 'transparent' }));
    var ty = Y(g.tot);
    gEl.appendChild(se('rect', { x: cx - 6, y: ty - 6, width: 12, height: 12, fill: colors.tot, stroke: '#fff', 'stroke-width': 2, transform: 'rotate(45 ' + cx + ' ' + ty + ')' }));
    gEl.appendChild(txt({ x: cx + bw / 2 + 12, y: ty + 4, 'font-size': 11.5, 'font-weight': 600, fill: colors.tot }, ppTxt(g.tot) + '%'));
    var lines = String(g.label).split('\n');
    lines.forEach(function (l, j) { gEl.appendChild(txt({ x: cx, y: VH - P.b + 18 + j * 13, 'text-anchor': 'middle', 'font-size': j ? 10 : 11, fill: j ? MUTED : INK, 'font-weight': j ? 400 : 600 }, l)); });
    bindTip(gEl, g.tip, 250);
    svg.appendChild(gEl);
  });
  mount(box, svg, legendItem(colors.eps, 'Aggregate EPS revision') + legendItem(colors.mult, 'Multiple (P/E), incl. cross term') +
    '<span><i style="background:' + colors.tot + ';transform:rotate(45deg);border-radius:0"></i>Index price return</span>');
}

// series: [{ name, color, vals, dash, w }] — labels: x categories; yfmt(v) -> axis text
export function lineChart(box, labels, series, yfmt, o) {
  o = o || {};
  var VW = 520, VH = o.h || 260, P = { t: 16, r: 62, b: 30, l: 44 };
  var all = []; series.forEach(function (s) { s.vals.forEach(function (v) { if (v != null) all.push(v); }); });
  var A = axis(Math.min.apply(null, all), Math.max.apply(null, all), 5);
  function Y(v) { return P.t + (A.hi - v) / (A.hi - A.lo) * (VH - P.t - P.b); }
  function X(i) { return P.l + i * (VW - P.l - P.r) / (labels.length - 1); }
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
    if (s.vals[last] != null && s.endLabel !== false) svg.appendChild(txt({ x: X(last) + 8, y: Y(s.vals[last]) + 4, 'font-size': 11, 'font-weight': 600, fill: s.color }, (o.endFmt || yfmt)(s.vals[last])));
  });
  // hover: one column per snapshot
  var tip = o.tip;
  labels.forEach(function (l, i) {
    var r = se('rect', { x: X(i) - 20, y: P.t, width: 40, height: VH - P.t - P.b, fill: 'transparent' });
    var h = '<b style="font-size:13px">' + l + '</b>' + series.map(function (s) { return '<span style="display:block;font-size:12px;color:#52514e">' + s.name + ': <b>' + (s.vals[i] == null ? '—' : (o.endFmt || yfmt)(s.vals[i])) + '</b></span>'; }).join('');
    bindTip(r, tip ? tip(i, h) : h, 260); svg.appendChild(r);
  });
  mount(box, svg, series.length > 1 || o.legend ? series.map(function (s) { return legendItem(s.color, s.name, s.dash); }).join('') : '');
}

// rows: [{ label, sub, v, tip, color }] largest first; closes with a grey "rest" bar when o.rest != null.
// fmt(v) -> text. The bar for row i spans [cum_i-1, cum_i].
export function waterfall(box, rows, o) {
  var rowH = 28, VW = 900, P = { t: 30, r: 90, b: 28, l: 190 };
  var items = rows.slice(); if (o.rest != null) items.push({ label: o.restLabel || 'Rest of index', sub: o.restSub, v: o.rest, rest: true, tip: o.restTip });
  var maxLab = 0; items.forEach(function (r) { maxLab = Math.max(maxLab, String(r.label).length); }); P.l = Math.max(190, Math.round(maxLab * 6.4) + 24);
  var cum = 0, bars = items.map(function (r) { var a = cum; cum += r.v; return { r: r, a: a, b: cum }; });
  var lo = Math.min.apply(null, bars.map(function (x) { return Math.min(x.a, x.b); }).concat(0)) * 100;
  var hi = Math.max.apply(null, bars.map(function (x) { return Math.max(x.a, x.b); }).concat(0)) * 100;
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
