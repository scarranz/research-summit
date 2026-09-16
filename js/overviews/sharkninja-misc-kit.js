// overviews/sharkninja-misc-kit.js — the small chart + infographic kit behind SharkNinja's visual
// Miscellaneous panes (Capex · M&A · Other Analysis · Marketing Strategy · TAM).
//
// These charts are categorical snapshots read off the investor decks, not a metric over time against
// expectations, so they are CHART_ENGINE_REFERENCE path 3 — our own canvas — and meet §0.2 with the
// §0.7 kit:
//   1 zoom      — rsAttachBrush, copied verbatim from amzn-histmult.js (itself results.js). The x-axis is
//                 categorical, so onX is null and every drag zooms the value axis; double-click resets.
//   2 hide      — legend chips; ONE predicate, vis(), feeds the chart, the table and the value labels.
//   3 table     — .rs-collap under every chart, header generated with what is inside.
//   4 dropdown  — n/a (no metric picker); a chart with several vintages uses .rs-view pills instead.
//   5 units     — every value goes through fmt(unit); estimate columns are faded and marked E.
//   6 degrade   — a chart with no data returns '' (nothing renders).
// Colours: SUMMIT_CAT for identity (brands, cash vs debt) and an ordinal blue ramp for years — the
// same ramp as results.js EVO_RAMP, lightest = oldest.

import { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, fade } from '../viz-palette.js';

export var YEAR_RAMP = ['#93B1F0', '#5E8BEC', '#2563EB', '#1B3F94'];
export { SUMMIT_CAT, SUMMIT_INK, SUMMIT_MUTE, fade };

export function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

export function fmt(v, unit){
  if (v == null || isNaN(v)) return '—';
  if (unit === '%') return (Math.round(v * 10) / 10) + '%';
  if (unit === '$M') return (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US') + 'M';
  if (unit === '$B') return '$' + v.toFixed(1) + 'B';
  if (unit === 'x') return v.toFixed(2) + 'x';
  return Math.round(v).toLocaleString('en-US');
}

// ── rsAttachBrush — copied verbatim from js/overviews/amzn-histmult.js:76–149 (= js/results.js) ──
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical){
        box.style.left = (r0.left - w0.left + area.left) + 'px';
        box.style.width = (area.right - area.left) + 'px';
      } else {
        box.style.top = (r0.top - w0.top) + 'px';
        box.style.height = r0.height + 'px';
      }
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
      if (vertical){
        var a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx);
        box.style.left = (a2 - w0.left) + 'px';
        box.style.width = (b2 - a2) + 'px';
      }
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
        function idxAt(clientX){
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        }
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


// ── Value labels — selective: only when the chart asks, and only on visible bars ──
var valueLabels = {
  id: 'snvValueLabels',
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || !opts.on) return;
    var ctx = chart.ctx; ctx.save();
    ctx.font = '600 10px Inter, sans-serif'; ctx.fillStyle = SUMMIT_INK; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    chart.data.datasets.forEach(function(ds, i){
      var meta = chart.getDatasetMeta(i); if (meta.hidden || ds.hidden) return;
      meta.data.forEach(function(bar, j){
        var v = ds.data[j]; if (v == null) return;
        if (opts.stacked && i !== chart.data.datasets.length - 1) return;
        var y = v < 0 ? bar.base : bar.y;
        ctx.fillText(opts.format(opts.stacked ? opts.total(j) : v), bar.x, y - 3);
      });
    });
    ctx.restore();
  }
};

// ── The chart block ─────────────────────────────────────────────────────────────────────────────
// cfg: { title, unit, labels, series:[{k,label,color,data}], stacked, estFrom, height, labelsOn,
//        views:[{id,label,labels,series,note}], note, tableHead }
var REG = {};

function view(st){ var c = st.cfg; if (!c.views) return c; for (var i = 0; i < c.views.length; i++) if (c.views[i].id === st.view) return c.views[i]; return c.views[0]; }
function vis(st, k){ return !st.hidden[k]; }   // rule 2 — the ONE predicate

function chipsHtml(id, st){
  var v = view(st);
  if (v.series.length < 2) return '';
  return '<div class="snv-legend">' + v.series.map(function(s){
    return '<button type="button" class="rs-leg' + (vis(st, s.k) ? '' : ' off') + '" data-snvleg="' + esc(s.k) + '" title="Show / hide">' +
      '<span class="ave-leg-act" style="background:' + s.color + '"></span>' + esc(s.label) + '</button>';
  }).join('') + '</div>';
}
function viewsHtml(st){
  var c = st.cfg; if (!c.views || c.views.length < 2) return '';
  return '<div class="rs-modes">' + c.views.map(function(v){
    return '<button type="button" class="rs-view' + (v.id === st.view ? ' active' : '') + '" data-snvview="' + esc(v.id) + '">' + esc(v.label) + '</button>';
  }).join('') + '</div>';
}
function tblHead(st){
  var v = view(st), open = st.tbl === true;
  var n = v.series.filter(function(s){ return vis(st, s.k); }).length;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' + esc(st.cfg.tableHead || 'The numbers') +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + n + ' series × ' + v.labels.length + ' columns</span>';
}
function tblHtml(st){
  var c = st.cfg, v = view(st), est = c.estFrom == null ? -1 : c.estFrom;
  var h = '<div class="rs-ft-cap">' + esc(c.unitLabel || c.unit) + (est >= 0 ? ' · <span class="rs-ft-e">E</span> = company guidance / estimate' : '') + '</div>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  v.labels.forEach(function(l, i){ var e = est >= 0 && i >= est; h += '<th class="' + (e ? 'rs-ft-este' : '') + '">' + esc(l) + (e ? ' <span class="rs-ft-e">E</span>' : '') + '</th>'; });
  h += '</tr></thead><tbody>';
  v.series.forEach(function(s){
    if (!vis(st, s.k)) return;
    h += '<tr class="rs-ft-main"><td class="rs-ft-h">' + esc(s.label) + '</td>';
    s.data.forEach(function(x, i){ var e = est >= 0 && i >= est; h += '<td class="' + (e ? 'rs-ft-este' : '') + '">' + (x == null ? '<span class="rs-ft-nil">—</span>' : esc(fmt(x, c.unit))) + '</td>'; });
    h += '</tr>';
  });
  if (v.extraRows) v.extraRows.forEach(function(r){
    h += '<tr class="rs-ft-sub"><td class="rs-ft-h">' + esc(r.label) + '</td>' + r.cells.map(function(x){ return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>';
  });
  return h + '</tbody></table></div>';
}

export function snvChart(id, cfg){
  var hasData = (cfg.views ? cfg.views : [cfg]).some(function(v){ return v.series && v.series.some(function(s){ return s.data && s.data.some(function(x){ return x != null; }); }); });
  if (!hasData) return '';                                                     // rule 6
  var st = REG[id] || (REG[id] = { cfg: cfg, hidden: {}, yr: null, tbl: false, chart: null, view: cfg.views ? cfg.views[0].id : null });
  st.cfg = cfg;
  var v = view(st);
  return '<div class="snv-chart" data-snvc="' + esc(id) + '">' +
    (cfg.title ? '<div class="snv-chart-h">' + esc(cfg.title) + '</div>' : '') +
    '<div class="rs-block-modes snv-controls">' + viewsHtml(st) + '<span class="snv-hint">drag to zoom · double-click resets</span></div>' +
    '<div data-snvlegwrap>' + chipsHtml(id, st) + '</div>' +
    '<div class="snv-canvas" style="height:' + (cfg.height || 240) + 'px"><canvas></canvas></div>' +
    '<div class="dd-note" data-snvnote>' + (v.note || cfg.note || '') + '</div>' +
    '<div class="rs-collap snv-tbl"><button type="button" class="rs-collap-h" data-snvtbl>' + tblHead(st) + '</button>' +
      '<div class="rs-collap-b" hidden><div class="rs-tablewrap">' + tblHtml(st) + '</div></div></div>' +
  '</div>';
}

function datasets(st){
  var c = st.cfg, v = view(st), est = c.estFrom == null ? -1 : c.estFrom;
  return v.series.map(function(s){
    var cols = s.data.map(function(_, i){ return est >= 0 && i >= est ? fade(s.color, 0.35) : s.color; });
    return { label: s.label, data: s.data.slice(), backgroundColor: cols, borderColor: s.color,
      borderWidth: est >= 0 ? s.data.map(function(_, i){ return i >= est ? 1.5 : 0; }) : 0,
      borderRadius: 4, borderSkipped: 'start', maxBarThickness: 34, hidden: !vis(st, s.k), stack: c.stacked ? 'a' : s.k };
  });
}

function build(host, st){
  if (!window.Chart) return;
  var c = st.cfg, v = view(st), canvas = host.querySelector('canvas');
  if (st.chart){ st.chart.destroy(); st.chart = null; }
  st.chart = new window.Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels: v.labels, datasets: datasets(st) },
    plugins: [valueLabels],
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      layout: { padding: { top: c.labelsOn ? 14 : 4 } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.dataset.label + ': ' + fmt(ctx.raw, c.unit); } } },
        snvValueLabels: { on: !!c.labelsOn, stacked: !!c.stacked, format: function(x){ return fmt(x, c.unit); },
          total: function(j){ var t = 0; v.series.forEach(function(s){ if (vis(st, s.k) && s.data[j] != null) t += s.data[j]; }); return t; } },
      },
      scales: {
        x: { stacked: !!c.stacked, grid: { display: false }, ticks: { color: SUMMIT_MUTE, font: { size: 10.5 }, autoSkip: false, maxRotation: 0,
          // Long category labels wrap onto at most two lines, broken at the space nearest the middle.
          callback: function(val){
            var l = String(this.getLabelForValue(val)); if (l.length <= 12 || l.indexOf(' ') < 0) return l;
            var mid = l.length / 2, best = -1;
            for (var i = 0; i < l.length; i++) if (l[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
            return [l.slice(0, best), l.slice(best + 1)];
          } } },
        y: { stacked: !!c.stacked, position: 'right', grid: { color: 'rgba(30,39,51,0.06)' }, border: { display: false },
          min: st.yr ? st.yr[0] : (c.yMin != null ? c.yMin : undefined), max: st.yr ? st.yr[1] : (c.yMax != null ? c.yMax : undefined),
          ticks: { color: SUMMIT_MUTE, font: { size: 10 }, maxTicksLimit: 6, callback: function(x){ return fmt(x, c.unit); } } },
      },
    },
  });
  rsAttachBrush(canvas, st.chart, null,
    function(a, b){ st.yr = [a, b]; build(host, st); },
    function(){ st.yr = null; build(host, st); });
}

function refresh(host, st){
  var v = view(st);
  host.querySelector('[data-snvlegwrap]').innerHTML = chipsHtml(null, st);
  host.querySelector('[data-snvtbl]').innerHTML = tblHead(st);
  host.querySelector('.rs-tablewrap').innerHTML = tblHtml(st);
  var note = host.querySelector('[data-snvnote]'); if (note) note.innerHTML = v.note || st.cfg.note || '';
  host.querySelectorAll('[data-snvview]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-snvview') === st.view); });
}

// Build every chart inside `root` that is visible and not yet built. Safe to call repeatedly.
export function snvInit(root){
  if (!root) return;
  root.querySelectorAll('[data-snvc]').forEach(function(host){
    if (host.offsetParent === null) return;                   // Chart.js needs a laid-out canvas
    var st = REG[host.getAttribute('data-snvc')]; if (!st) return;
    if (!host._snvWired){
      host._snvWired = true;
      host.addEventListener('click', function(e){
        var leg = e.target.closest('[data-snvleg]');
        if (leg){ var k = leg.getAttribute('data-snvleg'); st.hidden[k] = !st.hidden[k]; refresh(host, st); build(host, st); return; }
        var vw = e.target.closest('[data-snvview]');
        if (vw){ st.view = vw.getAttribute('data-snvview'); st.hidden = {}; st.yr = null; refresh(host, st); build(host, st); return; }
        var tb = e.target.closest('[data-snvtbl]');
        if (tb){ st.tbl = st.tbl !== true; var b = tb.nextElementSibling; if (b) b.hidden = st.tbl !== true; tb.innerHTML = tblHead(st); }
      });
    }
    if (!st.chart || st.chart.canvas !== host.querySelector('canvas')) build(host, st);
  });
  wireFolds(root);
}

// ── Infographic pieces (no chart, no table owed) ────────────────────────────────────────────────

// A "show the detail" fold, so text stays available without being on screen.
export function fold(title, inner, open){
  if (!inner) return '';
  return '<div class="rs-collap snv-fold"><button type="button" class="rs-collap-h" data-snvfold><span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>' + title +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + '</span></button><div class="rs-collap-b snv-fold-b"' + (open ? '' : ' hidden') + '>' + inner + '</div></div>';
}
export function wireFolds(root){
  if (!root || root._snvFolds) return; root._snvFolds = true;
  root.addEventListener('click', function(e){
    var h = e.target.closest ? e.target.closest('[data-snvfold]') : null; if (!h || !root.contains(h)) return;
    var b = h.nextElementSibling; if (!b) return; var open = b.hidden; b.hidden = !open;
    var ic = h.querySelector('.rs-collap-ic'); if (ic) ic.textContent = open ? '▾' : '▸';
    var sub = h.querySelector('.rs-collap-sub'); if (sub) sub.textContent = open ? 'hide' : 'show';
  });
}

// Big-number tiles: [{v, l, s}]
export function tiles(list, cols){
  return '<div class="snv-tiles"' + (cols ? ' style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))"' : '') + '>' + (list || []).map(function(t){
    return '<div class="snv-tile"><div class="snv-tile-v">' + esc(t.v) + '</div><div class="snv-tile-l">' + esc(t.l) + '</div>' + (t.s ? '<div class="snv-tile-s">' + esc(t.s) + '</div>' : '') + '</div>';
  }).join('') + '</div>';
}

// A section header with an optional "from the deck" slide link.
export function head(title, link, sub){
  return '<div class="snv-h"><span>' + esc(title) + '</span>' + (link ? '<a class="snv-src" href="' + esc(link) + '" target="_blank" rel="noopener">slide ↗</a>' : '') + '</div>' +
    (sub ? '<div class="snv-sub">' + sub + '</div>' : '');
}
