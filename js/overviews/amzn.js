// overviews/amzn.js — standardized Overview for Amazon.com, Inc. (NASDAQ: AMZN)
// Follows docs/OVERVIEW_CONVENTIONS.md and mirrors the standardized profile contract
// (googl.js / ibkr.js / uber.js): a hooked Overview (Key Facts + lede + 2x2 quad +
// collapsibles) and a 5-tab Deep Dive spine as a STAGED SCAFFOLD (per conventions §6,
// Deep Dive content for a new company is not auto-filled — sections fill later by hand).
//
// STATUS: Overview filled; Deep Dive is an empty staged scaffold.
//
// Sources: Amazon FY2025 Form 10-K (SEC EDGAR, filed Feb 2026) for all FY2025 figures
// (segments, product-line disaggregation, geography, headcount); company IR / press
// releases for qualitative content and history; Summit DCF model (snapshot 2026-05-13)
// cross-checked for segment revenue. Live market cap via api.liveQuote (Massive). Peer
// multiples are seeded approximations (mid-2026), labeled — never presented as live.

import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: Amazon orange + Amazon blue ─────────────────────────────────────────────────────
var BRAND='#FF9900', BRAND2='#146EB4', SQUID='#232F3E', GREEN='#2E8B57', GRAY='#9AA4B0';

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═════════════════════════════════════════════════════════════════════════════════════════════
// DATA — Overview
// ═════════════════════════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5×2), canonical set. Filer status verified on EDGAR
// (CIK 1018724 files 10-K/10-Q/8-K — domestic).
var STD_FACTS=[
  ['Listing','NASDAQ: AMZN'],
  ['HQ','Seattle, WA, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1994 (Jeff Bezos)'],
  ['IPO','May 1997 · NASDAQ'],
  ['CEO','Andy Jassy · joined 1997 · CEO since Jul 2021'],
  ['Employees','~1,576,000 · Dec 2025'],
  ['Dividend','Non-payer · never paid one'],
  ['Market cap','live'],
];

var AMZN_LEDE='Amazon started in 1994 as an online bookstore and grew into one of the largest companies on earth by revenue, spanning e-commerce, logistics, cloud computing, advertising, media and devices. It serves consumers, third-party sellers, enterprises, developers and advertisers, and runs one of the world\'s largest physical infrastructures — fulfillment centers, a delivery fleet and data centers — which it monetizes both for itself and as a service to others.';

// 2x2 quadrant (each cell ≤ ~30 words)
var STD_BIZ=[
  ['What it sells','The everything store (first-party retail + a marketplace with fulfillment for others), on-demand cloud computing (AWS), advertising on shopping intent, and Prime subscriptions.'],
  ['Who buys it','Consumers (retail, Prime); millions of third-party sellers; enterprises, startups & developers (AWS); advertisers buying placement in front of shoppers.'],
  ['How it earns','FY2025: ~38% online stores · ~24% seller services · ~18% AWS · ~10% ads · ~7% subscriptions — but AWS earns ~57% of operating income.'],
  ['The edge','The Prime + fulfillment flywheel (scale nobody can replicate), AWS\'s switching costs and scale economics, and first-party shopping data powering the ad business.'],
];

// How it makes money — FY2025 per the 10-K. Two views of the SAME total (they must and do
// reconcile): segments and geography.
var GMM_SEG=[
  ['North America', 59.5, '$426.3B', '59%', BRAND],
  ['International', 22.6, '$161.9B', '23%', BRAND2],
  ['AWS', 18.0, '$128.7B', '18%', SQUID],
];
var GMM_GEO=[
  ['United States', 68.3, '$489.7B', '68%', BRAND],
  ['Rest of world', 15.0, '$107.5B', '15%', GRAY],
  ['Germany', 6.4, '$45.9B', '6%', BRAND2],
  ['United Kingdom', 6.0, '$43.2B', '6%', SQUID],
  ['Japan', 4.3, '$30.7B', '4%', GREEN],
];
var REV_DEFS=[
  { seg:'North America (the core store)',
    desc:'The US/Canada/Mexico consumer business: <b>first-party online retail</b> (Amazon sells inventory it owns), the <b>third-party marketplace</b> (independent sellers list products; Amazon takes commissions and sells fulfillment/shipping via FBA), <b>advertising</b> sold against shopping queries, <b>Prime subscriptions</b> and <b>physical stores</b> (Whole Foods, Amazon Fresh & Go). Retail margins are thin — the segment\'s economics improve as higher-margin seller services, ads and subscriptions grow inside it.',
    econ:[['FY2025 net sales','$426.3B (+10%)'],['Operating income','$29.6B · 6.9% margin'],['One-off inside it','the $2.5B FTC settlement charge hit this segment in 3Q25']] },
  { seg:'International (same model, earlier curve)',
    desc:'The consumer business outside North America — established markets (Germany, UK, Japan) plus expansion markets (India, Brazil, Middle East). Same earning model as North America: first-party retail, marketplace commissions and FBA, ads and Prime. Ran at a loss for years while building density; now profitable as established markets mature.',
    econ:[['FY2025 net sales','$161.9B (+13%)'],['Operating income','$4.8B · 2.9% margin'],['Inflection','turned durably profitable in 2024 after years of build-out losses']] },
  { seg:'AWS (most of the profit)',
    desc:'Amazon Web Services — the on-demand cloud: compute, storage, databases, networking and, increasingly, <b>AI infrastructure</b> (Trainium chips, Bedrock model platform, SageMaker). Customers pay for consumption plus committed contracts. Invented the cloud category in 2006 and still leads it; carries far higher margins than retail and contributes the majority of Amazon\'s operating income.',
    econ:[['FY2025 net sales','$128.7B (+20%)'],['Operating income','$45.6B · 35.4% margin'],['Share of company op income','~57%, on 18% of revenue']] },
  { seg:'The revenue lines (what the money is paid for)',
    desc:'The 10-K also cuts the same total by <b>type of revenue</b>, across all three segments — the clearest view of the mix shift: retail lines grow single-digit while <b>advertising (+22%)</b> and <b>AWS (+20%)</b> — the high-margin lines — compound much faster.',
    econ:[['Online stores','$269.3B · 38% (+9%)'],['Third-party seller services','$172.2B · 24% (+10%)'],['AWS','$128.7B · 18% (+20%)'],['Advertising services','$68.6B · 10% (+22%)'],['Subscription services','$49.6B · 7% (+12%)'],['Physical stores','$22.6B · 3% (+6%)'],['Other','$5.9B · 1%']],
    econNote:'10-K revenue disaggregation (Note 10). Shares of FY2025 total net sales of $716.9B; growth vs FY2024.' },
];

// Products — two tiers: family card → pop-up with the specific products (key = prod:i).
var A_PRODUCTS=[
  { ic:'🛒', fam:'Retail & marketplace', d:'The everything store, 1P + 3P.', items:[
    ['Amazon.com (first-party retail)','Amazon buys and resells inventory across essentially every category — the original business.'],
    ['Third-party Marketplace','Independent sellers list on the same shelf; Amazon earns commissions (~15%) without owning the inventory. Over 60% of units sold.'],
    ['Fulfillment by Amazon (FBA)','Sellers pay Amazon to store, pack and deliver their products — renting the logistics machine.'],
    ['Physical stores','Whole Foods Market, Amazon Fresh and Go — the grocery/offline foothold.'] ]},
  { ic:'☁️', fam:'AWS', d:'The cloud, invented here.', items:[
    ['EC2 & S3','The foundational products: rented compute and object storage — the backbone of much of the internet.'],
    ['Databases & analytics','Aurora, DynamoDB, Redshift — where enterprise workloads live and stick.'],
    ['Bedrock & SageMaker','The AI platform: run foundation models (Anthropic\'s Claude among them) and build/train custom ones.'],
    ['Trainium & custom silicon','Amazon-designed AI chips — the capex-heavy bet to control AI economics rather than pay NVIDIA for every unit.'] ]},
  { ic:'📦', fam:'Prime & subscriptions', d:'The flywheel\'s engine.', items:[
    ['Prime','Fast free shipping + video + music + more for an annual fee — the loyalty program that anchors the whole retail flywheel.'],
    ['Prime Video','Streaming with originals, live sports (NFL, NBA) and — since 2024 — its own ad tier.'],
    ['Music, Kindle Unlimited, Audible','The long tail of content subscriptions.'] ]},
  { ic:'📢', fam:'Advertising', d:'The third profit engine.', items:[
    ['Sponsored products & brands','Search placement on Amazon.com — ads shown at the moment of purchase intent, the most valuable real estate in e-commerce.'],
    ['Amazon DSP','Programmatic buying of Amazon\'s audiences on and off the store.'],
    ['Prime Video ads','The newest inventory: the default ad-supported tier turned Prime Video into a major ad surface.'] ]},
  { ic:'🔊', fam:'Devices & Alexa', d:'The in-home footprint.', items:[
    ['Echo & Alexa+','Smart speakers/screens; Alexa+ (2025) is the generative-AI rebuild of the assistant.'],
    ['Fire TV & tablets','Living-room and budget-tablet distribution for Amazon\'s content and store.'],
    ['Kindle','The e-reader that started the devices line.'],
    ['Ring & Blink','Home security cameras and doorbells.'] ]},
  { ic:'🚚', fam:'Logistics as a service', d:'Renting out the machine.', items:[
    ['Amazon Logistics','Its own last-mile delivery network — larger than most national carriers.'],
    ['Buy with Prime','Prime checkout + fulfillment for merchants\' OWN websites — pointing the logistics machine outward.'],
    ['Supply Chain by Amazon','End-to-end freight, customs and warehousing for sellers.'] ]},
  { ic:'🧪', fam:'Emerging bets', d:'Space, robotaxis, health, AI.', items:[
    ['Amazon Leo','Low-Earth-orbit broadband satellites (renamed from Project Kuiper, Nov 2025) — 375+ in orbit, service ramping through 2026.'],
    ['Zoox','The robotaxi subsidiary (acquired 2020) — driverless rides launched in Las Vegas, expanding city by city.'],
    ['Health','One Medical primary care + Amazon Pharmacy — the healthcare push.'],
    ['Anthropic stake','$8B invested 2023–24, expanded Apr 2026 ($5B more + rights to another $20B); Anthropic committed over $100B of AWS spend in return.'] ]},
];

// Timeline — corporate lineage per the conventions rubric (genesis, business-model inflections,
// material M&A, ≤1 defining legal matter, latest $T milestone only). Depth in Read Mores (hist:i).
var TIMELINE=[
  { y:'1994–97', t:'<b>Genesis:</b> Jeff Bezos founds Amazon in a Seattle garage as an online bookstore → <b>IPO May 1997</b> (NASDAQ).',
    d:'<ul class="ov-bullets"><li>1994 — Bezos quits hedge fund D. E. Shaw, drives to Seattle, incorporates <b>Cadabra, Inc.</b> — quickly renamed <b>Amazon</b>.</li><li>Jul 1995 — Amazon.com opens selling books ("Earth\'s biggest bookstore"): a category chosen for infinite shelf space online.</li><li>May 1997 — <b>IPO on NASDAQ at $18/share</b> (~$438M market cap). Organically the same company today — no spin-off, SPAC or reverse merger in the lineage.</li><li>The famous early mantra: "Get Big Fast" — losses for years, deliberately, to build scale first.</li></ul>' },
  { y:'2000', t:'<b>Business-model inflection #1:</b> the <b>third-party Marketplace</b> opens — from retailer to platform.',
    d:'<ul class="ov-bullets"><li>2000 — Amazon lets independent sellers list on the same product pages it sells from — competing with itself on its own shelf.</li><li>The model shift: from owning all inventory (retailer) to also taking a <b>commission on other people\'s sales</b> (platform).</li><li>2006 — <b>Fulfillment by Amazon</b> extends it: sellers rent Amazon\'s warehouses and delivery. Today over 60% of units sold are third-party.</li></ul>' },
  { y:'2005', t:'<b>Prime launches</b> ($79/yr, free 2-day shipping) — the loyalty flywheel that powers the retail business.' },
  { y:'2006', t:'<b>Business-model inflection #2: AWS launches</b> (S3, then EC2) — the retailer becomes an infrastructure company.',
    d:'<ul class="ov-bullets"><li>2006 — Amazon Web Services launches S3 (storage) and EC2 (rented compute), effectively <b>inventing the public-cloud category</b>.</li><li>Built as a deliberate externalization of Amazon\'s internal infrastructure discipline — sold on-demand, by the hour.</li><li>It compounds quietly for a decade; first disclosed as a segment in 2015, shocking the market with its size and margins.</li><li>Today AWS is ~18% of revenue but the <b>majority of operating income</b> — the profit engine that funds everything else.</li></ul>' },
  { y:'2017', t:'<b>Whole Foods acquired ($13.7B)</b> — the largest deal in company history; Amazon goes physical.',
    d:'<ul class="ov-bullets"><li>Jun 2017 — Amazon buys Whole Foods Market (a listed company) for <b>$13.7B cash</b>, its biggest acquisition ever.</li><li>The move put Amazon inside grocery — the biggest consumer-spend category it hadn\'t cracked — and gave Prime a physical touchpoint.</li></ul>' },
  { y:'~2018', t:'<b>Business-model inflection #3: advertising becomes material</b> — a third profit engine emerges from the store\'s search bar.',
    d:'<ul class="ov-bullets"><li>Sponsored placement in Amazon search results scales from an experiment into one of the world\'s largest ad businesses — <b>$68.6B (+22%) by FY2025</b>.</li><li>Structurally precious: ads shown at the moment of purchase intent, priced on first-party data nobody else has.</li><li>With AWS, it transformed Amazon\'s economics — two high-margin businesses now sit on top of thin-margin retail.</li></ul>' },
  { y:'Jul 2021', t:'<b>Bezos steps down</b> — AWS chief <b>Andy Jassy becomes CEO</b>; Bezos stays Executive Chairman.',
    d:'<ul class="ov-bullets"><li>Jassy joined Amazon in 1997 and <b>built AWS from a memo into the profit engine</b> — the succession chose the cloud, not the store.</li><li>Bezos remains Executive Chairman and the largest individual shareholder (~9%).</li><li>Jassy\'s era so far: a post-pandemic cost reset (the largest layoffs in company history, 2022–23), then the AI capex supercycle.</li></ul>' },
  { y:'2022', t:'<b>MGM acquired ($8.5B)</b> — a century of film/TV IP folded into Prime Video.' },
  { y:'2023–25', t:'<b>The defining legal matter: FTC v. Amazon</b> — the monopoly suit (2023, ongoing) and a <b>$2.5B Prime settlement</b> (2025).',
    d:'<ul class="ov-bullets"><li>Sep 2023 — the FTC and 17 states sue Amazon for <b>illegally maintaining monopoly power</b> in online retail (seller fees, anti-discounting, Prime bundling). Trial is on its own multi-year track.</li><li>Sep 2025 — separately, Amazon pays <b>$2.5B ($1.0B penalty + $1.5B customer refunds)</b> — the largest civil penalty for an FTC rule violation — to settle claims it enrolled customers in Prime through "dark patterns" and made canceling hard. Settled on day 4 of trial; the charge hit the North America segment in 3Q25.</li><li>Why it matters: the monopoly case attacks the marketplace/Prime flywheel itself — the structural risk to watch.</li></ul>' },
  { y:'2023–26', t:'<b>The AI era:</b> $8B — and counting — into <b>Anthropic</b>, Bedrock + Trainium ship, and capex explodes toward AI capacity.',
    d:'<ul class="ov-bullets"><li>2023–24 — Amazon invests <b>$8B in Anthropic</b> (maker of Claude), expanded in <b>Apr 2026 with $5B more plus rights for up to another $20B</b>; Anthropic committed over $100B of AWS spend over 10 years — the counter to Microsoft/OpenAI.</li><li>Bedrock (rent any foundation model on AWS) and <b>Trainium</b> chips became the AI platform bet: own the infrastructure layer of AI, not the chatbot.</li><li>Capex went from <b>~$53B (2023) to ~$132B (2025)</b> and is still climbing in 2026 — the largest infrastructure build-out in the company\'s history, and the central investor debate.</li><li>1Q26 — the Anthropic stake\'s markup added ~$16.8B of pre-tax gains in a single quarter, showing its scale.</li></ul>' },
  { y:'Jun 2024', t:'Crosses <b>$2 trillion</b> in market cap — the latest trillion-dollar milestone (it has approached, but not crossed, $3T in 2026).' },
];

// ─── Peers scatter — retail + cloud hybrids. Toggles: metric (P/E ⇄ EV/EBITDA — never P/S) ×
// basis (Forward ⇄ Trailing, default Forward). Bubble = LIVE market cap (Massive). Multiples/
// growth are seeded approximations (Jul 2026), labeled — replaced by live values when confirmed.
// Seeds from stockanalysis.com (Jul 2026). Forward EV/EBITDA is not published there — the evF
// values are DERIVED approximations (trailing EV/EBITDA deflated by consensus revenue growth),
// labeled as such in the caption. Fiscal years differ (WMT Jan, COST Aug, MSFT Jun, BABA Mar).
var A_PEERS=[
  { tk:'AMZN', n:'Amazon', peT:27.8, peF:27.8, evT:16.6, evF:14.5, gt:12.4, gf:14.8, mc:2500, hl:true,
    why:'The everything store plus the cloud leader. Cheaper than the pure retailers on earnings, cheaper than it looks on EV/EBITDA — the mix keeps shifting toward AWS and ads.' },
  { tk:'WMT', n:'Walmart', peT:38.5, peF:36.7, evT:21.2, evF:20, gt:4.7, gf:5.5, mc:887,
    why:'The offline giant gone omnichannel — much slower growth, yet priced at a premium to Amazon on earnings as the market pays up for its ads/membership mix shift.' },
  { tk:'COST', n:'Costco', peT:47, peF:42.7, evT:29.7, evF:27, gt:8.2, gf:9.5, mc:422,
    why:'The membership-warehouse compounder — steady single-digit growth at one of the richest multiples in retail.' },
  { tk:'GOOGL', n:'Alphabet', peT:16, peF:24.1, evT:22.4, evF:18, gt:15.1, gf:23.6, mc:4000,
    why:'Cloud rival #3 and the other ads giant. Its trailing P/E (~16) is depressed by one-off investment gains inflating GAAP EPS — read the forward number.' },
  { tk:'MSFT', n:'Microsoft', peT:22.7, peF:20.6, evT:15, evF:13, gt:14.9, gf:17, mc:2920,
    why:'Azure — AWS\'s closest rival — on top of the enterprise-software franchise. A similar growth profile at a comparable multiple.' },
  { tk:'BABA', n:'Alibaba', peT:17.6, peF:17.1, evT:17.5, evF:16, gt:2.7, gf:9.9, mc:261,
    why:'China\'s Amazon analogue (e-commerce + cloud). The discount reflects geopolitics and a slower core — the cheapest name on the map.' },
  { tk:'MELI', n:'MercadoLibre', peT:47.6, peF:44.9, evT:25.3, evF:18, gt:39.1, gf:40.9, mc:93,
    why:'Latin America\'s Amazon and PayPal in one — the growth outlier on the map, priced accordingly.' },
];

var A_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };
function aScReset(){ if(!A_SC.peers) A_SC.peers=A_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function aScMult(p){ var key=(A_SC.metric==='pe'?'pe':'ev')+(A_SC.basis==='f'?'F':'T'); return p[key]; }
function aScMax(){ return A_SC.metric==='pe'?45:30; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.asc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.asc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.asc-chip .x{color:var(--mu);font-weight:800}'+
    '.asc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.asc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.asc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#FFB84D}</style>';
  h+='<div class="amzn-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="amzn-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="amzn-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="amzn-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips amzn-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here — private retail rivals (SHEIN, Temu\'s parent PDD is listed but Temu itself is a unit) and private AI/cloud players have no market multiple. <span class="ave-subh-note">Multiples & growth are seeded approximations (Jul 2026; forward EV/EBITDA is derived, not quoted); market caps are live.</span></div>';
  h+='<div class="mg-tip amzn-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function aScRenderOne(wrap){
  var g=wrap.querySelector('.amzn-sc-nodes'); if(!g||!A_SC.peers) return;
  var maxMult=aScMax(), X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.amzn-sc-xlab'); if(lab) lab.textContent=(A_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(A_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===A_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===A_SC.metric); });
  var frag='';
  A_SC.peers.forEach(function(p){
    if(!p.on) return; var m=aScMult(p); if(m==null||isNaN(m)) return;
    var growth=A_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/25))*(Y0-Y1);
    var r=Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32));
    var logo=scLogoUrl(p);
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#C7761A':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function aScChipsOne(wrap){
  var box=wrap.querySelector('.amzn-sc-chips'); if(!box||!A_SC.peers) return;
  var h=A_SC.peers.map(function(p,i){ return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="amzn-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="amzn-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function aScRenderAll(root){ root.querySelectorAll('.amzn-sc').forEach(aScRenderOne); }
function aScChipsAll(root){ root.querySelectorAll('.amzn-sc').forEach(function(w){ aScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  aScReset();
  root.querySelectorAll('.amzn-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var g=wrap.querySelector('.amzn-sc-nodes'), tip=wrap.querySelector('.amzn-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ A_SC.basis=btn.getAttribute('data-mgbasis'); aScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ A_SC.metric=btn.getAttribute('data-mgmetric'); aScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.amzn-sc-svg');
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
  aScRenderAll(root); aScChipsAll(root); aScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.amzn-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(A_SC.peers[i]){ A_SC.peers.splice(i,1); aScRenderAll(root); aScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.amzn-sc-addbtn'), addIn=wrap.querySelector('.amzn-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!A_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=A_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; A_SC.peers.push(o); }
      else A_SC.peers.push({ tk:tk, n:tk, on:true, mc:100, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
    }
    addIn.value=''; aScRenderAll(root); aScChipsAll(root); aLiveOne(root, tk); }; }
}
// Live market cap (Key Facts cell + peer bubbles) via Massive (api.liveQuote). Degrades gracefully.
function aLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; A_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='AMZN'){ var el=root.querySelector('#amznMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } aScRenderAll(root); }).catch(function(){}); }
function aScFetchCaps(root){ if(A_SC._capsFetched||!A_SC.peers) return; A_SC._capsFetched=true; A_SC.peers.forEach(function(p){ if(p.tk) aLiveOne(root, p.tk); }); }

function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ═══ Standardized Overview body ═══════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="amznMc">'+esc(p[1])+'</span>'; }
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
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">FY2025 net sales <b>$716.9B (+12%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b>. Both reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row" style="display:flex;gap:14px;margin:2px 0 8px"><span class="mg-tog" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)">View: <span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px"><button type="button" class="mg-pill active" data-gmm="seg" style="border:none;background:var(--navy);color:#fff;font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Segments</button><button type="button" class="mg-pill" data-gmm="geo" style="border:none;background:transparent;color:var(--mu);font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note" style="margin-top:6px">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025: operating income <b>$80.0B (11.2% margin)</b> · net income <b>$77.7B</b>. AWS contributes <b>~57% of operating income on 18% of revenue</b> — the profit engine under the store. <span class="ave-subh-note">Source: Amazon FY2025 Form 10-K (Note 10). The revenue-line split is company-wide, not per segment.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+A_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
var OV_SOURCES='Sources — Amazon FY2025 Form 10-K (SEC EDGAR) for all FY2025 revenue, segment, geographic, product-line and headcount figures; Amazon IR / press releases for qualitative content and history; SEC filing history for filer status; Summit DCF model (snapshot 2026-05-13) cross-checked for segment revenue. Market cap and peer bubbles are live (Massive); peer multiples & growth are seeded approximations (Jul 2026), directional. Forward figures are estimates, not company guidance.';
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
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';margin-bottom:5px}'+
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
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND2+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+BRAND2+';border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.add-empty{border:1px dashed var(--bdr);border-radius:12px;padding:34px 20px;text-align:center;color:var(--mu);font-size:12.5px;background:var(--w)}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '</style>';
  // The hook — always visible: Key Facts, description, 2x2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+AMZN_LEDE+'</p>';
  h+=stdFourQuad();
  // Everything below the hook defaults collapsed (progressive disclosure).
  h+=collapsible('How Amazon makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Amazon', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// ═════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — staged scaffold (per conventions §6: content for a new company is NOT auto-filled;
// Summit fills sections by hand later). Same 5-tab spine as googl.js/ibkr.js. Evolution carries
// the standard sub-tab row (Call Prep · Guidance · Strategy · Timeline); the Call Prep pane is
// staged for "arma el Call Prep de AMZN", with the RESULTS phase live today — the multi-quarter
// actuals-vs-Summit/consensus/guidance track record (js/results.js engine, per SAB's direction).
// ═════════════════════════════════════════════════════════════════════════════════════════════
function addEmpty(){ return '<div class="add-empty">🚧 In progress — this section is being built.</div>'; }

// Call Prep source buttons (CALL_PREP_CONVENTIONS §6 — mandatory first element, IR + EDGAR).
var CP_IR_URL='https://ir.aboutamazon.com/';
var CP_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1018724&owner=exclude';
var CP_LOGO_URL='https://assets.parqet.com/logos/symbol/AMZN';
var CP_SEC_SEAL='img/sec-seal.png';
function cpIRButton(){
  return '<style>'+
    '.cp-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.cp-srcrow{grid-template-columns:1fr}}'+
    '.cp-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#0B0703 0%,#1C1206 60%,#0B0703 100%);border:1px solid rgba(255,153,0,.32);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.cp-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BRAND2+');height:4px;top:0}'+
    '.cp-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(255,153,0,.35);border-color:rgba(255,153,0,.75)}'+
    '.cp-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.cp-ir-ic{width:72px;height:72px;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(255,184,77,.3),0 0 32px rgba(255,153,0,.5)}'+
    '.cp-ir-ic img{width:52px;height:52px;object-fit:contain;display:block;border-radius:10px;filter:drop-shadow(0 2px 10px rgba(0,0,0,.55))}'+
    '.cp-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.cp-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#FFB84D;display:flex;align-items:center;gap:7px}'+
    '.cp-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND+';box-shadow:0 0 0 0 rgba(255,153,0,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(255,153,0,.6)}70%{box-shadow:0 0 0 8px rgba(255,153,0,0)}100%{box-shadow:0 0 0 0 rgba(255,153,0,0)}}'+
    '.cp-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.cp-ir-s{font-size:11.5px;color:#C8B49A;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#1A1305;background:linear-gradient(135deg,#FFB84D,'+BRAND+');border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{gap:12px;box-shadow:0 4px 18px rgba(255,153,0,.55)}'+
    '@media(max-width:560px){.cp-ir{flex-wrap:wrap}.cp-ir-go{width:100%;justify-content:center}}'+
    '.cp-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cp-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.cp-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.cp-ir.edgar .cp-ir-ic{box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.cp-ir.edgar .cp-ir-ic img{width:72px;height:72px;border-radius:0}'+
    '.cp-ir.edgar .cp-ir-k{color:#E3C878}'+
    '.cp-ir.edgar .cp-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.cp-ir.edgar .cp-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.cp-ir.edgar:hover .cp-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.cp-ir.edgar .cp-ir-wm{opacity:.1}'+
    '.cp-ir.edgar:hover .cp-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="cp-srcrow">'+
  '<a class="cp-ir" href="'+CP_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_LOGO_URL+'" alt="Amazon logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="cp-ir-t" style="display:block">Amazon Investor Relations</span>'+
      '<span class="cp-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from ir.aboutamazon.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CP_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="cp-ir-t" style="display:block">Amazon on EDGAR</span>'+
      '<span class="cp-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}

// Call Prep pane — staged: the four call phases fill when the Call Prep is built ("arma el Call
// Prep de AMZN", per docs/CALL_PREP_CONVENTIONS.md); the Results phase is live today.
function cpPaneBody(c){
  var h='<style>'+
    '.cp-phtabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}'+
    '.cp-phtab{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:6px 14px;border-radius:999px;cursor:pointer}'+
    '.cp-phtab:hover{color:var(--navy);border-color:'+BRAND+'}'+
    '.cp-phtab.active{background:var(--navy);border-color:var(--navy);color:#fff}'+
    '.cp-phpane[hidden]{display:none}'+
    '.cp-note{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy)}'+
    '</style>';
  h+=cpIRButton();
  h+='<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer around each earnings print: <b>Setup</b> (go in ready) → <b>Watch List</b> (the hunting themes) → <b>Post-Results</b> (react to the numbers) → <b>Post-Call</b> (what management said). The four phases are staged and fill when Amazon\'s Call Prep is built. The multi-quarter beat/miss track record lives in the <b>Results</b> sub-tab beside this one.</div>';
  h+='<div class="cp-phtabs">'+
    '<button type="button" class="cp-phtab active" data-cpp="setup">Setup</button>'+
    '<button type="button" class="cp-phtab" data-cpp="watch">Watch List</button>'+
    '<button type="button" class="cp-phtab" data-cpp="results">Post-Results</button>'+
    '<button type="button" class="cp-phtab" data-cpp="postcall">Post-Call</button>'+
  '</div>';
  h+='<div class="cp-phpane" data-cpp="setup">'+addEmpty()+'</div>';
  h+='<div class="cp-phpane" data-cpp="watch" hidden>'+addEmpty()+'</div>';
  h+='<div class="cp-phpane" data-cpp="results" hidden>'+addEmpty()+'</div>';
  h+='<div class="cp-phpane" data-cpp="postcall" hidden>'+addEmpty()+'</div>';
  return h;
}

function html(c){
  var h='<div class="ov ov-amzn" data-brand="AMZN" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(255,153,0,0.10)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="amznModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="amznModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="amznModalT"></div><div class="ov-modal-b" id="amznModalB"></div></div></div>';
  h+='</div>';
  return h;
}
function deepDiveHtml(c){
  var h='<div class="ov ov-amzn ov-amzn-dd" data-brand="AMZN" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(255,153,0,0.10)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="topline">'+addEmpty()+'</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+addEmpty()+'</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="callprep">Call Prep</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="callprep">'+cpPaneBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('AMZN')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('AMZN')+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+addEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+addEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+addEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+addEmpty()+'</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+addEmpty()+'</div>';
  h+='</div>';
  return h;
}

// ═══ Wiring ═══════════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#amznModalBack'), mT=root.querySelector('#amznModalT'), mB=root.querySelector('#amznModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#amznModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=A_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
function wireDD(root){
  root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-amzn-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    if(key==='evolution') requestAnimationFrame(maybeInitResults);
  }; });
  // Evolution sub-tabs (Call Prep · Guidance · Strategy · Timeline) — pane-scoped.
  var evo=root.querySelector('.ov-amzn-dd .dd-pane[data-dd="evolution"]');
  if(evo){
    evo.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-ovst');
      evo.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      evo.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
      if(key==='results') requestAnimationFrame(maybeInitResults);
      if(key==='estevo') requestAnimationFrame(initResultsEvo);
    }; });
    // Call Prep phase tabs (Setup · Watch List · Post-Results · Post-Call — staged).
    evo.querySelectorAll('.cp-phtab').forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-cpp');
      evo.querySelectorAll('.cp-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      evo.querySelectorAll('.cp-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cpp')!==key); });
    }; });
  }
}
// The Results engine builds its chart lazily — only when its pane is actually visible.
function maybeInitResults(){ initResults(); }

function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Money-map accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Money-map view toggle (Segments ⇄ Geography)
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ var on=(b===btn); b.style.background=on?'var(--navy)':'transparent'; b.style.color=on?'#fff':'var(--mu)'; });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  // Peer scatter (Overview collapsible — builds fine on expand since it is pure SVG)
  wireScatters(root);
  // Live market cap (Key Facts cell) — also triggered per peer inside wireScatters
  aLiveOne(root, 'AMZN');
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  var detail=document.getElementById('co-detailview');
  if(detail){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='amznModalBack') m.remove(); });
    var md=root.querySelector('#amznModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root);
}

export var amznOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
