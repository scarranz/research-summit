// ma-price.js — Market Analysis ▸ Index Price Return, both indices at once.
//   Nasdaq-100 · QQQ — from QQQ's holdings at each rebalance (HOC), js/ndx-attribution.js
//   S&P 500 · SPY    — SPY's month-end prices, js/spx-data.js (etf.levels.SPY)
// Price return (no dividends). One control — the year the $100 is invested — drives the
// tiles, the growth lines and the table; the bars have their own index and Return /
// Cumulative toggles (two series of bars side by side would be noise).
import { se, bindTip } from './ma-charts.js';

var COL = { ndx: '#1F5FAD', spx: '#C0392B' };
var NAME = { ndx: 'Nasdaq-100 · QQQ', spx: 'S&P 500 · SPY' };
var root = null, S = null;
var st = { start: null, bars: 'spx', mode: 'ret' };

function pct(v, d){ if (v == null) return '—'; if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(d == null ? 2 : d) + '%'; }
function money(v){ return '$' + (v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v.toFixed(2)); }
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtD(d){ var x = new Date(d + 'T12:00:00Z'); return MON[x.getUTCMonth()] + ' ' + x.getUTCDate() + ', ' + x.getUTCFullYear(); }
function t(d){ return Date.parse(d + 'T00:00:00Z'); }

// Both series as { years: { 2020: ret, … }, path: [{ d, v }] (value of $1 since the first year) }
function build(ndx, spx){
  var out = { ndx: { years: {}, path: [] }, spx: { years: {}, path: [] }, years: [], ytd: null, asOf: {} };
  ndx.years.forEach(function(y){ out.ndx.years[y.year] = y.ret; if (y.ytd) out.ytd = y.year; });
  out.ndx.path = ndx.points; out.asOf.ndx = ndx.asOf;
  var first = ndx.years[0].year;
  var L = spx.etf.levels, ds = L.dates, v = L.series.SPY;
  var i0 = -1; ds.forEach(function(d, i){ if (+d.slice(0, 4) === first - 1) i0 = i; });
  for (var i = i0; i < ds.length; i++) out.spx.path.push({ d: ds[i], v: v[i] / v[i0] * 100 });
  Object.keys(spx.etf.annual.SPY).forEach(function(y){ if (+y >= first) out.spx.years[+y] = spx.etf.annual.SPY[y]; });
  out.asOf.spx = ds[ds.length - 1];
  out.years = Object.keys(out.ndx.years).map(Number).filter(function(y){ return out.spx.years[y] != null; }).sort();
  return out;
}
// Value of $100 invested at the start of `y`, along the path
function from(k, y){
  // base = the last point before the year (the year-end close of y-1)
  var p = S[k].path, out = [], j0 = 0;
  p.forEach(function(pt, j){ if (+pt.d.slice(0, 4) < y) j0 = j; });
  var base = p[j0].v;
  for (var j = j0; j < p.length; j++) out.push({ d: p[j].d, v: p[j].v / base * 100 });
  return out;
}

function tiles(){
  return '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px">' + ['spx', 'ndx'].map(function(k){
    var p = from(k, st.start), end = p[p.length - 1], tot = end.v - 100;
    return '<div class="sc" style="padding:12px 15px;min-width:240px;border-left:3px solid ' + COL[k] + '"><div class="sl">' + NAME[k] + ' · $100 on ' + fmtD(p[0].d) + '</div>' +
      '<div class="sv" style="font-size:22px;color:' + (tot >= 0 ? 'var(--pos)' : 'var(--neg)') + '">' + money(end.v) + '</div>' +
      '<div class="ss">' + pct(tot, 1) + ' to ' + fmtD(end.d) + '</div></div>';
  }).join('') + '</div>';
}

function growth(box){
  var ser = { ndx: from('ndx', st.start), spx: from('spx', st.start) };
  var all = ser.ndx.concat(ser.spx), x0 = t(ser.ndx[0].d), x1 = Math.max(t(ser.ndx[ser.ndx.length - 1].d), t(ser.spx[ser.spx.length - 1].d));
  var lo = Math.min.apply(null, all.map(function(p){ return p.v; }).concat(100)), hi = Math.max.apply(null, all.map(function(p){ return p.v; }).concat(100));
  var pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
  var VW = 760, VH = 300, P = { t: 14, r: 92, b: 26, l: 48 };
  function X(d){ return P.l + (t(d) - x0) / (x1 - x0 || 1) * (VW - P.l - P.r); }
  function Y(v){ return P.t + (hi - v) / (hi - lo) * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  for (var y = st.start; y <= S.ytd; y++){
    var a = X(y + '-01-01'), b = X((y + 1) + '-01-01'); a = Math.max(a, P.l); b = Math.min(b, VW - P.r);
    if (y % 2 === 0) svg.appendChild(se('rect', { x: a, y: P.t, width: Math.max(0, b - a), height: VH - P.t - P.b, fill: '#F4F6F9' }));
    var yl = se('text', { x: (a + b) / 2, y: VH - 8, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' }); yl.textContent = y; svg.appendChild(yl);
  }
  var step = (hi - lo) > 200 ? 50 : (hi - lo) > 80 ? 20 : (hi - lo) > 30 ? 10 : 5;
  for (var g = Math.ceil(lo / step) * step; g <= hi; g += step){
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(g), y2: Y(g), stroke: g === 100 ? '#9AAAB8' : '#E5E8EC', 'stroke-dasharray': g === 100 ? '4 3' : '' }));
    var gl = se('text', { x: P.l - 6, y: Y(g) + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' }); gl.textContent = '$' + g; svg.appendChild(gl);
  }
  ['ndx', 'spx'].forEach(function(k){   // S&P drawn last = on top
    var p = ser[k];
    svg.appendChild(se('path', { d: p.map(function(pt, i){ return (i ? 'L' : 'M') + X(pt.d).toFixed(1) + ' ' + Y(pt.v).toFixed(1); }).join(''), fill: 'none', stroke: COL[k], 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));
    var e = p[p.length - 1];
    svg.appendChild(se('circle', { cx: X(e.d), cy: Y(e.v), r: 3.5, fill: COL[k] }));
    var el = se('text', { x: X(e.d) + 7, y: Y(e.v) + 4, 'font-family': 'Inter,sans-serif', 'font-size': 11, 'font-weight': '700', fill: COL[k] }); el.textContent = money(e.v); svg.appendChild(el);
    p.forEach(function(pt){
      var c = se('circle', { cx: X(pt.d), cy: Y(pt.v), r: 6, fill: 'transparent' });
      bindTip(c, '<b style="color:' + COL[k] + '">' + NAME[k] + '</b><br>' + fmtD(pt.d) + ': ' + money(pt.v));
      svg.appendChild(c);
    });
  });
  box.innerHTML = '<div style="display:flex;gap:14px;font-size:11px;margin-bottom:4px">' + ['spx', 'ndx'].map(function(k){
    return '<span><span style="display:inline-block;width:16px;height:3px;background:' + COL[k] + ';vertical-align:middle;margin-right:5px"></span>' + NAME[k] + '</span>'; }).join('') + '</div>';
  box.appendChild(svg);
}

function bars(box){
  var k = st.bars, yrs = S.years, vals = {}, acc = 1;
  yrs.forEach(function(y){
    if (st.mode === 'ret') vals[y] = S[k].years[y];
    else if (y >= st.start){ acc *= 1 + S[k].years[y] / 100; vals[y] = (acc - 1) * 100; }
  });
  var vs = yrs.map(function(y){ return vals[y]; }).filter(function(v){ return v != null; });
  var lo = Math.min.apply(null, vs.concat(0)), hi = Math.max.apply(null, vs.concat(0)), span = hi - lo || 1;
  var VW = 420, VH = 280, P = { t: 22, r: 10, b: 40, l: 10 }, slot = (VW - P.l - P.r) / yrs.length, bw = slot * 0.62;
  function Y(v){ return P.t + (hi - v) / span * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(0), y2: Y(0), stroke: '#9AAAB8' }));
  yrs.forEach(function(y, i){
    var x = P.l + i * slot + (slot - bw) / 2, v = vals[y];
    var lb = se('text', { x: x + bw / 2, y: VH - 8, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: y === st.start ? '#1E2733' : '#8A93A0', 'font-weight': y === st.start ? '700' : '400' });
    lb.textContent = y; svg.appendChild(lb);
    if (v == null) return;
    var col = v >= 0 ? '#177A4E' : '#9B2A20';
    svg.appendChild(se('rect', { x: x, y: Math.min(Y(v), Y(0)), width: bw, height: Math.max(1, Math.abs(Y(v) - Y(0))), rx: 3, fill: col, opacity: y >= st.start ? '.85' : '.3' }));
    var vl = se('text', { x: x + bw / 2, y: v >= 0 ? Y(v) - 5 : Y(v) + 13, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: col, 'font-weight': '600' });
    vl.textContent = pct(v, 1); svg.appendChild(vl);
    var hit = se('rect', { x: P.l + i * slot, y: P.t, width: slot, height: VH - P.t - P.b, fill: 'transparent', style: 'cursor:pointer' });
    hit.addEventListener('click', function(){ st.start = y; render(); });
    bindTip(hit, '<b>' + y + (y === S.ytd ? ' (YTD)' : '') + '</b> · ' + NAME[k] + '<br>' + (st.mode === 'ret' ? 'Return ' : 'Cumulative since ' + st.start + ': ') + pct(v) + '<br><span style="color:#8A93A0">click to invest $100 from here</span>');
    svg.appendChild(hit);
  });
  box.innerHTML = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">' +
    seg('maPriceBars', [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']], st.bars) + seg('maPriceMode', [['ret', 'Return'], ['cum', 'Cumulative']], st.mode) + '</div>';
  box.appendChild(svg);
}
function seg(fn, opts, cur){
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function(o){
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" onclick="' + fn + '(\'' + o[0] + '\')">' + o[1] + '</button>'; }).join('') + '</span>';
}

function table(){
  var CELL = 'border:1px solid var(--bdr);padding:6px 10px;text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums';
  var H = CELL + ';background:#EEF1F4;color:var(--navy);font-weight:700;font-size:12px';
  var L = CELL + ';background:#EEF1F4;color:var(--mu);font-weight:600;font-size:11px;text-align:left';
  var h = '<table style="border-collapse:collapse;width:100%;font-size:12px"><tr><th style="' + L + '"></th>' +
    S.years.map(function(y){ return '<th style="' + H + '">' + y + '</th>'; }).join('') + '</tr>';
  ['spx', 'ndx'].forEach(function(k){
    h += '<tr><td style="' + L + '"><span style="display:inline-block;width:10px;height:3px;background:' + COL[k] + ';vertical-align:middle;margin-right:6px"></span>' + NAME[k] + ' return</td>' +
      S.years.map(function(y){ var v = S[k].years[y]; return '<td style="' + CELL + ';color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:700">' + pct(v) + '</td>'; }).join('') + '</tr>';
  });
  ['spx', 'ndx'].forEach(function(k){
    h += '<tr><td style="' + L + '">$100 at the start of the year → today · ' + (k === 'ndx' ? 'QQQ' : 'SPY') + '</td>' +
      S.years.map(function(y){ var p = from(k, y); return '<td style="' + CELL + ';color:var(--text)">' + money(p[p.length - 1].v) + '</td>'; }).join('') + '</tr>';
  });
  return h + '</table>';
}

function render(){
  if (!root || !S) return;
  root.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
      '<span style="font-size:12px;color:var(--navy);font-weight:600">Invest $100 at the start of</span>' +
      S.years.map(function(y){ return '<button class="ndx-tab-btn' + (y === st.start ? ' active' : '') + '" onclick="maPriceStart(' + y + ')">' + y + '</button>'; }).join('') +
    '</div>' + tiles() +
    '<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start">' +
      '<div style="flex:2 1 520px;min-width:300px" id="ma-price-growth"></div>' +
      '<div style="flex:1 1 300px;min-width:260px" id="ma-price-bars"></div>' +
    '</div>' +
    '<div style="margin-top:14px;overflow-x:auto">' + table() + '</div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px">Price return, dividends not included.</div>';
  growth(document.getElementById('ma-price-growth'));
  bars(document.getElementById('ma-price-bars'));
}
window.maPriceStart = function(y){ st.start = y; render(); };
window.maPriceBars = function(k){ st.bars = k; bars(document.getElementById('ma-price-bars')); };
window.maPriceMode = function(m){ st.mode = m; bars(document.getElementById('ma-price-bars')); };

// host: the section card · ndx: ndxPriceData() · spx: SPX_DATA (needs etf.levels.SPY)
export function initPriceReturn(host, ndx, spx){
  root = host;
  if (!root || !ndx || !spx || !spx.etf) return;
  S = build(ndx, spx);
  st.start = S.ytd;                        // $100 at the start of the current year by default
  var a = document.getElementById('ma-price-asof');
  if (a) a.textContent = 'Prices through ' + fmtD(S.asOf.ndx < S.asOf.spx ? S.asOf.ndx : S.asOf.spx);
  render();
}
