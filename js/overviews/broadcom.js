// overviews/broadcom.js — standardized Overview for Broadcom Inc. (Nasdaq: AVGO)
// Rebuilt one-shot per docs/OVERVIEW_CONVENTIONS.md via /fill-overview.
// No Summit DCF for AVGO → figures web/official-sourced. Primary: FY2025 Form 10-K
// (fiscal year ended Nov 2, 2025; SEC EDGAR CIK 0001730168), Q4/FY2025 8-K, Broadcom IR.
// Two top-level tabs: Overview (standardized) + Deep Dive (empty scaffold — filled by hand later).

// ── shared tiny helpers (self-contained) ──
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }

// ── Block 1 — Key Facts (exactly 10 cells, 5×2). Sources: AVGO FY2025 10-K, IR, EDGAR. ──
var BC_FACTS=[
  ['Listing','Nasdaq: AVGO'],
  ['HQ','Palo Alto, CA, USA'],
  ['Incorporation','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1991 · Avago 2005'],
  ['IPO','Aug 2009 (as Avago)'],
  ['CEO','Hock Tan · since 2006'],
  ['Employees','~33,000 (Nov 2025)'],
  ['Dividend','Payer (since 2010)'],
  ['Market cap','~$1.8T · Jul 2026'],
];

// ── Block 2 — Description (tight, NON-redundant: identity/genesis only; no mix, no product list) ──
var DESC='Broadcom (Nasdaq: AVGO) is one of the world’s largest semiconductor and infrastructure-software companies; its chips and software sit inside modern data centers, networks, broadband lines and smartphones. It is the product of acquisition rather than organic growth — a 2005 private-equity carve-out named Avago that later bought the original Broadcom and took its name, then expanded into enterprise software.';

// ── Block 3 — 4-quadrant (each cell ≤ ~30 words) ──
var BC_BIZ=[
  ['What it sells','Semiconductor chips — AI accelerators, networking, wireless, broadband, storage — and infrastructure software (VMware, mainframe, security, Fibre Channel).'],
  ['Who buys it','Hyperscalers and data-center operators, device OEMs, telecom carriers, and large enterprises &amp; governments.'],
  ['How it earns','~58% Semiconductor Solutions, ~42% Infrastructure Software (FY2025). AI silicon — custom XPUs + Ethernet — is the fastest-growing part.'],
  ['The edge','Custom silicon designed into a few hyperscalers’ roadmaps, sticky enterprise software with high switching costs, and scale in AI networking.'],
];

// ── Block 4 — How it makes money (Segments ⇄ Geography; both reconcile to $63,887M FY2025) ──
// Segment $/% and geography $ are FY2025 as reported in the 10-K. Σ each view = $63.9B (cross-check).
var BC_SEG=[['Semiconductor Solutions',58,'$36.9B','#10141A'],['Infrastructure Software',42,'$27.0B','#C4122F']];
var BC_SEG_DEF=[
  ['Semiconductor Solutions','digital &amp; mixed-signal chips — AI accelerators, Ethernet switching/routing, broadband, wireless/RF, storage connectivity and optics — for data centers, networks and devices.'],
  ['Infrastructure Software','software to run and secure enterprise IT — VMware private cloud, mainframe, cybersecurity, enterprise (ValueOps) and Fibre Channel SAN management.'],
];
// Geography = ship-to location (10-K names only US / China+HK / Singapore / Taiwan; rest = "other foreign").
var BC_GEO=[['United States',26,'$16.5B','#2E6BE6'],['China (incl. HK)',17,'$11.2B','#3A7BD5'],['Singapore',17,'$10.8B','#5A8DEE'],['Taiwan',10,'$6.5B','#7A5AF8'],['Other foreign',30,'$19.0B','#9AA7B8']];

// ── Block 5 — Products (two-tier: family card → pop-up → expandable specific products) ──
var BC_PROD_GROUPS=[
  { seg:'Semiconductor Solutions', families:[
    { ic:'🧠', fam:'AI accelerators / custom XPUs', d:'Customer-specific AI compute silicon co-designed with hyperscalers.', items:[
      ['Custom XPUs / AI ASICs','Customer-specific AI accelerators for hyperscalers, sold as design + IP + silicon (e.g. behind Google TPU, Meta MTIA) — not a Broadcom-branded chip.'],
      ['3.5D XDSiP','Advanced packaging platform for custom AI XPUs — >6,000 mm² of silicon and up to 12 HBM stacks.'],
      ['200G/lane SerDes IP','High-speed die-to-die and chip-to-chip interconnect embedded inside XPUs and switches.'],
    ]},
    { ic:'🌐', fam:'Ethernet switching & routing', d:'Switch and routing silicon that links AI clusters and cloud fabrics.', items:[
      ['Tomahawk 6 (BCM78910)','102.4 Tb/s scale-out data-center switch; first with a co-packaged-optics option.'],
      ['Tomahawk 5 (BCM78900)','51.2 Tb/s single-chip AI/cloud fabric switch.'],
      ['Trident 5-X12 (BCM78800)','Programmable 50–800GbE switch with an on-chip inference engine, for enterprise / top-of-rack.'],
      ['Jericho4','Deep-buffer routing/switch SoC for AI-scale fabrics and carrier core/edge.'],
      ['Thor 2 NIC (BCM957608)','AI-optimized 400G Ethernet network adapter connecting servers/GPUs to the fabric.'],
    ]},
    { ic:'📡', fam:'Broadband', d:'Cable, fiber and set-top silicon for home connectivity.', items:[
      ['DOCSIS 3.1/4.0 modem & CMTS SoCs','End-to-end cable-broadband silicon for the home and the headend.'],
      ['PON OLT/ONU SoCs (BCM686xx / BCM55050)','Fiber-to-the-home headend and premises chips (GPON/XGS-PON), some with an embedded AI core.'],
      ['BCM7218X set-top SoC','Ultra-HD set-top-box chip with AV1 decode and Wi-Fi 6.'],
    ]},
    { ic:'📱', fam:'Wireless / RF', d:'RF front-end and connectivity, with heavy flagship-smartphone content.', items:[
      ['FBAR filters & RF front-end modules','BAW filters and PA/FEM modules for smartphone bands — major content in a leading North American handset.'],
      ['FiFEM (Wi-Fi 7)','Wi-Fi 7 RF front-end module with integrated FBAR filtering.'],
      ['Wi-Fi / Bluetooth combo SoCs','Integrated connectivity for phones, access points and IoT.'],
      ['Custom touch-controller ASICs','Capacitive touchscreen controllers for phones and tablets.'],
    ]},
    { ic:'💾', fam:'Server storage connectivity', d:'RAID and host-bus silicon that moves data to drives.', items:[
      ['MegaRAID 9600/9500','24G / Gen4 Tri-Mode RAID adapters spanning NVMe, SAS and SATA.'],
      ['HBA 9500','Gen4 Tri-Mode host bus adapters for large SAS/SATA/NVMe fan-out.'],
      ['SAS expanders / PCIe switches','Silicon enabling mixed-protocol drive bays and enclosure expansion.'],
    ]},
    { ic:'🔦', fam:'Optical & fiber', d:'Optical DSPs, lasers and components for AI-network links.', items:[
      ['Taurus (BCM83640)','3nm 400G/lane optical DSP for 1.6T modules.'],
      ['Sian3 / Sian2M','200G/lane optical DSPs for 800G/1.6T single-mode and short-reach multimode.'],
      ['Lasers, photodetectors & transceivers','200G/400G optical interconnect components for AI networks.'],
    ]},
  ]},
  { seg:'Infrastructure Software', families:[
    { ic:'☁️', fam:'VMware (private cloud)', d:'Enterprise virtualization and private-cloud platform.', items:[
      ['VMware Cloud Foundation (VCF)','Flagship integrated private-cloud platform — compute, storage, networking, containers and management.'],
      ['vSphere','Core server virtualization (ESXi hypervisor + vCenter).'],
      ['vSAN','Software-defined storage pooling local disks.'],
      ['NSX','Software-defined networking and micro-segmentation security.'],
      ['Tanzu','Kubernetes runtime and application platform.'],
    ]},
    { ic:'🖥️', fam:'Mainframe software', d:'z/OS tooling inherited from CA Technologies.', items:[
      ['Endevor','Mainframe source-control and DevOps release automation.'],
      ['Datacom / IDMS','Mainframe database management systems.'],
      ['Mainframe DevOps Suite','Modern z/OS DevOps tooling — Git bridge, team build and test.'],
    ]},
    { ic:'🛡️', fam:'Cybersecurity', d:'Enterprise security from Symantec + Carbon Black.', items:[
      ['Symantec CBX (Carbon Black XDR)','Unified cloud XDR merging Symantec prevention with Carbon Black detection & response.'],
      ['Symantec Endpoint Security Complete','Enterprise endpoint protection and EDR.'],
      ['Symantec DLP','Data-loss prevention across endpoint, network and cloud.'],
      ['Symantec Cloud SWG / SASE','Cloud web security and secure-access-service-edge.'],
    ]},
    { ic:'📊', fam:'Enterprise software (ValueOps)', d:'Agile planning and value-stream management from CA.', items:[
      ['Rally','Enterprise agile planning.'],
      ['Clarity','Strategic portfolio / project management (PPM).'],
      ['ValueOps Insights','Value-stream automation and outcome analytics.'],
    ]},
    { ic:'🔗', fam:'Fibre Channel SAN (Brocade)', d:'Storage-area-network switching from Brocade.', items:[
      ['Brocade G730 switch','128-port 64G (Gen 7) Fibre Channel SAN switch.'],
      ['Brocade X7 directors','Core Gen-7 Fibre Channel directors for large SANs.'],
      ['64G FC optical transceivers','High-density Fibre Channel optics.'],
    ]},
  ]},
];

// ── Block 6 — Competitors scatter. X=multiple (EV/EBITDA⇄P/E), Y=growth, bubble=market cap (USD). ──
// ⚠ Peer figures are approximate, web-sourced (mid-2026), pending a data feed.
var BC_PEERS=[
  { n:'Broadcom', evT:34, evF:28, peT:45, peF:35, gt:24, gf:18, mc:1800, hl:true, why:'Custom AI silicon + Ethernet networking + VMware software. Mid-20s% growth with software-grade margins — a premium multiple the market pays for the AI-networking franchise and the recurring software base.' },
  { n:'Nvidia',   evT:40, evF:30, peT:40, peF:32, gt:55, gf:40, mc:4000, why:'The merchant-GPU leader and the fastest grower of the group. Broadcom is a partner (networking) and an alternative (custom XPUs vs merchant GPUs) at once.' },
  { n:'AMD',      evT:40, evF:24, peT:45, peF:30, gt:25, gf:24, mc:300,  why:'The #2 merchant GPU/CPU challenger. Similar growth to Broadcom, richly valued on the AI ramp.' },
  { n:'Marvell',  evT:30, evF:22, peT:45, peF:28, gt:30, gf:25, mc:100,  why:'The closest custom-silicon &amp; networking comp to Broadcom, smaller and faster-growing — often framed as the pure-play AI-ASIC bet.' },
  { n:'Qualcomm', evT:12, evF:11, peT:15, peF:14, gt:8,  gf:7,  mc:180,  why:'Smartphone-modem leader diversifying into auto/IoT. The value name of the group — cheap on slow growth and handset-cycle risk.' },
  { n:'Texas Instruments', evT:22, evF:18, peT:34, peF:30, gt:9, gf:11, mc:170, why:'Analog/embedded blue-chip. Slow, cyclical growth but fortress margins and cash return — a very different, non-AI profile.' },
];

// ── Block 7 — Timeline (per §4.7 relevance rubric; genesis first, depth in Read Mores) ──
var BC_TL=[
  { y:'1991', t:'Original <b>Broadcom Corporation</b> founded in Irvine, CA (Henry Samueli &amp; Henry Nicholas).', d:'<ul><li>Fabless designer of communications chips (broadband, networking, connectivity); IPO’d on Nasdaq (BRCM) in 1998.</li><li>Ran independently for 25 years — this is the <b>name</b> today’s Broadcom carries, <b>not</b> its operating lineage.</li><li>Its founders were charged in a stock-option <b>backdating</b> case (SEC, 2008); the criminal charges were <b>dismissed in 2009</b> for prosecutorial misconduct. (Predecessor entity — pre-2016.)</li></ul>' },
  { y:'2005', t:'<b>Avago</b> is carved out of Agilent/HP — KKR &amp; Silver Lake buy the semiconductor unit for ~$2.66B.', d:'<ul><li>Hewlett-Packard (1939) spun off <b>Agilent</b> in 1999; Agilent then sold its Semiconductor Products Group to the two PE firms, creating <b>Avago Technologies</b> (~6,500 employees).</li><li>This private-equity carve-out — not the 1991 Broadcom — is the actual <b>operating company</b> behind AVGO today.</li></ul>' },
  { y:'2009', t:'<b>Avago IPOs</b> on Nasdaq under <b>AVGO</b> (Aug 2009, $15/share, ~$3.8B).', d:'<ul><li>KKR and Silver Lake retained control after the IPO.</li><li>Avago then turned acquisitive — <b>LSI</b> (2014, ~$6.6B, storage/networking silicon) was its first large listed-target deal.</li></ul>' },
  { y:'2010', t:'Declares its <b>first-ever dividend</b> — $0.07/share (Dec 2010).' },
  { y:'2016', t:'Avago acquires the original <b>Broadcom</b> (~$37B) and takes its name — the two lineages merge.', d:'<ul><li>Closed Feb 2016; the combined entity was renamed <b>Broadcom Limited</b>; the ticker stayed <b>AVGO</b>.</li><li>Avago’s operating model was applied to Broadcom’s wireless / broadband / networking franchises — the core of today’s Semiconductor Solutions.</li></ul>' },
  { y:'2018', t:'Redomiciles to <b>Delaware</b>; a hostile <b>~$117B bid for Qualcomm</b> is blocked by the US.', d:'<ul><li>Moving its legal home from Singapore to the US removed it from <b>CFIUS</b> jurisdiction, clearing the way for large US acquisitions.</li><li>The Qualcomm bid (raised to ~$121B, “best and final”) was <b>blocked by a Trump executive order</b> (Mar 12, 2018) on national-security / 5G grounds.</li></ul>' },
  { y:'2018–19', t:'<b>Software pivot</b>: acquires <b>CA Technologies</b> ($18.9B), then <b>Symantec’s</b> enterprise security ($10.7B).', d:'<ul><li>CA <b>launched the Infrastructure Software segment</b> — mainframe plus enterprise software.</li><li>Symantec’s enterprise unit added <b>cybersecurity</b>.</li></ul>' },
  { y:'2023', t:'Closes the <b>$69B VMware</b> acquisition (Nov) — software becomes ~42% of revenue.', d:'<ul><li>Largest deal in Broadcom’s history (~$61B equity / ~$69B enterprise value).</li><li>The portfolio was simplified around <b>VMware Cloud Foundation</b> and shifted to subscriptions, lifting Infrastructure Software to a high-margin ~42% of revenue.</li></ul>' },
  { y:'2026', t:'Crosses a <b>$2T market cap</b> (April) — AI networking &amp; custom XPUs lead growth.', d:'<ul><li>Shares touched a record ~$422; ~6th company ever to reach $2T intraday (first passed $1T in Dec 2024).</li><li>Pulled back to ~$1.8T by mid-2026.</li></ul>' },
];
var SOURCES='Sources: Broadcom Inc. (Nasdaq: AVGO) FY2025 Form 10-K (fiscal year ended Nov 2, 2025; SEC EDGAR CIK 0001730168), Q4/FY2025 results & IR, and public company history. Segment and geographic revenue are FY2025 as reported (geography is by ship-to location, not end-demand). Peer multiples, growth and market caps are approximate, web-sourced (mid-2026), pending a data feed — directional, not exact.';

// ── Renderers ──
function bcKeyFacts(){
  return '<div class="stdkf">'+BC_FACTS.slice(0,10).map(function(p){ return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-live" id="bcLive" hidden></div>';
}
function bcFourQuad(){
  return '<div class="stdq">'+BC_BIZ.map(function(b){ return '<div class="stdq-cell"><div class="stdq-k">'+esc(b[0])+'</div><div class="stdq-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function bcMoneyMap(){
  var h='<div class="mm-tog"><button type="button" class="mm-pill active" data-mm="seg">By segment</button><button type="button" class="mm-pill" data-mm="geo">By geography</button></div>';
  h+='<div id="bcMMseg">'+mbars(BC_SEG)+
    '<div class="mm-defs acc-list" style="margin-top:12px">'+BC_SEG_DEF.map(function(d){ return '<div class="acc"><button type="button" class="acc-h">What is “'+esc(d[0])+'”?<span class="acc-x">+</span></button><div class="acc-b" hidden>'+d[1]+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-diagram-cap" style="margin-top:8px">FY2025 revenue by reportable segment. <span class="ave-subh-note">Σ = $63.9B total net revenue — reconciles to the geography view. Source: AVGO FY2025 10-K.</span></div></div>';
  h+='<div id="bcMMgeo" hidden>'+mbars(BC_GEO)+
    '<div class="ov-diagram-cap" style="margin-top:8px">FY2025 revenue by <b>ship-to location</b> (where product is delivered), <b>not</b> end-customer demand — chips ship to contract manufacturers concentrated in Asia, so China / Singapore / Taiwan overstate the true end-market. The 10-K names only the US, China (incl. HK), Singapore &amp; Taiwan; all other countries are aggregated as “other foreign”. <span class="ave-subh-note">Σ = $63.9B — reconciles to the segment view. Source: AVGO FY2025 10-K.</span></div></div>';
  return h;
}
function bcProducts(){
  return BC_PROD_GROUPS.map(function(g,gi){
    return '<div class="stdp-group"><div class="stdp-seg">'+esc(g.seg)+'</div><div class="stdp">'+
      g.families.map(function(f,fi){
        return '<div class="stdp-card ov-clickable" data-detail="fam:'+gi+'-'+fi+'"><div class="stdp-ic">'+f.ic+'</div>'+
          '<div class="stdp-n">'+f.fam+'</div><div class="stdp-d">'+f.d+'</div><div class="stdp-more">See products ›</div></div>';
      }).join('')+'</div></div>';
  }).join('');
}
function bcPeerScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-dot{transition:.15s}.mg-node text{pointer-events:none}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid #C4122F}'+
    '.mg-tip .mgt-n{display:block;font-weight:800;font-size:12.5px;color:#C4122F;margin-bottom:3px}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = market cap in USD</b> (Nvidia’s ~$4T dwarfs the rest). <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="bcMgSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="bcMgXlab">EV/EBITDA · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    BC_PEERS.map(function(p){ var r=Math.max(6,Math.min(24,6+Math.sqrt(p.mc)*0.22));
      return '<g class="mg-node" data-evt="'+p.evT+'" data-evf="'+p.evF+'" data-pet="'+(p.peT==null?'':p.peT)+'" data-pef="'+(p.peF==null?'':p.peF)+'" data-gt="'+p.gt+'" data-gf="'+p.gf+'" data-r="'+r.toFixed(1)+'" data-name="'+esc(p.n)+'" data-why="'+esc(p.why)+'">'+
        '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="'+(p.hl?'#C4122F':'#3A7BD5')+'"'+(p.hl?' stroke="#fff" stroke-width="2"':' opacity="0.82"')+' style="cursor:pointer"></circle>'+
        '<text font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#C4122F':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>'; }).join('')+
  '</svg></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Only <b>listed</b> peers with a public multiple appear. <span class="ave-subh-note">Multiples, growth &amp; market caps are approximate, web-sourced (mid-2026), pending a data feed.</span></div>';
  h+='<div id="bcMgTip" class="mg-tip" hidden></div>';
  return h;
}
function bcTimeline(){
  return '<div class="ov-timeline">'+BC_TL.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function stdOverviewBody(){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.stdq{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:4px 0}'+
    '.stdq-cell{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;background:var(--w)}'+
    '.stdq-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#C4122F;margin-bottom:5px}'+
    '.stdq-v{font-size:12px;color:var(--navy);line-height:1.5}.stdq-v b{font-weight:800}'+
    '.mm-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:10px}'+
    '.mm-pill{border:none;background:transparent;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:5px 14px;border-radius:999px;cursor:pointer}.mm-pill.active{background:var(--navy);color:#fff}'+
    '.mm-defs{display:flex;flex-direction:column;gap:5px;margin:10px 0 2px}'+
    '.mm-def{font-size:11.5px;color:var(--navy);line-height:1.5}.mm-def b{color:#C4122F}'+
    '.stdp-group{margin:2px 0 8px}'+
    '.stdp-seg{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:10px 0 7px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:#C4122F}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:#C4122F;margin-top:6px}'+
    '.famd{font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px}'+
    '.acc-list{display:flex;flex-direction:column;gap:6px}'+
    '.acc{border:1px solid var(--bdr);border-radius:9px;overflow:hidden}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px}'+
    '.acc-h.acc-open{background:#EEF2F6}.acc-x{color:#C4122F;font-weight:800;font-size:14px;flex:none}'+
    '.acc-b{font-size:11.5px;color:var(--mu);line-height:1.5;padding:8px 12px 10px;background:var(--w)}</style>';
  h+=bcKeyFacts();
  h+='<p class="ov-lede" style="margin-top:18px">'+esc(DESC)+'</p>';
  h+=sec('The business at a glance', bcFourQuad());
  h+=sec('How it makes money', bcMoneyMap());
  h+=sec('What it makes — the products', bcProducts());
  h+=sec('Competitors — valuation vs growth', bcPeerScatter());
  h+=sec('Timeline', bcTimeline());
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
function deepDiveScaffold(){
  return '<div class="ov-callout" style="margin-top:4px">The <b>Deep Dive</b> for Broadcom has not been built yet. Its standard structure is still being defined; sections (e.g. Segments, Financials, Management, History) will be added by hand. The standardized <b>Overview</b> tab is complete and auto-fillable.</div>'+
    '<div class="ov-foot" style="margin-top:14px">Deep Dive — sources will be cited per section as it is built.</div>';
}

function html(c){
  var h='<div class="ov ov-avgo" data-brand="AVGO">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="deepdive">Deep Dive</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+stdOverviewBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="deepdive" hidden>'+deepDiveScaffold()+'</div>';
  h+='<div class="ov-modal-back" id="bcModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="bcModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="bcModalT"></div><div class="ov-modal-b" id="bcModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ── Interactions ──
function positionMG(root){
  var svg=root.querySelector('#bcMgSvg'); if(!svg) return;
  var tp=root.querySelector('.mg-pill[data-mgtype].active'), bp=root.querySelector('.mg-pill[data-mgbasis].active');
  var type=(tp?tp.getAttribute('data-mgtype'):'ev'), basis=(bp?bp.getAttribute('data-mgbasis'):'f');
  var XMAX=(type==='ev'?42:48), GMAX=60;
  svg.querySelectorAll('.mg-node').forEach(function(g){
    var multAttr = type==='ev' ? (basis==='f'?'data-evf':'data-evt') : (basis==='f'?'data-pef':'data-pet');
    var raw=g.getAttribute(multAttr), c=g.querySelector('circle'), t=g.querySelector('text');
    if(raw===''||raw==null||isNaN(parseFloat(raw))){ if(c) c.style.display='none'; if(t) t.style.display='none'; return; }
    if(c) c.style.display=''; if(t) t.style.display='';
    var mult=parseFloat(raw), grow=parseFloat(g.getAttribute(basis==='f'?'data-gf':'data-gt')), r=parseFloat(g.getAttribute('data-r'));
    var x=80+Math.min(1,mult/XMAX)*(612-80), y=252-Math.min(1,grow/GMAX)*(252-44);
    if(c){ c.setAttribute('cx',x.toFixed(1)); c.setAttribute('cy',y.toFixed(1)); }
    if(t){ t.setAttribute('x',x.toFixed(1)); t.setAttribute('y',(y-r-5).toFixed(1)); }
  });
  var xl=root.querySelector('#bcMgXlab'); if(xl) xl.textContent=(type==='ev'?'EV/EBITDA':'P/E')+' · '+(basis==='f'?'forward':'trailing');
}
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(function(){ positionMG(root); });
}
function wireModal(root){
  var back=root.querySelector('#bcModalBack'), mT=root.querySelector('#bcModalT'), mB=root.querySelector('#bcModalB'); if(!back) return;
  function wireAcc(){ mB.querySelectorAll('.acc-h').forEach(function(hh){ hh.onclick=function(){ var b=hh.nextElementSibling; var open=!b.hidden; b.hidden=open; var x=hh.querySelector('.acc-x'); if(x) x.textContent=open?'+':'–'; hh.classList.toggle('acc-open',!open); }; }); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; wireAcc(); back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  root.querySelector('#bcModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='fam'){ var ix=id.split('-'); var g=BC_PROD_GROUPS[+ix[0]]; var f=g&&g.families[+ix[1]]; if(!f) return null;
      var body='<div class="famd">'+esc(f.d)+'</div><div class="acc-list">'+f.items.map(function(it){
        return '<div class="acc"><button type="button" class="acc-h">'+esc(it[0])+'<span class="acc-x">+</span></button><div class="acc-b" hidden>'+esc(it[1])+'</div></div>';
      }).join('')+'</div>';
      return { t:f.ic+' '+esc(f.fam), h:body };
    }
    if(kind==='hist'){ var t=BC_TL[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
function fetchQuote(ticker){
  var env=(typeof window!=='undefined')&&window.ENV;
  if(!env||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return Promise.reject(new Error('no-env'));
  var base=String(env.SUPABASE_URL).replace(/\/+$/,'');
  return fetch(base+'/functions/v1/get-quote?ticker='+ticker,{ headers:{ apikey:env.SUPABASE_ANON_KEY, Authorization:'Bearer '+env.SUPABASE_ANON_KEY } })
    .then(function(r){ if(!r.ok) throw new Error('http '+r.status); return r.json(); })
    .then(function(j){ if(j&&typeof j.price==='number') return j; throw new Error('bad payload'); });
}
function renderLive(root){
  var el=root.querySelector('#bcLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('AVGO').then(function(q){
    var p=q.changePct, up=(p==null||p>=0);
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">AVGO</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NASDAQ')+'</span>';
  }).catch(function(){ el.hidden=true; el.innerHTML=''; });
}
function init(c){
  var root=document.querySelector('.ov-avgo'); if(!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  wireModal(root);
  // Segment definitions: collapsible per-segment accordions
  root.querySelectorAll('.mm-defs .acc-h').forEach(function(hh){ hh.onclick=function(){ var b=hh.nextElementSibling; var open=!b.hidden; b.hidden=open; var x=hh.querySelector('.acc-x'); if(x) x.textContent=open?'+':'–'; hh.classList.toggle('acc-open',!open); }; });
  // Peer scatter: tooltip + toggles
  var mgtip=root.querySelector('#bcMgTip');
  if(mgtip){ root.querySelectorAll('.mg-node').forEach(function(g){
    function show(){ mgtip.innerHTML='<span class="mgt-n">'+g.getAttribute('data-name')+'</span>'+g.getAttribute('data-why'); mgtip.hidden=false; }
    function move(e){ mgtip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; mgtip.style.top=(e.clientY+16)+'px'; }
    g.addEventListener('mouseenter', show); g.addEventListener('mousemove', move);
    g.addEventListener('mouseleave', function(){ mgtip.hidden=true; });
    g.addEventListener('click', function(e){ show(); move(e); });
  }); }
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    var grp=btn.hasAttribute('data-mgtype')?'data-mgtype':'data-mgbasis';
    root.querySelectorAll('.mg-pill['+grp+']').forEach(function(b){ b.classList.toggle('active', b===btn); });
    positionMG(root);
  }; });
  positionMG(root);
  // How-it-makes-money toggle
  root.querySelectorAll('.mm-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-mm');
    root.querySelectorAll('.mm-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var s=root.querySelector('#bcMMseg'), g=root.querySelector('#bcMMgeo');
    if(s) s.hidden=(v!=='seg'); if(g) g.hidden=(v!=='geo');
  }; });
}
export var broadcomOverview = { html: html, init: init };
