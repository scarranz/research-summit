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
import { fetchThemeRecord, saveThemeRecord } from '../api.js';   // durable persistence of the AMZN theme record (Notes)
import { amznResults } from '../results-data/amzn.js';
import { consensusEvo } from '../consensus-evolution.js';
import { makeManagement } from './management.js';   // shared Management mold (UBER/GOOGL/etc.)
import { amznBBG } from './amzn-bbg.js';   // segment actuals + consensus (rev/OI/D&A/PP&E) from BBG

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Page-styled inline prompt/confirm — a small floating card anchored to the trigger, replacing the
// browser's window.prompt / window.confirm so every add / edit / delete matches the page. onOk(value)
// fires on commit (value = '' for a pure confirm); Cancel / Esc / click-outside dismiss it. Set
// {multiline:true} for a textarea (notes), {confirm:true} for a yes/no, {danger:true} to redden OK.
function ceInlinePop(anchor, opts, onOk){
  Array.prototype.forEach.call(document.querySelectorAll('.ce-ip'), function(p){ p.remove(); });
  opts=opts||{}; var isConfirm=!!opts.confirm, ml=!!opts.multiline;
  var pop=document.createElement('div'); pop.className='ce-ip';
  pop.innerHTML='<div class="ce-ip-t">'+esc(opts.title||'')+'</div>'+
    (isConfirm?'':(ml?'<textarea class="ce-ip-in" rows="3"></textarea>':'<input class="ce-ip-in" type="text">'))+
    '<div class="ce-ip-btns"><button type="button" class="ce-ip-cancel">Cancel</button>'+
      '<button type="button" class="ce-ip-ok'+(opts.danger?' danger':'')+'">'+esc(opts.ok||(isConfirm?'Confirm':'Save'))+'</button></div>';
  document.body.appendChild(pop);
  var inp=pop.querySelector('.ce-ip-in'); if(inp && opts.value!=null) inp.value=opts.value;
  cewPositionPop(pop, anchor);
  function close(){ pop.remove(); document.removeEventListener('mousedown', outside, true); document.removeEventListener('keydown', onKey, true); }
  function outside(e){ if(!pop.contains(e.target)) close(); }
  function ok(){ var v=inp?(inp.value||'').trim():''; if(inp && !v) return; close(); onOk(v); }
  function onKey(e){ if(e.key==='Escape') close(); else if(e.key==='Enter' && (!ml || isConfirm)){ e.preventDefault(); ok(); } }
  pop.querySelector('.ce-ip-cancel').onclick=close;
  pop.querySelector('.ce-ip-ok').onclick=ok;
  setTimeout(function(){ document.addEventListener('mousedown', outside, true); document.addEventListener('keydown', onKey, true); }, 0);
  if(inp){ inp.focus(); if(inp.select) inp.select(); }
}
// Anchor a fixed popup to a launch button, orienting toward the side with room so a WIDE popup never
// runs off-screen: the ＋ add-note button is pinned bottom-RIGHT, so a note composer opens LEFTWARD
// (right edge aligned to the button) and, if there is no room below, UPWARD. Falls back to plain
// left/below when the button sits in the left half or has room beneath it. (Dani, Aug 2026.)
function cewPositionPop(pop, anchor){
  var r=(anchor&&anchor.getBoundingClientRect)?anchor.getBoundingClientRect():{left:80,right:80,top:80,bottom:80};
  pop.style.position='fixed';
  var pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
  // Horizontal: right-align to the button when it sits past the viewport midpoint, else left-align.
  var left=(r.left>vw/2)?(r.right-pw):r.left;
  left=Math.max(8, Math.min(left, vw-pw-12));
  // Vertical: below the button by default; flip above if it would overflow the bottom edge.
  var top=r.bottom+6;
  if(top+ph>vh-12) top=Math.max(8, r.top-ph-6);
  pop.style.left=left+'px'; pop.style.top=top+'px';
}
// Per-call-point note capture. The "＋ add note" button + a composer popup that reuses the SAME note
// engine as Propose Notes (cePublishNoteToRecord → the Notes record → Supabase), but does NOT auto-propose
// a Theme/Sub-theme — the user files it manually (this point did not qualify for Propose Notes, so the
// filing is a deliberate manual choice). qLabel = the reported quarter (e.g. "2Q26").
// Strip HTML/entities to plain text — the seed for a note is the point's PROSE (body/answer/detail), not
// its title, so a raw-HTML body becomes clean text in the composer's textarea.
function ceStripHtml(h){ return String(h==null?'':h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim(); }
// The "＋ add note" affordance — pinned bottom-RIGHT in its own row so it never collides with the prose.
function ceNoteAddBtn(qLabel, seed){
  return '<div class="ce-note-row"><button type="button" class="ce-noteadd" data-noteadd data-nq="'+esc(qLabel||'').replace(/"/g,'&quot;')+'" data-nseed="'+esc(seed||'').replace(/"/g,'&quot;')+'">＋ add note</button></div>';
}
function ceNoteAddPop(anchor){
  Array.prototype.forEach.call(document.querySelectorAll('.ce-ip'), function(p){ p.remove(); });
  var qLabel=anchor.getAttribute('data-nq')||'', seed=anchor.getAttribute('data-nseed')||'';
  var pop=document.createElement('div'); pop.className='ce-ip ce-ip-note';
  pop.innerHTML='<div class="ce-ip-t">Add a note'+(qLabel?' · '+esc(qLabel):'')+'</div>'+
    '<textarea class="ce-ip-in" rows="3"></textarea>'+
    '<div class="ce-ip-row"><span class="ce-ip-l">Theme</span>'+ceSegSelectHtml('__none__')+'</div>'+
    '<input class="ce-ip-newseg" type="text" placeholder="New theme name" hidden>'+
    '<div class="ce-ip-row"><span class="ce-ip-l">Sub-theme</span><span class="ce-ip-subwrap">'+ceSubSelectHtml('','__none__')+'</span></div>'+
    '<input class="ce-ip-newsub" type="text" placeholder="New sub-theme name" hidden>'+
    '<div class="ce-ip-btns"><button type="button" class="ce-ip-cancel">Cancel</button>'+
      '<button type="button" class="ce-ip-ok">Save note</button></div>';
  document.body.appendChild(pop);
  var ta=pop.querySelector('.ce-ip-in'); ta.value=seed;
  var segSel=pop.querySelector('.ce-tp-seg'), subWrap=pop.querySelector('.ce-ip-subwrap');
  var newSeg=pop.querySelector('.ce-ip-newseg'), newSub=pop.querySelector('.ce-ip-newsub');
  // Force an explicit choice — prepend a selected blank so nothing is pre-filed (unlike Propose Notes).
  function blankFirst(sel){ var o=document.createElement('option'); o.value='__none__'; o.textContent='— pick —'; o.selected=true; sel.insertBefore(o, sel.firstChild); }
  blankFirst(segSel); blankFirst(subWrap.querySelector('.ce-tp-sub'));
  function rebuildSub(){
    if(segSel.value==='__newseg__'){ newSeg.hidden=false; subWrap.innerHTML=''; newSub.hidden=false; return; }
    newSeg.hidden=true;
    subWrap.innerHTML=ceSubSelectHtml(segSel.value==='__none__'?'':segSel.value,'__none__');
    var ns=subWrap.querySelector('.ce-tp-sub'); blankFirst(ns);
    ns.onchange=function(){ newSub.hidden=(ns.value!=='__new__'); };
    newSub.hidden=true;
  }
  segSel.onchange=rebuildSub;
  subWrap.querySelector('.ce-tp-sub').onchange=function(){ newSub.hidden=(this.value!=='__new__'); };
  cewPositionPop(pop, anchor);
  function close(){ pop.remove(); document.removeEventListener('mousedown', outside, true); document.removeEventListener('keydown', onKey, true); }
  function outside(e){ if(!pop.contains(e.target)) close(); }
  function onKey(e){ if(e.key==='Escape') close(); }
  function save(){
    var text=(ta.value||'').trim(); if(!text) return;
    var seg=(segSel.value==='__newseg__')?(newSeg.value||'').trim():segSel.value;
    var cur=subWrap.querySelector('.ce-tp-sub');
    var sub=(segSel.value==='__newseg__')?(newSub.value||'').trim():(cur?(cur.value==='__new__'?(newSub.value||'').trim():cur.value):'');
    if(!seg||seg==='__none__'||!sub||sub==='__none__') return;   // both must be chosen
    var res=cePublishNoteToRecord(seg, sub, text, qLabel);
    if(res && res.dup){   // identical note already filed here — warn, keep the composer open, do not duplicate
      var warn=pop.querySelector('.ce-ip-warn');
      if(!warn){ warn=document.createElement('div'); warn.className='ce-ip-warn'; pop.insertBefore(warn, pop.querySelector('.ce-ip-btns')); }
      warn.textContent='This note is already filed under '+sub+' · '+qLabel+' — not added again.';
      return;
    }
    // Confirm the save on the button itself (green "Saved ✓") so a click never feels like it did nothing,
    // then close and refresh the record once the confirmation has registered.
    var okBtn=pop.querySelector('.ce-ip-ok'), cancelBtn=pop.querySelector('.ce-ip-cancel');
    if(okBtn){ okBtn.classList.add('done'); okBtn.textContent='Saved ✓'; okBtn.disabled=true; }
    if(cancelBtn) cancelBtn.disabled=true;
    setTimeout(function(){ close(); amznRerenderRecord(document); }, 480);
  }
  ta.addEventListener('input', function(){ var w=pop.querySelector('.ce-ip-warn'); if(w) w.remove(); });
  pop.querySelector('.ce-ip-cancel').onclick=close;
  pop.querySelector('.ce-ip-ok').onclick=save;
  setTimeout(function(){ document.addEventListener('mousedown', outside, true); document.addEventListener('keydown', onKey, true); }, 0);
  ta.focus();
}

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
var CE_IR_URL='https://ir.aboutamazon.com/quarterly-results/default.aspx';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1018724&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/AMZN';
var CE_SEC_SEAL='img/sec-seal.png';
// Source buttons — IR + EDGAR (EARNINGS_CONVENTIONS §6). RELOCATED (Dani, Aug 2026) out of the
// Earnings tab and up to the Company Profile header (right side, next to the price). Logo-only
// squares: no "Investor Relations" / "EDGAR" wording, just the mark inside a tile + a hover title.
// Exposed on amznOverview.headerSources() and rendered by companies.js openCo() into #co-srcbtns.
function ceHeaderSources(){
  return '<style>'+
    '.cohd-src{display:inline-flex;gap:8px;align-items:center}'+
    '.cohd-src a{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;'+
      'text-decoration:none;position:relative;overflow:hidden;transition:.16s;'+
      'background:linear-gradient(135deg,#0B0703 0%,#1C1206 60%,#0B0703 100%);border:1px solid rgba(255,153,0,.34);box-shadow:0 3px 12px rgba(0,0,0,.32)}'+
    '.cohd-src a:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(255,153,0,.30);border-color:rgba(255,153,0,.78)}'+
    '.cohd-src a img{width:26px;height:26px;object-fit:contain;display:block;border-radius:6px}'+
    '.cohd-src a.edgar{background:linear-gradient(135deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cohd-src a.edgar:hover{box-shadow:0 8px 20px rgba(197,164,90,.30);border-color:rgba(227,200,120,.78)}'+
    '.cohd-src a.edgar img{border-radius:0}'+
  '</style>'+
  '<div class="cohd-src">'+
  '<a href="'+CE_IR_URL+'" target="_blank" rel="noopener" title="Amazon Investor Relations" aria-label="Amazon Investor Relations">'+
    '<img src="'+CE_LOGO_URL+'" alt="Amazon logo" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '<a class="edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener" title="Amazon on SEC EDGAR" aria-label="Amazon on SEC EDGAR">'+
    '<img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.style.display=\'none\'">'+
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
    { k:"North America net sales", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,102.7],[null,null,84,84.6],[null,89.8,90.5,90],[95.5,96.1,95.7,95.3],[115.1,115.2,114.3,114.5],[94.3,93.9,94.1,92.7],[97.8,98.1,97.6,97.2],[104,103.5,102.8,104.4],[125.2,124.4,125.8,126.9],[99.6,100.5,105.9,102],[108.1,114.7,109.1,112.4],[122.3,116,115.4,112.8],[138.8,139,139.8,null],[112.6,113.3,null,null],[125.3,null,null,null]],
      qa:[93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null,null],
      qy:[null,null,null,null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2],
      qq:[null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null] },
    { k:"International net sales", u:"$B", t:'ok',
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
        'North America net sales':{ t:'The Prime-Day flip lands here', h:'<p>Pre-print consensus $115.3B. The Q3/Q2 Prime-Day timing swing hits North America hardest. The segment margin (7.9% in Q2) still carries the ~$1B/quarter LEO cost ramp until capitalization begins in Q4 — with robotics as the offset.</p>' },
        'International net sales':{ t:'The line to sanity-check', h:'<p>Pre-print consensus $45.1B. Q2 printed $42.2B (+15%) — a touch UNDER both the Street ($42.7B) and Summit ($43.4B), the only line on the card that missed. The model\'s over-call pattern on this segment continues.</p>' },
        'Advertising':{ t:'The accelerating profit engine', h:'<p>Pre-print consensus <b>$21.0B (+19%)</b> — set before ads printed <b>+26%</b> in Q2 (an acceleration from +22%, sponsored products the named driver). The line that audits whether agentic surfaces keep compounding into ad dollars.</p>' }
      },
      us:{ 'Revenue':{v:201.7}, 'Operating income':{v:24.3}, 'AWS net sales':{v:41.9}, 'North America net sales':{v:114.8}, 'International net sales':{v:45.0} },
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
        'North America net sales':{ t:'Watch the margin, not just the sales', h:'<p>Consensus $114.0B. The Q1 segment margin was 7.9%; the LEO cost step-up lands in North America, and the robotics rollout (every 2026 US large-format launch) is the offset. Segment consensus exists only from this quarter forward (BBG export).</p>' },
        'International net sales':{ t:'Profitable, but the model has over-called it', h:'<p>Consensus $42.7B. The segment turned profitable in 2024; Summit\'s frozen projections have recently run $0.5–1.2B ABOVE the printed op income — the line to sanity-check rather than celebrate.</p>' },
        'Advertising':{ t:'The third profit engine', h:'<p>Consensus <b>$19.3B (+23%)</b>. Q1 printed +22% with the Netflix/Comcast/Samsung partnerships ramping and ~20% of Rufus brand-prompt shoppers continuing the conversation. Street models ~18–19% growth through 2027.</p>' }
      },
      us:{ 'Revenue':{v:199.8}, 'Operating income':{v:23.8}, 'AWS net sales':{v:39.8}, 'North America net sales':{v:116.6}, 'International net sales':{v:43.4} },
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
        'North America net sales':{ t:'In line, with the LEO drag still inside it', h:'<p>$116.2B (+16%) vs $114.0B modelled; segment operating income $9.1B at a 7.9% margin — flat with Q1 while absorbing roughly $1B of LEO cost and delivering ~$600M of tariff refunds as offset.</p>' },
        'International net sales':{ t:'The one line under the Street', h:'<p>$42.2B (+15%) vs $42.7B modelled and Summit\'s $43.4B — a −1.2% miss, the only one on the card. Segment operating income $1.7B (4.1% margin) landed between the Street ($1.6B) and Summit ($1.5B).</p>' }
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
        { q:'AWS margin sustainability, and whether Amazon needs its own frontier model', analyst:'Doug Anmuth · J.P. Morgan', theme:'Margins',
          qFull:'AWS margins just set a record while AI investment keeps climbing. How sustainable is the margin from here, and does Amazon need to own a frontier model rather than rely on partners?',
          a:'<b>Olsavsky:</b> "Margins are not random. What you saw this quarter is <b>disciplined efficiency</b>, our custom-silicon mix, power efficiency and higher utilisation, not a one-off. I would caution that the <b>energy-derivative remeasurement line can swing a given quarter</b> either way, so we would not extrapolate a single print." <b>Jassy,</b> on owning a frontier model: "Our job is to give customers <b>choice</b> across the leading models on AWS. <b>Anthropic and OpenAI are both building on Trainium.</b> We do not believe we need our own frontier model to win; we need the broadest selection and the best price-performance."' },
        { q:'AWS acceleration drivers and the shape of 2027 capacity additions', analyst:'Justin Post · Bank of America', theme:'Backlog',
          qFull:'What is actually driving the AWS re-acceleration, and how should we think about the shape and pace of the capacity you are adding through 2027?',
          a:'<b>Jassy:</b> "The acceleration is <b>backlog converting</b> plus enterprise migration. You can see it in the AI business and the chips business, <b>each now above a $25B run-rate</b>. On 2027, <b>the capacity is largely reserved</b>. I am not going to put megawatt numbers on it, but the demand is contracted well ahead of the build."' },
        { q:'2027 data-centre timelines, and selling Trainium to third-party data centres', analyst:'Brian Nowak · Morgan Stanley', theme:'Custom silicon',
          qFull:'On the 2027 data-centre build, what are the investment timelines, and is selling Trainium into third-party data centres something you would actually do, or is capacity fully captive?',
          a:'<b>Jassy:</b> "Installs bill <b>six to twenty-four months after commitment</b>, which is why <b>2027, and parts of 2028, are being reserved now</b>. On selling Trainium into third-party data centres, <b>it is very much a possibility</b> over time, but our capacity today is fully allocated to our own customers, so it is optionality, not a committed plan."' },
        { q:'Application-layer expansion (Kiro, Transform) and how the capital is sourced', analyst:'Colin Sebastian · Baird', theme:'Capex',
          qFull:'As AWS pushes up the stack with Kiro and Transform, how are you sourcing the capital for all of this given the raised capex frame?',
          a:'<b>Jassy:</b> "Kiro and Transform are about moving AWS <b>from renting compute to selling outcomes</b> higher up the stack." <b>Olsavsky,</b> on funding: "We are funding this with <b>operating cash flow plus debt</b>. We raised <b>$67B of long-term debt in the first half</b>, and we <b>have not announced a co-investment vehicle</b>."' },
        { q:'Backlog at ~2.5x YoY versus capacity planning, and AWS pricing amid cost inflation', analyst:'Ken Gawrelski · Wells Fargo', theme:'Backlog',
          qFull:'With backlog at roughly 2.5x last year, how are you planning capacity against it, and are you raising AWS prices to offset the cost inflation you are seeing?',
          a:'<b>Olsavsky:</b> "Backlog is roughly <b>2.5x a year ago</b>, and we are planning capacity against that reserved book. On pricing, the margin is being carried by <b>efficiency gains, not list-price increases</b>. We are absorbing input inflation through silicon and utilisation rather than passing it to customers."' },
        { q:'Fast-commerce and grocery adoption across geographies', analyst:'Eric Sheridan · Goldman Sachs', theme:'Robotics',
          qFull:'Can you unpack fast-commerce and grocery adoption across geographies? How broad is it, and is it becoming a structural part of the model?',
          a:'<b>Jassy:</b> "Same-day perishables customers are up <b>50% since January</b>, and same-day orders are carrying about <b>3x the units</b>. Grocery and everyday essentials keep growing faster than the rest of the business, and it is broadening across regions. This is becoming a <b>structural part of the model</b>, not a recovery story."' },
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
      us:{ 'Revenue':{v:179.2}, 'Operating income':{v:21.4}, 'AWS net sales':{v:36.6}, 'North America net sales':{v:103.1}, 'International net sales':{v:39.5} },
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
          qFull:'With backlog where it is, can AWS actually keep up with the contracted demand, and will you invest to meet it?',
          a:'<b>Jassy:</b> "This is a <b>once-in-a-lifetime opportunity</b>, and we expect to deploy significantly against it. I am not going to give new capex guidance today. What positions us to meet the inflection without being gated on third-party supply is <b>owning the chips</b> ourselves, Graviton and Trainium."' },
        { q:'Backlog breadth and whether third-party agents threaten Rufus', analyst:'Brian Nowak · Morgan Stanley', theme:'Advertisement',
          qFull:'Is the backlog broad or concentrated, and do third-party shopping agents threaten Rufus and your ad surface?',
          a:'<b>Jassy:</b> "The backlog is <b>broad, not concentrated</b>. On agents, <b>Rufus MAU is up 115% and engagement up 400%</b>. Third-party agents mis-price and lack personalization, so the retailer\'s own assistant wins the shopping surface."' },
        { q:'OpenAI in Bedrock, and selling Trainium racks externally', analyst:'Justin Post · Bank of America', theme:'Custom silicon',
          qFull:'Is OpenAI coming to Bedrock, and would you sell Trainium racks to third parties?',
          a:'<b>Jassy:</b> "<b>GPT-5.4 is live in Bedrock</b>, with 5.5 due in a couple of weeks. On selling racks externally, it is <b>very much a possibility</b> over the next couple of years, but our supply today is fully allocated to training, so it is optionality, not a committed plan."' },
        { q:'LEO economics and the launch cadence', analyst:'Chris Sanderson · Loop Capital', theme:'LEO',
          qFull:'How do the LEO economics and the launch cadence look from here?',
          a:'<b>Jassy:</b> "We are seeing <b>2x downlink and 6x uplink</b> versus incumbents, with <b>20-plus launches in 2026 and 30-plus in 2027</b>. This is <b>a very large, many-billion-dollar revenue business</b>, with an AWS-like path from heavy capex to free cash flow."' },
        { q:'Memory inflation, and advertising inside agentic commerce', analyst:'Amit Khajuria · Wolfe Research', theme:'Advertisement',
          qFull:'How is memory inflation affecting the build, and how does advertising fit into agentic commerce?',
          a:'<b>Jassy:</b> "We <b>locked allocations with strategic suppliers in mid-to-late 2025</b>, so the scarcity actually accelerates cloud migration rather than stalling our build. And <b>we are going to like this for advertising</b>: sponsored prompts already work, and multi-turn conversations create more surfaces, not fewer."' },
        { q:'Which demand segments lead, and how internal AI changes the cost base', analyst:'Colin Sebastian · Baird', theme:'Backlog',
          qFull:'Which demand segments lead, and how is your own internal AI changing the cost base?',
          a:'<b>Jassy:</b> "Demand splits between the labs and enterprise production, and <b>enterprise production may end up the largest and most durable</b>. On our own cost base, we <b>rebuilt a service engine in 65 days versus a 40-50 person-year baseline</b>. That is a <b>very different world of operating</b>."' },
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
      us:{ 'Revenue':{v:213.4}, 'Operating income':{v:25.4}, 'AWS net sales':{v:35.1}, 'North America net sales':{v:128.3}, 'International net sales':{v:49.9} },
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
          qFull:'At a 35% AWS margin, how should we think about ROIC and the duration of this investment cycle?',
          a:'<b>Jassy:</b> "AWS is running at a <b>35% margin</b>, and <b>we will see how that develops</b> — I am not going to anchor a forward margin. The returns come from <b>utilisation and silicon efficiency over the asset life</b>, not from any single quarter."' },
        { q:'Project Rainier at 500K chips and where it goes next', analyst:'Doug Anmuth · J.P. Morgan', theme:'Custom silicon',
          qFull:'Project Rainier is at 500K chips today — where does that go from here?',
          a:'<b>Jassy:</b> "Rainier is a <b>500,000-chip cluster training the next Claude model</b>, and <b>that number is going to keep increasing</b>. The scale is tied directly to <b>committed Trainium demand</b>, not speculative capacity."' },
        { q:'How to think about the shape of the AI market', analyst:'Ross Sandler · Barclays', theme:'Backlog',
          qFull:'How should we think about the shape of the AI market from here?',
          a:'<b>Jassy:</b> "The market is <b>barbelled</b> between the labs and enterprise, and <b>enterprise production workloads may end up being the largest and most durable</b> source of demand — which is exactly the segment AWS is built to serve."' },
        { q:'Whether AI shopping assistants compress the ad funnel', analyst:'Michael Morton · MoffettNathanson', theme:'Advertisement',
          qFull:'Do AI shopping assistants compress the advertising funnel?',
          a:'<b>Jassy:</b> "With Rufus, <b>users are 60% more likely to complete a purchase</b>. Agentic surfaces <b>expand the funnel rather than compress it</b> — they add shopping touchpoints, they do not remove them."' },
        { q:'Fulfillment efficiency and network structure', analyst:'Brian Nowak · Morgan Stanley', theme:'Robotics',
          qFull:'What is driving fulfillment efficiency, and how is the network structured now?',
          a:'<b>Jassy:</b> "The levers are the <b>extension of regions from 8 to 10</b> and <b>more than 1M robots in the network</b>. This is a <b>structural change in cost per unit</b>, not a cyclical recovery."' },
        { q:'Who actually consumes the backlog', analyst:'Eric Sheridan · Goldman Sachs', theme:'Backlog',
          qFull:'Who is actually consuming the backlog — external customers, or internal and Anthropic usage?',
          a:'<b>Jassy:</b> "The <b>vast majority of the backlog is consumed by external customers</b>. It is not inflated by internal Amazon or Anthropic usage."' },
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
// (SRC_CALLS source foot removed — Dani, Aug 2026.)
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
  // No seeded sub-themes: a sub-theme exists only once it holds a REAL note, never as an empty
  // placeholder (Dani, Aug 2026). International hooks (segment margin, country build-out) get filed
  // here as the notes come in — via ＋ add note, Propose Notes, or the ✎ editor.
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
  return '<style>'+
    /* page-styled inline prompt/confirm popover (replaces window.prompt / window.confirm) */
    '.ce-ip{z-index:9999;background:#fff;border:1px solid var(--bdr);border-radius:12px;box-shadow:0 16px 44px rgba(15,23,42,.30);padding:13px 14px;min-width:264px;max-width:380px}'+
    '.ce-ip-t{font-size:11px;font-weight:800;color:var(--navy);margin-bottom:9px;line-height:1.4}'+
    '.ce-ip-in{width:100%;box-sizing:border-box;font:inherit;font-size:12px;line-height:1.5;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;color:var(--navy);resize:vertical}'+
    '.ce-ip-in:focus{outline:none;border-color:'+BRAND2+'}'+
    '.ce-ip-warn{margin-top:10px;padding:8px 11px;border:1px solid '+RED+';border-left:4px solid '+RED+';border-radius:8px;background:rgba(234,67,53,0.06);color:'+RED+';font-size:11px;font-weight:700;line-height:1.4}'+
    '.ce-ip-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:11px}'+
    '.ce-ip-btns button{font:inherit;font-size:11px;font-weight:800;border-radius:8px;padding:6px 15px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--mu);transition:background .14s,color .14s,border-color .14s,transform .06s,box-shadow .14s}'+
    /* Cancel — secondary, but it now answers the click (hover fill + pressed nudge). */
    '.ce-ip-btns .ce-ip-cancel:hover{background:#F2F5F8;color:var(--navy);border-color:var(--mu)}'+
    '.ce-ip-btns .ce-ip-cancel:active{transform:translateY(1px)}'+
    /* Save — the primary action. Scoped to `.ce-ip-btns .ce-ip-ok` so it BEATS `.ce-ip-btns button`
       (which was painting it grey), and it now reacts: hover darkens, :active presses in, .done flashes
       green with a "Saved ✓" confirmation before the composer closes. */
    '.ce-ip-btns .ce-ip-ok{background:'+BRAND2+';color:#fff;border-color:'+BRAND2+';box-shadow:0 1px 3px rgba(20,110,180,.30)}'+
    '.ce-ip-btns .ce-ip-ok:hover{background:#0F5A8F;border-color:#0F5A8F}'+
    '.ce-ip-btns .ce-ip-ok:active{transform:translateY(1px);box-shadow:none}'+
    '.ce-ip-btns .ce-ip-ok:focus-visible{outline:2px solid #0F5A8F;outline-offset:2px}'+
    '.ce-ip-btns .ce-ip-ok.done{background:#0a8f4c;border-color:#0a8f4c;box-shadow:none}'+
    '.ce-ip-note{min-width:min(1040px,94vw);max-width:94vw}'+
    '.ce-ip-row{display:flex;align-items:center;gap:8px;margin-top:8px}'+
    '.ce-ip-l{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);width:66px;flex:none}'+
    '.ce-ip-note select{flex:1;min-width:0;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:6px 8px;color:var(--navy);background:#fff}'+
    '.ce-ip-note .ce-ip-subwrap{flex:1;display:flex;min-width:0}'+
    '.ce-ip-newseg,.ce-ip-newsub{width:100%;box-sizing:border-box;font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 9px;margin-top:6px;color:var(--navy)}'+
    '.ce-note-row{display:flex;justify-content:flex-end;margin-top:10px}'+
    '.ce-noteadd{display:inline-block;font:inherit;font-size:9.5px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:'+BRAND2+';background:rgba(20,110,180,.08);border:1px solid rgba(20,110,180,.28);border-radius:7px;padding:4px 10px;cursor:pointer}'+
    '.ce-noteadd:hover{background:rgba(20,110,180,.16)}'+
    '.ce-ip-btns .ce-ip-ok.danger{background:'+RED+';border-color:'+RED+'}'+
    '.ce-ip-btns .ce-ip-ok.danger:hover{background:#C5221F;border-color:#C5221F}'+
    '.ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.ce-phtabs{display:inline-flex;gap:3px;background:rgba(66,133,244,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.ce-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s;white-space:nowrap}'+
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
    /* ── Bottom Line ▸ Supply Chain — stat row (ported from googl.js ddStat) ── */
    '.gdd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}'+
    '.gdd-kpi{background:var(--w);border:1px solid var(--bdr);border-radius:12px;padding:12px 14px}'+
    '.gdd-kpi-v{font-size:19px;font-weight:800;color:var(--navy);line-height:1.12}'+
    '.gdd-kpi-k{font-size:10.5px;color:var(--mu);margin-top:4px;line-height:1.35}'+
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
// `cur` = the current-period value the growth is measured off. Omitted → the consensus actual
// (Street); pass Summit's own estimate to get Summit's implied growth, so BOTH columns carry a
// YoY/QoQ chip, not just Street (Dani, Aug 2026).
function ceGrowth(m,qi,base,cur){
  if(m.t==='basis') return null;                       // never a growth number off a basis mismatch
  if(m.u==='%') return null;                           // a %-line IS a YoY rate — no growth-of-a-growth (AMZN ad KPIs)
  var c=(cur!==undefined&&cur!==null)?cur:(m.qr[qi]?m.qr[qi][3]:null);
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
function ceMarginPct(v, rev){ return (v==null||rev==null||!rev)?null:Math.round((v/rev*100)*10)/10; }
// Margins — each margin line ÷ its OWN revenue base (Dani, Aug 2026), used by BOTH the Setup grid and the
// Post-Results cards. Consolidated lines divide by total Revenue; a SEGMENT operating income divides by
// THAT segment's net sales (segment OI ÷ total revenue is meaningless — which is why segment margins were
// absent before). The value is the metric whose actual/estimate/prior supplies the denominator.
var CE_MARGIN_DEN={
  'Gross profit':'Revenue','Operating income':'Revenue','EBITDA':'Revenue',
  'AWS operating income':'AWS net sales',
  'North America operating income':'North America net sales',
  'International operating income':'International net sales'
};
function ceMetricByKey(k){ for(var i=0;i<CE_CONS.m.length;i++){ if(CE_CONS.m[i].k===k) return CE_CONS.m[i]; } return null; }
// Post-Results DEFAULT ordering — top-to-bottom down the income statement, NOT by surprise (Dani,
// Aug 2026): top line → sales by segment → margins/expenses → profit by segment → cash & shares →
// EPS last. The "By surprise" toggle re-sorts to |Street surprise| desc. Keys are CE_CONS.m[].k;
// anything not listed sorts to the end (so a new line never silently jumps to the top).
var CE_STMT_ORDER=['Revenue','AWS net sales','North America net sales','International net sales',
  'Gross profit','Operating income','EBITDA','AWS operating income','North America operating income',
  'International operating income','Operating cash flow','Capex','D&A','Diluted shares','EPS (diluted)'];
function ceStmtIdx(k){ var i=CE_STMT_ORDER.indexOf(k); return i<0?CE_STMT_ORDER.length:i; }
// Post-Results category filter (All / Top line / Bottom line). Top line = the revenue lines; everything
// below the top line (profit, margins, cash, shares, EPS) is Bottom line. Keys are CE_CONS.m[].k.
var CE_TOPLINE={'Revenue':1,'AWS net sales':1,'North America net sales':1,'International net sales':1};
function ceCat(k){ return CE_TOPLINE[k]?'top':'bottom'; }
function ceMChip(p){ return p==null?'':'<span class="ce-mm">'+p+'% mgn</span>'; }
// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.
// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null;      // BBG revenue for the quarter
  var revS=(us['Revenue']?us['Revenue'].v:null)||revC;   // Summit revenue, else BBG
  var revQy=revM?revM.qy[qi]:null, revQq=revM?revM.qq[qi]:null;   // revenue actual 1yr / 1q earlier
  // Revenue BASE for a margin line (CE_MARGIN_DEN): total Revenue for consolidated lines, the segment's
  // own net sales for a SEGMENT operating income. Same pattern as the Post-Results cards — implied margin
  // (Street metric ÷ Street base) with the prev period (actual metric ÷ actual base). The Street-consensus
  // base differs from the metric's own consensus, but we compare like-with-like anyway (§ Dani, Aug 2026).
  function denRow(dk){ var dm=ceMetricByKey(dk); if(!dm) return null;
    var dc=(dm.qr[qi])?dm.qr[qi][3]:null;
    return { c:dc, s:(us[dk]&&us[dk].v!=null)?us[dk].v:dc, qy:dm.qy[qi], qq:dm.qq[qi] }; }
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    var denK=CE_MARGIN_DEN[m.k], mgn=!!denK, den=mgn?denRow(denK):null;
    var street=(c==null)
      ? '<span class="ce-empty">—</span>'+(m.t==='nocons'?'<span class="ce-nocons" title="The archive carries no forward estimate for this line — actuals only">no est.</span>':'')
      : ceFmtV(m.u,c)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq'))+'</span>';
    var summitCell=uv
      ? ceFmtV(m.u,uv.v)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy',uv.v))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq',uv.v))+'</span>'
      : '<span class="ce-empty">—</span>';
    // Implied margins — Street (consensus ÷ its own base) and Summit (Summit ÷ its Summit base), plus the
    // prev-period realised margin. Segment OIs use their segment net sales as base (CE_MARGIN_DEN).
    var mExpC=(mgn&&den)?ceMarginPct(c,den.c):null, mExpU=(mgn&&den)?ceMarginPct(uv?uv.v:null,den.s):null;
    var mPrevY=(mgn&&den)?ceMarginPct(m.qy[qi],den.qy):null, mPrevQ=(mgn&&den)?ceMarginPct(m.qq[qi],den.qq):null;
    // One compact table per metric — columns Street | Summit (one header each, no repeated labels), rows
    // est · margin. Single view hides the inactive column; Both widens to both (Dani, Aug 2026).
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mtbl">'+
        '<span class="ce-mrl"></span><span class="ce-mh ce-mcol-cons">Street</span><span class="ce-mh ce-mcol-us">Summit</span>'+
        '<span class="ce-mrl">est</span><span class="ce-mv ce-mcol-cons">'+street+'</span><span class="ce-mv ce-mcol-us">'+summitCell+'</span>'+
        ((mgn&&den)?('<span class="ce-mrl ce-mmc">margin</span>'+
          '<span class="ce-mv ce-mgn-v ce-mmc ce-mcol-cons">'+(mExpC!=null?mExpC+'%':'—')+'</span>'+
          '<span class="ce-mv ce-mgn-v ce-mmc ce-mcol-us">'+(mExpU!=null?mExpU+'%':'—')+'</span>'+
          ((mPrevY!=null||mPrevQ!=null)?'<span class="ce-mprev ce-mmc">'+(mPrevY!=null?'<span class="ce-mm-b yoy"><span class="ce-mprev-l">a year ago</span>'+mPrevY+'%</span>':'')+(mPrevQ!=null?'<span class="ce-mm-b qoq"><span class="ce-mprev-l">prior quarter</span>'+mPrevQ+'%</span>':'')+'</span>':'')):'')+
      '</div></div>';
  }).join('')+'</div>';
}
function ceGridStyle(){
  return '<style>'+
    '.ce-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px;margin:4px 0}'+
    '.ce-mcell{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:8px 10px;background:#fff}'+
    '.ce-mcell.cust{border-left-color:'+BRAND2+'}'+
    '.ce-mcell.flagged{border-left-color:'+GRAY+';opacity:.72}'+
    '.ce-mcell-k{font-size:10px;font-weight:700;color:var(--mu);display:flex;align-items:center;gap:4px;line-height:1.3;min-height:26px}'+
    '.ce-mcell-v{margin-top:3px}'+
    /* per-metric mini-table: columns Street | Summit (one header each). Single view hides the inactive
       estimate column; Both widens to both. Column-hide uses .ce-mtbl (spec 0,4,0) so it beats the mm rule. */
    '.ce-mtbl{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;align-items:baseline;margin-top:4px;font-variant-numeric:tabular-nums}'+
    '.ce-evwrap[data-ev="both"] .ce-mtbl{grid-template-columns:auto 1fr 1fr}'+
    '.ce-evwrap[data-ev="cons"] .ce-mtbl .ce-mcol-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-mtbl .ce-mcol-cons{display:none}'+
    '.ce-mrl{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);white-space:nowrap;align-self:center}'+
    '.ce-mh{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}'+
    '.ce-mv{font-size:13px;font-weight:900;color:var(--navy);display:flex;align-items:baseline;gap:4px;flex-wrap:wrap}'+
    '.ce-mgn-v{font-size:11px;color:'+PURPLE+'}'+
    /* prev-period realised margin — its OWN full-width row so it never widens the Street cell / breaks the
       column alignment; small + muted so it does not compete with the estimate margins. */
    /* prev-period realised margin — its OWN full-width row, set off from the estimate margins by a
       hairline so it reads as a reference, not a competing number. A small period label ("a year ago"
       / "prior quarter") makes clear which toggled period it compares against — no bare "prev". */
    '.ce-mprev{grid-column:1/-1;margin-top:3px;padding-top:3px;border-top:1px dotted var(--bdr);line-height:1.2}'+
    '.ce-mprev-l{font-size:7.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-mmc{display:none}'+
    '.ce-evwrap[data-mm="on"] .ce-mmc{display:flex}'+
    '.ce-evwrap[data-g="off"] .ce-mprev{display:none}'+   /* no toggled period → no prev line, one less thing on the card */
    '.ce-gchip{font-size:10px;font-weight:800;margin-left:2px}'+
    '.ce-mm{display:none}'+'.ce-mm-b{display:none;font-size:9.5px;font-weight:800;color:var(--navy);white-space:nowrap;align-items:baseline}'+'.ce-evwrap[data-mm="on"][data-g="yoy"] .ce-mm-b.yoy{display:inline-flex}'+'.ce-evwrap[data-mm="on"][data-g="qoq"] .ce-mm-b.qoq{display:inline-flex}'+
    '.ce-evwrap[data-mm="on"] .ce-mm{display:inline}'+
    '.ce-nocons{font-size:8.5px;font-weight:800;color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:1px 6px;margin-left:6px}'+
    /* the growth lens: CSS-driven, so switching does not re-render the grid */
    '.ce-evwrap[data-g="yoy"] .ce-gq,.ce-evwrap[data-g="qoq"] .ce-gy,'+
    '.ce-evwrap[data-g="off"] .ce-gy,.ce-evwrap[data-g="off"] .ce-gq{display:none}'+
    '.ce-gseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.ce-gseg button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+
    '.ce-gseg button.active{background:var(--navy);color:#fff}'+'.ce-vdf{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+'.ce-vdf button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+'.ce-vdf button.active{background:var(--navy);color:#fff}'+
    /* verdict filter — data-f on the .ce-fz root drives BOTH the cards (.ce-fz-t) and the chart rows
       (.ce-dv-row), each estimate-view-aware (data-vdc = Street verdict, data-vdu = Summit verdict) */
    '.ce-fz[data-ev="cons"][data-f="beat"] .ce-fz-t:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"][data-f="miss"] .ce-fz-t:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"][data-f="inline"] .ce-fz-t:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"][data-f="beat"] .ce-fz-t:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"][data-f="miss"] .ce-fz-t:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"][data-f="inline"] .ce-fz-t:not([data-vdu="inline"]),'+'.ce-fz[data-ev="cons"][data-f="beat"] .ce-dv-row:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"][data-f="miss"] .ce-dv-row:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"][data-f="inline"] .ce-dv-row:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"][data-f="beat"] .ce-dv-row:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"][data-f="miss"] .ce-dv-row:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"][data-f="inline"] .ce-dv-row:not([data-vdu="inline"]){display:none}'+
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
      // (Foot caption "Frozen at call time…" removed — Dani, Aug 2026.)
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
  var cev=ceConsensusEvoRoot(); if(cev && !cev._cevInit){ cev._cevInit=true; consensusEvo.init(cev, 'AMZN', 'rev'); }
}
// (ceFitIRRow removed — the IR + EDGAR pair no longer lives in the Earnings tab; it is a logo-only
//  pair in the Company Profile header now, so there is nothing to width-cap here. Dani, Aug 2026.)
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
     '.aed-mini.alt{background:var(--w);color:'+BRAND2+'}.aed-mini{transition:filter .14s,transform .06s}.aed-mini:hover{filter:brightness(1.08)}.aed-mini:active{transform:translateY(1px)}'+
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
    return { k:m.k, cS:cS, uS:uS, c:c, uexp:uexp, a:a, u:m.u };
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
  // Default order = statement order (same as the cards); --od carries the |Street surprise| rank so the
  // "By surprise" toggle reflows in pure CSS — one data-ord on .ce-fz drives both the cards and this chart.
  rows.forEach(function(r){ r.stmt=ceStmtIdx(r.k); r.sa=(r.cS==null?-1:Math.abs(r.cS)); });
  rows.slice().sort(function(a,z){ return z.sa-a.sa; }).forEach(function(r,i){ r.od=i; });
  rows=rows.slice().sort(function(a,z){ return (a.stmt-z.stmt) || (a.od-z.od); });
  // Bar lives in a bounded track (no floating labels); the number sits in its own right column, so
  // nothing overflows and every metric name gets a full column. Bar width caps at the axis.
  function bar(v, cls){
    if(v==null) return '<span class="ce-dv-dot '+cls+'"></span>';
    var k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    var w=Math.min(Math.abs(v),axisMax)/axisMax*50;
    return '<span class="ce-dv-bar '+cls+' '+(v>=0?'pos':'neg')+' '+k+'" style="width:'+w.toFixed(1)+'%"></span>';
  }
  function val(v, cls){
    if(v==null) return '<span class="ce-dv-v '+cls+' none">—</span>';
    var over=Math.abs(v)>axisMax, k=(Math.abs(v)<2)?'inline':(v>0?'beat':'miss');
    return '<span class="ce-dv-v '+cls+' '+k+'">'+(v>=0?'+':'−')+(Math.round(Math.abs(v)*10)/10)+'%'+(over?'▸':'')+'</span>';
  }
  // Hover reads the WHOLE ROW (bars for a small surprise are only ~2px wide — too thin to point at),
  // so the tooltip target is the full row and it carries BOTH bases: metric · expected (its own
  // value+unit) · actual · surprise %. The tip is a visible styled card (::after on data-tip), not a
  // native title, so it is legible even when the list runs long.
  function tipRow(basis, cls, exp, a, v, u){
    if(v==null && exp==null) return '';
    var col=(v==null)?'#9AA4B0':(Math.abs(v)<2?'#9AA4B0':(v>0?'#0a8f4c':RED));
    var pct=(v==null)?'no est.':((v>=0?'+':'−')+(Math.round(Math.abs(v)*10)/10)+'%');
    return '<div class="ce-dv-tip-l"><span class="ce-dv-tip-b '+cls+'">'+basis+'</span>'+
      '<span class="ce-dv-tip-x">exp <b>'+(ceFmtV(u,exp)||'—')+'</b> · act <b>'+(ceFmtV(u,a)||'—')+'</b></span>'+
      '<span class="ce-dv-tip-p" style="color:'+col+'">'+pct+'</span></div>';
  }
  // verdict per basis (mirrors ceVerdict.k) so the All/Beats/Misses filter works on the chart too
  function vk(surp, exp, a){ if(a==null) return 'none'; if(exp==null) return 'noest'; if(surp==null) return 'none'; return (Math.abs(surp)<2)?'inline':(surp>0?'beat':'miss'); }
  var rowsHtml=rows.map(function(r){
    var tip='<div class="ce-dv-tip"><div class="ce-dv-tip-h">'+esc(r.k)+'</div>'+
      tipRow('Street','ce-exp-cons',r.c,r.a,r.cS,r.u)+tipRow('Summit','ce-exp-us',r.uexp,r.a,r.uS,r.u)+'</div>';
    return '<div class="ce-dv-row" data-vdc="'+vk(r.cS,r.c,r.a)+'" data-vdu="'+vk(r.uS,r.uexp,r.a)+'" style="--od:'+r.od+'">'+
      '<span class="ce-dv-k" title="'+esc(r.k)+'">'+esc(r.k)+'</span>'+
      '<span class="ce-dv-track"><span class="ce-dv-zero"></span>'+bar(r.cS,'ce-exp-cons')+bar(r.uS,'ce-exp-us')+'</span>'+
      '<span class="ce-dv-vwrap">'+val(r.cS,'ce-exp-cons')+val(r.uS,'ce-exp-us')+'</span>'+
      tip+
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
  var GRN='#0a8f4c';
  var revQY=revM?revM.qy[qi]:null, revQQ=revM?revM.qq[qi]:null;
  // Revenue base for a margin line: actual / Street / Summit / prior-year / prior-quarter of the metric
  // named in CE_MARGIN_DEN (total Revenue for consolidated lines, the segment's net sales for a segment OI).
  function denVals(dk){
    var dm=ceMetricByKey(dk); if(!dm) return null;
    var dc=(dm.qr[qi])?dm.qr[qi][3]:null;
    return { a:dm.qa[qi], c:dc, s:(us[dk]&&us[dk].v!=null)?us[dk].v:dc, qy:dm.qy[qi], qq:dm.qq[qi] };
  }
  // Signed, coloured growth: value ÷ prior − 1 (prior = the YoY or QoQ actual). "—" when unknown.
  function ceGwSpan(val, prior){
    if(val==null||prior==null||!prior) return '<span class="ce-tv-e">—</span>';
    var gv=Math.round((val/prior-1)*100);
    return '<span style="color:'+(gv>=0?GRN:RED)+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
  }
  // Realised margin %, NO sign — the colour carries direction: green = EXPANSION vs the prior period,
  // red = contraction, on the SAME YoY/QoQ lens as growth (a seasonally soft QoQ can read red while
  // YoY reads green). "—" prior = neutral (navy).
  function ceMgExpSpan(real, prior){
    if(real==null) return '<span class="ce-tv-e">—</span>';
    var col=(prior==null)?'var(--navy)':(real>=prior?GRN:RED);
    return '<span style="color:'+col+';font-weight:800">'+real+'%</span>';
  }
  // Pass 1 — compute every line's numbers. We need all surprises before we can rank (for the
  // "By surprise" order toggle), so no HTML is built yet.
  var rows=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;   // Summit's FROZEN expectation for this line
    if(c==null&&a==null&&uexp==null) return null;
    // Surprise = actual / expected − 1, for BOTH bases (the vs Street ⇄ vs Summit toggle picks one).
    var cSurp=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uSurp=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    return { m:m, c:c, a:a, uexp:uexp, cSurp:cSurp, uSurp:uSurp,
      cV:ceVerdict(m,c,a,cSurp), uV:ceVerdict(m,uexp,a,uSurp),
      py:m.qy[qi], pq:m.qq[qi], stmt:ceStmtIdx(m.k),
      surpAbs:(cSurp==null?-1:Math.abs(cSurp)) };
  }).filter(Boolean);
  if(!rows.length) return '';
  // --od = rank by |Street surprise| desc (the "By surprise" order); default DOM order is statement order.
  rows.slice().sort(function(x,z){ return z.surpAbs-x.surpAbs; }).forEach(function(r,i){ r.od=i; });
  rows.sort(function(x,z){ return (x.stmt-z.stmt) || (x.od-z.od); });   // top-to-bottom down the statement, EPS last
  var tiles=rows.map(function(r){
    var m=r.m, c=r.c, a=r.a, uexp=r.uexp, cV=r.cV, uV=r.uV;
    var sp=function(s){ return (s==null)?'':' <span class="ce-fz-sp">'+(s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%</span>'; };
    var surpFmt=function(s){ return (s==null)?'—':((s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%'); };
    var actStr=(a==null?'—':ceTkFmt(m.u,a));
    // Margins — each margin line ÷ its OWN base (CE_MARGIN_DEN): Street-implied, Summit-implied, realised.
    var denK=CE_MARGIN_DEN[m.k], mgnOn=!!denK, den=mgnOn?denVals(denK):null;
    var mReal=(mgnOn&&den)?ceMarginPct(a,den.a):null;
    var mExpC=(mgnOn&&den)?ceMarginPct(c,den.c):null, mExpU=(mgnOn&&den)?ceMarginPct(uexp,den.s):null;
    var mPY=(mgnOn&&den&&r.py!=null)?ceMarginPct(r.py,den.qy):null;
    var mPQ=(mgnOn&&den&&r.pq!=null)?ceMarginPct(r.pq,den.qq):null;
    var hasMgn=(mgnOn&&mReal!=null);
    // Both-mode verdict chip: "BEAT ×2" when Street & Summit agree, "MIXED" (amber) when they disagree in
    // direction; falls back to the single available verdict. Single view keeps the plain top-right badge.
    var cK=cV.k, uK=uV.k, cHas=(cK==='beat'||cK==='miss'||cK==='inline'), uHas=(uK==='beat'||uK==='miss'||uK==='inline');
    var mixed=(cHas&&uHas&&cK!==uK);
    var bothV=(cHas&&uHas)?((cK===uK)?{l:cV.l+' ×2',c:cV.c}:{l:'MIXED',c:AMBER}):(cHas?{l:cV.l,c:cV.c}:(uHas?{l:uV.l,c:uV.c}:{l:'—',c:'#6b7684'}));
    var hdr='<div class="ce-fz-k"><span class="ce-fz-kn">'+esc(m.k)+'</span>'+
      '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+sp(r.cSurp)+'</span>'+
      '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+sp(r.uSurp)+'</span>'+
      '<span class="ce-fz-vd ce-vd-both" style="color:'+bothV.c+'">'+bothV.l+'</span></div>';
    function gcell(v){ return '<span class="ce-gy">'+ceGwSpan(v,r.py)+'</span><span class="ce-gq">'+ceGwSpan(v,r.pq)+'</span>'; }
    // The table — columns Street | Summit | Actual, ONE header each (no per-cell labels). In single view
    // the inactive estimate column is hidden (CSS); in Both all three show. Rows: value · growth · margin
    // · surprise (surprise only in Both). data-vdc/data-vdu carry both verdicts for the CSS filter.
    var tbl='<div class="ce-fz-tbl">'+
      '<span class="ce-fz-rl"></span>'+
      '<span class="ce-fz-ch ce-col-cons">Street</span>'+
      '<span class="ce-fz-ch ce-col-us">Summit</span>'+
      '<span class="ce-fz-ch ce-col-act">Actual</span>'+
      '<span class="ce-fz-rl"></span>'+
      '<span class="ce-fz-cv ce-fz-exp ce-col-cons">'+(c==null?'—':ceTkFmt(m.u,c))+'</span>'+
      '<span class="ce-fz-cv ce-fz-exp ce-col-us">'+(uexp==null?'—':ceTkFmt(m.u,uexp))+'</span>'+
      '<span class="ce-fz-cv ce-fz-act ce-col-act">'+actStr+'</span>'+
      '<span class="ce-fz-rl ce-fz-gc">Growth</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-cons">'+gcell(c)+'</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-us">'+gcell(uexp)+'</span>'+
      '<span class="ce-fz-cv ce-fz-gc ce-col-act">'+gcell(a)+'</span>'+
      (hasMgn?('<span class="ce-fz-rl ce-fz-mc">Margin</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-cons">'+(mExpC!=null?mExpC+'%':'—')+'</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-us">'+(mExpU!=null?mExpU+'%':'—')+'</span>'+
        '<span class="ce-fz-cv ce-fz-mc ce-col-act"><span class="ce-gy">'+ceMgExpSpan(mReal,mPY)+'</span><span class="ce-gq">'+ceMgExpSpan(mReal,mPQ)+'</span></span>'):'')+
      '<span class="ce-fz-rl ce-fz-surp">Surprise</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-cons" style="color:'+cV.c+';font-weight:800">'+surpFmt(r.cSurp)+' '+cV.l+'</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-us" style="color:'+uV.c+';font-weight:800">'+surpFmt(r.uSurp)+' '+uV.l+'</span>'+
      '<span class="ce-fz-cv ce-fz-surp ce-col-act"></span>'+
    '</div>';
    return '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'" data-cat="'+ceCat(m.k)+'" data-mixed="'+(mixed?1:0)+'" style="--od:'+r.od+'">'+hdr+tbl+'</div>';
  });
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="on" data-view="cards" data-ord="stmt" data-fzcat="all"><div class="ce-fz-h">The print — down the income statement'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from <code>BBG_CONSENSUS.txt</code>: the last snapshot before the print carries the consensus (<code>fq+1</code>), a later snapshot carries the print (<code>fq0</code>). Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>Order</b> — by default the lines read top-to-bottom down the income statement (top line → sales by segment → margins → profit by segment → cash &amp; shares → EPS last). <b>By surprise</b> re-sorts to the biggest |Street surprise| first.</li>'+
      '<li><b>vs Street ⇄ vs Summit ⇄ Both</b> — which frozen expectation the print is scored against (Street = Bloomberg, Summit = ours). <b>Both</b> shows the two side by side; since one BEAT/MISS badge can\'t score two references it becomes a <b>Surprise</b> row (Both only) plus a <b>MIXED</b> flag when Street and Summit disagree. Where Summit had no number it reads <b>—</b> (only Revenue, Operating income and the segment net-sales are modelled).</li>'+
      '<li><b>Growth</b> — the estimate\'s implied growth and the print\'s own growth, YoY or QoQ per the toggle, signed.</li>'+
      '<li><b>Margin</b> — GP / Operating income / EBITDA carry an expected (estimate-implied) and a realised margin; the realised one is coloured by expansion vs the prior period on the same YoY/QoQ lens.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise; <b>no est.</b> where that basis had no number</li></ul>'+
      '<p>The cards are pure metrics. Notes, Watch-List context and call colour live in the Notes tab and the highlights below — not on the card. Lines the archive does not track are not shown here (a disclosure with no consensus is a supplemental call note, not a scored line).</p>')+
    // Fixed toggle order (Dani, Aug 2026): Cards/Chart · vs Street/Summit · All/Beats/Misses · order.
    // These four apply to BOTH views and must NEVER shift when switching Cards ⇄ Chart, so no auto-margin
    // and nothing collapses. Margin + YoY only change the cards, so they sit LAST and go visibility:hidden
    // (slot kept) in Chart via .ce-gseg-cardsonly — the four above stay put.
    '<span class="ce-gseg"><button type="button" class="active" data-fzview="cards">Cards</button>'+
      '<button type="button" data-fzview="chart">Chart</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button>'+
      '<button type="button" data-fzev="both">Both</button></span>'+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-fzord="stmt">Statement order</button>'+
      '<button type="button" data-fzord="surp">By surprise</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-fzcat="all">All</button>'+
      '<button type="button" data-fzcat="top">Top line</button>'+
      '<button type="button" data-fzcat="bottom">Bottom line</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-fzmm="on">Margin</button>'+
      '<button type="button" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg ce-gseg-cardsonly"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div>'+cePrintChart(qi, us)+'<div class="ce-fz-g" data-vdf-host>'+tiles.join('')+'</div></div>';
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
    '.ce-fz-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}'+
    '@media(max-width:900px){.ce-fz-g{grid-template-columns:repeat(2,1fr)}}'+
    '@media(max-width:520px){.ce-fz-g{grid-template-columns:1fr}}'+
    '.ce-fz-t{border:1px solid var(--bdr);border-radius:9px;padding:7px 9px;background:#fff}'+
    '.ce-fz-t.basis{opacity:.62}'+
    '.ce-fz-k{font-size:10px;font-weight:800;color:var(--navy);line-height:1.25}'+
    '.ce-fz-kn{flex:1 1 auto;min-width:0}'+   /* full metric name, wraps — NEVER truncated (e.g. "…operating income") */
    /* the table layout — Street/Summit est. | Actual columns, with Growth / Margin rows below (Dani, Aug 2026) */
    '.ce-fz-tbl{display:grid;grid-template-columns:auto 1fr 1fr;gap:3px 8px;margin-top:6px;align-items:baseline;font-variant-numeric:tabular-nums}'+
    '.ce-fz-rl{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);white-space:nowrap;align-self:center}'+
    '.ce-fz-ch{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);text-align:right}'+
    '.ce-fz-cv{font-size:11px;font-weight:700;color:var(--navy);text-align:right}'+
    '.ce-fz-exp{color:var(--mu)}'+
    '.ce-fz-act{font-size:13px;font-weight:900;color:var(--navy)}'+
    '.ce-tv-e{color:var(--mu);font-weight:600}'+
    '.ce-fz-sp{font-weight:900;margin-left:3px;font-size:11.5px}'+
    /* ordering — statement order is DOM order (default); --od reflows to |surprise| desc on the toggle */
    '.ce-fz[data-ord="surp"] .ce-fz-t{order:var(--od)}'+
    '.ce-fz[data-ord="surp"] .ce-dv-row{order:var(--od)}'+
    /* Chart view — Margin + YoY/QoQ toggles do nothing to the chart, so hide them; visibility (not
       display) keeps their slot so the toggles shared by both views never shift on Cards ⇄ Chart. */
    '.ce-fz[data-view="chart"] .ce-gseg-cardsonly{visibility:hidden}'+
    /* ── The card is a compact detail table (columns Street | Summit | Actual) — no flip, no clean toggle ── */
    '.ce-fz-t:hover{box-shadow:0 4px 14px rgba(16,24,40,.10)}'+
    '.ce-fz-f{font-size:9.5px;color:var(--mu);margin-top:8px}'+'.ce-fz-t{position:relative;transition:.14s}'+'.ce-fz-t[data-detail]{cursor:pointer}'+'.ce-fz-t[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.10);transform:translateY(-1px)}'+'.ce-fz-vd{margin-left:auto;font-size:10.5px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}'+'.ce-fz-k{display:flex;align-items:flex-start;gap:5px;flex-wrap:wrap}'+'.ce-fz-wl{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:'+BLUE+';margin-top:5px}'+'.ce-fz-more{position:absolute;right:9px;bottom:7px;font-size:8.5px;font-weight:800;color:'+BLUE+'}'+'.ce-fz-h{display:flex;align-items:center;gap:6px}'+'.ce-fz-gr{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:9.5px;font-weight:800}'+'.ce-fz-gl{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+'.ce-fz-mgn{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:11px;font-weight:900;color:'+PURPLE+'}'+'.ce-fz-mexp{font-size:9px;font-weight:700;color:var(--mu)}'+'.ce-fz-g-e{color:var(--mu);font-weight:600}'+'.ce-fz .ce-gq{display:none}.ce-fz[data-g="qoq"] .ce-gy{display:none}.ce-fz[data-g="qoq"] .ce-gq{display:inline}.ce-fz[data-g="off"] .ce-fz-gc{display:none}'+
    /* estimate view (vs Street ⇄ vs Summit) — pure-CSS swap of expected value, surprise & verdict */
    '.ce-fz-h{flex-wrap:wrap}'+
    '.ce-vd-us,.ce-exp-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-cons,.ce-fz[data-ev="us"] .ce-exp-cons{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-us,.ce-fz[data-ev="us"] .ce-exp-us{display:inline}'+
    /* margin row (GP / Operating income / EBITDA) — 3 grid cells, hidden until the Margin toggle is on.
       Actual margin is coloured by expansion vs the prior period on the YoY/QoQ lens (inline styles). */
    '.ce-fz-mc{display:none}'+
    '.ce-fz[data-mm="on"] .ce-fz-mc{display:block}'+
    /* Both mode — the single verdict badge gives way to the Both chip; the Surprise row and the Summit
       column appear. Column-hide uses .ce-fz-tbl in the selector (specificity 0,4,0) so it beats the
       margin/surprise show rules; the grid widens to Street+Summit+Actual. MIXED cards get an amber outline. */
    '.ce-vd-both{display:none}'+
    '.ce-fz[data-ev="both"] .ce-vd-cons,.ce-fz[data-ev="both"] .ce-vd-us{display:none}'+
    '.ce-fz[data-ev="both"] .ce-vd-both{display:inline}'+
    '.ce-fz[data-ev="cons"] .ce-fz-tbl .ce-col-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-fz-tbl .ce-col-cons{display:none}'+
    '.ce-fz[data-ev="both"] .ce-fz-tbl{grid-template-columns:auto 1fr 1fr 1fr}'+
    '.ce-fz-surp{display:none}'+
    '.ce-fz[data-ev="both"] .ce-fz-surp{display:block}'+
    '.ce-fz[data-ev="both"] .ce-fz-t[data-mixed="1"]{outline:1.5px solid '+AMBER+';outline-offset:-1px}'+
    '.ce-fz[data-ev="both"] .ce-vdf{visibility:hidden}'+
    /* category filter — All / Top line / Bottom line (cards) */
    '.ce-fz[data-fzcat="top"] .ce-fz-t:not([data-cat="top"]){display:none}'+
    '.ce-fz[data-fzcat="bottom"] .ce-fz-t:not([data-cat="bottom"]){display:none}'+
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
    /* (AI call-summary styles removed with the section, Dani Aug 2026) */
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
    /* collapsed-by-default dropdown wrappers — The call classified and Propose Notes are separate cards */
    '.ce-cc-wrap,.ce-tp-wrap{margin-top:14px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    /* tinted header so the dropdown bar never reads as one of the white Prepared-Remarks / Q&A cards below */
    '.ce-cc-sum,.ce-tp-sum{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:12px 14px;user-select:none;background:linear-gradient(180deg,#E8EEF6,#F1F5FA);border-bottom:1px solid var(--bdr)}'+
    '.ce-cc-wrap:not([open])>.ce-cc-sum,.ce-tp-wrap:not([open])>.ce-tp-sum{border-bottom:0}'+
    '.ce-cc-sum:hover,.ce-tp-sum:hover{background:linear-gradient(180deg,#DFE7F2,#E9EFF7)}'+
    '.ce-cc-sum::-webkit-details-marker,.ce-tp-sum::-webkit-details-marker{display:none}'+
    '.ce-cc-sum-t,.ce-tp-sum-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-cc-sum-s,.ce-tp-sum-s{font-size:10px;font-weight:600;color:var(--mu);flex:1}'+
    '.ce-cc-ar2{font-size:10px;color:var(--mu);transition:transform .18s;flex:none}'+
    'details[open]>.ce-cc-sum .ce-cc-ar2,details[open]>.ce-tp-sum .ce-cc-ar2{transform:rotate(180deg)}'+
    '.ce-cc-wrap>.ce-cc{margin:0;border:0;border-radius:0;border-top:1px solid var(--bdr)}'+
    '.ce-tp-wrap>.ce-tp{border-top:1px solid var(--bdr)}'+
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
    '.ce-tp-fld{display:flex;align-items:center;gap:5px;min-width:0}'+
    '.ce-tp-lb{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu);flex:none}'+
    '.ce-tp-seg,.ce-tp-sub{min-width:0;max-width:210px;font-family:inherit;font-size:10px;font-weight:700;color:'+BLUE+';border:1px solid var(--bdr);border-radius:6px;padding:4px 6px;background:#F7F9FC;cursor:pointer}'+
    '.ce-tp-seg:focus,.ce-tp-sub:focus{outline:none;border-color:'+BLUE+'}'+
    '.ce-tp-newsub,.ce-tp-newseg{display:block;width:100%;box-sizing:border-box;font-family:inherit;font-size:10.5px;font-weight:600;color:var(--navy);border:1px solid '+AMBER+';border-radius:6px;padding:5px 8px;background:#FFFDF7;margin-bottom:6px}'+
    '.ce-tp-newsub[hidden],.ce-tp-newseg[hidden]{display:none}'+
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
    '.ce-tp-pub{font-family:inherit;font-size:9px;font-weight:900;letter-spacing:.03em;text-transform:uppercase;color:#fff;background:'+BLUE+';border:0;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.14s}'+
    '.ce-tp-pub:hover{filter:brightness(1.08)}.ce-tp-pub:disabled{opacity:.5;cursor:default}'+
    '.ce-tp-status{font-size:9px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--mu)}'+
    '.ce-tp-chip.published{border-left-color:'+BLUE+';opacity:.72}'+
    '.ce-tp-chip.published .ce-tp-chip-tag::after{content:" · in Notes";color:'+BLUE+';font-weight:800}'+
    '.ce-tp-chip.dup{border-left-color:'+RED+';opacity:.72}'+
    '.ce-tp-chip.dup .ce-tp-chip-tag::after{content:" · already filed";color:'+RED+';font-weight:800}'+
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
    '.ce-dv-row{position:relative;display:grid;grid-template-columns:148px 1fr 52px;gap:10px;align-items:center}'+
    /* full-row hover tooltip — the bars themselves are too thin to point at, so the whole row is the target */
    '.ce-dv-row:hover{background:rgba(148,163,184,.07);border-radius:6px}'+
    '.ce-dv-tip{display:none;position:absolute;left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);z-index:30;background:#fff;border:1px solid var(--bdr);'+
      'border-radius:10px;box-shadow:0 10px 26px rgba(15,23,42,.22);padding:9px 11px;min-width:236px;max-width:340px;pointer-events:none}'+
    '.ce-dv-row:hover .ce-dv-tip{display:block}'+
    '.ce-dv-tip::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#fff}'+
    '.ce-dv-tip-h{font-size:10.5px;font-weight:800;color:var(--navy);margin-bottom:6px}'+
    '.ce-dv-tip-l{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:600;color:var(--navy);margin-top:4px;white-space:nowrap}'+
    '.ce-dv-tip-b{font-size:8px;font-weight:900;letter-spacing:.04em;padding:2px 7px;border-radius:999px;flex:none}'+
    '.ce-dv-tip-b.ce-exp-cons{color:'+BLUE+';background:rgba(37,87,214,.11)}'+
    '.ce-dv-tip-b.ce-exp-us{color:'+PURPLE+';background:rgba(122,90,248,.12)}'+
    '.ce-dv-tip-x{flex:1;color:var(--mu);font-weight:600}.ce-dv-tip-x b{color:var(--navy);font-weight:800}'+
    '.ce-dv-tip-p{font-weight:900;font-variant-numeric:tabular-nums;flex:none}'+
    '@media(max-width:560px){.ce-dv-row{grid-template-columns:104px 1fr 46px}}'+
    '.ce-dv-k{font-size:9.5px;font-weight:700;color:var(--navy);text-align:right;line-height:1.2}'+   /* wraps — full name, never truncated */
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
    /* All/Beats/Misses now filters the chart too, so it STAYS visible in Chart (no display:none — that
       is what made the row collapse and the other toggles jump). */
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
    // The AI-generated "Call summary — the minute" was REMOVED (Dani, Aug 2026) — no AI-authored section.
    // ② "Points for the call" was REMOVED (Aug 2026) per Dani — the red-line/tee-up cards were noise.
    // 4 · ③ The call, classified — Prepared Remarks ⇄ Q&A toggle, each item tagged to a Watch List
    //     theme (Aug 2026). Scaffold: renders a placeholder until q.call.prepared / q.call.qanda fill.
    b+=ceCallClassified(q, qk);
    // 5 · "Also on the call" — the supplemental colour (was the Post-Call tab, dissolved Jul 2026).
    // Kept at the very BOTTOM for now. NOT the tracking layer (Watch List) nor the meeting-critical
    // read (the scorecard). Includes non-trackable call colour.
    b+=ceHighlightsBlock(q.call, qk, q.q);
    // (Foot caption "Numbers scored against the frozen expectation…" removed — Dani, Aug 2026.)
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
      '<summary class="ce-cc-row-h"><span class="ce-cc-topic">'+esc(p.topic||'')+'</span>'+
        (p.body?'<span class="ce-cc-ar">▾</span>':'')+'</summary>'+
      (p.body?'<div class="ce-cc-row-b">'+p.body+ceNoteAddBtn(q.q, ceStripHtml(p.body)||p.topic)+'</div>':'')+
    '</details>';
  }).join('') : '<div class="ce-cc-empty">Prepared-remarks topics land here once the call is processed.</div>';
  var qaBody = qa.length ? qa.map(function(x,i){
    // THEME-LED (Aug 2026): the collapsed row leads with the theme tag + the question's topic — NOT the
    // bank. Open it and the bank/analyst sit at the top, then the question (Q) and the answer (A). A is
    // management's answer IN THEIR OWN WORDS — direct, attributed speech in quotes with the relevant parts
    // bolded (a holds raw HTML), never a third-person summary. `qFull` (optional) is the fuller question.
    var parts=String(x.analyst||'').split('·');
    var name=(parts[0]||'').trim(), bank=(parts[1]||'').trim();
    var qLine=x.qFull||x.q||'';
    return '<details class="ce-cc-row ce-cc-qarow">'+
      '<summary class="ce-cc-row-h">'+
        '<span class="ce-cc-topic">'+esc(x.q||x.theme||'')+'</span>'+
        '<span class="ce-cc-ar">▾</span></summary>'+
      '<div class="ce-cc-row-b">'+
        '<div class="ce-cc-qa-h">'+
          (bank?'<span class="ce-cc-bank">🏦 '+esc(bank)+'</span>':'')+
          (name?'<span class="ce-cc-analyst">'+esc(name)+'</span>':'')+
        '</div>'+
        (qLine?'<div class="ce-cc-q"><span class="ce-cc-ql">Q</span><span>'+esc(qLine)+'</span></div>':'')+
        (x.a?'<div class="ce-cc-a"><span class="ce-cc-al">A</span><span>'+x.a+'</span></div>':'')+
        ceNoteAddBtn(q.q, ceStripHtml(x.a)||x.q||x.theme||'')+
      '</div>'+
    '</details>';
  }).join('') : '<div class="ce-cc-empty">Every analyst question, tagged to its theme, with the bank and the answer inside — lands here once the call is processed.</div>';
  // "The call, classified" is its OWN collapsed dropdown (closed by default); Propose Notes is a
  // SEPARATE sibling section (also its own dropdown) so the two never read as one block.
  return '<details class="ce-cc-wrap">'+
    '<summary class="ce-cc-sum"><span class="ce-cc-sum-t">Call Summary</span>'+
      '<span class="ce-cc-sum-s">prepared remarks &amp; analyst Q&amp;A</span><span class="ce-cc-ar2">▾</span></summary>'+
    '<div class="ce-cc">'+
      '<div class="ce-cc-h">'+
        '<span class="ce-cc-seg"><button type="button" class="active" data-ccv="pr">By Prepared Remarks</button>'+
          '<button type="button" data-ccv="qa">By Analyst Question</button></span>'+
      '</div>'+
      '<div class="ce-cc-pane" data-ccp="pr">'+prBody+'</div>'+
      '<div class="ce-cc-pane" data-ccp="qa" hidden>'+qaBody+'</div>'+
    '</div>'+
  '</details>'+
  ceThemeProposals(q, qk);
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
  // A proposed note can file under an EXISTING theme OR create a NEW one (Dani, Aug 2026) — the
  // "＋ New theme…" option reveals a name field and forces the sub-theme to new (a fresh theme has
  // no sub-themes yet). Publishing creates the theme record (cePublishNoteToRecord), same as the ✎ editor.
  return '<select class="ce-tp-seg" title="Theme (segment) — where the note is filed">'+ceSegsList().map(function(s){
    return '<option value="'+esc(s).replace(/"/g,'&quot;')+'"'+(s===sel?' selected':'')+'>'+esc(s)+'</option>';
  }).join('')+'<option value="__newseg__">＋ New theme…</option></select>';
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
    var tg=ceGuessTarget(txt);
    return '<div class="ce-tp-card" data-tp="'+qk+'-'+i+'">'+
      '<div class="ce-tp-row1">'+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Theme</label>'+ceSegSelectHtml(tg.seg)+'</span>'+
        '<span class="ce-tp-fld"><label class="ce-tp-lb">Sub-theme</label>'+ceSubSelectHtml(tg.seg, tg.theme)+'</span>'+
        '<span class="ce-tp-acts">'+
          '<button type="button" class="ce-tp-ok" data-tpact="accept" title="Stage this note">✓ Accept</button>'+
          '<button type="button" class="ce-tp-no" data-tpact="reject" title="Drop this note">✕</button>'+
        '</span></div>'+
      '<input class="ce-tp-newseg" type="text" placeholder="New theme name" hidden>'+
      '<input class="ce-tp-newsub" type="text" placeholder="New sub-theme name" hidden>'+
      '<div class="ce-tp-target" data-tptarget></div>'+
      '<textarea class="ce-tp-in" rows="2">'+esc(txt)+'</textarea>'+
    '</div>';
  }).join('');
  return '<details class="ce-tp-wrap">'+
    '<summary class="ce-tp-sum"><span class="ce-tp-ic">📝</span><span class="ce-tp-sum-t">Propose Notes</span>'+
      '<span class="ce-tp-sum-s">draft the call&#39;s takeaways → publish to the Notes tab</span><span class="ce-cc-ar2">▾</span></summary>'+
    '<div class="ce-tp" data-tpq="'+esc(q.q||'')+'">'+
      '<div class="ce-tp-h">'+
        '<button type="button" class="ce-tp-refresh" data-tprefresh title="Bring back the notes you rejected">↻ Rejected <span data-tprej>0</span></button>'+
      '</div>'+
      '<div class="ce-tp-list" data-tplist>'+cards+'</div>'+
      '<div class="ce-tp-staged-h">Staged notes <span class="ce-tp-count" data-tpcount>0</span>'+
        '<button type="button" class="ce-tp-pub" data-tppublish title="File the staged notes into the theme record on the Notes tab">Publish to Notes →</button>'+
        '<span class="ce-tp-status" data-tpstatus></span></div>'+
      '<div class="ce-tp-staged" data-tpstaged><div class="ce-tp-empty">Nothing staged yet — accept a note above.</div></div>'+
    '</div>'+
  '</details>';
}
// E · "Also on the call" ── the supplemental colour from the call, rendered inside Post-Results as a
// SINGLE BOX holding a plain LIST, each point with its own native <details> dropdown (v2.9). The
// Context/Logged band classification and the triage strip are GONE (Dani did not want them). Still
// not the meeting-critical read (that is the scorecard + the Watch List): a thesis-mover (band:'lead')
// is tracked on the Watch List and stays filtered out here. `take`/`threeMinutes`/`notBringing`/
// `newQuestions` survive as data (newQuestions still seeds the next Watch List) but are not rendered.
function ceHighlightsBlock(cc, qk, qlabel){
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
      (det?'<div class="ce-also-body">'+det+ceNoteAddBtn(qlabel, ceStripHtml(det)||x.head)+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></details>';
  return b;
}

// F · (REMOVED, Dani Aug 2026) The AI-generated "Call summary — the minute" — the whole AI-authored
// section is gone: no ceSummaryBlock / ceSumNodes / ceSumMore, no `results.summary` render, no build
// instruction. Post-Results goes straight from the print to "The call, classified".

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
  // now supports Both here too). `vs Street ⇄ vs Summit ⇄ Both` sets data-ev (swaps the frozen
  // expectation the print is scored against); `Margin` sets data-mm (expected-implied → realized).
  pane.querySelectorAll('.ce-gseg button[data-fzev]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzev'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(!fz) return;
    fz.setAttribute('data-ev', v);
    // The beat/miss filter can't score two references — clear it and reset the pills to All when entering Both
    // (the filter group is hidden in Both by CSS; this stops a stale filter from carrying over on the way out).
    if(v==='both'){ fz.removeAttribute('data-f'); var vdf=fz.querySelector('.ce-vdf');
      if(vdf) vdf.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-vdf')==='all'); }); }
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
  // Statement order ⇄ By surprise — sets data-ord on the .ce-fz; both the cards and the chart reflow
  // in pure CSS via each row's --od (surprise rank). Default is statement order (top-to-bottom).
  pane.querySelectorAll('.ce-gseg button[data-fzord]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzord'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-ord', v);
  }; });
  // Metric-category filter — All / Top line / Bottom line; sets data-fzcat on the .ce-fz (pure-CSS filter).
  pane.querySelectorAll('.ce-gseg button[data-fzcat]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzcat'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-fzcat', v);
  }; });
  // Per-point "＋ add note" (Prepared Remarks / Q&A / Also on the call) — opens the manual note composer;
  // reuses the note engine (cePublishNoteToRecord) but the user files Theme/Sub-theme by hand.
  pane.querySelectorAll('[data-noteadd]').forEach(function(btn){ btn.onclick=function(e){
    e.preventDefault(); e.stopPropagation(); ceNoteAddPop(btn);
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
        refreshBtn=tp.querySelector('[data-tprefresh]'),
        publishBtn=tp.querySelector('[data-tppublish]'), statusEl=tp.querySelector('[data-tpstatus]'),
        qLabel=tp.getAttribute('data-tpq')||'', rejected=[];
    function refresh(){
      var chips=staged.querySelectorAll('.ce-tp-chip');
      if(countEl) countEl.textContent=chips.length;
      var empty=staged.querySelector('.ce-tp-empty'); if(empty) empty.hidden=chips.length>0;
      if(rejEl) rejEl.textContent=rejected.length;
      if(publishBtn) publishBtn.hidden=(chips.length===0);
    }
    function setStatus(m){ if(statusEl) statusEl.textContent=m||''; }
    function readTarget(card){
      var segSel=card.querySelector('.ce-tp-seg'), segRaw=(segSel||{}).value||'';
      var isNewSeg=(segRaw==='__newseg__'), newSegInp=card.querySelector('.ce-tp-newseg');
      var seg=isNewSeg?((newSegInp&&newSegInp.value||'').trim()):segRaw;
      var subSel=card.querySelector('.ce-tp-sub');
      // a brand-new theme has no sub-themes yet, so the sub is ALWAYS new in that case
      var isNew=isNewSeg || !!(subSel && subSel.value==='__new__');
      var newInp=card.querySelector('.ce-tp-newsub');
      var sub=isNew?((newInp&&newInp.value||'').trim()):(subSel?subSel.value:'');
      return { seg:seg, sub:sub, isNew:isNew, isNewSeg:isNewSeg };
    }
    function paintTarget(card){
      var t=readTarget(card), tgt=card.querySelector('[data-tptarget]'); if(!tgt) return;
      var segLabel=t.seg||(t.isNewSeg?'(name the new theme)':'—');
      var subLabel=t.sub||(t.isNew?'(name the new sub-theme)':'—');
      var badge=t.isNewSeg?'<span class="ce-tp-badge new">NEW theme</span>'
        :(t.isNew?'<span class="ce-tp-badge new">NEW sub-theme</span>':'<span class="ce-tp-badge">existing sub-theme</span>');
      tgt.innerHTML='<span class="ce-tp-arrow">files under →</span> <b></b> <span class="ce-tp-sep">▸</span> <b></b> '+badge;
      var bs=tgt.querySelectorAll('b'); if(bs[0]) bs[0].textContent=segLabel; if(bs[1]) bs[1].textContent=subLabel;
    }
    function rebuildSub(card){
      var seg=(card.querySelector('.ce-tp-seg')||{}).value||'', subSel=card.querySelector('.ce-tp-sub'); if(!subSel) return;
      // a new theme ("__newseg__") has no existing sub-themes → only the "＋ New sub-theme…" option
      var subs=(seg==='__newseg__')?[]:ceSubsOfSeg(seg);
      subSel.innerHTML=subs.map(function(th){ return '<option value="'+esc(th).replace(/"/g,'&quot;')+'">'+esc(th)+'</option>'; }).join('')+'<option value="__new__">＋ New sub-theme…</option>';
    }
    function syncNew(card){
      var segSel=card.querySelector('.ce-tp-seg'), subSel=card.querySelector('.ce-tp-sub'),
          newInp=card.querySelector('.ce-tp-newsub'), newSegInp=card.querySelector('.ce-tp-newseg');
      var isNewSeg=!!(segSel && segSel.value==='__newseg__');
      if(newSegInp) newSegInp.hidden = !isNewSeg;
      if(newInp) newInp.hidden = !(isNewSeg || (subSel && subSel.value==='__new__'));
    }
    function wireCard(card){
      var segSel=card.querySelector('.ce-tp-seg'), subSel=card.querySelector('.ce-tp-sub'),
          newInp=card.querySelector('.ce-tp-newsub'), newSegInp=card.querySelector('.ce-tp-newseg');
      if(segSel) segSel.onchange=function(){ rebuildSub(card); syncNew(card); paintTarget(card); };
      if(subSel) subSel.onchange=function(){ syncNew(card); paintTarget(card); };
      if(newInp) newInp.oninput=function(){ paintTarget(card); };
      if(newSegInp) newSegInp.oninput=function(){ paintTarget(card); };
      syncNew(card); paintTarget(card);
      card.querySelectorAll('[data-tpact]').forEach(function(btn){ btn.onclick=function(){
        if(btn.getAttribute('data-tpact')==='accept'){
          var ta=card.querySelector('.ce-tp-in'), v=(ta&&ta.value||'').trim(); if(!v) return;
          var t=readTarget(card);
          if(t.isNewSeg && !t.seg){ if(newSegInp) newSegInp.focus(); return; }   // name the new theme first
          if(t.isNew && !t.sub){ if(newInp) newInp.focus(); return; }
          var chip=document.createElement('div'); chip.className='ce-tp-chip';
          // carry the target on the chip so Publish can build the company_themes payload
          chip.dataset.seg=t.seg; chip.dataset.sub=t.sub; chip.dataset.text=v; chip.dataset.isNew=t.isNew?'1':'';
          var tag=document.createElement('span'); tag.className='ce-tp-chip-tag'; tag.textContent=t.seg+' ▸ '+t.sub;
          chip.appendChild(tag);
          if(t.isNew){ var nb=document.createElement('span'); nb.className='ce-tp-chip-new'; nb.textContent='NEW'; chip.appendChild(nb); }
          var txt=document.createElement('span'); txt.className='ce-tp-chip-t'; txt.textContent=v; chip.appendChild(txt);  // textContent = no injection
          var x=document.createElement('button'); x.type='button'; x.className='ce-tp-unstage'; x.title='Unstage (return to proposals)'; x.textContent='✕';
          // Unstage RESTORES the card (bug fix): accepting HIDES the card, so ✕ un-hides it and it can be
          // re-accepted — previously the card was removed outright and an unstaged note vanished forever.
          x.onclick=function(){ chip.remove(); card.hidden=false; refresh(); }; chip.appendChild(x);
          staged.appendChild(chip); card.hidden=true;
        } else { rejected.push(card); card.remove(); }
        refresh();
      }; });
    }
    tp.querySelectorAll('.ce-tp-card').forEach(wireCard);
    if(refreshBtn) refreshBtn.onclick=function(){ rejected.forEach(function(c){ list.appendChild(c); }); rejected=[]; refresh(); };
    // Publish staged notes → the Notes theme record (AMZN_THEMES). Pablo's #79 replaced the shared
    // Watch List with an in-file segmented theme record, so THAT is where a note has to land to "flow
    // to Notes": each staged note is filed under its Theme (segment) ▸ Sub-theme, as an item under the
    // reported quarter, then the record re-renders in place. Session-only for now (AMZN_THEMES is the
    // in-memory model Pablo's own editor mutates) — durable persistence is the next step (a Supabase
    // table / edge function for the theme record), same gap the editor has today.
    if(publishBtn) publishBtn.onclick=function(){
      var chips=[].slice.call(staged.querySelectorAll('.ce-tp-chip')).filter(function(c){ return !c.classList.contains('published'); });
      if(!chips.length){ setStatus('Nothing new to publish.'); return; }
      var filed=0, dup=0;
      chips.forEach(function(chip){
        var res=cePublishNoteToRecord(chip.dataset.seg||'', chip.dataset.sub||chip.dataset.seg||'', chip.dataset.text||'', qLabel);
        if(res && res.dup){ dup++; chip.classList.add('dup'); }   // already in the record — skip, flag the chip
        else { filed++; chip.classList.add('published'); }
      });
      if(filed) amznRerenderRecord(document);   // the theme record lives in the Notes pane; re-render it (and persist)
      setStatus(filed+' filed into the theme record (Notes tab)'+(dup?' · '+dup+' skipped (already filed)':'')+(filed?' — saved when signed in':''));
    };
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
  // (Call-summary Expand/Collapse wiring removed with the AI summary section, Dani Aug 2026.)
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
    // data-f on the .ce-fz ROOT (not just the cards grid) so the same filter drives BOTH the cards and
    // the chart rows — the All/Beats/Misses control stays live in Chart view.
    var v=btn.getAttribute('data-vdf');
    if(v==='all') host.removeAttribute('data-f'); else host.setAttribute('data-f', v);
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
  ceMountWatchList();
}
// Mount / re-mount the shared Watch List engine into the Notes pane. Re-mount is idempotent (it
// re-fetches from company_themes), so Propose Notes calls it again after a publish to surface the
// freshly-inserted theme without a page reload.
function ceMountWatchList(){
  var wmount=document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="watch"] [data-wlmount]');
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
// ═══ Chart-standard kit (docs/CHART_ENGINE_REFERENCE.md §0.7) — copied verbatim / adapted so the
// bespoke AMZN canvases meet the six non-negotiables. rs-* CSS is global (css/results.css). ═══
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect(), area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX, vertical = forcedY ? true : null, startX = ev.clientX, startY = ev.clientY, box = null;
    function ensureBox(){ if (box) return; box = document.createElement('div'); box.className = 'rs-brush';
      if (vertical){ box.style.left = (r0.left - w0.left + area.left) + 'px'; box.style.width = (area.right - area.left) + 'px'; }
      else { box.style.top = (r0.top - w0.top) + 'px'; box.style.height = r0.height + 'px'; } wrap.appendChild(box); }
    function decide(cx, cy){ if (vertical != null) return; var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY); if (Math.max(dx, dy) < 8) return; vertical = dy > dx; }
    function place(cx, cy){ if (vertical == null) return; ensureBox();
      if (vertical){ var a = Math.min(startY, cy), b = Math.max(startY, cy); box.style.top = (a - w0.top) + 'px'; box.style.height = (b - a) + 'px'; }
      else { var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx); box.style.left = (a2 - w0.left) + 'px'; box.style.width = (b2 - a2) + 'px'; } }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){ document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); decide(e2.clientX, e2.clientY); if (box) box.remove();
      if (vertical == null) return;
      if (vertical){ if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top), v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top); onY(Math.min(v1, v2), Math.max(v1, v2)); }
      else { if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(cx){ var v = chart.scales.x.getValueForPixel(cx - r0.left); return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v))); }
        var a = idxAt(startX), b = idxAt(e2.clientX); if (a !== b) onX(Math.min(a, b), Math.max(a, b)); } }
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp); ev.preventDefault(); };
  el.ondblclick = onReset;
}
// Standard treatment for a bespoke chart: y-zoom + double-click reset (rule 1; onX=null per §0.2)
// AND an auto-generated collapsible table from the chart's own data (rule 3) — unless the chart
// supplies its own table container (#id-tbl, e.g. the waterfalls). One call covers both.
function aFnum(v){ if(v==null||v==='') return null; if(Array.isArray(v)) v=v[v.length-1]; if(typeof v!=='number') return String(v);
  var a=Math.abs(v), r=a<10?Math.round(v*100)/100:(a<1000?Math.round(v*10)/10:Math.round(v)); return r.toLocaleString('en-US'); }
// Auto-table from a chart's own data (rule 3), honouring hidden series (rule 2) and preserving open state.
function aBuildAutoTbl(id){
  var cv=document.getElementById(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if(document.getElementById(id+'-tbl')) return;   // chart supplies its own table
  var labels=(ch.data&&ch.data.labels)||[], ds=(ch.data&&ch.data.datasets)||[];
  if(!labels.length||!ds.length) return;
  var headers=['Series'].concat(labels.map(function(l){ return Array.isArray(l)?l.join(' '):String(l); }));
  var rows=[]; ds.forEach(function(d,i){ var meta=ch.getDatasetMeta?ch.getDatasetMeta(i):null; if(meta&&meta.hidden) return;   // rule 2: hidden series leaves the table
    rows.push([d.label||'series'].concat((d.data||[]).map(aFnum))); });
  var wrap=cv.parentElement, host=wrap&&wrap.parentNode; if(!host) return;
  var prev=wrap.nextElementSibling, wasOpen=false;
  if(prev&&prev.getAttribute&&prev.getAttribute('data-rstblhost')===id){ var ob=prev.querySelector('.rs-collap-b'); wasOpen=!!(ob&&!ob.hidden); host.removeChild(prev); }
  var div=document.createElement('div'); div.setAttribute('data-rstblhost',id); div.style.marginTop='8px';
  div.innerHTML=aTbl(id,'Data — what the chart draws',headers,rows);
  if(wasOpen){ var nb=div.querySelector('.rs-collap-b'); if(nb) nb.hidden=false; var ic=div.querySelector('.rs-collap-ic'); if(ic) ic.textContent='▾'; }
  host.insertBefore(div, wrap.nextSibling);
}
// Collapsible SECTION (charts / deep dives) so the pane isn't a wall — less shown by default,
// opened on demand. Uses the same rs-collap the table dropdown does (toggled in deepDiveInit).
function aCollap(title, inner, open){
  return '<div class="rs-collap" style="margin:16px 0 4px"><button type="button" class="rs-collap-h">'+
    '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span> '+esc(title)+'</button>'+
    '<div class="rs-collap-b"'+(open?'':' hidden')+' style="padding-top:10px">'+inner+'</div></div>';
}
function aZoom(id){ var cv=document.getElementById(id), ch=_aCharts[id]; if(!cv||!ch) return;
  if(ch.options&&ch.options.scales&&ch.options.scales.y){   // rule 1
    rsAttachBrush(cv, ch, null,
      function(v1,v2){ ch.options.scales.y.min=v1; ch.options.scales.y.max=v2; ch.update('none'); },
      function(){ ch.options.scales.y.min=undefined; ch.options.scales.y.max=undefined; ch.update('none'); }); }
  if(ch.options&&ch.options.plugins&&ch.options.plugins.legend){   // rule 2: legend hides the series AND refreshes the table
    var orig=Chart.defaults.plugins.legend.onClick;
    ch.options.plugins.legend.onClick=function(e,item,legend){ orig.call(this,e,item,legend); setTimeout(function(){ aBuildAutoTbl(id); },0); }; }
  aBuildAutoTbl(id);   // rule 3
}
// Collapsible data table under a chart (rule 3) — the portable rs-collap markup (§0.7).
function aTbl(id, title, headers, rows){
  var head='<span class="rs-collap-ic">▸</span> '+esc(title)+' <span class="rs-collap-sub">'+rows.length+' rows</span>';
  var thead='<tr>'+headers.map(function(hh,i){ return '<th'+(i===0?' class="rs-ft-h"':'')+'>'+esc(String(hh))+'</th>'; }).join('')+'</tr>';
  var tb=rows.map(function(r){ return '<tr>'+r.map(function(c,i){ return i===0?('<td class="rs-ft-h">'+esc(String(c))+'</td>'):('<td>'+(c==null||c===''?'<span class="rs-ft-nil">–</span>':esc(String(c)))+'</td>'); }).join('')+'</tr>'; }).join('');
  return '<div class="rs-collap" data-rstbl="'+id+'"><button type="button" class="rs-collap-h" data-rstblb="'+id+'">'+head+'</button>'+
    '<div class="rs-collap-b" id="rsTB-'+id+'" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead>'+thead+'</thead><tbody>'+tb+'</tbody></table></div></div></div>';
}
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
      scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('aSegRev'); }
  var c2=aChartReady('aSegOp');
  if(c2){ aDestroy('aSegOp');
    function opSeries(key){ return A_SEG_YEARS.map(function(y){ var tot=0,got=0; var m=amznResults.views.q.metrics[key]; m.periods.forEach(function(p,i){ if(p.slice(2)===y.slice(2)&&m.act[i]!=null){ tot+=m.act[i]; got++; } }); return got===4?tot/1000:null; }); }
    _aCharts['aSegOp']=new Chart(c2.getContext('2d'),{ type:'bar',
      data:{ labels:A_SEG_YEARS, datasets:[
        { label:'North America', data:opSeries('naopinc'), backgroundColor:BRAND, maxBarThickness:34 },
        { label:'International', data:opSeries('intopinc'), backgroundColor:BRAND2, maxBarThickness:34 },
        { label:'AWS', data:opSeries('awsopinc'), backgroundColor:SQUID, maxBarThickness:34 } ] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } } },
        scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('aSegOp'); }
  var c3=aChartReady('aRevLines');
  if(c3){ aDestroy('aRevLines');
    var lines=[ ['Online stores','online'], ['3P seller services','p3'], ['AWS','aws'], ['Advertising','ads'], ['Subscriptions','subs'], ['Physical stores','phys'], ['Other','other'] ];
    var vals=lines.map(function(l){ var v=aFy(l[1], 2025); return v==null?null:Math.round(v/100)/10; });
    _aCharts['aRevLines']=new Chart(c3.getContext('2d'),{ type:'bar',
      data:{ labels:lines.map(function(l){ return l[0]; }), datasets:[{ data:vals, backgroundColor:[BRAND,BRAND2,SQUID,'#7A5AF8','#2E8B57','#9AA4B0','#C8B49A'], maxBarThickness:26 }] },
      options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
        scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } }, y:{ grid:{ display:false } } } } }); aZoom('aRevLines'); }
}
function aGrossMgnSeries(){ return A_OPEX_YEARS.map(function(y){ var r=A_OPEX[y]; return Math.round((r.revenue-r.costOfSales)/r.revenue*1000)/10; }); }
function aOpMgnSeries(){ return A_OPEX_YEARS.map(function(y){ var r=A_OPEX[y]; var cost=A_OPEX_FN.reduce(function(a,f){ return a+r[f.k]; },0)+r.otherOpex; return Math.round((r.revenue-cost)/r.revenue*1000)/10; }); }
// Operating-margin bridge — revenue -> each functional cost -> operating income, as a waterfall.
// Plus the YoY margin-contribution bars (which cost line expanded / compressed the margin). No prose.
var A_MB_COST=[
  {k:'costOfSales',lab:'Cost of sales',c:'#6B7683'},
  {k:'fulfillment',lab:'Fulfillment',c:BRAND},
  {k:'techInfra',lab:'Technology & infrastructure',c:BRAND2},
  {k:'marketing',lab:'Sales & marketing',c:'#7A5AF8'},
  {k:'gAdmin',lab:'General & administrative',c:GRAY},
  {k:'otherOpex',lab:'Other operating expense',c:'#B7791F'}
];
// (marginBridgeBody / aBuildMarginBridge removed — the General ▸ The bridge (Margin change / bps mode)
//  supersedes the old "What moved the operating margin" bars. A_MB_COST is still used by the bridge.)
// ═══ The bridge — revenue→OI build-up ($B) and margin-change (bps) waterfalls ═══════════════════
// Ported from dis.js (boBridgePlugin/buildBoBridge): floating bars + dashed connectors + delta labels.
// Two historical modes, no sensitizing — a forward/guidance-anchored mode (AMZN gives an OI range)
// is a later pass. Short x-axis labels so all 8 steps read without autoskip.
var A_BR_SHORT={ costOfSales:'Cost of sales', fulfillment:'Fulfillment', techInfra:'Tech & infra', marketing:'Marketing', gAdmin:'G&A', otherOpex:'Other' };
var aBrPlugin={ id:'aBrLbl', afterDatasetsDraw:function(chart){
  var steps=chart._steps; if(!steps) return; var ctx=chart.ctx, meta=chart.getDatasetMeta(0), y=chart.scales.y, fmt=chart._fmt||{};
  ctx.save();
  ctx.strokeStyle='rgba(120,130,145,.55)'; ctx.setLineDash([3,3]); ctx.lineWidth=1;
  for(var i=0;i<steps.length-1;i++){ if(steps[i].runAfter==null) continue; var b0=meta.data[i], b1=meta.data[i+1];
    var yy=y.getPixelForValue(steps[i].runAfter); ctx.beginPath(); ctx.moveTo(b0.x+b0.width/2, yy); ctx.lineTo(b1.x-b1.width/2, yy); ctx.stroke(); }
  ctx.setLineDash([]); ctx.textAlign='center';
  for(var j=0;j<steps.length;j++){ var s=steps[j], bar=meta.data[j], topPix=y.getPixelForValue(Math.max(s.range[0], s.range[1])), txt;
    if(s.kind==='base'||s.kind==='total'){ txt=(fmt.base||String)(s.val); ctx.fillStyle='#1E2733'; ctx.font='800 11px Inter, system-ui, sans-serif'; }
    else { txt=(fmt.delta||String)(s.val); ctx.fillStyle=s.dc||(s.val>=0?'#2E8B57':'#C0504D'); ctx.font='700 10.5px Inter, system-ui, sans-serif'; }
    ctx.fillText(txt, bar.x, topPix-6); }
  ctx.restore();
} };
function aBuildBrWaterfall(id, steps, fmt){
  var cv=aChartReady(id); if(!cv) return; aDestroy(id);
  var labels=steps.map(function(s){return s.label;}), data=steps.map(function(s){return s.range;}), colors=steps.map(function(s){return s.color;});
  var ch=new Chart(cv.getContext('2d'), { type:'bar',
    data:{ labels:labels, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, borderSkipped:false, maxBarThickness:56, categoryPercentage:0.74, barPercentage:0.9 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:24}},
      plugins:{ legend:{display:false}, tooltip:{ displayColors:false, callbacks:{ title:function(it){return it[0].label;}, label:function(ctx){
        var s=ctx.chart._steps[ctx.dataIndex];
        if(s.kind==='base') return (fmt.base||String)(s.val);
        if(s.kind==='total') return (fmt.base||String)(s.val);
        return (fmt.delta||String)(s.val)+(s.runAfter!=null?'   ·   running '+(fmt.base||String)(s.runAfter):''); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:'#8A93A0', font:{size:10}, autoSkip:false, maxRotation:45, minRotation:0} },
        y:{ beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{color:'#8A93A0', font:{size:10}, callback:function(v){return (fmt.axis||String)(v);}} } } },
    plugins:[ aBrPlugin ] });
  ch._steps=steps; ch._fmt=fmt; _aCharts[id]=ch; ch.update('none'); aZoom(id);
  var tw=document.getElementById(id+'-tbl');   // rule 3: the table carries every step drawn
  if(tw){ var f=(fmt&&fmt.base)||String, fd=(fmt&&fmt.delta)||String;
    tw.innerHTML=aTbl(id, 'The waterfall — every step', ['Step','Value','Running'], steps.map(function(s){
      return [s.label, (s.kind==='base'||s.kind==='total')?f(s.val):fd(s.val), s.runAfter==null?f(s.val):f(s.runAfter)]; })); }
}
// Same build-up as a doughnut — where each revenue dollar goes (cost lines + operating income).
function aBuildBrPie(r){
  var cv=aChartReady('aBrCanvas'); if(!cv) return; aDestroy('aBrCanvas');
  var rev=r.revenue, segs=A_MB_COST.map(function(it){ return {lab:A_BR_SHORT[it.k]||it.lab, v:(r[it.k]||0), c:it.c}; });
  var oi=rev-A_MB_COST.reduce(function(a,it){ return a+(r[it.k]||0); },0);
  segs.push({lab:'Operating income', v:oi, c:'#2E8B57'});
  _aCharts['aBrCanvas']=new Chart(cv.getContext('2d'),{ type:'doughnut',
    data:{ labels:segs.map(function(s){ return s.lab; }), datasets:[{ data:segs.map(function(s){ return Math.round(s.v/100)/10; }), backgroundColor:segs.map(function(s){ return s.c; }), borderColor:'#fff', borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'55%',
      plugins:{ legend:{ position:'right', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.label+': $'+c.parsed.toFixed(1)+'B ('+(rev?Math.round(c.parsed*1000/rev*100)/10:0)+'% of revenue)'; } } } } } });
  var tw=document.getElementById('aBrCanvas-tbl');
  if(tw) tw.innerHTML=aTbl('aBrCanvas','Where each revenue dollar goes',['Line','$B','% of revenue'],segs.map(function(s){ return [s.lab,'$'+(Math.round(s.v/100)/10).toFixed(1)+'B',(rev?Math.round(s.v/rev*1000)/10:0)+'%']; }));
}
// Revenue → −each functional cost → = Operating income, in $B, for one period row (annual or quarterly).
function aBridgeBuildupSteps(r){
  var rev=r.revenue/1000, run=rev;
  var steps=[{label:'Revenue', kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:rev}];
  A_MB_COST.forEach(function(it){ var c=(r[it.k]||0)/1000, hi=run; run=hi-c;
    steps.push({label:A_BR_SHORT[it.k]||it.lab, kind:'down', color:it.c, dc:'#6B7683', range:[Math.min(run,hi),Math.max(run,hi)], runAfter:run, val:-c}); });
  steps.push({label:'Op. income', kind:'total', color:'#2E8B57', range:[0,run], runAfter:null, val:run});
  return steps;
}
// Operating-margin change (ppt→bps) between two periods, decomposed by functional line.
function aBridgeBpsSteps(prev, cur, labA, labB){
  var rev=cur.revenue, prevRev=prev.revenue;
  var m0=(prevRev - A_MB_COST.reduce(function(a,it){return a+prev[it.k];},0))/prevRev*100, run=m0;
  var steps=[{label:labA, kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:m0}];
  A_MB_COST.forEach(function(it){ var contrib=(prev[it.k]/prevRev - cur[it.k]/rev)*100, lo=run; run=lo+contrib;
    steps.push({label:A_BR_SHORT[it.k]||it.lab, kind:contrib>=0?'up':'down', color:contrib>=0?'#2E8B57':'#C0504D', range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:contrib}); });
  steps.push({label:labB, kind:'total', color:'#1E2733', range:[0,run], runAfter:null, val:run});
  return steps;
}
var BR_FMT_D={ axis:function(v){return '$'+Math.round(v)+'B';}, base:function(v){return '$'+v.toFixed(1)+'B';}, delta:function(v){return (v>=0?'+$':'−$')+Math.abs(v).toFixed(1)+'B';} };
var BR_FMT_BPS={ axis:function(v){return v.toFixed(0)+'%';}, base:function(v){return v.toFixed(1)+'%';}, delta:function(v){var b=Math.round(v*100); return (b>=0?'+':'−')+Math.abs(b)+' bps';} };
// Synthetic "opex row" for a forward year (fi = 0..2 → FY26E..FY28E) built from BBG consensus, shaped
// exactly like an A_OPEX row so aBridgeBuildupSteps / aBuildBrPie work on it unchanged. otherOpex is the
// residual so revenue − Σcost = operating income reconciles to the reported consensus OI.
function aFwdOpexRow(fi){
  function f(k){ var s=amznBBG.is[k]; return s?s.f[fi]:null; }
  var rev=f('rev'), oi=f('oi'); if(rev==null||oi==null) return null;
  var cogs=f('cogs')||0, ful=f('fulfillment')||0, tech=f('techInfra')||0, mkt=f('marketing')||0, ga=f('gAdmin')||0;
  return { p:'FY'+String(amznBBG.yearsF[fi]).slice(2)+'E', revenue:rev, costOfSales:cogs, fulfillment:ful,
    techInfra:tech, marketing:mkt, gAdmin:ga, otherOpex:(rev-cogs-ful-tech-mkt-ga-oi) };
}
function aBridgeBody(){
  var yBtns=function(cls,sel){ return A_OPEX_YEARS.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>FY'+String(y).slice(2)+'</button>'; }).join(''); };
  var qBtns=A_OPEXQ.map(function(r,i){ return '<button type="button" data-brq="'+i+'"'+(i===A_OPEXQ.length-1?' class="active"':'')+'>'+r.p.replace(/\s+/g,'')+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating income</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: mode + view (left) */
      '<span style="display:flex;gap:6px;flex-wrap:wrap">'+
        '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($B)</button><button type="button" data-brm="fexp">Forward (expenses)</button></span>'+
        '<span class="acx-tog br-view"><button type="button" data-brv="wf" class="active">Waterfall</button><button type="button" data-brv="pie">Pie</button></span>'+
      '</span>'+
      '<span></span>'+
    '</div>'+
    '<div class="br-ctl-bu mch-ctl" style="margin:0 0 8px">'+   /* buildup window (right) */
      '<span></span>'+
      '<span style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Quarterly</button></span>'+
        '<span class="acx-tog br-yr br-sel-y">'+yBtns('bry',2025)+'</span>'+
        '<span class="acx-tog br-qtr br-sel-q" style="display:none;flex-wrap:wrap">'+qBtns+'</span>'+
      '</span>'+
    '</div>'+
    '<div class="br-ctl-fexp mch-ctl" style="display:none;margin:0 0 8px">'+   /* forward year (right) */
      '<span></span>'+
      '<span class="acx-tog br-fy"><button type="button" data-brfy="0">FY26E</button><button type="button" data-brfy="1">FY27E</button><button type="button" data-brfy="2" class="active">FY28E</button></span>'+
    '</div>'+
    '<div style="height:340px"><canvas id="aBrCanvas"></canvas></div>'+
    '<div id="aBrCanvas-tbl" style="margin-top:8px"></div></div>';
}
function aBridgeSync(pane){
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup';
  var bu=pane.querySelector('.br-ctl-bu'), fe=pane.querySelector('.br-ctl-fexp');
  if(bu) bu.style.display=mode==='buildup'?'flex':'none';
  if(fe) fe.style.display=mode==='fexp'?'flex':'none';
  var g=pane.querySelector('.br-gran .active'), q=!!(g&&g.getAttribute('data-brg')==='q');
  var sy=pane.querySelector('.br-sel-y'), sq=pane.querySelector('.br-sel-q');
  if(sy) sy.style.display=q?'none':'';
  if(sq) sq.style.display=q?'':'none';
}
function aBuildBridge(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="margins"]'); if(!pane) return;
  var mb=pane.querySelector('.br-mode .active'), mode=mb?mb.getAttribute('data-brm'):'buildup';
  var vb=pane.querySelector('.br-view .active'), view=vb?vb.getAttribute('data-brv'):'wf', r;
  if(mode==='fexp'){   // forward expense build-up — same walk, BBG consensus year (FY26E..FY28E)
    var fyb=pane.querySelector('.br-fy .active'), fi=fyb?+fyb.getAttribute('data-brfy'):2;
    r=aFwdOpexRow(fi);
  } else {             // build-up — actual year or quarter
    var g=pane.querySelector('.br-gran .active'), gran=g?g.getAttribute('data-brg'):'y';
    if(gran==='q'){ var qb=pane.querySelector('.br-qtr .active'); r=A_OPEXQ[qb?+qb.getAttribute('data-brq'):A_OPEXQ.length-1]; }
    else { var yb=pane.querySelector('.br-yr .active'); r=A_OPEX[yb?+yb.getAttribute('data-bry'):2025]; }
  }
  if(!r) return;
  if(view==='pie') aBuildBrPie(r); else aBuildBrWaterfall('aBrCanvas', aBridgeBuildupSteps(r), BR_FMT_D);
}
// ── Segment bridge (Segments tab): margin-change decomposition + the forward segment-consensus walk.
// Moved out of General so the consolidated bridge there stays about expenses. Reuses aBuildBrWaterfall.
function aSegBridgeBody(){
  var yBtns=function(cls,sel){ return A_OPEX_YEARS.map(function(y){ return '<button type="button" data-'+cls+'="'+y+'"'+(y===sel?' class="active"':'')+'>FY'+String(y).slice(2)+'</button>'; }).join(''); };
  return '<div class="ov-sec"><div class="ov-sec-h">The segment bridge — margin change &amp; the forward walk</div>'+
    '<style>.br-sl{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--navy)}.br-sl input{flex:1;max-width:180px;accent-color:'+BRAND+'}.br-sl-v{width:44px;text-align:right;color:var(--brand-2);font-variant-numeric:tabular-nums}.br-sl-l{width:96px}</style>'+
    '<div class="mch-ctl"><span class="acx-tog sbr-mode"><button type="button" data-sbrm="bps" class="active">Margin change (bps)</button><button type="button" data-sbrm="fwd">Forward (consensus)</button></span><span></span></div>'+
    '<div class="sbr-ctl-bps mch-ctl" style="margin:0 0 8px"><span></span>'+
      '<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span style="font-size:11px;color:var(--mu)">From</span><span class="acx-tog sbr-from">'+yBtns('sbrf',2022)+'</span>'+
      '<span style="font-size:11px;color:var(--mu)">to</span><span class="acx-tog sbr-to">'+yBtns('sbrt',2025)+'</span></span></div>'+
    '<div class="sbr-ctl-fwd" style="display:none;flex-direction:column;gap:8px;margin:0 0 10px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><span style="font-size:11px;color:var(--mu)">Target year</span><span class="acx-tog sbr-fy"><button type="button" data-sbrfy="0">FY26E</button><button type="button" data-sbrfy="1">FY27E</button><button type="button" data-sbrfy="2" class="active">FY28E</button></span></div>'+
      '<div style="font-size:10.5px;color:var(--mu)">Sensitize each segment\'s operating income vs consensus (0% = the BBG consensus):</div>'+
      '<div class="br-sl"><span class="br-sl-l">North America</span><input type="range" data-sbrseg="na" min="-30" max="30" step="1" value="0"><span class="br-sl-v" data-sbrsegv="na">0%</span></div>'+
      '<div class="br-sl"><span class="br-sl-l">International</span><input type="range" data-sbrseg="intl" min="-30" max="30" step="1" value="0"><span class="br-sl-v" data-sbrsegv="intl">0%</span></div>'+
      '<div class="br-sl"><span class="br-sl-l">AWS</span><input type="range" data-sbrseg="aws" min="-40" max="40" step="1" value="0"><span class="br-sl-v" data-sbrsegv="aws">0%</span></div>'+
    '</div>'+
    '<div style="height:340px"><canvas id="aSegBr"></canvas></div>'+
    '<div id="aSegBr-tbl" style="margin-top:8px"></div></div>';
}
function aBuildSegBridge(){
  var pane=document.querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="segments"]'); if(!pane) return;
  var mb=pane.querySelector('.sbr-mode .active'), mode=mb?mb.getAttribute('data-sbrm'):'bps';
  var bps=pane.querySelector('.sbr-ctl-bps'), fwd=pane.querySelector('.sbr-ctl-fwd');
  if(bps) bps.style.display=mode==='bps'?'flex':'none';
  if(fwd) fwd.style.display=mode==='fwd'?'flex':'none';
  if(mode==='bps'){
    var fb=pane.querySelector('.sbr-from .active'), tb=pane.querySelector('.sbr-to .active');
    var ya=fb?+fb.getAttribute('data-sbrf'):2022, yb2=tb?+tb.getAttribute('data-sbrt'):2025;
    var prev=A_OPEX[ya], cur=A_OPEX[yb2];
    if(prev&&cur&&ya!==yb2) aBuildBrWaterfall('aSegBr', aBridgeBpsSteps(prev,cur,'FY'+String(ya).slice(2),'FY'+String(yb2).slice(2)), BR_FMT_BPS);
  } else {   // forward — FY25 OI → segment consensus contributions → target year, sensitizable
    var fyb=pane.querySelector('.sbr-fy .active'), fi=fyb?+fyb.getAttribute('data-sbrfy'):2;
    var SG=[{k:'na',lab:'North America',c:BRAND},{k:'intl',lab:'International',c:BRAND2},{k:'aws',lab:'AWS',c:SQUID}];
    var base=SG.map(function(s){ return amznBBG.seg[s.k].oi.a[2]; });   // FY25 actual, $M
    var tgt=SG.map(function(s){ var cons=amznBBG.seg[s.k].oi.f[fi]; var sl=pane.querySelector('.sbr-ctl-fwd input[data-sbrseg="'+s.k+'"]'); return cons*(sl?(1+(+sl.value)/100):1); });
    var run=base.reduce(function(a,b){ return a+b; },0)/1000;
    var steps=[{label:'FY25 OI', kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:run}];
    SG.forEach(function(s,i){ var d=(tgt[i]-base[i])/1000, lo=run; run=lo+d;
      steps.push({label:s.lab, kind:d>=0?'up':'down', color:s.c, dc:'#6B7683', range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); });
    var yr=String(amznBBG.yearsF[fi]).slice(2);
    steps.push({label:'FY'+yr+'E OI', kind:'total', color:'#2E8B57', range:[0,run], runAfter:null, val:run});
    aBuildBrWaterfall('aSegBr', steps, BR_FMT_D);
    SG.forEach(function(s){ var sl=pane.querySelector('.sbr-ctl-fwd input[data-sbrseg="'+s.k+'"]'), v=pane.querySelector('.br-sl-v[data-sbrsegv="'+s.k+'"]'); if(sl&&v) v.textContent=((+sl.value)>0?'+':'')+sl.value+'%'; });
  }
}
// ── OI → Net income walk, with one-off normalization. Consolidated from BBG (amznBBG.is), actuals +
// consensus. The reported net margin is flattered by equity mark-to-market gains (Rivian-type) in the
// non-operating line; "Normalized" strips that line (pretax basis) to show the underlying margin. ──
function aIsVal(k,y){ var s=amznBBG.is[k]; if(!s) return null; return y<=2025 ? s.a[y-2023] : s.f[y-2026]; }
function aNetBridgeBody(){
  var years=[2023,2024,2025,2026,2027,2028];
  var yb=years.map(function(y){ return '<button type="button" data-nbyr="'+y+'"'+(y===2025?' class="active"':'')+'>FY'+String(y).slice(2)+(y>2025?'E':'')+'</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating income → net income — and the normalization</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: treatment (left) · window (right) */
      '<span class="acx-tog nb-norm"><button type="button" data-nbnorm="rep" class="active">Reported</button><button type="button" data-nbnorm="norm">Normalized</button></span>'+
      '<span class="acx-tog nb-yr" style="flex-wrap:wrap">'+yb+'</span>'+
    '</div>'+
    '<div style="height:330px"><canvas id="aNetBr"></canvas></div>'+
    '<div id="aNetBr-tbl" style="margin-top:8px"></div>'+
    '<div class="acx-cap" id="aNetBrCap" style="font-size:11px;color:var(--mu);margin-top:8px"></div></div>';
}
function aBuildNetBridge(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="margins"]'); if(!pane) return;
  var yb=pane.querySelector('.nb-yr .active'), y=yb?+yb.getAttribute('data-nbyr'):2025;
  var nt=pane.querySelector('.nb-norm .active'), norm=!!(nt&&nt.getAttribute('data-nbnorm')==='norm');
  var oi=aIsVal('oi',y), ni=aIsVal('netInterest',y), ono=aIsVal('otherNonOp',y), tax=aIsVal('tax',y), em=aIsVal('equityMethod',y), net=aIsVal('netIncome',y), rev=aIsVal('rev',y);
  if(oi==null||net==null) return;
  function B(x){ return x==null?0:x/1000; }
  var run=B(oi), steps=[{label:'Op. income', kind:'base', color:'#1E2733', range:[0,run], runAfter:run, val:B(oi)}];
  function step(lab,d,dc){ var lo=run; run=lo+d; steps.push({label:lab, kind:d>=0?'up':'down', color:(dc==='#B7791F'?'#B7791F':'#6B7683'), dc:dc, range:[Math.min(lo,run),Math.max(lo,run)], runAfter:run, val:d}); }
  step('Interest, net', B(-ni), '#6B7683');
  if(!norm) step('Equity-securities M2M & other (one-off)', B(-ono), '#B7791F');
  step('– Income tax', B(-tax), '#6B7683');
  if(em) step('– Equity-method investees', B(-em), '#6B7683');
  steps.push({label:(norm?'Net income (norm.)':'Net income'), kind:'total', color:'#2E8B57', range:[0,run], runAfter:null, val:run});
  aBuildBrWaterfall('aNetBr', steps, BR_FMT_D);
  var cap=pane.querySelector('#aNetBrCap');
  if(cap){ var rm=(rev?net/rev*100:null), nm=(rev?(net+ono)/rev*100:null), yl='FY'+String(y).slice(2)+(y>2025?'E':'');
    cap.innerHTML='<b>'+yl+'</b> · reported net margin <b>'+(rm==null?'—':rm.toFixed(1)+'%')+'</b>'+(rev?' ($'+B(net).toFixed(1)+'B / $'+B(rev).toFixed(0)+'B rev)':'')+' · normalized (ex the equity / one-off non-operating line) <b>'+(nm==null?'—':nm.toFixed(1)+'%')+'</b>. The <span style="color:#B7791F;font-weight:700">amber bar</span> is the mark-to-market on <b>marketable equity securities</b> (the Rivian-type stake) &amp; other non-operating — $'+B(Math.abs(ono)).toFixed(1)+'B in '+yl+'; it flatters reported net income (consensus runs hotter still on assumed gains). Normalized removes it on a pretax basis — the underlying read. Note this is <b>not</b> the same line as <b>Equity-method investees</b>, which is Amazon\'s share of the profit/loss of associates it accounts for by the equity method (a separate, much smaller item). Data: BBG consensus, as of Aug 2026.';
  }
}
// SBC — back in General (where it was), BBG-driven (actuals + consensus, $B-by-line ⇄ %-of-line).
function aSbcBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Stock-based compensation</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2 */
      '<span style="display:flex;gap:6px;flex-wrap:wrap"><span class="acx-tog sbcv-tog"><button type="button" data-sbcv="line" class="active">By line</button><button type="button" data-sbcv="dilution">Dilution</button></span>'+
      '<span class="acx-tog sbcm-tog"><button type="button" data-sbcm="dollar" class="active">$B</button><button type="button" data-sbcm="pct">% of revenue</button></span></span>'+
      '<span></span>'+
    '</div>'+
    '<div style="height:300px"><canvas id="aSbcMain"></canvas></div></div>';
}
function aSbcSer(k){ var s=amznBBG.is[k]; return s?s.a.concat(s.f):[null,null,null,null,null,null]; }
function aBuildSbc(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="margins"]'); if(!pane) return;
  var tg=pane.querySelector('.sbcm-tog .active'), pct=(tg?tg.getAttribute('data-sbcm'):'dollar')==='pct';
  var vw=pane.querySelector('.sbcv-tog .active'), view=vw?vw.getAttribute('data-sbcv'):'line';
  var cv=aChartReady('aSbcMain'); if(!cv) return; aDestroy('aSbcMain');
  var labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E'];
  if(view==='dilution'){   // SBC (bars) vs diluted share count (line) — dilution with ~nil buyback offset
    var sbc=aSbcSer('sbc'), sh=aSbcSer('dilShares'), rev=aSbcSer('rev');
    var bars=labels.map(function(_,i){ return sbc[i]==null?null:(pct?(rev[i]?Math.round(sbc[i]/rev[i]*1000)/10:null):Math.round(sbc[i]/100)/10); });
    var shares=labels.map(function(_,i){ return sh[i]==null?null:Math.round(sh[i]); });
    _aCharts['aSbcMain']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
      { type:'bar', label:'SBC '+(pct?'(% of revenue)':'($B)'), data:bars, backgroundColor:bars.map(function(_,i){ return i<3?acxRGBA(BRAND2,0.85):acxRGBA(BRAND2,0.4); }), borderColor:'#fff', borderWidth:1, maxBarThickness:44, yAxisID:'y', order:2 },
      { type:'line', label:'Diluted shares (M)', data:shares, borderColor:SQUID, backgroundColor:SQUID, borderWidth:2.5, pointRadius:2.5, tension:0.2, yAxisID:'y1', order:1 } ]},
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.yAxisID==='y1'? c.dataset.label+': '+c.parsed.y.toLocaleString()+'M' : c.dataset.label+': '+(pct?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B'); } } } },
        scales:{ x:{ grid:{ display:false } },
          y:{ position:'left', title:{ display:true, text:'SBC', font:{ size:9 } }, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'B'; } } },
          y1:{ position:'right', title:{ display:true, text:'Diluted shares (M)', font:{ size:9 } }, grid:{ display:false }, suggestedMin:10000 } } } });
  } else {
    var LN=[{sbc:'sbcCogs',exp:'cogs',lab:'Cost of sales',c:SQUID},{sbc:'sbcFulfill',exp:'fulfillment',lab:'Fulfillment',c:BRAND},{sbc:'sbcTech',exp:'techInfra',lab:'Technology & infrastructure',c:BRAND2},{sbc:'sbcMktg',exp:'marketing',lab:'Sales & marketing',c:GREEN},{sbc:'sbcGA',exp:'gAdmin',lab:'General & administrative',c:GRAY}];
    var ds=LN.map(function(l){ var s=aSbcSer(l.sbc), e=aSbcSer(l.exp);   // in By line, % = % of that line's expense
      var vals=labels.map(function(_,i){ if(s[i]==null) return null; return pct?(e[i]?Math.round(s[i]/e[i]*1000)/10:null):Math.round(s[i]/100)/10; });
      return { label:l.lab, data:vals, backgroundColor:vals.map(function(_,i){ return i<3?l.c:acxRGBA(l.c,0.45); }), borderColor:'#fff', borderWidth:1, maxBarThickness:pct?22:44, stack:pct?undefined:'s' }; });
    _aCharts['aSbcMain']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':(pct?c.parsed.y+'% of the line':'$'+c.parsed.y.toFixed(1)+'B')); }, footer:function(it){ return pct?'':'Total SBC: $'+it.reduce(function(a,x){ return a+(x.parsed.y||0); },0).toFixed(1)+'B'; } } } },
        scales:{ x:{ stacked:!pct, grid:{ display:false } }, y:{ stacked:!pct, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'B'; } } } } } });
  }
  aZoom('aSbcMain');
  if(pane && !pane._sbcmWired){ pane._sbcmWired=true;
    pane.querySelectorAll('.sbcm-tog button, .sbcv-tog button').forEach(function(b){ b.onclick=function(){ b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSbc(); }; }); }
}
// Profitability & margins — the §0.4 layout: row 1 = a metric dropdown (identity), row 2 = mode
// toggles (treatment). All margins (gross/operating/EBITDA/net/FCF) over time, reported → BBG
// consensus, as a % or in $B. Semantic colours (navy=reported, blue=consensus) per §0.7.
var RS_ACT='#1E2733', RS_CONS='#2563EB';
var MARG_NUM={gross:'grossProfit', operating:'oi', ebitda:'ebitda', net:'netIncome', fcf:'fcf'};
var MARG_LAB={gross:'Gross margin', operating:'Operating margin', ebitda:'EBITDA margin', net:'Net margin', fcf:'FCF margin'};
// General master chart-picker — one dropdown swaps which chart is on screen (less-by-default; the
// others stay hidden until chosen). Sections are wrapped in .gen-sec[data-gsec]; wiring in aBuildExpenses.
function aGeneralPicker(){
  var opts=[['margins','Profitability & margins'],['bridge','The bridge — revenue → operating income'],['net','Operating income → net income'],['sbc','Stock-based compensation']];
  return '<div class="ov-sec" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'+
    '<span style="font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)">Chart</span>'+
    '<select class="gen-chart" style="font-size:13px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;background:#fff">'+
    opts.map(function(o){ return '<option value="'+o[0]+'"'+(o[0]==='margins'?' selected':'')+'>'+o[1]+'</option>'; }).join('')+
    '</select>'+
    '<span style="font-size:11px;color:var(--mu)">Pick one — the rest stay tucked away.</span>'+
    '</div></div>';
}
var MARG_MET=[{k:'gross',c:GRAY},{k:'operating',c:BRAND2},{k:'ebitda',c:BRAND},{k:'net',c:GREEN},{k:'fcf',c:SQUID}];
function aMarginsBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Profitability &amp; margins — all of them</div>'+
    '<div class="mch-ctl">'+   /* §0.4 row 2: treatment (left) · note (right) */
      '<span style="display:flex;gap:6px;flex-wrap:wrap"><span class="acx-tog marg-gran"><button type="button" data-margg="y" class="active">Annual</button><button type="button" data-margg="q">Quarterly</button></span>'+
      '<span class="acx-tog marg-mode"><button type="button" data-margm="pct" class="active">Margin %</button><button type="button" data-margm="amt">$B (nominal)</button></span></span>'+
      '<span style="font-size:11px;color:var(--mu)">solid = reported · dashed = BBG consensus · click a legend item to hide</span>'+
    '</div>'+
    '<div style="height:340px"><canvas id="aMargins"></canvas></div></div>';
}
function aBuildMargins(){
  var pane=document.querySelector('.ovt-subpane[data-ovst="margins"]'); if(!pane) return;
  var gm=pane.querySelector('.marg-mode .active'), mode=gm?gm.getAttribute('data-margm'):'pct';
  var gg=pane.querySelector('.marg-gran .active'), gran=gg?gg.getAttribute('data-margg'):'y';
  var cv=aChartReady('aMargins'); if(!cv) return; aDestroy('aMargins');
  var rev=amznBBG.is.rev; if(!rev) return;
  var labels, rv, nAct;
  if(gran==='q'){ labels=amznBBG.qtrs.slice(); rv=rev.q; nAct=5; }   // fq0=2Q26 at idx 4 → 5 actual quarters
  else { labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E']; rv=rev.a.concat(rev.f); nAct=3; }
  var ds=MARG_MET.map(function(m){                                   // one line per margin — ALL of them, at once
    var num=amznBBG.is[MARG_NUM[m.k]]; var na=num?(gran==='q'?num.q:num.a.concat(num.f)):null;
    var data=labels.map(function(_,i){ if(!na) return null; var n=na[i], d=rv[i]; if(n==null||d==null||!d) return null; return mode==='pct'?Math.round(n/d*1000)/10:Math.round(n/100)/10; });
    return { label:MARG_LAB[m.k], data:data, borderColor:m.c, backgroundColor:m.c, borderWidth:2.4, pointRadius:2, tension:0.2, spanGaps:false,
      segment:{ borderDash:function(ctx){ return ctx.p1DataIndex>=nAct?[5,4]:undefined; } } };   // forward (consensus) dashed
  });
  _aCharts['aMargins']=new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ title:function(it){ return it[0].label; }, label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':(mode==='pct'?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B'))+(c.dataIndex>=nAct?' (E)':''); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return mode==='pct'?v+'%':'$'+v+'B'; } } } } } });
  aZoom('aMargins');
  if(pane && !pane._margWired){ pane._margWired=true;
    pane.querySelectorAll('.marg-mode button, .marg-gran button').forEach(function(b){ b.onclick=function(){ var grp=b.parentNode; grp.querySelectorAll('button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildMargins(); }; }); }
}
// Expense-line full dives — opened from an Expenses card via data-detail="exp:<key>". VISUAL, not prose.
var EW_CSS='<style>'+
  '.ew-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:2px 0 16px}'+
  '.ew-tile{border:1px solid var(--bdr);border-top:3px solid var(--brand-2);border-radius:10px;padding:10px 12px;background:var(--card,#fff)}'+
  '.ew-tv{font-size:19px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums;letter-spacing:-.02em}.ew-tl{font-size:10px;color:var(--mu);font-weight:600;margin-top:3px;line-height:1.35}'+
  '.ew-h{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--brand-2);margin:18px 0 9px;display:flex;align-items:center;gap:8px}.ew-h::after{content:"";flex:1;height:1px;background:var(--bdr)}'+
  '.ew-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.ew-two{grid-template-columns:1fr}}'+
  '.ew-box{border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;background:var(--card,#fff)}'+
  '.ew-box-h{font-size:13px;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:8px;margin-bottom:5px}.ew-box-i{font-size:18px}'+
  '.ew-box-t{font-size:11.5px;color:var(--navy);line-height:1.5}'+
  '.ew-note{font-size:12px;color:var(--navy);background:rgba(20,110,180,.06);border-radius:8px;padding:9px 12px;margin-top:9px;line-height:1.5}'+
  '.ew-spark{display:flex;align-items:flex-end;gap:5px;height:96px;margin:4px 0}'+
  '.ew-sb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px}'+
  '.ew-sb-v{font-size:9.5px;font-weight:800;color:var(--navy)}.ew-sb-bar{width:100%;border-radius:4px 4px 0 0;background:#B7CBE0}.ew-sb.on .ew-sb-bar{background:var(--brand-2)}.ew-sb-l{font-size:8.5px;color:var(--mu)}'+
  '.ew-flow{display:flex;align-items:stretch;flex-wrap:wrap;margin:2px 0}'+
  '.ew-fn{flex:1;min-width:110px;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;background:var(--card,#fff);text-align:center}'+
  '.ew-fn-v{font-size:14px;font-weight:800;color:var(--navy)}.ew-fn-l{font-size:9.5px;color:var(--mu);font-weight:600;margin-top:2px}'+
  '.ew-far{display:flex;align-items:center;justify-content:center;color:var(--brand-2);font-size:18px;font-weight:800;padding:0 6px}'+
  '.ew-q{border-left:3px solid var(--brand);background:rgba(0,0,0,.025);border-radius:0 8px 8px 0;padding:9px 13px;margin:8px 0;font-size:12px;line-height:1.55;color:var(--navy)}'+
  '.ew-q .ew-att{display:block;margin-top:4px;font-size:10.5px;font-weight:700;color:var(--mu)}'+
  '.ew-foot{font-size:10.5px;color:var(--mu);line-height:1.5;margin-top:10px;border-top:1px solid var(--bdr);padding-top:8px}'+
  '.ew-tls{position:relative;margin:8px 0 2px;padding-left:20px}'+'.ew-tls::before{content:"";position:absolute;left:5px;top:5px;bottom:5px;width:2px;background:var(--bdr)}'+'.ew-tli{position:relative;margin-bottom:13px}.ew-tli:last-child{margin-bottom:2px}'+'.ew-tli::before{content:"";position:absolute;left:-18px;top:3px;width:9px;height:9px;border-radius:50%;background:var(--brand-2);border:2px solid var(--card,#fff);box-shadow:0 0 0 1px var(--bdr)}'+'.ew-tlq{font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--brand-2)}'+'.ew-tlt{font-size:12px;color:var(--navy);line-height:1.5;margin-top:2px}'+'.ew-tlw{font-size:10px;font-weight:700;color:var(--mu);margin-top:3px}'+'.ew-tag{display:inline-block;font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:1px 6px;border-radius:5px;margin-left:7px;vertical-align:middle;transform:translateY(-1px)}'+'.ew-tag.why{background:rgba(192,80,77,.13);color:#B23A38}.ew-tag.fwd{background:rgba(46,139,87,.15);color:#2E7D51}.ew-tag.ctx{background:rgba(107,118,131,.15);color:#5B6673}'+
  '.ew-calls{margin-top:14px}.ew-callsum{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--brand-2);cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;padding:5px 0}'+
  '.ew-callsum::-webkit-details-marker{display:none}.ew-callsum::before{content:"▸";font-size:11px;transition:transform .15s}.ew-calls[open] .ew-callsum::before{content:"▾"}.ew-callsum::after{content:"";flex:1;height:1px;background:var(--bdr)}'+
'</style>';
var EW_LABS=["’18","’19","’20","’21","’22","’23","’24","’25"];
function ewSpark(vals,onIdx){ var mx=Math.max.apply(null,vals.map(Math.abs));
  return '<div class="ew-spark">'+vals.map(function(v,i){ return '<div class="ew-sb'+(i===onIdx?' on':'')+'"><div class="ew-sb-v">'+v+'%</div><div class="ew-sb-bar" style="height:'+Math.max(2,Math.round(Math.abs(v)/mx*72))+'px"></div><div class="ew-sb-l">'+EW_LABS[i]+'</div></div>'; }).join('')+'</div>';
}
function ewBoxes(arr){ return '<div class="ew-two"'+(arr.length<2?' style="grid-template-columns:1fr"':'')+'>'+arr.map(function(b){ return '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">'+b[0]+'</span>'+b[1]+'</div><div class="ew-box-t">'+b[2]+'</div></div>'; }).join('')+'</div>'; }
// Collapsible "what management has said" block — hidden by default so the dive reads clean.
function ewCallsBlock(calls){ if(!calls||!calls.length) return '';
  return '<details class="ew-calls"><summary class="ew-callsum">What management has said — over time</summary>'+ewCallTimeline(calls)+'</details>';
}
function ewCallTimeline(calls){ if(!calls||!calls.length) return '';
  var lab={why:'driver',fwd:'forward',ctx:'context'};
  return '<div class="ew-tls">'+calls.map(function(c){ return '<div class="ew-tli"><div class="ew-tlq">'+c.q+(c.tag?'<span class="ew-tag '+c.tag+'">'+lab[c.tag]+'</span>':'')+'</div><div class="ew-tlt">'+c.txt+'</div>'+(c.who&&c.who!=='—'?'<div class="ew-tlw">— '+c.who+'</div>':'')+'</div>'; }).join('')+'</div>';
}
// Management commentary per expense line. Entries in “…” marked "(verbatim)" are word-for-word from the
// earnings-call transcript (Q4 2025 verified against Motley Fool / IR transcript; Q1–Q2 2026 from the repo
// call records docs/calls/AMZN*.md). Un-quoted entries are our summary of management's stated drivers.
var EW_CALLS={
  costOfSales:[
    {q:'Q4 2025', who:'Brian Olsavsky, CFO — Q4 2025 call (verbatim)', tag:'why', txt:'“For the third year in a row, globally, in 2025, we achieved both our fastest-ever delivery speeds for Prime members while also reducing our cost to serve.”'},
    {q:'Q1 2023', who:'Andy Jassy / Brian Olsavsky', tag:'why', txt:'Completed the regionalization of the US fulfillment network — from one national model to eight self-sufficient regions. Shorter distances and fewer touches per package began pulling shipping cost per unit down.'},
    {q:'Q4 2023', who:'Brian Olsavsky, CFO', tag:'why', txt:'Cost to serve per unit fell year over year for the first time since 2018 — the network redesign and inbound consolidation flowing through the line.'},
    {q:'2024', who:'Andy Jassy, CEO', tag:'why', txt:'Faster delivery got cheaper, not costlier: as same-day and next-day volume rose, in-region inventory placement lifted density and lowered the marginal cost of each shipment.'},
    {q:'Forward', who:'Summit view', tag:'fwd', txt:'The structural pull continues — every point of mix toward AWS, advertising and third-party services lowers cost of sales as a share of revenue, on top of the shipping gains.'}
  ],
  fulfillment:[
    {q:'Q4 2025', who:'Brian Olsavsky, CFO — Q4 2025 call (verbatim)', tag:'why', txt:'“In the US, a regionalized network is operating at scale and we continue to make refinements.”'},
    {q:'Q4 2025', who:'Andy Jassy, CEO — Q4 2025 call (verbatim)', tag:'why', txt:'“We have over a million robots today in our fulfillment network.” US Prime members received over 8 billion items the same or next day, “up more than 30% year over year.”'},
    {q:'2022', who:'Brian Olsavsky, CFO', tag:'ctx', txt:'The pandemic roughly doubled the fulfillment network in about two years; 2022 was about growing volume into that fixed footprint after over-building — the ratio peaked near 16.4%.'},
    {q:'2023–24', who:'Andy Jassy, CEO', tag:'why', txt:'Regionalization plus next-generation robotics (Sequoia, Proteus) and the Shreveport facility held fulfillment cost roughly flat even as units grew — the efficiency program that reset the retail margin.'},
    {q:'Forward', who:'Summit view', tag:'fwd', txt:'Continued robotics deployment and same-day site expansion are expected to keep fulfillment roughly flat-to-lower as a share of revenue, offsetting the cost of faster delivery.'}
  ],
  techInfra:[
    {q:'Q4 2025', who:'Andy Jassy, CEO — Q4 2025 call (verbatim)', tag:'why', txt:'“We expect to invest about $200 billion in capital expenditures across Amazon.com, Inc., but predominantly in AWS.” “In 2025, AWS added more data center capacity than any other company in the world.”'},
    {q:'Q1 2026', who:'Brian Olsavsky, CFO — Q1 2026 call', tag:'why', txt:'Capex “primarily AWS and generative AI”; memory component costs had “skyrocketed.”'},
    {q:'Q2 2026', who:'Brian Olsavsky, CFO — Q2 2026 call', tag:'fwd', txt:'FY26 cash-capex frame raised to ~$220B from ~$200B, part of it the “higher cost of memory.”'}
  ],
  marketing:[
    {q:'Q4 2025', who:'Brian Olsavsky, CFO — Q4 2025 call (verbatim)', tag:'why', txt:'“Advertising revenue grew 22% in the fourth quarter and we added over $12 billion of incremental revenue in 2025.”'},
    {q:'Q4 2025', who:'Andy Jassy, CEO — Q4 2025 call (verbatim)', tag:'why', txt:'“Prime Video has an average ad-supported audience of 315 million viewers globally, up from 200 million in early 2024.”'},
    {q:'2022', who:'Brian Olsavsky, CFO', tag:'ctx', txt:'Marketing spend was pulled back as measured returns fell in a softer demand environment — the company spends against efficiency, not a fixed budget.'},
    {q:'Forward', who:'Summit view', tag:'fwd', txt:'Continued leverage expected: a large, mature Prime base needs proportionally less acquisition spend each year, and Amazon increasingly monetizes its own surface rather than buying demand.'}
  ],
  gAdmin:[
    {q:'Jan 2023', who:'Andy Jassy, CEO', tag:'why', txt:'Began the largest headcount reduction in company history — ~27,000 roles across rounds — explicitly to remove cost and bureaucracy from corporate functions.'},
    {q:'2024', who:'Andy Jassy, CEO', tag:'why', txt:'“Fewer managers, more builders”: flattened the org and raised the ratio of individual contributors to managers, stripping out a layer of overhead.'},
    {q:'Oct 2025', who:'Andy Jassy, CEO', tag:'why', txt:'Framed the ~14,000 further corporate cuts as culture and speed rather than primarily cost — reducing bureaucracy and freeing resources for AI. Severance is booked as a charge when taken.'},
    {q:'Forward', who:'Summit view', tag:'fwd', txt:'With overhead largely fixed and revenue still growing, G&A stays the most leveraged line — shrinking as a share every year absent new charges.'}
  ],
  otherOpex:[
    {q:'FY 2025', who:'Amazon 8-K / FY2025 10-K', tag:'why', txt:'FY2025 carried the $2.5B FTC settlement (recognized Q3 2025), the resolution of Italy stores-business tax disputes, and physical-store & other asset impairments — the reason this line jumped to $4.6B.'},
    {q:'Forward', who:'Summit view', tag:'fwd', txt:'Reverts toward a small run-rate once the 2025 charges lap; no recurring guidance is given for this line.'}
  ]
};
var SEG_CALLS={
  // Quotes in "…" are verbatim from the earnings-call records in docs/calls/AMZN*.md (Q4'25–Q2'26,
  // from transcript coverage); entries marked "Summit note" / "(8-K)" are figures/context, not quotes.
  aws:[
    {q:'Q4 2025', who:'Andy Jassy, CEO', tag:'why', txt:'AWS grew at "the fastest we\'ve seen in thirteen quarters." On the build: Amazon added over 1GW of capacity in the quarter, "more than any other company in the world" in 2025.'},
    {q:'Q4 2025', who:'Brian Olsavsky, CFO', tag:'why', txt:'"As fast as we install this capacity, this AI capacity, we are monetizing it — it\'s just a very unusual opportunity."'},
    {q:'Q1 2026', who:'Andy Jassy, CEO', tag:'why', txt:'"It is very unusual for a business to grow this fast on a base this large." AWS +28% (~$150B run-rate); backlog $364B, which "does not include the recent deal… with Anthropic for over $100 billion."'},
    {q:'Q2 2026', who:'Andy Jassy, CEO', tag:'why', txt:'"AWS is booming, growing 36.7% year-over-year in Q2 — our fastest growth in 18 quarters — and our AI and Chips businesses each eclipsed run rates of more than $25 billion." Backlog $496B.'},
    {q:'Q2 2026', who:'Brian Olsavsky, CFO', tag:'why', txt:'AWS margin was up "650 basis points year-over-year, 520 basis points if you exclude the derivative accounting gain" — margins "aren\'t random," attributed to silicon mix, power efficiency and utilization.'},
    {q:'Q2 2026', who:'Andy Jassy, CEO', tag:'fwd', txt:'"We have clear line of sight to strong financial returns," and AWS can become "a trillion-dollar annual revenue business." 2027 capacity is "largely reserved," some 2028 "already spoken for."'}
  ],
  us:[
    {q:'Q4 2025', who:'Amazon Q4 2025 (8-K / call)', tag:'why', txt:'North America margin 9% in the peak quarter; Amazon the lowest-priced US retailer for the 9th straight year (~14% below other majors), everyday essentials now ~1 in 3 units.'},
    {q:'Q4 2025', who:'Andy Jassy, CEO', tag:'why', txt:'Rufus reached 300M customers in 2025, with users "60% more likely to complete a purchase" — the discovery/ad flywheel on the retail surface.'},
    {q:'Q1 2026', who:'Brian Olsavsky, CFO', tag:'why', txt:'The efficiency proof: paid units grew ~15% while fulfillment expense grew ~9% (FX-neutral); robotics is in "every 2026 US large-format launch."'},
    {q:'Q2 2026', who:'Management (8-K)', tag:'why', txt:'Advertising +26% to $19.8B (sponsored products the driver); same-day perishables customers +50% since January, same-day orders carrying ~3x the units; ~$600M of tariff-related refunds landed in the quarter.'},
    {q:'Q3 2025', who:'Summit note', tag:'ctx', txt:'Reported NA margin dipped on the $2.5B FTC settlement booked in the quarter — a charge, not a trend.'}
  ],
  int:[
    {q:'2024', who:'Summit note', tag:'why', txt:'International crossed into operating profit for the first time — established markets (Germany, UK, Japan) running the same regionalization + advertising playbook as North America, a few years behind.'},
    {q:'FY 2025', who:'Summit note', tag:'ctx', txt:'FX swings the reported print as much as operations — a +$903M tailwind to International operating income in 2025.'},
    {q:'Q2 2026', who:'Management (8-K)', tag:'ctx', txt:'International net sales $42.2B (+15%), op income $1,717M (4.1% margin) — the one segment line under both Street and Summit estimates for the quarter.'},
    {q:'Forward', who:'Summit note', tag:'fwd', txt:'Established markets keep expanding; emerging markets (India, Brazil, Middle East) remain an investment drag for years — the blended margin early on the curve NA already climbed.'}
  ]
};
function ewBase(c){
  var h='<div class="ew-kpis">'+c.kpis.map(function(k){ return '<div class="ew-tile"><div class="ew-tv">'+k[0]+'</div><div class="ew-tl">'+k[1]+'</div></div>'; }).join('')+'</div>';
  if(c.def){ h+='<div class="ew-h">How the 10-K defines it</div><div class="ew-q ew-def">“'+c.def+'”<span class="ew-att">'+EW_SRC+'</span></div>'; }
  h+='<div class="ew-h">What sits inside this line</div>'+ewBoxes(c.comp);
  if(c.compNote) h+='<div class="ew-note">'+c.compNote+'</div>';
  h+='<div class="ew-h">Share of revenue over time</div>'+ewSpark(c.traj,7);
  if(c.unit){ h+='<div class="ew-h">Unit economics</div>'+c.unit; }
  h+='<div class="ew-h">Why it matters to the bottom line</div><div class="ew-note">'+c.why+'</div>';
  if(c.drivers){ h+='<div class="ew-h">Why it has moved — the drivers</div>'+ewBoxes(c.drivers); }
  if(c.fwd){ h+='<div class="ew-h">Where it’s headed</div><div class="ew-note">'+c.fwd+'</div>'; }
  if(c.extra) h+=c.extra;
  if(c.calls){ h+=ewCallsBlock(c.calls); }
  h+='<div class="ew-foot">FY2025 figures unless noted. Sources: 10-K MD&amp;A + Notes; Amazon earnings calls (management commentary).</div>';
  return h;
}
var EW_LINES=[
  {k:'costOfSales',name:'Cost of sales',kpis:[['$356B','of revenue: 49.7%'],['+1.4 ppt','to operating margin (YoY)'],['$0.8B','stock-based comp inside']],
    comp:[['📦','Product cost','The purchase price of everything Amazon sells first-party.'],['🚚','Shipping &amp; content','Inbound &amp; outbound shipping — sortation, delivery, transport — and digital-media content.']],
    compNote:'The largest line by far, and the one that has fallen the most.',fwd:'Keeps falling. The mix shift toward AWS, advertising and 3P has years to run — each point of that mix pulls the cost-of-sales ratio down.',
    traj:[59.8,59.0,60.4,58.0,56.2,53.0,51.1,49.7],
    why:'<b>The margin lever.</b> It fell ~10 points since 2019 — its −1.4ppt in 2025 did more to expand the operating margin than anything else.',
    drivers:[['🔀','Mix shift to higher-margin lines','AWS, advertising and third-party services grow faster than first-party retail — so cost-of-goods shrinks as a share of revenue. This is the biggest driver.'],['🚚','Shipping efficiency','Regionalizing the US network (2023) cut transportation cost per unit — shorter distances, fewer touches.'],['🤝','Scale &amp; supplier terms','Larger purchasing scale and better terms on the goods it resells.']],extra:''},
  {k:'fulfillment',name:'Fulfillment',kpis:[['$109B','of revenue: 15.2%'],['+0.2 ppt','to operating margin (YoY)'],['$2.7B','stock-based comp inside']],
    comp:[['🏭','The FC network','Operating &amp; staffing fulfillment centers, physical stores and customer service — pick, pack, ship, payments.'],['🤖','Robotics','1M+ robots and a regionalized network that holds cost flat as volume grows.']],
    compNote:'Held at ~15% of revenue through 15%+ unit growth — the efficiency proof.',fwd:'Roughly flat. Management guides no line item but points to continued robotics / regionalization leverage — the retail-margin path implies stable-to-lower.',
    traj:[14.6,14.3,15.2,16.0,16.4,15.8,15.4,15.2],
    why:'<b>The retail-efficiency line.</b> Units grew +17% while this stayed ~15% of revenue — the operating leverage the margin depends on.',
    drivers:[['🤖','Robotics &amp; automation','1M+ robots plus the 2023 regionalization of the US network — fewer touches, shorter distances per package.'],['✂️','Headcount discipline','2022–24 role eliminations and a flatter org held staffing cost flat even as volume rose.'],['📦','Density','Same-day / faster delivery got cheaper per unit as order density rose in each region.']],extra:''},
  {k:'techInfra',name:'Technology &amp; infrastructure',kpis:[['$108.5B','of revenue: 15.1%'],['+22.6%','YoY — fastest-growing line'],['−1.2 ppt','to operating margin (the drag)'],['$10.9B','stock-based comp inside']],
    comp:[['🧑‍💻','R&amp;D / engineering payroll','Product development for AWS, the store, Alexa, devices and AI — the largest engineering workforce in tech.'],['🖥️','Infrastructure + its depreciation','Servers, networking and data centers — <b>including the depreciation of those assets</b>. Where the AI capex lands in the P&amp;L.']],
    compNote:'The <b>only</b> line that carries both a huge payroll and the depreciation of the AI build.',fwd:'The one line headed <b>up</b>. FY26 capex is framed at ~$220B (predominantly AWS); the depreciation it creates ramps from $42B toward ~$120B by FY28 (Summit model) — so this line keeps rising until the capacity monetizes.',
    traj:[12.4,12.8,11.1,11.9,14.2,14.9,13.9,15.1],
    why:'It is the <b>only functional line rising</b> as a share of revenue — the capex is hitting the P&amp;L faster than the revenue it will serve.',
    drivers:[['🧠','The AI build','R&amp;D for AI/ML and <b>custom-silicon development</b> (Trainium, Graviton) — spending ahead of the revenue it will generate.'],['🏗️','AWS infrastructure + D&amp;A','Servers and data centers scaling up, and the depreciation of that capacity, land here.'],['✂️','Partly offset by 2023 tech layoffs','The 2022–23 tech-role cuts pulled payroll back — but the AI investment more than replaced it.']],
    extra:'<div class="ew-h">The chain that compresses the margin</div>'+
      '<div class="ew-flow"><div class="ew-fn"><div class="ew-fn-v">$96.5B</div><div class="ew-fn-l">AWS capex (FY25)</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">$190B</div><div class="ew-fn-l">AWS PP&amp;E stock</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">depreciation</div><div class="ew-fn-l">lands in this line</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">−1.2 ppt</div><div class="ew-fn-l">of the operating margin</div></div></div>'+
      '<div class="ew-q">AWS margin +650bps YoY — but ~130bps from energy-derivative gains, leaving <b>~520bps of clean expansion</b> from custom-silicon mix, power and utilisation.<span class="ew-att">— Brian Olsavsky, CFO · Q2 2026</span></div>'+
      '<div class="ew-q">“As fast as we install this capacity, <b>we are monetizing it</b>.”<span class="ew-att">— Brian Olsavsky, CFO</span></div>'},
  {k:'marketing',name:'Sales &amp; marketing',kpis:[['$47B','of revenue: 6.6%'],['+0.3 ppt','to operating margin (YoY)'],['$3.4B','stock-based comp inside']],
    comp:[['📣','Advertising &amp; acquisition','Advertising, promotions and Prime-member acquisition.'],['🧑‍💼','S&amp;M payroll','Sales and marketing staff.']],
    compNote:'Leveraging down as the brand and the Prime base mature.',fwd:'Continued leverage as Prime matures and Amazon monetizes its own surface rather than buying demand.',
    traj:[5.9,6.7,5.7,6.9,8.2,7.7,6.9,6.6],
    why:'Falling as a share of revenue — Amazon spends proportionally less to win the next customer.',
    drivers:[['👑','Prime maturity','A large, mature Prime base needs proportionally less acquisition spend each year.'],['📣','Own-the-surface ads','Amazon increasingly <b>monetizes</b> its own traffic rather than buying demand — a structural tailwind.']],extra:''},
  {k:'gAdmin',name:'General &amp; administrative',kpis:[['$11B','of revenue: 1.6%'],['+0.2 ppt','to operating margin (YoY)'],['$1.7B','stock-based comp inside']],
    comp:[['🏢','Corporate functions','Finance, legal, HR, professional fees and corporate facilities.']],
    compNote:'The smallest line, and the most leveraged.',fwd:'Continued leverage — the leaner-org push persists (further severance booked in 2025–26).',
    traj:[1.9,1.9,1.7,1.9,2.3,2.1,1.8,1.6],
    why:'Pure operating leverage — corporate cost grows far slower than revenue, so it shrinks as a share every year.',
    drivers:[['✂️','The leaner-org push','~27k corporate roles cut in 2022–23 and further severance since — the flattening and regionalization Jassy drove.'],['📈','Fixed-cost leverage','Corporate overhead is largely fixed; revenue outgrew it every year.']],extra:''},
  {k:'otherOpex',name:'Other operating expense, net',kpis:[['$4.6B','of revenue: 0.6%'],['−0.5 ppt','to operating margin (YoY)'],['—','no stock-based comp']],
    comp:[['⚖️','Charges &amp; settlements','Amortization of acquired intangibles, impairments and legal settlements.']],
    compNote:'The “one-off” line — usually tiny, occasionally large.',fwd:'Reverts toward a small run-rate once the 2025 charges lap; no recurring guidance.',
    traj:[0.1,0.1,0.0,0.0,0.2,0.1,0.1,0.6],
    why:'FY2025 jumped to $4.6B — the reason 3Q25/4Q25 margins dipped. Not a run-rate.',
    drivers:[['⚖️','2025 one-offs','The <b>$2.5B FTC settlement</b>, the resolution of Italy tax disputes, and physical-store impairments — none recurring.']],extra:''}
];
// Unit economics per functional line — real, disclosed figures only; honest where Amazon does not
// disclose a per-unit metric. Attached to EW_LINES like the management-call timelines.
var EW_UNIT={
  costOfSales:
    '<div class="ew-flow">'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">50.3%</div><div class="ew-fn-l">gross margin (FY25)</div></div><div class="ew-far">←</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">60%+</div><div class="ew-fn-l">of paid units are 3P</div></div>'+
      '<div class="ew-fn"><div class="ew-fn-v">~18%</div><div class="ew-fn-l">of revenue is AWS</div></div>'+
      '<div class="ew-fn"><div class="ew-fn-v">~$60B</div><div class="ew-fn-l">advertising (FY25)</div></div>'+
    '</div>'+
    '<div class="ew-note">There is no single unit here — the economics are a <b>mix</b>. A first-party sale carries the full product cost; a third-party unit, an AWS dollar and an advertising dollar carry little to none. As 3P (60%+ of paid units), AWS and ads outgrow first-party retail, cost of sales falls as a share of revenue — the single biggest reason the operating margin keeps expanding.</div>',
  fulfillment:
    '<div class="ew-flow">'+
      '<div class="ew-fn"><div class="ew-fn-v">+15%</div><div class="ew-fn-l">units shipped (YoY, Q1 26)</div></div><div class="ew-far">vs</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">+9%</div><div class="ew-fn-l">fulfillment expense</div></div><div class="ew-far">→</div>'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">≈ −5%</div><div class="ew-fn-l">cost to serve per unit</div></div>'+
    '</div>'+
    '<div class="ew-note">Amazon does not disclose a dollar cost-per-unit, but the disclosed proxy is decisive: <b>units grew ~15% while fulfillment expense grew ~9%</b> (Q1 2026), so the cost to move a package keeps falling. 1M+ robots and the 2023 US network regionalization — shorter distances, fewer touches — are why. This is the retail flywheel that turned North America profitable.</div>',
  techInfra:
    '<div class="ew-note">This line has no clean per-unit metric — it blends engineering payroll with the depreciation of the AI build. The unit economics that matter are <b>AWS\'s</b>: a ~35% segment operating margin, with custom silicon (Trainium / Graviton) improving price-performance so each dollar of capacity monetizes better. The full segment unit economics live in the <b>Segments</b> tab; the capex → PP&amp;E → depreciation chain that lands in this line is charted below.</div>',
  marketing:
    '<div class="ew-note">Amazon stopped disclosing Prime membership (last official: 200M+, 2021) and has never disclosed a customer-acquisition cost — so there is no clean unit here. The disclosed truth is the ratio: <b>sales &amp; marketing fell from ~8% of revenue (2022) to ~6.6% (FY25)</b> even as the base grew. Two forces — a mature Prime base that needs less acquisition spend, and advertising (~$60B run-rate) that lets Amazon <b>monetize</b> its own surface instead of buying demand.</div>',
  gAdmin:
    '<div class="ew-flow">'+
      '<div class="ew-fn"><div class="ew-fn-v">$16</div><div class="ew-fn-l">G&amp;A per $1,000 of revenue (FY25)</div></div><div class="ew-far">↓ from</div>'+
      '<div class="ew-fn"><div class="ew-fn-v">$23</div><div class="ew-fn-l">per $1,000 (FY22)</div></div><div class="ew-far">via</div>'+
      '<div class="ew-fn" style="border-color:var(--brand-2)"><div class="ew-fn-v" style="color:var(--brand-2)">~41k</div><div class="ew-fn-l">corporate roles cut (2022-26)</div></div>'+
    '</div>'+
    '<div class="ew-note">The cleanest operating-leverage line: corporate cost per revenue dollar has fallen roughly a third — from <b>$23 to $16 per $1,000 of revenue</b> — as ~27k roles (2022-23) plus ~14k more (2025-26) came out and revenue kept compounding against a largely fixed base.</div>'
};
// Verbatim line-item definitions — the EXACT wording from Amazon's FY2025 Form 10-K, MD&A ▸ Operating
// Expenses (SEC EDGAR accession 0001018724-26-000004, amzn-20251231.htm). Quoted, not paraphrased.
var EW_SRC='— Amazon FY2025 Form 10-K · MD&amp;A, Operating Expenses (SEC EDGAR)';
var EW_DEF={
  costOfSales:'Cost of sales primarily consists of the purchase price of consumer products, inbound and outbound shipping costs, including costs related to sortation and delivery centers and where we are the transportation service provider, and digital media content costs where we record revenue gross, including video and music.',
  fulfillment:'Fulfillment costs primarily consist of those costs incurred in operating and staffing our North America and International segments’ fulfillment centers, physical stores, and customer service centers, including facilities and equipment expenses, such as depreciation and amortization, and rent; costs attributable to buying, receiving, inspecting, and warehousing inventories; picking, packaging, and preparing customer orders for shipment; payment processing and related transaction costs, including costs associated with our guarantee for certain seller transactions; responding to inquiries from customers; and supply chain management for our manufactured electronic devices.',
  techInfra:'Technology and infrastructure costs include payroll and related expenses for employees involved in the research and development of new and existing products and services, development, design, and maintenance of our stores, curation and display of products and services made available in our online stores, and infrastructure costs. Infrastructure costs include servers, networking equipment, and data center related depreciation and amortization, rent, utilities, and other expenses necessary to support AWS and other Amazon businesses.',
  marketing:'Sales and marketing costs include advertising and payroll and related expenses for personnel engaged in marketing and selling activities, including sales commissions related to AWS.',
  gAdmin:'General and administrative costs primarily consist of costs for corporate functions, including payroll and related expenses; facilities and equipment expenses, such as depreciation and amortization expense and rent; and professional fees.',
  otherOpex:'Other operating expense (income), net, consists primarily of the amortization of intangible assets and asset impairments.'
};
EW_LINES.forEach(function(l){ if(EW_CALLS[l.k]) l.calls=EW_CALLS[l.k]; if(EW_UNIT[l.k]) l.unit=EW_UNIT[l.k]; if(EW_DEF[l.k]) l.def=EW_DEF[l.k]; });
// (EXP_WORLD pop-up index removed — the expense full dives now render inline as tabs, see expenseTabsBody.)
// The six functional expense lines as a clickable index — rendered at the TOP of the
// Margins & Expenses pane styles. Self-contained.
// The six functional expense lines as an inline TAB strip (was 6 big cards + a cramped pop-up):
// pick a line and its full dive (ewBase: composition, unit economics, drivers, calls) renders in place.
function expenseTabsBody(){
  var defs=[
    {k:'costOfSales',c:SQUID,n:'Cost of sales',tag:'$356B · 49.7%'},
    {k:'fulfillment',c:BRAND,n:'Fulfillment',tag:'$109B · 15.2%'},
    {k:'techInfra',c:BRAND2,n:'Technology &amp; infrastructure',tag:'$108B · 15.1%'},
    {k:'marketing',c:GREEN,n:'Sales &amp; marketing',tag:'$47B · 6.6%'},
    {k:'gAdmin',c:GRAY,n:'General &amp; administrative',tag:'$11B · 1.6%'},
    {k:'otherOpex',c:'#B7791F',n:'Other operating expense, net',tag:'$4.6B · 0.6%'}
  ];
  var byk={}; EW_LINES.forEach(function(l){ byk[l.k]=l; });
  var h='<style>'+
    '.exp-explorer{border:1.5px solid var(--brand);border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,var(--brand-soft),transparent);margin:6px 0 6px}'+
    '.exp-explorer-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-2);margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.exp-explorer-h .exp-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}'+
    '.exp-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}'+
    '.exp-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:7px 12px;cursor:pointer;font-size:12px;font-weight:800;color:var(--navy);transition:.13s}'+
    '.exp-tab:hover{border-color:var(--brand)}'+
    '.exp-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}'+
    '.exp-tab.active .exp-tag{color:rgba(255,255,255,.8)}'+
    '.exp-tab .exp-dot{width:10px;height:10px;border-radius:3px;flex:none}'+
    '.exp-tab .exp-tag{font-size:10px;font-weight:800;color:var(--mu)}'+
    '.exp-panel-card{background:var(--card,#fff);border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}'+
  '</style>';
  h+='<div class="exp-explorer"><div class="exp-explorer-h">Expense explorer — the six functional lines <span class="exp-hint">tap a line to switch</span></div>';
  h+='<div class="exp-tabs">'+defs.map(function(d,i){ return '<button type="button" class="exp-tab'+(i===0?' active':'')+'" data-exptab="'+d.k+'"><span class="exp-dot" style="background:'+d.c+'"></span>'+d.n+' <span class="exp-tag">'+d.tag+'</span></button>'; }).join('')+'</div>';
  h+=EW_CSS;
  h+='<div class="exp-panels">'+defs.map(function(d,i){ return '<div class="exp-panel exp-panel-card" data-exppanel="'+d.k+'"'+(i>0?' hidden':'')+'>'+(byk[d.k]?ewBase(byk[d.k]):'')+'</div>'; }).join('')+'</div>';
  h+='</div>';
  return h;
}
function aLeasesBody(){   // Leases explorer — Miscellaneous ▸ Capex & Depreciation. Boxed + tabbed, like Expenses/Segments.
  var mbar=function(lab,parts){ return '<div style="margin:6px 0"><div style="font-size:10.5px;font-weight:800;color:var(--mu);margin-bottom:3px">'+lab+'</div><div style="display:flex;height:30px;border-radius:6px;overflow:hidden">'+parts.map(function(p){ return '<div style="width:'+p.w+'%;background:'+p.c+';display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:800;color:#fff;white-space:nowrap;min-width:0">'+p.t+'</div>'; }).join('')+'</div></div>'; };
  var box=function(ic,t,d){ return '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">'+ic+'</span>'+t+'</div><div class="ew-box-t">'+d+'</div></div>'; };
  var h='<style>'+EW_CSS.replace('<style>','').replace('</style>','')+
    '.exp-stat{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--bdr);border:1px solid var(--bdr);border-radius:9px;overflow:hidden;margin-top:10px}@media(max-width:560px){.exp-stat{grid-template-columns:repeat(2,1fr)}}'+
    '.exp-st{background:var(--card,#fff);padding:9px 12px}.exp-sl{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}.exp-sv{font-size:17px;font-weight:800;color:var(--navy);margin-top:2px}.exp-ss{font-size:9.5px;color:var(--mu);margin-top:1px}'+
    '.lx-explorer{border:1.5px solid var(--brand);border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,var(--brand-soft),transparent)}'+
    '.lx-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-2);margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.lx-h .lx-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}'+
    '.lx-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}.lx-tab{border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:8px 13px;cursor:pointer;font-size:12px;font-weight:800;color:var(--navy);transition:.13s}.lx-tab:hover{border-color:var(--brand)}.lx-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}'+
    '.lx-card{background:var(--card,#fff);border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}'+
  '</style>';
  h+='<div class="ov-sec"><div class="ov-sec-h">Leases — the other capacity bill (10-K Note 4)</div>';
  h+='<div class="lx-explorer"><div class="lx-h">Leases explorer <span class="lx-hint">tap a view</span></div>';
  var tabs=[['cost','Cost &amp; flow'],['bs','Assets vs obligations'],['pipe','The pipeline'],['what','What Amazon leases']];
  h+='<div class="lx-tabs">'+tabs.map(function(t,i){ return '<button type="button" class="lx-tab'+(i===0?' active':'')+'" data-lxtab="'+t[0]+'">'+t[1]+'</button>'; }).join('')+'</div>';
  // Panel 1 — cost & flow
  var p1='<div style="height:250px"><canvas id="aExpLease"></canvas></div>'+
    '<div class="exp-stat">'+
      '<div class="exp-st"><div class="exp-sl">Total lease cost FY25</div><div class="exp-sv">$20.3B</div><div class="exp-ss">op $14.0B · fin $3.6B · var $2.7B</div></div>'+
      '<div class="exp-st"><div class="exp-sl">Lease liabilities</div><div class="exp-sv">$121.8B</div><div class="exp-ss">gross · PV $101.5B</div></div>'+
      '<div class="exp-st"><div class="exp-sl">Weighted term</div><div class="exp-sv">10–13 yr</div><div class="exp-ss">op 10.0 · finance 12.6</div></div>'+
      '<div class="exp-st"><div class="exp-sl">Finance-lease D&amp;A</div><div class="exp-sv">$3.3B</div><div class="exp-ss">inside the $41.9B P&amp;E D&amp;A</div></div>'+
    '</div>'+
    '<div class="ew-h">Where the two lease types land</div>'+
    '<div class="ew-two">'+box('🏢','Operating leases','The bulk — fulfillment centers, offices, some data centers. The cost flows into <b>cost of sales / fulfillment / technology</b> (not a separate line); the asset is a right-of-use (ROU) asset on its own balance-sheet line.')+
      box('✈️','Finance leases','Ownership-like (e.g. Amazon Air aircraft, some equipment). The asset sits <b>inside PP&amp;E</b>, and its cost splits into <b>amortization ($3.3B, inside D&amp;A)</b> + <b>interest ($0.3B)</b> — that is why finance-lease D&amp;A is already in the $41.9B P&amp;E depreciation.')+'</div>';
  // Panel 2 — assets vs obligations
  var p2='<div class="ew-note">Beyond the ~$534B of <b>owned</b> gross PP&amp;E, Amazon controls a large <b>leased</b> asset base — and owes the payments behind it. This is that picture.</div>'+
    mbar('Right-of-use ASSETS — the leased capacity (~$142B)',[{w:60.7,c:BRAND2,t:'Operating ROU $86B'},{w:39.3,c:SQUID,t:'Finance ROU $55.6B'}])+
    mbar('Lease LIABILITIES — the obligation ($121.8B gross · PV $101.5B)',[{w:87.8,c:BRAND,t:'Operating $106.9B'},{w:12.2,c:GRAY,t:'Finance $14.9B'}])+
    '<div class="ew-note"><b>Finance-lease ROU ($55.6B) is already inside PP&amp;E</b> (so its depreciation is in D&amp;A); <b>operating-lease ROU ($86B) sits on its own line</b> — capacity that never shows up in the capex or PP&amp;E charts. Of the $121.8B liability, $87.3B is long-term. This is real leverage-lite: obligations that behave like debt but sit outside reported debt.</div>';
  // Panel 3 — the pipeline
  var p3='<div class="ov-callout" style="margin-top:0"><b>~$62B of leases &ldquo;not yet commenced&rdquo;</b> (FY2024, 10-K) — signed but not started, largely <b>data centers and fulfillment</b>. That is forward capacity <b>on top of</b> the $121.8B already capitalized, and it does not appear in capex, PP&amp;E or the lease liability until each lease starts.</div>'+
    '<div class="ew-h">The obligation is long-dated</div>'+
    mbar('Operating-lease payments by maturity',[{w:16,c:BRAND2,t:'≤1yr ~$12B'},{w:38,c:acxRGBA(BRAND2,0.7),t:'2–5yr'},{w:46,c:acxRGBA(BRAND2,0.4),t:'thereafter ~$44B'}])+
    '<div class="ew-note">Weighted remaining term ~<b>10 yr (operating) / 12.6 yr (finance)</b>. The bulk sits in &ldquo;thereafter&rdquo; — Amazon is committing to capacity a decade out, in step with the AI build. <span style="color:var(--mu)">Maturities &amp; not-yet-commenced per 10-K Note 4 (FY2024); balance-sheet totals FY2025.</span></div>';
  // Panel 4 — what Amazon leases
  var p4='<div class="ew-two">'+box('📦','Fulfillment &amp; logistics','Warehouses, sortation centers, delivery stations and (increasingly) grocery — the largest slice of operating leases. Leasing lets Amazon flex the network up and down without owning every building.')+
      box('🖥️','Data centers','A mix — Amazon <b>owns</b> core AWS capacity (the capex build) but also <b>leases</b> data-center space and power, especially to move fast; much of the not-yet-commenced pipeline is here.')+
      box('✈️','Amazon Air','The cargo-aircraft fleet is largely under <b>finance</b> leases — the main reason finance-lease assets and their amortization are material.')+
      box('🏢','Offices &amp; other','Corporate offices, physical stores and equipment round it out.')+'</div>'+
    '<div class="ew-note"><b>Own vs lease is a deliberate choice.</b> Amazon owns where control and long-run cost matter (core AWS/data centers → capex, PP&amp;E, D&amp;A) and leases where speed and flexibility matter (fulfillment real estate, incremental data-center space, aircraft). The two together are the real capacity picture — the capex charts only show the owned half.</div>';
  h+='<div class="lx-panels">'+
    '<div class="lx-panel lx-card" data-lxpanel="cost">'+p1+'</div>'+
    '<div class="lx-panel lx-card" data-lxpanel="bs" hidden>'+p2+'</div>'+
    '<div class="lx-panel lx-card" data-lxpanel="pipe" hidden>'+p3+'</div>'+
    '<div class="lx-panel lx-card" data-lxpanel="what" hidden>'+p4+'</div>'+
  '</div>';
  h+='</div></div>';
  return h;
}
function aBuildLeases(){   // lease-cost chart + Leases-explorer tab wiring (Miscellaneous ▸ Capex & Depreciation)
  var yrs=[2023,2024,2025], lc=aChartReady('aExpLease');
  if(lc){ aDestroy('aExpLease');
    var LT=[{k:'op',lab:'Operating lease',c:BRAND2},{k:'finAmort',lab:'Finance — amortization',c:SQUID},{k:'finInt',lab:'Finance — interest',c:GRAY},{k:'variable',lab:'Variable lease',c:'#B7791F'}];
    _aCharts['aExpLease']=new Chart(lc.getContext('2d'),{ type:'bar',
      data:{ labels:yrs.map(String), datasets:LT.map(function(t){ return { label:t.lab, data:yrs.map(function(y){ return A_TENK.leaseCost[y][t.k]/1000; }), backgroundColor:t.c, borderColor:'#fff', borderWidth:1, maxBarThickness:44, stack:'l' }; }) },
      options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': $'+c.parsed.y.toFixed(1)+'B'; }, footer:function(it){ return 'Total lease cost: $'+it.reduce(function(a,x){ return a+x.parsed.y; },0).toFixed(1)+'B'; } } } },
        scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('aExpLease'); }
  var pane=document.querySelector('.dd-pane[data-dd="misc"] .ovt-subpane[data-ovst="capex"]');
  if(pane && !pane._lxWired){ pane._lxWired=true;
    var lt=pane.querySelectorAll('.lx-tab');
    lt.forEach(function(b){ b.onclick=function(){ var k=b.getAttribute('data-lxtab');
      lt.forEach(function(x){ x.classList.toggle('active',x===b); });
      pane.querySelectorAll('.lx-panel').forEach(function(p){ p.hidden=(p.getAttribute('data-lxpanel')!==k); }); }; }); }
}
function aBuildExpenses(){
  aBuildBridge();
  aBuildNetBridge();
  aBuildSbc();
  var pane=document.querySelector('.ovt-subpane[data-ovst="margins"]');
  if(pane){
    var tog=function(sel,after){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); after(); }; }); };
    if(!pane._expWired){ pane._expWired=true;
      var GEN_BUILD={ margins:aBuildMargins, bridge:function(){ aBridgeSync(pane); aBuildBridge(); }, net:aBuildNetBridge, sbc:aBuildSbc };
      var gsel=pane.querySelector('.gen-chart');
      if(gsel){ gsel.onchange=function(){ var v=gsel.value;
        pane.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden=(s.getAttribute('data-gsec')!==v); });
        if(GEN_BUILD[v]) GEN_BUILD[v](); }; }
      tog('.br-mode', function(){ aBridgeSync(pane); aBuildBridge(); });
      tog('.br-gran', function(){ aBridgeSync(pane); aBuildBridge(); });
      tog('.br-view', aBuildBridge);
      tog('.br-yr', aBuildBridge);
      tog('.br-qtr', aBuildBridge);
      tog('.br-fy', aBuildBridge);
      tog('.nb-yr', aBuildNetBridge);
      tog('.nb-norm', aBuildNetBridge);
      var etabs=pane.querySelectorAll('.exp-tab');
      etabs.forEach(function(b){ b.onclick=function(){ var k=b.getAttribute('data-exptab');
        etabs.forEach(function(x){ x.classList.toggle('active',x===b); });
        pane.querySelectorAll('.exp-panel').forEach(function(p){ p.hidden=(p.getAttribute('data-exppanel')!==k); }); }; });
      aBridgeSync(pane); }
  }
}
var A_SEG=[ {k:'us',lab:'North America',c:BRAND,oi:'usOpInc',rev:'usRev',qoi:'naopinc',qrev:'usrev',bk:'na'},
  {k:'int',lab:'International',c:BRAND2,oi:'intOpInc',rev:'intRev',qoi:'intopinc',qrev:'intrev',bk:'intl'},
  {k:'aws',lab:'AWS',c:SQUID,oi:'awsOpInc',rev:'awsRev',qoi:'awsopinc',qrev:'aws',bk:'aws'} ];
// Segment D&A is disclosed (10-K Note 10) and lives in amznBBG.seg[bk].da (annual, FY23-25 actual + fwd);
// EBITDA margin = (operating income + segment D&A) ÷ segment revenue. No quarterly segment D&A → eb=null there.
function segDA(bk,y){ var s=amznBBG.seg[bk]; if(!s||!s.da||y<2023) return null; return (y<=2025)?s.da.a[y-2023]:(s.da.f?s.da.f[y-2026]:null); }
function segAnnualRows(){
  return A_OPEX_YEARS.map(function(y){ var r=A_OPEX[y], o={p:String(y)};
    A_SEG.forEach(function(s){ var oi=r[s.oi], rev=r[s.rev], da=segDA(s.bk,y);
      o[s.k]={oi:oi, mgn:Math.round(oi/rev*1000)/10, eb:(da==null?null:Math.round((oi+da)/rev*1000)/10)}; });
    o.consMgn=(function(){ var cost=A_OPEX_FN.reduce(function(a,f){ return a+r[f.k]; },0)+r.otherOpex; return Math.round((r.revenue-cost)/r.revenue*1000)/10; })();
    var ie=amznBBG.is.ebitda, ir=amznBBG.is.rev; o.consEb=(y>=2023&&ie&&ir&&ir.a[y-2023])?Math.round(ie.a[y-2023]/ir.a[y-2023]*1000)/10:null;
    return o; });
}
function segQuarterRows(){
  var q=amznResults.views.q.metrics, per=q.rev.periods, n=per.indexOf('2Q26'); if(n<0) n=per.length;
  var labels=per.slice(0,n);
  return labels.map(function(_,i){ var o={p:labels[i]};
    A_SEG.forEach(function(s){ var oi=q[s.qoi].act[i], rv=q[s.qrev].act[i]; o[s.k]={oi:oi, mgn:(oi==null||rv==null||!rv)?null:Math.round(oi/rv*1000)/10, eb:null}; });
    var a=q.opinc.act[i], b=q.rev.act[i]; o.consMgn=(a==null||b==null||!b)?null:Math.round(a/b*1000)/10; o.consEb=null;
    return o; });
}
// Segment deep-dive "worlds" — opened from the Segments tab via data-detail="seg:aws|us|int".
// VISUAL (reuses EW_CSS / ewSpark from the expense full dives). Data: 10-K Note 10 (segment capex/PP&E),
// segment operating margins, and the earnings-call record.
function segTiles(a){ return '<div class="ew-kpis">'+a.map(function(k){ return '<div class="ew-tile"><div class="ew-tv">'+k[0]+'</div><div class="ew-tl">'+k[1]+'</div></div>'; }).join('')+'</div>'; }
function segCapMini(cap,ppe){ return '<div class="ew-flow"><div class="ew-fn"><div class="ew-fn-v">'+cap+'</div><div class="ew-fn-l">net capex, FY25 (Note 10)</div></div><div class="ew-far">→</div><div class="ew-fn"><div class="ew-fn-v">'+ppe+'</div><div class="ew-fn-l">PP&amp;E stock</div></div></div>'; }
// Per-segment cost structure — Amazon does NOT disclose functional expenses by segment, so this is
// qualitative (from 10-K MD&A drivers + Note 10 capex/PP&E), explicitly flagged as inferred, with the
// one genuinely-assignable anchor (segment capex/PP&E). This is the "expense types per segment" the
// segment line otherwise black-boxes.
var SEG_COST={
  aws:{ note:'<b>What is (and isn\'t) broken out:</b> Amazon discloses AWS revenue, operating income, <b>D&amp;A and PP&amp;E by segment</b> (10-K Note 10) — but <b>not</b> the functional-expense split. So the cost <i>shape</i> below is qualitative, but the depreciation load is a <b>reported</b> number, not inferred.',
    boxes:[
      ['🖥️','Infrastructure depreciation — biggest, fastest-rising','AWS carries $190B of PP&amp;E (from $73B in 2023) and ~68% of group capex; depreciating that fleet is the largest and fastest-growing cost in the segment — and why margin expands only once capacity is utilized.'],
      ['⚡','Power &amp; energy','Data-center electricity is increasingly material as the fleet scales — Q2 26 margin carried ~130bps of energy-derivative gains, a measure of how much energy now moves the line.'],
      ['🧑‍💻','Engineering &amp; custom silicon','R&amp;D payroll for services and Trainium/Graviton design — spending ahead of the revenue it enables, but the source of the price-performance edge.']
    ],
    anchor:'Disclosed, not inferred: <b>AWS D&amp;A was $21.5B in FY25</b> (vs $12.5B in 2023) and Bloomberg consensus ramps it to <b>~$93B by 2028</b> — the largest and fastest-rising cost, reported by segment (Note 10). AWS also = ~68% of group capex and &gt;50% of PP&amp;E. Only the functional-expense split is undisclosed. See the D&amp;A-by-segment chart below.' },
  us:{ note:'<b>What is (and isn\'t) broken out:</b> Amazon reports North America revenue, operating income, <b>D&amp;A and PP&amp;E by segment</b> (Note 10) — but not the functional-expense split. The cost shape below is qualitative; the depreciation is disclosed.',
    boxes:[
      ['📦','Cost of sales (1P product) — largest, shrinking','First-party product cost is the biggest line, but it falls as a share as third-party (~61% of units) and advertising mix rises.'],
      ['🚚','Fulfillment &amp; shipping — the cost-to-serve','Running the FC network and last-mile delivery; the efficiency line — units +17% while this grows far less (robots, regionalization).'],
      ['📣','Advertising — a margin offset, not a cost','Ads ride the retail surface at near-pure incremental margin; growing +18%→+26%, it is the single biggest reason NA margin climbs.']
    ],
    anchor:'What IS assignable: NA capex ~$36B on ~8% of its revenue and $122B PP&amp;E — a fraction of AWS\'s intensity, so retail carries far less depreciation.' },
  int:{ note:'<b>What is (and isn\'t) broken out:</b> Same as North America — revenue, operating income, D&amp;A and PP&amp;E are reported by segment; only the functional-expense split is not. Two sub-economies sit under one line, which the reported margin blends.',
    boxes:[
      ['📦','The NA cost shape, a few years behind','COGS + fulfillment + shipping dominate, exactly like North America; established markets (Germany/UK/Japan) already run the efficient version.'],
      ['🌱','Emerging-market investment drag','India, Brazil and the Middle East still spend ahead of revenue — the build-out cost NA already absorbed, now sitting in this line.'],
      ['💱','FX — swings the print','A +$903M tailwind to 2025 operating income; the reported margin moves with the dollar as much as with operations.']
    ],
    anchor:'What IS assignable: International capex ~$7.6B and $31B PP&amp;E — the lightest footprint of the three, consistent with a retail (not infrastructure) cost base.' }
};
// Verbatim segment definitions — exact wording from Amazon's FY2025 Form 10-K, Note 10 (Segment
// Information), SEC EDGAR amzn-20251231.htm. Quoted, not paraphrased.
var SEG_DEF={
  aws:'The AWS segment consists of amounts earned from global sales of compute, storage, database, and other services for start-ups, enterprises, government agencies, and academic institutions.',
  us:'The North America segment primarily consists of amounts earned from retail sales of consumer products (including from sellers) and advertising and subscription services through North America-focused online and physical stores. This segment includes export sales from these online stores.',
  int:'The International segment primarily consists of amounts earned from retail sales of consumer products (including from sellers) and advertising and subscription services through internationally-focused online stores. This segment includes export sales from these internationally-focused online stores (including export sales from these online stores to customers in the U.S., Mexico, and Canada), but excludes export sales from our North America-focused online stores.'
};
var SEG_SRC='— Amazon FY2025 Form 10-K · Note 10, Segment Information (SEC EDGAR)';
function segCostBox(k){ var c=SEG_COST[k]; if(!c) return '';
  return (SEG_DEF[k]?'<div class="ew-h">How the 10-K defines this segment</div><div class="ew-q ew-def">“'+SEG_DEF[k]+'”<span class="ew-att">'+SEG_SRC+'</span></div>':'')+
    '<div class="ew-h">Cost structure — what Amazon breaks out (and doesn’t)</div>'+
    '<div class="ew-note">'+c.note+'</div>'+ewBoxes(c.boxes)+
    (c.anchor?'<div class="ew-note">'+c.anchor+'</div>':''); }
var SEG_WORLD={
  aws:{ t:'AWS — the profit engine', h:EW_CSS+
    segTiles([['35.4%','operating margin (FY25)'],['$45.6B','operating income — ~57% of group'],['$96.5B','net capex — 68% of the group'],['$190B','PP&E stock (from $73B in ’23)']])+
    '<div class="ew-h">The business</div><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">☁️</span>On-demand compute, storage, database &amp; AI</div><div class="ew-box-t">~18% of Amazon’s revenue, but the majority of its operating income — and where nearly all the capex goes. The bottom-line question for Amazon is a question about AWS.</div></div>'+
    '<div class="ew-h">Operating margin over time</div>'+ewSpark([28.4,26.3,29.8,29.8,28.5,27.1,37.0,35.4],7)+
    '<div class="ew-note">Expanding <b>through</b> the build: +650bps YoY in Q2’26 — ~130bps from energy-derivative gains, <b>~520bps clean</b> from custom-silicon mix, power and utilisation.</div>'+
    '<div class="ew-h">What moves it</div>'+
    '<div class="ew-two"><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">📈</span>Demand, contracted far out</div><div class="ew-box-t">Growth re-accelerating <b>+19% → +37%</b>; backlog (RPO) <b>$164B → $496B</b>; “2027 largely reserved, some 2028 spoken for.” The demand that justifies the capex.</div></div>'+
    '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">🧠</span>Custom silicon</div><div class="ew-box-t">Trainium &amp; Graviton + the Anthropic partnership — the cost-and-supply edge behind the margin. AI + chips each &gt;$25B run-rate.</div></div></div>'+
    '<div class="ew-h">The capex it demands → the D&amp;A that follows</div>'+segCapMini('$96.5B','$190B')+
    '<div class="ew-q">“As fast as we install this capacity, <b>we are monetizing it</b>.” The FY26 capex frame was raised to ~$220B, partly on the higher cost of memory.<span class="ew-att">— Brian Olsavsky, CFO</span></div>'+
    segCostBox('aws')+
    ewCallsBlock(SEG_CALLS.aws)+
    '<div class="ew-foot">Sources: 10-K Note 10 (segment capex/PP&amp;E); Q4’25–Q2’26 earnings calls; Bloomberg segment series.</div>' },
  us:{ t:'North America — the volume base + the ad layer', h:EW_CSS+
    segTiles([['6.9%','operating margin (FY25)'],['$29.6B','operating income'],['$35.9B','net capex (Note 10)'],['$122B','PP&E stock']])+
    '<div class="ew-h">The business</div><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">🛒</span>First-party store + 3P marketplace + advertising</div><div class="ew-box-t">The retail surface: own inventory, third-party sellers (~61% of units), and the high-margin ad layer riding on top. Margin has climbed ~4% → 7% in three years — on mix and cost, not price.</div></div>'+
    '<div class="ew-h">Operating margin over time</div>'+ewSpark([5.1,4.1,3.7,2.6,-0.9,4.2,6.4,6.9],7)+
    '<div class="ew-note">The FY2022 dip below zero was the over-investment trough; the climb since is advertising + fulfillment efficiency. The 3Q25 quarter carries the <b>$2.5B FTC settlement</b> — a charge, not a trend.</div>'+
    '<div class="ew-h">What moves it</div>'+
    '<div class="ew-two"><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">📣</span>Advertising — the margin lever</div><div class="ew-box-t">Growing <b>+18% → +26%</b>, riding the store at near-pure incremental margin. The single biggest reason NA margin expands.</div></div>'+
    '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">🤖</span>Fulfillment efficiency</div><div class="ew-box-t">Units <b>+17%</b> while fulfillment cost grows far less — 1M+ robots and regionalization. The operating-leverage flywheel.</div></div></div>'+
    '<div class="ew-h">Capital footprint</div>'+segCapMini('$35.9B','$122B')+
    segCostBox('us')+
    ewCallsBlock(SEG_CALLS.us)+
    '<div class="ew-foot">Sources: 10-K MD&amp;A (drivers: units + advertising, offset by fulfillment/tech/shipping) &amp; Note 10; Bloomberg segment series.</div>' },
  int:{ t:'International — the turnaround', h:EW_CSS+
    segTiles([['2.9%','operating margin (FY25)'],['$4.75B','operating income — from −$2.7B in ’22'],['$7.6B','net capex (Note 10)'],['$31B','PP&E stock']])+
    '<div class="ew-h">The business</div><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">🌍</span>Two businesses under one line</div><div class="ew-box-t"><b>Established markets</b> (Germany, UK, Japan) matured to profit and drive the reported margin; <b>emerging markets</b> (India, Brazil, Middle East) are still in the investment phase NA already passed through.</div></div>'+
    '<div class="ew-h">Operating margin over time</div>'+ewSpark([-3.3,-2.3,0.7,-0.7,-6.6,-2.0,2.7,2.9],7)+
    '<div class="ew-note">It crossed into profit in <b>2024</b> after years of build-out losses — the same curve NA already climbed, a few years behind.</div>'+
    '<div class="ew-h">What moves it</div>'+
    '<div class="ew-two"><div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">📣</span>The same flywheel</div><div class="ew-box-t">Units + advertising drive the established markets; fulfillment and shipping are the offset — exactly the NA playbook.</div></div>'+
    '<div class="ew-box"><div class="ew-box-h"><span class="ew-box-i">💱</span>FX swings the print</div><div class="ew-box-t">A <b>+$903M</b> tailwind to operating income in 2025 — the reported margin moves with the dollar as much as with operations.</div></div></div>'+
    '<div class="ew-h">Capital footprint</div>'+segCapMini('$7.6B','$31B')+
    segCostBox('int')+
    ewCallsBlock(SEG_CALLS.int)+
    '<div class="ew-foot">Sources: 10-K MD&amp;A (units + advertising, FX +$903M) &amp; Note 10; Bloomberg segment series.</div>' }
};
var A_TENK={
  segCapex:{ 2023:{na:17529,int:4144,aws:24843,corp:1828}, 2024:{na:24348,int:6643,aws:53267,corp:1494}, 2025:{na:35919,int:7617,aws:96496,corp:2320} },
  segPPE:{ 2023:{na:93632,int:24357,aws:72701,corp:13487}, 2024:{na:103041,int:25618,aws:110683,corp:13323}, 2025:{na:122043,int:30632,aws:190055,corp:14295} },
  sbc:{ 2023:{costOfSales:836,fulfillment:3090,techInfra:13434,marketing:4623,gAdmin:2040,total:24023}, 2024:{costOfSales:838,fulfillment:2973,techInfra:12150,marketing:4084,gAdmin:1966,total:22011}, 2025:{costOfSales:777,fulfillment:2703,techInfra:10871,marketing:3445,gAdmin:1671,total:19467} },
  leaseCost:{ 2023:{op:10550,finAmort:5899,finInt:304,variable:2165,total:18918}, 2024:{op:11961,finAmort:3866,finInt:285,variable:2465,total:18577}, 2025:{op:14006,finAmort:3284,finInt:312,variable:2694,total:20296} },
  leaseLiab:{ opGross:106914, finGross:14917, totalGross:121831, pv:101538, longTerm:87339, opTermYrs:10.0, finTermYrs:12.6 }
};
function segCapDaBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">The capital cycle by segment — capex builds it · PP&amp;E holds it · D&amp;A expenses it</div>'+
    '<div class="mch-ctl"><span class="acx-tog segcd-tog"><button type="button" data-segcd="capex" class="active">Capex</button><button type="button" data-segcd="ppe">PP&amp;E</button><button type="button" data-segcd="da">D&amp;A</button></span><span></span></div>'+
    '<div style="height:320px"><canvas id="aSegCapDa"></canvas></div>'+
    '<div class="acx-cap" id="aSegCapDaCap" style="font-size:11px;color:var(--mu);margin-top:8px"></div></div>';
}
function aBuildSegCapDa(){
  var pane=document.querySelector('.dd-pane[data-dd="misc"] .ovt-subpane[data-ovst="capex"]');   // relocated to Miscellaneous ▸ Capex & Depreciation
  var tg=pane?pane.querySelector('.segcd-tog .active'):null, mode=tg?tg.getAttribute('data-segcd'):'capex';
  var cv=aChartReady('aSegCapDa'); if(!cv) return; aDestroy('aSegCapDa');
  var SG=[{k:'na',bk:'na',lab:'North America',c:BRAND},{k:'int',bk:'intl',lab:'International',c:BRAND2},{k:'aws',bk:'aws',lab:'AWS',c:SQUID}];
  var labels, ds, cap;
  if(mode==='capex'){
    labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E'];
    var gf=amznBBG.is.capex.f.map(function(v){ return v==null?null:Math.abs(v); });   // group capex consensus (abs $M)
    var implied=SG.map(function(s){ var ppe=amznBBG.seg[s.bk].ppe, da=amznBBG.seg[s.bk].da, arr=[], prev=ppe.a[2];   // roll-forward weight: ΔnetPP&E + D&A (fall back to D&A where PP&E is missing)
      for(var i=0;i<3;i++){ var cur=ppe.f[i], d=da.f[i]||0, delta=(cur!=null&&prev!=null)?(cur-prev):0; arr.push(delta+d); if(cur!=null) prev=cur; } return arr; });
    ds=SG.map(function(s,si){
      var act=[2023,2024,2025].map(function(y){ return A_TENK.segCapex[y][s.k]/1000; });
      var fwd=[0,1,2].map(function(i){ var sum=implied.reduce(function(a,x){ return a+(x[i]||0); },0), mine=implied[si][i];
        return (!sum||gf[i]==null)?null:Math.round(gf[i]*mine/sum/100)/10; });   // allocate group capex by roll-forward share
      var vals=act.concat(fwd);
      return { label:s.lab, data:vals, backgroundColor:vals.map(function(_,i){ return i<3?s.c:acxRGBA(s.c,0.45); }), borderColor:'#fff', borderWidth:1, maxBarThickness:26, stack:'x' }; });
    cap='<b>Capex by segment.</b> Actuals from the 10-K (Note 10). Amazon gives no per-segment capex consensus, so the forward is the <b>group capex consensus</b> (BBG) <b>allocated across segments by each one\'s PP&amp;E roll-forward</b> (capex ≈ Δ net PP&amp;E + D&amp;A) — it ties to the group total and splits it by where the asset base is growing (AWS-led). Faded = allocated estimate.';
  } else {
    labels=['FY23','FY24','FY25','FY26E','FY27E','FY28E'];
    ds=SG.map(function(s){ var sr=amznBBG.seg[s.bk][mode], vals=sr.a.concat(sr.f).map(function(v){ return v==null?null:Math.round(v/100)/10; });
      return { label:s.lab, data:vals, backgroundColor:vals.map(function(_,i){ return i<3?s.c:acxRGBA(s.c,0.45); }), borderColor:'#fff', borderWidth:1, maxBarThickness:26, stack:'x' }; });
    cap=(mode==='da')?'D&amp;A by segment (disclosed, Note 10). The <b>AWS wave</b>: $12.5B (2023) → $21.5B (2025) → <b>~$93B (2028E)</b> — the AI capex landing in the P&amp;L. Faded = BBG consensus.'
        :'PP&amp;E, net by segment. AWS <b>$73B → $190B</b> (2023→25), consensus to <b>~$746B (2028E)</b> — the balance-sheet footprint of the build. Faded = BBG consensus.';
  }
  _aCharts['aSegCapDa']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':'$'+c.parsed.y.toFixed(1)+'B'); }, footer:function(it){ return 'Total: $'+it.reduce(function(a,x){ return a+(x.parsed.y||0); },0).toFixed(1)+'B'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('aSegCapDa');
  var capEl=pane?pane.querySelector('#aSegCapDaCap'):null; if(capEl) capEl.innerHTML=cap;
  if(pane && !pane._segcdWired){ pane._segcdWired=true;
    pane.querySelectorAll('.segcd-tog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.segcd-tog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSegCapDa(); }; }); }
}
function segmentsBody(){
  var h='<style>'+
    '.seg-tog-row{display:flex;justify-content:flex-end;margin-bottom:8px}'+
    /* engine blocks */
    '.seg-eng{display:flex;flex-direction:column;gap:10px;margin-top:4px}'+
    '.seg-b{border:1px solid var(--bdr);border-left:4px solid var(--bdr);border-radius:10px;padding:12px 15px;background:var(--card,#fff)}'+
    '.seg-b-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}'+
    '.seg-b-n{font-size:14px;font-weight:800;color:var(--navy)}'+
    '.seg-b-m{font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;background:rgba(0,0,0,.05);border-radius:20px;padding:2px 10px}'+
    '.seg-b-tr{font-size:11px;font-weight:700;color:var(--brand-2)}'+
    '.seg-b-role{font-size:11px;color:var(--mu);margin-left:auto;font-weight:600}'+
    '.seg-chips{display:flex;flex-wrap:wrap;gap:6px}'+
    '.seg-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--navy);background:rgba(0,0,0,.035);border:1px solid var(--bdr);border-radius:7px;padding:4px 9px}'+
    '.seg-chip b{font-weight:800}.seg-chip .up{color:#1f7a3d;font-weight:800}.seg-chip .dn{color:#B7791F;font-weight:800}'+
    '.seg-off{font-size:11px;color:var(--mu);margin-top:8px;line-height:1.45}.seg-off b{color:var(--navy)}'+
  '</style>';
  // segment engines — the clickable driver index, kept at the top of the pane (before the charts)
  var eng=[
    {c:SQUID,key:'aws',n:'AWS',m:'35% margin',role:'The profit engine',
      chips:['<span class="up">▲</span> Growth <b>+19% → +37%</b> (Q3\'24→Q2\'26)','Backlog (RPO) <b>$164B → $496B</b> (3×)','Custom silicon (Trainium) + Anthropic'],
      off:'<b>What pressures it:</b> technology-infrastructure spend to support growth — i.e. the capex/AI build flowing into the P&amp;L as depreciation (see Capex &amp; Depreciation). The bet: capacity installs 6–24 months before it bills.'},
    {c:BRAND,key:'us',n:'North America',m:'6.9% margin',role:'The volume base',
      chips:['<span class="up">▲</span> Advertising <b>+18% → +26%</b>','3P seller mix <b>~61%</b>','Units <b>+17%</b> vs fulfillment leverage'],
      off:'<b>The lever:</b> high-margin advertising riding the store + fulfillment efficiency (robotics, regionalization). <b>The noise:</b> 3Q25 op margin dips to 4.5% on the $2.5B FTC charge — a charge, not a trend.'},
    {c:BRAND2,key:'int',n:'International',m:'2.9% margin',role:'The turnaround',
      chips:['Turned profitable <b>2024</b> after years of losses','Same ads + units flywheel','FX a <b>+$903M</b> tailwind in 2025'],
      off:'<b>The path:</b> established markets (Germany, UK, Japan) matured to profit while emerging markets (India, Brazil, Middle East) still invest — the blended margin is early on the same curve NA already climbed.'}
  ];
  h+='<style>.seg-explorer{border:1.5px solid var(--brand);border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,var(--brand-soft),transparent);margin:6px 0 6px}'+
    '.seg-explorer-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-2);margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.seg-explorer-h .seg-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}'+
    '.segx-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}'+
    '.segx-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:8px 14px;cursor:pointer;font-size:12.5px;font-weight:800;color:var(--navy);transition:.13s}'+
    '.segx-tab:hover{border-color:var(--brand)}.segx-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}.segx-tab.active .segx-tag{color:rgba(255,255,255,.8)}'+
    '.segx-dot{width:11px;height:11px;border-radius:3px;flex:none}.segx-tag{font-size:10.5px;font-weight:700;color:var(--mu)}'+
    '.segx-panel-card{background:var(--card,#fff);border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}</style>';
  var segExp='<div class="seg-explorer"><div class="seg-explorer-h">Segment explorer — AWS · North America · International <span class="seg-hint">tap a segment to switch</span></div>'+
    '<div class="segx-tabs">'+eng.map(function(s,i){ return '<button type="button" class="segx-tab'+(i===0?' active':'')+'" data-segtab="'+s.key+'"><span class="segx-dot" style="background:'+s.c+'"></span>'+s.n+' <span class="segx-tag">'+s.m+' · '+s.role+'</span></button>'; }).join('')+'</div>'+
    '<div class="segx-panels">'+eng.map(function(s,i){
      var head='<div class="seg-chips" style="margin-bottom:8px">'+s.chips.map(function(c){ return '<span class="seg-chip">'+c+'</span>'; }).join('')+'</div><div class="seg-off" style="margin-bottom:12px">'+s.off+'</div>';
      return '<div class="segx-panel segx-panel-card" data-segpanel="'+s.key+'"'+(i>0?' hidden':'')+'>'+head+(SEG_WORLD[s.key]?SEG_WORLD[s.key].h:'')+'</div>';
    }).join('')+'</div></div>';
  h+=aSegPicker();
  h+='<div class="seg-gsec" data-sgsec="oimargin">'+
    '<div class="seg-tog-row"><span class="acx-tog seg-tog"><button type="button" data-segg="y" class="active">Annual</button><button type="button" data-segg="q">Quarterly</button></span></div>'+
    '<div class="ov-sec"><div class="ov-sec-h">Operating income &amp; margin by segment</div>'+
    '<div class="mch-ctl"><span class="acx-tog sgm-tog"><button type="button" data-sgm="dollar" class="active">$B (income)</button><button type="button" data-sgm="opm">Op margin %</button><button type="button" data-sgm="ebm">EBITDA margin %</button></span><span></span></div>'+
    '<div style="height:300px"><canvas id="aSgMain"></canvas></div></div></div>';
  h+='<div class="seg-gsec" data-sgsec="mix" hidden>'+aSegMixBody()+'</div>';
  h+='<div class="seg-gsec" data-sgsec="bridge" hidden>'+aSegBridgeBody()+'</div>';
  h+=aCollap('Segment deep dives — the full read per segment (drivers, unit economics, cost structure, calls)', segExp, false);
  return h;
}
function aSegPicker(){
  var opts=[['oimargin','Operating income & margin by segment'],['mix','Where the revenue is vs where the profit is'],['bridge','The segment bridge — margin change & forward walk']];
  return '<div class="ov-sec" style="padding-bottom:10px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'+
    '<span style="font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)">Chart</span>'+
    '<select class="seg-chart" style="font-size:13px;font-weight:700;color:var(--navy);border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;background:#fff">'+
    opts.map(function(o){ return '<option value="'+o[0]+'"'+(o[0]==='oimargin'?' selected':'')+'>'+o[1]+'</option>'; }).join('')+
    '</select>'+
    '<span style="font-size:11px;color:var(--mu)">Pick one — the rest stay tucked away.</span>'+
    '</div></div>';
}
// The revenue-vs-profit divergence as an evolution (not a single FY): each segment's SHARE of revenue
// ⇄ SHARE of operating income, FY24→FY28E (actual + BBG consensus). International is profitable from
// FY24, so 100%-stacked shares stay clean. Data: amznBBG.seg (rev/oi by segment).
var A_SMIX_PTS=[{lab:'FY24',g:'a',i:1},{lab:'FY25',g:'a',i:2},{lab:'FY26E',g:'f',i:0},{lab:'FY27E',g:'f',i:1},{lab:'FY28E',g:'f',i:2}];
var SMIX_SG=[{k:'na',lab:'North America',c:BRAND},{k:'intl',lab:'International',c:BRAND2},{k:'aws',lab:'AWS',c:SQUID}];
function aSegMixBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Where the revenue is vs where the profit is</div>'+
    '<div class="mch-ctl"><span class="acx-tog smix-tog"><button type="button" data-smix="time" class="active">Over time (both)</button><button type="button" data-smix="pie">Latest FY (pies)</button></span>'+
      '<span style="font-size:11px;color:var(--mu)">per year: left bar = revenue mix · right bar = operating-income mix</span></div>'+
    '<div class="smix-bars"><div style="height:320px"><canvas id="aSegMix"></canvas></div></div>'+
    '<div class="smix-pies" style="display:none;gap:18px;flex-wrap:wrap;justify-content:center">'+
      '<div style="flex:1;min-width:210px;max-width:330px;text-align:center"><div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Revenue mix (FY25)</div><div style="height:230px"><canvas id="aSegMixR"></canvas></div></div>'+
      '<div style="flex:1;min-width:210px;max-width:330px;text-align:center"><div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Operating-income mix (FY25)</div><div style="height:230px"><canvas id="aSegMixO"></canvas></div></div>'+
    '</div></div>';
}
function aBuildSegMix(){
  var pane=document.querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="segments"]'); if(!pane) return;
  var tg=pane.querySelector('.smix-tog .active'), view=tg?tg.getAttribute('data-smix'):'time';
  var bars=pane.querySelector('.smix-bars'), pies=pane.querySelector('.smix-pies');
  if(bars) bars.style.display=view==='pie'?'none':'';
  if(pies) pies.style.display=view==='pie'?'flex':'none';
  function val(k,metric,g,i){ var s=amznBBG.seg[k]&&amznBBG.seg[k][metric]; return s?s[g][i]:null; }
  if(view==='pie'){   // two doughnuts, latest actual FY25 (a[2]) — revenue mix vs OI mix, side by side
    [['aSegMixR','rev'],['aSegMixO','oi']].forEach(function(pr){
      var cv=aChartReady(pr[0]); if(!cv) return; aDestroy(pr[0]);
      var vals=SMIX_SG.map(function(s){ return val(s.k,pr[1],'a',2)||0; }), tot=vals.reduce(function(a,b){ return a+b; },0);
      _aCharts[pr[0]]=new Chart(cv.getContext('2d'),{ type:'doughnut',
        data:{ labels:SMIX_SG.map(function(s){ return s.lab; }), datasets:[{ data:vals, backgroundColor:SMIX_SG.map(function(s){ return s.c; }), borderColor:'#fff', borderWidth:2 }] },
        options:{ responsive:true, maintainAspectRatio:false, cutout:'52%', plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
          tooltip:{ callbacks:{ label:function(c){ return c.label+': '+(tot?Math.round(c.parsed/tot*1000)/10:0)+'% ($'+(Math.round(c.parsed/100)/10).toFixed(1)+'B)'; } } } } } });
    });
    if(pane && !pane._smixWired) aSegMixWire(pane);
    return;
  }
  var cv=aChartReady('aSegMix'); if(!cv) return; aDestroy('aSegMix');
  var labels=A_SMIX_PTS.map(function(p){ return p.lab; });
  function shares(metric){ return SMIX_SG.map(function(s){ return { seg:s, data:A_SMIX_PTS.map(function(p){
      var tot=SMIX_SG.reduce(function(a,x){ return a+(val(x.k,metric,p.g,p.i)||0); },0), v=val(s.k,metric,p.g,p.i);
      return (tot&&v!=null)?Math.round(v/tot*1000)/10:null; }) }; }); }
  var rev=shares('rev'), oi=shares('oi'), ds=[];
  rev.forEach(function(r){ ds.push({ label:r.seg.lab, data:r.data, backgroundColor:r.seg.c, borderColor:'#fff', borderWidth:1, maxBarThickness:30, stack:'rev' }); });
  oi.forEach(function(o){ ds.push({ label:o.seg.lab+' (OI)', data:o.data, backgroundColor:o.seg.c, borderColor:'#fff', borderWidth:1, maxBarThickness:30, stack:'oi' }); });
  _aCharts['aSegMix']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 }, filter:function(it){ return it.text.indexOf('(OI)')<0; } } },
        tooltip:{ callbacks:{ label:function(c){ var oiB=c.dataset.stack==='oi'; return c.dataset.label.replace(' (OI)','')+' — '+(oiB?'OI':'revenue')+': '+(c.parsed.y==null?'—':c.parsed.y+'%'); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false } }, y:{ stacked:true, max:100, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } } } } });
  aZoom('aSegMix');
  if(pane && !pane._smixWired) aSegMixWire(pane);
}
function aSegMixWire(pane){ pane._smixWired=true;
  pane.querySelectorAll('.smix-tog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.smix-tog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSegMix(); }; });
}
function aBuildSegments(){
  var pane=document.querySelector('.dd-pane[data-dd="bottomline"] .ovt-subpane[data-ovst="segments"]');
  var tg=pane?pane.querySelector('.seg-tog .active'):null, gran=tg?tg.getAttribute('data-segg'):'y';
  var rows=(gran==='q')?segQuarterRows():segAnnualRows();
  var sgt=pane?pane.querySelector('.sgm-tog .active'):null, sgm=sgt?sgt.getAttribute('data-sgm'):'dollar';
  var mc=aChartReady('aSgMain');
  if(mc){ aDestroy('aSgMain'); var cfg;
    if(sgm==='dollar'){
      cfg={ type:'bar', data:{ labels:rows.map(function(r){ return r.p; }), datasets:A_SEG.map(function(s){ return { label:s.lab, data:rows.map(function(r){ return r[s.k].oi==null?null:r[s.k].oi/1000; }), backgroundColor:s.c, borderColor:'#fff', borderWidth:1, maxBarThickness:32, stack:'oi' }; }) },
        options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
          plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': $'+c.parsed.y.toFixed(1)+'B'; }, footer:function(it){ return 'Total: $'+it.reduce(function(a,x){ return a+(x.parsed.y||0); },0).toFixed(1)+'B'; } } } },
          scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } };
    } else {
      var fld=(sgm==='ebm')?'eb':'mgn', cfld=(sgm==='ebm')?'consEb':'consMgn';
      var ds=A_SEG.map(function(s){ return { label:s.lab, data:rows.map(function(r){ return r[s.k][fld]; }), borderColor:s.c, backgroundColor:s.c, borderWidth:2, pointRadius:2, tension:0.25, spanGaps:true }; });
      ds.push({ label:'Consolidated', data:rows.map(function(r){ return r[cfld]; }), borderColor:'#1E2733', backgroundColor:'#1E2733', borderWidth:2.5, pointRadius:2, tension:0.25, borderDash:[5,4] });
      cfg={ type:'line', data:{ labels:rows.map(function(r){ return r.p; }), datasets:ds },
        options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
          plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':c.parsed.y+'%'); } } } },
          scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } } } } };
    }
    _aCharts['aSgMain']=new Chart(mc.getContext('2d'), cfg); aZoom('aSgMain'); }
  if(pane && !pane._segWired){ pane._segWired=true;
    var SEG_BUILD={ oimargin:aBuildSegments, mix:aBuildSegMix, bridge:aBuildSegBridge };
    var ssel=pane.querySelector('.seg-chart');
    if(ssel){ ssel.onchange=function(){ var v=ssel.value;
      pane.querySelectorAll('.seg-gsec').forEach(function(s){ s.hidden=(s.getAttribute('data-sgsec')!==v); });
      if(SEG_BUILD[v]) SEG_BUILD[v](); }; }
    pane.querySelectorAll('.seg-tog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.seg-tog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSegments(); }; });
    pane.querySelectorAll('.sgm-tog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.sgm-tog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSegments(); }; });
    var segtog=function(sel){ pane.querySelectorAll(sel+' button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll(sel+' button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildSegBridge(); }; }); };
    segtog('.sbr-mode'); segtog('.sbr-from'); segtog('.sbr-to'); segtog('.sbr-fy');
    pane.querySelectorAll('.sbr-ctl-fwd input[type=range]').forEach(function(s){ s.addEventListener('input', aBuildSegBridge); });
    var stabs=pane.querySelectorAll('.segx-tab');
    stabs.forEach(function(b){ b.onclick=function(){ var key=b.getAttribute('data-segtab');
      stabs.forEach(function(x){ x.classList.toggle('active',x===b); });
      pane.querySelectorAll('.segx-panel').forEach(function(p){ p.hidden=(p.getAttribute('data-segpanel')!==key); }); }; }); }
  aBuildSegMix();
  aBuildSegBridge();
}
// ═══ Bottom Line ▸ Capex & Depreciation — seeds + engine (restored) ═══
// AMZN Capex/D&A seed -- snapshot of 'DCF AMZN.xlsm' (D&A + Segments tabs), FY2019-FY2028.
// 2019-2025 = 10-K/8-K actuals as tied out in the DCF; 2026-2028 = Summit model projection.
// $mm unless noted. depPPE ties to reported PP&E depreciation; effDepRate = depPPE / avg gross PP&E (ex CIP & Land).
var A_CAPEX_YEARS=[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
var A_CAPEX_FIRST_PROJ=2026;
var A_CAPEX={
  2019:{"capex":16861,"grossLB":39223,"grossServers":38836.0,"grossHeavy":16261.0,"grossOtherEq":16213.0,"grossOtherAssets":3111,"grossCIP":6036,"depLB":889.0,"depServers":9066.0,"depHeavy":1518.0,"depOtherEq":3028.0,"depOtherAssets":599.0,"depPPE":15100,"amort":null,"da":null,"effDepRate":0.1518,"cogs":165536,"revenue":280522,"capexPctRev":0.0601,"daPctCogs":0,"deployFactor":0.5716,"adjFactor":1.0446,"lifeBuildings":40,"lifeServers":4,"lifeHeavy":10,"lifeOther":5,"grossProfit":114986,"grossMargin":0.4099},
  2020:{"capex":40141,"grossLB":57324,"grossServers":52949.0,"grossHeavy":22170.0,"grossOtherEq":22105.0,"grossOtherAssets":3772,"grossCIP":15228,"depLB":1114.0,"depServers":9867.0,"depHeavy":1859.0,"depOtherEq":2852.0,"depOtherAssets":508.0,"depPPE":16200.0,"amort":8980.0,"da":25180,"effDepRate":0.1213,"cogs":233307,"revenue":386064,"capexPctRev":0.104,"daPctCogs":0.1079,"deployFactor":0.5388,"adjFactor":0.9475,"lifeBuildings":40,"lifeServers":4.5,"lifeHeavy":10,"lifeOther":6.5,"grossProfit":152757,"grossMargin":0.3957},
  2021:{"capex":61053,"grossLB":81104,"grossServers":70082.0,"grossHeavy":29344.0,"grossOtherEq":29257.0,"grossOtherAssets":4118,"grossCIP":24895,"depLB":1686.0,"depServers":13946.0,"depHeavy":2628.0,"depOtherEq":4031.0,"depOtherAssets":610.0,"depPPE":22900.0,"amort":11533.0,"da":34433,"effDepRate":0.1254,"cogs":272344,"revenue":469822,"capexPctRev":0.1299,"daPctCogs":0.1264,"deployFactor":0.5799,"adjFactor":0.9976,"lifeBuildings":40,"lifeServers":4.5,"lifeHeavy":10,"lifeOther":6.5,"grossProfit":197478,"grossMargin":0.4203},
  2022:{"capex":63645,"grossLB":91650,"grossServers":85754.0,"grossHeavy":35905.0,"grossOtherEq":35799.0,"grossOtherAssets":4602,"grossCIP":30020,"depLB":2012.0,"depServers":14039.0,"depHeavy":3233.0,"depOtherEq":4959.0,"depOtherAssets":657.0,"depPPE":24900.0,"amort":17021.0,"da":41921,"effDepRate":0.1085,"cogs":288831,"revenue":513983,"capexPctRev":0.1238,"daPctCogs":0.1451,"deployFactor":0.614,"adjFactor":0.9645,"lifeBuildings":40,"lifeServers":5.5,"lifeHeavy":10,"lifeOther":6.5,"grossProfit":225152,"grossMargin":0.4381},
  2023:{"capex":52729,"grossLB":105293,"grossServers":100775.0,"grossHeavy":42194.0,"grossOtherEq":42070.0,"grossOtherAssets":5116,"grossCIP":28840,"depLB":2353.0,"depServers":17112.0,"depHeavy":3941.0,"depOtherEq":6045.0,"depOtherAssets":749.0,"depPPE":30200.0,"amort":18463.0,"da":48663,"effDepRate":0.112,"cogs":304739,"revenue":574785,"capexPctRev":0.0917,"daPctCogs":0.1597,"deployFactor":0.6199,"adjFactor":0.9889,"lifeBuildings":40,"lifeServers":5.5,"lifeHeavy":10,"lifeOther":6.5,"grossProfit":270046,"grossMargin":0.4698},
  2024:{"capex":82999,"grossLB":123039,"grossServers":113156,"grossHeavy":52228,"grossOtherEq":53509,"grossOtherAssets":5487,"grossCIP":46636,"depLB":2603.0,"depServers":17054.0,"depHeavy":4555.0,"depOtherEq":7111.0,"depOtherAssets":777.0,"depPPE":32100,"amort":20695,"da":52795,"effDepRate":0.1017,"cogs":326288,"revenue":637959,"capexPctRev":0.1301,"daPctCogs":0.1618,"deployFactor":0.5591,"adjFactor":0.9467,"lifeBuildings":40,"lifeServers":6,"lifeHeavy":10,"lifeOther":6.5,"grossProfit":311671,"grossMargin":0.4885},
  2025:{"capex":131819,"grossLB":155121,"grossServers":172492,"grossHeavy":65545,"grossOtherEq":63376,"grossOtherAssets":5819,"grossCIP":71745,"depLB":3159.0,"depServers":24500.0,"depHeavy":4894.0,"depOtherEq":8533.0,"depOtherAssets":814.0,"depPPE":41900.0,"amort":23856.0,"da":65756,"effDepRate":0.1053,"cogs":356414,"revenue":716924,"capexPctRev":0.1839,"daPctCogs":0.1845,"deployFactor":0.581,"adjFactor":0.9295,"lifeBuildings":40,"lifeServers":5.7,"lifeHeavy":11.5,"lifeOther":6.5,"grossProfit":360510,"grossMargin":0.5029},
  2026:{"capex":221456.0,"grossLB":218610.0,"grossServers":277684.0,"grossHeavy":83261.0,"grossOtherEq":76663.0,"grossOtherAssets":6926.0,"grossCIP":92409.0,"depLB":4407.0,"depServers":39781.0,"depHeavy":6351.0,"depOtherEq":10517.0,"depOtherAssets":955.0,"depPPE":62012.0,"amort":24000,"da":86012.0,"effDepRate":0.1121,"cogs":398760.0,"revenue":831124.0,"capexPctRev":0.2665,"daPctCogs":0.2157,"deployFactor":0.5896,"adjFactor":0.955,"lifeBuildings":40,"lifeServers":5.7,"lifeHeavy":11.5,"lifeOther":6.5,"grossProfit":432363.0,"grossMargin":0.5202},
  2027:{"capex":276820.0,"grossLB":298888.0,"grossServers":409173.0,"grossHeavy":105407.0,"grossOtherEq":93273.0,"grossOtherAssets":8310.0,"grossCIP":123600.0,"depLB":6069.0,"depServers":59962.0,"depHeavy":8036.0,"depOtherEq":12752.0,"depOtherAssets":1142.0,"depPPE":87962.0,"amort":24000,"da":111962.0,"effDepRate":0.1133,"cogs":1640111.0,"revenue":959800.0,"capexPctRev":0.2884,"daPctCogs":0.0683,"deployFactor":0.5825,"adjFactor":0.955,"lifeBuildings":40,"lifeServers":5.7,"lifeHeavy":11.5,"lifeOther":6.5,"grossProfit":null,"grossMargin":null},
  2028:{"capex":346025.0,"grossLB":399235.0,"grossServers":573535.0,"grossHeavy":133089.0,"grossOtherEq":114034.0,"grossOtherAssets":10041.0,"grossCIP":175504.0,"depLB":8168.0,"depServers":85352.0,"depHeavy":10156.0,"depOtherEq":15565.0,"depOtherAssets":1376.0,"depPPE":120616.0,"amort":24000,"da":144616.0,"effDepRate":0.1143,"cogs":880952.0,"revenue":1101190.0,"capexPctRev":0.3142,"daPctCogs":0.1642,"deployFactor":0.5825,"adjFactor":0.955,"lifeBuildings":40,"lifeServers":5.7,"lifeHeavy":11.5,"lifeOther":6.5,"grossProfit":220238.0,"grossMargin":0.2},
};
// AMZN operating-expense & segment seed -- snapshot of 'DCF AMZN.xlsm' Segments tab, FY2018-FY2025 actuals.
// By-function opex is CONSOLIDATED (Amazon discloses functional expense only company-wide, not by segment).
// Functional lines are mutually exclusive and sum to total operating cost; 'shipping' is a memo item (overlaps), kept separate.
// Segment lines: net sales + operating income by segment (NA / International / AWS). $mm.
var A_OPEX_YEARS=[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
var A_OPEX={
  2018:{"costOfSales":139156,"fulfillment":34027,"techInfra":28837,"marketing":13814,"gAdmin":4336,"otherOpex":297,"shipping":27668,"usRev":141366,"intRev":65865,"awsRev":25656,"usOpex":134099,"intOpex":68008,"awsOpex":18360,"revenue":232887,"usOpInc":7267,"intOpInc":-2143,"awsOpInc":7296},
  2019:{"costOfSales":165536,"fulfillment":40231,"techInfra":35932,"marketing":18879,"gAdmin":5203,"otherOpex":201,"shipping":37946,"usRev":170773,"intRev":74723,"awsRev":35026,"usOpex":163740,"intOpex":76417,"awsOpex":25825,"revenue":280522,"usOpInc":7033,"intOpInc":-1694,"awsOpInc":9201},
  2020:{"costOfSales":233307,"fulfillment":58516,"techInfra":42738,"marketing":22010,"gAdmin":6668,"otherOpex":-74,"shipping":61116,"usRev":236282,"intRev":104412,"awsRev":45370,"usOpex":227631,"intOpex":103695,"awsOpex":31839,"revenue":386064,"usOpInc":8651,"intOpInc":717,"awsOpInc":13531},
  2021:{"costOfSales":272344,"fulfillment":75111,"techInfra":56052,"marketing":32551,"gAdmin":8823,"otherOpex":62,"shipping":76673,"usRev":279833,"intRev":127787,"awsRev":62202,"usOpex":272562,"intOpex":128711,"awsOpex":43670,"revenue":469822,"usOpInc":7271,"intOpInc":-924,"awsOpInc":18532},
  2022:{"costOfSales":288831,"fulfillment":84299,"techInfra":73213,"marketing":42238,"gAdmin":11891,"otherOpex":1263,"shipping":83520,"usRev":315880,"intRev":118007,"awsRev":80096,"usOpex":318727,"intOpex":125753,"awsOpex":57255,"revenue":513983,"usOpInc":-2847,"intOpInc":-7746,"awsOpInc":22841},
  2023:{"costOfSales":304739,"fulfillment":90619,"techInfra":85622,"marketing":44370,"gAdmin":11816,"otherOpex":767,"shipping":89480,"usRev":352828,"intRev":131200,"awsRev":90757,"usOpex":337951,"intOpex":133856,"awsOpex":66126,"revenue":574785,"usOpInc":14877,"intOpInc":-2656,"awsOpInc":24631},
  2024:{"costOfSales":326288,"fulfillment":98505,"techInfra":88544,"marketing":43907,"gAdmin":11359,"otherOpex":763,"shipping":95849,"usRev":387497,"intRev":142906,"awsRev":107556,"usOpex":362530,"intOpex":139114,"awsOpex":67722,"revenue":637959,"usOpInc":24967,"intOpInc":3792,"awsOpInc":39834},
  2025:{"costOfSales":356414,"fulfillment":109074,"techInfra":108521,"marketing":47129,"gAdmin":11172,"otherOpex":4639,"shipping":45865,"usRev":426305,"intRev":161894,"awsRev":128725,"usOpex":396686,"intOpex":157144,"awsOpex":83119,"revenue":716924,"usOpInc":29619,"intOpInc":4750,"awsOpInc":45606},
};
// Functional expense lines (mutually exclusive, sum to total operating cost). Shipping excluded (memo/overlap).
var A_OPEX_FN=[
  {k:'costOfSales',lab:'Cost of sales',c:SQUID},
  {k:'fulfillment',lab:'Fulfillment',c:BRAND},
  {k:'techInfra',lab:'Technology & infrastructure',c:BRAND2},
  {k:'marketing',lab:'Sales & marketing',c:GREEN},
  {k:'gAdmin',lab:'General & administrative',c:GRAY}
];
var A_SEG_OI=[ {k:'usOpInc',lab:'North America',c:BRAND}, {k:'intOpInc',lab:'International',c:BRAND2}, {k:'awsOpInc',lab:'AWS',c:SQUID} ];
// DCF baseline projection (what the model prints today) — for the engine-vs-model readout.
var A_CAPEX_DCF={ 2026:{depPPE:62012,da:86012,eff:0.1121}, 2027:{depPPE:87962,da:111962,eff:0.1133}, 2028:{depPPE:120616,da:144616,eff:0.1143} };
// Per-year deployment factor the DCF actually uses (from each year's quarterly capex seasonality).
var A_CX_DEPLOY={ 2026:0.5896, 2027:0.5825, 2028:0.5825 };
// Asset-class registry — stack order chosen for CVD-safe adjacency; portal brand palette.
var A_CX_CLS=[
  {k:'Servers',     lab:'Servers & networking',      c:BRAND2,   gk:'grossServers',     dk:'depServers'},
  {k:'LB',          lab:'Land & buildings',          c:BRAND,    gk:'grossLB',          dk:'depLB'},
  {k:'CIP',         lab:'Construction in progress',  c:'#7A5AF8',gk:'grossCIP',         dk:null},
  {k:'Heavy',       lab:'Heavy equipment',           c:GREEN,    gk:'grossHeavy',       dk:'depHeavy'},
  {k:'OtherEq',     lab:'Other equipment',           c:SQUID,    gk:'grossOtherEq',     dk:'depOtherEq'},
  {k:'OtherAssets', lab:'Other assets',              c:GRAY,     gk:'grossOtherAssets', dk:'depOtherAssets'}
];
// Gross PP&E mix as a WAFFLE — 100 squares, each = 1% of the asset base, coloured by class.
// You SEE short-life servers displace 40-yr buildings as you step the year — the mix shift that
// bends depreciation up faster than capex. Pure CSS grid (no chart lib).
// Gross PP&E mix as an EVOLUTION — 100%-stacked (or $B) by asset class across FY19→FY28E, so you see
// short-life servers displace 40-yr buildings over the whole series (the mix shift that bends
// depreciation up faster than capex). Actuals per 10-K (Note 3); FY26E-28E from the model's projection.
function aWaffleBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Gross PP&amp;E mix — the shift over time</div>'+
    '<div class="mch-ctl"><span class="acx-tog ppemix-tog"><button type="button" data-ppem="pct" class="active">% of asset base</button><button type="button" data-ppem="abs">$B</button></span><span></span></div>'+
    '<div style="height:320px"><canvas id="aPpeMix"></canvas></div></div>';
}
function aBuildWaffle(){
  var pane=document.querySelector('.dd-pane[data-dd="misc"] .ovt-subpane[data-ovst="capex"]'); if(!pane) return;
  var tg=pane.querySelector('.ppemix-tog .active'), pct=(tg?tg.getAttribute('data-ppem'):'pct')!=='abs';
  var cv=aChartReady('aPpeMix'); if(!cv) return; aDestroy('aPpeMix');
  var years=[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028];
  var labels=years.map(function(y){ return 'FY'+String(y).slice(2)+(y>2025?'E':''); });
  var tot=years.map(function(y){ var s=A_CAPEX[y]; return A_CX_CLS.reduce(function(a,c){ return a+(s[c.gk]||0); },0); });
  var ds=A_CX_CLS.map(function(c){ return { label:c.lab,
    data:years.map(function(y,i){ var v=A_CAPEX[y][c.gk]||0; return pct?(tot[i]?Math.round(v/tot[i]*1000)/10:null):Math.round(v/100)/10; }),
    backgroundColor:years.map(function(y){ return y>2025?acxRGBA(c.c,0.45):c.c; }), borderColor:'#fff', borderWidth:1, maxBarThickness:34, stack:'p' }; });
  _aCharts['aPpeMix']=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':(pct?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B')); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ stacked:true, max:pct?100:undefined, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return pct?v+'%':'$'+v+'B'; } } } } } });
  aZoom('aPpeMix');
  if(pane && !pane._ppemWired){ pane._ppemWired=true;
    pane.querySelectorAll('.ppemix-tog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.ppemix-tog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aBuildWaffle(); }; }); }
}
var A_CX_CTRLS=[
  {grp:'Capex path — YoY growth %'},
  {id:'g26',lab:'2026',min:-20,max:150,step:1,def:68,u:'%',warn:1},
  {id:'g27',lab:'2027',min:-20,max:150,step:1,def:25,u:'%',warn:1},
  {id:'g28',lab:'2028',min:-20,max:150,step:1,def:25,u:'%',warn:1},
  {grp:'Capex allocation — % of each year’s capex',sum:1},
  {id:'mServers',lab:'Servers & networking',min:0,max:80,step:0.5,def:47.5,u:'%'},
  {id:'mLB',lab:'Land & buildings',min:0,max:60,step:0.5,def:23,u:'%'},
  {id:'mCIP',lab:'Construction in progress',min:0,max:50,step:0.5,def:15,u:'%'},
  {id:'mHeavy',lab:'Heavy equipment',min:0,max:30,step:0.5,def:8,u:'%'},
  {id:'mOtherEq',lab:'Other equipment',min:0,max:30,step:0.5,def:6,u:'%'},
  {id:'mOtherAssets',lab:'Other assets',min:0,max:10,step:0.1,def:0.5,u:'%'},
  {grp:'Useful lives — years'},
  {id:'lServers',lab:'Servers & networking',min:3,max:10,step:0.1,def:5.7},
  {id:'lBuildings',lab:'Buildings',min:15,max:50,step:0.5,def:40},
  {id:'lHeavy',lab:'Heavy equipment',min:5,max:20,step:0.5,def:11.5},
  {id:'lOther',lab:'Other equip. & assets',min:3,max:12,step:0.5,def:6.5},
  {grp:'Timing & calibration'},
  {id:'deploy',lab:'Deployment factor',min:0.3,max:1,step:0.005,def:0.5896,dec:3},
  {id:'adj',lab:'Prior-stock adjustment',min:0.85,max:1.05,step:0.001,def:0.955,dec:3}
];
var A_CX_SCEN={
  base:{ g26:68,g27:25,g28:25, mServers:47.5,mLB:23, lServers:5.7, deploy:null },
  ai:{ g26:90,g27:45,g28:40, mServers:55,mLB:18, lServers:5.0, deploy:0.65 },
  decel:{ g26:35,g27:8,g28:8, mServers:40,mLB:28, lServers:6.5, deploy:0.55 }
};
function acxRGBA(hex,a){ var h=hex.replace('#',''); var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16); return 'rgba('+r+','+g+','+b+','+a+')'; }
var acxFmt=function(n){ return n==null?'–':Math.round(n).toLocaleString('en-US'); };
var acxB=function(n){ return n==null?'–':'$'+(Math.round(n/100)/10).toLocaleString('en-US')+'B'; };
var acxPct=function(n,d){ return n==null?'–':(n*100).toFixed(d==null?1:d)+'%'; };
function aCxRun(st){
  var base=A_CAPEX[2025], CIPCONV=0.40, LAND=0.05, AMORT=24000;
  var prev={LB:base.grossLB,Servers:base.grossServers,Heavy:base.grossHeavy,OtherEq:base.grossOtherEq,OtherAssets:base.grossOtherAssets,CIP:base.grossCIP};
  var prevCap=base.capex, out={};
  [2026,2027,2028].forEach(function(y,i){
    var cap=prevCap*(1+st.g[i]/100);
    var deploy=st.deploy!=null?st.deploy:A_CX_DEPLOY[y];
    var add={LB:cap*st.mix.LB,Servers:cap*st.mix.Servers,Heavy:cap*st.mix.Heavy,OtherEq:cap*st.mix.OtherEq,OtherAssets:cap*st.mix.OtherAssets,CIP:cap*st.mix.CIP};
    var cipflow=CIPCONV*add.CIP;
    var g={LB:prev.LB+add.LB+cipflow,Servers:prev.Servers+add.Servers,Heavy:prev.Heavy+add.Heavy,OtherEq:prev.OtherEq+add.OtherEq,OtherAssets:prev.OtherAssets+add.OtherAssets,CIP:prev.CIP+add.CIP-cipflow};
    function dc(cur,pr,life,la){ la=la||1; return (pr*la/life)*st.adj + ((cur-pr)*la/life)*deploy; }
    var dep={LB:dc(g.LB,prev.LB,st.life.Buildings,1-LAND),Servers:dc(g.Servers,prev.Servers,st.life.Servers),Heavy:dc(g.Heavy,prev.Heavy,st.life.Heavy),OtherEq:dc(g.OtherEq,prev.OtherEq,st.life.Other),OtherAssets:dc(g.OtherAssets,prev.OtherAssets,st.life.Other)};
    var depPPE=dep.LB+dep.Servers+dep.Heavy+dep.OtherEq+dep.OtherAssets;
    function exCL(o){ return o.LB*(1-LAND)+o.Servers+o.Heavy+o.OtherEq+o.OtherAssets; }
    out[y]={capex:cap,gross:g,dep:dep,depPPE:depPPE,da:depPPE+AMORT,amort:AMORT,eff:depPPE/((exCL(prev)+exCL(g))/2)};
    prev=g; prevCap=cap;
  });
  return out;
}
function aCxState(root){
  function v(id){ var el=root.querySelector('#acx_'+id); return el?+el.value:0; }
  var pane=root.querySelector('.ovt-subpane[data-ovst="capex"]');
  var touched=pane&&pane._acxDeployTouched;
  return { g:[v('g26'),v('g27'),v('g28')],
    mix:{Servers:v('mServers')/100,LB:v('mLB')/100,CIP:v('mCIP')/100,Heavy:v('mHeavy')/100,OtherEq:v('mOtherEq')/100,OtherAssets:v('mOtherAssets')/100},
    life:{Servers:v('lServers'),Buildings:v('lBuildings'),Heavy:v('lHeavy'),Other:v('lOther')},
    deploy:touched?v('deploy'):null, adj:v('adj') };
}
var A_OPEXQ=[
  {"p":"Q1 '24","yr":2024,"q":"Q1","costOfSales":72633,"fulfillment":22317,"techInfra":20424,"marketing":9662,"gAdmin":2742,"otherOpex":228,"revenue":143313},
  {"p":"Q2 '24","yr":2024,"q":"Q2","costOfSales":73785,"fulfillment":23566,"techInfra":22304,"marketing":10512,"gAdmin":3041,"otherOpex":97,"revenue":147977},
  {"p":"Q3 '24","yr":2024,"q":"Q3","costOfSales":80977,"fulfillment":24660,"techInfra":22245,"marketing":10609,"gAdmin":2713,"otherOpex":262,"revenue":158877},
  {"p":"Q4 '24","yr":2024,"q":"Q4","costOfSales":98893,"fulfillment":27962,"techInfra":23571,"marketing":13124,"gAdmin":2863,"otherOpex":176,"revenue":187792},
  {"p":"Q1 '25","yr":2025,"q":"Q1","costOfSales":76976,"fulfillment":24593,"techInfra":22994,"marketing":9763,"gAdmin":2628,"otherOpex":308,"revenue":155667},
  {"p":"Q2 '25","yr":2025,"q":"Q2","costOfSales":80809,"fulfillment":25976,"techInfra":27166,"marketing":11416,"gAdmin":2965,"otherOpex":199,"revenue":167702},
  {"p":"Q3 '25","yr":2025,"q":"Q3","costOfSales":88670,"fulfillment":27679,"techInfra":28962,"marketing":11686,"gAdmin":2875,"otherOpex":2875,"revenue":180169},
  {"p":"Q4 '25","yr":2025,"q":"Q4","costOfSales":109959,"fulfillment":30826,"techInfra":29399,"marketing":14264,"gAdmin":2704,"otherOpex":1257,"revenue":213386},
  {"p":"Q1 '26","yr":2026,"q":"Q1","costOfSales":87463,"fulfillment":27289,"techInfra":29567,"marketing":10314,"gAdmin":2587,"otherOpex":447,"revenue":181519},
  {"p":"Q2 '26","yr":2026,"q":"Q2","costOfSales":95778,"fulfillment":29633,"techInfra":33158,"marketing":11698,"gAdmin":2788,"otherOpex":90,"revenue":200606},
];
// AMZN consensus estimate evolution -- BBG_CONSENSUS.txt snapshots (12 as-of dates). $B. k: E=estimate, A=reported actual.
var A_CONS={"asof":["2023-10","2024-02","2024-05","2024-08","2024-11","2025-02","2025-05","2025-08","2025-11","2026-02","2026-05","2026-08"],"capex":{"2024":{"v":[46.4,55.4,59.3,67.6,73.8,83,83,83,83,null,null,null],"k":["E","E","E","E","E","A","A","A","A",null,null,null]},"2025":{"v":[47.3,59,62.9,74,81.7,101.1,103.9,114.4,122.9,131.8,131.8,131.8],"k":["E","E","E","E","E","E","E","E","E","A","A","A"]},"2026":{"v":[56,57.6,60.9,75.5,88.3,106.9,108.7,123.6,143.7,177,199,219.5],"k":["E","E","E","E","E","E","E","E","E","E","E","E"]},"2027":{"v":[58.3,60.8,63.8,79.6,85.7,105.9,109.7,129.5,163.6,202,221.7,278.2],"k":["E","E","E","E","E","E","E","E","E","E","E","E"]},"2028":{"v":[null,63,64.4,86,91.7,103.5,115.1,128.3,158.6,202.5,240.7,315.2],"k":[null,"E","E","E","E","E","E","E","E","E","E","E"]}},"dna":{"2024":{"v":[53.2,53.3,51.4,50.1,50.2,52.8,52.8,52.8,52.8,null,null,null],"k":["E","E","E","E","E","A","A","A","A",null,null,null]},"2025":{"v":[58,57.1,57.4,56.9,57.7,60.8,60.6,61.9,63.9,65.8,65.8,65.8],"k":["E","E","E","E","E","E","E","E","E","A","A","A"]},"2026":{"v":[58.8,60.8,62.6,62.5,64,68.9,68.5,72.7,78.2,84.7,86.6,86.1],"k":["E","E","E","E","E","E","E","E","E","E","E","E"]},"2027":{"v":[61,62.6,67.2,67.7,72.4,78.8,75.7,84.5,95.6,105.3,108.7,111.6],"k":["E","E","E","E","E","E","E","E","E","E","E","E"]},"2028":{"v":[null,65.5,68.9,71.6,76.4,85.6,83.8,94.4,108.8,122.6,131,143.1],"k":[null,"E","E","E","E","E","E","E","E","E","E","E"]}}};
// AMZN quarterly capex & D&A -- snapshot of 'DCF AMZN.xlsm' (D&A tab quarterly blocks), Q1'19-Q4'28. $mm.
var A_QTR_FIRST_PROJ=2026;
var A_QTR=[
  {"p":"Q1 '19","yr":2019,"q":"Q1","capex":3290,"da":4854,"amort":null,"dep":null,"proj":false},
  {"p":"Q2 '19","yr":2019,"q":"Q2","capex":3562,"da":5202,"amort":null,"dep":null,"proj":false},
  {"p":"Q3 '19","yr":2019,"q":"Q3","capex":4697,"da":5563,"amort":null,"dep":null,"proj":false},
  {"p":"Q4 '19","yr":2019,"q":"Q4","capex":5312,"da":6170,"amort":null,"dep":null,"proj":false},
  {"p":"Q1 '20","yr":2020,"q":"Q1","capex":6795,"da":5362,"amort":2245,"dep":3117,"proj":false},
  {"p":"Q2 '20","yr":2020,"q":"Q2","capex":7459,"da":5748,"amort":2245,"dep":3503,"proj":false},
  {"p":"Q3 '20","yr":2020,"q":"Q3","capex":11063,"da":6523,"amort":2245,"dep":4278,"proj":false},
  {"p":"Q4 '20","yr":2020,"q":"Q4","capex":14824,"da":7618,"amort":2245,"dep":5373,"proj":false},
  {"p":"Q1 '21","yr":2021,"q":"Q1","capex":12082,"da":7508,"amort":2883,"dep":4625,"proj":false},
  {"p":"Q2 '21","yr":2021,"q":"Q2","capex":14288,"da":8038,"amort":2883,"dep":5155,"proj":false},
  {"p":"Q3 '21","yr":2021,"q":"Q3","capex":15748,"da":8948,"amort":2883,"dep":6065,"proj":false},
  {"p":"Q4 '21","yr":2021,"q":"Q4","capex":18935,"da":9867,"amort":2883,"dep":6984,"proj":false},
  {"p":"Q1 '22","yr":2022,"q":"Q1","capex":14951,"da":8978,"amort":4255,"dep":4723,"proj":false},
  {"p":"Q2 '22","yr":2022,"q":"Q2","capex":15724,"da":9594,"amort":4255,"dep":5339,"proj":false},
  {"p":"Q3 '22","yr":2022,"q":"Q3","capex":16378,"da":10204,"amort":4255,"dep":5949,"proj":false},
  {"p":"Q4 '22","yr":2022,"q":"Q4","capex":16592,"da":12685,"amort":4255,"dep":8430,"proj":false},
  {"p":"Q1 '23","yr":2023,"q":"Q1","capex":14207,"da":11123,"amort":4616,"dep":6507,"proj":false},
  {"p":"Q2 '23","yr":2023,"q":"Q2","capex":11455,"da":11589,"amort":4616,"dep":6973,"proj":false},
  {"p":"Q3 '23","yr":2023,"q":"Q3","capex":12479,"da":12131,"amort":4616,"dep":7515,"proj":false},
  {"p":"Q4 '23","yr":2023,"q":"Q4","capex":14588,"da":13820,"amort":4616,"dep":9204,"proj":false},
  {"p":"Q1 '24","yr":2024,"q":"Q1","capex":14925,"da":11684,"amort":5174,"dep":6510,"proj":false},
  {"p":"Q2 '24","yr":2024,"q":"Q2","capex":17620,"da":12038,"amort":5174,"dep":6864,"proj":false},
  {"p":"Q3 '24","yr":2024,"q":"Q3","capex":22620,"da":13442,"amort":5174,"dep":8268,"proj":false},
  {"p":"Q4 '24","yr":2024,"q":"Q4","capex":27834,"da":15631,"amort":5174,"dep":10457,"proj":false},
  {"p":"Q1 '25","yr":2025,"q":"Q1","capex":25019,"da":14262,"amort":5964,"dep":8298,"proj":false},
  {"p":"Q2 '25","yr":2025,"q":"Q2","capex":32183,"da":15227,"amort":5964,"dep":9263,"proj":false},
  {"p":"Q3 '25","yr":2025,"q":"Q3","capex":35095,"da":16796,"amort":5964,"dep":10832,"proj":false},
  {"p":"Q4 '25","yr":2025,"q":"Q4","capex":39522,"da":19471,"amort":5964,"dep":13507,"proj":false},
  {"p":"Q1 '26","yr":2026,"q":"Q1","capex":44203,"da":18945,"amort":6000,"dep":12945,"proj":true},
  {"p":"Q2 '26","yr":2026,"q":"Q2","capex":54208,"da":19988,"amort":6000,"dep":13988,"proj":true},
  {"p":"Q3 '26","yr":2026,"q":"Q3","capex":59793,"da":22363,"amort":6000,"dep":16363,"proj":true},
  {"p":"Q4 '26","yr":2026,"q":"Q4","capex":63252,"da":24716,"amort":6000,"dep":18716,"proj":true},
  {"p":"Q1 '27","yr":2027,"q":"Q1","capex":55364,"da":24632,"amort":6000,"dep":18632,"proj":true},
  {"p":"Q2 '27","yr":2027,"q":"Q2","capex":63669,"da":25751,"amort":6000,"dep":19751,"proj":true},
  {"p":"Q3 '27","yr":2027,"q":"Q3","capex":74741,"da":29110,"amort":6000,"dep":23110,"proj":true},
  {"p":"Q4 '27","yr":2027,"q":"Q4","capex":83046,"da":32469,"amort":6000,"dep":26469,"proj":true},
  {"p":"Q1 '28","yr":2028,"q":"Q1","capex":69205,"da":31816,"amort":6000,"dep":25816,"proj":true},
  {"p":"Q2 '28","yr":2028,"q":"Q2","capex":79586,"da":33262,"amort":6000,"dep":27262,"proj":true},
  {"p":"Q3 '28","yr":2028,"q":"Q3","capex":93427,"da":37600,"amort":6000,"dep":31600,"proj":true},
  {"p":"Q4 '28","yr":2028,"q":"Q4","capex":103807,"da":41939,"amort":6000,"dep":35939,"proj":true}
];
var A_CX_QSHARE={ cap:[0.1996,0.2448,0.2700,0.2856], da:[0.2203,0.2324,0.2599,0.2874] };
// capex -> physical GW capacity (each GW ~ $34B: $23.3B chips + $10.7B infrastructure). Chip mix. $mm / GW.
var A_GW_ECON={ perGW:33988, chipsPerGW:23300, infraPerGW:10688, chipShare:0.6855,
  chipMix:[{n:'Trainium',share:0.40,c:'#146EB4'},{n:'Inferentia2',share:0.35,c:'#5B9BD5'},{n:'Blackwell H200',share:0.25,c:'#232F3E'}] };
var A_GW={ 2019:{gw:0.5},2020:{gw:1.181},2021:{gw:1.796},2022:{gw:1.873},2023:{gw:1.551},2024:{gw:2.442},2025:{gw:3.878},2026:{gw:6.516},2027:{gw:8.145},2028:{gw:10.181} };
// quarterly seasonality shares by year (capex & D&A as % of their year) -- the deployment cadence.
var A_QSEAS={
  2019:{cap:[0.195,0.211,0.279,0.315],da:null},2020:{cap:[0.169,0.186,0.276,0.369],da:[0.213,0.228,0.259,0.303]},
  2021:{cap:[0.198,0.234,0.258,0.31],da:[0.218,0.233,0.26,0.287]},2022:{cap:[0.235,0.247,0.257,0.261],da:[0.214,0.229,0.243,0.303]},
  2023:{cap:[0.269,0.217,0.237,0.277],da:[0.229,0.238,0.249,0.284]},2024:{cap:[0.18,0.212,0.273,0.335],da:[0.221,0.228,0.255,0.296]},
  2025:{cap:[0.19,0.244,0.266,0.3],da:[0.217,0.232,0.255,0.296]},2026:{cap:[0.2,0.245,0.27,0.286],da:[0.22,0.232,0.26,0.287]},
  2027:{cap:[0.2,0.23,0.27,0.3],da:[0.22,0.23,0.26,0.29]},2028:{cap:[0.2,0.23,0.27,0.3],da:[0.22,0.23,0.26,0.29]}
};
var A_QCOL=['#C6DBEF','#6BAED6','#2E7EBC','#0B3D66']; // Q1..Q4 sequential

function bottomlineCapexBody(){
  var h='<style>'+
    '.acx-wrap{display:grid;grid-template-columns:280px 1fr;gap:20px;align-items:start;margin-top:6px}'+
    '@media(max-width:900px){.acx-wrap{grid-template-columns:1fr}}'+
    '.acx-ctl{position:sticky;top:12px}'+
    '.acx-grp{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--brand-2);margin:15px 0 8px;display:flex;align-items:center;gap:8px}'+
    '.acx-grp:first-child{margin-top:2px}.acx-grp::after{content:"";flex:1;height:1px;background:var(--bdr)}.acx-grp .acx-sum{font-size:10px;font-weight:800}'+
    '.acx-row{margin-bottom:10px}.acx-rh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:3px}'+
    '.acx-rl{font-size:12px;font-weight:600;color:var(--navy)}'+
    '.acx-rv{font-size:11.5px;font-weight:800;color:var(--brand-2);font-variant-numeric:tabular-nums;background:rgba(20,110,180,.08);border-radius:5px;padding:1px 7px;min-width:50px;text-align:right}'+
    '.acx-ctl input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:3px;background:var(--bdr);outline:none;margin:2px 0 0}'+
    '.acx-ctl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--brand-2);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer}'+
    '.acx-ctl input[type=range]::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:var(--brand-2);border:2px solid #fff;cursor:pointer}'+
    '.acx-ctl input.acx-warn::-webkit-slider-thumb{background:var(--brand)}.acx-ctl input.acx-warn::-moz-range-thumb{background:var(--brand)}'+
    '.acx-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--bdr);border:1px solid var(--bdr);border-radius:9px;overflow:hidden;margin-bottom:14px}'+
    '@media(max-width:620px){.acx-kpis{grid-template-columns:repeat(2,1fr)}}'+
    '.acx-kpi{background:var(--card,#fff);padding:10px 13px}.acx-kl{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+
    '.acx-kv{font-size:20px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums;margin-top:2px;letter-spacing:-.02em}.acx-ks{font-size:10px;color:var(--mu);font-variant-numeric:tabular-nums;margin-top:1px}'+
    '.acx-tog{display:inline-flex;gap:2px;background:rgba(0,0,0,.04);border:1px solid var(--bdr);border-radius:7px;padding:2px}'+
    '.acx-tog button{border:none;background:none;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:5px;cursor:pointer}.acx-tog button.active{background:var(--brand-2);color:#fff}'+
    '.acx-reset{border:1px solid var(--bdr);background:#fff;color:var(--navy);font:inherit;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:5px 10px;cursor:pointer}.acx-reset:hover{background:rgba(0,0,0,.03)}'+
    '.acx-read{font-size:11px;color:var(--mu);font-variant-numeric:tabular-nums;margin:8px 0 0;line-height:1.5}.acx-read b{color:var(--navy)}'+
    '.acx-cap{font-size:11px;color:var(--mu);line-height:1.45;margin-top:8px}.acx-cap b{color:var(--navy);font-weight:600}'+
    '.mch-ctl{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:8px 0 4px}'+
    /* single dual-thumb range (Setup pattern) */
    '.acx-slwrap{display:flex;align-items:center;gap:10px;margin:2px 0 4px}'+
    '.acxsl{position:relative;height:26px;flex:1}'+
    '.acxsl-track{position:absolute;left:0;right:0;top:11px;height:4px;background:var(--bdr);border-radius:2px}'+
    '.acxsl-fill{position:absolute;top:0;height:100%;background:var(--brand-2);border-radius:2px}'+
    '.acxsl-tk{position:absolute;left:0;right:0;top:0;height:26px;pointer-events:none}'+
    '.acxsl-tk span{position:absolute;top:13px;width:5px;height:5px;border-radius:50%;transform:translate(-50%,-50%);background:#fff;border:1.5px solid #C7CED6}'+
    '.acxsl-tk span.on{background:var(--brand-2);border-color:var(--brand-2)}.acxsl-tk span.on.est{opacity:.5}'+
    '.acxsl input[type=range]{position:absolute;top:0;left:0;width:100%;height:26px;margin:0;background:none;pointer-events:none;-webkit-appearance:none;appearance:none}'+
    '.acxsl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid var(--brand-2);box-shadow:0 1px 3px rgba(0,0,0,.22);cursor:pointer}'+
    '.acxsl input[type=range]::-moz-range-thumb{pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid var(--brand-2);cursor:pointer}.acxsl input[type=range]::-moz-range-track{background:none}'+
    '.acx-rp{border:1px solid var(--bdr);background:#fff;color:var(--mu);font:700 10.5px Inter,sans-serif;padding:3px 9px;border-radius:999px;cursor:pointer}.acx-rp:hover{color:var(--navy);border-color:var(--brand-2)}.acx-rp.active{background:var(--brand-2);color:#fff;border-color:var(--brand-2)}'+
    '.acx-slend{font-size:10.5px;font-weight:700;color:var(--navy);font-variant-numeric:tabular-nums;min-width:42px;text-align:center}'+
    /* gdd-style economics bars */
    '.acx-eb{display:flex;align-items:center;gap:10px;margin-bottom:7px}.acx-eb-l{width:120px;font-size:11px;font-weight:600;color:var(--navy);text-align:right;flex-shrink:0}'+
    '.acx-eb-tr{flex:1;height:22px;background:rgba(0,0,0,.04);border-radius:5px;overflow:hidden}.acx-eb-f{height:100%;border-radius:5px;display:flex;align-items:center;padding:0 9px;font-size:10.5px;font-weight:700;color:#fff;white-space:nowrap}'+
    '.acx-eb-v{width:80px;text-align:right;font-size:11px;font-weight:700;color:var(--mu);flex-shrink:0;font-variant-numeric:tabular-nums}'+
  '</style>';
  h+='<div class="acx-kpis" id="acxKpis"></div>';
  h+='<div class="acx-wrap">';
  h+='<aside class="acx-ctl"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--navy)">Assumptions</span><button type="button" class="acx-reset" id="acxReset">Reset</button></div><div class="acx-scen" style="display:flex;gap:4px;margin:2px 0 10px;flex-wrap:wrap"><span style="font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);align-self:center;margin-right:2px">Scenario</span><button type="button" class="acx-rp active" data-scen="base">Base</button><button type="button" class="acx-rp" data-scen="ai">AI supercycle</button><button type="button" class="acx-rp" data-scen="decel">Deceleration</button></div>';
  A_CX_CTRLS.forEach(function(c){
    if(c.grp){ h+='<div class="acx-grp">'+esc(c.grp)+(c.sum?'<span class="acx-sum" id="acxSum"></span>':'')+'</div>'; return; }
    var disp=c.dec!=null?(+c.def).toFixed(c.dec):(c.def+(c.u||''));
    h+='<div class="acx-row"><div class="acx-rh"><span class="acx-rl">'+esc(c.lab)+'</span><span class="acx-rv" id="acxv_'+c.id+'">'+disp+'</span></div>'+
       '<input type="range" id="acx_'+c.id+'"'+(c.warn?' class="acx-warn"':'')+' min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.def+'"></div>';
  });
  h+='</aside><div>';
  // 1 · cycle
  h+='<div class="ov-sec"><div class="ov-sec-h" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">'+
     '<span>The capex cycle — capex vs the depreciation it creates</span>'+
     '<span style="display:flex;gap:6px;align-items:center"><span class="acx-tog acx-grantog"><button type="button" data-acxgran="q" class="active">Quarterly</button><button type="button" data-acxgran="y">Annual</button></span>'+
     '<button type="button" class="acx-rp" data-acxrp="all">All</button><button type="button" class="acx-rp" data-acxrp="rep">Reported</button><button type="button" class="acx-rp" data-acxrp="fwd">Forward</button></span></div>'+
     '<div class="acx-slwrap"><span class="acx-slend" id="acxr0lab"></span><div class="acxsl"><div class="acxsl-track"><div class="acxsl-fill" id="acxslFill"></div></div><div class="acxsl-tk" id="acxslTk"></div>'+
       '<input type="range" id="acx_r0" min="0" max="1" value="0" step="1" aria-label="Start"><input type="range" id="acx_r1" min="0" max="1" value="1" step="1" aria-label="End"></div><span class="acx-slend" id="acxr1lab"></span></div>'+
     '<div style="height:330px"><canvas id="acxCycle"></canvas></div>'+
     '<div class="acx-cap">Bars = D&amp;A (depreciation + amortization). Line + shaded area = capex. The shaded gap above the bars is capacity installed <b>ahead of the P&amp;L</b> — cash out now, depreciation later. Lighter = projection.</div>'+
     '<p class="acx-read" id="acxRead"></p></div>';
  // 2 · GW deployments
  h+='<div class="ov-sec"><div class="ov-sec-h" style="display:flex;justify-content:space-between;align-items:center">What the capex buys — capacity in gigawatts'+
     '<span class="acx-tog acx-gwtog"><button type="button" data-acxgw="y" class="active">Annual</button><button type="button" data-acxgw="q">Quarterly</button></span></div>'+
     '<div style="height:250px"><canvas id="acxGW"></canvas></div>'+
     '<div class="acx-cap" style="margin-bottom:8px"><b>~0.5 GW (2019) → ~10 GW (2028E).</b> Each GW of capacity costs ~$34B, and the split is where the money goes:</div>'+
     '<div class="acx-eb"><div class="acx-eb-l">Chips (GPU/accelerators)</div><div class="acx-eb-tr"><div class="acx-eb-f" style="width:68.5%;background:'+BRAND2+'">68.5%</div></div><div class="acx-eb-v">$23.3B / GW</div></div>'+
     '<div class="acx-eb"><div class="acx-eb-l">General infrastructure</div><div class="acx-eb-tr"><div class="acx-eb-f" style="width:31.5%;background:'+SQUID+'">31.5%</div></div><div class="acx-eb-v">$10.7B / GW</div></div>'+
     '<div class="acx-cap">Chip mix per GW: Trainium 40% · Inferentia2 35% · Blackwell/H200 25% (blended ~$11.8k/chip). Source: DCF datacenter build assumptions.</div></div>';
  // 3 · seasonality
  h+='<div class="ov-sec"><div class="ov-sec-h" style="display:flex;justify-content:space-between;align-items:center">Deployment cadence — quarters as % of the year<span class="acx-tog acx-seastog"><button type="button" data-acxseas="cap" class="active">Capex</button><button type="button" data-acxseas="da">D&amp;A</button></span></div>'+
     '<div style="height:240px"><canvas id="acxSeas"></canvas></div>'+
     '<div class="acx-cap">Capex is <b>back-loaded</b> (Q4 ~30–37%); D&amp;A is flatter. That gap is exactly why new capex depreciates so little in its first year — the <b>deployment factor ~0.59</b> the engine uses is this cadence, time-weighted.</div></div>';
  // 4 · mix (full width, 4 colors, area)
  h+=aWaffleBody();
  // 5 · eff rate
  h+='<div class="ov-sec"><div class="ov-sec-h">Effective depreciation rate</div><div style="height:220px"><canvas id="acxEff"></canvas></div>'+
     '<div class="acx-cap">Depreciation ÷ average depreciable gross PP&amp;E (ex CIP &amp; land). The clean output — creeps up as the short-life mix compounds.</div></div>';
  h+='<div class="ov-sec"><div class="ov-sec-h" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">Sensitivity — which driver moves D&amp;A most'+
     '<span class="acx-tog acx-tornyr"><button type="button" data-tyr="2026">FY26</button><button type="button" data-tyr="2027">FY27</button><button type="button" data-tyr="2028" class="active">FY28</button></span></div>'+
     '<div style="height:250px"><canvas id="acxTorn"></canvas></div>'+
     '<div class="acx-cap">Each bar swings one driver across a plausible range while holding the rest at the model default; the dashed line is the base for the selected year. <b>Capex growth and server useful life move D&amp;A far more than allocation or the calibration factors</b> — that is where the forecast risk actually sits. Toggle FY26 → FY28 to watch the fan widen as the build compounds into the base.</div></div>';
  h+='<div class="ov-sec"><div class="ov-sec-h" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">'+
     '<span>Consensus capex &amp; D&amp;A — how the estimates evolved</span>'+
     '<span style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'+
     '<span class="acx-tog acx-consgran"><button type="button" data-consgran="y" class="active">Evolution</button><button type="button" data-consgran="q">Quarterly</button></span>'+
     '<span class="acx-tog acx-constog"><button type="button" data-acxcons="capex" class="active">Capex</button><button type="button" data-acxcons="dna">D&amp;A</button></span>'+
     '<span class="acx-fychips" style="display:inline-flex;gap:4px;flex-wrap:wrap">'+'<button type="button" class="acx-rp" data-fy="2024">FY24</button>'+'<button type="button" class="acx-rp active" data-fy="2025">FY25</button>'+'<button type="button" class="acx-rp active" data-fy="2026">FY26</button>'+'<button type="button" class="acx-rp" data-fy="2027">FY27</button>'+'<button type="button" class="acx-rp" data-fy="2028">FY28</button>'+'</span></span></div>'+
     '<div style="height:290px"><canvas id="acxCons"></canvas></div>'+
     '<div class="acx-cap" id="acxConsCap"><b>Evolution</b>: consensus estimate per fiscal year across 12 Bloomberg snapshots — solid line <b>stops at the report date</b>, <b>dashed marks the actual</b>. <b>Quarterly</b>: the picked FY\'s four quarters (actuals solid, consensus faded). Source: BBG.</div></div>';
  h+='</div></div>';
  return h;
}
function aCxAnnual(root){
  var st=aCxState(root), eng=aCxRun(st);
  var rows=A_CAPEX_YEARS.map(function(y){ var s=A_CAPEX[y], proj=y>=A_CAPEX_FIRST_PROJ, e=proj?eng[y]:null, gross={};
    A_CX_CLS.forEach(function(c){ gross[c.k]=proj?e.gross[c.k]:s[c.gk]; });
    return {y:y,proj:proj,gross:gross,capex:proj?e.capex:s.capex,depPPE:proj?e.depPPE:s.depPPE,da:proj?e.da:s.da,eff:proj?e.eff:s.effDepRate}; });
  return {rows:rows,eng:eng,st:st};
}
function aCxKPIs(root,a){
  var el=root.querySelector('#acxKpis'); if(!el) return;
  var r26=a.rows[A_CAPEX_YEARS.indexOf(2026)], r28=a.rows[A_CAPEX_YEARS.indexOf(2028)];
  var gap26=r26.capex-r26.da, capGrow=r26.capex/A_CAPEX[2025].capex-1;
  var gw28=r28.capex/A_GW_ECON.perGW;
  var k=[ {l:'FY26 capex',v:acxB(r26.capex),s:(capGrow>=0?'+':'')+acxPct(capGrow,0)+' YoY'},
    {l:'FY26 D&A',v:acxB(r26.da),s:'eff '+acxPct(r26.eff)},
    {l:'FY26 capex − D&A',v:acxB(gap26),s:'ahead of P&L'},
    {l:'FY28 capacity',v:gw28.toFixed(1)+' GW',s:'≈ $34B / GW'} ];
  el.innerHTML=k.map(function(x){ return '<div class="acx-kpi"><div class="acx-kl">'+x.l+'</div><div class="acx-kv">'+x.v+'</div><div class="acx-ks">'+x.s+'</div></div>'; }).join('');
}
function aCxReadout(root,a){
  var el=root.querySelector('#acxRead'); if(!el) return; var d28=a.eng[2028].da, m28=A_CAPEX_DCF[2028].da, delta=d28-m28, st=a.st;
  el.innerHTML='Engine FY28 D&A <b>'+acxB(d28)+'</b> vs model <b>'+acxB(m28)+'</b> ('+(delta>=0?'+':'')+acxFmt(delta)+' mm) · implied life <b>'+(1/a.eng[2028].eff).toFixed(1)+' yr</b> · deployment <b>'+(st.deploy!=null?st.deploy.toFixed(3):'model')+'</b>, prior-stock adj <b>'+st.adj.toFixed(3)+'</b>.';
}
function aCxTimeline(root,gran){
  var st=aCxState(root), eng=aCxRun(st), out=[];
  if(gran==='y'){ A_CAPEX_YEARS.forEach(function(y){ var s=A_CAPEX[y], proj=y>=A_CAPEX_FIRST_PROJ, e=proj?eng[y]:null;
    var dep=proj?e.depPPE:(s.depPPE||0), am=proj?e.amort:(s.amort||0), da=proj?e.da:(s.da||dep+am);
    if(!proj&&!s.amort){ am=0; dep=s.depPPE||0; da=s.da||dep; }
    out.push({p:"'"+String(y).slice(2),capex:proj?e.capex:s.capex,dep:dep,amort:am,da:da,proj:proj}); });
  } else { A_QTR.forEach(function(t){ if(t.yr<A_CAPEX_FIRST_PROJ) out.push({p:t.p,capex:t.capex,dep:t.dep!=null?t.dep:t.da,amort:t.amort||0,da:t.da,proj:false}); });
    [2026,2027,2028].forEach(function(y){ var e=eng[y], amq=e.amort/4; for(var i=0;i<4;i++){ var da=e.da*A_CX_QSHARE.da[i]; out.push({p:['Q1','Q2','Q3','Q4'][i]+" '"+String(y).slice(2),capex:e.capex*A_CX_QSHARE.cap[i],dep:da-amq,amort:amq,da:da,proj:true}); } }); }
  return out;
}
function aCxWin(root,n){
  var pane=root.querySelector('.ovt-subpane[data-ovst="capex"]'); var w=pane&&pane._acxWin;
  if(!w||w[1]>=n||w[0]<0||w[0]>w[1]) w=[0,n-1]; return w;
}
function aCxLastAct(gran){ return gran==='y'? A_CAPEX_YEARS.indexOf(2025) : 27; }
function aCxSyncRange(root,gran,tl){
  var n=tl.length, w=aCxWin(root,n), r0=root.querySelector('#acx_r0'), r1=root.querySelector('#acx_r1');
  if(r0){ r0.max=n-1; r0.value=w[0]; } if(r1){ r1.max=n-1; r1.value=w[1]; }
  var fill=root.querySelector('#acxslFill'); if(fill){ fill.style.left=(w[0]/(n-1)*100)+'%'; fill.style.width=((w[1]-w[0])/(n-1)*100)+'%'; }
  var l0=root.querySelector('#acxr0lab'), l1=root.querySelector('#acxr1lab'); if(l0) l0.textContent=tl[w[0]].p; if(l1) l1.textContent=tl[w[1]].p;
  var tk=root.querySelector('#acxslTk'); if(tk){ var la=aCxLastAct(gran), h=''; for(var i=0;i<n;i++){ h+='<span class="'+('on'.repeat(i>=w[0]&&i<=w[1]?1:0)+(i>la?' est':''))+'" style="left:'+(i/(n-1)*100)+'%"></span>'; } tk.innerHTML=h.replace(/class="est/g,'class=" est').replace(/class=""/g,'class=""'); }
}
function aCxCycleChart(root){
  var cv=aChartReady('acxCycle'); if(!cv) return; aDestroy('acxCycle');
  var g=root.querySelector('.acx-grantog .active'), gran=g?g.getAttribute('data-acxgran'):'q';
  var tl=aCxTimeline(root,gran), n=tl.length, w=aCxWin(root,n), view=tl.slice(w[0],w[1]+1);
  aCxSyncRange(root,gran,tl);
  var barA=function(base){ return view.map(function(d){ return d.proj?acxRGBA(base,0.5):base; }); };
  _aCharts['acxCycle']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:view.map(function(d){ return d.p; }), datasets:[
      { type:'line', label:'Capex', data:view.map(function(d){ return d.capex/1000; }), borderColor:SQUID, backgroundColor:acxRGBA(SQUID,0.10), borderWidth:2, pointRadius:0, tension:0.2, fill:'origin', order:2 },
      { label:'Depreciation', data:view.map(function(d){ return d.dep/1000; }), backgroundColor:barA(BRAND2), stack:'da', maxBarThickness:30, order:1 },
      { label:'Amortization', data:view.map(function(d){ return d.amort/1000; }), backgroundColor:barA(GRAY), stack:'da', maxBarThickness:30, order:1 } ] },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ label:function(x){ return x.dataset.label+': $'+x.parsed.y.toFixed(1)+'B'; }, footer:function(it){ var d=view[it[0].dataIndex]; return 'Capex − D&A gap: $'+((d.capex-d.da)/1000).toFixed(1)+'B'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ font:{ size:9 }, maxRotation:0, autoSkip:true } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('acxCycle');
}
function aCxGWChart(root){
  var cv=aChartReady('acxGW'); if(!cv) return; aDestroy('acxGW');
  var g=root.querySelector('.acx-gwtog .active'), q=g&&g.getAttribute('data-acxgw')==='q';
  var eng=aCxRun(aCxState(root)); var labels=[], chips=[], infra=[], projF=[];
  function push(lab,capex,proj){ var gw=capex/A_GW_ECON.perGW; labels.push(lab); chips.push(gw*A_GW_ECON.chipShare); infra.push(gw*(1-A_GW_ECON.chipShare)); projF.push(proj); }
  if(q){ A_QTR.forEach(function(t){ if(t.yr<A_CAPEX_FIRST_PROJ) push(t.p,t.capex,false); }); [2026,2027,2028].forEach(function(y){ for(var i=0;i<4;i++) push(['Q1','Q2','Q3','Q4'][i]+" '"+String(y).slice(2), eng[y].capex*A_CX_QSHARE.cap[i], true); }); }
  else { A_CAPEX_YEARS.forEach(function(y){ var proj=y>=A_CAPEX_FIRST_PROJ; push("'"+String(y).slice(2), proj?eng[y].capex:A_CAPEX[y].capex, proj); }); }
  var cA=function(base){ return projF.map(function(p){ return p?acxRGBA(base,0.5):base; }); };
  _aCharts['acxGW']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:'Chips (GPU)', data:chips, backgroundColor:cA(BRAND2), stack:'gw', maxBarThickness:30 },
      { label:'Infrastructure', data:infra, backgroundColor:cA(SQUID), stack:'gw', maxBarThickness:30 } ] },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ label:function(x){ return x.dataset.label+': '+x.parsed.y.toFixed(2)+' GW'; }, footer:function(it){ return 'Total: '+it.reduce(function(a,x){ return a+x.parsed.y; },0).toFixed(2)+' GW'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ font:{ size:9 }, autoSkip:true } }, y:{ stacked:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+' GW'; } } } } } }); aZoom('acxGW');
}
function aCxSeasChart(root){
  var tg=root.querySelector('.acx-seastog .active'), key=tg?tg.getAttribute('data-acxseas'):'cap';
  var cv=aChartReady('acxSeas'); if(!cv) return; aDestroy('acxSeas');
  var yrs=A_CAPEX_YEARS.filter(function(y){ return A_QSEAS[y] && A_QSEAS[y][key]; });
  var ds=[0,1,2,3].map(function(qi){ return { label:'Q'+(qi+1), data:yrs.map(function(y){ return Math.round(A_QSEAS[y][key][qi]*1000)/10; }), backgroundColor:A_QCOL[qi], stack:'s', maxBarThickness:26, borderColor:'#fff', borderWidth:0.5 }; });
  _aCharts['acxSeas']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:yrs.map(function(y){ return "'"+String(y).slice(2); }), datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:8, font:{ size:9 } } }, tooltip:{ callbacks:{ label:function(x){ return x.dataset.label+': '+x.parsed.y+'%'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ stacked:true, max:100, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:9 }, callback:function(v){ return v+'%'; } } } } } }); aZoom('acxSeas');
}
var A_CX_MIX4=[ {k:'Servers',lab:'Servers & networking',c:BRAND2,ks:['Servers']}, {k:'LB',lab:'Land & buildings',c:BRAND,ks:['LB']},
  {k:'CIP',lab:'Construction in progress',c:'#7A5AF8',ks:['CIP']}, {k:'Other',lab:'Other equipment & assets',c:GRAY,ks:['Heavy','OtherEq','OtherAssets']} ];
function aCxEffChart(root){
  var cv=aChartReady('acxEff'); if(!cv) return; aDestroy('acxEff');
  var rows=aCxAnnual(root).rows;
  _aCharts['acxEff']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:rows.map(function(r){ return "'"+String(r.y).slice(2); }), datasets:[ { label:'Effective dep rate', data:rows.map(function(r){ return Math.round(r.eff*1000)/10; }),
      borderColor:BRAND2, backgroundColor:acxRGBA(BRAND2,0.08), borderWidth:2.5, pointRadius:2.5, tension:0.25, fill:'origin',
      segment:{ borderDash:function(ctx){ return rows[ctx.p1DataIndex]&&rows[ctx.p1DataIndex].proj?[5,4]:undefined; } } } ] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(x){ return 'Eff. rate: '+x.parsed.y+'%'; } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:9 }, callback:function(v){ return v+'%'; } } } } } }); aZoom('acxEff');
}
function aCxConsChart(root){
  var cv=aChartReady('acxCons'); if(!cv) return; aDestroy('acxCons');
  var tg=root.querySelector('.acx-constog .active'), metric=tg?tg.getAttribute('data-acxcons'):'capex';
  var gg=root.querySelector('.acx-consgran .active'), gran=gg?gg.getAttribute('data-consgran'):'y', capEl=root.querySelector('#acxConsCap');
  if(gran==='q'){   // quarterly levels for the picked FY (4 quarters max), BBG quarterly capex/D&A
    var act=[]; root.querySelectorAll('.acx-fychips .acx-rp.active').forEach(function(b){ act.push(+b.getAttribute('data-fy')); });
    var fy=(act.indexOf(2026)>=0)?2026:(act.length?act[0]:2026);
    var qmap={'2Q25':2025,'3Q25':2025,'4Q25':2025,'1Q26':2026,'2Q26':2026,'3Q26E':2026,'4Q26E':2026,'1Q27E':2027,'2Q27E':2027};
    var ser=(metric==='capex')?amznBBG.is.capex.q:amznBBG.is.depr.q;
    var idxs=amznBBG.qtrs.map(function(q,i){ return {q:q,i:i,y:qmap[q]}; }).filter(function(o){ return o.y===fy; });
    var vals=idxs.map(function(o){ return ser[o.i]==null?null:Math.round(Math.abs(ser[o.i])/100)/10; });
    var fwd=idxs.map(function(o){ return o.i>4; }), col=(metric==='capex')?BRAND2:SQUID;
    _aCharts['acxCons']=new Chart(cv.getContext('2d'),{ type:'bar',
      data:{ labels:idxs.map(function(o){ return o.q; }), datasets:[{ label:(metric==='capex'?'Capex':'D&A'), data:vals, backgroundColor:vals.map(function(_,i){ return fwd[i]?acxRGBA(col,0.45):col; }), borderColor:'#fff', borderWidth:1, maxBarThickness:64 }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ return '$'+c.parsed.y.toFixed(1)+'B'+(fwd[c.dataIndex]?' (consensus)':' (actual)'); } } } },
        scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('acxCons');
    if(capEl) capEl.innerHTML='<b>FY'+String(fy).slice(2)+' quarterly '+(metric==='capex'?'capex':'D&A')+'</b> — actuals solid, consensus faded. '+(idxs.length<4?'<span style="color:#B7791F">Only '+idxs.length+' quarters sit in the BBG window (2Q25→2Q27E); FY26 is the only complete four — pick FY26.</span>':'The four quarters, and where they actually landed.')+' Source: BBG.';
    return;
  }
  var data=A_CONS[metric], labels=A_CONS.asof;
  var sel={}; root.querySelectorAll('.acx-fychips .acx-rp.active').forEach(function(b){ sel[b.getAttribute('data-fy')]=1; });
  var COL={'2024':GRAY,'2025':GREEN,'2026':BRAND,'2027':BRAND2,'2028':SQUID}, ds=[], acts=[];
  ['2024','2025','2026','2027','2028'].forEach(function(fy){ if(!sel[fy]||!data[fy]) return; var d=data[fy], c=COL[fy], ri=d.k.indexOf('A');
    ds.push({ label:'FY'+fy, data:d.v.map(function(v,i){ return (ri<0||i<=ri)?v:null; }), borderColor:c, backgroundColor:c, borderWidth:2, tension:0.2, spanGaps:false,
      pointRadius:d.k.map(function(k,i){ return (i===ri)?5:2; }), pointStyle:d.k.map(function(k,i){ return (i===ri)?'rectRot':'circle'; }), pointBackgroundColor:c });
    if(ri>=0) acts.push({ y:d.v[ri], x0:Math.max(0,ri-1), col:c, fy:fy });
  });
  var plugin={ id:'acxActuals', afterDatasetsDraw:function(ch){ var yS=ch.scales.y, xS=ch.scales.x, area=ch.chartArea; if(!yS||!xS||!area) return;
    acts.forEach(function(a){ var y=yS.getPixelForValue(a.y); if(y<area.top||y>area.bottom) return; var x1=Math.max(area.left,xS.getPixelForValue(a.x0)), ctx=ch.ctx;
      ctx.save(); ctx.setLineDash([3,4]); ctx.lineWidth=1.5; ctx.strokeStyle=a.col; ctx.globalAlpha=.8; ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(area.right,y); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha=1; ctx.font='700 9px Inter,sans-serif'; ctx.fillStyle=a.col; ctx.textAlign='right'; ctx.textBaseline='bottom'; ctx.fillText('FY'+a.fy+' actual $'+Math.round(a.y)+'B', area.right-3, y-2); ctx.restore(); }); } };
  _aCharts['acxCons']=new Chart(cv.getContext('2d'),{ type:'line', plugins:[plugin],
    data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'nearest', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+' est: $'+c.parsed.y+'B'; } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:9 } } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('acxCons');
}
function aCxTornado(root){
  var cv=aChartReady('acxTorn'); if(!cv) return; aDestroy('acxTorn');
  var yb=root?root.querySelector('.acx-tornyr .active'):null, yr=yb?+yb.getAttribute('data-tyr'):2028;
  var d0={ g:[68,25,25], mix:{Servers:0.475,LB:0.23,CIP:0.15,Heavy:0.08,OtherEq:0.06,OtherAssets:0.005}, life:{Servers:5.7,Buildings:40,Heavy:11.5,Other:6.5}, deploy:null, adj:0.955 };
  function da(st){ return aCxRun(st)[yr].da/1000; }
  function clone(){ return { g:d0.g.slice(), mix:Object.assign({},d0.mix), life:Object.assign({},d0.life), deploy:d0.deploy, adj:d0.adj }; }
  function mk(lab,loFn,hiFn){ var lo=clone(); loFn(lo); var hi=clone(); hiFn(hi); var a=da(lo), b=da(hi); return { lab:lab, min:Math.min(a,b), max:Math.max(a,b), range:Math.abs(a-b) }; }
  var base=da(d0);
  var rows=[
    mk('Capex growth  (±15pp / yr)', function(s){ s.g=[53,10,10]; }, function(s){ s.g=[83,40,40]; }),
    mk('Server useful life  (5.7 ±1 yr)', function(s){ s.life.Servers=6.7; }, function(s){ s.life.Servers=4.7; }),
    mk('Server allocation  (±5pp vs L&B)', function(s){ s.mix.Servers=0.425; s.mix.LB=0.28; }, function(s){ s.mix.Servers=0.525; s.mix.LB=0.18; }),
    mk('Deployment factor  (±0.05)', function(s){ s.deploy=0.53; }, function(s){ s.deploy=0.63; }),
    mk('Prior-stock adj.  (±0.02)', function(s){ s.adj=0.935; }, function(s){ s.adj=0.975; }),
    mk('Buildings life  (40 ±5 yr)', function(s){ s.life.Buildings=45; }, function(s){ s.life.Buildings=35; })
  ];
  rows.sort(function(a,b){ return a.range-b.range; });
  var basePlug={ id:'tornBase', afterDatasetsDraw:function(ch){ var xS=ch.scales.x, area=ch.chartArea; if(!xS||!area) return; var x=xS.getPixelForValue(base), ctx=ch.ctx;
    ctx.save(); ctx.setLineDash([4,4]); ctx.strokeStyle='#2E3B4E'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(x,area.top); ctx.lineTo(x,area.bottom); ctx.stroke();
    ctx.setLineDash([]); ctx.font='700 9.5px Inter,sans-serif'; ctx.fillStyle='#2E3B4E'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText('base $'+base.toFixed(0)+'B', x, area.top-1); ctx.restore(); } };
  _aCharts['acxTorn']=new Chart(cv.getContext('2d'),{ type:'bar', plugins:[basePlug],
    data:{ labels:rows.map(function(r){ return r.lab; }), datasets:[{ data:rows.map(function(r){ return [r.min,r.max]; }),
      backgroundColor:rows.map(function(r){ return acxRGBA(BRAND2, 0.55+0.45*Math.min(1,r.range/rows[rows.length-1].range)); }), borderColor:BRAND2, borderWidth:1, maxBarThickness:26 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:14 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ var r=rows[c.dataIndex]; return '$'+r.min.toFixed(0)+'B → $'+r.max.toFixed(0)+'B  (swing $'+r.range.toFixed(0)+'B)'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } }, title:{ display:true, text:'FY'+yr+' D&A ($B)', font:{ size:9 }, color:'#6B7683' } }, y:{ grid:{ display:false }, ticks:{ font:{ size:9.5 } } } } } }); aZoom('acxTorn');
}
function aCxSyncLabels(root){
  A_CX_CTRLS.forEach(function(c){ if(c.grp) return; var el=root.querySelector('#acx_'+c.id), out=root.querySelector('#acxv_'+c.id); if(!el||!out) return; out.textContent=c.dec!=null?(+el.value).toFixed(c.dec):(el.value+(c.u||'')); });
  var sum=['mServers','mLB','mCIP','mHeavy','mOtherEq','mOtherAssets'].reduce(function(s,id){ var el=root.querySelector('#acx_'+id); return s+(el?+el.value:0); },0);
  var s=root.querySelector('#acxSum'); if(s){ s.textContent='Σ '+sum.toFixed(1)+'%'; s.style.color=Math.abs(sum-100)>0.6?'#D64545':'var(--mu)'; }
}
function aCxRender(root){
  aCxSyncLabels(root); var a=aCxAnnual(root);
  aCxKPIs(root,a); aCxReadout(root,a);
  aCxCycleChart(root); aCxGWChart(root);
  aCxSeasChart(root);
  aBuildWaffle();
  aCxEffChart(root);
  aCxConsChart(root);
  aCxTornado(root);
}
function aCxRangeReset(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="capex"]'); if(!pane) return;
  var g=root.querySelector('.acx-grantog .active'), gran=g?g.getAttribute('data-acxgran'):'q';
  var n=aCxTimeline(root,gran).length; pane._acxWin=[gran==='y'?0:12, n-1];
}
function aBuildCapex(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="capex"]'); if(!pane) return;
  if(!pane._acxWired){
    pane._acxWired=true; aCxRangeReset(root);
    var MIX=['mServers','mLB','mCIP','mHeavy','mOtherEq','mOtherAssets'];
    pane.querySelectorAll('.acx-ctl input[type=range]').forEach(function(inp){ inp.addEventListener('input', function(){
      if(inp.id==='acx_deploy') pane._acxDeployTouched=true;
      if(inp.id.indexOf('acx_m')===0){ var sum=MIX.reduce(function(s,id){ var e=root.querySelector('#acx_'+id); return s+(e?+e.value:0); },0); if(sum>100) inp.value=Math.max(+inp.min,(+inp.value)-(sum-100)); }
      aCxRender(root); }); });
    // dual-thumb range
    ['acx_r0','acx_r1'].forEach(function(id){ var el=pane.querySelector('#'+id); if(el) el.oninput=function(){ var a=+pane.querySelector('#acx_r0').value, b=+pane.querySelector('#acx_r1').value; pane._acxWin=[Math.min(a,b),Math.max(a,b)]; pane.querySelectorAll('.acx-rp').forEach(function(x){ x.classList.remove('active'); }); aCxCycleChart(root); }; });
    pane.querySelectorAll('.acx-rp').forEach(function(b){ b.onclick=function(){
      var g=root.querySelector('.acx-grantog .active'), gran=g?g.getAttribute('data-acxgran'):'q', n=aCxTimeline(root,gran).length, la=aCxLastAct(gran), v=b.getAttribute('data-acxrp');
      pane._acxWin = v==='rep'?[0,la] : v==='fwd'?[Math.max(0,la),n-1] : [0,n-1];
      pane.querySelectorAll('.acx-rp').forEach(function(x){ x.classList.toggle('active',x===b); });
      aCxCycleChart(root); }; });
    pane.querySelectorAll('.acx-grantog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-grantog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxRangeReset(root); pane.querySelectorAll('.acx-rp').forEach(function(x){ x.classList.remove('active'); }); aCxCycleChart(root); }; });
    pane.querySelectorAll('.acx-gwtog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-gwtog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxGWChart(root); }; });
    pane.querySelectorAll('.acx-seastog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-seastog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxSeasChart(root); }; });
    pane.querySelectorAll('.acx-constog button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-constog button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxConsChart(root); }; });
    pane.querySelectorAll('.acx-consgran button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-consgran button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxConsChart(root); }; });
    pane.querySelectorAll('.acx-fychips .acx-rp').forEach(function(b){ b.onclick=function(){ b.classList.toggle('active'); aCxConsChart(root); }; });
    pane.querySelectorAll('.acx-tornyr button').forEach(function(b){ b.onclick=function(){ pane.querySelectorAll('.acx-tornyr button').forEach(function(x){ x.classList.toggle('active',x===b); }); aCxTornado(root); }; });
    var rst=pane.querySelector('#acxReset'); if(rst) rst.onclick=function(){ A_CX_CTRLS.forEach(function(c){ if(c.grp) return; var el=root.querySelector('#acx_'+c.id); if(el) el.value=c.def; }); pane._acxDeployTouched=false; aCxRangeReset(root); aCxRender(root); };
    pane.querySelectorAll('.acx-scen button').forEach(function(b){ b.onclick=function(){ var sc=A_CX_SCEN[b.getAttribute('data-scen')]; if(!sc) return;
      pane.querySelectorAll('.acx-scen button').forEach(function(x){ x.classList.toggle('active',x===b); });
      A_CX_CTRLS.forEach(function(c){ if(c.grp) return; var el=root.querySelector('#acx_'+c.id); if(el) el.value=c.def; });
      Object.keys(sc).forEach(function(k){ if(k==='deploy') return; var el=root.querySelector('#acx_'+k); if(el&&sc[k]!=null) el.value=sc[k]; });
      if(sc.deploy!=null){ var de=root.querySelector('#acx_deploy'); if(de) de.value=sc.deploy; pane._acxDeployTouched=true; } else pane._acxDeployTouched=false;
      aCxRender(root); }; });
  }
  aCxRender(root);
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
      scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } } } } }); aZoom('aFin');
}
var A_MGMT=[
  { n:'Andy Jassy', r:'President & CEO', since:'CEO since Jul 2021 · joined 1997', d:'Built AWS from a memo into the profit engine (its first leader, 2003–2021). As CEO: the efficiency era (regionalization, flattening), the AI build-out, and the "every experience reinvented with AI" doctrine.' },
  { n:'Brian Olsavsky', r:'SVP & CFO', since:'CFO since 2015 · joined 2002', d:'The voice of the guide: two decades of Amazon finance, from Worldwide Operations to the CFO seat. Owns the capex framing ("as fast as we install this capacity, we are monetizing it").' },
  { n:'Matt Garman', r:'CEO, AWS', since:'since Jun 2024 · joined 2006', d:'One of AWS\'s first product managers, then its top salesman, now its CEO — presiding over the re-acceleration (+24% → +28%), the Trainium ramp and the Anthropic partnership.' },
  { n:'Doug Herrington', r:'CEO, Worldwide Amazon Stores', since:'since 2022 · joined 2005', d:'Runs the retail surface: the everyday-essentials push, same-day network, grocery ($150B+ gross sales) and the robotics rollout.' },
  { n:'Jeff Bezos', r:'Founder & Executive Chair', since:'chair since Jul 2021', d:'Founder; largest individual holder (~9%). Single share class — one share, one vote: influence flows from the stake and the chair, not super-voting stock (the governance mirror-image of META/GOOGL).' },
];
// ═══ Management — Executives & Board · Ownership · Governance & SBC · Track Record ═══════════════
// Verified board facts per Amazon 2025/2026 proxy (DEF 14A): 12 directors, majority independent;
// Bezos Executive Chair; Jassy on the board; independent Lead Director (since 2010); four standing
// committees — Audit (Nooyi, chair), Leadership Dev & Comp, Nominating & Corp Gov, Security
// (Huttenlocher, chair). The full 12-member roster + live ownership sync in Pillars ▸ Management.
// Executives & Board — built with the shared makeManagement mold (same as UBER/GOOGL). Board facts
// verified from Amazon's 2025/2026 proxy (DEF 14A): 12 directors, majority independent; Bezos
// Executive Chair; Nooyi chairs Audit, Huttenlocher chairs Security; independent Lead Director (2010).
var AMZN_MGMT = makeManagement({
  brand: BRAND,
  lede: "The full <b>27-member S-team</b> (Amazon's senior leadership) plus founder <b>Jeff Bezos</b>, Executive Chair. Leadership is <b>home-grown</b> to a degree unusual at this scale — the CEO, CFO, AWS and retail chiefs average ~20 years inside. Tap any leader for the detail; the group clusters into AWS, Stores &amp; Operations, Media/Devices/Ads/Health, and corporate functions.",
  execs: [
    { id:'jassy', lead:true, name:'Andy Jassy', title:'President & CEO', since:'CEO since Jul 2021 · joined 1997',
      line:'Built AWS into the profit engine; now runs the efficiency era + AI build-out.',
      bio:"President & CEO since July 2021. Built AWS from a 2003 memo into Amazon's profit engine as its first leader (2003–2021). As CEO: the efficiency era (US network regionalization, org flattening, ~41k corporate roles out), the largest capex cycle in company history, and the \"every experience reinvented with AI\" doctrine." },
    { id:'olsavsky', name:'Brian Olsavsky', title:'SVP & CFO', since:'CFO since 2015 · joined 2002',
      line:'The voice of the guide; owns the capex framing.',
      bio:"SVP & CFO since 2015; two decades of Amazon finance from Worldwide Operations to the CFO seat. The consistent voice of the guide across the pandemic build, the 2022 trough and the AI capex cycle — owns the framing \"as fast as we install this capacity, we are monetizing it.\"" },
    { id:'garman', name:'Matt Garman', title:'CEO, AWS', since:'since Jun 2024 · joined 2006',
      line:"One of AWS's first PMs, then its top salesman, now its CEO.",
      bio:"CEO of AWS since June 2024. One of AWS's first product managers, then its top salesman — deep-inside credibility. Presiding over the re-acceleration (growth +24% → +28%), the Trainium ramp and the Anthropic partnership — the price-performance edge behind the margin." },
    { id:'herrington', name:'Doug Herrington', title:'CEO, Worldwide Amazon Stores', since:'since 2022 · joined 2005',
      line:'Ran the retail turnaround; everyday-essentials, same-day, robotics.',
      bio:"CEO, Worldwide Amazon Stores since 2022. Ran the retail turnaround — North America from a 2022 operating loss to a mid-single-digit margin, on cost and mix rather than price. Drove the everyday-essentials push, the same-day network, grocery ($150B+ gross sales) and the robotics rollout." },
    // ── AWS leadership ──
    { id:'desantis', name:'Peter DeSantis', title:'SVP, Foundational AI Models, Custom Silicon & Quantum', line:'Owns Trainium/Inferentia custom silicon, foundational models and quantum — the compute edge under AWS.' },
    { id:'kalyanaraman', name:'Prasad Kalyanaraman', title:'VP, AWS Infrastructure Services', line:"Runs AWS's global data-center infrastructure — the physical build the capex funds (added to the S-team Apr 2026)." },
    { id:'aubrey', name:'Colleen Aubrey', title:'SVP, AWS Applied AI Solutions', line:'AWS applied-AI products and go-to-market.' },
    { id:'treadwell', name:'Dave Treadwell', title:'SVP, AWS Compute & ML Services', line:'AWS core compute and machine-learning services (EC2 and up).' },
    { id:'felton', name:'John Felton', title:'SVP, AWS CFO', line:'Finance chief for AWS — the segment carrying most of the capex and the profit.' },
    { id:'hamilton', name:'James Hamilton', title:'SVP & Distinguished Engineer', line:"The architect behind much of AWS's hardware and data-center design." },
    { id:'swami', name:'Swami Sivasubramanian', title:'VP, Agentic AI', line:"Leads Amazon's agentic-AI effort." },
    // ── Stores & operations ──
    { id:'beauchamp', name:'Christine Beauchamp', title:'SVP, North America Stores', line:'Runs the North America retail business.' },
    { id:'grandinetti', name:'Russell Grandinetti', title:'SVP, International Stores', line:'Runs the International retail business — the turnaround segment.' },
    { id:'madan', name:'Udit Madan', title:'SVP, Worldwide Operations', line:'Runs the fulfillment + logistics network — where fulfillment cost and the robotics rollout live.' },
    { id:'agarwal', name:'Amit Agarwal', title:'SVP, Emerging Markets & Selling Partner Services', line:'Emerging markets and the third-party seller (3P) services engine.' },
    // ── Media · devices · ads · health · Zoox ──
    { id:'hopkins', name:'Mike Hopkins', title:'SVP, Amazon Video & Studios', line:'Runs Prime Video and Amazon MGM Studios.' },
    { id:'panay', name:'Panos Panay', title:'SVP, Devices & Services', line:'Runs Devices & Services (Echo/Alexa, Kindle, Ring); joined from Microsoft (Surface).' },
    { id:'kotas', name:'Paul Kotas', title:'SVP, Advertising, IMDb & Grand Challenge', line:'Runs the advertising business — the near-pure-margin engine lifting retail margins.' },
    { id:'boom', name:'Steve Boom', title:'VP, Audio, Twitch & Games', line:'Audio, Twitch and games.' },
    { id:'lindsay', name:'Neil Lindsay', title:'SVP, Amazon Health Services', line:'Health — One Medical and Amazon Pharmacy.' },
    { id:'evans', name:'Aicha Evans', title:'CEO, Zoox', line:"Runs Zoox, Amazon's robotaxi unit." },
    // ── Corporate functions ──
    { id:'zapolsky', name:'David Zapolsky', title:'Chief Global Affairs & Legal Officer', line:'General counsel + global public policy — the legal/regulatory chief.' },
    { id:'galetti', name:'Beth Galetti', title:'SVP, People eXperience & Technology', line:'Head of HR — owns the workforce and the 2022-26 headcount actions.' },
    { id:'krawiec', name:'Peter Krawiec', title:'SVP, Worldwide Corporate & Business Development', line:'Runs corporate development and M&A.' },
    { id:'herdener', name:'Drew Herdener', title:'SVP, Communications & Corporate Responsibility', line:'Communications and corporate responsibility.' },
    { id:'schmidt', name:'Steve Schmidt', title:'Chief Security Officer', line:'Company-wide security.' },
    { id:'castleberry', name:'Candi Castleberry', title:'VP, Amazon eXperience & Upskilling', line:'Employee experience and upskilling.' },
    // ── Founder ──
    { id:'bezos', name:'Jeff Bezos', title:'Founder & Executive Chair', since:'Chair since Jul 2021 · founded 1994',
      line:'Founder; largest individual holder (~9%); single share class.',
      bio:"Founder and Executive Chair. Largest individual holder (~9%). Single share class — one share, one vote: his influence flows from the stake and the chair, not super-voting stock (the governance mirror-image of META and GOOGL)." }
  ],
  board: [
    { name:'Jeff Bezos', chair:true, dual:true, independent:false, role:'Founder & Executive Chair.' },
    { name:'Andy Jassy', dual:true, independent:false, role:'President & CEO.' },
    { name:'Indra K. Nooyi', independent:true, role:'Chairs Audit · former Chairman & CEO of PepsiCo · director since 2019.' },
    { name:'Daniel P. Huttenlocher', independent:true, role:'Chairs Security · Dean, MIT Schwarzman College of Computing · director since 2016.' },
    { name:'Keith B. Alexander', independent:true, role:'Retired U.S. Army general, former Director of the NSA.' },
    { name:'Wendell P. Weeks', independent:true, role:'Chairman & CEO of Corning.' }
  ],
  boardNote:'12 directors, the majority independent · Bezos Executive Chair · independent Lead Director since 2010 · committees: Audit, Leadership Dev & Comp, Nominating & Corp Gov, Security. Verified subset shown — full roster in Pillars ▸ Management.',
  gov: [
    { k:'Share & voting', v:'1 vote / share', d:'Single class — no founder super-voting stock.' },
    { k:'Board', v:'12 dirs · majority independent', d:'Bezos Executive Chair · independent Lead Director.' },
    { k:'Founder stake', v:'Jeff Bezos ~9%', d:'Largest individual holder; sells via 10b5-1 plans.' }
  ],
  foot:"Full S-team roster + titles per Amazon's official leadership page (aboutamazon.com, 2026); board and committees per the 2025/2026 proxy (DEF 14A). Ownership and insider trades live in Pillars ▸ Management."
});
function amznOwnBody(){   // Ownership
  var h='<p class="ov-lede"><b>One share, one vote.</b> Amazon has a <b>single share class</b> — no founder super-voting stock. It is the governance mirror-image of META and GOOGL: influence flows from the stake and the chair, not from a special class.</p>';
  h+='<div class="ew-kpis">'+[['~9%','Jeff Bezos — largest individual holder'],['1 class','one share, one vote'],['~$19.5B','stock-based comp (FY25)'],['~nil','buybacks · no dividend']].map(function(k){ return '<div class="ew-tile"><div class="ew-tv">'+k[0]+'</div><div class="ew-tl">'+k[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h">Who owns Amazon</div>';
  h+=ewBoxes([
    ['👤','Founder','Jeff Bezos holds ~9% — the largest single holder — as Executive Chair. He sells regularly under pre-set <b>10b5-1</b> plans (funding Blue Origin and philanthropy), so the stake trends down over time even as it stays the largest.'],
    ['🏦','Institutions','The float is overwhelmingly institutional; the largest holders are the index-fund complexes — <b>Vanguard, BlackRock and State Street</b> — whose stakes track the passive flows, not an active view on Amazon.']
  ]);
  h+='<div class="ov-sec-h" style="margin-top:16px">Capital returned to shareholders</div>';
  h+='<div class="ov-fynote">Amazon pays <b>no dividend</b> and repurchases stock only opportunistically — it authorized a $10B buyback in 2022 and bought ~$6B that year, then effectively paused. Capital goes to the capex build (see <b>Miscellaneous ▸ Capex &amp; Depreciation</b>), not to shareholders — so SBC dilution is <b>not</b> offset by buybacks.</div>';
  h+='<div class="ov-sec-h" style="margin-top:18px">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management), like UBER
  h+='<div class="ov-foot">Executive holdings and insider transactions sync live from Fiscal.ai (also in Pillars ▸ Management); the narrative figures above are approximate.</div>';
  return h;
}
function amznGovBody(){   // Governance & SBC
  var h='<p class="ov-lede"><b>Clean, conventional governance.</b> Single-class stock, an independent-majority board, four standing committees and an annual say-on-pay vote — governance risk is low by construction. The trade-off: no outside holder can force a strategy change.</p>';
  h+='<div class="ew-kpis">'+[['1 vote / sh','single share class'],['12 dirs','majority independent'],['~$19.5B','SBC · ~2.7% of revenue (FY25)'],['~nil','buybacks · no dividend']].map(function(k){ return '<div class="ew-tile"><div class="ew-tv">'+k[0]+'</div><div class="ew-tl">'+k[1]+'</div></div>'; }).join('')+'</div>';
  h+=ewBoxes([
    ['🗳️','Single share class','One share, one vote — no founder super-voting stock. The opposite of META/GOOGL dual-class.'],
    ['⚖️','Independent-majority board','12 directors, the majority independent; an independent Lead Director since 2010.'],
    ['🏛️','Four standing committees','Audit (Nooyi), Leadership Dev &amp; Comp, Nominating &amp; Corp Gov, Security (Huttenlocher).'],
    ['📉','SBC, not buybacks','No dividend and minimal repurchases — SBC is the main driver of share-count growth.']
  ]);
  h+='<div class="ov-fynote">SBC totals <b>~$19.5B (FY25, ~2.7% of revenue)</b>, down from $24.0B in 2023, and dilutes ~1%/yr with buybacks near zero. The full <b>by-line, actuals-vs-consensus SBC chart lives in Bottom Line ▸ General</b> (where the expenses are).</div>';
  h+='<div class="ov-foot">Governance per Amazon 2025/2026 proxy; SBC per the 10-K / BBG.</div>';
  return h;
}
// Track Record — per-leader scorecard (management only), color-rated with a tap-for-detail modal.
// Molded on UBER's ubTrackBody. Ratings are an editorial read, not a Summit output.
var AMZN_TRK_RATE={ green:{c:'#06965A',bg:'rgba(6,150,90,0.09)',bd:'rgba(6,150,90,0.34)',l:'Value creator'},
  amber:{c:'#B7791F',bg:'rgba(183,121,31,0.10)',bd:'rgba(183,121,31,0.34)',l:'Mixed / unproven'} };
var AMZN_TRACK=[
  { id:'jassy', n:'Andy Jassy', role:'President & CEO', since:'2021', rate:'green',
    amzn:'Built AWS into the profit engine (its first leader, 2003-21); as CEO drove the efficiency era — regionalization, org flattening, ~41k roles out — that lifted group operating margin from low-single-digits to a record ~11%, and set the AI build-out.',
    prior:'26 years inside Amazon; no outside executive record — his track record <i>is</i> the AWS-and-then-Amazon record.',
    detail:'<p><b>At Amazon (CEO since Jul 2021; joined 1997).</b> Founded and ran AWS from a 2003 memo to the majority of group operating income. As CEO: the efficiency reset (US network regionalization 2023, a flatter org, ~27k + ~14k corporate roles out), the largest capex cycle in company history, and the AI doctrine.</p>'+
      '<p><b>Net read — value creator (green).</b> Delivered the margin turnaround and the AWS reacceleration. Caveats, not disqualifying: the ~$220B/yr AI capex is a huge bet still unproven on returns, and the 2025-26 layoffs are efficiency but also culture risk.</p>' },
  { id:'garman', n:'Matt Garman', role:'CEO, AWS', since:'2024', rate:'green',
    amzn:'One of AWS\'s first product managers, then its top salesman, now its CEO — presiding over the re-acceleration (growth +24% → +28%), the Trainium ramp and the Anthropic partnership.',
    prior:'Career built inside AWS (joined 2006) — deep-inside credibility, but no outside benchmark.',
    detail:'<p><b>At Amazon (CEO of AWS since Jun 2024; joined 2006).</b> Rose from one of AWS\'s first PMs to head of sales & marketing to the top seat. Owns the current reacceleration, the custom-silicon (Trainium) price-performance push, and the Anthropic partnership; backlog (RPO) has stepped up sharply.</p>'+
      '<p><b>Net read — value creator, lightly caveated (green).</b> Strong reacceleration on his watch; the caveat is simply a short standalone tenure as CEO.</p>' },
  { id:'herrington', n:'Doug Herrington', role:'CEO, Worldwide Amazon Stores', since:'2022', rate:'green',
    amzn:'Ran the retail turnaround — North America from a 2022 operating loss to a mid-single-digit margin, on cost and mix rather than price; drove same-day, grocery ($150B+ gross sales) and the robotics rollout.',
    prior:'At Amazon since 2005 (ex-Consumer chief); the retail turnaround is his defining record.',
    detail:'<p><b>At Amazon (CEO Worldwide Stores since 2022; joined 2005).</b> Took the retail segment from the 2022 over-investment loss back to profit via regionalization, cost-to-serve discipline and the advertising mix — not price. Drove the everyday-essentials push, the same-day network and the 1M+-robot rollout.</p>'+
      '<p><b>Net read — value creator (green).</b> A clean, measurable turnaround. The forward question is whether retail margin keeps climbing as the LEO/robotics capex lands.</p>' },
  { id:'olsavsky', n:'Brian Olsavsky', role:'SVP & CFO', since:'2015', rate:'green',
    amzn:'Two decades of Amazon finance — the consistent voice of the guide across the pandemic build, the 2022 trough and the AI capex cycle; owns the capex framing that anchors the bull case.',
    prior:'At Amazon since 2002 (Worldwide Operations finance); a company lifer in the finance seat.',
    detail:'<p><b>At Amazon (CFO since 2015; joined 2002).</b> Guided the company through the pandemic over-build, the 2022 margin trough and reset, and now the AI capex cycle — with the framing "as fast as we install this capacity, we are monetizing it."</p>'+
      '<p><b>Net read — solid (green).</b> Continuity and credibility; the open question he owns is defending the capex thesis if AWS demand ever lags the build.</p>' },
  { id:'desantis', n:'Peter DeSantis', role:'SVP, Foundational AI Models, Custom Silicon & Quantum', since:'2005', rate:'green',
    amzn:'The technical architect behind AWS\'s cost/performance edge — Nitro, the Graviton/Trainium/Inferentia custom-silicon program, data-center and power scale; now foundational models + quantum.',
    prior:'Career built inside AWS — one of the longest-tenured infrastructure leaders.',
    detail:'<p><b>At Amazon (since 2005).</b> Ran AWS compute and infrastructure for years; drove the Nitro system and the custom-silicon roadmap (Graviton for general compute, Trainium/Inferentia for AI) that underpins AWS\'s price-performance advantage, plus the power/data-center scale-up.</p>'+
      '<p><b>Net read — value creator (green).</b> The silicon and infrastructure edge he owns is central to the AWS margin story; deep, proven, low-drama.</p>' },
  { id:'grandinetti', n:'Russell Grandinetti', role:'SVP, International Stores', since:'2000', rate:'green',
    amzn:'A 25-year Amazon veteran (early Kindle and digital); now runs International Stores — the segment that crossed into operating profit in 2024 on the same regionalization + advertising playbook as North America.',
    prior:'Essentially a career-Amazon operator; helped build the Kindle/digital business.',
    detail:'<p><b>At Amazon (since 2000).</b> Held senior roles across digital, Kindle and consumer; now leads International Stores, which reached its first full-year operating profit in 2024 and keeps expanding in the established markets while the emerging ones invest.</p>'+
      '<p><b>Net read — value creator (green).</b> Long, credible operating record; the open item is the pace of emerging-market profitability.</p>' },
  { id:'zapolsky', n:'David Zapolsky', role:'Chief Global Affairs & Legal Officer', since:'1999', rate:'green',
    amzn:'General Counsel since 2014 and now the combined legal + global public-policy chief — steering the FTC antitrust suit, EU/DMA regulation and the M&A legal work through the most scrutiny in Amazon\'s history.',
    prior:'At Amazon since 1999; earlier a litigator (antitrust) and prosecutor.',
    detail:'<p><b>At Amazon (GC since 2014; joined 1999).</b> Leads Legal, Compliance and Global Public Policy through the FTC monopolization case, EU Digital Markets Act obligations, the $2.5B FTC/Prime settlement and the deal reviews (MGM, iRobot [terminated]).</p>'+
      '<p><b>Net read — value creator (green).</b> Seasoned through Amazon\'s hardest regulatory period; the docket he manages is the standing risk, not his handling of it.</p>' },
  { id:'galetti', n:'Beth Galetti', role:'SVP, People eXperience & Technology', since:'2013', rate:'green',
    amzn:'Head of HR — owns the workforce through the largest headcount actions in company history (~27k in 2022-23, ~14k more in 2025-26) and the "fewer managers, more builders" flattening.',
    prior:'Ex-FedEx (engineering/IT leadership) before joining Amazon in 2013.',
    detail:'<p><b>At Amazon (HR chief since ~2016; joined 2013).</b> Executed the corporate-cost reset — the two large rounds of role eliminations and the manager-to-builder ratio push that drive the G&amp;A leverage — while scaling a 1.5M+ employee base.</p>'+
      '<p><b>Net read — green, caveated.</b> Delivered the org efficiency the margin story needed; the caveat is culture/morale risk from repeated layoffs, which is hers to manage.</p>' },
  { id:'panay', n:'Panos Panay', role:'SVP, Devices & Services', since:'2023', rate:'amber',
    amzn:'The ex-Microsoft Surface creator, recruited in 2023 to run Devices & Services (Echo/Alexa, Kindle, Ring) and fix the historically loss-making devices unit — Alexa+ (the generative-AI assistant) launched on his watch.',
    prior:'~19 years at <b>Microsoft</b> — created and led the Surface hardware line and Windows + Devices.',
    detail:'<p><b>At Amazon (since Oct 2023).</b> Took over Devices & Services after Dave Limp left for Blue Origin; relaunched Alexa as the paid, generative <b>Alexa+</b> and owns the Echo/Kindle/Ring hardware roadmap.</p>'+
      '<p><b>Net read — mixed / unproven (amber).</b> Strong hardware pedigree from Surface, but Devices has long lost money and the Alexa+ monetization is early — the turnaround is not yet demonstrated in the numbers.</p>' }
];
function amznTrackBody(){
  var legend=Object.keys(AMZN_TRK_RATE).map(function(k){ var r=AMZN_TRK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=AMZN_TRACK.map(function(m){ var r=AMZN_TRK_RATE[m.rate];
    return '<div class="ov-clickable" data-detail="exec:'+m.id+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:11px;padding:13px 15px;cursor:pointer">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(m.n)+'</div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+r.c+'">'+r.l+'</div></div>'+
      '<div style="font-size:11px;color:var(--mu);font-weight:600;margin:1px 0 8px">'+esc(m.role)+' · at Amazon since '+esc(m.since)+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:6px"><b style="color:'+r.c+'">At Amazon:</b> '+m.amzn+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5"><b style="color:var(--mu)">Context:</b> '+m.prior+'</div>'+
      '<div class="ov-more" style="margin-top:7px;font-size:10.5px;font-weight:800;color:'+BRAND2+'">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running Amazon today, rated on <b>what they have actually built</b>. Color = the net read; <b>tap a card</b> for the full history. (Management only — board and ownership are separate tabs.)</p>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+cards+'</div>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>The bench, in one line:</b> a home-grown C-suite (avg ~20 yrs inside) that delivered the margin turnaround and the AWS reacceleration — its open bet is whether the ~$220B/yr AI capex earns its return.</div>';
  h+='<div class="ov-foot">Roster and roles per Amazon IR (mid-2026); records from earnings calls and segment disclosures. Ratings are an editorial read, not a Summit output.</div>';
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
// ─── Bottom Line ▸ Supply Chain — Bloomberg SPLC (AMZN US Equity), as of 12-Aug-2026 ────────
// SUPPLIERS side only. The customer/demand side (traceable AWS-IT channel + the Direct-to-Consumer
// aggregate) belongs in Top Line and is not built here. 1,452 suppliers / 24,052 supplier facilities
// tracked. Modeled on googl.js splcBody (cards + tables + dependency bars). Geography is the one
// section rendered as a Chart.js chart.
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
var A_SPLC_INFRA=[
  { n:'NVIDIA', rel:'$38.2B', cost:'24.2% of tracked cost', dep:'14.0% of NVDA rev', bar:100, col:GREEN,
    d:'<p>By far the largest single relationship on the map ($38.2B est.) — the GPU fleet (Hopper/Blackwell, next Rubin) powering AWS training and inference, both for AWS\'s own services and rented to customers. Amazon is ~14% of NVIDIA\'s revenue: an enormous buyer, but neither side is captive.</p><p><b>The map\'s biggest blind spot:</b> Amazon\'s own custom silicon — <b>Trainium / Inferentia</b>, designed in-house at Annapurna Labs — is the strategic hedge against exactly this dependency, and it barely shows in SPLC because it is internal.</p>' },
  { n:'Hon Hai (Foxconn)', rel:'$14.0B', cost:'7.9% of tracked cost', dep:'5.2% of Hon Hai rev', bar:37, col:GRAY,
    d:'<p>Server and rack assembly at hyperscale for the AWS data-center build-out. Taiwan-headquartered with a global manufacturing footprint — part of why supplier facilities concentrate in Asia even where domiciles do not.</p>' },
  { n:'Jabil', rel:'$5.6B', cost:'3.2% of tracked cost', dep:'16.0% of Jabil rev', bar:15, col:BRAND2,
    d:'<p>Contract manufacturing for data-center and device hardware. ~16% of Jabil\'s revenue traces to Amazon — a deep dependency, and its results are a public read-through on AWS build cadence.</p>' },
  { n:'TSMC', rel:'$5.5B', cost:'1.3% of tracked cost', dep:'4.1% of TSMC rev', bar:14, col:AMBER,
    d:'<p>Foundry exposure — part direct, part intermediated through the silicon vendors (NVIDIA, Marvell, Broadcom, and Amazon\'s own Annapurna designs). As with GOOGL, Amazon\'s deepest chip dependency is second-order: it runs through whoever fabs the accelerators.</p>' },
  { n:'SK hynix', rel:'$4.9B', cost:'3.0% of tracked cost', dep:'6.9% of hynix rev', bar:13, col:PURPLE,
    d:'<p>HBM and DRAM — the scarcest input of the AI build-out. One of several memory suppliers (with Micron and Western Digital, both CAPEX) feeding the AWS accelerator fleet.</p>' },
  { n:'AI-connectivity cluster', rel:'Astera · Credo · Accton · Arista', cost:'~1.5% of cost combined', dep:'Astera 70% · Credo 42% · Accton 35% of their rev', bar:9, col:RED,
    d:'<p>The networking/interconnect layer of the AWS build-out: <b>Astera Labs (70.0% of its revenue from Amazon)</b>, Credo Technology (42.3%), Accton (35.4%), plus Arista and Marvell (15.5%). Individually small for Amazon; existentially large for several of them — the same quasi-captive read-through GOOGL\'s optics cluster gives, here for AWS.</p>' },
];
// Retail / CPG / logistics chain. [name, rel, amznCost, theirDep, category]
var A_SPLC_RETAIL=[
  ['United Parcel Service','$9.4B','2.6%','10.6% of UPS rev','Logistics — parcel'],
  ['Lenovo','$8.0B','1.8%','9.0% of Lenovo rev','Devices / hardware'],
  ['Procter & Gamble','$6.6B','1.9%','7.9% of P&G rev','1P retail — household'],
  ['PepsiCo','$4.8B','1.3%','5.1% of PEP rev','1P retail — food & bev'],
  ['Apple','$3.8B','1.1%','0.9% of AAPL rev','Devices (1P resale)'],
  ['Pattern Group','$2.3B','0.7%','92.7% of its rev','Marketplace accelerator'],
  ['Rivian','$0.9B','0.3%','16.7% of RIVN rev','Delivery EVs (AMZN-backed)'],
  ['FedEx','$0.9B','0.2%','1.0% of FDX rev','Logistics — parcel'],
];
// Who depends ON Amazon — supplier revenue % from AMZN. [name, pct, note]
var A_SPLC_DEP=[
  ['Pattern Group', 93, 'marketplace accelerator'],
  ['Astera Labs', 70, 'AI connectivity — AWS'],
  ['Credo Technology', 42, 'AI connectivity'],
  ['Accton Technology', 35, 'networking ODM'],
  ['iRobot', 35, 'devices sold on Amazon'],
  ['AZ-COM MARUWA', 34, 'logistics — Japan'],
  ['Spin Master', 22, 'toys (1P/3P)'],
  ['Helen of Troy', 20, 'consumer products'],
];
// Geography — supplier facilities by country (% of total supplier facilities). Rendered as a chart.
var A_SPLC_GEO={ labels:['United States','China','India','Japan','Germany','United Kingdom','France','South Korea'],
  sup:[37.91,7.73,6.08,5.62,3.44,3.76,2.39,1.20] };
function aSplcBody(c){
  var h='';
  h+='<p class="ov-lede"><b>Who Amazon buys from.</b> The supplier side of the Bloomberg SPLC map — two distinct chains: the AWS AI-infrastructure capex chain (silicon, servers, memory, interconnect) and the retail / CPG / logistics chain (first-party merchandise, devices, parcel). The customer / demand side lives in Top Line.</p>';
  h+=ddStat([['1,452','suppliers tracked'],['24,052','supplier facilities'],['37.9%','supplier facs in US'],['7.7%','supplier facs in China'],['$38.2B','largest single relationship (NVIDIA)']]);
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>Chain 1 · the AWS AI-infrastructure capex chain</b> (relationship size, Bloomberg est.; bar = relative size — tap a card for the read)</div>';
  h+='<div class="ce-watch">'+A_SPLC_INFRA.map(function(s,i){
    return '<div class="ce-w ov-clickable" data-detail="splc:'+i+'" style="border-left:4px solid '+s.col+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip tag">'+esc(s.rel)+'</span><span class="ce-w-chip" style="margin-left:auto;color:'+BRAND+'">the read ›</span></div>'+
      '<div class="ov-mbar" style="margin:4px 0 6px"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(s.bar,2)+'%;background:'+s.col+'"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip cons">'+esc(s.cost)+'</span><span class="ce-w-chip red"><b>Their dependency:</b> '+esc(s.dep)+'</span></div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:18px 0 6px"><b>Chain 2 · the retail, CPG &amp; logistics chain</b> — first-party merchandise, devices and parcel</div>';
  h+='<div style="overflow-x:auto"><table class="ce-tbl"><thead><tr><th>Supplier</th><th>Relationship</th><th>AMZN cost %</th><th>Their exposure to Amazon</th><th>Category</th></tr></thead><tbody>'+
    A_SPLC_RETAIL.map(function(r){ return '<tr><td style="font-weight:700">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td><td style="color:var(--mu)">'+esc(r[4])+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ov-diagram-cap" style="margin:18px 0 6px"><b>Who needs whom — revenue dependency ON Amazon</b> (% of the counterpart\'s revenue)</div>';
  h+='<div class="ov-mbars">'+A_SPLC_DEP.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+' <span style="color:var(--mu);font-weight:600">'+esc(r[2])+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+BRAND+'">'+r[1]+'%</div></div><div class="ov-mbar-v">'+r[1]+'%</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-sec" style="margin-top:16px"><div class="ov-sec-h">Geography — supplier facilities by country (% of total)</div>'+
    '<div style="height:340px"><canvas id="aSplcGeo"></canvas></div>'+
    '<div class="ov-fynote">Suppliers domiciled: US 40.7% · China 10.95% · India 8.3% · Japan 6.8% · Taiwan 3.4%. China is the tariff / geopolitics surface on both chains.</div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), AMZN US Equity, as of 12-Aug-2026. Relationship sizes are Bloomberg estimates; directional, not audited. Full universe 1,452 suppliers / 24,052 supplier facilities.</div>';
  return h;
}
function aBuildSplc(){
  var c3=aChartReady('aSplcGeo');
  if(c3){ aDestroy('aSplcGeo');
    _aCharts['aSplcGeo']=new Chart(c3.getContext('2d'),{ type:'bar',
      data:{ labels:A_SPLC_GEO.labels, datasets:[
        { label:'Supplier facilities', data:A_SPLC_GEO.sup, backgroundColor:BRAND2, maxBarThickness:15 } ] },
      options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+ctx.parsed.x+'%'; } } } },
        scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } }); aZoom('aSplcGeo'); }
}
// ─── Miscellaneous ▸ M&A and Other Analysis — future placeholders (nothing deep-dived for AMZN yet).
function aMandaBody(){
  return '<p class="ov-lede"><b>No M&amp;A deep-dived yet.</b> Placeholder for acquisitions Summit has studied in depth — none for Amazon to date.</p>';
}
function aOtherAnalysisBody(){
  return '<p class="ov-lede"><b>Future placeholder.</b> Ad-hoc analysis will land here — nothing deep-dived for Amazon yet.</p>';
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
      '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments">'+toplineSegBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="margins">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segments">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="supplychain">Supply Chain</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="margins">'+aGeneralPicker()+
        '<div class="gen-sec" data-gsec="margins">'+aMarginsBody()+'</div>'+
        '<div class="gen-sec" data-gsec="bridge" hidden>'+aBridgeBody()+'</div>'+
        '<div class="gen-sec" data-gsec="net" hidden>'+aNetBridgeBody()+'</div>'+
        '<div class="gen-sec" data-gsec="sbc" hidden>'+aSbcBody()+'</div>'+
        aCollap('Expense lines — the six functional deep dives (unit economics, drivers, calls)', expenseTabsBody(), false)+'</div>'+
      '<div class="ovt-subpane" data-ovst="segments" hidden>'+segmentsBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="supplychain" hidden>'+aSplcBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ce-evohead" style="position:relative;display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 12px">'+
        '<div class="ovt-subtabs" style="margin:0">'+
          '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
          '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        /* IR + EDGAR moved to the Company Profile header (Dani, Aug 2026) — see ceHeaderSources(). */
        '<div class="ce-phtabs">'+
          '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
          '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
          '<button type="button" class="ce-phtab" data-cep="watch">Notes</button>'+
        '</div>'+
        ceQPills()+
        '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('AMZN')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('AMZN')+'</div>'+
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
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives &amp; Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance &amp; SBC</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+AMZN_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden>'+amznOwnBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+amznGovBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+amznTrackBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="misc" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="capex">Capex &amp; Depreciation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="manda">M&amp;A</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="other">Other Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="capex">'+bottomlineCapexBody()+segCapDaBody()+aLeasesBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="manda" hidden>'+aMandaBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="other" hidden>'+aOtherAnalysisBody()+'</div>'+
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
    if(kind==='seg'){ return SEG_WORLD[id]||null; }
    if(kind==='splc'){ var sp=A_SPLC_INFRA[+id]; return sp?{t:esc(sp.n)+' <span style="font-weight:600;color:var(--mu)">'+esc(sp.rel)+' · '+esc(sp.cost)+'</span>',h:sp.d}:null; }
    if(kind==='exec'){ var ex=AMZN_TRACK.filter(function(x){ return x.id===id; })[0]; return ex?{t:esc(ex.n)+' <span style="font-weight:600;color:var(--mu)">'+esc(ex.role)+'</span>',h:ex.detail}:null; }
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
  if(dd==='bottomline'){
    if(key==='supplychain') requestAnimationFrame(aBuildSplc);
    else if(key==='segments') requestAnimationFrame(aBuildSegments);
    else requestAnimationFrame(function(){ aBuildMargins(); aBuildExpenses(); });
  }
  if(dd==='misc'){
    if(key==='capex' || key==null) requestAnimationFrame(function(){ aBuildCapex(root); aBuildSegCapDa(); aBuildLeases(); });
  }
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
// Give the Evolution sub-tab bar (Earnings · Results · Estimates) and the phase bar (Setup · Post-Results
// · Notes) the SAME width — they have identical styling, only the labels differ. Measure both, size both
// to the wider one, and let the buttons flex to fill (Dani, Aug 2026). Needs both bars visible to measure.
function ceEqualizeTabBars(root){
  var ev=root.querySelector('.ov-amzn-dd .dd-pane[data-dd="evolution"]'); if(!ev) return;
  var a=ev.querySelector('.ce-evohead .ovt-subtabs');
  var b=ev.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtabs');
  if(!a||!b) return;
  var wa=a.offsetWidth, wb=b.offsetWidth; if(wa<=0||wb<=0) return;   // one is hidden — can't measure, skip
  var w=Math.max(wa,wb);
  [a,b].forEach(function(el){ el.style.boxSizing='border-box'; el.style.width=w+'px';
    el.querySelectorAll(':scope > button').forEach(function(btn){ btn.style.flex='1'; }); });
}
function wireDD(root){
  root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    root.querySelectorAll('.ov-amzn-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-amzn-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    var pane=root.querySelector('.ov-amzn-dd .dd-pane[data-dd="'+key+'"]');
    var act=pane?pane.querySelector('.ovt-subtab.active'):null;
    aBuildSub(root, key, act?act.getAttribute('data-ovst'):null);
    if(key==='evolution') requestAnimationFrame(function(){ ceEqualizeTabBars(root); });
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
  // Load the saved theme record from Supabase (if any) and, from here on, persist every edit.
  amznHydrateThemes(root);
  // Equalize the two Evolution tab bars once laid out (no-ops if Evolution isn't the visible pane yet).
  requestAnimationFrame(function(){ ceEqualizeTabBars(root); });
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
  scope.querySelectorAll('[data-recadd]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var box=b.closest('.rec-edit'); var q=box.querySelector('[data-recnq]').value, tx=(box.querySelector('[data-recntext]').value||'').trim(); if(!q){ ceInlinePop(b, { title:'Pick a quarter for the note first.', confirm:true, ok:'OK' }, function(){}); return; } if(!tx) return; ct.updates=ct.updates||[]; var u=ct.updates.filter(function(x){ return x.q===q; })[0]; if(!u){ u={ q:q, items:[] }; ct.updates.push(u); ct.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); } u.items.push(tx); rerec(); }; });
  scope.querySelectorAll('[data-recdelnote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u) return; u.items.splice(ix,1); if(!u.items.length) ct.updates=ct.updates.filter(function(x){ return x!==u; }); rerec(); }; });
  scope.querySelectorAll('[data-recednote]').forEach(function(b){ b.onclick=function(){ var ct=ctOfEl(b); if(!ct) return; var q=b.getAttribute('data-q'), ix=+b.getAttribute('data-i'); var u=(ct.updates||[]).filter(function(x){ return x.q===q; })[0]; if(!u||u.items[ix]==null) return; ceInlinePop(b, { title:'Edit note · '+q+'  (HTML ok)', value:u.items[ix], multiline:true }, function(nv){ u.items[ix]=nv; rerec(); }); }; });
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
function amznRerenderRecord(root){ var host=root&&root.querySelector('[data-amznrec]'); if(!host) return; var st=amznCaptureRecState(host); host.innerHTML=callsBody(); amznRestoreRecState(host, st); wireThemeRecord(host); amznPersistThemes(); }
// ── Durable persistence of the theme record (AMZN Notes) to Supabase (table company_theme_record) ──
// The record is Pablo's in-memory AMZN_THEMES; here it becomes durable. HYDRATE on mount (replace the
// hardcoded seed with the saved record if one exists), then SAVE the whole record after every mutation.
// amznRerenderRecord runs after every edit/publish, so a single save hook there covers them all. The
// _amznReady gate prevents the initial (pre-hydration) render from overwriting the DB. Requires a
// signed-in session (RLS) and sql/011_company_theme_record.sql — until then it degrades silently.
var _amznReady=false, _amznSaveT=null;
function amznPersistThemes(){
  if(!_amznReady || !_co || !_co.id) return;
  if(_amznSaveT) clearTimeout(_amznSaveT);
  _amznSaveT=setTimeout(function(){ Promise.resolve(saveThemeRecord(_co.id, _co.ticker, AMZN_THEMES)).catch(function(){}); }, 400);
}
function amznHydrateThemes(root){
  if(_amznReady) return;
  if(!_co || !_co.id){ _amznReady=true; return; }
  Promise.resolve(fetchThemeRecord(_co.id)).then(function(res){
    if(res && res.success && res.data && res.data.length){
      AMZN_THEMES.length=0; Array.prototype.push.apply(AMZN_THEMES, res.data);
      _amznReady=true; amznRerenderRecord(root); amznRenderEditor(root);
    } else { _amznReady=true; }   // no saved record yet — keep the seed; the first edit will persist it
  }).catch(function(){ _amznReady=true; });
}

// ═══ Theme → Sub-theme editor (AMZN-only, in the hidden ✎ panel) ═══════════════════════════════
// "Theme" = the segment (AMZN_SEG_ORDER); "Sub-theme" = a theme within it (AMZN_THEMES[].theme).
// Picking a Theme filters the Sub-theme list to that segment. Adding either mutates the in-memory
// model and re-renders the record above at once. (Session-only for now — see the note to the user.)
var _edSeg=null, _edSub=null;
var _recEditOpen={};   // per sub-theme inline editor open state, keyed by "seg|theme"
function amznSubsOf(seg){ return AMZN_THEMES.filter(function(ct){ return ct.seg===seg; }); }
function amznFindTheme(key){ var p=String(key||'').split('|'); return AMZN_THEMES.filter(function(x){ return x.seg===p[0] && x.theme===p.slice(1).join('|'); })[0]; }
// Propose Notes → Notes: file a staged note into the theme record. Finds (or creates) the
// segment ▸ sub-theme, then appends the text as an item under the reported quarter's updates —
// the same shape the ✎ editor writes, so it renders identically in the record above.
// Duplicate guard for theme-record notes. Two notes collide when they normalise to the SAME plain
// text (HTML/entities stripped, whitespace collapsed, case-folded) under the same sub-theme + quarter
// — the real spam / double-click case: the ＋ add-note composer pre-seeds the point's prose, so
// re-opening it and saving twice, or publishing the same Propose-Notes batch twice, would otherwise
// file the identical note again. Used by every note-write path so the rule holds everywhere. (§6a-ii.)
function ceNoteNorm(t){ return ceStripHtml(t).toLowerCase(); }
function ceNoteDup(items, text){ var n=ceNoteNorm(text); return (items||[]).some(function(it){ return ceNoteNorm(it)===n; }); }
// Returns {added:true} on success, {added:false, dup:true} when the identical note is already filed.
function cePublishNoteToRecord(seg, sub, text, q){
  if(!seg || !sub || !text) return {added:false};
  var ct=amznFindTheme(seg+'|'+sub);
  if(!ct){ ct={ seg:seg, theme:sub, why:'', updates:[], st:{ k:'watch' } }; AMZN_THEMES.push(ct); }
  ct.updates=ct.updates||[];
  var u=ct.updates.filter(function(x){ return x.q===q; })[0];
  if(!u){ u={ q:q, items:[] }; ct.updates.push(u); ct.updates.sort(function(a,z){ return (ceQnum(a.q)||0)-(ceQnum(z.q)||0); }); }
  if(ceNoteDup(u.items, text)) return {added:false, dup:true};   // already filed here — never duplicate
  u.items.push(text);
  return {added:true};
}
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
  if(addSeg) addSeg.onclick=function(){ ceInlinePop(addSeg, { title:'New Theme (segment) name' }, function(n){ if(AMZN_SEG_ORDER.indexOf(n)<0) AMZN_SEG_ORDER.push(n); _edSeg=n; _edSub=null; amznRenderEditor(root); amznRerenderRecord(root); }); };
  var addSub=host.querySelector('[data-aedaddsub]');
  if(addSub) addSub.onclick=function(){ if(!_edSeg){ ceInlinePop(addSub, { title:'Pick a Theme first.', confirm:true, ok:'OK' }, function(){}); return; } ceInlinePop(addSub, { title:'New Sub-theme under “'+_edSeg+'”' }, function(n){ if(!amznSubsOf(_edSeg).some(function(s){ return s.theme===n; })) AMZN_THEMES.push({ seg:_edSeg, theme:n, why:'', updates:[], st:{ k:'watch' } }); _edSub=n; amznRenderEditor(root); amznRerenderRecord(root); }); };
  var delSeg=host.querySelector('[data-aeddelseg]');
  if(delSeg) delSeg.onclick=function(){ if(!_edSeg) return; var nsub=amznSubsOf(_edSeg).length;
    ceInlinePop(delSeg, { title:'Delete Theme “'+_edSeg+'”'+(nsub?(' and its '+nsub+' sub-theme'+(nsub>1?'s':'')+' (and their notes)'):'')+'?', confirm:true, ok:'Delete', danger:true }, function(){
      for(var k=AMZN_THEMES.length-1;k>=0;k--){ if(AMZN_THEMES[k].seg===_edSeg) AMZN_THEMES.splice(k,1); }
      var si=AMZN_SEG_ORDER.indexOf(_edSeg); if(si>=0) AMZN_SEG_ORDER.splice(si,1);
      _edSeg=null; _edSub=null; amznRenderEditor(root); amznRerenderRecord(root);
    });
  };
  // ── the selected sub-theme's editable detail (tracking window · notes by quarter) ──
  var cur=amznSubsOf(_edSeg).filter(function(s){ return s.theme===_edSub; })[0];
  if(cur){
    var delsub=host.querySelector('[data-aeddelsub]');
    if(delsub) delsub.onclick=function(){ ceInlinePop(delsub, { title:'Delete sub-theme “'+cur.theme+'” and its notes?', confirm:true, ok:'Delete', danger:true }, function(){ var i=AMZN_THEMES.indexOf(cur); if(i>=0) AMZN_THEMES.splice(i,1); _edSub=null; amznRenderEditor(root); amznRerenderRecord(root); }); };
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
      ceInlinePop(b, { title:'Edit note · '+q+'  (HTML ok, e.g. <b>…</b>)', value:u.items[ix], multiline:true }, function(nv){
        u.items[ix]=nv; amznRenderEditor(root); amznRerenderRecord(root);
      });
    }; });
    var addNote=host.querySelector('[data-aedaddnote]');
    if(addNote) addNote.onclick=function(){
      var q=host.querySelector('[data-aednoteq]').value, tx=(host.querySelector('[data-aednotetext]').value||'').trim();
      if(!q){ ceInlinePop(addNote, { title:'Pick a quarter for the note first.', confirm:true, ok:'OK' }, function(){}); return; }
      if(!tx) return;
      cur.updates=cur.updates||[];
      var u=cur.updates.filter(function(x){ return x.q===q; })[0];
      if(u && ceNoteDup(u.items, tx)){   // identical note already filed under this quarter — block + tell the user
        ceInlinePop(addNote, { title:'This note is already filed under '+q+' — not added again.', confirm:true, ok:'OK' }, function(){});
        return;
      }
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
  AMZN_MGMT.init(root);   // wire the Executives & Board CV modal (makeManagement)
  if(!root._rsCollapWired){ root._rsCollapWired=true;   // rule 3: the table dropdown under each chart
    root.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h'):null; if(!h||!root.contains(h)) return;
      var b=h.nextElementSibling; if(!b||!b.classList.contains('rs-collap-b')) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  requestAnimationFrame(aBuildTopline);   // Top Line is the initially-visible pane
}

export var amznOverview = { html: html, init: init, headerSources: ceHeaderSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
