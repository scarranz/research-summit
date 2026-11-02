// bbb-sbc.js — Bottom Line ▸ General ▸ "Stock-based compensation" for Tiendas 3B.
// Two pieces, both from the 2Q26 earnings release (Appendix 1 and Appendix 2):
//   1. The company's projected non-cash share-based payment expense by program (Legacy Plan, Post-IPO options, Post-IPO RSUs,
//      Liquidity Event Plan), 2026E to 2029E, as a stacked bar, with the reported 2025 and 1H26 actuals beside it.
//   2. The illustrative fully diluted share count at 30 Jun 2026 (US$35 per Class A share, net settlement of options).
// The expense is recognized on a graded-vesting basis (higher early, decreasing over time) and is already inside the fully
// diluted count, so the schedule is a P&L effect, not new dilution. Reported figures (FY2025 Ps.2,930M; 1H26 Ps.1,337M) come
// from the 20-F cash flow statement and the 2Q26 release; they are the same figures the Results tab carries as "SBC".
// Chart.js is a global (CDN).
var INK = '#14213D', MUTE = '#5B7085', GRID = 'rgba(20,33,61,.08)';
var COLORS = { legacy: '#5B7085', opts: '#2557D6', rsu: '#7AA7E0', lep: '#C0392B', rep: '#14213D' };
var _ch = null;

// Ps. millions. Source: 2Q26 release, "Projected Share-Based Payment Non-Cash Expense" (Appendix 2).
var YEARS = ['FY2025 (reported)', 'FY2026E', 'FY2027E', 'FY2028E', 'FY2029E'];
var PLAN = {
  legacy: [null, 219, 115, 45, 0],
  opts:   [null, 530, 278, 142, 50],
  rsu:    [null, 252, 17, 0, 0],
  lep:    [null, 1378, 470, 28, 0],
  rep:    [2930, null, null, null, null]
};
var TOTAL = [2930, 2379, 881, 215, 50];
var HALF = { y1h26: 1337, y2h26e: 1042 };   // 1H26 reported (Ps.1,336.7M) and 3Q26E + 4Q26E (553 + 489)

// Appendix 1, as of 30 Jun 2026.
var SHARES = [
  ['Class A common shares (public, incl. 0.59M vested RSUs)', '77,938,244'],
  ['Class B common shares (high-vote)', '5,210,000'],
  ['Class C common shares (incl. 3.13M vested Liquidity Event shares)', '38,039,530'],
  ['Common shares outstanding', '121,187,774', true],
  ['Liquidity Event Plan Class C shares (vesting / delayed delivery)', '4,374,993'],
  ['Bolton Partners Class C allocation', '4,224,960'],
  ['Total common shares', '129,787,727', true],
  ['Net shares from equity plans (net settlement at US$35)', '32,259,957'],
  ['Fully diluted share count (illustrative)', '162,047,684', true]
];

function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmt(v){ return v == null ? '—' : Math.round(v).toLocaleString('en-US'); }

function body(){
  var rows = [['Legacy Plan', 'legacy'], ['Post-IPO plan, options', 'opts'], ['Post-IPO plan, RSUs', 'rsu'], ['Liquidity Event Plan', 'lep']];
  var tbl = '<table class="ov-table"><thead><tr><th>Ps. millions</th>' + YEARS.map(function(y){ return '<th>' + esc(y) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    rows.map(function(r){ return '<tr><td class="ov-td-name">' + r[0] + '</td>' + PLAN[r[1]].map(function(v){ return '<td>' + fmt(v) + '</td>'; }).join('') + '</tr>'; }).join('') +
    '<tr><td class="ov-td-name"><b>Total non-cash SBC</b></td>' + TOTAL.map(function(v){ return '<td><b>' + fmt(v) + '</b></td>'; }).join('') + '</tr></tbody></table>';
  var sh = '<table class="ov-table"><tbody>' + SHARES.map(function(r){
    return '<tr><td class="ov-td-name">' + (r[2] ? '<b>' + esc(r[0]) + '</b>' : esc(r[0])) + '</td><td style="text-align:right">' + (r[2] ? '<b>' + r[1] + '</b>' : r[1]) + '</td></tr>';
  }).join('') + '</tbody></table>';
  return '<div class="ov-sec"><div class="ov-sec-h">Stock-based compensation: the schedule behind reported EBITDA</div>' +
    '<div class="ov-chart-card"><div class="ov-chart-t">Non-cash SBC by program <span>(Ps. millions · FY2025 reported, then the company projection)</span></div>' +
    '<div class="ov-chart-wrap" style="height:300px"><canvas id="bbbSbcCv"></canvas></div></div>' +
    '<details class="rs-tbl-wrap" style="margin-top:8px"><summary style="cursor:pointer;font-size:11px;font-weight:800;color:var(--navy)">The schedule, every program</summary>' + tbl + '</details>' +
    '<div class="ov-foot">FY2026E Ps.2,379M is 1H26 reported (Ps.1,337M) plus 3Q26E Ps.553M and 4Q26E Ps.489M. Expense is recognized on a graded-vesting basis, higher early and decreasing over time. The 7.5M-share Liquidity Event Plan was granted on June 24, 2025 and vests quarterly over three years, with expense recognized from 3Q25. The schedule only covers awards granted to date; more may be granted under the 2024 Equity Incentive Plan. It is already reflected in the fully diluted count, so it is a P&amp;L effect, not additional dilution. Source: 2Q26 earnings release, Appendix 2.</div></div>' +
    '<div class="ov-sec"><div class="ov-sec-h">Share count and dilution at June 30, 2026</div>' + sh +
    '<div class="ov-foot">Illustrative, as the company presents it: US$35.00 per Class A share, net settlement of all options at their weighted-average strike (Legacy Plan options US$5.73 per Class C share; Post-IPO options US$32.91 per Class A share), all options assumed vested. Legacy options are exercisable for Class C shares. Source: 2Q26 earnings release, Appendix 1.</div></div>';
}
function build(){
  var cv = document.getElementById('bbbSbcCv');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_ch) { _ch.destroy(); _ch = null; }
  var ds = [
    { label: 'Reported', key: 'rep', color: COLORS.rep },
    { label: 'Legacy Plan', key: 'legacy', color: COLORS.legacy },
    { label: 'Post-IPO options', key: 'opts', color: COLORS.opts },
    { label: 'Post-IPO RSUs', key: 'rsu', color: COLORS.rsu },
    { label: 'Liquidity Event Plan', key: 'lep', color: COLORS.lep }
  ].map(function(d){ return { label: d.label, data: PLAN[d.key], backgroundColor: d.color, stack: 's', borderSkipped: false, maxBarThickness: 64 }; });
  var totalLbl = { id: 'bbbSbcTot', afterDatasetsDraw: function(chart){
    var ctx = chart.ctx, y = chart.scales.y, meta = chart.getDatasetMeta(1);
    ctx.save(); ctx.fillStyle = INK; ctx.font = '800 11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
    TOTAL.forEach(function(t, i){
      var bar = chart.getDatasetMeta(i === 0 ? 0 : 1).data[i]; if (!bar) return;
      ctx.fillText('Ps.' + fmt(t) + 'M', bar.x, y.getPixelForValue(t) - 6);
    });
    ctx.restore();
  } };
  _ch = new Chart(cv.getContext('2d'), { type: 'bar', data: { labels: YEARS, datasets: ds },
    options: { responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 22 } },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, color: MUTE } },
        tooltip: { callbacks: { label: function(c){ return c.dataset.label + ': Ps.' + fmt(c.parsed.y) + 'M'; } } } },
      scales: { x: { stacked: true, grid: { display: false }, ticks: { color: MUTE, font: { size: 11 } } },
        y: { stacked: true, beginAtZero: true, grid: { color: GRID }, ticks: { color: MUTE, font: { size: 11 }, callback: function(v){ return fmt(v); } } } } },
    plugins: [totalLbl] });
}
function init(){ requestAnimationFrame(build); }
export var bbbSbc = { body: body, init: init };
