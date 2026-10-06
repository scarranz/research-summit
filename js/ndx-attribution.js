// ndx-attribution.js — NDX 100 Return Attribution
// w = col N weight (Weight for Sector, % scale); r = return (decimal)
import { NDX_DATA } from './ndx-attribution-data.js';

const CASH = 'Cash, Derivatives and Other Securities';

// ── Module state ──────────────────────────────────────────────────────────────
var sectors     = [];
var igBySec     = {};
var igToSec     = {};
var exclSecs    = new Set();
var exclIGs     = new Set();
var baseR       = null;
var _chart      = null;
var attrTab     = 'sector';
var attrMode    = 'chart';
var _snap0      = {};
var _snapN      = {};
var _axisSecMin = 0, _axisSecMax = 0;
var _axisIGMin  = 0, _axisIGMax  = 0;
var _sortKey    = 'contrib';
var _sortDir    = -1;
var _snapId     = 'ytd2026';
var _activeHocs = [];

var SNAPSHOTS = {
  ytd2026: {
    label: 'YTD 2026',
    sub: 'Dec 31, 2025 → Sep 22, 2026 (Open)',
    filter: function(hoc) { return hoc.n >= 7; }
  }
};

function getActiveHocs() {
  return NDX_DATA.hocs.filter(SNAPSHOTS[_snapId].filter);
}

// ── 1. Normalize missing/NA values → CASH ────────────────────────────────────
function normalize() {
  NDX_DATA.hocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      var badSec = !s.s || !s.s.trim() || /^[#]?n\/?a$/i.test(s.s.trim());
      var badIG  = !s.g || !s.g.trim() || /^[#]?n\/?a$/i.test(s.g.trim());
      if (badSec) s.s = CASH;
      if (badIG)  s.g = CASH;
      if (s.s === CASH) s.g = CASH;
    });
  });
}

// ── 2. Build hierarchy from active HOCs ──────────────────────────────────────
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
    if (a === CASH) return 1;
    if (b === CASH) return -1;
    return (init.bySec[b] || 0) - (init.bySec[a] || 0);
  });

  sectors.forEach(function(s) {
    igBySec[s] = Array.from(igMap[s] || []).sort(function(a, b) {
      return (init.byIG[b] || 0) - (init.byIG[a] || 0);
    });
  });

  // Snapshots for first and last active HOCs
  var first = _activeHocs[0];
  var last  = _activeHocs[_activeHocs.length - 1];
  _snap0 = {}; _snapN = {};
  [first, last].forEach(function(hoc, idx) {
    var snap = idx === 0 ? _snap0 : _snapN;
    hoc.sec.forEach(function(s) {
      if (!snap[s.s])       snap[s.s]       = { count: 0, w: 0 };
      if (!snap['ig:'+s.g]) snap['ig:'+s.g] = { count: 0, w: 0 };
      snap[s.s].count++;        snap[s.s].w       += (s.w || 0);
      snap['ig:'+s.g].count++;  snap['ig:'+s.g].w += (s.w || 0);
    });
  });
}

// ── 3. Lock chart axes from base case ────────────────────────────────────────
function lockAxes(res) {
  function range(vals) {
    var mn = Math.min.apply(null, vals.concat(0));
    var mx = Math.max.apply(null, vals.concat(0));
    var pad = Math.max(Math.abs(mx - mn) * 0.1, 0.05);
    return { min: mn - pad, max: mx + pad };
  }
  var secVals = sectors.map(function(s) { return res.bySec[s] || 0; });
  var secArith = secVals.reduce(function(a, v) { return a + v; }, 0);
  secVals.push(res.ytd - secArith);
  var sr = range(secVals);
  _axisSecMin = sr.min; _axisSecMax = sr.max;

  var igVals = [];
  sectors.forEach(function(s) {
    (igBySec[s] || []).forEach(function(g) { igVals.push(res.byIG[g] || 0); });
  });
  var igArith = igVals.reduce(function(a, v) { return a + v; }, 0);
  igVals.push(res.ytd - igArith);
  var ir = range(igVals);
  _axisIGMin = ir.min; _axisIGMax = ir.max;
}

// ── 4. Core math: log + exp compounding over active HOCs ─────────────────────
function computeCore(exS, exG) {
  var bySec = {}, byIG = {}, logSum = 0, hocResults = [];
  _activeHocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0);
    });
    var scale = (exclW < 99.99) ? 100 / (100 - exclW) : 1;
    var hocRet = 0, activeCount = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var c = (s.w || 0) * scale * s.r;
      bySec[s.s] = (bySec[s.s] || 0) + c;
      byIG[s.g]  = (byIG[s.g]  || 0) + c;
      hocRet += c;
      activeCount++;
    });
    logSum += Math.log(1 + hocRet / 100);
    hocResults.push({ n: hoc.n, eff: hoc.eff, close: hoc.close, ret: hocRet, count: activeCount });
  });
  return { bySec: bySec, byIG: byIG, ytd: (Math.exp(logSum) - 1) * 100, hocResults: hocResults };
}

// ── 5. Format helpers ─────────────────────────────────────────────────────────
function fmtPP(v) {
  if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>';
  var c = v >= 0 ? 'var(--pos)' : 'var(--neg)';
  return '<span style="color:' + c + ';font-weight:600">' + (v >= 0 ? '+' : '') + v.toFixed(2) + 'pp</span>';
}
function fmtPct(v) {
  if (v == null || isNaN(v)) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
}
function col(v)  { return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function esc(s)  { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }

// ── 6. Render KPI tile ────────────────────────────────────────────────────────
function renderKPI(res) {
  var el = document.getElementById('ndx-ytd-val');
  if (!el) return;
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var ytd = res.ytd;
  var diff = isBase ? null : (ytd - baseR.ytd);
  el.innerHTML = '<span style="color:' + col(ytd) + '">' + fmtPct(ytd) + '</span>';
  var tag = document.getElementById('ndx-sim-badge');
  if (tag) {
    if (isBase) {
      tag.style.display = 'none';
    } else {
      tag.style.display = 'inline-block';
      var dColor = diff === 0 ? 'var(--mu)' : col(diff);
      tag.innerHTML = 'Simulation active&nbsp;&nbsp;<span style="color:' + dColor + ';font-weight:600">' +
        (diff >= 0 ? '+' : '') + diff.toFixed(2) + 'pp vs base</span>' +
        '&nbsp;&nbsp;<span class="ndx-reset-link" onclick="ndxResetSim()">reset</span>';
    }
  }
}

// ── 7. Attribution chart ──────────────────────────────────────────────────────
function wrapLabel(s, maxW) {
  if (s.length <= maxW) return s;
  var words = s.split(' '), lines = [], cur = '';
  words.forEach(function(w) {
    if ((cur + (cur ? ' ' : '') + w).length > maxW && cur) { lines.push(cur); cur = w; }
    else { cur = cur ? cur + ' ' + w : w; }
  });
  if (cur) lines.push(cur);
  return lines;
}

function renderAttrChart(res) {
  var canvas = document.getElementById('ndx-attr-canvas');
  if (!canvas || typeof Chart === 'undefined') return;
  var isIG = attrTab === 'ig';
  var items = [];
  if (isIG) {
    sectors.forEach(function(s) {
      (igBySec[s] || []).forEach(function(g) {
        items.push({ label: g, val: res.byIG[g] || 0, excl: exclSecs.has(s) || exclIGs.has(g) });
      });
    });
  } else {
    sectors.forEach(function(s) {
      items.push({ label: s, val: res.bySec[s] || 0, excl: exclSecs.has(s) });
    });
  }
  var arith = items.reduce(function(sum, x) { return sum + x.val; }, 0);
  items.push({ label: 'Compounding Residual', val: res.ytd - arith, excl: false, isRes: true });

  var maxW = isIG ? 34 : 26;
  var labels = items.map(function(x) { return wrapLabel(x.label, maxW); });
  var data   = items.map(function(x) { return parseFloat(x.val.toFixed(4)); });
  var bgCol  = items.map(function(x) {
    if (x.isRes) return 'rgba(90,110,131,0.42)';
    if (x.excl)  return 'rgba(150,150,150,0.22)';
    return x.val >= 0 ? 'rgba(23,122,78,0.72)' : 'rgba(155,42,32,0.72)';
  });
  var bdCol  = items.map(function(x) {
    if (x.isRes) return 'rgba(90,110,131,0.7)';
    if (x.excl)  return 'rgba(150,150,150,0.42)';
    return x.val >= 0 ? '#177A4E' : '#9B2A20';
  });

  var rowPx = isIG ? 26 : 30;
  var h = Math.max(280, items.length * rowPx + 50);
  var box = document.getElementById('ndx-attr-chart-box');
  if (box) box.style.height = h + 'px';

  var xMin = isIG ? _axisIGMin : _axisSecMin;
  var xMax = isIG ? _axisIGMax : _axisSecMax;

  if (_chart) {
    _chart.data.labels                      = labels;
    _chart.data.datasets[0].data           = data;
    _chart.data.datasets[0].backgroundColor = bgCol;
    _chart.data.datasets[0].borderColor    = bdCol;
    _chart.options.scales.x.min = xMin;
    _chart.options.scales.x.max = xMax;
    _chart.update('none');
    return;
  }
  _chart = new Chart(canvas, {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: bgCol, borderColor: bdCol, borderWidth: 1, borderRadius: 3 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(ctx) { return Array.isArray(ctx[0].label) ? ctx[0].label.join(' ') : ctx[0].label; },
            label: function(ctx) { var v = ctx.raw; return ' ' + (v >= 0 ? '+' : '') + v.toFixed(3) + 'pp'; }
          }
        }
      },
      scales: {
        x: {
          min: xMin, max: xMax,
          grid: { color: 'rgba(0,0,0,.05)' }, border: { display: false },
          ticks: { font: { size: 10, family: 'Inter,sans-serif' }, color: '#8A93A0', callback: function(v) { return (v>=0?'+':'')+v.toFixed(1)+'pp'; } }
        },
        y: {
          grid: { display: false }, border: { display: false },
          ticks: { font: { size: isIG ? 9.5 : 11, family: 'Inter,sans-serif' }, color: '#2B3B4E' }
        }
      }
    }
  });
}

// ── 8. Treemap ────────────────────────────────────────────────────────────────
function retColor(c, excl) {
  if (excl) return '#C8D0DA';
  if (c >= 0) {
    var t = Math.min(1, c / 8);
    var g = Math.round(100 + t * 110);
    return 'rgb(10,' + g + ',55)';
  }
  var t = Math.min(1, Math.abs(c) / 4);
  var r = Math.round(110 + t * 100);
  return 'rgb(' + r + ',28,18)';
}

function renderTreemap(res) {
  var box = document.getElementById('ndx-treemap-box');
  if (!box) return;

  var items = sectors.filter(function(s) { return s !== CASH; }).map(function(s) {
    return {
      label: s,
      w: (_snapN[s] || { w: 0 }).w,
      c: res.bySec[s] || 0,
      excl: exclSecs.has(s),
      igs: (igBySec[s] || []).map(function(g) {
        return { label: g, wi: (_snapN['ig:'+g] || { w: 0 }).w, c: res.byIG[g] || 0, excl: exclIGs.has(g) };
      })
    };
  });
  items.sort(function(a, b) { return b.w - a.w; });
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 100;

  var html = '<div style="display:flex;gap:3px;height:320px;width:100%">';
  items.forEach(function(sec) {
    var totalIGW = sec.igs.reduce(function(s, x) { return s + x.wi; }, 0) || 1;
    var shortLabel = sec.label.length > 22 ? sec.label.replace(/\band\b/gi,'&').split(' ').map(function(w, i) {
      return i < 3 ? w : '';
    }).filter(Boolean).join(' ') : sec.label;

    html += '<div onclick="ndxToggleSec(\'' + esc(sec.label) + '\')" ' +
      'title="' + sec.label + ': ' + fmtPct(sec.c) + ' contribution · ' + sec.w.toFixed(1) + '% weight" ' +
      'style="flex:' + sec.w.toFixed(3) + ';min-width:0;display:flex;flex-direction:column;' +
      'background:' + retColor(sec.c, sec.excl) + ';border-radius:4px;cursor:pointer;' +
      'border:2px solid rgba(255,255,255,0.25);overflow:hidden;opacity:' + (sec.excl ? '0.4' : '1') + '">';

    html += '<div style="color:#fff;font-size:9.5px;font-weight:700;padding:5px 5px 1px;' +
      'text-shadow:0 1px 2px rgba(0,0,0,.6);line-height:1.2;flex-shrink:0">' + shortLabel + '</div>';
    html += '<div style="color:rgba(255,255,255,.8);font-size:8.5px;padding:0 5px 3px;flex-shrink:0">' +
      fmtPct(sec.c) + '</div>';

    if (sec.igs.length > 1) {
      html += '<div style="display:flex;flex:1;gap:1px;padding:2px">';
      sec.igs.forEach(function(ig) {
        html += '<div title="' + ig.label + ': ' + fmtPct(ig.c) + '" ' +
          'style="flex:' + ig.wi.toFixed(3) + ';background:' + retColor(ig.c, sec.excl || ig.excl) + ';' +
          'border-radius:2px;min-width:0;border:1px solid rgba(255,255,255,.12)"></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  box.innerHTML = html;
}

// ── 9. Attribution & Simulation table ────────────────────────────────────────
function circleBtn(on, size) {
  var sz = size || 16;
  return on
    ? '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:var(--navy);border:2px solid var(--navy);vertical-align:middle;flex-shrink:0"></span>'
    : '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:transparent;border:2px solid #9AAAB8;vertical-align:middle;flex-shrink:0"></span>';
}

function renderAttrTable(res) {
  var tbody = document.getElementById('ndx-attr-tbody');
  if (!tbody) return;
  var isIG = attrTab === 'ig';
  var html = '';

  var sortedSecs = sectors.slice().sort(function(a, b) {
    if (a === CASH) return 1;
    if (b === CASH) return -1;
    if (_sortKey === 'name')   return _sortDir * a.localeCompare(b);
    if (_sortKey === 'weight') return _sortDir * ((_snapN[b]||{w:0}).w - (_snapN[a]||{w:0}).w);
    return _sortDir * ((res.bySec[b]||0) - (res.bySec[a]||0));
  });

  if (!isIG) {
    sortedSecs.forEach(function(s) {
      var excl = exclSecs.has(s);
      var o = _snap0[s] || { count: 0, w: 0 };
      var n = _snapN[s] || { count: 0, w: 0 };
      var c = res.bySec[s] || 0;
      html += '<tr style="' + (excl ? 'opacity:.42;' : '') + 'cursor:pointer" onclick="ndxToggleSec(\'' + esc(s) + '\')">' +
        '<td style="width:28px;text-align:center;padding:6px 4px">' + circleBtn(!excl, 16) + '</td>' +
        '<td style="font-weight:600">' + s + '</td>' +
        '<td class="num">' + o.count + ' → ' + n.count + '</td>' +
        '<td class="num">' + n.w.toFixed(1) + '%</td>' +
        '<td class="num">' + fmtPP(c) + '</td>' +
      '</tr>';
    });
  } else {
    sortedSecs.forEach(function(s) {
      var igs = (igBySec[s] || []).slice().sort(function(a, b) {
        if (_sortKey === 'name')   return _sortDir * a.localeCompare(b);
        if (_sortKey === 'weight') return _sortDir * ((_snapN['ig:'+b]||{w:0}).w - (_snapN['ig:'+a]||{w:0}).w);
        return _sortDir * ((res.byIG[b]||0) - (res.byIG[a]||0));
      });
      if (!igs.length) return;
      var secExcl = exclSecs.has(s);
      var secC = res.bySec[s] || 0;
      var secO = _snap0[s] || { count: 0, w: 0 };
      var secN = _snapN[s] || { count: 0, w: 0 };
      html += '<tr style="background:var(--surface);' + (secExcl ? 'opacity:.42;' : '') + 'cursor:pointer" onclick="ndxToggleSec(\'' + esc(s) + '\')">' +
        '<td style="width:28px;text-align:center;padding:6px 4px">' + circleBtn(!secExcl, 16) + '</td>' +
        '<td style="font-weight:700;color:var(--navy)">' + s + '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + secO.count + ' → ' + secN.count + '</td>' +
        '<td class="num" style="color:var(--mu);font-size:11px">' + secN.w.toFixed(1) + '%</td>' +
        '<td class="num" style="font-weight:700">' + fmtPP(secC) + '</td>' +
      '</tr>';
      igs.forEach(function(g) {
        var igExcl = exclIGs.has(g);
        var o = _snap0['ig:'+g] || { count: 0, w: 0 };
        var n = _snapN['ig:'+g] || { count: 0, w: 0 };
        var c = res.byIG[g] || 0;
        html += '<tr style="' + ((secExcl || igExcl) ? 'opacity:.38;' : '') + 'cursor:pointer" onclick="event.stopPropagation();ndxToggleIG(\'' + esc(g) + '\')">' +
          '<td style="width:28px;text-align:center;padding:5px 4px 5px 10px">' + circleBtn(!(secExcl || igExcl), 13) + '</td>' +
          '<td style="padding-left:20px;font-size:12px">' + g + '</td>' +
          '<td class="num" style="font-size:11.5px">' + o.count + ' → ' + n.count + '</td>' +
          '<td class="num" style="font-size:11.5px">' + n.w.toFixed(1) + '%</td>' +
          '<td class="num">' + fmtPP(c) + '</td>' +
        '</tr>';
      });
    });
  }

  var arith = isIG
    ? sectors.reduce(function(s, sec) { return s + (igBySec[sec]||[]).reduce(function(ss,g){ return ss+(res.byIG[g]||0); },0); }, 0)
    : sectors.reduce(function(s, sec) { return s + (res.bySec[sec]||0); }, 0);

  html += '<tr style="border-top:.5px solid var(--bdr)">' +
    '<td></td><td colspan="3" style="color:var(--mu);font-style:italic;font-size:11px">Compounding Residual (log/exp − arithmetic)</td>' +
    '<td class="num">' + fmtPP(res.ytd - arith) + '</td>' +
  '</tr>';
  html += '<tr style="border-top:2px solid var(--navy);font-weight:700">' +
    '<td></td><td colspan="3" style="color:var(--navy)">Total NDX YTD (Log/Exp Compounded)</td>' +
    '<td class="num" style="color:' + col(res.ytd) + ';font-weight:700">' + fmtPct(res.ytd) + '</td>' +
  '</tr>';

  tbody.innerHTML = html;
  updateSortArrows();
}

function updateSortArrows() {
  ['name','weight','contrib'].forEach(function(k) {
    var el = document.getElementById('ndx-sort-' + k);
    if (!el) return;
    el.textContent = _sortKey === k ? (_sortDir === -1 ? ' ▼' : ' ▲') : '';
  });
}

// ── 10. HOC timeline ──────────────────────────────────────────────────────────
function renderHOC(res) {
  var tbody = document.getElementById('ndx-hoc-tbody');
  if (!tbody) return;
  tbody.innerHTML = res.hocResults.map(function(h) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--navy);text-align:center">' + h.n + '</td>' +
      '<td>' + h.eff + '</td>' +
      '<td>' + (h.close || '<em style="color:var(--mu)">Open</em>') + '</td>' +
      '<td class="num">' + h.count + '</td>' +
      '<td class="num">' + fmtPP(h.ret) + '</td>' +
    '</tr>';
  }).join('');
}

// ── 11. Master refresh ────────────────────────────────────────────────────────
function refresh() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderKPI(res);
  if (attrMode === 'chart')   renderAttrChart(res);
  else                         renderTreemap(res);
  renderAttrTable(res);
  renderHOC(res);
}

// ── 12. Window-exposed handlers ───────────────────────────────────────────────
window.ndxToggleSec = function(sec) {
  if (exclSecs.has(sec)) {
    exclSecs.delete(sec);
    (igBySec[sec] || []).forEach(function(g) { exclIGs.delete(g); });
  } else {
    exclSecs.add(sec);
    (igBySec[sec] || []).forEach(function(g) { exclIGs.add(g); });
  }
  refresh();
};

window.ndxToggleIG = function(ig) {
  var sec = igToSec[ig];
  if (exclIGs.has(ig)) {
    exclIGs.delete(ig);
    if (exclSecs.has(sec)) {
      var stillAll = (igBySec[sec] || []).every(function(g) { return exclIGs.has(g); });
      if (!stillAll) exclSecs.delete(sec);
    }
  } else {
    exclIGs.add(ig);
    var allNow = (igBySec[sec] || []).every(function(g) { return exclIGs.has(g); });
    if (allNow && sec) exclSecs.add(sec);
  }
  refresh();
};

window.ndxResetSim = function() {
  exclSecs.clear();
  exclIGs.clear();
  refresh();
};

window.ndxSetAttrTab = function(tab) {
  attrTab = tab;
  if (_chart) { _chart.destroy(); _chart = null; }
  document.querySelectorAll('#ndx-attr-tabs .ndx-tab-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'chart') renderAttrChart(res);
  else renderTreemap(res);
  renderAttrTable(res);
};

window.ndxSetAttrMode = function(mode) {
  attrMode = mode;
  document.querySelectorAll('#ndx-attr-mode-btns .ndx-tab-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  var chartWrap   = document.getElementById('ndx-attr-chart-box');
  var treemapWrap = document.getElementById('ndx-treemap-box');
  if (chartWrap)   chartWrap.style.display   = mode === 'chart'   ? '' : 'none';
  if (treemapWrap) treemapWrap.style.display  = mode === 'treemap' ? '' : 'none';
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (mode === 'chart')   renderAttrChart(res);
  else                     renderTreemap(res);
};

window.ndxSort = function(key) {
  if (_sortKey === key) {
    _sortDir = -_sortDir;
  } else {
    _sortKey = key;
    _sortDir = key === 'name' ? 1 : -1;
  }
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderAttrTable(res);
};

window.ndxSetSnap = function(id) {
  if (!SNAPSHOTS[id]) return;
  _snapId = id;
  _activeHocs = getActiveHocs();
  if (_chart) { _chart.destroy(); _chart = null; }
  exclSecs.clear(); exclIGs.clear();
  sectors = []; igBySec = {}; igToSec = {};
  normalize();
  baseR = computeCore(new Set(), new Set());
  buildHierarchy(baseR);
  lockAxes(baseR);
  renderKPI(baseR);
  if (attrMode === 'chart') renderAttrChart(baseR);
  else renderTreemap(baseR);
  renderAttrTable(baseR);
  renderHOC(baseR);
};

// ── 13. HTML skeleton ─────────────────────────────────────────────────────────
function buildSkeleton() {
  var last  = _activeHocs[_activeHocs.length - 1];
  var first = _activeHocs[0];
  var nHocs = _activeHocs.length;
  var endLabel = last.close || 'Sep 22, 2026 (Open)';

  return (
  // Hero
  '<div class="sec" style="padding-bottom:0">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;padding-bottom:12px">' +
      '<div>' +
        '<div class="sect" style="font-size:17px;font-weight:700;color:var(--navy)">NDX 100 &mdash; Return Attribution</div>' +
        '<div style="font-size:11px;color:var(--mu);margin-top:3px">Log/exp compounding &middot; contributions arithmetic per HOC &middot; Source: Summit NDX NonBBG</div>' +
      '</div>' +
      '<select id="ndx-snap-sel" onchange="ndxSetSnap(this.value)" ' +
        'style="font-family:\'Inter\',sans-serif;font-size:11.5px;font-weight:600;' +
        'border:1.5px solid var(--bdr);border-radius:14px;padding:5px 12px;' +
        'background:var(--w);color:var(--navy);cursor:pointer;outline:none">' +
        '<option value="ytd2026" selected>YTD 2026 (Dec 31, 2025 → Sep 22, 2026 Open)</option>' +
      '</select>' +
    '</div>' +
    '<div class="ndx-hero-row">' +
      '<div class="ndx-hero-main">' +
        '<div class="ndx-hero-label">NDX YTD Return</div>' +
        '<div class="ndx-hero-val" id="ndx-ytd-val">&mdash;</div>' +
        '<div id="ndx-sim-badge" style="display:none;margin-top:6px;font-size:11px;' +
          'background:rgba(255,180,0,.1);border:1px solid rgba(200,160,0,.35);' +
          'border-radius:20px;padding:3px 10px;color:#7A5A00"></div>' +
      '</div>' +
      '<div class="ndx-hero-meta">' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">Period</div>' +
          '<div class="ndx-meta-val">YTD 2026</div>' +
          '<div class="ndx-meta-sub">Dec 31, 2025 &rarr; ' + endLabel + '</div>' +
        '</div>' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">HOCs</div>' +
          '<div class="ndx-meta-val">' + nHocs + '</div>' +
          '<div class="ndx-meta-sub">Rebalances &amp; index events</div>' +
        '</div>' +
        '<div class="ndx-meta-block">' +
          '<div class="ndx-meta-lbl">Constituents</div>' +
          '<div class="ndx-meta-val">' + first.sec.length + ' &rarr; ' + last.sec.length + '</div>' +
          '<div class="ndx-meta-sub">Open → Close snapshot</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +

  // Attribution chart / treemap
  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Attribution by Sector / Industry Group</span>' +
      '<span class="secn">Arithmetic contribution in pp per HOC &middot; Compounding Residual reconciles to total YTD</span>' +
    '</div>' +
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
      '<div id="ndx-attr-chart-box" style="position:relative;height:380px"><canvas id="ndx-attr-canvas"></canvas></div>' +
      '<div id="ndx-treemap-box" style="display:none;padding:4px 0"></div>' +
    '</div>' +
  '</div>' +

  // Attribution detail + simulation (unified table)
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
      '<div class="twrap"><table class="rt">' +
        '<thead><tr>' +
          '<th style="width:28px"></th>' +
          '<th onclick="ndxSort(\'name\')" style="cursor:pointer;user-select:none">Sector / Industry Group<span id="ndx-sort-name" style="color:var(--mu)"></span></th>' +
          '<th class="num">Stocks (open → close)</th>' +
          '<th class="num" onclick="ndxSort(\'weight\')" style="cursor:pointer;user-select:none">Weight %<span id="ndx-sort-weight" style="color:var(--mu)"></span></th>' +
          '<th class="num" onclick="ndxSort(\'contrib\')" style="cursor:pointer;user-select:none">Contribution<span id="ndx-sort-contrib" style="color:var(--mu)"> ▼</span></th>' +
        '</tr></thead>' +
        '<tbody id="ndx-attr-tbody"></tbody>' +
      '</table></div>' +
    '</div>' +
  '</div>' +

  // HOC timeline
  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">HOC Timeline</span>' +
      '<span class="secn">Each HOC: start date, end date, constituent count and period arithmetic return &middot; log/exp compounding of the ' + nHocs + ' HOCs = YTD above</span>' +
    '</div>' +
    '<div class="card">' +
      '<div class="twrap"><table class="rt">' +
        '<thead><tr>' +
          '<th style="text-align:center">HOC</th><th>Start Date</th><th>End Date</th>' +
          '<th class="num">Constituents</th><th class="num">Period Return</th>' +
        '</tr></thead>' +
        '<tbody id="ndx-hoc-tbody"></tbody>' +
      '</table></div>' +
      '<p style="font-size:11px;color:var(--mu);margin-top:10px;line-height:1.6">Each quarterly rebalance, index addition or deletion opens a new HOC. Returns are measured from the opening snapshot price of each HOC. Weights rescale to 100% within each HOC. Source: Bloomberg / Summit NDX NonBBG &middot; ' + endLabel + '.</p>' +
    '</div>' +
  '</div>'
  );
}

// ── 14. Entry point ───────────────────────────────────────────────────────────
export function loadNdxAttribution(container) {
  sectors = []; igBySec = {}; igToSec = {};
  _snap0 = {}; _snapN = {};
  exclSecs = new Set(); exclIGs = new Set();
  attrTab = 'sector'; attrMode = 'chart';
  _sortKey = 'contrib'; _sortDir = -1;
  _snapId = 'ytd2026';
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
