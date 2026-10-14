// spx-securities.js — the S&P 500 side of Top Contributors and Security Return vs Weight,
// in the Nasdaq-100 format (js/ndx-attribution.js renderPareto / renderScatter).
// Data: js/spx-holdings-data.js (scripts/spx/extract_spx_holdings.py) — SPY's holdings and
// weights at each year-end and each name's return over the next year. ONE snapshot per year
// (no intra-year rebalances), so a year is a buy-and-hold of its opening holdings:
//   contribution = opening weight × the year's return; what that does not explain vs SPY
//   (names that joined during the year, delisted names without a price, cash) is the residual.
// So there is no "HOC evolution" slider on this side.
import { se, bindTip } from './ma-charts.js';

var H = null;                // SPX_HOLDINGS
var P = { years: {}, n: 5, custom: 0, side: 'pos', info: 'sector', ret: true };
var S = { year: null, level: 'sec', pick: null, x: 'ret' };
var topRoot = null, scatRoot = null;

function colr(v){ return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function sgn2(v){ if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(2); }
function trunc(s, n){ s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function esc(s){ return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function yearOf(y){ for (var i = 0; i < H.years.length; i++) if (H.years[i].year === y) return H.years[i]; return null; }
function secs(y){
  var Y = yearOf(y); if (!Y) return [];
  var tot = 0; Y.holdings.forEach(function(h){ tot += h.w * (1 + h.r / 100); });
  return Y.holdings.map(function(h){ return { name: h.t, co: h.co, sect: h.s, grp: h.g, ret: h.r, w0: h.w, w1: h.w * (1 + h.r / 100) / tot * 100, contrib: h.w * h.r / 100 }; });
}
function btn(cls, on, onclick, label){ return '<button class="ndx-tab-btn ' + cls + (on ? ' active' : '') + '" onclick="' + onclick + '">' + label + '</button>'; }

// ── Top Contributors ───────────────────────────────────────────────
function renderTop(){
  if (!topRoot) return;
  var years = H.years.map(function(y){ return y.year; }).filter(function(y){ return P.years[y]; });
  var N = P.custom > 0 ? P.custom : P.n, showAll = N === 0, showPos = P.side !== 'neg', showNeg = P.side !== 'pos';
  var yd = {};
  years.forEach(function(y){
    var ranked = secs(y).sort(function(a, b){ return b.contrib - a.contrib; });
    ranked.forEach(function(d, i){ d.rank = i + 1; });
    var n = showAll ? ranked.length : Math.min(N, ranked.length);
    var pos = ranked.slice(0, n), neg = ranked.slice(P.side === 'both' ? Math.max(n, ranked.length - n) : ranked.length - n).reverse();
    [pos, neg].forEach(function(l){ var c = 0; l.forEach(function(d){ c += d.contrib; d.cum = c; }); });
    yd[y] = { n: ranked.length, pos: showPos ? pos : [], neg: showNeg ? neg : [], total: yearOf(y).spy, resid: yearOf(y).residual };
  });
  var SEP = '<div style="width:1px;height:16px;background:var(--rule);flex-shrink:0"></div>';
  var LBL = function(t){ return '<span style="font-size:11px;color:var(--mu)">' + t + '</span>'; };
  var html = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
    '<div style="display:flex;gap:4px">' + H.years.map(function(y){ return btn('', P.years[y.year], 'spxTopYear(' + y.year + ')', y.year); }).join('') + '</div>' + SEP +
    '<div style="display:flex;gap:4px">' + [5, 10, 20, 0].map(function(nv){ return btn('', P.custom === 0 && P.n === nv, 'spxTopN(' + nv + ')', nv === 0 ? 'All' : 'Top ' + nv); }).join('') + '</div>' +
    '<input type="number" min="1" max="600" placeholder="Custom" value="' + (P.custom > 0 ? P.custom : '') + '" style="width:70px;font-size:11px;padding:3px 6px;border:1px solid var(--rule);border-radius:4px;background:var(--surface);color:var(--navy)" onchange="spxTopCustom(+this.value)">' + SEP +
    LBL('Show') + '<div style="display:flex;gap:4px">' + [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']].map(function(o){ return btn('', P.side === o[0], 'spxTopSide(\'' + o[0] + '\')', o[1]); }).join('') + '</div>' + SEP +
    LBL('Column') + '<div style="display:flex;gap:4px">' + [['', 'None'], ['sector', 'Sector'], ['ig', 'Industry Group']].map(function(o){ return btn('', P.info === o[0], 'spxTopInfo(\'' + o[0] + '\')', o[1]); }).join('') + '</div>' +
    btn('', P.ret, 'spxTopRet()', 'Ret%') + '</div>';

  var info = P.info, showRet = P.ret, cpy = 4 + (info ? 1 : 0) + (showRet ? 1 : 0);
  var TH = 'padding:4px 8px;color:var(--mu);font-weight:500;white-space:nowrap', GAP = 'border-left:12px solid transparent';
  var thead = '<thead><tr>' + years.map(function(y, i){ return '<th colspan="' + cpy + '" style="text-align:left;padding:4px 8px 2px;color:var(--navy);font-weight:700;border-bottom:1px solid var(--rule);' + (i ? GAP : '') + '">' + y + '</th>'; }).join('') +
    '</tr><tr style="border-bottom:1.5px solid var(--rule)">' + years.map(function(y, i){
      return '<th style="text-align:right;' + TH + ';' + (i ? GAP : '') + '" title="Rank by contribution among all ' + yd[y].n + ' holdings of the year">Rank</th><th style="text-align:left;' + TH + '">Ticker</th>' +
        (info ? '<th style="text-align:left;' + TH + '">' + (info === 'ig' ? 'Industry Group' : 'Sector') + '</th>' : '') +
        '<th style="text-align:right;' + TH + '">Contrib</th><th style="text-align:right;' + TH + '">Cum.</th>' + (showRet ? '<th style="text-align:right;' + TH + '">Ret%</th>' : '');
    }).join('') + '</tr></thead>';
  function cells(d, i){
    var first = i ? GAP + ';' : '';
    if (!d) return '<td style="' + first + 'padding:4px 8px"></td>' + new Array(cpy).join('<td></td>');
    var cat = info === 'ig' ? d.grp : d.sect, NUM = 'text-align:right;padding:4px 8px;font-variant-numeric:tabular-nums';
    return '<td style="' + first + NUM + ';color:var(--mu);font-size:11px">' + d.rank + '</td>' +
      '<td style="padding:4px 8px;white-space:nowrap" title="' + esc(d.co) + '"><b style="font-size:12px;color:var(--navy)">' + d.name + '</b></td>' +
      (info ? '<td style="padding:4px 8px;font-size:11px;color:var(--mu);white-space:nowrap" title="' + esc(cat) + '">' + trunc(cat, info === 'ig' ? 30 : 22) + '</td>' : '') +
      '<td style="' + NUM + ';font-weight:600;color:' + colr(d.contrib) + '">' + sgn2(d.contrib) + '%</td>' +
      '<td style="' + NUM + ';color:var(--mu);font-size:11px">' + sgn2(d.cum) + '%</td>' +
      (showRet ? '<td style="' + NUM + ';font-size:11px;color:' + colr(d.ret) + '">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(1) + '%</td>' : '');
  }
  function block(key, title){
    var rows = Math.max.apply(null, years.map(function(y){ return yd[y][key].length; }).concat(0));
    if (!rows) return '';
    var out = '<tr><td colspan="' + (cpy * years.length) + '" style="padding:8px 8px 3px;font-size:10.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:' + (key === 'pos' ? 'var(--pos)' : 'var(--neg)') + '">' + title + '</td></tr>';
    for (var r = 0; r < rows; r++){
      out += '<tr style="border-bottom:.5px solid var(--rule);' + (r % 2 ? 'background:var(--surface)' : '') + '">';
      years.forEach(function(y, i){ out += cells(yd[y][key][r], i); });
      out += '</tr>';
    }
    return out;
  }
  var tbody = '<tbody>' + (showPos ? block('pos', showAll ? 'All holdings, top to bottom' : 'Top ' + N + ' contributors') : '') +
    (showNeg && !(showAll && showPos) ? block('neg', showAll ? 'All holdings, bottom to top' : 'Bottom ' + N + ' contributors') : '') + '</tbody>';
  var foot = '<tfoot><tr style="border-top:2px solid var(--navy)">' + years.map(function(y, i){
    var d = yd[y], shown = d.pos.concat(d.neg).reduce(function(s, x){ return s + x.contrib; }, 0), share = Math.abs(d.total) > 1e-9 ? shown / d.total * 100 : 0;
    return '<td colspan="' + cpy + '" style="padding:7px 8px;font-size:11.5px;color:var(--navy);' + (i ? GAP : '') + '">Listed: <b style="color:' + colr(shown) + '">' + sgn2(shown) + '%</b> of <b style="color:' + colr(d.total) + '">' + sgn2(d.total) + '%</b> SPY return <span style="color:var(--mu)">(' + share.toFixed(0) + '%)</span></td>';
  }).join('') + '</tr></tfoot>';
  html += '<div style="overflow-x:auto"><table style="width:auto;border-collapse:collapse;font-size:12px">' + thead + tbody + foot + '</table></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5"><b>Contrib</b> = weight in SPY at the start of the year × the year\'s return (one snapshot per year). <b>Cum.</b> = running total down the list. ' +
    (showRet ? '<b>Ret%</b> = the year\'s price return. ' : '') + '<b>Rank</b> = position among all holdings of that year, 1 = largest contributor.</div>';
  topRoot.innerHTML = html;
}
window.spxTopYear = function(y){ if (P.years[y] && Object.keys(P.years).filter(function(k){ return P.years[k]; }).length === 1) return; P.years[y] = !P.years[y]; renderTop(); };
window.spxTopN = function(n){ P.n = n; P.custom = 0; renderTop(); };
window.spxTopCustom = function(n){ P.custom = n > 0 ? Math.floor(n) : 0; renderTop(); };
window.spxTopSide = function(s){ P.side = s; renderTop(); };
window.spxTopInfo = function(i){ P.info = i; renderTop(); };
window.spxTopRet = function(){ P.ret = !P.ret; renderTop(); };

// ── Security Return vs Weight ──────────────────────────────────────
function list(){
  var w = {}; secs(S.year).forEach(function(d){ var k = S.level === 'ig' ? d.grp : d.sect; w[k] = (w[k] || 0) + d.w1; });
  return Object.keys(w).sort(function(a, b){ return w[b] - w[a]; });
}
function xv(d){ return S.x === 'contrib' ? d.contrib : d.ret; }
function renderScatter(){
  if (!scatRoot) return;
  var L = list(); if (L.indexOf(S.pick) < 0) S.pick = L[0];
  var all = secs(S.year), dots = all.filter(function(d){ return (S.level === 'ig' ? d.grp : d.sect) === S.pick; });
  // axes fixed for the year (every holding), so switching sector or group does not move them
  var xs = all.map(xv), lo = Math.min.apply(null, xs.concat(0)), hi = Math.max.apply(null, xs.concat(0)), pad = (hi - lo) * 0.05 || 1;
  var xLo = lo - pad, xHi = hi + pad, yHi = Math.max.apply(null, all.map(function(d){ return d.w1; })) * 1.08;
  var head = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">' +
    '<div style="display:flex;gap:4px;flex-wrap:wrap">' + H.years.map(function(y){ return btn('', y.year === S.year, 'spxScatYear(' + y.year + ')', y.year); }).join('') + '</div>' +
    '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;flex-basis:100%">' +
      '<span class="sb-toggle" style="margin-left:0"><button class="sb-tbtn' + (S.x === 'ret' ? ' active' : '') + '" onclick="spxScatX(\'ret\')">Return</button><button class="sb-tbtn' + (S.x === 'contrib' ? ' active' : '') + '" onclick="spxScatX(\'contrib\')">Contribution</button></span>' +
      '<span class="sb-toggle" style="margin-left:0"><button class="sb-tbtn' + (S.level === 'sec' ? ' active' : '') + '" onclick="spxScatLevel(\'sec\')">Sector</button><button class="sb-tbtn' + (S.level === 'ig' ? ' active' : '') + '" onclick="spxScatLevel(\'ig\')">Industry Group</button></span>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;flex-basis:100%;margin-top:6px">' + L.map(function(x){ return '<button class="ndx-tab-btn' + (x === S.pick ? ' active' : '') + '" style="font-size:11px;padding:3px 9px" onclick="spxScatPick(\'' + x.replace(/'/g, "\\'") + '\')">' + x + '</button>'; }).join('') + '</div>' +
    '</div></div>';
  var VW = 900, VH = 480, M = { t: 40, r: 30, b: 50, l: 60 }, cw = VW - M.l - M.r, ch = VH - M.t - M.b;
  function X(v){ return M.l + (v - xLo) / (xHi - xLo) * cw; }
  function Y(v){ return M.t + ch - v / yHi * ch; }
  function nice(range, target){ var raw = range / target, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag; }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  var xs_ = nice(xHi - xLo, 8);
  for (var v = Math.ceil(xLo / xs_) * xs_; v <= xHi; v += xs_){
    svg.appendChild(se('line', { x1: X(v), x2: X(v), y1: M.t, y2: VH - M.b, stroke: '#E5E8EC' }));
    var t = se('text', { x: X(v), y: VH - M.b + 14, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' }); t.textContent = (v > 0 ? '+' : '') + (+v.toFixed(2)) + '%'; svg.appendChild(t);
  }
  if (xLo < 0 && xHi > 0) svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: M.t, y2: VH - M.b, stroke: '#C0C8D0', 'stroke-width': 1.5 }));
  var ys = nice(yHi, 6);
  for (var u = 0; u <= yHi; u += ys){
    svg.appendChild(se('line', { x1: M.l, x2: VW - M.r, y1: Y(u), y2: Y(u), stroke: '#E5E8EC' }));
    var tt = se('text', { x: M.l - 6, y: Y(u) + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' }); tt.textContent = (+u.toFixed(2)) + '%'; svg.appendChild(tt);
  }
  var xl = se('text', { x: M.l + cw / 2, y: VH - 8, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0' });
  xl.textContent = S.x === 'contrib' ? 'Contribution to SPY\'s return (pp)' : 'Security return (%)'; svg.appendChild(xl);
  var yl = se('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0', transform: 'translate(12,' + (M.t + ch / 2) + ') rotate(-90)' });
  yl.textContent = 'Closing weight (%)'; svg.appendChild(yl);
  var top = dots.slice().sort(function(a, b){ return Math.abs(b.contrib) - Math.abs(a.contrib); }).slice(0, 10).map(function(d){ return d.name; });
  dots.slice().sort(function(a, b){ return Math.abs(a.contrib) - Math.abs(b.contrib); }).forEach(function(d){
    // the Nasdaq-100 scatter's bubble scale (absolute, not relative to the largest dot), so the
    // two indices' bubbles are comparable
    var r = Math.max(3, Math.min(14, Math.sqrt(Math.abs(d.contrib)) * 4)), col = d.ret >= 0 ? '#177A4E' : '#9B2A20';
    var c = se('circle', { cx: X(xv(d)), cy: Y(d.w1), r: r, fill: col, 'fill-opacity': .55, stroke: col, 'stroke-width': 1.2 });
    bindTip(c, '<b>' + d.name + '</b> · ' + esc(d.co) + '<br>Return: ' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%<br>Weight: ' + d.w0.toFixed(2) + '% → ' + d.w1.toFixed(2) + '%<br>Contribution: ' + sgn2(d.contrib) + ' pp');
    svg.appendChild(c);
    if (top.indexOf(d.name) >= 0){ var lb = se('text', { x: X(xv(d)) + r + 3, y: Y(d.w1) + 4, 'font-family': 'Inter,sans-serif', 'font-size': 11, 'font-weight': 700, fill: '#1E2733' }); lb.textContent = d.name; svg.appendChild(lb); }
  });
  scatRoot.innerHTML = head; var box = document.createElement('div'); box.appendChild(svg); scatRoot.appendChild(box);
  var note = document.createElement('div'); note.style.cssText = 'font-size:11px;color:var(--mu);margin-top:6px';
  note.textContent = 'One dot per company: return or contribution (across) vs weight in SPY at the end of the year (up); bubble size = contribution. Same axes for every sector or group within a year. ' +
    'Return = the whole year, for the companies in SPY at the start of it (one snapshot per year). A company in both indices can show a different return in the Nasdaq-100 view, which counts only the time it has been in that index (e.g. one that joined the Nasdaq-100 during the year).';
  scatRoot.appendChild(note);
}
window.spxScatYear = function(y){ S.year = y; renderScatter(); };
window.spxScatX = function(x){ S.x = x; renderScatter(); };
window.spxScatLevel = function(l){ S.level = l; S.pick = null; renderScatter(); };
window.spxScatPick = function(p){ S.pick = p; renderScatter(); };

// top / scat: the S&P panes of the two sections · data: SPX_HOLDINGS
export function initSpxSecurities(top, scat, data){
  H = data; topRoot = top; scatRoot = scat;
  if (!H || !H.years || !H.years.length) return false;
  var last = H.years[H.years.length - 1].year;
  P.years = {}; P.years[last] = true; S.year = last;
  renderTop(); renderScatter();
  return true;
}
