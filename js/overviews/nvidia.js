// overviews/nvidia.js — custom Overview for NVIDIA Corporation (Nasdaq: NVDA)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Multi-tab profile. Each tab is a self-contained body function; the tab bar and
// switching are generic so tabs can be added/reordered freely. Tabs:
//   1 Overview   — executive summary (snapshot, KPIs, how it makes money, financials,
//                  peers, tailwinds/headwinds).
//   2 Segments   — old vs new reporting framework, revenue by segment (recast), GAAP
//                  operating segments, guidance and per-segment milestones.
//   3 Technology — what NVIDIA sells (GPUs, CUDA, Omniverse, networking) + product timeline. [WIP]
//   4 Management — leadership.
//   5 Consensus  — how NVIDIA has beaten consensus every quarter/year since FY2023. [WIP]
//   6 Valuation  — multiples + the Summit DCF forward view.
//   7 Industry Analysis — the shared semiconductor supply-chain map, pre-drilled to NVDA.
//
// Figures: NVIDIA reports in US dollars on a fiscal year ending the last Sunday in January
// (FY2026 ended Jan 25, 2026; Q1 FY2027 ended Apr 26, 2026). Segment figures are NVIDIA
// reported actuals, sourced from the FY2026 10-K and the Q1 FY2027 press release / CFO
// commentary (the recast "Revenue by Market Platform" table). "Summit DCF model" figures
// (Valuation tab) are the Summit team's own internal projections — NOT company guidance.

import { semiIndustry } from './semi-industry.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtB(m){ return '$'+(m/1000).toFixed(1)+'B'; }   // $M → "$xx.xB"

// ─── Render helpers (shared overview.css classes) ──────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rowsKV(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }
function wipNote(lines){
  return '<div class="ov-callout"><b>This tab is in progress.</b> '+esc(lines.lead)+'</div>'+
    '<div class="ov-sec-h" style="margin-top:14px">What will go here</div>'+bullets(lines.items);
}

// ════════════════════════════════════════════════════════════════════════════════
// 1 — OVERVIEW
// ════════════════════════════════════════════════════════════════════════════════
var SNAPSHOT = [
  ['Listing', 'Nasdaq: NVDA'],
  ['HQ', 'Santa Clara, CA'],
  ['Founded', '1993'],
  ['Model', 'Fabless chip designer'],
  ['Fiscal year', 'Ends late January'],
  ['Founder, President & CEO', 'Jensen Huang'],
];
var DESC = 'NVIDIA is a fabless designer of accelerated-computing platforms — and the company at the center of the AI build-out. It designs the GPUs, CPUs and full rack-scale systems that train and run modern AI, then outsources manufacturing to TSMC, sources HBM memory from SK hynix, and assembles systems through partners such as Foxconn. Its durable advantage is not just the chip but the full stack on top of it: the CUDA software platform and a two-decade developer ecosystem, plus a complete data-center networking stack (NVLink, InfiniBand, Spectrum) acquired via Mellanox. Because the semiconductor industry is not vertically integrated, NVIDIA sits inside a deep web of suppliers and partners — mapped in the Industry Analysis tab.';

// Headline KPIs — FY2026 (year ended Jan 25, 2026), NVIDIA reported actuals.
var KPIS = [
  { l:'Revenue (FY2026)',     v:'$215.9B', d:'+65% YoY',                    dir:'up' },
  { l:'Data Center revenue',  v:'$193.7B', d:'~90% of revenue · +68% YoY',  dir:'up' },
  { l:'GAAP net income',      v:'$120.1B', d:'+65% YoY',                     dir:'up' },
  { l:'Diluted EPS (GAAP)',   v:'$4.90',   d:'+67% YoY',                     dir:'up' },
];
var AS_OF = 'Figures are in US dollars. NVIDIA’s fiscal year ends the last Sunday in January — FY2026 ended January 25, 2026. Headline KPIs and the financial table are NVIDIA reported actuals (FY2026 10-K / press releases). "Summit DCF model" figures in the Valuation tab are the Summit team’s internal projections, not company guidance.';
var FY_NOTE = 'FY2026 revenue rose 65% to $215.9B as the Blackwell platform ramped and Data Center reached ~90% of the business. GAAP gross margin stepped down to 71.1% for the year — pulled down mainly by a ~$4.5B Q1 FY2026 charge tied to H20 inventory and U.S.–China export limits — before recovering to 75.0% in Q4. All per-share figures are split-adjusted for the June 2024 10-for-1 split.';

var HOW_MONEY = [
  'NVIDIA sells <b>accelerated-computing platforms</b>, not just chips: GPUs, Grace CPUs, DPUs, NVLink/InfiniBand networking, reference systems (DGX, HGX, GB200/GB300 NVL72) and the software that runs them.',
  'The vast majority of revenue is <b>Data Center</b> — selling AI training and inference compute to hyperscalers, cloud providers, enterprises and sovereign-AI buyers.',
  'The moat is <b>CUDA</b>: a ~20-year software platform and developer ecosystem that makes NVIDIA GPUs the default target for AI frameworks, creating high switching costs.',
  'NVIDIA is <b>fabless</b> — it captures the design and platform margin while <b>TSMC</b> manufactures the silicon, <b>SK hynix / Micron / Samsung</b> supply HBM, and <b>Foxconn</b> and others assemble systems.',
  'An <b>annual product cadence</b> (Hopper → Blackwell → Rubin) keeps performance-per-watt ahead of rivals and pulls customers through repeated upgrade cycles.',
];

var FINANCIALS = [
  ['Revenue',               '$130.5B', '$215.9B (+65%)'],
  ['Data Center revenue',   '$115.2B', '$193.7B (+68%)'],
  ['GAAP gross margin',     '75.0%',   '71.1%'],
  ['GAAP operating income', '$81.5B',  '$130.4B (+60%)'],
  ['GAAP net income',       '$72.9B',  '$120.1B (+65%)'],
  ['Diluted EPS (GAAP)',    '$2.94',   '$4.90 (+67%)'],
];
var FIN_NOTE = 'All figures split-adjusted (June 2024 10-for-1 split). Full-year GAAP gross margin fell to 71.1% largely because of a ~$4.5B Q1 FY2026 H20 inventory/China charge; Q4 FY2026 gross margin recovered to 75.0%. Source: NVIDIA FY2026 press release & 10-K.';

var PEERS = [
  ['AMD', 'Instinct MI300/MI350 accelerators and EPYC CPUs — the #2 merchant GPU for AI, manufactured by TSMC.', 'NVIDIA leads on the full stack — CUDA software, NVLink and networking — not just raw silicon, and ships a broader rack-scale system.'],
  ['Custom ASICs (Broadcom · Marvell)', 'Hyperscaler in-house chips — Google TPU, AWS Trainium/Inferentia, Microsoft Maia — designed with Broadcom/Marvell IP.', 'These target a customer’s own workloads; NVIDIA offers a general-purpose, programmable platform with a far larger software ecosystem.'],
  ['Intel', 'Gaudi AI accelerators plus a foundry ambition; NVIDIA invested $5B in Intel (2025).', 'NVIDIA is generations ahead in AI performance and ecosystem; Intel matters more as a potential manufacturing partner than a rival.'],
  ['Hyperscalers (customers & competitors)', 'Microsoft, Google, Amazon and Meta are NVIDIA’s largest customers — and also build their own silicon.', 'Customer concentration is a real risk, but in-house chips have so far complemented rather than replaced NVIDIA’s GPUs.'],
];

var TAILWINDS = [
  'A multi-year <b>AI infrastructure super-cycle</b> — hyperscaler capex keeps rising and broadening to enterprises and sovereign-AI buyers.',
  'The <b>CUDA software moat</b> and a ~20-year developer ecosystem create high switching costs and default-platform status.',
  '<b>Full-stack expansion</b> — Grace CPUs, NVLink, Mellanox/Spectrum networking, rack-scale systems and software — raises content per deployment.',
  'An <b>annual product cadence</b> (Hopper → Blackwell → Rubin) compounds a performance-per-watt lead rivals struggle to match.',
  'Shift from training toward <b>inference</b> and "agentic" AI expands the addressable compute base over time.',
];
var HEADWINDS = [
  '<b>Customer concentration</b>: a handful of hyperscalers drive a large share of revenue — and are designing their own custom silicon.',
  '<b>China export controls</b>: U.S. restrictions limit sales of advanced GPUs (e.g. H20) into a large market and have already triggered charges.',
  '<b>AI-capex cyclicality</b>: any pause or "digestion" in hyperscaler spending would hit NVIDIA hard given how concentrated demand is.',
  '<b>Supply-chain dependence</b>: reliant on a single leading-edge foundry (TSMC), CoWoS advanced packaging, and HBM from a few memory makers.',
  '<b>Competition</b> from AMD and from increasingly capable custom ASICs (TPU, Trainium, Maia); <b>high expectations</b> already embedded in the stock.',
];

var SOURCES = 'Sources: NVIDIA Corporation (Nasdaq: NVDA) FY2024–FY2026 press releases and Annual Reports on Form 10-K, and the Q1 FY2027 press release & CFO commentary (quarter ended April 26, 2026). Forward "Summit DCF model" figures are the Summit team’s internal projections (Summit Financial Data, NVDA model, synced June 4, 2026) — not company guidance or consensus. All figures in US dollars and split-adjusted for the June 2024 10-for-1 split. Peer descriptions summarize public information.';

function overviewBody(){
  var h = '';
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  h += sec('How NVIDIA Makes Money', bullets(HOW_MONEY));
  h += sec('Financial Performance (FY2025 → FY2026)',
    '<table class="ov-table"><thead><tr><th>Metric</th><th>FY2025</th><th>FY2026</th></tr></thead><tbody>'+
    FINANCIALS.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table><div class="ov-callout">'+esc(FIN_NOTE)+'</div>');
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How NVIDIA differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table>');
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>');
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 2 — SEGMENTS
// ════════════════════════════════════════════════════════════════════════════════
// NEW framework — "Revenue by Market Platform" (recast). Source: NVIDIA Q1 FY2027 press
// release / CFO commentary. Only FY2025, FY2026 and Q1 FY2027 were recast (limited history).
// lvl: 0 = platform, 1 = Data Center sub-market. $ in millions.
var SEG_NEW = [
  { name:'Data Center',                            lvl:0, accent:'#1F8A70', fy25:115186, fy26:193737, q1:75246, yoy:'+68%',
    note:'GPUs (Blackwell), Grace CPUs and Mellanox/NVLink networking for AI training & inference — ~90% of revenue.' },
  { name:'Hyperscale',                             lvl:1, accent:'#34a085', fy25:53796,  fy26:105636, q1:37869, yoy:'+96%',
    note:'Public clouds and the world’s largest consumer-internet companies — about half of Data Center.' },
  { name:'ACIE — AI Clouds, Industrial & Enterprise', lvl:1, accent:'#5cc0a6', fy25:61390, fy26:88101, q1:37377, yoy:'+44%',
    note:'Purpose-built AI data centers and "AI factories" across industries, enterprises and sovereigns.' },
  { name:'Edge Computing',                         lvl:0, accent:'#2D6A9F', fy25:15311,  fy26:22201, q1:6369,  yoy:'+45%',
    note:'On-device agentic & physical AI: PCs, game consoles, workstations, AI-RAN base stations, robotics, automotive.' },
];
var SEG_TOTAL_NEW = { fy25:130497, fy26:215938, q1:81615 };

// OLD framework — "Revenue by Market Platform" as reported through the FY2026 10-K.
// [name, FY2024, FY2025, FY2026, FY26 YoY]. $ in millions. OEM FY2026 ≈ residual.
var SEG_OLD = [
  ['Data Center',                 47525, 115186, 193737, '+68%'],
  ['Gaming',                      10447,  11350,  16000, '+41%'],
  ['Professional Visualization',   1553,   1878,   3200, '+70%'],
  ['Automotive & Robotics',        1091,   1694,   2300, '+39%'],
  ['OEM & Other',                   306,    389,    700, '—'],
];
var SEG_TOTAL_OLD = { fy24:60922, fy25:130497, fy26:215938 };

// GAAP reportable (operating) segments — quarterly, from the Q1 FY2027 CFO commentary. $M.
var SEG_GAAP = [
  ['Compute & Networking', 39589, 61651, 74550, '+88%'],
  ['Graphics',              4473,  6476,  7065, '+58%'],
];

// Per-segment milestones.
var SEG_MILESTONES = [
  ['Data Center', ['2016 — DGX-1, first AI supercomputer in a box (hand-delivered to OpenAI)', '2020 — Mellanox acquisition adds InfiniBand/Ethernet networking', '2022 — Hopper H100 launches into the ChatGPT demand wave', '2024 — Blackwell announced', '2025–26 — GB200 / GB300 NVL72 rack-scale systems ramp']],
  ['Edge Computing', ['1999 — GeForce 256, marketed as the first "GPU"', '2018 — RTX brings real-time ray tracing + DLSS AI upscaling', '2021 — Omniverse for industrial digital twins', 'DRIVE (automotive) and Jetson / Isaac (robotics)', 'FY2027 — Gaming, Pro Viz and Auto regrouped into Edge Computing']],
];

// Stacked share bar (no chart dependency). rows: [{name, value, accent}], total.
function mixBar(rows, total){
  var bar = '<div style="display:flex;height:30px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr,#e3e8ee)">'+
    rows.map(function(s){ var p=s.value/total*100;
      return '<div title="'+esc(s.name)+' · '+p.toFixed(1)+'%" style="width:'+p.toFixed(2)+'%;background:'+s.accent+'"></div>';
    }).join('')+'</div>';
  var legend = '<div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px">'+
    rows.map(function(s){ var p=s.value/total*100;
      return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#46505e">'+
        '<span style="width:10px;height:10px;border-radius:2px;background:'+s.accent+'"></span>'+
        esc(s.name)+' · <b>'+p.toFixed(1)+'%</b></span>';
    }).join('')+'</div>';
  return bar+legend;
}

// Quarterly revenue by segment ($M). Actuals 1Q25–1Q27 from NVIDIA's recast "Revenue by
// Market Platform"; 2Q27–4Q29 are Bloomberg (BBG) consensus/forecast estimates by segment.
// FY ends late January, so 1Q25 = quarter ended ~Apr 2024. SEGX_FCST = first forecast index.
var SEGX_LABELS = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27',
                   '2Q27','3Q27','4Q27','1Q28','2Q28','3Q28','4Q28','1Q29','2Q29','3Q29','4Q29'];
var SEGX_FCST = 9;
// New framework: Data Center split into Hyperscale + ACIE, plus Edge Computing.
var SEGX_NEW = {
  hyper: [10690,10622,13390,19094,17599,23883,30340,33814,37869,43420,49204,54428,58761,62901,67654,71984,74148,78379,82801,85914],
  acie:  [11873,15650,17381,16486,21513,17213,20875,28500,37377,41506,46467,51909,57420,61847,67117,73066,73218,76869,81023,86248],
  edge:  [ 3481, 3768, 4311, 3751, 4950, 5647, 5791, 5813, 6369, 6607, 6807, 6938, 7125, 7486, 7766, 7837, 7988, 8584, 8642, 8663],
};
// Old framework: Data Center (single) + Gaming/Pro Viz/Auto/OEM. The pre-FY2026 quarterly
// split of the non-DC segments was never disclosed, so for those quarters we show a single
// "Other (non-Data Center)" block (= total − DC) so the bars still tie to total revenue.
var N = null;
var SEGX_OLD = {
  dc:     [22563,26272,30771,35580,39112,41096,51215,62314,75246,85116,96282,108692,118329,126113,136266,145340,152717,159869,168195,176196],
  gaming: [    N,    N,    N,    N,    N,    N,    N, 3727,    N, 3944, 4102, 4030, 4173, 4350, 4593, 4455, 4751, 4949, 5102, 4776],
  pv:     [    N,    N,    N,    N,    N,    N,    N, 1321,    N, 1495, 1577, 1680, 1745, 1804, 1895, 2013, 1836, 1853, 1958, 2120],
  auto:   [    N,    N,    N,    N,    N,    N,    N,  604,    N,  703,  741,  784,  830,  877,  923,  975, 1108, 1178, 1210, 1233],
  oem:    [    N,    N,    N,    N,    N,    N,    N,  161,    N,  196,  209,  211,  227,  242,  248,  249,  239,  272,  278,  274],
  other:  [ 3481, 3768, 4311, 3751, 4950, 5647, 5791,    N, 6369,    N,    N,    N,    N,    N,    N,    N,    N,    N,    N,    N],
};

// Annual roll-up ($M). FY25/FY26 actual; FY27–FY29 are forecast (FY27 = 1 actual + 3 forecast
// quarters → treated as forecast). Old-framework FY25/FY26 use the clean 10-K annual split;
// FY27 carries a small "Other" = the undisclosed 1Q27 non-Data-Center split.
var SEGA_LABELS = ['FY25','FY26','FY27','FY28','FY29'];
var SEGA_FCST = 2;
var SEGA_NEW = {
  hyper: [53796,105636,184921,261300,321242],
  acie:  [61390, 88101,177259,259450,317358],
  edge:  [15311, 22201, 26721, 30214, 33877],
};
var SEGA_OLD = {
  dc:     [115186,193737,365336,526048,656977],
  gaming: [11350, 16000, 12076, 17571, 19578],
  pv:     [ 1878,  3200,  4752,  7457,  7767],
  auto:   [ 1694,  2300,  2228,  3605,  4729],
  oem:    [  389,   700,   616,   966,  1063],
  other:  [    0,     0,  6369,     0,     0],
};

// Forecast-region plugin: shades the projected periods, draws a dashed divider and labels the
// source, so projections read clearly as estimates rather than reported actuals.
var _segFcst = 9, _segFcstLabel = 'BBG consensus forecast';
var fcstShade = {
  id:'fcstShade',
  beforeDatasetsDraw:function(chart){
    var f = _segFcst; if (f==null || f<=0) return;
    var x=chart.scales.x, a=chart.chartArea, ctx=chart.ctx;
    var bx = (x.getPixelForValue(f-1)+x.getPixelForValue(f))/2;
    ctx.save();
    ctx.fillStyle='rgba(118,130,142,0.09)';
    ctx.fillRect(bx, a.top, a.right-bx, a.bottom-a.top);
    ctx.setLineDash([5,4]); ctx.strokeStyle='rgba(90,100,110,0.6)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(bx,a.top); ctx.lineTo(bx,a.bottom); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#6b7682'; ctx.font='700 10px Inter, sans-serif'; ctx.textAlign='left';
    ctx.fillText('▸ '+_segFcstLabel, bx+6, a.top+12);
    ctx.restore();
  }
};

var _segChart = null, _segMode = 'new', _segGran = 'q', _segSrc = 'bbg';
// Stacked revenue bar with old/new segment, quarterly/annual and forecast-source toggles.
// Data Center sub-markets share a green family so they read as one block; forecast bars are
// translucent and the forecast region is shaded by the fcstShade plugin.
function buildSegChart(){
  var cv = document.getElementById('nvdaSegChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_segChart) { _segChart.destroy(); _segChart = null; }
  var annual = _segGran === 'a';
  var labels = annual ? SEGA_LABELS : SEGX_LABELS;
  var NEW    = annual ? SEGA_NEW    : SEGX_NEW;
  var OLD    = annual ? SEGA_OLD    : SEGX_OLD;
  _segFcst = annual ? SEGA_FCST : SEGX_FCST;
  _segFcstLabel = (_segSrc === 'summit' ? 'Summit' : 'BBG consensus') + ' forecast';
  function toB(a){ return a.map(function(v){ return v==null ? null : +(v/1000).toFixed(2); }); }
  function col(hex){ return labels.map(function(_,i){ return i < _segFcst ? hex : hex+'8c'; }); }
  function ds(label, data, hex){ return { label:label, data:toB(data), backgroundColor:col(hex), stack:'rev', maxBarThickness: annual?64:30 }; }
  var datasets = _segMode === 'old'
    ? [ ds('Data Center', OLD.dc, '#1F8A70'),
        ds('Gaming', OLD.gaming, '#2D6A9F'),
        ds('Professional Visualization', OLD.pv, '#5B53A8'),
        ds('Automotive', OLD.auto, '#C0772C'),
        ds('OEM & Other', OLD.oem, '#B0506A'),
        ds('Other (non-Data Center)', OLD.other, '#9aa6b4') ]
    : [ ds('Data Center — Hyperscale', NEW.hyper, '#1F8A70'),
        ds('Data Center — ACIE', NEW.acie, '#7fd0b8'),
        ds('Edge Computing', NEW.edge, '#2D6A9F') ];
  _segChart = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels: labels, datasets: datasets },
    options:{
      responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:8, color:'#5b6470' } },
        tooltip:{ mode:'index', intersect:false, callbacks:{
          title:function(items){ var i=items[0].dataIndex; return labels[i] + (i<_segFcst?' · actual':' · '+_segFcstLabel.replace(' forecast',' (est.)')); },
          label:function(ctx){ return ctx.parsed.y==null ? null : ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; },
          footer:function(items){ var t=0; items.forEach(function(i){ t+=(i.parsed.y||0); }); return 'Total: $'+t.toFixed(1)+'B'; }
        } }
      },
      scales:{
        y:{ stacked:true, beginAtZero:true, grid:{ color:'rgba(0,0,0,.05)' },
          ticks:{ color:'#8A93A0', font:{size:10}, callback:function(v){ return '$'+v+'B'; } } },
        x:{ stacked:true, grid:{ display:false },
          ticks:{ color:'#8A93A0', font:{size: annual?12:9}, maxRotation:0, autoSkip:false } }
      }
    },
    plugins:[fcstShade]
  });
}

function segmentsBody(){
  var h = '';
  h += '<p class="ov-lede">NVIDIA reports revenue by <b>market platform</b>. In <b>Q1 FY2027</b> (reported May 2026) it overhauled that framework to reflect where growth now comes from — re-cutting Data Center by <b>customer type</b> (Hyperscale vs everyone else) and folding the old Gaming / Pro Viz / Auto platforms into a new <b>Edge Computing</b> platform. Only FY2025–FY2026 were recast.</p>';

  // Stacked revenue bar (hero visual) with segment / view / forecast-source toggles
  h += sec('Revenue by segment ($B)',
    '<div class="nv-seg-bar">'+
      '<span class="nv-seg-lbl">Segments</span>'+
      '<div class="nv-seg-toggle">'+
        '<button type="button" class="nv-seg-btn active" data-segmode="new">New (FY2027+)</button>'+
        '<button type="button" class="nv-seg-btn" data-segmode="old">Old (pre-FY2027)</button>'+
      '</div>'+
      '<span class="nv-seg-lbl">View</span>'+
      '<div class="nv-seg-toggle">'+
        '<button type="button" class="nv-seg-btn active" data-seggran="q">Quarterly</button>'+
        '<button type="button" class="nv-seg-btn" data-seggran="a">Annual</button>'+
      '</div>'+
      '<span class="nv-seg-lbl">Forecast</span>'+
      '<div class="nv-seg-toggle">'+
        '<button type="button" class="nv-seg-btn active" data-segsrc="bbg">BBG consensus</button>'+
        '<button type="button" class="nv-seg-btn" data-segsrc="summit" disabled>Summit · soon</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">NVIDIA revenue by segment <span>(stacked · solid bars = reported · shaded region = forecast)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaSegChart"></canvas></div></div>'+
    '<div class="ov-asof"><b>Shaded region = projections.</b> Actuals are NVIDIA reported results (1Q25–1Q27 / FY25–FY26); the shaded bars to the right are <b>BBG consensus</b> — Bloomberg’s aggregate of sell-side analyst estimates — out to FY2029. A <b>Summit-model</b> view will be added as a second forecast source. <b>New segments:</b> two greens = Data Center sub-markets (Hyperscale + ACIE), blue = Edge Computing. <b>Old segments:</b> Data Center plus the discontinued Gaming / Pro Viz / Auto / OEM split — where the old quarterly split was never disclosed, a grey "Other (non-Data Center)" block keeps the bars tied to total revenue. Fiscal year ends late January (1Q25 = quarter ended ~Apr 2024).</div>');

  // FY2026 mix (new framework)
  h += sec('FY2026 revenue mix (new framework)',
    mixBar([
      { name:'Hyperscale', value:105636, accent:'#34a085' },
      { name:'ACIE',       value:88101,  accent:'#5cc0a6' },
      { name:'Edge Computing', value:22201, accent:'#2D6A9F' },
    ], SEG_TOTAL_NEW.fy26)+
    '<div class="ov-callout" style="margin-top:12px">Data Center is ~<b>90%</b> of revenue, split roughly half <b>Hyperscale</b> (the big clouds) and half <b>ACIE</b> (AI clouds, industrial, enterprise and sovereign). The company that was ~70% Graphics in 2019 is now ~90% Data Center — one of the fastest business-mix shifts in megacap history.</div>');

  // NEW framework table
  h += sec('New framework — revenue by market platform ($B, recast)',
    '<table class="ov-table"><thead><tr><th>Platform</th><th>FY2025</th><th>FY2026</th><th>Q1 FY2027</th><th>FY26 YoY</th></tr></thead><tbody>'+
    SEG_NEW.map(function(s){
      var ind = s.lvl===1 ? ' style="padding-left:26px;font-weight:500;color:#5a6573"' : '';
      return '<tr><td class="ov-td-name"'+ind+'>'+(s.lvl===1?'↳ ':'')+esc(s.name)+'</td><td>'+fmtB(s.fy25)+'</td><td>'+fmtB(s.fy26)+'</td><td>'+fmtB(s.q1)+'</td><td>'+esc(s.yoy)+'</td></tr>';
    }).join('')+
    '<tr style="font-weight:700"><td class="ov-td-name">Total</td><td>'+fmtB(SEG_TOTAL_NEW.fy25)+'</td><td>'+fmtB(SEG_TOTAL_NEW.fy26)+'</td><td>'+fmtB(SEG_TOTAL_NEW.q1)+'</td><td>+65%</td></tr>'+
    '</tbody></table>'+
    '<div class="ov-callout">'+rowsKV(SEG_NEW.map(function(s){return [(s.lvl===1?'↳ ':'')+s.name, s.note];}))+'</div>');

  // OLD framework table
  h += sec('Old framework — as reported through FY2026 ($B)',
    '<table class="ov-table"><thead><tr><th>Segment</th><th>FY2024</th><th>FY2025</th><th>FY2026</th><th>FY26 YoY</th></tr></thead><tbody>'+
    SEG_OLD.map(function(r){
      return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+fmtB(r[1])+'</td><td>'+fmtB(r[2])+'</td><td>'+fmtB(r[3])+'</td><td>'+esc(r[4])+'</td></tr>';
    }).join('')+
    '<tr style="font-weight:700"><td class="ov-td-name">Total</td><td>'+fmtB(SEG_TOTAL_OLD.fy24)+'</td><td>'+fmtB(SEG_TOTAL_OLD.fy25)+'</td><td>'+fmtB(SEG_TOTAL_OLD.fy26)+'</td><td>+65%</td></tr>'+
    '</tbody></table>'+
    '<div class="ov-callout"><b>The bridge:</b> the new <b>Edge Computing</b> platform ($22.2B in FY2026) is essentially the old <b>Gaming + Professional Visualization + Automotive + OEM</b> combined ($16.0B + $3.2B + $2.3B + $0.7B). Data Center is unchanged between the two frameworks — what changed is its <b>Hyperscale / ACIE</b> sub-split. OEM &amp; Other FY2026 is an approximation (residual to total).</div>');

  // GAAP operating segments
  h += sec('GAAP reportable segments (quarterly, $B)',
    '<table class="ov-table"><thead><tr><th>Segment</th><th>Q1 FY26</th><th>Q4 FY26</th><th>Q1 FY27</th><th>YoY</th></tr></thead><tbody>'+
    SEG_GAAP.map(function(r){
      return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+fmtB(r[1])+'</td><td>'+fmtB(r[2])+'</td><td>'+fmtB(r[3])+'</td><td>'+esc(r[4])+'</td></tr>';
    }).join('')+
    '</tbody></table>'+
    '<div class="ov-asof">In its financial statements NVIDIA reports two <b>GAAP operating segments</b> — <b>Compute &amp; Networking</b> (data-center GPUs, networking, Grace, automotive, robotics, embedded) and <b>Graphics</b> (GeForce, Pro Viz, vGPU). This is a different cut from the market-platform view above. Source: Q1 FY2027 CFO commentary.</div>');

  // Latest print & guidance
  h += sec('Latest print & guidance (Q1 FY2027)',
    '<div class="ov-targets">'+
      '<div class="ov-target"><div class="ov-target-v">$81.6B</div><div class="ov-target-l">Q1 FY27 revenue</div><div class="ov-target-s">+85% YoY · beat the $78.0B guide</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$75.2B</div><div class="ov-target-l">Data Center</div><div class="ov-target-s">+92% YoY</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$14.8B</div><div class="ov-target-l">DC Networking</div><div class="ov-target-s">+199% YoY (prior sub-market)</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$91.0B</div><div class="ov-target-l">Q2 FY27 guide</div><div class="ov-target-s">±2% · no China DC compute assumed</div></div>'+
    '</div>'+
    '<div class="ov-callout">Q1 FY2027 (ended April 26, 2026): record revenue with GAAP gross margin back to 74.9% (the prior year’s 60.5% carried the $4.5B H20 charge). GAAP net income was $58.3B (+211%), but that includes a one-time <b>$15.9B gain on equity securities</b> — operating income (+147% to $53.5B) is the cleaner read. <b>No Data Center Hopper shipments to China</b> occurred in the quarter (vs $4.6B a year earlier). NVIDIA raised its dividend from $0.01 to $0.25 and added $80B to buybacks. Networking (NVLink, Spectrum-X, InfiniBand) is the fastest-growing line — see the Industry Analysis tab.</div>');

  // Milestones
  h += sec('Milestones by segment', SEG_MILESTONES.map(function(m){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(m[0])+'</div><div class="ov-row-v">'+bullets(m[1])+'</div></div>';
  }).join(''));

  h += '<div class="ov-foot">Sources: NVIDIA FY2024–FY2026 press releases / 10-K and the Q1 FY2027 press release & CFO commentary (recast "Revenue by Market Platform" and "Revenue by Reportable Segments" tables; quarter ended April 26, 2026). Segment figures are NVIDIA reported actuals; OEM &amp; Other FY2026 is an approximation derived as the residual to total revenue. All figures split-adjusted.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 3 — TECHNOLOGY  (work in progress)
// ════════════════════════════════════════════════════════════════════════════════
// CPU vs GPU contrast cards.
var CPU_GPU = [
  ['CPU — the brain', '#6B7A8F', 'A few powerful cores built for <b>general-purpose, sequential (linear) processing</b>. It runs the operating system and logic step by step — versatile, but it does one hard thing at a time.'],
  ['GPU — the accelerator', '#1F8A70', 'Thousands of smaller cores built for <b>parallel processing</b> — many simple calculations at once. The matrix math behind graphics and AI is massively parallel, which is exactly what a GPU is built for.'],
];
// What NVIDIA sells — the full stack, silicon up to software.
var TECH_STACK = [
  ['Software & ecosystem', '#1F8A70', 'CUDA, cuDNN, TensorRT, AI Enterprise, NIM microservices and Omniverse — the platform developers build on. This is the moat.'],
  ['Systems', '#2E9E78', 'DGX / HGX servers and GB200 / GB300 NVL72 rack-scale "AI factories" — NVIDIA increasingly sells the whole rack, not just the chip.'],
  ['Networking', '#3A7CA5', 'NVLink, InfiniBand and Spectrum-X Ethernet (from the Mellanox acquisition) — moving data between thousands of GPUs as if they were one.'],
  ['Processors', '#5B53A8', 'The GPU (Blackwell), the Grace CPU and the BlueField DPU — designed together to work as one system.'],
  ['Silicon', '#6B7A8F', 'Chips designed by NVIDIA, manufactured by TSMC, with HBM memory from SK hynix / Micron and advanced (CoWoS) packaging.'],
];
// Architecture & product timeline.
var TECH_TIMELINE = [
  ['1999', 'Ships the <b>GeForce 256</b>, marketed as the world’s first "GPU".'],
  ['2006', 'Launches <b>CUDA</b> — opening the GPU to general-purpose computing. The foundation of today’s software moat.'],
  ['2014', 'Introduces <b>NVLink</b>, a high-speed interconnect to link GPUs; the crypto-mining surge starts shifting GPUs from graphics to raw compute.'],
  ['2016', '<b>Pascal</b> + the <b>DGX-1</b>, the first "AI supercomputer in a box" — hand-delivered to OpenAI.'],
  ['2017', '<b>Volta</b> adds <b>Tensor Cores</b>, dedicated hardware for the matrix math of deep learning.'],
  ['2020', '<b>Ampere</b> (A100) and the <b>Mellanox</b> acquisition, adding the data-center networking stack.'],
  ['2021', 'Announces the <b>Omniverse</b> platform for industrial digital twins and simulation.'],
  ['2022', '<b>Hopper</b> (H100) launches into the ChatGPT demand wave — the workhorse of the AI build-out.'],
  ['2024', '<b>Blackwell</b> (B200 / GB200); NVIDIA executes a 10-for-1 split and briefly becomes the world’s most valuable company.'],
  ['2025–26', '<b>GB200 / GB300 NVL72</b> rack-scale systems ramp; <b>Rubin</b> is the next platform on the annual cadence.'],
];

// ── Animated visuals (native CSS/SVG/Chart.js — no external assets) ──────────────
// Moore's Law datapoints:
// [year, transistors, name, era('i'=CPU/Intel,'n'=NVIDIA GPU), process_nm, AI_TFLOPS_FP16(illustrative)].
var MOORE = [
  [1971, 2300, 'Intel 4004', 'i', 10000, null], [1978, 29000, 'Intel 8086', 'i', 3000, null],
  [1985, 275000, 'Intel 386', 'i', 1500, null], [1989, 1180000, 'Intel 486', 'i', 1000, null],
  [1993, 3100000, 'Intel Pentium', 'i', 800, null], [2000, 42000000, 'Pentium 4', 'i', 180, null],
  [2006, 291000000, 'Intel Core 2 Duo', 'i', 65, null], [2008, 1400000000, 'NVIDIA GT200', 'n', 65, null],
  [2012, 7100000000, 'NVIDIA Kepler GK110', 'n', 28, null], [2016, 15300000000, 'NVIDIA Pascal GP100', 'n', 16, 21],
  [2017, 21100000000, 'NVIDIA Volta GV100', 'n', 12, 125], [2020, 54200000000, 'NVIDIA Ampere GA100', 'n', 7, 312],
  [2022, 80000000000, 'NVIDIA Hopper H100', 'n', 4, 990], [2024, 208000000000, 'NVIDIA Blackwell B200', 'n', 4, 2250],
];
// Flagship data-center GPU transistor counts (billions) by architecture.
var GPU_GENS = [['Pascal · 2016','GP100',15.3], ['Volta · 2017','GV100',21.1],
  ['Ampere · 2020','GA100',54.2], ['Hopper · 2022','GH100',80], ['Blackwell · 2024','GB200',208]];
// Transistor-shrink steps: [process node, year reached, transistor label, grid dimension].
var TR_STEPS = [['90 nm','2004','~50M transistors',7], ['45 nm','2008','~250M transistors',10],
  ['28 nm','2011','~1.5B transistors',13], ['16 nm','2015','~8B transistors',17], ['7 nm','2018','~20B transistors',22],
  ['4 nm','2022','~80B transistors',28], ['3 nm','2023','~150B+ transistors',34]];

function cgGridCells(){ var h=''; for(var i=0;i<64;i++) h+='<span class="cg-cell"></span>'; return h; }
function cpuGpuDemo(){
  return '<div class="cg-demo">'+
    '<div class="cg-head"><button type="button" class="cg-run" id="cgRun">▶ Run again</button>'+
      '<span class="cg-cap">Both render the same 64-pixel image — watch <b>how</b> each does it.</span></div>'+
    '<div class="cg-panels">'+
      '<div class="cg-panel"><div class="cg-title">CPU · a few cores, <b>one pixel at a time</b></div>'+
        '<div class="cg-grid" id="cgCpu">'+cgGridCells()+'</div><div class="cg-stat" id="cgCpuStat">sequential</div></div>'+
      '<div class="cg-panel"><div class="cg-title">GPU · thousands of cores, <b>all at once</b></div>'+
        '<div class="cg-grid" id="cgGpu">'+cgGridCells()+'</div><div class="cg-stat" id="cgGpuStat">parallel</div></div>'+
    '</div></div>';
}
function mooreCard(){
  return '<div class="ov-chart-card"><div class="ov-chart-t">Transistors, process node &amp; AI compute · 1971–2024 '+
    '<span>(log scales · green = transistors/chip, orange = process node nm, blue = AI TFLOPS)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaMooreChart"></canvas></div>'+
    '<div class="ov-asof" style="margin-top:10px">As the <b>process node shrinks</b> (orange, falling) more transistors fit per chip (green, rising) and <b>AI compute explodes</b> (blue) — Hopper and Blackwell deliver thousands of FP16 TFLOPS. AI TFLOPS are FP16 tensor figures, illustrative; the CPUs of the 1970s–2000s predate this metric.</div></div>';
}
function transistorShrink(){
  return '<div class="tr-shrink"><div class="tr-die" id="trDie"></div>'+
    '<div class="tr-meta"><div class="tr-nodeline"><span class="tr-node" id="trNode">—</span>'+
    '<span class="tr-year" id="trYear"></span></div>'+
    '<span class="tr-count" id="trCount"></span>'+
    '<span class="tr-hint">Smaller process node → more transistors, smaller and closer together. The year marks roughly when each node reached volume production. The dots are an illustration, not to scale.</span></div></div>';
}
function gpuGenBars(){
  var max=208;
  return '<div class="gen-bars" id="genBars">'+GPU_GENS.map(function(g){
    return '<div class="gen-row"><div class="gen-name">'+esc(g[0])+'</div>'+
      '<div class="gen-track"><div class="gen-fill" style="--w:'+(g[2]/max*100).toFixed(1)+'%"></div></div>'+
      '<div class="gen-val">'+g[2]+'B</div></div>';
  }).join('')+'</div>'+
  '<div class="ov-asof">Bars = transistors per flagship data-center GPU (billions). Architectural advances (Tensor Cores, FP8/FP4 precision) multiplied real AI throughput even faster than transistor count. Blackwell B200 packs 208B across two dies joined as one.</div>';
}
// Interactive pseudo-3D "what NVIDIA sells" stack. Slabs are stacked silicon→software in an
// isometric scene; toggles highlight one layer and show its detail (+ a slot for product photos).
function sellsMap(){
  var layers = TECH_STACK.slice().reverse(); // bottom→top: Silicon → … → Software
  var slabs = layers.map(function(l,i){
    return '<div class="nv3d-slab" data-layer="'+i+'" style="--lvl:'+i+';background:'+l[1]+'"><span>'+esc(l[0])+'</span></div>';
  }).join('');
  var btns = '<button type="button" class="nv-seg-btn active" data-layer="-1">Full stack</button>'+
    layers.map(function(l,i){ return '<button type="button" class="nv-seg-btn" data-layer="'+i+'">'+esc(l[0])+'</button>'; }).join('');
  return '<div class="nv3d">'+
    '<div class="nv3d-toggles" id="nv3dToggles">'+btns+'</div>'+
    '<div class="nv3d-main">'+
      '<div class="nv3d-stage"><div class="nv3d-scene" id="nv3dScene">'+slabs+'</div></div>'+
      '<div class="nv3d-panel" id="nv3dPanel"></div>'+
    '</div></div>';
}

function technologyBody(){
  var h = '';
  h += '<p class="ov-lede">At its core, NVIDIA sells <b>computing power</b>. This tab walks through the basic logic — from the transistor up to the full AI system — and why NVIDIA’s approach wins. It draws on the Summit team’s 2024 semiconductor case-study deck and public materials.</p>';

  // 1 — The basic logic: transistors & computing power
  h += sec('The basic logic: transistors = computing power',
    '<div class="ov-callout">A chip is built from <b>transistors</b> — tiny switches that flip between 0 and 1. Computing power comes from <b>how many you can pack into a given area</b>: shrink the transistors, fit more of them closer together, and you get more performance using less energy. Every generation of progress is, at bottom, "more transistors, smaller and closer."</div>'+
    transistorShrink()+
    bullets([
      'A modern GPU contains <b>tens of billions</b> of transistors.',
      'Beyond the transistors, a chip also carries <b>memory (HBM/RAM), cache and I/O controllers</b> — and increasingly several chips are packaged together (advanced packaging) to act as one.',
      'The whole industry — covered in the <b>Industry Analysis</b> tab — exists to keep shrinking and packaging transistors.',
    ]));

  // 2 — Moore's Law
  h += sec('Moore’s Law — and why it matters now',
    '<div class="ov-callout"><b>Moore’s Law</b> (Gordon Moore, 1965): the number of transistors on a chip roughly <b>doubles about every two years</b>. For decades that delivered exponential gains in compute at falling cost — the engine behind modern computing.</div>'+
    bullets([
      'Moore’s Law is <b>slowing</b>: at a few nanometers, physics makes each shrink harder, slower and more expensive.',
      'NVIDIA’s answer is <b>accelerated computing</b>: instead of relying on the CPU getting faster, offload the heavy, parallel work to the GPU — picking up where Moore’s Law leaves off.',
      'This is why <b>parallel processing, advanced packaging and full systems</b> — not just smaller transistors — now drive performance.',
    ])+
    mooreCard());

  // 3 — CPU vs GPU
  h += sec('CPU vs GPU — serial vs parallel',
    cpuGpuDemo()+
    '<div class="ov-grid2">'+CPU_GPU.map(function(c){
      return '<div class="ov-callout" style="border-left:4px solid '+c[1]+'"><div class="ov-sec-h" style="margin:0 0 6px">'+esc(c[0])+'</div>'+c[2]+'</div>';
    }).join('')+'</div>'+
    '<div class="ov-asof">AI is built on massive parallel math, so the <b>GPU</b> — not the CPU — became the engine of the AI era. NVIDIA pairs both in products like the <b>Grace Hopper Superchip</b> (Grace CPU + Hopper GPU joined by NVLink).</div>');

  // 4 — What NVIDIA sells (interactive 3D stack)
  h += sec('What NVIDIA sells — the full stack',
    '<p class="ov-p">NVIDIA is often described as "a chip company", but it sells a <b>full computing stack</b> — from the silicon up to the software. Owning every layer is what lets it deliver performance rivals can’t match with a chip alone, and it is where the durable margin lives. <b>Tap a layer</b> to explore it.</p>'+
    sellsMap());

  // 5 — CUDA moat
  h += sec('CUDA — the software moat',
    '<div class="ov-callout"><b>CUDA</b> (2006) lets developers program the GPU directly. Twenty years later, essentially every AI framework, library and model is written and optimized for NVIDIA first — so developers build where the install base is, and the install base grows because that’s where the software is. That self-reinforcing loop, more than any single chip, is NVIDIA’s deepest moat and the source of its switching costs.</div>');

  // 6 — Architecture & product timeline
  h += sec('Architecture & product timeline', '<div class="ov-timeline">'+TECH_TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 6b — Generation-over-generation growth
  h += sec('Generation over generation', gpuGenBars());

  // 7 — The AI data-center stack
  h += sec('Putting it together: the AI data center',
    '<p class="ov-p">An AI "factory" is far more than GPUs. NVIDIA’s rack-scale systems combine <b>compute</b> (GPUs + Grace CPUs), <b>networking</b> (NVLink / InfiniBand / Spectrum-X), <b>servers</b> and <b>storage</b> into one tightly-integrated machine — sold as a unit (e.g. the GB200 NVL72 connects 72 GPUs to act as a single giant GPU). The value is in the <b>system</b>, not just the die.</p>'+
    '<div class="ov-asof">Adjacent platforms extend the same compute engine into new markets: <b>Omniverse</b> (industrial digital twins & simulation), <b>Isaac</b> (robotics) and <b>DRIVE</b> (automotive).</div>');

  h += '<div class="ov-foot">Sources: Summit research team 2024 semiconductor case-study deck (internal), plus NVIDIA public materials and technical documentation. Simplified for explanation; transistor counts and dates are approximate.</div>';
  return h;
}

// ── Technology-tab animation drivers ─────────────────────────────────────────────
var _cgTimers = [], _trTimer = null, _mooreChart = null;
function fmtTr(v){
  if (v>=1e9) return +(v/1e9).toFixed(v<1e10?1:0)+'B';
  if (v>=1e6) return Math.round(v/1e6)+'M';
  if (v>=1e3) return Math.round(v/1e3)+'K';
  return Math.round(v);
}
function cgCells(id){ var el=document.getElementById(id); return el ? Array.prototype.slice.call(el.querySelectorAll('.cg-cell')) : []; }
function cgRun(){
  _cgTimers.forEach(clearTimeout); _cgTimers=[];
  var cpu=cgCells('cgCpu'), gpu=cgCells('cgGpu');
  cpu.concat(gpu).forEach(function(c){ c.classList.remove('on'); });
  var setS=function(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; };
  setS('cgCpuStat','rendering… one pixel at a time'); setS('cgGpuStat','rendering…');
  cpu.forEach(function(c,i){ _cgTimers.push(setTimeout(function(){ c.classList.add('on'); }, 26*i)); });
  gpu.forEach(function(c,i){ _cgTimers.push(setTimeout(function(){ c.classList.add('on'); }, 3*(i%8)+30)); });
  _cgTimers.push(setTimeout(function(){ setS('cgGpuStat','done — 64 pixels in parallel ⚡'); }, 130));
  _cgTimers.push(setTimeout(function(){ setS('cgCpuStat','done — 64 sequential steps'); }, 26*64+120));
}
function initCpuGpu(){
  var btn=document.getElementById('cgRun'); if(!btn) return;
  if(!btn._w){ btn._w=1; btn.onclick=cgRun; }
  cgRun();
}
function initTransistor(){
  var die=document.getElementById('trDie'); if(!die) return;
  if(_trTimer){ clearInterval(_trTimer); _trTimer=null; }
  var i=0;
  function step(){
    var s=TR_STEPS[i % TR_STEPS.length], cols=s[3], n=cols*cols, g='';
    for(var k=0;k<n;k++) g+='<span class="tr-dot"></span>';
    die.style.gridTemplateColumns='repeat('+cols+',1fr)';
    die.innerHTML=g;
    var node=document.getElementById('trNode'), yr=document.getElementById('trYear'), cnt=document.getElementById('trCount');
    if(node) node.textContent=s[0]; if(yr) yr.textContent='≈ '+s[1]; if(cnt) cnt.textContent=s[2];
    i++;
  }
  step(); _trTimer=setInterval(step, 1900);
}
function initGenBars(){
  var el=document.getElementById('genBars'); if(!el) return;
  el.classList.remove('go');
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('go'); }); });
}
function buildMooreChart(){
  var cv=document.getElementById('nvdaMooreChart');
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  if(_mooreChart){ _mooreChart.destroy(); _mooreChart=null; }
  var tr=MOORE.map(function(d){ return { x:d[0], y:d[1], name:d[2], era:d[3] }; });
  var nm=MOORE.filter(function(d){ return d[4]!=null; }).map(function(d){ return { x:d[0], y:d[4], name:d[2] }; });
  var fl=MOORE.filter(function(d){ return d[5]!=null; }).map(function(d){ return { x:d[0], y:d[5], name:d[2] }; });
  var P={ parsing:{xAxisKey:'x',yAxisKey:'y'}, tension:0.12, pointBorderColor:'#fff', pointBorderWidth:1 };
  _mooreChart=new Chart(cv.getContext('2d'), {
    data:{ datasets:[
      Object.assign({ type:'line', label:'Transistors / chip', data:tr, yAxisID:'y',
        borderColor:'rgba(118,185,0,0.55)', borderWidth:2, pointRadius:4, pointHoverRadius:7,
        pointBackgroundColor:tr.map(function(p){ return p.era==='n' ? '#76B900' : '#9aa6b4'; }) }, P),
      Object.assign({ type:'line', label:'Process node (nm)', data:nm, yAxisID:'yNm',
        borderColor:'#C0772C', borderWidth:2, borderDash:[5,3], pointRadius:3, pointHoverRadius:6,
        pointBackgroundColor:'#C0772C' }, P),
      Object.assign({ type:'line', label:'AI compute (FP16 TFLOPS)', data:fl, yAxisID:'yFl',
        borderColor:'#2D6A9F', borderWidth:2, pointRadius:4, pointHoverRadius:7,
        pointBackgroundColor:'#2D6A9F' }, P),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:{ duration:1500, easing:'easeOutCubic' },
      interaction:{ mode:'nearest', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:10, color:'#5b6470' } },
        tooltip:{ callbacks:{
          title:function(it){ return it[0].raw.name+' ('+it[0].raw.x+')'; },
          label:function(ctx){ var v=ctx.raw.y, id=ctx.dataset.yAxisID;
            if(id==='yNm') return 'Process node: '+v+' nm';
            if(id==='yFl') return 'AI compute: '+(v>=1000?(v/1000).toFixed(2)+' PFLOPS':v+' TFLOPS')+' (FP16)';
            return 'Transistors: '+fmtTr(v); } } } },
      scales:{
        x:{ type:'linear', min:1970, max:2026, grid:{ display:false },
          ticks:{ color:'#8A93A0', font:{size:10}, stepSize:10, callback:function(v){ return v; } } },
        y:{ type:'logarithmic', position:'left', grid:{ color:'rgba(0,0,0,.05)' },
          title:{ display:true, text:'Transistors / chip', color:'#5a9e16', font:{size:10,weight:'600'} },
          ticks:{ color:'#8A93A0', font:{size:9}, callback:function(v){ return fmtTr(v); } } },
        yNm:{ type:'logarithmic', position:'right', grid:{ drawOnChartArea:false }, reverse:false,
          title:{ display:true, text:'Process node (nm)', color:'#C0772C', font:{size:10,weight:'600'} },
          ticks:{ color:'#C0772C', font:{size:9}, callback:function(v){ return v+'nm'; } } },
        yFl:{ type:'logarithmic', position:'right', grid:{ drawOnChartArea:false },
          title:{ display:true, text:'AI TFLOPS', color:'#2D6A9F', font:{size:10,weight:'600'} },
          ticks:{ color:'#2D6A9F', font:{size:9}, callback:function(v){ return v>=1000?(v/1000)+'P':v; } } }
      }
    }
  });
}
function initSellsMap(){
  var scene=document.getElementById('nv3dScene'), panel=document.getElementById('nv3dPanel'), tog=document.getElementById('nv3dToggles');
  if(!scene || !panel) return;
  var layers=TECH_STACK.slice().reverse();
  var slabs=Array.prototype.slice.call(scene.querySelectorAll('.nv3d-slab'));
  function layout(sel){
    slabs.forEach(function(s,i){
      var z=i*30; if(sel>=0 && i===sel) z+=46;
      s.style.transform='translateZ('+z+'px)';
      s.style.opacity = (sel>=0 && i!==sel) ? 0.28 : 0.96;
      s.classList.toggle('sel', sel>=0 && i===sel);
    });
    if(sel<0){
      panel.innerHTML='<div class="nv3d-p-h">The full stack</div>'+
        '<div class="nv3d-p-d">NVIDIA sells every layer from the <b>silicon</b> up to the <b>software</b> — that vertical integration is what rivals can’t match with a chip alone, and where the durable margin lives.</div>'+
        '<div class="nv3d-img">Product photos — coming in a later pass</div>';
    } else {
      var l=layers[sel];
      panel.innerHTML='<div class="nv3d-p-h" style="color:'+l[1]+'">'+esc(l[0])+'</div>'+
        '<div class="nv3d-p-d">'+l[2]+'</div>'+
        '<div class="nv3d-img" style="border-color:'+l[1]+'">Product photo — coming in a later pass</div>';
    }
  }
  if(tog && !tog._w){ tog._w=1;
    tog.querySelectorAll('.nv-seg-btn').forEach(function(b){
      b.onclick=function(){
        tog.querySelectorAll('.nv-seg-btn').forEach(function(x){ x.classList.toggle('active', x===b); });
        layout(parseInt(b.getAttribute('data-layer'),10));
      };
    });
  }
  layout(-1);
}
function initTech(){
  requestAnimationFrame(function(){ initCpuGpu(); buildMooreChart(); initTransistor(); initGenBars(); initSellsMap(); });
}
function stopTech(){
  if(_trTimer){ clearInterval(_trTimer); _trTimer=null; }
  _cgTimers.forEach(clearTimeout); _cgTimers=[];
}

// ════════════════════════════════════════════════════════════════════════════════
// 4 — MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════
var LEADERSHIP = [
  ['Jensen Huang', 'Co-founder, President & CEO (since 1993) — set NVIDIA’s bet on accelerated computing and CUDA long before the AI wave, and remains the company’s strategic and public face.'],
  ['Colette Kress', 'Executive Vice President & CFO (since 2013) — leads finance, capital allocation and investor relations through NVIDIA’s scale-up to a $200B+ revenue company.'],
];
function managementBody(){
  var h = sec('Leadership', rowsKV(LEADERSHIP));
  h += '<div class="ov-callout">More to come: founder-led culture and tenure, the broader executive bench, board, insider ownership and recent insider activity (the portal’s Pillars tab already syncs management &amp; insider data from Fiscal.ai). Capital return is now material — NVIDIA raised its dividend 25× (to $0.25/qtr) and added $80B to buybacks in Q1 FY2027.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 5 — CONSENSUS  (work in progress)
// ════════════════════════════════════════════════════════════════════════════════
function consensusBody(){
  return wipNote({
    lead: 'NVIDIA has out-run Street estimates almost every quarter since the AI cycle began in FY2023 — revenue and EPS have been repeatedly revised up and still beaten (e.g. Q1 FY2027 guided $78.0B → delivered $81.6B). This tab will make that pattern visual.',
    items: [
      'A chart of <b>consensus revenue/EPS estimate vs actual</b> by quarter since FY2023, with the beat clearly marked.',
      'How the <b>full-year estimate was revised upward</b> over time as each quarter printed.',
      'The <b>guidance-vs-actual</b> track record (NVIDIA guides one quarter ahead and has repeatedly exceeded it).',
      'Magnitude of beats over time — are they shrinking as the base grows?',
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// 6 — VALUATION
// ════════════════════════════════════════════════════════════════════════════════
// Summit's INTERNAL DCF model projections (not guidance). Summit Financial Data, synced 2026-06-04.
var DCF_TARGETS = [
  { v:'$215.9B', l:'FY2026 revenue',     s:'Actual — matched the model.' },
  { v:'$390.3B', l:'FY2027E revenue',    s:'Summit DCF model · +81% YoY.' },
  { v:'$566.7B', l:'FY2028E revenue',    s:'Summit DCF model · +45% YoY.' },
  { v:'~$310B',  l:'FY2028E net income', s:'Summit DCF model.' },
];
function valuationBody(){
  var h = '';
  h += '<p class="ov-lede">Two lenses: NVIDIA’s reported results against the multiples the market is paying, and the Summit team’s own DCF model for the forward path. Multiples and a fuller DCF write-up are still to be added.</p>';
  h += sec('Forward view — Summit DCF model',
    '<div class="ov-targets">'+DCF_TARGETS.map(function(b){
      return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-callout">These are the Summit team’s internal DCF projections (Summit Financial Data, synced June 2026), shown to frame the forward view — an in-house estimate, not NVIDIA guidance or consensus, reflecting a very aggressive AI-demand scenario. Note FY2026 actual ($215.9B) landed in line with the model, and Q1 FY2027 printed $81.6B (above the $78.0B guide), with Q2 guided to $91.0B.</div>');
  h += sec('Still to add', bullets([
    'Trading multiples — P/E, EV/Sales, EV/EBITDA — current vs historical range.',
    'PEG and growth-adjusted valuation given the FY2027–28 trajectory.',
    'A walk-through of the Summit DCF assumptions (growth, margins, discount rate, terminal value).',
    'Scenario / sensitivity table (bull / base / bear).',
  ]));
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 7 — INDUSTRY ANALYSIS  (shared map, pre-drilled to NVIDIA)
// ════════════════════════════════════════════════════════════════════════════════
function industryBody(){
  return '<div class="ov-sec-h" style="margin-bottom:10px">Semiconductor Supply-Chain Map</div>'+
    // focus:true → the Flow view opens pre-drilled to NVIDIA's place in the chain.
    // Drop the focus flag (or call with no opts) to get the standalone, industry-wide map.
    semiIndustry.html({ highlight: 'NVDA', focus: true });
}

// ─── Tab registry + shell ───────────────────────────────────────────────────────
var TABS = [
  { key:'overview',   label:'Overview',          body:overviewBody },
  { key:'segments',   label:'Segments',          body:segmentsBody },
  { key:'technology', label:'Technology',        body:technologyBody },
  { key:'management', label:'Management',         body:managementBody },
  { key:'consensus',  label:'Consensus',         body:consensusBody },
  { key:'valuation',  label:'Valuation',         body:valuationBody },
  { key:'industry',   label:'Industry Analysis', body:industryBody },
];

function html(){
  var h = '<div class="ov ov-nvda" data-brand="NVDA">';
  h += '<div class="ovt-tabs">'+TABS.map(function(t,i){
    return '<button type="button" class="ovt-tab'+(i===0?' active':'')+'" data-ovt="'+t.key+'">'+esc(t.label)+'</button>';
  }).join('')+'</div>';
  h += TABS.map(function(t,i){
    return '<div class="ovt-pane" data-ovt="'+t.key+'"'+(i===0?'':' hidden')+'>'+t.body()+'</div>';
  }).join('');
  h += '</div>';
  return h;
}

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key !== 'technology') stopTech();
  if (key === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
  if (key === 'segments') requestAnimationFrame(function(){ buildSegChart(); });
  if (key === 'technology') initTech();
}

function init(){
  var root = document.querySelector('.ov-nvda');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  // Segments tab: segment / view / forecast-source toggles on the revenue chart.
  // Each .nv-seg-toggle is its own group; active state and state var are scoped to the group.
  root.querySelectorAll('.nv-seg-toggle').forEach(function(grp){
    grp.querySelectorAll('.nv-seg-btn').forEach(function(btn){
      if (btn.disabled) return;
      btn.onclick = function(){
        grp.querySelectorAll('.nv-seg-btn').forEach(function(x){ x.classList.toggle('active', x===btn); });
        if (btn.hasAttribute('data-segmode')) _segMode = btn.getAttribute('data-segmode');
        if (btn.hasAttribute('data-seggran')) _segGran = btn.getAttribute('data-seggran');
        if (btn.hasAttribute('data-segsrc'))  _segSrc  = btn.getAttribute('data-segsrc');
        buildSegChart();
      };
    });
  });
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

export var nvidiaOverview = { html: html, init: init };
