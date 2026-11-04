// overviews/tpl.js — company profile for Texas Pacific Land Corporation (NYSE: TPL)
// Built on docs/PROFILE_PLAYBOOK.md (mode A, express run, Nov 2026); build log docs/profiles/TPL.md.
// Code copied from googl.js (itself the AMZN/TSM line), cleaned per the playbook: no inline <style> (the Overview
// classes live in css/overview.css), no brand colours (Summit tokens only; TPL's colour lives in its logo).
//
// DATA STATUS (Nov 4 2026): TPL is NOT in the Summit DCF MCP and NOT in BBG_CONSENSUS.txt yet. So:
//   · everything here is from SEC filings (10-K FY2025, 10-Qs, 8-K Ex. 99.1 releases) or live market data;
//   · no Summit or Street figure is shown anywhere; the units that need them (Estimates, Target Multiple, Submit
//     History, Sensitivity, Street/Summit in Results and Earnings ▸ Setup) are NOT mounted — their scaffolds and the
//     recipe to land the data are in docs/profiles/TPL.md §5 ("Conexiones pendientes / datos por llegar").

import { resultsHtml, initResults } from '../results.js';
import { tplBlGeneralHtml, tplBlGeneralBuild, tplBlSegmentsHtml, tplBlSegmentsBuild } from './tpl-bl.js';   // Bottom Line (BL-GEN-1…5, BL-SEG), copy of uber-bl.js
import { tplCompBody, tplNextGenBody, tplNextGenBuild } from './tpl-misc.js';   // Misc ▸ Competitive Position, Next-Gen Land Use (MISC-comp / MISC-nextgen)
import { tplHistMult } from './tpl-histmult.js';   // Valuation ▸ Historic Multiple (VA-HIST), copy of googl-histmult.js
import { tplCeHtml, tplCeWire, tplCeBuild, tplCePop } from './tpl-ce.js';   // Evolution ▸ Earnings (EV-SET · EV-POST · EV-NOTES), copy of uber-ce.js
import { makeManagement } from './management.js';
import { SUMMIT_CAT } from '../viz-palette.js';
import { TPL_MGMT_DATA } from './tpl-mgmt-data.js';
import { tplOwnBody, tplOwnInit } from './tpl-own.js';
import { tplGovBody } from './tpl-gov.js';
import { tplTrackBody, tplTrackPop } from './tpl-track.js';
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';

// esc: escapes <>" and leaves & literal (same contract as amzn.js / googl.js)
function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// OVERVIEW DATA
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// OV-1 Key Facts (playbook §8). EDGAR: CIK 1811074 files 10-K/10-Q/8-K (domestic). FY2025 10-K (acc. 0001811074-26-000018):
// cover (Delaware; 2699 Howell Street, Dallas); Item 1 (trust organized Feb 1, 1888; corporation since Jan 11, 2021;
// 114 full-time employees at Dec 31, 2025); Item 5 ("We have paid a cash dividend each year for the preceding 69 years").
// Cell 6 "IPO" is replaced by "Structure" (a trust whose certificates traded for decades, not an IPO) — analyst to confirm.
// CEO: Tyler Glover, CEO of the Trust from Nov 2016, President & CEO of the corporation since Jan 11, 2021 (10-K Part III).
var STD_FACTS=[
  ['Listing','NYSE: TPL · NYSE Texas'],
  ['HQ','Dallas, Texas, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1888 (Texas Pacific Land Trust)'],
  ['Structure','Trust 1888 → corporation Jan 2021'],
  ['CEO','Tyler Glover · CEO since Nov 2016'],
  ['Employees','114 · Dec 2025'],
  ['Dividend','Payer · quarterly, 69 years running'],
  ['Market cap','loading live quote…'],
];

// OV-2 lede — paraphrased from the FY2025 10-K Item 1 (General; Land and Resource Management). No segments list, no moat.
var TPL_LEDE='Texas Pacific Land is one of the largest landowners in Texas, with land and oil and gas royalty interests concentrated in the Permian Basin. It does not drill or produce: it collects royalties when operators produce oil and gas under its acreage, and fees when they use its land and water — for pipelines, roads, power lines, water sourcing and disposal. The same land is now also offered to data-center and power-generation projects.';

// OV-3 2×2 (≤ 30 words a cell). "How it earns": FY2025 10-K Item 1 revenue tables; operating margin from the income statement.
var STD_BIZ=[
  ['What it sells','Royalties on oil and gas produced under its land; the right to use its surface (easements, leases, caliche and sand); water for drilling, and the handling of produced water.'],
  ['Who buys it','Permian oil and gas operators (royalties, water, easements); pipeline, utility and midstream companies (easements); water-disposal operators; data-center and power developers.'],
  ['How it earns','FY2025: ~52% oil & gas royalties · ~21% water sales · ~16% produced-water royalties · ~11% easements & surface — at a 74% operating margin.'],
  ['The edge','A Permian land position of a scale no neighbour matches, perpetual royalties that need no drilling capital, and surface that pipelines, water and power projects must cross.'],
];

// OV-4 How TPL makes money — FY2025 10-K, Item 1 segment revenue tables and Note 16 (segment operating income).
//   Land and Resource Management 490,726 + Water Services and Operations 307,464 = 798,190 total revenues ($K).
//   Revenue lines: oil & gas royalties 411,677 · water sales 169,701 · produced water royalties 124,218 ·
//   easements and other surface-related income 91,775 (78,230 LRM + 13,545 WSO) · land sales 819 = 798,190.
// Single geography (all revenue from Texas, principally the Permian Basin), so only the segment view is drawn (§8 ≥2 rule).
var GMM_SEG=[
  ['Land and Resource Management', 61.5, '$490.7M', '61%', null],
  ['Water Services and Operations', 38.5, '$307.5M', '39%', null],
];
var REV_DEFS=[
  { seg:'Land and Resource Management (royalties and the surface)',
    desc:'Manages the land and the <b>oil and gas royalty interests</b> under it. Royalties are a share of what operators produce and sell, with no drilling or operating cost to TPL. The surface earns <b>easements</b> for pipelines, power lines and wellbores, <b>commercial leases</b>, sales of <b>caliche and sand</b>, and the occasional land sale.',
    econ:[['FY2025 revenue','$490.7M · 61% of total'],['Growth','+11% (from $440.8M)'],['Operating income','$394.4M · 80.4% margin'],['Oil and gas royalties','$411.7M · 34.6 MBoe/d at $34.18/Boe realized'],['Easements and other surface-related income','$78.2M'],['Land sales','$0.8M']] },
  { seg:'Water Services and Operations (water for drilling, produced water)',
    desc:'Run through the subsidiary <b>Texas Pacific Water Resources</b>. Sells sourced and treated water to operators for drilling and completions, and earns a <b>royalty on produced water</b> — the salt water that comes up with oil — when it is transported or disposed of on TPL land. Also building produced-water <b>desalination</b>.',
    econ:[['FY2025 revenue','$307.5M · 39% of total'],['Growth','+16% (from $265.0M)'],['Operating income','$197.8M · 64.3% margin'],['Water sales','$169.7M'],['Produced water royalties','$124.2M'],['Easements and other surface-related income','$13.5M']] },
  { seg:'The revenue lines (as the 10-K reports them)',
    desc:'The same total, split by what is sold rather than by segment. Easements and surface income is earned in both segments.',
    econ:[['Oil and gas royalties','$411.7M · 51.6% (+10%)'],['Water sales','$169.7M · 21.3% (+13%)'],['Produced water royalties','$124.2M · 15.6% (+19%)'],['Easements and other surface-related income','$91.8M · 11.5% (+25%)'],['Land sales','$0.8M · 0.1% (−81%)']],
    econNote:'FY2025 10-K, Item 1 segment revenue tables. Growth vs FY2024.' },
];

// OV-5 Products — FY2025 10-K Item 1 (Land and Resource Management; Water Services and Operations; Recent Developments)
// and the 2Q26 release (desalination Phase 2B; Chevron Project Kilby). Descriptive only.
var T_PRODUCTS=[
  { ic:'🛢️', fam:'Oil and gas royalties', d:'A share of Permian production.', items:[
    ['Assigned royalty interests','The 1888 trust\'s perpetual royalties: a 1/128th interest under ~85,000 acres and a 1/16th interest under ~371,000 acres.'],
    ['Acquired royalties','Net royalty acres bought since, mostly in the Midland Basin — including 17,306 NRA in November 2025.'],
    ['Oil, gas and NGL','Paid on what operators sell; no capital or operating cost to TPL.'] ]},
  { ic:'🛤️', fam:'Easements and leases', d:'Rights to cross and use the land.', items:[
    ['Pipeline and utility easements','For oil, gas and water pipelines and power lines; typically 30-plus-year terms that renew every 10 years with a CPI-linked payment.'],
    ['Wellbore easements','Subsurface rights for wells drilled under TPL land.'],
    ['Commercial leases','Processing, storage and compression facilities, and roads.'] ]},
  { ic:'⛏️', fam:'Materials and land', d:'What the land itself supplies.', items:[
    ['Caliche','Used to build oil and gas roads and pads.'],
    ['Sand','Used by operators in well completions.'],
    ['Land sales','Tracts sold when an offer suits; small and irregular.'] ]},
  { ic:'💧', fam:'Water', d:'Water in, produced water out.', items:[
    ['Water sales','Sourced brackish and treated produced water sold for drilling and completions.'],
    ['Produced water royalties','A fee per barrel of produced water transported or disposed of on TPL land.'],
    ['Desalination','A produced-water desalination facility in Orla, Texas; Phase 2B (about 10,000 inlet barrels a day) began commissioning in 2026.'] ]},
  { ic:'⚡', fam:'Next-generation land uses', d:'Power, data centers, renewables.', items:[
    ['Data centers and power','A $50M stake in Bolt Data & Energy (Dec 2025), with a right of first refusal to supply its projects with water; land and brackish water for Chevron\'s Project Kilby power plant serving a data center (2026).'],
    ['Renewables and storage','Solar, wind and grid-connected battery agreements on TPL land.'],
    ['Carbon capture','Agreements to evaluate sequestration on TPL acreage.'] ]},
];

// OV-6 peers (shared with Valuation ▸ Peers). Rule 10: no multiple and no market cap is written here — only the
// DENOMINATORS from each company's FY2025 10-K (SEC EDGAR XBRL, pulled Nov 4 2026); price, market cap and EV are live.
//   epsT   diluted EPS (or net income per LP unit), US$, GAAP
//   ebitdaT US$ M = operating income + DD&A (Dorchester: total revenues − total costs and expenses + DD&A, it tags no
//          operating income). Viper's operating loss includes impairments, so its EBITDA here is understated.
//   nd     US$ M = long-term debt / credit line drawn − cash, at Dec 31 2025
//   gt     FY2025 revenue vs FY2024, % (Viper and LandBridge grew by acquisition: Sitio, 2025; LandBridge's land buys)
// Forward (FY2026, Bloomberg consensus as of Nov 3 2026, Consensus_Portal.xlsm CONSENSUS sheet) exists only for TPL:
// EPS 9.43, comparable EBITDA 871.7, revenue 1,026.7 vs 798.2 reported (+28.6%). The five peers are not in the file.
// Peer set: SAB, 2026-11-04.
var T_PEERS=[
  { tk:'TPL', n:'Texas Pacific Land', hl:true, epsT:6.97, epsF:9.43, ebitdaT:654.7, ebitdaF:871.7, nd:-144.8, gt:13.1, gf:28.6,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Nov 3 2026', why:'The profile company: Permian surface, royalties and water.' },
  { tk:'LB', n:'LandBridge', epsT:0.94, epsF:null, ebitdaT:130.0, ebitdaF:null, nd:540.0, gt:81.1, gf:null,
    src:'10-K FY2025', why:'The closest model: Delaware Basin surface acreage monetised through easements, water and royalties.' },
  { tk:'VNOM', n:'Viper Energy', epsT:-0.48, epsF:null, ebitdaT:467.0, ebitdaF:null, nd:2173.0, gt:62.0, gf:null,
    src:'10-K FY2025', why:'Permian mineral and royalty owner controlled by Diamondback; merged with Sitio Royalties in 2025.' },
  { tk:'BSM', n:'Black Stone Minerals', epsT:1.28, epsF:null, ebitdaT:345.3, ebitdaF:null, nd:152.5, gt:8.4, gf:null,
    src:'10-K FY2025', why:'Large U.S. mineral and royalty partnership, weighted to natural gas.' },
  { tk:'KRP', n:'Kimbell Royalty', epsT:0.62, epsF:null, ebitdaT:257.4, ebitdaF:null, nd:397.5, gt:7.9, gf:null,
    src:'10-K FY2025', why:'Diversified U.S. royalty partnership, a consolidator of small interests.' },
  { tk:'DMLP', n:'Dorchester Minerals', epsT:1.16, epsF:null, ebitdaT:123.7, ebitdaF:null, nd:-41.9, gt:-5.4, gf:null,
    src:'10-K FY2025', why:'Debt-free royalty partnership that pays out nearly all its cash.' },
];

// ═══ Peer map (copied from googl.js stdPeerScatter / gSc*), renamed, with no Alphabet-specific notes ═══
var T_SC={ metric:'pe', basis:'t',   // Trailing by default: only TPL has a Street forward
  peers:null, _capsFetched:false };
function tTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
function tScReset(){ if(!T_SC.peers) T_SC.peers=T_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function tNum(v){ return v!=null && !isNaN(v); }
function tScMult(p){
  if(!tNum(p.px)) return null;
  var f=T_SC.basis==='f';
  if(T_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (tNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!tNum(eb)||eb<=0) return null;
  var ev=tNum(p.ev)?p.ev:(tNum(p.mc)&&tNum(p.nd)?p.mc*1000+p.nd:null);
  return tNum(ev)?ev/eb:null;
}
function tScGrowth(p){ return T_SC.basis==='f'?p.gf:p.gt; }
function tScVisible(){ return (T_SC.peers||[]).filter(function(p){ return p.on && tNum(tScMult(p)) && tNum(tScGrowth(p)); }); }
function tScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function tLogo(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }
function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="tpl-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="tpl-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="tpl-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="tpl-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="tpl-sc-yhi">fast growth</text>'+
    '<g class="tpl-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips tpl-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only listed peers plot here; private Permian landowners and ranches have no market multiple. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures from each company\'s FY2025 10-K (pulled Nov 2026); market caps are live. Forward = Bloomberg consensus FY2026 (as of Nov 3, 2026), on file for TPL only.</span></div>';
  if(sfx==='dd') h+='<div class="rs-collap tpl-sc-collap">'+
      '<button type="button" class="rs-collap-h tpl-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b tpl-sc-tblb"><div class="rs-tablewrap asc-tblwrap"><div class="tpl-sc-tbl"></div></div></div></div>';
  h+='<div class="mg-tip tpl-sc-tip" hidden></div></div>';
  return h;
}
function tScRenderOne(wrap){
  var g=wrap.querySelector('.tpl-sc-nodes'); if(!g||!T_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56, NAVY=tTok('--navy','#1E2733');
  var vis=tScVisible();
  var maxMult=tScNice(Math.max.apply(null, vis.map(tScMult).concat([1]))*1.12);
  var gs=vis.map(tScGrowth), gMax=tScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-tScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.tpl-sc-xlab'); if(lab) lab.textContent=(T_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(T_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.tpl-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.tpl-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===T_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===T_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=tScMult(p), growth=tScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=tNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.9)):11;
    var read=(T_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(tNum(p.mc)?' · market cap '+tFmtMc(p.mc):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-logo="'+esc(tLogo(p))+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?NAVY:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(tLogo(p))+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?NAVY:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  tScChipsOne(wrap); tScTableOne(wrap);
}
function tFmtMc(v){ return tNum(v)?('$'+(v>=1000?(v/1000).toFixed(1)+'B':Math.round(v)+'M')):'—'; }   // p.mc in US$ M
function tMean(a){ return a.length?a.reduce(function(s,v){ return s+v; },0)/a.length:null; }
function tMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function tVsAvg(m, avg){ if(!tNum(m)||!tNum(avg)||avg===0) return '<span class="asc-nilv">—</span>'; var d=(m/avg-1)*100; return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>'; }
function tScTableOne(wrap){
  var box=wrap.querySelector('.tpl-sc-tbl'); if(!box||!T_SC.peers) return;
  var mLab=(T_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(T_SC.basis==='f'?'forward':'trailing');
  var rows=T_SC.peers.map(function(p){ return { p:p, m:tScMult(p), g:tScGrowth(p) }; });
  rows.sort(function(a,b){ var an=tNum(a.m), bn=tNum(b.m); if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m; });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var ms=peers.filter(function(r){ return tNum(r.m); }).map(function(r){ return r.m; });
  var gsx=peers.filter(function(r){ return tNum(r.g); }).map(function(r){ return r.g; });
  var avgM=tMean(ms), medM=tMedian(ms), avgG=tMean(gsx), medG=tMedian(gsx);
  var f1=function(v){ return tNum(v)?v.toFixed(1)+'×':'—'; }, fp=function(v){ return tNum(v)?v.toFixed(1)+'%':'—'; };
  var body=rows.map(function(r){ var p=r.p, nt=tNum(r.m)?'':tScChipNote(p);
    return '<tr class="'+((p.hl?'asc-hl':'')+(tNum(r.m)?'':' asc-nil')).trim()+'"><td><span class="asc-nm"><img src="'+esc(tLogo(p))+'" alt="" onerror="this.style.display=\'none\'"><span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+f1(r.m)+'</td><td>'+fp(r.g)+'</td><td>'+tFmtMc(p.mc)+'</td><td>'+tVsAvg(r.m, avgM)+'</td></tr>'; }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-TPL · '+ms.length+' name'+(ms.length===1?'':'s')+'</span></td><td>'+f1(avgM)+'</td><td>'+fp(avgG)+'</td><td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-TPL</span></td><td>'+f1(medM)+'</td><td>'+fp(medG)+'</td><td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr><th>Peer</th><th>'+mLab+' · '+bLab+'</th><th>Rev growth · '+bLab+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead><tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.tpl-sc-tblh'), bd=wrap.querySelector('.tpl-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden); hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+mLab+' · '+bLab+', '+rows.length+' names</span>'; }
}
function tScChipNote(p){
  if(!tNum(p.epsT)&&!tNum(p.ebitdaT)) return 'no figures on file';
  if(!tNum(p.px)) return 'no live price';
  if(T_SC.basis==='f') return 'trailing only — no Street file';
  if(!tNum(tScMult(p))) return T_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function tScChipsOne(wrap){
  var box=wrap.querySelector('.tpl-sc-chips'); if(!box||!T_SC.peers) return;
  var keep=box.querySelector('.tpl-sc-addtk'), typed=keep?keep.value:'';
  box.innerHTML=T_SC.peers.map(function(p,i){ var nt=tScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('')+
    '<span class="asc-add"><input class="tpl-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="tpl-sc-addbtn">Add</button></span>';
  var inp=box.querySelector('.tpl-sc-addtk'); if(inp) inp.value=typed;
}
function tScRenderAll(root){ root.querySelectorAll('.tpl-sc').forEach(function(w){ tScRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  tScReset();
  root.querySelectorAll('.tpl-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.tpl-sc-tblh'), tblB=wrap.querySelector('.tpl-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; tScTableOne(wrap); };
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ T_SC.basis=btn.getAttribute('data-mgbasis'); tScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ T_SC.metric=btn.getAttribute('data-mgmetric'); tScRenderAll(root); }; });
    var g=wrap.querySelector('.tpl-sc-nodes'), tip=wrap.querySelector('.tpl-sc-tip'), svg=wrap.querySelector('.tpl-sc-svg');
    if(g&&tip){
      var nodeOf=function(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; };
      var show=function(n){ tip.innerHTML='<div class="mgt-h"><img src="'+n.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+n.getAttribute('data-name')+'</span></div>'+n.getAttribute('data-why')+'<div class="mgt-m">'+n.getAttribute('data-read')+'</div>'; tip.hidden=false; };
      var move=function(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; };
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else tip.hidden=true; });
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      if(svg) svg.addEventListener('pointerleave', function(){ tip.hidden=true; });
    }
  });
  tScRenderAll(root); tScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.tpl-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(T_SC.peers[i]){ T_SC.peers.splice(i,1); tScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.tpl-sc-addbtn'), addIn=wrap.querySelector('.tpl-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!T_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=T_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; T_SC.peers.push(o); }
        else T_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; tScRenderAll(root); tLiveOne(root, tk); };
  }
}
function tScFetchCaps(root){ if(T_SC._capsFetched||!T_SC.peers) return; T_SC._capsFetched=true; T_SC.peers.forEach(function(p){ if(p.tk) tLiveOne(root, p.tk); }); }

// Live quote via Massive (api.liveQuote) — market data is always live, never seeded (rule 10).
function tLiveOne(root, tk){ import('../api.js').then(function(m){ return (m&&m.liveQuote)?m.liveQuote(tk):null; }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='TPL') tMcFail(root); return; }
    var mcM=q.marketCap/1e6;
    tScReset();
    (T_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcM; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='TPL'){ var el=root.querySelector('#tplMc'); if(el) el.textContent=tFmtMc(mcM)+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
    tScRenderAll(root);
  }).catch(function(){ if(tk==='TPL') tMcFail(root); }); }
function tMcFail(root){ var el=root.querySelector('#tplMc'); if(el) el.textContent='live quote unavailable'; }

// OV-7 Timeline — strict chronological order; only what the filings and S&P DJI say.
var TIMELINE=[
  { y:'1888', t:'<b>Genesis:</b> Texas Pacific Land Trust is created to hold the lands of the bankrupt Texas and Pacific Railway.',
    d:'<ul class="ov-bullets"><li>Feb 1, 1888 — a Declaration of Trust appoints trustees to receive and hold title to tracts of land in Texas that had belonged to the Texas and Pacific Railway Company (10-K Item 1).</li><li>The trust kept perpetual royalty interests under much of the land it sold over the following century — the "Assigned Royalty Interests" that still pay today.</li></ul>' },
  { y:'2016–17', t:'<b>The modern business begins:</b> Tyler Glover becomes CEO (Nov 2016) and the trust starts its water business.',
    d:'<ul class="ov-bullets"><li>Nov 2016 — Tyler Glover becomes Chief Executive Officer, Co-General Agent and Secretary of the trust (10-K Part III).</li><li>From 2016 the trust widens its strategy "to generate incremental revenue streams" from its land, starting with what became the Water Services and Operations segment, run through Texas Pacific Water Resources (10-K Item 1).</li></ul>' },
  { y:'Jan 2021', t:'<b>From trust to corporation:</b> reorganizes into Texas Pacific Land Corporation, a Delaware company with a board of directors.' },
  { y:'Nov 2024', t:'Joins the <b>S&P 500</b>, replacing Marathon Oil (effective Nov 26, 2024).' },
  { y:'Nov 2025', t:'Largest royalty purchase: <b>17,306 net royalty acres</b> in the Midland Basin for <b>$450.7M</b> in cash.' },
  { y:'Dec 2025', t:'<b>Data centers:</b> $50M minority stake in Bolt Data & Energy, with a right of first refusal to supply water to its projects.',
    d:'<ul class="ov-bullets"><li>Bolt, co-founded and chaired by former Google CEO Eric Schmidt, raised $150M including TPL\'s $50M; TPL received equity, warrants and the water ROFR (10-K Recent Developments).</li><li>The agreement lets TPL contribute land to Bolt for more equity, by mutual agreement.</li><li>2026 — TPL agrees to provide land and brackish water for Chevron\'s Project Kilby, a power plant serving a data center in Reeves County (2Q26 release).</li></ul>' },
];

function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.map(function(p){
    var v=(p[0]==='Market cap')?'<span id="tplMc">'+esc(p[1])+'</span>':esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){ return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>'; }
function gmmBars(arr){
  var o=arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }), rk=[];
  o.forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); });
  return '<div class="ov-mbars gmm-neutral">'+arr.map(function(r,i){ var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div><div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill gmm-g'+rk[i]+'" style="width:'+Math.max(r[1],1.2)+'%">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div><div class="ov-mbar-v">'+esc(r[3])+'</div></div>'; }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 total revenues <b>$798.2M (+13%)</b>, by reportable segment. All of it is earned in Texas, principally the Permian Basin, so there is no geographic split to show.</div>';
  h+=gmmBars(GMM_SEG);
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: operating income <b>$592.2M</b> (74.2% margin) · net income <b>$481.4M</b> · diluted EPS <b>$6.97</b> (after the Dec 2025 3-for-1 split) · free cash flow <b>$498.3M</b>. The royalties carry no drilling or operating cost, which is why so much of revenue reaches profit. '+
    '<span class="ave-subh-note">Source: TPL FY2025 Form 10-K (Item 1 segment revenue tables; Item 7 segment results and non-GAAP reconciliation; Note 16).</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+T_PRODUCTS.map(function(f,i){ return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div><div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>'; }).join('')+'</div>';
}
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; return '<div class="ov-tl-item'+(t.d?' ov-clickable':'')+'"'+(t.d?' data-detail="hist:'+i+'"':'')+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
// OV-F — the Overview's one source footer.
var OV_SOURCES='Sources — Texas Pacific Land FY2025 Form 10-K (SEC EDGAR, filed Feb 18, 2026) for revenue, segment, margin, EPS, acreage, headcount and history; Q2 2026 earnings release (8-K Ex. 99.1, Aug 5, 2026) for the desalination and Project Kilby updates; S&P Dow Jones Indices (Nov 21, 2024) for the S&P 500 addition; SEC EDGAR for filer status. Market cap and peer multiples are live (Massive price ÷ figures from each company\'s FY2025 10-K). Forward figures are Bloomberg consensus (as of Nov 3, 2026), not company guidance; TPL is not yet in the Summit model.';
function stdOverviewBody(){
  var h=stdKeyFacts();
  h+='<p class="ov-lede">'+TPL_LEDE+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How Texas Pacific Land makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Texas Pacific Land', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// Valuation ▸ Peers (VA-PEERS): the OV-6 map with its table open; same T_SC state.
function tplValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, with the numbers behind it; multiples use live prices. TPL is set against the listed U.S. landowners and royalty owners — the only companies with a comparable revenue model.</p>'+
    stdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company\'s FY2025 Form 10-K on SEC EDGAR (XBRL, pulled Nov 4, 2026): diluted EPS or net income per LP unit (GAAP); EBITDA = operating income + DD&amp;A (Dorchester: revenues − costs and expenses + DD&amp;A; Viper\'s operating loss includes impairments); net debt = debt drawn − cash at Dec 31, 2025. Forward = Bloomberg consensus FY2026 (as of Nov 3, 2026) for TPL only; the five peers are not in the consensus file. Price, market cap and EV live (Massive). Peer set: SAB, Nov 4, 2026.</div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var TPL_MGMT = makeManagement(Object.assign({ brand:SUMMIT_CAT[0] }, TPL_MGMT_DATA));   // MG-TEAM (data in ./tpl-mgmt-data.js)
var ROOT_STYLE='--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)';
function html(c){
  return '<div class="ov ov-tpl" data-brand="TPL" style="'+ROOT_STYLE+'">'+stdOverviewBody()+
    '<div class="ov-modal-back" id="tplModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="tplModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="tplModalT"></div><div class="ov-modal-b" id="tplModalB"></div></div></div></div>';
}
function subtabs(group, list, hidden){
  var h='<div class="dd-pane" data-dd="'+group+'"'+(hidden?' hidden':'')+'><div class="ovt-subtabs">';
  list.forEach(function(s,i){ h+='<button type="button" class="ovt-subtab'+(i?'':' active')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; });
  h+='</div>';
  list.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i?' hidden':'')+'>'+s.body+'</div>'; });
  return h+'</div>';
}
// Deep Dive — the Amazon spine. Only sections with something to show are mounted (golden rule 5): Estimates, Target Multiple, Submit History and Sensitivity come with the Summit model.
var SECTIONS=[
  { k:'topline', l:'Top Line' },
  { k:'bottomline', l:'Bottom Line' },
  { k:'evolution', l:'Evolution' },
  { k:'valuation', l:'Valuation' },
  { k:'mgmt', l:'Management' },
  { k:'misc', l:'Miscellaneous' },
];
function deepDiveHtml(c){
  var h='<div class="ov ov-tpl ov-tpl-dd" data-brand="TPL" style="'+ROOT_STYLE+'"><div class="dd-tabs">'+
    SECTIONS.map(function(s,i){ return '<button type="button" class="dd-tab'+(i?'':' active')+'" data-dd="'+s.k+'">'+s.l+'</button>'; }).join('')+'</div>';
  h+=subtabs('topline',[
    { k:'segov', l:'General', body:segmentsOverviewHtml('TPL') },
    { k:'segdrv', l:'Segments', body:segmentsHtml('TPL') },
    { k:'segoth', l:'Other', body:segmentsOtherHtml('TPL') },
    { k:'segcus', l:'Customers', body:segmentsCustomersHtml('TPL') },
  ]);
  h+=subtabs('bottomline',[
    { k:'margins', l:'General', body:tplBlGeneralHtml() },
    { k:'segments', l:'Segments', body:tplBlSegmentsHtml() },
  ], true);
  h+=subtabs('evolution',[
    { k:'earnings', l:'Earnings', body:tplCeHtml(c) },
    { k:'results', l:'Results', body:resultsHtml('TPL') },
  ], true);
  h+=subtabs('valuation',[
    { k:'histmult', l:'Historic Multiple', body:tplHistMult.body() },
    { k:'peers', l:'Peers', body:tplValuationPeersBody() },
  ], true);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:TPL_MGMT.body() },
    { k:'ownership', l:'Ownership', body:tplOwnBody() },
    { k:'governance', l:'Governance & SBC', body:tplGovBody() },
    { k:'track', l:'Track Record', body:tplTrackBody() },
  ], true);
  h+=subtabs('misc',[
    { k:'comp', l:'Competitive Position', body:tplCompBody() },
    { k:'nextgen', l:'Next-Gen Land Use', body:tplNextGenBody() },
  ], true);
  return h+'</div>';
}
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'TPL'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'TPL'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'TPL'); });
    else requestAnimationFrame(function(){ initSegmentsOverview(root, 'TPL'); });
  } else if(group==='bottomline'){
    if(key==='margins') requestAnimationFrame(function(){ tplBlGeneralBuild(root); });
    else if(key==='segments') requestAnimationFrame(function(){ tplBlSegmentsBuild(root); });
  } else if(group==='evolution'){
    if(key==='earnings') tplCeBuild(root);
    else if(key==='results') requestAnimationFrame(function(){ initResults(root.querySelector('.ov-tpl-dd .ovt-subpane[data-ovst="results"] .rs-wrap'), 'TPL'); });
  } else if(group==='valuation'){
    if(key==='histmult') requestAnimationFrame(function(){ tplHistMult.init(root); });
    else if(key==='peers') requestAnimationFrame(function(){ wireScatters(root); });
  } else if(group==='mgmt'){
    if(key==='team') TPL_MGMT.init(root);
    if(key==='ownership') tplOwnInit(root);
  } else if(group==='misc'){
    if(key==='nextgen') tplNextGenBuild(root);
  }
}
function keepPos(el, fn){ var b=el.getBoundingClientRect().top; fn(); var d=el.getBoundingClientRect().top-b; if(Math.abs(d)>1) window.scrollBy(0, d); }
function ddRoot(root){ return root.querySelector('.ov-tpl-dd'); }
function activeSubKey(dd, group){ var pane=dd.querySelector(':scope > .dd-pane[data-dd="'+group+'"]'); if(!pane) return null; var b=pane.querySelector(':scope > .ovt-subtabs > .ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null; }
function wireDD(root){
  var dd=ddRoot(root); if(!dd) return;
  dd.querySelectorAll(':scope > .dd-tabs > .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    keepPos(btn, function(){
      dd.querySelectorAll(':scope > .dd-tabs > .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      dd.querySelectorAll(':scope > .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    });
    var s=activeSubKey(dd, key); if(s) requestAnimationFrame(function(){ buildSub(root, key, s); });
  }; });
  dd.querySelectorAll(':scope > .dd-pane').forEach(function(pane){
    var group=pane.getAttribute('data-dd');
    pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-ovst');
      keepPos(btn, function(){
        pane.querySelectorAll(':scope > .ovt-subtabs > .ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
      });
      requestAnimationFrame(function(){ buildSub(root, group, key); });
    }; });
  });
}

// ═══ Modal (hoisted to #co-detailview) ═══
function wireModal(root){
  var back=root.querySelector('#tplModalBack'), mT=root.querySelector('#tplModalT'), mB=root.querySelector('#tplModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root._tplCloseModal=closeM;
  root.querySelector('#tplModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:esc(t.y),h:t.d}:null; }
    if(kind==='prod'){ var f=T_PRODUCTS[+id]; if(!f) return null;
      return {t:f.ic+' '+esc(f.fam), h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('')}; }
    if(kind==='tpltrk') return tplTrackPop(id);
    if(kind==='ce') return tplCePop(id);   // Earnings detail pop-ups   // Management ▸ Track Record cards
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ if(el._tplDet) return; el._tplDet=true; el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  root.querySelectorAll('.ov-tpl .ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement, open=cc.classList.toggle('open'), b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  root.querySelectorAll('.ov-tpl .acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  wireScatters(root);
  tLiveOne(root, 'TPL');
  var md=root.querySelector('#tplModalBack');
  if(md && md.parentNode!==root){ root.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='tplModalBack') m.remove(); }); root.appendChild(md); }
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root); tplCeWire(root); wireModal(root);
  var dd=ddRoot(root); if(!dd) return;
  var a=dd.querySelector(':scope > .dd-tabs > .dd-tab.active'), g=a?a.getAttribute('data-dd'):'topline', s=activeSubKey(dd, g);
  if(s) requestAnimationFrame(function(){ buildSub(root, g, s); });
}
// Profile header IR + EDGAR tiles (companies.js renders the returned HTML into #co-srcbtns; styles in css/overview.css .cohd-src).
function headerSources(){
  return '<div class="cohd-src">'+
    '<a href="https://www.texaspacific.com/investors" target="_blank" rel="noopener" title="Texas Pacific Land Investor Relations" aria-label="Texas Pacific Land Investor Relations">'+
      '<img src="https://assets.parqet.com/logos/symbol/TPL" alt="TPL logo" onerror="this.style.display=\'none\'"></a>'+
    '<a class="edgar" href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&amp;CIK=0001811074&amp;type=&amp;dateb=&amp;owner=include&amp;count=40" target="_blank" rel="noopener" title="Texas Pacific Land on SEC EDGAR" aria-label="Texas Pacific Land on SEC EDGAR">'+
      '<img src="img/sec-seal.png" alt="SEC seal" onerror="this.style.display=\'none\'"></a></div>';
}
export var tplOverview = { html: html, init: init, headerSources: headerSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
