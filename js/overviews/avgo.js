// overviews/avgo.js — custom Overview for Broadcom Inc. (Nasdaq: AVGO)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Ported from a standalone foundational-research dashboard, adapted to the portal's
// multi-tab overview shell (.ovt-tabs / .ovt-pane) and CSS-scoped under `.ov-avgo`
// (see css/avgo.css) so the dashboard's generic class names can't collide with the
// rest of the portal. Charts use Chart.js 4.4.1 + the annotation plugin (both loaded
// in index.html). Tabs:
//   1 Segments               — segment revenue/mix/margin, KPI driver trees, product scope.
//   2 Guidance               — the DCF guidance map (line by line) + debate priorities.
//   3 AI Revenue             — AI dollars/growth/networking mix + the margin story.
//   4 Customer Concentration — concentration over time + disclosure history.
//   5 Value Chain            — where Broadcom's reach starts/ends (clickable, sourced).
//   6 GW Roadmap             — contractual gigawatt commitments by customer + networking mix.
//   6b Customer Commitments  — deal chronology, duration/horizon & implications (the order book).
//   7 Management             — All Management (leadership + live ownership/insider) & Hock Tan.
//   8 M&A Deep Dive          — the capital-allocation machine, 7 deals + financial impact.
//
// Figures: Broadcom reports in US dollars on a fiscal year ending ~early November.
// Sources are noted per card (10-K FY2025, Q1/Q2 FY26 calls & press releases, 8-K Apr 2026).
// "LT" / projection figures are management guidance, not contract. Live ownership/insider
// (Management tab) is pulled from Fiscal.ai via api.js — the same source as the Pillars tab.

import { fetchExecutives, fetchInsiderTransactions, syncManagement, liveQuote, fetchMargins } from '../api.js';
import { semiIndustry } from './semi-industry.js';

// Register the annotation plugin once (used by the M&A financial-impact charts).
if (window.Chart && window['chartjs-plugin-annotation']) {
  try { window.Chart.register(window['chartjs-plugin-annotation']); } catch (e) {}
}

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function formatShares(n){ if(n==null||n==='') return '—'; var v=Number(n); if(!isFinite(v)) return '—'; if(Math.abs(v)>=1e6) return (v/1e6).toFixed(2)+'M'; if(Math.abs(v)>=1e3) return (v/1e3).toFixed(1)+'K'; return v.toLocaleString(); }

var _company = null;      // set in html(c); init() runs with no args, so we stash it.
var _mgLoaded = false;    // guard the live management fetch per render

// ════════════════════════════════════════════════════════════════════════════════
//  CHART CONFIG HELPERS (ported from the source dashboard)
// ════════════════════════════════════════════════════════════════════════════════
var baseOpts = {responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
  plugins:{legend:{labels:{font:{family:'Figtree',size:11},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:16,boxHeight:8}},
    tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7}},
  scales:{x:{grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE',maxRotation:0,maxTicksLimit:9}},
    y:{grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE'}}}};

var donutOpts = {responsive:true,maintainAspectRatio:false,cutout:'58%',plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:10},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:10,boxHeight:8,padding:8}},tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:10},bodyFont:{family:'Figtree',size:11},padding:8,cornerRadius:6,callbacks:{label:function(c){return c.label+': '+c.raw+'%';}}}}};

// Drag-to-pan / wheel-to-zoom on the y axis (nice-to-have from the source dashboard).
function yDrag(chart,el,keys){
  keys = keys || ['y'];
  var d=false,ly=0,sr={};
  el.addEventListener('mousedown',function(e){d=true;ly=e.clientY;keys.forEach(function(k){var s=chart.scales[k];if(s)sr[k]={min:s.min,max:s.max};});});
  document.addEventListener('mousemove',function(e){if(!d)return;var dy=e.clientY-ly,h=chart.chartArea.bottom-chart.chartArea.top;
    keys.forEach(function(k){var r=sr[k],rg=r.max-r.min,sh=-(dy/h)*rg;chart.options.scales[k].min=r.min+sh;chart.options.scales[k].max=r.max+sh;});chart.update('none');});
  document.addEventListener('mouseup',function(){d=false;});
  el.addEventListener('wheel',function(e){e.preventDefault();var f=e.deltaY>0?1.12:0.88;keys.forEach(function(k){var s=chart.scales[k],r=s.max-s.min,c=(s.max+s.min)/2;chart.options.scales[k].min=c-(r*f)/2;chart.options.scales[k].max=c+(r*f)/2;});chart.update('none');},{passive:false});
  el.addEventListener('dblclick',function(){keys.forEach(function(k){delete chart.options.scales[k].min;delete chart.options.scales[k].max;});chart.update();});
  el.style.cursor='ns-resize';
}

// Destroy any chart already bound to a canvas, then build fresh (idempotent re-renders).
function freshChart(id, cfg){
  var el = document.getElementById(id); if(!el || !window.Chart) return null;
  var prev = window.Chart.getChart(el); if(prev) prev.destroy();
  return new window.Chart(el, cfg);
}

// ─── shared render helpers ────────────────────────────────────────────────────
function card(title, sub, body, source){
  return '<div class="card"><div class="card-header"><span class="card-title">'+title+'</span>'+
    (sub?'<span class="card-subtitle">'+sub+'</span>':'')+'</div>'+body+
    (source?'<div class="source">'+source+'</div>':'')+'</div>';
}

// One entry in a .tl vertical timeline: colored dot, a header line (date badge + chips/badges), a description.
function tlItem(color, date, head, desc){
  return '<div class="tl-i">'+
    '<span class="tl-dot" style="background:'+color+'"></span>'+
    '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="tl-yr">'+date+'</span>'+head+'</div>'+
    '<div class="tl-d">'+desc+'</div></div>';
}

// ════════════════════════════════════════════════════════════════════════════════
// 1 — SEGMENTS
// ════════════════════════════════════════════════════════════════════════════════
var SEG_FY=['FY17','FY18','FY19','FY20','FY21','FY22','FY23','FY24','FY25'];
var totalRev=[17636,20848,22597,23888,27450,33203,35819,51574,63887];
var semiRev=[17636,19068,17441,17267,20383,25818,28182,30096,36858];
var swRev=[0,1780,5156,6621,7067,7385,7637,21478,27029];
var semiOM=[null,49,49,50,54,58,58,56,58];
var swOM=[null,65,66,66,70,71,74,65,77];
var segEvents=['Pre-SW','CA','Symantec','—','—','—','—','VMware','VMware FY'];

function segmentsBody(){
  return ''+
  card('Segment revenue, mix &amp; margin','$M',
    '<div class="card-body" style="padding:0"><table class="tbl">'+
      '<thead><tr><th>FY</th><th>Total</th><th>Semi</th><th>SW</th><th>Semi %</th><th>SW %</th><th>Semi OM</th><th>SW OM</th><th style="text-align:left">Event</th></tr></thead>'+
      '<tbody id="segBody"></tbody></table></div>',
    'User-provided data + 10-K FY25. OM = segment operating income ÷ revenue.')+

  '<div class="card"><div class="card-header"><span class="card-title">KPI driver trees</span>'+
    '<div class="seg-toggle" data-seg-group="kpi">'+
      '<button class="seg-btn active" data-seg="semi">Semiconductors</button>'+
      '<button class="seg-btn" data-seg="sw">Software</button></div></div>'+
    '<div class="card-body">'+
      '<div class="seg-panel active" data-panel="kpi-semi">'+
        '<div class="prose" style="margin-bottom:10px"><p>Audited 10-K reports <strong>one number</strong>. Management runs calls on an <strong>AI-vs-non-AI</strong> cut. AI = custom silicon (XPUs) + AI networking; lives mostly inside the Networking Connectivity end market.</p></div>'+
        '<div class="mini-grid c2">'+
          '<div class="mini l-ai"><div class="mini-t">AI — XPUs</div><div class="mini-d">Custom accelerators</div><span class="driver-pill">customers × content/GW × GW</span></div>'+
          '<div class="mini l-ai"><div class="mini-t">AI — Networking</div><div class="mini-d">Switches, DSPs, optical</div><span class="driver-pill">cluster size · attach to compute</span></div>'+
          '<div class="mini l-amber"><div class="mini-t">Non-AI — 4 markets</div><div class="mini-d">Wireless, broadband, server/storage, industrial</div><span class="driver-pill">end-market cycle × content/device</span></div>'+
          '<div class="mini l-blue"><div class="mini-t">Engine: design wins</div><div class="mini-d">Win a socket → ship for its life</div><span class="driver-pill">backlog = leading indicator</span></div>'+
        '</div></div>'+
      '<div class="seg-panel" data-panel="kpi-sw">'+
        '<div class="prose" style="margin-bottom:10px"><p>A <strong>renewal-and-conversion machine</strong>, not a units business. Drivers are retention, price, conversion.</p></div>'+
        '<div class="mini-grid c2">'+
          '<div class="mini l-purple"><div class="mini-t">VMware / VCF</div><div class="mini-d">Convert perpetual → subscription, land top ~10k accounts</div><span class="driver-pill">ARR +19% YoY</span></div>'+
          '<div class="mini l-purple"><div class="mini-t">Upsell services</div><div class="mini-d">Security, AI, recovery on top of VCF</div><span class="driver-pill">price at renewal</span></div>'+
          '<div class="mini l-amber"><div class="mini-t">Legacy (harvest)</div><div class="mini-d">Mainframe, cyber, enterprise, SAN</div><span class="driver-pill">high retention, low growth</span></div>'+
          '<div class="mini l-blue"><div class="mini-t">KPIs reported</div><div class="mini-d">ARR · Bookings · TCV ($9.2B Q1)</div><span class="driver-pill">forward signals</span></div>'+
        '</div></div>'+
    '</div></div>'+

  '<div class="grid-2">'+
    card('The "Other / Unallocated" line','',
      '<div class="card-body"><div class="caution"><strong>Segment OI (~$45B combined) ≈ 2× total GAAP operating income ($25.5B).</strong> The gap is M&amp;A cost excluded from segments: intangible amortization, SBC, restructuring. −$16.5B in FY25. Goodwill + intangibles ≈ $128B of the $170B balance sheet — the residue of the roll-up.</div></div>','')+
    card('Three reporting lenses','',
      '<div class="card-body"><div class="mini-grid" style="gap:8px">'+
        '<div class="mini l-blue"><div class="mini-t">By segment</div><div class="mini-d">Semi / Software — the real economic cut</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">By type</div><div class="mini-d">Products / Subscriptions — contaminated by $7.8B upfront license in "Products". Don\'t model off it.</div></div>'+
        '<div class="mini l-pink"><div class="mini-t">By geography</div><div class="mini-d">~58% "APAC" = where CMs take delivery, not end-demand. Low signal.</div></div>'+
      '</div></div>','')+
  '</div>'+

  '<div class="card"><div class="card-header"><span class="card-title">Product scope — what\'s inside each segment</span>'+
    '<div class="seg-toggle" data-seg-group="scope">'+
      '<button class="seg-btn active" data-seg="semi">Semiconductors</button>'+
      '<button class="seg-btn" data-seg="sw">Software</button></div></div>'+
    '<div class="card-body">'+
      '<div class="seg-panel active" data-panel="scope-semi">'+
        '<table class="scope"><thead><tr><th style="width:24%">Product</th><th style="width:40%">Plain terms</th><th style="width:36%">Who buys it</th></tr></thead><tbody>'+
          '<tr><td><span class="pn">Custom Silicon / XPUs</span><br><span class="badge b-ai" style="margin-top:4px">AI</span></td>'+
            '<td>Custom AI chips Broadcom co-designs for one customer to run its models. The biggest growth driver.</td>'+
            '<td><div class="logo-row"><span class="logo-chip lc-google"><span class="dot"></span>Google</span><span class="logo-chip lc-meta"><span class="dot"></span>Meta</span><span class="logo-chip lc-anthropic"><span class="dot"></span>Anthropic</span><span class="logo-chip lc-openai"><span class="dot"></span>OpenAI</span><span class="badge b-neutral">+2 unnamed</span></div></td></tr>'+
          '<tr><td><span class="pn">Ethernet Switching &amp; Routing</span><br><span class="badge b-accent" style="margin-top:4px">AI + non-AI</span></td>'+
            '<td>Switch/router chips (Tomahawk, Jericho) that wire chips into clusters. Also ordinary enterprise/carrier networks.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Hyperscalers</span><span class="logo-chip lc-nvidia"><span class="dot"></span>+ Nvidia-GPU users</span><span class="badge b-neutral">Telecom OEMs</span></div><div style="font-size:10px;color:var(--text-tertiary);margin-top:4px">~90% share in deep-buffer AI switching</div></td></tr>'+
          '<tr><td><span class="pn">PHYs · DSPs · Optical</span><br><span class="badge b-accent" style="margin-top:4px">AI + non-AI</span></td>'+
            '<td>Components moving data over copper/fiber at speed — transceivers, 1.6Tb DSPs, lasers. Plus automotive Ethernet.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Data-center buyers</span><span class="badge b-neutral">Optical-module makers</span></div></td></tr>'+
          '<tr><td><span class="pn">RF / FBAR · Wi-Fi</span><br><span class="badge b-warn" style="margin-top:4px">non-AI</span></td>'+
            '<td>Radio-signal filters (proprietary FBAR) and Wi-Fi/BT chips in smartphones. Seasonal "phone" business.</td>'+
            '<td><div class="logo-row"><span class="logo-chip lc-apple"><span class="dot"></span>Apple*</span><span class="badge b-neutral">Premium handset OEMs</span></div><div style="font-size:10px;color:var(--text-tertiary);margin-top:4px">*consensus, unnamed in 10-K</div></td></tr>'+
          '<tr><td><span class="pn">Server &amp; Storage</span><br><span class="badge b-warn" style="margin-top:4px">mostly non-AI</span></td>'+
            '<td>PCIe switches (AI + non-AI), SAS/RAID, Fibre Channel, HDD/SSD controllers.</td>'+
            '<td><div class="logo-row"><span class="logo-chip lc-dell"><span class="dot"></span>Dell</span><span class="logo-chip lc-hpe"><span class="dot"></span>HPE</span><span class="badge b-neutral">Storage OEMs</span></div></td></tr>'+
          '<tr><td><span class="pn">Broadband</span><br><span class="badge b-warn" style="margin-top:4px">non-AI</span></td>'+
            '<td>Set-top-box &amp; broadband-access chips (cable, fiber/PON, Wi-Fi). Recovering most strongly.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Cable &amp; telecom operators</span></div></td></tr>'+
          '<tr><td><span class="pn">Industrial</span><br><span class="badge b-warn" style="margin-top:4px">non-AI</span></td>'+
            '<td>Optocouplers, sensors, LEDs, automotive (EV, ADAS). Slowest, longest-cycle.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Factory / auto / medical / defense</span></div></td></tr>'+
        '</tbody></table>'+
        '<div class="insight" style="margin-top:11px"><strong>Switching straddles AI &amp; non-AI</strong> — you can\'t equate "all networking = AI". Management\'s AI figure carves out only the AI portion.</div></div>'+
      '<div class="seg-panel" data-panel="scope-sw">'+
        '<table class="scope"><thead><tr><th style="width:24%">Portfolio</th><th style="width:40%">Plain terms</th><th style="width:36%">Who buys it</th></tr></thead><tbody>'+
          '<tr><td><span class="pn">Private Cloud (VMware/VCF)</span><br><span class="badge b-sw" style="margin-top:4px">the engine</span></td>'+
            '<td>Run your own private cloud in your own data center instead of renting AWS/Azure. Runs on the customer\'s hardware — Broadcom ships no hardware here.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Fortune 500</span><span class="badge b-neutral">Banks · insurers</span><span class="badge b-neutral">Telecom · healthcare</span></div></td></tr>'+
          '<tr><td><span class="pn">Mainframe</span><br><span class="badge b-warn" style="margin-top:4px">harvest · ex-CA</span></td>'+
            '<td>Tools that keep big-iron mainframes running. Nearly impossible to remove.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Largest banks · airlines · governments</span></div></td></tr>'+
          '<tr><td><span class="pn">Cybersecurity</span><br><span class="badge b-warn" style="margin-top:4px">harvest · Symantec</span></td>'+
            '<td>Endpoint, network, data security + identity/access management.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Large enterprises · governments</span></div></td></tr>'+
          '<tr><td><span class="pn">Enterprise Software</span><br><span class="badge b-warn" style="margin-top:4px">harvest</span></td>'+
            '<td>Plan/build/monitor software delivery — AIOps, automation, DevOps.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Large IT organizations</span></div></td></tr>'+
          '<tr><td><span class="pn">FC SAN Management</span><br><span class="badge b-warn" style="margin-top:4px">harvest · Brocade</span></td>'+
            '<td>Fibre-channel storage switches + software. Partly hardware sitting in the software segment.</td>'+
            '<td><div class="logo-row"><span class="badge b-neutral">Data centers · storage OEMs</span></div></td></tr>'+
        '</tbody></table>'+
        '<div class="insight" style="margin-top:11px"><strong>VCF runs on the customer\'s own hardware</strong> in their data center or a supported cloud — not on Broadcom infrastructure or Broadcom chips. Only VMware/VCF metrics are disclosed (ARR +19%, VCF +13%); legacy portfolios aren\'t separately quantified.</div></div>'+
    '</div><div class="source">Source: 10-K FY2025. Customer names where reliably known; otherwise buyer type. Logo chips are styled wordmarks, not official brand artwork.</div></div>'+

  '<div class="grid-2-wide">'+
    card('Revenue &amp; segment mix','FY17–25, $M',
      '<div class="card-body"><div class="chart-c"><canvas id="cRev"></canvas></div></div>',
      'Step-changes FY19 (Symantec) &amp; FY24 (VMware) are M&amp;A, not organic.')+
    card('Segment operating margins','software structurally more profitable',
      '<div class="card-body"><div class="chart-c md"><canvas id="cMargin"></canvas></div></div>','')+
  '</div>';
}

function initSegments(pane){
  if(pane._charted) return; pane._charted = true;
  // Segment table
  var tb = document.getElementById('segBody');
  if(tb){ tb.innerHTML='';
    for(var i=0;i<SEG_FY.length;i++){
      var sp=Math.round(100*semiRev[i]/totalRev[i]), wp=swRev[i]?Math.round(100*swRev[i]/totalRev[i]):0;
      var tr=document.createElement('tr'); if(i===2||i===7)tr.className='row-hi';
      tr.innerHTML='<td>'+SEG_FY[i]+'</td><td>$'+totalRev[i].toLocaleString()+'</td><td>$'+semiRev[i].toLocaleString()+'</td>'+
        '<td>'+(swRev[i]?'$'+swRev[i].toLocaleString():'—')+'</td><td>'+sp+'%</td><td>'+(wp?wp+'%':'—')+'</td>'+
        '<td>'+(semiOM[i]?semiOM[i]+'%':'—')+'</td><td>'+(swOM[i]?swOM[i]+'%':'—')+'</td>'+
        '<td style="text-align:left;font-size:10.5px;color:var(--text-secondary)">'+segEvents[i]+'</td>';
      tb.appendChild(tr);
    }
  }
  var ch1=freshChart('cRev',{type:'bar',data:{labels:SEG_FY,datasets:[
    {label:'Semiconductors',data:semiRev,backgroundColor:'#2E75B6',stack:'s',borderRadius:2},
    {label:'Software',data:swRev,backgroundColor:'#7030A0',stack:'s',borderRadius:2}]},
    options:Object.assign({},baseOpts,{scales:{x:Object.assign({},baseOpts.scales.x,{stacked:true}),y:Object.assign({},baseOpts.scales.y,{stacked:true,ticks:Object.assign({},baseOpts.scales.y.ticks,{callback:function(v){return '$'+(v/1000)+'B';}})})},
    plugins:Object.assign({},baseOpts.plugins,{tooltip:Object.assign({},baseOpts.plugins.tooltip,{callbacks:{label:function(c){return c.dataset.label+': $'+c.raw.toLocaleString()+'M';}}})})})});
  if(ch1) yDrag(ch1,document.getElementById('cRev'));
  var ch2=freshChart('cMargin',{type:'line',data:{labels:SEG_FY,datasets:[
    {label:'Semi OM',data:semiOM,borderColor:'#2E75B6',borderWidth:2.5,tension:0.3,pointRadius:0,pointHoverRadius:5,spanGaps:true},
    {label:'Software OM',data:swOM,borderColor:'#7030A0',borderWidth:2.5,tension:0.3,pointRadius:0,pointHoverRadius:5,spanGaps:true}]},
    options:Object.assign({},baseOpts,{scales:{x:baseOpts.scales.x,y:Object.assign({},baseOpts.scales.y,{min:40,max:85,ticks:Object.assign({},baseOpts.scales.y.ticks,{callback:function(v){return v+'%';}})})},
    plugins:Object.assign({},baseOpts.plugins,{tooltip:Object.assign({},baseOpts.plugins.tooltip,{callbacks:{label:function(c){return c.dataset.label+': '+c.raw+'%';}}})})})});
  if(ch2) yDrag(ch2,document.getElementById('cMargin'));
}

// ════════════════════════════════════════════════════════════════════════════════
// 2 — GUIDANCE  (static content; the tooltip .gq elements are pure CSS hover)
// ════════════════════════════════════════════════════════════════════════════════
function gRow(line,method,guide,note){
  return '<tr><td class="ln '+line.lvl+'">'+line.t+'</td><td class="method">'+method+'</td><td>'+guide+'</td><td>'+note+'</td></tr>';
}
function tip(q,src){ return '<span class="tip"><span class="tq">'+q+'</span><span class="tsrc">'+src+'</span></span>'; }

function guidanceBody(){
  var rows='';
  rows+='<tr class="sec"><td colspan="4">Revenue = SS + IS</td></tr>';
  rows+=gRow({lvl:'lvl1',t:'Total revenue'},'sum','<span class="gq down"><span class="tag-nt">NT</span>Q1\'26 $19.3B (+29%); Q2\'26 guide ~$22B (+47%). <span class="tag-lt">LT</span>No annual guide given.'+tip('Q1 revenue of $19.3B, up 29% YoY; guiding Q2 consolidated revenue to approximately $22B.','Q1 FY26 earnings call &amp; press release, Mar 4 2026')+'</span>','One-quarter cadence');
  rows+=gRow({lvl:'lvl2',t:'SS'},'sum AI + non-AI','<span class="gq down"><span class="tag-nt">NT</span>Q1\'26 $12.5B (+52%); Q2\'26 $14.8B (+76%).'+tip('Semiconductor revenue of $12.5B in Q1, up 52%; guided to about $14.8B in Q2.','Q1 FY26 earnings call, Mar 4 2026')+'</span>','');
  rows+=gRow({lvl:'lvl3',t:'AI'},'YoY growth','<span class="gq down"><span class="tag-nt">NT</span>Q1\'26 $8.4B (+106%); Q2\'26 $10.7B (+140%); XPU +140%; networking 33→40% of AI. <span class="tag-lt">LT</span>"&gt;$100B chips 2027"; ~10 GW / 6 customers; FY25 base ~$20B.'+tip('AI revenue of $8.4B, up over 100%; expect Q2 AI revenue of $10.7B. We see line of sight to AI revenue from chips in excess of $100B in 2027 across our customers.','Q1 FY26 call (Mar 2026) + Q4 FY25 call (Dec 2025)')+'</span>','$/GW varies "dramatically" — blend by customer');
  rows+=gRow({lvl:'lvl3',t:'Non-AI'},'YoY growth','<span class="gq down"><span class="tag-nt">NT</span>Q1\'26 $4.1B (flat); Q2\'26 ~$4.1B (+4%). <span class="tag-lt">LT</span>U-shaped recovery into mid/late \'26.'+tip('Non-AI semiconductor revenue was roughly $4.1B and has been bouncing along the bottom; recovery is U-shaped, expected through mid- to late-2026.','Q1 FY26 &amp; Q3 FY25 earnings calls')+'</span>','~$16–17B run-rate; flat/low-single');
  rows+=gRow({lvl:'lvl2',t:'IS'},'YoY growth','<span class="gq down"><span class="tag-nt">NT</span>Q1\'26 $6.8B (+1%); Q2\'26 ~$7.2B (+9%); VMware +13%; ARR +19%; TCV $9.2B. <span class="tag-lt">LT</span>FY26 "low double-digit".'+tip('Infrastructure software revenue of $6.8B; annualized booking value (ARR) growing roughly 19%; we expect software to grow low double-digit percentage in fiscal 2026.','Q1 FY26 call + Q4 FY25 call')+'</span>','ARR leads revenue; pick guide vs ARR');

  rows+='<tr class="sec"><td colspan="4">COGS = SS + IS + SBC COGS</td></tr>';
  rows+=gRow({lvl:'lvl1',t:'COGS total'},'sum','<span class="gq down"><span class="tag-nt">NT</span>Consol. GM 77%; Q2\'26 guide flat 77%.'+tip('Consolidated gross margin was 77% in Q1; we expect Q2 gross margin to be roughly flat sequentially.','Q1 FY26 earnings call (CFO), Mar 2026')+'</span>','HBM/systems are pass-through');
  rows+=gRow({lvl:'lvl2',t:'SS COGS'},'rev − GP (GM)','<span class="gq down"><span class="tag-nt">NT</span>Semi GM ~68% (+30bps). <span class="tag-lt">LT</span>Q4\'25: systems/racks WILL dilute. Q1\'26: Hock reversed — "not substantial".'+tip('Q4\'25: AI revenue carries lower gross margin and rack/system sales will dilute it. Q1\'26: those concerns are "a bit hallucinating"; the rack impact on margin is "not substantial at all."','Q4 FY25 call (Dec 2025) vs Q1 FY26 call (Mar 2026)')+'</span>','The key conflict — see below');
  rows+=gRow({lvl:'lvl2',t:'IS COGS'},'rev − GP (GM)','<span class="gq down"><span class="tag-nt">NT</span>IS GM 93%, stable.'+tip('Infrastructure software gross margin was 93% in the quarter.','Q1 FY26 earnings call, Mar 2026')+'</span>','Low debate');
  rows+=gRow({lvl:'lvl2',t:'SBC COGS'},'own line','<span class="gq down"><span class="tag-nt">NT</span>Total SBC $7,568M FY25 (COGS slice). <span class="tag-lt">LT</span>Schedule below.'+tip('Total stock-based compensation expense was $7,568M for fiscal 2025, recorded across cost of revenue and operating expense.','10-K FY2025, Stock-Based Compensation note')+'</span>','Don\'t double-count w/ Unalloc.');

  rows+='<tr class="sec"><td colspan="4">Gross Profit = SS + IS</td></tr>';
  rows+=gRow({lvl:'lvl2',t:'SS GP'},'gross margin','<span class="gq"><span class="tag-nt">NT</span>~68% margin.'+tip('Semiconductor gross margin was approximately 68%, up about 30 basis points year over year.','Q1 FY26 earnings call, Mar 2026')+'</span>','Mix-driven if AI split chips/systems');
  rows+=gRow({lvl:'lvl2',t:'IS GP'},'gross margin','<span class="gq"><span class="tag-nt">NT</span>~93% margin.'+tip('Infrastructure software gross margin was 93%.','Q1 FY26 earnings call, Mar 2026')+'</span>','Hold flat');

  rows+='<tr class="sec"><td colspan="4">Operating Expense = SS + IS + Unallocated</td></tr>';
  rows+=gRow({lvl:'lvl2',t:'SS OpEx'},'\'26 c-size / \'27+ growth','<span class="gq"><span class="tag-nt">NT</span>Q1\'26 $1.1B = 8% of semi rev; semi OM 60% (+260bps). <span class="tag-lt">LT</span>FY25 R&amp;D +18% ("mostly SBC"), SG&amp;A −15%.'+tip('Semiconductor operating margin was 60%, up 260 bps YoY. FY25 R&amp;D rose 18% (primarily higher stock-based comp); SG&amp;A fell 15% on lower headcount.','Q1 FY26 call (segment split) + 10-K FY2025 MD&amp;A')+'</span>','Use cash-ex-SBC growth; bake in leverage');
  rows+=gRow({lvl:'lvl3',t:'R&amp;D'},'common-size SS rev','<span class="gq blank">No quarterly history pre-Q1\'25 — common-size only.'+tip('Broadcom only began disclosing the operating-expense split by segment in Q1 FY26 (with a Q1 FY25 comparative). No earlier quarters exist for a YoY build.','10-K / Q1 FY26 segment disclosure')+'</span>','\'26 c-size, \'27+ growth');
  rows+=gRow({lvl:'lvl3',t:'SG&amp;A'},'common-size SS rev','<span class="gq blank">No quarterly history pre-Q1\'25 — common-size only.'+tip('Segment-level R&amp;D / SG&amp;A split first reported in Q1 FY26; yearly figures exist for 2023–25 only.','10-K / Q1 FY26 segment disclosure')+'</span>','\'26 c-size, \'27+ growth');
  rows+=gRow({lvl:'lvl2',t:'IS OpEx'},'\'26 c-size / \'27+ growth','<span class="gq"><span class="tag-nt">NT</span>Q1\'26 $979M; IS OM 78% (+190bps).'+tip('Infrastructure software operating margin was 78%, up about 190 bps year over year.','Q1 FY26 earnings call, Mar 2026')+'</span>','');
  rows+=gRow({lvl:'lvl2',t:'Unallocated'},'sum of 4','<span class="gq"><span class="tag-nt">NT</span>FY25 −$16,513M (−4%).'+tip('Unallocated expenses — amortization of acquisition-related intangibles, SBC, restructuring and acquisition costs — were $16,513M in fiscal 2025, down 4%.','10-K FY2025, Segment Operating Results')+'</span>','Mostly run-off, not growth');
  rows+=gRow({lvl:'lvl3',t:'Amort. of acq. intangibles'},'YoY growth','<span class="gq"><span class="tag-nt">NT</span>FY25 $8,062M ($6,031 COGS + $2,031 OpEx); OpEx piece −37%. <span class="tag-lt">LT</span>Runs off $32,273M net intangibles.'+tip('Amortization of acquisition-related intangibles: $6,031M in cost of revenue and $2,031M in operating expense; OpEx amortization fell 37% as non-VMware intangibles fully amortized. Net intangible assets were $32,273M.','10-K FY2025 income statement &amp; balance sheet')+'</span>','Declining schedule, not growth');
  rows+=gRow({lvl:'lvl3',t:'SBC'},'YoY growth','<span class="gq"><span class="tag-nt">NT</span>FY25 $7,568M. <span class="tag-lt">LT</span>Disclosed runoff: \'26 $8,301M · \'27 $7,118M · \'28 $4,985M · \'29 $2,689M · \'30 $740M.'+tip('Unrecognized stock-based compensation expected to vest: 2026 $8,301M, 2027 $7,118M, 2028 $4,985M, 2029 $2,689M, 2030 $740M.','10-K FY2025, SBC unrecognized-cost table')+'</span>','Use schedule + new-grant layer');
  rows+=gRow({lvl:'lvl3',t:'Restructuring &amp; other'},'YoY growth','<span class="gq"><span class="tag-nt">NT</span>FY25 $667M ($76 COGS + $591 OpEx); OpEx −61%.'+tip('Restructuring and other charges fell 61% in operating expense, primarily lower employee-termination costs as the VMware integration wound down.','10-K FY2025 MD&amp;A')+'</span>','Fade toward zero');
  rows+=gRow({lvl:'lvl3',t:'Acquisition-related costs'},'YoY growth','<span class="gq"><span class="tag-nt">NT</span>Declining as VMware integration completes.'+tip('Acquisition-related costs declined as VMware integration was substantially completed.','10-K FY2025 MD&amp;A')+'</span>','~Zero absent new deal');

  rows+='<tr class="sec"><td colspan="4">Operating Income = GP − OpEx (by segment)</td></tr>';
  rows+=gRow({lvl:'lvl2',t:'SS OI'},'GP − OpEx','<span class="gq"><span class="tag-nt">NT</span>Semi OM 60% Q1\'26 (expanding). FY25 segment OI $21,232M.'+tip('Semiconductor operating margin of 60% in Q1; fiscal 2025 semiconductor segment operating income was $21,232M.','Q1 FY26 call + 10-K FY2025 segment results')+'</span>','Don\'t let margin contract');
  rows+=gRow({lvl:'lvl2',t:'IS OI'},'GP − OpEx','<span class="gq"><span class="tag-nt">NT</span>IS OM 78% Q1\'26 (expanding). FY25 segment OI $20,765M.'+tip('Infrastructure software operating margin of 78%; fiscal 2025 software segment operating income was $20,765M.','Q1 FY26 call + 10-K FY2025 segment results')+'</span>','');

  rows+='<tr class="sec"><td colspan="4">Adj EBITDA = OpInc + D&amp;A + SBC + Restructuring + Acq Costs</td></tr>';
  rows+=gRow({lvl:'lvl1',t:'Adj EBITDA'},'bridge','<span class="gq"><span class="tag-nt">NT</span>~67–68% of rev; FY25 $43B = 67%; Q2\'26 ~68%. D&amp;A mostly amortization (depr. only ~$574M).'+tip('Adjusted EBITDA was about 67% of revenue in fiscal 2025; we expect Q2 adjusted EBITDA of approximately 68% of revenue. Depreciation was $574M.','Q1 FY26 call + 10-K FY2025 cash-flow statement')+'</span>','Master guardrail — must land ~67–68%');

  rows+='<tr class="sec"><td colspan="4">Cross-cutting (needed for DCF, outside your line list)</td></tr>';
  rows+=gRow({lvl:'lvl2',t:'Tax rate'},'assumption','<span class="gq"><span class="tag-nt">NT</span>Non-GAAP ~16.5% Q2\'26 (from 14%). <span class="tag-lt">LT</span>Singapore global min tax — material FY26.'+tip('We expect the non-GAAP tax rate to be approximately 16.5%, reflecting the global minimum tax; enactment in Singapore is effective in fiscal 2026 and expected to have a material impact.','Q1 FY26 call + 10-K FY2025 tax note')+'</span>','Step 14→16.5% in \'26');
  rows+=gRow({lvl:'lvl2',t:'Capex'},'% of rev','<span class="gq"><span class="tag-nt">NT</span>"Higher in FY26"; FY25 only ~$623M (fabless).'+tip('We expect capital expenditures to be higher in fiscal 2026 compared to fiscal 2025; purchases of property and equipment were $623M in 2025.','10-K FY2025 liquidity &amp; cash-flow statement')+'</span>','Low % of revenue');
  rows+=gRow({lvl:'lvl2',t:'Share count'},'assumption','<span class="gq"><span class="tag-nt">NT</span>~4.94B diluted; $10B buyback authorized.'+tip('Diluted share count guidance around 4.94B for Q2; board authorized a $10B repurchase program through end of 2026.','Q1 FY26 call + 10-K FY2025')+'</span>','');

  return ''+
  '<div class="card"><div class="card-header"><span class="card-title">DCF guidance map — line by line</span><span class="card-subtitle">tagged near-term (FY26 hard) vs long-term (FY27+ directional)</span></div>'+
    '<div class="card-body"><div class="legend" style="margin-bottom:11px">'+
      '<div class="legend-i"><span class="tag-nt">NT</span> FY26 hard guide / recent actual</div>'+
      '<div class="legend-i"><span class="tag-lt">LT</span> FY27+ directional / projection</div>'+
      '<div class="legend-i"><span class="blank" style="font-size:10.5px">blank</span> = not disclosed</div></div></div>'+
    '<div class="card-body" style="padding:0"><table class="gtbl">'+
      '<thead><tr><th style="width:20%">DCF line</th><th style="width:14%">Method</th><th style="width:46%">Management guidance</th><th style="width:20%">Modeling note</th></tr></thead>'+
      '<tbody>'+rows+'</tbody></table></div>'+
    '<div class="source">Sources: Q1 FY26 call + press release, Q4 FY25 call, Q3 FY25 call, Goldman conf, 10-K FY2025. LT figures are management projection, not contract.</div></div>'+

  card('The five debate priorities','ranked by valuation impact',
    '<div class="card-body"><div class="mini-grid c2">'+
      '<div class="mini l-coral"><div class="mini-t">1 · AI trajectory &amp; chips-vs-systems</div><div class="mini-d">Is your AI line chips-only ($100B \'27) or chips+systems? Drives revenue AND SS gross margin.</div></div>'+
      '<div class="mini l-amber"><div class="mini-t">2 · SS gross margin</div><div class="mini-d">Q4\'25 (dilutes) vs Q1\'26 (reversed). Resolve via chips/systems mix, or base + sensitivity.</div></div>'+
      '<div class="mini l-purple"><div class="mini-t">3 · Unallocated run-off &amp; "next deal"</div><div class="mini-d">3 of 4 lines decay toward zero absent a new deal — mechanically widens GAAP margin.</div></div>'+
      '<div class="mini l-blue"><div class="mini-t">4 · IS terminal growth</div><div class="mini-d">Low-double-digit now — does it fade post-VMware-conversion?</div></div>'+
      '<div class="mini l-teal"><div class="mini-t">5 · Operating leverage in OpEx</div><div class="mini-d">Hold the common-size ratio, or let it improve as AI scales?</div></div>'+
      '<div class="mini l-ai"><div class="mini-t">★ Guardrail</div><div class="mini-d">Adj EBITDA ~67–68%. If the build lands far off, a line assumption is wrong.</div></div>'+
    '</div></div>','');
}

// ════════════════════════════════════════════════════════════════════════════════
// 3 — AI REVENUE
// ════════════════════════════════════════════════════════════════════════════════
function aiRevenueBody(){
  return ''+
  '<div class="stats-row c5">'+
    '<div class="stat-card t-ai"><div class="stat-label">AI Rev Q2\'26</div><div class="stat-value">$10.8B</div><div class="stat-sub">+143% · record</div></div>'+
    '<div class="stat-card t-ai"><div class="stat-label">FY26 Guide</div><div class="stat-value">~$56B</div><div class="stat-sub">+~180% YoY</div></div>'+
    '<div class="stat-card t-accent"><div class="stat-label">FY27 Guide</div><div class="stat-value">&gt;$100B</div><div class="stat-sub">~10 GW</div></div>'+
    '<div class="stat-card t-pos"><div class="stat-label">AI % of Total</div><div class="stat-value">49%</div><div class="stat-sub">Q2\'26</div></div>'+
    '<div class="stat-card t-warn"><div class="stat-label">AI Bookings Q2</div><div class="stat-value">$30B+</div><div class="stat-sub">vs $10.8B shipped</div></div>'+
  '</div>'+

  card('AI revenue — dollars, growth &amp; networking mix','$B quarterly/annual · networking share overlaid',
    '<div class="card-body" style="padding-top:14px"><div class="chart-c" style="height:300px"><canvas id="cAIRev"></canvas></div></div>',
    'Q2 FY26 call + prior. Quarters Q3\'25–Q3\'26 are actuals/guide; FY26 (~$56B) and FY27 (&gt;$100B) are management annual guidance. Networking % (right axis) is management-stated for Q1/Q2\'26 (~33%/~40%), ~30% normal thereafter (illustrative forward).')+

  '<div class="grid-2">'+
    '<div class="card"><div class="card-header"><span class="card-title">The guidance, year by year</span></div>'+
      '<div class="card-body" style="padding:0"><table class="tbl">'+
        '<thead><tr><th>Period</th><th>AI Rev</th><th>Growth</th><th style="text-align:left">Basis</th></tr></thead><tbody>'+
          '<tr><td>FY25</td><td>~$20B</td><td>—</td><td style="text-align:left;font-size:11px;font-weight:400">actual base</td></tr>'+
          '<tr><td>Q1\'26</td><td>$8.4B</td><td>+106%</td><td style="text-align:left;font-size:11px;font-weight:400">actual</td></tr>'+
          '<tr><td>Q2\'26</td><td>$10.8B</td><td>+143%</td><td style="text-align:left;font-size:11px;font-weight:400">actual · record</td></tr>'+
          '<tr><td>Q3\'26</td><td>$16B</td><td>+&gt;200%</td><td style="text-align:left;font-size:11px;font-weight:400">guide</td></tr>'+
          '<tr class="row-hi"><td>FY26</td><td>~$56B</td><td>+~180%</td><td style="text-align:left;font-size:11px;font-weight:700">guide · H1 ~$19B, 2× in H2</td></tr>'+
          '<tr class="row-hi"><td>FY27</td><td>&gt;$100B</td><td>~+80%</td><td style="text-align:left;font-size:11px;font-weight:700">guide · ~10 GW, back-half loaded</td></tr>'+
          '<tr><td>FY28</td><td>"a lot more"</td><td>substantial</td><td style="text-align:left;font-size:11px;font-weight:400">directional</td></tr>'+
        '</tbody></table></div>'+
      '<div class="source">Chips only — see Hock\'s framing at right. The &gt;$100B FY27 figure is AI revenue from chips, not systems.</div></div>'+
    '<div class="card"><div class="card-header"><span class="card-title">"We\'re in the chip business only"</span><span class="card-subtitle">Hock Tan, Q2 FY26 call</span></div>'+
      '<div class="card-body">'+
        '<div class="prose" style="margin-bottom:10px"><p>Pressed on whether rack/system sales were diluting margin, management was emphatic: <strong>"No rack. It\'s all chips... we only chips."</strong> This retires the gross-margin worry from late FY25 — the AI franchise is silicon (XPUs + networking), not systems.</p></div>'+
        '<div class="mini-grid" style="gap:9px">'+
          '<div class="mini l-ai"><div class="mini-t">AI = XPUs + networking</div><div class="mini-d">"We provide chips... AI compute accelerators (XPUs) or networking chips that cluster them — switches, PCIe, DSP, lasers, NICs, routers."</div></div>'+
          '<div class="mini l-blue"><div class="mini-t">No rack/system revenue</div><div class="mini-d">The $100B 2027 figure is chips only. Any rack/system economics sit with the customer/ODM, not Broadcom.</div></div>'+
        '</div></div></div>'+
  '</div>'+

  '<div class="card"><div class="card-header"><span class="card-title">The margin story — gross margin dilutes, operating margin holds (or grows)</span></div>'+
    '<div class="card-body"><div class="grid-2-wide">'+
      '<div class="chart-c md"><canvas id="cAIMargin"></canvas></div>'+
      '<div><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-amber"><div class="mini-t">Gross margin falls — but it\'s mix, not structure</div><div class="mini-d">Q2 GM 77% (−230bps YoY); Q3 guide ~74%. Kirsten: this "does not represent a structural change... it reflects product mix between semiconductors and software."</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">Operating margin holds — even rises</div><div class="mini-d">Q2 op margin 67.3%, <strong>up 200bps YoY</strong> despite the GM fall, as opex stayed flat. Q3 guide ~67% (flat QoQ). Strong operating leverage.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Adj EBITDA at record</div><div class="mini-d">Q2 69% (record); Q3 guide ~68%. The master guardrail holds even as AI mix grows.</div></div>'+
      '</div></div></div>'+
      '<div class="insight" style="margin-top:12px"><strong>Why GM and OM move in opposite directions:</strong> AI semis (~70% GM) grow far faster than software (93% GM), pulling the <em>blended</em> gross margin down — pure mix. But because opex barely grows as revenue scales, operating margin <em>expands</em>. Management\'s instruction: <strong>"model semiconductor and infrastructure software margins separately"</strong> so the mix shift is captured properly rather than read as deterioration.</div></div>'+
    '<div class="source">Q2 FY26 call. Within semis, Kirsten notes ASICs/TPU and some wireless carry lower margins while AI networking/connectivity carries "very rich margins."</div></div>';
}

function initAIRevenue(pane){
  if(pane._charted) return; pane._charted = true;
  var aiL=['Q3 25','Q4 25','Q1 26','Q2 26','Q3 26e','FY26e','FY27e'];
  var aiRev=[5.2,6.5,8.4,10.8,16.0,56,103];
  var aiNetPct=[null,null,33,40,33,32,30];
  freshChart('cAIRev',{data:{labels:aiL,datasets:[
    {type:'bar',label:'AI revenue ($B)',data:aiRev,backgroundColor:['#1D9E75','#1D9E75','#1D9E75','#1D9E75','#9FE1CB','#9FE1CB','#9FE1CB'],borderRadius:3,yAxisID:'y',order:2},
    {type:'line',label:'Networking % of AI (right)',data:aiNetPct,borderColor:'#2E75B6',backgroundColor:'#2E75B6',borderWidth:2.5,tension:0.3,pointRadius:3,pointHoverRadius:5,spanGaps:false,yAxisID:'y1',order:1}
  ]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:10.5},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:14,boxHeight:8,padding:9}},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,callbacks:{label:function(c){return c.datasetIndex===0?'AI rev: $'+c.raw+'B'+(c.dataIndex>=4?' (guide)':''):(c.raw==null?'':'Networking: '+c.raw+'% of AI'+(c.dataIndex>=4?' (est.)':''));}}}},
    scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE'}},
      y:{position:'left',grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},title:{display:true,text:'AI revenue ($B)',font:{family:'Figtree',size:10},color:'#9AACBE'},ticks:{font:{family:'Figtree',size:10},color:'#9AACBE',callback:function(v){return '$'+v+'B';}}},
      y1:{position:'right',min:0,max:60,grid:{drawOnChartArea:false},border:{display:false},title:{display:true,text:'Networking % of AI',font:{family:'Figtree',size:10},color:'#2E75B6'},ticks:{font:{family:'Figtree',size:10},color:'#2E75B6',callback:function(v){return v+'%';}}}}}});

  var mL=['Q2 25','Q1 26','Q2 26','Q3 26e'];
  freshChart('cAIMargin',{type:'line',data:{labels:mL,datasets:[
    {label:'Gross margin',data:[79.4,77,77.1,74],borderColor:'#ED7D31',borderWidth:2.5,tension:0.3,pointRadius:3,pointHoverRadius:5},
    {label:'Operating margin',data:[65.3,66,67.3,67],borderColor:'#1D9E75',borderWidth:2.5,tension:0.3,pointRadius:3,pointHoverRadius:5},
    {label:'Adj EBITDA margin',data:[66,67,69,68],borderColor:'#2E75B6',borderWidth:2,borderDash:[4,3],tension:0.3,pointRadius:0,pointHoverRadius:4}
  ]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:10.5},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:14,boxHeight:8,padding:9}},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,callbacks:{label:function(c){return c.dataset.label+': '+c.raw+'%'+(c.dataIndex===3?' (guide)':'');}}}},
    scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE'}},
      y:{min:60,max:85,grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE',callback:function(v){return v+'%';}}}}}});
}

// ════════════════════════════════════════════════════════════════════════════════
// 4 — CUSTOMER CONCENTRATION
// ════════════════════════════════════════════════════════════════════════════════
var concFY=['FY17','FY18','FY19','FY20','FY21','FY22','FY23','FY24','FY25','Q1 26'];
var top5=[40,40,30,30,35,35,35,40,40,50];
var appleC=[20,25,20,15,20,20,20,null,null,null];
var distLg=[14,9,17,13,18,20,21,28,32,42];
var distTot=[28,34,46,42,53,56,57,48,48,null];
var concNote=['Foxconn named','Apple peak ~25%','top-5 dips; WT Micro; Huawei','Apple trough ~15%','','','last Apple disclosure','Apple drops; distributor unnamed','distributor 32%','top-5 jumps ~50%'];
var concLg=['Foxconn 14%','Foxconn 9%','WT Micro 17%','WT Micro 13%','WT Micro 18%','WT Micro 20%','WT Micro 21%','unnamed 28%','unnamed 32%','unnamed 42%'];

function concentrationBody(){
  return ''+
  '<div class="stats-row c4">'+
    '<div class="stat-card t-warn"><div class="stat-label">Top-5 Q1\'26</div><div class="stat-value">~50%</div><div class="stat-sub">of net revenue</div></div>'+
    '<div class="stat-card t-neutral"><div class="stat-label">Top-5 FY25</div><div class="stat-value">~40%</div><div class="stat-sub">vs ~30% FY20 trough</div></div>'+
    '<div class="stat-card t-accent"><div class="stat-label">Largest Distributor</div><div class="stat-value">42%</div><div class="stat-sub">Q1\'26 · a channel, not a buyer</div></div>'+
    '<div class="stat-card t-ai"><div class="stat-label">XPU Customers</div><div class="stat-value">6</div><div class="stat-sub">the AI concentration</div></div>'+
  '</div>'+

  card('Concentration over time','FY17–Q1\'26 · % of net revenue',
    '<div class="card-body"><div class="chart-c md"><canvas id="cConc"></canvas></div></div>',
    'From 10-K/10-Q customer-concentration disclosures. Apple % not disclosed after FY23. Q1\'26 top-5 is a single quarter, not full-year.')+

  '<div class="grid-2">'+
    card('The story changed character around FY24','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-pink"><div class="mini-t">FY17–23 — an Apple story</div><div class="mini-d">Apple disclosed every year, 15–25% of revenue (peak ~25% FY18). Concentration was about <strong>wireless</strong>.</div></div>'+
        '<div class="mini l-ai"><div class="mini-t">FY24+ — an AI story</div><div class="mini-d">Apple % <strong>drops from disclosure</strong>. The single named figure becomes "one semiconductor solutions customer, which is a distributor" — 28% → 32% → 42%, tracking the AI ramp.</div></div>'+
      '</div><div class="insight" style="margin-top:11px"><strong>The re-concentration:</strong> diversification (LSI, Broadcom, software) pulled top-5 down to ~30% by FY20; AI is now pulling it back up toward ~50%. A few hyperscalers are re-concentrating the book.</div></div>','')+
    card('Read it correctly','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-amber"><div class="mini-t">The "42% distributor" is a channel</div><div class="mini-d">"One customer, which is a <strong>distributor</strong>" routes demand to many end customers (was WT Microelectronics FY19–23). It is <strong>not</strong> a single buyer with 42% of the company.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Top-5 end customers is the real metric</div><div class="mini-d">~40% FY25 → ~50% Q1\'26 (through all channels). This is the genuine end-customer exposure.</div></div>'+
        '<div class="mini l-purple"><div class="mini-t">Apple is now buried</div><div class="mini-d">Since FY24 wireless concentration can\'t be tracked directly — folded into the undisclosed mix.</div></div>'+
      '</div></div>','')+
  '</div>'+

  card('Disclosure history','% of net revenue',
    '<div class="card-body" style="padding:0"><table class="tbl">'+
      '<thead><tr><th>FY</th><th>Top-5 end</th><th>Apple (all ch.)</th><th>Largest distributor</th><th>Distributors total</th><th style="text-align:left">Note</th></tr></thead>'+
      '<tbody id="concBody"></tbody></table></div>',
    'Figures as disclosed; "&gt;" / "~" reflect the filing\'s own language. Q1\'26 row is quarterly. Apple via Foxconn (FY17–18), then WT Microelectronics (FY19–23), then unnamed.')+

  card('Why it matters for the model','',
    '<div class="card-body"><div class="mini-grid c2">'+
      '<div class="mini l-ai"><div class="mini-t">AI growth = rising concentration</div><div class="mini-d">The 6 XPU customers are the concentration. If AI scales as guided, top-5 likely climbs further — model concentration risk as a <strong>function of AI mix</strong>.</div></div>'+
      '<div class="mini l-amber"><div class="mini-t">Single-customer sensitivity</div><div class="mini-d">Loss of, or a pullback from, one hyperscaler (e.g. an XPU customer self-building, or Google\'s MediaTek hedge) hits a larger share than in the diversified FY20 era.</div></div>'+
      '<div class="mini l-blue"><div class="mini-t">Two different risk profiles</div><div class="mini-d">Software is broad (Fortune 500); semis are concentrating. Blended risk is masked at the total level — assess by segment.</div></div>'+
      '<div class="mini l-pink"><div class="mini-t">Disclosure opacity</div><div class="mini-d">Channel routing (one distributor at 42%) obscures true end-customer detail. Treat named distributor figures as channel artifacts.</div></div>'+
    '</div></div>','');
}

function initConcentration(pane){
  if(pane._charted) return; pane._charted = true;
  var cc=freshChart('cConc',{data:{labels:concFY,datasets:[
    {type:'line',label:'Top-5 end customers',data:top5,borderColor:'#ED7D31',backgroundColor:'#ED7D31',borderWidth:2.5,tension:0.25,pointRadius:3,pointHoverRadius:5},
    {type:'line',label:'Apple (all channels)',data:appleC,borderColor:'#D4537E',backgroundColor:'#D4537E',borderWidth:2,borderDash:[4,3],tension:0.25,pointRadius:3,pointHoverRadius:5,spanGaps:false},
    {type:'line',label:'Largest distributor (channel)',data:distLg,borderColor:'#2E75B6',backgroundColor:'#2E75B6',borderWidth:2,tension:0.25,pointRadius:3,pointHoverRadius:5},
    {type:'bar',label:'Distributors total',data:distTot,backgroundColor:'rgba(136,153,170,0.18)',borderRadius:2,order:5}]},
    options:Object.assign({},baseOpts,{plugins:Object.assign({},baseOpts.plugins,{tooltip:Object.assign({},baseOpts.plugins.tooltip,{callbacks:{label:function(c){return c.raw==null?c.dataset.label+': n/d':c.dataset.label+': '+c.raw+'%';}}})}),
    scales:{x:baseOpts.scales.x,y:Object.assign({},baseOpts.scales.y,{min:0,max:60,ticks:Object.assign({},baseOpts.scales.y.ticks,{callback:function(v){return v+'%';}})})}})});
  if(cc) yDrag(cc,document.getElementById('cConc'));

  var cb=document.getElementById('concBody');
  if(cb){ cb.innerHTML='';
    for(var i=0;i<concFY.length;i++){
      var tr=document.createElement('tr'); if(i===9)tr.className='row-hi';
      var t5=(i<2?'>40%':i<4?'>30%':i<7?'~35%':i<9?'~40%':'~50%');
      var ap=appleC[i]==null?'<span style="color:var(--text-tertiary)">n/d</span>':'~'+appleC[i]+'%';
      var dt=distTot[i]==null?'<span style="color:var(--text-tertiary)">n/d</span>':distTot[i]+'%';
      tr.innerHTML='<td>'+concFY[i]+'</td><td>'+t5+'</td><td>'+ap+'</td><td style="font-weight:400">'+concLg[i]+'</td><td>'+dt+'</td>'+
        '<td style="text-align:left;font-size:10.5px;color:var(--text-secondary)">'+concNote[i]+'</td>';
      cb.appendChild(tr);
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 6 — GW ROADMAP  (defined before Value Chain in source order; kept as its own tab)
// ════════════════════════════════════════════════════════════════════════════════
function gwRoadmapBody(){
  return ''+
  '<div class="card"><div class="card-header"><span class="card-title">Contractual GW roadmap</span><span class="card-subtitle">compute capacity committed across the core customers · from Q2 FY26 call + 8-K</span></div>'+
    '<div class="card-body"><div class="prose" style="margin-bottom:6px"><p>Management now sizes AI demand in <strong>gigawatts of compute</strong>. The bars below show the per-customer commitments disclosed on the Q2 FY26 call and the April 8-K, accumulating through 2028. Read this as <em>disclosed commitments</em>, not a forecast — and note it does <strong>not</strong> cleanly reconcile to the ~10 GW top-down figure (Google\'s internal workloads aren\'t separately quantified). For the deal-by-deal chronology, sizes and horizons behind these bars, see the <strong>Customer Commitments</strong> tab.</p></div></div>'+
    '<div class="card-body" style="padding-top:0"><div class="chart-c" style="height:320px"><canvas id="cGW"></canvas></div></div>'+
    '<div class="source">Q2 FY26 call (Jun 3 2026) + Broadcom 8-K (Apr 6 2026). Anthropic 2027 uses the 8-K\'s ~3.5 GW (the call also phrased it as "another 5 GW"). Google internal GW not separately disclosed. Bars are cumulative deployed/committed GW by year-end.</div></div>'+

  card('The commitments, customer by customer','',
    '<div class="card-body" style="padding:0"><table class="tbl">'+
      '<thead><tr><th>Customer</th><th>2026</th><th>2027</th><th>2028</th><th style="text-align:left">Structure &amp; basis</th></tr></thead><tbody>'+
        '<tr><td><span class="logo-chip lc-google"><span class="dot"></span>Google</span></td><td>—</td><td>—</td><td>—</td><td style="text-align:left;font-size:11px;font-weight:400">Multi-gen TPU + networking <strong>through up to 2031</strong>; internal-workload GW not quantified. The anchor.</td></tr>'+
        '<tr><td><span class="logo-chip lc-anthropic"><span class="dot"></span>Anthropic</span></td><td>~1.0</td><td>~3.5</td><td>~3.5</td><td style="text-align:left;font-size:11px;font-weight:400">TPU-based compute <em>access</em> (not co-design); 2027 contingent on Anthropic\'s commercial success.</td></tr>'+
        '<tr><td><span class="logo-chip lc-openai"><span class="dot"></span>OpenAI</span></td><td>—</td><td>~1.3</td><td>~1.3</td><td style="text-align:left;font-size:11px;font-weight:400">Silicon delivered; production late \'26; 1.3 GW contractual \'27 within a larger 10 GW-by-\'29 frame.</td></tr>'+
        '<tr><td><span class="logo-chip lc-meta"><span class="dot"></span>Meta</span></td><td>—</td><td>~1.0</td><td>~3.0</td><td style="text-align:left;font-size:11px;font-weight:400">MTIA multi-gen; initial 1 GW (XPU+networking) delivers H2 \'27; ~3 GW through end \'28.</td></tr>'+
        '<tr><td><span class="badge b-neutral">+2 unnamed</span></td><td>start</td><td>ramp</td><td>ramp</td><td style="text-align:left;font-size:11px;font-weight:400">Shipments begin late \'26, accelerate into \'27; $6B POs to date.</td></tr>'+
        '<tr class="row-hi"><td>Top-down total</td><td>—</td><td>~10</td><td>"a lot more"</td><td style="text-align:left;font-size:11px;font-weight:700">~10 GW shipped in 2027 (back-half loaded); 2028 substantial growth. Separate from the per-customer sum.</td></tr>'+
      '</tbody></table></div>',
    '"—" = not disclosed / not yet ramping, not necessarily zero. Per-customer figures and the ~10 GW total are disclosed separately and don\'t reconcile exactly.')+

  '<div class="grid-2">'+
    card('Two relationship types in one roadmap','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-ai"><div class="mini-t">Co-design (silicon customers)</div><div class="mini-d"><strong>Google, Meta</strong> — design their own accelerator with Broadcom, own the chip. GW = their own deployed compute.</div></div>'+
        '<div class="mini l-purple"><div class="mini-t">Compute access (frontier labs)</div><div class="mini-d"><strong>Anthropic, OpenAI</strong> — buy access to TPU-based compute Broadcom provides, financed via the Apollo/Blackstone platform. GW = capacity consumed.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Why it matters</div><div class="mini-d">The access deals carry demand risk (Anthropic\'s is explicitly "dependent on continued commercial success") that the co-design deals don\'t.</div></div>'+
      '</div></div>','')+
    card('From GW to revenue','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-blue"><div class="mini-t">$/GW roughly stable</div><div class="mini-d">More power per chip, fewer chips, higher ASP each — content per GW holds, then <strong>steps up generation-to-generation</strong>, not continuously.</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">The revenue anchors</div><div class="mini-d">FY26 AI ~$56B (+180%); FY27 &gt;$100B; 2028 substantial growth. GW is the volume driver behind these.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Modeling caution</div><div class="mini-d">Don\'t multiply 10 GW × a single $/GW — content varies "dramatically" by customer. Blend by mix, or anchor to the disclosed revenue figures.</div></div>'+
      '</div></div>','')+
  '</div>'+

  '<div class="card"><div class="card-header"><span class="card-title">Networking as % of AI revenue — the second engine inside AI</span><span class="card-subtitle">the IP Broadcom has compounded longest, now attached to every cluster</span></div>'+
    '<div class="card-body"><div class="prose" style="margin-bottom:6px"><p>AI revenue is <strong>XPUs + networking</strong>, and the networking share is the tell. Broadcom\'s switching/SerDes/optical IP — the portfolio it has led for decades — attaches to <em>both</em> its own XPUs <strong>and</strong> Nvidia-GPU clusters, so it scales with the entire AI buildout, not just custom silicon. That\'s the structural reason the partnerships compound: every gigawatt of compute, whoever\'s chip sits in it, needs the wiring.</p></div></div>'+
    '<div class="card-body" style="padding-top:0"><div class="grid-2-wide">'+
      '<div class="chart-c md"><canvas id="cNet"></canvas></div>'+
      '<div><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-blue"><div class="mini-t">Q1 → Q2 FY26</div><div class="mini-d">Networking rose from ~33% to ~40% of AI revenue as both XPU and non-XPU networking shipped.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">40% was "stars align"</div><div class="mini-d">Hock: 40% is about as high as the share goes — a quarter where lots of non-XPU networking shipped alongside XPU growth.</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">~30% is the normal run-rate</div><div class="mini-d">Management guides the expected share back toward ~30% of AI revenue as XPU volume scales faster.</div></div>'+
      '</div></div></div></div>'+
    '<div class="source">Q2 FY26 call: networking ~1/3 of AI rev in Q1, ~40% in Q2; Hock frames 40% as a peak and ~30% as the expected normal share. The dashed line marks the ~30% normalization. FY26/27 splits are illustrative around that guidance, not disclosed quarterly.</div></div>'+

  card('Why the networking attach is the durable edge','',
    '<div class="card-body"><div class="mini-grid c3">'+
      '<div class="mini l-ai"><div class="mini-t">Sells to XPUs <em>and</em> GPUs</div><div class="mini-d">Tomahawk/Jericho/optical wire any cluster. Even an all-Nvidia world still buys Broadcom networking — the hedge inside the hedge.</div></div>'+
      '<div class="mini l-blue"><div class="mini-t">The longest-compounded IP</div><div class="mini-d">SerDes and switching are decades of accumulated lead — the moat that predates AI and now rides it. ~90% deep-buffer switching share.</div></div>'+
      '<div class="mini l-teal"><div class="mini-t">Richer margin than XPUs</div><div class="mini-d">Kirsten: AI networking/connectivity carries "very rich margins" that offset the lower-margin ASIC/TPU mix — so a higher networking share lifts blended GM.</div></div>'+
    '</div><div class="insight" style="margin-top:11px"><strong>For the AI-revenue model:</strong> split the AI line into XPU and networking. Networking ≈ 30% normal (up to ~40% in strong quarters), grows with total cluster build (XPU + GPU), and carries higher margin — so the XPU/networking mix drives both the revenue path <em>and</em> the blended AI gross margin.</div></div>','');
}

function initGwRoadmap(pane){
  if(pane._charted) return; pane._charted = true;
  var gwBase={responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:11},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:14,boxHeight:8,padding:10}},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,callbacks:{label:function(c){return c.dataset.label+': '+(c.raw>0?c.raw+' GW':'n/d');}}}},
    scales:{x:{stacked:true,grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:12,weight:'600'},color:'#6B7A8D'}},
      y:{stacked:true,grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},title:{display:true,text:'Committed / deployed GW',font:{family:'Figtree',size:10},color:'#9AACBE'},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE',callback:function(v){return v+' GW';}}}}};
  freshChart('cGW',{type:'bar',data:{labels:['2026','2027','2028'],datasets:[
    {label:'Anthropic',data:[1.0,3.5,3.5],backgroundColor:'#D97757',borderRadius:2,stack:'s'},
    {label:'OpenAI',data:[0,1.3,1.3],backgroundColor:'#444441',borderRadius:2,stack:'s'},
    {label:'Meta (MTIA)',data:[0,1.0,3.0],backgroundColor:'#0467DF',borderRadius:2,stack:'s'},
    {label:'+2 unnamed (illustrative)',data:[0,1.5,3.0],backgroundColor:'rgba(136,153,170,0.45)',borderRadius:2,stack:'s'}
  ]},options:gwBase});

  var netLabels=['Q1 26','Q2 26','Q3 26e','FY26e','FY27e'];
  freshChart('cNet',{type:'bar',data:{labels:netLabels,datasets:[
    {type:'bar',label:'Networking % of AI rev',data:[33,40,33,32,30],backgroundColor:['#2E75B6','#2E75B6','#9FB8D4','#9FB8D4','#9FB8D4'],borderRadius:3,order:2},
    {type:'line',label:'~30% normal share (guided)',data:[30,30,30,30,30],borderColor:'#ED7D31',borderWidth:2,borderDash:[5,4],pointRadius:0,order:1}
  ]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:10.5},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:14,boxHeight:8,padding:9}},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,callbacks:{label:function(c){return c.dataset.label+': '+c.raw+'%'+(c.dataIndex>=2&&c.datasetIndex===0?' (est.)':'');}}}},
    scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE'}},
      y:{min:0,max:50,grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE',callback:function(v){return v+'%';}}}}}});
}

// ════════════════════════════════════════════════════════════════════════════════
// 6b — CUSTOMER COMMITMENTS  (deal chronology, duration/horizon & implications)
// The GW Roadmap tab shows committed GW *by year*; this tab is the *deal book* — each
// customer/infrastructure commitment as disclosed over time, with its size, horizon
// and what it implies. Data: company press releases, 8-Ks, Q3 FY25–Q2 FY26 calls.
// ════════════════════════════════════════════════════════════════════════════════
function commitmentsBody(){
  return ''+
  '<div class="stats-row c5">'+
    '<div class="stat-card t-accent"><div class="stat-label">AI order backlog</div><div class="stat-value">&gt;$73B</div><div class="stat-sub">Q4\'25 · ~18-mo delivery</div></div>'+
    '<div class="stat-card t-ai"><div class="stat-label">AI bookings Q2\'26</div><div class="stat-value">&gt;$30B</div><div class="stat-sub">&gt;3× the $10.8B shipped</div></div>'+
    '<div class="stat-card t-accent"><div class="stat-label">FY27 AI revenue</div><div class="stat-value">&gt;$100B</div><div class="stat-sub">underpinned by these deals</div></div>'+
    '<div class="stat-card t-pos"><div class="stat-label">Committed XPU customers</div><div class="stat-value">6</div><div class="stat-sub">+ networking to all clusters</div></div>'+
    '<div class="stat-card t-warn"><div class="stat-label">Visibility</div><div class="stat-value">to 2028</div><div class="stat-sub">horizons run to 2031</div></div>'+
  '</div>'+

  card('What this tab tracks','the chronology, size &amp; duration of Broadcom\'s customer &amp; infrastructure commitments',
    '<div class="card-body"><div class="prose" style="margin-bottom:2px"><p>The <strong>GW Roadmap</strong> tab shows committed compute <em>by year</em>. This tab is the <strong>deal book</strong>: each customer / infrastructure commitment as it was <em>disclosed over time</em> — when it landed, how big, how long it runs, and what it implies. Three commitment types run in parallel: <span class="badge b-ai">Co-design XPU</span> the customer owns the chip · <span class="badge b-accent">Compute-access</span> frontier labs buy TPU-based capacity · <span class="badge b-neutral">Networking / infra</span> attaches to every cluster, XPU or GPU.</p></div></div>','')+

  '<div class="card"><div class="card-header"><span class="card-title">Where the relationships stand today</span><span class="card-subtitle">Bloomberg supply-chain relationship sizing · FY2025 · $ &amp; % of Broadcom revenue</span></div>'+
    '<div class="card-body"><div class="prose" style="margin-bottom:6px"><p>Before the forward book, the current run-rate. Bloomberg\'s SPLC data (the same source behind the <strong>Industry Analysis</strong> relationship graph) sizes Broadcom\'s <em>disclosed / traceable</em> customer relationships — the base the multi-year deals build on. <strong>Google is already ~$2.3B (12.8% of revenue)</strong>; <strong>Apple and Meta each ~$0.9B (~5%)</strong>. Distributors (WT Micro, TD Synnex) are <em>channels</em> that partly route the hyperscalers\' demand — don\'t add them to the end customers.</p></div></div>'+
    '<div class="card-body" style="padding-top:0"><div class="chart-c" style="height:300px"><canvas id="cRelSizing"></canvas></div></div>'+
    '<div class="source">Bloomberg SPLC, FY2025 (from the Industry Analysis relationship graph, <code>COMPANY_RELS</code>). "amt" = Bloomberg-estimated relationship value; end-customer relationships (Google, Microsoft, Amazon, Oracle, Meta) are sized against the customer\'s <strong>capex</strong>, distributors &amp; Apple against COGS. This is a <em>partial</em> view — BBG traces ~$12.5B across 20 relationships and understates customers (like Apple) whose content ships through contract manufacturers. See the Apple card below for the full picture.</div></div>'+

  '<div class="card"><div class="card-header"><span class="card-title">Apple — the franchise customer, in full</span><span class="card-subtitle">the longest, largest single relationship · now locked through 2031, with an emerging AI leg</span></div>'+
    '<div class="card-body"><div class="grid-2">'+
      '<div>'+
        '<div class="gl-cat">The relationship arc</div>'+
        '<div class="mini-grid" style="gap:8px">'+
          '<div class="mini l-blue"><div class="mini-t">2007 → 2016 · connectivity &amp; touch</div><div class="mini-d">Started on the original iPhone with a <strong>touch controller</strong>, then added Wi-Fi/Bluetooth combo, GPS/GNSS and wireless-charging chips across iPhone, iPad and Apple Watch.</div></div>'+
          '<div class="mini l-ai"><div class="mini-t">2016+ · RF front-end (the big leg)</div><div class="mini-d">With Avago\'s RF portfolio, <strong>FBAR filters + power amplifiers</strong> became the dominant content — RF-filter revenue compounding ~22%/yr through the 5G cycle.</div></div>'+
          '<div class="mini l-purple"><div class="mini-t">The deal ladder</div><div class="mini-d"><strong>2020</strong> 3-yr ~$15B (secure 5G) → <strong>May 2023</strong> multi-year, US-made FBAR (Fort Collins) → <strong>Jul 6 2026</strong> extended <strong>through 2031</strong>.</div></div>'+
          '<div class="mini l-amber"><div class="mini-t">The headwind &amp; the AI leg</div><div class="mini-d">Apple designed out Wi-Fi/BT with its own <strong>N1</strong> chip (iPhone 17) but still needs Broadcom\'s RF front-end. New upside: the reported <strong>"Baltra"</strong> AI-server co-design (~2027).</div></div>'+
        '</div></div>'+
      '<div>'+
        '<div class="gl-cat">Is Apple ~20% of Broadcom\'s revenue?</div>'+
        '<div class="caution"><strong>It was — in FY2022.</strong> Apple reached ~<strong>$6.6B, ~20%</strong> of net revenue at the 5G peak (up from $3.6B in FY20) — the disclosed largest customer. <strong>Not today.</strong> Since FY22, Broadcom\'s revenue roughly <strong>doubled</strong> ($33B → $64B: VMware +~$20B, AI +tens of $B) while Apple\'s dollars stayed roughly flat — so the same content is now a much smaller <em>share</em>.</div>'+
        '<div class="insight" style="margin-top:9px"><strong>Best current read: high-single-digit %, not 20%.</strong> Bloomberg SPLC traces only ~$0.9B (~5%) because most Apple content ships through contract manufacturers (Foxconn) &amp; distributors — so it <em>undercounts</em> the true share. The "~20%" still repeated in 2026 press is a legacy figure, not reconciled to today\'s larger base.</div></div>'+
    '</div></div>'+
    '<div class="source">History &amp; scope: Apple/Broadcom press releases (2020, May 2023, Jul 6 2026), exploresemis, MacRumors/AppleInsider. FY22 ~$6.6B / ~20% from Broadcom\'s customer-concentration disclosure + analyst estimates; current share is an estimate — Broadcom now discloses <strong>top-5 end customers ~40%</strong>, no single &gt;20% customer. SPLC figure from the Industry Analysis graph.</div></div>'+

  '<div class="card"><div class="card-header"><span class="card-title">The commitment timeline</span><span class="card-subtitle">disclosed deals &amp; orders · Sep 2025 → Jun 2026, anchored by the 2016 Google relationship</span></div>'+
    '<div class="card-body"><div class="tl">'+
      tlItem('#4285F4','2016',
        '<span class="logo-chip lc-google"><span class="dot"></span>Google</span> <span class="badge b-ai">Co-design</span>',
        '<b>Google TPU partnership begins.</b> Broadcom co-designs Google\'s Tensor Processing Units — the seed being LSI\'s ASIC team (acquired 2014). Still the anchor customer: largest, longest, and the template for every XPU deal since.')+
      tlItem('#555','2020–23',
        '<span class="logo-chip lc-apple"><span class="dot"></span>Apple</span> <span class="badge b-neutral">Wireless franchise</span>',
        '<b>Apple locks in Broadcom\'s wireless content.</b> 2020: a 3-year ~$15B agreement to secure 5G RF. May 2023: extended with a new multi-year, multibillion-dollar deal for <strong>US-made FBAR filters</strong> (Fort Collins, CO). Apple is the longest, largest single relationship — see the Apple card above for the full arc.')+
      tlItem('#2E75B6','Jun \'25',
        '<span class="logo-chip lc-broadcom"><span class="dot"></span>Broadcom</span> <span class="badge b-neutral">Networking</span>',
        '<b>Tomahawk 6 launches</b> — first 102.4 Tbps Ethernet switch (with co-packaged optics). The scale-up / scale-out fabric that attaches to <em>every</em> AI cluster, not just Broadcom\'s own XPUs — the "second engine inside AI."')+
      tlItem('#9AACBE','Sep \'25',
        '<span class="badge b-neutral">Q3 FY25 call</span> <span class="badge b-ai">Co-design · $10B</span>',
        '<b>A new (4th) XPU customer places a $10B order</b>; the stock jumps ~9%. The market pegs it as OpenAI — it is later (December) revealed to be <strong>Anthropic</strong>.')+
      tlItem('#444441','Oct 13 \'25',
        '<span class="logo-chip lc-openai"><span class="dot"></span>OpenAI</span> <span class="badge b-ai">Co-design · 10 GW</span>',
        '<b>OpenAI–Broadcom 10 GW strategic collaboration.</b> OpenAI designs the accelerators (the "Jalapeño" inference chip); Broadcom develops, deploys and wires them entirely with its Ethernet. Rollout <strong>H2 2026 → 2029</strong>.')+
      tlItem('#2E75B6','Oct \'25',
        '<span class="logo-chip lc-broadcom"><span class="dot"></span>Broadcom</span> <span class="badge b-neutral">Networking</span>',
        '<b>ESUN scale-up Ethernet consortium + Jericho4.</b> At the OCP Summit, Broadcom convenes AMD, Arista, Cisco, Meta, Microsoft, Nvidia, OpenAI &amp; Oracle around open scale-up Ethernet; Jericho4 extends AI fabrics <em>across</em> data centers.')+
      tlItem('#D97757','Dec 11 \'25',
        '<span class="logo-chip lc-anthropic"><span class="dot"></span>Anthropic</span> <span class="badge b-accent">Compute-access · +$11B</span>',
        '<b>Q4 FY25: the mystery $10B customer is Anthropic.</b> An additional <strong>$11B</strong> follow-on order lands for late-2026 delivery, and a <strong>5th customer</strong> is disclosed ($1B order, unnamed). Total AI order backlog crosses <strong>$73B</strong>.')+
      tlItem('#444441','Mar 4 \'26',
        '<span class="logo-chip lc-openai"><span class="dot"></span>OpenAI</span> <span class="badge b-ai">Co-design · 6th customer</span>',
        '<b>Q1 FY26: OpenAI confirmed as the 6th committed XPU customer</b> ($10B+; mass production late 2026). AI semiconductor revenue is $8.4B, +106% YoY.')+
      tlItem('#4285F4','Apr 6 \'26',
        '<span class="logo-chip lc-google"><span class="dot"></span>Google</span> <span class="logo-chip lc-anthropic"><span class="dot"></span>Anthropic</span> <span class="badge b-accent">8-K · to 2031</span>',
        '<b>Google Long-Term Agreement (8-K): TPUs + networking through 2031.</b> Broadcom stays Google\'s TPU partner for future generations (incl. "Sunfish" TPU v8, ~2027). Same day, <strong>Anthropic expands to ~3.5 GW from 2027</strong> — on top of the ~1 GW already coming online in 2026.')+
      tlItem('#0467DF','Apr 14 \'26',
        '<span class="logo-chip lc-meta"><span class="dot"></span>Meta</span> <span class="badge b-ai">Co-design · 1 GW+</span>',
        '<b>Meta extends the MTIA partnership.</b> Initial commitment <strong>&gt;1 GW</strong>, first phase of a multi-gigawatt, <strong>multi-generation rollout through 2029</strong> (MTIA 300 / 400 / 450 / 500 on a ~6-month cadence). Inference &amp; recommendation workloads.')+
      tlItem('#1B7A4B','Jun 3 \'26',
        '<span class="badge b-neutral">Q2 FY26 call</span> <span class="badge b-accent">Bookings &gt;$30B</span>',
        '<b>The order book compounds.</b> AI revenue $10.8B (+143%); AI-semi <strong>bookings exceed $30B</strong> — more than 3× the $10.8B shipped. Management reaffirms <strong>&gt;$100B AI revenue in FY27</strong> and visibility all the way to 2028.')+
      tlItem('#555','Jul 6 \'26',
        '<span class="logo-chip lc-apple"><span class="dot"></span>Apple</span> <span class="badge b-accent">Extended to 2031</span>',
        '<b>Apple extends the Broadcom supply agreement through 2031.</b> Locks Broadcom\'s RF front-end / wireless content (FBAR filters, amplifiers, touch &amp; wireless-charging controllers) for five more years — killing the bear case that Apple designs Broadcom\'s wireless out. Confirmed to Reuters; no dollar value disclosed. Runs alongside the reported "Baltra" AI-server co-design.')+
    '</div></div>'+
    '<div class="source">Company press releases, 8-Ks &amp; Q3 FY25–Q2 FY26 earnings calls. Order values ($10B / $11B / $1B) and the &gt;$73B backlog are Broadcom-disclosed; the 2016 start and per-customer horizons are from company / customer announcements. Customers are named only where the customer itself has confirmed (Google, Meta, OpenAI, Anthropic).</div></div>'+

  '<div class="card"><div class="card-header"><span class="card-title">How long each commitment runs</span><span class="card-subtitle">disclosed / implied horizons of the committed windows</span></div>'+
    '<div class="card-body" style="padding-top:4px"><div class="grid-2-wide">'+
      '<div class="chart-c md"><canvas id="cCommitHorizon"></canvas></div>'+
      '<div><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-ai"><div class="mini-t">Google — the longest</div><div class="mini-d">Relationship since 2016; the April 2026 Long-Term Agreement locks TPUs + networking <strong>through 2031</strong>.</div></div>'+
        '<div class="mini l-purple"><div class="mini-t">Frontier labs — ~5-year windows</div><div class="mini-d"><strong>Anthropic</strong> runs 2026→2031; <strong>OpenAI</strong>\'s 10 GW deploys 2026→2029.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Meta — multi-generation</div><div class="mini-d">&gt;1 GW from H2 2027, four MTIA generations through <strong>2029</strong> on a ~6-month cadence.</div></div>'+
      '</div></div>'+
    '</div></div>'+
    '<div class="source">Bars are the disclosed / implied committed windows, starting at first meaningful deployment year. Google is shown from 2024 for scale — the working relationship dates to 2016. Apple\'s RF/wireless content is locked through 2031 (Jul 2026 extension); its "Baltra" AI window is press-reported. The 5th (unnamed) customer\'s horizon beyond its late-2026 delivery is undisclosed.</div></div>'+

  card('The commitment book, customer by customer','',
    '<div class="card-body" style="padding:0"><table class="tbl">'+
      '<thead><tr><th>Customer</th><th>Type</th><th>First firm order</th><th>Horizon</th><th>Scale</th><th>Order value</th><th style="text-align:left">What it implies</th></tr></thead><tbody>'+
        '<tr><td><span class="logo-chip lc-google"><span class="dot"></span>Google</span></td><td>Co-design</td><td>2016 (rel.)</td><td><strong>to 2031</strong></td><td>multi-GW</td><td>self-funded</td><td style="text-align:left;font-size:11px;font-weight:400">The anchor. Longest &amp; largest; LTA locks TPUs + networking through 2031 (Ironwood now, Sunfish v8 ~2027). Internal-workload GW not separately quantified.</td></tr>'+
        '<tr><td><span class="logo-chip lc-apple"><span class="dot"></span>Apple</span></td><td>Wireless + AI</td><td>2020 / 2023</td><td><strong>to 2031</strong></td><td>RF → Baltra</td><td>multibillion</td><td style="text-align:left;font-size:11px;font-weight:400">Historically the largest customer (~20% rev / $6.6B at the FY22 5G peak; ~high-single-digit % now as the base doubled). FBAR/RF wireless, US-made; extended through 2031 on Jul 6 2026. Plus a reported AI leg — the "Baltra" server inference chip (~2027).</td></tr>'+
        '<tr><td><span class="logo-chip lc-meta"><span class="dot"></span>Meta</span></td><td>Co-design</td><td>Apr 2026</td><td>to 2029</td><td>&gt;1 GW → multi-GW</td><td>n/d</td><td style="text-align:left;font-size:11px;font-weight:400">MTIA multi-generation (300/400/450/500). Inference &amp; recommendation; diversifies Meta beyond Nvidia. First gen deploys H2 2027.</td></tr>'+
        '<tr><td><span class="logo-chip lc-anthropic"><span class="dot"></span>Anthropic</span></td><td><span style="color:var(--accent)">Compute-access</span></td><td>Q3 2025</td><td>to 2031</td><td>~1 GW → 3.5 GW</td><td>$10B + $11B</td><td style="text-align:left;font-size:11px;font-weight:400">Buys TPU-based capacity (not co-design). 3.5 GW from 2027 is <em>contingent on continued commercial success</em> — carries demand risk. Financed via the Apollo/Blackstone platform.</td></tr>'+
        '<tr><td><span class="logo-chip lc-openai"><span class="dot"></span>OpenAI</span></td><td>Co-design</td><td>Oct 2025</td><td>to 2029</td><td>10 GW</td><td>$10B+</td><td style="text-align:left;font-size:11px;font-weight:400">Largest single co-design win. OpenAI-designed "Jalapeño" inference silicon, all-Ethernet racks; mass production late 2026. Counted as the 6th customer in Q1 FY26.</td></tr>'+
        '<tr><td><span class="badge b-neutral">5th customer</span></td><td>Co-design</td><td>Q4 2025</td><td>n/d</td><td>n/d</td><td>$1B</td><td style="text-align:left;font-size:11px;font-weight:400">Undisclosed. Delivery late 2026 — shows the pipeline still widening beyond the named four.</td></tr>'+
        '<tr><td><span class="badge b-neutral">ByteDance</span> <span style="font-size:10px;color:var(--text-tertiary)">reported</span></td><td>Co-design</td><td>~2024</td><td>n/d</td><td>n/d</td><td>n/d</td><td style="text-align:left;font-size:11px;font-weight:400">Widely reported as an early XPU customer; not officially named by Broadcom and export-control sensitive. Included for completeness.</td></tr>'+
        '<tr class="row-hi"><td>Networking</td><td>Merchant</td><td>ongoing</td><td>every cycle</td><td>all clusters</td><td>—</td><td style="text-align:left;font-size:11px;font-weight:700">Tomahawk 6 / Jericho4 / optical attach to XPU <em>and</em> GPU clusters alike — ~30% of AI revenue (up to ~40% in strong quarters), at richer margin. The cross-cutting commitment.</td></tr>'+
      '</tbody></table></div>',
    '"n/d" = not disclosed. Order values are Broadcom-disclosed; horizons combine company &amp; customer announcements. ByteDance is press-reported, not company-confirmed.')+

  '<div class="grid-2">'+
    card('Two commitment types, two risk profiles','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-ai"><div class="mini-t">Co-design — structural demand</div><div class="mini-d"><strong>Google, Meta, OpenAI</strong> — and, reportedly, <strong>Apple</strong> (Baltra) — own the chip they design with Broadcom. Deep, multi-generation, high switching cost — the GW is their own committed compute.</div></div>'+
        '<div class="mini l-purple"><div class="mini-t">Compute-access — demand-contingent</div><div class="mini-d"><strong>Anthropic</strong> buys TPU-based capacity, financed via the Apollo/Blackstone platform. Explicitly "dependent on continued commercial success" — the one window that can flex.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Networking — the hedge inside the hedge</div><div class="mini-d">Sells into <em>any</em> cluster, including all-Nvidia ones. De-correlated from which XPU wins — it rides the whole buildout.</div></div>'+
      '</div></div>','')+
    card('What the commitments imply','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-teal"><div class="mini-t">Visibility, not just backlog</div><div class="mini-d">Multi-year, named commitments underpin the &gt;$100B FY27 target and visibility to 2028 — a step-change from the historically lumpy, book-and-ship semi model.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Concentration is the flip side</div><div class="mini-d">The order book sits in ~6 customers with Google still the anchor. Depth of relationship is the moat <em>and</em> the concentration risk (see the Customer Concentration tab).</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">The financing platform is new</div><div class="mini-d">The Apollo/Blackstone XPU vehicle ($35B first tranche, 20+ GW through 2028) applies PE-style structured finance to the <em>customer</em> side — extending commitments financially, not just operationally.</div></div>'+
      '</div><div class="insight" style="margin-top:11px"><strong>The takeaway:</strong> Broadcom has converted the AI story from "will they win sockets?" into a dated, multi-year order book. The commitments give unusual forward visibility — as long as the frontier-lab demand behind the compute-access deals holds, and the concentration in a handful of customers doesn\'t reverse.</div></div>','')+
  '</div>';
}

function initCommitments(pane){
  if(pane._charted) return; pane._charted = true;
  // BBG SPLC relationship sizing (FY2025) — top customer relationships by $ (from COMPANY_RELS).
  var relLabels=['WT Micro (dist.)','Alphabet / Google','Apple','Meta','TD Synnex (dist.)','Quanta','Dell','Microsoft','Oracle','Amazon'];
  var relAmt=[5.75,2.30,0.93,0.92,0.46,0.24,0.22,0.20,0.16,0.14];
  var relRev=[31.9,12.8,5.2,5.1,2.6,1.3,1.2,1.1,0.9,0.8];
  var relColors=['#9AACBE','#4285F4','#555555','#0467DF','#B8C2CE','#7A8896','#7A8896','#00A4EF','#C74634','#FF9900'];
  freshChart('cRelSizing',{type:'bar',data:{labels:relLabels,datasets:[{data:relAmt,backgroundColor:relColors,borderRadius:3,barThickness:16}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
        tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,
          callbacks:{label:function(c){return '$'+c.raw.toFixed(2)+'B · '+relRev[c.dataIndex]+'% of AVGO rev';}}}},
      scales:{x:{grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},
          ticks:{font:{family:'Figtree',size:10.5},color:'#9AACBE',callback:function(v){return '$'+v+'B';}}},
        y:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:11},color:'#6B7A8D'}}}}});
  // Horizon "gantt": floating horizontal bars [startYear, endYear] per committed window.
  freshChart('cCommitHorizon',{type:'bar',data:{
    labels:['Google · TPU','Apple · RF/AI','Anthropic','OpenAI','Meta · MTIA','5th customer'],
    datasets:[{
      data:[[2024,2031],[2024,2031],[2026,2031],[2026,2029],[2027,2029],[2026,2027]],
      backgroundColor:['#4285F4','#555','#D97757','#444441','#0467DF','rgba(136,153,170,0.55)'],
      borderRadius:3, barThickness:18
    }]
  },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,
        callbacks:{label:function(c){var v=c.raw;return v[0]+' → '+v[1]+(v[1]>=2031?' (LTA)':'');}}}},
    scales:{x:{min:2024,max:2032,grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},
        ticks:{stepSize:1,font:{family:'Figtree',size:10.5},color:'#9AACBE',callback:function(v){return '’'+String(v).slice(2);}}},
      y:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:11.5,weight:'600'},color:'#6B7A8D'}}}}});
}

// ════════════════════════════════════════════════════════════════════════════════
// 5 — VALUE CHAIN  (clickable SVG + sourced drill-down modal)
// ════════════════════════════════════════════════════════════════════════════════
function valueChainBody(){
  return ''+
  '<div class="card"><div class="card-header"><span class="card-title">Value chain — where Broadcom\'s reach starts and ends</span><span class="card-subtitle">one spine, three lines · partners shown inside Broadcom\'s band</span></div>'+
    '<div class="card-body"><div class="prose" style="margin-bottom:6px"><p>Every product runs the same path into a data center. The colored band is where <strong>Broadcom</strong> plays; chips inside it name who it works with at each step; the gray blocks name who owns the stages it doesn\'t touch. In none does Broadcom reach the data center itself — <em>"we\'re in the chip business only."</em> <span style="color:var(--accent);font-weight:600">Click any block to see the source basis for that claim.</span></p></div></div>'+
    '<div class="card-body" style="padding-top:0;overflow-x:auto">'+ VC_SVG +'</div>'+
    '<div class="source">Boundaries from 10-K + Q2 FY26 call ("chip business only — no rack"). Co-design confirmed: Meta calls MTIA "developed in close partnership with Broadcom"; Google owns the TPU system layer (Ironwood pods, optical circuit switching, JAX/GKE). Partner names at fab/EDA/HBM/OSAT are industry-standard inference, not Broadcom disclosure.</div></div>'+

  '<div class="grid-2">'+
    card('The same boundary, three relationship depths','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-ai"><div class="mini-t">XPUs — deepest (co-design)</div><div class="mini-d">Customer brings architecture; Broadcom does physical design, hard IP (SerDes), foundry orchestration, packaging. A high-touch service relationship up to the chip. <strong>Risk axis: customer self-builds (COT).</strong></div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Switching — arm\'s-length (merchant)</div><div class="mini-d">Broadcom designs a standard product and sells it to many switch OEMs. <strong>Risk axis: Ethernet vs Nvidia\'s proprietary stack.</strong></div></div>'+
        '<div class="mini l-purple"><div class="mini-t">Optical — component feed</div><div class="mini-d">Narrowest — supplies the DSP/laser into someone else\'s module. <strong>Risk axis: copper→optical timing, attach rate to compute.</strong></div></div>'+
      '</div><div class="insight" style="margin-top:11px"><strong>The hedge within the hedge:</strong> the three lines fail or win under <em>different</em> futures. A world where hyperscalers insource XPU design still needs Broadcom\'s switching and optical. The bets aren\'t correlated.</div></div>','')+
    card('The players past Broadcom\'s reach','',
      '<div class="card-body"><div class="mini-grid" style="gap:9px">'+
        '<div class="mini l-amber"><div class="mini-t">TSMC — the foundry</div><div class="mini-d">Fabricates all three lines. The critical upstream dependency; Broadcom orchestrates but doesn\'t make.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">WT Microelectronics — distributor</div><div class="mini-d">The "one distributor" at 32% (FY25) → 42% (Q1\'26). Routes flows; a <strong>channel</strong>, not an end customer.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Foxconn / SMCI — system build</div><div class="mini-d">Contract manufacturers and system integrators turn chips into servers/racks. Step 6, past Broadcom\'s reach.</div></div>'+
        '<div class="mini l-ai"><div class="mini-t">XPU financing platform — new</div><div class="mini-d">Apollo/Blackstone vehicle ($35B first tranche) funds Anthropic/OpenAI compute access. An <em>overlay</em>, not a chain stage — extends the relationship financially, not operationally.</div></div>'+
      '</div></div>','')+
  '</div>'+

  '<div class="card"><div class="card-header"><span class="card-title">Two lenses on the same revenue — not additive</span><span class="card-subtitle">channel % and customer % describe the same dollars</span></div>'+
    '<div class="card-body"><div class="grid-3" style="align-items:center">'+
      '<div><div style="font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.04em;text-align:center;margin-bottom:4px">Channel lens</div>'+
        '<div style="font-size:10px;color:var(--text-tertiary);text-align:center;margin-bottom:6px">who Broadcom invoices</div>'+
        '<div class="chart-c sm"><canvas id="cChannel"></canvas></div></div>'+
      '<div style="text-align:center;padding:0 4px"><div style="font-size:34px;color:var(--text-tertiary);font-weight:300;line-height:1">⇄</div>'+
        '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5;margin-top:6px">Same<br><strong>$63.9B</strong><br>revenue base</div>'+
        '<div style="font-size:10px;color:var(--text-tertiary);margin-top:8px;line-height:1.45">The two slices <strong>overlap</strong> — the big distributor partly routes the top-5\'s demand</div></div>'+
      '<div><div style="font-size:11px;font-weight:700;color:#D4537E;text-transform:uppercase;letter-spacing:0.04em;text-align:center;margin-bottom:4px">Concentration lens</div>'+
        '<div style="font-size:10px;color:var(--text-tertiary);text-align:center;margin-bottom:6px">who consumes (all channels)</div>'+
        '<div class="chart-c sm"><canvas id="cConc2"></canvas></div></div>'+
    '</div>'+
      '<div class="caution" style="margin-top:11px"><strong>Don\'t add them.</strong> Each donut is the <em>full</em> $63.9B sliced a different way — by channel (left) and by end customer (right). The distributor\'s 48% and the top-5\'s 40% overlap by an undisclosed amount, because the hyperscalers\' demand is partly what flows through that one distributor. "48% + 40%" double-counts; they\'re two views of one revenue base, not two pieces that sum.</div></div>'+
    '<div class="source">FY25 figures as disclosed: ~48% of revenue through distributors (one at 32%); ~40% to top-5 end customers through all channels. The overlap between the two is not quantified by Broadcom.</div></div>';
}

function initValueChain(pane){
  if(!pane._charted){ pane._charted = true;
    freshChart('cChannel',{type:'doughnut',data:{labels:['Through distributors','Direct'],datasets:[{data:[48,52],backgroundColor:['#2E75B6','#E4E8EE'],borderWidth:0}]},options:donutOpts});
    freshChart('cConc2',{type:'doughnut',data:{labels:['Top-5 end customers','All others'],datasets:[{data:[40,60],backgroundColor:['#D4537E','#E4E8EE'],borderWidth:0}]},options:donutOpts});
  }
  // Wire the clickable SVG blocks (delegated), once per pane render.
  if(!pane._vcWired){ pane._vcWired = true;
    pane.addEventListener('click', function(e){
      var t = e.target.closest('[data-vc]'); if(!t) return;
      // #ddOverlay lives at the .ov-avgo root (a sibling of the panes), not inside this pane.
      vcOpen(pane.closest('.ov-avgo') || document, t.getAttribute('data-vc'));
    });
  }
}

// The value-chain SVG (ported; onclick="vcOpen('X')" → data-vc="X").
var VC_SVG = '<svg width="100%" viewBox="0 0 1080 500" role="img" style="min-width:1000px">'+
  '<title>Broadcom value-chain participation with partners across three product lines</title>'+
  '<desc>A chip value chain with three rows — XPUs, Ethernet switching, PHYs/DSP/optical — showing Broadcom\'s participation band with partner sub-blocks (EDA, TSMC, OSAT, HBM) and the external players owning the remaining stages.</desc>'+
  '<g font-family="Figtree">'+
  '<text x="16" y="28" font-size="11" font-weight="700" fill="#141C2B">STAGE</text>'+
  '<text x="150" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Architecture</text><text x="150" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">&amp; spec</text>'+
  '<text x="280" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Logic / IP</text><text x="280" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">design</text>'+
  '<text x="410" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Physical +</text><text x="410" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">SerDes</text>'+
  '<text x="540" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Foundry</text><text x="540" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">(fab)</text>'+
  '<text x="670" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Packaging</text><text x="670" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">+ test</text>'+
  '<text x="800" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Board /</text><text x="800" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">system</text>'+
  '<text x="912" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Channel</text>'+
  '<text x="1004" y="20" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">Deploy</text><text x="1004" y="31" font-size="9" font-weight="600" fill="#6B7A8D" text-anchor="middle">+ run</text>'+
  '</g>'+
  '<g stroke="#E4E8EE" stroke-width="1">'+
  '<line x1="85" y1="38" x2="85" y2="372"/><line x1="215" y1="38" x2="215" y2="372"/><line x1="345" y1="38" x2="345" y2="372"/><line x1="475" y1="38" x2="475" y2="372"/><line x1="605" y1="38" x2="605" y2="372"/><line x1="735" y1="38" x2="735" y2="372"/><line x1="865" y1="38" x2="865" y2="372"/><line x1="960" y1="38" x2="960" y2="372"/><line x1="1052" y1="38" x2="1052" y2="372"/>'+
  '</g>'+
  '<text x="16" y="92" font-size="12" font-weight="700" fill="#00A37A" font-family="Figtree">XPUs</text>'+
  '<text x="16" y="105" font-size="8.5" fill="#9AACBE" font-family="Figtree">custom AI</text>'+
  '<rect data-vc="xpu_cust" class="vc-clickable" x="85" y="58" width="260" height="46" rx="5" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/>'+
  '<text x="215" y="78" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Customer brings architecture + IP</text>'+
  '<g font-family="Figtree"><g class="vc-clickable" data-vc="cust_google"><rect x="118" y="85" width="56" height="14" rx="7" fill="#fff" stroke="#4285F4" stroke-width="0.8"/><circle cx="128" cy="92" r="3" fill="#4285F4"/><text x="148" y="95" font-size="8" font-weight="700" fill="#185FA5" text-anchor="middle">Google</text></g>'+
  '<g class="vc-clickable" data-vc="cust_meta"><rect x="180" y="85" width="46" height="14" rx="7" fill="#fff" stroke="#0467DF" stroke-width="0.8"/><circle cx="189" cy="92" r="3" fill="#0467DF"/><text x="206" y="95" font-size="8" font-weight="700" fill="#0C447C" text-anchor="middle">Meta</text></g>'+
  '<g class="vc-clickable" data-vc="cust_anthropic"><rect x="232" y="85" width="50" height="14" rx="7" fill="#fff" stroke="#D97757" stroke-width="0.8"/><circle cx="241" cy="92" r="3" fill="#D97757"/><text x="258" y="95" font-size="7.5" font-weight="700" fill="#993C1D" text-anchor="middle">Anthropic</text></g><g class="vc-clickable" data-vc="cust_openai"><rect x="285" y="85" width="47" height="14" rx="7" fill="#fff" stroke="#444441" stroke-width="0.8"/><circle cx="294" cy="92" r="3" fill="#000"/><text x="311" y="95" font-size="7.5" font-weight="700" fill="#2C2C2A" text-anchor="middle">OpenAI</text></g></g>'+
  '<rect data-vc="xpu_bcm" class="vc-clickable" x="345" y="56" width="390" height="50" rx="6" fill="rgba(0,163,122,0.13)" stroke="#1D9E75" stroke-width="1.5"/>'+
  '<text x="540" y="73" font-size="10" font-weight="700" fill="#0F6E56" text-anchor="middle" font-family="Figtree">BROADCOM — physical design · foundry orchestration · packaging</text>'+
  '<g font-family="Figtree"><rect data-vc="partner_serdes" class="vc-clickable" x="356" y="82" width="74" height="16" rx="4" fill="#fff" stroke="#1D9E75" stroke-width="0.6"/><text x="393" y="93" font-size="8" fill="#0F6E56" text-anchor="middle">SerDes/IP (own)</text>'+
  '<rect data-vc="partner_eda" class="vc-clickable" x="436" y="82" width="78" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><circle cx="446" cy="90" r="3" fill="#A259FF"/><text x="478" y="93" font-size="8" fill="#5F5E5A" text-anchor="middle">EDA: Synopsys</text>'+
  '<rect data-vc="partner_tsmc" class="vc-clickable" x="520" y="82" width="64" height="16" rx="4" fill="#fff" stroke="#D4002A" stroke-width="0.8"/><circle cx="530" cy="90" r="3" fill="#D4002A"/><text x="558" y="93" font-size="8" font-weight="700" fill="#A32D2D" text-anchor="middle">TSMC fab</text>'+
  '<rect data-vc="partner_osat" class="vc-clickable" x="590" y="82" width="68" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="624" y="93" font-size="8" fill="#5F5E5A" text-anchor="middle">CoWoS+OSAT</text>'+
  '<rect data-vc="partner_hbm" class="vc-clickable" x="664" y="82" width="62" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="695" y="93" font-size="8" fill="#5F5E5A" text-anchor="middle">HBM: SK/Sams</text></g>'+
  '<rect data-vc="xpu_ext" class="vc-clickable" x="735" y="58" width="345" height="46" rx="5" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/>'+
  '<text x="800" y="76" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">System</text><text x="800" y="89" font-size="8" fill="#888780" text-anchor="middle" font-family="Figtree">ODM/SMCI</text>'+
  '<rect class="vc-clickable" data-vc="dist_detail" x="868" y="62" width="88" height="38" rx="4" fill="transparent"/><text x="912" y="76" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree" style="pointer-events:none">Distributor</text><text x="912" y="89" font-size="8" fill="#888780" text-anchor="middle" font-family="Figtree" style="pointer-events:none">WTME</text>'+
  '<text x="1006" y="76" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Customer runs</text><text x="1006" y="89" font-size="8" fill="#888780" text-anchor="middle" font-family="Figtree">own cluster + SW</text>'+
  '<text x="16" y="182" font-size="12" font-weight="700" fill="#2E75B6" font-family="Figtree">Switching</text>'+
  '<text x="16" y="195" font-size="8.5" fill="#9AACBE" font-family="Figtree">Tomahawk</text>'+
  '<rect data-vc="sw_bcm" class="vc-clickable" x="85" y="148" width="650" height="50" rx="6" fill="rgba(46,117,182,0.12)" stroke="#2E75B6" stroke-width="1.5"/>'+
  '<text x="410" y="166" font-size="10" font-weight="700" fill="#185FA5" text-anchor="middle" font-family="Figtree">BROADCOM — designs the standard chip end-to-end (merchant silicon)</text>'+
  '<g font-family="Figtree"><rect x="96" y="175" width="120" height="16" rx="4" fill="#fff" stroke="#2E75B6" stroke-width="0.6"/><text x="156" y="186" font-size="8" fill="#185FA5" text-anchor="middle">own architecture + SerDes</text>'+
  '<rect x="430" y="175" width="78" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><circle cx="440" cy="183" r="3" fill="#A259FF"/><text x="472" y="186" font-size="8" fill="#5F5E5A" text-anchor="middle">EDA: Cadence</text>'+
  '<rect x="514" y="175" width="64" height="16" rx="4" fill="#fff" stroke="#D4002A" stroke-width="0.8"/><circle cx="524" cy="183" r="3" fill="#D4002A"/><text x="552" y="186" font-size="8" font-weight="700" fill="#A32D2D" text-anchor="middle">TSMC fab</text>'+
  '<rect x="640" y="175" width="62" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="671" y="186" font-size="8" fill="#5F5E5A" text-anchor="middle">OSAT test</text></g>'+
  '<rect data-vc="sw_ext" class="vc-clickable" x="735" y="148" width="345" height="50" rx="5" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/>'+
  '<text x="800" y="168" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Switch OEM builds box</text>'+
  '<g font-family="Figtree" class="vc-clickable" data-vc="oem_arista"><rect x="752" y="176" width="44" height="14" rx="7" fill="#fff" stroke="#1BA0D7" stroke-width="0.8"/><text x="774" y="186" font-size="8" font-weight="700" fill="#0C447C" text-anchor="middle">Arista</text><rect x="800" y="176" width="42" height="14" rx="7" fill="#fff" stroke="#1BA0D7" stroke-width="0.8"/><text x="821" y="186" font-size="8" font-weight="700" fill="#0C447C" text-anchor="middle">Cisco</text></g>'+
  '<rect class="vc-clickable" data-vc="dist_detail" x="868" y="152" width="88" height="38" rx="4" fill="transparent"/><text x="912" y="170" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree" style="pointer-events:none">Distributor</text>'+
  '<text x="1006" y="170" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Operator</text><text x="1006" y="183" font-size="8" fill="#888780" text-anchor="middle" font-family="Figtree">deploys + runs</text>'+
  '<text x="16" y="272" font-size="12" font-weight="700" fill="#7030A0" font-family="Figtree">PHYs/DSP</text>'+
  '<text x="16" y="285" font-size="8.5" fill="#9AACBE" font-family="Figtree">optical</text>'+
  '<rect data-vc="opt_bcm" class="vc-clickable" x="85" y="238" width="650" height="50" rx="6" fill="rgba(112,48,160,0.12)" stroke="#7030A0" stroke-width="1.5"/>'+
  '<text x="410" y="256" font-size="10" font-weight="700" fill="#3C3489" text-anchor="middle" font-family="Figtree">BROADCOM — designs the component (DSP · PHY · laser silicon)</text>'+
  '<g font-family="Figtree"><rect x="96" y="265" width="120" height="16" rx="4" fill="#fff" stroke="#7030A0" stroke-width="0.6"/><text x="156" y="276" font-size="8" fill="#3C3489" text-anchor="middle">own DSP + optical IP</text>'+
  '<rect x="514" y="265" width="64" height="16" rx="4" fill="#fff" stroke="#D4002A" stroke-width="0.8"/><circle cx="524" cy="273" r="3" fill="#D4002A"/><text x="552" y="276" font-size="8" font-weight="700" fill="#A32D2D" text-anchor="middle">TSMC fab</text>'+
  '<rect x="640" y="265" width="78" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="679" y="276" font-size="8" fill="#5F5E5A" text-anchor="middle">test (incl. CPO)</text></g>'+
  '<rect data-vc="opt_ext" class="vc-clickable" x="735" y="238" width="345" height="50" rx="5" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/>'+
  '<text x="800" y="258" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Module maker builds</text><text x="800" y="271" font-size="8" fill="#888780" text-anchor="middle" font-family="Figtree">transceiver → into box</text>'+
  '<rect class="vc-clickable" data-vc="dist_detail" x="868" y="242" width="88" height="38" rx="4" fill="transparent"/><text x="912" y="260" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree" style="pointer-events:none">Distributor</text>'+
  '<text x="1006" y="260" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Operator runs</text>'+
  '<text x="16" y="334" font-size="12" font-weight="700" fill="#993C1D" font-family="Figtree">Wireless</text>'+
  '<text x="16" y="347" font-size="8.5" fill="#9AACBE" font-family="Figtree">Apple (non-AI)</text>'+
  '<g class="vc-clickable" data-vc="apple_chips"><rect x="85" y="312" width="650" height="50" rx="6" fill="rgba(217,119,87,0.12)" stroke="#D85A30" stroke-width="1.5"/>'+
  '<text x="410" y="330" font-size="10" font-weight="700" fill="#993C1D" text-anchor="middle" font-family="Figtree">BROADCOM — RF front-end + connectivity (FBAR made in-house, not fabless)</text>'+
  '<rect x="96" y="339" width="118" height="16" rx="4" fill="#fff" stroke="#D85A30" stroke-width="0.6"/><text x="155" y="350" font-size="8" fill="#993C1D" text-anchor="middle">FBAR filters — Fort Collins fab</text>'+
  '<rect x="222" y="339" width="96" height="16" rx="4" fill="#fff" stroke="#D85A30" stroke-width="0.6"/><text x="270" y="350" font-size="8" fill="#993C1D" text-anchor="middle">Wi-Fi/BT combo</text>'+
  '<rect x="326" y="339" width="120" height="16" rx="4" fill="#fff" stroke="#D85A30" stroke-width="0.6"/><text x="386" y="350" font-size="8" fill="#993C1D" text-anchor="middle">touch + charging ASICs</text>'+
  '<rect x="514" y="339" width="64" height="16" rx="4" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="546" y="350" font-size="8" fill="#5F5E5A" text-anchor="middle">own US fabs</text></g>'+
  '<g class="vc-clickable" data-vc="apple_bcm"><rect x="735" y="312" width="345" height="50" rx="5" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/>'+
  '<text x="800" y="332" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">Apple builds the iPhone</text>'+
  '<rect x="772" y="340" width="56" height="14" rx="7" fill="#fff" stroke="#555" stroke-width="0.8"/><circle cx="782" cy="347" r="3" fill="#555"/><text x="802" y="350" font-size="8" font-weight="700" fill="#2C2C2A" text-anchor="middle">Apple</text>'+
  '<text x="912" y="334" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">via Foxconn</text>'+
  '<text x="1006" y="334" font-size="9" font-weight="600" fill="#5F5E5A" text-anchor="middle" font-family="Figtree">sold to consumer</text></g>'+
  '<rect data-vc="fabless_note" class="vc-clickable" x="345" y="378" width="390" height="22" rx="4" fill="rgba(204,9,42,0.06)" stroke="#D4002A" stroke-width="0.6"/>'+
  '<text x="540" y="392" font-size="8.5" fill="#A32D2D" text-anchor="middle" font-family="Figtree" style="pointer-events:none">The 3 AI lines are fabless (TSMC); wireless FBAR is the exception — made in Broadcom\'s own fabs</text>'+
  '<g font-family="Figtree">'+
  '<text x="16" y="432" font-size="11" font-weight="700" fill="#141C2B">Reading the bands · click any block for sources</text>'+
  '<rect x="16" y="444" width="14" height="12" rx="3" fill="rgba(0,163,122,0.13)" stroke="#1D9E75" stroke-width="1"/><text x="36" y="454" font-size="9.5" fill="#6B7A8D">Broadcom\'s participation band (color = product line)</text>'+
  '<rect x="360" y="444" width="14" height="12" rx="3" fill="#fff" stroke="#888780" stroke-width="0.6"/><text x="380" y="454" font-size="9.5" fill="#6B7A8D">Partner sub-block inside Broadcom\'s band</text>'+
  '<rect x="730" y="444" width="14" height="12" rx="3" fill="rgba(136,153,170,0.10)" stroke="#D3D1C7" stroke-width="0.5"/><text x="750" y="454" font-size="9.5" fill="#6B7A8D">External players Broadcom doesn\'t touch</text>'+
  '<text x="16" y="480" font-size="9" fill="#9AACBE">Logos are styled wordmarks for internal reference, not brand artwork. EDA split and OSAT/HBM names are illustrative inference — see each block\'s drill-down.</text>'+
  '</g></svg>';

// Value-chain drill-down data + modal (ported from VCDATA / vcOpen / vcClose).
var VCDATA = {
  xpu_cust:{t:"XPUs · customer brings architecture",tag:"External — customer-owned",tagcls:"med",role:"The hyperscaler defines the workload and the chip architecture. Google brings the most in-house IP; Anthropic and OpenAI lean more on Broadcom. Broadcom does not define what the chip is for.",conf:"hi",conftxt:"Disclosed / company-stated relationship",src:[{cls:"disclosed",q:"Broadcom and Google entered a Long Term Agreement for Broadcom to develop and supply custom TPUs for Google's future generations.",c:"Broadcom 8-K, Apr 6 2026"},{cls:"thirdparty",q:"MTIA is Meta's family of homegrown AI chips developed in close partnership with Broadcom.",c:"Meta AI blog, Mar 11 2026"},{cls:"thirdparty",q:"Google owns the TPU system layer — Ironwood pods, optical circuit switching, JAX/GKE software.",c:"Google Cloud TPU page"}]},
  xpu_bcm:{t:"XPUs · Broadcom's participation band",tag:"Broadcom core",tagcls:"hi",role:"Broadcom contributes physical design, hard IP (SerDes), foundry orchestration, and packaging/test. Its band starts after the customer's architecture and ends at the validated chip — it does not build the system.",conf:"hi",conftxt:"Disclosed + Q2 FY26 call",src:[{cls:"disclosed",q:"“We provide chips... XPUs or networking chips... we're in the chip business only.” — no rack/system sales.",c:"Q2 FY26 earnings call, Jun 3 2026"},{cls:"thirdparty",q:"This is where Broadcom's ASIC IP comes in; Google and Broadcom send the design to a manufacturer like TSMC.",c:"Chip Stock Investor, XPU-vs-GPU explainer"}]},
  partner_serdes:{t:"SerDes / hard IP (Broadcom-owned)",tag:"Broadcom core",tagcls:"hi",role:"The serializer/deserializer and physical-layer IP are Broadcom's deepest moat — the analog interface moving data on/off the chip at 200G/400G. Owned, not licensed.",conf:"hi",conftxt:"Company-stated leadership",src:[{cls:"disclosed",q:"“Industry-leading 200G and 400G SerDes, driving co-packaged copper with Ethernet and PCIe switches.”",c:"Q2 FY26 earnings call"}]},
  partner_eda:{t:"EDA tools (licensed in)",tag:"Inference — industry standard",tagcls:"med",role:"Broadcom uses commercial electronic-design-automation tools (Synopsys, Cadence) for chip design, as every large fabless designer does. The specific vendor split per product line is illustrative.",conf:"med",conftxt:"Industry inference — not Broadcom-disclosed",why:"Why we infer Synopsys + Cadence: these two vendors plus Siemens EDA hold the overwhelming majority of the EDA market, and no leading-edge ASIC can be designed without their tools (synthesis, place-and-route, verification, IP libraries). It is certain Broadcom licenses commercial EDA; what we cannot verify is the per-line vendor split — Broadcom does not disclose it, so showing 'Synopsys' on one row and 'Cadence' on another is illustrative, not factual. Large designers typically use both.",src:[{cls:"inference",q:"Synopsys and Cadence are the two dominant EDA vendors; any leading-edge ASIC designer licenses both. Broadcom does not publish its EDA split.",c:"Industry-standard inference"},{cls:"thirdparty",q:"Synopsys (plus the Ansys acquisition) and Cadence are routinely cited as the EDA backbone of the fabless industry.",c:"Chip Stock Investor (Synopsys/Ansys mention)"}]},
  partner_tsmc:{t:"TSMC — the foundry",tag:"External — critical dependency",tagcls:"med",role:"All three Broadcom lines are fabless; TSMC fabricates every leading-edge chip and supplies CoWoS advanced packaging. Broadcom orchestrates the relationship but makes no wafers itself.",conf:"hi",conftxt:"Disclosed dependency + strong external corroboration",why:"Why we name TSMC specifically: Broadcom's 10-K names reliance on a limited number of foundries without always naming them, but TSMC is the only foundry with the leading-edge nodes (3nm/5nm) and CoWoS packaging capacity that XPUs and Tomahawk require at volume. Multiple third-party teardowns and the explainer sources name TSMC directly. It is the highest-confidence 'inference' on the board — effectively a disclosed dependency.",src:[{cls:"disclosed",q:"Broadcom relies on a limited number of foundries; TSMC is its principal leading-edge manufacturing partner.",c:"10-K FY2025, supply/risk factors"},{cls:"thirdparty",q:"Google and Broadcom send the design to a manufacturer like TSMC, who manufactures the XPU.",c:"Chip Stock Investor, XPU-vs-GPU explainer"},{cls:"thirdparty",q:"Annapurna (the in-house contrast case) is itself a top-5 TSMC customer — the whole AI-ASIC field routes through TSMC.",c:"Wikipedia / SemiAnalysis"}]},
  partner_hbm:{t:"HBM suppliers",tag:"External — pass-through input",tagcls:"med",role:"High-bandwidth memory is co-packaged with the XPU and sourced from SK Hynix, Samsung, or Micron. It is largely a pass-through cost that dilutes gross margin. Broadcom has secured supply through 2027-28.",conf:"hi",conftxt:"Disclosed (supply secured) + named-supplier inference",why:"Why these three names: HBM is a three-supplier market worldwide — SK Hynix, Samsung, and Micron are the only volume producers, so any HBM in a Broadcom XPU comes from one of them. Broadcom confirms it secures HBM supply but does not name which of the three per program; that part is inference constrained to a known three-way market.",src:[{cls:"disclosed",q:"“We are very comfortable that we have secured supply... for 2026, 2027. Working on 2028 and 2029.”",c:"Q2 FY26 call (Arcuri Q&A)"},{cls:"thirdparty",q:"Meta states MTIA 450/500 doubled and then raised HBM bandwidth further — HBM is central to the XPU and externally sourced.",c:"Meta AI blog, Mar 2026"}]},
  partner_osat:{t:"Packaging & test (CoWoS / OSAT)",tag:"Broadcom-orchestrated",tagcls:"hi",role:"Advanced packaging (TSMC CoWoS) plus outsourced assembly & test houses. Broadcom manages this step and delivers a validated, packaged chip — increasingly with HBM integrated.",conf:"med",conftxt:"Disclosed step + industry inference on OSAT names",why:"Why we hedge the OSAT names: CoWoS itself is TSMC's packaging technology (high confidence). But final assembly/test is often split with OSAT houses (ASE, Amkor) — standard for fabless designers, though Broadcom does not disclose which it uses per product. Broadcom is also partly insourcing advanced packaging (its Singapore facility), so this step is a Broadcom-orchestrated mix rather than a single named vendor.",src:[{cls:"disclosed",q:"Broadcom performs up to 3-die advanced packaging and is partly insourcing it (Singapore facility).",c:"Earnings-call commentary"},{cls:"inference",q:"OSAT (ASE, Amkor) handle portions of assembly/test, standard for fabless designers.",c:"Industry inference"}]},
  xpu_ext:{t:"XPUs · system build, channel & deploy",tag:"External — past Broadcom's reach",tagcls:"med",role:"After the chip ships, an ODM/integrator (Foxconn-type, SMCI) builds the server and rack, a distributor routes it, and the customer wires the cluster and runs it. Broadcom touches none of this.",conf:"hi",conftxt:"Disclosed boundary",src:[{cls:"disclosed",q:"Google's Ironwood pods (9,216 liquid-cooled chips), optical circuit switching, and Virgo network are Google-built and operated.",c:"Google Cloud TPU page"},{cls:"disclosed",q:"“No rack. It's all chips... we're in the chip business only.”",c:"Q2 FY26 call (Seymore Q&A)"}]},
  sw_bcm:{t:"Switching · Broadcom's band",tag:"Broadcom core (merchant)",tagcls:"hi",role:"Unlike XPUs, Broadcom designs the standard switch/router chip end-to-end itself (Tomahawk, Jericho) and sells the same part to many OEMs. No per-customer co-design.",conf:"hi",conftxt:"Company-stated leadership",src:[{cls:"disclosed",q:"“Shipping the industry's only 100-terabit Ethernet switch, Tomahawk 6, for over a year; taping out the 200T this quarter.”",c:"Q2 FY26 call"},{cls:"disclosed",q:"Jericho 3 and Jericho 4 fabric solutions enable the world's largest deployments at multiple hyperscalers.",c:"Q2 FY26 call"}]},
  sw_ext:{t:"Switching · OEM, channel & deploy",tag:"External — past Broadcom's reach",tagcls:"med",role:"The switch OEM (Arista, Cisco, white-box ODMs) builds the box around Broadcom's chip; the operator deploys and runs it. Broadcom's reach ends at the merchant chip sold to the OEM.",conf:"hi",conftxt:"Industry-standard structure",src:[{cls:"thirdparty",q:"Every switch OEM (Arista, Cisco, HPE) designs around Tomahawk; ~90% merchant Ethernet switching share.",c:"Colleague M&A working file / industry"}]},
  opt_bcm:{t:"Optical · Broadcom's band",tag:"Broadcom core (component)",tagcls:"hi",role:"Narrowest scope — Broadcom designs the DSP, PHY, and laser silicon that go inside someone else's optical module. CPO (co-packaged optics) is pushing Broadcom's content deeper into the package.",conf:"hi",conftxt:"Company-stated leadership",src:[{cls:"disclosed",q:"“In CPOs, 1.6 Tb DSPs, CW and EML lasers, we are the de facto standard in the industry.”",c:"Q2 FY26 call"}]},
  opt_ext:{t:"Optical · module, channel & deploy",tag:"External — past Broadcom's reach",tagcls:"med",role:"An optical-module maker builds the transceiver around Broadcom's DSP/laser; it goes into a box and is deployed. Broadcom supplies the component, not the module — though CPO shifts this boundary rightward over time.",conf:"med",conftxt:"Industry-standard structure",src:[{cls:"inference",q:"DSP/laser components are integrated by optical-module manufacturers into pluggable transceivers.",c:"Industry inference"}]},
  fabless_note:{t:"Fabless — TSMC makes every wafer",tag:"Disclosed model",tagcls:"hi",role:"Broadcom designs and orchestrates but operates no leading-edge fabs (except its own FBAR filter fabs in Fort Collins). All three AI lines depend on TSMC for fabrication — the single largest upstream concentration.",conf:"hi",conftxt:"Disclosed",src:[{cls:"disclosed",q:"Broadcom is largely fabless, relying on third-party foundries for wafer fabrication.",c:"10-K FY2025"}]},
  cust_google:{t:"Google — TPU",tag:"Disclosed customer",tagcls:"hi",role:"The anchor XPU customer since 2016 and an estimated majority of Broadcom's AI-ASIC revenue. Google brings deep in-house architecture (the most self-sufficient of the six); Broadcom supplies physical design, SerDes, and now networking. Now on its 7th-gen TPU (Ironwood); Google also resells TPU access externally.",conf:"hi",conftxt:"Disclosed — 8-K + company pages",why:"Why high confidence: Google is the only XPU partnership confirmed in a Broadcom SEC filing (the Apr 2026 8-K), plus Google's own TPU pages. The revenue-share estimate (majority of AI-ASIC) is third-party analyst color, not disclosed.",src:[{cls:"disclosed",q:"Long Term Agreement for Broadcom to develop and supply custom TPUs for Google's future generations, plus a Supply Assurance Agreement for networking through up to 2031.",c:"Broadcom 8-K, Apr 6 2026"},{cls:"thirdparty",q:"7th-gen TPU (Ironwood), 9,216 chips per pod; Google owns the system layer and resells TPU access.",c:"Google Cloud TPU page"},{cls:"thirdparty",q:"More than half of Broadcom's roughly $20B AI run-rate is Google TPU.",c:"Bloomberg / analyst commentary (estimate)"}]},
  cust_meta:{t:"Meta — MTIA",tag:"Disclosed customer (co-design)",tagcls:"hi",role:"Co-designs the MTIA accelerator family with Broadcom. Meta brings the chiplet architecture, software stack (PyTorch-native), and rack/system design (OCP standards); Broadcom contributes physical design and IP. Four generations (MTIA 300-500) shipping or scheduled 2026-27.",conf:"hi",conftxt:"Company-stated (Meta blog) + Broadcom Q2 call",why:"Why high confidence: Meta explicitly names Broadcom as its co-design partner in its own engineering blog — a rare on-record confirmation from the customer side. Broadcom's Q2 call also names the multi-generation MTIA agreement.",src:[{cls:"thirdparty",q:"MTIA is Meta's family of homegrown AI chips developed in close partnership with Broadcom.",c:"Meta AI blog, Mar 11 2026"},{cls:"disclosed",q:"Partnership to deliver multiple generations of MTIA; ~3 GW through end of 2028, initial 1 GW order delivering H2 2027.",c:"Q2 FY26 call"}]},
  cust_anthropic:{t:"Anthropic — TPU-based compute",tag:"Disclosed (via Google/Broadcom)",tagcls:"hi",role:"Accesses Broadcom TPU-based compute rather than designing its own chip — a capacity relationship, not a co-design. ~1 GW in 2026, expanding to ~3.5 GW beginning 2027, contingent on Anthropic's commercial success; financed via the Apollo/Blackstone-type platform.",conf:"hi",conftxt:"Disclosed — 8-K",why:"Why this differs from Google/Meta: Anthropic is not designing custom silicon — it buys access to TPU-based compute Broadcom provides. The 8-K conditions consumption on Anthropic's 'continued commercial success,' an unusual demand-risk caveat worth noting for the model.",src:[{cls:"disclosed",q:"Anthropic, beginning 2027, will access through Broadcom ~3.5 GW of next-generation TPU-based compute; consumption dependent on Anthropic's continued commercial success.",c:"Broadcom 8-K, Apr 6 2026"}]},
  cust_openai:{t:"OpenAI — custom inference chip",tag:"Disclosed customer (newest)",tagcls:"hi",role:"The newest of the six. Silicon delivered, production targeted late 2026; a contractual 1.3 GW in 2027 within a larger ~10 GW-by-2029 framework. Following the 'Google TPU model' — custom silicon to cut cost per watt versus Nvidia.",conf:"hi",conftxt:"Q2 FY26 call (disclosed); analyst color on rationale",why:"Why high confidence on existence, lower on terms: Broadcom confirmed the OpenAI program and gigawatt schedule on the Q2 call. The rationale figures (cheaper per gigawatt, chips = majority of data-center cost) are third-party analyst commentary, not company-disclosed.",src:[{cls:"disclosed",q:"For OpenAI, silicon delivered; on track for production late 2026; contractual 1.3 GW in 2027 within a larger 10 GW-by-2029 framework.",c:"Q2 FY26 call"},{cls:"thirdparty",q:"OpenAI follows 'the Google TPU model'; custom silicon can cut cost per gigawatt since chips are the largest data-center cost component.",c:"Bloomberg TV (analyst estimate)"}]},
  oem_arista:{t:"Arista / Cisco — switch OEMs",tag:"External — past Broadcom's reach",tagcls:"med",role:"The equipment makers that buy Broadcom's merchant switch silicon (Tomahawk/Jericho) and build the finished switch box that data centers deploy. Broadcom sells the chip; they build, brand, and support the system. White-box ODMs (Celestica, Accton) do the same for hyperscaler in-house switches.",conf:"med",conftxt:"Industry-standard merchant-silicon structure",why:"Why these names: Arista and Cisco are the leading data-center switch vendors and both build around Broadcom's silicon — widely documented. The exact share each represents to Broadcom is not disclosed; the structural relationship (merchant chip → OEM box) is well-established.",src:[{cls:"thirdparty",q:"Every switch OEM (Arista, Cisco, HPE) designs around Tomahawk; ~90% merchant Ethernet switching share.",c:"Colleague M&A working file / networking industry"}]},
  apple_bcm:{t:"Apple — wireless & connectivity",tag:"Consensus customer (unnamed since FY24)",tagcls:"med",role:"Broadcom's largest wireless customer, understood to be Apple though no longer named in filings. Broadcom supplies the RF/FBAR filter front-end, Wi-Fi/Bluetooth combo chips, and touch/charging components inside iPhones. A multi-year supply agreement was renewed; Apple has tried for a decade to design Broadcom out and largely failed on FBAR. A non-AI, seasonal franchise (~$8-9B/yr) shrinking as a percentage of revenue as AI grows the denominator.",conf:"med",conftxt:"Consensus + disclosed concentration (Apple named through FY23)",why:"Why we say Apple without it being 'named' now: Broadcom's 10-K disclosed 'Apple Inc.' by name as ~20-25% of revenue every year through FY2023, then stopped from FY24 (when the AI distributor became the larger single exposure). The product content (FBAR, Wi-Fi/BT) is the well-documented substance of that relationship. So the identity is disclosed history; what is now opaque is the current exact percentage.",src:[{cls:"disclosed",q:"Aggregate sales to Apple Inc., through all channels, ~20% of net revenue for FY2023 — the last year disclosed by name.",c:"10-K FY2023 customer concentration"},{cls:"thirdparty",q:"Apple has tried for a decade to replace Broadcom's FBAR filters in the iPhone and failed; multi-year supply agreement renewed.",c:"Industry coverage"},{cls:"inference",q:"Wireless revenue ~$2.2B/qtr (~16% of total in FY24) maps to the single North American customer = Apple.",c:"Analyst inference from segment disclosure"}]},
  apple_chips:{t:"What Broadcom sells Apple",tag:"Product detail",tagcls:"med",role:"Three component families inside the iPhone and other Apple devices: (1) FBAR/BAW RF filters — proprietary acoustic filters that separate signal from noise in the 5G radio, made in Broadcom's own Fort Collins fabs (not fabless); (2) Wi-Fi/Bluetooth combo connectivity chips; (3) touch controllers and wireless-charging ASICs. FBAR is the hardest to replace and the margin anchor.",conf:"med",conftxt:"Well-documented product content; customer unnamed in filings",why:"Why FBAR matters most: it is an analog/materials problem (thin-film acoustic resonators on exotic substrates), not a logic-design problem Apple's silicon team can simply absorb — which is why Apple has insourced CPUs/modems but not the filters. The Wi-Fi/BT content is more replaceable, and Apple has worked to reduce it.",src:[{cls:"disclosed",q:"Wireless franchise: RF/FBAR filters (made in-house, US fabs), Wi-Fi/BT combo, touch controllers, inductive-charging ASICs.",c:"10-K FY2025 product taxonomy"},{cls:"thirdparty",q:"FBAR is made at Broadcom's Fort Collins facility using a proprietary process Apple has been unable to replicate.",c:"Industry coverage / colleague M&A file"}]},
  dist_detail:{t:"Distributors & channel — who routes Broadcom",tag:"Channel layer (step 7)",tagcls:"med",role:"Distributors and contract manufacturers route the substantial majority of Broadcom's semiconductor sales — ~48% of revenue flows through distributors. They are channels, not end customers: they take delivery, hold inventory, handle logistics to many buyers, and Broadcom invoices them directly. The named 'one distributor' at 32% (FY25) rising to 42% (Q1'26) is the AI-routing channel.",conf:"hi",conftxt:"Disclosed channel %s; some names historical",why:"The named distributors over time: Foxconn / Hon Hai (FY17-18, ~9-14% direct — routing the Apple/wireless flows), then WT Microelectronics (FY19-23, 13-21% — a Taiwanese semiconductor distributor), then an unnamed 'semiconductor solutions customer, which is a distributor' (FY24+, 28→42% — almost certainly routing the AI/hyperscaler flows). Note: SMCI (Supermicro) is a server-system builder/integrator, not a Broadcom distributor — it sits at the system-build step, not the channel. Broadcom stopped naming the distributor once it became the AI channel.",src:[{cls:"disclosed",q:"Sales to distributors ~48% of net revenue (FY25); one semiconductor-solutions distributor 32% (FY25), 42% (Q1'26).",c:"10-K FY2025 / Q1 FY26 10-Q"},{cls:"disclosed",q:"Direct sales to WT Microelectronics, a distributor, 17-21% of revenue (FY19-FY23).",c:"10-K FY2019-FY2023"},{cls:"disclosed",q:"Foxconn (Hon Hai) 9-14% of revenue (FY17-18), routing primarily wireless/Apple flows.",c:"10-K FY2017-FY2018"}]}
};

function vcOpen(root, id){
  var d=VCDATA[id]; if(!d) return;
  var ov=root.querySelector('#ddOverlay'); if(!ov) return;
  var tagStyle=d.tagcls==='hi'?'background:var(--positive-bg);color:var(--positive)':'background:var(--warning-bg);color:var(--warning)';
  var h='<div class="dd-panel"><div class="dd-head"><div><div class="dd-title">'+esc(d.t)+'</div><span class="dd-tag" style="'+tagStyle+'">'+esc(d.tag)+'</span></div><button class="dd-close" type="button">&times;</button></div><div class="dd-body">';
  h+='<div class="dd-role">'+d.role+'</div>';
  if(d.why){ h+='<div class="dd-why"><div class="dd-why-h">Why this is mapped here</div>'+esc(d.why)+'</div>'; }
  h+='<div class="dd-conf '+(d.conf==='hi'?'hi':'med')+'">'+(d.conf==='hi'?'✓ ':'⚠ ')+esc(d.conftxt)+'</div>';
  h+='<div class="dd-src-h" style="margin-top:13px">Source basis</div>';
  d.src.forEach(function(s){ h+='<div class="dd-src '+s.cls+'"><div class="dd-src-q">“'+esc(s.q)+'”</div><div class="dd-src-c">'+esc(s.c)+'</div></div>'; });
  h+='</div></div>';
  ov.innerHTML=h; ov.classList.add('open');
}

// ════════════════════════════════════════════════════════════════════════════════
// 7 — MANAGEMENT  (All Management — built from scratch + live ownership/insider;
//                  Hock Tan — ported from the source dashboard)
// ════════════════════════════════════════════════════════════════════════════════
// Named executive officers & key division leaders (roles/tenure from the 10-K & proxy).
var AVGO_EXECS = [
  ['Hock E. Tan','President &amp; Chief Executive Officer','2006','Finance/PE operator (MIT + Harvard), not an engineer. Architect of the roll-up; imprinted the "franchise" doctrine on every deal. Contract extended through at least 2030, package tied to ~$120B AI revenue. <b>The company is his strategy.</b>'],
  ['Kirsten M. Spears','EVP, Chief Financial Officer &amp; Chief Accounting Officer','2021 (CFO)','At Broadcom since 2011; CFO since 2021. Runs the margin/cash discipline — the "keel" that funds the dividend, debt paydown and the next deal. Guides the model\'s guardrails (Adj EBITDA ~67–68%).'],
  ['Charlie B. Kawwas, Ph.D.','President, Semiconductor Solutions Group','2023 (President)','Runs the chip business — AI XPUs + the networking franchise (Tomahawk/Jericho, SerDes, optical). The operating leader of the AI growth engine.'],
  ['Mark D. Brazeal','Chief Legal &amp; Corporate Affairs Officer','—','Leads legal, regulatory and corporate affairs — the function that navigates M&amp;A (incl. CFIUS/antitrust) and the integration playbook.'],
  ['Ram Velaga','SVP &amp; GM, Core Switching Group','—','Leads merchant switching — the Ethernet/AI-networking product line that attaches to both Broadcom XPUs and Nvidia-GPU clusters.'],
];

function managementBody(){
  var execRows=AVGO_EXECS.map(function(e){
    return '<tr><td class="mgmt-name" style="white-space:nowrap">'+e[0]+'</td>'+
      '<td style="text-align:left">'+e[1]+'</td>'+
      '<td style="text-align:left;white-space:nowrap">'+e[2]+'</td>'+
      '<td style="text-align:left;font-weight:400;font-size:11px;color:var(--text-secondary)">'+e[3]+'</td></tr>';
  }).join('');

  var allView=
    '<div class="stats-row c4">'+
      '<div class="stat-card t-accent"><div class="stat-label">CEO Since</div><div class="stat-value">2006</div><div class="stat-sub">Hock Tan · ~20 yrs</div></div>'+
      '<div class="stat-card t-accent"><div class="stat-label">CEO Locked To</div><div class="stat-value">2030+</div><div class="stat-sub">extended 2025</div></div>'+
      '<div class="stat-card t-warn"><div class="stat-label">Comp Anchor</div><div class="stat-value">$120B</div><div class="stat-sub">AI-revenue target</div></div>'+
      '<div class="stat-card t-neutral"><div class="stat-label">Model</div><div class="stat-value">Flat</div><div class="stat-sub">operator-led, lean</div></div>'+
    '</div>'+
    card('Leadership team','named executive officers &amp; key division leaders',
      '<div class="card-body" style="padding:0"><table class="tbl">'+
        '<thead><tr><th style="text-align:left">Name</th><th style="text-align:left">Role</th><th style="text-align:left">Since</th><th style="text-align:left">Why they matter</th></tr></thead>'+
        '<tbody>'+execRows+'</tbody></table></div>',
      'Roles &amp; tenure from the Broadcom 10-K FY2025 &amp; latest proxy (DEF 14A). Tenure "—" where the appointment date isn\'t central.')+
    '<div class="card"><div class="card-header"><span class="card-title">Ownership &amp; insider activity</span>'+
        '<span class="card-subtitle" id="mgmt-live-px"></span>'+
        '<button class="modal-btn" id="mgmt-sync-btn" type="button" style="padding:5px 12px;font-size:11px">Sync ↻</button></div>'+
      '<div class="card-body" id="mgmt-own-slot"><div class="seg-loading">Loading ownership data…</div></div>'+
      '<div class="source">Insider holdings &amp; recent transactions are pulled live from Fiscal.ai via the portal\'s data layer — the same source as the Pillars → Management tab. "Value" columns use the live AVGO price where a session is available.</div></div>'+
    card('Key-person risk — the flip side of the operator model','',
      '<div class="card-body"><div class="insight"><strong>Broadcom is one operator\'s judgment.</strong> Two decades of capital-allocation outperformance are inseparable from Hock Tan; his contract runs through at least 2030 with a package tied to ~$120B of AI revenue, bolting operator and thesis together. The team is deliberately lean and finance-led — a strength for cost discipline, a concentration risk on succession. See the <b>Hock Tan</b> view for the full doctrine.</div></div>','');

  var tanView = tanViewHtml();

  return ''+
    '<div class="ovt-subtabs" role="tablist">'+
      '<button class="ovt-subtab active" type="button" data-mgview="all">All Management</button>'+
      '<button class="ovt-subtab" type="button" data-mgview="tan">Hock Tan</button>'+
    '</div>'+
    '<div class="mg-subpane" data-mgview="all">'+allView+'</div>'+
    '<div class="mg-subpane" data-mgview="tan" hidden>'+tanView+'</div>';
}

function tanViewHtml(){
  return ''+
  '<div class="stats-row c4">'+
    '<div class="stat-card t-accent"><div class="stat-label">CEO Since</div><div class="stat-value">2006</div><div class="stat-sub">~20 yrs</div></div>'+
    '<div class="stat-card t-accent"><div class="stat-label">Locked To</div><div class="stat-value">2030+</div><div class="stat-sub">extended 2025</div></div>'+
    '<div class="stat-card t-pos"><div class="stat-label">Acquisitions</div><div class="stat-value">8+</div><div class="stat-sub">LSI → VMware</div></div>'+
    '<div class="stat-card t-warn"><div class="stat-label">2030 Anchor</div><div class="stat-value">$120B</div><div class="stat-sub">AI rev target</div></div>'+
  '</div>'+
  card('Who sits behind the wheel','Broadcom is the strategy of one operator',
    '<div class="card-body prose"><p>Most companies outlast their CEO\'s strategy. Broadcom <em>is</em> its CEO\'s strategy. <strong>Hock Tan</strong> didn\'t inherit Broadcom — he assembled it, deal by deal, over two decades, imprinting a single doctrine on every piece: own sticky franchises, run them for margin, recycle the cash into the next one. He\'s a <strong>finance/PE operator, not an engineer</strong> — which is precisely why Broadcom behaves like a capital-allocation machine rather than a typical chipmaker. His contract runs through at least 2030, with a package tied to ~$120B of AI revenue — operator and thesis bolted together.</p></div>','')+
  '<div class="grid-2-wide">'+
    card('How he makes decisions','a consistent mental model',
      '<div class="card-body"><div class="mini-grid c2">'+
        '<div class="mini l-blue"><div class="mini-t">Capital, not technology</div><div class="mini-d">Every decision is a return-on-capital question. Buys cash flows and market positions, not "innovation." Won\'t chase a roadmap that doesn\'t pay.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Franchise or fix/sell</div><div class="mini-d">If a business is a #1/#2 franchise, invest to defend it. If not, cut it or sell it within months. No sentimentality, no "strategic" loss-leaders.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Margin over growth</div><div class="mini-d">Mature industry → run for cash, not share-of-everything. Will shed revenue to raise margin (prunes low-margin lines post-deal).</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">Concentrate on the few</div><div class="mini-d">Serve the top ~500–1,000 customers who matter; overinvest to stay ahead of #2/#3; ignore the long tail.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Discipline on price paid</div><div class="mini-d">Walks away when price isn\'t right (took only Symantec\'s enterprise half; couldn\'t agree on all of it). The deal must pencil on cost-out, not hope.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">Frugality as culture</div><div class="mini-d">Strips perks and overhead post-close; the unsentimental cost operator. Cost discipline is the DNA, not a one-time event.</div></div>'+
      '</div></div>','')+
    '<div class="card"><div class="card-header"><span class="card-title">A finance operator, not an engineer</span></div>'+
      '<div class="card-body" style="padding:0"><table class="tbl"><tbody>'+
        '<tr><td>MIT + Harvard</td><td style="text-align:left;font-weight:400;font-size:11.5px">finance lens, not engineering</td></tr>'+
        '<tr><td>PepsiCo · GM</td><td style="text-align:left;font-weight:400;font-size:11.5px">corporate finance at scale</td></tr>'+
        '<tr><td>Commodore</td><td style="text-align:left;font-weight:400;font-size:11.5px">lived a tech collapse (CFO into bankruptcy)</td></tr>'+
        '<tr><td>ICS</td><td style="text-align:left;font-weight:400;font-size:11.5px">franchise doctrine born; LBO + IDT merger</td></tr>'+
        '<tr class="row-hi"><td>Avago→AVGO</td><td style="text-align:left;font-weight:700;font-size:11.5px">Silver Lake hire 2006; builds by acquisition</td></tr>'+
      '</tbody></table>'+
      '<div style="padding:11px 13px"><div class="sig-box"><b>The throughline:</b> a CFO who watched a tech company die (Commodore) and learned to run mature franchises for cash (ICS) — then scaled that one idea for 20 years.</div></div></div></div>'+
  '</div>'+
  '<div class="card" style="border:2px solid var(--accent)">'+
    '<div class="card-header" style="background:var(--accent-light)"><span class="card-title" style="color:var(--accent)">★ The Franchise Strategy</span><span class="card-subtitle">the single idea behind everything</span></div>'+
    '<div class="card-body">'+
      '<div class="prose" style="margin-bottom:13px"><p>Tan\'s whole career rests on one concept he calls a <strong>"franchise":</strong> a product with a dominant position and customers who <em>cannot practically leave</em>. The product is <strong>"bought, not sold"</strong> — demand is structural, not won by a sales pitch. The art is identifying these, acquiring them, and then extracting their full economic value while defending the moat. Everything else — the cost-cutting, the price hikes, the M&amp;A cadence — is downstream of this one idea.</p></div>'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent);margin-bottom:8px">The five franchise criteria</div>'+
      '<div class="mini-grid c3" style="margin-bottom:14px">'+
        '<div class="mini l-blue"><div class="mini-t">1 · #1 or #2 position</div><div class="mini-d">Dominant share in a defined category — the default choice in its niche.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">2 · High switching costs</div><div class="mini-d">Leaving means re-qualifying, re-architecting, retraining — months to years of risk.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">3 · Mission-critical</div><div class="mini-d">"Bought, not sold." If it stops, the customer\'s business stops.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">4 · Predictable revenue</div><div class="mini-d">Recurring, embedded, sticky — models cleanly, services debt reliably.</div></div>'+
        '<div class="mini l-blue"><div class="mini-t">5 · High margin potential</div><div class="mini-d">Pricing power once captive; gross margins that can be expanded post-deal.</div></div>'+
        '<div class="mini l-amber"><div class="mini-t">The test in one line</div><div class="mini-d">"Can the customer realistically switch?" If no → franchise. If yes → pass or sell.</div></div>'+
      '</div>'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent);margin-bottom:8px">The playbook — what he does once he owns one</div>'+
      '<div class="mini-grid c3" style="margin-bottom:14px">'+
        '<div class="mini l-teal"><div class="mini-t">Buy (debt-funded)</div><div class="mini-d">Often a target larger than Broadcom; lever up, because the cash flow is predictable enough to service it.</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">Cut 30–50%</div><div class="mini-d">Eliminate headcount, perks, and non-franchise R&amp;D. Bernstein: 60–70% OpEx cuts at CA/Symantec.</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">Sell non-franchise</div><div class="mini-d">Carve out and sell anything that fails the criteria within months (Axxia, Ruckus, IoT).</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">Raise prices at renewal</div><div class="mini-d">Captive customers; honor existing contracts, re-price at renewal (VCF bundle = 2–5×).</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">Convert to subscription</div><div class="mini-d">Where possible, shift perpetual → recurring (the VMware move) for predictability + ARR.</div></div>'+
        '<div class="mini l-teal"><div class="mini-t">De-lever, then repeat</div><div class="mini-d">Margins expand in 12–24 mo; pay down debt; richer stock funds the next, larger franchise.</div></div>'+
      '</div>'+
      '<div class="insight"><strong>Why it compounds:</strong> each cycle raises margins and the stock, which lowers the cost of the next acquisition, which is bigger — so the absolute cash generated grows geometrically. Twenty years of this took EBITDA margin from ~47% to ~68% and the company from ~$4B to $600B+.</div>'+
      '<div class="caution" style="margin-top:9px"><strong>The critique:</strong> this is a model built on <em>acquisition and optimization, not organic innovation</em>. Franchises must keep being bought, and large-enough targets eventually run out — part of what drove the Qualcomm reach and the software pivot. The R&amp;D-cutting also drew the CFIUS scrutiny that blocked Qualcomm. And it concentrates enormous dependence on one operator\'s judgment.</div>'+
    '</div></div>'+
  card('The pivots — strategy reshaped when reality forced it','doctrine constant, arena changing',
    '<div class="card-body"><div class="mini-grid c2">'+
      '<div class="mini l-blue"><div class="mini-t">2014 · Diversify off mobile</div><div class="mini-d">Mobile hit ~50% of rev. Bought LSI → data-center storage + the custom-silicon seed that became AI.</div></div>'+
      '<div class="mini l-blue"><div class="mini-t">2016 · Go bigger</div><div class="mini-d">LSI lifted the stock → currency to buy Broadcom Corp ($37B) + Brocade. Took the name.</div></div>'+
      '<div class="mini l-purple"><div class="mini-t">2018 · Pivot to software</div><div class="mini-d">Qualcomm blocked (CFIUS) → realized he\'d outgrown chip M&amp;A → CA, then Symantec. Lighter scrutiny, stickier cash.</div></div>'+
      '<div class="mini l-ai"><div class="mini-t">2023 · Anchor + ride AI</div><div class="mini-d">VMware = the cash keel; the dormant LSI silicon = the AI engine. Two engines by design.</div></div>'+
    '</div><div class="insight" style="margin-top:11px"><strong>The most consequential pivot was involuntary.</strong> Being blocked from Qualcomm — and recognizing the company had grown too big for chip-on-chip M&amp;A without regulatory walls — is what pushed Tan into software, which became today\'s stability. He adapts the arena; the doctrine never changes.</div></div>','')+
  card('Two-engine machine — why cyclicality doesn\'t capsize it','',
    '<div class="card-body"><div class="grid-2">'+
      '<div class="mini l-blue" style="border-left-width:3px"><div class="mini-t">Engine 1 — Semiconductors</div><div style="font-size:10.5px;color:var(--accent);font-weight:600;margin:2px 0 7px">GROWTH &amp; CYCLICALITY</div><div class="logo-row"><span class="badge b-neutral">58% rev</span><span class="badge b-neutral">~58% OM</span><span class="badge b-ai">AI triple-digit</span><span class="badge b-warn">non-AI cyclical</span></div></div>'+
      '<div class="mini l-purple" style="border-left-width:3px"><div class="mini-t">Engine 2 — Software</div><div style="font-size:10.5px;color:var(--sw);font-weight:600;margin:2px 0 7px">THE KEEL &amp; THE CASH</div><div class="logo-row"><span class="badge b-neutral">42% rev</span><span class="badge b-neutral">~77% OM</span><span class="badge b-sw">~93% gross</span><span class="badge b-neutral">stable cash</span></div></div>'+
    '</div><div class="insight" style="margin-top:12px"><strong>The stability thesis:</strong> AI upside flows through Engine 1; any cyclicality is normalized by Engine 2 — barely grows, ~93% gross margins, predictable cash that funds the dividend, services debt, and lets Tan place volatile chip bets. <strong>Key-person risk</strong> is the flip side: the company is one operator\'s judgment.</div></div>','');
}

function initManagement(pane){
  // Sub-tab (All Management / Hock Tan) switching — wire once per render.
  if(!pane._mgWired){ pane._mgWired = true;
    pane.querySelectorAll('.ovt-subtab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var view=btn.getAttribute('data-mgview');
        pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll('.mg-subpane').forEach(function(p){ p.hidden = (p.getAttribute('data-mgview')!==view); });
      });
    });
    var sync=pane.querySelector('#mgmt-sync-btn');
    if(sync) sync.addEventListener('click', function(){ loadMgmtOwnership(pane, true); });
  }
  // Load live ownership/insider once per render.
  if(!_mgLoaded){ _mgLoaded = true; loadMgmtOwnership(pane, false); }
}

async function loadMgmtOwnership(pane, forceSync){
  var slot = pane.querySelector('#mgmt-own-slot');
  var pxEl = pane.querySelector('#mgmt-live-px');
  if(!slot) return;
  var c = _company;
  if(!c || !c.id){ slot.innerHTML='<div class="seg-loading">No company context for live data.</div>'; return; }

  if(forceSync){
    var btn=pane.querySelector('#mgmt-sync-btn'); if(btn){ btn.disabled=true; btn.textContent='Syncing…'; }
    try { await syncManagement(c.ticker, c.id); } catch(e){}
    if(btn){ btn.disabled=false; btn.textContent='Sync ↻'; }
  }

  slot.innerHTML='<div class="seg-loading">Loading ownership data…</div>';
  var execRes, txRes;
  try { execRes = await fetchExecutives(c.id); txRes = await fetchInsiderTransactions(c.id); }
  catch(e){ slot.innerHTML='<div class="seg-loading">Could not load ownership data.</div>'; return; }
  var execs = (execRes && execRes.success) ? execRes.data : [];
  var txns  = (txRes && txRes.success) ? txRes.data : [];

  // First visit with no cached data → trigger a background sync, then refetch once.
  if(!execs.length && !txns.length && !forceSync){
    try { await syncManagement(c.ticker, c.id); execRes = await fetchExecutives(c.id); txRes = await fetchInsiderTransactions(c.id);
      execs=(execRes&&execRes.success)?execRes.data:[]; txns=(txRes&&txRes.success)?txRes.data:[]; } catch(e){}
  }

  // Live price to value holdings (best-effort; requires a session).
  var price=null;
  try { var q=await liveQuote(c.ticker); if(q&&q.data&&q.data.price!=null) price=q.data.price; } catch(e){}
  if(pxEl && price!=null) pxEl.textContent='AVGO $'+price.toFixed(2)+' · holdings valued live';

  var h='';
  if(execs.length){
    h+='<table class="tbl"><thead><tr><th style="text-align:left">Name</th><th style="text-align:left">Role</th><th>Shares</th><th>Ownership</th><th>Value (live)</th></tr></thead><tbody>';
    execs.forEach(function(e){
      var pct = e.ownership_pct!=null ? e.ownership_pct+'%' : (e.ownership||'—');
      var val = (price!=null && e.shares!=null) ? '$'+((Number(e.shares)*price)/1e6).toFixed(1)+'M' : '—';
      h+='<tr><td style="text-align:left">'+esc(e.name)+'</td><td style="text-align:left;font-weight:400">'+esc(e.role)+'</td>'+
        '<td>'+formatShares(e.shares)+'</td><td>'+esc(pct)+'</td><td>'+val+'</td></tr>';
    });
    h+='</tbody></table>';
  }
  if(txns.length){
    h+='<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin:14px 0 8px">Recent insider activity</div>';
    h+='<table class="tbl"><thead><tr><th style="text-align:left">Date</th><th style="text-align:left">Person</th><th style="text-align:left">Action</th><th>Shares</th><th>Price</th></tr></thead><tbody>';
    txns.slice(0,12).forEach(function(tx){
      var isBuy = tx.transaction_type==='buy';
      var price2 = tx.price_per_share!=null ? '$'+Number(tx.price_per_share).toFixed(2) : '—';
      h+='<tr><td style="text-align:left">'+esc(tx.transaction_date||'')+'</td><td style="text-align:left;font-weight:400">'+esc(tx.person_name)+'</td>'+
        '<td style="text-align:left"><span class="badge '+(isBuy?'b-pos':'b-neg')+'">'+(isBuy?'Bought':'Sold')+'</span></td>'+
        '<td>'+formatShares(tx.shares)+'</td><td>'+price2+'</td></tr>';
    });
    h+='</tbody></table>';
  }
  if(!h) h='<div class="seg-loading">No ownership or insider data available for AVGO yet. Click <b>Sync ↻</b> to pull from Fiscal.ai.</div>';
  slot.innerHTML=h;
}

// ════════════════════════════════════════════════════════════════════════════════
// 8 — PE STRATEGY  (the Hock Tan private-equity playbook, since 2006)
// Narrative sourced from avgo-context/AVGO_PE_strategy.md. Deal-level cost/price figures
// are analyst/press estimates ([est]); company-disclosed items (goodwill, debt, margins,
// revenue) are ground truth.
// ════════════════════════════════════════════════════════════════════════════════
function deal(cls, num, name, meta, statsHtml, keptHtml, soldHtml, sig, soldHead){
  return '<div class="deal '+cls+'"><div class="deal-head"><span class="deal-num">'+num+'</span><span class="deal-name">'+name+'</span>'+
    '<div class="deal-meta">'+meta+'</div></div><div class="deal-body">'+
    (statsHtml?'<div class="deal-stats">'+statsHtml+'</div>':'')+
    '<div class="kept-sold"><div><div class="ks-h kept">Kept</div>'+keptHtml+'</div>'+
      '<div><div class="ks-h sold">'+(soldHead||'Sold')+'</div>'+soldHtml+'</div></div>'+
    '<div class="sig-box"><b>Significance:</b> '+sig+'</div></div></div>';
}
function ds(l,v){ return '<div class="ds"><div class="ds-l">'+l+'</div><div class="ds-v">'+v+'</div></div>'; }
function ks(t){ return '<div class="ks-item">'+t+'</div>'; }
function pmini(cls,t,d){ return '<div class="mini '+cls+'"><div class="mini-t">'+t+'</div><div class="mini-d">'+d+'</div></div>'; }

function maDeepBody(){
  var deals=''+
  deal('marquee','1','LSI Logic','<span class="badge b-accent">May 2014</span><span class="badge b-neutral">$6.6B</span><span class="badge b-warn">70% leverage (LBO)</span>',
    ds('Structure','$1B cash + $1B SL + $4.6B debt')+ds('EV/EBITDA','~8.25x')+ds('Acquirer size','Avago ~$2.5B rev')+ds('Recovered (sales)','$1.1B → net ~$5.5B'),
    ks('<b>Custom silicon (ASIC) team</b> — ~$50M rev, ignored at the time. Became the Google TPU engine and the $20B+ AI business.')+ks('<b>RAID controllers (MegaRAID)</b> — #1 share, designed into Dell/HPE/Lenovo servers.')+ks('<b>PCIe switches</b> — route data inside servers; can\'t swap without board redesign.'),
    ks('<b>Axxia networking</b> → Intel, $650M (4 months post-close)')+ks('<b>Flash/SSD controllers</b> → Seagate, $450M'),
    'Set the template — LBO on a target half the acquirer\'s market cap, strip non-core for cash, expand margins. The AI outcome was pure serendipity: the "throwaway" ASIC team went from ~$50M to $8.4B in a single quarter (Q1 FY26).')+
  deal('tuck','2','Emulex','<span class="badge b-neutral">May 2015</span><span class="badge b-neutral">$606M</span><span class="badge b-neutral">all cash</span>','',
    ks('<b>Fibre Channel HBAs</b> — cards connecting servers to storage in banks/hospitals. Requalifying the storage network is something nobody does voluntarily.'),
    ks('Nothing.'),
    'Tuck-in to consolidate storage networking ahead of Brocade. Likely funded from LSI carve-out proceeds.')+
  deal('marquee','3','Broadcom Corporation','<span class="badge b-accent">Feb 2016</span><span class="badge b-neutral">$37B</span><span class="badge b-accent">first stock deal (54%)</span>',
    ds('Structure','~$17B cash + ~$20B stock')+ds('EV/EBITDA','~11.6x')+ds('Rev step-up','$6.8B → $17.6B')+ds('Goodwill added','~$24B'),
    ks('<b>Tomahawk Ethernet switches</b> — ~90% merchant share; the foundation of the AI-networking story ($10B+ backlog today).')+ks('<b>FBAR RF filters</b> — proprietary, Fort Collins fab; the Apple franchise ($6–8B/yr).')+ks('<b>Wi-Fi/BT combo, broadband, GPS/touch</b>'),
    ks('<b>Wireless IoT</b> → Cypress, $550M (commoditized, off-franchise)'),
    'Avago took the Broadcom name (kept AVGO ticker). Gave it the complete networking portfolio behind the AI story — but the R&amp;D cuts drew the CFIUS scrutiny that blocked Qualcomm two years later.')+
  deal('tuck','4','Brocade','<span class="badge b-neutral">Nov 2017</span><span class="badge b-neutral">$5.9B</span><span class="badge b-neutral">~6.6x — lowest multiple</span>','',
    ks('<b>Fibre Channel SAN switches</b> — with Emulex HBAs + LSI RAID = end-to-end enterprise storage dominance. Banks won\'t rewire storage voluntarily.'),
    ks('<b>Ruckus + ICX (IP networking)</b> → Arris, ~$800M. Announced upfront — net cost ~$5.1B.'),
    'Completed the enterprise-storage stack. Last pure-semiconductor deal before the software pivot. A "melting ice cube" — declining but very slowly, high cash.')+
  deal('pivot','5','CA Technologies','<span class="badge b-sw">Nov 2018</span><span class="badge b-neutral">$18.9B</span><span class="badge b-warn">100% debt</span><span class="badge b-neg">stock −20% on news</span>',
    ds('Context','6 wks after Qualcomm block')+ds('EV/EBITDA','~10.5x')+ds('Target growth','~0% (pure harvest)')+ds('EBITDA margin','56% → 64% in 2 yrs'),
    ks('<b>Mainframe software</b> — schedules bank batch jobs; security (ACF2), database (IDMS), monitoring. Mission-critical.')+ks('<b>The COBOL lock-in</b> — manages mainframes running 220B lines of COBOL (95% of ATM swipes). Migration is catastrophic (UK TSB 2018: £330M+, CEO resigned).'),
    ks('Nothing material — pruned low-margin lines.'),
    'The pivot deal. Analysts were furious ("runs completely against the narrative") — stock recovered in 6 months as margins expanded. Proved the franchise playbook works on software, with 90%+ gross margins. Changed Broadcom\'s identity.','Sold')+
  deal('pivot','6','Symantec (Enterprise Security)','<span class="badge b-sw">Nov 2019</span><span class="badge b-neutral">$10.7B</span><span class="badge b-neutral">enterprise half only</span>','',
    ks('<b>Endpoint Protection (SEP)</b> — on every corporate device; removing = 6–12 month rollout across 50,000+ devices.')+ks('<b>Web/Email security, DLP, IAM</b> — DLP often a regulatory requirement, not optional.'),
    ks('<b>Consumer (Norton, LifeLock)</b> stayed behind → became Gen Digital. Consumer can switch in 5 min; enterprise is trapped.'),
    'Reinforced software; proved CA was repeatable. Software went 0% → ~22% of revenue. Taking only the enterprise half suited Tan perfectly — the franchise half, none of the commodity half.','Not acquired')+
  deal('marquee','7','VMware','<span class="badge b-accent">Nov 2023</span><span class="badge b-neutral">~$61B → ~$86B at close</span><span class="badge b-accent">largest tech deal ever</span>',
    ds('Structure','$28.4B loans + $8B debt + ~$30B stock')+ds('Market share','72% server virtualization')+ds('SW op margin','74% → 65% → 78%')+ds('Goodwill added','+$53.9B (total $97.8B)'),
    ks('<b>vSphere/ESXi</b> — the hypervisor, 72% share. Replacing = 2–3 yr, $50–100M+ migration.')+ks('<b>VCF bundle</b> — forced bundle of vSphere+NSX+vSAN on 3-yr subs; how prices rose 2–5×. 90%+ of top 10k adopted.')+ks('<b>NSX, vSAN, Tanzu, Private AI</b>'),
    ks('Nothing — no carve-outs.'),
    'The masterwork. Every element of the playbook at maximum scale. Created the two-engine model — volatile AI growth + the 93%-gross-margin software "keel" that funds the dividend, debt, AI investment, and future M&amp;A.');

  return ''+
  card('The private-equity playbook under Hock Tan','a ~$2.5B carve-out → $600B+, by machine — not organic innovation',
    '<div class="card-body"><div class="prose" style="margin-bottom:12px"><p>Broadcom&apos;s strategy isn&apos;t a corporate strategy that happens to have a CEO — it <b>is</b> the CEO. Since 2006, Hock Tan has run one repeatable idea at escalating scale: <b>buy a franchise with debt, cut its cost, optimize it for cash, then recycle the proceeds into the next, larger franchise.</b> The AI business is the serendipitous payoff of a franchise (LSI&apos;s ASIC team) bought a decade ago for entirely different reasons; the software keel (VMware) is the deliberate stabilizer that lets the volatile chip bets ride.</p></div>'+
      '<div class="stats-row c5">'+
        '<div class="stat-card t-accent"><div class="stat-label">Value created</div><div class="stat-value">$4B → $600B+</div><div class="stat-sub">2009 IPO → today</div></div>'+
        '<div class="stat-card t-pos"><div class="stat-label">Adj. EBITDA margin</div><div class="stat-value">47% → 68%</div><div class="stat-sub">FY14 → Q1&apos;26</div></div>'+
        '<div class="stat-card t-neutral"><div class="stat-label">Goodwill</div><div class="stat-value">$97.8B</div><div class="stat-sub">~58% of assets · roll-up residue</div></div>'+
        '<div class="stat-card t-warn"><div class="stat-label">Largest deal</div><div class="stat-value">VMware ~$86B</div><div class="stat-sub">at close · biggest tech deal ever</div></div>'+
        '<div class="stat-card t-ai"><div class="stat-label">Doctrine lock</div><div class="stat-value">2006 → 2030+</div><div class="stat-sub">Hock Tan tenure</div></div>'+
      '</div></div>','')+

  card('1 · Origin — where the doctrine came from','Broadcom was born a private-equity asset',
    '<div class="card-body"><div class="prose" style="margin-bottom:11px"><p>In 2005 <b>KKR &amp; Silver Lake</b> bought Agilent&apos;s semiconductor division in a ~$2.65B leveraged buyout, creating <b>Avago</b> — so the discipline (buy with debt, cut cost, optimize for cash) was installed at birth, not adopted later. Silver Lake then installed the operator to run it.</p></div>'+
      '<div class="mini-grid c2">'+
        pmini('l-purple','PE parentage','Broadcom&apos;s DNA is literally a PE portfolio company. The LBO logic — buy, cut, optimize, compound — predates the semiconductors. Every capital-allocation decision since traces back to this.')+
        pmini('l-blue','The operator — a financier, not an engineer','<b>Hock Tan</b>, CEO since 2006: MIT + Harvard MBA; corporate finance at PepsiCo &amp; GM; CFO of Commodore as it collapsed (the aversion to speculative, roadmap-driven R&amp;D was forged here); ran the ICS LBO where the <b>&ldquo;franchise&rdquo;</b> doctrine was born.')+
      '</div>'+
      '<div class="insight" style="margin-top:10px">A CFO who lived a tech collapse and learned to run mature franchises for cash — then scaled that single idea for ~20 years with progressively larger amounts of leverage.</div>'+
    '</div>','')+

  card('2 · The core concept — the &ldquo;franchise&rdquo;','buy products customers cannot practically leave',
    '<div class="card-body"><div class="prose" style="margin-bottom:11px"><p>A <b>franchise</b> is a product with a dominant market position and customers who <b>cannot practically leave</b> — it is <i>bought, not sold</i>: demand is structural, not won by a sales pitch. Everything downstream (the leverage, the cost cuts, the price hikes, the M&amp;A cadence) exists to serve this one idea.</p></div>'+
      '<div class="mini-grid c2">'+
        pmini('l-blue','1 · #1 or #2 market position','The default choice in a defined category.')+
        pmini('l-teal','2 · High switching costs','Leaving means re-qualifying, re-architecting, retraining — months to years of risk and cost.')+
        pmini('l-coral','3 · Mission-critical','If the product stops, the customer&apos;s business stops.')+
        pmini('l-amber','4 · Predictable revenue','Recurring, embedded, sticky — models cleanly and services debt reliably.')+
        pmini('l-purple','5 · High margin potential','Pricing power once the customer is captive; gross margins expandable post-acquisition.')+
      '</div>'+
      '<div class="insight" style="margin-top:10px"><b>The one-line test:</b> &ldquo;Can the customer realistically switch?&rdquo; If <b>no</b> → it&apos;s a franchise: buy it and defend it. If <b>yes</b> → cut it, sell it, or don&apos;t buy it. This single test explains why Broadcom buys some things, refuses others, and sells off pieces within months of closing.</div>'+
    '</div>','')+

  card('3 · The playbook — the repeatable machine','the same six-step cycle, at escalating scale',
    '<div class="card-body"><div class="mini-grid c3">'+
        pmini('l-blue','1 · BUY','Debt-funded, often a target <i>bigger</i> than the buyer — underwritten on post-synergy cash flow, not current scale (LSI ~70% leverage; VMware ~$86B).')+
        pmini('l-coral','2 · CUT','Strip 30–50%+ of cost immediately — headcount, overhead, and non-franchise R&amp;D. CA/Symantec cost-outs ~60–70% of opex [est].')+
        pmini('l-amber','3 · SELL','Within months, carve out and sell whatever fails the franchise test — lowering the effective purchase price (LSI: Axxia→Intel $650M, Flash→Seagate $450M).')+
        pmini('l-purple','4 · RAISE PRICES','Re-price captive customers at renewal. VMware&apos;s VCF bundle drove effective increases of <b>2–5×</b> [est]. Existing contracts honored — legally clean, economically brutal.')+
        pmini('l-teal','5 · SUBSCRIBE','Convert perpetual licenses to recurring subscriptions — turning lumpy licenses into an annuity; builds ARR and lifetime value.')+
        pmini('l-ai','6 · DE-LEVER &amp; REPEAT','Margins expand in 12–24 mo; FCF pays down the debt; a richer stock lowers the cost of the next, larger deal. Then repeat.')+
      '</div>'+
      '<div class="insight" style="margin-top:10px"><b>Why it compounds geometrically:</b> each cycle raises both margins <i>and</i> equity value, which lowers the relative cost of the next (bigger) deal — so the cash generated grows faster than linearly. Twenty years of it: EBITDA margin ~47% → ~68%; company value ~$4B → $600B+.</div>'+
    '</div>','')+

  card('4 · The deal ladder — the playbook at escalating scale','$6.6B → $0.6B → $37B → $5.9B → $18.9B → $10.7B → $61B · every marquee bigger than the last',
    '<div class="card-body"><div class="prose" style="margin-bottom:10px"><p>Each marquee deal is bigger than the last; tuck-ins fill the gaps. <b>All marquee deals close in Q1 (Nov–Feb)</b> — the fiscal year ends ~Oct 31, so Tan times closings to put integration costs at the start of the year and get a full year to optimize before the next annual comparison.</p></div>'+
      '<div class="legend">'+
        '<div class="legend-i"><span class="legend-sw" style="background:var(--accent)"></span>Marquee (each bigger than the last)</div>'+
        '<div class="legend-i"><span class="legend-sw" style="background:var(--neutral-color)"></span>Tuck-in</div>'+
        '<div class="legend-i"><span class="legend-sw" style="background:var(--sw)"></span>Software pivot</div>'+
        '<div class="legend-i"><span class="legend-sw" style="background:var(--negative)"></span>Blocked</div>'+
      '</div>'+deals+'</div>','')+

  '<div class="card"><div class="card-header"><span class="card-title">5 · Financial mechanics — the fingerprint on the statements</span><span class="card-subtitle">quarterly, FY14–Q1 FY26 · dashed lines mark deal closings</span></div>'+
    '<div class="card-body"><div class="prose" style="margin-bottom:11px"><p><strong>Why deals close in Q1:</strong> every marquee deal closes Nov–Feb (Q1 of the new fiscal year, since FY ends ~Oct 31). Not coincidence — closing in Q1 puts integration costs at the start of the year, giving a full year to optimize before the next annual comparison.</p></div>'+
      '<div class="grid-2">'+
        '<div class="dchart"><h4>Total revenue ($B)</h4><div class="ds-sub">each deal = a step-up; software (teal) only after CA</div><div class="dchart-c"><canvas id="dRev"></canvas></div></div>'+
        '<div class="dchart"><h4>Total debt ($B)</h4><div class="ds-sub">spikes on close, then paid down; VMware the largest</div><div class="dchart-c"><canvas id="dDebt"></canvas></div></div>'+
        '<div class="dchart"><h4>Goodwill ($B)</h4><div class="ds-sub">staircases up, never comes down — $97.8B, ~58% of assets</div><div class="dchart-c"><canvas id="dGw"></canvas></div></div>'+
        '<div class="dchart"><h4>Cash &amp; equivalents ($B)</h4><div class="ds-sub">builds between deals, depleted on closing, rebuilds from FCF</div><div class="dchart-c"><canvas id="dCash"></canvas></div></div>'+
        '<div class="dchart"><h4>Non-GAAP EBITDA margin (%)</h4><div class="ds-sub">each deal dilutes, then cost-cutting expands past prior peak</div><div class="dchart-c"><canvas id="dEbitda"></canvas></div></div>'+
        '<div class="dchart"><h4>GAAP operating margin (%)</h4><div class="ds-sub">structurally lower — acquisition amortization; FY24 VMware dip</div><div class="dchart-c"><canvas id="dGaap"></canvas></div></div>'+
      '</div>'+
      '<div class="dchart"><h4>Free cash flow ($B)</h4><div class="ds-sub">the engine funding dividends, debt paydown, buybacks, and the next deal</div><div class="dchart-c" style="height:150px"><canvas id="dFcf"></canvas></div></div>'+
    '</div><div class="source">Quarterly series and per-deal detail from analyst working files (colleague\'s M&amp;A workstream). Closing EVs differ from announced prices (e.g. VMware ~$61B announced, ~$86B at close).</div></div>'+

  card('The Unallocated bucket links the strategy to the DCF','why GAAP and non-GAAP diverge so sharply',
    '<div class="card-body"><div class="insight">Segment operating income (~$45B combined) is roughly <b>2× GAAP operating income</b> ($25.5B FY25). The ~$16.5B gap is the M&amp;A cost the strategy generates — <b>intangible amortization, SBC, restructuring, acquisition costs</b>. Three of those four run off over time <i>absent a new deal</i> — which is why &ldquo;will there be a next mega-deal?&rdquo; is the single biggest modeling fork: no deal → Unallocated falls → GAAP margin mechanically widens.</div></div>','')+

  card('6 · Limits, risks &amp; critiques','the tensions a serious analysis has to hold',
    '<div class="card-body"><div class="mini-grid c2">'+
        pmini('l-coral','Regulatory ceiling','The <b>Qualcomm bid ($103–117B, 2018) was blocked</b> on CFIUS national-security grounds — the involuntary pivot to software. Broadcom had outgrown chip-on-chip M&amp;A without regulatory walls; its R&amp;D-cutting reputation fed the scrutiny.')+
        pmini('l-amber','Acquisition, not organic innovation','The model needs a steady supply of category-leading, debt-serviceable franchises — and each cycle needs a <i>bigger</i> one to move the needle. That scarcity is part of what drove the reach for Qualcomm.')+
        pmini('l-coral','Customer &amp; reputational backlash','The price-hike playbook breeds resentment. VMware customers publicly protested the VCF re-pricing; pricing pressure reportedly pushed Google to add MediaTek as a second TPU source [est].')+
        pmini('l-amber','Key-person dependence','Broadcom <i>is</i> Hock Tan&apos;s strategy. His contract runs to 2030+ (tied to ~$120B AI revenue), but the concentration of strategic judgment in one person has no obvious succession answer.')+
        pmini('l-purple','The &ldquo;melting ice cube&rdquo;','Many acquired franchises (mainframe, FC SAN, legacy security) decline — but very slowly. The strategy monetizes decline efficiently; a chunk of the company is structurally shrinking, masked by price hikes and the AI growth on top.')+
      '</div></div>','')+

  card('7 · Where the strategy is heading','the AI era changed the inputs, not the logic',
    '<div class="card-body"><div class="mini-grid c2">'+
        pmini('l-ai','AI growth now does what M&amp;A used to','Tan signals no near-term need for a mega-deal — AI is growing fast enough organically ($56B FY26 guide, &gt;$100B FY27) to hit targets. New: for two decades, growth <i>was</i> M&amp;A.')+
        pmini('l-blue','De-levering preserves optionality','Paying VMware debt down ($73B → ~$68B) rebuilds the capacity to do the next big deal when the moment comes.')+
        pmini('l-teal','The recursion still stands','If AI cools, the playbook resumes — the likeliest next target class is software (lighter scrutiny than semis, stickier cash, proven at CA/Symantec/VMware).')+
        pmini('l-purple','A new variant — PE applied outward','The Apollo/Blackstone <b>XPU financing platform</b> (20+ GW through 2028, $35B first tranche) applies PE-style structured finance to the <i>customer</i> side — funding frontier labs&apos; compute access.')+
      '</div>'+
      '<div class="insight" style="margin-top:10px"><b>The synthesis:</b> a 20-year compounding machine that buys sticky franchises, optimizes them ruthlessly for cash, and recycles the proceeds into progressively larger ones — leverage as fuel, free cash flow as the pump. The doctrine hasn&apos;t changed since 2006; only the arena has.</div>'+
    '</div>','');
}

// M&A quarterly series (ported).
var MQ=['Q1 14','Q2 14','Q3 14','Q4 14','Q1 15','Q2 15','Q3 15','Q4 15','Q1 16','Q2 16','Q3 16','Q4 16','Q1 17','Q2 17','Q3 17','Q4 17','Q1 18','Q2 18','Q3 18','Q4 18','Q1 19','Q2 19','Q3 19','Q4 19','Q1 20','Q2 20','Q3 20','Q4 20','Q1 21','Q2 21','Q3 21','Q4 21','Q1 22','Q2 22','Q3 22','Q4 22','Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26'];
var mSemiR=[1.05,1.05,1.35,1.55,1.55,1.6,1.7,1.95,1.95,3.3,3.5,3.6,4.2,4.3,4.5,4.6,4.4,5.1,5.2,5.3,5.8,5.5,5.5,5.8,5.9,5.7,5.8,6.5,6.2,6.6,7.0,7.4,6.6,6.6,6.9,7.2,7.1,6.8,7.0,7.3,7.4,7.2,7.3,8.2,8.2,8.4,9.2,11.1,12.5];
var mSwR=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.4,1.4,1.4,1.4,1.7,1.7,1.4,1.6,1.7,1.6,1.8,1.8,1.7,1.9,1.9,1.9,1.8,1.9,1.9,2.0,4.6,5.3,5.8,5.8,6.7,6.6,6.8,6.9,6.8];
var mDebt=[2.5,2.5,6.5,6.2,6.0,6.0,5.8,5.5,5.2,22.5,22.0,21.0,19.0,17.8,17.5,17.2,17.8,18.0,17.5,17.5,32.5,32.0,31.5,31.0,35.5,35.0,34.5,34.0,32.0,31.0,30.0,29.5,29.0,28.5,28.0,27.5,28.0,28.5,28.0,39.0,73.5,73.0,72.0,71.0,68.8,68.5,67.5,67.1,68.0];
var mGw=[0.7,0.7,3.8,3.8,3.8,3.8,4.0,4.0,4.0,26.7,26.7,26.7,26.9,26.9,26.9,26.9,26.9,26.9,26.9,26.9,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.0,37.5,37.5,37.5,37.5,43.6,43.6,43.6,43.8,97.8,97.8,97.8,97.8,97.8,97.8,97.8,97.8,97.8];
var mCash=[0.5,0.5,0.8,0.9,1.0,1.1,1.2,1.5,1.5,2.0,2.8,3.3,4.1,4.5,4.8,5.0,4.8,4.2,4.5,5.0,4.8,4.5,4.3,5.9,5.2,4.6,5.1,5.2,7.6,8.5,10.0,12.2,11.5,11.0,12.1,12.4,12.7,13.2,13.9,14.2,9.3,8.5,9.5,10.7,9.3,9.5,10.7,16.2,14.2];
var mEbitda=[44,45,46,47,47,48,49,49,50,48,50,52,53,53,53,53,54,55,56,56,53,55,56,57,54,56,57,54,59,60,60,60,62,63,64,65,64,64,64,65,60,59,60,63,68,67,67,68,68];
var mGaap=[12,13,14,14,15,12,14,15,16,8,12,14,18,20,22,23,24,25,26,27,15,18,20,22,8,10,15,11,21,25,28,28,27,28,30,33,32,30,31,32,17,24,29,33,42,39,37,42,44];
var mFcf=[0.35,0.35,0.5,0.6,0.6,0.6,0.65,0.7,0.7,0.9,1.1,1.2,1.5,1.7,1.8,1.8,1.7,2.0,2.2,2.2,1.8,2.0,2.3,2.5,2.1,2.1,2.3,2.6,2.5,2.5,2.6,2.6,3.0,3.1,3.5,3.6,3.8,3.8,3.3,3.5,3.5,3.0,3.5,4.2,4.7,4.3,4.4,5.5,6.0];
var mDeals=[{x:'Q3 14',l:'LSI'},{x:'Q2 16',l:'BRCM'},{x:'Q1 18',l:'Brocade'},{x:'Q1 19',l:'CA'},{x:'Q1 20',l:'Symantec'},{x:'Q1 24',l:'VMware'}];

function mAnnotations(){
  var mAnn={};
  mDeals.forEach(function(d,i){ mAnn['l'+i]={type:'line',scaleID:'x',value:d.x,borderColor:'rgba(46,117,182,0.45)',borderWidth:1.3,borderDash:[3,2],
    label:{display:true,content:d.l,position:'start',font:{size:8,family:'Figtree',weight:'600'},color:'#2E75B6',backgroundColor:'rgba(255,255,255,0.85)',padding:2,yAdjust:-2}}; });
  return mAnn;
}
function mOpts(cb,min,max){ return {responsive:true,maintainAspectRatio:false,
  plugins:{legend:{display:false},annotation:{annotations:mAnnotations()},tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:10},bodyFont:{family:'Figtree',size:11},padding:8,cornerRadius:6,callbacks:{label:function(c){return (c.dataset.label?c.dataset.label+': ':'')+(cb?cb(c.raw):c.raw);}}}},
  scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:8},color:'#9AACBE',maxRotation:45,autoSkip:true,maxTicksLimit:13}},
    y:{grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},min:min,max:max,ticks:{font:{family:'Figtree',size:9},color:'#9AACBE',callback:cb||undefined}}}}; }

function initMaDeep(pane){
  if(pane._charted) return; pane._charted = true;
  freshChart('dRev',{type:'bar',data:{labels:MQ,datasets:[
    {label:'Semi',data:mSemiR,backgroundColor:'#CC092F',borderRadius:1},
    {label:'Software',data:mSwR,backgroundColor:'#007A8C',borderRadius:1}]},
    options:Object.assign({},mOpts(function(v){return '$'+v+'B';}),{scales:{x:{stacked:true,grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:8},color:'#9AACBE',maxRotation:45,autoSkip:true,maxTicksLimit:13}},y:{stacked:true,grid:{color:'#EDF0F5'},border:{display:false},ticks:{font:{family:'Figtree',size:9},color:'#9AACBE',callback:function(v){return '$'+v+'B';}}}}})});
  function mk(id,data,color,cb,min,max,stepped){ return freshChart(id,{type:'line',data:{labels:MQ,datasets:[{data:data,borderColor:color,backgroundColor:color+'14',fill:true,tension:stepped?0:0.3,stepped:stepped||false,pointRadius:0,pointHoverRadius:4,borderWidth:2}]},options:mOpts(cb,min,max)}); }
  mk('dDebt',mDebt,'#CC092F',function(v){return '$'+v+'B';});
  mk('dGw',mGw,'#CC092F',function(v){return '$'+v+'B';},0,null,'before');
  mk('dCash',mCash,'#007A8C',function(v){return '$'+v+'B';});
  mk('dEbitda',mEbitda,'#CC092F',function(v){return v+'%';},40,72);
  mk('dGaap',mGaap,'#5B3E96',function(v){return v+'%';},0,50);
  freshChart('dFcf',{type:'bar',data:{labels:MQ,datasets:[{data:mFcf,backgroundColor:'rgba(204,9,47,0.7)',borderRadius:1}]},options:mOpts(function(v){return '$'+v+'B';})});
}

// ─── Tab registry + shell ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
// 9 — VALUATION  (live price from Massive → live P/E, EV/EBITDA & FCF yield on BBG consensus)
// ════════════════════════════════════════════════════════════════════════════════
// Denominators are Bloomberg consensus (estimate source BST) from avgo-context/AVGO_BBG.xlsx:
// FY2025 is reported actual, FY2026E–FY2029E are Bloomberg forward estimates. Fiscal year
// ends early November. The *numerator* (price, market cap, enterprise value) is pulled live
// from Massive via liveQuote('AVGO'), so every multiple recomputes off the quote intraday.
var VAL_FY      = ['FY25A','FY26E','FY27E','FY28E','FY29E'];
var VAL_EST     = [false, true, true, true, true];              // true → forward estimate (dimmed row)
var VAL_REV     = [63887, 105811, 173276, 226681, 312679];     // $M · Total revenue
var VAL_EBITDA  = [43004, 71964, 116966, 154241, 205721];      // $M · Adjusted EBITDA
var VAL_EPS     = [6.82, 11.59, 19.23, 25.72, 34.12];          // $  · Adjusted diluted EPS
var VAL_FCF     = [26914, 50805, 90257, 117766, 158184];       // $M · Free cash flow
var VAL_NETDEBT = 50283;   // $M · FY25A net debt (BBG) — EV fallback if the live quote omits EV
var VAL_SHARES_FALLBACK = 4943e6;  // FY25A diluted shares (BBG) — fallback if the quote omits it

var _valQuote = null;  // cached live AVGO quote for this render

function valUsd(v){ if(v>=1e12) return '$'+(v/1e12).toFixed(2)+'T'; if(v>=1e9) return '$'+(v/1e9).toFixed(1)+'B'; return '$'+Math.round(v/1e6).toLocaleString()+'M'; }
function valSetTxt(pane,id,t){ var el=pane.querySelector('#'+id); if(el) el.textContent=t; }
// Live enterprise value: prefer Massive's EV; else market cap + FY25A net debt.
function valEV(q){
  if(q.ev!=null) return q.ev;
  var sh = q.shares!=null ? q.shares : VAL_SHARES_FALLBACK;
  var mc = q.marketCap!=null ? q.marketCap : q.price*sh;
  return mc + VAL_NETDEBT*1e6;
}
function valMC(q){ return q.marketCap!=null ? q.marketCap : q.price*(q.shares!=null?q.shares:VAL_SHARES_FALLBACK); }
function valKpi(id,label,cls){
  return '<div class="stat-card '+cls+'"><div class="stat-label">'+label+'</div>'+
    '<div class="stat-value" id="val-'+id+'">…</div><div class="stat-sub">at live price</div></div>';
}

function valuationBody(){
  var h = '';
  h += '<p class="ov-lede">How Broadcom is trading <b>right now</b> against <b>Bloomberg consensus</b>. Price, market cap and enterprise value come <b>live</b> from Massive (needs a signed-in session); every P/E, EV/EBITDA and FCF yield recomputes off that quote against FY25A actuals and the FY26E–FY29E Bloomberg estimates — so you can see the multiple <b>compress</b> as earnings grow into the price.</p>';
  h += '<div class="ov-live" id="avgoValLive" hidden></div>';
  h += '<div class="stats-row c5" id="avgoValKpis">'+
      valKpi('pe25','P/E · FY25A','t-neutral')+
      valKpi('pe26','P/E · FY26E','t-accent')+
      valKpi('eve25','EV/EBITDA · FY25A','t-neutral')+
      valKpi('eve26','EV/EBITDA · FY26E','t-accent')+
      valKpi('fcf26','FCF yield · FY26E','t-pos')+
    '</div>';
  h += card('Multiples at the live price','implied off today’s quote, across the BBG consensus curve',
      '<div class="card-body"><div style="overflow-x:auto"><table class="tbl" id="avgoValTbl">'+
        '<thead><tr><th style="text-align:left">Fiscal year</th><th>Revenue</th><th>Adj. EBITDA</th>'+
        '<th>Adj. EPS</th><th>FCF</th><th>P/E</th><th>EV/EBITDA</th></tr></thead><tbody></tbody></table></div></div>',
      'FY25A reported actual; FY26E–FY29E Bloomberg consensus (BST). P/E = live price ÷ EPS · EV/EBITDA = live EV ÷ adj. EBITDA · using the live enterprise value across all years.');
  h += card('Forward multiple compression','P/E &amp; EV/EBITDA at the live price, FY25A → FY29E',
      '<div class="card-body"><div class="chart-c"><canvas id="cValFwd"></canvas></div></div>',
      'Both lines hold the live price/EV constant and step across each year’s Bloomberg estimate — the fall shows how fast consensus growth de-rates the multiple. Needs a signed-in session to populate.');
  h += '<div class="ov-foot">Fundamentals: Bloomberg consensus (estimate source BST), from <code>avgo-context/AVGO_BBG.xlsx</code> — FY25A reported, FY26E–FY29E forward. Live quote via Massive (<code>liveQuote(\'AVGO\')</code>); if values show “…”, the session isn’t authenticated or the feed is unavailable. FY25A net debt $50.3B; forward EV/EBITDA holds today’s EV constant (standard convention), not each year’s projected net cash.</div>';
  return h;
}

function renderValTable(pane, q){
  var tb = pane.querySelector('#avgoValTbl tbody'); if(!tb) return;
  var ev = q ? valEV(q) : null;
  var rows='';
  for(var i=0;i<VAL_FY.length;i++){
    var pe  = q ? (q.price/VAL_EPS[i]).toFixed(1)+'×' : '—';
    var eve = (q && ev!=null) ? (ev/(VAL_EBITDA[i]*1e6)).toFixed(1)+'×' : '—';
    rows += '<tr'+(VAL_EST[i]?' class="row-est"':'')+'>'+
      '<td style="text-align:left">'+VAL_FY[i]+(VAL_EST[i]?' <span class="est-tag">BBG est</span>':'')+'</td>'+
      '<td>$'+(VAL_REV[i]/1000).toFixed(1)+'B</td>'+
      '<td>$'+(VAL_EBITDA[i]/1000).toFixed(1)+'B</td>'+
      '<td>$'+VAL_EPS[i].toFixed(2)+'</td>'+
      '<td>$'+(VAL_FCF[i]/1000).toFixed(1)+'B</td>'+
      '<td>'+pe+'</td><td>'+eve+'</td></tr>';
  }
  tb.innerHTML = rows;
}

// Forward multiple compression: hold the live price/EV constant, step across each BBG year.
function buildValFwdChart(q){
  if(!q || q.price==null){ freshChart('cValFwd',{type:'line',data:{labels:[],datasets:[]}}); return; }
  var ev=valEV(q);
  var pe  = VAL_EPS.map(function(e){ return +(q.price/e).toFixed(1); });
  var eve = VAL_EBITDA.map(function(x){ return +(ev/(x*1e6)).toFixed(1); });
  freshChart('cValFwd',{type:'line',data:{labels:VAL_FY,datasets:[
    {label:'P/E',data:pe,borderColor:'#2E75B6',backgroundColor:'#2E75B6',borderWidth:2.5,tension:0.3,pointRadius:4,pointHoverRadius:6},
    {label:'EV/EBITDA',data:eve,borderColor:'#7030A0',backgroundColor:'#7030A0',borderWidth:2.5,tension:0.3,pointRadius:4,pointHoverRadius:6}]},
    options:Object.assign({},baseOpts,{scales:{x:baseOpts.scales.x,y:Object.assign({},baseOpts.scales.y,{beginAtZero:true,ticks:Object.assign({},baseOpts.scales.y.ticks,{callback:function(v){return v+'×';}})})},
      plugins:Object.assign({},baseOpts.plugins,{tooltip:Object.assign({},baseOpts.plugins.tooltip,{callbacks:{label:function(c){return c.dataset.label+': '+c.raw+'×';}}})})})});
}

function applyValLive(pane, q){
  var ev = valEV(q), mc = valMC(q);
  var lv = pane.querySelector('#avgoValLive');
  if(lv){
    var up=(q.changePct||0)>=0;
    lv.hidden=false;
    lv.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">AVGO</span> '+
      '<span class="ov-live-px">$'+q.price.toFixed(2)+'</span> '+
      '<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'+':'')+(q.changePct!=null?q.changePct.toFixed(2):'0.00')+'%</span> '+
      '<span class="ov-live-mc">Mkt cap '+valUsd(mc)+' · EV '+valUsd(ev)+'</span>'+
      '<span class="ov-live-ts">live · Massive</span>';
  }
  valSetTxt(pane,'val-pe25', (q.price/VAL_EPS[0]).toFixed(1)+'×');
  valSetTxt(pane,'val-pe26', (q.price/VAL_EPS[1]).toFixed(1)+'×');
  valSetTxt(pane,'val-eve25',(ev/(VAL_EBITDA[0]*1e6)).toFixed(1)+'×');
  valSetTxt(pane,'val-eve26',(ev/(VAL_EBITDA[1]*1e6)).toFixed(1)+'×');
  valSetTxt(pane,'val-fcf26',(100*VAL_FCF[1]*1e6/mc).toFixed(1)+'%');
  renderValTable(pane, q);
  buildValFwdChart(q);
}

function initValuation(pane){
  // Render the fundamentals-only view first (works without a session), then overlay the live quote.
  renderValTable(pane, null);
  buildValFwdChart(null);
  if(pane._valLoaded){ if(_valQuote) applyValLive(pane, _valQuote); return; }
  pane._valLoaded = true;
  liveQuote('AVGO').then(function(res){
    var q = res && res.data;
    if(!q || q.price==null) return;   // leave the fundamentals-only view in place
    _valQuote = q;
    applyValLive(pane, q);
  }).catch(function(){});
}

// ── Industry Analysis (shared semiconductor supply-chain map, pre-drilled to AVGO) ──
function industryBody(){
  return '<div class="ov-sec-h" style="margin-bottom:10px">Semiconductor Supply-Chain Map</div>'+
    // focus:true → the Flow view opens pre-drilled to Broadcom's place in the chain.
    semiIndustry.html({ highlight: 'AVGO', focus: true });
}
function initIndustry(pane){ semiIndustry.init(); }

// ════════════════════════════════════════════════════════════════════════════════
// 0 — OVERVIEW  (box-based landing, mirrors the NVIDIA overview pattern)
// Snapshot banner · valuation multiples · description · business quadrants ·
// collapsible boxes (Products · How it makes money · Margins · Competitors).
// Shared overview.css classes (.ovlr-*, .ov-*). IDs prefixed avgoOv* to stay unique.
// ════════════════════════════════════════════════════════════════════════════════
var OV_SNAPSHOT = [
  ['Model', 'Chips + infrastructure software'],
  ['HQ', 'Palo Alto, CA'],
  ['Founded', '1991 · IPO 2009 (Avago)'],
  ['Fiscal year', 'Ends early November'],
  ['Last reported quarter', 'Q2 FY2026 · Jun 3, 2026'],
  ['CEO', 'Hock Tan (since 2006)'],
];
var OV_DESC = 'Broadcom is a global technology leader that designs, develops and supplies a broad range of <b>semiconductor</b> and <b>infrastructure-software</b> products. It runs two engines. The first is a semiconductor business at the center of the AI build-out: custom AI accelerators (<b>XPUs</b>) co-designed with hyperscalers, the networking silicon (Tomahawk switching, Jericho routing, SerDes and optical) that wires AI clusters, plus wireless (the Apple RF franchise), broadband, server-storage and industrial chips. The second is a high-margin infrastructure-software business — <b>VMware</b>, mainframe (CA) and security (Symantec) — assembled through a two-decade, private-equity-style acquisition machine under CEO Hock Tan and run for durable, sticky cash flow. Broadcom is <b>fabless</b> (TSMC manufactures) and sits inside a deep supplier web mapped in the Industry Analysis tab.';

// Valuation multiples — Bloomberg consensus (avgo-context/AVGO_BBG.xlsx). Trailing = FY25A,
// forward = FY26E. P/E & EV/EBITDA use the live price/EV; growth & PEG from consensus.
var OV_MULT = {
  trailing: { eps:6.82,  epsGr:36, ebitda:43004, ebGr:41 },   // FY2025A
  forward:  { eps:11.59, epsGr:70, ebitda:71964, ebGr:67 },   // FY2026E (BBG)
};
var _ovMultMode = 'trailing', _ovMultPrice = null, _ovMultEv = null;
function ovFmtBig(v){ if(v==null) return '—'; if(v>=1e12) return '$'+(v/1e12).toFixed(2)+'T'; if(v>=1e9) return '$'+(v/1e9).toFixed(0)+'B'; return '$'+(v/1e6).toFixed(0)+'M'; }
function ovHeroMultiples(){
  var tiles=[['P/E','avgoOvPE'],['Earnings growth','avgoOvEG'],['PEG','avgoOvPEG'],['EV / EBITDA','avgoOvEV'],['EBITDA growth','avgoOvEBG'],['PEG (EBITDA)','avgoOvPEGE']];
  return '<div class="ovlr-mult">'+
    '<div class="ovlr-mult-top">'+
      '<div class="ovlr-mult-live"><span class="ov-live-dot"></span><span class="ov-live-tk">AVGO</span>'+
        '<span class="ov-live-kv">Mkt cap <b id="avgoOvMc">—</b></span>'+
        '<span class="ov-live-kv">EV <b id="avgoOvEv">—</b></span></div>'+
      '<div class="ovlr-seg" id="avgoOvMultToggle">'+
        '<button type="button" class="ovlr-seg-b active" data-mult="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-mult="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ovlr-mult-grid">'+tiles.map(function(t){
      return '<div class="ovlr-mult-tile"><div class="ovlr-mult-l">'+esc(t[0])+'</div>'+
        '<div class="ovlr-mult-v" id="'+t[1]+'"><span class="ovlr-mut">—</span></div></div>';
    }).join('')+'</div>'+
    '<div class="ovlr-mult-note" id="avgoOvMultNote"></div>'+
  '</div>';
}
function ovMultFill(pane){
  var m = OV_MULT[_ovMultMode], p=_ovMultPrice, ev=_ovMultEv;
  function set(id,txt){ var e=pane.querySelector('#'+id); if(e) e.textContent=txt; }
  set('avgoOvEG','+'+m.epsGr+'%'); set('avgoOvEBG','+'+m.ebGr+'%');
  if(p!=null){ var pe=p/m.eps; set('avgoOvPE',pe.toFixed(1)+'×'); set('avgoOvPEG',(pe/m.epsGr).toFixed(2)); }
  else { set('avgoOvPE','—'); set('avgoOvPEG','—'); }
  if(ev!=null){ var eve=ev/(m.ebitda*1e6); set('avgoOvEV',eve.toFixed(1)+'×'); set('avgoOvPEGE',(eve/m.ebGr).toFixed(2)); }
  else { set('avgoOvEV','—'); set('avgoOvPEGE','—'); }
  var note=pane.querySelector('#avgoOvMultNote');
  if(note) note.innerHTML=(_ovMultMode==='trailing'?'<b>Trailing</b> — FY2025A (Bloomberg).':'<b>Forward</b> — FY2026E (Bloomberg consensus).')+
    ' P/E &amp; EV/EBITDA use the live price &amp; EV; growth &amp; PEG from consensus. PEG = multiple ÷ growth-%.';
}
function ovDescBox(){
  return '<div class="ovlr-desc" data-desc><p class="ovlr-desc-txt">'+OV_DESC+'</p>'+
    '<button type="button" class="ovlr-desc-more" id="avgoOvDescMore">Read more ▾</button></div>';
}
var OV_BIZ = [
  ['What it sells', 'Custom AI accelerators (<b>XPUs</b>), <b>networking</b> silicon (Tomahawk / Jericho / optical), wireless &amp; broadband chips — plus <b>infrastructure software</b> (VMware).'],
  ['Who buys it',   'Hyperscalers (<b>Google, Meta, OpenAI, Anthropic</b>), <b>Apple</b> (wireless), and 300k+ enterprise software customers.'],
  ['How it earns',  '~58% <b>semiconductors</b> (AI is the growth engine) + ~42% <b>infrastructure software</b> at ~90% gross margin.'],
  ['The edge',      'Two engines: volatile <b>AI growth</b> + a software <b>“keel”</b> that funds the dividend, services debt &amp; funds the next acquisition.'],
];
function ovHeroBusiness(){
  return '<div class="ovlr-biz">'+OV_BIZ.map(function(b){
    return '<div class="ovlr-biz-cell"><div class="ovlr-biz-k">'+esc(b[0])+'</div><div class="ovlr-biz-v">'+b[1]+'</div></div>';
  }).join('')+'</div>';
}
// Products — images downloaded from broadcom.com (img/products/avgo-*). onerror hides a
// missing image; tap a card to enlarge (lightbox modal), same pattern as the NVIDIA overview.
var OV_PRODUCTS = [
  { img:'avgo-ai.jpg', tag:'Custom AI accelerator', name:'XPU (custom silicon)',
    d:'Hyperscaler-designed AI accelerators — Google TPU, Meta MTIA, OpenAI — co-designed with Broadcom.',
    detail:'Broadcom co-designs the custom AI accelerators (XPUs) that hyperscalers deploy at scale — Google\'s TPU, Meta\'s MTIA, OpenAI\'s accelerator. The customer brings the architecture; Broadcom contributes the physical design, hard IP (SerDes), advanced 3.5D packaging and foundry orchestration. It is the deepest, highest-content relationship — and the engine of the AI revenue ramp.' },
  { img:'avgo-tomahawk.png', tag:'AI networking switch', name:'Tomahawk 6',
    d:'The first 102.4 Tbps Ethernet switch — the fabric that wires AI clusters.',
    detail:'Tomahawk 6 is the industry\'s first 102.4 Tbps Ethernet switch, with a co-packaged-optics variant (Davisson). It is the scale-up / scale-out fabric that connects thousands of accelerators into one cluster — and it attaches to any cluster, Broadcom-XPU or Nvidia-GPU alike, which is why networking scales with the entire AI build-out.' },
  { img:'avgo-jericho.jpg', tag:'Scale-across router', name:'Jericho',
    d:'The deep-buffer Ethernet fabric that extends AI clusters across data centers.',
    detail:'Jericho (StrataDNX) is Broadcom\'s deep-buffer routing silicon — Jericho4 extends AI-scale Ethernet fabrics beyond a single data center with congestion-free RoCE. Broadcom holds ~90% deep-buffer switching share; decades-compounded IP that predates AI and now rides it.' },
  { img:'avgo-optical.jpg', tag:'Optical interconnect', name:'Optical · SerDes · CPO',
    d:'The DSPs, lasers and SerDes that move data between accelerators.',
    detail:'The interconnect layer — optical DSPs, lasers, photodiodes and the SerDes IP that move bits between chips and racks at the lowest power. As clusters scale and copper runs out, co-packaged optics (CPO) pulls the optics onto the switch package. The longest-compounded IP in Broadcom\'s portfolio.' },
  { img:'avgo-wireless.jpg', tag:'Wireless (Apple)', name:'FBAR / RF front-end',
    d:'RF filters and wireless connectivity — the Apple franchise, locked through 2031.',
    detail:'FBAR (film bulk acoustic resonator) filters and RF front-end modules that let a phone focus airwave signals and reduce interference. This is the Apple franchise — Broadcom\'s largest single customer relationship, US-made under the 2023 agreement and extended through 2031: a mature, high-margin baseline under the AI growth.' },
];
function ovProductsBody(){
  return '<p class="ovlr-money-p">Broadcom does not sell one thing — it sells the <b>picks-and-shovels of the AI build-out</b> plus a high-margin software keel: the custom <b>XPU</b> silicon it co-designs, the <b>networking</b> &amp; <b>optical</b> that fuse clusters, and the <b>Apple wireless</b> franchise — alongside <b>VMware</b> in the software engine.</p>'+
    '<div class="ovlr-prod-hint2">Tap a product to enlarge.</div>'+
    '<div class="ovlr-prod-row">'+OV_PRODUCTS.map(function(p,i){
      return '<figure class="ovlr-prod-card ovlr-clickable" data-prod="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.name)+' — enlarge">'+
        '<div class="ovlr-prod-imgwrap"><img class="ovlr-prod-img" src="img/products/'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.display=\'none\'"><span class="ovlr-prod-zoom">⤢</span></div>'+
        '<figcaption class="ovlr-prod-body"><div class="ovlr-prod-tag">'+esc(p.tag)+'</div>'+
          '<div class="ovlr-prod-name">'+esc(p.name)+'</div><div class="ovlr-prod-d">'+p.d+'</div></figcaption>'+
      '</figure>';
    }).join('')+'</div>'+
    '<div class="ovlr-prod-note">Product imagery © Broadcom, shown for illustration.</div>'+
    '<div class="ovlr-modal" id="avgoOvProdModal" hidden><div class="ovlr-modal-box" role="dialog" aria-modal="true">'+
      '<button type="button" class="ovlr-modal-x" id="avgoOvProdX" aria-label="Close">×</button>'+
      '<img class="ovlr-modal-img" id="avgoOvProdImg" src="" alt="">'+
      '<div class="ovlr-modal-body"><div class="ovlr-modal-tag" id="avgoOvProdTag"></div>'+
        '<div class="ovlr-modal-name" id="avgoOvProdName"></div><div class="ovlr-modal-d" id="avgoOvProdDesc"></div></div>'+
    '</div></div>';
}
// How it makes money — segment doughnut (two engines) + an AI-vs-non-AI driver cut.
var OV_MONEY_SEG = { title:'FY2025 revenue by segment <span>($B · reported)</span>',
  labels:['Semiconductor solutions','Infrastructure software'], data:[36.9,27.0],
  colors:['#CC092F','#007A8C'], unit:'B',
  note:'FY2025 reported (10-K): Semiconductors $36.9B (58%) · Infrastructure software $27.0B (42%). The software engine arrived via CA, Symantec and VMware.' };
var OV_MONEY_ALT = { title:'FY2025 revenue by driver <span>($B · approx)</span>',
  labels:['AI semiconductors','Non-AI semiconductors','Infrastructure software'], data:[20.0,16.9,27.0],
  colors:['#7A5AF8','#CC092F','#007A8C'], unit:'B',
  note:'⚠️ Approximate. AI ≈ $20B of the $36.9B semi segment (custom XPUs + AI networking); the rest is wireless, broadband, server-storage &amp; industrial. Software $27.0B reported.' };
var OV_MONEY_SEG_CARDS = [
  { name:'Semiconductor solutions', dot:'#CC092F', rev:'$36.9B', yoy:'58% of revenue',
    desc:'Custom AI accelerators (<b>XPUs</b>) and <b>AI networking</b> — the growth engine — plus wireless (the Apple franchise), broadband, server-storage and industrial. AI is guided to ~$56B in FY26 and &gt;$100B in FY27.',
    prod:'XPU · Tomahawk 6 · Jericho4 · optical · FBAR' },
  { name:'Infrastructure software', dot:'#007A8C', rev:'$27.0B', yoy:'42% of revenue',
    desc:'<b>VMware</b> (VCF), mainframe (CA) and security (Symantec) — sticky, ~90% gross margin, converted perpetual→subscription. The keel that funds the dividend, services debt and funds the next deal.',
    prod:'VMware Cloud Foundation' },
];
var OV_MONEY_ALT_DETAIL = '<p class="ovlr-mseg-note"><b>AI ≈ $20B</b> of the semi segment is the driver — guided to ~$56B in FY26 and &gt;$100B in FY27. <b>Non-AI semi</b> (wireless, broadband, server-storage, industrial) is mature / cyclical. <b>Software</b> is the stable ~$27B keel. Approximate split — see the Segments &amp; AI Revenue tabs in the Deep Dive.</p>';
var _ovMoneyMode = 'segment', _ovMoneyChart = null;
function ovMoneySegCards(){
  return '<div class="ovlr-mseg">'+OV_MONEY_SEG_CARDS.map(function(s){
    return '<div class="ovlr-mseg-card">'+
      '<div class="ovlr-mseg-h"><span class="ovlr-mseg-dot" style="background:'+s.dot+'"></span>'+
        '<span class="ovlr-mseg-nm">'+esc(s.name)+'</span>'+
        '<span class="ovlr-mseg-rev">'+esc(s.rev)+' <em>'+esc(s.yoy)+'</em></span></div>'+
      '<div class="ovlr-mseg-d">'+s.desc+'</div>'+
      '<div class="ovlr-mseg-prod">↳ '+esc(s.prod)+'</div>'+
    '</div>';
  }).join('')+'</div>';
}
function ovMoneyBody(){
  return '<p class="ovlr-money-p">Broadcom runs on <b>two engines</b>: ~58% <b>semiconductors</b> (where AI custom silicon + networking is the growth story) and ~42% <b>infrastructure software</b> (VMware &amp; co — the high-margin keel). Toggle to see the <b>AI-vs-non-AI</b> cut of the chip business.</p>'+
    '<div class="ovlr-seg" id="avgoOvMoneyToggle">'+
      '<button type="button" class="ovlr-seg-b active" data-money="segment">By segment</button>'+
      '<button type="button" class="ovlr-seg-b" data-money="driver">By driver</button>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t" id="avgoOvMoneyTitle">'+OV_MONEY_SEG.title+'</div>'+
    '<div class="ov-chart-wrap"><canvas id="avgoOvMoneyChart"></canvas></div></div>'+
    '<div class="ovlr-money-note" id="avgoOvMoneyNote">'+OV_MONEY_SEG.note+'</div>'+
    '<div id="avgoOvMoneyDetail">'+ovMoneySegCards()+'</div>';
}
function ovBuildMoneyChart(){
  var cv = document.getElementById('avgoOvMoneyChart');
  if(!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if(_ovMoneyChart){ _ovMoneyChart.destroy(); _ovMoneyChart = null; }
  var d = _ovMoneyMode === 'driver' ? OV_MONEY_ALT : OV_MONEY_SEG;
  _ovMoneyChart = new Chart(cv.getContext('2d'), {
    type:'doughnut',
    data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:d.colors, borderWidth:2, borderColor:'#fff' }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'58%',
      plugins:{ legend:{ position:'right', labels:{ boxWidth:12, font:{size:12}, color:'#5b6470', padding:10 } },
        tooltip:{ callbacks:{ label:function(ctx){ var t=ctx.dataset.data.reduce(function(a,b){return a+b;},0);
          var v=ctx.parsed; return ' '+ctx.label+': $'+v.toFixed(1)+'B ('+(v/t*100).toFixed(0)+'%)'; } } } } }
  });
}
// Margins — % of revenue, fiscal years (AVGO FY ends early Nov). Fallback history until
// the live Massive get-margins feed returns (needs localhost:8000 / production CORS).
var OV_MARGIN_METRICS = [
  { key:'gross',  label:'Gross',     color:'#CC092F' },
  { key:'oper',   label:'Operating', color:'#2F80ED' },
  { key:'net',    label:'Net',       color:'#7A5AF8' },
  { key:'ebitda', label:'EBITDA',    color:'#12B5A5' },
  { key:'cfo',    label:'CFO',       color:'#F2A73B' },
  { key:'fcf',    label:'FCF',       color:'#EB5757' },
];
var OV_MARGIN_PROJ = { fy:'FY26E', gross:68.0, oper:45.0, net:40.0, ebitda:68.0, cfo:50.0, fcf:48.0, proj:true };
var OV_MARGIN_FALLBACK = [
  { fy:'FY21', gross:61.4, oper:31.6, net:24.5, ebitda:56.9, cfo:49.4, fcf:47.9 },
  { fy:'FY22', gross:66.6, oper:42.4, net:34.6, ebitda:63.5, cfo:50.8, fcf:49.0 },
  { fy:'FY23', gross:68.9, oper:45.2, net:39.3, ebitda:65.0, cfo:47.9, fcf:46.4 },
  { fy:'FY24', gross:62.8, oper:26.3, net:23.4, ebitda:61.9, cfo:41.2, fcf:39.3 },
  { fy:'FY25', gross:66.5, oper:39.9, net:34.0, ebitda:67.3, cfo:45.5, fcf:42.1 },
];
var OV_MRG_NOTE_FALLBACK = 'Gross / operating / net = <b>GAAP</b>; EBITDA = <b>Adjusted EBITDA</b>; CFO &amp; FCF ÷ revenue. FY24 GAAP op / net dipped on <b>VMware</b> acquisition-amortization. <b>FY26E</b> = Bloomberg consensus. <span style="color:#B7791F">Directional fallback — live Massive feed loads on localhost:8000 / production.</span>';
var OV_MRG_NOTE_MASSIVE  = 'Historical margins computed <b>live from Massive</b> (income &amp; cash-flow statements): gross/op/net = line ÷ revenue; EBITDA = (op income + D&amp;A) ÷ revenue; CFO &amp; FCF ÷ revenue. <b>FY26E</b> = Bloomberg consensus — the only forward point.';
var _mrgSel = { gross:true, oper:true, net:true, ebitda:false, cfo:false, fcf:false };
var _mrgData = OV_MARGIN_FALLBACK.concat([OV_MARGIN_PROJ]);
var _mrgStart = 0, _mrgEnd = 0, _mrgChart = null, _mrgSource = 'fallback';
function mrgDefaultWindow(){
  var n = _mrgData.length;
  var lastActual = (n && _mrgData[n-1].proj) ? n-2 : n-1;
  return [ Math.max(0, lastActual - 4), n-1 ];
}
function ovMarginsBody(){
  var chips = OV_MARGIN_METRICS.map(function(m){
    return '<button type="button" class="ovlr-mg-chip'+(_mrgSel[m.key]?' on':'')+'" data-mg="'+m.key+'" style="--mg:'+m.color+'">'+
      '<span class="ovlr-mg-dot"></span>'+esc(m.label)+'</button>';
  }).join('');
  return '<p class="ovlr-money-p">Profitability &amp; cash margins as a % of revenue. Tap any line to toggle it; drag the <b>range slider</b> to widen or shift the years — the last point (<b>FY26E</b>) is Bloomberg consensus.</p>'+
    '<div class="ovlr-mg-chips" id="avgoOvMgChips">'+chips+'</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of revenue) <span>· fiscal years · FY26E = consensus</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="avgoOvMgChart"></canvas></div></div>'+
    '<div class="ovlr-mg-slider" id="avgoOvMgSlider"></div>'+
    '<div class="ovlr-money-note" id="avgoOvMgNote">'+OV_MRG_NOTE_FALLBACK+'</div>';
}
function ovRenderMrgSlider(){
  var el = document.getElementById('avgoOvMgSlider'); if(!el) return;
  var n = _mrgData.length; if(n < 2){ el.innerHTML=''; return; }
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
function ovWireMrgSlider(pane){
  var slider = pane.querySelector('#avgoOvMgSlider'); if(!slider || slider._w) return; slider._w = 1;
  var drag = null;
  function idxFromX(clientX){
    var rail = slider.querySelector('.ovlr-mg-rail'); if(!rail) return _mrgStart;
    var rect = rail.getBoundingClientRect();
    var f = (clientX - rect.left) / Math.max(1, rect.width);
    return Math.round(Math.max(0, Math.min(1, f)) * (_mrgData.length - 1));
  }
  slider.addEventListener('pointerdown', function(e){
    var h = e.target.closest('.ovlr-mg-handle');
    if(h){ drag = { which:h.getAttribute('data-h') }; }
    else if(e.target.closest('.ovlr-mg-fill')){ drag = { which:'pan', anchor:idxFromX(e.clientX), s0:_mrgStart, e0:_mrgEnd }; }
    else { var i = idxFromX(e.clientX);
      if(Math.abs(i-_mrgStart) <= Math.abs(i-_mrgEnd)) _mrgStart = Math.min(i, _mrgEnd-1);
      else _mrgEnd = Math.max(i, _mrgStart+1);
      ovRenderMrgSlider(); ovBuildMarginChart(); return;
    }
    try { slider.setPointerCapture(e.pointerId); } catch(_){}
    e.preventDefault();
  });
  slider.addEventListener('pointermove', function(e){
    if(!drag) return;
    var i = idxFromX(e.clientX), n = _mrgData.length;
    if(drag.which === 'start') _mrgStart = Math.max(0, Math.min(i, _mrgEnd-1));
    else if(drag.which === 'end') _mrgEnd = Math.min(n-1, Math.max(i, _mrgStart+1));
    else if(drag.which === 'pan'){ var w = drag.e0-drag.s0, ns = Math.max(0, Math.min(drag.s0 + (i-drag.anchor), n-1-w)); _mrgStart = ns; _mrgEnd = ns+w; }
    ovRenderMrgSlider(); ovBuildMarginChart();
  });
  function endDrag(e){ if(drag){ try { slider.releasePointerCapture(e.pointerId); } catch(_){} drag = null; } }
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
}
function ovLoadMassiveMargins(){
  Promise.resolve(fetchMargins ? fetchMargins('AVGO') : null).then(function(res){
    if(!res || !res.success || !res.data || res.data.length < 3) return;   // keep fallback
    _mrgData = res.data.concat([OV_MARGIN_PROJ]);
    _mrgSource = 'massive';
    var w = mrgDefaultWindow(); _mrgStart = w[0]; _mrgEnd = w[1];
    var note = document.getElementById('avgoOvMgNote'); if(note) note.innerHTML = OV_MRG_NOTE_MASSIVE;
    ovRenderMrgSlider(); ovBuildMarginChart();
  }).catch(function(){ /* keep fallback */ });
}
function ovBuildMarginChart(){
  var cv = document.getElementById('avgoOvMgChart');
  if(!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if(_mrgChart){ _mrgChart.destroy(); _mrgChart = null; }
  var rows = _mrgData.slice(_mrgStart, _mrgEnd + 1);
  var projIdx = rows.reduce(function(acc,r,i){ return r.proj ? i : acc; }, -1);
  var labels = rows.map(function(r){ return r.fy; });
  var datasets = OV_MARGIN_METRICS.filter(function(m){ return _mrgSel[m.key]; }).map(function(m){
    return { label:m.label, data:rows.map(function(r){ return r[m.key]; }),
      borderColor:m.color, backgroundColor:m.color, borderWidth:2.5, tension:0.3, pointHoverRadius:5, spanGaps:true,
      pointStyle:rows.map(function(r){ return r.proj ? 'rectRot' : 'circle'; }),
      pointRadius:rows.map(function(r){ return r.proj ? 5 : 3; }),
      segment:{ borderDash:function(ctx){ return ctx.p1DataIndex === projIdx ? [5,4] : undefined; } } };
  });
  _mrgChart = new Chart(cv.getContext('2d'), {
    type:'line', data:{ labels:labels, datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ var l=items[0].label; return l==='FY26E' ? 'FY26E · consensus' : l; },
          label:function(ctx){ return ' '+ctx.dataset.label+': '+ctx.parsed.y.toFixed(1)+'%'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{weight:'600'} } },
        y:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } }
  });
}
// Competitors — bubble (multiple × growth, size = market cap). Seed values; mcap fills live.
var OV_COMP = [
  { ticker:'AVGO', name:'Broadcom',  pe:38, peF:30, ev:28, evF:24, eg:25, egF:22, ebg:30, ebgF:26, mcap:1500, self:true },
  { ticker:'NVDA', name:'NVIDIA',    pe:38, peF:19, ev:30, evF:16, eg:59, egF:96, ebg:60, ebgF:92, mcap:4100 },
  { ticker:'AMD',  name:'AMD',       pe:45, peF:28, ev:33, evF:22, eg:35, egF:60, ebg:38, ebgF:55, mcap:260 },
  { ticker:'MRVL', name:'Marvell',   pe:35, peF:24, ev:28, evF:20, eg:30, egF:40, ebg:32, ebgF:38, mcap:90 },
  { ticker:'QCOM', name:'Qualcomm',  pe:16, peF:14, ev:12, evF:11, eg:12, egF:10, ebg:11, ebgF:9,  mcap:190 },
];
var _ovCompMult = 'pe', _ovCompTime = 'trailing', _ovCompChart = null;
function ovCompetitorsBody(){
  return '<p class="ovlr-money-p">Broadcom\'s public peers. <b>X</b> = valuation multiple, <b>Y</b> = growth, <b>bubble size</b> = market cap. Add or remove any public company.</p>'+
    '<div class="ovlr-comp-ctl">'+
      '<div class="ovlr-seg" id="avgoOvCompMult">'+
        '<button type="button" class="ovlr-seg-b active" data-cmult="pe">P/E · earnings</button>'+
        '<button type="button" class="ovlr-seg-b" data-cmult="ev">EV/EBITDA</button>'+
      '</div>'+
      '<div class="ovlr-seg" id="avgoOvCompTime">'+
        '<button type="button" class="ovlr-seg-b active" data-ctime="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-ctime="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Peers — multiple × growth × size <span>(bubble = market cap)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="avgoOvCompChart"></canvas></div></div>'+
    '<div class="ovlr-comp-add"><input type="text" id="avgoOvCompInput" placeholder="Add ticker (e.g. TXN)" maxlength="6" autocomplete="off">'+
      '<button type="button" id="avgoOvCompAdd">+ Add</button></div>'+
    '<div class="ovlr-comp-chips" id="avgoOvCompChips"></div>'+
    '<div class="ovlr-money-note">Market cap is <b>live</b> (Massive) per ticker. Multiples &amp; growth are editable seed values until a live ratios-field mapping is confirmed.</div>';
}
var ovCompLabels = { id:'ovCompLabels', afterDatasetsDraw:function(chart){
  var ctx = chart.ctx, ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
  ctx.save(); ctx.font = '700 11px Inter, sans-serif'; ctx.textAlign = 'center';
  meta.data.forEach(function(el, i){ var p = ds.data[i]; if(!p) return;
    ctx.fillStyle = p.self ? '#8f0620' : '#1E2733';
    ctx.fillText(p.t, el.x, el.y - (p.r || 6) - 5);
  });
  ctx.restore();
} };
function ovBuildCompChart(){
  var cv = document.getElementById('avgoOvCompChart');
  if(!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if(_ovCompChart){ _ovCompChart.destroy(); _ovCompChart = null; }
  var fwd = _ovCompTime === 'forward', isPe = _ovCompMult === 'pe';
  var pts = OV_COMP.map(function(c){
    var mult = isPe ? (fwd?c.peF:c.pe) : (fwd?c.evF:c.ev);
    var gr   = isPe ? (fwd?c.egF:c.eg) : (fwd?c.ebgF:c.ebg);
    if(mult == null || gr == null) return null;
    return { x:mult, y:gr, r:Math.max(6, Math.sqrt(c.mcap||1)/2.4), t:c.ticker, mcap:c.mcap, self:c.self };
  }).filter(Boolean);
  _ovCompChart = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{ data:pts,
      backgroundColor:pts.map(function(p){ return p.self ? 'rgba(204,9,47,0.5)' : 'rgba(45,106,159,0.45)'; }),
      borderColor:pts.map(function(p){ return p.self ? '#CC092F' : '#2D6A9F'; }), borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:16, right:12, left:4 } },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var p=ctx.raw;
          return p.t+': '+(isPe?'P/E ':'EV/EBITDA ')+p.x+'× · growth '+p.y+'% · mcap $'+(p.mcap>=1000?(p.mcap/1000).toFixed(1)+'T':p.mcap+'B'); } } } },
      scales:{ x:{ reverse:true, title:{ display:true, text:(isPe?'P/E':'EV/EBITDA')+' (×)'+(fwd?' · forward':' · trailing')+' · cheaper →', color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'×'; } } },
        y:{ title:{ display:true, text:(isPe?'Earnings':'EBITDA')+' growth (%)'+(fwd?' · forward':' · trailing'), color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } },
    plugins:[ovCompLabels]
  });
}
function ovRenderCompChips(){
  var box = document.getElementById('avgoOvCompChips'); if(!box) return;
  box.innerHTML = OV_COMP.map(function(c,i){
    return '<span class="ovlr-comp-chip'+(c.self?' self':'')+'">'+esc(c.ticker)+
      (c.mcap!=null?' · $'+(c.mcap>=1000?(c.mcap/1000).toFixed(1)+'T':c.mcap+'B'):'')+
      (c.self?'':'<button type="button" class="ovlr-comp-x" data-rm="'+i+'" aria-label="remove">×</button>')+'</span>';
  }).join('');
}
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
var OV_SOURCES = 'Sources: Broadcom Inc. (Nasdaq: AVGO) FY2025 Form 10-K, Q1–Q2 FY2026 earnings calls & press releases, and the April 2026 8-K. Valuation multiples use Bloomberg consensus (source BST, avgo-context/AVGO_BBG.xlsx) with live price/EV from Massive. Margin history upgrades to a live Massive feed when available (localhost:8000 / production). Competitor multiples are editable seed values; market caps fill live.';
function overviewBody(){
  var h = '';
  h += '<div class="ov-snap ovlr-snap6">'+OV_SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('')+'</div>';
  h += ovHeroMultiples();
  h += ovDescBox();
  h += ovHeroBusiness();
  h += ovBox('products', 'What they offer', 'products & platforms', ovProductsBody(), false);
  h += ovBox('money', 'How it makes money', 'segments & drivers', ovMoneyBody(), false);
  h += ovBox('margins', 'Margins', 'interactive · profitability & cash', ovMarginsBody(), false);
  h += ovBox('competitors', 'Competitors', 'multiple × growth × size', ovCompetitorsBody(), false);
  h += '<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}
function initOverview(){
  var pane = document.querySelector('.ov-avgo .ovt-pane[data-ovt="overview"]'); if(!pane) return;
  // multiples toggle + live price/EV
  pane.querySelectorAll('#avgoOvMultToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _ovMultMode = b.getAttribute('data-mult');
      pane.querySelectorAll('#avgoOvMultToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      ovMultFill(pane);
    };
  });
  ovMultFill(pane);
  liveQuote('AVGO').then(function(res){
    var q = res && res.data; if(!q || q.price == null) return;
    _ovMultPrice = q.price; _ovMultEv = valEV(q);
    var mc = pane.querySelector('#avgoOvMc'); if(mc) mc.textContent = ovFmtBig(valMC(q));
    var evEl = pane.querySelector('#avgoOvEv'); if(evEl) evEl.textContent = ovFmtBig(_ovMultEv);
    ovMultFill(pane);
  }).catch(function(){});
  // description expand/collapse
  var dMore = pane.querySelector('#avgoOvDescMore');
  if(dMore) dMore.onclick = function(){
    var box = pane.querySelector('.ovlr-desc'); var open = box.classList.toggle('open');
    dMore.textContent = open ? 'Read less ▴' : 'Read more ▾';
  };
  // products lightbox
  var modal = pane.querySelector('#avgoOvProdModal');
  if(modal){
    var mImg = modal.querySelector('#avgoOvProdImg'), mTag = modal.querySelector('#avgoOvProdTag'),
        mName = modal.querySelector('#avgoOvProdName'), mDesc = modal.querySelector('#avgoOvProdDesc');
    var closeProd = function(){ modal.hidden = true; };
    var openProd = function(card){ var p = OV_PRODUCTS[parseInt(card.getAttribute('data-prod'),10)]; if(!p) return;
      mImg.src = 'img/products/'+p.img; mImg.alt = p.name; mTag.textContent = p.tag; mName.textContent = p.name;
      mDesc.innerHTML = p.detail || p.d; modal.hidden = false; };
    pane.querySelectorAll('.ovlr-prod-card').forEach(function(card){
      card.onclick = function(){ openProd(card); };
      card.onkeydown = function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openProd(card); } };
    });
    modal.onclick = function(e){ if(e.target === modal) closeProd(); };
    var xb = modal.querySelector('#avgoOvProdX'); if(xb) xb.onclick = closeProd;
    if(!modal._esc){ modal._esc = 1; document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !modal.hidden) closeProd(); }); }
  }
  // collapsible boxes → build the lazy chart when a box opens
  pane.querySelectorAll('.ovlr-box-h').forEach(function(hb){
    hb.onclick = function(){
      var box = hb.parentElement; var open = box.classList.toggle('open');
      if(open){ var id = box.getAttribute('data-box');
        if(id === 'money') requestAnimationFrame(ovBuildMoneyChart);
        if(id === 'margins') requestAnimationFrame(ovBuildMarginChart);
        if(id === 'competitors') requestAnimationFrame(ovBuildCompChart);
      }
    };
  });
  // money segment/driver toggle
  pane.querySelectorAll('#avgoOvMoneyToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _ovMoneyMode = b.getAttribute('data-money');
      pane.querySelectorAll('#avgoOvMoneyToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      var d = _ovMoneyMode === 'driver' ? OV_MONEY_ALT : OV_MONEY_SEG;
      var t = pane.querySelector('#avgoOvMoneyTitle'); if(t) t.innerHTML = d.title;
      var n = pane.querySelector('#avgoOvMoneyNote'); if(n) n.innerHTML = d.note;
      var det = pane.querySelector('#avgoOvMoneyDetail');
      if(det) det.innerHTML = _ovMoneyMode === 'driver' ? OV_MONEY_ALT_DETAIL : ovMoneySegCards();
      ovBuildMoneyChart();
    };
  });
  // margins: metric chips + range slider (margins box starts open)
  var mgChips = pane.querySelector('#avgoOvMgChips');
  if(mgChips) mgChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if(!b) return;
    var k = b.getAttribute('data-mg'); _mrgSel[k] = !_mrgSel[k]; b.classList.toggle('on', _mrgSel[k]); ovBuildMarginChart(); };
  var w = mrgDefaultWindow(); _mrgStart = w[0]; _mrgEnd = w[1];
  ovWireMrgSlider(pane); ovRenderMrgSlider();
  requestAnimationFrame(ovBuildMarginChart);
  ovLoadMassiveMargins();
  // competitors: toggles, add/remove, live market cap
  pane.querySelectorAll('#avgoOvCompMult .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _ovCompMult = b.getAttribute('data-cmult');
      pane.querySelectorAll('#avgoOvCompMult .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      ovBuildCompChart(); };
  });
  pane.querySelectorAll('#avgoOvCompTime .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _ovCompTime = b.getAttribute('data-ctime');
      pane.querySelectorAll('#avgoOvCompTime .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      ovBuildCompChart(); };
  });
  var liveMcap = function(tk){
    liveQuote(tk).then(function(res){
      var q = res && res.data; if(!q || q.marketCap == null) return;
      var row = OV_COMP.filter(function(c){ return c.ticker === tk; })[0];
      if(row){ row.mcap = Math.round(q.marketCap/1e9); ovRenderCompChips(); ovBuildCompChart(); }
    }).catch(function(){});
  };
  OV_COMP.forEach(function(c){ liveMcap(c.ticker); });
  var addInput = pane.querySelector('#avgoOvCompInput'), addBtn = pane.querySelector('#avgoOvCompAdd');
  var doAdd = function(){
    var tk = (addInput.value||'').trim().toUpperCase().replace(/[^A-Z.]/g,''); if(!tk) return;
    if(OV_COMP.some(function(c){ return c.ticker === tk; })){ addInput.value=''; return; }
    OV_COMP.push({ ticker:tk, name:tk, pe:null, peF:null, ev:null, evF:null, eg:null, egF:null, ebg:null, ebgF:null, mcap:null });
    addInput.value=''; ovRenderCompChips(); liveMcap(tk);
  };
  if(addBtn) addBtn.onclick = doAdd;
  if(addInput) addInput.onkeydown = function(e){ if(e.key === 'Enter'){ e.preventDefault(); doAdd(); } };
  var chips = pane.querySelector('#avgoOvCompChips');
  if(chips) chips.onclick = function(e){ var t = e.target.closest('.ovlr-comp-x'); if(!t) return;
    OV_COMP.splice(parseInt(t.getAttribute('data-rm'),10), 1); ovRenderCompChips(); ovBuildCompChart(); };
  ovRenderCompChips();
  requestAnimationFrame(ovBuildCompChart);
}

// ── Top-Line Model (bottom-up from the announced deals vs BBG consensus) ─────────
// Bloomberg consensus (avgo-context/AVGO_BBG.xlsx, source BST), $B:
var TL_FY        = ['FY25A','FY26E','FY27E','FY28E','FY29E'];
var TL_BBG_TOTAL = [63.887, 105.811, 173.276, 226.681, 312.679];
var TL_BBG_AI    = [20.138, 56.582, 119.296, 164.198, 246.074];
var TL_BBG_SOFT  = [27.029, 31.940, 37.204, 37.967, 41.814];
var TL_AI_FY25 = 20.138, TL_SOFT_FY25 = 27.029, TL_NONAI_FY25 = 16.720;  // non-AI semi = semi − AI

// Bottom-up build: AI = GW × content/GW (FY26 locked to the ~$56B guide, FY27 anchored at
// ~10 GW); non-AI semi compounds ~2%/yr; software compounds at the chosen rate.
function tlCompute(dpg, gw29, softG){
  var nonaiG = 2;
  var gw = [null, null, 10, 10 + (gw29 - 10) * 0.45, gw29];   // FY27 anchor = ~10 GW
  var ai = [TL_AI_FY25, 56.0, gw[2]*dpg, gw[3]*dpg, gw[4]*dpg];
  var soft = [TL_SOFT_FY25], nonai = [TL_NONAI_FY25];
  for(var i=1;i<5;i++){ soft.push(TL_SOFT_FY25*Math.pow(1+softG/100,i)); nonai.push(TL_NONAI_FY25*Math.pow(1+nonaiG/100,i)); }
  var total = ai.map(function(a,i){ return a+soft[i]+nonai[i]; });
  return { ai:ai, soft:soft, nonai:nonai, total:total, gw:gw };
}
function tlSlider(id,label,pre,suf,min,max,step,val){
  return '<div class="tl-sl"><label for="'+id+'">'+esc(label)+' <b id="'+id+'v">'+pre+val+suf+'</b></label>'+
    '<input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" data-pre="'+pre+'" data-suf="'+suf+'"></div>';
}
function toplineBody(){
  return ''+
  card('Modeling the top line from the announced deals','bottom-up build (GW commitments + software keel) vs Bloomberg consensus · FY25A→FY29E',
    '<div class="card-body"><div class="prose" style="margin-bottom:2px"><p>Two ways to a revenue number. <strong>Top-down</strong>: take Bloomberg consensus. <strong>Bottom-up</strong>: build it from what Broadcom has actually <em>announced</em> — the GW commitments (× content per GW) for AI, plus the mature non-AI chips and the software keel. This lays the bottom-up against consensus so you can see <strong>how much of the market\'s number is already covered by announced visibility</strong> vs extrapolation. Management has given hard AI anchors only through <strong>FY27 (&gt;$100B, ~10 GW)</strong> and visibility to <strong>2028</strong>; FY29 is beyond it.</p></div></div>','')+
  '<div class="stats-row c4">'+
    '<div class="stat-card t-ai"><div class="stat-label">BBG AI · FY26E</div><div class="stat-value">$56.6B</div><div class="stat-sub">= guide ~$56B · in line</div></div>'+
    '<div class="stat-card t-warn"><div class="stat-label">BBG AI · FY27E</div><div class="stat-value">$119B</div><div class="stat-sub">vs &gt;$100B guide · ~19% above</div></div>'+
    '<div class="stat-card t-accent"><div class="stat-label">Announced GW · 2027</div><div class="stat-value">~10 GW</div><div class="stat-sub">→ implied ~$11–12B / GW</div></div>'+
    '<div class="stat-card t-neutral"><div class="stat-label">Hard visibility</div><div class="stat-value">to 2028</div><div class="stat-sub">FY29 = consensus extrapolation</div></div>'+
  '</div>'+
  '<div class="card"><div class="card-header"><span class="card-title">Bottom-up build vs consensus</span><span class="card-subtitle">move the levers — AI = GW × content/GW</span></div>'+
    '<div class="card-body">'+
      '<div class="tl-ctl">'+tlSlider('tlDpg','Content per GW','$','B',8,16,0.2,11.2)+tlSlider('tlGw29','GW deployed by FY29','','GW',12,28,1,20)+tlSlider('tlSoft','Software growth','','%/yr',0,15,1,8)+'</div>'+
      '<div class="chart-c" style="height:300px;margin-top:6px"><canvas id="tlChart"></canvas></div>'+
    '</div>'+
    '<div class="source">Bottom-up: <b>AI</b> = GW × content/GW (FY26 locked to the ~$56B guide; FY27 anchored at ~10 GW); <b>non-AI semi</b> grows ~2%/yr off FY25 $16.7B; <b>software</b> off FY25 $27.0B. Consensus line = Bloomberg (avgo-context/AVGO_BBG.xlsx). The default levers roughly reproduce the guided path.</div></div>'+
  '<div class="card"><div class="card-header"><span class="card-title">Announced-build vs Bloomberg, year by year</span></div>'+
    '<div class="card-body" style="padding:0"><table class="tbl" id="tlTbl"><thead><tr><th>FY</th><th>AI (build)</th><th>Non-AI semi</th><th>Software</th><th>Bottom-up</th><th>BBG consensus</th><th>Gap (BBG − build)</th></tr></thead><tbody></tbody></table></div>'+
    '<div class="card-body" id="tlVerdict"></div></div>';
}
function tlRender(pane){
  var dpg = parseFloat(pane.querySelector('#tlDpg').value);
  var gw29 = parseFloat(pane.querySelector('#tlGw29').value);
  var softG = parseFloat(pane.querySelector('#tlSoft').value);
  var r = tlCompute(dpg, gw29, softG);
  freshChart('tlChart',{type:'bar',data:{labels:TL_FY,datasets:[
    {label:'AI (build)',data:r.ai,backgroundColor:'#7A5AF8',stack:'s',borderRadius:2,order:3},
    {label:'Non-AI semi',data:r.nonai,backgroundColor:'#CC092F',stack:'s',borderRadius:2,order:3},
    {label:'Software',data:r.soft,backgroundColor:'#007A8C',stack:'s',borderRadius:2,order:3},
    {type:'line',label:'Bloomberg consensus (total)',data:TL_BBG_TOTAL,yAxisID:'y2',borderColor:'#141C2B',borderWidth:2.5,pointRadius:4,pointHoverRadius:6,tension:0.25,fill:false,order:1}
  ]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'bottom',labels:{font:{family:'Figtree',size:10.5},color:'#6B7A8D',usePointStyle:true,pointStyleWidth:12,boxHeight:8,padding:9}},
      tooltip:{backgroundColor:'#141C2B',titleFont:{family:'Figtree',size:11},bodyFont:{family:'Figtree',size:12},padding:9,cornerRadius:7,callbacks:{label:function(c){return c.dataset.label+': $'+c.raw.toFixed(1)+'B';}}}},
    scales:{x:{stacked:true,grid:{display:false},border:{display:false},ticks:{font:{family:'Figtree',size:11,weight:'600'},color:'#6B7A8D'}},
      y:{stacked:true,min:0,max:340,grid:{color:'#EDF0F5',drawTicks:false},border:{display:false},ticks:{font:{family:'Figtree',size:10},color:'#9AACBE',callback:function(v){return '$'+v+'B';}}},
      y2:{display:false,min:0,max:340,stacked:false}}}});
  var tb = pane.querySelector('#tlTbl tbody'); var rows='';
  for(var i=0;i<5;i++){
    var bu=r.total[i], bbg=TL_BBG_TOTAL[i], gap=bbg-bu;
    var cls = i===0 ? 'b-neutral' : (gap>5?'b-warn':(gap<-5?'b-pos':'b-neutral'));
    rows += '<tr'+(i===0?' class="row-hi"':'')+'><td>'+TL_FY[i]+'</td>'+
      '<td>$'+r.ai[i].toFixed(0)+'B</td><td>$'+r.nonai[i].toFixed(0)+'B</td><td>$'+r.soft[i].toFixed(0)+'B</td>'+
      '<td><strong>$'+bu.toFixed(0)+'B</strong></td><td>$'+bbg.toFixed(0)+'B</td>'+
      '<td>'+(i===0?'—':'<span class="badge '+cls+'">'+(gap>=0?'+':'')+gap.toFixed(0)+'B</span>')+'</td></tr>';
  }
  if(tb) tb.innerHTML = rows;
  var g27=TL_BBG_TOTAL[2]-r.total[2], g29=TL_BBG_TOTAL[4]-r.total[4];
  var p27=g27/TL_BBG_TOTAL[2]*100, p29=g29/TL_BBG_TOTAL[4]*100;
  var vv = pane.querySelector('#tlVerdict');
  if(vv) vv.innerHTML = '<div class="'+(Math.abs(p27)<4?'insight':'caution')+'"><strong>Read:</strong> at these levers the announced-deal build reaches <strong>$'+r.total[2].toFixed(0)+'B in FY27</strong> ('+(g27>=0?'consensus $'+g27.toFixed(0)+'B / '+p27.toFixed(0)+'% above':'build $'+(-g27).toFixed(0)+'B above consensus')+') and <strong>$'+r.total[4].toFixed(0)+'B in FY29</strong> ('+(g29>=0?'consensus $'+g29.toFixed(0)+'B / '+p29.toFixed(0)+'% above':'build $'+(-g29).toFixed(0)+'B above')+'). '+(g27>4?'To reach consensus you must assume <strong>more GW or higher content/GW than Broadcom has disclosed</strong> — consensus is pricing upside beyond announced visibility.':'The announced GW roadmap already supports consensus through FY27.')+' FY28–29 sit beyond the hard-visibility window (2028).</div>';
}
function initTopline(pane){
  if(!pane._tlWired){ pane._tlWired = true;
    ['tlDpg','tlGw29','tlSoft'].forEach(function(id){
      var el = pane.querySelector('#'+id); if(!el) return;
      el.addEventListener('input', function(){
        var lbl = pane.querySelector('#'+id+'v');
        if(lbl) lbl.textContent = (el.getAttribute('data-pre')||'')+el.value+(el.getAttribute('data-suf')||'');
        tlRender(pane);
      });
    });
  }
  tlRender(pane);
}

// ════════════════════════════════════════════════════════════════════════════════
//  DEEP DIVE  (the company's "Deep Dive" tab — flat sub-tabs; Customers nests 5)
// ════════════════════════════════════════════════════════════════════════════════
// Customers groups the four customer views as nested sub-tabs (.ovt-subtab / .ovt-subpane).
var CUST_SUBTABS = [
  { key:'concentration', label:'Customer Concentration', body:concentrationBody, init:initConcentration },
  { key:'valuechain',    label:'Value Chain',            body:valueChainBody,    init:initValueChain },
  { key:'gwroadmap',     label:'GW Roadmap',             body:gwRoadmapBody,     init:initGwRoadmap },
  { key:'commitments',   label:'Customer Commitments',   body:commitmentsBody,   init:initCommitments },
  { key:'topline',       label:'Top-Line Model',         body:toplineBody,       init:initTopline },
];
function customersBody(){
  return '<div class="ovt-subtabs">'+CUST_SUBTABS.map(function(t,i){
    return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+t.key+'">'+esc(t.label)+'</button>';
  }).join('')+'</div>'+
  CUST_SUBTABS.map(function(t,i){
    return '<div class="ovt-subpane" data-ovst="'+t.key+'"'+(i===0?'':' hidden')+'>'+t.body()+'</div>';
  }).join('');
}
function custSubDef(key){ for(var i=0;i<CUST_SUBTABS.length;i++){ if(CUST_SUBTABS[i].key===key) return CUST_SUBTABS[i]; } return null; }
function showCustSub(custPane, key){
  custPane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
  custPane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovst')!==key); });
  var t = custSubDef(key), sub = custPane.querySelector('.ovt-subpane[data-ovst="'+key+'"]');
  if(t && t.init && sub) requestAnimationFrame(function(){ t.init(sub); });
}
function initCustomers(pane){
  if(!pane._subWired){ pane._subWired = true;
    pane.querySelectorAll('.ovt-subtab').forEach(function(btn){
      btn.onclick = function(){ showCustSub(pane, btn.getAttribute('data-ovst')); };
    });
  }
  var active = pane.querySelector('.ovt-subtab.active');
  showCustSub(pane, active ? active.getAttribute('data-ovst') : CUST_SUBTABS[0].key);
}

var DEEP_TABS = [
  { key:'segments',   label:'Segments',            body:segmentsBody,   init:initSegments },
  { key:'guidance',   label:'Guidance',            body:guidanceBody,   init:null },
  { key:'airevenue',  label:'AI Revenue',          body:aiRevenueBody,  init:initAIRevenue },
  { key:'customers',  label:'Customers',           body:customersBody,  init:initCustomers },
  { key:'management', label:'Management',          body:managementBody, init:initManagement },
  { key:'madeep',     label:'PE Strategy',         body:maDeepBody,     init:initMaDeep },
  { key:'valuation',  label:'Valuation',           body:valuationBody,  init:initValuation },
  { key:'industry',   label:'Industry Analysis',   body:industryBody,   init:initIndustry },
];
function deepTabDef(key){ for(var i=0;i<DEEP_TABS.length;i++){ if(DEEP_TABS[i].key===key) return DEEP_TABS[i]; } return null; }
function deepDiveHtml(c){
  _company = c || null;
  var h = '<div class="ov ov-avgo ov-avgo-dd" data-brand="AVGO">';
  h += '<div id="ddOverlay" class="dd-overlay"></div>';
  h += '<div class="ovt-tabs">'+DEEP_TABS.map(function(t,i){
    return '<button type="button" class="ovt-tab'+(i===0?' active':'')+'" data-ovt="'+t.key+'">'+esc(t.label)+'</button>';
  }).join('')+'</div>';
  h += DEEP_TABS.map(function(t,i){
    return '<div class="ovt-pane" data-ovt="'+t.key+'"'+(i===0?'':' hidden')+'>'+t.body()+'</div>';
  }).join('');
  h += '</div>';
  return h;
}
function deepShowOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt')!==key); });
  var t = deepTabDef(key), pane = root.querySelector('.ovt-pane[data-ovt="'+key+'"]');
  if(t && t.init && pane) requestAnimationFrame(function(){ t.init(pane); });
}
function deepDiveInit(){
  var root = document.querySelector('.ov-avgo-dd');
  if(!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ deepShowOvt(root, btn.getAttribute('data-ovt')); };
  });
  // Seg toggles (semi/software) inside Segments — delegated per .seg-toggle group.
  root.querySelectorAll('.seg-toggle').forEach(function(grp){
    if(grp._wired) return; grp._wired = true;
    grp.querySelectorAll('.seg-btn').forEach(function(btn){
      btn.onclick = function(){
        var seg=btn.getAttribute('data-seg'), group=grp.getAttribute('data-seg-group');
        grp.querySelectorAll('.seg-btn').forEach(function(x){ x.classList.toggle('active', x===btn); });
        var cardEl=grp.closest('.card');
        if(cardEl){ cardEl.querySelectorAll('.seg-panel').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel')===group+'-'+seg); }); }
      };
    });
  });
  // Value-chain drill-down: close on backdrop click, close button, or Escape.
  var ov=root.querySelector('#ddOverlay');
  if(ov && !ov._wired){ ov._wired=true;
    ov.addEventListener('click', function(e){ if(e.target===ov || e.target.closest('.dd-close')) ov.classList.remove('open'); });
  }
  if(!root._escWired){ root._escWired=true;
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ var o=document.querySelector('.ov-avgo-dd #ddOverlay'); if(o) o.classList.remove('open'); } });
  }
  var active = root.querySelector('.ovt-tab.active');
  var key = active ? active.getAttribute('data-ovt') : DEEP_TABS[0].key;
  requestAnimationFrame(function(){ deepShowOvt(root, key); });
}

function html(c){
  _company = c || null;
  _mgLoaded = false;
  return '<div class="ov ov-avgo" data-brand="AVGO"><div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div></div>';
}
function init(){ requestAnimationFrame(function(){ initOverview(); }); }

export var avgoOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
