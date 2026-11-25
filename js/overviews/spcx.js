// overviews/spcx.js — Space Exploration Technologies Corp. (NASDAQ: SPCX)
// Built with docs/PROFILE_PLAYBOOK.md (mode A, express by block — SAB, 2026-11-25). Build log: docs/profiles/SPCX.md.
// Copied from googl.js (the latest profile built with the guide): Overview helpers, peer map, Deep Dive machinery.
//
// Sources: 424B4 prospectus (Jun 12 2026) for FY2023–FY2025 figures, revenue by type, segment and geography (Notes
// to the consolidated financial statements), headcount, incorporation and history; Q3 2026 earnings release
// (Oct 20 2026) for 9M 2026 figures; SpaceX IR for qualitative content. Market data is live (api.liveQuote,
// Massive) — no price, market cap or multiple is written in this file (golden rule 10).
// There is no Summit DCF model for SPCX in the MCP (checked 2026-11-25), so nothing here is a Summit number.

import { spcxMiscHtml, spcxMiscBuild, spcxMiscWire, SPCX_MISC_TABS } from './spcx-misc.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DATA — Overview
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// OV-1 Key Facts. HQ, incorporation (reincorporated as a Texas corporation on Feb 14 2024) and headcount ("over
// 22,000 full-time employees" at Mar 31 2026): 424B4, Business and Description of Capital Stock. Filer: SpaceX files
// 10-Q/8-K on EDGAR (Q2 2026 10-Q, Q3 2026 8-K) — domestic. IPO priced at $135 (Jun 2026). Market cap: live only.
var STD_FACTS=[
  ['Listing','NASDAQ: SPCX'],
  ['HQ','Starbase, Texas, USA'],
  ['Incorporated','Texas, USA · since Feb 2024'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2002 (Elon Musk)'],
  ['IPO','Jun 2026 · NASDAQ, at $135'],
  ['CEO','Elon Musk · founder · CEO since 2002'],
  ['Employees','22,000+ · Mar 2026'],
  ['Dividend','Non-payer · never paid one'],
  ['Market cap','loading live quote…'],
];

// OV-2 lede — 424B4 Business section, paraphrased. No figures, no thesis.
var SPCX_LEDE='SpaceX designs, builds and flies reusable rockets and spacecraft, and runs Starlink, a network of low-Earth-orbit satellites that sells internet access to homes, businesses, airlines, ships, phones and governments. Since combining with xAI in February 2026 it also builds and rents large AI computing clusters and develops the Grok models and the X social platform.';

// OV-3 2×2. "How it earns": 424B4 revenue by type and segment (FY2025) and the Q3 2026 release (9M 2026).
var STD_BIZ=[
  ['What it sells','Launches and human spaceflight; satellite internet (Starlink) for homes, planes, ships and phones; AI computing capacity rented to AI labs; Grok subscriptions and ads on X.'],
  ['Who buys it','Consumers in ~174 markets; airlines, shipping and enterprises; NASA, the U.S. Department of War and other governments; AI developers (Anthropic, Google); advertisers.'],
  ['How it earns','FY2025: ~61% Connectivity · ~22% Space · ~17% AI — but by 9M 2026 compute (SI) was <b>40%</b> of revenue ($10.9B of $27.1B), and Starlink was still the only large profit pool.'],
  ['The edge','Reusable heavy launch at a cost and cadence no one else matches — which is what made Starlink possible — and the same vertical integration applied to satellites and data centers.'],
];

// OV-4 How it makes money — 424B4, Notes: revenue by type and segment; revenue by geography (country of domicile in
// which the transaction originated). Both views reconcile to FY2025 revenue of $18,674M:
//   Space 4,086 + Connectivity 11,387 + AI 3,201 = 18,674
//   USA 12,966 + Ireland 1,827 + Canada 764 + All other 3,117 = 18,674
var GMM_SEG=[
  ['Connectivity (Starlink)', 61.0, '$11.4B', '61%', null],
  ['Space (launch)',          21.9, '$4.1B',  '22%', null],
  ['AI (now "SI")',           17.1, '$3.2B',  '17%', null],
];
var GMM_GEO=[
  ['United States', 69.4, '$13.0B', '69%', null],
  ['Ireland',        9.8, '$1.8B',  '10%', null],
  ['Canada',         4.1, '$0.8B',  '4%',  null],
  ['All other',     16.7, '$3.1B',  '17%', null],
];
var REV_DEFS=[
  { seg:'Connectivity (Starlink — the profit engine)',
    desc:'<b>Starlink</b> internet from thousands of low-orbit satellites: monthly subscriptions for homes and roaming users, plus plans for <b>enterprises, airlines, ships and governments</b>, and the dish (kit) sold up front. Also <b>Starlink Mobile</b>, direct-to-phone service shared with carriers, and <b>Starshield</b>, a separate network for U.S. national security.',
    econ:[['FY2025 revenue','$11.4B · 61% of total'],['Growth','+50% (from $7.6B)'],['Operating income','$4.4B · 38.8% margin'],['Consumer','$7.2B (+49%)'],['Enterprise & government','$4.2B (+51%)'],['Products (kits) inside revenue','$1.5B — all product revenue is in this segment']] },
  { seg:'Space (launch and spacecraft)',
    desc:'<b>Launch services</b> on Falcon 9 and Falcon Heavy for commercial, NASA and military customers, and <b>launch & development</b> work — Dragon cargo and crew missions to the Space Station and development contracts such as Starship for NASA\'s Moon landing. Most launches carry SpaceX\'s own Starlink satellites, which earn no Space revenue.',
    econ:[['FY2025 revenue','$4.1B · 22% of total'],['Growth','+8% (from $3.8B)'],['Operating income','−$0.7B (Starship development spending)'],['Launch services','$2.6B (flat)'],['Launch & development','$1.5B (+25%)'],['Falcon launches','165 in 2025 vs 134 in 2024; customer launches and price per launch roughly flat']] },
  { seg:'AI — renamed Super Intelligence (SI) in 2026',
    desc:'What came with xAI: the <b>Grok</b> models and apps, the <b>X</b> social platform (advertising and subscriptions) and, since 2026, <b>AI computing capacity</b> in the Colossus data centers rented to AI labs on short contracts. Cursor (AI coding) joined in August 2026.',
    econ:[['FY2025 revenue','$3.2B · 17% of total'],['Growth','+22% (from $2.6B)'],['Operating income','−$6.4B'],['Advertising (X)','$1.8B'],['AI solutions & infrastructure','$1.4B'],['9M 2026','$10.9B (+380%), 40% of the group — rented compute ramped from Q2 2026']],
    econNote:'FY2025 is the AI segment as reported in the 424B4; the Q3 2026 release calls it SI (Super Intelligence).' },
  { seg:'The revenue lines (as the prospectus reports them)',
    desc:'The same total, split into the six lines the company discloses.',
    econ:[['Consumer (Starlink)','$7.2B · 38.6% (+49%)'],['Enterprise & government (Starlink)','$4.2B · 22.4% (+51%)'],['Launch services','$2.6B · 13.8% (0%)'],['Advertising (X)','$1.8B · 9.9% (+7%)'],['Launch & development','$1.5B · 8.1% (+25%)'],['AI solutions & infrastructure','$1.4B · 7.3% (+52%)']],
    econNote:'424B4, Note "Revenue disaggregated by type and segment". Growth vs FY2024.' },
];

// OV-5 Products — two tiers (family card → modal). 424B4 Business section and SpaceX product pages, paraphrased.
var S_PRODUCTS=[
  { ic:'🚀', fam:'Launch', d:'Reusable rockets to orbit.', items:[
    ['Falcon 9','The workhorse: reusable first stage, ~620 orbital launches by Mar 2026; most of the world\'s mass to orbit.'],
    ['Falcon Heavy','Three Falcon 9 cores strapped together for heavy and national-security payloads.'],
    ['Starship','Fully reusable two-stage super-heavy rocket. Reached orbit on Flight 14 (Sep 2026); the ship was caught on Flight 15 (Nov 2026).'],
    ['Rideshare','Shared Falcon 9 flights for small satellites.'] ]},
  { ic:'👩‍🚀', fam:'Human spaceflight & cargo', d:'Dragon and Moon missions.', items:[
    ['Crew Dragon','Carries astronauts to the Space Station for NASA and private customers; first private crewed vehicle (May 2020).'],
    ['Cargo Dragon','Resupply missions to the Space Station.'],
    ['Starship for Artemis','The lander NASA picked to return astronauts to the Moon.'],
    ['Starfall','Re-entry capsule that brings payloads back to Earth for in-space research and manufacturing.'] ]},
  { ic:'🛰️', fam:'Starlink broadband', d:'Satellite internet subscriptions.', items:[
    ['Residential & Roam','Home and portable internet plans, plus the dish sold up front.'],
    ['Business','Fixed-site and enterprise plans.'],
    ['Aviation & Maritime','In-flight Wi-Fi for airlines and connectivity for ships.'],
    ['V3 satellites','Next generation launched on Starship, with ~10× the capacity of the current one.'] ]},
  { ic:'📱', fam:'Starlink Mobile', d:'Satellite service to ordinary phones.', items:[
    ['Direct to Cell','Texting and data to unmodified phones, sold through partner carriers.'],
    ['Spectrum','EchoStar AWS-4/H-block (closing expected 2027) and an 800 MHz low-band portfolio (agreed Oct 2026).'],
    ['Starlink Mobile as a carrier','Management aims to become a U.S. mobile carrier, with service targeted for early 2028.'] ]},
  { ic:'🛡️', fam:'Government & defense', d:'Starshield and national-security launch.', items:[
    ['Starshield','A dedicated, more secure satellite network for U.S. government and national-security customers.'],
    ['National Security Space Launch','Military launches on Falcon 9 and Falcon Heavy.'],
    ['Golden Dome programs','Space-based tracking and data-network awards for the missile-defense initiative.'] ]},
  { ic:'🧠', fam:'AI models & apps', d:'Grok, X and Cursor.', items:[
    ['Grok','xAI\'s family of large language models, in the Grok app and inside X.'],
    ['Grok Bot','Paid business assistant for sales, marketing, IT and engineering work.'],
    ['X','The social platform (formerly Twitter): advertising and subscriptions.'],
    ['Cursor','AI coding editor, acquired Aug 2026.'] ]},
  { ic:'🖥️', fam:'Compute infrastructure', d:'AI data centers, rented and owned.', items:[
    ['Colossus','Memphis-area GPU clusters used for Grok training and rented to AI labs.'],
    ['Cloud service agreements','Short-term capacity contracts (cancellable on 90 days\' notice by either side) with Anthropic, Google and Reflection AI.'],
    ['Terafab','Planned in-house chip fabrication.'],
    ['Orbital compute','AI satellites in space — planned, not yet earning revenue.'] ]},
];

// OV-7 Timeline — strict chronology. 424B4 (history, xAI Merger), Q3 2026 release (Cursor), J.P. Morgan Key Investor
// FAQs Nov 2026 (Flight 15 ship catch, Nov 14 2026).
var TIMELINE=[
  { y:'2002', t:'<b>Genesis:</b> Elon Musk founds Space Exploration Technologies to cut the cost of reaching space.' },
  { y:'2008', t:'<b>Falcon 1 reaches orbit</b> and NASA awards the first cargo-resupply contract — the company survives.',
    d:'<ul class="ov-bullets"><li>Sep 2008 — fourth Falcon 1 attempt reaches orbit after three failures.</li><li>Dec 2008 — NASA Commercial Resupply Services contract for the Space Station.</li><li>The contract funded Falcon 9 and Dragon.</li></ul>' },
  { y:'2010–12', t:'<b>Falcon 9</b> first flies (2010); <b>Dragon</b> becomes the first commercial spacecraft to deliver cargo to the Space Station (2012).' },
  { y:'2015–17', t:'<b>Reusability:</b> first Falcon 9 booster landing (Dec 2015), first reflight (2017) — the cost break everything else rests on.' },
  { y:'2019–21', t:'<b>Starlink</b> launches its first batch (2019) and starts service (2020); <b>Crew Dragon</b> flies NASA astronauts (May 2020).',
    d:'<ul class="ov-bullets"><li>2019 — first 60-satellite Starlink batch.</li><li>2020 — Starlink service begins; Demo-2 makes Dragon the first privately built vehicle to carry humans to the Space Station.</li><li>2021 — Starlink exits beta; acquires Swarm Technologies.</li></ul>' },
  { y:'2023–24', t:'<b>Starship</b> flies (2023); first booster catch by the tower\'s "chopsticks" (Oct 2024); reincorporates in <b>Texas</b> (Feb 2024).' },
  { y:'Feb 2026', t:'<b>Combines with xAI</b> (which had absorbed X) — SpaceX becomes an AI company too.',
    d:'<ul class="ov-bullets"><li>2025 — xAI merges with X (the "X Merger").</li><li>Feb 2 2026 — SpaceX acquires xAI (the "xAI Merger"): Grok, X and the Colossus data centers come in.</li><li>Mar 2026 — a $20B bridge loan refinances xAI and X debt.</li></ul>' },
  { y:'Jun 2026', t:'<b>IPO on Nasdaq</b> at $135 — ~$85.7B of net proceeds; a $25B investment-grade bond follows.' },
  { y:'Aug 2026', t:'Acquires <b>Cursor</b> (AI coding) at an implied $60B equity value.' },
  { y:'Sep–Nov 2026', t:'<b>Starship reaches orbit</b> (Flight 14, 26 V3 satellites) and the <b>ship is caught</b> for the first time (Flight 15, Nov 14).' },
];

// ═══ OV-6 peer map (same SP_PEERS / SP_SC feed Valuation ▸ Peers when it is built) — copied from googl.js ═══
// Rule 10: no multiple or market cap is written here — only DENOMINATORS from each company's latest annual report
// (SEC EDGAR) or Bloomberg consensus; price, market cap and EV are live. P/E = price ÷ EPS; EV/EBITDA = EV ÷ EBITDA.
// SpaceX: FY2025 from the 424B4 (EBITDA = operating loss −2,589 + D&A 6,701 = 4,112; net debt = debt 22,896 − cash
// 24,747). Forward = Bloomberg consensus FY2027 (SPCX BBG CONSENSUS.xlsx, Nov 25 2026) because FY2026 is three-quarters
// reported. Amazon: same denominators as the AMZN/GOOGL profiles (10-K FY2025; Bloomberg FY2026, Sep 10 2026).
var SP_PEERS=[
  { tk:'SPCX', n:'SpaceX', hl:true, epsT:-1.69, epsF:4.22, ebitdaT:4112, ebitdaF:119658, nd:-1851, gt:33.2, gf:279.3,
    src:'424B4 (FY2025); forward: Bloomberg consensus FY2027, Nov 25 2026',
    why:'The profile company: launch, Starlink and rented AI compute.' },
  { tk:'AMZN', n:'Amazon', epsT:7.17, epsF:12.66, ebitdaT:145731, ebitdaF:220794, nd:-17974, gt:12.4, gf:15.6,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 10 2026',
    why:'Amazon Leo is the main rival LEO broadband network; AWS competes for AI compute.' },
];

var SP_SC={ metric:'ev', basis:'f', peers:null, _capsFetched:false };
function gTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
function scReset(){ if(!SP_SC.peers) SP_SC.peers=SP_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function scNum(v){ return v!=null && !isNaN(v); }
function scMult(p){
  if(!scNum(p.px)) return null;
  var f=SP_SC.basis==='f';
  if(SP_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (scNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!scNum(eb)||eb<=0) return null;
  var ev=scNum(p.ev)?p.ev:(scNum(p.mc)&&scNum(p.nd)?p.mc*1000+p.nd:null);
  return scNum(ev)?ev/eb:null;
}
function scGrowth(p){ return SP_SC.basis==='f'?p.gf:p.gt; }
function scVisible(){ return (SP_SC.peers||[]).filter(function(p){ return p.on && scNum(scMult(p)) && scNum(scGrowth(p)); }); }
function scNice(v){ var step=v<=20?5:(v<=100?10:(v<=500?50:100)); return Math.ceil(v/step)*step; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="spcx-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill active" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="spcx-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="spcx-sc-xlab">EV/EBITDA · forward</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="spcx-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="spcx-sc-yhi">fast growth</text>'+
    '<g class="spcx-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips spcx-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only listed peers plot here — Blue Origin and the Chinese launch and satellite groups are private or not comparable. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures from each company\'s latest annual report (SEC EDGAR; fiscal years differ where noted on the chip), or Bloomberg consensus where it exists. SpaceX forward = FY2027 consensus (Nov 25 2026), because FY2026 is three-quarters reported; Amazon forward = FY2026 (Sep 10 2026). Market caps are live.</span></div>';
  if(sfx==='dd') h+='<div class="rs-collap spcx-sc-collap">'+
      '<button type="button" class="rs-collap-h spcx-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b spcx-sc-tblb"><div class="rs-tablewrap asc-tblwrap"><div class="spcx-sc-tbl"></div></div></div></div>';
  h+='<div class="mg-tip spcx-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function scRenderOne(wrap){
  var g=wrap.querySelector('.spcx-sc-nodes'); if(!g||!SP_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;
  var NAVY=gTok('--navy','#1E2733');
  var vis=scVisible();
  var maxMult=scNice(Math.max.apply(null, vis.map(scMult).concat([1]))*1.12);
  var gs=vis.map(scGrowth), gMax=scNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-scNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.spcx-sc-xlab'); if(lab) lab.textContent=(SP_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(SP_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.spcx-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.spcx-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===SP_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===SP_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=scMult(p), growth=scGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=scNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=scLogoUrl(p);
    var read=(SP_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(scNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?NAVY:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?NAVY:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  scChipsOne(wrap);
  scTableOne(wrap);
}
function fmtMult(v){ return scNum(v)?v.toFixed(1)+'×':'—'; }
function fmtPct(v){ return scNum(v)?v.toFixed(1)+'%':'—'; }
function fmtMc(v){ return scNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function mean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function median(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function vsAvg(m, avg){
  if(!scNum(m)||!scNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function scTableOne(wrap){
  var box=wrap.querySelector('.spcx-sc-tbl'); if(!box||!SP_SC.peers) return;
  var mLab=(SP_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(SP_SC.basis==='f'?'forward':'trailing');
  var rows=SP_SC.peers.map(function(p){ return { p:p, m:scMult(p), g:scGrowth(p) }; });
  rows.sort(function(a,b){ var an=scNum(a.m), bn=scNum(b.m); if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m; });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var ms=peers.filter(function(r){ return scNum(r.m); }).map(function(r){ return r.m; }), gs=peers.filter(function(r){ return scNum(r.g); }).map(function(r){ return r.g; });
  var avgM=mean(ms), medM=median(ms), avgG=mean(gs), medG=median(gs);
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(scNum(r.m)?'':' asc-nil'), nt=scNum(r.m)?'':chipNote(p);
    return '<tr class="'+cls.trim()+'"><td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'"><span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+fmtMult(r.m)+'</td><td>'+fmtPct(r.g)+'</td><td>'+fmtMc(p.mc)+'</td><td>'+vsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-SpaceX · '+ms.length+' name'+(ms.length===1?'':'s')+'</span></td><td>'+fmtMult(avgM)+'</td><td>'+fmtPct(avgG)+'</td><td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-SpaceX</span></td><td>'+fmtMult(medM)+'</td><td>'+fmtPct(medG)+'</td><td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr><th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th><th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead><tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.spcx-sc-tblh'), bd=wrap.querySelector('.spcx-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden); hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+', '+rows.length+' names</span>'; }
}
function chipNote(p){
  if(!scNum(p.epsT)&&!scNum(p.ebitdaT)&&!scNum(p.epsF)&&!scNum(p.ebitdaF)) return 'no figures on file';
  if(!scNum(p.px)) return 'no live price';
  if(SP_SC.basis==='f' && !scNum(SP_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!scNum(scMult(p))) return SP_SC.metric==='pe'?'no P/E — loss':'no EBITDA — loss';
  return p.chip||'';
}
function scChipsOne(wrap){
  var box=wrap.querySelector('.spcx-sc-chips'); if(!box||!SP_SC.peers) return;
  var keep=box.querySelector('.spcx-sc-addtk'); var typed=keep?keep.value:'';
  var h=SP_SC.peers.map(function(p,i){ var nt=chipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="spcx-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="spcx-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.spcx-sc-addtk'); if(inp) inp.value=typed;
}
function scRenderAll(root){ root.querySelectorAll('.spcx-sc').forEach(function(w){ scRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  scReset();
  root.querySelectorAll('.spcx-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.spcx-sc-tblh'), tblB=wrap.querySelector('.spcx-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; scTableOne(wrap); };
    var g=wrap.querySelector('.spcx-sc-nodes'), tip=wrap.querySelector('.spcx-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ SP_SC.basis=btn.getAttribute('data-mgbasis'); scRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ SP_SC.metric=btn.getAttribute('data-mgmetric'); scRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.spcx-sc-svg');
      var nodeOf=function(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; };
      var show=function(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; };
      var move=function(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; };
      var hide=function(){ tip.hidden=true; };
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  scRenderAll(root); scFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.spcx-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(SP_SC.peers[i]){ SP_SC.peers.splice(i,1); scRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.spcx-sc-addbtn'), addIn=wrap.querySelector('.spcx-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!SP_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=SP_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; SP_SC.peers.push(o); }
        else SP_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; scRenderAll(root); liveOne(root, tk); };
  }
}
function scFetchCaps(root){ if(SP_SC._capsFetched||!SP_SC.peers) return; SP_SC._capsFetched=true; SP_SC.peers.forEach(function(p){ if(p.tk) liveOne(root, p.tk); }); }

// Live quote via Massive (api.liveQuote) — the only source of price and market cap. SPCX's quote also feeds the
// Miscellaneous model (current price for the scenario valuation) through spcxMiscWire's price hook.
var _pxHooks=[], _lastQ=null;
export function onSpcxPrice(fn){ _pxHooks.length=0; _pxHooks.push(fn); if(_lastQ) fn(_lastQ); }   // one consumer (the Misc model); replays the last quote
function liveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='SPCX') mcFail(root); return; }
    var mcB=q.marketCap/1e9;
    scReset();
    (SP_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='SPCX'){ var el=document.querySelector('#spcxMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      _lastQ=q; _pxHooks.forEach(function(fn){ try{ fn(q); }catch(e){ console.error('[spcx price hook]', e); } }); }
    scRenderAll(root);
  }).catch(function(){ if(tk==='SPCX') mcFail(root); }); }
function mcFail(root){ var el=document.querySelector('#spcxMc'); if(el) el.textContent='live quote unavailable'; }

// ═══ Standardized Overview body ═════════════════════════════════════════════════════════════════
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.map(function(p){
    var v=p[0]==='Market cap'?'<span id="spcxMc">'+esc(p[1])+'</span>':esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
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
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 revenue <b>$18.7B (+33%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b> (the country where the sale originated). Both reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Segments</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: operating loss <b>−$2.6B</b> · net loss <b>−$4.9B</b> · diluted EPS <b>−$1.69</b>. Starlink earned <b>$4.4B</b> of operating income; AI lost $6.4B and Space $0.7B. In 9M 2026 revenue was $27.1B (+97%) and the group turned an operating profit of $0.7B. '+
    '<span class="ave-subh-note">Source: 424B4 prospectus (Jun 12 2026) — Notes: revenue by type and segment, revenue by geography, segment information; Q3 2026 earnings release for 9M 2026.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+S_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
var OV_SOURCES='Sources — SpaceX 424B4 prospectus (SEC EDGAR, Jun 12 2026) for FY2023–FY2025 revenue by type, segment and geography, segment results, headcount, incorporation and history; Q3 2026 earnings release (Oct 20 2026) for nine-month 2026 figures; SpaceX IR and product pages for qualitative content; J.P. Morgan Key Investor FAQs (Nov 2026) for the Flight 15 ship catch; SEC EDGAR for filer status. Market cap and peer multiples are live (Massive price ÷ figures from each company\'s latest annual report, or Bloomberg consensus as of Nov 2026). Forward figures are estimates, not company guidance.';
function stdOverviewBody(){
  var h=stdKeyFacts();
  h+='<p class="ov-lede">'+SPCX_LEDE+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How SpaceX makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s SpaceX', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function html(c){
  var h='<div class="ov ov-spcx" data-brand="SPCX" style="--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+=stdOverviewBody();
  h+='<div class="ov-modal-back" id="spcxModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="spcxModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="spcxModalT"></div><div class="ov-modal-b" id="spcxModalB"></div></div></div>';
  h+='</div>';
  return h;
}
function subtabs(group, list, hidden){
  var h='<div class="dd-pane" data-dd="'+group+'"'+(hidden?' hidden':'')+'><div class="ovt-subtabs">';
  list.forEach(function(s,i){ h+='<button type="button" class="ovt-subtab'+(i?'':' active')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; });
  h+='</div>';
  list.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i?' hidden':'')+'>'+s.body+'</div>'; });
  return h+'</div>';
}
// Deep Dive — the Amazon spine. Sections appear as their first unit is built (golden rule 5): today only
// Miscellaneous (block 2, the research model). Top Line, Bottom Line, Evolution, Valuation, Management follow.
function deepDiveHtml(c){
  var h='<div class="ov ov-spcx ov-spcx-dd" data-brand="SPCX" style="--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="misc">Miscellaneous</button>'+
    '</div>';
  h+=subtabs('misc', SPCX_MISC_TABS.map(function(t){ return { k:t.k, l:t.l, body:spcxMiscHtml(t.k) }; }), false);
  h+='</div>';
  return h;
}

function buildSub(root, group, key){
  if(group==='misc') requestAnimationFrame(function(){ spcxMiscBuild(root, key); });
}
function keepPos(el, fn){ var before=el.getBoundingClientRect().top; fn(); var d=el.getBoundingClientRect().top-before; if(Math.abs(d)>1) window.scrollBy(0, d); }
function activeSubKey(root, group){ var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null; var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null; }
function showSub(root, pane, group, key){
  var btn=pane.querySelector('.ovt-subtab[data-ovst="'+key+'"]');
  keepPos(btn||pane, function(){
    pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
    pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){ var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return; pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; }); }
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.ov-spcx-dd .dd-tab.active'); return b?b.getAttribute('data-dd'):'misc'; }
function showDD(root, key){
  var btn=root.querySelector('.dd-tab[data-dd="'+key+'"]');
  keepPos(btn||root, function(){
    root.querySelectorAll('.ov-spcx-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
    root.querySelectorAll('.ov-spcx-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.ov-spcx-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

function wireModal(root){
  var back=root.querySelector('#spcxModalBack'), mT=root.querySelector('#spcxModalT'), mB=root.querySelector('#spcxModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#spcxModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=S_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ if(el._spDetail) return; el._spDetail=true; el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  root.querySelectorAll('.ov-spcx .ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  root.querySelectorAll('.ov-spcx .acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  root.querySelectorAll('.ov-spcx .mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.ov-spcx .mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-spcx .gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  wireScatters(root);
  liveOne(root, 'SPCX');
  var md=root.querySelector('#spcxModalBack');
  root.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='spcxModalBack') m.remove(); });
  if(md && md.parentNode!==root) root.appendChild(md);
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root); wireSubtabs(root,'misc'); wireModal(root);
  spcxMiscWire(root, onSpcxPrice);
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}
export var spcxOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
