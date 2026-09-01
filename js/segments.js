// segments.js — the "Segments" pane: one segment at a time, read top to bottom.
//
// EMBEDDABLE, not a standalone tab: renders inside Deep Dive ▸ Top Line as the "Segments"
// sub-tab. Datasets are generated per company (js/segments-data/<ticker>.js, built by
// scripts/segments/emit_segments.py); this file is fully generic.
//
// ── THE SECTIONS, AND WHY THEY ARE IN THIS ORDER ──────────────────────────────────────────────
//   1 What it is        the summary, the filing's own description behind a drill-down, and the
//                       segment's top line — rendered BY THE RESULTS ENGINE, so it arrives with
//                       quarterly/annual, level ⇄ growth, presets, slider, drag-to-zoom, chips
//                       and the period table already built (CHART_ENGINE_REFERENCE §0.1 path 1:
//                       a metric over time is a dataset, never a canvas).
//   2 What it sells     the product breakdown, each with a drill-down carrying the description,
//                       named customers where any are public, and how big the line is against
//                       the segment and the company.
//   3 KPIs              what the company itself publishes, how IT defines each one, and the
//                       series over time. Definitions come first because a KPI you cannot define
//                       is a number you cannot use.
//   4 Revenue bridge    the KPIs multiplied together. It comes AFTER them on purpose: the bridge
//                       is the interaction of the drivers, so it means nothing until they do.
//   5 Around the edges  what sits inside the segment without being its main business — Amazon's
//                       advertising inside the retail segments is the canonical case.
//
// Sections 2–5 are canvases of our own (§0.1 path 3) and meet the six non-negotiables of §0.2
// using the §0.7 kit: `esc`, `rsAttachBrush`, `rsFwdZone`/`rsRR` and the palette are COPIED
// VERBATIM from js/results.js, which exports no helpers.
//
// ⚠ ONE ENGINE BLOCK PER PANE. js/results.js keeps a single module-level `_rs`, re-targeted by
// each initResults() call, so two engine blocks visible at once would fight over it. Section 1 is
// the engine; the KPI, bridge and adjacency charts are ours. They also need to be: those series
// carry mixed units and mixed periodicity, which the engine's one-unit-per-metric model does not
// express.

import { amznSegments } from './segments-data/amzn.js';
import { amznResults } from './results-data/amzn.js';
import { registerResultsData, resultsHtml, initResults } from './results.js';
import { AMZN_THEMES } from './themes-data/amzn.js';
import { SUMMIT_CAT, SUMMIT_MUTE } from './viz-palette.js';   // the portal's fixed categorical palette

// The Notes taxonomy names segments in prose; the datasets key them. One map, stated once.
var THEME_SEG = { AMZN: { 'Amazon US': 'na', 'Amazon International': 'intl', 'AWS': 'aws' } };
var THEME_SRC = { AMZN: AMZN_THEMES };

var SEGMENTS_DATA = {
  AMZN: { seg: amznSegments, res: amznResults }
};

export function getSegmentsData(ticker){ return SEGMENTS_DATA[ticker] || null; }

// ─── copied verbatim from js/results.js (§0.7: the engine exports no helpers) ─────────────────
var RS_ACT  = 'rgba(30,39,51,0.92)';
var RS_CONS = 'rgba(124,134,148,0.85)';
var RS_FWD  = '#2563EB';
// WAS a six-step ramp — four blues, a violet and a green — used to tell SEGMENTS apart. A ramp
// encodes magnitude, not identity, so the seven product lines on Top Line ▸ Other arrived as seven
// near-identical blues that no reader could separate. It also CYCLED (`i % length`), so a
// hypothetical seventh entity silently re-used the first one's colour. Both are categorical-colour
// errors. Now the portal's fixed categorical order, assigned by slot and never cycled.
var SG_RAMP = SUMMIT_CAT;

function rsRR(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
var rsFwdZone = {
  id: 'rsFwdZone',
  beforeDatasetsDraw: function(chart, args, opts){
    var from = opts && opts.from; if (from == null || from < 0) return;
    var x = chart.scales.x, area = chart.chartArea, ctx = chart.ctx;
    var left = (from > 0) ? (x.getPixelForTick(from - 1) + x.getPixelForTick(from)) / 2 : area.left;
    ctx.save();
    ctx.fillStyle = 'rgba(37,99,235,0.07)';
    ctx.fillRect(left, area.top, area.right - left, area.bottom - area.top);
    ctx.strokeStyle = 'rgba(37,99,235,0.40)'; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(left, area.top); ctx.lineTo(left, area.bottom); ctx.stroke();
    ctx.setLineDash([]);
    var label = 'FORECAST', pad = 7;
    ctx.font = '700 9px Inter, system-ui, sans-serif';
    var w = ctx.measureText(label).width, px = left + 8, py = area.top + 5;
    if (px + w + pad * 2 > area.right - 4) px = area.right - w - pad * 2 - 4;
    ctx.fillStyle = 'rgba(37,99,235,0.92)'; rsRR(ctx, px, py, w + pad * 2, 15, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, px + pad, py + 8);
    ctx.restore();
  },
  afterDraw: function(chart, args, opts){
    var from = opts && opts.from; if (from == null || from < 0) return;
    var x = chart.scales.x, ctx = chart.ctx;
    ctx.save();
    ctx.font = '700 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var y = x.top + 13, labels = chart.data.labels || [];
    for (var i = from; i < x.ticks.length; i++){
      var px = x.getPixelForTick(i);
      var lbl = labels[i] != null ? String(labels[i]) : '';
      if (!lbl) continue;
      var w = ctx.measureText(lbl).width;
      ctx.fillStyle = 'rgba(37,99,235,0.14)'; rsRR(ctx, px - w / 2 - 7, y - 9, w + 14, 18, 9); ctx.fill();
      ctx.fillStyle = RS_FWD; ctx.fillText(lbl, px, y);
    }
    ctx.restore();
  }
};

// Chart.js LOCAL plugin: print the column TOTAL above each period. The datalabels plugin is not
// loaded (zero-build), and this is the one label that matters here — a stacked column shows the
// split but hides the number the split adds up to, which is usually the first thing anyone asks.
// Reads `options.plugins.sgTotals = { vals: [total per index], fmt: fn }`.
// Values printed on the plot itself. Off by default: on a 14-period stack of 7 series it is 98
// numbers and unreadable, which is exactly why it has to be a toggle rather than a decision made
// for the reader. A label that would collide with the plot edge, or that does not fit inside its
// own bar segment, is not drawn — a half-legible number is worse than none.
var sgLabels = {
  id: 'sgLabels',
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || !opts.on) return;
    var ctx = chart.ctx, area = chart.chartArea;
    ctx.save();
    ctx.font = '600 9.5px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      var bar = meta.type === 'bar';
      (meta.data || []).forEach(function(el, i){
        var v = ds.data[i];
        if (v == null || !el) return;
        var txt = opts.fmt ? opts.fmt(v) : String(v);
        var w = ctx.measureText(txt).width;
        if (el.x - w / 2 < area.left - 1 || el.x + w / 2 > area.right + 1) return;
        if (bar){
          var top = Math.min(el.y, el.base), bot = Math.max(el.y, el.base);
          if (bot - top < 13) return;                       // will not fit inside its own segment
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fff';
          ctx.fillText(txt, el.x, (top + bot) / 2);
        } else {
          var y = el.y - 6;
          if (y < area.top + 8) y = el.y + 13;
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'rgba(30,39,51,0.85)';
          ctx.fillText(txt, el.x, y);
        }
      });
    });
    ctx.restore();
  }
};
var sgTotals = {
  id: 'sgTotals',
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || !opts.vals) return;
    var ctx = chart.ctx, area = chart.chartArea;
    ctx.save();
    ctx.font = '700 10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(30,39,51,0.78)';
    for (var i = 0; i < opts.vals.length; i++){
      var v = opts.vals[i];
      if (v == null) continue;
      // The top of the column: the highest painted pixel across every visible dataset at i.
      var top = null;
      chart.data.datasets.forEach(function(_, di){
        var meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        var el = meta.data[i];
        if (!el) return;
        var y = el.y != null ? el.y : null;
        if (y != null && (top == null || y < top)) top = y;
      });
      if (top == null) continue;
      var x = chart.scales.x.getPixelForTick(i);
      var label = opts.fmt ? opts.fmt(v) : String(v);
      var w = ctx.measureText(label).width;
      if (x - w / 2 < area.left || x + w / 2 > area.right) continue;   // no clipped labels
      ctx.fillText(label, x, Math.max(top - 4, area.top + 10));
    }
    ctx.restore();
  }
};

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (!wrap) return;
  if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  var box = wrap.querySelector('.rs-brush');
  if (!box){ box = document.createElement('div'); box.className = 'rs-brush'; box.hidden = true; wrap.appendChild(box); }
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var area = chart.chartArea; if (!area) return;
    var r = el.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    var x0 = ev.clientX - r.left, y0 = ev.clientY - r.top;
    var yDrag = !onX || x0 < area.left;
    var moved = false;
    function pt(ev2){
      return { x: Math.min(Math.max(ev2.clientX - r.left, area.left), area.right),
               y: Math.min(Math.max(ev2.clientY - r.top, area.top), area.bottom) };
    }
    function onMove(ev2){
      var p = pt(ev2);
      if (!moved && Math.abs((yDrag ? p.y - y0 : p.x - x0)) < 4) return;
      moved = true; box.hidden = false;
      if (yDrag){
        var top = Math.min(y0, p.y), bot = Math.max(y0, p.y);
        box.style.left = (area.left - (wr.left - r.left)) + 'px';
        box.style.width = (area.right - area.left) + 'px';
        box.style.top = (top - (wr.top - r.top)) + 'px';
        box.style.height = (bot - top) + 'px';
      } else {
        var lo = Math.min(x0, p.x), hi = Math.max(x0, p.x);
        box.style.left = (lo - (wr.left - r.left)) + 'px';
        box.style.width = (hi - lo) + 'px';
        box.style.top = (area.top - (wr.top - r.top)) + 'px';
        box.style.height = (area.bottom - area.top) + 'px';
      }
    }
    function onUp(ev2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      box.hidden = true;
      if (!moved) return;
      var p = pt(ev2);
      if (yDrag){
        var s = chart.scales.y; if (!s || !onY) return;
        var v1 = s.getValueForPixel(Math.max(y0, p.y)), v2 = s.getValueForPixel(Math.min(y0, p.y));
        if (v2 - v1 > 1e-9) onY(v1, v2);
      } else {
        var xs = chart.scales.x; if (!xs) return;
        var a = Math.round(xs.getValueForPixel(Math.min(x0, p.x)));
        var b = Math.round(xs.getValueForPixel(Math.max(x0, p.x)));
        a = Math.max(0, a); b = Math.min((chart.data.labels || []).length - 1, b);
        if (b > a) onX(a, b);
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

// ─── state ────────────────────────────────────────────────────────────────────────────────────
var PPY = { q: 4, y: 1 };
// One state block per chart block: each has its own chips, window and y-range.
function blank(){ return { hidden: {}, win: null, yr: null, tbl: false, chart: null, mode: 'amt', stack: true, view: 'q', growUnit: 'pct' }; }
var _sg = { ticker: null, seg: null, cut: null, open: {}, blocks: {} };
function blk(id){ if (!_sg.blocks[id]) _sg.blocks[id] = blank(); return _sg.blocks[id]; }
// The Overview and the Segments detail share `_sg`, so a reset has to be scoped. `ovrev` and the
// `ovcard-*` keys belong to the Overview pane and survive a segment switch; everything else is
// per-segment and is meant to go.
var SG_OV_KEEP = { ovrev: 1 };
function sgResetDetail(){
  Object.keys(_sg.blocks).forEach(function(k){ if (!SG_OV_KEEP[k]) delete _sg.blocks[k]; });
  Object.keys(_sg.open).forEach(function(k){ if (k.indexOf('ovcard-') !== 0) delete _sg.open[k]; });
}

function sgData(){ return SEGMENTS_DATA[_sg.ticker] || null; }
function sgSeg(){
  var d = sgData(); if (!d) return null;
  return d.seg.segments.filter(function(s){ return s.key === _sg.seg; })[0] || d.seg.segments[0];
}

// ─── resolving a series ───────────────────────────────────────────────────────────────────────
// `results:<key>` and `shared:<key>` are POINTERS — the series lives in the Results dataset or in
// the shared block and is read through, never copied, so it keeps exactly one home.
function sgResolveRef(ref, view){
  var d = sgData(); if (!d || !ref) return null;
  var parts = String(ref).split(':'), kind = parts[0], key = parts[1];
  if (kind === 'results'){
    var vw = d.res.views[view], m = vw && vw.metrics[key];
    if (!m) return null;
    var act = {}, est = {};
    m.periods.forEach(function(p, i){
      if (m.act && m.act[i] != null) act[p] = m.act[i];
      else if (m.summit && m.summit[i] != null) est[p] = m.summit[i];
    });
    return { unit: m.unit === 'eps' ? 'eps' : 'usdM', label: m.label, short: m.short || m.label,
             act: act, est: est, src: 'Results dataset' };
  }
  if (kind === 'shared'){
    var sp = d.seg.shared[key]; if (!sp) return null;
    var b = sp[view]; if (!b) return null;
    return { unit: sp.unit, label: sp.label, short: sp.short || sp.label,
             act: b.act || {}, est: b.summit || {}, src: sp.src, scope: sp.scope };
  }
  return null;
}
function sgDriver(key, view){
  var d = sgData(), s = sgSeg();
  if (!d || !s) return null;
  var spec = (s.drivers || {})[key] || d.seg.shared[key];
  if (!spec) return null;
  if (spec.from) return sgResolveRef(spec.from, view);
  var b = spec[view]; if (!b) return null;
  return { unit: spec.unit || 'usdM', label: spec.label, short: spec.short || spec.label,
           act: b.act || {}, est: b.summit || {}, src: spec.src, scope: spec.scope };
}
function sgDerived(key, view){
  var d = sgData(); if (!d) return null;
  var spec = d.seg.derived[key]; if (!spec) return null;
  var n = sgResolve(spec.num, view), dn = sgResolve(spec.den, view);
  if (!n || !dn) return null;
  var act = {}, est = {}, all = {};
  Object.keys(n.act).forEach(function(p){ all[p] = 1; });
  Object.keys(n.est).forEach(function(p){ all[p] = 1; });
  Object.keys(all).forEach(function(p){
    var num = n.act[p] != null ? n.act[p] : n.est[p];
    var den = dn.act[p] != null ? dn.act[p] : dn.est[p];
    if (num == null || den == null || !den) return;
    var v = num / (den * (spec.annualiseDen ? PPY[view] : 1));
    if (n.act[p] != null && dn.act[p] != null) act[p] = v; else est[p] = v;
  });
  return { unit: spec.unit, label: spec.label, short: spec.short || spec.label, act: act, est: est,
           src: 'derived: ' + spec.num + ' / ' + spec.den };
}
function sgResolve(key, view){
  var d = sgData(); if (!d) return null;
  if (String(key).indexOf(':') > 0) return sgResolveRef(key, view);
  return d.seg.derived[key] ? sgDerived(key, view) : sgDriver(key, view);
}

// ─── formatting (rule 5 — never a bare number) ────────────────────────────────────────────────
function fmtVal(v, unit){
  if (v == null) return '—';
  if (unit === 'pct')  return (v * 100).toFixed(1) + '%';
  if (unit === 'x')    return v.toFixed(2) + '×';
  if (unit === 'days') return Math.round(v) + 'd';
  if (unit === 'eps')  return '$' + v.toFixed(2);
  var a = Math.abs(v);
  return a >= 1000 ? '$' + (v / 1000).toFixed(1) + 'B' : '$' + Math.round(v) + 'M';
}
function pctStr(v){ return v == null ? '—' : (v * 100).toFixed(1) + '%'; }

// ─── a generic chart block: chips · chart · collapsible table ──────────────────────────────────
// Used by the KPI section, the bridge and the adjacencies. One implementation, three uses — three
// chart functions would drift, which is how a portal stops looking like one product.
// `ref` may be a string, or one ref per axis — a product line is a pointer into the Results
// dataset quarterly and a summed annual driver yearly, which is one series with two homes.
function seriesRef(it, view){
  var r = it.ref || it.key;
  return (r && typeof r === 'object') ? (r[view] || null) : r;
}
function blockSeries(list, view){
  return list.map(function(it){
             var r = seriesRef(it, view);
             return { key: it.key, label: it.label, d: r ? sgResolve(r, view) : null }; })
             .filter(function(x){ return x.d && (Object.keys(x.d.act).length || Object.keys(x.d.est).length); });
}
// THE ONE PREDICATE per block (§0.2 rule 2) — chart, table and every count read this and only this.
function vis(id, k){ return !blk(id).hidden[k]; }

// A block normally shares the dataset axis. The alternative revenue cuts do not: geography is
// annual and only exists as far back as the filings we read, product lines only start when the
// disaggregation does. SG_AXIS lets a block declare its own periods without moving anyone else's.
var SG_AXIS = {};
function blockPeriods(id, list, view){
  var d = sgData(); if (!d) return [];
  var ser = blockSeries(list, view).filter(function(x){ return vis(id, x.key); });
  var axis = (SG_AXIS[id] && SG_AXIS[id][view]) || d.seg.axis[view] || [];
  return axis.filter(function(p){
    return ser.some(function(x){ return x.d.act[p] != null || x.d.est[p] != null; });
  });
}
function winPeriods(id, list, view){
  var ps = blockPeriods(id, list, view), st = blk(id);
  if (!st.win) return ps;
  return ps.slice(Math.max(0, st.win[0]), Math.min(ps.length, st.win[1] + 1));
}
function firstFwd(id, list, view, ps){
  var ser = blockSeries(list, view).filter(function(x){ return vis(id, x.key); });
  for (var i = 0; i < ps.length; i++){
    if (!ser.some(function(x){ return x.d.act[ps[i]] != null; })) return i;
  }
  return -1;
}
// Amount / Share / Growth. Share is over the VISIBLE money series, so hiding one re-bases the
// rest — the alternative (a fixed denominator) shows shares that no longer sum to 100 and reads
// as an error. Growth is measured on the full axis, not the window, so windowing never invents a
// first-period gap.
function seriesValues(id, x, allPs, view, mode){
  var out = {};
  allPs.forEach(function(p){ var v = x.d.act[p] != null ? x.d.act[p] : x.d.est[p]; if (v != null) out[p] = v; });
  if (mode === 'growth'){
    // On an annual axis "one back" IS a year, so there is only one growth to show. On a quarterly
    // axis there are two different questions — vs the same quarter last year (seasonality out) and
    // vs last quarter (the sequential move) — and the reader picks which one they are asking.
    var lag = view === 'q' ? (blk(id).glag === 'qoq' ? 1 : PPY.q) : 1;
    var amt = blk(id).growUnit === 'amt';
    var g = {};
    allPs.forEach(function(p, i){
      var b0 = allPs[i - lag];
      if (b0 == null || out[p] == null || out[b0] == null) return;
      // Growth in AMOUNT is the more honest half as often as not: a percentage flatters a small
      // base and hides a large one, and $9B added on AWS is not $9B added on North America.
      if (amt){ g[p] = out[p] - out[b0]; return; }
      if (!out[b0]) return;
      g[p] = (out[p] - out[b0]) / Math.abs(out[b0]);
    });
    return g;
  }
  return out;
}
// Chart labels have to be short or they collide; the table underneath carries the precision.
function fmtNum(v){
  var a = Math.abs(v);
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  if (a >= 1) return v.toFixed(1);
  return v.toFixed(2);
}
function modeUnit(id, mode, unit){
  if (mode === 'amt') return unit;
  if (mode === 'growth' && blk(id).growUnit === 'amt') return 'usdM';
  return 'pct';
}
// The control row. Each group is LABELLED and boxed in its own `.rs-views` segmented control —
// three sets of pills in an undivided row read as one nine-way choice, which is how a reader ends
// up believing "Growth" and "Side by side" are alternatives to each other.
function modesHtml(id, opts){
  var st = blk(id);
  function group(label, pills){
    return '<div class="sg-ctrlg"><span class="rs-quick-l">' + esc(label) + '</span>' +
      '<div class="rs-views">' + pills + '</div></div>';
  }
  var h = '<div class="sg-ctrls">';
  if (opts && opts.views){
    h += group('Period', [['q', 'Quarterly'], ['y', 'Annual']].map(function(v){
      return '<button type="button" class="rs-view' + ((st.view || 'q') === v[0] ? ' active' : '') +
        '" data-sgview="' + esc(id) + '|' + v[0] + '">' + v[1] + '</button>'; }).join(''));
  }
  h += group('Show', [['amt', '$B'], ['share', 'Share'], ['growth', 'Growth']].map(function(m){
    return '<button type="button" class="rs-view' + (st.mode === m[0] ? ' active' : '') +
      '" data-sgmode="' + esc(id) + '|' + m[0] + '">' + m[1] + '</button>'; }).join(''));
  if (st.mode === 'growth'){
    // Only on a quarterly axis: an annual series has one possible base period.
    if ((st.view || 'q') === 'q'){
      h += group('Compare', [['yoy', 'YoY'], ['qoq', 'QoQ']].map(function(l){
        return '<button type="button" class="rs-view' + ((st.glag || 'yoy') === l[0] ? ' active' : '') +
          '" data-sglag="' + esc(id) + '|' + l[0] + '" title="' +
          (l[0] === 'yoy' ? 'vs the same quarter last year' : 'vs the previous quarter') +
          '">' + l[1] + '</button>'; }).join(''));
    }
    h += group('Growth in', [['pct', '%'], ['amt', '$ added']].map(function(u){
      return '<button type="button" class="rs-view' + ((st.growUnit || 'pct') === u[0] ? ' active' : '') +
        '" data-sggrow="' + esc(id) + '|' + u[0] + '">' + u[1] + '</button>'; }).join(''));
  }
  // Stacking only means anything where the parts add to a whole, so the control appears with the
  // bars and disappears in Share (always stacked) and Growth (rates do not sum).
  if (opts && opts.bars && st.mode === 'amt'){
    h += group('Layout', [[true, 'Stacked'], [false, 'Side by side']].map(function(m){
      return '<button type="button" class="rs-view' + ((st.stack !== false) === m[0] ? ' active' : '') +
        '" data-sgstack="' + esc(id) + '|' + (m[0] ? '1' : '0') + '">' + m[1] + '</button>'; }).join(''));
  }
  h += group('Values', [[true, 'On'], [false, 'Off']].map(function(m){
    return '<button type="button" class="rs-view' + ((st.labels === true) === m[0] ? ' active' : '') +
      '" data-sglab="' + esc(id) + '|' + (m[0] ? '1' : '0') + '" title="Print every plotted value on the chart">' +
      m[1] + '</button>'; }).join(''));
  return h + '</div>';
}

function chipsHtml(id, list, view, firstIsTarget){
  return blockSeries(list, view).map(function(x, i){
    var money = x.d.unit === 'usdM' || x.d.unit === 'eps';
    var color = !money ? RS_CONS : (firstIsTarget && i === 0 ? RS_ACT : (SG_RAMP[i] || SUMMIT_MUTE));
    return '<button type="button" class="rs-leg' + (vis(id, x.key) ? '' : ' off') +
      '" data-sgleg="' + esc(id) + '|' + esc(x.key) + '" title="Show / hide">' +
      '<span class="rs-leg-line" style="background:' + color + '"></span>' +
      esc(x.label || x.d.short) + '</button>';
  }).join('');
}
function tblHeadHtml(id, list, view, title){
  var st = blk(id), open = st.tbl === true;
  var n = blockSeries(list, view).filter(function(x){ return vis(id, x.key); }).length;
  var ps = winPeriods(id, list, view);
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' + esc(title) +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' +
    n + ' series over ' + ps.length + ' periods</span>';
}
function chartBlockHtml(id, list, view, opts){
  opts = opts || {};
  var st = blk(id);
  if (!blockSeries(list, view).length) return '';            // rule 6 — nothing, never broken
  return '<div class="sg-chartblock" data-sgblock="' + esc(id) + '">' +
    (opts.modes ? modesHtml(id, opts) : '') +
    '<div class="rs-legend">' + chipsHtml(id, list, view, opts.firstIsTarget) + '</div>' +
    '<div class="sg-chartwrap" style="height:' + (opts.height || 280) + 'px">' +
      '<canvas id="sgCv-' + esc(id) + '"></canvas></div>' +
    sliderHtml(id) +
    '<div class="rs-collap">' +
      '<button type="button" class="rs-collap-h" data-sgtblb="' + esc(id) + '">' +
        tblHeadHtml(id, list, view, opts.tableTitle || 'Period detail') + '</button>' +
      '<div class="rs-collap-b" id="sgTblBody-' + esc(id) + '"' + (st.tbl === true ? '' : ' hidden') + '>' +
        '<div class="rs-tablewrap" id="sgTbl-' + esc(id) + '"></div>' +
      '</div></div></div>';
}
function buildChartBlock(id, list, view, opts){
  opts = opts || {};
  var el = document.getElementById('sgCv-' + id);
  if (!el || !el.offsetParent) return;
  var st = blk(id);
  // Ask Chart.js, don't trust the stashed handle. A state reset elsewhere can drop `st.chart`
  // while the canvas still carries a live chart; then `new Chart` on it throws and the pane
  // renders nothing. getChart(el) is the only source of truth about what owns this canvas.
  var live = st.chart || Chart.getChart(el);
  if (live){ live.destroy(); st.chart = null; }
  var ps = winPeriods(id, list, view);
  if (!ps.length) return;
  var ser = blockSeries(list, view).filter(function(x){ return vis(id, x.key); });
  function money(u){ return u === 'usdM' || u === 'eps'; }
  var mode = st.mode || 'amt';
  var allPs = blockPeriods(id, list, view);
  var vals = ser.map(function(x){ return seriesValues(id, x, allPs, view, mode); });
  // Share re-bases against the visible money series only.
  var totals = {};
  if (mode === 'share') allPs.forEach(function(p){
    var t = 0; ser.forEach(function(x, i){ if (money(x.d.unit) && vals[i][p] != null) t += vals[i][p]; });
    totals[p] = t;
  });
  var datasets = [], needY2 = false, y2unit = null;
  var growAmt = mode === 'growth' && st.growUnit === 'amt';
  ser.forEach(function(x, i){
    var m = money(x.d.unit) || (mode !== 'amt' && !growAmt) || (growAmt && money(x.d.unit));
    if (!m){ needY2 = true; y2unit = y2unit || x.d.unit; }
    var data = ps.map(function(p){
      var v = vals[i][p];
      if (v == null) return null;
      if (mode === 'share') return (money(x.d.unit) && totals[p]) ? v / totals[p] * 100 : null;
      if (mode === 'growth') return growAmt ? v / 1000 : v * 100;
      return (x.d.unit === 'usdM') ? v / 1000 : (x.d.unit === 'pct' ? v * 100 : v);
    });
    var isTarget = opts.firstIsTarget && i === 0;
    var color = !m ? RS_CONS : (isTarget ? RS_ACT : (SG_RAMP[i] || SUMMIT_MUTE));
    datasets.push((m && opts.bars && !isTarget)
      ? { label: x.label || x.d.short, data: data, type: 'bar', backgroundColor: color,
          maxBarThickness: 34, order: 3, yAxisID: 'y' }
      : { label: x.label || x.d.short, data: data, type: 'line', yAxisID: m ? 'y' : 'y2',
          borderColor: color, backgroundColor: color, borderWidth: isTarget ? 2.5 : 2,
          borderDash: m ? [] : [5, 4], pointRadius: 2, tension: 0.25, order: isTarget ? 1 : 2 });
  });
  var f = firstFwd(id, list, view, ps);
  var scales = {
    x: { grid: { display: false }, stacked: mode === 'share' || (opts.stack && mode === 'amt' && st.stack !== false),
         ticks: { color: function(c){ return (f >= 0 && c.index >= f) ? 'rgba(0,0,0,0)' : '#5b6673'; } } },
    // Both y-axes on the right, stacked by weight (§0.4). A HIGHER weight sits further from the
    // plot, so the money axis takes the default 0 and stays inboard.
    y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' },
         min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
         stacked: mode === 'share' || (opts.stack && mode === 'amt' && st.stack !== false),
         ticks: { callback: function(v){ return (mode === 'amt' || growAmt) ? '$' + v + 'B' : v.toFixed(0) + '%'; } } }
  };
  if (needY2) scales.y2 = { position: 'right', weight: 1, grid: { display: false },
    ticks: { callback: function(v){
      return y2unit === 'pct' ? v.toFixed(0) + '%' : y2unit === 'days' ? v.toFixed(0) + 'd' : v.toFixed(2) + '×'; } } };
  st.chart = new Chart(el.getContext('2d'), {
    data: { labels: ps, datasets: datasets },
    options: { responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, rsFwdZone: { from: f },
        sgLabels: { on: st.labels === true, fmt: function(v){
          return (mode === 'amt' || growAmt) ? '$' + fmtNum(v) + 'B'
               : mode === 'share' || mode === 'growth' ? fmtNum(v) + '%'
               : fmtNum(v); } },
        sgTotals: (opts.totals && mode === 'amt') ? { vals: ps.map(function(p){
            var t = null;
            ser.forEach(function(x, i){
              if (!money(x.d.unit)) return;
              var v = vals[i][p]; if (v == null) return;
              t = (t == null ? 0 : t) + v;
            });
            return t;
          }), fmt: function(v){ return '$' + (v / 1000).toFixed(0) + 'B'; } } : false,
        tooltip: { callbacks: { label: function(c){
          var x = ser[c.datasetIndex], p = ps[c.dataIndex], v = vals[c.datasetIndex][p];
          var txt = mode === 'amt' ? fmtVal(v, x.d.unit)
                  : mode === 'growth' ? (growAmt ? (v >= 0 ? '+' : '') + fmtVal(v, 'usdM') : fmtVal(v, 'pct'))
                  : (totals[p] ? fmtVal(v / totals[p], 'pct') : '—');
          return (x.label || x.d.short) + ': ' + txt + (x.d.act[p] == null ? '  (est.)' : '');
        } } } },
      scales: scales },
    plugins: [rsFwdZone, sgTotals, sgLabels]
  });
  rsAttachBrush(el, st.chart,
    function(a, b2){ var all = blockPeriods(id, list, view); var lo = st.win ? st.win[0] : 0;
                     st.win = [lo + a, Math.min(lo + b2, all.length - 1)]; renderBlock(id, list, view, opts); },
    function(v1, v2){ st.yr = [v1, v2]; buildChartBlock(id, list, view, opts); },
    function(){ st.win = null; st.yr = null; renderBlock(id, list, view, opts); });
}
function renderTableBlock(id, list, view, opts){
  opts = opts || {};
  var el = document.getElementById('sgTbl-' + id);
  if (!el) return;
  var ps = winPeriods(id, list, view);
  var ser = blockSeries(list, view).filter(function(x){ return vis(id, x.key); });   // SAME predicate
  var f = firstFwd(id, list, view, ps);
  var h = '<div class="rs-ft-cap">' + esc(opts.caption || '') +
    ' · money in US$ billions, other units as shown · <span class="rs-ft-e">E</span> = estimate</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  ps.forEach(function(p, i){
    var e = f >= 0 && i >= f;
    h += '<th class="' + (e ? 'rs-ft-este' : '') + '">' + esc(p) + (e ? ' <span class="rs-ft-e">E</span>' : '') + '</th>';
  });
  h += '</tr></thead><tbody>';
  function line(label, d, cls){
    var r = '<tr class="rs-ft-' + cls + '"><td class="rs-ft-h">' + esc(label) + '</td>';
    ps.forEach(function(p, j){
      var e = f >= 0 && j >= f;
      var v = d.act[p] != null ? d.act[p] : d.est[p];
      r += '<td class="' + (e ? 'rs-ft-este' : '') + (v == null ? ' rs-ft-nil' : '') + '">' + fmtVal(v, d.unit) + '</td>';
    });
    return r + '</tr>';
  }
  var mode = blk(id).mode || 'amt';
  var allPs = blockPeriods(id, list, view);
  var vals = ser.map(function(x){ return seriesValues(id, x, allPs, view, mode); });
  var totals = {};
  if (mode === 'share') allPs.forEach(function(p){
    var t = 0; ser.forEach(function(x, i){ if ((x.d.unit === 'usdM' || x.d.unit === 'eps') && vals[i][p] != null) t += vals[i][p]; });
    totals[p] = t;
  });
  ser.forEach(function(x, i){
    var shown = {}, u = modeUnit(id, mode, x.d.unit);
    allPs.forEach(function(p){
      var v = vals[i][p]; if (v == null) return;
      shown[p] = mode === 'share' ? (totals[p] ? v / totals[p] : null) : v;
    });
    h += line((opts.prefix ? opts.prefix(i, ser.length) : '') + (x.label || x.d.short),
              { act: shown, est: {}, unit: u }, 'main');
  });
  (opts.extraRows || []).forEach(function(k){
    var d = sgResolve(k, view);
    if (d) h += line(d.short, d, 'sub');
  });
  el.innerHTML = h + '</tbody></table></div>';
}
// The window control: a dot per available period, two handles, and the ends named. Same shape as
// the Results engine's so the two tabs are one instrument, not two. Dragging on the plot sets the
// same `st.win`, so the slider always reflects a zoom and a zoom always moves the slider.
function sliderHtml(id){
  return '<div class="sg-controls" data-sgsl="' + esc(id) + '">' +
    '<div class="sg-slider">' +
      '<div class="sg-track"><div class="sg-fill" id="sgFill-' + esc(id) + '"></div></div>' +
      '<div class="rs-ticks" id="sgTicks-' + esc(id) + '"></div>' +
      '<input type="range" id="sgMin-' + esc(id) + '" min="0" max="1" value="0" step="1" aria-label="Start period">' +
      '<input type="range" id="sgMax-' + esc(id) + '" min="0" max="1" value="1" step="1" aria-label="End period">' +
    '</div>' +
    '<div class="sg-ends"><span id="sgEnd0-' + esc(id) + '"></span>' +
      '<span id="sgEnd1-' + esc(id) + '"></span></div></div>';
}
function renderSlider(id, list, view){
  var all = blockPeriods(id, list, view), n = all.length;
  var mn = document.getElementById('sgMin-' + id), mx = document.getElementById('sgMax-' + id);
  if (!mn || !mx || n < 2) return;
  var st = blk(id);
  var lo = st.win ? Math.max(0, Math.min(st.win[0], n - 1)) : 0;
  var hi = st.win ? Math.max(lo, Math.min(st.win[1], n - 1)) : n - 1;
  mn.max = n - 1; mx.max = n - 1; mn.value = lo; mx.value = hi;
  var fill = document.getElementById('sgFill-' + id);
  if (fill){ fill.style.left = (lo / (n - 1) * 100) + '%';
             fill.style.width = ((hi - lo) / (n - 1) * 100) + '%'; }
  var e0 = document.getElementById('sgEnd0-' + id), e1 = document.getElementById('sgEnd1-' + id);
  if (e0) e0.textContent = all[lo];
  if (e1) e1.textContent = all[hi];
  var ticks = document.getElementById('sgTicks-' + id);
  if (ticks){
    var f = firstFwd(id, list, view, all), h = '';
    for (var i = 0; i < n; i++){
      h += '<span class="rs-tick' + (i >= lo && i <= hi ? ' on' : '') +
        (f >= 0 && i >= f ? ' est' : '') + '" style="left:' + (i / (n - 1) * 100) +
        '%" title="' + esc(all[i]) + '"></span>';
    }
    ticks.innerHTML = h;
  }
}
// Every pane wires this: the slider is an `input` event, not a click, so it needs its own
// listener, and it only ever redraws charts — never the surrounding markup.
function sgWireSlider(wrap, renderCharts){
  wrap.addEventListener('input', function(ev){
    var box = ev.target.closest('[data-sgsl]');
    if (!box) return;
    var id = box.getAttribute('data-sgsl');
    var mn = document.getElementById('sgMin-' + id), mx = document.getElementById('sgMax-' + id);
    if (!mn || !mx) return;
    var lo = +mn.value, hi = +mx.value;
    if (lo > hi){ if (ev.target === mn) mx.value = hi = lo; else mn.value = lo = hi; }
    var st = blk(id);
    st.win = [lo, hi];
    st.yr = null;                       // a new window means the old y-range was for other data
    renderCharts();
  });
}
function renderBlock(id, list, view, opts){
  opts = opts || {};
  var host = document.querySelector('[data-sgblock="' + id + '"]');
  if (host){
    var leg = host.querySelector('.rs-legend');
    if (leg) leg.innerHTML = chipsHtml(id, list, view, opts.firstIsTarget);
    var th = host.querySelector('[data-sgtblb]');
    if (th) th.innerHTML = tblHeadHtml(id, list, view, opts.tableTitle || 'Period detail');
  }
  buildChartBlock(id, list, view, opts);
  renderTableBlock(id, list, view, opts);
  renderSlider(id, list, view);
}

// ─── the segment's top line, rendered BY THE RESULTS ENGINE ───────────────────────────────────
// §0.1 path 1: a metric over time is a dataset, not a canvas. Composing one here and registering
// it hands the whole engine to this section — every mode, the presets, the slider, drag-to-zoom,
// the chips, the period table — instead of a second, worse implementation of all of it.
function segResultsKey(){ return _sg.ticker + '_SEG_' + String(_sg.seg).toUpperCase(); }
function buildSegResults(){
  var d = sgData(), s = sgSeg();
  // The segment top line opens on the REPORTED line alone. Summit and the Street are a different
  // question — "was this expected" — and this section asks "how big is it and how fast is it
  // moving". Both are one chip away.
  // No intro, no source line and no per-metric commentary: this block sits inside a section that
  // has already said what the segment is, and the Results pane says the rest. `source` is dropped
  // rather than copied — the provenance of these series belongs where they are the subject.
  var out = { updated: d.res.updated, intro: '', source: '', surprise: false, conv: false,
              defaultHidden: ['summit', 'cons'], views: {} };
  // Carry the vintage matrix through. These are the same metric keys the Results dataset carries,
  // so the segment's top line gets the "Estimates as of" axis for free — and without it the engine
  // correctly prints "no vintage matrix yet", which is true of the composed dataset and misleading
  // about the data.
  if (d.res.estMatrix) out.estMatrix = d.res.estMatrix;
  ['q', 'y'].forEach(function(v){
    var src = d.res.views[v]; if (!src) return;
    var metrics = {}, keys = [];
    ['rev', 'opinc'].forEach(function(dk){
      var spec = (s.drivers || {})[dk];
      if (!spec || !spec.from) return;
      var mk = spec.from.split(':')[1], m = src.metrics[mk];
      if (!m) return;
      // CLONE before blanking the note. These metric objects are the Results dataset's own; a
      // note deleted in place would disappear from Evolution ▸ Results too, which is where it
      // belongs and where it is the only commentary the reader gets.
      var copy = {}; for (var kk in m) copy[kk] = m[kk];
      copy.note = '';
      metrics[mk] = copy; keys.push(mk);
    });
    if (!keys.length) return;
    out.views[v] = { label: src.label, note: '',
      metrics: metrics,
      // The section key becomes the engine's element ids (rsChart-<k>, rsTable-<k>, the slider,
      // the collapsible). rsBuildChart looks its canvas up with document.getElementById, NOT
      // scoped to the pane — so a key of 'top' here collides with Evolution ▸ Results' own Top
      // Line block and the engine draws into whichever node comes first in the document. That is
      // the "hidden duplicate block stealing getElementById" failure the reference warns about.
      // Namespacing the key keeps the two instances apart.
      sections: [{ key: 'segtop', label: s.label + ' — top line', defaultMetric: keys[0],
                   groups: [{ label: 'Segment', keys: keys }] }] };
  });
  return out;
}

// ─── sections ─────────────────────────────────────────────────────────────────────────────────
function drill(id, title, body, needs){
  var open = _sg.open[id] === true;
  return '<div class="rs-collap sg-drill">' +
    '<button type="button" class="rs-collap-h" data-sgdrill="' + esc(id) + '">' +
      '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' + esc(title) +
      '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + '</span></button>' +
    '<div class="rs-collap-b"' + (open ? '' : ' hidden') + '>' +
      '<div class="sg-drill-b">' + body +
        (needs ? '<div class="sg-needs">⚑ ' + esc(needs) + '</div>' : '') +
      '</div></div></div>';
}
// `n` is kept in the signature — every call site passes it and it still orders the sections — but
// the numbered badge is no longer drawn (SAB, Sep 2026). The sections read as a sequence without
// being counted at the reader, and dropping one no longer leaves a gap in the numbering.
function sec(n, title, sub, body){
  return '<section class="sg-sec">' +
    '<div class="sg-sec-h">' + esc(title) +
      (sub ? '<span class="sg-sec-sub">' + esc(sub) + '</span>' : '') + '</div>' + body + '</section>';
}

// ─── our note on a segment — written, and editable, from the portal ───────────────────────────
// The filing is the fact; the note is our read, and the two must never be mistaken for each
// other, so the filing sits open at the top and the note lives behind a labelled dropdown with
// an OURS chip on it. The dataset ships a default; an edit made here overrides it for this
// browser. NOT SHARED YET — persisting to Supabase needs a `segment_notes` table, which only San
// or Oscar can create, so until then this is a device-local draft and says so.
var SG_NOTE_NS = 'summit.segnote.';
function noteKey(slot){ return SG_NOTE_NS + _sg.ticker + '.' + slot; }
function noteSaved(slot){ try { return localStorage.getItem(noteKey(slot)); } catch (e){ return null; } }
function noteOf(slot, fallback){ var v = noteSaved(slot); return v != null ? v : (fallback || ''); }
function noteWrite(slot, txt){
  try {
    if (txt == null) localStorage.removeItem(noteKey(slot));
    else localStorage.setItem(noteKey(slot), txt);
  } catch (e){}
}
// An OURS line anyone can rewrite from the portal. `slot` is what it is attached to — a segment,
// a product line — and it is the localStorage key, so two things never share a note.
function noteEditor(slot, fallback, opt){
  opt = opt || {};
  var editing = _sg.open['noteEdit'] === slot;
  var txt = noteOf(slot, fallback), edited = noteSaved(slot) != null;
  if (editing){
    return '<div class="sg-noteed">' + tierTag('OURS') +
      '<textarea class="sg-note-ta" id="sgNoteTa" rows="' + (opt.rows || 5) + '" placeholder="' +
        esc(opt.placeholder || 'In our words — the thing the filing does not say.') + '">' +
        esc(txt) + '</textarea>' +
      '<div class="sg-note-act">' +
        '<button type="button" class="sg-btn primary" data-sgnsave="' + esc(slot) + '">Save</button>' +
        '<button type="button" class="sg-btn" data-sgncancel="1">Cancel</button>' +
        (edited ? '<button type="button" class="sg-btn ghost" data-sgnreset="' + esc(slot) + '" ' +
                  'title="Go back to the note that ships with the dataset">Reset to default</button>' : '') +
        '<span class="sg-note-where">Saved in this browser only — not yet shared with the team.</span>' +
      '</div></div>';
  }
  return '<div class="sg-noteed">' + tierTag('OURS') +
    (txt ? '<p class="sg-note-t">' + esc(txt) + '</p>'
         : '<p class="sg-note-t empty">' + esc(opt.empty || 'Nothing written yet.') + '</p>') +
    '<div class="sg-note-act">' +
      '<button type="button" class="sg-btn" data-sgnedit="' + esc(slot) + '">' +
        (txt ? 'Edit' : 'Write one') + '</button>' +
      (edited ? '<span class="sg-note-where">Edited in this browser</span>' : '') +
    '</div></div>';
}
function noteHtml(s){
  var open = _sg.open['note'] === true;
  var slot = s.key, txt = noteOf(slot, s.summary || s.lede || '');
  return '<div class="rs-collap sg-note">' +
    '<button type="button" class="rs-collap-h" data-sgnote="1">' +
      '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' +
      (txt ? 'Our read on it' : 'Add our read on it') + tierTag('OURS') +
      '<span class="rs-collap-sub">' + (open ? 'hide' : (txt ? 'show' : 'nothing written yet')) +
      '</span></button>' +
    '<div class="rs-collap-b"' + (open ? '' : ' hidden') + '>' +
      noteEditor(slot, s.summary || s.lede || '', { rows: 6,
        placeholder: 'What this segment actually is, in our words — the thing the filing does not say.',
        empty: 'No note yet for this segment.' }) +
    '</div></div>';
}

function secSummary(s){
  // The filing's definition is the section — open, quoted, cited. Our interpretation is a second,
  // clearly separate thing behind a dropdown, so nobody reads our sentence as Amazon's.
  var body = '';
  if (s.tenK){
    body += sgTB('FILING', sgQuote(s.tenK.text,
      [s.tenK.where || '', s.tenK.cite || ''].filter(Boolean).join(' · '), s.tenK.url));
    if (s.tenK.needs) body += '<div class="sg-needs">⚑ ' + esc(s.tenK.needs) + '</div>';
  }
  body += noteHtml(s) +
    '<div class="sg-engine" id="sgEngine">' + (resultsHtml(segResultsKey()) || '') + '</div>';
  return sec(1, 'What it is', s.label, body);
}
// ─── master–detail: a row of cards, exactly one panel ────────────────────────────────────
// A drill folded inside a 200px card is unreadable, and dumping every tier of claim into it at
// once is a wall of text. So the cards stay a row you can scan, ONE panel opens underneath them
// pointing at the card it belongs to, and the panel splits its own content into tabs — the reader
// picks what to read instead of receiving all of it.
function sgPickKey(kind){ return 'pick-' + kind; }
function sgPicked(kind){ var v = _sg.open[sgPickKey(kind)]; return typeof v === 'number' ? v : null; }
function sgPtab(kind, i){ var v = _sg.open['ptab-' + kind + '-' + i]; return typeof v === 'number' ? v : 0; }

function sgQuote(text, cite, url){
  return '<blockquote class="sg-quote">' + esc(text) + '</blockquote>' +
    (cite ? '<p class="sg-cite">' + esc(cite) +
       (url ? ' · <a href="' + esc(url) + '" target="_blank" rel="noopener">read the filing</a>' : '') +
     '</p>' : '');
}
// One claim, one block, one rule between blocks. The tier chip says whose claim it is.
function sgTB(tier, inner){ return '<div class="sg-tb">' + (tier ? tierTag(tier) : '') + inner + '</div>'; }

function cardsHtml(kind, items, inlinePanel){
  var pick = sgPicked(kind);
  return '<div class="sg-cards sg-cards-' + esc(kind) + '">' + items.map(function(it, i){
    var open = i === pick;
    var inner = it.html || (
      '<span class="sg-card-n">' + esc(it.name) +
        (it.tag ? '<span class="sg-card-tag' + (it.tagKind ? ' tk-' + esc(it.tagKind) : '') + '">' +
          esc(it.tag) + '</span>' : '') + '</span>' +
      (it.code ? '<code class="sg-card-c">' + esc(it.code) + '</code>' : '') +
      (it.line ? '<span class="sg-card-l">' + esc(it.line) + '</span>' : ''));
    return '<div class="sg-card' + (open ? ' open' : '') + (it.mute ? ' mute' : '') +
        (it.on ? ' on' : '') + '" role="button" tabindex="0" aria-expanded="' + (open ? 'true' : 'false') +
        '" data-sgpick="' + esc(kind) + '|' + i + '">' + inner +
      '<span class="sg-card-f">' +
        '<span class="sg-card-go">' + (open ? 'close ▾' : 'detail ›') + '</span></span></div>' +
      (open && inlinePanel ? inlinePanel : '');
  }).join('') + '</div>';
}

function panelHtml(kind, items){
  var pick = sgPicked(kind);
  if (pick == null || !items[pick]) return '';
  var it = items[pick];
  var tabs = (it.tabs || []).filter(function(t){ return t && t.body; });
  if (!tabs.length) return '';
  var ti = Math.min(sgPtab(kind, pick), tabs.length - 1);
  return '<div class="sg-panel">' +
    '<div class="sg-panel-h"><span class="sg-panel-t">' + esc(it.name) + '</span>' +
      (it.sub ? '<span class="sg-panel-s">' + esc(it.sub) + '</span>' : '') +
      '<button type="button" class="sg-panel-x" data-sgpick="' + esc(kind) +
        '|close" aria-label="Close">✕</button></div>' +
    (tabs.length > 1 ? '<div class="sg-panel-tabs" role="tablist">' + tabs.map(function(t, j){
      return '<button type="button" role="tab" class="sg-panel-tab' + (j === ti ? ' active' : '') +
        '" data-sgptab="' + esc(kind) + '|' + j + '">' + esc(t.label) +
        (t.count ? '<span class="sg-panel-tc">' + t.count + '</span>' : '') + '</button>';
    }).join('') + '</div>' : '') +
    '<div class="sg-panel-b">' + tabs[ti].body +
      (it.foot ? '<div class="sg-needs">⚑ ' + esc(it.foot) + '</div>' : '') +
    '</div></div>';
}

// One registry so the markup pass and the click handler build the SAME items — two copies of the
// item list is how a highlighted card and its panel drift apart.
var SG_MD = {};
var SG_MD_INLINE = { inter: true };
function mdInner(kind, items){
  var pan = panelHtml(kind, items);
  return SG_MD_INLINE[kind] ? cardsHtml(kind, items, pan) : cardsHtml(kind, items) + pan;
}
function mdHtml(kind, s, view){
  return '<div class="sg-md" data-sgmd="' + esc(kind) + '">' +
    mdInner(kind, SG_MD[kind](s, view)) + '</div>';
}
// A panel can carry a chart (the revenue bridges do). Rendering the panel replaces the canvas,
// so the chart has to be rebuilt right after — never assume the old Chart object survived.
function renderMdChart(kind){
  var pick = sgPicked(kind);
  if (pick == null) return;
  var it = SG_MD[kind](sgSeg(), 'q')[pick];
  if (it && it.chart) renderBlock(it.chart.id, it.chart.list, it.chart.view, it.chart.opts);
}
function renderMd(kind){
  var host = document.querySelector('[data-sgmd="' + kind + '"]');
  if (!host) return;
  host.innerHTML = mdInner(kind, SG_MD[kind](sgSeg(), 'q'));
  renderMdChart(kind);
}

// ─── §2 what it sells ─────────────────────────────────────────────────────────────────────────
// Three tiers of claim, never blended: the FILING (quoted), the CALL (quoted and dated), and OURS
// (labelled). A reader has to tell at a glance which one they are looking at — "Amazon says" and
// "we think" carry completely different weight, and a tab that mixes them teaches nobody anything.
function slug(t){ return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function tierTag(kind){
  return '<span class="sg-tier sg-tier-' + kind.toLowerCase() + '">' + esc(kind) + '</span>';
}
SG_MD.prod = function(s){
  return (s.products || s.sells || []).map(function(it){
    var cu = it.customers || {}, named = cu.named || [], mg = it.management || [];
    var tabs = [];
    if (it.tenK) tabs.push({ label: 'Definition',
      body: sgTB('FILING', sgQuote(it.tenK.text, it.tenK.where)) });
    var who = '';
    if (cu.archetype) who += sgTB('FILING', sgQuote(cu.archetype.text, cu.archetype.where));
    if (named.length) who += sgTB('CALL', '<ul class="sg-named">' + named.map(function(n){
      return '<li><b>' + esc(n.name) + '</b><i>' + esc(n.q) + '</i><span>' + esc(n.what) +
             '</span></li>'; }).join('') + '</ul>');
    who += sgTB('', noteEditor('prod.' + s.key + '.' + slug(it.name), cu.note || '',
      { rows: 4, placeholder: 'What we make of who buys this line.',
        empty: 'No note yet on who buys this line.' }));
    if (cu.concentration) who += '<div class="sg-needs">⚑ ' + esc(cu.concentration) + '</div>';
    if (who) tabs.push({ label: 'Who buys it', count: named.length || 0, body: who });
    if (mg.length) tabs.push({ label: 'Commentary', count: mg.length,
      body: sgTB('CALL', '<ul class="sg-named">' + mg.map(function(m){
        return '<li><i>' + esc(m.q) + '</i><span>' + esc(m.text) + '</span></li>'; }).join('') + '</ul>') });
    return { name: it.name, line: it.what, foot: it.needs, tabs: tabs,
             tag: named.length ? named.length + ' named' : '' };
  });
};
function secProducts(s){
  var items = s.products || s.sells || [];
  if (!items.length) return '';
  return sec(2, 'What it sells', items.length + ' lines', mdHtml('prod', s));
}


// ─── §3 KPIs ──────────────────────────────────────────────────────────────────────────────────
function kpiSeriesList(s){
  return (s.kpis || []).filter(function(k){ return k.series; })
    .map(function(k){ return { key: k.series, ref: k.series, label: k.name }; });
}

function kpiGrowth(d, view, yoy){
  var ps = sgData().seg.axis[view], lag = yoy ? PPY[view] : 1;
  var have = ps.filter(function(p){ return d.act[p] != null || d.est[p] != null; });
  var last = have[have.length - 1];
  if (!last) return { v: null, p: null, g: null };
  var i = ps.indexOf(last), b = ps[i - lag];
  var v = d.act[last] != null ? d.act[last] : d.est[last];
  var bv = b == null ? null : (d.act[b] != null ? d.act[b] : d.est[b]);
  return { v: v, p: last, g: (bv == null || !bv) ? null : (v - bv) / Math.abs(bv) };
}
SG_MD.kpi = function(s, view){
  var yoy = blk('kpi').lag !== 'qoq';
  view = view || 'q';
  return (s.kpis || []).map(function(k){
    var d = k.series ? sgResolve(k.series, view) : null;
    var g = d ? kpiGrowth(d, view, yoy) : { v: null, p: null, g: null };
    // The chart follows the open card, so a card with no series has to say why the chart below is
    // not about it — otherwise the reader reads the chart as belonging to what they just opened.
    var tabs = [{ label: 'What it is',
      body: sgTB('OURS', '<p>' + esc(k.definition) + '</p>' +
        '<p class="sg-cite">Source: ' + esc(k.source || '—') +
        ' · reported ' + esc(k.periodicity || '—') + '</p>') +
        (k.series ? '' : '<div class="sg-needs">⚑ No series is loaded for this KPI, so there is ' +
          'nothing to chart. The chart below has fallen back to the first KPI that does have one.</div>') }];
    if (k.filing) tabs.push({ label: 'In the filing',
      body: sgTB('FILING', sgQuote(k.filing, k.filingWhere || '')) });
    return {
      name: k.name, foot: k.needs, tabs: tabs, mute: g.v == null,
      html: '<span class="sg-card-n">' + esc(k.name) + '</span>' +
        '<span class="sg-card-v">' +
          (g.v != null ? esc(fmtVal(g.v, k.unit || 'usdM')) : '<i>not a series</i>') + '</span>' +
        '<span class="sg-card-g">' + (g.g == null
          ? '<span class="sg-flat">' + esc(k.periodicity || 'not reported') + '</span>'
          : '<span class="' + (g.g >= 0 ? 'sg-up' : 'sg-dn') + '">' + (g.g >= 0 ? '▲ ' : '▼ ') +
            pctStr(Math.abs(g.g)) + '</span><span class="sg-card-p">' + esc(g.p) + ' · ' +
            (yoy ? 'YoY' : 'QoQ') + '</span>') + '</span>'
    };
  });
};
// Show only the series belonging to the open card (or the first chartable KPI when none is open).
function kpiSolo(s, list){
  var st = blk('kpi');
  var pick = sgPicked('kpi');
  var want = null;
  if (pick != null){
    var k = (s.kpis || [])[pick];
    if (k && k.series) want = k.series;
  }
  if (want == null) want = list.length ? list[0].key : null;
  list.forEach(function(x){ st.hidden[x.key] = x.key !== want; });
}
function secKpis(s, view){
  if (!s.kpis || !s.kpis.length) return '';
  var st = blk('kpi'), yoy = st.lag !== 'qoq';
  var list = kpiSeriesList(s);
  var lagToggle = '<div class="sg-ctrls"><div class="sg-ctrlg"><span class="rs-quick-l">Growth</span>' +
    '<div class="rs-views">' + [['yoy', 'YoY'], ['qoq', 'QoQ']].map(function(l){
      return '<button type="button" class="rs-view' + ((yoy ? 'yoy' : 'qoq') === l[0] ? ' active' : '') +
        '" data-sgkpilag="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div></div></div>';
  // The chart draws whatever card is open. Five KPIs sharing an axis is a picture of nothing — a
  // backlog in the hundreds of billions flattens a margin into the baseline — so opening a KPI
  // charts THAT one and hides the rest. The chips still turn any of them back on, which is how you
  // read one against another; picking a different card resets to that card alone.
  if (list.length && !st._seeded){ st._seeded = true; kpiSolo(s, list); }
  var body = (s.kpiNote ? '<p class="sg-lede">' + esc(s.kpiNote) + '</p>' : '') + lagToggle +
    mdHtml('kpi', s, view) +
    (list.length
      ? '<p class="sg-basis sg-charthint">The chart follows the KPI you open above. Add others with the chips to read one against another.</p>' +
        chartBlockHtml('kpi', list, view, kpiOpts(s))
      : '<div class="sg-needs">⚑ None of this segment’s KPIs has a loaded series yet.</div>');
  return sec(3, 'KPIs the company publishes', s.kpis.length + ' disclosed', body);
}


// ─── §4 revenue interactions ──────────────────────────────────────────────────────────────────
// Every P × Q this segment could have, whether or not the data exists to draw it. A relation with
// no series still belongs on screen: knowing advertising is impressions × price, and that Amazon
// publishes neither term, is worth more than the relation quietly not being there.
function bridgeList(b){ return b.terms.concat([b.target]).map(function(k){ return { key: k, ref: k }; }); }
function bridgeOpts(s, b){
  return { bars: true, tableTitle: 'Bridge detail', height: 300,
           caption: s.label + ' · ' + (b.view === 'q' ? 'quarterly' : 'fiscal years'),
           extraRows: s.highlights || [],
           prefix: function(i, n){ return i === n - 1 ? '= ' : '× '; } };
}
// A chart is earned, not owed: every term must resolve, and there must be enough points for a
// shape to mean anything. Annual is the floor on frequency; four points is the floor on that.
var SG_MIN_POINTS = 4;
function interactionChartable(s, it){
  if (!it.bridge) return null;
  var b = (s.bridges || []).filter(function(x){ return x.key === it.bridge; })[0];
  if (!b) return null;
  var list = bridgeList(b);
  var ser = blockSeries(list, b.view);
  if (ser.length < list.length) return null;
  var ps = sgData().seg.axis[b.view].filter(function(p){
    return ser.every(function(x){ return x.d.act[p] != null || x.d.est[p] != null; }); });
  return ps.length >= SG_MIN_POINTS ? b : null;
}
// Which relations can be charted at all. Each one now carries its own chart inside its panel,
// so there is no "the" bridge any more — opening a card IS choosing which relation you are reading.
function interactionAble(s){
  return (s.interactions || []).map(function(it){ return interactionChartable(s, it); });
}
SG_MD.inter = function(s){
  var able = interactionAble(s);
  return (s.interactions || []).map(function(it, i){
    var b = able[i];
    // The description and the picture belong to the same object, so they live in the same panel.
    // A relation with no series still opens — the description is the whole point of listing it.
    var tabs = [{ label: 'What it says',
      body: '<p class="sg-p">' + esc(it.why) + '</p>' + sgTB('OURS', '<p>' + esc(it.data) + '</p>') }];
    var chart = null;
    if (b){
      chart = { id: 'bridge', list: bridgeList(b), view: b.view, opts: bridgeOpts(s, b) };
      tabs.push({ label: 'Chart',
        body: '<div class="sg-identity"><code>' + esc(it.relation) + '</code>' +
          '<span class="sg-kind' + (b.kind === 'independent' ? ' ok' : '') + '">' + esc(b.kind) +
          '</span></div>' + chartBlockHtml('bridge', chart.list, chart.view, chart.opts) +
          '<div class="ov-fynote">' + esc(b.note) + '</div>' });
    }
    return {
      name: it.name, code: it.relation, line: (it.lines || []).join(' · '),
      mute: !b, chart: chart,
      tag: b ? 'chart inside' : 'no series', tagKind: b ? 'on' : 'no',
      tabs: tabs
    };
  });
};
function secInteractions(s){
  var items = s.interactions || [];
  if (!items.length) return '';
  var n = interactionAble(s).filter(Boolean).length;
  return sec(4, 'Revenue interactions', items.length + ' relations · ' + n + ' with data',
    mdHtml('inter', s));
}


// ─── §5 what management has said ──────────────────────────────────────────────────────────────
// Read from the SAME record the Notes tab curates. That curation IS the filter: it keeps the
// comments that named a driver and drops the ones that only restated the number.
function themesFor(s){
  var src = THEME_SRC[_sg.ticker] || [], map = THEME_SEG[_sg.ticker] || {};
  return src.filter(function(t){ return map[t.seg] === s.key; });
}
function secManagement(s){
  var themes = themesFor(s);
  if (!themes.length){
    return sec(5, 'What management has said', 'nothing on record',
      '<div class="sg-needs">⚑ The theme record carries no entries for this segment yet. It is curated in the Notes tab — add a theme there and it appears here.</div>');
  }
  var byQ = blk('mgmt').lag !== 'theme';
  var toggle = '<div class="sg-ctrls"><div class="sg-ctrlg"><span class="rs-quick-l">Order by</span>' +
    '<div class="rs-views">' + [['q', 'Quarter'], ['theme', 'Theme']].map(function(l){
      return '<button type="button" class="rs-view' + ((byQ ? 'q' : 'theme') === l[0] ? ' active' : '') +
        '" data-sgmgmt="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div></div></div>';

  // Every group is shut until asked for. Fifteen quarters of commentary opened at once is the
  // wall this section kept turning into; the list of titles is the index, and the reader opens
  // the one they want.
  function group(id, title, meta, count, inner){
    var open = _sg.open['mq-' + id] === true;
    return '<div class="sg-mq' + (open ? ' open' : '') + '">' +
      '<div class="sg-mq-h" role="button" tabindex="0" data-sgmq="' + esc(id) + '"' +
        ' aria-expanded="' + (open ? 'true' : 'false') + '">' +
        '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' +
        '<span class="sg-mq-n">' + esc(title) + '</span>' +
        (meta ? '<span class="sg-mq-m">' + esc(meta) + '</span>' : '') +
        '<span class="sg-mq-c">' + count + (count === 1 ? ' note' : ' notes') + '</span></div>' +
      '<div class="sg-mq-b"' + (open ? '' : ' hidden') + '>' + inner + '</div></div>';
  }

  var body;
  if (byQ){
    var qs = [], map = {};
    themes.forEach(function(t){ (t.updates || []).forEach(function(u){
      if (!map[u.q]){ map[u.q] = []; qs.push(u.q); }
      map[u.q].push({ theme: t.theme, items: u.items }); }); });
    qs.reverse();
    body = qs.map(function(q){
      var n = map[q].reduce(function(a, e){ return a + e.items.length; }, 0);
      return group('q-' + slug(q), q, map[q].map(function(e){ return e.theme; }).join(' · '), n,
        map[q].map(function(e){
          return '<div class="sg-mq-t"><b>' + esc(e.theme) + '</b><ul class="sg-named">' +
            e.items.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
        }).join(''));
    }).join('');
  } else {
    body = themes.map(function(t){
      var ups = (t.updates || []).slice().reverse();
      var n = ups.reduce(function(a, u){ return a + u.items.length; }, 0);
      return group('t-' + slug(t.theme), t.theme,
        ((t.st && t.st.k) || '') + (t.st && t.st.since ? ' · since ' + t.st.since : ''), n,
        (t.why ? '<p class="sg-basis">' + esc(t.why) + '</p>' : '') +
        ups.map(function(u){
          return '<div class="sg-mq-t"><b>' + esc(u.q) + '</b><ul class="sg-named">' +
            u.items.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
        }).join(''));
    }).join('');
  }
  return sec(5, 'What management has said', themes.length + ' themes on the record',
    '<p class="sg-lede">' + tierTag('CALL') +
    'The curated record from the Notes tab — the comments that named a driver, not the ones that restated the number. Order by quarter to read the arc, or by theme to follow one thread.</p>' +
    toggle + '<div class="sg-mgmt">' + body + '</div>');
}


// ─── Top Line ▸ General ────────────────────────────────────────────────────────────────────────
// The whole company in one screen: how the company describes its own structure, a card per segment
// with its size and growth, the revenue split, and the ways the segments act on each other. The
// detail lives next door in Segments — this pane answers "how big, how fast, and what touches what".
function ovList(d, key){
  return d.seg.segments.map(function(s){
    var spec = (s.drivers || {})[key];
    return spec && spec.from ? { key: s.key + ':' + key, ref: spec.from, label: s.label } : null;
  }).filter(Boolean);
}
var OV_REV = { modes: true, views: true, bars: true, stack: true, totals: true,
               tableTitle: 'Revenue detail', height: 320, caption: 'Segment revenue' };

// The size-and-growth card. Growth reads in whatever unit the chart below is set to, so the
// number on the card and the number on the chart are never two different claims.
function ovCards(d, view){
  var st = blk('ovrev');
  var amt = st.mode === 'growth' && st.growUnit === 'amt';
  var ps = d.seg.axis[view] || [];
  return '<div class="sg-ovcards">' + d.seg.segments.map(function(s){
    var spec = (s.drivers || {}).rev;
    var dd = spec && spec.from ? sgResolve(spec.from, view) : null;
    var last = null, base = null, lp = null;
    if (dd){
      var have = ps.filter(function(p){ return dd.act[p] != null || dd.est[p] != null; });
      lp = have[have.length - 1];
      if (lp){
        var i = ps.indexOf(lp), b = ps[i - PPY[view]];
        last = dd.act[lp] != null ? dd.act[lp] : dd.est[lp];
        base = b == null ? null : (dd.act[b] != null ? dd.act[b] : dd.est[b]);
      }
    }
    var g = (last == null || base == null || !base) ? null
          : (amt ? last - base : (last - base) / Math.abs(base));
    var open = _sg.open['ovcard-' + s.key] === true;
    return '<div class="sg-ovcard">' +
      '<div class="sg-ovcard-top" role="button" tabindex="0" data-sgovcard="' + esc(s.key) + '"' +
        ' aria-expanded="' + (open ? 'true' : 'false') + '">' +
        '<div class="sg-ovcard-h"><span class="sg-ovcard-ic">' + (open ? '▾' : '▸') + '</span>' +
          '<span class="sg-ovcard-n">' + esc(s.label) + '</span>' +
          '<span class="sg-ovcard-more">' + (open ? 'hide' : 'what it does') + '</span></div>' +
        '<div class="sg-ovcard-v">' + (last == null ? '—' : esc(fmtVal(last, 'usdM'))) +
          '<span>' + (lp ? esc(lp) + ' net sales' : 'no series') + '</span></div>' +
        '<div class="sg-ovcard-r">' +
          '<div><b>' + (g == null ? '—'
            : (amt ? (g >= 0 ? '+' : '−') + esc(fmtVal(Math.abs(g), 'usdM'))
                   : (g >= 0 ? '▲ ' : '▼ ') + pctStr(Math.abs(g)))) + '</b>' +
            '<span>' + (amt ? '$ added YoY' : 'growth YoY') + '</span></div>' +
          '<div><b>' + ((last == null || !ovTotal(d, view, lp)) ? '—'
            : pctStr(last / ovTotal(d, view, lp))) + '</b><span>of group revenue</span></div>' +
        '</div></div>' +
      '<div class="sg-ovcard-b"' + (open ? '' : ' hidden') + '>' +
        (s.brief ? '<p>' + esc(s.brief) + '</p>' : '') +
        ((s.sells || []).length
          ? '<ul class="sg-ovcard-l">' + s.sells.map(function(x){
              return '<li><b>' + esc(x.name) + '</b> — ' + esc(x.what) + '</li>'; }).join('') + '</ul>'
          : '') +
      '</div></div>';
  }).join('') + '</div>';
}
function ovTotal(d, view, p){
  if (!p) return 0;
  return d.seg.segments.reduce(function(a, s){
    var spec = (s.drivers || {}).rev;
    var dd = spec && spec.from ? sgResolve(spec.from, view) : null;
    if (!dd) return a;
    var v = dd.act[p] != null ? dd.act[p] : dd.est[p];
    return a + (v || 0);
  }, 0);
}

export function segmentsOverviewHtml(ticker){
  var d = SEGMENTS_DATA[ticker];
  if (!d) return '<p class="sg-lede">No segments dataset for ' + esc(ticker) + '.</p>';
  _sg.ticker = ticker;
  var ov = d.seg.overview || {};
  var view = blk('ovrev').view || 'q';
  // Was a paragraph of ours explaining the segments — which is what the cards underneath are for.
  // All that belongs at the top is how the COMPANY describes its own structure, word for word.
  var body = (ov.tenK
      ? sgTB('FILING', sgQuote(ov.tenK.text, ov.tenK.where))
      : (ov.lede ? '<p class="sg-lede">' + esc(ov.lede) + '</p>' : '')) + ovCards(d, 'q');
  var h = '<div class="sg-wrap" id="sgOvWrap">' +
    sec(1, 'The segments', d.seg.segments.length + ' reportable', body) +
    sec(2, 'How revenue divides', 'amount · share · growth',
      chartBlockHtml('ovrev', ovList(d, 'rev'), view, OV_REV) +
      '<div class="ov-fynote">The number above each column is the group total. <b>Share</b> gives the composition and <b>Growth</b> the rate; <b>Side by side</b> drops the stacking when you want to compare segments to each other rather than to the whole. Share re-bases on whatever is visible, so hiding a segment with its chip asks “of the rest, how much is this”. What each segment earns on this revenue is in Bottom Line.</div>');
  // "How the segments act on each other" was section 3 here and is no longer rendered (SAB, Sep
  // 2026). General now answers two questions and stops: what the segments ARE, and how the revenue
  // divides between them.
  // The four cards are NOT rendered anywhere else — the "Revenue interactions" section further up
  // is a different thing (per-segment `s.interactions`, on the Segments sub-tab). Their content is
  // still carried in the dataset at `seg.overview.interactions`, so restoring the section or moving
  // it to another sub-tab is one call to sec(); it is simply not drawn today.
  return h + '<div class="ov-fynote sg-src">' + esc(d.seg.source) + '</div></div>';
}
function renderOverview(){
  var d = sgData(); if (!d) return;
  renderBlock('ovrev', ovList(d, 'rev'), blk('ovrev').view || 'q', OV_REV);
}
export function initSegmentsOverview(root, ticker){
  var d = SEGMENTS_DATA[ticker]; if (!d) return;
  _sg.ticker = ticker;
  var host = root || document;
  var wrap = host.querySelector ? host.querySelector('#sgOvWrap') : null;
  if (!wrap) return;
  if (!wrap.__sgWired){
    wrap.__sgWired = true;
    wrap.addEventListener('keydown', function(ev){
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var t = ev.target.closest('[data-sgovcard]');
      if (t){ ev.preventDefault(); t.click(); }
    });
    wrap.addEventListener('click', function(ev){
      // The cards read off the chart's own mode, so a control change re-renders the whole pane.
      function redraw(){
        var parent = wrap.parentElement;
        wrap.outerHTML = segmentsOverviewHtml(_sg.ticker);
        var fresh = parent.querySelector('#sgOvWrap');
        if (fresh){ fresh.__sgWired = false; initSegmentsOverview(parent, _sg.ticker); }
      }
      var md = ev.target.closest('[data-sgmode]');
      if (md){ var mp = md.getAttribute('data-sgmode').split('|');
               var mst = blk(mp[0]); mst.mode = mp[1]; mst.yr = null; redraw(); return; }
      var gu = ev.target.closest('[data-sggrow]');
      if (gu){ var gp = gu.getAttribute('data-sggrow').split('|');
               var gst = blk(gp[0]); gst.growUnit = gp[1]; gst.yr = null; redraw(); return; }
      var sk = ev.target.closest('[data-sgstack]');
      if (sk){ var sp2 = sk.getAttribute('data-sgstack').split('|');
               var sst = blk(sp2[0]); sst.stack = sp2[1] === '1'; sst.yr = null; redraw(); return; }
      var vw = ev.target.closest('[data-sgview]');
      if (vw){ var vp = vw.getAttribute('data-sgview').split('|');
               var vst = blk(vp[0]); vst.view = vp[1];
               vst.win = null; vst.yr = null;   // a different axis: the window and range mean nothing
               redraw(); return; }
      var lb = ev.target.closest('[data-sglab]');
      if (lb){ var lp = lb.getAttribute('data-sglab').split('|');
               blk(lp[0]).labels = lp[1] === '1'; redraw(); return; }
      var gl = ev.target.closest('[data-sglag]');
      if (gl){ var glp = gl.getAttribute('data-sglag').split('|');
               var glst = blk(glp[0]); glst.glag = glp[1]; glst.yr = null; redraw(); return; }
      var oc = ev.target.closest('[data-sgovcard]');
      if (oc){
        var ck = 'ovcard-' + oc.getAttribute('data-sgovcard');
        var nowOpen = !(_sg.open[ck] === true);
        _sg.open[ck] = nowOpen;
        var ob = oc.parentElement.querySelector('.sg-ovcard-b');
        if (ob) ob.hidden = !nowOpen;
        oc.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
        var oi = oc.querySelector('.sg-ovcard-ic');
        if (oi) oi.textContent = nowOpen ? '▾' : '▸';
        var om = oc.querySelector('.sg-ovcard-more');
        if (om) om.textContent = nowOpen ? 'hide' : 'what it does';
        return;
      }
      var lg = ev.target.closest('[data-sgleg]');
      if (lg){ var parts = lg.getAttribute('data-sgleg').split('|');
               var st = blk(parts[0]); st.hidden[parts[1]] = !st.hidden[parts[1]];
               renderOverview(); return; }
      var tb = ev.target.closest('[data-sgtblb]');
      if (tb){ var bid = tb.getAttribute('data-sgtblb'), bst = blk(bid);
               bst.tbl = !(bst.tbl === true);
               var bd = document.getElementById('sgTblBody-' + bid);
               if (bd) bd.hidden = !(bst.tbl === true);
               renderOverview(); return; }
    });
    sgWireSlider(wrap, renderOverview);
  }
  renderOverview();
}

// ─── Top Line ▸ Customers ──────────────────────────────────────────────────────────────────────
// Who buys, in three separate registers that must never merge:
//   the CLASSES the company names for itself, verbatim from Item 1;
//   the NAMES it has said out loud on a call — a self-selected list, and short;
//   and the COUNTERPARTY census from Bloomberg SPLC — somebody else's disclosure about this
//   company, which is the only source that does not depend on the company choosing to speak.
// For Amazon the headline is an absence: the filing discloses no customer concentration at all,
// so nothing on this tab can be read as "the biggest clients". The tab leads with that.
function custData(){ var d = sgData(); return (d && d.seg.customers) || null; }

// Every customer the company has named on a call, pulled out of the product lines, newest first.
function custNamed(d){
  var out = [];
  (d.seg.segments || []).forEach(function(sg){
    (sg.products || []).forEach(function(pr){
      (((pr.customers || {}).named) || []).forEach(function(n){
        out.push({ name: n.name, q: n.q, what: n.what, seg: sg.label, line: pr.name });
      });
    });
  });
  return out.sort(function(a, b){ return String(b.q).localeCompare(String(a.q)); });
}

// The SPLC census, or the shape of its absence. Short either way — the long version is one click
// down, like everything else on this tab.
function custSplcSection(c, n){
  var sp = c.splc;
  if (!sp || !sp.customers || !sp.customers.length){
    return sec(n, 'Who has said they buy from Amazon', 'Bloomberg SPLC · not loaded yet',
      '<p class="sg-lede">' + tierTag('COUNTERPARTY') +
      'The other side of the transaction: not what Amazon says about its customers, but what its ' +
      'customers filed about Amazon.</p>' +
      drill('splc', 'Why this is empty, and what fills it',
        '<p>Bloomberg\'s Supply Chain Analysis assembles counterparty disclosures into a customer ' +
        'census — the only customer list here that does not depend on Amazon choosing to speak. ' +
        'SPLC is a terminal screen, not a BQL function on our tier, so it has to come in as an ' +
        'export:</p>' +
        '<code class="sg-empty-c">py scripts/segments/load_splc.py AMZN &lt;export.csv&gt;</code>' +
        '<p class="sg-cite">The loader normalises the columns, prints the mapping so it can be ' +
        'checked, and computes the one number that decides how this may be drawn: what share of ' +
        'revenue the named customers account for between them. Under ~10% it renders as a list of ' +
        'disclosed relationships, never as a concentration chart.</p>'));
  }
  var rows = sp.customers.slice().sort(function(a, b){ return (b.amtM || 0) - (a.amtM || 0); });
  // How much of the company this register actually reaches. Deliberately the FIRST thing said: a
  // census this thin is a fact about the SOURCE, and reading it as concentration would be wrong.
  var covPct = (sp.sizedSumM != null && sp.revBaseM) ? (sp.sizedSumM / sp.revBaseM * 100) : null;
  var cov = covPct != null
    ? 'The ' + sp.sized + ' sized relationships add to about <b>$' + (sp.sizedSumM / 1000).toFixed(1) +
      'B</b> as filed — under <b>' + (covPct < 0.2 ? '0.2' : covPct.toFixed(1)) + '%</b> of ' +
      esc(sp.revBaseLabel || 'revenue') + '. Read that as the reach of the register, not as ' +
      'concentration: this company\'s customers are consumers and small sellers, and consumers do ' +
      'not file.'
    : 'None of them carries a size, so they can be listed but not ranked.';
  return sec(n, 'Who has said they buy from Amazon', sp.named + ' named · ' + sp.sized + ' sized',
    '<p class="sg-lede">' + tierTag('COUNTERPARTY') +
      'Assembled by Bloomberg from what these companies filed about Amazon, not from what Amazon ' +
      'filed about them. ' + cov + '</p>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr>' +
      '<th class="rs-ft-h">Customer</th><th>Ticker</th><th>What the relationship is</th>' +
      '<th>Size as filed</th><th>Share of their cost</th><th>Basis</th></tr></thead><tbody>' +
      rows.map(function(r){
        // Periods differ per counterparty and are NOT annualised, so each size is shown with the
        // period it belongs to. A blank size is a disclosed relationship Bloomberg never sized.
        var size = r.amtM == null ? '<span class="rs-ft-nil">not sized</span>'
          : '$' + (r.amtM >= 1000 ? (r.amtM / 1000).toFixed(1) + 'B' : r.amtM.toFixed(1) + 'M') +
            ' <span class="rs-ft-dim">· ' + esc(r.period || '') + '</span>';
        return '<tr class="rs-ft-main"><td class="rs-ft-h">' + esc(r.name) + '</td>' +
          '<td>' + esc(r.ticker || '—') + '</td><td>' + esc(r.what || r.relationship || '—') + '</td>' +
          '<td>' + size + '</td>' +
          '<td>' + (r.theirPct == null ? '<span class="rs-ft-nil">—</span>' : r.theirPct.toFixed(1) + '%') + '</td>' +
          '<td>' + esc(r.basis || '—') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
    '<p class="sg-cite">Share of their cost = SPLC cost percentage: how much of that counterparty\'s ' +
      'tracked cost goes to this company. ' + esc(sp.source) +
      (sp.file ? ' · ' + esc(sp.file) : '') + '</p>');
}

// ── the two card decks, in the same master-detail language as the rest of Top Line ────────────
// A name is the index; the words behind it are one click down. The filing's own paragraphs run
// from four lines to twenty, so putting any of them on a card is what made this tab a wall.
SG_MD.cclass = function(){
  var c = custData() || {};
  return (c.classes || []).map(function(x){
    return { name: x.label, line: '', tabs: [{ label: 'Verbatim',
      body: sgTB('FILING', sgQuote(x.text, x.where,
        (c.cite && c.cite.url) ? c.cite.url : null)) }] };
  });
};
SG_MD.cname = function(){
  var d = sgData();
  return custNamed(d).map(function(n){
    return { name: n.name, line: n.seg + ' · ' + n.line, tag: n.q,
      tabs: [{ label: 'What was said', body: sgTB('CALL', '<p>' + esc(n.what) + '</p>' +
        '<p class="sg-cite">Earnings call, ' + esc(n.q) + ' · ' + esc(n.seg) + ' · ' +
        esc(n.line) + '</p>') }] };
  });
};

export function segmentsCustomersHtml(ticker){
  var d = SEGMENTS_DATA[ticker];
  if (!d) return '<p class="sg-lede">No segments dataset for ' + esc(ticker) + '.</p>';
  _sg.ticker = ticker;
  var c = d.seg.customers;
  if (!c) return '<p class="sg-lede">No customer disclosure assembled for ' + esc(ticker) + ' yet.</p>';

  // §1 — the finding, which for this company is an absence. One line of it; the rest on click.
  var conc = c.concentration || {};
  var h1;
  if (conc.disclosed === false){
    h1 = '<div class="sg-finding"><div class="sg-finding-h">⚑ No customer concentration is disclosed at all</div>' +
      '<p>No "no single customer accounted for 10%" sentence, and no named customer anywhere in ' +
      'the filing. Nothing on this tab is a revenue ranking.</p></div>' +
      drill('conc', 'What the filing does and does not say',
        '<p>' + esc(conc.note || '') + '</p>' +
        (c.cite ? '<p class="sg-cite">' + esc(c.cite.form) + ' for ' + esc(c.cite.period) +
          ' · accession ' + esc(c.cite.accession) +
          (c.cite.url ? ' · <a href="' + esc(c.cite.url) + '" target="_blank" rel="noopener">read the filing</a>' : '') +
          '</p>' : ''));
  } else {
    h1 = conc.note ? sgTB('FILING', sgQuote(conc.note, (c.cite || {}).form)) : '';
  }

  var named = custNamed(d);
  return '<div class="sg-wrap" id="sgCustWrap">' +
    sec(1, 'What the company discloses', 'concentration', h1) +
    sec(2, 'The customer classes it names for itself',
      (c.classes || []).length + ' classes · verbatim', mdHtml('cclass', null)) +
    sec(3, 'Named on the record', named.length + ' named',
      (named.length
        ? '<p class="sg-lede">' + tierTag('CALL') + 'Every customer Amazon has named out loud. A ' +
          'short and self-selected list — read it as what management is proud of, not as a ranking.</p>' +
          mdHtml('cname', null)
        : '<div class="sg-needs">⚑ No customer has been named on a call for this company yet.</div>')) +
    custSplcSection(c, 4) +
    '<div class="ov-fynote sg-src">Three registers, kept apart on purpose: what the filing says, ' +
    'what management said on a call, and what somebody else disclosed about Amazon. None of them ' +
    'is a revenue ranking, and the tab never presents one.</div></div>';
}
export function initSegmentsCustomers(root, ticker){
  var d = SEGMENTS_DATA[ticker]; if (!d) return;
  _sg.ticker = ticker;
  var host = root || document;
  var wrap = host.querySelector ? host.querySelector('#sgCustWrap') : null;
  if (!wrap || wrap.__sgWired) return;
  wrap.__sgWired = true;
  wrap.addEventListener('keydown', function(ev){
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var t = ev.target.closest('[data-sgpick]');
    if (t){ ev.preventDefault(); t.click(); }
  });
  // No chart on this tab, so a card only ever re-renders its own deck — nothing else moves.
  wrap.addEventListener('click', function(ev){
    var pk = ev.target.closest('[data-sgpick]');
    if (pk && !ev.target.closest('.sg-panel')){
      var pa = pk.getAttribute('data-sgpick').split('|'), kind = pa[0];
      _sg.open[sgPickKey(kind)] = (pa[1] === 'close') ? null
        : (sgPicked(kind) === +pa[1] ? null : +pa[1]);
      renderMd(kind); return;
    }
    var pt = ev.target.closest('[data-sgptab]');
    if (pt){ var ta = pt.getAttribute('data-sgptab').split('|');
             _sg.open['ptab-' + ta[0] + '-' + sgPicked(ta[0])] = +ta[1];
             renderMd(ta[0]); return; }
    var dr = ev.target.closest('[data-sgdrill]');
    if (dr){ var k = dr.getAttribute('data-sgdrill');
             _sg.open[k] = !(_sg.open[k] === true);
             var body = dr.nextElementSibling;
             if (body) body.hidden = !(_sg.open[k] === true);
             var ic = dr.querySelector('.rs-collap-ic');
             if (ic) ic.textContent = _sg.open[k] === true ? '▾' : '▸';
             var sub = dr.querySelector('.rs-collap-sub');
             if (sub) sub.textContent = _sg.open[k] === true ? 'hide' : 'show';
             return; }
  });
}

// ─── the OTHER revenue cuts ────────────────────────────────────────────────────────────────────
// The same total revenue, sliced the other ways the company reports it — by product line and by
// country. Neither is extra revenue and the pane says so out loud, because a reader who adds a
// segment chart to a geography chart has just double-counted the company.
function otherCuts(){ var d = sgData(); return (d && d.seg.other) || []; }
function otherCut(){
  var cs = otherCuts();
  return cs.filter(function(c){ return c.key === _sg.cut; })[0] || cs[0] || null;
}
function otherBlockId(c){ return 'oth-' + c.key; }
function otherOpts(c){
  return { modes: true, views: (c.views || ['q', 'y']).length > 1, bars: true, stack: true,
           totals: true, tableTitle: 'Period detail', height: 330,
           caption: c.label + ' — the same revenue, cut by ' + c.sub };
}
function otherDefault(c){ return (c.views && c.views[0]) || 'y'; }

function otherPane(){
  var cs = otherCuts();
  if (!cs.length) return '<p class="sg-lede">This company publishes no revenue cut beyond its reportable segments.</p>';
  var c = otherCut(), id = otherBlockId(c), st = blk(id);
  // A cut declares which axes it actually has. Geography is a 10-K table and has no quarterly
  // existence at all, so the default block state ('q') has to be clamped or the pane draws nothing.
  var allow = c.views || ['q', 'y'];
  if (allow.indexOf(st.view) < 0) st.view = allow[0];
  if (c.axis) SG_AXIS[id] = c.axis;
  var view = st.view;

  var pills = '<div class="sg-segpills"><div class="rs-views">' + cs.map(function(x){
    return '<button type="button" class="rs-view' + (x.key === c.key ? ' active' : '') +
      '" data-sgcut="' + esc(x.key) + '">' + esc(x.label) + '</button>'; }).join('') + '</div></div>';

  // §1 — the picture, the same block the Overview draws
  var chart = sec(1, c.label, c.sub,
    '<p class="sg-lede">' + esc(c.lede) + '</p>' +
    chartBlockHtml(id, c.series, view, otherOpts(c)) +
    (c.note ? '<div class="ov-fynote">' + esc(c.note) + '</div>' : ''));

  // §2 — what the cut IS, in the filing's own words
  var body = '';
  if (c.tenK){
    body += sgTB('FILING', sgQuote(c.tenK.text, c.tenK.where));   // the link lives on the cite line

  }
  if (c.cite){
    body += '<p class="sg-cite">' + esc(c.cite.form) + ' for ' + esc(c.cite.period) +
      ' · accession ' + esc(c.cite.accession) +
      (c.cite.url ? ' · <a href="' + esc(c.cite.url) + '" target="_blank" rel="noopener">read the filing</a>' : '') +
      '</p>';
  }
  if (c.spans) body += '<p class="sg-cite">' + esc(c.spans) + '</p>';
  if (c.caveat) body += '<div class="sg-needs">⚑ ' + esc(c.caveat) + '</div>';

  // every line that HAS a filing definition gets it, verbatim, under its own name
  var defs = (c.series || []).filter(function(x){ return x.tenK && x.tenK.text; });
  if (defs.length){
    body += '<div class="sg-defs">' + defs.map(function(x){
      return '<div class="sg-def"><div class="sg-def-n">' + esc(x.label) + tierTag('FILING') + '</div>' +
        '<p class="sg-def-t">' + esc(x.tenK.text) + '</p>' +
        (x.tenK.where ? '<p class="sg-cite">' + esc(x.tenK.where) + '</p>' : '') + '</div>';
    }).join('') + '</div>';
  }
  var defsSec = body ? sec(2, 'How the filing defines it',
    defs.length ? defs.length + ' lines defined' : 'verbatim', body) : '';

  return '<div class="sg-wrap" id="sgOthWrap">' + pills + chart + defsSec +
    '<div class="ov-fynote sg-src">Every cut on this tab disaggregates the SAME consolidated net sales — ' +
    'the segments, the product lines and the countries each add to the identical total. They are ' +
    'alternative slices, never additive.</div></div>';
}

export function segmentsOtherHtml(ticker){
  var d = SEGMENTS_DATA[ticker];
  if (!d) return '<p class="sg-lede">No segments dataset for ' + esc(ticker) + '.</p>';
  _sg.ticker = ticker;
  if (!_sg.cut && d.seg.other && d.seg.other.length) _sg.cut = d.seg.other[0].key;
  return otherPane();
}
function renderOther(){
  var c = otherCut(); if (!c) return;
  var id = otherBlockId(c);
  if (c.axis) SG_AXIS[id] = c.axis;
  var allow = c.views || ['q', 'y'], st = blk(id);
  if (allow.indexOf(st.view) < 0) st.view = allow[0];
  renderBlock(id, c.series, st.view, otherOpts(c));
}
export function initSegmentsOther(root, ticker){
  var d = SEGMENTS_DATA[ticker]; if (!d) return;
  _sg.ticker = ticker;
  var host = root || document;
  var wrap = host.querySelector ? host.querySelector('#sgOthWrap') : null;
  if (!wrap) return;
  if (!wrap.__sgWired){
    wrap.__sgWired = true;
    wrap.addEventListener('click', function(ev){
      function redraw(){
        var parent = wrap.parentElement;
        wrap.outerHTML = segmentsOtherHtml(_sg.ticker);
        var fresh = parent.querySelector('#sgOthWrap');
        if (fresh){ fresh.__sgWired = false; initSegmentsOther(parent, _sg.ticker); }
      }
      var cu = ev.target.closest('[data-sgcut]');
      if (cu){ _sg.cut = cu.getAttribute('data-sgcut');
               // a different cut is a different set of series on a different axis
               var nid = otherBlockId(otherCut()); _sg.blocks[nid] = blank();
               redraw(); return; }
      var id = otherBlockId(otherCut());
      var vw = ev.target.closest('[data-sgview]');
      if (vw){ var vp = vw.getAttribute('data-sgview').split('|');
               var vst = blk(vp[0]); vst.view = vp[1]; vst.win = null; vst.yr = null;
               redraw(); return; }
      var md = ev.target.closest('[data-sgmode]');
      if (md){ var mp = md.getAttribute('data-sgmode').split('|');
               var mst = blk(mp[0]); mst.mode = mp[1]; mst.yr = null; redraw(); return; }
      var gu = ev.target.closest('[data-sggrow]');
      if (gu){ var gp = gu.getAttribute('data-sggrow').split('|');
               var gst = blk(gp[0]); gst.growUnit = gp[1]; gst.yr = null; redraw(); return; }
      var sk = ev.target.closest('[data-sgstack]');
      if (sk){ var sp = sk.getAttribute('data-sgstack').split('|');
               var sst = blk(sp[0]); sst.stack = sp[1] === '1'; sst.yr = null; redraw(); return; }
      var lb = ev.target.closest('[data-sglab]');
      if (lb){ var lp = lb.getAttribute('data-sglab').split('|');
               blk(lp[0]).labels = lp[1] === '1'; redraw(); return; }
      var gl = ev.target.closest('[data-sglag]');
      if (gl){ var glp = gl.getAttribute('data-sglag').split('|');
               var gst = blk(glp[0]); gst.glag = glp[1]; gst.yr = null; redraw(); return; }
      var lg = ev.target.closest('[data-sgleg]');
      if (lg){ var parts = lg.getAttribute('data-sgleg').split('|');
               var st = blk(parts[0]); st.hidden[parts[1]] = !st.hidden[parts[1]];
               renderOther(); return; }
      var tb = ev.target.closest('[data-sgtblb]');
      if (tb){ var bid = tb.getAttribute('data-sgtblb'), bst = blk(bid);
               bst.tbl = !(bst.tbl === true);
               var bd = document.getElementById('sgTblBody-' + bid);
               if (bd) bd.hidden = !(bst.tbl === true);
               renderOther(); return; }
    });
    sgWireSlider(wrap, renderOther);
  }
  renderOther();
}

export function segmentsHtml(ticker){
  var d = SEGMENTS_DATA[ticker];
  if (!d || !d.seg.segments.length) return '';           // rule 6
  _sg.ticker = ticker;
  if (!_sg.seg) _sg.seg = d.seg.segments[0].key;
  var s = sgSeg(), view = 'q';
  registerResultsData(segResultsKey(), buildSegResults());
  var pills = '<div class="rs-modes sg-segpills">' + d.seg.segments.map(function(x){
    return '<button type="button" class="rs-view' + (x.key === s.key ? ' active' : '') +
      '" data-sgseg="' + esc(x.key) + '">' + esc(x.label) + '</button>'; }).join('') + '</div>';
  return '<div class="sg-wrap" id="sgWrap">' + pills +
    secSummary(s) + secProducts(s) + secKpis(s, view) + secInteractions(s) + secManagement(s) +
    '<div class="ov-fynote sg-src">' + esc(d.seg.source) + '</div></div>';
}

function kpiOpts(s){
  return { tableTitle: 'KPI detail', caption: s.label + ' · KPIs', height: 260, modes: true };
}
function renderKpiChart(){
  var s = sgSeg(); if (!s) return;
  var kl = kpiSeriesList(s);
  if (kl.length) renderBlock('kpi', kl, blk('kpi').view || 'q', kpiOpts(s));
}
function renderAll(){
  var s = sgSeg();
  var eng = document.getElementById('sgEngine');
  if (eng){ var w = eng.querySelector('.rs-wrap'); if (w) initResults(w, segResultsKey()); }
  renderKpiChart();
  renderMdChart('inter');
}

export function initSegments(root, ticker){
  var d = SEGMENTS_DATA[ticker]; if (!d) return;
  _sg.ticker = ticker;
  if (!_sg.seg) _sg.seg = d.seg.segments[0].key;
  var host = root || document;
  var wrap = host.querySelector ? host.querySelector('#sgWrap') : null;
  if (!wrap) return;
  if (!wrap.__sgWired){
    wrap.__sgWired = true;
    // A div with role="button" owes Enter and Space; without this the KPI tiles and the
    // interaction cards are unreachable from the keyboard.
    wrap.addEventListener('keydown', function(ev){
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var t = ev.target.closest('[data-sgpick], [data-sgmq]');
      if (t){ ev.preventDefault(); t.click(); }
    });
    // Delegated on the WRAP, never on document (§12 invariant 2).
    wrap.addEventListener('click', function(ev){
      var seg = ev.target.closest('[data-sgseg]');
      if (seg){ _sg.seg = seg.getAttribute('data-sgseg');
                sgResetDetail(); rebuild(wrap); return; }
      var dr = ev.target.closest('[data-sgdrill]');
      if (dr){ var k = dr.getAttribute('data-sgdrill');
               _sg.open[k] = !(_sg.open[k] === true);
               var body = dr.nextElementSibling;
               if (body) body.hidden = !(_sg.open[k] === true);
               var ic = dr.querySelector('.rs-collap-ic'); if (ic) ic.textContent = _sg.open[k] === true ? '▾' : '▸';
               var sub = dr.querySelector('.rs-collap-sub'); if (sub) sub.textContent = _sg.open[k] === true ? 'hide' : 'show';
               return; }
      var kl = ev.target.closest('[data-sgkpilag]');
      if (kl){ blk('kpi').lag = kl.getAttribute('data-sgkpilag'); rebuild(wrap); return; }
      var mq = ev.target.closest('[data-sgmq]');
      if (mq){ var qk = 'mq-' + mq.getAttribute('data-sgmq');
               var qOpen = !(_sg.open[qk] === true); _sg.open[qk] = qOpen;
               var qb = mq.parentElement.querySelector('.sg-mq-b');
               if (qb) qb.hidden = !qOpen;
               mq.parentElement.classList.toggle('open', qOpen);
               mq.setAttribute('aria-expanded', qOpen ? 'true' : 'false');
               var qi = mq.querySelector('.rs-collap-ic'); if (qi) qi.textContent = qOpen ? '▾' : '▸';
               return; }
      var mo = ev.target.closest('[data-sgmgmt]');
      if (mo){ blk('mgmt').lag = mo.getAttribute('data-sgmgmt'); rebuild(wrap); return; }
      // Master-detail. Only the cards+panel block is re-rendered, so opening a card never
      // rebuilds the charts underneath it and never moves the page under the reader.
      var pk = ev.target.closest('[data-sgpick]');
      if (pk && !ev.target.closest('.sg-panel')){
        var pa = pk.getAttribute('data-sgpick').split('|'), pkind = pa[0];
        _sg.open[sgPickKey(pkind)] = (pa[1] === 'close') ? null
          : (sgPicked(pkind) === +pa[1] ? null : +pa[1]);
        // a different relation is a different set of series: its window, chips and range mean
        // nothing carried over from the last one
        if (pkind === 'inter') _sg.blocks.bridge = blank();
        if (pkind === 'kpi'){
          var kl = kpiSeriesList(sgSeg());
          if (kl.length){ kpiSolo(sgSeg(), kl); blk('kpi').win = null; blk('kpi').yr = null; }
        }
        renderMd(pkind);
        if (pkind === 'kpi') renderKpiChart();
        return;
      }
      var pt = ev.target.closest('[data-sgptab]');
      if (pt){
        var ta = pt.getAttribute('data-sgptab').split('|');
        _sg.open['ptab-' + ta[0] + '-' + sgPicked(ta[0])] = +ta[1];
        renderMd(ta[0]); return;
      }
      var md = ev.target.closest('[data-sgmode]');
      if (md){ var mp = md.getAttribute('data-sgmode').split('|');
               var mst = blk(mp[0]); mst.mode = mp[1];
               mst.yr = null;                       // the axis units changed
               rebuild(wrap); return; }
      var gu = ev.target.closest('[data-sggrow]');
      if (gu){ var gp = gu.getAttribute('data-sggrow').split('|');
               var gst = blk(gp[0]); gst.growUnit = gp[1]; gst.yr = null;
               rebuild(wrap); return; }
      var sk = ev.target.closest('[data-sgstack]');
      if (sk){ var sp2 = sk.getAttribute('data-sgstack').split('|');
               var sst = blk(sp2[0]); sst.stack = sp2[1] === '1';
               sst.yr = null;                       // a stacked axis reaches the total, a grouped one does not
               rebuild(wrap); return; }
      var nh = ev.target.closest('[data-sgnote]');
      if (nh){ _sg.open['note'] = !(_sg.open['note'] === true);
               if (!_sg.open['note']) _sg.open['noteEdit'] = false;
               rebuild(wrap); return; }
      // A product note lives inside the master-detail panel, so re-render THAT and leave the
      // charts alone; a segment note sits in §1 and needs the section rebuilt.
      function afterNote(slot){
        if (String(slot).indexOf('prod.') === 0) renderMd('prod'); else rebuild(wrap);
        var ta = document.getElementById('sgNoteTa'); if (ta){ ta.focus(); ta.selectionStart = ta.value.length; }
      }
      var ne = ev.target.closest('[data-sgnedit]');
      if (ne){ var nes = ne.getAttribute('data-sgnedit');
               _sg.open['noteEdit'] = nes; afterNote(nes); return; }
      var ns = ev.target.closest('[data-sgnsave]');
      if (ns){ var nss = ns.getAttribute('data-sgnsave'), el = document.getElementById('sgNoteTa');
               if (el) noteWrite(nss, el.value.trim());
               _sg.open['noteEdit'] = null; afterNote(nss); return; }
      var nc = ev.target.closest('[data-sgncancel]');
      if (nc){ var prev = _sg.open['noteEdit']; _sg.open['noteEdit'] = null; afterNote(prev); return; }
      var nr = ev.target.closest('[data-sgnreset]');
      if (nr){ var nrs = nr.getAttribute('data-sgnreset');
               noteWrite(nrs, null); _sg.open['noteEdit'] = null; afterNote(nrs); return; }
      var lb = ev.target.closest('[data-sglab]');
      if (lb){ var lp = lb.getAttribute('data-sglab').split('|');
               blk(lp[0]).labels = lp[1] === '1'; rebuild(wrap); return; }
      var gl = ev.target.closest('[data-sglag]');
      if (gl){ var glp = gl.getAttribute('data-sglag').split('|');
               var gst = blk(glp[0]); gst.glag = glp[1]; gst.yr = null; rebuild(wrap); return; }
      var lg = ev.target.closest('[data-sgleg]');
      if (lg){ var parts = lg.getAttribute('data-sgleg').split('|');
               var st = blk(parts[0]); st.hidden[parts[1]] = !st.hidden[parts[1]];
               if (parts[0] === 'bridge') renderMdChart('inter'); else renderAll(); return; }
      var tb = ev.target.closest('[data-sgtblb]');
      if (tb){ var bid = tb.getAttribute('data-sgtblb'), bst = blk(bid);
               bst.tbl = !(bst.tbl === true);
               var bd = document.getElementById('sgTblBody-' + bid);
               if (bd) bd.hidden = !(bst.tbl === true);
               if (bid === 'bridge') renderMdChart('inter'); else renderAll(); return; }
    });
    sgWireSlider(wrap, renderAll);
  }
  renderAll();
}

// A segment or bridge switch changes which controls exist, so the pane is rebuilt rather than
// re-rendered — the same reason rsRerenderConv exists in the Results engine.
function rebuild(wrap){
  var parent = wrap.parentElement;
  wrap.outerHTML = segmentsHtml(_sg.ticker);
  var fresh = parent.querySelector('#sgWrap');
  if (fresh){ fresh.__sgWired = false; initSegments(parent, _sg.ticker); }
}
