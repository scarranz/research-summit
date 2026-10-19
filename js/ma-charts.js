// ma-charts.js — SVG pieces shared by the S&P 500 and the Nasdaq-100 sides of
// Market Analysis, so one function looks the same whichever index it shows:
//   dumbbell()      Index Composition — open vs close weight by sector
//   distribution()  Winners vs Losers — how many names fell in each return range;
//                   click a bar to list them (hover shows the count only)
// Tooltips use the page's #ndx-tip element (index.html).

var NS = 'http://www.w3.org/2000/svg';
export function se(tag, attrs){
  var el = document.createElementNS(NS, tag);
  Object.keys(attrs || {}).forEach(function(k){ el.setAttribute(k, attrs[k]); });
  return el;
}
export function bindTip(el, html, maxW){
  var tip = document.getElementById('ndx-tip'); if (!tip) return;
  el.addEventListener('mouseenter', function(){ tip.innerHTML = html; tip.style.maxWidth = (maxW || 260) + 'px'; tip.style.opacity = 1; });
  el.addEventListener('mousemove', function(e){
    var w = tip.offsetWidth, x = e.clientX + 14; if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
    tip.style.left = x + 'px'; tip.style.top = (e.clientY + 14) + 'px';
  });
  el.addEventListener('mouseleave', function(){ tip.style.opacity = 0; });
}
function txt(attrs, s){ var t = se('text', Object.assign({ 'font-family': 'Inter,sans-serif' }, attrs)); t.textContent = s; return t; }

// rows: [{ name, w0, w1 }] in display order · hi: axis max (%) · closeLbl: 'Close' | 'Latest'
// period: label of the year shown (tooltips) · note: html under the legend (optional)
// openLbl (optional): names the opening point when it is not the start of one year, e.g. 'Dec 1999'
export function dumbbell(box, rows, hi, closeLbl, period, note, openLbl){
  var VW = 900, rowH = 30, P = { t: 56, r: 190, b: 26, l: 200 };
  var VH = P.t + rows.length * rowH + P.b;
  function X(v){ return P.l + v / hi * (VW - P.l - P.r); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  var step = hi > 30 ? 10 : 5;
  for (var t = 0; t <= hi; t += step){
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 10, y2: VH - P.b, stroke: '#E5E8EC', 'stroke-width': 1 }));
    svg.appendChild(txt({ x: X(t), y: P.t - 18, 'text-anchor': 'middle', 'font-size': 10, fill: '#8A93A0' }, t + '%'));
  }
  svg.appendChild(txt({ x: VW - P.r + 12, y: 12, 'font-size': 10, fill: '#8A93A0', 'font-weight': '600' }, openLbl ? openLbl + ' → ' + closeLbl : 'Weight: open → ' + closeLbl.toLowerCase()));
  svg.appendChild(txt({ x: VW - 6, y: 12, 'text-anchor': 'end', 'font-size': 10, fill: '#8A93A0', 'font-weight': '600' }, 'Change'));
  rows.forEach(function(r, i){
    var y = P.t + i * rowH + rowH / 2, diff = r.w1 - r.w0, col = diff >= 0 ? '#177A4E' : '#9B2A20';
    var g = se('g', {});
    g.appendChild(txt({ x: P.l - 14, y: y + 4, 'text-anchor': 'end', 'font-size': 11.5, fill: '#2B3B4E' }, r.name));
    g.appendChild(se('line', { x1: X(Math.min(r.w0, r.w1)), x2: X(Math.max(r.w0, r.w1)), y1: y, y2: y, stroke: col, 'stroke-width': 3, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }));
    g.appendChild(se('circle', { cx: X(r.w0), cy: y, r: 5.5, fill: '#fff', stroke: col, 'stroke-width': 2 }));
    g.appendChild(se('circle', { cx: X(r.w1), cy: y, r: 5.5, fill: col, stroke: '#fff', 'stroke-width': 2 }));
    g.appendChild(txt({ x: VW - P.r + 12, y: y + 4, 'font-size': 11, fill: '#2B3B4E', 'font-variant-numeric': 'tabular-nums' }, r.w0.toFixed(1) + '% → ' + r.w1.toFixed(1) + '%'));
    g.appendChild(txt({ x: VW - 6, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: col, 'font-weight': '600', 'font-variant-numeric': 'tabular-nums' }, (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' pp'));
    bindTip(g, '<b style="font-size:13px">' + r.name + '</b><span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      (openLbl ? openLbl : 'Start of ' + period) + ': ' + r.w0.toFixed(2) + '%<br>' + closeLbl + ': ' + r.w1.toFixed(2) + '%<br>Change: ' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' pp</span>');
    svg.appendChild(g);
  });
  var leg = document.createElement('div');
  leg.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap';
  leg.innerHTML =
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;border:2px solid #177A4E;box-sizing:border-box;margin-right:5px;vertical-align:-1px"></span>' + (openLbl || 'Open') + ' weight</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#177A4E;margin-right:5px;vertical-align:-1px"></span>' + closeLbl + ' weight</span>' +
    (note ? '<div style="flex-basis:100%;line-height:1.5">' + note + '</div>' : '');
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(leg);
}

// items: [{ name, co, ret }] — names that were in the index the whole period.
// Clicking a bar lists its names (best first) under the chart; clicking it again closes it.
var BINS = [[-1e9, -20], [-20, -10], [-10, -5], [-5, 0], [0, 5], [5, 10], [10, 20], [20, 1e9]];
var LBLS = ['< −20%', '−20 to −10%', '−10 to −5%', '−5 to 0%', '0 to 5%', '5 to 10%', '10 to 20%', '> 20%'];
// opt (optional): { bins: [[lo, hi, label], …] in ascending order, split: how many bins are losses } for returns spread wider than one year of an index (Market History)
export function distribution(box, items, state, opt){
  var bins = opt ? opt.bins.map(function(b){ return [b[0], b[1]]; }) : BINS, lbls = opt ? opt.bins.map(function(b){ return b[2]; }) : LBLS, split = opt ? opt.split : 4;
  var counts = bins.map(function(){ return []; });
  items.forEach(function(d){ for (var i = 0; i < bins.length; i++) if (d.ret >= bins[i][0] && d.ret < bins[i][1]){ counts[i].push(d); break; } });
  var maxN = Math.max.apply(null, counts.map(function(c){ return c.length; })) || 1;
  var VW = 860, VH = 230, P = { t: 20, r: 20, b: 62, l: 44 }, slot = (VW - P.l - P.r) / bins.length, bw = slot - 6;
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  // whole-number ticks (1, 2, 5, 10, 20, 50 … apart), the axis topped at the next tick
  var stp = [1, 2, 5, 10, 20, 25, 50, 100, 200].filter(function(v){ return maxN / v <= 5; })[0] || 500;
  maxN = Math.ceil(maxN / stp) * stp;
  for (var g = 0; g <= maxN; g += stp){
    var yp = VH - P.b - Math.round(g / maxN * (VH - P.t - P.b));
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: yp, y2: yp, stroke: '#EEF1F4' }));
    svg.appendChild(txt({ x: P.l - 6, y: yp + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#8A93A0' }, String(g)));
  }
  counts.forEach(function(c, i){
    var h = Math.round(c.length / maxN * (VH - P.t - P.b)), x = P.l + i * slot + 3, y = VH - P.b - h;
    var sel = state.bin === i;
    svg.appendChild(se('rect', { x: x, y: y, width: bw, height: h, rx: 3, fill: i < split ? '#9B2A20' : '#177A4E', opacity: sel ? '1' : '.72' }));
    if (c.length) svg.appendChild(txt({ x: x + bw / 2, y: y - 5, 'text-anchor': 'middle', 'font-size': 11, fill: '#2B3B4E', 'font-weight': '600' }, String(c.length)));
    var xl = txt({ x: x + bw / 2, y: VH - P.b + 14, 'text-anchor': 'end', 'font-size': 9.5, fill: sel ? '#1E2733' : '#8A93A0' }, lbls[i]);
    xl.setAttribute('transform', 'rotate(-30,' + (x + bw / 2) + ',' + (VH - P.b + 14) + ')'); svg.appendChild(xl);
    var hit = se('rect', { x: x, y: P.t, width: bw, height: VH - P.b - P.t, fill: 'transparent', style: 'cursor:pointer' });
    hit.addEventListener('click', function(){ state.bin = state.bin === i ? null : i; distribution(box, items, state, opt); });
    bindTip(hit, '<b>' + lbls[i] + '</b> · ' + c.length + ' compan' + (c.length === 1 ? 'y' : 'ies') + '<br><span style="color:#8A93A0">click to list them</span>');
    svg.appendChild(hit);
  });
  var up = items.filter(function(d){ return d.ret >= 0; }).length;
  var head = '<div style="font-size:12px;margin-bottom:6px"><b style="color:var(--pos)">' + up + ' up</b> · <b style="color:var(--neg)">' + (items.length - up) + ' down</b> · ' + items.length + ' companies</div>';
  var list = '';
  if (state.bin != null){
    var c = counts[state.bin].slice().sort(function(a, b){ return b.ret - a.ret; });
    list = '<div style="margin-top:10px;border-top:1px solid var(--bdr);padding-top:8px"><div style="font-size:11px;font-weight:700;color:var(--navy);margin-bottom:6px">' + lbls[state.bin] + ' · ' + c.length + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:2px 16px;font-size:11.5px;font-variant-numeric:tabular-nums">' +
      c.map(function(d){ return '<span title="' + (d.co || '') + '"><b style="color:var(--navy)">' + d.name + '</b> <span style="color:var(--mu)">' + (d.co || '').slice(0, 22) + '</span> <span style="color:' + (d.ret >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600;float:right">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(1) + '%</span></span>'; }).join('') +
      '</div></div>';
  }
  box.innerHTML = head; box.appendChild(svg);
  var l = document.createElement('div'); l.innerHTML = list; box.appendChild(l);
}
