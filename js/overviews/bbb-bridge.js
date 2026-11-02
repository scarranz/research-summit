// bbb-bridge.js — Bottom Line ▸ General ▸ "The bridge" for Tiendas 3B.
// A waterfall from gross profit to EBITDA ex-SBC after leases, for one period (a quarter or a fiscal year),
// in % of revenue or in Ps. millions. It exists because 3B reports under IFRS 16: rent is capitalized, so
// depreciation of right-of-use assets is added back with all other D&A and EBITDA lands BEFORE rent. The last
// two steps (EBITDA ex-SBC, then minus the building lease payments the company discloses) show that effect.
// Every number comes from tbbbResults (releases + 20-F); the steps are derived from those lines:
//   other income (expense), net = operating profit − (gross profit − sales − admin)
//   D&A                         = reported EBITDA − operating profit
//   one-off                     = EBITDA ex-SBC − (reported EBITDA + SBC)   (the Ps.230M 4Q25 receivable write-off)
// Chart.js is a global (CDN). Same floating-bar look as the AMZN bridge, without the Summit sliders.
import { tbbbResults } from '../results-data/tbbb.js';

var INK = '#14213D', POS = '#1F9D55', NEG = '#C0392B', MUTE = '#5B7085', SUB = '#8FB8A0', GRID = 'rgba(20,33,61,.08)';
var _ch = null, _state = { per: '2Q26', mode: 'pct' };

function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Periods the bridge can show: every quarter with a rent figure, then the fiscal years that have one.
function periods(){
  var out = [], q = tbbbResults.views.q.metrics, y = tbbbResults.views.y.metrics;
  q.rev.periods.forEach(function(p, i){ if (q.rev.act[i] != null && q.rent.act[i] != null) out.push({ k: p, v: 'q', i: i }); });
  y.rev.periods.forEach(function(p, i){ if (y.rev.act[i] != null && y.rent.act[i] != null) out.push({ k: 'FY' + p, v: 'y', i: i }); });
  return out;
}
function row(per){
  var m = tbbbResults.views[per.v].metrics, r = {};
  ['rev','gp','sales','admin','adminx','sbc','opinc','ebitda','adj','rent'].forEach(function(k){ r[k] = m[k].act[per.i]; });
  return r;
}
function steps(r){
  var other = r.opinc - (r.gp - r.sales - r.admin);
  var da = r.ebitda - r.opinc;
  var oneoff = r.adj - (r.ebitda + r.sbc);
  var run = r.gp, out = [{ label: 'Gross profit', kind: 'total', color: SUB, range: [0, run], runAfter: run, val: run }];
  function mv(label, v, color){   // v signed: negative = cost
    var from = run; run = from + v;
    out.push({ label: label, kind: 'step', color: color || (v >= 0 ? POS : NEG), range: [Math.min(from, run), Math.max(from, run)], runAfter: run, val: v });
  }
  function tot(label, color){ out.push({ label: label, kind: 'total', color: color, range: [0, run], runAfter: run, val: run }); }
  mv('Sales expenses', -r.sales); mv('Admin ex-SBC', -r.adminx); mv('SBC (non-cash)', -r.sbc); mv('Other income, net', other);
  tot('Operating profit', INK);
  mv('+ D&A (incl. right-of-use)', da, MUTE);
  tot('EBITDA (reported)', INK);
  mv('+ SBC added back', r.sbc, MUTE);
  if (Math.abs(oneoff) >= 1) mv('+ One-off write-off', oneoff, MUTE);
  tot('EBITDA ex-SBC', POS);
  mv('− Building leases (rent)', -r.rent, NEG);
  tot('EBITDA ex-SBC after leases', INK);
  return out;
}
function fmt(v, rev){
  if (_state.mode === 'pct') return (v < 0 ? '−' : '') + Math.abs(v / rev * 100).toFixed(1) + '%';
  return (v < 0 ? '−' : '') + 'Ps.' + Math.abs(Math.round(v)).toLocaleString('en-US') + 'M';
}

var PLUGIN = { id: 'bbbBrLbl', afterDatasetsDraw: function(chart){
  var st = chart._steps; if (!st) return;
  var ctx = chart.ctx, meta = chart.getDatasetMeta(0), y = chart.scales.y, rev = chart._rev, k = chart._k || 1;
  ctx.save();
  ctx.strokeStyle = 'rgba(91,112,133,.55)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
  for (var i = 0; i < st.length - 1; i++){
    var b0 = meta.data[i], b1 = meta.data[i + 1], yy = y.getPixelForValue(st[i].runAfter * k);
    ctx.beginPath(); ctx.moveTo(b0.x + b0.width / 2, yy); ctx.lineTo(b1.x - b1.width / 2, yy); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.textAlign = 'center';
  for (var j = 0; j < st.length; j++){
    var s = st[j], bar = meta.data[j], top = y.getPixelForValue(Math.max(s.range[0], s.range[1]) * k);
    var txt = fmt(s.val, rev); if (s.kind === 'step' && s.val > 0) txt = '+' + txt;
    ctx.fillStyle = s.kind === 'total' ? INK : (s.val >= 0 ? POS : NEG);
    ctx.font = (s.kind === 'total' ? '800 11px' : '700 10.5px') + ' Inter, system-ui, sans-serif';
    ctx.fillText(txt, bar.x, top - 6);
  }
  ctx.restore();
} };

function pills(){
  var ps = periods();
  return ps.map(function(p){ return '<button type="button" class="mg-pill bbb-br-p'+(p.k === _state.per ? ' active' : '')+'" data-brp="'+esc(p.k)+'">'+esc(p.k)+'</button>'; }).join('');
}
function body(){
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge: from gross profit to EBITDA after leases</div>'+
    '<div class="bbb-br-ctl" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 10px">'+
      '<span class="bbb-br-l" style="font-size:10.5px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.05em">Period</span>'+
      '<div class="mg-pills bbb-br-per" style="display:flex;flex-wrap:wrap;gap:4px">'+pills()+'</div>'+
      '<span style="flex:1"></span>'+
      '<div class="mg-pills" style="display:flex;gap:4px">'+
        '<button type="button" class="mg-pill bbb-br-m active" data-brm="pct">% of revenue</button>'+
        '<button type="button" class="mg-pill bbb-br-m" data-brm="abs">Ps. millions</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-wrap" style="height:340px"><canvas id="bbbBridgeCv"></canvas></div></div>'+
    '<details class="rs-tbl-wrap" style="margin-top:8px"><summary style="cursor:pointer;font-size:11px;font-weight:800;color:var(--navy)">The waterfall, every step</summary><div id="bbbBridgeTbl"></div></details>'+
    '<div class="ov-foot">Under IFRS 16 the rent on stores and distribution centers is capitalized: its depreciation is added back inside D&amp;A and its interest sits in financial costs, so reported EBITDA (and EBITDA ex-SBC) is before rent. The last step subtracts the building lease payments the company discloses each quarter (capitalized lease payments for buildings) to give the figure a rent-in-opex reader would use. '+
    'Other income, net, D&amp;A and the one-off are derived from the reported lines (see the Results notes); the one-off is the Ps.230M account-receivable write-off in 4Q25 and FY2025. Sources: BBB Foods earnings releases (Form 6-K) and Form 20-F; lease payments from the Additional Disclosures of each release.</div>'+
  '</div>';
}
function build(){
  var cv = document.getElementById('bbbBridgeCv');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  var ps = periods(), per = ps.filter(function(p){ return p.k === _state.per; })[0] || ps[ps.length - 1];
  if (!per) return;
  var r = row(per), st = steps(r), pct = _state.mode === 'pct';
  var data = st.map(function(s){ return pct ? [s.range[0] / r.rev * 100, s.range[1] / r.rev * 100] : s.range; });
  if (_ch) { _ch.destroy(); _ch = null; }
  _ch = new Chart(cv.getContext('2d'), { type: 'bar',
    data: { labels: st.map(function(s){ return s.label; }), datasets: [{ data: data, backgroundColor: st.map(function(s){ return s.color; }), borderRadius: 4, borderSkipped: false, maxBarThickness: 54, categoryPercentage: 0.78, barPercentage: 0.9 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 24 } },
      plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: {
        title: function(it){ return it[0].label + ' · ' + per.k; },
        label: function(ctx){ var s = ctx.chart._steps[ctx.dataIndex]; return fmt(s.val, ctx.chart._rev) + '   ·   running ' + fmt(s.runAfter, ctx.chart._rev); } } } },
      scales: { x: { grid: { display: false }, ticks: { color: MUTE, font: { size: 10.5 }, autoSkip: false, maxRotation: 40, minRotation: 0 } },
        y: { position: 'right', beginAtZero: true, grid: { color: GRID }, ticks: { color: MUTE, font: { size: 11 }, callback: function(v){ return pct ? v.toFixed(0) + '%' : Math.round(v).toLocaleString('en-US'); } } } } },
    plugins: [PLUGIN] });
  _ch._steps = st; _ch._rev = r.rev; _ch._k = pct ? 100 / r.rev : 1; _ch.update('none');
  var tw = document.getElementById('bbbBridgeTbl');
  if (tw) tw.innerHTML = '<table class="ov-table"><thead><tr><th>Step</th><th>Ps. M</th><th>% of revenue</th><th>Running (Ps. M)</th></tr></thead><tbody>'+
    st.map(function(s){ return '<tr><td class="ov-td-name">'+esc(s.label)+'</td><td>'+Math.round(s.val).toLocaleString('en-US')+'</td><td>'+(s.val / r.rev * 100).toFixed(1)+'%</td><td>'+Math.round(s.runAfter).toLocaleString('en-US')+'</td></tr>'; }).join('')+'</tbody></table>';
}
function init(root){
  var pane = root.querySelector('.dd-subpane[data-dds="blgen"]') || root; if (!pane.querySelector('#bbbBridgeCv')) return;
  pane.querySelectorAll('.bbb-br-p').forEach(function(b){ b.onclick = function(){
    _state.per = b.getAttribute('data-brp');
    pane.querySelectorAll('.bbb-br-p').forEach(function(x){ x.classList.toggle('active', x === b); }); build(); }; });
  pane.querySelectorAll('.bbb-br-m').forEach(function(b){ b.onclick = function(){
    _state.mode = b.getAttribute('data-brm');
    pane.querySelectorAll('.bbb-br-m').forEach(function(x){ x.classList.toggle('active', x === b); }); build(); }; });
  build();
}
export var bbbBridge = { body: body, init: init };
