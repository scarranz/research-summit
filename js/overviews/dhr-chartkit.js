// dhr-chartkit.js — the shared chart engine for Danaher's Deep Dive panes.
//
// The portal's chart machinery is module-private in both `js/results.js` and `js/overviews/amzn.js`,
// so per docs/CHART_ENGINE_REFERENCE.md §0.7 a bespoke canvas COPIES it rather than importing it.
// Two Danaher panes now need the same copy, so it lives here once instead of twice:
//
//   esc                       ← results.js:209
//   rsAttachBrush             ← results.js:1217–1295
//   dStd* (scaffold family)   ← amzn.js:3015–3160 (aStdScaffold/aStdRender/aStdSyncSlider/aStdWire)
//   dBrPlugin / dWaterfall    ← amzn.js:3151–3184 (aBrPlugin/aBuildBrWaterfall)
//   dTbl                      ← amzn.js:3125
//   dPicker                   ← amzn.js:3500 (aGeneralPicker)
//
// Every `rs-*`, `ave-leg`, `sg-*` and `ov-chart-*` class is global (css/results.css and
// css/overview.css, both loaded unconditionally by index.html), so the only CSS here is the
// `.acx-tog` / `.mch-ctl` control pills, which amzn.js:4558 also injects inline.
//
// The scaffold keeps its state per BLOCK ID, and remembers which DOM root each block lives in, so
// two panes on the same page never collide.

// Palette — semantic, matching results.js:141–145. Navy is what happened, blue is the second read
// (adjusted, or core), gray is a reference. Green/red are up/down only.
export var D_ACT = 'rgba(30,39,51,0.92)', D_ADJ = 'rgba(37,99,235,0.85)', D_REF = 'rgba(124,134,148,0.85)';
export var D_UP = '#2E8B57', D_DOWN = '#C0504D', D_TOTAL = '#1E2733', D_NEUT = '#6B7683';
// Segment colours — one hue per reportable segment, used identically wherever a segment appears.
export var D_SEG = { bio:'#0F7DC2', ls:'#12A8A0', dx:'#1E3A5F', ea:'#A9B4C0', other:'#8DA2B8' };

export function esc(s){ if (s == null) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

// ═══ Copied engine — see the header note ══════════════════════════════════════════════════════

var _dCharts = {};
export function dDestroy(id){ if (_dCharts[id]){ _dCharts[id].destroy(); _dCharts[id] = null; } }
export function dChartReady(id, root){
  var cv = (root || document).querySelector('#' + id);
  return (cv && typeof Chart !== 'undefined' && cv.offsetParent) ? cv : null;
}
// Fade a colour for a forward period. Accepts hex or rgba(), because the palette is rgba().
function dFade(c, a){
  if (c.indexOf('rgba') === 0) return c.replace(/[\d.]+\)$/, a + ')');
  if (c.indexOf('rgb(') === 0) return c.replace('rgb(', 'rgba(').replace(')', ',' + a + ')');
  var h = c.replace('#', '');
  return 'rgba(' + parseInt(h.slice(0,2),16) + ',' + parseInt(h.slice(2,4),16) + ',' + parseInt(h.slice(4,6),16) + ',' + a + ')';
}

// rsAttachBrush — copied verbatim from js/results.js:1217–1295. Drag to zoom; the axis follows the
// direction of the drag; a drag on an axis strip is always a y-drag; double-click resets.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var vertical = (onAxis || !onX) ? true : null;
    var startX = ev.clientX, startY = ev.clientY, box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div'); box.className = 'rs-brush';
      if (vertical){ box.style.left = (r0.left - w0.left + area.left) + 'px'; box.style.width = (area.right - area.left) + 'px'; }
      else { box.style.top = (r0.top - w0.top) + 'px'; box.style.height = r0.height + 'px'; }
      wrap.appendChild(box);
    }
    function decide(cx, cy){
      if (vertical != null) return;
      var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy){
      if (vertical == null) return;
      ensureBox();
      if (vertical){ var a = Math.min(startY, cy), b = Math.max(startY, cy); box.style.top = (a - w0.top) + 'px'; box.style.height = (b - a) + 'px'; }
      else { var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx); box.style.left = (a2 - w0.left) + 'px'; box.style.width = (b2 - a2) + 'px'; }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        var idxAt = function(cx){
          var v = chart.scales.x.getValueForPixel(cx - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        };
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

// dTbl — copied from amzn.js:3125. The collapsible data table under a chart (rule 3).
export function dTbl(id, title, headers, rows){
  var head = '<span class="rs-collap-ic">▸</span> ' + esc(title) + '<span class="rs-collap-sub">' + rows.length + ' rows</span>';
  var thead = '<tr>' + headers.map(function(h, i){ return '<th' + (i === 0 ? ' class="rs-ft-h"' : '') + '>' + esc(String(h)) + '</th>'; }).join('') + '</tr>';
  var tb = rows.map(function(r){
    return '<tr>' + r.map(function(c, i){
      return i === 0 ? ('<td class="rs-ft-h">' + esc(String(c)) + '</td>')
                     : ('<td>' + (c == null || c === '' ? '<span class="rs-ft-nil">—</span>' : esc(String(c))) + '</td>');
    }).join('') + '</tr>';
  }).join('');
  return '<div class="rs-collap" data-dtbl="' + esc(id) + '"><button type="button" class="rs-collap-h" data-selfwired data-dtblb="' + esc(id) + '">' + head + '</button>' +
    '<div class="rs-collap-b" id="dTB-' + esc(id) + '" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead>' + thead + '</thead><tbody>' + tb + '</tbody></table></div></div></div>';
}

// dBrPlugin / dWaterfall — copied from amzn.js:3151–3184. Connector lines between steps and a
// value label over every bar, so a waterfall never needs a legend to be read.
var dBrPlugin = { id:'dBrLbl', afterDatasetsDraw:function(chart){
  var steps = chart._steps; if (!steps) return;
  var ctx = chart.ctx, meta = chart.getDatasetMeta(0), y = chart.scales.y, fmt = chart._fmt || {};
  ctx.save();
  ctx.strokeStyle = 'rgba(120,130,145,.55)'; ctx.setLineDash([3,3]); ctx.lineWidth = 1;
  for (var i = 0; i < steps.length - 1; i++){
    if (steps[i].runAfter == null) continue;
    var b0 = meta.data[i], b1 = meta.data[i+1]; if (!b0 || !b1) continue;
    var yy = y.getPixelForValue(steps[i].runAfter);
    ctx.beginPath(); ctx.moveTo(b0.x + b0.width/2, yy); ctx.lineTo(b1.x - b1.width/2, yy); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.textAlign = 'center';
  for (var j = 0; j < steps.length; j++){
    var s = steps[j], bar = meta.data[j]; if (!bar) continue;
    var topPix = y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if (s.kind === 'base' || s.kind === 'total'){ txt = (fmt.base || String)(s.val); ctx.fillStyle = D_TOTAL; ctx.font = '800 11px Inter, system-ui, sans-serif'; }
    else { txt = (fmt.delta || String)(s.val); ctx.fillStyle = s.dc || (s.val >= 0 ? D_UP : D_DOWN); ctx.font = '700 10.5px Inter, system-ui, sans-serif'; }
    ctx.fillText(txt, bar.x, topPix - 6);
  }
  ctx.restore();
} };
export function dWaterfall(root, id, steps, fmt, tblTitle){
  var cv = dChartReady(id, root); if (!cv) return;
  dDestroy(id);
  var ch = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels: steps.map(function(s){ return s.label; }),
           datasets:[{ data: steps.map(function(s){ return s.range; }), backgroundColor: steps.map(function(s){ return s.color; }),
                       borderRadius:4, borderSkipped:false, maxBarThickness:56, categoryPercentage:0.74, barPercentage:0.9 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:24 } },
      plugins:{ legend:{ display:false }, tooltip:{ displayColors:false, callbacks:{
        title:function(it){ return it[0].label; },
        label:function(ctx){
          var s = ctx.chart._steps[ctx.dataIndex];
          if (s.kind === 'base' || s.kind === 'total') return (fmt.base || String)(s.val);
          return (fmt.delta || String)(s.val) + (s.runAfter != null ? '   ·   running ' + (fmt.base || String)(s.runAfter) : '');
        } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 }, autoSkip:false, maxRotation:45, minRotation:0,
                   callback:function(v, i){ var l = steps[i] ? steps[i].label : ''; return l.length > 24 ? l.slice(0,23) + '…' : l; } } },
               y:{ position:'right', beginAtZero:true, grid:{ color:'#EEF2F7' },
                   ticks:{ color:'#8A93A0', font:{ size:11 }, callback:function(v){ return (fmt.axis || String)(v); } } } } },
    plugins:[ dBrPlugin ] });
  ch._steps = steps; ch._fmt = fmt; _dCharts[id] = ch; ch.update('none');
  // rule 1 — a waterfall's x-axis is not windowable, so every drag is a y-drag; double-click resets.
  rsAttachBrush(cv, ch, null,
    function(v1, v2){ ch.options.scales.y.min = v1; ch.options.scales.y.max = v2; ch.update('none'); },
    function(){ ch.options.scales.y.min = undefined; ch.options.scales.y.max = undefined; ch.update('none'); });
  var tw = root.querySelector('#' + id + '-tbl');
  if (tw){
    var f = fmt.base || String, fd = fmt.delta || String;
    tw.innerHTML = dTbl(id, tblTitle || 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind === 'base' || s.kind === 'total') ? f(s.val) : fd(s.val), s.runAfter == null ? f(s.val) : f(s.runAfter)];
    }));
  }
}

// dStd* — the SAB-parity scaffold, copied from amzn.js:3015–3160. Row 1 title + metric dropdown;
// row 2 mode pills (left) · Range presets (right); source legend; chart card; period slider with
// tick dots; collapsible table. A chart registers derive(state) → {labels, series, yFmt, …}.
var _dStd = {}, _dStdDerive = {}, _dStdRootById = {};
export function dStdScaffold(cfg){
  var id = cfg.id;
  var st = _dStd[id] || (_dStd[id] = { win:null, hidden:{}, sel:null, modes:{} });
  if (cfg.metricSel && st.sel == null){ var on = cfg.metricSel.filter(function(o){ return o.on; })[0] || cfg.metricSel[0]; st.sel = on.v; }
  (cfg.modes || []).forEach(function(g){ if (st.modes[g.cls] == null){ var d = g.opts.filter(function(o){ return o.on; })[0] || g.opts[0]; st.modes[g.cls] = d.v; } });
  var sel = cfg.metricSel ? '<select class="rs-msel" data-dstdsel="' + id + '">' + cfg.metricSel.map(function(o){
        return '<option value="' + esc(o.v) + '"' + (o.v === st.sel ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select>' : '';
  var modes = (cfg.modes || []).map(function(g){
    return '<div class="dstd-modeg" data-dstdmodeg="' + id + '|' + g.cls + '">' + (g.label ? '<span class="rs-quick-l">' + esc(g.label) + '</span>' : '') +
      '<div class="rs-views">' + g.opts.map(function(o){
        return '<button type="button" class="rs-view' + (o.v === st.modes[g.cls] ? ' active' : '') + '" data-dstdmode="' + id + '|' + g.cls + '|' + o.v + '">' + esc(o.label) + '</button>';
      }).join('') + '</div></div>';
  }).join('');
  var presets = cfg.presets || [['all','All']];
  var quick = '<div class="rs-quick"><span class="rs-quick-l">Range</span>' + presets.map(function(p){
    return '<button type="button" class="rs-preset" data-dstdrange="' + id + '|' + p[0] + '">' + esc(p[1]) + '</button>'; }).join('') + '</div>';
  return '<div class="ov-sec" data-dstdblock="' + id + '">' +
    '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.title) + '</div>' + sel + '</div>' +
    '<div class="rs-block-modes"><div class="rs-modes">' + modes + '</div>' + quick + '</div>' +
    '<div class="ave-leg" data-dstdleg="' + id + '"></div>' +
    '<div class="rs-noguide" data-dstdempty="' + id + '" hidden></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:' + (cfg.height || 340) + 'px"><canvas id="dstd-' + id + '"></canvas></div></div>' +
    '<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" data-dstdfill="' + id + '"></div></div>' +
      '<div class="rs-ticks" data-dstdticks="' + id + '"></div>' +
      '<input type="range" class="dstd-r0" min="0" max="1" value="0" step="1" aria-label="Start period">' +
      '<input type="range" class="dstd-r1" min="0" max="1" value="1" step="1" aria-label="End period"></div>' +
      '<div class="sg-ends"><span data-dstdend0="' + id + '"></span><span data-dstdend1="' + id + '"></span></div></div>' +
    '<div data-dstdtbl="' + id + '"></div>' +
    (cfg.note ? '<div class="dbl-note">' + cfg.note + '</div>' : '') +
    '</div>';
}
function dStdBlk(id){ var r = _dStdRootById[id]; return r ? r.querySelector("[data-dstdblock=\"" + id + "\"]") : null; }
function dStdApplyHideModes(blk, hm){
  blk.querySelectorAll('[data-dstdmodeg]').forEach(function(g){
    var cls = g.getAttribute('data-dstdmodeg').split('|')[1];
    g.style.display = hm.indexOf(cls) >= 0 ? 'none' : 'inline-flex';
  });
}
export function dStdRender(id, derive, root){
  if (root) _dStdRootById[id] = root;
  if (derive) _dStdDerive[id] = derive;
  derive = _dStdDerive[id]; if (!derive || !_dStdRootById[id]) return;
  var st = _dStd[id] || (_dStd[id] = { win:null, hidden:{}, sel:null, modes:{} });
  var blk = dStdBlk(id); if (!blk) return;
  var spec = derive(st);
  var emptyBox = blk.querySelector('[data-dstdempty="' + id + '"]');
  var card = blk.querySelector('.ov-chart-card'), sg = blk.querySelector('.sg-controls');
  dStdWire(id);
  // rule 6 — a combination with no data renders an amber badge, not a broken chart.
  if (!spec || spec.empty){
    dDestroy('dstd-' + id);
    if (emptyBox){ emptyBox.hidden = false; emptyBox.innerHTML = esc((spec && spec.empty) || 'No data for this view.'); }
    if (card) card.hidden = true;
    if (sg) sg.hidden = true;
    var tb0 = blk.querySelector('[data-dstdtbl="' + id + '"]'); if (tb0) tb0.innerHTML = '';
    var lg0 = blk.querySelector('[data-dstdleg="' + id + '"]'); if (lg0) lg0.innerHTML = '';
    dStdApplyHideModes(blk, (spec && spec.hideModes) || []);
    return;
  }
  if (emptyBox) emptyBox.hidden = true;
  if (card) card.hidden = false;
  if (sg) sg.hidden = false;
  var cv = dChartReady('dstd-' + id, _dStdRootById[id]); if (!cv) return;
  var n = spec.labels.length;
  if (!st.win || st.win[1] > n - 1 || st.win[0] > st.win[1]) st.win = [0, n - 1];
  var lo = st.win[0], hi = st.win[1], la = spec.lastAct == null ? n - 1 : spec.lastAct;
  var labels = spec.labels.slice(lo, hi + 1);
  var yFmt = spec.yFmt || function(v){ return v; }, y2f = spec.y2Fmt || function(v){ return v; };
  dDestroy('dstd-' + id);
  var needY2 = false;
  var vis = spec.series.filter(function(s){ return !st.hidden[s.k]; });          // rule 2 — the ONE predicate
  var ds = vis.map(function(s){
    var t = s.type || 'bar'; if (s.yAxisID === 'y2') needY2 = true;
    if (t === 'bar') return { type:'bar', label:s.label, data:s.data.slice(lo, hi+1),
      backgroundColor: s.data.slice(lo, hi+1).map(function(_, i){ return (lo + i) > la ? dFade(s.color, 0.5) : s.color; }),
      borderColor:'#fff', borderWidth:1, maxBarThickness:34, stack:s.stack, yAxisID:s.yAxisID || 'y', order:s.order || 3 };
    return { type:'line', label:s.label, data:s.data.slice(lo, hi+1), borderColor:s.color, backgroundColor:s.color,
      borderWidth:2.2, pointRadius:2, tension:0.2, spanGaps:false, yAxisID:s.yAxisID || 'y', order:s.order || 2,
      borderDash: s.dash ? [5,4] : undefined };
  });
  var anyBar = spec.series.some(function(s){ return (s.type || 'bar') === 'bar'; });
  var stk = spec.stacked === true;   // a stacked spec sets both axes; the series carry their own stack id
  var scales = { x:{ stacked:stk, grid:{ display:false }, ticks:{ font:{ size:11 } } },
    y:{ stacked:stk, position:'right', grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:11 }, callback:function(v){ return yFmt(v); } } } };
  if (needY2) scales.y2 = { position:'right', weight:1, grid:{ display:false }, ticks:{ font:{ size:11 }, callback:function(v){ return y2f(v); } } };
  _dCharts['dstd-' + id] = new Chart(cv.getContext('2d'), {
    type: anyBar ? 'bar' : 'line',
    data:{ labels: labels, datasets: ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{
          label:function(c){ var f = c.dataset.yAxisID === 'y2' ? y2f : yFmt; return c.dataset.label + ': ' + (c.parsed.y == null ? '—' : f(c.parsed.y)); },
          afterBody:function(items){ return spec.note ? spec.note(lo + items[0].dataIndex) : ''; } } } },
      scales: scales } });
  dStdApplyHideModes(blk, spec.hideModes || []);
  // Legend — one chip per source group; toggling hides its bar AND its margin line together.
  var leg = blk.querySelector('[data-dstdleg="' + id + '"]');
  if (leg){
    var seen = {}, chips = [];
    spec.series.forEach(function(s){
      var g = s.grp || s.k; if (seen[g]) return; seen[g] = 1;
      chips.push('<button type="button" class="rs-leg' + (st.hidden[s.k] ? ' off' : '') + '" data-dstdleggrp="' + id + '|' + g + '">' +
        '<span class="ave-leg-act" style="background:' + s.color + '"></span>' + esc(s.src || s.label) + '</button>');
    });
    leg.innerHTML = chips.join('') + (spec.legNote ? '<span class="dbl-legnote">' + spec.legNote + '</span>' : '');
  }
  // rule 3 — the table carries everything drawn, windowed and honouring the hidden series.
  var tblc = blk.querySelector('[data-dstdtbl="' + id + '"]');
  if (tblc){
    var rows = vis.map(function(s){
      return [s.label].concat(s.data.slice(lo, hi+1).map(function(v){ return v == null ? null : ((s.yAxisID === 'y2' ? y2f : yFmt)(v)); }));
    });
    if (spec.extraRows) rows = rows.concat(spec.extraRows(lo, hi));
    tblc.innerHTML = dTbl(id, spec.tblTitle || 'Data — what the chart draws', ['Series'].concat(labels), rows);
  }
  dStdSyncSlider(id, spec.labels, la);
  var chh = _dCharts['dstd-' + id];
  if (chh) rsAttachBrush(cv, chh,
    function(i1, i2){ var w = _dStd[id].win; _dStd[id].win = [w[0] + i1, w[0] + i2]; dStdRender(id); },
    function(v1, v2){ chh.options.scales.y.min = v1; chh.options.scales.y.max = v2; chh.update('none'); },
    function(){ _dStd[id].win = null; dStdRender(id); });
}
function dStdSyncSlider(id, labels, la){
  var blk = dStdBlk(id); if (!blk) return;
  var n = labels.length, w = _dStd[id].win;
  var r0 = blk.querySelector('.dstd-r0'), r1 = blk.querySelector('.dstd-r1');
  var fill = blk.querySelector('[data-dstdfill]'), ticks = blk.querySelector('[data-dstdticks]');
  var e0 = blk.querySelector('[data-dstdend0]'), e1 = blk.querySelector('[data-dstdend1]');
  if (r0){ r0.max = n - 1; r0.value = w[0]; }
  if (r1){ r1.max = n - 1; r1.value = w[1]; }
  if (fill){ fill.style.left = (w[0]/(n-1)*100) + '%'; fill.style.width = ((w[1]-w[0])/(n-1)*100) + '%'; }
  if (e0) e0.textContent = labels[w[0]] || '';
  if (e1) e1.textContent = labels[w[1]] || '';
  if (ticks){ var h = ''; for (var i = 0; i < n; i++){ h += '<span class="rs-tick' + (i >= w[0] && i <= w[1] ? ' on' : '') + (i > la ? ' est' : '') + '" style="left:' + (i/(n-1)*100) + '%"></span>'; } ticks.innerHTML = h; }
}
function dStdPresetWin(code, n, cmpFrom){
  switch (code){
    case 'cmp': return [Math.max(0, cmpFrom == null ? 0 : cmpFrom), n - 1];
    case 'l5':  return [Math.max(0, n - 5), n - 1];
    case 'l8':  return [Math.max(0, n - 8), n - 1];
    default:    return [0, n - 1];
  }
}
function dStdWire(id){
  var blk = dStdBlk(id); if (!blk || blk._dstdWired) return;
  blk._dstdWired = true;
  var st = _dStd[id];
  blk.addEventListener('click', function(e){
    var mode = e.target.closest && e.target.closest('[data-dstdmode]');
    if (mode){
      var p = mode.getAttribute('data-dstdmode').split('|');
      st.modes[p[1]] = p[2];
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active', x === mode); });
      st.win = null;                                        // the axis changes with the period — drop the window
      dStdRender(id); return;
    }
    var lgg = e.target.closest && e.target.closest('[data-dstdleggrp]');
    if (lgg){
      var g = lgg.getAttribute('data-dstdleggrp').split('|')[1], spc = _dStdDerive[id] && _dStdDerive[id](st);
      if (spc && spc.series){
        var mem = spc.series.filter(function(s){ return (s.grp || s.k) === g; });
        var off = mem.every(function(s){ return st.hidden[s.k]; });
        mem.forEach(function(s){ st.hidden[s.k] = !off; });
      }
      dStdRender(id); return;
    }
    var rp = e.target.closest && e.target.closest('[data-dstdrange]');
    if (rp){
      var spec = _dStdDerive[id] && _dStdDerive[id](st);
      var n = (spec && spec.labels) ? spec.labels.length : 2;
      st.win = dStdPresetWin(rp.getAttribute('data-dstdrange').split('|')[1], n, spec && spec.cmpFrom);
      dStdRender(id); return;
    }
  });
  var sel = blk.querySelector('[data-dstdsel]');
  if (sel) sel.onchange = function(){ st.sel = sel.value; st.win = null; dStdRender(id); };
  var r0 = blk.querySelector('.dstd-r0'), r1 = blk.querySelector('.dstd-r1');
  function onSlide(){ var a = +r0.value, b = +r1.value; st.win = [Math.min(a,b), Math.max(a,b)]; dStdRender(id); }
  if (r0) r0.oninput = onSlide;
  if (r1) r1.oninput = onSlide;
}


// ═══ Formatters — rule 5, never a bare number ═════════════════════════════════════════════════
export function fMs(v){ return v == null ? '—' : '$' + Math.round(v).toLocaleString('en-US'); }
export function fPct(v){ return (v == null || isNaN(v)) ? '—' : v.toFixed(1) + '%'; }
export function fPp(v){ return (v == null || isNaN(v)) ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + 'pp'; }
export function fX(v){ return v == null ? '—' : v.toFixed(2) + 'x'; }
export function fEps(v){ return v == null ? '—' : (v < 0 ? '−$' : '$') + Math.abs(v).toFixed(2); }
export function fEpsD(v){ return v == null ? '—' : (v >= 0 ? '+$' : '−$') + Math.abs(v).toFixed(2); }
export var FMT_M   = { axis:function(v){ return '$' + Math.round(v/1000) + 'B'; }, base:fMs,
                       delta:function(v){ return (v >= 0 ? '+$' : '−$') + Math.round(Math.abs(v)).toLocaleString('en-US'); } };
export var FMT_EPS = { axis:function(v){ return '$' + v.toFixed(2); }, base:fEps, delta:fEpsD };
export var FMT_BPS = { axis:function(v){ return v.toFixed(0) + '%'; }, base:function(v){ return v.toFixed(1) + '%'; },
                       delta:function(v){ var b = Math.round(v*100); return (b >= 0 ? '+' : '−') + Math.abs(b) + ' bps'; } };
// A growth walk is in percentage points; the running total is itself a percentage.
export var FMT_PP  = { axis:function(v){ return v.toFixed(1) + '%'; }, base:function(v){ return v.toFixed(1) + '%'; }, delta:fPp };

// ═══ The master section picker — copied from amzn.js:3500 ═════════════════════════════════════
// One dropdown swaps which chart is on screen; the rest stay hidden. Sections are wrapped in
// `.gen-sec[data-gsec]`, and only the chosen one is built, because Chart.js measures a canvas
// whose offsetParent is null as zero and never recovers.
export function dPicker(sections, first){
  return '<div class="ov-sec" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
    '<span class="dbl-pick-l">Chart</span><select class="gen-chart">' +
    sections.map(function(o){ return '<option value="' + esc(o[0]) + '"' + (o[0] === first ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') +
    '</select><span class="dbl-pick-h">Pick one — the rest stay tucked away.</span></div></div>';
}
// Wires the picker and returns the show function, so a pane can also call it to build its default.
export function dWirePicker(root, build){
  function show(v){
    root.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden = (s.getAttribute('data-gsec') !== v); });
    build(v);
  }
  var sel = root.querySelector('.gen-chart');
  if (sel) sel.onchange = function(){ show(sel.value); };
  return show;
}
// The collapsible tables dTbl generates regenerate their own header, so they carry
// `data-selfwired` to opt out of dhr.js's generic `.rs-collap-h` handler and are toggled here.
export function dWireTables(root){
  root.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-dtblb]');
    if (!b) return;
    var body = root.querySelector('#dTB-' + b.getAttribute('data-dtblb'));
    if (!body) return;
    body.hidden = !body.hidden;
    var ic = b.querySelector('.rs-collap-ic');
    if (ic) ic.textContent = body.hidden ? '▸' : '▾';
  });
}
// Toggle-pill helper: mark the clicked button active within its own group.
export function dActivate(btn){
  if (btn && btn.parentNode) btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b === btn); });
}

// ═══ The only CSS this kit needs — everything else is global ══════════════════════════════════
export var DHR_KIT_CSS = '<style>' +
  '.acx-tog{display:inline-flex;border:1px solid var(--bdr);border-radius:8px;overflow:hidden;flex-wrap:wrap}' +
  '.acx-tog button{appearance:none;border:0;border-right:1px solid var(--bdr);background:#fff;font:600 12px Inter,sans-serif;color:var(--mu);padding:7px 14px;cursor:pointer}' +
  '.acx-tog button:last-child{border-right:0}.acx-tog button:hover{color:var(--navy)}.acx-tog button.active{background:var(--navy);color:#fff}' +
  '.mch-ctl{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:8px 0 4px}' +
  '.dstd-modeg{display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0}' +
  '.gen-chart{font-size:13px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;background:#fff}' +
  '.dbl-pick-l{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}' +
  '.dbl-pick-h,.dbl-lbl{font-size:11px;color:var(--mu)}' +
  '.dbl-legnote{font-size:11px;color:var(--mu);font-weight:600;margin-left:2px}' +
  '.dbl-note{font-size:11.5px;line-height:1.6;color:var(--mu);margin:12px 0 0;max-width:88ch}' +
  '.dbl-lede{font-size:14px;line-height:1.62;color:var(--tx);margin:2px 0 6px;max-width:80ch}' +
  '@media(max-width:640px){.acx-tog button{padding:6px 10px;font-size:11px}}' +
  '</style>';
