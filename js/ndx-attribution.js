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
var _fromHoc    = 7;
var _toHoc      = 19;
var _activeHocs = [];
var _securities = [];
var _beeswarmFilter = 0;

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
function computeSecurities(exS, exG) {
  var hocMeta = [], logSumTotal = 0;
  _activeHocs.forEach(function(hoc) {
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

  // Build closing-weight lookup from last active HOC
  var lastHoc = _activeHocs[_activeHocs.length - 1];
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
function contribColor(v, maxAbs) {
  if (!maxAbs || maxAbs < 1e-9) return '#EDECEA';
  var t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
  var idx = Math.min(4, Math.floor(t * 5));
  return v >= 0 ? POS_RAMP[idx] : NEG_RAMP[idx];
}
function contribFg(v, maxAbs) {
  if (!maxAbs || maxAbs < 1e-9) return '#1E2D3D';
  var t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
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
  el.innerHTML = '<span style="color:' + colr(res.ytd) + '">' + fmtYTD(res.ytd) + '</span>';
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

// ── SVG Treemap (color by contribution) ──────────────────────────────────
function renderTreemap(res) {
  var box = document.getElementById('ndx-treemap-box');
  if (!box) return;
  var VW = 900, VH = 370;
  var items = [];
  sectors.forEach(function(s) {
    var w = (_snapN[s]||{w:0}).w;
    if (w < 0.001) return;
    items.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0, excl: exclSecs.has(s) });
  });
  items.sort(function(a, b) {
    if (a.key === CASH) return 1; if (b.key === CASH) return -1;
    return b.w - a.w;
  });
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 100;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);

  // max abs contribution for color scaling (exclude Cash)
  var maxAbsC = Math.max.apply(null, items.filter(function(it) { return it.key !== CASH; }).map(function(it) { return Math.abs(it.c); })) || 1;

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });

  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:pointer' });
    var alpha = item.excl ? 0.35 : 1;

    var fillC  = item.excl ? '#D0D4D8' : contribColor(item.c, maxAbsC);
    var fgC    = item.excl ? '#6A7888' : contribFg(item.c, maxAbsC);
    // Stroke = slightly darker than fill (derived from ramp direction)
    var strokeC = item.excl ? '#9AAAB8' : (item.c >= 0 ? '#177A4E' : '#9B2A20');

    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 4,
      fill: fillC, stroke: strokeC, 'stroke-opacity': item.excl ? 0.25 : 0.55,
      'stroke-width': 1, opacity: alpha }));

    if (rw > 50 && rh > 28) {
      var fs = Math.min(14, Math.max(9, Math.min(rw, rh) / 6));
      var lines = wrapWords(item.label, rw - 14, fs);
      var lineH = fs * 1.3;
      var totalH = lines.length * lineH;
      var showC = rh > totalH + fs * 2.2;
      var startY = showC
        ? ry + rh / 2 - (totalH + fs * 1.6) / 2 + fs * 0.82
        : ry + rh / 2 - totalH / 2 + fs * 0.82;

      lines.forEach(function(line, li) {
        var t = se('text', { x: rx + rw / 2, y: startY + li * lineH,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': fs, 'font-weight': '700', fill: fgC });
        t.textContent = line;
        g.appendChild(t);
      });
      if (showC) {
        var cfs = Math.max(8, fs - 2);
        var ct = se('text', { x: rx + rw / 2, y: startY + lines.length * lineH + cfs * 0.9,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': cfs, fill: fgC, opacity: '0.88' });
        ct.textContent = (item.c >= 0 ? '+' : '') + item.c.toFixed(2) + '%';
        g.appendChild(ct);
      }
    }

    var tipC = (item.c >= 0 ? '+' : '') + item.c.toFixed(4) + '%';
    bindTip(g,
      '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + item.w.toFixed(3) + '%' +
      '<br>Contribution: ' + tipC +
      '<br><em style="color:#898781">Click to see industry groups</em></span>');

    if (item.key !== CASH) {
      g.setAttribute('onclick', 'ndxShowIGModal(\'' + esc(item.key) + '\')');
    }
    svg.appendChild(g);
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:5px;flex-wrap:wrap';
  legend.innerHTML =
    '<span>Area = index weight at close</span>' +
    '<span style="color:#177A4E;font-weight:600">█</span> Positive contribution &nbsp;' +
    '<span style="color:#9B2A20;font-weight:600">█</span> Negative &nbsp;' +
    'Intensity ∝ √|contribution| &nbsp;&middot;&nbsp; Click sector for industry group detail';
  box.innerHTML = '';
  box.appendChild(svg);
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
      html += '<tr style="background:var(--surface);' + (secExcl?'opacity:.42;':'') + 'cursor:pointer" onclick="ndxToggleSec(\'' + esc(s) + '\')">' +
        '<td style="width:28px;text-align:center;padding:6px 4px">' + dot(!secExcl, 16) + '</td>' +
        '<td style="font-weight:700;color:var(--navy)">' + dispSec(s) + '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + so.count + ' → ' + sn.count + '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + fmtW(dw.sec[s], secExcl) + '</td>' +
        '<td class="num" style="font-weight:700">' + fmtC(res.bySec[s]||0) + '</td></tr>';
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
    });
  }
  html += '<tr style="border-top:2px solid var(--navy);font-weight:700">' +
    '<td></td><td colspan="3" style="color:var(--navy)">Total</td>' +
    '<td class="num" style="color:' + colr(res.ytd) + ';font-weight:700">' + fmtYTD(res.ytd) + '</td></tr>';
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
    vt.textContent = (r.c >= 0 ? '+' : '') + r.c.toFixed(4) + '%'; g.appendChild(vt);
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
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + POS_RAMP[3] + ';margin-right:5px;vertical-align:-1px"></span>Positive</span>' +
    '<span style="color:var(--mu)">Intensity ∝ √|contribution|</span>';
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
    var vt = se('text', { x: VW - P.r + 16, y: y + 4, 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-variant-numeric': 'tabular-nums' });
    vt.textContent = r.w0.toFixed(1) + ' → ' + r.w1.toFixed(1) + '   ' + (diff >= 0 ? '+' : '') + diff.toFixed(2);
    g.appendChild(vt);
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
  var xLo = Math.min.apply(null, xs), xHi = Math.max.apply(null, xs);
  var yHi = Math.max.apply(null, ys) * 1.06;
  var xPad = (xHi - xLo) * 0.04;
  xLo -= xPad; xHi += xPad;

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

  var secList = sectors.filter(function(s) { return s !== CASH; });
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

// ── Master refresh ────────────────────────────────────────────────────────
function refresh() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderKPI(res);
  if (attrMode === 'chart') renderAttrChart(res); else renderTreemap(res);
  renderAttrTable(res);
  renderHOC(res);
  renderDotPlotIG(res);
  _securities = computeSecurities(exclSecs, exclIGs);
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
  _securities = computeSecurities(new Set(), new Set());
  refresh();
  renderHeatmap();
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
window.ndxSetAttrTab = function(tab) {
  attrTab = tab;
  if (_chart) { _chart.destroy(); _chart = null; }
  document.querySelectorAll('#ndx-attr-tabs .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'chart') renderAttrChart(res); else renderTreemap(res);
  renderAttrTable(res);
};
window.ndxSetAttrMode = function(mode) {
  attrMode = mode;
  document.querySelectorAll('#ndx-attr-mode-btns .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.mode === mode); });
  var cb = document.getElementById('ndx-attr-chart-box'), tb = document.getElementById('ndx-treemap-box');
  if (cb) cb.style.display = mode === 'chart'   ? '' : 'none';
  if (tb) tb.style.display = mode === 'treemap' ? '' : 'none';
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
window.ndxSetYTD2026 = function() {
  _fromHoc = 7; _toHoc = 19;
  var fs = document.getElementById('ndx-from-sel'), ts = document.getElementById('ndx-to-sel');
  if (fs) fs.value = '7'; if (ts) ts.value = '19';
  reloadSnapshot();
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

function beeswarmFilterBar() {
  var thrs = [0, 0.02, 0.05, 0.1];
  var lbls = ['Show all', '|±0.02%|', '|±0.05%|', '|±0.1%|'];
  return '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">' +
    thrs.map(function(t, i) {
      return '<button class="ndx-bee-btn ndx-tab-btn' + (t === 0 ? ' active' : '') + '" ' +
        'data-thr="' + t + '" onclick="ndxSetBeeswarmFilter(' + t + ')">' + lbls[i] + '</button>';
    }).join('') +
    '</div>';
}

function buildSkeleton() {
  var last  = _activeHocs[_activeHocs.length - 1];
  var first = _activeHocs[0];
  var nHocs = _activeHocs.length;
  var endLabel = last.close || last.eff + ' (Open)';
  var ss = 'font-family:\'Inter\',sans-serif;font-size:11px;font-weight:600;border:1.5px solid var(--bdr);border-radius:10px;padding:4px 9px;background:var(--w);color:var(--navy);cursor:pointer;outline:none;min-width:230px';

  return (
  '<div id="ndx-tip" style="position:fixed;pointer-events:none;opacity:0;transition:opacity .09s;' +
  'background:var(--w,#fff);border:1px solid rgba(0,0,0,.1);border-radius:9px;' +
  'padding:8px 12px;font-size:12px;box-shadow:0 5px 18px rgba(0,0,0,.14);z-index:1999;max-width:260px;font-family:Inter,sans-serif"></div>' +

  '<div class="sec" style="padding-bottom:0">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;padding-bottom:14px">' +
      '<div>' +
        '<div class="sect" style="font-size:17px;font-weight:700;color:var(--navy)">NDX 100 — Return Attribution</div>' +
        '<div style="font-size:11px;color:var(--mu);margin-top:3px">NDX Price Return · Source: Summit NDX NonBBG</div>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">' +
        '<button class="ndx-tab-btn active" onclick="ndxSetYTD2026()">YTD 2026</button>' +
        '<div style="display:flex;align-items:center;gap:5px">' +
          '<span style="font-size:11px;color:var(--mu);font-weight:600">From</span>' +
          '<select id="ndx-from-sel" onchange="ndxSetFrom(this.value)" style="' + ss + '">' + hocOpts(_fromHoc) + '</select>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:5px">' +
          '<span style="font-size:11px;color:var(--mu);font-weight:600">To</span>' +
          '<select id="ndx-to-sel" onchange="ndxSetTo(this.value)" style="' + ss + '">' + hocOpts(_toHoc) + '</select>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="ndx-hero-row">' +
      '<div class="ndx-hero-main">' +
        '<div class="ndx-hero-label">NDX Price Return</div>' +
        '<div class="ndx-hero-val" id="ndx-ytd-val">&mdash;</div>' +
        '<div id="ndx-sim-badge" style="display:none;margin-top:6px;font-size:11px;background:rgba(255,180,0,.1);border:1px solid rgba(200,160,0,.35);border-radius:20px;padding:3px 10px;color:#7A5A00"></div>' +
      '</div>' +
      '<div class="ndx-hero-meta">' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">Period</div>' +
          '<div class="ndx-meta-val" id="ndx-meta-period" style="font-size:13px">HOC ' + first.n + ' → HOC ' + last.n + ' (' + endLabel + ')</div>' +
        '</div>' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">HOCs</div>' +
          '<div class="ndx-meta-val" id="ndx-meta-nhocs">' + nHocs + '</div>' +
          '<div class="ndx-meta-sub">Rebalances &amp; index events</div>' +
        '</div>' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">Constituents</div>' +
          '<div class="ndx-meta-val" id="ndx-meta-const">' + first.sec.length + ' → ' + last.sec.length + '</div>' +
          '<div class="ndx-meta-sub">Open → Close snapshot</div>' +
        '</div>' +
      '</div>' +
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
      '<div id="ndx-attr-chart-box" style="position:relative;height:420px"><canvas id="ndx-attr-canvas"></canvas></div>' +
      '<div id="ndx-treemap-box" style="display:none;padding:4px 0"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div>' +
          '<span class="sect">Attribution Detail &amp; Simulation</span>' +
          '<span class="secn" style="display:block;margin-top:2px">Click any row to include / exclude · weights rescale to 100% within each HOC · YTD updates in real time</span>' +
        '</div>' +
        '<button class="sb-tbtn" onclick="ndxResetSim()">Reset</button>' +
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
      '<span class="sect">Industry Group Contributions</span>' +
      '<span class="secn">All industry groups ranked by Carino-linked contribution.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-dotplot-box"></div></div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Sector × HOC Window Heatmap</span>' +
      '<span class="secn">Contribution per sector per HOC window. Base case only — reveals which sectors drove each window.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-heatmap-box"></div></div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Index Composition — Weight Change</span>' +
      '<span class="secn">Open weight (hollow) vs. close weight (solid) by sector. Ordered by opening weight.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-dumbbell-box"></div></div>' +
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
      '<span class="secn">One dot per constituent. X = Carino-linked contribution. Lane = sector. Noise filter hides small contributors.</span>' +
    '</div>' +
    '<div class="card">' +
      beeswarmFilterBar() +
      '<div id="ndx-beeswarm-box"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">HOC Timeline</span>' +
      '<span class="secn">Each HOC: start date, end date, constituent count and period return</span>' +
    '</div>' +
    '<div class="card">' +
      '<div class="twrap"><table class="rt">' +
        '<thead><tr>' +
          '<th style="text-align:center">HOC</th><th>Start Date</th><th>End Date</th>' +
          '<th class="num">Constituents</th><th class="num">Period Return</th>' +
        '</tr></thead>' +
        '<tbody id="ndx-hoc-tbody"></tbody>' +
      '</table></div>' +
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
  _fromHoc = 7; _toHoc = 19;
  _beeswarmFilter = 0; _securities = [];
  if (_chart) { _chart.destroy(); _chart = null; }

  normalize();
  _activeHocs = getActiveHocs();
  baseR = computeCore(new Set(), new Set());
  buildHierarchy(baseR);
  lockAxes(baseR);
  _securities = computeSecurities(new Set(), new Set());

  container.innerHTML = buildSkeleton();
  renderKPI(baseR);
  renderAttrChart(baseR);
  renderAttrTable(baseR);
  renderHOC(baseR);
  renderDotPlotIG(baseR);
  renderHeatmap();
  renderDumbbell();
  renderScatter(_securities);
  renderBeeswarm(_securities, 0);
}
