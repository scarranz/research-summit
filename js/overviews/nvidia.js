// overviews/nvidia.js — custom Overview for NVIDIA Corporation (Nasdaq: NVDA)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Multi-tab profile. Each tab is a self-contained body function; the tab bar and
// switching are generic so tabs can be added/reordered freely. Tabs:
//   1 Overview   — executive summary (snapshot, KPIs, how it makes money, financials,
//                  peers, tailwinds/headwinds).
//   2 Segments   — old vs new reporting framework, revenue by segment, guidance and
//                  per-segment milestones. NVIDIA overhauled its segments in Q1 FY2027.
//   3 Technology — what NVIDIA sells (GPUs, CUDA, Omniverse, networking) + product timeline. [WIP]
//   4 Management — leadership.
//   5 Consensus  — how NVIDIA has beaten consensus every quarter/year since FY2023. [WIP]
//   6 Valuation  — multiples + the Summit DCF forward view.
//   7 Industry Analysis — the shared semiconductor supply-chain map, pre-drilled to NVDA.
//
// Figures: NVIDIA reports in US dollars on a fiscal year ending the last Sunday in
// January (FY2026 ended Jan 25, 2026). ACTUALS are NVIDIA reported results (FY2024–FY2026
// 10-K / press releases). "Summit DCF model" figures (Valuation tab) are the Summit team's
// own internal projections (Summit Financial Data, synced Jun 2026) — NOT company guidance.

import { semiIndustry } from './semi-industry.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtB(m){ return '$'+(m/1000).toFixed(m>=100000?0:1)+'B'; }   // $M → "$xxB"

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
var AS_OF = 'Figures are in US dollars. NVIDIA’s fiscal year ends the last Sunday in January — FY2026 ended January 25, 2026. Headline KPIs and the financial table are NVIDIA reported actuals (FY2025 / FY2026 press releases & 10-K). "Summit DCF model" figures in the Valuation tab are the Summit team’s internal projections, not company guidance.';
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
var FIN_NOTE = 'All figures split-adjusted (June 2024 10-for-1 split). Full-year GAAP gross margin fell to 71.1% largely because of a ~$4.5B Q1 FY2026 H20 inventory/China charge; Q4 FY2026 gross margin recovered to 75.0%. Source: NVIDIA FY2025 / FY2026 press releases & 10-K.';

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

var SOURCES = 'Sources: NVIDIA Corporation (Nasdaq: NVDA) FY2024–FY2026 press releases and Annual Reports on Form 10-K, and the Q1 FY2027 press release (quarter ended April 26, 2026). Forward "Summit DCF model" figures are the Summit team’s internal projections (Summit Financial Data, NVDA model, synced June 4, 2026) — not company guidance or consensus. All figures in US dollars and split-adjusted for the June 2024 10-for-1 split. Peer descriptions summarize public information.';

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
// Old market-platform segments — full-year revenue ($M), NVIDIA reported actuals.
var SEG_OLD = [
  { name:'Data Center',                 accent:'#1F8A70', fy24:47525, fy25:115186, fy26:193700, yoy:'+68%',
    note:'GPUs (Hopper, Blackwell), Grace CPUs and Mellanox/NVLink networking for AI training & inference — the engine of the company.' },
  { name:'Gaming',                      accent:'#2D6A9F', fy24:10447, fy25:11350,  fy26:16000,  yoy:'+41%',
    note:'GeForce RTX GPUs for PC gaming plus the Nintendo Switch SoC legacy.' },
  { name:'Professional Visualization',  accent:'#5B53A8', fy24:1553,  fy25:1878,   fy26:3200,   yoy:'+70%',
    note:'RTX / workstation GPUs for design, simulation and the Omniverse platform.' },
  { name:'Automotive & Robotics',       accent:'#C0772C', fy24:1091,  fy25:1694,   fy26:2300,   yoy:'+39%',
    note:'DRIVE autonomous-vehicle platform and the Jetson / Isaac robotics stack (renamed "Automotive & Robotics" in FY2026).' },
  { name:'OEM & Other',                 accent:'#7A8B5A', fy24:306,   fy25:389,    fy26:700,    yoy:'—',
    note:'Entry-level / OEM products and licensing — the residual category (FY2026 approximate).' },
];
var SEG_TOTAL = { fy24:60922, fy25:130497, fy26:215938 };

var SEG_NEW = [
  ['Data Center', 'The two-platform framework keeps Data Center as the core, now split into two sub-markets: <b>Hyperscale</b> — the public clouds and largest consumer-internet companies — and <b>ACIE (AI Clouds, Industrial & Enterprise)</b> — purpose-built AI data centers and "AI factories" across industries and countries.'],
  ['Edge Computing', 'A new platform that gathers the data-processing devices for <b>agentic and physical AI</b>: PCs, game consoles, workstations, AI-RAN base stations, robotics and automotive. This absorbs much of what used to be reported as Gaming, Professional Visualization and Automotive.'],
];

// Per-segment milestones.
var SEG_MILESTONES = [
  ['Data Center', ['2016 — DGX-1, the first AI supercomputer in a box (hand-delivered to OpenAI)', '2020 — Mellanox acquisition adds InfiniBand/Ethernet networking', '2022 — Hopper H100 launches into the ChatGPT demand wave', '2024 — Blackwell announced', '2025 — GB200 NVL72 rack-scale systems ramp']],
  ['Gaming', ['1999 — GeForce 256, marketed as the first "GPU"', '2018 — RTX brings real-time ray tracing + DLSS AI upscaling', 'Ongoing — Nintendo Switch SoC franchise']],
  ['Professional Visualization', ['Quadro / RTX workstation GPUs for pros', '2021 — Omniverse launched for industrial digital twins & simulation']],
  ['Automotive & Robotics', ['DRIVE platform for autonomous vehicles', 'Jetson / Isaac robotics stack', 'FY2026 — segment renamed to foreground robotics']],
];

// FY2026 revenue-mix stacked bar (share of total), no chart dependency.
function mixBar(){
  var total = SEG_TOTAL.fy26;
  var segs = SEG_OLD.map(function(s){ return { name:s.name, accent:s.accent, pct:(s.fy26/total*100) }; });
  var bar = '<div style="display:flex;height:30px;border-radius:8px;overflow:hidden;border:1px solid var(--line,#e3e8ee)">'+
    segs.map(function(s){
      return '<div title="'+esc(s.name)+' · '+s.pct.toFixed(1)+'%" style="width:'+s.pct.toFixed(2)+'%;background:'+s.accent+'"></div>';
    }).join('')+'</div>';
  var legend = '<div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px">'+
    segs.map(function(s){
      return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#46505e">'+
        '<span style="width:10px;height:10px;border-radius:2px;background:'+s.accent+'"></span>'+
        esc(s.name)+' · <b>'+s.pct.toFixed(1)+'%</b></span>';
    }).join('')+'</div>';
  return bar+legend;
}

function segmentsBody(){
  var h = '';
  h += '<p class="ov-lede">NVIDIA reports revenue by <b>market platform</b>. In <b>Q1 FY2027</b> (reported May 2026) it overhauled that framework to reflect where growth now comes from — collapsing the old consumer/pro/auto platforms and re-cutting Data Center by customer type. Below: the old framework with full-year actuals, the new framework, what changed, and per-segment milestones.</p>';

  // FY2026 mix
  h += sec('FY2026 revenue mix', mixBar()+
    '<div class="ov-callout" style="margin-top:12px">Data Center is ~<b>90%</b> of revenue. The company that was ~70% Graphics in 2019 is now ~90% Data Center — one of the fastest business-mix shifts in megacap history.</div>');

  // Old framework table
  h += sec('Old framework — revenue by segment ($B, full year)',
    '<table class="ov-table"><thead><tr><th>Segment</th><th>FY2024</th><th>FY2025</th><th>FY2026</th><th>FY26 YoY</th></tr></thead><tbody>'+
    SEG_OLD.map(function(s){
      return '<tr><td class="ov-td-name">'+esc(s.name)+'</td><td>'+fmtB(s.fy24)+'</td><td>'+fmtB(s.fy25)+'</td><td>'+fmtB(s.fy26)+'</td><td>'+esc(s.yoy)+'</td></tr>';
    }).join('')+
    '<tr style="font-weight:700"><td class="ov-td-name">Total</td><td>'+fmtB(SEG_TOTAL.fy24)+'</td><td>'+fmtB(SEG_TOTAL.fy25)+'</td><td>'+fmtB(SEG_TOTAL.fy26)+'</td><td>+65%</td></tr>'+
    '</tbody></table>'+
    '<div class="ov-callout">'+rowsKV(SEG_OLD.map(function(s){return [s.name, s.note];}))+'</div>'+
    '<div class="ov-asof">Note: in its 10-K, NVIDIA also reports two <b>GAAP operating segments</b> — <b>Compute &amp; Networking</b> and <b>Graphics</b>. The market-platform view above (Data Center, Gaming, …) is the revenue disaggregation investors usually track.</div>');

  // New framework
  h += sec('New framework — from Q1 FY2027',
    SEG_NEW.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join('')+
    '<div class="ov-callout"><b>Why it changed:</b> the old split (Gaming / Pro Viz / Auto / OEM) no longer described the business once Data Center reached ~90% of revenue. The new view separates Data Center demand by <b>customer type</b> (hyperscalers vs everyone else building AI) and groups the on-device products under <b>Edge Computing</b> — aligning the P&L with the AI strategy. NVIDIA provided only <b>limited restated history</b> under the new framework, so old- and new-framework figures don’t map one-to-one.</div>');

  // Guidance / latest print
  h += sec('Latest print & guidance (Q1 FY2027)',
    '<div class="ov-targets">'+
      '<div class="ov-target"><div class="ov-target-v">$81.6B</div><div class="ov-target-l">Q1 FY2027 revenue</div><div class="ov-target-s">+85% YoY · guidance was $78.0B → beat</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$75.2B</div><div class="ov-target-l">Data Center</div><div class="ov-target-s">+92% YoY</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$60.4B</div><div class="ov-target-l">DC Compute</div><div class="ov-target-s">+77% YoY (old sub-market)</div></div>'+
      '<div class="ov-target"><div class="ov-target-v">$14.8B</div><div class="ov-target-l">DC Networking</div><div class="ov-target-s">+199% YoY (old sub-market)</div></div>'+
    '</div>'+
    '<div class="ov-asof">Q1 FY2027 ended April 26, 2026. Networking is the fastest-growing line as NVLink fabric, Spectrum-X Ethernet and InfiniBand ship with GB200/GB300 systems.</div>');

  // Milestones
  h += sec('Milestones by segment', SEG_MILESTONES.map(function(m){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(m[0])+'</div><div class="ov-row-v">'+bullets(m[1])+'</div></div>';
  }).join(''));

  h += '<div class="ov-foot">Sources: NVIDIA FY2024–FY2026 press releases / 10-K and the Q1 FY2027 press release (quarter ended April 26, 2026). Segment figures are NVIDIA reported actuals; OEM &amp; Other FY2026 is an approximation derived as the residual to total revenue. All figures split-adjusted.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 3 — TECHNOLOGY  (work in progress)
// ════════════════════════════════════════════════════════════════════════════════
function technologyBody(){
  return wipNote({
    lead: 'A clear walk-through of what NVIDIA actually sells and why it wins — the products and the software, with a timeline of when each was created and where it came from.',
    items: [
      '<b>GPUs</b> — the architecture lineage (Pascal → Volta → Ampere → Hopper → Blackwell → Rubin) and what each generation changed.',
      '<b>CUDA & software</b> — the platform moat: CUDA, cuDNN, the AI Enterprise / NIM stack and why developers build NVIDIA-first.',
      '<b>Networking</b> — NVLink, InfiniBand and Spectrum-X (from the Mellanox acquisition) and how rack-scale systems are assembled.',
      '<b>Omniverse & systems</b> — DGX/HGX/GB200, Omniverse digital twins, Grace CPUs and DPUs.',
      'A <b>product timeline</b> showing when each product launched and which acquisition or technology it grew out of.',
    ],
  });
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
  h += '<div class="ov-callout">More to come: founder-led culture and tenure, the broader executive bench, board, insider ownership and recent insider activity (the portal’s Pillars tab already syncs management & insider data from Fiscal.ai).</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 5 — CONSENSUS  (work in progress)
// ════════════════════════════════════════════════════════════════════════════════
function consensusBody(){
  return wipNote({
    lead: 'NVIDIA has out-run Street estimates almost every quarter since the AI cycle began in FY2023 — revenue and EPS have been repeatedly revised up and still beaten. This tab will make that pattern visual.',
    items: [
      'A chart of <b>consensus revenue/EPS estimate vs actual</b> by quarter since FY2023, with the beat clearly marked.',
      'How the <b>full-year estimate was revised upward</b> over time as each quarter printed.',
      'The <b>guidance-vs-actual</b> track record (e.g. Q1 FY2027 guided $78.0B → delivered $81.6B).',
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
    '<div class="ov-callout">These are the Summit team’s internal DCF projections (Summit Financial Data, synced June 2026), shown to frame the forward view — an in-house estimate, not NVIDIA guidance or consensus, reflecting a very aggressive AI-demand scenario. Note FY2026 actual ($215.9B) landed in line with the model, and Q1 FY2027 printed $81.6B (above the $78.0B guide).</div>');
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
  if (key === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

function init(){
  var root = document.querySelector('.ov-nvda');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

export var nvidiaOverview = { html: html, init: init };
