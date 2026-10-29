// Bottom Line ▸ General ▸ "The bridge — how net revenue becomes operating income" for Mastercard.
// Same format as the AMZN / TSM / SPOT bridge (floating bars, dashed connectors, delta labels, "every step" table): Build-up ($B)
// and Margin change (bps). Mastercard has no cost of revenue, so the bridge goes straight from net revenue (client incentives are
// already netted in it) through its four reported operating-expense lines to operating income.
// Numbers come from maResults (the same cells as the Results tab): Reported = the printed quarter / year, Street = Bloomberg
// consensus, Summit = the DCF model. Where a basis does not carry every expense line (the Summit model has no D&A line, for
// instance) the four bars collapse into ONE "Operating expenses" bar, so the walk still ties to operating income.
import { maResults } from '../results-data/ma.js';

var LINES = [
  { k: 'ga',  lab: 'General & administrative', short: 'G&A',        c: '#475569' },
  { k: 'am',  lab: 'Advertising & marketing',  short: 'A&M',        c: '#94a3b8' },
  { k: 'dna', lab: 'Depreciation & amortization', short: 'D&A',     c: '#0f172a' },
  { k: 'lit', lab: 'Provision for litigation', short: 'Litigation', c: '#cbd5e1' }
];
var DOWN = '#C0504D', UP = '#2E8B57', INK = '#1E2733';
var BASES = [['act', 'Reported'], ['cons', 'Street'], ['summit', 'Summit']];
var _st = { gran: 'q', basis: 'act', mode: 'buildup', per: null, chart: null };

function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function view(){ return maResults.views[_st.gran]; }
function cell(k, p, basis){
  var m = view().metrics[k]; if (!m) return null;
  var i = m.periods.indexOf(p); if (i < 0) return null;
  var v = m[basis][i]; return v == null ? null : v;
}
// Periods the bridge can draw on the chosen basis: net revenue and operating income present.
function periods(){
  var m = view().metrics.rev, out = [];
  m.periods.forEach(function(p){
    if (_st.gran === 'q' && !/^[1-4]Q2[4-9]$/.test(p)) return;
    if (_st.gran === 'y' && !(+p >= 2021 && +p <= 2028)) return;
    if (cell('rev', p, _st.basis) != null && cell('opinc', p, _st.basis) != null) out.push(p);
  });
  return out;
}
function label(p){ return _st.gran === 'y' ? 'FY' + String(p).slice(2) : p; }
function priorOf(p){
  if (_st.gran === 'y') return String(+p - 1);
  return p.charAt(0) + 'Q' + String(+p.slice(2) - 1);
}
// One period on one basis: { rev, opinc, lines:[{k,lab,short,c,v}] , itemized }
function row(p, basis){
  var rev = cell('rev', p, basis), oi = cell('opinc', p, basis); if (rev == null || oi == null) return null;
  var ls = LINES.map(function(l){ return { k: l.k, lab: l.lab, short: l.short, c: l.c, v: cell(l.k, p, basis) }; });
  var all = ls.every(function(l){ return l.v != null; });
  if (all) return { p: p, rev: rev, oi: oi, lines: ls, itemized: true };
  return { p: p, rev: rev, oi: oi, itemized: false,
           lines: [{ k: 'opex', lab: 'Operating expenses (not itemized on this basis)', short: 'Opex', c: '#475569', v: rev - oi }] };
}
function buildup(r){
  var run = r.rev / 1000, steps = [{ label: 'Net revenue', kind: 'base', color: INK, range: [0, run], runAfter: run, val: run }];
  r.lines.forEach(function(l){ var c = l.v / 1000, hi = run; run = hi - c;
    steps.push({ label: l.short, kind: 'down', color: l.c, dc: '#6B7683', range: [Math.min(run, hi), Math.max(run, hi)], runAfter: run, val: -c }); });
  steps.push({ label: 'Operating income', kind: 'total', color: UP, range: [0, run], runAfter: null, val: run });
  return steps;
}
function bps(a, b){
  var run = a.oi / a.rev * 100, steps = [{ label: label(a.p), kind: 'base', color: INK, range: [0, run], runAfter: run, val: run }];
  var map = {}; a.lines.forEach(function(l){ map[l.k] = l; });
  b.lines.forEach(function(l){
    var pv = map[l.k]; if (!pv) return;
    var contrib = (pv.v / a.rev - l.v / b.rev) * 100, lo = run; run = lo + contrib;
    steps.push({ label: l.short, kind: contrib >= 0 ? 'up' : 'down', color: contrib >= 0 ? UP : DOWN, range: [Math.min(lo, run), Math.max(lo, run)], runAfter: run, val: contrib }); });
  steps.push({ label: label(b.p), kind: 'total', color: INK, range: [0, run], runAfter: null, val: run });
  return steps;
}
var FMT_D = { axis: function(v){ return '$' + v.toFixed(Math.abs(v) < 10 ? 1 : 0) + 'B'; }, base: function(v){ return '$' + v.toFixed(2) + 'B'; },
              delta: function(v){ return (v >= 0 ? '+$' : '−$') + Math.abs(v).toFixed(2) + 'B'; } };
var FMT_BPS = { axis: function(v){ return v.toFixed(0) + '%'; }, base: function(v){ return v.toFixed(1) + '%'; },
                delta: function(v){ var b = Math.round(v * 100); return (b >= 0 ? '+' : '−') + Math.abs(b) + ' bps'; } };
var PLUGIN = { id: 'maBrLbl', afterDatasetsDraw: function(chart){
  var steps = chart._steps; if (!steps) return; var ctx = chart.ctx, meta = chart.getDatasetMeta(0), y = chart.scales.y, fmt = chart._fmt || {};
  ctx.save(); ctx.strokeStyle = 'rgba(120,130,145,.55)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
  for (var i = 0; i < steps.length - 1; i++){ if (steps[i].runAfter == null) continue; var b0 = meta.data[i], b1 = meta.data[i + 1];
    var yy = y.getPixelForValue(steps[i].runAfter); ctx.beginPath(); ctx.moveTo(b0.x + b0.width / 2, yy); ctx.lineTo(b1.x - b1.width / 2, yy); ctx.stroke(); }
  ctx.setLineDash([]); ctx.textAlign = 'center';
  for (var j = 0; j < steps.length; j++){ var s = steps[j], bar = meta.data[j], top = y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if (s.kind === 'base' || s.kind === 'total'){ txt = fmt.base(s.val); ctx.fillStyle = INK; ctx.font = '800 11px Inter, system-ui, sans-serif'; }
    else { txt = fmt.delta(s.val); ctx.fillStyle = s.dc || (s.val >= 0 ? UP : DOWN); ctx.font = '700 10.5px Inter, system-ui, sans-serif'; }
    ctx.fillText(txt, bar.x, top - 6); }
  ctx.restore();
} };

function pills(attr, list, sel){
  return list.map(function(x){ return '<button type="button" data-' + attr + '="' + esc(x[0]) + '"' + (x[0] === sel ? ' class="active"' : '') + '>' + esc(x[1]) + '</button>'; }).join('');
}
export function maBridgeHtml(){
  return '<div class="ov-sec" id="maBridge"><div class="ov-sec-h">The bridge — how net revenue becomes operating income</div>' +
    '<div class="mch-ctl"><span style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<span class="acx-tog" data-mabr="mode">' + pills('mabrmode', [['buildup', 'Build-up ($B)'], ['bps', 'Margin change (bps)']], 'buildup') + '</span>' +
      '<span class="acx-tog" data-mabr="basis">' + pills('mabrbasis', BASES, 'act') + '</span></span>' +
      '<span style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<span class="acx-tog" data-mabr="gran">' + pills('mabrgran', [['q', 'Quarterly'], ['y', 'Annual']], 'q') + '</span>' +
      '<span class="acx-tog" data-mabr="per"></span></span></div>' +
    '<div class="ov-fynote" id="maBrNote" style="margin:2px 0 8px"></div>' +
    '<div style="height:340px"><canvas id="maBrCanvas"></canvas></div>' +
    '<div id="maBrTbl" style="margin-top:8px"></div></div>';
}
function draw(root){
  var wrap = root.querySelector('#maBridge'); if (!wrap) return;
  var ps = periods(), note = wrap.querySelector('#maBrNote'), per = wrap.querySelector('[data-mabr="per"]');
  if (ps.indexOf(_st.per) < 0) _st.per = ps[ps.length - 1] || null;
  per.innerHTML = pills('mabrper', ps.map(function(p){ return [p, label(p)]; }), _st.per);
  wrap.querySelectorAll('[data-mabr="mode"] button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mabrmode') === _st.mode); });
  wrap.querySelectorAll('[data-mabr="basis"] button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mabrbasis') === _st.basis); });
  wrap.querySelectorAll('[data-mabr="gran"] button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mabrgran') === _st.gran); });
  if (_st.chart){ _st.chart.destroy(); _st.chart = null; }
  var tbl = wrap.querySelector('#maBrTbl'); tbl.innerHTML = '';
  var cur = _st.per ? row(_st.per, _st.basis) : null, steps, fmt;
  if (!cur){ note.textContent = 'No ' + BASES.filter(function(b){ return b[0] === _st.basis; })[0][1] + ' figures for this view.'; return; }
  if (_st.mode === 'bps'){
    var prev = row(priorOf(_st.per), _st.basis);
    if (!prev){ note.textContent = 'Margin change compares with the same ' + (_st.gran === 'y' ? 'year' : 'quarter') + ' a year earlier, which this basis does not carry.'; return; }
    if (prev.itemized !== cur.itemized){ prev = row(priorOf(_st.per), 'act'); if (!prev || !prev.itemized){ note.textContent = 'This basis does not carry the expense lines for both periods.'; return; } }
    steps = bps(prev, cur); fmt = FMT_BPS;
    note.textContent = 'Operating margin on net revenue, ' + label(prev.p) + ' to ' + label(cur.p) + ': each bar is how much that expense line, as a share of net revenue, added to (green) or took from (red) the margin. ' + BASES.filter(function(b){ return b[0] === _st.basis; })[0][1] + ' basis.';
  } else {
    steps = buildup(cur); fmt = FMT_D;
    note.textContent = label(cur.p) + ' · ' + BASES.filter(function(b){ return b[0] === _st.basis; })[0][1] + ' basis' + (cur.itemized ? '' : ' · this basis has no expense lines below the total, so the four are one bar') + '. $B.';
  }
  var cv = wrap.querySelector('#maBrCanvas'); if (!cv || typeof Chart === 'undefined') return;
  _st.chart = new Chart(cv.getContext('2d'), { type: 'bar',
    data: { labels: steps.map(function(s){ return s.label; }), datasets: [{ data: steps.map(function(s){ return s.range; }), backgroundColor: steps.map(function(s){ return s.color; }),
      borderRadius: 4, borderSkipped: false, maxBarThickness: 56, categoryPercentage: 0.74, barPercentage: 0.9 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 24 } },
      plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: { title: function(it){ return it[0].label; }, label: function(c){
        var s = c.chart._steps[c.dataIndex];
        if (s.kind === 'base' || s.kind === 'total') return fmt.base(s.val);
        return fmt.delta(s.val) + (s.runAfter != null ? '   ·   running ' + fmt.base(s.runAfter) : ''); } } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8A93A0', font: { size: 11 }, autoSkip: false, maxRotation: 45, minRotation: 0 } },
        y: { position: 'right', beginAtZero: true, grid: { color: '#EEF2F7' }, ticks: { color: '#8A93A0', font: { size: 11 }, callback: function(v){ return fmt.axis(v); } } } } },
    plugins: [PLUGIN] });
  _st.chart._steps = steps; _st.chart._fmt = fmt; _st.chart.update('none');
  tbl.innerHTML = '<div class="rs-collap"><button type="button" class="rs-collap-h" data-mabrtb="1"><span class="rs-collap-ic">▸</span> The waterfall — every step <span class="rs-collap-sub">' + steps.length + ' rows</span></button>' +
    '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Step</th><th>Value</th><th>Running</th></tr></thead><tbody>' +
    steps.map(function(s){ var base = s.kind === 'base' || s.kind === 'total';
      return '<tr><td class="rs-ft-h">' + esc(s.label) + '</td><td>' + esc(base ? fmt.base(s.val) : fmt.delta(s.val)) + '</td><td>' + esc(fmt.base(s.runAfter == null ? s.val : s.runAfter)) + '</td></tr>'; }).join('') +
    '</tbody></table></div></div></div>';
}
export function initMaBridge(root){
  var wrap = root.querySelector('#maBridge'); if (!wrap) return;
  if (!wrap.__wired){
    wrap.__wired = true;
    wrap.addEventListener('click', function(ev){
      var b = ev.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-mabrtb')){ var body = b.nextElementSibling; body.hidden = !body.hidden; b.querySelector('.rs-collap-ic').textContent = body.hidden ? '▸' : '▾'; return; }
      if (b.hasAttribute('data-mabrmode')) _st.mode = b.getAttribute('data-mabrmode');
      else if (b.hasAttribute('data-mabrbasis')) _st.basis = b.getAttribute('data-mabrbasis');
      else if (b.hasAttribute('data-mabrgran')){ _st.gran = b.getAttribute('data-mabrgran'); _st.per = null; }
      else if (b.hasAttribute('data-mabrper')) _st.per = b.getAttribute('data-mabrper');
      else return;
      draw(root);
    });
  }
  draw(root);
}
