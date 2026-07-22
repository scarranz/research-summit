// overviews/googl.js — standardized Overview for Alphabet Inc. (NASDAQ: GOOGL / GOOG)
// Follows docs/OVERVIEW_CONVENTIONS.md and mirrors the standardized profile contract (uber.js /
// ibkr.js): a hooked Overview (Key Facts + lede + 2x2 quad + collapsibles) and a 5-tab Deep Dive
// spine (Top Line / Bottom Line / Evolution / Valuation / Management), each with ovt-subtabs.
//
// STATUS: Overview filled; Deep Dive is a staged scaffold (sections fill one by one) EXCEPT
// Evolution ▸ Call Prep, which is live for the Q2 2026 cycle (reports Jul 22, 2026 after close).
//
// Sources: Alphabet Q4/FY2025 earnings release (SEC EDGAR, Ex-99.1, Feb 2026) for all FY2025
// figures; FY sub-splits derived from the four quarterly releases (labeled approximate); company
// IR / 10-K for qualitative content. Live market cap via api.liveQuote (Massive). Peer multiples
// are seeded approximations (mid-2026), labeled — never presented as live.

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
function gLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; G_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='GOOGL'){ var el=root.querySelector('#googlMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } gScRenderAll(root); }).catch(function(){}); }
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
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ov-callout{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '</style>';
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
// one. Evolution ▸ Call Prep is LIVE (Q2 2026 cycle).
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function gddEmpty(){ return '<div class="gdd-empty">🚧 In progress — this section is being built.</div>'; }

// ─── CALL PREP (portable pattern — same contract as ibkr.js; see docs/CALL_PREP_CONVENTIONS.md) ──
// Staged for the Q2 2026 cycle: Alphabet reports Tue Jul 22, 2026 after close. Consensus is
// Bloomberg-only (golden rule) — cells render "—" until the analyst export lands. The Watch List
// and Promise Tracker fill from the earnings-call compendium when it lands.
// Setup v2 (see docs/CALL_PREP_CONVENTIONS.md §6): 4 HEADLINE metrics (mandatory, every
// company: Revenue · Operating income · EPS · EBITDA) + 4 CUSTOM KPIs (company-specific).
// Each metric carries up to two estimates — cons (Street: Bloomberg BST only) and us (Summit:
// our own expectation) — and the grid toggles Consensus ⇄ Summit ⇄ Both. The debate explains
// the DISPARITY between the two sets (which lines diverge and why we see it differently).
var CALL_PREP = {
  ticker:'GOOGL',
  quarters:[
    { q:'Q2 2026', status:'upcoming', date:'Tue Jul 22, 2026 · after close (call 4:30pm ET)',
      setup:{
        source:'Bloomberg (BST consensus) · Summit expectations — to fill', asOf:'2026-07-22',
        headline:[
          { k:'Revenue', cons:{v:117.0,yoy:21,unit:'$B'}, us:null },
          { k:'Operating income', cons:{v:40.5,yoy:30,unit:'$B'}, us:null,
            note:{ t:'Margin bar', h:'<p>Consensus implies a <b>34.8% operating margin</b> vs 32.4% a year ago — the Street is paying for margin expansion <i>while</i> capex roughly doubles. Q1 delivered 36.1%, but it carried a ~3pp FX tailwind on Services that fades to ~1pp in Q2 (management flagged it, unprompted).</p>' } },
          { k:'EPS (diluted)', cons:{v:2.90,yoy:26,unit:'$'}, us:null,
            note:{ t:'⚠ EPS optics after Q1', h:'<p>Q1 EPS printed <b>$5.11 (+82%)</b> — but <b>$37.7B of Other income</b> (mostly unrealized gains on non-marketable securities) drove it. Strip that and the operating line grew 30%.</p><p><b>Read Q2 the same way:</b> headline EPS can swing wildly on marks in either direction; operating income is the honest line.</p>' } },
          { k:'EBITDA', cons:{v:55.5,yoy:31,unit:'$B'}, us:null },
        ],
        custom:[
          { k:'Google Cloud', cons:{v:22.5,yoy:65,unit:'$B'},
            note:{ t:'The backlog math', h:'<p>Backlog hit <b>$462B in Q1 (~2x QoQ)</b>, including the first TPU-hardware agreements. Anat: <b>just over 50% converts to revenue within 24 months</b> — that implies a very steep revenue ramp already contracted. Hold them to that conversion math, not just the growth rate.</p>' } },
          { k:'Search & other', cons:{v:63.3,yoy:17,unit:'$B'} },
          { k:'YouTube ads', cons:{v:10.8,yoy:10,unit:'$B'} },
          { k:'Capex', cons:{v:44.2,yoy:97,unit:'$B'},
            note:{ t:'⚠ The FCF squeeze', h:'<p>At this capex, <b>consensus quarterly FCF is ~$2.3B</b> (FCF margin ~2%… vs a ~$35B net-income quarter). LT debt already jumped <b>$46.5B → $77.5B</b> in Q1 to fund the build.</p><p>FY2026 capex guide: $180–190B (raised in Q1); <b>2027 guided to "significantly increase"</b> — any 2027 number tonight resets the debate.</p>' } },
        ],
        // The previa — the one-picture read going into the print (MANDATORY for the upcoming
        // quarter; it does NOT need Summit numbers — it frames the market's own tension).
        marketDebate:{
          fear:'AI capex is swallowing the cash machine — consensus itself models ~$44B of quarterly capex, ~$2.3B of FCF, and debt already jumped +$31B last quarter.',
          real:'The same consensus models <b>margin EXPANSION</b> (34.8% op vs 32.4% LY) and Cloud +65% — the Street is paying for the machine to keep outrunning the bill.',
          mech:[ {k:'Backlog', v:'$462B · >50% converts in 24m', dir:'up'}, {k:'Capex', v:'~$44B/qtr · FY26 $180–190B', dir:'up'}, {k:'⇒ FCF', v:'~$2.3B modeled', dir:'down'}, {k:'Op margin', v:'34.8% cons', dir:'up'} ],
          synth:'So the real question isn\'t the beat — it\'s whether the <b>contracted demand keeps out-running the capex ladder</b>. Backlog/Cloud accelerate again tonight and the raises stay funded by proof; a mere in-line and the FCF squeeze becomes the story. That\'s the one thing to resolve.'
        },
        // debate rows fill once Summit expectations land (GOOGL not yet in the Summit MCP).
        debate:null
      },
      // Watch List v2 — THEMES tracked over time, not one-quarter metrics. Each item carries
      // `since` (the quarter the theme emerged) and `thread` (its quarter-by-quarter evolution,
      // built from docs/calls/GOOGL.md). Promise-type items live here now (Promise Tracker
      // dissolved per team decision Jul 2026) and in Evolution ▸ Earnings Calls.
      watchList:[
        { rank:1, metric:'Google Cloud — growth × backlog × capacity', since:'Q2 2024',
          tags:['cloud','capex'],
          bbg:'$22.5B (+65%) · backlog est ~$491B',
          breaks:'Growth decelerates materially with backlog stalling — or "capacity-constrained" stops converting into acceleration',
          pista:'For six straight quarters the pattern repeats: management says supply-constrained… and growth ACCELERATES anyway (32→34→48→63%). So ignore the excuse, watch the conversion: >50% of the $462B backlog converts within 24 months (Anat, Q1). That contracted ramp — not the quarterly beat — is the story.',
          why:'Cloud is the acceleration story of the whole company and the justification for the capex; its op margin went 9% → 33% in eight quarters while growth sped up.',
          src:'The #1 recurring theme of the last 6 calls; backlog/RPO is a tracked Bloomberg line; management leads with it every quarter.',
          thread:[
            { q:'Q2 2025', n:'+32% · backlog $106B · first warning: "tight demand-supply into 2026"' },
            { q:'Q3 2025', n:'+34% · backlog $155B (+46% QoQ) · Anthropic plans up to 1M TPUs' },
            { q:'Q4 2025', n:'+48% · backlog $240B (+55% QoQ) · Apple names Google its preferred cloud provider' },
            { q:'Q1 2026', n:'+63% to $20B · backlog $462B (~2x QoQ, incl. first TPU hardware deals) · "revenue would have been higher if we could meet demand"' } ] },
        { rank:2, metric:'The capex ladder → depreciation → free-cash-flow squeeze', since:'Q4 2024',
          tags:['capex'],
          bbg:'Capex $44.2B (+97%) · FY26 guide $180–190B · FCF cons ~$2.3B',
          breaks:'Another guide raise without a matching backlog/revenue proof point — or FCF goes negative while debt keeps rising',
          pista:'The ladder has never stepped down: $75B → $85B → $91–93B (FY25 actual $91.4B) → FY26 $175–185B → $180–190B → 2027 "significantly increase." Meanwhile LT debt +$31B in one quarter and FCF fell to $10B. The tell tonight is the 2027 framing: a number, or another adjective?',
          why:'This is the bear case in one line: AI capex swallowing the cash machine. Consensus already models a near-zero-FCF quarter — the print will show whether the offsets (efficiency, revenue) keep pace.',
          src:'Management flags accelerating depreciation EVERY call, unprompted (candor against interest); the Street asks about it every call.',
          thread:[
            { q:'Q4 2024', n:'FY25 guide $75B — "notably larger than 2023"' },
            { q:'Q2 2025', n:'Raised to ~$85B; "further increase in 2026"' },
            { q:'Q3 2025', n:'Raised to $91–93B; depreciation +41% YoY' },
            { q:'Q4 2025', n:'FY26 guided $175–185B (~2x); depreciation +38% in FY25; Waymo $16B round' },
            { q:'Q1 2026', n:'Raised to $180–190B (Intersect); 2027 "significantly increase"; LT debt $46.5B→$77.5B; FCF $10.1B' } ] },
        { rank:3, metric:'Search through the AI transition — and the standing phrase', since:'Q2 2024',
          tags:['search','monetization'],
          bbg:'Search & other $63.3B (+17%)',
          breaks:'Search decelerates toward single digits — or the monetization language downgrades',
          pista:'For 6+ calls the exact phrase has been: monetization "at approximately the same rate." That phrase IS the thesis — the moment it changes, in either direction, the story changes. Bonus tell: Q1 added a NEW claim — ads coverage above the historical ~20% of queries has "upside" (Philipp). Listen for follow-through, not repetition.',
          why:'~56% of revenue, and the existential AI question is settling empirically: Search ACCELERATED 10→12→12→15→17→19% while AI Overviews and AI Mode rolled into the core product.',
          src:'The recurring analyst question on every call since SGE launched; the standing phrase repeats verbatim across calls, which makes it trackable.',
          thread:[
            { q:'Q1 2025', n:'+10% · AI Overviews 1.5B users/mo · "monetization at approximately the same rate"' },
            { q:'Q2 2025', n:'+12% · AI Mode 100M MAU (US+India) · Lens queries +70%' },
            { q:'Q3 2025', n:'+15% · AI Mode 75M DAU, ads-in-AI-Mode testing begins · paid clicks +7%, CPC +7%' },
            { q:'Q4 2025', n:'+17% · Gemini 3 integrated into AI Mode & AI Overviews · queries at all-time high' },
            { q:'Q1 2026', n:'+19% (retail/finance; FX aid flagged) · NEW: coverage-above-20% upside claim · AI-response cost −30% since Gemini 3' } ] },
        { rank:4, metric:'New-surface monetization promises: AI Mode ads · Direct Offers · Gemini app', since:'Q3 2025',
          tags:['monetization','promises','ai-consumer'],
          bbg:'No clean consensus line — qualitative (promise thread)',
          breaks:'Direct Offers quietly drops off the script — or "not rushing" repeats a 4th time with zero new specifics',
          pista:'A promise ladder to reconcile every quarter: ads in AI Mode "testing" (Q3\'25) → Direct Offers pilot announced (Q4\'25) → "resonating; Gap, L\'Oréal, Chewy signed" + new retail formats + UCP scaling (Q1\'26). Gemini-app ads remain a MUSING — "not rushing," repeated verbatim three calls. And note the silence: Q1 gave NO Gemini app MAU update (last number: 750M in Q4) — worth exactly one question.',
          why:'This is where the next leg of ads growth comes from as the surface shifts — and app monetization is entirely un-modeled by the Street.',
          src:'Direct on-call commitments tracked quarter-over-quarter (Promise-Tracker discipline, now embedded here); silence is a signal.',
          thread:[
            { q:'Q3 2025', n:'"Testing ads in AI Mode… will continue to test before expanding"' },
            { q:'Q4 2025', n:'Direct Offers pilot announced · UCP protocol launched with retail partners · Gemini-app ads: "not rushing"' },
            { q:'Q1 2026', n:'Direct Offers "resonating" (Gap, L\'Oréal, Chewy) · new retail ad format in test · UCP adds Amazon/Meta/Microsoft/Salesforce/Stripe; Ulta live · app ads still "not rushing" · no app-MAU update (silence)' } ] },
        { rank:5, metric:'TPUs go external — silicon becomes a business', since:'Q3 2025',
          tags:['tpu','cloud'],
          bbg:'No consensus line · revenue "small % later this year, vast majority in 2027"',
          breaks:'The 2027 revenue timing gets vaguer — or margin questions get dodged twice',
          pista:'The escalation: Anthropic up to 1M TPUs (Q3\'25) → TPU hardware SOLD into customers\' own data centers (Q1\'26 — Google selling silicon for the first time, already inside the backlog). Tonight\'s tell: any revenue-recognition start or a first margin hint. It is lumpy by design ("will fluctuate… depending on when TPUs are shipped") — don\'t over-read one quarter.',
          why:'A genuine business-model extension (hardware vendor economics) and the hardest proof of the full-stack differentiation claim — 8th-gen TPUs shipping while rivals buy GPUs.',
          src:'New disclosure in Q1 2026 with explicit forward guidance to reconcile; multiple analysts pressed it (Nowak, Post) and got partial answers.',
          thread:[
            { q:'Q3 2025', n:'Anthropic plans access to up to 1M TPUs · Ironwood (7th gen) GA soon' },
            { q:'Q4 2025', n:'TPU accelerators serving frontier labs, capital-markets firms, governments' },
            { q:'Q1 2026', n:'8th-gen TPU 8t/8i unveiled · first hardware sales into customer data centers · "small % of revenue later this year, vast majority 2027"' } ] },
      ],
      results:null, call:null
    },
    // ─── Q1 2026 — REPORTED (Apr 29, 2026). Pre-call blocks FROZEN as they stood when Q4 2025
    // closed; results/call filled after the print/call. Append-only.
    { q:'Q1 2026', status:'reported', date:'Tue Apr 29, 2026 · after close',
      setup:{
        source:'Frozen pre-call view (Apr 2026) — Bloomberg consensus of record in the archive',
        pricedIn:'Post-Q4 euphoria: Gemini 3 shipping, Cloud +48%, and a ~2x FY26 capex guide already (mostly) digested. The bar was "accelerate again, or else" — with the tape most nervous about a capex raise ON TOP of $175–185B.',
        oneLiner:'Pre-call view: backlog conversion ($240B, +55% QoQ) should keep Cloud accelerating and Search holding high-teens; the risk was a print already bought, where any incremental capex surprise gets punished harder than the beat gets paid.'
      },
      watchList:[
        { rank:1, metric:'FY26 capex — does $175–185B hold?', since:'Q4 2024',
          tags:['capex'],
          bbg:'Guide $175–185B; depreciation accelerating', breaks:'A raise without a matching demand proof point',
          pista:'The ladder has never stepped down ($75→85→91-93B in FY25 alone). If they raise AGAIN one quarter after doubling the guide, the only acceptable cover is a hard demand proof (backlog/revenue) delivered in the same breath.',
          why:'The bear case is capex swallowing the cash machine; every raise re-tests it.' },
        { rank:2, metric:'Cloud — backlog conversion & a 5th acceleration', since:'Q2 2024',
          tags:['cloud','capex'],
          bbg:'Backlog $240B (+55% QoQ); growth 48% last Q', breaks:'Growth decelerates or backlog stalls while still claiming supply constraints',
          pista:'Four straight quarters the pattern held: "supply-constrained" + acceleration anyway (28→32→34→48%). Watch whether Anthropic-scale TPU commitments start showing in backlog composition.',
          why:'Cloud is the acceleration story and the capex justification.' },
        { rank:3, metric:'Gemini 3 in Search — the standing phrase + monetization ladder', since:'Q2 2024',
          tags:['search','monetization'],
          bbg:'Search +17% last Q; "monetization at approximately the same rate" (5 calls)', breaks:'Search decel toward low-teens, or the phrase downgrades',
          pista:'Q4 put Gemini 3 INSIDE AI Mode/AIO — the first quarter where the frontier model touches the core engine at scale. The phrase is the tell; also reconcile the Direct Offers pilot announced in Q4 (promise ladder: pilot → traction?).',
          why:'~56% of revenue; the existential question.' },
        { rank:4, metric:'Gemini app ladder post-750M', since:'Q1 2025',
          tags:['ai-consumer'],
          bbg:'750M MAU @Q4 (35M DAU → 450 → 650 → 750M MAU)', breaks:'The disclosure ladder goes quiet',
          pista:'Four consecutive quarters of MAU disclosure = a management-chosen KPI. The tell is not the number — it is whether they KEEP disclosing it. A skipped quarter after a streak is a flag (per the silence rule).',
          why:'The consumer-AI race scoreboard, and the un-modeled ads option.' },
        { rank:5, metric:'Wiz close + UCP rollout (agentic commerce)', since:'Q4 2025',
          tags:['monetization','promises','cloud'],
          bbg:'Wiz pending regulatory; UCP launched Jan @NRF', breaks:'Wiz slips into 2027, or UCP fails to add non-founding members',
          pista:'Two executions to verify, not debate: does Wiz close (and at what margin cost), and does UCP convert from press release to ecosystem (new council members, live merchants).',
          why:'Cloud security pillar + the rails for agentic-era ads.' },
      ],
      results:{
        headline:'A <b>beat with an asterisk</b>: 11th straight double-digit quarter, Cloud\'s 5th acceleration and a ~2x backlog — but the capex guide was raised AGAIN, 2027 was guided "significantly" higher, and the +82% EPS is investment marks, not operations. The business beat; the bill got bigger.',
        scorecard:[
          { metric:'Revenue', cons:'high-teens growth modeled', actual:'$109.9B · +22% (19% cc)', result:'beat' },
          { metric:'Operating income', cons:'~30% growth', actual:'$39.7B · +30% · margin 36.1%', result:'beat',
            note:{ t:'FX inside the beat', h:'<p>Services carried a <b>~3pp FX tailwind</b> — Philipp volunteered the caveat unprompted ("important to keep in mind"). Fades to ~1pp in Q2.</p>' } },
          { metric:'EPS (diluted)', cons:'~mid-20s% growth', actual:'$5.11 · +82%', result:'beat',
            note:{ t:'⚠ The asterisk', h:'<p><b>$37.7B of Other income</b> (mostly unrealized gains on non-marketable securities) drove the +82%. The operating line (+30%) is the honest read — treat headline EPS as optics both ways from here.</p>' } },
          { metric:'Google Cloud', cons:'accelerate again (Street ~mid-50s%)', actual:'$20.0B · +63% · margin 32.9%', result:'beat' },
          { metric:'Cloud backlog', cons:'keep compounding off $240B', actual:'$462B · ~2x QoQ (incl. first TPU hardware deals)', result:'beat' },
          { metric:'Search & other', cons:'hold high-teens', actual:'$60.4B · +19%', result:'beat' },
          { metric:'FY26 capex guide', cons:'hold $175–185B', actual:'RAISED to $180–190B · 2027 "significantly increase"', result:'miss',
            note:{ t:'The ladder extends', h:'<p>Raised one quarter after doubling — cover was Intersect closing + the backlog doubling (a real demand proof, per the watch-item red-line). But <b>2027 got guided UP with an adjective, not a number</b>, and LT debt jumped $46.5B→$77.5B. Quarterly FCF: $10.1B.</p>' } },
          { metric:'Gemini app MAU', cons:'next rung after 750M', actual:'NOT DISCLOSED (engagement color only)', result:'miss',
            note:{ t:'The silence rule fires', h:'<p>Four straight quarters of MAU disclosure, then none. Maybe innocuous (I/O three weeks away) — but per the rules, a skipped KPI after a streak is a flag until re-disclosed.</p>' } },
        ],
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
          { tag:'thesis', head:'Cloud\'s acceleration is contracted, not hoped for — >50% of the $462B backlog converts within 24 months',
            detail:'<p>Enterprise AI became the <b>primary</b> growth driver for the first time: GenAI-product revenue +~800%, new-customer acquisition 2x, customers outpacing commitments +45% (accelerating). Anat: just over half the backlog converts to revenue in 24 months — that is a contracted ramp.</p><p><b>So what:</b> the revenue side of the capex debate is now largely booked, not projected. The question shifts from demand to delivery (capacity).</p>' },
          { tag:'curious', head:'TPU hardware sales — Google becomes a silicon vendor (first time ever)',
            detail:'<p>Demand from AI labs, capital-markets firms and HPC led to delivering TPUs <b>into customers\' own data centers</b>. Revenue: small % late 2026, <b>"vast majority in 2027,"</b> lumpy by design; already inside the backlog.</p><p><b>So what:</b> a genuine business-model extension with NVIDIA-adjacent economics — and the hardest proof of the full-stack claim. Margin profile unanswered (Post pressed; got ROIC framing).</p>' },
          { tag:'watch', head:'The bill: capex re-raised, 2027 "significantly" higher, FCF $10.1B, debt +$31B in one quarter',
            detail:'<p>FY26 to $180–190B (Intersect); 2027 guided up with an adjective; LT debt $46.5B→$77.5B; quarterly FCF $10.1B vs a $62.6B net-income print.</p><p><b>So what:</b> external funding is now part of the model. The offset case: depreciation is flagged candidly every quarter, and serving costs keep collapsing (−30% AI-response cost since Gemini 3). Keep scoring raises against demand proofs.</p>' },
          { tag:'tone', head:'Philipp VOLUNTEERED the FX caveat — candor against interest, weight the quarter accordingly',
            detail:'<p>"Google Services benefited from a strong FX tailwind. <b>That\'s important to keep in mind.</b>" ~3pp in Q1, fading to ~1pp in Q2 — management deflating its own beat, unprompted.</p><p><b>So what:</b> per the candor rule, this auto-promotes: underlying Services growth is ~3pp below headline, and management wants you to know it (credibility-positive).</p>' },
          { tag:'thesis', head:'Search +19% and a NEW quantifiable claim: ads coverage above the ~20%-of-queries level has "upside"',
            detail:'<p>Gemini intent-understanding lets them monetize longer/complex queries "previously really difficult to monetize"; >30% of Search spend already on AI-enabled campaigns; queries at an all-time high.</p><p><b>So what:</b> for years coverage ~20% was treated as structural. Management just made it an expansion vector — a reconcilable claim for next quarter.</p>' },
          { tag:'dots', head:'UCP coalesced the industry in one quarter — the agentic-commerce rails are being laid WITH the ecosystem',
            detail:'<p>Amazon, Meta, Microsoft, Salesforce, Stripe joined the council (with founding Shopify/Etsy/Target/Wayfair); Ulta live in AI Mode/Gemini checkout; Direct Offers "resonating" (Gap, L\'Oréal, Chewy); Kingfisher/Target/Wayfair multi-year cloud+ads deals.</p><p><b>So what:</b> connect the dots — protocol + pilots + retailer cloud deals = Google positioning as the neutral rails of agentic shopping rather than fighting it. The ads pivot has a path.</p>' },
          { tag:'watch', head:'The Gemini app MAU silence — one skipped rung after four straight disclosures',
            detail:'<p>35M DAU → 450M → 650M → 750M MAU… then engagement color only. Subscriptions kept climbing (350M paid; best consumer-AI-plan quarter ever), so the funnel is healthy — but a management-chosen KPI going quiet is a flag until re-disclosed (I/O on May 19 is the natural venue).</p>' },
          { tag:'curious', head:'Antigravity: engineers "orchestrating fully autonomous digital task forces" — the internal flywheel as a margin lever',
            detail:'<p>1.5M weekly active users two months post-launch (per Q4); now framed as shifting Google itself to agentic workflows. Paired with agents in treasury/invoicing and ~50% of code agent-written.</p><p><b>So what:</b> opex discipline while capex explodes is partly AI-automation of Google itself — the quiet reason margins expanded through the build-out.</p>' },
        ],
        dots:'<b>The print bought the capex another quarter.</b> Backlog ~2x + a 5th Cloud acceleration is exactly the demand proof the raises require — and TPU hardware sales open a second monetization of the same silicon. Keep honest: 2027 is an adjective, FCF is thin, debt is rising, and one consumer KPI went quiet.',
        newQuestions:['2027 capex: a number or a framework?','TPU-sale margins + share of backlog','Gemini app MAU (or a second silence)','Coverage-above-20%: follow-through evidence','Backlog conversion pace vs the 24-month claim'],
      }
    },
    // ─── Q4 2025 — REPORTED (Feb 4, 2026). Frozen pre-call blocks + post-print/post-call.
    { q:'Q4 2025', status:'reported', date:'Wed Feb 4, 2026 · after close',
      setup:{
        source:'Frozen pre-call view (Feb 2026)',
        pricedIn:'Gemini 3 landed in December to the best reception of any Google model and the stock ran into the print. Two live questions: how big is the FY26 capex number (Q3 promised "a significant increase — details on the Q4 call"), and does Cloud accelerate past +34% with backlog $155B.',
        oneLiner:'Pre-call view: expect acceleration AND a scary capex number — the print decides which one the tape prices first. Known headwind: YouTube brand lapping record 2024 US-election spend.'
      },
      watchList:[
        { rank:1, metric:'THE FY2026 capex number', since:'Q4 2024',
          tags:['capex'],
          bbg:'Q3 promise: "significant increase, details on the Q4 call"', breaks:'A number so large it has no demand cover (backlog/revenue) in the same print',
          pista:'FY25 walked $75→85→91-93B. The Street whispers a big step; what matters is the COVER delivered with it — last year\'s $75B guide sold the stock off until Cloud results caught up.',
          why:'The single number that repriced the stock at every prior guide.' },
        { rank:2, metric:'Cloud past +34% — and the Anthropic TPU flow-through', since:'Q2 2024',
          tags:['cloud','tpu'],
          bbg:'+34% last Q; backlog $155B (+46% QoQ); Anthropic up to 1M TPUs', breaks:'Growth plateaus in the mid-30s while backlog stalls',
          pista:'Three accelerations in a row with supply constrained. If the Anthropic-scale commitments are real, backlog should jump again BEFORE revenue does — backlog is the leading indicator to score.',
          why:'The acceleration narrative IS the multiple.' },
        { rank:3, metric:'Gemini 3 — the "later this year" promise, delivered?', since:'Q3 2025',
          tags:['search','promises'],
          bbg:'Q3: "excited about our Gemini 3.0 release later this year"', breaks:'Slip into 2026 or a muted reception',
          pista:'A dated, public model promise (rare for Google). Score it binary: shipped + adoption evidence, or not. If shipped, hunt where it touches revenue lines (Search, Cloud, app).',
          why:'Model leadership is the input to every other thesis line.' },
        { rank:4, metric:'Ads in AI Mode: test → product?', since:'Q3 2025',
          tags:['monetization','promises'],
          bbg:'Q3: "testing ads in AI Mode… will continue to test before we expand"', breaks:'The test language repeats verbatim with zero productization',
          pista:'The promise ladder needs a rung: a named format, a pilot, a partner — anything concrete beyond "testing." Silence or verbatim repetition = the monetization timeline is slipping.',
          why:'The bridge from AI engagement to ads revenue.' },
        { rank:5, metric:'YouTube election-lap depth', since:'Q4 2025',
          tags:['youtube'],
          bbg:'Q4 2024 election spend nearly doubled 2020; flagged as a comp headwind twice', breaks:'YouTube ads go negative (beyond the flagged lap)',
          pista:'A KNOWN headwind, twice pre-flagged — the read is magnitude, not existence. Single digits = the lap; worse = something structural. Cross-check subs strength as the offset.',
          why:'Separates a comp effect from a YouTube-ads problem.' },
      ],
      results:{
        headline:'<b>Every Q3 promise landed at once</b>: Gemini 3 shipped and visibly accelerated the whole complex (Search +17%, Cloud +48%, backlog $240B), FY25 closed above $400B — and the capex answer was <b>~2x, $175–185B</b>. One optical drag: a $2.1B Waymo SBC charge sat on op income.',
        scorecard:[
          { metric:'Revenue', cons:'acceleration expected', actual:'$113.8B · +18% (FY25 $403B, +15%)', result:'beat' },
          { metric:'Search & other', cons:'hold mid-teens', actual:'$63.1B · +17% (accel from +15%)', result:'beat' },
          { metric:'Google Cloud', cons:'past +34% (rank-2 watch)', actual:'$17.7B · +48% · margin 30.1%', result:'beat' },
          { metric:'Cloud backlog', cons:'jump before revenue (the leading indicator)', actual:'$240B · +55% QoQ, >2x YoY', result:'beat' },
          { metric:'EPS (diluted)', cons:'~+25% modeled', actual:'$2.82 · +31%', result:'beat' },
          { metric:'Operating income', cons:'~+20%', actual:'$35.9B · +16% reported', result:'inline',
            note:{ t:'The Waymo charge', h:'<p>A <b>$2.1B SBC charge</b> (Waymo\'s valuation step-up in the $16B round) sat mostly in R&D — reported +16% understates an underlying ~+22%. Same lesson as the Q3 EC fine: read op income ex-items first.</p>' } },
          { metric:'YouTube ads', cons:'single digits = just the lap', actual:'$11.4B · +9% (DR-led; election lap confirmed)', result:'inline' },
          { metric:'FY26 capex guide', cons:'"significant increase" — the number', actual:'$175–185B (~2x FY25\'s $91.4B)', result:'miss',
            note:{ t:'Scored as the shock it was', h:'<p>Roughly DOUBLE the FY25 spend, with FY25 depreciation already +38%. The demand cover (backlog +55%, Cloud +48%) arrived in the same print — per the red-line, covered. But the magnitude reset every model.</p>' } },
        ],
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
          { tag:'dots', head:'Apple picked Google twice in one announcement — the validation no marketing could buy',
            detail:'<p>Preferred cloud provider + next-generation <b>Apple foundation models based on Gemini</b>. Connect: 9-of-10 AI labs on Google Cloud (Q3) + Anthropic\'s 1M TPUs + now Apple = rivals repeatedly choosing Google\'s stack over building or buying elsewhere.</p><p><b>So what:</b> structural revenue + the strongest third-party proof of model/infra leadership to date. Watch scope and timing next quarter.</p>' },
          { tag:'thesis', head:'Gemini 3 accelerated the WHOLE complex within one quarter of shipping',
            detail:'<p>Search +17% (accel), AI Mode queries/user doubled, app to 750M MAU with engagement "significantly higher," Cloud +48% "driven by demand for industry-leading models, including Gemini 3."</p><p><b>So what:</b> the model→product→revenue transmission is now measurable in-quarter — the core reason to believe the capex converts.</p>' },
          { tag:'watch', head:'$175–185B: the ladder goes ~2x — with the cover attached, but depreciation compounding',
            detail:'<p>FY25 depreciation +38% ($15.3B→$21.1B) and "accelerating meaningfully" in 2026; Q4 buybacks slowed to $5.5B (from $11.5B in Q3) — the first capital-allocation tell of the build-out.</p><p><b>So what:</b> covered this quarter by backlog +55%. The standing rule from here: every raise must arrive with its proof.</p>' },
          { tag:'tone', head:'Efficiency candor: Gemini serving unit costs −78% over 2025 — the other half of the capex story',
            detail:'<p>Volunteered alongside the giant guide: serving costs collapsing via model optimization/utilization; ~50% of code agent-written; agents running treasury/invoice workflows.</p><p><b>So what:</b> management\'s implicit argument is $/unit-of-AI falling faster than units grow — the margin math that makes the guide survivable. Track margins, not just the guide.</p>' },
          { tag:'curious', head:'8M Gemini Enterprise paid seats in four months — the fastest enterprise-seat ramp Google has disclosed',
            detail:'<p>2,800+ companies; 5B customer interactions in Q4 (+65% YoY); ISV commitments from top-15 software partners +16x. Plus 120K+ enterprises using Gemini; 95% of top-20 SaaS.</p><p><b>So what:</b> the seat business gives Cloud a recurring, high-margin layer on top of consumption — margin mix quietly improving.</p>' },
          { tag:'curious', head:'Reliance Jio: Gemini to 500M consumers — distribution as a weapon in the consumer-AI race',
            detail:'<p>18-month free Gemini suite + 2TB storage to 500M+ Jio users; Reliance enterprise gets Gemini Enterprise + TPUs.</p><p><b>So what:</b> the answer to "how do you out-scale ChatGPT" is distribution deals no rival can match (Samsung at CES, now Jio). Watch conversion economics, not just reach.</p>' },
          { tag:'watch', head:'Waymo: the $16B round (largest ever) — external validation, and a $2.1B optical charge',
            detail:'<p>Alphabet funded a significant portion; the valuation step-up produced the SBC charge (R&D). 20M trips; 400K rides/week; Miami live; UK/Japan next.</p><p><b>So what:</b> external price discovery for a business the sum-of-parts models at zero — and a recurring lesson in reading reported op income through one-offs.</p>' },
          { tag:'dots', head:'Promise ladder advanced: Direct Offers pilot + UCP protocol = the monetization bridge gets its first planks',
            detail:'<p>Q3 said "testing ads in AI Mode." Q4 delivered named rungs: <b>Direct Offers</b> (exclusive offers inside AI Mode) and <b>UCP</b>, an open agentic-commerce standard co-built with Shopify/Etsy/Target/Wayfair. Gemini-app ads: "not rushing" (again).</p><p><b>So what:</b> the test→product ladder is climbing on schedule; app ads remain the free option nobody models.</p>' },
        ],
        dots:'<b>Ship the model, prove the demand, then present the bill.</b> Gemini 3 → acceleration everywhere → backlog +55% → a ~2x capex guide that the same print justified. Apple + Jio + 8M seats say the stack is winning outside; serving costs −78% say the inside math can hold. The debate moves to 2026 delivery: capacity, depreciation, and the first revenue from the new ladders.',
        newQuestions:['Does FY26 $175–185B hold at Q1, and what is the 2027 shape?','Backlog conversion: does $240B start showing in revenue acceleration again?','Gemini 3 in Search: does the standing phrase survive the integration?','Gemini app: next MAU rung after 750M?','Wiz close timing + UCP: members beyond the founders?'],
      }
    }
  ]
};
function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }

function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-phtabs{display:inline-flex;gap:3px;background:rgba(66,133,244,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.cp-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.cp-phtab:hover{color:var(--navy)}.cp-phtab.active{background:'+BRAND+';color:#fff}'+
    '.cp-phpane[hidden]{display:none}'+
    /* quarter selector — one Call Prep, many quarters; only the selected quarter renders (page stays light) */
    '.cp-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.cp-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-qpill:hover{color:var(--navy)}.cp-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.cp-qpill .cp-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.cp-qblock[hidden]{display:none}'+
    '.cp-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    /* watch-list theme tags (cross-quarter filter) + add-theme form */
    '.cp-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.cp-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-wl-tag:hover{background:rgba(122,90,248,0.08)}.cp-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.cp-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.cp-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-wl-addform{display:flex;flex-direction:column;gap:7px;border:1px dashed '+BRAND+';border-radius:10px;padding:12px;margin:0 0 12px;background:rgba(66,133,244,0.03)}'+
    '.cp-wl-addform[hidden]{display:none}'+
    '.cp-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy)}'+
    '.cp-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:6px 13px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.cp-wl-all[hidden]{display:none}.cp-w[data-wlhide]{display:none}'+
    '.cp-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.cp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.cp-grid4{grid-template-columns:1fr 1fr}}'+
    '.cp-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.cp-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.cp-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    /* Setup v2 — estimates toggle (Consensus ⇄ Summit ⇄ Both) */
    '.cp-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-ev-pill.active{background:var(--navy);color:#fff}'+
    '.cp-cell-custom{border-top-color:'+YELLOW+'}'+
    '.cp-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.cp-val{display:flex;align-items:baseline;gap:7px}'+
    '.cp-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.cp-val-cons .cp-val-lab{background:rgba(26,115,232,0.10);color:'+BLUE+'}'+
    '.cp-val-us .cp-val-lab{background:rgba(52,168,83,0.12);color:'+BRAND2+'}'+
    '.cp-evwrap[data-ev="cons"] .cp-val-us{display:none}'+
    '.cp-evwrap[data-ev="us"] .cp-val-cons{display:none}'+
    '.cp-evwrap:not([data-ev="both"]) .cp-val-lab{display:none}'+
    '.cp-evwrap[data-ev="both"] .cp-cell-v{font-size:13px}'+
    '.cp-evwrap[data-ev="both"] .cp-val{margin-top:3px}'+
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.cp-watch{display:flex;flex-direction:column;gap:11px}'+
    '.cp-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.cp-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    '.cp-w-rank{width:26px;height:26px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}'+
    '.cp-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.cp-w-q{display:flex;gap:8px;align-items:flex-start;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;margin-top:8px}.cp-w-q .mic{flex:none}'+
    '.cp-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.cp-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.cp-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.cp-info:hover{filter:brightness(1.1)}'+
    '.cp-debate{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:4px 0}@media(max-width:600px){.cp-debate{grid-template-columns:1fr}}'+
    '.cp-dc{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.cp-dc.fear{border-top:4px solid '+RED+';background:linear-gradient(180deg,rgba(234,67,53,0.04),transparent)}'+
    '.cp-dc.real{border-top:4px solid '+BRAND2+';background:linear-gradient(180deg,rgba(52,168,83,0.05),transparent)}'+
    '.cp-dc-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}'+
    '.cp-dc.fear .cp-dc-h{color:'+RED+'}.cp-dc.real .cp-dc-h{color:'+BRAND2+'}'+
    '.cp-dc-b{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-mech{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0}'+
    '.cp-mech-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:800;border:1px solid var(--bdr);border-radius:9px;padding:7px 12px;background:var(--w);color:var(--navy)}'+
    '.cp-mech-ar{font-size:15px;color:var(--mu)}'+
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#AECBFA}'+
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(26,115,232,0.08);border:1px solid rgba(26,115,232,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#AECBFA}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(66,133,244,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
    '.cp-sc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.cp-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.cp-sc-c{font-size:11px;color:var(--mu)}.cp-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.cp-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.cp-sc-row{grid-template-columns:1fr auto}.cp-sc-c,.cp-sc-a{display:none}}'+
    '.cp-tc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.cp-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.cp-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.cp-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.cp-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}</style>';
}
// A · The Setup — 4 headline + 4 custom KPIs, each with Street (Bloomberg) AND Summit (our own)
// estimates, switchable Consensus ⇄ Summit ⇄ Both. The debate explains the disparity between the
// two sets. (Spec: docs/CALL_PREP_CONVENTIONS.md §6.)
function cpFmtC(o){ if(!o||o.v==null) return '<span class="cp-empty">—</span>';
  var un=o.unit||'', v=o.v, s;
  if(un==='$') s='$'+v; else if(un==='$M') s='$'+v+'M'; else if(un==='$B') s='$'+v+'B';
  else if(un==='%') s=v+'%'; else s=String(v);
  return s+(o.yoy!=null?'<span style="font-size:10px;color:#0a8f4c;font-weight:800;margin-left:5px">+'+o.yoy+'%</span>':''); }
function cpEvCell(key, m, isCustom){
  var name=m&&m.k?m.k:null;
  var q=(m&&m.note)?cpQ('setnote-'+key, m.note.t, m.note.h):'';
  var kHtml=name?esc(name):'<span class="cp-empty">Custom KPI — to define</span>';
  return '<div class="cp-cell'+(isCustom?' cp-cell-custom':'')+'"><div class="cp-cell-k">'+kHtml+q+'</div>'+
    '<div class="cp-cell-v">'+
      '<div class="cp-val cp-val-cons"><span class="cp-val-lab">Street</span>'+cpFmtC(m&&m.cons)+'</div>'+
      '<div class="cp-val cp-val-us"><span class="cp-val-lab">Summit</span>'+cpFmtC(m&&m.us)+'</div>'+
    '</div></div>';
}
function cpQkey(q){ return String(q||'').replace(/\s/g,''); }
// Renders the quarter-pill selector (shared across the four phase panes via .cp-qblock filtering).
function cpQPills(){
  return '<div class="cp-qpills">'+CALL_PREP.quarters.map(function(q,i){
    return '<button type="button" class="cp-qpill'+(i===0?' active':'')+'" data-cpqsel="'+esc(cpQkey(q.q))+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="cp-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
function cpSetupBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{};
    if(st.headline){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?('Reports <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      var hl=st.headline||[], cu=st.custom||[];
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="cp-ev-pill active" data-cpev="cons">Consensus</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="us">Summit</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="both">Both</button>'+
        '</span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="cp-evwrap" data-ev="cons">';
      b+='<div class="cp-row-cap">Headline — every company, always</div>';
      b+='<div class="cp-grid4">'+hl.map(function(m,i){ return cpEvCell('hl-'+qk+'-'+i, m, false); }).join('')+'</div>';
      b+='<div class="cp-row-cap" style="margin-top:12px">Custom KPIs — GOOGL</div>';
      b+='<div class="cp-grid4">'+cu.map(function(m,i){ return cpEvCell('cu-'+qk+'-'+i, m, true); }).join('')+'</div>';
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Green = YoY. <b>Street</b> = Bloomberg (BST) consensus, hardcoded from the team\'s export only. <b>Summit</b> = our own expectation (Summit model / analyst). <b>?</b> = a number with a caveat worth knowing.</div>';
      // ── The previa — the one-picture read going in (market's own tension; no Summit needed) ──
      var md=st.marketDebate;
      if(md){
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The setup, in one picture — what the print will settle</b></div>';
        b+='<div class="cp-debate">'+
          '<div class="cp-dc fear"><div class="cp-dc-h">What the tape fears</div><div class="cp-dc-b">'+md.fear+'</div></div>'+
          '<div class="cp-dc real"><div class="cp-dc-h">What consensus actually models</div><div class="cp-dc-b">'+md.real+'</div></div>'+
        '</div>';
        if(md.mech&&md.mech.length){
          b+='<div class="cp-mech">'+md.mech.map(function(m,i){ var ar=m.dir==='up'?'<span style="color:#0a8f4c">▲</span>':(m.dir==='down'?'<span style="color:'+RED+'">▼</span>':''); return (i>0?'<span class="cp-mech-ar">→</span>':'')+'<span class="cp-mech-chip">'+ar+' '+esc(m.k)+' <span style="color:var(--mu);font-weight:700">'+esc(m.v)+'</span></span>'; }).join('')+'</div>';
        }
        if(md.synth) b+='<div class="cp-synth">'+md.synth+'</div>';
      }
      var d=st.debate;
      b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The debate — where Summit differs from the Street, and why</b></div>';
      if(d){
        if(d.rows&&d.rows.length){
          b+='<div class="cp-tc">'+d.rows.map(function(r){
            return '<div class="cp-tc-row" style="border-left:3px solid '+BRAND+'"><span style="font-weight:800;color:var(--navy);white-space:nowrap">'+esc(r.k)+'</span><span><b>Street:</b> '+esc(r.street||'—')+' · <b>Summit:</b> '+esc(r.us||'—')+'<br><span style="color:var(--mu)">'+ (r.why||'') +'</span></span></div>';
          }).join('')+'</div>';
        }
        if(d.synth) b+='<div class="cp-synth">'+d.synth+'</div>';
      } else {
        b+='<div class="cp-note">Fills once both estimate sets are in (Bloomberg export + Summit expectations): line-by-line disparities and the mechanism behind why we see it differently.</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    } else {
      // Frozen pre-call view for reported quarters (the contemporaneous read, never rewritten).
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      if(st.pricedIn) b+='<div class="cp-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="cp-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results / Post-Call for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// One watch-item card. idSfx keeps pop-up ids unique between the per-quarter and the
// cross-quarter (flat) renders; qLabel shows the quarter chip in the flat view.
function cpWatchItem(w, qk, idSfx, qLabel){
  var deep='';
  if(w.src) deep+='<p><b>Why it\'s on the list:</b> '+w.src+'</p>';
  if(w.why) deep+='<p><b>Why it matters:</b> '+w.why+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?cpReg('watchwhy-'+qk+'-'+(w.rank||0)+idSfx, esc(w.metric), deep):null;
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  return '<div class="cp-w" data-wltags="'+esc(tagsAttr)+'"><div class="cp-w-top"><div class="cp-w-rank">'+(w.rank||'•')+'</div><div class="cp-w-metric">'+esc(w.metric)+'</div>'+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(66,133,244,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why'+(w.thread?' + the thread':'')+' ›</span>':'')+'</div>'+
    '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
    '<div class="cp-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="cp-w-chip" style="background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);color:var(--navy)">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.since?'<span class="cp-w-chip" style="background:rgba(251,188,5,0.12);border:1px solid rgba(183,121,31,0.35);color:var(--navy)"><b>Tracking since:</b> '+esc(w.since)+'</span>':'')+
      (w.bbg?'<span class="cp-w-chip cons"><b>Cons:</b> '+esc(w.bbg)+'</span>':'')+
      (w.breaks?'<span class="cp-w-chip red"><b>Breaks if:</b> '+esc(w.breaks)+'</span>':'')+
    '</div>'+
  '</div>';
}
function cpWatchTags(){
  var set=[], seen={};
  CALL_PREP.quarters.forEach(function(u){ (u.watchList||[]).forEach(function(w){ (w.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); }); });
  return set;
}
function cpWatchBody(c){
  var h=cpStyle();
  // ── Tag bar: select themes ACROSS quarters (multi-select). Empty selection = per-quarter view. ──
  h+='<div class="cp-wl-tagbar"><span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)">Filter by theme (across quarters):</span>'+
    cpWatchTags().map(function(t){ return '<button type="button" class="cp-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="cp-wl-tag cp-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="cp-wl-add-btn">+ Add theme</button>'+
  '</div>';
  // Add-theme mini form (session-only; persisting = committing it into CALL_PREP).
  h+='<div class="cp-wl-addform" hidden>'+
    '<input class="cp-wl-in" data-wlf="metric" placeholder="Theme (e.g. Regulatory: DOJ ad-tech remedies)">'+
    '<input class="cp-wl-in" data-wlf="tags" placeholder="tags, comma-separated (e.g. regulatory, search)">'+
    '<input class="cp-wl-in" data-wlf="pista" placeholder="The tell 🔎 — a standing read, not a question">'+
    '<input class="cp-wl-in" data-wlf="breaks" placeholder="Breaks if… (the falsifiable red-line)">'+
    '<div><button type="button" class="cp-wl-add-go">Add to this quarter\'s list</button><span class="ave-subh-note" style="margin-left:8px">Lives for this session — to persist it, it gets committed into CALL_PREP.</span></div>'+
  '</div>';
  // Per-quarter blocks (default view)
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    b+='<p class="ov-lede"><b>Five things to hunt — '+esc(u.q)+'</b>'+(frozen?' <span style="color:var(--mu);font-weight:600">(as seeded when the prior quarter closed — the contemporaneous hunting list, scored in Post-Results)</span>':'')+', ranked by <b>how much they move the stock × how debated they are</b>. Each = a theme, its consensus, the red-line that breaks the thesis, and <b>the tell</b> (🔎). Tap <b>why ›</b> for grounding + the thread.</p>';
    var wl=u.watchList||[];
    if(!wl.length){ b+='<div class="cp-note">Watch List builds from the earnings-call record + the Bloomberg export — 5 ranked, grounded, falsifiable items per the conventions.</div>'; }
    else{ b+='<div class="cp-watch">'+wl.map(function(w){ return cpWatchItem(w, qk, '', null); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results/Post-Call; its <code>newQuestions</code> seeded the next quarter.':'Frozen once the quarter opens; scored against Post-Results / Post-Call. Themes carry their quarter-by-quarter thread (source: docs/calls/GOOGL) — promise-type items are tracked here and in Evolution ▸ Earnings Calls.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  // Flat cross-quarter container (hidden until a tag is selected)
  h+='<div class="cp-wl-all" hidden>';
  h+='<div class="cp-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="cp-watch">'+CALL_PREP.quarters.map(function(u){
    var qk=cpQkey(u.q);
    return (u.watchList||[]).map(function(w){ return cpWatchItem(w, qk, '-f', u.q); }).join('');
  }).join('')+'</div>';
  h+='</div>';
  return h;
}
// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
var CP_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'} };
var CP_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
function cpResultsBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b> Results land first (release ~4pm, call comes later) — the read on the <b>print itself</b>, before management says a word.</p>';
    var r=q.results;
    if(!r){ b+='<div class="cp-note">Empty until the print lands. Then the scorecard and thesis red-line check fill here.</div></div>'; return b; }
    b+='<div style="border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;margin-bottom:14px;background:var(--w)">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· reported '+esc(q.date?q.date.replace(/ · .*/,''):'')+'</span></div>';
    if(r.headline) b+='<div class="cp-take" style="border-left-color:'+BRAND2+'">🎯 '+r.headline+'</div>';
    if(r.scorecard&&r.scorecard.length){
      b+='<div class="cp-sc">'+r.scorecard.map(function(d,i){ var rr=CP_RES[d.result]||CP_RES.inline;
        var qb=d.note?cpQ('resnote-'+qk+'-'+i, d.note.t||'Context', d.note.h||d.note):'';
        return '<div class="cp-sc-row" style="--sc:'+rr.c+'"><div class="cp-sc-m">'+esc(d.metric)+qb+'</div><div class="cp-sc-c">cons: '+cpFill(d.cons,'—')+'</div><div class="cp-sc-a">'+esc(d.actual||'')+'</div><div class="cp-sc-v">'+rr.l+'</div></div>';
      }).join('')+'</div>';
    }
    if(r.thesisCheck&&r.thesisCheck.length){
      b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:14px 0 6px">Thesis red-line check — vs this quarter\'s frozen Watch List</div>';
      b+='<div class="cp-tc">'+r.thesisCheck.map(function(t){ var col=t.tripped?RED:'#0a8f4c'; var ic=t.tripped?'⚑ TRIPPED':'✓ held';
        return '<div class="cp-tc-row" style="border-left:3px solid '+col+'"><span style="font-weight:800;color:'+col+';white-space:nowrap">'+ic+'</span><span><b>'+esc(t.line)+'</b> — '+esc(t.note||'')+'</span></div>';
      }).join('')+'</div>';
    }
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="cp-dots" style="margin-top:14px">🎯 <b>What the numbers tee up for the call</b> — go in hunting these:'+
        '<ul class="ov-bullets" style="margin-top:6px">'+r.intoCall.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div>';
    }
    b+='<div style="margin-top:10px;font-size:11.5px;color:var(--navy)"><b>Price reaction:</b> '+cpFill(r.priceReaction,'to fill from a trusted source')+'</div>';
    b+='</div>';
    b+='<div class="ov-foot">Scored against the frozen Watch List. Consensus = Bloomberg export; actuals = reported (Bloomberg / release).</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// E · Post-Call ── insight-first highlights (theme by theme, depth in pop-ups) + the meeting take.
function cpCallBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+RED+'">③ Post-Call</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — not a restatement of the numbers; the story behind them.</b> What the call <i>implied</i> for the thesis, the curious one-mention details, and the dots that connect. Tap any highlight for the depth.</p>';
    var cc=q.call;
    if(!cc){ b+='<div class="cp-note">Empty until the call/transcript is in. Then the meeting take, theme-by-theme highlights and the connect-the-dots line fill here.</div></div>'; return b; }
    b+='<div style="margin-bottom:18px">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· call '+esc(q.date||'')+'</span></div>';
    if(cc.take) b+='<div class="cp-take">🎯 '+cc.take+'</div>';
    if(cc.highlights&&cc.highlights.length){
      b+='<div class="cp-hl">'+cc.highlights.map(function(x,i){ var tg=CP_HLTAG[x.tag]||{c:'#6b7684',l:x.tag||''};
        var id=x.detail?cpReg('hl-'+qk+'-'+i, tg.l+' — '+String(x.head).replace(/<[^>]+>/g,''), x.detail):null;
        return '<div class="cp-hl-row" style="--hc:'+tg.c+'"'+(id?' data-detail="cp:'+id+'"':'')+'><span class="cp-hl-tag">'+esc(tg.l)+'</span><span class="cp-hl-head">'+x.head+'</span>'+(id?'<span class="cp-hl-more">＋</span>':'<span></span>')+'</div>';
      }).join('')+'</div>';
    }
    if(cc.dots) b+='<div class="cp-dots">🧩 '+cc.dots+'</div>';
    if(cc.newQuestions&&cc.newQuestions.length){
      b+='<div style="margin-top:12px"><div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin-bottom:4px">➡ Seeds next quarter\'s Watch List</div><ul class="ov-bullets" style="margin-top:2px">'+cc.newQuestions.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>';
    }
    b+='</div>';
    b+='<div class="ov-foot">Insight-first, not fact-first. Append-only — prior quarters are never overwritten; <code>newQuestions</code> feeds the next Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — GOOGL_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/GOOGL.md + GOOGL-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var CP_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
var GOOGL_THEMES=[
  { theme:'Google Cloud: acceleration + the backlog machine', st:'trend',
    why:'From 26% to 63% growth in six quarters with backlog compounding faster than revenue — supply-constrained every single quarter, and it accelerated anyway.',
    updates:[
      { q:'Q4 2024', items:['+30% to $12B; "exited the year with <b>more demand than we had available capacity</b>."'] },
      { q:'Q1 2025', items:['+28%; "tight demand-supply; relatively higher capacity deployment towards the end of 2025."'] },
      { q:'Q2 2025', items:['+32%; backlog <b>$106B</b>; $1B+ deals in H1 = all of 2024; run-rate >$50B.'] },
      { q:'Q3 2025', items:['+34% to $15.2B; backlog <b>$155B (+46% QoQ)</b>; $1B+ deals in 9 months > prior 2 years combined; margin 23.7%.'] },
      { q:'Q4 2025', items:['<b>+48% to $17.7B</b>; backlog <b>$240B (+55% QoQ)</b>; run-rate >$70B; margin 30.1%; <b>8M Gemini Enterprise paid seats</b> in 4 months.'] },
      { q:'Q1 2026', items:['<b>+63% to $20B</b>; backlog <b>$462B (~2x QoQ)</b>; GenAI-product revenue +~800% YoY; margin 32.9% (17.8% LY); "revenue <b>would have been higher</b> if we could meet demand."'] },
    ]},
  { theme:'The capex ladder & the depreciation drumbeat', st:'watch',
    why:'Five consecutive raises, never a step down; management flags accelerating depreciation unprompted every quarter — candor against interest, and the core bear debate (FCF).',
    updates:[
      { q:'Q4 2023', items:['"2024 CapEx <b>notably larger</b> than 2023."'] },
      { q:'Q2 2024', items:['Sundar: <b>"the risk of underinvesting is dramatically greater than the risk of overinvesting."</b>'] },
      { q:'Q4 2024', items:['FY25 guide <b>$75B</b>; depreciation +28% in 2024 and accelerating.'] },
      { q:'Q2 2025', items:['Raised to <b>~$85B</b>; "further increase in 2026"; Q2 FCF only $5.3B (capex + tax timing).'] },
      { q:'Q3 2025', items:['Raised to <b>$91–93B</b>; depreciation +41% YoY.'] },
      { q:'Q4 2025', items:['FY26 guided <b>$175–185B (~2x FY25\'s $91.4B)</b>; FY25 depreciation +38% ($15.3B→$21.1B).'] },
      { q:'Q1 2026', items:['Raised to <b>$180–190B</b> (Intersect); <b>2027 "significantly increase"</b>; LT debt <b>$46.5B→$77.5B</b> in one quarter; quarterly FCF $10.1B.'] },
    ]},
  { theme:'Search through the AI transition — & the standing phrase', st:'trend',
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
    ]},
  { theme:'New-surface monetization: AI Mode ads · Direct Offers · Gemini app', st:'promise',
    why:'The promise ladder to reconcile every quarter (ex-Promise-Tracker thread). AI-Mode ads climbed test → pilot → traction; Gemini-app ads remain a MUSING — "not rushing," three calls verbatim.',
    updates:[
      { q:'Q4 2024', items:['App ads: "very good ideas for native ad concepts… this year focused on the <b>subscription direction</b>."'] },
      { q:'Q3 2025', items:['<b>"Testing ads in AI Mode…</b> will continue to test and learn before we expand."'] },
      { q:'Q4 2025', items:['<b>Direct Offers pilot announced</b> (exclusive offers in AI Mode) · UCP agentic-commerce protocol launched with retail founding partners · app ads: <b>"not rushing."</b>'] },
      { q:'Q1 2026', items:['Direct Offers <b>"resonating"</b> — Gap, L\'Oréal, Chewy signed · new retailer ad format in test · <b>UCP adds Amazon, Meta, Microsoft, Salesforce, Stripe</b>; Ulta live in AI Mode/Gemini checkout · app ads still "not rushing" (3rd time).'] },
    ]},
  { theme:'Gemini consumer scale — users, subscriptions… and one silence', st:'watch',
    why:'The disclosure ladder ran hot for a year — then Q1 2026 skipped the app-MAU number. Silence after a streak of disclosure is a flag.',
    updates:[
      { q:'Q1 2025', items:['Gemini app <b>~35M DAU</b> (DOJ-trial disclosure, acknowledged in Q&A) · <b>270M paid subs</b>.'] },
      { q:'Q2 2025', items:['<b>450M MAU</b>; daily requests +50% QoQ.'] },
      { q:'Q3 2025', items:['<b>650M MAU</b>; queries 3x QoQ · <b>300M paid subs</b> crossed.'] },
      { q:'Q4 2025', items:['<b>750M MAU</b>; engagement/user sharply up post-Gemini 3 · <b>325M paid subs</b>.'] },
      { q:'Q1 2026', items:['<b>NO MAU update</b> (engagement color only — watch) · <b>350M paid subs</b>; strongest consumer-AI-plan quarter ever.'] },
    ]},
  { theme:'Full stack & TPUs: from internal edge to external silicon business', st:'promise',
    why:'A decade of TPUs became a commercial weapon — frontier labs on TPUs, then the first hardware SALES into customer data centers, with explicit revenue timing to hold them to.',
    updates:[
      { q:'Q3 2024', items:['Trillium (6th gen); cloud customers consume <b>8x the compute</b> vs 18 months prior; AIO query cost <b>−90% in 18 months</b>.'] },
      { q:'Q1 2025', items:['<b>Ironwood</b> (7th gen) — first designed for inference at scale; first with Blackwell GB200.'] },
      { q:'Q3 2025', items:['<b>Anthropic plans up to 1M TPUs</b>; GB300 first to ship.'] },
      { q:'Q4 2025', items:['Gemini serving unit cost <b>−78% over 2025</b>; accelerators serving frontier labs, capital-markets firms, governments.'] },
      { q:'Q1 2026', items:['<b>8th-gen TPU (8t/8i)</b> · <b>FIRST hardware sales into customers\' own data centers</b> · revenue "small % late 2026, <b>vast majority 2027</b>," lumpy by design · already inside the $462B backlog.'] },
    ]},
  { theme:'Partnership validation: Apple, OpenAI, Reliance, NVIDIA', st:'trend',
    why:'The quiet external proof of the stack — rivals and giants keep choosing Google infrastructure.',
    updates:[
      { q:'Q2 2025', items:['<b>OpenAI begins using Google Cloud</b> ("very excited to be partnering with them"); PayPal multi-product deal.'] },
      { q:'Q3 2025', items:['<b>9 of the top-10 AI labs</b> on Google Cloud; NVIDIA GB300 first to ship.'] },
      { q:'Q4 2025', items:['<b>Apple: Google as preferred cloud provider + next-gen Apple foundation models built on Gemini</b> · Reliance Jio: Gemini to 500M consumers.'] },
      { q:'Q1 2026', items:['American Express, Vodafone agentic-data wins · <b>Wiz closed (Mar)</b> — "performance exceeded expectations"; low-single-digit pp Cloud-margin headwind for 2026.'] },
    ]},
  { theme:'Other Bets: pruning + Waymo\'s ramp', st:'trend',
    why:'A portfolio quietly rationalized around Waymo, whose weekly rides double roughly every two quarters.',
    updates:[
      { q:'Q4 2024', items:['150K trips/week; Austin/Atlanta via Uber; Tokyo road trip; 6th-gen driver cuts hardware cost.'] },
      { q:'Q1 2025', items:['<b>250K paid rides/week (5x YoY)</b>; first Waymo business-model question ever on a call — "optionality" (Uber partnership, Moove fleet ops, OEMs, personal ownership).'] },
      { q:'Q2 2025', items:['100M+ fully-autonomous miles; Atlanta launch; teen accounts.'] },
      { q:'Q3 2025', items:['London (2026) + Tokyo announced; Dallas/Nashville/Denver/Seattle; airports + freeways.'] },
      { q:'Q4 2025', items:['<b>$16B round — largest ever</b> (Alphabet funded a significant portion → $2.1B SBC charge); 20M trips; 400K rides/week.'] },
      { q:'Q1 2026', items:['<b>500K rides/week (2x in <1yr)</b>; 11 US cities · <b>Verily deconsolidated</b>; GFiber→Astound (deconsolidates Q4) — the pruning is explicit.'] },
    ]},
  { theme:'Quiet decliners & headline distorters', st:'watch',
    why:'The lines nobody asks about, and the one-offs that distort a print — read every headline through these.',
    updates:[
      { q:'Q3 2025', items:['<b>EC fine $3.5B</b> (G&A) — op margin 30.5% reported vs 33.9% ex-fine. Network −3% (structurally negative every quarter).'] },
      { q:'Q4 2025', items:['<b>Waymo $2.1B SBC charge</b> (R&D) — op income +16% reported, cleaner underlying +~22%. YouTube +9% on election lapping. Network −2%.'] },
      { q:'Q1 2026', items:['<b>Other income $37.7B</b> (unrealized gains) → EPS $5.11 "+82%" — optics, not operations · <b>FX +3pp tailwind to Services</b>, fading to ~1pp in Q2 (management volunteered the caveat) · Network −4%.'] },
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
  h+='<p class="ov-lede">The key narrative threads from <b>10 earnings calls</b> (Q4 2023 → Q1 2026). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered in a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b>. Tap any row to expand.</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  h+='<div class="lpb-acc" id="googlCallsTheme">';
  GOOGL_THEMES.forEach(function(ct){
    var st=CP_THST[ct.st]||CP_THST.watch;
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+'</span></span><span class="lpb-acc-ic">+</span></button>';
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
      '<div class="ovt-subpane" data-ovst="segments">'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="customers" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="tam" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="industry" hidden>'+gddEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="unit">Unit Economics</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="unit">'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="margins" hidden>'+gddEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="callprep">Call Prep</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="earnings">Earnings Calls</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="callprep">'+
        '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer, in three phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (react to the numbers, which land before the call) → <b>③ Post-Call</b> (what management said + the meeting take). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Alphabet.</div>'+
        cpQPills()+
        '<div class="cp-phtabs">'+
          '<button type="button" class="cp-phtab active" data-cpp="setup">Setup</button>'+
          '<button type="button" class="cp-phtab" data-cpp="watch">Watch List</button>'+
          '<button type="button" class="cp-phtab" data-cpp="results">Post-Results</button>'+
          '<button type="button" class="cp-phtab" data-cpp="postcall">Post-Call</button>'+
        '</div>'+
        '<div class="cp-phpane" data-cpp="setup">'+cpSetupBody(c)+'</div>'+
        '<div class="cp-phpane" data-cpp="watch" hidden>'+cpWatchBody(c)+'</div>'+
        '<div class="cp-phpane" data-cpp="results" hidden>'+cpResultsBody(c)+'</div>'+
        '<div class="cp-phpane" data-cpp="postcall" hidden>'+cpCallBody(c)+'</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings" hidden>'+callsBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+gddEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="sensitivity">Sensitivity</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="capital">Capital Allocation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="financials">Financials</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="sensitivity">'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="capital" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="financials" hidden>'+gddEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+gddEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+gddEmpty()+'</div>'+
    '</div>';
  h+='</div>';
  return h;
}

// ═══ Sub-tab + Deep Dive tab machinery (standardized contract) ══════════════════════════════════
function buildSub(root, group, key){ /* no charts yet — Deep Dive sections build here as they fill */ }
function activeSubKey(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null;
  var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null;
}
function showSub(root, pane, group, key){
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
  pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
// Call Prep phase tabs — nested inside Evolution's callprep subpane, wired independently.
function wireCallPrep(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="callprep"]'); if(!pane) return;
  pane.querySelectorAll('.cp-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cpp');
    pane.querySelectorAll('.cp-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cpp')!==key); });
  }; });
  // Setup estimates toggle: Consensus ⇄ Summit ⇄ Both (CSS-driven via data-ev on the wrap)
  pane.querySelectorAll('.cp-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cpev');
    pane.querySelectorAll('.cp-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  // Quarter selector: one Call Prep, many quarters — only the selected quarter's blocks render.
  // Picking a quarter also exits the cross-quarter tag view.
  pane.querySelectorAll('.cp-qpill').forEach(function(btn){ btn.onclick=function(){
    var qk=btn.getAttribute('data-cpqsel');
    pane.querySelectorAll('.cp-qpill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-cpq')!==qk); });
    pane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); });
    var flat=pane.querySelector('.cp-wl-all'); if(flat) flat.hidden=true;
  }; });
  // ── Watch List: theme-tag filter (cross-quarter) + add-theme (session-only) ──
  var wpane=pane.querySelector('.cp-phpane[data-cpp="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.cp-wl-all');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.cp-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function applyTags(){
      var tags=activeTags();
      var on=tags.length>0;
      wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ if(on) blk.hidden=true; });
      if(!on){
        var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):null;
        wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-cpq')!==qk); });
      }
      if(flat){ flat.hidden=!on;
        if(on) flat.querySelectorAll('.cp-w').forEach(function(card){
          var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
          var hit=tags.some(function(t){ return ct.indexOf(t)>=0; });
          if(hit) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
        });
      }
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('cp-wl-clear')){ wpane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyTags();
    }; }
    wpane.querySelectorAll('.cp-wl-tag').forEach(wireTag);
    // Add-theme: toggle the form; on submit, append a card (same format) to the ACTIVE quarter's
    // list AND the cross-quarter view. Session-only until committed into CALL_PREP.
    var addBtn=wpane.querySelector('.cp-wl-add-btn'), form=wpane.querySelector('.cp-wl-addform');
    if(addBtn&&form){ addBtn.onclick=function(){ form.hidden=!form.hidden; }; }
    var go=wpane.querySelector('.cp-wl-add-go');
    if(go&&form){ go.onclick=function(){
      function val(k){ var el=form.querySelector('[data-wlf="'+k+'"]'); return el?el.value.trim():''; }
      var metric=val('metric'); if(!metric) return;
      var tags=val('tags').split(',').map(function(t){ return t.trim().toLowerCase().replace(/\s+/g,'-'); }).filter(Boolean);
      var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):cpQkey(CALL_PREP.quarters[0].q);
      var qLbl=act?act.textContent.replace(/upcoming/i,'').trim():CALL_PREP.quarters[0].q;
      var w={ rank:'+', metric:metric, tags:tags, pista:val('pista')||null, breaks:val('breaks')||null, since:qLbl };
      var target=wpane.querySelector('.cp-qblock[data-cpq="'+qk+'"] .cp-watch');
      if(target) target.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-add'+Date.now()%100000, null));
      var flatList=flat?flat.querySelector('.cp-watch'):null;
      if(flatList) flatList.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-addf'+Date.now()%100000, qLbl));
      // register any new tags in the bar
      tags.forEach(function(t){
        if(!wpane.querySelector('.cp-wl-tag[data-wltag="'+t+'"]')){
          var b=document.createElement('button'); b.type='button'; b.className='cp-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
          var clear=wpane.querySelector('.cp-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
        }
      });
      form.querySelectorAll('.cp-wl-in').forEach(function(i){ i.value=''; }); form.hidden=true;
      applyTags();
    }; }
  }
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
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
    if(kind==='cp'){ return CP_POP[id]||null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

// ═══ init / deepDiveInit ════════════════════════════════════════════════════════════════════════
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireCallPrep(root);
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
