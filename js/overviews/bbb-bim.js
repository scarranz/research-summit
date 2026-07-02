// overviews/bbb-bim.js — TBBB "BİM Blueprint" sub-tab.
//
// Thesis: BBB Foods founder K. Anthony Hatoum built Tiendas 3B on the model of
// BİM (Borsa İstanbul: BIMAS), the Turkish hard-discount pioneer. BİM is ~10 years
// ahead, so its trajectory is a roadmap for 3B. We align the two by STORE COUNT:
// 3B today (~3,346 stores, 2025) ≈ BİM in 2011 (~3,289 stores) — and BİM has since
// compounded to ~14,473 stores, almost exactly 3B's stated ~14,000-store white space.
//
// Data integrity: Turkey has run 50–85% inflation since 2022 and adopted TAS 29
// (hyperinflation accounting) in FY2023, plus IFRS-16 (2019) inflated EBITDA. So
// nominal lira absolutes are NOT comparable across time — we use USD, % margins and
// per-store metrics. 3B figures are FY2025 actuals from the Summit model (MXN) and
// the 20-F; BİM figures are from BİM IR filings and market-data providers. See FOOT.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var TBBB_CLR = '#E1251B';     // 3B red
var BIM_CLR  = '#0E8F8F';     // BİM teal (distinct from 3B red)
var BIM_LT   = '#8FCBCB';     // BİM light (for the "2011" / early state)

// ─── Store-count trajectory ──────────────────────────────────────────────────
// BİM stores by calendar year (Turkey-only pre-2015; consolidated 2020+).
var BIM_STORES = [
  {x:2005, y:1500}, {x:2008, y:2285}, {x:2011, y:3289}, {x:2015, y:4972},
  {x:2020, y:9365}, {x:2022, y:11510}, {x:2023, y:12482}, {x:2024, y:13583}, {x:2025, y:14473},
];
// 3B stores aligned to BİM's calendar: 3B's 2025 (≈3,346 stores) maps to BİM's 2011,
// so we shift 3B back 14 years. The two curves then overlap on the way up.
var TBBB_SHIFT = 14;
var TBBB_STORES_RAW = [
  {yr:2020, y:1249}, {yr:2021, y:1500}, {yr:2022, y:1892},
  {yr:2023, y:2288}, {yr:2024, y:2772}, {yr:2025, y:3346},
];
var TBBB_STORES = TBBB_STORES_RAW.map(function(p){ return {x:p.yr - TBBB_SHIFT, y:p.y}; });

var _chartStores = null, _chartMargins = null;

// ─── Margin comparison (Gross, EBITDA ex-lease) ──────────────────────────────
var MARGIN_CATS = ['Gross margin', 'EBITDA margin (ex-lease)'];
var MARGIN_BIM11 = [16.0, 5.2];   // BİM 2011
var MARGIN_TBBB  = [16.2, 4.8];   // 3B 2025
var MARGIN_BIM25 = [19.0, 6.0];   // BİM 2025

// ─── Side-by-side comparison table ───────────────────────────────────────────
var CMP_ROWS = [
  ['Stores',                 '3,289',        '3,346',           '14,473'],
  ['Net sales (USD)',        '~$4.75B',      '~$4.2B',          '~$15B+'],
  ['Revenue / store',        '~$1.44M',      '~$1.25M',         '~$1.0M'],
  ['Gross margin',           '16.0%',        '16.2%',           '~19.0%'],
  ['EBITDA margin (ex-lease)','5.2%',        '~4.8%',           '~6.0%'],
  ['Net margin',             '3.65%',        '~breakeven*',     '2.6%'],
  ['Same-store sales',       '+14% (real)',  '~16% (real)',     '+56% nom · ~flat real'],
  ['Working capital (CCC)',  '~−20 days',    '−38 days',        '~−1 day'],
  ['Private label',          '~60%',         '58.2%',           '~59–64%'],
  ['Founded · IPO',          '1995 · 2005',  '2005 · 2024',     '—'],
  ['Market cap (USD)',       '~$4.2B',       '~$4.8B',          '~$9.4B'],
  ['P / Sales',              '~0.9×',        '~1.2×',           '~0.6×'],
  ['P / E',                  '18.6×',        'n/m (loss)*',     '~11–21×'],
];

var READTHROUGHS = [
  ['Same DNA, set early', 'At ~3,300 stores BİM already ran a ~16% gross margin, ~5% EBITDA, ~3.6% net margin and deeply negative working capital. 3B today looks almost identical — it is faithfully running the BİM model at the same size.'],
  ['The engine is store count, not margin', 'BİM became a ~15–20× USD multibagger without expanding margins. It simply added ~1,000 self-funded stores a year, turning ~3,300 stores (2011) into ~14,500 (2025) and ~3.4×-ing USD revenue.'],
  ['Suppliers fund the growth', 'Both run on negative working capital: shoppers pay cash while suppliers are paid weeks later, so inventory (and then new stores) is financed by payables. BİM has stayed net-cash for two decades; 3B sits at ~−38 days today.'],
  ['The destination ≈ the white space', 'BİM now runs ~14,473 stores — almost exactly the ~14,000-store opportunity 3B says exists in Mexico. BİM is living proof that a hard-discounter can compound to that scale.'],
];

var FOOT = 'BİM trajectory is the closest available read on 3B\'s potential, but not a guarantee — Turkey and Mexico differ in inflation, FX, competition and regulation. <b>Inflation caveat:</b> Turkey adopted TAS 29 hyperinflation accounting (FY2023) and IFRS-16 (2019), so nominal-lira figures are not comparable across time; we use USD, % margins and per-store metrics. BİM\'s recent +56% same-store sales is almost entirely price pass-through (real customer traffic ≈ flat), whereas 3B\'s ~16% is in a low-inflation economy and far closer to real volume. The 2011 store-crossing (~3,346) is bracketed (2,285 in 2008; 4,972 in 2015) and dated to ~2011; the BİM line is Turkey-only before ~2015 and consolidated (incl. Morocco, Egypt, FİLE) from 2020. *3B FY2025 GAAP net loss was driven by one-off IPO share-based compensation; underlying profitability was ~breakeven (FY2024 was positive). Sources: BBB Foods FY2025 Form 20-F & Summit model (live mkt data via IBKR); BİM IR filings (english.bim.com.tr), companiesmarketcap, stockanalysis.com, GuruFocus.';

// ─── Body ────────────────────────────────────────────────────────────────────
function bimBody(c){
  var h = '';

  h += '<p class="ov-lede">BBB Foods founder <b>K. Anthony Hatoum</b> built Tiendas 3B on the blueprint of '+
    '<b style="color:'+BIM_CLR+'">BİM</b> (Borsa İstanbul: BIMAS), the Turkish hard-discount pioneer. '+
    'BİM is roughly <b>a decade ahead</b> — so to see where 3B could go, look at where BİM has been. '+
    'Aligning the two by size: <b>3B today ≈ BİM in 2011</b>.</p>';

  // Alignment banner.
  h += '<div class="bim-banner">'+
    '<div class="bim-stat"><div class="bim-stat-v" style="color:'+TBBB_CLR+'">3,346</div><div class="bim-stat-l">3B stores today (2025)</div></div>'+
    '<div class="bim-arrow">≈</div>'+
    '<div class="bim-stat"><div class="bim-stat-v">2011</div><div class="bim-stat-l">when BİM was this size</div></div>'+
    '<div class="bim-arrow">→</div>'+
    '<div class="bim-stat"><div class="bim-stat-v" style="color:'+BIM_CLR+'">14,473</div><div class="bim-stat-l">BİM stores now ≈ 3B\'s ~14,000 white space</div></div>'+
  '</div>';

  // 1 — Store trajectory chart.
  h += '<div class="ov-sec-h ovt-store-h">The roadmap — BİM\'s store trajectory vs. where 3B is today</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Store count <span>(3B aligned so its 2025 sits at BİM\'s equivalent-size year, 2011)</span></div>'+
    '<div class="ov-chart-wrap bim-stores-wrap"><canvas id="bbbChartBimStores"></canvas></div>'+
    '<div class="ovt-legend">'+
      '<span class="ovt-lg"><i style="background:'+BIM_CLR+'"></i>BİM (2005–2025)</span>'+
      '<span class="ovt-lg"><i style="background:'+TBBB_CLR+'"></i>Tiendas 3B (aligned: 2025 → 2011)</span>'+
    '</div>'+
  '</div>';
  h += '<div class="ov-foot">3B has retraced BİM\'s early path almost exactly. Everything to the right of 2011 is BİM\'s next 14 years — the runway the blueprint implies for 3B: roughly <b>4×</b> the store base, self-funded.</div>';

  // 2 — Side-by-side comparison table.
  h += '<div class="ov-sec-h ovt-store-h">Side by side — at comparable maturity</div>';
  h += '<table class="bim-cmp"><thead><tr>'+
    '<th>Metric</th>'+
    '<th>BİM @ ~3,300 stores<span>(2011)</span></th>'+
    '<th class="bim-col-3b">Tiendas 3B today<span>(FY2025)</span></th>'+
    '<th>BİM today<span>(FY2025)</span></th>'+
    '</tr></thead><tbody>';
  h += CMP_ROWS.map(function(r){
    return '<tr><td class="bim-k">'+esc(r[0])+'</td>'+
      '<td>'+esc(r[1])+'</td>'+
      '<td class="bim-col-3b">'+esc(r[2])+'</td>'+
      '<td>'+esc(r[3])+'</td></tr>';
  }).join('');
  h += '</tbody></table>';
  h += '<div class="ov-foot">The striking read: <b>3B today (middle) lines up almost cell-for-cell with BİM in 2011 (left)</b> — same gross margin, same hard-discount EBITDA, same supplier-financed negative working capital, same private-label share. BİM today (right) is the destination.</div>';

  // 3 — Margin comparison chart.
  h += '<div class="ov-sec-h ovt-store-h">Margins — stable by design</div>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Gross & EBITDA margin <span>(%, ex-lease basis)</span></div>'+
    '<div class="ov-chart-wrap bim-margins-wrap"><canvas id="bbbChartBimMargins"></canvas></div>'+
    '<div class="ovt-legend">'+
      '<span class="ovt-lg"><i style="background:'+BIM_LT+'"></i>BİM 2011</span>'+
      '<span class="ovt-lg"><i style="background:'+TBBB_CLR+'"></i>3B 2025</span>'+
      '<span class="ovt-lg"><i style="background:'+BIM_CLR+'"></i>BİM 2025</span>'+
    '</div>'+
  '</div>';
  h += '<div class="ov-foot">Hard-discount economics are set early and barely move: BİM\'s margins at 3B\'s size (2011) and 3B\'s margins today are nearly the same, and even 25 years on BİM only added a couple of points. The compounding came from <b>store count</b>, not margin.</div>';

  // 4 — Read-throughs.
  h += '<div class="ov-sec-h ovt-store-h">What the blueprint implies for 3B</div>';
  h += '<div class="bim-cards">' + READTHROUGHS.map(function(r){
    return '<div class="bim-card"><div class="bim-card-h">'+esc(r[0])+'</div><div class="bim-card-b">'+esc(r[1])+'</div></div>';
  }).join('') + '</div>';

  h += '<div class="ov-foot">'+FOOT+'</div>';
  return h;
}

// ─── Charts ──────────────────────────────────────────────────────────────────
// Dashed vertical alignment line at year 2011 ("3B is here today").
var bimAlignLine = {
  id: 'bimAlignLine',
  afterDatasetsDraw: function(chart){
    var x = chart.scales.x, y = chart.scales.y;
    if (!x || !y) return;
    var px = x.getPixelForValue(2011);
    var ctx = chart.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(225,37,27,0.55)';
    ctx.setLineDash([5,4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = TBBB_CLR; ctx.font = '700 11px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('3B is here (2025)', px, y.top + 12);
    ctx.restore();
  }
};

function buildStoresChart(){
  var cv = document.getElementById('bbbChartBimStores');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartStores) { _chartStores.destroy(); _chartStores = null; }
  _chartStores = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { datasets: [
      { label:'BİM', data:BIM_STORES, borderColor:BIM_CLR, backgroundColor:BIM_CLR,
        borderWidth:2.5, pointRadius:3.5, pointHoverRadius:5, tension:.25, fill:false },
      { label:'Tiendas 3B', data:TBBB_STORES, borderColor:TBBB_CLR, backgroundColor:TBBB_CLR,
        borderWidth:2.5, pointRadius:3.5, pointHoverRadius:5, tension:.25, fill:false, borderDash:[6,4] },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:20 } },
      interaction:{ mode:'nearest', intersect:false },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ var raw = items[0].raw; var di = items[0].datasetIndex;
            return di === 1 ? ('3B ' + (raw.x + TBBB_SHIFT) + '  (BİM-year ' + raw.x + ')') : ('BİM ' + raw.x); },
          label:function(ctx){ return Number(ctx.parsed.y).toLocaleString() + ' stores'; }
        } }
      },
      scales:{
        x:{ type:'linear', min:2005, max:2026, ticks:{ stepSize:5, color:'#8A93A0', font:{ size:12 }, callback:function(v){ return v; } }, grid:{ display:false } },
        y:{ beginAtZero:true, grace:'8%', ticks:{ color:'#8A93A0', font:{ size:12 }, callback:function(v){ return (v/1000) + 'k'; } }, grid:{ color:'rgba(0,0,0,0.05)' } }
      }
    },
    plugins: [bimAlignLine]
  });
}

// Value labels above each margin bar.
var marginLabels = {
  id: 'marginLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      meta.data.forEach(function(bar, i){
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = '700 10.5px Inter, sans-serif';
        ctx.fillStyle = ds.backgroundColor;
        ctx.fillText(Number(ds.data[i]).toFixed(1) + '%', bar.x, bar.y - 5);
        ctx.restore();
      });
    });
  }
};

function buildMarginsChart(){
  var cv = document.getElementById('bbbChartBimMargins');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartMargins) { _chartMargins.destroy(); _chartMargins = null; }
  _chartMargins = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: MARGIN_CATS, datasets: [
      { label:'BİM 2011', data:MARGIN_BIM11, backgroundColor:BIM_LT, maxBarThickness:64 },
      { label:'3B 2025',  data:MARGIN_TBBB,  backgroundColor:TBBB_CLR, maxBarThickness:64 },
      { label:'BİM 2025', data:MARGIN_BIM25, backgroundColor:BIM_CLR, maxBarThickness:64 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:18 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label + ': ' + Number(ctx.parsed.y).toFixed(1) + '%'; } } }
      },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:'#3A434F', font:{ size:12, weight:'600' } } },
        y:{ beginAtZero:true, grace:'12%', ticks:{ color:'#8A93A0', font:{ size:12 }, callback:function(v){ return v + '%'; } }, grid:{ color:'rgba(0,0,0,0.05)' } }
      }
    },
    plugins: [marginLabels]
  });
}

function initBim(root){
  buildStoresChart();
  buildMarginsChart();
}

export var bbbBim = { body: bimBody, init: initBim };
