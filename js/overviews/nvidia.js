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
import { nvdaSplcBody, nvdaSplcBuild, nvdaSplcPop } from './nvda-splc.js';   // Bottom Line ▸ Supply Chain (BL-SPLC)
import { nvdaHistMult } from './nvda-histmult.js';                          // Valuation ▸ Historic Multiple (VA-HIST)
import { nvdaTargetMult } from './nvda-target-multiple.js';                  // Valuation ▸ Target Multiple / PEG (VA-TM)
import { submitsHtml, initSubmits } from '../submits.js';                   // Valuation ▸ Submit History (VA-SUB; data js/submits-data/nvda.js)
import { nvdaSens } from './nvda-sensitivity.js';                            // Valuation ▸ Sensitivity Analysis (VA-SENS)
import { nvdaCompBody } from './nvda-comp.js';                               // Miscellaneous ▸ Competitive position (MISC-comp)
import { nvdaCapacityBody, nvdaCapacityBuild } from './nvda-capacity.js';    // Miscellaneous ▸ Capacity → revenue (MISC-capacity)
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { makeManagement } from './management.js';                      // Management ▸ Executives & Board (MG-TEAM)
import { NVDA_MGMT_DATA } from './nvda-mgmt-data.js';
import { nvdaOwnBody, nvdaOwnInit } from './nvda-own.js';              // Management ▸ Ownership (MG-OWN)
import { nvdaGovBody } from './nvda-gov.js';                           // Management ▸ Governance & SBC (MG-GOV)
import { nvdaTrackBody, nvdaTrackPop } from './nvda-track.js';          // Management ▸ Track Record (MG-TRACK)
import { SUMMIT_CAT } from '../viz-palette.js';
import { attachBrush } from '../betas-core.js';   // drag-to-zoom on both axes, double-click resets (§0.7) — MISC-tech Moore chart
import { nvdaBlGeneralHtml, nvdaBlGeneralBuild, nvdaBlSegmentsHtml, nvdaBlSegmentsBuild } from './nvda-bl.js';   // Bottom Line ▸ General (BL-GEN-1…5) and Segments (BL-SEG)
import { nvdaCeHtml, nvdaCeWire, nvdaCeBuild, nvdaCePop } from './nvda-ce.js';   // Evolution ▸ Earnings ▸ Setup (EV-SET), copy of lyft-ce.js
var NVDA_MGMT = makeManagement(Object.assign({ brand:SUMMIT_CAT[0] }, NVDA_MGMT_DATA));
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line (engine + js/segments-data/nvda.js)   // Evolution ▸ Results (engine + js/results-data/nvda.js)

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Render helpers (shared overview.css classes) ──────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }







// OV-F (playbook §8): the Overview's only footer; the collapsibles carry none of their own. Replaces the old SOURCES
// (B2 #9), which cited a Summit model synced Jun 4 2026 — the Overview no longer shows any Summit figure.
var OV_SOURCES = 'Sources — NVIDIA FY2026 Form 10-K (SEC EDGAR, filed Feb 25, 2026) for revenue, segment, geographic, margin, customer and headcount figures; the FY2024 10-K, NVIDIA investor-relations press releases and the 2026 proxy statement for history and leadership; NVIDIA product pages for products. Peer figures from each company’s latest Form 10-K (SEC EDGAR, as of Nov 2026) and, for NVIDIA’s forward multiples, Bloomberg consensus FY2027 (as of Sep 9, 2026). Market cap and peer multiples are live (Massive price ÷ those figures). Forward figures are estimates, not company guidance.';

// ── Layered-reveal overview (progressive disclosure) ─────────────────────────────
// The tab opens minimal — snapshot, one positioning line, KPIs and ONE signature
// hero — then a chip selector reveals a single topic at a time, each built from
// drill-down cards that expand on tap. Reusable pattern (.ovlr-*): another company
// just refills POSITION / the hero mix / ovTopics() and keeps the render + init.






// OV-3 2×2 (playbook §8: one .q2 table, ≤ 30 words per cell; only "How it earns" has numbers). FY2026 10-K
// (acc. 0001045810-26-000021): revenue by market platform (Data Center 193,737 · Gaming 16,042 · ProViz 3,191 ·
// Automotive 2,349 · OEM & Other 619 of 215,938), Note 16 segments (operating income: Compute & Networking 130,141 ·
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



// ═══════════════════════════════════════════════════════════════════════════════
// Box-based overview (7 sections). Reusable collapsible-box pattern (.ovlr-box).
// ═══════════════════════════════════════════════════════════════════════════════



// ── 3 · Description (expandable) ─────────────────────────────────────────────────
// OV-2 lede (playbook §8: 2–4 sentences, ~50–80 words, no numbers, neutral; no segments, customers or moat — each has
// its own block). Paraphrased from the FY2026 10-K, Item 1 ("Our Company"). It replaces the old expandable DESC (B2 #3):
// DESC's moat sentence is the 2×2 "The edge" (OV-3), its supplier sentence (TSMC, SK hynix, Foxconn) goes to
// Bottom Line ▸ Supply Chain, and Mellanox to the Timeline (OV-7). DESC stays below until those units are approved.
var NV_LEDE = 'NVIDIA designs accelerated-computing platforms: graphics processors, central processors and networking chips, sold on their own or built into complete data-center systems, together with the software developers use to program them. The company started in graphics for video games and now describes itself as a data center scale AI infrastructure company. It is fabless — it designs the chips and systems, and partners manufacture and assemble them.';
function stdLede(){ return '<p class="ov-lede">'+esc(NV_LEDE)+'</p>'; }



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
// prefix _mrg — _mg* is already taken by the Management org chart.
// _mrgData = full history (ascending) + the projection last. _mrgStart/_mrgEnd are the
// visible window (inclusive indices into _mrgData); the range slider drives them.
var _mrgSel = { gross:true, oper:true, net:true, ebitda:false, cfo:false, fcf:false };
var _mrgData = MARGIN_FALLBACK.concat([MARGIN_PROJ]);
var _mrgStart = 0, _mrgEnd = 0, _mrgChart = null, _mrgSource = 'fallback';
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

// ═══ OV-4 How NVIDIA makes money (playbook §8; copied from googl.js gmmBars/stdMoneyMap) ══════════════════════
// FY2026 10-K (acc. 0001045810-26-000021). Two views of the SAME total, both reconcile to $215,938M exactly:
//   Segments (Note 16):  Compute & Networking 193,479 + Graphics 22,459 = 215,938
//   Geography (Note 16, customer HEADQUARTERS — changed from billing location in Q3 FY26, prior years recast):
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
    econNote:'10-K Note 16, revenue by end market; growth vs FY2025. From Q1 FY2027 NVIDIA reports revenue by market platform as Hyperscale · ACIE · Edge (Deep Dive ▸ Top Line).' },
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
    '<span class="ave-subh-note">Source: NVIDIA FY2026 Form 10-K (Note 16 Segment Information: segments, geography, revenue by end market; income statement).</span></div>';
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
    if(kind==='splc'){ return nvdaSplcPop(id); }   // Bottom Line ▸ Supply Chain cards (nvda-splc.js)
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
// Every NVIDIA peer map on the page (Overview OV-6 and Valuation ▸ Peers) shares N_SC, so all of them re-render
// together: removing a peer in one removes it in the other (VA-PEERS spec).
function nScRenderAll(root){ document.querySelectorAll('.nvda-sc').forEach(function(w){ nScRenderOne(w); wireScChips(root, w); }); }
// Valuation ▸ Peers (VA-PEERS): the OV-6 map with the table under it, open.
function nvdaValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, kept beside the valuation work, with the numbers behind it. Multiples use live prices; removing a peer here removes it there too.</p>'+
    stdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company’s latest 10-K on SEC EDGAR (pulled Nov 2, 2026): NVIDIA FY2026 (to Jan 25, 2026), Marvell FY2026 (to Jan 31, 2026), Broadcom FY2025 (to Nov 2, 2025), Qualcomm FY2025 (to Sep 28, 2025), AMD and Intel FY2025 (to Dec 27, 2025). '+
    'EPS = diluted GAAP; EBITDA = operating income + depreciation + amortization of intangibles; net debt = total debt − cash − current marketable securities. '+
    'Forward = Bloomberg consensus FY2027 as of Sep 9, 2026, for NVIDIA only (the peers are not in the Bloomberg file). Price, market cap and EV live (Massive). Average and median exclude NVIDIA.</div>';
}
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


// ════════════════════════════════════════════════════════════════════════════════
// 3 — TECHNOLOGY  (work in progress)
// ════════════════════════════════════════════════════════════════════════════════
// CPU vs GPU contrast cards.
var CPU_GPU = [
  ['CPU — the brain', '#6B7A8F', 'A few powerful cores built for <b>general-purpose, sequential (linear) processing</b>. It runs the operating system and logic step by step — versatile, but it does one hard thing at a time.'],
  ['GPU — the accelerator', '#3E5A82', 'Thousands of smaller cores built for <b>parallel processing</b> — many simple calculations at once. The matrix math behind graphics and AI is massively parallel, which is exactly what a GPU is built for.'],
];
// What NVIDIA sells — the full stack, silicon up to software.
// [name, accent, description, product image (in img/products/)]
var TECH_STACK = [
  ['Software & ecosystem', '#1E2733', 'CUDA, cuDNN, TensorRT, AI Enterprise, NIM microservices and Omniverse — the platform developers build on. This is the moat.', ''],
  ['Systems', '#2C3E57', 'DGX / HGX servers and rack-scale "AI factories" — GB200 / GB300 NVL72 today, the new <b>Vera Rubin NVL72</b> (72 Rubin GPUs + 36 Vera CPUs), shipping from 3Q FY27. NVIDIA increasingly sells the whole rack, not just the chip.', 'nvda-gb300-nvl72.jpg'],
  ['Networking', '#3E5A82', 'NVLink (now 6th-gen, 3.6 TB/s on Rubin), InfiniBand and Spectrum-X Ethernet (from the Mellanox acquisition) — moving data between thousands of GPUs as if they were one.', 'nvda-networking.jpg'],
  ['Processors', '#5F7896', 'The GPU (Blackwell → <b>Rubin</b>, in production shipments from 3Q FY27), the CPU (Grace → the new <b>Vera</b>) and the BlueField DPU — designed together to work as one system.', 'nvda-superchip.jpg'],
  ['Silicon', '#8A97A8', 'Chips designed by NVIDIA, manufactured by TSMC, with HBM memory from SK hynix / Micron and advanced (CoWoS) packaging.', 'nvda-dies.jpg'],
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
  [2026, 336000000000, 'NVIDIA Rubin R200 (shipping from 3Q FY27)', 'n', 3, null],
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
  return '<div class="ov-chart-card"><div class="ov-chart-t">Transistors, process node &amp; AI compute · 1971–2026 '+
    '<span>(log scales · click a series in the legend to hide it)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="nvdaMooreChart"></canvas></div>'+
    '<div class="ov-asof nv-moore-note">As the <b>process node shrinks</b> more transistors fit per chip and <b>AI compute explodes</b> — Hopper and Blackwell deliver thousands of FP16 TFLOPS. <b>Vera Rubin</b> (production shipments from 3Q FY27) extends the curve to ~336B transistors. AI compute = dense FP16 Tensor Core throughput from NVIDIA’s datasheets; the CPUs of the 1970s–2000s predate the metric. Drag sideways to zoom the years, up or down to zoom the transistor axis; double-click resets.</div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-nvmoore="1"><span class="rs-collap-ic">▸</span> Data — what the chart draws <span class="rs-collap-sub">'+MOORE.length+' chips</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll" id="nvMooreTbl"></div></div></div></div>';
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
    return '<div class="gen-row"><div class="gen-name">'+esc(g[0])+(g[3]?' <span class="gen-tag">shipping from 3Q FY27</span>':'')+'</div>'+
      '<div class="gen-track"><div class="gen-fill'+(g[3]?' ramping':'')+'" style="--w:'+(g[2]/max*100).toFixed(1)+'%"></div></div>'+
      '<div class="gen-val">'+g[2]+'B</div></div>';
  }).join('')+'</div>'+
  '<div class="ov-asof">Bars = transistors per flagship data-center GPU (billions). <b>Vera Rubin</b> (R200, ~336B transistors) began production shipments in the third quarter of fiscal 2027 (10-Q for the quarter ended Jul 26, 2026).</div>'+
  '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-nvgen="1"><span class="rs-collap-ic">▸</span> Data — what the bars draw <span class="rs-collap-sub">'+GPU_GENS.length+' generations</span></button>'+
    '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Architecture · year</th><th>Chip</th><th>Transistors (billions)</th><th>vs previous</th></tr></thead><tbody>'+
    GPU_GENS.slice().reverse().map(function(g, i, arr){ var prev=arr[i+1]; return '<tr><td class="rs-ft-h">'+esc(g[0])+'</td><td>'+esc(g[1])+'</td><td>'+g[2]+'</td><td>'+(prev?('×'+(g[2]/prev[2]).toFixed(1)):'—')+'</td></tr>'; }).join('')+
    '</tbody></table></div></div></div>';
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

// B2 #22: the CUDA section of the old Technology tab, kept verbatim for Miscellaneous ▸ Competitive position.
var NV_CUDA_MOAT = '<b>CUDA</b> (2006) lets developers program the GPU directly. Twenty years later, essentially every AI framework, library and model is written and optimized for NVIDIA first — so developers build where the install base is, and the install base grows because that’s where the software is. That self-reinforcing loop, more than any single chip, is NVIDIA’s deepest moat and the source of its switching costs.';
function technologyBody(){
  var h = '';
  h += '<p class="ov-lede">At its core, NVIDIA sells <b>computing power</b>. This tab walks through the basic logic — from the transistor up to the full AI system. Who supplies each piece is in Bottom Line ▸ Supply Chain; why rivals struggle to dislodge NVIDIA is in Competitive position.</p>';

  // 1 — The basic logic: transistors & computing power
  h += sec('The basic logic: transistors = computing power',
    '<div class="ov-callout">A chip is built from <b>transistors</b> — tiny switches that flip between 0 and 1. Computing power comes from <b>how many you can pack into a given area</b>: shrink the transistors, fit more of them closer together, and you get more performance using less energy. Every generation of progress is, at bottom, "more transistors, smaller and closer."</div>'+
    transistorShrink()+
    bullets([
      'A modern GPU contains <b>tens of billions</b> of transistors.',
      'Beyond the transistors, a chip also carries <b>memory (HBM/RAM), cache and I/O controllers</b> — and increasingly several chips are packaged together (advanced packaging) to act as one.',
      'The whole industry — mapped under <b>Bottom Line ▸ Supply Chain</b> — exists to keep shrinking and packaging transistors.',
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

  // 5 — CUDA moat: moved to Miscellaneous ▸ Competitive position (B2 #22 → MISC-comp), text in NV_CUDA_MOAT.

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

  h += '<div class="ov-foot">Sources — transistor counts, process nodes and dense FP16 Tensor Core throughput: NVIDIA architecture whitepapers and datasheets (P100, V100, A100, H100, B200) and Intel’s published processor specifications (4004 to Core 2 Duo); Rubin: NVIDIA’s platform announcement (CES, Jan 2026) and Form 10-Q for the quarter ended Jul 26, 2026 (production shipments from 3Q FY27); Moore’s law: G. Moore, <i>Electronics</i>, Apr 19, 1965. Product line, systems and platforms: NVIDIA Form 10-K FY2026, Item 1. Product renders © NVIDIA (newsroom imagery), shown for illustration. The transistor animation and the CPU/GPU demo are illustrations, not to scale.</div>';
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
  _cgTimers.push(setTimeout(function(){ setS('cgGpuStat','done — 64 pixels in parallel'); }, 130));
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
var _mooreX=null, _mooreY=null;   // zoom windows: [minYear, maxYear] and [minTransistors, maxTransistors]
function mooreTable(){
  var el=document.getElementById('nvMooreTbl'); if(!el) return;
  var vis=function(i){ return !_mooreChart || _mooreChart.isDatasetVisible(i); };
  var cols=[];
  if(vis(0)) cols.push(['Transistors / chip', function(d){ return fmtTr(d[1]); }]);
  if(vis(1)) cols.push(['Process node', function(d){ return d[4]!=null ? d[4].toLocaleString('en-US')+' nm' : '—'; }]);
  if(vis(2)) cols.push(['AI compute (FP16 TFLOPS)', function(d){ return d[5]!=null ? d[5].toLocaleString('en-US') : '—'; }]);
  var rows=MOORE.filter(function(d){ return !_mooreX || (d[0]>=_mooreX[0] && d[0]<=_mooreX[1]); }).slice().reverse();
  el.innerHTML='<table class="rs-ft"><thead><tr><th class="rs-ft-h">Year</th><th>Chip</th>'+cols.map(function(c){ return '<th>'+c[0]+'</th>'; }).join('')+'</tr></thead><tbody>'+
    rows.map(function(d){ return '<tr><td class="rs-ft-h">'+d[0]+'</td><td>'+esc(d[2])+'</td>'+cols.map(function(c){ return '<td>'+c[1](d)+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table>';
}
function buildMooreChart(){
  var cv=document.getElementById('nvdaMooreChart');
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  var hidden={};
  if(_mooreChart){ [0,1,2].forEach(function(i){ hidden[i]=!_mooreChart.isDatasetVisible(i); }); _mooreChart.destroy(); _mooreChart=null; }
  var C_TR=SUMMIT_CAT[0], C_NM=SUMMIT_CAT[1], C_FL=SUMMIT_CAT[2], C_CPU='#9AA6B4';
  var tr=MOORE.map(function(d){ return { x:d[0], y:d[1], name:d[2], era:d[3] }; });
  var nm=MOORE.filter(function(d){ return d[4]!=null; }).map(function(d){ return { x:d[0], y:d[4], name:d[2] }; });
  var fl=MOORE.filter(function(d){ return d[5]!=null; }).map(function(d){ return { x:d[0], y:d[5], name:d[2] }; });
  var P={ parsing:{xAxisKey:'x',yAxisKey:'y'}, tension:0.12, pointBorderColor:'#fff', pointBorderWidth:1 };
  _mooreChart=new Chart(cv.getContext('2d'), {
    data:{ datasets:[
      Object.assign({ type:'line', label:'Transistors / chip (grey dots = Intel CPUs)', data:tr, yAxisID:'y', hidden:!!hidden[0],
        borderColor:C_TR, borderWidth:2, pointRadius:4, pointHoverRadius:7,
        pointBackgroundColor:tr.map(function(p){ return p.era==='n' ? C_TR : C_CPU; }) }, P),
      Object.assign({ type:'line', label:'Process node (nm)', data:nm, yAxisID:'yNm', hidden:!!hidden[1],
        borderColor:C_NM, borderWidth:2, borderDash:[5,3], pointRadius:3, pointHoverRadius:6,
        pointBackgroundColor:C_NM }, P),
      Object.assign({ type:'line', label:'AI compute (FP16 TFLOPS)', data:fl, yAxisID:'yFl', hidden:!!hidden[2],
        borderColor:C_FL, borderWidth:2, pointRadius:4, pointHoverRadius:7,
        pointBackgroundColor:C_FL }, P),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:{ duration:600, easing:'easeOutCubic' },
      interaction:{ mode:'nearest', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{size:11}, padding:10, color:'#5b6470' },
          // hiding a series also drops its column from the table under the chart (§0 rule 2)
          onClick:function(e, item, legend){ var ch=legend.chart; ch.setDatasetVisibility(item.datasetIndex, !ch.isDatasetVisible(item.datasetIndex)); ch.update(); mooreTable(); } },
        tooltip:{ callbacks:{
          title:function(it){ return it[0].raw.name+' ('+it[0].raw.x+')'; },
          label:function(ctx){ var v=ctx.raw.y, id=ctx.dataset.yAxisID;
            if(id==='yNm') return 'Process node: '+v+' nm';
            if(id==='yFl') return 'AI compute: '+(v>=1000?(v/1000).toFixed(2)+' PFLOPS':v+' TFLOPS')+' (FP16)';
            return 'Transistors: '+fmtTr(v); } } } },
      scales:{
        x:{ type:'linear', min:_mooreX?_mooreX[0]:1970, max:_mooreX?_mooreX[1]:2027, grid:{ display:false },
          ticks:{ color:'#8A93A0', font:{size:10}, stepSize:_mooreX?undefined:10, callback:function(v){ return Math.round(v); } } },
        y:{ type:'logarithmic', position:'left', min:_mooreY?_mooreY[0]:undefined, max:_mooreY?_mooreY[1]:undefined, grid:{ color:'rgba(0,0,0,.05)' },
          title:{ display:true, text:'Transistors / chip', color:'#5b6470', font:{size:10,weight:'600'} },
          ticks:{ color:'#8A93A0', font:{size:9}, callback:function(v){ return fmtTr(v); } } },
        yNm:{ type:'logarithmic', position:'right', grid:{ drawOnChartArea:false }, reverse:false,
          title:{ display:true, text:'Process node (nm)', color:'#5b6470', font:{size:10,weight:'600'} },
          ticks:{ color:'#8A93A0', font:{size:9}, callback:function(v){ return v+'nm'; } } },
        yFl:{ type:'logarithmic', position:'right', grid:{ drawOnChartArea:false },
          title:{ display:true, text:'AI TFLOPS', color:'#5b6470', font:{size:10,weight:'600'} },
          ticks:{ color:'#8A93A0', font:{size:9}, callback:function(v){ return v>=1000?(v/1000)+'P':v; } } }
      }
    }
  });
  attachBrush(cv, _mooreChart,
    function(a, b){ if(b-a<1) return; _mooreX=[a, b]; buildMooreChart(); },
    function(a, b){ if(!(b>a)) return; _mooreY=[a, b]; buildMooreChart(); },
    function(){ _mooreX=null; _mooreY=null; buildMooreChart(); });
  mooreTable();
  var hd=document.querySelector('.rs-collap-h[data-nvmoore]');
  if(hd && !hd._wired){ hd._wired=true; hd.addEventListener('click', function(){ var bd=hd.nextElementSibling; if(!bd) return; bd.hidden=!bd.hidden;
    var ic=hd.querySelector('.rs-collap-ic'); if(ic) ic.textContent=bd.hidden?'▸':'▾'; }); }
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
  requestAnimationFrame(function(){ initCpuGpu(); buildMooreChart(); initTransistor(); initGenBars(); initSellsMap(); wireGenTable(); });
}
// The generation table's own toggle (data-selfwired: nothing else flips it).
function wireGenTable(){
  var hd=document.querySelector('.rs-collap-h[data-nvgen]'); if(!hd || hd._wired) return; hd._wired=true;
  hd.addEventListener('click', function(){ var bd=hd.nextElementSibling; if(!bd) return; bd.hidden=!bd.hidden;
    var ic=hd.querySelector('.rs-collap-ic'); if(ic) ic.textContent=bd.hidden?'▸':'▾'; });
}
function stopTech(){
  if(_trTimer){ clearInterval(_trTimer); _trTimer=null; }
  _cgTimers.forEach(clearTimeout); _cgTimers=[];
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
    // BL-SEG (nvda-bl.js): the old Segments pane leaves the screen — #10–13, #16 live in Top Line, #14 (GAAP segments table
    // and text) here, #15 in Earnings ▸ Setup. segmentsBody() stays in this file, unmounted, until F-FINAL.
    { k:'segments', l:'Segments', body:nvdaBlSegmentsHtml() },
    { k:'supplychain', l:'Supply Chain', body:nvdaSplcBody()+'<div class="ov-sec meta-splc-geo">'+oldPane('industry', industryBody())+'</div>' }, // BL-SPLC (nvda-splc.js) + B2 #35 semis map below
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
    { k:'histmult', l:'Historic Multiple', body:nvdaHistMult.body() },   // VA-HIST (nvda-histmult.js)
    { k:'peers', l:'Peers', body:nvdaValuationPeersBody() },              // VA-PEERS: the OV-6 map + its table
    // VA-TM (nvda-target-multiple.js). The old pane (heroMultiples + valuationBody) is off screen: its tiles (#2),
    // "apply a multiple" (#33) and DCF targets (#34) are VA-TM's recorded / Live modes and PEG block, its case builder
    // (#32) is VA-SENS. The functions stay in this file until F-FINAL.
    { k:'targetmult', l:'Target Multiple', body:nvdaTargetMult.body() },
    { k:'submits', l:'Submit History', body:submitsHtml('NVDA') },        // VA-SUB (engine js/submits.js)
    { k:'sensitivity', l:'Sensitivity', body:nvdaSens.body() },             // VA-SENS (nvda-sensitivity.js)
  ], true);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:NVDA_MGMT.body() },        // MG-TEAM (B2 #25: the old org tree → the shared engine)
    { k:'ownership', l:'Ownership', body:nvdaOwnBody() },               // MG-OWN (B2 #26: insider table)
    { k:'governance', l:'Governance & SBC', body:nvdaGovBody() },       // MG-GOV
    { k:'track', l:'Track Record', body:nvdaTrackBody() },              // MG-TRACK (no ratings, SAB)
  ], true);
  h+=subtabs('misc',[
    { k:'tech', l:'Technology', body:oldPane('technology', technologyBody()) },     // B2 #17–24 (MISC-tech)
    { k:'comp', l:'Competitive position', body:nvdaCompBody(NV_CUDA_MOAT, DIFF.flywheel) },   // MISC-comp (nvda-comp.js; B2 #22 + #39)
    { k:'capacity', l:'Capacity → revenue', body:nvdaCapacityBody() },                         // MISC-capacity (nvda-capacity.js)
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
    if(key==='segments') requestAnimationFrame(function(){ nvdaBlSegmentsBuild(root); });
    else if(key==='margins') requestAnimationFrame(function(){ nvdaBlGeneralBuild(root); });
    else if(key==='supplychain') requestAnimationFrame(function(){ nvdaSplcBuild(root); semiIndustry.init(); });
  } else if(group==='evolution'){
    if(key==='earnings') nvdaCeBuild(root);
    else if(key==='results') requestAnimationFrame(function(){ initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'NVDA'); });
    else if(key==='estevo') requestAnimationFrame(function(){ initResultsEvo('NVDA'); });
  } else if(group==='valuation'){
    if(key==='histmult') requestAnimationFrame(function(){ nvdaHistMult.init(root); });
    else if(key==='peers') requestAnimationFrame(function(){ wireScatters(root); });
    else if(key==='submits') requestAnimationFrame(function(){ initSubmits(root,'NVDA'); });
    else if(key==='targetmult') requestAnimationFrame(function(){ nvdaTargetMult.init(root); });
    else if(key==='sensitivity') requestAnimationFrame(function(){ nvdaSens.init(root); });
  } else if(group==='mgmt'){
    if(key==='team') NVDA_MGMT.init(root);
    else if(key==='ownership') nvdaOwnInit(root);
  } else if(group==='misc'){
    if(key==='tech') initTech();
    else if(key==='capacity') requestAnimationFrame(function(){ nvdaCapacityBuild(root); });
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
