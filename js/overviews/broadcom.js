// overviews/broadcom.js — standardized Overview for Broadcom Inc. (Nasdaq: AVGO)
// Built per docs/OVERVIEW_CONVENTIONS.md via the /fill-overview workflow.
// No Summit DCF for AVGO → all figures web/official-sourced (FY2025 10-K, EDGAR CIK 0001730168, IR).
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
  ['Dividend','Payer (since 2011)'],
  ['Market cap','~$1.8T · Jul 2026'],
];
var DESC='Broadcom designs and supplies a broad range of semiconductor and infrastructure-software products. It runs two segments: Semiconductor Solutions — AI accelerators (custom XPUs), Ethernet networking, broadband, wireless and storage — and Infrastructure Software, anchored by VMware plus mainframe and cybersecurity. It is known for mission-critical franchises with high switching costs, deep custom-silicon partnerships with hyperscalers, and CEO Hock Tan’s disciplined acquire-and-optimize, high-margin model.';

// ── Block 3 — 4-quadrant (each cell ≤ ~30 words) ──
var BC_BIZ=[
  ['What it sells','Semiconductors — AI accelerators &amp; networking chips, wireless, broadband, storage — and infrastructure software (VMware, mainframe, security).'],
  ['Who buys it','Hyperscalers and cloud/data-center operators, device OEMs, telecom carriers, and large enterprises.'],
  ['How it earns','~58% Semiconductor Solutions, ~42% Infrastructure Software. AI (custom XPUs + Ethernet networking) is the growth engine.'],
  ['The edge','Mission-critical franchises with high switching costs, custom-silicon lock-in with hyperscalers, VMware’s enterprise base, and industry-leading margins.'],
];

// ── Block 4 — How it makes money (Segments ⇄ Geography; both ≥2 slices) ──
var BC_SEG=[['Semiconductor Solutions',58,'$36.9B','#10141A'],['Infrastructure Software',42,'$27.0B','#C4122F']];
var BC_GEO=[['Asia-Pacific',56,'$35.9B','#2E6BE6'],['Americas',30,'$18.9B','#3A7BD5'],['EMEA',14,'$9.1B','#7A5AF8']];

// ── Block 5 — Products (icon fallback; detail in pop-up) ──
var BC_PRODUCTS=[
  { k:'xpu', ic:'🧠', n:'AI accelerators (XPUs)', d:'Custom AI silicon co-designed with hyperscalers.', detail:'Broadcom co-designs custom AI accelerators (“XPUs”/ASICs) with a handful of hyperscalers (e.g. Google’s TPU lineage). Unlike a merchant GPU, an XPU is tailored to one customer’s workload — Broadcom supplies the design, IP and manufacturing interface. This, plus AI networking, is the core of the AI growth story.' },
  { k:'net', ic:'🌐', n:'Ethernet networking', d:'Tomahawk &amp; Jericho switch chips that link AI clusters.', detail:'Broadcom’s Tomahawk (switch) and Jericho (routing) silicon is the connective tissue of large AI clusters — moving data between tens of thousands of accelerators. As AI build-outs scale, networking content per cluster rises, making this one of the fastest-growing franchises.' },
  { k:'vmw', ic:'☁️', n:'VMware Cloud Foundation', d:'Enterprise virtualization / private-cloud software.', detail:'Acquired for ~$69B in Nov 2023, VMware turned Broadcom into a top-tier enterprise software vendor. Broadcom simplified the portfolio into VMware Cloud Foundation (VCF) and shifted to subscriptions — lifting Infrastructure Software to ~42% of revenue at very high margins.' },
  { k:'wl', ic:'📱', n:'Wireless / RF', d:'FBAR filters &amp; connectivity, heavy smartphone content.', detail:'Broadcom supplies RF front-end (FBAR filters), touch, and connectivity components with large content in flagship smartphones (notably a major North American handset customer). A mature, cash-generative franchise tied to the smartphone cycle.' },
  { k:'sw', ic:'🛡️', n:'Mainframe &amp; security software', d:'CA and Symantec enterprise software.', detail:'From the 2018–19 acquisitions of CA Technologies and Symantec’s enterprise business: mission-critical mainframe tooling and cybersecurity sold to the world’s largest enterprises — sticky, high-margin, low-growth.' },
];

// ── Block 6 — Competitors scatter. X=multiple (EV/EBITDA⇄P/E), Y=growth, bubble=market cap (USD). ──
// ⚠ Peer figures are approximate, web-sourced (mid-2026), pending the Fiscal.ai feed.
var BC_PEERS=[
  { n:'Broadcom', evT:34, evF:28, peT:45, peF:35, gt:24, gf:18, mc:1800, hl:true, why:'Custom AI silicon + Ethernet networking + VMware software. Mid-20s% growth with software-grade margins — a premium multiple the market pays for the AI-networking franchise and the recurring software base.' },
  { n:'Nvidia',   evT:40, evF:30, peT:40, peF:32, gt:55, gf:40, mc:4000, why:'The merchant-GPU leader and the fastest grower of the group. Broadcom is a partner (networking) and an alternative (custom XPUs vs merchant GPUs) at once.' },
  { n:'AMD',      evT:40, evF:24, peT:45, peF:30, gt:25, gf:24, mc:300,  why:'The #2 merchant GPU/CPU challenger. Similar growth to Broadcom, richly valued on the AI ramp.' },
  { n:'Marvell',  evT:30, evF:22, peT:45, peF:28, gt:30, gf:25, mc:100,  why:'The closest custom-silicon &amp; networking comp to Broadcom, smaller and faster-growing — often framed as the pure-play AI-ASIC bet.' },
  { n:'Qualcomm', evT:12, evF:11, peT:15, peF:14, gt:8,  gf:7,  mc:180,  why:'Smartphone-modem leader diversifying into auto/IoT. The value name of the group — cheap on slow growth and handset-cycle risk.' },
  { n:'Texas Instruments', evT:22, evF:18, peT:34, peF:30, gt:9, gf:11, mc:170, why:'Analog/embedded blue-chip. Slow, cyclical growth but fortress margins and cash return — a very different, non-AI profile.' },
];

// ── Block 7 — Timeline ──
var BC_TL=[
  { y:'1991', t:'Broadcom Corp. founded (Henry Samueli &amp; Henry Nicholas).' },
  { y:'2005', t:'Avago created — KKR &amp; Silver Lake buy Agilent’s semiconductor unit for ~$2.66B.' },
  { y:'2009', t:'Avago IPOs on Nasdaq under <b>AVGO</b> (Aug 2009).' },
  { y:'2016', t:'Avago acquires Broadcom Corp. (~$37B) and takes the <b>Broadcom</b> name.', d:'The deal that created today’s Broadcom: Avago’s operating discipline applied to Broadcom’s connectivity franchises. Ticker stayed AVGO.' },
  { y:'2018', t:'Redomiciles to <b>Delaware</b>; a hostile bid for Qualcomm is blocked on US national-security grounds.', d:'Moving the legal home from Singapore to the US cleared the way for large US acquisitions — but the $117B Qualcomm bid was blocked by executive order.' },
  { y:'2019', t:'Software pivot: acquires <b>CA Technologies</b> then <b>Symantec’s</b> enterprise unit.' },
  { y:'2023', t:'Closes the <b>$69B VMware</b> acquisition (Nov) — software becomes ~40% of revenue.', d:'The largest deal in Broadcom’s history reshaped the model: Infrastructure Software jumped to ~40%+ of revenue at very high margins, and the portfolio was simplified around VMware Cloud Foundation.' },
  { y:'2024', t:'10-for-1 stock split; AI revenue accelerates sharply.' },
  { y:'2025', t:'Record <b>$63.9B</b> revenue (+24%); AI networking &amp; custom XPUs lead growth.' },
  { y:'2026', t:'Surpasses a <b>$2T market cap</b> (April) — among the largest companies in the world.' },
];
var SOURCES='Sources: Broadcom Inc. (Nasdaq: AVGO) FY2025 Form 10-K (SEC EDGAR CIK 0001730168), Q4/FY2025 results & IR, and public company history. Segment and geographic figures are FY2025 as reported. Peer multiples, growth and market caps are approximate, web-sourced (mid-2026) and pending the Fiscal.ai data feed — directional, not exact.';

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
  h+='<div id="bcMMseg">'+mbars(BC_SEG)+'<div class="ov-diagram-cap" style="margin-top:6px">FY2025 revenue mix. Semiconductors (led by AI) still the larger half; Infrastructure Software (VMware) is the high-margin ~42%. <span class="ave-subh-note">Source: AVGO FY2025 results.</span></div></div>';
  h+='<div id="bcMMgeo" hidden>'+mbars(BC_GEO)+'<div class="ov-diagram-cap" style="margin-top:6px">FY2025 revenue by region (ship-to). Asia-Pacific dominates because chips ship to Asian manufacturers; China alone was ~17%. <span class="ave-subh-note">Source: AVGO FY2025 10-K.</span></div></div>';
  return h;
}
function bcProducts(){
  return '<div class="stdp">'+BC_PRODUCTS.map(function(p){
    return '<div class="stdp-card ov-clickable" data-detail="uprod:'+esc(p.k)+'"><div class="stdp-ic">'+p.ic+'</div>'+
      '<div class="stdp-n">'+p.n+'</div><div class="stdp-d">'+p.d+'</div><div class="stdp-more">More ›</div></div>';
  }).join('')+'</div>';
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
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Only <b>listed</b> peers with a public multiple appear; a name drops out of the P/E view when it has no meaningful P/E. <span class="ave-subh-note">Multiples, growth &amp; market caps are approximate, web-sourced (mid-2026), pending the Fiscal.ai feed.</span></div>';
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
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:#C4122F}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:#C4122F;margin-top:6px}</style>';
  h+=bcKeyFacts();
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+=sec('The business at a glance', bcFourQuad());
  h+=sec('How it makes money', bcMoneyMap());
  h+=sec('What it makes — the products', bcProducts());
  h+=sec('Competitors — valuation vs growth', bcPeerScatter());
  h+=sec('Timeline', bcTimeline());
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
function deepDiveScaffold(){
  return '<div class="ov-callout" style="margin-top:4px">The <b>Deep Dive</b> for Broadcom has not been built yet. Its standard structure is still being defined; sections (e.g. Segments, Financials, Management, History) will be added by hand. The standardized <b>Overview</b> tab is complete and auto-fillable.</div>';
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
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  root.querySelector('#bcModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='uprod'){ var pr=BC_PRODUCTS.filter(function(x){return x.k===id;})[0]; return pr?{t:pr.ic+' '+pr.n,h:pr.detail}:null; }
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
