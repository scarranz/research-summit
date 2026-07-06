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
//   5 Consensus  — guidance-vs-actual beat track record (13 straight beats) + forward consensus.
//   6 Valuation  — interactive forward multiples on consensus + the Summit DCF forward view.
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
  ['Model', 'Fabless chip designer'],
  ['HQ', 'Santa Clara, CA'],
  ['Founded', '1993'],
  ['Fiscal year', 'Ends late January'],
  ['Last reported quarter', 'Q1 FY2027 · Apr 26, 2026'],
  ['CEO', 'Jensen Huang'],
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
  'An <b>annual product cadence</b> (Hopper → Blackwell → <b>Vera Rubin</b>, ramping in 2026) keeps performance-per-watt ahead of rivals and pulls customers through repeated upgrade cycles.',
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
  'An <b>annual product cadence</b> (Hopper → Blackwell → <b>Vera Rubin</b>, ramping in 2026) compounds a performance-per-watt lead rivals struggle to match.',
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

// ── Layered-reveal overview (progressive disclosure) ─────────────────────────────
// The tab opens minimal — snapshot, one positioning line, KPIs and ONE signature
// hero — then a chip selector reveals a single topic at a time, each built from
// drill-down cards that expand on tap. Reusable pattern (.ovlr-*): another company
// just refills POSITION / the hero mix / ovTopics() and keeps the render + init.

var POSITION = 'The company at the center of the AI build-out — it designs the chips, systems and software that train and run modern AI, and captures the platform margin while others manufacture.';

// Signature hero — the revenue mix "then vs now". Data Center is anchored left (green)
// so its growth reads left-to-right; the blue (consumer/graphics → edge) collapses.
// $M. FY2019 (10-K): Gaming 6,246 / Data Center 2,932 / ProViz+Auto+OEM 2,538 = 11,716.
var MIX_THEN = { year:'FY2019', total:11716, rows:[
  { name:'Data Center', v:2932, c:'#1F8A70', lab:'25%' },
  { name:'Gaming',      v:6246, c:'#2D6A9F', lab:'53%' },
  { name:'Pro Viz / Auto / OEM', v:2538, c:'#9aa6b4', lab:'' },
]};
var MIX_NOW = { year:'FY2026', total:215938, rows:[
  { name:'Data Center', v:193737, c:'#1F8A70', lab:'~90%' },
  { name:'Edge Computing', v:22201, c:'#2D6A9F', lab:'' },
]};
var MIX_LEGEND = [
  ['Data Center', '#1F8A70'],
  ['Gaming → Edge (consumer & physical AI)', '#2D6A9F'],
  ['Pro Viz / Auto / OEM', '#9aa6b4'],
];

// One stacked bar of the hero (segment widths animate in via the .go class).
function heroBar(m){
  var segs = m.rows.map(function(r){
    var p = r.v / m.total * 100;
    var lab = r.lab ? '<span>'+esc(r.lab)+'</span>' : '';
    return '<span class="ovlr-mix-seg" style="--p:'+p.toFixed(2)+'%;background:'+r.c+'" title="'+esc(r.name)+' · '+p.toFixed(0)+'%">'+lab+'</span>';
  }).join('');
  return '<div class="ovlr-mix-row"><div class="ovlr-mix-yr">'+esc(m.year)+'</div><div class="ovlr-mix-track">'+segs+'</div></div>';
}
// Compact big-dollar formatter for live values ($ → $x.xxT / $xxxB / $xxxM).
function fmtBig(v){ if(v==null) return '—'; if(v>=1e12) return '$'+(v/1e12).toFixed(2)+'T'; if(v>=1e9) return '$'+(v/1e9).toFixed(0)+'B'; return '$'+(v/1e6).toFixed(0)+'M'; }

// The mix-shift story now lives as a supporting visual inside "How it makes money".
function mixShiftBlock(){
  return '<div class="ovlr-mixshift">'+
    '<div class="ovlr-mixshift-t">From a graphics company to the engine of AI</div>'+
    '<div class="ovlr-hero-bars">'+heroBar(MIX_THEN)+heroBar(MIX_NOW)+'</div>'+
    '<div class="ovlr-legend">'+MIX_LEGEND.map(function(l){ return '<span><i style="background:'+l[1]+'"></i>'+esc(l[0])+'</span>'; }).join('')+'</div>'+
    '<p class="ov-p" style="margin:12px 0 0"><b>Data Center went from 25% to ~90% of revenue in seven years</b> — Gaming, once the majority of sales, is now a small slice of a company ~18× larger.</p>'+
  '</div>';
}

// ── Universal hero, part 1: a market Scorecard ───────────────────────────────────
// The investor’s instant read: size, scale, profitability and valuation. Fundamentals
// are reported actuals; price / market cap / P/E fill live from liveQuote() and degrade
// gracefully with no session. Replicable — another company just refills SCORE_TILES.
var SCORE_TILES = [
  { l:'Market cap',       v:'<span class="ovlr-mut">—</span>', id:'nvScoreMcap' },
  { l:'Revenue (TTM)',    v:'$215.9B', s:'+65% YoY' },
  { l:'Operating margin', v:'60%',     s:'GAAP' },
  { l:'Net margin',       v:'56%',     s:'GAAP' },
  { l:'P/E (TTM)',        v:'<span class="ovlr-mut">—</span>', id:'nvScorePE', s:'GAAP EPS $4.90' },
];
function heroScorecard(){
  return '<div class="ovlr-score">'+
    '<div class="ovlr-score-live">'+
      '<span class="ov-live-dot"></span>'+
      '<span class="ov-live-tk">NVDA · NASDAQ</span>'+
      '<span class="ov-live-px" id="nvScorePx">$—</span>'+
      '<span class="ov-live-ch" id="nvScoreCh"></span>'+
      '<span class="ov-live-ts" id="nvScoreTs">fetching live price…</span>'+
    '</div>'+
    '<div class="ovlr-score-grid">'+SCORE_TILES.map(function(t){
      return '<div class="ovlr-score-tile">'+
        '<div class="ovlr-score-l">'+esc(t.l)+'</div>'+
        '<div class="ovlr-score-v"'+(t.id?' id="'+t.id+'"':'')+'>'+t.v+'</div>'+
        (t.s?'<div class="ovlr-score-s">'+esc(t.s)+'</div>':'')+
      '</div>';
    }).join('')+'</div>'+
  '</div>';
}

// ── Universal hero, part 2: a Business snapshot ──────────────────────────────────
// Four quadrants that explain any business at a glance. Replicable — refill BIZ.
var BIZ = [
  ['What it sells', 'AI-compute <b>platforms</b> — GPUs, full systems and the CUDA software that trains and runs modern AI.'],
  ['Who buys it',   'Hyperscalers, cloud providers, enterprises and <b>sovereign-AI</b> buyers.'],
  ['How it earns',  '<b>~90% Data Center</b> — selling AI training &amp; inference compute; the rest is Edge (gaming, pro-viz, auto, robotics).'],
  ['The edge',      'CUDA’s <b>20-year software lock-in</b> plus the full networking &amp; systems stack — not just the chip.'],
];
function heroBusiness(){
  return '<div class="ovlr-biz">'+BIZ.map(function(b){
    return '<div class="ovlr-biz-cell"><div class="ovlr-biz-k">'+esc(b[0])+'</div><div class="ovlr-biz-v">'+b[1]+'</div></div>';
  }).join('')+'</div>';
}

// ── Universal hero, part 3: Products — put a face to what the company sells ───────
// Same slot for every company, different photos + copy. Images live in img/products/
// (onerror hides a card if a photo is missing). Replicable — refill PRODUCTS.
var PRODUCTS = [
  { img:'nvda-gb300-nvl72.jpg', tag:'Rack-scale AI system', name:'GB300 NVL72',
    d:'72 Blackwell GPUs wired to act as one giant GPU — an “AI factory” in a single rack.',
    detail:'NVIDIA’s flagship “AI factory” in one rack. It links 72 Blackwell Ultra GPUs and 36 Grace CPUs over a 5th-generation NVLink fabric so they share memory and bandwidth as if they were a single enormous accelerator. Liquid-cooled and drawing well over 100 kW, one NVL72 delivers the training and inference throughput that used to need a room full of servers. Increasingly this — the whole machine, not the chip — is what NVIDIA actually sells.' },
  { img:'nvda-superchip.jpg', tag:'GPU + CPU module', name:'Grace Blackwell Superchip',
    d:'The GPU and Grace CPU fused by NVLink into one accelerated-computing module.',
    detail:'Two Blackwell GPUs joined to an NVIDIA Grace CPU over a 900 GB/s NVLink-C2C link, packaged as a single module. Pairing NVIDIA’s own Arm-based CPU with the GPUs removes the traditional CPU–GPU bottleneck and keeps the accelerators fed with data at memory-coherent speed. It is the building block the NVL72 racks are assembled from.' },
  { img:'nvda-networking.jpg', tag:'Networking', name:'NVLink · Spectrum-X',
    d:'The fabric (NVLink, InfiniBand, Spectrum-X) that links thousands of GPUs into one machine.',
    detail:'The part of NVIDIA most people overlook. NVLink connects GPUs inside a rack; InfiniBand and Spectrum-X Ethernet connect racks into clusters of tens of thousands of GPUs. Most of this stack arrived with the 2020 Mellanox acquisition, and it is what lets a whole data center behave as one computer — now one of NVIDIA’s fastest-growing revenue lines.' },
  { img:'nvda-dies.jpg', tag:'The chip', name:'Blackwell silicon',
    d:'The GPU die itself — designed by NVIDIA, built by TSMC with HBM memory.',
    detail:'The GPU itself. A Blackwell package places two reticle-sized dies (~104B transistors each) side by side, joined by a 10 TB/s link so they behave as one chip, surrounded by stacks of HBM high-bandwidth memory. NVIDIA designs it, TSMC manufactures it on a custom 4nm process, and the memory comes from SK hynix / Micron — the “fabless” model in a single image.' },
];
function heroProducts(){
  return '<div class="ovlr-prod">'+
    '<div class="ovlr-prod-h">What they make — the products, up close <span class="ovlr-prod-hint">tap a product to enlarge</span></div>'+
    '<div class="ovlr-prod-row">'+PRODUCTS.map(function(p,i){
      return '<figure class="ovlr-prod-card ovlr-clickable" data-prod="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.name)+' — enlarge">'+
        '<div class="ovlr-prod-imgwrap"><img class="ovlr-prod-img" src="img/products/'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.display=\'none\'"><span class="ovlr-prod-zoom">⤢</span></div>'+
        '<figcaption class="ovlr-prod-body">'+
          '<div class="ovlr-prod-tag">'+esc(p.tag)+'</div>'+
          '<div class="ovlr-prod-name">'+esc(p.name)+'</div>'+
          '<div class="ovlr-prod-d">'+esc(p.d)+'</div>'+
        '</figcaption>'+
      '</figure>';
    }).join('')+'</div>'+
    '<div class="ovlr-prod-note">Product imagery © NVIDIA newsroom, shown for illustration.</div>'+
    '<div class="ovlr-modal" id="nvProdModal" hidden>'+
      '<div class="ovlr-modal-box" role="dialog" aria-modal="true">'+
        '<button type="button" class="ovlr-modal-x" id="nvProdX" aria-label="Close">×</button>'+
        '<img class="ovlr-modal-img" id="nvProdImg" src="" alt="">'+
        '<div class="ovlr-modal-body">'+
          '<div class="ovlr-modal-tag" id="nvProdTag"></div>'+
          '<div class="ovlr-modal-name" id="nvProdName"></div>'+
          '<div class="ovlr-modal-d" id="nvProdDesc"></div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

// Topic model for the chip selector. Each topic renders an optional intro + custom
// visual, then either drill-down cards (title · stat · expandable body) or raw html.
// ── Universal hero, part 4: The differentiator ───────────────────────────────────
// One non-obvious insight that carries the thesis — the thing not everyone knows.
// Visually accented so it stands out. Replicable: refill DIFF (for NVIDIA it is the
// CUDA software ecosystem and its self-reinforcing flywheel).
var DIFF = {
  eyebrow: 'The differentiator — the thing most people miss',
  head: 'NVIDIA doesn’t just sell chips — it owns the software the entire AI industry is built on.',
  body: 'In 2006 NVIDIA launched <b>CUDA</b>, the platform that lets developers program the GPU directly. Twenty years later, essentially every AI framework, library and model is written and optimized for NVIDIA <b>first</b>. A rival can match a chip on a spec sheet — but not two decades of software, tooling and a developer base in the millions. The chip is replaceable; the ecosystem is not.',
  flyLabel: 'The CUDA flywheel — why the lead compounds',
  flywheel: [
    'More developers build on CUDA',
    'More AI software & models run best on NVIDIA',
    'NVIDIA becomes the default platform to buy',
    'A bigger installed base attracts more developers',
  ],
  thesis: '<b>Why it matters for the thesis:</b> NVIDIA’s pricing power and ~75% gross margins rest on this ecosystem lock-in, not silicon alone — so the edge can persist even as competitors ship capable chips.',
};
function heroDiff(){
  return '<div class="ovlr-diff">'+
    '<div class="ovlr-diff-eyebrow"><span class="ovlr-diff-spark">◆</span>'+esc(DIFF.eyebrow)+'</div>'+
    '<div class="ovlr-diff-head">'+DIFF.head+'</div>'+
    '<p class="ovlr-diff-body">'+DIFF.body+'</p>'+
    '<div class="ovlr-fw-label">'+esc(DIFF.flyLabel)+'</div>'+
    '<div class="ovlr-flywheel">'+DIFF.flywheel.map(function(s,i){
      return '<div class="ovlr-fw-step"><span class="ovlr-fw-n">'+(i+1)+'</span><span class="ovlr-fw-t">'+esc(s)+'</span></div>'+
        (i < DIFF.flywheel.length-1 ? '<span class="ovlr-fw-arrow">→</span>' : '');
    }).join('')+'</div>'+
    '<div class="ovlr-fw-loopnote">↻ and the loop repeats — every turn makes NVIDIA harder to leave.</div>'+
    '<div class="ovlr-diff-thesis">'+DIFF.thesis+'</div>'+
  '</div>';
}

function ovTopics(){
  return [
    { key:'what', chip:'What it does',
      intro:'NVIDIA sells accelerated-computing <b>platforms</b> — not just chips. Three things define the business.',
      cards:[
        { t:'It sells whole systems, not chips', stat:'silicon → software', body:
          bullets([
            'The product is a <b>full stack</b>: GPUs (Blackwell → Rubin), Grace CPUs, NVLink / InfiniBand / Spectrum networking, DGX / HGX reference systems and rack-scale GB200 / GB300 NVL72 "AI factories".',
            'On top sits <b>CUDA</b> and the software (cuDNN, TensorRT, NIM, Omniverse) developers actually build on.',
            'Increasingly NVIDIA sells the <b>whole rack</b>, not just the die — raising content per deployment. (See the <b>Technology</b> tab.)',
          ]) },
        { t:'It is fabless — it designs, it doesn’t manufacture', stat:'TSMC builds the silicon', body:
          bullets([
            'NVIDIA keeps the high-margin <b>design and platform</b> work; <b>TSMC</b> fabricates the chips, <b>SK hynix / Micron / Samsung</b> supply HBM memory, and <b>Foxconn</b> and others assemble the systems.',
            'That is why it sits inside a deep supplier web — mapped in the <b>Industry Analysis</b> tab.',
          ]) },
        { t:'A new platform every year', stat:'Hopper → Blackwell → Vera Rubin', body:
          '<div class="ov-timeline">'+[
            ['2022','<b>Hopper</b> (H100) — the workhorse of the AI build-out.'],
            ['2024','<b>Blackwell</b> (B200 / GB200) launches.'],
            ['2025','<b>GB200 / GB300 NVL72</b> rack-scale systems ramp.'],
            ['2026','<b>Vera Rubin</b> (Rubin GPU + Vera CPU) ramping now.'],
          ].map(function(t){ return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>'; }).join('')+'</div>'+
          '<p class="ov-p" style="margin:10px 0 0">An annual cadence keeps NVIDIA’s performance-per-watt lead ahead of rivals and pulls customers through repeated upgrade cycles.</p>' },
      ] },
    { key:'money', chip:'How it makes money',
      intro:'Almost all of it is <b>Data Center</b> — selling AI training and inference compute. The FY2026 mix:',
      custom: mixShiftBlock(),
      cards:[
        { t:'Data Center — ~90% of revenue', stat:'$193.7B · +68% YoY', body:
          bullets([
            'Split roughly half <b>Hyperscale</b> (the big clouds and consumer-internet giants) and half <b>ACIE</b> — purpose-built AI data centers across industry, enterprise and sovereigns.',
            'GPUs plus the fastest-growing line, <b>networking</b> (NVLink, Spectrum-X, InfiniBand), and Grace CPUs. Full detail in the <b>Segments</b> tab.',
          ]) },
        { t:'Edge Computing — the other ~10%', stat:'$22.2B · +45% YoY', body:
          bullets([
            'On-device and physical AI: <b>gaming</b> (GeForce / RTX), <b>Pro Viz</b> (workstations / Omniverse), <b>automotive</b> (DRIVE) and <b>robotics</b> (Jetson / Isaac).',
            'In FY2027 NVIDIA regrouped these once-separate platforms into a single "Edge Computing" line.',
          ]) },
        { t:'Who buys it', stat:'a handful of hyperscalers', body:
          bullets([
            'Microsoft, Amazon, Google and Meta are the largest customers — a source of both enormous demand and <b>concentration risk</b> (they also design their own chips).',
            'See <b>Bull vs bear</b> for why that cuts both ways.',
          ]) },
      ] },
    { key:'moat', chip:'The moat',
      intro:'The durable advantage isn’t the chip — it’s everything around it.',
      cards:[
        { t:'CUDA — a 20-year software lock-in', stat:'since 2006', body:
          '<p class="ov-p" style="margin:0">Essentially every AI framework, library and model is written and optimized for NVIDIA first. Developers build where the install base is, and the install base grows because that’s where the software is — a self-reinforcing loop that creates high switching costs. This, more than any single chip, is the deepest moat. (More in the <b>Technology</b> tab.)</p>' },
        { t:'The full stack — networking + systems', stat:'Mellanox → rack-scale', body:
          '<p class="ov-p" style="margin:0">Owning compute <b>plus networking</b> (from the Mellanox acquisition) <b>plus reference systems</b> lets NVIDIA connect thousands of GPUs to act as one giant GPU — something a merchant chip alone can’t match, and where a lot of the incremental value now lives.</p>' },
        { t:'How it stacks up vs rivals', stat:'AMD · custom ASICs · Intel', body:
          '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How NVIDIA differs</th></tr></thead><tbody>'+
          PEERS.map(function(p){ return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>'; }).join('')+
          '</tbody></table>' },
      ] },
    { key:'numbers', chip:'The numbers',
      intro:'FY2026 (year ended Jan 25, 2026) — NVIDIA reported actuals, split-adjusted.',
      html:
        '<table class="ov-table"><thead><tr><th>Metric</th><th>FY2025</th><th>FY2026</th></tr></thead><tbody>'+
        FINANCIALS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>'; }).join('')+
        '</tbody></table>'+
        '<div class="ov-callout">'+esc(FIN_NOTE)+'</div>'+
        '<div class="ov-asof">'+esc(AS_OF)+'</div>' },
    { key:'risk', chip:'Bull vs bear',
      intro:'What could go right — and what could go wrong.',
      html:
        '<div class="ov-grid2">'+
          '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Bull — tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
          '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Bear — headwinds</div>'+bullets(HEADWINDS)+'</div>'+
        '</div>' },
  ];
}

function drillCard(c, i){
  return '<div class="ovlr-card" data-card="'+i+'">'+
    '<button type="button" class="ovlr-card-h">'+
      '<span class="ovlr-card-t">'+c.t+'</span>'+
      (c.stat ? '<span class="ovlr-card-stat">'+c.stat+'</span>' : '')+
      '<span class="ovlr-card-ch">+</span>'+
    '</button>'+
    '<div class="ovlr-card-b">'+c.body+'</div>'+
  '</div>';
}
function topicPanel(t, idx){
  var inner = (t.intro ? '<p class="ovlr-intro">'+t.intro+'</p>' : '')+
    (t.custom || '')+
    (t.cards ? '<div class="ovlr-cards">'+t.cards.map(drillCard).join('')+'</div>' : '')+
    (t.html || '');
  return '<div class="ovlr-panel'+(idx===0?' in':'')+'" data-topic="'+t.key+'"'+(idx===0?'':' hidden')+'>'+inner+'</div>';
}

// ═══════════════════════════════════════════════════════════════════════════════
// Box-based overview (7 sections). Reusable collapsible-box pattern (.ovlr-box).
// ═══════════════════════════════════════════════════════════════════════════════

// Collapsible box: header (title + optional subtitle + chevron) → body.
function ovBox(id, title, sub, body, open){
  return '<section class="ovlr-box'+(open?' open':'')+'" data-box="'+id+'">'+
    '<button type="button" class="ovlr-box-h">'+
      '<span class="ovlr-box-t">'+esc(title)+'</span>'+
      (sub ? '<span class="ovlr-box-sub">'+esc(sub)+'</span>' : '')+
      '<span class="ovlr-box-ch">▾</span>'+
    '</button>'+
    '<div class="ovlr-box-b">'+body+'</div>'+
  '</section>';
}

// ── 2 · Valuation multiples banner (trailing/forward toggle) ─────────────────────
// One consistent basis (Summit model): EPS 4.51→8.84, EBITDA 136.2B→261.0B.
// P/E & EV/EBITDA use the live price & EV; growth and PEG come from the model.
var MULT = {
  trailing: { eps:4.51, epsGr:59, ebitda:136225, ebGr:60 },  // FY2026 (Summit)
  forward:  { eps:8.84, epsGr:96, ebitda:261030, ebGr:92 },  // FY2027 (Summit est.)
};
var _multMode = 'trailing', _multPrice = null, _multEv = null;
function heroMultiples(){
  var tiles = [['P/E','nvMultPE'],['Earnings growth','nvMultEG'],['PEG','nvMultPEG'],
    ['EV / EBITDA','nvMultEV'],['EBITDA growth','nvMultEBG'],['PEG (EBITDA)','nvMultPEGE']];
  return '<div class="ovlr-mult">'+
    '<div class="ovlr-mult-top">'+
      '<div class="ovlr-mult-live"><span class="ov-live-dot"></span><span class="ov-live-tk">NVDA</span>'+
        '<span class="ov-live-px" id="nvMultPx">$—</span><span class="ov-live-ch" id="nvMultCh"></span></div>'+
      '<div class="ovlr-seg" id="nvMultToggle">'+
        '<button type="button" class="ovlr-seg-b active" data-mult="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-mult="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ovlr-mult-grid">'+tiles.map(function(t){
      return '<div class="ovlr-mult-tile"><div class="ovlr-mult-l">'+esc(t[0])+'</div>'+
        '<div class="ovlr-mult-v" id="'+t[1]+'"><span class="ovlr-mut">—</span></div></div>';
    }).join('')+'</div>'+
    '<div class="ovlr-mult-note" id="nvMultNote"></div>'+
  '</div>';
}
function multFill(pane){
  var m = MULT[_multMode], p = _multPrice, ev = _multEv;
  function set(id, txt){ var e = pane.querySelector('#'+id); if (e) e.textContent = txt; }
  set('nvMultEG', '+'+m.epsGr+'%');
  set('nvMultEBG', '+'+m.ebGr+'%');
  if (p != null){ var pe = p/m.eps; set('nvMultPE', pe.toFixed(1)+'×'); set('nvMultPEG', (pe/m.epsGr).toFixed(2)); }
  else { set('nvMultPE','—'); set('nvMultPEG','—'); }
  if (ev != null){ var eve = ev/(m.ebitda*1e6); set('nvMultEV', eve.toFixed(1)+'×'); set('nvMultPEGE', (eve/m.ebGr).toFixed(2)); }
  else { set('nvMultEV','—'); set('nvMultPEGE','—'); }
  var note = pane.querySelector('#nvMultNote');
  if (note) note.innerHTML = (_multMode==='trailing' ? '<b>Trailing</b> — FY2026 (Summit model).' : '<b>Forward</b> — FY2027 (Summit projections).')+
    ' P/E &amp; EV/EBITDA use the live price &amp; EV; growth &amp; PEG from the Summit model. PEG = multiple ÷ growth-%.';
}

// ── 3 · Description (expandable) ─────────────────────────────────────────────────
function descBox(){
  return '<div class="ovlr-desc" data-desc>'+
    '<p class="ovlr-desc-txt" id="nvDescTxt">'+esc(DESC)+'</p>'+
    '<button type="button" class="ovlr-desc-more" id="nvDescMore">Read more ▾</button>'+
  '</div>';
}

// ── 5 · Products body (cards + lightbox; header supplied by the box) ─────────────
function productsBody(){
  return '<div class="ovlr-prod">'+
    '<div class="ovlr-prod-hint2">Tap a product to enlarge.</div>'+
    '<div class="ovlr-prod-row">'+PRODUCTS.map(function(p,i){
      return '<figure class="ovlr-prod-card ovlr-clickable" data-prod="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.name)+' — enlarge">'+
        '<div class="ovlr-prod-imgwrap"><img class="ovlr-prod-img" src="img/products/'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.display=\'none\'"><span class="ovlr-prod-zoom">⤢</span></div>'+
        '<figcaption class="ovlr-prod-body"><div class="ovlr-prod-tag">'+esc(p.tag)+'</div>'+
          '<div class="ovlr-prod-name">'+esc(p.name)+'</div><div class="ovlr-prod-d">'+esc(p.d)+'</div></figcaption>'+
      '</figure>';
    }).join('')+'</div>'+
    '<div class="ovlr-prod-note">Product imagery © NVIDIA newsroom, shown for illustration.</div>'+
    '<div class="ovlr-modal" id="nvProdModal" hidden><div class="ovlr-modal-box" role="dialog" aria-modal="true">'+
      '<button type="button" class="ovlr-modal-x" id="nvProdX" aria-label="Close">×</button>'+
      '<img class="ovlr-modal-img" id="nvProdImg" src="" alt="">'+
      '<div class="ovlr-modal-body"><div class="ovlr-modal-tag" id="nvProdTag"></div>'+
        '<div class="ovlr-modal-name" id="nvProdName"></div><div class="ovlr-modal-d" id="nvProdDesc"></div></div>'+
    '</div></div>'+
  '</div>';
}

// ── 6 · How it makes money (segment / region doughnut) ───────────────────────────
// Segment = reported FY2026 market-platform revenue ($B). Region = approximate FY2025
// 10-K geography (% by billing location) — Summit has no geo data; refine w/ 10-K.
var MONEY_SEG = { title:'FY2026 revenue by segment <span>($B · reported)</span>',
  labels:['Hyperscale','ACIE','Edge Computing'], data:[105.6,88.1,22.2],
  colors:['#1F8A70','#5cc0a6','#2D6A9F'], unit:'B',
  note:'Reported FY2026 market-platform revenue. Data Center (Hyperscale + ACIE) ≈ 90% of sales — the products above are almost all Data Center.' };
var MONEY_REG = { title:'Revenue by region <span>(% · approx · by billing location)</span>',
  labels:['United States','Singapore*','Taiwan','China','Other'], data:[47,18,16,13,6],
  colors:['#1F8A70','#3A7CA5','#5B53A8','#C0772C','#9aa6b4'], unit:'%',
  note:'⚠️ Approximate FY2025 geography by customer <b>billing</b> location (not end-demand). *Singapore is largely an invoicing hub. Summit has no regional data — to be updated with exact FY2026 10-K figures.' };
var _moneyMode = 'segment', _moneyChart = null;
function moneyBody(){
  return '<p class="ovlr-money-p">The products above are almost all <b>Data Center</b> — the NVL72 racks, superchips, networking and silicon NVIDIA sells to clouds and AI builders. Gaming, pro-viz, automotive and robotics make up the smaller <b>Edge</b> line.</p>'+
    '<div class="ovlr-seg" id="nvMoneyToggle">'+
      '<button type="button" class="ovlr-seg-b active" data-money="segment">By segment</button>'+
      '<button type="button" class="ovlr-seg-b" data-money="region">By region</button>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t" id="nvMoneyTitle">'+MONEY_SEG.title+'</div>'+
    '<div class="ov-chart-wrap"><canvas id="nvMoneyChart"></canvas></div></div>'+
    '<div class="ovlr-money-note" id="nvMoneyNote">'+MONEY_SEG.note+'</div>';
}
function buildMoneyChart(){
  var cv = document.getElementById('nvMoneyChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_moneyChart){ _moneyChart.destroy(); _moneyChart = null; }
  var d = _moneyMode === 'region' ? MONEY_REG : MONEY_SEG;
  _moneyChart = new Chart(cv.getContext('2d'), {
    type:'doughnut',
    data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:d.colors, borderWidth:2, borderColor:'#fff' }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'58%',
      plugins:{ legend:{ position:'right', labels:{ boxWidth:12, font:{size:12}, color:'#5b6470', padding:10 } },
        tooltip:{ callbacks:{ label:function(ctx){ var t=ctx.dataset.data.reduce(function(a,b){return a+b;},0);
          var v=ctx.parsed; return ' '+ctx.label+': '+(d.unit==='B'?'$'+v.toFixed(1)+'B':v+'%')+' ('+(v/t*100).toFixed(0)+'%)'; } } } } }
  });
}

// ── 7 · Competitors (bubble: multiple × growth, size = market cap) ────────────────
// Seeded from NVIDIA's 10-K peer set (approx values, editable). Market cap fills LIVE
// from liveQuote per ticker. Multiples/growth are seed values until a live ratios-field
// mapping is confirmed. Toggle: P/E vs EV/EBITDA, and trailing vs forward.
var COMP = [
  { ticker:'NVDA', name:'NVIDIA',      pe:38, peF:19, ev:30, evF:16, eg:59, egF:96, ebg:60, ebgF:92, mcap:4100, self:true },
  { ticker:'AMD',  name:'AMD',         pe:45, peF:28, ev:33, evF:22, eg:35, egF:60, ebg:38, ebgF:55, mcap:260 },
  { ticker:'AVGO', name:'Broadcom',    pe:38, peF:30, ev:28, evF:24, eg:25, egF:22, ebg:30, ebgF:26, mcap:1150 },
  { ticker:'INTC', name:'Intel',       pe:35, peF:22, ev:11, evF:9,  eg:10, egF:20, ebg:8,  ebgF:18, mcap:130 },
  { ticker:'QCOM', name:'Qualcomm',    pe:16, peF:14, ev:12, evF:11, eg:12, egF:10, ebg:11, ebgF:9,  mcap:190 },
];
var _compMult = 'pe', _compTime = 'trailing', _compChart = null;
function competitorsBody(){
  return '<p class="ovlr-money-p">NVIDIA’s public peers from its 10-K. <b>X</b> = valuation multiple, <b>Y</b> = growth, <b>bubble size</b> = market cap. Add or remove any public company.</p>'+
    '<div class="ovlr-comp-ctl">'+
      '<div class="ovlr-seg" id="nvCompMult">'+
        '<button type="button" class="ovlr-seg-b active" data-cmult="pe">P/E · earnings</button>'+
        '<button type="button" class="ovlr-seg-b" data-cmult="ev">EV/EBITDA</button>'+
      '</div>'+
      '<div class="ovlr-seg" id="nvCompTime">'+
        '<button type="button" class="ovlr-seg-b active" data-ctime="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-ctime="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Peers — multiple × growth × size <span>(bubble = market cap)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvCompChart"></canvas></div></div>'+
    '<div class="ovlr-comp-add"><input type="text" id="nvCompInput" placeholder="Add ticker (e.g. MRVL)" maxlength="6" autocomplete="off">'+
      '<button type="button" id="nvCompAdd">+ Add</button></div>'+
    '<div class="ovlr-comp-chips" id="nvCompChips"></div>'+
    '<div class="ovlr-money-note">Market cap is <b>live</b> (Massive) per ticker. Multiples &amp; growth are seed values (editable) until a live ratios-field mapping is confirmed. Peers seeded from NVIDIA’s 10-K.</div>';
}
// Draws the ticker label above each competitor bubble.
var compLabels = {
  id:'compLabels',
  afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
    ctx.save(); ctx.font = '700 11px Inter, sans-serif'; ctx.textAlign = 'center';
    meta.data.forEach(function(el, i){
      var p = ds.data[i]; if (!p) return;
      ctx.fillStyle = p.self ? '#5f9500' : '#1E2733';
      ctx.fillText(p.t, el.x, el.y - (p.r || 6) - 5);
    });
    ctx.restore();
  }
};
function buildCompChart(){
  var cv = document.getElementById('nvCompChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_compChart){ _compChart.destroy(); _compChart = null; }
  var fwd = _compTime === 'forward', isPe = _compMult === 'pe';
  var pts = COMP.map(function(c){
    var mult = isPe ? (fwd?c.peF:c.pe) : (fwd?c.evF:c.ev);
    var gr   = isPe ? (fwd?c.egF:c.eg) : (fwd?c.ebgF:c.ebg);
    if (mult == null || gr == null) return null;
    return { x:mult, y:gr, r:Math.max(6, Math.sqrt(c.mcap||1)/2.4), t:c.ticker, mcap:c.mcap, self:c.self };
  }).filter(Boolean);
  _compChart = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{ data:pts,
      backgroundColor:pts.map(function(p){ return p.self ? 'rgba(118,185,0,0.55)' : 'rgba(45,106,159,0.45)'; }),
      borderColor:pts.map(function(p){ return p.self ? '#76B900' : '#2D6A9F'; }), borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:16, right:12, left:4 } },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var p=ctx.raw;
          return p.t+': '+(isPe?'P/E ':'EV/EBITDA ')+p.x+'× · growth '+p.y+'% · mcap $'+(p.mcap>=1000?(p.mcap/1000).toFixed(1)+'T':p.mcap+'B'); } } } },
      scales:{ x:{ reverse:true, title:{ display:true, text:(isPe?'P/E':'EV/EBITDA')+' (×)'+(fwd?' · forward':' · trailing')+' · cheaper →', color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'×'; } } },
        y:{ title:{ display:true, text:(isPe?'Earnings':'EBITDA')+' growth (%)'+(fwd?' · forward':' · trailing'), color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } },
    plugins:[compLabels]
  });
}
function renderCompChips(){
  var box = document.getElementById('nvCompChips'); if (!box) return;
  box.innerHTML = COMP.map(function(c,i){
    return '<span class="ovlr-comp-chip'+(c.self?' self':'')+'">'+esc(c.ticker)+
      (c.mcap!=null?' · $'+(c.mcap>=1000?(c.mcap/1000).toFixed(1)+'T':c.mcap+'B'):'')+
      (c.self?'':'<button type="button" class="ovlr-comp-x" data-rm="'+i+'" aria-label="remove">×</button>')+'</span>';
  }).join('');
}

function overviewBody(){
  var h = '';
  // 1 — company banner
  h += '<div class="ov-snap ovlr-snap6">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  // 2 — valuation multiples
  h += heroMultiples();
  // 3 — description (expandable)
  h += descBox();
  // 4 — business snapshot
  h += heroBusiness();
  // 5 — products (collapsible)
  h += ovBox('products', 'Products — what they make', 'tap to expand', productsBody(), false);
  // 6 — how it makes money (collapsible)
  h += ovBox('money', 'How it makes money', 'segments & regions', moneyBody(), false);
  // 7 — competitors (open)
  h += ovBox('competitors', 'Competitors', 'multiple × growth × size', competitorsBody(), true);
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// Wire the box-based overview. Idempotent; safe to call on load and re-entry.
function initOverview(){
  var root = document.querySelector('.ov-nvda'); if (!root) return;
  var pane = root.querySelector('.ovt-pane[data-ovt="overview"]'); if (!pane) return;

  // 2 — multiples: trailing/forward toggle + live price/EV fill.
  pane.querySelectorAll('#nvMultToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _multMode = b.getAttribute('data-mult');
      pane.querySelectorAll('#nvMultToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      multFill(pane);
    };
  });
  multFill(pane);
  import('../api.js').then(function(api){ return api.liveQuote('NVDA'); }).then(function(res){
    var q = res && res.data; if (!q || q.price == null) return;
    _multPrice = q.price; _multEv = q.ev;
    var px = pane.querySelector('#nvMultPx'); if (px) px.textContent = '$'+q.price.toFixed(2);
    var ch = pane.querySelector('#nvMultCh');
    if (ch && q.changePct != null){ var up = q.changePct >= 0; ch.className = 'ov-live-ch '+(up?'up':'down');
      ch.textContent = (up?'▲ +':'▼ −')+Math.abs(q.changePct).toFixed(2)+'%'; }
    multFill(pane);
  }).catch(function(){});

  // 3 — description expand/collapse.
  var dMore = pane.querySelector('#nvDescMore');
  if (dMore) dMore.onclick = function(){
    var box = pane.querySelector('.ovlr-desc'); var open = box.classList.toggle('open');
    dMore.textContent = open ? 'Read less ▴' : 'Read more ▾';
  };

  // 5/6/7 — collapsible boxes; build the lazy chart when a box opens.
  pane.querySelectorAll('.ovlr-box-h').forEach(function(hb){
    hb.onclick = function(){
      var box = hb.parentElement; var open = box.classList.toggle('open');
      if (open){
        var id = box.getAttribute('data-box');
        if (id === 'money') requestAnimationFrame(buildMoneyChart);
        if (id === 'competitors') requestAnimationFrame(buildCompChart);
      }
    };
  });

  // 5 — products lightbox.
  var modal = pane.querySelector('#nvProdModal');
  if (modal){
    var mImg = modal.querySelector('#nvProdImg'), mTag = modal.querySelector('#nvProdTag'),
        mName = modal.querySelector('#nvProdName'), mDesc = modal.querySelector('#nvProdDesc');
    var closeProd = function(){ modal.hidden = true; };
    var openProd = function(card){ var p = PRODUCTS[parseInt(card.getAttribute('data-prod'),10)]; if (!p) return;
      mImg.src = 'img/products/'+p.img; mImg.alt = p.name; mTag.textContent = p.tag; mName.textContent = p.name;
      mDesc.innerHTML = p.detail || p.d; modal.hidden = false; };
    pane.querySelectorAll('.ovlr-prod-card').forEach(function(card){
      card.onclick = function(){ openProd(card); };
      card.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openProd(card); } };
    });
    modal.onclick = function(e){ if (e.target === modal) closeProd(); };
    var xb = modal.querySelector('#nvProdX'); if (xb) xb.onclick = closeProd;
    if (!modal._esc){ modal._esc = 1; document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !modal.hidden) closeProd(); }); }
  }

  // 6 — money segment/region toggle.
  pane.querySelectorAll('#nvMoneyToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _moneyMode = b.getAttribute('data-money');
      pane.querySelectorAll('#nvMoneyToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      var d = _moneyMode === 'region' ? MONEY_REG : MONEY_SEG;
      var t = pane.querySelector('#nvMoneyTitle'); if (t) t.innerHTML = d.title;
      var n = pane.querySelector('#nvMoneyNote'); if (n) n.innerHTML = d.note;
      buildMoneyChart();
    };
  });

  // 7 — competitors: toggles, add/remove, live market cap per ticker.
  pane.querySelectorAll('#nvCompMult .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _compMult = b.getAttribute('data-cmult');
      pane.querySelectorAll('#nvCompMult .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      buildCompChart(); };
  });
  pane.querySelectorAll('#nvCompTime .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _compTime = b.getAttribute('data-ctime');
      pane.querySelectorAll('#nvCompTime .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      buildCompChart(); };
  });
  var liveMcap = function(tk){
    import('../api.js').then(function(api){ return api.liveQuote(tk); }).then(function(res){
      var q = res && res.data; if (!q || q.marketCap == null) return;
      var row = COMP.filter(function(c){ return c.ticker === tk; })[0];
      if (row){ row.mcap = Math.round(q.marketCap/1e9); renderCompChips(); buildCompChart(); }
    }).catch(function(){});
  };
  COMP.forEach(function(c){ liveMcap(c.ticker); });   // refresh all sizes live
  var addInput = pane.querySelector('#nvCompInput'), addBtn = pane.querySelector('#nvCompAdd');
  var doAdd = function(){
    var tk = (addInput.value||'').trim().toUpperCase().replace(/[^A-Z.]/g,''); if (!tk) return;
    if (COMP.some(function(c){ return c.ticker === tk; })){ addInput.value=''; return; }
    COMP.push({ ticker:tk, name:tk, pe:null, peF:null, ev:null, evF:null, eg:null, egF:null, ebg:null, ebgF:null, mcap:null });
    addInput.value=''; renderCompChips(); liveMcap(tk);
  };
  if (addBtn) addBtn.onclick = doAdd;
  if (addInput) addInput.onkeydown = function(e){ if (e.key === 'Enter'){ e.preventDefault(); doAdd(); } };
  var chips = pane.querySelector('#nvCompChips');
  if (chips) chips.onclick = function(e){ var t = e.target.closest('.ovlr-comp-x'); if (!t) return;
    COMP.splice(parseInt(t.getAttribute('data-rm'),10), 1); renderCompChips(); buildCompChart(); };
  renderCompChips();
  // Competitors box starts open — build its chart now.
  requestAnimationFrame(buildCompChart);
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
    '<div class="ov-callout">Q1 FY2027 (ended April 26, 2026): record revenue with GAAP gross margin back to 74.9% (the prior year’s 60.5% carried the $4.5B H20 charge). GAAP net income was $58.3B (+211%), but that includes a one-time <b>$15.9B gain on equity securities</b> — operating income (+147% to $53.5B) is the cleaner read. <b>No Data Center Hopper shipments to China</b> occurred in the quarter (vs $4.6B a year earlier). NVIDIA raised its dividend from $0.01 to $0.25 and added $80B to buybacks. Networking (NVLink, Spectrum-X, InfiniBand) is the fastest-growing line — see the Industry Analysis tab. The next platform, <b>Vera Rubin</b> (Rubin GPU + Vera CPU), is ramping into H2 2026 and drives the FY2027+ forecast.</div>');

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
// [name, accent, description, product image (in img/products/)]
var TECH_STACK = [
  ['Software & ecosystem', '#1F8A70', 'CUDA, cuDNN, TensorRT, AI Enterprise, NIM microservices and Omniverse — the platform developers build on. This is the moat.', ''],
  ['Systems', '#2E9E78', 'DGX / HGX servers and rack-scale "AI factories" — GB200 / GB300 NVL72 today, the new <b>Vera Rubin NVL72</b> (72 Rubin GPUs + 36 Vera CPUs) ramping. NVIDIA increasingly sells the whole rack, not just the chip.', 'nvda-gb300-nvl72.jpg'],
  ['Networking', '#3A7CA5', 'NVLink (now 6th-gen, 3.6 TB/s on Rubin), InfiniBand and Spectrum-X Ethernet (from the Mellanox acquisition) — moving data between thousands of GPUs as if they were one.', 'nvda-networking.jpg'],
  ['Processors', '#5B53A8', 'The GPU (Blackwell → <b>Rubin</b>, ramping now), the CPU (Grace → the new <b>Vera</b>) and the BlueField DPU — designed together to work as one system.', 'nvda-superchip.jpg'],
  ['Silicon', '#6B7A8F', 'Chips designed by NVIDIA, manufactured by TSMC, with HBM memory from SK hynix / Micron and advanced (CoWoS) packaging.', 'nvda-dies.jpg'],
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
  ['2025', '<b>GB200 / GB300 NVL72</b> rack-scale systems ramp.'],
  ['2026', '<b>Vera Rubin</b> — the Rubin R200 GPU (up to ~336B transistors on TSMC 3nm, 288GB HBM4, ~50 PFLOPS FP4) paired with the new <b>Vera</b> CPU — enters production and begins its <b>ramp</b> (Vera Rubin NVL72). <b>Rubin Ultra</b> follows in 2027.'],
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
  [2026, 336000000000, 'NVIDIA Rubin R200 (ramping)', 'n', 3, null],
];
// Flagship data-center GPU transistor counts (billions) by architecture.
var GPU_GENS = [['Pascal · 2016','GP100',15.3], ['Volta · 2017','GV100',21.1],
  ['Ampere · 2020','GA100',54.2], ['Hopper · 2022','GH100',80], ['Blackwell · 2024','GB200',208],
  ['Rubin · 2026','R200',336,true]];
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
    '<div class="ov-asof" style="margin-top:10px">As the <b>process node shrinks</b> (orange, falling) more transistors fit per chip (green, rising) and <b>AI compute explodes</b> (blue) — Hopper and Blackwell deliver thousands of FP16 TFLOPS. <b>Vera Rubin</b> (2026, ramping) extends the curve to ~336B transistors on a 3nm node. AI TFLOPS are FP16 tensor figures, illustrative; the CPUs of the 1970s–2000s predate this metric.</div></div>';
}
function transistorShrink(){
  return '<div class="tr-shrink"><div class="tr-die" id="trDie"></div>'+
    '<div class="tr-meta"><div class="tr-nodeline"><span class="tr-node" id="trNode">—</span>'+
    '<span class="tr-year" id="trYear"></span></div>'+
    '<span class="tr-count" id="trCount"></span>'+
    '<span class="tr-hint">Smaller process node → more transistors, smaller and closer together. The year marks roughly when each node reached volume production. The dots are an illustration, not to scale.</span></div></div>';
}
function gpuGenBars(){
  var max=336;
  return '<div class="gen-bars" id="genBars">'+GPU_GENS.map(function(g){
    return '<div class="gen-row"><div class="gen-name">'+esc(g[0])+(g[3]?' <span class="gen-tag">ramping</span>':'')+'</div>'+
      '<div class="gen-track"><div class="gen-fill'+(g[3]?' ramping':'')+'" style="--w:'+(g[2]/max*100).toFixed(1)+'%"></div></div>'+
      '<div class="gen-val">'+g[2]+'B</div></div>';
  }).join('')+'</div>'+
  '<div class="ov-asof">Bars = transistors per flagship data-center GPU (billions). <b>Vera Rubin (R200, 2026)</b> — up to ~336B transistors on TSMC 3nm with HBM4 — is <b>ramping now</b> and roughly doubles Blackwell’s FP4 throughput (~50 vs ~20 PFLOPS). Architectural advances (Tensor Cores, FP8/FP4 precision) lifted real AI performance even faster than transistor count. Rubin figures are as reported during its ramp.</div>';
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

  h += '<div class="ov-foot">Sources: Summit research team 2024 semiconductor case-study deck (internal), plus NVIDIA public materials and technical documentation. Product renders © NVIDIA (press / newsroom imagery), shown for illustration. Simplified for explanation; transistor counts and dates are approximate.</div>';
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
        x:{ type:'linear', min:1970, max:2027, grid:{ display:false },
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
    function photo(file){
      return file
        ? '<div class="nv3d-imgbox"><img class="nv3d-photo" src="img/products/'+file+'" alt="" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>'
        : '<div class="nv3d-img">Software isn’t a "photo" — it’s CUDA, NIM &amp; Omniverse, the platform layer.</div>';
    }
    if(sel<0){
      panel.innerHTML='<div class="nv3d-p-h">The full stack</div>'+
        '<div class="nv3d-p-d">NVIDIA sells every layer from the <b>silicon</b> up to the <b>software</b> — that vertical integration is what rivals can’t match with a chip alone, and where the durable margin lives. Tap a layer to see the product.</div>'+
        photo('nvda-gb300-nvl72.jpg');
    } else {
      var l=layers[sel];
      panel.innerHTML='<div class="nv3d-p-h" style="color:'+l[1]+'">'+esc(l[0])+'</div>'+
        '<div class="nv3d-p-d">'+l[2]+'</div>'+
        photo(l[3]);
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
// Executive team — [name, role, photo, bio, ownership label, initials, accent, shares].
var LEADERS = [
  ['Jensen Huang','Founder, President & CEO','nvda-jensen.jpg','Co-founded NVIDIA in 1993 and has led it ever since — the architect of its bet on accelerated computing and CUDA, and the company’s strategic and public face.','812.0M · 3.36%','JH','#1F8A70', 812004746],
  ['Colette Kress','EVP & Chief Financial Officer','nvda-colette.jpg','CFO since 2013 — leads finance, capital allocation and investor relations through the scale-up to a $200B+ revenue company.','4.85M · 0.02%','CK','#5B53A8', 4851271],
  ['Jay Puri','EVP, Worldwide Field Operations','nvda-jay.jpg','With NVIDIA since 2005 — runs global sales and go-to-market field operations.','3.67M · 0.02%','JP','#2D6A9F', 3665228],
  ['Debora Shoquist','EVP, Operations','nvda-debora.jpg','Leads global supply chain and manufacturing operations — central to navigating the AI supply crunch.','1.95M · 0.01%','DS','#C0772C', 1946358],
  ['Tim Teter','EVP, General Counsel & Secretary','nvda-tim.jpg','NVIDIA’s chief legal officer — oversees legal, intellectual property and compliance.','3.05M · 0.01%','TT','#B0506A', 3052096],
  ['Chris Malachowsky','Co-founder & NVIDIA Fellow','nvda-chris.jpg','One of NVIDIA’s three co-founders (with Jensen Huang and Curtis Priem) and a long-time technical leader and NVIDIA Fellow.','—','CM','#3A7CA5', null],
];
// Insider & board ownership — [name, role, shares, % out, latest Form 4 net change, date].
// Source: Bloomberg holdings export (NVDA_OWN), positions as of the latest Form 4 filings.
var OWNERSHIP = [
  ['Jensen Huang','Founder, President & CEO', 812004746, '3.36%', -45723, 'Jun 17, 2026'],
  ['Mark A. Stevens','Director', 31769633, '0.13%', 1211, 'Jun 25, 2026'],
  ['Tench Coxe','Director', 30581218, '0.13%', 1211, 'Jun 25, 2026'],
  ['Harvey C. Jones','Director', 7004898, '0.03%', 1211, 'Jun 25, 2026'],
  ['Colette Kress','EVP & CFO', 4851271, '0.02%', -40746, 'Jun 17, 2026'],
  ['Jay (Ajay) Puri','EVP, Worldwide Field Operations', 3665228, '0.02%', -36927, 'Jun 17, 2026'],
  ['Tim Teter','EVP, General Counsel', 3052096, '0.01%', -35742, 'Jun 17, 2026'],
  ['A. Brooke Seawell','Director', 2507818, '0.01%', 1211, 'Jun 25, 2026'],
  ['Debora Shoquist','EVP, Operations', 1946358, '0.01%', -35012, 'Jun 17, 2026'],
  ['Dawn Hudson','Director', 370098, '<0.01%', 1211, 'Jun 25, 2026'],
  ['Robert Burgess','Director', 202843, '<0.01%', 1799, 'Jun 26, 2025'],
  ['Stephen Neal','Lead Director', 170578, '<0.01%', 1211, 'Jun 25, 2026'],
  ['Persis Drell','Director', 142627, '<0.01%', -40000, 'Sep 19, 2025'],
  ['Aarti Shah','Director', 37218, '<0.01%', 1211, 'Jun 25, 2026'],
  ['Melissa Lora','Director', 16868, '<0.01%', 1211, 'Jun 25, 2026'],
  ['John Dabiri','Director', 15374, '<0.01%', 1211, 'Jun 25, 2026'],
  ['Ellen Ochoa','Director', 4968, '<0.01%', 1799, 'Jun 26, 2025'],
];

function leadAvatar(initials, accent, file, extra){
  return '<div class="lead-av '+(extra||'')+'" style="--c:'+accent+'"><span>'+esc(initials)+'</span>'+
    (file ? '<img src="img/leadership/'+esc(file)+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '')+'</div>';
}
// Interactive org tree — clickable nodes with small photos; detail renders into #mgDetail.
function orgNode(idx, sublabel, cls){
  var p=LEADERS[idx];
  return '<button type="button" class="org-node org-click '+(cls||'')+'" data-lead="'+idx+'">'+
    leadAvatar(p[5],p[6],p[2],'lead-av-sm')+
    '<div class="org-txt"><div class="org-name">'+esc(p[0])+'</div><div class="org-role">'+esc(sublabel||p[1])+'</div></div></button>';
}
function orgTree(){
  return '<div class="org">'+
    orgNode(0,'Founder, President & CEO','org-ceo')+
    '<div class="org-reports">'+
      orgNode(1,'Finance · CFO')+orgNode(2,'WW Field Operations')+
      orgNode(3,'Operations')+orgNode(4,'Legal · General Counsel')+
      '<div class="org-node org-info"><div class="org-txt"><div class="org-name">Engineering · Architecture · AI Software · Research</div><div class="org-role">~50+ more direct reports</div></div></div>'+
    '</div></div>'+
    '<div class="org-founders">Co-founders (1993): '+
      '<button type="button" class="org-chip" data-lead="0">Jensen Huang</button> · '+
      '<button type="button" class="org-chip" data-lead="5">Chris Malachowsky</button> · Curtis Priem</div>'+
    '<div class="ov-asof">NVIDIA runs an unusually <b>flat</b> organization — Jensen Huang has ~50–60 direct reports and no divisional general managers; teams are organized by function. The named reports are the executive officers. <b>Click any person</b> for their detail and live holdings value.</div>';
}
// Live-price valuation helpers.
var _mgPrice = null, _mgSel = 0;
function mgUsd(v){
  if(v>=1e9) return '$'+(v/1e9).toFixed(2)+'B';
  if(v>=1e6) return '$'+(v/1e6).toFixed(1)+'M';
  return '$'+Math.round(v).toLocaleString('en-US');
}
function mgValSpan(shares){
  return '<span class="mg-val" data-sh="'+shares+'">'+(_mgPrice!=null?mgUsd(shares*_mgPrice):'…')+'</span>';
}
function mgRenderDetail(idx){
  var el=document.getElementById('mgDetail'); if(!el) return;
  _mgSel=idx;
  var p=LEADERS[idx], sh=p[7];
  var own = (sh!=null)
    ? (sh/1e6).toFixed(2)+'M shares · '+(p[4].split('·')[1]||'').trim()+' of shares out · worth <b>'+mgValSpan(sh)+'</b>'
    : 'Not a Section 16 insider filer (co-founder &amp; Fellow).';
  el.innerHTML='<div class="mg-d-top">'+leadAvatar(p[5],p[6],p[2])+
    '<div><div class="mg-d-name">'+esc(p[0])+'</div><div class="mg-d-role">'+esc(p[1])+'</div></div></div>'+
    '<div class="mg-d-bio">'+esc(p[3])+'</div>'+
    '<div class="mg-d-own">'+own+'</div>';
}
function ownTable(){
  function sh(n){ return (n/1e6).toFixed(2)+'M'; }
  function chg(n){ return '<span class="'+(n>=0?'own-up':'own-dn')+'">'+(n>=0?'+':'−')+Math.abs(n).toLocaleString('en-US')+'</span>'; }
  var total=OWNERSHIP.reduce(function(a,o){ return a+o[2]; },0);
  var body=OWNERSHIP.map(function(o){
    return '<tr><td class="ov-td-name">'+esc(o[0])+'</td><td>'+esc(o[1])+'</td>'+
      '<td style="text-align:right">'+sh(o[2])+'</td><td style="text-align:right">'+esc(o[3])+'</td>'+
      '<td style="text-align:right">'+mgValSpan(o[2])+'</td>'+
      '<td>'+chg(o[4])+' · '+esc(o[5])+'</td></tr>';
  }).join('');
  var tot='<tr class="own-total"><td class="ov-td-name">Total · insiders &amp; directors</td><td></td>'+
    '<td style="text-align:right">'+sh(total)+'</td><td style="text-align:right">~3.5%</td>'+
    '<td style="text-align:right">'+mgValSpan(total)+'</td><td></td></tr>';
  return '<div style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Name</th><th>Role</th>'+
    '<th style="text-align:right">Shares</th><th style="text-align:right">% out</th>'+
    '<th style="text-align:right">Value (live)</th><th>Latest Form 4</th></tr></thead>'+
    '<tbody>'+body+tot+'</tbody></table></div>';
}
function managementBody(){
  var h='';
  h+='<p class="ov-lede">NVIDIA is <b>founder-led</b> and deliberately <b>flat</b>: Jensen Huang has run the company since founding it in 1993, with an unusually wide span of direct reports and few management layers. <b>Click a person in the tree</b> to see their detail and live holdings value.</p>';
  h+='<div class="ov-live" id="mgLive" hidden></div>';
  h+=sec('Leadership & organization',
    '<div id="mgWrap" class="mg-wrap">'+orgTree()+'<div class="mg-detail" id="mgDetail"></div></div>');
  h+=sec('Insider &amp; board ownership', ownTable());
  h+='<div class="ov-foot">Ownership from a Bloomberg holdings export (NVDA insiders &amp; directors); positions as of the latest Form 4 filings (mostly June 2026). "Value (live)" = shares × the live NVDA price (Massive); requires a logged-in session. Large holders’ sales are typically pre-arranged 10b5-1 plans; small positive changes are routine grants / RSU vesting. Executive headshots © NVIDIA newsroom.</div>';
  return h;
}
// Wire org clicks + fetch the live NVDA price and fill all value cells.
function initManagement(){
  var wrap=document.getElementById('mgWrap');
  if(wrap && !wrap._w){ wrap._w=1;
    wrap.addEventListener('click', function(e){
      var n=e.target.closest('[data-lead]'); if(!n) return;
      var idx=parseInt(n.getAttribute('data-lead'),10);
      wrap.querySelectorAll('.org-click').forEach(function(x){ x.classList.toggle('sel', x.getAttribute('data-lead')==String(idx)); });
      mgRenderDetail(idx);
      if(_mgPrice!=null) mgFillValues();
    });
  }
  mgRenderDetail(_mgSel);
  var sel=wrap && wrap.querySelector('.org-click[data-lead="'+_mgSel+'"]'); if(sel) sel.classList.add('sel');
  if(_mgPrice!=null){ mgFillValues(); return; }
  import('../api.js').then(function(api){ return api.liveQuote('NVDA'); }).then(function(res){
    var q=res&&res.data; if(!q||q.price==null){ mgClearValues(); return; }
    _mgPrice=q.price; mgFillValues();
    var lv=document.getElementById('mgLive');
    if(lv){ var up=(q.changePct||0)>=0; lv.hidden=false;
      lv.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">NVDA</span>'+
        '<span class="ov-live-px">$'+_mgPrice.toFixed(2)+'</span>'+
        (q.changePct!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(q.changePct).toFixed(2)+'%</span>':'')+
        '<span class="ov-live-ts">live · NASDAQ · Massive · holdings valued at this price</span>';
    }
  }).catch(function(){ mgClearValues(); });
}
function mgFillValues(){
  if(_mgPrice==null) return;
  document.querySelectorAll('.ov-nvda .mg-val').forEach(function(s){
    var sh=parseFloat(s.getAttribute('data-sh')); if(isFinite(sh)) s.textContent=mgUsd(sh*_mgPrice);
  });
}
function mgClearValues(){
  document.querySelectorAll('.ov-nvda .mg-val').forEach(function(s){ if(s.textContent==='…') s.textContent='—'; });
}

// ════════════════════════════════════════════════════════════════════════════════
// 5 — CONSENSUS  (estimate revisions over time + guidance-vs-actual track record)
// ════════════════════════════════════════════════════════════════════════════════
// NVIDIA gives a single revenue outlook one quarter ahead ("$X.0B, ± 2%"); each row
// pairs that guidance MIDPOINT with the revenue actually reported. $B.
// Guidance = NVIDIA quarterly outlook (press releases); actuals = reported revenue.
var GUIDE = [
  ['Q1 FY24',  6.50,  7.19], ['Q2 FY24', 11.00, 13.51], ['Q3 FY24', 16.00, 18.12], ['Q4 FY24', 20.00, 22.10],
  ['Q1 FY25', 24.00, 26.04], ['Q2 FY25', 28.00, 30.04], ['Q3 FY25', 32.50, 35.08], ['Q4 FY25', 37.50, 39.33],
  ['Q1 FY26', 43.00, 44.06], ['Q2 FY26', 45.00, 46.74], ['Q3 FY26', 54.00, 57.01], ['Q4 FY26', 65.00, 68.13],
  ['Q1 FY27', 78.00, 81.62],
];
var NEXT_GUIDE = ['Q2 FY27', 91.00]; // guided; reports ~Aug 2026.

// Forward consensus — Bloomberg sell-side aggregate (NVDA_BBG.xlsx), quarterly
// estimates summed to fiscal years. rev/ebitda/ni/fcf in $B; adj diluted EPS in $.
var CONS = [
  { fy:'FY2027E', rev:393.2, eps:9.02,  ebitda:267.4, ni:217.7, fcf:208.3, revYoY:'+82%' },
  { fy:'FY2028E', rev:559.8, eps:12.85, ebitda:382.4, ni:308.7, fcf:301.3, revYoY:'+42%' },
  { fy:'FY2029E', rev:684.7, eps:15.77, ebitda:477.2, ni:376.6, fcf:365.8, revYoY:'+22%' },
];

// Street consensus revenue estimate for each fiscal year, tracked over time — the
// "estimates kept climbing" story. Approximate monthly path reconstructed from the
// Fiscal.ai NVDA revenue-estimates chart; endpoints reconciled to Bloomberg/Summit. $B.
var EVOL_LABELS = ["Apr '23","Jul '23","Oct '23","Jan '24","Apr '24","Jul '24","Oct '24","Jan '25","Apr '25","Jul '25","Oct '25","Jan '26","Apr '26","Jun '26"];
var EVOL = {
  fy25:[42,58,78,95,108,118,125,130,null,null,null,null,null,null],
  fy26:[null,null,92,105,125,150,180,195,200,205,210,216,null,null],
  fy27:[null,null,null,null,null,null,null,null,245,260,295,320,360,388],
  fy28:[null,null,null,null,null,null,null,null,null,null,null,430,510,555],
};

// Summit's own revenue estimate revising across DCF snapshots (real data, Summit
// Financial Data MCP — NVDA:rev by fiscal year). BBG = consensus captured alongside.
// Only 3 snapshots so far; grows over time. $B.
var SNAP_DATES = ["Dec '25","Mar '26","May '26"];
var SUMMIT_REV = {
  fy26:[213.3,215.9,215.9],   // FY2026 — last point is the reported actual
  fy27:[337.4,358.4,390.3],
  fy28:[492.5,478.5,566.7],
  fy29:[567.3,594.9,705.2],
};
var SUMMIT_BBG27 = [316.9,357.5,384.7]; // FY2027 consensus, for the Summit-vs-Street compare

var _consCharts = [];
function destroyConsCharts(){ _consCharts.forEach(function(c){ if(c) c.destroy(); }); _consCharts = []; }

// Build all three Consensus-tab charts (called once when the tab is shown).
function initConsensus(){
  destroyConsCharts();
  // ── Chart A: estimate revision over time (multi-line, one line per fiscal year) ──
  var cvA = document.getElementById('nvdaEvolChart');
  if (cvA && typeof Chart !== 'undefined' && cvA.offsetParent){
    function line(label,data,hex){ return { label:label, data:data, borderColor:hex, backgroundColor:hex,
      borderWidth:2, pointRadius:0, pointHoverRadius:4, tension:0.25, spanGaps:false }; }
    _consCharts.push(new Chart(cvA.getContext('2d'), {
      type:'line',
      data:{ labels:EVOL_LABELS, datasets:[
        line('FY2025 estimate', EVOL.fy25, '#2D6A9F'),
        line('FY2026 estimate', EVOL.fy26, '#C0772C'),
        line('FY2027 estimate', EVOL.fy27, '#6E5BA8'),
        line('FY2028 estimate', EVOL.fy28, '#1F8A70'),
      ]},
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        interaction:{ mode:'nearest', intersect:false },
        plugins:{
          legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:10, color:'#5b6470' } },
          tooltip:{ callbacks:{ label:function(ctx){ return ctx.parsed.y==null? null : ctx.dataset.label+': $'+ctx.parsed.y+'B'; } } }
        },
        scales:{
          y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{size:10}, callback:function(v){ return '$'+v+'B'; } } },
          x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:10}, maxRotation:0, autoSkip:true, maxTicksLimit:8 } }
        }
      }
    }));
  }
  // ── Chart B: Summit estimate revisions across snapshots ──
  var cvB = document.getElementById('nvdaSnapChart');
  if (cvB && typeof Chart !== 'undefined' && cvB.offsetParent){
    function sline(label,data,hex,dash){ return { label:label, data:data, borderColor:hex, backgroundColor:hex,
      borderWidth:dash?2:2.5, borderDash:dash||[], pointRadius:4, pointHoverRadius:6, tension:0.15 }; }
    _consCharts.push(new Chart(cvB.getContext('2d'), {
      type:'line',
      data:{ labels:SNAP_DATES, datasets:[
        sline('FY2026 (→ actual)', SUMMIT_REV.fy26, '#C0772C'),
        sline('FY2027 · Summit',   SUMMIT_REV.fy27, '#6E5BA8'),
        sline('FY2027 · consensus', SUMMIT_BBG27,   '#b3a6d6', [5,4]),
        sline('FY2028 · Summit',   SUMMIT_REV.fy28, '#1F8A70'),
        sline('FY2029 · Summit',   SUMMIT_REV.fy29, '#2D6A9F'),
      ]},
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        interaction:{ mode:'nearest', intersect:false },
        plugins:{
          legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:8, color:'#5b6470' } },
          tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } }
        },
        scales:{
          y:{ beginAtZero:false, grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{size:10}, callback:function(v){ return '$'+v+'B'; } } },
          x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:11} } }
        }
      }
    }));
  }
  // ── Chart C: reported actual (bar) vs guidance midpoint (dot) with the ±2% range ──
  var cvC = document.getElementById('nvdaConsChart');
  if (cvC && typeof Chart !== 'undefined' && cvC.offsetParent){
    var labels = GUIDE.map(function(g){ return g[0]; });
    var guided = GUIDE.map(function(g){ return g[1]; });
    var actual = GUIDE.map(function(g){ return g[2]; });
    // NVIDIA guides revenue to a midpoint "± 2%"; draw that band as a capped whisker
    // around each guidance dot so you can see the range they actually committed to.
    var guideRange = { id:'guideRange', afterDatasetsDraw:function(chart){
      var x=chart.scales.x, y=chart.scales.y, ctx=chart.ctx; if(!x||!y) return;
      ctx.save(); ctx.strokeStyle='#5b6470'; ctx.lineWidth=1.5;
      guided.forEach(function(g,i){
        var cx=x.getPixelForValue(i), yHi=y.getPixelForValue(g*1.02), yLo=y.getPixelForValue(g*0.98), cap=5;
        ctx.beginPath();
        ctx.moveTo(cx,yHi); ctx.lineTo(cx,yLo);
        ctx.moveTo(cx-cap,yHi); ctx.lineTo(cx+cap,yHi);
        ctx.moveTo(cx-cap,yLo); ctx.lineTo(cx+cap,yLo);
        ctx.stroke();
      });
      ctx.restore();
    }};
    _consCharts.push(new Chart(cvC.getContext('2d'), {
      type:'bar',
      data:{ labels:labels, datasets:[
        { label:'Reported actual', type:'bar', data:actual, backgroundColor:'#1F8A70', maxBarThickness:30, order:3 },
        { label:'Guidance (midpoint ± 2%)', type:'line', data:guided, showLine:false, pointRadius:4.5, pointHoverRadius:7,
          pointBackgroundColor:'#5b6470', pointBorderColor:'#fff', pointBorderWidth:1.5, order:1 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{
          legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:8, color:'#5b6470' } },
          tooltip:{ mode:'index', intersect:false, callbacks:{
            label:function(ctx){
              if(ctx.dataset.type==='bar') return 'Reported: $'+ctx.parsed.y.toFixed(1)+'B';
              var g=guided[ctx.dataIndex];
              return 'Guidance: $'+g.toFixed(1)+'B  (± 2%: $'+(g*0.98).toFixed(1)+'–$'+(g*1.02).toFixed(1)+'B)';
            },
            afterBody:function(items){ var i=items[0].dataIndex, g=guided[i], a=actual[i];
              return 'Beat: +$'+(a-g).toFixed(2)+'B (+'+((a/g-1)*100).toFixed(1)+'%)'; } } }
        },
        scales:{
          y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{size:10}, callback:function(v){ return '$'+v+'B'; } } },
          x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{size:9}, maxRotation:0, autoSkip:false } }
        }
      },
      plugins:[guideRange]
    }));
  }
}

function consensusBody(){
  var beats = GUIDE.map(function(g){ return (g[2]/g[1]-1)*100; });
  var avgBeat = beats.reduce(function(a,b){ return a+b; },0)/beats.length;
  var h = '';
  h += '<p class="ov-lede">Three ways to see the same thing — <b>NVIDIA keeps beating the bar, and the bar keeps moving up</b>. First, how the Street’s revenue estimate for each fiscal year climbed over time. Then how the <b>Summit model</b>’s own estimate revised across our snapshots. Finally, the quarter-by-quarter <b>guidance-vs-actual</b> track record.</p>';

  // ── A · Estimate revision over time (the hero, like the uploaded Fiscal.ai chart) ──
  h += sec('How the estimate for each fiscal year climbed over time',
    '<div class="ov-chart-card"><div class="ov-chart-t">Street revenue estimate by fiscal year, tracked over time <span>(each line = consensus for one FY, revised as quarters printed)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaEvolChart"></canvas></div></div>'+
    '<div class="ov-callout">Every fiscal year tells the same story: the estimate <b>started low and was revised steadily upward</b> as NVIDIA out-delivered. FY2025 drifted from ~$40B to its $130.5B actual; FY2026 from ~$90B to $215.9B; FY2027 is still climbing toward ~$390B. Analysts have consistently <b>underestimated</b> the ramp. <span style="color:#8A93A0">Approximate path reconstructed from the Fiscal.ai consensus chart; endpoints reconciled to Bloomberg/Summit.</span></div>');

  // ── B · Summit's own estimate revisions across snapshots ──
  h += sec('Summit’s estimate, snapshot by snapshot',
    '<div class="ov-chart-card"><div class="ov-chart-t">Summit DCF revenue estimate by fiscal year, across our model snapshots <span>(FY2027 vs consensus dashed)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaSnapChart"></canvas></div></div>'+
    '<div class="ov-callout"><b>Our own model shows the same upward drift.</b> The Summit FY2027 estimate moved <b>$337B → $358B → $390B</b> across the Dec-2025, Mar-2026 and May-2026 snapshots — and sat <b>above Street consensus</b> at each one ($317B → $357B → $385B). On FY2026 we were close pre-print: the Dec-2025 snapshot modeled <b>$213.3B</b> and NVIDIA reported <b>$215.9B</b> (within 1.3%). Only three snapshots so far — this gets far more useful as the history builds.</div>');

  // ── KPIs + guidance-vs-actual dumbbell ──
  h += '<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Consecutive beats</div><div class="ov-kpi-v">'+GUIDE.length+'</div><div class="ov-kpi-d up">quarters · Q1 FY24 → Q1 FY27</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Average beat</div><div class="ov-kpi-v">+'+avgBeat.toFixed(1)+'%</div><div class="ov-kpi-d up">above the guided midpoint</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Latest · Q1 FY27</div><div class="ov-kpi-v">$81.6B</div><div class="ov-kpi-d up">vs $78.0B guide · +4.6%</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Next guide · Q2 FY27</div><div class="ov-kpi-v">$91.0B</div><div class="ov-kpi-d muted">reports ~Aug 2026</div></div>'+
    '</div>';
  h += sec('Guidance vs. reported revenue ($B)',
    '<div class="ov-chart-card"><div class="ov-chart-t">Reported revenue vs. the guidance NVIDIA gave <span>(green bar = reported actual · dot = guided midpoint · whisker = the ± 2% guided range)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaConsChart"></canvas></div></div>');
  var rows = GUIDE.map(function(g,i){
    return '<tr><td class="ov-td-name">'+esc(g[0])+'</td><td>$'+g[1].toFixed(1)+'B</td><td>$'+g[2].toFixed(1)+'B</td>'+
      '<td class="own-up">+$'+(g[2]-g[1]).toFixed(1)+'B</td><td class="own-up">+'+beats[i].toFixed(1)+'%</td></tr>';
  }).join('');
  rows += '<tr><td class="ov-td-name">'+esc(NEXT_GUIDE[0])+'</td><td>$'+NEXT_GUIDE[1].toFixed(1)+'B</td><td colspan="3" style="color:#8A93A0">guided — reports ~Aug 2026</td></tr>';
  h += sec('Beat track record',
    '<div style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Quarter</th><th>Guidance (mid)</th><th>Reported</th><th>Beat $</th><th>Beat %</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="ov-callout">NVIDIA guides total revenue to a midpoint "± 2%". The beat has <b>compressed</b> as the base has grown — from +20%+ in early FY24 to ~+3–5% recently — but it has stayed <b>positive every quarter</b>. The Q2 FY26 guide notably <b>excluded H20 China revenue</b> after export limits.</div>');
  var crows = CONS.map(function(c){
    return '<tr><td class="ov-td-name">'+esc(c.fy)+'</td><td>$'+c.rev.toFixed(1)+'B</td><td class="own-up">'+esc(c.revYoY)+'</td><td>$'+c.eps.toFixed(2)+'</td><td>$'+c.ebitda.toFixed(0)+'B</td><td>$'+c.fcf.toFixed(0)+'B</td></tr>';
  }).join('');
  h += sec('What consensus expects forward — Bloomberg sell-side aggregate',
    '<div style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Fiscal year</th><th>Revenue</th><th>YoY</th><th>Adj. dil. EPS</th><th>EBITDA</th><th>Free cash flow</th></tr></thead><tbody>'+crows+'</tbody></table></div>'+
    '<div class="ov-callout">Consensus has revenue compounding from <b>$215.9B (FY2026 actual)</b> to <b>~$685B by FY2029</b> — still +82% next year, decelerating to ~+22% by FY2029 as the base scales. Adjusted EPS roughly <b>triples</b> ($9.0 → $15.8). These are Bloomberg’s aggregate of sell-side estimates — the benchmark NVIDIA is measured against, not company guidance.</div>');
  h += '<div class="ov-foot">Estimate-evolution path approximated from the Fiscal.ai NVDA consensus chart (endpoints reconciled to Bloomberg/Summit). Summit snapshot estimates are real Summit DCF model facts (NVDA:rev, snapshots Dec-2025 / Mar-2026 / May-2026). Guidance = NVIDIA quarterly revenue outlook midpoint (press releases); actuals = reported revenue. Forward figures are Bloomberg consensus (NVDA_BBG.xlsx) summed to fiscal years. Fiscal year ends late January. All figures in US dollars.</div>';
  return h;
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
var VAL_SHARES_B  = 24.39;    // diluted shares, billions (BBG, latest reported ~Q1 FY27)
var VAL_NETCASH_B = 109.2;    // net cash, $B (BBG, latest reported ~Q1 FY27)

// Per-fiscal-year model bases. The two live variables are revenue growth and adj. gross
// margin; opex / D&A / the net-income-to-EBIT ratio are held at consensus (NVDA's cost
// base barely moves vs revenue). At the base growth & margin each row reproduces the
// Bloomberg consensus rev / EBITDA / EPS. $B unless noted.
var VAL_BASE = [
  { fy:'FY2027', priorRev:215.9, baseGM:0.750, opex:33.8, da:6.3,  niRatio:0.843, baseG:0.821, gMin:0.30, gMax:1.20 },
  { fy:'FY2028', priorRev:393.2, baseGM:0.743, opex:43.3, da:9.8,  niRatio:0.841, baseG:0.424, gMin:0.10, gMax:0.80 },
  { fy:'FY2029', priorRev:559.8, baseGM:0.733, opex:53.5, da:28.8, niRatio:0.858, baseG:0.223, gMin:0.00, gMax:0.50 },
];
var MULT_CFG = {
  pe:       { lbl:'P/E',        min:10, max:60, step:0.5, def:33 },
  evebitda: { lbl:'EV/EBITDA',  min:8,  max:45, step:0.5, def:22 },
  evsales:  { lbl:'EV/Sales',   min:5,  max:30, step:0.5, def:15 },
};
// Calculator state.
var _valYear=0, _valG=VAL_BASE[0].baseG, _valGM=VAL_BASE[0].baseGM,
    _valMtype='pe', _valMult=MULT_CFG.pe.def, _valPrice=null;

function valBig(b){ if(b==null) return '—'; return b>=1000 ? '$'+(b/1000).toFixed(2)+'T' : '$'+b.toFixed(0)+'B'; }
// Run the case model for fiscal year yr at growth g and gross margin gm. $B / $-EPS.
function valCase(yr,g,gm){
  var b=VAL_BASE[yr], rev=b.priorRev*(1+g), gp=rev*gm, ebit=gp-b.opex,
      ebitda=ebit+b.da, ni=ebit*b.niRatio, eps=ni/VAL_SHARES_B;
  return { rev:rev, gp:gp, ebit:ebit, ebitda:ebitda, ni:ni, eps:eps };
}
// Implied share price for a given multiple type & value, off a computed case.
function valPriceFor(type,c,mult){
  if(type==='pe')       return mult*c.eps;
  if(type==='evebitda') return (mult*c.ebitda + VAL_NETCASH_B)/VAL_SHARES_B;
  return (mult*c.rev + VAL_NETCASH_B)/VAL_SHARES_B; // evsales
}
// The multiple the *current* price implies, for seeding the slider "at market".
function valMultAt(type,c,price){
  if(price==null) return null;
  if(type==='pe')       return price/c.eps;
  if(type==='evebitda') return (price*VAL_SHARES_B - VAL_NETCASH_B)/c.ebitda;
  return (price*VAL_SHARES_B - VAL_NETCASH_B)/c.rev; // evsales
}

function valTile(label,val,sub){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(label)+'</div><div class="ov-kpi-v">'+val+'</div><div class="ov-kpi-d '+(sub.dir||'muted')+'">'+sub.txt+'</div></div>'; }
function valDelta(now,base){ var d=(now/base-1)*100; if(Math.abs(d)<0.05) return {txt:'= consensus',dir:'muted'};
  return { txt:(d>=0?'+':'−')+Math.abs(d).toFixed(0)+'% vs consensus', dir:d>=0?'up':'down' }; }

// Recompute everything from state and paint the calculator.
function valCompute(){
  var b=VAL_BASE[_valYear];
  var base=valCase(_valYear, b.baseG, b.baseGM);   // consensus reference
  var c=valCase(_valYear, _valG, _valGM);          // current case
  // Slider read-out labels
  var gv=document.getElementById('nvValGv'); if(gv) gv.textContent=(_valG>=0?'+':'−')+Math.abs(_valG*100).toFixed(0)+'%';
  var gmv=document.getElementById('nvValGMv'); if(gmv) gmv.textContent=(_valGM*100).toFixed(1)+'%';
  var mv=document.getElementById('nvValMultv'); if(mv) mv.textContent=_valMult.toFixed(1)+'×';
  var ml=document.getElementById('nvValMultLbl'); if(ml) ml.textContent=MULT_CFG[_valMtype].lbl+' ×';
  // Case output tiles
  var out=document.getElementById('nvValOut');
  if(out) out.innerHTML=
    valTile('Revenue', valBig(c.rev), valDelta(c.rev,base.rev))+
    valTile('EBITDA', valBig(c.ebitda), valDelta(c.ebitda,base.ebitda))+
    valTile('Net income', valBig(c.ni), valDelta(c.ni,base.ni))+
    valTile('Adj. EPS', '$'+c.eps.toFixed(2), valDelta(c.eps,base.eps));
  // Implied price from the chosen multiple
  var price=valPriceFor(_valMtype,c,_valMult);
  var mc=price*VAL_SHARES_B;
  var pe=document.getElementById('nvValPrice'); if(pe) pe.textContent='$'+price.toFixed(0);
  var mcEl=document.getElementById('nvValMc'); if(mcEl) mcEl.textContent=valBig(mc);
  var up=document.getElementById('nvValUp');
  if(up){ if(_valPrice!=null){ var u=(price/_valPrice-1)*100;
      up.innerHTML='vs current $'+_valPrice.toFixed(0)+' → <b class="'+(u>=0?'own-up':'own-dn')+'">'+(u>=0?'+':'−')+Math.abs(u).toFixed(0)+'%</b>';
    } else { up.innerHTML='<span style="color:#8A93A0">enter or sign in for a current price to see upside</span>'; } }
}

// Update slider min/max/value to match the active year (growth) and multiple type.
function valSyncSliders(){
  var b=VAL_BASE[_valYear];
  var gs=document.getElementById('nvValG'); if(gs){ gs.min=b.gMin; gs.max=b.gMax; gs.step=0.01; gs.value=_valG; }
  var gms=document.getElementById('nvValGM'); if(gms){ gms.min=0.60; gms.max=0.80; gms.step=0.005; gms.value=_valGM; }
  var cfg=MULT_CFG[_valMtype], ms=document.getElementById('nvValMult');
  if(ms){ ms.min=cfg.min; ms.max=cfg.max; ms.step=cfg.step; ms.value=_valMult; }
}

function valuationBody(){
  var h = '';
  h += '<p class="ov-lede">A two-step calculator. <b>Build a case</b> by moving the only two variables that really swing NVIDIA — revenue growth and gross margin (opex and the rest are held at consensus) — then <b>apply a multiple</b> to see the price it implies. Defaults reproduce Bloomberg consensus.</p>';
  h += '<div class="ov-live" id="nvValLive" hidden></div>';

  // Step 1 — case builder
  h += sec('1 · Build a case',
    '<div class="nv-seg-bar"><span class="nv-seg-lbl">Fiscal year</span>'+
      '<div class="nv-seg-toggle" id="nvValYear">'+
        '<button type="button" class="nv-seg-btn active" data-valyr="0">FY2027</button>'+
        '<button type="button" class="nv-seg-btn" data-valyr="1">FY2028</button>'+
        '<button type="button" class="nv-seg-btn" data-valyr="2">FY2029</button>'+
      '</div></div>'+
    '<div class="nv-cal-grid">'+
      '<div class="nv-cal-sl"><div class="nv-cal-sl-h">Revenue growth (YoY) <b id="nvValGv">+82%</b></div>'+
        '<input type="range" id="nvValG" style="width:100%;accent-color:var(--brand,#1F8A70)"></div>'+
      '<div class="nv-cal-sl"><div class="nv-cal-sl-h">Adj. gross margin <b id="nvValGMv">75.0%</b></div>'+
        '<input type="range" id="nvValGM" style="width:100%;accent-color:var(--brand,#1F8A70)"></div>'+
    '</div>'+
    '<div class="ov-kpis" id="nvValOut" style="margin-top:4px"></div>'+
    '<div class="ov-asof" style="margin-top:6px">Holds at consensus: opex, D&amp;A, net-interest &amp; tax structure, and ~24.39B shares. EBITDA = gross profit − opex + D&amp;A; net income scales with operating income. Bases reproduce Bloomberg consensus at the default growth &amp; margin.</div>');

  // Step 2 — multiple → price
  h += sec('2 · Apply a multiple → implied price',
    '<div class="nv-seg-bar"><span class="nv-seg-lbl">Multiple</span>'+
      '<div class="nv-seg-toggle" id="nvValMtype">'+
        '<button type="button" class="nv-seg-btn active" data-valmt="pe">P / E</button>'+
        '<button type="button" class="nv-seg-btn" data-valmt="evebitda">EV / EBITDA</button>'+
        '<button type="button" class="nv-seg-btn" data-valmt="evsales">EV / Sales</button>'+
      '</div></div>'+
    '<div class="nv-cal-grid">'+
      '<div class="nv-cal-sl"><div class="nv-cal-sl-h"><span id="nvValMultLbl">P/E ×</span> <b id="nvValMultv">33.0×</b></div>'+
        '<input type="range" id="nvValMult" style="width:100%;accent-color:var(--brand,#1F8A70)"></div>'+
      '<div class="nv-cal-px"><span class="nv-cal-lbl">Current price (for upside)</span>'+
        '<span class="sotp-field-in" style="display:inline-flex;align-items:center;border:1px solid #d8dee6;border-radius:8px;padding:3px 10px;background:#fff">'+
        '<span style="color:#8A93A0;font-weight:700;margin-right:2px">$</span>'+
        '<input id="nvValPx" type="number" step="0.01" min="0" inputmode="decimal" placeholder="—" style="width:78px" /></span></div>'+
    '</div>'+
    '<div class="nv-cal-result"><div class="nv-cal-res-l">Implied price</div>'+
      '<div class="nv-cal-res-v" id="nvValPrice">$—</div>'+
      '<div class="nv-cal-res-s">implied market cap <b id="nvValMc">—</b> · <span id="nvValUp"></span></div></div>'+
    '<div class="ov-callout">Move the multiple to value the case you built. <b>P/E</b> → price = multiple × EPS. <b>EV/EBITDA</b> and <b>EV/Sales</b> → enterprise value = multiple × metric, then add $109.2B net cash and divide by shares. The current-price field auto-fills from the live quote when signed in.</div>');

  // Summit DCF + still-to-add
  h += sec('Summit DCF — forward view',
    '<div class="ov-targets">'+DCF_TARGETS.map(function(b){
      return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-callout">The Summit team’s internal DCF (Summit Financial Data, synced June 2026) — an in-house estimate, not guidance or consensus, on a very aggressive AI-demand scenario. FY2026 actual ($215.9B) landed in line with the model; Q1 FY2027 printed $81.6B (above the $78.0B guide), with Q2 guided to $91.0B.</div>');
  h += '<div class="ov-foot">Calculator is a simplified operating model: revenue growth and gross margin are live; opex, D&amp;A and the net-income-to-EBIT relationship are held at the Bloomberg-consensus level for each year (NVDA_BBG.xlsx). Shares ~24.39B and net cash ~$109.2B from the latest reported balance sheet. EPS is adjusted (ex-SBC). Implied prices are illustrative, not price targets. Live price via Massive (requires a signed-in session). All figures in US dollars; fiscal year ends late January.</div>';
  return h;
}

// Wire toggles, sliders and the price field; seed the live quote; first paint.
function initValuation(){
  var root=document.querySelector('.ov-nvda'); if(!root) return;
  var pane=root.querySelector('.ovt-pane[data-ovt="valuation"]'); if(!pane) return;
  if(!pane._w){ pane._w=1;
    pane.querySelectorAll('#nvValYear .nv-seg-btn').forEach(function(btn){ btn.onclick=function(){
      pane.querySelectorAll('#nvValYear .nv-seg-btn').forEach(function(x){ x.classList.toggle('active', x===btn); });
      _valYear=parseInt(btn.getAttribute('data-valyr'),10);
      _valG=VAL_BASE[_valYear].baseG; _valGM=VAL_BASE[_valYear].baseGM;
      var c=valCase(_valYear,_valG,_valGM); var m=valMultAt(_valMtype,c,_valPrice);
      _valMult=(m!=null)? Math.max(MULT_CFG[_valMtype].min, Math.min(MULT_CFG[_valMtype].max, m)) : MULT_CFG[_valMtype].def;
      valSyncSliders(); valCompute();
    }; });
    pane.querySelectorAll('#nvValMtype .nv-seg-btn').forEach(function(btn){ btn.onclick=function(){
      pane.querySelectorAll('#nvValMtype .nv-seg-btn').forEach(function(x){ x.classList.toggle('active', x===btn); });
      _valMtype=btn.getAttribute('data-valmt');
      var c=valCase(_valYear,_valG,_valGM); var m=valMultAt(_valMtype,c,_valPrice);
      _valMult=(m!=null)? Math.max(MULT_CFG[_valMtype].min, Math.min(MULT_CFG[_valMtype].max, m)) : MULT_CFG[_valMtype].def;
      valSyncSliders(); valCompute();
    }; });
    var gs=pane.querySelector('#nvValG'); if(gs) gs.addEventListener('input', function(){ _valG=parseFloat(gs.value); valCompute(); });
    var gms=pane.querySelector('#nvValGM'); if(gms) gms.addEventListener('input', function(){ _valGM=parseFloat(gms.value); valCompute(); });
    var ms=pane.querySelector('#nvValMult'); if(ms) ms.addEventListener('input', function(){ _valMult=parseFloat(ms.value); valCompute(); });
    var px=pane.querySelector('#nvValPx'); if(px) px.addEventListener('input', function(){
      var v=parseFloat(px.value); _valPrice=(isFinite(v)&&v>0)? v : null; valRenderLive(); valCompute(); });
  }
  valSyncSliders(); valRenderLive(); valCompute();
  if(_valPrice==null){
    import('../api.js').then(function(api){ return api.liveQuote('NVDA'); }).then(function(res){
      var q=res&&res.data; if(!q||q.price==null) return;
      _valPrice=q.price;
      var px=document.getElementById('nvValPx'); if(px && !px.value) px.value=q.price.toFixed(2);
      // Seed the multiple slider to "at market" for the current case/type.
      var c=valCase(_valYear,_valG,_valGM), m=valMultAt(_valMtype,c,_valPrice);
      if(m!=null){ _valMult=Math.max(MULT_CFG[_valMtype].min, Math.min(MULT_CFG[_valMtype].max, m)); }
      valSyncSliders(); valRenderLive(); valCompute();
    }).catch(function(){});
  }
}
function valRenderLive(){
  var lv=document.getElementById('nvValLive'); if(!lv) return;
  if(_valPrice==null){ lv.hidden=true; lv.innerHTML=''; return; }
  var mc=_valPrice*VAL_SHARES_B, ev=mc-VAL_NETCASH_B;
  lv.hidden=false;
  lv.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">NVDA</span>'+
    '<span class="ov-live-px">$'+_valPrice.toFixed(2)+'</span>'+
    '<span class="ov-live-mc">'+valBig(mc)+' mkt cap</span>'+
    '<span class="ov-live-mc">'+valBig(ev)+' EV</span>'+
    '<span class="ov-live-mc">net cash $'+VAL_NETCASH_B.toFixed(0)+'B</span>'+
    '<span class="ov-live-mc">'+VAL_SHARES_B.toFixed(2)+'B sh</span>';
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
  if (key === 'management') requestAnimationFrame(function(){ initManagement(); });
  if (key === 'consensus') requestAnimationFrame(function(){ initConsensus(); });
  if (key === 'valuation') requestAnimationFrame(function(){ initValuation(); });
  if (key === 'overview') requestAnimationFrame(function(){ initOverview(); });
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
  // Overview is the default active tab — wire its chips / cards / hero on load.
  requestAnimationFrame(function(){ initOverview(); });
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'industry') requestAnimationFrame(function(){ semiIndustry.init(); });
}

export var nvidiaOverview = { html: html, init: init };
