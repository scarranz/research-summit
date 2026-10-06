// ndx-attribution.js — NDX 100 Return Attribution (Carino linking)
import { NDX_DATA } from './ndx-attribution-data.js';

const CASH       = 'Cash, Derivatives and Other Securities'; // data key — do not change
const CASH_LABEL = 'Cash & Futures';                        // display label

var sectors     = [];
var igBySec     = {};
var igToSec     = {};
var exclSecs    = new Set();
var exclIGs     = new Set();
var baseR       = null;
var _chart      = null;
var _chartFull  = [];  // full names for chart tooltip (parallel to chart data)
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

// Carino-linked attribution: contributions sum exactly to total R
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
  return { bySec: bySec, byIG: byIG, ytd: ytd, hocResults: hocResults };
}

// ── Helpers ────────────────────────────────────────────────────────────────
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

// chart axis label: truncated to single line
function chartLbl(s, isIG) {
  var d = isIG ? dispIG(s) : dispSec(s);
  return trunc(d, isIG ? 36 : 28);
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
            // Full name in tooltip — never truncated
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

// ── Squarified treemap ────────────────────────────────────────────────────
// Recursive squarify: items sorted desc by area, each gets rx/ry/rw/rh
function squarify(items, x, y, W, H) {
  if (!items.length || W <= 0 || H <= 0) return;
  if (items.length === 1) {
    items[0].rx = x; items[0].ry = y; items[0].rw = W; items[0].rh = H;
    return;
  }
  var isH = W >= H;
  var fixD = isH ? H : W;
  var split = 1, prevAR = Infinity;
  var rowA = 0;
  for (var i = 0; i < items.length; i++) {
    rowA += items[i].area;
    var sw = rowA / fixD;
    var ar = 0;
    for (var j = 0; j <= i; j++) {
      var cd = items[j].area / sw;
      ar = Math.max(ar, Math.max(sw / cd, cd / sw));
    }
    if (ar > prevAR && i > 0) break;
    prevAR = ar; split = i + 1;
  }
  var strip = items.slice(0, split), rest = items.slice(split);
  rowA = strip.reduce(function(a, it) { return a + it.area; }, 0);
  var sw = rowA / fixD, pos = isH ? y : x;
  for (var i = 0; i < strip.length; i++) {
    var cd = strip[i].area / sw;
    if (isH) { strip[i].rx = x;   strip[i].ry = pos; strip[i].rw = sw; strip[i].rh = cd; }
    else      { strip[i].rx = pos; strip[i].ry = y;   strip[i].rw = cd; strip[i].rh = sw; }
    pos += cd;
  }
  if (rest.length) {
    if (isH) squarify(rest, x + sw, y, W - sw, H);
    else     squarify(rest, x, y + sw, W, H - sw);
  }
}

function tmColor(c, excl, maxC, minC) {
  if (excl) return '#C8D6E0';
  if (Math.abs(c) < 0.002) return '#B8C8D4';
  if (c > 0) {
    var t = maxC > 0 ? Math.min(1, c / maxC) : 0;
    return 'hsl(145,' + Math.round(42 + t*50) + '%,' + Math.round(80 - t*48) + '%)';
  }
  var t = minC < 0 ? Math.min(1, Math.abs(c) / Math.abs(minC)) : 0;
  return 'hsl(4,' + Math.round(42 + t*50) + '%,' + Math.round(80 - t*40) + '%)';
}

function renderTreemap(res) {
  var box = document.getElementById('ndx-treemap-box');
  if (!box) return;
  var isIG = attrTab === 'ig';
  var TM_W = box.offsetWidth || 860;
  var TM_H = 400;

  var items = [];
  if (!isIG) {
    sectors.forEach(function(s) {
      var w = (_snapN[s]||{w:0}).w;
      if (w <= 0) return; // skip zero-weight sectors (Real Estate gone)
      items.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0,
        excl: exclSecs.has(s), fn: 'ndxToggleSec' });
    });
  } else {
    sectors.forEach(function(s) {
      (igBySec[s]||[]).forEach(function(g) {
        var w = (_snapN['ig:'+g]||{w:0}).w;
        if (w <= 0) return;
        items.push({ key: g, label: dispIG(g), w: w, c: res.byIG[g]||0,
          excl: exclSecs.has(s)||exclIGs.has(g), fn: 'ndxToggleIG' });
      });
    });
  }

  // Sort by weight desc (squarify works best this way)
  items.sort(function(a, b) {
    if (a.key === CASH) return 1; if (b.key === CASH) return -1;
    return b.w - a.w;
  });

  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 100;
  var maxC = Math.max.apply(null, items.map(function(x) { return x.c; }).concat(0));
  var minC = Math.min.apply(null, items.map(function(x) { return x.c; }).concat(0));

  // Assign pixel area proportional to weight
  items.forEach(function(it) { it.area = (it.w / totalW) * TM_W * TM_H; });

  // Run squarify to get rx/ry/rw/rh for each item
  squarify(items, 0, 0, TM_W, TM_H);

  var html = '<div style="position:relative;width:' + TM_W + 'px;height:' + TM_H + 'px">';
  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var bg  = tmColor(item.c, item.excl, maxC, minC);
    var isDark = !item.excl && (item.c > maxC * 0.35 || (minC < 0 && item.c < minC * 0.35));
    var tc = isDark ? '#fff' : '#1E2D3D';
    var ts = isDark ? '0 1px 2px rgba(0,0,0,.5)' : 'none';

    var rw = Math.max(2, item.rw - 2), rh = Math.max(2, item.rh - 2);
    var showName = rw > 42 && rh > 26;
    var showVal  = rw > 38 && rh > 46;
    var nameFs = Math.min(16, Math.max(9, Math.min(rw, rh) / 5.5));
    var valFs  = Math.min(13, Math.max(8,  Math.min(rw, rh) / 7));

    // Label: truncate to fit estimated single line
    var maxChars = Math.floor(rw / (nameFs * 0.58));
    var label = item.label.length > maxChars ? item.label.slice(0, maxChars - 1) + '…' : item.label;

    html += '<div onclick="' + item.fn + '(\'' + esc(item.key) + '\')" ' +
      'title="' + dispSec(item.key) + ': ' + (item.c>=0?'+':'') + item.c.toFixed(4) + '% contribution · ' + item.w.toFixed(2) + '% weight" ' +
      'style="position:absolute;left:' + Math.round(item.rx) + 'px;top:' + Math.round(item.ry) + 'px;' +
      'width:' + Math.round(rw) + 'px;height:' + Math.round(rh) + 'px;background:' + bg + ';' +
      'border-radius:2px;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;' +
      'align-items:center;justify-content:center;' +
      'border:1.5px solid rgba(255,255,255,.55);opacity:' + (item.excl ? '.38' : '1') + ';' +
      'box-sizing:border-box">';
    if (showName) {
      html += '<span style="color:' + tc + ';font-size:' + nameFs.toFixed(1) + 'px;font-weight:700;' +
        'text-align:center;padding:0 4px;line-height:1.2;max-width:100%;overflow:hidden;' +
        'text-overflow:ellipsis;white-space:nowrap;text-shadow:' + ts + '">' + label + '</span>';
    }
    if (showVal) {
      html += '<span style="color:' + tc + ';font-size:' + valFs.toFixed(1) + 'px;opacity:.9;' +
        'margin-top:2px;text-shadow:' + ts + '">' + (item.c>=0?'+':'') + item.c.toFixed(2) + '%</span>';
    }
    html += '</div>';
  });

  html += '</div>' +
    '<div style="font-size:10px;color:var(--mu);margin-top:5px;padding:0 1px">' +
    'Size = index weight &nbsp;·  ' +
    '<span style="color:hsl(145,65%,38%);font-weight:600">■</span> positive &nbsp;' +
    '<span style="color:hsl(4,65%,48%);font-weight:600">■</span> negative contribution &nbsp;·  Click to toggle' +
    '</div>';

  box.innerHTML = html;
}

// Scaled display weights from the last active HOC under current exclusions
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

// ── Attribution + Simulation table ────────────────────────────────────────
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

  // Sort always by BASE contributions so toggling on/off doesn't shuffle rows
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
      '<td class="num" style="color:' + colr(h.ret) + ';font-weight:600">' + (h.ret>=0?'+':'') + h.ret.toFixed(4) + '%</td></tr>';
  }).join('');
}

// ── Master refresh ────────────────────────────────────────────────────────
function refresh() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderKPI(res);
  if (attrMode === 'chart') renderAttrChart(res); else renderTreemap(res);
  renderAttrTable(res);
  renderHOC(res);
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
  refresh();
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

function buildSkeleton() {
  var last  = _activeHocs[_activeHocs.length - 1];
  var first = _activeHocs[0];
  var nHocs = _activeHocs.length;
  var endLabel = last.close || last.eff + ' (Open)';
  var ss = 'font-family:\'Inter\',sans-serif;font-size:11px;font-weight:600;border:1.5px solid var(--bdr);border-radius:10px;padding:4px 9px;background:var(--w);color:var(--navy);cursor:pointer;outline:none;min-width:230px';

  return (
  '<div class="sec" style="padding-bottom:0">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;padding-bottom:14px">' +
      '<div>' +
        '<div class="sect" style="font-size:17px;font-weight:700;color:var(--navy)">NDX 100 — Return Attribution</div>' +
        '<div style="font-size:11px;color:var(--mu);margin-top:3px">NDX Price Return &middot; Source: Summit NDX NonBBG</div>' +
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
          '<span class="secn" style="display:block;margin-top:2px">Click any row to include / exclude &middot; weights rescale to 100% within each HOC &middot; YTD updates in real time</span>' +
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
  _fromHoc = 7; _toHoc = NDX_DATA.hocs[NDX_DATA.hocs.length - 1].n;
  if (_chart) { _chart.destroy(); _chart = null; }

  normalize();
  _activeHocs = getActiveHocs();
  baseR = computeCore(new Set(), new Set());
  buildHierarchy(baseR);
  lockAxes(baseR);

  container.innerHTML = buildSkeleton();
  renderKPI(baseR);
  renderAttrChart(baseR);
  renderAttrTable(baseR);
  renderHOC(baseR);
}
