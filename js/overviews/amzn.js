// overviews/amzn.js — standardized Overview for Amazon.com, Inc. (NASDAQ: AMZN)
// Follows docs/OVERVIEW_CONVENTIONS.md and mirrors the standardized profile contract
// (googl.js / ibkr.js / uber.js): a hooked Overview (Key Facts + lede + 2x2 quad +
// collapsibles) and a 5-tab Deep Dive spine.
//
// STATUS: Overview filled. Deep Dive: Evolution carries the full Earnings v2.10 tab
// (docs/EARNINGS_CONVENTIONS.md — Q4 2025 / Q1 2026 / Q2 2026 reported end-to-end, Q3
// 2026 open in Setup + Watch List) + Results/Estimates (shared engine); Top Line ▸ Segments, Bottom
// Line ▸ Margins, Valuation ▸ Peers/Financials and Management ▸ Executives are default
// tabs built from the Results dataset (charts derive from it — no re-hardcoded numbers).
// Guidance / Strategy / Timeline remain staged.
//
// Sources: Amazon FY2025 Form 10-K (SEC EDGAR, filed Feb 2026) for all FY2025 figures
// (segments, product-line disaggregation, geography, headcount); company IR / press
// releases for qualitative content and history; Summit DCF model (snapshot 2026-05-13)
// cross-checked for segment revenue. Live market cap via api.liveQuote (Massive). Peer
// multiples are seeded approximations (mid-2026), labeled — never presented as live.

import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { mountWatchList } from '../watchlist.js';
import { amznResults } from '../results-data/amzn.js';
import { consensusEvo } from '../consensus-evolution.js';

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: Amazon orange + Amazon blue ─────────────────────────────────────────────────────
var BRAND='#FF9900', BRAND2='#146EB4', SQUID='#232F3E', GREEN='#2E8B57', GRAY='#9AA4B0';
var _co=null;   // open company (id + ticker), captured in html/deepDiveHtml for the shared Watch List engine

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

// Earnings source buttons (EARNINGS_CONVENTIONS §6 — mandatory first element, IR + EDGAR).
var CE_IR_URL='https://ir.aboutamazon.com/';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1018724&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/AMZN';
var CE_SEC_SEAL='img/sec-seal.png';
// Compact source chips — IR + EDGAR (EARNINGS_CONVENTIONS §6). The photo (logo/seal,
// transparent) + title + the open button only; kept small and parked at the right of the
// evolution tab bar. Full titles/blurbs (The Source · Earnings HQ / The Record · SEC, the
// release·webcast·slides and 10-K·10-Q lines) were intentionally dropped for the compact form.
function ceIRButton(){
  return '<style>'+
    '.cp-srcrow{display:flex;flex-direction:row;gap:10px;align-items:stretch;margin:0 0 12px}'+
    '@media(max-width:640px){.cp-srcrow{flex-direction:column}}'+
    '.cp-ir{display:inline-flex;align-items:center;gap:11px;text-decoration:none;border-radius:12px;padding:11px 17px 11px 11px;flex:1;min-width:0;box-sizing:border-box;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#0B0703 0%,#1C1206 60%,#0B0703 100%);border:1px solid rgba(255,153,0,.34);box-shadow:0 5px 16px rgba(0,0,0,.38);transition:.16s}'+
    '.cp-ir:hover{transform:translateY(-1px);box-shadow:0 9px 24px rgba(255,153,0,.32);border-color:rgba(255,153,0,.75)}'+
    '.cp-ir-wm{position:absolute;right:-16px;bottom:-20px;width:88px;height:88px;object-fit:contain;opacity:.13;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.2;transform:scale(1.05) rotate(-2deg)}'+
    '.cp-ir-ic{width:36px;height:36px;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(255,184,77,.3),0 0 18px rgba(255,153,0,.45)}'+
    '.cp-ir-ic img{width:26px;height:26px;object-fit:contain;display:block;border-radius:6px}'+
    '.cp-ir-k{font-size:12.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#FFB84D;white-space:nowrap;position:relative;z-index:1}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#FFB84D;flex:none;margin-left:auto;padding-left:6px;position:relative;z-index:1;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{transform:translateX(2px)}'+
    '.cp-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cp-ir.edgar:hover{box-shadow:0 9px 24px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.cp-ir.edgar .cp-ir-ic{box-shadow:0 0 0 1px rgba(227,200,120,.26),0 0 18px rgba(197,164,90,.45)}'+
    '.cp-ir.edgar .cp-ir-ic img{border-radius:0}'+
    '.cp-ir.edgar .cp-ir-k,.cp-ir.edgar .cp-ir-go{color:#E3C878}'+
    '.cp-ir.edgar .cp-ir-wm{opacity:.12}'+
    '.cp-ir.edgar:hover .cp-ir-wm{opacity:.19}'+
  '</style>'+
  '<div class="cp-srcrow">'+
  '<a class="cp-ir" href="'+CE_IR_URL+'" target="_blank" rel="noopener" title="Amazon Investor Relations">'+
    '<img class="cp-ir-wm" src="'+CE_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Amazon logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-k">Investor Relations</span>'+
    '<span class="cp-ir-go">↗</span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener" title="Amazon on SEC EDGAR">'+
    '<img class="cp-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-k">EDGAR</span>'+
    '<span class="cp-ir-go">↗</span>'+
  '</a>'+
  '</div>';
}

// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ EARNINGS — the decision layer (docs/EARNINGS_CONVENTIONS.md v2.10)
//  Fresh build on the 2Q26 cycle (machinery ported from googl.js via meta.js —
//  the v2.10 canonical). Three phases: Setup · Watch List · Post-Results; the
//  Watch List is the SHARED engine (js/watchlist.js, v3.0) — persistent in Supabase
//  (table company_themes, scoped by company_id) with sorting + the delete rule; the
//  theme record is folded in below the mount.
//  CONSENSUS: AMZN has no rows in the BBG_CONSENSUS.txt archive (GOOGL/META
//  only) — CE_CONS is DERIVED at load from js/results-data/amzn.js, whose cons
//  is the pre-print Street number (Refinitiv/LSEG via earnings-day coverage;
//  BBG export for forward quarters) — so only the 1q-out horizon exists and the
//  4q/3q/2q columns stay null. When Dani adds AMZN to the archive, rebuild the
//  qr matrix from it (the META parser in the session scratchpad is the recipe).
// ════════════════════════════════════════════════════════════════════════════
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F';

// CE_CONS — BUILT FROM THE ARCHIVE (BBG_CONSENSUS.txt, `data_as_of` snapshots), GOOGL-style: each
// metric carries its rolling revision matrix qr=[4q,3q,2q,1q-out] + actuals (qa) + YoY/QoQ bases
// (qy/qq). 9 headline + 6 AMZN segment customs. Values $B (EPS $, shares B); capex positive.
// Re-extract when Dani refreshes the archive (recipe: session scratchpad amzn_ce_cons builder).
var CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:["2023-10-29","2024-02-04","2024-05-03","2024-08-04","2024-11-03","2025-02-09","2025-05-04","2025-08-03","2025-11-02","2026-02-08","2026-05-02","2026-08-06"],
  q:["Q4 2022","Q1 2023","Q2 2023","Q3 2023","Q4 2023","Q1 2024","Q2 2024","Q3 2024","Q4 2024","Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026","Q1 2027","Q2 2027"],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:"Revenue", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,165.5],[null,null,141.8,142.4],[null,149.5,150.1,149.1],[158.6,159.3,159.4,157.6],[188.1,187.8,186.8,187.2],[158.9,158.8,158.8,155.3],[164.8,164.3,162.6,162],[175.5,174.3,172.9,176.5],[206.2,204.1,207.2,210.7],[170.7,172.7,174.7,177],[183.3,186.2,188.3,194.7],[199.2,201.7,203.8,201.7],[237.7,241.6,244.6,null],[204.1,208.9,null,null],[229.5,null,null,null]],
      qa:[149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6,null,null,null,null],
      qy:[null,null,null,null,149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6],
      qq:[null,149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6,null,null,null] },
    { k:"Gross profit", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,74.6],[null,null,67.8,68.6],[null,73.1,73.8,73.7],[76.9,77.4,77.4,77.1],[87.3,88,87.8,90.3],[79.2,79.4,79.6,77.9],[83.4,83.8,82.8,81.8],[87.7,87.1,85.8,88.3],[99.2,97.6,99.9,102.1],[86.9,88.4,91.5,90.8],[95.8,100.5,98.7,101.9],[106.3,104.1,105.3,105.2],[117.5,120.2,122.3,null],[108.5,111.5,null,null],[123.1,null,null,null]],
      qa:[63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8,null,null,null,null],
      qy:[null,null,null,null,63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8],
      qq:[null,63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8,null,null,null] },
    { k:"Operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10],[null,null,9,10.8],[null,11.3,12.6,13.6],[12.9,14.2,15.5,14.9],[16.1,18.1,17.7,18.6],[17.4,17.6,17.9,17.5],[17.9,18.4,18.2,17.1],[20.2,20.5,19.4,19.7],[24.3,23.3,23.7,24.4],[21.7,21.7,21.9,20.9],[22.6,23.3,23.1,23.3],[24.7,24.6,24.5,26],[30.3,30.9,32.5,null],[28.6,30.6,null,null],[34.7,null,null,null]],
      qa:[2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5,null,null,null,null],
      qy:[null,null,null,null,2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5],
      qq:[null,2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5,null,null,null] },
    { k:"EBITDA", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,28.4],[null,null,26.4,28.7],[null,30.4,32,32.5],[31.8,33.6,34.3,33.4],[36.8,37.8,37.5,39.7],[35.4,36.2,37.4,37.1],[38.3,39.7,40,37.8],[41.5,42.1,40.4,41.4],[47.3,46,47.1,48.5],[43.2,43.5,44.5,44.7],[48.1,49.5,50.3,51.1],[51.3,52.4,52.4,53.2],[59.9,61.1,62.6,null],[58.7,61.3,null,null],[68.8,null,null,null]],
      qa:[21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5,null,null,null,null],
      qy:[null,null,null,null,21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5],
      qq:[null,21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5,null,null,null] },
    { k:"EPS (diluted)", u:"$", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.73],[null,null,0.69,0.8],[null,0.88,0.92,1.02],[1.01,1.05,1.16,1.14],[1.21,1.35,1.35,1.45],[1.26,1.3,1.37,1.37],[1.36,1.46,1.42,1.32],[1.58,1.6,1.51,1.53],[1.9,1.78,1.84,1.94],[1.64,1.69,1.73,1.63],[1.79,1.85,1.81,1.81],[1.96,1.94,1.96,1.96],[2.35,2.37,2.44,null],[2.25,2.4,null,null],[2.68,null,null,null]],
      qa:[0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75,null,null,null,null],
      qy:[null,null,null,null,0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75],
      qq:[null,0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75,null,null,null] },
    { k:"Operating cash flow", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.9],[null,null,20.1,21.2],[null,24.4,25.8,28.8],[25.3,26.7,29.9,28.9],[44.1,48,47.5,48.6],[22.9,26.4,28.6,26.3],[33.6,35.5,35.3,36.6],[35.7,33.8,33.9,36.8],[53,54.4,56.4,52.4],[30.8,31.1,35.3,30.5],[42.5,48.5,42.7,51.5],[43.9,44.9,45.9,59.4],[64,65.5,69.6,null],[41.8,41.1,null,null],[50.7,null,null,null]],
      qa:[29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4,null,null,null,null],
      qy:[null,null,null,null,29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4],
      qq:[null,29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4,null,null,null] },
    { k:"Capex", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10.7],[null,null,11.6,13.3],[null,11,12.8,14.7],[11.9,13.4,14.8,18.8],[15.1,16.2,20.6,22.7],[14,17,18.8,25],[19.2,20.3,25.5,26.9],[22.8,26.5,26.6,30.2],[27,27.5,31,33.9],[26,30.4,33.9,41.8],[32.5,36.9,46.5,48],[38.2,50.1,51.3,57.6],[54.2,56.1,64.1,null],[49.7,63.8,null,null],[69.7,null,null,null]],
      qa:[16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2,null,null,null,null],
      qy:[null,null,null,null,16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2],
      qq:[null,16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2,null,null,null] },
    { k:"D&A", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,12.8],[null,null,12.3,12.6],[null,12.8,13,12.9],[13.2,13.4,13.8,13.6],[14.1,14.1,14.1,14.4],[13.3,13.3,13.9,14.5],[14.3,14.8,15.2,14.9],[15.2,16.2,15.8,16.1],[17.7,17.5,17.8,18.1],[16.6,17.2,17.9,19.2],[18.1,18.9,20.5,21],[20,21.8,22.3,22.1],[24.2,24.8,24.9,null],[24.5,24.3,null,null],[26.3,null,null,null]],
      qa:[12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20,null,null,null,null],
      qy:[null,null,null,null,12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20],
      qq:[null,12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20,null,null,null] },
    { k:"Diluted shares", u:"B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10.52],[null,null,10.08,10.59],[null,10.1,10.63,10.65],[10.13,10.66,10.67,10.67],[10.69,10.7,10.7,10.71],[10.16,10.25,10.75,10.75],[10.28,10.78,10.78,10.77],[10.81,10.82,10.81,10.81],[10.85,10.84,10.84,10.82],[10.98,10.91,10.87,10.87],[10.97,10.9,10.9,10.87],[10.93,10.93,10.9,10.91],[10.96,10.93,10.93,null],[10.99,10.98,null,null],[11.01,null,null,null]],
      qa:[10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9,null,null,null,null],
      qy:[null,null,null,null,10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9],
      qq:[null,10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9,null,null,null] },
    { k:"AWS net sales", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,24.2],[null,null,24.1,24.1],[null,25.2,25.3,25.9],[26.4,26.5,27.2,27.4],[28,28.6,28.8,28.8],[29.2,29.5,29.7,29.4],[30.9,31.1,30.9,30.8],[32.5,32.5,32.2,32.4],[34.1,33.9,34.1,34.8],[34.5,34.7,35.7,35.6],[36.6,38,37.5,39.1],[40.7,39.9,41.7,44.3],[42.5,44.9,48,null],[46.2,49.7,null,null],[54.2,null,null,null]],
      qa:[21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2,null,null,null,null],
      qy:[null,null,null,null,21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2],
      qq:[null,21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2,null,null,null] },
    { k:"North America", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,102.7],[null,null,84,84.6],[null,89.8,90.5,90],[95.5,96.1,95.7,95.3],[115.1,115.2,114.3,114.5],[94.3,93.9,94.1,92.7],[97.8,98.1,97.6,97.2],[104,103.5,102.8,104.4],[125.2,124.4,125.8,126.9],[99.6,100.5,105.9,102],[108.1,114.7,109.1,112.4],[122.3,116,115.4,112.8],[138.8,139,139.8,null],[112.6,113.3,null,null],[125.3,null,null,null]],
      qa:[93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null,null],
      qy:[null,null,null,null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2],
      qq:[null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null] },
    { k:"International", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.9],[null,null,32.9,32.9],[null,34,33.8,32.9],[36.6,36.4,35.7,34.7],[44.5,44.4,43.3,43.9],[34.9,34.6,35,33.1],[35.2,35.2,34,34.1],[39.2,38.2,37.9,39.9],[46.9,46.5,48.2,49.6],[36,37.3,40.3,38.5],[39.1,43.3,40.7,42.2],[47.2,45,45.1,43.5],[55.3,56.6,56.2,null],[43.1,43.9,null,null],[47.6,null,null,null]],
      qa:[34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2,null,null,null,null],
      qy:[null,null,null,null,34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2],
      qq:[null,34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2,null,null,null] },
    { k:"AWS operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,6.6],[null,null,6.6,7.1],[null,7,7.4,8.4],[7.6,8.1,8.8,9],[8.3,9.1,9.2,10.1],[9.8,10,10.4,10.3],[10.1,10.6,10.6,10.8],[11.4,11.4,11.6,11.3],[11.9,12,11.8,11.6],[12.6,12.5,12.3,12.4],[12.2,11.7,12.1,12.5],[13,13.3,13.7,16.3],[14.4,14.8,17.8,null],[16.2,18.2,null,null],[19.9,null,null,null]],
      qa:[5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6,null,null,null,null],
      qy:[null,null,null,null,5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6],
      qq:[null,5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6,null,null,null] },
    { k:"North America operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,4.2],[null,null,3.2,4],[null,4.3,4.9,5.1],[5.1,5.6,5.9,5.4],[7.1,7.7,7.5,7.4],[6.2,6.1,6.1,6.1],[6.7,6.5,6.5,5.6],[7.2,7.3,6.3,7.1],[10.5,9.5,10.3,10.6],[7,7.4,7.6,7.2],[8.7,9.1,8.7,8.4],[8.7,9,8.2,7.3],[13.7,13.3,12.4,null],[9.4,9.4,null,null],[10.7,null,null,null]],
      qa:[-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1,null,null,null,null],
      qy:[null,null,null,null,-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1],
      qq:[null,-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1,null,null,null] },
    { k:"International operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,-1],[null,null,-0.8,-0.7],[null,-0.3,-0.2,-0.2],[-0.5,0.2,0.7,0.6],[0.3,0.7,1,1.1],[1.4,1.9,1.5,1.1],[1.4,1.3,1,0.7],[2,2,1.5,1.6],[2.2,1.8,2.1,2.3],[1.9,2,1.8,1.2],[1.7,2.1,1.8,1.9],[2,2.3,1.8,2.1],[2.3,2.4,2.2,null],[2.1,2.7,null,null],[3.4,null,null,null]],
      qa:[-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7,null,null,null,null],
      qy:[null,null,null,null,-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7],
      qq:[null,-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7,null,null,null] }
  ]
};

var CALL_EARNINGS = { ticker:'AMZN', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ends Sep 2026; reports ~late October 2026) ──
  //
  // CONSENSUS PROVENANCE — the dataset's forward consensus is the Jul-2026 BBG BEst export, i.e.
  // PRE-2Q26-print: the Street had Q3 revenue at $203.9B BEFORE Amazon guided $197–202B with the
  // Prime-Day flip. Expect those cells to re-base; refresh when Dani re-exports.
  { q:'Q3 2026', status:'upcoming', date:'reports ~late October 2026 (date TBC)',
    setup:{
      source:'Refinitiv/LSEG + BBG BEst export (via js/results-data/amzn.js; PRE-2Q26-print vintage) · Summit — live 2026-05-13 vintage', asOf:'Jul 2026',
      notes:{
        'Revenue':{ t:'Guided $197–202B — with the Prime-Day flip working AGAINST the quarter', h:'<p>Guided <b>$197–202B (+9–12%)</b>, assuming <b>~80bps unfavorable FX</b>. The optics warning is pre-loaded: Prime Day sat in Q3 last year and in Q2 this year, so reported growth runs <b>~400bps LOWER</b> than the underlying rate — Amazon said so in the release itself.</p><p>⚠ The consensus cell is the <b>pre-print</b> BBG vintage, exported before this guide existed — it sits ABOVE the guide top and will re-base on the next export.</p>' },
        'Operating income':{ t:'Guided $22.5–26.5B — against a charges-dirty comp', h:'<p>Guided <b>$22.5–26.5B</b> vs $17.4B in Q3 2025 — but that comp carried <b>$4.3B of charges</b> (the FTC settlement + severance), so the implied clean growth is mid-teens, not +40%. New assumption language: the guide excludes <b>energy-derivative contract remeasurements</b> — the accounting line that flattered the Q2 AWS margin now carries its own disclaimer. Amazon has beaten the top of this guide in 12 of 14 prints.</p>' },
        'EPS (diluted)':{ t:'Mind the marks — both directions now', h:'<p>Pre-print consensus $1.94. 2Q26 printed <b>$5.75 against a $1.82 bar</b> on <b>$53.4B of pre-tax other income</b> (primarily the Anthropic mark) — and a mark can swing the other way. Amazon does not guide EPS; score the operating line first, always.</p>' },
        'Capex':{ t:'The frame is now ~$220B', h:'<p>The FY26 cash-capex frame was <b>RAISED to ~$220B</b> (from ~$200B) on the Q2 call, with memory-cost inflation named as a driver. 1H26 ran <b>$98.4B gross</b>, so the frame implies a ~$120B second half. The Street\'s pre-print line for Q3 was $52.2B — expect it to move up.</p>' },
        'AWS net sales':{ t:'After +37%, the bar resets', h:'<p>Pre-print consensus <b>$43.3B (+31%)</b> — set before AWS printed <b>+37%</b> (fastest in 18 quarters, $169B run-rate). The demand math behind the next print: backlog <b>$496B</b> (~2.5x YoY), 2027 capacity "largely reserved", some 2028 "already spoken for". No company guidance for AWS — the consensus IS the bar, and it will re-base upward.</p>' },
        'North America':{ t:'The Prime-Day flip lands here', h:'<p>Pre-print consensus $115.3B. The Q3/Q2 Prime-Day timing swing hits North America hardest. The segment margin (7.9% in Q2) still carries the ~$1B/quarter LEO cost ramp until capitalization begins in Q4 — with robotics as the offset.</p>' },
        'International':{ t:'The line to sanity-check', h:'<p>Pre-print consensus $45.1B. Q2 printed $42.2B (+15%) — a touch UNDER both the Street ($42.7B) and Summit ($43.4B), the only line on the card that missed. The model\'s over-call pattern on this segment continues.</p>' },
        'Advertising':{ t:'The accelerating profit engine', h:'<p>Pre-print consensus <b>$21.0B (+19%)</b> — set before ads printed <b>+26%</b> in Q2 (an acceleration from +22%, sponsored products the named driver). The line that audits whether agentic surfaces keep compounding into ad dollars.</p>' }
      },
      us:{ 'Revenue':{v:201.7}, 'Operating income':{v:24.3}, 'AWS net sales':{v:41.9}, 'North America':{v:114.8}, 'International':{v:45.0} },
      debate:{ rows:null, synth:'The one thing to resolve: does the <b>$496B book convert</b> fast enough to hold AWS in the high-30s with 2027 capacity already reserved — or does the first <b>negative-FCF year</b> (TTM −$7.6B, frame raised to ~$220B) plus the Prime-Day growth optics re-open the bill debate the Q2 print had just closed?' }
    },
    results:null, call:null },

  // ── REPORTED: Q2 2026 (quarter ended Jun 2026; reported Jul 30, 2026 AMC, call 5pm ET) ──
  { q:'Q2 2026', status:'reported', date:'July 30, 2026',
    setup:{
      source:'Refinitiv/LSEG + BBG BEst export (via js/results-data/amzn.js) · Summit — frozen 2026-05-13 vintage', asOf:'Jul 2026',
      notes:{
        'Revenue':{ t:'Guided $194–199B — Prime Day moved INTO the quarter', h:'<p>Guided <b>$194–199B</b> (+16–19%), with <b>Prime Day in Q2 for most major geographies</b> this year (Q3 for Australia, Brazil, India, Japan) — a comp helper to remember when reading the growth rate. FX ~neutral (~10bps headwind assumed). Consensus $197.0B sits mid-range; the actual has landed at or above the TOP of guidance in 10 of the last 13 prints.</p>' },
        'Operating income':{ t:'The Street models the TOP of the guide', h:'<p>Guided <b>$20–24B</b>; consensus sits at <b>$23.7B</b> — right at the top. The guide embeds three flagged headwinds: the seasonal <b>SBC step-up</b>, <b>~$1B YoY of Amazon LEO costs</b> (satellite manufacturing + launch; capitalization only begins Q4), and fuel-inflation transport costs. Actuals beat the top of the op-income guide in 11 of the last 13 prints — the Street is betting on the pattern.</p>' },
        'EPS (diluted)':{ t:'Mind the Anthropic marks', h:'<p>Consensus $1.82. 1Q26 printed <b>$2.78 vs $1.64 expected</b> — inflated by <b>~$16.8B of pre-tax Anthropic valuation gains</b>. Amazon does not guide EPS; score the operating line first and read EPS ex-marks.</p>' },
        'Capex':{ t:'The ~$200B year, quarter by quarter', h:'<p>The Street models <b>$48.7B</b> for the quarter (vs $44.2B in Q1 and $32.2B a year ago) — the FY26 "~$200B, predominantly AWS" frame from the Q4 call, now with <b>memory-cost inflation</b> management says has "skyrocketed". Amazon guides capex only qualitatively; the model carries it annually ($205.8B FY26).</p>' },
        'AWS net sales':{ t:'The line the market trades on — a 16th-quarter high?', h:'<p>Consensus <b>$40.5B (+31%)</b> — modelling ANOTHER acceleration on top of Q1\'s +28% (itself the fastest in 15 quarters, $150B run-rate). The demand math behind it: backlog <b>$364B</b> + the <b>$100B+ Anthropic deal</b> excluded from it. No company guidance for AWS — the consensus IS the bar.</p>' },
        'North America':{ t:'Watch the margin, not just the sales', h:'<p>Consensus $114.0B. The Q1 segment margin was 7.9%; the LEO cost step-up lands in North America, and the robotics rollout (every 2026 US large-format launch) is the offset. Segment consensus exists only from this quarter forward (BBG export).</p>' },
        'International':{ t:'Profitable, but the model has over-called it', h:'<p>Consensus $42.7B. The segment turned profitable in 2024; Summit\'s frozen projections have recently run $0.5–1.2B ABOVE the printed op income — the line to sanity-check rather than celebrate.</p>' },
        'Advertising':{ t:'The third profit engine', h:'<p>Consensus <b>$19.3B (+23%)</b>. Q1 printed +22% with the Netflix/Comcast/Samsung partnerships ramping and ~20% of Rufus brand-prompt shoppers continuing the conversation. Street models ~18–19% growth through 2027.</p>' }
      },
      us:{ 'Revenue':{v:199.8}, 'Operating income':{v:23.8}, 'AWS net sales':{v:39.8}, 'North America':{v:116.6}, 'International':{v:43.4} },
      debate:{ rows:null, synth:'The one thing to resolve: does <b>AWS accelerate again</b> (the Street\'s +31% vs Summit\'s +29%) with backlog converting — or does the quarter turn into a bill story (SBC step-up + $1B of LEO + memory-inflated capex) where the record 13.1% margin proves to be the peak, not the base?' },
      pricedIn:'The Street at the top of both guides — revenue $197.0B mid-range, operating income $23.7B right at the guide top — with AWS modelled to accelerate AGAIN to +31%. The open worry was the bill: memory inflation, the ~$1B LEO step-up and the seasonal SBC, all flagged inside the guide itself. The tape went in hot: AMZN closed +3.9% on earnings day as money rotated into AI winners.',
      oneLiner:'The bar was "accelerate again and absorb the bill" — Amazon cleared both: AWS +37% (fastest in 18 quarters), revenue AND operating income above the tops of their guides, a new margin record. The bill grew too: the capex frame went to ~$220B and TTM free cash flow turned negative.' },
    // ── SINGLE FILL (v2.8): results + call landed together, 2026-07-31, from the Jul 30 8-K
    // (Ex. 99.1, accession 0001018724-26-000024) + the earnings-call record (5:00pm ET; see
    // docs/calls/AMZN-latest.md — verbatim IR transcript still pending from Dani).
    results:{
      summary:{
        paras:[
          { p:'<b>AWS turned from a demand question into a supply question, and that changes what the model actually hinges on.</b> For six quarters the live debate was whether AWS demand was real. This print settles it: contracted <span class="ce-gl" data-def="Contracted future revenue not yet recognised; AWS reports it as remaining performance obligations.">backlog</span> now covers roughly two build-years forward, with 2027 largely reserved and parts of 2028 already committed, so the growth ahead is booked rather than hoped. The consequence for the analysis is that the variable to underwrite is no longer the demand curve but the conversion rate: how fast Amazon can stand up reserved capacity and turn it into recognised revenue. Forward estimates now key off installation and utilisation cadence, not off whether customers show up.',
            more:'The one soft line, International revenue, is immaterial to the thesis. What matters analytically is that the acceleration arrived while supply, not demand, was the binding constraint, which is the tell that the book is converting faster than capacity is being added.' },
          { p:'<b>The margin record matters as evidence, not as a number: Amazon is absorbing a historic investment cycle without profitability giving way.</b> The most direct bear case was that the build would compress margins before the revenue arrived, and this quarter closes off that path. The stronger signal is behavioural. Management volunteered that part of the AWS margin gain came from an energy-derivative accounting item and pointed the Street to the clean figure instead. Disclosing a flattering item against its own interest tells you the underlying margin is the one they are willing to be judged on, which raises the credibility of the whole operating trajectory.',
            moreLabel:'＋ more — why the EPS line is not the read',
            more:{ body:'GAAP EPS is dominated by a non-operating Anthropic valuation mark, so it says nothing about the economics of the quarter. It matters only for two second-order reasons.',
              nodes:[
                { t:'Cash tax and the balance sheet', body:'The mark is unrealised, so the large tax provision it created is mostly deferred rather than cash. Read it as an accounting entry, not a cash outflow that changes the funding picture.' },
                { t:'Why the Q3 guide reads cleaner', body:'Management fenced energy-derivative remeasurements out of the forward guide by assumption. The item that flattered this quarter\'s AWS margin will not distort the next comparison, which makes the guide more useful to model against.' } ] } },
          { p:'<b>Free cash flow going negative is less important than what the market decided it means.</b> The development to weigh is not the capex figure but the re-rating around it: the stock rose after the print, so investors are underwriting the spend as pre-sold against the backlog rather than as overreach. For the analysis this redirects the diligence. The question stops being whether Amazon is spending too much and becomes whether the backlog is high quality and will convert, so the work moves to cancellation terms, customer concentration and installation timelines. The capex itself only turns into a risk if conversion slips, at which point the same negative <span class="ce-gl" data-def="Operating cash flow minus capital expenditure — the cash the business keeps after paying for its own growth.">free cash flow</span> would read very differently.',
            moreLabel:'＋ more — where the funding grace could break',
            more:{ body:'Operating cash flow no longer covers the build, and the gap is being closed with debt. That is durable only while the backlog keeps converting on schedule.',
              nodes:[
                { t:'The single condition to watch', body:'If conversion pace slows for even one quarter, negative FCF funded by rising debt loses its pre-sold justification. This is the one variable that flips the print from strong to fragile, and it is the thing to monitor above the headline numbers.' },
                { t:'Why the frame keeps rising', body:'The capex frame moved up on memory-cost inflation, not on added capacity. Cost inflation on a fixed build is a margin and funding question rather than a demand signal, so it should be tracked separately from the backlog story.' } ] } },
          { p:'<b>Custom silicon crossed from an internal cost lever into an external competitive moat.</b> The meaningful change is validation. Both leading frontier labs have now committed to Amazon\'s chips, which undercuts the argument that AWS is merely reselling someone else\'s GPUs and puts a differentiated asset behind its capex. For the thesis this narrows the open question to monetisation. The silicon advantage is proven for internal and anchor-tenant use, but whether it ever sells beyond that, through a merchant or rack path, is unresolved. That is the next catalyst worth tracking, because it would convert a cost advantage into a new revenue line rather than a defensive one.' },
          { p:'<b>The Q3 guide should not be read as a slowdown, and the more durable signal sits in retail.</b> The headline growth step-down is a calendar artifact from Prime Day shifting quarters, so treating the guide as deceleration misreads it. The signal that compounds is structural: retail efficiency, where units grow faster than fulfilment cost, plus fast-commerce adoption, are becoming permanent features rather than a recovery. That supports the North America margin path independently of AWS, which matters because it means the profit story is no longer carried by a single engine. The lower the reliance on any one segment, the lower the risk that a miss in that segment breaks the whole thesis.' }
        ]
      },
      notes:{
        'Revenue':{ t:'Above the top of the guide — again', h:'<p><b>$200.6B (+20%; FX +$0.1B favorable)</b> vs $196.4B consensus and a $194–199B guide — above the top for the 11th time in 14 prints, with the Prime-Day-in-Q2 helper. Paid units +17%; every revenue line grew double-digit except physical stores (+4%).</p>' },
        'Operating income':{ t:'Beat the guide top by $3.5B — new margin record', h:'<p><b>$27.5B (+43%, 13.7% margin — the highest ever)</b> vs the $20–24B guide and $23.7B modelled. The guide\'s three flagged headwinds (SBC step-up, ~$1B of LEO, fuel) were absorbed whole. AWS did the lifting: $16.6B of segment operating income (+64%, 39.4% margin); North America 7.9%; International 4.1%.</p>' },
        'EPS (diluted)':{ t:'⚠ $5.75 is a mark, not a quarter', h:'<p>$5.75 vs $1.82 expected — but <b>$53.4B of pre-tax other income (primarily the Anthropic mark)</b> sits inside it, against $1.1B a year ago. Net income $62.6B (+245%); deferred tax $17.7B of an $18.2B provision. The honest operating read is the $27.5B. Score EPS ex-marks or be scored by them.</p>' },
        'Capex':{ t:'$54.2B — and the frame moved to ~$220B', h:'<p><b>$54.2B gross</b> in the quarter ($53.1B net of proceeds; vs $48.7B modelled) — 1H26 $98.4B. On the call the FY26 cash-capex frame was <b>raised to ~$220B</b> from ~$200B, partly on the "higher cost of memory". TTM free cash flow <b>−$7.6B</b>, negative for the first time in the build; long-term debt +$63B in the half.</p>' },
        'AWS net sales':{ t:'+37% — fastest in 18 quarters, third straight acceleration', h:'<p><b>$42.2B (+37%, $169B run-rate)</b> vs $40.5B consensus — after +28% and +24%. Backlog <b>$496B</b> (~2.5x YoY, growing triple-digit); 2027 capacity "largely reserved", some 2028 "spoken for". The AI business and the chips business <b>each exceed a $25B run-rate, both triple-digit</b>. Segment margin 39.4% (+650bps; ~+520bps excluding derivative gains).</p>' },
        'Advertising':{ t:'+26% — an acceleration at $20B scale', h:'<p><b>$19.8B (+26%)</b> vs $19.4B modelled — accelerating from +22%, with sponsored products the named driver. The agentic-commerce claim (multi-turn conversations create more ad surfaces, not fewer) keeps converting into reported dollars.</p>' },
        'North America':{ t:'In line, with the LEO drag still inside it', h:'<p>$116.2B (+16%) vs $114.0B modelled; segment operating income $9.1B at a 7.9% margin — flat with Q1 while absorbing roughly $1B of LEO cost and delivering ~$600M of tariff refunds as offset.</p>' },
        'International':{ t:'The one line under the Street', h:'<p>$42.2B (+15%) vs $42.7B modelled and Summit\'s $43.4B — a −1.2% miss, the only one on the card. Segment operating income $1.7B (4.1% margin) landed between the Street ($1.6B) and Summit ($1.5B).</p>' }
      },
      watch:{ 'AWS net sales':1, 'Capex':2, 'Operating income':3, 'Advertising':4 },
      thesisCheck:[
        { line:'AWS growth stalls below ~25% or the backlog stops converting', tripped:false, note:'+37% — the fastest in 18 quarters and the third straight acceleration — with backlog at $496B, roughly 2.5x a year ago. The demand side is now contractual out to 2028: 2027 capacity largely reserved, some 2028 already spoken for.' },
        { line:'The capex frame outruns the cash (the FCF red line)', tripped:true, note:'⚑ TTM free cash flow printed NEGATIVE (−$7.6B) and the frame was RAISED to ~$220B — the red line the Q4-2025 model flip predicted has now fired in reported actuals. It is demand-led (see the line above) and debt-funded ($67B of new long-term debt in 1H26) — but it fired as written.' },
        { line:'The 13.1% margin proves the peak, not the base', tripped:false, note:'13.7% — a new record, absorbing the SBC step-up, ~$1B of LEO and fuel inflation the guide had flagged. AWS at 39.4% (+650bps, ~520bps clean) did the lifting.' },
        { line:'Agentic commerce fails to compound into ad dollars', tripped:false, note:'Advertising accelerated to +26% (from +22%) at a $20B quarterly scale, with sponsored products named as the driver. The usage-to-dollars chain keeps converting.' },
        { line:'Custom silicon stays an internal cost edge', tripped:false, note:'The chips business is now above a $25B run-rate growing triple-digit — and BOTH Anthropic and OpenAI have committed multi-year, multi-gigawatt to Trainium. From one anchor tenant to the two leading labs in two quarters.' },
      ],
      intoCall:[
        '☁️ <b>Conversion pace</b> — $496B of backlog against capacity reserved through 2027: how fast does the book become recognised revenue? (On the list.)',
        '💸 <b>The ~$220B frame</b> — memory inflation now quantified into the frame, TTM FCF negative, $67B of new debt: where does the funding mix go from here? (On the list.)',
        '📊 <b>Margin quality</b> — a 39.4% AWS margin that includes ~130bps of derivative accounting: is the clean ~38% sustainable under the depreciation ramp?',
        '🤖 <b>The merchant silicon path</b> — with OpenAI joining Anthropic on multi-gigawatt commitments, does rack/external sale move from "a possibility" to a plan?',
      ],
      priceReaction:'+9.1% after hours on Jul 30 (from a $235.50 close, itself +3.9% on the day) and about +12.5% in the Jul 31 pre-market (~$265) — the tape bought the AWS acceleration and looked straight through the negative free cash flow. The next-day close was still pending at fill time; confirm before quoting a settled number.' },
      call:{
      take:'Q1 killed the demand question; this call killed the supply question\'s optionality too — capacity is reserved into 2028, the frame is ~$220B and the cash line went negative. What is left to argue is pace and margin quality.',
      highlights:[
        { tag:'thesis', band:'lead', open:'Conversion pace: how fast does $496B of contracted demand become recognised revenue when capacity is the binding constraint?',
          head:'The demand proof compounded: backlog $496B (~2.5x YoY), 2027 capacity "largely reserved", some 2028 "already spoken for" — and AWS accelerated to +37% anyway',
          detail:'<p>Jassy: "clear line of sight to strong financial returns," with the trillion-dollar-AWS framing restated. Gawrelski (Wells Fargo) put the backlog at 2.5x the prior year; Post (BofA) pressed on 2027 capacity additions and got reservation language rather than megawatt numbers. The constraint story is unchanged since Q1 — installs bill six to twenty-four months after commitment — but the book now covers TWO build-years forward.</p>' },
        { tag:'watch', band:'lead', open:'The funding mix under a ~$220B frame with TTM FCF negative — more debt, a partner vehicle, or does operating cash flow close the gap?',
          head:'The frame moved to ~$220B on "higher cost of memory", TTM free cash flow printed −$7.6B, and long-term debt nearly doubled to $129B in six months',
          detail:'<p>Olsavsky attributed part of the raise to memory-cost inflation — the input flagged as "skyrocketed" in Q1, now priced into the frame. The funding shifted visibly with $67B of long-term debt raised in the first half. Unlike Meta, Amazon has not announced a co-investment vehicle; whether it follows that route is the open question behind the next two prints.</p>' },
        { tag:'thesis', band:'context',
          head:'Margin quality, disclosed against interest: the 39.4% AWS margin is +650bps YoY — and Olsavsky stripped out roughly 130bps of energy-derivative accounting gains himself',
          detail:'<p>"Margins are not random" — the ~520bps of clean expansion was attributed to disciplined efficiency gains: custom-silicon mix, power efficiency, utilisation. The candor cuts both ways. It strengthens the clean number\'s credibility, and it plants the flag that a future quarter\'s margin can swing on the derivative line — which is exactly why the Q3 guide now excludes remeasurements by assumption.</p>' },
        { tag:'thesis', band:'context',
          head:'The silicon ladder\'s new rung: the AI business and the chips business each above a $25B run-rate, triple-digit growth — with Anthropic and OpenAI both committed multi-year, multi-gigawatt to Trainium',
          detail:'<p>Graviton5 reached general availability. Two quarters ago the pitch was a $20B run-rate and $225B of commitments anchored by a single tenant; now both leading frontier labs are on the same silicon. Nowak (Morgan Stanley) asked about Trainium sales into third-party data centres — the merchant question stays open, but the tenant list has stopped being a concentration argument.</p>' },
        { tag:'curious', band:'context',
          head:'The retail quiet compounders: same-day perishables customers +50% since January, same-day orders carrying 3x the units, paid units +17%',
          detail:'<p>Sheridan (Goldman) probed fast-commerce adoption across geographies. Grocery and everyday essentials keep growing faster than the rest of the business — the efficiency flywheel (units outgrowing fulfillment cost) now reads as a permanent feature of the model rather than a recovery story.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: about $600M of tariff-related refunds landed in Q2 · Kiro and Transform push AWS up the application layer · advertising +26% on sponsored products',
          detail:'<p>The tariff refunds are one-off cost relief sitting inside the North America margin — most of what Amazon expected to recover. Sebastian (Baird) asked about the application-layer expansion and how the capital gets sourced; AWS moving from renting compute to selling outcomes is the same "selling intelligence" doctrine every hyperscaler now recites.</p>' },
        { tag:'watch', band:'logged', open:'A dated marker: LEO commercial service starts in Q3 — the first quarter where the ~$1B/quarter cost line has revenue beside it.',
          head:'LEO: capitalization begins Q4, commercial service Q3 — the cost line finally gets a revenue line',
          detail:'<p>The disclosure set is unchanged from Q1 (250+ satellites; Delta, JetBlue, AT&T, Vodafone, NASA and Apple committed). The milestone to score next call is whether commercial revenue actually starts, and at what run-rate.</p>' },
      ],
      // ③ THE CALL, CLASSIFIED — prepared remarks + Q&A, each tagged to a Watch List theme. Built from
      // docs/calls/AMZN-latest.md (Q2 2026, Jul 30). Tone follows the AI-summary standard: objective,
      // no em-dashes, the why behind each point. Answers are reconstructed from transcript coverage
      // (verbatim IR transcript still pending per the doc's provenance note).
      prepared:[
        { topic:'Capex frame raised to ~$220B', theme:'Capex',
          body:'Olsavsky lifted the FY2026 cash-capex frame to ~$220B from ~$200B and attributed part of the raise to the higher cost of memory, the same input Jassy called "skyrocketed" in Q1. Quarterly capex was $54.2B gross (1H26 $98.4B). The reason it lands in the bill rather than in lost capacity: supply was locked with strategic suppliers in mid-to-late 2025, so the inflation prices the spend instead of capping it.' },
        { topic:'Backlog $496B, capacity reserved into 2028', theme:'Backlog',
          body:'AWS backlog reached $496B and is growing triple-digit, roughly 2.5x the prior year. Management said 2027 capacity is largely reserved and some 2028 capacity is already spoken for. That reframes the +37% AWS growth as conversion of a contracted book, with supply as the binding constraint into 2027 and 2028.' },
        { topic:'AWS margin quality, disclosed against interest', theme:'Margins',
          body:'AWS margin was 39.4%, up ~650bps YoY, but Olsavsky volunteered that roughly 130bps came from energy-derivative accounting gains, leaving ~520bps of clean expansion. He tied the clean gain to efficiency in custom-silicon mix, power and utilisation. Disclosing the flattering item before being asked is the credibility signal, and it explains why the Q3 guide now excludes remeasurements by assumption.' },
        { topic:'AI and chips each above a $25B run-rate', theme:'Custom silicon',
          body:'The release sized two businesses inside AWS for the first time: the AI business and the chips business each exceed a $25B annualized run-rate, both growing triple-digit. Anthropic and OpenAI are each making multi-year, multi-gigawatt Trainium commitments, and Graviton5 reached general availability. It matters because custom silicon now has both leading frontier labs committed, so the tenant list stops being a concentration risk.' },
        { topic:'Returns and the trillion-dollar destination', theme:'Backlog',
          body:'Jassy said Amazon has "clear line of sight to strong financial returns" and restated that AWS can become a trillion-dollar annual revenue business. The purpose of the framing was to cast the capex as demand-led investment against a contracted book rather than open-ended spending.' },
        { topic:'Consumer: fast commerce, tariff refunds, advertising', theme:'Robotics',
          body:'Same-day perishables customers are up 50% since January and same-day orders carry about 3x the units, with grocery and everyday essentials growing faster than the rest of retail. Roughly $600M of tariff-related refunds landed in Q2 as one-off cost relief inside North America. Advertising grew 26% to $19.8B, with sponsored products named as the driver.' },
      ],
      qanda:[
        { q:'AWS margin sustainability under heavy AI investment, and whether Amazon needs its own frontier model', analyst:'Doug Anmuth · J.P. Morgan', theme:'Margins',
          a:'Management framed margins as the product of disciplined efficiency (silicon mix, power, utilisation) rather than a one-off, while flagging that the derivative line can swing a given quarter. On owning a frontier model, the answer stayed non-committal: the strategy is to give customers choice across models on AWS, with Anthropic and OpenAI both on Trainium, so no in-house frontier model was asserted as necessary.' },
        { q:'AWS acceleration drivers and the shape of 2027 capacity additions', analyst:'Justin Post · Bank of America', theme:'Backlog',
          a:'The drivers cited were backlog conversion and enterprise migration, with the AI and chips run-rates as evidence. On 2027, management used reservation language (largely reserved) rather than megawatt numbers, keeping the pace of adds qualitative.' },
        { q:'2027 data-centre investment timelines, and Trainium sales into third-party data centres', analyst:'Brian Nowak · Morgan Stanley', theme:'Custom silicon',
          a:'On timing, management repeated that installs bill six to twenty-four months after commitment, so 2027 and 2028 capacity is being reserved now. On selling Trainium into external data centres, the merchant question was left open: it stayed a possibility, not a stated plan.' },
        { q:'Application-layer expansion (Kiro, Transform) and how the capital is sourced', analyst:'Colin Sebastian · Baird', theme:'Capex',
          a:'Management positioned Kiro and Transform as moving AWS from renting compute toward selling outcomes higher up the stack. On funding, the answer pointed to operating cash flow plus debt, consistent with the $67B of long-term debt raised in the half, with no co-investment vehicle announced.' },
        { q:'Backlog at ~2.5x YoY versus capacity planning, and AWS pricing amid cost inflation', analyst:'Ken Gawrelski · Wells Fargo', theme:'Backlog',
          a:'Management confirmed backlog at roughly 2.5x the prior year and tied planning to that reserved book. On pricing, the message was that efficiency gains, not list-price increases, are carrying margin, so cost inflation is absorbed through silicon and utilisation rather than passed to customers.' },
        { q:'Fast-commerce and grocery adoption across geographies', analyst:'Eric Sheridan · Goldman Sachs', theme:'Robotics',
          a:'Management pointed to same-day perishables customers up 50% since January and same-day orders carrying 3x the units, with grocery and everyday essentials growing faster than the rest of the business and expanding across regions. The read is that fast commerce is becoming a structural feature of the model rather than a recovery story.' },
      ],
      dots:'Q4 2025 planted the two tensions (the bill, and the pre-sold demand that justifies it); Q1 2026 resolved demand emphatically; Q2 resolved the MARGIN question — a 13.7% record with AWS at 39.4% and the derivative flattery disclosed — while the bill crossed its red line in the actuals (TTM FCF −$7.6B, frame ~$220B, debt nearly doubled). Every thread now converges on one variable: the PACE at which $496B of contracted demand converts against reserved capacity. At +37% with record margins, pace is the only thing standing between the bulls\' trillion-dollar AWS and the bears\' negative-FCF-forever.',
      threeMinutes:[
        '<b>The acceleration is structural, not a quarter.</b> +24% → +28% → +37%, a $496B backlog, and capacity reserved into 2028. The demand debate is over; the argument is conversion pace.',
        '<b>Read the quarter ex-marks — and say so out loud.</b> EPS $5.75 is a $53.4B Anthropic mark. The real print is $27.5B of operating income beating its guide top by $3.5B at a record 13.7% margin, with management itself stripping the derivative flattery out of the AWS number.',
        '<b>The FCF red line fired, and the market shrugged.</b> TTM free cash flow −$7.6B, the frame to ~$220B, debt nearly doubled — and the stock paid +9% for it. Contracted backlog changed what negative FCF MEANS; watch whether that grace survives the first quarter conversion slows.',
      ],
      notBringing:[
        { item:'EPS $5.75 (a 216% "beat")', why:'It is the Anthropic mark. Leading with it misreads the quarter; the operating beat is the argument.' },
        { item:'The Q3 guide "deceleration" to +9–12%', why:'About 400bps of it is Prime-Day timing, stated in the release. Quoting the headline rate without the flip is the optics trap.' },
        { item:'Tariff refund detail (~$600M)', why:'Real one-off relief, logged in the aside — not a thesis line.' },
      ],
      newQuestions:[
        { n:'Conversion pace: $496B of backlog against reserved capacity — does AWS hold the high-30s?', landed:{ q:'Q3 2026', rank:1 } },
        { n:'The funding mix under ~$220B with TTM FCF negative — more debt, or a partner vehicle?', landed:{ q:'Q3 2026', rank:2 }, tripped:true },
        { n:'Is the clean ~38% AWS margin sustainable under the depreciation ramp?', landed:{ q:'Q3 2026', rank:3 } },
        { n:'Does advertising hold 25%+ through the Prime-Day flip quarter?', landed:{ q:'Q3 2026', rank:4 } },
        { n:'Trainium merchant path: with OpenAI and Anthropic both multi-gigawatt, do rack sales move from "possibility" to plan?', landed:{ q:'Q3 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 29, 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 29, 2026',
    setup:{
      source:'Refinitiv/LSEG pre-print consensus (via js/results-data/amzn.js) — the number that stood going in', asOf:'2026-04',
      notes:{
        'Operating income':{ t:'No pre-print Street line — the guide is the bar', h:'<p>The dataset carries no pre-print op-income consensus for this quarter; the bar was Amazon\'s own guide, <b>$16.5–21.5B</b>. The print beat the TOP by $2.4B.</p>' }
      },
      us:{ 'Revenue':{v:179.2}, 'Operating income':{v:21.4}, 'AWS net sales':{v:36.6}, 'North America':{v:103.1}, 'International':{v:39.5} },
      debate:{ rows:null, synth:'Going in: the Feb call had set the ~$200B capex frame and a soft-looking Q1 guide ($16.5–21.5B op income vs $23.9B just printed in Q4) — the bar was whether AWS keeps accelerating fast enough to make the spend read as demand-led.' },
      pricedIn:'Post-Q4 nerves about the ~$200B capex year and the soft Q1 op-income guide; AWS re-acceleration (+24% in Q4, backlog $244B) mostly believed, with the Street watching whether the Anthropic/Trainium demand shows up in reported growth.',
      oneLiner:'The bar was "prove the spend is demand-led" — Amazon beat it everywhere: AWS +28% (fastest in 15 quarters), record 13.1% operating margin, and a backlog that grew to $364B EXCLUDING a $100B+ Anthropic deal.' },
    results:{
      headline:'The proof quarter: AWS accelerated to +28% with a record 13.1% company margin — while the backlog ($364B + $100B Anthropic outside it) pre-sold the capex the bears were worried about.',
      notes:{
        'Revenue':{ t:'Above the top of the guide', h:'<p><b>$181.5B (+17%; +15% ex-FX)</b> vs $177.3B consensus and a $173.5–178.5B guide — above the top. Store unit growth +15%, the highest since COVID; everyday essentials growing ~2x the rest.</p>' },
        'Operating income':{ t:'Record margin — beat the guide top by $2.4B', h:'<p><b>$23.9B (13.1% margin — highest ever)</b> vs the $16.5–21.5B guide. AWS margin strength + fulfillment efficiency (unit growth +15% vs fulfillment expense +9% FX-neutral) did it; robotics now deploys in every 2026 US large-format launch.</p>' },
        'EPS (diluted)':{ t:'⚠ $2.78 is marks-flattered', h:'<p>$2.78 vs $1.64 expected — but <b>~$16.8B of pre-tax Anthropic valuation gains</b> sit inside it. The honest operating read is the $23.9B op income; treat the EPS beat as optics.</p>' },
        'Capex':{ t:'$44.2B — the ladder climbing to ~$200B', h:'<p>$44.2B in the quarter (8-K basis; the call quoted $43.2B cash capex), "primarily AWS and generative AI". Management: memory component costs have <b>"skyrocketed"</b>; supply allocations were locked with strategic suppliers mid-to-late 2025 — a scarcity now accelerating enterprise cloud migration.</p>' },
        'AWS net sales':{ t:'+28% — fastest in 15 quarters', h:'<p><b>$37.6B (+28%, $150B run-rate)</b> vs $36.6B consensus — a 480bps acceleration. "Very unusual for a business to grow this fast on a base this large." AI run-rate $15B+; Bedrock spend +170% sequentially; tokens processed in Q1 exceeded all prior years combined. Backlog <b>$364B</b>, excluding the <b>$100B+ Anthropic deal</b>.</p>' },
        'Advertising':{ t:'+22% at scale', h:'<p>$17.2B (+22%). Netflix, Comcast and Samsung partnerships signed; CreativeAgent in 7 more countries; Rufus MAU +115% with engagement +400%.</p>' }
      },
      watch:{ 'AWS net sales':1, 'Capex':2, 'Operating income':3, 'Advertising':4 },
      thesisCheck:[
        { line:'AWS growth stalls below ~25% or the backlog stops converting', tripped:false, note:'+28% (15-quarter high) and backlog $364B + $100B Anthropic outside it. The acceleration thesis strengthened.' },
        { line:'The ~$200B capex year swamps margins before the demand shows', tripped:false, note:'The opposite print: record 13.1% margin WITH $44.2B of quarterly capex. But memory costs "skyrocketed" — the cost side opened a new front.' },
        { line:'Custom silicon stays a science project', tripped:false, note:'$20B run-rate (+~40% QoQ), $225B+ of Trainium commitments, Trainium3 nearly fully subscribed. Held emphatically.' },
        { line:'Retail efficiency stalls (units vs fulfillment cost)', tripped:false, note:'Units +15% vs fulfillment expense +9% — the gap IS the margin story; a service engine rebuilt in 65 days vs 40–50 person-years.' },
      ],
      intoCall:[
        '☁️ <b>AWS +28% and $364B of backlog</b> — how fast can capacity actually come online, and does the Anthropic $100B start converting? (Watch #1.)',
        '💰 <b>Memory costs "skyrocketed"</b> — what does that do to the ~$200B frame and to AWS gross margin?',
        '🤖 <b>Trainium rack sales</b> — "very much a possibility": how big, how soon?',
        '🛰️ <b>LEO $1B YoY cost step-up in Q2</b> — the new drag to model before commercial revenue starts (Q3).',
      ],
      priceReaction:'To fill from a trusted source — coverage framed it as a broad beat ("results exceed expectations").' },
    call:{
      take:'The spend got pre-sold: backlog + Anthropic + silicon commitments now outrun the capex — the open question moved from demand to supply (memory, power, racks).',
      highlights:[
        { tag:'thesis', band:'lead', open:'How fast does the $364B + $100B Anthropic book convert to revenue — and can supply keep up?',
          head:'The demand proof: backlog $364B EXCLUDING Anthropic\'s $100B+, with AWS at +28% and "nowhere near enough" capacity',
          detail:'<p>Jassy, on the quarter: "it is very unusual for a business to grow this fast on a base this large." The backlog grew $244B → $364B in one quarter <i>before</i> counting the $100B+ Anthropic deal. Custom silicon hit a <b>$20B run-rate (+~40% QoQ)</b> with <b>$225B+ of Trainium revenue commitments</b>; Trainium3 is nearly fully subscribed and Trainium4 largely reserved ~18 months out.</p><p><b>Open:</b> conversion pace — capacity installs 6–24 months before billing starts.</p>' },
        { tag:'watch', band:'lead', open:'Does memory inflation move the ~$200B frame — and where does it show first, capex or AWS margin?',
          head:'The cost front opened: memory "skyrocketed", supply locked early, and the guide carries SBC + $1B of LEO',
          detail:'<p>Jassy: component costs, "particularly memory, have skyrocketed"; Amazon locked allocations with strategic suppliers mid-to-late 2025, and scarcity is itself accelerating cloud migration (suppliers prioritize hyperscalers over on-prem buyers). The Q2 guide absorbs the seasonal SBC step-up, ~$1B YoY of LEO costs (capitalization starts Q4) and fuel inflation — the honest reading of a $20–24B guide after a $23.9B print.</p>' },
        { tag:'thesis', band:'context',
          head:'The record margin was earned, not mixed: units +15% vs fulfillment cost +9%, robotics in every 2026 US large-format launch',
          detail:'<p>13.1% consolidated operating margin — highest ever — while capex ran $44B. The retail engine\'s efficiency gap (unit growth outpacing fulfillment cost growth) plus AWS strength carried it. Internal AI colour: a service engine rebuilt in <b>65 days vs a 40–50 person-year baseline</b> ("that is a very different world of operating").</p>' },
        { tag:'curious', band:'context',
          head:'Agentic commerce got its first hard numbers: Rufus MAU +115%, engagement +400% — and "we\'re going to like this for advertising"',
          detail:'<p>Jassy argued retailers\' own assistants win on data, personalization and account control vs third-party agents (which mis-price and lack personalization). Sponsored prompts already work; multi-turn conversations create MORE ad surfaces, not fewer. Ads printed $17.2B (+22%) with Netflix/Comcast/Samsung signed.</p>' },
        { tag:'curious', band:'logged',
          head:'LEO is becoming a real line: 250+ satellites, commercial service Q3 2026, Delta/JetBlue/AT&T/Vodafone/NASA/Apple committed',
          detail:'<p>Globalstar acquisition adds direct-to-device spectrum; the Apple deal covers satellite services for iPhones/Watches. "A very large, many-billion-dollar revenue business" with an AWS-like capex-then-FCF profile. Near term it is a cost: ~$1B YoY in Q2.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: Alexa+ 2x conversations / 3x purchase completions · OpenAI models in Bedrock (GPT-5.4 live) · grocery $150B+ gross sales',
          detail:'<p>Alexa+ expanded to Mexico/UK/Italy/Spain. Bedrock now carries the full OpenAI suite (stateful API coming) — 125K+ customers, 80% of the Fortune 100. Grocery: second-largest US grocer, perishables 40x YoY.</p>' },
      ],
      // ③ THE CALL, CLASSIFIED — built from docs/calls/AMZN.md (Q1 2026, Apr 29). Objective tone, no em-dashes.
      prepared:[
        { topic:'AWS +28% and the backlog behind it', theme:'Backlog',
          body:'Jassy: "very unusual for a business to grow this fast on a base this large." AWS ran a $150B run-rate at +28%, the fastest in 15 quarters. Backlog stood at $364B and, as he stressed, that figure excludes the $100B+ Anthropic deal. Bedrock spend was up 170% sequentially and Q1 tokens processed exceeded all prior years combined. The point was that the growth is contracted demand, not a spot spike.' },
        { topic:'Custom silicon doubled to a $20B run-rate', theme:'Custom silicon',
          body:'Custom-silicon run-rate reached $20B, up ~40% QoQ, with $225B+ of Trainium revenue commitments. Trainium3 runs 30-40% over Trainium2 and is nearly fully subscribed; Trainium4 is largely reserved ~18 months out. Graviton sits in 98% of the top-1,000 EC2 customers, with Meta committed to tens of millions of cores. The takeaway is that silicon demand is booked well ahead of supply.' },
        { topic:'Retail efficiency: units +15% vs fulfillment +9%', theme:'Robotics',
          body:'Olsavsky put store-unit growth at +15% (the highest since COVID) against fulfillment expense up only 9% FX-neutral, the gap that produced the record 13.1% consolidated margin. Robotics now deploys in every 2026 US large-format launch. Grocery passed $150B+ gross sales as the second-largest US grocer, with 1B+ same or next-day items YTD.' },
        { topic:'Capex $44.2B and memory that "skyrocketed"', theme:'Capex',
          body:'Q1 capex was $44.2B (the call quoted $43.2B cash), primarily AWS and generative AI. Olsavsky said memory component costs have "skyrocketed", with allocations locked with strategic suppliers in mid-to-late 2025. The framing matters because scarcity is accelerating enterprise cloud migration rather than capping Amazon\'s own build.' },
        { topic:'LEO nears commercial service', theme:'LEO',
          body:'Amazon LEO passed 250+ satellites with commercial service targeted for Q3 2026 and commitments from Delta, JetBlue, AT&T, Vodafone, DIRECTV LatAm, NBN, NASA and Apple. The near-term cost is ~$1B YoY landing in Q2, with capitalization beginning Q4, so the revenue line still sits ahead of the cost line.' },
      ],
      qanda:[
        { q:'Capacity against the backlog: can AWS keep up with contracted demand?', analyst:'Eric Sheridan · Goldman Sachs', theme:'Backlog',
          a:'Jassy called it a "once-in-a-lifetime opportunity" and declined to give new capex guidance, while saying he expects significant deployment. He argued that owning the chips (Graviton and Trainium) is what positions AWS to meet the inflection without being gated on third-party supply.' },
        { q:'Backlog breadth and whether third-party agents threaten Rufus', analyst:'Brian Nowak · Morgan Stanley', theme:'Advertisement',
          a:'Jassy said the backlog is broad rather than concentrated. On agents, he reported Rufus MAU up 115% and engagement up 400%, and argued third-party agents mis-price and lack personalization, so the retailer\'s own assistant wins the shopping surface.' },
        { q:'OpenAI in Bedrock, and selling Trainium racks externally', analyst:'Justin Post · Bank of America', theme:'Custom silicon',
          a:'Jassy noted GPT-5.4 is live in Bedrock with 5.5 due in a couple of weeks. On external rack sales he called it "very much a possibility" over the next couple of years, with the caveat that current supply is fully allocated to training, so it is optionality rather than a committed plan.' },
        { q:'LEO economics and the launch cadence', analyst:'Chris Sanderson · Loop Capital', theme:'LEO',
          a:'Jassy cited 2x downlink and 6x uplink versus incumbents, 20+ launches in 2026 and 30+ in 2027, and framed LEO as "a very large, many-billion-dollar revenue business" with an AWS-like path from heavy capex to free cash flow.' },
        { q:'Memory inflation, and advertising inside agentic commerce', analyst:'Amit Khajuria · Wolfe Research', theme:'Advertisement',
          a:'Jassy said allocations were locked with strategic suppliers in mid-to-late 2025, so the scarcity accelerates cloud migration rather than stalling the build. On ads he said "we are going to like this for advertising," because sponsored prompts work and multi-turn conversations create more surfaces, not fewer.' },
        { q:'Which demand segments lead, and how internal AI changes the cost base', analyst:'Colin Sebastian · Baird', theme:'Backlog',
          a:'Jassy split demand between labs and enterprise production, saying enterprise production may end up the largest and most durable. As proof of the internal leverage he cited a service engine rebuilt in 65 days versus 40-50 person-years, calling it "a very different world of operating."' },
      ],
      dots:'Every thread of the quarter is the same sentence from a different angle: demand is contractually pre-sold (backlog, Anthropic, Trainium commitments), so the binding constraint moved to SUPPLY — memory, power, racks — and the costs of building it (capex, LEO, SBC). The record margin says the model absorbs it so far; the Q2 guide says management wants room in case it does not.',
      threeMinutes:[
        '<b>The demand question died this quarter.</b> AWS +28% (fastest in 15 quarters), backlog $364B excluding a $100B+ Anthropic deal, $225B of Trainium commitments. Whatever the bears say about the spend, the revenue is contracted.',
        '<b>The new question is supply and its cost.</b> Memory "skyrocketed", capacity installs 6–24 months before billing, and Q2 carries SBC + $1B of LEO. The guide midpoint below the Q1 print is caution, not deterioration.',
        '<b>The margin record was structural.</b> Units +15% vs fulfillment cost +9%, robotics everywhere, a service rebuilt in 65 days. The efficiency flywheel is the quiet half of the AI story.',
      ],
      notBringing:[
        { item:'EPS $2.78 (+70% beat)', why:'~$16.8B of Anthropic marks inside it — leading with it misreads the quarter. Op income is the honest line.' },
        { item:'Prime Video box office / NFL records', why:'Great colour, already priced as "large and profitable" — nothing to argue.' },
        { item:'Quro/Transform/Qwik adoption stats', why:'Real, but the tradeable lines are AWS growth, backlog conversion and the capex bill.' },
      ],
      newQuestions:[
        { n:'Does AWS accelerate AGAIN (Street +31%) with backlog converting?', landed:{ q:'Q2 2026', rank:1 } },
        { n:'What does memory inflation do to the ~$200B frame / AWS margin?', landed:{ q:'Q2 2026', rank:2 } },
        { n:'Is 13.1% margin the peak or the base (SBC + LEO + fuel in the guide)?', landed:{ q:'Q2 2026', rank:3 } },
        { n:'Agentic commerce: do Rufus numbers keep compounding into ads?', landed:{ q:'Q2 2026', rank:4 } },
        { n:'Trainium rack sales — from "possibility" to plan?', landed:{ q:'Q2 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Feb 5, 2026) ──
  { q:'Q4 2025', status:'reported', date:'February 5, 2026',
    setup:{
      source:'Refinitiv/LSEG pre-print consensus (via js/results-data/amzn.js) — the number that stood going in', asOf:'2026-01',
      notes:{
        'EPS (diluted)':{ t:'The one line that did not beat', h:'<p>Consensus $1.97 vs a $1.95 print — the only miss on the card, and it is the charges: the quarter carries <b>$2.4B of special items</b> ($1.1B Italy tax settlement, $730M severance, $610M store impairments).</p>' }
      },
      us:{ 'Revenue':{v:213.4}, 'Operating income':{v:25.4}, 'AWS net sales':{v:35.1}, 'North America':{v:128.3}, 'International':{v:49.9} },
      debate:{ rows:null, synth:'Going in: the holiday quarter had to prove AWS\'s +34%→? re-acceleration was real and set a credible 2026 spend frame — with the tape braced for a very large capex number.' },
      pricedIn:'A record holiday quarter (units, ads, same-day records) with AWS re-accelerating past +24%; the open question was the SIZE of the 2026 capex frame and whether guidance would absorb it without breaking the margin story.',
      oneLiner:'The bar was "cap the year, frame the spend" — Amazon beat on revenue and AWS, then dropped the ~$200B capex number that repriced the whole debate; the soft Q1 guide did the rest (stock dipped despite the beat).' },
    results:{
      headline:'A record holiday close (revenue $213.4B, AWS +24% at a 13-quarter high, backlog $244B) — overshadowed by the ~$200B FY26 capex frame and a soft Q1 guide.',
      notes:{
        'Revenue':{ t:'Above the top of the guide', h:'<p><b>$213.4B (+12% ex-FX)</b> vs $211.3B consensus and a $206–213B guide — above the top for the 10th time in 13 prints. Paid units +12% (best of 2025); 3P units 61% of the total.</p>' },
        'Operating income':{ t:'$25.0B WITH $2.4B of charges', h:'<p>$25.0B against a $21–26B guide — <b>ex the $2.4B of special charges</b> (Italy tax $1.1B · severance $730M · store impairments $610M), ~$27.4B, above the top. NA margin 9% (from 8%); International 2.1%.</p>' },
        'EPS (diluted)':{ t:'The charges line', h:'<p>$1.95 vs $1.97 — GAAP grazed under on the special items; operationally a beat. TTM free cash flow $11.2B — the number the ~$200B capex frame then made the story.</p>' },
        'Capex':{ t:'The number that repriced the year', h:'<p>Q4 capex $39.5B; FY25 $131.8B. The news: <b>"about $200 billion" for 2026, "predominantly in AWS"</b> — the frame that sent the Summit model\'s FY26 capex from $151B to $205B (+36%) at the next snapshot and flipped its FY26 FCF forecast negative.</p>' },
        'AWS net sales':{ t:'+24% — 13-quarter high, 35% margin', h:'<p><b>$35.6B (+24%)</b> vs $34.9B consensus, $142B run-rate, margin 35% (+40bps). Backlog <b>$244B (+40% YoY, +22% QoQ)</b>. Added >1GW of capacity in Q4 — "more than any other company in the world" for 2025; 3.99GW of power added in the year, doubling again by 2027.</p>' },
        'Advertising':{ t:'$21.3B (+22%)', h:'<p>$12B of incremental ad revenue in 2025; Prime Video ads at 315M viewers in 16 countries; TNF most-streamed NFL season on record.</p>' }
      },
      watch:{ 'Capex':1, 'AWS net sales':2, 'Revenue':3 },
      thesisCheck:[
        { line:'AWS re-acceleration stalls', tripped:false, note:'+24%, a 13-quarter high, with backlog +40% and 35% margin — the acceleration thesis held and compounded.' },
        { line:'The 2026 spend frame breaks the FCF story', tripped:true, note:'⚑ "~$200B, predominantly AWS" against $11.2B of TTM FCF — the model flipped FY26 FCF negative at the next snapshot. Demand-led, but the red-line as written fired: the frame outran the cash.' },
        { line:'Holiday retail loses efficiency', tripped:false, note:'NA margin UP to 9% in the heaviest quarter; a million robots in the network; 8B+ same/next-day items (+30%).' },
        { line:'Custom silicon fails to scale', tripped:false, note:'$10B+ run-rate; Trainium triple-digit growth; Project Rainier at 500K chips for Anthropic\'s next Claude model; Trainium3 supply "nearly all committed by mid-2026".' },
      ],
      intoCall:[
        '💸 <b>~$200B</b> — composition, cadence, and what it does to FY26 FCF?',
        '☁️ <b>Backlog $244B (+40%)</b> — conversion pace vs capacity installs?',
        '🤖 <b>Rainier 500K chips → 1M?</b> — the Anthropic/Trainium flywheel.',
        '🛒 <b>Rufus 300M users, 60% completion lift</b> — does agentic commerce compress or expand the funnel?',
      ],
      priceReaction:'Stock dipped on the print despite the beats (coverage: revenue beat, stock down) — the ~$200B frame + the soft Q1 guide ($16.5–21.5B op income) set the tone.' },
    call:{
      take:'The quarter was a record; the CALL was about the bill — "~$200B, predominantly AWS" reframed 2026 before a single Q1 number printed.',
      highlights:[
        { tag:'watch', band:'lead', open:'Composition + cadence of the $200B — and what FY26 FCF looks like under it.',
          head:'The ~$200B frame: "predominantly in AWS, because we have very high demand" — against $11.2B of TTM FCF',
          detail:'<p>The single number that repriced the debate. Olsavsky\'s defense: "as fast as we install this capacity, this AI capacity, we are monetizing it. So it\'s just a very unusual opportunity." Power added: 3.99GW in 2025 (2x 2022), doubling again by 2027; >1GW landed in Q4 alone.</p>' },
        { tag:'thesis', band:'context',
          head:'AWS re-accelerated to +24% (13-quarter high) with backlog $244B (+40%) and a 35% margin',
          detail:'<p>$2.6B of sequential revenue growth — and Jassy pre-empted the concentration worry: the backlog\'s "vast majority [is] consumed by external customers", Amazon.com "always a very small fraction". Over a thousand AI applications deployed or building internally.</p>' },
        { tag:'thesis', band:'context',
          head:'The silicon ladder: $10B+ run-rate, Trainium triple-digit, Rainier at 500K chips "continuing to increase"',
          detail:'<p>Graviton grows >50% YoY and runs in >90% of the top-1,000 customers; Trainium2 at "30–40% better price-performance than comparable GPUs"; Trainium3 supply nearly all committed by mid-2026. The Anthropic partnership (next Claude model trains on Trainium2) is the anchor tenant.</p>' },
        { tag:'curious', band:'context',
          head:'Rufus at 300M customers with a +60% purchase-completion lift — the agentic-commerce moat argument, from the source',
          detail:'<p>Jassy\'s four-factor case (selection, price, speed, trust) for why the retailer\'s own agent wins; Rufus can now shop tens of millions of items in OTHER stores. Lens visual search +45%.</p>' },
        { tag:'watch', band:'logged',
          head:'$2.4B of special charges: Italy tax $1.1B · severance $730M · store impairments $610M',
          detail:'<p>The GAAP optics of the quarter (EPS $1.95 vs $1.97) — operationally a beat; the charges are the whole gap. Severance continues the leaner-org push.</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: 1M+ robots in the network · 8B+ same/next-day items (+30%) · Prime Video ads 315M viewers · Alexa+ free for Prime',
          detail:'<p>Everyday essentials now one of three units sold; America\'s lowest-priced retailer for the 9th straight year (14% below other majors); LEO at 180 satellites with 20+ launches planned for 2026.</p>' },
      ],
      // ③ THE CALL, CLASSIFIED — built from docs/calls/AMZN.md (Q4 2025, Feb 5). Objective tone, no em-dashes.
      prepared:[
        { topic:'AWS +24% and a backlog up 40%', theme:'Backlog',
          body:'Jassy called AWS the "fastest we have seen in thirteen quarters" at +24%, a $142B run-rate with a 35% margin. Backlog reached $244B, up 40% YoY and 22% QoQ. Amazon added more than 1GW of capacity in Q4 and 3.99GW of power across 2025 (twice 2022), with plans to double again by 2027. The read is that supply is being built directly against a contracted book.' },
        { topic:'Custom chips and Project Rainier', theme:'Custom silicon',
          body:'Custom chips passed a $10B+ run-rate with Trainium at triple-digit growth. Project Rainier put 500K chips to work training the next Claude model, and Jassy said "you will see that continuing to increase." Trainium3 supply is nearly all committed by mid-2026, and Graviton grew >50% across >90% of the top-1,000 customers.' },
        { topic:'The ~$200B capex frame', theme:'Capex',
          body:'Olsavsky set the number of the call: "about $200 billion in capital expenditures, predominantly in AWS, because we have very high demand." FY25 capex was $131.8B against $11.2B of TTM free cash flow, and the Summit model flipped FY26 FCF negative at its next snapshot. His defense: "as fast as we install this capacity, this AI capacity, we are monetizing it."' },
        { topic:'Retail scale and Rufus', theme:'Robotics',
          body:'Amazon was the lowest-priced US retailer for the 9th straight year (14% below other majors), with everyday essentials at one of three units and 8B+ same or next-day items (+30%). Rufus reached 300M customers in 2025, with users "60% more likely to complete a purchase" and able to shop tens of millions of items in other stores.' },
        { topic:'Advertising at a $21B quarter', theme:'Advertisement',
          body:'Advertising printed $21.3B (+22%), with $12B of incremental ad revenue across 2025 and Prime Video ads reaching 315M viewers. The engine keeps scaling alongside retail traffic rather than depending on it.' },
        { topic:'The $2.4B charges and operating leverage', theme:'Robotics',
          body:'Olsavsky walked through $2.4B of special charges: a $1.1B Italy tax settlement, $730M of severance and $610M of physical-store impairments, leaving ex-charge operating income near $27.4B. He also cited 1M+ robots in the network and perishables reaching 2,300+ cities as the efficiency base.' },
      ],
      qanda:[
        { q:'ROIC and duration of the AWS investment at a 35% margin', analyst:'Mark Mahaney · Evercore ISI', theme:'Margins',
          a:'Jassy pointed to the 35% AWS margin and said "we will see how that develops," declining to anchor a forward margin. The framing was that returns come from utilisation and silicon efficiency over the asset life rather than from a single quarter\'s print.' },
        { q:'Project Rainier at 500K chips and where it goes next', analyst:'Doug Anmuth · J.P. Morgan', theme:'Custom silicon',
          a:'Jassy confirmed the 500K-chip Rainier cluster training the next Claude model and said the number will keep increasing, tying the scale directly to committed Trainium demand rather than speculative capacity.' },
        { q:'How to think about the shape of the AI market', analyst:'Ross Sandler · Barclays', theme:'Backlog',
          a:'Jassy described the market as "barbelled" between labs and enterprise, and said enterprise production workloads "may end up being the largest and most durable" source of demand, which is the segment AWS is built to serve.' },
        { q:'Whether AI shopping assistants compress the ad funnel', analyst:'Michael Morton · MoffettNathanson', theme:'Advertisement',
          a:'Jassy answered with the Rufus data point that users are 60% more likely to complete a purchase, arguing that agentic surfaces expand rather than compress the funnel because they add shopping touchpoints.' },
        { q:'Fulfillment efficiency and network structure', analyst:'Brian Nowak · Morgan Stanley', theme:'Robotics',
          a:'Jassy cited the extension of regions from 8 to 10 and 1M+ robots in the network as the levers, framing efficiency as a structural change in cost per unit rather than a cyclical recovery.' },
        { q:'Who actually consumes the backlog', analyst:'Eric Sheridan · Goldman Sachs', theme:'Backlog',
          a:'Jassy said the "vast majority" of the backlog is consumed by external customers, addressing the concern that the book might be inflated by internal Amazon or Anthropic usage.' },
      ],
      dots:'The Q4 call planted 2026\'s two tensions in one breath: the ~$200B bill and the pre-sold demand that justifies it (backlog +40%, Rainier, Trainium commitments). Q1 2026 then resolved the demand side emphatically (+28%, $364B + Anthropic) — leaving the bill (memory costs, LEO, FCF) as the live wire into Q2.',
      threeMinutes:[
        '<b>The print was a record; the story was the frame.</b> Revenue and AWS beat again — then "~$200B, predominantly AWS" turned 2026 into a bill-vs-demand referendum before Q1 even started.',
        '<b>AWS demand is contractual, not narrative.</b> Backlog $244B (+40%), Rainier at 500K chips, Trainium3 supply committed through mid-2026. The question is installation speed, not appetite.',
        '<b>Watch the charges pattern.</b> $2.4B in Q4 after $4.3B in Q3 (FTC + severance) — two straight quarters of special items muddying GAAP; score ex-items or be scored by them.',
      ],
      notBringing:[
        { item:'The GAAP EPS "miss" ($1.95 vs $1.97)', why:'It is the $2.4B of charges; operationally the quarter beat. Leading with it misreads a record holiday.' },
        { item:'Streaming/NFL records', why:'Already priced; the ads line ($21.3B, +22%) carries the argument better.' },
        { item:'Grocery expansion detail', why:'Real strategic ground, but the meeting debate is the $200B and AWS conversion.' },
      ],
      newQuestions:[
        { n:'Does AWS keep accelerating into the $200B build?', landed:{ q:'Q1 2026', rank:1 } },
        { n:'What is the capex cadence and FCF path under the frame?', landed:{ q:'Q1 2026', rank:2 } },
        { n:'Does retail efficiency hold outside the holiday peak?', landed:{ q:'Q1 2026', rank:3 } },
        { n:'Rufus/agentic commerce: usage → dollars?', landed:{ q:'Q1 2026', rank:4 } },
        { n:'Rainier: 500K chips → 1M?', landed:{ q:'Q1 2026', rank:5 } },
      ],
    } },
]};


// ── The theme record — narrative threads across the recent calls (v2.3 fold-in) ──
var SRC_CALLS='Amazon Q4 2025–Q2 2026 earnings-call records (see docs/calls/AMZN*.md — 8-K exacts from SEC EDGAR; call record reconstructed from transcript coverage, verbatim IR transcripts pending from Dani). Contemporaneous highlights — written from each call, not with hindsight.';
// Segment divisions for the theme record (Aug 2026, AMZN only). Each theme carries a `seg`; the
// "By theme" view groups them under these headers, in this order. Empty themes (no `updates`) are
// tracked placeholders — the section exists so we can fill it as the notes come in.
var AMZN_SEG_ORDER=['Amazon US','Amazon International','AWS'];
var AMZN_THEMES=[
  // ── Amazon US ──────────────────────────────────────────────────────────────────────────────────
  { seg:'Amazon US', theme:'Agentic commerce', st:{ k:'watch', since:'Q4 2025', last:'Q2 2026' },
    why:'Whether AI compresses the shopping funnel or expands it — management argues the retailer\'s own agent wins.',
    updates:[
      { q:'Q4 2025', items:['Rufus: <b>300M customers</b> in 2025, users "<b>60% more likely to complete a purchase</b>"; can shop tens of millions of items in OTHER stores.'] },
      { q:'Q1 2026', items:['Rufus MAU <b>+115%</b>, engagement +400%; "we\'re going to like this for advertising" — sponsored prompts working, multi-turn = more surfaces.'] },
      { q:'Q2 2026', items:['The claim that agentic surfaces <b>expand rather than compress</b> the funnel keeps showing up in reported dollars (see <i>Advertisement</i>).'] },
    ]},
  { seg:'Amazon US', theme:'Advertisement', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'Management argues ads WIN in agentic commerce — the dollars are accelerating at a $20B quarterly scale.',
    updates:[
      { q:'Q4 2025', items:['Ads <b>$21.3B (+22%)</b>; Prime Video ads 315M viewers.'] },
      { q:'Q1 2026', items:['Ads <b>$17.2B (+22%)</b>; Netflix / Comcast / Samsung signed.'] },
      { q:'Q2 2026', items:['Advertising <b>$19.8B (+26%)</b> — an <b>acceleration</b> from +22%, at a $20B quarterly scale, with <b>sponsored products</b> named as the driver.','The next audit is structural: Q3 loses the Prime-Day event to the comp, so holding 25%+ would separate the engine from the calendar.'] },
    ]},
  { seg:'Amazon US', theme:'Robotics — the efficiency flywheel', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'The quiet half of the AI story: unit growth outpacing fulfillment cost growth is what pays for the build without breaking margins.',
    updates:[
      { q:'Q4 2025', items:['<b>1M+ robots</b> in the network; 8B+ items same/next-day (+30%); NA margin 9% in the holiday peak; regions extended 8 → 10.'] },
      { q:'Q1 2026', items:['Units <b>+15% vs fulfillment expense +9%</b>; record 13.1% consolidated margin; robotics in every 2026 US large-format launch; a service engine rebuilt in <b>65 days vs 40–50 person-years</b>.'] },
      { q:'Q2 2026', items:['A <b>new consolidated margin record: 13.7%</b> — set while absorbing the seasonal SBC step-up, ~$1B of LEO cost and fuel inflation the guide had flagged. Paid units <b>+17%</b>.','Fast commerce is where the flywheel now shows: <b>same-day perishables customers +50%</b> since January, and same-day orders carrying <b>3x the units</b> per order. Roughly <b>$600M of tariff-related refunds</b> landed as one-off relief inside the North America margin.'] },
    ]},
  // ── Amazon International ────────────────────────────────────────────────────────────────────────
  { seg:'Amazon International', theme:'Margin', st:{ k:'watch' },
    why:'International segment profitability — the emerging-market drag and its path to sustained margin. To track.',
    updates:[] },
  { seg:'Amazon International', theme:'Expansion comments', st:{ k:'watch' },
    why:'Country build-out and emerging-market expansion notes from the calls. To track.',
    updates:[] },
  // ── AWS ────────────────────────────────────────────────────────────────────────────────────────
  { seg:'AWS', theme:'Backlog', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'From +24% to +37% (fastest in 18 quarters) with the forward book compounding faster than revenue converts.',
    updates:[
      { q:'Q4 2025', items:['<b>+24%</b> (13-quarter high), $142B run-rate; backlog <b>$244B (+40%)</b>; >1GW added in Q4; 3.99GW of power added in 2025, doubling again by 2027.'] },
      { q:'Q1 2026', items:['<b>+28%</b> ($150B run-rate) — "very unusual for a business to grow this fast on a base this large"; backlog <b>$364B</b> EXCLUDING the <b>$100B+ Anthropic deal</b>; Bedrock spend +170% QoQ; Q1 tokens exceeded all prior years combined.'] },
      { q:'Q2 2026', items:['<b>+37%</b> ($169B run-rate) — the <b>fastest in 18 quarters</b> and the third straight acceleration; backlog <b>$496B</b>, roughly <b>2.5x</b> a year ago and still growing triple-digit.','Capacity is the constraint, and it is pre-committed: <b>2027 "largely reserved"</b>, some <b>2028 "already spoken for."</b> The AI business and the chips business <b>each above a $25B run-rate</b>, both triple-digit. Jassy: AWS "can be a trillion-dollar annual revenue business."'] },
    ]},
  { seg:'AWS', theme:'Capex', st:{ k:'watch', since:'Q4 2025', last:'Q2 2026' },
    why:'The number that reprices the stock: a ~$220B capex year against negative TTM FCF, defended with contracted demand.',
    updates:[
      { q:'Q4 2025', items:['"About <b>$200 billion</b> in capital expenditures… predominantly in AWS, because we have very high demand." TTM FCF $11.2B; the Summit model flipped FY26 FCF negative at its next snapshot. Olsavsky: "as fast as we install this capacity… we are monetizing it."'] },
      { q:'Q1 2026', items:['Q1 capex <b>$44.2B</b>; memory costs "<b>skyrocketed</b>" — allocations locked with strategic suppliers mid-to-late 2025.'] },
      { q:'Q2 2026', items:['The frame moved: FY26 cash capex <b>~$200B → ~$220B</b>, Olsavsky attributing part of the raise to the "<b>higher cost of memory</b>". Q2 capex <b>$54.2B</b> gross (1H26 $98.4B).','⚑ The cash line broke: <b>TTM free cash flow −$7.6B</b> (from +$18.2B a year ago) against $161.4B of TTM operating cash flow — funded with <b>$67B of new long-term debt</b> in one half ($65.6B → $128.9B). The Q4-2025 red line fired in reported actuals.'] },
    ]},
  { seg:'AWS', theme:'Margins', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'AWS segment profitability — expanding even through the AI build, helped by custom silicon and (in Q2) energy-derivative gains.',
    updates:[
      { q:'Q4 2025', items:['Segment margin <b>35%</b> (+40bps).'] },
      { q:'Q2 2026', items:['Segment margin <b>39.4%</b> (+650bps YoY, ~+520bps excluding energy-derivative gains).'] },
    ]},
  { seg:'AWS', theme:'Useful lives & Data Center Lifecycles', st:{ k:'watch', since:'Q1 2026', last:'Q1 2026' },
    why:'How Amazon depreciates the build: the install-to-billing lag and asset lives set the margin optics of the capex cycle.',
    updates:[
      { q:'Q1 2026', items:['Capacity installs <b>6–24 months before billing</b>; data centers <b>30+ year</b> assets, chips <b>5–6</b>.'] },
    ]},
  { seg:'AWS', theme:'Custom silicon — Graviton, Trainium, Rainier', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'The margin lever under the AI build — and possibly a merchant business (rack sales) with NVIDIA-adjacent economics.',
    updates:[
      { q:'Q4 2025', items:['$10B+ run-rate; Trainium at triple-digit growth; <b>Project Rainier: 500K chips</b> training the next Claude model; Trainium3 "nearly all supply committed by mid-2026"; Graviton >50% growth, >90% of top-1,000 customers.'] },
      { q:'Q1 2026', items:['Run-rate doubled to <b>$20B (+~40% QoQ)</b>; <b>$225B+ Trainium revenue commitments</b>; Trainium4 largely reserved ~18 months out; rack sales "<b>very much a possibility</b>"; Meta committed to tens of millions of Graviton cores.'] },
      { q:'Q2 2026', items:['The chips business passed a <b>$25B annualized run-rate</b>, growing triple-digit — and the tenant list stopped being a concentration argument: <b>Anthropic AND OpenAI</b> are each making <b>multi-year, multi-gigawatt</b> Trainium commitments. <b>Graviton5</b> reached general availability.','The merchant question survives the quarter: Nowak asked about Trainium sales into third-party data centres, and the answer stayed short of a plan.'] },
    ]},
];
// A note's quarter is inside a sub-theme's tracking window when Since ≤ q ≤ Until (open bounds when
// unset). Setting "Since" therefore shows the notes only from that quarter onward; "Until" caps them.
function amznInWindow(q, since, until){
  var n=ceQnum(q); if(n==null) return true;
  if(since){ var s=ceQnum(since); if(s!=null && n<s) return false; }
  if(until){ var u=ceQnum(until); if(u!=null && n>u) return false; }
  return true;
}
// The tracking window is a GLOBAL filter on the record view (below the By-theme/By-quarter toggle),
// not per sub-theme. Setting Since/Until narrows every sub-theme's notes to that quarter range.
var _recSince=null, _recUntil=null;
var _recHook='all';   // record hook filter (below the Since filter): all | open | closed
function amznWinUpdates(ct){ return (ct.updates||[]).filter(function(u){ return amznInWindow(u.q, _recSince, _recUntil); }); }
function amznHookMatch(ct){ if(_recHook==='open') return amznHookOpen(ct); if(_recHook==='closed') return amznHookClosed(ct); return true; }
function amznThemeQuarters(){ var seen={}, out=[]; AMZN_THEMES.forEach(function(ct){ (ct.updates||[]).forEach(function(u){ if(!seen[u.q]){ seen[u.q]=1; out.push(u.q); } }); }); return out; }
function amznCallsByQuarter(){
  var map={}, order=[];
  AMZN_THEMES.forEach(function(ct){ if(!amznHookMatch(ct)) return; amznWinUpdates(ct).forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, seg:ct.seg, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}
// The theme record (rendered inside the Watch List, v2.3) — compact contract renderer.
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    /* By-quarter: segment sub-headers + per-theme cards */
    '.calls-qseg{display:flex;align-items:center;gap:7px;font-size:9.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:'+BRAND+';margin:16px 0 8px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
    '.calls-qseg:first-child{margin-top:2px}'+
    '.calls-qseg-n{font-size:9px;font-weight:800;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:1px 7px}'+
    '.calls-qrow{border-left:2px solid var(--bdr);padding:1px 0 1px 11px;margin:0 0 11px}'+
    '.calls-qrow:hover{border-left-color:'+BRAND+'}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}'+
    /* segment divisions (Amazon US / International / AWS) — each a dropdown over its themes, */
    /* styled to match the By-quarter accordion (.lpb-acc-item / .lpb-acc-h / .lpb-acc-ic). */
    '.calls-seg-group{border:1px solid var(--bdr);border-radius:10px;overflow:hidden;background:var(--w)}'+
    '.calls-seg-group.open{border-color:'+BRAND+'}'+
    '.calls-seg{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:none;border:none;cursor:pointer;padding:14px 16px;font-family:\'Inter\',sans-serif;font-size:13.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--navy);text-align:left}'+
    '.calls-seg:hover{color:'+BRAND+'}.calls-seg-group.open>.calls-seg{color:'+BRAND+'}'+
    '.calls-seg-l{display:inline-flex;align-items:baseline;gap:9px}'+
    '.calls-seg-n{font-size:9.5px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--mu)}'+
    '.calls-seg-ic{flex:none;width:22px;height:22px;border-radius:50%;background:var(--brand-soft);color:'+BRAND+';font-weight:800;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center}'+
    '.calls-seg-body{display:none;padding:2px 14px 14px;flex-direction:column;gap:10px}'+
    '.calls-seg-group.open>.calls-seg-body{display:flex}'+
    '.calls-empty{font-size:11.5px;color:var(--mu);font-style:italic;border:1px dashed var(--bdr);border-radius:8px;padding:9px 12px;background:#FAFBFD}'+
    '.rec-editbtn{margin-top:6px;font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+BRAND2+';background:var(--w);color:'+BRAND2+';padding:5px 12px;border-radius:999px;cursor:pointer}'+
    '.rec-editbtn:hover{background:rgba(20,110,180,0.06)}'+
    '.rec-edit{margin-top:10px}'+
    '.calls-trk{font-size:8.5px;font-weight:800;letter-spacing:.02em;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;white-space:nowrap;flex:none}'+
    '.calls-trk.closed{color:'+RED+';border-color:rgba(234,67,53,0.35);background:rgba(234,67,53,0.06)}'+
    '.calls-trkbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:0 0 14px;padding:8px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;font-size:10.5px;font-weight:700;color:var(--mu)}'+
    '.calls-trkbar-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.calls-trkbar select{font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:8px;padding:4px 8px;background:var(--w);color:var(--navy);margin-left:5px}'+
    '.calls-trkbar select:focus{outline:none;border-color:'+BRAND+'}'+
    '.calls-trkbar-clr{font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.calls-trkbar-clr:hover{border-color:'+BRAND+';color:'+BRAND+'}'+
    '.calls-hookbar{margin:-6px 0 14px}'+
    '.calls-hookseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.calls-hookseg button{font:inherit;font-size:10px;font-weight:800;border:0;background:transparent;color:var(--mu);padding:4px 12px;border-radius:999px;cursor:pointer}'+
    '.calls-hookseg button.on{background:var(--navy);color:#fff}</style>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  // Global "Since" filter (applies to both views): show only notes from that quarter onward.
  var trkQ=amznThemeQuarters();
  h+='<div class="calls-trkbar"><span>Since <select data-rectrks>'+amznQuarterOpts(_recSince||'', '— all —', trkQ)+'</select></span>'+
     (_recSince?'<button type="button" class="calls-trkbar-clr" data-rectrkclear>clear</button>':'')+'</div>';
  // Hook filter (below Since): All / Open hooks / Closed — narrows which sub-themes show.
  h+='<div class="calls-hookbar"><span class="calls-hookseg">'+
       '<button type="button" class="'+(_recHook==='all'?'on':'')+'" data-rechook="all">All</button>'+
       '<button type="button" class="'+(_recHook==='open'?'on':'')+'" data-rechook="open">Open hooks</button>'+
       '<button type="button" class="'+(_recHook==='closed'?'on':'')+'" data-rechook="closed">Closed</button>'+
     '</span></div>';
  h+='<div class="lpb-acc" id="aCallsTheme">';
  AMZN_SEG_ORDER.forEach(function(seg,si){
    var group=AMZN_THEMES.filter(function(ct){ return ct.seg===seg && amznHookMatch(ct); });
    // Segments always render (even empty) so a newly added theme shows here immediately.
    // Segment is itself a dropdown (outer accordion): click the header to unfold its sub-themes.
    // All segments start COLLAPSED so the record opens clean.
    h+='<div class="calls-seg-group" data-seg="'+esc(seg)+'">';
    h+='<button type="button" class="calls-seg" data-segtog><span class="calls-seg-l">'+esc(seg)+' <span class="calls-seg-n">'+group.length+' theme'+(group.length===1?'':'s')+'</span></span><span class="calls-seg-ic">+</span></button>';
    h+='<div class="calls-seg-body">';
    if(!group.length) h+='<div class="calls-empty">'+(_recHook==='all'?'— no sub-themes yet. Use ✎ Edit below to add one.':'— no sub-themes match this filter.')+'</div>';
    group.forEach(function(ct){
      var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CE_THST[sk]||CE_THST.watch;
      h+='<div class="lpb-acc-item" data-theme="'+esc(ct.theme)+'"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+ceStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
      var key=ct.seg+'|'+ct.theme, editing=!!_recEditOpen[key];
      h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
      if(editing){
        h+=amznInlineEdit(ct);
      } else {
        var ups=amznWinUpdates(ct);
        if(ups.length){
          ups.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
        } else {
          h+='<div class="calls-empty">— to fill: no notes tracked yet for this theme.</div>';
        }
        h+='<button type="button" class="rec-editbtn" data-receditopen="'+esc(key)+'">✎ Edit / Add note</button>';
      }
      h+='</div></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=amznCallsByQuarter();
  h+='<div class="lpb-acc" id="aCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    // Group the quarter's themes by segment (Amazon US / International / AWS) so they read distinct.
    AMZN_SEG_ORDER.forEach(function(seg){
      var rows=byQ.map[q].filter(function(r){ return r.seg===seg; });
      if(!rows.length) return;
      h+='<div class="calls-qseg">'+esc(seg)+' <span class="calls-qseg-n">'+rows.length+'</span></div>';
      rows.forEach(function(row){ h+='<div class="calls-qrow"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-foot">'+SRC_CALLS+'</div>';
  return h;
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
    '.ce-qpills[hidden]{display:none}'+
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
  if(m.u==='%') return null;                           // a %-line IS a YoY rate — no growth-of-a-growth (AMZN ad KPIs)
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
      '</div>';
      b+='<div class="ce-evwrap" data-ev="cons" data-g="yoy">';
      b+='<div class="ce-row-cap">Headline — every company, always</div>'+ceGrid(u,'head');
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — AMZN</div>'+ceGrid(u,'cust');
      b+='</div>';
      // (The "debate" line-by-line block + its synth line were removed per request — Aug 2026.)
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    }
    // "The contemporaneous read" block (priced-in + one-liner) removed from Setup per Dani (Aug 2026).
    // The data (st.pricedIn / st.oneLiner) is kept in CALL_EARNINGS but no longer rendered here.
    b+='</div>';
    return b;
  }).join('');
  h+=ceAnnualBody();
  h+=ceConsensusEvoBody();
  return h;
}
// A2 · Consensus Estimate Evolution — how the Street's forward Revenue estimate has been REVISED
// across the Bloomberg quarterly snapshots (BBG_CONSENSUS.txt). Fixed FY (one line per fiscal year,
// the revision trend) ⇄ Rolling NTM (Σ next 4 forecast quarters). Revenue only for now; the module
// (js/consensus-evolution.js) is ticker/metric-agnostic so more slot in with the same data shape.
function ceConsensusEvoBody(){
  return '<div class="ce-cev" style="margin:22px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    consensusEvo.html('AMZN','rev')+'</div>';
}
function ceConsensusEvoRoot(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .ce-cev'); }
// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; AMZN does not, so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (AMZN_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit pending): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('AMZN_SETUP')+'</div>';
}
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'AMZN_SETUP');   // (kept name: called from buildSub / phase-tab wiring)
  var cev=ceConsensusEvoRoot(); if(cev && !cev._cevInit){ cev._cevInit=true; consensusEvo.init(cev, 'AMZN', 'rev'); } }
function wireCeAnnual(root){ /* the engine self-wires via initResults->wireResults; the chart builds on Setup visibility (gBuildCeAnnual). */ }

// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// v3.0 (Aug 2026): migrated to the SHARED engine (js/watchlist.js). We render a mount host here;
// wireCallEarnings mounts the engine into it with the company id + quarters. Persistence, sorting,
// tags and the delete rule all come from the engine (Supabase table company_themes) — no per-file
// WL_ROWS. The multi-year theme record stays below, folded in as before.
function ceWatchBody(c){
  var h=ceStyle();
  // ── FUSED: the full multi-year theme record (was the standalone Evolution ▸ Earnings Calls tab,
  // dissolved Jul 2026 — no two tabs on the same call highlights). Moved to the TOP of this sub-tab
  // (Aug 2026, AMZN only) — it now leads; the Watch List is folded in below it. ──
  h+='<div class="ce-band" style="--bc:'+BRAND+'"><span class="ce-band-i">▤</span><span class="ce-band-t">The theme record — every thread, across all calls</span><span class="ce-band-s">the multi-year backbone behind the hunt below (the former "Earnings Calls" tab, folded in)</span><span class="ce-band-l"></span></div>';
  // Wrapped so the editor below can re-render it in place when a theme / sub-theme is added.
  h+='<div data-amznrec>'+callsBody()+'</div>';
  // ── The editing surface — a Theme → Sub-theme picker (AMZN-only). HIDDEN by default so the record
  // above reads clean; the button reveals it only when you want to add/update. Adding a theme or
  // sub-theme reflects in the record above immediately. ──
  h+='<style>.amzn-edit{margin-top:22px}'+
     '.amzn-edit-tog{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font:inherit;font-size:11px;font-weight:800;color:var(--mu);background:var(--w);border:1px dashed var(--bdr);border-radius:999px;padding:7px 15px;cursor:pointer;transition:.14s}'+
     '.amzn-edit-tog:hover{color:'+BRAND2+';border-color:'+BRAND2+'}'+
     '.amzn-edit[data-open="1"] .amzn-edit-tog{color:'+BRAND2+';border-style:solid;border-color:'+BRAND2+'}'+
     '.amzn-edit-ic{font-size:12px}'+
     '.amzn-edit-s{font-weight:600;font-style:italic;color:var(--mu);font-size:10px}'+
     '.amzn-edit-body{margin-top:16px;border-top:2px solid var(--bdr);padding-top:16px}'+
     '.amzn-edit-body[hidden]{display:none}'+
     /* the Theme → Sub-theme editor */
     '.aed-hint{font-size:11px;color:var(--navy);background:rgba(20,110,180,0.06);border:1px solid rgba(20,110,180,0.25);border-radius:9px;padding:8px 12px;margin:0 0 12px;line-height:1.5}'+
     '.aed-row{display:flex;align-items:flex-start;gap:10px;margin:0 0 12px}'+
     '.aed-lb{flex:none;width:78px;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);padding-top:6px}'+
     '.aed-pills{display:flex;gap:6px;flex-wrap:wrap;flex:1}'+
     '.aed-pill{font:inherit;font-size:11px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--navy);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
     '.aed-pill:hover{border-color:'+BRAND2+';color:'+BRAND2+'}.aed-pill.on{background:'+BRAND2+';color:#fff;border-color:'+BRAND2+'}'+
     '.aed-pill.sub.on{background:'+BRAND+';border-color:'+BRAND+';color:#fff}'+
     '.aed-add{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+BRAND2+';background:var(--w);color:'+BRAND2+';padding:5px 12px;border-radius:999px;cursor:pointer}'+
     '.aed-add:hover{background:rgba(20,110,180,0.06)}'+
     '.aed-win{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
     '.aed-win button{font:inherit;font-size:10px;font-weight:800;border:0;background:transparent;color:var(--mu);padding:4px 11px;border-radius:999px;cursor:pointer}'+
     '.aed-win button.on{background:var(--navy);color:#fff}'+
     '.aed-hookst{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);align-self:center}'+
     '.aed-hookst.open{color:'+BRAND2+'}.aed-hookst.closed{color:'+RED+'}'+
     '.aed-delseg{font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:4px 11px;border-radius:999px;cursor:pointer}'+
     '.aed-delseg:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-empty{font-size:10.5px;color:var(--mu);font-style:italic;padding:6px 0}'+
     '.aed-detail{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:10px;padding:12px 14px;background:#FAFBFD;margin-top:4px}'+
     '.aed-detail-h{font-size:13px;font-weight:800;color:var(--navy)}.aed-detail-seg{font-size:9.5px;font-weight:700;color:var(--mu);margin-left:8px}'+
     '.aed-why{font-size:11.5px;color:var(--mu);font-style:italic;margin:6px 0 8px;line-height:1.5}'+
     '.aed-notes{display:flex;flex-direction:column;gap:10px}.aed-note-q{display:inline-flex;align-items:center;gap:6px;font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(255,153,0,0.10);border-radius:20px;padding:2px 8px;margin-bottom:2px}'+
     '.aed-qgroup{border-top:1px dashed var(--bdr);padding-top:6px}'+
     '.aed-flb{display:block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 4px}'+
     '.aed-ta{width:100%;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);line-height:1.5;resize:vertical}'+
     '.aed-ta:focus,.aed-sel:focus,.aed-addnote input:focus{outline:none;border-color:'+BRAND2+'}'+
     '.aed-sel{font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:8px;padding:5px 8px;background:var(--w);color:var(--navy)}'+
     '.aed-track{display:flex;gap:16px;flex-wrap:wrap;align-items:center;font-size:10px;font-weight:700;color:var(--mu)}'+
     '.aed-note-row{display:flex;align-items:flex-start;gap:8px;padding:4px 0;font-size:12px;line-height:1.5}.aed-note-row>span{flex:1}'+
     '.aed-del{flex:none;font:inherit;font-size:11px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);width:20px;height:20px;border-radius:6px;cursor:pointer;line-height:1}'+
     '.aed-del:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-ed{flex:none;font:inherit;font-size:10px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);width:20px;height:20px;border-radius:6px;cursor:pointer;line-height:1}'+
     '.aed-ed:hover{border-color:'+BRAND2+';color:'+BRAND2+'}'+
     '.aed-mini{font:inherit;font-size:10.5px;font-weight:800;border:1px solid '+BRAND2+';background:'+BRAND2+';color:#fff;padding:6px 12px;border-radius:8px;cursor:pointer}'+
     '.aed-mini.alt{background:var(--w);color:'+BRAND2+'}.aed-mini:hover{filter:brightness(1.06)}'+
     '.aed-addnote{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:8px}'+
     '.aed-addnote input{flex:1;min-width:180px;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:6px 9px;background:var(--w);color:var(--navy)}'+
     '.aed-frow{display:flex;gap:8px;align-items:center;margin-top:10px}'+
     '.aed-delsub{margin-left:auto;font:inherit;font-size:9.5px;font-weight:800;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
     '.aed-delsub:hover{border-color:'+RED+';color:'+RED+'}'+
     '.aed-note ul{margin:2px 0 0;padding-left:18px;font-size:12px;line-height:1.55}</style>';
  h+='<div class="amzn-edit" data-amznedit data-open="0">'+
       '<button type="button" class="amzn-edit-tog" data-amzneditog aria-expanded="false"><span class="amzn-edit-ic">✎</span> Edit notes &amp; tracking <span class="amzn-edit-s">— opens only to add/update a theme or sub-theme</span></button>'+
       '<div class="amzn-edit-body" hidden><div data-amzneditor></div></div>'+
     '</div>';
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
// ── The print AT A GLANCE — a diverging surprise chart (Aug 2026). The cards give absolute values on
// each metric's own scale; this normalizes EVERY metric to a single % axis (surprise = actual/expected
// − 1), so revenue, EPS, AWS and capex line up on the same ruler. Green beats grow right, red misses
// grow left, ranked by |Street surprise| like the cards. Both bases are baked in and toggled by the
// same data-ev (vs Street ⇄ vs Summit) as the cards, so one control drives both views. Outliers past
// the axis (an EPS mark) clamp to the edge with a ▸ and print their true number.
function cePrintChartRows(qi, us){
  us=us||{};
  return CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;
    if(c==null&&a==null&&uexp==null) return null;
    var cS=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uS=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    return { k:m.k, cS:cS, uS:uS };
  }).filter(Boolean);
}
function cePrintChart(qi, us){
  var rows=cePrintChartRows(qi, us);
  var withSurp=rows.filter(function(r){ return r.cS!=null||r.uS!=null; });
  if(withSurp.length<2) return '';
  // Axis scale ignores outliers over 50% (e.g. an EPS mark) so one big number does not flatten the rest.
  var mags=[];
  withSurp.forEach(function(r){ [r.cS,r.uS].forEach(function(v){ if(v!=null && Math.abs(v)<=50) mags.push(Math.abs(v)); }); });
  var axisMax=Math.max(8, Math.ceil(mags.length?Math.max.apply(null,mags):8));
  rows=rows.slice().sort(function(a,z){ return Math.abs(z.cS==null?-1:z.cS) - Math.abs(a.cS==null?-1:a.cS); });
  // Bar lives in a bounded track (no floating labels); the number sits in its own right column, so
  // nothing overflows and every metric name gets a full column. Bar width caps at the axis.
  function bar(v, cls){
    if(v==null) return '<span class="ce-dv-dot '+cls+'" title="no surprise on this basis"></span>';
    var k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    var w=Math.min(Math.abs(v),axisMax)/axisMax*50;
    return '<span class="ce-dv-bar '+cls+' '+(v>=0?'pos':'neg')+' '+k+'" style="width:'+w.toFixed(1)+'%"></span>';
  }
  function val(v, cls){
    if(v==null) return '<span class="ce-dv-v '+cls+' none">—</span>';
    var over=Math.abs(v)>axisMax, k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    return '<span class="ce-dv-v '+cls+' '+k+'">'+(v>=0?'+':'−')+(Math.round(Math.abs(v)*10)/10)+'%'+(over?'▸':'')+'</span>';
  }
  var rowsHtml=rows.map(function(r){
    return '<div class="ce-dv-row">'+
      '<span class="ce-dv-k" title="'+esc(r.k)+'">'+esc(r.k)+'</span>'+
      '<span class="ce-dv-track"><span class="ce-dv-zero"></span>'+bar(r.cS,'ce-exp-cons')+bar(r.uS,'ce-exp-us')+'</span>'+
      '<span class="ce-dv-vwrap">'+val(r.cS,'ce-exp-cons')+val(r.uS,'ce-exp-us')+'</span>'+
    '</div>';
  }).join('');
  return '<div class="ce-dv">'+
    '<div class="ce-dv-cap">Every metric on one surprise axis, so different scales line up. '+
      'Reading <b class="ce-exp-cons">vs Street</b><b class="ce-exp-us">vs Summit</b>: green beats grow right, red misses grow left. A ▸ means the surprise runs past the axis.</div>'+
    '<div class="ce-dv-rows">'+rowsHtml+'</div>'+
    '<div class="ce-dv-axis"><span>−'+axisMax+'%</span><span>in line</span><span>+'+axisMax+'%</span></div>'+
  '</div>';
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
    // watch[m.k] is the frozen Watch-List RANK. The theme text now lives in the shared DB
    // engine, so the chip shows the rank; the theme name is on the Watch List itself.
    var wrRank=watch[m.k];
    var wr=wrRank?('Watch #'+wrRank):null;
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
        (wr?'<div class="ce-fz-wl" title="On the frozen Notes list: '+esc(wr)+'">on the list</div>':'')+
        (qb?'<div class="ce-fz-more">＋ detail</div>':'')+
      '</div>' };
  }).filter(Boolean);
  if(!tiles.length) return '';
  tiles.sort(function(x,z){ return z.sort-x.sort; });   // biggest surprise first (Street basis)
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="off" data-view="cards"><div class="ce-fz-h">The print — ranked by surprise'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from <code>BBG_CONSENSUS.txt</code>: the last snapshot before the print carries the consensus (<code>fq+1</code>), a later snapshot carries the print (<code>fq0</code>). Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>vs Street ⇄ vs Summit</b> — swaps which frozen expectation the print is scored against (Street = Bloomberg, Summit = ours). No "Both" — one basis at a time. Where Summit had no number, Summit view reads <b>no est.</b></li>'+
      '<li><b>Margin</b> — GP / Operating income / EBITDA carry an expected-vs-realized margin (the estimate-implied margin → the print\'s own), Δ in pts. No YoY/QoQ on the margin.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise; <b>no est.</b> where that basis had no number</li>'+
      '<li><b>on the list</b> — this line was on the Notes we froze before the call</li></ul>'+
      '<p>Lines the archive does not track are not shown here — a disclosure with no consensus (e.g. an app-MAU rung) is a supplemental call note (below the scorecard), not a scored line.</p>')+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg" style="margin-left:auto"><button type="button" class="active" data-fzview="cards">Cards</button>'+
      '<button type="button" data-fzview="chart">Chart</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button></span>'+
    '<span class="ce-gseg"><button type="button" data-fzmm="on">Margin</button>'+
      '<button type="button" class="active" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div>'+cePrintChart(qi, us)+'<div class="ce-fz-g" data-vdf-host>'+tiles.map(function(t){ return t.html; }).join('')+'</div>'+
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
    '.ce-alsobox>summary.ce-alsobox-h{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:11px 13px;background:#F6F8FA}'+
    '.ce-alsobox>summary::-webkit-details-marker{display:none}'+
    '.ce-alsobox>summary.ce-alsobox-h:hover{background:#F0F4F8}'+
    '.ce-alsobox[open]>summary.ce-alsobox-h{border-bottom:1px solid var(--bdr)}'+
    '.ce-alsobox-ic{font-size:11px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-alsobox[open] .ce-alsobox-ic{transform:rotate(90deg)}'+
    '.ce-alsobox-htext{display:flex;flex-direction:column;gap:2px;min-width:0}'+
    '.ce-alsobox-htext>b{font-size:12px;color:var(--navy);font-weight:800}'+
    '.ce-alsobox-n{margin-left:auto;font-size:9px;font-weight:900;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:999px;padding:2px 9px;flex:none}'+
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
    /* AI call summary — collapsible outer box + always-visible lede + nested dropdowns + glossary */
    '.ce-sum{border:1px solid var(--bdr);border-radius:12px;background:#fff;margin:2px 0 14px}'+
    '.ce-sum>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:12px;background:linear-gradient(180deg,rgba(122,90,248,.06),transparent)}'+
    '.ce-sum>summary::-webkit-details-marker{display:none}'+
    '.ce-sum-ic{font-size:15px}'+'.ce-sum-h b{font-size:13px;color:var(--navy)}'+
    '.ce-sum-tag{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:'+PURPLE+';background:rgba(122,90,248,.12);border:1px solid rgba(122,90,248,.25);border-radius:999px;padding:2px 8px;margin-left:auto}'+
    '.ce-sum[open]>summary{border-bottom:1px solid var(--bdr);border-radius:12px 12px 0 0}'+
    '.ce-sum-body{padding:12px 15px 15px}'+
    '.ce-sum-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px}'+
    '.ce-sum-tt{font-size:10px;color:var(--mu);font-weight:600;margin-right:auto}'+
    '.ce-sum-btn{font-size:9.5px;font-weight:800;color:'+BLUE+';border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.12s}'+
    '.ce-sum-btn:hover{border-color:'+BLUE+';background:rgba(26,115,232,.06)}'+
    /* the summary IS the prose: visible punch paragraphs, each with its own "＋ more" expander */
    '.ce-sum-block{margin:0 0 13px}'+
    '.ce-sum-para{font-size:12.5px;line-height:1.7;color:var(--navy);font-weight:500;margin:0}'+
    '.ce-sum-more{border:0!important;background:transparent!important;border-radius:0;margin:5px 0 0}'+
    '.ce-sum-more>.ce-sum-nt{padding:2px 0;font-size:10px;font-weight:800;color:'+BLUE+';text-transform:none}'+
    '.ce-sum-more>.ce-sum-nt .ce-sum-caret{color:'+BLUE+'}'+
    '.ce-sum-more>.ce-sum-nb{padding:7px 0 4px 13px;border-left:2px dashed var(--bdr);margin-top:5px;font-size:11.5px;line-height:1.65}'+
    '.ce-sum-nodes{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sum-n{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;background:#FBFCFE}'+
    '.ce-sum-n[data-d="1"]{border-left-color:'+BRAND2+';background:#fff}'+
    '.ce-sum-n[data-d="2"]{border-left-color:'+AMBER+'}'+
    '.ce-sum-nt{list-style:none;cursor:pointer;display:flex;align-items:center;gap:7px;padding:8px 11px;font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sum-nt::-webkit-details-marker{display:none}'+
    '.ce-sum-caret{font-size:9px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-sum-n[open]>.ce-sum-nt .ce-sum-caret{transform:rotate(90deg)}'+
    '.ce-sum-nb{padding:0 12px 11px 21px;font-size:11px;line-height:1.65;color:var(--navy);font-weight:500}'+
    '.ce-sum-nb .ce-sum-nodes{margin-top:9px}'+
    /* glossary term — dashed underline, attractive hover tooltip (CSS-only, no pop-up) */
    '.ce-gl{border-bottom:1px dashed '+BLUE+';cursor:help;position:relative}'+
    '.ce-gl:hover::after{content:attr(data-def);position:absolute;left:0;bottom:calc(100% + 8px);width:min(300px,74vw);white-space:normal;text-align:left;background:#10141A;color:#fff;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 12px;border-radius:9px;box-shadow:0 10px 28px rgba(16,24,40,.28);z-index:60}'+
    '.ce-gl:hover::before{content:"";position:absolute;left:16px;bottom:calc(100% + 3px);border:5px solid transparent;border-top-color:#10141A;z-index:61}'+
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
    /* ② points for the call — merged red-lines + tee-ups, one strip */
    '.ce-pts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-pt{position:relative;border:1px solid var(--bdr);border-top:3px solid var(--pc,#9AA4B0);'+
      'border-radius:10px;padding:9px 11px 22px;background:#fff;transition:.14s}'+
    '.ce-pt[data-detail]{cursor:pointer}'+
    '.ce-pt[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-pt.held{--pc:#0a8f4c}'+
    '.ce-pt.trip{--pc:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-pt.tee{--pc:'+AMBER+'}'+
    '.ce-pt-top{margin-bottom:5px}'+
    '.ce-pt-chip{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;'+
      'padding:2px 7px;border-radius:999px;color:#fff;background:var(--pc)}'+
    '.ce-pt-chip.tee{background:'+AMBER+';color:#5A4300}'+
    '.ce-pt-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-pt-more{position:absolute;left:11px;bottom:7px;font-size:9px;font-weight:800;color:'+BLUE+'}'+
    /* ③ the call, classified — Prepared Remarks ⇄ Q&A toggle */
    '.ce-cc{margin-top:16px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    '.ce-cc-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-h>b{font-size:12px;color:var(--navy)}'+
    '.ce-cc-ph{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);border:1px dashed var(--bdr);border-radius:999px;padding:2px 8px}'+
    '.ce-cc-seg{margin-left:auto;display:inline-flex;gap:3px;background:rgba(66,133,244,.08);border:1px solid var(--bdr);border-radius:9px;padding:3px}'+
    '.ce-cc-seg button{background:none;border:0;font-family:inherit;font-size:10px;font-weight:800;letter-spacing:.03em;color:var(--mu);padding:5px 11px;border-radius:6px;cursor:pointer;transition:.14s}'+
    '.ce-cc-seg button:hover{color:var(--navy)}'+
    '.ce-cc-seg button.active{background:'+BRAND+';color:#fff}'+
    '.ce-cc-pane{display:flex;flex-direction:column}'+
    '.ce-cc-pane[hidden]{display:none}'+
    '.ce-cc-row{border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-row:last-child{border-bottom:0}'+
    '.ce-cc-row-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 13px;cursor:pointer;list-style:none}'+
    '.ce-cc-row-h::-webkit-details-marker{display:none}'+
    '.ce-cc-row-h:hover{background:#FAFBFD}'+
    '.ce-cc-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-cc-row[open]>.ce-cc-row-h .ce-cc-ar{transform:rotate(180deg)}'+
    '.ce-cc-topic{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.45}'+
    '.ce-cc-tag{font-size:8.5px;font-weight:800;letter-spacing:.03em;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:2px 8px;white-space:nowrap}'+
    '.ce-cc-meta{font-size:9.5px;font-weight:700;color:var(--mu);margin-bottom:4px}'+
    '.ce-cc-row-b{font-size:10.5px;color:var(--navy);line-height:1.55;padding:0 13px 11px;font-weight:500;background:#FBFCFE}'+
    '.ce-cc-a-l{display:inline-block;font-size:8px;font-weight:900;color:#fff;background:var(--mu);border-radius:4px;padding:1px 5px;margin-right:6px;vertical-align:middle}'+
    '.ce-cc-empty{padding:16px 14px;font-size:10.5px;color:var(--mu);font-weight:600;line-height:1.5;text-align:center;background:#FBFCFE}'+
    /* By Analyst Question — bank leads, analyst beside it; Q and A BOTH always visible */
    '.ce-cc-qa{padding:11px 13px;border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-qa:last-child{border-bottom:0}'+
    '.ce-cc-qa-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}'+
    '.ce-cc-bank{font-size:11px;font-weight:900;color:var(--navy);letter-spacing:.01em}'+
    '.ce-cc-analyst{font-size:10px;font-weight:600;color:var(--mu)}'+
    '.ce-cc-q,.ce-cc-a{display:grid;grid-template-columns:16px 1fr;gap:8px;font-size:11px;line-height:1.55;margin-top:4px;color:var(--navy)}'+
    '.ce-cc-q{font-weight:600}.ce-cc-a{font-weight:500}'+
    '.ce-cc-ql,.ce-cc-al{font-size:8px;font-weight:900;color:#fff;border-radius:4px;width:15px;height:15px;display:flex;align-items:center;justify-content:center;margin-top:2px}'+
    '.ce-cc-ql{background:'+BLUE+'}.ce-cc-al{background:#0a8f4c}'+
    /* ③b Propose Notes — Theme ▸ Sub-theme filing, target line, existing/NEW badges */
    '.ce-tp{border-top:1px solid var(--bdr);background:#FCFCFF;padding:12px 13px}'+
    '.ce-tp-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-tp-ic{font-size:13px}.ce-tp-h>b{font-size:11.5px;color:var(--navy)}'+
    '.ce-tp-refresh{font-family:inherit;font-size:9px;font-weight:800;color:'+BLUE+';border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;cursor:pointer;background:#fff;transition:.12s}'+
    '.ce-tp-refresh:hover{border-color:'+BLUE+';background:rgba(26,115,232,.06)}'+
    '.ce-tp-subtitle{font-size:9.5px;color:var(--mu);font-weight:600;flex-basis:100%;line-height:1.4}'+
    '.ce-tp-list{display:flex;flex-direction:column;gap:7px}'+
    '.ce-tp-card{border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:8px 9px;background:#fff}'+
    '.ce-tp-row1{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}'+
    '.ce-tp-rank{font-size:8.5px;font-weight:900;color:'+PURPLE+';background:rgba(122,90,248,.10);border-radius:999px;padding:2px 7px;flex:none}'+
    '.ce-tp-fld{display:flex;align-items:center;gap:5px;min-width:0}'+
    '.ce-tp-lb{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);flex:none}'+
    '.ce-tp-seg,.ce-tp-sub{min-width:0;max-width:210px;font-family:inherit;font-size:10px;font-weight:700;color:'+BLUE+';border:1px solid var(--bdr);border-radius:6px;padding:4px 6px;background:#F7F9FC;cursor:pointer}'+
    '.ce-tp-seg:focus,.ce-tp-sub:focus{outline:none;border-color:'+BLUE+'}'+
    '.ce-tp-newsub{display:block;width:100%;box-sizing:border-box;font-family:inherit;font-size:10.5px;font-weight:600;color:var(--navy);border:1px solid '+AMBER+';border-radius:6px;padding:5px 8px;background:#FFFDF7;margin-bottom:6px}'+
    '.ce-tp-newsub[hidden]{display:none}'+
    '.ce-tp-target{font-size:9.5px;font-weight:700;color:var(--navy);margin-bottom:6px;display:flex;align-items:center;gap:5px;flex-wrap:wrap}'+
    '.ce-tp-arrow{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}'+
    '.ce-tp-sep{color:var(--mu)}'+
    '.ce-tp-badge{font-size:8px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:#0a6b3a;background:rgba(10,143,76,.12);border-radius:999px;padding:2px 7px}'+
    '.ce-tp-badge.new{color:#7A5B02;background:rgba(251,188,5,.22)}'+
    '.ce-tp-chip-new{font-size:7.5px;font-weight:900;letter-spacing:.04em;color:#7A5B02;background:rgba(251,188,5,.22);border-radius:999px;padding:1px 6px;flex:none;margin-top:1px}'+
    '.ce-tp-acts{display:flex;gap:5px;flex:none}'+
    '.ce-tp-ok,.ce-tp-no{font-family:inherit;font-size:9.5px;font-weight:800;border:1px solid var(--bdr);border-radius:999px;padding:4px 9px;cursor:pointer;background:#fff;transition:.12s}'+
    '.ce-tp-ok{color:#0a8f4c}.ce-tp-ok:hover{border-color:#0a8f4c;background:rgba(10,143,76,.06)}'+
    '.ce-tp-no{color:'+RED+'}.ce-tp-no:hover{border-color:'+RED+';background:rgba(234,67,53,.06)}'+
    '.ce-tp-in{display:block;width:100%;box-sizing:border-box;resize:vertical;font-family:inherit;font-size:11px;font-weight:500;line-height:1.5;color:var(--navy);border:1px solid var(--bdr);border-radius:6px;padding:6px 8px;background:#FAFBFD}'+
    '.ce-tp-in:focus{outline:none;border-color:'+BLUE+';background:#fff}'+
    '.ce-tp-staged-h{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin:14px 0 7px;display:flex;align-items:center;gap:7px}'+
    '.ce-tp-count{font-size:9px;font-weight:900;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:1px 8px}'+
    '.ce-tp-staged{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tp-empty{font-size:10px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-tp-chip{display:flex;align-items:flex-start;gap:8px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.5;background:#fff;border:1px solid var(--bdr);border-left:3px solid #0a8f4c;border-radius:9px;padding:7px 9px}'+
    '.ce-tp-chip-tag{font-size:8.5px;font-weight:800;color:'+BLUE+';background:rgba(26,115,232,.10);border-radius:999px;padding:2px 8px;flex:none;margin-top:1px;line-height:1.35}'+
    '.ce-tp-chip-t{flex:1;min-width:0}'+
    '.ce-tp-unstage{font-family:inherit;font-size:9px;font-weight:900;color:var(--mu);border:0;background:none;cursor:pointer;line-height:1;padding:2px 3px;border-radius:50%;flex:none}'+
    '.ce-tp-unstage:hover{color:'+RED+';background:rgba(234,67,53,.10)}'+
    '.ce-tp-foot{font-size:9px;color:var(--mu);font-weight:600;line-height:1.45;margin-top:11px;padding-top:9px;border-top:1px dashed var(--bdr)}'+
    /* the print at a glance — diverging surprise chart, one normalized % axis, data-ev toggle-aware */
    '.ce-dv{margin:2px 0 4px}'+
    '.ce-dv-cap{font-size:9.5px;color:var(--mu);font-weight:600;margin-bottom:11px;line-height:1.45}'+
    '.ce-dv-rows{display:flex;flex-direction:column;gap:8px}'+
    '.ce-dv-row{display:grid;grid-template-columns:148px 1fr 52px;gap:10px;align-items:center}'+
    '@media(max-width:560px){.ce-dv-row{grid-template-columns:104px 1fr 46px}}'+
    '.ce-dv-k{font-size:9.5px;font-weight:700;color:var(--navy);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.ce-dv-track{position:relative;height:15px}'+
    '.ce-dv-zero{position:absolute;left:50%;top:-1px;bottom:-1px;width:1px;background:var(--bdr)}'+
    '.ce-dv-bar{position:absolute;top:50%;transform:translateY(-50%);height:11px;border-radius:3px;min-width:2px;max-width:50%}'+
    '.ce-dv-bar.pos{left:50%}.ce-dv-bar.neg{right:50%}'+
    '.ce-dv-bar.beat{background:#0a8f4c}.ce-dv-bar.miss{background:'+RED+'}.ce-dv-bar.inline{background:#9AA4B0}'+
    '.ce-dv-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:7px;height:7px;border-radius:50%;border:1.5px solid #9AA4B0;background:#fff}'+
    '.ce-dv-vwrap{font-variant-numeric:tabular-nums}'+
    '.ce-dv-v{font-size:9.5px;font-weight:800}'+
    '.ce-dv-v.beat{color:#0a8f4c}.ce-dv-v.miss{color:'+RED+'}.ce-dv-v.inline,.ce-dv-v.none{color:var(--mu)}'+
    '.ce-dv-axis{display:flex;justify-content:space-between;margin-top:10px;padding:0 62px 0 158px;font-size:8.5px;font-weight:700;color:var(--mu)}'+
    '@media(max-width:560px){.ce-dv-axis{padding:0 56px 0 114px}}'+
    '.ce-fz[data-view="cards"] .ce-dv{display:none}'+
    '.ce-fz[data-view="chart"] .ce-fz-g{display:none}'+
    '.ce-fz[data-view="chart"] .ce-vdf{display:none}'+
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
    // Lede removed (Aug 2026 restructure) — the phase chip already reads "② Post-Results" and the
    // print block leads. Below the print, three segmented sections: ① AI Summary · ② Points for the
    // call · ③ The call, classified. "Also on the call" is kept at the very bottom.
    // 1 · THE print — archive spine + hand-authored notes, ranked by surprise (one block now).
    // Pass the quarter's FROZEN Summit expectations (setup.us) so the print can be scored against
    // Street OR Summit via the vs-Street ⇄ vs-Summit toggle (§6a-iii).
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    // 2 · ① the AI-generated call summary — replaces the old one-line "take" black box (v2.10).
    b+=ceSummaryBlock(q.q, r.summary);
    // ② "Points for the call" was REMOVED (Aug 2026) per Dani — the red-line/tee-up cards were noise.
    // 4 · ③ The call, classified — Prepared Remarks ⇄ Q&A toggle, each item tagged to a Watch List
    //     theme (Aug 2026). Scaffold: renders a placeholder until q.call.prepared / q.call.qanda fill.
    b+=ceCallClassified(q, qk);
    // 5 · "Also on the call" — the supplemental colour (was the Post-Call tab, dissolved Jul 2026).
    // Kept at the very BOTTOM for now. NOT the tracking layer (Watch List) nor the meeting-critical
    // read (the scorecard). Includes non-trackable call colour.
    b+=ceHighlightsBlock(q.call, qk);
    b+='<div class="ov-foot">Numbers scored against the frozen expectation — <b>Street</b> (<code>BBG_CONSENSUS.txt</code>) or <b>Summit</b> via the toggle; actuals = reported. The <i>Also on the call</i> aside is supplemental colour — the tracking layer is Notes.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// ② POINTS FOR THE CALL ── the thesis red-lines and "what this tees up" MERGED (Aug 2026) into a
// single strip of call points. A red-line contributes a point chipped HELD / TRIPPED; a tee-up a
// point chipped ASK. "why ＋" / "the ask ＋" opens the reasoning behind it. Red-lines rank first
// (tripped before held), then the tee-ups. Empty in, empty out.
function cePointsBlock(qk, r){
  var pts=[];
  (r.thesisCheck||[]).slice()
    .sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); })
    .forEach(function(t,i){
      pts.push({ headHtml:esc(t.line), body:t.note||'', chip:(t.tripped?'TRIPPED':'HELD'),
        cls:(t.tripped?'trip':'held'), rl:true, trip:!!t.tripped, id:'pt-rl-'+qk+'-'+i, more:'why ＋' });
    });
  (r.intoCall||[]).forEach(function(x,i){
    // Everything up to the first em-dash is the hook; the rest is the argument behind it.
    var mm=String(x).match(/^([\s\S]*?)\s+—\s+([\s\S]*)$/);
    pts.push({ headHtml:(mm?mm[1]:x), body:(mm?mm[2]:''), chip:'ASK', cls:'tee',
      rl:false, id:'pt-tee-'+qk+'-'+i, more:'the ask ＋' });
  });
  if(!pts.length) return '';
  var nTrip=pts.filter(function(p){ return p.rl&&p.trip; }).length;
  var b='<div class="ov-diagram-cap" style="margin:16px 0 7px"><b>Points for the call</b> '+
    '<span style="color:var(--mu);font-weight:600;font-size:10px">· go in with these'+
    (nTrip?(' · <b style="color:'+RED+'">'+nTrip+' red-line'+(nTrip>1?'s':'')+' tripped</b>'):'')+'</span></div>';
  b+='<div class="ce-pts">'+pts.map(function(p){
    var id=p.body?ceReg(p.id, String(p.headHtml).replace(/<[^>]+>/g,''), '<p>'+p.body+'</p>'):null;
    return '<div class="ce-pt '+p.cls+'"'+(id?' data-detail="ce:'+id+'"':'')+'>'+
      '<div class="ce-pt-top"><span class="ce-pt-chip '+p.cls+'">'+p.chip+'</span></div>'+
      '<div class="ce-pt-h">'+p.headHtml+'</div>'+
      (id?'<div class="ce-pt-more">'+p.more+'</div>':'')+
    '</div>';
  }).join('')+'</div>';
  return b;
}
// ③ THE CALL, CLASSIFIED ── the call split into Prepared Remarks and Q&A, each item tagged to a
// Watch List theme (Aug 2026 scaffold). A toggle swaps between the two views (chosen over a
// side-by-side so the long Q&A list does not dwarf the prepared-remarks column). Placeholder data
// shape (fill per quarter under q.call):
//   prepared: [{ topic, theme, body }]                — a prepared-remarks topic, its WL theme, detail
//   qanda:    [{ q, analyst, theme, a }]              — an analyst question, its WL theme, the answer
// Renders a placeholder empty state until those arrays exist.
function ceCcTag(t){ return t ? '<span class="ce-cc-tag">#'+esc(String(t))+'</span>' : ''; }
// Rows are COLLAPSED to a scannable line (topic/question + theme tag) — the detail opens on demand
// (Aug 2026, "temas más resumidos"). Each row is a native <details>; the summary is the takeaway,
// the body is the prose.
function ceCallClassified(q, qk){
  var cc=q.call||{};
  var pr=cc.prepared||[], qa=cc.qanda||[];
  var hasData=pr.length||qa.length;
  var prBody = pr.length ? pr.map(function(p,i){
    return '<details class="ce-cc-row">'+
      '<summary class="ce-cc-row-h"><span class="ce-cc-topic">'+esc(p.topic||'')+'</span>'+ceCcTag(p.theme)+
        (p.body?'<span class="ce-cc-ar">▾</span>':'')+'</summary>'+
      (p.body?'<div class="ce-cc-row-b">'+p.body+'</div>':'')+
    '</details>';
  }).join('') : '<div class="ce-cc-empty">Prepared-remarks themes land here once the call is processed — each topic tagged to its Watch List theme.</div>';
  var qaBody = qa.length ? qa.map(function(x,i){
    // analyst field is "Name · Bank" — the BANK leads (what matters for tracking coverage), the
    // analyst name sits beside it. The exact curated question and the reply are BOTH always visible.
    var parts=String(x.analyst||'').split('·');
    var name=(parts[0]||'').trim(), bank=(parts[1]||'').trim();
    return '<div class="ce-cc-qa">'+
      '<div class="ce-cc-qa-h">'+
        (bank?'<span class="ce-cc-bank">🏦 '+esc(bank)+'</span>':'')+
        (name?'<span class="ce-cc-analyst">'+esc(name)+'</span>':'')+
        ceCcTag(x.theme)+
      '</div>'+
      (x.q?'<div class="ce-cc-q"><span class="ce-cc-ql">Q</span><span>'+esc(x.q)+'</span></div>':'')+
      (x.a?'<div class="ce-cc-a"><span class="ce-cc-al">A</span><span>'+x.a+'</span></div>':'')+
    '</div>';
  }).join('') : '<div class="ce-cc-empty">Every analyst question, the bank that asked, its theme, and the answer land here once the call is processed.</div>';
  return '<div class="ce-cc">'+
    '<div class="ce-cc-h"><b>The call, classified</b>'+
      (hasData?'':'<span class="ce-cc-ph">scaffold — fills after the call</span>')+
      '<span class="ce-cc-seg"><button type="button" class="active" data-ccv="pr">By Prepared Remarks</button>'+
        '<button type="button" data-ccv="qa">By Analyst Question</button></span>'+
    '</div>'+
    '<div class="ce-cc-pane" data-ccp="pr">'+prBody+'</div>'+
    '<div class="ce-cc-pane" data-ccp="qa" hidden>'+qaBody+'</div>'+
    ceThemeProposals(q, qk)+
  '</div>';
}
// ③b PROPOSE NOTES → the Watch List. The call's takeaways drafted as candidate NOTES. Each note is
// filed under a Theme (segment) ▸ Sub-theme — the exact shape the Watch List stores a note — so you
// SEE where it will land, and whether the sub-theme already exists or is new, before staging it.
// Source = q.call.newQuestions. Editable (Theme + Sub-theme + text); Accept stages it, Reject drops
// it, "↻ Rejected" restores rejected ones if you mis-clicked (accepted ones never return). The
// Theme/Sub-theme lists are the real Watch List taxonomy, read live from AMZN_THEMES / AMZN_SEG_ORDER.
// Staging is client-side; the actual publish into the Watch List is San/Oscar-gated.
function ceWlThemes(){
  var by={}, order=[];
  (typeof AMZN_THEMES!=='undefined'?AMZN_THEMES:[]).forEach(function(ct){
    if(!ct||!ct.seg||!ct.theme) return;
    if(!by[ct.seg]){ by[ct.seg]=[]; order.push(ct.seg); }
    if(by[ct.seg].indexOf(ct.theme)<0) by[ct.seg].push(ct.theme);
  });
  return order.map(function(s){ return { seg:s, themes:by[s] }; });
}
function ceSegsList(){
  if(typeof AMZN_SEG_ORDER!=='undefined' && AMZN_SEG_ORDER.length) return AMZN_SEG_ORDER.slice();
  return ceWlThemes().map(function(g){ return g.seg; });
}
function ceSubsOfSeg(seg){ var g=ceWlThemes().filter(function(x){ return x.seg===seg; })[0]; return g?g.themes:[]; }
function ceGuessTarget(txt){
  var t=(txt||'').toLowerCase(), theme;
  if(/capex|frame|funding|fcf|cash|debt/.test(t)) theme='Capex';
  else if(/backlog|conversion|capacity|reserved/.test(t)) theme='Backlog';
  else if(/margin/.test(t)) theme='Margins';
  else if(/trainium|silicon|chip|rack|graviton|rainier|merchant/.test(t)) theme='Custom silicon — Graviton, Trainium, Rainier';
  else if(/advertis|prime-day|\bads?\b/.test(t)) theme='Advertisement';
  else if(/robot|fulfillment|efficiency|grocery|same-day/.test(t)) theme='Robotics — the efficiency flywheel';
  else theme='Backlog';
  var seg=(ceSegsList()[0]||'AWS');
  ceWlThemes().forEach(function(g){ if(g.themes.indexOf(theme)>=0) seg=g.seg; });
  return { seg:seg, theme:theme };
}
function ceSegSelectHtml(sel){
  return '<select class="ce-tp-seg" title="Theme (segment) — where the note is filed">'+ceSegsList().map(function(s){
    return '<option value="'+esc(s).replace(/"/g,'&quot;')+'"'+(s===sel?' selected':'')+'>'+esc(s)+'</option>';
  }).join('')+'</select>';
}
function ceSubSelectHtml(seg, sel){
  var subs=ceSubsOfSeg(seg);
  var opts=subs.map(function(th){
    return '<option value="'+esc(th).replace(/"/g,'&quot;')+'"'+(th===sel?' selected':'')+'>'+esc(th)+'</option>';
  }).join('');
  opts+='<option value="__new__"'+(sel&&subs.indexOf(sel)<0?' selected':'')+'>＋ New sub-theme…</option>';
  return '<select class="ce-tp-sub" title="Sub-theme — the tracked line the note attaches to">'+opts+'</select>';
}
function ceThemeProposals(q, qk){
  var nq=(q.call&&q.call.newQuestions)||[];
  if(!nq.length) return '';
  var cards=nq.map(function(x,i){
    var txt=(typeof x==='string')?x:(x.n||'');
    var rank=(x&&x.landed&&x.landed.rank)?x.landed.rank:null;
    var tg=ceGuessTarget(txt);
    return '<div class="ce-tp-card" data-tp="'+qk+'-'+i+'">'+
      '<div class="ce-tp-row1">'+(rank?'<span class="ce-tp-rank">#'+rank+'</span>':'')+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Theme</label>'+ceSegSelectHtml(tg.seg)+'</span>'+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Sub-theme</label>'+ceSubSelectHtml(tg.seg, tg.theme)+'</span>'+
        '<span class="ce-tp-acts">'+
          '<button type="button" class="ce-tp-ok" data-tpact="accept" title="Stage this note">✓ Accept</button>'+
          '<button type="button" class="ce-tp-no" data-tpact="reject" title="Drop this note">✕</button>'+
        '</span></div>'+
      '<input class="ce-tp-newsub" type="text" placeholder="New sub-theme name" hidden>'+
      '<div class="ce-tp-target" data-tptarget></div>'+
      '<textarea class="ce-tp-in" rows="2">'+esc(txt)+'</textarea>'+
    '</div>';
  }).join('');
  return '<div class="ce-tp">'+
    '<div class="ce-tp-h"><span class="ce-tp-ic">📝</span><b>Propose Notes</b>'+
      '<button type="button" class="ce-tp-refresh" data-tprefresh title="Bring back the notes you rejected">↻ Rejected <span data-tprej>0</span></button>'+
      '<span class="ce-tp-subtitle">Each note files under a <b>Theme ▸ Sub-theme</b> from the Watch List, so you see exactly where it lands. Edit the target and the text, then Accept to stage or Reject to drop. Pick an existing sub-theme, or “＋ New sub-theme…” to propose a new one.</span></div>'+
    '<div class="ce-tp-list" data-tplist>'+cards+'</div>'+
    '<div class="ce-tp-staged-h">Staged notes <span class="ce-tp-count" data-tpcount>0</span></div>'+
    '<div class="ce-tp-staged" data-tpstaged><div class="ce-tp-empty">Nothing staged yet — accept a note above.</div></div>'+
    '<div class="ce-tp-foot">Staged notes are candidates only, kept client-side. Publishing into the Watch List is gated to San / Oscar — this scaffold does not write to the database.</div>'+
  '</div>';
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
  // The whole box is collapsed by default (Aug 2026) — a supplemental aside should not compete with
  // the scorecard for attention. Outer <details> closed; the caret + count make it obviously openable.
  var b='<details class="ce-alsobox"><summary class="ce-alsobox-h">'+
    '<span class="ce-alsobox-ic">▸</span>'+
    '<span class="ce-alsobox-htext"><b>Also on the call</b>'+
    '<span class="ce-alsobox-sub">supplemental colour — the meeting-critical items are the scorecard above and Notes</span></span>'+
    '<span class="ce-alsobox-n">'+hls.length+'</span>'+
    '</summary>'+
    '<div class="ce-alsolist">';
  b+=hls.map(function(x){
    // No tag chips (tone/curious/connects-dots/…) — just the theme and its dropdown (v2.10).
    var det=x.detail||'';
    if(x.open) det+='<p><b>Still open:</b> '+x.open+'</p>';
    return '<details class="ce-also-i">'+
      '<summary class="ce-also-s">'+
        '<span class="ce-also-hd">'+x.head+'</span>'+
        (det?'<span class="ce-also-ar">▾</span>':'')+
      '</summary>'+
      (det?'<div class="ce-also-body">'+det+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></details>';
  return b;
}

// F · The AI-generated CALL SUMMARY — the "minute" (v2.10). Replaces the old one-line black "take".
// THE SUMMARY IS THE PROSE ITSELF: several always-visible PARAGRAPHS, each landing a punch on a
// specific theme (top line, the bill, EPS, the structural new thing…). Each paragraph carries its own
// "＋ more" dropdown to go DEEPER — and that deeper content can hold NESTED context-guide dropdowns
// (dropdowns within dropdowns: drivers → segments → backlog…). It is NOT one generalist paragraph
// followed by a list. Not pop-ups — inline <details>. Technical terms are wrapped
// `<span class="ce-gl" data-def="…">term</span>` and show their definition on hover. Expand-all /
// Collapse-all toggle only the "＋ more" dropdowns, never the visible paragraphs. A SUMMARY, not a
// transcript — no roll-call of every exec.
function ceSumNodes(nodes, depth){   // nested context-guide dropdowns inside a "＋ more"
  if(!nodes||!nodes.length) return '';
  return '<div class="ce-sum-nodes">'+nodes.map(function(n){
    return '<details class="ce-sum-n" data-d="'+(depth>2?2:depth)+'">'+
      '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+n.t+'</span></summary>'+
      '<div class="ce-sum-nb">'+(n.body||'')+ceSumNodes(n.nodes, depth+1)+'</div>'+
    '</details>';
  }).join('')+'</div>';
}
function ceSumMore(more){   // a "＋ more": deeper prose (string) or { body, nodes:[…] }
  if(!more) return '';
  if(typeof more==='string') return more;
  return (more.body||'')+ceSumNodes(more.nodes, 1);
}
function ceSummaryBlock(qLabel, s){
  if(!s||!s.paras||!s.paras.length) return '';
  var body=s.paras.map(function(pa,i){
    var p='<div class="ce-sum-block">'+
      '<p class="ce-sum-para">'+(pa.p||'')+'</p>';   // the always-visible punch paragraph
    if(pa.more){
      p+='<details class="ce-sum-n ce-sum-more" data-d="0">'+
        '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+(pa.moreLabel||'＋ more — the detail behind this')+'</span></summary>'+
        '<div class="ce-sum-nb">'+ceSumMore(pa.more)+'</div>'+
      '</details>';
    }
    return p+'</div>';
  }).join('');
  return '<details class="ce-sum" open>'+
    '<summary class="ce-sum-h"><span class="ce-sum-ic">🧠</span><b>Call summary — the minute</b>'+
      '<span class="ce-sum-tag">AI-generated</span></summary>'+
    '<div class="ce-sum-body">'+
      '<div class="ce-sum-tools"><span class="ce-sum-tt">The summary is the text; each paragraph lands a point · open <b>＋ more</b> for the detail · hover a <span class="ce-gl" data-def="A term with a dashed underline — hover it to read its definition here.">dashed term</span> for its definition</span>'+
        '<button type="button" class="ce-sum-btn" data-sum="exp">⊕ Expand all</button>'+
        '<button type="button" class="ce-sum-btn" data-sum="col">⊖ Collapse all</button></div>'+
      body+
    '</div>'+
  '</details>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — AMZN_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/AMZN.md + AMZN-latest.md.
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
  // Cards ⇄ Chart — show the print as tiles OR as the diverging surprise chart, one at a time.
  pane.querySelectorAll('.ce-gseg button[data-fzview]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzview'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-view', v);
  }; });
  // ③ "The call, classified" — By Prepared Remarks ⇄ By Analyst Question. Scoped to its own .ce-cc so
  // each quarter's block toggles independently (mirrors the .ce-phtab / print-toggle pattern).
  pane.querySelectorAll('.ce-cc-seg button[data-ccv]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ccv'), cc=btn.closest('.ce-cc'); if(!cc) return;
    cc.querySelectorAll('.ce-cc-seg button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    cc.querySelectorAll('.ce-cc-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ccp')!==v); });
  }; });
  // ③b Propose Notes — each note files under Theme (segment) ▸ Sub-theme. The Sub-theme list rebuilds
  // when the Theme changes; "＋ New sub-theme…" reveals a name field and flags the note NEW. The target
  // line shows exactly where it lands. Accept stages "Theme ▸ Sub-theme · text"; Reject parks it; the
  // "↻ Rejected" button is ALWAYS visible and restores rejects (accepted notes never return).
  pane.querySelectorAll('.ce-tp').forEach(function(tp){
    var list=tp.querySelector('[data-tplist]'), staged=tp.querySelector('[data-tpstaged]'),
        countEl=tp.querySelector('[data-tpcount]'), rejEl=tp.querySelector('[data-tprej]'),
        refreshBtn=tp.querySelector('[data-tprefresh]'), rejected=[];
    function refresh(){
      var chips=staged.querySelectorAll('.ce-tp-chip');
      if(countEl) countEl.textContent=chips.length;
      var empty=staged.querySelector('.ce-tp-empty'); if(empty) empty.hidden=chips.length>0;
      if(rejEl) rejEl.textContent=rejected.length;
    }
    function readTarget(card){
      var seg=(card.querySelector('.ce-tp-seg')||{}).value||'';
      var subSel=card.querySelector('.ce-tp-sub'), isNew=!!(subSel && subSel.value==='__new__');
      var newInp=card.querySelector('.ce-tp-newsub');
      var sub=isNew?((newInp&&newInp.value||'').trim()):(subSel?subSel.value:'');
      return { seg:seg, sub:sub, isNew:isNew };
    }
    function paintTarget(card){
      var t=readTarget(card), tgt=card.querySelector('[data-tptarget]'); if(!tgt) return;
      var subLabel=t.sub||(t.isNew?'(name the new sub-theme)':'—');
      tgt.innerHTML='<span class="ce-tp-arrow">files under →</span> <b></b> <span class="ce-tp-sep">▸</span> <b></b> '+
        (t.isNew?'<span class="ce-tp-badge new">NEW sub-theme</span>':'<span class="ce-tp-badge">existing sub-theme</span>');
      var bs=tgt.querySelectorAll('b'); if(bs[0]) bs[0].textContent=t.seg; if(bs[1]) bs[1].textContent=subLabel;
    }
    function rebuildSub(card){
      var seg=(card.querySelector('.ce-tp-seg')||{}).value||'', subSel=card.querySelector('.ce-tp-sub'); if(!subSel) return;
      var subs=ceSubsOfSeg(seg);
      subSel.innerHTML=subs.map(function(th){ return '<option value="'+esc(th).replace(/"/g,'&quot;')+'">'+esc(th)+'</option>'; }).join('')+'<option value="__new__">＋ New sub-theme…</option>';
    }
    function syncNew(card){
      var subSel=card.querySelector('.ce-tp-sub'), newInp=card.querySelector('.ce-tp-newsub');
      if(newInp) newInp.hidden = !(subSel && subSel.value==='__new__');
    }
    function wireCard(card){
      var segSel=card.querySelector('.ce-tp-seg'), subSel=card.querySelector('.ce-tp-sub'), newInp=card.querySelector('.ce-tp-newsub');
      if(segSel) segSel.onchange=function(){ rebuildSub(card); syncNew(card); paintTarget(card); };
      if(subSel) subSel.onchange=function(){ syncNew(card); paintTarget(card); };
      if(newInp) newInp.oninput=function(){ paintTarget(card); };
      syncNew(card); paintTarget(card);
      card.querySelectorAll('[data-tpact]').forEach(function(btn){ btn.onclick=function(){
        if(btn.getAttribute('data-tpact')==='accept'){
          var ta=card.querySelector('.ce-tp-in'), v=(ta&&ta.value||'').trim(); if(!v) return;
          var t=readTarget(card); if(t.isNew && !t.sub){ if(newInp) newInp.focus(); return; }
          var chip=document.createElement('div'); chip.className='ce-tp-chip';
          var tag=document.createElement('span'); tag.className='ce-tp-chip-tag'; tag.textContent=t.seg+' ▸ '+t.sub;
          chip.appendChild(tag);
          if(t.isNew){ var nb=document.createElement('span'); nb.className='ce-tp-chip-new'; nb.textContent='NEW'; chip.appendChild(nb); }
          var txt=document.createElement('span'); txt.className='ce-tp-chip-t'; txt.textContent=v; chip.appendChild(txt);  // textContent = no injection
          var x=document.createElement('button'); x.type='button'; x.className='ce-tp-unstage'; x.title='Unstage'; x.textContent='✕';
          x.onclick=function(){ chip.remove(); refresh(); }; chip.appendChild(x);
          staged.appendChild(chip); card.remove();
        } else { rejected.push(card); card.remove(); }
        refresh();
      }; });
    }
    tp.querySelectorAll('.ce-tp-card').forEach(wireCard);
    if(refreshBtn) refreshBtn.onclick=function(){ rejected.forEach(function(c){ list.appendChild(c); }); rejected=[]; refresh(); };
    refresh();
  });
}
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once AMZN\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
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
  // The quarter selector drives the Setup & Post-Results per-quarter blocks; the Watch List pane has
  // no per-quarter blocks (the shared engine carries its own quarters), so the pills are inert there.
  // Hide the whole selector on the Watch List phase (AMZN-only) rather than leave a dead control.
  var pillbar=pane.querySelector('.ce-qpills'); if(pillbar) pillbar.hidden=(phase==='watch');
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
  // Call-summary Expand-all / Collapse-all — toggles only the inner dropdown nodes of THIS summary
  // box, never the always-visible lede or the outer box itself.
  pane.querySelectorAll('.ce-sum-btn').forEach(function(btn){ btn.onclick=function(e){
    e.preventDefault();
    var box=btn.closest('.ce-sum'); if(!box) return;
    var open=(btn.getAttribute('data-sum')==='exp');
    box.querySelectorAll('details.ce-sum-n').forEach(function(d){ d.open=open; });
  }; });
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
  // ── Watch List: mount the SHARED engine (js/watchlist.js). It owns rendering + Supabase
  // persistence + sorting + the delete rule, scoped by company id/ticker; re-mount is idempotent. ──
  var wmount=pane.querySelector('.ce-phpane[data-cep="watch"] [data-wlmount]');
  if(wmount && _co && _co.id){
    mountWatchList(wmount, { companyId:_co.id, ticker:_co.ticker, quarters:CALL_EARNINGS.quarters,
      colors:{ brand:BRAND, brand2:BRAND2, purple:'#7A5AF8', gray:GRAY, red:'#D64545' } });
  }
}

// ═══ Deep Dive default tabs — built from the Results dataset (no re-hardcode) ═══════════════════
// Chart.js helpers (lazy: panes must be visible — offsetParent — before building).
var _aCharts={};
function aDestroy(id){ if(_aCharts[id]){ _aCharts[id].destroy(); _aCharts[id]=null; } }
function aChartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
// FY sums from the quarterly actuals of the dataset (single source of truth).
function aFy(key, year){
  var m=amznResults.views.q.metrics[key]; if(!m) return null;
  var tot=0, got=0;
  m.periods.forEach(function(p,i){ if(p.slice(2)===String(year).slice(2) && m.act[i]!=null){ tot+=m.act[i]; got++; } });
  return got===4 ? tot : null;
}
var A_SEG_YEARS=['2021','2022','2023','2024','2025'];
function aSegSeries(key){ var m=amznResults.views.y.metrics[key]; return A_SEG_YEARS.map(function(y){ var i=m.periods.indexOf(y); return i>=0&&m.act[i]!=null?m.act[i]/1000:null; }); }
function toplineSegBody(){
  var h='<p class="ov-lede"><b>Three engines, one flywheel.</b> North America and International are the retail surface (first-party stores + the 3P marketplace + ads riding on both); AWS is the profit engine that funds the AI build. The revenue-line view below cuts the same company by WHAT is sold rather than where.</p>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:8px 0">'+
    '<div class="ov-sec" style="margin:0"><div class="ov-sec-h">Segment revenue ($B, FY)</div><div style="height:280px"><canvas id="aSegRev"></canvas></div></div>'+
    '<div class="ov-sec" style="margin:0"><div class="ov-sec-h">Segment operating income ($B, FY)</div><div style="height:280px"><canvas id="aSegOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-sec"><div class="ov-sec-h">FY2025 revenue lines — what is actually sold ($B)</div><div style="height:260px"><canvas id="aRevLines"></canvas></div>'+
    '<div class="ov-fynote">Revenue-line disaggregation summed from the quarterly 8-K actuals in the Results dataset. Advertising ($68.6B, +23%) and 3P seller services ($172.2B) are the high-margin lines riding the retail surface; AWS ($128.7B) carries most of the operating income. Forward views live in Evolution ▸ Results / Estimates.</div></div>';
  return h;
}
function aBuildTopline(){
  var cv=aChartReady('aSegRev');
  if(cv){ aDestroy('aSegRev'); _aCharts['aSegRev']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:A_SEG_YEARS, datasets:[
      { label:'North America', data:aSegSeries('usrev'), backgroundColor:BRAND, maxBarThickness:34 },
      { label:'International', data:aSegSeries('intrev'), backgroundColor:BRAND2, maxBarThickness:34 },
      { label:'AWS', data:aSegSeries('aws'), backgroundColor:SQUID, maxBarThickness:34 } ] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } } },
      scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); }
  var c2=aChartReady('aSegOp');
  if(c2){ aDestroy('aSegOp');
    function opSeries(key){ return A_SEG_YEARS.map(function(y){ var tot=0,got=0; var m=amznResults.views.q.metrics[key]; m.periods.forEach(function(p,i){ if(p.slice(2)===y.slice(2)&&m.act[i]!=null){ tot+=m.act[i]; got++; } }); return got===4?tot/1000:null; }); }
    _aCharts['aSegOp']=new Chart(c2.getContext('2d'),{ type:'bar',
      data:{ labels:A_SEG_YEARS, datasets:[
        { label:'North America', data:opSeries('naopinc'), backgroundColor:BRAND, maxBarThickness:34 },
        { label:'International', data:opSeries('intopinc'), backgroundColor:BRAND2, maxBarThickness:34 },
        { label:'AWS', data:opSeries('awsopinc'), backgroundColor:SQUID, maxBarThickness:34 } ] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } } },
        scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); }
  var c3=aChartReady('aRevLines');
  if(c3){ aDestroy('aRevLines');
    var lines=[ ['Online stores','online'], ['3P seller services','p3'], ['AWS','aws'], ['Advertising','ads'], ['Subscriptions','subs'], ['Physical stores','phys'], ['Other','other'] ];
    var vals=lines.map(function(l){ var v=aFy(l[1], 2025); return v==null?null:Math.round(v/100)/10; });
    _aCharts['aRevLines']=new Chart(c3.getContext('2d'),{ type:'bar',
      data:{ labels:lines.map(function(l){ return l[0]; }), datasets:[{ data:vals, backgroundColor:[BRAND,BRAND2,SQUID,'#7A5AF8','#2E8B57','#9AA4B0','#C8B49A'], maxBarThickness:26 }] },
      options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
        scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } }, y:{ grid:{ display:false } } } } }); }
}
function bottomlineBody(){
  var h='<p class="ov-lede"><b>The margin machine and its bill.</b> The consolidated operating margin has climbed from low single digits to a record 13.1% (1Q26) on two structural levers — AWS mix and retail efficiency (unit growth outpacing fulfillment cost growth) — while the AI build-out runs the largest capex program in corporate history underneath it.</p>';
  h+='<div class="ov-sec"><div class="ov-sec-h">Operating margin by segment (%, quarterly)</div><div style="height:300px"><canvas id="aMgn"></canvas></div>'+
    '<div class="ov-fynote">Margins computed from the quarterly 8-K actuals in the Results dataset (segment op income ÷ segment net sales). 3Q25 North America carries the $2.5B FTC settlement; 4Q25 carries $2.4B of special charges (Italy tax · severance · impairments) — the dips are charges, not deterioration.</div></div>';
  h+='<div class="ov-sec"><div class="ov-sec-h">The bill under the margins</div>'+
    '<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>Capex:</b> FY25 $131.8B → FY26 framed at <b>~$200B, "predominantly AWS"</b> (Feb 2026 call); the Summit model carries $205.8B and the Street ~$202B. Memory component costs "skyrocketed" (Apr 2026 call).</li>'+
    '<li><b>FCF:</b> the model\'s FY26 free-cash-flow forecast flipped <b>negative</b> (−$16.9B, May vintage) on the capex re-rate — recovery modeled into FY28 ($163B). The bet: capacity installs 6–24 months before it bills.</li>'+
    '<li><b>The offset:</b> units +15% vs fulfillment expense +9% (1Q26), 1M+ robots, robotics in every 2026 US large-format launch — the efficiency flywheel that keeps the record margin possible while the bill runs.</li>'+
    '</ul></div>'+
    '<div class="ov-fynote">Sources: 8-K actuals via the Results dataset; Summit model vintages (see Evolution ▸ Estimates); Q4 2025 / Q1 2026 earnings calls.</div></div>';
  return h;
}
function aBuildBottomline(){
  var cv=aChartReady('aMgn'); if(!cv) return;
  aDestroy('aMgn');
  var q=amznResults.views.q.metrics, per=q.rev.periods;
  var n=per.indexOf('2Q26'); if(n<0) n=per.length;
  var labels=per.slice(0,n);
  function mgn(num,den){ return labels.map(function(_,i){ var a=q[num].act[i], b=q[den].act[i]; return (a==null||b==null||!b)?null:Math.round(a/b*1000)/10; }); }
  _aCharts['aMgn']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:labels, datasets:[
      { label:'Consolidated', data:mgn('opinc','rev'), borderColor:'#1E2733', backgroundColor:'#1E2733', borderWidth:2.5, pointRadius:2, tension:0.25 },
      { label:'AWS', data:mgn('awsopinc','aws'), borderColor:SQUID, backgroundColor:SQUID, borderWidth:2, pointRadius:2, tension:0.25, borderDash:[5,4] },
      { label:'North America', data:mgn('naopinc','usrev'), borderColor:BRAND, backgroundColor:BRAND, borderWidth:2, pointRadius:2, tension:0.25 },
      { label:'International', data:mgn('intopinc','intrev'), borderColor:BRAND2, backgroundColor:BRAND2, borderWidth:2, pointRadius:2, tension:0.25 } ] },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y+'%'); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:10 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } } } } });
}
function valuationPeersBody(){
  return '<p class="ov-lede"><b>The peer map.</b> The same live-cap scatter as the Overview, kept beside the valuation work: X = multiple (P/E ⇄ EV/EBITDA, forward ⇄ trailing), Y = expected growth, bubble = live market cap. Peer multiples are seeded approximations (Jul 2026) — directional, not live.</p>'+stdPeerScatter('dd');
}
function valuationFinBody(){
  return '<p class="ov-lede"><b>The financial arc.</b> Reported history and the model\'s live forward view for the lines valuation hangs on. Bars = reported actuals; outlined bars = Summit model forward (2026-05-05 vintage). The full vintage-by-vintage story is in Evolution ▸ Estimates.</p>'+
    '<div class="ov-sec"><div class="ov-sec-h">Revenue · EBITDA · Earnings · Capex ($B, FY)</div><div style="height:320px"><canvas id="aFin"></canvas></div>'+
    '<div class="ov-fynote">From the Results dataset annual view (8-K/10-K actuals; Summit model forward — the model\'s "Earnings" line is its own adjusted definition, not GAAP net income). ⚠ The dataset\'s reconciliation flags apply (EBITDA vintage gap; FY28 capex internal inconsistency — both flagged for the model owner).</div></div>';
}
function aBuildFin(){
  var cv=aChartReady('aFin'); if(!cv) return;
  aDestroy('aFin');
  var y=amznResults.views.y.metrics, years=['2021','2022','2023','2024','2025','2026','2027'];
  function ser(key, src){ var m=y[key]; if(!m) return years.map(function(){ return null; });
    return years.map(function(yr){ var i=m.periods.indexOf(yr); return (i>=0&&m[src][i]!=null)?m[src][i]/1000:null; }); }
  function merge(key){ var a=ser(key,'act'), s=ser(key,'summit'); return years.map(function(_,i){ return a[i]!=null?a[i]:s[i]; }); }
  function estFlag(key){ var a=ser(key,'act'); return years.map(function(_,i){ return a[i]==null; }); }
  var keys=[ ['Revenue','rev','#1E2733'], ['EBITDA','ebitda',SQUID], ['Earnings (model def.)','earnings','#2E8B57'], ['Capex','capex',BRAND] ];
  _aCharts['aFin']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:years.map(function(yr,i){ return (+yr>2025)?yr+'E':yr; }), datasets:keys.map(function(k){
      var flags=estFlag(k[1]);
      return { label:k[0], data:merge(k[1]), backgroundColor:flags.map(function(e){ return e?k[2]+'55':k[2]; }), borderColor:k[2], borderWidth:flags.map(function(e){ return e?1.5:0; }), maxBarThickness:22 }; }) },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } } },
      scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } });
}
var A_MGMT=[
  { n:'Andy Jassy', r:'President & CEO', since:'CEO since Jul 2021 · joined 1997', d:'Built AWS from a memo into the profit engine (its first leader, 2003–2021). As CEO: the efficiency era (regionalization, flattening), the AI build-out, and the "every experience reinvented with AI" doctrine.' },
  { n:'Brian Olsavsky', r:'SVP & CFO', since:'CFO since 2015 · joined 2002', d:'The voice of the guide: two decades of Amazon finance, from Worldwide Operations to the CFO seat. Owns the capex framing ("as fast as we install this capacity, we are monetizing it").' },
  { n:'Matt Garman', r:'CEO, AWS', since:'since Jun 2024 · joined 2006', d:'One of AWS\'s first product managers, then its top salesman, now its CEO — presiding over the re-acceleration (+24% → +28%), the Trainium ramp and the Anthropic partnership.' },
  { n:'Doug Herrington', r:'CEO, Worldwide Amazon Stores', since:'since 2022 · joined 2005', d:'Runs the retail surface: the everyday-essentials push, same-day network, grocery ($150B+ gross sales) and the robotics rollout.' },
  { n:'Jeff Bezos', r:'Founder & Executive Chair', since:'chair since Jul 2021', d:'Founder; largest individual holder (~9%). Single share class — one share, one vote: influence flows from the stake and the chair, not super-voting stock (the governance mirror-image of META/GOOGL).' },
];
function mgmtBody(){
  var h='<p class="ov-lede"><b>The operator bench.</b> Amazon\'s leadership is home-grown to a degree unusual at this scale — the CEO, CFO, AWS chief and retail chief average ~20 years inside the company. Ownership and insider-transaction detail (auto-synced from Fiscal.ai) lives in the profile\'s <b>Pillars ▸ Management</b> tab; this page is the qualitative read.</p>';
  h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;margin:10px 0">';
  A_MGMT.forEach(function(m){
    h+='<div class="ov-card" style="border-top-color:'+BRAND+'"><div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span></div>'+
      '<div style="font-size:11px;font-weight:800;color:'+BRAND2+';margin:2px 0 2px">'+esc(m.r)+'</div>'+
      '<div style="font-size:10px;color:var(--mu);font-weight:700;margin-bottom:6px">'+esc(m.since)+'</div>'+
      '<div class="ov-card-s" style="font-size:12px;line-height:1.55">'+m.d+'</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-callout" style="margin-top:8px"><b>Governance in one line:</b> single share class (one vote per share), an executive-chair founder at ~9%, and a bench promoted from within — succession risk is low by construction, but so is the probability of an outsider ever forcing a strategy change. The 2025–26 severance rounds (Q3\'25 $1.8B; Q4\'25 $730M; more in 2026) are the leaner-org push showing up in the numbers.</div>';
  h+='<div class="ov-foot">Roles and tenures per Amazon proxy statements / IR (as of mid-2026); quotes from the Q4 2025 and Q1 2026 earnings calls. Ownership figures are approximate — the synced table in Pillars ▸ Management is the source of record.</div>';
  return h;
}

function html(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-amzn" data-brand="AMZN" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(255,153,0,0.10)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="amznModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="amznModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="amznModalT"></div><div class="ov-modal-b" id="amznModalB"></div></div></div>';
  h+='</div>';
  return h;
}
function deepDiveHtml(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-amzn ov-amzn-dd" data-brand="AMZN" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(255,153,0,0.10)">';
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
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments">'+toplineSegBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="margins">'+bottomlineBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ce-evohead" style="position:relative;display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 12px">'+
        '<div class="ovt-subtabs" style="margin:0">'+
          '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
        '</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        ceIRButton()+
        '<div class="ce-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (go in ready — Setup · Notes, with themes tracked across quarters) → <b>② Post-Results</b> (the print scored against what was frozen, <i>plus</i> the call highlights — the things worth taking into the conversation). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Amazon. The <b>Notes</b> tab is the single home for what we <i>track over time</i>; the Post-Results highlights are <i>talking points</i>, not tracking.</div>'+
        '<div class="ce-phtabs">'+
          '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
          '<button type="button" class="ce-phtab" data-cep="watch">Notes</button>'+
          '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
        '</div>'+
        ceQPills()+
        '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('AMZN')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('AMZN')+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+addEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+addEmpty()+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+addEmpty()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="financials">Financials</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="peers">'+valuationPeersBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="financials" hidden>'+valuationFinBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Governance</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+mgmtBody()+'</div>'+
    '</div>';
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
    if(kind==='ce'){ return CE_POP[id]||null; }
    return null;
  }
  // Delegated: catches static AND dynamically-added [data-detail] elements (e.g. Earnings pop-ups,
  // which live in the Deep Dive DOM rendered after init).
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  if(!root._amznDetailWired){
    root._amznDetailWired=true;
    root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
  }
}
// Lazy chart builds per Deep Dive pane / sub-tab (Chart.js needs a non-null offsetParent).
function aBuildSub(root, dd, key){
  if(dd==='topline') requestAnimationFrame(aBuildTopline);
  if(dd==='bottomline') requestAnimationFrame(aBuildBottomline);
  if(dd==='valuation'){
    if(key==='peers') requestAnimationFrame(function(){ aScRenderAll(root); aScChipsAll(root); aScFetchCaps(root); });
    if(key==='financials') requestAnimationFrame(aBuildFin);
  }
  if(dd==='evolution'){
    if(key==='earnings'){
      var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
      if(!ph || ph.getAttribute('data-cep')==='setup') requestAnimationFrame(gBuildCeAnnual);
    }
    if(key==='results') requestAnimationFrame(function(){
      initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'AMZN'); });
    if(key==='estevo') requestAnimationFrame(initResultsEvo);
  }
}
function wireDD(root){
  root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-amzn-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    var pane=root.querySelector('.ov-amzn-dd .dd-pane[data-dd="'+key+'"]');
    var act=pane?pane.querySelector('.ovt-subtab.active'):null;
    aBuildSub(root, key, act?act.getAttribute('data-ovst'):null);
  }; });
  // Sub-tabs, pane-scoped, with the anti-scroll-jump anchor (§6a-iv).
  root.querySelectorAll('.ov-amzn-dd .dd-pane').forEach(function(pane){
    var dd=pane.getAttribute('data-dd');
    // The subtab bar is a direct child of the pane — EXCEPT in Evolution, where it lives inside
    // .ce-evohead (the flex header that parks the IR/EDGAR chips at its right). Match both.
    var SUB=':scope > .ovt-subtabs > .ovt-subtab, :scope > .ce-evohead > .ovt-subtabs > .ovt-subtab';
    pane.querySelectorAll(SUB).forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-ovst');
      ceKeepPos(btn, function(){
        pane.querySelectorAll(SUB).forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
      });
      aBuildSub(root, dd, key);
    }; });
  });
  // Earnings machinery: phase tabs · quarter pills · estimate toggles · Watch List authoring.
  wireCallEarnings(root);
  wireCeTrack(root);
  // Accordions (theme record) + the By theme ⇄ By quarter toggle.
  wireThemeRecord(root);
  // Show/hide the editing surface (the Theme → Sub-theme editor). Hidden by default so the record reads clean.
  root.querySelectorAll('.amzn-edit-tog[data-amzneditog]').forEach(function(btn){ btn.onclick=function(){
    var wrap=btn.closest('.amzn-edit'); if(!wrap) return;
    var body=wrap.querySelector('.amzn-edit-body'); if(!body) return;
    var open=body.hidden; body.hidden=!open;
    wrap.setAttribute('data-open', open?'1':'0');
    btn.setAttribute('aria-expanded', open?'true':'false');
  }; });
  // Build the Theme → Sub-theme editor inside the (hidden) panel.
  amznRenderEditor(root);
}
// Wire the theme-record interactions (accordions, segment dropdowns, By theme ⇄ By quarter toggle).
function wireThemeRecord(scope){
  if(!scope) return;
  scope.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  scope.querySelectorAll('.calls-seg[data-segtog]').forEach(function(btn){ btn.onclick=function(){ var g=btn.closest('.calls-seg-group'); if(!g) return; var open=g.classList.toggle('open'); var ic=btn.querySelector('.calls-seg-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  scope.querySelectorAll('.calls-pill[data-callsv]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-callsv');
    scope.querySelectorAll('.calls-pill[data-callsv]').forEach(function(x){ x.classList.toggle('active', x===b); });
    var th=scope.querySelector('#aCallsTheme'), qu=scope.querySelector('#aCallsQuarter'); if(th) th.style.display=(v==='theme'?'':'none'); if(qu) qu.style.display=(v==='quarter'?'':'none');
    // The ✎ editor lives only in the By-theme view — hide it on By-quarter (edits still flow through
    // to By-quarter since that view derives from the same data).
    var pane=b.closest('.ce-phpane'); var edit=pane?pane.querySelector('.amzn-edit'):null; if(edit) edit.style.display=(v==='theme'?'':'none'); }; });
  // Global tracking-window filter (below the toggle) — narrows the notes shown in both views.
  var rerec=function(){ amznRerenderRecord(document.getElementById('co-detailview')); };
  scope.querySelectorAll('[data-rectrks]').forEach(function(s){ s.onchange=function(){ _recSince=s.value||null; rerec(); }; });
  scope.querySelectorAll('[data-rectrkclear]').forEach(function(b){ b.onclick=function(){ _recSince=null; rerec(); }; });
  scope.querySelectorAll('[data-rechook]').forEach(function(b){ b.onclick=function(){ _recHook=b.getAttribute('data-rechook'); rerec(); }; });
  // ── inline per-sub-theme editor (opened from each sub-theme's ✎ Edit / Add note button) ──
  function ctOfEl(el){ var item=el.closest('.lpb-acc-item[data-theme]'), grp=el.closest('.calls-seg-group[data-seg]'); if(!item||!grp) return null; return amznFindTheme(grp.getAttribute('data-seg')+'|'+item.getAttribute('data-theme')); }
  scope.querySelectorAll('[data-receditopen]').forEach(function(b){ b.onclick=function(){ _recEditOpen[b.getAttribute('data-receditopen')]=1; rerec(); }; });
  scope.querySelectorAll('[data-recdone]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(ct) delete _recEditOpen[ct.seg+'|'+ct.theme]; rerec(); }; });
  scope.querySelectorAll('[data-rects]').forEach(function(s){ s.onchange=function(){ var ct=ctOfEl(s); if(!ct) return; ct.st=ct.st||{ k:'watch' }; if(s.value) ct.st.since=s.value; else delete ct.st.since; rerec(); }; });
  scope.querySelectorAll('[data-rectu]').forEach(function(s){ s.onchange=function(){ var ct=ctOfEl(s); if(!ct) return; ct.trackUntil=s.value||null; rerec(); }; });
  scope.querySelectorAll('[data-recadd]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var box=b.closest('.rec-edit'); var q=box.querySelector('[data-recnq]').value, tx=(box.querySelector('[data-recntext]').value||'').trim(); if(!q){ window.alert('Pick a quarter for the note.'); return; } if(!tx) return; ct.updates=ct.updates||[]; var u=ct.updates.filter(function(x){ return x.q===q; })[0]; if(!u){ u={ q:q, items:[] }; ct.updates.push(u); ct.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); } u.items.push(tx); rerec(); }; });
  scope.querySelectorAll('[data-recdelnote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u) return; u.items.splice(ix,1); if(!u.items.length) ct.updates=ct.updates.filter(function(x){ return x!==u; }); rerec(); }; });
  scope.querySelectorAll('[data-recednote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u||u.items[ix]==null) return; var nv=window.prompt('Edit note ('+q+') — HTML ok:', u.items[ix]); if(nv==null) return; nv=nv.trim(); if(!nv) return; u.items[ix]=nv; rerec(); }; });
}
// Re-render the theme record above (from AMZN_THEMES) and re-wire it — called after an edit or a
// filter change. Open/closed state (segments, sub-themes, the active view) is preserved across the
// rebuild so applying a filter never collapses the panes the user had expanded.
function amznCaptureRecState(host){
  var segs={}, subs={};
  host.querySelectorAll('.calls-seg-group[data-seg]').forEach(function(g){ segs[g.getAttribute('data-seg')]=g.classList.contains('open'); });
  host.querySelectorAll('.lpb-acc-item[data-theme]').forEach(function(it){ if(it.classList.contains('open')) subs[it.getAttribute('data-theme')]=1; });
  var qp=host.querySelector('.calls-pill[data-callsv="quarter"]');
  return { segs:segs, subs:subs, view:(qp&&qp.classList.contains('active'))?'quarter':'theme' };
}
function amznRestoreRecState(host, st){
  host.querySelectorAll('.calls-seg-group[data-seg]').forEach(function(g){ if(st.segs[g.getAttribute('data-seg')]){ g.classList.add('open'); var ic=g.querySelector('.calls-seg-ic'); if(ic) ic.textContent='–'; } });
  host.querySelectorAll('.lpb-acc-item[data-theme]').forEach(function(it){ if(st.subs[it.getAttribute('data-theme')]){ it.classList.add('open'); var ic=it.querySelector('.lpb-acc-ic'); if(ic) ic.textContent='–'; } });
  if(st.view==='quarter'){
    host.querySelectorAll('.calls-pill[data-callsv]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-callsv')==='quarter'); });
    var th=host.querySelector('#aCallsTheme'), qu=host.querySelector('#aCallsQuarter'); if(th) th.style.display='none'; if(qu) qu.style.display='';
    var pane=host.closest('.ce-phpane'); var edit=pane?pane.querySelector('.amzn-edit'):null; if(edit) edit.style.display='none';
  }
}
function amznRerenderRecord(root){ var host=root&&root.querySelector('[data-amznrec]'); if(!host) return; var st=amznCaptureRecState(host); host.innerHTML=callsBody(); amznRestoreRecState(host, st); wireThemeRecord(host); }

// ═══ Theme → Sub-theme editor (AMZN-only, in the hidden ✎ panel) ═══════════════════════════════
// "Theme" = the segment (AMZN_SEG_ORDER); "Sub-theme" = a theme within it (AMZN_THEMES[].theme).
// Picking a Theme filters the Sub-theme list to that segment. Adding either mutates the in-memory
// model and re-renders the record above at once. (Session-only for now — see the note to the user.)
var _edSeg=null, _edSub=null;
var _recEditOpen={};   // per sub-theme inline editor open state, keyed by "seg|theme"
function amznSubsOf(seg){ return AMZN_THEMES.filter(function(ct){ return ct.seg===seg; }); }
function amznFindTheme(key){ var p=String(key||'').split('|'); return AMZN_THEMES.filter(function(x){ return x.seg===p[0] && x.theme===p.slice(1).join('|'); })[0]; }
// A hook is OPEN when it has a Tracking since and no Tracking until; CLOSED once an until is set.
function amznHookOpen(ct){ return !!(ct.st&&ct.st.since) && !ct.trackUntil; }
function amznHookClosed(ct){ return !!ct.trackUntil; }
function amznEditorBody(){
  if(!_edSeg || AMZN_SEG_ORDER.indexOf(_edSeg)<0) _edSeg=AMZN_SEG_ORDER[0]||null;
  var subs=amznSubsOf(_edSeg);
  if(_edSub && !subs.some(function(s){ return s.theme===_edSub; })) _edSub=null;
  var h='<div class="aed-row"><span class="aed-lb">Theme</span><div class="aed-pills">';
  AMZN_SEG_ORDER.forEach(function(seg){ h+='<button type="button" class="aed-pill'+(seg===_edSeg?' on':'')+'" data-aedseg="'+esc(seg)+'">'+esc(seg)+'</button>'; });
  h+='<button type="button" class="aed-add" data-aedaddseg>+ New theme</button>';
  if(_edSeg) h+='<button type="button" class="aed-delseg" data-aeddelseg title="Delete the selected Theme and all its sub-themes">✕ delete ‘'+esc(_edSeg)+'’</button>';
  h+='</div></div>';
  h+='<div class="aed-row"><span class="aed-lb">Sub-theme</span><div class="aed-pills">';
  if(subs.length) subs.forEach(function(s){ h+='<button type="button" class="aed-pill sub'+(s.theme===_edSub?' on':'')+'" data-aedsub="'+esc(s.theme)+'">'+esc(s.theme)+(amznHookClosed(s)?' <span style="opacity:.6">·closed</span>':'')+'</button>'; });
  else h+='<span class="aed-empty">no sub-themes yet</span>';
  h+='<button type="button" class="aed-add" data-aedaddsub>+ New sub-theme</button></div></div>';
  var cur=subs.filter(function(s){ return s.theme===_edSub; })[0];
  if(cur){
    var extraQ=(cur.updates||[]).map(function(u){ return u.q; });
    h+='<div class="aed-detail">';
    h+='<div class="aed-detail-h">'+esc(cur.theme)+'<span class="aed-detail-seg">in '+esc(cur.seg)+'</span>'+
       '<button type="button" class="aed-delsub" data-aeddelsub>✕ delete sub-theme</button></div>';
    // Tracking window (per sub-theme): since + until (empty = still open). Drives the Open/Closed filter.
    h+='<label class="aed-flb">Tracking window</label>'+
       '<div class="aed-track"><span>Tracking since <select class="aed-sel" data-aedts>'+amznQuarterOpts((cur.st&&cur.st.since)||'', '— none —', extraQ)+'</select></span>'+
       '<span>Tracking until <select class="aed-sel" data-aedtu>'+amznQuarterOpts(cur.trackUntil||'', '— still open —', extraQ)+'</select></span>'+
       '<span class="aed-hookst '+(amznHookClosed(cur)?'closed':(amznHookOpen(cur)?'open':''))+'">'+(amznHookClosed(cur)?'closed':(amznHookOpen(cur)?'open hook':'not tracked'))+'</span></div>';
    // Add a note — right below the tracking window.
    h+='<label class="aed-flb">Add a note</label>'+
       '<div class="aed-addnote"><select class="aed-sel" data-aednoteq>'+amznQuarterOpts('', '— quarter —', extraQ)+'</select>'+
       '<input type="text" data-aednotetext placeholder="new note for that quarter (bold ok: &lt;b&gt;…&lt;/b&gt;)">'+
       '<button type="button" class="aed-mini" data-aedaddnote>+ Add note</button></div>';
    // Notes per quarter — the editor shows ALL notes; the "Since" filter is global (above the record).
    h+='<label class="aed-flb">Notes by quarter</label>';
    if(cur.updates&&cur.updates.length){
      h+='<div class="aed-notes">'+cur.updates.map(function(u){
        return '<div class="aed-qgroup"><span class="aed-note-q">'+esc(u.q)+'</span>'+
          u.items.map(function(it,ii){ return '<div class="aed-note-row"><span>'+it+'</span>'+
            '<button type="button" class="aed-ed" data-aedednote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Edit this note">✎</button>'+
            '<button type="button" class="aed-del" data-aeddelnote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Delete this note">✕</button></div>'; }).join('')+
        '</div>';
      }).join('')+'</div>';
    } else h+='<div class="aed-empty">no notes yet — add one above</div>';
    h+='</div>';
  }
  return h;
}
// Quarter <option>s: the tracked quarters (CALL_EARNINGS) plus any already used by this sub-theme,
// newest first. `sel` pre-selects; `blank` is the empty option label.
function amznQuarterOpts(sel, blank, extra){
  var seen={}, list=[];
  (CALL_EARNINGS.quarters||[]).forEach(function(q){ if(!seen[q.q]){ seen[q.q]=1; list.push(q.q); } });
  (extra||[]).forEach(function(q){ if(q && !seen[q]){ seen[q]=1; list.push(q); } });
  list.sort(function(a,b){ return (ceQnum(b)||0)-(ceQnum(a)||0); });
  var out='<option value="">'+esc(blank||'—')+'</option>';
  list.forEach(function(q){ out+='<option value="'+esc(q)+'"'+(sel===q?' selected':'')+'>'+esc(q)+'</option>'; });
  return out;
}
function amznRenderEditor(root){
  var host=root&&root.querySelector('[data-amzneditor]'); if(!host) return;
  host.innerHTML=amznEditorBody();
  host.querySelectorAll('[data-aedseg]').forEach(function(b){ b.onclick=function(){ _edSeg=b.getAttribute('data-aedseg'); _edSub=null; amznRenderEditor(root); }; });
  host.querySelectorAll('[data-aedsub]').forEach(function(b){ b.onclick=function(){ _edSub=b.getAttribute('data-aedsub'); amznRenderEditor(root); }; });
  var addSeg=host.querySelector('[data-aedaddseg]');
  if(addSeg) addSeg.onclick=function(){ var n=(window.prompt('New Theme (segment) name:')||'').trim(); if(!n) return; if(AMZN_SEG_ORDER.indexOf(n)<0) AMZN_SEG_ORDER.push(n); _edSeg=n; _edSub=null; amznRenderEditor(root); amznRerenderRecord(root); };
  var addSub=host.querySelector('[data-aedaddsub]');
  if(addSub) addSub.onclick=function(){ if(!_edSeg){ window.alert('Pick a Theme first.'); return; } var n=(window.prompt('New Sub-theme under “'+_edSeg+'”:')||'').trim(); if(!n) return; if(!amznSubsOf(_edSeg).some(function(s){ return s.theme===n; })) AMZN_THEMES.push({ seg:_edSeg, theme:n, why:'', updates:[], st:{ k:'watch' } }); _edSub=n; amznRenderEditor(root); amznRerenderRecord(root); };
  var delSeg=host.querySelector('[data-aeddelseg]');
  if(delSeg) delSeg.onclick=function(){ if(!_edSeg) return; var nsub=amznSubsOf(_edSeg).length;
    if(!window.confirm('Delete Theme “'+_edSeg+'”'+(nsub?(' and its '+nsub+' sub-theme'+(nsub>1?'s':'')+' (and their notes)'):'')+'?')) return;
    for(var k=AMZN_THEMES.length-1;k>=0;k--){ if(AMZN_THEMES[k].seg===_edSeg) AMZN_THEMES.splice(k,1); }
    var si=AMZN_SEG_ORDER.indexOf(_edSeg); if(si>=0) AMZN_SEG_ORDER.splice(si,1);
    _edSeg=null; _edSub=null; amznRenderEditor(root); amznRerenderRecord(root);
  };
  // ── the selected sub-theme's editable detail (tracking window · notes by quarter) ──
  var cur=amznSubsOf(_edSeg).filter(function(s){ return s.theme===_edSub; })[0];
  if(cur){
    var delsub=host.querySelector('[data-aeddelsub]');
    if(delsub) delsub.onclick=function(){ if(!window.confirm('Delete sub-theme “'+cur.theme+'” and its notes?')) return; var i=AMZN_THEMES.indexOf(cur); if(i>=0) AMZN_THEMES.splice(i,1); _edSub=null; amznRenderEditor(root); amznRerenderRecord(root); };
    var ts=host.querySelector('[data-aedts]');
    if(ts) ts.onchange=function(){ cur.st=cur.st||{ k:'watch' }; if(ts.value) cur.st.since=ts.value; else delete cur.st.since; amznRenderEditor(root); amznRerenderRecord(root); };
    var tu=host.querySelector('[data-aedtu]');
    if(tu) tu.onchange=function(){ cur.trackUntil=tu.value||null; amznRenderEditor(root); amznRerenderRecord(root); };
    host.querySelectorAll('[data-aeddelnote]').forEach(function(b){ b.onclick=function(){
      var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i');
      var u=(cur.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u) return;
      u.items.splice(ix,1);
      if(!u.items.length) cur.updates=cur.updates.filter(function(x){ return x!==u; });
      amznRenderEditor(root); amznRerenderRecord(root);
    }; });
    host.querySelectorAll('[data-aedednote]').forEach(function(b){ b.onclick=function(){
      var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i');
      var u=(cur.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u||u.items[ix]==null) return;
      var nv=window.prompt('Edit note ('+q+') — HTML ok (e.g. <b>…</b>):', u.items[ix]);
      if(nv==null) return; nv=nv.trim(); if(!nv) return;
      u.items[ix]=nv; amznRenderEditor(root); amznRerenderRecord(root);
    }; });
    var addNote=host.querySelector('[data-aedaddnote]');
    if(addNote) addNote.onclick=function(){
      var q=host.querySelector('[data-aednoteq]').value, tx=(host.querySelector('[data-aednotetext]').value||'').trim();
      if(!q){ window.alert('Pick a quarter for the note.'); return; }
      if(!tx) return;
      cur.updates=cur.updates||[];
      var u=cur.updates.filter(function(x){ return x.q===q; })[0];
      if(!u){ u={ q:q, items:[] }; cur.updates.push(u); cur.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); }
      u.items.push(tx);
      amznRenderEditor(root); amznRerenderRecord(root);
    };
  }
}
// ── Inline per-sub-theme editor (opened from the "✎ Edit / Add note" button inside a sub-theme in
// the record). Same box as the ✎ panel: Tracking window + Add a note + notes with edit/delete. ──
function amznInlineEdit(ct){
  var extraQ=(ct.updates||[]).map(function(u){ return u.q; });
  var h='<div class="aed-detail rec-edit" style="margin-top:10px">';
  h+='<label class="aed-flb">Tracking window</label>'+
     '<div class="aed-track"><span>Tracking since <select class="aed-sel" data-rects>'+amznQuarterOpts((ct.st&&ct.st.since)||'', '— none —', extraQ)+'</select></span>'+
     '<span>Tracking until <select class="aed-sel" data-rectu>'+amznQuarterOpts(ct.trackUntil||'', '— still open —', extraQ)+'</select></span>'+
     '<span class="aed-hookst '+(amznHookClosed(ct)?'closed':(amznHookOpen(ct)?'open':''))+'">'+(amznHookClosed(ct)?'closed':(amznHookOpen(ct)?'open hook':'not tracked'))+'</span></div>';
  h+='<label class="aed-flb">Add a note</label>'+
     '<div class="aed-addnote"><select class="aed-sel" data-recnq>'+amznQuarterOpts('', '— quarter —', extraQ)+'</select>'+
     '<input type="text" data-recntext placeholder="new note for that quarter (bold ok: &lt;b&gt;…&lt;/b&gt;)">'+
     '<button type="button" class="aed-mini" data-recadd>+ Add note</button></div>';
  h+='<label class="aed-flb">Notes by quarter</label>';
  if(ct.updates&&ct.updates.length){
    h+='<div class="aed-notes">'+ct.updates.map(function(u){
      return '<div class="aed-qgroup"><span class="aed-note-q">'+esc(u.q)+'</span>'+
        u.items.map(function(it,ii){ return '<div class="aed-note-row"><span>'+it+'</span>'+
          '<button type="button" class="aed-ed" data-recednote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Edit this note">✎</button>'+
          '<button type="button" class="aed-del" data-recdelnote data-q="'+esc(u.q)+'" data-i="'+ii+'" title="Delete this note">✕</button></div>'; }).join('')+
      '</div>'; }).join('')+'</div>';
  } else h+='<div class="aed-empty">no notes yet — add one above</div>';
  h+='<div class="aed-frow" style="margin-top:10px"><button type="button" class="aed-mini alt" data-recdone>Done</button></div>';
  h+='</div>';
  return h;
}

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
  wireModal(root);   // re-run so the delegated [data-detail] handler covers the Deep Dive DOM
  requestAnimationFrame(aBuildTopline);   // Top Line is the initially-visible pane
}

export var amznOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
