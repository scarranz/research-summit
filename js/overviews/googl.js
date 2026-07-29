// overviews/googl.js — standardized Overview for Alphabet Inc. (NASDAQ: GOOGL / GOOG)
// Follows docs/OVERVIEW_CONVENTIONS.md and mirrors the standardized profile contract (uber.js /
// ibkr.js): a hooked Overview (Key Facts + lede + 2x2 quad + collapsibles) and a 5-tab Deep Dive
// spine (Top Line / Bottom Line / Evolution / Valuation / Management), each with ovt-subtabs.
//
// STATUS: Overview filled; Deep Dive is a staged scaffold (sections fill one by one) EXCEPT
// Evolution ▸ Earnings, which is live for the Q2 2026 cycle (reports Jul 22, 2026 after close).
//
// Sources: Alphabet Q4/FY2025 earnings release (SEC EDGAR, Ex-99.1, Feb 2026) for all FY2025
// figures; FY sub-splits derived from the four quarterly releases (labeled approximate); company
// IR / 10-K for qualitative content. Live market cap via api.liveQuote (Massive). Peer multiples
// are seeded approximations (mid-2026), labeled — never presented as live.

import { makeManagement } from './management.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode it) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: the Google four-color palette ───────────────────────────────────────────────────────
var BRAND='#4285F4', BRAND2='#34A853', RED='#EA4335', YELLOW='#FBBC05', GRAY='#9AA4B0', BLUE='#1A73E8', PURPLE='#7A5AF8', AMBER='#B7791F';

// ─── Render helpers ─────────────────────────────────────────────────────────────────────────────
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DATA — Overview
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5 columns × 2 rows), canonical set. Filer status verified on EDGAR
// (CIK 1652044 files 10-K/10-Q/8-K — domestic).
var STD_FACTS=[
  ['Listing','NASDAQ: GOOGL / GOOG'],
  ['HQ','Mountain View, CA, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1998 (Page & Brin)'],
  ['IPO','Aug 2004 · Dutch auction'],
  ['CEO','Sundar Pichai · Google 2015 · Alphabet 2019'],
  ['Employees','190,820 · Dec 2025'],
  ['Dividend','Payer · first ever in 2024'],
  ['Market cap','live'],
];

var UB_LEDE='Alphabet is the holding company of Google, created in a 2015 restructuring. Its platforms — Search, YouTube, Android, Chrome, Maps, Play, the Gemini AI models and Google Cloud — reach billions of users and millions of enterprises worldwide. The company remains founder-controlled through super-voting Class B shares, and since 2023 has been reorganizing every product around its own AI stack, from self-designed TPU chips to the Gemini models that now run inside Search itself.';

// 2x2 quadrant (each cell ≤ ~30 words)
var STD_BIZ=[
  ['What it sells','Attention and answers at global scale — search, video, maps, mobile OS — monetized with ads; plus cloud/AI computing for enterprises and consumer subscriptions.'],
  ['Who buys it','Advertisers (the core); enterprises & developers (Google Cloud); consumers (subscriptions, devices, app purchases); OEMs distributing Android.'],
  ['How it earns','FY2025: ~73% advertising (Search · YouTube · Network) · ~15% Google Cloud · ~12% subscriptions, platforms & devices.'],
  ['The edge','Unmatched distribution (multiple billion-user products), the ad-auction data flywheel, and a full-stack AI position: own TPUs → Gemini models → billions of users.'],
];

// How it makes money — FY2025 total revenues $402.8B (+15%), per the Q4/FY2025 release (SEC).
// Two views of the SAME total (they must and do reconcile): segments and geography.
// Segments: Services $342.7B · Cloud $58.7B · Other Bets ~$1.5B · hedging −$0.1B = $402.8B.
// Geography: US $194.2B · EMEA $117.2B · APAC $67.7B · Other Americas $23.9B · hedging = $402.8B.
var GMM_SEG=[
  ['Google Services', 85, '$342.7B', '85%', BRAND],
  ['Google Cloud', 15, '$58.7B', '15%', BRAND2],
  ['Other Bets', 1.2, '~$1.5B', '<1%', YELLOW],
];
var GMM_GEO=[
  ['United States', 48, '$194.2B', '48%', BRAND],
  ['EMEA', 29, '$117.2B', '29%', BRAND2],
  ['APAC', 17, '$67.7B', '17%', YELLOW],
  ['Other Americas', 6, '$23.9B', '6%', RED],
];
var REV_DEFS=[
  { seg:'Google Services (the core)',
    desc:'Everything consumer-facing: <b>advertising</b> sold on Google Search, YouTube and partner sites/apps (Google Network), plus <b>subscriptions, platforms and devices</b> — Google One, YouTube Premium & TV, Play Store fees and Pixel hardware. Advertising is priced largely through real-time auctions.',
    econ:[['Search & other','~$224B'],['YouTube ads','~$40B'],['Subscriptions, platforms & devices','~$48B'],['Google Network','~$30B'],['FY2025 segment total','$342.7B (+12%)']],
    econNote:'Sub-splits derived from the four FY2025 quarterly releases — approximate; segment total reconciles to the reported FY figure.' },
  { seg:'Google Cloud',
    desc:'Infrastructure and platform services for enterprises: <b>Google Cloud Platform</b> (compute, storage, and AI infrastructure — including Alphabet\'s own TPU chips — plus Vertex AI and Gemini for business), and <b>Google Workspace</b> (Gmail, Docs, Meet for organizations). Earns consumption-based fees and subscriptions.',
    econ:[['FY2025 revenue','$58.7B (+36%)'],['Exit run-rate','>$70B (Q4 2025 annualized)'],['Q4 2025 growth','+48% YoY — accelerating on AI demand']] },
  { seg:'Other Bets',
    desc:'A portfolio of earlier-stage businesses outside Google — most prominently <b>Waymo</b> (autonomous ride-hailing) plus Verily (health), Wing (drone delivery) and other ventures. Revenues come primarily from autonomous transportation and internet services.',
    econ:[['FY2025 revenue','~$1.5B'],['Scale','<1% of Alphabet revenue — option value, not an earnings driver today']] },
];

// Products — two tiers: family card → pop-up with the specific products (key = prod:i).
var G_PRODUCTS=[
  { ic:'🔍', fam:'Search & assistant', d:'The front door of the internet.', items:[
    ['Google Search','The core product — answers, now increasingly AI-generated, for billions of daily queries.'],
    ['AI Overviews & AI Mode','Generative-AI answers inside Search itself — the biggest change to the product since its launch.'],
    ['Gemini app','The standalone AI assistant (mobile + web), Alphabet\'s consumer counterpart to ChatGPT.'],
    ['Maps & Lens','Local search, navigation and visual search — major query surfaces in their own right.'] ]},
  { ic:'📺', fam:'YouTube', d:'Video: ads + subscriptions.', items:[
    ['YouTube ads','In-stream and Shorts advertising across the world\'s largest video platform.'],
    ['Shorts','Short-form video — the TikTok answer, now monetizing at scale.'],
    ['YouTube Premium & Music','Ad-free viewing and music subscriptions.'],
    ['YouTube TV & Sunday Ticket','Live-TV bundle (US) plus exclusive NFL Sunday Ticket rights.'] ]},
  { ic:'🤖', fam:'Android, Chrome & Play', d:'The distribution layer.', items:[
    ['Android','The world\'s most-used mobile OS — licensed free; its role is distributing Google services (Search, Play) onto billions of devices.'],
    ['Google Play','App and content store — Alphabet\'s cut of app purchases and subscriptions.'],
    ['Chrome','The dominant desktop/mobile browser; another default-search distribution channel.'] ]},
  { ic:'☁️', fam:'Google Cloud', d:'Enterprise compute & AI.', items:[
    ['Google Cloud Platform (GCP)','Compute, storage, data and networking for enterprises — with AI infrastructure the fastest-growing piece.'],
    ['Vertex AI & Gemini for enterprise','The platform where businesses build on Alphabet\'s models.'],
    ['Workspace','Gmail, Docs, Drive, Meet for organizations — subscription seats.'],
    ['Security','Mandiant threat intelligence; the pending <b>Wiz</b> acquisition (agreed 2025, ~$32B) would make security a pillar.'] ]},
  { ic:'🧠', fam:'AI models & silicon', d:'The full-stack AI position.', items:[
    ['Gemini models','Alphabet\'s frontier model family — powering Search AI, the Gemini app, Cloud and Workspace.'],
    ['Google DeepMind','The consolidated research arm (AlphaFold, and the research behind the Transformer architecture modern AI is built on).'],
    ['TPUs','Self-designed AI accelerator chips — Alphabet trains and serves its models on its own silicon, a structural cost/supply edge.'],
    ['Gemma','Open-weight model family for developers.'] ]},
  { ic:'📢', fam:'Ads platforms', d:'The machinery advertisers use.', items:[
    ['Google Ads','Self-serve auction buying across Search, YouTube, Maps and partners.'],
    ['Ad Manager · AdSense · AdMob','The sell-side: monetization tools for publishers and app developers (the Google Network business).'],
    ['Display & Video 360','Enterprise media-buying for large advertisers and agencies.'] ]},
  { ic:'💳', fam:'Subscriptions & devices', d:'The growing non-ads consumer layer.', items:[
    ['Google One','Storage + AI-feature subscription; one of the fastest-growing subscription lines.'],
    ['Pixel','Phones, watches and earbuds — Alphabet\'s own hardware showcase for Android + Gemini.'],
    ['Nest & Fitbit','Smart home and wearables.'] ]},
  { ic:'🚗', fam:'Other Bets', d:'Waymo and the moonshots.', items:[
    ['Waymo','Autonomous ride-hailing, live in multiple US cities and scaling paid rides — the most valuable Bet. Still a small revenue contributor relative to Alphabet (<1% of group revenue).'],
    ['Wing','Drone delivery.'],
    ['Verily','Life sciences / health data.'],
    ['X','The "moonshot factory" incubator.'] ]},
];

// Timeline — corporate lineage per the conventions rubric (genesis, inflections, material M&A,
// the one defining legal matter, latest $T milestone only). Depth in Read More pop-ups (hist:i).
var TIMELINE=[
  { y:'1996–98', t:'<b>Genesis:</b> Stanford PhD students Larry Page & Sergey Brin build "BackRub" → incorporate <b>Google Inc.</b> (Sep 1998).',
    d:'<ul class="ov-bullets"><li>1996 — Page & Brin build <b>BackRub</b> at Stanford: ranking pages by their inbound links (<b>PageRank</b>) instead of keyword counts.</li><li>Aug 1998 — Andy Bechtolsheim (Sun co-founder) writes a <b>$100k check to "Google Inc." before the company exists</b>.</li><li>Sep 1998 — incorporated; first office is Susan Wojcicki\'s garage in Menlo Park.</li><li>Organically the same core company today — no spin-off or reverse merger; the 2015 Alphabet restructuring (below) is a holding-company reorganization, not a change of lineage.</li></ul>' },
  { y:'2000–03', t:'<b>The earning model arrives:</b> AdWords (2000) then AdSense (2003) — auction-priced ads turn search into a business.',
    d:'<ul class="ov-bullets"><li>2000 — <b>AdWords</b> launches: advertisers bid in real-time auctions to appear against queries. The business-model inflection that made Google Google.</li><li>2002 — pay-per-click + auction pricing refined (influenced by Overture\'s model, later litigated and settled with a stock payment to Yahoo).</li><li>2003 — <b>AdSense</b> extends the auction to third-party sites: the beginning of today\'s Google Network.</li></ul>' },
  { y:'Aug 2004', t:'<b>IPO</b> on NASDAQ — an unusual <b>Dutch-auction</b> offering, with a dual-class structure preserving founder control.',
    d:'<ul class="ov-bullets"><li>Priced at $85 via an open Dutch auction (retail investors could bid) — a deliberate break with Wall Street bookbuilding.</li><li><b>Dual-class from day one:</b> Class B shares (10 votes, founders/insiders) vs Class A (1 vote). A third class (C, no votes — today\'s GOOG) was added in 2014.</li><li>Founders\' letter: "Google is not a conventional company. We do not intend to become one."</li></ul>' },
  { y:'2005–06', t:'The two defining acquisitions: <b>Android</b> (~$50M, 2005) and <b>YouTube</b> ($1.65B, 2006).',
    d:'<ul class="ov-bullets"><li><b>Android (2005, ~$50M)</b> — a tiny startup buy that became the world\'s dominant mobile OS and Google\'s distribution moat in the smartphone era.</li><li><b>YouTube (2006, $1.65B in stock)</b> — widely questioned at the time; by FY2025 YouTube ads alone are ~$40B/yr and YouTube ads + subscriptions exceed <b>$60B/yr</b> (company disclosure).</li></ul>' },
  { y:'2007', t:'<b>DoubleClick</b> acquired ($3.1B) — the ad-serving stack behind today\'s Network / publisher business.' },
  { y:'2012–14', t:'<b>Motorola Mobility:</b> bought for $12.5B, sold to Lenovo for $2.9B — the failed hardware bet; kept the patents.',
    d:'<ul class="ov-bullets"><li>2012 — acquires Motorola Mobility for <b>$12.5B</b>, largely for its patent portfolio during the smartphone patent wars.</li><li>2014 — sells the handset business to Lenovo for <b>$2.91B</b>, retaining most patents.</li><li>The clearest fiasco in the M&A record — and the reason later hardware efforts (Pixel) were built in-house instead.</li></ul>' },
  { y:'2014–16', t:'<b>The AI turn:</b> DeepMind acquired (2014) · "AI-first" declared (2016) · first in-house <b>TPU</b> chip.',
    d:'<ul class="ov-bullets"><li>2014 — acquires London-based <b>DeepMind</b> (~$500M+).</li><li>2016 — Pichai declares Google an <b>"AI-first"</b> company; first <b>TPU</b> (self-designed AI chip) revealed.</li><li>2017 — Google researchers publish the <b>Transformer</b> paper ("Attention Is All You Need") — the architecture underlying essentially all modern generative AI.</li></ul>' },
  { y:'2015', t:'<b>Alphabet restructuring</b> — Google reorganizes under a new holding company; <b>Sundar Pichai becomes CEO of Google</b>.',
    d:'<ul class="ov-bullets"><li>Google creates <b>Alphabet Inc.</b> as parent, separating core Google from the "Other Bets" (Waymo, Verily, etc.).</li><li>Goal: capital discipline and reporting transparency — the Bets\' losses become visible instead of buried in Google\'s P&L.</li><li>Page & Brin move up to Alphabet; <b>Pichai takes over Google</b>.</li></ul>' },
  { y:'2019', t:'<b>Pichai becomes CEO of Alphabet</b> — the founders step back from operations but keep voting control.' },
  { y:'2023–25', t:'<b>The Gemini era:</b> generative AI goes <i>into</i> Search itself (AI Overviews → AI Mode) on Alphabet\'s own models and TPUs.',
    d:'<ul class="ov-bullets"><li>2023 — Bard launches (the rushed ChatGPT answer); DeepMind + Google Brain merge into <b>Google DeepMind</b>; <b>Gemini</b> models ship at year-end.</li><li>2024–25 — <b>AI Overviews</b> then <b>AI Mode</b> roll into Search: the second business-model inflection in the company\'s history, this time <i>inside</i> the core earning engine.</li><li>The differentiator vs. rivals: a <b>full stack</b> — own TPUs (7 generations) → own frontier models → distribution across billions of users.</li></ul>' },
  { y:'Apr 2024', t:'<b>First-ever dividend</b> declared ($0.20/qtr) — a coming-of-age signal, 26 years in.' },
  { y:'2024–25', t:'<b>US v. Google:</b> search ruled an illegal monopoly (Aug 2024); remedies land Sep 2025 — <b>no Chrome divestiture</b>.',
    d:'<ul class="ov-bullets"><li>Aug 2024 — Judge Mehta rules Google <b>illegally maintained its search monopoly</b> (the defining legal matter in company history).</li><li>Sep 2025 — remedies: Google <b>keeps Chrome and Android</b>; default-placement payments (e.g. to Apple) survive with restrictions (non-exclusive, annually renegotiable); Google must share certain search data with qualified competitors.</li><li>Net: far lighter than the breakup scenarios the market had priced. A separate ad-tech case proceeds on its own track.</li></ul>' },
  { y:'2025', t:'<b>Wiz</b> agreed (~$32B, cloud security) — the <b>largest acquisition in company history</b>, subject to regulatory review.' },
  { y:'Sep 2025', t:'Crosses <b>$3 trillion</b> in market cap (the latest trillion-dollar milestone).' },
];

// ─── Peers scatter — big-tech map. Toggles: metric (P/E ⇄ EV/EBITDA — never P/S) × basis
// (Forward ⇄ Trailing, default Forward). Bubble = LIVE market cap (Massive). Multiples/growth are
// seeded approximations (mid-2026), labeled — replaced by live/model values when confirmed. ──────
var G_PEERS=[
  { tk:'GOOGL', n:'Alphabet', peT:27, peF:23, evT:20, evF:16, gt:15, gf:13, mc:2900, hl:true,
    why:'The cheapest of the mega-cap platforms on nearly every multiple — the market\'s open question is whether AI disrupts or compounds the search franchise.' },
  { tk:'MSFT', n:'Microsoft', peT:37, peF:32, evT:25, evF:22, gt:15, gf:14, mc:3900,
    why:'The enterprise-software + Azure giant and OpenAI\'s partner. Similar growth to Alphabet, materially richer multiple — the premium is for perceived AI certainty.' },
  { tk:'AAPL', n:'Apple', peT:32, peF:29, evT:24, evF:22, gt:6, gf:6, mc:3300,
    why:'Slowest grower on the map yet still premium-priced — the ecosystem/buyback machine. Also Alphabet\'s single biggest distribution partner (default-search deal).' },
  { tk:'AMZN', n:'Amazon', peT:36, peF:31, evT:19, evF:16, gt:11, gf:11, mc:2400,
    why:'AWS is the cloud share leader Alphabet chases; retail depresses the blended margin. The #3 player in digital ads and a genuine rival on AI infrastructure.' },
  { tk:'META', n:'Meta', peT:28, peF:24, evT:18, evF:15, gt:17, gf:15, mc:1900,
    why:'The other ad duopolist — faster ad growth than Google, no cloud business, and the same open-source-AI capex debate. The purest ads comparable.' },
];
var G_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };
function gScReset(){ if(!G_SC.peers) G_SC.peers=G_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function gScMult(p){ var key=(G_SC.metric==='pe'?'pe':'ev')+(G_SC.basis==='f'?'F':'T'); return p[key]; }
function gScMax(){ return G_SC.metric==='pe'?45:30; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.gsc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.gsc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.gsc-chip .x{color:var(--mu);font-weight:800}'+
    '.gsc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.gsc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.gsc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#8AB4F8}</style>';
  h+='<div class="googl-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Big-tech peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="googl-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="googl-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="googl-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="gsc-chips googl-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here — private AI rivals (OpenAI, Anthropic) have no market multiple and appear in the qualitative competitive map instead. <span class="ave-subh-note">Multiples & growth are seeded approximations (mid-2026); market caps are live.</span></div>';
  h+='<div class="mg-tip googl-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function gScRenderOne(wrap){
  var g=wrap.querySelector('.googl-sc-nodes'); if(!g||!G_SC.peers) return;
  var maxMult=gScMax(), X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.googl-sc-xlab'); if(lab) lab.textContent=(G_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(G_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===G_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===G_SC.metric); });
  var frag='';
  G_SC.peers.forEach(function(p){
    if(!p.on) return; var m=gScMult(p); if(m==null||isNaN(m)) return;
    var growth=G_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/25))*(Y0-Y1);
    var r=Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32));
    var logo=scLogoUrl(p);
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function gScChipsOne(wrap){
  var box=wrap.querySelector('.googl-sc-chips'); if(!box||!G_SC.peers) return;
  var h=G_SC.peers.map(function(p,i){ return '<span class="gsc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="gsc-add"><input class="googl-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="googl-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function gScRenderAll(root){ root.querySelectorAll('.googl-sc').forEach(gScRenderOne); }
function gScChipsAll(root){ root.querySelectorAll('.googl-sc').forEach(function(w){ gScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  gScReset();
  root.querySelectorAll('.googl-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var g=wrap.querySelector('.googl-sc-nodes'), tip=wrap.querySelector('.googl-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ G_SC.basis=btn.getAttribute('data-mgbasis'); gScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ G_SC.metric=btn.getAttribute('data-mgmetric'); gScRenderAll(root); }; });
    // Tooltips delegated on the stable nodes container — never reparent a node mid-hover.
    if(g&&tip){
      var svg=wrap.querySelector('.googl-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  gScRenderAll(root); gScChipsAll(root); gScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.googl-sc-chips .gsc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(G_SC.peers[i]){ G_SC.peers.splice(i,1); gScRenderAll(root); gScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.googl-sc-addbtn'), addIn=wrap.querySelector('.googl-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!G_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=G_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; G_SC.peers.push(o); }
      else G_SC.peers.push({ tk:tk, n:tk, on:true, mc:100, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
    }
    addIn.value=''; gScRenderAll(root); gScChipsAll(root); gLiveOne(root, tk); }; }
}
// Live market cap (Key Facts cell + peer bubbles) via Massive (api.liveQuote). Degrades gracefully.
function gLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; G_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='GOOGL'){ var el=root.querySelector('#googlMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } if(tk==='GOOGL'&&q.price!=null){ SENS.price=q.price; renderSens(root); } gScRenderAll(root); }).catch(function(){}); }
function gScFetchCaps(root){ if(G_SC._capsFetched||!G_SC.peers) return; G_SC._capsFetched=true; G_SC.peers.forEach(function(p){ if(p.tk) gLiveOne(root, p.tk); }); }

function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ═══ Standardized Overview body ═════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="googlMc">'+esc(p[1])+'</span>'; }
    else v=esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function gmmBars(arr){
  return '<div class="ov-mbars">'+arr.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(r[1],1.2)+'%;background:'+r[4]+';">'+esc(r[2])+'</div></div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">FY2025 total revenues <b>$402.8B (+15%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b>. Both reconcile to the reported figure (hedging −$0.1B).</div>';
  h+='<div class="mg-tog-row" style="display:flex;gap:14px;margin:2px 0 8px"><span class="mg-tog" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)">View: <span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px"><button type="button" class="mg-pill active" data-gmm="seg" style="border:none;background:var(--navy);color:#fff;font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Segments</button><button type="button" class="mg-pill" data-gmm="geo" style="border:none;background:transparent;color:var(--mu);font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note" style="margin-top:6px">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025: operating income <b>$129.0B (32% margin)</b> · net income <b>$132.2B</b> · diluted EPS <b>$10.81</b>. <span class="ave-subh-note">Source: Alphabet Q4/FY2025 earnings release (SEC). Services sub-splits derived from the quarterly releases — approximate.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+G_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
var OV_SOURCES='Sources — Alphabet Q4/FY2025 earnings release (SEC EDGAR, Ex-99.1) for all FY2025 revenue, segment, geographic, margin, EPS and headcount figures; Alphabet 10-K and IR for qualitative content and the product taxonomy; SEC filing history for filer status. Market cap and peer bubbles are live (Massive); peer multiples & growth are seeded approximations (mid-2026), directional. Forward figures are estimates, not company guidance.';
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+BRAND+';border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.gdd-empty{border:1px dashed var(--bdr);border-radius:12px;padding:34px 20px;text-align:center;color:var(--mu);font-size:12.5px;background:var(--w)}'+
    /* deep-dive shared components */
    '.gdd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}'+
    '.gdd-kpi{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:10px;padding:10px 12px;background:var(--w);text-align:center}'+
    '.gdd-kpi-v{font-size:16px;font-weight:800;color:var(--navy);line-height:1.15}.gdd-kpi-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.gdd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}'+
    '.gdd-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--w);transition:.13s}'+
    '.gdd-card.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.gdd-card-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}.gdd-ic{font-size:19px;line-height:1}'+
    '.gdd-card-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.gdd-tag{font-size:9.5px;font-weight:800;color:var(--mu);background:#F2F5F8;border-radius:20px;padding:2px 9px;margin-left:auto;white-space:nowrap}'+
    '.gdd-card-t{font-size:11.5px;color:var(--navy);line-height:1.5}.gdd-more{font-size:10px;font-weight:800;color:'+BRAND+';margin-top:7px}'+
    '.gdd-chain{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.gdd-chip{display:inline-flex;flex-direction:column;font-size:11.5px;font-weight:800;border:1px solid var(--bdr);border-radius:9px;padding:7px 12px;background:var(--w);color:var(--navy)}'+
    '.gdd-ar{font-size:15px;color:var(--mu)}.gdd-sub{font-size:9px;font-weight:700;color:var(--mu)}'+
    '.gdd-fly{display:flex;flex-direction:column;gap:2px}'+
    '.gdd-fly-step{display:flex;gap:11px;align-items:flex-start;border:1px solid var(--bdr);border-radius:10px;padding:11px 14px;background:var(--w)}'+
    '.gdd-fly-n{width:24px;height:24px;border-radius:50%;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}'+
    '.gdd-fly-t{font-size:12.5px;font-weight:800;color:var(--navy)}.gdd-fly-d{font-size:11.5px;color:var(--mu);line-height:1.45;margin-top:2px}'+
    '.gdd-fly-ar{text-align:center;color:var(--mu);font-size:13px;line-height:1.1}'+
    '.gdd-sens{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:600px){.gdd-sens{grid-template-columns:1fr}}'+
    '.gdd-sens-ctrl label{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--mu);margin-bottom:4px}'+
    '.gdd-sens-ctrl input[type=range]{width:100%;accent-color:'+BRAND+'}'+
    '.gdd-own{display:flex;flex-direction:column;gap:7px}'+
    '.gdd-own-row{display:grid;grid-template-columns:210px 1fr;gap:10px;align-items:center}@media(max-width:560px){.gdd-own-row{grid-template-columns:1fr}}'+
    '.gdd-own-l{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.gdd-own-track{background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;overflow:hidden;height:22px}'+
    '.gdd-own-fill{height:100%;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;padding:0 9px;white-space:nowrap;min-width:fit-content}'+
    '.gdd-gov{display:flex;flex-direction:column;gap:7px}'+
    '.gdd-gov-row{display:grid;grid-template-columns:120px 180px 1fr;gap:12px;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;background:var(--w);font-size:11.5px;align-items:baseline}'+
    '@media(max-width:640px){.gdd-gov-row{grid-template-columns:1fr}}'+
    '.gdd-gov-k{font-weight:800;text-transform:uppercase;font-size:9.5px;letter-spacing:.04em;color:var(--mu)}.gdd-gov-v{font-weight:800;color:var(--navy)}.gdd-gov-d{color:var(--mu);line-height:1.45}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ov-callout{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '.ce-pop-lead{font-size:13px;line-height:1.55;color:var(--navy);font-weight:600;margin:0 0 10px;padding-left:11px;border-left:3px solid "+BRAND+"}'+'.ce-pop-l{margin:0;padding-left:18px}'+'.ce-pop-l li{font-size:12px;line-height:1.55;color:var(--navy);margin-bottom:6px}'+'</style>';
  // The hook — always visible: Key Facts, description, 2x2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+UB_LEDE+'</p>';
  h+=stdFourQuad();
  // Everything below the hook defaults collapsed (progressive disclosure).
  h+=collapsible('How Alphabet makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Alphabet', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — staged scaffold. The spine and sub-tab structure are in place; sections fill one by
// one. Evolution ▸ Earnings is LIVE (Q2 2026 cycle).
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function gddEmpty(){ return '<div class="gdd-empty">🚧 In progress — this section is being built.</div>'; }

// ─── EARNINGS (portable pattern — same contract as ibkr.js; see docs/EARNINGS_CONVENTIONS.md) ──
// Staged for the Q2 2026 cycle: Alphabet reports Tue Jul 22, 2026 after close. Consensus is
// Bloomberg-only (golden rule) — cells render "—" until the analyst export lands. The Watch List
// and Promise Tracker fill from the earnings-call compendium when it lands.
// Setup v2 (see docs/EARNINGS_CONVENTIONS.md §6): 4 HEADLINE metrics (mandatory, every
// company: Revenue · Operating income · EPS · EBITDA) + 4 CUSTOM KPIs (company-specific).
// Each metric carries up to two estimates — cons (Street: Bloomberg BST only) and us (Summit:
// our own expectation) — and the grid toggles Consensus ⇄ Summit ⇄ Both. The debate explains
// the DISPARITY between the two sets (which lines diverge and why we see it differently).
// ─── CE_CONS · the Street's rolling track record ────────────────────────────────────────────────
// Source: G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt — the rolling Bloomberg snapshot archive,
// 12 GOOGL snapshots, Oct 2023 → Jul 2026, newest `data_as_of` 2026-07-28. This file is the ONLY
// consensus source for Earnings. Spec, and every trap below: docs/EARNINGS_CONVENTIONS.md §6a.
//
// HOW THIS WAS DERIVED. The archive is a ROLLING consensus: each row is GOOGL seen from one
// `data_as_of`. `fq0` is the last REPORTED quarter at that date and `fq+N` is the Nth quarter
// after it, each carrying its own period label. Integrity checked on load: 12 snapshots × 5 period
// columns, 0 mismatches between the labels and fq0+N. Cross-checked against the tape too — mapped
// this way the consensus series reproduces every Q4 step-up and Q1 step-down, 11/11 vs actuals.
//
// THE METRIC SET IS THE FILE'S, NOT OURS (Jul 2026: 4 headline → 9 headline + 4 custom). When the
// export changes shape, this block and the Setup grid change with it — never the other way round.
// What moved in this load: capex left the KPI slots and became a headline under a DIFFERENT field
// (HEADLINE_CAPEX, not CF_PURCHASE_OF_FIXED_PROD_ASSETS); kpi4 became Cloud operating income;
// gross profit, operating cash flow, D&A and diluted shares are new.
//
// EVERY observation is here — nothing is sampled down. Adding a snapshot means REGENERATING this
// block, not appending to it.
//
//   q[]  = 19 quarters, Q4 2022 → Q2 2027, chronological. Index into qr/qa/qy/qq.
//   qr[] = per quarter, [4q out, 3q out, 2q out, 1q out] — because fq+1..fq+4 all roll, a target
//          quarter is estimated four times as it approaches. null where no snapshot covers it.
//   qa[] = the print (a later snapshot's `fq0` — a reported actual, never an estimate)
//   qy[] = the YoY base (the actual four quarters earlier)   ─┐ both are ACTUALS, which is why the
//   qq[] = the QoQ base (the actual one quarter earlier)     ─┘ grid can toggle growth either way
//   nHead = how many of m[] are headline metrics; the rest are the company-specific customs.
//
// `u` is the display unit and it is NOT uniform any more: '$B' (USD scaled M), '$' (EPS, USD with
// no scale), 'B' (diluted shares — a COUNT, so it must never render with a dollar sign).
//
// `t` = how far to trust the consensus-vs-actual comparison. Assigned by the basis test (§6a),
// re-run over all 13 metrics on every reload — not by hand:
//   'ok'     — same basis both sides. Safe to score as a beat/miss.
//   'basis'  — REVENUE ONLY. Forward and reported columns are NOT the same definition: +20.0% mean
//              gap with σ of just 1.2% over 11 straight quarters (mean÷σ = 16.3; the next highest
//              line is 2.3). It is also the only line that does NOT converge as the horizon
//              shortens. Never charted as a surprise, never used for a YoY or QoQ.
//   'noisy'  — real basis, but dominated by something nobody forecasts: EPS (GAAP — securities
//              marks put Q2 2026 at $9.11 vs a $2.86 consensus), backlog (one contributor), and
//              (Cloud operating income was noisy/unscoreable while its actuals came through as
//              dates; the file fixed that, so it now scores like the rest.)
//   'nocons' — the archive carries NO forward estimate for this line at all. Operating cash flow:
//              every fq+N and fy+N cell is a near-zero placeholder (3.3e-06), while fq-3/fq0/fy0
//              are real. Actuals only; the consensus cell renders "—" and no growth chip.
var CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:['2023-10-26','2024-02-01','2024-04-27','2024-07-25','2024-10-31','2025-02-06','2025-04-26','2025-07-25','2025-10-31','2026-02-06','2026-05-01','2026-07-28'],
  q:['Q4 2022','Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:'Revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,72.1],[null,null,67.2,66.4],[null,71.1,70.4,71.4],[73.6,72.4,73.5,72.8],[81.4,82.4,81.9,82.4],[75.1,76.8,76.9,75.5],[80.9,81.6,80.5,79.4],[84.2,84.1,82.6,85.1],[92.1,90.6,92.8,94.6],[84.5,86.2,88.2,91.1],[91.6,93.8,96.7,99.7],[99.4,102.5,105.6,110],[112.7,116.3,121.9,null],[111.2,119.7,null,null],[129.1,null,null,null]],
      qa:[76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8,null,null,null,null],
      qy:[null,null,null,null,76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8],
      qq:[null,76,69.8,74.6,76.7,86.3,80.5,84.7,88.3,96.5,90.2,96.4,102.3,113.8,109.9,119.8,null,null,null] },
    { k:'Gross profit', u:'$B', t:'ok', code:'GROSS_PROFIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,47],[null,null,44.1,44.7],[null,47.1,47.5,48.3],[48.2,48.5,49.1,49.5],[53.6,54.4,54.7,55.5],[50.9,51.6,52.1,51.8],[54.3,54.8,54.6,54.7],[57,57,56.8,58.2],[62.1,61.9,62.9,64.6],[58.7,59.4,61.4,63.2],[62.9,64.9,66.9,70],[67.8,70.5,73.5,76.1],[77.6,81,84.2,null],[78.2,81.8,null,null],[86.7,null,null,null]],
      qa:[40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9,null,null,null,null],
      qy:[null,null,null,null,40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9],
      qq:[null,40.7,39.2,42.7,43.5,48.7,46.8,49.2,51.8,55.9,53.9,57.4,61,68.1,68.6,73.9,null,null,null] },
    { k:'Operating income', u:'$B', t:'ok', code:'IS_COMPARABLE_EBIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,23.3],[null,null,21.9,22],[null,24.2,24.4,26.1],[24.3,24.5,25.9,26.4],[27.6,28.7,29.6,30.4],[28.2,28.9,29.1,28.8],[31.1,31.1,30.8,30.8],[32.1,32.1,31.7,32.7],[35.3,34.8,35.6,36.7],[33.1,33.9,35.1,35.8],[35.9,37.3,37.8,40],[39,39.6,41.7,42.7],[44.2,45.7,47.5,null],[46.3,49.2,null,null],[51.4,null,null,null]],
      qa:[18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8,null,null,null,null],
      qy:[null,null,null,null,18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8],
      qq:[null,18.2,17.4,21.8,21.3,23.7,25.5,27.4,28.5,31,30.6,31.3,31.2,35.9,39.7,40.8,null,null,null] },
    { k:'EBITDA', u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,33.9],[null,null,31.5,31.5],[null,34.2,34.1,35.7],[34.3,34.5,35.6,36],[37.9,38.8,39,40],[37.5,38.3,38.9,39.1],[41.2,41.7,41.4,41.6],[42.9,43.4,43,44.7],[46.5,49.7,50.4,49.6],[41.9,43.6,46.1,49.4],[48.5,50.4,55.1,54.7],[52.3,55.2,57.6,58.6],[61,63.1,64.4,null],[65.1,67,null,null],[71.6,null,null,null]],
      qa:[27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8,null,null,null,null],
      qy:[null,null,null,null,27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8],
      qq:[null,27.5,25.9,31,30.9,32.7,34.1,37,38.4,35.2,40.6,42.3,43.2,49,46.2,55.8,null,null,null] },
    { k:'EPS (diluted)', u:'$', t:'ok', code:'IS_COMP_EPS_GAAP',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,1.61],[null,null,1.49,1.52],[null,1.67,1.68,1.81],[1.67,1.7,1.82,1.83],[1.91,2.02,2.04,2.12],[2.03,2.03,2.04,2.02],[2.18,2.19,2.17,2.16],[2.27,2.26,2.24,2.32],[2.47,2.47,2.54,2.62],[2.37,2.44,2.54,2.61],[2.59,2.7,2.76,2.86],[2.82,2.88,2.97,3.02],[3.2,3.26,3.36,null],[3.32,3.47,null,null],[3.6,null,null,null]],
      qa:[1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11,null,null,null,null],
      qy:[null,null,null,null,1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11],
      qq:[null,1.05,1.17,1.44,1.55,1.64,1.89,1.89,2.12,2.15,2.81,2.31,2.87,2.82,5.11,9.11,null,null,null] },
    { k:'Operating cash flow', u:'$B', t:'ok', code:'CB_CF_NET_CASH_OPERATING_ACT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,24.7],[null,null,28.5,31.1],[null,32.1,31.9,35.4],[31.3,31.1,32.9,36.5],[30.1,31.4,33.2,40.4],[33.3,35.1,35.8,36.7],[35.2,36,35.7,35.1],[38.9,38.2,37.7,42],[42,41.4,45.5,45.7],[41.6,42.9,45,47.6],[38.4,41.4,44.3,46.2],[53.2,56.4,57.9,53.9],[60.5,62.2,57.7,null],[61,62.1,null,null],[66,null,null,null]],
      qa:[null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1,null,null,null,null],
      qy:[null,null,null,null,null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1],
      qq:[null,null,null,null,30.7,18.9,28.8,26.6,30.7,39.1,36.1,27.7,48.4,52.4,45.8,39.1,null,null,null] },
    { k:'Capex', u:'$B', t:'ok', code:'CF_PURCHASE_OF_FIXED_PROD_ASSETS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,9.2],[null,null,8.7,10.1],[null,8.8,10.5,11.8],[9.2,10.7,12.1,12.8],[11.3,12.4,13,13.1],[12.3,13.4,13.9,16.8],[13.9,14.5,17.9,18.2],[14.9,18.6,19.1,21.9],[20,20.4,22.7,27.8],[18.9,21.7,27.2,35.9],[23.6,29.1,41.7,43.6],[30.5,46.9,49.6,54.6],[53,56.6,63.5,null],[53.6,64.2,null,null],[70.1,null,null,null]],
      qa:[7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9,null,null,null,null],
      qy:[null,null,null,null,7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9],
      qq:[null,7.6,6.3,6.9,8.1,11,12,13.2,13.1,14.3,17.2,22.4,24,27.9,35.7,44.9,null,null,null] },
    { k:'D&A', u:'$B', t:'ok', code:'CF_DEPR_AMORT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,4.1],[null,null,3.9,3.7],[null,4,3.9,3.8],[4.3,4.1,4.1,4.2],[4.3,4.3,4.4,4.3],[4.2,4.5,4.5,4.6],[4.8,4.8,5,5],[5.1,5.4,5.4,5.6],[5.7,5.9,6.1,6.2],[6.1,6.2,6.4,7],[6.7,7.2,8.4,8.4],[8,9.9,10.1,8.3],[11.8,12.1,9.5,null],[10.5,11.1,null,null],[11.8,null,null,null]],
      qa:[4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1,null,null,null,null],
      qy:[null,null,null,null,4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1],
      qq:[null,4.2,3.2,3.4,3.8,3.3,3.4,3.7,4,4.2,4.5,5,5.6,6,6.5,7.1,null,null,null] },
    { k:'Diluted shares', u:'B', t:'ok', code:'IS_SH_FOR_DILUTED_EPS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,12.67],[null,null,12.59,12.54],[null,12.52,12.48,12.48],[12.46,12.42,12.42,12.43],[12.37,12.37,12.38,12.36],[12.31,12.33,12.32,12.3],[12.28,12.27,12.26,12.23],[12.23,12.22,12.18,12.14],[12.18,12.13,12.09,12.15],[12.1,12.03,12.11,12.19],[11.97,12.07,12.16,12.22],[12.02,12.14,12.21,12.32],[12.11,12.19,12.34,null],[12.15,12.31,null,null],[12.32,null,null,null]],
      qa:[12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31,null,null,null,null],
      qy:[null,null,null,null,12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31],
      qq:[null,12.95,13.71,13.64,12.7,12.6,12.53,12.49,12.42,12.35,12.29,12.2,12.2,12.23,12.24,12.31,null,null,null] },
    { k:'Google Cloud', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,9],[null,null,9.1,9.4],[null,9.8,10,10.2],[10.3,10.5,10.7,10.8],[11.3,11.5,11.7,12.1],[11.8,12,12.4,12.3],[12.9,13.2,13.2,13.1],[14.3,14.4,14.3,14.7],[15.3,15.2,15.5,16.1],[15.3,15.7,16.4,18.2],[17.3,18,19.9,21.7],[19.8,21.9,24.2,27.8],[24.5,27.3,32.3,null],[29.2,33.9,null,null],[38.1,null,null,null]],
      qa:[7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8,null,null,null,null],
      qy:[null,null,null,null,7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8],
      qq:[null,7.3,7.5,8,8.4,9.2,9.6,10.3,11.4,12,12.3,13.6,15.2,17.7,20,24.8,null,null,null] },
    { k:'Search & other', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,47.8],[null,null,44.8,44.9],[null,46.9,46.9,47.5],[48.4,48.1,48.3,47.7],[52.2,52.5,51.6,52],[49.8,50.4,50.6,50.5],[50.4,53.1,53.1,52.8],[54,54.1,53.5,54.6],[59.1,58.7,59.6,61],[55.2,55.9,57,58.9],[58.9,60.2,62,63],[61.9,63.8,64.7,64.9],[70.2,71.3,71.4,null],[67.1,67.9,null,null],[71.1,null,null,null]],
      qa:[42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3,null,null,null,null],
      qy:[null,null,null,null,42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3],
      qq:[null,42.6,40.4,42.6,44,48,46.2,48.5,49.4,54,50.7,54.2,56.6,63.1,60.4,63.3,null,null,null] },
    { k:'Cloud backlog (RPO)', u:'$B', t:'ok', code:'BS_REMAINING_PERFORMANCE_OBLIG',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,74.6],[null,null,null,74.9],[null,null,77.1,77],[null,80.8,81,83.3],[96.1,96,98.6,90.2],[97,100,99.3,94.2],[102.2,101.3,96.2,96.2],[104.3,99.2,99.2,111.2],[115.2,115.2,127.2,136.4],[null,null,null,190],[null,null,129.5,318],[null,110.2,330.6,530.9],[192,457.3,552.6,null],[519.6,572.7,null,null],[602.5,null,null,null]],
      qa:[64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5,null,null,null,null],
      qy:[null,null,null,null,64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5],
      qq:[null,64.3,61.7,60.6,64.9,74.1,72.5,78.8,86.8,93.2,92.4,108.2,157.7,242.8,467.6,519.5,null,null,null] },
    { k:'Cloud operating income', u:'$B', t:'ok', code:'IS_OPER_INC',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.4],[null,null,0.5,0.6],[null,0.6,0.8,0.8],[0.7,0.8,0.8,1.1],[1.2,1.2,1.4,1.9],[1.2,1.5,1.9,1.9],[1.7,2.2,2.2,2.2],[2.6,2.6,2.6,2.9],[2.8,2.8,3.2,3.6],[2.9,3.1,3.5,4.8],[3.7,4.1,5.8,6.7],[4.8,6.2,7.5,9.2],[7.6,8.7,10.6,null],[9.7,11.5,null,null],[13.3,null,null,null]],
      qa:[-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8,null,null,null,null],
      qy:[null,null,null,null,-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8],
      qq:[null,-0.5,0.2,0.4,0.3,0.9,0.9,1.2,1.9,2.1,2.2,2.8,3.6,5.3,6.6,8.8,null,null,null] },
  ]
};


// Sign note: capex still arrives negative from the archive; stored here as a positive magnitude,
// matching how the guide and every prior quarter are quoted. Note the field CHANGED with the
// Jul-2026 export: HEADLINE_CAPEX replaced CF_PURCHASE_OF_FIXED_PROD_ASSETS, and the two do not
// agree (Q3 2026 went $54.6B -> $54.3B, and the historical mean gap moved +4.7% -> +10.2%).

// Annual FY view (Setup): reported actuals (archive fy0) + BBG consensus (our txt) + Summit
// (DCF Projection History, most-recent annual snapshot). No company guidance for GOOGL.
var CE_ANNUAL = {
  years:[2022,2023,2024,2025,2026,2027],
  guidance:false,   // GOOGL gives no numeric FY guidance
  m:[
    { k:'Revenue', u:'$B', actual:[282.8,307.4,350,402.8,null,null], bbg:[null,null,null,null,433,538.8], summit:[282.8,307.4,350,402.8,491.3,604.7] },
    { k:'Operating income', u:'$B', actual:[74.8,84.3,112.4,129,null,null], bbg:[null,null,null,null,171.9,215.2], summit:[74.8,84.3,112.4,129,169.8,220.2] },
    { k:'EBITDA', u:'$B', actual:[110.1,118.7,127.7,175.1,null,null], bbg:[null,null,null,null,226.9,291.6], summit:[110.1,120.5,150.5,175.1,232.6,307.9] },
  ]
};

var CALL_EARNINGS = {
  ticker:'GOOGL',
  quarters:[
    // ─── Q3 2026 — UPCOMING. Rolled 2026-07-22 after the Q2 call; Watch List seeded from Q2's
    // newQuestions.
    //
    // CONSENSUS PROVENANCE — G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt, the rolling snapshot
    // archive, `data_as_of` 2026-07-28 (the newest row). That row's `fq0` is "2026 Q2 (Rep)", so
    // its `fq+1` — "2026 Q3 (Fwd)" — IS this quarter. See CE_CONS above and §6a of the
    // conventions. All figures USD, scale M in the file → divided by 1,000 for the $B cells.
    //
    // YoY is that same row's `fq-3`: a REPORTED actual, exactly four quarters before `fq+1`
    // (Q3 2025). Cross-check: the row's `rev_fq0` is $119.8B, matching the Q2 2026 revenue actual
    // already hardcoded in this file.
    //
    // NOT filled: REVENUE YoY — the forward and reported revenue columns are on different bases
    // (+20.0% gap, σ 1.2%, 11 quarters). See the pop-up on that cell. The other seven pass.
    // NOT filled: QoQ. On EPS it would read −67%, because Q2 2026 printed $9.11 carrying $99B of
    // one-off securities gains. A comparison that broken is worse than no comparison.
    // The four customs follow the sheet's own KPI set (kpi1–kpi4), which tracks
    // Cloud · backlog · Search · capex — backlog REPLACED YouTube ads vs the earlier draft.
    { q:'Q3 2026', status:'upcoming', date:'late October 2026 (date TBC)',
      setup:{
        source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · Summit — to fill', asOf:'2026-07-28',
        notes:{
          'Revenue':{ t:'Why revenue runs above the forward line', h:'<p>Revenue has printed <b>~20% above</b> the forward consensus for eleven straight quarters. That is a persistent <b>FX + gross-vs-net</b> difference between how the Street quotes the forward line and how Alphabet reports it — not a run of huge beats.</p><p>We show it as a real surprise anyway (it is what the file says), with the caveat that the level, not the quarter-to-quarter wobble, is where the gap lives.</p>' },
          'EPS (diluted)':{ t:'Which EPS this is — and why QoQ reads −67%', h:'<p>Bloomberg <code>IS_COMP_EPS_GAAP</code> — comparable GAAP EPS.</p><p><b>The QoQ chip is real but useless:</b> Q2 2026 printed <b>$9.11</b> carrying <b>$99.0B of one-off securities gains</b> (+$6.26 to EPS). Against a clean $3.02, that is −67%. Nothing operational declined. Read the YoY, or better, read operating income.</p>' },
          'Operating cash flow':{ t:'No forward estimate exists', h:'<p>The archive carries <b>no consensus at all</b> for this line: every <code>fq+N</code> and <code>fy+N</code> cell is a near-zero placeholder (3.3×10⁻⁶), while <code>fq-3</code> / <code>fq0</code> / <code>fy0</code> are real numbers.</p><p>That is a normal, expected state — not a broken file. The line is kept because its <b>actuals</b> matter (Q2 2026 OCF was $39.1B against $44.9B of capex, which is the whole FCF story), but there is nothing to score against.</p>' },
          'Capex':{ t:'Sign flip — and the field CHANGED this export', h:'<p>Capex arrives as a cash <b>outflow</b> (negative) and is shown here as a positive magnitude, matching how the guide is quoted.</p><p><b>Read the change carefully:</b> this export switched the field from <code>CF_PURCHASE_OF_FIXED_PROD_ASSETS</code> to <code>HEADLINE_CAPEX</code>. They do not agree — Q3 2026 moved $54.6B → <b>$54.3B</b>, and the historical mean gap vs actuals moved +4.7% → <b>+10.2%</b>. The metric set is the file\'s, so we follow it; but a field swap is a break in the series, not a revision.</p><p><b>The read:</b> $54.3B against Q2\'s $44.9B — consensus already has the ladder stepping up again, consistent with the FY26 $195–205B guide.</p>' },
          'Cloud backlog (RPO)':{ t:'A balance, not a flow — and a very thin sample', h:'<p><code>BS_REMAINING_PERFORMANCE_OBLIG</code>: total remaining performance obligations, a <b>balance-sheet</b> line, not quarterly revenue. Against Q2 2026\'s reported <b>$514B</b>, consensus has it reaching <b>$530.9B</b> — another +$17B of net book-building while the quarter converts revenue out of the book.</p><p><b>Directional only:</b> a single contributor stands behind the quarterly figure, and it has been off by 63–146%.</p>' },
          'Cloud operating income':{ t:'New this export — now fully wired', h:'<p>kpi4 changed from capex to <b>Cloud operating income</b> (<code>IS_OPER_INC</code>, Cloud segment). Its actuals are cabled, so it is scored like every other line: Q2 2026 printed <b>$8.8B</b> against a ~$6.7B consensus, <b>+31.5%</b>.</p><p>The Street has consistently <b>under-modelled the Cloud margin ramp</b>, so the surprise here has run positive — read it as the market catching up to Cloud profitability, not as noise.</p>' },
          'Diluted shares':{ t:'The one line nobody gets wrong', h:'<p>Mean gap <b>+0.1%</b>, σ <b>0.4%</b> — by far the tightest line in the set, because share count is mechanical rather than forecast.</p><p>Worth watching anyway: it is the denominator, and Q2 2026 introduced an equity raise plus a $40B ATM shelf. A share count that starts drifting up is the dilution showing.</p>' }
        }, us:null,
        debate:{ rows:null, synth:'The one thing to resolve: separate optics from engine. If constant-currency Search holds double-digits through the lap and the Cloud-margin dip stays "modest" as promised, the deceleration is arithmetic, not thesis. The number that cannot wobble: backlog conversion.' }
      },
      results:null, call:null
    },
    { q:'Q2 2026', status:'reported', date:'Tue Jul 22, 2026 · after close (call 4:30pm ET)',
      setup:{
        // KEPT as originally filled (a gross-basis Bloomberg pull), NOT overwritten with the
        // snapshot archive's 2026-05-01 row. The two agree everywhere except revenue: op income
        // 40.5 vs 40.0 · EPS 2.90 vs 2.86 · EBITDA 55.5 vs 54.7 · Search 63.3 vs 63.0 · capex
        // 44.2 vs 43.6 — all within ~2%. Revenue is 117.0 here vs 99.7 in the archive, and the
        // print was 119.8. This grid's 117.0 gives a sane +2.4% surprise; the archive's 99.7
        // gives +20.2%. That is the cleanest confirmation we have that the archive's forward
        // revenue column is on a different basis (§6a) — so this quarter keeps the good number.
        source:'Bloomberg (BST consensus) · Summit expectations — to fill', asOf:'2026-07-22',
        notes:{
          'Revenue':{ t:'Why revenue runs above the forward line', h:'<p>Print <b>$119.8B</b> vs a $99.7B forward consensus — the usual ~20% FX / gross-vs-net gap, shown as a real surprise. A same-basis pull on Jul 22 had $117.0B (a clean +2.4%).</p>' },
          'EPS (diluted)':{ t:'⚠ EPS optics', h:'<p>Consensus $2.86; the print was <b>$9.11</b>, driven by <b>$99.0B of one-off securities gains</b>. The +218% "beat" is marks, not operations — ex-marks EPS was ~$2.85, i.e. in line.</p><p>This is why EPS is flagged <code>noisy</code>: GAAP EPS on this company is not a forecastable line.</p>' },
          'Operating cash flow':{ t:'No forward estimate — but the actual is the story', h:'<p>No consensus exists for this line. The <b>actual</b> is the point: OCF $39.1B against capex $44.9B produced the <b>first negative FCF quarter on record (−$5.9B)</b>.</p>' },
          'Cloud backlog (RPO)':{ t:'Thin sample — print was $519.5B', h:'<p>Consensus $318.0B against a <b>$519.5B</b> print. One contributor. Directional only.</p>' }
        }, us:null,
        debate:{ rows:null, synth:'So the real question isn\'t the beat — it\'s whether the <b>contracted demand keeps out-running the capex ladder</b>. Backlog/Cloud accelerate again tonight and the raises stay funded by proof; a mere in-line and the FCF squeeze becomes the story. That\'s the one thing to resolve.' }
      },
      // Post-Results filled from the 2Q2026 earnings release (Jul 22, 2026, ~4pm ET). Call tonight
      // 4:30pm ET → call:null until the transcript lands.
      results:{
        // One line. The evidence is in the tiles above and the cards below — repeating it here
        // was the single largest block of text in the phase (§6a-iv).
        headline:'Demand kept outrunning the bill — but the bill stopped being paid out of cash flow.',
        notes:{"Google Cloud":{"t":"The 6th acceleration — and a new revenue TYPE","h":"\u003cp>+28→32→34→48→63→\u003cb>82%\u003c/b>. Margin 20.7% → \u003cb>35.6%\u003c/b> YoY. And the segment definition quietly changed: Google Cloud now \"generates \u003cb>product revenues\u003c/b> primarily from the sale of \u003cb>TPU systems\u003c/b>\" — the hardware line is live in the reporting structure.\u003c/p>\u003cp>\u003cb>Backlog $514B (slides)\u003c/b> — up another +$52B QoQ \u003ci>while\u003c/i> recognizing $24.8B of revenue: gross bookings in the quarter were roughly $75B+. The book replenishes faster than it converts — the conversion-pace watch item (24-month claim) now has its cleanest data point yet.\u003c/p>"},"Operating cash flow":{"t":"The red-line line-item","h":"\u003cp>Capex $44.9B in the quarter (vs $22.4B LY) swallowed $39.1B of operating cash flow. Also inside OCF: a \u003cb>$6.7B inventory build\u003c/b> (see the TPU row) that is really growth working capital, not deterioration.\u003c/p>"},"EPS (diluted)":{"t":"⚠ Read it ex-marks — the release does the math for you","h":"\u003cp>\u003cb>$99.0B gain on equity securities\u003c/b> (mostly unrealized, largely the non-marketable book, which jumped $68.7B → $131.5B) added \u003cb>+$6.26 to EPS\u003c/b> and +$21.9B of tax provision, per the release's own footnote.\u003c/p>\u003cp>Ex-marks EPS ≈ \u003cb>$2.85 — a hair BELOW the $2.90 consensus\u003c/b>: the honest operating read is in-line, not a blowout. Same lesson as Q1, an order of magnitude louder.\u003c/p>"},"Revenue":{"t":"The FX caveat resolved — growth accelerated anyway","h":"\u003cp>Q1's flagged tailwind faded exactly as guided (FX just +1pp this quarter) — and constant-currency growth STILL accelerated 19% → \u003cb>23%\u003c/b>. The starkest line: \u003cb>US +32%\u003c/b> with zero FX. This is organic acceleration, not currency.\u003c/p>"},"Operating income":{"t":"Margin +2pp YoY, a touch under consensus","h":"\u003cp>34.0% vs 34.8% modeled — the gap sits largely in \u003cb>Alphabet-level activities\u003c/b> (shared AI R&D), whose loss widened to $5.8B (from $3.4B). Services margin 41.8%; Cloud 35.6%.\u003c/p>"},"Search & other":{"t":"The number held; the PHRASE is scored tonight","h":"\u003cp>Revenue exactly on the Bloomberg line. The watch item's real tell — the standing \"monetization at approximately the same rate\" language and the coverage-above-20% follow-through — can only be scored on the call.\u003c/p>"}}, watch:{"Google Cloud":1,"Operating cash flow":2,"Search & other":3},
        thesisCheck:[
          { line:'Cloud growth decelerates materially with backlog stalling', tripped:false, note:'+82% — the sharpest acceleration of the entire cycle, margin 35.6% — and backlog STILL grew to $514B (+$52B QoQ) while converting $24.8B into revenue. Both engines of the watch item held at once.' },
          { line:'Another raise without proof — or FCF negative while debt keeps rising', tripped:true, note:'FCF −$5.9B (first negative quarter) with LT debt to $98.2B, buybacks at $0, and a $49.6B equity raise. The demand cover is real (Cloud +82%) — but the red-line as written FIRED: the build is now funded by paper, not cash flow.' },
          { line:'Search decelerates toward single digits / monetization language downgrades', tripped:false, note:'+17%, exactly on consensus; US +32% ex-FX argues monetization is fine. The language itself is scored tonight.' },
          { line:'Direct Offers drops off the script / "not rushing" a 4th verbatim time', tripped:false, note:'Release-silent, as always for ad formats — scored on the call.' },
          { line:'TPU 2027 revenue timing gets vaguer', tripped:false, note:'The opposite: TPU systems entered the official segment definition and inventory 4x\'d to $10.0B. The ladder advanced ahead of schedule.' },
        ],
        intoCall:[
          '🔥 <b>Cloud +82%, backlog $514B</b> — how much of the quarter (and of the book) is TPU product revenue vs services? Does the >50%-in-24-months conversion claim still hold at this size? (Watch #1.)',
          '💸 <b>The funding flip</b> — why issue equity (with a 6.25% preferred layer) while sitting on $242B? Is buybacks-at-$0 the new normal, and what does 2027 capex look like now: a number, or another adjective?',
          '🧮 <b>The $99B mark</b> — non-marketable securities jumped +$63B and Alphabet BOUGHT $21.1B of new private stakes in the quarter. Which positions? (Nobody models this book; it just moved EPS by $6.26.)',
          '🇺🇸 <b>US +32% with zero FX</b> — what is driving domestic acceleration: AI Mode monetization, the coverage-above-20% claim landing, or verticals? (Watch #3 follow-through.)',
          '📱 <b>950M Gemini MAU</b> — the silence resolved; now the stance: app monetization still "not rushing" (4th time), or does the ladder finally get a rung? (Watch #4.)',
          '🏭 <b>$10B of inventory</b> — TPU shipment cadence, revenue recognition start, and the first margin hint on hardware (watch #5).',
        ],
        priceReaction:'To fill after the close from a trusted source (not web).',
      },
      // Post-Call filled from the 2Q2026 call transcript (Jul 22, 2026, 4:30pm ET).
      call:{
        take:'Both of our questions got a straight answer — and the six-call Search phrase was retired upward.',
        highlights:[
          { tag:'thesis', band:'lead', open:'TPU margins dodged twice; hardware share of the $514B backlog still undisclosed',
            head:'Cloud +82% is the SERVICES engine — Anat: "accelerated meaningfully even after excluding TPU system sales"',
            detail:'<p>The quarter\'s single most important sentence — it upgrades the QUALITY of the +82%: organic consumption demand, not lumpy hardware. TPU revenue recognition <b>began</b> in Q2 (first deliveries into customer data centers, incl. the <b>Blackstone</b> third-party-DC project): small this year, "ramping as we exit 2026," vast majority 2027.</p><p>The engine behind it: existing customers exceeding commitments by <b>>50%</b> (accelerating from 45%), acquisition velocity 2x, Marketplace transactions 7x, ~500 customers past 1T tokens.</p><p><b>Open:</b> Sheridan and Nathanson both asked hardware margins — "we don\'t break out margins," framed as TAM expansion. Third dodge next quarter is itself the answer.</p>' },
          { tag:'watch', band:'lead', open:'2027 remains an adjective — asked and deflected for the third consecutive call',
            head:'The ladder\'s THIRD raise of 2026: $195–205B — now with a stated funding doctrine',
            detail:'<p>$175–185B (Feb) → $180–190B (Apr) → <b>$195–205B (Jul)</b> — "acceleration in the delivery of capacity to meet growing demand." 2027: still "increase significantly… details at a later date."</p><p><b>The doctrine (Anat, pressed by Anmuth):</b> funding order = operating cash flow → debt (expanded $16B → ~$100B in 12 months, multi-currency) → equity (the $49.6B raise, for balance-sheet "resilience"; <b>"not planning to go back to the equity markets"</b> ex-ATM-for-SBC-taxes). FCF "will remain under pressure" — said plainly.</p><p><b>Also pre-flagged:</b> Q3 bridge capacity (renting third-party compute) with "modest" Cloud-margin pressure — a six-month cost for multi-year contracted upside, per Sundar.</p>' },
          { tag:'tone', band:'lead', open:'Does the new language survive the Q3 comp lap it was announced alongside?',
            head:'THE STANDING PHRASE RETIRED — "approximately the same rate" became "encouraged… even as we\'ve EXPANDED AIO to more commercial queries"',
            detail:'<p>Six consecutive calls carried the frozen sentence "monetization at approximately the same rate." This call replaced it: <b>"We continue to be encouraged with monetization performance on queries that show AI Overviews, even as we\'ve expanded AI Overviews to more commercial queries."</b></p><p>Per our own rule — the language IS the thesis — this is the first language change of the AI transition, and it moved in the <b>expansion</b> direction: more commercial queries covered, monetization still holding. Paired with the disclosure cluster: AI Mode <b>>1B MAU</b>, "billions of clicks to websites every week" (the web-ecosystem defense, quantified for the first time), and AI-Mode response cost at its <b>lowest since launch</b>.</p><p><b>So what:</b> the monetization story moved from parity-defense to expansion-offense — one quarter before the optics get ugly (comp lap + FX flip, both pre-flagged).</p>' },
          { tag:'tone', band:'context',
            head:'The candor cluster: coding gap admitted, Q3 optics pre-managed',
            detail:'<p>Sundar, unprompted qualifier: "there are areas where <b>we\'ve acknowledged we need to improve — coding and agentic coding</b> is an example." Anat volunteered all three Q3 headwinds before anyone asked: the Search comp lap (accel began 3Q25), the FX flip to slight headwind, the bridge-capacity margin cost.</p><p><b>So what:</b> per the candor rule this auto-promotes — and it tells you how to read Q3: a reported-growth deceleration is pre-explained arithmetic unless CONSTANT-CURRENCY breaks too.</p>' },
          { tag:'curious', band:'context', open:'Both promises are datable — score shipments, not benchmarks',
            head:'Gemini 4 pre-training started ("most ambitious run yet") + a promised near-monthly release cadence',
            detail:'<p>Pressed on frontier credibility (Anmuth, Sandler), management made two verifiable commitments: <b>"releasing models almost at a monthly cadence is part of our roadmap"</b>, and Gemini 4 built to compete "where the frontier WILL BE when it comes out." Evidence of pace offered: 3.6 Flash gained <b>+10 DeepSuite points in six weeks</b> over 3.5 while getting more token-efficient.</p>' },
          { tag:'dots', band:'context',
            head:'The agentic-commerce rails carried their first paying traffic — formats, cart and merchants all live in one quarter',
            detail:'<p>Connect the rungs: <b>Highlighted Answers</b> (clearly-marked sponsored links inside AI list responses — a NEW native format) · <b>Universal Cart</b> (cross-retailer single checkout) · UCP live at <b>Target and Steve Madden</b> · Direct Offers extending to <b>IHG</b> (travel — beyond retail) · AI Max out of beta at <b>500K advertisers</b>, +15% conversions at similar ROAS.</p><p><b>So what:</b> the bridge from AI engagement to ads revenue is no longer a roadmap — it is in production end-to-end. Volume is now the only question, and it is a 2027 question.</p>' },
          { tag:'curious', band:'logged',
            head:'The internal flywheel got its most concrete number yet: a Chrome team compressing a 2-year timeline into 3 months (8x)',
            detail:'<p>Plus: support agents autonomously resolving <b>75%</b> of ads-customer queries; <b>83%</b> of the sales team on Gemini tools weekly (+20% win rate with customized pitches); Antigravity at 2.4M WAU. <b>So what:</b> this is the opex math that lets margins expand while capex triples — the quiet answer to "who pays for the build."</p>' },
          { tag:'curious', band:'logged',
            head:'Virgo Network — a million accelerators as one supercomputer — and the agent-optimized Axion CPU',
            detail:'<p>Two new infra proper nouns: <b>Virgo</b> (unifying 1M+ accelerators across data-center sites into one trainable fabric) and agent-optimized <b>Axion</b> (+30% perf/$ vs peers). The full-stack moat keeps acquiring named layers.</p>' },
          { tag:'watch', band:'logged',
            head:'The app-ads silence: first call since Q3\'25 without "not rushing" — nobody asked, nobody volunteered',
            detail:'<p>Three straight calls carried the verbatim stance; this one carried nothing — no analyst question, no volunteered line, while the app hit 950M MAU with DAU tripled YoY. Could be nothing; per the silence rule it earns exactly one direct question next call.</p>' },
        ],
        // Punch first: each item leads with the CLAIM in <=12 words, then at most two evidence
        // fragments. The renderer sets the lead large and the evidence small (§6a-iv) — anything
        // longer than this stops being something you can say out loud.
        threeMinutes:[
          '<b>Cloud accelerated on demand, not on hardware.</b> +82%, and Anat said it flat: it accelerated even excluding TPU sales, which only started recognizing this quarter. Backlog $514B is refilling faster than it converts.',
          '<b>They chose dilution over slowing down.</b> Third capex raise in five months, FCF negative for the first time ever, $49.6B of equity, buybacks to zero. Management is telling you they believe the demand curve more than they mind the cost.',
          '<b>The six-quarter Search phrase died — upward.</b> "Approximately the same rate" became "encouraged even as we expanded to more commercial queries." First monetization-language upgrade of the AI era, and it landed alongside a pre-flagged ugly Q3.',
          '<b>Two dated promises to score next quarter.</b> Cloud bridge-margin stays "modest"; TPU ramp arrives "exiting 2026." Both are checkable, and both were volunteered.',
        ],
        notBringing:[
          { item:'World Cup records (1.7B viewers, 550M on TV, most-watched WC in YouTube history)', why:'Spectacular color, already in the release, and the ads lift is inside the +13% — nothing left to argue.' },
          { item:'Waymo Oasis vehicle · Wing 1M deliveries · Isomorphic $2B raise', why:'Real SOTP progress, logged in the themes — moves lines nobody underwrites quarterly. The Waymo external-structure question (Gawrelski) was deflected; noted, not news.' },
          { item:'Security stats (90% of F100 on Google Cloud security; Wiz AI adoption ~90%)', why:'Impressive adoption metrics with zero new economics attached — context for the Cloud mix, not meeting material.' },
        ],
        newQuestions:[
          { n:'2027 capex: a number or a framework? (third ask)', landed:{ q:'Q3 2026', rank:1 } },
          { n:'TPU-sale margins + share of backlog — dodged twice', landed:{ q:'Q3 2026', rank:2 } },
          { n:'Does the retired phrase\'s replacement survive a decel-optics quarter?', landed:{ q:'Q3 2026', rank:3 } },
          { n:'App monetization: "not rushing" retired too — or just unasked?', landed:{ q:'Q3 2026', rank:4 } },
          { n:'Gemini 4 ship window + does the near-monthly cadence materialize?', landed:{ q:'Q3 2026', rank:5 } },
        ],
      }
    },
    // ─── Q1 2026 — REPORTED (Apr 29, 2026). Pre-call blocks FROZEN as they stood when Q4 2025
    // closed; results/call filled after the print/call. Append-only.
    { q:'Q1 2026', status:'reported', date:'Tue Apr 29, 2026 · after close',
      setup:{
        // Grid RECONSTRUCTED 2026-07-28 from BBG_CONSENSUS.txt, snapshot `data_as_of` 2026-02-06
        // — the last snapshot before this quarter printed, so its `fq+1` column IS the consensus
        // that stood going into Q1 2026. YoY base is that snapshot's `fq-3` (Q1 2025 reported).
        // This is not a retro-fit: it is the contemporaneous Street number, recovered.
        source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · reconstructed from the 2026-02-06 pull', asOf:'2026-02-06',
        notes:{
          'Revenue':{ t:'Why revenue runs above the forward line', h:'<p>Print <b>$109.9B</b> vs the forward line — the persistent ~20% FX / gross-vs-net difference, shown as a real surprise rather than suppressed.</p>' },
          'EPS (diluted)':{ t:'The only negative YoY in the set', h:'<p>Consensus sat <b>below</b> the year-ago print — Q1 2025 EPS was $2.81 and carried securities marks. The Street was modelling the operating line, correctly. Then Q1 2026 printed <b>$5.11</b> on $37.7B of unrealized gains, and the "+96% beat" was marks again, in the other direction.</p>' },
          'Google Cloud':{ t:'Under-modelled, again', h:'<p>Consensus $18.2B; the print was <b>$20.0B (+10%)</b>. Third quarter running that the Street under-modelled Cloud by ~10–14% while nailing Search to within 3%. That asymmetry is the most reliable thing in this dataset.</p>' },
          'Capex':{ t:'The line the Street gets right once it is guided', h:'<p>Consensus $34.7B vs a $35.7B print. Capex is <b>guided</b>, so the Street converges hard on it — 34.7% off a year out, within 3% the last three quarters. When capex is the surprise, it is because the <i>guide</i> moved, not the quarter.</p>' },
          'Cloud backlog (RPO)':{ t:'One contributor — and it was not close', h:'<p>Consensus $190.0B against a <b>$467.6B</b> print. Directional only; never scored as a beat.</p>' }
        }, us:null,
        debate:{ rows:null, synth:'Going in, the argument was never the quarter — it was the bill. Consensus had Cloud at +48% and capex at $35.9B against a $175–185B FY guide; the risk was a raise on top of a raise.' },
        pricedIn:'Post-Q4 euphoria: Gemini 3 shipping, Cloud +48%, and a ~2x FY26 capex guide already (mostly) digested. The bar was "accelerate again, or else" — with the tape most nervous about a capex raise ON TOP of $175–185B.',
        oneLiner:'Pre-call view: backlog conversion ($240B, +55% QoQ) should keep Cloud accelerating and Search holding high-teens; the risk was a print already bought, where any incremental capex surprise gets punished harder than the beat gets paid.'
      },
      results:{
        headline:'A <b>beat with an asterisk</b>: 11th straight double-digit quarter, Cloud\'s 5th acceleration and a ~2x backlog — but the capex guide was raised AGAIN, 2027 was guided "significantly" higher, and the +82% EPS is investment marks, not operations. The business beat; the bill got bigger.',
        notes:{"Operating income":{"t":"FX inside the beat","h":"\u003cp>Services carried a \u003cb>~3pp FX tailwind\u003c/b> — Philipp volunteered the caveat unprompted (\"important to keep in mind\"). Fades to ~1pp in Q2.\u003c/p>"},"EPS (diluted)":{"t":"⚠ The asterisk","h":"\u003cp>\u003cb>$37.7B of Other income\u003c/b> (mostly unrealized gains on non-marketable securities) drove the +82%. The operating line (+30%) is the honest read — treat headline EPS as optics both ways from here.\u003c/p>"},"Capex":{"t":"The ladder extends","h":"\u003cp>Raised one quarter after doubling — cover was Intersect closing + the backlog doubling (a real demand proof, per the watch-item red-line). But \u003cb>2027 got guided UP with an adjective, not a number\u003c/b>, and LT debt jumped $46.5B→$77.5B. Quarterly FCF: $10.1B.\u003c/p>"}}, watch:{"Google Cloud":2,"Cloud backlog (RPO)":2,"Search & other":3,"Capex":1},
        thesisCheck:[
          { line:'Capex raise without a demand proof point', tripped:false, note:'Raised WITH the proof — backlog ~2x in the same print. But the 2027 "significantly increase" extends the ladder; the debate is bigger, not settled.' },
          { line:'Cloud decelerates / backlog stalls', tripped:false, note:'5th straight acceleration (+63%); backlog $462B. Constraint claim now paired with "revenue would have been higher."' },
          { line:'Search decel / standing phrase downgrades', tripped:false, note:'+19%, queries all-time high; phrase intact — and a NEW expansion claim (coverage >20% upside).' },
          { line:'Gemini app disclosure goes quiet', tripped:true, note:'No MAU number after four straight quarters. Flagged; ask until re-disclosed.' },
        ],
        intoCall:[
          '🔥 <b>2027 capex</b> — "significantly increase" is an adjective. Push for a number, or the framework (ROIC gates, self-funding?).',
          '🔩 <b>TPU hardware sales</b> — margins vs renting through Cloud? How much of the $462B backlog is TPU hardware?',
          '⚖️ <b>FCF/debt</b> — $10.1B quarterly FCF, debt +$31B QoQ: is external funding now a standing feature of the model?',
          '📊 <b>Coverage claim</b> — Philipp says ads coverage above ~20% of queries has "upside": how, and when does it show in numbers?',
          '❓ <b>Gemini app MAU</b> — the skipped rung. One direct question.',
        ],
        priceReaction:'To fill from a trusted source (not web).',
      },
      call:{
        take:'The growth machine is accelerating on every cylinder — <b>and the bill is arriving at the same time.</b> Cloud +63% with backlog ~2x while claiming unmet demand; capex raised again with 2027 guided higher; FCF $10.1B with debt +$31B. The quarter\'s real news: <b>Google started selling silicon</b> — TPU hardware into customers\' own data centers.',
        highlights:[
          { tag:'thesis', band:'context', open:'Delivery/capacity is now the constraint — does the 24-month conversion math hold?', head:'Cloud\'s acceleration is contracted, not hoped for — >50% of the $462B backlog converts within 24 months',
            detail:'<p>Enterprise AI became the <b>primary</b> growth driver for the first time: GenAI-product revenue +~800%, new-customer acquisition 2x, customers outpacing commitments +45% (accelerating). Anat: just over half the backlog converts to revenue in 24 months — that is a contracted ramp.</p><p><b>So what:</b> the revenue side of the capex debate is now largely booked, not projected. The question shifts from demand to delivery (capacity).</p>' },
          { tag:'curious', band:'lead', open:'Margin profile unanswered — Post pressed, got ROIC framing instead', head:'TPU hardware sales — Google becomes a silicon vendor (first time ever)',
            detail:'<p>Demand from AI labs, capital-markets firms and HPC led to delivering TPUs <b>into customers\' own data centers</b>. Revenue: small % late 2026, <b>"vast majority in 2027,"</b> lumpy by design; already inside the backlog.</p><p><b>So what:</b> a genuine business-model extension with NVIDIA-adjacent economics — and the hardest proof of the full-stack claim. Margin profile unanswered (Post pressed; got ROIC framing).</p>' },
          { tag:'watch', band:'lead', open:'2027 is an adjective, not a number; is external funding now permanent?', head:'The bill: capex re-raised, 2027 "significantly" higher, FCF $10.1B, debt +$31B in one quarter',
            detail:'<p>FY26 to $180–190B (Intersect); 2027 guided up with an adjective; LT debt $46.5B→$77.5B; quarterly FCF $10.1B vs a $62.6B net-income print.</p><p><b>So what:</b> external funding is now part of the model. The offset case: depreciation is flagged candidly every quarter, and serving costs keep collapsing (−30% AI-response cost since Gemini 3). Keep scoring raises against demand proofs.</p>' },
          { tag:'tone', band:'context', head:'Philipp VOLUNTEERED the FX caveat — candor against interest, weight the quarter accordingly',
            detail:'<p>"Google Services benefited from a strong FX tailwind. <b>That\'s important to keep in mind.</b>" ~3pp in Q1, fading to ~1pp in Q2 — management deflating its own beat, unprompted.</p><p><b>So what:</b> per the candor rule, this auto-promotes: underlying Services growth is ~3pp below headline, and management wants you to know it (credibility-positive).</p>' },
          { tag:'thesis', band:'context', open:'How does coverage above ~20% actually expand, and when does it show?', head:'Search +19% and a NEW quantifiable claim: ads coverage above the ~20%-of-queries level has "upside"',
            detail:'<p>Gemini intent-understanding lets them monetize longer/complex queries "previously really difficult to monetize"; >30% of Search spend already on AI-enabled campaigns; queries at an all-time high.</p><p><b>So what:</b> for years coverage ~20% was treated as structural. Management just made it an expansion vector — a reconcilable claim for next quarter.</p>' },
          { tag:'dots', band:'context', head:'UCP coalesced the industry in one quarter — the agentic-commerce rails are being laid WITH the ecosystem',
            detail:'<p>Amazon, Meta, Microsoft, Salesforce, Stripe joined the council (with founding Shopify/Etsy/Target/Wayfair); Ulta live in AI Mode/Gemini checkout; Direct Offers "resonating" (Gap, L\'Oréal, Chewy); Kingfisher/Target/Wayfair multi-year cloud+ads deals.</p><p><b>So what:</b> connect the dots — protocol + pilots + retailer cloud deals = Google positioning as the neutral rails of agentic shopping rather than fighting it. The ads pivot has a path.</p>' },
          { tag:'watch', band:'lead', open:'A management-chosen KPI went quiet after four straight disclosures', head:'The Gemini app MAU silence — one skipped rung after four straight disclosures',
            detail:'<p>35M DAU → 450M → 650M → 750M MAU… then engagement color only. Subscriptions kept climbing (350M paid; best consumer-AI-plan quarter ever), so the funnel is healthy — but a management-chosen KPI going quiet is a flag until re-disclosed (I/O on May 19 is the natural venue).</p>' },
          { tag:'curious', band:'logged', head:'Antigravity: engineers "orchestrating fully autonomous digital task forces" — the internal flywheel as a margin lever',
            detail:'<p>1.5M weekly active users two months post-launch (per Q4); now framed as shifting Google itself to agentic workflows. Paired with agents in treasury/invoicing and ~50% of code agent-written.</p><p><b>So what:</b> opex discipline while capex explodes is partly AI-automation of Google itself — the quiet reason margins expanded through the build-out.</p>' },
        ],
        dots:'<b>The print bought the capex another quarter.</b> Backlog ~2x + a 5th Cloud acceleration is exactly the demand proof the raises require — and TPU hardware sales open a second monetization of the same silicon. Keep honest: 2027 is an adjective, FCF is thin, debt is rising, and one consumer KPI went quiet.',
        threeMinutes:[
          'The quarter beat on every operating line — <b>but the news is the bill, not the beat.</b> Cloud +63% with backlog ~2x is the demand proof the capex requires, so the raise was covered. What was NOT covered: 2027 got guided up with an <b>adjective, not a number</b>, and long-term debt jumped $46.5B→$77.5B in a single quarter.',
          '<b>Read the EPS through the operating line.</b> $5.11 and "+82%" is $37.7B of unrealized marks on non-marketable securities. Operating income +30% is the honest number — and it carried a ~3pp FX tailwind that management volunteered unprompted, fading to ~1pp next quarter.',
          '<b>Google started selling silicon.</b> TPU hardware into customers\' own data centers — first time ever, already inside the $462B backlog, revenue "vast majority in 2027." Margin profile went unanswered when pressed. That is a genuine business-model extension nobody has in a model yet.',
          '<b>One KPI went quiet.</b> Gemini app MAU disclosed four straight quarters (35M DAU → 450 → 650 → 750M), then nothing but engagement color. Per the silence rule that is a flag until re-disclosed — one direct question next call.',
        ],
        notBringing:[
          { item:'Waymo $16B round / 500K rides per week', why:'Real, and the largest private round ever — but it moves a sum-of-parts line nobody underwrites, not this quarter\'s thesis.' },
          { item:'Antigravity + ~50% agent-written code', why:'The internal-efficiency flywheel is why margins expanded through the build-out. Worth logging; too diffuse to defend in a 3-minute slot.' },
          { item:'Wiz closed in March', why:'Executed as promised, low-single-digit pp Cloud-margin headwind already flagged. Resolved items do not need meeting time.' },
        ],
        newQuestions:[
          { n:'2027 capex: a number or a framework?', landed:{ q:'Q2 2026', rank:2 } },
          { n:'TPU-sale margins + share of backlog', landed:{ q:'Q2 2026', rank:5 } },
          { n:'Gemini app MAU (or a second silence)', landed:{ q:'Q2 2026', rank:4 }, tripped:true },
          { n:'Coverage-above-20%: follow-through evidence', landed:{ q:'Q2 2026', rank:3 } },
          { n:'Backlog conversion pace vs the 24-month claim', landed:{ q:'Q2 2026', rank:1 } },
        ],
      }
    },
    // ─── Q4 2025 — REPORTED (Feb 4, 2026). Frozen pre-call blocks + post-print/post-call.
    { q:'Q4 2025', status:'reported', date:'Wed Feb 4, 2026 · after close',
      setup:{
        // Grid RECONSTRUCTED 2026-07-28 from BBG_CONSENSUS.txt, snapshot `data_as_of` 2025-10-31
        // (the last pull before the Feb 4 print). Its `fq0` was Q3 2025 (Rep), so `fq+1` = Q4 2025.
        source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · reconstructed from the 2025-10-31 pull', asOf:'2025-10-31',
        notes:{
          'Revenue':{ t:'Why revenue runs above the forward line', h:'<p>Forward and reported revenue are not the same definition (+20.0%, σ 1.2%, n=11). The print was <b>$113.8B</b>. Not a 20% beat.</p>' },
          'Operating income':{ t:'The rare miss — and it was a charge', h:'<p>Consensus $36.7B, print <b>$35.9B (−2.2%)</b>. The gap is almost entirely the <b>$2.1B Waymo SBC charge</b> that landed in R&D. Underlying growth was ~+22%, not the +16% reported.</p>' },
          'Google Cloud':{ t:'Under-modelled by 10%', h:'<p>Consensus $16.1B; print <b>$17.7B (+48% YoY)</b>. The Street had Cloud decelerating to +34% — it accelerated instead. First of three straight ~10% Cloud misses.</p>' },
          'Cloud backlog (RPO)':{ t:'Thin sample — print was $242.8B', h:'<p>Consensus $136.4B against a <b>$242.8B</b> print (+55% QoQ). One contributor.</p>' }
        }, us:null,
        debate:{ rows:null, synth:'The setup was asymmetric by construction: the quarter itself was well modelled (capex within 0.4%, Search within 3%), so the print could only be decided by two things the grid could not hold — the FY26 capex number, and whether Cloud broke past +34%. Both did.' },
        pricedIn:'Gemini 3 landed in December to the best reception of any Google model and the stock ran into the print. Two live questions: how big is the FY26 capex number (Q3 promised "a significant increase — details on the Q4 call"), and does Cloud accelerate past +34% with backlog $155B.',
        oneLiner:'Pre-call view: expect acceleration AND a scary capex number — the print decides which one the tape prices first. Known headwind: YouTube brand lapping record 2024 US-election spend.'
      },
      results:{
        headline:'<b>Every Q3 promise landed at once</b>: Gemini 3 shipped and visibly accelerated the whole complex (Search +17%, Cloud +48%, backlog $240B), FY25 closed above $400B — and the capex answer was <b>~2x, $175–185B</b>. One optical drag: a $2.1B Waymo SBC charge sat on op income.',
        notes:{"Operating income":{"t":"The Waymo charge","h":"\u003cp>A \u003cb>$2.1B SBC charge\u003c/b> (Waymo's valuation step-up in the $16B round) sat mostly in R&D — reported +16% understates an underlying ~+22%. Same lesson as the Q3 EC fine: read op income ex-items first.\u003c/p>"},"Capex":{"t":"Scored as the shock it was","h":"\u003cp>Roughly DOUBLE the FY25 spend, with FY25 depreciation already +38%. The demand cover (backlog +55%, Cloud +48%) arrived in the same print — per the red-line, covered. But the magnitude reset every model.\u003c/p>"}}, watch:{"Search & other":3,"Google Cloud":2,"Cloud backlog (RPO)":2,"Capex":1},
        thesisCheck:[
          { line:'Capex number without demand cover', tripped:false, note:'~2x, but delivered WITH backlog +55% and a 4th Cloud acceleration in the same print.' },
          { line:'Cloud plateaus mid-30s', tripped:false, note:'+48% — the sharpest acceleration of the cycle.' },
          { line:'Gemini 3 slips or lands muted', tripped:false, note:'Shipped in December; "fastest adoption of any model in our history"; 3x daily tokens vs 2.5 Pro; app 750M MAU.' },
          { line:'Ads-in-AI-Mode stays "testing" verbatim', tripped:false, note:'A rung appeared: Direct Offers pilot announced + UCP protocol launched. Ladder advanced.' },
          { line:'YouTube ads negative beyond the lap', tripped:false, note:'+9%, DR-led — the flagged lap, not a structural break; subs strength (Music/Premium record) offset.' },
        ],
        intoCall:[
          '🍎 <b>Apple</b> — "preferred cloud provider" + Apple foundation models on Gemini: what exactly is in scope, and when does it hit revenue?',
          '💸 <b>$175–185B</b> — funding mix (cash vs debt), and the 2027 trajectory: does the ladder keep climbing?',
          '🏭 <b>Capacity</b> — backlog +55% with "tight supply through 2026": what unblocks delivery?',
          '📱 <b>Gemini 3 → monetization</b> — engagement exploded; where does it show in revenue lines first?',
          '🚗 <b>Waymo $16B round</b> — why external capital now, and what does the $2.1B charge imply about valuation?',
        ],
        priceReaction:'To fill from a trusted source (not web).',
      },
      call:{
        take:'Q3\'s promises all landed at once — <b>Gemini 3 shipped and accelerated everything it touched</b>, and the capex answer was ~2x with the demand cover attached. The quarter\'s quiet blockbuster: <b>Apple chose Google</b> — preferred cloud provider AND Apple foundation models built on Gemini.',
        highlights:[
          { tag:'dots', band:'lead', open:'Scope and revenue timing of the Apple arrangement undisclosed', head:'Apple picked Google twice in one announcement — the validation no marketing could buy',
            detail:'<p>Preferred cloud provider + next-generation <b>Apple foundation models based on Gemini</b>. Connect: 9-of-10 AI labs on Google Cloud (Q3) + Anthropic\'s 1M TPUs + now Apple = rivals repeatedly choosing Google\'s stack over building or buying elsewhere.</p><p><b>So what:</b> structural revenue + the strongest third-party proof of model/infra leadership to date. Watch scope and timing next quarter.</p>' },
          { tag:'thesis', band:'context', head:'Gemini 3 accelerated the WHOLE complex within one quarter of shipping',
            detail:'<p>Search +17% (accel), AI Mode queries/user doubled, app to 750M MAU with engagement "significantly higher," Cloud +48% "driven by demand for industry-leading models, including Gemini 3."</p><p><b>So what:</b> the model→product→revenue transmission is now measurable in-quarter — the core reason to believe the capex converts.</p>' },
          { tag:'watch', band:'lead', open:'Depreciation compounding; buybacks already slowed — the first allocation tell', head:'$175–185B: the ladder goes ~2x — with the cover attached, but depreciation compounding',
            detail:'<p>FY25 depreciation +38% ($15.3B→$21.1B) and "accelerating meaningfully" in 2026; Q4 buybacks slowed to $5.5B (from $11.5B in Q3) — the first capital-allocation tell of the build-out.</p><p><b>So what:</b> covered this quarter by backlog +55%. The standing rule from here: every raise must arrive with its proof.</p>' },
          { tag:'tone', band:'context', head:'Efficiency candor: Gemini serving unit costs −78% over 2025 — the other half of the capex story',
            detail:'<p>Volunteered alongside the giant guide: serving costs collapsing via model optimization/utilization; ~50% of code agent-written; agents running treasury/invoice workflows.</p><p><b>So what:</b> management\'s implicit argument is $/unit-of-AI falling faster than units grow — the margin math that makes the guide survivable. Track margins, not just the guide.</p>' },
          { tag:'curious', band:'logged', head:'8M Gemini Enterprise paid seats in four months — the fastest enterprise-seat ramp Google has disclosed',
            detail:'<p>2,800+ companies; 5B customer interactions in Q4 (+65% YoY); ISV commitments from top-15 software partners +16x. Plus 120K+ enterprises using Gemini; 95% of top-20 SaaS.</p><p><b>So what:</b> the seat business gives Cloud a recurring, high-margin layer on top of consumption — margin mix quietly improving.</p>' },
          { tag:'curious', band:'logged', head:'Reliance Jio: Gemini to 500M consumers — distribution as a weapon in the consumer-AI race',
            detail:'<p>18-month free Gemini suite + 2TB storage to 500M+ Jio users; Reliance enterprise gets Gemini Enterprise + TPUs.</p><p><b>So what:</b> the answer to "how do you out-scale ChatGPT" is distribution deals no rival can match (Samsung at CES, now Jio). Watch conversion economics, not just reach.</p>' },
          { tag:'watch', band:'context', head:'Waymo: the $16B round (largest ever) — external validation, and a $2.1B optical charge',
            detail:'<p>Alphabet funded a significant portion; the valuation step-up produced the SBC charge (R&D). 20M trips; 400K rides/week; Miami live; UK/Japan next.</p><p><b>So what:</b> external price discovery for a business the sum-of-parts models at zero — and a recurring lesson in reading reported op income through one-offs.</p>' },
          { tag:'dots', band:'context', head:'Promise ladder advanced: Direct Offers pilot + UCP protocol = the monetization bridge gets its first planks',
            detail:'<p>Q3 said "testing ads in AI Mode." Q4 delivered named rungs: <b>Direct Offers</b> (exclusive offers inside AI Mode) and <b>UCP</b>, an open agentic-commerce standard co-built with Shopify/Etsy/Target/Wayfair. Gemini-app ads: "not rushing" (again).</p><p><b>So what:</b> the test→product ladder is climbing on schedule; app ads remain the free option nobody models.</p>' },
        ],
        dots:'<b>Ship the model, prove the demand, then present the bill.</b> Gemini 3 → acceleration everywhere → backlog +55% → a ~2x capex guide that the same print justified. Apple + Jio + 8M seats say the stack is winning outside; serving costs −78% say the inside math can hold. The debate moves to 2026 delivery: capacity, depreciation, and the first revenue from the new ladders.',
        threeMinutes:[
          '<b>Every Q3 promise landed in the same print.</b> Gemini 3 shipped in December and visibly accelerated everything it touched — Search +17%, Cloud +48%, backlog $240B (+55% QoQ). The model→product→revenue transmission is now measurable within a single quarter.',
          '<b>The capex answer was ~2x: $175–185B</b> against FY25\'s $91.4B. It arrived WITH its demand cover in the same release, which is the standard we set — but FY25 depreciation is already +38% and Q4 buybacks halved to $5.5B. That is the first capital-allocation tell of the build-out.',
          '<b>Apple chose Google twice in one announcement</b> — preferred cloud provider AND next-gen Apple foundation models on Gemini. Stack it with 9-of-10 AI labs on Google Cloud and Anthropic\'s 1M TPUs: rivals keep picking Google\'s infrastructure over building their own.',
          '<b>Read op income ex-items.</b> Reported +16% understates ~+22% — a $2.1B Waymo SBC charge from the valuation step-up sat mostly in R&D. Same lesson as the Q3 EC fine.',
        ],
        notBringing:[
          { item:'YouTube +9%', why:'The election lap was pre-flagged twice. Magnitude landed where expected — a comp effect, not a story.' },
          { item:'Reliance Jio distribution deal', why:'500M consumers is a real weapon in the consumer-AI race, but conversion economics are unknowable this quarter.' },
        ],
        newQuestions:[
          { n:'Does FY26 $175–185B hold at Q1, and what is the 2027 shape?', landed:{ q:'Q1 2026', rank:1 } },
          { n:'Backlog conversion: does $240B start showing in revenue acceleration again?', landed:{ q:'Q1 2026', rank:2 } },
          { n:'Gemini 3 in Search: does the standing phrase survive the integration?', landed:{ q:'Q1 2026', rank:3 } },
          { n:'Gemini app: next MAU rung after 750M?', landed:{ q:'Q1 2026', rank:4 } },
          { n:'Wiz close timing + UCP: members beyond the founders?', landed:{ q:'Q1 2026', rank:5 } },
        ],
      }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// WATCH LIST — THE TABLE (v2.6 · Jul 2026)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// The Watch List is not a model output. Post-Results still gives the model free rein over what a
// print and a transcript said (numbers + call highlights); the HUNT LIST is ours — we decide what matters and what
// the model failed to detect. So it is stored as a TABLE, not as prose nested inside each quarter:
// one flat array of rows with explicit columns, shaped 1:1 against the Supabase table it becomes.
//
//   id          req · stable row key (the future primary key)
//   q           req · the quarter list this row belongs to — the frozen record
//   rank        req · sort order inside the quarter. NOT rendered — the cards carry no numbers,
//                     so deleting a theme never leaves a gap or a renumbering to explain.
//   theme       req · the thing to hunt
//   tags[]      req · theme tags; they power the cross-quarter filter bar
//   definition  req · what the theme actually means / why it is relevant — ours, in our words
//   trackSince       · the quarter the hook opened
//   trackUntil       · the quarter the hook closed. EMPTY MEANS STILL OPEN — the live quarter's
//                      list is exactly the rows with a trackSince and no trackUntil.
//   seededBy         · {q,n,tripped} — the prior call's open question that put it here
//   src              · grounding: why it earned a slot
//   thread[]         · [{q,n}] the quarter-by-quarter evolution
//
// v2.6 dropped three columns that had been carrying the model's voice rather than ours: `tell`
// (the 🔎 standing read), `trigger` (the validate/invalidate condition) and `cons` (the Street
// line). Their text is still in git history and in docs/calls/GOOGL.md, which is where it came from.
//
// EDITING · the portal adds / edits / deletes rows in-session (the "+ Add theme" form and the
// ✎ / ✕ controls on each card of the live quarter). Those edits are NOT persisted — dynamic
// persistence needs Supabase and is a PENDING ASSIGNMENT (docs/EARNINGS_CONVENTIONS.md §6f).
// The round-trip that works today: edit in the portal → the table at the bottom of the Watch List
// updates live → hit COPY → paste it back → it gets hardcoded into WL_ROWS in a commit.
var WL_ROWS=[
  // ── Q3 2026 · UPCOMING — the live list. Open hooks only; seeded from Q2's newQuestions. ──
  { id:'wl001', q:'Q3 2026', rank:1, theme:'The capex ladder — and now, the funding doctrine',
    tags:['capex'], trackSince:'Q4 2024', trackUntil:null,
    definition:'The bear case is now explicitly policy-funded (ops cash → $100B debt → equity done); every raise re-tests the doctrine.',
    seededBy:{ q:'Q2 2026', n:'2027 capex: a number or a framework? (third ask)' },
    src:'Ladder tracked since Q4 2024; the 2027 question has been asked and adjectived twice (Q1, Q2).',
    thread:[
      { q:'Q4 2025', n:'FY26 guided $175–185B (~2x FY25)' },
      { q:'Q1 2026', n:'Raised to $180–190B (Intersect) · 2027 "significantly increase" · debt $46.5→$77.5B · FCF $10.1B' },
      { q:'Q2 2026', n:'Raised AGAIN to $195–205B · FCF −$5.9B (first negative) · $49.6B equity + debt to $98.2B · buybacks $0 · doctrine stated: "not planning to go back to the equity markets" (ex-ATM) · FCF "will remain under pressure"' } ] },
  { id:'wl002', q:'Q3 2026', rank:2, theme:'Cloud: the services engine × the TPU ramp × the bridge margin',
    tags:['cloud','tpu','capex'], trackSince:'Q2 2024', trackUntil:null,
    definition:'The acceleration is proven organic ("accelerated meaningfully even excluding TPU sales"); the open economics are the hardware line and the bridge dent.',
    seededBy:{ q:'Q2 2026', n:'TPU-sale margins + share of backlog — dodged twice' },
    src:'The #1 theme six calls running; TPU rev-rec began in Q2 (first deliveries into customer DCs, incl. the Blackstone project).',
    thread:[
      { q:'Q4 2025', n:'+48% · backlog $240B' },
      { q:'Q1 2026', n:'+63% · backlog $462B (incl. first TPU deals) · "revenue would have been higher"' },
      { q:'Q2 2026', n:'+82% — "accelerated meaningfully even AFTER excluding TPU system sales" · backlog $514B (+$52B while converting $24.8B) · margin 35.6% · rev-rec began; small → ramp exiting 2026 → majority 2027 · commitments exceeded by >50% (accel)' } ] },
  { id:'wl003', q:'Q3 2026', rank:3, theme:'Search through the comp lap — scoring the NEW language',
    tags:['search','monetization'], trackSince:'Q2 2024', trackUntil:null,
    definition:'~53% of revenue; the language IS the thesis (our own rule) — and it just upgraded for the first time in the AI transition.',
    seededBy:{ q:'Q2 2026', n:'Does the retired phrase\'s replacement survive a decel-optics quarter?' },
    src:'Phrase tracked verbatim across six calls; retirement caught by the Pass-1.5 recurrence scan on this call.',
    thread:[
      { q:'Q4 2025', n:'+17% · Gemini 3 into Search · phrase intact' },
      { q:'Q1 2026', n:'+19% · coverage-above-20% "upside" claim · phrase intact' },
      { q:'Q2 2026', n:'+17% · PHRASE RETIRED → "encouraged… even as expanded to more commercial queries" · AI Mode >1B MAU · "billions of clicks to websites every week" · AI-Mode response cost at lowest since launch · Q3 comp-lap warning volunteered' } ] },
  { id:'wl004', q:'Q3 2026', rank:4, theme:'The monetization ladder: Highlighted Answers · Universal Cart · the app silence',
    tags:['monetization','promises','ai-consumer'], trackSince:'Q3 2025', trackUntil:null,
    definition:'The bridge from AI engagement to ads revenue is now BUILT in production; volume is the question. The app remains the un-modeled option.',
    seededBy:{ q:'Q2 2026', n:'App monetization: "not rushing" retired too — or just unasked?' },
    src:'Promise-ladder discipline (ex-Promise-Tracker); the "not rushing" phrase had run three consecutive calls.',
    thread:[
      { q:'Q4 2025', n:'Direct Offers pilot · UCP launched · "not rushing" (2nd)' },
      { q:'Q1 2026', n:'Direct Offers traction (Gap/L\'Oréal/Chewy) · UCP +Amazon/Meta/Microsoft/Salesforce/Stripe · "not rushing" (3rd) · app-MAU silence' },
      { q:'Q2 2026', n:'Highlighted Answers debut · Universal Cart · Target & Steve Madden live on UCP · IHG on Direct Offers · AI Max 500K advertisers · app-ads stance: total silence (no question, no phrase)' } ] },
  { id:'wl005', q:'Q3 2026', rank:5, theme:'The frontier race: Gemini 4 & the monthly cadence',
    tags:['frontier','ai-consumer'], trackSince:'Q2 2026', trackUntil:null,
    definition:'Model leadership is the input to every other thesis line — and for the first time management put a cadence on record.',
    seededBy:{ q:'Q2 2026', n:'Gemini 4 ship window + does the near-monthly cadence materialize?' },
    src:'New theme opened this quarter: Doug Anmuth and Ross Sandler both pressed the frontier question; answers carried commitments.',
    thread:[
      { q:'Q2 2026', n:'Coding/agentic-coding gap ADMITTED ("areas where we\'ve acknowledged we need to improve") · 3.6 Flash +10pts DeepSuite in 6 weeks · Gemini 4 pre-training started, "most ambitious yet" · "releasing models almost at a monthly cadence is part of our roadmap" · tokens 22B/min (from 16B)' } ] },
  // ── Q2 2026 · REPORTED — frozen record, scored in Post-Results / Post-Call. ──
  { id:'wl006', q:'Q2 2026', rank:1, theme:'Google Cloud — growth × backlog × capacity',
    tags:['cloud','capex'], trackSince:'Q2 2024', trackUntil:'Q2 2026',
    definition:'Cloud is the acceleration story of the whole company and the justification for the capex; its op margin went 9% → 33% in eight quarters while growth sped up.',
    seededBy:{ q:'Q1 2026', n:'Backlog conversion pace vs the 24-month claim' },
    src:'The #1 recurring theme of the last 6 calls; backlog/RPO is a tracked Bloomberg line; management leads with it every quarter.',
    thread:[
      { q:'Q2 2025', n:'+32% · backlog $106B · first warning: "tight demand-supply into 2026"' },
      { q:'Q3 2025', n:'+34% · backlog $155B (+46% QoQ) · Anthropic plans up to 1M TPUs' },
      { q:'Q4 2025', n:'+48% · backlog $240B (+55% QoQ) · Apple names Google its preferred cloud provider' },
      { q:'Q1 2026', n:'+63% to $20B · backlog $462B (~2x QoQ, incl. first TPU hardware deals) · "revenue would have been higher if we could meet demand"' } ] },
  { id:'wl007', q:'Q2 2026', rank:2, theme:'The capex ladder → depreciation → free-cash-flow squeeze',
    tags:['capex'], trackSince:'Q4 2024', trackUntil:'Q2 2026',
    definition:'This is the bear case in one line: AI capex swallowing the cash machine. Consensus already models a near-zero-FCF quarter — the print will show whether the offsets (efficiency, revenue) keep pace.',
    seededBy:{ q:'Q1 2026', n:'2027 capex: a number or a framework?' },
    src:'Management flags accelerating depreciation EVERY call, unprompted (candor against interest); the Street asks about it every call.',
    thread:[
      { q:'Q4 2024', n:'FY25 guide $75B — "notably larger than 2023"' },
      { q:'Q2 2025', n:'Raised to ~$85B; "further increase in 2026"' },
      { q:'Q3 2025', n:'Raised to $91–93B; depreciation +41% YoY' },
      { q:'Q4 2025', n:'FY26 guided $175–185B (~2x); depreciation +38% in FY25; Waymo $16B round' },
      { q:'Q1 2026', n:'Raised to $180–190B (Intersect); 2027 "significantly increase"; LT debt $46.5B→$77.5B; FCF $10.1B' } ] },
  { id:'wl008', q:'Q2 2026', rank:3, theme:'Search through the AI transition — and the standing phrase',
    tags:['search','monetization'], trackSince:'Q2 2024', trackUntil:'Q2 2026',
    definition:'~56% of revenue, and the existential AI question is settling empirically: Search ACCELERATED 10→12→12→15→17→19% while AI Overviews and AI Mode rolled into the core product.',
    seededBy:{ q:'Q1 2026', n:'Coverage-above-20%: follow-through evidence' },
    src:'The recurring analyst question on every call since SGE launched; the standing phrase repeats verbatim across calls, which makes it trackable.',
    thread:[
      { q:'Q1 2025', n:'+10% · AI Overviews 1.5B users/mo · "monetization at approximately the same rate"' },
      { q:'Q2 2025', n:'+12% · AI Mode 100M MAU (US+India) · Lens queries +70%' },
      { q:'Q3 2025', n:'+15% · AI Mode 75M DAU, ads-in-AI-Mode testing begins · paid clicks +7%, CPC +7%' },
      { q:'Q4 2025', n:'+17% · Gemini 3 integrated into AI Mode & AI Overviews · queries at all-time high' },
      { q:'Q1 2026', n:'+19% (retail/finance; FX aid flagged) · NEW: coverage-above-20% upside claim · AI-response cost −30% since Gemini 3' } ] },
  { id:'wl009', q:'Q2 2026', rank:4, theme:'New-surface monetization promises: AI Mode ads · Direct Offers · Gemini app',
    tags:['monetization','promises','ai-consumer'], trackSince:'Q3 2025', trackUntil:'Q2 2026',
    definition:'This is where the next leg of ads growth comes from as the surface shifts — and app monetization is entirely un-modeled by the Street.',
    seededBy:{ q:'Q1 2026', n:'Gemini app MAU (or a second silence)', tripped:true },
    src:'Direct on-call commitments tracked quarter-over-quarter (Promise-Tracker discipline, now embedded here); silence is a signal.',
    thread:[
      { q:'Q3 2025', n:'"Testing ads in AI Mode… will continue to test before expanding"' },
      { q:'Q4 2025', n:'Direct Offers pilot announced · UCP protocol launched with retail partners · Gemini-app ads: "not rushing"' },
      { q:'Q1 2026', n:'Direct Offers "resonating" (Gap, L\'Oréal, Chewy) · new retail ad format in test · UCP adds Amazon/Meta/Microsoft/Salesforce/Stripe; Ulta live · app ads still "not rushing" · no app-MAU update (silence)' } ] },
  { id:'wl010', q:'Q2 2026', rank:5, theme:'TPUs go external — silicon becomes a business',
    tags:['tpu','cloud'], trackSince:'Q3 2025', trackUntil:'Q2 2026',
    definition:'A genuine business-model extension (hardware vendor economics) and the hardest proof of the full-stack differentiation claim — 8th-gen TPUs shipping while rivals buy GPUs.',
    seededBy:{ q:'Q1 2026', n:'TPU-sale margins + share of backlog' },
    src:'New disclosure in Q1 2026 with explicit forward guidance to reconcile; multiple analysts pressed it (Nowak, Post) and got partial answers.',
    thread:[
      { q:'Q3 2025', n:'Anthropic plans access to up to 1M TPUs · Ironwood (7th gen) GA soon' },
      { q:'Q4 2025', n:'TPU accelerators serving frontier labs, capital-markets firms, governments' },
      { q:'Q1 2026', n:'8th-gen TPU 8t/8i unveiled · first hardware sales into customer data centers · "small % of revenue later this year, vast majority 2027"' } ] },
  // ── Q1 2026 · REPORTED — frozen record. ──
  { id:'wl011', q:'Q1 2026', rank:1, theme:'FY26 capex — does $175–185B hold?',
    tags:['capex'], trackSince:'Q4 2024', trackUntil:'Q1 2026',
    definition:'The bear case is capex swallowing the cash machine; every raise re-tests it.',
    seededBy:{ q:'Q4 2025', n:'Does FY26 $175–185B hold at Q1, and what is the 2027 shape?' } },
  { id:'wl012', q:'Q1 2026', rank:2, theme:'Cloud — backlog conversion & a 5th acceleration',
    tags:['cloud','capex'], trackSince:'Q2 2024', trackUntil:'Q1 2026',
    definition:'Cloud is the acceleration story and the capex justification.',
    seededBy:{ q:'Q4 2025', n:'Backlog conversion: does $240B start showing in revenue acceleration again?' } },
  { id:'wl013', q:'Q1 2026', rank:3, theme:'Gemini 3 in Search — the standing phrase + monetization ladder',
    tags:['search','monetization'], trackSince:'Q2 2024', trackUntil:'Q1 2026',
    definition:'~56% of revenue; the existential question.',
    seededBy:{ q:'Q4 2025', n:'Gemini 3 in Search: does the standing phrase survive the integration?' } },
  { id:'wl014', q:'Q1 2026', rank:4, theme:'Gemini app ladder post-750M',
    tags:['ai-consumer'], trackSince:'Q1 2025', trackUntil:'Q1 2026',
    definition:'The consumer-AI race scoreboard, and the un-modeled ads option.',
    seededBy:{ q:'Q4 2025', n:'Gemini app: next MAU rung after 750M?' } },
  { id:'wl015', q:'Q1 2026', rank:5, theme:'Wiz close + UCP rollout (agentic commerce)',
    tags:['monetization','promises','cloud'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'Cloud security pillar + the rails for agentic-era ads.',
    seededBy:{ q:'Q4 2025', n:'Wiz close timing + UCP: members beyond the founders?' } },
  // ── Q4 2025 · REPORTED — frozen record. ──
  { id:'wl016', q:'Q4 2025', rank:1, theme:'THE FY2026 capex number',
    tags:['capex'], trackSince:'Q4 2024', trackUntil:'Q4 2025',
    definition:'The single number that repriced the stock at every prior guide.' },
  { id:'wl017', q:'Q4 2025', rank:2, theme:'Cloud past +34% — and the Anthropic TPU flow-through',
    tags:['cloud','tpu'], trackSince:'Q2 2024', trackUntil:'Q4 2025',
    definition:'The acceleration narrative IS the multiple.' },
  { id:'wl018', q:'Q4 2025', rank:3, theme:'Gemini 3 — the "later this year" promise, delivered?',
    tags:['search','promises'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'Model leadership is the input to every other thesis line.' },
  { id:'wl019', q:'Q4 2025', rank:4, theme:'Ads in AI Mode: test → product?',
    tags:['monetization','promises'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'The bridge from AI engagement to ads revenue.' },
  { id:'wl020', q:'Q4 2025', rank:5, theme:'YouTube election-lap depth',
    tags:['youtube'], trackSince:'Q4 2025', trackUntil:'Q4 2025',
    definition:'Separates a comp effect from a YouTube-ads problem.' },
];
// Rows for one quarter. The LIVE (upcoming) quarter shows only OPEN hooks — a trackSince with no
// trackUntil. Frozen quarters show their record exactly as it stood. `rank` orders, never labels.
function wlFor(qLabel, openOnly){
  return WL_ROWS.filter(function(r){
    if(r.q!==qLabel) return false;
    if(openOnly && r.trackUntil) return false;
    return true;
  }).sort(function(a,z){
    var ar=(typeof a.rank==='number')?a.rank:99, zr=(typeof z.rank==='number')?z.rank:99;
    return ar-zr;
  });
}
function wlOpen(r){ return !!(r.trackSince && !r.trackUntil); }
// Every tag in use, across every quarter — the vocabulary of the filter bar. New tags created in
// the Add-theme form are appended live so they become available to everyone.
function wlTags(){
  var set=[], seen={};
  WL_ROWS.forEach(function(r){ (r.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); });
  return set.sort();
}
function wlById(id){ for(var i=0;i<WL_ROWS.length;i++){ if(WL_ROWS[i].id===id) return WL_ROWS[i]; } return null; }
function wlNextId(){
  var mx=0; WL_ROWS.forEach(function(r){ var m=/^wl(\d+)$/.exec(r.id||''); if(m && +m[1]>mx) mx=+m[1]; });
  return 'wl'+String(mx+1).padStart(3,'0');
}
// Next sort slot for a quarter — keeps new rows at the end without ever renumbering the others.
function wlNextRank(qLabel){
  var mx=0; WL_ROWS.forEach(function(r){ if(r.q===qLabel && typeof r.rank==='number' && r.rank>mx) mx=r.rank; });
  return mx+1;
}
function ceUpcoming(){ return CALL_EARNINGS.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function ceFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="ce-empty">'+(muted||'— to fill')+'</span>'; }
var CE_POP={};
function ceReg(id, t, h){ CE_POP[id]={t:t, h:ceProse(h)}; return id; }
function ceQ(id, t, h){ return '<span class="ce-info ov-clickable" data-detail="ce:'+ceReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
// ─── ceProse · the anti-wall transform ──────────────────────────────────────────────────────────
// Every pop-up body in this file was authored as flowing <p> prose — 81 of 81 with no bullets —
// and a reader who taps "＋ detail" got a paragraph block. This runs at REGISTRATION time so the
// rule cannot be forgotten by the next author, and so it applies to old content too:
//   · the first paragraph becomes the LEAD — one short block, set larger; if it is itself long,
//     only its first sentence leads and the remainder joins the bullets.
//   · any paragraph of 2+ sentences is split into <li> bullets, one sentence each.
//   · a paragraph opening "<b>Label:</b> …" keeps its label and becomes a labelled row.
// Content already carrying <ul>/<li> is left exactly as authored. (§6a-iv.)
function ceSentences(s){
  // split on sentence end followed by a capital / tag-open — never inside "$1.5B" or "vs. the"
  return String(s).split(/(?<=[.!?])\s+(?=(?:<[a-z]+>)*[A-Z“"(])/).filter(function(x){ return x.trim(); });
}
function ceProse(h){
  h=String(h||'');
  if(!h || h.indexOf('<li>')>=0 || h.indexOf('<ul')>=0) return h;   // already structured
  var paras=h.match(/<p>[\s\S]*?<\/p>/g);
  if(!paras || paras.length===0) return h;
  var tail=h.replace(/<p>[\s\S]*?<\/p>/g,'').trim();               // anything not in a <p>
  var lead='', bullets=[];
  paras.forEach(function(p,i){
    var inner=p.replace(/^<p>/,'').replace(/<\/p>$/,'').trim();
    var lab=inner.match(/^<b>([^<]{1,42}[:—-])<\/b>\s*([\s\S]*)$/);
    if(lab){ bullets.push('<b>'+lab[1]+'</b> '+lab[2]); return; }
    var sents=ceSentences(inner);
    if(i===0){
      lead=sents.shift();
      sents.forEach(function(s){ bullets.push(s); });
    } else {
      sents.forEach(function(s){ bullets.push(s); });
    }
  });
  var out='';
  if(lead)          out+='<p class="ce-pop-lead">'+lead+'</p>';
  if(bullets.length) out+='<ul class="ce-pop-l">'+bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('')+'</ul>';
  return out+tail;
}
function ceStyle(){
  return '<style>.ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.ce-phtabs{display:inline-flex;gap:3px;background:rgba(66,133,244,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.ce-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.ce-phtab:hover{color:var(--navy)}.ce-phtab.active{background:'+BRAND+';color:#fff}'+
    '.ce-phpane[hidden]{display:none}'+
    /* quarter selector — one Earnings, many quarters; only the selected quarter renders (page stays light) */
    '.ce-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.ce-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-qpill:hover{color:var(--navy)}.ce-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.ce-qpill .ce-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.ce-qblock[hidden]{display:none}'+
    '.ce-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    /* watch-list theme tags (cross-quarter filter) + add-theme form */
    '.ce-wl-hint{font-size:10.5px;line-height:1.5;color:var(--navy);background:rgba(66,133,244,0.06);border:1px solid rgba(66,133,244,0.28);border-radius:9px;padding:8px 12px;margin:0 0 10px}'+'.ce-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.ce-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-tag:hover{background:rgba(122,90,248,0.08)}.ce-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.ce-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-bar-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.ce-wl-win{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 11px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-win.active{background:var(--navy);color:#fff}'+
    /* ── the Add / Edit theme form ── */
    '.ce-wl-addform{display:flex;flex-direction:column;gap:5px;border:1px dashed '+BRAND+';border-radius:10px;padding:14px 15px;margin:0 0 12px;background:rgba(66,133,244,0.03)}'+
    '.ce-wl-addform[hidden]{display:none}'+
    '.ce-wl-fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:4px}'+
    '.ce-wl-fh-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-fh-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-lb{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-top:5px}'+
    '.ce-wl-lb span{font-weight:600;text-transform:none;letter-spacing:0;color:var(--mu);font-size:10px;margin-left:5px}'+
    '.ce-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);width:100%;box-sizing:border-box}'+
    '.ce-wl-in:focus{outline:none;border-color:'+BRAND+'}'+
    '.ce-wl-ta{resize:vertical;line-height:1.5}'+
    '.ce-wl-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.ce-wl-2col{grid-template-columns:1fr}}'+
    '.ce-wl-tagpick{display:flex;gap:6px;flex-wrap:wrap;border:1px solid var(--bdr);border-radius:8px;padding:8px 9px;background:var(--w);min-height:20px}'+
    '.ce-wl-pick{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-pick:hover{background:rgba(122,90,248,0.08)}.ce-wl-pick.on{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-newtag{display:flex;gap:7px;align-items:center}.ce-wl-newtag .ce-wl-in{flex:1}'+
    '.ce-wl-newtag-go{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+PURPLE+';background:var(--w);color:'+PURPLE+';padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap}'+
    '.ce-wl-frow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}'+
    '.ce-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:7px 15px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.ce-wl-cancel{font:inherit;font-size:10.5px;font-weight:700;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:6px 12px;border-radius:8px;cursor:pointer}'+
    '.ce-wl-all[hidden]{display:none}.ce-w[data-wlhide]{display:none}'+
    /* ── the table: the storage view + the copy-out ── */
    '.ce-wl-tbl-sc[hidden]{display:none}'+'.ce-wl-tbl-wrap{margin-top:22px;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.ce-wl-tbl-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}'+
    '.ce-wl-tbl-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-tbl-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-tbl-n{margin-left:auto;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';background:rgba(52,168,83,0.10);border:1px solid rgba(52,168,83,0.3);border-radius:999px;padding:3px 11px;white-space:nowrap}'+
    '.ce-wl-copy{border:1px solid '+BRAND+';background:'+BRAND+';font:inherit;font-size:10px;font-weight:800;color:#fff;padding:4px 14px;border-radius:999px;cursor:pointer;letter-spacing:.03em;transition:.12s}'+
    '.ce-wl-copy:hover{filter:brightness(1.08)}'+
    '.ce-wl-copy.alt{background:var(--w);color:'+BRAND+'}.ce-wl-copy.alt:hover{background:rgba(66,133,244,0.08)}'+
    '.ce-wl-tbl-sc{overflow-x:auto;border:1px solid var(--bdr);border-radius:9px}'+
    '.ce-wl-tbl{width:100%;border-collapse:collapse;font-size:10.5px;min-width:1100px}'+
    '.ce-wl-tbl th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:7px 9px;border-bottom:1px solid var(--bdr);white-space:nowrap;position:sticky;top:0}'+
    '.ce-wl-tbl td{padding:7px 9px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top;max-width:270px}'+
    '.ce-wl-tbl tr:last-child td{border-bottom:none}'+
    '.ce-wl-tbl td.wl-key{white-space:nowrap;font-weight:800;color:var(--mu);font-size:10px}'+
    '.ce-wl-tbl td.wl-th{font-weight:800;min-width:190px}'+
    '.ce-wl-tbl tr.wl-open td.wl-key{color:'+BRAND2+'}'+
    '.ce-wl-tbl tbody tr:hover{background:rgba(66,133,244,0.035)}'+
    '.ce-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.ce-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.ce-grid4{grid-template-columns:1fr 1fr}}'+
    '.ce-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.ce-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.ce-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    /* Setup v2 — estimates toggle (Consensus ⇄ Summit ⇄ Both) */
    '.ce-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-ev-pill.active{background:var(--navy);color:#fff}'+
    '.ce-cell-custom{border-top-color:'+YELLOW+'}'+
    '.ce-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.ce-val{display:flex;align-items:baseline;gap:7px}'+
    '.ce-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.ce-val-cons .ce-val-lab{background:rgba(26,115,232,0.10);color:'+BLUE+'}'+
    '.ce-val-us .ce-val-lab{background:rgba(52,168,83,0.12);color:'+BRAND2+'}'+
    '.ce-evwrap[data-ev="cons"] .ce-val-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-val-cons{display:none}'+
    '.ce-evwrap:not([data-ev="both"]) .ce-val-lab{display:none}'+
    '.ce-evwrap[data-ev="both"] .ce-cell-v{font-size:13px}'+
    '.ce-evwrap[data-ev="both"] .ce-val{margin-top:3px}'+
    '.ce-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.ce-watch{display:flex;flex-direction:column;gap:11px}'+
    '.ce-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.ce-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    /* v2.6: the numbered rank badge is gone — a plain marker, so removing a theme never leaves a
       stale number behind. `rank` still orders the rows, it just is not rendered. */
    '.ce-w-dot{width:8px;height:8px;border-radius:50%;background:'+BRAND+';flex:none;margin:0 2px}'+
    '.ce-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    /* the definition — what the theme means, in our words. (v2.6 replaced the tell 🔎 box, which
       had been carrying the model's voice; no black slabs left anywhere in the watch cards.) */
    '.ce-w-def{color:var(--navy);border-left:3px solid rgba(66,133,244,0.35);padding:1px 0 1px 11px;font-size:12px;line-height:1.55;margin-top:7px}'+
    '.ce-w-def b{color:'+BLUE+'}'+
    /* per-card edit / delete (live quarter only) + the closed-hook badge */
    '.ce-w-ctl{margin-left:auto;display:inline-flex;gap:5px;flex:none}'+
    '.ce-w-ed,.ce-w-del{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);width:24px;height:24px;border-radius:7px;cursor:pointer;line-height:1;transition:.12s}'+
    '.ce-w-ed:hover{border-color:'+BRAND+';color:'+BRAND+'}.ce-w-del:hover{border-color:'+RED+';color:'+RED+'}'+
    '.ce-w-closed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;flex:none}'+
    '.ce-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.ce-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.ce-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.ce-info:hover{filter:brightness(1.1)}'+
    /* (retired Jul 2026: .ce-debate / .ce-dc / .ce-mech — the fear-vs-consensus pair and the
       mechanism chips. The Setup now goes straight from the estimates grid to the debate box.) */
    '.ce-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.ce-synth b{color:#AECBFA}'+
    '.ce-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.ce-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.ce-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3;color:var(--navy)}'+
    '.ce-w-chip.tag{background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3)}'+
    '.ce-w-chip.since{background:rgba(251,188,5,0.12);border:1px solid rgba(183,121,31,0.35)}'+
    '.ce-w-chip.until{background:#F2F5F8;border:1px solid var(--bdr);color:var(--mu)}'+
    '.ce-w-chip.cons{background:rgba(26,115,232,0.08);border:1px solid rgba(26,115,232,0.28)}'+
    /* .cons and .red are kept for the SPLC infra cards (Deep Dive ▸ SPLC), their only remaining user */
    '.ce-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28)}'+
    '.ce-w-chip b{font-weight:800}'+
    '.ce-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.ce-take b{color:#AECBFA}'+
    '.ce-hl{display:flex;flex-direction:column;gap:8px}'+
    '.ce-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.ce-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.ce-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.ce-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.ce-hl-row{grid-template-columns:auto 1fr}.ce-hl-more{display:none}}'+
    '.ce-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(66,133,244,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.ce-dots b{color:'+BRAND+'}'+
    '.ce-sc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.ce-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.ce-sc-c{font-size:11px;color:var(--mu)}.ce-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a{display:none}}'+
    '.ce-tc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.ce-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.ce-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.ce-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.ce-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    /* ── #1 · the chain: seededBy chip on watch items, landing chip on newQuestions ── */
    '.ce-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.ce-nq{display:flex;flex-direction:column;gap:5px}'+
    '.ce-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.ce-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.ce-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.ce-nq-row{grid-template-columns:1fr}.ce-nq-land{margin-top:3px}}'+
    /* ── #2 · scorecard: surprise bars, watch-rank badges, richer result kinds ── */
    '.ce-sc-row{grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto}'+
    '.ce-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(66,133,244,0.10);border:1px solid rgba(66,133,244,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.ce-sc-rk.blank{background:transparent;border:none}'+
    '.ce-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.ce-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.ce-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.ce-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    /* the legend that makes the row readable without a manual */
    '.ce-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.ce-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.ce-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a,.ce-sc-bw,.ce-sc-rk{display:none}}'+
    /* ── #3 · post-call highlight bands ── */
    '.ce-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.ce-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.ce-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.ce-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.ce-band-s{display:none}}'+
    '.ce-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    /* ── #4 · the deliverable: three minutes + what we are not bringing ── */
    '.ce-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent)}'+
    '.ce-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.ce-3m-l{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}'+'@media(max-width:760px){.ce-3m-l{grid-template-columns:1fr}}'+'.ce-3m-n{width:22px;height:22px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none}'+'.ce-3m-bd{min-width:0}'+'.ce-3m-lead{display:block;font-size:13.5px;font-weight:800;color:var(--navy);line-height:1.4}'+'.ce-3m-ev{display:block;font-size:11px;font-weight:500;color:var(--mu);line-height:1.5;margin-top:4px}'+'.ce-3m-more{margin-top:6px}'+'.ce-3m-more>summary{font-size:9.5px;font-weight:800;color:'+BLUE+';cursor:pointer;list-style:none}'+'.ce-3m-more>summary::-webkit-details-marker{display:none}'+'.ce-3m-more[open]>summary{color:var(--mu)}'+
    '.ce-3m-i{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:11px 13px;background:#fff}'+
    
    '.ce-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.ce-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.ce-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.ce-nb-r b{color:var(--navy);font-weight:800}'+
    '.ce-nb-x{color:'+GRAY+';font-weight:800;flex:none}'+
    /* ── #5 · earnings-call theme status with age ── */
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
// ─── The IR button — every Earnings opens with it. On earnings day the source is ONE tap away:
// release, webcast, transcripts, straight from the company. Deliberately loud; convention for
// every company (EARNINGS_CONVENTIONS §6). GOOGL → https://abc.xyz/investor/
var CE_IR_URL='https://abc.xyz/investor/';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1652044&owner=exclude';
// Identity, not decoration: the company's real logo on the IR card, the SEC eagle seal on the
// EDGAR card — both oversized, on near-black, with a giant watermark of the same mark behind.
// Logo comes from the portal's standard logo CDN (parqet, CSP-allowed); the SEC seal is the
// official public-domain seal served locally (img/sec-seal.png).
// Official Google "G" (transparent bg, gstatic — already CSP-allowed) so both marks get the same
// treatment: transparent emblem in a glowing ring + giant watermark. No white tiles.
var CE_LOGO_URL='https://www.gstatic.com/images/branding/googleg/2x/googleg_standard_color_128dp.png';
var CE_SEC_SEAL='img/sec-seal.png';
function ceIRButton(){
  return '<style>'+
    '.ce-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.ce-srcrow{grid-template-columns:1fr}}'+
    '.ce-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1224 60%,#04060B 100%);border:1px solid rgba(66,133,244,.3);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.ce-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+RED+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.ce-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(26,115,232,.4);border-color:rgba(66,133,244,.75)}'+
    /* the giant watermark — the mark itself, monumental, bleeding off the card */
    '.ce-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.ce-ir:hover .ce-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    /* the emblem — transparent mark in a glowing ring, same treatment both cards */
    '.ce-ir-ic{width:72px;height:72px;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(138,180,248,.3),0 0 32px rgba(66,133,244,.55)}'+
    '.ce-ir-ic img{width:52px;height:52px;object-fit:contain;display:block;filter:drop-shadow(0 2px 10px rgba(0,0,0,.55))}'+
    '.ce-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.ce-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#8AB4F8;display:flex;align-items:center;gap:7px}'+
    '.ce-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(52,168,83,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(52,168,83,.6)}70%{box-shadow:0 0 0 8px rgba(52,168,83,0)}100%{box-shadow:0 0 0 0 rgba(52,168,83,0)}}'+
    '.ce-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.ce-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.ce-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BLUE+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.ce-ir:hover .ce-ir-go{gap:12px;box-shadow:0 4px 18px rgba(26,115,232,.55)}'+
    '@media(max-width:560px){.ce-ir{flex-wrap:wrap}.ce-ir-go{width:100%;justify-content:center}}'+
    /* EDGAR variant — federal weight: near-black + the gold of the seal, eagle front and center */
    '.ce-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.ce-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.ce-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.ce-ir.edgar .ce-ir-ic{box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.ce-ir.edgar .ce-ir-ic img{width:72px;height:72px}'+
    '.ce-ir.edgar .ce-ir-k{color:#E3C878}'+
    '.ce-ir.edgar .ce-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.ce-ir.edgar .ce-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.ce-ir.edgar:hover .ce-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.ce-ir.edgar .ce-ir-wm{opacity:.1}'+
    '.ce-ir.edgar:hover .ce-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="ce-srcrow">'+
  '<a class="ce-ir" href="'+CE_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Alphabet logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Alphabet Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from abc.xyz. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">Alphabet on EDGAR</span>'+
      '<span class="ce-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}
function ceQkey(q){ return String(q||'').replace(/\s/g,''); }
// Renders the quarter-pill selector (shared across the three phase panes via .ce-qblock filtering).
// The quarter selector is PHASE-AWARE: Setup & Watch List offer every quarter, but Post-Results
// only offers quarters that have a `results` block — the upcoming quarter has none, so it does not
// exist in that section (its data does not exist yet). The upcoming quarter is added to
// CALL_EARNINGS.quarters only once the PRIOR quarter's Post-Results (print + call highlights) is
// filled. data-ceqhas lists the phases each quarter is valid for.
function ceQPhases(q){
  var ph=['setup','watch'];
  if(q.results) ph.push('results');
  return ph;
}
function ceQPills(){
  return '<div class="ce-qpills">'+CALL_EARNINGS.quarters.map(function(q,i){
    return '<button type="button" class="ce-qpill'+(i===0?' active':'')+'" data-ceqsel="'+esc(ceQkey(q.q))+'" data-ceqhas="'+ceQPhases(q).join(' ')+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="ce-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
// A · The Setup — the grid is BUILT FROM THE ARCHIVE, not hand-authored. CE_CONS carries the
// consensus and both growth bases, so the 13 cells, their YoY and their QoQ can never drift out of
// sync with the file. What stays hand-authored per quarter: `setup.us` (Summit's own number) and
// `setup.notes` (the caveat pop-ups), both keyed by metric name. (§6a-ii.)
function ceFmtV(u,v){
  if(v==null) return null;
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v)+'B';
  if(u==='B')  return (+v)+'B';
  return String(v);
}
function ceGrowth(m,qi,base){
  if(m.t==='basis') return null;                       // never a growth number off a basis mismatch
  var c=m.qr[qi]?m.qr[qi][3]:null;
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(c==null||b==null||!b) return null;
  return Math.round((c/b-1)*100);
}
function ceChip(g){
  if(g==null) return '';
  var up=g>=0;
  return '<span class="ce-gchip" style="color:'+(up?'#0a8f4c':'#C5221F')+'">'+(up?'+':'−')+Math.abs(g)+'%</span>';
}
// Margin lens (EXCEPTION, headline only): Gross profit / Operating income / EBITDA also carry a
// margin = the metric ÷ revenue, computed per column. Street margin = BBG metric ÷ BBG revenue;
// Summit margin = Summit metric ÷ Summit revenue (falls back to BBG revenue if Summit has none).
// Toggled in the estimates bar; lives in the SAME headline cell, never a new box. (§6a-ii.)
var CE_MARGIN_ON={'Gross profit':1,'Operating income':1,'EBITDA':1};
function ceMarginPct(v, rev){ return (v==null||rev==null||!rev)?null:Math.round((v/rev*100)*10)/10; }
function ceMChip(p){ return p==null?'':'<span class="ce-mm">'+p+'% mgn</span>'; }
// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.
function ceMarginRow(cur, baseYoy, baseQoq){
  if(cur==null) return '';
  return '<div class="ce-mrow"><span class="ce-mrow-l">margin</span>'+
    '<span class="ce-mrow-v">'+cur+'%'+
      (baseYoy!=null?'<span class="ce-mm-b yoy"> (prev '+baseYoy+'%)</span>':'')+
      (baseQoq!=null?'<span class="ce-mm-b qoq"> (prev '+baseQoq+'%)</span>':'')+
    '</span></div>';
}
// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null;      // BBG revenue for the quarter
  var revS=(us['Revenue']?us['Revenue'].v:null)||revC;   // Summit revenue, else BBG
  var revQy=revM?revM.qy[qi]:null, revQq=revM?revM.qq[qi]:null;   // revenue actual 1yr / 1q earlier
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    var mgn=CE_MARGIN_ON[m.k];
    var street=(c==null)
      ? '<span class="ce-empty">—</span>'+(m.t==='nocons'?'<span class="ce-nocons" title="The archive carries no forward estimate for this line — actuals only">no est.</span>':'')
      : ceFmtV(m.u,c)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq'))+'</span>';
    // margin row uses the Street (consensus) margin — the line the growth chips are about.
    var mRow=mgn?ceMarginRow(ceMarginPct(c,revC), ceMarginPct(m.qy[qi],revQy), ceMarginPct(m.qq[qi],revQq)):'';
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mcell-v">'+
        '<div class="ce-val ce-val-cons"><span class="ce-val-lab">Street</span>'+street+'</div>'+
        '<div class="ce-val ce-val-us"><span class="ce-val-lab">Summit</span>'+(uv?ceFmtV(m.u,uv.v):'<span class="ce-empty">—</span>')+'</div>'+
        mRow+
      '</div></div>';
  }).join('')+'</div>';
}
function ceGridStyle(){
  return '<style>'+
    '.ce-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px;margin:4px 0}'+
    '.ce-mcell{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:8px 10px;background:#fff}'+
    '.ce-mcell.cust{border-left-color:'+BRAND2+'}'+
    '.ce-mcell.flagged{border-left-color:'+GRAY+';opacity:.72}'+
    '.ce-mcell-k{font-size:10px;font-weight:700;color:var(--mu);display:flex;align-items:center;gap:4px;line-height:1.3;min-height:26px}'+
    '.ce-mcell-v{margin-top:3px}'+
    '.ce-mcell .ce-val{display:flex;align-items:baseline;gap:5px;font-size:14px;font-weight:900;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-mcell .ce-val-lab{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none;width:38px}'+
    '.ce-gchip{font-size:10px;font-weight:800;margin-left:2px}'+
    '.ce-mm{display:none}'+'.ce-mm-b{display:none;font-size:9px;font-weight:700;color:var(--mu);white-space:nowrap}'+'.ce-evwrap[data-mm="on"][data-g="yoy"] .ce-mm-b.yoy{display:inline}'+'.ce-evwrap[data-mm="on"][data-g="qoq"] .ce-mm-b.qoq{display:inline}'+'.ce-mrow{display:none;align-items:baseline;gap:5px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--bdr)}'+'.ce-evwrap[data-mm="on"] .ce-mrow{display:flex}'+'.ce-mrow-l{font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none}'+'.ce-mrow-v{font-size:11px;font-weight:900;color:'+PURPLE+';font-variant-numeric:tabular-nums}'+
    '.ce-evwrap[data-mm="on"] .ce-mm{display:inline}'+
    '.ce-nocons{font-size:8.5px;font-weight:800;color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:1px 6px;margin-left:6px}'+
    /* the growth lens: CSS-driven, so switching does not re-render the grid */
    '.ce-evwrap[data-g="yoy"] .ce-gq,.ce-evwrap[data-g="qoq"] .ce-gy,'+
    '.ce-evwrap[data-g="off"] .ce-gy,.ce-evwrap[data-g="off"] .ce-gq{display:none}'+
    '.ce-gseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.ce-gseg button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+
    '.ce-gseg button.active{background:var(--navy);color:#fff}'+'.ce-vdf{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+'.ce-vdf button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+'.ce-vdf button.active{background:var(--navy);color:#fff}'+
    '.ce-fz[data-ev="cons"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdu="inline"]){display:none}'+
    '.ce-dbt{display:flex;flex-direction:column;gap:5px}'+
    '.ce-dbt-r{display:grid;grid-template-columns:1.3fr 1fr 1fr 70px;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:9px;padding:7px 12px;background:#fff}'+
    '.ce-dbt-r.above{border-left-color:#0a8f4c}.ce-dbt-r.below{border-left-color:'+RED+'}'+
    '.ce-dbt-k{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-dbt-v{font-size:11px;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-dbt-v b{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-dbt-d{font-size:12px;font-weight:900;text-align:right;font-variant-numeric:tabular-nums}'+
    '.ce-dbt-r.above .ce-dbt-d{color:#0a8f4c}.ce-dbt-r.below .ce-dbt-d{color:'+RED+'}'+
    '.ce-dbt-none{border:1px dashed var(--bdr);border-radius:10px;padding:10px 13px;font-size:11px;'+
      'line-height:1.55;color:var(--mu);background:#FAFBFD}'+
    '@media(max-width:640px){.ce-dbt-r{grid-template-columns:1fr auto}.ce-dbt-v{display:none}}'+
  '</style>';
}
function ceSetupBody(c){
  var h=ceStyle()+ceGridStyle();
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{}, hasGrid=(CE_CONS.q.indexOf(u.q)>=0);
    if(hasGrid){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?((frozen?'Reported <b>':'Reports <b>')+esc(u.date)+'</b>.'):'')+'</p>';
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="ce-ev-pill active" data-ceev="cons">Consensus</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="us">Summit</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="both">Both</button>'+
        '</span>'+
        // Growth lens. `fq-3` and `fq0` are both reported actuals, so the same consensus cell can
        // be read against either base — that is exactly why the archive carries fq-3.
        '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
          '<button type="button" data-ceg="qoq">QoQ</button>'+
          '<button type="button" data-ceg="off">Off</button></span>'+
        '<span class="ce-gseg"><button type="button" data-cemm="on">Margin</button>'+
          '<button type="button" class="active" data-cemm="off">Hide mgn</button></span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="ce-evwrap" data-ev="cons" data-g="yoy">';
      b+='<div class="ce-row-cap">Headline — every company, always</div>'+ceGrid(u,'head');
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — GOOGL</div>'+ceGrid(u,'cust');
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Growth chips are computed from the archive: <b>YoY</b> against <code>fq-3</code>, <b>QoQ</b> against <code>fq0</code> — both reported actuals. '+
         '<b>Street</b> = Bloomberg (BST), hardcoded from the export only. <b>Summit</b> = our own expectation. <b>?</b> = a number with a caveat worth knowing. '+
         'A line with no chip either has no like-for-like base or failed the basis test.</div>';
      // ── The debate — a LINE-BY-LINE comparison, not a paragraph ────────────────────────────
      // It answers one question: where does Summit differ from the Street, and by how much. Built
      // from the same two columns the grid shows, so it cannot disagree with them. Lines where we
      // have no number of our own are listed explicitly rather than silently dropped — an empty
      // Summit column IS the state of the work, and hiding it would misrepresent it (§6a-ii).
      var d=st.debate, dqi=CE_CONS.q.indexOf(u.q), dus=st.us||{};
      if(dqi>=0){
        var diffs=[], nous=[];
        CE_CONS.m.forEach(function(m){
          var c=m.qr[dqi]?m.qr[dqi][3]:null, uv=dus[m.k]?dus[m.k].v:null;
          if(c==null) return;
          if(uv==null){ nous.push(m.k); return; }
          diffs.push({ k:m.k, c:c, u:uv, d:((uv/c-1)*100), t:m.t, un:m.u });
        });
        diffs.sort(function(x,z){ return Math.abs(z.d)-Math.abs(x.d); });
        b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The debate — where Summit differs from the Street</b>'+
           '<span style="color:var(--mu);font-weight:600;font-size:10px"> · sorted by the size of the gap</span></div>';
        if(diffs.length){
          b+='<div class="ce-dbt">'+diffs.map(function(x){
            var side=(x.d>=0)?'above':'below';
            return '<div class="ce-dbt-r '+side+'">'+
              '<span class="ce-dbt-k">'+esc(x.k)+'</span>'+
              '<span class="ce-dbt-v"><b>Street</b> '+ceFmtV(x.un,x.c)+'</span>'+
              '<span class="ce-dbt-v"><b>Summit</b> '+ceFmtV(x.un,x.u)+'</span>'+
              '<span class="ce-dbt-d">'+(x.d>=0?'+':'−')+Math.abs(x.d).toFixed(1)+'%</span></div>';
          }).join('')+'</div>';
        }
        if(nous.length){
          b+='<div class="ce-dbt-none"><b>No Summit number yet on '+nous.length+' of '+(nous.length+diffs.length)+' lines:</b> '+
             esc(nous.join(' · '))+'.<br>Until those are filled the debate is the Street against itself — '+
             'the grid above still shows what it expects, and the track record below shows how often it has been wrong.</div>';
        }
        if(d&&d.synth) b+='<div class="ce-synth">'+d.synth+'</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    }
    if(st.pricedIn||st.oneLiner){
      if(!hasGrid){
        b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
        if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      } else {
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The contemporaneous read — written before the print, never rewritten</b></div>';
      }
      if(st.pricedIn) b+='<div class="ce-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="ce-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  h+=ceAnnualBody();
  return h;
}
// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; GOOGL does not, so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (GOOGL_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit pending): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('GOOGL_SETUP')+'</div>';
}
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'GOOGL_SETUP'); }   // (kept name: called from buildSub / phase-tab wiring)
function wireCeAnnual(root){ /* the engine self-wires via initResults->wireResults; the chart builds on Setup visibility (gBuildCeAnnual). */ }

// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// v3 (Jul 2026): the list is OURS, not the model's, and it is backed by the WL_ROWS table above.
// One card per row. idSfx keeps pop-up ids unique between the per-quarter and the cross-quarter
// (flat) renders; qLabel shows the quarter chip in the flat view; editable adds the ✎/✕ controls
// (live quarter only — frozen quarters are the historical record and stay read-only).
function ceWatchItem(w, qk, idSfx, qLabel, editable){
  var deep='';
  if(w.seededBy) deep+='<p style="border-left:3px solid '+PURPLE+';padding-left:9px;margin-bottom:10px"><b>'+(w.seededBy.tripped?'Seeded by a TRIPPED trigger':'Seeded by')+' '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>';
  // `definition` renders on the card itself now, so it is deliberately NOT repeated in here.
  if(w.src) deep+='<p><b>Why it earned a slot:</b> '+w.src+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?ceReg('watchwhy-'+(w.id||qk+'-'+(w.rank||0))+idSfx, esc(w.theme), deep):null;
  // No rank badge on the card by design (v2.6): a visible 1–5 goes stale the moment a theme is
  // removed, and renumbering the survivors implies a re-ranking we did not do. `rank` orders only.
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  // The chain, made visible: this item exists because the PRIOR quarter's call left it open.
  var seed=w.seededBy?'<span class="ce-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ thesis line broke in '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
  var open=wlOpen(w);
  var ctl=editable?'<span class="ce-w-ctl"><button type="button" class="ce-w-ed" data-wledit="'+esc(w.id||'')+'" title="Edit this theme (and close its hook by filling Tracking until)">✎</button>'+
    '<button type="button" class="ce-w-del" data-wldel="'+esc(w.id||'')+'" title="Remove this theme">✕</button></span>':'';
  return '<div class="ce-w" data-wltags="'+esc(tagsAttr)+'" data-wlid="'+esc(w.id||'')+'" data-wlopen="'+(open?'1':'0')+'">'+
    '<div class="ce-w-top"><span class="ce-w-dot" aria-hidden="true"></span><div class="ce-w-metric">'+esc(w.theme)+'</div>'+seed+
    (w.trackUntil?'<span class="ce-w-closed" title="Hook closed in '+esc(w.trackUntil)+'">closed</span>':'')+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(66,133,244,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="ce-why-btn ov-clickable" data-detail="ce:'+why+'" style="margin:0">'+(w.thread?'the thread':'background')+' ›</span>':'')+ctl+'</div>'+
    (w.definition?'<div class="ce-w-def">'+w.definition+'</div>':'')+
    '<div class="ce-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="ce-w-chip tag">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.trackSince?'<span class="ce-w-chip since"><b>Tracking since:</b> '+esc(w.trackSince)+'</span>':'')+
      (w.trackUntil?'<span class="ce-w-chip until"><b>Tracking until:</b> '+esc(w.trackUntil)+'</span>':'')+
    '</div>'+
  '</div>';
}
// The Add / Edit form. Tags are picked from the existing vocabulary (multi-select chips) and new
// ones can be created inline — a new tag is appended to the filter bar, so it becomes available
// to every theme from that moment on.
// The tracking-since / tracking-until fields are DROPDOWNS, not free text. A hand-typed
// "Q3 26" / "3Q2026" / "Q3-2026" breaks the open/closed filter and the cross-quarter sort
// silently, and the value is only ever one of a known, short list. Range: Q1 2024 through the
// quarter Earnings is currently on, derived from CALL_EARNINGS so it advances by itself (§6a-v).
function ceQuarterOpts(sel, blankLabel){
  var latest=CALL_EARNINGS.quarters[0] ? ceQnum(CALL_EARNINGS.quarters[0].q) : null;
  var start=2024*4+1;                                  // Q1 2024
  var end=latest||(2026*4+3);
  var out='<option value="">'+esc(blankLabel||'—')+'</option>';
  for(var t=end; t>=start; t--){
    var lab='Q'+(((t-1)%4)+1)+' '+Math.floor((t-1)/4);
    out+='<option value="'+esc(lab)+'"'+(sel===lab?' selected':'')+'>'+esc(lab)+'</option>';
  }
  return out;
}
function ceWlForm(){
  return '<div class="ce-wl-addform" hidden>'+
    '<div class="ce-wl-fh"><b class="ce-wl-fh-t">New theme</b><span class="ce-wl-fh-s">the hunt list is ours — the model does not get a vote on this tab</span></div>'+
    '<input type="hidden" data-wlf="id">'+
    '<label class="ce-wl-lb">Theme <span>what we are hunting</span></label>'+
    '<input class="ce-wl-in" data-wlf="theme" placeholder="e.g. Regulatory: DOJ ad-tech remedies">'+
    '<label class="ce-wl-lb">Tags <span>click to select · they drive the cross-quarter filter</span></label>'+
    '<div class="ce-wl-tagpick" data-wlf="tagpick"></div>'+
    '<div class="ce-wl-newtag"><input class="ce-wl-in" data-wlf="newtag" placeholder="create a new tag (e.g. regulatory)"><button type="button" class="ce-wl-newtag-go">+ add tag</button></div>'+
    '<label class="ce-wl-lb">Definition <span>required — what the theme means, in our words</span></label>'+
    '<textarea class="ce-wl-in ce-wl-ta" data-wlf="definition" rows="3" placeholder="What this theme is and why it moves the thesis"></textarea>'+
    '<div class="ce-wl-2col">'+
      '<div><label class="ce-wl-lb">Tracking since</label><select class="ce-wl-in" data-wlf="trackSince">'+ceQuarterOpts(null,'— pick a quarter —')+'</select></div>'+
      '<div><label class="ce-wl-lb">Tracking until <span>empty = still open</span></label><select class="ce-wl-in" data-wlf="trackUntil">'+ceQuarterOpts(null,'— still open —')+'</select></div>'+
    '</div>'+
    '<div class="ce-wl-frow"><button type="button" class="ce-wl-add-go">Add to the live list</button>'+
      '<button type="button" class="ce-wl-cancel">cancel</button>'+
      '<span class="ave-subh-note">Lives for this session only. Persisting = COPY the table at the bottom and hardcode it into <code>WL_ROWS</code>.</span></div>'+
  '</div>';
}
// The table itself — the storage view, and the round-trip out. Regenerated from WL_ROWS on every
// add / edit / delete, with COPY (TSV, pasteable) and COPY JSON (exact, hardcodable).
// `rank` is the sort key, labelled "order" — it is never rendered on a card, so removing a theme
// cannot leave a gap in a visible numbering.
var WL_COLS=[
  {k:'id',l:'id'},{k:'q',l:'quarter'},{k:'rank',l:'order'},{k:'theme',l:'theme'},
  {k:'tags',l:'tags'},{k:'definition',l:'definition'},
  {k:'trackSince',l:'tracking since'},{k:'trackUntil',l:'tracking until'}
];
function wlCellText(r, k){
  var v=r[k];
  if(k==='tags') return (v||[]).join(', ');
  if(v==null) return '';
  return String(v).replace(/<[^>]+>/g,'');
}
// The live proof that the table tracks the cards: both numbers move as rows are added, closed or
// deleted. It is re-rendered by the same rerender() that rebuilds the rows.
function wlCount(){
  var open=WL_ROWS.filter(wlOpen).length;
  return WL_ROWS.length+' rows · '+open+' open hook'+(open===1?'':'s')+' · live';
}
function ceWlTableRows(){
  return WL_ROWS.map(function(r){
    return '<tr'+(wlOpen(r)?' class="wl-open"':'')+'>'+WL_COLS.map(function(c){
      var t=wlCellText(r,c.k);
      var cls=(c.k==='theme')?' class="wl-th"':((c.k==='id'||c.k==='q'||c.k==='rank')?' class="wl-key"':'');
      return '<td'+cls+'>'+(t?esc(t):'<span class="ce-empty">—</span>')+'</td>';
    }).join('')+'</tr>';
  }).join('');
}
function ceWlTable(){
  return '<div class="ce-wl-tbl-wrap" id="googlWlTable">'+
    '<div class="ce-wl-tbl-h">'+
      '<span class="ce-wl-tbl-t">The Watch List table — one row per theme</span>'+
      '<span class="ce-wl-tbl-s">the storage view</span>'+
      // Replaces the old "refresh" button, which was a no-op: the table already rebuilds on every
      // add / edit / delete, so pressing it could never change anything and just read as broken.
      // This counter DOES change (rows, and how many hooks are open), which is the actual proof.
      '<span class="ce-wl-tbl-n">'+wlCount()+'</span>'+
      // Hiding the table must NOT disable the round-trip: COPY builds its payload from WL_ROWS,
      // never from the rendered rows, so it works whether or not the table is on screen (§6a-v).
      '<button type="button" class="ce-wl-copy alt" data-wltoggle="1">show table</button>'+
      '<button type="button" class="ce-wl-copy" data-wlcopy="tsv">COPY</button>'+
      '<button type="button" class="ce-wl-copy alt" data-wlcopy="json">copy JSON</button>'+
    '</div>'+
    '<div class="ce-wl-tbl-sc" data-wltblbody hidden>'+'<table class="ce-wl-tbl"><thead><tr>'+
      WL_COLS.map(function(c){ return '<th>'+esc(c.l)+'</th>'; }).join('')+
    '</tr></thead><tbody class="ce-wl-tbody">'+ceWlTableRows()+'</tbody></table></div>'+
    '<div class="ave-subh-note" style="margin-top:7px"><b>The round-trip:</b> add / edit / delete themes above → this table updates → hit <b>COPY</b> (tab-separated, drops straight into a sheet) or <b>copy JSON</b> (exact) → paste it back and it gets hardcoded into <code>WL_ROWS</code> in a commit. Editing from the portal <i>persistently</i> needs Supabase — pending assignment, see docs/EARNINGS_CONVENTIONS.md §6f.</div>'+
  '</div>';
}
function ceWatchBody(c){
  var h=ceStyle();
  // A one-line reminder of the append-only cadence, above the theme filter.
  h+='<div class="ce-wl-hint">🔁 <b>How quarters advance:</b> a new <i>upcoming</i> quarter appears in Setup & Watch List <b>only once the prior quarter\'s Post-Results (print + call highlights) is filled</b>. Fill Q(n) Post-Results → then Q(n+1) opens for prep.</div>';
  // ── Tag bar: select themes ACROSS quarters (multi-select). Empty selection = per-quarter view. ──
  h+='<div class="ce-wl-tagbar"><span class="ce-wl-bar-k">Filter by theme (across quarters):</span>'+
    wlTags().map(function(t){ return '<button type="button" class="ce-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="ce-wl-tag ce-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="ce-wl-add-btn">+ Add theme</button>'+
  '</div>';
  // ── Tracking-window filter: the hooks we have open vs the ones we closed. ──
  h+='<div class="ce-wl-tagbar" style="margin-top:-4px"><span class="ce-wl-bar-k">Tracking window:</span>'+
    '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
      '<button type="button" class="ce-wl-win active" data-wlwin="all">All</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="open">Open hooks</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="closed">Closed</button>'+
    '</span>'+
    '<span class="ave-subh-note" style="margin-left:4px">A theme is <b>open</b> while it has a <i>Tracking since</i> and no <i>Tracking until</i>. We open and close them by hand.</span>'+
  '</div>';
  h+=ceWlForm();
  // Per-quarter blocks (default view). The live quarter renders only OPEN hooks — that IS the list.
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var wl=wlFor(u.q, !frozen);
    b+='<p class="ov-lede"><b>'+(frozen?'The list as it was frozen — ':'Things to hunt — ')+esc(u.q)+'</b>'+
      (frozen?' <span style="color:var(--mu);font-weight:600">(scored afterwards in Post-Results)</span>':' <span style="color:var(--mu);font-weight:600">(the open hooks — a <i>Tracking since</i> with no <i>Tracking until</i>)</span>')+
      '. Each card carries its <b>definition</b> — what the theme means in our words — its <b>tags</b>, and its <b>tracking window</b>. Tap <b>the thread ›</b> for the grounding and the quarter-by-quarter evolution. Ordered by weight, deliberately <b>not numbered</b>: a visible 1–5 goes stale the moment a theme is removed.</p>';
    b+='<div class="ce-legend"><span class="ce-legend-i"><b>How to read the cards:</b></span>'+
      '<span class="ce-legend-i"><span class="ce-seed">left open by Q2 2026</span> it is on the list because last quarter\'s call did not settle it</span>'+
      '<span class="ce-legend-i"><span class="ce-w-chip since"><b>Tracking since:</b> Q4 2024</span> with no <i>Tracking until</i> ⇒ the hook is still open</span>'+
      (frozen?'':'<span class="ce-legend-i"><span class="ce-w-ed" style="pointer-events:none">✎</span> edit — including closing the hook by filling <i>Tracking until</i></span>')+
    '</div>';
    if(!wl.length){ b+='<div class="ce-note">No open hooks for '+esc(u.q)+' yet — add themes with <b>+ Add theme</b> above.</div>'; }
    else{ b+='<div class="ce-watch">'+wl.map(function(w){ return ceWatchItem(w, qk, '', null, !frozen); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results; its <code>newQuestions</code> seeded the next quarter.':'Ours to curate: Post-Results lets the model run (numbers + call highlights), but what earns a slot here is our call. Frozen once the quarter opens.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  // Flat cross-quarter container (hidden until a tag is selected)
  h+='<div class="ce-wl-all" hidden>';
  h+='<div class="ce-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="ce-watch">'+WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('')+'</div>';
  h+='</div>';
  // ── The table: the storage view + the copy-out that closes the loop back into the code. ──
  h+=ceWlTable();
  // ── FUSED: the full multi-year theme record (was the standalone Evolution ▸ Earnings Calls tab,
  // dissolved Jul 2026 — no two tabs on the same call highlights). Lives here, under the Watch List. ──
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="ce-band" style="--bc:'+BRAND+'"><span class="ce-band-i">▤</span><span class="ce-band-t">The theme record — every thread, across all calls</span><span class="ce-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="ce-band-l"></span></div>';
  h+=callsBody();
  h+='</div>';
  return h;
}
// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
// Scorecard result kinds. beat/miss/inline score against a consensus line; `nodisc` (a KPI
// management STOPPED disclosing) and `nocons` (a number nobody modelled) are not beats or misses —
// they are their own signal, and conflating them with a miss loses the point.
var CE_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
var CE_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
// ─── The frozen Street number, straight from the archive ────────────────────────────────────────
// "Frozen expectations" used to mean whatever prose someone typed into `scorecard[].cons` before
// the print ("high-teens growth modeled"). That is a memory, not a record. The archive gives us
// the real thing: the snapshot immediately BEFORE the print carries the consensus that actually
// stood going in, so the comparison is reconstructed from data instead of recalled.
// Renders as a tile strip at the top of Post-Results. Revenue shows no surprise — different basis.
// ─── cePrintBlock · THE print, in one place ─────────────────────────────────────────────────────
// Formerly two blocks that said the same thing twice: the archive "frozen strip" (consensus →
// print, 13 standardized lines) and a hand-authored "scorecard — ranked by surprise". Merged.
// The archive is the spine — every number and every surprise is computed from BBG_CONSENSUS.txt,
// so it cannot drift. The hand-authored layer contributes only what a number cannot: a per-metric
// note (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`). Any
// bespoke row that is NOT one of the standardized metrics (an old "funding flip" card, a
// disclosure with no consensus like Gemini app MAU) is intentionally dropped — the standardized
// view is the metrics the archive tracks, ranked by how far each landed from the Street. (§6a-ii.)
function ceVerdict(m, c, a, surp){
  if(a==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(c==null) return {l:'no est.', c:'#7A5AF8', k:'noest'};       // nocons / noact: a print, nothing to score
  if(surp==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(Math.abs(surp)<2) return {l:CE_RES.inline.l, c:CE_RES.inline.c, k:'inline'};
  return surp>0 ? {l:CE_RES.beat.l, c:CE_RES.beat.c, k:'beat'} : {l:CE_RES.miss.l, c:CE_RES.miss.c, k:'miss'};
}
function cePrintBlock(qLabel, r, us){
  var qi=CE_CONS.q.indexOf(qLabel); if(qi<0) return '';
  r=r||{}; us=us||{};
  var notes=r.notes||{}, watch=r.watch||{};
  // Revenue for the quarter — the margin denominator (§6a-vi). Street, Summit, and the print.
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null, revA=revM?revM.qa[qi]:null;
  var revS=(us['Revenue']&&us['Revenue'].v!=null)?us['Revenue'].v:revC;   // Summit revenue, else BBG
  var tiles=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;   // Summit's FROZEN expectation for this line
    if(c==null&&a==null&&uexp==null) return null;
    // Surprise = actual / expected − 1, computed for BOTH bases. The estimate-view toggle (vs Street
    // ⇄ vs Summit) swaps which one drives the expected value, the surprise and the verdict.
    var cSurp=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uSurp=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    var cV=ceVerdict(m,c,a,cSurp), uV=ceVerdict(m,uexp,a,uSurp);
    // growth against the print, both bases — the shared YoY/QoQ lens (independent of the estimate view)
    var g=function(base){
      var bv=(base==='qoq')?m.qq[qi]:m.qy[qi];
      if(a==null||bv==null||!bv) return '<span class="ce-fz-g-e">—</span>';
      var gv=Math.round((a/bv-1)*100);
      return '<span style="color:'+(gv>=0?'#0a8f4c':'#C5221F')+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
    };
    var surpTag=function(s){ return (s==null)?'':'<span class="ce-fz-d '+(s>=0?'up':'dn')+'">'+(s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%</span>'; };
    // MARGIN (GP/OpInc/EBITDA only) — toggled, and it is EXPECTED-vs-REALIZED, not YoY/QoQ. Expected
    // = the margin IMPLIED by the estimate (estimate's metric ÷ estimate's revenue, same estimate on
    // both sides): Street = c/revC, Summit = uexp/revS. Realized = the print's own (a/revA). We show
    // the gap in pts. Basis caveat (see the ? pop-up): the Street's forward revenue runs below the
    // print, so the Street-implied margin sits above realized by construction — the Δ is partly that.
    var mgnOn=CE_MARGIN_ON[m.k], mReal=mgnOn?ceMarginPct(a,revA):null;
    var mExpC=mgnOn?ceMarginPct(c,revC):null, mExpU=mgnOn?ceMarginPct(uexp,revS):null;
    var dPts=function(exp){ if(mReal==null||exp==null) return ''; var d=Math.round((mReal-exp)*10)/10;
      return '<span class="ce-fz-mdl '+(d>=0?'up':'dn')+'">'+(d>=0?'+':'−')+Math.abs(d)+' pts</span>'; };
    var mRow='';
    if(mgnOn&&mReal!=null){
      mRow='<div class="ce-fz-mrow"><span class="ce-fz-gl">margin</span>'+
        '<span class="ce-fz-mexp ce-exp-cons">exp '+(mExpC!=null?mExpC+'%':'—')+dPts(mExpC)+'</span>'+
        '<span class="ce-fz-mexp ce-exp-us">exp '+(mExpU!=null?mExpU+'%':'—')+dPts(mExpU)+'</span>'+
        '<span class="ce-fz-ar">→</span><span class="ce-fz-mreal">'+mReal+'% realized</span>'+
        ceQ('mgn-'+ceQkey(qLabel)+'-'+ceQkey(m.k),'Margin — expected vs realized',
          '<p><b>Expected</b> is the margin <i>implied by the estimate</i>: the estimate\'s metric ÷ the estimate\'s own revenue (Street = BBG ÷ BBG, Summit = ours ÷ ours). <b>Realized</b> is the print\'s own margin (actual ÷ actual). This is expectation vs outcome for the quarter — <b>there is no YoY/QoQ on the margin</b>.</p>'+
          '<p><b>Basis caveat:</b> the Street\'s forward revenue runs materially <i>below</i> the print (FX + gross-vs-net), so the Street-implied margin sits above the realized one by construction. Read the Δ with that offset in mind — part of a negative gap is the revenue basis, not a margin miss.</p>')+
        '</div>';
    }
    var note=notes[m.k];
    var qb=note?ceReg('resnote-'+ceQkey(qLabel)+'-'+ceQkey(m.k), note.t||m.k, note.h||note):null;
    // watch[m.k] is the frozen Watch-List RANK; resolve it to the theme text for the chip.
    var wrRank=watch[m.k], wrTheme=null;
    if(wrRank){ var wrow=wlFor(qLabel,false).filter(function(x){ return x.rank===wrRank; })[0]; wrTheme=wrow?wrow.theme:null; }
    var wr=wrTheme||(wrRank?('Watch #'+wrRank):null);
    // data-vdc / data-vdu carry BOTH verdicts so the verdict filter is estimate-view-aware in pure CSS.
    return { sort:(cSurp==null?-1:Math.abs(cSurp)), html:
      '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'"'+(qb?' data-detail="ce:'+qb+'"':'')+'>'+
        '<div class="ce-fz-k">'+esc(m.k)+
          '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+'</span>'+
          '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+'</span></div>'+
        '<div class="ce-fz-r"><span class="ce-fz-c ce-exp-cons">'+(c==null?'—':ceTkFmt(m.u,c))+'</span>'+
          '<span class="ce-fz-c ce-exp-us">'+(uexp==null?'—':ceTkFmt(m.u,uexp))+'</span>'+
          '<span class="ce-fz-ar">→</span><span class="ce-fz-a">'+(a==null?'—':ceTkFmt(m.u,a))+'</span>'+
          '<span class="ce-fz-dw ce-exp-cons">'+surpTag(cSurp)+'</span><span class="ce-fz-dw ce-exp-us">'+surpTag(uSurp)+'</span></div>'+
        '<div class="ce-fz-gr"><span class="ce-fz-gl">growth</span>'+
          '<span class="ce-gy">'+g('yoy')+'</span><span class="ce-gq">'+g('qoq')+'</span></div>'+
        mRow+
        (wr?'<div class="ce-fz-wl" title="On the frozen Watch List: '+esc(wr)+'">on the list</div>':'')+
        (qb?'<div class="ce-fz-more">＋ detail</div>':'')+
      '</div>' };
  }).filter(Boolean);
  if(!tiles.length) return '';
  tiles.sort(function(x,z){ return z.sort-x.sort; });   // biggest surprise first (Street basis)
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="off"><div class="ce-fz-h">The print — ranked by surprise'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from <code>BBG_CONSENSUS.txt</code>: the last snapshot before the print carries the consensus (<code>fq+1</code>), a later snapshot carries the print (<code>fq0</code>). Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>vs Street ⇄ vs Summit</b> — swaps which frozen expectation the print is scored against (Street = Bloomberg, Summit = ours). No "Both" — one basis at a time. Where Summit had no number, Summit view reads <b>no est.</b></li>'+
      '<li><b>Margin</b> — GP / Operating income / EBITDA carry an expected-vs-realized margin (the estimate-implied margin → the print\'s own), Δ in pts. No YoY/QoQ on the margin.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise; <b>no est.</b> where that basis had no number</li>'+
      '<li><b>on the list</b> — this line was on the Watch List we froze before the call</li></ul>'+
      '<p>Lines the archive does not track are not shown here — a disclosure with no consensus (e.g. an app-MAU rung) is a supplemental call note (below the scorecard), not a scored line.</p>')+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg" style="margin-left:auto"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button></span>'+
    '<span class="ce-gseg"><button type="button" data-fzmm="on">Margin</button>'+
      '<button type="button" class="active" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div><div class="ce-fz-g" data-vdf-host>'+tiles.map(function(t){ return t.html; }).join('')+'</div>'+
    '<div class="ce-fz-f">Expectation (frozen, 1 quarter out) → the print → the print\'s own growth. Toggle <b>vs Street ⇄ vs Summit</b> and <b>Margin</b> above. Ranked by |surprise vs Street|. Source: <code>BBG_CONSENSUS.txt</code> + Summit.</div></div>';
}
// A collapsible block — secondary depth is folded away by default so the phase reads as a page,
// not a wall. Wired by the generic `.ov-collap-h` handler already in init().
function ceFold(title, sub, body, open){
  return '<div class="ov-collap ce-fold'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+
    '<span class="ce-fold-t">'+title+'</span>'+(sub?'<span class="ce-fold-s">'+sub+'</span>':'')+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+body+'</div></div>';
}
function cePhaseStyle(){
  return '<style>'+
    '.ce-fz{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;margin-bottom:14px;background:#FBFCFE}'+
    '.ce-fz-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin-bottom:9px}'+
    '.ce-fz-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}'+
    '@media(max-width:900px){.ce-fz-g{grid-template-columns:repeat(2,1fr)}}'+
    '@media(max-width:520px){.ce-fz-g{grid-template-columns:1fr}}'+
    '.ce-fz-t{border:1px solid var(--bdr);border-radius:9px;padding:7px 9px;background:#fff}'+
    '.ce-fz-t.basis{opacity:.62}'+
    '.ce-fz-k{font-size:9.5px;font-weight:700;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.ce-fz-r{display:flex;align-items:baseline;gap:4px;margin-top:2px;font-variant-numeric:tabular-nums}'+
    '.ce-fz-c{font-size:11px;color:var(--mu);font-weight:700}'+
    '.ce-fz-ar{font-size:9px;color:var(--mu)}'+
    '.ce-fz-a{font-size:13px;font-weight:900;color:var(--navy)}'+
    '.ce-fz-d{font-size:9.5px;font-weight:800;margin-left:auto}'+
    '.ce-fz-d.up{color:#0a8f4c}.ce-fz-d.dn{color:'+RED+'}.ce-fz-d.na{color:var(--mu);font-weight:700}'+
    '.ce-fz-f{font-size:9.5px;color:var(--mu);margin-top:8px}'+'.ce-fz-t{position:relative;transition:.14s}'+'.ce-fz-t[data-detail]{cursor:pointer}'+'.ce-fz-t[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.10);transform:translateY(-1px)}'+'.ce-fz-vd{margin-left:auto;font-size:8.5px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}'+'.ce-fz-k{display:flex;align-items:center;gap:5px}'+'.ce-fz-wl{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:'+BLUE+';margin-top:5px}'+'.ce-fz-more{position:absolute;right:9px;bottom:7px;font-size:8.5px;font-weight:800;color:'+BLUE+'}'+'.ce-fz-h{display:flex;align-items:center;gap:6px}'+'.ce-fz-gr{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:9.5px;font-weight:800}'+'.ce-fz-gl{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+'.ce-fz-mgn{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:11px;font-weight:900;color:'+PURPLE+'}'+'.ce-fz-mexp{font-size:9px;font-weight:700;color:var(--mu)}'+'.ce-fz-g-e{color:var(--mu);font-weight:600}'+'.ce-fz[data-g="yoy"] .ce-gq,.ce-fz[data-g="qoq"] .ce-gy,'+'.ce-fz[data-g="off"] .ce-fz-gr{display:none}'+
    /* estimate view (vs Street ⇄ vs Summit) — pure-CSS swap of expected value, surprise & verdict */
    '.ce-fz-h{flex-wrap:wrap}'+
    '.ce-vd-us,.ce-exp-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-cons,.ce-fz[data-ev="us"] .ce-exp-cons{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-us,.ce-fz[data-ev="us"] .ce-exp-us{display:inline}'+
    '.ce-fz-dw{margin-left:auto}'+
    /* margin row — expected(estimate-implied) → realized, toggled by data-mm; NO YoY/QoQ here */
    '.ce-fz-mrow{display:none;align-items:baseline;gap:5px;margin-top:4px;padding-top:4px;border-top:1px dashed var(--bdr);font-size:9.5px;font-weight:800}'+
    '.ce-fz[data-mm="on"] .ce-fz-mrow{display:flex;flex-wrap:wrap}'+
    '.ce-fz-mreal{font-size:11px;font-weight:900;color:'+PURPLE+'}'+
    '.ce-fz-mdl{font-weight:800;margin-left:3px}.ce-fz-mdl.up{color:#0a8f4c}.ce-fz-mdl.dn{color:'+RED+'}'+
    /* folds — secondary depth, closed by default */
    '.ce-fold{border:1px solid var(--bdr);border-radius:11px;margin:0 0 10px;overflow:hidden;background:#fff}'+
    '.ce-fold .ov-collap-h{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;background:#FAFBFD;'+
      'padding:9px 13px;cursor:pointer;font-family:inherit}'+
    '.ce-fold .ov-collap-h:hover{background:#F2F6FB}'+
    '.ce-fold .ov-collap-ic{font-size:10px;color:var(--mu)}'+
    '.ce-fold-t{font-size:11px;font-weight:800;color:var(--navy)}'+
    '.ce-fold-s{font-size:10px;color:var(--mu);font-weight:600;margin-left:auto;text-align:right}'+
    '.ce-fold .ov-collap-b{padding:12px 13px}'+
    /* the print, as cards rather than full-width rows */
    '.ce-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}'+
    '@media(max-width:760px){.ce-cards{grid-template-columns:1fr}}'+
    '.ce-card{border:1px solid var(--bdr);border-left:4px solid var(--sc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff}'+
    '.ce-card-h{display:flex;align-items:center;gap:6px;flex-wrap:wrap}'+
    '.ce-card-m{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-card-v{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--sc);margin-left:auto}'+
    '.ce-card-b{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;margin-top:6px;font-size:10.5px;line-height:1.45}'+
    '.ce-card-l{color:var(--mu);font-weight:700;white-space:nowrap}'+
    '.ce-card-x{color:var(--navy)}'+
    '.ce-card-f{display:flex;align-items:center;gap:6px;margin-top:7px}'+
    '.ce-chip{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 7px;border-radius:999px}'+
    '.ce-chip.list{background:rgba(26,115,232,.12);color:'+BLUE+'}'+
    '.ce-chip.hi{background:rgba(234,67,53,.12);color:'+RED+'}'+
    '.ce-chip.md{background:rgba(251,188,5,.18);color:#7A5B02}'+
    '.ce-chip.lo{background:#EEF1F5;color:var(--mu)}'+
    /* "Also on the call" — one box, a plain list, each point a native <details> dropdown (v2.9) */
    '.ce-alsobox{margin-top:18px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    '.ce-alsobox-h{padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr);display:flex;flex-direction:column;gap:2px}'+
    '.ce-alsobox-h>b{font-size:12px;color:var(--navy);font-weight:800}'+
    '.ce-alsobox-sub{font-size:9.5px;color:var(--mu);font-weight:600;line-height:1.4}'+
    '.ce-alsolist{display:flex;flex-direction:column}'+
    '.ce-also-i{border-bottom:1px solid var(--bdr)}'+'.ce-also-i:last-child{border-bottom:0}'+
    '.ce-also-s{display:flex;align-items:center;gap:8px;padding:9px 13px;cursor:pointer;list-style:none;font-size:11.5px;font-weight:600;color:var(--navy);line-height:1.45}'+
    '.ce-also-s::-webkit-details-marker{display:none}'+
    '.ce-also-s:hover{background:#FAFBFD}'+
    '.ce-also-tag{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--tc,#6b7684);border:1px solid currentColor;border-radius:999px;padding:1px 7px;flex:none;opacity:.85}'+
    '.ce-also-hd{flex:1;min-width:0}'+
    '.ce-also-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-also-i[open] .ce-also-ar{transform:rotate(180deg)}'+
    '.ce-also-body{padding:0 13px 12px 13px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.55;background:#FBFCFE}'+
    '.ce-also-body p{margin:6px 0}'+
    /* highlights, as cards */
    '.ce-hcards{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}'+
    '@media(max-width:760px){.ce-hcards{grid-template-columns:1fr}}'+
    '.ce-hcard{border:1px solid var(--bdr);border-top:3px solid var(--hc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-hcard:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-hcard-t{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--hc)}'+
    '.ce-hcard-h{font-size:11px;color:var(--navy);line-height:1.5;margin-top:3px}'+
    '.ce-hcard-f{display:flex;align-items:center;gap:6px;margin-top:6px}'+
    '.ce-hcard-more{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-left:auto}'+
    '.ce-bandh{display:flex;align-items:center;gap:7px;margin:12px 0 7px}'+
    '.ce-bandh-i{font-size:12px;color:var(--bc)}'+
    '.ce-bandh-t{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--bc)}'+
    '.ce-bandh-s{font-size:9.5px;color:var(--mu);font-weight:600}'+
    /* thesis red-lines — verdict word, plain line, depth behind "why" */
    '.ce-rl{display:flex;flex-direction:column;gap:5px}'+
    '.ce-rl-row{display:grid;grid-template-columns:74px 1fr auto;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid #0a8f4c;border-radius:9px;padding:8px 12px;background:#fff}'+
    '.ce-rl-row.trip{border-left-color:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-rl-v{font-size:9.5px;font-weight:900;letter-spacing:.06em;color:#0a8f4c}'+
    '.ce-rl-row.trip .ce-rl-v{color:'+RED+'}'+
    '.ce-rl-l{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-rl-w{font-size:9.5px;font-weight:800;color:'+BLUE+';white-space:nowrap;cursor:pointer}'+
    '@media(max-width:600px){.ce-rl-row{grid-template-columns:64px 1fr}.ce-rl-w{display:none}}'+
    /* what this tees up — short boxes, always visible */
    '.ce-tee{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-tee-c{border:1px solid var(--bdr);border-top:3px solid '+AMBER+';border-radius:10px;'+
      'padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-tee-c:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-tee-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-tee-m{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-top:6px}'+
    /* the triage strip — three bands, always all three, colour is the meaning */
    '.ce-tri{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 10px}'+
    '@media(max-width:700px){.ce-tri{grid-template-columns:1fr}}'+
    '.ce-tri-b{display:grid;grid-template-columns:auto auto 1fr;grid-template-areas:"i t n" "s s s";'+
      'gap:2px 7px;align-items:center;text-align:left;border:1px solid var(--bdr);border-top:3px solid var(--bc);'+
      'border-radius:10px;padding:8px 11px;background:#fff;font:inherit;cursor:pointer;transition:.14s;opacity:.45}'+
    '.ce-tri-b.active{opacity:1;box-shadow:0 2px 10px rgba(16,24,40,.07)}'+
    '.ce-tri-b:hover{border-color:var(--bc)}'+
    '.ce-tri-i{grid-area:i;font-size:12px;color:var(--bc);line-height:1}'+
    '.ce-tri-t{grid-area:t;font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:var(--bc)}'+
    '.ce-tri-n{grid-area:n;justify-self:end;font-size:11px;font-weight:900;color:var(--navy)}'+
    '.ce-tri-s{grid-area:s;font-size:9.5px;color:var(--mu);font-weight:600}'+
    '.ce-hcard-b{margin-right:5px;color:var(--hc)}'+
    '.ce-hcard[hidden]{display:none}'+
    '.ce-bandh-n{margin-left:auto;font-size:9.5px;font-weight:800;color:var(--mu)}'+
  '</style>';
}
function ceResultsBody(c){
  var h=ceStyle()+cePhaseStyle();
  h+=CALL_EARNINGS.quarters.map(function(q,qi){
    var qk=ceQkey(q.q);
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    var r=q.results;
    if(!r){ b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b></p>'+
      '<div class="ce-note">Empty until the print lands.</div></div>'; return b; }
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the print, scored against what was frozen going in.</b> '+
       'Toggle <b>vs Street ⇄ vs Summit</b> to score the print against either expectation, and <b>Margin</b> for the expected-implied → realized margin. Below the scorecard, a supplemental <i>“Also on the call”</i> aside carries the colour — not the meeting-critical items.</p>';
    // 1 · THE print — archive spine + hand-authored notes, ranked by surprise (one block now).
    // Pass the quarter's FROZEN Summit expectations (setup.us) so the print can be scored against
    // Street OR Summit via the vs-Street ⇄ vs-Summit toggle (§6a-iii).
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    // 2 · the one-paragraph take
    if(r.headline) b+='<div class="ce-take" style="border-left-color:'+BRAND2+'">🎯 '+r.headline+'</div>';
    // 3 · thesis red-line check — folded unless something tripped
    if(r.thesisCheck&&r.thesisCheck.length){
      // One word for the verdict, then the red-line ITSELF in plain language. The reasoning goes
      // behind "why" — it is the interesting part, but it is not what you scan for (§6a-iv).
      var tc=r.thesisCheck.slice().sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); });
      var nTrip=tc.filter(function(t){ return t.tripped; }).length;
      b+='<div class="ov-diagram-cap" style="margin:14px 0 6px"><b>Thesis red-lines</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· '+
         (nTrip?('<b style="color:'+RED+'">'+nTrip+' tripped</b> of '+tc.length):('all '+tc.length+' held'))+'</span></div>';
      b+='<div class="ce-rl">'+tc.map(function(t,i){
        var id=t.note?ceReg('rl-'+qk+'-'+i, (t.tripped?'TRIPPED — ':'HELD — ')+t.line, '<p>'+t.note+'</p>'):null;
        return '<div class="ce-rl-row'+(t.tripped?' trip':'')+'">'+
          '<span class="ce-rl-v">'+(t.tripped?'TRIPPED':'HELD')+'</span>'+
          '<span class="ce-rl-l">'+esc(t.line)+'</span>'+
          (id?'<span class="ce-rl-w ov-clickable" data-detail="ce:'+id+'">why ＋</span>':'<span></span>')+
        '</div>';
      }).join('')+'</div>';
    }
    // 5 · what the numbers tee up — VISIBLE, as short boxes. Folding it away was hiding the
    // thing you walk into the call with; the fix was to shorten it, not to bury it (§6a-iv).
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>What this tees up for the call</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· go in hunting these</span></div>';
      b+='<div class="ce-tee">'+r.intoCall.map(function(x,i){
        // Everything up to the first em-dash is the hook; the rest is the argument behind it.
        var mm=String(x).match(/^([\s\S]*?)\s+—\s+([\s\S]*)$/);
        var head=mm?mm[1]:x, body=mm?mm[2]:'';
        var id=body?ceReg('tee-'+qk+'-'+i, String(head).replace(/<[^>]+>/g,''), '<p>'+body+'</p>'):null;
        return '<div class="ce-tee-c"'+(id?' data-detail="ce:'+id+'"':'')+'>'+
          '<div class="ce-tee-h">'+head+'</div>'+
          (id?'<div class="ce-tee-m">＋ the ask</div>':'')+'</div>';
      }).join('')+'</div>';
    }
    // 6 · "Also on the call" — the supplemental colour (was the Post-Call tab, dissolved Jul 2026).
    // Deliberately styled as a secondary aside; NOT the tracking layer (that is the Watch List) and
    // NOT the meeting-critical read (that is the scorecard). Includes non-trackable call colour.
    b+=ceHighlightsBlock(q.call, qk);
    b+='<div class="ov-foot">Numbers scored against the frozen expectation — <b>Street</b> (<code>BBG_CONSENSUS.txt</code>) or <b>Summit</b> via the toggle; actuals = reported. The <i>Also on the call</i> aside is supplemental colour — the tracking layer is the Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// E · "Also on the call" ── the supplemental colour from the call, rendered inside Post-Results as a
// SINGLE BOX holding a plain LIST, each point with its own native <details> dropdown (v2.9). The
// Context/Logged band classification and the triage strip are GONE (Dani did not want them). Still
// not the meeting-critical read (that is the scorecard + the Watch List): a thesis-mover (band:'lead')
// is tracked on the Watch List and stays filtered out here. `take`/`threeMinutes`/`notBringing`/
// `newQuestions` survive as data (newQuestions still seeds the next Watch List) but are not rendered.
function ceHighlightsBlock(cc, qk){
  if(!cc||!cc.highlights||!cc.highlights.length) return '';
  // A thesis-mover (band:'lead') is tracked on the Watch List, never here — keep filtering it out.
  var hls=cc.highlights.filter(function(x){ return (x.band||'context')!=='lead'; });
  if(!hls.length) return '';
  var b='<div class="ce-alsobox"><div class="ce-alsobox-h"><b>Also on the call</b>'+
    '<span class="ce-alsobox-sub">supplemental colour — the meeting-critical items are the scorecard above and the Watch List</span></div>'+
    '<div class="ce-alsolist">';
  b+=hls.map(function(x){
    var tg=CE_HLTAG[x.tag]||null;
    var det=x.detail||'';
    if(x.open) det+='<p><b>Still open:</b> '+x.open+'</p>';
    return '<details class="ce-also-i">'+
      '<summary class="ce-also-s">'+
        (tg&&tg.l?'<span class="ce-also-tag" style="--tc:'+tg.c+'">'+esc(tg.l)+'</span>':'')+
        '<span class="ce-also-hd">'+x.head+'</span>'+
        (det?'<span class="ce-also-ar">▾</span>':'')+
      '</summary>'+
      (det?'<div class="ce-also-body">'+det+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></div>';
  return b;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — GOOGL_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/GOOGL.md + GOOGL-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var CE_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
// A promise open for one quarter and one open for four look identical without this. Age is the
// signal: how long has it been unreconciled, or how many quarters has the silence run?
function ceQnum(q){ var m=String(q||'').match(/Q(\d)\s+(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
function ceStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_EARNINGS.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=ceQnum(st.since), b=ceQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}
var GOOGL_THEMES=[
  { theme:'Google Cloud: acceleration + the backlog machine', st:{ k:'trend', since:'Q4 2024', last:'Q1 2026' },
    why:'From 26% to 63% growth in six quarters with backlog compounding faster than revenue — supply-constrained every single quarter, and it accelerated anyway.',
    updates:[
      { q:'Q4 2024', items:['+30% to $12B; "exited the year with <b>more demand than we had available capacity</b>."'] },
      { q:'Q1 2025', items:['+28%; "tight demand-supply; relatively higher capacity deployment towards the end of 2025."'] },
      { q:'Q2 2025', items:['+32%; backlog <b>$106B</b>; $1B+ deals in H1 = all of 2024; run-rate >$50B.'] },
      { q:'Q3 2025', items:['+34% to $15.2B; backlog <b>$155B (+46% QoQ)</b>; $1B+ deals in 9 months > prior 2 years combined; margin 23.7%.'] },
      { q:'Q4 2025', items:['<b>+48% to $17.7B</b>; backlog <b>$240B (+55% QoQ)</b>; run-rate >$70B; margin 30.1%; <b>8M Gemini Enterprise paid seats</b> in 4 months.'] },
      { q:'Q1 2026', items:['<b>+63% to $20B</b>; backlog <b>$462B (~2x QoQ)</b>; GenAI-product revenue +~800% YoY; margin 32.9% (17.8% LY); "revenue <b>would have been higher</b> if we could meet demand."'] },
      { q:'Q2 2026', items:['<b>+82% to $24.8B — "accelerated meaningfully even after excluding TPU system sales"</b> (the quality-of-growth sentence); backlog <b>$514B</b> (+$52B while converting $24.8B); margin <b>35.6%</b>; commitments exceeded by >50% (accel from 45%); Marketplace 7x; ~90% of Fortune 100 on Gemini Enterprise; Q3 bridge capacity flagged ("modest" margin cost).'] },
    ]},
  { theme:'The capex ladder & the depreciation drumbeat', st:{ k:'watch', since:'Q4 2023', last:'Q1 2026' },
    why:'Five consecutive raises, never a step down; management flags accelerating depreciation unprompted every quarter — candor against interest, and the core bear debate (FCF).',
    updates:[
      { q:'Q4 2023', items:['"2024 CapEx <b>notably larger</b> than 2023."'] },
      { q:'Q2 2024', items:['Sundar: <b>"the risk of underinvesting is dramatically greater than the risk of overinvesting."</b>'] },
      { q:'Q4 2024', items:['FY25 guide <b>$75B</b>; depreciation +28% in 2024 and accelerating.'] },
      { q:'Q2 2025', items:['Raised to <b>~$85B</b>; "further increase in 2026"; Q2 FCF only $5.3B (capex + tax timing).'] },
      { q:'Q3 2025', items:['Raised to <b>$91–93B</b>; depreciation +41% YoY.'] },
      { q:'Q4 2025', items:['FY26 guided <b>$175–185B (~2x FY25\'s $91.4B)</b>; FY25 depreciation +38% ($15.3B→$21.1B).'] },
      { q:'Q1 2026', items:['Raised to <b>$180–190B</b> (Intersect); <b>2027 "significantly increase"</b>; LT debt <b>$46.5B→$77.5B</b> in one quarter; quarterly FCF $10.1B.'] },
      { q:'Q2 2026', items:['<b>THIRD raise of 2026: $195–205B</b>; FCF <b>−$5.9B (first negative quarter)</b> and "will remain under pressure"; buybacks $0; <b>funding doctrine stated</b>: ops cash → debt ($16B→~$100B in 12 months) → equity ($49.6B done, "not planning to go back" ex-ATM); 2027 still an adjective — third consecutive deflection.'] },
    ]},
  { theme:'Search through the AI transition — & the standing phrase', st:{ k:'trend', since:'Q4 2023', last:'Q1 2026' },
    why:'The existential question settling empirically: Search ACCELERATED 10→12→12→15→17→19% while AIO/AI Mode rolled in. The monetization language has been frozen verbatim for 6+ calls: "at approximately the same rate" — the moment it changes, the story changes.',
    updates:[
      { q:'Q4 2023', items:['SGE in Labs; latency −40% (EN/US); Circle to Search launches.'] },
      { q:'Q1 2024', items:['SGE machine cost <b>−80%</b> since introduction; "confident we can manage the monetization transition."'] },
      { q:'Q4 2024', items:['AIO in 100+ countries → 1B+ users; <b>"monetization at approximately the same rate"</b> (the phrase is born); ads within AIO launch (mobile US).'] },
      { q:'Q1 2025', items:['+10% · AIO <b>1.5B users/mo</b> · AI Mode launches in Labs (queries 2x longer).'] },
      { q:'Q2 2025', items:['+12% · AIO 2B users · AI Mode <b>100M MAU</b> (US+India) · Lens +70% YoY.'] },
      { q:'Q3 2025', items:['+15% · AI Mode <b>75M DAU</b>, global in 40 languages · paid clicks +7% / CPC +7% · the phrase again, verbatim.'] },
      { q:'Q4 2025', items:['+17% · <b>Gemini 3 integrated into AI Mode & AIO</b> · AI Mode queries/user doubled; 1-in-6 queries non-text.'] },
      { q:'Q1 2026', items:['<b>+19%</b> · queries all-time high · NEW claim: ads coverage above the historical <b>~20% of queries has "upside"</b> (Philipp) · AI-response cost −30% since Gemini 3.'] },
      { q:'Q2 2026', items:['<b>THE PHRASE RETIRED</b> after six calls: "approximately the same rate" → <b>"continue to be encouraged… even as we\'ve EXPANDED AI Overviews to more commercial queries"</b> — the first language upgrade of the AI transition · +17% · AI Mode <b>>1B MAU</b> · <b>"billions of clicks to websites every week"</b> (web-defense, first quantification) · AI-Mode cost at lowest since launch · Q3 comp-lap + FX-flip warnings volunteered.'] },
    ]},
  { theme:'New-surface monetization: AI Mode ads · Direct Offers · Gemini app', st:{ k:'promise', since:'Q3 2025', last:'Q1 2026' },
    why:'The promise ladder to reconcile every quarter (ex-Promise-Tracker thread). AI-Mode ads climbed test → pilot → traction; Gemini-app ads remain a MUSING — "not rushing," three calls verbatim.',
    updates:[
      { q:'Q4 2024', items:['App ads: "very good ideas for native ad concepts… this year focused on the <b>subscription direction</b>."'] },
      { q:'Q3 2025', items:['<b>"Testing ads in AI Mode…</b> will continue to test and learn before we expand."'] },
      { q:'Q4 2025', items:['<b>Direct Offers pilot announced</b> (exclusive offers in AI Mode) · UCP agentic-commerce protocol launched with retail founding partners · app ads: <b>"not rushing."</b>'] },
      { q:'Q1 2026', items:['Direct Offers <b>"resonating"</b> — Gap, L\'Oréal, Chewy signed · new retailer ad format in test · <b>UCP adds Amazon, Meta, Microsoft, Salesforce, Stripe</b>; Ulta live in AI Mode/Gemini checkout · app ads still "not rushing" (3rd time).'] },
      { q:'Q2 2026', items:['Three rungs in one call: <b>Highlighted Answers</b> debut (sponsored links inside AI answers) · <b>Universal Cart</b> (cross-retailer checkout) · UCP live at <b>Target & Steve Madden</b> · Direct Offers → <b>IHG</b> (travel) · AI Max out of beta, <b>500K advertisers</b>, +15% conversions · app-ads stance: <b>total silence</b> — first call without "not rushing" since the thread began.'] },
    ]},
  { theme:'Gemini consumer scale — users, subscriptions… and one silence', st:{ k:'watch', since:'Q1 2026', last:'Q1 2026', silent:true },
    why:'The disclosure ladder ran hot for a year — then Q1 2026 skipped the app-MAU number. Silence after a streak of disclosure is a flag.',
    updates:[
      { q:'Q1 2025', items:['Gemini app <b>~35M DAU</b> (DOJ-trial disclosure, acknowledged in Q&A) · <b>270M paid subs</b>.'] },
      { q:'Q2 2025', items:['<b>450M MAU</b>; daily requests +50% QoQ.'] },
      { q:'Q3 2025', items:['<b>650M MAU</b>; queries 3x QoQ · <b>300M paid subs</b> crossed.'] },
      { q:'Q4 2025', items:['<b>750M MAU</b>; engagement/user sharply up post-Gemini 3 · <b>325M paid subs</b>.'] },
      { q:'Q1 2026', items:['<b>NO MAU update</b> (engagement color only — watch) · <b>350M paid subs</b>; strongest consumer-AI-plan quarter ever.'] },
      { q:'Q2 2026', items:['Silence resolved: <b>950M MAU</b> + a NEW metric — <b>DAU tripled in the last year</b> · Omni video creation +40% DAU since I/O · Gemini Spark rolling out internationally · YouTube subs growing faster than ads; Google One AI-plan-led.'] },
    ]},
  { theme:'Full stack & TPUs: from internal edge to external silicon business', st:{ k:'promise', since:'Q1 2026', last:'Q1 2026' },
    why:'A decade of TPUs became a commercial weapon — frontier labs on TPUs, then the first hardware SALES into customer data centers, with explicit revenue timing to hold them to.',
    updates:[
      { q:'Q3 2024', items:['Trillium (6th gen); cloud customers consume <b>8x the compute</b> vs 18 months prior; AIO query cost <b>−90% in 18 months</b>.'] },
      { q:'Q1 2025', items:['<b>Ironwood</b> (7th gen) — first designed for inference at scale; first with Blackwell GB200.'] },
      { q:'Q3 2025', items:['<b>Anthropic plans up to 1M TPUs</b>; GB300 first to ship.'] },
      { q:'Q4 2025', items:['Gemini serving unit cost <b>−78% over 2025</b>; accelerators serving frontier labs, capital-markets firms, governments.'] },
      { q:'Q1 2026', items:['<b>8th-gen TPU (8t/8i)</b> · <b>FIRST hardware sales into customers\' own data centers</b> · revenue "small % late 2026, <b>vast majority 2027</b>," lumpy by design · already inside the $462B backlog.'] },
      { q:'Q2 2026', items:['<b>Revenue recognition BEGAN</b> — first TPU systems delivered into customer DCs · "small this year, ramping as we exit 2026, vast majority 2027" · inventory-cost flag in CoR · <b>Blackstone</b> third-party-DC project named · margins asked twice, not broken out ("expansion of our TAM") · <b>Virgo Network</b> unveiled (1M accelerators as one supercomputer) · allocation priority stated: frontier AGI development first.'] },
    ]},
  { theme:'Partnership validation: Apple, OpenAI, Reliance, NVIDIA', st:{ k:'trend', since:'Q2 2025', last:'Q1 2026' },
    why:'The quiet external proof of the stack — rivals and giants keep choosing Google infrastructure.',
    updates:[
      { q:'Q2 2025', items:['<b>OpenAI begins using Google Cloud</b> ("very excited to be partnering with them"); PayPal multi-product deal.'] },
      { q:'Q3 2025', items:['<b>9 of the top-10 AI labs</b> on Google Cloud; NVIDIA GB300 first to ship.'] },
      { q:'Q4 2025', items:['<b>Apple: Google as preferred cloud provider + next-gen Apple foundation models built on Gemini</b> · Reliance Jio: Gemini to 500M consumers.'] },
      { q:'Q1 2026', items:['American Express, Vodafone agentic-data wins · <b>Wiz closed (Mar)</b> — "performance exceeded expectations"; low-single-digit pp Cloud-margin headwind for 2026.'] },
      { q:'Q2 2026', items:['<b>Booking Holdings</b> multi-year expansion (agentic dining on OpenTable) · infra wins: Ineffable Intelligence, Kakao, Deutsche Börse, <b>Pfizer & Roche</b>, World Labs · <b>SpaceX third-party compute deal</b> (analyst-cited on the call) · PepsiCo, Intel, HSBC, Bell Canada, Macy\'s on Gemini Enterprise.'] },
    ]},
  { theme:'Other Bets: pruning + Waymo\'s ramp', st:{ k:'trend', since:'Q4 2024', last:'Q1 2026' },
    why:'A portfolio quietly rationalized around Waymo, whose weekly rides double roughly every two quarters.',
    updates:[
      { q:'Q4 2024', items:['150K trips/week; Austin/Atlanta via Uber; Tokyo road trip; 6th-gen driver cuts hardware cost.'] },
      { q:'Q1 2025', items:['<b>250K paid rides/week (5x YoY)</b>; first Waymo business-model question ever on a call — "optionality" (Uber partnership, Moove fleet ops, OEMs, personal ownership).'] },
      { q:'Q2 2025', items:['100M+ fully-autonomous miles; Atlanta launch; teen accounts.'] },
      { q:'Q3 2025', items:['London (2026) + Tokyo announced; Dallas/Nashville/Denver/Seattle; airports + freeways.'] },
      { q:'Q4 2025', items:['<b>$16B round — largest ever</b> (Alphabet funded a significant portion → $2.1B SBC charge); 20M trips; 400K rides/week.'] },
      { q:'Q1 2026', items:['<b>500K rides/week (2x in <1yr)</b>; 11 US cities · <b>Verily deconsolidated</b>; GFiber→Astound (deconsolidates Q4) — the pruning is explicit.'] },
      { q:'Q2 2026', items:['Waymo <b>Oasis</b> vehicle debuts (first on the 6th-gen Driver) · Wing passes <b>1M deliveries</b> (+Papa John\'s) · <b>Isomorphic Labs raises $2B+</b> for AI drug design · external-structure question (Gawrelski) deflected: "focused on scaling."'] },
    ]},
  { theme:'Quiet decliners & headline distorters', st:{ k:'watch', since:'Q3 2025', last:'Q1 2026' },
    why:'The lines nobody asks about, and the one-offs that distort a print — read every headline through these.',
    updates:[
      { q:'Q3 2025', items:['<b>EC fine $3.5B</b> (G&A) — op margin 30.5% reported vs 33.9% ex-fine. Network −3% (structurally negative every quarter).'] },
      { q:'Q4 2025', items:['<b>Waymo $2.1B SBC charge</b> (R&D) — op income +16% reported, cleaner underlying +~22%. YouTube +9% on election lapping. Network −2%.'] },
      { q:'Q1 2026', items:['<b>Other income $37.7B</b> (unrealized gains) → EPS $5.11 "+82%" — optics, not operations · <b>FX +3pp tailwind to Services</b>, fading to ~1pp in Q2 (management volunteered the caveat) · Network −4%.'] },
      { q:'Q2 2026', items:['<b>OI&E +$98.0B</b> (equity marks; +$6.26 of EPS — the release quantifies it; $87.1B of marketable equity securities now disclosed) · FX +1pp → <b>slight Q3 headwind</b> · <b>Q3 Search comp-lap pre-flagged</b> (accel began 3Q25) · Network nearly flat (−1%) — best print in 2 years.'] },
    ]},
];
function callsByQuarter(){
  var map={}, order=[];
  GOOGL_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qval(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qval(b)-qval(a); });
  return { order:order, map:map };
}
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:var(--navy);color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.lpb-acc-item{border:1px solid var(--bdr);border-radius:10px;margin-bottom:8px;overflow:hidden}'+
    '.lpb-acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.lpb-acc-h:hover{background:#EEF2F6}.lpb-acc-ic{color:var(--mu);font-weight:800}'+
    '.lpb-acc-body{padding:12px 14px;display:none}.lpb-acc-item.open .lpb-acc-body{display:block}'+
    '.ov-chip{display:inline-block;font-size:10px;font-weight:800;color:'+BRAND+';background:rgba(66,133,244,0.10);border-radius:20px;padding:2px 9px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads from <b>11 earnings calls</b> (Q4 2023 → Q2 2026). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered in a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a promise open one quarter and one open four quarters are not the same thing, and a silence that has run two quarters is louder than a fresh one. Tap any row to expand.</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  h+='<div class="lpb-acc" id="googlCallsTheme">';
  GOOGL_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:ct.st;
    var st=CE_THST[sk]||CE_THST.watch;
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+ceStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    h+='<p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){
      h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span>';
      h+='<ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=callsByQuarter();
  h+='<div class="lpb-acc" id="googlCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){
      h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div>';
      h+='<ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Alphabet Q4 2023–Q1 2026 earnings calls and prepared remarks (docs/calls/GOOGL). Highlights are qualitative and contemporaneous — written from the perspective of each call. Promise-status themes absorb the dissolved Promise Tracker.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — data (Bloomberg export FY sums + SEC releases + the call record)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var FIN={
  years:['FY19','FY20','FY21','FY22','FY23','FY24','FY25'],
  rev:[161.9,182.5,257.6,282.8,307.4,350.0,402.8],
  services:[158.1,168.6,237.5,253.5,272.5,304.9,342.7],
  cloud:[8.9,13.1,19.2,26.3,33.1,43.2,58.7],
  otherbets:[0.7,0.7,0.8,1.1,1.5,1.6,1.5],
  opinc:[34.2,41.2,78.7,74.8,84.3,112.4,129.0],
  opmargin:[21.1,22.6,30.6,26.5,27.4,32.1,32.0],
  svcMargin:[27.6,32.4,38.7,33.8,35.2,39.8,40.7],
  ni:[34.2,38.4,81.1,60.0,73.8,100.1,132.2],
  fcf:[33.1,42.8,67.0,60.0,69.5,72.8,73.3],
  capex:[23.5,22.3,24.6,31.5,32.3,52.5,91.4],
  cloudMQ:{ labels:['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
            vals:[2.6,4.9,3.2,9.4,9.4,11.3,17.1,17.5,17.8,20.7,23.7,30.1,32.9] },
};

// Deep-dive segment cards (numbers live here, unlike the Overview's qualitative defs).
var DD_SEGS=[
  { id:'services', ic:'🟦', n:'Google Services', col:BRAND, kpi:'$342.7B · 85% of revenue',
    teaser:'Search & other ads, YouTube, Network, plus subscriptions/platforms/devices — the cash engine (40.7% segment margin).',
    detail:'<p><b>The engine.</b> FY2025 revenue $342.7B (+12%) at a <b>40.7% segment operating margin</b> ($139.4B of segment profit). Inside: Search & other ~$224B, YouTube ads ~$40B, Network ~$30B (structurally declining), subscriptions/platforms/devices ~$48B.</p><p><b>The AI read:</b> Search ACCELERATED through the AI transition (+10→+19% across 2025-26) while AI Overviews/AI Mode rolled into the core product — monetization held "at approximately the same rate," and management now claims upside to the historical ~20% ads-coverage of queries.</p>' },
  { id:'cloud', ic:'🟩', n:'Google Cloud', col:BRAND2, kpi:'$58.7B · fastest grower',
    teaser:'GCP (compute + AI infra + models) and Workspace — 6.6x revenue in six years, margin 2.6% → 32.9% in three.',
    detail:'<p><b>The acceleration story.</b> FY2025 revenue $58.7B (+36%), exiting at a >$70B run-rate and accelerating: +48% in Q4 2025, <b>+63% in Q1 2026</b> to $20B — with backlog exploding $106B → $155B → $240B → <b>$462B</b> in four quarters (>50% converts to revenue within 24 months, per the CFO).</p><p><b>The margin ladder is the quiet miracle:</b> segment operating margin went 2.6% (1Q23) → <b>32.9% (1Q26)</b> — from a loss-making also-ran to bulge-bracket software economics while growth sped up. Enterprise AI is now Cloud\'s primary growth driver (GenAI-product revenue +~800% YoY in Q1 2026).</p>' },
  { id:'bets', ic:'🟨', n:'Other Bets', col:YELLOW, kpi:'~$1.5B · option value',
    teaser:'Waymo above all — plus Wing and the X pipeline. Now explicitly pruned (Verily and GFiber deconsolidated).',
    detail:'<p><b>Waymo is the bet that matters:</b> 500K fully-autonomous paid rides/week (2x in under a year), 11 US cities, UK/Japan next — and a <b>$16B external round (the largest private raise ever)</b> that finally put a market price on it.</p><p><b>The portfolio is being rationalized:</b> Verily deconsolidated (Q1 2026), GFiber merging into Astound (deconsolidates Q4 2026). Revenue ~$1.5B, operating loss ~$2-3B/yr — option value, deliberately smaller.</p>' },
];

// Customers — who actually pays Alphabet (four demand pools).
var DD_CUST=[
  { ic:'📣', n:'Advertisers', tag:'~73% of revenue', col:BRAND,
    teaser:'Millions of businesses buying auction ads — retail & financial services lead every quarter.',
    detail:'<p>From SMBs to global brands, priced almost entirely by <b>real-time auction</b>. Retail is the #1 vertical (holiday quarters: Black Friday + Cyber Monday each >$1B of ad revenue), then financial services (insurance) and health.</p><p><b>The AI shift:</b> >30% of Search ad spend already runs through AI-enabled campaigns (AI Max, PMax); Gemini-built creatives (~70M assets in Q4 2025 alone) and intent-matching let ads reach "longer, more complex queries previously difficult to monetize."</p>' },
  { ic:'🏢', n:'Enterprises & governments', tag:'Cloud demand pool', col:BRAND2,
    teaser:'120K+ enterprises build with Gemini; 95% of the top-20 SaaS companies; 8M Gemini Enterprise paid seats.',
    detail:'<p>The Cloud customer base: from AI-native unicorns (nearly all GenAI unicorns use Google Cloud; 9 of the top-10 AI labs) to Apple, Mercedes-Benz, Citi, American Express and governments.</p><p><b>Behavior:</b> new-customer acquisition doubled YoY (Q1 2026), $100M–$1B deals doubled, customers outpace their committed spend by 45% — and AI customers use 1.8x as many products as non-AI customers.</p>' },
  { ic:'👤', n:'Consumers (subscriptions)', tag:'350M paid subs', col:PURPLE,
    teaser:'YouTube Premium/Music/TV, Google One and the AI plans — the fastest-compounding demand pool.',
    detail:'<p>270M (Q1 2025) → 300M → 325M → <b>350M paid subscriptions</b> (Q1 2026), led by YouTube and Google One — with the AI plans (Pro/Ultra) now the marginal driver ("our strongest quarter ever for consumer AI plans").</p><p>This is the pool that turns AI engagement into non-ads revenue — and the reason management keeps saying "not rushing" on Gemini-app ads: subscriptions are working first.</p>' },
  { ic:'🧑‍💻', n:'Developers & partners', tag:'the ecosystem moat', col:AMBER,
    teaser:'13M+ developers on the generative models; 500M+ open-model downloads; OEMs distributing Android/Gemini.',
    detail:'<p>13M+ developers have built with Google\'s generative models; open models (Gemma) passed 500M downloads; 16B tokens/min flow through the direct APIs (up from 10B a quarter earlier).</p><p>Distribution partners multiply reach: Samsung (Gemini across Galaxy), Reliance Jio (500M consumers), and the UCP council (Amazon, Meta, Microsoft, Salesforce, Stripe + retail founders) for agentic commerce.</p>' },
];

// Industry arenas (qualitative competitive map — consistent with the scatter's listed peers;
// private rivals appear HERE because they have no market multiple).
var DD_ARENA=[
  { id:'answers', ic:'🔍', n:'Search / answers', tag:'defending the core', col:BRAND,
    teaser:'vs ChatGPT, Perplexity, Meta AI — the existential front.',
    detail:'<p>The one arena where Alphabet plays defense. The empirical score so far: Search <b>accelerated</b> (10→19%) through the AI transition, queries at all-time highs, AI Mode with 75M+ DAU. The threat is real but the "cannibalization" prediction keeps failing — the company\'s own framing: an <b>expansionary moment</b>.</p><p>Watch: the standing phrase ("monetization at approximately the same rate") and the Gemini-app race vs ChatGPT (last disclosed: 750M MAU).</p>' },
  { id:'cloud', ic:'☁️', n:'Cloud & AI infrastructure', tag:'#3 closing fast', col:BRAND2,
    teaser:'vs AWS and Azure — growing ~2x the leaders\' rate.',
    detail:'<p>Still #3 by share, but growing at +63% vs the leaders\' ~20-35%, with a differentiated pitch: <b>the only full first-party stack</b> (TPUs → Gemini models → Vertex/Gemini Enterprise → security). Proof points rivals can\'t match: Apple as a customer, 9-of-10 AI labs, Anthropic\'s 1M-TPU plan, OpenAI using Google Cloud.</p>' },
  { id:'video', ic:'📺', n:'Video & attention', tag:'leading', col:RED,
    teaser:'vs TikTok, Netflix, Meta Reels — #1 US streaming watch time, 3 straight years.',
    detail:'<p>YouTube has led US streaming watch time for three consecutive years (Nielsen), monetizing both sides: ads (~$40B/yr) + subscriptions (>$20B/yr run rate across Premium/Music/TV). Shorts out-earns in-stream per watch-hour in the US — the TikTok defense turned profitable.</p>' },
  { id:'models', ic:'🧠', n:'Frontier models', tag:'co-leader', col:PURPLE,
    teaser:'vs OpenAI, Anthropic — while SELLING infrastructure to both sides.',
    detail:'<p>Gemini 3 took the fastest-adoption crown internally and the leaderboards externally; the unique position is structural: Alphabet <b>competes with the labs at the frontier while renting them silicon</b> (Anthropic\'s TPUs, OpenAI on Google Cloud). Heads it wins the model race; tails it sells the shovels.</p>' },
  { id:'commerce', ic:'🛒', n:'Agentic commerce', tag:'emerging', col:AMBER,
    teaser:'vs Amazon — laying the open rails (UCP) instead of owning the store.',
    detail:'<p>The strategy is visible in the UCP protocol: co-opt the ecosystem (Shopify, Target, Wayfair… and now Amazon itself on the council) so agent-era shopping runs through open rails Google helped define — monetized via Direct Offers and AI-Mode formats rather than a marketplace take-rate.</p>' },
];

// Guidance — Alphabet gives no revenue/EPS guidance; it commits to a philosophy (cards → pop-ups).
var G_GUIDE=[
  { id:'capex', ic:'🏗️', col:BRAND, k:'Invest ahead of demand', v:'FY26 $180–190B',
    teaser:'The only number they guide — and they re-raise it with proof attached.',
    d:'<p>The capex guide is the closest thing to formal guidance Alphabet gives: $75B → $85B → $91–93B (FY25) → $175–185B → <b>$180–190B (FY26)</b>, with 2027 "significantly" higher. The pattern: every raise arrives WITH a demand proof (backlog, Cloud acceleration) in the same print.</p><p>Sundar\'s standing frame (Q2 2024): <i>"the risk of underinvesting is dramatically greater than the risk of overinvesting."</i></p>' },
  { id:'deprec', ic:'📉', col:AMBER, k:'Warn on depreciation', v:'unprompted, every call',
    teaser:'The candor commitment: they flag the P&L pressure before anyone asks.',
    d:'<p>Every call since Q4 2024, the CFO volunteers the same warning: capex → depreciation acceleration (+28% FY24, +38% FY25, "meaningfully increase" FY26) plus data-center opex (energy). Candor against interest — and the honest yardstick for judging the margin story.</p>' },
  { id:'search', ic:'🔍', col:BRAND2, k:'"An expansionary moment"', v:'for Search',
    teaser:'The qualitative commitment on the existential question.',
    d:'<p>The repeated, testable claim: AI <b>expands</b> Search (more queries, more complex queries, more commercial queries) rather than cannibalizing it — backed each quarter by query growth at all-time highs and the frozen monetization phrase ("at approximately the same rate"). The day this language changes, the thesis changes.</p>' },
  { id:'margin', ic:'⚖️', col:PURPLE, k:'Efficiency funds the build', v:'margins up while capex 2x',
    teaser:'Op margin expanded through the largest capex ramp in corporate history.',
    d:'<p>The implicit commitment: AI-driven efficiency (serving costs −78% in 2025; ~50% of code agent-written; agents in back-office flows) grows faster than the depreciation bill. Evidence so far: op margin 27% (FY23) → 32% (FY24/25) → 36.1% (Q1 2026) <i>during</i> the ramp.</p>' },
  { id:'capret', ic:'💵', col:RED, k:'Return what\'s left', v:'dividend +5%/yr · buybacks flex',
    teaser:'Dividend (born 2024) rises steadily; buybacks are the shock absorber.',
    d:'<p>First-ever dividend Apr 2024 ($0.20/qtr), raised +5% in 2025 and +5% again in Apr 2026 — a steady, signal-bearing line. Buybacks are the flex: $62B (2023) → ~$70B returned (2024) → slowing to $5.5B in Q4 2025 as capex bit. Watch buybacks, not the dividend, for the cash-squeeze tell.</p>' },
];

// Track record — the operators, rated (cards → pop-ups).
var G_TRACK=[
  { id:'pichai', n:'Sundar Pichai', role:'CEO, Alphabet & Google', since:'2004 · CEO 2015/2019', rate:'delivering', col:BRAND2,
    line:'From the Bard stumble to Gemini 3 leadership in under two years — the AI turnaround is his record now.',
    detail:'<p><b>The case for:</b> took the company from "code red" (2023) to co-leadership at the frontier — Gemini 3 fastest-adopted model in company history, Search accelerating THROUGH the transition, Cloud from afterthought to +63%, 11 straight double-digit quarters. Reorganized (DeepMind merge) and re-platformed the whole company on its own silicon.</p><p><b>The case against:</b> was late to ship generative AI despite inventing the Transformer; the capex bill of the catch-up is now the bear case. Verdict lives in the 2026-27 conversion.</p>' },
  { id:'anat', n:'Anat Ashkenazi', role:'CFO (since Jul 2024)', since:'ex-Eli Lilly CFO', rate:'delivering', col:BRAND2,
    line:'Owns the capex-ladder communication: every raise delivered WITH its proof, depreciation flagged unprompted.',
    detail:'<p>Inherited the largest capital program in corporate history and made it legible: ROIC framing, per-call depreciation candor, backlog-conversion disclosure (>50% in 24 months), and the funding shift (first big debt raises) executed without drama. Ex-Lilly CFO — pharma discipline applied to hyperscale.</p>' },
  { id:'porat', n:'Ruth Porat', role:'President & Chief Investment Officer', since:'CFO 2015–2024', rate:'delivering', col:BRAND2,
    line:'The discipline-era CFO — made "Other Bets" a bounded, accountable line and built the buyback; now runs the Bets\' capital strategy.',
    detail:'<p><b>The case for:</b> as CFO (2015–2024, ex-Morgan Stanley CFO) she brought the cost discipline that repriced the whole equity story — segment reporting that turned Other Bets into a bounded, accountable number, the first buyback program, and margin expansion carried into the AI build. As President & CIO since 2024 she oversees Alphabet\'s investment portfolio and the Bets\' external-capital strategy — Waymo\'s $16B round (the largest private raise ever) and the Verily/GFiber deconsolidations bear her signature.</p><p><b>The case against:</b> the CIO mandate is newer and less proven than the CFO record, and the Bets still lose money — the payoff, Waymo aside, is unproven.</p>' },
  { id:'kurian', n:'Thomas Kurian', role:'CEO, Google Cloud (since 2019)', since:'ex-Oracle', rate:'delivering', col:BRAND2,
    line:'The margin ladder is his: 2.6% → 32.9% in three years, while growth ACCELERATED to +63%.',
    detail:'<p>Took a loss-making #3 and built bulge-bracket software economics: FY19 $8.9B revenue / deep losses → FY25 $58.7B / $13.9B segment profit — then Q1 2026 at +63% with a $462B backlog. The enterprise-AI portfolio (Gemini Enterprise: 8M paid seats in 4 months) gave Cloud its own product identity instead of an AWS shadow.</p>' },
  { id:'hassabis', n:'Demis Hassabis', role:'CEO, Google DeepMind', since:'DeepMind 2010 · merged 2023', rate:'delivering', col:BRAND2,
    line:'Nobel laureate (2024) whose lab went from research jewel to the revenue engine\'s core input.',
    detail:'<p>AlphaFold → Nobel Prize in Chemistry; then the practical pivot: Gemini 1 → 3 in 24 months, closing the gap to OpenAI and taking leaderboard leadership, with the serving-cost curve (−78% in 2025) that makes deployment economics work. The research-to-product transmission is the company\'s core differentiation now.</p>' },
  { id:'schindler', n:'Philipp Schindler', role:'SVP & Chief Business Officer', since:'at Google since 2005', rate:'delivering', col:BRAND2,
    line:'Carried the ads franchise through the AI transition without a single down quarter — and tells you the caveats himself.',
    detail:'<p>The ads P&L through the most feared transition in its history: Search accelerating, AI campaign adoption >30% of spend, new formats (Direct Offers, UCP) laid before the old ones eroded. Notably candid — volunteered the FX caveat on his own beat (Q1 2026).</p>' },
  { id:'mohan', n:'Neal Mohan', role:'CEO, YouTube (since 2023)', since:'at Google since 2008', rate:'delivering', col:BRAND2,
    line:'#1 US streamer three straight years; Shorts monetization gap closed; subs >$20B run-rate.',
    detail:'<p>Defended against TikTok (Shorts now out-earns in-stream per watch-hour in the US), moved YouTube to the living room (#1 in streaming watch time, 3 years running), and built the twin-engine model — >$60B/yr across ads + subscriptions, with NFL Sunday Ticket its flagship bet.</p>' },
];

// ═══ Deep-dive bodies ═══════════════════════════════════════════════════════════════════════════
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function ddCards(arr, kind){
  return '<div class="gdd-cards">'+arr.map(function(x,i){
    return '<div class="gdd-card ov-clickable" data-detail="'+kind+':'+i+'" style="border-top:3px solid '+(x.col||BRAND)+'">'+
      '<div class="gdd-card-h"><span class="gdd-ic">'+x.ic+'</span><span class="gdd-card-n">'+esc(x.n)+'</span>'+(x.tag||x.kpi?'<span class="gdd-tag">'+esc(x.tag||x.kpi)+'</span>':'')+'</div>'+
      '<div class="gdd-card-t">'+esc(x.teaser)+'</div>'+
      '<div class="gdd-more">More ›</div></div>';
  }).join('')+'</div>';
}
function segmentsBody(c){
  var h='';
  h+=ddStat([['5T+','searches / year'],['15','products ≥500M users'],['350M','paid subscriptions'],['$462B','Cloud backlog (Q1 26)'],['16B','API tokens / minute'],['190.8K','employees (FY25)']]);
  h+='<p class="ov-lede" style="margin-top:14px"><b>One machine, three reported segments.</b> Services throws off the cash (40.7% margin) that funds the AI build-out; Cloud converts the build-out into the fastest-growing hyperscale P&L in the market; Other Bets holds the priced option (Waymo). Tap a card for the numbers.</p>';
  h+='<div class="ov-diagram" style="height:280px;position:relative;margin:6px 0 12px"><canvas id="gChartSeg"></canvas></div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 12px">Revenue by segment, FY2019 → FY2025 ($B). Cloud: <b>6.6x in six years</b>; Services nearly 2.2x. <span class="ave-subh-note">Source: Bloomberg export (FY sums of reported quarters).</span></div>';
  h+=ddCards(DD_SEGS,'dds');
  return h;
}
function customersBody(c){
  var h='<p class="ov-lede"><b>Four demand pools pay Alphabet</b> — and all four are compounding at once. Tap for the behavior inside each.</p>';
  h+=ddCards(DD_CUST,'ddc');
  h+='<div class="ov-callout" style="margin-top:12px"><b>The cross-pool read:</b> the same AI investment monetizes four times — advertisers pay for better intent-matching, enterprises rent the infrastructure, consumers subscribe to the models, and developers lock in the ecosystem. That is the practical meaning of "full stack."</div>';
  return h;
}
function tamBody(c){
  var h='<p class="ov-lede"><b>Alphabet\'s addressable market is unusually honest to state:</b> most of global advertising, most of enterprise computing, and whatever AI adds on top. Directional sizes below are <b>approximate, labeled</b> — the deliberate point is the expansion vectors, not fake precision.</p>';
  h+='<div class="gdd-cards">'+
    '<div class="gdd-card" style="border-top:3px solid '+BRAND+'"><div class="gdd-card-h"><span class="gdd-ic">📣</span><span class="gdd-card-n">Advertising</span><span class="gdd-tag">~$1T global · ~$700B digital (approx.)</span></div><div class="gdd-card-t">Alphabet holds the largest share of digital. Expansion vector: AI raising the monetizable share of queries (management: upside above the historical ~20% coverage) and agentic commerce adding transaction-adjacent formats.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+BRAND2+'"><div class="gdd-card-h"><span class="gdd-ic">☁️</span><span class="gdd-card-n">Cloud & AI compute</span><span class="gdd-tag">$700B+ and repricing upward (approx.)</span></div><div class="gdd-card-t">The AI cycle is re-basing the market itself — Alphabet\'s own backlog ($462B) exceeds what its entire cloud TAM estimate was a decade ago. Expansion vectors: enterprise AI seats, sovereign/regulated cloud, and now TPU hardware sold into customer data centers.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+PURPLE+'"><div class="gdd-card-h"><span class="gdd-ic">🚀</span><span class="gdd-card-n">The new frontiers</span><span class="gdd-tag">subscriptions · autonomy · silicon</span></div><div class="gdd-card-t">Consumer AI subscriptions (350M paid subs and climbing), autonomous mobility (Waymo — priced at the largest private round ever), and merchant silicon (TPU sales, "vast majority of revenue in 2027"). Each was $0 of TAM for Alphabet five years ago.</div></div>'+
  '</div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>The one-line TAM thesis:</b> every prior platform shift (web → mobile) EXPANDED the query pie and Alphabet\'s share of monetizable moments. The empirical record of 2024-26 — queries at all-time highs, Search accelerating — says AI is behaving the same way, with two entirely new P&Ls (AI cloud, AI subscriptions) attached. <span class="ave-subh-note">Market sizes directional, from major-vendor estimates; deliberately not modeled to false precision.</span></div>';
  return h;
}
function industryBody(c){
  var h='<p class="ov-lede"><b>Five arenas, one asymmetry:</b> Alphabet defends ONE core (answers) and attacks in the other four — while selling infrastructure to the very rivals attacking it. Private rivals (OpenAI, Anthropic, TikTok) appear here because they carry no market multiple for the scatter.</p>';
  h+=ddCards(DD_ARENA,'arena');
  h+='<div style="margin-top:16px">'+stdPeerScatter('ind')+'</div>';
  return h;
}
function unitEconBody(c){
  var h='<p class="ov-lede"><b>The unit is a query</b> — and the AI transition changed both sides of its economics: what a query can earn, and what it costs to answer. The famous fear ("AI answers cost 10x more than search") is being engineered away faster than it was priced in.</p>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px"><b>The revenue side — from query to cash</b></div>';
  h+='<div class="gdd-chain">'+
    '<span class="gdd-chip">5T+ queries/yr</span><span class="gdd-ar">→</span>'+
    '<span class="gdd-chip">~20% commercial <span class="gdd-sub">("upside" claimed, Q1 26)</span></span><span class="gdd-ar">→</span>'+
    '<span class="gdd-chip">real-time auction</span><span class="gdd-ar">→</span>'+
    '<span class="gdd-chip">paid clicks +7% · CPC +7% <span class="gdd-sub">(3Q25)</span></span>'+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin:14px 0 6px"><b>The cost side — the collapsing curve (management\'s own numbers)</b></div>';
  h+='<div class="ov-mbars">'+
    '<div class="ov-mbar"><div class="ov-mbar-l">SGE/AIO query cost, first 18 months</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:90%;background:'+BRAND2+'">−90%</div></div><div class="ov-mbar-v">Q3 24</div></div>'+
    '<div class="ov-mbar"><div class="ov-mbar-l">Gemini serving unit cost, during 2025</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:78%;background:'+BRAND2+'">−78%</div></div><div class="ov-mbar-v">Q4 25</div></div>'+
    '<div class="ov-mbar"><div class="ov-mbar-l">Core AI response cost since Gemini 3</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:30%;background:'+BRAND2+'">−30%</div></div><div class="ov-mbar-v">Q1 26</div></div>'+
    '<div class="ov-mbar"><div class="ov-mbar-l">Search latency, five years</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:35%;background:'+BLUE+'">−35%</div></div><div class="ov-mbar-v">Q1 26</div></div>'+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin:14px 0 6px"><b>The two structural costs to watch</b></div>';
  h+='<div class="gdd-cards">'+
    '<div class="gdd-card" style="border-top:3px solid '+AMBER+'"><div class="gdd-card-h"><span class="gdd-ic">🔗</span><span class="gdd-card-n">TAC</span><span class="gdd-tag">~$60B in FY25 · ~15% of revenue</span></div><div class="gdd-card-t">Traffic-acquisition cost — what Google pays Apple, OEMs and partners for default placement. Post-DOJ-remedies these deals survive (non-exclusive, renegotiable annually). Slowly favorable mix: TAC grows slower than revenue as the declining Network business carries the highest TAC rate.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+RED+'"><div class="gdd-card-h"><span class="gdd-ic">🏭</span><span class="gdd-card-n">Depreciation</span><span class="gdd-tag">$15.3B → $21.1B FY25 · accelerating</span></div><div class="gdd-card-t">The capex bill hitting the P&L — flagged unprompted every quarter. The race that decides the margin story: unit-cost collapse (above) vs the depreciation ramp. So far, margins EXPANDED through the build-out (27% → 32% → 36.1% in Q1 26).</div></div>'+
  '</div>';
  return h;
}
// ─── Bottom Line ▸ Supply Chain — Bloomberg SPLC, as of 22-Jul-2026 ─────────────────────────────
// 728 suppliers / 1,166 customers tracked. The twist for GOOGL: the "supply chain" is really an
// AI-infrastructure procurement machine (capex vendors) + a content ecosystem (labels/studios paid
// via revenue share) — while the true demand side (millions of advertisers) is invisible to SPLC.
var SPLC_INFRA=[
  { n:'NVIDIA', rel:'$13.3B', cost:'11.9% of capex costs', dep:'4.9% of NVDA rev', bar:100, col:BRAND2,
    d:'<p>The single biggest supplier relationship ($13.3B est.) — the GPU fleet (Blackwell, Hopper, upcoming Vera Rubin) that Alphabet both uses and rents out via Cloud. Note the asymmetry: Google is a huge buyer, yet only ~4.9% of NVIDIA\'s revenue — neither side is captive.</p>' },
  { n:'Broadcom', rel:'$9.2B', cost:'9.6% of capex costs', dep:'12.8% of AVGO rev', bar:69, col:BRAND,
    d:'<p>The <b>TPU relationship</b>: Broadcom co-designs/supplies the custom-silicon program at the heart of the full-stack thesis. ~12.8% of Broadcom\'s revenue traces to Google — a deep mutual dependency.</p><p><b>The map\'s most important absence:</b> TSMC does not appear among top direct suppliers — the foundry exposure is INTERMEDIATED through Broadcom. Alphabet\'s most critical single dependency is second-order and invisible in the first-order map.</p>' },
  { n:'Hon Hai (Foxconn)', rel:'$6.0B', cost:'6.7% of capex costs', dep:'2.6% of Hon Hai rev', bar:45, col:GRAY,
    d:'<p>Server/rack assembly at hyperscale. Taiwan-headquartered with a global footprint — part of why supplier facilities concentrate in Asia even where domiciles don\'t.</p>' },
  { n:'SK hynix', rel:'$5.2B', cost:'4.4% of capex costs', dep:'7.3% of hynix rev', bar:39, col:PURPLE,
    d:'<p>HBM memory — the scarcest input of the AI build-out. 7.3% of hynix\'s revenue from one buyer makes Google a priority customer in the tightest part of the chain.</p>' },
  { n:'Celestica', rel:'$3.8B', cost:'4.0% of capex costs', dep:'30.1% of Celestica rev', bar:29, col:RED,
    d:'<p><b>The hidden pure-play:</b> ~30% of Celestica\'s entire revenue is Google (networking/ODM hardware). For the map\'s purposes: Celestica is quasi-captive capacity — and its results are a public read-through on Google\'s data-center buildout cadence.</p>' },
  { n:'Optics & networking cluster', rel:'Zhongji · Lumentum · Ciena · Arista · Marvell', cost:'~2.5% of capex combined', dep:'Zhongji 22% · Lumentum 21% of their rev', bar:20, col:AMBER,
    d:'<p>The 800G-optics and switching layer (Zhongji Innolight 22.4% and Lumentum 21.0% of their revenues from Google; plus Ciena, Arista 4.6%, Marvell 3.6%, Jabil, MediaTek). Individually small for Google; existentially large for several of them — the buildout\'s breadth shows here.</p>' },
];
var SPLC_CONTENT=[
  ['Warner Music','12.0% of WMG revenue','SGA — YouTube licensing'],
  ['Universal Music','5.6% of UMG revenue','COGS — YouTube licensing'],
  ['Take-Two','22.9% of TTWO revenue','COGS — Play/ads revenue share'],
  ['GREE','21.8% of its revenue','COGS — Play ecosystem'],
  ['GungHo','17.6% of its revenue','COGS — Play ecosystem'],
  ['Koei Tecmo','10.1% of its revenue','COGS — Play ecosystem'],
];
var SPLC_DEP=[
  ['System1', 67, 'ad-tech riding Google demand'],
  ['Mobirix', 53, 'mobile games — Play'],
  ['Drecom', 35, 'games — Play'],
  ['Celestica', 30, 'ODM hardware'],
  ['Duolingo', 23, 'Play + ads'],
  ['Take-Two', 23, 'Play revenue share'],
  ['Zhongji Innolight', 22, '800G optics'],
  ['Lumentum', 21, 'optics'],
];
function splcBody(c){
  var h='<p class="ov-lede"><b>Two supply chains in one company.</b> Upstream, Alphabet runs one of the largest <b>AI-infrastructure procurement machines</b> on earth (the capex vendors). Sideways, it operates a <b>content ecosystem</b> where "suppliers" are labels and studios paid through revenue share. And the honest caveat: the true demand side — millions of advertisers — is <b>invisible to SPLC</b>; the traceable customers are telcos and IT resellers.</p>';
  h+=ddStat([['728','suppliers tracked'],['1,166','customers tracked'],['7,353','supplier facilities'],['27.8% / 11.8%','supplier facs US / China'],['22 + 67','distressed supp. + cust.'],['5','sanctioned suppliers']]);
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The AI capex chain — where the $180–190B goes</b> (relationship size, Bloomberg est.; bar = relative size)</div>';
  h+='<div class="ce-watch">'+SPLC_INFRA.map(function(s,i){
    return '<div class="ce-w ov-clickable" data-detail="splc:'+i+'" style="border-left:4px solid '+s.col+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="gdd-tag">'+esc(s.rel)+'</span><span class="ce-why-btn" style="margin:0">the read ›</span></div>'+
      '<div class="ov-mbar" style="margin:4px 0 6px"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+s.bar+'%;background:'+s.col+'"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip cons">'+esc(s.cost)+'</span><span class="ce-w-chip red"><b>Their dependency:</b> '+esc(s.dep)+'</span></div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The content ecosystem — "suppliers" Alphabet pays via revenue share</b></div>';
  h+='<div style="overflow-x:auto"><table class="ce-tbl"><thead><tr><th>Partner</th><th>Their exposure to Google</th><th>Category</th></tr></thead><tbody>'+
    SPLC_CONTENT.map(function(r){ return '<tr><td style="font-weight:700">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td style="color:var(--mu)">'+esc(r[2])+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ave-subh-note" style="margin:6px 0 0">YouTube licensing (labels) and Play-store revenue shares (studios) appear in SPLC as supplier costs — a reminder that a big slice of "COGS" is really ecosystem payouts, not parts.</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>Who needs whom — revenue dependency ON Google</b> (% of the counterpart\'s revenue)</div>';
  h+='<div class="ov-mbars">'+SPLC_DEP.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+' <span class="gdd-sub">'+esc(r[2])+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+BRAND+'">'+r[1]+'%</div></div><div class="ov-mbar-v">'+r[1]+'%</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin:10px 0 0"><b>The asymmetry in one line:</b> nobody Alphabet buys from holds it captive (NVIDIA is ~12% of its capex costs but Google is only ~5% of NVIDIA) — while a whole tier of vendors lives or dies by Google\'s orders. Purchasing power sits almost entirely on Alphabet\'s side; the exceptions are the true scarcities (HBM, foundry-via-Broadcom).</div>';
  h+='<div class="gdd-cards" style="margin-top:16px">'+
    '<div class="gdd-card" style="border-top:3px solid '+BRAND2+'"><div class="gdd-card-h"><span class="gdd-ic">📶</span><span class="gdd-card-n">The traceable customers</span><span class="gdd-tag">telcos + IT channel</span></div><div class="gdd-card-t">Verizon ($1.5B est., 2.7% of its costs), TD SYNNEX, AT&T, T-Mobile, Computacenter, Insight — and Equifax at <b>7.8% of its cost base</b> (a heavy Cloud commit). This is the Cloud/enterprise distribution book; the ads demand (SMB millions) never shows in SPLC. 67 tracked customers screen as distressed — churn-watch, not thesis risk.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+AMBER+'"><div class="gdd-card-h"><span class="gdd-ic">🗺️</span><span class="gdd-card-n">Geography & risk surface</span><span class="gdd-tag">facilities view</span></div><div class="gdd-card-t">Supplier facilities: <b>27.8% US · 11.8% China</b> · 6.0% Germany · Asia-heavy manufacturing (Japan 67, Korea 49, Taiwan 42 suppliers domiciled). 69 suppliers domiciled in China (9.5%) = the tariff/geopolitics surface. Risk flags: 5 sanctioned suppliers, 22 distressed suppliers — none among the top-tier infra names. Customer side skews global: Japan alone is 12.2% of traceable customers.</div></div>'+
  '</div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), GOOGL US Equity, as of 22-Jul-2026. Relationship sizes are Bloomberg estimates (supplier/customer filings where reported); directional, not audited disclosures. Top-tier names shown; full universe 728 suppliers / 1,166 customers.</div>';
  return h;
}
function marginsBody(c){
  var h='<p class="ov-lede"><b>Two margin stories in one company:</b> the group line expanding through the largest capex ramp in corporate history — and the Cloud ladder, the fastest large-scale margin build the sector has seen.</p>';
  h+='<div class="ov-diagram-cap"><b>Group & Services operating margin</b> (FY2019 → FY2025)</div>';
  h+='<div class="ov-diagram" style="height:250px;position:relative;margin:4px 0 10px"><canvas id="gChartMargin"></canvas></div>';
  h+='<div class="ave-subh-note" style="margin:0 0 14px">Dips carry one-offs: FY22 comp/headcount surge; 3Q25 the €/EC $3.5B fine (30.5% reported vs 33.9% ex-fine); 4Q25 the $2.1B Waymo SBC charge. Q1 2026 printed 36.1% with a ~3pp FX assist on Services.</div>';
  h+='<div class="ov-diagram-cap"><b>The Cloud margin ladder</b> — quarterly, 1Q23 → 1Q26</div>';
  h+='<div class="ov-diagram" style="height:250px;position:relative;margin:4px 0 10px"><canvas id="gChartCloudM"></canvas></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:2px">2.6% → <b>32.9%</b> in twelve quarters — while revenue growth ACCELERATED from +28% to +63%. Scale + self-built data centers + the seat business (Gemini Enterprise) on top of consumption. Wiz adds a low-single-digit-pp headwind through 2026 (flagged). <span class="ave-subh-note">Source: Bloomberg export, segment operating margins.</span></div>';
  return h;
}
function guidanceBody(c){
  var h='<p class="ov-lede"><b>Alphabet guides almost nothing — deliberately.</b> No revenue, EPS or segment guidance; instead five standing commitments the record lets you score. Tap a card.</p>';
  h+='<div class="gdd-cards">'+G_GUIDE.map(function(g,i){
    return '<div class="gdd-card ov-clickable" data-detail="guide:'+i+'" style="border-top:3px solid '+g.col+'"><div class="gdd-card-h"><span class="gdd-ic">'+g.ic+'</span><span class="gdd-card-n">'+esc(g.k)+'</span><span class="gdd-tag">'+esc(g.v)+'</span></div><div class="gdd-card-t">'+esc(g.teaser)+'</div><div class="gdd-more">The record ›</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>What they will NOT give you:</b> quarterly revenue/EPS targets · segment guidance · a Gemini-app monetization timeline ("not rushing," three calls verbatim) · Waymo economics · TPU-sale margins. Every one of those silences is tracked in the Earnings watch lists.</div>';
  return h;
}
function strategyBody(c){
  var steps=[
    ['1','Own the silicon', 'TPUs (8 generations) + Axion + NVIDIA fleet — the industry\'s widest compute menu, now also SOLD outright.', BRAND],
    ['2','Lead the research', 'Google DeepMind: Gemini 3, Veo, Genie — fastest-adopted models in company history; three Nobels in two years.', PURPLE],
    ['3','Ship into billion-user products', '15 products ≥500M users each get the frontier model within a quarter (Gemini 3 → AI Mode in weeks).', BRAND2],
    ['4','Monetize four ways', 'Ads (auction intent) · Cloud (consumption + seats) · Subscriptions (350M) · now hardware (TPU sales).', AMBER],
    ['5','Reinvest at scale', '$180–190B of FY26 capex, gated by ROIC and funded ~⅔ by the cash machine, ⅓ by debt capacity.', RED],
  ];
  var h='<p class="ov-lede"><b>The strategy is one loop, stated on every call:</b> full-stack AI — own every layer, ship it everywhere, monetize it four ways, feed the surplus back into the stack.</p>';
  h+='<div class="gdd-fly">'+steps.map(function(s,i){
    return (i>0?'<div class="gdd-fly-ar">↓</div>':'')+'<div class="gdd-fly-step" style="border-left:4px solid '+s[3]+'"><span class="gdd-fly-n" style="background:'+s[3]+'">'+s[0]+'</span><div><div class="gdd-fly-t">'+esc(s[1])+'</div><div class="gdd-fly-d">'+s[2]+'</div></div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>The 2026 strategic turn — "broaden the box":</b> three revenue lines that did not exist two years ago are now real — consumer AI subscriptions, TPU hardware sales (majority of revenue lands 2027), and agentic-commerce rails (UCP). Waymo scales in parallel with external capital. The loop is acquiring exits.</div>';
  return h;
}
function timelineBody(){
  return '<p class="ov-lede"><b>The corporate arc, with the depth open.</b> Same lineage as the Overview timeline — every entry expandable here.</p>'+stdTimeline();
}
// ─── Valuation ▸ Sensitivity — EV/EBITDA anchored to FY2027E (the standing convention) ──────────
var SENS={ ebitda:235, mult:15, netCash:49, shares:12.24, price:null };
function sensBody(c){
  var h='<p class="ov-lede"><b>EV/EBITDA on FY2027E</b> — the house convention (next full fiscal year; never EV/sales). Slide the two inputs; the implied price re-anchors against the live quote.</p>';
  h+='<div class="gdd-sens">'+
    '<div class="gdd-sens-ctrl"><label>FY2027E EBITDA <b id="gSensEbitdaV">$'+SENS.ebitda+'B</b></label><input type="range" id="gSensEbitda" min="180" max="300" step="5" value="'+SENS.ebitda+'"></div>'+
    '<div class="gdd-sens-ctrl"><label>EV / EBITDA <b id="gSensMultV">'+SENS.mult+'x</b></label><input type="range" id="gSensMult" min="8" max="24" step="0.5" value="'+SENS.mult+'"></div>'+
  '</div>';
  h+='<div class="gdd-kpis" style="margin-top:12px">'+
    '<div class="gdd-kpi"><div class="gdd-kpi-v" id="gSensEV">—</div><div class="gdd-kpi-k">Implied EV</div></div>'+
    '<div class="gdd-kpi"><div class="gdd-kpi-v">+$'+SENS.netCash+'B</div><div class="gdd-kpi-k">net cash (Q1 26)</div></div>'+
    '<div class="gdd-kpi"><div class="gdd-kpi-v" id="gSensPx">—</div><div class="gdd-kpi-k">implied / share</div></div>'+
    '<div class="gdd-kpi"><div class="gdd-kpi-v" id="googlSensLive">live…</div><div class="gdd-kpi-k">market price</div></div>'+
    '<div class="gdd-kpi"><div class="gdd-kpi-v" id="gSensUp">—</div><div class="gdd-kpi-k">implied upside</div></div>'+
  '</div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">Base FY2027E EBITDA ~$235B is an analyst-style seed (TTM $181B through Q1 26, FY25 $175B — extended at a decelerating mid-teens path) — <b>to be replaced by the Summit model when GOOGL lands in the MCP</b>. Net cash = $126.8B cash & securities − $77.5B LT debt (Q1 26); diluted shares ~12.24B. Estimates, labeled; not guidance.</div>';
  return h;
}
function renderSens(root){
  var ev=SENS.ebitda*SENS.mult;
  var eq=ev+SENS.netCash;
  var px=eq/SENS.shares;
  var set=function(id,txt){ var el=root.querySelector('#'+id); if(el) el.textContent=txt; };
  set('gSensEbitdaV','$'+SENS.ebitda+'B'); set('gSensMultV',SENS.mult+'x');
  set('gSensEV','$'+(ev/1000).toFixed(2)+'T'); set('gSensPx','$'+px.toFixed(0));
  if(SENS.price){ set('googlSensLive','$'+SENS.price.toFixed(2)); set('gSensUp',((px/SENS.price-1)*100).toFixed(0)+'%'); }
}
function peersBody(c){
  var rows=[
    ['Alphabet','+13%','16x','23x','32.0%','The cheapest mega-platform on nearly every multiple — the discount IS the AI-disruption debate.'],
    ['Microsoft','+14%','22x','32x','~45%','Same growth, far richer multiple — the premium is perceived AI certainty (OpenAI + Azure).'],
    ['Apple','+6%','22x','29x','~31%','Slowest grower, still premium — ecosystem + buybacks; now also a Gemini/Google Cloud customer.'],
    ['Amazon','+11%','16x','31x','~11%','AWS is the cloud share leader; retail dilutes the blend. The #3 digital-ads player.'],
    ['Meta','+15%','15x','24x','~40%','The purest ads comparable — faster ad growth, no cloud, same capex debate.'],
  ];
  var h='<p class="ov-lede"><b>The big-tech five, side by side.</b> Same peer set as the scatter (consistency rule). Multiples are forward, <b>seeded approximations (mid-2026, labeled)</b> pending live confirmation.</p>';
  h+='<div style="overflow-x:auto"><table class="ce-tbl"><thead><tr><th>Company</th><th>Rev growth (f)</th><th>EV/EBITDA (f)</th><th>P/E (f)</th><th>Op margin</th><th>The read</th></tr></thead><tbody>'+
    rows.map(function(r,i){ return '<tr'+(i===0?' style="background:rgba(66,133,244,0.05);font-weight:700"':'')+'><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td><td>'+esc(r[4])+'</td><td style="font-weight:400;color:var(--mu)">'+esc(r[5])+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>The valuation puzzle in one line:</b> Alphabet grows like Microsoft, margins like Meta, and trades below both — the gap is the market\'s open verdict on whether AI disrupts or compounds the search franchise. Every quarter of Search acceleration argues for the re-rate.</div>';
  return h;
}
function capallocBody(c){
  var h='<p class="ov-lede"><b>Where the cash goes — and where it now comes from.</b> Capex has overtaken free cash flow for the first time in company history; buybacks are the shock absorber, the dividend the signal.</p>';
  h+='<div class="ov-diagram" style="height:270px;position:relative;margin:4px 0 10px"><canvas id="gChartCap"></canvas></div>';
  h+='<div class="ave-subh-note" style="margin:0 0 12px">FY2026E bar = guide midpoint ($185B), estimate. FCF FY26E not shown (depends on the very debate). Source: Bloomberg export + company guidance.</div>';
  h+='<div class="gdd-cards">'+
    '<div class="gdd-card" style="border-top:3px solid '+RED+'"><div class="gdd-card-h"><span class="gdd-ic">🏗️</span><span class="gdd-card-n">Capex</span><span class="gdd-tag">$91.4B FY25 → $180–190B FY26E</span></div><div class="gdd-card-t">~60% servers / 40% data centers & networking; mostly self-built (a structural cost edge). 2027 guided "significantly" higher. Q1 26 alone: $35.7B.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+BRAND+'"><div class="gdd-card-h"><span class="gdd-ic">🔁</span><span class="gdd-card-n">Buybacks</span><span class="gdd-tag">the flex line</span></div><div class="gdd-card-t">$62B (2023) → ~$58B (2024) → $45.7B (2025, slowing to $5.5B in Q4). The first thing that gives when capex bites — watch it as the cash-squeeze tell.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+BRAND2+'"><div class="gdd-card-h"><span class="gdd-ic">💵</span><span class="gdd-card-n">Dividend</span><span class="gdd-tag">born 2024 · +5%/yr cadence</span></div><div class="gdd-card-t">$0.20/qtr (Apr 2024) → +5% (2025) → +5% (Apr 2026). Small (~$10B/yr) but deliberately steady — raised in the same quarter capex was raised. The signal: the build-out is not a cash emergency.</div></div>'+
    '<div class="gdd-card" style="border-top:3px solid '+AMBER+'"><div class="gdd-card-h"><span class="gdd-ic">🏦</span><span class="gdd-card-n">Debt — the new line</span><span class="gdd-tag">LT debt $46.5B → $77.5B in Q1 26</span></div><div class="gdd-card-t">External funding entered the model in one quarter (+$31B). Against $126.8B of cash it is comfortable — but the direction is the watch item, tracked in Earnings.</div></div>'+
  '</div>';
  return h;
}
function financialsBody(c){
  var h='<p class="ov-lede"><b>Seven years in one picture:</b> revenue 2.5x, operating income 3.8x, net income 3.9x — margin expanding through two investment super-cycles.</p>';
  h+='<div class="ov-diagram" style="height:280px;position:relative;margin:4px 0 10px"><canvas id="gChartFin"></canvas></div>';
  h+='<div style="overflow-x:auto;margin-top:10px"><table class="ce-tbl"><thead><tr><th>$B</th><th>FY23</th><th>FY24</th><th>FY25</th><th>read</th></tr></thead><tbody>'+
    '<tr><td><b>Revenue</b></td><td>307.4</td><td>350.0</td><td>402.8</td><td style="color:var(--mu)">11 straight double-digit quarters through Q1 26</td></tr>'+
    '<tr><td><b>Operating income</b></td><td>84.3</td><td>112.4</td><td>129.0</td><td style="color:var(--mu)">margin 27.4% → 32.1% → 32.0% (fine + Waymo charge in FY25)</td></tr>'+
    '<tr><td><b>Net income</b></td><td>73.8</td><td>100.1</td><td>132.2</td><td style="color:var(--mu)">FY25 aided by OI&E marks — read through the operating line</td></tr>'+
    '<tr><td><b>Free cash flow</b></td><td>69.5</td><td>72.8</td><td>73.3</td><td style="color:var(--mu)">flat by design: OCF $164.7B minus the capex ramp</td></tr>'+
    '<tr><td><b>Capex</b></td><td>32.3</td><td>52.5</td><td>91.4</td><td style="color:var(--mu)">→ $180–190B FY26E; 2027 "significantly" higher</td></tr>'+
  '</tbody></table></div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">Source: Bloomberg export (FY sums of reported quarters) + Q4/FY2025 SEC release. FY21 op income interpolated from the reported year.</div>';
  return h;
}
// ─── Management ─────────────────────────────────────────────────────────────────────────────────
var GOOGL_MGMT = makeManagement({
  brand:BRAND,
  lede:'Alphabet is <b>founder-controlled but operator-run</b>: Larry Page and Sergey Brin hold voting control (Class B) and board seats but stepped out of operations in 2019, leaving a deep professional bench under <b>Sundar Pichai</b> — with the divisional CEOs (Cloud, DeepMind, YouTube) running their own P&Ls at unusual autonomy.',
  execs:[
    { id:'pichai', img:'img/leadership/googl-pichai.jpg', lead:true, name:'Sundar Pichai', title:'CEO, Alphabet & Google', since:'at Google since 2004 · Google CEO 2015 · Alphabet CEO 2019',
      line:'From Chrome PM to the AI-era CEO; architect of the full-stack response.',
      bio:'Joined in 2004; ran Chrome and Android before becoming Google CEO in the 2015 Alphabet restructuring and Alphabet CEO in 2019 when the founders stepped back. Declared the company "AI-first" in 2016 (the TPU/DeepMind groundwork), absorbed the 2023 "code red," and delivered the Gemini-era turnaround — reorganizing research (DeepMind merge), shipping Gemini 1→3 in 24 months, and committing the largest capital program in corporate history.' },
    { id:'anat', img:'img/leadership/googl-ashkenazi.jpg', name:'Anat Ashkenazi', title:'SVP & CFO', since:'since Jul 2024 · ex-Eli Lilly CFO',
      line:'Owns the capex-ladder narrative: raises with proof attached, depreciation flagged unprompted.',
      bio:'CFO since July 2024, after two decades at Eli Lilly (CFO 2021-24). Brought pharma-style capital discipline to the AI build-out: ROIC framing on every allocation question, per-call depreciation candor, the backlog-conversion disclosure, and the first material debt issuance — executed while group margins expanded.' },
    { id:'schindler', img:'img/leadership/googl-schindler.jpg', name:'Philipp Schindler', title:'SVP & Chief Business Officer', since:'at Google since 2005',
      line:'Runs the ads franchise — carried it through the AI transition accelerating, not shrinking.',
      bio:'Chief Business Officer since 2015; two decades at Google across European and global sales. Owns the advertiser relationship end-to-end — the AI-campaign migration (AI Max, PMax, Demand Gen), the new-surface monetization ladder (AIO ads, Direct Offers, UCP), and the vertical franchises (retail, finance). Notably candid on his own numbers (the volunteered FX caveat, Q1 2026).' },
    { id:'porat', img:'img/leadership/googl-porat.jpg', name:'Ruth Porat', title:'President & Chief Investment Officer', since:'at Alphabet since 2015 · CFO 2015-2024',
      line:'The discipline era\'s CFO, now running Other Bets investment and the capital relationships.',
      bio:'CFO 2015-2024 (ex-Morgan Stanley CFO) — brought the cost discipline that made "Other Bets" a reported, bounded number and built the buyback program. As President & CIO since 2024, oversees Alphabet\'s investment portfolio and the Bets\' external-capital strategy (Waymo\'s $16B round, Verily/GFiber deconsolidations bear her signature).' },
    { id:'kurian', img:'img/leadership/googl-kurian.jpg', name:'Thomas Kurian', title:'CEO, Google Cloud', since:'since 2019 · ex-Oracle (22 yrs)',
      line:'2.6% → 32.9% segment margin in three years, while growth accelerated to +63%.',
      bio:'Left Oracle\'s product organization to run Google Cloud in 2019, inheriting a loss-making #3. Systematized enterprise sales, priced the AI portfolio (Vertex, Gemini Enterprise — 8M paid seats in four months), and delivered the sector\'s fastest large-scale margin build alongside its fastest growth. The $462B backlog is his book.' },
    { id:'hassabis', img:'img/leadership/googl-hassabis.jpg', name:'Demis Hassabis', title:'CEO, Google DeepMind', since:'DeepMind founder 2010 · acquired 2014 · merged 2023',
      line:'Nobel laureate; turned the research jewel into the revenue engine\'s core input.',
      bio:'Chess prodigy, neuroscientist, DeepMind founder. AlphaFold won him the 2024 Nobel Prize in Chemistry; the 2023 Brain-DeepMind merger under his leadership produced Gemini — now the fastest-adopted model family in company history, powering Search, Cloud and the app. The clearest research-to-product transmission in the industry.' },
    { id:'mohan', img:'img/leadership/googl-mohan.jpg', name:'Neal Mohan', title:'CEO, YouTube', since:'since 2023 · at Google since 2008',
      line:'#1 US streamer three straight years; the Shorts defense turned profitable.',
      bio:'Ad-tech veteran (DoubleClick) who became YouTube\'s product chief and then CEO in 2023. Record: US streaming watch-time leadership three consecutive years, Shorts monetization parity with in-stream (US), the subscriptions twin-engine (>$60B/yr combined), NFL Sunday Ticket and the living-room pivot.' },
  ],
  board:[
    { name:'John L. Hennessy', chair:true, independent:true, role:'Independent Chair since 2018 (Lead Independent Director 2007–2018) · ex-Stanford president · Turing Award winner · director since 2004.' },
    { name:'Larry Page', independent:false, role:'Co-founder · Class B holder · stepped back from operations 2019 · director since 2015 (Google 1998).' },
    { name:'Sergey Brin', independent:false, role:'Co-founder · Class B holder · returned hands-on for the Gemini effort · director since 2015 (Google 1998).' },
    { name:'Sundar Pichai', dual:true, independent:false, role:'CEO · director since 2017.' },
    { name:'Frances H. Arnold', independent:true, role:'Nobel laureate (Chemistry) · Caltech professor · director since 2019.' },
    { name:'R. Martin "Marty" Chávez', independent:true, role:'ex-Goldman Sachs CFO/CIO · Sixth Street vice chairman · director since 2022.' },
    { name:'L. John Doerr', independent:true, role:'Kleiner Perkins chairman · early investor (1999 round) · director since 2016.' },
    { name:'Roger W. Ferguson Jr.', independent:true, role:'ex-Federal Reserve vice chairman · ex-TIAA CEO · now CIO, Red Cell Partners · director since 2016.' },
    { name:'K. Ram Shriram', independent:true, role:'Managing Partner, Sherpalo Ventures · founding board member & one of Google\'s earliest investors · longest-tenured director, since 1998.' },
    { name:'Robin L. Washington', independent:true, role:'President & COO/CFO of Salesforce · ex-Gilead CFO · audit expertise · director since 2019.' },
  ],
  boardNote:'The full 10-member board (verified vs the 2026 DEF 14A, filed 2026-04-24, and abc.xyz/investor). 7 independent; key committees (Audit, Talent & Comp, Leadership Dev & Comp, Nominating & Gov) are 100% independent. Founders\' Class B control means board power ultimately traces to Page & Brin.',
  foot:'Roster & titles per Alphabet\'s 2026 DEF 14A (filed 2026-04-24) and abc.xyz/investor board page.',
});
function ownershipBody(c){
  var h='<p class="ov-lede"><b>Three share classes, one asymmetry:</b> the public owns most of the economics; the founders keep control. All figures approximate per the last proxy on record — <span class="ave-subh-note">verify against the 2026 DEF 14A before publishing.</span></p>';
  h+='<div class="gdd-own">'+
    '<div class="gdd-own-row"><div class="gdd-own-l">Class A — GOOGL <span class="gdd-sub">1 vote/share · public</span></div><div class="gdd-own-track"><div class="gdd-own-fill" style="width:49%;background:'+BRAND+'">~49% econ</div></div></div>'+
    '<div class="gdd-own-row"><div class="gdd-own-l">Class C — GOOG <span class="gdd-sub">0 votes · public</span></div><div class="gdd-own-track"><div class="gdd-own-fill" style="width:44%;background:'+GRAY+'">~44% econ</div></div></div>'+
    '<div class="gdd-own-row"><div class="gdd-own-l">Class B — unlisted <span class="gdd-sub">10 votes/share · founders & insiders</span></div><div class="gdd-own-track"><div class="gdd-own-fill" style="width:7%;background:'+RED+'">~7% econ</div></div></div>'+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin:14px 0 4px"><b>…but the VOTES:</b></div>';
  h+='<div class="gdd-own">'+
    '<div class="gdd-own-row"><div class="gdd-own-l">Page + Brin (via Class B)</div><div class="gdd-own-track"><div class="gdd-own-fill" style="width:51%;background:'+RED+'">~51% of votes</div></div></div>'+
    '<div class="gdd-own-row"><div class="gdd-own-l">Everyone else</div><div class="gdd-own-track"><div class="gdd-own-fill" style="width:49%;background:'+GRAY+'">~49%</div></div></div>'+
  '</div>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>What it means in practice:</b> no activist, no hostile bid, no proxy fight can move Alphabet against the founders\' wishes — the 2004 IPO letter\'s "not a conventional company" made structural. Class C (GOOG) exists precisely so the company can issue stock (compensation, M&A) without diluting that control. The two tickers trade within pennies; GOOGL carries the (near-powerless) vote.</div>';
  return h;
}
function govBody(c){
  var rows=[
    ['Control','Founder-controlled','Page & Brin ~51% of votes via 10-vote Class B — with an independent chair (Hennessy) as the counterweight.'],
    ['Board','9+ directors, majority independent','Nobel/Fed/Goldman/Stanford-calibre independents; full committee map pending DEF 14A verification.'],
    ['Capital returns','Dividend + buyback, policy-driven','Dividend +5%/yr cadence since inception (2024); $70B-scale buyback authorizations; buybacks flex with capex.'],
    ['Structure','Triple-class, dual ticker','GOOGL (A, 1 vote) · GOOG (C, 0 votes) · B unlisted. Both tickers in the S&P 500.'],
    ['Regulatory overhang','The standing discount','US v. Google search remedies (Sep 2025): Chrome/Android retained, default deals restricted but alive; the ad-tech case still in the pipeline; EC fines recurring ($3.5B in 3Q25).'],
    ['Disclosure culture','Numbers until they stop','Discloses chosen KPIs in streaks (Gemini MAU, backlog) — a skipped rung is information; tracked in Earnings.'],
  ];
  var h='<p class="ov-lede"><b>Governance in six lines</b> — the structural facts that shape what shareholders can and cannot influence.</p>';
  h+='<div class="gdd-gov">'+rows.map(function(r){ return '<div class="gdd-gov-row"><div class="gdd-gov-k">'+esc(r[0])+'</div><div class="gdd-gov-v">'+esc(r[1])+'</div><div class="gdd-gov-d">'+r[2]+'</div></div>'; }).join('')+'</div>';
  return h;
}
function trackBody(c){
  var h='<p class="ov-lede"><b>The operators, rated on their record</b> — not their titles. Tap a card for the case for and against.</p>';
  h+='<div class="gdd-cards">'+G_TRACK.map(function(t,i){
    return '<div class="gdd-card ov-clickable" data-detail="gexec:'+i+'" style="border-top:3px solid '+t.col+'">'+
      '<div class="gdd-card-h"><span class="gdd-card-n">'+esc(t.n)+'</span><span class="gdd-tag" style="color:'+t.col+'">'+esc(t.rate)+'</span></div>'+
      '<div class="ave-subh-note" style="margin:2px 0 6px">'+esc(t.role)+' · '+esc(t.since)+'</div>'+
      '<div class="gdd-card-t">'+esc(t.line)+'</div><div class="gdd-more">The record ›</div></div>';
  }).join('')+'</div>';
  // Independent board — outside credibility strip (parity with the operators grid; the full 10-member
  // board incl. K. Ram Shriram is in Executives & Board). Surfaces the outside oversight in Track Record.
  var GBOARD=[
    ['John L. Hennessy','Independent Chair · ex-Stanford president · Turing Award winner.'],
    ['K. Ram Shriram','Sherpalo Ventures · founding director & earliest Google investor (since 1998).'],
    ['Frances H. Arnold','Nobel laureate (Chemistry) · Caltech professor.'],
    ['L. John Doerr','Kleiner Perkins chairman · early investor (1999).'],
    ['Roger W. Ferguson Jr.','ex-Federal Reserve vice chairman · ex-TIAA CEO.'],
    ['Robin L. Washington','President & COO/CFO of Salesforce · ex-Gilead CFO.'],
    ['R. Martin "Marty" Chávez','ex-Goldman Sachs CFO/CIO · Sixth Street vice chairman.'],
  ];
  h+='<div style="margin-top:20px"><div class="ov-sec-h" style="margin-bottom:10px">Independent board — the outside credibility</div>'+
    '<div class="ave-subh-note" style="margin:0 0 8px">The operators above are rated on their record; the independent directors (7 of 10) bring <b>outside oversight</b> — a Nobel laureate, an ex-Fed vice chairman, sitting/former public-company CFOs, and Google\'s longest-tenured director.</div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px">'+GBOARD.map(function(b){
      return '<div style="border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:9px 12px"><div style="font-size:12px;font-weight:800;color:var(--navy)">'+esc(b[0])+'</div><div style="font-size:10.5px;color:var(--mu);line-height:1.45;margin-top:2px">'+esc(b[1])+'</div></div>';
    }).join('')+'</div></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>The caveat:</b> nearly every rating above rides the same wave — the AI cycle. The bench has not been tested by a down-cycle in this configuration, and founder control means accountability ultimately runs to two people who no longer operate. The counterweight: divisional CEOs with real P&L records (Kurian\'s ladder, Mohan\'s streaming lead) that stand on their own.</div>';
  return h;
}

// ═══ Earnings · Setup charts (Chart.js, lazy — the pane must be visible or offsetParent is null)
// Quarterly only. Both charts read CE_CONS and redraw on the metric pills and the range control.
function ceTkFmt(u,v){
  if(v==null) return '';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v).toFixed(1)+'B';
  if(u==='B')  return (+v).toFixed(2)+'B';
  return String(v);
}
function wireCeTrack(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  // The lens defaults are asserted here as well as in the markup — Consensus + YoY, showing YoY.
  // Belt and braces: a half-applied default reads as a broken control (§6a-ii).
  function ceSetLens(v){
    // MUST scope to [data-ceg] — a bare '.ce-gseg button' also matches the margin toggle that
    // shares the .ce-gseg pill styling, and would clear its active state (§6a-v cross-check rule).
    pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceg')===v); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-g', v); });
    pane.querySelectorAll('.ce-fz').forEach(function(f){ f.setAttribute('data-g', v); });
  }
  ceSetLens('yoy');
  pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceev')==='cons'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev','cons'); });
  // Margin default: off, and its own segment's active state set independently of the growth lens.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-cemm')==='off'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm','off'); });
  pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(btn){ btn.onclick=function(){
    ceSetLens(btn.getAttribute('data-ceg'));
  }; });
  // Margin lens (headline GP/OpInc/EBITDA only) — CSS-driven via data-mm on the wrap.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cemm');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm', v); });
  }; });
  // Post-Results print-block toggles — scoped to their own .ce-fz so each quarter's print block is
  // independent. These are SEPARATE from the Setup's Consensus/Summit/Both (which does not apply
  // here: Post-Results has no "Both"). `vs Street ⇄ vs Summit` sets data-ev (swaps the frozen
  // expectation the print is scored against); `Margin` sets data-mm (expected-implied → realized).
  pane.querySelectorAll('.ce-gseg button[data-fzev]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzev'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-ev', v);
  }; });
  pane.querySelectorAll('.ce-gseg button[data-fzmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzmm'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-mm', v);
  }; });
}
// ═══ Deep-dive charts (Chart.js, lazy per pane) ═════════════════════════════════════════════════
var _gCharts={};
function gDestroy(id){ if(_gCharts[id]){ _gCharts[id].destroy(); _gCharts[id]=null; } }
function gChartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function gBuildSeg(){
  var cv=gChartReady('gChartSeg'); if(!cv) return; gDestroy('gChartSeg');
  _gCharts['gChartSeg']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:FIN.years, datasets:[
      { label:'Google Services', data:FIN.services, backgroundColor:BRAND, stack:'s', maxBarThickness:46 },
      { label:'Google Cloud', data:FIN.cloud, backgroundColor:BRAND2, stack:'s', maxBarThickness:46 },
      { label:'Other Bets', data:FIN.otherbets, backgroundColor:YELLOW, stack:'s', maxBarThickness:46 } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(x){ return x.dataset.label+': $'+x.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ stacked:true, ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } } });
}
function gBuildMargin(){
  var cv=gChartReady('gChartMargin'); if(!cv) return; gDestroy('gChartMargin');
  _gCharts['gChartMargin']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:FIN.years, datasets:[
      { label:'Group op margin', data:FIN.opmargin, borderColor:BRAND, backgroundColor:'rgba(66,133,244,0.08)', borderWidth:2.5, tension:.25, fill:true, pointRadius:4, pointBackgroundColor:BRAND },
      { label:'Services segment margin', data:FIN.svcMargin, borderColor:BRAND2, borderWidth:2, borderDash:[5,4], tension:.25, pointRadius:3, pointBackgroundColor:BRAND2 } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(x){ return ' '+x.dataset.label+': '+x.parsed.y+'%'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ suggestedMin:15, suggestedMax:45, ticks:{ callback:function(v){ return v+'%'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } } });
}
function gBuildCloudM(){
  var cv=gChartReady('gChartCloudM'); if(!cv) return; gDestroy('gChartCloudM');
  _gCharts['gChartCloudM']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:FIN.cloudMQ.labels, datasets:[{ label:'Cloud op margin', data:FIN.cloudMQ.vals, borderColor:BRAND2, backgroundColor:'rgba(52,168,83,0.10)', borderWidth:2.5, tension:.3, fill:true, pointRadius:3, pointBackgroundColor:BRAND2 }]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(x){ return ' '+x.parsed.y+'% op margin'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:9.5}} }, y:{ suggestedMin:0, suggestedMax:36, ticks:{ callback:function(v){ return v+'%'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } } });
}
function gBuildCap(){
  var cv=gChartReady('gChartCap'); if(!cv) return; gDestroy('gChartCap');
  _gCharts['gChartCap']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:FIN.years.concat(['FY26E']), datasets:[
      { label:'Capex', data:FIN.capex.concat([185]), backgroundColor:FIN.capex.map(function(){return RED;}).concat(['rgba(234,67,53,0.45)']), maxBarThickness:34 },
      { label:'Free cash flow', data:FIN.fcf.concat([null]), backgroundColor:BRAND2, maxBarThickness:34 } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(x){ return x.parsed.y==null?'':(' '+x.dataset.label+': $'+x.parsed.y+'B'+(x.label==='FY26E'?' (guide midpoint, est.)':'')); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } } });
}
function gBuildFin(){
  var cv=gChartReady('gChartFin'); if(!cv) return; gDestroy('gChartFin');
  _gCharts['gChartFin']=new Chart(cv.getContext('2d'),{
    data:{ labels:FIN.years, datasets:[
      { type:'bar', label:'Revenue', data:FIN.rev, backgroundColor:'rgba(66,133,244,0.75)', maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Net income', data:FIN.ni, borderColor:'#188038', borderWidth:2.5, tension:.25, pointRadius:4, pointBackgroundColor:'#188038', yAxisID:'y' } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(x){ return ' '+x.dataset.label+': $'+x.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } } });
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ASSEMBLY — html / deepDiveHtml
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function html(c){
  var h='<div class="ov ov-googl" data-brand="GOOGL" style="--brand:'+BRAND+';--brand-soft:rgba(66,133,244,0.08)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="googlModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="googlModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="googlModalT"></div><div class="ov-modal-b" id="googlModalB"></div></div></div>';
  h+='</div>';
  return h;
}
function deepDiveHtml(c){
  var h='<div class="ov ov-googl ov-googl-dd" data-brand="GOOGL" style="--brand:'+BRAND+';--brand-soft:rgba(66,133,244,0.08)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="customers">Customers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tam">TAM</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="industry">Industry Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments">'+segmentsBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="customers" hidden>'+customersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="tam" hidden>'+tamBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="industry" hidden>'+industryBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="unit">Unit Economics</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="splc">Supply Chain</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="unit">'+unitEconBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="splc" hidden>'+splcBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="margins" hidden>'+marginsBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        ceIRButton()+
        '<div class="ce-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (the print scored against what was frozen, <i>plus</i> the call highlights — the things worth taking into the conversation). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Alphabet. The <b>Watch List</b> is the single home for what we <i>track over time</i>; the Post-Results highlights are <i>talking points</i>, not tracking — so they can include non-trackable call colour (a backlog figure, a capex number, a user count) that would never earn a Watch slot.</div>'+
        // Phase tabs ABOVE the quarter pills: the section decides which quarters exist, so it comes
        // first; the quarter selector below reflects the active section (§6a-ix).
        '<div class="ce-phtabs">'+
          '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
          '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>'+
          '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
        '</div>'+
        ceQPills()+
        '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+(resultsHtml('GOOGL')||ceResultsPending('Results'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+(resultsEvoHtml('GOOGL')||ceResultsPending('Estimates'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+guidanceBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+strategyBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+timelineBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="sensitivity">Sensitivity</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="capital">Capital Allocation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="financials">Financials</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="sensitivity">'+sensBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+peersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="capital" hidden>'+capallocBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="financials" hidden>'+financialsBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+GOOGL_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden>'+ownershipBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+govBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+trackBody(c)+'</div>'+
    '</div>';
  h+='</div>';
  return h;
}

// Results / Estimates panes come from the shared engine (js/results.js), driven by a per-ticker
// dataset in RESULTS_DATA. Until GOOGL's dataset (built from CE_CONS + the Summit projection export,
// per docs/RESULTS_CONVENTIONS.md §6) is registered, the engine returns '' and we show this note.
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once GOOGL\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
}
// ═══ Sub-tab + Deep Dive tab machinery (standardized contract) ══════════════════════════════════
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segments') gBuildSeg();
    else if(key==='industry') wireScatters(root);
  } else if(group==='bottomline'){
    if(key==='margins'){ gBuildMargin(); gBuildCloudM(); }
  } else if(group==='valuation'){
    if(key==='sensitivity') renderSens(root);
    else if(key==='capital') gBuildCap();
    else if(key==='financials') gBuildFin();
  } else if(group==='mgmt'){
    if(key==='team') GOOGL_MGMT.init(root);
  } else if(group==='evolution'){
    // The Setup's track-record charts. Only build when Earnings is the visible subpane AND the
    // Setup phase is the active one — Chart.js needs a non-null offsetParent.
    if(key==='earnings'){
      var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
      if(!ph || ph.getAttribute('data-cep')==='setup'){
        requestAnimationFrame(gBuildCeAnnual);   // the Setup chart IS the Results engine (GOOGL_SETUP)
      }
    }
    // Amazon-style Results / Estimates engine — build lazily when the pane is visible (Chart.js needs
    // a non-null offsetParent). Pass the pane's OWN wrap + ticker so this second engine instance
    // (beside the Setup chart) re-establishes its dataset and wires the right wrap.
    else if(key==='results') requestAnimationFrame(function(){
      initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'GOOGL'); });
    else if(key==='estevo') requestAnimationFrame(initResultsEvo);
  }
}
// Tab switches hide a tall pane and show a shorter one, so the browser clamps scrollTop and the
// page appears to jump to the top. Keep the clicked control visually anchored: measure its
// viewport position, run the change, then scroll by the delta so it does not move. (§6a-iv.)
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
function activeSubKey(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null;
  var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null;
}
function showSub(root, pane, group, key){
  var btn=pane.querySelector('.ovt-subtab[data-ovst="'+key+'"]');
  ceKeepPos(btn||pane, function(){
    pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
    pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
// Earnings phase tabs — nested inside Evolution's earnings subpane, wired independently.
// Show only the quarter pills valid for `phase`; if the active pill just became invalid, activate
// the most-recent valid one and drive the same block-visibility the pill click would.
function ceSelectQuarter(pane, qk){
  pane.querySelectorAll('.ce-qpill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceqsel')===qk); });
  pane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-ceq')!==qk); });
  pane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); });
  var flat=pane.querySelector('.ce-wl-all'); if(flat) flat.hidden=true;
}
function ceApplyPhaseQuarters(pane, phase){
  var pills=Array.prototype.slice.call(pane.querySelectorAll('.ce-qpill')), lastVisible=null, activeVisible=false;
  pills.forEach(function(b){
    var ok=(b.getAttribute('data-ceqhas')||'').split(' ').indexOf(phase)>=0;
    b.hidden=!ok;
    if(ok){ lastVisible=b; if(b.classList.contains('active')) activeVisible=true; }
  });
  // pills render newest-first, so the FIRST visible is the most recent valid quarter.
  var firstVisible=pills.filter(function(b){ return !b.hidden; })[0];
  if(!activeVisible && firstVisible) ceSelectQuarter(pane, firstVisible.getAttribute('data-ceqsel'));
}
function wireCallEarnings(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  pane.querySelectorAll('.ce-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cep');
    ceKeepPos(btn, function(){
    pane.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cep')!==key); });
    ceApplyPhaseQuarters(pane, key);
    });
    // Returning to Setup re-arms the Setup chart (the Results engine; canvases were hidden, so any
    // earlier build produced a zero-size chart).
    if(key==='setup') requestAnimationFrame(gBuildCeAnnual);
  }; });
  // Setup estimates toggle: Consensus ⇄ Summit ⇄ Both (CSS-driven via data-ev on the wrap)
  pane.querySelectorAll('.ce-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ceev');
    pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  // Quarter selector: one Earnings, many quarters — only the selected quarter's blocks render.
  // Picking a quarter also exits the cross-quarter tag view.
  pane.querySelectorAll('.ce-qpill').forEach(function(btn){ btn.onclick=function(){
    ceSelectQuarter(pane, btn.getAttribute('data-ceqsel'));
  }; });
  // initial phase is Setup — every quarter valid, nothing to hide, but keep it consistent.
  ceApplyPhaseQuarters(pane, 'setup');
  // Verdict filter on the print block: All / Beats / Misses / In line. Sets data-f on the tile
  // grid; CSS hides the non-matching tiles. Scoped per quarter block so the active quarter filters.
  pane.querySelectorAll('.ce-vdf button').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.parentNode, host=seg.closest('.ce-fz'); if(!host) return;
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var g=host.querySelector('.ce-fz-g'), v=btn.getAttribute('data-vdf');
    if(g){ if(v==='all') g.removeAttribute('data-f'); else g.setAttribute('data-f', v); }
  }; });
  // Band triage filter: each button shows/hides its own cards. All three start on, so the
  // reader sees the whole call and uses colour to triage; the filter is for narrowing, not for
  // hiding by default (§6a-iv). The highlight cards now live inside the Post-Results pane (the
  // Post-Call tab was dissolved Jul 2026), but the filter is pane-scoped so it still finds them.
  pane.querySelectorAll('.ce-tri-b').forEach(function(btn){ btn.onclick=function(){
    var on=btn.classList.toggle('active');
    var qk=btn.getAttribute('data-cebq'), band=btn.getAttribute('data-ceband');
    var host=pane.querySelector('.ce-hcards[data-cehl="'+qk+'"]'); if(!host) return;
    host.querySelectorAll('.ce-hcard[data-band="'+band+'"]').forEach(function(c){ c.hidden=!on; });
  }; });
  // ── Watch List v3: theme-tag filter (cross-quarter) · tracking-window filter · add/edit/delete
  // against WL_ROWS · and the table + COPY that carries the edits back into the code. ──────────
  var wpane=pane.querySelector('.ce-phpane[data-cep="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.ce-wl-all');
    var form=wpane.querySelector('.ce-wl-addform');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.ce-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function activeWin(){ var b=wpane.querySelector('.ce-wl-win.active'); return b?b.getAttribute('data-wlwin'):'all'; }
    function applyFilters(){
      var tags=activeTags(), on=tags.length>0, win=activeWin();
      // tag selection swaps the per-quarter view for the flat cross-quarter one
      if(on){ wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=true; }); }
      else{
        var act=pane.querySelector('.ce-qpill.active'); var qk=act?act.getAttribute('data-ceqsel'):null;
        wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-ceq')!==qk); });
      }
      if(flat) flat.hidden=!on;
      // both filters are card-level: tags decide WHICH themes, the window decides open vs closed
      wpane.querySelectorAll('.ce-w').forEach(function(card){
        var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
        var isOpen=card.getAttribute('data-wlopen')==='1';
        var hitTag=!on || tags.some(function(t){ return ct.indexOf(t)>=0; });
        var hitWin=(win==='all') || (win==='open'&&isOpen) || (win==='closed'&&!isOpen);
        if(hitTag&&hitWin) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
      });
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('ce-wl-clear')){ wpane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyFilters();
    }; }
    wpane.querySelectorAll('.ce-wl-tag').forEach(wireTag);
    wpane.querySelectorAll('.ce-wl-win').forEach(function(btn){ btn.onclick=function(){
      wpane.querySelectorAll('.ce-wl-win').forEach(function(b){ b.classList.toggle('active', b===btn); });
      applyFilters();
    }; });
    // Registers a tag in the filter bar (so a tag invented while writing a theme becomes available
    // to everyone) and in the form's picker.
    function registerTag(t){
      if(!wpane.querySelector('.ce-wl-tag[data-wltag="'+t+'"]')){
        var b=document.createElement('button'); b.type='button'; b.className='ce-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
        var clear=wpane.querySelector('.ce-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
      }
      var pick=form?form.querySelector('.ce-wl-tagpick'):null;
      if(pick&&!pick.querySelector('[data-pick="'+t+'"]')){
        var p=document.createElement('button'); p.type='button'; p.className='ce-wl-pick'; p.setAttribute('data-pick',t); p.textContent='#'+t;
        p.onclick=function(){ p.classList.toggle('on'); }; pick.appendChild(p);
      }
    }
    // ── the form: shared by add and edit (edit prefills and switches the button) ──
    function fld(k){ return form?form.querySelector('[data-wlf="'+k+'"]'):null; }
    function fval(k){ var el=fld(k); return el?el.value.trim():''; }
    function setF(k,v){ var el=fld(k); if(el) el.value=(v==null?'':v); }
    function pickedTags(){ return Array.prototype.map.call(form.querySelectorAll('.ce-wl-pick.on'), function(b){ return b.getAttribute('data-pick'); }); }
    function resetForm(){
      ['id','theme','definition','trackSince','trackUntil','newtag'].forEach(function(k){ setF(k,''); });
      form.querySelectorAll('.ce-wl-pick.on').forEach(function(b){ b.classList.remove('on'); });
      form.querySelector('.ce-wl-fh-t').textContent='New theme';
      form.querySelector('.ce-wl-add-go').textContent='Add to the live list';
    }
    if(form){
      wlTags().forEach(registerTag);
      var nt=form.querySelector('.ce-wl-newtag-go');
      if(nt) nt.onclick=function(){
        var raw=fval('newtag'); if(!raw) return;
        raw.split(',').forEach(function(t){
          t=t.trim().toLowerCase().replace(/\s+/g,'-'); if(!t) return;
          registerTag(t);
          var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on');
        });
        setF('newtag','');
      };
      var cancel=form.querySelector('.ce-wl-cancel');
      if(cancel) cancel.onclick=function(){ resetForm(); form.hidden=true; };
    }
    var addBtn=wpane.querySelector('.ce-wl-add-btn');
    if(addBtn&&form){ addBtn.onclick=function(){
      if(form.hidden){ resetForm(); form.hidden=false; } else form.hidden=true;
    }; }
    // Re-renders the live quarter's cards, the flat view and the table from WL_ROWS. Cheap enough
    // to do wholesale — this is a 20-row table, not a grid.
    function rerender(){
      var live=ceUpcoming(); if(!live) return;
      var qk=ceQkey(live.q);
      var host=wpane.querySelector('.ce-qblock[data-ceq="'+qk+'"] .ce-watch');
      var rows=wlFor(live.q, true);
      if(host) host.innerHTML=rows.map(function(w){ return ceWatchItem(w, qk, '', null, true); }).join('');
      var flatHost=flat?flat.querySelector('.ce-watch'):null;
      if(flatHost) flatHost.innerHTML=WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('');
      var tb=wpane.querySelector('.ce-wl-tbody');
      if(tb) tb.innerHTML=ceWlTableRows();
      var n=wpane.querySelector('.ce-wl-tbl-n');
      if(n) n.textContent=wlCount();   // the visible proof the table tracked the edit
      wireCards(); applyFilters();
    }
    // ✎ / ✕ on each live-quarter card.
    function wireCards(){
      wpane.querySelectorAll('[data-wledit]').forEach(function(btn){ btn.onclick=function(){
        var r=wlById(btn.getAttribute('data-wledit')); if(!r||!form) return;
        resetForm(); form.hidden=false;
        setF('id',r.id); setF('theme',r.theme); setF('definition',r.definition);
        setF('trackSince',r.trackSince); setF('trackUntil',r.trackUntil);
        (r.tags||[]).forEach(function(t){ registerTag(t); var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on'); });
        form.querySelector('.ce-wl-fh-t').textContent='Edit theme · '+r.id;
        form.querySelector('.ce-wl-add-go').textContent='Save changes';
        form.scrollIntoView({block:'nearest'});
      }; });
      wpane.querySelectorAll('[data-wldel]').forEach(function(btn){ btn.onclick=function(){
        var id=btn.getAttribute('data-wldel');
        var r=wlById(id); if(!r) return;
        if(!window.confirm('Remove "'+r.theme+'" from the Watch List?\n\nSession-only — the hardcoded table is untouched until you COPY it back.')) return;
        var i=WL_ROWS.indexOf(r); if(i>=0) WL_ROWS.splice(i,1);
        rerender();
      }; });
    }
    wireCards();
    var go=wpane.querySelector('.ce-wl-add-go');
    if(go&&form){ go.onclick=function(){
      var theme=fval('theme'); if(!theme){ var t=fld('theme'); if(t) t.focus(); return; }
      var live=ceUpcoming(); if(!live) return;
      var id=fval('id');
      var row=id?wlById(id):null;
      var isNew=!row;
      // New rows go to the end of the sort order — never renumbering the ones already there.
      if(isNew){ row={ id:wlNextId(), q:live.q, rank:wlNextRank(live.q) }; }
      row.theme=theme;
      row.tags=pickedTags();
      row.definition=fval('definition')||null;
      row.trackSince=fval('trackSince')||null;
      row.trackUntil=fval('trackUntil')||null;
      if(isNew) WL_ROWS.push(row);
      (row.tags||[]).forEach(registerTag);
      resetForm(); form.hidden=true;
      rerender();
    }; }
    // ── the copy-out: TSV for a sheet / a paste-back, JSON for an exact hardcode ──
    // Hide / show the table. COPY keeps working while hidden because it serialises WL_ROWS,
    // not the rendered rows — the table is a VIEW of the data, never the storage.
    wpane.querySelectorAll('[data-wltoggle]').forEach(function(btn){ btn.onclick=function(){
      var body=wpane.querySelector('[data-wltblbody]'); if(!body) return;
      var hide=!body.hasAttribute('hidden');
      if(hide) body.setAttribute('hidden',''); else body.removeAttribute('hidden');
      btn.textContent=hide?'show table':'hide table';
    }; });
    wpane.querySelectorAll('.ce-wl-copy[data-wlcopy]').forEach(function(btn){ btn.onclick=function(){
      var kind=btn.getAttribute('data-wlcopy'), txt;
      if(kind==='json'){ txt=JSON.stringify(WL_ROWS, null, 2); }
      else {
        txt=[WL_COLS.map(function(c){ return c.l; }).join('\t')].concat(
          WL_ROWS.map(function(r){ return WL_COLS.map(function(c){
            return wlCellText(r,c.k).replace(/[\t\n]+/g,' ');
          }).join('\t'); })).join('\n');
      }
      var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; }, 1500); };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
      else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
             try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
    }; });
    applyFilters();
  }
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  var btn=root.querySelector('.dd-tab[data-dd="'+key+'"]');
  ceKeepPos(btn||root, function(){
    root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
    root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// ═══ Modal + resolve ════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#googlModalBack'), mT=root.querySelector('#googlModalT'), mB=root.querySelector('#googlModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#googlModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=G_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    if(kind==='ce'){ return CE_POP[id]||null; }
    if(kind==='dds'){ var sg=DD_SEGS[+id]; return sg?{t:sg.ic+' '+esc(sg.n)+' <span class="ov-modal-sub">'+esc(sg.kpi)+'</span>',h:sg.detail}:null; }
    if(kind==='ddc'){ var cu=DD_CUST[+id]; return cu?{t:cu.ic+' '+esc(cu.n)+' <span class="ov-modal-sub">'+esc(cu.tag)+'</span>',h:cu.detail}:null; }
    if(kind==='arena'){ var ar=DD_ARENA[+id]; return ar?{t:ar.ic+' '+esc(ar.n)+' <span class="ov-modal-sub">'+esc(ar.tag)+'</span>',h:ar.detail}:null; }
    if(kind==='guide'){ var gd=G_GUIDE[+id]; return gd?{t:gd.ic+' '+esc(gd.k),h:gd.d}:null; }
    if(kind==='splc'){ var sp=SPLC_INFRA[+id]; return sp?{t:esc(sp.n)+' <span class="ov-modal-sub">'+esc(sp.rel)+' relationship · '+esc(sp.cost)+'</span>',h:sp.d}:null; }
    if(kind==='gexec'){ var ex=G_TRACK[+id]; return ex?{t:esc(ex.n)+' <span class="ov-modal-sub">'+esc(ex.role)+' · '+esc(ex.since)+'</span>',h:ex.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

// ═══ init / deepDiveInit ════════════════════════════════════════════════════════════════════════
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireCallEarnings(root); wireCeTrack(root); wireCeAnnual(root);
  wireModal(root);
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Money-map accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Earnings-calls accordion + By theme ⇄ By quarter lens toggle (standard contract)
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  root.querySelectorAll('.calls-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-callsv');
    root.querySelectorAll('.calls-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var t=root.querySelector('#googlCallsTheme'), q=root.querySelector('#googlCallsQuarter');
    if(t) t.style.display=(v==='theme')?'':'none';
    if(q) q.style.display=(v==='quarter')?'':'none';
  }; });
  // Money-map view toggle (Segments ⇄ Geography)
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ var on=(b===btn); b.style.background=on?'var(--navy)':'transparent'; b.style.color=on?'#fff':'var(--mu)'; });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  // Sensitivity sliders (Valuation ▸ Sensitivity)
  var se=root.querySelector('#gSensEbitda'), sm=root.querySelector('#gSensMult');
  if(se) se.oninput=function(){ SENS.ebitda=parseFloat(se.value); renderSens(root); };
  if(sm) sm.oninput=function(){ SENS.mult=parseFloat(sm.value); renderSens(root); };
  renderSens(root);
  // Peer scatter (Overview collapsible — builds fine on expand since it is pure SVG)
  wireScatters(root);
  // Live market cap (Key Facts cell) — also triggered per peer inside wireScatters
  gLiveOne(root, 'GOOGL');
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  var detail=document.getElementById('co-detailview');
  if(detail){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='googlModalBack') m.remove(); });
    var md=root.querySelector('#googlModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}
export var googlOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
