// ndx-attribution.js — NDX 100 Return Attribution (Carino linking)
import { NDX_DATA } from './ndx-attribution-data.js';

const CASH       = 'Cash, Derivatives and Other Securities';
const CASH_LABEL = 'Cash & Futures';
const NS         = 'http://www.w3.org/2000/svg';

// Green / red ramps — shared by treemap, heatmap, scatter, beeswarm
var POS_RAMP = ['#D6EFE0','#A8D9B6','#5AB882','#27A05A','#177A4E'];
var NEG_RAMP = ['#F9DADA','#F1AFAF','#E34948','#B02E2D','#7A1F1E'];

var sectors     = [];
var igBySec     = {};
var igToSec     = {};
var exclSecs    = new Set();
var exclIGs     = new Set();
var baseR       = null;
var _chart      = null;
var _chartFull  = [];
var attrTab     = 'sector';
var attrMode    = 'chart';
var _snap0      = {};
var _snapN      = {};
var _axisSecMin = 0, _axisSecMax = 0;
var _axisIGMin  = 0, _axisIGMax  = 0;
var _sortKey    = 'contrib';
var _sortDir    = -1;
var _fromHoc    = 12;
var _toHoc      = 25;
var _activeHocs = [];
var _securities = [];
var _beeswarmFilter = 0;
var treemapSubMode = 'flat';
var _scatterHocIdx = -1;
var _beeswarmHocIdx = -1;
var _secSnapshots  = [];
var _expandedSecs  = new Set();
var _scatterXLo = null, _scatterXHi = null, _scatterYHi = null;
var _beeswarmSector = '';
var _activeYear  = 'ytd2026';
var _paretoN     = 10;
var YEAR_HOCS    = { ytd2026: [12, 25], y2025: [1, 11] };
var _colorMode   = 'orig';   // 'orig' | 'A' | 'B' | 'C'
var _colorMaxPos = 0, _colorMaxNeg = 0;
var _rebalTab    = 'A';
var _wlTab       = 'C';

// ── Helpers ────────────────────────────────────────────────────────────────
function getActiveHocs() {
  return NDX_DATA.hocs.filter(function(h) { return h.n >= _fromHoc && h.n <= _toHoc; });
}
function normalize() {
  NDX_DATA.hocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      var bad = function(v) { return !v || !v.trim() || /^[#]?n\/?a(\s|$)/i.test(v.trim()); };
      if (bad(s.s)) s.s = CASH;
      if (bad(s.g)) s.g = CASH;
      if (s.s === CASH) s.g = CASH;
    });
  });
}
function buildHierarchy(init) {
  var secSet = new Set(), igMap = {};
  _activeHocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      secSet.add(s.s);
      igToSec[s.g] = s.s;
      if (!igMap[s.s]) igMap[s.s] = new Set();
      igMap[s.s].add(s.g);
    });
  });
  sectors = Array.from(secSet).sort(function(a, b) {
    if (a === CASH) return 1; if (b === CASH) return -1;
    return (init.bySec[b] || 0) - (init.bySec[a] || 0);
  });
  sectors.forEach(function(s) {
    igBySec[s] = Array.from(igMap[s] || []).sort(function(a, b) {
      if (a === CASH) return 1; if (b === CASH) return -1;
      return (init.byIG[b] || 0) - (init.byIG[a] || 0);
    });
  });
  var first = _activeHocs[0], last = _activeHocs[_activeHocs.length - 1];
  _snap0 = {}; _snapN = {};
  [first, last].forEach(function(hoc, idx) {
    var snap = idx === 0 ? _snap0 : _snapN;
    hoc.sec.forEach(function(s) {
      if (!snap[s.s]) snap[s.s] = { count: 0, w: 0 };
      if (!snap['ig:'+s.g]) snap['ig:'+s.g] = { count: 0, w: 0 };
      snap[s.s].count++; snap[s.s].w += (s.w || 0);
      snap['ig:'+s.g].count++; snap['ig:'+s.g].w += (s.w || 0);
    });
  });
}
function lockAxes(res) {
  function rng(vals) {
    var mn = Math.min.apply(null, vals.concat(0));
    var mx = Math.max.apply(null, vals.concat(0));
    var pad = Math.max(Math.abs(mx - mn) * 0.12, 0.1);
    return { min: mn - pad, max: mx + pad };
  }
  var sr = rng(sectors.map(function(s) { return res.bySec[s] || 0; }));
  _axisSecMin = sr.min; _axisSecMax = sr.max;
  var igVals = [];
  sectors.forEach(function(s) { (igBySec[s]||[]).forEach(function(g) { igVals.push(res.byIG[g]||0); }); });
  var ir = rng(igVals);
  _axisIGMin = ir.min; _axisIGMax = ir.max;
}

// Carino-linked attribution
function computeCore(exS, exG) {
  var hocSecC = [], hocIGC = [], ktArr = [], logSum = 0, hocResults = [];
  _activeHocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) { if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0); });
    var scale = exclW < 99.99 ? 100 / (100 - exclW) : 1;
    var hocRet = 0, count = 0, sc = {}, gc = {};
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var c = (s.w || 0) * scale * s.r;
      sc[s.s] = (sc[s.s] || 0) + c;
      gc[s.g] = (gc[s.g] || 0) + c;
      hocRet += c; count++;
    });
    var rw = hocRet / 100;
    var kt = Math.abs(rw) > 1e-10 ? Math.log(1 + rw) / rw : 1.0;
    logSum += Math.log(1 + rw);
    ktArr.push(kt); hocSecC.push(sc); hocIGC.push(gc);
    hocResults.push({ n: hoc.n, eff: hoc.eff, close: hoc.close, ret: hocRet, count: count });
  });
  var ytd = (Math.exp(logSum) - 1) * 100;
  var R = ytd / 100;
  var k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1.0;
  var allSecs = new Set(), allIGs = new Set();
  hocSecC.forEach(function(m) { Object.keys(m).forEach(function(s) { allSecs.add(s); }); });
  hocIGC.forEach(function(m)  { Object.keys(m).forEach(function(g) { allIGs.add(g); }); });
  var bySec = {}, byIG = {};
  allSecs.forEach(function(s) {
    if (s === CASH) return;
    var sum = 0; hocResults.forEach(function(_, t) { sum += ktArr[t] * (hocSecC[t][s] || 0); });
    bySec[s] = sum / k;
  });
  allIGs.forEach(function(g) {
    if (g === CASH) return;
    var sum = 0; hocResults.forEach(function(_, t) { sum += ktArr[t] * (hocIGC[t][g] || 0); });
    byIG[g] = sum / k;
  });
  bySec[CASH] = ytd - Object.keys(bySec).reduce(function(a, s) { return a + bySec[s]; }, 0);
  byIG[CASH]  = ytd - Object.keys(byIG ).reduce(function(a, g) { return a + byIG[g];  }, 0);
  return { bySec: bySec, byIG: byIG, ytd: ytd, hocResults: hocResults, hocSecC: hocSecC };
}

// Per-security Carino-linked attribution (for scatter + beeswarm)
function computeSecurities(exS, exG, hocList) {
  var hocs = hocList !== undefined ? hocList : _activeHocs;
  var hocMeta = [], logSumTotal = 0;
  hocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) { if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0); });
    var scale = exclW < 99.99 ? 100 / (100 - exclW) : 1;
    var hocRet = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      hocRet += (s.w || 0) * scale * s.r;
    });
    var rw = hocRet / 100;
    var kt = Math.abs(rw) > 1e-10 ? Math.log(1 + rw) / rw : 1.0;
    logSumTotal += Math.log(1 + rw);
    hocMeta.push({ kt: kt, scale: scale, hoc: hoc });
  });
  var ytd = (Math.exp(logSumTotal) - 1) * 100;
  var R = ytd / 100;
  var k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1.0;

  // Build closing-weight lookup from last HOC in this window
  var lastHoc = hocs[hocs.length - 1];
  var closeW = {};
  lastHoc.sec.forEach(function(s) {
    if (exS.has(s.s) || exG.has(s.g)) return;
    closeW[s.t || s.co] = s.w || 0;
  });

  var tickers = {};
  hocMeta.forEach(function(h) {
    var kt = h.kt, scale = h.scale, hoc = h.hoc;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var key = s.t || s.co;
      if (!tickers[key]) tickers[key] = { name: key, co: s.co, sect: s.s, grp: s.g, logSum: 0, cSum: 0, w0: null };
      tickers[key].logSum += Math.log(1 + s.r);
      tickers[key].cSum  += kt * (s.w || 0) * scale * s.r;
      if (tickers[key].w0 === null) tickers[key].w0 = s.w || 0;
    });
  });

  return Object.keys(tickers).map(function(key) {
    var d = tickers[key];
    return {
      name: d.name, co: d.co, sect: d.sect, grp: d.grp,
      ret:    (Math.exp(d.logSum) - 1) * 100,
      w0:     d.w0 || 0,
      w1:     closeW[key] || 0,
      contrib: d.cSum / k
    };
  });
}

function dispSec(s) { return s === CASH ? CASH_LABEL : s; }
function dispIG(g)  { return g === CASH ? CASH_LABEL : g; }
function fmtC(v) {
  if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>';
  return '<span style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' +
    (v >= 0 ? '+' : '') + v.toFixed(4) + '%</span>';
}
function fmtYTD(v) { return v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(4) + '%'; }
function colr(v)   { return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function esc(s)    { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
function trunc(s, n) { return s.length > n ? s.slice(0, n-1) + '…' : s; }
function chartLbl(s, isIG) {
  var d = isIG ? dispIG(s) : dispSec(s);
  return trunc(d, isIG ? 36 : 28);
}

// Contribution-based color from the shared ramps (√ compression)
function contribColor(v, maxAbs, localMax) {
  if (!maxAbs || maxAbs < 1e-9) return '#EDECEA';
  var t;
  if (_colorMode === 'A') {
    var ref = v >= 0 ? (_colorMaxPos || maxAbs) : (_colorMaxNeg || maxAbs);
    t = ref > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / ref)) : 0;
  } else if (_colorMode === 'B') {
    var lm = localMax != null ? localMax : maxAbs;
    t = lm > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / lm)) : 0;
  } else if (_colorMode === 'C') {
    t = Math.min(1, Math.pow(Math.abs(v) / maxAbs, 0.65));
  } else {
    t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
  }
  var idx = Math.min(4, Math.floor(t * 5));
  return v >= 0 ? POS_RAMP[idx] : NEG_RAMP[idx];
}
function contribFg(v, maxAbs, localMax) {
  if (!maxAbs || maxAbs < 1e-9) return '#1E2D3D';
  var t;
  if (_colorMode === 'A') {
    var ref = v >= 0 ? (_colorMaxPos || maxAbs) : (_colorMaxNeg || maxAbs);
    t = ref > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / ref)) : 0;
  } else if (_colorMode === 'B') {
    var lm = localMax != null ? localMax : maxAbs;
    t = lm > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / lm)) : 0;
  } else if (_colorMode === 'C') {
    t = Math.min(1, Math.pow(Math.abs(v) / maxAbs, 0.65));
  } else {
    t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
  }
  return t > 0.52 ? '#FFFFFF' : '#1E2D3D';
}

// SVG element helper
function se(tag, attrs) {
  var e = document.createElementNS(NS, tag);
  Object.keys(attrs).forEach(function(k) { e.setAttribute(k, attrs[k]); });
  return e;
}
// Wrap long name into lines for SVG text
function wrapWords(text, maxW, fontSize) {
  var cw = fontSize * 0.58, maxC = Math.floor(maxW / cw);
  if (text.length <= maxC) return [text];
  var words = text.split(' '), lines = [], cur = '';
  words.forEach(function(w) {
    var test = cur ? cur + ' ' + w : w;
    if (test.length <= maxC) { cur = test; }
    else { if (cur) lines.push(cur); cur = w.length > maxC ? w.slice(0, maxC) : w; }
  });
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
// Tooltip bind
function bindTip(el, html) {
  var tip = document.getElementById('ndx-tip');
  if (!tip) return;
  el.addEventListener('pointerenter', function() { tip.innerHTML = html; tip.style.opacity = '1'; });
  el.addEventListener('pointermove',  function(e) {
    var x = e.clientX + 14, y = e.clientY + 14;
    var r = tip.getBoundingClientRect();
    if (x + r.width  > window.innerWidth  - 8) x = e.clientX - r.width  - 14;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  });
  el.addEventListener('pointerleave', function() { tip.style.opacity = '0'; });
}

// ── KPI tile ──────────────────────────────────────────────────────────────
function renderKPI(res) {
  var el = document.getElementById('ndx-ytd-val');
  if (!el) return;
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  // Always show base return — never distort the price return with simulation weights
  var displayYtd = baseR ? baseR.ytd : res.ytd;
  el.innerHTML = '<span style="color:' + colr(displayYtd) + '">' + fmtYTD(displayYtd) + '</span>';
  var tag = document.getElementById('ndx-sim-badge');
  if (!tag) return;
  if (isBase) { tag.style.display = 'none'; return; }
  var diff = res.ytd - baseR.ytd;
  tag.style.display = 'inline-block';
  tag.innerHTML = 'Simulation active&nbsp;&nbsp;<span style="color:' + colr(diff) + ';font-weight:600">' +
    (diff >= 0 ? '+' : '') + diff.toFixed(4) + '% vs base</span>' +
    '&nbsp;&nbsp;<span class="ndx-reset-link" onclick="ndxResetSim()">reset</span>';
}

// ── Bar chart ─────────────────────────────────────────────────────────────
function renderAttrChart(res) {
  var canvas = document.getElementById('ndx-attr-canvas');
  if (!canvas || typeof Chart === 'undefined') return;
  var isIG = attrTab === 'ig';
  var items = [];
  if (isIG) {
    sectors.forEach(function(s) {
      (igBySec[s]||[]).forEach(function(g) {
        items.push({ label: chartLbl(g, true), full: dispIG(g), val: res.byIG[g]||0, excl: exclSecs.has(s)||exclIGs.has(g) });
      });
    });
  } else {
    sectors.forEach(function(s) {
      items.push({ label: chartLbl(s, false), full: dispSec(s), val: res.bySec[s]||0, excl: exclSecs.has(s) });
    });
  }
  _chartFull = items.map(function(x) { return x.full; });
  var labels = items.map(function(x) { return x.label; });
  var data   = items.map(function(x) { return parseFloat(x.val.toFixed(6)); });
  var bg = items.map(function(x) {
    if (x.excl) return 'rgba(150,150,150,.22)';
    return x.val >= 0 ? 'rgba(23,122,78,.72)' : 'rgba(155,42,32,.72)';
  });
  var bd = items.map(function(x) {
    if (x.excl) return 'rgba(150,150,150,.4)';
    return x.val >= 0 ? '#177A4E' : '#9B2A20';
  });
  var rowH = isIG ? 26 : 30;
  var h = Math.max(340, items.length * rowH + 60);
  var box = document.getElementById('ndx-attr-chart-box');
  if (box) box.style.height = h + 'px';
  var xMin = isIG ? _axisIGMin : _axisSecMin;
  var xMax = isIG ? _axisIGMax : _axisSecMax;
  if (_chart) {
    _chart.data.labels = labels;
    _chart.data.datasets[0].data = data;
    _chart.data.datasets[0].backgroundColor = bg;
    _chart.data.datasets[0].borderColor = bd;
    _chart.options.scales.x.min = xMin;
    _chart.options.scales.x.max = xMax;
    _chart.update('none');
    return;
  }
  _chart = new Chart(canvas, {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: bg, borderColor: bd, borderWidth: 1, borderRadius: 3 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(ctx) { return _chartFull[ctx[0].dataIndex] || ctx[0].label; },
            label: function(ctx) { var v = ctx.raw; return ' ' + (v >= 0 ? '+' : '') + v.toFixed(4) + '%'; }
          }
        }
      },
      scales: {
        x: { min: xMin, max: xMax, grid: { color: 'rgba(0,0,0,.05)' }, border: { display: false },
          ticks: { font: { size: 10, family: 'Inter,sans-serif' }, color: '#8A93A0',
            callback: function(v) { return (v>=0?'+':'')+v.toFixed(1)+'%'; } } },
        y: { grid: { display: false }, border: { display: false },
          ticks: { font: { size: isIG ? 9.5 : 11, family: 'Inter,sans-serif' }, color: '#2B3B4E' } }
      }
    }
  });
}

// ── Squarified treemap algorithm ──────────────────────────────────────────
function squarify(items, x, y, W, H) {
  if (!items.length || W <= 0 || H <= 0) return;
  if (items.length === 1) {
    items[0].rx = x; items[0].ry = y; items[0].rw = W; items[0].rh = H; return;
  }
  var isH = W >= H, fixD = isH ? H : W;
  var split = 1, prevAR = Infinity, rowA = 0;
  for (var i = 0; i < items.length; i++) {
    rowA += items[i].area;
    var sw = rowA / fixD, ar = 0;
    for (var j = 0; j <= i; j++) { var cd = items[j].area / sw; ar = Math.max(ar, Math.max(sw/cd, cd/sw)); }
    if (ar > prevAR && i > 0) break;
    prevAR = ar; split = i + 1;
  }
  var strip = items.slice(0, split), rest = items.slice(split);
  rowA = strip.reduce(function(a, it) { return a + it.area; }, 0);
  var sw2 = rowA / fixD, pos = isH ? y : x;
  for (var k = 0; k < strip.length; k++) {
    var cd2 = strip[k].area / sw2;
    if (isH) { strip[k].rx = x;    strip[k].ry = pos; strip[k].rw = sw2; strip[k].rh = cd2; }
    else      { strip[k].rx = pos;  strip[k].ry = y;   strip[k].rw = cd2; strip[k].rh = sw2; }
    pos += cd2;
  }
  if (rest.length) {
    if (isH) squarify(rest, x + sw2, y, W - sw2, H);
    else     squarify(rest, x, y + sw2, W, H - sw2);
  }
}

// ── Helpers shared by treemap variants ───────────────────────────────────
function treemapTileLabel(svg, rx, ry, rw, rh, label, contribStr, fillC, fgC) {
  if (rw < 50 || rh < 28) return;
  var fs = Math.min(14, Math.max(9, Math.min(rw, rh) / 6));
  var lines = wrapWords(label, rw - 14, fs);
  var lineH = fs * 1.3, totalH = lines.length * lineH;
  var showC = rh > totalH + fs * 2.2;
  var startY = showC
    ? ry + rh / 2 - (totalH + fs * 1.6) / 2 + fs * 0.82
    : ry + rh / 2 - totalH / 2 + fs * 0.82;
  lines.forEach(function(line, li) {
    var t = se('text', { x: rx + rw / 2, y: startY + li * lineH,
      'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
      'font-size': fs, 'font-weight': '700', fill: fgC });
    t.textContent = line; svg.appendChild(t);
  });
  if (showC && contribStr) {
    var cfs = Math.max(8, fs - 2);
    var ct = se('text', { x: rx + rw / 2, y: startY + lines.length * lineH + cfs * 0.9,
      'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
      'font-size': cfs, fill: fgC, opacity: '0.88' });
    ct.textContent = contribStr; svg.appendChild(ct);
  }
}

// ── Sector flat treemap ───────────────────────────────────────────────────
function renderSectorFlatTreemap(res, box, VW, VH) {
  var items = [];
  sectors.forEach(function(s) {
    var w = (_snapN[s]||{w:0}).w;
    if (w < 0.001) return;
    items.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0, excl: exclSecs.has(s) });
  });
  items.sort(function(a, b) {
    if (a.key === CASH) return 1; if (b.key === CASH) return -1; return b.w - a.w;
  });
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 100;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);
  var nonCashItems = items.filter(function(it) { return it.key !== CASH; });
  var maxAbsC = Math.max.apply(null, nonCashItems.map(function(it) { return Math.abs(it.c); })) || 1;
  _colorMaxPos = Math.max.apply(null, nonCashItems.map(function(it) { return it.c > 0 ? it.c : 0; })) || maxAbsC;
  _colorMaxNeg = Math.max.apply(null, nonCashItems.map(function(it) { return it.c < 0 ? Math.abs(it.c) : 0; })) || maxAbsC;

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });
  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:pointer' });
    var fillC  = item.excl ? '#D0D4D8' : contribColor(item.c, maxAbsC, maxAbsC);
    var fgC    = item.excl ? '#6A7888' : contribFg(item.c, maxAbsC, maxAbsC);
    var strokeC = item.excl ? '#9AAAB8' : (item.c >= 0 ? '#177A4E' : '#9B2A20');
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 4,
      fill: fillC, stroke: strokeC, 'stroke-opacity': item.excl ? 0.25 : 0.55,
      'stroke-width': 1, opacity: item.excl ? 0.35 : 1 }));
    treemapTileLabel(g, rx, ry, rw, rh, item.label,
      (item.c >= 0 ? '+' : '') + item.c.toFixed(2) + '%', fillC, fgC);
    var tipC = (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
      '<br><em style="color:#898781">Click to see industry groups</em></span>');
    if (item.key !== CASH) g.setAttribute('onclick', 'ndxShowIGModal(\'' + esc(item.key) + '\')');
    svg.appendChild(g);
  });
  box.appendChild(svg);
}

// ── IG flat treemap ───────────────────────────────────────────────────────
function renderIGFlatTreemap(res, box, VW, VH) {
  var items = [];
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) {
      if (g === CASH) return;
      var w = (_snapN['ig:'+g]||{w:0}).w;
      if (w < 0.001) return;
      items.push({ key: g, sect: s, label: g, w: w, c: res.byIG[g]||0 });
    });
  });
  items.sort(function(a, b) { return b.w - a.w; });
  var totalW = items.reduce(function(acc, x) { return acc + x.w; }, 0) || 100;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);
  var maxAbsC = Math.max.apply(null, items.map(function(it) { return Math.abs(it.c); })) || 1;

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });
  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:pointer' });
    var fillC  = contribColor(item.c, maxAbsC);
    var fgC    = contribFg(item.c, maxAbsC);
    var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 3,
      fill: fillC, stroke: strokeC, 'stroke-opacity': 0.55, 'stroke-width': 1 }));
    treemapTileLabel(g, rx, ry, rw, rh, item.label,
      (item.c >= 0 ? '+' : '') + item.c.toFixed(2) + '%', fillC, fgC);
    var tipC = (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      dispSec(item.sect) + '<br>Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
      '<br><em style="color:#898781">Click to see securities</em></span>');
    g.setAttribute('onclick', 'ndxShowSecuritiesModal(\'' + esc(item.key) + '\')');
    svg.appendChild(g);
  });
  box.appendChild(svg);
}

// ── Nested IG treemap (sectors as containers, IGs as inner tiles) ─────────
function renderNestedIGTreemap(res, box, VW, VH) {
  var secItems = [];
  sectors.forEach(function(s) {
    if (s === CASH) return;
    var w = (_snapN[s]||{w:0}).w;
    if (w < 0.001) return;
    secItems.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0 });
  });
  secItems.sort(function(a, b) { return b.w - a.w; });
  var totalW = secItems.reduce(function(acc, x) { return acc + x.w; }, 0) || 100;
  secItems.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(secItems, 0, 0, VW, VH);

  var maxAbsC = 0;
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) {
      if (g !== CASH) maxAbsC = Math.max(maxAbsC, Math.abs(res.byIG[g]||0));
    });
  });
  maxAbsC = maxAbsC || 1;

  var HPAD = 18; // header reserved for sector name
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });

  secItems.forEach(function(sec) {
    if (!sec.rw || !sec.rh) return;
    var sx = sec.rx, sy = sec.ry, sw = sec.rw, sh = sec.rh;
    var innerX = sx + 3, innerY = sy + HPAD, innerW = sw - 6, innerH = sh - HPAD - 3;

    // Sector container border
    var secStroke = sec.c >= 0 ? '#177A4E' : '#9B2A20';
    svg.appendChild(se('rect', { x: sx, y: sy, width: sw, height: sh, rx: 5,
      fill: 'none', stroke: secStroke, 'stroke-opacity': 0.4, 'stroke-width': 2.5 }));

    // Sector name header
    var hdr = se('text', { x: sx + 7, y: sy + HPAD - 4, 'font-family': 'Inter,sans-serif',
      'font-size': Math.min(12, Math.max(9, sw / 18)), 'font-weight': '700', fill: '#1E2D3D' });
    hdr.textContent = trunc(sec.label, Math.floor(sw / 7));
    svg.appendChild(hdr);

    if (innerW < 10 || innerH < 10) return;

    // IG tiles within this sector
    var igItems = (igBySec[sec.key]||[]).filter(function(g) { return g !== CASH; }).map(function(g) {
      return { key: g, label: g, w: (_snapN['ig:'+g]||{w:0}).w, c: res.byIG[g]||0, sect: sec.key };
    }).filter(function(it) { return it.w > 0.001; });
    if (!igItems.length) return;
    var igTotalW = igItems.reduce(function(acc, x) { return acc + x.w; }, 0) || 1;
    igItems.forEach(function(it) { it.area = (it.w / igTotalW) * innerW * innerH; });
    squarify(igItems, innerX, innerY, innerW, innerH);

    igItems.forEach(function(item) {
      if (!item.rw || !item.rh) return;
      var rx = item.rx + 1, ry = item.ry + 1,
          rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
      var g = se('g', { class: 'mk', style: 'cursor:pointer' });
      var fillC  = contribColor(item.c, maxAbsC);
      var fgC    = contribFg(item.c, maxAbsC);
      var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
      g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 2,
        fill: fillC, stroke: strokeC, 'stroke-opacity': 0.5, 'stroke-width': 0.8 }));
      treemapTileLabel(g, rx, ry, rw, rh, item.label,
        (item.c >= 0 ? '+' : '') + item.c.toFixed(2) + '%', fillC, fgC);
      var tipC = (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%';
      bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        dispSec(item.sect) + '<br>Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
        '<br><em style="color:#898781">Click to see securities</em></span>');
      g.setAttribute('onclick', 'ndxShowSecuritiesModal(\'' + esc(item.key) + '\')');
      svg.appendChild(g);
    });
  });
  box.appendChild(svg);
}

// ── Treemap dispatcher ────────────────────────────────────────────────────
function renderTreemap(res) {
  var box = document.getElementById('ndx-treemap-box');
  if (!box) return;
  var VW = 900, VH = 370;

  var expandBtn = '<button onclick="ndxTreemapExpand()" style="position:absolute;top:4px;right:4px;' +
    'font-size:11px;font-weight:600;background:rgba(255,255,255,.8);border:1px solid var(--bdr);' +
    'border-radius:6px;padding:3px 9px;cursor:pointer;color:var(--navy);z-index:2">⤢ Expand</button>';

  var inner = document.createElement('div');
  inner.style.cssText = 'position:relative;padding:4px 0';
  inner.innerHTML = expandBtn;
  box.innerHTML = '';
  box.appendChild(inner);

  if (attrTab === 'ig') {
    renderIGFlatTreemap(res, inner, VW, VH);
  } else if (treemapSubMode === 'nested') {
    renderNestedIGTreemap(res, inner, VW, VH);
  } else {
    renderSectorFlatTreemap(res, inner, VW, VH);
  }

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:5px;flex-wrap:wrap';
  var clickNote = (attrTab === 'ig' || treemapSubMode === 'nested')
    ? 'Click tile for securities' : 'Click sector for industry groups';
  legend.innerHTML =
    '<span>Area = index weight at close</span>' +
    '<span style="color:#177A4E;font-weight:600">█</span> Positive contribution &nbsp;' +
    '<span style="color:#9B2A20;font-weight:600">█</span> Negative &nbsp;&middot;&nbsp; ' + clickNote;
  box.appendChild(legend);
}

// ── IG drill-down popup modal ─────────────────────────────────────────────
function getOrCreateModal() {
  var m = document.getElementById('ndx-ig-modal');
  if (m) return m;
  m = document.createElement('div');
  m.id = 'ndx-ig-modal';
  m.style.cssText = 'display:none;position:fixed;inset:0;z-index:2000;background:rgba(15,25,38,.55);' +
    'align-items:center;justify-content:center;backdrop-filter:blur(2px)';
  m.innerHTML =
    '<div style="background:var(--w,#fff);border-radius:14px;padding:28px 28px 22px;' +
    'max-width:780px;width:92%;max-height:85vh;overflow-y:auto;position:relative;' +
    'box-shadow:0 16px 48px rgba(0,0,0,.22)">' +
    '<button onclick="ndxCloseIGModal()" style="position:absolute;top:14px;right:16px;' +
    'font-size:22px;line-height:1;background:none;border:none;cursor:pointer;' +
    'color:var(--mu,#777);padding:0 4px">&times;</button>' +
    '<div id="ndx-ig-modal-title" style="font-size:15px;font-weight:700;color:var(--navy,#1E2D3D);' +
    'margin-bottom:16px"></div>' +
    '<div id="ndx-ig-modal-body"></div>' +
    '</div>';
  m.addEventListener('click', function(e) { if (e.target === m) ndxCloseIGModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') ndxCloseIGModal(); });
  document.body.appendChild(m);
  return m;
}

window.ndxShowIGModal = function(sector) {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  var igs = (igBySec[sector] || []).filter(function(g) { return g !== CASH; });
  if (!igs.length) return;

  var m = getOrCreateModal();
  document.getElementById('ndx-ig-modal-title').textContent =
    dispSec(sector) + '  —  Industry Groups';
  var body = document.getElementById('ndx-ig-modal-body');
  body.innerHTML = '';

  var VW = 720, VH = Math.max(160, Math.min(340, igs.length * 40 + 40));
  var items = igs.map(function(g) {
    return { key: g, label: g, w: (_snapN['ig:'+g]||{w:0}).w, c: res.byIG[g]||0 };
  });
  items.sort(function(a, b) { return b.w - a.w; });
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 1;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);

  var maxAbsC = Math.max.apply(null, items.map(function(it) { return Math.abs(it.c); })) || 1;
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH,
    style: 'width:100%;height:auto;display:block;overflow:visible' });

  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:default' });
    var fillC   = contribColor(item.c, maxAbsC);
    var fgC     = contribFg(item.c, maxAbsC);
    var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 3,
      fill: fillC, stroke: strokeC, 'stroke-opacity': 0.5, 'stroke-width': 1 }));

    if (rw > 40 && rh > 26) {
      var fs = Math.min(13, Math.max(9, Math.min(rw, rh) / 5));
      var lines = wrapWords(item.label, rw - 12, fs);
      var lineH = fs * 1.25, totalLH = lines.length * lineH;
      var showC = rh > totalLH + fs * 2;
      var startY = ry + rh / 2 - (totalLH + (showC ? fs * 1.5 : 0)) / 2 + fs * 0.82;

      lines.forEach(function(line, li) {
        var t = se('text', { x: rx + rw / 2, y: startY + li * lineH,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': fs, 'font-weight': '700', fill: fgC });
        t.textContent = line; g.appendChild(t);
      });
      if (showC) {
        var cfs = Math.max(8, fs - 2);
        var ct = se('text', { x: rx + rw / 2, y: startY + lines.length * lineH + cfs,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': cfs, fill: fgC, opacity: '0.88' });
        ct.textContent = (item.c >= 0 ? '+' : '') + item.c.toFixed(2) + '%';
        g.appendChild(ct);
      }
    }
    var tipC = (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC + '</span>');
    svg.appendChild(g);
  });
  body.appendChild(svg);

  var thtml = '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:14px;font-variant-numeric:tabular-nums">' +
    '<thead><tr><th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Industry Group</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Weight (close) %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Contribution %</th></tr></thead><tbody>';
  items.slice().sort(function(a, b) { return b.c - a.c; }).forEach(function(item) {
    thtml += '<tr><td style="text-align:left;padding:4px 8px;border-bottom:1px solid #f0f0f0">' + item.label + '</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0">' + item.w.toFixed(3) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' +
      (item.c >= 0 ? '#177A4E' : '#9B2A20') + ';font-weight:600">' +
      (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%</td></tr>';
  });
  thtml += '</tbody></table>';
  body.insertAdjacentHTML('beforeend', thtml);
  m.style.display = 'flex';
};
window.ndxCloseIGModal = function() {
  var m = document.getElementById('ndx-ig-modal');
  if (m) m.style.display = 'none';
};

// ── Securities popup — click IG in nested/flat-IG treemap ─────────────────
window.ndxShowSecuritiesModal = function(ig) {
  var secs = _securities.filter(function(d) { return d.grp === ig; });
  if (!secs.length) return;
  var m = getOrCreateModal();
  document.getElementById('ndx-ig-modal-title').textContent = ig + '  —  Securities';
  var body = document.getElementById('ndx-ig-modal-body');
  body.innerHTML = '';

  secs.sort(function(a, b) { return b.contrib - a.contrib; });
  var thtml = '<table style="width:100%;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums">' +
    '<thead><tr>' +
    '<th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Ticker</th>' +
    '<th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Company</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Return %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Close Wt %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Contrib %</th>' +
    '</tr></thead><tbody>';
  secs.forEach(function(d) {
    var rc = d.ret >= 0 ? '#177A4E' : '#9B2A20';
    var cc = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
    thtml += '<tr>' +
      '<td style="padding:4px 8px;border-bottom:1px solid #f0f0f0;font-weight:700">' + d.name + '</td>' +
      '<td style="padding:4px 8px;border-bottom:1px solid #f0f0f0;color:#52514e">' + (d.co && d.co !== d.name ? d.co : '—') + '</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' + rc + ';font-weight:600">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0">' + d.w1.toFixed(3) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' + cc + ';font-weight:600">' + (d.contrib >= 0 ? '+' : '') + d.contrib.toFixed(4) + '%</td>' +
      '</tr>';
  });
  thtml += '</tbody></table>';
  body.insertAdjacentHTML('beforeend', thtml);
  m.style.display = 'flex';
};

// ── Treemap fullscreen expand ─────────────────────────────────────────────
window.ndxTreemapExpand = function() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  var m = document.getElementById('ndx-treemap-full-modal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'ndx-treemap-full-modal';
    m.style.cssText = 'display:none;position:fixed;inset:0;z-index:2000;background:rgba(15,25,38,.6);' +
      'align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    m.innerHTML = '<div style="background:var(--w,#fff);border-radius:14px;padding:22px 22px 18px;' +
      'width:94vw;max-width:1200px;max-height:90vh;overflow-y:auto;position:relative;' +
      'box-shadow:0 16px 48px rgba(0,0,0,.22)">' +
      '<button onclick="document.getElementById(\'ndx-treemap-full-modal\').style.display=\'none\'" ' +
      'style="position:absolute;top:12px;right:14px;font-size:22px;line-height:1;background:none;' +
      'border:none;cursor:pointer;color:var(--mu,#777);padding:0 4px">&times;</button>' +
      '<div id="ndx-treemap-full-inner" style="padding-top:8px"></div></div>';
    m.addEventListener('click', function(e) { if (e.target === m) m.style.display = 'none'; });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { var fm = document.getElementById('ndx-treemap-full-modal'); if (fm) fm.style.display = 'none'; }
    });
    document.body.appendChild(m);
  }
  var inner = document.getElementById('ndx-treemap-full-inner');
  inner.innerHTML = '';
  if (attrTab === 'ig') renderIGFlatTreemap(res, inner, 1100, 520);
  else if (treemapSubMode === 'nested') renderNestedIGTreemap(res, inner, 1100, 520);
  else renderSectorFlatTreemap(res, inner, 1100, 520);
  m.style.display = 'flex';
};

window.ndxSetTreemapSubMode = function(mode) {
  treemapSubMode = mode;
  document.querySelectorAll('.ndx-tmsub-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.sub === mode);
  });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderTreemap(isBase ? baseR : computeCore(exclSecs, exclIGs));
};

window.ndxSetBeeswarmSector = function(sec) {
  _beeswarmSector = sec;
  renderBeeswarm(_securities, _beeswarmFilter);
};

// ── Attribution table ─────────────────────────────────────────────────────
function computeDisplayWeights(exS, exG) {
  var lastHoc = _activeHocs[_activeHocs.length - 1];
  if (!lastHoc) return { sec: {}, ig: {} };
  var exclW = 0;
  lastHoc.sec.forEach(function(s) {
    if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0);
  });
  var scale = exclW < 99.99 ? 100 / (100 - exclW) : 1;
  var secW = {}, igW = {};
  lastHoc.sec.forEach(function(s) {
    if (exS.has(s.s) || exG.has(s.g)) return;
    var ew = (s.w || 0) * scale;
    secW[s.s] = (secW[s.s] || 0) + ew;
    igW[s.g]  = (igW[s.g]  || 0) + ew;
  });
  return { sec: secW, ig: igW };
}
function dot(on, sz) {
  sz = sz || 16;
  return on
    ? '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:var(--navy);border:2px solid var(--navy);vertical-align:middle"></span>'
    : '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:transparent;border:2px solid #9AAAB8;vertical-align:middle"></span>';
}
function selDot(sec, sz) {
  sz = sz || 16;
  var r = sz / 2 - 1.5;
  var cx = sz / 2, cy = sz / 2;
  var fullyExcl = exclSecs.has(sec);
  var igs = igBySec[sec] || [];
  var someExcl = !fullyExcl && igs.some(function(g) { return exclIGs.has(g); });
  var pfx = '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '" style="vertical-align:middle;flex-shrink:0;overflow:visible">';
  if (fullyExcl) {
    return pfx + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#9AAAB8" stroke-width="2"/></svg>';
  } else if (someExcl) {
    return pfx +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--navy)" stroke-width="1.5"/>' +
      '<path d="M ' + cx + ' ' + (cy - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (cy + r) + ' Z" fill="var(--navy)"/>' +
      '</svg>';
  } else {
    return pfx + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--navy)" stroke="var(--navy)" stroke-width="1.5"/></svg>';
  }
}
function renderAttrTable(res) {
  var tbody = document.getElementById('ndx-attr-tbody');
  if (!tbody) return;
  var isIG = attrTab === 'ig';
  var html = '';
  function cmpSec(a, b) {
    if (a === CASH) return 1; if (b === CASH) return -1;
    if (_sortKey === 'name')   return _sortDir * a.localeCompare(b);
    if (_sortKey === 'weight') return _sortDir * ((_snapN[b]||{w:0}).w - (_snapN[a]||{w:0}).w);
    return _sortDir * ((baseR.bySec[b]||0) - (baseR.bySec[a]||0));
  }
  function cmpIG(a, b) {
    if (a === CASH) return 1; if (b === CASH) return -1;
    if (_sortKey === 'name')   return _sortDir * a.localeCompare(b);
    if (_sortKey === 'weight') return _sortDir * ((_snapN['ig:'+b]||{w:0}).w - (_snapN['ig:'+a]||{w:0}).w);
    return _sortDir * ((baseR.byIG[b]||0) - (baseR.byIG[a]||0));
  }
  var sortedSecs = sectors.slice().sort(cmpSec);
  var dw = computeDisplayWeights(exclSecs, exclIGs);
  function fmtW(w, excl) {
    if (excl) return '<span style="color:var(--mu)">—</span>';
    return (w || 0).toFixed(2) + '%';
  }
  if (!isIG) {
    sortedSecs.forEach(function(s) {
      var excl = exclSecs.has(s);
      var n = _snapN[s]||{count:0,w:0}, o = _snap0[s]||{count:0,w:0};
      html += '<tr style="' + (excl ? 'opacity:.42;' : '') + 'cursor:pointer" onclick="ndxToggleSec(\'' + esc(s) + '\')">' +
        '<td style="width:28px;text-align:center;padding:6px 4px">' + dot(!excl, 16) + '</td>' +
        '<td style="font-weight:600">' + dispSec(s) + '</td>' +
        '<td class="num">' + o.count + ' → ' + n.count + '</td>' +
        '<td class="num">' + fmtW(dw.sec[s], excl) + '</td>' +
        '<td class="num">' + fmtC(res.bySec[s]||0) + '</td></tr>';
    });
  } else {
    sortedSecs.forEach(function(s) {
      var igs = (igBySec[s]||[]).slice().sort(cmpIG);
      if (!igs.length) return;
      var secExcl = exclSecs.has(s);
      var sn = _snapN[s]||{count:0,w:0}, so = _snap0[s]||{count:0,w:0};
      var expanded = _expandedSecs.has(s);
      var arrow = '<span style="font-size:10px;margin-left:6px;color:var(--mu)">' + (expanded ? '▲' : '▼') + '</span>';
      html += '<tr style="background:var(--surface);' + (secExcl?'opacity:.42;':'') + 'cursor:pointer" ' +
        'onclick="event.stopPropagation();ndxToggleSec(\'' + esc(s) + '\')">' +
        '<td style="width:28px;text-align:center;padding:6px 4px">' + selDot(s, 16) + '</td>' +
        '<td style="font-weight:700;color:var(--navy)">' +
          '<span style="display:flex;align-items:center;justify-content:space-between">' +
            '<span>' + dispSec(s) + '</span>' +
            '<span onclick="event.stopPropagation();ndxToggleSecExpand(\'' + esc(s) + '\')" ' +
              'style="padding:2px 8px;cursor:pointer;user-select:none;color:var(--mu)">' + arrow + '</span>' +
          '</span>' +
        '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + so.count + ' → ' + sn.count + '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + fmtW(dw.sec[s], secExcl) + '</td>' +
        '<td class="num" style="font-weight:700">' + fmtC(res.bySec[s]||0) + '</td></tr>';
      if (expanded) {
        igs.forEach(function(g) {
          var igExcl = exclIGs.has(g);
          var anyExcl = secExcl || igExcl;
          var gn = _snapN['ig:'+g]||{count:0,w:0}, go = _snap0['ig:'+g]||{count:0,w:0};
          html += '<tr style="' + (anyExcl?'opacity:.38;':'') + 'cursor:pointer" onclick="event.stopPropagation();ndxToggleIG(\'' + esc(g) + '\')">' +
            '<td style="width:28px;text-align:center;padding:5px 4px 5px 10px">' + dot(!anyExcl, 13) + '</td>' +
            '<td style="padding-left:20px;font-size:12px">' + dispIG(g) + '</td>' +
            '<td class="num" style="font-size:11.5px">' + go.count + ' → ' + gn.count + '</td>' +
            '<td class="num" style="font-size:11.5px">' + fmtW(dw.ig[g], anyExcl) + '</td>' +
            '<td class="num">' + fmtC(res.byIG[g]||0) + '</td></tr>';
        });
      }
    });
  }
  html += '<tr style="border-top:2px solid var(--navy);font-weight:700">' +
    '<td></td><td colspan="3" style="color:var(--navy)">Total</td>' +
    '<td class="num" style="color:' + colr(baseR.ytd) + ';font-weight:700">' + fmtYTD(baseR.ytd) + '</td></tr>';
  tbody.innerHTML = html;
  updateArrows();
}
function updateArrows() {
  ['name','weight','contrib'].forEach(function(k) {
    var el = document.getElementById('ndx-sort-' + k);
    if (el) el.textContent = _sortKey === k ? (_sortDir === -1 ? ' ▼' : ' ▲') : '';
  });
}

// ── HOC timeline ─────────────────────────────────────────────────────────
function renderHOC(res) {
  var tbody = document.getElementById('ndx-hoc-tbody');
  if (!tbody) return;
  tbody.innerHTML = res.hocResults.map(function(h) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--navy);text-align:center">' + h.n + '</td>' +
      '<td>' + h.eff + '</td>' +
      '<td>' + (h.close || '<em style="color:var(--mu)">Open</em>') + '</td>' +
      '<td class="num">' + h.count + '</td>' +
      '<td class="num" style="color:' + colr(h.ret) + ';font-weight:600">' +
      (h.ret>=0?'+':'') + h.ret.toFixed(4) + '%</td></tr>';
  }).join('');
}

// ── Dot Plot — IG contributions ───────────────────────────────────────────
function renderDotPlotIG(res) {
  var box = document.getElementById('ndx-dotplot-box');
  if (!box) return;
  var rows = [];
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) {
      if (g === CASH) return;
      rows.push({ name: dispIG(g), sector: dispSec(s), c: res.byIG[g]||0,
        w0: (_snap0['ig:'+g]||{w:0}).w, w1: (_snapN['ig:'+g]||{w:0}).w });
    });
  });
  rows.sort(function(a, b) { return b.c - a.c; });

  var rowH = 20, P = { t: 28, r: 90, b: 30, l: 210 }, VW = 900;
  var VH = P.t + rows.length * rowH + P.b;
  var lo = Math.min(-0.5, Math.min.apply(null, rows.map(function(r) { return r.c; })));
  var hi = Math.max.apply(null, rows.map(function(r) { return r.c; })) * 1.05;
  var xa0 = P.l, xa1 = VW - P.r - 60;
  function X(v) { return xa0 + (v - lo) / (hi - lo) * (xa1 - xa0); }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  var step = hi > 8 ? 5 : hi > 2 ? 2.5 : 1;
  for (var t = 0; t <= hi + step; t += step) {
    if (t > hi + 0.01) break;
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 8, y2: VH - P.b + 2, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var tx = se('text', { x: X(t), y: P.t - 14, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    tx.textContent = (t > 0 ? '+' : '') + t.toFixed(1) + '%'; svg.appendChild(tx);
  }
  svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t - 8, y2: VH - P.b + 2, stroke: '#9AAAB8', 'stroke-width': 1 }));

  rows.forEach(function(r, i) {
    var y = P.t + i * rowH + rowH / 2;
    var g = se('g', { class: 'mk' });
    var col = r.c >= 0 ? '#177A4E' : '#9B2A20';
    var nm = se('text', { x: P.l - 12, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11.5, fill: '#2B3B4E' });
    nm.textContent = trunc(r.name, 28); g.appendChild(nm);
    g.appendChild(se('line', { x1: X(0), x2: X(r.c), y1: y, y2: y, stroke: col, 'stroke-opacity': 0.3, 'stroke-width': 2 }));
    var circle = se('circle', { cx: X(r.c), cy: y, r: 5, fill: col, stroke: '#fff', 'stroke-width': 2 });
    g.appendChild(circle);
    var vt = se('text', { x: VW - P.r + 55, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: col, 'font-weight': '600', 'font-variant-numeric': 'tabular-nums' });
    vt.textContent = (r.c >= 0 ? '+' : '') + r.c.toFixed(2) + '%'; g.appendChild(vt);
    bindTip(g, '<b style="font-size:13px">' + r.name + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      r.sector + '<br>Contribution: ' + (r.c >= 0 ? '+' : '') + r.c.toFixed(4) + '%' +
      '<br>Weight: ' + r.w0.toFixed(2) + '% → ' + r.w1.toFixed(2) + '%</span>');
    svg.appendChild(g);
  });
  box.innerHTML = ''; box.appendChild(svg);
}

// ── Heatmap — sector × HOC window (green positive, red negative) ──────────
function renderHeatmap() {
  var box = document.getElementById('ndx-heatmap-box');
  if (!box || !baseR) return;
  var hocSecC = baseR.hocSecC, hocResults = baseR.hocResults;
  if (!hocSecC || !hocSecC.length) { box.innerHTML = '<em style="color:var(--mu)">No data</em>'; return; }

  var secs = sectors.filter(function(s) { return s !== CASH; });
  var VW = 900, cellW = (VW - 230) / hocResults.length, cellH = 28;
  var P = { t: 60, l: 215 };
  var VH = P.t + secs.length * cellH + 30;

  var mx = 0;
  hocSecC.forEach(function(sc) { secs.forEach(function(s) { mx = Math.max(mx, Math.abs(sc[s] || 0)); }); });
  function ramp(v) {
    if (Math.abs(v) < 1e-9) return '#EDECEA';
    var t = Math.min(1, Math.sqrt(Math.abs(v) / mx));
    var idx = Math.min(4, Math.floor(t * 5));
    return v > 0 ? POS_RAMP[idx] : NEG_RAMP[idx];
  }
  function hmFg(v) {
    var t = Math.min(1, Math.sqrt(Math.abs(v) / (mx || 1)));
    return t > 0.52 ? '#fff' : '#1E2D3D';
  }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  hocResults.forEach(function(h, j) {
    var lbl = se('text', { x: 0, y: 0, 'text-anchor': 'start', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0',
      transform: 'translate(' + (P.l + j * cellW + cellW / 2) + ',' + (P.t - 10) + ') rotate(-50)' });
    lbl.textContent = h.eff.slice(5); svg.appendChild(lbl);
  });

  secs.forEach(function(s, i) {
    var y = P.t + i * cellH;
    var nm = se('text', { x: P.l - 12, y: y + cellH / 2 + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E' });
    nm.textContent = trunc(dispSec(s), 26); svg.appendChild(nm);
    hocResults.forEach(function(h, j) {
      var v = hocSecC[j][s] || 0;
      var g = se('g', { class: 'mk' });
      g.appendChild(se('rect', { x: P.l + j * cellW + 1, y: y + 1, width: cellW - 2, height: cellH - 2, rx: 3, fill: ramp(v) }));
      // value label if cell wide enough
      if (cellW > 38 && Math.abs(v) > 0.01) {
        var vt = se('text', { x: P.l + j * cellW + cellW / 2, y: y + cellH / 2 + 4, 'text-anchor': 'middle',
          'font-family': 'Inter,sans-serif', 'font-size': 9, fill: hmFg(v), 'font-weight': '600' });
        vt.textContent = (v >= 0 ? '+' : '') + v.toFixed(1); g.appendChild(vt);
      }
      bindTip(g, '<b style="font-size:13px">' + dispSec(s) + ' · HOC ' + h.n + ' (' + h.eff + ')</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        'Contribution: ' + (v >= 0 ? '+' : '') + v.toFixed(4) + '%' +
        '<br>Window return: ' + (h.ret >= 0 ? '+' : '') + h.ret.toFixed(4) + '%</span>');
      svg.appendChild(g);
    });
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap;align-items:center';
  legend.innerHTML =
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + NEG_RAMP[3] + ';margin-right:5px;vertical-align:-1px"></span>Negative</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#EDECEA;margin-right:5px;vertical-align:-1px"></span>Zero</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + POS_RAMP[3] + ';margin-right:5px;vertical-align:-1px"></span>Positive</span>';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

// ── Dumbbell — weight composition open vs close ───────────────────────────
function renderDumbbell() {
  var box = document.getElementById('ndx-dumbbell-box');
  if (!box) return;
  var rows = sectors.filter(function(s) { return s !== CASH; }).map(function(s) {
    return { name: dispSec(s), w0: (_snap0[s]||{w:0}).w, w1: (_snapN[s]||{w:0}).w };
  }).sort(function(a, b) { return b.w0 - a.w0; });

  var VW = 900, rowH = 30, P = { t: 40, r: 160, b: 26, l: 200 };
  var VH = P.t + rows.length * rowH + P.b;
  var hi = Math.max.apply(null, rows.map(function(r) { return Math.max(r.w0, r.w1); })) * 1.04;
  function X(v) { return P.l + v / hi * (VW - P.l - P.r); }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  for (var t = 0; t <= hi; t += 10) {
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 10, y2: VH - P.b, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var ax = se('text', { x: X(t), y: P.t - 18, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    ax.textContent = t + '%'; svg.appendChild(ax);
  }
  svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t - 10, y2: VH - P.b, stroke: '#9AAAB8', 'stroke-width': 1 }));

  rows.forEach(function(r, i) {
    var y = P.t + i * rowH + rowH / 2;
    var up = r.w1 >= r.w0;
    var col = up ? '#177A4E' : '#9B2A20';
    var g = se('g', { class: 'mk' });
    var nm = se('text', { x: P.l - 14, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11.5, fill: '#2B3B4E' });
    nm.textContent = r.name; g.appendChild(nm);
    g.appendChild(se('line', { x1: X(Math.min(r.w0, r.w1)), x2: X(Math.max(r.w0, r.w1)), y1: y, y2: y, stroke: col, 'stroke-width': 3, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }));
    g.appendChild(se('circle', { cx: X(r.w0), cy: y, r: 5.5, fill: '#fff', stroke: col, 'stroke-width': 2 }));
    g.appendChild(se('circle', { cx: X(r.w1), cy: y, r: 5.5, fill: col, stroke: '#fff', 'stroke-width': 2 }));
    var diff = r.w1 - r.w0;
    var vt1 = se('text', { x: VW - P.r + 12, y: y + 4, 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-variant-numeric': 'tabular-nums' });
    vt1.textContent = r.w0.toFixed(1) + ' → ' + r.w1.toFixed(1) + '%';
    g.appendChild(vt1);
    var vt2 = se('text', { x: VW - 6, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: diff >= 0 ? '#177A4E' : '#9B2A20', 'font-weight': '600', 'font-variant-numeric': 'tabular-nums' });
    vt2.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(2) + 'pp';
    g.appendChild(vt2);
    bindTip(g, '<b style="font-size:13px">' + r.name + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Open weight: ' + r.w0.toFixed(3) + '%' +
      '<br>Close weight: ' + r.w1.toFixed(3) + '%' +
      '<br>Change: ' + (diff >= 0 ? '+' : '') + diff.toFixed(3) + ' pp</span>');
    svg.appendChild(g);
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap';
  legend.innerHTML =
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:transparent;border:2px solid #177A4E;box-sizing:border-box;margin-right:5px;vertical-align:-1px"></span>Open weight</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#177A4E;margin-right:5px;vertical-align:-1px"></span>Close weight</span>' +
    '<span style="color:#177A4E;font-weight:600">▬</span> gained &nbsp; <span style="color:#9B2A20;font-weight:600">▬</span> lost weight';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

// ── Scatter — weight × return per security ────────────────────────────────
function renderScatter(securities) {
  var box = document.getElementById('ndx-scatter-box');
  if (!box || !securities.length) return;

  var dots = securities.filter(function(d) { return d.w1 > 0 || d.w0 > 0; });
  var VW = 900, P = { t: 40, r: 30, b: 50, l: 60 };
  var VH = 480;

  var xs = dots.map(function(d) { return d.ret; });
  var ys = dots.map(function(d) { return d.w1; });
  var xLo = _scatterXLo != null ? _scatterXLo : Math.min.apply(null, xs) - (Math.max.apply(null, xs) - Math.min.apply(null, xs)) * 0.05;
  var xHi = _scatterXHi != null ? _scatterXHi : Math.max.apply(null, xs) + (Math.max.apply(null, xs) - Math.min.apply(null, xs)) * 0.05;
  var yHi = _scatterYHi != null ? _scatterYHi : Math.max.apply(null, ys) * 1.06;

  var cw = VW - P.l - P.r, ch = VH - P.t - P.b;
  function X(v) { return P.l + (v - xLo) / (xHi - xLo) * cw; }
  function Y(v) { return P.t + ch - v / yHi * ch; }

  var maxAbsC = Math.max.apply(null, dots.map(function(d) { return Math.abs(d.contrib); })) || 1;

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  // Gridlines
  var xStep = (xHi - xLo) > 60 ? 20 : (xHi - xLo) > 30 ? 10 : 5;
  var xStart = Math.ceil(xLo / xStep) * xStep;
  for (var xv = xStart; xv <= xHi + xStep * 0.5; xv += xStep) {
    svg.appendChild(se('line', { x1: X(xv), x2: X(xv), y1: P.t, y2: VH - P.b, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var xt = se('text', { x: X(xv), y: VH - P.b + 14, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    xt.textContent = (xv > 0 ? '+' : '') + xv.toFixed(0) + '%'; svg.appendChild(xt);
  }
  // Zero line
  if (xLo < 0 && xHi > 0) {
    svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t, y2: VH - P.b, stroke: '#C0C8D0', 'stroke-width': 1.5 }));
  }
  var yStep = yHi > 40 ? 10 : yHi > 15 ? 5 : 2;
  for (var yv = 0; yv <= yHi; yv += yStep) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(yv), y2: Y(yv), stroke: '#E5E8EC', 'stroke-width': 1 }));
    var ytxt = se('text', { x: P.l - 6, y: Y(yv) + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    ytxt.textContent = yv + '%'; svg.appendChild(ytxt);
  }
  // Axis labels
  var xal = se('text', { x: P.l + cw / 2, y: VH - 8, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0' });
  xal.textContent = 'Security return (%, compounded)'; svg.appendChild(xal);
  var yal = se('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0',
    transform: 'translate(12,' + (P.t + ch / 2) + ') rotate(-90)' });
  yal.textContent = 'Closing weight (%)'; svg.appendChild(yal);

  // Identify top 10 by |contrib| for labeling
  var sorted = dots.slice().sort(function(a, b) { return Math.abs(b.contrib) - Math.abs(a.contrib); });
  var top10 = new Set(sorted.slice(0, 10).map(function(d) { return d.name; }));

  // Place dots (circles first, labels after so they render on top)
  var labelItems = [];
  dots.forEach(function(d) {
    var cx = X(d.ret), cy = Y(d.w1);
    var r = Math.max(3, Math.min(14, Math.sqrt(Math.abs(d.contrib)) * 4));
    var fillC = contribColor(d.contrib, maxAbsC);
    var strokeC = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
    var g = se('g', { class: 'mk' });
    g.appendChild(se('circle', { cx: cx, cy: cy, r: r, fill: fillC, 'fill-opacity': 0.82, stroke: strokeC, 'stroke-width': 1.2 }));
    bindTip(g,
      '<b style="font-size:13px">' + d.name + (d.co && d.co !== d.name ? ' — ' + d.co : '') + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      dispSec(d.sect) + ' / ' + d.grp +
      '<br>Return: ' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%' +
      '<br>Close weight: ' + d.w1.toFixed(3) + '%' +
      '<br>Contribution: ' + (d.contrib >= 0 ? '+' : '') + d.contrib.toFixed(4) + '%</span>');
    svg.appendChild(g);
    if (top10.has(d.name)) labelItems.push({ name: d.name, cx: cx, cy: cy, r: r });
  });

  // Simple label placement: offset above/right with minimal collision check
  var placed = [];
  labelItems.sort(function(a, b) { return b.cy - a.cy; }); // top-to-bottom
  labelItems.forEach(function(item) {
    var fs = 10, lh = fs + 2;
    var lx = item.cx + item.r + 3, ly = item.cy - 3;
    // Nudge Y to avoid placed labels (simple: check ±1 label height)
    placed.forEach(function(p) {
      if (Math.abs(lx - p.lx) < 50 && Math.abs(ly - p.ly) < lh + 1) ly = p.ly - lh - 2;
    });
    ly = Math.max(P.t + fs, Math.min(VH - P.b - 2, ly));
    var t = se('text', { x: lx, y: ly, 'font-family': 'Inter,sans-serif', 'font-size': fs, 'font-weight': '700', fill: '#1E2D3D' });
    t.textContent = item.name; svg.appendChild(t);
    placed.push({ lx: lx, ly: ly });
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap';
  legend.innerHTML =
    'Bubble area ∝ √|contribution| &nbsp;·&nbsp; ' +
    '<span style="color:#177A4E;font-weight:600">●</span> Positive contribution &nbsp; ' +
    '<span style="color:#9B2A20;font-weight:600">●</span> Negative &nbsp;·&nbsp; Top 10 by |contribution| labeled';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

// ── Beeswarm — contributions per security, lane per sector ────────────────
window.ndxSetBeeswarmFilter = function(threshold) {
  _beeswarmFilter = threshold;
  document.querySelectorAll('.ndx-bee-btn').forEach(function(b) {
    b.classList.toggle('active', parseFloat(b.dataset.thr) === threshold);
  });
  renderBeeswarm(_securities, threshold);
};

function beeswarmLayout(dots, X, r) {
  var placed = [];
  dots.forEach(function(d) {
    var cx = X(d.contrib), cy = 0;
    var diam = r * 2 + 1.5;
    outer: for (var i = 0; i <= 30; i++) {
      var cands = i === 0 ? [0] : [i * diam, -i * diam];
      for (var ci = 0; ci < cands.length; ci++) {
        var ty = cands[ci];
        var ok = true;
        for (var j = 0; j < placed.length; j++) {
          var dx = cx - placed[j].cx, dy = ty - placed[j].cy;
          if (dx * dx + dy * dy < diam * diam) { ok = false; break; }
        }
        if (ok) { cy = ty; break outer; }
      }
    }
    placed.push({ cx: cx, cy: cy });
    d.bx = cx; d.by = cy;
  });
}

function renderBeeswarm(securities, threshold) {
  var box = document.getElementById('ndx-beeswarm-box');
  if (!box || !securities.length) return;

  var filtered = securities.filter(function(d) { return Math.abs(d.contrib) > threshold && d.sect !== CASH; });

  var secList = _beeswarmSector
    ? [_beeswarmSector]
    : sectors.filter(function(s) { return s !== CASH; });
  var dotR = 4.5;
  var laneH = 60;
  var P = { t: 36, b: 36, l: 200, r: 20 };
  var VW = 900;
  var VH = P.t + secList.length * laneH + P.b;

  // Global X scale across all sectors
  var allC = filtered.map(function(d) { return d.contrib; });
  var xLo = allC.length ? Math.min.apply(null, allC) : -1;
  var xHi = allC.length ? Math.max.apply(null, allC) : 1;
  var xPad = Math.max((xHi - xLo) * 0.04, 0.05);
  xLo -= xPad; xHi += xPad;
  var cw = VW - P.l - P.r;
  function X(v) { return P.l + (v - xLo) / (xHi - xLo) * cw; }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  // X-axis ticks (top)
  var xStep = (xHi - xLo) > 8 ? 2 : (xHi - xLo) > 3 ? 1 : 0.5;
  var xStart = Math.ceil(xLo / xStep) * xStep;
  for (var xv = xStart; xv <= xHi + xStep * 0.5; xv += xStep) {
    svg.appendChild(se('line', { x1: X(xv), x2: X(xv), y1: P.t, y2: VH - P.b, stroke: '#EAEDEF', 'stroke-width': 1 }));
    var xt = se('text', { x: X(xv), y: P.t - 8, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    xt.textContent = (xv > 0 ? '+' : '') + xv.toFixed(1) + '%'; svg.appendChild(xt);
  }
  if (xLo < 0 && xHi > 0) {
    svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t, y2: VH - P.b, stroke: '#C0C8D0', 'stroke-width': 1.5 }));
  }

  var maxAbsC = Math.max.apply(null, filtered.map(function(d) { return Math.abs(d.contrib); })) || 1;

  secList.forEach(function(sec, si) {
    var laneY = P.t + si * laneH + laneH / 2;
    // Lane stripe
    if (si % 2 === 1) {
      svg.appendChild(se('rect', { x: P.l, y: P.t + si * laneH, width: cw, height: laneH, fill: '#F7F8FA', opacity: '0.6' }));
    }
    // Sector label
    var lbl = se('text', { x: P.l - 14, y: laneY + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-weight': '600' });
    lbl.textContent = trunc(dispSec(sec), 24); svg.appendChild(lbl);

    var laneDots = filtered.filter(function(d) { return d.sect === sec; });
    if (!laneDots.length) return;

    beeswarmLayout(laneDots, X, dotR);

    laneDots.forEach(function(d) {
      var fillC = contribColor(d.contrib, maxAbsC);
      var strokeC = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
      var gy = laneY + d.by;
      // Clamp to lane bounds
      gy = Math.max(P.t + si * laneH + dotR + 1, Math.min(P.t + (si + 1) * laneH - dotR - 1, gy));
      var g = se('g', { class: 'mk' });
      g.appendChild(se('circle', { cx: d.bx, cy: gy, r: dotR, fill: fillC, 'fill-opacity': 0.85,
        stroke: strokeC, 'stroke-width': 1.2 }));
      bindTip(g,
        '<b style="font-size:13px">' + d.name + '</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        dispSec(d.sect) + ' / ' + d.grp +
        '<br>Return: ' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%' +
        '<br>Contribution: ' + (d.contrib >= 0 ? '+' : '') + d.contrib.toFixed(4) + '%' +
        '<br>Close weight: ' + d.w1.toFixed(3) + '%</span>');
      svg.appendChild(g);
    });
  });

  box.innerHTML = ''; box.appendChild(svg);
}

// ── Pareto / Top Contributors ────────────────────────────────────────────
function renderPareto(securities) {
  var box = document.getElementById('ndx-pareto-box');
  if (!box || !securities || !securities.length) return;

  var nonCash = securities.filter(function(d) { return d.sect !== CASH; });
  var byAbs = nonCash.slice().sort(function(a, b) { return Math.abs(b.contrib) - Math.abs(a.contrib); });

  var showAll = _paretoN === 0;
  var topN = showAll ? byAbs : byAbs.slice(0, _paretoN);
  var topSum = topN.reduce(function(s, d) { return s + d.contrib; }, 0);
  var totalYtd = baseR ? baseR.ytd : 0;
  var pctExplained = totalYtd !== 0 ? Math.abs(topSum / totalYtd * 100).toFixed(1) : '--';

  // Display sorted: positive desc first, negative asc after
  var pos = topN.filter(function(d) { return d.contrib >= 0; }).sort(function(a, b) { return b.contrib - a.contrib; });
  var neg = topN.filter(function(d) { return d.contrib < 0; }).sort(function(a, b) { return a.contrib - b.contrib; });
  var rows = pos.concat(neg);
  var maxAbs = Math.max.apply(null, topN.map(function(d) { return Math.abs(d.contrib); })) || 1;

  var totalStr = totalYtd !== 0 ? (totalYtd >= 0 ? '+' : '') + totalYtd.toFixed(2) + '%' : '--';
  var topSumStr = (topSum >= 0 ? '+' : '') + topSum.toFixed(2) + '%';
  var nlbl = showAll ? ('All ' + topN.length) : ('Top ' + _paretoN);

  var html = '<div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;flex-wrap:wrap">' +
    [5, 10, 20, 0].map(function(nv) {
      var lbl = nv === 0 ? 'All' : nv;
      var act = _paretoN === nv;
      return '<button class="ndx-pareto-n-btn ndx-tab-btn' + (act ? ' active' : '') + '" data-n="' + nv + '" onclick="ndxSetParetoN(' + nv + ')">' + lbl + '</button>';
    }).join('') +
    '<span style="margin-left:auto;font-size:12px;color:var(--mu)">' +
      nlbl + ' names: <b style="color:' + colr(topSum) + '">' + topSumStr + '</b>' +
      ' &middot; <b style="color:var(--navy)">' + pctExplained + '%</b> of <b style="color:' + colr(totalYtd) + '">' + totalStr + '</b> YTD' +
    '</span>' +
  '</div>' +
  '<div style="display:flex;flex-direction:column;gap:3px">';

  rows.forEach(function(d) {
    var BAR_MAX = 300;
    var barW = Math.round(Math.abs(d.contrib) / maxAbs * BAR_MAX);
    var col = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
    var val = (d.contrib >= 0 ? '+' : '') + d.contrib.toFixed(3) + '%';
    html +=
      '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:.5px solid #F0F4F8">' +
        '<span style="min-width:52px;font-size:11.5px;font-weight:700;color:var(--navy);text-align:right;font-variant-numeric:tabular-nums">' + d.name + '</span>' +
        '<div style="position:relative;width:' + BAR_MAX + 'px;height:16px;background:var(--surface);border-radius:3px;flex-shrink:0">' +
          '<div style="position:absolute;top:2px;bottom:2px;left:0;width:' + barW + 'px;background:' + col + ';opacity:.7;border-radius:2px"></div>' +
        '</div>' +
        '<span style="min-width:62px;font-size:11.5px;color:' + col + ';font-weight:600;font-variant-numeric:tabular-nums">' + val + '</span>' +
        '<span style="font-size:11px;color:var(--mu);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">' + trunc(d.grp, 34) + '</span>' +
      '</div>';
  });

  html += '</div>';
  box.innerHTML = html;
}

// ── PROPUESTA helpers ─────────────────────────────────────────────────────
var PROP_BADGE = '<span style="font-size:9px;background:rgba(200,140,0,.12);color:#8A5A00;' +
  'border:1px solid rgba(200,140,0,.4);border-radius:4px;padding:2px 7px;font-weight:700;' +
  'letter-spacing:.06em;text-transform:uppercase;margin-left:8px">PROPUESTA</span>';

function propTabBar(tabs, active, handler) {
  return '<div style="display:flex;gap:4px;margin-bottom:12px">' +
    tabs.map(function(t) {
      return '<button class="ndx-tab-btn' + (t.k === active ? ' active' : '') + '" ' +
        'onclick="' + handler + '(\'' + t.k + '\')">' + t.lbl + '</button>';
    }).join('') +
  '</div>';
}

// ── Rebalance Impact — Proposal A: per-HOC events table ──────────────────
function renderRebalA() {
  var box = document.getElementById('ndx-rebal-box');
  if (!box || !_activeHocs.length) return;
  var rows = _activeHocs.map(function(hoc, i) {
    var curr = {}; hoc.sec.forEach(function(s) { curr[s.t||s.co] = s.w||0; });
    var added = [], removed = [], displaced = 0;
    if (i > 0) {
      var prev = {}; _activeHocs[i-1].sec.forEach(function(s) { prev[s.t||s.co] = s.w||0; });
      Object.keys(curr).forEach(function(k) { if (!(k in prev)) added.push(k); });
      Object.keys(prev).forEach(function(k) { if (!(k in curr)) removed.push(k); });
      var allK = new Set(Object.keys(curr).concat(Object.keys(prev)));
      allK.forEach(function(k) { displaced += Math.abs((curr[k]||0) - (prev[k]||0)); });
      displaced /= 2;
    }
    var period = hoc.eff + (hoc.close ? ' → ' + hoc.close : ' (open)');
    return '<tr>' +
      '<td style="font-weight:700;color:var(--navy);text-align:center">' + hoc.n + '</td>' +
      '<td style="font-size:11px">' + period + '</td>' +
      '<td class="num" style="color:var(--pos);font-weight:600">' + (added.length||'—') + '</td>' +
      '<td class="num" style="color:var(--neg);font-weight:600">' + (removed.length||'—') + '</td>' +
      '<td class="num">' + hoc.sec.length + '</td>' +
      '<td class="num" style="font-weight:600">' + (displaced > 0 ? displaced.toFixed(1) + '%' : '—') + '</td>' +
    '</tr>';
  }).join('');
  box.innerHTML = '<div class="twrap"><table class="rt">' +
    '<thead><tr><th style="text-align:center">HOC</th><th>Period</th>' +
    '<th class="num" style="color:var(--pos)">Added</th>' +
    '<th class="num" style="color:var(--neg)">Removed</th>' +
    '<th class="num">Count</th><th class="num">Weight Displaced</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

// ── Rebalance Impact — Proposal B: buy-and-hold counterfactual ───────────
function renderRebalB() {
  var box = document.getElementById('ndx-rebal-box');
  if (!box || !_activeHocs.length || !baseR) return;
  var firstHoc = _activeHocs[0];
  var initW = {}, compR = {};
  firstHoc.sec.forEach(function(s) {
    var key = s.t||s.co; initW[key] = (s.w||0)/100; compR[key] = 1;
  });
  _activeHocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      var key = s.t||s.co;
      if (compR[key] !== undefined) compR[key] *= (1 + s.r/100);
    });
  });
  var bhRet = 0;
  Object.keys(initW).forEach(function(key) { bhRet += initW[key] * (compR[key] - 1); });
  bhRet *= 100;
  var real = baseR.ytd;
  var diff = real - bhRet;

  var maxAbs = Math.max(Math.abs(real), Math.abs(bhRet)) || 1;
  function barW(v) { return Math.round(Math.abs(v) / maxAbs * 280); }
  function bar(v, lbl) {
    var col = v >= 0 ? '#177A4E' : '#9B2A20';
    var str = (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
    return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:.5px solid #F0F4F8">' +
      '<span style="min-width:160px;font-size:12px;color:var(--mu)">' + lbl + '</span>' +
      '<div style="position:relative;width:280px;height:22px;background:var(--surface);border-radius:4px">' +
        '<div style="position:absolute;top:3px;bottom:3px;left:0;width:' + barW(v) + 'px;background:' + col + ';opacity:.75;border-radius:3px"></div>' +
      '</div>' +
      '<b style="font-size:14px;color:' + col + ';min-width:72px;font-variant-numeric:tabular-nums">' + str + '</b>' +
    '</div>';
  }
  var diffCol = diff >= 0 ? 'var(--pos)' : 'var(--neg)';
  box.innerHTML =
    '<p style="font-size:12px;color:var(--mu);margin:0 0 14px">Si no hubiera habido rebalanceos, ¿cuánto habría rendido el portafolio inicial del período?</p>' +
    bar(real, 'NDX real (con rebalanceos)') +
    bar(bhRet, 'Buy-and-hold sin rebalancear') +
    '<div style="padding:12px 0;font-size:13px">' +
      'Impacto del rebalanceo: <b style="color:' + diffCol + '">' + (diff>=0?'+':'') + diff.toFixed(2) + '% ' + (diff>=0?'tailwind':'drag') + '</b>' +
    '</div>';
}

// ── Rebalance Impact — Proposal C: Herfindahl concentration line ─────────
function renderRebalC() {
  var box = document.getElementById('ndx-rebal-box');
  if (!box || !_activeHocs.length) return;
  var pts = _activeHocs.map(function(hoc) {
    var total = hoc.sec.reduce(function(s, d) { return s + Math.max(d.w||0, 0); }, 0) || 100;
    var hhi = hoc.sec.reduce(function(s, d) { var w = (d.w||0)/total; return s + w*w; }, 0) * 100;
    return { n: hoc.n, date: hoc.close||hoc.eff, hhi: hhi, count: hoc.sec.length };
  });
  var VW = 860, VH = 200, P = {t:24, r:60, b:40, l:50};
  var cw = VW - P.l - P.r, ch = VH - P.t - P.b;
  var hhiMin = Math.min.apply(null, pts.map(function(p){return p.hhi;}));
  var hhiMax = Math.max.apply(null, pts.map(function(p){return p.hhi;}));
  var hhiRange = (hhiMax - hhiMin) || 1;
  function X(i) { return P.l + (pts.length < 2 ? cw/2 : i / (pts.length-1) * cw); }
  function Y(v) { return P.t + ch - (v - hhiMin) / hhiRange * ch; }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  // Grid lines
  for (var g = 0; g <= 4; g++) {
    var yv = hhiMin + g/4 * hhiRange;
    var yp = Y(yv);
    svg.appendChild(se('line', { x1: P.l, x2: VW-P.r, y1: yp, y2: yp, stroke:'#EAEDEF', 'stroke-width':1 }));
    var yt = se('text', { x: P.l-6, y: yp+4, 'text-anchor':'end', 'font-family':'Inter,sans-serif', 'font-size':10, fill:'#8A93A0' });
    yt.textContent = yv.toFixed(2); svg.appendChild(yt);
  }
  // Line path
  var pathD = pts.map(function(p, i) { return (i===0?'M':'L') + X(i).toFixed(1) + ' ' + Y(p.hhi).toFixed(1); }).join(' ');
  svg.appendChild(se('path', { d: pathD, fill:'none', stroke:'var(--navy)', 'stroke-width':2 }));
  // Dots
  pts.forEach(function(p, i) {
    var cx = X(i), cy = Y(p.hhi);
    var dot = se('circle', { cx: cx, cy: cy, r: 4, fill:'var(--navy)', stroke:'#fff', 'stroke-width':1.5 });
    svg.appendChild(dot);
    bindTip(dot, 'HOC ' + p.n + ' · ' + p.date + '<br>HHI = ' + p.hhi.toFixed(3) + ' · ' + p.count + ' constituyentes');
  });
  // X labels (abbreviated dates)
  pts.forEach(function(p, i) {
    if (i % Math.ceil(pts.length/6) !== 0 && i !== pts.length-1) return;
    var xt = se('text', { x: X(i), y: VH-4, 'text-anchor':'middle', 'font-family':'Inter,sans-serif', 'font-size':9, fill:'#8A93A0' });
    xt.textContent = p.date.slice(2); svg.appendChild(xt);
  });
  var note = se('text', { x: VW-P.r+4, y: P.t+12, 'font-family':'Inter,sans-serif', 'font-size':10, fill:'#8A93A0' });
  note.textContent = 'HHI'; svg.appendChild(note);
  box.innerHTML = '';
  var intro = document.createElement('p');
  intro.style.cssText = 'font-size:12px;color:var(--mu);margin:0 0 10px';
  intro.textContent = 'Herfindahl-Hirschman Index (suma de pesos²) — mayor = más concentrado en pocos nombres.';
  box.appendChild(intro);
  box.appendChild(svg);
}

function renderRebalSection() {
  var box = document.getElementById('ndx-rebal-box');
  if (!box) return;
  if (_rebalTab === 'A') renderRebalA();
  else if (_rebalTab === 'B') renderRebalB();
  else renderRebalC();
}

// ── Winners vs Losers — Proposal A: sector matrix table ──────────────────
function renderWLA() {
  var box = document.getElementById('ndx-wl-box');
  if (!box || !_securities.length) return;
  var nonCash = _securities.filter(function(d) { return d.sect !== CASH; });
  var secs = sectors.filter(function(s) { return s !== CASH; });
  var rows = secs.map(function(sec) {
    var arr = nonCash.filter(function(d) { return d.sect === sec; });
    if (!arr.length) return null;
    var contrib = arr.reduce(function(s,d) { return s+d.contrib; }, 0);
    var avgRet  = arr.reduce(function(s,d) { return s+d.ret; }, 0) / arr.length;
    var wn = arr.filter(function(d) { return d.contrib>0; }).length;
    var ln = arr.filter(function(d) { return d.contrib<0; }).length;
    var wChg = arr.reduce(function(s,d) { return s+(d.w1-d.w0); }, 0);
    return { sec: sec, contrib: contrib, avgRet: avgRet, wn: wn, ln: ln, wChg: wChg, n: arr.length };
  }).filter(Boolean);
  rows.sort(function(a,b) { return b.contrib - a.contrib; });
  var html = '<div class="twrap"><table class="rt">' +
    '<thead><tr>' +
    '<th>Sector</th><th class="num">Contribución</th><th class="num">Ret Promedio</th>' +
    '<th class="num" style="color:var(--pos)">Winners</th><th class="num" style="color:var(--neg)">Losers</th>' +
    '<th class="num">Δ Peso</th></tr></thead><tbody>';
  rows.forEach(function(r) {
    var cStr = (r.contrib>=0?'+':'')+r.contrib.toFixed(3)+'%';
    var rStr = (r.avgRet>=0?'+':'')+r.avgRet.toFixed(1)+'%';
    var wStr = (r.wChg>=0?'+':'')+r.wChg.toFixed(2)+'%';
    html += '<tr>' +
      '<td style="font-weight:600;font-size:12px">' + dispSec(r.sec) + '</td>' +
      '<td class="num" style="color:' + colr(r.contrib) + ';font-weight:700">' + cStr + '</td>' +
      '<td class="num" style="color:' + colr(r.avgRet) + '">' + rStr + '</td>' +
      '<td class="num" style="color:var(--pos);font-weight:600">' + r.wn + '/' + r.n + '</td>' +
      '<td class="num" style="color:var(--neg);font-weight:600">' + r.ln + '/' + r.n + '</td>' +
      '<td class="num" style="color:' + colr(r.wChg) + '">' + wStr + '</td>' +
    '</tr>';
  });
  box.innerHTML = html + '</tbody></table></div>';
}

// ── Winners vs Losers — Proposal B: return distribution histogram ─────────
function renderWLB() {
  var box = document.getElementById('ndx-wl-box');
  if (!box || !_securities.length) return;
  var nonCash = _securities.filter(function(d) { return d.sect !== CASH; });
  var bins = [[-1e9,-20],[-20,-10],[-10,-5],[-5,0],[0,5],[5,10],[10,20],[20,1e9]];
  var lbls = ['< -20%','-20 a -10%','-10 a -5%','-5 a 0%','0 a 5%','5 a 10%','10 a 20%','> 20%'];
  var counts = bins.map(function() { return { n:0, contrib:0 }; });
  nonCash.forEach(function(d) {
    for (var i=0; i<bins.length; i++) {
      if (d.ret >= bins[i][0] && d.ret < bins[i][1]) { counts[i].n++; counts[i].contrib += d.contrib; break; }
    }
  });
  var maxN = Math.max.apply(null, counts.map(function(c){return c.n;})) || 1;
  var VW = 860, VH = 220, P = {t:20,r:20,b:60,l:44};
  var binW = (VW-P.l-P.r)/bins.length - 2;
  var svg = se('svg', { viewBox:'0 0 '+VW+' '+VH, style:'width:100%;height:auto;display:block' });
  counts.forEach(function(c, i) {
    var barH = Math.round(c.n / maxN * (VH-P.t-P.b));
    var x = P.l + i * ((VW-P.l-P.r)/bins.length) + 1;
    var y = VH-P.b-barH;
    var col = i < 4 ? '#9B2A20' : '#177A4E';
    var rect = se('rect', { x:x, y:y, width:binW, height:barH, rx:3, fill:col, opacity:'.75' });
    svg.appendChild(rect);
    bindTip(rect, lbls[i] + '<br>' + c.n + ' constituyentes<br>' +
      'Contribución total: ' + (c.contrib>=0?'+':'') + c.contrib.toFixed(3) + '%');
    // Count label
    if (c.n > 0) {
      var nt = se('text', {x:x+binW/2, y:y-4, 'text-anchor':'middle', 'font-family':'Inter,sans-serif', 'font-size':11, fill:'#2B3B4E', 'font-weight':'600'});
      nt.textContent = c.n; svg.appendChild(nt);
    }
    // X label
    var xt = se('text', {x:x+binW/2, y:VH-P.b+14, 'text-anchor':'middle', 'font-family':'Inter,sans-serif', 'font-size':9.5, fill:'#8A93A0'});
    xt.textContent = lbls[i]; svg.appendChild(xt);
    // Rotate long labels
    xt.setAttribute('transform', 'rotate(-35,' + (x+binW/2) + ',' + (VH-P.b+14) + ')');
    xt.setAttribute('text-anchor', 'end');
  });
  // Y axis ticks
  for (var g=0; g<=4; g++) {
    var yv = Math.round(g/4 * maxN);
    var yp = VH-P.b - Math.round(g/4*(VH-P.t-P.b));
    var yt = se('text', {x:P.l-4, y:yp+4, 'text-anchor':'end', 'font-family':'Inter,sans-serif', 'font-size':10, fill:'#8A93A0'});
    yt.textContent = yv; svg.appendChild(yt);
  }
  box.innerHTML = '';
  box.appendChild(svg);
  var leg = document.createElement('div');
  leg.style.cssText = 'font-size:11px;color:var(--mu);margin-top:6px';
  leg.textContent = 'Cada barra = número de constituyentes con retorno en ese rango. Hover para ver contribución total del grupo.';
  box.appendChild(leg);
}

// ── Winners vs Losers — Proposal C: top / bottom per sector ──────────────
function renderWLC() {
  var box = document.getElementById('ndx-wl-box');
  if (!box || !_securities.length) return;
  var nonCash = _securities.filter(function(d) { return d.sect !== CASH; });
  var secs = sectors.filter(function(s) { return s !== CASH; });
  var maxAbsC = Math.max.apply(null, nonCash.map(function(d){return Math.abs(d.contrib);})) || 1;

  function miniBars(pos, neg) {
    var col = pos >= 0 ? '#177A4E' : '#9B2A20';
    var nCol = neg <= 0 ? '#9B2A20' : '#177A4E';
    var pW = Math.round(Math.abs(pos)/maxAbsC*80);
    var nW = Math.round(Math.abs(neg)/maxAbsC*80);
    return '<div style="display:flex;flex-direction:column;gap:2px">' +
      '<div style="height:6px;width:'+pW+'px;background:'+col+';border-radius:2px;opacity:.8"></div>' +
      '<div style="height:6px;width:'+nW+'px;background:'+nCol+';border-radius:2px;opacity:.8"></div>' +
    '</div>';
  }

  var html = '<div class="twrap"><table class="rt">' +
    '<thead><tr>' +
    '<th>Sector</th>' +
    '<th>Mejor nombre</th><th class="num">Contribución</th>' +
    '<th>Peor nombre</th><th class="num">Contribución</th>' +
    '</tr></thead><tbody>';
  secs.forEach(function(sec) {
    var arr = nonCash.filter(function(d){return d.sect===sec;});
    if (!arr.length) return;
    var sorted = arr.slice().sort(function(a,b){return b.contrib-a.contrib;});
    var best = sorted[0], worst = sorted[sorted.length-1];
    var bc = (best.contrib>=0?'+':'')+best.contrib.toFixed(3)+'%';
    var wc = (worst.contrib>=0?'+':'')+worst.contrib.toFixed(3)+'%';
    html += '<tr>' +
      '<td style="font-weight:600;font-size:12px;color:var(--navy)">' + dispSec(sec) + '</td>' +
      '<td style="font-size:12px">' +
        '<b style="color:var(--navy)">' + best.name + '</b>' +
        '<span style="font-size:10px;color:var(--mu);margin-left:4px">' + trunc(best.co||'',22) + '</span>' +
      '</td>' +
      '<td class="num" style="color:var(--pos);font-weight:700">' + bc + '</td>' +
      '<td style="font-size:12px">' +
        '<b style="color:var(--navy)">' + worst.name + '</b>' +
        '<span style="font-size:10px;color:var(--mu);margin-left:4px">' + trunc(worst.co||'',22) + '</span>' +
      '</td>' +
      '<td class="num" style="color:var(--neg);font-weight:700">' + wc + '</td>' +
    '</tr>';
  });
  box.innerHTML = html + '</tbody></table></div>';
}

function renderWLSection() {
  var box = document.getElementById('ndx-wl-box');
  if (!box) return;
  if (_wlTab === 'A') renderWLA();
  else if (_wlTab === 'B') renderWLB();
  else renderWLC();
}

// ── Master refresh ────────────────────────────────────────────────────────
function refresh() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderKPI(res);
  if (attrMode === 'chart') renderAttrChart(res); else renderTreemap(res);
  renderAttrTable(res);
  _securities = computeSecurities(exclSecs, exclIGs);
  renderPareto(_securities);
  renderWLSection();
  renderScatter(_securities);
  renderBeeswarm(_securities, _beeswarmFilter);
}

function reloadSnapshot() {
  _activeHocs = getActiveHocs();
  if (!_activeHocs.length) return;
  if (_chart) { _chart.destroy(); _chart = null; }
  exclSecs.clear(); exclIGs.clear();
  sectors = []; igBySec = {}; igToSec = {};
  baseR = computeCore(new Set(), new Set());
  buildHierarchy(baseR);
  lockAxes(baseR);
  // Rebuild beeswarm sector select for the new year
  var beeSel = document.getElementById('ndx-bee-sec');
  if (beeSel) {
    beeSel.innerHTML = '<option value="">All</option>' +
      sectors.filter(function(s) { return s !== CASH; }).map(function(s) {
        return '<option value="' + esc(s) + '">' + dispSec(s) + '</option>';
      }).join('');
    beeSel.value = _beeswarmSector;
  }
  _securities = computeSecurities(new Set(), new Set());
  _secSnapshots = _activeHocs.map(function(_, i) {
    return computeSecurities(new Set(), new Set(), _activeHocs.slice(0, i + 1));
  });
  _scatterHocIdx  = _activeHocs.length - 1;
  _beeswarmHocIdx = _activeHocs.length - 1;

  // Precompute fixed scatter axes across all snapshots
  var allRets = [], allWts = [];
  _secSnapshots.forEach(function(snap) {
    snap.forEach(function(d) { if (d.w1 > 0 || d.w0 > 0) { allRets.push(d.ret); allWts.push(d.w1); } });
  });
  if (allRets.length) {
    var rng = Math.max.apply(null, allRets) - Math.min.apply(null, allRets);
    _scatterXLo = Math.min.apply(null, allRets) - rng * 0.05;
    _scatterXHi = Math.max.apply(null, allRets) + rng * 0.05;
    _scatterYHi = Math.max.apply(null, allWts) * 1.08;
  }

  refresh();
  renderDumbbell();
  var last = _activeHocs[_activeHocs.length - 1], first = _activeHocs[0];
  var endLabel = last.close || last.eff + ' (Open)';
  var el;
  el = document.getElementById('ndx-meta-period');
  if (el) el.textContent = 'HOC ' + first.n + ' → HOC ' + last.n + ' (' + endLabel + ')';
  el = document.getElementById('ndx-meta-nhocs');
  if (el) el.textContent = _activeHocs.length;
  el = document.getElementById('ndx-meta-const');
  if (el) el.textContent = first.sec.length + ' → ' + last.sec.length;
}

// ── Window handlers ───────────────────────────────────────────────────────
window.ndxToggleSec = function(sec) {
  if (exclSecs.has(sec)) { exclSecs.delete(sec); (igBySec[sec]||[]).forEach(function(g){ exclIGs.delete(g); }); }
  else { exclSecs.add(sec); (igBySec[sec]||[]).forEach(function(g){ exclIGs.add(g); }); }
  refresh();
};
window.ndxToggleIG = function(ig) {
  var sec = igToSec[ig];
  if (exclIGs.has(ig)) {
    exclIGs.delete(ig);
    if (exclSecs.has(sec) && !(igBySec[sec]||[]).every(function(g){ return exclIGs.has(g); })) exclSecs.delete(sec);
  } else {
    exclIGs.add(ig);
    if (sec && (igBySec[sec]||[]).every(function(g){ return exclIGs.has(g); })) exclSecs.add(sec);
  }
  refresh();
};
window.ndxResetSim = function() { exclSecs.clear(); exclIGs.clear(); refresh(); };
window.ndxToggleSecExpand = function(sec) {
  if (_expandedSecs.has(sec)) _expandedSecs.delete(sec); else _expandedSecs.add(sec);
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxExpandAll = function() {
  sectors.forEach(function(s) { _expandedSecs.add(s); });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxCollapseAll = function() {
  _expandedSecs.clear();
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxSetAttrTab = function(tab) {
  attrTab = tab;
  if (_chart) { _chart.destroy(); _chart = null; }
  document.querySelectorAll('#ndx-attr-tabs .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
  var sb = document.getElementById('ndx-treemap-sub-row');
  if (sb) sb.style.display = (attrMode === 'treemap' && tab === 'sector') ? '' : 'none';
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'chart') renderAttrChart(res); else renderTreemap(res);
  renderAttrTable(res);
};
window.ndxSetAttrMode = function(mode) {
  attrMode = mode;
  document.querySelectorAll('#ndx-attr-mode-btns .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.mode === mode); });
  var cb = document.getElementById('ndx-attr-chart-box'), tb = document.getElementById('ndx-treemap-box');
  var sb = document.getElementById('ndx-treemap-sub-row');
  if (cb) cb.style.display = mode === 'chart'   ? '' : 'none';
  if (tb) tb.style.display = mode === 'treemap' ? '' : 'none';
  if (sb) sb.style.display = (mode === 'treemap' && attrTab === 'sector') ? '' : 'none';
  var cr = document.getElementById('ndx-color-row');
  if (cr) cr.style.display = mode === 'treemap' ? 'flex' : 'none';
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (mode === 'chart') renderAttrChart(res); else renderTreemap(res);
};
window.ndxSort = function(key) {
  if (_sortKey === key) { _sortDir = -_sortDir; }
  else { _sortKey = key; _sortDir = key === 'name' ? 1 : -1; }
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxSetYear = function(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return;
  _activeYear = yr;
  _fromHoc = range[0]; _toHoc = range[1];
  _beeswarmSector = '';
  _scatterXLo = null; _scatterXHi = null; _scatterYHi = null;
  document.querySelectorAll('.ndx-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  reloadSnapshot();
};

window.ndxSetColorMode = function(m) {
  _colorMode = m;
  document.querySelectorAll('.ndx-color-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.mode === m);
  });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'treemap') renderTreemap(res);
  renderBeeswarm(_securities, _beeswarmFilter);
};

window.ndxSetRebalTab = function(t) {
  _rebalTab = t;
  document.querySelectorAll('.ndx-rebal-tab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.tab === t);
  });
  renderRebalSection();
};

window.ndxSetWLTab = function(t) {
  _wlTab = t;
  document.querySelectorAll('.ndx-wl-tab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.tab === t);
  });
  renderWLSection();
};

window.ndxSetParetoN = function(n) {
  _paretoN = parseInt(n, 10);
  document.querySelectorAll('.ndx-pareto-n-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.n, 10) === _paretoN);
  });
  renderPareto(_securities);
};
window.ndxSetFrom = function(n) {
  _fromHoc = parseInt(n, 10);
  if (_toHoc < _fromHoc) { _toHoc = _fromHoc; var ts = document.getElementById('ndx-to-sel'); if (ts) ts.value = n; }
  reloadSnapshot();
};
window.ndxSetTo = function(n) {
  _toHoc = parseInt(n, 10);
  if (_fromHoc > _toHoc) { _fromHoc = _toHoc; var fs = document.getElementById('ndx-from-sel'); if (fs) fs.value = n; }
  reloadSnapshot();
};

// ── Skeleton ──────────────────────────────────────────────────────────────
function hocOpts(sel) {
  return NDX_DATA.hocs.map(function(h) {
    return '<option value="' + h.n + '"' + (h.n === sel ? ' selected' : '') + '>' +
      'HOC ' + h.n + ' — ' + h.eff + (h.close ? '' : ' (Open)') + '</option>';
  }).join('');
}


function buildSkeleton() {
  var last  = _activeHocs[_activeHocs.length - 1];
  var first = _activeHocs[0];

  return (
  '<div id="ndx-tip" style="position:fixed;pointer-events:none;opacity:0;transition:opacity .09s;' +
  'background:var(--w,#fff);border:1px solid rgba(0,0,0,.1);border-radius:9px;' +
  'padding:8px 12px;font-size:12px;box-shadow:0 5px 18px rgba(0,0,0,.14);z-index:1999;max-width:260px;font-family:Inter,sans-serif"></div>' +

  '<div class="sec" style="padding-bottom:0">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-bottom:14px">' +
      '<div>' +
        '<div class="sect" style="font-size:17px;font-weight:700;color:var(--navy)">Nasdaq-100 — Return Attribution</div>' +
        '<div style="font-size:11px;color:var(--mu);margin-top:3px">NDX Price Return &middot; Source: Summit NDX NonBBG</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap">' +
        '<button class="ndx-yr-btn ndx-tab-btn active" data-yr="ytd2026" onclick="ndxSetYear(\'ytd2026\')">YTD 2026</button>' +
        '<button class="ndx-yr-btn ndx-tab-btn" data-yr="y2025" onclick="ndxSetYear(\'y2025\')">2025</button>' +
        '<button class="ndx-tab-btn" disabled style="opacity:.45;cursor:default">2024</button>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:24px;padding-bottom:14px;flex-wrap:wrap">' +
      '<div>' +
        '<div style="font-size:11px;color:var(--mu);font-weight:600;text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px">NDX Price Return</div>' +
        '<div class="ndx-hero-val" id="ndx-ytd-val">&mdash;</div>' +
      '</div>' +
      '<div id="ndx-sim-badge" style="display:none;font-size:11px;background:rgba(255,180,0,.1);border:1px solid rgba(200,160,0,.35);border-radius:20px;padding:4px 12px;color:#7A5A00"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr"><span class="sect">Attribution by Sector / Industry Group</span></div>' +
    '<div class="card">' +
      '<div class="ndx-attr-toolbar">' +
        '<div id="ndx-attr-tabs" style="display:flex;gap:3px">' +
          '<button class="ndx-tab-btn active" data-tab="sector" onclick="ndxSetAttrTab(\'sector\')">By Sector</button>' +
          '<button class="ndx-tab-btn" data-tab="ig" onclick="ndxSetAttrTab(\'ig\')">By Industry Group</button>' +
        '</div>' +
        '<div id="ndx-attr-mode-btns" style="display:flex;gap:3px">' +
          '<button class="ndx-tab-btn active" data-mode="chart" onclick="ndxSetAttrMode(\'chart\')">Chart</button>' +
          '<button class="ndx-tab-btn" data-mode="treemap" onclick="ndxSetAttrMode(\'treemap\')">Treemap</button>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-treemap-sub-row" style="display:none;margin:6px 0 2px">' +
        '<div style="display:flex;gap:3px">' +
          '<button class="ndx-tmsub-btn ndx-tab-btn active" data-sub="flat" onclick="ndxSetTreemapSubMode(\'flat\')">Flat Sectors</button>' +
          '<button class="ndx-tmsub-btn ndx-tab-btn" data-sub="nested" onclick="ndxSetTreemapSubMode(\'nested\')">Nested IGs</button>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-color-row" style="display:none;align-items:center;gap:8px;margin:6px 0 2px;padding:7px 10px;background:rgba(200,140,0,.06);border:1px solid rgba(200,140,0,.3);border-radius:8px">' +
        '<span style="font-size:10px;color:#8A5A00;font-weight:700;letter-spacing:.05em">PROPUESTA — COLOR:</span>' +
        '<button class="ndx-color-btn ndx-tab-btn active" data-mode="orig" onclick="ndxSetColorMode(\'orig\')">Original (√ global)</button>' +
        '<button class="ndx-color-btn ndx-tab-btn" data-mode="A" onclick="ndxSetColorMode(\'A\')">A — Escalas pos/neg separadas</button>' +
        '<button class="ndx-color-btn ndx-tab-btn" data-mode="B" onclick="ndxSetColorMode(\'B\')">B — Normalización local</button>' +
        '<button class="ndx-color-btn ndx-tab-btn" data-mode="C" onclick="ndxSetColorMode(\'C\')">C — Gradiente 0.65</button>' +
      '</div>' +
      '<div id="ndx-attr-chart-box" style="position:relative;height:420px"><canvas id="ndx-attr-canvas"></canvas></div>' +
      '<div id="ndx-treemap-box" style="display:none;padding:4px 0"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div>' +
          '<span class="sect">Attribution Detail &amp; Simulation</span>' +
          '<span class="secn" style="display:block;margin-top:2px">Click any row to include / exclude &middot; weights rescale to 100% within each HOC &middot; YTD updates in real time</span>' +
        '</div>' +
        '<div style="display:flex;gap:5px;align-items:center">' +
          '<button class="ndx-tab-btn" onclick="ndxExpandAll()">Expand All</button>' +
          '<button class="ndx-tab-btn" onclick="ndxCollapseAll()">Collapse All</button>' +
          '<button class="sb-tbtn" onclick="ndxResetSim()">Reset</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<table class="rt" style="width:100%">' +
        '<thead><tr>' +
          '<th style="width:28px"></th>' +
          '<th onclick="ndxSort(\'name\')" style="cursor:pointer;user-select:none">Sector / Industry Group<span id="ndx-sort-name" style="color:var(--mu)"></span></th>' +
          '<th class="num">Stocks</th>' +
          '<th class="num" onclick="ndxSort(\'weight\')" style="cursor:pointer;user-select:none">Weight<span id="ndx-sort-weight" style="color:var(--mu)"></span></th>' +
          '<th class="num" onclick="ndxSort(\'contrib\')" style="cursor:pointer;user-select:none">Contribution<span id="ndx-sort-contrib" style="color:var(--mu)"> ▼</span></th>' +
        '</tr></thead>' +
        '<tbody id="ndx-attr-tbody"></tbody>' +
      '</table>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Index Composition — Weight Change</span>' +
      '<span class="secn">Open weight (hollow) vs. close weight (solid) by sector. Ordered by opening weight.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-dumbbell-box"></div></div>' +
  '</div>' +

  '<div class="sec" style="border:1.5px dashed rgba(200,140,0,.4);border-radius:12px;padding:16px">' +
    '<div class="sechdr" style="padding-top:0">' +
      '<span class="sect">Rebalance Impact</span>' + PROP_BADGE +
      '<span class="secn" style="display:block;margin-top:3px">Tres vistas del efecto de los rebalanceos. Elige la que más info aporte.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;gap:4px;margin-bottom:12px">' +
        '<button class="ndx-rebal-tab ndx-tab-btn active" data-tab="A" onclick="ndxSetRebalTab(\'A\')">A — Eventos por HOC</button>' +
        '<button class="ndx-rebal-tab ndx-tab-btn" data-tab="B" onclick="ndxSetRebalTab(\'B\')">B — Buy-and-hold vs. real</button>' +
        '<button class="ndx-rebal-tab ndx-tab-btn" data-tab="C" onclick="ndxSetRebalTab(\'C\')">C — Concentración HHI</button>' +
      '</div>' +
      '<div id="ndx-rebal-box"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Top Contributors</span>' +
      '<span class="secn">Securities ranked by |contribution|. Bars sized by absolute contribution.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-pareto-box"></div></div>' +
  '</div>' +

  '<div class="sec" style="border:1.5px dashed rgba(200,140,0,.4);border-radius:12px;padding:16px">' +
    '<div class="sechdr" style="padding-top:0">' +
      '<span class="sect">Winners vs Losers</span>' + PROP_BADGE +
      '<span class="secn" style="display:block;margin-top:3px">Tres vistas del breakdown de performance. Elige la que más info aporte.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;gap:4px;margin-bottom:12px">' +
        '<button class="ndx-wl-tab ndx-tab-btn" data-tab="A" onclick="ndxSetWLTab(\'A\')">A — Matriz sectorial</button>' +
        '<button class="ndx-wl-tab ndx-tab-btn" data-tab="B" onclick="ndxSetWLTab(\'B\')">B — Histograma de retornos</button>' +
        '<button class="ndx-wl-tab ndx-tab-btn active" data-tab="C" onclick="ndxSetWLTab(\'C\')">C — Top/Bottom por sector</button>' +
      '</div>' +
      '<div id="ndx-wl-box"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Security Return vs. Weight Scatter</span>' +
      '<span class="secn">Each dot = one constituent. X = compounded return, Y = closing weight, bubble area ∝ √|contribution|. Top 10 labeled.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-scatter-box"></div></div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Security Contributions — Beeswarm by Sector</span>' +
      '<span class="secn">One dot per constituent. X = Carino-linked contribution. Lane = sector.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="font-size:11px;color:var(--mu);font-weight:600">Sector</span>' +
          '<select id="ndx-bee-sec" onchange="ndxSetBeeswarmSector(this.value)" style="font-family:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:5px 10px;background:var(--w);color:var(--text);cursor:pointer">' +
            '<option value="">All</option>' +
            sectors.filter(function(s) { return s !== CASH; }).map(function(s) {
              return '<option value="' + esc(s) + '">' + dispSec(s) + '</option>';
            }).join('') +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-beeswarm-box"></div>' +
    '</div>' +
  '</div>'
  );
}

// ── Entry point ───────────────────────────────────────────────────────────
export function loadNdxAttribution(container) {
  sectors = []; igBySec = {}; igToSec = {};
  _snap0 = {}; _snapN = {};
  exclSecs = new Set(); exclIGs = new Set();
  attrTab = 'sector'; attrMode = 'chart';
  _sortKey = 'contrib'; _sortDir = -1;
  _fromHoc = 12; _toHoc = 25;
  _beeswarmFilter = 0; _securities = [];
  treemapSubMode = 'flat';
  _scatterHocIdx = -1; _beeswarmHocIdx = -1; _secSnapshots = [];
  _expandedSecs = new Set();
  _scatterXLo = null; _scatterXHi = null; _scatterYHi = null;
  _beeswarmSector = '';
  _activeYear = 'ytd2026';
  _paretoN = 10;
  _colorMode = 'orig';
  _colorMaxPos = 0; _colorMaxNeg = 0;
  _rebalTab = 'A'; _wlTab = 'C';
  if (_chart) { _chart.destroy(); _chart = null; }

  normalize();
  _activeHocs = getActiveHocs();
  baseR = computeCore(new Set(), new Set());
  buildHierarchy(baseR);
  lockAxes(baseR);
  _securities = computeSecurities(new Set(), new Set());
  _secSnapshots = _activeHocs.map(function(_, i) {
    return computeSecurities(new Set(), new Set(), _activeHocs.slice(0, i + 1));
  });
  _scatterHocIdx  = _activeHocs.length - 1;
  _beeswarmHocIdx = _activeHocs.length - 1;

  // Fixed scatter axes across all snapshots
  var allRets2 = [], allWts2 = [];
  _secSnapshots.forEach(function(snap) {
    snap.forEach(function(d) { if (d.w1 > 0 || d.w0 > 0) { allRets2.push(d.ret); allWts2.push(d.w1); } });
  });
  if (allRets2.length) {
    var rng2 = Math.max.apply(null, allRets2) - Math.min.apply(null, allRets2);
    _scatterXLo = Math.min.apply(null, allRets2) - rng2 * 0.05;
    _scatterXHi = Math.max.apply(null, allRets2) + rng2 * 0.05;
    _scatterYHi = Math.max.apply(null, allWts2) * 1.08;
  }

  container.innerHTML = buildSkeleton();
  renderKPI(baseR);
  renderAttrChart(baseR);
  renderAttrTable(baseR);
  renderDumbbell();
  renderRebalSection();
  renderPareto(_securities);
  renderWLSection();
  renderScatter(_securities);
  renderBeeswarm(_securities, 0);
}
