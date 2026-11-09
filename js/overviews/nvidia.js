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
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { makeManagement } from './management.js';                      // Management ▸ Executives & Board (MG-TEAM)
import { NVDA_MGMT_DATA } from './nvda-mgmt-data.js';
import { nvdaOwnBody, nvdaOwnInit } from './nvda-own.js';              // Management ▸ Ownership (MG-OWN)
import { nvdaGovBody } from './nvda-gov.js';                           // Management ▸ Governance & SBC (MG-GOV)
import { nvdaTrackBody, nvdaTrackPop } from './nvda-track.js';          // Management ▸ Track Record (MG-TRACK)
import { SUMMIT_CAT } from '../viz-palette.js';
import { nvdaBlGeneralHtml, nvdaBlGeneralBuild } from './nvda-bl.js';   // Bottom Line ▸ General (BL-GEN-1…5)
import { nvdaCeHtml, nvdaCeWire, nvdaCeBuild, nvdaCePop } from './nvda-ce.js';   // Evolution ▸ Earnings ▸ Setup (EV-SET), copy of lyft-ce.js
var NVDA_MGMT = makeManagement(Object.assign({ brand:SUMMIT_CAT[0] }, NVDA_MGMT_DATA));
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line (engine + js/segments-data/nvda.js)   // Evolution ▸ Results (engine + js/results-data/nvda.js)

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

// OV-F (playbook §8): the Overview's only footer; the collapsibles carry none of their own. Replaces the old SOURCES
// (B2 #9), which cited a Summit model synced Jun 4 2026 — the Overview no longer shows any Summit figure.
var OV_SOURCES = 'Sources — NVIDIA FY2026 Form 10-K (SEC EDGAR, filed Feb 25, 2026) for revenue, segment, geographic, margin, customer and headcount figures; the FY2024 10-K, NVIDIA investor-relations press releases and the 2026 proxy statement for history and leadership; NVIDIA product pages for products. Peer figures from each company’s latest Form 10-K (SEC EDGAR, as of Nov 2026) and, for NVIDIA’s forward multiples, Bloomberg consensus FY2027 (as of Sep 9, 2026). Market cap and peer multiples are live (Massive price ÷ those figures). Forward figures are estimates, not company guidance.';
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
// OV-3 2×2 (playbook §8: one .q2 table, ≤ 30 words per cell; only "How it earns" has numbers). FY2026 10-K
// (acc. 0001045810-26-000021): revenue by market platform (Data Center 193,737 · Gaming 16,042 · ProViz 3,191 ·
// Automotive 2,349 · OEM & Other 619 of 215,938), Note 17 segments (operating income: Compute & Networking 130,141 ·
// Graphics 9,156 of 139,297), and the concentration note (direct customers = ODMs, OEMs, distributors…; indirect =
// CSPs, neocloud builders, AI model makers, enterprises, public sector). Replaces the old BIZ cards (B2 #4).
var STD_BIZ = [
  ['What it sells','GPUs, CPUs and networking chips, sold on their own or as complete rack-scale data-center systems, plus the CUDA software platform and libraries developers build on.'],
  ['Who buys it','Bought directly by system makers and distributors (ODMs, OEMs, add-in-board makers); the end customers are cloud providers, neocloud builders, AI model makers, enterprises and governments.'],
  ['How it earns','FY2026: ~90% Data Center · ~7% Gaming · ~3% ProViz, Automotive &amp; OEM — and Compute &amp; Networking earns ~93% of segment operating income ($130.1B of $139.3B).'],
  ['The edge','A full stack designed together — CUDA and its libraries, networking (NVLink, InfiniBand, Spectrum-X) and complete systems — so customers buy a platform rather than a chip.'],
];
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

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
        '<span class="ov-live-kv">Mkt cap <b id="nvMultMc">—</b></span>'+
        '<span class="ov-live-kv">EV <b id="nvMultEv">—</b></span></div>'+
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
// OV-2 lede (playbook §8: 2–4 sentences, ~50–80 words, no numbers, neutral; no segments, customers or moat — each has
// its own block). Paraphrased from the FY2026 10-K, Item 1 ("Our Company"). It replaces the old expandable DESC (B2 #3):
// DESC's moat sentence is the 2×2 "The edge" (OV-3), its supplier sentence (TSMC, SK hynix, Foxconn) goes to
// Bottom Line ▸ Supply Chain, and Mellanox to the Timeline (OV-7). DESC stays below until those units are approved.
var NV_LEDE = 'NVIDIA designs accelerated-computing platforms: graphics processors, central processors and networking chips, sold on their own or built into complete data-center systems, together with the software developers use to program them. The company started in graphics for video games and now describes itself as a data center scale AI infrastructure company. It is fabless — it designs the chips and systems, and partners manufacture and assemble them.';
function stdLede(){ return '<p class="ov-lede">'+esc(NV_LEDE)+'</p>'; }

function descBox(){
  return '<div class="ovlr-desc" data-desc>'+
    '<p class="ovlr-desc-txt" id="nvDescTxt">'+esc(DESC)+'</p>'+
    '<button type="button" class="ovlr-desc-more" id="nvDescMore">Read more ▾</button>'+
  '</div>';
}

// ── 5 · Products body (cards + lightbox; header supplied by the box) ─────────────
function productsBody(){
  return '<div class="ovlr-prod">'+
    '<p class="ovlr-money-p">NVIDIA doesn’t sell a single chip — it sells the whole <b>stack of accelerated computing</b>. The four below trace that stack from the bottom up: the GPU <b>silicon</b> NVIDIA designs, the CPU+GPU <b>modules</b> built from it, the <b>networking</b> that fuses thousands of GPUs into one machine, and the complete rack-scale <b>“AI factory”</b> it increasingly ships whole. Sitting on top of all of it — and the real moat — is the <b>CUDA</b> software every AI model is written for.</p>'+
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
// Per-segment explanation — makes the doughnut readable and ties each revenue slice
// back to the products above. Shown in "By segment" mode. Colors match the chart.
var MONEY_SEG_CARDS = [
  { name:'Hyperscale', dot:'#1F8A70', rev:'$105.6B', yoy:'+96% YoY',
    desc:'The public clouds and largest consumer-internet companies — Microsoft, Amazon, Google, Meta. They buy <b>GB300 NVL72 racks</b> and <b>Grace Blackwell superchips</b> at massive scale to train and serve frontier AI. About half of Data Center, and the fastest-growing slice.',
    prod:'GB300 NVL72 · Superchip · networking · Blackwell silicon' },
  { name:'ACIE — AI Clouds, Industrial & Enterprise', dot:'#5cc0a6', rev:'$88.1B', yoy:'+44% YoY',
    desc:'Purpose-built “AI factories” outside the mega-clouds — enterprises, industries and <b>sovereign-AI</b> buyers standing up their own accelerated data centers. Same product stack as Hyperscale, different customers.',
    prod:'Same Data-Center stack as above' },
  { name:'Edge Computing', dot:'#2D6A9F', rev:'$22.2B', yoy:'+45% YoY',
    desc:'On-device and physical AI: <b>GeForce / RTX</b> gaming, <b>Omniverse</b> & pro-viz workstations, <b>DRIVE</b> automotive and <b>Jetson / Isaac</b> robotics. In FY2027 NVIDIA folded these once-separate platforms into one line.',
    prod:'Consumer & embedded — not pictured above' },
];
function moneySegCards(){
  return '<div class="ovlr-mseg">'+MONEY_SEG_CARDS.map(function(s){
    return '<div class="ovlr-mseg-card">'+
      '<div class="ovlr-mseg-h"><span class="ovlr-mseg-dot" style="background:'+s.dot+'"></span>'+
        '<span class="ovlr-mseg-nm">'+esc(s.name)+'</span>'+
        '<span class="ovlr-mseg-rev">'+esc(s.rev)+' <em>'+esc(s.yoy)+'</em></span></div>'+
      '<div class="ovlr-mseg-d">'+s.desc+'</div>'+
      '<div class="ovlr-mseg-prod">↳ '+s.prod+'</div>'+
    '</div>';
  }).join('')+'</div>';
}
var MONEY_REG_DETAIL = '<p class="ovlr-mseg-note">Geography is approximate and by <b>billing</b> location, not end-demand — much of the “Singapore” and “Taiwan” revenue is product invoiced to systems partners (Foxconn and others) that assemble racks for customers elsewhere. Summit has no regional data; to be refined with exact FY2026 10-K figures.</p>';
var _moneyMode = 'segment', _moneyChart = null;
function moneyBody(){
  return '<p class="ovlr-money-p">About <b>90% of NVIDIA’s revenue is Data Center</b> — selling AI training and inference compute to whoever is building AI. In FY2027 NVIDIA re-cut that business by <b>customer type</b>: <b>Hyperscale</b> (the big clouds) versus <b>ACIE</b> (everyone else building AI factories), and folded gaming, pro-viz, auto and robotics into a single smaller <b>Edge Computing</b> line. The mix has shifted dramatically — Data Center was ~25% of sales seven years ago and is ~90% today. The cards below explain each segment and tie it back to the products above.</p>'+
    '<div class="ovlr-seg" id="nvMoneyToggle">'+
      '<button type="button" class="ovlr-seg-b active" data-money="segment">By segment</button>'+
      '<button type="button" class="ovlr-seg-b" data-money="region">By region</button>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t" id="nvMoneyTitle">'+MONEY_SEG.title+'</div>'+
    '<div class="ov-chart-wrap"><canvas id="nvMoneyChart"></canvas></div></div>'+
    '<div class="ovlr-money-note" id="nvMoneyNote">'+MONEY_SEG.note+'</div>'+
    '<div id="nvMoneyDetail">'+moneySegCards()+'</div>';
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

// ── 6.5 · Margins (interactive trend) ────────────────────────────────────────────
// Margins as % of revenue, fiscal years (NVDA FY ends late January).
//   Gross / Operating / Net  = NVIDIA reported GAAP (Summit's gross/op history lines
//     are unreliable, so these come straight from the 10-K / press releases).
//   EBITDA / CFO / FCF        = Summit DCF model for FY22+ (snapshot 2026-05-26);
//     FY19–FY21 computed from reported statements (op income + D&A; CFO − capex).
//   FY27E                     = Summit projection for the CURRENT fiscal year — the
//     only forward point; the chart never projects past it.
var MARGIN_METRICS = [
  { key:'gross',  label:'Gross',     color:'#76B900' },
  { key:'oper',   label:'Operating', color:'#2F80ED' },
  { key:'net',    label:'Net',       color:'#7A5AF8' },
  { key:'ebitda', label:'EBITDA',    color:'#12B5A5' },
  { key:'cfo',    label:'CFO',       color:'#F2A73B' },
  { key:'fcf',    label:'FCF',       color:'#EB5757' },
];
// FY27E projection (Summit model) — always appended after the actual-year history,
// whatever the source of that history. The chart never projects past this one point.
var MARGIN_PROJ = { fy:'FY27E', gross:74.1, oper:65.2, net:54.7, ebitda:66.9, cfo:53.1, fcf:51.1, proj:true };
// Verified fallback history (GAAP for gross/op/net; Summit for EBITDA/CFO/FCF). Used
// until the live Massive pull returns — then swapped for Massive-computed history.
var MARGIN_FALLBACK = [
  { fy:'FY19',  gross:61.2, oper:32.5, net:35.3, ebitda:34.7, cfo:31.9, fcf:26.8 },
  { fy:'FY20',  gross:62.0, oper:26.1, net:25.6, ebitda:29.6, cfo:43.6, fcf:39.1 },
  { fy:'FY21',  gross:62.3, oper:27.2, net:26.0, ebitda:33.8, cfo:34.9, fcf:28.1 },
  { fy:'FY22',  gross:64.9, oper:37.3, net:36.2, ebitda:46.1, cfo:39.7, fcf:36.0 },
  { fy:'FY23',  gross:56.9, oper:15.7, net:16.2, ebitda:32.9, cfo:37.2, fcf:30.4 },
  { fy:'FY24',  gross:72.7, oper:54.1, net:48.9, ebitda:58.6, cfo:53.8, fcf:52.1 },
  { fy:'FY25',  gross:75.0, oper:62.4, net:55.8, ebitda:65.2, cfo:53.7, fcf:51.3 },
  { fy:'FY26',  gross:71.1, oper:60.4, net:55.6, ebitda:63.1, cfo:54.1, fcf:51.3 },
];
var MRG_NOTE_FALLBACK = 'Gross, operating &amp; net margins: NVIDIA reported <b>GAAP</b>. EBITDA, CFO &amp; FCF margins: <b>Summit</b> model (FY22+; FY19–21 from reported statements). <b>FY27E</b> = Summit projection for the current fiscal year. <span style="color:#B7791F">Live Massive feed pending edge-function deploy.</span>';
var MRG_NOTE_MASSIVE  = 'Historical margins computed <b>live from Massive</b> (income &amp; cash-flow statements): gross/op/net = line ÷ revenue; EBITDA = (op income + D&amp;A) ÷ revenue; CFO &amp; FCF ÷ revenue. <b>FY27E</b> = Summit projection for the current fiscal year — the only forward point.';
// prefix _mrg — _mg* is already taken by the Management org chart.
// _mrgData = full history (ascending) + the projection last. _mrgStart/_mrgEnd are the
// visible window (inclusive indices into _mrgData); the range slider drives them.
var _mrgSel = { gross:true, oper:true, net:true, ebitda:false, cfo:false, fcf:false };
var _mrgData = MARGIN_FALLBACK.concat([MARGIN_PROJ]);
var _mrgStart = 0, _mrgEnd = 0, _mrgChart = null, _mrgSource = 'fallback';
// Default window: last 5 ACTUAL years + the projection point.
function mrgDefaultWindow(){
  var n = _mrgData.length;
  var lastActual = (n && _mrgData[n-1].proj) ? n-2 : n-1;
  return [ Math.max(0, lastActual - 4), n-1 ];
}
function marginsBody(){
  var chips = MARGIN_METRICS.map(function(m){
    return '<button type="button" class="ovlr-mg-chip'+(_mrgSel[m.key]?' on':'')+'" data-mg="'+m.key+'" style="--mg:'+m.color+'">'+
      '<span class="ovlr-mg-dot"></span>'+esc(m.label)+'</button>';
  }).join('');
  return '<p class="ovlr-money-p">Profitability &amp; cash margins as a % of revenue. Tap any line to toggle it on or off. Drag the <b>range slider</b> below the chart to widen or shift the years shown — the last point (<b>FY27E</b>) is the projection for the current fiscal year.</p>'+
    '<div class="ovlr-mg-chips" id="nvMgChips">'+chips+'</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of revenue) <span>· fiscal years · FY27E = projection</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvMgChart"></canvas></div></div>'+
    '<div class="ovlr-mg-slider" id="nvMgSlider"></div>'+
    '<div class="ovlr-money-note" id="nvMgNote">'+MRG_NOTE_FALLBACK+'</div>';
}
// Render the range slider (Fiscal.ai-style brush): a rail with a draggable selected
// window + two edge handles, and a year tick label under each data point.
function renderMrgSlider(){
  var el = document.getElementById('nvMgSlider'); if (!el) return;
  var n = _mrgData.length; if (n < 2){ el.innerHTML=''; return; }
  var pos = function(i){ return (i/(n-1))*100; };
  var lp = pos(_mrgStart), rp = pos(_mrgEnd);
  var ticks = _mrgData.map(function(r,i){
    var on = (i>=_mrgStart && i<=_mrgEnd);
    return '<span class="ovlr-mg-tick'+(on?' in':'')+(r.proj?' proj':'')+'">'+esc(r.fy)+'</span>';
  }).join('');
  el.innerHTML =
    '<div class="ovlr-mg-rail">'+
      '<div class="ovlr-mg-fill" style="left:'+lp+'%;right:'+(100-rp)+'%"></div>'+
      '<span class="ovlr-mg-handle" data-h="start" style="left:'+lp+'%" role="slider" tabindex="0" aria-label="range start"></span>'+
      '<span class="ovlr-mg-handle" data-h="end" style="left:'+rp+'%" role="slider" tabindex="0" aria-label="range end"></span>'+
    '</div>'+
    '<div class="ovlr-mg-ticks">'+ticks+'</div>';
}
// Pointer-driven drag for the slider (handles + pan the window + click-to-move).
function wireMrgSlider(pane){
  var slider = pane.querySelector('#nvMgSlider'); if (!slider || slider._w) return; slider._w = 1;
  var drag = null;
  function idxFromX(clientX){
    var rail = slider.querySelector('.ovlr-mg-rail'); if (!rail) return _mrgStart;
    var rect = rail.getBoundingClientRect();
    var f = (clientX - rect.left) / Math.max(1, rect.width);
    return Math.round(Math.max(0, Math.min(1, f)) * (_mrgData.length - 1));
  }
  slider.addEventListener('pointerdown', function(e){
    var h = e.target.closest('.ovlr-mg-handle');
    if (h){ drag = { which:h.getAttribute('data-h') }; }
    else if (e.target.closest('.ovlr-mg-fill')){ drag = { which:'pan', anchor:idxFromX(e.clientX), s0:_mrgStart, e0:_mrgEnd }; }
    else { // click on the rail: move the nearer handle to that year
      var i = idxFromX(e.clientX);
      if (Math.abs(i-_mrgStart) <= Math.abs(i-_mrgEnd)) _mrgStart = Math.min(i, _mrgEnd-1);
      else _mrgEnd = Math.max(i, _mrgStart+1);
      renderMrgSlider(); buildMarginChart(); return;
    }
    try { slider.setPointerCapture(e.pointerId); } catch(_){}
    e.preventDefault();
  });
  slider.addEventListener('pointermove', function(e){
    if (!drag) return;
    var i = idxFromX(e.clientX), n = _mrgData.length;
    if (drag.which === 'start') _mrgStart = Math.max(0, Math.min(i, _mrgEnd-1));
    else if (drag.which === 'end') _mrgEnd = Math.min(n-1, Math.max(i, _mrgStart+1));
    else if (drag.which === 'pan'){ var w = drag.e0-drag.s0, ns = Math.max(0, Math.min(drag.s0 + (i-drag.anchor), n-1-w)); _mrgStart = ns; _mrgEnd = ns+w; }
    renderMrgSlider(); buildMarginChart();
  });
  function endDrag(e){ if (drag){ try { slider.releasePointerCapture(e.pointerId); } catch(_){} drag = null; } }
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
}
// Try to replace the fallback history with margins computed live from Massive.
function loadMassiveMargins(){
  import('../api.js').then(function(api){ return api.fetchMargins ? api.fetchMargins('NVDA') : null; }).then(function(res){
    if (!res || !res.success || !res.data || res.data.length < 3) return;   // keep fallback
    _mrgData = res.data.concat([MARGIN_PROJ]);
    _mrgSource = 'massive';
    var w = mrgDefaultWindow(); _mrgStart = w[0]; _mrgEnd = w[1];
    var note = document.getElementById('nvMgNote'); if (note) note.innerHTML = MRG_NOTE_MASSIVE;
    renderMrgSlider(); buildMarginChart();
  }).catch(function(){ /* keep fallback */ });
}
function buildMarginChart(){
  var cv = document.getElementById('nvMgChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_mrgChart){ _mrgChart.destroy(); _mrgChart = null; }
  var rows = _mrgData.slice(_mrgStart, _mrgEnd + 1);
  var projIdx = rows.reduce(function(acc,r,i){ return r.proj ? i : acc; }, -1);  // dash into projection
  var labels = rows.map(function(r){ return r.fy; });
  var datasets = MARGIN_METRICS.filter(function(m){ return _mrgSel[m.key]; }).map(function(m){
    return {
      label:m.label,
      data:rows.map(function(r){ return r[m.key]; }),
      borderColor:m.color, backgroundColor:m.color,
      borderWidth:2.5, tension:0.3, pointHoverRadius:5, spanGaps:true,
      pointStyle:rows.map(function(r){ return r.proj ? 'rectRot' : 'circle'; }),
      pointRadius:rows.map(function(r){ return r.proj ? 5 : 3; }),
      // dash only the final segment leading into the FY27E projection point
      segment:{ borderDash:function(ctx){ return ctx.p1DataIndex === projIdx ? [5,4] : undefined; } }
    };
  });
  _mrgChart = new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:labels, datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ var l=items[0].label; return l==='FY27E' ? 'FY27E · projection' : l; },
          label:function(ctx){ return ' '+ctx.dataset.label+': '+ctx.parsed.y.toFixed(1)+'%'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{weight:'600'} } },
        y:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } }
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

// ═══ OV-4 How NVIDIA makes money (playbook §8; copied from googl.js gmmBars/stdMoneyMap) ══════════════════════
// FY2026 10-K (acc. 0001045810-26-000021). Two views of the SAME total, both reconcile to $215,938M exactly:
//   Segments (Note 17):  Compute & Networking 193,479 + Graphics 22,459 = 215,938
//   Geography (Note 17, customer HEADQUARTERS — changed from billing location in Q3 FY26, prior years recast):
//                        United States 149,617 + Taiwan 42,345 + China incl. HK 19,677 + Other 4,299 = 215,938
//   Revenue lines (revenue by end market): DC 193,737 (Compute 162,361 · Networking 31,376) + Gaming 16,042 +
//                        ProViz 3,191 + Automotive 2,349 + OEM & Other 619 = 215,938
// Bars are neutral greys ranked by size (.gmm-neutral). Replaces the old MONEY_SEG / MONEY_REG chart (whose regions
// were "approx · by billing location"), MONEY_SEG_CARDS, MONEY_REG_DETAIL and HOW_MONEY (B2 #6, #40).
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
var GMM_SEG = [
  ['Compute & Networking', 89.6, '$193.5B', '90%', null],
  ['Graphics',             10.4, '$22.5B',  '10%', null],
];
var GMM_GEO = [
  ['United States',          69.3, '$149.6B', '69%', null],
  ['Taiwan',                 19.6, '$42.3B',  '20%', null],
  ['China (incl. Hong Kong)', 9.1, '$19.7B',  '9%',  null],
  ['Other',                   2.0, '$4.3B',   '2%',  null],
];
var REV_DEFS = [
  { seg:'Compute & Networking (the data-center business)',
    desc:'Everything that goes into an AI data center: <b>GPU accelerators</b> and <b>Grace CPUs</b>, the <b>networking</b> that ties them together (NVLink, InfiniBand, Spectrum-X Ethernet), complete rack-scale systems (GB200 / GB300 NVL72), and enterprise software. It also holds the <b>automotive</b> platform (DRIVE) and Jetson robotics modules. Sold mostly to system makers that build for cloud providers and enterprises.',
    econ:[['FY2026 revenue','$193.5B · 90% of total'],['Growth','+67% (from $116.2B)'],['Operating income','$130.1B · 67.3% margin'],['Customer concentration','Two direct customers were 22% and 14% of total revenue, both mainly in this segment']] },
  { seg:'Graphics (gaming and professional visualization)',
    desc:'<b>GeForce</b> GPUs for gaming PCs and laptops, the GeForce NOW cloud-gaming service, <b>RTX PRO</b> workstation GPUs for designers and engineers, <b>Omniverse</b> software for 3D simulation and digital twins, and chips for game consoles (OEM). Sold through add-in-board makers, PC makers and distributors.',
    econ:[['FY2026 revenue','$22.5B · 10% of total'],['Growth','+57% (from $14.3B)'],['Operating income','$9.2B · 40.8% margin']] },
  { seg:'The revenue lines (by end market, as the 10-K reports them)',
    desc:'The 10-K also splits the same total by end market. Data Center (compute and networking) is the whole story; the other four markets together are about a tenth of revenue.',
    econ:[['Data Center','$193.7B · 89.7% (+68%)'],['  · Compute','$162.4B · 75.2% (+59%)'],['  · Networking','$31.4B · 14.5% (+142%)'],['Gaming','$16.0B · 7.4% (+41%)'],['Professional Visualization','$3.2B · 1.5% (+70%)'],['Automotive','$2.3B · 1.1% (+39%)'],['OEM & Other','$0.6B · 0.3% (+59%)']],
    econNote:'10-K Note 17, revenue by end market; growth vs FY2025. From Q1 FY2027 NVIDIA reports revenue by market platform as Hyperscale · ACIE · Edge (Deep Dive ▸ Top Line).' },
];
function gmmRank(arr){ var o=arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }), rk=[];
  o.forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); }); return rk; }
function gmmBars(arr){
  var rk=gmmRank(arr);
  return '<div class="ov-mbars gmm-neutral">'+arr.map(function(r,i){
    var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill gmm-g'+rk[i]+'" style="width:'+Math.max(r[1],1.2)+'%">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2026 revenue <b>$215.9B (+65%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b> (where customers are headquartered). Both reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Segments</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+
    '<div class="ave-subh-note">By customer headquarters, not end use: NVIDIA estimates 76% of FY2026 Data Center revenue from Taiwan-headquartered customers went to end customers in the United States and Europe.</div></div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2026: operating income <b>$130.4B</b> (60.4% margin) · net income <b>$120.1B</b> (55.6%). The two segments earned $139.3B; the $8.9B gap is costs kept at company level — stock-based compensation $6.4B, unallocated operating expenses $2.0B and acquisition-related costs $0.5B. '+
    '<span class="ave-subh-note">Source: NVIDIA FY2026 Form 10-K (Note 17 Segment Information: segments, geography, revenue by end market; income statement).</span></div>';
  return h;
}

// ═══ OV-5 Products & platforms (playbook §8; copied from googl.js stdProducts) ══════════════════════════════
// Two tiers: family card → pop-up with the specific products (key = prod:i). Paraphrases the FY2026 10-K Item 1
// (Data Center, Gaming, Professional Visualization, Automotive; Blackwell, Rubin "production shipments in the second
// half of fiscal year 2027", NVLink Fusion, NVIDIA AI Enterprise, DRIVE Hyperion) and NVIDIA's product pages.
// No emoji on the cards or in the pop-up title (SAB, 2026-11-02). Descriptive, no opinion (playbook §19). The four product photos of the old cards (B2 #5) sit inside their family's
// pop-up; the old PRODUCTS constant (longer copy) stays in this file until F-FINAL.
function nvPhoto(file, alt){ return '<img src="img/products/'+file+'" alt="'+esc(alt)+'" style="display:block;width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin:2px 0 6px" onerror="this.remove()">'; }
var NV_PRODUCTS = [
  { fam:'Data-center GPUs & systems', d:'The accelerators and the racks.', items:[
    ['Blackwell / Blackwell Ultra GPUs', nvPhoto('nvda-dies.jpg','Blackwell silicon')+'The current data-center GPU generation: two dies joined to act as one chip, surrounded by HBM memory. Designed by NVIDIA, manufactured by TSMC.'],
    ['GB200 / GB300 NVL72', nvPhoto('nvda-gb300-nvl72.jpg','GB300 NVL72 rack')+'A liquid-cooled rack that links 72 GPUs and 36 Grace CPUs over NVLink so they work as one large accelerator. Sold mostly through system makers.'],
    ['HGX and DGX', 'HGX: GPU boards that server makers build into their own systems. DGX: NVIDIA\'s own complete AI servers and supercomputers.'],
    ['Rubin (next generation)', 'The next platform, built for reasoning and agentic AI; production shipments expected in the second half of fiscal 2027 (10-K).'] ]},
  { fam:'CPUs & superchips', d:'NVIDIA\'s own Arm-based processors.', items:[
    ['Grace CPU', 'An Arm-based data-center CPU designed to feed GPUs with data and memory bandwidth.'],
    ['Grace Blackwell Superchip', nvPhoto('nvda-superchip.jpg','Grace Blackwell Superchip')+'Two Blackwell GPUs and one Grace CPU joined by a chip-to-chip NVLink on a single module — the building block of the NVL72 rack.'],
    ['Vera (next generation)', 'The CPU that pairs with Rubin GPUs in the next platform.'] ]},
  { fam:'Networking', d:'The fabric that links the GPUs.', items:[
    ['NVLink & NVLink Switch', nvPhoto('nvda-networking.jpg','NVIDIA networking')+'Connects GPUs inside a rack so they share memory and bandwidth. NVLink Fusion (FY2026) lets hyperscalers plug their own custom CPUs and chips into it.'],
    ['InfiniBand (Quantum)', 'Switches and adapters that connect racks into large training clusters.'],
    ['Spectrum-X Ethernet', 'Ethernet switches and SuperNICs tuned for AI traffic, for customers standardised on Ethernet.'],
    ['BlueField DPUs & ConnectX adapters', 'Processors and network cards that move data and handle security and storage off the main CPU.'] ]},
  { fam:'Software & AI platforms', d:'What developers program it with.', items:[
    ['CUDA & CUDA-X', 'The programming platform that runs on every NVIDIA GPU, plus hundreds of acceleration libraries for AI, data processing and science.'],
    ['NVIDIA AI Enterprise', 'A paid, licensed suite of enterprise AI software (frameworks, NIM microservices, tools) to build and run AI in production.'],
    ['Omniverse', 'A platform for 3D simulation and digital twins of factories, warehouses and products.'],
    ['DGX Cloud', 'NVIDIA\'s AI computing offered as a cloud service, hosted with cloud partners.'] ]},
  { fam:'Gaming', d:'GPUs and cloud gaming for players.', items:[
    ['GeForce RTX 50 Series', 'Blackwell-based GPUs for gaming desktops and laptops, with ray tracing and DLSS (AI-boosted frame rates).'],
    ['GeForce NOW', 'A cloud-gaming service that streams PC games to almost any device.'],
    ['Console chips', 'Systems-on-chip and development services for game consoles.'] ]},
  { fam:'Professional visualization', d:'Workstations for designers and engineers.', items:[
    ['RTX PRO GPUs', 'Workstation GPUs for design, engineering and content creation, increasingly used to run AI locally.'],
    ['vGPU software', 'Licensed software that delivers graphics-rich virtual desktops and workstations from the data center.'] ]},
  { fam:'Automotive & robotics', d:'Computers for cars and robots.', items:[
    ['DRIVE Hyperion & DRIVE AGX', 'The in-car computer, operating system (DRIVE OS) and reference sensor set for automated driving.'],
    ['Jetson', 'Embedded computer modules for robots and edge devices.'],
    ['Isaac & physical-AI models', 'Software, simulation and open models to train and deploy robots.'] ]},
];
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+NV_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'">'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
// Overview modal (copied from googl.js wireModal; resolve() grows with each unit that uses data-detail).
function nvModalHtml(){
  return '<div class="ov-modal-back" id="nvdaModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="nvdaModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="nvdaModalT"></div><div class="ov-modal-b" id="nvdaModalB"></div></div></div>';
}
function wireModal(root){
  var back=root.querySelector('#nvdaModalBack'), mT=root.querySelector('#nvdaModalT'), mB=root.querySelector('#nvdaModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#nvdaModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='ce'){ return nvdaCePop(id); }       // Evolution ▸ Earnings "?" notes (nvda-ce.js)
    if(kind==='ntrk'){ return nvdaTrackPop(id); }   // Management ▸ Track Record cards (nvda-track.js)
    if(kind==='hist'){ var tl=TIMELINE[+id]; return tl&&tl.d?{t:esc(tl.y),h:tl.d}:null; }
    if(kind==='prod'){ var f=NV_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

// ═══ OV-6 Competitors — the peer map (playbook §8; copied from googl.js, the live-multiple reference) ═══════════
// Peer set: SAB, 2026-11-02 (the old four — AMD, Broadcom, Intel, Qualcomm — plus Marvell). The file keeps
// DENOMINATORS only (rule 10): P/E = live price ÷ EPS; EV/EBITDA = live EV ÷ EBITDA. Trailing = each company's
// latest 10-K (SEC XBRL, pulled 2026-11-02): EPS = diluted GAAP; EBITDA = operating income + depreciation +
// amortization of intangibles (as reported in the cash-flow statement); nd = total debt − cash − current
// marketable securities (balance sheet); gt = revenue growth of that fiscal year. Forward (NVIDIA only — the
// peers are not in the Bloomberg file): Bloomberg consensus FY2027 as of Sep 9 2026 — EPS $9.94, EBITDA $272.4B
// (Bloomberg's "comparable" EBITDA adds back SBC; its FY2026 is $140.1B vs $133.2B here), revenue +89.7%.
// The same array and state (N_SC) feed Valuation ▸ Peers (VA-PEERS). Replaces the old COMP bubble chart with seeded
// multiples (B2 #8, and the PEERS constant of #36).
var N_PEERS=[
  { tk:'NVDA', n:'NVIDIA', hl:true, epsT:4.90, epsF:9.94, ebitdaT:133230, ebitdaF:272392, nd:-54088, gt:65.5, gf:89.7,
    src:'10-K FY2026 (year to Jan 25 2026); forward: Bloomberg consensus FY2027, Sep 9 2026',
    why:'The profile company: data-center GPUs, CPUs, networking and full AI systems, plus gaming and workstation graphics.' },
  { tk:'AMD', n:'AMD', epsT:2.65, epsF:null, ebitdaT:7265, ebitdaF:null, nd:-7330, gt:34.3, gf:null,
    src:'10-K FY2025 (year to Dec 27 2025)',
    why:'The other merchant GPU maker: Instinct accelerators compete with NVIDIA\'s data-center GPUs, Radeon with GeForce, EPYC with Grace.' },
  { tk:'AVGO', n:'Broadcom', epsT:4.77, epsF:null, ebitdaT:34120, ebitdaF:null, nd:48958, gt:23.9, gf:null,
    src:'10-K FY2025 (year to Nov 2 2025)',
    why:'Designs custom AI chips (XPUs) for hyperscalers that replace GPUs, and sells the Ethernet switches that compete with NVIDIA networking.' },
  { tk:'INTC', n:'Intel', epsT:-0.06, epsF:null, ebitdaT:9492, ebitdaF:null, nd:9169, gt:-0.5, gf:null,
    src:'10-K FY2025 (year to Dec 27 2025)',
    why:'Gaudi AI accelerators and Xeon CPUs compete in the data center; Arc GPUs in PCs. A net loss in FY2025, so no P/E.' },
  { tk:'QCOM', n:'Qualcomm', epsT:5.01, epsF:null, ebitdaT:13957, ebitdaF:null, nd:4656, gt:13.7, gf:null,
    src:'10-K FY2025 (year to Sep 28 2025)',
    why:'Entering AI data-center inference chips and Arm PC processors; competes with NVIDIA in automotive computers.' },
  { tk:'MRVL', n:'Marvell', epsT:3.07, epsF:null, ebitdaT:2835, ebitdaF:null, nd:1832, gt:42.1, gf:null,
    src:'10-K FY2026 (year to Jan 31 2026)',
    why:'Designs custom AI chips for hyperscalers and the optical links inside AI data centers.' },
];
var N_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: of the six, only NVIDIA has a Street forward (Bloomberg file)
function nTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
function nScReset(){ if(!N_SC.peers) N_SC.peers=N_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function nScNum(v){ return v!=null && !isNaN(v); }
function nScMult(p){
  if(!nScNum(p.px)) return null;                                      // no live price → no bubble (no seeded fallback)
  var f=N_SC.basis==='f';
  if(N_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (nScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!nScNum(eb)||eb<=0) return null;
  var ev=nScNum(p.ev)?p.ev:(nScNum(p.mc)&&nScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return nScNum(ev)?ev/eb:null;
}
function nScGrowth(p){ return N_SC.basis==='f'?p.gf:p.gt; }
function nScVisible(){ return (N_SC.peers||[]).filter(function(p){ return p.on && nScNum(nScMult(p)) && nScNum(nScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function nScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="nvda-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="nvda-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="nvda-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="nvda-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="nvda-sc-yhi">fast growth</text>'+
    '<g class="nvda-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips nvda-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only listed peers plot here. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures from each company\'s latest 10-K (fiscal years differ: NVIDIA and Marvell to late January, Broadcom to early November, Qualcomm to late September, AMD and Intel to December), or Bloomberg consensus FY2027 (as of Sep 9, 2026) for NVIDIA\'s forward; market caps are live. Private AI-chip rivals have no market multiple.</span></div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default.
  if(sfx==='dd') h+='<div class="rs-collap nvda-sc-collap">'+
      '<button type="button" class="rs-collap-h nvda-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b nvda-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="nvda-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip nvda-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function nScRenderOne(wrap){
  var g=wrap.querySelector('.nvda-sc-nodes'); if(!g||!N_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var NAVY=nTok('--navy','#1E2733');
  var vis=nScVisible();
  var maxMult=nScNice(Math.max.apply(null, vis.map(nScMult).concat([1]))*1.12);
  var gs=vis.map(nScGrowth), gMax=nScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-nScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.nvda-sc-xlab'); if(lab) lab.textContent=(N_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(N_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.nvda-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.nvda-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===N_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===N_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=nScMult(p), growth=nScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=nScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=scLogoUrl(p);
    var read=(N_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(nScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?NAVY:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?NAVY:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  nScChipsOne(wrap);
  nScTableOne(wrap);
}
// ─── The comps table under the peer map (Valuation ▸ Peers) — copied from meta.js meScTableOne ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median EXCLUDE NVIDIA (the set it is read against). Premium in red, discount in green.
function nScFmtMult(v){ return nScNum(v)?v.toFixed(1)+'×':'—'; }
function nScFmtPct(v){ return nScNum(v)?v.toFixed(1)+'%':'—'; }
function nScFmtMc(v){ return nScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function nScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function nScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function nScVsAvg(m, avg){
  if(!nScNum(m)||!nScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function nScTableOne(wrap){
  var box=wrap.querySelector('.nvda-sc-tbl'); if(!box||!N_SC.peers) return;
  var mLab=(N_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(N_SC.basis==='f'?'forward':'trailing');
  var rows=N_SC.peers.map(function(p){ return { p:p, m:nScMult(p), g:nScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=nScNum(a.m), bn=nScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=nScMean(peers.filter(function(r){ return nScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=nScMedian(peers.filter(function(r){ return nScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=nScMean(peers.filter(function(r){ return nScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=nScMedian(peers.filter(function(r){ return nScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return nScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(nScNum(r.m)?'':' asc-nil'), nt=nScNum(r.m)?'':nScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+nScFmtMult(r.m)+'</td>'+
      '<td>'+nScFmtPct(r.g)+'</td>'+
      '<td>'+nScFmtMc(p.mc)+'</td>'+
      '<td>'+nScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-NVIDIA · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+nScFmtMult(avgM)+'</td><td>'+nScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-NVIDIA</span></td>'+
      '<td>'+nScFmtMult(medM)+'</td><td>'+nScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.nvda-sc-tblh'), bd=wrap.querySelector('.nvda-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function nScChipNote(p){
  if(!nScNum(p.epsT)&&!nScNum(p.ebitdaT)&&!nScNum(p.epsF)&&!nScNum(p.ebitdaF)) return 'no figures on file';
  if(!nScNum(p.px)) return 'no live price';
  if(N_SC.basis==='f' && N_SC.metric==='pe' && p.epsFNote) return p.epsFNote;
  if(N_SC.basis==='f' && !nScNum(N_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!nScNum(nScMult(p))) return N_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function nScChipsOne(wrap){
  var box=wrap.querySelector('.nvda-sc-chips'); if(!box||!N_SC.peers) return;
  var keep=box.querySelector('.nvda-sc-addtk'); var typed=keep?keep.value:'';
  var h=N_SC.peers.map(function(p,i){ var nt=nScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="nvda-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="nvda-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.nvda-sc-addtk'); if(inp) inp.value=typed;
}
function nScRenderAll(root){ root.querySelectorAll('.nvda-sc').forEach(function(w){ nScRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  nScReset();
  root.querySelectorAll('.nvda-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.nvda-sc-tblh'), tblB=wrap.querySelector('.nvda-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; nScTableOne(wrap); };
    var g=wrap.querySelector('.nvda-sc-nodes'), tip=wrap.querySelector('.nvda-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ N_SC.basis=btn.getAttribute('data-mgbasis'); nScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ N_SC.metric=btn.getAttribute('data-mgmetric'); nScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.nvda-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  nScRenderAll(root); nScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.nvda-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(N_SC.peers[i]){ N_SC.peers.splice(i,1); nScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.nvda-sc-addbtn'), addIn=wrap.querySelector('.nvda-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!N_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=N_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; N_SC.peers.push(o); }
        else N_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; nScRenderAll(root); nLiveOne(root, tk); };
  }
}
function nScFetchCaps(root){ if(N_SC._capsFetched||!N_SC.peers) return; N_SC._capsFetched=true; N_SC.peers.forEach(function(p){ if(p.tk) nLiveOne(root, p.tk); }); }

// Live quote via Massive (api.liveQuote). Market data is ALWAYS live — no seeded number is ever shown: the
// Key Facts cell says "loading…" until the quote arrives and "unavailable" if it fails. The same quote feeds the
// peer bubbles (price → P/E, market cap → bubble size, EV when Massive has one) and the old Sensitivity pane.
function nLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null) return;
    var mcB=q.marketCap/1e9;
    nScReset();
    (N_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    nScRenderAll(root);
  }).catch(function(){}); }

// ═══ OV-7 Timeline (playbook §8; copied from googl.js stdTimeline) ═══════════════════════════════════════════
// Strict chronological order. Sources: FY2026 10-K Item 1 (founding, Delaware reincorporation, GPU 1999, CUDA 2006,
// AlexNet 2012, Tensor Core 2017, Mellanox 2020, Grace 2023, Blackwell 2024), Item 1A (export controls; the H20
// $4.5B charge), Note 2 (Groq, Dec 2025: $13.0B paid in FY2026, $14.4B goodwill); NVIDIA press releases (IPO Jan 22
// 1999; first quarterly dividend Nov 2012; Mellanox closing Apr 27 2020; Arm agreement Sep 13 2020 and termination
// Feb 8 2022); FY2024 10-K (revenue $60.9B, Data Center $47.5B). Market-cap milestone: only the latest ($5T,
// Oct 29 2025). The old architecture timeline (TECH_TIMELINE, B2 #24) stays complete in Miscellaneous ▸ Technology;
// its key launches are here. DESC's Mellanox sentence (B2 #3) lands in the 2020 item.
var TIMELINE = [
  { y:'1993–98', t:'<b>Genesis:</b> Jensen Huang, Chris Malachowsky and Curtis Priem found <b>NVIDIA</b> in California (Apr 1993) to build graphics chips for PCs.',
    d:'<ul class="ov-bullets"><li>Apr 1993 — incorporated in California; Jensen Huang is CEO from the start and still is.</li><li>The first products are graphics accelerators for PC games, sold to add-in-board makers.</li><li>Apr 1998 — reincorporated in Delaware, ahead of the listing.</li></ul>' },
  { y:'1999', t:'<b>IPO</b> on NASDAQ (Jan) and <b>GeForce 256</b>, which NVIDIA calls the invention of the GPU.',
    d:'<ul class="ov-bullets"><li>Jan 22, 1999 — initial public offering on NASDAQ.</li><li>Later that year — GeForce 256: graphics processing moved onto one chip, the GPU.</li><li>The GPU becomes the engine of PC gaming, the market that funds the next decade.</li></ul>' },
  { y:'2006', t:'<b>CUDA</b> opens the GPU to general-purpose computing — the software platform the AI era is later built on.' },
  { y:'2012', t:'<b>AlexNet</b>, trained on NVIDIA GPUs, wins ImageNet — the start of deep learning; NVIDIA also pays its <b>first dividend</b>.',
    d:'<ul class="ov-bullets"><li>2012 — the AlexNet neural network, trained on two GeForce GPUs, wins the ImageNet image-recognition contest; the 10-K calls it AI\'s "Big Bang".</li><li>Nov 2012 — first quarterly cash dividend.</li><li>2017 — first Tensor Core GPU (Volta), designed for AI from the ground up.</li></ul>' },
  { y:'2020', t:'<b>Mellanox</b> acquired (~$7B, closed Apr 2020) — networking makes the data center, not the chip, the unit NVIDIA sells.',
    d:'<ul class="ov-bullets"><li>Apr 27, 2020 — the acquisition closes.</li><li>Brings InfiniBand and Ethernet networking, adapters and the DPU (BlueField) — the base of today\'s NVLink / Spectrum-X networking line.</li><li>China\'s antitrust regulator later questioned NVIDIA\'s compliance with the conditions set at closing (10-K).</li></ul>' },
  { y:'2020–22', t:'<b>Arm</b>: agreed to buy it from SoftBank for $40B (Sep 2020); <b>terminated</b> in Feb 2022 after regulatory opposition.',
    d:'<ul class="ov-bullets"><li>Sep 13, 2020 — agreement to acquire Arm for up to $40B in cash and stock.</li><li>2021 — regulators in the US, UK, EU and China challenge the deal.</li><li>Feb 8, 2022 — both sides terminate it; NVIDIA writes off the $1.36B prepayment. It keeps a 20-year Arm license, used later for the Grace CPU.</li></ul>' },
  { y:'2022–25', t:'<b>US export controls on China</b> — successive rules restrict NVIDIA\'s data-center chips there, ending in a $4.5B H20 charge.',
    d:'<ul class="ov-bullets"><li>Aug 2022 — first licence requirements on A100 / H100 exports to China.</li><li>2023 — the rules widen; NVIDIA designs reduced-performance versions for China.</li><li>Apr 2025 — the H20 also needs a licence; NVIDIA takes a $4.5B charge for inventory and purchase obligations (Q1 FY2026).</li></ul>' },
  { y:'FY2024', t:'<b>Data Center becomes the business</b> — generative-AI demand lifts revenue to $60.9B (+126%), $47.5B of it Data Center.',
    d:'<ul class="ov-bullets"><li>Late 2022 — generative AI (ChatGPT) sets off a race for GPU capacity at cloud providers and AI labs.</li><li>FY2024 (to Jan 2024) — Data Center revenue $47.5B, overtaking every other market combined.</li><li>FY2026 — Data Center $193.7B, about 90% of revenue.</li></ul>' },
  { y:'2023–24', t:'From chips to systems: the <b>Grace</b> CPU (2023) and <b>Blackwell</b> rack-scale platform (2024), on a yearly product cadence.',
    d:'<ul class="ov-bullets"><li>2023 — Grace, NVIDIA\'s first data-center CPU.</li><li>2024 — Blackwell: 36 Grace CPUs and 72 Blackwell GPUs in one liquid-cooled rack (NVL72).</li><li>FY2026 — Blackwell Ultra ships; Rubin is next, with production shipments expected in the second half of FY2027.</li></ul>' },
  { y:'Oct 2025', t:'First company to reach a <b>$5 trillion</b> market capitalization (Oct 29, 2025).' },
  { y:'Dec 2025', t:'<b>Groq</b>: non-exclusive license to its inference-chip technology plus hiring of its team — $13.0B paid in FY2026.',
    d:'<ul class="ov-bullets"><li>Dec 2025 — license agreement for Groq\'s language-processing-unit (LPU) technology; no customers, products or equity bought (10-K Note 2).</li><li>Recorded $14.4B of goodwill and a $2.5B technology intangible.</li><li>Almost twice what NVIDIA paid for Mellanox, its previous largest deal.</li></ul>' },
];
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// OV-1 Key Facts (playbook §8: 10 cells, this order). FY2026 10-K (filed 2026-02-25): cover (Delaware, Santa Clara),
// Item 1 (incorporated in California Apr 1993, reincorporated in Delaware Apr 1998; ~42,000 employees at FY-end
// Jan 25, 2026), Item 5 (cash dividends paid in FY2026). IPO: NVIDIA IR (Jan 22, 1999, NASDAQ). CEO: DEF 14A 2026.
// Market cap is live (Massive via liveQuote), never seeded (rule 10). Replaces the old 6-cell SNAPSHOT banner (B2 #1);
// the old multiples tiles moved to Valuation ▸ Target Multiple (B2 #2).
var STD_FACTS = [
  ['Listing','NASDAQ: NVDA'],
  ['HQ','Santa Clara, California, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1993 (Jensen Huang, Chris Malachowsky & Curtis Priem)'],
  ['IPO','Jan 1999 · NASDAQ'],
  ['CEO','Jensen Huang · co-founder, 1993 · CEO since 1993'],
  ['Employees','~42,000 · Jan 2026 (FY-end)'],
  ['Dividend','Payer · quarterly'],
  ['Market cap','loading live quote…'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v = p[0]==='Market cap' ? '<span id="nvdaMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
// Live market cap for the Key Facts cell (copied from amzn.js aLiveOne/aMcCell: no seed; dated when live).
function nvLiveMc(pane){
  var el = pane.querySelector('#nvdaMc'); if (!el) return;
  import('../api.js').then(function(api){ return api.liveQuote('NVDA'); }).then(function(res){
    var q = res && res.data ? res.data : res;
    if (!q || q.marketCap == null){ el.textContent = 'live quote unavailable'; return; }
    var mcB = q.marketCap/1e9;
    el.textContent = '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+
      new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  }).catch(function(){ el.textContent = 'live quote unavailable'; });
}

function overviewBody(){
  var h = '';
  // OV-1 — Key Facts
  h += stdKeyFacts();
  // OV-2 — description (lede)
  h += stdLede();
  // 4 — business snapshot
  h += stdFourQuad();
  // OV-4 — How NVIDIA makes money (collapsed)
  h += collapsible('How NVIDIA makes money', stdMoneyMap(), false);
  // OV-5 — Products & platforms (collapsed)
  h += collapsible('Products & platforms', stdProducts(), false);
  // OV-6 — Competitors, the peer map (collapsed)
  h += collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  // OV-7 — Timeline (collapsed)
  h += collapsible("Timeline — how it became today's NVIDIA", stdTimeline(), false);

  // OV-F — the Overview's one source footer
  h += '<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// Wire the box-based overview. Idempotent; safe to call on load and re-entry.
function initOverview(){
  // Scope directly to the overview pane. The Deep Dive shell is also `.ov-nvda`
  // (for brand/tab styling), so target the pane by its unique data-ovt instead.
  var pane = document.querySelector('.ovt-pane[data-ovt="overview"]'); if (!pane) return;

  // OV-1 — live market cap cell.
  nvLiveMc(pane);

  // OV-5 — product pop-ups. Hoist the modal to #co-detailview so it stays visible from either profile tab.
  // A fresh render brings a fresh modal: it replaces any hoisted one (no duplicate ids).
  var ovRoot = pane.closest('.ov-nvda') || pane;
  var detail = document.getElementById('co-detailview');
  var fresh = ovRoot.querySelector('#nvdaModalBack');
  if (detail && fresh){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ m.remove(); });
    detail.appendChild(fresh);
  }
  wireModal(detail || ovRoot);

  // OV-6 — peer map: pills, chips, tooltip, live quotes (state N_SC is shared with Valuation ▸ Peers).
  wireScatters(ovRoot);

  // OV-4..7 — standard collapsibles, money-map accordions and the Segments ⇄ Geography view (copied from googl.js init).
  pane.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  pane.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  pane.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    pane.querySelectorAll('.mg-pill[data-gmm]').forEach(function(x){ x.classList.toggle('active', x===btn); });
    pane.querySelectorAll('.gmm-view').forEach(function(g){ g.hidden=(g.getAttribute('data-gmm')!==v); });
  }; });

  // 3 — description expand/collapse.
  var dMore = pane.querySelector('#nvDescMore');
  if (dMore) dMore.onclick = function(){
    var box = pane.querySelector('.ovlr-desc'); var open = box.classList.toggle('open');
    dMore.textContent = open ? 'Read less ▴' : 'Read more ▾';
  };
  initOverviewRest(pane);
}

// Old header multiples tiles (B2 #2) — now shown in Valuation ▸ Target Multiple until VA-TM rebuilds them.
// Scoped to the pane that holds them: trailing/forward toggle + live price/EV fill.
function initMultiples(pane){
  if (!pane || !pane.querySelector('#nvMultToggle')) return;
  pane.querySelectorAll('#nvMultToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _multMode = b.getAttribute('data-mult');
      pane.querySelectorAll('#nvMultToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      multFill(pane);
    };
  });
  multFill(pane);
  import('../api.js').then(function(api){ return api.liveQuote('NVDA'); }).then(function(res){
    var q = res && res.data; if (!q || q.price == null) return;
    _multPrice = q.price; _multEv = q.ev;   // price still drives the P/E tile, just not shown here
    var mc = pane.querySelector('#nvMultMc'); if (mc && q.marketCap != null) mc.textContent = fmtBig(q.marketCap);
    var evEl = pane.querySelector('#nvMultEv'); if (evEl && q.ev != null) evEl.textContent = fmtBig(q.ev);
    multFill(pane);
  }).catch(function(){});
}

function initOverviewRest(pane){
  // 5/6/7 — collapsible boxes; build the lazy chart when a box opens.
  pane.querySelectorAll('.ovlr-box-h').forEach(function(hb){
    hb.onclick = function(){
      var box = hb.parentElement; var open = box.classList.toggle('open');
      if (open){
        var id = box.getAttribute('data-box');
        if (id === 'money') requestAnimationFrame(buildMoneyChart);
        if (id === 'margins') requestAnimationFrame(buildMarginChart);
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
      var det = pane.querySelector('#nvMoneyDetail');
      if (det) det.innerHTML = _moneyMode === 'region' ? MONEY_REG_DETAIL : moneySegCards();
      buildMoneyChart();
    };
  });

}

// Old Margins box (B2 #7) — now in Bottom Line ▸ General until BL-GEN-1 rebuilds it. Scoped to its pane.
function initMargins(pane){
  if (!pane || !pane.querySelector('#nvMgChart')) return;
  var mgChips = pane.querySelector('#nvMgChips');
  if (mgChips) mgChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if (!b) return;
    var k = b.getAttribute('data-mg'); _mrgSel[k] = !_mrgSel[k]; b.classList.toggle('on', _mrgSel[k]); buildMarginChart(); };
  var w = mrgDefaultWindow(); _mrgStart = w[0]; _mrgEnd = w[1];
  wireMrgSlider(pane);
  renderMrgSlider();
  requestAnimationFrame(buildMarginChart);
  if (!pane._mrgLoaded){ pane._mrgLoaded = 1; loadMassiveMargins(); }   // upgrade history to the live Massive feed when available
}

function initOverviewOld(pane){

  // 7 — old competitors box (B2 #8, replaced by OV-6): only wired if its canvas is on the page.
  if (pane.querySelector('#nvCompChart')) {
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
  // Valuation lives in the Deep Dive shell (.ov-nvda-dd), not the Overview shell.
  var pane=document.querySelector('.ovt-pane[data-ovt="valuation"]'); if(!pane) return;
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

// ─── Overview shell (the "Overview" company tab) ─────────────────────────────────
// The Overview body is wrapped in a .ovt-pane[data-ovt="overview"] so initOverview()'s
// pane-scoped selectors keep working unchanged. Summit tokens on the root (playbook §7.2, §21):
// the company's brand lives only in its logo.
var NV_TOKENS = 'style="--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)"';

function html(){
  return '<div class="ov ov-nvda" data-brand="NVDA" '+NV_TOKENS+'>'+
    '<div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div>'+
    nvModalHtml()+
    '</div>';
}

function init(){
  requestAnimationFrame(function(){ initOverview(); });
}

// ─── Deep Dive shell — the Amazon spine (docs/PROFILE_PLAYBOOK.md §5), set in F1 (2026-11-02) ───
// Until each unit is rebuilt, the old panes sit at their approved B2 destination (docs/profiles/NVDA.md §5),
// each still wrapped in its old .ovt-pane[data-ovt=…] so the old builders' selectors keep working.
// Sub-tabs with nothing to show yet are added when their unit is built (golden rule 5).
function oldPane(key, body){ return '<div class="ovt-pane" data-ovt="'+key+'">'+body+'</div>'; }

// One Deep Dive section: the first sub-tab starts active and visible.
function subtabs(group, list, hidden){
  var h='<div class="dd-pane" data-dd="'+group+'"'+(hidden?' hidden':'')+'><div class="ovt-subtabs">';
  list.forEach(function(s,i){ h+='<button type="button" class="ovt-subtab'+(i?'':' active')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; });
  h+='</div>';
  list.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i?' hidden':'')+'>'+s.body+'</div>'; });
  return h+'</div>';
}

function deepDiveHtml(){
  var h='<div class="ov ov-nvda ov-nvda-dd" data-brand="NVDA" '+NV_TOKENS+'>';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
      '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
    '</div>';
  h+=subtabs('topline',[
    // The shared segments engine (TL-GEN · TL-SEG · TL-OTH · TL-CUS) over js/segments-data/nvda.js: the market platforms
    // are the segments (SAB, Nov 2 2026). Old Segments pane B2 #11–13, #16 absorbed into the dataset.
    { k:'segov', l:'General', body:segmentsOverviewHtml('NVDA') },
    { k:'segdrv', l:'Segments', body:segmentsHtml('NVDA') },
    { k:'segoth', l:'Other', body:segmentsOtherHtml('NVDA') },
    { k:'segcus', l:'Customers', body:segmentsCustomersHtml('NVDA') },
  ]);
  h+=subtabs('bottomline',[
    { k:'margins', l:'General', body:nvdaBlGeneralHtml() },   // BL-GEN-1…5 (nvda-bl.js); replaces the old Margins box (B2 #7)
    { k:'segments', l:'Segments', body:oldPane('segments', segmentsBody()) },          // old Segments pane, temporary: B2 #14 GAAP segments (until BL-SEG) and #15 latest print (until EV-SET)
    { k:'supplychain', l:'Supply Chain', body:oldPane('industry', industryBody()) }, // B2 #35 (semis map; the SPLC table joins in BL-SPLC)
  ], true);
  h+=subtabs('evolution',[
    // EV-SET: Earnings ▸ Setup on the shared Earnings machinery (nvda-ce.js + nvda-ce-data.js); Post-Results and Notes are not
    // published until an official call transcript is on file (SAB, 2026-11-09). B2 #15 (old "Latest print & guidance") → the
    // Q2 FY27 Setup notes.
    { k:'earnings', l:'Earnings', body:nvdaCeHtml({ ticker:'NVDA' }) },
    // EV-RES: the shared Results engine (B2 #27 beats text → metric notes, #28 guidance and #29 consensus → the dataset,
    // #30 approximate Fiscal.ai curve dropped for the real Bloomberg vintages — SAB 2026-11-02).
    { k:'results', l:'Results', body:resultsHtml('NVDA') },
    // EV-EST: the shared estimates-evolution engine (B2 #31 Summit snapshot by snapshot, re-pulled from the MCP; the old
    // pane's stories → the rev notes of results-data/nvda.js with verified figures — SAB 2026-11-02).
    { k:'estevo', l:'Estimates', body:resultsEvoHtml('NVDA') },
  ], true);
  h+=subtabs('valuation',[
    { k:'targetmult', l:'Target Multiple', body:oldPane('valuation', heroMultiples()+valuationBody()) }, // B2 #2 tiles + #32–34 (until VA-TM / VA-SENS)
  ], true);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:NVDA_MGMT.body() },        // MG-TEAM (B2 #25: the old org tree → the shared engine)
    { k:'ownership', l:'Ownership', body:nvdaOwnBody() },               // MG-OWN (B2 #26: insider table)
    { k:'governance', l:'Governance & SBC', body:nvdaGovBody() },       // MG-GOV
    { k:'track', l:'Track Record', body:nvdaTrackBody() },              // MG-TRACK (no ratings, SAB)
  ], true);
  h+=subtabs('misc',[
    { k:'tech', l:'Technology', body:oldPane('technology', technologyBody()) },     // B2 #17–24 (MISC-tech)
  ], true);
  h+='</div>';
  return h;
}

// ═══ Sub-tab + Deep Dive tab machinery (standardized contract, copied from googl.js) ═══
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'NVDA'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'NVDA'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'NVDA'); });
    else requestAnimationFrame(function(){ initSegmentsOverview(root, 'NVDA'); });
  } else if(group==='bottomline'){
    if(key==='segments') requestAnimationFrame(function(){ buildSegChart(); });
    else if(key==='margins') requestAnimationFrame(function(){ nvdaBlGeneralBuild(root); });
    else if(key==='supplychain') requestAnimationFrame(function(){ semiIndustry.init(); });
  } else if(group==='evolution'){
    if(key==='earnings') nvdaCeBuild(root);
    else if(key==='results') requestAnimationFrame(function(){ initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'NVDA'); });
    else if(key==='estevo') requestAnimationFrame(function(){ initResultsEvo('NVDA'); });
  } else if(group==='valuation'){
    if(key==='targetmult') requestAnimationFrame(function(){ initValuation(); initMultiples(root.querySelector('.ovt-pane[data-ovt="valuation"]')); });
  } else if(group==='mgmt'){
    if(key==='team') NVDA_MGMT.init(root);
    else if(key==='ownership') nvdaOwnInit(root);
  } else if(group==='misc'){
    if(key==='tech') initTech();
  }
}
// Keep the clicked control visually anchored when a tall pane is swapped for a shorter one.
function ddKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var d=el.getBoundingClientRect().top-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
function activeSubKey(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null;
  var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null;
}
function showSub(root, pane, group, key){
  var btn=pane.querySelector('.ovt-subtab[data-ovst="'+key+'"]');
  stopTech();   // the Technology animations only run while their sub-tab is visible
  ddKeepPos(btn||pane, function(){
    pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
    pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  var btn=root.querySelector('.dd-tab[data-dd="'+key+'"]');
  stopTech();
  ddKeepPos(btn||root, function(){
    root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
    root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// Idempotent: called every time the Deep Dive tab becomes visible. Wires the section and sub-tab
// bars + the old segment-chart toggles, then (re)builds the visible sub-tab now that it has layout
// (Chart.js needs a non-null offsetParent).
function deepDiveInit(){
  var root=document.querySelector('.ov-nvda-dd');
  if(!root) return;
  wireDD(root);
  ['topline','bottomline','evolution','valuation','mgmt','misc'].forEach(function(g){ wireSubtabs(root, g); });
  wireModal(document.getElementById('co-detailview') || root);   // Deep Dive pop-ups (Track Record) on the hoisted Overview modal
  NVDA_MGMT.init(root);                                           // the engine's bio modal (playbook §15)
  nvdaCeWire(root);                                               // Earnings: phase tab, quarter pills, estimate toggles (nvda-ce.js)
  // Bottom Line ▸ Segments (old Segments pane, temporary): segment / view / forecast-source toggles on the revenue chart.
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
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}

export var nvidiaOverview = {
  html: html,
  init: init,
  deepDive: { html: deepDiveHtml, init: deepDiveInit }
};
