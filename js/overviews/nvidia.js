// overviews/nvidia.js — custom Overview for NVIDIA Corporation (Nasdaq: NVDA)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Two sub-tabs (same pattern as SoFi): Overview + Industry Analysis.
//   • Overview  — the company profile (snapshot, KPIs, segments, financials, history,
//                 peers, tailwinds/headwinds, the Summit DCF forward view, leadership).
//   • Industry Analysis — embeds the shared, interactive semiconductor supply-chain map
//                 (js/overviews/semi-*.js), opened pre-drilled to NVIDIA via focus:true.
//
// Figures: NVIDIA reports in US dollars on a fiscal year ending the last Sunday in
// January (FY2025 ended Jan 26, 2025). ACTUALS below are NVIDIA's reported results
// (FY2024 Form 10-K, FY2025 Form 10-K). The forward "Summit DCF model" figures are the
// Summit team's own internal projections (Summit Financial Data, last synced 2026-06-04)
// and are NOT company guidance — they are labeled as such throughout.

import { semiIndustry } from './semi-industry.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ──────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'Nasdaq: NVDA'],
  ['HQ', 'Santa Clara, CA'],
  ['Founded', '1993'],
  ['Model', 'Fabless chip designer'],
  ['Fiscal year', 'Ends late January'],
  ['Founder, President & CEO', 'Jensen Huang'],
];

var DESC = 'NVIDIA is a fabless designer of accelerated-computing platforms — and the company at the center of the AI build-out. It designs the GPUs, CPUs and full rack-scale systems that train and run modern AI, then outsources manufacturing to TSMC, sources HBM memory from SK hynix, and assembles systems through partners such as Foxconn. Its durable advantage is not just the chip but the full stack on top of it: the CUDA software platform and a two-decade developer ecosystem, plus a complete data-center networking stack (NVLink, InfiniBand, Spectrum) acquired via Mellanox. Because the semiconductor industry is not vertically integrated, NVIDIA sits inside a deep web of suppliers and partners — mapped in the Industry Analysis tab.';

// Headline KPIs — FY2025 (year ended Jan 26, 2025), NVIDIA reported actuals.
var KPIS = [
  { l:'Revenue (FY2025)',     v:'$130.5B', d:'+114% YoY',                    dir:'up' },
  { l:'Data Center revenue',  v:'$115.2B', d:'~88% of revenue · +142% YoY',  dir:'up' },
  { l:'GAAP net income',      v:'$72.9B',  d:'+145% YoY',                     dir:'up' },
  { l:'GAAP gross margin',    v:'75.0%',   d:'Up from 72.7% in FY2024',       dir:'up' },
];
var AS_OF = 'Figures are in US dollars. NVIDIA’s fiscal year ends the last Sunday in January — FY2025 ended January 26, 2025. Headline KPIs and the financial table are NVIDIA reported actuals (FY2024 / FY2025 Form 10-K). "Summit DCF model" figures further down are the Summit team’s internal projections, not company guidance.';
var FY_NOTE = 'FY2025 was a step-change year: revenue more than doubled to $130.5B as the Blackwell ramp followed Hopper, Data Center became ~88% of the business, GAAP net income reached $72.9B and the company generated ~$60.7B of free cash flow. NVIDIA executed a 10-for-1 stock split in June 2024; all per-share figures are split-adjusted.';

var HOW_MONEY = [
  'NVIDIA sells <b>accelerated-computing platforms</b>, not just chips: GPUs, Grace CPUs, DPUs, NVLink/InfiniBand networking, reference systems (DGX, HGX, GB200 NVL72) and the software that runs them.',
  'The vast majority of revenue is <b>Data Center</b> — selling AI training and inference compute to hyperscalers, cloud providers, enterprises and sovereign-AI buyers.',
  'The moat is <b>CUDA</b>: a ~20-year software platform and developer ecosystem that makes NVIDIA GPUs the default target for AI frameworks, creating high switching costs.',
  'NVIDIA is <b>fabless</b> — it captures the design and platform margin while <b>TSMC</b> manufactures the silicon, <b>SK hynix / Micron / Samsung</b> supply HBM, and <b>Foxconn</b> and others assemble systems.',
  'An <b>annual product cadence</b> (Hopper → Blackwell → Rubin) keeps performance-per-watt ahead of rivals and pulls customers through repeated upgrade cycles.',
  'Increasingly, value accrues to <b>full systems and networking</b> (rack-scale NVL72, Spectrum-X Ethernet), not just the GPU die — raising content per deployment.',
];

// Reportable segments — FY2025 revenue (NVIDIA reported actuals).
var SEGMENTS = [
  ['Data Center — $115.2B (+142%)', 'GPUs (Hopper H100/H200, Blackwell B200/GB200), Grace CPUs, NVLink and Mellanox networking sold to hyperscalers, clouds, enterprises and sovereign-AI projects. ~88% of total revenue and the engine of the company.'],
  ['Gaming — $11.4B (+9%)', 'GeForce RTX GPUs for PC gaming plus the Nintendo Switch SoC legacy. NVIDIA’s original market; now a minority of revenue but still a strong, profitable franchise.'],
  ['Professional Visualization — $1.9B (+21%)', 'RTX / workstation GPUs for design, simulation, content creation and the Omniverse industrial-digital-twin platform.'],
  ['Automotive & Robotics — $1.7B (+55%)', 'DRIVE platform for autonomous vehicles and the Jetson / Isaac robotics stack — small today but a fast-growing, design-win-driven pipeline.'],
  ['OEM & Other — ~$0.4B', 'Entry-level and OEM products plus licensing — the residual category.'],
];

// Financial performance — FY2024 vs FY2025 (NVIDIA reported actuals).
var FINANCIALS = [
  ['Revenue',              '$60.9B',  '$130.5B (+114%)'],
  ['Data Center revenue',  '$47.5B',  '$115.2B (+142%)'],
  ['GAAP gross margin',    '72.7%',   '75.0%'],
  ['GAAP operating income','$33.0B',  '$81.5B (+147%)'],
  ['GAAP net income',      '$29.8B',  '$72.9B (+145%)'],
  ['Diluted EPS (GAAP)',   '$1.19',   '$2.94'],
  ['Cash from operations', '$28.1B',  '$64.1B'],
  ['Free cash flow',       '$27.0B',  '~$60.7B'],
];
var FIN_NOTE = 'All figures are split-adjusted for the June 2024 10-for-1 split. Growth was driven almost entirely by Data Center as customers moved from Hopper to Blackwell; gross margin expanded even as the product mix shifted, reflecting pricing power and the value of the full platform. Source: NVIDIA FY2024 / FY2025 Form 10-K.';

// The CUDA / full-stack flywheel.
var ENGINE = [
  'Every NVIDIA GPU runs <b>CUDA</b>, so AI frameworks, libraries and models are written and optimized for NVIDIA first — developers build where the install base is.',
  'A larger developer ecosystem makes NVIDIA hardware <b>more valuable</b>, which sells more GPUs, which grows the install base further — a classic platform flywheel with high switching costs.',
  'NVIDIA reinvests its lead into an <b>annual cadence</b> (Hopper → Blackwell → Rubin) and into <b>adjacent layers</b> — Grace CPUs, NVLink, Mellanox/Spectrum networking, full racks and software (AI Enterprise, NIM).',
  'Owning more of the stack raises <b>content per deployment</b> and deepens lock-in: customers increasingly buy NVIDIA <b>systems and networks</b>, not just chips.',
];

var TIMELINE = [
  ['1993', 'Founded by <b>Jensen Huang</b>, Chris Malachowsky and Curtis Priem to bring 3D graphics to PCs.'],
  ['1999', 'IPOs on Nasdaq and ships the <b>GeForce 256</b>, marketed as the world’s first "GPU".'],
  ['2006', 'Launches <b>CUDA</b>, opening the GPU to general-purpose computing — the foundation of today’s moat.'],
  ['2016', 'Ships <b>DGX-1</b> and the Pascal/Volta data-center GPUs as deep learning takes off; Jensen hand-delivers the first DGX-1 to OpenAI.'],
  ['2020', 'Acquires <b>Mellanox</b> ($7B), adding InfiniBand/Ethernet networking — the basis of rack-scale AI systems.'],
  ['2022', 'Launches the <b>Hopper</b> H100; the ChatGPT moment ignites unprecedented AI-infrastructure demand.'],
  ['2024', '<b>Blackwell</b> announced; NVIDIA executes a <b>10-for-1 split</b> and briefly becomes the world’s most valuable company.'],
  ['FY2025', 'Revenue <b>$130.5B (+114%)</b>, Data Center ~88% of sales; Blackwell ramps as the next platform.'],
];

var PEERS = [
  ['AMD', 'Instinct MI300/MI350 accelerators and EPYC CPUs — the #2 merchant GPU for AI, manufactured by TSMC.', 'NVIDIA leads on the full stack — CUDA software, NVLink and networking — not just raw silicon, and ships a broader rack-scale system.'],
  ['Custom ASICs (Broadcom · Marvell)', 'Hyperscaler in-house chips — Google TPU, AWS Trainium/Inferentia, Microsoft Maia — designed with Broadcom/Marvell IP.', 'These target a customer’s own workloads; NVIDIA offers a general-purpose, programmable platform with a far larger software ecosystem.'],
  ['Intel', 'Gaudi AI accelerators plus a foundry ambition; NVIDIA invested $5B in Intel (2025).', 'NVIDIA is generations ahead in AI performance and ecosystem; Intel is more relevant as a potential manufacturing partner than a head-to-head rival.'],
  ['Hyperscalers (as customers & competitors)', 'Microsoft, Google, Amazon and Meta are NVIDIA’s largest customers — and also build their own silicon.', 'Customer concentration is a real risk, but in-house chips have so far complemented rather than replaced NVIDIA’s general-purpose GPUs.'],
];

var TAILWINDS = [
  'A multi-year <b>AI infrastructure super-cycle</b> — hyperscaler capex keeps rising and broadening to enterprises and sovereign-AI buyers.',
  'The <b>CUDA software moat</b> and a ~20-year developer ecosystem create high switching costs and default-platform status.',
  '<b>Full-stack expansion</b> — Grace CPUs, NVLink, Mellanox/Spectrum networking, rack-scale systems and software — raises content per deployment.',
  'An <b>annual product cadence</b> (Hopper → Blackwell → Rubin) compounds a performance-per-watt lead rivals struggle to match.',
  'Shift from training toward <b>inference</b> and "agentic" AI expands the addressable compute base over time.',
  '<b>Sovereign AI</b> and regulated industries add a new, geographically diverse demand pool.',
];

var HEADWINDS = [
  '<b>Customer concentration</b>: a handful of hyperscalers drive a large share of revenue — and are designing their own custom silicon.',
  '<b>China export controls</b>: U.S. restrictions limit sales of advanced GPUs (e.g. H20) into a large market.',
  '<b>AI-capex cyclicality</b>: any pause or "digestion" in hyperscaler spending would hit NVIDIA hard given how concentrated demand is.',
  '<b>Supply-chain dependence</b>: reliant on a single leading-edge foundry (TSMC), TSMC CoWoS advanced packaging, and HBM from a few memory makers.',
  '<b>Competition</b> from AMD and from increasingly capable custom ASICs (TPU, Trainium, Maia).',
  '<b>High expectations</b>: valuation and consensus already embed very strong growth, leaving little room for disappointment.',
];

// Strategic forward view — Summit's INTERNAL DCF model projections (not guidance).
// Source: Summit Financial Data, NVDA model, last synced 2026-06-04. FY = Jan year-end.
var TARGETS = [
  { v:'$215.9B', l:'FY2026E revenue',      s:'Summit DCF model · +65% vs FY2025.' },
  { v:'$189.3B', l:'FY2026E Data Center',  s:'Summit DCF model · ~88% of revenue.' },
  { v:'$390.3B', l:'FY2027E revenue',      s:'Summit DCF model · +81% YoY.' },
  { v:'$566.7B', l:'FY2028E revenue',      s:'Summit DCF model · ~$310B net income.' },
];
var TARGETS_NOTE = 'These are the Summit team’s own internal DCF model projections (Summit Financial Data, last synced June 2026), shown to frame the forward view. They are an in-house estimate, not NVIDIA guidance or consensus, and reflect a very aggressive AI-demand scenario.';

var DRIVERS = [
  ['Blackwell & Rubin ramp', 'Convert the annual cadence into sustained Data Center revenue growth and a performance lead.'],
  ['Inference & agentic AI', 'Grow the installed base of inference compute as deployed AI applications scale beyond training.'],
  ['Networking & systems', 'Sell more rack-scale systems and NVLink / Spectrum-X networking to raise content per deployment.'],
  ['Software & platforms', 'Monetize AI Enterprise, NIM microservices and Omniverse to add recurring, higher-margin revenue.'],
  ['Sovereign & enterprise AI', 'Expand beyond hyperscalers into governments and regulated enterprises building their own AI.'],
];

var LEADERSHIP = [
  ['Jensen Huang', 'Co-founder, President & CEO (since 1993) — set NVIDIA’s bet on accelerated computing and CUDA long before the AI wave, and remains the company’s strategic and public face.'],
  ['Colette Kress', 'Executive Vice President & CFO (since 2013) — leads finance, capital allocation and investor relations through NVIDIA’s scale-up to a $100B+ revenue company.'],
];

var SOURCES = 'Sources: NVIDIA Corporation (Nasdaq: NVDA) FY2024 and FY2025 Annual Reports on Form 10-K (fiscal years ended January 28, 2024 and January 26, 2025) and related investor materials. Forward "Summit DCF model" figures are the Summit team’s internal projections from Summit Financial Data (NVDA model, last synced June 4, 2026) and are not company guidance or consensus. All figures in US dollars and split-adjusted for the June 2024 10-for-1 split. Peer descriptions summarize public information.';

// ─── Render helpers (shared overview.css classes) ──────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rowsKV(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }

// ─── Overview sub-tab body ──────────────────────────────────────────────────────
function overviewBody(c){
  var h = '';

  // 1 — Snapshot + lede
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';

  // 2 — KPI tiles + notes
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';

  // 3 — How NVIDIA makes money
  h += sec('How NVIDIA Makes Money', bullets(HOW_MONEY));

  // 4 — Segments
  h += sec('Reportable Segments (FY2025)', rowsKV(SEGMENTS));

  // 5 — Financial performance (FY2024 → FY2025)
  h += sec('Financial Performance (FY2024 → FY2025)',
    '<table class="ov-table"><thead><tr><th>Metric</th><th>FY2024</th><th>FY2025</th></tr></thead><tbody>'+
    FINANCIALS.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>'+
    '<div class="ov-callout">'+esc(FIN_NOTE)+'</div>'
  );

  // 6 — The CUDA / full-stack flywheel
  h += sec('The CUDA & Full-Stack Flywheel', '<div class="ov-callout">'+bullets(ENGINE)+'</div>');

  // 7 — Timeline
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 8 — Peers
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How NVIDIA differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table>'
  );

  // 9 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 10 — Strategic focus: Summit DCF forward view + growth drivers
  function statBox(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }
  h += sec('Strategic Focus',
    '<div class="ov-subh">Forward view — Summit DCF model</div>'+
    '<div class="ov-targets">'+TARGETS.map(statBox).join('')+'</div>'+
    '<div class="ov-callout">'+esc(TARGETS_NOTE)+'</div>'+
    '<div class="ov-subh">Growth Drivers</div>'+
    '<div class="ov-drivers">'+DRIVERS.map(function(d){
      return '<div class="ov-driver"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div></div>';
    }).join('')+'</div>'
  );

  // 11 — Leadership
  h += sec('Leadership', rowsKV(LEADERSHIP));

  // 12 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  return h;
}

// ─── Industry Analysis sub-tab — the shared map, pre-drilled to NVIDIA ──────────
function industryBody(c){
  return '<div class="ov-sec-h" style="margin-bottom:10px">Semiconductor Supply-Chain Map</div>'+
    // focus:true → the Flow view opens pre-drilled to NVIDIA's place in the chain.
    // Drop the focus flag (or call with no opts) to get the standalone, industry-wide map.
    semiIndustry.html({ highlight: 'NVDA', focus: true });
}

function html(c){
  var h = '<div class="ov ov-nvda" data-brand="NVDA">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="industry">Industry Analysis</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="industry" hidden>'+industryBody(c)+'</div>';
  h += '</div>';
  return h;
}

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

function init(c){
  var root = document.querySelector('.ov-nvda');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  // If Industry Analysis is the active tab on load, build the map.
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

export var nvidiaOverview = { html: html, init: init };
